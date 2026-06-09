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
