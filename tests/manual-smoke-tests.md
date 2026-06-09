# Manual Smoke Tests

## Phase 00

Check:

- [x] README.md exists.
- [x] AGENTS.md exists.
- [x] docs/ folder exists.
- [x] docs/phase-log.md exists.
- [x] docs/prompts/ folder exists.
- [x] ios-app/ placeholder exists.
- [x] functions/ placeholder exists.
- [x] firebase/ placeholder exists.
- [x] scripts/ placeholder exists.
- [x] .gitignore exists.
- [x] .env.example exists.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

## Phase 01

Check:

- [x] `docs/prompts/phase-01-design-navigation.md` is expanded into a full construction prompt.
- [x] `ios-app/AIPhotoApp/` source scaffold exists.
- [x] SwiftUI app entry exists.
- [x] Root navigation shell exists.
- [x] Home / History / Settings placeholder views exist.
- [x] Design system token files exist.
- [x] Reusable UI components exist.
- [x] Placeholder UI models exist.
- [x] English localization file exists.
- [x] Traditional Chinese localization file exists.
- [x] No Auth implementation was added.
- [x] No Camera implementation was added.
- [x] No Firebase upload implementation was added.
- [x] No AI implementation was added.
- [x] No StoreKit implementation was added.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [x] Create or open an iOS SwiftUI Xcode target.
- [x] Add files under `ios-app/AIPhotoApp/` to the target.
- [x] Add the localization files to the target.
- [x] Build the target.
- [x] Preview or run `AppRootView`.
- [x] Confirm the intro placeholder can enter the Home / History / Settings tab shell.
- [ ] Confirm dark and light mode are readable.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.

## Phase 02

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo during Phase 02 setup.
- [x] Added Auth UI scaffold under `ios-app/AIPhotoApp/Features/Auth/`.
- [x] Added mockable Auth service protocol under `ios-app/AIPhotoApp/Services/Auth/`.
- [x] Added `MockAuthService` for local email/password, Google, Apple, guest, and sign-out state.
- [x] Added `FirebaseAuthService` placeholder without importing Firebase SDKs.
- [x] Added visible Google and Apple sign-in rows together.
- [x] Added guest/try-mode copy and local mock flow.
- [x] Added Settings sign-out and account deletion placeholders.
- [x] Added Phase 02 Auth setup TODO notes.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase Storage upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual source review without Mac:

- [ ] Open `ios-app/AIPhotoApp/Features/Auth/AuthView.swift` and confirm email/password, Google, Apple, and guest options are present.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/AuthService.swift` and confirm UI depends on a protocol.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift` and confirm mock sign-in/sign-out state is local only.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift` and confirm it has TODOs but no Firebase imports.
- [ ] Confirm `GoogleService-Info.plist`, `.env`, `.firebaserc`, production plist files, private keys, OAuth secrets, Firebase project IDs, and API keys were not added.
- [ ] Confirm source files do not import AVFoundation, PhotosUI, Firebase Storage, AI SDKs, or StoreKit for Phase 02.

Manual Xcode check on macOS later:

- [x] Follow `ios-app/XCODE_SETUP.md` and create or open a verified `.xcodeproj`.
- [x] Add all Phase 02 Auth Swift files to the app target.
- [x] Build the target.
- [x] Preview `AuthView`.
- [x] Run the app and confirm intro can continue to Auth.
- [ ] Test mock email/password sign-in with a valid email and at least 6 password characters.
- [ ] Test invalid email and short password error states.
- [ ] Test mock Google sign-in row.
- [ ] Test mock Apple sign-in row.
- [ ] Test guest try mode.
- [ ] Test Settings mock sign-out returns to Auth.
- [ ] Confirm account deletion entry is visible but does not claim backend deletion is complete.

## Phase 01.5

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo.
- [x] Confirmed the current environment cannot reliably verify an Xcode project.
- [x] Added `ios-app/XCODE_SETUP.md` instead of generating an unverified `.xcodeproj`.
- [x] Documented how to create `ios-app/AIPhotoApp.xcodeproj` on macOS.
- [x] Documented how to add existing `ios-app/AIPhotoApp/` Swift files to the app target.
- [x] Documented how to add `en.lproj` and `zh-Hant.lproj` localization files to target resources.
- [x] Confirmed no Auth implementation was added.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [x] Follow `ios-app/XCODE_SETUP.md`.
- [x] Create or open `ios-app/AIPhotoApp.xcodeproj`.
- [x] Confirm all Swift files under `ios-app/AIPhotoApp/` are in the app target.
- [x] Confirm `ios-app/AIPhotoApp/AIPhotoApp.swift` is the only `@main` entry.
- [x] Confirm localization resources are copied into the app bundle.
- [x] Build the target.
- [ ] Preview `AppRootView`.
- [ ] Preview `MainTabShellView`.
- [ ] Run the app in an iOS Simulator.
- [ ] Confirm Home / History / Settings render.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.

## Phase 03

Check:

- [x] `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Camera scaffold exists under `ios-app/AIPhotoApp/Features/Camera/`.
- [x] Home has an entry into the Camera / Photo Picker scaffold.
- [x] Camera permission states are represented.
- [x] AVFoundation camera preview/capture scaffold exists.
- [x] PhotosPicker single-image import scaffold exists.
- [x] Captured/imported image preview is local-only and in memory.
- [x] Added camera and photo-library usage description placeholders to Xcode build settings.
- [x] No filters or Core Image presets were implemented.
- [x] No Firebase Storage upload was implemented.
- [x] No Firestore metadata persistence was implemented.
- [x] No AI analysis or Cloud Functions AI proxy was implemented.
- [x] No StoreKit, subscription, paywall, quota enforcement, or history persistence was implemented.
- [x] No real secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] Command-line Xcode simulator build succeeded.

