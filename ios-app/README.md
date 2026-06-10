# iOS App

This folder contains the Swift + SwiftUI iOS app scaffold.

Planned stack:

- Swift
- SwiftUI
- AVFoundation
- PhotosPicker / PHPicker
- Core Image
- Vision
- Firebase Apple SDK
- StoreKit 2

## Phase 01 Scaffold

Phase 01 adds a dependency-free SwiftUI source scaffold under:

```text
ios-app/AIPhotoApp/
```

Current Phase 01 files include:

- `AIPhotoApp.swift`
- `App/AppRootView.swift`
- `App/MainTabShellView.swift`
- `DesignSystem/Tokens/`
- `DesignSystem/Components/`
- `Features/Home/HomeView.swift`
- `Features/History/HistoryView.swift`
- `Features/Settings/SettingsView.swift`
- `Models/`
- `Resources/Localization/en.lproj/Localizable.strings`
- `Resources/Localization/zh-Hant.lproj/Localizable.strings`

The Phase 01 scaffold started as UI-only:

- Auth is not implemented.
- Camera is implemented later as a local-only Phase 03 scaffold.
- Firebase upload is not implemented.
- AI is not implemented.
- StoreKit is not implemented.

## Xcode Notes

There is a checked-in `.xcodeproj` at:

```text
ios-app/AIPhotoApp.xcodeproj
```

Phase 01.5 documents the manual Xcode setup path in `ios-app/XCODE_SETUP.md`. The Phase 01/02 Mac/Xcode build succeeded on 2026-06-09, and the Phase 03 command-line Xcode simulator build also succeeded.

Suggested target settings:

- Platform: iOS
- UI framework: SwiftUI
- Minimum iOS version: iOS 17 or later
- Localization: English and Traditional Chinese

Do not add real `GoogleService-Info.plist` to git.

The real Firebase, AI, and StoreKit integrations should be added only in their later phases.

## Phase 12A Filter Planning

Phase 12A adds filter research and schema planning documents only. It does not change iOS app source code.

New planning docs:

- `../docs/filter-research-popular-film-looks.md`
- `../docs/filter-preset-schema.md`
- `../docs/filter-roadmap.md`
- `../docs/prompts/phase-12-filter-preset-schema-and-batch1.md`

Planned Phase 12B scope is limited to a data-driven local filter catalog and the first 6 hero filters:

- Soft Warm 400
- Summer Gold 200
- Street Chrome
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation

Phase 12B should preserve or map the existing four filters: Original, Classic Film, Warm Vintage, and Faded Chrome.

Do not add real Firebase, real AI, Cloud Functions calls, StoreKit, premium gating, persistence, export, secrets, or third-party SDKs as part of Phase 12A or the planned Phase 12B filter catalog work.

## Phase 12B Filter Batch 1

Phase 12B extends the existing local Core Image filter scaffold without changing backend code or adding new services.

Current local catalog order:

- Original
- Soft Warm 400
- Summer Gold 200
- Street Chrome
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation
- Classic Film
- Warm Vintage
- Faded Chrome

The first 6 hero filters are Core Image approximations:

- Soft Warm 400: warm color negative feel, soft contrast, lifted shadows.
- Summer Gold 200: bright golden daylight warmth.
- Street Chrome: stronger contrast, cooler shadows, sharper urban color.
- Soft Sun Portrait: gentle portrait tone with protected highlights.
- Cinema Flat: muted editorial color with controlled highlights.
- Silver Gradation: smooth black and white tone.

Existing presets are preserved:

- Original remains unfiltered.
- Classic Film remains a legacy starter filter.
- Warm Vintage remains a legacy starter filter.
- Faded Chrome remains a legacy starter filter.

Phase 12B does not add LUT assets, grain overlays, light leaks, expanded 20-filter implementation, premium gating, StoreKit, AI custom filters, real AI, real Firebase, persistence, export, save-to-Photos, secrets, dependencies, third-party SDKs, or backend changes.

## Phase 13 Expanded Filter Library

Phase 13 expands the local Core Image filter catalog to 20 research presets and updates the picker to use grouped filter chips plus a preset grid.

Research presets:

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

Original remains the no-filter option and is not counted as one of the 20 research presets. Classic Film, Warm Vintage, and Faded Chrome remain available as legacy starter filters.

