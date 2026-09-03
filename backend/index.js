const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
    calculateHaversineDistanceMeters,
    generateSHA256,
    evaluateEvidenceVerification
} = require('./services/verificationEngine');

const {
    VALID_STATES,
    validateTransition,
    validateMilestoneBudgetSum
} = require('./services/stateMachine');

const {
    runFullProposalVerification,
    evaluateCorporateGoalMatch
} = require('./services/proposalVerificationEngine');

const {
    runMultiModelVerification
} = require('./ai-verification-engine');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory Database Store (Mirrors Supabase Schema for instant local dev & demo)
const store = {
    projects: {
        'PROJ-CLEAN-WATER-PUNE': {
            id: 'PROJ-CLEAN-WATER-PUNE',
            title: 'Clean Water & Sanitation Initiative - Pune',
            location: 'Shirur Village, Pune District, Maharashtra',
            latitude: 18.5204,
            longitude: 73.8567,
            totalBudget: 4000000, // ₹40,00,000
            currency: '₹',
            ngoName: 'Jal Seva Foundation',
            ngoId: 'NGO-WATER-001',
            corporateName: 'TechCorp CSR Trust',
            corporateId: 'CORP-TECH-101',
            baselinePhotoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?q=80&w=800&auto=format&fit=crop',
            baselineCapturedAt: '2026-08-15T09:30:00Z',
            baselineInspector: 'Inspector R. Sharma (Senior Hydrologist)',
            allowedRadiusMeters: 100
        }
    },
    milestones: {
        'PROJ-CLEAN-WATER-PUNE': [
            {
                id: 'MS-001',
                projectId: 'PROJ-CLEAN-WATER-PUNE',
                milestoneNumber: 1,
                title: 'Milestone 1: Site Preparation & Excavation',
                description: 'Geotechnical survey, land clearing, trench excavation for water pipe laying.',
                percentage: 20,
                amount: 800000,
                status: 'ACTIVE',
                dueDate: '2026-09-15',
                previousPhotoUrl: null
            },
            {
                id: 'MS-002',
                projectId: 'PROJ-CLEAN-WATER-PUNE',
                milestoneNumber: 2,
                title: 'Milestone 2: Base Concrete & Pipeline Foundation',
                description: 'Laying base concrete bed, reinforced piping installation, pressure testing.',
                percentage: 25,
                amount: 1000000,
                status: 'LOCKED',
                dueDate: '2026-10-15',
                previousPhotoUrl: null
            },
            {
                id: 'MS-003',
                projectId: 'PROJ-CLEAN-WATER-PUNE',
                milestoneNumber: 3,
                title: 'Milestone 3: Filtration Tower Construction',
                description: 'Overhead tank structure construction, multi-stage filtration unit installation.',
                percentage: 35,
                amount: 1400000,
                status: 'LOCKED',
                dueDate: '2026-11-15',
                previousPhotoUrl: null
            },
            {
                id: 'MS-004',
                projectId: 'PROJ-CLEAN-WATER-PUNE',
                milestoneNumber: 4,
                title: 'Milestone 4: Finishing, Solar Pump & Final Commissioning',
                description: 'Solar pump wiring, distribution tap installation, water quality testing, hand-over.',
                percentage: 20,
                amount: 800000,
                status: 'LOCKED',
                dueDate: '2026-12-15',
                previousPhotoUrl: null
            }
        ]
    },
    evidence: {},       // key: milestoneId -> object
    verifications: {},  // key: milestoneId -> object
    fundReleases: [],   // list of transactions
    riskFlags: [],      // list of risk flag objects
    auditLogs: [],      // immutable audit trail
    hashes: new Set()   // set of stored SHA-256 hashes
};

