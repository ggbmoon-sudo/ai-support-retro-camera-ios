# AGENTS.md

This repo is for an iOS-first AI Support retro camera app.

The product is a retro film-style camera plus an AI photo coach. The MVP is not a full AI photo editing studio. The MVP focuses on single-photo capture, local retro presets, one-photo AI analysis, short actionable advice, Firebase-backed metadata/storage, basic history, privacy consent, and subscription scaffolding.

Future Codex phases should start by reading this file and following all project rules here before reading phase-specific docs.

## Required Reading Before Every Task

Before making changes, always read:

- README.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md

For feature-specific work, also read the relevant report:

- Camera / filters / image pipeline: docs/03-camera-filter-image-pipeline.md
- AI photo advice: docs/04-ai-photo-advisor.md
- Firebase / Firestore / Storage / Cloud Functions: docs/05-firebase-storage-firestore-functions.md
- UI / UX / design system: docs/06-ui-ux-design-system.md
- Subscription / quota / StoreKit: docs/07-subscription-quota-storekit.md
- Privacy / security / App Store risk: docs/08-privacy-security-app-store-risk.md

For phase work, also read the relevant prompt in:

- docs/prompts/

If a prompt says "follow project rules" or "read AGENTS.md", this file is the reusable source of truth for long-term boundaries. Phase prompts may add stricter rules for that phase, but they do not relax the rules below unless the user explicitly approves that exception.

## Core Architecture

Use the following architecture unless a later decision document explicitly changes it:

- iOS frontend: Swift + SwiftUI
- Camera: AVFoundation
- Photo import: PhotosPicker / PHPicker
- Local filters: Core Image
- Future advanced GPU work: Metal only if needed
- Local visual guidance: Vision
- Backend: Firebase-first
- Auth: Firebase Auth
- Database: Cloud Firestore
- Media storage: Firebase Storage
- Server logic: Cloud Functions v2
- Configuration: Remote Config
- Abuse protection: App Check
- Subscription: StoreKit 2 + StoreKit views
- AI: backend-mediated provider adapter only
- Current real-provider Photo Advisor internal beta: backend-only QweAPI-compatible path, internal/debug gated
- Production/default Photo Advisor: mock/local unless a future production rollout phase explicitly approves otherwise
- Camera: local-only unless a future phase explicitly approves a Camera cloud AI entry
- Future image editing provider: placeholder only; no real image editing backend is approved yet

## Hard Rules

- Work on one phase only.
- Do not start the next phase unless explicitly requested.
- Do not delete existing working features.
- Do not rewrite the whole project unless explicitly requested.
- Keep changes small and reviewable.
- Do not add real API keys, secrets, Firebase project IDs, Apple credentials, Gemini keys, or OpenAI keys.
- Use placeholders, `.example` files, TODO comments, or mock providers where real external setup is required.
- Do not put provider API keys in the iOS app.
- AI API keys must be server-side only.
- Do not add direct provider SDK/API calls to iOS.
- Do not connect paid external services without explicit instruction.
- Do not add personalized ads SDKs in MVP.
- Do not implement true cloud real-time video streaming AI in MVP.
- Do not implement full AR, 3D pose overlay, complex skeleton tracking, social features, or a full AI editing studio in MVP.
- Do not claim a feature is complete if it only has placeholder code.
- If a manual Apple Developer / Firebase Console setup step is required, document it instead of inventing values.
- Do not enable production cloud AI rollout unless explicitly approved for a production rollout phase.
- `productionReady` must remain `false` unless the user explicitly approves changing it.

## Cloud AI and Provider Boundary Rules

