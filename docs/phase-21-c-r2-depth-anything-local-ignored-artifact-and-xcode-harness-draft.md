# Phase 21-C-R2 - Approved Local-Ignored Depth Anything Model Artifact and Xcode Benchmark Harness Draft

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-C-R2 adds the local-only ignored artifact folder policy and an Xcode benchmark harness draft for a future Depth Anything V2 Small physical-device benchmark.

This phase still does not add a model artifact, Core ML package, model download, inference execution, benchmark run, Camera runtime integration, or production rollout.

## Added

- Local-only ignored artifact folder placeholder:
  - `ios-app/LocalOnlyModels/DepthAnythingV2Small/README.md`
- Ignore rules for future local-only Depth Anything artifacts.
- iOS benchmark harness draft:
  - `DepthAnythingV2SmallBenchmarkHarnessPlan`
  - `DepthAnythingV2SmallBenchmarkHarnessReadiness`
  - `DepthAnythingV2SmallBenchmarkHarnessDraft`

## Harness Draft Behavior

- Requires local ignored artifact policy.
- Requires Xcode physical-device benchmark; simulator-only benchmark is blocked.
- Requires hardware AVFoundation depth first.
- Defines input size buckets:
  - `shortSide256`
  - `shortSide384`
  - `modelNative518DebugOnly`
- Defines sanitized metric buckets:
  - model load time.
  - first inference latency.
  - warmed inference latency.
  - peak memory.
  - preview FPS impact.
  - thermal state.
  - battery drain.
  - depth stability.
  - invalid output rate.
  - app size increase.
- Defines stop conditions:
  - serious/critical thermal state.
  - Low Power Mode.
  - memory warning.
  - preview FPS regression.
  - raw artifact risk.
  - `productionReady:true`.

## Not Added

- Depth Anything model artifact: no.
- Compiled Core ML model: no.
- Core ML package: no.
- Model download: no.
- Inference execution: no.
- Benchmark run: no.
- Camera runtime integration: no.
- Preview-frame upload: no.
- Camera live cloud AI entry: no.
- iOS provider/model key or direct provider/model call: no.
- Backend/iOS upload payload change: no.
- Raw frame/depth/image/path logging or persistence: no.
- Production rollout: no.

## Required Xcode Verification

Run on MacBook/Xcode:

- Build the app.
- Confirm `DepthAnythingV2SmallBenchmarkHarnessDraft.swift` compiles.
- Confirm no Depth Anything model artifact is present in the app bundle unless separately approved later.
- Confirm the local-only artifact folder contains only the committed README.
- Confirm Camera behavior remains unchanged.
- Confirm no inference or benchmark is triggered.
- Confirm no raw frame/depth/image/path logging.
- Confirm no upload/provider/model key/direct call appears in iOS.

## Next Recommendation

If continuing Depth Anything, the next phase should be `Phase 21-C-R3 - Operator Model Artifact Verification and Physical-device Benchmark Approval Request`.

That phase should require exact operator confirmation of source bucket, license bucket, checksum bucket, local ignored artifact handling, physical device list, input sizes, stop conditions, and sanitized aggregate-only output before any inference or benchmark run.
