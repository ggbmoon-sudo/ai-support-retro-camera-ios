# Missing Features and Deferred Roadmap Register

Status: Phase 21-G2 docs-only memory/backlog audit  
Date: 2026-06-17  
Production readiness: `productionReady:false`

## Executive Summary

This register records planned, missing, deferred, blocked, partially built, or not-yet-integrated app/backend/VLM features so future ChatGPT/Codex sessions do not rely only on chat memory.

This file is a memory-safe project register, not an implementation approval. Items listed here are not approved for immediate build-out unless a future prompt explicitly scopes and approves that work.

`productionReady:false` remains the default. Any cloud upload, live AI, iOS/backend integration, app-facing endpoint, production endpoint, model call, Qwen inference, serving benchmark, auth/billing/quota runtime, or production rollout still requires explicit future user approval.

Docs audit note: Phase 21-G2 reviewed the Markdown inventory returned by the repo-level Markdown listing command, excluding `node_modules`, `.git`, and local VLM sample paths. The inventory contained 103 Markdown/Markdown-like files. Current implementation was also checked by source-tree and backend script/file-name inspection only; no runtime feature was changed.

Naming note: the Phase 21-G2 prompt assumed Phase 21-H had not started. The current repository already contains a committed Phase 21-H local model route dry-run plan. Future phase labels below preserve the requested roadmap shape, but the next operator should reconcile numbering before starting new implementation.

## Current Confirmed Foundation

The following foundation appears present or planned through committed docs/source phases. Use cautious wording and re-verify before relying on any item for production.

- Post-capture Photo Advisor mock/local flow appears present in iOS under `Features/AIPhotoAdvisor/PostCapture`, with local language pack, result card model, filter reason library, heuristic resolver, and mock service.
- Backend Photo Advisor validator/schema/QA gates appear present under `backend/src/validators`, `backend/src/schemas`, and `backend/src/qa`.
- Open-weight VLM synthetic benchmark harness appears present with no-network benchmark/gate scripts and fixtures.
- Local Qwen2.5-VL sandbox history is documented as backend-only and local/private. The docs record accepted one-fixture, expanded eight-fixture, and 12-fixture smoke history, but those are sandbox evidence only.
- Backend gateway contract preflight appears present as a no-model contract gate.
- Provider routing and no-model adapter checks appear present for backend-internal local/private planning routes.
- Deployment config/env boundary appears present as a no-network/no-model preflight.
- Cross-platform boundary appears present and keeps Windows local VLM paths out of Mac/Xcode and production runtime dependencies.
- `local_model` route approval gate appears present and keeps route enablement/model calls blocked.
- Phase 21-H dry-run plan appears present in the current repo and keeps future route execution blocked.
- `productionReady:false` remains the required default across backend QA, local VLM, gateway, and production-boundary docs.

## Missing / Deferred Feature Register

