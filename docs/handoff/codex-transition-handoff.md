# Codex Transition Handoff - 2026-06

This document is the working handoff note for a temporary Codex to Codex API transition in June 2026.

It is intentionally documentation-only. It should not be treated as permission to start a new phase, connect real AI, add backend code, upload images, or change app behavior.

---

## 1. Purpose

- This file exists because the current Codex credit may be exhausted and work may temporarily continue through a Codex API login.
- Work should continue on the same Mac, the same local repository, and the same branch unless the user explicitly says otherwise.
- The expected return date to the original Codex flow is June 15, 2026.
- On June 15, 2026, the Codex API session should update this file with a handback note so the original Codex can resume without relying on lost chat history.
- This document is a handoff / handback anchor, not an implementation prompt.

---

## 2. Repo / Environment

- Repo name: `ai-support-retro-camera-ios`
- GitHub repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- The user normally uses GitHub Desktop for commit / push.
- Codex should not auto commit or push unless the user explicitly requests it.

Normal working flow:

1. ChatGPT generates a phase prompt.
2. Codex implements the requested phase.
3. The user reviews in Xcode / Simulator.
4. Codex performs closeout docs/tests updates.
5. The user commits and pushes in GitHub Desktop, unless they explicitly ask Codex to commit/push.
6. Codex performs read-only confirmation.

---

## 3. Current Confirmed Status

Local repository check at the time this handoff was originally created:

- Branch: `feat/phase-02-auth`
- Latest local commit observed: `7479a10 feat: add AI filter generator mock`
- Working tree observed clean before this documentation-only handoff began.
- Local checkout confirms Phase 16E, Phase 16F, and Phase 16G history.
- The user-provided handoff request said Phase 16H was completed, committed, pushed, and read-only confirmed. The local checkout did not show a Phase 16H commit or `docs/research/post-capture-ai-photo-advisor-ux-research.md` at handoff creation time.

Phase 16H-Recovery status fix:

- A new Codex read-only onboarding confirmed the mismatch: this handoff mentioned Phase 16H before the Phase 16H research doc existed in the repo / origin branch.
- Phase 16H-Recovery added the missing `docs/research/post-capture-ai-photo-advisor-ux-research.md` research backfill and corrected this handoff state.
- Repo documents are the source of truth. Do not rely on earlier chat memory or user-stated phase status when it conflicts with committed / local repo files.
- This recovery is documentation-only. It does not add Swift feature implementation, real AI, backend code, network calls, upload, persistence, export, provider SDKs, or secrets.

Confirmed locally:

- Phase 16E - Static Pose Overlay MVP
- Phase 16F - AI Filter Generator + Cloud AI Architecture Research Backfill
- Phase 16G - AI Filter Generator Mock in Inspiration
- Phase 16H-Recovery - Post-capture AI Advisor UX Research Backfill + Handoff Status Fix
- Phase 16I - Mock Post-capture AI Advisor UX + R1/R2 refinements
- Phase 16N - Future AI / Premium Feature Policy Backfill
- Phase 16O - Save Local On-device Camera Coach + LiDAR Research

Phase 16G status:

- Inspiration / 靈感 tab has a Filter Lab / 生成我的濾鏡 entry.
- The mock flow can choose a reference image or use a mock fallback.
- Mock analyzing state is present.
- Generated filter result card is present.
- Structured mock recipe model is present.
- Validator / clamp helper is present.
- Preview / intensity slider are present.
- Apply mock generated filter action is session-only.
- No upload.
- No persistence.
- No real AI, backend, or network.

Phase 16H-Recovery status:

- Added Post-capture AI Photo Advisor UX research backfill.
- Documentation-only.
- Corrected the earlier handoff mismatch where Phase 16H was referenced before its research doc existed locally.
- No Swift source changes or app behavior changes.
- No real AI, backend, network, upload, persistence, export, API keys, provider SDKs, or secrets.
- Future implementation should start with mock UX before real cloud.

---

## 4. Completed Phase Summary

Important completed route so far:

