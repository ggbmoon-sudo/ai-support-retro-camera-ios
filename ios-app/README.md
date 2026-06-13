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

## Phase 17A Cloud AI Boundary

Phase 17A adds iOS Cloud AI boundary scaffolding only:

- `CloudAIService` protocol
- typed Cloud AI request / response models
- response validator
- mock Cloud AI service
- disabled remote service skeleton
- neutral consent view
- image compression / metadata stripping scaffold

The iOS app still defaults to mock/local Photo Advisor behavior. There is no provider SDK, provider API key, production remote Cloud AI call, real upload, storage write, export, or StoreKit integration in this phase.

## Phase 17B Debug-only Remote Wiring

Phase 17B lets DEBUG/internal builds test the local backend mock `/v1/ai/photo-advisor` endpoint from Photo Advisor:

- consent is required first
- the selected image is compressed / re-encoded as JPEG
- `RemoteCloudAIService` calls the local mock backend only in DEBUG mode
- the response is decoded and validated before being mapped into the existing Photo Advisor UI
- failures fall back to local/mock advice

Production/default behavior remains mock/local. Camera remains local-only. There is still no provider SDK, provider key, production cloud AI, storage upload, export, or StoreKit integration.

## Phase 17C-Prep Provider Readiness

Phase 17C-Prep keeps iOS production/default behavior mock/local while hardening the backend contract it may call in DEBUG mode:

- backend provider boundary is mock / disabled only
- request and response schemas are stricter
- filter IDs are whitelisted against the app catalog
- unsafe backend output maps to safe fallback
- rate-limit, quota, timeout, and no-payload logging placeholders exist

The iOS app does not add a real provider SDK, provider key, production remote Cloud AI, storage upload, export, StoreKit integration, or Camera cloud AI entry.

## Phase 17C Gemini Photo Advisor Internal Beta

Phase 17C-R1 keeps the iOS app provider-key-free and production/default mock/local while allowing the existing DEBUG-only remote chain to test a backend Photo Advisor internal beta through the QweAPI OpenAI-compatible gateway:

- iOS sends only the DEBUG internal header to the local backend test path
- consent copy is neutral and states neither original nor compressed image is stored
- the selected image is still compressed / metadata-stripped before the remote request
- QweAPI base URL, QweAPI API key, and provider calls stay server-side
- Camera remains local-only

There is still no Gemini / OpenAI SDK import in iOS, no provider key in iOS, no direct QweAPI call in iOS, no production cloud AI rollout, no Camera cloud AI entry, no storage upload, no export, and no StoreKit integration.

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

## Phase 16 Cloud Snapshot AI Guidance Prototype

Phase 16 adds a mock-only app-side boundary for future cloud snapshot guidance.

Implementation notes:

- `CloudSnapshotGuidanceRequest`, `CloudSnapshotGuidanceResponse`, and related models describe derived context and short mock results only.
- `CloudSnapshotGuidanceState` models idle, consent, preparing, analyzing, result, failed, and unavailable states in memory.
- `CloudSnapshotGuidanceService` defines the app-side service protocol.
- `MockCloudSnapshotGuidanceService` returns mock success, failure, and unavailable outcomes with a local delay only.
- `CloudSnapshotGuidanceConsentView` presents privacy copy before any mock analysis starts.
- `CloudSnapshotGuidanceResultView` keeps the result short and camera-like, not chat-style.
- `CameraViewModel` owns the Phase 16 state and does not serialize, persist, upload, or log image/request data.
- `CameraView` shows a compact AI Quick Advice entry near the existing camera guidance controls.
- Local guidance remains the default live guidance layer and is not replaced by the optional mock cloud snapshot flow.

Phase 16 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, raw frame/photo/request payload persistence, face recognition, identity inference, or sensitive attribute inference.

## Phase 16E Static Pose Overlay MVP

