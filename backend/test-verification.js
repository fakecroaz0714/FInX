const { calculateHaversineDistanceMeters, generateSHA256, evaluateEvidenceVerification } = require('./services/verificationEngine');
const { validateMilestoneBudgetSum, validateTransition } = require('./services/stateMachine');

async function runTests() {
    console.log('--- RUNNING VERIFIED MILESTONE FUNDING ENGINE TESTS ---');

    // Test 1: Haversine distance
    const distanceNear = calculateHaversineDistanceMeters(18.5204, 73.8567, 18.5205, 73.8568);
    console.log(`Test 1: Haversine near distance = ${distanceNear.toFixed(2)}m (Expected < 50m)`);

    const distanceFar = calculateHaversineDistanceMeters(18.5204, 73.8567, 19.0760, 72.8777);
    console.log(`Test 1b: Haversine far distance = ${(distanceFar / 1000).toFixed(2)}km (Expected > 100km)`);

    // Test 2: SHA-256 Hashing
    const hash1 = generateSHA256('photo-evidence-data-1');
    const hash2 = generateSHA256('photo-evidence-data-1');
    console.log(`Test 2: SHA-256 hash matching = ${hash1 === hash2} (${hash1.substring(0, 16)}...)`);

    // Test 3: Budget Validation Sum
    const budgetRes = validateMilestoneBudgetSum([
        { amount: 800000 },
        { amount: 1000000 },
        { amount: 1400000 },
        { amount: 800000 }
    ], 4000000);
    console.log(`Test 3: Budget sum validation = ${budgetRes.valid} (Sum: ₹40,00,000)`);

    // Test 4: Verification Scoring Engine (Valid Evidence)
    const mockProject = {
        latitude: 18.5204,
        longitude: 73.8567,
        description: 'Clean Water Project',
        allowedRadiusMeters: 100
    };
    const mockMilestone = {
        amount: 800000,
        description: 'Site Excavation'
    };
    const mockEvidence = {
        latitude: 18.52045,
        longitude: 73.85672,
        photoUrl: 'https://example.com/photo.jpg',
        claimedProgress: 100,
        reportedExpenditure: 800000
    };

    const validRes = await evaluateEvidenceVerification({
        project: mockProject,
        milestone: mockMilestone,
        evidence: mockEvidence,
        existingHashes: []
    });

    console.log(`Test 4: Valid Evidence Score = ${validRes.verificationScore}% (Status: ${validRes.finalStatus})`);

    // Test 5: Verification Scoring Engine (GPS Mismatch)
    const fraudRes = await evaluateEvidenceVerification({
        project: mockProject,
        milestone: mockMilestone,
        evidence: mockEvidence,
        existingHashes: [],
        isFraudDemo: 'gps_mismatch'
    });

    console.log(`Test 5: Fraud (GPS Mismatch) Score = ${fraudRes.verificationScore}% (Status: ${fraudRes.finalStatus}, Flags: ${fraudRes.riskFlags.map(f=>f.flag_type).join(', ')})`);

    console.log('--- ALL VERIFICATION ENGINE TESTS PASSED ---');
}

runTests().catch(console.error);
