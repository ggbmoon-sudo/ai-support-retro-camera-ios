# Manual Smoke Tests

## Phase 17A

Check:

- [ ] App still launches.
- [ ] Camera remains local-only and no Camera AI Snapshot / Quick Advice cloud entry returns.
- [ ] Inspiration AI Hub still works.
- [ ] Imported / selected photo Photo Advisor still uses mock/local result by default.
- [ ] Existing Photo Advisor language / tone behavior still works.
- [ ] Consent view copy exists in the reusable Cloud AI boundary component if reached through an internal path.
- [ ] Normal production UI does not trigger a real remote AI call.
- [ ] No provider API key exists in the iOS app or new backend skeleton.
- [ ] Backend `GET /health` returns mock-only service status.
- [ ] Backend `POST /v1/ai/photo-advisor` returns a structured mock response for a valid consented request.
- [ ] Backend rejects missing consent.
- [ ] Backend rejects unsupported schema versions.
- [ ] Backend does not require a provider key.
- [ ] Backend does not log raw image, base64 image, request payload, EXIF / GPS, face data, or provider raw response.
- [ ] No raw localization keys appear.
- [ ] No offensive / explicit profanity copy appears.

Known TODOs:

- [ ] Phase 17A does not connect a real provider.
- [ ] Phase 17A does not enable production remote Cloud AI from iOS.
- [ ] Future Phase 17B may wire remote service behind an internal debug flag only after explicit approval.
- [ ] Future Phase 17C may add real provider integration only after provider policy, secret management, timeout, validation, moderation, and cost guard work is explicitly approved.

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

## Phase 16 + Phase 16A-R UX Rescue Closeout

User manual Xcode / Simulator verification:

- [x] Camera UX accepted for current Phase 16 / 16A-R closeout.
- [x] Camera shutter is visible and tappable.
- [x] Camera does not require scroll.
- [x] AI Snapshot compact entry works.
- [x] AI Snapshot consent step works.
- [x] AI Snapshot mock result works.
- [x] Mock guidance works.
- [x] Local guidance works.
- [x] Guidance / AI / filter / lens callouts have no obvious overlap.
- [x] Filter pill / callout works.
- [x] Lens dropdown works.
- [x] Flash works.
- [x] Timer works.
- [x] Flip camera control works.
- [x] Capture works.
- [x] Front-camera screen flash scaffold is preserved.
- [x] Phase 15B brightness guidance works.
- [x] Phase 15C face framing / headroom guidance works.
- [x] Phase 15D stability / priority / anti-flicker works.
- [x] Camera tab no longer has Photo Picker.
- [x] Inspiration tab has the import photo entry.
- [x] Inspiration import flow remains available.
- [x] Ordinary pages bottom tab bar is acceptable.
- [x] Settings bottom navigation no longer has blocker-level content obstruction.
- [x] Inspiration bottom navigation no longer has blocker-level content obstruction.
- [x] History bottom navigation no longer has blocker-level content obstruction.
- [x] 20 filters / grouping work.
- [x] Mock save works.
- [x] Mock AI works.
- [x] Local session history works.
- [x] English and Traditional Chinese localization has no raw keys.
- [x] No real network / upload / AI / Firebase / StoreKit / persistence / export behavior was observed.
- [x] No secrets / Firebase config / API keys were added.
- [x] No backend changes were added.
- [x] `ios-app/AIPhotoApp/App/File.txt` is not present after cleanup.

Final closeout checks to keep before commit:

- [ ] Confirm `git status --short` contains only Phase 16 mock snapshot, Phase 16A-R UX rescue, localization, docs, and smoke-test files.
- [ ] Confirm `git diff --check` passes.
- [ ] Confirm forbidden imports scan has no Firebase / Gemini / OpenAI / StoreKit imports.
- [ ] Confirm network / upload scan has no real `URLSession`, `URLRequest`, WebSocket, upload, Firebase Storage, Firestore, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- [ ] Confirm secrets / config scan finds no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase config, private keys, OAuth secrets, or Apple credentials.
- [ ] Confirm frame / photo persistence scan finds no raw frame, selected photo, or cloud request payload persistence.

Known TODOs:

- [ ] Real cloud AI remains deferred to a later explicit Phase 16B / 17 request after commit, push, and read-only confirmation.
- [ ] Ordinary tab bar and Camera spacing can receive small visual tuning later if new screenshots reveal device-specific spacing issues.

## Phase 16T / HK3 Mock Language Mode UI

Check:

- [ ] Open Settings.
- [ ] Confirm the Language / Tone section appears.
- [ ] Confirm only language buttons are shown.
- [ ] Confirm no separate tone selector appears.
- [ ] Confirm English / 繁體中文 / 简体中文 / 廣東話 options are visible.
- [ ] Select English, 繁體中文, 简体中文, and 廣東話 and confirm the choice only affects the Settings mock selection.
- [ ] Confirm no production-visible preview card appears.
- [ ] Confirm no production-visible Tip / After fixing / 提示 / 修正後 phrase examples appear.
- [ ] Confirm no production-visible explicit profanity example appears.
- [ ] Confirm Cantonese safety notice appears when 廣東話 is selected.
- [ ] Confirm safety notice says 麻煩友 direction comments on shooting choices and photo state, not appearance, body, or identity.
- [ ] Confirm there is no app-wide language switching.
- [ ] Confirm Camera guidance copy remains unchanged.
- [ ] Confirm Photo Advisor, Filter Lab, and 改圖師 runtime copy remain unchanged.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no UserDefaults, persistence, network, backend, real AI, provider SDK, StoreKit, payment, moderation, or runtime profanity filtering behavior occurs.

Known TODOs:

- [ ] Runtime language mode is not implemented.
- [ ] Deterministic copy resolver scaffold is now HK4, but formal language mode remains future-only.
- [ ] Explicit profanity remains future-only and requires separate safety / App Store / age-rating review before any runtime use.

## Phase 16U / HK4 Deterministic Camera Coach Copy Resolver Integration

Check:

- [ ] Open Camera and confirm the camera preview or simulator fallback still opens normally.
- [ ] Confirm Live Guidance / 本機導拍 still appears when enabled.
- [ ] Confirm Local Camera Coach suggestions still update without obvious flicker or repeated aggressive copy.
- [ ] Confirm existing guidance priority / anti-flicker behavior still feels preserved.
- [ ] Confirm no explicit profanity appears in live camera guidance.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm Settings Language / Tone remains mock-only and non-persistent.
- [ ] Confirm changing Settings Language / Tone does not change Camera runtime copy.
- [ ] Confirm Photo Advisor runtime copy is unchanged.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no UserDefaults, @AppStorage, Core Data, SwiftData, persistence, network, backend, real AI, provider SDK, StoreKit, payment, moderation, or runtime profanity filtering behavior occurs.

Known TODOs:

- [ ] Runtime tone remains neutral by default.
- [ ] HK / 麻煩友 runtime activation requires a future explicit HK5 phase.
- [ ] Explicit profanity remains unsupported in runtime.

## Phase 16V Persistent Language / Tone Settings + Camera Coach Runtime Integration

Check:

- [ ] Open Settings.
- [ ] Select English, 繁體中文, 简体中文, and 廣東話 in the Language / Tone section.
- [ ] Confirm non-Cantonese languages do not show a tone selector.
- [ ] Select 廣東話 and confirm only 香港口語 and 麻煩友 tone choices are available.
- [ ] Confirm 麻煩友（粗口） is not available as an active runtime option.
- [ ] Restart the app and confirm the selected language / tone preference persists.
- [ ] Open Camera.
- [ ] Trigger Local Camera Coach guidance where possible.
- [ ] Confirm English selection shows English neutral Camera Coach copy for supported categories.
- [ ] Confirm 繁體中文 selection shows Traditional Chinese neutral Camera Coach copy for supported categories.
- [ ] Confirm 简体中文 selection shows Simplified Chinese neutral Camera Coach copy for supported categories.
- [ ] Confirm 廣東話 + 香港口語 shows Cantonese conversational Camera Coach copy for supported categories.
- [ ] Confirm 廣東話 + 麻煩友 shows non-explicit 麻煩友 Camera Coach copy for supported categories.
- [ ] Confirm no explicit profanity appears in runtime Camera Coach copy.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm existing guidance priority / anti-flicker behavior still feels preserved.
- [ ] Confirm Photo Advisor runtime copy is unchanged.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no photos, camera frames, face data, raw image data, AI responses, prompts, exports, cloud data, or sensitive inference are persisted.
- [ ] Confirm persistence is limited to `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, moderation, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Local Camera Coach currently uses deterministic phrase categories only.
- [ ] Deeper issue-resolved praise wiring can be considered later without destabilizing anti-flicker logic.
- [ ] Expanding the resolver to Photo Advisor / Filter Lab / 改圖師 requires a separate explicit phase.
- [ ] Explicit profanity remains unsupported in runtime and requires separate safety / App Store / age-rating review before any future use.

## Phase 16W Extend Language / Tone Resolver to Photo Advisor

Check:

- [ ] Open Settings and select English.
- [ ] Open captured / imported photo AI 建議 / Photo Advisor.
- [ ] Confirm Photo Advisor copy appears in English.
- [ ] Select 繁體中文.
- [ ] Open Photo Advisor again and confirm copy appears in Traditional Chinese.
- [ ] Select 简体中文.
- [ ] Open Photo Advisor again and confirm copy appears in Simplified Chinese.
- [ ] Select 廣東話 and 香港口語.
- [ ] Open Photo Advisor again and confirm copy appears in Cantonese conversational style.
- [ ] Select 廣東話 and 麻煩友.
- [ ] Open Photo Advisor again and confirm copy appears in non-explicit 麻煩友 style.
- [ ] Confirm no explicit profanity appears in Photo Advisor runtime copy.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm Photo Advisor card structure is unchanged.
- [ ] Confirm recommended filter apply still works.
- [ ] Confirm Camera Coach still follows the selected language / tone.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no new persistence beyond `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Photo Advisor labels can receive deeper localization polish in a later explicit phase.
- [ ] Filter Lab / 改圖師 copy resolver integration remains future-only.
- [ ] Explicit profanity remains unsupported in Photo Advisor runtime.

## Phase 16W-R2 Camera Local-only AI Surface Cleanup

Check:

- [ ] Open Camera.
- [ ] Confirm no AI Snapshot / Quick Advice / cloud-style AI button appears on Camera.
- [ ] Confirm no Camera surface shows `AI Snapshot`, `Quick Advice`, `快速建議`, or `麻煩友看看`.
- [ ] Confirm Local Guidance chip still appears.
- [ ] Select English in Settings.
- [ ] Confirm Local Guidance chip / sentence appears in English.
- [ ] Select 简体中文 in Settings.
- [ ] Confirm Local Guidance chip / sentence appears in Simplified Chinese.
- [ ] Select 廣東話 / 麻煩友 in Settings.
- [ ] Confirm Local Guidance uses non-explicit Cantonese 麻煩友 copy.
- [ ] Confirm no explicit profanity appears in Camera Local Guidance.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm timer, flash, flip, filter, and lens selector still work.
- [ ] Capture or select a photo from the Camera tab and confirm the floating tray does not show AI Advisor access on the Camera surface.
- [ ] Confirm Camera selected-photo filter grid can still apply filters and auto-dismiss.
- [ ] Open Inspiration.
- [ ] Confirm imported / selected photo AI 建議 / Photo Advisor remains available there.
- [ ] Confirm Photo Advisor still follows selected language / tone preference.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no new persistence beyond `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Future real cloud AI should target Inspiration / Photo Advisor first, not Camera tab.
- [ ] Camera AI Snapshot service boundary files can remain for reference but should not be exposed on Camera without a new explicit phase.
- [ ] Filter Lab / 改圖師 copy resolver integration remains future-only.

## Phase 16X Inspiration AI Hub Cleanup

Check:

- [ ] Open Camera.
- [ ] Confirm Camera remains local-only and no cloud AI / AI Snapshot / Quick Advice entry returns.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Open Inspiration.
- [ ] Confirm AI Hub / creative hub layout appears.
- [ ] Confirm import photo analysis is a clear primary entry.
- [ ] Import a photo and confirm the selected / imported photo workflow still opens.
- [ ] Confirm Photo Advisor / AI 建議 result still works from the imported / selected photo flow.
- [ ] Confirm Photo Advisor follows Settings language / tone preference.
- [ ] Confirm Filter Lab mock remains accessible.
- [ ] Confirm Filter Lab remains mock/local and does not upload.
- [ ] Confirm Photo Edit / 改圖師 placeholder is disabled / future-only if present.
- [ ] Confirm future cloud AI notice says clear consent is required before any cloud analysis.
- [ ] Confirm future cloud AI notice says no background photo upload.
- [ ] Confirm no real network, backend, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no explicit profanity appears in production Inspiration UI or Photo Advisor runtime.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.

Known TODOs:

- [ ] Future real cloud AI still requires explicit Phase 17 / backend boundary approval.
- [ ] Photo Edit / 改圖師 remains placeholder-only until a dedicated mock UX or provider research implementation phase.
- [ ] Filter Lab remains mock/local until a dedicated future phase.

## Phase 16K-L Local Heuristic Advisor + Selected Photo UX Polish

Check:

- [x] User manually accepted Phase 16K-L in Xcode / Simulator on 2026-06-12.
- [x] Import a photo from Inspiration / 靈感 and confirm the selected-photo result screen opens normally.
- [x] Confirm selected / imported photo result still shows the floating AI / Filter bar.
- [x] Tap AI advice / AI 建議 and confirm the advisor sheet opens.
- [x] Select a warm / portrait-like filter such as Soft Warm 400 or Instant Dream, open AI advice, and confirm the result leans warm / portrait / soft retro.
- [x] Confirm warm recommendations use existing filters such as Soft Warm 400, Instant Dream, and Summer Gold 200.
- [x] Select a street / chrome / high-contrast filter such as Street Chrome or Metro Pop and confirm the result leans street / chrome / city.
- [x] Confirm street / chrome recommendations use existing filters such as Street Chrome, Metro Pop, and Silver Gradation.
- [x] Select a night / neon filter such as Amber Night 800 or Neon Tungsten 800 and confirm the result leans night / neon / low-light.
- [x] Confirm night / neon recommendations use existing filters such as Amber Night 800, Neon Tungsten 800, and CCD Party 2008.
- [x] Select a cinematic filter such as Cinema Flat or Editor Classic and confirm the result leans cinematic / low contrast.
- [x] Confirm cinematic recommendations use existing filters such as Cinema Flat and Editor Classic.
- [x] Import or capture a landscape / wide photo and confirm crop / retake advice suggests keeping background / sky / environment.
- [x] Import or capture a portrait / tall portrait photo and confirm crop / retake advice mentions centered subject / natural vertical spacing / headroom.
- [x] Import or use a square photo and confirm the result remains stable and does not require a retake.
- [x] Confirm recommended filter IDs all resolve to real presets in the existing catalog.
- [x] Confirm invalid recommendation fallback is covered by validator/code review or an injected preview/service test if manually testable.
- [x] Tap Filter / 濾鏡 from the floating bar and confirm the floating grid opens.
- [x] Select a filter from the floating grid and confirm it applies immediately and auto-dismisses.
- [x] Confirm the current filter label updates after selection.
- [x] Confirm the AI advisor sheet can be reopened after filter selection and reflects the selected filter family.
- [x] Confirm selected-photo UI has less clutter, tighter preview spacing, and compact local-only copy.
- [x] Confirm no duplicate full inline AI advisor / filter grid / mock save sections appear below the photo.
- [x] Confirm no cloud save CTA appears for free / unknown user.
- [x] Confirm no local download, export, save-to-Photos, StoreKit paywall, premium gate, or cloud save UI appears.
- [x] Confirm Filter Lab still opens and result preview remains stable.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, History, and Settings still work.
- [x] Confirm English and Traditional Chinese UI show no raw localization keys.
- [x] Confirm no 0-100 score, star rating, beauty wording, attractiveness wording, identity, gender, age, emotion, health, race, religion, or sensitive inference copy appears.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, raw image persistence, AI response persistence, or generated filter save occurs.

Known TODOs:

- [ ] Photo Advisor remains mock-only and local-only.
- [ ] Advisor heuristic remains local/simple, not real AI.
- [ ] Future local heuristic can inspect safer image statistics only if explicitly scoped.
- [ ] Future real cloud advisor requires backend boundary work first.
- [ ] Future local heuristic advisor can be expanded only with safe local signals.
- [ ] Cloud save / paid-user cloud save / free local lossless download require a dedicated entitlement / export phase.
- [ ] No StoreKit or export exists yet.
- [ ] No StoreKit / export / save-to-Photos yet.

## Phase 16I Mock Post-capture AI Advisor UX

Check:

- [x] Added typed Post-capture Photo Advisor models.
- [x] Added `PhotoAdvisorService` protocol.
- [x] Added `MockPhotoAdvisorService`.
- [x] Added 8 mock fixtures.
- [x] Added validator / fallback logic.
- [x] Added compact advisor result card.
- [x] Added analyzing, success, failed, and unavailable states.
- [x] Added existing-filter recommendation cards / chips.
- [x] Added apply recommended filter CTA using the existing filter selection mechanism.
- [x] Added retake / crop advice display.
- [x] Integrated advisor card into selected-photo result flow for captured and imported photos.
- [x] Kept advisor out of the live Camera preview overlay.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed source does not add real AI, backend, network, upload, persistence, export, Firebase, Gemini, OpenAI, StoreKit, provider imports, API keys, caption UI, photo score, beauty / attractiveness scoring, or sensitive inference.

Manual Xcode / Simulator check:

- [x] User manually accepted Phase 16I Mock Post-capture AI Advisor UX in Xcode / Simulator on 2026-06-11.
- [x] Launch the app.
- [x] Import one photo from Inspiration / selected-photo import path and confirm the selected-photo result flow appears.
- [x] Confirm the selected / imported photo screen shows the floating bar.
- [x] Confirm AI advice / AI 建議 opens the mock Photo Advisor through floating access.
- [x] Confirm the advisor shows Mock and local demo labeling.
- [x] Confirm the analyzing state appears briefly.
- [x] Confirm a mock result appears with summary, strengths, suggestions, recommended filters, retake advice, and crop advice.
- [x] Confirm recommended filters show existing filter names and short reasons.
- [x] Tap a recommended filter and confirm the selected-photo preview applies that existing filter.
- [x] Confirm filter grid opens from the floating bar.
- [x] Select a filter from the floating grid and confirm it applies and auto-dismisses the grid.
- [x] Confirm duplicate inline AI / filter sections are cleaned up in the selected-photo flow.
- [x] Confirm invalid filter fallback path is covered by code review / validator review.
- [x] Confirm no 0-100 score, star rating, beauty wording, attractiveness wording, identity, gender, age, emotion, health, race, religion, or sensitive inference copy appears.
- [x] Confirm `Mock demo, no upload/no save` copy is visible.
- [x] Confirm no raw localization keys appear in EN or zh-Hant.
- [x] Capture a photo if camera is available and confirm the selected-photo result flow remains usable.
- [x] Confirm Camera live preview remains fullscreen/native-camera-like and does not become a scroll page.
- [x] Confirm shutter remains visible and tappable in capture mode.
- [x] Confirm Pose Overlay still opens, mirrors, closes, and does not block controls.
- [x] Confirm AI Snapshot compact control still opens and returns mock result.
- [x] Confirm live guidance, filter pill, lens dropdown, timer, flash, flip, and capture still work.
- [x] Confirm Filter Lab in Inspiration still opens and mock generated filter flow still works.
- [x] Confirm History and Settings still render.
- [x] Confirm no cloud save CTA for free / unknown user.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, network prompt, StoreKit, quota, persistence, export, save-to-Photos, or backend behavior occurs.

Known TODOs:

- [ ] Mock Photo Advisor remains mock-only.
- [ ] Future real cloud advisor requires backend boundary work.
- [ ] Future local heuristic advisor may be added before real cloud if explicitly requested.
- [ ] Cloud save / paid-user cloud save / free local lossless download require a dedicated future phase.
- [ ] No StoreKit / export / save-to-Photos yet.

## Phase 16I-R1 Floating Advisor / Filter Grid for Selected Photo UX

Check:

- [x] User manually accepted Phase 16I-R1 floating advisor / filter grid UX in Xcode / Simulator on 2026-06-11.
- [x] Import a 4:6 portrait photo.
- [x] Import a 1:1 square photo.
- [x] Import a 4:5 or 3:4 portrait photo if available.
- [x] Import a landscape photo if available.
- [x] Confirm the floating selected-photo tray is visible without scrolling to the page bottom.
- [x] Confirm the tray respects the bottom safe area / home indicator.
- [x] Confirm the tray does not cover Back to Camera / Clear controls.
- [x] Tap Filter / current filter in the tray.
- [x] Confirm the floating filter grid opens without scrolling to the inline filter section.
- [x] Confirm AI recommended filters appear first when available.
- [x] Confirm all existing local filter presets remain available in the grid.
- [x] Select a filter from the floating grid.
- [x] Confirm the selected filter applies immediately.
- [x] Confirm the grid auto-dismisses after filter selection.
- [x] Confirm the current filter label in the tray updates.
- [x] Reopen the floating filter grid and select a different filter.
- [x] Tap AI advice in the tray.
- [x] Confirm the floating AI advisor sheet opens without scrolling to the inline advisor card.
- [x] Confirm the advisor sheet shows mock / no-upload copy.
- [x] Confirm opening AI advice closes the filter grid.
- [x] Confirm opening the filter grid closes the AI panel.
- [x] Confirm tapping background or close collapses the active floating panel.
- [x] Confirm the full inline filter selector is no longer duplicated below the photo.
- [x] Confirm the full inline AI Photo Advisor card is no longer duplicated below the photo.
- [x] Confirm no 0-100 score, star rating, beauty, attractiveness, gender, age, emotion, identity, or sensitive attribute wording appears.
- [x] Confirm no raw localization keys appear in the floating tray, filter grid, or advisor sheet.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, or generated filter save occurs.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, Filter Lab, History, and Settings still work.

Known TODOs:

- [ ] Verify the floating panel max height on more physical iPhone sizes during later polish.
- [ ] Phase 16I-R1 remains mock-only and should not start Phase 17 / real AI.
- [ ] Caption / social copy is intentionally not implemented.
- [ ] Advisor results are session-only and are not saved to History.
- [ ] Visual spacing should be reviewed on small iPhone screens after R2 removed duplicate inline selected-photo sections.

## Phase 16I-R2 Selected Photo Cleanup, Navigation Fix, and Filter Lab Layout Hardening

Check:

- [x] User manually accepted Phase 16I-R2 selected-photo cleanup, navigation fixes, and Filter Lab layout hardening in Xcode / Simulator on 2026-06-11.
- [x] Import a photo from Inspiration / 靈感.
- [x] Confirm the selected-photo screen shows the floating AI / Filter bar.
- [x] Confirm no duplicate full inline AI Photo Advisor card appears below the photo.
- [x] Confirm no duplicate full inline legacy mock AI advice card appears below the photo.
- [x] Confirm no duplicate full inline filter grid appears below the photo.
- [x] Confirm no large Mock cloud save / Mock save card appears by default for free / unknown user.
- [x] Confirm Back to Camera / 返回相機 from Inspiration selected-photo result closes the result flow and switches to the outer Camera tab.
- [x] Confirm Back to Camera does not push, present, or nest another CameraView inside Inspiration.
- [x] Return to Inspiration and import another photo.
- [x] Confirm Clear / 清除 closes the selected-photo result and returns to the Inspiration page.
- [x] Confirm Clear does not switch to Camera tab.
- [x] Confirm the floating filter grid still opens from the floating bar.
- [x] Confirm selecting a filter applies it and auto-dismisses the grid.
- [x] Confirm the floating AI advisor still opens from the floating bar.
- [x] Confirm floating AI panel and filter grid still do not overlap.
- [x] Open Filter Lab / 生成我的濾鏡.
- [x] Test a 1:1 reference image and confirm preview/result does not overflow horizontally.
- [x] Test a 4:5 / 3:4 / 4:6 portrait reference image and confirm preview/result does not overflow horizontally.
- [x] Test a 16:9 or landscape reference image and confirm preview/result does not overflow horizontally.
- [x] Test a very wide or very tall image if available and confirm preview/result remains clamped.
- [x] Confirm before / after preview uses safe aspect-fit sizing.
- [x] Confirm slider stays within screen width.
- [x] Confirm tags, warnings, and parameter summary wrap / stay within screen width.
- [x] Confirm Filter Lab header and close button are not displaced by the image.
- [x] Confirm no cloud save CTA, StoreKit paywall, premium gate, local download, export, or save-to-Photos UI appears.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, or generated filter save occurs.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, Filter Lab, History, and Settings still work.
- [x] Confirm no raw localization keys appear.

Known TODOs:

- [ ] Future paid users may see cloud save only after a dedicated entitlement / cloud save phase.
- [ ] Future free users may get local lossless download only after a dedicated export phase.
- [ ] Phase 16I-R2 remains mock-only and should not start Phase 17 / real AI.

## Phase 16G AI Filter Generator Mock in Inspiration

Check:

- [x] Added Filter Lab / Generate My Filter entry to the Inspiration tab.
- [x] Kept Filter Lab out of the Camera tab.
- [x] Added structured mock `GeneratedFilterRecipe` and `GeneratedFilterParameterSet`.
- [x] Added mock `FilterGenerationService`.
- [x] Added validator / clamp helper for finite values and safe ranges.
- [x] Added mock analyzing, result, failed, and unavailable states.
- [x] Added before / after preview using local mock recipe approximation.
- [x] Added intensity slider for session-only preview.
- [x] Added session-only apply action.
- [x] Added sample fallback for picker / simulator testing.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed source does not add real AI, backend, network, upload, persistence, export, LUT, Firebase, Gemini, OpenAI, StoreKit, or provider imports.

Manual Xcode / Simulator check:

- [x] User manually verified Phase 16G in Xcode / Simulator on 2026-06-11 and temporarily accepted the current result.
- [x] Launch the app.
- [x] Open Inspiration / 靈感 tab.
- [x] Confirm Filter Lab / 生成我的濾鏡 entry is visible.
- [x] Confirm the existing Import Photo / mock AI flow is still visible.
- [x] Tap Start generating / 開始生成.
- [x] Choose a reference image with PhotosPicker.
- [x] If PhotosPicker is inconvenient in Simulator, tap Use sample / 使用範例.
- [x] Confirm mock analyzing state appears.
- [x] Confirm generated filter result card appears.
- [x] Confirm mock/source/session-only/no-upload copy is visible.
- [x] Confirm before / after preview appears.
- [x] Move the intensity slider and confirm the preview updates.
- [x] Tap Apply mock filter / 套用 mock 濾鏡 and confirm it only applies to the current Filter Lab preview session.
- [x] Tap Try another image / 再試另一張 and confirm the flow resets.
- [x] Confirm the generated filter is not added to the permanent 20-filter catalog.
- [x] Confirm existing 20 filters, mock save, mock AI, and local history still work from the existing photo import flow.
- [x] Confirm Camera / Pose Overlay / AI Snapshot / guidance / filter / lens still work.
- [x] Open History and Settings.
- [x] Confirm English and Traditional Chinese UI show no raw localization keys.
- [x] Confirm no network prompt, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, save-to-Photos, LUT generation, or backend behavior occurs.

Known TODOs:

- [ ] Filter Generator currently remains mock-only and does not perform real local heuristic analysis.
- [ ] Generated filter recipe visual quality and recipe-to-filter mapping may need tuning.
- [ ] F2 can add local histogram / palette / preset-family extraction later.
- [ ] F3 / real backend AI remains blocked until Cloud AI boundary work is explicitly implemented.
- [ ] LUT generation is not implemented.
- [ ] Generated mock filters are session-only and are not saved, synced, exported, or added to the permanent catalog.
- [ ] Custom filter persistence is not implemented.

## Phase 16E Static Pose Overlay MVP

Check:

- [x] Added 8 static pose guide definitions.
- [x] Added Pose button to the Camera capture surface.
- [x] R1 moved Pose button out of the top bar so it does not collide with Dynamic Island / status area.
- [x] Added Pose quick picker with title, category, hint, and selected state.
- [x] Added a passive SwiftUI pose overlay layer above the camera preview.
- [x] R1 makes the pose overlay render over camera unavailable / Simulator fallback, not only authorized camera preview.
- [x] R1 increases placeholder outline visibility with warm-white line art and higher opacity.
- [x] Added close pose control.
- [x] Added mirror pose control.
- [x] Confirmed source uses `.allowsHitTesting(false)` on the pose overlay.
- [x] Confirmed source uses `.accessibilityHidden(true)` on the decorative pose overlay.
- [x] Confirmed source does not add Vision body pose detection.
- [x] Confirmed source does not add AI pose suggestion.
- [x] Confirmed source does not add persistence, upload, export, Firebase, Gemini, OpenAI, StoreKit, or backend changes.
- [x] Updated English and Traditional Chinese localization strings.

Manual Xcode / Simulator acceptance on 2026-06-11:

- [x] Launch the app and confirm Camera opens normally.
- [x] Confirm the compact Pose button is visible in the lower-left viewfinder tool area and is not blocked by Dynamic Island / status area.
- [x] Tap Pose and confirm the pose picker opens.
- [x] Confirm only one camera callout / picker is open at a time.
- [x] Select a pose and confirm a semi-transparent pose outline appears on the viewfinder.
- [x] On Simulator / camera unavailable fallback, confirm the selected pose outline is visible over the fallback canvas.
- [x] Confirm the overlay does not block shutter tapping.
- [x] Confirm shutter remains visible and tappable.
- [x] Confirm AI Snapshot, filter, guidance, lens, timer, flash, and flip controls are not blocked by the overlay.
- [x] Confirm existing AI Snapshot, guidance, filter, and lens callouts still work.
- [x] Tap mirror / 左右反轉 and confirm the overlay flips horizontally.
- [x] Tap close and confirm the overlay hides.
- [x] Confirm Camera does not require scrolling in capture mode.
- [x] Confirm source still keeps the overlay as a SwiftUI UI layer, separate from the existing capture output path.
- [x] Confirm no Vision body pose, real AI, network, upload, persistence, or export behavior is present.
- [x] Confirm English and Traditional Chinese UI show no obvious raw localization keys.

Known TODOs:

- [ ] Current in-code placeholder pose line art is visually rough and accepted only for the Phase 16E MVP.
- [ ] Replace placeholder pose outlines with original or commercially licensed PDF/vector pose assets in a later dedicated artwork phase.
- [ ] Add a better pose gallery and broader categories in a later phase.
- [ ] Tune default scale / offset / opacity on real iPhone sizes after visual review.
- [ ] Keep Pose categories inclusive and unrestricted; do not add user gender/body classification.
- [ ] AI pose suggestion and Vision body pose matching remain future phases.

## Phase 16A-R10

Check:

- [x] Confirmed R9 metrics were used by `MainTabShellView`, but ordinary tab bar placement still lived inside bottom `safeAreaInset`.
- [x] Confirmed the main visual risk was the bottom inset container / placement path, not Camera rail sharing.
- [x] Replaced ordinary-page tab bar `safeAreaInset` placement with a root `ZStack` bottom overlay.
- [x] Added explicit ordinary tab bar estimated height, bottom fallback, bottom clearance, and content bottom padding metrics.
- [x] Kept Inspiration, History, and Settings on the ordinary floating tab bar overlay path.
- [x] Kept Camera on the separate fullscreen path and did not alter the Camera viewfinder layout.
- [x] Preserved shared ordinary content bottom padding for Inspiration and History.
- [x] Preserved shared Settings footer spacer.
- [x] Removed accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R10-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Switch to Inspiration and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Switch to History and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Switch to Settings and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Confirm ordinary tab bar icon, label, and selected pill are fully visible.
- [ ] Confirm ordinary tab bar bottom has clear distance from the home indicator / screen edge.
- [ ] Confirm Inspiration bottom content can scroll above the floating tab bar.
- [ ] Confirm History empty state / list bottom can scroll above the floating tab bar.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Camera layout was not degraded by the ordinary tab bar fix.
- [ ] Confirm Camera shutter remains visible and tappable.
- [ ] Confirm Inspiration remains one-tap reachable from Camera mode rail and ordinary tab bar.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate the hard overlay placement on target iPhone simulator screenshots.
- [ ] Tune ordinary bottom offset only after confirming the tab bar is no longer clipped.

## Phase 16A-R9

Check:

- [x] Split ordinary-page and Camera bottom navigation metrics more clearly.
- [x] Raised ordinary-page floating tab bar bottom spacing above the home indicator.
- [x] Added shared ordinary content footer inset for Inspiration ScrollView content.
- [x] Added shared ordinary content footer inset for History ScrollView content.
- [x] Increased Settings final footer spacer through the same shared metric.
- [x] Added a minimum Camera compact mode rail home-indicator clearance.
- [x] Kept Camera mode rail on separate fullscreen metrics from ordinary floating tab bar spacing.
- [x] Preserved Camera viewfinder structure without wrapping the capture page in a ScrollView.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R9-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm ordinary-page floating tab bar is visibly above the home indicator.
- [ ] Confirm ordinary tab bar icon, label, and selected pill are fully visible.
- [ ] Confirm Inspiration bottom content can scroll above the floating tab bar.
- [ ] Confirm History empty state / list bottom can scroll above the floating tab bar.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Camera compact mode rail is fully visible and does not overlap the home indicator.
- [ ] Confirm Camera compact mode rail does not block shutter or shutter hit testing.
- [ ] Confirm Camera viewfinder is not visibly shrunk by this safe-area polish.
- [ ] Confirm Inspiration remains one-tap reachable from Camera mode rail and ordinary tab bar.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate ordinary tab bar lift on iPhone simulator screenshots; tune if it feels too high or too low.
- [ ] Validate Camera compact mode rail clearance on physical devices with different home-indicator safe areas.

## Phase 16A-R8

Check:

- [x] Added Camera-only status bar hiding at the app shell level.
- [x] Confirmed Inspiration, History, and Settings stay on the ordinary content-page path with normal status bar behavior.
- [x] Added a Camera-specific top control inset metric for Live Guidance mode, flash, and timer controls.
- [x] Lifted ordinary-page floating tab bar spacing above the home indicator.
- [x] Kept Settings footer spacer so the bottom subscription / polish CTA can remain above the tab bar.
- [x] Kept Camera compact mode rail on separate fullscreen metrics from the ordinary floating tab bar.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R8-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera hides the iOS status bar: no time, Wi-Fi, or battery indicators are visible on Camera.
- [ ] Confirm Inspiration, History, and Settings still show the normal iOS status bar.
- [ ] Confirm Camera top controls do not collide with Dynamic Island / top screen edge after status bar hiding.
- [ ] Confirm ordinary-page floating tab bar is lifted and icon / label are fully visible.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Inspiration / History / Settings content bottom padding is reasonable and not excessive.
- [ ] Confirm Camera compact mode rail is still separate from ordinary tab bar spacing and does not block shutter.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm Camera does not require scrolling.
- [ ] Confirm expanded guidance, AI Snapshot sheet, filter sheet, and lens dropdown do not overlap each other.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate Camera-only status bar hiding in Xcode / Simulator because it is a visual runtime behavior.
- [ ] Tune ordinary floating tab bar lift after device screenshots if it now feels too high or too low.
- [ ] Validate Dynamic Island / notch spacing on physical devices after the status bar hidden pass.

## Phase 16A-R7

Check:

- [x] Raised ordinary-page floating tab bar bottom fallback spacing.
- [x] Kept Settings footer spacer so bottom subscription / polish CTA can remain above the tab bar.
- [x] Added more Camera top safe-area clearance for guidance mode, flash, and timer controls.
- [x] Split Camera filter and guidance overlay bottom metrics into separate vertical slots.
- [x] Kept AI Snapshot, shutter, flip camera, and lens dropdown in the same bottom control band.
- [x] Lifted the lens dropdown callout slightly higher around the flip / lens controls.
- [x] Added Camera compact mode rail shadow to better match ordinary floating tab bar styling.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R7-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera top controls do not collide with the status bar, Dynamic Island, time, Wi-Fi, or battery indicators.
- [ ] Confirm filter pill and guidance pill do not overlap.
- [ ] Confirm expanded guidance, AI Snapshot sheet, filter sheet, and lens dropdown do not overlap each other.
- [ ] Confirm AI Snapshot, shutter, flip camera, and lens dropdown feel aligned as one bottom control band.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm Camera compact mode rail does not block shutter.
- [ ] Confirm Camera does not require scrolling.
- [ ] Confirm Camera viewfinder remains larger than the pre-R6 layout.
- [ ] Switch to Inspiration, History, and Settings.
- [ ] Confirm ordinary floating tab bar is fully visible and no longer clipped by the bottom edge / home indicator.
- [ ] Confirm Settings bottom subscription / polish CTA remains fully visible and tappable.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R6

Check:

- [x] Ran source-to-simulator read-only checks: `git status --short`, `git diff --stat`, and diffs for `MainTabShellView.swift`, `AppTabBarMetrics.swift`, and `CameraView.swift`.
- [x] Confirmed `AIPhotoApp` launches `AppRootView`, which launches `MainTabShellView`.
- [x] Confirmed `MainTabShellView` no longer uses native `TabView`.
- [x] Confirmed `AppTabBarMetrics.swift` is under the filesystem-synchronized `AIPhotoApp` Xcode root group.
- [x] Confirmed sandboxed `xcodebuild` frontend compile input includes `AppTabBarMetrics.swift`.
- [x] Confirmed `CameraView.swift` uses `AppTabBarMetrics` for Camera bottom rail / control / overlay spacing.
- [x] Confirmed Camera primary capture path no longer runs inside `NavigationStack`.
- [x] Confirmed selected/imported photo flow still uses navigation chrome for Back / Clear controls.
- [x] Converted non-Camera bottom navigation from overlay-style drawing to `safeAreaInset`.
- [x] Added a Settings `List` footer spacer so the bottom CTA row can scroll above the tab bar.
- [x] Tightened Camera rail / shutter / overlay metrics for a more visible bottom-space change.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Layout modifier scan confirmed the primary Camera capture path no longer uses `NavigationStack`; remaining Camera `NavigationStack` usage is selected/imported photo flow and sheets.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] The failed sandboxed Xcode frontend command included `AppTabBarMetrics.swift`, confirming it is part of the target compile input.
- [x] Unsandboxed command-line Xcode build was requested but rejected by the current workspace credits limit.

Manual Xcode check on simulator / device:

- [ ] Clean build / run the app. If UI still looks stale, clear DerivedData or uninstall the simulator app, then run again.
- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera bottom rail is visibly lower than Phase 16A-R5.
- [ ] Confirm Camera bottom black empty space is visibly reduced.
- [ ] Confirm Camera viewfinder feels larger / more fullscreen.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Settings and scroll to the bottom.
- [ ] Confirm the subscription / polish CTA row is fully visible and tappable above the bottom tab bar.
- [ ] Confirm Inspiration and History final content is not covered by the bottom tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R5

Check:

- [x] Investigated `MainTabShellView` bottom overlay and content-page inset behavior.
- [x] Investigated `CameraView` bottom control / mode rail flow layout.
- [x] Investigated Inspiration, History, and Settings content-page bottom spacing.
- [x] Added shared `AppTabBarMetrics` for content-page and Camera navigation spacing.
- [x] Non-Camera pages use the shared bottom content inset instead of an inline `86` point spacer.
- [x] Camera does not use the ordinary content-page bottom inset.
- [x] Camera shutter controls and compact mode rail are separate bottom overlays.
- [x] Camera compact mode rail can sit lower without pushing the shutter row upward.
- [x] Camera bottom gradients were reduced to reclaim more viewfinder area.
- [x] Inspiration remains one tap away from Camera.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, and `CameraView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R5-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera no longer has a large empty black area below the compact mode rail.
- [ ] Confirm Camera viewfinder feels larger than Phase 16A-R4.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Settings and scroll to the bottom.
- [ ] Confirm the subscription / polish CTA row is fully visible and tappable above the floating tab bar.
- [ ] Confirm Inspiration and History final content is not covered by the floating tab bar.
- [ ] Confirm tab labels, icons, selected color, and rounded styling feel consistent across Camera rail and ordinary floating tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R4

