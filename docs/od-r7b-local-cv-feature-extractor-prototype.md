# Phase OD-R7B - Local CV Feature Extractor Prototype

Status: backend-only local prototype
Production readiness: `productionReady:false`

## Executive Summary

OD-R7B adds a backend/local-only prototype that maps safe inline synthetic local-CV observations into structured feature vectors compatible with OD-R7A Local CV Feature Vector Benchmark and OD-R8A Parameter Tuning Harness inputs.

This phase does not read images, run real CV inference, call cloud AI, call Xiaoyi relay, call any provider, use network, upload images, crawl/download data, train/fine-tune models, add iOS runtime code, add Swift files, install model files, or transfer anything into app runtime.

## What This Adds

- `aestheticLocalCvFeatureExtractorPrototype.mjs`, a fail-closed extractor contract for synthetic observations only.
- Sanitized CLI: `npm run qa:aesthetic-local-cv:feature-extractor`.
- Backend tests for valid extraction, OD-R7A benchmark compatibility, unknown measurements, unsupported buckets, raw image/path/URL/base64 leakage, prompt/provider/debug leakage, score/rating, sensitive inference, disabled execution flags, app-runtime blockers, and CLI output.

## Prototype Feature Inputs

The synthetic observation contract supports local-CV-style measurements only:

- `headroomRatio`
- `horizonAngle`
- `highlightClipRatio`
- `edgeMargin`
- `backgroundObjectDensity`
- `sharpnessRatio`
- `subjectAnchor`
- `visualWeightMoment`

It also supports safe bucket labels for `subjectAnchorBucket` and `visualWeightMomentBucket`. These are converted into OD-R7A-compatible feature vectors with `sourceType:"synthetic_inline_numeric_features"`.

## Hard Boundaries

- No real photos or datasets.
- No image reads or uploads.
- No real CV inference.
- No Python/OpenCV/PyTorch dependency.
- No model files, Core ML packages, ONNX/TFLite packages, or weights.
- No cloud/provider/Xiaoyi relay call.
- No network call.
- No crawler or download.
- No training or fine-tuning.
- No iOS runtime integration.
- No Swift files.
- No Camera live cloud AI.
- No upload path or app payload change.
- No raw image, base64, prompt, provider response, request payload, GPS, EXIF, score, rating, or sensitive inference persistence.
- No app runtime transfer.
- `productionReady:false`.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-local-cv:feature-extractor
```

Expected CLI output keeps:

- `runMode:"local_cv_feature_extractor_prototype"`
- `extractorPrototypeValid:true`
- `imageReadsPerformed:false`
- `cvInferencePerformed:false`
- `networkCallsMade:false`
- `providerConfigured:false`
- `cloudTeacherEnabled:false`
- `crawlerEnabled:false`
- `downloadEnabled:false`
- `trainingEnabled:false`
- `fineTuningEnabled:false`
- `runtimeIntegrationEnabled:false`
- `eligibleForAppRuntime:false`
- `appRuntimeTransferBlocked:true`
- `productionReady:false`

## Suggested Next Step

Recommended next local-AI phase: `Phase OD-R7C - Local CV Feature Extractor Calibration Fixture Gate`.

OD-R7C should remain backend/local-only and decide how fixture expansion would be approved, ignored, sanitized, and benchmarked before any real image read or product runtime integration. It should not proceed with Xiaoyi relay credential smoke, cloud provider work, Camera live cloud AI, Swift runtime, model files, or production rollout.
