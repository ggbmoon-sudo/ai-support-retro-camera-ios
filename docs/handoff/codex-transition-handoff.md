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

Latest Phase 18 handoff refresh check on 2026-06-14:

- Branch: `feat/phase-02-auth`.
- `git status --short` was clean before this handoff refresh edit.
- `origin/main` may not exist in this clone; use upstream shorthand commands such as `git log --oneline @{u}..HEAD` and `git rev-list --left-right --count @{u}...HEAD`.
- `git log --oneline @{u}..HEAD` showed one local-only commit: `a9b386b hase 18-B4-pre: consolidate Codex project rules`.
- `git rev-list --left-right --count @{u}...HEAD` showed `0 1`, meaning the branch was 0 behind and 1 ahead of its configured upstream.
- Phase 18-B2 is upstream-synced / pushed according to the latest upstream comparison.
- Phase 18-B3 is upstream-synced / pushed according to the latest upstream comparison.
- Phase 18-B4-pre is completed and locally committed, but not pushed at the time of this handoff refresh. Note the local commit message appears to have a typo: `hase 18-B4-pre: consolidate Codex project rules`.
- This handoff refresh itself is documentation-only and should be committed separately if accepted.

Confirmed locally:

- Phase 16E - Static Pose Overlay MVP
- Phase 16F - AI Filter Generator + Cloud AI Architecture Research Backfill
- Phase 16G - AI Filter Generator Mock in Inspiration
- Phase 16H-Recovery - Post-capture AI Advisor UX Research Backfill + Handoff Status Fix
- Phase 16I - Mock Post-capture AI Advisor UX + R1/R2 refinements
- Phase 16N - Future AI / Premium Feature Policy Backfill
- Phase 16O - Save Local On-device Camera Coach + LiDAR Research
- Phase 16P - Save Encrypted App-to-App Photo Transfer Research
- Phase 16Q - Save Paid AI Image Editing / 改圖師 Research
- Phase 16R - Save Hong Kong / 麻煩友 Language Mode Research
- Phase 16S - Save HK2 Hong Kong / 麻煩友 Copy System + Safety Style Guide
- Phase 16T / HK3 - Mock Language Mode UI

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
- Phase 16P - Encrypted App-to-App High Quality / Lossless Photo Transfer research save.
- Phase 16Q - Paid AI Image Editing / 改圖師 research save.
- Phase 16R - Hong Kong / 麻煩友 Language Mode UX + Safety research save.
- Phase 16S - HK2 Hong Kong / 麻煩友 Copy System + Safety Style Guide save.
- Phase 16T / HK3 - Settings-only mock Language / Tone UI.
- Phase 16T-R1 / HK3 - simplified Settings mock UI to language-only buttons.
- Phase 16T-R2 / HK3 - hid production-visible mock preview cards from Settings.
- Phase 16U / HK4 - deterministic Local Camera Coach copy resolver scaffold / neutral runtime integration.
- Phase 16V - persistent Language / Tone settings + Local Camera Coach runtime integration.
- Phase 16W - extended persisted Language / Tone preference to mock/local Post-capture Photo Advisor copy.
- Phase 16W-R2 - Camera local-only AI surface cleanup.
- Phase 16X - Inspiration AI Hub cleanup.
- Phase 17A - Real Cloud AI Backend Boundary Skeleton.
- Phase 17B - Debug-only Remote CloudAIService Wiring.
- Phase 17C-Prep - Provider Readiness + Schema Hardening.
- Phase 17C - Gemini Photo Advisor Internal Beta.

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
- Phase 16P added `docs/research/encrypted-app-to-app-photo-transfer-research.md`.
- Encrypted app-to-app high-quality / lossless photo transfer research is now saved in the repo.
- Future implementation must use this research before any export, transfer, StoreKit, entitlement, backend, signed URL, Universal Link, cloud storage, or CryptoKit work.
- Do not jump directly to encrypted transfer backend.
- The next safe step, if explicitly requested, may be local high-quality export renderer planning / prototype.
- StoreKit, entitlement, backend, storage, abuse controls, and privacy policy are required before real paid transfer.
- Encrypted transfer, cloud storage, CryptoKit prototype, Universal Links, signed URLs, QR code, and receiver flow remain future dedicated phases.
- Phase 16Q added `docs/research/paid-ai-image-editing-research.md`.
- Paid AI Image Editing / 改圖師 research is now saved in the repo.
- Future implementation must use this research before any image editing, provider adapter, backend, StoreKit, entitlement, upload, prompt guard, quota, moderation, or provider integration work.
- Do not jump directly to real provider integration.
- The next safe step, if explicitly requested, may be mock image editing UX only.
- Prompt guard must be designed before provider integration.
- StoreKit, entitlement, backend, privacy policy, retention policy, safety policy, quota, and cost guard are required before real paid image editing.
- OpenAI / Gemini / Stability provider integration remains a future dedicated phase.
- Phase 16R added `docs/research/hong-kong-troublemaker-language-mode-research.md`.
- Hong Kong / 麻煩友 Language Mode UX + Safety research is now saved in the repo.
- Future implementation must use this research before any language mode, copy resolver, profanity, localization runtime, Settings UI, copy system, or QA policy work.
- Do not jump directly to explicit profanity mode.
- Do not use LLM-generated live camera copy.
- The next safe step, if explicitly requested, may be HK2 Copy System / Style Guide documentation.
- Runtime integration should wait until copy system, banned phrase list, and QA policy are documented.
- Explicit profanity mode requires separate review, App Store / age rating consideration, explicit opt-in, and manual QA.
- Phase 16S added `docs/product/hk-troublemaker-copy-system-style-guide.md`.
- HK2 Copy System + Safety Style Guide is now saved in the repo.
- Future implementation must use this guide before any language mode, copy resolver, profanity, localization runtime, Settings UI, deterministic template integration, or QA policy work.
- Do not jump directly to explicit profanity mode.
- Do not use LLM-generated live camera copy.
- The next safe step, if explicitly requested, may be HK3 Mock Language Mode UI.
- Runtime deterministic template integration should wait until mock UI and copy resolver phases are explicitly approved.
- Explicit profanity mode requires separate review, App Store / age rating consideration, explicit opt-in, and manual QA.
- Phase 16T / HK3 added a Settings-only mock Language / Tone preview UI.
- Phase 16T-R1 simplified the mock Settings UI so only language buttons are shown.
- Phase 16T-R2 hides the mock preview cards from the production Settings UI.
- Language / Tone remains a Settings-only mock selection with English, Traditional Chinese, Simplified Chinese, and Cantonese buttons.
- Preview examples are removed from production UI.
- Cantonese keeps a short safety notice; 麻煩友 / explicit direction remains safety-reviewed future work.
- Future runtime integration is still not implemented.
- App-wide language switching is not implemented.
- Runtime copy resolver is not implemented.
- Explicit mode is not runtime-enabled and no production-visible explicit phrase example is shown.
- The next safe step, if explicitly requested after user acceptance, may be HK4 deterministic template integration.
- Phase 16U / HK4 added a deterministic Local Camera Coach copy resolver.
- Runtime integration is limited to Local Camera Coach copy only.
- Runtime Local Camera Coach uses neutral default tone; Settings Language / Tone remains mock-only and non-persistent.
- No explicit profanity runtime was added.
- No AI-generated copy was added.
- App-wide language switching remains not implemented.
- Runtime copy resolver persistence remains not implemented.
- Future HK5 may consider Settings persistence / formal language mode only if explicitly requested.
- Explicit profanity remains future review-only.
- Do not jump directly to explicit profanity mode.
- Do not use LLM-generated live camera copy.
- Runtime deterministic template integration should wait for an explicit phase and must not write to persistence without approval.
- Phase 16V added persisted Language / Tone preference and connected it to Local Camera Coach runtime only.
- Persistence is limited to `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- English, Traditional Chinese, and Simplified Chinese use neutral deterministic camera coach copy.
- Cantonese can use Hong Kong conversational or non-explicit 麻煩友 camera coach copy.
- Explicit profanity remains disabled / unsupported in runtime and unavailable from Settings.
- App-wide language switching remains not implemented.
- Photo Advisor, Filter Lab, 改圖師 / image editing, AI Snapshot, History, and Inspiration runtime copy remain unchanged.
- Future expansion of the resolver to Photo Advisor or other surfaces requires separate explicit approval.
- Phase 16W connected the persisted Language / Tone setting to mock/local Post-capture Photo Advisor copy.
- Runtime scope now includes Local Camera Coach and Photo Advisor only.
- Photo Advisor supports English, Traditional Chinese, Simplified Chinese, Cantonese HK conversational, and Cantonese non-explicit 麻煩友 copy.
- Explicit profanity remains future-only and is not output by Photo Advisor.
- Filter Lab, 改圖師 / image editing, AI Snapshot, Cloud AI, History persistence, and backend remain unchanged.
- Future phases may expand labels / localization polish or Filter Lab copy only if explicitly requested.
- Phase 16W-R2 makes Camera a local-only AI guidance surface.
- Camera AI Snapshot / cloud-style quick advice entry is hidden / removed from Camera UI.
- Local Camera Coach remains visible on Camera and follows persisted Language / Tone preference.
- Cloud-style AI Advisor / Photo Advisor remains in Inspiration / imported / selected photo flows.
- Future Phase 17 real cloud AI should target Inspiration / Photo Advisor first, not Camera tab.
- Phase 16X organizes Inspiration as the future AI Hub / creative hub.
- Inspiration now groups import photo analysis, Photo Advisor orientation, Filter Lab mock, future Photo Edit placeholder, and future cloud AI consent/no-background-upload notice.
- Filter Lab remains mock/local.
- Photo Edit / 改圖師 remains disabled future placeholder only.
- Phase 17A started as a provider-disabled boundary skeleton.
- iOS now has CloudAIService protocol / models / validator / mock service / disabled remote skeleton / consent view / image compression scaffold.
- A `backend/` boundary exists with `GET /health` and `POST /v1/ai/photo-advisor`.
- The first future real endpoint target remains `POST /v1/ai/photo-advisor`.
- iOS defaults to mock/local behavior; existing Photo Advisor remains mock/local by default.
- Backend mock endpoint does not call a provider, does not require provider keys, does not persist images, and must not log request payloads.
- Camera remains local-only; no Camera cloud AI entry has been reintroduced.
- Phase 17B adds DEBUG-only remote chain testing for the local backend mock `/v1/ai/photo-advisor` endpoint.
- `RemoteCloudAIService` remains disabled by default.
- The DEBUG-only remote path requires consent, compresses / re-encodes the image, validates the structured response, and falls back to local/mock advice on failure.
- Phase 17C-Prep hardens the backend boundary before any real provider work.
- Provider adapter boundary now exists.
- Backend request / response validation now includes stricter schema, consent, JPEG, base64, filter whitelist, unsafe text, standard fallback, and error-code checks.
- Rate-limit, quota, timeout, redaction / no-payload logging helpers, and test fixtures are in place as placeholders.
- Phase 17C introduces the first real provider internal beta for Photo Advisor only.
- Backend provider path can use QweAPI internal mode only when `ALLOW_INTERNAL_CLOUD_AI=true`, `CLOUD_AI_PROVIDER_MODE=qweInternal`, internal debug guard passes, server-side `QWE_API_KEY` exists, `QWE_BASE_URL=https://qweapi.com`, and `QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview`.
- Phase 17C-R0 Code0 gateway verification did not produce a successful provider response, so it remains a previous attempted route rather than active config.
- Phase 17C-R1 switches the active backend provider contract to QweAPI OpenAI-compatible chat completions at `https://qweapi.com/v1/chat/completions`, keeps `Authorization: Bearer` server-side, and adds a safe text-only provider probe script.
- Local internal verification confirms the QweAPI text-only probe succeeds, and the `gemini-3.1-flash-image-preview` OpenAI-compatible `image_url` request returns a validated `source=cloud` response in internal testing.
- Phase 17C-R2 adds a backend provider QA batch workflow for QweAPI / `gemini-3.1-flash-image-preview`, including sanitized latency / schema / safety / fallback reporting and prompt tuning for shorter, practical Photo Advisor output.
- Generated QA reports live under ignored `backend/reports/provider-qa/`; local QA images live under ignored `backend/tests/local-images/`.
- Initial R2 QA batch with the built-in tiny JPEG smoke image across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK` produced 4 cases, 3 cloud successes, 1 fallback, 0 schema failures, 0 safety failures, 0 invalid filter IDs, average latency 15429 ms, p50 6606 ms, and p95 34403 ms.
- Phase 17C-R3 generated five ignored synthetic local QA JPEGs and ran 20 cases across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK`.
- R3 final QA metrics: 17 cloud successes, 3 fallbacks, fallback reasons 2 `unsafe_response` and 1 `provider_timeout`, average latency 9963 ms, p50 4657 ms, p95 35803 ms, max 44980 ms, 0 schema failures, 0 safety metadata failures, and 0 invalid filter IDs.
- R3 added `maxLatencyMs`, `fallbackByCode`, AppleDouble image ignore hardening, and a sanitized manual review template.
- Phase 17C-R4 hardens provider QA reporting with p90 / p95 / max latency, timeout count, unsafe-response count, normalized fallback categories, per-case latency buckets, per-case fallback categories, and a `latencyAssessment` recommendation for debug QA / internal testing / production readiness.
- R4 centralizes QA latency thresholds in `backend/src/qa/photoAdvisorQAConfig.mjs` for measurement only; it does not raise provider timeouts to hide slow cases.
- R4 expands `backend/tests/local-images/manual-review-template.json` for fixture name, locale, provider status, fallback code, latency bucket, language naturalness, filter recommendation fit, crop / framing usefulness, safety concern, and notes.
- R4 real-provider QA run produced 20 cases, 18 cloud successes, 2 `unsafe_response` fallbacks, average latency 4969 ms, p50 4958 ms, p90 5421 ms, p95 5894 ms, max 6778 ms, 0 timeouts, 0 schema failures, 0 safety metadata failures, and 0 invalid filter IDs.
- Phase 17C-R5 tightens the provider prompt to allowed photo-only topics, adds safe unsafe diagnostic labels, extends QA reports with `unsafeByCategory` / per-case `unsafeCategory`, and adds an ignored approved-real-sample workflow under `backend/tests/approved-real-samples/`.
- R5 QA script supports `--image-set=synthetic`, `--image-set=approved-real`, and `--image-set=all`; it warns about and ignores macOS `._*.jpg` resource-fork files.
- R5 real-provider synthetic QA run produced 20 cases, 19 cloud successes, 1 `provider_invalid_json` fallback, 0 `unsafe_response` fallbacks, average latency 6130 ms, p50 4842 ms, p90 5837 ms, p95 9637 ms, max 24372 ms, 0 timeouts, 0 schema failures, 0 safety metadata failures, and 0 invalid filter IDs.
- Phase 17D-A adds a local-only Camera Capture Context model and snapshot path for captured / imported photos.
- Capture context is summarized and bucketed; it does not collect GPS/location, raw EXIF dumps, raw photo data, continuous motion logs, face/skin/identity data, or sensitive personal inference.
- Mock/local Photo Advisor now treats blur, low light, tilt, grain, soft focus, high contrast, and unusual framing as possible intentional retro style instead of automatic mistakes.
- Phase 17D-A does not upload capture context to backend and does not change backend provider request payloads.
- Advisor retake/crop wording remains optional and intent-aware; retake is not defaulted for creative signals.
- Manual language review, approved real sample review, filter / crop usefulness review, and repeated unsafe-response validation are production rollout blockers; next work should review provider quality and approved sample-image QA, not production rollout.
- iOS must not contain a QweAPI key or direct QweAPI base URL call.
- Default provider mode remains mock.
- iOS default remains mock/local and provider-key-free.
- Camera remains local-only.
- This is not production rollout.