// Helper: Add Audit Log
function logAudit(actor, action, projectId, milestoneId, metadata = {}) {
    const entry = {
        id: `AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        actor,
        action,
        projectId,
        milestoneId,
        metadata,
        timestamp: new Date().toISOString()
    };
    store.auditLogs.unshift(entry);
    return entry;
}

// Base Route
app.get('/', (req, res) => {
    res.json({ message: 'FINX Verified Milestone Funding Engine API', version: '2.0', status: 'ACTIVE' });
});

// GET /api/milestones/project/:id - Full Project Milestone Funding Control Data
app.get('/api/milestones/project/:id', (req, res) => {
    const projectId = req.params.id;
    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestones = store.milestones[project.id] || [];

    // Calculate Financial Summary
    const totalBudget = project.totalBudget;
    let releasedAmount = 0;
    milestones.forEach(m => {
        if (m.status === 'FUND_RELEASED' || m.status === 'COMPLETED') {
            releasedAmount += m.amount;
        }
    });

    const lockedAmount = totalBudget - releasedAmount;
    const currentMilestone = milestones.find(m => m.status === 'ACTIVE' || m.status === 'EVIDENCE_SUBMITTED' || m.status === 'HUMAN_REVIEW' || m.status === 'VERIFIED') || milestones[milestones.length - 1];

    // Find latest verification
    const latestVerification = currentMilestone ? store.verifications[currentMilestone.id] : null;
    const currentScore = latestVerification ? latestVerification.verificationScore : 92.5;

    // Determine Risk Level
    const projectFlags = store.riskFlags.filter(f => f.projectId === project.id && !f.resolved);
    let riskLevel = 'LOW';
    if (projectFlags.some(f => f.risk_level === 'CRITICAL')) riskLevel = 'CRITICAL';
    else if (projectFlags.some(f => f.risk_level === 'HIGH')) riskLevel = 'HIGH';
    else if (projectFlags.some(f => f.risk_level === 'MEDIUM')) riskLevel = 'MEDIUM';

    // Calculate total project progress %
    let totalProgress = 0;
    milestones.forEach(m => {
        if (m.status === 'FUND_RELEASED' || m.status === 'COMPLETED') {
            totalProgress += Number(m.percentage);
        } else if (m.status === 'VERIFIED') {
            totalProgress += Number(m.percentage) * 0.8;
        } else if (m.status === 'EVIDENCE_SUBMITTED' || m.status === 'HUMAN_REVIEW') {
            totalProgress += Number(m.percentage) * 0.5;
        }
    });

    res.json({
        success: true,
        project,
        summary: {
            totalBudget,
            releasedAmount,
            lockedAmount,
            remainingAmount: lockedAmount,
            currentMilestoneId: currentMilestone ? currentMilestone.id : null,
            currentMilestoneTitle: currentMilestone ? currentMilestone.title : 'All Milestones Completed',
            currentMilestoneStatus: currentMilestone ? currentMilestone.status : 'COMPLETED',
            verificationScore: currentScore,
            riskLevel,
            projectProgress: Math.min(100, Math.round(totalProgress))
        },
        milestones: milestones.map(m => ({
            ...m,
            evidence: store.evidence[m.id] || null,
            verification: store.verifications[m.id] || null,
            releaseTx: store.fundReleases.find(tx => tx.milestoneId === m.id) || null
        })),
        riskFlags: projectFlags,
        fundReleases: store.fundReleases.filter(tx => tx.projectId === project.id),
        auditTrail: store.auditLogs.filter(a => a.projectId === project.id).slice(0, 15)
    });
});

// POST /api/milestones/setup - Configure Milestone Schedule
app.post('/api/milestones/setup', (req, res) => {
    const { projectId, milestones } = req.body;
    const project = store.projects[projectId];

    if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    // Backend validation: SUM(milestone amounts) = project total budget
    const validation = validateMilestoneBudgetSum(milestones, project.totalBudget);
    if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
    }

    const formattedMilestones = milestones.map((m, idx) => ({
        id: m.id || `MS-${String(idx + 1).padStart(3, '0')}`,
        projectId,
        milestoneNumber: idx + 1,
        title: m.title || `Milestone ${idx + 1}`,
        description: m.description || '',
        percentage: Number(m.percentage),
        amount: Number(m.amount),
        status: idx === 0 ? 'ACTIVE' : 'LOCKED',
        dueDate: m.dueDate || null,
        previousPhotoUrl: null
    }));

    store.milestones[projectId] = formattedMilestones;
    logAudit('Corporate CSR Officer', 'Configured project milestones schedule', projectId, null, { count: milestones.length, total: project.totalBudget });

    res.json({
        success: true,
        message: 'Milestones successfully configured and validated.',
        milestones: formattedMilestones
    });
});

// POST /api/evidence/baseline - NGO Geotagged Baseline Photo
app.post('/api/evidence/baseline', (req, res) => {
    const { projectId, latitude, longitude, photoUrl, inspectorId, inspectorName } = req.body;
    const project = store.projects[projectId];

    if (!project) {
        return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    const imageHash = generateSHA256(photoUrl || `${latitude},${longitude},${Date.now()}`);
    store.hashes.add(imageHash);

    project.baselinePhotoUrl = photoUrl || project.baselinePhotoUrl;
    project.latitude = Number(latitude) || project.latitude;
    project.longitude = Number(longitude) || project.longitude;
    project.baselineCapturedAt = new Date().toISOString();
    project.baselineInspector = inspectorName || inspectorId || 'NGO Field Inspector';

    logAudit(project.baselineInspector, 'Captured Baseline Geotagged Evidence', projectId, null, { latitude, longitude, hash: imageHash });

    res.json({
        success: true,
        message: 'Baseline geotagged evidence recorded successfully.',
        project
    });
});

// POST /api/evidence/submit - Submit Milestone Evidence & Trigger Automated Verification Engine
app.post('/api/evidence/submit', async (req, res) => {
    const {
        projectId,
        milestoneId,
        latitude,
        longitude,
        claimedProgress,
        reportedExpenditure,
        workDescription,
        photoUrl,
        uploadedBy,
        isFraudDemo
    } = req.body;

    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestoneList = store.milestones[project.id] || [];
    const milestoneIndex = milestoneList.findIndex(m => m.id === milestoneId);
    const milestone = milestoneList[milestoneIndex];

    if (!milestone) {
        return res.status(404).json({ success: false, error: 'Milestone not found.' });
    }

    if (milestone.status !== 'ACTIVE' && milestone.status !== 'REVISION_REQUIRED' && !isFraudDemo) {
        return res.status(400).json({
            success: false,
            error: `Cannot submit evidence for milestone in '${milestone.status}' state. Milestone must be ACTIVE.`
        });
    }

    const imageHash = generateSHA256(photoUrl || `m-proof-${milestoneId}-${Date.now()}`);

    // Create Evidence Object
    const evidenceObj = {
        id: `EVID-${Date.now()}`,
        projectId: project.id,
        milestoneId: milestone.id,
        latitude: Number(latitude) || project.latitude,
        longitude: Number(longitude) || project.longitude,
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop',
        imageHash,
        claimedProgress: Number(claimedProgress) || 100,
        reportedExpenditure: Number(reportedExpenditure) || milestone.amount,
        workDescription: workDescription || 'Milestone physical execution completed.',
        uploadedBy: uploadedBy || 'NGO Inspector',
        uploadedAt: new Date().toISOString()
    };

    store.evidence[milestone.id] = evidenceObj;

    // Run Automated Verification Engine
    const verification = await evaluateEvidenceVerification({
        project,
        milestone,
        evidence: evidenceObj,
        existingHashes: Array.from(store.hashes),
        allowedRadiusMeters: project.allowedRadiusMeters,
        isFraudDemo
    });

    store.verifications[milestone.id] = verification;
    if (evidenceObj.imageHash) store.hashes.add(evidenceObj.imageHash);

    // Save Risk Flags to Store
    if (verification.riskFlags && verification.riskFlags.length > 0) {
        verification.riskFlags.forEach(rf => {
            store.riskFlags.push({
                id: `FLAG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                projectId: project.id,
                milestoneId: milestone.id,
                ...rf,
                resolved: false,
                createdAt: new Date().toISOString()
            });
        });
    }

    // Update Milestone Status via State Machine Logic
    milestone.status = verification.finalStatus;
    milestone.previousPhotoUrl = evidenceObj.photoUrl;

    logAudit(
        evidenceObj.uploadedBy,
        `Submitted Milestone Evidence & Evaluated (Score: ${verification.verificationScore}%, Status: ${verification.finalStatus})`,
        project.id,
        milestone.id,
        { score: verification.verificationScore, status: verification.finalStatus, flagsCount: verification.riskFlags.length }
    );

    res.json({
        success: true,
        message: `Milestone evidence submitted. Verification Score: ${verification.verificationScore}% (${verification.finalStatus})`,
        evidence: evidenceObj,
        verification,
        milestone
    });
});

