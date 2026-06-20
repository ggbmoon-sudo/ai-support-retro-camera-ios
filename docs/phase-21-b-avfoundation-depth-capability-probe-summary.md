# Phase 21-B - AVFoundation Depth Capability Probe Summary

Status: implemented, pending Xcode verification
Date: 2026-06-20
Production readiness: `productionReady:false`

## Summary

Phase 21-B adds an AVFoundation-only depth capability probe to the on-device live framing track. It detects whether the active camera/photo-output path supports hardware depth data delivery or portrait effects matte support, then converts that into local `DepthSignals` capability state for the existing ephemeral `LiveFrameSignals` contract.

This phase does not capture, enable, persist, log, upload, or display raw depth maps. It does not add Depth Anything, Florence-2, Core ML packages, model files, cloud calls, provider keys, backend endpoints, upload payload changes, or production rollout.

## Implemented Scope

- Added `CameraDepthCapabilityProbe` for AVFoundation support detection.
- Added capability states:
  - `hardwareDepthAvailable`
  - `portraitMatteAvailable`
  - `depthUnavailable`
- Extended `LiveFrameDepthState` with the same safe states.
- Stores only bucketed in-memory capability state in `DepthSignals`.
- Threads the depth capability state into the existing local Vision geometry analysis path.
- Leaves foreground/background separation, subject distance, and depth confidence buckets as `unknown` until a future phase explicitly uses real depth data.

## Safety Boundary

- No `AVCaptureDepthDataOutput` was added.
- No `isDepthDataDeliveryEnabled` / portrait matte delivery enablement was added.
- No `AVDepthData` object is read, logged, persisted, or uploaded.
- No raw depth map, raw frame, GPS, EXIF, raw sensor stream, face descriptor, identity data, or sensitive attribute is persisted.
- Depth is capability metadata only in this phase.

## Files Added

- `ios-app/AIPhotoApp/Features/Camera/CameraDepthCapabilityProbe.swift`

## Files Updated

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveFrameGeometrySignals.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceVisionGeometryAnalyzer.swift`

## Xcode Verification Needed

- Build and run the app in Xcode.
- Open Camera with local guidance enabled.
- Confirm Camera starts on devices with and without depth support.
- Confirm no crash occurs on Simulator where depth is expected to be unavailable.
- Confirm capture/import/filter/selected-photo flows still work.
- Confirm no raw depth map appears in logs, UI, history, upload payloads, or saved artifacts.

## Next Recommended Phase

After Phase 21-B is committed and pushed, the next recommended phase is:

`Phase 21-C - Depth Anything V2 Small Core ML Sandbox`

Phase 21-C must remain debug/benchmark-only unless separately approved, must not bundle or download model files by default, must not persist raw frames/depth, and must keep `productionReady:false`.
