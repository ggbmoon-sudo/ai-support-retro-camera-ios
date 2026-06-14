# Future Phase Roadmap Gap Audit

Status: Docs-only audit
Date: 2026-06-14

This audit compares the proposed Phase 20-B through Phase 27+ roadmap against existing Markdown planning in the repository. It does not approve implementation, model calls, iOS integration, production rollout, payload changes, capture-context upload, training, fine-tuning, or any new cloud feature.

New roadmap baseline reviewed:

```text
Phase 20-B - Commit backend local VLM sandbox smoke path
Phase 20-C - Local VLM operator runbook + real-model smoke gate
Phase 20-D - First approved local real-model smoke run
Phase 20-E - Approved local fixture benchmark expansion
Phase 20-F - Model comparison: Qwen2.5 vs Qwen3 vs MiniCPM
Phase 20-G - Prompt/schema iteration freeze

Phase 21-A - Internal VLM gateway contract
Phase 21-B - Internal-only Photo Advisor VLM route
Phase 21-C - App-safe response mapper
Phase 21-D - Consent/auth/quota/kill-switch backend guards
Phase 21-E - Backend redaction/observability hardening

Phase 22-A - iOS RemotePhotoAdvisorService skeleton, debug-only
Phase 22-B - iOS consent + compression + metadata stripping
Phase 22-C - Remote/local result card parity
Phase 22-D - Internal device QA
Phase 22-E - iOS fallback/offline resilience audit

Phase 23-A - Private beta gate
Phase 23-B - No-payload observability
Phase 23-C - Production readiness review
Phase 23-D - Limited rollout only if gates pass

Phase 24-A - Text-only Inspiration AI
Phase 24-B - One-shot AI Snapshot
Phase 24-C - AI Filter Generator schema/recipe prototype

Phase 25+ - Live Viewfinder / streaming / voice AI, separate architecture
Phase 26+ - LoRA/QLoRA only if evaluation proves need
Phase 27+ - On-device / smaller VLM / hybrid local intelligence
```

## 1. Executive summary

The new roadmap covers the most important current direction: backend-first self-hosted/open-weight VLM evaluation, structured PhotoAdvisor candidate JSON, backend validation/fallback/gates, later consent-based iOS integration, and delayed production rollout.

Important previously planned items are represented, but several need clearer placement:

- The new table covers Post-capture Photo Advisor, open-weight VLM benchmarking, backend gates, future debug-only iOS integration, AI Snapshot, AI Filter Generator, live/voice AI, LoRA/QLoRA, and on-device/hybrid intelligence.
- The new table does not explicitly include Firebase production storage/history, StoreKit/quota, account deletion/privacy release work, History intelligence, paid AI image editing / 改圖師, encrypted high-quality transfer, export/save-to-Photos, advanced retro effects, or Hong Kong / 麻煩友 language-mode follow-through.
- Some capabilities are already completed or mostly completed but still appear in older docs as future: local/mock Post-capture Advisor, app-side Advisor language pack, filter recommendation reasons, CreativeIntentGuard, result card model, multilingual copy QA, local live guidance baseline, mock AI Snapshot boundary, mock AI Filter Generator, backend provider contract QA chain, open-weight synthetic benchmark harness/gate, and backend local VLM sandbox smoke path.
- Older provider-first docs still mention Gemini/OpenAI as the MVP provider direction. Those should be treated as historical provider-boundary planning and superseded by the newer open-weight/self-hosted VLM direction unless a later explicit phase reopens provider routing.
- The immediate next phase should remain `Phase 20-C: Local VLM operator runbook + real-model smoke gate`, after Phase 20-B is committed/pushed or confirmed already upstream-synced. Do not start implementation from this audit.

## 2. Source Markdown files reviewed

The repo Markdown corpus was searched for future AI, Photo Advisor, Snapshot, Filter Generator, Inspiration, Live Viewfinder, local AI, open-weight VLM, fine-tuning, on-device AI, and production rollout terms. The following relevant sources were reviewed directly or by targeted keyword/heading scan:

| Source Markdown file | Planning content found |
| --- | --- |
| `AGENTS.md` | Consolidated long-term rules: no iOS provider keys/direct calls, no Camera cloud entry, no capture-context upload, no raw payload logging, no sensitive inference, `productionReady=false`, Photo Advisor voice pattern. |
| `README.md` | Current MVP scope, historical Firebase/Gemini provider architecture, phase status through Phase 20-B, open-weight doc list, and production-blocked boundaries. |
| `backend/README.md` | Backend provider boundary, QweAPI internal beta, B0-B7 provider QA chain, Phase 19-A through 20-B open-weight VLM backend-only docs/scripts/status. |
| `ios-app/README.md` | iOS boundary history, debug-only remote chain, local/mock Advisor baseline, no iOS provider key/direct call, no Camera cloud entry, Phase 18-C and Phase 19 iOS unchanged notes. |
| `tests/manual-smoke-tests.md` | Manual checks for Phase 18-A through 20-B, including open-weight synthetic benchmark, local config, local smoke, no payload changes, no Camera cloud entry, `productionReady=false`. |
| `docs/phase-log.md` | Detailed phase history and current status. It records Phase 20-B as complete/ready in docs and lists completed app-side, backend QA, open-weight benchmark, and local sandbox work. |
| `docs/handoff/codex-transition-handoff.md` | Transition status, completed phases, older restrictions, and future prompts using `AGENTS.md`; contains older Phase 17 provider recommendations that newer open-weight docs supersede. |
| `docs/00-common-background-v2.md` | High-level product context for the retro camera / AI coach app. |
| `docs/01-product-mvp-scope.md` | Original MVP scope: camera/import, Firebase Storage/Firestore, AI analysis, history, quota, subscription, privacy consent, deletion, and future formal features. |
| `docs/02-technical-architecture.md` | Original Firebase-first and provider-adapter architecture, Gemini/OpenAI comparison, server proxy rationale, App Store/privacy risks, and live overlay risk notes. |
| `docs/03-camera-filter-image-pipeline.md` | Camera/filter/image-pipeline baseline and local Core Image direction. |
| `docs/04-ai-photo-advisor.md` | AI Photo Advisor product/response contract foundation. |
| `docs/05-firebase-storage-firestore-functions.md` | Planned production Firestore/Storage schema, Cloud Functions contracts, quota, deletion, cleanup, App Check, and payload/logging boundaries. |
| `docs/06-ui-ux-design-system.md` | UI/UX baseline for result cards and app surfaces. |
| `docs/07-subscription-quota-storekit.md` | StoreKit, quota, entitlement, paywall, App Store compliance, and cost-control planning. |
| `docs/08-privacy-security-app-store-risk.md` | Consent, privacy labels, training consent, deletion, logging, App Store review, provider retention, and age/minor risk guidance. |
| `docs/09-codex-phase-plan.md` | Original phase plan for Firebase, AI functions, result UI, quota, subscription, history/delete/download, privacy, release testing. |
| `docs/ai-feature-definition-and-prompt-contract.md` | AI feature map: Local Camera Coach, Pose Overlay, AI Snapshot, Post-capture Advisor, filter recommendation, AI Filter Generator, Inspiration AI, Future AI Edit, voice, Gemini Live, safety contract, old future roadmap. |
| `docs/ai-photo-advisor-language-audit.md` | Phase 18-A0 language/capability audit and A1-A5 implementation notes for app-owned Photo Advisor language. |
| `docs/photo-advisor-copy-regression-matrix.md` | A5 multilingual copy regression matrix, captured/imported rules, creative-intent and filter-reason regression checks. |
| `docs/photo-advisor-provider-language-contract.md` | B0-B3 provider language/schema/fallback contract, fixture matrix, QA runner alignment, and production-blocked status. |
| `docs/photo-advisor-provider-qa-dry-run-gate.md` | Internal provider QA dry-run safety checklist and sanitized reporting gate. |
| `docs/photo-advisor-provider-qa-review-thresholds.md` | B4 threshold policy for hard blockers, warnings, synthetic acceptance, and real-provider review. |
| `docs/photo-advisor-provider-qa-operator-runbook.md` | B6 operator runbook for provider QA, hard blocker review, and stop conditions. |
| `docs/photo-advisor-provider-qa-chain-readiness.md` | B7 readiness audit for B0-B6 and Phase 18-C starting criteria. |
| `docs/photo-advisor-beta-hardening-plan.md` | C0-C4 beta hardening plan and readiness criteria for captured/imported/fallback Advisor flows. |
| `docs/open-weight-vlm-backend-architecture-adr.md` | Phase 19-A open-weight/self-hosted VLM ADR, model/serving comparison, target architecture, structured contract, safety and fine-tuning path. |
| `docs/open-weight-vlm-structured-advisor-benchmark-plan.md` | Phase 19-B benchmark plan, model candidates, serving stacks, enum/key candidate JSON, metrics/gates, future Phase 19-C plan. |
| `docs/open-weight-vlm-real-model-sandbox-preflight.md` | Phase 19-F preflight and Phase 20-A/20-B safety gates for backend-only local/self-hosted VLM sandbox work. |
| `docs/live-guidance-roadmap.md` | Staged live guidance path: mock UX, local/Vision prototype, server-side snapshot, later Gemini Live/voice; no continuous upload. |
| `docs/live-camera-guidance-research.md` | Live guidance research and phase boundaries, local-first stance, no MVP cloud video, privacy/App Store notes. |
| `docs/gemini-live-implementation-notes.md` | Realtime/Gemini Live notes; useful only for long-term separate architecture, not current roadmap. |
| `docs/spoken-camera-assistant-research.md` | Voice/ASR research and future spoken assistant branches. |
| `docs/ai-feature-definition-and-prompt-contract.md` | Shared AI prompt/UX contract, structured response expectations, safety/privacy boundaries, and future feature backlog. |
| `docs/filter-roadmap.md` | Filter roadmap through expanded local presets and future shader/LUT effects. |
| `docs/filter-preset-schema.md` | Preset schema and local filter metadata baseline. |
| `docs/filter-research-popular-film-looks.md` | Filter research used by local preset library and later filter recommendation/generator work. |
| `docs/product-roadmap-next.md` | Older Phase 11-17 roadmap with AI reference-to-filter and AI image edit later; real services delayed until backend/privacy readiness. |
| `docs/feature-change-requests.md` | FCRs for camera-first UI, live guidance mock/technical prototype, AI reference-to-filter, and AI enhanced photo edit. |
| `docs/product/future-ai-premium-feature-policy.md` | Policy for local AI, LiDAR, post-capture cloud AI quota, encrypted transfer, paid AI image editing, AI Filter Generator free/paid, advanced retro effects, language mode, and guardrails. |
| `docs/product/hk-troublemaker-copy-system-style-guide.md` | Hong Kong / 麻煩友 copy system safety and tone planning. |
| `docs/research/cloud-ai-architecture-research.md` | Provider/backend boundary research; first real endpoint was post-capture Advisor, with AI Snapshot, Filter Generator, Inspiration, and voice/Gemini Live deferred. |
| `docs/research/post-capture-ai-photo-advisor-ux-research.md` | Post-capture Advisor UX, schema, history/inspiration integration, safety/privacy, and mock-to-real plan. |
| `docs/research/ai-filter-generator-research.md` | AI Filter Generator staged plan: mock, local heuristic extractor, cloud style analysis, LUT/saved custom filter; structured recipe only. |
| `docs/research/local-on-device-camera-coach-lidar-research.md` | Local/on-device/Core ML/LiDAR feasibility, dataset/training requirements, no live cloud AI, LC1-LC7 future plan. |
| `docs/research/paid-ai-image-editing-research.md` | Paid AI image editing / 改圖師 research, backend-mediated architecture, consent, prompt guards, entitlement, provider beta, and safety. |
| `docs/research/encrypted-app-to-app-photo-transfer-research.md` | Future paid encrypted high-quality transfer research. |
| `docs/research/pose-overlay-camera-guide-research.md` | Static pose overlay, future pose categories, possible AI pose suggestion and advanced matching. |
| `docs/research/hong-kong-troublemaker-language-mode-research.md` | Cantonese/Hong Kong language mode research and safety considerations. |
| `docs/prompts/phase-06-ai-photo-advisor-backend.md` | Historical mock/scaffold Photo Advisor backend/service phase with no real provider. |
| `docs/prompts/phase-07-ai-advisor-result-ui.md` | Historical mock Photo Advisor result UI phase. |
| `docs/prompts/phase-08-local-session-history.md` | Local in-memory history scaffold, no cloud persistence. |
| `docs/prompts/phase-14-live-camera-guidance-mock-ux.md` | Mock-only live guidance phase prompt. |
| `docs/prompts/phase-15-local-live-guidance-prototype.md` | Local live guidance prototype prompt with local-only, no-upload rules. |
| `docs/prompts/phase-15B-local-frame-signal-prototype.md` | Local frame signal prompt for brightness/low-frequency frame analysis. |
| `docs/prompts/phase-15C-local-face-framing-vision-prototype.md` | Local Vision face rectangle/headroom prompt, sensitive inference restrictions. |
| `docs/prompts/phase-15D-guidance-stability-and-priority.md` | Guidance stability/priority/anti-flicker prompt. |
| `docs/prompts/phase-16-cloud-snapshot-ai-guidance-prototype.md` | Mock-only AI Snapshot boundary prompt, explicit trigger and no real network/upload. |

