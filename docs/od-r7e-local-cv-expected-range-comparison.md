# OD-R7E - Local CV Expected Range Comparison

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

OD-R7E adds a backend/local-only expected range comparison for sanitized local CV calibration output. It uses the OD-R7D-R1 sanitized `calibration_001` feature vector as an inline fixture and does not read images by default.

This phase emits calibration review buckets, not scores. The output is intended for manual range review before broader calibration aggregation.

## Scope

- Compares sanitized feature vectors against soft expected ranges.
- Reports soft warning buckets for review, such as horizon tilt and spatial balance.
- Blocks malformed feature values, unknown buckets, image-read flags, CV inference flags, provider/network/upload flags, report persistence, app runtime integration, and `productionReady:true`.
- Keeps `productionReady:false`.

## Boundaries

- No image read by default.
- No real photos committed.
- No local config committed.
- No generated reports committed.
- No iOS runtime integration.
- No Swift files.
- No Xcode project changes.
- No Camera live cloud AI.
- No provider/cloud call.
- No Xiaoyi relay work.
- No provider credentials.
- No network, upload, download, or crawler.
- No model/Core ML/ONNX/TFLite/weight files.
- No training or fine-tuning.
- No app runtime transfer.
- No production rollout.

## OD-R7D-R1 Fixture Handling

The inline sanitized fixture is:

```json
{
  "fixtureToken": "calibration_001",
  "headroomRatio": 0.23,
  "horizonAngle": -4,
  "highlightClipRatio": 0.044,
  "edgeMargin": 0.097,
  "backgroundObjectDensity": 0.199,
  "sharpnessRatio": 0.228,
  "subjectAnchor": "left_third",
  "visualWeightMoment": "right_heavy"
}
```

Expected result:

- Accepted for range review.
- `horizonAngle:-4` is a soft warning only.
- `visualWeightMoment:"right_heavy"` is a soft spatial-balance warning only.
- `sharpnessRatio:0.228` is accepted.
- No hard blockers.

## Language Boundary

OD-R7E must not become score, problem, fix, retake language. It stays in the local AI calibration lane and keeps user-facing Photo Advisor language aligned to Observation -> Mood -> Retro intent -> Optional action.

## Verification

From `backend/`:

```bash
npm test
npm run qa:aesthetic-local-cv:expected-range
```

Future OD-R7F may aggregate multiple approved local calibration outputs after manual review.
