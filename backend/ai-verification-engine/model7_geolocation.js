/**
 * Model 7 — Geolocation Verification Engine
 * 
 * Computes Haversine distance between baseline coordinates
 * and milestone evidence coordinates.
 * Enforces configured radius limit (default 100 meters).
 */

function calculateHaversineDistanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
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

function evaluateGeolocationVerification({
    baselineLatitude,
    baselineLongitude,
    evidenceLatitude,
    evidenceLongitude,
    allowedRadiusMeters = 100,
    isFraudDemo = null
}) {
    const findings = [];
    const baseLat = Number(baselineLatitude || 0);
    const baseLng = Number(baselineLongitude || 0);
    let evLat = Number(evidenceLatitude || baseLat);
    let evLng = Number(evidenceLongitude || baseLng);

    // Fraud Demo override for GPS mismatch
    if (isFraudDemo === 'gps_mismatch') {
        evLat = baseLat + 0.138; // ~15.4 km away
        evLng = baseLng + 0.100;
    }

    const distanceMeters = Math.round(calculateHaversineDistanceMeters(baseLat, baseLng, evLat, evLng));
    const geoVerified = distanceMeters <= allowedRadiusMeters;

    let score = 100;
    if (!geoVerified) {
        score = Math.max(0, 100 - Math.min(100, Math.round((distanceMeters / allowedRadiusMeters) * 50)));
        findings.push({
            model: 'MODEL_7_GEOLOCATION',
            flagType: 'GPS_MISMATCH',
            severity: 'CRITICAL',
            details: `Evidence captured ${(distanceMeters / 1000).toFixed(2)}km away from baseline project site (Allowed radius: ${allowedRadiusMeters}m).`
        });
        findings.push({
            model: 'MODEL_7_GEOLOCATION',
            flagType: 'OUT_OF_PERIMETER',
            severity: 'HIGH',
            details: `Captured GPS coordinates (${evLat.toFixed(4)}, ${evLng.toFixed(4)}) exceed allowed boundary radius.`
        });
    }

    return {
        score: geoVerified ? 100 : score,
        distance_meters: distanceMeters,
        allowed_radius_meters: allowedRadiusMeters,
        gps_status: geoVerified ? 'PASS' : 'FAIL',
        error_code: geoVerified ? null : 'GPS_MISMATCH',
        baseline_coordinates: { latitude: baseLat, longitude: baseLng },
        evidence_coordinates: { latitude: evLat, longitude: evLng },
        findings
    };
}

module.exports = {
    calculateHaversineDistanceMeters,
    evaluateGeolocationVerification
};