| Area | Feature | Current status | Why it matters | Blocking dependencies | Suggested future phase | Safety/privacy notes |
| --- | --- | --- | --- | --- | --- | --- |
| Live Advisor / camera-view AI | Auto-Trigger Live Advisor based on device stillness greater than 1 second | planned | Avoids noisy cloud analysis and accidental frame capture | Stillness policy gate, consent, local stability signal, backend endpoint policy | Phase 21-J | If stable time is `<= 1s`, do not capture a frame and do not upload anything |
| Live Advisor / camera-view AI | Explicit no-capture/no-upload rule when stable time is `<= 1s` | planned | Makes trigger boundary auditable | Auto-trigger gate and QA checks | Phase 21-J | Must be fail-closed and testable before any runtime upload |
| Live Advisor / camera-view AI | Max 1 FPS cloud frame analysis | planned | Prevents treating viewfinder as continuous video AI | Rate-limit policy, compression policy, backend session policy | Phase 21-J | Do not analyze 30fps preview; use sparse consented frames only |
| Live Advisor / camera-view AI | Stateful WSS bidirectional session protocol | planned | Needed for future low-latency live guidance state | Protocol preflight, auth/session, backoff, privacy policy | Phase 21-K | No WSS runtime until consent, quota, retention, and logging policy exist |
| Live Advisor / camera-view AI | Live Advisor UI surface | blocked | User needs visible opt-in, state, and disable controls | Product UX plan, consent copy, backend policy | Phase 22+ | No Camera live cloud AI entry until explicitly approved |
| Live Advisor / camera-view AI | Server busy/backoff state | missing | Prevents overload and repeated uploads | Backend session protocol, retry/backoff policy | Phase 21-K | Must not retry silently or upload extra frames |
| Live Advisor / camera-view AI | User opt-in and visible consent | partial | Required before cloud analysis | Consent UX, privacy policy, upload payload policy | Phase 22-A | No silent upload; explain cloud processing clearly |
| Live Advisor / camera-view AI | Disable/off state | partial | Lets users stop live analysis | UI state and backend session teardown | Phase 22-A | Off must mean no capture/upload/cloud calls |
| Live Advisor / camera-view AI | Rate limit and quota | partial | Controls abuse/cost | Auth/session, quota/billing policy | Phase 23+ | Keep backend-mediated; no provider key in iOS |
| Live Advisor / camera-view AI | No Camera live cloud AI entry until approved | blocked | Preserves current local-only Camera boundary | Explicit future approval | Phase 22-A | Camera remains local-only by default |
| iOS local CV / camera aids | Grid alignment analysis | planned | Millisecond local composition aid | Vision/Core Image/local analyzer plan | Phase 21-L | Local-only; no cloud upload required |
| iOS local CV / camera aids | Horizon/level guide | partial | Helps framing without cloud AI | Device motion buckets and UI guide | Phase 21-L | Do not persist raw sensor streams |
| iOS local CV / camera aids | Overexposed/underexposed warning | partial | Fast local exposure feedback | Local image signal thresholds | Phase 21-L | Bucketed signal only; no raw frame persistence |
| iOS local CV / camera aids | Basic motion/stability bucket | partial | Enables trigger gating and local guidance | Camera signal monitor and QA | Phase 21-J / 21-L | Bucketed short-window in-memory signal only |
| iOS local CV / camera aids | 60fps camera smoothness target | needs verification | Live aids must not degrade preview | Performance profiling on device | Phase 21-L | Local CV must remain lightweight and optional |
| iOS local CV / camera aids | Local-only CV boundary | partial | Separates millisecond aids from cloud VLM | Boundary docs and runtime checks | Phase 21-L | No raw sensor/GPS/EXIF persistence |
| Image compression / upload payload | App-side compressed preview before cloud upload | partial | Reduces bandwidth/cost and limits data sent | Compression policy gate and source verification | Phase 21-I | Future target around 1024px long edge and 150KB-200KB JPEG preview frame; exact values must be tested |
| Image compression / upload payload | Metadata stripping | planned | Avoids EXIF/GPS leakage | Upload payload policy and implementation | Phase 21-I | Strip metadata before any cloud upload |
| Image compression / upload payload | Consent gate | partial | Required for privacy/App Store review | Consent UX and backend policy | Phase 21-I / 22-A | No upload without explicit user action/consent |
| Image compression / upload payload | Retention/deletion policy | missing | Required before real user photos | Backend storage lifecycle and user deletion flow | Phase 23+ | Do not accept real upload without retention/deletion policy |
| Image compression / upload payload | No original full-resolution upload by default | planned | Data minimization | Compression policy and backend validation | Phase 21-I | Use preview frame only unless separately approved |
| Image compression / upload payload | No capture-context upload unless explicitly approved | blocked | Prevents payload drift | Payload schema approval | Phase 21-I | Current capture context remains local-only |
| Backend / production API | App-facing Photo Advisor endpoint | blocked | Needed for production app integration | Auth, consent, rate limit, payload validation, privacy review | Phase 22-A / 23+ | Not approved by local model/gateway phases |
| Backend / production API | Auth/user session | partial | Required for quotas, deletion, history, abuse controls | Firebase/Auth or backend alternative | Phase 23+ | No secrets/provider keys in iOS |
| Backend / production API | Rate limiting | partial | Controls abuse/cost | Backend middleware and user/session identity | Phase 23+ | Must fail safely and avoid raw payload logs |
| Backend / production API | Quota/billing/entitlement | partial | Product monetization/cost control | StoreKit/backend entitlement bridge | Phase 23+ | No runtime billing until explicit phase |
| Backend / production API | Abuse prevention | partial | Protects provider/backend | App Check, auth, moderation, throttling | Phase 23+ | Backend-mediated only |
| Backend / production API | Retention/deletion policy | missing | Required for real uploads | Storage architecture and deletion workflow | Phase 23+ | Must cover account/photo deletion |
| Backend / production API | Privacy policy/App Store disclosure | planned | Required before production cloud AI | Legal/privacy review | Phase 23+ | Must disclose third-party/cloud AI processing |
| Backend / production API | Monitoring/alerting | missing | Production operability | Deployment target and incident policy | Phase 23+ | Logs must be sanitized |
| Backend / production API | Production fallback | partial | Safe UX during provider failures | Fallback contract and UI mapping | Phase 23+ | Never display raw provider text/errors |
| Backend / production API | Production incident controls | missing | Kill switch and rollback safety | Remote config, deployment controls | Phase 23+ | Must preserve `productionReady:false` until approved |
| Backend / production API | `productionReady` false-to-true gate | blocked | Prevents accidental rollout | Explicit production rollout phase | Phase 23+ | Only user-approved rollout can change it |
| VLM model/serving | Qwen 3.5 35B-A3B MoE preferred target | planned | Potential better quality/latency tradeoff | Verify vision-capable/VLM-compatible release and local serving support | Phase 21-H naming note / future re-evaluation gate | Do not adopt text-only model for image analysis |
| VLM model/serving | Qwen2.5-VL correctness/reference baseline | partial | Known sandbox baseline | Existing local Qwen2.5-VL smoke evidence | Phase 21-M | Baseline is not production approval |
| VLM model/serving | Qwen3-VL MoE fallback/candidate | planned | Backup if Qwen 3.5 35B-A3B vision path is unavailable | Model availability and benchmark plan | Phase 21-H naming note / 21-M | Verify VLM compatibility first |
| VLM model/serving | Smaller Qwen 9B vision-capable fallback | planned | Cost/latency fallback | Candidate model verification and benchmark | Phase 21-M | Text-only 9B variants blocked for image analysis |
| VLM model/serving | Text-only Qwen blocked for image analysis | blocked | Avoids invalid architecture | Model capability check | Phase 21-H naming note | Must be vision-capable before VLM adoption |
| VLM model/serving | Non-thinking/instruct direct-output mode | planned | Lower latency, more deterministic JSON | Model mode verification and prompt/schema tests | Phase 21-H naming note / 21-M | Must still produce structured candidate JSON only |
| VLM model/serving | Structured output only | partial | Backend validator can gate result | Schema, prompt, fallback, validator | Phase 21-M | No free-form model prose to iOS |
| VLM model/serving | vLLM primary future serving benchmark candidate | planned | Production serving direction | Benchmark preflight approval and hardware plan | Phase 21-M | Do not run serving benchmark without approval |
| VLM model/serving | SGLang structured-output/performance challenger | planned | Compare serving performance/JSON control | Benchmark preflight approval | Phase 21-M | No SGLang call in this phase |
| VLM model/serving | Ollama/LM Studio manual/local only | later | Useful for manual/dev exploration | Operator-only docs | Phase 21-M | Not production serving direction |
| VLM model/serving | INT4/INT8 quantization such as AWQ/GPTQ or equivalent | planned | Lower cost/hardware pressure | Quantization benchmark matrix | Phase 21-M | Must compare quality/regression and safety outputs |
| VLM model/serving | Serving benchmark execution | blocked | Needed before production stack choice | Explicit benchmark approval | Phase 21-M | Not executed in this docs phase |
| VLM model/serving | Production hardware/cost planning | planned | Controls budget and rollout feasibility | Benchmark data and quota model | Phase 23+ | Include abuse/cost limits |
| Photo Advisor UX/product | Real AI result card integration | partial | Production cloud result display | Backend endpoint, consent, validator, fallback | Phase 22-A | Preserve safe UI mapping |
| Photo Advisor UX/product | Captured vs imported production behavior | partial | Avoids overclaiming capture context | Payload policy and UI rules | Phase 22-A | Imported photos must not claim capture-time data |
| Photo Advisor UX/product | Consent UX | partial | Required before cloud AI | Product/privacy copy | Phase 22-A | No silent upload |
| Photo Advisor UX/product | Language-pack/UI mapping from structured keys | partial | Keeps app voice localizable | Real AI integration mapping tests | Phase 22-A | Do not show raw keys |
| Photo Advisor UX/product | Filter recommendation production path | partial | Core app value | Structured response and filter catalog mapping | Phase 22-A | Filter IDs must remain allowlisted |
| Photo Advisor UX/product | Preserve Observation -> Mood -> Retro intent -> Optional action | partial | Keeps product voice | Copy regression tests | Phase 22-A | Avoid Score -> Problem -> Fix -> Retake |
| Photo Advisor UX/product | Caption/social copy | deferred | Optional product expansion | Product decision and safety review | Later | Mark needs decision; not MVP default |
| Photo Advisor UX/product | History intelligence / saved advisor history | partial | Continuity and user value | Storage, consent, deletion, privacy policy | Phase 23+ | Avoid storing raw images/prompts by default |
| Photo Advisor UX/product | Local history to production storage decision | planned | Determines Firebase/storage scope | Storage policy and deletion flow | Phase 23+ | Data minimization required |
| iOS integration | Debug-only backend integration | partial | Internal validation path | Backend endpoint and debug gate | Phase 22-A | Debug-only, no provider keys in iOS |
| iOS integration | Production endpoint integration | blocked | Needed for rollout | Production API, auth, consent, quotas | Phase 23+ | No direct provider/model calls |
| iOS integration | App Transport/security config | planned | Secure backend calls | Endpoint and certificate policy | Phase 22-A | No LAN/local model URL dependency in Xcode |
| iOS integration | Offline/fallback UX | partial | User-safe degradation | UI mapping and error states | Phase 22-A | Use local/mock fallback |
| iOS integration | Error states | partial | Avoid raw provider/debug exposure | Backend error contract | Phase 22-A | Do not show raw provider errors |
| iOS integration | No iOS provider/model key | blocked | Security invariant | Scans and review | Every phase | Provider calls must be backend-mediated |
| iOS integration | No payload drift | blocked | Prevents unapproved uploads/context | Payload schema gate | Every phase | No capture-context upload without approval |
| Store / account / release | Firebase/Firestore or alternative production storage | partial | Needed for cloud history/account data | Firebase setup or alternative ADR | Phase 23+ | Do not commit project IDs/secrets |
| Store / account / release | Account deletion | partial | Privacy requirement | Auth/storage backend | Phase 23+ | Must delete account/data on request |
| Store / account / release | StoreKit/paywall/quota | partial | Monetization | StoreKit phase and backend entitlement | Phase 23+ | No payment runtime without approval |
| Store / account / release | App Store privacy labels | planned | Release requirement | Final data collection matrix | Phase 23+ | Include cloud AI/photo processing disclosures |
| Store / account / release | Beta rollout checklist | planned | Safer TestFlight | QA matrix and incident controls | Phase 23+ | Production remains blocked |
| Store / account / release | TestFlight QA | planned | Release validation | Build/signing and QA plan | Phase 23+ | Avoid real cloud rollout until approved |
| Store / account / release | Legal/privacy review | planned | Compliance | Privacy policy and data retention | Phase 23+ | Required before real uploads |
| Advanced/future features | Paid AI image editing / 改圖師 | deferred | Possible premium feature | Product policy, provider safety, consent, cost | Later | Not MVP; no real image editing backend approved |
| Advanced/future features | High-quality export/transfer | deferred | Power-user feature | Export/storage/transfer design | Later | Avoid leaking metadata; user-controlled only |
| Advanced/future features | LiDAR/Core ML/on-device hybrid path | later | Advanced local guidance | Device support and model plan | Later | Local-first; no raw sensor persistence |
| Advanced/future features | Hong Kong / 麻煩友 language-mode productization | partial | Brand voice option | Product copy QA and settings policy | Later | Avoid explicit/profanity regression |
| Advanced/future features | Advanced retro effects | deferred | Creative expansion | Filter roadmap and performance tests | Later | Local filters preferred |
| Advanced/future features | Live voice or conversational guidance | deferred | Separate guidance product path | Voice privacy, WSS/session, UX scope | Later | Separate from Photo Advisor; no live cloud by default |
| Advanced/future features | Fine-tuning/LoRA/QLoRA | blocked | Possible quality improvement | Evaluation proves need, consent/training policy | Later | Only after opt-in/training governance exists |

