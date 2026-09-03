/**
 * Milestone State Machine & Audit Trail Service.
 * Enforces server-side transition rules to prevent client-side status mutation or skipping.
 */

const VALID_STATES = [
    'LOCKED',
    'ACTIVE',
    'EVIDENCE_SUBMITTED',
    'VERIFYING',
    'HUMAN_REVIEW',
    'VERIFIED',
    'FUND_RELEASED',
    'COMPLETED',
    'REVISION_REQUIRED',
    'VERIFICATION_FAILED',
    'FLAGGED',
    'SUSPENDED'
];

const ALLOWED_TRANSITIONS = {
    'LOCKED': ['ACTIVE'],
    'ACTIVE': ['EVIDENCE_SUBMITTED', 'SUSPENDED'],
    'EVIDENCE_SUBMITTED': ['VERIFYING', 'REVISION_REQUIRED'],
    'VERIFYING': ['VERIFIED', 'HUMAN_REVIEW', 'VERIFICATION_FAILED', 'FLAGGED'],
    'HUMAN_REVIEW': ['VERIFIED', 'REVISION_REQUIRED', 'FLAGGED', 'VERIFICATION_FAILED'],
    'REVISION_REQUIRED': ['EVIDENCE_SUBMITTED', 'ACTIVE', 'SUSPENDED'],
    'VERIFICATION_FAILED': ['EVIDENCE_SUBMITTED', 'REVISION_REQUIRED', 'FLAGGED', 'SUSPENDED'],
    'FLAGGED': ['HUMAN_REVIEW', 'REVISION_REQUIRED', 'SUSPENDED'],
    'VERIFIED': ['FUND_RELEASED'],
    'FUND_RELEASED': ['COMPLETED'],
    'COMPLETED': [],
    'SUSPENDED': ['LOCKED', 'ACTIVE']
};

/**
 * Validates if a state transition is allowed by business rules.
 */
function validateTransition(currentStatus, targetStatus, previousMilestoneStatus = null, milestoneIndex = 0) {
    if (!VALID_STATES.includes(targetStatus)) {
        return { valid: false, error: `Invalid target milestone state: ${targetStatus}` };
    }

    // Unlocking LOCKED milestone requires previous milestone to be FUND_RELEASED or COMPLETED
    if (targetStatus === 'ACTIVE' && currentStatus === 'LOCKED') {
        if (milestoneIndex > 0 && previousMilestoneStatus !== 'FUND_RELEASED' && previousMilestoneStatus !== 'COMPLETED') {
            return {
                valid: false,
                error: `Cannot activate milestone ${milestoneIndex + 1}. Previous milestone must be FUND_RELEASED or COMPLETED (Current status: ${previousMilestoneStatus || 'LOCKED'}).`
            };
        }
    }

    const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
        return {
            valid: false,
            error: `Illegal state transition from '${currentStatus}' to '${targetStatus}'.`
        };
    }

    return { valid: true };
}

/**
 * Validates that SUM(milestones.amount) === approved project budget.
 */
function validateMilestoneBudgetSum(milestones, totalBudget) {
    if (!Array.isArray(milestones) || milestones.length === 0) {
        return { valid: false, error: 'At least one milestone is required.' };
    }

    const sumAmounts = milestones.reduce((acc, m) => acc + (Number(m.amount) || 0), 0);
    const roundedSum = Math.round(sumAmounts * 100) / 100;
    const roundedBudget = Math.round(Number(totalBudget) * 100) / 100;

    if (Math.abs(roundedSum - roundedBudget) > 0.01) {
        return {
            valid: false,
            error: `Milestone budget sum (₹${roundedSum.toLocaleString()}) does not match approved project budget (₹${roundedBudget.toLocaleString()}).`
        };
    }

    return { valid: true, sum: roundedSum };
}

module.exports = {
    VALID_STATES,
    validateTransition,
    validateMilestoneBudgetSum
};
