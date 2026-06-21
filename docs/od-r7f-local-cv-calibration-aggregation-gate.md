# OD-R7F - Local CV Calibration Multi-fixture Aggregation Gate

OD-R7F adds a backend/local-only aggregation gate for sanitized OD-R7E expected-range comparison outputs.

The gate aggregates reviewed fixture tokens, feature comparison status buckets, warning frequency buckets, and blocker buckets. It does not read images by default, does not run CV inference, and does not write generated reports. The current inline reviewed fixture count is `1`, so `insufficientSampleSize:true` remains expected and the result is not eligible for parameter tuning.

The aggregation output is intentionally not a score, rating, or aesthetic grade. Warning frequency buckets are review signals only. They must not become Score -> Problem -> Fix -> Retake guidance, and they must preserve the app language direction of Observation -> Mood -> Retro intent -> Optional action.

OD-R7F does not commit fixture images, local config, generated reports, real user photos, provider payloads, prompts, raw metadata, EXIF/GPS, model files, Swift files, or Xcode project changes. It does not call cloud/provider/Xiaoyi relay code, perform network/upload/download/crawler work, train/fine-tune, transfer anything into app runtime, or enable production rollout.

Use:

```bash
cd backend
npm run qa:aesthetic-local-cv:calibration-aggregation
```

Expected default output:

- `runMode:"multi_fixture_aggregation_no_image_read"`
- `fixtureCount:1`
- `insufficientSampleSize:true`
- `minimumRecommendedFixtureCount:5`
- `acceptedForCalibrationAggregationReview:true`
- `eligibleForParameterTuning:false`
- `eligibleForAppRuntime:false`
- `imageReadsPerformed:false`
- `networkCallsMade:false`
- `uploadPerformed:false`
- `providerCallAttempted:false`
- `productionReady:false`

Future OD-R7F-R1 may run additional approved ignored local fixture smokes and manually append sanitized OD-R7E outputs for aggregation review. Future OD-R8C may connect aggregation summaries to parameter tuning only after sample size and human review gates pass. `productionReady:false` remains locked.