Phase 16E adds a non-AI static Pose Overlay MVP to the fullscreen Camera capture surface.

Implementation notes:

- `Features/Camera/PoseGuides/` contains the pose guide model, catalog, session-only overlay state, Pose button, quick picker, and SwiftUI overlay renderer.
- `PoseGuideCatalog` defines 8 static built-in pose guides.
- The MVP uses original SwiftUI `Canvas` placeholder line art instead of downloaded or copied assets.
- `assetName` remains on `PoseGuide` so future original PDF vector assets can replace placeholder line art.
- `CameraView` adds a compact Pose button to the lower-left viewfinder tool area so it avoids the Dynamic Island / status area.
- Pose picker joins the existing single active Camera callout path with guidance, AI Snapshot, filter, and lens controls.
- `PoseOverlayView` is placed above the camera preview and below interactive camera controls.
- The overlay is decorative and passive with `.allowsHitTesting(false)` and `.accessibilityHidden(true)`.
- The overlay also renders over the Simulator / camera-unavailable fallback canvas for demo and test visibility.
- Overlay state is memory-only and resets with the current app/session state.

Phase 16E does not add AI pose suggestion, Apple Vision body pose detection, pose matching, pose score, face recognition, identity / gender / age / emotion inference, body / appearance scoring, camera frame upload, URLSession/URLRequest, WebSocket, Firebase/Gemini/OpenAI/StoreKit imports, backend changes, persistence, export/save-to-Photos, secrets, production config, or third-party assets.

Phase 16E was manually accepted in Xcode / Simulator on 2026-06-11. Current in-code pose outlines are placeholder artwork and should be replaced by proper original PDF/vector pose assets in a later dedicated polish phase.

## Phase 16G AI Filter Generator Mock in Inspiration

Phase 16G adds an F1 mock-only Filter Lab flow to the Inspiration tab.

User Xcode / Simulator verification was temporarily accepted on 2026-06-11.

Implementation notes:

- `Features/Inspiration/FilterLab/` contains the structured mock recipe model, parameter set, mock service, validator / clamp helper, view model, reference picker, generated result card, before / after preview, and local preview renderer.
- `HomeView` adds a visible Filter Lab / Generate My Filter entry while preserving the existing Inspiration import-photo flow.
- PhotosPicker selects a single reference image for in-memory mock preview only.
- A sample fallback keeps the flow testable when Simulator photo picking is inconvenient.
- Mock generated filters are session-only and are not added to the permanent filter catalog.
- The intensity slider affects only the current Filter Lab preview.

Phase 16G does not add real AI, backend code, CloudAIService, URLSession/URLRequest, WebSocket, image upload, Firebase/Gemini/OpenAI/StoreKit imports, API keys, Firebase config, persistence, UserDefaults, Core Data, SwiftData, export/save-to-Photos, LUT generation, local heuristic real analysis, public sharing, premium credits, or provider integration.

Known TODOs: Filter Generator remains mock-only, recipe visuals and mapping may need tuning, local heuristic extraction is future work, real backend AI is blocked until Cloud AI boundary work, LUT generation is not implemented, and custom filter persistence is not implemented.

## Phase 16I Mock Post-capture AI Advisor

Phase 16I, Phase 16I-R1, and Phase 16I-R2 were manually accepted by the user in Xcode / Simulator on 2026-06-11.

The accepted iOS scope is mock-only: selected / imported photo result screens use a floating AI advice / filter tray, filter selection applies existing local filters and auto-dismisses the grid, duplicate inline AI / filter / mock save sections are reduced, Inspiration Back to Camera switches to the outer Camera tab, Clear returns to Inspiration, and Filter Lab previews are hardened for varied reference image ratios.

This phase does not add real AI, backend calls, URLSession/URLRequest, upload, persistence, StoreKit, cloud save, real local download, export, save-to-Photos, photo scoring, beauty / attractiveness scoring, or provider SDKs. Future real cloud advisor work requires a backend boundary; cloud save / paid-user cloud save / free local lossless download require a dedicated future entitlement / export phase.

