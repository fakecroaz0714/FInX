const { runFullProposalVerification } = require('./services/proposalVerificationEngine');

console.log('====================================================');
console.log(' TESTING FINX AI NGO PROPOSAL VERIFICATION ENGINE ');
console.log('====================================================\n');

// Sample Test Data 1: Suspicious / Medium Risk Rural Road Development Proposal
const proposalData = {
    proposalCode: 'FINX-PR-00241',
    ngoName: 'ABC Foundation',
    projectName: 'Rural Road Development',
    csrCategory: 'RURAL_DEVELOPMENT',
    projectLocation: 'Shirur Village, Pune District, Maharashtra',
    latitude: 18.5204,
    longitude: 73.8567,
    beneficiaryCount: 4500,
    projectDurationMonths: 6,
    requestedAmount: 4000000 // ₹40,00,000
};

const ngoData = {
    name: 'ABC Foundation',
    registrationNumber: 'REG-MH-2018-9941',
    darpanId: 'MH/2018/0192841',
    tax80gCertified: true
};

const uploadedDocuments = [
    { documentType: 'REGISTRATION_CERTIFICATE', documentName: 'NGO_Reg_Certificate.pdf' },
    { documentType: 'NGO_PAN', documentName: 'PAN_Card.pdf' },
    { documentType: 'AUDITED_FINANCIALS', documentName: 'Audit_2025.pdf' }
];

const budgetItems = [
    { itemDescription: 'Road excavation & earthwork', quantity: 2, unitPrice: 500000, lineTotal: 1000000 },
    { itemDescription: 'Material supply (Tar & Gravel)', quantity: 500, unitPrice: 4000, lineTotal: 2000000 }, // 500 tonnes vs expected 320 tonnes
    { itemDescription: 'Labour & supervision', quantity: 6, unitPrice: 166666.67, lineTotal: 1000000 }
];

const vendorQuotations = []; // Missing vendor quotation

const existingProposals = [
    {
        proposalCode: 'FINX-1042',
        projectName: 'Village Road & Infrastructure Development',
        latitude: 18.5210,
        longitude: 73.8570
    }
];

const corporateGoal = {
    corporateId: 'CORP-TECH-101',
    corporateName: 'TechCorp CSR Trust',
    preferredCategories: ['RURAL_DEVELOPMENT', 'CLEAN_WATER_SANITATION'],
    preferredLocations: ['Maharashtra', 'Tamil Nadu'],
    availableBudget: 50000000
};

const report = runFullProposalVerification({
    proposalData,
    ngoData,
    uploadedDocuments,
    budgetItems,
    vendorQuotations,
    existingProposals,
    corporateGoal
});

console.log('📌 FINX AI VERIFICATION REPORT RESULT:');
console.log('----------------------------------------------------');
console.log(`Proposal ID:             ${report.proposalId}`);
console.log(`NGO Name:                ${report.ngoName}`);
console.log(`Project Name:            ${report.projectName}`);
console.log(`Requested Amount:        ₹${report.requestedAmount.toLocaleString()}`);
console.log(`AI Verification Score:   ${report.overallScore}/100`);
console.log(`Risk Level:              ${report.riskLevel}`);
console.log(`AI Recommendation:       ${report.aiRecommendation}`);

console.log('\n📊 MODULE SCORES:');
console.log(`- NGO Eligibility:       ${report.moduleScores.ngoEligibility}/100`);
console.log(`- Document Quality:      ${report.moduleScores.documentVerification}/100`);
console.log(`- CSR Compliance:        ${report.moduleScores.csrCompliance}/100`);
console.log(`- Budget Consistency:    ${report.moduleScores.budgetConsistency}/100`);
console.log(`- Quantity Consistency:  ${report.moduleScores.quantityConsistency}/100`);
console.log(`- Duplicate Detection:   ${report.moduleScores.duplicateDetection}/100`);
console.log(`- Project Evidence:      ${report.moduleScores.projectEvidence}/100`);

console.log('\n⚠️ DETECTED FINDINGS:');
report.findings.forEach(f => {
    console.log(`- [${f.severity}] (${f.module}) ${f.text}`);
});

console.log('\n🏢 CORPORATE CSR MATCH SCORE:');
console.log(`- Match Score:           ${report.corporateMatch.score}/100`);
console.log(`- Reason:                ${report.corporateMatch.matchReason}`);

console.log('\n🔒 SAFETY DISCLAIMER:');
console.log(`"${report.disclaimer}"`);
console.log('====================================================\n');