- Phase 11 - Camera-first UX redesign.
- Phase 12B - Filter preset schema + Batch 1.
- Phase 13 - Expanded 20 filter library.
- Phase 14 - Live guidance mock UX.
- Phase 15 - Local guidance provider scaffold.
- Phase 15B - Brightness guidance.
- Phase 15C - Face framing / headroom guidance.
- Phase 15D - Guidance stability / priority / anti-flicker.
- Phase 16 - Mock-only AI Snapshot boundary.
- Phase 16A-R - Native camera fullscreen UX rescue.
- Phase 16C - AI feature definition + prompt contract.
- Phase 16D - Pose Overlay research backfill.
- Phase 16E - Static Pose Overlay MVP.
- Phase 16F - AI Filter Generator + Cloud AI Architecture research backfill.
- Phase 16G - AI Filter Generator Mock in Inspiration.
- Phase 16H-Recovery - Post-capture AI Advisor UX research backfill + handoff status fix.
- Phase 16I - Mock Post-capture AI Advisor UX + R1/R2 refinements.
- Phase 16N - Future AI / Premium Feature Policy Backfill.
- Phase 16O - Local On-device Camera Coach + LiDAR Scene Understanding research save.

This list is a short orientation map only. Use `docs/phase-log.md` as the detailed source of truth.

---

## 5. Important Product Direction

- The app is an iOS camera-first retro photo app, similar in direction to Dazz / retro camera apps.
- Camera tab should remain fullscreen and native-camera-like.
- Camera should not become a scroll page.
- Shutter must always be visible and tappable.
- Inspiration tab carries import photo, AI Filter Generator, and future AI inspiration flows.
- History and Settings tabs should remain.
- AI direction is assistant-like: photography coach, style advisor, filter recommender, inspiration engine.
- AI should not become the main chat entry point.
- Pose Overlay is currently placeholder artwork. A later dedicated phase can improve pose artwork, assets, and gallery quality.
- AI Filter Generator is currently mock-only.
- Post-capture AI Photo Advisor should start with mock UX before real cloud.

---

## 6. Hard Restrictions

Do not do any of the following unless the user explicitly requests it:

- No Phase 17.
- No real AI.
- No Gemini Live.
- No live video streaming.
- No WebSocket.
- No URLSession / URLRequest.
- No Firebase / Gemini / OpenAI / StoreKit imports.
- No API keys / Firebase config / secrets.
- No `GoogleService-Info.plist`.
- No `.env`.
- No `.firebaserc`.
- No backend changes.
- No real upload.
- No reference image upload.
- No raw photo / frame persistence.
- No request payload logging.
- No UserDefaults / Core Data / SwiftData persistence.
- No save-to-Photos / export.
- No StoreKit / premium / credits.
- No face recognition / identity inference.
- No gender / age / emotion / sensitive attribute inference.

---

## Codex API Period Update - 2026-06-11

This update records work completed by the new Codex / Codex API session after the original transition handoff was created. Repo docs remain the source of truth.

### Current Branch / Repo State

