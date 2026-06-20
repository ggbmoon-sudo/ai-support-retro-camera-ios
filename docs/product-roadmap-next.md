# Next Product Roadmap

## Today's AI Direction Change

Live camera guidance should now prioritize on-device Vision / AVFoundation geometry, hardware depth when available, and app-side retro-aware rules instead of cloud live VLM as the primary path. Cloud/self-hosted/API VLM work remains valid for post-capture Photo Advisor, offline benchmark, internal evaluation, schema validation, and future model-assisted labeling, but it is no longer the default live guidance direction.

See `docs/on-device-live-framing-ai-roadmap.md` for the revised Phase 21-A through Phase 21-E plan. This roadmap update is docs-only and adds no runtime code, model files, provider calls, frame upload, Camera live cloud AI entry, dataset crawler, or production readiness change.

This document captures the next product direction after the current local/mock MVP and proposes a phased roadmap from Phase 11 through Phase 17.

The roadmap is planning-only. It does not start Phase 11 and does not authorize implementation of real Firebase, real AI, Cloud Functions, StoreKit, persistence, export, or production services.

## Current Mock MVP Status

The current iOS app is a local/mock MVP demo.

Current branch:

```text
feat/phase-02-auth
```

Current mock MVP flow:

```text
Home
-> Camera / Photo Picker
-> Filter
-> Mock Save
-> Mock AI Advice
-> Local Session History
-> Settings
```

Completed scaffold / demo phases include:

- Phase 03 Camera + Photo Picker scaffold.
- Phase 04 local Core Image filter presets.
- Phase 05 mock photo save scaffold.
- Phase 06 mock AI photo advisor service / backend scaffold.
- Phase 07 mock AI advisor result UI.
- Phase 08 local session history.
- Phase 09 MVP polish / UX hardening.
- Phase 10 MVP demo QA / release readiness docs.

The current app does not include:

- Real Firebase upload.
- Firestore writes.
- Storage writes.
- Cloud Functions calls.
- Real Gemini or OpenAI calls.
- StoreKit, subscription, paywall, or quota enforcement.
- Disk persistence, UserDefaults persistence, Core Data, or SwiftData.
- Cloud history.
- Export or save-to-Photos.
- Production Firebase config.
- Real secrets, API keys, Firebase project IDs, private keys, or Apple credentials.

## New Product Direction Summary

The next product direction should make the app feel like a camera product first and an AI/photo-coach product second.

Key direction changes:

- Launch / main experience should become camera-first instead of Home-first.
- The camera viewfinder should be the dominant surface, using roughly 80% of the screen.
- The viewfinder should visually lean toward a 5:4 frame, matching retro / film-photo composition expectations.
- Filter selection should be reachable quickly from the camera surface, with a clear entry near the lower-right area.
- The current filter set is too small. Future work should research and add more popular film, retro camera, and photographer-style color looks.
- AI should eventually move beyond post-capture analysis toward live viewfinder shooting guidance.
- Users should eventually be able to upload reference images so AI can infer and save a custom filter usable in the app.
- Users should eventually be able to generate an improved version of a photo based on their image and AI advice, but this is a later high-cost AI feature and should not be implemented early.

## Phase 11 To Phase 17 Roadmap

### Phase 11: Camera-First UX Redesign

Goal:

- Redesign the app flow so the camera becomes the primary launch / main tab experience.
- Make the viewfinder the largest visual element, roughly 80% of the screen.
- Shape the viewfinder visually toward a 5:4 composition.
- Add a lower-right filter picker entry on the camera surface.
- Keep Photo Picker as a reliable simulator / fallback path.
- Keep mock save, mock AI advice, local session history, History, and Settings working.
- Weaken Home into secondary info / demo guide if needed, without deleting important existing content.

Must not do:

- Do not connect real Firebase.
- Do not add real AI.
- Do not call Cloud Functions.
- Do not add StoreKit, subscription, paywall, or quota enforcement.
- Do not add persistence, export, cloud history, or save-to-Photos.
- Do not expand the filter library beyond what is needed to preserve the existing presets.
- Do not add live AI guidance.
- Do not add AI custom filter generation.
- Do not add AI image generation / editing.
- Do not start Phase 12.

### Phase 12: Filter Research & Preset Schema

Goal:

- Research popular film, retro camera, and photographer-style looks.
- Define a richer filter taxonomy and preset schema before adding many presets.
- Decide how presets should represent color tone, contrast, grain, fade, vignette, warmth, saturation, highlight rolloff, shadow lift, and optional metadata.
- Define naming guidelines that avoid trademark risk from specific film-stock or camera-brand names unless legally safe.
- Define mock/local preset categories and future paid / custom categories without implementing monetization.

Must not do:

- Do not implement expanded filter UI or many new presets yet.
- Do not add StoreKit or paid preset locking.
- Do not add real Firebase or cloud preset sync.
- Do not add AI custom filter generation.
- Do not use external copyrighted LUTs or brand assets without explicit license.
- Do not start Phase 13.

### Phase 13: Expanded Filter Library

Goal:

- Add a broader local Core Image filter library based on the Phase 12 schema.
- Keep filters local-only and deterministic.
- Add enough variety for users to feel that the app is a serious retro camera experience.
- Preserve the existing mock save, mock AI advice, and local history flow.
- Keep presets usable from the camera-first UI.