## Phase 16K-L Local Heuristic Advisor + Selected Photo UX Polish

Phase 16K-L keeps the advisor mock-only and local-only while making recommendations more deterministic. The advisor uses safe local signals: selected filter family, imported / captured source, simple image aspect ratio bucket, and preview availability. It does not add computer vision, face analysis, upload, persistence, backend, or real provider calls.

Selected / imported photo polish keeps the Phase 16I floating AI / Filter tray intact, validates recommendations against the existing filter catalog, tightens selected-photo preview spacing, and keeps mock/no-upload copy compact. Cloud save, paid-user cloud save, free local lossless download, StoreKit, export, and save-to-Photos remain future dedicated phases only.

User Xcode / Simulator verification accepted Phase 16K-L on 2026-06-12. The phase is ready to commit after final review; do not commit or push automatically.

## Phase 16T / HK3 Mock Language Mode UI

Phase 16T / HK3 adds a Settings-only mock Language / Tone preview based on the Hong Kong / 麻煩友 research and HK2 copy system style guide.

Phase 16T-R1 simplifies the mock UI to language-only buttons. Phase 16T-R2 hides mock preview, praise loop, and explicit phrase cards from the production Settings UI. Cantonese keeps a short safety notice while 麻煩友 / explicit direction remains future-only.

This phase does not add runtime language switching, app-wide language switching, Settings persistence, copy resolver integration, localization runtime changes, Camera guidance copy changes, Photo Advisor copy changes, Filter Lab copy changes, explicit profanity enablement, backend, network, AI, StoreKit, provider SDKs, moderation, or runtime profanity filtering.

## Phase 16U / HK4 Deterministic Camera Coach Copy Resolver

Phase 16U / HK4 adds a local-only deterministic copy resolver scaffold for Local Camera Coach / 本機導拍 copy.

The runtime integration is intentionally narrow: selected local guidance categories now resolve through neutral default copy keys, while HK conversational and non-explicit 麻煩友 keys are scaffolded for future explicit phases. Settings Language / Tone remains mock-only and non-persistent.

This phase does not add app-wide language switching, Settings persistence, explicit profanity runtime, LLM-generated copy, AI-generated live camera copy, Photo Advisor copy changes, Filter Lab copy changes, image editing copy changes, backend, network, AI, StoreKit, provider SDKs, moderation, or runtime profanity filtering.

## Phase 16V Persistent Camera Coach Language / Tone

Phase 16V connects the deterministic resolver to Local Camera Coach runtime and persists only the Camera Coach language / tone preference.

Settings saves `cameraCoach.languageMode` and `cameraCoach.toneMode`. English, Traditional Chinese, and Simplified Chinese use neutral copy; Cantonese supports Hong Kong conversational and non-explicit 麻煩友 copy. Explicit profanity remains disabled and unavailable in runtime.

This phase does not add app-wide language switching, Photo Advisor copy changes, Filter Lab copy changes, image editing copy changes, backend, network, AI, StoreKit, provider SDKs, upload, export, save-to-Photos, or raw image / frame persistence.

## Phase 16W Photo Advisor Language / Tone Resolver

Phase 16W extends the persisted language / tone preference to the mock/local Post-capture Photo Advisor.

Photo Advisor copy now supports English, Traditional Chinese, Simplified Chinese, Cantonese conversational, and non-explicit 麻煩友 phrasing. The result card structure, filter recommendation apply behavior, no-upload boundary, and mock/local service boundary stay unchanged.

This phase does not add real AI, backend, network, provider SDKs, upload, Photo Advisor output persistence, app-wide language switching, Filter Lab copy changes, image editing copy changes, explicit profanity runtime, StoreKit, export, save-to-Photos, or raw image / frame persistence.