- Repo: `ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Branch: `feat/phase-02-auth`
- Upstream: `origin/feat/phase-02-auth`
- Latest commit: `76b1943 feat: add mock post-capture photo advisor UX`
- Git status at Phase 16J start: clean
- Local branch synced with origin at Phase 16J start: yes (`git rev-list --left-right --count @{u}...HEAD` returned `0 0`)
- User workflow remains GitHub Desktop commit / push unless Codex is explicitly asked to commit or push.

### Work Completed During Codex API Period

#### Phase 16H-Recovery

- Recovered the missing Post-capture AI Photo Advisor UX research doc.
- Added `docs/research/post-capture-ai-photo-advisor-ux-research.md`.
- Corrected the handoff mismatch where Phase 16H appeared in this file before its research doc existed in the repo.
- Documentation-only.
- No Swift source changes.
- No real AI, backend, network, upload, persistence, export, provider SDKs, API keys, or secrets.

#### Phase 16I - Mock Post-capture AI Advisor UX

- Added mock Post-capture AI Photo Advisor UX.
- Added typed PhotoAdvisor models.
- Added `PhotoAdvisorService` protocol.
- Added `MockPhotoAdvisorService` and mock fixtures.
- Added validator / fallback handling.
- Integrated compact advisor access into imported / selected photo flow.
- Recommended filters only use the existing 20-filter catalog.
- No score UI and no beauty / attractiveness wording.
- No real AI, backend, upload, persistence, export, provider SDKs, API keys, or secrets.

#### Phase 16I-R1

- Added and user accepted floating advisor + filter grid for selected-photo UX.
- Reduced selected-photo scroll friction across varied image aspect ratios.
- Floating filter grid can apply an existing filter and auto-dismiss.
- AI advisor is accessible through the floating bar.
- Preserved mock-only, local-only boundaries.

#### Phase 16I-R2

- Cleaned duplicate inline selected-photo AI / filter sections now covered by the floating bar.
- Fixed `返回相機` to switch to the outer Camera tab instead of nesting `CameraView` inside Inspiration.
- Fixed `清除` to clear selected photo and return to Inspiration state.
- Hardened Filter Lab layout for square, portrait, landscape, wide, tall, and placeholder images.
- Removed or hid the free / unknown-user default large mock cloud save / mock save card from selected-photo result.
- Documented cloud save, paid-user cloud save, and free local lossless download as future dedicated entitlement / export phase work.
- No StoreKit, cloud save, local download, save-to-Photos, export, real AI, backend, network, upload, or persistence.

### Current Accepted App Status

- Camera fullscreen native-camera-like layout remains preserved.
- Shutter remains visible and tappable.
- Pose Overlay MVP still works.
- AI Snapshot compact control still works.
- Filter Lab mock still works.
- Mock Post-capture Advisor UX is accepted.
- Floating bar is accepted.
- Selected-photo navigation is accepted.
- Filter Lab layout hardening is accepted.
- Inspiration / History / Settings still work.

### Current Hard Restrictions Still Active

- No Phase 17 unless explicitly requested.
- No real AI.
- No Gemini Live.
- No live video streaming.
- No WebSocket.
- No URLSession / URLRequest.
- No Firebase / Gemini / OpenAI / StoreKit imports.
- No API keys / config / secrets.
- No `GoogleService-Info.plist`.
- No `.env`.
- No `.firebaserc`.
- No backend changes.
- No real upload.
- No reference image upload.
- No raw photo / frame persistence.
- No AI response persistence.
- No request payload logging.
- No UserDefaults / Core Data / SwiftData persistence.
- No save-to-Photos / export.
- No StoreKit / premium / credits.
- No face recognition / identity inference.
- No gender / age / emotion / sensitive attribute inference.

### Known TODOs

- Pose overlay artwork is still placeholder / visually rough.
- Filter Generator is mock-only.
- Post-capture Photo Advisor is mock-only.
- Future local heuristic advisor / filter recommendation may be added before real cloud if explicitly requested.
- Future real cloud advisor requires backend boundary first.
- Cloud save, paid-user cloud save, and free local lossless download require a dedicated entitlement / export phase.
- No StoreKit / export yet.
- No real backend endpoint yet.
- No Gemini Live yet.
- Phase 16N added `docs/product/future-ai-premium-feature-policy.md` as the source of truth for future AI, local intelligence, premium features, cloud save, high-quality transfer, AI image editing, Filter Lab free / paid rules, advanced retro effects, Hong Kong / 麻煩友 language mode, AI wording, feature matrix, and research backlog.
- Before implementing any paid, cloud, export, transfer, AI-edit, local-model, LiDAR, or profanity-language feature, read the Phase 16N policy doc and create a dedicated research / implementation phase.
- Phase 16O added `docs/research/local-on-device-camera-coach-lidar-research.md`.
- Local On-device Camera Coach + LiDAR research is now saved in the repo.
- Future local guidance architecture work should read this research before changing coach / guidance providers.
- Do not jump to live cloud AI for pre-capture / in-capture guidance.
- Future LC2 may be Local Coach Architecture Refactor.
- LiDAR should remain a later dedicated prototype, not the next implementation.
- Core ML should wait for dataset, label, evaluation, device, battery, and thermal strategy.

### Next Recommended Phase Options

Do not jump to Phase 17 / real AI yet. Do not implement cloud save / StoreKit without an explicit phase. Do not implement local export / download without dedicated planning. Use `docs/product/future-ai-premium-feature-policy.md` before scoping any paid / cloud / export / AI-edit feature.

Option A - Phase 16K: Local Heuristic Advisor / Filter Recommendation Prototype

- Local-only.
- No upload.
- Use existing image / selected filter / brightness bucket / simple signals.
- Improve mock advisor recommendations.
- Still no backend.

Option B - Phase 16L: Polish Selected Photo / Inspiration UX

- Improve UI polish.
- Reduce visual clutter.
- Improve card hierarchy.
- No new AI.

Option C - Phase 16M: Export / Local Lossless Download Planning Research

- Documentation-only first.
- Relevant because the user mentioned free users may later get local lossless download.
- No implementation yet.
- No save-to-Photos / export until a dedicated phase.

### 2026-06-15 Handback Update Draft

Do not fill fake future data. Complete this section on or near the handback date if the original Codex is resuming.

```md
## 2026-06-15 Handback Update

