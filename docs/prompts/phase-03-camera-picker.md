# Phase 03: Camera + Photo Picker

## Phase name

Phase 03 - Camera + Photo Picker

## Goal

Create the Camera and Photo Picker scaffold for the iOS-first AI Support Retro Camera app.

This phase should add a single-photo camera capture flow and a single-image import flow using iOS-native APIs. The implementation should be enough to build and manually verify camera/picker UI wiring in Xcode, while staying strictly within Phase 03 boundaries.

This phase must not add filters, Firebase Storage upload, Firestore photo metadata, AI analysis, StoreKit, quota enforcement, or real external-service configuration.

## Current repo status

- Branch expected for this work: `feat/phase-02-auth`.
- Phase 00 is completed.
- Phase 01 UI scaffold is completed.
- Phase 02 Auth scaffold is completed.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 01/02 Mac/Xcode build succeeded on 2026-06-09.
- Phase 01 UI scaffold was verified in Mac/Xcode.
- Phase 02 Auth scaffold was verified in Mac/Xcode.
- Current app source lives under `ios-app/AIPhotoApp/`.
- Current app target should already include the Phase 01/02 Swift files.
- Current feature folders include:
  - `ios-app/AIPhotoApp/Features/Auth/`
  - `ios-app/AIPhotoApp/Features/Home/`
  - `ios-app/AIPhotoApp/Features/History/`
  - `ios-app/AIPhotoApp/Features/Settings/`
- Phase 03 has not started yet.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/03-camera-filter-image-pipeline.md
- docs/06-ui-ux-design-system.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- ios-app/README.md
- tests/manual-smoke-tests.md

Before editing, also run:

```bash
git status --short
find ios-app -maxdepth 2 -name '*.xcodeproj' -print
```

Confirm that:

- The current branch is appropriate for Phase 03 work.
- The working tree state is understood before edits.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- No unrelated uncommitted changes will be overwritten.

## This phase only does

- Work on Phase 03 Camera + Photo Picker only.
- Add a camera feature scaffold under `ios-app/AIPhotoApp/Features/Camera/`.
- Add a single-photo camera capture UI.
- Add a camera permission state UI.
- Add an `AVFoundation` camera session wrapper or service scaffold.
- Add a single-image photo import flow using `PhotosPicker` or `PHPicker`.
- Add a simple selected/captured image preview UI.
- Add local-only in-memory selected image state.
- Add basic error/loading/permission states for camera and photo picker.
- Add required camera/photo-library usage description placeholders to the Xcode project or documented target settings if project editing is unsafe.
- Wire Home CTA(s) to the Phase 03 camera/picker scaffold.
- Keep Auth, Home, History, and Settings behavior intact.
- Add localization keys for Camera / Photo Picker UI.
- Add manual smoke test checklist entries for Phase 03.
- Update `docs/phase-log.md` before finishing Phase 03 implementation.

## This phase does not do

- Do not implement filters or Core Image presets.
- Do not implement Firebase Storage upload.
- Do not implement Firestore photo metadata.
- Do not implement AI analysis.
- Do not implement Cloud Functions AI proxy.
- Do not implement StoreKit.
- Do not implement subscription or paywall logic.
- Do not implement quota enforcement.
- Do not implement history persistence.
- Do not implement local download/export.
- Do not implement account deletion backend.
- Do not add Gemini, OpenAI, Firebase, Google, or Apple credentials.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`, `.firebaserc`, production plist files, private keys, OAuth secrets, Firebase project IDs, Google keys, Apple Team IDs, or API keys.
- Do not connect paid external services.
- Do not start Phase 04.
- Do not rewrite Phase 01/02 architecture.
- Do not remove existing Auth scaffold.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new files:

```text
ios-app/AIPhotoApp/Features/Camera/CameraView.swift
ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
ios-app/AIPhotoApp/Features/Camera/CameraPermissionState.swift
ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift
ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift
ios-app/AIPhotoApp/Features/Camera/PhotoPickerView.swift
ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
ios-app/AIPhotoApp/Models/CapturedPhoto.swift
```

Suggested existing files to modify:

```text
ios-app/AIPhotoApp/App/MainTabShellView.swift
ios-app/AIPhotoApp/Features/Home/HomeView.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/AIPhotoApp.xcodeproj/project.pbxproj
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Only modify files needed for the Phase 03 scaffold. Keep changes small and reviewable.

## Technical requirements

