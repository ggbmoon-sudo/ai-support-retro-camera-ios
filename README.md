# AI Support Retro Camera iOS

AI Support Retro Camera iOS is an iOS-first retro film-style camera plus a single-photo AI photo coach.

The MVP is intentionally focused. It is not a full AI photo editing studio. The first version should help photography beginners capture or import one photo, apply simple retro presets, receive short actionable AI advice, and keep basic Firebase-backed photo history.

## MVP Scope

- Single-photo capture
- Single-photo import from photo library
- At least 3 local retro film presets
- One-tap retro output
- One-photo AI analysis after capture
- AI returns 1 short summary, up to 3 actionable suggestions, and simple adjustment values
- Firebase Storage image storage
- Firestore metadata, preset ID, and AI advice values
- Basic history
- Free users receive 20 starter analysis credits
- Daily login grants 1 analysis credit
- Free users can save up to 20 cloud photos
- Subscription page scaffold
- Privacy consent before AI processing
- Delete single photo
- Delete account and data request flow

## Architecture

- iOS frontend: Swift + SwiftUI
- Camera: AVFoundation
- Photo import: PhotosPicker / PHPicker
- Local filters: Core Image
- Local visual guidance: Vision
- Backend: Firebase-first
- Auth: Firebase Auth
- Database: Cloud Firestore
- Media storage: Firebase Storage
- Server logic: Cloud Functions v2
- Configuration: Remote Config
- Abuse protection: App Check
- Subscription: StoreKit 2 + StoreKit views
- AI: Cloud Functions server-side proxy with provider adapter
- MVP AI provider: Gemini paid tier / GeminiAnalyzer
- Future image/edit provider: OpenAI adapter placeholder only

## Repo Layout

```text
.
├── README.md
├── AGENTS.md
├── .gitignore
├── .env.example
├── .firebaserc.example
├── docs/
│   ├── 00-common-background-v2.md
│   ├── 01-product-mvp-scope.md
│   ├── 02-technical-architecture.md
│   ├── 03-camera-filter-image-pipeline.md
│   ├── 04-ai-photo-advisor.md
│   ├── 05-firebase-storage-firestore-functions.md
│   ├── 06-ui-ux-design-system.md
│   ├── 07-subscription-quota-storekit.md
│   ├── 08-privacy-security-app-store-risk.md
│   ├── 09-codex-phase-plan.md
│   ├── phase-log.md
│   ├── decisions.md
│   └── prompts/
├── ios-app/
├── functions/
├── firebase/
├── scripts/
└── tests/
```

## Phase-Based Development Workflow

Development happens one phase at a time. Do not start the next phase unless it is explicitly requested.

Current phase:

- Phase 16 + Phase 16A-R UX rescue closeout

Next phase:

- Real cloud AI integration remains blocked until a later explicit Phase 16B / 17 request

Before each task, read `AGENTS.md`, the required docs listed there, and the relevant phase prompt in `docs/prompts/`.

After each phase, update `docs/phase-log.md` with status, changed files, checks, TODOs, and readiness for the next phase.

## Documentation

Product and architecture reports live in `docs/`.

Phase execution prompts live in `docs/prompts/`.

Current MVP demo / QA readiness docs:

- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/product-roadmap-next.md`
- `docs/feature-change-requests.md`
- `docs/filter-research-popular-film-looks.md`
- `docs/filter-preset-schema.md`
- `docs/filter-roadmap.md`

Use these docs as the source of truth unless a later decision in `docs/decisions.md` explicitly changes an earlier decision.

## Secrets

Do not commit real secrets, API keys, Firebase project IDs, Apple credentials, Gemini keys, OpenAI keys, or `GoogleService-Info.plist`.

Use placeholder files only:

- `.env.example`
- `.firebaserc.example`
- Firebase Console TODOs in docs
- Server-side secret management TODOs for AI keys

The iOS app must never contain Gemini or OpenAI API keys.

## Current Mock MVP Status

The current iOS app is a local/mock MVP demo, not a production release.

Completed and manually verified scaffold phases include Camera / Photo Picker, local Core Image filters, mock save, mock AI advice UI, local session history, and MVP UX polish.

Current limitations are documented in `docs/mvp-known-limitations.md`. The demo flow is documented in `docs/mvp-demo-script.md`. Future real-service gates are documented in `docs/mvp-readiness-checklist.md`.

The current app does not include real Firebase upload, Firestore writes, Storage writes, Cloud Functions calls, real Gemini / OpenAI calls, StoreKit, quota enforcement, disk persistence, UserDefaults persistence, export, save-to-Photos, production Firebase config, or real secrets.

## Phase 12A Filter Planning Status

Phase 12A is documentation-only planning for the next filter system step.

Current Phase 12A docs define:

- Popular film / retro / photographer-style look research.
- Brand-safe public filter naming guidance.
- 20 proposed filter presets.
- The first 12 filter priorities.
- The first 6 Phase 12B hero filters: Soft Warm 400, Summer Gold 200, Street Chrome, Soft Sun Portrait, Cinema Flat, and Silver Gradation.
- App-level filter preset schema fields and parameter ranges.
- A filter implementation roadmap from Batch 1 through 20+ filters.

Phase 12A does not implement filters, modify Swift code, modify backend code, add real Firebase, add real AI, add Cloud Functions calls, add StoreKit, add persistence, add export, add dependencies, or add secrets.

## Phase 12B Filter Batch 1 Status

Phase 12B implements the first data-driven local filter catalog expansion.

Current local filter catalog:

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

Original remains the no-filter option. Classic Film, Warm Vintage, and Faded Chrome are retained as legacy starter filters with their existing IDs.

Phase 12B uses only Core Image approximations in the existing local pipeline. It does not add the full 20-filter library, LUTs, grain assets, light leaks, live AI guidance, AI custom filters, real AI, real Firebase, StoreKit, persistence, export, secrets, backend changes, dependencies, or third-party SDKs.

## Phase 13 Expanded Filter Library Status

Phase 13 expands the local research preset catalog to 20 Core Image MVP approximations.

The current 20 research presets are:

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

The filter picker now groups presets instead of showing one long horizontal row.

Phase 13 remains local/mock-only. It does not add LUT assets, true grain overlays, light leaks, frames, dust, Metal shaders, AI custom filters, real AI, real Firebase, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, backend changes, dependencies, or third-party SDKs.

## Phase 14 Live Guidance Mock UX Status

Phase 14 adds a local/mock live guidance overlay to the Camera screen.

Current Phase 14 behavior:

- Small camera-style guidance toggle in the Camera status bar.
- Camera control-area guidance strip with mock guidance state.
- Mock states: off, idle, scanning, suggestion available, paused.
- 1-3 short mock shooting suggestions.
- Suggestions are local static mock hints only.
- Capture button, filter picker, Photo Picker import, flash/timer/flip controls, tab navigation, 20 local filters, mock save, mock AI, local session history, History, and Settings remain in scope.

Phase 14 does not add Apple Vision, frame analysis, live video frame reading, frame upload, frame streaming, frame persistence, Gemini Live, Gemini, OpenAI, Cloud Functions, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, save-to-Photos, secrets, backend changes, dependencies, or third-party SDKs.

## Phase 14B Camera Frame / Inspiration Status

Phase 14B refines the Phase 14 UI without starting Phase 15.

Current Phase 14B behavior:

- Camera remains the primary app tab and no landing intro was reintroduced.
- Camera tab hides the large page title in the primary tab context.
- The capture screen uses a darker camera-chrome shell with a compact framed 4:5-style viewport.
- The focal label is visible on the viewport and updates from a local/mock lens selector.
- The lens selector offers mock 24mm / 35mm / 77mm options only; it does not perform real iPhone multi-lens hardware switching.
- The live guidance overlay is moved below the viewport and above the shutter controls.
- The former Guide tab is positioned as Inspiration, with local/mock cards for shooting ideas, mock AI advice entry points, filter inspiration, and future AI photo areas.
- Inspiration no longer uses Open Camera as the primary CTA.

Phase 14B remains local/mock-only. It does not add Apple Vision, live frame analysis, frame upload, Gemini Live, voice / ASR, real Firebase, StoreKit, persistence, export, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 14C Selected Photo Back / Clear Status

Phase 14C keeps the selected-photo / imported-photo flow usable on small screens.

Current Phase 14C behavior:

- Selected-photo / imported-photo mode shows fixed Back to Camera / Clear controls near the top.
- Back to Camera / Clear returns to the camera preview or simulator fallback.
- Photo Picker import, filters, mock save, mock AI, local history, History, Settings, Inspiration, live guidance, and the mock lens selector remain in scope.

Phase 14C does not change filter rendering, guidance logic, real camera hardware behavior, persistence, export, backend code, secrets, or real service integrations.

## Phase 15 Local Live Guidance Prototype Status

Phase 15 adds the first local live guidance provider architecture without starting cloud AI guidance.

Current Phase 15 behavior:

- Live guidance can switch between Mock and Local modes.
- Mock guidance remains available as the Phase 14 fallback.
- Local guidance uses rule-based sample/fallback signals for too dark, too bright, subject centering, headroom, face distance, warm filter suggestion, and local signal unavailable fallback.
- Simulator remains safe because this first local prototype does not add live video frame sampling.
- The guidance overlay remains below / outside the main viewfinder obstruction.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15 does not import Vision yet, does not add AVFoundation video frame sampling, and does not store, upload, stream, persist, or log raw frames. It does not add Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15B Local Frame Signal Prototype Status

Phase 15B adds the first real local frame signal path for live guidance, scoped to low-frequency brightness analysis only.

Current Phase 15B behavior:

- Local guidance can receive derived brightness signals from a throttled AVFoundation video data output.
- Brightness analysis is enabled only while Local guidance is active in the camera preview.
- The brightness analyzer only emits local guidance signals such as too dark, too bright, or balanced lighting.
- Frame sampling is low-frequency and runs analysis off the main thread.
- UI guidance updates return to the main thread.
- Phase 15 sample/fallback local suggestions remain available when no camera frame signal exists.
- Mock guidance remains available.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15B does not import Vision, does not add face rectangle / headroom analysis, does not store, upload, stream, persist, or log raw frames, and does not add Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15C Local Face Framing Vision Prototype Status

Phase 15C adds the first local Apple Vision face rectangle prototype for live guidance.

Current Phase 15C behavior:

- Local guidance keeps the Phase 15B low-frequency brightness signal path.
- `LiveGuidanceFaceAnalyzer` uses Vision only for local face rectangle / bounding box detection.
- Face rectangle results are converted immediately into derived framing signals such as subject off-center, low headroom, face too close, face too far, and portrait framing ready.
- `import Vision` is limited to the local face analyzer file.
- Mock guidance, Local guidance fallback, Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15C does not do face recognition, identity inference, age / gender / emotion / beauty / attractiveness / health / sensitive inference, face data persistence, face rectangle history, raw frame upload, raw frame streaming, raw frame persistence, raw frame logging, Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15D Guidance Stability and Priority Status

Phase 15D adds a memory-only stability layer for Local guidance suggestions.

Current Phase 15D behavior:

- Local guidance suggestions are ranked so lighting and face-distance warnings can win over softer composition or filter hints.
- Local guidance shows at most two stable suggestions at once.
- A small cooldown, confirmation count, and hold duration reduce aggressive flicker and repeated suggestions.
- Fallback suggestions are kept calm and should not immediately replace stronger recent hints.
- Mock guidance remains available.
- Phase 15B brightness guidance and Phase 15C face framing / headroom guidance remain available.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15D does not add new AI ability, new frame analysis types, new Vision request types, higher frame sampling frequency, face recognition, identity inference, age / gender / emotion / beauty / attractiveness / health / sensitive inference, face data persistence, face rectangle history, raw frame upload, raw frame streaming, raw frame persistence, raw frame logging, Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 16 Cloud Snapshot AI Guidance Prototype Status

Phase 16 adds an explicitly triggered, consent-gated mock cloud snapshot guidance flow without connecting real cloud AI.

Current Phase 16 behavior:

- Camera shows a compact AI snapshot / AI Quick Advice entry near the existing guidance controls.
- The user must tap the AI entry, review privacy copy, then explicitly start the mock check.
- Consent copy explains that a future real cloud version would send one snapshot for AI analysis, while Phase 16 is mock-only.
- Consent copy states that there is no background upload, no continuous video stream, no photo/request persistence, and no provider API key in the iOS app.
- `CloudSnapshotGuidanceService` defines the app-side service boundary.
- `MockCloudSnapshotGuidanceService` returns short mock guidance, failed, and unavailable states without network calls.
- `CloudSnapshotGuidanceState` keeps the flow memory-only with idle, consent, preparing, analyzing, result, failed, and unavailable states.
- Local guidance remains available and is not replaced by the optional cloud snapshot flow.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 16 does not add real network requests, URLSession/URLRequest calls, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend changes, dependencies, raw frame/photo/request payload persistence, face recognition, identity inference, or sensitive attribute inference.

## Phase 16A Camera One-Screen UX Consolidation Status

Phase 16A consolidates the Camera tab into a more one-screen-first shooting surface while keeping Phase 16 mock-only.

Current Phase 16A behavior:

- Camera capture mode is no longer an always-scrolling surface.
- Live Guidance defaults to a compact expandable pill while preserving Mock / Local modes, toggle, brightness guidance, face framing guidance, and stability logic.
- AI Snapshot defaults to a compact entry and opens consent / result UI in a sheet only after explicit user tap.
- Camera tab no longer shows a Photo Picker / Choose Photo entry.
- Inspiration tab owns photo import and opens the existing selected-photo filter / mock save / mock AI / local history flow.
- Timer supports Off, 3s, 5s, and 10s options.
- Front-camera + flash uses a local screen-flash scaffold.
- Filter picker opens from Camera as a sheet instead of occupying the capture surface.

Phase 16A does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, or third-party SDKs.

## Phase 16A-R Native Camera-style Fullscreen UX Rescue Status

Phase 16A-R rescues the Camera capture surface so it behaves more like a native fullscreen camera instead of a scrolling app page.

Current Phase 16A-R behavior:

- Camera shooting mode uses a fullscreen camera canvas with overlaid controls.
- The bottom tab bar is hidden while shooting so it cannot cover the shutter.
- A compact top menu keeps Inspiration, History, and Settings reachable while the Camera tab bar is hidden.
- Shutter stays fixed at bottom center.
- AI Snapshot is a compact button beside the shutter and still opens consent / mock result UI only after explicit tap.
- Live Guidance is a compact lower-preview overlay and expands only when tapped.
- Filter entry is a translucent lower-left viewfinder button showing the current filter.
- Camera tab has no Photo Picker / Choose Photo entry; Inspiration owns photo import.
- Timer remains selectable with Off, 3s, 5s, and 10s.
- Front-camera + flash screen-flash scaffold remains local-only.

Phase 16A-R does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R2 Final Native Camera Layout Alignment Status

Phase 16A-R2 Final tightens the fullscreen Camera capture layout toward a more native iPhone Camera-like arrangement and further expands the viewfinder feel by reclaiming bottom empty space.

Current Phase 16A-R2 Final behavior:

- Viewfinder space is increased by removing the always-expanded lens selector from the lower camera chrome.
- Bottom camera chrome, guidance/filter offsets, and mode rail spacing were tightened so the preview feels closer to the shutter controls.
- Lens selection is now a compact shutter-side menu near the flip camera control.
- Timer still supports Off, 3s, 5s, and 10s, but Off no longer shows a visible label and active durations appear inside the timer control.
- Inspiration, History, and Settings are one tap away from a thin bottom mode rail instead of being hidden only in an overflow menu.
- AI Snapshot remains a compact shutter-side mock-only control.
- Live Guidance remains a compact lower-preview pill / expandable callout.
- Filter entry remains a translucent lower-left viewfinder pill and opens the grouped 20-filter picker only on tap.
- Camera tab still has no Photo Picker / Choose Photo entry; Inspiration owns photo import.

Phase 16A-R2 Final does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R3 Overlay Collision Fix Status

Phase 16A-R3 fixes camera overlay collisions and reclaims more bottom space without starting real cloud AI.

Current Phase 16A-R3 behavior:

- Camera callouts use a single active state so Live Guidance, AI Snapshot, filter picker, and lens dropdown do not remain expanded at the same time.
- Live Guidance now shows either the compact pill or the expanded card, not both stacked together.
- Expanded Live Guidance sits inside the viewfinder on the lower-right, while the filter pill stays lower-left.
- Lens selection uses a compact custom dropdown strip near the flip camera control and auto-collapses after selection.
- Bottom safe-area padding, guidance/filter offsets, and capture rail spacing were tightened again to reduce empty black space under the mode rail.
- AI Snapshot remains a compact shutter-side mock-only control that opens consent / result UI only after explicit tap.
- Camera tab still has no Photo Picker / Choose Photo entry; Inspiration owns photo import.

Phase 16A-R3 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R4 Unified Navigation Insets Status

Phase 16A-R4 separates Camera fullscreen navigation from ordinary content-page navigation.

Current Phase 16A-R4 behavior:

- `MainTabShellView` no longer uses the native `TabView` for the main app shell, avoiding shared tab bar safe-area reservation on Camera.
- Camera renders as a fullscreen variant with its own compact mode rail and no ordinary page bottom padding.
- Inspiration, History, and Settings use a custom floating tab bar with matching icon / label / selected-color language.
- Ordinary pages keep bottom content spacing so their content is not covered by the floating tab bar.
- Camera bottom inset is tightened further now that it is not sharing the ordinary floating tab bar reservation.
- Inspiration remains one tap away from Camera and still owns photo import.

Phase 16A-R4 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R5 Navigation Overlay Root-Cause Status

Phase 16A-R5 fixes the shared bottom navigation layout causes behind Settings CTA obstruction and Camera bottom empty space.

Current Phase 16A-R5 behavior:

- `AppTabBarMetrics` centralizes content-page bottom inset and Camera compact rail spacing.
- Inspiration, History, and Settings use the shared bottom content inset so the custom floating tab bar does not cover final content or CTA rows.
- Camera remains on the fullscreen path and does not receive ordinary content-page bottom padding.
- Camera shutter controls and compact mode rail are separate overlays, so the mode rail no longer pushes the shutter row upward.
- Camera bottom gradients were reduced to reclaim more visible camera area.
- Inspiration remains one tap away and still owns photo import.

Phase 16A-R5 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R6 Source-to-Simulator Verification Status

Phase 16A-R6 confirms the layout source is part of the app target and applies a harder navigation / Camera layout fix.

Current Phase 16A-R6 behavior:

- `AppTabBarMetrics.swift` is included by the Xcode filesystem-synchronized `AIPhotoApp` root group and appears in the sandboxed `xcodebuild` frontend compile input.
- Non-Camera pages now place the custom bottom tab bar with `safeAreaInset`, so page content is laid out above the tab bar instead of being covered by an overlay.
- Settings adds a small bottom `List` footer spacer so the subscription / polish row can scroll fully above the bottom navigation.
- Camera capture mode no longer sits inside a `NavigationStack`; the primary capture path is a fullscreen camera root.
- Camera still keeps selected/imported photo flow in a navigation presentation for the fixed Back / Clear controls.
- Camera mode rail and shutter controls remain separate overlays, with tighter spacing and lower bottom rail placement.

Phase 16A-R6 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16 + Phase 16A-R Closeout Status

Phase 16 mock cloud snapshot guidance and the Phase 16A-R Camera UX rescue have been manually verified by the user in Xcode / Simulator and accepted for commit review.

Accepted current behavior:

- Phase 16 remains a mock-only cloud snapshot service boundary with explicit user consent and no real network/upload.
- Camera UX is acceptable, shutter is visible/tappable, and Camera no longer requires scrolling for capture.
- AI Snapshot compact entry, consent, and mock result work.
- Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability remain normal.
- Guidance / AI / filter / lens callouts do not show obvious overlap.
- Camera tab no longer has Photo Picker; Inspiration owns photo import.
- Ordinary page bottom tab bar and Settings / Inspiration / History bottom content are acceptable.
- 20 filters, mock save, mock AI, local history, History, and Settings remain normal.
- No real network, upload, AI, Firebase, StoreKit, persistence, export, secrets, Firebase config, API keys, or backend changes were added.

Phase 16B / real cloud AI integration remains blocked until Phase 16 + 16A-R are committed, pushed, read-only confirmed, and explicitly requested.

## Phase 16A-R10 Ordinary Tab Bar Placement Status

Phase 16A-R10 moves ordinary-page floating tab bar placement out of the bottom `safeAreaInset` path and into a root overlay with explicit bottom positioning.

Current Phase 16A-R10 behavior:

- Inspiration, History, and Settings floating tab bar is rendered as a root bottom overlay, not inside a bottom safe-area inset container.
- The ordinary floating tab bar uses explicit estimated height, bottom fallback, and bottom clearance metrics.
- Ordinary content bottom padding remains shared so bottom cards / CTA rows can scroll above the floating tab bar.
- Camera remains on the separate fullscreen path and is not affected by the ordinary tab bar placement fix.
- The accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump was removed.

Phase 16A-R10 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R9 Bottom Navigation Safe-Area Status

Phase 16A-R9 polishes bottom navigation safe-area behavior without redesigning the Camera viewfinder.

Current Phase 16A-R9 behavior:

- Ordinary content-page floating tab bar is lifted farther above the home indicator.
- Inspiration and History ScrollView content use the shared bottom footer inset.
- Settings keeps the shared footer spacer so the final subscription / polish row can scroll above the floating tab bar.
- Camera compact mode rail keeps separate fullscreen metrics and now has a minimum home-indicator clearance.
- Camera viewfinder structure and capture controls remain otherwise unchanged from the accepted Phase 16A-R direction.

Phase 16A-R9 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R8 Camera Status Bar / Content Tab Bar Status

Phase 16A-R8 hides the iOS status bar only on the fullscreen Camera tab and lifts the ordinary floating tab bar on content pages.

Current Phase 16A-R8 behavior:

- Camera uses app-shell status bar hiding so the capture surface feels more like a fullscreen native camera.
- Inspiration, History, and Settings keep the normal iOS status bar.
- Camera top controls use a Camera-specific safe-area metric instead of sharing content-page navigation spacing.
- Inspiration, History, and Settings floating tab bar is lifted above the home indicator while content keeps enough bottom padding.
- Camera compact mode rail keeps its own fullscreen metrics and is not affected by the ordinary floating tab bar lift.

Phase 16A-R8 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R7 Camera Control Position Status

Phase 16A-R7 polishes the Camera control positions after the fullscreen R6 pass and lifts the non-Camera floating tab bar.

Current Phase 16A-R7 behavior:

- Camera top controls sit farther below the status bar / Dynamic Island area.
- Camera filter and guidance overlays use separate bottom spacing so their compact pills are less likely to collide.
- AI Snapshot, shutter, flip camera, and lens dropdown remain in one coordinated bottom control band.
- Lens dropdown opens a little higher near the flip / lens controls.
- Camera compact mode rail keeps the same visual language as the ordinary floating tab bar.
- Inspiration, History, and Settings floating tab bar is lifted farther above the bottom edge while Settings keeps its bottom CTA spacer.

Phase 16A-R7 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 11B Camera Entry / Camera Shell Status

Phase 11B refines Phase 11 so Camera is the true app entry and the capture screen feels more like a real camera shell.

Current Phase 11B behavior:

- No launch landing / browse screen
- No launch-time Auth gate
- Camera as the default first tab
- Dark camera shell
- Large central 4:5 viewfinder
- Top camera status / selected preset line
- Bottom camera controls
- Flash / timer / camera flip mock controls
- Capture button
- Lower-right filter picker entry
- Photo Picker fallback
- Existing local filter presets only
- Mock save
- Mock AI advice
- Local session history
- History
- Settings
- Secondary guide content
- Mock auth entry in Settings for future cloud features

Phase 11B does not add expanded filters, live AI guidance, AI custom filters, AI image generation, real Firebase, real AI, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, or production config.

Known product gaps accepted for commit:

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should be more prominent and information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign if the current shell is not yet product-satisfying.

## Phase 00 Status

Phase 00 creates the repository skeleton, documentation layout, placeholder Firebase files, placeholder Cloud Functions files, helper scripts, and manual smoke test checklist.

No real app features are implemented in Phase 00.

Next work should be Phase 01: Design System + Navigation.