## New Direction Added After Latest AI Discussion

The following direction is now recorded for future planning only:

- Qwen 3.5 35B-A3B MoE is the preferred future model target only if its vision-capable / VLM-compatible path is verified.
- Qwen2.5-VL remains the current correctness/reference baseline from local sandbox history.
- Qwen3-VL MoE is a fallback/candidate if the preferred Qwen 3.5 35B-A3B vision path is unavailable.
- Smaller Qwen 9B vision-capable models remain cost/latency fallback candidates; text-only Qwen models are blocked for image analysis.
- Non-thinking / instruct direct-output mode should be tested for lower latency and structured JSON stability.
- vLLM and SGLang are the future production-serving direction candidates; Ollama/LM Studio remain manual/local-only.
- Auto-Trigger Live Advisor should require device stillness greater than 1 second.
- If stable time is `<= 1s`, do not capture a frame and do not upload anything.
- Cloud frame analysis should be capped at max 1 FPS; do not treat the viewfinder as 30fps video.
- Future Live Advisor should use a stateful WSS bidirectional session protocol only after policy and privacy preflight.
- Frontend compression should happen before any future cloud upload; a starting target is around 1024px long edge and roughly 150KB-200KB JPEG preview frame, with exact values to be tested.
- INT4/INT8 quantization such as AWQ/GPTQ or equivalent should be added as a future serving benchmark dimension.
- Local on-device CV should handle millisecond camera aids: grid alignment, horizon/level, overexposed/underexposed warning, and basic motion/stability buckets while keeping camera preview smooth.
- Cloud VLM should handle higher-level composition, mood, and retro intent only after explicit consent and trigger gates.
- Consent/no-silent-upload remains a hard boundary.

