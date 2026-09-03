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

app.listen(PORT, () => {
    console.log(`FINX Verified Milestone Funding Engine listening on port ${PORT}`);
});
