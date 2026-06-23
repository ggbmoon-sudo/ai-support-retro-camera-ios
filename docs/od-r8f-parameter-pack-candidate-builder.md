# Phase OD-R8F - Parameter-pack Candidate Builder

Status: completed
Production readiness: `productionReady:false`

## Summary

OD-R8F builds a backend/local-only review scaffold for a parameter-pack candidate using only OD-R8E accepted local CV candidates.

It does not read images, run CV inference, write reports, export a parameter pack, write to iOS, or enable app runtime behavior.

## Candidate Inputs

Included from OD-R8E accepted candidates:

- `horizonAngle.softTiltThreshold`
- `visualWeightMoment.balanceWarningPolicy`

Excluded because OD-R8E marked them `needs_more_data`:

- `headroomRatio.highSoftWarningThreshold`
- `sharpnessRatio.lowConfidenceThreshold`

The horizon candidate remains warning/review only and must never become a hard blocker. The visual-weight candidate remains soft-only internal guidance and must never become a hard blocker.

## Output

The default CLI emits sanitized JSON with:

- `runMode:"parameter_pack_candidate_builder_no_export"`
- `candidateOnly:true`
- `acceptedForPackCandidateReview:true`
- `eligibleForParameterPackExport:false`
- `eligibleForAppRuntime:false`
- `parameterPackExported:false`
- `appRuntimeWritePerformed:false`
- `productionReady:false`

The emitted candidate scaffold is internal parameter policy only. It is not user-facing advice, does not include final production values, and is not an exported parameter pack.

## Boundaries

- No image read.
- No CV inference.
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

OD-R8F must not become Score -> Problem -> Fix -> Retake. It remains compatible with Observation -> Mood -> Retro intent -> Optional action.

## CLI

From `backend/`:

```bash
npm run qa:aesthetic-parameters:pack-candidate-builder
```

The CLI prints sanitized JSON only and exits non-zero if the builder gate fails.

## Future Work

Future OD-R8G may add a candidate export preflight gate. That future gate still must not write to app runtime unless a later explicit product integration phase approves it.