## Phase 21-H2 Target Re-evaluation Result

Phase 21-H2 formalizes the above direction as a docs/gate-only policy:

- Qwen 3.5 35B-A3B MoE remains preferred only if vision-capable / VLM-compatible and multimodal serving is verified.
- Text-only Qwen remains blocked for image analysis.
- Qwen2.5-VL remains the current correctness/reference baseline.
- Non-thinking / instruct direct-output, structured output or deterministic structured mapping, quantization planning, and benchmark requirement are required before production claims.
- Auto-Trigger, WSS, image compression/upload, and local CV remain policy/planning boundaries only; no runtime is approved by Phase 21-H2.
- Recommended next phase becomes Phase 21-I: Image Compression + Upload Payload Policy Gate.

## Phase 21-I Upload Payload Policy Result

Phase 21-I formalizes the image compression/upload payload direction as a docs/gate/source-audit policy:

- Future cloud upload must use a compressed preview frame policy before runtime approval.
- Planning target remains around `1024px` long edge and roughly `150KB-200KB` JPEG preview frame, with exact values to be tested later.
- Metadata stripping, visible consent, retention/deletion dependency, backend mediation, Auto-Trigger linkage, and 1 FPS cloud-analysis policy are required.
- Original full-resolution upload is blocked by default; base64, raw path, GPS, raw EXIF, raw sensor, raw capture context, provider fields, model URL, API key, and raw prompt are blocked unless a later explicit phase approves a safe exception.
- The current source audit found an existing DEBUG post-capture compression/upload scaffold, but no new upload runtime, compression runtime, iOS payload change, Live Advisor runtime, endpoint, model call, Qwen inference, benchmark, or production rollout is approved by Phase 21-I.
- `productionReady:false` remains locked.

