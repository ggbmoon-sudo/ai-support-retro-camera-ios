# Phase 05: Firebase Storage + Firestore

## Phase name

Phase 05 - Firebase Storage / Firestore Save Scaffold

## Goal

Create a safe, mockable Firebase Storage / Firestore save architecture scaffold for the iOS-first AI Support Retro Camera app.

This phase should prepare the app for a future cloud history flow where a single selected/captured and optionally filtered photo can be saved to Firebase Storage and represented by Firestore metadata. In this phase, the implementation must remain buildable without real Firebase credentials or production configuration.

This phase should add a photo save service protocol, mock save service, photo metadata model, save state model, Firebase adapter placeholder/TODO, Storage path convention draft, Firestore document shape draft, Save placeholder UI after the filtered preview, local mock success/failure states, documentation updates, manual smoke tests, and phase log updates.

This phase must not perform real production upload, real Firestore writes, AI analysis, Cloud Functions AI proxy work, StoreKit/subscription/quota work, history persistence, export/save to Photos, account deletion backend, public sharing, paid history limits, or Phase 06 work.

## Current repo status

- Branch expected for this work: `feat/phase-02-auth`.
- Latest known commit before this phase prompt: `2686158 feat: add phase 04 local filter presets`.
- Local branch is expected to be synchronized with `origin/feat/phase-02-auth`.
- Working tree should be clean before starting Phase 05 implementation.
- Phase 00 repo setup is completed.
- Phase 01 UI scaffold is completed.
- Phase 02 Auth scaffold is completed.
- Phase 01/02 Mac/Xcode build succeeded.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03 Camera + Photo Picker scaffold is completed, committed, and pushed.
- Phase 04 Local Core Image Filter Presets is completed, manually verified in Xcode / Simulator, committed, and pushed.
- `docs/phase-log.md` records Phase 04 completed / manually checked.
- `tests/manual-smoke-tests.md` includes Phase 04 checks.
- Current app source lives under `ios-app/AIPhotoApp/`.
- Phase 05 has not been implemented yet.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/03-camera-filter-image-pipeline.md
- docs/05-firebase-storage-firestore-functions.md
- docs/07-subscription-quota-storekit.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- docs/prompts/phase-04-filters.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- ios-app/README.md
- tests/manual-smoke-tests.md

## Pre-implementation checks

Before editing, run:

```bash
pwd
git branch --show-current
git status --short
git status -sb
git log --oneline -3
git rev-list --left-right --count origin/feat/phase-02-auth...HEAD
find ios-app -maxdepth 2 -name '*.xcodeproj' -print
rg -n "Phase 04|Ready for Phase 05|Phase 05" docs/phase-log.md
rg -n "FilteredPhotoPreview|FilterPreset|CameraViewModel|HistoryView|SavedPhoto|PhotoSave" ios-app/AIPhotoApp -g '*.swift'
find . -name 'GoogleService-Info.plist' -print
find . -name '.env' -o -name '.firebaserc' -print
```

Confirm that:

- The repo path is `/Volumes/moon/Projects/ai-support-retro-camera-ios`.
- The current branch is `feat/phase-02-auth`, unless the user explicitly moved this work to another branch.
- The working tree state is understood before edits.
- The latest commit is the Phase 04 local filter presets commit.
- The local branch is synchronized with `origin/feat/phase-02-auth`.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03 and Phase 04 source files are present and buildable.
- No unrelated uncommitted changes will be overwritten.
- No real Firebase config, secrets, API keys, project IDs, `.env`, `.firebaserc`, or `GoogleService-Info.plist` are present.
- Phase 05 implementation has been explicitly requested by the user.

## This phase only does

- Work on Phase 05 Firebase Storage / Firestore save scaffold only.
- Add a photo save service protocol.
- Add a mock photo save service.
- Add a photo metadata model.
- Add a save state model, for example:
  - idle
  - saving
  - saved
  - failed
