/**
 * Risk Aggregator & Final Multi-Model Risk Engine
 * 
 * Aggregates all model outputs (Models 1-7 + Timestamps, Progress & Cost checks)
 * using configurable weights:
 * - GPS Verification:              20%
 * - Image/Evidence Analysis:       20%
 * - Progress Consistency:          15%
 * - Quantity Verification:         15%
 * - Cost Verification:             10%
 * - Duplicate Detection:           10%
 * - Timestamp Verification:        10%
 * Total = 100%
 */

function evaluateTimestampVerification({ evidenceTimestamp, milestoneStartDate, milestoneDeadline }) {
    const findings = [];
    let score = 100;
    const now = new Date();
    const evTime = evidenceTimestamp ? new Date(evidenceTimestamp) : now;

    if (evTime > now) {
        score -= 40;
        findings.push({
            model: 'TIMESTAMP_VERIFIER',
            flagType: 'FUTURE_TIMESTAMP',
            severity: 'HIGH',
            details: 'Evidence capture timestamp is set in the future.'
        });
    }

    if (milestoneDeadline && evTime > new Date(milestoneDeadline)) {
        score -= 15;
        findings.push({
            model: 'TIMESTAMP_VERIFIER',
            flagType: 'OUTSIDE_MILESTONE_PERIOD',
            severity: 'WARNING',
            details: 'Evidence submitted after expected milestone completion deadline.'
        });
    }

    return {
        score: Math.max(0, score),
        timestamp_status: score >= 85 ? 'VALID' : 'ANOMALOUS',
        findings
    };
}

function evaluateProgressVerification({ completedQuantity, expectedQuantity, previousVerifiedQuantity }) {
    const findings = [];
    let score = 100;

    const completed = Number(completedQuantity || 0);
    const expected = Number(expectedQuantity || 1);
    const prev = Number(previousVerifiedQuantity || 0);

    const progressRatio = completed / expected;

    if (completed <= prev && completed > 0 && prev > 0) {
        score -= 30;
        findings.push({
            model: 'PROGRESS_VERIFIER',
            flagType: 'DUPLICATE_PROGRESS',
            severity: 'HIGH',
            details: 'Claimed completed quantity has not advanced beyond previously verified quantity.'
        });
    }

    if (progressRatio > 1.3) {
        score -= 25;
        findings.push({
            model: 'PROGRESS_VERIFIER',
            flagType: 'QUANTITY_ANOMALY',
            severity: 'WARNING',
            details: `Claimed progress quantity (${completed}) exceeds milestone target scope (${expected}) by over 30%.`
        });
    }

    return {
        score: Math.max(0, score),
        progress_ratio: Number(progressRatio.toFixed(2)),
        findings
    };
}

function evaluateCostVerification({ claimedCost, approvedMilestoneBudget, cumulativeReleased, approvedTotalBudget }) {
    const findings = [];
    let score = 100;

    const claimed = Number(claimedCost || 0);
    const approvedMilestone = Number(approvedMilestoneBudget || 1);
    const cumulative = Number(cumulativeReleased || 0);
    const totalBudget = Number(approvedTotalBudget || 1);

    if (claimed > approvedMilestone) {
        score -= 35;
        findings.push({
            model: 'COST_VERIFIER',
            flagType: 'MILESTONE_BUDGET_OVERRUN',
            severity: 'HIGH',
            details: `Claimed expenditure (₹${claimed.toLocaleString()}) exceeds approved milestone allocation (₹${approvedMilestone.toLocaleString()}).`
        });
    }

    if (cumulative + claimed > totalBudget) {
        score -= 50;
        findings.push({
            model: 'COST_VERIFIER',
            flagType: 'TOTAL_PROJECT_BUDGET_EXCEEDED',
            severity: 'CRITICAL',
            details: `Cumulative fund release request exceeds total approved project budget.`
        });
    }

    return {
        score: Math.max(0, score),
        findings
    };
}