Manual Xcode check on simulator:

- [x] User manually checked Phase 03 in Xcode.
- [x] User confirmed build / basic UI flow looked acceptable.
- [x] User reported no obvious major bugs.
- [ ] Build and run `AIPhotoApp` in an iOS Simulator for a full recorded smoke pass.
- [ ] Sign in with mock Auth or continue as guest.
- [ ] Open Home.
- [ ] Tap `Open camera` and confirm the Camera scaffold opens full-screen.
- [ ] Confirm simulator camera unavailable state is clear and does not crash.
- [ ] Tap `Choose one photo` and select one image.
- [ ] Confirm the selected image appears in the local preview.
- [ ] Tap `Retake or clear` and confirm the preview clears.
- [ ] Confirm `Continue in later phases` is disabled and does not start filters, upload, AI, StoreKit, quota, or history behavior.
- [ ] Confirm Auth sign-out still works.
- [ ] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Open the Camera scaffold from Home.
- [ ] Confirm the camera permission prompt appears when needed.
- [ ] Grant camera permission.
- [ ] Confirm camera preview appears.
- [ ] Capture one still photo.
- [ ] Confirm captured photo appears in the local preview.
- [ ] Clear / retake and confirm the app returns to capture state.
- [ ] Import one library image and confirm it replaces the preview.
- [ ] Confirm no image is uploaded or persisted.

## Phase 04

Check:

- [x] Added local Core Image filter pipeline.
- [x] Added data-driven filter preset model and catalog.
- [x] Added Original / None plus Classic Film, Warm Vintage, and Faded Chrome presets.
- [x] Added preset selector UI for selected/captured photos.
- [x] Added local filtered preview state in memory only.
- [x] Original / None uses the unfiltered image.
- [x] Filter rendering is dispatched off the main thread.
- [x] Added orientation normalization for filtered preview rendering.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed no Firebase Storage upload was implemented.
- [x] Confirmed no Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions were implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, or paid presets were implemented.
- [x] Confirmed no real secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Tap `Choose one photo` and select one image.
- [ ] Confirm the selected image appears in the local preview.
- [x] Confirm the preset selector is visible.
- [x] Switch to Classic Film and confirm the filtered preview updates.
- [x] Switch to Warm Vintage and confirm the filtered preview updates.
- [x] Switch to Faded Chrome and confirm the filtered preview updates.
- [x] Switch back to Original / None and confirm the unfiltered image appears.
- [ ] Confirm `Retake or clear` clears the preview and local filter state.
- [x] Confirm `Continue in later phases` is disabled and does not start upload, AI, StoreKit, quota, history, export, or Phase 05 behavior.
- [x] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Open the Camera scaffold from Home.
- [ ] Capture one still photo.
- [ ] Confirm captured photo appears in the local preview.
- [ ] Switch between Original / None and each retro preset.
- [ ] Confirm filtered previews update without rotated or upside-down output.
- [ ] Import one library image and confirm it replaces the previous preview.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, analyzed, or counted toward quota.

## Phase 05

Check:

- [x] Added `PhotoSaveService` protocol.
- [x] Added `MockPhotoSaveService`.
- [x] Added `SavedPhoto` metadata model.
- [x] Added `PhotoSaveState`.
- [x] Added Storage path convention draft.
- [x] Added Firestore document shape draft.
- [x] Added `FirebasePhotoSaveService` placeholder without Firebase imports.
- [x] Added mock Save UI after filtered preview.
- [x] Added visible mock save success state.
- [x] Added visible mock save failure state.
- [x] History remains an honest placeholder without cross-page saved-item persistence.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed no real `GoogleService-Info.plist` was added.
- [x] Confirmed no Firebase project ID, `.env`, `.firebaserc`, API key, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no Firebase, FirebaseStorage, or FirebaseFirestore imports were added.
- [x] Confirmed no real Firebase upload was implemented.
- [x] Confirmed no real Firestore write was implemented.
- [x] Confirmed no AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription, quota, history persistence, export/save to Photos, account deletion backend, public sharing, or Phase 06 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Confirm the mock Save UI is visible after the filtered preview.
- [x] Tap `Mock save`.
- [x] Confirm mock save success state appears.
- [x] Tap the mock failure button.
- [x] Confirm mock save failure state appears.
- [x] Confirm History remains a placeholder and does not claim real cloud persistence.
- [x] Confirm Save / Continue does not upload, write Firestore, run AI, call Cloud Functions, start StoreKit, enforce quota, persist history, export, save to Photos, or start Phase 06.
- [x] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply a filter preset.
- [ ] Trigger mock save success.
- [ ] Confirm no real upload or Firestore write occurs.

## Phase 06

Check:

- [x] Added `PhotoAnalysisRequest` model draft.
- [x] Added `PhotoAnalysisResult` model draft.
- [x] Added `PhotoAnalysisStatus`.
- [x] Added `PhotoAnalysisService` protocol.
- [x] Added `MockPhotoAnalysisService` with mock success and failure behavior.
- [x] Added `CloudFunctionPhotoAnalysisService` placeholder without Firebase or FirebaseFunctions imports.
- [x] Added backend `analyzePhoto` scaffold.
- [x] Added `AIProviderAdapter`.
- [x] Added `MockAnalyzer`.
- [x] Added `GeminiAnalyzer` placeholder / TODO.
- [x] Added `OpenAIAnalyzer` placeholder / TODO.
- [x] Added TypeScript photo analysis contract.
- [x] Added future-only prompt template draft.
- [x] Mock response includes one short summary.
- [x] Mock response includes up to three actionable suggestions.
- [x] Mock response includes simple adjustment hints.
- [x] Mock response uses `provider = mock`.
- [x] Mock response uses `isMock = true`.
- [x] Confirmed no complete AI result UI was added.
- [x] Confirmed no Gemini API key was added.
- [x] Confirmed no OpenAI API key was added.
- [x] Confirmed no Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no real Gemini call was implemented.
- [x] Confirmed no real OpenAI call was implemented.
- [x] Confirmed no Cloud Functions deploy was run.
- [x] Confirmed no production Firebase was enabled.
- [x] Confirmed no Firebase / FirebaseFunctions imports were added to iOS.
- [x] Confirmed no real Gemini / OpenAI SDK imports were added.
- [x] Confirmed no Firebase Admin SDK imports were added.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed no upload, Firestore write, Storage write, AI billing, quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Trigger mock save failure.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, and Phase 05 Mock Save still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm no AI result UI appears unless a future phase explicitly adds it.
- [x] Confirm no real AI call occurs.
- [x] Confirm no real Firebase config or secrets are present.
- [x] Confirm Save / Continue does not upload, write Firestore, write Storage, call Gemini, call OpenAI, deploy/call Cloud Functions, start StoreKit, enforce quota, persist history, export, or start Phase 07.

Manual source/backend check:

- [ ] Review `ios-app/AIPhotoApp/Services/AIPhotoAdvisor/CloudFunctionPhotoAnalysisService.swift` and confirm it has TODOs but no Firebase imports.
- [ ] Review `functions/src/ai/GeminiAnalyzer.ts` and confirm it is placeholder-only.
- [ ] Review `functions/src/ai/OpenAIAnalyzer.ts` and confirm it is placeholder-only.
- [ ] Review `functions/src/analyzePhoto.ts` and confirm it returns mock analysis only.

## Phase 07

Check:

- [x] Added mock AI analysis result UI scaffold under `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/`.
- [x] Added `AIAnalysisViewModel` using the Phase 06 `PhotoAnalysisService` protocol.
- [x] Default mock analysis service is `MockPhotoAnalysisService`.
- [x] Added mock AI entry after the filtered preview / mock save flow.
- [x] Added loading state.
- [x] Added mock success state.
- [x] Added mock failure state.
- [x] Added retry and dismiss actions.
- [x] Mock result displays one short summary.
- [x] Mock result displays up to three suggestions.
- [x] Mock result displays adjustment hints.
- [x] Mock result displays composition / lighting notes when present.
- [x] UI clearly labels the result as mock / Phase 07 scaffold.
- [x] Analysis state is local memory only.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded with `iPhone 17`.
- [x] Confirmed no Gemini API key was added.
- [x] Confirmed no OpenAI API key was added.
- [x] Confirmed no Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore imports were added to iOS.
- [x] Confirmed no Gemini / OpenAI / StoreKit imports were added to iOS.
- [x] Confirmed no real Gemini or OpenAI call was added.
- [x] Confirmed no Cloud Functions call or deploy was added.
- [x] Confirmed no upload, Firestore write, Storage write, AI result history persistence, AI chat, image editing, realtime video AI, StoreKit, subscription, paywall, quota, npm dependency, or Phase 08 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Trigger mock save failure.
- [x] Confirm the mock AI advice panel is visible after the mock save panel.
- [x] Tap `Analyze photo (mock)`.
- [x] Confirm loading state appears.
- [x] Confirm mock summary appears.
- [x] Confirm up to three suggestions appear.
- [x] Confirm adjustment hints appear.
- [x] Confirm composition / lighting notes appear.
- [x] Confirm the mock / scaffold label is visible.
- [x] Tap the mock AI failure control.
- [x] Confirm mock failure state appears.
- [x] Retry after failure and confirm mock success can appear.
- [x] Dismiss the result and confirm the panel returns to the entry state.
- [x] Confirm the AI result panel can scroll vertically on the simulator.
- [x] Confirm priority and adjustment labels display localized text instead of raw keys.
- [ ] Switch filter presets and confirm stale analysis result is cleared.
- [ ] Clear / retake the photo and confirm analysis state is cleared with the selected photo flow.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, and Phase 05 Mock Save still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm History does not persist AI result.
- [x] Confirm no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, paywall, export, save-to-Photos, or history persistence occurs.
- [x] Confirm no real Firebase config or secrets are present.
- [x] Confirm no obvious major bug is present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save.
- [ ] Trigger mock AI analysis.
- [ ] Confirm mock result UI appears.
- [ ] Confirm no real network upload, provider call, Firestore write, Storage write, or persistence occurs.

## Phase 08

Check:

- [x] Added local in-memory session history item model.
- [x] Added local in-memory session history store.
- [x] Shared session history state through app-level SwiftUI environment object state.
- [x] Mock save success can add or update a local session item.
- [x] Mock AI analysis success can update the same local session item instead of creating a duplicate card.
- [x] History tab has a local session empty state.
- [x] History tab shows a scrollable card list when local session items exist.
- [x] History cards show local-only / mock labels.
- [x] History cards show created time.
- [x] History cards show source.
- [x] History cards show selected filter preset.
- [x] History cards show mock save status.
- [x] History cards show mock AI summary when available.
- [x] Clear local session history action only clears the in-memory store.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Firebase Storage upload, Firestore write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, secret, credential, Firebase config, npm dependency, or Phase 09 work was intentionally added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open History before adding items and confirm the local session empty state appears.
- [x] Confirm the History tab can be entered normally and no longer freezes.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Open History and confirm one local-only session card appears.
- [x] Confirm the card shows created time, source, filter preset, and mock save status.
- [x] Return to the photo flow and trigger mock AI analysis success.
- [x] Open History and confirm the same card shows the mock AI summary.
- [x] Confirm mock AI success does not create a duplicate card for the same selected photo.
- [x] Tap clear local session history.
- [x] Confirm History returns to the empty state.
- [x] Confirm UI copy says local session history is not cloud-backed and may disappear after closing or restarting the app.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, Phase 05 Mock Save, and Phase 07 Mock AI UI still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, paywall, export, save-to-Photos, disk persistence, UserDefaults persistence, or cloud history occurs.
- [x] Confirm no real Firebase config or secrets are present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save.
- [ ] Trigger mock AI analysis.
- [ ] Open History and confirm one local-only session item appears.
- [ ] Clear local session history.
- [ ] Confirm no real network upload, provider call, Firestore write, Storage write, export, save-to-Photos, or persistence occurs.

## Phase 09

Check:

- [x] Added `docs/prompts/phase-09-mvp-polish-ux-hardening.md`.
- [x] Home presents the current flow as a mock MVP demo instead of implying active quota enforcement.
- [x] Camera flow uses a consistent scroll container for capture, selected-photo, filter, mock save, mock AI, messages, and local-only notes.
- [x] Mock save failure is visible as a text button, not only an icon.
- [x] Mock save state text wraps cleanly.
- [x] Mock AI retry / dismiss controls are easier to tap.
- [x] History clear local session history action is visibly destructive.
- [x] History card filter detail uses localized preset text instead of a raw preset id.
- [x] Settings copy clearly says backend, cloud, subscription, AI, quota, and account deletion services are not connected.
- [x] English and Traditional Chinese localization strings were updated.
- [x] Confirmed no Firebase Storage upload, Firestore write, Storage write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, secret, credential, Firebase config, npm dependency, or Phase 10 work was intentionally added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [x] Test on a small iPhone Simulator if possible.
- [x] Open Home and confirm the primary flow and mock/local-only copy are clear.
- [x] Open Camera and confirm permission / unavailable copy remains readable.
- [x] Import one photo and confirm the selected-photo flow scrolls fully.
- [x] Switch Original / Classic Film / Warm Vintage / Faded Chrome.
- [x] Trigger mock save success and confirm the state is clear.
- [x] Trigger mock save failure and confirm the visible failure button / state are clear.
- [x] Trigger mock AI success and confirm loading / result / retry / dismiss remain readable.
- [x] Trigger mock AI failure and confirm failure / retry / dismiss remain readable.
- [x] Open History and confirm local-only cards scroll.
- [x] Confirm History clear local session history works and is clearly local-only.
- [x] Open Settings and confirm placeholders do not claim real backend, subscription, quota, AI, cloud, or account deletion completion.
- [x] Confirm no raw localization keys appear in the primary tested flow.
- [x] Confirm no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, paywall, export, save-to-Photos, disk persistence, UserDefaults persistence, Core Data, SwiftData, or cloud history occurs.
- [x] Confirm no real Firebase config or secrets are present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save success.
- [ ] Trigger mock AI success.
- [ ] Open History and confirm the local session card remains readable.
- [ ] Confirm safe-area and scroll behavior are usable on device.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 10

Check:

- [x] Added `docs/prompts/phase-10-mvp-demo-qa-readiness.md`.
- [x] Added `docs/mvp-demo-script.md`.
- [x] Added `docs/mvp-known-limitations.md`.
- [x] Added `docs/mvp-readiness-checklist.md`.
- [x] Demo script covers Launch app -> guest/mock auth -> Home -> Camera scaffold -> Photo Picker import -> Filter presets -> Mock save success/failure -> Mock AI advice -> Local session history -> Clear history -> Settings placeholders.
- [x] Known limitations document clearly states save is mock-only, AI is mock-only, History is memory-only, and there is no cloud sync, real Firebase, StoreKit, quota enforcement, export, or save-to-Photos.
- [x] Readiness checklist covers pre-real Firebase, pre-real AI, pre-StoreKit, privacy/App Store, secrets safety, and device testing.
- [x] README and iOS README point to the Phase 10 MVP demo / readiness docs.
- [x] Phase 10 is documentation / QA readiness only.
- [x] No Swift code was modified.
- [x] No backend code was modified.
- [x] Confirmed no Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, secret, credential, Firebase config, npm dependency, or Phase 11 work was intentionally added.

Manual documentation review:

- [ ] Run the demo script in `docs/mvp-demo-script.md`.
- [ ] Confirm the demo script matches the current UI.
- [ ] Confirm `docs/mvp-known-limitations.md` is accurate after a Simulator pass.
- [ ] Confirm `docs/mvp-readiness-checklist.md` matches the next real-service priorities.
- [ ] Confirm no document claims the app is production-ready.
- [ ] Confirm no document claims real cloud save, real AI, real subscription, or permanent history exists.

Manual Xcode check on simulator:

- [ ] Build and run `AIPhotoApp` in an iOS Simulator if UI code changes in a future Phase 10 follow-up.
- [ ] For this docs-only Phase 10 pass, Xcode build is not required because no Swift code changed.

Manual Xcode check on physical iPhone / iPad:

- [ ] Optional: run the demo script on a physical device.
- [ ] Optional: confirm camera capture works on device.
- [ ] Optional: confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 11

Check:

- [x] Added Camera as the default primary tab in the main tab shell.
- [x] Kept Guide / Home content as a secondary tab instead of deleting it.
- [x] Kept History and Settings accessible.
- [x] Camera tab does not show a Close button.
- [x] Full-screen Camera launched from the guide still has a Close button.
- [x] Camera viewfinder uses a larger 4:5 portrait frame to support the 5:4-style camera-first direction.
- [x] Added a lower-right filter entry on the camera surface.
- [x] Lower-right filter entry reveals the existing local preset selector.
- [x] Preset selection before capture / import applies to the next selected photo.
- [x] Photo Picker fallback remains available.
- [x] Existing presets only are preserved: Original / Classic Film / Warm Vintage / Faded Chrome.
- [x] Mock save, mock AI advice, local session history, History, and Settings flows remain in scope.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase, real AI, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secret, credential, Firebase config, or Phase 12 work was intentionally added.

Build / source checks:

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [ ] Command-line Xcode build should be rerun in Xcode / Simulator. Codex sandbox build reached Swift compilation but failed due `sandbox-exec` / CoreSimulator environment restrictions.
- [x] User accepted Xcode / Simulator run result on 2026-06-09.
- [x] User accepted current Phase 11 result as ready to commit.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Continue through mock auth / guest entry if shown.
- [ ] Confirm Camera is the first useful app surface.
- [ ] Confirm the viewfinder is visually dominant and uses the new 5:4-style portrait frame.
- [ ] Tap the lower-right filter entry and confirm the existing preset selector appears.
- [ ] Select Classic Film before importing a photo.
- [ ] Import one photo with Photo Picker and confirm the selected preset is applied.
- [ ] Switch Original / Classic Film / Warm Vintage / Faded Chrome after import.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Open History and confirm local session item behavior still works.
- [ ] Clear local session history.
- [ ] Open Guide and confirm it is secondary explanatory content.
- [ ] Open Settings and confirm placeholders remain honest.
- [ ] Confirm no raw localization keys appear.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

Known product gaps / follow-up TODO:

- [ ] Final product should open directly into Camera and should not show a landing / browse screen first.
- [ ] Auth should not block basic camera use; login should move to Settings or future cloud-feature entry points.
- [ ] Camera page should feel more like a Dazz-style camera shell and less like a content page.
- [ ] Camera viewfinder should be more prominent and overall information density should be lower.
- [ ] Camera controls should be completed later: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- [ ] Recommended follow-up before Phase 12: Phase 11B / Camera Entry Flow & Camera Shell Redesign, if the current implementation is not yet product-satisfying.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Confirm Camera is the first useful app surface.
- [ ] Confirm camera permission and live preview still work.
- [ ] Confirm the lower-right filter entry is reachable while framing.
- [ ] Capture one still photo with a selected preset.
- [ ] Trigger mock save and mock AI advice.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 11B

Check:

- [x] Removed the launch landing / browse screen from the default app entry path.
- [x] Removed the launch-time Auth gate from the default app entry path.
- [x] App root now enters the main tab shell directly.
- [x] Camera remains the default first tab.
- [x] Basic Camera, existing filters, Photo Picker, mock save, mock AI, and local history remain usable without login.
- [x] Existing mock Auth scaffold is preserved as a Settings entry for future cloud features.
- [x] Settings explains that login is not required for basic camera use.
- [x] Camera capture state now uses a darker camera shell.
- [x] Camera viewfinder remains large and central.
- [x] Added top camera shell status / selected preset row.
- [x] Added bottom camera controls: flash, timer, capture, camera flip, and photo import.
- [x] Flash / timer / camera flip controls are UI-only scaffold interactions.
- [x] Kept lower-right filter picker entry on the viewfinder.
- [x] Kept existing four presets only.
- [x] Kept Photo Picker fallback.
- [x] Kept mock save success / failure.
- [x] Kept mock AI success / failure.
- [x] Kept local session history, History tab, Settings tab, and Guide tab.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase, Cloud Functions, Gemini/OpenAI, StoreKit, persistence, export, save-to-Photos, secret, credential, Firebase config, backend code, third-party SDK, or Phase 12 work was intentionally added.

Build / source checks:

- [x] Build and run in Xcode / Simulator.
- [ ] Confirm no raw localization keys appear.
- [x] Confirm source safety scans find no forbidden Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Confirm no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation exists.
- [x] Confirm backend / Firebase / package files were not modified.
- [ ] Command-line Xcode build should be rerun in Xcode / Simulator. Codex sandbox build reached Swift compilation but failed due existing `#Preview` macro / CoreSimulator tooling issues.
- [x] User accepted Xcode / Simulator run result on 2026-06-09.
- [x] User accepted current Phase 11B result as ready to commit.

Manual Xcode check on simulator:

- [ ] Launch app.
- [ ] Confirm there is no landing / browse screen.
- [ ] Confirm there is no launch-time Auth screen.
- [ ] Confirm Camera is the default first tab.
- [ ] Confirm Camera feels like a dark camera shell rather than a white content page.
- [ ] Confirm the viewfinder is large and visually dominant.
- [ ] Toggle flash / timer / camera flip controls.
- [ ] Tap the lower-right filter entry and confirm the existing preset selector appears.
- [ ] Use Photo Picker to import one photo.
- [ ] Confirm selected-photo flow still reaches existing filters, mock save, and mock AI.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Open History and confirm local session item behavior still works.
- [ ] Open Settings and confirm mock Auth / account entry is available there.
- [ ] Confirm Settings says login is for future cloud features and not required for basic camera use.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

Known product gaps / follow-up TODO:

- [ ] Final product should open directly into Camera and should not show a landing / browse screen first.
- [ ] Auth should not block basic camera use; login should move to Settings or future cloud-feature entry points.
- [ ] Camera page should feel more like a Dazz-style camera shell and less like a content page.
- [ ] Camera viewfinder should be more prominent and overall information density should be lower.
- [ ] Camera controls should be completed later: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- [ ] Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign, if the current shell remains visually insufficient.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Confirm app enters Camera directly.
- [ ] Confirm camera permission and live preview still work.
- [ ] Confirm camera controls are reachable while framing.
- [ ] Capture one still photo.
- [ ] Trigger mock save and mock AI advice.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 12B

Check:

- [x] Extended the Swift filter preset model with local catalog metadata.
- [x] Added `FilterPresetCategory`.
- [x] Kept the catalog data-driven in `FilterPresetCatalog`.
- [x] Added a Core Image highlight/shadow adjustment to the existing pipeline.
- [x] Implemented Batch 1 hero filters only:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Kept Original as the no-filter option.
- [x] Kept Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no public UI filter names use Kodak, Fujifilm, Leica, Polaroid, CineStill, or other protected brand names.
- [x] Confirmed no LUT, grain, light leak, or texture assets were added.
- [x] Confirmed no backend code was modified.
- [x] Confirmed no real Firebase, Gemini, OpenAI, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, dependencies, third-party SDKs, monetization, premium gating, quota, Phase 13, or 20-filter implementation was intentionally added.

Build / source checks:

- [x] `git diff --check` passed.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / `sandbox-exec` environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-09.
- [x] Forbidden imports scan found no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, or Apple credentials added.
- [x] Forbidden behavior scan found no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, or save-to-Photos implementation added for Phase 12B.

Manual Xcode check on simulator:

- [x] User manually verified Phase 12B in Xcode / Simulator on 2026-06-09 and accepted the current result.
- [x] Launch the app.
- [x] Confirm Camera-first flow still opens correctly.
- [x] Confirm Photo Picker fallback still works.
- [x] Import one photo.
- [x] Open the filter selector.
- [x] Confirm Original is available and shows the unfiltered image or is clearly preserved as the no-filter option.
- [x] Confirm Soft Warm 400 is available and renders an acceptably distinct look.
- [x] Confirm Summer Gold 200 is available and renders an acceptably distinct look.
- [x] Confirm Street Chrome is available and renders an acceptably distinct look.
- [x] Confirm Soft Sun Portrait is available and renders an acceptably distinct look.
- [x] Confirm Cinema Flat is available and renders an acceptably distinct look.
- [x] Confirm Silver Gradation is available and renders an acceptably distinct look.
- [x] Confirm Classic Film, Warm Vintage, and Faded Chrome remain available or clearly mapped.
- [x] Switch between filters and confirm the app does not freeze in the accepted manual pass.
- [x] Trigger mock save success and failure.
- [x] Trigger mock AI success and failure.
- [x] Confirm local session history works.
- [x] Open History and Settings.
- [x] Confirm no real Firebase, AI, Cloud Functions, StoreKit, persistence, upload, export, or save-to-Photos behavior occurs.
- [x] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] HSL-specific tuning is not implemented yet.
- [ ] Vibrance, true fade, grain, bloom, glow, halation, LUT, Metal, and custom shader support remain future work.
- [ ] Batch 1 filters are Core Image MVP approximations, not the final realistic film emulation engine.
- [ ] Phase 13 or later should handle expansion to 12 filters and then 20 filters.
- [ ] LUT, grain overlay, halation, light leak, CCD-style looks, and instant camera looks should remain for later phases.
- [ ] Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.
- [ ] Street Chrome may need a future LUT for more accurate slide / chrome color.
- [ ] Soft Warm 400, Summer Gold 200, and Silver Gradation do not include grain yet.

## Phase 13

Check:

- [x] Expanded the local research preset catalog to 20 presets.
- [x] Kept Original as the no-filter option outside the 20 research presets.
- [x] Preserved legacy starter filters: Classic Film, Warm Vintage, and Faded Chrome.
- [x] Preserved Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Added 14 Phase 13 filters:
  - Everyday Color 400
  - Amber Night 800
  - Vivid Landscape 100
  - Slide Pop
  - Memory Negative
  - Amber Nostalgia
  - Tri Grit 400
  - Neon Tungsten 800
  - Instant Dream
  - Metro Pop
  - Diana Soft
  - Flash Party
  - CCD Party 2008
  - Editor Classic
- [x] Added filter group metadata and localized group titles.
- [x] Updated filter picker UI to use group chips plus a preset grid instead of one long horizontal row.
- [x] Kept all Phase 13 filters as Core Image MVP approximations.
- [x] Confirmed no public UI filter names intentionally use Kodak, Fujifilm, Leica, Polaroid, CineStill, or other protected brand names.
- [x] Confirmed no LUT, true grain, light leak, dust, frame, Metal shader, AI custom filter, premium gating, or real-service implementation was intentionally added.
- [x] Confirmed no backend code was modified.

Build / source checks:

- [x] `git diff --check` passes.
- [x] Xcode build passes. Sandboxed CLI build hit CoreSimulator/sandbox environment limits, then unsandboxed `xcodebuild` completed with `BUILD SUCCEEDED`.
- [x] Forbidden imports scan finds no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- [x] Secrets / config scan finds no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, or provisioning profiles.
- [x] Forbidden behavior scan finds no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, or save-to-Photos implementation added for Phase 13. Existing mock/future placeholder references remain documented from earlier phases.
- [x] Brand-name UI scan finds no Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar brand names in public UI source.