Filter groups:

- Featured
- Portrait
- Daily
- Street
- Cinema
- Black & White
- Night
- Camera Looks
- Starter

Phase 13 filters are MVP approximations using the existing local Core Image pipeline. The implementation does not add LUT assets, true grain overlays, light leaks, dust, frames, Metal shaders, AI custom filters, real AI, real Firebase, StoreKit, premium gating, persistence, export, save-to-Photos, secrets, dependencies, third-party SDKs, or backend changes.

## Phase 14 Live Guidance Mock UX

Phase 14 adds a small local/mock live guidance layer to the Camera screen.

Current implementation notes:

- `LiveGuidanceMockState` models off, idle, scanning, suggestion available, and paused states.
- `MockLiveGuidanceProvider` returns local static suggestions only.
- `LiveGuidanceToggleView` provides the camera status-bar toggle.
- `LiveGuidanceOverlayView` renders a compact control-area guidance strip.
- The overlay is positioned below the framed viewport and above the shutter controls.
- The state and suggestions are in memory only.

Phase 14 intentionally does not read camera frames, analyze video, upload frames, persist guidance, import Vision, call Gemini / OpenAI / Cloud Functions, connect Firebase, add StoreKit, add voice input, add ASR, add Parakeet, export, save to Photos, change backend code, or add secrets.

## Phase 14B Camera Frame / Inspiration Refinement

Phase 14B keeps Phase 14 local/mock-only and refines the camera and Inspiration surfaces.

Current implementation notes:

- `LensOption` defines local/mock 24mm, 35mm, and 77mm lens labels.
- `CameraLensSelectorView` shows selectable camera-like focal length chips.
- `CameraViewModel` stores the selected mock lens option in memory only.
- `CameraView` now uses a more compact dark camera shell, a framed 4:5-style viewport, a visible focal label, and lower camera controls.
- The guidance overlay has moved out of the main viewfinder and sits above the shutter area.
- `HomeView` is now positioned as the Inspiration tab and no longer presents an Open Camera primary CTA.
- `MainTabShellView` keeps Camera as the first tab and updates the former Guide tab icon to match Inspiration.

Phase 14B does not add real multi-lens hardware switching, Vision, frame analysis, frame upload, Gemini Live, voice / ASR, real Firebase, StoreKit, persistence, export, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 14C Selected Photo Back / Clear

Phase 14C adds fixed selected-photo controls so users do not need to scroll to the bottom of the imported-photo flow.

Current implementation notes:

- `CameraView` shows a compact Back to Camera / Clear action bar whenever `selectedPhoto` exists.
- `CameraViewModel.clearSelectedPhoto()` clears the selected image, picker item, render preview, filter error, and mock save state while preserving the selected filter preset.
- The lower selected-photo fallback action also returns to Camera.

Phase 14C does not change filters, mock save, mock AI, local history, live guidance, lens selector, persistence, export, backend code, secrets, or real service integrations.

## Phase 15 Local Live Guidance Prototype

Phase 15 adds a local rule-based guidance provider architecture while keeping the app local/mock-safe.

Current implementation notes:

- `LiveGuidanceMode` switches between Mock and Local guidance modes.
- `LiveGuidanceModeSelectorView` adds a compact camera status-bar mode control.
- `MockLiveGuidanceProvider` remains available.
- `LocalRuleBasedGuidanceProvider` uses local rule-based sample/fallback signals only.
- `LiveGuidanceSignal` models local guidance signals such as too dark, too bright, framing, headroom, face distance, warm filter, and signal unavailable.
- `LiveGuidanceFrameAnalyzer` currently returns safe sample/fallback signals instead of sampling live video frames.
- `LiveGuidanceSuggestionComposer` maps local signals into short localized suggestions.
- `CameraViewModel` switches between mock and local providers in memory only.

Phase 15 intentionally does not import Vision yet, does not add AVFoundation video frame sampling, and does not store, upload, stream, persist, or log raw frames. It also does not add Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15B Local Frame Signal Prototype

Phase 15B adds the first real local frame signal path while keeping guidance local/mock-safe and brightness-only.

Current implementation notes:

- `CameraCaptureService` configures an optional throttled `AVCaptureVideoDataOutput` alongside the existing photo output.
- Frame signal analysis is gated so it runs only while Local guidance is active in the camera preview.
- `FrameSignalDelegate` samples at low frequency and passes only derived `LiveGuidanceSignal` values back to the main actor.
- `LiveGuidanceBrightnessAnalyzer` reads the luma plane in memory and emits too dark, too bright, or balanced-light signals.
- `CameraViewModel` stores the latest derived local frame signals and uses them only for Local guidance mode.
- `LocalRuleBasedGuidanceProvider` prefers real frame-derived signals when available and keeps the Phase 15 sample/fallback path when unavailable.

Phase 15B intentionally does not import Vision, does not add face rectangle / headroom analysis, does not log raw frame / base64 / pixel buffer / sample buffer data, does not upload / stream / persist frames, and does not add Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15C Local Face Framing Vision Prototype

Phase 15C adds a conservative local Vision face rectangle prototype while preserving Phase 15B brightness guidance.

Current implementation notes:

- `LiveGuidanceFaceAnalyzer` is the only local file that imports Vision.
- Vision is used only through `VNDetectFaceRectanglesRequest`.
- Face bounding boxes are converted immediately into derived `LiveGuidanceSignal` values.
- Derived signals cover off-center subject, low headroom, face too close, face too far, and portrait framing ready.
- `CameraCaptureService` keeps the same low-frequency frame signal delegate and merges face-derived signals with brightness-derived signals.
- No raw frames, pixel buffers, sample buffers, face rectangles, or face history are persisted or logged.

Phase 15C intentionally does not do face recognition, identity inference, age / gender / emotion / beauty / attractiveness / health / sensitive inference, raw frame upload / stream / persistence / logging, Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15D Guidance Stability and Priority

Phase 15D adds a small memory-only stability controller for Local guidance suggestions.

Implementation notes:

- `LiveGuidanceStabilityController` ranks already-derived suggestions by priority.
- The controller limits Local guidance to at most two visible suggestions.
- Repeat cooldown, confirmation count, and short hold duration reduce flicker from changing frame signals.
- `LiveGuidanceSignal` now carries a stable priority / sort order for derived local signals.
- `LiveGuidanceSuggestionComposer` ranks local signals before composing suggestions.
- Mock guidance mode remains available.
- Phase 15B brightness guidance and Phase 15C face framing / headroom guidance remain available.

Phase 15D does not change frame sampling frequency, add new Vision request types, add new frame analysis types, store raw frames, store face rectangle history, add persistence, connect cloud AI/Firebase/StoreKit, modify backend code, or add third-party SDKs.

## Phase 01.5 Xcode Setup

Phase 01.5 did not generate a `.xcodeproj` from this Windows environment because it could not be reliably verified in Xcode.

Use `ios-app/XCODE_SETUP.md` on macOS to:

- create the real iOS SwiftUI Xcode project
- place the project at `ios-app/AIPhotoApp.xcodeproj`
- add the existing `ios-app/AIPhotoApp/` Swift files to the app target
- add the English and Traditional Chinese localization files to the target resources
- verify `AppRootView` / `MainTabShellView` previews and simulator rendering

Do not start Phase 02 Auth work until the Xcode setup path has been completed or explicitly accepted as a documentation-only fallback.

## Phase 02 Auth Scaffold

Phase 02 adds dependency-free Auth UI and service scaffolding under:

```text
ios-app/AIPhotoApp/Features/Auth/
ios-app/AIPhotoApp/Services/Auth/
```

Current Phase 02 Auth files include:

- `AuthView.swift`
- `EmailAuthForm.swift`
- `GoogleSignInButtonRow.swift`
- `AppleSignInButtonRow.swift`
- `AuthViewModel.swift`
- `AuthMode.swift`
- `AuthService.swift`
- `MockAuthService.swift`
- `FirebaseAuthService.swift`
- `AuthSetupTODO.md`

The current Auth scaffold is intentionally local/mock only:

- Email/password validation is simulated by `MockAuthService`.
- Google login is a UI row plus mock provider state.
- Sign in with Apple is a UI row plus mock provider state.
- Guest try mode is local-only.
- Settings includes mock sign-out and account deletion placeholders.
- `FirebaseAuthService` is a non-operational placeholder with TODOs.

