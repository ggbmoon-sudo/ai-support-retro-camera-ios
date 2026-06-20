# Phase 21-C-R3 - Operator Model Artifact Verification and Physical-device Benchmark Approval Request

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-C-R3 is an approval request draft for a future Depth Anything V2 Small physical-device benchmark.

This document does not approve execution by itself. It does not add a model artifact, Core ML package, model download, inference execution, benchmark run, Camera runtime integration, upload path, raw artifact, or production rollout.

## Approval-request Boundary

- Approval-request documentation only.
- No Depth Anything model artifact was added.
- No compiled Core ML model or package was added.
- No model source URL, local model path, checksum file, or download script was committed.
- No model download happened.
- No inference happened.
- No benchmark happened.
- No Camera runtime integration happened.
- No preview frame, raw image, raw depth map, raw model output, raw path, GPS, EXIF, sensor stream, face descriptor, or sensitive attribute was logged or persisted.
- No provider call, cloud call, provider key, or direct iOS provider/model call was added.
- No backend/iOS upload payload changed.
- `productionReady:false` remains locked.

## Future Benchmark Scope

Future execution is allowed only in a separately approved phase such as `Phase 21-C-R3-RUN`.

Exact future benchmark scope:

- Model family: Depth Anything V2 Small.
- Artifact handling: operator-provided, local-only, ignored artifact.
- Artifact source: verified by operator, recorded by safe source bucket only.
- License/model-card review: required before execution.
- Checksum: verified locally by operator; do not commit raw checksum files if they expose local artifact paths.
- Runtime path: iOS / Xcode physical-device benchmark only.
- Simulator benchmark: not accepted.
- Hardware depth priority: AVFoundation hardware depth remains first priority.
- Product mode: debug benchmark only, not production live guidance.
- Input size buckets:
  - `shortSide256`
  - `shortSide384`
  - `modelNative518DebugOnly`
- Metrics:
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
- Output policy: sanitized aggregate metrics only.
- Raw artifact policy: no raw frame, raw depth map, raw image/base64, raw image path, raw model output, raw logs, or raw benchmark bundle committed.
- iOS policy: no Camera runtime integration, no upload, no provider key, no cloud call, no production rollout.
- Safety policy: no identity, age, gender, emotion, attractiveness, skin, health, ethnicity, religion, disability, body, or other sensitive inference.

## Copyable Approval Phrase

Use this exact phrase only if the operator wants to approve the future execution phase:

> Approve Phase 21-C-R3-RUN: Depth Anything V2 Small physical-device benchmark with operator-verified local-ignored Core ML artifact, source/license/model-card/checksum verified locally, no model artifact committed, Xcode physical devices only, simulator not accepted, hardware AVFoundation depth first, input sizes shortSide256 and shortSide384 plus modelNative518DebugOnly if device allows, sanitized aggregate metrics only, no raw frame/depth/image/path/model output logging or persistence, no Camera runtime integration, no upload, no provider/cloud calls, no iOS provider/model key, no sensitive inference, productionReady:false.

## Operator Confirmation Checklist

Before the future run, the operator must confirm:

- I understand this will run local on-device Depth Anything inference on a physical iPhone/iPad.
- I understand it may affect battery, thermal state, FPS, app responsiveness, and app size.
- I confirm the Core ML artifact source is operator-verified.
- I confirm license and model-card review are complete.
- I confirm checksum verification is local-only and ignored.
- I confirm no model artifact, checksum file, raw source URL, or local artifact path will be committed.
- I confirm hardware AVFoundation depth remains first priority.
- I confirm simulator-only results are not accepted.
- I confirm no real user photos will be used.
- I confirm no raw frames, depth maps, image paths, model outputs, or benchmark bundles will be committed.
- I confirm no Camera runtime integration, upload path, provider/cloud call, or production rollout is included.

## Required Local / Ignored Prerequisites