function aggregateMultiModelRisk({
    model1Doc,
    model2Csr,
    model3Budget,
    model4Duplicate,
    model5Anomaly,
    model6Vision,
    model7Geo,
    evidenceTimestamp,
    milestoneStartDate,
    milestoneDeadline,
    completedQuantity,
    expectedQuantity,
    previousVerifiedQuantity,
    claimedCost,
    approvedMilestoneBudget,
    cumulativeReleased,
    approvedTotalBudget,
    customWeights = {}
}) {
    const timestampResult = evaluateTimestampVerification({ evidenceTimestamp, milestoneStartDate, milestoneDeadline });
    const progressResult = evaluateProgressVerification({ completedQuantity, expectedQuantity, previousVerifiedQuantity });
    const costResult = evaluateCostVerification({ claimedCost, approvedMilestoneBudget, cumulativeReleased, approvedTotalBudget });

    // Configurable Default Weights (Total = 100%)
    const weights = {
        gps: customWeights.gps !== undefined ? customWeights.gps : 0.20,
        vision: customWeights.vision !== undefined ? customWeights.vision : 0.20,
        progress: customWeights.progress !== undefined ? customWeights.progress : 0.15,
        quantity: customWeights.quantity !== undefined ? customWeights.quantity : 0.15,
        cost: customWeights.cost !== undefined ? customWeights.cost : 0.10,
        duplicate: customWeights.duplicate !== undefined ? customWeights.duplicate : 0.10,
        timestamp: customWeights.timestamp !== undefined ? customWeights.timestamp : 0.10
    };

    const geoScore = model7Geo ? model7Geo.score : 100;
    const visionScore = model6Vision ? model6Vision.score : 100;
    const progressScore = progressResult.score;
    const quantityScore = model5Anomaly ? model5Anomaly.score : 100;
    const costScore = costResult.score;
    const duplicateScore = model4Duplicate ? model4Duplicate.score : 100;
    const timestampScore = timestampResult.score;

    let weightedScore = (
        (geoScore * weights.gps) +
        (visionScore * weights.vision) +
        (progressScore * weights.progress) +
        (quantityScore * weights.quantity) +
        (costScore * weights.cost) +
        (duplicateScore * weights.duplicate) +
        (timestampScore * weights.timestamp)
    );

    // Hard Penalty Override if Duplicate Photo or GPS Mismatch
    if (model6Vision && model6Vision.duplicate_detected) {
        weightedScore = Math.min(35, weightedScore);
    }
    if (model7Geo && model7Geo.gps_status === 'FAIL') {
        weightedScore = Math.min(45, weightedScore);
    }

    const overallScore = Math.min(100, Math.max(0, Math.round(weightedScore)));

    // Categorize Risk Level
    let riskLevel = 'LOW';
    let recommendation = 'HUMAN APPROVAL RECOMMENDED';
    if (overallScore < 50) {
        riskLevel = 'CRITICAL';
        recommendation = 'REJECT SUBMISSION / BLOCK FUND RELEASE';
    } else if (overallScore < 70) {
        riskLevel = 'HIGH';
        recommendation = 'FLAGGED FOR DETAILED AUDIT / REQUEST REVISION';
    } else if (overallScore < 85) {
        riskLevel = 'MEDIUM';
        recommendation = 'HUMAN REVIEW REQUIRED BEFORE FUNDING';
    }

    // Consolidate Findings across models
    const allFindings = [
        ...(model1Doc?.findings || []),
        ...(model2Csr?.findings || []),
        ...(model3Budget?.findings || []),
        ...(model4Duplicate?.findings || []),
        ...(model5Anomaly?.findings || []),
        ...(model6Vision?.findings || []),
        ...(model7Geo?.findings || []),
        ...timestampResult.findings,
        ...progressResult.findings,
        ...costResult.findings
    ];

    const modelResults = {
        model1_document: model1Doc,
        model2_csr_compliance: model2Csr,
        model3_budget: model3Budget,
        model4_duplicate: model4Duplicate,
        model5_anomaly: model5Anomaly,
        model6_vision: model6Vision,
        model7_geolocation: model7Geo,
        timestamp_verifier: timestampResult,
        progress_verifier: progressResult,
        cost_verifier: costResult
    };

    const confidence = Number((93 - (allFindings.length * 1.5)).toFixed(1));

    return {
        overall_score: overallScore,
        risk_level: riskLevel,
        confidence: Math.max(60, Math.min(99, confidence)),
        weights_used: weights,
        model_results: modelResults,
        findings: allFindings,
        recommendation,
        requires_human_review: true,
        disclaimer: 'AI Multi-Model Engine provides empirical evidence and risk scoring. Human authorized approval is mandatory before any milestone fund release.'
    };
}

module.exports = {
    evaluateTimestampVerification,
    evaluateProgressVerification,
    evaluateCostVerification,
    aggregateMultiModelRisk
};