- Add a Firestore document shape draft.
- Add a Storage path convention draft.
- Add a placeholder Firebase adapter or clearly documented TODO.
- Add Save placeholder UI after the filtered preview.
- Add local mock save success and mock failure flow.
- Optionally let History show a mock saved item if it can be done safely without true persistence.
- Keep all save behavior mock/local unless the user explicitly provides Firebase setup and asks for real Firebase connection in a later task.
- Keep Auth, Home, Camera, Filter Preview, History, and Settings buildable.
- Add localization strings for save/storage UI in English and Traditional Chinese.
- Update `ios-app/README.md` with Phase 05 notes.
- Update `tests/manual-smoke-tests.md` with Phase 05 manual checks.
- Update `docs/phase-log.md` before finishing Phase 05 implementation.

## This phase does not do

- Do not add real `GoogleService-Info.plist`.
- Do not add Firebase project ID.
- Do not add `.firebaserc`.
- Do not add `.env`.
- Do not add API keys.
- Do not add private keys.
- Do not add OAuth secrets.
- Do not add Apple Team ID.
- Do not add signing credentials.
- Do not add provisioning profiles.
- Do not upload to Firebase production.
- Do not enable real Firestore writes.
- Do not enable real Storage writes.
- Do not enable real Firebase SDK calls unless the user explicitly provides Firebase setup and confirms real Firebase connection in a later task.
- Do not make the app fail to build if Firebase SDK or config is absent.
- Do not implement AI analysis.
- Do not implement Cloud Functions AI proxy.
- Do not implement Gemini.
- Do not implement OpenAI.
- Do not implement StoreKit.
- Do not implement subscription.
- Do not implement quota enforcement.
- Do not implement account deletion backend.
- Do not implement public sharing.
- Do not implement export.
- Do not save to Photos.
- Do not implement paid history limit.
- Do not persist real history.
- Do not start Phase 06.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new files:

```text
ios-app/AIPhotoApp/Models/SavedPhoto.swift
ios-app/AIPhotoApp/Models/PhotoSaveState.swift
ios-app/AIPhotoApp/Services/PhotoStorage/PhotoSaveService.swift
ios-app/AIPhotoApp/Services/PhotoStorage/MockPhotoSaveService.swift
ios-app/AIPhotoApp/Services/PhotoStorage/FirebasePhotoSaveService.swift
ios-app/AIPhotoApp/Services/PhotoStorage/PhotoStoragePath.swift
```

Suggested existing files to modify:

```text
ios-app/AIPhotoApp/Features/Camera/CameraView.swift
ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
ios-app/AIPhotoApp/Features/History/HistoryView.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Only modify files needed for the Phase 05 mock save scaffold. Keep changes small and reviewable.

If new Swift files are added under `ios-app/AIPhotoApp/`, confirm Xcode target membership through the existing Xcode file-system synchronized group and by running an Xcode build. If project editing becomes necessary, keep `ios-app/AIPhotoApp.xcodeproj/project.pbxproj` changes minimal and do not add user-specific Xcode files.

## Technical requirements

- Use Swift + SwiftUI.
- The service layer must be mockable.
- UI must depend on a protocol such as `PhotoSaveService`, not directly on a concrete Firebase implementation.
- Provide `MockPhotoSaveService` for local success and failure paths.
- Provide `FirebasePhotoSaveService` only as a placeholder/TODO unless Firebase SDK and config are explicitly provided later.
- If Firebase SDK/config is absent, the app must still build.
- Do not import Firebase modules in files that must build without Firebase dependencies.
- If a Firebase adapter file is added, it should avoid Firebase imports or wrap them behind clearly documented future setup conditions.
- Do not upload image bytes in this phase.
- Do not persist images to disk in this phase.
- Do not save images to Photos.
- Do not write real Firestore documents.
- Do not write real Storage objects.
- Do not log raw image data, base64 image content, local file paths, signed URLs, prompts, or sensitive metadata.
- Do not put raw image data or base64 into any metadata model.
- Do not store email in Storage paths.
- Do not expose user email in Firestore document paths.
- Use a stable `photoId` and `ownerId`/`userId` convention for drafts.
- Save state should be visible to UI and easy to test.
- Mock save should return a `SavedPhoto` metadata object without contacting a backend.
- Mock failure should produce a local error state without retrying network calls.
- Keep selected/captured/filtered image state local unless a real Firebase setup is explicitly requested later.
- Keep Phase 03 camera and Phase 04 filters behavior intact.
- Keep all UI copy localizable.

### Suggested service shape

Suggested protocol:

```swift
protocol PhotoSaveService {
    func savePhoto(_ request: PhotoSaveRequest) async throws -> SavedPhoto
}
```

Suggested request/model concepts:

```text
PhotoSaveRequest
- ownerId
- source
- sourceImage
- filteredPreviewImage optional
- filterPresetId
- createdAt