- Date:
- Updated by:
- Branch:
- Latest commit:
- Git status:
- Phases completed during Codex API period:
- Files changed:
- Manual verification:
- Known issues:
- Restrictions check:
- Next recommended phase:
- Ready for original Codex to continue: yes/no
```

---

## 7. Current AI Roadmap Recommendation

### Short-term next recommended phase

Do not jump to Phase 17 / real AI yet. The next phase should be one of the Phase 16 continuation options above unless the user explicitly requests otherwise.

Suggested next options:

- Phase 16K - Local Heuristic Advisor / Filter Recommendation Prototype.
- Phase 16L - Polish Selected Photo / Inspiration UX.
- Phase 16M - Export / Local Lossless Download Planning Research.

Previously completed:

- Phase 16I - Mock Post-capture AI Advisor UX + R1/R2 refinements.

Completed Phase 16I scope:

- Add a mock advisor result card after imported / captured photo.
- Use mock fixtures.
- Recommend existing 20 filters only.
- Add apply recommended filter CTA.
- Add retake / crop advice.
- No real AI.
- No upload.
- No persistence.
- No backend.

### Later phases

- Phase 16J - Improve integration between Post-capture Advisor and Inspiration import flow.
- Phase 16K - Local heuristic advisor / filter recommendation, if desired.
- Phase 17A - Backend boundary skeleton only, not real provider first.
- Phase 17B / 17C - Remote CloudAIService and real provider only after backend boundary is ready.

Roadmap guardrails:

- Do not implement cloud save / StoreKit without an explicit phase.
- Do not implement local export / download without dedicated planning.
- Do not jump directly to Gemini Live.
- Do not jump directly to AI Filter Generator real cloud.
- First real AI endpoint should likely be `/v1/ai/photo-advisor`, after backend boundary work is in place.

---

## 8. Key Research Docs

Important docs already added or expected in this roadmap:

- `docs/product/future-ai-premium-feature-policy.md`
- `docs/research/local-on-device-camera-coach-lidar-research.md`
- `docs/research/pose-overlay-camera-guide-research.md`
- `docs/research/ai-filter-generator-research.md`
- `docs/research/cloud-ai-architecture-research.md`
- `docs/research/post-capture-ai-photo-advisor-ux-research.md`
- `docs/ai-feature-definition-and-prompt-contract.md`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`

---

## 9. Known TODOs

- Pose overlay artwork is placeholder / visually rough.
- Future pose phase should replace placeholder with proper original PDF/vector assets.
- Filter Generator is mock-only; future F2 can add local heuristic extractor.
- Filter Generator should not use cloud until backend boundary exists.
- Post-capture Advisor mock UX is implemented and accepted; it remains mock-only.
- Future local heuristic advisor / filter recommendation may be added before real cloud if explicitly requested.
- Real cloud AI requires backend boundary, structured schema, explicit consent, quota guard, and validation.
- Cloud save, paid-user cloud save, and free local lossless download require a dedicated entitlement / export phase.
- No StoreKit / export yet.
- No LUT yet.
- No custom filter persistence yet.
- No real cloud AI endpoint yet.
- No Gemini Live yet.
- Future paid / cloud / export / AI-edit / transfer / LiDAR / language-mode work must follow `docs/product/future-ai-premium-feature-policy.md`.
- Future local camera coach / LiDAR / Core ML work must also follow `docs/research/local-on-device-camera-coach-lidar-research.md`.
- Local camera coach architecture refactor is a safer future implementation candidate than live cloud AI.

---

## 2026-06-15 Handback Protocol

When work returns to the original Codex on June 15, 2026, the Codex API session should update this file with:

- Date.
- Which phases were completed during the Codex API period.
- Latest commit hash.
- Current branch.
- Whether git status is clean.
- Uncommitted files, if any.
- Important new / modified files.
- Manual Xcode / Simulator verification results.
- Known issues.
- Next recommended phase.
- Whether any restriction-risk exists.
- Whether changes were pushed to origin.
- Whether read-only confirmation is needed.

Use this template:

```md
## 2026-06-15 Handback Update

- Date:
- Updated by:
- Branch:
- Latest commit:
- Git status:
- Phases completed during Codex API period:
- Files changed:
- Manual verification:
- Known issues:
- Restrictions check:
- Next recommended phase:
- Ready for original Codex to continue: yes/no
```

---

## 11. How Future Codex Should Use This File

- Start by reading this handoff file.
- Then read `docs/phase-log.md`.
- Then read the relevant research doc for the requested phase.
- Do not rely only on chat memory.
- After each phase, update `docs/phase-log.md`; update this handoff too if there is a major state change during the transition period.
- If anything is unclear, ask the user before starting Phase 17, backend work, real AI, upload, persistence, StoreKit, or provider integration.