## Phase 21-J Auto-Trigger Policy Result

Phase 21-J formalizes the Auto-Trigger + 1 FPS Live Advisor direction as a docs/gate/source-audit policy:

- Future Auto-Trigger requires explicit Live Advisor opt-in/consent and local device/viewfinder stability.
- Stable time must be greater than 1 second before a future compressed preview can become eligible.
- Stable time less than or equal to 1 second means no frame capture, no upload, no backend call, and no model call.
- Cloud analysis remains capped at max 1 FPS and must not treat the viewfinder as 30fps video.
- Future uploads must follow the Phase 21-I compressed preview payload policy.
- Local iOS CV may handle fast aids locally, while cloud VLM remains gated for higher-level composition/mood/retro intent.
- The current source audit found local CoreMotion/capture-context and mock-only Camera snapshot scaffolds, but no Auto-Trigger runtime, live cloud Camera entry, WSS runtime, frame upload loop, model call, Qwen inference, benchmark, or production rollout is approved by Phase 21-J.
- `productionReady:false` remains locked.

## Phase 21-K Stateful WSS Protocol Result

Phase 21-K formalizes the Stateful WSS Live Advisor direction as a docs/gate/schema-policy/source-audit preflight:

- Future WSS is backend-mediated only and may carry session, consent, enabled/off, capability, stillness eligibility, throttle, server busy/backoff, structured advice, fallback/error, and `productionReady:false` buckets.
- WSS must not carry raw camera video, 30fps frames, raw original image, base64 image unless later approved, raw path, GPS, raw EXIF, raw sensor stream, raw prompt, raw model output, provider/model URL, API key, provider/model selection from iOS, raw backend payload, debug/provider leakage, or chain-of-thought.
- Session lifecycle is closed/off by default; consent must be known; backend sends policy/session limits; client sends bucketed state only until upload is separately approved; disabled/off state closes the session and blocks capture/upload/cloud calls.
- Server busy/backoff and retry rules must not create extra uploads, bypass max 1 FPS, retry when stillness is `<=1s`, retry after disable/off, or silently loop.
- The current source audit found no WSS/WebSocket runtime, no iOS WebSocket client, no backend WebSocket server, no live session state, and no raw video streaming path; existing Camera snapshot/mock files remain mock-only/pre-existing.
- `productionReady:false` remains locked.

