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

- Phase 10: MVP Demo QA / Release Readiness

Next phase:

- Phase 11, only after Phase 10 is reviewed, committed, pushed, and explicitly requested

Before each task, read `AGENTS.md`, the required docs listed there, and the relevant phase prompt in `docs/prompts/`.

After each phase, update `docs/phase-log.md` with status, changed files, checks, TODOs, and readiness for the next phase.

## Documentation

Product and architecture reports live in `docs/`.

Phase execution prompts live in `docs/prompts/`.

Current MVP demo / QA readiness docs:

- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`

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

## Phase 00 Status

Phase 00 creates the repository skeleton, documentation layout, placeholder Firebase files, placeholder Cloud Functions files, helper scripts, and manual smoke test checklist.

No real app features are implemented in Phase 00.

Next work should be Phase 01: Design System + Navigation.