Manual Xcode check on simulator:

- [x] User manually verified Phase 13 in Xcode / Simulator and temporarily accepted the current result on 2026-06-09.
- [x] Launch the app.
- [x] Confirm app can build / run.
- [x] Confirm Camera-first flow still opens correctly.
- [x] Confirm Photo Picker fallback still works.
- [x] Import one photo.
- [x] Open the filter picker.
- [x] Confirm filter groups are visible and usable.
- [x] Confirm the picker is not one long horizontal row.
- [x] Confirm Original is available and shows the unfiltered image.
- [x] Confirm Classic Film, Warm Vintage, and Faded Chrome remain available or clearly mapped.
- [x] Confirm Batch 1 six hero filters remain available:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Confirm all 20 research presets are available:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
  - Everyday Color 400
  - Amber Night 800
  - Vivid Landscape 100
  - Slide Pop
  - Memory Negative
  - Amber Nostalgia
  - Tri Grit 400
  - Neon Tungsten 800
  - Instant Dream
  - Metro Pop
  - Diana Soft
  - Flash Party
  - CCD Party 2008
  - Editor Classic
- [x] Switch between filters and confirm the app does not freeze.
- [x] Confirm newly added filters have temporarily acceptable visual differences.
- [x] Trigger mock save success and failure.
- [x] Trigger mock AI success and failure.
- [x] Confirm local session history records the selected filter id.
- [x] Open History and Settings.
- [x] Confirm no raw localization keys appear.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.
- [x] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- [ ] Phase 13B can be opened later to adjust individual filter parameters, ordering, grouping, picker UI, or visual differences.
- [ ] True grain overlays, LUT assets, halation, light leaks, dust, frames, CCD / instant camera asset treatment, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- [ ] Instant Dream, Diana Soft, CCD Party 2008, Flash Party, and other camera looks are color / contrast / vignette / bloom approximations only.
- [ ] AI custom filters, reference-image-to-filter, and AI image generation remain future phases.
- [ ] Premium gating remains future monetization work only.

## Filter Research Docs Backfill + Alignment Check

Check:

- [x] Read supplied filter research report at `/Users/a1234/Downloads/濾鏡.md`.
- [x] Confirmed `docs/filter-research-popular-film-looks.md` exists and backfilled source status / current 20-preset catalog notes.
- [x] Confirmed `docs/filter-preset-schema.md` exists and records current schema / deferred fields.
- [x] Confirmed `docs/filter-roadmap.md` exists and records current Phase 13 implementation alignment.
- [x] Confirmed `docs/prompts/phase-12-filter-preset-schema-and-batch1.md` exists.
- [x] Confirmed `docs/prompts/phase-13-expanded-filter-library-20-presets.md` exists.
- [x] Confirmed `Original` remains no-filter.
- [x] Confirmed legacy starter filters remain present: Classic Film, Warm Vintage, Faded Chrome.
- [x] Confirmed Batch 1 hero filters remain present: Soft Warm 400, Summer Gold 200, Street Chrome, Soft Sun Portrait, Cinema Flat, Silver Gradation.
- [x] Confirmed Phase 13 additional filters remain present: Everyday Color 400, Amber Night 800, Vivid Landscape 100, Slide Pop, Memory Negative, Amber Nostalgia, Tri Grit 400, Neon Tungsten 800, Instant Dream, Metro Pop, Diana Soft, Flash Party, CCD Party 2008, Editor Classic.
- [x] Confirmed stable filter IDs remain present in `FilterPresetCatalog.swift`.
- [x] Confirmed filter grouping / category metadata remains present.
- [x] Confirmed public UI display names remain brand-safe and do not use Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar protected brand names.
- [x] Confirmed Phase 13 filters remain Core Image MVP approximations.
- [x] Confirmed no Swift code was modified for this docs backfill.
- [x] Confirmed no backend code was modified for this docs backfill.

Known TODOs:

- [ ] Phase 13B may tune individual filter parameters after more real-photo testing.
- [ ] Phase 13B may revisit filter ordering, grouping, picker UI, or visual differences.
- [ ] File-backed local catalog loading can be considered later; current catalog remains Swift in-code.
- [ ] True LUT support remains future work.
- [ ] True grain overlays, halation, light leak, dust, frames, CCD / instant camera asset treatment, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- [ ] Public UI filter names should continue avoiding protected brand names unless legal approval exists.

## Phase 14

Check:

- [x] Added local/mock live guidance overlay to the Camera screen.
- [x] Added guidance toggle in the Camera status bar.
- [x] Added mock guidance states: off, idle, scanning, suggestion available, paused.
- [x] Added 1-3 local mock shooting suggestions.
- [x] Kept the overlay compact and camera-like instead of article/chat-style.
- [x] Kept overlay away from capture, filter picker, Photo Picker import, flash/timer/flip controls, and tab navigation.
- [x] Preserved Camera-first flow.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved Photo Picker fallback.
- [x] Preserved mock save, mock AI, local session history, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Secrets / config scan passed.
- [x] Forbidden behavior scan passed for new Vision, frame analysis, frame upload/stream/persistence, Gemini Live, voice, ASR, Parakeet, Firebase, AI, StoreKit, persistence, quota, or export behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm app enters the camera-first surface.
- [ ] Confirm the Camera status bar shows the guidance toggle.
- [ ] Toggle guidance off and confirm the overlay hides.
- [ ] Toggle guidance on and confirm the overlay appears.
- [ ] Tap the overlay state action and confirm idle, scanning, suggestion, and paused states are reachable.
- [ ] Confirm 1-3 short mock suggestions appear in suggestion state.
- [ ] Confirm capture button remains reachable.
- [ ] Confirm filter picker still opens.
- [ ] Confirm Photo Picker import still works.
- [ ] Confirm flash / timer / flip controls remain reachable.
- [ ] Confirm all 20 filters and grouping still work.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Confirm local session history still records sessions.
- [ ] Open History and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Phase 14 guidance is mock UX only, not real AI guidance.
- [ ] Phase 15 may prototype local rule-based / Apple Vision guidance only after explicit request.
- [ ] Future local providers, cloud snapshot guidance, Gemini Live, and voice / ASR remain later phases.
- [ ] Physical-device camera overlay readability and responsiveness should be checked on a real iPhone.

