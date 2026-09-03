/**
 * Central Data Layer for the FINX NGO Validator Module.
 * Defines shared data models, initial realistic seed records,
 * and localStorage persistence helpers for NGOs and Audit Logs.
 */

export type NGOStatus =
    | 'PENDING_REVIEW'
    | 'DOCUMENTS_MISSING'
    | 'UNDER_VERIFICATION'
    | 'VERIFIED'
    | 'NEEDS_REVIEW'
    | 'HIGH_RISK'
    | 'REJECTED';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface DocumentItem {
    name: string;
    status: 'Valid' | 'Pending' | 'Expired' | 'Missing';
    uploadedAt?: string;
    fileSize?: string;
}

export interface RiskFactors {
    registrationCompliance: number; // weight 25%
    documentCompleteness: number;   // weight 20%
    financialTransparency: number;  // weight 20%
    operationalHistory: number;     // weight 15%
    previousCsrPerformance: number;// weight 10%
    geographicRisk: number;         // weight 10%
}

export interface NGOValidationRecord {
    id: string; // e.g. "NGO-1004"
    name: string;
    registrationType: 'Trust' | 'Society' | 'Section 8 Company';
    registrationNumber: string;
    state: string;
    district: string;
    location: string;
    pan: string;
    csr1: 'Valid' | 'Pending' | 'Missing';
    sec12a: 'Valid' | 'Pending' | 'Expired' | 'Missing';
    sec80g: 'Valid' | 'Pending' | 'Expired' | 'Missing';
    darpanId: string;
    website?: string;
    primaryFocusArea: string;
    beneficiariesReach: number;
    operationalHistoryYears: number;
    documentsCount: string; // e.g. "7/9 Documents"
    documents: DocumentItem[];
    score: number; // 0-100
    riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk';
    status: NGOStatus;
    priority: PriorityLevel;
    issue?: string;
    submittedAt: string;
    verifiedAt?: string;
    riskFactors: RiskFactors;
}

export interface AuditLogRecord {
    id: string; // e.g. "AUD-20481"
    timestamp: string;
    actor: string; // e.g. "Admin / Reviewer"
    ngoId: string;
    ngoName: string;
    action: string;
    previousStatus: string;
    newStatus: string;
    reason: string;
    referenceId: string;
}

