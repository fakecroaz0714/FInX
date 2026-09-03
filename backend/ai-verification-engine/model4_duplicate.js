/**
 * Model 4 — Duplicate Project Detection
 * 
 * Performs semantic similarity and geographic proximity checks
 * to detect duplicate project proposals across the FINX platform.
 */

function calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999999;
    const R = 6371e3;
    const rad = Math.PI / 180;
    const dLat = (lat2 - lat1) * rad;
    const dLon = (lon2 - lon1) * rad;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function evaluateDuplicateDetection({ proposalData = {}, existingProposals = [] }) {
    let score = 100;
    const findings = [];
    let topMatch = null;

    const currentCode = proposalData.proposalCode || proposalData.id || '';
    const title = (proposalData.projectName || proposalData.title || '').toLowerCase();
    const desc = (proposalData.projectDescription || proposalData.description || '').toLowerCase();
    const lat = Number(proposalData.latitude || 0);
    const lng = Number(proposalData.longitude || 0);

    (existingProposals || []).forEach(existing => {
        const existingCode = existing.proposalCode || existing.id || '';
        if (existingCode && existingCode !== currentCode) {
            const matchedFields = [];
            let locSim = 0;
            let textSim = 0;

            // Location Distance Similarity
            const eLat = Number(existing.latitude || 0);
            const eLng = Number(existing.longitude || 0);
            const distMeters = calculateHaversineDistanceMeters(lat, lng, eLat, eLng);

            if (distMeters < 500) {
                locSim = 98;
                matchedFields.push('GPS Location Coordinates (< 500m)');
            } else if (distMeters < 3000) {
                locSim = 85;
                matchedFields.push('Geographic Radius (< 3km)');
            }

            // Title & Description Similarity
            const eTitle = (existing.projectName || existing.title || '').toLowerCase();
            const eDesc = (existing.projectDescription || existing.description || '').toLowerCase();

            if (title && eTitle && (title.includes(eTitle) || eTitle.includes(title))) {
                textSim += 50;
                matchedFields.push('Project Title Match');
            }
            if (desc && eDesc) {
                const words1 = new Set(title.split(' ').concat(desc.split(' ')));
                const words2 = new Set(eTitle.split(' ').concat(eDesc.split(' ')));
                const intersection = [...words1].filter(w => words2.has(w) && w.length > 3);
                if (intersection.length > 3) {
                    textSim += 45;
                    matchedFields.push('Description Keywords Match');
                }
            }

            const overallSim = Math.min(99, Number(((locSim * 0.5) + (textSim * 0.5)).toFixed(1)));

            if (overallSim >= 75 && (!topMatch || overallSim > topMatch.similarity_score)) {
                topMatch = {
                    similar_project_id: existingCode,
                    similarity_score: overallSim,
                    matched_fields: matchedFields,
                    duplicate_risk: overallSim >= 90 ? 'HIGH_DUPLICATE_RISK' : 'POSSIBLE_DUPLICATE'
                };
            }
        }
    });

    if (topMatch) {
        if (topMatch.similarity_score >= 90) {
            score -= 30;
            findings.push({
                model: 'MODEL_4_DUPLICATE',
                flagType: 'HIGH_DUPLICATE_MATCH',
                severity: 'CRITICAL',
                details: `90%+ duplicate project match detected (${topMatch.similar_project_id}). Requires human review.`
            });
        } else if (topMatch.similarity_score >= 75) {
            score -= 15;
            findings.push({
                model: 'MODEL_4_DUPLICATE',
                flagType: 'POSSIBLE_DUPLICATE_MATCH',
                severity: 'WARNING',
                details: `Possible duplicate project match (${topMatch.similarity_score}%) with ${topMatch.similar_project_id}.`
            });
        }
    }

    const finalScore = Math.max(0, Math.min(100, score));

    return {
        score: finalScore,
        similar_project_id: topMatch ? topMatch.similar_project_id : null,
        similarity_score: topMatch ? topMatch.similarity_score : 0,
        matched_fields: topMatch ? topMatch.matched_fields : [],
        duplicate_risk: topMatch ? topMatch.duplicate_risk : 'LOW_RISK',
        findings,
        requires_human_review: topMatch && topMatch.similarity_score >= 75
    };
}

module.exports = {
    evaluateDuplicateDetection
};
