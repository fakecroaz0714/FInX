/**
 * FINX MULTI-MODEL CSR VERIFICATION ENGINE
 * 
 * Main Pipeline Orchestrator exporting all individual models (1 to 7)
 * and risk aggregation utilities.
 */

const { evaluateDocumentVerification, generateSHA256 } = require('./model1_document');
const { evaluateCSRCompliance } = require('./model2_csr_compliance');
const { evaluateBudgetIntelligence } = require('./model3_budget');
const { evaluateDuplicateDetection } = require('./model4_duplicate');
const { evaluateAnomalyDetection } = require('./model5_anomaly');
const { evaluateVisionVerification } = require('./model6_vision');
const { evaluateGeolocationVerification, calculateHaversineDistanceMeters } = require('./model7_geolocation');
const { aggregateMultiModelRisk } = require('./risk_aggregator');

/**
 * Runs complete Multi-Model CSR Proposal / Evidence Verification
 */
function runMultiModelVerification({
    proposalData = {},
    ngoData = {},
    uploadedDocs = [],
    budgetItems = [],
    vendorQuotations = [],
    existingProposals = [],
    evidenceData = {},
    baselineData = {},
    milestoneData = {},
    existingHashes = [],
    isFraudDemo = null,
    customWeights = {}
}) {
    // Model 1: NGO / Document Verification
    const model1Doc = evaluateDocumentVerification({ ngoData, proposalData, uploadedDocs, vendorQuotations });

    // Model 2: CSR Compliance Engine
    const model2Csr = evaluateCSRCompliance({ proposalData });

    // Model 3: Budget Intelligence
    const model3Budget = evaluateBudgetIntelligence({ proposalData, budgetItems });

    // Model 4: Duplicate Project Detection
    const model4Duplicate = evaluateDuplicateDetection({ proposalData, existingProposals });

    // Model 5: Anomaly Detection
    const model5Anomaly = evaluateAnomalyDetection({ proposalData, budgetItems });

    // Model 6: Vision / Image Verification
    const model6Vision = evaluateVisionVerification({
        photoUrl: evidenceData.photoUrl || evidenceData.photoData || proposalData.baselinePhotoUrl,
        baselinePhotoUrl: baselineData.baselinePhotoUrl || proposalData.baselinePhotoUrl,
        previousPhotoUrl: milestoneData.previousPhotoUrl,
        existingHashes,
        isFraudDemo
    });

    // Model 7: Geolocation Verification
    const model7Geo = evaluateGeolocationVerification({
        baselineLatitude: baselineData.latitude || proposalData.latitude || 18.5204,
        baselineLongitude: baselineData.longitude || proposalData.longitude || 73.8567,
        evidenceLatitude: evidenceData.latitude || proposalData.latitude || 18.5204,
        evidenceLongitude: evidenceData.longitude || proposalData.longitude || 73.8567,
        allowedRadiusMeters: baselineData.allowedRadiusMeters || 100,
        isFraudDemo
    });

    // Aggregate Risk
    const aggregated = aggregateMultiModelRisk({
        model1Doc,
        model2Csr,
        model3Budget,
        model4Duplicate,
        model5Anomaly,
        model6Vision,
        model7Geo,
        evidenceTimestamp: evidenceData.uploadedAt || evidenceData.capturedAt,
        milestoneStartDate: milestoneData.startDate,
        milestoneDeadline: milestoneData.dueDate,
        completedQuantity: evidenceData.claimedProgress || milestoneData.completedQty,
        expectedQuantity: milestoneData.expectedQty || 100,
        previousVerifiedQuantity: milestoneData.previousVerifiedQty || 0,
        claimedCost: evidenceData.reportedExpenditure || milestoneData.amount,
        approvedMilestoneBudget: milestoneData.amount || proposalData.requestedAmount,
        cumulativeReleased: proposalData.cumulativeReleased || 0,
        approvedTotalBudget: proposalData.requestedAmount || proposalData.totalBudget,
        customWeights
    });

    return {
        overall_score: aggregated.overall_score,
        risk_level: aggregated.risk_level,
        confidence: aggregated.confidence,
        recommendation: aggregated.recommendation,
        requires_human_review: aggregated.requires_human_review,
        model_results: aggregated.model_results,
        findings: aggregated.findings,
        weights_used: aggregated.weights_used,
        disclaimer: aggregated.disclaimer
    };
}

module.exports = {
    runMultiModelVerification,
    evaluateDocumentVerification,
    evaluateCSRCompliance,
    evaluateBudgetIntelligence,
    evaluateDuplicateDetection,
    evaluateAnomalyDetection,
    evaluateVisionVerification,
    evaluateGeolocationVerification,
    calculateHaversineDistanceMeters,
    generateSHA256
};