## Phase 21-L Local On-device CV Camera Aids Plan Result

Phase 21-L formalizes the local on-device CV camera aids direction as a docs/gate/source-audit plan:

- Future local CV should handle fast on-device camera aids only: grid alignment hints, horizon/level guide, overexposed/underexposed warning, basic motion/stability buckets, and optional bucketed frame eligibility signal for a later approved Auto-Trigger phase.
- Camera preview smoothness remains the priority, with a future 60fps UI responsiveness target and fail-soft optional aids.
- Local CV must not upload anything, call backend, call model, persist raw frames, persist raw sensor streams, persist GPS, persist raw EXIF, or export raw capture context unless a later explicit phase approves a bucketed schema.
- Future Auto-Trigger may consume only a local bucketed stability signal; stillness `<=1s` still means no frame capture, no upload, no backend call, and no model call.
- Cloud VLM remains for higher-level composition, mood, retro intent, and optional action only after explicit consent and trigger/upload/WSS gates; it must not be used for 60fps preview analysis or receive raw video/sensor data.
- The current source audit found an existing rule-of-thirds grid overlay, local capture context/motion/level/exposure buckets, local/mock guidance building blocks, and mock/debug cloud scaffolds, but no new local CV runtime, Auto-Trigger runtime, Camera live cloud AI runtime, WSS runtime, upload runtime, compression runtime change, model call, Qwen inference, benchmark, or production rollout is approved by Phase 21-L.
- `productionReady:false` remains locked.

## Phase 21-M Quantization + Serving Benchmark Plan Result

Phase 21-M formalizes the quantization and serving benchmark direction as a docs/gate/source-audit plan:

- Future benchmark candidates include `qwen3_5_35b_a3b_moe_preferred` only after verified vision/VLM compatibility, `qwen2_5_vl_reference` as the current correctness baseline, `qwen3_vl_moe_fallback_candidate`, `qwen_9b_vision_fast_fallback`, and `text_only_qwen_blocked`.
- Future serving candidates are `transformers_fastapi_reference`, `vllm_primary_benchmark_candidate`, `sglang_structured_output_challenger`, and `ollama_lmstudio_manual_only`.
- Future quantization dimensions include FP16/BF16 baseline, INT8, INT4, AWQ, GPTQ, and equivalent supported quantization formats.
- Future benchmarks must use approved sanitized fixtures only, avoid real user photos, avoid raw prompt/model output/request payload/image/base64/path logs, and report sanitized aggregate metrics only.
- Schema validity, accepted/rejected counts, fallback rate, invalid schema rate, safety/fallback regression, latency buckets, throughput/concurrency, memory pressure, visual reasoning, Photo Advisor voice quality, and filter recommendation consistency remain required future metrics.
- The current source audit found no active vLLM/SGLang/Ollama production runtime, no quantized model deployment, no committed weights/config URLs/secrets, no production serving endpoint, and no iOS runtime dependency on serving stack choice; Transformers+FastAPI remains local/operator-only sandbox evidence.
- Phase 21-M adds no serving benchmark runtime, model download, model switch, `local_model` enablement, vLLM/SGLang/Ollama call, Qwen inference, fixture inference, iOS runtime dependency, endpoint, or production rollout.
- `productionReady:false` remains locked.