- iOS must not contain provider API keys such as `QWE_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `CODE0_API_KEY`, `INTENEXT_API_KEY`, or equivalent real secrets.
- iOS must not directly call provider gateways such as QweAPI, Gemini, OpenAI, Code0, Intenext, or future provider endpoints.
- Provider calls must go through the backend boundary only.
- Camera must not expose cloud AI entry points, AI Snapshot, Quick Advice, cloud upload, or provider-backed capture actions unless explicitly approved.
- Inspiration / selected-photo Photo Advisor remains the debug/internal cloud AI home from Phase 17C; production/default remains mock/local.
- Do not upload capture context from iOS unless a future phase explicitly approves the schema, consent, payload, validation, and rollout boundary.
- Do not change iOS upload payloads or backend provider request payloads unless the requested phase explicitly says to do so.
- Do not add Gemini Live, streaming, voice, WebSocket, AI Filter Generator real backend, real image editing provider, StoreKit/payments, premium quota, or social caption generation unless explicitly requested.

## Logging, Data, and Artifact Rules

- Do not log raw image data, base64 image content, raw prompts, request bodies containing images, raw provider responses, Authorization headers, API keys, provider secrets, stack traces containing provider text, or unsafe provider text.
- Do not persist raw images, raw sensor streams, continuous motion logs, raw EXIF dumps, GPS/location, raw provider responses, raw prompts, or request payloads.
- Do not collect GPS/location.
- Do not collect raw EXIF dumps.
- Provider QA reports, real photos, approved real samples, local synthetic images, generated reports, screenshots, recordings, and device-specific debug artifacts must remain ignored/untracked unless a later safe-asset policy explicitly approves committing them.
- Real-provider QA must use local ignored credentials and approved ignored samples only; committed reports must be synthetic or explicitly sanitized.
- Generated provider QA reports must keep `productionReady: false` until an explicit production rollout phase changes that.

## Privacy Rules

- User photos must not be assumed to be used for model training.
- `trainingConsent` should default to false.
- If future training / model improvement is added, it must be a separate, revocable, auditable opt-in.
- The MVP consent should explain third-party AI processing for photo analysis.
- Users must be able to delete a single photo.
- Users must be able to request account and data deletion.
- Logs should not contain raw image data, base64 image content, full signed URLs, or sensitive prompts.

## Sensitive Inference Rules

- Do not infer, describe, rate, or judge face, skin, age, gender, attractiveness, beauty, emotion, mental state, health, identity, ethnicity, race, religion, nationality, disability, sexuality, body, or other protected/sensitive personal attributes.
- Do not add face recognition, identity recognition, demographic inference, attractiveness scoring, beauty scoring, body judgement, or appearance attacks.
- Photo Advisor and provider output must reject or fallback on sensitive inference, identity-adjacent wording, abusive copy, banned terms, provider/debug leakage, chain-of-thought leakage, score/rating language, harsh fix-it wording, or unsupported filter IDs.

## Photo Advisor Language Rules

- Photo Advisor language must follow: Observation -> Mood -> Retro intent -> Optional action.
- Photo Advisor must never regress into: Score -> Problem -> Fix -> Retake.
- The advisor should sound warm, practical, retro-camera-aware, and concise.
- It must not sound like a generic AI critic, photography teacher grading homework, score/rating system, or fix-it tool.
- Blur, motion, tilt, low light, grain/noise, soft focus, high contrast, faded color, underexposure, overexposure, unusual framing, and clutter may be intentional retro style.
- Treat technical signals as context, not mistakes.
- Retake advice must be rare, conservative, optional, and lower priority than mood/style/filter guidance.
- Filter recommendations should include filter family/name, matched safe photo signal, and retro aesthetic result. Avoid generic "try this filter" as the primary reason.
- Imported photos must not pretend capture-time motion, tilt, focus, lens, or exposure context is available.
- Production UI must not show provider names, raw JSON, raw provider errors, raw localization keys, chain-of-thought, debug fields, raw capture context, raw EXIF, raw sensor values, internal classification names, numeric confidence, score, or rating.

## Local Capture Intelligence Rules

- Capture context is local-only unless explicitly approved otherwise.
- Capture context is summarized/bucketed context, not a score system.
- Prefer buckets, rounded values, or safe summaries over raw continuous values.
- Do not persist continuous motion or raw sensor streams.
- CoreMotion/device signal summaries must be short-window and in-memory only, and clear when the Camera lifecycle stops.
- DEBUG capture context preview, if present, must be DEBUG-only, compact, bucket-only, and free of raw sensor streams/raw EXIF/raw JSON.

## Documentation Rules

After every phase, update:

- docs/phase-log.md

When relevant, also update:

- README.md
- docs/decisions.md
- feature-specific docs
- docs/prompts/ if the phase plan changes

Every phase log entry should include:

- status
- date
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether the repo is ready for the next phase

## Testing Rules

When code is added, include at least one of:

- unit tests
- UI tests
- emulator tests
- manual test checklist

For placeholder-only phases, include manual smoke test notes.

Before finishing a task, check:

- no real secrets committed
- project structure is still clean
- docs/phase-log.md is updated
- changed files are listed
- how to test is documented
- known TODOs are documented

## Phase Workflow

Use this workflow:

1. Read required docs.
2. Check docs/phase-log.md.
3. Confirm the requested phase.
4. Modify only the relevant files.
5. Add tests or manual test notes.
6. Update docs/phase-log.md.
7. Report changed files, how to test, known TODOs, and readiness for the next phase.

## Required Final Response Sections

For phase closeout, include these sections or their direct equivalents:

- changed files
- summary
- 改咗咩 / What changed
- Xcode 要檢查咩 / What to check in Xcode
- verification
- boundary confirmations
- suggested commit message
- ready to commit: yes/no
- ready for production rollout: no, unless explicitly approved otherwise
- pushed: yes/no, and if no, why

If no iOS source/project/localization files changed, say Xcode runtime behavior should be unchanged, while still confirming no Camera cloud entry, no iOS provider key/direct provider call, and no production remote rollout.

## Current Development Phases

- Phase 17C: backend-only real-provider Photo Advisor internal beta, debug/internal only
- Phase 17D: local-only capture context and capture intelligence
- Phase 18-A: app-side Photo Advisor language system, filter reasons, CreativeIntentGuard, result card, copy QA
- Phase 18-B: backend/provider language contract, regression fixtures, QA runner, dry-run gate
- Production rollout: blocked until explicitly requested and approved