Check:

- [x] Replaced native `TabView` app shell with a custom tab switcher.
- [x] Camera screen no longer uses the ordinary content-page floating tab bar.
- [x] Camera keeps its own compact mode rail.
- [x] Camera compact mode rail uses matching icon / label / accent styling.
- [x] Inspiration, History, and Settings use a custom floating tab bar.
- [x] Non-camera pages reserve bottom content space so floating tab bar does not cover content.
- [x] Camera bottom inset was tightened after removing ordinary tab-bar reservation from Camera.
- [x] Camera still starts as the primary screen.
- [x] Inspiration remains one tap away from Camera.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Targeted `swiftc -parse` passed for `MainTabShellView.swift` and `CameraView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R4-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera no longer shows / reserves the ordinary floating tab bar area.
- [ ] Confirm Camera bottom black empty space is visibly reduced.
- [ ] Confirm Camera viewfinder feels larger than Phase 16A-R3.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Inspiration and confirm the content-page floating tab bar appears.
- [ ] Confirm Inspiration content is not covered by the floating tab bar.
- [ ] Confirm History and Settings content are not covered by the floating tab bar.
- [ ] Confirm selected tab color / icon / label language feels consistent across Camera rail and ordinary floating tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R3

Check:

- [x] Added a single active camera callout state for guidance, AI Snapshot, filter, and lens.
- [x] Live Guidance compact pill and expanded card are mutually exclusive.
- [x] Expanded Live Guidance sits in the lower-right viewfinder area.
- [x] Filter pill remains in the lower-left viewfinder area and uses a separate overlay slot.
- [x] Opening AI Snapshot collapses Live Guidance and other camera callouts.
- [x] Opening filter picker collapses Live Guidance and marks filter as the active callout.
- [x] Lens selector uses a compact custom dropdown strip near flip camera.
- [x] Lens dropdown auto-collapses after lens selection.
- [x] Flash, timer, flip camera, and guidance mode controls collapse active callouts.
- [x] Bottom inset and overlay offsets were tightened again to reduce empty black space.
- [x] Camera capture mode still does not depend on vertical scrolling.
- [x] Shutter remains fixed in the bottom-center camera controls at source level.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved 20 filters / grouping, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode build was not retried because the prior escalation path was rejected by the current Codex usage/credits limit.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera capture mode has no vertical scroll.
- [ ] Confirm shutter is visible and tappable.
- [ ] Tap Live Guidance and confirm the compact pill is replaced by one expanded card, not stacked with a second guidance card.
- [ ] Confirm expanded Live Guidance does not overlap the filter pill.
- [ ] Confirm filter pill remains lower-left in the viewfinder.
- [ ] Tap filter and confirm guidance collapses while the grouped filter picker opens.
- [ ] Tap AI Snapshot and confirm guidance / lens callouts collapse before consent / result UI appears.
- [ ] Tap lens control and confirm only the lens dropdown appears.
- [ ] Select 24mm / 35mm / 77mm and confirm the lens dropdown closes.
- [ ] Confirm bottom black empty space is reduced versus Phase 16A-R2 Final.
- [ ] Confirm mode rail remains thin and does not block shutter.
- [ ] Confirm Inspiration / History / Settings remain one tap away.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Confirm Photo import from Inspiration still opens selected/imported photo workflow.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R2 Final

Check:

- [x] Camera capture mode still uses a fullscreen native-camera-style canvas and does not depend on vertical scrolling to reach shutter.
- [x] Viewfinder space was increased by reducing persistent camera chrome.
- [x] Bottom gradient height and opacity were reduced so the lower camera area feels less like empty black space.
- [x] Guidance / filter overlay offsets were moved closer to the shutter controls without covering the shutter.
- [x] Bottom capture rail height, bottom padding, and mode rail spacing were tightened.
- [x] The always-visible `24mm / 35mm / 77mm` lens strip was removed from the lower camera chrome.
- [x] Lens selection is now a compact menu near the flip camera control.
- [x] Lens selection continues to use existing mock lens state only.
- [x] Timer Off no longer displays a visible `Off` / `關` label below the icon.
- [x] Timer selections 3s, 5s, and 10s display inside the timer control.
- [x] Flash and timer remain top controls and are not duplicated beside the shutter.
- [x] AI Snapshot remains a compact shutter-side button.
- [x] AI Snapshot still opens mock-only consent / result UI only after explicit tap.
- [x] Live Guidance remains a compact lower-preview pill and expands only when tapped.
- [x] Filter entry remains a translucent lower-left viewfinder pill showing the current preset.
- [x] Filter picker still opens as a sheet and preserves 20 filters / grouping.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration, History, and Settings are one tap away through the bottom mode rail.
- [x] Inspiration remains the visible photo import entry point.
- [x] Front-camera + flash screen-flash scaffold remains present.
- [x] Mock / Local guidance modes remain available.
- [x] Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability remain in place.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Final unsandboxed command-line Xcode simulator build could not be completed because escalation was rejected by the current Codex usage/credits limit.
- [x] Earlier Phase 16A-R2 unsandboxed command-line Xcode simulator build succeeded before the final bottom-spacing adjustment.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera feels like a fullscreen native-camera-style surface, not a scrolling app page.
- [ ] Confirm viewfinder feels larger than Phase 16A-R / earlier Phase 16A-R2 attempts.
- [ ] Confirm bottom black empty space is visibly reduced.
- [ ] Confirm viewfinder bottom feels closer to the shutter controls.
- [ ] Confirm no vertical scroll is needed to press shutter.
- [ ] Confirm shutter is visible and tappable at bottom center.
- [ ] Confirm bottom tab / mode rail does not block the shutter.
- [ ] Confirm Inspiration is one tap away and not hidden only in a three-dot menu.
- [ ] Confirm Camera capture UI has no Photo Picker / Choose Photo entry.
- [ ] Confirm photo import from Inspiration still opens selected/imported photo workflow.
- [ ] Confirm filter pill appears at the lower-left of the viewfinder and opens the grouped filter picker.
- [ ] Confirm selected filter state is preserved after using the filter picker.
- [ ] Confirm compact lens button appears near flip camera and opens 24mm / 35mm / 77mm options.
- [ ] Confirm choosing a lens updates the compact lens label and closes the menu.
- [ ] Confirm timer Off shows only the timer icon.
- [ ] Confirm timer 3s / 5s / 10s displays inside the timer control and capture countdown still works.
- [ ] Confirm AI Snapshot appears near the shutter as a compact button.
- [ ] Tap AI Snapshot and confirm consent / success / failed / unavailable mock paths still work.
- [ ] Confirm Live Guidance appears as a compact pill and expands only when tapped.
- [ ] Confirm Mock / Local guidance modes still work.
- [ ] Confirm Phase 15B / 15C / 15D guidance remains stable.
- [ ] Confirm front-camera mock + flash shows the screen-flash scaffold during capture.
- [ ] Capture a mock photo and confirm selected-photo Back to Camera / Clear remains visible.
- [ ] Test mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R

Check:

- [x] Camera capture mode uses a fullscreen native-camera-style canvas instead of a card stack.
- [x] Camera capture mode does not depend on vertical scrolling to reach shutter.
- [x] Bottom tab bar is hidden while shooting so it cannot cover the shutter.
- [x] A compact top menu preserves navigation to Inspiration, History, and Settings while the Camera tab bar is hidden.
- [x] Shutter is fixed at bottom center in the camera overlay.
- [x] AI Snapshot is a compact button beside the shutter.
- [x] AI Snapshot still opens mock-only consent / result UI only after explicit tap.
- [x] Live Guidance defaults to a compact lower-preview pill.
- [x] Live Guidance can expand into the existing short callout.
- [x] Filter entry is a translucent lower-left viewfinder button showing the current preset.
- [x] Filter picker opens as a sheet and preserves 20 filters / grouping.
- [x] Camera capture UI does not show a Photo Picker / Choose Photo entry.
- [x] Inspiration remains the photo import entry point.
- [x] Timer options remain Off, 3s, 5s, and 10s.
- [x] Front-camera + flash screen-flash scaffold remains present.
- [x] Mock / Local guidance modes remain available.
- [x] Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability remain in place.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Vision / face safety scan confirmed no new Vision request type, face recognition, identity inference, or sensitive inference behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera feels fullscreen and not like a scrolling app page.
- [ ] Confirm no vertical scroll is needed to press shutter.
- [ ] Confirm bottom tab bar does not cover shutter in Camera shooting mode.
- [ ] Confirm shutter is visible and tappable at bottom center.
- [ ] Confirm the top menu can navigate to Inspiration, History, and Settings.
- [ ] Confirm flash and timer controls are reachable near the top.
- [ ] Confirm Timer options Off, 3s, 5s, and 10s work.
- [ ] Confirm front-camera mock + flash shows the screen-flash scaffold during capture.
- [ ] Confirm AI Snapshot appears beside the shutter as a compact control.
- [ ] Tap AI Snapshot and confirm consent / success / failed / unavailable mock paths still work.
- [ ] Confirm Live Guidance appears as a compact pill and expands only when tapped.
- [ ] Confirm Mock / Local guidance modes still work.
- [ ] Confirm local brightness / face framing / stability behavior remains normal.
- [ ] Confirm filter button appears in the lower-left of the viewfinder.
- [ ] Tap filter and confirm the 20-filter grouped picker works.
- [ ] Confirm Camera tab has no Photo Picker / Choose Photo CTA.
- [ ] Open Inspiration and import one photo.
- [ ] Confirm imported photo opens the selected-photo workflow.
- [ ] Confirm selected-photo Back to Camera / Clear still works.
- [ ] Run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no real network call, upload, Firestore write, Storage write, Cloud Functions call, Gemini/OpenAI call, StoreKit, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Physical iPhone testing remains needed for shutter hit testing, safe-area spacing, filter button position, and tab-bar hiding behavior.
- [ ] Top camera navigation menu is a scaffold while Camera hides the tab bar.
- [ ] Screen flash is UI-only scaffold; no real front-camera hardware flash sync is implemented.
- [ ] AI Snapshot remains mock-only; real cloud snapshot guidance is deferred to a later explicit Phase 16B / 17.

## Phase 16A

Check:

- [x] Camera capture mode uses a one-screen-first layout rather than an always-scrolling capture surface.
- [x] Selected-photo / imported-photo mode remains scrollable for filter preview, mock save, and mock AI content.
- [x] Live Guidance defaults to a compact expandable pill / short bar.
- [x] Live Guidance can expand to the existing short camera-style callout.
- [x] Mock / Local guidance modes remain available.
- [x] Guidance toggle remains available.
- [x] Phase 15B brightness guidance remains wired through the Local guidance provider.
- [x] Phase 15C face framing / headroom guidance remains wired through the Local guidance provider.
- [x] Phase 15D stability / priority / anti-flicker layer remains in the Local guidance path.
- [x] AI Snapshot defaults to a compact entry instead of a persistent long panel.
- [x] AI Snapshot opens a consent / result sheet only after explicit user tap.
- [x] AI Snapshot keeps mock-only success, failed, and unavailable states.
- [x] Camera controls no longer show a Photo Picker / Choose Photo entry.
- [x] Inspiration tab now provides the photo import entry.
- [x] Inspiration import opens the existing selected-photo flow with filters, mock save, mock AI, and local history.
- [x] Front-camera + flash has a local screen-flash scaffold.
- [x] Timer options now support Off, 3 seconds, 5 seconds, and 10 seconds.
- [x] Timer selection is visible on the camera control.
- [x] Filter picker remains available through the Camera filter entry and now opens as a sheet.
- [x] Preserved 20 filters / grouping.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Vision / face safety scan confirmed no new Vision request type, face recognition, identity inference, or sensitive inference behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm the Camera capture screen can reach preview, lens selector, filter entry, guidance entry, AI Snapshot entry, timer, flash, flip, and shutter without routine vertical scrolling on a normal iPhone viewport.
- [ ] Confirm selected-photo / imported-photo mode still scrolls normally and keeps fixed Back to Camera / Clear visible.
- [ ] Confirm Live Guidance appears as a compact pill by default.
- [ ] Tap Live Guidance and confirm the short callout expands / collapses.
- [ ] Toggle Mock / Local guidance and confirm both modes still work.
- [ ] Confirm local brightness / face framing hints still appear when available.
- [ ] Tap AI Snapshot and confirm consent appears in the sheet.
- [ ] Run mock AI Snapshot success, failure, and unavailable paths.
- [ ] Confirm Camera no longer has a Photo Picker / Choose Photo entry.
- [ ] Open Inspiration and import one photo.
- [ ] Confirm imported photo opens the existing selected-photo flow.
- [ ] Apply filters to the imported photo.
- [ ] Run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Switch to front-camera mock, enable flash, and capture to verify the screen-flash scaffold.
- [ ] Open Timer and select Off, 3s, 5s, and 10s.
- [ ] Confirm timer countdown integrates with capture.
- [ ] Confirm 20 filters / grouping still work.
- [ ] Open History and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no real network call, upload, Firestore write, Storage write, Cloud Functions call, Gemini/OpenAI call, StoreKit, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Physical iPhone testing remains needed for one-screen layout, timer ergonomics, and screen-flash timing.
- [ ] Screen flash is UI-only scaffold; no real front-camera hardware flash sync is implemented.
- [ ] AI Snapshot remains mock-only; real cloud snapshot guidance is deferred to a later explicit Phase 16B / 17.
- [ ] The mock lens selector still does not switch real iPhone lenses.

## Phase 16

Check:

- [x] Added a compact AI snapshot / AI Quick Advice entry to the Camera capture surface.
- [x] Required explicit user tap before showing the Phase 16 consent panel.
- [x] Required explicit user action in the consent panel before mock analysis starts.
- [x] Added consent copy explaining that a future real cloud version would send one snapshot to an AI service.
- [x] Added consent copy explaining Phase 16 is mock-only and uploads nothing.
- [x] Added consent copy explaining there is no background upload and no continuous video stream.
- [x] Added consent copy explaining no photo or request payload is saved.
- [x] Added consent copy explaining no provider API key is stored in the iOS app.
- [x] Added `CloudSnapshotGuidanceService` as a service protocol boundary.
- [x] Added `MockCloudSnapshotGuidanceService` with mock success, failure, and unavailable outcomes.
- [x] Added `CloudSnapshotGuidanceState` for idle, consent, preparing, analyzing, result, failed, and unavailable states.
- [x] Kept the Phase 16 request model derived-only and memory-only.
- [x] Did not add raw image, base64, pixel buffer, sample buffer, selected photo, or serialized request payload to the Phase 16 request model.
- [x] Kept mock cloud response short and camera-like.
- [x] Preserved Mock guidance mode.
- [x] Preserved Local guidance mode.
- [x] Preserved Phase 15B brightness guidance.
- [x] Preserved Phase 15C face framing / headroom guidance.
- [x] Preserved Phase 15D stability / priority behavior.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Final forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Final Vision scan still found Vision only in the existing local face analyzer file.
- [x] Final network / upload behavior scan found no Phase 16 real network, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- [x] Final secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Final forbidden behavior scan found only existing placeholder docs/strings and existing local/mock scaffolds, not Phase 16 real service behavior.
- [x] Final frame / photo persistence scan found no Phase 16 raw frame/photo/request payload storage, upload, stream, persistence, or logging behavior.
- [x] Final face safety scan found no face recognition, identity inference, sensitive inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [ ] Launch the app.
- [ ] Confirm Camera is still the primary screen.
- [ ] Confirm Mock / Local guidance mode can be switched.
- [ ] Confirm Local guidance and stability still work.
- [ ] Tap AI Quick Advice / AI 構圖建議.
- [ ] Confirm consent / privacy copy appears before mock analysis.
- [ ] Confirm mock analysis starts only after the explicit run action.
- [ ] Confirm mock result shows short suggestions, not a chat UI.
- [ ] Confirm mock failure state is visible and recoverable.
- [ ] Confirm mock unavailable state is visible and recoverable.
- [ ] Confirm no real network request, upload, API key, Firebase config, or backend behavior exists.
- [ ] Confirm guidance overlay remains below the viewfinder and does not block the main preview.
- [ ] Confirm Dazz-like camera layout remains normal.
- [ ] Confirm mock lens selector remains normal.
- [ ] Confirm flash / timer / flip / capture remain normal.
- [ ] Confirm Photo Picker import remains normal.
- [ ] Confirm selected-photo Back to Camera / Clear remains normal.
- [ ] Confirm 20 filters / grouping remain normal.
- [ ] Confirm mock save, mock AI, and local history remain normal.
- [ ] Confirm Inspiration, History, and Settings remain normal.
- [ ] Confirm English / Traditional Chinese localization shows no raw keys.
- [ ] Confirm no raw frames, selected photos, request payloads, or face data are stored, uploaded, streamed, persisted, or logged.
- [ ] Confirm no face recognition, identity inference, sensitive inference, Gemini Live, cloud AI, voice, ASR, Parakeet, Firebase Storage / Firestore / Cloud Functions, StoreKit, persistence, export, or save-to-Photos behavior was added.

Known TODOs:

- [ ] Real cloud AI guidance remains deferred to a later explicit Phase 16B / 17.
- [ ] Future real cloud integration requires backend proxy / server-issued credential design, privacy review, pricing/rate-limit review, quota strategy, cancellation behavior, and App Store review.
- [ ] Phase 16 does not capture, serialize, upload, persist, or analyze a real snapshot.

## Phase 15D

Check:

- [x] Added a memory-only Local guidance stability controller.
- [x] Added priority ordering for existing Local guidance suggestions.
- [x] High-priority hints cover too dark, too bright, face too close, and face too far.
- [x] Medium-priority hints cover low headroom and subject off-center.
- [x] Low-priority hints cover warm filter, portrait-ready, balanced lighting, and fallback suggestions.
- [x] Added repeat cooldown to reduce short-interval duplicate suggestions.
- [x] Added confirmation count before replacing the current stable suggestion.
- [x] Added short hold behavior when signals disappear briefly.
- [x] Limited Local guidance to at most two visible suggestions.
- [x] Limited Mock guidance display to at most two visible suggestions.
- [x] Preserved Mock guidance mode.
- [x] Preserved Local guidance mode.
- [x] Preserved Phase 15 sample/fallback local suggestions.
- [x] Preserved Phase 15B brightness guidance.
- [x] Preserved Phase 15C face framing / headroom guidance.
- [x] Did not modify `CameraCaptureService` frame sampling frequency.
- [x] Did not add a new frame analysis type.
- [x] Did not add a new Vision request type.
- [x] Did not modify `LiveGuidanceFaceAnalyzer`.
- [x] Did not store raw frames.
- [x] Did not store face rectangle history.
- [x] Did not log raw frames, base64, pixel buffers, sample buffers, or face rectangles.
- [x] Did not store, upload, stream, or persist raw frames or face data.
- [x] Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Confirmed no new user-facing localization keys were required.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import / request scan found `import Vision` and `VNDetectFaceRectanglesRequest` only in the existing `LiveGuidanceFaceAnalyzer.swift`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no new raw-frame storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Face safety scan found no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [ ] Launch the app.
- [ ] Confirm Camera is still the primary screen.
- [ ] Confirm Mock / Local guidance mode can be switched.
- [ ] Confirm Mock guidance mode still works and shows at most two suggestions.
- [ ] Confirm Local guidance mode still works.
- [ ] Confirm Phase 15B brightness guidance still works.
- [ ] Confirm Phase 15C face framing / headroom guidance still works.
- [ ] Move camera between dark and bright areas and confirm suggestions do not flicker aggressively.
- [ ] On a physical iPhone, move a face off-center, close, and far if available.
- [ ] Confirm suggestion changes feel stable and not too frequent.
- [ ] Confirm repeated suggestions are reduced.
- [ ] Confirm only one or two suggestions are shown.
- [ ] Confirm preview and capture remain responsive.
- [ ] Confirm guidance overlay stays below the viewfinder and does not block the main preview.
- [ ] Confirm Dazz-like camera layout remains normal.
- [ ] Confirm mock lens selector remains normal.
- [ ] Confirm flash / timer / flip / capture remain normal.
- [ ] Confirm Photo Picker import remains normal.
- [ ] Confirm selected-photo Back to Camera / Clear remains normal.
- [ ] Confirm 20 filters / grouping remain normal.
- [ ] Confirm mock save, mock AI, and local history remain normal.
- [ ] Confirm Inspiration, History, and Settings remain normal.
- [ ] Confirm English / Traditional Chinese localization shows no raw keys.
- [ ] Confirm no raw frames or face rectangles are stored, uploaded, streamed, persisted, or logged.
- [ ] Confirm no face recognition, identity inference, sensitive inference, or face rectangle history behavior was added.
- [ ] Confirm no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [ ] Confirm no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [ ] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required to tune stability constants with real motion and lighting.
- [ ] Repeat cooldown, confirmation count, and hold duration may need future product tuning.
- [ ] Phase 16 remains blocked until Phase 15D is reviewed, committed, pushed, and read-only confirmed.

## Phase 15C

Check:

- [x] Added local Apple Vision face rectangle prototype.
- [x] Kept `import Vision` limited to the local face analyzer file.
- [x] Used Vision only for local face rectangle / bounding box detection.
- [x] Added derived local face framing signals for subject off-center, low headroom, face too close, face too far, and portrait framing ready.
- [x] Preserved Phase 15B brightness guidance for too dark, too bright, and balanced lighting.
- [x] Preserved Mock guidance mode.
- [x] Preserved Phase 15 sample/fallback local suggestions.
- [x] Kept frame analysis low-frequency through the existing Phase 15B path.
- [x] Kept analysis on the background frame signal queue with UI updates returning to the main thread.
- [x] Did not store face rectangles or face history.
- [x] Did not log raw frames, base64, pixel buffers, sample buffers, or face rectangles.
- [x] Did not store, upload, stream, or persist raw frames.
- [x] Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Added English and Traditional Chinese localization for the stable portrait framing hint.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found `import Vision` only in `LiveGuidanceFaceAnalyzer.swift`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no raw-frame storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Face safety scan found no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed Mock / Local guidance mode can be switched.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode still works.
- [x] User confirmed Phase 15B brightness guidance still works.
- [x] User confirmed Apple Vision face rectangle / bounding box detection is only used for local face framing / headroom guidance.
- [x] User confirmed face framing hints can show short composition suggestions.
- [x] User confirmed hints do not flicker aggressively.
- [x] User confirmed preview and capture remain responsive, with no obvious lag.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed flash / timer / flip / capture remain normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames or face rectangles are stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive inference was added.
- [x] User confirmed no face rectangle history is stored or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required for Vision face rectangle behavior and preview-lag validation.
- [ ] Face framing thresholds may need tuning after real portrait testing.
- [ ] Phase 16 remains blocked until Phase 15C is reviewed, committed, pushed, and read-only confirmed.

## Phase 15B

Check:

- [x] Added first local real frame signal prototype for brightness only.
- [x] Frame signal analysis is enabled only while Local guidance is active in the camera preview.
- [x] Local frame sampling is throttled to roughly 1-2 samples per second.
- [x] Brightness analysis runs on a background queue.
- [x] UI guidance updates return to the main thread.
- [x] User confirmed Local guidance mode can show brightness / fallback suggestions in Xcode / Simulator.
- [x] User confirmed Simulator / camera-unavailable path falls back safely and does not crash.
- [x] Mock guidance mode still works at source level.
- [x] Phase 15 sample/fallback local suggestions still work when no frame signal is available at source level.
- [x] No Vision import was added.
- [x] No face rectangle / headroom analysis was added in this phase.
- [x] No raw frames, base64, pixel buffers, or sample buffers are logged.
- [x] No raw frames are stored, uploaded, streamed, or persisted.
- [x] Camera remains the first selected tab at source level.
- [x] Dazz-like compact viewport remains normal at source level.
- [x] Mock lens selector remains normal at source level.
- [x] selected-photo Back to Camera / Clear remains normal at source level.
- [x] Photo Picker remains normal at source level.
- [x] 20 filters and filter grouping remain normal at source level.
- [x] mock save, mock AI, local session history, Inspiration, History, and Settings remain normal at source level.
- [x] English and Traditional Chinese localization has Phase 15B keys.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found no `import Vision`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found only immediate in-memory brightness analysis references to sample / pixel buffers, with no storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed Mock / Local guidance mode can be switched.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode can show brightness / fallback suggestions.
- [x] User confirmed Simulator / camera-unavailable fallback does not crash.
- [x] User confirmed camera preview / capture has no obvious lag.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed flash / timer / flip / capture remain normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames are stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required for real brightness behavior and preview-lag validation.
- [ ] Face rectangle / headroom / Vision analysis remains deferred.
- [ ] Brightness thresholds may need tuning after real-device testing.
- [ ] Phase 16 remains blocked until Phase 15B is reviewed, committed, pushed, and read-only confirmed.

## Phase 15

Check:

- [x] Added switchable Mock / Local live guidance modes.
- [x] Preserved the Phase 14 mock guidance provider.
- [x] Added local rule-based provider architecture.
- [x] Added local guidance sample/fallback signal model.
- [x] Added suggestion composer for local rule-based guidance.
- [x] Added local suggestions for too dark, too bright, subject centering, headroom, face too close, face too far, warm filter, and local signal unavailable fallback.
- [x] Kept Simulator behavior safe by using sample/fallback signals instead of live camera frame sampling.
- [x] Did not import Vision for this first local prototype.
- [x] Did not add AVFoundation video frame sampling.
- [x] Did not store, upload, stream, persist, or log raw frames.
- [x] Preserved Camera as the first selected tab.
- [x] Preserved Dazz-like compact viewport.
- [x] Preserved mock lens selector.
- [x] Preserved selected-photo Back to Camera / Clear.
- [x] Preserved Photo Picker.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found no `import Vision`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no raw-frame storage, upload, stream, base64, pixel-buffer logging, or network behavior in Camera feature files.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed the Mock / Local guidance mode chip is usable.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode shows sample / fallback local suggestions.
- [x] User confirmed Local mode does not analyze real frames.
- [x] User confirmed no Vision import was added.
- [x] User confirmed no AVFoundation video frame sampling was added.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames are read, stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Phase 15 local provider uses sample/fallback signals only; it does not analyze real frames yet.
- [ ] A future explicit phase may add throttled Apple Vision / AVFoundation frame sampling.
- [ ] Physical iPhone testing remains needed before any true live-frame analyzer ships.

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