The Xcode project now exists and Phase 01/02 build verification has passed. Firebase Auth, Google Sign-In, and Sign in with Apple remain mock/placeholders until real provider setup is explicitly requested.

Do not add real `GoogleService-Info.plist`, Firebase keys, Google keys, Apple credentials, API keys, `.env`, or production plist files to git. Complete `ios-app/AIPhotoApp/Services/Auth/AuthSetupTODO.md` and `ios-app/XCODE_SETUP.md` on macOS before wiring real providers.

## Phase 03 Camera + Photo Picker Scaffold

Phase 03 adds a local-only Camera + Photo Picker scaffold under:

```text
ios-app/AIPhotoApp/Features/Camera/
```

Current Phase 03 Camera files include:

- `CameraView.swift`
- `CameraViewModel.swift`
- `CameraPermissionState.swift`
- `CameraCaptureService.swift`
- `CameraPreviewView.swift`
- `PhotoPickerView.swift`
- `SelectedPhotoPreview.swift`
- `CapturedPhoto.swift`

The current Camera scaffold is intentionally local-only:

- AVFoundation is used for camera permission, preview, and single-photo capture scaffolding.
- PhotosPicker is used for one-image library import.
- Captured or imported images are kept in memory only.
- Home can open the Camera scaffold.
- Camera and photo-library usage description placeholders are set in the Xcode project.
- Command-line Xcode simulator build succeeded.

This phase does not add filters, Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions AI proxy, StoreKit, quota enforcement, history persistence, secrets, credentials, API keys, or `GoogleService-Info.plist`.

## Phase 04 Local Filter Presets

Phase 04 adds a local-only Core Image filter scaffold under:

```text
ios-app/AIPhotoApp/Features/Filters/
```

Current Phase 04 Filter files include:

- `FilterPreset.swift`
- `FilterPresetCatalog.swift`
- `FilterPipeline.swift`
- `FilterPreviewView.swift`
- `FilterPresetSelectorView.swift`
- `FilteredPhotoPreview.swift`

The current Filter scaffold is intentionally local-only:

- Core Image renders basic retro previews on device.
- Presets are data-driven in `FilterPresetCatalog`.
- Available presets include Original, Classic Film, Warm Vintage, and Faded Chrome.
- Captured or imported images remain in memory only.
- Filtered previews remain in memory only.
- The Continue placeholder remains disabled and does not start upload, AI, StoreKit, quota, export, or history behavior.

