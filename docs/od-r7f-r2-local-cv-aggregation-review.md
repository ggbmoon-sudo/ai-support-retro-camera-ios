# OD-R7F-R2 - Local CV Aggregation Review

OD-R7F-R2 updates the backend/local-only calibration aggregation gate to use five manually reviewed sanitized OD-R7F-R1 local CV calibration outputs.

The aggregation CLI still reads no images by default. It aggregates inline sanitized feature vectors only, emits warning frequency buckets and feature status buckets, and writes no reports. Fixture images, ignored local config, raw image bytes, raw paths, EXIF/GPS, raw metadata, private content descriptions, provider payloads, prompts, and generated reports are not committed.

Default aggregation now reports:

- `fixtureCount:5`
- `fixtureTokens:["calibration_001","calibration_002","calibration_003","calibration_004","calibration_005"]`
- `insufficientSampleSize:false`
- `minimumRecommendedFixtureCount:5`
- `acceptedForCalibrationAggregationReview:true`
- `eligibleForParameterTuning:false`
- `eligibleForAppRuntime:false`
- `productionReady:false`

Warning buckets are internal review signals only. They are not scores, ratings, aesthetic grades, or user-facing retake instructions. They must not become Score -> Problem -> Fix -> Retake guidance; the app language direction remains Observation -> Mood -> Retro intent -> Optional action.

This phase also fixes and regression-tests OD-R7D calibration-smoke fixture root path handling so `backend/tests/local-cv-calibration-fixtures` resolves safely when the smoke CLI is launched from the backend package context. Path traversal and unsupported fixture roots remain blocked, and normal output does not print raw absolute paths.

Even though the sample size is no longer insufficient for a first aggregation review, tuning and app runtime remain blocked. Future OD-R8C may connect aggregation summaries into parameter tuning only through a separate gate. `productionReady:false` remains locked.