export const INITIAL_MOCK_NGOS: NGOValidationRecord[] = [
    {
        id: "NGO-1004",
        name: "Jal Seva NGO",
        registrationType: "Trust",
        registrationNumber: "TR-2015-893",
        state: "Maharashtra",
        district: "Pune",
        location: "Pune, Maharashtra",
        pan: "AAATJ9999K",
        csr1: "Valid",
        sec12a: "Valid",
        sec80g: "Valid",
        darpanId: "MH/2015/009142",
        website: "https://jalseva.org",
        primaryFocusArea: "Water & Sanitation",
        beneficiariesReach: 45000,
        operationalHistoryYears: 9,
        documentsCount: "9/9 Documents",
        documents: [
            { name: "Trust Deed Registration", status: "Valid", uploadedAt: "2026-08-10" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-08-10" },
            { name: "CSR-1 Registration Certificate", status: "Valid", uploadedAt: "2026-08-12" },
            { name: "12A Tax Exemption Order", status: "Valid", uploadedAt: "2026-08-12" },
            { name: "80G Certificate", status: "Valid", uploadedAt: "2026-08-12" },
            { name: "NITI Aayog NGO Darpan Registration", status: "Valid", uploadedAt: "2026-08-14" },
            { name: "Past 3 Years Audited Balance Sheets", status: "Valid", uploadedAt: "2026-08-15" },
            { name: "Annual Impact Report FY25", status: "Valid", uploadedAt: "2026-08-15" },
            { name: "Authorized Signatory KYC & Bank Mandate", status: "Valid", uploadedAt: "2026-08-15" }
        ],
        score: 94,
        riskLevel: "Low Risk",
        status: "VERIFIED",
        priority: "Low",
        issue: "None. Full compliance verified.",
        submittedAt: "Aug 15, 2026",
        verifiedAt: "Aug 20, 2026",
        riskFactors: {
            registrationCompliance: 98,
            documentCompleteness: 100,
            financialTransparency: 95,
            operationalHistory: 92,
            previousCsrPerformance: 94,
            geographicRisk: 86
        }
    },
    {
        id: "NGO-1082",
        name: "Green Earth Foundation",
        registrationType: "Section 8 Company",
        registrationNumber: "U85300MH2020NPL348231",
        state: "Maharashtra",
        district: "Nagpur",
        location: "Nagpur, Maharashtra",
        pan: "ABCDE1234F",
        csr1: "Valid",
        sec12a: "Pending",
        sec80g: "Valid",
        darpanId: "MH/2020/018342",
        website: "https://greenearth.org.in",
        primaryFocusArea: "Environment & Solar",
        beneficiariesReach: 28000,
        operationalHistoryYears: 4,
        documentsCount: "7/9 Documents",
        documents: [
            { name: "MoA & AoA Certificate of Incorporation", status: "Valid", uploadedAt: "2026-08-28" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-08-28" },
            { name: "CSR-1 Certificate", status: "Valid", uploadedAt: "2026-08-30" },
            { name: "12A Tax Exemption Order", status: "Pending", uploadedAt: "2026-08-30" },
            { name: "80G Certificate", status: "Valid", uploadedAt: "2026-08-30" },
            { name: "NGO Darpan ID Proof", status: "Valid", uploadedAt: "2026-09-01" },
            { name: "Bank Verification Letter", status: "Valid", uploadedAt: "2026-09-01" },
            { name: "FY24 Financial Audit Report", status: "Pending" },
            { name: "Board Resolution for CSR Execution", status: "Pending" }
        ],
        score: 68,
        riskLevel: "Medium Risk",
        status: "NEEDS_REVIEW",
        priority: "Medium",
        issue: "12A renewal pending verification with Income Tax portal",
        submittedAt: "Sep 02, 2026",
        riskFactors: {
            registrationCompliance: 80,
            documentCompleteness: 75,
            financialTransparency: 62,
            operationalHistory: 65,
            previousCsrPerformance: 70,
            geographicRisk: 72
        }
    },
    {
        id: "NGO-1105",
        name: "Urban Health Initiative",
        registrationType: "Society",
        registrationNumber: "MH-12345/2019",
        state: "Maharashtra",
        district: "Mumbai",
        location: "Mumbai, Maharashtra",
        pan: "BXYZP5678H",
        csr1: "Missing",
        sec12a: "Expired",
        sec80g: "Expired",
        darpanId: "MH/2019/022410",
        website: "https://urbanhealth.org",
        primaryFocusArea: "Healthcare",
        beneficiariesReach: 8500,
        operationalHistoryYears: 5,
        documentsCount: "3/9 Documents",
        documents: [
            { name: "Society Registration Certificate", status: "Valid", uploadedAt: "2026-08-10" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-08-10" },
            { name: "CSR-1 Registration", status: "Missing" },
            { name: "12A Tax Certificate", status: "Expired" },
            { name: "80G Exemption", status: "Expired" },
            { name: "NGO Darpan Certificate", status: "Pending" }
        ],
        score: 22,
        riskLevel: "High Risk",
        status: "HIGH_RISK",
        priority: "High",
        issue: "Expired 12A/80G certificates & missing CSR-1 filing",
        submittedAt: "Aug 29, 2026",
        riskFactors: {
            registrationCompliance: 35,
            documentCompleteness: 20,
            financialTransparency: 18,
            operationalHistory: 45,
            previousCsrPerformance: 12,
            geographicRisk: 40
        }
    },
    {
        id: "NGO-1140",
        name: "Gramin Vikas Sanstha",
        registrationType: "Trust",
        registrationNumber: "TR-2018-442",
        state: "Maharashtra",
        district: "Nashik",
        location: "Nashik, Maharashtra",
        pan: "GVSMH5566J",
        csr1: "Valid",
        sec12a: "Valid",
        sec80g: "Valid",
        darpanId: "MH/2018/014902",
        website: "https://graminvikas.org",
        primaryFocusArea: "Rural Livelihood & Agriculture",
        beneficiariesReach: 32000,
        operationalHistoryYears: 6,
        documentsCount: "8/9 Documents",
        documents: [
            { name: "Trust Deed", status: "Valid", uploadedAt: "2026-09-01" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-09-01" },
            { name: "CSR-1 Certificate", status: "Valid", uploadedAt: "2026-09-01" },
            { name: "12A Registration", status: "Valid", uploadedAt: "2026-09-02" },
            { name: "80G Registration", status: "Valid", uploadedAt: "2026-09-02" },
            { name: "NGO Darpan ID", status: "Valid", uploadedAt: "2026-09-02" },
            { name: "Audited Financials FY25", status: "Valid", uploadedAt: "2026-09-03" },
            { name: "Bank Verification", status: "Pending" }
        ],
        score: 78,
        riskLevel: "Medium Risk",
        status: "PENDING_REVIEW",
        priority: "High",
        issue: "Awaiting final validator bank verification sign-off",
        submittedAt: "Sep 03, 2026",
        riskFactors: {
            registrationCompliance: 88,
            documentCompleteness: 85,
            financialTransparency: 76,
            operationalHistory: 75,
            previousCsrPerformance: 80,
            geographicRisk: 78
        }
    },
    {
        id: "NGO-1215",
        name: "Pratham Shiksha Trust",
        registrationType: "Trust",
        registrationNumber: "TR-2021-912",
        state: "Maharashtra",
        district: "Chhatrapati Sambhajinagar",
        location: "Chhatrapati Sambhajinagar, Maharashtra",
        pan: "PSTTR7788K",
        csr1: "Pending",
        sec12a: "Valid",
        sec80g: "Pending",
        darpanId: "MH/2021/030112",
        primaryFocusArea: "Education & Girl Child",
        beneficiariesReach: 14000,
        operationalHistoryYears: 3,
        documentsCount: "5/9 Documents",
        documents: [
            { name: "Trust Deed", status: "Valid", uploadedAt: "2026-08-25" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-08-25" },
            { name: "12A Certificate", status: "Valid", uploadedAt: "2026-08-26" },
            { name: "CSR-1 Acknowledgment", status: "Pending" },
            { name: "80G Application", status: "Pending" },
            { name: "Audited Financials", status: "Missing" }
        ],
        score: 54,
        riskLevel: "Medium Risk",
        status: "DOCUMENTS_MISSING",
        priority: "Medium",
        issue: "Missing Audited Financial Statements and CSR-1 approval",
        submittedAt: "Aug 26, 2026",
        riskFactors: {
            registrationCompliance: 65,
            documentCompleteness: 48,
            financialTransparency: 42,
            operationalHistory: 50,
            previousCsrPerformance: 60,
            geographicRisk: 68
        }
    },
    {
        id: "NGO-1302",
        name: "Clean River Alliance",
        registrationType: "Society",
        registrationNumber: "MH-99881/2017",
        state: "Maharashtra",
        district: "Satara",
        location: "Satara, Maharashtra",
        pan: "CRASH2233M",
        csr1: "Valid",
        sec12a: "Valid",
        sec80g: "Valid",
        darpanId: "MH/2017/005519",
        primaryFocusArea: "River Rejuvenation & Ecology",
        beneficiariesReach: 52000,
        operationalHistoryYears: 7,
        documentsCount: "9/9 Documents",
        documents: [
            { name: "Society Certificate", status: "Valid", uploadedAt: "2026-08-18" },
            { name: "PAN Card", status: "Valid", uploadedAt: "2026-08-18" },
            { name: "CSR-1 Certificate", status: "Valid", uploadedAt: "2026-08-18" },
            { name: "12A Certificate", status: "Valid", uploadedAt: "2026-08-19" },
            { name: "80G Certificate", status: "Valid", uploadedAt: "2026-08-19" },
            { name: "NGO Darpan ID", status: "Valid", uploadedAt: "2026-08-20" },
            { name: "Satellite GPS Boundary Coordinates", status: "Valid", uploadedAt: "2026-08-22" }
        ],
        score: 88,
        riskLevel: "Low Risk",
        status: "UNDER_VERIFICATION",
        priority: "High",
        issue: "Satellite site verification underway by remote GIS analyst",
        submittedAt: "Aug 22, 2026",
        riskFactors: {
            registrationCompliance: 92,
            documentCompleteness: 95,
            financialTransparency: 84,
            operationalHistory: 86,
            previousCsrPerformance: 88,
            geographicRisk: 82
        }
    }
];

export const INITIAL_MOCK_AUDIT_LOGS: AuditLogRecord[] = [
    {
        id: "AUD-20481",
        timestamp: "Sep 03, 2026 10:42 AM",
        actor: "Admin / Reviewer",
        ngoId: "NGO-1004",
        ngoName: "Jal Seva NGO",
        action: "Verify NGO",
        previousStatus: "Needs Review",
        newStatus: "Verified",
        reason: "All 9 compliance documents validated; 12A/80G and CSR-1 verified via MCA and NITI Aayog portal.",
        referenceId: "MCA-2026-0914"
    },
    {
        id: "AUD-20480",
        timestamp: "Sep 03, 2026 09:15 AM",
        actor: "Admin / Reviewer",
        ngoId: "NGO-1105",
        ngoName: "Urban Health Initiative",
        action: "Flag High Risk",
        previousStatus: "Needs Review",
        newStatus: "High Risk",
        reason: "Expired 12A and 80G certificates. Missing CSR-1 registration mandatory under Companies Act Sec 135.",
        referenceId: "FLG-88192"
    },
    {
        id: "AUD-20479",
        timestamp: "Sep 02, 2026 04:30 PM",
        actor: "Field Validator (Pune)",
        ngoId: "NGO-1082",
        ngoName: "Green Earth Foundation",
        action: "Document Review",
        previousStatus: "Pending Review",
        newStatus: "Needs Review",
        reason: "Registration MoA confirmed; 12A renewal receipt submitted but pending formal IT Dept order.",
        referenceId: "DOC-55102"
    },
    {
        id: "AUD-20478",
        timestamp: "Sep 02, 2026 01:10 PM",
        actor: "Admin / Reviewer",
        ngoId: "NGO-1215",
        ngoName: "Pratham Shiksha Trust",
        action: "Request Documents",
        previousStatus: "Pending Review",
        newStatus: "Documents Missing",
        reason: "Requested FY25 Audited Balance Sheet and Form 10AC copy from applicant.",
        referenceId: "REQ-33104"
    }
];

const STORAGE_KEY_NGOS = 'finx_validator_ngos';
const STORAGE_KEY_LOGS = 'finx_validator_audit_logs';

/**
 * Loads stored NGOs or seeds with initial mock data.
 */
export function loadStoredNGOs(): NGOValidationRecord[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_NGOS;
    try {
        const stored = localStorage.getItem(STORAGE_KEY_NGOS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Error loading stored NGOs:', e);
    }
    // Seed initial
    try {
        localStorage.setItem(STORAGE_KEY_NGOS, JSON.stringify(INITIAL_MOCK_NGOS));
    } catch (e) {}
    return INITIAL_MOCK_NGOS;
}

/**
 * Persists updated NGOs array to localStorage.
 */
export function saveStoredNGOs(ngos: NGOValidationRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY_NGOS, JSON.stringify(ngos));
    } catch (e) {
        console.error('Error saving NGOs:', e);
    }
}

/**
 * Loads stored audit logs or seeds with initial mock logs.
 */
export function loadStoredAuditLogs(): AuditLogRecord[] {
    if (typeof window === 'undefined') return INITIAL_MOCK_AUDIT_LOGS;
    try {
        const stored = localStorage.getItem(STORAGE_KEY_LOGS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error('Error loading audit logs:', e);
    }
    // Seed initial
    try {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_MOCK_AUDIT_LOGS));
    } catch (e) {}
    return INITIAL_MOCK_AUDIT_LOGS;
}

/**
 * Persists updated audit logs array to localStorage.
 */
export function saveStoredAuditLogs(logs: AuditLogRecord[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
    } catch (e) {
        console.error('Error saving audit logs:', e);
    }
}

/**
 * Helper to generate a new audit log record.
 */
export function createAuditEntry(
    ngoId: string,
    ngoName: string,
    action: string,
    previousStatus: string,
    newStatus: string,
    reason: string,
    actor = 'Admin / Reviewer'
): AuditLogRecord {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const dateStr = new Date().toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return {
        id: `AUD-${randomNum}`,
        timestamp: dateStr,
        actor,
        ngoId,
        ngoName,
        action,
        previousStatus,
        newStatus,
        reason,
        referenceId: `REF-${Math.floor(1000 + Math.random() * 9000)}`
    };
}
