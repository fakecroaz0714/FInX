/**
 * Model 2 — CSR Compliance Engine
 * 
 * Rules-based engine validating against:
 * - Companies Act Schedule VII CSR Categories
 * - Beneficiary count & targeted social groups
 * - Geographic location validity & project scope
 */

function evaluateCSRCompliance({ proposalData = {} }) {
    let score = 100;
    const findings = [];
    const explanations = [];

    const SCHEDULE_VII_CATEGORIES = [
        'RURAL_DEVELOPMENT',
        'CLEAN_WATER_SANITATION',
        'RENEWABLE_ENERGY',
        'EDUCATION_INFRASTRUCTURE',
        'HEALTHCARE_MEDICAL',
        'ENVIRONMENTAL_SUSTAINABILITY',
        'SLUM_DEVELOPMENT',
        'DISASTER_MANAGEMENT'
    ];

    const category = (proposalData.csrCategory || '').toUpperCase();
    const isStandardCategory = SCHEDULE_VII_CATEGORIES.includes(category);

    if (!isStandardCategory) {
        score -= 30;
        explanations.push(`CSR category '${proposalData.csrCategory}' is non-standard under Companies Act Schedule VII.`);
        findings.push({
            model: 'MODEL_2_CSR_COMPLIANCE',
            flagType: 'NON_SCHEDULE_VII_CATEGORY',
            severity: 'WARNING',
            details: `Category '${proposalData.csrCategory}' requires manual legal review against Schedule VII guidelines.`
        });
    } else {
        explanations.push(`CSR category '${category}' aligns directly with Schedule VII of the Companies Act.`);
    }

    const beneficiaries = Number(proposalData.beneficiaryCount || proposalData.beneficiaries || 0);
    if (beneficiaries <= 0) {
        score -= 25;
        explanations.push('Beneficiary count is unassigned or 0.');
        findings.push({
            model: 'MODEL_2_CSR_COMPLIANCE',
            flagType: 'ZERO_BENEFICIARIES',
            severity: 'CRITICAL',
            details: 'Proposal fails to define quantifiable community beneficiaries.'
        });
    } else {
        explanations.push(`Target beneficiary group verified (${beneficiaries.toLocaleString()} community members).`);
    }

    if (!proposalData.projectLocation || proposalData.projectLocation.length < 5) {
        score -= 20;
        explanations.push('Project location details are underspecified.');
        findings.push({
            model: 'MODEL_2_CSR_COMPLIANCE',
            flagType: 'UNDERSPECIFIED_LOCATION',
            severity: 'WARNING',
            details: 'Location must include specific village, panchayat, and district.'
        });
    }

    const finalScore = Math.max(0, Math.min(100, score));
    let status = 'PASS';
    if (finalScore < 70) status = 'FAIL';
    else if (finalScore < 85) status = 'REVIEW';

    return {
        csr_compliance_score: finalScore,
        status,
        explanation: explanations.join(' '),
        findings,
        categoryVerified: isStandardCategory,
        beneficiaryAlignment: beneficiaries > 0
    };
}

module.exports = {
    evaluateCSRCompliance
};