## Phase 16W-R2 Camera Local-only AI Surface

Phase 16W-R2 keeps Camera focused on capture and Local Camera Coach / 本機導拍 only.

Camera no longer exposes AI Snapshot / cloud-style quick advice entry points. Local Guidance remains visible and follows the persisted language / tone preference. Inspiration / imported / selected Photo Advisor remains available and language-aware for mock/local advisor flow and future cloud AI planning.

This phase does not add real AI, backend, network, provider SDKs, upload, new persistence beyond language / tone preference, app-wide language switching, explicit profanity runtime, StoreKit, export, save-to-Photos, or raw image / frame persistence.

## Phase 16X Inspiration AI Hub Cleanup

Phase 16X organizes Inspiration as the mock/local AI Hub and creative hub.

Inspiration now groups import photo analysis, Photo Advisor orientation, Filter Lab, a disabled future Photo Edit / 改圖師 placeholder, and a future cloud AI consent / no-background-upload notice. Camera remains local-only and does not regain AI Snapshot / cloud-style quick advice.

This phase does not add real AI, backend, network, provider SDKs, upload, new persistence beyond language / tone preference, app-wide language switching, explicit profanity runtime, StoreKit, export, save-to-Photos, image editing generation, or raw image / frame persistence.

## Phase 16A Camera One-Screen UX Consolidation

Phase 16A keeps the app local/mock-only and consolidates the Camera capture surface.

Implementation notes:

- `CameraView` now treats capture mode as one-screen-first instead of always wrapping the capture surface in a vertical scroll view.
- Selected-photo / imported-photo mode now uses Phase 16I floating AI advice / filter access and no longer depends on large inline filter / AI / mock save sections as the primary controls.
- Live Guidance renders as a compact expandable pill by default while preserving Mock / Local mode, toggle, local brightness guidance, face framing guidance, and stability logic.
- AI Snapshot renders as a compact entry and presents consent / result content in a sheet instead of keeping a long panel on the Camera surface.
- `CameraView` no longer exposes a PhotosPicker entry in the capture controls.
- `HomeView` / Inspiration owns photo import and presents a dedicated selected-photo result flow so Back to Camera switches to the outer Camera tab and Clear returns to Inspiration.
- Timer selection supports Off, 3s, 5s, and 10s using a confirmation dialog.
- Front-camera + flash uses a short local white screen-flash overlay before capture.
- Filter selection opens as a Camera sheet to keep the capture surface compact.

Phase 16A does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R Native Camera-style Fullscreen UX Rescue

Phase 16A-R rescues the Camera capture UI so it behaves like a fullscreen camera surface instead of a scrolling app page.

Implementation notes:

- `CameraView` now uses a fullscreen capture canvas for shooting mode and keeps selected-photo mode scrollable.
- The Camera shooting surface hides the tab bar so the shutter cannot be covered by bottom tab chrome.
- `MainTabShellView` passes a small navigation closure into `CameraView`; `CameraView` exposes this as a compact top menu for Inspiration, History, and Settings.
- Flash and timer moved into compact top camera controls.
- Timer remains selectable through Off, 3s, 5s, and 10s.
- AI Snapshot is a compact shutter-side button and still uses the Phase 16 mock-only consent / result sheet.
- Live Guidance is a compact lower-preview overlay and keeps the existing Mock / Local provider logic.
- Filter entry sits on the lower-left of the viewfinder and opens the existing grouped filter picker sheet.
- Inspiration remains the only visible photo import entry and reuses selected-photo workflow through `CameraView(initialPhoto:)`.

Phase 16A-R does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R2 Final Native Camera Layout Alignment

Phase 16A-R2 Final refines the fullscreen Camera layout so the active capture surface is closer to native iPhone Camera proportions and reclaims more bottom empty space for the viewfinder.

Implementation notes:

- The always-visible `24mm / 35mm / 77mm` selector was collapsed into a compact lens menu near the flip camera control.
- Bottom chrome, guidance/filter overlay offsets, and mode rail spacing were tightened so the preview sits closer to the shutter controls.
- The top timer control no longer shows an Off label; selected 3s, 5s, and 10s values display inside the timer circle.
- The bottom capture rail keeps AI Snapshot, shutter, flip, and lens selection close to the shutter without duplicating flash or timer.
- A thin camera mode rail keeps Inspiration, History, and Settings one tap away while the tab bar remains hidden during shooting.
- Live Guidance remains a compact lower-preview pill / optional callout, and AI Snapshot remains a compact shutter-side mock-only entry.
- The lower-left filter pill remains the only persistent filter entry on the viewfinder.

Phase 16A-R2 Final does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R3 Overlay Collision Fix

Phase 16A-R3 fixes overlay collisions in the fullscreen Camera UI and reclaims additional bottom space.

Implementation notes:

- `CameraView` now tracks one active camera callout so guidance, AI Snapshot, filter picker, and lens dropdown do not remain expanded together.
- Live Guidance uses either a compact pill or an expanded lower-right viewfinder card, avoiding the previous pill-plus-card stack.
- The filter pill remains lower-left in the viewfinder and no longer shares the same overlay slot as expanded guidance.
- Lens selection is a compact custom dropdown strip near the flip camera control and collapses after selecting a focal length.
- Bottom safe-area padding and overlay offsets were tightened again so the viewfinder sits closer to the shutter controls and mode rail.

Phase 16A-R3 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R4 Unified Navigation Insets

Phase 16A-R4 replaces the native app `TabView` shell with a small custom shell so Camera can be fullscreen without inheriting ordinary page tab-bar spacing.

Implementation notes:

- `MainTabShellView` now switches between Camera, Inspiration, History, and Settings directly instead of relying on native `TabView` tab items.
- Camera uses its own compact mode rail and manages its own safe-area spacing.
- Inspiration, History, and Settings display a custom floating tab bar with the same icon / label / accent language as Camera's compact rail.
- Non-camera pages add bottom content spacing so the floating tab bar does not cover content.
- Camera bottom inset was tightened because it no longer needs to account for the ordinary floating tab bar reservation.

Phase 16A-R4 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R5 Navigation Overlay Root-Cause Fix

Phase 16A-R5 addresses the shared layout causes behind Settings bottom CTA obstruction and Camera bottom empty space.

Implementation notes:

- Added `AppTabBarMetrics` so content-page bottom inset and Camera compact rail spacing are managed from one place.
- Inspiration, History, and Settings use a shared bottom inset large enough for the custom floating tab bar.
- Camera remains fullscreen and does not inherit the ordinary content-page bottom inset.
- Camera shutter controls and compact mode rail are now separate overlays, so the rail can sit lower without pushing shutter controls upward.
- Camera bottom gradients were reduced to make the fullscreen preview feel larger.
- Inspiration remains a one-tap destination and continues to own photo import.

Phase 16A-R5 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R6 Source-to-Simulator Layout Verification

Phase 16A-R6 verifies the R5 source path and applies a stronger fix for visible Simulator layout issues.

Implementation notes:

- `AppTabBarMetrics.swift` is under the filesystem-synchronized `AIPhotoApp` root group and is present in the `xcodebuild` frontend compile input.
- Non-Camera tabs now use `safeAreaInset` for the custom bottom tab bar instead of drawing it as a pure overlay over content.
- Settings includes a small transparent `List` footer spacer so the bottom subscription / polish row can scroll above the tab bar.
- Camera primary capture mode no longer runs inside a `NavigationStack`; the selected/imported photo flow still uses navigation for Back / Clear controls.
- Camera bottom rail / shutter / overlay spacing was tightened again through shared metrics rather than per-view scattered padding.

Phase 16A-R6 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16 + Phase 16A-R Closeout