### Next Recommended Phase Options

Do not jump to production rollout. Do not implement cloud save / StoreKit without an explicit phase. Do not implement local export / download without dedicated planning. Use `docs/product/future-ai-premium-feature-policy.md` before scoping any paid / cloud / export / AI-edit feature.

Option 0 - Phase 17B: RemoteCloudAIService Internal Debug Wiring Only

- Completed as debug-only wiring.
- Keep disabled by default.
- Keep mock fallback and consent.
- Do not turn it into production remote without a separate phase.

Option 1 - Phase 17C-R1: Gemini Internal Beta Latency / Provider QA

- Tune latency, prompt quality, provider errors, retry behavior, and fallback UX for internal testing only.
- Keep Camera local-only.
- Keep iOS provider-key-free.
- Do not production-enable remote Cloud AI.
- No Gemini Live / streaming.
- No Camera cloud AI entry.

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

Phase 17C adds a backend-only Gemini Photo Advisor internal beta. Do not jump to production rollout without explicit approval, QA, cost guard, monitoring, abuse controls, and provider policy review.

Suggested next options:

- Phase 17C-R1 follow-up - QweAPI model / image payload compatibility QA; do not treat real Photo Advisor image success as complete until image smoke returns a validated `source=cloud` response.
- Phase 17D - Production rollout planning only after explicit approval, secret management hardening, provider policy review, cost guard, timeout, moderation, and validation checks.
- Phase 16M - Export / Local Lossless Download Planning Research, if product planning returns to export.

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
- Phase 17B - Debug-only RemoteCloudAIService wiring to backend mock endpoint.
- Phase 17C-Prep - Provider readiness and schema hardening, still mock/provider-disabled.
- Phase 17C - Gemini Photo Advisor internal beta only.
- Phase 17D - Production rollout only after explicit approval.

