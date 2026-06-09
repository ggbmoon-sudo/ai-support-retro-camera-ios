# Phase 08: Local Session History

## 1. Phase name

Phase 08 - Local Session History / Timeline Scaffold

## 2. Goal

Build a local in-memory session history scaffold for the iOS-first AI Support Retro Camera app.

After a user selects or captures one photo, applies a Phase 04 local filter preset, triggers Phase 05 mock save, and optionally triggers Phase 07 mock AI analysis, the app should be able to show a local session item in the History tab for the current app session.

This phase is local-only and memory-only:

- No cloud history.
- No disk persistence.
- No UserDefaults persistence.
- No Core Data or SwiftData.
- No Firebase Storage upload.
- No Firestore write.
- No image export or save to Photos.
- No real AI call.
- No Cloud Functions call.
- No StoreKit, subscription, paywall, or quota enforcement.

The purpose is to turn the existing honest History placeholder into a local session timeline scaffold without claiming production history, sync, backup, or permanence.

## 3. Current repo status

Expected starting state:

- Repo path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- Latest commit at prompt generation time: `2958eb0`
- Latest commit is Phase 07 mock AI advisor result UI
- Local branch is synchronized with `origin/feat/phase-02-auth`
- Working tree is clean
- `ios-app/AIPhotoApp.xcodeproj` exists
- Phase 01/02 Mac/Xcode build succeeded
- Phase 03 Camera + Photo Picker scaffold completed, manually checked, committed, and pushed
- Phase 04 Local Core Image Filter Presets completed, manually checked, committed, and pushed
- Phase 05 Mock Photo Save Scaffold completed, manually checked, committed, and pushed
- Phase 06 AI Photo Advisor Backend / Service Scaffold completed, manually checked, committed, and pushed
- Phase 07 AI Photo Advisor Result UI Scaffold completed, manually checked, committed, and pushed
- `docs/phase-log.md` records Phase 07 completed / manually checked
- `tests/manual-smoke-tests.md` includes Phase 07 checks
- AI result panel scroll bugfix / localization key bugfix is recorded and verified
- No real Firebase config is present
- No `GoogleService-Info.plist` is present
- No `.env` is present
- No `.firebaserc` is present
- No Gemini or OpenAI key is present
- No iOS Firebase / FirebaseFunctions / Gemini / OpenAI / StoreKit imports are present

Phase 08 has not started yet.

Note: the older phase plan names Phase 08 as quota, but this prompt intentionally scopes Phase 08 to Local Session History / Timeline Scaffold per the current user request. Do not implement quota in this phase.

## 4. Read first

Before implementing Phase 08, read:

- `README.md`
- `AGENTS.md`
- `docs/00-common-background-v2.md`
- `docs/01-product-mvp-scope.md`
- `docs/02-technical-architecture.md`
- `docs/03-camera-filter-image-pipeline.md`
- `docs/04-ai-photo-advisor.md`
- `docs/05-firebase-storage-firestore-functions.md`
- `docs/06-ui-ux-design-system.md`
- `docs/07-subscription-quota-storekit.md`
- `docs/08-privacy-security-app-store-risk.md`
- `docs/09-codex-phase-plan.md`
- `docs/phase-log.md`
- `docs/prompts/phase-03-camera-picker.md`
- `docs/prompts/phase-04-filters.md`
- `docs/prompts/phase-05-firebase-storage-firestore.md`
- `docs/prompts/phase-06-ai-photo-advisor-backend.md`
- `docs/prompts/phase-07-ai-advisor-result-ui.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Also inspect the existing iOS flow and state handoff points:

- `ios-app/AIPhotoApp/App/AppRootView.swift`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisViewModel.swift`
- `ios-app/AIPhotoApp/Features/History/HistoryView.swift`
- `ios-app/AIPhotoApp/Models/SavedPhoto.swift`
- `ios-app/AIPhotoApp/Models/PhotoSaveState.swift`
- `ios-app/AIPhotoApp/Models/PhotoAnalysisResult.swift`

## 5. Pre-implementation checks

