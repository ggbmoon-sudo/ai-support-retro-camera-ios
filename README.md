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

- Phase 15: Local Live Guidance Prototype

Next phase:

- Phase 16, only after Phase 15 is reviewed, committed, pushed, read-only confirmed, and explicitly requested

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