## 3. Feature comparison table

| Feature / capability | Mentioned in existing Markdown | Existing doc path / section | Current implementation status | Covered by new phase table? | Recommended future phase | Action | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Backend local VLM sandbox smoke path | Yes | `backend/README.md` / Phase 20-B, `docs/phase-log.md` / Phase 20-B | Completed per repo docs and git upstream state; default stub/no-network | Yes | Phase 20-B | already done | New table says "commit" Phase 20-B; repo status should decide whether only push/confirmation remains. |
| Local VLM operator runbook + real-model smoke gate | Partly | `docs/open-weight-vlm-real-model-sandbox-preflight.md` / Local Operator Checklist | Planned, not implemented | Yes | Phase 20-C | keep | This should be the immediate next phase after this audit. |
| First approved local real-model smoke run | Partly | `docs/open-weight-vlm-real-model-sandbox-preflight.md` / Runtime Safety Preflight | Not run; real model calls forbidden so far | Yes | Phase 20-D | keep | Must require local ignored config, approved ignored samples, explicit operator opt-in, synthetic gate pass, and sanitized metrics. |
| Approved local fixture benchmark expansion | Yes | `docs/open-weight-vlm-structured-advisor-benchmark-plan.md` / Dataset Scope, `docs/open-weight-vlm-real-model-sandbox-preflight.md` / Approved Local Image Fixture Policy | Synthetic fixtures expanded in Phase 19-E; approved local image fixtures not yet used | Yes | Phase 20-E | keep | Include metadata stripping, license/consent review, and no user photos by default. |
| Model comparison Qwen2.5 vs Qwen3 vs MiniCPM | Yes | `docs/open-weight-vlm-structured-advisor-benchmark-plan.md` / Candidate Model List | Planned only; no real VLM run | Yes | Phase 20-F | keep | Include Qwen2.5-VL first, Qwen3-VL challenger, MiniCPM-V 4.5 efficiency path, optional InternVL3. |
| Prompt/schema iteration freeze | Yes | `docs/open-weight-vlm-structured-advisor-benchmark-plan.md` / Structured VLM Candidate JSON; `docs/open-weight-vlm-backend-architecture-adr.md` / Structured Output Contract | Schema/validator exists for synthetic benchmark; real-model prompt/schema not frozen | Yes | Phase 20-G | keep | Freeze only after real-model smoke and comparison show stable schema compliance. |
| Internal VLM gateway contract | Partly | `docs/open-weight-vlm-backend-architecture-adr.md` / Target Architecture | Not implemented | Yes | Phase 21-A | keep | Should define backend-only gateway contract; no app-facing endpoint yet. |
| Internal-only Photo Advisor VLM route | Partly | ADR target architecture; existing `/v1/ai/photo-advisor` provider boundary in `backend/README.md` | Existing provider route is QweAPI/internal; open-weight route not added | Yes | Phase 21-B | keep | Must be internal/debug-only and behind kill switch/auth/consent. |
| App-safe response mapper | Yes | `docs/open-weight-vlm-structured-advisor-benchmark-plan.md` / App responsibilities; Phase 18-A4 result card model | Local result card exists; remote candidate mapper not implemented | Yes | Phase 21-C | keep | Map candidate enum/key JSON to existing language pack/result card; do not pass raw model prose. |
| Consent/auth/quota/kill-switch backend guards | Yes | `docs/05-firebase-storage-firestore-functions.md`, `docs/07-subscription-quota-storekit.md`, `docs/08-privacy-security-app-store-risk.md` | Partly planned/scaffolded; not production | Yes | Phase 21-D | keep and clarify | Add App Check, consent version, auth, quota, kill switch, trainingConsent false, and account deletion constraints explicitly. |
| Backend redaction/observability hardening | Yes | B2/B4/B5 docs, `backend/README.md` / No Payload Logging | Synthetic and provider QA report redaction exist; VLM observability not production | Yes | Phase 21-E / Phase 23-B | keep / merge | Keep no-payload observability both before integration and before beta. |
| Debug-only iOS RemotePhotoAdvisorService | Yes | `ios-app/README.md` / Phase 17B and 19-A notes | Existing debug remote CloudAI chain for backend mock/provider; open-weight-specific skeleton not added | Yes | Phase 22-A | keep | Must remain debug-only, no provider/model key/direct call, no Camera entry. |
| iOS consent + compression + metadata stripping | Yes | `ios-app/README.md` / Phase 17A/B; `docs/08-privacy-security-app-store-risk.md`; ADR target architecture | Existing scaffold exists for remote cloud chain; future VLM path not approved | Yes | Phase 22-B | keep | Include post-capture explicit consent only, metadata stripping, size/type limits. |
| Remote/local result card parity | Yes | Phase 18-A4/C1 docs and `docs/photo-advisor-beta-hardening-plan.md` | Local/mock card baseline completed | Yes | Phase 22-C | keep | Remote output must render through app language pack/result card, not provider prose. |
| Internal device QA | Yes | `tests/manual-smoke-tests.md`, Phase 18-C and 17D QA docs | Manual QA docs exist; remote VLM device QA not run | Yes | Phase 22-D | keep | Include captured/imported/fallback, offline, consent, localization, and no raw UI output. |
| iOS fallback/offline resilience | Yes | Phase 18-C2 docs, B0/B1 fallback docs | Local fallback behavior exists; remote VLM fallback not integrated | Yes | Phase 22-E | keep | Must prefer local/mock if unavailable, unsafe, invalid, or offline. |
| Private beta gate / production readiness / limited rollout | Yes | `docs/photo-advisor-provider-qa-review-thresholds.md`, `docs/photo-advisor-provider-qa-chain-readiness.md`, `docs/phase-log.md` | Provider QA gates exist; no production rollout | Yes | Phase 23-A to 23-D | keep and clarify | Passing real/local VLM QA is not production approval; `productionReady=false` until explicit rollout phase. |
| Text-only Inspiration AI | Yes | `docs/ai-feature-definition-and-prompt-contract.md` / Inspiration AI; `docs/research/cloud-ai-architecture-research.md` / Inspiration AI | Inspiration hub exists as mock/local; no real text AI | Yes | Phase 24-A | keep | Lower privacy risk; keep no image upload unless later explicitly approved. |
| One-shot AI Snapshot | Yes | `docs/ai-feature-definition-and-prompt-contract.md` / AI Snapshot; `docs/live-guidance-roadmap.md`; Phase 16 prompt | Mock boundary existed; Camera cloud entry later removed/hidden to keep Camera local-only | Yes | Phase 24-B | delay | Should be post-capture/explicit one-shot only after Photo Advisor integration is stable; no live Camera cloud. |
| AI Filter Generator schema/recipe prototype | Yes | `docs/research/ai-filter-generator-research.md`; `docs/product/future-ai-premium-feature-policy.md` | Mock Filter Lab exists; real generator not implemented | Yes | Phase 24-C | keep | Preserve structured recipe, local heuristic first, no runtime shader/code, no exact-copy claims. |
| Paid AI image editing / 改圖師 | Yes | `docs/research/paid-ai-image-editing-research.md`; `docs/product/future-ai-premium-feature-policy.md` | Research only | No | Phase 24-D+ or later separate track | delay / needs clarification | Valuable later, but should follow Photo Advisor, consent/quota/entitlement, and image-editing policy work. |
| History intelligence / cloud history search | Yes | `docs/research/post-capture-ai-photo-advisor-ux-research.md` / History Integration; `docs/01-product-mvp-scope.md`; `docs/05-firebase-storage-firestore-functions.md` | Local in-memory history scaffold only; no cloud history | No | Phase 24-D or separate non-AI data phase | keep / clarify | Future should save only validated summaries/filter IDs, never raw provider/model output. |
| Firebase Storage / Firestore production history | Yes | `README.md` MVP Scope; `docs/05-firebase-storage-firestore-functions.md`; `docs/09-codex-phase-plan.md` | Mock/scaffold; not production | No | Separate infrastructure phase before private beta | keep / clarify | Not VLM-specific, but private beta may need real account/delete/history behavior. |
| StoreKit / quota / premium entitlement | Yes | `docs/07-subscription-quota-storekit.md`; `docs/product/future-ai-premium-feature-policy.md` | Deferred; no StoreKit runtime | Partly in Phase 21-D | delay / clarify | Phase 21-D should only add backend guards if explicitly scoped; StoreKit UI/payments need separate approval. |
| Privacy, App Store, consent, account deletion | Yes | `docs/08-privacy-security-app-store-risk.md`; `docs/07-subscription-quota-storekit.md`; `docs/05-firebase-storage-firestore-functions.md` | Partly scaffolded/planned; not full production | Partly | Phase 21-D, 22-B, 23-C | keep and make explicit | New table should explicitly preserve App Privacy labels, deletion, age/provider policy review, trainingConsent false. |
| Local live guidance / local capture intelligence | Yes | `docs/live-guidance-roadmap.md`, `docs/research/local-on-device-camera-coach-lidar-research.md`, Phase 15/17D docs | Local guidance and capture intelligence are implemented/bucketed; still not full local AI | Partly Phase 27+ | already done / delay advanced work | Keep as local-first product differentiator; advanced local model should wait for Phase 27+. |
| Apple Vision / Core ML baseline | Yes | `docs/research/local-on-device-camera-coach-lidar-research.md` / Core ML Feasibility | Vision local face/framing used historically; Core ML not implemented | Partly Phase 27+ | delay | Phase 27+ should explicitly say Apple Vision/Core ML/smaller VLM hybrid baseline, not just "on-device VLM". |
| LiDAR-aware local intelligence | Yes | `docs/product/future-ai-premium-feature-policy.md`; local-on-device research | Research only | No | Phase 27+ or separate LC4 | delay | Optional device-specific enhancement, no upload, no core dependency. |
| Live Viewfinder / streaming / voice AI | Yes | live guidance docs, Gemini Live notes, spoken assistant research | Mock/local guidance exists; no real live cloud/voice | Yes Phase 25+ | delay | Should remain separate architecture, not part of Photo Advisor VLM route. |
| Fine-tuning / LoRA / QLoRA | Yes | ADR and benchmark plan; local-on-device dataset requirements | Not started | Yes Phase 26+ | delay | Only after evaluation proves need, curated consented non-sensitive dataset, adapter versioning. |
| AI response/copy language system | Yes | Phase 18-A docs, copy regression matrix, beta hardening plan | Completed app-side local/mock baseline | Not explicit except mapper/parity | already done / preserve | Add as a standing gate in Phase 21-C/22-C/23. |
| Filter recommendation reason library | Yes | Phase 18-A2 docs, beta plan | Completed | Not explicit except result parity | already done / preserve | Future model returns family/key; app renders localized reason. |
| CreativeIntentGuard | Yes | Phase 18-A3 docs, beta plan | Completed | Not explicit | already done / preserve | Must stay in provider mapper and VLM validation path. |
| Provider/backend contract and QA chain | Yes | B0-B7 docs | Completed for provider path; synthetic VLM path added | Partly | already done / preserve | B0-B7 should be treated as reusable gate pattern for open-weight route. |
| Multilingual Advisor copy | Yes | A5 matrix, C3 docs | Completed baseline | Not explicit | already done / preserve | Add to Phase 20-G/22-C/23-C review criteria. |
| App Store privacy / consent review | Yes | privacy and StoreKit docs | Planned; not release-ready | Partly Phase 23-C | keep / clarify | Required before private beta/limited rollout. |
| Encrypted app-to-app transfer / high-quality export | Yes | `docs/product/future-ai-premium-feature-policy.md`, encrypted transfer research | Research only | No | Separate non-AI roadmap | delay | Valuable paid feature but not part of VLM Photo Advisor. |
| Advanced retro effects / double exposure / LUT/shader | Yes | `docs/product/future-ai-premium-feature-policy.md`, filter roadmap | Research/planning | No | Separate camera/filter roadmap | delay | Should not be merged into VLM integration. |
| Social captions | Yes as optional old A4, then repeatedly excluded | Post-capture research / safety constraints | Not implemented | No | remove from near-term | remove/delay | Current hard rules exclude social caption generation; keep out unless separately approved. |