Must not do:

- Do not add real Firebase.
- Do not add real AI.
- Do not add StoreKit, paid filters, paywall, or quota.
- Do not add cloud preset sync.
- Do not add persistence or export.
- Do not add AI-generated filters.
- Do not start Phase 14.

### Phase 14: Live Camera Guidance Mock UX

Goal:

- Design the live guidance UX as a mock-only overlay on the camera viewfinder.
- Show example composition / pose / lighting hints without real AI or real Vision analysis.
- Define user controls for showing, hiding, and trusting guidance.
- Keep guidance copy short, calm, and camera-friendly.
- Keep the post-capture mock AI advice flow available.

Must not do:

- Do not implement real Vision analysis unless explicitly scoped later.
- Do not call real Gemini, OpenAI, or Cloud Functions.
- Do not upload frames or photos.
- Do not add cost-bearing AI calls.
- Do not add quota enforcement.
- Do not claim guidance is real AI.
- Do not start Phase 15.

### Phase 15: Live Guidance Technical Prototype

Goal:

- Prototype the technical path for live camera guidance.
- Prefer on-device Vision / local heuristics first for framing, brightness, and simple composition cues.
- Keep the prototype isolated, measurable, and reversible.
- Measure frame rate, latency, battery risk, and UI stability.
- Decide whether live guidance can be productized before connecting cloud AI.

Must not do:

- Do not stream live video frames to cloud AI.
- Do not call Gemini Live or OpenAI realtime APIs unless a later explicit real-AI phase approves it.
- Do not add production quota or billing.
- Do not persist analysis output.
- Do not claim production readiness.
- Do not start Phase 16.

### Phase 16: AI Reference-to-Filter

Goal:

- Let users provide a reference image so AI can infer a reusable custom filter recipe.
- Store the output as a controlled filter recipe, not as an opaque external effect.
- Require privacy and AI readiness before any real provider call.
- Keep API keys server-side only.
- Define moderation, consent, provider policy, and cost controls before implementation.

Must not do:

- Do not implement before real AI, privacy, and backend readiness gates are approved.
- Do not put Gemini or OpenAI keys in the iOS app.
- Do not upload reference images without explicit consent and backend controls.
- Do not save reference images or generated recipes to cloud until storage, deletion, and privacy rules are ready.
- Do not add StoreKit quota unless a monetization phase explicitly scopes it.
- Do not start Phase 17.

### Phase 17: AI Enhanced Photo Generation / Edit

Goal:

- Explore generating an improved version of a user's photo based on the original photo and AI suggestions.
- Treat this as a high-cost, high-risk AI image generation / editing feature.
- Require real backend, provider, privacy, moderation, quota, and cost controls before implementation.
- Position this as a later premium feature candidate, not a core mock MVP feature.

Must not do:

- Do not implement during camera-first or filter-library phases.
- Do not call OpenAI, Gemini, or any image generation provider without explicit approval.
- Do not expose API keys in the app.
- Do not add image generation without privacy consent, deletion handling, cost caps, and App Store review.
- Do not claim generated output is production-safe without testing and policy review.

## Before Real Firebase / Real AI / StoreKit

These should be completed before connecting real services:

- Phase 11 camera-first UX redesign.
- Phase 12 filter research and preset schema.
- Phase 13 expanded local filter library.
- Phase 14 live camera guidance mock UX.
- Updated manual demo / smoke coverage for the camera-first flow.
- Clear UI wording for local/mock behavior.
- Small-screen and physical-device camera QA.
- Privacy copy review for any future AI/photo upload path.
- App Store metadata review to avoid claiming unavailable real AI, cloud save, subscription, export, or permanent history.

Rationale:

- The product should first feel strong as a camera experience.
- The filter library should become compelling before monetization or cloud complexity.
- Live guidance should be designed and tested as UX before expensive provider integration.
- Real services should not compensate for a weak camera-first core.

## After Backend / AI / Privacy Readiness

These should wait until backend, AI, and privacy readiness gates are complete:

- Real Firebase Storage upload.
- Real Firestore photo metadata and history.
- Cloud history and sync.
- Account and photo deletion backend.
- Real Cloud Functions AI proxy.
- Real Gemini or OpenAI calls.
- AI reference-to-filter.
- AI enhanced photo generation / edit.
- StoreKit, subscription, paywall, and quota enforcement.
- Persisted custom filters.
- Export or save-to-Photos.

Required readiness gates:

- Confirm Firebase project, bundle ID, App Check plan, rules, and config handling.
- Confirm `GoogleService-Info.plist` handling plan without committing real config.
- Confirm server-side secret handling for AI providers.
- Confirm third-party AI consent copy and privacy policy.
- Confirm deletion, retention, and provider data handling.
- Confirm cost controls, quota, rate limits, and abuse handling.
- Confirm App Store privacy labels and metadata match real data flows.

## Planning Notes

- Phase 11 is the next proposed implementation phase, but it should begin only after its prompt is reviewed and explicitly approved.
- Phase 12 and later should not begin until Phase 11 is reviewed, committed, pushed, and explicitly requested.
- Older roadmap docs may still describe Phase 11 as privacy / deletion. This roadmap intentionally re-scopes Phase 11 to Camera-First UX Redesign based on the latest product direction.