SavedPhoto
- id / photoId
- ownerId
- source
- filterPresetId
- storagePath
- thumbnailPath optional
- analysisStatus
- createdAt
- isMock
```

Do not treat this suggested shape as mandatory if the existing codebase suggests a cleaner local pattern, but keep the same privacy and mockability constraints.

### Firestore document shape draft

Document path draft:

```text
users/{ownerId}/photos/{photoId}
```

Suggested metadata draft:

```json
{
  "photoId": "photo_123",
  "ownerId": "firebase_uid_or_mock_user_id",
  "source": "camera|photoLibrary",
  "filterPresetId": "classic-film",
  "storagePath": "users/{ownerId}/photos/{photoId}/preview.jpg",
  "thumbnailPath": "users/{ownerId}/photos/{photoId}/thumb.jpg",
  "originalPath": null,
  "analysisStatus": "not_started",
  "status": "saved_mock|pending_upload|uploaded|failed",
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp"
}
```

Requirements for the metadata draft:

- Do not store raw image data.
- Do not store base64.
- Do not store local file paths.
- Do not store signed URLs.
- Do not store emails.
- Do not store AI output in Phase 05.
- Keep `analysisStatus` only as a placeholder, for example `not_started`.
- Keep quota/subscription data out of this photo doc in Phase 05.

### Storage path convention draft

Suggested path convention:

```text
users/{ownerId}/photos/{photoId}/preview.jpg
users/{ownerId}/photos/{photoId}/thumb.jpg
users/{ownerId}/photos/{photoId}/original.jpg        // future/VIP only, not Phase 05
```

Alternative naming may use `filtered.jpg` instead of `preview.jpg` if that better matches the implemented UI, but choose one convention and document it.

Requirements for paths:

- Use `ownerId` / `userId`, not email.
- Use generated `photoId`, not user-visible titles.
- Do not include local file paths.
- Do not include Firebase project IDs.
- Do not include bucket names or production URLs in code.
- Do not produce signed URLs in this phase.

## UI requirements

- After a captured/imported image and filtered preview exists, show a Save placeholder / Save to cloud mock button.
- UI must clearly state that Phase 05 save is mock/scaffold only and not connected to real Firebase.
- Save button should trigger mock save success/failure only.
- Save success state must be visible.
- Save failure state must be visible and recoverable.
- Save state should not block users from retaking or choosing another photo.
- Continue / Save must not trigger AI, StoreKit, quota enforcement, export, save to Photos, public sharing, or Phase 06 behavior.
- History may stay as a placeholder.
- History may show a mock saved item only if it does not imply real cloud persistence.
- Do not claim cloud history is complete if it is mock only.
- Keep Home / Camera / Photo Picker / Filter selector / History / Settings rendering.
- Guest/mock-auth state should continue to work with mock save.
- If a user identity is needed for mock metadata, use a clearly local/mock owner id such as `mock-user`.

## Privacy / App Store requirements

- Do not imply photos are actually uploaded in Phase 05.
- Do not claim cloud backup, cross-device sync, permanent history, AI analysis, quota enforcement, paid storage, account deletion backend, export, or sharing exists.
- Do not request new permissions.
- Do not add tracking, ads, analytics, or personalized ads SDKs.
- Do not collect or transmit images in this phase.
- Do not log raw image data, image base64, file paths, signed URLs, or sensitive user metadata.
- Do not add App Privacy claims that are not backed by actual implementation.
- Keep `trainingConsent` assumptions unchanged; this phase should not introduce training consent flows.
- Keep UI copy accurate: mock save scaffold only.

## Firebase security / credential safety requirements

- Do not add real `GoogleService-Info.plist`.
- Do not add Firebase project ID.
- Do not add `.firebaserc`.
- Do not add `.env`.
- Do not add API keys.
- Do not add private keys.
- Do not add OAuth secrets.
- Do not add Apple Team ID.
- Do not add signing credentials.
- Do not add provisioning profiles.
- Do not add bucket names or production Firebase URLs.
- Do not add real App Check configuration.
- Do not add real Remote Config values.
- Do not enable production Firebase writes.
- Do not enable production Firebase upload.
- Do not create a real Firebase project from Codex.
- Do not download or generate Firebase credentials.
- Do not commit any user-specific Xcode files such as `xcuserdata`.
- Keep `.gitignore` protections intact.
- If Firebase setup is needed, document manual setup TODOs instead of inventing values.
- If emulator or test project support is discussed, keep it documentation-only unless the user explicitly requests setup in a later task.

## Acceptance criteria

- `docs/prompts/phase-05-firebase-storage-firestore.md` has been read and followed.
- The app builds in Xcode after Phase 05 changes.
- Phase 01/02 Auth, Home, History, and Settings flows still build.
- Phase 03 Camera + Photo Picker scaffold still builds.
- Phase 04 filter preview and preset selector still build.
- Photo save service protocol exists.
- Mock photo save service exists.
- Photo metadata model exists.
- Save state model exists.
- Storage path convention draft exists.
- Firestore document shape draft exists.
- Firebase adapter placeholder or TODO exists and does not require real Firebase config.
- Save placeholder UI appears after filtered preview.
- Mock save success can be triggered and displayed.
- Mock save failure can be triggered and displayed.
- Save flow does not upload to Firebase production.
- Save flow does not write Firestore production data.
- Save flow does not persist real history.
- Save flow does not run AI analysis.
- Save flow does not call Cloud Functions.
- Save flow does not trigger StoreKit, subscription, quota, export, save to Photos, or public sharing.
- No true secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, `.env`, `.firebaserc`, or `GoogleService-Info.plist` are added.
- Localization includes Phase 05 save/storage strings in `en` and `zh-Hant`.
- `tests/manual-smoke-tests.md` includes Phase 05 checks.
- `docs/phase-log.md` records Phase 05 status, changed files, checks, known TODOs, and readiness for Phase 06.

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
  - switch to at least one retro preset
  - confirm filtered preview updates
  - tap Save mock / Save placeholder
  - confirm mock save success state appears
  - trigger or simulate mock save failure
  - confirm mock save failure state appears and can be retried or dismissed
  - confirm History either remains an honest placeholder or displays only a clearly mock saved item
  - confirm Continue / Save does not upload, write Firestore, call AI, call Cloud Functions, start StoreKit, enforce quota, persist real history, export, save to Photos, or start Phase 06
  - confirm Home / History / Settings still render
- On a physical iPhone or iPad, if available:
  - capture one still photo
  - apply a filter preset
  - trigger mock save success
  - confirm no real upload occurs
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, production plist files, private keys, OAuth secrets, Firebase project IDs, Apple credentials, Google keys, Gemini keys, OpenAI keys, or API keys were added.
- Confirm source files do not import Firebase Storage, Firestore, Cloud Functions, AI SDKs, StoreKit, Gemini, or OpenAI unless explicitly guarded/documented as placeholder-only and still buildable without dependencies.
- Confirm no raw image data, base64, local file paths, signed URLs, or sensitive metadata are logged.
- Confirm Phase 06 is not started.

## Completion requirement

Before finishing Phase 05 implementation, update `docs/phase-log.md`.

The Phase 05 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether Xcode build was run
- whether mock save success was manually tested
- whether mock save failure was manually tested
- whether Firebase production upload/write was intentionally not implemented
- whether AI, Cloud Functions, StoreKit, quota, history persistence, export/save to Photos, public sharing, paid history limits, account deletion backend, secrets, credentials, and Phase 06 were intentionally not implemented
- ready for Phase 06: yes/no

Also update `tests/manual-smoke-tests.md` with Phase 05 manual checks and results.

After implementation:

- Run or request an Xcode build verification.
- Manually test mock save success.
- Manually test mock save failure.
- Confirm no secrets or production Firebase config were added.
- Confirm no real upload occurred.
- Confirm no real Firestore write occurred.
- Do not automatically commit or push.
- Wait for user Xcode verification before any commit/push request.
- Do not mark Phase 06 started.