Run these checks before editing files:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short
git status --short --branch
git log --oneline -3
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
rg -n "Phase 07|Ready for Phase 08|AI result panel|localization keys" docs/phase-log.md tests/manual-smoke-tests.md
rg -n "HistoryView|CameraViewModel|FilteredPhotoPreview|AIAnalysisViewModel|PhotoSaveState|PhotoAnalysisResult" ios-app/AIPhotoApp -g '*.swift'
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
```

Expected:

- Current branch is `feat/phase-02-auth`.
- Working tree is clean.
- Latest commit is the Phase 07 mock AI advisor result UI commit.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 07 is recorded as completed / manually checked.
- Phase 07 scroll and localization bugfixes are recorded.
- No real Firebase config, API key, private key, Gemini key, OpenAI key, Apple credential, production plist, `.env`, `.firebaserc`, or `GoogleService-Info.plist` is present.
- iOS Swift source does not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.

If any pre-check fails, report it before making functional changes.

## 6. This phase should only do

Implement a local-only session history scaffold:

- Add a local in-memory session history store.
- Add a session history item model.
- Add session history status / display model if useful.
- Share session history state within the current app session.
- Add current photo flow result into session history after mock save or mock AI analysis.
- Display local-only item summary in the History tab.
- Display a thumbnail if safely available in memory.
- Display selected filter preset id and/or localized preset name.
- Display mock save status.
- Display mock AI summary if available.
- Add an empty state for no session items.
- Add a clear local session history action.
- Add local-only / mock copy and labels.
- Keep History honest: this is not cloud history, not synced history, and not permanent history.
- Keep Phase 03 Camera, Phase 04 Filters, Phase 05 Mock Save, and Phase 07 Mock AI UI working.
- Update English and Traditional Chinese localization strings.
- Update `ios-app/README.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `docs/phase-log.md`.

## 7. This phase must not do

Do not start Phase 09.

Do not add or implement:

- Real Firebase Storage upload
- Real Firestore write
- Cloud history
- Disk persistence
- UserDefaults persistence
- Core Data
- SwiftData
- Save images to Photos
- Export images
- Save AI result to cloud
- Save AI result to permanent history
- Gemini real call
- OpenAI real call
- Cloud Functions call
- Cloud Functions deploy
- StoreKit
- Subscription
- Paywall
- Quota enforcement
- Account deletion backend
- Public sharing
- Image editing
- Generative edit
- Realtime video AI
- `GoogleService-Info.plist`
- `.env`
- `.firebaserc`
- Firebase project ID
- Gemini API key
- OpenAI API key
- Private key
- OAuth secret
- Apple credential
- Signing credential
- Provisioning profile
- New npm dependency
- New third-party SDK dependency

Do not import these in iOS:

- `Firebase`
- `FirebaseFunctions`
- `FirebaseStorage`
- `FirebaseFirestore`
- Gemini SDKs
- OpenAI SDKs
- `StoreKit`

Do not log:

- Raw image data
- Base64 image data
- Local file paths
- Signed URLs
- Full prompts
- Provider responses
- Secrets or credentials

## 8. Suggested files to create or modify

Suggested new files:

```text
ios-app/AIPhotoApp/Models/SessionHistoryItem.swift
ios-app/AIPhotoApp/Models/SessionHistoryStatus.swift
ios-app/AIPhotoApp/Services/SessionHistory/SessionHistoryStore.swift
ios-app/AIPhotoApp/Services/SessionHistory/MockSessionHistoryStore.swift
ios-app/AIPhotoApp/Features/History/HistoryItemCard.swift
ios-app/AIPhotoApp/Features/History/HistoryEmptyStateView.swift
```

Suggested existing files to modify:

```text
ios-app/AIPhotoApp/App/AppRootView.swift
ios-app/AIPhotoApp/App/MainTabShellView.swift
ios-app/AIPhotoApp/Features/History/HistoryView.swift
ios-app/AIPhotoApp/Features/Camera/CameraView.swift
ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisViewModel.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Only modify files needed for the local session history scaffold. Keep changes small and reviewable.

If new Swift files are added under `ios-app/AIPhotoApp/`, confirm target membership through the existing Xcode file-system synchronized group by running an Xcode build. If project editing becomes necessary, keep `ios-app/AIPhotoApp.xcodeproj/project.pbxproj` changes minimal and do not add user-specific Xcode files.

## 9. Technical requirements

- Use Swift + SwiftUI.
- Session history must be memory-only.
- Do not persist to disk.
- Do not persist to UserDefaults.
- Do not persist to Firestore.
- Do not persist to Core Data or SwiftData.
- Do not upload images.
- Do not call AI providers.
- Do not call Cloud Functions.
- Do not import Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore / Gemini / OpenAI / StoreKit.
- Store/service layer must be mockable.
- History state should be shareable within the app session, for example through environment object, dependency injection, or app-level state.
- Do not break app navigation / tabs.
- Do not break Auth, Home, Camera, Filter Preview, Mock Save, Mock AI Result UI, History, or Settings.
- Do not log raw image data, base64, local file paths, signed URLs, prompts, or provider responses.
- If thumbnail display is added, keep the thumbnail image object in memory only.
- Keep thumbnails small enough for UI display and memory sanity; do not add image compression-to-disk logic in this phase.
- Clearly label this feature as local session history only.
- Closing or restarting the app may clear this history; the UI copy must not promise persistence.
- Avoid storing full-size image data in a long-lived global object when a smaller in-memory thumbnail is sufficient.
- Keep item insertion deterministic and easy to test:
  - after mock save success
  - after mock AI analysis success
  - or both, if the implementation can safely update an existing item instead of duplicating confusing entries
- If both mock save and mock AI analysis can add/update an item, avoid duplicate cards for the same selected photo where practical.

## 10. UI / UX requirements

History tab should become a local session timeline scaffold:

- If there are no local session items, show an empty state.
- If there are items, show a vertically scrollable list of cards.
- Each card should show:
  - local-only / mock badge
  - created time
  - source: camera / photo library
  - selected filter preset id and/or localized name
  - mock save status
  - mock AI summary if available
  - optional in-memory thumbnail if safely available
- Provide a clear local session history action.
- The clear action should only clear the in-memory session store.
- UI copy must clearly explain that closing or restarting the app may clear local session history.
- Do not claim cloud backup, permanent history, sync, or production Firebase history exists.
- Do not add a photo detail screen unless it is extremely small and clearly local-only; card list is enough for this phase.
- Do not add export, save-to-Photos, share, delete-cloud-photo, cloud retry, or paywall actions.
- Keep the existing tab structure stable.
- Use existing design system tokens and components where practical.
- Keep UI readable on small iPhone Simulator screens.

Suggested card content:

```text
[Local only] [Mock]
Created: Today 14:20
Source: Photo Library
Filter: Warm Vintage
Mock save: Saved locally as mock metadata
Mock AI: "The subject is clear..."
```

## 11. Session history data model

Suggested `SessionHistoryItem` fields:

```text
id
createdAt
source: camera / photoLibrary
thumbnailImage optional, memory-only
filterPresetId
filterPresetName
mockSaveStatus
mockAnalysisSummary optional
mockAnalysisProvider optional
isMock
localOnly
note / status label
```

Suggested `SessionHistoryStatus` concepts:

```text
localDraft
mockSaved
mockSaveFailed
mockAnalyzed
mockAnalysisFailed
```

Suggested store behavior:

```text
SessionHistoryStore
- items: [SessionHistoryItem]
- addOrUpdate(item)
- clear()
- item(for local photo id or mock saved photo id)
```

Implementation guidance:

- Use stable local IDs for the current selected photo flow where possible.
- If a mock save returns a mock `SavedPhoto`, the session item may include that mock id as metadata, but do not treat it as a real cloud id.
- If mock AI analysis completes later, update the same session item if possible.
- Keep `isMock = true` and `localOnly = true` for every Phase 08 item.
- Do not include raw image data, base64, file paths, signed URLs, full prompts, or provider payloads.
- Do not persist `SessionHistoryItem` outside memory.
- Use `UIImage` only for in-memory thumbnail display if needed; do not serialize it.

## 12. Privacy / App Store requirements

- Local session history must remain on device and in memory only.
- Do not upload photos.
- Do not call production AI providers.
- Do not call Cloud Functions.
- Do not write Firestore.
- Do not write Storage.
- Do not save photos to disk.
- Do not save photos to Photos.
- Do not export or share images.
- Do not add tracking.
- Do not add analytics.
- Do not add ad SDKs.
- Do not imply that mock AI advice is real AI analysis.
- Do not imply that local session history is permanent.
- Do not imply that local session history is cloud-backed or synced.
- Keep privacy copy accurate: this is local session history for the current app session.

## 13. Secret / Firebase safety requirements

- No `GoogleService-Info.plist`.
- No `.env`.
- No `.firebaserc`.
- No Firebase project ID.
- No Gemini API key.
- No OpenAI API key.
- No private key.
- No OAuth secret.
- No Apple credential.
- No signing credential.
- No provisioning profile.
- No Firebase SDK import in iOS.
- No FirebaseFunctions SDK import in iOS.
- No Gemini SDK import.
- No OpenAI SDK import.
- No StoreKit import.
- No real Cloud Functions endpoint.
- No deployed function.
- No real upload or Firestore write.

After implementation, run checks such as:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "apiKey|API_KEY|private_key|projectId|GEMINI|OPENAI|FirebaseApp.configure|httpsCallable|URLSession" ios-app functions
```

