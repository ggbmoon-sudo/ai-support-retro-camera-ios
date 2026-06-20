# Phase 21-A - On-device Vision Geometry Spike Summary

Status: implemented, pending Xcode verification
Date: 2026-06-20
Production readiness: `productionReady:false`

## Summary

Phase 21-A starts the revised on-device live framing intelligence track. It extends the existing local live guidance path with Apple Vision geometry analysis for ephemeral camera preview frames only.

This phase uses Apple Vision / AVFoundation only. It does not add cloud VLM, provider calls, model files, Core ML packages, frame upload, backend upload payload changes, iOS provider keys, or production rollout.

## Implemented Scope

- Added typed local-only live frame signal contracts for geometry, depth state, composition, safety flags, and hint candidates.
- Added a Vision geometry analyzer that runs face rectangle and human body pose requests on sampled preview frames.
- Computes normalized subject, face, and body boxes as geometry only.
- Computes safe composition buckets for edge margin, headroom, footroom, subject size ratio, rule-of-thirds proximity, subject balance, negative space, and vertical balance.
- Added a coordinate mapper for future debug overlays from normalized Vision rectangles to SwiftUI overlay rectangles.
- Reused the existing local live guidance pipeline and stability controller.
- Kept existing short, non-judgmental, retro-aware copy keys instead of adding score/problem/fix/retake language.

## Local Runtime Boundary

- Preview frames remain ephemeral and in memory.
- No raw frame, raw image, GPS, EXIF, raw sensor stream, face descriptor, identity data, or sensitive attribute is persisted.
- No preview frame is uploaded.
- No backend endpoint or upload payload changed.
- No provider SDK, provider API key, model API key, or direct provider/model call was added to iOS.
- No Camera live cloud AI entry was added.

## Safety Boundary

The Vision output is treated as geometry only:

- face/person/body regions are rectangles or pose-derived bounds only.
- no identity recognition.
- no age, gender, emotion, attractiveness, skin, health, ethnicity, religion, disability, body judgement, or other sensitive inference.
- no score/rating language.
- no raw model/provider output exists in this phase.

## Files Added

- `ios-app/AIPhotoApp/Features/Camera/LiveFrameGeometrySignals.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceVisionGeometryAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraOverlayCoordinateMapper.swift`

## Files Updated

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift`

## Xcode Verification Needed

- Build and run the app in Xcode.
- Open Camera with local guidance enabled.
- Confirm live guidance still appears without crashes.
- Confirm guidance remains short and non-judgmental.
- Confirm no Camera cloud AI entry appears.
- Confirm no provider/model key or endpoint appears in iOS.
- Confirm photo capture/import and selected-photo flow still work.

## Next Recommended Phase

After Phase 21-A is committed and pushed, the next recommended phase is:

`Phase 21-B - AVFoundation Depth Capability Probe`

Phase 21-B should detect hardware depth / portrait matte availability only, use depth as composition/foreground-background signal only, persist no depth maps, upload nothing, and keep `productionReady:false`.
