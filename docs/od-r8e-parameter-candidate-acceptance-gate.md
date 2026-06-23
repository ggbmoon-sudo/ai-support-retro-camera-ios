# Phase OD-R8E - Reviewed Candidate Acceptance Gate

Status: completed
Production readiness: `productionReady:false`

## Summary

OD-R8E applies explicit manual review decisions to OD-R8D review-only parameter adjustment candidates.

It does not read images, run CV inference, write reports, create or export a parameter pack, write to iOS, or enable app runtime behavior.

## Manual Review Decisions

Accepted for future pack-candidate review:

- `visualWeightMoment.balanceWarningPolicy`
- `horizonAngle.softTiltThreshold`

Marked `needs_more_data`:

- `headroomRatio.highSoftWarningThreshold`
- `sharpnessRatio.lowConfidenceThreshold`

`accepted_for_pack_candidate` still does not mean exportable. It only means the candidate may be considered by a future backend/local-only pack-candidate scaffold.

## Output

The default CLI emits sanitized JSON with:

- `runMode:"reviewed_candidate_acceptance_gate_no_export"`
- `reviewedCandidateCount:4`
- `acceptedCandidateCount:2`
- `needsMoreDataCount:2`
- `rejectedCandidateCount:0`
- `blockedCandidateCount:0`
- `acceptedForParameterPackCandidateReview:true`
- `eligibleForParameterPackExport:false`
- `eligibleForAppRuntime:false`
- `parameterPackExported:false`
- `appRuntimeWritePerformed:false`
- `productionReady:false`

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

OD-R8E emits internal acceptance decisions, not user-facing scores or advice. It remains compatible with Observation -> Mood -> Retro intent -> Optional action and must not become Score -> Problem -> Fix -> Retake.

## CLI

From `backend/`:

```bash
npm run qa:aesthetic-parameters:candidate-acceptance-gate
```

The CLI prints sanitized JSON only and exits non-zero if the acceptance gate fails.

## Future Work

Future OD-R8F may build a parameter-pack candidate scaffold only from accepted candidates, still not app-runtime eligible and still not exported to iOS runtime.