## 4. Missing from new roadmap

Previously planned or valuable items not clearly represented in the new phase table:

1. Production Firebase Storage / Firestore / cloud history path from `docs/05-firebase-storage-firestore-functions.md`.
2. Account deletion, single-photo deletion, retention, App Privacy labels, and provider/legal review from `docs/08-privacy-security-app-store-risk.md`.
3. StoreKit/quota/entitlement/paywall work from `docs/07-subscription-quota-storekit.md`.
4. History intelligence and persisted validated Advisor metadata from `docs/research/post-capture-ai-photo-advisor-ux-research.md`.
5. Paid AI image editing / 改圖師 from `docs/research/paid-ai-image-editing-research.md`.
6. Encrypted app-to-app high-quality transfer and export/save-to-Photos from `docs/product/future-ai-premium-feature-policy.md`.
7. LiDAR-aware guidance and explicit Apple Vision/Core ML baseline from `docs/research/local-on-device-camera-coach-lidar-research.md`.
8. Hong Kong / 麻煩友 language-mode productization beyond Advisor copy from `docs/product/hk-troublemaker-copy-system-style-guide.md` and related research.
9. Advanced retro effects such as double exposure, local LUTs, shader/halation paths, and saved custom filter library.
10. App Store / privacy release checklist as a separate pre-rollout phase.