Roadmap guardrails:

- Do not implement cloud save / StoreKit without an explicit phase.
- Do not implement local export / download without dedicated planning.
- Do not jump directly to Gemini Live.
- Do not jump directly to AI Filter Generator real cloud.
- First real AI endpoint should likely be `/v1/ai/photo-advisor`, after backend boundary work is in place.
- Phase 17A has now added the boundary skeleton, but real provider integration is still not approved.
- Phase 17B has now added debug-only remote wiring to the backend mock endpoint, but real provider integration is still not approved.
- Phase 17C-Prep has now added mock-only provider adapter, schema hardening, filter whitelist, unsafe response guard, fallback contract, quota / rate-limit / timeout placeholders, redaction helpers, and fixtures, but real provider integration is still not approved.
- Phase 17C has now added backend-only Gemini Photo Advisor internal beta support. It is disabled by default and gated by server-side secret/config plus internal debug guard; production rollout is still not approved.

---

## 8. Key Research Docs

Important docs already added or expected in this roadmap:

- `docs/product/future-ai-premium-feature-policy.md`
- `docs/research/local-on-device-camera-coach-lidar-research.md`
- `docs/research/encrypted-app-to-app-photo-transfer-research.md`
- `docs/research/paid-ai-image-editing-research.md`
- `docs/research/hong-kong-troublemaker-language-mode-research.md`
- `docs/product/hk-troublemaker-copy-system-style-guide.md`
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
- Phase 17A mock-only `/v1/ai/photo-advisor` backend endpoint skeleton exists; no real cloud AI provider endpoint is connected yet.
- No Gemini Live yet.
- Future paid / cloud / export / AI-edit / transfer / LiDAR / language-mode work must follow `docs/product/future-ai-premium-feature-policy.md`.
- Future local camera coach / LiDAR / Core ML work must also follow `docs/research/local-on-device-camera-coach-lidar-research.md`.
- Local camera coach architecture refactor is a safer future implementation candidate than live cloud AI.
- Future export / encrypted transfer / StoreKit / backend / cloud storage work must also follow `docs/research/encrypted-app-to-app-photo-transfer-research.md`.
- Local high-quality export renderer planning / prototype is a safer future step than encrypted transfer backend.
- Future paid image editing / provider / prompt guard / backend / StoreKit work must also follow `docs/research/paid-ai-image-editing-research.md`.
- Mock image editing UX is a safer future step than real provider integration.
- Future language mode / copy resolver / profanity / localization runtime work must also follow `docs/research/hong-kong-troublemaker-language-mode-research.md`.
- HK2 Copy System / Style Guide documentation is a safer future step than runtime language mode or explicit profanity mode.
- Future language mode / copy resolver / profanity / localization runtime work must now also follow `docs/product/hk-troublemaker-copy-system-style-guide.md`.
- HK3 Mock Language Mode UI is a safer future step than explicit profanity mode or runtime copy resolver.
- Phase 16T / HK3 introduced the Settings language / tone surface. Phase 16T-R1 kept it simpler with language buttons, and Phase 16T-R2 hid mock preview / praise loop / explicit phrase cards from production Settings UI.
- Phase 16U / HK4 added deterministic Local Camera Coach copy resolver scaffolding.
- Phase 16V now persists Language / Tone preference and uses it only for Local Camera Coach runtime copy.
- Phase 16W extends the same persisted preference to mock/local Photo Advisor copy.
- Phase 16W-R2 cleans up Camera so it is a local-only AI surface.
- Runtime scope is now Local Camera Coach plus Photo Advisor only, with Camera exposing Local Camera Coach and Inspiration exposing Photo Advisor.
- Phase 16X organizes Inspiration as the future AI hub; Photo Advisor / future cloud AI should live in Inspiration / selected photo flow.
- Phase 17A adds a provider-disabled Cloud AI backend boundary skeleton.
- Future real cloud AI should use the Phase 17A boundary before any provider work.
- Phase 17B wires `RemoteCloudAIService` behind a DEBUG-only internal path.
- Phase 17C-Prep adds provider readiness and schema hardening while keeping the provider path mock-only.
- Phase 17C adds backend-only QweAPI Photo Advisor internal beta plumbing; current image provider smoke returns a validated `source=cloud` response with `gemini-3.1-flash-image-preview`, while production/default remains mock/local.
- Phase 17C-R2 adds provider QA batch reporting; future provider QA should add real approved sample images locally, review language / caption / filter quality manually, and keep generated reports ignored unless explicitly sanitized for commit.
- Phase 17C-R3 completed a synthetic local image QA pass; future QA should use approved realistic local images, manually review 3-5 outputs, and avoid committing generated reports or real photos.
- Phase 17C-R4 adds provider QA latency / fallback hardening and manual review readiness; future QA should use the expanded report fields and manual review template before changing product rollout status.
- Phase 17C-R5 reduces unsafe-response fallback risk in the latest synthetic QA run and adds the approved-real-sample workflow; future QA should run approved real samples locally without committing photos or reports.
- Phase 17D-A adds local capture context for mock/local advisor intent awareness; future cloud schema expansion for capture context requires a separate explicit phase.
- Phase 17D-B adds the local Capture Intelligence Pack: bucketed level / motion snapshots, local image signal buckets, stronger CreativeIntentGuard, DEBUG-only bucket preview, and intent-aware mock/local advisor behavior. It remains local-only; backend provider payloads are unchanged and capture context is not uploaded.
- Phase 17D-C hardens local capture intelligence lifecycle for real-device QA: scene background / foreground, permission-denied / unavailable paths, selected-photo / import flows, stale motion snapshots, tiny-image analysis fallback, and DEBUG-only bucket preview safety. It remains local-only; backend provider payloads are unchanged and capture context is not uploaded.
- Phase 17D-D adds the real-device manual QA kit and tuning notes for capture intelligence: reviewer checklist, commit-safe result template, ignored local result paths, and optional bright / overexposed advice tuning. It remains local-only; backend provider payloads are unchanged, capture context is not uploaded, and real photos / filled reports / generated QA artifacts must stay ignored unless a future safe-asset policy approves them.
- Phase 18-A0 adds `docs/ai-photo-advisor-language-audit.md`, auditing current Photo Advisor capability coverage, multilingual photography language, gaps, recommended app voice, future real AI language contract, and next phase recommendations. It is documentation-only; backend payloads are unchanged and capture context is still not uploaded.
- Phase 18-A1 implements the first app-side Photo Advisor language pack. Local/mock Photo Advisor now uses structured `advisor.*` keys for mood, visual signals, retro intent, optional crop / straighten / retake wording, imported-photo fallback, provider-unavailable fallback, and filter reasons. Backend payloads are unchanged, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-A2 adds a local Filter Recommendation Reason Library for the mock/local Photo Advisor. Every current app filter maps to a language family, and reasons resolve from filter family + safe photo signal + retro aesthetic result. Backend payloads are unchanged, capture context / filter reason metadata are still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-A3 formalizes CreativeIntentGuard classifications and signal language rules for the local/mock Photo Advisor. Blur, motion, tilt, low light, grain, soft focus, overexposure, underexposure, high contrast, faded color, and unusual framing now pass through typed `style_positive` / `acceptable_imperfection` / `technical_risk` / `unknown` classification before advice selection. Retake advice remains rare, conservative, and optional. Backend payloads are unchanged, capture context / creative-intent metadata are still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-A4 adds a UI-facing Photo Advisor result card language model. The local/mock card now displays a mood headline, one short visual reason, one primary filter recommendation with a reason, one optional refinement, and optional crop / straighten / retake only when appropriate. Production UI does not display provider/source labels, raw JSON, raw localization keys, raw capture context, raw EXIF, numeric confidence, score/rating, or internal classification names. Backend payloads are unchanged, capture context / result-card metadata are still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-A5 adds a multilingual Photo Advisor copy QA / regression kit. The new matrix covers 30 captured / imported / fallback scenarios with English, Traditional Chinese, Cantonese-style, and Simplified Chinese review notes, plus captured-vs-imported, creative-intent, and filter-reason regression rules. The new wrapper script runs the A2/A3/A4 validators and scans UI-facing advisor code/localization for raw keys, provider/debug wording, score/rating language, generic filter copy, harsh fix-it wording, and sensitive inference terms. Backend payloads are unchanged, capture context / QA metadata are still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B0 aligns the backend-mediated Photo Advisor provider language contract with the A1-A5 app language system. `docs/photo-advisor-provider-language-contract.md` records the provider voice contract, CloudAIResponse-to-result-card schema alignment, prompt requirements, validator requirements, fallback contract, and provider QA fixture plan. Backend validation now blocks score/rating language, harsh fix-it / retake-first wording, provider/debug leakage, chain-of-thought wording, and overlong filter reasons. Backend request payloads and iOS upload payloads are unchanged, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B1 adds synthetic backend/provider contract regression fixtures and fallback parity checks for the real-provider Photo Advisor path. `backend/tests/fixtures/provider-contract-regression-cases.json` covers valid app-voice outputs plus invalid JSON, markdown prose, schema failures, unsupported filters, overlong text, score/rating wording, harsh fix-it / retake-first language, sensitive inference, chain-of-thought, provider/debug leakage, raw localization keys, raw filter-family IDs, and provider failure fallbacks. Backend tests now assert these are accepted, rejected, or mapped to safe structured fallback before iOS can display them. Backend request payloads and iOS upload payloads are unchanged, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B2 aligns the real-provider QA runner and sanitized report contract with B0/B1. `backend/scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract` runs committed B1 fixtures without credentials, network, real images, raw prompts, or raw provider responses. Real-provider QA remains explicit internal/debug-only with local QweAPI credentials and internal guard config. Reports are ignored, metadata-only, include validation-category counters and redaction flags, and always keep `productionReady: false`. Backend request payloads and iOS upload payloads are unchanged, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B3 adds the internal real-provider QA dry-run gate. `docs/photo-advisor-provider-qa-dry-run-gate.md` defines pre-run, run, and post-run operator checks; `backend/scripts/run-photo-advisor-provider-qa.mjs --check-safety-gate` prints sanitized gate status; `npm run qa:photo-advisor` now runs safe synthetic-contract QA; real-provider QA requires explicit `--run-provider`. Reports and samples remain ignored, generated artifacts must not be committed, `productionReady` remains false, backend request payloads and iOS upload payloads are unchanged, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B4-pre consolidates recurring project rules into `AGENTS.md`. Future Codex prompts can say "Read AGENTS.md and follow all project rules" to inherit provider-key/direct-call bans, Camera cloud-entry restrictions, capture-context upload restrictions, raw logging/persistence bans, GPS/raw EXIF/sensor persistence bans, sensitive-inference bans, provider QA artifact hygiene, `productionReady=false`, and the Photo Advisor Observation -> Mood -> Retro intent -> Optional action language rule. This phase is docs/instructions only; app behavior, backend provider payloads, iOS upload payloads, capture-context upload, cloud functionality, and production rollout are unchanged.
- Phase 18 handoff refresh records that Phase 18-A0 through Phase 18-A5 are completed and pushed, Phase 18-B0 and Phase 18-B1 are completed and pushed, Phase 18-B2 and Phase 18-B3 are upstream-synced / pushed by the latest upstream comparison, and Phase 18-B4-pre is local-only unless the operator pushes `a9b386b`.
- Phase 18-B4 defines provider QA review thresholds in `docs/photo-advisor-provider-qa-review-thresholds.md`. It classifies synthetic and future real-provider QA as pass / needs-review / blocked categories, defines hard blockers and warning thresholds, records synthetic-contract acceptance and optional real-provider QA acceptance, and keeps `productionReady=false`. This phase is documentation-only; app behavior, backend provider payloads, iOS upload payloads, capture-context upload, cloud functionality, Camera cloud entry, and production rollout are unchanged.
- Phase 18-B5 adds the provider QA gate summary helper. `backend/scripts/check-photo-advisor-provider-qa-gate.mjs` reads only sanitized QA report JSON and outputs `productionReady=false`, `eligibleForDebugInternalReview`, status categories, hard blockers, warnings, and reviewed aggregate metrics. `npm run qa:photo-advisor:review` runs it after synthetic or optional real-provider QA. It does not print raw provider text, raw prompts, raw image/base64, request payloads, secrets, or real sample paths. Backend provider payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-B6 adds the provider QA operator runbook and final pre-integration checklist in `docs/photo-advisor-provider-qa-operator-runbook.md`. It documents the safe command sequence, ignored local credential/sample requirements, optional real-provider QA opt-in rules, QA gate helper output review, stop-immediately conditions, never-commit artifacts, skipped-run reporting, and the final checklist before any future debug/internal remote advisor integration. This is documentation-only; app behavior, backend provider payloads, iOS upload payloads, capture-context upload, cloud functionality, Camera cloud entry, provider credential handling, and production rollout are unchanged.
- Phase 18-B7 adds the final provider QA chain audit and Phase 18-C readiness gate in `docs/photo-advisor-provider-qa-chain-readiness.md`. It confirms B0-B6 are coherent across the provider language contract, regression fixtures, sanitized QA runner/reporting, dry-run gate, thresholds, gate helper, and operator runbook. Phase 18-C may start only as Post-capture Advisor Beta Hardening / internal QA work after backend tests, synthetic QA, dry-run gate, and gate helper pass with no hard blockers. This is documentation-only; app behavior, backend provider payloads, iOS upload payloads, capture-context upload, Camera cloud entry, provider credential handling, and production rollout are unchanged.
- Phase 18-C0 adds the post-capture Advisor beta hardening plan in `docs/photo-advisor-beta-hardening-plan.md`. It defines captured/imported Advisor flow checks, fallback/provider-unavailable UX, local/mock consistency, result-card readability, filter reason quality, CreativeIntentGuard behavior, crop/straighten/retake restraint, multilingual QA, real-device manual QA, regression scripts, beta acceptance criteria, and an internal QA scenario matrix. This is planning-only; app behavior, backend provider payloads, iOS upload payloads, capture-context upload, cloud functionality, Camera cloud entry, provider credential handling, real-provider QA, and production rollout are unchanged.
- Phase 18-C1 polishes the local/mock post-capture Advisor result card. The UI-facing card remains mood-first, shows one visual reason, one primary filter recommendation with a short reason, and at most two optional advice rows. Crop/straighten advice stays ahead of optional retake, keep-style copy can appear as a gentle non-retake secondary note, and missing filter recommendations show a calm unavailable note instead of an unusable apply action. Backend provider payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-C2 hardens the local/mock captured / imported / fallback Advisor QA path. Captured photos may use safe local capture/image context; imported photos keep limited-context copy and must not claim capture-time motion, tilt, exposure, device stability, focus, lens, or camera conditions; fallback results are explicitly marked as fallback; fallback/error copy is calm and avoids mock/internal-result wording; and fallback filters choose from the allowed local catalog when possible. Backend provider payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-C3 polishes multilingual local/mock Advisor copy for beta QA. English, Traditional Chinese, Simplified Chinese, Cantonese-style, and non-explicit 麻煩友 strings were reviewed for short mood-first phrasing, natural imported-photo limited-context wording, calmer fallback/provider-unavailable copy, less visible mock/demo language, and Cantonese-style wording that keeps personality without heavy slang or harsh judgment. Backend provider payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.
- Phase 18-C4 closes the Post-capture Advisor beta hardening track with a readiness audit. Phase 18-C0 through C3 now provide a local/mock Advisor beta QA baseline: mood-first result card, captured/imported/fallback flow rules, multilingual copy baseline, filter reason language, CreativeIntentGuard behavior, and retake restraint are aligned for future architecture planning. This is documentation-only; app/backend runtime behavior, backend provider payloads, iOS upload payloads, capture-context upload, Camera cloud entry, provider credential handling, and production rollout remain unchanged.
- Phase 19-A adds `docs/open-weight-vlm-backend-architecture-adr.md`, a documentation-only architecture ADR for a future self-hosted / open-weight VLM Photo Advisor backend. It compares Qwen2.5-VL-7B, Qwen2-VL-7B, MiniCPM-V, and watchlist candidates; compares Ollama, vLLM, SGLang, and Transformers / FastAPI serving paths; defines a future explicit-consent post-capture backend architecture with metadata stripping, structured PhotoAdvisor JSON, backend validation, and safe fallback; documents non-goals; and recommends prompt/schema tuning first, evaluation dataset next, and LoRA/QLoRA later only with curated, consented, non-sensitive data. This does not add model server code, real-provider QA, cloud functionality, app/backend runtime changes, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider keys/direct model calls, user-photo training, or production rollout.
- Phase 19-B adds `docs/open-weight-vlm-structured-advisor-benchmark-plan.md`, a documentation-only plan for evaluating future open-weight VLMs as structured Photo Advisor backends. It narrows the first benchmark candidates to Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B; compares Transformers/FastAPI, Ollama/LM Studio, vLLM, and SGLang serving roles; defines synthetic/internal benchmark categories; specifies enum/key-based candidate JSON with no final UI prose; assigns backend validator/fallback responsibilities; and records metrics/gates for JSON validity, schema compliance, safety, filter family fit, creative intent preservation, retake restraint, imported-context overclaims, latency, VRAM/model-loading notes, and artifact hygiene. This does not add model server code, real-provider/VLM QA, training/fine-tuning, cloud functionality, app/backend runtime changes, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, user-photo training, or production rollout.
- Phase 19-C adds a backend-only open-weight VLM synthetic benchmark harness skeleton. It introduces `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`, committed synthetic benchmark fixtures, `backend/scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs`, backend tests, and `npm run qa:open-weight-vlm:synthetic`. The harness validates enum/key-based candidate JSON, rejects invalid JSON/schema, unsupported filter families, imported capture-context overclaims, retake false positives, score/rating, sensitive inference, chain-of-thought, and debug/provider leakage, then prints sanitized aggregate metrics only. This does not add model server code, model server URLs, provider/model credentials, real-provider/VLM QA, image upload, network calls, cloud functionality, app integration, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Phase 19-D adds the synthetic gate summary layer for the open-weight VLM benchmark harness. It introduces `backend/src/qa/openWeightVlmBenchmarkGate.mjs`, `backend/scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs`, and `npm run qa:open-weight-vlm:gate`. The helper evaluates sanitized synthetic benchmark metrics, reports hard blockers, status categories, blocked fixture counts, and reviewed metrics, and fails closed for expectation failures, accepted sensitive inference, accepted score/rating, accepted chain-of-thought, accepted debug/provider leakage, accepted imported overclaim, accepted unsupported filter family, network calls, or `productionReady:true`. This does not add model server code, model server URLs, provider/model credentials, real-provider/VLM QA, image upload, network calls, cloud functionality, app integration, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Phase 19-E expands the backend-only open-weight VLM synthetic benchmark fixtures and formalizes failure taxonomy coverage. It expands the committed JSON/text-only fixture set to 40 cases, adds accepted coverage for daylight, low light, warm indoor light, neon/night street, blur/motion, soft focus, tilt, grain, high contrast, faded color, backlight/silhouette, clutter/minimal composition, food/object, street, landscape, pet, architecture, imported limited context, severe blur, black image, and overexposed image, and covers failure taxonomy categories for invalid JSON, schema failure, unsupported enum, unsupported filter family, sensitive inference, score/rating, chain-of-thought, debug/provider leakage, source-context overclaim, retake false positive, overlong output, prompt injection, raw localization key, unsafe free text, and timeout stub. The synthetic gate remains passing with no hard blockers and keeps `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`. This does not add model server code, model server URLs, provider/model credentials, real-provider/VLM QA, image upload, network calls, cloud functionality, app integration, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Phase 19-F adds `docs/open-weight-vlm-real-model-sandbox-preflight.md`, a documentation-only preflight plan before any real-model sandbox. It defines what a later Phase 20-A may safely do: backend-only local/self-hosted VLM benchmark sandbox, explicit operator opt-in, ignored local config, ignored approved local image fixtures, synthetic benchmark/gate pass before real-model testing, sanitized aggregate metrics, no iOS integration, no public/production endpoint, no backend provider request payload change, no iOS upload payload change, no Camera cloud AI entry, no training/fine-tuning, no user-photo training, and `productionReady:false`. It also records candidate models, serving paths, ignored config rules, approved fixture policy, runtime logging/redaction rules, hard gates, and operator checklist. This does not add model server code, model server URLs, provider/model credentials, real-provider/VLM QA, image upload, network calls, cloud functionality, app integration, payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Phase 20-A adds a backend-only local/self-hosted VLM sandbox setup. It introduces `backend/config/open-weight-vlm.local.example.json`, ignored real local config/report/sample paths, `backend/src/qa/openWeightVlmLocalSandboxConfig.mjs`, `backend/scripts/check-open-weight-vlm-local-sandbox-config.mjs`, backend tests, and package scripts `npm run qa:open-weight-vlm:local-config` and `npm run qa:open-weight-vlm:local`. The dry-run validates config shape and prints only sanitized buckets. The future local-model command fails closed in this phase with no network/model request. This does not add app-facing endpoints, model server implementation, active model server URL runtime config, provider/model credentials, real VLM/provider QA, image upload, cloud functionality, app integration, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Phase 20-B adds a backend-only local VLM sandbox client smoke path. It introduces `backend/src/qa/openWeightVlmLocalSandboxClient.mjs`, `backend/scripts/run-open-weight-vlm-local-sandbox-smoke.mjs`, backend tests, and `npm run qa:open-weight-vlm:local-smoke`. The default smoke path validates one stubbed candidate through the existing open-weight VLM schema and benchmark gate, prints sanitized aggregate output only, and keeps `networkCallsMade:false`. The explicit future local-model command remains opt-in and fail-closed unless ignored local config, approved local fixtures, synthetic gate success, and a later explicit phase approve real local/self-hosted model calls. This does not add app-facing endpoints, model server implementation, active model server URL runtime config, provider/model credentials, real VLM/provider QA, image upload, cloud functionality, app integration, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud entry, iOS provider/model keys/direct calls, model downloads, training/fine-tuning, user-photo training, or production rollout.
- Future production rollout may start only after explicit approval, real image provider success, secret management hardening, provider policy review, timeout / cancellation, moderation, validation, and cost guard work.
- No Gemini Live / streaming, AI Filter Generator real backend, 改圖師 provider integration, or Camera cloud AI entry is approved by Phase 17A.
- App-wide language switching remains not implemented.
- Filter Lab / 改圖師 copy integration remains future-only.
- Explicit profanity remains future review-only and not runtime-enabled.
- Next planned work after Phase 20-B should remain backend-only local/self-hosted VLM sandbox hardening or operator documentation unless explicitly expanded.
- Any future real-model run must still require ignored local config, approved ignored local fixtures, explicit operator opt-in, synthetic benchmark/gate pass first, sanitized aggregate metrics only, and no production readiness claim.
- The project direction may explore self-hosted/open-weight VLM backend options and later LoRA/QLoRA fine-tuning, but that does not relax current safety boundaries.
- Longer-term direction: LocalAIAnalysisReport, live viewfinder local AI, Core ML, or a fine-tuned own model should come only after the foundation, schema, QA, privacy, and performance gates are ready.
- Next safe step may be another Phase 18-C beta hardening pass if explicitly requested; production rollout, Camera cloud AI, capture-context upload, real-provider QA, and backend/iOS payload changes remain blocked unless separately approved.

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
- Then read `AGENTS.md` and follow all consolidated project rules.
- Then read `docs/phase-log.md`.
- Then read the relevant research doc for the requested phase.
- Do not rely only on chat memory.
- After each phase, update `docs/phase-log.md`; update this handoff too if there is a major state change during the transition period.
- If anything is unclear, ask the user before starting Phase 17, backend work, real AI, upload, persistence, StoreKit, or provider integration.