// POST /api/milestones/approve - Corporate Human Approval / Review Action
app.post('/api/milestones/approve', (req, res) => {
    const { projectId, milestoneId, action, notes, corporateUser } = req.body;
    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestoneList = store.milestones[project.id] || [];
    const milestone = milestoneList.find(m => m.id === milestoneId);

    if (!milestone) {
        return res.status(404).json({ success: false, error: 'Milestone not found.' });
    }

    const reviewer = corporateUser || 'Corporate CSR Officer';

    if (action === 'APPROVE') {
        milestone.status = 'VERIFIED';
        logAudit(reviewer, 'Approved Milestone Verification (Human-in-the-Loop)', project.id, milestone.id, { notes });
    } else if (action === 'REVISION') {
        milestone.status = 'REVISION_REQUIRED';
        logAudit(reviewer, 'Requested Evidence Revision', project.id, milestone.id, { notes });
    } else if (action === 'FLAG') {
        milestone.status = 'FLAGGED';
        store.riskFlags.push({
            id: `FLAG-${Date.now()}`,
            projectId: project.id,
            milestoneId: milestone.id,
            flag_type: 'SUSPICIOUS_IMAGE',
            risk_level: 'HIGH',
            details: `Corporate Officer Flag: ${notes || 'Suspicious submission flagged for audit.'}`,
            resolved: false,
            createdAt: new Date().toISOString()
        });
        logAudit(reviewer, 'Flagged Milestone for Fraud Investigation', project.id, milestone.id, { notes });
    } else if (action === 'REJECT') {
        milestone.status = 'VERIFICATION_FAILED';
        logAudit(reviewer, 'Rejected Milestone Evidence', project.id, milestone.id, { notes });
    }

    res.json({
        success: true,
        message: `Corporate decision applied: ${action}`,
        milestone
    });
});

// POST /api/fund-release - Conditional Fund Release Engine
app.post('/api/fund-release', (req, res) => {
    const { projectId, milestoneId, authorizedBy } = req.body;
    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestoneList = store.milestones[project.id] || [];
    const milestoneIndex = milestoneList.findIndex(m => m.id === milestoneId);
    const milestone = milestoneList[milestoneIndex];

    if (!milestone) {
        return res.status(404).json({ success: false, error: 'Milestone not found.' });
    }

    // BUSINESS RULE: Fund release strictly requires VERIFIED status
    if (milestone.status !== 'VERIFIED') {
        return res.status(400).json({
            success: false,
            error: `FUNDING STATUS: LOCKED — WAITING FOR VERIFIED PROGRESS. Cannot release funds for milestone in '${milestone.status}' state.`
        });
    }

    // Previous milestone check
    if (milestoneIndex > 0) {
        const prevMilestone = milestoneList[milestoneIndex - 1];
        if (prevMilestone.status !== 'FUND_RELEASED' && prevMilestone.status !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: `Previous milestone ${prevMilestone.milestoneNumber} must be FUND_RELEASED before releasing current milestone.`
            });
        }
    }

    // Create Fund Release Transaction Record
    const txId = `TX-ESCROW-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const verification = store.verifications[milestone.id];
    const releaseTx = {
        id: `REL-${Date.now()}`,
        transactionId: txId,
        projectId: project.id,
        milestoneId: milestone.id,
        milestoneNumber: milestone.milestoneNumber,
        amount: milestone.amount,
        status: 'RELEASED',
        authorizedBy: authorizedBy || 'Corporate CSR Officer',
        verificationScore: verification ? verification.verificationScore : 92.5,
        releasedAt: new Date().toISOString()
    };

    store.fundReleases.push(releaseTx);
    milestone.status = 'FUND_RELEASED';

    // Unlock Next Milestone to ACTIVE
    let nextMilestoneUnlocked = null;
    if (milestoneIndex + 1 < milestoneList.length) {
        const nextMilestone = milestoneList[milestoneIndex + 1];
        nextMilestone.status = 'ACTIVE';
        nextMilestoneUnlocked = nextMilestone;
    } else {
        milestone.status = 'COMPLETED';
    }

    logAudit(
        releaseTx.authorizedBy,
        `Released Funds (₹${milestone.amount.toLocaleString()}) for Milestone ${milestone.milestoneNumber}`,
        project.id,
        milestone.id,
        { txId, amount: milestone.amount, nextUnlocked: nextMilestoneUnlocked ? nextMilestoneUnlocked.id : null }
    );

    res.json({
        success: true,
        message: 'MILESTONE VERIFIED — NEXT FUNDING STAGE UNLOCKED',
        releaseTx,
        currentMilestone: milestone,
        nextMilestoneUnlocked
    });
});

// POST /api/demo/fraud-scenario - Live Demo Fraud Simulation Endpoint
app.post('/api/demo/fraud-scenario', async (req, res) => {
    const { scenario } = req.body;
    const project = store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestones = store.milestones['PROJ-CLEAN-WATER-PUNE'];
    const currentActive = milestones.find(m => m.status === 'ACTIVE' || m.status === 'EVIDENCE_SUBMITTED' || m.status === 'HUMAN_REVIEW' || m.status === 'VERIFIED') || milestones[0];

    if (scenario === 'reset') {
        // Reset to initial state
        milestones.forEach((m, idx) => {
            m.status = idx === 0 ? 'ACTIVE' : 'LOCKED';
            m.previousPhotoUrl = null;
        });
        store.riskFlags = [];
        store.fundReleases = [];
        store.evidence = {};
        store.verifications = {};
        store.hashes.clear();
        logAudit('Demo Admin', 'Reset Demo Project State to Milestone 1 ACTIVE', project.id, null);
        return res.json({ success: true, message: 'Demo environment reset successfully.' });
    }

    let isFraudDemoType = null;
    let photoUrl = 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop';
    let lat = project.latitude;
    let lng = project.longitude;

    if (scenario === 'gps_mismatch') {
        isFraudDemoType = 'gps_mismatch';
        lat = 19.0760; // Mumbai coordinates (150+ km away from Pune project site)
        lng = 72.8777;
        photoUrl = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop';
    } else if (scenario === 'duplicate_image') {
        isFraudDemoType = 'duplicate_image';
        // Use a hash that already exists
        const dummyHash = 'a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890a1b2c3d4e5f67890';
        store.hashes.add(dummyHash);
        store.evidence[currentActive.id] = { imageHash: dummyHash };
    } else if (scenario === 'valid_verification') {
        isFraudDemoType = 'valid';
        lat = 18.5204;
        lng = 73.8567;
    }

    // Submit Evidence & Run Verification
    const submitReq = {
        body: {
            projectId: project.id,
            milestoneId: currentActive.id,
            latitude: lat,
            longitude: lng,
            claimedProgress: 100,
            reportedExpenditure: currentActive.amount,
            workDescription: scenario === 'gps_mismatch' ? 'Fake photo uploaded from off-site location.' : 'Site preparation and earthwork finished cleanly.',
            photoUrl,
            uploadedBy: 'Field Agent',
            isFraudDemo: isFraudDemoType
        }
    };

    // Execute logic internally
    const evidenceObj = {
        id: `EVID-DEMO-${Date.now()}`,
        projectId: project.id,
        milestoneId: currentActive.id,
        latitude: lat,
        longitude: lng,
        photoUrl,
        imageHash: generateSHA256(photoUrl),
        claimedProgress: 100,
        reportedExpenditure: currentActive.amount,
        workDescription: submitReq.body.workDescription,
        uploadedBy: 'Field Agent',
        uploadedAt: new Date().toISOString()
    };
    store.evidence[currentActive.id] = evidenceObj;

    const verification = await evaluateEvidenceVerification({
        project,
        milestone: currentActive,
        evidence: evidenceObj,
        existingHashes: Array.from(store.hashes),
        allowedRadiusMeters: project.allowedRadiusMeters,
        isFraudDemo: isFraudDemoType
    });

    store.verifications[currentActive.id] = verification;

    if (verification.riskFlags && verification.riskFlags.length > 0) {
        verification.riskFlags.forEach(rf => {
            store.riskFlags.unshift({
                id: `FLAG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                projectId: project.id,
                milestoneId: currentActive.id,
                ...rf,
                resolved: false,
                createdAt: new Date().toISOString()
            });
        });
    }

    currentActive.status = verification.finalStatus;

    logAudit('Fraud Demo Runner', `Simulated ${scenario.toUpperCase()} Demo Scenario`, project.id, currentActive.id, { score: verification.verificationScore });

    res.json({
        success: true,
        scenario,
        message: `Demo Scenario '${scenario}' executed. Final Status: ${verification.finalStatus}`,
        verification,
        milestone: currentActive
    });
});

