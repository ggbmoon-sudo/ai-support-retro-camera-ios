# Phase 04: Filter Presets

## Phase name

Phase 04 - Local Core Image Filter Presets

## Goal

Build the first local-only Core Image filter pipeline for the iOS-first AI Support Retro Camera app.

This phase should let a photo captured or imported in Phase 03 receive a basic retro film preset and show a local preview. It should add a data-driven preset model, at least three retro film presets, a preset selector UI, and local in-memory filtered preview state.

This phase must not add upload, persistence, AI, StoreKit, quotas, export/download, paid presets, or Phase 05 work.

## Current repo status

- Branch expected for this work: `feat/phase-02-auth`.
- Latest known commit before this phase prompt: `d22fe41 feat: add phase 03 camera and photo picker scaffold`.
- Local branch is expected to be synchronized with `origin/feat/phase-02-auth`.
- Working tree should be clean before starting Phase 04 implementation.
- Phase 00 repo setup is completed.
- Phase 01 UI scaffold is completed.
- Phase 02 Auth scaffold is completed.
- Phase 01/02 Mac/Xcode build succeeded.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03 Camera + Photo Picker scaffold is completed, manually checked in Xcode, committed, and pushed.
- `docs/phase-log.md` records Phase 03 completed / manually checked.
- `tests/manual-smoke-tests.md` includes Phase 03 checks.
- Current app source lives under `ios-app/AIPhotoApp/`.
- Phase 04 has not been implemented yet.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/03-camera-filter-image-pipeline.md
- docs/06-ui-ux-design-system.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- docs/prompts/phase-04-filters.md
- ios-app/README.md
- tests/manual-smoke-tests.md

## Pre-implementation checks

Before editing, run:

```bash
pwd
git branch --show-current
git status --short
git log --oneline -3
find ios-app -maxdepth 2 -name '*.xcodeproj' -print
rg -n "Phase 03|Ready for Phase 04|Phase 04" docs/phase-log.md
rg -n "CameraView|SelectedPhotoPreview|CapturedPhoto|PhotosPicker" ios-app/AIPhotoApp -g '*.swift'
```

Confirm that:

- The repo path is `/Volumes/moon/Projects/ai-support-retro-camera-ios`.
- The current branch is `feat/phase-02-auth`, unless the user explicitly moved this work to another branch.
- The working tree state is understood before edits.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03 source files are present and buildable.
- No unrelated uncommitted changes will be overwritten.
- Phase 04 implementation has been explicitly requested by the user.

## This phase only does

- Work on Phase 04 Filter Presets only.
- Add a local Core Image filter pipeline.
- Add at least three local retro film presets.
- Add a filter preset model.
- Add a data-driven filter preset catalog.
- Add a preset selector UI.
- Add a local filtered preview for a captured or imported photo.
- Allow returning to original / none.
- Apply the selected preset to the currently captured or imported image.
- Keep source image, selected preset, and rendered preview state local and in memory.
- Add localization strings for filter UI in English and Traditional Chinese.
- Update manual smoke tests for Phase 04.
- Update `docs/phase-log.md` before finishing Phase 04 implementation.

## This phase does not do

- Do not implement Firebase Storage upload.
- Do not implement Firestore photo metadata.
- Do not implement AI analysis.
- Do not implement Cloud Functions.
- Do not implement Cloud Functions AI proxy.
- Do not implement StoreKit.
- Do not implement subscription or paywall logic.
- Do not implement quota enforcement.
- Do not implement history persistence.
- Do not implement local download/export.
- Do not implement half-frame.
- Do not implement double exposure.
- Do not implement a full camera/lens library.
- Do not implement paid presets.
- Do not add real Firebase keys.
- Do not add real Google keys.
- Do not add real Apple credentials.
- Do not add Gemini, OpenAI, or other AI API keys.
- Do not add Firebase project IDs.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`, `.firebaserc`, production plist files, private keys, OAuth secrets, signing credentials, provisioning profiles, or API keys.
- Do not connect paid external services.
- Do not persist image history.
- Do not save filtered images to the user's photo library.
- Do not start Phase 05.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new files:

```text
ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift
ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
```

Suggested existing files to modify:

```text
ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
ios-app/AIPhotoApp/Models/CapturedPhoto.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/AIPhotoApp.xcodeproj/project.pbxproj
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Only modify files needed for the Phase 04 local filter scaffold. Keep changes small and reviewable.

## Technical requirements

- Use Swift + SwiftUI.
- Use Core Image for local image processing.
- Do not use third-party filter libraries.
- Do not use Metal for this phase, except as a TODO or future note if needed.
- Keep filter processing on device and local only.
- Do not upload images.
- Do not persist images to disk unless a temporary preview mechanism is unavoidable and clearly documented.
- Do not save images to Photos.
- Do not log raw image data, base64, file paths, signed URLs, prompts, or other sensitive image-related data.
- Avoid blocking the main thread. Use async work, a background queue, or a dedicated rendering service where needed.
- Update SwiftUI UI state on the main actor.
- Reuse a `CIContext` where practical instead of creating one for every render.
- Preserve the original selected/captured image in memory so users can switch presets or return to original.
- Handle image orientation correctly enough for camera and photo-library previews.
- Keep preset parameters data-driven. Do not hard-code all filter behavior directly inside SwiftUI views.
- Suggested preset model fields include:
  - stable id
  - localized name key
  - localized description key
  - preview tint or accent metadata if useful
  - ordered Core Image adjustment parameters
  - flag or case for original / none
