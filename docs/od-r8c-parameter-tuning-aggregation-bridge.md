# Phase OD-R8C - Parameter Tuning Aggregation Bridge

Status: completed
Production readiness: `productionReady:false`

## Summary

OD-R8C adds a backend/local-only bridge gate from OD-R7F-R2 multi-fixture calibration aggregation into the later OD-R8 parameter tuning review path.

The bridge uses an inline sanitized aggregation summary only. It does not read images, run CV inference, write reports, create a production parameter pack, write to iOS, or change Camera runtime.

## What It Validates

- OD-R7F-R2 source aggregation version and run mode.
- Minimum reviewed fixture count of `5`.
- Empty source blocker buckets.
- Known local CV feature keys only.
- Known warning buckets only.
- Internal tuning signal mapping only.
- No parameter-pack export eligibility.
- No app runtime eligibility.
- Disabled execution flags.
- `productionReady:false`.

For the current reviewed aggregation state, the bridge reports:

- `fixtureCount:5`
- `sampleSizeGatePassed:true`
- `blockerGatePassed:true`
- `acceptedForTuningBridgeReview:true`
- `eligibleForParameterTuningDryRun:true`
- `eligibleForParameterPackExport:false`
- `eligibleForAppRuntime:false`

## Internal Signal Mapping

OD-R8C converts warning frequency buckets into internal tuning review signals:

- Horizon tilt warning buckets map to `horizon_angle_threshold_review`.
- Low sharpness warning buckets map to `sharpness_ratio_low_confidence_threshold_review`.
- Spatial balance warning buckets map to `visual_weight_moment_spatial_balance_review`.
- High headroom warning buckets map to `headroom_ratio_high_threshold_review`.

These signals are not user-facing advice. They are not scores, ratings, aesthetic grades, or retake-first instructions.

## Boundaries

- No image read.
- No real photos committed.
- No local config committed.
- No generated reports committed.
- No iOS runtime integration.
- No Swift or Xcode project changes.
- No Camera live cloud AI.
- No provider/cloud call.
- No Xiaoyi relay work.
- No provider credentials.
- No network/upload/download/crawler.
- No model/Core ML/ONNX/TFLite/weight files.
- No training/fine-tuning.
- No app runtime transfer.
- No production rollout.
- `productionReady:false`.

The bridge remains compatible with the product language direction of Observation -> Mood -> Retro intent -> Optional action. It must not become a Score -> Problem -> Fix -> Retake system.

## CLI

From `backend/`:

```bash
npm run qa:aesthetic-parameters:tuning-aggregation-bridge
```

The CLI prints sanitized JSON only and exits non-zero if the bridge gate fails.

## Future Work

OD-R8D may run a parameter tuning dry-run using the OD-R8C bridge output after manual local AI review. OD-R8C itself does not produce a production parameter pack and does not write to app runtime.