This phase does not add Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions, StoreKit, subscription/paywall logic, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, paid presets, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist`.

## Phase 05 Firebase Storage / Firestore Save Scaffold

Phase 05 adds a mock-only save scaffold under:

```text
ios-app/AIPhotoApp/Services/PhotoStorage/
```

Current Phase 05 storage files include:

- `SavedPhoto.swift`
- `PhotoSaveState.swift`
- `PhotoSaveService.swift`
- `MockPhotoSaveService.swift`
- `FirebasePhotoSaveService.swift`
- `PhotoStoragePath.swift`

The current save scaffold is intentionally mock-only:

- `PhotoSaveService` defines the save contract.
- `MockPhotoSaveService` returns local mock metadata for success and failure checks.
- `FirebasePhotoSaveService` is a placeholder/TODO and does not import Firebase.
- Storage paths are drafted as `users/{ownerId}/photos/{photoId}/preview.jpg` and `thumb.jpg`.
- Firestore document shape is drafted as `users/{ownerId}/photos/{photoId}` metadata.
- Save UI appears after the filtered preview.
- Mock save success / failure states are visible.
- History remains an honest placeholder and does not persist saved photos.

This phase does not add a real `GoogleService-Info.plist`, Firebase project ID, `.env`, `.firebaserc`, API keys, private keys, OAuth secrets, Apple credentials, production Firebase upload, production Firestore writes, Firebase imports, AI analysis, Cloud Functions, StoreKit, subscription/quota logic, history persistence, export/save to Photos, public sharing, account deletion backend, or Phase 06 work.

## Phase 06 AI Photo Advisor Backend / Service Scaffold

Phase 06 adds mock-only AI Photo Advisor service models under:

```text
ios-app/AIPhotoApp/Services/AIPhotoAdvisor/
```

Current Phase 06 AI files include:

- `PhotoAnalysisRequest.swift`
- `PhotoAnalysisResult.swift`
- `PhotoAnalysisStatus.swift`
- `PhotoAnalysisService.swift`
- `MockPhotoAnalysisService.swift`
- `CloudFunctionPhotoAnalysisService.swift`

The current AI scaffold is intentionally mock-only:

- `PhotoAnalysisService` defines the analysis contract.
- `MockPhotoAnalysisService` returns local mock success and failure results.
- `CloudFunctionPhotoAnalysisService` is a placeholder/TODO and does not import Firebase or FirebaseFunctions.
- Mock results include one short summary, up to three actionable suggestions, simple adjustment hints, `provider = mock`, and `isMock = true`.
- No complete AI result UI is added in Phase 06.

This phase does not add Gemini API keys, OpenAI API keys, Firebase project IDs, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private keys, OAuth secrets, Apple credentials, real Gemini calls, real OpenAI calls, deployed Cloud Functions, production Firebase, FirebaseFunctions imports in iOS, real provider SDK imports, uploads, Firestore writes, Storage writes, AI billing, quota, StoreKit, subscription/paywall logic, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work.

## Phase 07 AI Photo Advisor Result UI Scaffold

Phase 07 adds a mock-only AI advice UI under:

```text
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/
```

Current Phase 07 AI UI files include:

- `AIAnalysisView.swift`
- `AIAnalysisViewModel.swift`
- `AIAnalysisResultView.swift`
- `AIAnalysisSuggestionCard.swift`
- `AIAdjustmentHintCard.swift`

The current AI result UI scaffold is intentionally mock-only:

- The filtered photo preview now shows a mock AI advice panel after the mock save panel.
- `AIAnalysisViewModel` uses the Phase 06 `PhotoAnalysisService` protocol.
- `MockPhotoAnalysisService` is the default service for success and failure checks.
- Loading, success, failure, retry, and dismiss states are visible.
- Mock results display one short summary, up to three suggestions, adjustment hints, and composition / lighting notes.
- The UI clearly labels the advice as Phase 07 scaffold / mock output.
- Analysis state stays in memory for the current selected photo flow only.

This phase does not add Gemini API keys, OpenAI API keys, Firebase project IDs, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private keys, OAuth secrets, Apple credentials, real Gemini calls, real OpenAI calls, Cloud Functions calls or deploys, production Firebase, FirebaseFunctions imports in iOS, real provider SDK imports, uploads, Firestore writes, Storage writes, AI result persistence, history persistence, AI chat, image editing, realtime video AI, StoreKit, subscription/paywall logic, quota enforcement, npm dependencies, or Phase 08 work.

## Phase 08 Local Session History Scaffold

Phase 08 adds a local-only, memory-only session history scaffold under:

```text
ios-app/AIPhotoApp/Models/
ios-app/AIPhotoApp/Services/SessionHistory/
ios-app/AIPhotoApp/Features/History/
```

Current Phase 08 session history files include:

- `SessionHistoryItem.swift`
- `SessionHistoryStatus.swift`
- `SessionHistoryStore.swift`
- `MockSessionHistoryStore.swift`
- `HistoryView.swift`
- `HistoryItemCard.swift`
- `HistoryEmptyStateView.swift`

The current session history scaffold is intentionally local-only:

- `AppRootView` owns a mock session history store for the current app session.
- Camera / Filter / Mock Save / Mock AI result UI can update the shared in-memory store.
- History displays a local session empty state or scrollable local-only cards.
- Cards show local/mock labels, created time, source, filter preset, mock save status, and mock AI summary when available.
- Thumbnails are small in-memory UI images only.
- Clear local session history removes only the in-memory store contents.

This phase does not add Firebase Storage upload, Firestore writes, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI calls, Cloud Functions calls, StoreKit, subscription/paywall logic, quota enforcement, new SDKs, npm dependencies, secrets, credentials, Firebase project IDs, or `GoogleService-Info.plist`.

## Phase 09 MVP Polish / UX Hardening

Phase 09 polishes the existing mock MVP flow without adding new product capabilities.

The Phase 09 polish pass was manually verified by the user in Xcode / Simulator on 2026-06-09.

Current Phase 09 polish touches the main demo path:

- Home
- Camera / Photo Picker
- Filter presets
- Mock Save
- Mock AI Result
- Local Session History
- Settings

The current polish pass is intentionally small and reviewable:

- Home now presents the flow as a mock MVP demo instead of showing a quota badge that could imply active quota enforcement.
- Camera content uses a consistent scroll container so permission, selected-photo, filter, save, AI, and local-only notes remain reachable on small screens.
- Mock save failure is a visible text button rather than an icon-only control.
- Mock AI result action buttons are easier to tap.
- History clear action is clearer and visually destructive.
- History card filter labels use localized preset names instead of raw preset IDs.
- Settings copy more clearly states that backend, subscription, AI, quota, and deletion services are not connected.

This phase remains mock/local-only. It does not add Firebase Storage upload, Firestore writes, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI calls, Cloud Functions calls, StoreKit, subscription/paywall logic, quota enforcement, new SDKs, npm dependencies, secrets, credentials, Firebase project IDs, or `GoogleService-Info.plist`.

## Phase 10 MVP Demo QA / Release Readiness

Phase 10 adds documentation and QA readiness notes for the current local/mock MVP. It does not add product features or change Swift code.

New Phase 10 docs:

- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`