// =========================================================================
// AI NGO PROPOSAL VERIFICATION ENGINE ENDPOINTS
// =========================================================================

// Proposal Data Store (Initial pre-seeded realistic dataset)
store.proposals = {
    'FINX-PR-00241': {
        id: 'FINX-PR-00241',
        proposalCode: 'FINX-PR-00241',
        ngoId: 'NGO-ABC-001',
        ngoName: 'ABC Foundation',
        projectName: 'Rural Road Development Project',
        projectDescription: 'Construction of 2.4 km paved rural access road connecting Shirur village to district market.',
        csrCategory: 'RURAL_DEVELOPMENT',
        projectLocation: 'Shirur Village, Pune District, Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
        beneficiaryCount: 4500,
        projectDurationMonths: 6,
        requestedAmount: 4000000, // ₹40,00,000
        submissionDate: '2026-08-20T10:00:00Z',
        status: 'AWAITING_VALIDATION',
        aiVerificationScore: 88,
        riskLevel: 'LOW RISK',
        aiRecommendation: 'RECOMMEND ACCEPTANCE (HUMAN VALIDATION REQUIRED)'
    },
    'FINX-PR-00109': {
        id: 'FINX-PR-00109',
        proposalCode: 'FINX-PR-00109',
        ngoId: 'NGO-WATER-001',
        ngoName: 'Jal Seva Foundation',
        projectName: 'Clean Drinking Water & Sanitation Initiative',
        projectDescription: 'Multi-stage filtration tower, pipeline network, and solar pump installation for 6,000 villagers.',
        csrCategory: 'CLEAN_WATER_SANITATION',
        projectLocation: 'Shirur Village, Pune District, Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
        beneficiaryCount: 6000,
        projectDurationMonths: 8,
        requestedAmount: 4000000,
        submissionDate: '2026-08-10T14:30:00Z',
        status: 'VALIDATOR_ACCEPTED',
        aiVerificationScore: 94,
        riskLevel: 'LOW RISK',
        aiRecommendation: 'RECOMMEND ACCEPTANCE (HUMAN VALIDATION REQUIRED)'
    },
    'FINX-PR-00305': {
        id: 'FINX-PR-00305',
        proposalCode: 'FINX-PR-00305',
        ngoId: 'NGO-GREEN-002',
        ngoName: 'Green Earth Org',
        projectName: 'Solar Microgrid & Lighting Initiative',
        projectDescription: 'Installing 45 solar streetlights and microgrid power for village primary school.',
        csrCategory: 'RENEWABLE_ENERGY',
        projectLocation: 'Haveli District, Maharashtra',
        latitude: 18.4500,
        longitude: 73.8000,
        beneficiaryCount: 2200,
        projectDurationMonths: 4,
        requestedAmount: 1500000,
        submissionDate: '2026-08-25T09:15:00Z',
        status: 'CHANGES_REQUESTED',
        aiVerificationScore: 72,
        riskLevel: 'MEDIUM RISK',
        aiRecommendation: 'HUMAN REVIEW REQUIRED'
    }
};

store.ngoProfiles = {
    'NGO-ABC-001': { name: 'ABC Foundation', registrationNumber: 'REG-MH-2018-9941', darpanId: 'MH/2018/0192841', tax80gCertified: true },
    'NGO-WATER-001': { name: 'Jal Seva Foundation', registrationNumber: 'REG-MH-2016-4412', darpanId: 'MH/2016/0081231', tax80gCertified: true },
    'NGO-GREEN-002': { name: 'Green Earth Org', registrationNumber: 'REG-MH-2020-1102', darpanId: 'MH/2020/0987123', tax80gCertified: true }
};

store.proposalDocs = {
    'FINX-PR-00241': [
        { documentType: 'REGISTRATION_CERTIFICATE', documentName: 'NGO_Registration_Certificate.pdf', fileUrl: 'https://example.com/docs/reg.pdf' },
        { documentType: 'NGO_PAN', documentName: 'NGO_PAN_Card.pdf', fileUrl: 'https://example.com/docs/pan.pdf' },
        { documentType: 'AUDITED_FINANCIALS', documentName: 'Audited_Financials_2025.pdf', fileUrl: 'https://example.com/docs/audit.pdf' }
    ]
};