These should not be pulled into Phase 20-C. They should be added to the revised roadmap as separate later tracks.

## 5. New roadmap items not yet documented

The exact proposed future table is not yet consolidated in the repo Markdown. The following phase names should be added to handoff/phase-log or a future roadmap doc when accepted:

- Phase 20-C through 20-G exact sequence.
- Phase 21-A through 21-E internal VLM gateway, route, mapper, backend guards, and observability sequence.
- Phase 22-A through 22-E debug-only iOS remote integration sequence.
- Phase 23-A through 23-D private beta / no-payload observability / production review / limited rollout sequence.
- Phase 24-A through 24-C ordering for Inspiration AI, one-shot AI Snapshot, and AI Filter Generator.
- Phase 25+ live viewfinder / streaming / voice as separate architecture.
- Phase 26+ LoRA/QLoRA delayed until evaluation proves need.
- Phase 27+ on-device / smaller VLM / Core ML / Apple Vision hybrid local intelligence.

## 6. Conflicts or outdated assumptions

Outdated or conflicting assumptions found in older Markdown:

- `README.md`, `docs/02-technical-architecture.md`, `docs/05-firebase-storage-firestore-functions.md`, and `docs/08-privacy-security-app-store-risk.md` still describe Gemini paid tier / GeminiAnalyzer as the MVP AI provider direction. Treat these as historical provider-boundary assumptions; the newer Phase 19+ direction is open-weight/self-hosted VLM backend evaluation.
- `docs/research/cloud-ai-architecture-research.md` planned Phase 17C real provider work. That path was completed as an internal/debug provider beta and QA chain, but the future strategic direction has moved to self-hosted/open-weight models before product integration.
- Older AI Snapshot docs include pre-capture cloud snapshot concepts. Current `AGENTS.md` and later cleanup phases keep Camera local-only unless explicitly approved; new roadmap should frame Phase 24-B as explicit one-shot, not live Camera cloud.
- Older live guidance docs mention Gemini Live / voice as Phase 17 research. New roadmap should move that to Phase 25+ separate architecture.
- Older AI Filter Generator research includes F3 cloud style analysis. New roadmap should keep Phase 24-C schema/recipe prototype first and avoid image upload until consent/backend gates are explicit.
- Older MVP docs include quota/StoreKit/Firebase production scope earlier than current work. These remain valuable but should not be mixed into VLM model integration phases unless explicitly scoped.
- Some older docs mention confidence/source fields for filter recommendation. Current Phase 18-A4 rules forbid numeric confidence in production UI; future model output should use enum/key candidates and app-side rendering.
- Older Photo Advisor UX includes caption/social copy as optional future. Current project hard rules exclude social caption generation; it should remain removed/delayed.

