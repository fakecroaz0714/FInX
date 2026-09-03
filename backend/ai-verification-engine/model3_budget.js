/**
 * Model 3 — Budget Intelligence Engine
 * 
 * Validates budget line items:
 * - Line item arithmetic checks (quantity × unit_price = line_total)
 * - Sum validation (SUM(line_items) = project_total)
 * - Benchmark / ML cost estimation for project parameters
 * - Cost per beneficiary & cost per unit calculation
 * - Budget variance & risk classification
 */

function evaluateBudgetIntelligence({ proposalData = {}, budgetItems = [] }) {
    let score = 100;
    const findings = [];

    const requestedAmount = Number(proposalData.requestedAmount || proposalData.totalBudget || 0);
    const beneficiaryCount = Number(proposalData.beneficiaryCount || proposalData.beneficiaries || 1000);
    const roadLengthKm = Number(proposalData.roadLengthKm || proposalData.roadLength || 2.4);

    // 1. Line Items Arithmetic Validation
    let itemsSum = 0;
    let arithmeticMismatchCount = 0;

    (budgetItems || []).forEach((item, idx) => {
        const qty = Number(item.quantity || 0);
        const unitPrice = Number(item.unitPrice || 0);
        const lineTotal = Number(item.lineTotal || 0);
        const expectedLineTotal = qty * unitPrice;

        if (qty > 0 && unitPrice > 0 && Math.abs(lineTotal - expectedLineTotal) > 1) {
            arithmeticMismatchCount++;
            findings.push({
                model: 'MODEL_3_BUDGET',
                flagType: 'ARITHMETIC_ERROR',
                severity: 'WARNING',
                details: `Line item #${idx + 1} (${item.itemDescription || item.category}): Qty (${qty}) × Price (₹${unitPrice}) = ₹${expectedLineTotal}, but listed as ₹${lineTotal}.`
            });
        }
        itemsSum += lineTotal;
    });

    if (arithmeticMismatchCount > 0) {
        score -= 20;
    }

    if (budgetItems.length > 0 && itemsSum > 0 && Math.abs(requestedAmount - itemsSum) > 10) {
        score -= 25;
        findings.push({
            model: 'MODEL_3_BUDGET',
            flagType: 'BUDGET_SUM_MISMATCH',
            severity: 'CRITICAL',
            details: `Sum of budget line items (₹${itemsSum.toLocaleString()}) does not match total requested budget (₹${requestedAmount.toLocaleString()}).`
        });
    }

    // 2. Cost Ratios & Metrics
    const costPerBeneficiary = beneficiaryCount > 0 ? Number((requestedAmount / beneficiaryCount).toFixed(0)) : 0;
    const costPerRoadUnit = roadLengthKm > 0 ? Number((requestedAmount / roadLengthKm).toFixed(0)) : 0; // Cost per km

    // 3. Benchmark / ML Cost Range Estimation
    // For rural road construction in Maharashtra/India: ₹3.5L to ₹4.5L per km for single-lane gravel/tar access road
    let expectedMin = Math.round(roadLengthKm * 350000);
    let expectedMax = Math.round(roadLengthKm * 450000);

    if (expectedMin === 0) {
        expectedMin = Math.round(requestedAmount * 0.80);
        expectedMax = Math.round(requestedAmount * 1.15);
    }

    const predictedCost = Math.round((expectedMin + expectedMax) / 2);
    const variancePercentage = Number((((requestedAmount - predictedCost) / predictedCost) * 100).toFixed(1));

    let budgetRisk = 'LOW_RISK';
    if (variancePercentage > 20) {
        score -= 30;
        budgetRisk = 'REVIEW_REQUIRED';
        findings.push({
            model: 'MODEL_3_BUDGET',
            flagType: 'HIGH_BUDGET_VARIANCE',
            severity: 'CRITICAL',
            details: `Requested budget (₹${requestedAmount.toLocaleString()}) is +${variancePercentage}% higher than benchmark estimate range (₹${expectedMin.toLocaleString()} – ₹${expectedMax.toLocaleString()}).`
        });
    } else if (variancePercentage > 10) {
        score -= 15;
        budgetRisk = 'MODERATE_VARIANCE';
        findings.push({
            model: 'MODEL_3_BUDGET',
            flagType: 'MODERATE_BUDGET_VARIANCE',
            severity: 'WARNING',
            details: `Requested budget is +${variancePercentage}% above expected baseline benchmark.`
        });
    }

    const finalScore = Math.max(0, Math.min(100, score));

    return {
        score: finalScore,
        submitted_cost: requestedAmount,
        predicted_cost: predictedCost,
        expected_cost_range: {
            min: expectedMin,
            max: expectedMax,
            formatted: `₹${expectedMin.toLocaleString()} – ₹${expectedMax.toLocaleString()}`
        },
        variance_percentage: variancePercentage,
        cost_per_beneficiary: costPerBeneficiary,
        cost_per_road_unit: costPerRoadUnit,
        estimation_type: 'Benchmark/Rule Based (Sufficient training data pending for XGBoost model)',
        budget_risk: budgetRisk,
        findings
    };
}

module.exports = {
    evaluateBudgetIntelligence
};
