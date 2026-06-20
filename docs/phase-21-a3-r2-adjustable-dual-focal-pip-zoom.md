# Phase 21-A3-R2 - Adjustable Dual Focal PiP Zoom

Status: implemented, pending Xcode physical-device verification
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-A3-R2 adds a Dazz-like dual focal / picture-in-picture camera mode for the local iOS Camera surface. The main preview stays full-frame on the selected physical lens while a center inset shows an adjustable tele-style crop. The PiP inset is default-on when Camera opens, uses an in-memory preview frame instead of a second `AVCaptureVideoPreviewLayer`, and keeps the surrounding view transparent. The captured photo burns the same inset into the output image.

## Completed Work

- Added a local-only dual focal PiP zoom configuration and renderer.
- Added a PiP viewfinder overlay with a focal label, rounded border, and live filter preview.
- Made the PiP inset visible by default when Camera opens.
- Replaced the duplicate nested camera preview with a local in-memory preview frame path so the main viewfinder stays full-size.
- Kept the main `CameraPreviewView` full-frame by default so PiP does not shrink the viewfinder into an aspect-fit black canvas.
- Replaced fixed focal buttons with continuous focal control.
- Added two continuous controls:
  - Drag inside the PiP inset from left to right.
  - Use the compact slider callout opened from the PiP chip.
- Enforced focal lower bound as the current selected lens focal length.
- Enforced a reasonable upper bound of `100mm`.
- Used equivalent-FOV crop math: `zoomFactor = targetFocalLength / selectedLensFocalLength`.
- Made the PiP inset size respond to focal length: larger near the selected lens focal length and smaller toward `100mm`.
- Added `LensOption.focalLengthMillimeters` so available device-specific lenses define the PiP lower bound.
- Added English and Traditional Chinese accessibility/localization strings.

## Focal Behavior

- On `24mm`, the continuous range is `24mm...100mm`.
- On `35mm`, the continuous range is `35mm...100mm`.
- On `77mm`, the continuous range is `77mm...100mm`.
- If the selected lens changes, the PiP focal length is clamped to the new lens range.
- A `50mm` target on a `35mm` base uses a `50 / 35` crop ratio, so the inset behaves like a 50mm-equivalent field of view from that selected lens.
- A second camera preview layer is not used, so the main viewfinder should remain normal size behind the transparent overlay.
- The main preview uses full-frame camera presentation while the PiP box alone changes size with focal length.

## Changed Files

- `ios-app/AIPhotoApp/Features/Camera/CameraDualFocalZoom.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/LensOption.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `README.md`
- `ios-app/README.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

## Boundary Confirmations

- Depth Anything runtime added: no
- Core ML inference run: no
- Provider/model/cloud call: no
- Camera live cloud AI entry: no
- Preview-frame upload: no
- Backend/iOS upload payload changed: no
- Raw frame/depth/image persistence beyond normal captured photo flow: no
- Sensitive inference added: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Build and run on iPhone. Confirm the PiP inset appears by default when Camera opens, the main viewfinder stays full-frame and visible behind the transparent overlay, the inset can be dragged continuously from the current lens lower bound to `100mm`, the inset becomes smaller as focal length increases, the slider callout moves smoothly without fixed jumps, switching lenses updates the lower bound, and captured photos include the same dual focal inset effect.

## Ready for Next Phase

Ready for MacBook/Xcode physical-device verification of Phase 21-A3-R2. After verification, compare against the roadmap again before deciding whether to continue camera QA or return to the Phase 21 on-device AI track. Not ready for production rollout.