Safety/privacy/product boundaries from older docs that the new table should explicitly preserve:

- No iOS provider/model API keys.
- No iOS direct provider/model calls.
- No Camera cloud AI entry or continuous viewfinder upload.
- Explicit post-capture consent before any image upload.
- Metadata stripping, size/type limits, and no raw EXIF/GPS persistence.
- No raw image/base64/prompt/model response/request payload logging.
- No raw provider/model output in production UI.
- No sensitive inference, identity, face, skin, age, gender, emotion, health, beauty, body, ethnicity, religion, disability, or similar claims.
- User-photo training requires a separate revocable consent policy; default is no training.
- Backend validator/fallback/gate remains the enforcement point.
- `productionReady=false` until an explicit production rollout phase.

## 7. Recommended revised roadmap

This revised roadmap merges the new table with existing Markdown plans and completed work.

### Completed foundation to preserve

- Phase 18-A1 to A5: app-owned Photo Advisor language pack, filter reason library, CreativeIntentGuard, result card model, multilingual copy regression.
- Phase 18-B0 to B7: provider language contract, regression fixtures, sanitized QA runner, dry-run gate, thresholds, gate helper, operator runbook, readiness audit.
- Phase 18-C0 to C4: Post-capture Advisor beta hardening and Phase 19 handoff.
- Phase 19-A to 19-F: open-weight VLM ADR, benchmark plan, synthetic harness, gate summary, taxonomy expansion, real-model sandbox preflight.
- Phase 20-A to 20-B: backend-only local VLM config and stub/no-network smoke path.