- Use Swift + SwiftUI.
- Use `AVFoundation` for camera scaffold.
- Use `PhotosPicker` from PhotosUI where practical. Use PHPicker only if it better fits the existing target and deployment settings.
- Capture/import exactly one still image at a time.
- Keep selected/captured image state local and in memory.
- Do not persist image data to disk unless needed for a temporary preview, and document any temporary storage if added.
- Do not upload images.
- Do not run AI analysis.
- Do not apply filters.
- Do not add third-party camera libraries.
- Use existing design system tokens and components where possible.
- Keep UI copy localizable.
- Use clear permission states:
  - not determined
  - authorized
  - denied/restricted
  - unavailable
- If the simulator cannot provide real camera capture, provide a graceful unavailable state and verify photo import separately.
- If `UIViewControllerRepresentable` / `UIViewRepresentable` is needed for preview or picker bridging, keep wrappers small and isolated.
- Avoid storing raw image data in logs.
- Avoid logging file paths, signed URLs, image base64, or sensitive prompts.
- If Xcode project settings need usage descriptions, add placeholder-safe strings only:
  - `NSCameraUsageDescription`
  - `NSPhotoLibraryUsageDescription` or equivalent picker-related usage string if required by the chosen API
- Do not add real bundle IDs, Apple Team IDs, signing credentials, or provisioning profiles.

## UI requirements

- Home should expose a clear entry into the Camera / Photo Picker scaffold.
- Camera UI should include:
  - live preview or a clear unavailable-state placeholder
  - capture action
  - import-from-library action
  - selected/captured image preview
  - retake / choose another action
  - continue placeholder that does not trigger filters, upload, AI, or paid features
- Permission-denied UI should explain that camera access is needed and point users to Settings without forcing any external setup.
- Photo picker should allow one image only.
- The UI must make it clear that Phase 03 is local-only.
- Guest / mock-auth state from Phase 02 should continue to allow access to the local camera/picker scaffold.

## Privacy and App Store requirements

- Request camera access only when the camera flow needs it.
- Do not imply photos are uploaded or analyzed in this phase.
- Do not request unnecessary permissions.
- Do not add tracking, ads, analytics, or personalized ads SDKs.
- Do not claim account deletion, cloud history, cloud backup, AI analysis, or subscription behavior exists.
- Keep `trainingConsent` assumptions unchanged; this phase should not introduce training consent flows.

## Acceptance criteria

- `docs/prompts/phase-03-camera-picker.md` has been read and followed.
- Phase 01/02 Mac/Xcode build success is preserved and recorded in `docs/phase-log.md`.
- `ios-app/AIPhotoApp.xcodeproj` remains present.
- Camera scaffold exists under `ios-app/AIPhotoApp/Features/Camera/`.
- The app builds in Xcode after Phase 03 changes.
- Home can navigate to the Camera / Photo Picker scaffold.
- Camera permission states are represented.
- Photo picker can select one image.
- Captured or imported image can be previewed locally.
- No filters are implemented.
- No Firebase Storage upload is implemented.
- No Firestore metadata persistence is implemented.
- No AI analysis is implemented.
- No StoreKit, paywall, subscription, or quota enforcement is implemented.
- No true secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` are added.
- Existing Auth scaffold still builds.
- Existing Home / History / Settings tabs still build.
- Localization includes Camera / Photo Picker strings in `en` and `zh-Hant`.
- `tests/manual-smoke-tests.md` includes Phase 03 checks.
- `docs/phase-log.md` records Phase 03 status, changed files, checks, known TODOs, and readiness for Phase 04.

## Tests / manual checks

Run or perform:

- `git status --short` before and after implementation.
- Confirm `ios-app/AIPhotoApp.xcodeproj` exists.
- Build the app target in Xcode.
- If available, run on a physical iPhone and verify:
  - camera permission prompt appears when entering camera flow
  - camera preview appears after permission is granted
  - capture action produces a local preview
  - retake clears the preview and returns to capture state
- On simulator or device, verify:
  - photo picker opens
  - selecting one image shows local preview
  - choosing another image replaces the previous preview
  - continue placeholder does not start filters, upload, AI, StoreKit, or quota behavior
  - Auth sign-out still works
  - Home / History / Settings still render
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, production plist files, private keys, OAuth secrets, Firebase project IDs, Apple credentials, Google keys, Gemini keys, OpenAI keys, or API keys were added.
- Confirm source files do not import Firebase Storage, Firestore, AI SDKs, StoreKit, Gemini, or OpenAI for Phase 03.
- Confirm Phase 04 is not started.

## Completion requirement

Before finishing Phase 03 implementation, update `docs/phase-log.md`.

The Phase 03 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether Xcode build was run
- whether camera was tested on simulator or physical device
- whether photo picker was tested
- whether filters/upload/AI/StoreKit were intentionally not implemented
- ready for Phase 04: yes/no

Do not mark Phase 04 started.