## Phase 14C

Check:

- [x] Added a fixed selected-photo Back to Camera / Clear action bar.
- [x] Kept the action bar visible without scrolling to the bottom of the selected-photo flow.
- [x] Back to Camera clears the selected image and returns to the camera preview / simulator fallback.
- [x] Clear clears the selected image and returns to the camera preview / simulator fallback.
- [x] Clearing a selected photo resets render, filter error, and mock save state for the selected-photo view.
- [x] Clearing a selected photo preserves the currently selected filter preset for the next capture/import.
- [x] Preserved Photo Picker re-import behavior.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, live guidance mock, lens selector, Inspiration, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings for the selected-photo actions.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Refined secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Swift forbidden behavior scan found no Phase 14 Camera additions for Vision, frame analysis, Gemini Live, voice / ASR, Firebase, StoreKit, persistence, export, or save-to-Photos behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm Camera is the first selected tab.
- [ ] Import a photo from the Camera tab.
- [ ] Confirm the selected-photo screen immediately shows Back to Camera / Clear controls near the top.
- [ ] Confirm the controls are visible without scrolling to the bottom of the selected-photo flow.
- [ ] Tap Back to Camera and confirm the app returns to the camera preview or simulator fallback.
- [ ] Import a photo again.
- [ ] Tap Clear and confirm the app returns to the camera preview or simulator fallback.
- [ ] Confirm Photo Picker can be used again after clearing.
- [ ] Confirm the current filter selection remains available for the next photo.
- [ ] Open filter picker and confirm 20 filters / grouping still work.
- [ ] Trigger mock save success and failure on a selected photo.
- [ ] Trigger mock AI success and failure on a selected photo.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Confirm live guidance mock and lens selector still work in camera mode.
- [ ] Open Inspiration, History, and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Verify fixed selected-photo action bar spacing on small physical iPhone screens.
- [ ] Phase 14C does not change filter rendering, filter grouping, guidance logic, or real camera hardware behavior.

## Phase 14B

Check:

- [x] Kept Camera as the primary first tab.
- [x] Did not reintroduce a landing intro.
- [x] Moved live guidance below the framed viewport and above the shutter/control area.
- [x] Kept live guidance out of the main viewfinder.
- [x] Removed the large Camera title feel from the primary Camera tab context.
- [x] Replaced the visible `Local camera shell` copy with compact camera-style status chips.
- [x] Adjusted Camera layout toward a darker Dazz-like camera back with a compact framed viewport.
- [x] Added visible focal labels: 24mm, 35mm, 77mm.
- [x] Added mock lens selector UI scaffold.
- [x] Lens selector selection updates the focal label in memory only.
- [x] Lens selector does not perform real AVFoundation multi-lens hardware switching.
- [x] Preserved flash, timer, flip, capture, Photo Picker import, filter entry, and live guidance toggle.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, History, and Settings.
- [x] Repositioned the former Guide tab as Inspiration / 靈感.
- [x] Removed Open Camera as the primary Guide / Inspiration CTA.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Secrets / config scan passed.
- [x] Swift code forbidden behavior scan passed for new Vision, frame analysis, frame upload/stream/persistence, Gemini Live, voice, ASR, Parakeet, Firebase, AI, StoreKit, persistence, quota, or export behavior.
- [x] Broader iOS diff scan only matched localization safety copy that says StoreKit / quota are not connected.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm Camera is the first selected tab.
- [ ] Confirm no landing intro appears.
- [ ] Confirm the Camera screen no longer shows a large `Camera` / `相機` page title.
- [ ] Confirm the main viewfinder is framed and compact, with dark camera chrome around it.
- [ ] Confirm the viewfinder has a visible focal label.
- [ ] Confirm the lens selector is visible.
- [ ] Tap 24mm, 35mm, and 77mm and confirm the focal label changes.
- [ ] Confirm lens selection does not break flip camera.
- [ ] Confirm guidance appears above the shutter/control area and not over the main viewfinder.
- [ ] Confirm guidance toggle still hides and shows guidance.
- [ ] Confirm capture button remains reachable.
- [ ] Confirm flash, timer, flip, Photo Picker import, and filter entry remain reachable.
- [ ] Open filter picker and confirm 20 filters / grouping still work.
- [ ] Capture or import a photo, then run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records items.
- [ ] Open History and Settings.
- [ ] Open Inspiration and confirm it is no longer a camera-launch guide.
- [ ] Confirm Inspiration cards show shooting ideas, mock AI advice entry, filter inspiration, and future AI placeholders.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Mock lens selector does not switch real device lenses.
- [ ] Physical-device layout should be checked for camera-shell proportions, control spacing, and one-handed reach.
- [ ] Future real camera capability detection can be considered only in a later explicit phase.
- [ ] Phase 15 remains blocked until Phase 14B is reviewed, committed, pushed, and read-only confirmed.
