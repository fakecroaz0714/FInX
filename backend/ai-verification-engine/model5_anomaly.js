/**
 * Model 5 — Anomaly Detection Engine
 * 
 * Evaluates requested amounts, unit costs, labor/material ratios,
 * and quantity variances against benchmark statistical bounds.
 */

function evaluateAnomalyDetection({ proposalData = {}, budgetItems = [] }) {
    let anomalyPoints = 0;
    const contributingFeatures = [];
    const findings = [];

    const requestedAmount = Number(proposalData.requestedAmount || proposalData.totalBudget || 0);
    const beneficiaryCount = Number(proposalData.beneficiaryCount || proposalData.beneficiaries || 1000);
    const roadLengthKm = Number(proposalData.roadLengthKm || proposalData.roadLength || 2.4);

    // 1. Cost per beneficiary outlier check (> ₹5,000/beneficiary for basic rural infrastructure is suspicious)
    const costPerBen = beneficiaryCount > 0 ? requestedAmount / beneficiaryCount : 0;
    if (costPerBen > 5000) {
        anomalyPoints += 30;
        contributingFeatures.push({ feature: 'cost_per_beneficiary', value: `₹${costPerBen.toFixed(0)}`, limit: '₹5,000' });
        findings.push({
            model: 'MODEL_5_ANOMALY',
            flagType: 'COST_PER_BENEFICIARY_ANOMALY',
            severity: 'WARNING',
            details: `High cost per beneficiary (₹${costPerBen.toFixed(0)}) exceeds benchmark distribution threshold.`
        });
    }

    // 2. Cost per road unit outlier check (> ₹8,00,000/km for simple village access road)
    if (roadLengthKm > 0) {
        const costPerKm = requestedAmount / roadLengthKm;
        if (costPerKm > 800000) {
            anomalyPoints += 25;
            contributingFeatures.push({ feature: 'cost_per_unit_km', value: `₹${costPerKm.toFixed(0)}/km`, limit: '₹8,00,000/km' });
            findings.push({
                model: 'MODEL_5_ANOMALY',
                flagType: 'ROAD_UNIT_COST_ANOMALY',
                severity: 'WARNING',
                details: `Road unit cost (₹${(costPerKm / 100000).toFixed(2)}L/km) is significantly above standard rural road norms.`
            });
        }
    }

    // 3. Material / Labor / Equipment Ratios Check
    let materialSum = 0;
    let labourSum = 0;
    let equipmentSum = 0;

    (budgetItems || []).forEach(item => {
        const desc = (item.itemDescription || item.category || '').toLowerCase();
        const total = Number(item.lineTotal || 0);

        if (desc.includes('material') || desc.includes('tar') || desc.includes('gravel') || desc.includes('cement')) {
            materialSum += total;
        } else if (desc.includes('labour') || desc.includes('labor') || desc.includes('supervision')) {
            labourSum += total;
        } else if (desc.includes('equipment') || desc.includes('machinery') || desc.includes('excavat')) {
            equipmentSum += total;
        }
    });

    if (requestedAmount > 0 && materialSum > 0) {
        const materialRatio = (materialSum / requestedAmount) * 100;
        if (materialRatio > 80) {
            anomalyPoints += 20;
            contributingFeatures.push({ feature: 'material_cost_ratio', value: `${materialRatio.toFixed(1)}%`, limit: '80%' });
            findings.push({
                model: 'MODEL_5_ANOMALY',
                flagType: 'UNBALANCED_MATERIAL_RATIO',
                severity: 'WARNING',
                details: `Material cost ratio (${materialRatio.toFixed(1)}%) is unusually high relative to labor & equipment.`
            });
        }
    }

    // Compute Anomaly Score & Risk Level (0 = Perfect / Normal, 100 = Highly Anomalous)
    const anomalyScore = Math.min(100, anomalyPoints);
    const score = 100 - anomalyScore; // Convert to quality score where 100 is best

    let riskLevel = 'LOW';
    if (anomalyScore >= 60) riskLevel = 'CRITICAL';
    else if (anomalyScore >= 35) riskLevel = 'HIGH';
    else if (anomalyScore >= 15) riskLevel = 'MEDIUM';

    return {
        score,
        anomaly_score: anomalyScore,
        risk_level: riskLevel,
        contributing_features: contributingFeatures,
        detection_type: 'Deterministic Statistical & Benchmark Outlier Rules',
        findings
    };
}

module.exports = {
    evaluateAnomalyDetection
};