store.proposalBudgets = {
    'FINX-PR-00241': [
        { category: 'Excavation', itemDescription: 'Road excavation & earthwork', quantity: 2, unitPrice: 500000, lineTotal: 1000000 },
        { category: 'Materials', itemDescription: 'Material supply (Tar & Gravel)', quantity: 500, unitPrice: 4000, lineTotal: 2000000 },
        { category: 'Labour', itemDescription: 'Labour & supervision', quantity: 6, unitPrice: 166666.67, lineTotal: 1000000 }
    ]
};

store.validatorReviews = {
    'FINX-PR-00109': {
        proposalId: 'FINX-PR-00109',
        validatorId: 'VAL-INSPECTOR-88',
        validatorName: 'Inspector R. Sharma (Senior Hydrologist)',
        decision: 'ACCEPT',
        comments: 'Verified NGO credentials, technical feasibility and beneficiary impact. Accepted for Corporate CSR matching.',
        aiScoreAtDecision: 94,
        decidedAt: '2026-08-18T11:00:00Z'
    }
};

store.corporateGoals = {
    'CORP-TECH-101': {
        corporateId: 'CORP-TECH-101',
        corporateName: 'TechCorp CSR Trust',
        preferredCategories: ['RURAL_DEVELOPMENT', 'CLEAN_WATER_SANITATION'],
        preferredLocations: ['Maharashtra', 'Tamil Nadu'],
        allocatedBudget: 50000000,
        availableBudget: 42000000
    }
};

store.proposalAuditLogs = [
    {
        auditId: 'AUDIT-PROP-001',
        proposalId: 'FINX-PR-00241',
        actorId: 'NGO-ABC-001',
        actorRole: 'NGO',
        action: 'PROPOSAL_SUBMITTED',
        oldStatus: 'DRAFT',
        newStatus: 'SUBMITTED',
        aiScore: null,
        timestamp: '2026-08-20T10:00:00Z'
    },
    {
        auditId: 'AUDIT-PROP-002',
        proposalId: 'FINX-PR-00241',
        actorId: 'AI-VERIFICATION-ENGINE',
        actorRole: 'SYSTEM_AI',
        action: 'AI_VERIFICATION_REPORT_GENERATED',
        oldStatus: 'SUBMITTED',
        newStatus: 'AWAITING_VALIDATION',
        aiScore: 88,
        timestamp: '2026-08-20T10:02:15Z'
    }
];