### Phase 20: backend-only local model sandbox track

- Phase 20-C: Local VLM operator runbook + real-model smoke gate.
- Phase 20-D: First approved local real-model smoke run, only with ignored local config, approved ignored samples, explicit operator opt-in, and sanitized aggregate metrics.
- Phase 20-E: Approved local fixture benchmark expansion, including metadata-stripping proof and no user photos by default.
- Phase 20-F: Model comparison: Qwen2.5-VL vs Qwen3-VL vs MiniCPM-V, optional InternVL3 if resources allow.
- Phase 20-G: Prompt/schema iteration freeze, with multilingual/style/CreativeIntentGuard review before any integration phase.

### Phase 21: backend internal VLM gateway track

- Phase 21-A: Internal VLM gateway contract, backend-only, no public endpoint.
- Phase 21-B: Internal-only Photo Advisor VLM route behind config/auth/kill switch.
- Phase 21-C: App-safe candidate-to-result mapper using the app language pack, filter reasons, CreativeIntentGuard, and result card model.
- Phase 21-D: Consent/auth/quota/kill-switch backend guards, plus App Check/privacy/trainingConsent false checks.
- Phase 21-E: Backend redaction/observability hardening with no-payload metrics and sanitized reports.

### Phase 22: debug-only iOS remote integration track

