# Phase OD-03 - Depth Anything V2 Small Core ML Sandbox Preflight Plan

Status: docs-only planning
Date: 2026-06-20
Production readiness: `productionReady:false`

## Summary

Phase OD-03 records a docs-only plan for a future Depth Anything V2 Small Core ML sandbox. This commit does not add a backend preflight gate implementation, CLI script, backend tests, Swift runtime file, model artifact, Core ML package, inference path, benchmark runner, Camera integration, upload path, provider call, API key, or production rollout.

The local `ios-app/AIPhotoApp/Features/Camera/DepthAnythingV2SmallSandbox.swift` scaffold remains untracked for a later separate phase such as `Phase OD-03B - Depth Anything iOS Sandbox Placeholder`. It must not be staged or committed as part of this docs-only OD-03 plan.

## Planned Sandbox Principles

- Hardware AVFoundation depth remains first priority.
- Depth Anything V2 Small remains a fallback benchmark candidate only.
- Any sandbox must be disabled by default.
- Any benchmark must use sanitized aggregate buckets only.
- Raw frame, raw image, raw depth map, GPS, EXIF, face descriptors, provider responses, prompts, local configs, and model outputs must not be logged or persisted.
- Future inference requires explicit approval, model-source/license review, Xcode/device benchmark harness approval, and real-device memory/FPS/thermal/battery/app-size gates.

## Not Added In This Commit

- Backend preflight gate: no.
- Backend CLI script: no.
- Backend tests: no.
- Swift runtime/scaffold file: no.
- Depth Anything model file: no.
- Core ML package: no.
- ONNX/TFLite/MLX package: no.
- Model download: no.
- Inference execution: no.
- Benchmark run: no.
- Camera runtime integration: no.
- Live guidance behavior change: no.
- Preview-frame upload: no.
- Camera live cloud AI entry: no.
- Provider/model key or direct provider/model call in iOS/backend: no.
- Backend/iOS upload payload change: no.
- Raw frame/depth/image logging or persistence: no.
- Production rollout: no.

## Future Gate Shape

Phase OD-03A adds the backend no-runtime preflight gate, sanitized CLI, and backend tests for this plan. It remains policy-object validation only and does not read images, load models, call Core ML, call network, inspect local model paths, or alter iOS runtime behavior.

A later explicitly approved phase may add one or more of:

- `Phase OD-03B - Depth Anything iOS Sandbox Placeholder`
- model artifact source/license approval
- Xcode benchmark harness approval
- dry-run policy validator
- real-device benchmark procedure

Those later phases must keep `productionReady:false` unless the operator explicitly approves a production rollout.
