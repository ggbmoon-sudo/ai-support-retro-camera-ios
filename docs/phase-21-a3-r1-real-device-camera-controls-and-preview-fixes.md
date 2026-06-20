# Phase 21-A3-R1 - Real-device Camera Controls and Preview Fixes

Status: implemented, pending MacBook/Xcode physical-device verification
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-A3-R1 fixes real-device Camera runtime issues reported from iPhone testing. It keeps the work local to AVFoundation/SwiftUI Camera behavior and does not add cloud AI, provider calls, model files, upload changes, or production rollout.

## Fixed Issues

- Selfie/front-camera toggle now calls the AVFoundation camera switch path instead of only toggling a mock UI state.
- Lens options are detected from available physical camera devices and switching now reconfigures the active camera input.
- iPhone models without a telephoto camera should not show the unavailable 77mm option.
- The preview layer uses aspect-fit framing so the viewfinder better matches the captured 4:3 photo framing instead of visibly zooming/cropping.
- The legacy framed preview path is also aligned to a 3:4 viewfinder aspect ratio.
- Filter selection now applies a lightweight live viewfinder look preview before capture, while captured-photo rendering still uses the existing Core Image filter pipeline.
- Flash toggle is passed into `AVCapturePhotoSettings`; supported back cameras request hardware flash and the front camera keeps the local screen-flash behavior.
- Front-camera preview is mirrored for normal selfie composition.

## Changed Files

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureContextSnapshotter.swift`
- `ios-app/AIPhotoApp/Features/Camera/LensOption.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveFilterPreviewOverlay.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

## Verification Needed

- Build and run on a physical iPhone.
- Confirm the front/back toggle changes the real camera feed.
- Confirm the lens picker only shows lenses available on that iPhone and each option changes the active camera.
- Confirm viewfinder framing is no longer obviously zoomed compared with the captured photo.
- Confirm selecting filters changes the live viewfinder appearance before capture.
- Confirm back-camera flash fires when supported and enabled.
- Confirm front-camera screen flash still appears when flash is enabled.

## Boundary Confirmations

- Cloud AI added: no
- Provider/model call added: no
- Provider key or endpoint added to iOS: no
- Camera live cloud AI entry added: no
- Preview-frame upload added: no
- Upload payload changed: no
- Depth Anything / Core ML runtime added: no
- Raw frame/image/depth persistence added: no
- Sensitive inference added: no
- `productionReady:false` remains locked.

## Ready for Next Step

Ready for MacBook/Xcode physical-device verification. If these five reported bugs pass on iPhone, return to the roadmap decision point; if any remain, use a focused `Phase 21-A3-R2` real-device camera QA follow-up before continuing larger AI roadmap work.
