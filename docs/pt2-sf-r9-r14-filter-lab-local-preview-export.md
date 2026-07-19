# PT2-SF-R9-R14 - Filter Lab Local Preview Export

Status: implemented; pending Mac/Xcode physical-device verification
Date: 2026-07-19
Production readiness: `productionReady:false`

## Outcome

Filter Lab users can press and hold the filtered/after preview to save the currently rendered result to Apple Photos. The saved asset is the exact local preview at the selected intensity, currently bounded to a 1600-pixel maximum long edge by the existing R12 memory-safety path. It is intended for visual comparison and is not presented as a full-resolution export.

## Implementation

- Added an explicit long-press gesture only to the filtered/after preview.
- Added a VoiceOver custom action for the same local save operation.
- Blocks export while the preview is rendering or another save is running.
- Requests Apple Photos `.addOnly` authorization only after the user invokes save.
- Writes only `previewImage` through `PHPhotoLibrary`; the style reference and apply/original inputs are not exported by this action.
- Shows localized saving, success, denied, and failure messages.
- Added `NSPhotoLibraryAddUsageDescription` to both Xcode build configurations.

## Verification

- Filter Lab local export plus recipe fidelity source-contract tests: `7/7` passed during implementation.
- `git diff --check`: passed.
- Xcode build: pending Mac/Xcode.
- Physical-device permission, Photos asset, long-press, VoiceOver, and 1600-pixel output checks: pending.

## Boundaries

- Local user-initiated Photos write only; no background save.
- No backend or provider call is made by export.
- No upload payload, style-reference upload count, or consent flow change.
- Apply/original image remains local-only.
- No Camera cloud AI entry, provider key/URL/SDK, Firebase write, history persistence, or production rollout.
- `productionReady:false` remains locked.