// Helper: Log Proposal Audit Event
function logProposalAudit(proposalId, actorId, actorRole, action, oldStatus, newStatus, aiScore = null, reason = '') {
    const entry = {
        auditId: `AUDIT-PROP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        proposalId,
        actorId,
        actorRole,
        action,
        oldStatus,
        newStatus,
        aiScore,
        reason,
        timestamp: new Date().toISOString()
    };
    store.proposalAuditLogs.unshift(entry);
    return entry;
}

// 1. GET /api/proposals - List all proposals with stats
app.get('/api/proposals', (req, res) => {
    const list = Object.values(store.proposals);
    const summary = {
        pendingAi: list.filter(p => p.status === 'SUBMITTED' || p.status === 'AI_VERIFYING').length,
        awaitingValidation: list.filter(p => p.status === 'AWAITING_VALIDATION').length,
        accepted: list.filter(p => p.status === 'VALIDATOR_ACCEPTED' || p.status === 'CORPORATE_MATCHED').length,
        changesRequested: list.filter(p => p.status === 'CHANGES_REQUESTED').length,
        rejected: list.filter(p => p.status === 'VALIDATOR_REJECTED').length,
        highRisk: list.filter(p => p.riskLevel === 'HIGH RISK' || p.riskLevel === 'CRITICAL REVIEW').length,
    };
    res.json({ success: true, summary, proposals: list });
});

// 2. GET /api/proposals/:id - Proposal Details
app.get('/api/proposals/:id', (req, res) => {
    const proposal = store.proposals[req.params.id];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const ngo = store.ngoProfiles[proposal.ngoId] || { name: proposal.ngoName, registrationNumber: 'REG-MH-2018-9941', darpanId: 'MH/2018/0192841', tax80gCertified: true };
    const docs = store.proposalDocs[proposal.id] || [];
    const budget = store.proposalBudgets[proposal.id] || [];
    const review = store.validatorReviews[proposal.id] || null;

    res.json({ success: true, proposal, ngo, docs, budget, review });
});

// 3. GET /api/proposals/:id/verification-report - Run or Return AI Verification Report
app.get('/api/proposals/:id/verification-report', (req, res) => {
    const proposal = store.proposals[req.params.id];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const ngo = store.ngoProfiles[proposal.ngoId] || { name: proposal.ngoName, registrationNumber: 'REG-MH-2018-9941', darpanId: 'MH/2018/0192841', tax80gCertified: true };
    const docs = store.proposalDocs[proposal.id] || [];
    const budget = store.proposalBudgets[proposal.id] || [];
    const existing = Object.values(store.proposals);
    const corpGoal = store.corporateGoals['CORP-TECH-101'];

    const report = runFullProposalVerification({
        proposalData: proposal,
        ngoData: ngo,
        uploadedDocuments: docs,
        budgetItems: budget,
        vendorQuotations: [],
        existingProposals: existing,
        corporateGoal: corpGoal
    });

    res.json({ success: true, report });
});

// 4. GET /api/validator/proposals - Proposals for Human Validator Dashboard
app.get('/api/validator/proposals', (req, res) => {
    const list = Object.values(store.proposals);
    res.json({ success: true, proposals: list });
});

// 5. POST /api/validator/proposals/:id/accept - Human Validator Accepts Proposal
app.post('/api/validator/proposals/:id/accept', (req, res) => {
    const proposal = store.proposals[req.params.id];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const { validatorId = 'VAL-INSPECTOR-88', validatorName = 'Inspector R. Sharma', comments = 'Proposal verified and accepted.' } = req.body;

    const oldStatus = proposal.status;
    proposal.status = 'VALIDATOR_ACCEPTED';

    store.validatorReviews[proposal.id] = {
        proposalId: proposal.id,
        validatorId,
        validatorName,
        decision: 'ACCEPT',
        comments,
        aiScoreAtDecision: proposal.aiVerificationScore,
        decidedAt: new Date().toISOString()
    };

    logProposalAudit(proposal.id, validatorId, 'VALIDATOR', 'VALIDATOR_ACCEPTED', oldStatus, 'VALIDATOR_ACCEPTED', proposal.aiVerificationScore, comments);

    res.json({
        success: true,
        message: 'Proposal ACCEPTED by validator. Now eligible for Corporate CSR Dashboard.',
        proposal,
        review: store.validatorReviews[proposal.id]
    });
});

// 6. POST /api/validator/proposals/:id/request-changes - Human Validator Requests Changes
app.post('/api/validator/proposals/:id/request-changes', (req, res) => {
    const proposal = store.proposals[req.params.id];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const { validatorId = 'VAL-INSPECTOR-88', validatorName = 'Inspector R. Sharma', comments } = req.body;
    if (!comments) return res.status(400).json({ success: false, error: 'Validator comments are required when requesting changes.' });

    const oldStatus = proposal.status;
    proposal.status = 'CHANGES_REQUESTED';

    store.validatorReviews[proposal.id] = {
        proposalId: proposal.id,
        validatorId,
        validatorName,
        decision: 'REQUEST_CHANGES',
        comments,
        aiScoreAtDecision: proposal.aiVerificationScore,
        decidedAt: new Date().toISOString()
    };

    logProposalAudit(proposal.id, validatorId, 'VALIDATOR', 'CHANGES_REQUESTED', oldStatus, 'CHANGES_REQUESTED', proposal.aiVerificationScore, comments);

    res.json({
        success: true,
        message: 'Proposal returned to NGO with Request for Changes.',
        proposal,
        review: store.validatorReviews[proposal.id]
    });
});

// 7. POST /api/validator/proposals/:id/reject - Human Validator Rejects Proposal
app.post('/api/validator/proposals/:id/reject', (req, res) => {
    const proposal = store.proposals[req.params.id];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    const { validatorId = 'VAL-INSPECTOR-88', validatorName = 'Inspector R. Sharma', comments } = req.body;
    if (!comments) return res.status(400).json({ success: false, error: 'Rejection reason is required.' });

    const oldStatus = proposal.status;
    proposal.status = 'VALIDATOR_REJECTED';

    store.validatorReviews[proposal.id] = {
        proposalId: proposal.id,
        validatorId,
        validatorName,
        decision: 'REJECT',
        comments,
        aiScoreAtDecision: proposal.aiVerificationScore,
        decidedAt: new Date().toISOString()
    };

    logProposalAudit(proposal.id, validatorId, 'VALIDATOR', 'VALIDATOR_REJECTED', oldStatus, 'VALIDATOR_REJECTED', proposal.aiVerificationScore, comments);

    res.json({
        success: true,
        message: 'Proposal REJECTED by validator. Excluded from Corporate CSR Dashboard.',
        proposal,
        review: store.validatorReviews[proposal.id]
    });
});

// 8. GET /api/corporate/eligible-proposals - ABSOLUTE SERVER-SIDE ELIGIBILITY ENFORCEMENT
// ONLY proposals where status === 'VALIDATOR_ACCEPTED' OR 'CORPORATE_MATCHED' are returned!
app.get('/api/corporate/eligible-proposals', (req, res) => {
    const allProposals = Object.values(store.proposals);
    const eligibleList = allProposals.filter(p => p.status === 'VALIDATOR_ACCEPTED' || p.status === 'CORPORATE_MATCHED');

    const corpGoal = store.corporateGoals['CORP-TECH-101'];

    // Append AI Corporate CSR Goal Match Score (Module G) for each accepted proposal
    const matchedList = eligibleList.map(p => {
        const match = evaluateCorporateGoalMatch(p, corpGoal);
        const review = store.validatorReviews[p.id];
        return {
            ...p,
            csrGoalMatchScore: match.score,
            matchReason: match.matchReason,
            validatorReview: review
        };
    });

    res.json({
        success: true,
        corporateGoal: corpGoal,
        count: matchedList.length,
        eligibleProposals: matchedList
    });
});

// 9. POST /api/corporate/match - Run Module G CSR Goal Match
app.post('/api/corporate/match', (req, res) => {
    const { proposalId, corporateId = 'CORP-TECH-101' } = req.body;
    const proposal = store.proposals[proposalId];
    if (!proposal) return res.status(404).json({ success: false, error: 'Proposal not found' });

    if (proposal.status !== 'VALIDATOR_ACCEPTED' && proposal.status !== 'CORPORATE_MATCHED') {
        return res.status(403).json({ success: false, error: 'Security Exception: Only Human Validator ACCEPTED proposals are eligible for Corporate CSR Matching.' });
    }

    const corpGoal = store.corporateGoals[corporateId] || store.corporateGoals['CORP-TECH-101'];
    const match = evaluateCorporateGoalMatch(proposal, corpGoal);

    proposal.status = 'CORPORATE_MATCHED';

    logProposalAudit(proposal.id, corporateId, 'CORPORATE', 'CORPORATE_MATCHED', 'VALIDATOR_ACCEPTED', 'CORPORATE_MATCHED', proposal.aiVerificationScore, `Matched to CSR Goals with score ${match.score}/100`);

    res.json({
        success: true,
        proposal,
        match
    });
});

// 10. GET /api/proposals/:id/audit - Immutable Audit Trail
app.get('/api/proposals/:id/audit', (req, res) => {
    const logs = store.proposalAuditLogs.filter(a => a.proposalId === req.params.id);
    res.json({ success: true, proposalId: req.params.id, auditTrail: logs });
});

// 11. POST /api/demo/proposal-scenario - Live 1-Click Interactive Demo Triggers
app.post('/api/demo/proposal-scenario', (req, res) => {
    const { scenario } = req.body;

    if (scenario === 'suspicious_proposal') {
        store.proposals['FINX-PR-00241'].requestedAmount = 4000000;
        store.proposals['FINX-PR-00241'].status = 'AWAITING_VALIDATION';
        store.proposals['FINX-PR-00241'].aiVerificationScore = 88;
        store.proposals['FINX-PR-00241'].riskLevel = 'MEDIUM RISK';
    } else if (scenario === 'valid_proposal') {
        store.proposals['FINX-PR-00241'].requestedAmount = 3500000;
        store.proposals['FINX-PR-00241'].status = 'VALIDATOR_ACCEPTED';
        store.proposals['FINX-PR-00241'].aiVerificationScore = 96;
        store.proposals['FINX-PR-00241'].riskLevel = 'LOW RISK';
    } else if (scenario === 'reset') {
        store.proposals['FINX-PR-00241'].requestedAmount = 4000000;
        store.proposals['FINX-PR-00241'].status = 'AWAITING_VALIDATION';
        store.proposals['FINX-PR-00241'].aiVerificationScore = 88;
        store.proposals['FINX-PR-00241'].riskLevel = 'LOW RISK';
    }

    res.json({
        success: true,
        scenario,
        message: `Demo Scenario '${scenario}' executed successfully.`,
        proposal: store.proposals['FINX-PR-00241']
    });
});

// =========================================================================
// STANDARD /api/finx/* ENDPOINTS (Section 21 Specification)
// =========================================================================

// POST /api/finx/projects/:id/ai-verify - Run Multi-Model Verification
app.post('/api/finx/projects/:id/ai-verify', (req, res) => {
    const projectId = req.params.id;
    const proposal = store.proposals[projectId] || store.proposals['FINX-PR-00241'];
    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const ngo = store.ngoProfiles[proposal ? proposal.ngoId : 'NGO-ABC-001'] || { name: 'ABC Foundation', registrationNumber: 'REG-MH-2018-9941', darpanId: 'MH/2018/0192841', tax80gCertified: true };
    const docs = store.proposalDocs[projectId] || store.proposalDocs['FINX-PR-00241'] || [];
    const budget = store.proposalBudgets[projectId] || store.proposalBudgets['FINX-PR-00241'] || [];

    const verification = runMultiModelVerification({
        proposalData: proposal || project,
        ngoData: ngo,
        uploadedDocs: docs,
        budgetItems: budget,
        existingProposals: Object.values(store.proposals),
        baselineData: project,
        isFraudDemo: req.body ? req.body.isFraudDemo : null
    });

    store.verifications[projectId] = verification;
    logAudit('FINX AI Verification Engine', `Executed Multi-Model Verification (Score: ${verification.overall_score}/100, Risk: ${verification.risk_level})`, projectId, null, { score: verification.overall_score });

    res.json({
        success: true,
        projectId,
        verification
    });
});

// GET /api/finx/projects/:id/verification - Fetch Latest Verification
app.get('/api/finx/projects/:id/verification', (req, res) => {
    const projectId = req.params.id;
    const verification = store.verifications[projectId] || null;
    res.json({ success: true, projectId, verification });
});

// GET /api/finx/projects/:id/verification/live - Live Real-Time Visualizer State
app.get('/api/finx/projects/:id/verification/live', (req, res) => {
    const projectId = req.params.id;
    res.json({
        success: true,
        projectId,
        stages: [
            { stage: 1, name: 'Model 1 — NGO / Document Verification', status: 'COMPLETED' },
            { stage: 2, name: 'Model 2 — CSR Compliance Engine', status: 'COMPLETED' },
            { stage: 3, name: 'Model 3 — Budget Intelligence', status: 'COMPLETED' },
            { stage: 4, name: 'Model 4 — Duplicate Project Detection', status: 'COMPLETED' },
            { stage: 5, name: 'Model 5 — Anomaly Detection', status: 'COMPLETED' },
            { stage: 6, name: 'Model 6 — Geolocation Verification', status: 'COMPLETED' },
            { stage: 7, name: 'Model 7 — Vision / Evidence Analysis', status: 'COMPLETED' },
            { stage: 8, name: 'Risk Aggregation & Decision Engine', status: 'COMPLETED' }
        ]
    });
});

// POST /api/finx/projects/:id/form1 - Save CSR Form 1
app.post('/api/finx/projects/:id/form1', (req, res) => {
    const projectId = req.params.id;
    const form1Data = req.body;
    store.csrForms = store.csrForms || {};
    store.csrForms[projectId] = { ...store.csrForms[projectId], form1: form1Data, submittedAt: new Date().toISOString() };

    logAudit('NGO Inspector', 'Created and Submitted CSR Form 1', projectId, null, form1Data);

    res.json({
        success: true,
        message: 'CSR Form 1 submitted successfully.',
        projectId,
        form1: form1Data
    });
});

// POST /api/finx/projects/:id/form2/approve - Corporate Form 2 Scope Approval
app.post('/api/finx/projects/:id/form2/approve', (req, res) => {
    const projectId = req.params.id;
    const { approvedBy = 'Corporate CSR Officer', notes = 'Project scope and objectives approved.' } = req.body;

    store.csrForms = store.csrForms || {};
    store.csrForms[projectId] = {
        ...store.csrForms[projectId],
        form2: { approved: true, approvedBy, notes, approvedAt: new Date().toISOString() }
    };

    logAudit(approvedBy, 'Approved Corporate CSR Form 2 (Scope & Objectives)', projectId, null, { notes });

    res.json({
        success: true,
        message: 'CSR Form 2 approved by Corporate.',
        projectId,
        form2: store.csrForms[projectId].form2
    });
});

// POST /api/finx/projects/:id/form3/authorize - Corporate Form 3 Funding Authorization
app.post('/api/finx/projects/:id/form3/authorize', (req, res) => {
    const projectId = req.params.id;
    const { authorizedBy = 'Corporate CSR Officer', notes = 'Milestone funding escrow authorized.' } = req.body;

    store.csrForms = store.csrForms || {};
    store.csrForms[projectId] = {
        ...store.csrForms[projectId],
        form3: { authorized: true, authorizedBy, notes, authorizedAt: new Date().toISOString() }
    };

    logAudit(authorizedBy, 'Authorized Corporate CSR Form 3 (Milestone Funding Escrow)', projectId, null, { notes });

    res.json({
        success: true,
        message: 'CSR Form 3 authorized by Corporate. Milestone funding enabled.',
        projectId,
        form3: store.csrForms[projectId].form3
    });
});

// POST /api/finx/projects/:id/milestones - Configure Milestones
app.post('/api/finx/projects/:id/milestones', (req, res) => {
    const projectId = req.params.id;
    const { milestones } = req.body;
    store.milestones[projectId] = milestones;
    logAudit('Corporate CSR Officer', 'Configured Project Milestones', projectId, null, { count: milestones ? milestones.length : 0 });
    res.json({ success: true, projectId, milestones });
});

// POST /api/finx/milestones/:id/activate - Activate Milestone
app.post('/api/finx/milestones/:id/activate', (req, res) => {
    const milestoneId = req.params.id;
    let found = null;
    Object.values(store.milestones).forEach(list => {
        const m = list.find(item => item.id === milestoneId);
        if (m) {
            m.status = 'ACTIVE';
            found = m;
        }
    });

    if (!found) return res.status(404).json({ success: false, error: 'Milestone not found' });

    logAudit('System Engine', `Activated Milestone ${found.milestoneNumber || milestoneId}`, found.projectId, found.id);
    res.json({ success: true, milestone: found });
});

// POST /api/finx/milestones/:id/evidence - Submit Geotagged Evidence
app.post('/api/finx/milestones/:id/evidence', (req, res) => {
    const milestoneId = req.params.id;
    const evidenceObj = {
        id: `EVID-${Date.now()}`,
        milestoneId,
        ...req.body,
        uploadedAt: new Date().toISOString()
    };
    store.evidence[milestoneId] = evidenceObj;
    logAudit(evidenceObj.uploadedBy || 'NGO Inspector', 'Submitted Geotagged Milestone Evidence', evidenceObj.projectId, milestoneId, evidenceObj);
    res.json({ success: true, evidence: evidenceObj });
});

// POST /api/finx/milestones/:id/verify - Run Milestone AI Verification
app.post('/api/finx/milestones/:id/verify', async (req, res) => {
    const milestoneId = req.params.id;
    const { isFraudDemo, projectId = 'PROJ-CLEAN-WATER-PUNE' } = req.body;
    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestones = store.milestones[project.id] || [];
    const milestone = milestones.find(m => m.id === milestoneId) || milestones[0];
    const evidence = store.evidence[milestoneId] || req.body.evidence || {
        latitude: req.body.latitude || project.latitude,
        longitude: req.body.longitude || project.longitude,
        photoUrl: req.body.photoUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?q=80&w=800&auto=format&fit=crop'
    };

    const verification = evaluateEvidenceVerification({
        project,
        milestone,
        evidence,
        existingHashes: Array.from(store.hashes),
        allowedRadiusMeters: project.allowedRadiusMeters,
        isFraudDemo
    });

    store.verifications[milestoneId] = verification;
    milestone.status = verification.finalStatus;

    logAudit('AI Multi-Model Engine', `Evaluated Milestone ${milestone.milestoneNumber || milestoneId} (Score: ${verification.verificationScore}%, Status: ${verification.finalStatus})`, project.id, milestoneId, { score: verification.verificationScore });

    res.json({
        success: true,
        verification,
        milestone
    });
});

// POST /api/finx/milestones/:id/approve - Human Approval Gate
app.post('/api/finx/milestones/:id/approve', (req, res) => {
    const milestoneId = req.params.id;
    const { action, notes, reviewer = 'Corporate CSR Officer' } = req.body;

    let milestone = null;
    let projId = null;
    Object.keys(store.milestones).forEach(pId => {
        const m = store.milestones[pId].find(item => item.id === milestoneId);
        if (m) {
            milestone = m;
            projId = pId;
        }
    });

    if (!milestone) return res.status(404).json({ success: false, error: 'Milestone not found' });

    if (action === 'APPROVE') milestone.status = 'VERIFIED';
    else if (action === 'REQUEST_CHANGES') milestone.status = 'REVISION_REQUIRED';
    else if (action === 'REJECT') milestone.status = 'VERIFICATION_FAILED';

    logAudit(reviewer, `Human Approval Gate Action: ${action}`, projId, milestoneId, { notes });

    res.json({ success: true, action, milestone });
});

// POST /api/finx/milestones/:id/release-fund - Internal Fund Release
app.post('/api/finx/milestones/:id/release-fund', (req, res) => {
    const milestoneId = req.params.id;
    const { authorizedBy = 'Corporate CSR Officer', projectId = 'PROJ-CLEAN-WATER-PUNE' } = req.body;

    const project = store.projects[projectId] || store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestones = store.milestones[project.id] || [];
    const milestoneIndex = milestones.findIndex(m => m.id === milestoneId);
    const milestone = milestones[milestoneIndex];

    if (!milestone) return res.status(404).json({ success: false, error: 'Milestone not found' });

    if (milestone.status !== 'VERIFIED') {
        return res.status(400).json({
            success: false,
            error: `FUNDING LOCKED — Milestone state is '${milestone.status}'. Human-approved VERIFIED status is required.`
        });
    }

    const txId = `TXN-ESCROW-${Date.now().toString().slice(-6)}`;
    const releaseTx = {
        id: `REL-${Date.now()}`,
        transactionId: txId,
        projectId: project.id,
        milestoneId: milestone.id,
        milestoneNumber: milestone.milestoneNumber,
        amount: milestone.amount,
        status: 'RELEASED',
        authorizedBy,
        releasedAt: new Date().toISOString()
    };

    store.fundReleases.push(releaseTx);
    milestone.status = 'FUND_RELEASED';

    let nextUnlocked = null;
    if (milestoneIndex + 1 < milestones.length) {
        nextUnlocked = milestones[milestoneIndex + 1];
        nextUnlocked.status = 'ACTIVE';
    } else {
        milestone.status = 'COMPLETED';
    }

    logAudit(authorizedBy, `Released Funds (₹${milestone.amount.toLocaleString()}) for Milestone ${milestone.milestoneNumber}`, project.id, milestone.id, { txId });

    res.json({
        success: true,
        message: `₹${milestone.amount.toLocaleString()} Milestone Fund Released`,
        releaseTx,
        currentMilestone: milestone,
        nextUnlocked
    });
});

// GET /api/finx/projects/:id/audit - Immutable Audit Trail
app.get('/api/finx/projects/:id/audit', (req, res) => {
    const projectId = req.params.id;
    const logs = store.auditLogs.filter(a => a.projectId === projectId);
    res.json({ success: true, projectId, auditTrail: logs });
});

// POST /api/finx/demo/reset - Reset Demo State
app.post('/api/finx/demo/reset', (req, res) => {
    const project = store.projects['PROJ-CLEAN-WATER-PUNE'];
    const milestones = store.milestones['PROJ-CLEAN-WATER-PUNE'] || [];

    milestones.forEach((m, idx) => {
        m.status = idx === 0 ? 'ACTIVE' : 'LOCKED';
        m.previousPhotoUrl = null;
    });

    store.riskFlags = [];
    store.fundReleases = [];
    store.evidence = {};
    store.verifications = {};
    store.hashes.clear();

    logAudit('Demo Admin', 'Reset FINX Hackathon Demo State to Initial Clean State', project ? project.id : 'PROJ-CLEAN-WATER-PUNE', null);

    res.json({
        success: true,
        message: 'FINX Hackathon Demo reset successfully to initial state.'
    });
});

app.listen(PORT, () => {
    console.log(`FINX Verified Milestone Funding Engine listening on port ${PORT}`);
});


