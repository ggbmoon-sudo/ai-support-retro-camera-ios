# Phase 21-C-PRE - Depth Anything V2 Small Core ML Sandbox Preflight

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

## Summary

Phase 21-C-PRE adds a no-runtime preflight gate for a future Depth Anything V2 Small Core ML sandbox. It does not add a model package, does not download a model, does not enable Core ML runtime, and does not run inference or a benchmark.

This phase exists so the next sandbox phase can be debug/benchmark-only, hardware-depth-first, and safe before any Depth Anything model artifact is considered.

## Scope

- Adds a backend no-runtime contract for the Depth Anything V2 Small sandbox preflight.
- Adds a sanitized CLI for the preflight report.
- Adds tests that block `modelFileAdded`, `coreMlPackageAdded`, `modelDownloadEnabled`, `runtimeInferenceEnabled`, `cameraPreviewIntegrationEnabled`, `liveFrameProcessingEnabled`, raw frame/depth persistence, network/model calls, uploads, cloud/provider calls, iOS provider keys, sensitive inference, and `productionReady:true`.
- Requires `hardwareDepthPriority:true`, `debugOnly:true`, `benchmarkRequired:true`, `thermalGateRequired:true`, `fpsGateRequired:true`, `memoryGateRequired:true`, `batteryGateRequired:true`, and `safetySensitiveInferenceBlocked:true`.
- Records the future benchmark metrics required before model use:
  - model load time bucket.
  - first inference latency bucket.
  - warmed inference latency bucket.
  - peak memory bucket.
  - preview FPS impact bucket.
  - thermal state bucket.
  - battery drain bucket.
  - depth stability bucket.
  - invalid output rate bucket.
  - app size increase bucket.

## Sandbox Entry Rules For Next Phase

The next Depth Anything sandbox must remain:

- iOS debug/benchmark-only.
- hardware AVFoundation depth first.
- resized preview frame only.
- local/on-device only.
- sanitized aggregate metrics only.
- no raw frame/depth/image logging.
- no raw frame/depth/image persistence.
- no preview-frame upload.
- no Camera live cloud AI.
- no iOS provider/model key.
- no upload payload change.
- no sensitive inference.
- `productionReady:false`.

## Not Added

- Depth Anything model file: no.
- Core ML package: no.
- ONNX/TFLite/MLX package: no.
- Model download: no.
- Core ML runtime execution: no.
- Depth Anything inference: no.
- Benchmark run: no.
- iOS runtime behavior change: no.
- Camera live cloud AI entry: no.
- Preview frame upload: no.
- Backend/iOS upload payload change: no.
- Raw depth/frame/image artifact: no.
- Production rollout: no.

## Verification

Run from the repo root:

```powershell
cd backend
npm run qa:depth-anything:preflight
node --test tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs
```

The CLI output is sanitized and reports:

- `sandboxPreflightEligible:true`
- `eligibleForFutureBenchmark:true`
- `networkCallsMade:false`
- `modelCallsMade:false`
- `runtimeInferenceEnabled:false`
- `productionReady:false`
- `blockedReasons:[]`
- `requiredFutureGates:["benchmarkRequired","thermalGateRequired","fpsGateRequired","memoryGateRequired","batteryGateRequired"]`

## Roadmap Position

Phase 21-A added Apple Vision geometry signals. Phase 21-B added AVFoundation depth capability detection. Phase 21-C-PRE now adds the guardrail before a Depth Anything V2 Small Core ML sandbox.

The next recommended phase is `Phase 21-C - Depth Anything V2 Small Core ML Sandbox`, but it should start only after this preflight is committed/pushed and Xcode verification is available. The sandbox remains debug-only and must still avoid production bundling or rollout.