Phase 16 mock cloud snapshot guidance and the Phase 16A-R Camera UX rescue have been manually verified by the user in Xcode / Simulator and accepted for commit review.

Implementation status:

- Phase 16 remains mock-only with `CloudSnapshotGuidanceService`, `MockCloudSnapshotGuidanceService`, consent UX, and mock success / failed / unavailable states.
- Camera UX is accepted for the current milestone: shutter is visible/tappable, Camera does not require scroll, and compact AI / guidance / filter / lens surfaces work.
- Inspiration owns photo import; Camera capture mode no longer shows Photo Picker.
- Ordinary-page bottom tab bar safe-area behavior is accepted for current review.
- No real network, upload, AI provider call, Firebase, StoreKit, persistence, export, secrets, Firebase config, API keys, or backend changes were added.

Real cloud AI remains deferred until a later explicit Phase 16B / 17 request after commit, push, and read-only confirmation.

## Phase 16A-R10 Ordinary Tab Bar Placement Hard Fix

Phase 16A-R10 fixes ordinary-page floating tab bar placement at the app shell layer.

Implementation notes:

- Inspiration, History, and Settings now render the floating tab bar from a root `ZStack` bottom overlay.
- The ordinary tab bar no longer depends on bottom `safeAreaInset` placement.
- Explicit ordinary tab bar height / bottom clearance metrics make the tab bar easier to keep fully inside the visible screen.
- Camera remains on the separate fullscreen path and keeps its compact mode rail metrics.
- The accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump was removed.

Phase 16A-R10 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R9 Bottom Navigation Safe-Area Polish

Phase 16A-R9 tightens bottom navigation safe-area behavior while leaving the accepted Camera viewfinder structure intact.

Implementation notes:

- Ordinary-page floating tab bar uses a clearer bottom offset metric and sits higher above the home indicator.
- Inspiration and History ScrollViews now add the shared content footer inset.
- Settings uses the same shared footer inset for the final spacer row, keeping the subscription / polish row accessible.
- Camera compact mode rail keeps separate fullscreen metrics and now has a minimum home-indicator clearance.
- Camera shutter row, viewfinder, Live Guidance, AI Snapshot, filter callout, and lens dropdown behavior are preserved.

Phase 16A-R9 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R8 Hide Camera Status Bar + Lift Content Tab Bar

Phase 16A-R8 separates Camera status-bar behavior from ordinary content-page navigation.

Implementation notes:

- Camera tab hides the iOS status bar through the app shell while Inspiration, History, and Settings keep the normal status bar.
- Camera top controls use a dedicated camera top inset metric so Live Guidance mode, flash, and timer can sit naturally near the top camera area.
- Ordinary-page floating tab bar spacing is lifted above the home indicator.
- Settings keeps footer spacing so the final subscription / polish row can scroll above the floating tab bar.
- Camera compact mode rail keeps separate fullscreen metrics and is not affected by the ordinary tab bar lift.

Phase 16A-R8 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A-R7 Camera Control Position Polish

Phase 16A-R7 refines control placement after the Camera fullscreen layout rescue.

Implementation notes:

- Camera top controls add more safe-area clearance so they sit below the status bar / Dynamic Island region.
- Filter and guidance overlays now use separate shared bottom metrics to reduce overlap risk.
- AI Snapshot, shutter, flip camera, and lens dropdown remain grouped in the bottom camera control band.
- Lens dropdown opens higher near the flip / lens controls.
- The Camera compact mode rail has a small shadow to align visually with the ordinary floating tab bar.
- Ordinary-page floating tab bar bottom spacing is lifted, while Settings keeps a footer spacer so the final CTA remains accessible.

Phase 16A-R7 does not add real network calls, URLSession/URLRequest usage, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend code, third-party SDKs, new Vision request types, higher frame sampling frequency, voice / ASR, face recognition, identity inference, or sensitive attribute inference.

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