- Suggested presets:
  - `none` / Original
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Suggested Core Image operations may include:
  - `CIExposureAdjust`
  - `CITemperatureAndTint`
  - `CIColorControls`
  - `CIToneCurve`
  - `CIVignette`
  - `CISharpenLuminance`
- Keep the pipeline tolerant of filter failures. If rendering fails, show the original image with a clear local error state.
- Do not import Firebase Storage, Firestore, AI SDKs, StoreKit, Gemini, OpenAI, or paid-service SDKs in Phase 04.

## UI requirements

- Camera / Photo Preview should expose a preset selector when a captured or imported image exists.
- The selector should include at least:
  - Original / None
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Users should be able to switch presets and see the filtered preview update.
- The UI may show either a filtered preview or a simple before/after comparison.
- Retake / choose another should continue to clear or replace the current local image state.
- Continue placeholder must not trigger upload, AI, StoreKit, quotas, history persistence, export, or Phase 05 behavior.
- UI copy must clearly indicate that Phase 04 is local-only.
- Keep Auth, Home, History, Settings, and Phase 03 Camera / Photo Picker flows buildable.
- Keep UI copy localizable.
- Use existing design system tokens and components where practical.
- Avoid making this phase look like final paid preset or AI advice functionality.

## Privacy / App Store requirements

- Filter processing must stay on device.
- Do not upload, sync, persist, analyze, or share images.
- Do not add tracking, ads, analytics, or personalized ad SDKs.
- Do not request new permissions beyond those already needed for camera/photo picker.
- Do not claim cloud backup, AI analysis, history persistence, paid subscription, account deletion backend, or export behavior exists.
- Do not add or expose secrets, API keys, credentials, Firebase project IDs, Apple Team IDs, Google credentials, or `GoogleService-Info.plist`.
- Do not add image data to logs, crash messages, debug text, or analytics events.
- Keep any privacy copy accurate: Phase 04 is local-only preview.

## Acceptance criteria

- `docs/prompts/phase-04-filters.md` has been read and followed.
- The app builds in Xcode after Phase 04 changes.
- Phase 01/02 Auth, Home, History, and Settings flows still build.
- Phase 03 Camera + Photo Picker scaffold still builds.
- Captured or imported image can be previewed locally.
- Preset selector appears when an image is available.
- At least three retro presets are available, plus Original / None.
- Switching presets updates the local filtered preview.
- Returning to Original / None shows the unfiltered image.
- Filter pipeline uses Core Image.
- Preset definitions are data-driven outside SwiftUI view layout code.
- Filter state remains local and in memory.
- No Firebase Storage upload is implemented.
- No Firestore metadata persistence is implemented.
- No AI analysis is implemented.
- No Cloud Functions integration is implemented.
- No StoreKit, paywall, subscription, or quota enforcement is implemented.
- No history persistence is implemented.
- No local download/export is implemented.
- No half-frame, double exposure, full camera/lens library, or paid presets are implemented.
- No true secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` are added.
- Localization includes Phase 04 filter strings in `en` and `zh-Hant`.
- `tests/manual-smoke-tests.md` includes Phase 04 checks.
- `docs/phase-log.md` records Phase 04 status, changed files, checks, known TODOs, and readiness for Phase 05.

## Tests / manual checks

Run or perform:

- `git status --short` before and after implementation.
- Confirm `ios-app/AIPhotoApp.xcodeproj` exists.
- Build the app target in Xcode.
- In an iOS Simulator:
  - sign in with mock Auth or continue as guest
  - open Home
  - open the Camera scaffold
  - import one image with the photo picker
  - confirm the selected image appears
  - switch between Original / None and each retro preset
  - confirm the preview visibly updates
  - confirm retake / clear / choose another still works
  - confirm Continue placeholder does not upload, run AI, start StoreKit, enforce quota, persist history, or export
  - confirm Home / History / Settings still render
- On a physical iPhone or iPad, if available:
  - open the Camera scaffold
  - grant camera permission if needed
  - capture one still photo
  - confirm captured photo appears
  - switch between Original / None and each retro preset
  - confirm the preview visibly updates
  - import one library image and confirm it replaces the previous preview
  - confirm no image is uploaded, persisted, exported, or saved to Photos
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, production plist files, private keys, OAuth secrets, Firebase project IDs, Apple credentials, Google keys, Gemini keys, OpenAI keys, or API keys were added.
- Confirm source files do not import Firebase Storage, Firestore, AI SDKs, StoreKit, Gemini, or OpenAI for Phase 04.
- Confirm Phase 05 is not started.

## Completion requirement

Before finishing Phase 04 implementation, update `docs/phase-log.md`.

The Phase 04 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether Xcode build was run
- whether photo import plus filter preview was tested
- whether camera capture plus filter preview was tested on a physical device, or explicitly deferred
- whether upload, Firestore, AI, Cloud Functions, StoreKit, quota, history persistence, export, paid presets, and Phase 05 were intentionally not implemented
- ready for Phase 05: yes/no

Also update `tests/manual-smoke-tests.md` with Phase 04 manual checks and results.

After implementation:

- Run or request an Xcode build verification.
- Manually test importing a photo and applying filters.
- If a physical iPhone or iPad is available, manually test capturing a photo and applying filters.
- Do not automatically commit or push.
- Wait for user Xcode verification before any commit/push request.
- Do not mark Phase 05 started.