Use the demo script to walk through:

- Home
- Camera scaffold
- Photo Picker import
- Filter presets
- Mock save success / failure
- Mock AI advice
- Local session history
- Clear local session history
- Settings placeholders

The current iOS app remains local/mock-only and is not production-ready. It does not include real Firebase upload, Firestore writes, Storage writes, Cloud Functions calls, real Gemini/OpenAI calls, StoreKit, subscription/paywall logic, quota enforcement, persistence, export/save-to-Photos, secrets, credentials, Firebase project IDs, or `GoogleService-Info.plist`.

## Phase 11 Camera-First UX Redesign

Phase 11 makes the Camera screen the primary app surface while keeping the local/mock MVP behavior.

Current Phase 11 behavior:

- The main tab shell defaults to Camera.
- Home is kept as a secondary guide tab.
- History and Settings remain accessible.
- Camera can still be opened from the guide screen as a full-screen flow.
- The Camera tab does not show a Close button; the full-screen Camera flow still does.
- The camera viewfinder uses a larger 4:5 portrait frame to lean into the requested 5:4-style composition direction on an iOS portrait screen.
- A lower-right filter entry appears on the camera surface.
- The lower-right filter entry reveals the existing local preset selector.
- Selecting an existing preset before capture or import applies it to the next selected photo.
- Photo Picker remains available as the reliable Simulator fallback.
- Mock save, mock AI advice, and local session history remain connected.

This phase does not add expanded filter library work, live AI guidance, real Vision guidance, AI custom filters, AI image generation, real Firebase, Firebase imports, Gemini/OpenAI imports, Cloud Functions calls, StoreKit, persistence, export/save-to-Photos, secrets, credentials, Firebase project IDs, or `GoogleService-Info.plist`.

## Phase 11B Camera Entry Flow / Camera Shell Redesign

Phase 11B refines the Phase 11 camera-first work so the app no longer opens through a landing / browse screen or launch-time Auth screen.

Current Phase 11B behavior:

- `AppRootView` now enters `MainTabShellView` directly.
- Camera remains the default first tab.
- Basic Camera, filters, Photo Picker, mock save, mock AI, and local history are usable without login.
- Existing mock Auth is preserved as a Settings entry for future cloud features.
- Settings explains that login is not required for basic camera use.
- The capture screen now uses a darker camera shell rather than a white content-page feel.
- The viewfinder remains a large 4:5 portrait frame.
- The camera shell includes top status / selected preset copy.
- The bottom control row includes flash, timer, capture, camera flip, and photo import controls.
- Flash / timer / camera flip controls are UI-only mock toggles.
- The lower-right filter entry remains on the viewfinder and reveals the existing preset selector.
- Photo Picker remains the reliable Simulator fallback.

This phase does not add expanded filters, live AI guidance, AI custom filters, AI image generation, real Firebase, Cloud Functions, Gemini/OpenAI calls, StoreKit, persistence, export/save-to-Photos, backend code, third-party SDKs, secrets, or production config.

Known product gaps accepted for commit:

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should be more prominent and information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign if the current shell is not yet product-satisfying.
