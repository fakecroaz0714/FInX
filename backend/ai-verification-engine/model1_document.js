const crypto = require('crypto');

/**
 * Model 1 — NGO / Document Verification
 * 
 * Performs:
 * - NGO registration & 80G tax certification verification
 * - Required document checks & document classification
 * - Missing field & date validation
 * - Cross-document consistency checks (Quotation vs Requested Budget)
 * - SHA-256 hash generation for files
 */

function generateSHA256(content) {
    if (!content) return '';
    return crypto.createHash('sha256').update(String(content)).digest('hex');
}

function evaluateDocumentVerification({ ngoData = {}, proposalData = {}, uploadedDocs = [], vendorQuotations = [] }) {
    let score = 100;
    const findings = [];
    const missingDocuments = [];
    const inconsistencies = [];

    // 1. NGO Credentials Verification
    if (!ngoData.registrationNumber) {
        score -= 25;
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_REGISTRATION',
            severity: 'CRITICAL',
            details: 'NGO Registration Certificate / Registration Number is missing.'
        });
    }

    if (!ngoData.darpanId) {
        score -= 10;
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_DARPAN',
            severity: 'WARNING',
            details: 'NITI Aayog DARPAN ID is missing.'
        });
    }

    if (!ngoData.tax80gCertified) {
        score -= 15;
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_80G',
            severity: 'WARNING',
            details: '80G Tax Exemption certification not verified.'
        });
    }

    // 2. Required Document Classification & Presence
    const docTypes = (uploadedDocs || []).map(d => (d.documentType || '').toUpperCase());
    const hasRegCert = docTypes.includes('REGISTRATION_CERTIFICATE') || docTypes.includes('NGO_REGISTRATION');
    const hasPAN = docTypes.includes('NGO_PAN') || docTypes.includes('PAN_CARD');
    const hasAuditReport = docTypes.includes('AUDITED_FINANCIALS') || docTypes.includes('FINANCIAL_AUDIT');
    const hasQuotation = docTypes.includes('VENDOR_QUOTATION') || (vendorQuotations && vendorQuotations.length > 0);

    if (!hasRegCert) {
        score -= 20;
        missingDocuments.push('NGO Registration Certificate');
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_REQUIRED_DOCUMENT',
            severity: 'CRITICAL',
            details: 'Required NGO Registration Certificate document missing.'
        });
    }

    if (!hasPAN) {
        score -= 10;
        missingDocuments.push('NGO PAN Card');
    }

    if (!hasAuditReport) {
        score -= 15;
        missingDocuments.push('Audited Financial Statements (Last 3 Years)');
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_AUDIT_REPORT',
            severity: 'WARNING',
            details: 'Audited financial statements for recent fiscal years are missing.'
        });
    }

    if (!hasQuotation) {
        score -= 15;
        missingDocuments.push('Official Vendor Quotation');
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'MISSING_VENDOR_QUOTATION',
            severity: 'WARNING',
            details: 'No official vendor quotation attached to validate requested budget.'
        });
    }

    // 3. Cross-Document Consistency Check
    const requestedAmount = Number(proposalData.requestedAmount || 0);
    const quotationTotal = (vendorQuotations || []).reduce((sum, q) => sum + Number(q.totalAmount || q.amount || 0), 0);

    if (quotationTotal > 0 && Math.abs(requestedAmount - quotationTotal) > (requestedAmount * 0.03)) {
        score -= 20;
        const variancePct = (((requestedAmount - quotationTotal) / quotationTotal) * 100).toFixed(1);
        inconsistencies.push({
            type: 'BUDGET_QUOTATION_DISCREPANCY',
            details: `Requested project budget (₹${requestedAmount.toLocaleString()}) differs from official vendor quotation total (₹${quotationTotal.toLocaleString()}) by ${variancePct}%.`
        });
        findings.push({
            model: 'MODEL_1_DOCUMENT',
            flagType: 'QUOTATION_MISMATCH',
            severity: 'WARNING',
            details: `Quotation total (₹${quotationTotal.toLocaleString()}) does not match requested budget (₹${requestedAmount.toLocaleString()}).`
        });
    }

    // 4. Generate SHA-256 Hashes for Documents
    const documentHashes = (uploadedDocs || []).map(doc => ({
        documentName: doc.documentName || doc.name || 'document.pdf',
        documentType: doc.documentType || 'GENERIC',
        sha256Hash: generateSHA256(doc.fileUrl || doc.content || doc.documentName || Date.now())
    }));

    const finalScore = Math.max(0, Math.min(100, score));
    const confidence = Number((90 + (uploadedDocs.length * 2) - (findings.length * 2.5)).toFixed(1));

    return {
        score: finalScore,
        confidence: Math.max(50, Math.min(99, confidence)),
        findings,
        missing_documents: missingDocuments,
        inconsistencies,
        documentHashes,
        disclaimer: 'This document analysis does not guarantee legal authenticity without authoritative government database verification.'
    };
}

module.exports = {
    evaluateDocumentVerification,
    generateSHA256
};
