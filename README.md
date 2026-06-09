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

- Phase 12B: Filter Preset Schema And Batch 1

Next phase:

- Phase 13, only after Phase 12B is reviewed, committed, pushed, and explicitly requested

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
