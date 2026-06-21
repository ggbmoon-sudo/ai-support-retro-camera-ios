# Phase 21-A3-R3 - Focal Framing Box Crop

Status: implemented, pending Xcode physical-device verification
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-A3-R3 replaces the earlier dual-video / PiP-style focal preview with a simpler framing-and-cropping model. The Camera preview stays as the standard 1x aspect-fit camera feed so it matches the captured-photo framing more closely. The focal UI is now only a transparent movable framing box. The image inside the box is not magnified during preview; after shutter, the full-resolution captured photo is cropped to the box area and the saved/selected photo becomes only that crop.

## Completed Work

- Removed the in-memory PiP preview-frame stream used for real-time inset rendering.
- Restored `CameraPreviewView` default gravity to `resizeAspect` so the preview is not full-screen zoom-cropped.
- Replaced the old inset renderer with `CameraDualFocalPhotoCropper`.
- Changed the overlay into a transparent UI framing box only.
- Added free drag/move behavior for the framing box.
- Kept the slider as focal-length control for box size.
- Mapped framing-box center/size ratios to captured image pixel crop coordinates.
- Made final captured output only the crop area inside the framing box.
- Kept everything local-only and on-device.

## Behavior

- Preview remains the normal 1x camera feed.
- The framing box is a UI guide only.
- The area inside and outside the box shows the same camera feed with no live magnification.
- Dragging the box moves the crop target.
- Adjusting focal length changes the box size.
- Pressing shutter captures the full-resolution photo first, then crops the captured image to the box.
- The crop uses the selected lens focal length as the lower bound and `100mm` as the upper bound.
- Front-camera preview mirroring is accounted for when mapping the box to captured pixels.

## Changed Files

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraDualFocalZoom.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `README.md`
- `ios-app/README.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

## Boundary Confirmations

- Real-time dual video rendering: removed
- Live inset magnification: removed
- Preview-frame upload: no
- Backend/iOS upload payload changed: no
- Depth Anything runtime added: no
- Core ML inference run: no
- Provider/model/cloud call: no
- Camera live cloud AI entry: no
- Raw frame/depth/image persistence beyond normal captured photo flow: no
- Sensitive inference added: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Build and run on iPhone. Confirm the Camera preview is no longer zoomed and matches the captured-photo aspect more closely, the focal box is transparent and movable, there is no magnified live image inside the box, the slider changes box size, and the captured result is only the area inside the box.

## Ready for Next Phase

Current practical next step remains MacBook/Xcode physical-device verification of Phase 21-A3-R3 framing crop behavior. If crop mapping is still off, use another focused real-device QA follow-up before returning to larger roadmap work. Not ready for production rollout.
