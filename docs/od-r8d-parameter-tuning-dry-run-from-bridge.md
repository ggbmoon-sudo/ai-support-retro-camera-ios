# Phase OD-R8D - Parameter Tuning Dry-run From Bridge

Status: completed
Production readiness: `productionReady:false`

## Summary

OD-R8D consumes OD-R8C bridge output and produces backend/local-only, review-only parameter adjustment candidates.

It does not read images, run CV inference, write reports, create or export a parameter pack, write to iOS, or enable app runtime behavior.

## Input

The default dry-run uses the inline sanitized OD-R8C bridge summary:

- `acceptedForTuningBridgeReview:true`
- `eligibleForParameterTuningDryRun:true`
- `eligibleForParameterPackExport:false`
- `eligibleForAppRuntime:false`
- `productionReady:false`

## Review-only Adjustment Candidates

OD-R8D maps internal tuning signals to candidate-only adjustment rows:

- `headroom_ratio_high_threshold_review` -> `headroomRatio.highSoftWarningThreshold`
- `horizon_angle_threshold_review` -> `horizonAngle.softTiltThreshold`
- `sharpness_ratio_low_confidence_threshold_review` -> `sharpnessRatio.lowConfidenceThreshold`
- `visual_weight_moment_spatial_balance_review` -> `visualWeightMoment.balanceWarningPolicy`

Each adjustment is marked:

- `candidateOnly:true`
- `automaticMutationApplied:false`
- `productionMutationAllowed:false`
- `internalOnly:true`
- `userFacing:false`

No final tuned values are emitted. No production threshold mutation is applied.

## Boundaries

- No image read.
- No committed fixture images, local config, or reports.
- No generated report write.
- No parameter pack export.
- No app runtime write.
- No iOS runtime integration.
- No Swift or Xcode project changes.
- No Camera live cloud AI.
- No provider/cloud call.
- No Xiaoyi relay work.
- No provider credentials.
- No network/upload/download/crawler.
- No model/Core ML/ONNX/TFLite/weight files.
- No training/fine-tuning.
- No production rollout.
- `productionReady:false`.

OD-R8D emits internal tuning candidates, not user-facing scores or advice. It remains compatible with Observation -> Mood -> Retro intent -> Optional action and must not become Score -> Problem -> Fix -> Retake.

## CLI

From `backend/`:

```bash
npm run qa:aesthetic-parameters:tuning-dry-run-from-bridge
```

The CLI prints sanitized JSON only and exits non-zero if the dry-run gate fails.

## Future Work

Future OD-R8E may add a reviewed candidate acceptance gate. OD-R8D itself does not accept candidates into a parameter pack and does not export anything.
