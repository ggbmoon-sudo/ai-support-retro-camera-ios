# Phase 21-C - Depth Anything V2 Small Core ML Sandbox

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

## Summary

Phase 21-C adds a debug-only Depth Anything V2 Small sandbox scaffold for the on-device live framing track. The sandbox is not wired into Camera runtime and does not include a model file, Core ML package, model download, inference execution, or benchmark run.

The implementation is deliberately fail-closed: hardware AVFoundation depth remains first priority, the sandbox is disabled by default, raw frame/depth logging is blocked, persistence is blocked, and sanitized benchmark metric buckets are defined for a future Mac/Xcode/device run.

## Added

- `DepthAnythingV2SmallSandboxConfiguration`
- `DepthAnythingV2SmallSandboxReadiness`
- `DepthAnythingV2SmallSanitizedBenchmarkSample`
- `DepthAnythingV2SmallSandbox`

## Sandbox Behavior

- Default state: disabled.
- Hardware depth first: if hardware depth or portrait matte is available, the sandbox reports `hardwareDepthPreferred`.
- Model artifact: checks only for a future compiled `DepthAnythingV2Small.mlmodelc` bundle artifact; none is added in this phase.
- Thermal/low power: blocks debug benchmark readiness when thermal state is serious/critical or Low Power Mode is enabled.
- Metrics: exposes sanitized buckets only; no raw frame, raw depth, raw image, raw model output, or file path is logged or persisted.

## Not Added

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
- Provider/model key or direct provider/model call in iOS: no.
- Backend/iOS upload payload change: no.
- Raw frame/depth/image logging or persistence: no.
- Production rollout: no.

## Required Xcode Verification

Run on MacBook/Xcode:

- Build the app.
- Confirm `DepthAnythingV2SmallSandbox.swift` compiles.
- Confirm no Depth Anything model appears in the bundle.
- Confirm Camera opens as before.
- Confirm Phase 21-A Vision geometry and Phase 21-B depth capability probe still behave as before.
- Confirm no raw frame/depth/image logging.
- Confirm no upload/provider/model key/direct call appears in iOS.

## Next Recommendation

If continuing Depth Anything, the next safe phase should be `Phase 21-C-R1 - Depth Anything Model Artifact Source and Xcode Benchmark Harness Approval Gate`.

That phase should verify model source/license, decide bundle vs ignored local debug artifact, define exact device benchmark procedure, and still avoid production rollout. Do not jump to production fallback behavior until real-device latency, memory, FPS, thermal, battery, and app-size evidence exists.