## Phase 21-N One-fixture Local Model Smoke Preflight Result

Phase 21-N was explicitly approved for exactly one backend local/private model route smoke, but the required preflight blocked execution:

- Ignored local config, ignored local fixture registry, and ignored local sample folder were present, ignored, untracked, and unstaged.
- Required preferred fixture token `smoke_001` was not present/approved in the ignored local fixture registry.
- No substitute fixture token was used.
- No healthz call, model call, retry, Qwen inference, serving benchmark, vLLM/SGLang/Ollama call, model download, model switch, iOS integration, endpoint, upload runtime, raw artifact, secret, or production rollout occurred.
- The sanitized blocked report is `docs/phase-21-n-one-fixture-local-model-smoke-report.md`.
- Recommended next phase is Phase 21-N-R0: One-fixture Local Model Smoke Preflight Block Resolution.
- `productionReady:false` remains locked.

## Phase 21-N-R0 smoke_001 Preflight Block Resolution Result

Phase 21-N-R0 inspected the ignored local prerequisites and kept the model-call boundary closed:

- Ignored local config, fixture registry, and sample folder were present, ignored, untracked, and unstaged.
- `smoke_001.*` fixture file was missing from the ignored local sample folder.
- The ignored local registry still does not have an approved `smoke_001` entry.
- No ignored local file was changed because the fixture file prerequisite is missing.
- No model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.
- Recommended next phase is Phase 21-N-R0B: Operator-provided smoke_001 Fixture Preparation.
- `productionReady:false` remains locked.

## Cross-reference Future Phases

These are proposed planning labels only. Because the current repo already contains a committed Phase 21-H dry-run plan, future operators should reconcile numbering before implementation.

- Phase 21-H: Qwen 3.5 35B-A3B MoE + Live Advisor Target Re-evaluation Gate
- Phase 21-I: Image Compression + Upload Payload Policy Gate
- Phase 21-J: Auto-Trigger + 1 FPS Live Advisor Policy Gate
- Phase 21-K: Stateful WSS Protocol Preflight
- Phase 21-L: Local On-device CV Camera Aids Plan
- Phase 21-M: Quantization + Serving Benchmark Plan
- Phase 22-A: Debug-only iOS Backend Integration Preflight
- Phase 23+: Beta / production readiness gates

## Do Not Change Implementation

This Phase 21-G2 register is docs-only. It does not add runtime code, iOS integration, Camera live cloud AI entry, Auto-Trigger runtime, WSS runtime, image upload, image compression runtime, app-facing endpoint, production endpoint, real user-photo upload, consent UI runtime, auth/billing/quota runtime, model training/fine-tuning, validator relaxation, fallback/safety relaxation, serving benchmark, Qwen inference, or model inference.

The external local VLM server workspace remains out of scope and must not be modified by this phase.

## Review Sources

This register was derived from the repo Markdown inventory and current source/script structure, including:

- `AGENTS.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/*.md`
- `docs/handoff/*.md`
- `docs/product/*.md`
- `docs/research/*.md`
- `docs/prompts/*.md`
- `tests/manual-smoke-tests.md`
- current iOS source tree
- `backend/src`
- `backend/scripts`
- `backend/package.json`
- `backend/tests`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`

## Production Boundary

`productionReady:false` remains locked. This register is not a production rollout, not iOS integration approval, not cloud upload approval, not live AI approval, not model-call approval, not serving benchmark approval, and not endpoint approval.
