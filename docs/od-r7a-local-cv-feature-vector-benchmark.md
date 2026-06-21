# Phase OD-R7A - Local CV Feature Vector Benchmark Dry-run

Status: backend-only dry-run
Production readiness: `productionReady:false`

## Executive Summary

OD-R7A adds the first local CV benchmark layer for the OD-R research track. It evaluates safe inline synthetic numeric feature vectors against the OD-R1 Aesthetic Parameter Registry, OD-R6A Parameter Candidate Runner output, and OD-R6B Human Review Queue decisions.

This phase does not run CV inference. It does not read images, upload images, call cloud AI, call a provider, use network, crawl or download data, train or fine-tune models, add iOS runtime code, install model files, or transfer anything into app runtime.

## What This Adds

- Backend benchmark module for synthetic local CV feature vectors.
- Sanitized CLI: `npm run qa:aesthetic-local-cv:feature-benchmark`.
- Tests for valid synthetic vectors, unknown feature/threshold/suppression/action keys, raw image/path/URL/base64/GPS/EXIF leakage, score/rating/sensitive inference, execution flags, app-transfer blockers, and production readiness.
- Aggregate report buckets for tags, accepted/rejected vectors, feature keys, threshold signals, suppression signals, review/tuning status, and app-transfer readiness.

## Benchmark Inputs

OD-R7A accepts only inline synthetic numeric feature signals such as:

- `headroomRatio`
- `horizonAngle`
- `subjectBackgroundDepthDelta`
- `boundaryColorDelta`
- `sharpnessRatio`
- `highlightClipRatio`
- `backgroundObjectDensity`
- `edgeMargin`
- `subjectAnchor`
- `visualWeightMoment`

The dry-run rejects unknown feature keys, threshold signals, suppression candidates, and safe action keys. It also rejects real image paths, URLs, base64, raw image fields, GPS/EXIF fields, score/rating fields, sensitive inference fields, provider/debug leakage, network/image execution flags, training flags, runtime flags, app-runtime eligibility, and `productionReady` set to true.

## Pipeline Relationship

OD-R7A sits after OD-R6A and OD-R6B:

- OD-R1 defines allowed tags and symbolic feature/threshold/suppression/action keys.
- OD-R6A produces structured parameter candidates from validated teacher stubs.
- OD-R6B records human review decisions and accepted-use flags.
- OD-R7A benchmarks synthetic local CV feature-vector shapes against those constraints.

Accepted benchmark vectors may count toward later calibration/evaluation planning, but app transfer remains blocked. Human review, benchmark, safety, and performance gates are still required before any product/runtime use.

## Hard Boundaries

- No real images.
- No image reads or uploads.
- No real CV inference.
- No Python/OpenCV/PyTorch dependency.
- No model files, Core ML packages, ONNX/TFLite packages, or weights.
- No cloud/provider call.
- No network call.
- No crawler or download.
- No training or fine-tuning.
- No iOS runtime integration.
- No Swift files.
- No upload path or app payload change.
- No raw image, base64, prompt, provider response, request payload, GPS, EXIF, score, rating, or sensitive inference persistence.
- No app runtime transfer.
- `productionReady:false`.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-local-cv:feature-benchmark
```

Expected CLI output keeps:

- `runMode:"local_cv_feature_benchmark_dry_run"`
- `imageReadsPerformed:false`
- `networkCallsMade:false`
- `providerConfigured:false`
- `cloudTeacherEnabled:false`
- `crawlerEnabled:false`
- `downloadEnabled:false`
- `trainingEnabled:false`
- `runtimeIntegrationEnabled:false`
- `eligibleForAppRuntime:false`
- `appRuntimeTransferBlocked:true`
- `productionReady:false`

## Later Phases

OD-R8 may add a parameter tuning harness after this dry-run benchmark layer, but it must still keep app transfer blocked until explicit benchmark, safety, performance, and product integration gates pass. OD-R7A is not production rollout.