Do not create these prerequisites in this phase. A future execution phase must require:

- Local ignored artifact under `ios-app/LocalOnlyModels/DepthAnythingV2Small/`.
- Artifact folder still protected by `.gitignore`.
- Xcode physical device available.
- Device tier recorded by safe bucket only.
- Battery level / charging / Low Power Mode state recorded by safe bucket only.
- Thermal state recorded by safe bucket only.
- Benchmark harness buildable in Xcode.
- No raw frame/depth/model logging enabled.
- No persistence enabled.
- No upload or provider/cloud path enabled.
- `productionReady:false`.

## Future Sanitized Output Format

Future execution should produce sanitized aggregate JSON only:

- `phase`
- `modelClass:depth_anything_v2_small`
- `artifactSourceBucket`
- `licenseReviewBucket`
- `checksumBucket`
- `deviceTierBucket`
- `physicalDeviceRequired:true`
- `simulatorAccepted:false`
- `hardwareDepthFirst:true`
- `inputSizeBuckets`
- `sampleCountBucket`
- `modelLoadTimeBucket`
- `firstInferenceLatencyBucket`
- `warmedInferenceLatencyBucket`
- `peakMemoryBucket`
- `previewFpsImpactBucket`
- `thermalStateBucket`
- `batteryDrainBucket`
- `depthStabilityBucket`
- `invalidOutputRateBucket`
- `appSizeIncreaseBucket`
- `stopConditionBuckets`
- `rawFramePrinted:false`
- `rawFramePersisted:false`
- `rawDepthPrinted:false`
- `rawDepthPersisted:false`
- `rawImagePathPrinted:false`
- `rawImagePathPersisted:false`
- `rawModelOutputPrinted:false`
- `rawModelOutputPersisted:false`
- `modelArtifactCommitted:false`
- `networkCallsMade:false`
- `providerCallsMade:false`
- `cameraRuntimeIntegrated:false`
- `uploadPayloadChanged:false`
- `productionReady:false`

In this approval request phase:

- `modelCallsMade:false`
- `benchmarkRun:false`
- `networkCallsMade:false`
- `productionReady:false`

## Failure Gates

Future benchmark execution must stop/fail closed if:

- Artifact source is not verified.
- License/model-card review is missing.
- Artifact is not local-only or ignored.
- Model artifact, source URL, local path, checksum file, raw report, raw frame, raw depth map, or raw model output is staged.
- Benchmark is simulator-only.
- Physical device is not available.
- Hardware depth first policy is disabled.
- Raw frame/depth/path/model output logging is enabled.
- Raw artifact persistence is enabled.
- Camera runtime integration is added.
- Upload path or upload payload changes.
- Provider/cloud call is added.
- iOS provider/model key or direct provider/model call is added.
- Camera live cloud AI entry is added.
- Sensitive inference is added.
- Low Power Mode is enabled.
- Thermal state reaches serious or critical.
- Memory warning occurs.
- Preview FPS regression exceeds the future approved threshold.
- `productionReady:true`.

## Success Criteria

Future execution success means:

- Explicit C-R3-RUN approval phrase is present.
- Source/license/checksum/local-ignore prerequisites pass.
- Physical-device benchmark runs within the approved scope only.
- Hardware depth remains first priority.
- Sanitized aggregate metrics are reported.
- Raw artifacts and secrets are not printed, persisted, staged, or committed.
- No Camera runtime integration, upload path, provider/cloud call, or production rollout is added.
- `productionReady:false`.

Benchmark success does not imply production readiness. Production use remains blocked until representative-device latency, memory, FPS, thermal, battery, app-size, privacy, safety, and UX gates pass.

## Next Recommendation

If continuing Depth Anything, the next phase should be:

- `Phase 21-C-R3-RUN - Approved Depth Anything V2 Small Physical-device Benchmark`

That phase is not automatic. It requires the exact approval phrase above and operator confirmation of local ignored artifact readiness.