If these checks return documentation or placeholder references, verify they are clearly non-secret and non-production. If any real secret or production config appears, stop and report it.

## 14. Acceptance criteria

Phase 08 is acceptable when:

- App builds in Xcode.
- Existing Phase 03 Camera / Photo Picker scaffold still works.
- Existing Phase 04 filter preset switching still works.
- Existing Phase 05 mock save success / failure still works.
- Existing Phase 07 mock AI loading / result / failure / retry / dismiss still works.
- History tab shows an empty state when no local session item exists.
- After mock save or mock AI analysis, a local session item can appear in History during the same app session.
- The History item shows local-only / mock labeling.
- The History item shows created time.
- The History item shows source.
- The History item shows selected filter preset id and/or localized name.
- The History item shows mock save status.
- The History item shows mock AI summary when available.
- Thumbnail displays only if safely available in memory.
- Clear local session history removes in-memory items.
- UI copy clearly states that this is not cloud history and may disappear when the app restarts.
- No disk persistence is added.
- No UserDefaults persistence is added.
- No Core Data / SwiftData is added.
- No Firebase Storage upload is implemented.
- No Firestore write is implemented.
- No Cloud Functions call is implemented.
- No real Gemini / OpenAI call occurs.
- No StoreKit, paywall, subscription, or quota enforcement is added.
- No image export or save-to-Photos behavior is added.
- No secrets or production Firebase config are added.
- `ios-app/README.md` documents Phase 08 local session history as memory-only.
- `tests/manual-smoke-tests.md` includes Phase 08 checks.
- `docs/phase-log.md` records Phase 08 implementation status.

## 15. Tests / manual checks

Implementation should run safe local checks where possible:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
git status --short
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 17' build
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
```

If `iPhone 17` is not available, use an available iOS Simulator destination and report the command used.

Manual Xcode / Simulator checks:

- Build and run `AIPhotoApp`.
- Sign in with mock Auth or continue as guest.
- Open History before adding items and confirm empty state.
- Open Home.
- Open Camera.
- Pick one photo from the photo picker.
- Apply Classic Film, Warm Vintage, or Faded Chrome.
- Trigger mock save success.
- Open History and confirm a local-only session item appears.
- Confirm the item shows created time, source, filter preset, and mock save status.
- Return to the photo flow and trigger mock AI analysis success.
- Open History and confirm mock AI summary appears on the local item.
- Trigger mock save failure and/or mock AI failure if supported, and confirm History copy remains honest.
- Tap clear local session history.
- Confirm History returns to empty state.
- Confirm closing/restarting app is not described as preserving history.
- Confirm Phase 03 Camera, Phase 04 Filters, Phase 05 Mock Save, and Phase 07 Mock AI UI still behave as before.
- Confirm Home / History / Settings still render.
- Confirm no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, paywall, export, save-to-Photos, disk persistence, or UserDefaults persistence occurs.
- Confirm no real Firebase config or secrets are present.

Manual physical iPhone / iPad checks, if available:

- Build and run on device.
- Capture one still photo.
- Apply one preset.
- Trigger mock save.
- Trigger mock AI analysis.
- Open History and confirm local-only session item appears.
- Clear local session history.
- Confirm no real upload, provider call, Firestore write, Storage write, export, or persistence occurs.

## 16. Completion requirement

When Phase 08 implementation is complete:

- Update `docs/phase-log.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `ios-app/README.md`.
- Run an Xcode build or clearly report why it could not be run.
- Manually test adding a session item.
- Manually test History tab displays the item.
- Manually test clearing local session history.
- Confirm the app does not promise persistence after restart.
- Confirm no real Firebase, Cloud Functions, AI provider, StoreKit, quota, upload, Firestore write, Storage write, disk persistence, UserDefaults persistence, export, or save-to-Photos behavior was added.
- Confirm no secrets or production config were added.
- Do not commit automatically.
- Do not push automatically.
- Do not start Phase 09.
- Wait for user Xcode verification before commit / push.

Final response after implementation should include:

- Changed files
- Implemented summary
- Verification result
- Known TODOs
- Manual test steps
- Whether user should verify in Xcode
- Ready for Phase 09: no, until Phase 08 is manually verified, committed, and pushed