- Phase 22-A: iOS `RemotePhotoAdvisorService` skeleton, debug/internal only.
- Phase 22-B: Explicit consent + compression + metadata stripping + upload boundary.
- Phase 22-C: Remote/local result card parity and multilingual copy parity.
- Phase 22-D: Internal device QA for capture/import/fallback/offline and no raw UI output.
- Phase 22-E: iOS fallback/offline resilience audit.

### Phase 23: beta and rollout gate track

- Phase 23-A: Private beta gate.
- Phase 23-B: No-payload observability review.
- Phase 23-C: Production readiness review, including privacy/App Store/deletion/consent/provider-license checks.
- Phase 23-D: Limited rollout only if all gates pass and the user explicitly approves `productionReady=true`.

### Phase 24: later product AI surfaces

- Phase 24-A: Text-only Inspiration AI, no image upload by default.
- Phase 24-B: One-shot AI Snapshot, explicit user trigger only, no continuous Camera upload.
- Phase 24-C: AI Filter Generator schema/recipe prototype, structured recipe only.
- Phase 24-D: History intelligence / saved validated Advisor metadata, if cloud history/privacy is ready.
- Phase 24-E: Paid AI image editing / 改圖師 policy and prompt-guard planning, not real provider integration yet.

### Phase 25+: separate live/voice architecture

- Live Viewfinder, streaming, and voice AI require a separate architecture, privacy review, cost review, and App Store review.
- Local/on-device signals should remain the preferred first path; no continuous cloud viewfinder upload.

### Phase 26+: fine-tuning / LoRA / QLoRA

- Only after benchmark evaluation proves prompting/schema is insufficient.
- Requires curated, consented, non-sensitive, metadata-stripped dataset; no user-photo training by default.
- Requires adapter/model versioning and deletion/consent policy.

### Phase 27+: on-device / hybrid local intelligence

- Core ML / Apple Vision / smaller VLM / hybrid local intelligence.
- Start with dataset taxonomy, evaluation, battery/thermal/privacy gates.
- LiDAR-aware guidance remains optional and device-fallback-safe.

### Separate non-AI product/infrastructure backlog

- Firebase Storage / Firestore production history and deletion.
- StoreKit / quota / entitlement / paywall.
- Export/save-to-Photos and encrypted app-to-app transfer.
- Advanced retro effects, LUT/shader/halation, saved custom filters.
- Hong Kong / 麻煩友 app-wide language mode productization.

## 8. Immediate next phase recommendation

After Phase 20-B is committed/pushed or confirmed upstream-synced, the next phase should remain:

```text
Phase 20-C: Local VLM operator runbook + real-model smoke gate
```

Recommended Phase 20-C shape:

- Docs/runbook first.
- No real model call unless explicitly approved inside that phase.
- Define exact local operator prerequisites.
- Confirm ignored local config, ignored sample folder, and synthetic gate pass requirements.
- Define stop conditions and sanitized reporting expectations.
- Keep backend-only/no-network defaults and `productionReady=false`.

Do not start implementation from this audit.

## 9. Boundary confirmations

This audit confirms the docs-only boundary:

- No iOS integration added.
- No production endpoint added.
- No new model server URL/config committed by this audit; existing Phase 20-A example config remains an example-only, disabled, loopback placeholder.
- No provider/model credentials added.
- No backend provider request payload changed.
- No iOS upload payload changed.
- No capture context upload added.
- No Camera cloud AI entry added.
- No real photos committed.
- No real VLM/provider calls run.
- No training/fine-tuning started.
- `productionReady=false` remains the required state.
