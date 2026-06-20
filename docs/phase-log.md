# Phase Log

This file records the progress of each development phase.

Every Codex task must update this file before finishing.

---

## Current Status

Current phase: Phase 21-Z2G-SF - SiliconFlow Network/Parameter Latency Probe
Status: completed
Latest implementation: Phase 21-Z2G-SF runs approved backend-only SiliconFlow network/parameter latency probes with `smoke_004` only and retry `0`. It makes `5` successful escalated provider calls, confirms sequential same-process `fetch` compact `max_tokens:192` remains accepted but seconds-level (`8637ms`, `8529ms`), confirms `stream:true` gives TTFT `3979ms` but full validated JSON `9898ms`, and confirms ultra-short `max_tokens:80` and `50` fail schema. The backend contract remains compact prompt + `maxOutputTokens:192`; `productionReady:false` remains locked. No raw provider output, prompt, request payload, image/base64/path, API key, credential, raw report, iOS runtime change, upload payload change, live cloud AI runtime, app-facing endpoint, production endpoint, or production rollout is added.
Marker correction: Phase 21-W-R2 was implemented and pushed, but the visible commit marker was misspelled as `unavailabl`. This corrective marker commit restores the exact prerequisite marker `Phase 21-W-R2: diagnose controlled benchmark local model unavailable`. No model call, benchmark, endpoint call, external server edit, runtime change, raw artifact, secret, or production rollout occurred, and `productionReady:false` remains locked.
Mac/Xcode verification: Phase 01/02 build succeeded on 2026-06-09
Phase 03 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 04 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 05 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 06 build verification: attempted by Codex; sandboxed command-line builds failed due existing SwiftUI `#Preview` macro / CoreSimulator sandbox environment, not Phase 06 source errors; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 08 build verification: command-line Xcode simulator build succeeded on 2026-06-09 after the History tab environment object fix; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 09 build verification: user Xcode / Simulator build-run accepted on 2026-06-09
Phase 11 build verification: attempted by Codex; generic iOS Simulator build reached Swift compilation but failed due sandbox-exec / CoreSimulator environment restrictions, not a confirmed Phase 11 source error; user Xcode / Simulator run accepted on 2026-06-09
Phase 11B build verification: attempted by Codex; generic iOS Simulator build reached Swift compilation but failed due existing SwiftUI `#Preview` macro / CoreSimulator tooling issues, not a confirmed Phase 11B source error; user Xcode / Simulator run accepted on 2026-06-09
Phase 12B build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-09; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 13 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-09; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 14 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 14B build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 14C build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 15 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 15B build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 15C build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10; user Xcode / Simulator build-run accepted on 2026-06-10
Phase 15D build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 16 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 16A build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 16A-R build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-10
Phase 16A-R2 Final build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; final unsandboxed command-line build could not be completed because escalation was rejected by the current Codex usage/credits limit; earlier Phase 16A-R2 unsandboxed simulator build succeeded before the final bottom-spacing adjustment
Phase 16A-R3 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed build was not retried because the prior escalation path was rejected by the current Codex usage/credits limit
Phase 16A-R4 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; targeted Swift parse and verification scans passed; no real service integration was added
Phase 16A-R5 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; targeted Swift parse and verification scans passed; no real service integration was added
Phase 16A-R6 build verification: targeted Swift parse passed; sandboxed command-line Xcode build remains blocked by CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; unsandboxed build request was rejected by the current workspace credits limit
Phase 16A-R7 build verification: targeted Swift parse passed; sandboxed command-line Xcode build remains blocked by CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no real service integration was added
Phase 16A-R8 build verification: targeted Swift parse passed; sandboxed command-line Xcode build remains blocked by CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no real service integration was added
Phase 16A-R9 build verification: targeted Swift parse passed; sandboxed command-line Xcode build remains blocked by CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no real service integration was added
Phase 16A-R10 build verification: targeted Swift parse passed; sandboxed command-line Xcode build remains blocked by CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no real service integration was added
Phase 16E build verification: targeted Swift parse and safety scans passed during implementation; user Xcode / Simulator build-run and Pose Overlay MVP review accepted on 2026-06-11 after R1; no real AI / Vision / network / upload / persistence / export was added
Phase 16F verification: documentation-only research backfill; no Swift source, backend source, real AI, network, upload, persistence, export, API keys, or production config added
Phase 16G verification: targeted Swift parse and localization lint passed; user Xcode / Simulator verification temporarily accepted on 2026-06-11; no real AI, backend, network, upload, persistence, export, LUT, provider SDK, StoreKit, or production config added
Phase 16H-Recovery verification: documentation-only research backfill and handoff status fix; no Swift source, backend source, real AI, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16I verification: targeted Swift parse, localization lint, and command-line Xcode generic iOS Simulator build passed on 2026-06-11; no real AI, backend, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16I-R1 verification: targeted Swift parse, localization lint, and command-line Xcode generic iOS Simulator build passed on 2026-06-11; no real AI, backend, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16I-R2 verification: targeted Swift parse, localization lint, and command-line Xcode generic iOS Simulator build passed on 2026-06-11; no real AI, backend, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16J verification: documentation-only handoff update; no Swift source, backend source, real AI, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16K-L verification: targeted Swift parse, localization lint, safety scans, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; user Xcode / Simulator verification accepted on 2026-06-12; no real AI, backend, network, upload, persistence, export, API keys, provider SDK, StoreKit, or production config added
Phase 16N verification: documentation-only product policy backfill; no Swift source, backend source, real AI, network, upload, persistence, export, API keys, provider SDK, StoreKit, payment, LiDAR implementation, local model training, encrypted transfer implementation, image editing implementation, or production config added
Phase 16O verification: documentation-only research save; no Swift source, backend source, app behavior change, LiDAR implementation, Core ML implementation, ARKit implementation, local model training, real AI, network, upload, persistence, export, API keys, provider SDK, StoreKit, payment, or production config added
Phase 16P verification: documentation-only research save; no Swift source, backend source, app behavior change, export implementation, encrypted transfer implementation, CryptoKit prototype, backend, StoreKit, cloud storage, real upload, network, persistence, API keys, provider SDK, payment, or production config added
Phase 16Q verification: documentation-only research save; no Swift source, backend source, app behavior change, AI image editing implementation, mock UI implementation, prompt guard implementation, provider adapter, backend, StoreKit, OpenAI / Gemini / Stability integration, real upload, network, persistence, export, API keys, provider SDK, payment, quota, entitlement, moderation, or production config added
Phase 16R verification: documentation-only research save; no Swift source, backend source, app behavior change, language mode implementation, Settings UI implementation, copy resolver implementation, profanity mode implementation, localization runtime implementation, persistence change, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16S verification: documentation-only product / copy style guide save; no Swift source, backend source, app behavior change, language mode implementation, Settings UI implementation, copy resolver implementation, profanity mode implementation, localization runtime implementation, persistence change, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16T verification: localization lint, safety scans, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; Settings-only mock language / tone UI; no runtime language mode, Camera guidance integration, Photo Advisor copy integration, Filter Lab copy integration, copy resolver, explicit profanity enablement, persistence, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16T-R1 verification: localization lint, safety scans, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; Settings-only mock language / tone UI remains language-button-only with no runtime language switching, Camera guidance integration, Photo Advisor copy integration, Filter Lab copy integration, copy resolver, explicit profanity enablement, persistence, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16T-R2 verification: localization lint, safety scans, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; production-visible mock preview cards are removed from Settings Language / Tone UI with no runtime language switching, Camera guidance integration, Photo Advisor copy integration, Filter Lab copy integration, copy resolver, explicit profanity enablement, persistence, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16U verification: localization lint, safety scans, explicit profanity runtime scan, banned phrase scan, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; local-only deterministic camera coach copy resolver scaffold added with neutral runtime default, no app-wide language switching, Settings persistence, explicit profanity runtime, Camera frame upload, Photo Advisor copy integration, Filter Lab copy integration, image editing copy integration, backend, network, real AI, provider SDK, StoreKit, moderation implementation, runtime profanity filtering, or production config added
Phase 16V verification: localization lint, safety scans, persistence scope scan, explicit profanity runtime scan, banned phrase scan, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; persistence is limited to `cameraCoach.languageMode` and `cameraCoach.toneMode`; no app-wide language switching, explicit profanity runtime, raw image / frame persistence, Photo Advisor copy integration, Filter Lab copy integration, image editing copy integration, backend, network, real AI, provider SDK, StoreKit, export, or upload was added
Phase 16W verification: localization lint, safety scans, persistence scope scan, explicit profanity runtime scan, banned phrase scan, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; Photo Advisor mock/local copy now follows persisted language / tone preference; no app-wide language switching, explicit profanity runtime, raw image / frame persistence, Filter Lab copy integration, image editing copy integration, backend, network, real AI, provider SDK, StoreKit, export, or upload was added
Phase 16W-R2 verification: localization lint, safety scans, Camera local-only UI scan, persistence scope scan, explicit profanity runtime scan, banned phrase scan, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; Camera UI is local-only for AI guidance, Camera AI Snapshot / cloud-style quick advice entries are removed / hidden, Local Guidance remains language / tone aware, Inspiration / Photo Advisor remains language-aware, and no real AI, backend, network, upload, new persistence, explicit profanity runtime, provider SDK, StoreKit, export, or cloud AI was added
Phase 16X verification: localization lint, safety scans, Camera cloud-entry regression scan, persistence scope scan, explicit profanity runtime scan, banned phrase scan, and command-line Xcode generic iOS Simulator build passed on 2026-06-12; Inspiration is organized as a mock/local AI Hub, Camera remains local-only, Photo Advisor / future cloud AI home is Inspiration, and no real AI, backend, network, upload, new persistence, explicit profanity runtime, provider SDK, StoreKit, export, or cloud AI was added
Phase 17A verification: Cloud AI backend boundary skeleton only; no real provider call, no provider API key, no production-reachable iOS remote call, no real upload / storage, no request payload logging, and Camera remains local-only.
Phase 17B verification: debug-only remote chain added for local backend mock endpoint; production/default remains mock/local; no provider call, no provider API key, no Camera cloud AI entry, no storage upload, and no request payload logging.
Phase 17C-Prep verification: provider adapter boundary remains mock-only; backend request / response validation, filter whitelist validation, unsafe response guard, fallback contract, rate-limit / quota / timeout placeholders, redaction helpers, fixtures, and backend tests are in place; no real provider call, no provider API key, no production remote enablement, no storage upload, no request payload logging, and Camera remains local-only.
Phase 17C-R1 verification: active provider contract switched from the failed Code0 gateway attempt to the QweAPI OpenAI-compatible gateway; a safe text-only provider probe script was added; backend-only Photo Advisor internal beta path remains behind `ALLOW_INTERNAL_CLOUD_AI=true`, `CLOUD_AI_PROVIDER_MODE=qweInternal`, internal debug header, server-side `QWE_API_KEY`, validated `QWE_BASE_URL=https://qweapi.com`, and `QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview`; text-only QweAPI probe succeeds, and `gemini-3.1-flash-image-preview` image_url multimodal request returns a validated `source=cloud` Photo Advisor response; default remains mock/local; iOS has no provider key / SDK / direct QweAPI call; Camera remains local-only; no storage upload, request payload logging, provider raw response logging, Gemini Live, WebSocket, StoreKit, export, or production rollout was added.
Phase 17C-R2 verification: provider QA batch workflow added; local QA images and generated provider QA reports are ignored; QA script records sanitized latency / schema / safety / fallback metrics only; prompt wording was tightened for short, practical, non-poetic, locale-aware Photo Advisor output; backend tests and a four-locale tiny-image QA batch passed with no schema, safety, or invalid-filter failures; production/default remains mock/local; iOS has no provider key / SDK / direct QweAPI call; Camera remains local-only.
Phase 17C-R3 verification: generated five ignored synthetic local QA images and ran 20 real-provider QA cases across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK`; final QA report showed 17 cloud successes, 3 fallbacks, average latency 9963 ms, p50 4657 ms, p95 35803 ms, max 44980 ms, 0 schema failures, 0 safety metadata failures, 0 invalid filter IDs, fallback reasons 2 `unsafe_response` and 1 `provider_timeout`; prompt wording was further tightened to avoid attractiveness / face / skin / age / gender / emotion / health / identity wording; p95 latency and unsafe fallbacks remain production rollout blockers; generated images and report remain ignored.
Phase 17C-R4 verification: provider QA reporting now includes p90 / p95 / max latency, timeout count, unsafe-response count, fallback category counts, normalized per-case latency / fallback buckets, and a latency assessment for debug QA / internal testing / production readiness; timeout thresholds are centralized for reporting without raising provider timeouts; manual review template now records fixture name, locale, provider status, fallback code, latency bucket, language naturalness, filter fit, crop / framing usefulness, safety concern, and notes; latest real-provider QA run showed 20 cases, 18 cloud successes, 2 `unsafe_response` fallbacks, average latency 4969 ms, p50 4958 ms, p90 5421 ms, p95 5894 ms, max 6778 ms, 0 timeouts, 0 schema failures, 0 safety metadata failures, and 0 invalid filter IDs; production rollout remains blocked by fallback rate, unsafe-response QA, and manual language / filter-fit review.
Phase 17C-R5 verification: Photo Advisor prompt was tightened to allowed photo-only topics, unsafe guard diagnostics now emit safe labels only, QA reports include `unsafeByCategory` and per-case `unsafeCategory`, approved real sample photos have a local ignored workflow under `backend/tests/approved-real-samples/`, and QA script supports `--image-set=synthetic`, `--image-set=approved-real`, and `--image-set=all`; latest real-provider synthetic QA run showed 20 cases, 19 cloud successes, 1 `provider_invalid_json` fallback, 0 `unsafe_response` fallbacks, average latency 6130 ms, p50 4842 ms, p90 5837 ms, p95 9637 ms, max 24372 ms, 0 timeouts, 0 schema failures, 0 safety metadata failures, and 0 invalid filter IDs; production rollout remains blocked by manual language review, approved real sample review, filter / crop usefulness review, cost guard, abuse guard, privacy review, and explicit user approval.
Next phase: Use `docs/phase-roadmap-sequencing-and-next-action-register.md` before choosing the next implementation phase. Current next recommended phase is Phase 21-Z2H-SF: SiliconFlow Latency Architecture Decision Gate. Any further provider API calls, API key use beyond local ignored context, provider diagnosis, alternative model benchmark, image upload, model call, benchmark, RunPod provisioning, Qwen3 install/download/load/call, inference endpoint call, iOS integration, upload payload change, app-facing endpoint, production endpoint, or production rollout requires separate explicit approval before execution. Production rollout is still blocked. Future prompts can say "Read AGENTS.md and follow all project rules" to inherit the consolidated safety/language boundaries. Do not start production rollout, Camera cloud AI, Gemini Live, StoreKit, payment, export, backend capture-context upload, iOS upload payload changes, app integration, app-facing/public/production work, real user-photo upload, auth/billing/quota runtime, serving-stack benchmark execution beyond an explicitly approved future scope, provider API calls, model downloads, model cache changes, Qwen inference beyond an explicitly approved benchmark, fixture inference beyond explicit approval, local CV runtime, Auto-Trigger runtime, WSS runtime, image upload/compression runtime, RunPod provisioning, or user-photo training / fine-tuning until explicitly requested.

---

## Phase 21-Z - Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-Z prepares the Asia-first RunPod A100 80GB deployment gate for a later `Qwen3-VL-30B-A3B` benchmark. It is docs/config-shape/security/operator-checklist work only and does not create RunPod resources, provision cloud GPU, install/download/load/call Qwen3, run model calls, run benchmarks, call inference endpoints, or change iOS runtime.

### Completed Work

- Added `docs/phase-21-z-asia-first-runpod-a100-qwen3-vl-deployment-prep-without-model-calls.md`.
- Added `backend/config/open-weight-vlm.runpod.example.json` as a placeholder-only bucket config with no raw URL, real region ID, provider ID, account ID, API key, SSH key, token, credential, model path, or secret.
- Defined Asia-first RunPod selection checklist for Korea/Taiwan/Hong Kong, Asia-near backend/GPU region preference, A100 availability, price, daily/monthly/storage cost, cold-start risk, fallback, no public endpoint, budget hard stop, manual kill switch, and no committed credentials.
- Defined provider/GPU fallback order: RunPod A100 Asia-near primary, RunPod H100 Asia-near short benchmark if needed, RunPod A100 US West fallback only, 48GB quantized experiment later, Vast.ai cheap experiment later, and Lambda/AWS/GCP reliability/compliance/cost comparison later.
- Defined no-model contract plan for healthz, contract echo, route-contract dry-run, fixture-token-only benchmark interface, and sanitized cloud/resource/queue/budget buckets.
- Added cloud security, network exposure, storage/cache, batch/queue startup-shutdown, budget guardrail, localization QA, no-raw-artifact, future Z1, and future Z2 benchmark gates.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `backend/config/open-weight-vlm.runpod.example.json`
- `docs/phase-21-z-asia-first-runpod-a100-qwen3-vl-deployment-prep-without-model-calls.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- `git status`
- `git diff --check`
- Backend tests
- No-model scans for secrets, artifacts, iOS provider/model calls, Camera cloud entry, payload drift, committed RunPod raw URLs, real region IDs, and staged local artifacts

### Known TODOs

- Phase 21-Z1 should happen only after explicit user approval to inspect/provision a RunPod instance or verify provider-console pricing.
- Phase 21-Z2 benchmark requires separate explicit approval for any Qwen3 install/download/load/call, exact 12 fixtures, call count `12`, retry `0`, sanitized aggregate only, and Asia user-perspective latency metrics.

Ready for Phase 21-Z1: Asia-first RunPod Instance Security + No-model Contract Gate. Any RunPod provisioning, provider-console/API mutation, pricing verification through a provider console, model call, model install/download/load, benchmark, or inference endpoint call requires separate explicit approval.

---

## Phase 21-Z-R1 - API-first Serverless VLM Alternative Re-evaluation Gate

Status: completed
Date: 2026-06-19

### Summary

Phase 21-Z-R1 adds a docs-only re-evaluation gate for API-first serverless VLM providers before any RunPod provisioning or Qwen3 setup. SiliconFlow and DashScope / Alibaba Cloud Model Studio are candidate providers only, and RunPod A100 80GB remains the self-hosted fallback/comparison path.

### Completed Work

- Added `docs/phase-21-z-r1-api-first-serverless-vlm-alternative-evaluation-gate.md`.
- Defined API-first workload assumptions for post-capture/imported 512px-class Photo Advisor calls.
- Added candidate matrix for SiliconFlow, DashScope / Alibaba Cloud Model Studio, and RunPod A100 80GB fallback/comparison.
- Added formula-only cost model gate and required later pricing inputs.
- Added privacy/legal/data-governance gates for backend-only third-party photo processing.
- Added product-mode boundaries blocking live camera cloud AI, 0.8 FPS upload, silent upload, WSS runtime, Auto-Trigger runtime, background upload, and capture-context upload by default.
- Added provider-agnostic adapter plan for `siliconflow`, `dashscope`, and `runpod_self_hosted_fallback`.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-z-r1-api-first-serverless-vlm-alternative-evaluation-gate.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Safety Notes

- Provider API calls executed: no
- SiliconFlow API call: no
- DashScope / Alibaba Cloud API call: no
- API keys created or committed: no
- Provider SDK added to iOS or backend runtime: no
- RunPod resources created: no
- Cloud GPU provisioned: no
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called: no
- Model calls executed: no
- Benchmark executed: no
- Real inference endpoint called: no
- Images uploaded: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- Raw artifacts, credentials, provider URLs, account IDs, region IDs, prompts, outputs, request payloads, or secrets committed: no
- `productionReady:false` remains locked.

### Verification

- [x] Repo preflight was clean and upstream sync was `0 0` before edits.
- [x] Phase 21-Z was already committed and pushed, so this was added as Phase 21-Z-R1.
- [x] Documentation-only changes; no provider/API/model/runtime commands were run as part of implementation.
- [x] `git diff --check` passed.
- [x] Backend tests passed with 335/335.
- [x] Secret scan, artifact/boundary scan, iOS provider/model scan, Camera cloud entry scan, and backend/iOS payload unchanged scan passed with no runtime/source diff.

### Known TODOs

- Phase 21-Z2A should verify SiliconFlow / DashScope account feasibility, pricing, terms, retention/training policy, Asia latency expectations, rate limits, and structured-output behavior without model calls or benchmarks.
- Phase 21-Z2B should add no-model adapter contract gates before any API benchmark.
- Phase 21-Z2C requires separate explicit approval before any provider API VLM benchmark, model call, or fixture execution.
- Phase 21-Z1 RunPod instance security/no-model contract gate remains available as fallback/comparison and requires separate explicit approval before provisioning or provider-console/API mutation.

### Ready for Next Phase

Yes, for Phase 21-Z2A account/pricing/terms verification planning only. Any provider API call, key creation, provider SDK/runtime implementation, image upload, model call, benchmark, RunPod provisioning, Qwen3 install/download/load/call, iOS integration, upload payload change, or production rollout requires separate explicit approval.

---

## Phase 21-Z2A-SF - Consolidate SiliconFlow Qwen3-VL API Research and Model Selection Gate

Status: completed
Date: 2026-06-20

### Summary

Phase 21-Z2A-SF consolidates the operator-provided GPT and Gemini SiliconFlow Qwen3-VL research drafts into one repo-owned docs-only research gate. The phase uses v1 as the conservative master source and merges useful v2 details only with safety and verification caveats.

### Completed Work

- Added `docs/phase-21-z2a-sf-siliconflow-qwen3-vl-api-research-and-model-selection-gate.md`.
- Recorded `primaryProvider:siliconflow`, `primaryModel:Qwen/Qwen3-VL-30B-A3B-Instruct`, `providerMode:api_serverless`, `runpodStatus:fallback_comparison`, `productMode:post_capture_imported_photo_only`, `liveCameraCloudAI:blocked`, and `productionReady:false`.
- Captured model-page research facts for availability, Vision-Language MoE shape, FP8 precision, 262K context/output limits, serverless/image support, JSON-mode/structured-output caveats, tool support, and model-page pricing.
- Preserved the conservative JSON stance: provider output is untrusted, JSON mode is optional future flag only, structured output is not trusted, backend parser/schema/fallback remain source of truth.
- Consolidated SiliconFlow multimodal request shape, `image_url` support, `detail:"low"` first benchmark setting, and no raw image/base64/prompt/output/request-payload logging policy.
- Consolidated alternative shortlist: `Qwen/Qwen3-VL-32B-Instruct`, `Qwen/Qwen3-VL-8B-Instruct`, and optional `zai-org/GLM-4.5V` challenger.
- Excluded PaddleOCR-VL, OCR-only/document models, text-only Qwen models, and unverified InternVL/DeepSeekVL2 variants from the first Photo Advisor benchmark.
- Added backend-only `SiliconFlowPhotoAdvisorProvider` implications and sanitized error buckets.
- Added cost formula, model-page pricing caveats, HK/TW/KR latency considerations, privacy/legal/data-governance caveats, future benchmark plan, and next engineering phase.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-z2a-sf-siliconflow-qwen3-vl-api-research-and-model-selection-gate.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Safety Notes

- Provider API calls executed: no
- SiliconFlow API call: no
- API key created or committed: no
- Provider account created: no
- Provider SDK/runtime added: no
- Image upload: no
- Model calls executed: no
- Benchmark executed: no
- Real inference endpoint called: no
- RunPod provisioned: no
- Qwen3-VL-30B-A3B locally installed/downloaded/loaded/called: no
- vLLM/SGLang/Ollama run: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- Raw artifacts, provider URLs, account IDs, billing IDs, region IDs, prompts, outputs, request payloads, credentials, or secrets committed: no
- `productionReady:false` remains locked.

### Verification

- [x] Repo preflight was clean and upstream sync was `0 0` before edits.
- [x] Required history markers were present for Phase 21-Z-R1, Phase 21-Z, Phase 21-Y-R1, and Phase 21-W-FINAL-R2.
- [x] Both operator-provided research drafts were available and incorporated.
- [x] Documentation-only changes; no provider/API/model/runtime commands were run as part of implementation.
- [x] `git diff --check` passed.\n- [x] Backend tests passed with 335/335.\n- [x] Secret scan, artifact/provider URL scan, iOS provider/model scan, Camera cloud entry scan, and backend/iOS payload unchanged scan passed with no runtime/source diff.

### Known TODOs

- Phase 21-Z2B-SF should add backend-only no-runtime SiliconFlow adapter contracts and tests without API calls, API keys, provider account creation, image upload, benchmark, iOS integration, or production endpoint.
- Phase 21-Z2C-SF requires separate explicit approval before any live SiliconFlow 12-fixture benchmark using active credentials and external network access.
- Legal/privacy review remains required before any real user-photo upload or beta.

### Ready for Next Phase

Yes, for Phase 21-Z2B-SF no-runtime backend adapter contract planning only. Any provider API call, API key creation, provider account creation, image upload, model call, benchmark, provider runtime, iOS integration, upload payload change, RunPod provisioning, Qwen3 install/download/load/call, or production rollout requires separate explicit approval.

---

## Phase 21-Z2B-SF - SiliconFlow No-runtime Backend Adapter Contract Gate

Status: completed
Date: 2026-06-20

### Summary

Phase 21-Z2B-SF adds backend-only SiliconFlow no-runtime provider contracts. It records JavaScript / Node.js as the implementation path, adds inert request-shape construction for the operator-provided OpenAI-compatible SiliconFlow `/chat/completions` endpoint, and keeps all provider runtime execution blocked.

### Completed Work

- Added `docs/phase-21-z2b-sf-siliconflow-no-runtime-backend-adapter-contract-gate.md`.
- Added backend provider/model enums for `local_stub`, `local_model`, `siliconflow`, `runpod_self_hosted_fallback`, no-runtime/provider modes, and Qwen3/GLM model candidates.
- Added fail-closed SiliconFlow config validation with `enabled:false`, `allowNetworkCalls:false`, `allowImageUpload:false`, `allowLiveCamera:false`, `allowJsonModeForVlm:false`, `maxOutputTokens:256`, `imageDetail:low`, and `productionReady:false`.
- Added sanitized JavaScript / Node.js request-shape builder for `endpointBucket:siliconflow_chat_completions`, `baseUrlEnvName:SILICONFLOW_BASE_URL`, `apiKeyEnvName:SILICONFLOW_API_KEY`, `method:POST`, `path:/chat/completions`, placeholder prompts/image reference only, `executionAllowed:false`, and `networkCallsMade:false`.
- Added OpenAI-compatible response text extraction, defensive JSON parsing, existing Photo Advisor schema validation, semantic-key-only acceptance, and fallback rejection for invalid/unsafe synthetic outputs.
- Added sanitized provider error buckets and synthetic error mapping.
- Added fail-closed readiness CLI and package scripts `qa:siliconflow:readiness` and `qa:siliconflow:contract`.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-siliconflow-photo-advisor-provider-readiness.mjs`
- `backend/src/providers/photoAdvisorProviderTypes.mjs`
- `backend/src/providers/siliconflowPhotoAdvisorErrors.mjs`
- `backend/src/providers/siliconflowPhotoAdvisorProviderContract.mjs`
- `backend/tests/siliconflow-photo-advisor-provider-contract.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-z2b-sf-siliconflow-no-runtime-backend-adapter-contract-gate.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Safety Notes

- Provider API calls executed: no
- SiliconFlow API call: no
- API key created or committed: no
- Provider account created: no
- Provider SDK/runtime execution added: no
- Image upload: no
- Model calls executed: no
- Benchmark executed: no
- Real inference endpoint called: no
- RunPod provisioned: no
- Qwen3-VL-30B-A3B locally installed/downloaded/loaded/called: no
- vLLM/SGLang/Ollama run: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- Raw artifacts, provider URLs, account IDs, billing IDs, region IDs, prompts, outputs, request payloads, credentials, or secrets committed: no
- `productionReady:false` remains locked.

### Verification

- [x] Repo preflight was clean and upstream sync was `0 0` before edits.
- [x] Required history markers were present for Phase 21-Z2A-SF, Phase 21-Z-R1, and Phase 21-W-FINAL-R2.
- [x] `npm run qa:siliconflow:contract` passed.
- [x] `npm run qa:siliconflow:readiness` passed fail-closed with `networkCallsMade:false`, `modelCallsMade:false`, `benchmarkRun:false`, and `productionReady:false`.
- [x] Full backend tests passed with 343/343.
- [x] `git diff --check`, package JSON parse, secret scan, artifact scan, provider URL/API key scan, iOS direct provider/model scan, Camera cloud entry scan, and backend/iOS payload unchanged scan passed with no runtime/source drift. The only provider URLs are the operator-provided documentation references recorded for future approved runtime work.

### Known TODOs

- Phase 21-Z2C-SF should draft the explicit approval request for a future SiliconFlow 12-fixture API benchmark.
- Any live SiliconFlow API call, API key setup, provider account creation, image upload, model call, benchmark, provider runtime, iOS integration, upload payload change, RunPod provisioning, Qwen3 install/download/load/call, or production rollout still requires separate explicit approval.
- Legal/privacy review remains required before any real user-photo upload or beta.

### Ready for Next Phase

Yes, for Phase 21-Z2C-SF approval-request drafting only. Any provider API call, API key creation, provider account creation, image upload, model call, benchmark, provider runtime, iOS integration, upload payload change, RunPod provisioning, Qwen3 install/download/load/call, or production rollout requires separate explicit approval.

---

## Phase 21-Z2C-SF - Approval Request Draft for SiliconFlow 12-fixture API Benchmark

Status: completed
Date: 2026-06-20

### Summary

Phase 21-Z2C-SF adds a docs-only approval request draft for a future SiliconFlow 12-fixture API benchmark. The draft does not approve execution by itself and does not call SiliconFlow, read or create API keys, upload images, run a model, run a benchmark, execute provider runtime, or change iOS.

### Completed Work

- Added `docs/phase-21-z2c-sf-siliconflow-12-fixture-api-benchmark-approval-request.md`.
- Defined exact future benchmark scope: SiliconFlow, `Qwen/Qwen3-VL-30B-A3B-Instruct`, endpoint bucket `siliconflow_chat_completions`, OpenAI-compatible API style, JavaScript / Node.js backend only, post-capture/imported-photo only, fixtures `smoke_004` through `smoke_015`, fixture count `12`, call count `12`, retry count `0`, image detail `low`, `stream:false`, `maxOutputTokens:256`, `temperature:0.1`, parser/validator/fallback required, sanitized aggregate report only, no iOS integration, no live camera upload, and `productionReady:false`.
- Added exact copyable approval wording for `Phase 21-Z2C-SF-RUN`.
- Added operator confirmation checklist covering paid quota, local ignored backend-only API key handling, no real user photos, exact fixture set, retry `0`, and no iOS integration.
- Added required local/ignored prerequisites for a future execution phase.
- Added future sanitized aggregate output format, including raw-output/image/payload/API-key printed/persisted flags.
- Added future failure gates and success criteria.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-z2c-sf-siliconflow-12-fixture-api-benchmark-approval-request.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Safety Notes

- Provider API calls executed: no
- SiliconFlow API call: no
- API key created/read/printed/stored/committed: no
- Provider account created: no
- Provider SDK/runtime execution added: no
- Image upload: no
- Model calls executed: no
- Benchmark executed: no
- Real inference endpoint called: no
- RunPod provisioned: no
- Qwen3-VL-30B-A3B locally installed/downloaded/loaded/called: no
- vLLM/SGLang/Ollama run: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- Raw artifacts, provider credentials, account IDs, billing IDs, region IDs, prompts, outputs, request payloads, or secrets committed: no
- `productionReady:false` remains locked.

### Verification

- [x] Repo preflight was clean and upstream sync was `0 0` before edits.
- [x] Required history markers were present for Phase 21-Z2B-SF, Phase 21-Z2A-SF, Phase 21-Z-R1, and Phase 21-W-FINAL-R2.
- [x] `git diff --check` passed.
- [x] Backend tests passed with 343/343.
- [x] SiliconFlow contract tests passed with 8/8.
- [x] SiliconFlow readiness CLI passed fail-closed with `networkCallsMade:false`, `modelCallsMade:false`, `benchmarkRun:false`, and `productionReady:false`.
- [x] Secret scan, artifact scan, provider URL/API key scan, iOS direct provider/model scan, Camera cloud entry scan, and backend/iOS payload unchanged scan passed; findings were existing historical safety text or docs-only boundary wording, not runtime/source drift.

### Known TODOs

- Phase 21-Z2C-SF-RUN requires separate explicit approval using the recorded wording before any live SiliconFlow API call, API key use, image upload, model call, or benchmark.
- Future RUN phase must verify local ignored credentials, provider readiness, budget cap, terms/pricing caveats, exact fixture scope, retry `0`, raw logging blocks, and no iOS/upload changes.

### Ready for Next Phase

Yes, for Phase 21-Z2C-SF-RUN only after separate explicit approval. Without that approval, do not call SiliconFlow APIs, read/use API keys, upload images, run model calls, run benchmarks, execute provider runtime, or change iOS/upload behavior.

---

## Phase 21-Z2C-SF-RUN-PRE - SiliconFlow Benchmark Dry-run Gate

Status: completed
Date: 2026-06-20

### Summary

Phase 21-Z2C-SF-RUN-PRE adds the missing no-network dry-run gate required before retrying the approved SiliconFlow 12-fixture API benchmark. It is preflight repair only and does not execute the benchmark.

### Completed Work

- Added a deterministic no-runtime SiliconFlow benchmark plan for `Phase 21-Z2C-SF-RUN-PRE`.
- Pinned future RUN scope to SiliconFlow, `Qwen/Qwen3-VL-30B-A3B-Instruct`, fixtures `smoke_004` through `smoke_015`, planned calls `12`, actual calls `0`, retry `0`, image detail `low`, stream `false`, max output tokens `256`, and temperature `0.1`.
- Added fail-closed evaluation blockers for fixture mismatch, call-count mismatch, retry mismatch, benchmark approval, execution enablement, network calls, API key reads, fixture image reads, and `productionReady:true`.
- Added a sanitized dry-run CLI that prints no provider URL, API key, fixture path, raw image/base64, raw prompt, request payload, or provider response.
- Added dry-run tests covering exact fixture tokens, zero actual calls, no API key read, no fixture image open, no fetch call, sanitized output, and unsafe mutation failures.
- Added package scripts for the dry-run CLI and benchmark-plan tests.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-siliconflow-photo-advisor-benchmark-dry-run.mjs`
- `backend/src/providers/siliconflowPhotoAdvisorBenchmarkPlan.mjs`
- `backend/tests/siliconflow-photo-advisor-benchmark-dry-run.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Boundary Notes

- Provider API calls executed: no
- Model calls executed: no
- Real benchmark executed: no
- API keys created/read/printed/committed: no
- Provider runtime execution added: no
- Image upload executed: no
- Fixture images opened: no
- iOS runtime changed: no
- Upload payload changed: no
- Live camera cloud AI added: no
- Raw artifacts committed: no
- Secrets committed: no
- `productionReady:false`

### Verification

- `git status`
- `git diff --check`
- backend tests
- SiliconFlow provider contract tests
- SiliconFlow readiness CLI
- SiliconFlow benchmark dry-run CLI
- SiliconFlow benchmark-plan tests
- secret/artifact/provider/iOS/Camera/payload scans

### Known TODOs

- Phase 21-Z2C-SF-RUN retry still requires the recorded approval phrase, local ignored API key, network approval, fixture readiness, budget cap, terms/pricing acknowledgement, and sanitized reporting only.
- Production rollout remains blocked.

### Ready for Next Phase

Yes, for Phase 21-Z2C-SF-RUN retry only after this dry-run gate passes and the recorded approval/prerequisites remain satisfied. Do not proceed to real SiliconFlow API calls, API key use, image upload, model calls, or benchmark execution unless the future RUN phase is explicitly active.

---

## Phase 21-Z2C-SF-RUN - Approved SiliconFlow 12-fixture API Benchmark

Status: completed with provider schema validation rejections
Date: 2026-06-20

### Summary

Phase 21-Z2C-SF-RUN completed the approved SiliconFlow 12-fixture API benchmark after RUN-PRE existed and passed. The runner made exactly 12 approved API attempts, used retry count `0`, and emitted sanitized aggregate output only.

### Completed Work

- Verified repo clean/upstream sync `0 0`.
- Verified Phase 21-Z2C-SF and Phase 21-Z2C-SF-RUN-PRE commits were present.
- Verified exact approval phrase was present in the Codex session.
- Verified local ignored `backend/.env.local` had `SILICONFLOW_API_KEY` present without printing the key.
- Verified approved fixture tokens `smoke_004` through `smoke_015` were present.
- Ran exactly 12 SiliconFlow API attempts with model `Qwen/Qwen3-VL-30B-A3B-Instruct`, image detail `low`, stream `false`, max output tokens `256`, temperature `0.1`, and retry `0`.
- Added sanitized result doc `docs/phase-21-z2c-sf-run-siliconflow-12-fixture-api-benchmark-summary.md`.
- Updated roadmap, handoff, manual smoke tests, README, backend README, iOS README, and phase log.

### Sanitized Aggregate Result

- Planned call count: `12`
- Actual call count: `12`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `12`
- Validation buckets: `provider_schema_invalid x12`
- Fallback buckets: `provider_validation_rejected x12`
- Error buckets: none
- Latency buckets: `5s_to_15s x12`
- Token usage bucket: `lte_20k`
- Cost estimate bucket: `usage_available_cost_not_computed`
- `networkCallsMade:true`
- `productionReady:false`

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-z2c-sf-run-siliconflow-12-fixture-api-benchmark-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Safety Notes

- Provider API calls attempted: yes, exactly `12`
- Retry count: `0`
- Raw provider response printed/persisted: no
- Raw prompt printed/persisted: no
- Raw request payload printed/persisted: no
- Raw image/base64/path printed/persisted: no
- API key printed/persisted/committed: no
- Provider account details printed/persisted: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- RunPod provisioned: no
- vLLM/SGLang/Ollama run: no
- `productionReady:false` remains locked.

### Known TODOs

- Phase 21-Z2D-SF should review why all 12 provider responses failed backend schema validation and whether a separately approved prompt/schema-alignment phase is justified before any rerun or iOS planning.
- Do not rerun the benchmark, run alternative models, or start iOS integration without separate explicit approval.

### Ready for Next Phase

Yes, for Phase 21-Z2D-SF review/decision only. Not ready for production rollout.

---

## Phase 21-Z2D-SF - SiliconFlow Benchmark Review and Provider Decision Gate

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-Z2D-SF reviews the approved SiliconFlow benchmark result without rerunning API calls. It classifies the Phase 21-Z2C-SF-RUN outcome as `provider_output_schema_alignment_failed`: provider/model calls reached the runtime path, but every provider response was rejected by the strict backend Photo Advisor schema.

### Completed Work

- Added `docs/phase-21-z2d-sf-siliconflow-benchmark-review-and-provider-decision-gate.md`.
- Recorded that the executed benchmark had planned calls `12`, actual attempts `12`, retry `0`, accepted `0`, rejected `12`, validation bucket `provider_schema_invalid x12`, fallback bucket `provider_validation_rejected x12`, latency `5s_to_15s x12`, token usage bucket `lte_20k`, and cost bucket `usage_available_cost_not_computed`.
- Interpreted the result as schema/prompt/parser alignment failure rather than network/auth/base URL failure.
- Recorded that this is not proof SiliconFlow is unusable, not proof Qwen3-VL quality is bad, and not production readiness.
- Listed likely sanitized failure layers: weak exact JSON forcing, prose around JSON, unsupported enums, old field names, missing/extra fields, nested object shape mismatch, free-form text instead of semantic keys, safety/score/debug leakage, parser extraction limits, JSON mode unreliability, and intentional strict backend schema rejection.
- Kept SiliconFlow as primary provider candidate and `Qwen/Qwen3-VL-30B-A3B-Instruct` as primary model candidate.
- Kept RunPod as fallback/comparison.
- Set next safe phase to `Phase 21-Z2D-SF-R1: SiliconFlow Prompt and Schema Alignment Gate Without API Calls`.
- Updated roadmap, handoff, manual smoke tests, README, backend README, iOS README, and phase log.

### Safety Notes

- Provider API calls executed in this phase: no
- Model calls executed in this phase: no
- Benchmark executed in this phase: no
- API key created/read/printed/committed: no
- Raw provider output printed/persisted: no
- Raw prompt/request/image printed/persisted: no
- Fixture images opened: no
- EXIF/GPS/sensor data inspected: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- RunPod provisioned: no
- vLLM/SGLang/Ollama run: no
- `productionReady:false` remains locked.

### Known TODOs

- Phase 21-Z2D-SF-R1 should tighten the prompt/schema contract with synthetic provider-like strings only.
- Do not rerun SiliconFlow, read API keys, upload images, benchmark, run alternative models, or start iOS integration without separate explicit approval.

### Ready for Next Phase

Yes, for Phase 21-Z2D-SF-R1 prompt/schema alignment without API calls. Not ready for production rollout.

## Phase 21-Y-R1 - Asia-first RunPod Region Selection Gate

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-Y-R1 adds the Asia-first service audience constraint to the RunPod/Qwen3 target runtime plan. Initial users are Korea, Taiwan, and Hong Kong, so Phase 21-Z must evaluate Asia-near availability, pricing, and result-ready latency rather than treating US/EU GPU capacity as the first user-latency baseline.

### Completed Work

- Added `docs/phase-21-y-r1-asia-first-runpod-region-selection-gate.md`.
- Updated the Phase 21-Y RunPod/Qwen3 plan with `userRegionBucket:korea_taiwan_hong_kong`, `backendRegionPreference:asia_near`, and `gpuRegionPreference:asia_near`.
- Recorded provider/GPU preference: RunPod A100 80GB Asia-near first, Japan/Tokyo-like or Korea/Seoul-like region if available, Singapore-like Asia second, US West fallback only.
- Recorded fallback plan: RunPod H100 80GB Asia-near short benchmark if A100 latency/availability fails, 48GB GPU only for later quantized experiments, Vast.ai only as later cheap experiment, and Lambda/AWS/GCP only for later reliability/compliance/cost comparison.
- Added Phase 21-Z selection gate requirements for A100 Asia-near availability, current price, daily 2-3 hour estimate, storage/cache cost, fallback decision, no public inference endpoint, budget hard stop, manual kill switch, and no committed credentials.
- Added Asia user-perspective latency/cost measurement buckets: app/user region, backend region, GPU region, queue wait, cold start, warm start, p50/p95 result-ready time, and cost per accepted result.
- Added localization QA constraints for Hong Kong Traditional Chinese tone, Taiwan Traditional Chinese tone, Korean output QA, English fallback only, no harsh retake-first language, no score/rating/aesthetic grading, and no sensitive inference.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-y-runpod-a100-qwen3-vl-runtime-and-batch-queue-plan.md`
- `docs/phase-21-y-r1-asia-first-runpod-region-selection-gate.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- `git status`
- `git diff --check`
- Backend tests
- No-model scans for secrets, artifacts, iOS provider/model calls, Camera cloud entry, and payload drift

### Known TODOs

- Phase 21-Z should remain no-provisioning by default and verify Asia-near RunPod A100 availability/cost before creating resources.
- Any RunPod provisioning, model install/download/load/call, benchmark, or inference endpoint call requires separate explicit approval.

Ready for Phase 21-Z: Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls. Any RunPod provisioning, model call, model install/download/load, benchmark, or inference endpoint call requires separate explicit approval.

## Phase 21-Y - RunPod A100 Qwen3-VL Runtime + Batch Queue Plan

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-Y converts the Phase 21-X latency decision into a target runtime plan. The current Qwen2.5 / existing Qwen VLM Transformers+FastAPI path remains the backend correctness baseline, while the next target benchmark path moves to RunPod on-demand A100 80GB with `Qwen3-VL-30B-A3B` as the candidate model and post-capture batch/queue Photo Advisor as the first product-serving pattern.

### Completed Work

- Added the RunPod A100 80GB target runtime plan.
- Selected `Qwen3-VL-30B-A3B` as the target benchmark candidate for the next path.
- Retained the current Qwen2.5 / existing Qwen VLM path as a correctness baseline only.
- Defined the docs-only batch/queue architecture: iOS submits only through a future backend-mediated flow, backend queues jobs, GPU worker processes during scheduled windows, and validated result-card data returns after safety/schema checks.
- Recorded cost planning assumptions: daily 2-3 hour GPU windows and roughly `$80-$170/month` class, subject to pricing verification before purchase.
- Defined future benchmark dimensions for `smoke_004` through `smoke_015`, call count `12`, retry `0`, sanitized aggregate only, and comparison against Phase 21-W baseline.
- Kept Transformers+FastAPI as the first portability/correctness stack while deferring vLLM/SGLang compatibility checks.
- Recommended Phase 21-Z: RunPod A100 Qwen3-VL Deployment Prep Without Model Calls.
- Added `docs/phase-21-y-runpod-a100-qwen3-vl-runtime-and-batch-queue-plan.md`.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-y-runpod-a100-qwen3-vl-runtime-and-batch-queue-plan.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- `git status`
- `git diff --check`
- Backend tests
- No-model scans for secrets, artifacts, iOS provider/model calls, Camera cloud entry, and payload drift

### Known TODOs

- Phase 21-Z should prepare RunPod deployment/security/no-model readiness without provisioning resources or installing/downloading/loading/calling Qwen3-VL-30B-A3B.
- Phase 21-Z1 should cover RunPod instance security and no-model contract gates before any benchmark approval.
- Phase 21-Z2 requires separate explicit approval before any Qwen3-VL-30B-A3B 12-fixture benchmark on RunPod A100.
- Phase 22-A debug-only iOS backend integration should wait until after target server benchmark review.

Ready for Phase 21-Z: RunPod A100 Qwen3-VL Deployment Prep Without Model Calls. Any RunPod provisioning, model call, model install/download/load, benchmark, or inference endpoint call requires separate explicit approval.

## Phase 21-X - Controlled 12-fixture Benchmark Review + Latency Decision Gate

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-X reviewed the accepted Phase 21-W controlled 12-fixture benchmark result. The decision bucket is `correctness_baseline_pass_latency_not_product_ready`: route/schema/validator/fallback correctness passed, but latency is not suitable for live camera or production real-time advisor UX.

### Completed Work

- Reviewed the Phase 21-W-FINAL-R2 sanitized aggregate: accepted `12`, rejected `0`, blocked `0`, call count `12`, retry count `0`.
- Confirmed the approved fixture set remained `smoke_004` through `smoke_015`.
- Confirmed the current serving stack remains `transformers_fastapi_reference` and model bucket remains `qwen_vlm_compatible`.
- Confirmed the reference path is acceptable as a backend correctness baseline.
- Confirmed latency `5s_to_15s x11` and `gt_15s x1` is not live-camera or production real-time ready.
- Recommended Phase 21-Y: RunPod A100 Qwen3-VL Runtime + Batch Queue Plan.
- Added `docs/phase-21-x-controlled-benchmark-review-and-latency-decision-gate.md`.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-x-controlled-benchmark-review-and-latency-decision-gate.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- `git status`
- `git diff --check`
- Backend tests
- Backend contract echo validation CLI
- No-model scans for secrets, artifacts, iOS provider/model calls, Camera cloud entry, and payload drift

### Known TODOs

- Phase 21-Y should plan the target RunPod A100 Qwen3-VL runtime and batch/queue path before any additional model call, benchmark, serving-stack switch, quantization run, Live Advisor simulation, iOS integration, endpoint addition, or production rollout.
- Possible later branches remain Phase 22-A debug-only iOS integration planning, Phase 21-Y2 Qwen3-VL-30B-A3B runtime planning without model calls, Phase 21-Z vLLM/SGLang benchmark preparation without execution, and much-later Phase 23 beta/production gates.

Ready for Phase 21-Y: RunPod A100 Qwen3-VL Runtime + Batch Queue Plan. Any further model call or benchmark requires separate explicit approval.

## Phase 21-W-FINAL-R2 - Controlled 12-fixture Benchmark Final Result

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-FINAL-R2 completed the controlled 12-fixture Transformers+FastAPI benchmark goal. The existing local/private reference server was restored through the external workspace venv, the live route-contract dry-run was made routeable for the approved 12 fixtures, and exactly one benchmark run accepted all 12 fixtures.

### Completed Work

- Reconfirmed main repo cleanliness/upstream sync and prerequisite Phase 21 history.
- Reconfirmed external static no-model fixture-token contract and route-contract dry-run.
- Diagnosed the runtime blocker as local/private server process availability plus `fixture_lookup_mismatch`.
- Restarted the existing local/private Transformers+FastAPI reference server without switching serving stack or model.
- Mirrored the approved ignored fixture files and metadata for `smoke_004` through `smoke_015` into the external ignored runtime workspace without printing raw paths, images, registry contents, config contents, logs, prompts, outputs, payloads, or secrets.
- Confirmed backend healthz `safe` with `modelLoaded:true` and live route dry-run `route_contract_ready`.
- Ran exactly one approved controlled 12-fixture benchmark: call count `12`, retry count `0`.
- Recorded sanitized aggregate result: accepted `12`, rejected `0`, blocked `0`, validation bucket `null x12`, fallback bucket `null x12`, latency buckets `gt_15s x1` and `5s_to_15s x11`.
- Added `docs/phase-21-w-final-r2-controlled-12-fixture-benchmark-final-result.md`.
- Updated README/backend/iOS/roadmap/handoff/manual smoke docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-w-final-r2-controlled-12-fixture-benchmark-final-result.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- `git diff --check`
- `npm.cmd test`
- `npm.cmd run qa:open-weight-vlm:backend-contract-echo-validation`
- `npm.cmd run qa:open-weight-vlm:controlled-multifixture-rejection-diagnostics`
- `npm.cmd run qa:open-weight-vlm:controlled-multifixture-serving-benchmark-approval-request`
- `npm.cmd run qa:open-weight-vlm:serving-benchmark-approval-matrix`
- `npm.cmd run qa:open-weight-vlm:serving-benchmark-scope-gate`
- `npm.cmd run qa:open-weight-vlm:local-config`
- `npm.cmd run qa:open-weight-vlm:local-smoke-gate`
- `npm.cmd run qa:open-weight-vlm:local-model-route-approval`
- `npm.cmd run qa:photo-advisor:gate`
- External `check_fixture_token_contract.py`
- External `check_route_contract_dry_run.py`
- Backend `qa:open-weight-vlm:local-model-healthz-preflight`
- Backend `qa:open-weight-vlm:benchmark-route-contract-dry-run`
- One approved benchmark command: `qa:open-weight-vlm:transformers-fastapi-controlled-multifixture-serving-benchmark`

### Known TODOs

- Phase 21-X should review latency buckets before any serving-stack, quantization, Live Advisor, iOS integration, endpoint, or production decision.
- The external mirrored fixture runtime state remains local/ignored and must not be committed.
- Production rollout remains blocked.

Ready for Phase 21-X: Controlled 12-fixture Benchmark Review + Latency Decision Gate. Any further model call or benchmark requires separate explicit approval.

## Phase 21-W-FINAL-R1 - Model Runtime Readiness Reblocked

Status: persistent server process availability blocker
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-FINAL-R1 attempted to restore the live local/private server runtime without running model inference or any benchmark. Static external no-model contracts still passed, but backend healthz remained blocked with `connection_refused` after a safe restart attempt.

### Completed Work

- Reconfirmed external static fixture-token contract checker passes.
- Reconfirmed external static route-contract dry-run checker passes.
- Confirmed no server process was listening on the expected local/private port before restart.
- Started the server through the approved local/private startup helper.
- Observed a listener briefly appear, then disappear after backend healthz blocked.
- Stopped before backend live route dry-run because healthz failed.
- Added sanitized report and updated roadmap/handoff/manual docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/phase-21-w-final-r1-model-runtime-readiness-reblocked.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- External `server.py` syntax check: passed.
- External `check_fixture_token_contract.py`: passed.
- External `check_route_contract_dry_run.py`: passed.
- Backend healthz preflight: blocked with `connection_refused`.
- Backend live route dry-run after restart: not run because healthz failed.
- No controlled benchmark, one-fixture benchmark, model call, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.

### Known TODOs

- Fix persistent local/private server process availability after startup.
- Keep follow-up diagnostics sanitized and no-model unless separately approved.

### Ready for Next Phase

Ready for Phase 21-W-FINAL-R1A: Persistent Server Process Availability Fix. Any model call or benchmark retry requires separate explicit approval.

## Phase 21-W-FINAL - Controlled Benchmark Finalization Attempt

Status: blocked before model calls
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-FINAL was an approved bounded route-debug and benchmark finalization attempt. The total model-call hard cap was `14`, diagnostic single-fixture cap was `2`, final benchmark cap was `12`, and retry count was `0`. The phase stopped before model calls because live healthz/model readiness was reblocked with `connection_refused`.

### Completed Work

- Reconfirmed external no-model fixture-token contract checker passes.
- Reconfirmed external static route-contract dry-run checker passes.
- Confirmed backend live route dry-run was unavailable while the server was down.
- Attempted safe local/private server startup via the approved helper.
- Patched external route error mapping so known sanitized HTTP detail buckets are preserved before generic `route_not_found`.
- Reconfirmed external syntax and static no-model checkers after the patch.
- Added sanitized final report and updated roadmap/handoff/manual docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/phase-21-w-final-controlled-benchmark-result.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

External workspace changed:

- `C:\Projects\vlm-smoke-server-work\server.py`

### Tests and Checks

- External `server.py` syntax check: passed.
- External `check_fixture_token_contract.py`: passed.
- External `check_route_contract_dry_run.py`: passed.
- Backend healthz preflight: blocked with `connection_refused`.
- Model-call usage: `0/14`.
- Diagnostic model calls: `0`.
- Final benchmark calls: `0`.
- Retry count: `0`.
- No diagnostic model call, controlled benchmark, real inference endpoint call, fixture inference, Qwen inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.

### Known TODOs

- Restore safe healthz/model readiness for the existing local/private reference server.
- After readiness is restored, rerun no-model route-contract checks before any separately approved model/benchmark call.

### Ready for Next Phase

Ready for Phase 21-W-FINAL-R1: Model Runtime Readiness Reblocked. Any model call or benchmark retry requires separate explicit approval.

## Phase 21-W-GOAL-R2-R2A - Route Contract Dry-run Follow-up

Status: blocked at post-reload healthz
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-GOAL-R2-R2A attempted the live no-model route-contract dry-run follow-up. The stale live route symptom was confirmed, the local/private listener was restarted, and the phase stopped before rerunning backend live dry-run because post-reload healthz blocked with `connection_refused`.

### Completed Work

- Reconfirmed external static route-contract dry-run checker passes.
- Reconfirmed external fixture-token contract checker passes.
- Reproduced backend live dry-run `route_not_found` before reload.
- Identified route-not-found cause bucket `stale_server_process`.
- Restarted the local/private listener with the approved helper.
- Stopped after backend healthz preflight returned `connection_refused`.
- Added sanitized report and updated roadmap/handoff/manual docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/phase-21-w-goal-r2-r2a-route-contract-dry-run-follow-up.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- External `check_route_contract_dry_run.py`: passed.
- External `check_fixture_token_contract.py`: passed.
- Backend route-contract dry-run before reload: blocked with `route_not_found`.
- Backend healthz preflight after reload: blocked with `connection_refused`.
- No model call, benchmark, real inference endpoint call, fixture inference, Qwen inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.

### Known TODOs

- Restore safe healthz for the existing local/private reference server.
- After healthz is safe, rerun only no-model route-contract dry-run checks unless a future prompt separately approves model/benchmark calls.

### Ready for Next Phase

Ready for Phase 21-W-GOAL-R2-R2A-R2: Healthz Recheck / Runtime Restart Follow-up. Any model call or benchmark retry requires separate explicit approval.

## Phase 21-W-GOAL-R2-R2 - Local Model Unavailable After Runtime Readiness

Status: completed with no-model dry-run follow-up blocker
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-GOAL-R2-R2 diagnosed the `modelLoaded:true` but `local_model_unavailable x12` result without running a model call, benchmark, or real inference endpoint call. The primary root cause bucket is `fixture_lookup_mismatch`, and the backend HTTP non-OK mapping was fixed to preserve explicit sanitized buckets.

### Completed Work

- Reconfirmed external no-model contract checker still passes.
- Reconfirmed backend no-model contract echo validation still passes.
- Reconfirmed backend healthz preflight is `safe` with `modelLoaded:true`.
- Added external no-model route-contract dry-run endpoint and checker in the external workspace.
- Added backend route-contract dry-run module, CLI, npm script, and tests.
- Updated the controlled benchmark wrapper to preserve sanitized HTTP error buckets.
- Added sanitized diagnostics report and updated roadmap/handoff/manual docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-benchmark-route-contract-dry-run.mjs`
- `backend/scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs`
- `backend/src/qa/openWeightVlmBenchmarkRouteContractDryRun.mjs`
- `backend/tests/benchmark-route-contract-dry-run.test.mjs`
- `backend/tests/transformers-fastapi-controlled-multifixture-serving-benchmark.test.mjs`
- `docs/phase-21-w-goal-r2-r2-local-model-unavailable-after-runtime-readiness.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

External workspace changed:

- `C:\Projects\vlm-smoke-server-work\server.py`
- `C:\Projects\vlm-smoke-server-work\check_route_contract_dry_run.py`

### Tests and Checks

- External syntax AST parse: passed.
- External `check_fixture_token_contract.py`: passed.
- External `check_route_contract_dry_run.py`: passed with `fixture_not_available x12`.
- Backend targeted tests: passed.
- Backend dry-run CLI: safely blocked with `route_not_found` from the currently running external process.
- No model call, benchmark, real inference endpoint call, fixture inference, image open, OCR, EXIF/GPS/sensor inspection, Qwen inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.

### Known TODOs

- Make the live external server expose the new no-model dry-run endpoint and rerun only no-model dry-run checks.
- Resolve external fixture routeability for the approved 12 tokens before any future benchmark retry.

### Ready for Next Phase

Ready for Phase 21-W-GOAL-R2-R2A: Route Contract Dry-run Follow-up. Any model call or benchmark retry requires separate explicit approval.

## Phase 21-W-GOAL-R2 - Controlled 12-fixture Benchmark After Runtime Readiness

Status: completed
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-GOAL-R2 was an approved controlled benchmark retry after live model runtime readiness. Fresh healthz passed with `modelLoaded:true`, no-model contract checks passed, and the benchmark ran exactly once with the approved 12 fixtures and zero retries. The final result is all 12 rejected with `local_model_unavailable`.

### Completed Work

- Verified external no-model fixture-token contract check still passed with approved token count `13`, unsupported bucket `unsupported_fixture_token`, missing bucket `missing_fixture_token`, and `productionReady:false`.
- Verified backend no-model contract echo validation still passed with no model call, no benchmark, and no inference endpoint call.
- Verified ignored local config, fixture registry, and `smoke_004` through `smoke_015` fixture files stayed present, ignored, untracked, and unstaged.
- Verified the exact approved fixture set and registry approval for all 12 benchmark tokens.
- Ran fresh local model healthz preflight; result was `safe`, `modelLoaded:true`, `modelFamilyBucket:qwen_vlm_compatible`, raw logging disabled, public exposure `no`, and `productionReady:false`.
- Ran repo safety gates and scans before the benchmark.
- Ran the guarded controlled 12-fixture benchmark exactly once with call count `12` and retry count `0`.
- Added sanitized Phase 21-W-GOAL-R2 report and updated roadmap/handoff/manual docs.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-w-goal-r2-controlled-12-fixture-benchmark-after-runtime-readiness-report.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Tests and Checks

- External `check_fixture_token_contract.py`: passed.
- `npm run qa:open-weight-vlm:backend-contract-echo-validation`: passed.
- Local ignored config/registry/fixture readiness scan: passed.
- `git diff --check`: passed before benchmark.
- Backend tests: passed, `330/330`.
- Controlled multifixture rejection diagnostics: passed.
- Controlled multifixture serving benchmark approval request: passed.
- Serving benchmark approval matrix: passed.
- Serving benchmark scope gate: passed.
- Local config dry-run: passed.
- Local smoke gate: passed.
- Local model route approval gate: passed.
- Fresh healthz preflight: passed with `modelLoaded:true`.
- Controlled 12-fixture benchmark: executed once; sanitized output showed call count `12`, retry count `0`, accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`.

### Known TODOs

- Diagnose why the benchmark route still returns `local_model_unavailable` for all approved controlled fixtures despite safe loaded healthz.
- Do not rerun the controlled benchmark or any fixture calls without separate explicit user approval.

### Ready for Next Phase

Ready for Phase 21-W-GOAL-R2-R2: Local Model Unavailable After Model Runtime Readiness. Any further model or benchmark call requires separate explicit approval.

## Phase 21-W-GOAL - Controlled 12-fixture Benchmark Final Result Attempt

Status: Final blocker reached before benchmark/model calls
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-GOAL was an approved autonomous attempt to resolve the controlled 12-fixture benchmark readiness blocker and run exactly one 12-fixture Transformers+FastAPI benchmark only if all gates passed. Healthz remained blocked with `model_not_loaded` after a safe model-enabled startup attempt, so the benchmark did not run.

### Completed Work

- Verified main repo was clean and upstream sync was `0 0`.
- Verified prerequisite commit markers for Phase 21-W-R2C-FINAL and Phase 21-W-R3.
- Confirmed external no-model contract checker still passed.
- Inspected external readiness/startup behavior.
- Attempted one model-enabled local/private startup through the existing helper.
- Rechecked external healthz-only readiness and backend healthz preflight.
- Stopped before benchmark/model calls because healthz remained unsafe.
- Added sanitized Phase 21-W-GOAL final blocker report.
- Updated roadmap, README, backend README, iOS README, handoff, and manual smoke notes.

### Result

- Model readiness resolved: no
- Healthz result: `model_not_loaded`
- Model loaded: no
- Likely blocker: `missing_local_model_runtime`
- Benchmark executed: no
- Model call count: `0`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `0`
- Blocked count: `1`

### Changed Files

- `docs/phase-21-w-goal-controlled-12-fixture-benchmark-final-report.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Checks

- External no-model fixture-token contract checker passed.
- Backend healthz preflight blocked safely with `model_not_loaded`.
- No benchmark command ran.
- No raw prompt, model output, image path, payload, local config contents, fixture registry contents, server URL, server log, EXIF/GPS/sensor data, or secret was printed or committed.

### Next Step

Ready for Phase 21-W-GOAL-R1: Operator Model Runtime Preparation. A later benchmark retry requires separate explicit approval before any model or benchmark calls.

---

## Phase 21-W-R3-R1 - Controlled 12-fixture Benchmark Healthz Block Resolution

Status: Diagnosed / still blocked
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-R3-R1 diagnosed the Phase 21-W-R3 `model_not_loaded` healthz block. The block is not resolved: healthz remains `model_not_loaded`, modelLoaded remains false, and the next safe step is operator model-enabled startup for the existing reference server.

### Completed Work

- Verified main repo was clean and upstream sync was `0 0`.
- Verified prerequisite commit markers for Phase 21-W-R2C-FINAL and Phase 21-W-R3 were present.
- Confirmed the external no-model contract checker still passed with approved token count `13`.
- Ran healthz-only readiness check; it remained blocked with `model_not_loaded`.
- Inspected startup/readiness scripts and server healthz/modelLoaded source behavior.
- Ran a sanitized no-load dependency probe; no missing dependency classes were found.
- Added sanitized healthz block diagnosis report.
- Updated roadmap, README, backend README, iOS README, handoff, and manual smoke notes.

### Diagnostic Result

- Healthz checked: yes
- Healthz result: `model_not_loaded`
- Model loaded: no
- Likely blocker bucket: `model_load_disabled`
- Resolved: no
- Inference endpoint called: no
- Model call executed: no
- Benchmark executed: no
- Call count: `0`
- Retry count: `0`

### Changed Files

- `docs/phase-21-w-r3-r1-healthz-model-not-loaded-block-resolution.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Checks

- External no-model fixture-token contract checker passed.
- Healthz-only checker blocked safely with `model_not_loaded`.
- Sanitized dependency probe passed with no missing dependency class.
- No raw prompt, model output, image path, payload, local config contents, fixture registry contents, server URL, server log, EXIF/GPS/sensor data, or secret was printed or committed.

### Next Step

Ready for Phase 21-W-R3-R1A: Operator Model-enabled Server Startup. A later benchmark retry requires separate explicit approval before any model or benchmark calls.

---

## Phase 21-W-R3 - Controlled 12-fixture Benchmark Retry After Contract Echo Fix

Status: Blocked before benchmark/model calls
Date: 2026-06-19
Production readiness: `productionReady:false`

### Summary

Phase 21-W-R3 was explicitly approved to retry one controlled 12-fixture Transformers+FastAPI reference benchmark after contract echo validation passed. The benchmark did not execute because healthz preflight returned sanitized bucket `model_not_loaded`.

### Completed Work

- Verified main repo was clean and upstream sync was `0 0`.
- Verified prerequisite commit markers for Phase 21-W-R2C, Phase 21-W-R2C2, and Phase 21-W-R2C-FINAL were present.
- Confirmed external no-model contract checker passed with approved token count `13`, `modelLoaded:false`, `inferenceEndpointCalled:false`, `benchmarkRun:false`, and `productionReady:false`.
- Confirmed backend no-model contract echo validation passed with unsupported bucket `unsupported_fixture_token` and missing bucket `missing_fixture_token`.
- Confirmed approved benchmark scope was exactly `smoke_004` through `smoke_015`, fixture count `12`, call count `12`, retry count `0`, and no `smoke_001`.
- Confirmed approved fixture files were present, ignored, unstaged, and untracked.
- Ran healthz preflight once; it blocked with `blocked_for_model_not_loaded`.
- Added sanitized Phase 21-W-R3 blocked report.
- Updated roadmap, README, backend README, iOS README, handoff, and manual smoke notes.

### Benchmark Result

- Benchmark executed: no
- Inference endpoint called: no
- Model call executed: no
- Call count: `0`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `0`
- Blocked count: `1`
- Healthz bucket: `model_not_loaded`
- Endpoint bucket normalization confirmed: yes
- Contract echo validation confirmed: yes

### Changed Files

- `docs/phase-21-w-r3-transformers-fastapi-controlled-12-fixture-serving-benchmark-retry-after-contract-echo-fix-report.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Checks

- External no-model fixture-token contract checker passed.
- Backend no-model contract echo validation passed.
- Healthz preflight blocked safely before model calls with `model_not_loaded`.
- No raw prompt, model output, image path, payload, local config contents, fixture registry contents, server URL, server log, EXIF/GPS/sensor data, or secret was printed or committed.

### Next Step

Ready for Phase 21-W-R3-R1: Controlled 12-fixture Benchmark Healthz Block Resolution. A later benchmark retry requires separate explicit approval before any model or benchmark calls.

---

## Phase 21-W-R2C-FINAL - Contract Echo Validation Pass

Status: Implemented
Date: 2026-06-19

### Summary

Fixed the end-to-end no-model contract echo mismatch so backend validation passes against the external no-model contract echo path.

### Completed Work

- Updated external server canonical no-model response fields.
- Updated external checker coverage for canonical no-model fields.
- Updated backend contract echo validation CLI to prefer the safe default no-model loopback path unless explicitly overridden.
- Updated backend validator/tests to block `modelLoaded:true`, `benchmarkRun:true`, ambiguous buckets, and raw artifact leakage.
- Added sanitized final report `docs/phase-21-w-r2c-final-contract-echo-validation-pass.md`.
- Updated roadmap next phase to Phase 21-W-R3.

### Verification

- External syntax/checker passed.
- Backend contract echo validation CLI passed.
- Backend tests passed.
- Required no-model gates and scans passed during phase closeout.

### Boundaries

- Inference endpoint called: no
- Model call executed: no
- Benchmark executed: no
- Fixture inference executed: no
- Call count: 0
- Retry count: 0
- `productionReady:false`

Ready for Phase 21-W-R3 only after separate explicit user approval.

---

## Phase 21-W-R2C2 - Backend No-model Contract Echo Validation

Status: Implemented / blocked by contract echo bucket mismatch
Date: 2026-06-19

### Summary

Added backend-side no-model contract echo validation for the external Windows FastAPI server. The validator reached a local/private no-model contract echo endpoint but blocked because unsupported and missing fixture-token responses returned `unknown` buckets instead of explicit sanitized buckets.

### Completed Work

- Added `backend/src/qa/openWeightVlmBackendContractEchoValidation.mjs`.
- Added `backend/scripts/check-open-weight-vlm-backend-contract-echo-validation.mjs`.
- Added npm script `qa:open-weight-vlm:backend-contract-echo-validation`.
- Added tests in `backend/tests/backend-contract-echo-validation.test.mjs`.
- Added sanitized report `docs/phase-21-w-r2c2-backend-no-model-contract-echo-validation.md`.
- Updated roadmap next phase to Phase 21-W-R2C4.

### Verification

- External no-model checker passed.
- Backend tests passed.
- Backend contract echo validation CLI blocked safely with sanitized buckets only.

### Boundaries

- No-model HTTP endpoint available: yes
- Inference endpoint called: no
- Model call executed: no
- Benchmark executed: no
- Fixture inference executed: no
- Call count: 0
- Retry count: 0
- `productionReady:false`

Ready for Phase 21-W-R2C4: Contract Echo Validation Failure Fix.

---

## Phase 21-W-R2C - External Server Fixture-token Contract Fix

Status: Implemented
Date: 2026-06-19

### Summary

Fixed the external Windows FastAPI server no-model fixture-token contract and route-error mapping for approved tokens `smoke_001` and `smoke_004` through `smoke_015`. The fix prepares a later backend no-model contract echo validation phase and does not approve or run a benchmark retry.

### Completed Work

- Updated the external server approved token set to include `smoke_001` and `smoke_004` through `smoke_015`.
- Added no-model request-token normalization for `fixtureId`, `fixtureToken`, and `fixture`.
- Added sanitized no-model missing/unsupported token and route-error buckets.
- Added an external no-model contract check script.
- Added sanitized report `docs/phase-21-w-r2c-external-server-fixture-token-contract-fix.md`.
- Updated roadmap next phase to Phase 21-W-R2C2.

### Verification

- External server AST syntax parse passed.
- External no-model fixture-token contract check passed.
- Main repo docs-only diff check and scans passed during phase closeout.

### Boundaries

- Model call executed: no
- Benchmark executed: no
- Inference endpoint called: no
- Fixture inference executed: no
- External model loaded by check: no
- Qwen3-VL-30B-A3B installed/loaded/called: no
- vLLM/SGLang/Ollama called: no
- iOS runtime changed: no
- Endpoint added: no
- Raw artifact or secret added: no
- `productionReady:false`

Ready for Phase 21-W-R2C2: Backend No-model Contract Echo Validation Against External Server. Any benchmark/model-call retry still requires separate explicit approval.

---

## Phase 21-W-R2 - Controlled Multi-fixture Benchmark Rejection Diagnostics

Status: Implemented
Date: 2026-06-19

Marker correction: the Phase 21-W-R2 artifacts were implemented and pushed, but the visible commit marker was misspelled as `Phase 21-W-R2: diagnose controlled benchmark local model unavailabl`. This corrective marker commit restores the exact prerequisite marker `Phase 21-W-R2: diagnose controlled benchmark local model unavailable` without amending or rebasing pushed commits. No model call, benchmark, inference endpoint call, external server edit, iOS runtime change, raw artifact, secret, or production rollout occurred; `productionReady:false` remains locked.

### Summary

Diagnosed the Phase 21-W-R1B all-12 rejection pattern using code-path review and sanitized summaries only. No model call, benchmark call, healthz call, fixture inference, or inference endpoint call was run. The likely failure layer is `external_route_error_mapping_or_fixture_token_contract`.

### Completed Work

- Added `backend/src/qa/openWeightVlmControlledMultifixtureRejectionDiagnostics.mjs`.
- Added `backend/scripts/check-open-weight-vlm-controlled-multifixture-rejection-diagnostics.mjs`.
- Added `npm run qa:open-weight-vlm:controlled-multifixture-rejection-diagnostics`.
- Added tests in `backend/tests/controlled-multifixture-rejection-diagnostics.test.mjs`.
- Added sanitized diagnostics report `docs/phase-21-w-r2-controlled-multifixture-rejection-diagnostics.md`.
- Updated roadmap next phase to Phase 21-W-R2C: External Server Fixture-token Contract Fix.

### Diagnostic Result

- Likely failure layer: `external_route_error_mapping_or_fixture_token_contract`
- Root cause found: yes, at sanitized bucket level
- Emitting component buckets:
  - `controlled_multifixture_wrapper_fetch_or_http_non_ok_mapping`
  - `local_sandbox_client_uses_same_mapping_for_fetch_or_http_non_ok`
  - `schema_validator_not_reached_for_local_model_unavailable_bucket`
- Next safe action: Phase 21-W-R2C
- Immediate benchmark retry justified: no

### Verification

- `npm test`
- `npm run qa:open-weight-vlm:controlled-multifixture-rejection-diagnostics`
- No-network gate and scan verification during phase closeout

### Boundaries

- Model call executed: no
- Benchmark executed: no
- Inference endpoint called: no
- Healthz called: no
- Fixture inference executed: no
- vLLM/SGLang/Ollama call: no
- Qwen3-VL-30B-A3B switch/download/load/benchmark/call: no
- Serving stack switch: no
- External server change: no
- iOS runtime change: no
- App-facing/production endpoint: no
- Auto-Trigger/WSS/upload runtime: no
- Raw artifacts/secrets committed: no
- `productionReady:false`

### Ready for Next Phase

Ready for Phase 21-W-R2C: External Server Fixture-token Contract Fix. Any benchmark/model-call retry after a fix requires separate explicit approval.

---

## Phase 21-W-R1B - Approved Controlled 12-fixture Benchmark Retry After Endpoint Bucket Fix

Status: Implemented
Date: 2026-06-19

### Summary

Retried the explicitly approved controlled 12-fixture Transformers+FastAPI reference benchmark once after Phase 21-W-R1 endpoint bucket normalization. The retry used the approved fixture tokens `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. Result: mixed/rejected with accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, and latency bucket `lt_1s x12`.

### Completed Work

- Verified git was clean/upstream-synced before healthz or benchmark.
- Verified prerequisite commit markers for Phase 21-W0, Phase 21-W, and Phase 21-W-R1.
- Confirmed ignored local config, fixture registry, and fixture files remained ignored, untracked, and unstaged with sanitized token/count facts only.
- Ran healthz preflight once; result bucket was `safe`.
- Ran required no-model gates before the approved retry.
- Ran the approved controlled benchmark command exactly once.
- Added sanitized report `docs/phase-21-w-r1b-transformers-fastapi-controlled-12-fixture-serving-benchmark-retry-report.md`.
- Updated roadmap next phase to Phase 21-W-R2: Controlled Multi-fixture Benchmark Rejection Diagnostics.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-w-r1b-transformers-fastapi-controlled-12-fixture-serving-benchmark-retry-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Verification

- `git diff --check`
- `backend npm test`
- required no-model open-weight VLM gates
- healthz preflight once before benchmark
- approved controlled benchmark command once
- secret scan
- Photo Advisor copy/filter/CreativeIntent/card language coverage
- targeted iOS direct provider/model scan
- targeted Camera cloud entry scan
- backend/iOS payload unchanged scan
- ignored local config/registry/fixture checks

### Boundaries

- Serving runtime started: no new runtime
- Endpoint called: existing local/private Transformers+FastAPI reference route only during approved retry
- Benchmark executed: yes, exactly one approved retry command
- Backend local/private route call count: `12`
- Retry count: `0`
- vLLM/SGLang/Ollama call: no
- Qwen3-VL-30B-A3B switch/download/load/benchmark/call: no
- Serving switch: no
- iOS runtime change: no
- App-facing/production endpoint: no
- Auto-Trigger/WSS/upload/local CV runtime: no
- Raw artifacts/secrets committed: no
- Production rollout: no
- `productionReady:false`

### Known TODOs

- Diagnose the sanitized rejection buckets in Phase 21-W-R2 before any future benchmark retry.
- Any new model calls or serving benchmark retry require separate explicit approval.

### Ready for Next Phase

Ready for Phase 21-W-R2: Controlled Multi-fixture Benchmark Rejection Diagnostics. Production rollout remains blocked.

---

## Phase 20-K - Expanded Smoke Result Review + Dataset Coverage Gap Plan

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-expanded-smoke-result-review.md`.
- Reviewed the Phase 20-J aggregate: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`, no validation/fallback/schema diagnostic buckets, `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.
- Documented what the eight-fixture run proves: backend to local/private Windows Qwen path, resolved expanded fixture routing, eight routeable/inferable approved fixture tokens, backend validator acceptance, gate interpretation, false raw persistence flags, and viable Windows-primary workflow.
- Documented what remains unproven: production readiness, iOS integration, real user-photo upload, consent UI, app-facing/production endpoints, quota/abuse/retention/deletion controls, App Store privacy readiness, broad dataset coverage, hard-negative coverage, throughput/concurrency, serving-stack comparison, multilingual real-output review, fine-tuning, and on-device model work.
- Recorded latency interpretation: `gt_15s x3` is a sandbox latency note, not production approval.
- Defined coverage gaps and recommended Phase 20-L as a 12-fixture coverage expansion plan plus no-model registry gate.

### Verification

- Repo state was clean and upstream comparison was `0 0` before edits.
- No real model smoke, Qwen inference, fixture image update, local registry expansion with real files, serving-stack benchmark, iOS integration, app-facing endpoint, production endpoint, training/fine-tuning, or production rollout was run or added.

### Ready for Phase 20-L

Yes, for no-model coverage planning only. Phase 20-K does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, serving-stack benchmarking, training/fine-tuning, or real model calls without explicit future approval.

## Phase 20-L - 12-Fixture Coverage Expansion Plan + No-model Registry Gate

Status: Implemented
Date: 2026-06-16

### Completed

- Updated `backend/src/qa/openWeightVlmExpandedFixtureRegistry.mjs` to treat the 12 planned categories as the required dry-run target.
- Added a no-model registry gate output contract with `totalTargetFixtures:12`, `requiredCategories`, `missingRequiredCategories`, `eligibleForControlledSmoke`, `productionReady:false`, and `networkCallsMade:false`.
- Extended backend tests to cover the 12-category target, the 8-category gap report, and production-flag blocking behavior.
- Kept the phase backend-only, Windows-primary, and no-model.

### Verification

- No real model smoke was run.
- No fixture images or local registry files were committed.
- Repo state remained clean before edits and the phase keeps `productionReady:false`.

### Ready for Phase 20-M

Yes, for future controlled 12-fixture prep only after explicit approval. Phase 20-L does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, serving-stack benchmarking, training/fine-tuning, or real model calls without explicit future approval.

## Phase 20-M - Prepare 12 Approved Ignored Fixtures + No-model Routing Echo

Status: Implemented
Date: 2026-06-16

### Completed

- Prepared four additional ignored local fixture tokens for the missing Phase 20-L categories: `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`.
- Kept the existing approved local fixture tokens intact and prepared the local ignored registry for 12 approved entries.
- Updated the backend no-model fixture routing echo target from eight tokens to twelve tokens.
- Updated the external Windows smoke server workspace token list for no-model routeability checks only.
- Skipped unsafe or ambiguous source candidates with sanitized reasons only.

### Sanitized No-model Results

- Expanded fixture registry dry-run: `totalFixtures:12`, `approvedCount:12`, `blockedCount:0`, `missingRequiredCategories:[]`, `eligibleForControlledSmoke:true`, `networkCallsMade:false`, `productionReady:false`.
- Fixture routing contract echo: `totalFixtureTokens:12`, `routeableCount:12`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, `productionReady:false`.

### Verification

- No real model smoke was run.
- No Qwen inference was run.
- Ignored fixture images and ignored local registry files remain uncommitted.
- `productionReady:false` remains required.

### Ready for Phase 20-N

Yes, for a future explicitly approved controlled 12-fixture local/private smoke only. Phase 20-M does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, serving-stack benchmarking, training/fine-tuning, or real model calls without explicit future approval.

## Phase 20-N - Controlled 12-Fixture Local VLM Smoke

Status: Implemented
Date: 2026-06-16

### Completed

- Ran exactly 12 local/private Qwen-backed smoke calls, one per approved ignored fixture token: `smoke_004` through `smoke_015`.
- Reused the approved ignored 12-fixture registry and the no-model routing echo baseline from Phase 20-M.
- Kept the backend validator as source of truth and kept `productionReady:false`.

### Sanitized Result

- Per-fixture accepted: all 12 approved fixture tokens.
- Aggregate: `fixtureCount:12`, `acceptedCount:12`, `rejectedCount:0`, `acceptanceRate:100%`.
- Validation/fallback: `validationCodeCounts:null x12`, `fallbackCategoryCounts:null x12`, no schema error buckets, no schema field buckets.
- Latency: `gt_15s x10`, `5s_to_15s x2`.
- Safety: `networkCallsMade:true`, `productionReady:false`, raw prompt/model response/image/image path/request payload persisted flags false.
- Repeatability gate: passed with `pass_with_latency_note`.
- Failure/latency taxonomy: passed with `latency_note`.

### Ready for Phase 20-O

Yes, for future planning only. Phase 20-N does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, serving-stack benchmarking, training/fine-tuning, or any change to `productionReady:false`.

## Phase 20-O - 12-Fixture Smoke Review + Serving Benchmark Decision Gate

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-serving-benchmark-decision-gate.md`.
- Reviewed the Phase 20-N aggregate: `fixtureCount:12`, `acceptedCount:12`, `rejectedCount:0`, `acceptanceRate:100%`, `validationCodeCounts:null x12`, `fallbackCategoryCounts:null x12`, no schema diagnostic buckets, `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.
- Documented what 12/12 accepted proves: local/private Windows Qwen2.5-VL FastAPI processing, validator acceptance, expanded routing, raw persistence false, gate interpretation, and viable Windows-primary workflow.
- Documented what remains unproven: production readiness, iOS readiness, real user-photo upload, consent UI, app-facing/production endpoints, quota/billing/entitlement, retention/deletion policy, App Store privacy update, throughput/concurrency, serving-stack comparison, broader dataset quality, multilingual real-output review, fine-tuning, and on-device model readiness.
- Interpreted `gt_15s x10` as a significant sandbox latency note that justifies serving benchmark preflight, not production approval.
- Recommended Phase 20-P as serving-stack benchmark preflight only.

### Verification

- No real model smoke, Qwen inference, vLLM/SGLang/Ollama benchmark, fixture image change, ignored local registry change, iOS integration, app-facing endpoint, production endpoint, training/fine-tuning, model-stack switch, or production rollout was run or added.
- `productionReady:false` remains required.

### Ready for Phase 20-P

Yes, for serving-stack benchmark preflight only. Phase 20-O does not approve actual serving benchmark execution, model-stack switching, iOS integration, app-facing endpoints, production endpoints, production rollout, training/fine-tuning, or any change to `productionReady:false`.

## Phase 20-P - Serving Benchmark Preflight + Phase 21 Entry Criteria

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-serving-benchmark-preflight.md`.
- Added `backend/src/qa/openWeightVlmServingBenchmarkPreflight.mjs`.
- Added `backend/scripts/check-open-weight-vlm-serving-benchmark-preflight.mjs`.
- Added `npm run qa:open-weight-vlm:serving-benchmark-preflight`.
- Defined the future serving stack matrix: Transformers + FastAPI as correctness/reference baseline, vLLM as primary serving benchmark candidate, SGLang as structured-output/performance challenger, and Ollama / LM Studio as manual/local smoke only.
- Defined sanitized future benchmark metrics: fixture counts, acceptance/rejection counts, validation/fallback/schema buckets, latency buckets, p50/p95 latency buckets, timeout/provider/model-server buckets, cold/warm/concurrency/throughput buckets, network calls, raw persistence flags, and `productionReady:false`.
- Defined stop conditions for unsafe healthz, public exposure, raw logging, raw artifacts, fixture/routing/schema failures, raw persistence, production flag, app/iOS payload changes, and app-facing endpoint attempts.
- Defined Phase 21 entry criteria and recommended Phase 21-A as backend internal VLM gateway contract preflight.

### Verification

- The preflight CLI is no-network, no-model, and benchmark-plan only.
- No real model smoke, Qwen inference, vLLM/SGLang/Ollama/LM Studio execution, fixture image change, ignored local registry change, iOS integration, app-facing endpoint, production endpoint, training/fine-tuning, model-stack switch, or production rollout was run or added.
- `productionReady:false` remains required.

### Ready for Phase 21-A

Yes, for backend internal VLM gateway contract preflight only, or Phase 20-Q no-network serving benchmark dry-run planning if explicitly requested. Phase 20-P does not approve real benchmark execution, model-stack switching, iOS integration, app-facing endpoints, production endpoints, production rollout, training/fine-tuning, or any change to `productionReady:false`.

## Phase 21-A - Backend Internal VLM Gateway Contract Preflight

Status: Implemented
Date: 2026-06-16

### Summary

Phase 21-A defines the backend-internal VLM Gateway contract preflight for a future self-hosted/open-weight VLM integration. It keeps the app repo as the source of truth for request shape, response candidate shape, validation, safety, fallback, docs, and tests. The external Windows VLM server remains a private/local provider sandbox only.

### Completed

- Added `docs/backend-internal-vlm-gateway-contract-preflight.md`.
- Added `backend/src/qa/openWeightVlmGatewayContractPreflight.mjs`.
- Added `backend/scripts/check-open-weight-vlm-gateway-contract-preflight.mjs`.
- Added `npm run qa:open-weight-vlm:gateway-contract-preflight`.
- Extended backend open-weight VLM tests for gateway request/response validation, blocked fields, production flag blocking, leaky/free-form response blocking, and sanitized CLI output.
- Updated README, backend README, iOS README, handoff, Phase 20 VLM docs, and manual smoke tests.

### Changed Files

- README.md
- backend/README.md
- backend/package.json
- backend/scripts/check-open-weight-vlm-gateway-contract-preflight.mjs
- backend/src/qa/openWeightVlmGatewayContractPreflight.mjs
- backend/tests/open-weight-vlm-benchmark.test.mjs
- docs/backend-internal-vlm-gateway-contract-preflight.md
- docs/handoff/codex-transition-handoff.md
- docs/open-weight-vlm-serving-benchmark-preflight.md
- docs/open-weight-vlm-local-sandbox-review-summary.md
- docs/open-weight-vlm-local-smoke-expansion-gate.md
- docs/open-weight-vlm-local-operator-runbook.md
- docs/phase-log.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- Backend tests should include the new gateway contract preflight cases.
- Gateway contract preflight CLI should report `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `eligibleForPhase21BPlanning:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- Manual checklist updated for Phase 21-A.

### Known TODOs

- Phase 21-B can define a backend-internal adapter skeleton only after explicit approval.
- Phase 21-C can define a fixture-token gateway dry-run only after explicit approval.
- Real user-photo upload remains blocked until consent, compression, metadata stripping, retention/deletion, privacy policy, App Store disclosure, quota/abuse controls, and endpoint boundaries are explicitly designed.
- Production rollout remains blocked.

### Ready for Phase 21-B

Yes, for a backend-internal adapter skeleton only if explicitly requested. Phase 21-A does not approve iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-B - Backend Internal VLM Gateway Adapter Stub + External Server No-model Contract Alignment

Status: Implemented
Date: 2026-06-16

### Summary

Phase 21-B adds a backend-internal gateway adapter stub in the app repo and aligns the external local VLM server workspace with a no-model gateway contract echo. The app repo remains the source of truth for contract, adapter, validator, safety gates, docs, tests, QA scripts, and future integration. The external server remains a local/private provider sandbox only.

### Completed

- Added `backend/src/qa/openWeightVlmGatewayAdapterStub.mjs`.
- Added `backend/scripts/check-open-weight-vlm-gateway-adapter-stub.mjs`.
- Added `backend/scripts/check-open-weight-vlm-gateway-external-contract-echo.mjs`.
- Added `npm run qa:open-weight-vlm:gateway-adapter-stub`.
- Added `npm run qa:open-weight-vlm:gateway-external-contract-echo`.
- Extended backend tests for adapter stub validation, blocked raw/leaky fields, production flag blocking, sanitized CLI output, and mocked safe/unsafe external no-model echo responses.
- Updated `C:\Projects\vlm-smoke-server-work\server.py` with a no-model `/local/vlm/gateway-contract-echo` endpoint and healthz compatibility fields.
- Updated README, backend README, iOS README, handoff, gateway contract doc, VLM runbooks, sandbox summaries, and manual smoke tests.

### Changed Files

- README.md
- backend/README.md
- backend/package.json
- backend/scripts/check-open-weight-vlm-gateway-adapter-stub.mjs
- backend/scripts/check-open-weight-vlm-gateway-external-contract-echo.mjs
- backend/src/qa/openWeightVlmGatewayAdapterStub.mjs
- backend/tests/open-weight-vlm-benchmark.test.mjs
- docs/backend-internal-vlm-gateway-contract-preflight.md
- docs/handoff/codex-transition-handoff.md
- docs/open-weight-vlm-local-operator-runbook.md
- docs/open-weight-vlm-local-sandbox-review-summary.md
- docs/open-weight-vlm-local-smoke-expansion-gate.md
- docs/phase-log.md
- ios-app/README.md
- tests/manual-smoke-tests.md
- External workspace: `C:\Projects\vlm-smoke-server-work\server.py`

### Tests / Manual Checks

- Backend tests should include the new adapter stub and mocked external no-model echo cases.
- Adapter stub CLI should report `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `acceptedCount:1`, `eligibleForPhase21CPlanning:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- External echo CLI should validate only local/private healthz and `/local/vlm/gateway-contract-echo`, with no model inference and `productionReady:false`.
- External `server.py` should pass Python compile check.
- Manual checklist updated for Phase 21-B.

### Known TODOs

- Phase 21-C can define a fixture-token gateway dry-run only after explicit approval.
- Any future external server call must remain no-model unless a later phase explicitly approves model inference.
- Real user-photo upload remains blocked until consent, compression, metadata stripping, retention/deletion, privacy policy, App Store disclosure, quota/abuse controls, and endpoint boundaries are explicitly designed.
- Production rollout remains blocked.

### Ready for Phase 21-C

Yes, for a backend-internal fixture-token gateway dry-run only if explicitly requested. Phase 21-B does not approve iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, Qwen inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-C - Backend Internal Gateway Provider Routing Plan + Dry-run Gate

Status: Implemented
Date: 2026-06-16

### Summary

Phase 21-C defines backend-internal gateway provider routing states and adds a no-network dry-run gate. The policy keeps routing fail-closed and separates allowed no-model routes from blocked real-model, future serving-stack, manual-only, and production routes.

### Completed

- Added `backend/src/qa/openWeightVlmGatewayProviderRouting.mjs`.
- Added `backend/scripts/check-open-weight-vlm-gateway-provider-routing.mjs`.
- Added `npm run qa:open-weight-vlm:gateway-provider-routing`.
- Defined allowed modes: `local_stub` and `local_contract_echo`.
- Defined blocked modes: `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes.
- Extended backend tests for allowed routes, blocked routes, production flag blocking, app-facing endpoint blocking, model/Qwen/benchmark blocking, raw artifact policy blocking, and sanitized CLI output.
- Added `docs/backend-internal-vlm-gateway-provider-routing.md`.
- Updated README, backend README, iOS README, handoff, gateway contract doc, VLM runbooks, sandbox summaries, and manual smoke tests.

### Changed Files

- README.md
- backend/README.md
- backend/package.json
- backend/scripts/check-open-weight-vlm-gateway-provider-routing.mjs
- backend/src/qa/openWeightVlmGatewayProviderRouting.mjs
- backend/tests/open-weight-vlm-benchmark.test.mjs
- docs/backend-internal-vlm-gateway-contract-preflight.md
- docs/backend-internal-vlm-gateway-provider-routing.md
- docs/handoff/codex-transition-handoff.md
- docs/open-weight-vlm-local-operator-runbook.md
- docs/open-weight-vlm-local-sandbox-review-summary.md
- docs/open-weight-vlm-local-smoke-expansion-gate.md
- docs/open-weight-vlm-serving-benchmark-preflight.md
- docs/phase-log.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- Backend tests should include the new provider routing cases.
- Provider routing CLI should report `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, allowed `local_stub` / `local_contract_echo`, blocked real/future/manual/production/unknown modes, and `productionReady:false`.
- Manual checklist updated for Phase 21-C.

### Known TODOs

- Phase 21-D should remain backend-internal unless a future explicit prompt chooses otherwise.
- Real local model routing remains blocked from the gateway provider policy in this phase.
- vLLM, SGLang, Ollama, and LM Studio execution remain blocked.
- Production endpoint, app-facing endpoint, real user-photo upload, consent UI, privacy disclosure, retention/deletion, quota/abuse controls, and production rollout remain blocked.

### Ready for Phase 21-D

Yes, for another explicitly requested backend-internal dry-run/planning phase only. Phase 21-C does not approve iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, Qwen inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-D - Backend Internal Gateway Provider Adapter No-model HTTP Check

Status: Implemented
Date: 2026-06-16

### Summary

Phase 21-D adds a backend-internal provider adapter no-model HTTP check for the allowed `local_contract_echo` route. It verifies provider routing before HTTP, checks local/private healthz, calls only `/local/vlm/gateway-contract-echo`, validates structured candidate JSON through the existing schema/safety chain, and reports sanitized aggregate status only.

### Completed

- Added `backend/src/qa/openWeightVlmGatewayProviderAdapterNoModelHttp.mjs`.
- Added `backend/scripts/check-open-weight-vlm-gateway-provider-adapter-no-model-http.mjs`.
- Added `npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http`.
- Enforced `local_contract_echo` as the only allowed HTTP route.
- Added fail-closed checks for unsafe healthz, public/cloud/tunnel/non-local endpoints, raw logging, model inference, model calls, Qwen inference, raw persistence, leaky echo responses, invalid structured candidates, app-facing/production endpoint flags, and `productionReady:true`.
- Extended backend tests for safe/unsafe mocked healthz and echo responses, unsupported routes, public endpoints, raw persistence, invalid candidate JSON, sanitized output, and CLI behavior.
- Updated README, backend README, iOS README, handoff, gateway contract/routing docs, VLM runbooks, sandbox summaries, and manual smoke tests.

### Changed Files

- README.md
- backend/README.md
- backend/package.json
- backend/scripts/check-open-weight-vlm-gateway-provider-adapter-no-model-http.mjs
- backend/src/qa/openWeightVlmGatewayProviderAdapterNoModelHttp.mjs
- backend/tests/open-weight-vlm-benchmark.test.mjs
- docs/backend-internal-vlm-gateway-contract-preflight.md
- docs/backend-internal-vlm-gateway-provider-routing.md
- docs/handoff/codex-transition-handoff.md
- docs/open-weight-vlm-local-operator-runbook.md
- docs/open-weight-vlm-local-sandbox-review-summary.md
- docs/open-weight-vlm-local-smoke-expansion-gate.md
- docs/phase-log.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- Backend tests include the new no-model provider adapter HTTP cases.
- Provider adapter no-model HTTP CLI should report `networkCallsMade:true` only for local/private no-model HTTP, `modelCallsMade:false`, `qwenInferenceRun:false`, `modelInferenceRun:false`, `benchmarkRun:false`, raw persistence flags false, `eligibleForProviderAdapterNoModelHttpReview:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- Manual checklist updated for Phase 21-D.

### Known TODOs

- Phase 21-E should remain backend-internal unless a future explicit prompt chooses otherwise.
- Real local model routing remains blocked from the gateway provider policy.
- vLLM, SGLang, Ollama, and LM Studio execution remain blocked.
- Production endpoint, app-facing endpoint, real user-photo upload, consent UI, privacy disclosure, retention/deletion, quota/abuse controls, and production rollout remain blocked.

### Ready for Phase 21-E

Yes, for another explicitly requested backend-internal no-model planning/check phase only. Phase 21-D does not approve iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, Qwen inference, fixture inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-E - Cross-platform Backend Deployment Boundary Audit + Gate

Status: Implemented
Date: 2026-06-16

### Summary

Phase 21-E adds a cross-platform and deployment boundary audit for the Windows-primary VLM sandbox, future MacBook/Xcode verification, future production backend, and future VLM provider server. It is a no-network/no-model planning gate that prevents local Windows paths, Mac local paths, LAN model URLs, provider secrets, direct iOS provider routes, Camera cloud entries, endpoint flags, raw artifact policy allowances, and `productionReady:true` from leaking into runtime or production-facing buckets.

### Completed

- Added `docs/cross-platform-backend-deployment-boundary.md`.
- Added `backend/src/qa/openWeightVlmCrossPlatformDeploymentBoundary.mjs`.
- Added `backend/scripts/check-open-weight-vlm-cross-platform-deployment-boundary.mjs`.
- Added `npm run qa:open-weight-vlm:cross-platform-boundary`.
- Defined deployment roles for Windows local machine, MacBook/Xcode, main backend, and VLM provider server.
- Defined runtime vs docs-only path rules.
- Extended backend tests for valid policy, docs-only Windows path allowance, runtime Windows/Mac path blocking, iOS LAN model URL blocking, committed public/cloud/tunnel URL blocking, provider secret blocking, iOS direct provider route blocking, Camera cloud entry blocking, endpoint flag blocking, payload/capture-context change blocking, production config boundary blocking, raw artifact policy blocking, production flag blocking, and sanitized CLI output.
- Updated README, backend README, iOS README, handoff, gateway docs, VLM runbooks/sandbox docs, and manual smoke tests.

### Changed Files

- README.md
- backend/README.md
- backend/package.json
- backend/scripts/check-open-weight-vlm-cross-platform-deployment-boundary.mjs
- backend/src/qa/openWeightVlmCrossPlatformDeploymentBoundary.mjs
- backend/tests/open-weight-vlm-benchmark.test.mjs
- docs/backend-internal-vlm-gateway-contract-preflight.md
- docs/backend-internal-vlm-gateway-provider-routing.md
- docs/cross-platform-backend-deployment-boundary.md
- docs/handoff/codex-transition-handoff.md
- docs/open-weight-vlm-local-operator-runbook.md
- docs/open-weight-vlm-local-sandbox-review-summary.md
- docs/open-weight-vlm-local-smoke-expansion-gate.md
- docs/open-weight-vlm-serving-benchmark-preflight.md
- docs/phase-log.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- Backend tests should include the new cross-platform deployment boundary cases.
- Cross-platform boundary CLI should report `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, `eligibleForDeploymentBoundaryReview:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- Manual checklist updated for Phase 21-E.

## Phase 21-F - Backend Deployment Config / Env Preflight

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-F defines backend deployment config/env boundaries and adds a no-network deployment config preflight gate. It prepares future production/server deployment rules without adding production runtime behavior.

### Completed

- Added `docs/backend-deployment-config-env-preflight.md`.
- Added `backend/src/qa/openWeightVlmDeploymentConfigEnvPreflight.mjs`.
- Added `backend/scripts/check-open-weight-vlm-deployment-config-env-preflight.mjs`.
- Added `npm run qa:open-weight-vlm:deployment-config-env-preflight`.
- Defined allowed policy categories for app environment, gateway mode, provider mode, provider URL bucket, provider auth mode, secret injection mode, timeout bucket, max image bytes bucket, raw logging disabled, metadata stripping required, consent required, retention policy required, deletion policy required, and `PHOTO_ADVISOR_PRODUCTION_READY=false`.
- Defined forbidden committed config: provider/model secrets, iOS provider keys, runtime Windows/Mac paths, iOS LAN model URLs, committed production model URLs, public/cloud/tunnel local provider URLs, raw image/base64/path/prompt/model/request logging, endpoint flags, real upload without required policies, capture-context upload, Camera cloud AI entry, model calls, Qwen inference, benchmarks, and `productionReady:true`.
- Extended backend tests for valid local/staging policies, production flag blocking, secret/key blocking, runtime path and unsafe URL blocking, raw logging and upload-policy gaps, endpoint/camera/capture-context flags, execution flags, and sanitized output.
- Updated backend, iOS, operator, boundary, handoff, and manual smoke docs.

### Verification

- The new preflight CLI is no-network, no-model, no-Qwen, no-benchmark, and prints sanitized bucket summaries only.
- No external server workspace files were modified.
- No real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama execution, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, committed secrets, raw artifacts, training/fine-tuning, or production rollout was added.
- `productionReady:false` remains required.

### Ready for Phase 21-G

Yes, for another explicitly requested backend-internal no-model planning/check phase only. A safe candidate is gateway fallback/failure taxonomy mapping for contract, route, healthz, echo, validation, privacy, deployment-boundary, and config/env blockers. Phase 21-F does not approve iOS integration, app-facing endpoints, production endpoints, real user-photo upload, auth/billing/quota runtime, serving benchmark execution, Qwen inference, fixture inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-G - Backend Gateway Local Model Route Approval Gate

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-G defines a backend-internal approval gate for a future `local_model` provider route. It validates approval prerequisites only and does not enable `local_model`.

### Completed

- Added `docs/backend-gateway-local-model-route-approval-gate.md`.
- Added `backend/src/qa/openWeightVlmLocalModelRouteApprovalGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-local-model-route-approval-gate.mjs`.
- Added `npm run qa:open-weight-vlm:local-model-route-approval`.
- Defined required approval conditions: clean repo, upstream sync, Phase 21-G committed/pushed, deployment config/env preflight, cross-platform boundary, provider routing, provider adapter no-model HTTP, safe healthz, `publicExposure:no`, `rawLoggingDisabled:true`, local/private endpoint, ignored local config/registry/fixtures, future explicit user approval, scoped fixture tokens, no upload, no iOS integration, no endpoints, structured candidate JSON, backend validator, fallback/safety gates, and `productionReady:false`.
- Defined blockers for production readiness, public/cloud/tunnel exposure, raw logging/persistence, direct iOS provider/model calls, Camera cloud AI entry, backend/iOS payload drift, endpoints, user-photo upload, missing consent/retention/deletion policy, staged local artifacts, unsupported provider mode, validator bypass, fallback bypass, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, Qwen inference, model calls, and benchmark execution.
- Extended backend tests for approval-ready pass, blocked production/exposure, raw logging/persistence/artifact staging, iOS boundary/upload policy, validator/safety bypasses, missing prerequisites/execution flags, sanitized raw policy values, and CLI output.
- Updated backend, iOS, operator, boundary, gateway, serving preflight, handoff, and manual smoke docs.

### Verification

- The new approval gate CLI is no-network, no-model, no-Qwen, no-benchmark, and prints sanitized bucket summaries only.
- `localModelRouteEnabled:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, and `productionReady:false` remain required.
- No external server workspace files were modified.
- No real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama execution, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, committed secrets, raw artifacts, training/fine-tuning, local model route enablement, or production rollout was added.

### Ready for Phase 21-H

Yes, for another explicitly requested backend-internal no-model planning/check phase only. A safe candidate is gateway fallback/failure taxonomy mapping for local model route approval blockers. Phase 21-G does not approve local model route enablement, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, auth/billing/quota runtime, serving benchmark execution, Qwen inference, fixture inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 21-G2 - Missing Feature + Deferred Roadmap Register

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-G2 adds a docs-only missing feature and deferred roadmap register so future sessions have a durable memory of planned, missing, deferred, blocked, partially built, and not-yet-integrated features.

### Completed

- Added `docs/missing-features-and-deferred-roadmap-register.md`.
- Reviewed the repo Markdown inventory returned by the required PowerShell listing command: 103 Markdown/Markdown-like files, excluding `node_modules`, `.git`, and local VLM sample paths.
- Inspected current implementation structure without runtime changes: iOS source tree, `backend/src`, `backend/scripts`, `backend/package.json`, `backend/tests`, `docs/phase-log.md`, and `docs/handoff/codex-transition-handoff.md`.
- Recorded the current confirmed foundation with cautious wording: post-capture Photo Advisor mock/local flow, backend validator/schema/QA gates, open-weight VLM synthetic benchmark harness, local Qwen2.5-VL sandbox and 12-fixture smoke history, backend gateway contract preflight, provider routing/no-model adapter checks, deployment config/env boundary, cross-platform boundary, local model route approval gate, Phase 21-H dry-run plan, and `productionReady:false`.
- Added the missing/deferred feature register for Live Advisor/camera-view AI, local on-device CV camera aids, image compression/upload payload policy, backend production API, VLM model/serving, Photo Advisor UX/product, iOS integration, Store/account/release, and advanced future features.
- Recorded the then-current Qwen MoE target direction; Phase 21-W-R1 later clarifies the future target candidate as `Qwen3-VL-30B-A3B` for a separately approved model phase. The same non-thinking/instruct mode, vLLM/SGLang serving direction, Auto-Trigger stillness >1s, no capture/upload at <=1s, max 1 FPS cloud analysis, stateful WSS, frontend compression, INT4/INT8 quantization, local on-device CV split, and consent/no-silent-upload boundary remain.
- Added tiny references in README, backend README, iOS README, handoff, and manual smoke docs.

### Verification

- Docs-only implementation; no runtime source, backend route, package script, iOS source/project/localization, endpoint, model call, Qwen inference, fixture inference, serving benchmark, Auto-Trigger runtime, WSS runtime, upload/compression runtime, auth/billing/quota runtime, external workspace change, secret, raw artifact, or production readiness change was added.
- `productionReady:false` remains the default.

### Ready for Next Phase

Yes, for another explicitly requested planning/preflight phase only. Future operators should reconcile phase numbering because this G2 prompt proposed a new Phase 21-H label while the current repo already contains a committed Phase 21-H dry-run plan.

---

## Phase 21-G3 - Phase Roadmap Sequencing + Next Action Reminder Register

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-G3 adds a docs-only phase roadmap sequencing and next-action reminder register so future Codex/ChatGPT sessions know what phase to recommend after a completed commit/push.

### Completed

- Added `docs/phase-roadmap-sequencing-and-next-action-register.md`.
- Reviewed the required docs and repo Markdown inventory returned by the PowerShell listing command: 104 Markdown/Markdown-like files, excluding `node_modules`, `.git`, and local VLM sample paths.
- Added usage rules for future Codex sessions: verify commit/push status, check upstream `0 0`, read the sequencing register, report the current next recommended phase, and provide the next prompt directly if the user asks.
- Added phase-numbering reconciliation rules because the repo already contains a committed Phase 21-H local model route dry-run plan.
- Added the recommended sequence from Phase 21-H2 through Phase 23+, covering model/live-advisor target reset, upload/compression policy, Auto-Trigger policy, WSS protocol preflight, local CV camera aids, quantization/serving benchmark planning, approved one-fixture local model route smoke, approved serving benchmark execution, debug-only iOS backend integration, debug compressed upload, debug Auto-Trigger Live Advisor, and beta/production readiness gates.
- Added big phase grouping and feature-to-phase mapping.
- Set the then-current next recommended phase to Phase 21-H2: Qwen VLM + Live Advisor Target Re-evaluation Gate, docs/gate only; Phase 21-W-R1 later clarifies `Qwen3-VL-30B-A3B` as the future target candidate.
- Updated README, backend README, iOS README, handoff, and this phase log with minimal references.

### Verification

- Docs-only implementation; no runtime source, backend route, package script, backend test, iOS source/project/localization, endpoint, model call, Qwen inference, fixture inference, serving benchmark, Auto-Trigger runtime, WSS runtime, upload/compression runtime, auth/billing/quota runtime, external workspace change, secret, raw artifact, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-H2 only if explicitly requested as docs/gate-only target re-evaluation work. Any model call, upload, WSS runtime, iOS runtime, endpoint, serving benchmark, or production behavior requires separate explicit approval.

---

## Phase 21-W-R1 - Controlled 12-fixture Serving Benchmark Block Resolution

Status: Implemented
Date: 2026-06-19

### Summary

Resolved the Phase 21-W controlled benchmark preflight blocker `blocked_for_unsafe_endpoint_bucket` without running model calls, benchmark calls, fixture inference, or inference endpoint calls.

### Root Cause

The local config parser emits concrete sanitized endpoint buckets such as `local_loopback_ip`, `local_loopback_name`, and `private_lan_ipv4`. The healthz preflight already normalizes those to `local_loopback` / `private_lan`, but the controlled multi-fixture benchmark wrapper was checking only the normalized bucket names directly.

### Completed Work

- Updated `backend/scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs` to normalize endpoint buckets before policy evaluation.
- Exported no-network helper functions for endpoint bucket normalization tests.
- Updated `backend/tests/transformers-fastapi-controlled-multifixture-serving-benchmark.test.mjs` with local loopback, private LAN, public IP/domain, tunnel, credentialed URL, query-string secret, `0.0.0.0`, and private-LAN opt-in coverage.
- Added `docs/phase-21-w-r1-controlled-12-fixture-endpoint-bucket-block-resolution.md`.
- Updated roadmap, readmes, handoff, and manual smoke docs.
- Clarified `Qwen3-VL-30B-A3B` as the future target candidate for a later separately approved model upgrade/benchmark phase only.

### Verification

- Focused controlled wrapper test passed.
- Sanitized config-bucket comparison showed current local config bucket normalizes to an allowed controlled wrapper bucket.
- Final verification is recorded in task closeout.

### Boundaries

- No model call.
- No benchmark call.
- No fixture inference.
- No inference endpoint call.
- No 12-fixture benchmark command rerun.
- No vLLM/SGLang/Ollama call.
- No model install, download, load, switch, or benchmark for `Qwen3-VL-30B-A3B`.
- No serving runtime change.
- No serving stack switch.
- No external server restart or modification.
- No server prompt/mapper/model behavior patch.
- No iOS integration.
- No app-facing or production endpoint.
- No Auto-Trigger runtime.
- No WSS runtime.
- No upload runtime.
- No raw endpoint URL, local config contents, fixture registry contents, prompt, model output, image path, base64, request payload, server logs, EXIF/GPS/sensor data, or secrets printed or committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-W-R1B only after separate explicit user approval because it may run controlled benchmark model calls.

---

## Phase 21-W - Approved Controlled 12-fixture Transformers+FastAPI Serving Benchmark

Status: Preflight blocked
Date: 2026-06-19

### Summary

Attempted the explicitly approved controlled 12-fixture Transformers+FastAPI reference serving benchmark exactly once. The guarded wrapper stopped before any model calls with sanitized blocker bucket `blocked_for_unsafe_endpoint_bucket`.

### Completed Work

- Added `backend/scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs`.
- Added `backend/tests/transformers-fastapi-controlled-multifixture-serving-benchmark.test.mjs`.
- Added npm script `qa:open-weight-vlm:transformers-fastapi-controlled-multifixture-serving-benchmark`.
- Added `docs/phase-21-w-transformers-fastapi-controlled-12-fixture-serving-benchmark-report.md`.
- Confirmed exact approved fixture set: `smoke_004`, `smoke_005`, `smoke_006`, `smoke_007`, `smoke_008`, `smoke_009`, `smoke_010`, `smoke_011`, `smoke_012`, `smoke_013`, `smoke_014`, `smoke_015`.
- Confirmed every approved fixture token was present in the ignored registry, approved, and backed by an ignored/unstaged/untracked local fixture file.
- Confirmed standalone healthz preflight result bucket `safe` before the benchmark attempt.
- Ran the approved benchmark command exactly once; preflight blocked before model calls.
- Updated roadmap sequencing current next phase to Phase 21-W-R1: Controlled 12-fixture Serving Benchmark Block Resolution.

### Result

- Preflight passed: no
- Healthz checked: yes, safe
- Benchmark executed: no
- Model call executed: no
- Inference endpoint called: no
- Fixture tokens used for attempted scope: `smoke_004` through `smoke_015`
- Actual call count: `0`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `0`
- Blocked count: `1`
- Sanitized blocker bucket: `blocked_for_unsafe_endpoint_bucket`
- Latency bucket distribution: not applicable

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs`
- `backend/tests/transformers-fastapi-controlled-multifixture-serving-benchmark.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-w-transformers-fastapi-controlled-12-fixture-serving-benchmark-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Repo was clean and upstream sync was `0 0` before work.
- Phase 21-V and Phase 21-W0 commit markers were present.
- `git diff --check` passed before benchmark attempt.
- Backend tests passed after adding the wrapper guard test.
- Required no-model gates passed before the benchmark attempt.
- Final verification is recorded in task closeout.

### Boundaries

- No model call.
- No benchmark/inference endpoint call.
- No retry.
- No `smoke_001` benchmark call.
- No fixture outside `smoke_004` through `smoke_015`.
- No concurrency benchmark.
- No quantization benchmark.
- No Live Advisor simulation.
- No vLLM/SGLang/Ollama call.
- No serving stack switch.
- No production `local_model` enablement.
- No iOS integration.
- No app-facing or production endpoint.
- No Auto-Trigger runtime.
- No WSS runtime.
- No upload runtime.
- No raw prompt, model output, payload, image path, base64, server URL, server log, config contents, registry contents, EXIF/GPS/sensor data, or secret printed or persisted.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-W-R1 block resolution only. Any rerun of Phase 21-W model calls or benchmark calls requires separate explicit approval.

---

## Phase 21-W0 - Approved Fixture Token Inventory for Controlled Benchmark

Status: Implemented
Date: 2026-06-19

### Summary

Safely inspected the ignored local fixture registry and local fixture file readiness with sanitized token/count output only. The inventory found 13 approved ready fixture tokens, not exactly 12, so Phase 21-W is not ready from the placeholder approval text.

### Completed Work

- Added `docs/phase-21-w0-approved-fixture-token-inventory.md`.
- Reported approved fixture tokens only because they are safe opaque IDs.
- Confirmed approved fixture count `13`, ready fixture count `13`, missing fixture files `0`, unapproved fixture count `0`, duplicate token count `0`, and unexpected token shape count `0`.
- Confirmed every approved fixture file has extension bucket `jpg`, is present, ignored, unstaged, and untracked.
- Confirmed exactly-12 readiness is false and no copyable Phase 21-W approval phrase was generated.
- Updated roadmap sequencing current next phase to Phase 21-W0: Approved Fixture Token Inventory / Registry Prep.

### Approved Tokens

- `smoke_001`
- `smoke_004`
- `smoke_005`
- `smoke_006`
- `smoke_007`
- `smoke_008`
- `smoke_009`
- `smoke_010`
- `smoke_011`
- `smoke_012`
- `smoke_013`
- `smoke_014`
- `smoke_015`

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/phase-21-w0-approved-fixture-token-inventory.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Repo was clean and upstream sync was `0 0` before work.
- Registry was inspected without printing raw registry JSON, raw file paths, config contents, model server URL, secrets, image metadata, EXIF/GPS/sensor data, prompts, payloads, or model outputs.
- No model call, endpoint call, healthz check, fixture inference, serving benchmark, or Qwen inference was run.
- Final verification is recorded in task closeout.

### Boundaries

- No model call.
- No benchmark.
- No fixture inference.
- No endpoint call.
- No healthz check.
- No vLLM/SGLang/Ollama call.
- No local config, fixture registry, or fixture image modification.
- No image open/OCR/EXIF/GPS/sensor inspection.
- No iOS integration.
- No raw artifact, local config, fixture registry JSON, fixture image path, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

No, not for a 12-fixture Phase 21-W benchmark yet. The user must choose exactly 12 tokens from the 13 approved ready tokens, or explicitly request a controlled 13-fixture scope.

---

## Phase 21-V - Controlled Multi-fixture Serving Benchmark Approval Request Draft

Status: Implemented
Date: 2026-06-19

### Summary

Added a user-facing approval request draft and backend no-model dry-run gate for a possible future controlled multi-fixture Transformers+FastAPI serving benchmark. Phase 21-V does not execute the benchmark; it defines the approval wording and safety guard for a future Phase 21-W.

### Completed Work

- Added `docs/controlled-multifixture-serving-benchmark-approval-request-draft.md`.
- Added `backend/src/qa/openWeightVlmControlledMultifixtureServingBenchmarkApprovalRequest.mjs`.
- Added `backend/scripts/check-open-weight-vlm-controlled-multifixture-serving-benchmark-approval-request.mjs`.
- Added npm script `qa:open-weight-vlm:controlled-multifixture-serving-benchmark-approval-request`.
- Added `backend/tests/controlled-multifixture-serving-benchmark-approval-request.test.mjs`.
- Drafted future Phase 21-W approval phrases for a controlled 3-fixture pilot and a controlled 12-fixture benchmark.
- Added gate coverage for draft-only mode, explicit user approval, explicit fixture-token requirement, approved ignored registry requirement, exact fixture/call count matching, zero retries, healthz requirement, local/private endpoint class, raw artifact blocks, iOS/endpoint/runtime blocks, serving-switch block, and `productionReady:false`.
- Updated roadmap sequencing current next phase to Phase 21-W: Approved Controlled Multi-fixture Transformers+FastAPI Serving Benchmark.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-controlled-multifixture-serving-benchmark-approval-request.mjs`
- `backend/src/qa/openWeightVlmControlledMultifixtureServingBenchmarkApprovalRequest.mjs`
- `backend/tests/controlled-multifixture-serving-benchmark-approval-request.test.mjs`
- `docs/controlled-multifixture-serving-benchmark-approval-request-draft.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Repo was clean and upstream sync was `0 0` before work.
- New controlled multi-fixture approval request tests passed.
- New controlled multi-fixture approval request CLI passed with no network/model/benchmark execution.
- Full backend test suite and no-model verification gates passed.
- Final verification is recorded in task closeout.

### Boundaries

- No serving runtime started.
- No endpoint called.
- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No controlled multi-fixture benchmark.
- No 12-fixture benchmark.
- No concurrency benchmark.
- No quantization benchmark.
- No Live Advisor simulation.
- No vLLM/SGLang/Ollama call.
- No serving stack switch.
- No model download.
- No production route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No Camera cloud AI runtime entry.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No upload or image compression runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-W only after separate explicit user approval because it may run multiple backend local/private model calls. Without that approval, do not run a controlled multi-fixture benchmark.

---

## Phase 21-U - Approved Transformers+FastAPI One-fixture Serving Benchmark

Status: Implemented
Date: 2026-06-19

### Summary

Ran the explicitly approved Transformers+FastAPI reference one-fixture serving benchmark after the Phase 21-T approval request draft and Phase 21-N-R1E accepted smoke. The benchmark used only `smoke_001`, exactly one backend local/private model call, and zero retries.

### Completed Work

- Added `backend/scripts/run-open-weight-vlm-transformers-fastapi-one-fixture-serving-benchmark.mjs`.
- Added npm script `qa:open-weight-vlm:transformers-fastapi-one-fixture-serving-benchmark`.
- Added `backend/tests/transformers-fastapi-one-fixture-serving-benchmark.test.mjs`.
- Reconfirmed ignored local config, fixture registry, and `smoke_001` fixture were present, ignored, untracked, and unstaged.
- Reconfirmed healthz once before the benchmark call; result bucket was `safe`.
- Ran exactly one approved benchmark command with `--approved-one-call`, `--serving-stack transformers_fastapi_reference`, `--fixture smoke_001`, `--call-count 1`, and `--no-retry`.
- Recorded sanitized benchmark result: accepted, `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, and latency bucket `gt_15s`.
- Added `docs/phase-21-u-transformers-fastapi-one-fixture-serving-benchmark-report.md`.
- Updated roadmap sequencing current next phase to Phase 21-V: Controlled Multi-fixture Serving Benchmark Approval Request Draft.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/run-open-weight-vlm-transformers-fastapi-one-fixture-serving-benchmark.mjs`
- `backend/tests/transformers-fastapi-one-fixture-serving-benchmark.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-u-transformers-fastapi-one-fixture-serving-benchmark-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Repo was clean and upstream sync was `0 0` before work.
- Healthz preflight passed with sanitized result bucket `safe`.
- Full backend test suite passed.
- Required no-model gates passed before the one benchmark call.
- One benchmark call executed once and was not retried.
- Final verification is recorded in task closeout.

### Boundaries

- No second model call.
- No retry.
- No second fixture.
- No 12-fixture benchmark.
- No controlled multi-fixture benchmark.
- No concurrency benchmark.
- No quantization benchmark.
- No Live Advisor 1 FPS simulation.
- No vLLM/SGLang/Ollama call.
- No serving stack switch.
- No model download.
- No production `local_model` route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No Camera cloud AI runtime entry.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No upload or image compression runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-V as a controlled multi-fixture serving benchmark approval request draft only. Any future multi-fixture benchmark, serving-stack comparison, quantization benchmark, Live Advisor simulation, endpoint, iOS integration, or production rollout requires separate explicit approval.

---

## Phase 21-T - One-fixture Serving Benchmark Approval Request Draft

Status: Implemented
Date: 2026-06-19

### Summary

Added a draft-only approval request for the next possible one-fixture serving benchmark after the Phase 21-S serving stack comparison matrix. Phase 21-T does not execute the benchmark; it defines the exact future approval wording and backend no-model guard.

### Completed Work

- Added `docs/one-fixture-serving-benchmark-approval-request-draft.md`.
- Added `backend/src/qa/openWeightVlmOneFixtureServingBenchmarkApprovalRequest.mjs`.
- Added `backend/scripts/check-open-weight-vlm-one-fixture-serving-benchmark-approval-request.mjs`.
- Added npm script `qa:open-weight-vlm:one-fixture-serving-benchmark-approval-request`.
- Added `backend/tests/one-fixture-serving-benchmark-approval-request.test.mjs`.
- Drafted the future approval phrase for Phase 21-U: one Transformers+FastAPI reference serving benchmark, fixture `smoke_001`, call count 1, retry count 0.
- Added the safer alternative phrase for `Phase 21-U-preflight only`.
- Updated roadmap sequencing current next phase to Phase 21-U: Approved Transformers+FastAPI One-fixture Serving Benchmark.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-one-fixture-serving-benchmark-approval-request.mjs`
- `backend/src/qa/openWeightVlmOneFixtureServingBenchmarkApprovalRequest.mjs`
- `backend/tests/one-fixture-serving-benchmark-approval-request.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/one-fixture-serving-benchmark-approval-request-draft.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted one-fixture approval request tests passed.
- One-fixture approval request CLI passed with `approvalRequestGateEligible:true`, `safeDraftOnlyRequestPassed:true`, `reviewedScenarioCount:17`, `expectedBlockedScenarioCount:16`, `servingRuntimeStarted:false`, `endpointCalled:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `servingStackSwitched:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No serving runtime started.
- No endpoint called.
- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No serving stack switch.
- No vLLM/SGLang/Ollama call.
- No model download.
- No production `local_model`, vLLM, or SGLang route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-U only after separate explicit user approval because Phase 21-U may run exactly one backend local/private model call. Without that approval, use the safer `Phase 21-U-preflight only` path.

### Corrective Commit Marker Note

Phase 21-T artifacts were implemented, but one pushed commit was mislabeled as Phase 21-S. Phase 21-T-R1A adds this corrective note so git history has a visible `Phase 21-T: draft one-fixture serving benchmark approval request` marker. No model call, benchmark, healthz check, runtime change, ignored local artifact change, iOS runtime change, endpoint, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

---

## Phase 21-S - Serving Stack No-model Comparison Matrix

Status: Implemented
Date: 2026-06-19

### Summary

Added a no-model serving stack comparison matrix after the Phase 21-R SGLang contract preflight. The matrix compares Transformers+FastAPI, vLLM, SGLang, and Ollama/LM Studio for future Retro Photo Advisor serving decisions without running any serving runtime or execution path.

### Completed Work

- Added `docs/serving-stack-no-model-comparison-matrix.md`.
- Added `backend/src/qa/openWeightVlmServingStackComparisonMatrix.mjs`.
- Added `backend/scripts/check-open-weight-vlm-serving-stack-comparison-matrix.mjs`.
- Added npm script `qa:open-weight-vlm:serving-stack-comparison-matrix`.
- Added `backend/tests/serving-stack-comparison-matrix.test.mjs`.
- Recorded required conclusions: Transformers+FastAPI remains correctness/reference baseline, vLLM remains primary future benchmark candidate, SGLang remains structured-output/performance challenger, Ollama/LM Studio remains manual-only and not production route, R1E is not production readiness, and `gt_15s` remains an iOS/live readiness blocker.
- Added dry-run blockers for serving runtime/execution requests, endpoint calls, model calls, benchmarks, model downloads, serving-stack switches, production routes, raw logging/persistence, missing structured JSON/validator/fallback/safety, iOS integration, app/prod endpoints, Camera cloud entry, unknown stacks, Ollama/LM Studio production use, and `productionReady:true`.
- Updated roadmap sequencing current next phase to Phase 21-T: One-fixture Serving Benchmark Approval Request Draft.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-serving-stack-comparison-matrix.mjs`
- `backend/src/qa/openWeightVlmServingStackComparisonMatrix.mjs`
- `backend/tests/serving-stack-comparison-matrix.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/serving-stack-no-model-comparison-matrix.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted serving stack comparison matrix tests passed.
- Serving stack comparison matrix CLI passed with `comparisonMatrixEligible:true`, `safeNoModelComparisonPassed:true`, `reviewedScenarioCount:17`, `expectedBlockedScenarioCount:13`, `servingRuntimeStarted:false`, `endpointCalled:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `servingStackSwitched:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No serving runtime started.
- No endpoint called.
- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No serving stack switch.
- No vLLM/SGLang/Ollama call.
- No model download.
- No production `local_model`, vLLM, or SGLang route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-T approval-request/draft work only. Phase 21-T must not run model calls, endpoint calls, serving runtime, Qwen inference, fixture inference, serving benchmarks, model downloads, serving-stack switches, iOS integration, or production rollout unless separately approved.

---

## Phase 21-R - SGLang No-model Serving Contract Preflight

Status: Implemented
Date: 2026-06-19

### Summary

Added a no-model SGLang serving contract preflight after the Phase 21-Q vLLM contract preflight. The preflight treats SGLang as a future structured-output/performance challenger only and defines backend-mediated structured JSON request/response boundaries before any SGLang runtime or execution exists.

### Completed Work

- Added `docs/sglang-no-model-serving-contract-preflight.md`.
- Added `backend/src/qa/openWeightVlmSglangServingContractPreflight.mjs`.
- Added `backend/scripts/check-open-weight-vlm-sglang-serving-contract-preflight.mjs`.
- Added npm script `qa:open-weight-vlm:sglang-contract-preflight`.
- Added `backend/tests/sglang-serving-contract-preflight.test.mjs`.
- Defined future SGLang request/response boundary assumptions: backend-mediated only, structured candidate JSON only, no raw prompt/output/image/base64/path/request payload logging or persistence, and backend validator/fallback/safety as source of truth.
- Added dry-run blockers for SGLang runtime start, endpoint calls, model calls, benchmarks, model downloads, serving-stack switches, public endpoint classes, raw logging/persistence, missing structured JSON/validator/fallback/safety, iOS direct calls/keys, app/prod endpoints, Camera cloud entry, text-only image-analysis models, score/rating, sensitive inference, chain-of-thought, and `productionReady:true`.
- Updated roadmap sequencing current next phase to Phase 21-S: Serving Stack No-model Comparison Matrix.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-sglang-serving-contract-preflight.mjs`
- `backend/src/qa/openWeightVlmSglangServingContractPreflight.mjs`
- `backend/tests/sglang-serving-contract-preflight.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/sglang-no-model-serving-contract-preflight.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted SGLang contract preflight tests passed.
- SGLang contract preflight CLI passed with `sglangContractPreflightEligible:true`, `safeNoModelContractPassed:true`, `sglangRuntimeStarted:false`, `sglangEndpointCalled:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No SGLang runtime started.
- No SGLang endpoint called.
- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No serving stack switch.
- No vLLM/Ollama call.
- No model download.
- No production `local_model` or SGLang route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-S no-model serving-stack comparison matrix only. Phase 21-S must not run SGLang inference, vLLM inference, Ollama inference, model calls, fixture inference, serving benchmarks, model downloads, serving-stack switches, endpoints, iOS integration, or production rollout unless separately approved.

---

## Phase 21-Q - vLLM No-model Serving Contract Preflight

Status: Implemented
Date: 2026-06-19

### Summary

Added a no-model vLLM serving contract preflight after the Phase 21-P approval matrix. The preflight treats vLLM as a future benchmark candidate only and defines backend-mediated structured JSON request/response boundaries before any vLLM runtime or execution exists.

### Completed Work

- Added `docs/vllm-no-model-serving-contract-preflight.md`.
- Added `backend/src/qa/openWeightVlmVllmServingContractPreflight.mjs`.
- Added `backend/scripts/check-open-weight-vlm-vllm-serving-contract-preflight.mjs`.
- Added npm script `qa:open-weight-vlm:vllm-contract-preflight`.
- Added `backend/tests/vllm-serving-contract-preflight.test.mjs`.
- Defined future vLLM request/response boundary assumptions: backend-mediated only, structured candidate JSON only, no raw prompt/output/image/base64/path/request payload logging or persistence, and backend validator/fallback/safety as source of truth.
- Added dry-run blockers for vLLM runtime start, endpoint calls, model calls, benchmarks, model downloads, serving-stack switches, public endpoint classes, raw logging/persistence, missing structured JSON/validator/fallback/safety, iOS direct calls/keys, app/prod endpoints, Camera cloud entry, text-only image-analysis models, score/rating, sensitive inference, chain-of-thought, and `productionReady:true`.
- Updated roadmap sequencing current next phase to Phase 21-R: SGLang No-model Serving Contract Preflight.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-vllm-serving-contract-preflight.mjs`
- `backend/src/qa/openWeightVlmVllmServingContractPreflight.mjs`
- `backend/tests/vllm-serving-contract-preflight.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/vllm-no-model-serving-contract-preflight.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted vLLM contract preflight tests passed.
- vLLM contract preflight CLI passed with `vllmContractPreflightEligible:true`, `safeNoModelContractPassed:true`, `vllmRuntimeStarted:false`, `vllmEndpointCalled:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No vLLM runtime started.
- No vLLM endpoint called.
- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No serving stack switch.
- No SGLang/Ollama call.
- No model download.
- No production `local_model` or vLLM route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-R no-model SGLang contract preflight only. Phase 21-R must not run SGLang inference, vLLM inference, Ollama inference, model calls, fixture inference, serving benchmarks, model downloads, serving-stack switches, endpoints, iOS integration, or production rollout unless separately approved.

---

## Phase 21-P - Serving Benchmark Plan Approval Matrix

Status: Implemented
Date: 2026-06-19

### Summary

Added a no-model serving benchmark plan approval matrix after the Phase 21-O execution scope gate. The matrix defines explicit approval classes for future benchmark/model-call plans and keeps execution blocked by default.

### Completed Work

- Added `docs/serving-benchmark-plan-approval-matrix.md`.
- Added `backend/src/qa/openWeightVlmServingBenchmarkApprovalMatrix.mjs`.
- Added `backend/scripts/check-open-weight-vlm-serving-benchmark-approval-matrix.mjs`.
- Added npm script `qa:open-weight-vlm:serving-benchmark-approval-matrix`.
- Added `backend/tests/serving-benchmark-approval-matrix.test.mjs`.
- Defined approval classes for no-model contract preflight, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation.
- Documented that no-model contract preflight may pass without model-call approval, while one-fixture smoke, controlled benchmarks, stack comparisons, quantization benchmarks, and Live Advisor simulations require separate explicit scoped approval before execution.
- Updated roadmap sequencing current next phase to Phase 21-Q: vLLM No-model Serving Contract Preflight.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-serving-benchmark-approval-matrix.mjs`
- `backend/src/qa/openWeightVlmServingBenchmarkApprovalMatrix.mjs`
- `backend/tests/serving-benchmark-approval-matrix.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/serving-benchmark-plan-approval-matrix.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted approval-matrix tests passed.
- Approval matrix CLI passed with `approvalMatrixEligible:true`, `defaultNoModelContractPassed:true`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No vLLM/SGLang/Ollama call.
- No model download.
- No serving stack switch.
- No production `local_model` enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-Q no-model contract preflight only. Phase 21-Q must not run vLLM inference, SGLang inference, Ollama inference, model calls, fixture inference, serving benchmarks, model downloads, serving-stack switches, endpoints, iOS integration, or production rollout unless separately approved.

---

## Phase 21-O - Approved Serving Benchmark Execution Preflight / Scope Gate

Status: Implemented
Date: 2026-06-19

### Summary

Added a no-model serving benchmark execution preflight/scope gate after the accepted Phase 21-N-R1E one-fixture smoke. The gate defines future benchmark categories and blocks real execution by default unless a future explicitly approved scope exists.

### Completed Work

- Added `docs/serving-benchmark-execution-preflight-scope-gate.md`.
- Added `backend/src/qa/openWeightVlmServingBenchmarkExecutionScopeGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-serving-benchmark-execution-scope-gate.mjs`.
- Added npm script `qa:open-weight-vlm:serving-benchmark-scope-gate`.
- Added `backend/tests/serving-benchmark-execution-scope-gate.test.mjs`.
- Defined benchmark categories: no-model serving contract checks, one-fixture serving path smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation.
- Documented that R1E is not production readiness because it covered one fixture, one local/private path, no concurrency, no 12-fixture benchmark, no vLLM/SGLang/quantization benchmark, no Live Advisor 1 FPS simulation, no iOS integration, no production endpoint, and latency bucket `gt_15s`.
- Updated roadmap sequencing current next phase to Phase 21-P: Serving Benchmark Plan Approval Matrix.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-serving-benchmark-execution-scope-gate.mjs`
- `backend/src/qa/openWeightVlmServingBenchmarkExecutionScopeGate.mjs`
- `backend/tests/serving-benchmark-execution-scope-gate.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/serving-benchmark-execution-preflight-scope-gate.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Targeted scope-gate tests passed.
- New scope gate CLI passed with `scopeGateEligible:true`, `defaultNoModelContractPassed:true`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- Full final verification is recorded in task closeout.

### Boundaries

- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No vLLM/SGLang/Ollama call.
- No model download.
- No serving stack switch.
- No production `local_model` enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-P planning only. Phase 21-P should remain no-model/docs/gate unless separately approved.

---

## Phase 21-N-R1E - Approved One-fixture Local Model Smoke Retry After Healthz Fix

Status: Implemented
Date: 2026-06-19

### Summary

Ran the explicitly approved one-fixture backend local/private model smoke retry after healthz fix. The guarded command ran exactly once with `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`; it made one local/private model call and was accepted by backend validation.

### Completed Work

- Confirmed repo was clean and upstream sync was `0 0`.
- Confirmed ignored local config, ignored fixture registry, and ignored `smoke_001` fixture remained present, ignored, untracked, and unstaged.
- Confirmed local config fixture token is `smoke_001`.
- Confirmed registry entry is present and `smoke_001` is approved.
- Reconfirmed healthz once before the model call; result bucket was `safe`.
- Ran required no-model gates and static scans before the call.
- Ran exactly one guarded smoke command with `smoke_001` and zero retries.
- Recorded sanitized aggregate: `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, latency bucket `gt_15s`, raw persistence flags false, and `productionReady:false`.
- Added sanitized R1E report.
- Updated roadmap sequencing current next phase to Phase 21-O: Approved Serving Benchmark Execution Preflight / Scope Gate.

### Changed Files

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r1d-local-model-healthz-block-resolution.md`
- `docs/phase-21-n-r1e-one-fixture-local-model-smoke-retry-after-healthz-fix-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Pre-call healthz preflight: `safe`, model loaded, Qwen/VLM-compatible, raw logging disabled, public exposure `no`, `productionReady:false`.
- Pre-call backend tests: passed, 251/251.
- Pre-call no-model gates passed: local config dry-run, default local sandbox smoke stub/no-network, local smoke gate, local model route approval, quantization serving benchmark plan, Qwen MoE target, image compression/upload policy, Auto-Trigger policy, Stateful WSS protocol, local CV camera aids plan.
- Pre-call scans passed: secret scan, artifact scan, iOS direct provider/model scan, Camera cloud entry diff scan, backend/iOS payload unchanged scan, Photo Advisor copy regression, filter reason coverage, CreativeIntent language coverage, Photo Advisor card language coverage.
- Final verification is recorded in task closeout.

### Boundaries

- Exactly one model call.
- Exactly one fixture token: `smoke_001`.
- Zero retries.
- No serving benchmark.
- No model switch.
- No production `local_model` enablement.
- No vLLM/SGLang/Ollama call.
- No iOS integration.
- No endpoint.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No upload runtime.
- No image compression runtime.
- No iOS upload payload change.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-O preflight/scope planning only. Phase 21-O does not automatically approve benchmark execution, model downloads, serving stack switches, endpoints, iOS integration, production behavior, or additional model calls.

---

## Phase 21-N-R1D - One-fixture Local Model Smoke Retry Healthz Block Resolution

Status: Implemented
Date: 2026-06-19

### Summary

Diagnosed the Phase 21-N-R1C healthz blocker without running a model call. The healthz-only no-model preflight checked healthz once and reported sanitized bucket `connection_refused`, so the future one-fixture smoke retry prerequisite remains unresolved.

### Completed Work

- Added `backend/scripts/check-open-weight-vlm-local-model-healthz-preflight.mjs`.
- Added `backend/tests/local-model-healthz-preflight.test.mjs`.
- Added npm script `qa:open-weight-vlm:local-model-healthz-preflight`.
- Added `docs/phase-21-n-r1d-local-model-healthz-block-resolution.md`.
- Confirmed ignored local config, ignored fixture registry, and ignored `smoke_001` fixture remain present, ignored, untracked, and unstaged.
- Confirmed local config fixture token is `smoke_001`, registry entry is present, `smoke_001` is approved, and endpoint bucket is `local_loopback`.
- Ran exactly one initial healthz-only preflight; result bucket was `connection_refused`.
- Re-ran healthz-only preflight after operator server startup; result bucket is now `safe`.
- Recorded model call executed: no, call count: 0, retry count: 0.
- Updated roadmap sequencing current next phase to Phase 21-N-R1E: Approved One-fixture Local Model Smoke Retry After Healthz Fix.

### Changed Files

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-local-model-healthz-preflight.mjs`
- `backend/tests/local-model-healthz-preflight.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r1c-one-fixture-local-model-smoke-retry-after-config-fix-report.md`
- `docs/phase-21-n-r1d-local-model-healthz-block-resolution.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Verification

- Repository state before work: clean and upstream sync `0 0`.
- Healthz-only preflight recheck: passed with `safe`; `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, raw persistence flags false, and `productionReady:false`.
- Full final verification is recorded in the task closeout.

### Boundaries

- No model call.
- No Qwen inference.
- No fixture inference.
- No serving benchmark.
- No vLLM/SGLang/Ollama call.
- No model download.
- No serving stack switch.
- No production `local_model` route enablement.
- No app-facing or production endpoint.
- No iOS integration.
- No upload runtime.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No raw artifact, local config, fixture registry, fixture image, prompt, request payload, model output, server log, model weight, or credential committed.
- `productionReady:false` remains locked.

### Ready for Next Phase

Yes, for Phase 21-N-R1E planning only. Phase 21-N-R1E requires separate explicit model-call approval before any one-fixture backend local/private smoke retry.

---

## Phase 21-N-R1C - Approved One-fixture Local Model Smoke Retry After Config Fix

Date: 2026-06-18

Status: Preflight blocked at healthz before model call

Goal: Retry the one-fixture backend local/private model smoke after the local config fixture-token fix, using exactly one approved ignored fixture token, `smoke_001`, only if all preflight and healthz gates pass.

Summary:

The user explicitly approved this phase after R1B by saying: "???". Phase 21-N-R1C ran the guarded retry command exactly once with `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`.

The guarded command checked healthz once and blocked before any model call because healthz was unsafe or unavailable in sanitized buckets: ok false, model loaded false, model family bucket unavailable, raw logging disabled false, and public exposure bucket unknown.

This phase did not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, production user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Confirmed repo start state was clean and upstream comparison was `0 0`.
- Confirmed ignored local config, ignored local fixture registry, and ignored `smoke_001` fixture are present, ignored, untracked, and unstaged.
- Confirmed local config fixture token is `smoke_001`.
- Confirmed `smoke_001` registry entry is present and approved.
- Confirmed fixture count for this smoke is 1.
- Ran required no-model gates before the guarded smoke command.
- Ran the guarded smoke command exactly once.
- Recorded healthz preflight blocker: `blocked_for_unsafe_healthz`.
- Confirmed call count 0 and retry count 0.
- Added `docs/phase-21-n-r1c-one-fixture-local-model-smoke-retry-after-config-fix-report.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R1D: One-fixture Local Model Smoke Retry Healthz Block Resolution.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r1b-local-config-fixture-token-resolution.md`
- `docs/phase-21-n-r1c-one-fixture-local-model-smoke-retry-after-config-fix-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed before the guarded command.
- Backend tests passed before the guarded command: `npm test` in `backend` reported 248/248 tests passing.
- Local config dry-run passed with sanitized output, `networkCallsMade:false`, and `productionReady:false`.
- Default local sandbox smoke stub/no-network passed with `eligibleForLocalSandboxSmoke:true`, `networkCallsMade:false`, and `productionReady:false`.
- Local smoke gate passed with `eligibleForRealModelSmoke:true`, `networkCallsMade:false`, and `productionReady:false`.
- Local model route approval gate passed with `approvalEligible:true`, `localModelRouteEnabled:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, and `productionReady:false`.
- Quantization serving benchmark plan, Qwen MoE target, image compression/upload, Auto-Trigger, Stateful WSS, and local CV policy gates passed with no runtime/model/benchmark execution.
- Secret scan, Photo Advisor copy regression, iOS direct provider/model scan, Camera cloud entry scan, backend/iOS payload unchanged scan, and artifact scan passed before the guarded command.
- Ignored local config, ignored fixture registry, and ignored `smoke_001` fixture remained ignored, untracked, and unstaged before the guarded command.

Known TODOs:

- Resolve the local/private healthz blocker without running a model call.
- Do not rerun the R1C guarded smoke command in this phase.
- Any future one-call smoke retry after healthz resolution still requires separate explicit approval.
- Continue keeping local config, local registry, fixture image, raw reports, prompts, request payloads, logs, model outputs, model weights, and credentials out of git.

### Ready for Phase 21-N-R1D

Yes, for healthz block resolution only. Phase 21-N-R1D does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N-R1B - One-fixture Local Model Smoke Retry Block Resolution

Date: 2026-06-18

Status: Implemented; prerequisite resolved locally

Goal: Resolve the ignored local config fixture-token mismatch so a future one-fixture local/private model smoke retry can be attempted safely.

Summary:

Phase 21-N-R1B resolved the Phase 21-N-R1 preflight blocker without running a model call. The ignored local config fixture-token bucket was changed locally from `other_token` to `smoke_001`.

The ignored local config, ignored local fixture registry, and ignored `smoke_001` fixture remain ignored, untracked, and unstaged. The local config contents, registry contents, model server URL, image contents, raw image path, EXIF/GPS/sensor data, prompts, request payloads, model output, server logs, and secrets were not printed.

This phase did not run a model call, healthz check, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, production user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Confirmed repo start state was clean and upstream comparison was `0 0`.
- Confirmed ignored local config was present, ignored, untracked, and unstaged.
- Confirmed sanitized before state: fixture token bucket `other_token`, serving stack bucket `transformers_fastapi`, model server bucket `loopback`, allow network calls bucket true, and `productionReady:false`.
- Confirmed `smoke_001` fixture file is present with extension bucket `jpg`, ignored, untracked, and unstaged.
- Confirmed ignored fixture registry is present, ignored, untracked, and unstaged.
- Confirmed `smoke_001` registry entry is present and approved.
- Updated only the ignored local config fixture token to `smoke_001`.
- Confirmed sanitized after state: fixture token is `smoke_001`; local config, registry, and fixture remain ignored, untracked, and unstaged.
- Added `docs/phase-21-n-r1b-local-config-fixture-token-resolution.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R1C: Approved One-fixture Local Model Smoke Retry After Config Fix.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r1b-local-config-fixture-token-resolution.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Local ignored files touched:

- `backend/config/open-weight-vlm.local.json` was touched locally only and remains ignored, untracked, and unstaged.
- `backend/config/open-weight-vlm.fixtures.local.json` was not changed in tracked git and remains ignored, untracked, and unstaged.
- `backend/tests/vlm-local-samples/smoke_001.jpg` was not opened, OCRed, uploaded, staged, or committed.

Checks:

- No model call, healthz check, Qwen inference, fixture inference, or serving benchmark was run.
- No raw local config contents, registry contents, model server URL, raw image path/content, EXIF/GPS/sensor data, prompts, request payloads, model output, server logs, or secrets were printed.
- `git diff --check` passed.
- Backend tests passed: `npm test` in `backend` reported 248/248 tests passing.
- Local config dry-run passed with sanitized output, `networkCallsMade:false`, and `productionReady:false`.
- Local smoke gate passed with `eligibleForRealModelSmoke:true`, `networkCallsMade:false`, and `productionReady:false`; this did not run healthz or a model call.
- Local model route approval gate passed with `approvalEligible:true`, `localModelRouteEnabled:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, and `productionReady:false`.
- Quantization serving benchmark plan, Qwen MoE target, image compression/upload, Auto-Trigger, Stateful WSS, and local CV policy gates passed with no runtime/model/benchmark execution.
- Secret scan, Photo Advisor copy regression, iOS direct provider/model scan, Camera cloud entry scan, backend/iOS payload unchanged scan, and artifact scan passed.
- Ignored local config, ignored fixture registry, and ignored `smoke_001` fixture remain ignored, untracked, and unstaged.

Known TODOs:

- Any future Phase 21-N-R1C one-call smoke retry requires separate explicit user approval.
- Continue keeping local config, local registry, fixture image, raw reports, prompts, request payloads, logs, model outputs, model weights, and credentials out of git.

### Ready for Phase 21-N-R1C

Yes, for a separately approved one-call retry only. Phase 21-N-R1B itself does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N-R1 - Approved One-fixture Local Model Smoke Retry

Date: 2026-06-18

Status: Preflight blocked before model call

Goal: Retry the previously blocked Phase 21-N one-fixture backend local/private model route smoke using exactly one approved ignored fixture token, `smoke_001`, only if all preflight gates pass.

Summary:

The user explicitly approved: "?????Phase 21-N-R1 ?è±°å????backend local/private model smoke retry". Phase 21-N-R1 stopped before healthz/model execution because the ignored local config fixture token was not `smoke_001`. No substitute fixture token was used.

This phase added a guarded retry CLI and npm script that require `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`. The guarded CLI was not used to make a model call because preflight blocked first.

This phase did not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, production user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Added `backend/scripts/run-open-weight-vlm-approved-one-fixture-local-model-smoke-retry.mjs`.
- Added `qa:open-weight-vlm:approved-one-fixture-local-model-smoke-retry`.
- Added static guard coverage for the retry CLI.
- Ran no-model preflight gates before any healthz/model execution.
- Confirmed ignored local config, ignored local fixture registry, and ignored `smoke_001` fixture are present, ignored, untracked, and unstaged.
- Confirmed R1 preflight blocker: ignored local config fixture token is not `smoke_001`.
- Did not run healthz or model call after the blocker was found.
- Added `docs/phase-21-n-r1-one-fixture-local-model-smoke-retry-report.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R1B: One-fixture Local Model Smoke Retry Block Resolution.

Changed files:

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/run-open-weight-vlm-approved-one-fixture-local-model-smoke-retry.mjs`
- `backend/tests/approved-one-fixture-local-model-smoke-retry-script.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r1-one-fixture-local-model-smoke-retry-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed before the R1 blocker report updates.
- Backend tests passed: `npm test` in `backend` reported 248/248 tests passing.
- No-model gates passed before the blocker: synthetic benchmark, benchmark gate, local config dry-run, default local sandbox smoke stub/no-network, local smoke gate, repeatability gate, failure taxonomy CLI, expanded fixture registry dry-run CLI, provider integration diagnostic CLI, serving benchmark preflight, gateway contract preflight, gateway adapter stub, gateway external contract echo mock-safe, gateway provider routing, gateway provider adapter no-model HTTP mock-safe, cross-platform deployment boundary, deployment config/env preflight, local model route approval, Qwen MoE live-advisor target, image compression/upload policy, Auto-Trigger policy, Stateful WSS protocol preflight, local CV camera aids plan, and quantization serving benchmark plan.
- Fixture routing contract echo recorded fail-closed because no local echo endpoint was available; this phase does not depend on that no-model echo path.
- Secret scan, Photo Advisor copy regression, filter reason coverage, CreativeIntent language coverage, Photo Advisor card language coverage, iOS direct provider/model scan, Camera cloud entry scan, backend/iOS payload unchanged scan, and artifact scan passed.
- Ignored local prerequisites remain ignored, untracked, and unstaged: local config, local fixture registry, and `smoke_001` fixture.

Known TODOs:

- Resolve the ignored local config fixture-token mismatch so the future retry can use exactly `smoke_001`.
- Do not commit fixture images, local config, fixture registry contents, raw reports, prompts, request payloads, logs, model outputs, model weights, or credentials.
- Any later one-call smoke retry still requires separate explicit approval.

### Ready for Phase 21-N-R1B

Yes, for block resolution only. Phase 21-N-R1B does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N-R0C - Operator supplies approved smoke_001 local fixture

Date: 2026-06-18

Status: Implemented; prerequisite satisfied locally

Goal: Allow/check operator supply of exactly one approved local-only `smoke_001` fixture image while keeping the model-call boundary closed.

Summary:

Phase 21-N-R0C rechecked the ignored local sample folder for operator-supplied `smoke_001` fixture material. The folder exists and remains ignored, untracked, and unstaged, and `smoke_001.*` is now present with extension bucket `jpg`. Because the fixture file exists, the ignored local fixture registry was updated locally only and `smoke_001` is now present/approved.

This phase did not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, production user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Confirmed the ignored local sample folder exists and remains ignored, untracked, and unstaged.
- Confirmed `smoke_001.*` local fixture file is now present; extension bucket is `jpg`.
- Confirmed ignored local fixture registry remains present, ignored, and unstaged.
- Confirmed sanitized registry facts: `smoke_001` entry present, `smoke_001` approved true, fixture mode bucket `approved_local_only`, fixture count bucket `more_than_twelve`.
- Updated the ignored local registry locally only because the fixture file is present.
- Updated `docs/phase-21-n-r0c-smoke001-operator-fixture-supply.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R1: Approved One-fixture Local Model Smoke Retry.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r0b-smoke001-fixture-preparation.md`
- `docs/phase-21-n-r0c-smoke001-operator-fixture-supply.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed.
- Backend tests passed: `npm test` in `backend` reported 247/247 tests passing.
- No-model gates passed: local config dry-run, local smoke gate, local model route approval gate, quantization serving benchmark plan gate, Qwen MoE live-advisor target gate, image compression/upload policy gate, Auto-Trigger policy gate, Stateful WSS protocol preflight gate, and local CV camera aids plan gate.
- Secret scan and artifact scan passed.
- Static boundary scans passed: iOS direct provider/model scan, Camera cloud entry scan against existing Camera/Models paths, and backend/iOS payload unchanged scan.
- Ignored local prerequisites remain ignored, untracked, and unstaged: local config, local fixture registry, and local sample folder.

Known TODOs:

- Do not commit fixture images, local config, fixture registry contents, raw reports, prompts, request payloads, logs, model outputs, model weights, or credentials.
- Any later one-call smoke retry still requires separate explicit approval.

### Ready for Phase 21-N-R1

Yes, for a separately approved one-fixture local/private model smoke retry. Phase 21-N-R0C itself does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N-R0B - Operator-provided smoke_001 Fixture Preparation

Date: 2026-06-18

Status: Implemented; fixture still missing

Goal: Prepare/check the missing ignored local-only `smoke_001` fixture prerequisite safely without running any model call.

Summary:

Phase 21-N-R0B rechecked the ignored local sample folder for operator-provided `smoke_001` fixture material. The folder exists and remains ignored, untracked, and unstaged, but `smoke_001.*` is still missing. Because no fixture file exists, the ignored local fixture registry was not edited and `smoke_001` remains not present/approved.

This phase did not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Confirmed the ignored local sample folder exists and remains ignored, untracked, and unstaged.
- Confirmed `smoke_001.*` local fixture file is still missing; extension bucket is `missing`.
- Confirmed ignored local fixture registry remains present, ignored, untracked, and unstaged.
- Confirmed sanitized registry facts: `smoke_001` entry absent, `smoke_001` approved false, fixture mode bucket `unknown`, fixture count bucket `twelve_or_less`.
- Did not edit the ignored local registry because the fixture file is missing.
- Added `docs/phase-21-n-r0b-smoke001-fixture-preparation.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R0C: Operator supplies approved smoke_001 local fixture.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-r0-smoke001-preflight-block-resolution.md`
- `docs/phase-21-n-r0b-smoke001-fixture-preparation.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed.
- Backend tests passed: `npm test` in `backend` reported 247/247 tests passing.
- No-model gates passed: local config dry-run, local smoke gate, local model route approval gate, quantization serving benchmark plan gate, Qwen MoE live-advisor target gate, image compression/upload policy gate, Auto-Trigger policy gate, Stateful WSS protocol preflight gate, and local CV camera aids plan gate.
- Secret scan and artifact scan passed.
- Static boundary scans passed: iOS direct provider/model scan, Camera cloud entry scan against existing Camera/Models paths, and backend/iOS payload unchanged scan.
- Ignored local prerequisites remain ignored, untracked, and unstaged: local config, local fixture registry, and local sample folder.

Known TODOs:

- Operator must supply exactly one approved local-only `smoke_001` fixture image in the ignored local sample folder.
- Do not commit fixture images, local config, fixture registry contents, raw reports, prompts, request payloads, logs, model outputs, model weights, or credentials.
- Any later one-call smoke retry still requires separate explicit approval.

### Ready for Phase 21-N-R0C

Yes, for operator-supplied local-only `smoke_001` fixture material. Phase 21-N-R0C does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N-R0 - One-fixture Local Model Smoke Preflight Block Resolution

Date: 2026-06-18

Status: Implemented; prerequisite remains blocked

Goal: Resolve or report the missing ignored `smoke_001` local fixture prerequisite so a future one-fixture local/private model smoke can be retried safely after separate explicit approval.

Summary:

Phase 21-N-R0 inspected ignored local fixture prerequisites without printing local config contents, fixture registry contents, raw image paths, prompts, request payloads, model outputs, model server URLs, server logs, EXIF/GPS/sensor data, or secrets. The ignored local `smoke_001.*` fixture file is missing, so the ignored local registry was not modified and the prerequisite remains blocked.

This phase did not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` route, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Confirmed ignored local config, fixture registry, and sample folder are present, ignored, untracked, and unstaged.
- Confirmed `backend/tests/vlm-local-samples/smoke_001.*` is missing; extension bucket is `missing`.
- Confirmed sanitized registry facts: registry present, `smoke_001` entry absent, `smoke_001` approved false, fixture mode bucket `unknown`, fixture count bucket `twelve_or_less`, registry ignored true, registry staged false.
- Did not edit the ignored local registry because the fixture file is missing.
- Added `docs/phase-21-n-r0-smoke001-preflight-block-resolution.md`.
- Updated roadmap sequencing current next phase to Phase 21-N-R0B: Operator-provided smoke_001 Fixture Preparation.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-one-fixture-local-model-smoke-report.md`
- `docs/phase-21-n-r0-smoke001-preflight-block-resolution.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed.
- Backend tests passed with 247/247 tests.
- Relevant no-model local checks passed: local config dry-run, default local sandbox smoke stub/no-network, local smoke gate, and expanded fixture registry dry-run.
- Policy gates passed: local model route approval, quantization serving benchmark plan, Qwen MoE live advisor target, image compression/upload, Auto-Trigger, Stateful WSS protocol preflight, and local CV camera aids plan.
- Secret scan passed.
- Artifact/raw-output scan passed with the intended R0 tracked report allowlisted.
- iOS direct provider/model scan passed.
- Focused Camera runtime cloud entry scan passed.
- Backend/iOS payload unchanged scan passed.
- Ignored local config, fixture registry, and sample folder remained ignored, untracked, and unstaged.

Known TODOs:

- Operator must place an approved local-only `smoke_001` fixture in the ignored local sample folder before a future registry approval or smoke retry can proceed.
- Do not commit local config, fixture registry contents, fixture images, raw reports, prompts, request payloads, logs, model outputs, model weights, or credentials.
- Any later one-call smoke retry still requires separate explicit user approval.

### Ready for Phase 21-N-R0B

Yes, for operator-provided local-only `smoke_001` fixture preparation. Phase 21-N-R0B does not approve a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, endpoint work, iOS runtime work, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-N - Approved One-fixture Backend Local Model Route Smoke

Date: 2026-06-18

Status: Preflight blocked before model call

Goal: Run one controlled backend local/private `local_model` route smoke through the existing backend gateway/local sandbox chain using exactly one approved ignored fixture, only if all preflight gates pass.

Summary:

The user explicitly approved: "?????Phase 21-N ?è±°å????backend local/private model smoke". The phase stopped before any healthz/model call because required preferred fixture token `smoke_001` was not present/approved in the ignored local fixture registry. No substitute fixture token was used.

This phase did not run a model call, retry, serving benchmark, vLLM/SGLang/Ollama call, model download, serving-stack switch, production `local_model` enablement, iOS integration, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, local CV runtime, image upload runtime, image compression runtime, iOS upload payload change, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, training/fine-tuning, validator weakening, safety/fallback weakening, or production rollout.

Completed work:

- Verified repo state before preflight: working tree clean and upstream sync `0 0`.
- Confirmed Phase 21-M is committed and pushed as `e24eb68 Phase 21-M: add quantization serving benchmark plan`.
- Confirmed ignored local config, ignored local fixture registry, and ignored local sample folder are present, ignored, untracked, and unstaged without printing their contents.
- Confirmed required fixture token `smoke_001` is not present/approved in the ignored local registry, so the model call was blocked before healthz/model execution.
- Added `docs/phase-21-n-one-fixture-local-model-smoke-report.md` with sanitized preflight-block result, zero-call summary, raw artifact policy confirmation, boundary confirmations, and next recommendation.
- Updated roadmap sequencing current next phase to Phase 21-N-R0: One-fixture Local Model Smoke Preflight Block Resolution.

Changed files:

- `README.md`
- `backend/README.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-local-operator-runbook.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/phase-21-n-one-fixture-local-model-smoke-report.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/quantization-serving-benchmark-plan.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed.
- Backend tests passed with 247/247 tests.
- One-fixture smoke summary was read from the sanitized report only; the model call was not rerun.
- Secret scan passed.
- Refined artifact/raw-output scan passed with the intended sanitized report allowlisted.
- iOS direct provider/model scan passed.
- Focused Camera runtime cloud entry scan passed.
- Backend/iOS payload unchanged scan passed.
- Ignored local config, ignored local fixture registry, and ignored local sample folder remained ignored, untracked, and unstaged.

Known TODOs:

- Resolve the ignored local `smoke_001` fixture prerequisite without committing local config, fixture registry contents, fixture images, raw reports, logs, model outputs, prompts, request payloads, model weights, or credentials.
- Do not substitute a different fixture token without explicit user approval.
- A future one-call smoke attempt still requires explicit approval and fresh preflight gates.

### Ready for Phase 21-N-R0

Yes, for local prerequisite resolution only. Phase 21-N-R0 does not approve a model call, retry, serving benchmark, vLLM/SGLang/Ollama call, model download, serving stack switch, iOS runtime work, endpoints, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-M - Quantization + Serving Benchmark Plan

Date: 2026-06-18

Status: Implemented

Goal: Define and gate the future quantization and serving benchmark plan before running any benchmark, downloading models, switching serving stacks, enabling `local_model`, or making iOS/production claims.

Summary:

Phase 21-M defines the future model, serving stack, quantization, fixture, metrics, latency/throughput, safety/fallback, and hardware/cost planning policy for later benchmark work. Phase 21-W-R1 later clarifies `Qwen3-VL-30B-A3B` as the future target candidate only for a separately approved model phase, keeps Qwen2.5-VL as the current correctness/reference baseline, and keeps all runtime benchmark/model work blocked.

This is a planning/gate/source-audit phase. It does not run serving benchmarks, real model smoke, Qwen inference, fixture inference, vLLM/SGLang/Ollama calls, model downloads, serving stack switches, `local_model` enablement, external workspace changes, iOS runtime dependencies, endpoints, uploads, compression runtime, local CV runtime, Auto-Trigger runtime, WSS runtime, auth/billing/quota runtime, or production rollout.

Completed work:

- Added `docs/quantization-serving-benchmark-plan.md` with executive summary, current implementation audit, benchmark purpose, model/serving/quantization matrices, future metrics, fixture scope, structured output/schema policy, latency/throughput, safety/fallback regression, cost/hardware planning, stop conditions, remaining blockers, gate expectations, and `productionReady:false`.
- Added `backend/src/qa/openWeightVlmQuantizationServingBenchmarkPlanGate.mjs` to validate benchmark-plan policy objects only.
- Added `backend/scripts/check-open-weight-vlm-quantization-serving-benchmark-plan-gate.mjs` and `npm run qa:open-weight-vlm:quantization-serving-benchmark-plan`.
- Extended backend tests for runtime blockers, serving-stack switch/model-download blockers, model/Qwen/fixture/benchmark execution blockers, missing vision/non-thinking/structured-output/fixture/metrics requirements, raw artifact policy blockers, real-user-photo blocker, endpoint/iOS dependency blockers, invalid model/serving/quantization candidates, redaction, and CLI output.
- Audited current backend/server docs and scripts: no active vLLM/SGLang/Ollama production runtime, no quantized model deployment, no committed model weights/config URLs/secrets, no production serving endpoint, and no iOS runtime dependency on serving stack choice were found; Transformers+FastAPI remains local/operator-only sandbox evidence.
- Updated roadmap sequencing current next phase to Phase 21-N: Approved One-fixture Backend Local Model Route Smoke, with explicit user approval required because it may run exactly one backend local/private model call.

Changed files:

- `README.md`
- `backend/README.md`
- `backend/package.json`
- `backend/scripts/check-open-weight-vlm-quantization-serving-benchmark-plan-gate.mjs`
- `backend/src/qa/openWeightVlmQuantizationServingBenchmarkPlanGate.mjs`
- `backend/tests/open-weight-vlm-benchmark.test.mjs`
- `docs/handoff/codex-transition-handoff.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/open-weight-vlm-serving-benchmark-preflight.md`
- `docs/phase-log.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/quantization-serving-benchmark-plan.md`
- `docs/qwen35b-a3b-moe-live-advisor-target-reevaluation.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Checks:

- `git diff --check` passed.
- Backend tests passed with 247/247 tests.
- Safe no-model backend QA passed for synthetic benchmark, benchmark gate, local config dry-run, default local sandbox smoke stub/no-network, local smoke gate, repeatability gate, failure taxonomy, expanded fixture registry dry-run, provider integration diagnostic, serving benchmark preflight, gateway contract preflight, gateway adapter stub, gateway external contract echo mock-safe, gateway provider routing, gateway provider adapter no-model HTTP mock-safe, cross-platform deployment boundary, deployment config/env preflight, local model route approval gate, local model route dry-run plan, Qwen MoE live-advisor target gate, image compression/upload policy gate, Auto-Trigger policy gate, Stateful WSS protocol preflight, local CV camera aids plan, and Quantization + Serving Benchmark Plan gate.
- Fixture routing contract echo recorded fail-closed with no local echo endpoint: `networkCallsMade:false`, `modelInferenceRun:false`, `productionReady:false`, and no runtime depends on it.
- Secret scan passed. iOS direct provider/model scan passed. Focused Camera runtime cloud entry scan passed. Backend/iOS payload unchanged scan passed. Artifact scan passed after removing ignored synthetic QA report output.
- Photo Advisor synthetic QA, provider QA gate, provider QA review, copy regression, filter reason coverage, CreativeIntent language coverage, and Photo Advisor card language coverage passed.

Known TODOs:

- Phase 21-N-R0 resolves the missing ignored `smoke_001` fixture prerequisite only; any later one-call smoke attempt still requires explicit user approval.
- Serving benchmark execution, model downloads, vLLM/SGLang/Ollama runs, serving-stack switches, `local_model` enablement, iOS runtime dependencies, endpoints, and production rollout remain blocked until later explicit approval.

### Ready for Phase 21-N

Yes, only if explicitly requested and explicitly approved as an Approved One-fixture Backend Local Model Route Smoke. Phase 21-M does not approve benchmark execution, model downloads, model switches, local model route enablement, Qwen inference, fixture inference, vLLM/SGLang/Ollama calls, iOS runtime work, endpoints, upload runtime, WSS runtime, Auto-Trigger runtime, local CV runtime, or production behavior.

---

## Phase 21-L - Local On-device CV Camera Aids Plan

Date: 2026-06-18
Status: Implemented

### Goal

Define and gate the future local on-device CV camera aids plan before implementing runtime camera aids.

### Summary

Phase 21-L defines the future local CV split for fast on-device camera aids: grid alignment hints, horizon/level guide, exposure warning, motion/stability buckets, optional bucketed future Auto-Trigger eligibility, and 60fps camera smoothness. It keeps cloud VLM reserved for higher-level composition, mood, retro intent, and optional action only after explicit consent and trigger/upload/WSS gates.

This is a planning/gate/source-audit phase. It does not add local CV runtime, grid alignment runtime, horizon/level runtime, exposure warning runtime, motion/stability runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, image upload, image compression runtime changes, iOS payload changes, endpoints, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

### Completed

- Added `docs/local-on-device-cv-camera-aids-plan.md` with executive summary, current implementation audit, local CV purpose, grid alignment, horizon/level, exposure warning, motion/stability bucket, 60fps smoothness, Auto-Trigger relationship, cloud VLM boundary, privacy/data-retention, iOS/backend boundaries, future phases, stop conditions, gate expectations, and `productionReady:false`.
- Added `backend/src/qa/openWeightVlmLocalCvCameraAidsPlanGate.mjs` to validate local CV camera aids plan policy objects only.
- Added `backend/scripts/check-open-weight-vlm-local-cv-camera-aids-plan-gate.mjs` and `npm run qa:open-weight-vlm:local-cv-camera-aids-plan`.
- Extended backend tests for local CV runtime blockers, grid/horizon/exposure/motion runtime blockers, Camera cloud/upload blockers, production/execution flags, local-only/no-backend/no-upload requirements, raw frame/sensor/GPS/EXIF persistence blockers, 60fps/Auto-Trigger/cloud VLM relationship blockers, provider fields in iOS, redaction, and CLI output.
- Audited current source: a pre-existing visual grid overlay, local capture context/motion/level/exposure buckets, local/mock guidance building blocks, and mock/debug cloud scaffolds were found; no new local CV runtime, Auto-Trigger runtime, Camera live cloud AI runtime, WSS runtime, upload runtime, or model path is approved by this phase.
- Updated roadmap sequencing current next phase to Phase 21-M: Quantization + Serving Benchmark Plan.

### Safety Notes

- The new local CV camera aids plan CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- Future local CV must remain local-only, optional, fail-soft, and must not upload anything, call backend, call model, persist raw frames, persist raw sensor streams, persist GPS, persist raw EXIF, or export raw capture context without a later explicit bucketed-schema approval.
- No local CV runtime, grid/horizon/exposure/motion runtime, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, upload runtime, compression runtime change, iOS payload change, app-facing endpoint, production endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, external workspace change, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Phase 21-M

Yes, for an explicitly requested planning/gate-only Quantization + Serving Benchmark Plan. Phase 21-L does not approve local CV runtime, iOS runtime, serving benchmark execution, model calls, Qwen inference, vLLM/SGLang/Ollama calls, endpoints, upload runtime, WSS runtime, Auto-Trigger runtime, or production behavior.

---

## Phase 21-K - Stateful WSS Live Advisor Protocol Preflight

Date: 2026-06-18
Status: Implemented

### Goal

Define and gate the future Stateful WSS Live Advisor session protocol before any WebSocket runtime implementation.

### Summary

Phase 21-K defines the future WSS protocol as a backend-mediated session channel for bucketed session state, consent state, enabled/off state, stillness eligibility, throttle state, server busy/backoff, short structured advice, and safe fallback/error state only.

This is a planning/gate/schema-policy/source-audit phase. It does not add WSS runtime, WebSocket server runtime, iOS WebSocket client runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, upload runtime, compression runtime changes, iOS payload changes, endpoints, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

### Completed

- Added `docs/stateful-wss-live-advisor-protocol-preflight.md` with executive summary, current implementation audit, future WSS purpose, session lifecycle, client/backend message policy, server busy/backoff, throttle/rate limit, Auto-Trigger, 1 FPS, compression/upload, consent/no-silent-upload, privacy/logging, iOS/backend boundaries, stop conditions, and `productionReady:false`.
- Added `backend/src/qa/openWeightVlmStatefulWssLiveAdvisorProtocolPreflight.mjs` to validate protocol policy objects only.
- Added `backend/scripts/check-open-weight-vlm-stateful-wss-live-advisor-protocol-preflight.mjs` and `npm run qa:open-weight-vlm:stateful-wss-live-advisor-protocol`.
- Extended backend tests for WSS runtime blockers, WebSocket server/client runtime blockers, backend mediation, raw video streaming, max FPS, Auto-Trigger/compression/consent dependencies, disabled/off state, backoff/retry, provider fields in iOS, raw payload/prompt/model output, chain-of-thought, debug leakage, execution flags, redaction, and CLI output.
- Audited current source: no WSS/WebSocket runtime, no iOS WebSocket client, no backend WebSocket server, no live advisor session state, and no raw video streaming path were found; existing Camera snapshot/mock files remain mock-only/pre-existing.
- Updated roadmap sequencing current next phase to Phase 21-L: Local On-device CV Camera Aids Plan.

### Safety Notes

- The new protocol preflight CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- WSS must not carry raw camera video, 30fps frames, raw original image, base64 image unless later approved, raw file path, GPS, raw EXIF, raw sensor stream, raw prompt, raw model output, provider/model URL, API key, provider/model selection from iOS, raw backend request payload, debug/provider leakage, or chain-of-thought.
- No WSS runtime, WebSocket server runtime, iOS WebSocket client runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, upload runtime, compression runtime change, iOS payload change, app-facing endpoint, production endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, external workspace change, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Phase 21-L

Yes, for an explicitly requested planning/gate-only Local On-device CV Camera Aids Plan. Phase 21-K does not approve WSS runtime, WebSocket server/client runtime, Auto-Trigger runtime, upload runtime, iOS runtime, endpoints, model calls, serving benchmarks, or production behavior.

## Phase 21-J - Auto-Trigger + 1 FPS Live Advisor Policy Gate

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-J defines and gates the future Auto-Trigger + 1 FPS Live Advisor policy before any Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, upload runtime, endpoint, model call, or production behavior.

### Completed

- Added `docs/auto-trigger-1fps-live-advisor-policy-gate.md`.
- Added `backend/src/qa/openWeightVlmAutoTriggerLiveAdvisorPolicyGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-auto-trigger-live-advisor-policy-gate.mjs`.
- Added `npm run qa:open-weight-vlm:auto-trigger-live-advisor-policy`.
- Audited current iOS/backend source: local CoreMotion/capture-context motion and level buckets exist; existing Camera snapshot guidance is mock-only/pre-existing; no Auto-Trigger runtime, live cloud Camera entry, WSS runtime, stillness `>1s` upload trigger, 1 FPS cloud-analysis loop, or iOS live frame upload runtime was added.
- Defined future Auto-Trigger policy: explicit Live Advisor opt-in/consent, local device/viewfinder stability, stable for greater than 1 second, fail-closed on uncertain state, and disabled/off state blocks capture/upload/cloud calls.
- Defined `<=1s` rule: no frame capture, no upload, no backend call, no model call, and no retry that creates extra uploads.
- Defined 1 FPS policy: cloud VLM analysis is capped at max 1 FPS, must not treat the preview as 30fps video, must not stream raw camera video, and must follow Phase 21-I compressed preview payload policy for every eligible frame.
- Defined WSS relationship, throttle/backoff, server busy, local on-device CV split, backend validation, iOS boundary, and stop-condition policies.
- Extended backend tests for runtime blockers, stillness/FPS gaps, consent/off-state/compression/backend mediation gaps, raw video/WSS/retry/backoff/iOS boundary drift, execution flag blockers, redaction, and CLI output.
- Updated roadmap sequencing current next phase to Phase 21-K: Stateful WSS Live Advisor Protocol Preflight.
- Updated README, backend README, iOS README, Qwen MoE target doc, image compression/upload policy doc, missing/deferred register, handoff, manual smoke, and phase log docs.

### Verification

- The new Auto-Trigger Live Advisor policy gate CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- No Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, upload runtime, compression runtime change, iOS payload change, app-facing endpoint, production endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, external workspace change, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Phase 21-K

Yes, for an explicitly requested docs/gate/schema-only Stateful WSS Live Advisor Protocol Preflight. Phase 21-J does not approve WSS runtime, Auto-Trigger runtime, upload runtime, iOS runtime, endpoints, model calls, serving benchmarks, or production behavior.

---

## Phase 21-I - Image Compression + Upload Payload Policy Gate

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-I defines and gates the future image compression/upload payload policy before any new iOS/backend upload runtime, compression runtime, Live Advisor runtime, Auto-Trigger runtime, WSS runtime, endpoint, model call, or production behavior.

### Completed

- Added `docs/image-compression-upload-payload-policy-gate.md`.
- Added `backend/src/qa/openWeightVlmImageCompressionUploadPolicyGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-image-compression-upload-policy-gate.mjs`.
- Added `npm run qa:open-weight-vlm:image-compression-upload-policy`.
- Audited current iOS/backend source: DEBUG post-capture compression/upload scaffold exists; default Photo Advisor remains mock/local; current cloud request model does not include capture context; base64 exists only in the existing debug/post-capture JSON payload shape; existing Camera snapshot guidance remains mock-only and unchanged.
- Defined future compression policy: compressed JPEG preview frame before any cloud upload, planning target around `1024px` long edge and `150KB-200KB`, exact values to be tested later, metadata stripping required, no original full-resolution upload by default, no GPS/raw EXIF/raw sensor/raw capture context, and fail-closed behavior.
- Defined future upload payload policy: backend-mediated only, app-facing endpoint still blocked, compressed preview bytes or upload file field preferred, base64 blocked unless explicitly approved later, consent token/state required, and provider/model fields, model URL, API key, raw prompt, raw path, GPS, EXIF, sensor, and capture context blocked.
- Defined Auto-Trigger relationship: stillness greater than 1 second may make one compressed preview eligible; stability less than or equal to 1 second means no capture and no upload; max cloud-analysis cadence remains 1 FPS; no silent upload.
- Extended backend tests for runtime blockers, production/execution blockers, unsafe payload fields, missing metadata/consent/retention/deletion/Auto-Trigger/1 FPS dependencies, endpoint boundary drift, redaction, and CLI output.
- Updated roadmap sequencing current next phase to Phase 21-J: Auto-Trigger + 1 FPS Live Advisor Policy Gate.
- Updated README, backend README, iOS README, Qwen MoE target doc, missing/deferred register, handoff, manual smoke, and phase log docs.

### Verification

- The new image compression/upload policy gate CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- No upload runtime, compression runtime change, iOS payload change, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, app-facing endpoint, production endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, external workspace change, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Phase 21-J

Yes, for an explicitly requested docs/gate-only Auto-Trigger + 1 FPS Live Advisor Policy Gate. Phase 21-I does not approve upload runtime, compression runtime changes, iOS runtime, endpoints, model calls, WSS runtime, serving benchmarks, or production behavior.

---

## Phase 21-H2 - Qwen VLM + Live Advisor Target Re-evaluation Gate

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-H2 re-evaluates the future model, serving stack, Live Advisor, Auto-Trigger, WSS, compression, local CV, quantization, and prompt/output direction before any runtime implementation.

### Completed

- Added `docs/qwen35b-a3b-moe-live-advisor-target-reevaluation.md`.
- Added `backend/src/qa/openWeightVlmQwenMoELiveAdvisorTargetGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-qwen-moe-live-advisor-target-gate.mjs`.
- Added `npm run qa:open-weight-vlm:qwen-moe-live-advisor-target`.
- Defined model policy later clarified by Phase 21-W-R1: `Qwen3-VL-30B-A3B` is the future target candidate only after vision-capable / VLM-compatible and multimodal serving path verification in a separately approved phase; Qwen2.5-VL remains current reference baseline; smaller Qwen 9B-class vision-capable model is latency/cost fallback only; text-only Qwen is blocked for image analysis.
- Defined serving policy: Transformers + FastAPI remains correctness/reference baseline, vLLM is the primary future serving benchmark candidate, SGLang is the structured-output/performance challenger, and Ollama/LM Studio remain manual/local only.
- Defined Auto-Trigger policy: stillness must be greater than 1 second, stability less than or equal to 1 second means no capture/no upload, max cloud-analysis cadence is 1 FPS, opt-in/consent/off/throttle/fail-closed behavior are required, and runtime remains blocked.
- Defined WSS, compression/upload, local on-device CV, quantization, prompt/token, consent, retention, deletion, and production boundary policies.
- Extended backend tests for preferred/fallback/reference model classes, unverified vision blocking, text-only model blocking, non-thinking/structured output/quantization/benchmark blockers, runtime upload/WSS/iOS route blockers, execution flag blockers, unsafe language/leakage blockers, sanitized output, and CLI output.
- Updated roadmap sequencing current next phase to Phase 21-I: Image Compression + Upload Payload Policy Gate.
- Updated README, backend README, iOS README, missing/deferred register, handoff, manual smoke, and phase log docs.

### Verification

- The new target gate CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- No model switch, local model route enablement, runtime implementation, iOS integration, Camera cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, image upload/compression runtime, endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, external workspace change, or production readiness change was added.
- `productionReady:false` remains locked.

### Ready for Phase 21-I

Yes, for an explicitly requested docs/gate-only Image Compression + Upload Payload Policy Gate. Phase 21-H2 does not approve upload runtime, iOS runtime, endpoints, model calls, WSS runtime, serving benchmarks, or production behavior.

---

## Phase 21-H - Controlled Backend Local Model Route Dry-run Plan

Status: Implemented
Date: 2026-06-17

### Summary

Phase 21-H defines the controlled dry-run plan for a future backend `local_model` provider route test. It validates the future plan shape only and does not enable `local_model`, call Qwen, run model inference, run fixture inference, or run a serving benchmark.

### Completed

- Added `docs/backend-gateway-local-model-route-dry-run-plan.md`.
- Added `backend/src/qa/openWeightVlmLocalModelRouteDryRunPlan.mjs`.
- Added `backend/scripts/check-open-weight-vlm-local-model-route-dry-run-plan.mjs`.
- Added `npm run qa:open-weight-vlm:local-model-route-dry-run-plan`.
- Defined the first future explicitly approved route test as backend-internal, local/private, one declared synthetic local fixture token, one call only, no retries, no real user photo, no iOS integration, no app-facing endpoint, no production endpoint, structured candidate JSON only, backend validator as source of truth, mandatory fallback/safety chain, raw persistence flags false, and `productionReady:false`.
- Defined pre-run requirements for clean repo/upstream sync, all no-model gates, ignored local config/registry/fixtures, approved fixture token, safe healthz, `publicExposure:no`, `rawLoggingDisabled:true`, local/private endpoint only, no staged local artifacts, no iOS payload/source diff, no Camera cloud entry, no app-facing endpoint, and no production endpoint.
- Defined stop conditions for dirty repo/upstream drift, staged local artifacts, unsafe healthz, public/cloud/ngrok endpoint, raw logging/persistence, `productionReady:true`, iOS provider/model paths, Camera cloud AI entry, payload drift, endpoints, real upload, missing consent/retention/deletion policy, validator/fallback bypass, and raw prompt/model output/request/image path/base64 logging risk.
- Extended backend tests for valid one-call planning, multi-fixture block, retry block, missing fixture scope, real user-photo scope, iOS integration, app-facing endpoint, production endpoint, production readiness, unsafe healthz, public/cloud/ngrok endpoint, raw logging/persistence, staged local artifact policy, validator/fallback bypass, planning-phase execution flags, benchmark block, and sanitized output.
- Updated backend, iOS, gateway, deployment, provider routing, contract, serving preflight, sandbox, expansion gate, operator runbook, handoff, manual smoke, and README docs.

### Verification

- The new dry-run plan CLI is no-network, no-model, no-Qwen, no-fixture-inference, no-benchmark, and prints sanitized bucket summaries only.
- The gate keeps `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- No external server workspace files were modified.
- No real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama execution, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, auth/billing/quota runtime, committed secrets, raw artifacts, training/fine-tuning, local model route enablement, or production rollout was added.

### Ready for Phase 21-I

Yes, for another explicitly requested backend-internal no-model planning/check phase only. A safe candidate is local model route fallback/failure taxonomy rehearsal or one-call approval wording review. Phase 21-H does not approve local model route execution, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, auth/billing/quota runtime, serving benchmark execution, Qwen inference, fixture inference, model-stack switching, training/fine-tuning, or any change to `productionReady:false`.

---

## Phase 20-J - Retry Controlled Expanded Local VLM Smoke After Routing Fix

Status: Implemented
Date: 2026-06-16

### Completed

- Verified repo clean and upstream comparison `0 0`.
- Ran all pre-smoke gates before real calls.
- Confirmed Windows healthz safe: `ok:true`, `modelLoaded:true`, `modelFamily:qwen2.5-vl`, `rawLoggingDisabled:true`, `publicExposure:no`.
- Ran exactly eight local/private Qwen-backed fixture calls: `smoke_001` through `smoke_008`.
- Used one call per fixture, no retries, no extra fixtures, fixture IDs only.
- Ran repeatability and failure/latency taxonomy gates against the sanitized aggregate.

### Sanitized Result

- Per-fixture accepted: `smoke_001`, `smoke_002`, `smoke_003`, `smoke_004`, `smoke_005`, `smoke_006`, `smoke_007`, `smoke_008`.
- Aggregate: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`.
- Validation/fallback: `validationCodeCounts:null x8`, `fallbackCategoryCounts:null x8`, no schema error buckets, no schema field buckets.
- Latency: `gt_15s x3`, `5s_to_15s x5`.
- Safety: `networkCallsMade:true`, `productionReady:false`, raw prompt/model response/image/image path/request payload persisted flags false.
- Repeatability gate: passed with `pass_with_latency_note`.
- Failure/latency taxonomy: passed with `latency_note`.

### Ready for Phase 20-K

Yes, for review/planning only. Phase 20-J does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, serving-stack benchmarking, training/fine-tuning, or larger fixture expansion without explicit future approval.

---

## Phase 20-I - No-model Fixture Routing Contract Echo

Status: Implemented
Date: 2026-06-16

### Completed

- Added a no-model `/local/vlm/fixture-routing-contract-echo` route in the external Windows server workspace.
- Updated the external server to merge the legacy local server registry with the backend expanded fixture registry via ignored local paths, without printing raw paths.
- Updated the external ignored server registry metadata for legacy token buckets so the stricter privacy-reviewed routeability check can pass.
- Added `backend/src/qa/openWeightVlmFixtureRoutingContractEcho.mjs`.
- Added `backend/scripts/check-open-weight-vlm-fixture-routing-contract-echo.mjs`.
- Added `npm run qa:open-weight-vlm:fixture-routing-echo`.
- Added backend tests for eight-token pass, missing token block, model-inference block, raw-persistence block, `productionReady:true` block, unsafe public exposure block, and sanitized output.

### Sanitized Result

- Healthz: `ok:true`, `modelLoaded:false`, `modelFamily:qwen2.5-vl`, `rawLoggingDisabled:true`, `publicExposure:no`, contract echo available.
- Per-token routing: `smoke_001` through `smoke_008` all `routeable:true`, `available:true`, `approvedLocalFixture:true`, `metadataStripped:true`, `privacyReviewed:true`.
- Aggregate: `totalFixtureTokens:8`, `routeableCount:8`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, `productionReady:false`.

### Ready for Phase 20-J

Yes, for a future explicitly approved controlled expanded real smoke retry only. Phase 20-I itself did not run Qwen or model smoke. Production rollout remains blocked.

---

## Phase 20-H - Expanded Fixture Provider-Integration Diagnosis

Status: Implemented
Date: 2026-06-16

### Completed

- Added `backend/src/qa/openWeightVlmExpandedFixtureProviderIntegrationDiagnostic.mjs`.
- Added `backend/scripts/check-open-weight-vlm-expanded-fixture-provider-integration.mjs`.
- Added `npm run qa:open-weight-vlm:expanded-fixture-provider-diagnostic`.
- Added backend tests for provider-integration fast blocks, schema-diagnostic separation, fixture availability gaps, routing/config buckets, production flag blockers, raw persistence blockers, and sanitized CLI output.
- Inspected the external Windows server implementation shape without printing raw paths or logs.

### Sanitized Diagnosis

- Phase 20-G remains recorded as eight approved fixture calls, eight `blocked_for_provider_integration` fallbacks, `lt_1s` latency, no schema diagnostic buckets, raw persistence flags false, and `productionReady:false`.
- The diagnostic classifies the aggregate as `likely_pre_inference_block`, `likely_server_fixture_unavailable`, `likely_healthz_fixture_availability_gap`, `unlikely_schema_validator_issue`, `unsafe_to_retry_real_smoke`, `eligible_for_contract_echo_fixture_routing_check`, and `not_production_ready`.
- Sanitized server-shape inspection found only the original fixture token bucket mentioned in the external server workspace; expanded fixture token buckets were not advertised there.
- Working hypothesis: backend expanded registry and server fixture availability / routing are out of sync before model inference.

### Ready for Phase 20-I

Yes, for a no-model fixture-routing / contract-echo diagnostic only. Another real expanded model smoke remains blocked until fixture token routing and server availability pass without Qwen inference. Production rollout remains blocked.

---

## Phase 20-F - Expanded Fixture Registry Schema and Dry-run Gate

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-expanded-fixture-registry-plan.md`.
- Added `backend/src/qa/openWeightVlmExpandedFixtureRegistry.mjs`.
- Added `backend/scripts/check-open-weight-vlm-expanded-fixture-registry.mjs`.
- Added `npm run qa:open-weight-vlm:expanded-fixtures`.
- Added backend tests for:
  - valid expanded registry dry-run review
  - missing metadata stripping
  - missing privacy review
  - face presence
  - sensitive content
  - private identifier
  - unknown category
  - missing required category coverage
  - sanitized no-network CLI output
- Defined 12 target fixture categories and an 8-category core coverage set for future controlled 6-8 fixture smoke planning.
- Defined sanitized metadata fields, approval rules, privacy/safety exclusions, coverage matrix, dry-run output, and future controlled-smoke rules.

### Safety Notes

- Backend-only and Windows-primary.
- No real model smoke.
- No fixture images committed.
- No local config or local registry committed.
- No raw paths, prompts, model output, request payload, raw reports, logs, weights, or credentials committed.
- No vLLM/SGLang benchmark.
- No iOS integration, app-facing endpoint, production endpoint, Camera cloud AI entry, backend/iOS payload change, capture-context upload, training/fine-tuning, or production rollout.
- Existing validator, smoke gates, repeatability gate, failure taxonomy, fixture approval checks, and raw logging restrictions remain intact.
- `productionReady:false` and `networkCallsMade:false` are required for the dry-run gate.

### Ready for Phase 20-G

Conditionally ready for planning a controlled 6-8 fixture local smoke after Phase 20-F is reviewed, committed, and pushed, and only if the ignored fixture registry/images are safely prepared, all existing gates pass, Windows healthz is safe, raw logging remains disabled, and the user explicitly approves real local/private model calls. Production rollout remains blocked.

---

## Phase 20-G - Controlled Expanded Local VLM Smoke

Status: Blocked
Date: 2026-06-16

### Scope

Phase 20-G attempted the approved Windows-primary local/private Qwen-backed expanded smoke with exactly eight approved fixture tokens. The run used fixture IDs only, one call per fixture, no retries, no extra fixtures, and sanitized reporting only.

### Sanitized Result

- `fixtureCount:8`
- `acceptedCount:0`
- `rejectedCount:8`
- `acceptanceRate:0%`
- `validationCodeCounts:null x8`
- `fallbackCategoryCounts:blocked_for_provider_integration x8`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:lt_1s x8`
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags: false for prompt, model response, image, image path, and request payload

Per-fixture categories were `bright_daylight_clean`, `low_light_grain`, `motion_blur_intentional`, `high_contrast_shadow`, `faded_color_retro`, `imported_limited_context`, `severe_blur_reject`, and `black_or_near_black_unreadable`. All returned the same provider-integration fallback bucket before schema validation; no schema diagnostics were produced.

### Gate Results

- Repeatability gate: blocked with `repeatability_baseline_not_met` and `provider_integration_fallback_detected`.
- Failure/latency taxonomy: blocked with `provider_integration_fallback_detected`, `repeatability_drift_detected`, and `latency_timeout_or_pre_inference_block`.
- Latency category: `latency_blocker`.

### Safety Notes

- Real smoke ran exactly eight calls and stopped; no retries were used.
- No raw prompt, raw model output, image path, base64, request payload, local config contents, fixture registry contents, server logs, credentials, or raw reports are committed.
- Ignored local config, fixture registry, and fixture images remain ignored.
- The strict backend validator, local smoke gates, fixture approval checks, raw logging restrictions, and `productionReady:false` remain intact.
- No iOS source, project, localization, backend payload, iOS upload payload, capture-context upload, app-facing endpoint, production endpoint, training/fine-tuning, or production rollout was added.

### Ready for Phase 20-H

No. Phase 20-G needs a sanitized provider-integration diagnosis of local/private Windows server fixture availability and expanded fixture request handling before any future expanded smoke attempt.

---

## Phase 20-E-E - Local VLM Sandbox Review Summary and Phase 20-F Entry Criteria

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-local-sandbox-review-summary.md`.
- Summarized Phase 20-D2J, 20-E-A, 20-E-B1, 20-E-B2, 20-E-C, and 20-E-D.
- Documented what the local/self-hosted VLM sandbox proved:
  - backend can call local/private Windows Qwen2.5-VL FastAPI through the sandbox path
  - deterministic mapper can produce candidate JSON accepted by the backend validator
  - 3 approved ignored fixtures passed once and in a repeat smoke
  - failure/latency taxonomy exists for safe interpretation
  - raw persistence flags remained false
  - Windows-primary backend workflow is viable
- Documented what remains unproven:
  - production readiness
  - iOS integration
  - real user-photo upload and consent UI
  - app-facing/production endpoints
  - quota/billing/entitlement
  - deletion/retention policy implementation
  - App Store privacy disclosure update
  - large fixture set
  - model comparison, vLLM/SGLang benchmark, throughput/concurrency tests
  - multilingual real-image evaluation beyond existing copy gates
  - fine-tuning and on-device model work
- Documented gate inventory, safety/privacy boundaries, Windows-primary workflow, MacBook/Xcode role, known limitations, and Phase 20-F entry criteria.
- Recommended Phase 20-F Option A: expanded fixture set planning plus fixture registry schema.

### Safety Notes

- Review/summary/planning gate only.
- No real model smoke.
- No fixture expansion.
- No vLLM/SGLang benchmark.
- No iOS source/project/localization changes.
- No app-facing endpoint, production endpoint, Camera cloud AI entry, backend/iOS payload change, capture-context upload, training/fine-tuning, or production rollout.
- No local config, fixture registry, fixture images, raw model outputs, raw reports, server logs, model weights, or credentials committed.
- Validator, smoke gates, fixture approval checks, raw logging restrictions, and `productionReady:false` remain intact.

### Ready for Phase 20-F

Planning-ready only after Phase 20-E-E is reviewed, committed, and pushed. Recommended Phase 20-F scope is expanded fixture set planning plus fixture registry schema. Production rollout remains blocked.

---

## Phase 20-E-D - Local VLM Smoke Failure and Latency Taxonomy Review

Status: Implemented
Date: 2026-06-16

### Completed

- Added a backend-only failure and latency taxonomy for sanitized local VLM smoke aggregates.
- Added a CLI helper:
  - `node scripts/check-open-weight-vlm-local-smoke-failure-taxonomy.mjs --sample=clean`
  - `npm run qa:open-weight-vlm:local-failure-taxonomy`
- Added backend tests for clean pass, accepted latency note, schema regression, provider-integration fallback, raw persistence, model/server unavailable, fixture readiness, repeatability drift, latency regression/blocker, `productionReady:true`, unknown aggregate state, and sanitized CLI output.
- Kept the taxonomy input limited to sanitized counts, buckets, booleans, optional model/server availability buckets, and optional fixture readiness buckets.

### Taxonomy

- Pass / review categories:
  - `pass_clean_local_smoke`
  - `pass_with_latency_note`
  - `pass_with_minor_review_note`
  - `not_production_ready`
- Block categories:
  - `blocked_for_schema_regression`
  - `blocked_for_provider_integration`
  - `blocked_for_raw_persistence`
  - `blocked_for_fixture_readiness`
  - `blocked_for_unapproved_fixture`
  - `blocked_for_model_server_unavailable`
  - `blocked_for_network_not_made_when_required`
  - `blocked_for_unexpected_network_call`
  - `blocked_for_repeatability_drift`
  - `blocked_for_latency_regression`
  - `blocked_for_production_flag`
  - `blocked_for_unknown_smoke_state`
- Latency categories:
  - `latency_ok`
  - `latency_note`
  - `latency_regression`
  - `latency_blocker`

### Real Model Smoke

- Skipped for Phase 20-E-D.
- No larger fixture expansion was run.
- No raw prompt, raw model output, raw image/base64/path, request payload, local config contents, fixture registry contents, fixture images, credentials, or server logs were printed or committed.

### Safety Notes

- Backend-only / Windows-primary local smoke review work.
- No iOS source/project/localization changes.
- No app-facing endpoint, production endpoint, Camera cloud AI entry, backend/iOS payload change, capture-context upload, training/fine-tuning, or production rollout.
- Validator, local smoke gates, fixture approval checks, raw logging restrictions, and `productionReady:false` remain intact.

### Ready for Phase 20-E-E / 20-F

Planning-ready only after Phase 20-E-D is reviewed, committed, and pushed. Production rollout remains blocked.

---

## Phase 20-E-C - Local VLM Smoke Repeatability Gate

Status: Implemented
Date: 2026-06-16

### Completed

- Added a backend-only repeatability/regression gate for sanitized local VLM smoke expansion aggregates.
- Added a CLI helper:
  - `node scripts/check-open-weight-vlm-local-smoke-repeatability-gate.mjs --baseline`
  - `npm run qa:open-weight-vlm:local-repeatability-gate`
- Added backend tests for:
  - B2 aggregate pass case
  - schema diagnostic rejection
  - provider-integration fallback rejection
  - raw prompt/model-response persistence rejection
  - `productionReady:true` rejection
  - accepted results with `gt_15s` latency producing a latency note
- Confirmed the B2 sanitized baseline is recorded accurately:
  - 3 fixtures
  - 3 accepted
  - 0 rejected
  - no schema diagnostic buckets
  - no fallback categories
  - `productionReady:false`
  - raw persistence flags false
  - no iOS/backend payload drift

### Gate Behavior

- Pass categories:
  - `pass_for_local_repeatability_review`
  - `pass_with_latency_note`
- Block categories:
  - `blocked_for_schema_regression`
  - `blocked_for_provider_integration`
  - `blocked_for_raw_persistence`
  - `blocked_for_unapproved_fixture`
  - `blocked_for_production_flag`
  - `not_production_ready`
- The gate reviews sanitized aggregate metrics only and never requires raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, or server logs.
- The gate always reports `productionReady:false`.

### Repeat Smoke

- Optional controlled repeat smoke ran after backend tests, synthetic benchmark, benchmark gate, local config dry-run, default local smoke, local smoke gate, repeatability baseline gate, and sanitized healthz passed.
- Exactly one repeat pass ran per approved fixture:
  - `smoke_001`: accepted, `latencyBucket:5s_to_15s`
  - `smoke_002`: accepted, `latencyBucket:5s_to_15s`
  - `smoke_003`: accepted, `latencyBucket:5s_to_15s`
- Repeat aggregate:
  - `fixtureCount:3`
  - `acceptedCount:3`
  - `rejectedCount:0`
  - `acceptanceRate:100%`
  - `validationCodeCounts:null x3`
  - `fallbackCategoryCounts:null x3`
  - `schemaErrorBucketCounts:none`
  - `schemaFieldBucketCounts:none`
  - `latencyBucketCounts:5s_to_15s x3`
  - `networkCallsMade:true`
  - `productionReady:false`
- The repeat aggregate passed the new gate as `pass_for_local_repeatability_review` with no hard blockers.

### Safety Notes

- No backend validator weakening.
- No local smoke gate weakening.
- No approved fixture check weakening.
- No raw prompt, raw model output, image/base64/path, request payload, local config, fixture registry, fixture image, generated report, credential, token, or secret was committed.
- No iOS source/project/localization files changed.
- No app-facing endpoint or production endpoint added.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Ready for Phase 20-E-D

Planning-ready only after review, commit, and push. Phase 20-E-D is not production rollout and must keep the same backend-only, local/private, sanitized-reporting boundaries unless explicitly changed.

---

## Phase 20-E-B2 - Completed 3-Fixture Local VLM Smoke

Status: Implemented
Date: 2026-06-16

### Completed

- Confirmed Phase 20-E-B1 Windows file URL/path handling commit was upstream-synced before the B2 investigation.
- Diagnosed the `smoke_002` / `smoke_003` block as external Windows server workspace fixture availability, not a repo validator, backend request-contract, or iOS issue.
- Updated only the external Windows server workspace local fixture availability for the two missing approved fixture tokens.
- Reran the 3-fixture Qwen-backed local smoke exactly once per fixture:
  - `smoke_001`: accepted, `latencyBucket:gt_15s`
  - `smoke_002`: accepted, `latencyBucket:5s_to_15s`
  - `smoke_003`: accepted, `latencyBucket:5s_to_15s`

### Sanitized Aggregate

- `fixtureCount:3`
- `acceptedCount:3`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x3`
- `fallbackCategoryCounts:null x3`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:gt_15s x1, 5s_to_15s x2`
- `networkCallsMade:true`
- `productionReady:false`

### Verification

- Backend tests passed.
- Synthetic benchmark passed.
- Synthetic benchmark gate passed.
- Local config dry-run passed.
- Default local sandbox smoke passed in stub/no-network mode.
- Local smoke gate passed.
- `git diff --check` passed.
- Secret, iOS direct provider/model, Camera cloud entry, backend/iOS payload, artifact, Photo Advisor copy, filter reason, CreativeIntent language, and Photo Advisor card language coverage scans did not identify a new boundary violation.

### Safety Notes

- No backend validator weakening.
- No local smoke gate weakening.
- No approved fixture check weakening.
- No raw prompt, raw model output, image/base64/path, request payload, local config, fixture registry, fixture image, generated report, credential, token, or secret was committed.
- No iOS source/project/localization files changed.
- No app-facing endpoint or production endpoint added.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Ready for Phase 20-E-C

Planning-ready only after review and commit of this documentation update. Phase 20-E-C is not production rollout and must keep the same backend-only, local/private, sanitized-reporting boundaries unless explicitly changed.

---

## Phase 20-E-A - Accepted Local VLM Smoke Record and Expansion Gate

Status: Implemented
Date: 2026-06-16

### Completed

- Added `docs/open-weight-vlm-local-smoke-expansion-gate.md`.
- Recorded the Phase 20-D2J first accepted Qwen-backed private LAN local VLM smoke result.
- Updated README, backend README, iOS README, Transformers FastAPI setup guide, local operator runbook, real-model preflight, manual smoke tests, phase log, and handoff.
- Defined a conservative Phase 20-E-B expansion gate:
  - 3-5 approved ignored fixtures only
  - fixture IDs only
  - one model call per fixture
  - no retry loops to chase pass rate
  - sanitized aggregate metrics only
  - backend-only local/private LAN path
  - no iOS integration
  - `productionReady:false`

### D2J Accepted Smoke Record

- Windows Qwen2.5-VL Transformers/FastAPI private LAN health check reported:
  - `ok:true`
  - `modelLoaded:true`
  - `modelFamily:qwen2.5-vl`
  - `fixtureSmoke001Available:true`
  - `rawLoggingDisabled:true`
  - `publicExposure:no`
- Contract echo passed before the Qwen-backed smoke.
- Qwen-backed local smoke passed the MacBook backend validator:
  - `acceptedCount:1`
  - `rejectedCount:0`
  - `validationCode:null`
  - `fallbackCategory:null`
  - `schemaDiagnostic:null`
  - `latencyBucket:gt_15s`
  - `networkCallsMade:true`
  - `hardBlockers:[]`
  - `productionReady:false`

### Safety Notes

- Documentation / gate-prep only.
- No real smoke was rerun in this phase.
- No Windows server code was committed.
- No raw prompt, raw model output, image/base64/path, request payload, full model URL, local config, fixture registry, fixture image, generated report, credential, token, or secret was committed.
- No app-facing endpoint or production endpoint added.
- No iOS source/project/localization files changed.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Verification

- `node --test` passed in `backend` with 90/90 tests.
- Synthetic open-weight VLM benchmark passed with 40/40 expectation passes and `productionReady:false`.
- Synthetic benchmark gate passed with no hard blockers and `productionReady:false`.
- Local sandbox config dry-run passed without network.
- Default local sandbox smoke passed in `stub_no_network` mode with `networkCallsMade:false`.
- Local smoke gate passed without making a model call.
- `git diff --check` passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language coverage, and Photo Advisor card language coverage scripts passed.
- Secret scan passed. Additional docs scans found no committed real Windows LAN IP.

### Ready for Phase 20-E-B

Planning-ready only. Phase 20-E-B should not run until explicitly requested, and should remain a small backend-only local/private LAN approved-fixture expansion with sanitized aggregate metrics only.

---

## Phase 20-D2G - Local VLM Candidate Schema Mismatch Diagnostics

Status: Implemented
Date: 2026-06-15

### Completed

- Added sanitized schema mismatch diagnostics to `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`.
- Threaded diagnostics into `backend/src/qa/openWeightVlmLocalSandboxClient.mjs` local model smoke summaries.
- Added backend tests for D2F-style shorthand candidate rejection and redacted local smoke diagnostics.
- Updated README, backend README, Transformers FastAPI setup/adapter docs, local operator runbook, manual smoke tests, phase log, and handoff.
- Documented the likely schema mismatch areas:
  - `allowedContext` must be a string enum, not an object.
  - `visualObservationKey` is required; `observationKey` is unsupported.
  - `creativeIntent`, `technicalRisk`, and `safety` must be objects.
  - `retakeReasonKey` is required even when `null`.
  - `safetyFlags` is unsupported.
  - additional unknown fields remain rejected.

### D2F Context Captured

- A private LAN D2F smoke reached the Windows Transformers FastAPI Qwen2.5-VL server.
- Exactly one local model call was made.
- The smoke was safely rejected:
  - `acceptedCount:0`
  - `rejectedCount:1`
  - `validationCode:"invalid_schema"`
  - `fallbackCategory:"invalid_schema"`
  - `latencyBucket:"5s_to_15s"`
  - `networkCallsMade:true`
- Raw prompt/model output/image/base64/path/request payload was not printed or persisted.
- `productionReady:false` remained required.

### Safety Notes

- Backend validator remains strict and authoritative.
- No validation rule was weakened.
- No retry smoke was run in this phase.
- No raw model output, raw prompt, request payload, image/base64/path, full model URL, local config, fixture registry, fixture image, generated report, credential, token, or secret was committed.
- No app-facing endpoint or production endpoint added.
- No iOS source/project/localization files changed.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Ready For Retry

Not yet. Phase 20-E remains blocked. A future D2 retry may run exactly one local smoke only after the Windows FastAPI mapper returns candidate JSON matching the repo schema and all backend gates pass.

---

## Phase 20-D2E - Private LAN Transformers FastAPI Smoke Server Support

Status: Implemented
Date: 2026-06-15

### Completed

- Updated `backend/src/qa/openWeightVlmLocalSandboxConfig.mjs` with `allowPrivateLanModelServer:false` by default.
- Kept loopback URLs accepted for same-machine smoke.
- Added explicit private LAN IPv4 acceptance only when ignored local config sets `allowPrivateLanModelServer:true`.
- Restricted private LAN acceptance to `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`.
- Rejected public IPs/domains, tunnel/ngrok/cloud-looking URLs, HTTPS URLs, credentialed URLs, query-string secrets, and `0.0.0.0`.
- Updated smoke gate sanitized summaries to include the private LAN opt-in boolean without exposing raw URL/IP values.
- Updated `backend/config/open-weight-vlm.local.example.json` to keep the committed example disabled/no-network with `allowPrivateLanModelServer:false`.
- Added backend tests for loopback acceptance, private LAN opt-in, public/tunnel/unsafe URL rejection, productionReady blocking, and smoke gate redaction.
- Updated README, backend README, setup docs, adapter docs, operator runbook, preflight, manual smoke tests, phase log, and handoff.

### Safety Notes

- Backend-only validation/docs update.
- No real VLM/model call run.
- No FastAPI server started.
- No `--run-local-model` run.
- No local config, fixture registry, fixture image, model output, generated report, model weights, model cache, or model server URL committed.
- No app-facing endpoint or production endpoint added.
- No iOS source/project/localization files changed.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Ready for Phase 20-D2B/D2C Retry

Ready for an operator to proceed with a private LAN Windows GPU setup only after ignored local config, ignored fixture registry, `smoke_001`, and the private LAN FastAPI server are prepared. The real smoke remains blocked unless the smoke gate passes and a later prompt explicitly asks to run one local model smoke.

---

## Phase 20-D2A - Local Transformers FastAPI Smoke Server Setup Guide

Status: Docs/operator-prep implemented
Date: 2026-06-15

### Completed

- Added `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`.
- Documented why Transformers + FastAPI is the first correctness/reference smoke path.
- Documented the hardware/runtime decision tree:
  - first model: `Qwen2.5-VL-7B-Instruct`
  - fallback: `Qwen2.5-VL-3B-Instruct` or 7B quantized local experiment if hardware is insufficient
  - CPU-only keeps D2 blocked
- Documented the local server architecture:
  - bind to `127.0.0.1` only
  - endpoint `POST /local/vlm/photo-advisor`
  - request uses `fixtureId` token only
  - response is candidate JSON only
- Documented minimal prompt policy, deterministic JSON cleanup limits, and rejection categories.
- Documented approved ignored fixture policy:
  - `backend/tests/vlm-local-samples/`
  - `backend/config/open-weight-vlm.fixtures.local.json`
  - first fixture token `smoke_001`
- Updated `.gitignore` for the ignored fixture registry and local VLM report filename patterns.
- Updated README, backend README, iOS README, local operator runbook, real-model preflight, adapter doc, manual smoke tests, phase log, and handoff.

### Safety Notes

- Docs/operator-prep only.
- No FastAPI server implementation added.
- No real VLM/model call run.
- No `--run-local-model` run.
- No local config, fixture registry, fixture image, model output, generated report, model weights, model cache, or model server URL committed.
- No app-facing endpoint or production endpoint added.
- No iOS source/project/localization files changed.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Ready for Phase 20-D2B

Operator-ready, but still blocked until the operator prepares ignored local config, exactly one approved ignored fixture using `smoke_001`, and a safe local/private Transformers FastAPI server. Phase 20-E should not start until a real smoke result exists or the user explicitly changes direction.

---

## Phase 20-D1 - Transformers + FastAPI Local Adapter Prep

Status: Implemented; verification passed
Date: 2026-06-15

### Completed

- Added `docs/open-weight-vlm-transformers-fastapi-local-adapter.md`.
- Updated `backend/config/open-weight-vlm.local.example.json` to keep the example disabled/no-network while selecting `servingStack:"transformers_fastapi"` and a non-sensitive `fixtureId`.
- Updated `backend/src/qa/openWeightVlmLocalSandboxConfig.mjs` to accept `transformers_fastapi`, validate `fixtureId`, and expose only `fixtureIdBucket` / `fixtureConfigured` in sanitized summaries.
- Updated `backend/src/qa/openWeightVlmLocalSandboxClient.mjs` so the explicit `--run-local-model` path can call a local/private Transformers FastAPI endpoint only after config and gate blockers are clear; default mode remains stub/no-network.
- Updated `backend/src/qa/openWeightVlmLocalSmokeGate.mjs` to block non-`transformers_fastapi` serving stacks for this first adapter path.
- Updated `backend/scripts/run-open-weight-vlm-local-sandbox-smoke.mjs` so explicit local-model mode exits successfully only if there are no hard blockers.
- Updated backend tests for default no-network behavior, unsupported serving stack blocking, sanitized FastAPI request shape, structured candidate validation, invalid candidate rejection, and redaction.
- Updated README, backend README, local operator runbook, real-model preflight, manual smoke tests, and handoff.

### Safety Notes

- Backend-only adapter prep.
- No iOS source/project/localization files changed.
- No app-facing endpoint or production endpoint added.
- No local FastAPI server implementation added.
- No real model call run.
- No model server URL runtime config committed.
- No provider/model credentials added.
- No real photos, fixture images, generated reports, raw prompts, raw model output, raw image/base64/path, or request payload committed.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry added.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Verification

- [x] Backend tests passed via bundled Node: 83/83.
- [x] Default local sandbox smoke stayed `stub_no_network`.
- [x] Local smoke gate stayed fail-closed when ignored local config is absent.
- [x] FastAPI adapter tests use injected fetch and do not bind a port or make a real network/model call.
- [x] Full final closeout scans are recorded in the assistant response for this phase.

### Ready for Phase 20-D Retry

Partially. The code-level Transformers + FastAPI adapter path is prepared, but a real Phase 20-D smoke still requires ignored local config, one approved ignored local fixture, a safe local/private FastAPI server, and passing pre-run gates. Phase 20-E should not start yet unless the user explicitly changes direction.

---

## Phase 20-D - First Approved Local Real-model Smoke Run

Status: Preflight completed; real-model smoke run blocked safely by local operator environment
Date: 2026-06-14

### Completed

- Verified repo state before starting:
  - `git status` was clean.
  - `git log --oneline @{u}..HEAD` showed no local-only commits.
  - `git rev-list --left-right --count @{u}...HEAD` returned `0 0`.
- Confirmed Phase 20-C was committed and upstream-synced before Phase 20-D work began.
- Confirmed `backend/config/open-weight-vlm.local.json` is covered by `.gitignore`.
- Confirmed `backend/config/open-weight-vlm.local.json` is absent on disk, untracked, and unstaged.
- Ran backend tests, synthetic benchmark, benchmark gate, local config dry-run, local sandbox smoke no-network mode, and local smoke gate.
- Stopped before `--run-local-model` because the real-model smoke gate failed closed.

### Local Config / Fixture Safety Result

- Real ignored config path: `backend/config/open-weight-vlm.local.json`.
- Git ignore status: ignored by `.gitignore`.
- File presence: absent on disk.
- Tracked/staged status: not tracked and not staged.
- Approved local fixture policy: could not be verified because the ignored local config is absent.
- Real-model smoke run: not run.
- Network/model call: not made.
- Generated raw model report: not created.
- Raw image/base64/prompt/model output/request payload: not logged or persisted.

### Gate Result

The real-model smoke gate failed closed with sanitized blockers:

- `config_missing`
- `sandbox_disabled`
- `network_opt_in_missing`
- `model_server_missing`
- `non_approved_fixture_mode`

The gate still reported:

- `syntheticBenchmarkGatePassed:true`
- `localSmokeDefaultPassed:true`
- `productionReady:false`
- `networkCallsMade:false`

### Safety Notes

- Backend-only preflight / operator-environment check.
- No iOS source/project/localization files changed.
- No app-facing endpoint or production endpoint added.
- No model server implementation or active model server URL runtime config added.
- No provider/model credentials added.
- No real VLM/provider call run.
- No backend provider request payload changed.
- No iOS upload payload changed.
- No capture-context upload added.
- No Camera cloud AI entry added.
- No real photos, generated images, screenshots, recordings, local samples, or raw model reports committed.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Verification

- [x] Backend tests passed via bundled Node: 80/80.
- [x] Synthetic benchmark runner passed: 40 cases, 40 expectation passes, 0 expectation failures, `networkCallsMade:false`, `productionReady:false`.
- [x] Benchmark gate summary script passed with no hard blockers.
- [x] Local sandbox config dry-run script passed against the example config with sanitized output.
- [x] Local sandbox smoke script passed in default no-network mode.
- [x] Local smoke gate script failed closed as expected because ignored local config is absent; output stayed sanitized with `networkCallsMade:false` and `productionReady:false`.
- [x] `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan found no key-like secrets.
- [x] Provider/model key scan found policy/test/example placeholder references only and no credentials.
- [x] iOS direct provider/model scan found only pre-existing local/mock/debug/provider-placeholder references; no iOS files changed.
- [x] Camera cloud entry scan found no changed Camera/CloudAI/localization files.
- [x] Backend/iOS payload unchanged scan found no changed iOS files and no changed backend route/provider/server/config payload files.
- [x] Artifact scan found no real photos, generated reports, screenshots, recordings, local samples, generated images, env files, or real local VLM config in the changed/untracked set.
- [x] Xcode build not required because no iOS source/project/localization files changed.

### Ready for Phase 20-E

No. Phase 20-D did not produce a real-model smoke result. Either retry Phase 20-D after the operator prepares ignored local config, approved ignored local fixtures, and a safe local/private model server, or explicitly choose a docs-only / fixture-only continuation. Production rollout remains blocked.

---

## Phase 20-C - Local VLM Operator Runbook + Real-model Smoke Gate

Status: Implemented; verification passed; committed and upstream-synced
Date: 2026-06-14

### Completed

- Added `docs/open-weight-vlm-local-operator-runbook.md`.
- Added `backend/src/qa/openWeightVlmLocalSmokeGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-local-smoke-gate.mjs`.
- Added `npm run qa:open-weight-vlm:local-smoke-gate`.
- Added backend tests for smoke gate missing config, disabled config, missing network opt-in, public/unsafe URL rejection, non-approved fixture mode, sanitized output, and safe eligible config behavior.
- Updated README, backend README, the Phase 19-F preflight doc, manual smoke tests, and this handoff/phase log.

### Smoke Gate Behavior

- The default smoke gate checks the ignored local config path `backend/config/open-weight-vlm.local.json`.
- The gate runs synthetic benchmark and local sandbox smoke prerequisites in no-network mode.
- The gate fails closed until ignored local config is intentionally prepared with `enabled:true`, `allowNetworkCalls:true`, a validated local/private model server URL bucket, and `fixtureMode:approved_local_only`.
- The gate prints sanitized status, blockers, warnings, config buckets, prerequisite booleans, `productionReady:false`, and `networkCallsMade:false`.
- The gate does not call a model, upload an image, print a raw URL/path/prompt/model output/base64/request payload, or persist generated reports.

### Safety Notes

- Backend-only operator safety work.
- No iOS source/project/localization files changed.
- No app-facing endpoint or production endpoint added.
- No model server implementation or active model server URL runtime config added.
- No provider/model credentials added.
- No real VLM/provider calls run.
- No backend provider request payload changed.
- No iOS upload payload changed.
- No capture-context upload added.
- No Camera cloud AI entry added.
- No real photos, generated images, screenshots, recordings, local samples, or raw model reports committed.
- No training/fine-tuning added.
- `productionReady` remains `false`.

### Verification

- [x] Backend tests passed via bundled Node: 80/80.
- [x] Synthetic benchmark runner passed: 40 cases, 40 expectation passes, 0 expectation failures, `networkCallsMade:false`, `productionReady:false`.
- [x] Benchmark gate summary script passed with no hard blockers.
- [x] Local sandbox config dry-run script passed with sanitized output.
- [x] Local sandbox smoke script passed in default no-network mode.
- [x] Local smoke gate script failed closed as expected because ignored local config is absent; output stayed sanitized with `networkCallsMade:false` and `productionReady:false`.
- [x] `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan found no key-like secrets.
- [x] Provider/model key scan found only docs/test/policy placeholder references and no credentials.
- [x] iOS direct provider/model scan found only pre-existing debug/internal CloudAI scaffold and placeholder/provider localization references; no iOS files changed in Phase 20-C.
- [x] Camera cloud entry scan found no changed Camera/CloudAI/localization files.
- [x] Backend/iOS payload unchanged scan found no changed iOS files and no changed backend route/provider/server/config payload files.
- [x] Artifact scan found no real photos, generated reports, screenshots, recordings, local samples, generated images, env files, or real local VLM config in the changed/untracked set.
- [x] Xcode build not required because no iOS source/project/localization files changed.

### Ready for Phase 20-D

No. Phase 20-D should start only after Phase 20-C is reviewed, committed, pushed, and explicitly requested. It must remain backend-only, local/self-hosted, ignored-config-only, approved-local-fixture-only, sanitized-output-only, and production-blocked.

---

## Future Phase Roadmap vs Existing Markdown Planning Gap Audit

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `docs/future-phase-roadmap-gap-audit.md`.
- Compared the proposed Phase 20-B through Phase 27+ roadmap against current Markdown planning for Photo Advisor, AI Snapshot, AI Filter Generator, Inspiration AI, live guidance, open-weight VLM, local/on-device AI, fine-tuning, privacy, StoreKit/quota, history, and production rollout.
- Identified missing roadmap items: production Firebase/history, StoreKit/quota, account deletion/privacy release gates, History intelligence, paid AI image editing / ????? encrypted transfer/export, LiDAR/Core ML specifics, advanced retro effects, and app-wide Hong Kong / ??????language-mode follow-through.
- Identified outdated assumptions: older Gemini/OpenAI provider-first MVP docs, older Gemini Live phase ordering, old Camera snapshot cloud concepts, and old caption/social-copy ideas that conflict with current guardrails.
- Produced a revised roadmap that keeps Phase 20-C as the immediate next phase and delays Camera cloud AI, live/voice AI, AI Filter Generator real backend, image editing, LoRA/QLoRA, and on-device model work until their own gated phases.

### Safety Notes

- Documentation-only audit.
- No iOS source/project/localization files changed.
- No backend runtime code changed.
- No backend provider request payload changed.
- No iOS upload payload changed.
- No capture-context upload added.
- No provider/model key, direct provider/model call, model server code, model server URL config, Camera cloud entry, real photos, generated reports, real VLM/provider calls, training, fine-tuning, or production rollout added.
- `productionReady` remains `false`.

### Verification

- [x] `git diff --check` passed.
- [x] New audit doc trailing-whitespace check passed.
- [x] Existing phase-log trailing-whitespace scan found only pre-existing old entries outside this audit section.
- [x] Secret scan found no key-like secret values.
- [x] Provider/model key scan on changed docs found policy/boundary mentions only; no credentials were added.
- [x] iOS direct provider/model scan passed because no iOS files changed.
- [x] Camera cloud entry scan passed because no Camera files changed and no Camera cloud entry was added.
- [x] Backend/iOS payload unchanged scan passed because no backend runtime, backend script, backend config, functions, or iOS files changed.
- [x] Artifact scan found no real photos, generated reports, screenshots, recordings, model outputs, local samples, or generated images in the changed/untracked set.
- [x] Xcode build not required because no iOS source/project/localization files changed.
- [x] Backend tests not required because no backend source/package files changed.

### Ready to Commit

Yes, after final verification passes.

---

## Phase 20-B - Backend-only Local VLM Sandbox Client Smoke Path

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `backend/src/qa/openWeightVlmLocalSandboxClient.mjs`.
- Added `backend/scripts/run-open-weight-vlm-local-sandbox-smoke.mjs`.
- Added `npm run qa:open-weight-vlm:local-smoke`.
- Updated `npm run qa:open-weight-vlm:local` to use the smoke client in explicit `--run-local-model` mode.
- Added backend tests for default no-network smoke behavior, missing config fail-closed behavior, disabled config fail-closed behavior, missing network opt-in, public/unsafe URL rejection, stubbed schema/gate validation, and sanitized output.
- Updated README, backend README, manual smoke tests, handoff, phase log, and the Phase 19-F preflight doc.

### Local Sandbox Client Behavior

- Default smoke mode runs one stubbed candidate through the existing open-weight VLM schema validator and benchmark gate.
- Default smoke mode sends no network request, uploads no image, and calls no model server.
- Smoke output includes sanitized aggregate fields such as `runMode:stub_no_network`, `eligibleForLocalSandboxSmoke`, `stubbedBenchmark`, `benchmarkGate`, `productionReady:false`, and `networkCallsMade:false`.
- Smoke output does not include full model server URLs, raw image paths, raw prompts, raw model output, base64, request payloads, credentials, secrets, or real sample names.
- The explicit future local-model command still exits non-zero by default and reports sanitized blockers only.

### Fail-closed Behavior

- Missing ignored local config blocks explicit local-model mode.
- `enabled:false` blocks explicit local-model mode.
- `allowNetworkCalls:false` blocks explicit local-model mode.
- Public/non-local URLs, URL credentials, query strings, and fragments are rejected by the config validator.
- The Phase 20-B client adds `local_model_client_not_enabled` so no model-server request is sent in this phase.
- Synthetic benchmark and gate remain the prerequisite safety path before any future real-model test.

### Safety Notes

- No real model server implementation was added.
- No active model server URL runtime config was committed.
- No provider/model credentials were added.
- No raw image/base64, raw prompt, raw model response, request payload, image path, secret, GPS, raw EXIF, or unsafe text logging was added.
- No real photos, local VLM samples, generated reports, model outputs, screenshots, recordings, model downloads, or model caches were added.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, provider/model SDK, or direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No training or fine-tuning was added.
- `productionReady` remains `false`.

### Verification

- [x] Targeted open-weight VLM backend tests passed: 20/20 tests.
- [x] Full backend tests passed: 74/74 tests.
- [x] Synthetic benchmark runner passed: 40 total cases, 40 expectation passes, `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, `networkCallsMade:false`.
- [x] Synthetic gate summary script passed with no hard blockers and `pass_for_synthetic_contract`.
- [x] Local sandbox config dry-run script passed with `runMode:dry_run`, no hard blockers, `configEnabled:false`, `allowNetworkCalls:false`, and `networkCallsMade:false`.
- [x] Local sandbox smoke script passed with `runMode:stub_no_network`, one accepted stubbed benchmark case, no hard blockers, and `networkCallsMade:false`.
- [x] Explicit local-model smoke command fail-closed check passed: command exits non-zero with missing ignored config / disabled sandbox blockers and `networkCallsMade:false`.
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only denylist strings, docs/placeholders, and test-only fake unsafe URL values; no real provider/model credential was added.
- [x] iOS direct provider/model scan found only pre-existing debug/internal CloudAI client and OpenAI placeholder localization references; no iOS files changed in Phase 20-B.
- [x] Camera cloud-entry scan found only pre-existing mock CloudSnapshot camera files; no Camera files changed in Phase 20-B.
- [x] Backend/iOS payload unchanged scan passed.
- [x] Report redaction scan found only denylist/test fixture strings in code; backend tests and direct smoke output confirm no raw prompt, raw model output, full model URL, raw image path, base64, request payload, credential, or secret appears in smoke output.
- [x] Artifact scan found only existing ignored local artifacts; no real photos, local VLM samples, generated reports, model outputs, screenshots, recordings, or device artifacts were staged.
- [x] `npm` is unavailable in this shell, so package commands were verified through their underlying bundled Node scripts.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 20-B

Yes, after final closeout scans pass.

## Phase 20-A - Backend-only Local Self-hosted VLM Sandbox Setup

Status: Completed and pushed / upstream-synced
Date: 2026-06-14

### Completed

- Added `backend/config/open-weight-vlm.local.example.json` as a safe committed example with `enabled:false` and `allowNetworkCalls:false`.
- Updated `.gitignore` so real local VLM config, local sandbox reports, local VLM sample images, and generated images remain ignored.
- Added `backend/src/qa/openWeightVlmLocalSandboxConfig.mjs`.
- Added `backend/scripts/check-open-weight-vlm-local-sandbox-config.mjs`.
- Added package scripts:
  - `npm run qa:open-weight-vlm:local-config`
  - `npm run qa:open-weight-vlm:local`
- Added backend tests for disabled dry-run behavior, public/non-local URL rejection, credential URL rejection, missing network opt-in, and fail-closed future local-model command behavior.
- Updated README, backend README, manual smoke tests, handoff, phase log, and the Phase 19-F preflight doc.

### Local Sandbox Config Behavior

- Actual config must live in ignored `backend/config/open-weight-vlm.local.json` or `backend/config/open-weight-vlm.local.*.json`.
- Supported serving stacks are `vllm`, `sglang`, `transformers`, and `ollama`.
- Supported model IDs are `qwen2.5-vl-7b-instruct`, `qwen3-vl-8b-instruct`, `minicpm-v-4.5`, and `internvl3-8b`.
- `enabled` defaults to `false`.
- `allowNetworkCalls` defaults to `false`.
- `fixtureMode` must be `approved_local_only`.
- `timeoutMs` must be a bounded integer.
- The script rejects public/non-local model URLs, URL credentials, query strings, fragments, unsupported protocols, unsupported model IDs, unsupported serving stacks, unsupported fixture modes, and unsupported fields.
- Dry-run output uses safe buckets such as `local_loopback_ip` instead of printing the full model server URL.

### Fail-closed Behavior

- Default dry-run validates config shape and sends no network/model request.
- `npm run qa:open-weight-vlm:local` intentionally fails closed in Phase 20-A with `local_model_adapter_not_implemented`.
- The future real-model command prints sanitized gate output only and keeps `networkCallsMade:false`.
- No app-facing endpoint, public endpoint, production endpoint, or real model call path was added.

### Safety Notes

- No real model server implementation was added.
- No active model server URL runtime config was committed.
- No provider/model credentials were added.
- No raw image/base64, raw prompt, raw model response, request payload, image path, secret, GPS, raw EXIF, or unsafe text logging was added.
- No real photos, local VLM samples, generated reports, model outputs, screenshots, recordings, model downloads, or model caches were added.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, provider/model SDK, or direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No training or fine-tuning was added.
- `productionReady` remains `false`.

### Verification

- [x] Full backend tests passed: 69/69 tests.
- [x] Synthetic benchmark runner passed: 40 total cases, 40 expectation passes, `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, `networkCallsMade:false`.
- [x] Synthetic gate summary script passed with no hard blockers and `pass_for_synthetic_contract`.
- [x] Local sandbox config dry-run script passed with `runMode:dry_run`, no hard blockers, `configEnabled:false`, `allowNetworkCalls:false`, and `networkCallsMade:false`.
- [x] Future local-model command fail-closed check passed: command exits non-zero with `local_model_adapter_not_implemented` and `networkCallsMade:false`.
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only existing backend documentation placeholders, safety-denylist text, and test assertions; no real provider/model credential was added.
- [x] iOS direct provider/model scan passed.
- [x] Camera cloud-entry scan passed.
- [x] Backend/iOS payload unchanged scan passed.
- [x] Artifact scan found only existing ignored local artifacts; no real photos, local VLM samples, generated reports, model outputs, screenshots, recordings, or device artifacts were staged.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Phase 20-A Commit Status

Completed and pushed / upstream-synced according to the Phase 20-B start-state verification.

---

## Phase 19-F - Open-weight VLM Real-model Sandbox Preflight

Status: Completed and pushed / upstream-synced
Date: 2026-06-14

### Completed

- Added `docs/open-weight-vlm-real-model-sandbox-preflight.md`.
- Defined safe future Phase 20-A scope for backend-only local/self-hosted VLM sandbox work.
- Documented allowed model candidates: Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B.
- Documented allowed serving paths: Transformers + FastAPI, vLLM, SGLang, and Ollama / LM Studio for local smoke/manual QA only.
- Documented ignored local config rules for model server URL, local model paths, local reports, `.env`, private model paths, and generated artifacts.
- Documented approved local image fixture policy, including ignored local folder, no user photos by default, no private photos in git, metadata stripping before model requests, no GPS/raw EXIF persistence, and no sensitive labels.
- Documented runtime safety preflight for raw prompt/model response/image/base64/request payload/path logging bans and sanitized aggregate metrics only.
- Documented Phase 20-A hard gates and local operator checklist.
- Updated README, backend README, manual smoke tests, handoff, and phase log references.

### Phase 20-A Readiness Recommendation

- Phase 20-A may only be backend-only local/self-hosted VLM sandbox work if explicitly requested.
- Synthetic benchmark and gate must pass before any real-model test.
- Any model server URL must live only in ignored local config.
- Any approved local images must live only in ignored local folders.
- Real-model network calls may occur only to an explicitly configured local/self-hosted model server if Phase 20-A explicitly approves them.
- No iOS integration, public endpoint, production endpoint, payload change, capture-context upload, Camera cloud entry, training/fine-tuning, user-photo training, or `productionReady:true` is allowed.

### Safety Notes

- No real model server code was added.
- No model server URL config was added.
- No provider/model credentials were added.
- No image upload or network call was added.
- No real-provider QA or real VLM QA was run.
- No model download, model cache, benchmark report, real photo, generated image, or local VLM sample was added.
- No training or fine-tuning was started.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, no provider/model SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, raw model/provider response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] Full backend tests passed: 65/65 tests.
- [x] Synthetic benchmark runner passed: 40 total cases, 40 expectation passes, `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, `networkCallsMade:false`.
- [x] Synthetic gate summary script passed with no hard blockers and `pass_for_synthetic_contract`.
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only existing backend documentation placeholders / historical server-side provider notes; no new provider/model credential, model server URL config, or active runtime config was added.
- [x] iOS direct provider/model scan passed.
- [x] Camera cloud-entry scan passed.
- [x] Backend/iOS payload unchanged scan passed.
- [x] Artifact scan found only ignored local artifacts; no real photos, generated reports, model outputs, screenshots, recordings, or device artifacts were staged.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-F

Yes, after final closeout scans pass.

---

## Phase 19-E - Open-weight VLM Synthetic Benchmark Expansion + Failure Taxonomy

Status: Completed and pushed / upstream-synced as `5dee098`
Date: 2026-06-14

### Completed

- Expanded `backend/tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json` from 20 to 40 synthetic JSON/text-only cases.
- Added `OPEN_WEIGHT_VLM_FAILURE_TAXONOMY` and sanitized taxonomy coverage counts in `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`.
- Extended validator coverage for overlong output, prompt injection, raw localization keys, unsafe free text, and timeout stub behavior.
- Extended `backend/src/qa/openWeightVlmBenchmarkGate.mjs` hard-blocker logic and blocker counts for the expanded taxonomy.
- Updated backend tests to require expanded fixture count, every failure taxonomy category, sanitized output, and fail-closed gate behavior.
- Updated README, backend README, manual smoke tests, handoff, and phase log references.

### Expanded Fixture Coverage

- Total cases: 40.
- Accepted cases: 24.
- Rejected cases: 16.
- Accepted scenario coverage includes bright daylight, low light, warm indoor light, neon/night street, intentional blur, accidental motion blur, soft focus, tilted snapshot, grainy retro, high contrast, faded color, backlight/silhouette, cluttered scene, minimal composition, food/object, street, landscape, pet, architecture, imported limited context, severe blur, black image, and overexposed image.
- Rejected taxonomy coverage includes invalid JSON, schema failure, unsupported enum, unsupported filter family, sensitive inference, body/appearance judgement, score/rating, chain-of-thought, debug/provider leakage, source-context overclaim, retake false positive, overlong output, prompt injection, raw localization key leakage, unsafe free text, and timeout stub behavior.
- Fixtures remain committed text/JSON only and contain no photos, image paths, base64, user data, private content, real model output, provider reports, prompts, or generated artifacts.

### Benchmark / Gate Output

- Synthetic benchmark: 40 expectation passes, 0 expectation failures.
- Gate summary: no hard blockers.
- `eligibleForSyntheticContractReview:true`.
- `productionReady:false`.
- `providerConfigured:false`.
- `modelServerConfigured:false`.
- `networkCallsMade:false`.
- Accepted-risk counters are all 0 for sensitive inference, score/rating, chain-of-thought, debug/provider leakage, source-context overclaim, unsupported filter, overlong output, prompt injection, raw localization key, unsafe free text, and timeout stub.

### Safety Notes

- No real model server code was added.
- No model server URL config was added.
- No provider/model credentials were added.
- No image upload or network call was added.
- No real-provider QA or real VLM QA was run.
- No model download, model cache, benchmark report, real photo, generated image, or local VLM sample was added.
- No training or fine-tuning was started.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, no provider/model SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, raw model/provider response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] Targeted open-weight VLM benchmark tests passed via bundled Node (11/11 passing).
- [x] Synthetic benchmark runner passed via bundled Node.
- [x] Synthetic gate summary script passed via bundled Node.
- [x] Full backend tests passed via bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs` from `backend` (65/65 passing).
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only existing backend QweAPI placeholders/docs plus redaction-denylist strings; no provider/model credential or model-server config was added.
- [x] iOS direct provider/model scan was clean.
- [x] Camera cloud-entry scan was clean.
- [x] Backend/iOS payload unchanged scan showed no backend provider request payload or iOS upload payload paths changed.
- [x] Report redaction was covered by backend tests and synthetic runner/gate output checks; output contains no raw prompt, raw model output, raw image path, base64, request payload, credentials, secrets, real photo references, GPS, raw EXIF, or stack traces.
- [x] Artifact scan found only ignored local artifacts (`.env`, provider reports, local sample images, and macOS resource-fork files); no real photos, generated reports, screenshots, recordings, or local VLM sample artifacts were staged.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-E

Yes.

---

## Phase 19-D - Open-weight VLM Synthetic Benchmark Report + Gate Summary

Status: Completed and locally committed as `ea4fd82`
Date: 2026-06-14

### Completed

- Added `backend/src/qa/openWeightVlmBenchmarkGate.mjs`.
- Added `backend/scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs`.
- Added `npm run qa:open-weight-vlm:gate`.
- Extended `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs` synthetic report summaries with sanitized scenario groups and accepted-risk counters.
- Extended backend tests for clean gate pass, hard-blocker regressions, and sanitized CLI output.
- Updated README, backend README, manual smoke tests, handoff, and phase log references.

### Gate Summary Behavior

- Reads sanitized synthetic benchmark report data generated from committed fixtures.
- Prints `productionReady:false`, `eligibleForSyntheticContractReview`, `statusCategories`, `hardBlockers`, `blockedFixtureCounts`, and reviewed metrics.
- Keeps `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`.
- Summarizes total cases, accepted/rejected cases, expectation pass/fail counts, validation failure counts, fallback categories, safety blockers, schema blockers, filter-integrity blockers, language-contract blockers, source-context overclaim blockers, retake gate blockers, and leakage blockers.
- Does not print raw prompts, raw model output, raw images, base64, request payloads, credentials, secrets, real photo references, GPS, raw EXIF, or stack traces.

### Gate Pass / Fail Output

- Current synthetic gate output: no hard blockers.
- Status categories: `not_production_ready`, `pass_for_synthetic_contract`.
- Total cases: 20.
- Accepted: 11.
- Rejected: 9.
- Expectation pass: 20.
- Expectation failures: 0.
- Blocked fixture counts: safety 1, schema 2, filter integrity 1, language contract 2, source-context overclaim 1, retake gate 1, leakage 1.
- Reviewed accepted-risk counters are all 0 for sensitive inference, score/rating, chain-of-thought, debug/provider leakage, source-context overclaim, and unsupported filter.

### Hard Blockers

- Expectation failures greater than 0.
- Accepted sensitive inference greater than 0.
- Accepted score/rating greater than 0.
- Accepted chain-of-thought greater than 0.
- Accepted debug/provider leakage greater than 0.
- Accepted imported source-context overclaim greater than 0.
- Accepted unsupported filter family greater than 0.
- `networkCallsMade:true`.
- `productionReady:true`.

### Safety Notes

- No real model server code was added.
- No model server URL config was added.
- No provider/model credentials were added.
- No image upload or network call was added.
- No real-provider QA or real VLM QA was run.
- No model download, model cache, benchmark report, real photo, generated image, or local VLM sample was added.
- No training or fine-tuning was started.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, no provider/model SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, raw model/provider response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] Backend tests passed via bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs` from `backend` (64/64 passing).
- [x] Synthetic benchmark runner passed via bundled Node.
- [x] New synthetic gate summary script passed via bundled Node.
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only existing backend QweAPI placeholders/docs plus new redaction-denylist strings; no provider/model credential or model-server config was added.
- [x] iOS direct provider/model scan was clean.
- [x] Camera cloud-entry scan was clean.
- [x] Backend/iOS payload unchanged scan showed no backend provider request payload or iOS upload payload paths changed.
- [x] Report redaction was covered by backend tests and synthetic gate output checks; the gate output contains no raw prompt, raw model output, raw image path, base64, request payload, credentials, secrets, real photo references, GPS, raw EXIF, or stack traces.
- [x] Artifact scan found only ignored local artifacts (`.env`, provider reports, local sample images, and macOS resource-fork files); no real photos, generated reports, screenshots, recordings, or local VLM sample artifacts were staged.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-D

Yes, after final closeout scans pass.

---

## Phase 19-C - Backend-only VLM Benchmark Harness Skeleton

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`.
- Added `backend/tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json`.
- Added `backend/scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs`.
- Added `backend/tests/open-weight-vlm-benchmark.test.mjs`.
- Added `npm run qa:open-weight-vlm:synthetic`.
- Added `.gitignore` protections for future VLM benchmark reports, generated images, and local VLM sample folders.
- Updated README, backend README, iOS README, manual smoke tests, handoff, and phase log references.

### Schema / Validator Summary

- Candidate schema version: `photo_advisor_vlm_candidate.v1`.
- Candidate output is enum/key-based only and includes `schemaVersion`, `sourceType`, `allowedContext`, `moodKey`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, `filterFamilyCandidate`, `optionalActionKey`, `retakeAllowed`, `retakeReasonKey`, and `safety`.
- The validator enforces manual `additionalProperties=false` behavior, enum whitelists, imported `imageOnly` context rules, filter-family whitelist, retake gate, sensitive-inference / score / chain-of-thought / debug-leakage rejection, and sanitized fallback categories.
- The harness returns sanitized aggregate metrics only and never includes raw fixture/model output in the report.

### Fixture Categories

- Valid fixtures cover bright daylight, low light, intentional blur, motion blur, tilted snapshot, grainy retro, high contrast, faded color, imported limited context, severe blur, and black image.
- Invalid fixtures cover invalid JSON, missing required fields, unsupported filter family, sensitive inference, score/rating, chain-of-thought, debug/provider leakage, imported capture-context overclaim, and retake false positive.
- Fixtures are pure JSON/text. They contain no photos, private paths, base64, user data, real model responses, prompts, provider reports, or generated images.

### Synthetic Benchmark Output

- Total cases: 20.
- Accepted: 11.
- Rejected: 9.
- Expectation pass: 20.
- Expectation failures: 0.
- Fallback categories: `invalid_json`, `invalid_schema`, `unsupported_filter`, `unsafe_response`, `source_context_overclaim`, and `retake_gate`.
- `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`.

### Safety Notes

- No real model server code was added.
- No model server URL config was added.
- No provider/model credentials were added.
- No image upload or network call was added.
- No real-provider QA or real VLM QA was run.
- No model download, model cache, benchmark report, real photo, generated image, or local VLM sample was added.
- No training or fine-tuning was started.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, no provider/model SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, raw model/provider response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] Backend tests passed via bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs` from `backend` (61/61 passing).
- [x] Synthetic benchmark passed via bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic`.
- [x] Synthetic benchmark summary: 20 total cases, 11 accepted, 9 rejected, 20 expectation passes, 0 expectation failures, `productionReady:false`.
- [x] The local shell did not have `npm`, so npm package scripts were not directly executed in this environment; equivalent Node commands passed.
- [x] Final `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] Provider/model key scan found only existing placeholders, backend Qwe boundary/test references, and redaction denylist strings; no new credentials or model server config were added.
- [x] iOS direct provider/model scan was clean.
- [x] Camera cloud-entry scan was clean.
- [x] Backend/iOS payload unchanged scan showed no changed payload paths.
- [x] Report redaction coverage passed through backend tests and synthetic benchmark output checks.
- [x] Artifact scan confirmed `.env`, provider QA reports, local QA images, approved-real sample placeholders, and generated/report folders remain ignored.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-C

Yes, after final closeout scans pass.

---

## Phase 19-B - Open-weight VLM Structured Advisor Benchmark Plan

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `docs/open-weight-vlm-structured-advisor-benchmark-plan.md`.
- Read and incorporated the Open-weight VLM Candidate Report, VLM Serving Stack Report, and Photo Advisor Fine-tuning Dataset + Evaluation Report.
- Defined first benchmark candidates: Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B.
- Defined serving stack roles: Transformers + FastAPI for correctness/reference, Ollama / LM Studio for local smoke/manual QA only, vLLM as primary internal benchmark serving stack, and SGLang as structured-output / performance challenger.
- Defined synthetic/internal benchmark dataset categories covering bright scenes, low light, intentional blur, motion, tilt, grain, high contrast, faded color, imported limited context, severe blur, black image, unsupported filter, prompt injection, and safety cases.
- Defined a docs-only structured VLM candidate JSON shape where the model returns enum/key-based labels only, not final UI prose.
- Defined backend validator/fallback responsibilities for JSON parsing, schema validation, `additionalProperties=false`, enum whitelist, source/context validation, filter-family-to-whitelisted-filter mapping, retake gate, safety scan, and fallback.
- Defined metrics and gates for valid JSON, schema pass, safety pass, fallback, filter family match, creative intent preservation, retake false positives, imported-context overclaims, latency p50/p90/p95, VRAM/model-loading notes, and artifact hygiene.
- Recommended Phase 19-C as an explicitly approved local benchmark harness plan with ignored fixtures/reports and no iOS app integration.
- Updated README, backend README, iOS README, manual smoke tests, handoff, and phase log references.

### Safety Notes

- This phase is documentation-only.
- No model server code was added.
- No real-provider QA or real VLM QA was run.
- No model download, model cache, benchmark report, or generated image was added.
- No training or fine-tuning was started.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider/model key, no provider/model SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, model/provider raw response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] iOS direct provider/model scan was clean.
- [x] Camera cloud-entry scan was clean.
- [x] Backend/iOS payload unchanged scan showed no changed payload paths.
- [x] GPS / raw EXIF / sensor persistence scan found only existing safety-denylist/report text, not new collection or persistence code.
- [x] Artifact scan confirmed `.env`, provider QA reports, local QA images, approved-real sample placeholders, and generated/report folders remain ignored.
- [x] New benchmark plan doc has no trailing whitespace.
- [x] Backend tests not required because backend source/package files were not changed.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-B

Yes.

---

## Phase 19-A - Open-weight VLM Backend Architecture ADR

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `docs/open-weight-vlm-backend-architecture-adr.md`.
- Compared Qwen2.5-VL-7B, Qwen2-VL-7B, and MiniCPM-V as initial open-weight / self-hosted VLM candidates.
- Listed InternVL and LLaVA-next as watchlist candidates for later review.
- Compared Ollama, vLLM, SGLang, and Transformers / FastAPI as serving paths for prototype, research, and production-style evaluation.
- Defined the future target architecture: explicit post-capture consent, backend metadata stripping and size/type limits, self-hosted VLM adapter, structured PhotoAdvisor JSON, backend validation against the existing Photo Advisor contract, safe fallback, and existing app language-pack/result-card rendering.
- Documented non-goals and safety boundaries: no production rollout, no Camera cloud AI, no iOS provider keys/direct model calls, no capture-context upload, no backend/iOS payload changes, no raw image/prompt/model response logging, no real-provider QA, and no user-photo training without explicit consent.
- Documented future fine-tuning path: prompt/schema tuning first, curated evaluation dataset next, manual multilingual review, and LoRA/QLoRA later only with consented, non-sensitive data and adapter/model versioning.
- Recommended Phase 19-B as a local / ignored backend VLM sandbox or benchmark plan with no app integration unless explicitly approved.
- Updated README, backend README, iOS README, manual smoke tests, handoff, and phase log references.

### ADR Decision

- Use Qwen2.5-VL-7B-Instruct as the first benchmark candidate if Phase 19-B proceeds.
- Keep Qwen2-VL-7B-Instruct as a compatibility baseline.
- Evaluate MiniCPM-V when hardware / cost pressure makes a smaller model attractive.
- Use Ollama or Transformers / FastAPI for local research prototypes only.
- Evaluate vLLM and SGLang for production-style serving and structured-output / adapter-readiness only after current support is rechecked.

### Safety Notes

- This phase is documentation-only.
- No model server code was added.
- No real-provider QA was run.
- Backend provider request payloads were not changed.
- iOS upload payloads were not changed.
- Capture context is not uploaded.
- iOS has no provider key, no provider SDK, and no direct provider/model call.
- Camera remains local-only with no cloud AI entry.
- No GPS/location collection, raw EXIF dump, raw sensor persistence, raw image/base64 logging, raw prompt logging, model/provider raw response logging, user-photo training, cloud functionality, or production rollout was added.
- `productionReady` remains `false`.

### Verification

- [x] `git diff --check` passed.
- [x] Photo Advisor copy regression script passed.
- [x] Filter reason coverage script passed.
- [x] CreativeIntent language script passed.
- [x] Photo Advisor card language script passed.
- [x] Secret scan passed.
- [x] iOS direct provider scan was clean.
- [x] Camera cloud-entry scan was clean.
- [x] Backend/iOS payload unchanged scan showed no changed payload paths.
- [x] GPS / raw EXIF / sensor persistence scan found only existing safety-denylist/report text, not new collection or persistence code.
- [x] Artifact scan confirmed `.env`, provider QA reports, local QA images, approved-real sample placeholders, and generated/report folders remain ignored.
- [x] Backend tests not required because backend source/package files were not changed.
- [x] Xcode build not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 19-A

Yes.

---

## Phase 18-C4 - Post-capture Advisor Beta Readiness + Phase 19-A Handoff

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Audited Phase 18-C0 through Phase 18-C3 for consistency across the beta hardening plan, result card polish, captured/imported/fallback flow hardening, and multilingual copy baseline.
- Confirmed the local/mock post-capture Advisor beta QA baseline is ready for the next architecture-planning step.
- Added Phase 18-C readiness notes and Phase 19-A handoff direction to README, beta hardening plan, handoff, and phase log.
- Defined Phase 19-A as `Open-weight VLM Backend Architecture ADR`.
- Captured high-level Phase 19-A goals: compare Qwen2.5-VL / Qwen2-VL / MiniCPM-V candidates, compare Ollama prototype vs vLLM/SGLang production-style serving, require structured JSON output, require backend validator/fallback, require explicit post-capture consent only, forbid raw image/prompt/provider response logging, forbid user-photo training without explicit consent, and keep iOS free of provider keys/direct model calls.

### C0-C3 Readiness Audit

- Phase 18-C0: beta hardening plan, acceptance criteria, and scenario matrix are in place.
- Phase 18-C1: result card presentation is mood-first, concise, filter-reason aware, and retake-restrained.
- Phase 18-C2: captured / imported / fallback flow rules are documented and hardened; imported photos do not overclaim capture-time context.
- Phase 18-C3: multilingual Advisor copy baseline is short, natural, calmer, and suitable as future VLM output style guidance.

### Ready

- Local/mock post-capture Advisor beta QA baseline.
- Mood-first result card language model.
- Captured / imported / fallback flow rules.
- Multilingual copy baseline for future VLM output style.
- Filter recommendation reason language.
- CreativeIntentGuard style-preserving behavior and retake restraint.

### Not Approved

- Production rollout.
- Camera cloud AI.
- iOS provider keys or direct provider/model calls.
- Capture-context upload.
- Backend provider request payload changes.
- iOS upload payload changes.
- Real-provider production exposure.
- User-photo training or fine-tuning without explicit consent.

### Verification

- `git diff --check` passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and card language scripts passed.
- Secret scan passed.
- iOS direct provider scan was clean.
- Camera cloud-entry scan was clean.
- Backend provider request payload and iOS upload payload boundary scan showed no changed payload paths.
- Diff-only boundary text scan only found documentation statements that explicitly describe forbidden / unchanged behavior.
- Artifact scan confirmed local env, provider QA reports, approved-real sample placeholders, local QA images, AppleDouble files, and generated/report folders remain ignored.
- Xcode build was not required because no iOS source, project, or localization files changed.
- Backend tests were not required because no backend source or package files changed.

### Ready to Commit Phase 18-C4

Yes.

---

## Phase 18-C3 - Multilingual Advisor Copy Beta QA Pass

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Reviewed local/mock Photo Advisor UI-facing localization across English, Traditional Chinese, Simplified Chinese, Cantonese-style, and non-explicit ??????strings.
- Replaced visible mock/demo labels with calmer local/on-device wording.
- Updated imported-photo limited-context copy so it says capture details / ??????™è??? / ?????ˆæ­¹????/ ??????™è??? instead of raw ??“îš¯?²ntext??
- Softened provider-unavailable fallback copy from explicit Cloud AI wording to calmer remote / ????™è????? local fallback language.
- Polished Cantonese-style / ??????Photo Advisor strings to keep personality while reducing heavy slang, harsh judgment, and overly corrective phrasing.
- Updated README, iOS README, backend README, manual smoke tests, handoff, and phase log references.

### Multilingual QA Findings

- English copy was mostly short and safe; visible ??“îš®î­–ck demo??wording was too implementation-facing for beta UI.
- Traditional Chinese fallback copy was generally usable but mixed in raw ??“îš¯?²ntext??and ??“î«º?????AI??technical language.
- Simplified Chinese fallback copy needed the same capture-detail and calmer fallback wording.
- Cantonese-style copy was natural but several ??????strings were too slang-heavy or sharp for production-facing Advisor UI.

### Safety Notes

- iOS localization / docs polish only.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, generated artifact commit, real-provider QA run, or production rollout was added.
- `productionReady` remains false.

### Verification

- `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed on 2026-06-14, with an existing Swift 6 actor-isolation warning in `LocalRuleBasedGuidanceProvider.swift`.
- `plutil -lint` passed for English and Traditional Chinese `Localizable.strings`.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and card language scripts passed.
- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan was clean.
- Camera cloud-entry scan was clean.
- Backend provider request payload and iOS upload payload boundary scan showed no changed payload paths.
- GPS / raw EXIF / raw sensor persistence scan on changed localization diff was clean.
- Diff-only score / sensitive inference / raw-debug wording scan on changed localization diff was clean.
- Artifact scan confirmed local env, provider QA reports, approved-real sample placeholders, local QA images, AppleDouble files, and generated/report folders remain ignored.
- Backend tests were not required because no backend source or package files changed.

### Ready to Commit Phase 18-C3

Yes.

---

## Phase 18-C2 - Captured / Imported / Fallback Advisor Flow QA Pass

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Audited captured Photo Advisor flow through Camera-selected photos and confirmed captured inputs use `.captured` with safe local capture/image context.
- Audited imported Photo Advisor flow through Inspiration/imported selected photos and confirmed imported inputs use `.imported` with imported capture context and limited-context fallback wording.
- Updated `PhotoAdvisorResultValidator.fallback` so fallback results are always explicitly marked as `.fallback` instead of sometimes returning a normal mock fixture.
- Updated fallback filter selection so the fallback recommendation chooses `soft_warm_400`, `original`, or another allowed local filter ID when possible.
- Polished user-facing fallback/error copy so it no longer says ??“îš®î­–ck advisor?? ??“îš®?¿valid result?? or ??“îš¯??fe fallback filter??in visible UI.
- Confirmed missing/unknown filter recommendations still show a calm unavailable note and no unusable apply action.
- Updated README, iOS README, backend README, manual smoke tests, handoff, and phase log references.

### Captured / Imported / Fallback Behavior

- Captured Photo Advisor remains local/mock by default and may use safe local capture/image context.
- Imported Photo Advisor does not claim capture-time motion, tilt, focus, lens, exposure, device stability, or camera conditions.
- Provider-unavailable / fallback copy remains calm, short, local-safe, and free of raw provider/internal/debug details.
- Missing/unknown filter behavior stays calm and catalog-bounded.

### Safety Notes

- iOS local/mock Advisor polish only.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, generated artifact commit, real-provider QA run, or production rollout was added.
- `productionReady` remains false.

### Verification

- `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed on 2026-06-14.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and card language scripts passed.
- `plutil -lint` passed for English and Traditional Chinese `Localizable.strings`.
- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan was clean.
- Camera cloud-entry scan was clean.
- Backend provider request payload and iOS upload payload boundary scan showed no changed payload paths.
- GPS / raw EXIF / raw sensor persistence scan on changed app diff was clean.
- Diff-only score / sensitive inference / raw-debug wording scan on changed app UI/localization diff was clean.
- Artifact scan confirmed local env, provider QA reports, approved-real sample placeholders, local QA images, AppleDouble files, and generated/report folders remain ignored.
- Backend tests were not required because no backend source or package files changed.

### Ready to Commit Phase 18-C2

Yes.

---

## Phase 18-C1 - Post-capture Advisor Result Card Beta Polish

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Updated `PhotoAdvisorResultCardModel` so UI-facing advice remains bounded to at most two optional advice rows.
- Kept the display priority as mood headline, one visual reason, primary filter recommendation with reason, then optional advice.
- Prioritized crop/straighten advice before optional retake advice.
- Allowed non-retake keep-style copy to appear as a gentle secondary note when no higher-priority crop/retake item is present.
- Updated `PhotoAdvisorResultView` to render the bounded advice list instead of individually hardcoding two slots.
- Polished `PhotoAdvisorFilterRecommendationView` so long filter names/reasons wrap more safely and missing filters show a calm unavailable note instead of a disabled apply button.
- Updated README, iOS README, manual smoke tests, handoff, and phase log references.

### Captured / Imported / Fallback Behavior

- Captured Photo Advisor remains local/mock by default and may use safe local capture/image context.
- Imported Photo Advisor still must not claim capture-time motion, tilt, focus, lens, or exposure context.
- Fallback/provider-unavailable copy remains calm, local-safe, and free of raw provider/internal/debug details.

### Safety Notes

- iOS UI polish only.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, generated artifact commit, real-provider QA run, or production rollout was added.
- `productionReady` remains false.

### Verification

- `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed on 2026-06-14.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and card language scripts passed.
- `git diff --check` passed.
- Secret scan found documented placeholders / denylist references only; no real provider secrets were committed.
- iOS direct provider scan was clean.
- Camera cloud-entry scan was clean.
- Backend provider request payload and iOS upload payload boundary scan showed no changed payload paths.
- GPS / raw EXIF / raw sensor persistence scan on changed Swift files was clean.
- Artifact scan confirmed local env, provider QA reports, approved-real sample placeholders, local QA images, AppleDouble files, and generated/report folders remain ignored.
- Backend tests were not required because no backend source or package files changed.

### Ready to Commit Phase 18-C1

Yes.

---

## Phase 18-C0 - Post-capture Advisor Beta Hardening Plan

Status: Completed and committed as `eedb27d Phase 18-C0: plan post-capture advisor beta hardening`
Date: 2026-06-14

### Completed

- Added `docs/photo-advisor-beta-hardening-plan.md`.
- Defined beta hardening areas for captured Photo Advisor flow, imported Photo Advisor flow, fallback/provider-unavailable UX, local/mock advisor consistency, result-card readability, filter recommendation + reason quality, CreativeIntentGuard behavior, crop/straighten/retake restraint, multilingual QA, manual real-device QA, and regression scripts.
- Defined beta acceptance criteria requiring short mood-first useful copy, no score/rating wording, no sensitive inference, no harsh fix-it language, no retake-first behavior, no imported-photo capture-context overclaiming, calm app-safe fallback copy, internal/debug-only provider path, and `productionReady=false`.
- Added an internal QA scenario matrix covering captured bright scene, captured low light, intentional blur/motion, intentional tilt, grainy retro look, high contrast, faded color, imported limited context, provider unavailable fallback, unknown/unsupported filter fallback, and missing localization key fallback.
- Updated README, backend README, iOS README, manual smoke tests, handoff, and phase log references.

### Safety Notes

- Planning-only documentation phase.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- Real-provider QA was not run.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, generated artifact commit, or production rollout was added.
- `productionReady` remains false.

### Verification

- `git diff --check` passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and result-card language scripts passed.
- Synthetic provider QA mode passed.
- Provider QA gate summary helper passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Payload unchanged scans stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.
- Backend tests were not required because backend source/package files were not changed.
- Xcode build was not required because iOS source/project/localization files were not changed.

### Ready to Commit Phase 18-C0

Yes.

---

## Phase 18-B7 - Provider QA Chain Final Audit + Phase 18-C Readiness Gate

Status: Completed and upstream-synced
Date: 2026-06-14

### Completed

- Added `docs/photo-advisor-provider-qa-chain-readiness.md`.
- Audited B0-B6 consistency across provider language contract, regression fixtures, sanitized QA runner/reporting, dry-run safety gate, review thresholds, QA gate summary helper, and operator runbook.
- Confirmed docs, scripts, package commands, backend tests, manual smoke tests, phase log, and handoff align around the same internal/debug-only provider QA chain.
- Defined Phase 18-C readiness criteria: B0-B6 verification passes, backend tests pass, synthetic QA passes, dry-run gate passes, QA gate helper has no hard blockers, warnings are reviewed, `productionReady=false`, no real-provider QA required, no Camera cloud entry, no iOS provider key/direct call, no backend/iOS payload change, and no capture-context upload.
- Updated README, backend README, manual smoke tests, handoff, and phase log references.

### Phase 18-C Readiness Decision

Phase 18-C is safe to start after B7 only as Post-capture Advisor Beta Hardening / internal QA work.

Phase 18-C is not production rollout approval, not Camera cloud AI approval, not capture-context upload approval, and not backend/iOS payload-change approval.

### Safety Notes

- Documentation-only audit/readiness gate.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, real-provider QA run, or production rollout was added.
- `productionReady` remains false.

### Verification

- Backend tests passed.
- Synthetic provider QA mode passed.
- Dry-run gate passed.
- Provider QA gate summary helper passed with no hard blockers.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and result-card language scripts passed.
- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Payload unchanged scans stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.

### Commit Status Phase 18-B7

Upstream-synced according to the latest `@{u}` comparison.

---

## Phase 18-B6 - Provider QA Operator Runbook + Final Pre-Integration Checklist

Status: Completed and committed as `7ef61d3 Phase 18-B6: add provider QA operator runbook`
Date: 2026-06-14

### Completed

- Added `docs/photo-advisor-provider-qa-operator-runbook.md`.
- Documented pre-run safety checks for B0-B5 readiness, ignored local credentials, approved ignored samples, ignored reports, raw-artifact bans, and `productionReady=false`.
- Documented safe command order: synthetic QA, dry-run gate, QA gate summary helper, then optional real-provider QA only with explicit approval.
- Documented how to review `hardBlockers[]`, `warnings[]`, `statusCategories[]`, and `eligibleForDebugInternalReview`.
- Added stop-immediately conditions for raw artifact leakage, staged photos/reports, missing ignored credentials/samples, validation bypass, iOS provider key/direct call, Camera cloud entry, unapproved payload changes, and `productionReady=true`.
- Added the final pre-integration checklist before any future debug/internal remote advisor integration.
- Updated README, backend README, manual smoke tests, and handoff references.

### Safety Notes

- Documentation-only operator workflow.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, real-provider QA run, or production rollout was added.
- `productionReady` remains false.

### Verification

- `git diff --check` passed.
- Synthetic provider QA mode passed.
- Dry-run gate passed.
- Provider QA gate summary helper passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and result-card language scripts passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Payload unchanged scans stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.
- Backend/iOS tests were not required because runtime source files were not changed.

### Ready to Commit Phase 18-B6

Yes.

---

## Phase 18-B5 - Add Provider QA Gate Summary Helper

Status: Completed and committed as `6c814b1 Phase 18-B5: add provider QA gate summary helper`
Date: 2026-06-14

### Completed

- Added `backend/src/qa/photoAdvisorQAGate.mjs`.
- Added `backend/scripts/check-photo-advisor-provider-qa-gate.mjs`.
- Added `npm run qa:photo-advisor:review`.
- The helper reads sanitized QA report JSON and outputs `productionReady: false`, `eligibleForDebugInternalReview`, `statusCategories`, `hardBlockers`, `warnings`, and reviewed aggregate metrics.
- Mapped B4 thresholds into hard blockers for artifact leakage, unsafe report flags, provider integration issues, synthetic fixture failures, unsupported provider filters, and `productionReady=true`.
- Mapped provider QA warnings for invalid JSON/schema, high fallback count, timeouts, provider errors, overlong text, unsafe-response fallbacks, manual language review, repeated fallback categories, and p95/max latency thresholds.
- Added backend tests for synthetic-contract pass, unsafe report hard blockers, provider warning summaries, and script safety.
- Updated README, backend README, manual smoke tests, handoff, phase log, and threshold docs.

### Safety Notes

- The helper reads sanitized QA report JSON only.
- It does not print raw provider text, raw prompts, raw image/base64, request payloads, secrets, or real sample paths.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, or production rollout was added.
- `productionReady` remains false.

### Verification

- Backend tests passed.
- Synthetic provider QA mode passed.
- Dry-run gate passed.
- Provider QA gate summary helper passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and result-card language scripts passed.
- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Payload unchanged scans stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.

### Ready to Commit Phase 18-B5

Yes.

---

## Phase 18-B4 - Define Provider QA Review Thresholds

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `docs/photo-advisor-provider-qa-review-thresholds.md`.
- Defined QA status categories: `pass_for_synthetic_contract`, `needs_review`, `blocked_for_safety`, `blocked_for_schema`, `blocked_for_filter_integrity`, `blocked_for_language_contract`, `blocked_for_artifact_leakage`, `blocked_for_provider_integration`, and `not_production_ready`.
- Defined hard blockers for raw artifact leakage, real photos/reports staged or committed, GPS/raw EXIF persistence, unsupported filter acceptance, score/rating/sensitive inference/chain-of-thought/provider leakage, raw localization keys, raw filter-family IDs, iOS provider keys/direct calls, Camera cloud entry, unapproved backend/iOS payload changes, capture-context upload, and `productionReady=true`.
- Defined warning thresholds for invalid JSON/schema counts above 0, unexpectedly high fallback count, timeout/provider error count above 0, overlong text count above 0, repeated fallback by scenario group, high p95/max latency, locale mismatch, and manual language/filter-fit concerns.
- Defined synthetic-contract QA acceptance rules and optional real-provider QA acceptance rules.
- Updated README, backend README, manual smoke tests, handoff, and phase log references.

### Safety Notes

- Documentation-only threshold policy.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, or production rollout was added.
- `productionReady` remains false.

### Verification

- `git diff --check` passed.
- Synthetic provider QA mode passed.
- Dry-run gate passed.
- Photo Advisor copy regression, filter reason coverage, CreativeIntent language, and result-card language scripts passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Payload unchanged scans stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.
- Backend/iOS tests were not required because no source files changed.

### Ready to Commit Phase 18-B4

Yes.

---

## Phase 18 Handoff Refresh

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Updated `docs/handoff/codex-transition-handoff.md` with the latest Phase 18 handoff state.
- Recorded that Phase 18-A0 through Phase 18-A5, Phase 18-B0, and Phase 18-B1 are completed and pushed.
- Recorded that Phase 18-B2 and Phase 18-B3 are upstream-synced / pushed according to the latest upstream comparison.
- Recorded that Phase 18-B4-pre is completed and locally committed as `a9b386b hase 18-B4-pre: consolidate Codex project rules`, but not pushed at the time of refresh.
- Documented that `origin/main` may not exist in this clone and future status checks should use `@{u}`.
- Reconfirmed that future prompts should reference `AGENTS.md` to reduce repeated long-form rules.
- Reconfirmed the next planned phase: Phase 18-B4 - define provider QA review thresholds.
- Added the longer-term LocalAIAnalysisReport / live viewfinder local AI / Core ML or fine-tuned own model direction, gated behind foundation, schema, QA, privacy, and performance readiness.

### Safety Notes

- Documentation-only handoff refresh.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, or production rollout was added.

### Verification

- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan stayed clean.
- Camera cloud entry scan stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.
- Backend/iOS tests were not required because no source files changed.

### Ready to Commit Phase 18 Handoff Refresh

Yes.

---

## Phase 18-B4-pre - Consolidate Codex Project Rules

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Updated `AGENTS.md` as the reusable repo-level project rules file for future Codex phases.
- Consolidated long-term restrictions for iOS provider keys, direct provider calls, Camera cloud AI entry, capture-context upload, backend/iOS payload changes, provider QA artifacts, logging, GPS/raw EXIF/sensor persistence, sensitive inference, and `productionReady=false`.
- Consolidated Photo Advisor language rules: Observation -> Mood -> Retro intent -> Optional action, never Score -> Problem -> Fix -> Retake.
- Added required closeout sections for future Codex final responses, including `?????/ What changed` and `Xcode ??˜ï??????™è???? / What to check in Xcode`.
- Updated README and handoff references so future prompts can point to `AGENTS.md` instead of repeating all long-term project rules.

### Safety Notes

- Documentation/instruction work only.
- App behavior is unchanged.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, direct provider call, Camera cloud AI entry, cloud functionality, GPS/location collection, raw EXIF dump, raw sensor persistence, or production rollout was added.

### Verification

- `git diff --check` passed.
- Secret scan passed.
- iOS direct provider scan did not find new provider URLs/keys in app source.
- Camera cloud entry scan stayed clean.
- Artifact scan confirmed local env, reports, local images, and generated artifacts remain ignored.
- Backend/iOS tests were not required because no source files changed.

### Ready to Commit Phase 18-B4-pre

Yes.

---

## Phase 18-B3 - Internal Real Provider QA Dry Run Gate

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added `docs/photo-advisor-provider-qa-dry-run-gate.md` as the internal operator gate for real-provider Photo Advisor QA.
- Added `--check-safety-gate` / `--dry-run-gate` support to `backend/scripts/run-photo-advisor-provider-qa.mjs`.
- Added explicit `--run-provider` opt-in for real-provider QA; provider mode now fails closed without it and sends no provider request.
- Made `npm run qa:photo-advisor` safe-by-default by running synthetic-contract QA.
- Added `npm run qa:photo-advisor:gate` for the sanitized dry-run gate.
- Added `npm run qa:photo-advisor:provider` for the explicit real-provider path.
- Updated backend/local image sample docs so real-provider image-set commands include `--run-provider`.
- Updated provider contract docs, backend README, root README, iOS README, manual smoke tests, phase log, and handoff notes.
- Added backend test coverage for the B3 runner guardrails.

### Safety Notes

- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, raw provider output display, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Generated provider QA reports remain ignored under `backend/reports/provider-qa/`.
- Real photos, approved sample photos, local QA reports, screenshots, recordings, generated images, and device-specific artifacts remain uncommitted.
- `productionReady` remains false.

### Verification

- Backend tests, synthetic-contract QA, dry-run gate, copy/language scripts, and safety scans were run during implementation.
- Additional verification is recorded in the final Codex response for this phase.

### Ready to Commit Phase 18-B3

Yes.

---

## Phase 18-B2 - Real Provider QA Runner Contract Alignment

Status: Completed and ready to commit
Date: 2026-06-14

### Completed

- Added explicit `--synthetic-contract` / `--mode=synthetic` support to `backend/scripts/run-photo-advisor-provider-qa.mjs`.
- Synthetic-contract QA uses the committed B1 provider regression fixtures and requires no API key, network, real photo, prompt with image data, or raw provider response.
- Real-provider QA remains explicit internal/debug-only and still requires local QweAPI config, server-side secret, and internal guard headers.
- Expanded sanitized QA reports with `runMode`, `providerConfigured`, safe provider / model buckets, `successCount`, `validationFailureCount`, invalid JSON / invalid schema / unsupported filter / overlong text / unsafe / timeout / provider-error counters, contract-check flags, and redaction booleans.
- Kept `productionReady: false` in generated QA reports.
- Hardened QA report redaction checks for raw prompt, request payload, raw provider response, raw unsafe text, Authorization headers, API keys, GPS, raw EXIF, and stack-trace artifacts.
- Added backend tests for B2 report fields, validation-category counters, redaction failure behavior, and synthetic-contract runner support.
- Updated backend README, iOS README, provider language contract, manual smoke tests, phase log, and handoff docs.

### Safety Notes

- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, raw provider output display, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Generated provider QA reports remain ignored under `backend/reports/provider-qa/`.
- Real photos, approved sample photos, local QA reports, screenshots, recordings, generated images, and device-specific artifacts remain uncommitted.

### Verification

- Backend tests and B2 synthetic-contract QA were run during implementation.
- Additional verification is recorded in the final Codex response for this phase.

### Ready to Commit Phase 18-B2

Yes.

---

## Phase 18-B1 - Provider Contract Regression Fixtures + Fallback Parity

Status: Completed and ready to commit
Date: 2026-06-13

### Completed

- Added `backend/tests/fixtures/provider-contract-regression-cases.json` with committed-safe synthetic provider response cases.
- Added valid provider output fixtures for low light / night grain, warm indoor light, cool quiet tone, soft focus, slight tilt / snapshot, high contrast / street, faded color, and imported limited-context scenarios.
- Added parser rejection fixtures for invalid JSON and markdown prose instead of structured JSON.
- Added validator rejection fixtures for missing required fields, unsupported filter IDs, overlong summary / filter reason text, score/rating wording, harsh fix-it / retake-first wording, sensitive inference, chain-of-thought, provider/debug leakage, raw stack-trace-style text, unknown mode / missing locale, generic filter reason, raw localization key, and raw filter-family id in displayable text.
- Added provider failure fixtures for provider unavailable and timeout / network fallback mapping.
- Extended backend tests so valid fixtures pass, invalid fixtures fail with expected codes, rejected provider output maps to structured fallback without raw provider text, and fallback responses remain `CloudAIResponse`-valid.
- Refined the backend safe-text guard so app-language leakage checks scan displayable text only, avoiding false positives on internal enum fields such as `filterId`.
- Added backend response validation that requires non-empty response locale.
- Updated provider language contract documentation with a Phase 18-B1 regression fixture matrix and fallback parity requirements.
- Updated README, iOS README, backend README, handoff, and manual smoke tests.

### Safety Notes

- Synthetic JSON / text fixtures only; no real photos, provider reports, screenshots, generated QA images, local QA reports, or device artifacts were added.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, raw provider output display, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Invalid, unsafe, overlong, generic, or provider-leaking output is rejected or mapped to safe structured fallback before iOS can display it.
- Sensitive inference remains forbidden; backend guard rejects face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- Backend tests passed with bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs` reported 46/46 passing.
- Additional verification is recorded in the final Codex response for this phase.

### Ready to Commit Phase 18-B1

Yes.

---

## Phase 18-B0 - Real AI Provider Language Contract + Schema Alignment Audit

Status: Completed and locally committed; push blocked by GitHub HTTPS credential error
Date: 2026-06-13

### Completed

- Added `docs/photo-advisor-provider-language-contract.md` to define the backend-mediated real AI Photo Advisor provider voice contract.
- Audited `CloudAIResponse` v1 against the Phase 18-A4 `PhotoAdvisorResultCardModel` display needs.
- Documented current direct mappings, partial mappings, and future-only fields such as `moodHeadline`, `visualObservations`, `creativeIntentNotes`, and `straightenAdvice`.
- Updated the backend Photo Advisor provider prompt to explicitly require Observation -> Mood -> Retro intent -> Optional action.
- Updated the backend prompt to forbid Score -> Problem -> Fix -> Retake, harsh correction wording, generic AI filler, score/rating language, provider/system/debug details, and chain-of-thought.
- Updated the backend prompt to require short filter reasons that connect a safe photo signal to a retro aesthetic result.
- Updated the backend prompt to preserve creative intent for blur, tilt, low light, grain, soft focus, high contrast, faded color, unusual framing, underexposure, and overexposure.
- Extended backend safe text validation to reject score/rating wording, harsh fix-it / retake-first wording, provider/debug leakage, and chain-of-thought wording.
- Added backend response validation for overlong recommended filter reasons.
- Added backend tests for score/fix-it guard behavior, provider/chain-of-thought leakage, overlong filter reasons, and prompt contract wording.
- Updated README, iOS README, backend README, handoff, A0 audit notes, A5 copy regression matrix bridge note, and manual smoke tests.

### Safety Notes

- Provider language contract / schema alignment audit only.
- Backend request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, raw provider output display, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Production UI remains governed by the Phase 18-A4 result card model and does not display raw JSON, provider/source labels, raw provider errors, raw localization keys, raw capture context, raw EXIF, numeric confidence, score/rating, or internal classification names.
- Sensitive inference remains forbidden; provider contract and backend guards reject face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- Backend tests passed with bundled Node: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs` reported 40/40 passing.
- `scripts/validate-photo-advisor-card-language.sh` passed.
- `scripts/validate-creative-intent-language.sh` passed.
- `scripts/validate-photo-advisor-filter-reasons.sh` passed.
- `scripts/validate-photo-advisor-copy-regression.sh` passed.
- `plutil -lint` passed for English and Traditional Chinese localization files.
- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- iOS provider key / direct provider URL scan passed; no QweAPI / Intenext / Code0 / Gemini / OpenAI key, URL, or SDK import was found in iOS source.
- Visible Camera UI cloud-entry scan passed for the Camera feature directory.
- Backend request payload unchanged scan passed; `photo-advisor-request.v1.schema.json`, backend route shape, and `validatePhotoAdvisorRequest.mjs` were not changed.
- iOS upload payload unchanged scan passed; no `ios-app/AIPhotoApp/Services/CloudAI` files were changed.
- Payload logging scan passed; no request body / base64 / raw image / provider raw response logging was added.
- GPS/location, raw EXIF, raw sensor persistence/logging scans found no runtime source additions. Documentation matches are safety-boundary statements only.
- Unsafe phrase / score / fix-it / sensitive-inference scan over changed runtime files found only prompt prohibitions, backend denylist guard entries, and tests that verify blocking / redaction; no user-visible app UI/localization copy was changed.
- Artifact scan found no accidental photos, screenshots, recordings, generated QA reports, local images, approved real samples, or device-specific artifacts.
- Secrets / config scans found no committed real secrets; existing placeholder/docs references remain expected.

### Ready to Commit Phase 18-B0

Yes locally; remote push is pending GitHub HTTPS credential repair.

---

## Phase 18-A5 - Multilingual Advisor Copy QA + Regression Kit

Status: Completed and locally committed; push blocked by GitHub HTTPS credential error
Date: 2026-06-13

### Completed

- Added `docs/photo-advisor-copy-regression-matrix.md` with 30 captured / imported / fallback / safety scenarios.
- Added language QA notes for English, Traditional Chinese, Cantonese-style Traditional Chinese, and Simplified Chinese variants already represented in the localization files.
- Added UI copy length and card-readiness guidelines for mood headline, visual reason, filter reason, optional refinement, retake, and fallback copy.
- Added captured-vs-imported regression rules so imported photos do not overclaim capture-time motion / tilt / focus / lens / exposure context.
- Added CreativeIntentGuard regression rules for blur, motion, low light, tilt, grain, soft focus, exposure extremes, high contrast, faded color, and unusual framing.
- Added filter reason regression rules for current filter catalog coverage, family reason coverage, unknown filter fallback, and no raw family IDs in production UI.
- Added a commit-safe manual review template that excludes raw photos, raw EXIF, raw sensor values, provider responses, and device-specific artifacts.
- Added `scripts/validate-photo-advisor-copy-regression.sh` as a wrapper over the A2/A3/A4 validators plus UI-facing raw-key / provider-debug / score / generic-filter / fix-it / sensitive-inference scans.
- Updated README, iOS README, backend README, handoff, manual smoke tests, and the Phase 18-A0 audit implementation notes.

### Safety Notes

- App-side local/mock advisor QA, documentation, and script work only.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- Capture context, QA scenario metadata, copy regression notes, creative-intent classifications, and filter reason metadata are not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, score/rating UI, raw provider output, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- QA explicitly checks that production UI does not display raw JSON, provider/source labels, raw provider errors, raw localization keys, raw capture context, raw EXIF, numeric confidence, score/rating, internal classification names, or identity-adjacent wording.
- Retake advice remains conservative, optional, and lower priority than mood / filter / style preservation.
- Sensitive inference remains forbidden; copy avoids face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- `scripts/validate-photo-advisor-copy-regression.sh` passed, including the Phase 18-A2 filter reason validator, Phase 18-A3 CreativeIntent language validator, and Phase 18-A4 card language validator.
- `plutil -lint` passed for English and Traditional Chinese localization files.
- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- Xcode project inspection found only the `AIPhotoApp` app target / scheme and no XCTest target to run.
- Backend tests were not run because Phase 18-A5 changes only backend documentation under `backend/README.md`; no backend source, package, route, prompt, validator, or provider payload file changed.
- iOS provider key / direct provider URL scan passed. Matches were limited to existing local-only Firebase service filenames, not QweAPI / Intenext / Code0 / Gemini / OpenAI keys, URLs, or SDK imports.
- Visible Camera UI cloud-entry scan passed for the Camera feature directory.
- Backend payload unchanged scan passed; only `backend/README.md` changed under `backend/`.
- GPS/location, raw EXIF, raw sensor persistence/logging scans found no Phase 18-A5 runtime source changes. Documentation matches are safety-boundary statements only.
- Unsafe phrase / score / fix-it / sensitive-inference scan over changed runtime files found no changed Swift or localization files in Phase 18-A5; the copy regression wrapper also scans UI-facing advisor Swift/localization and passed.
- Artifact scan found no accidental photos, screenshots, recordings, generated QA reports, local images, approved real samples, or device-specific artifacts.
- Secrets / config scans found no committed real secrets; matches are limited to placeholder `.env.example` files and existing documentation / test safety text.

### Ready to Commit Phase 18-A5

Yes locally; remote push is pending GitHub HTTPS credential repair.

---

## Phase 18-A4 - UI Result Card Language Model

Status: Completed and locally committed; push blocked by GitHub HTTPS credential error
Date: 2026-06-13

### Completed

- Added `PhotoAdvisorResultCardModel` as a UI-facing display model for local/mock Photo Advisor results.
- Consolidated Phase 18-A1 language pack, Phase 18-A2 filter reason library, and Phase 18-A3 CreativeIntentGuard rules into result-card display priority.
- Updated `PhotoAdvisorResultView` to show a mood headline, one short visual reason, one primary filter recommendation with a reason, one optional refinement, and optional crop / straighten / retake only when appropriate.
- Removed production result-card provider/source label display.
- Added calm fallback context display for imported photos and fallback results without raw provider/system details.
- Added `photo_advisor.section.filter_note`, `photo_advisor.section.optional_refinement`, and `photo_advisor.section.optional_retake` localization keys.
- Added `scripts/validate-photo-advisor-card-language.sh` to check card model usage, card localization keys, and source-label hiding.
- Updated README, iOS README, backend README, handoff, manual smoke tests, and the Phase 18-A0 audit implementation notes.

### Safety Notes

- App-side local/mock advisor UI language work only.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- Capture context, result-card display priority, creative-intent classifications, and filter reason metadata are not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, score/rating UI, raw provider output, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Production UI does not display raw JSON, provider/source labels, raw provider errors, raw localization keys, raw capture context, raw EXIF, numeric confidence, score/rating, or internal classification names.
- Retake advice remains conservative, optional, and lower priority than mood / filter / style preservation.
- Sensitive inference remains forbidden; copy avoids face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- `scripts/validate-photo-advisor-card-language.sh` passed.
- `scripts/validate-creative-intent-language.sh` passed.
- `scripts/validate-photo-advisor-filter-reasons.sh` passed.
- `plutil -lint` passed for English and Traditional Chinese localization files.
- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- Xcode project inspection found only the `AIPhotoApp` app target / scheme and no XCTest target to run.
- iOS Swift provider key / direct provider URL / provider SDK import scan passed.
- Visible Camera UI cloud-entry scan passed for `CameraView`, `CameraControlOverlayView`, and `LiveGuidanceOverlayView`.
- Backend source / package payload scan passed; only `backend/README.md` changed under `backend/`.
- GPS/location, raw EXIF, raw sensor persistence/logging scans across changed Swift files passed.
- Precise changed UI sensitive / score / fix-it wording scan passed.
- Git status artifact scan found no accidental photos, reports, generated QA images, local images, or device QA artifacts.

### Ready to Commit Phase 18-A4

Yes locally; remote push is pending GitHub HTTPS credential repair.

---

## Phase 18-A3 - CreativeIntentGuard Language Rules + Retake Restraint Polish

Status: Completed and locally committed; push blocked by GitHub HTTPS credential error
Date: 2026-06-13

### Completed

- Added `CreativeIntentClassification` with `style_positive`, `acceptable_imperfection`, `technical_risk`, and `unknown`.
- Added `CreativeIntentSignal` for blur, motion, low light, tilt, grain, soft focus, overexposure, underexposure, high contrast, faded color, unusual framing, clutter, and crop risk.
- Added `CreativeIntentLanguageRules` to centralize classification, advice mode mapping, primary signal selection, and optional retake gating.
- Updated `CreativeIntentGuard` to emit typed signal/classification metadata from bucketed local capture context and local image signals.
- Updated local/mock `PhotoAdvisorHeuristicResolver` to choose the primary intent signal through the centralized rules and to reserve retake-style advice for likely severe technical risk only.
- Added `advisor.intent.signal.*` and `advisor.action.retake.technical_risk.*` localization keys for English, Traditional Chinese, Simplified Chinese, Cantonese conversational, and non-explicit Cantonese troublemaker variants in the existing localization files.
- Added `scripts/validate-creative-intent-language.sh` to check all CreativeIntentGuard signal keys and block obvious score / fix-it wording.
- Updated README, iOS README, backend README, handoff, manual smoke tests, and the Phase 18-A0 audit implementation notes.

### Safety Notes

- App-side local/mock advisor language work only.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- Capture context, creative-intent classifications, and filter reason metadata are not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, score/rating UI, raw provider output, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Blur, motion, tilt, low light, grain, soft focus, overexposure, underexposure, high contrast, faded color, and unusual framing remain possible retro creative style choices.
- Retake advice is conservative, optional, and only gated by likely severe technical risk; if the app cannot confidently infer severe risk, it preserves style first.
- Sensitive inference remains forbidden; copy avoids face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- `scripts/validate-creative-intent-language.sh` passed.
- `scripts/validate-photo-advisor-filter-reasons.sh` passed.
- `plutil -lint` passed for English and Traditional Chinese localization files.
- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- Xcode project inspection found only the `AIPhotoApp` app target / scheme and no XCTest target to run.
- iOS Swift provider key / direct provider URL scan passed; provider mentions are limited to existing docs, placeholder strings, and backend-only config.
- Visible Camera UI cloud-entry scan passed for `CameraView`, `CameraControlOverlayView`, and `LiveGuidanceOverlayView`.
- Backend source / package payload scan passed; only `backend/README.md` changed under `backend/`.
- GPS/location, raw EXIF, raw sensor persistence/logging scans across changed Swift files passed.
- Git status artifact scan found no accidental photos, reports, generated QA images, local images, or device QA artifacts.

### Ready to Commit Phase 18-A3

Yes locally; remote push is pending GitHub HTTPS credential repair.

---

## Phase 18-A2 - Filter Recommendation Reason Library

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added `PhotoAdvisorFilterReasonLibrary` with typed filter language families, signal buckets, and per-filter reason profiles.
- Mapped all 24 current `FilterPresetCatalog` IDs, including `original`, research presets, Phase 13 presets, and legacy starter filters.
- Added filter families: warm film, faded pastel, cinematic contrast, night grain, soft dream, street chrome, amber glow, cool fade, and classic film.
- Updated `PhotoAdvisorLanguagePack.filterReasonKey` so local/mock Photo Advisor recommendations resolve through the new reason library.
- Added localized `advisor.filter.family.*` and `advisor.filter.reason.<family>.*` keys for English, Traditional Chinese, Simplified Chinese, Cantonese conversational, and non-explicit Cantonese troublemaker variants in the existing localization files.
- Added `scripts/validate-photo-advisor-filter-reasons.sh` to check filter catalog/profile coverage, localized family/reason key coverage, and obvious generic / score / fix-it wording.
- Updated README, iOS README, backend README, handoff, manual smoke tests, and the Phase 18-A0 audit implementation notes.

### Safety Notes

- App-side local/mock advisor language work only.
- Filter rendering behavior is unchanged.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- Capture context and filter reason metadata are not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, score/rating UI, raw provider output, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Filter reasons use filter family + safe photo signal + retro aesthetic result, and avoid treating blur, grain, low light, tilt, faded color, or high contrast as automatic mistakes.
- Sensitive inference remains forbidden; copy avoids face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- `scripts/validate-photo-advisor-filter-reasons.sh` passed.
- `git diff --check` passed.
- `plutil -lint` passed for English and Traditional Chinese `Localizable.strings`.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- No iOS XCTest target exists in this repo structure, so no iOS unit tests were run.
- Backend source / package files were not changed; backend provider payloads remain unchanged, so backend tests were not required for this phase.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the app source diff.
- Camera cloud-entry scan found no new Camera UI entry; existing Phase 16 cloud snapshot boundary files remain present but no Camera UI entry was added by this phase.
- GPS/location/raw EXIF/sensor scan found no CoreLocation, GPS collection, raw EXIF dump, raw image / base64 logging, raw sensor stream logging, sensor persistence, or new settings persistence in the changed app source.
- Unsafe phrase scan found no banned phrase, score / rating UI, raw provider output, chain-of-thought display, "bad photo", "wrong exposure", "failed photo", "must fix", "retake it", "retake required", face recognition, identity recognition, attractiveness score, body shaming, or skin-quality wording in the app Photo Advisor source / localization surface.
- Backend upload payload unchanged scan found no backend source / package / CloudAI service changes.
- Ignored `.env`, local synthetic QA images, approved real sample folders, generated provider QA reports, local manual QA result paths, and media artifacts remain unstaged.

### Ready to Commit Phase 18-A2

Yes, after verification and user review.

---

## Phase 18-A1 - Photo Advisor Language Pack Implementation

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added `PhotoAdvisorLanguagePack` as a small app-side resolver for `advisor.*` localization keys.
- Added language-pack key namespaces for mood, light, blur, motion, tilt, grain, contrast, color, framing, crop, straighten, optional retake, keep-style intent, imported-photo fallback, local-only fallback, provider-unavailable fallback, safety blocked copy, and filter recommendation reasons.
- Added English, Traditional Chinese, Simplified Chinese, Cantonese conversational, and non-explicit Cantonese troublemaker variants in the existing English and Traditional Chinese localization files.
- Updated `PhotoAdvisorCopyResolver` to preserve `advisor.*` keys and to avoid overwriting local language-pack summary / suggestion / filter reason keys.
- Updated the local/mock `PhotoAdvisorHeuristicResolver` to map capture context and CreativeIntentGuard signals into Observation -> Mood -> Retro intent -> Optional action wording.
- Added imported-photo-specific local context copy so imported photos do not imply capture-only context.
- Kept retake language conservative and optional; blur, tilt, low light, grain, high contrast, faded color, soft focus, motion, and unusual framing remain possible retro style choices.
- Updated README, iOS README, backend README, phase log, handoff, manual smoke tests, and the 18-A0 audit with implementation notes.

### Safety Notes

- App-side language and local/mock advisor integration only.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- Capture context is still not uploaded.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw sensor persistence, score/rating UI, raw provider output, chain-of-thought display, StoreKit, export, Gemini Live, WebSocket, or AI Filter Generator backend was added.
- Advisor language follows Observation -> Mood -> Retro intent -> Optional action, not Score -> Problem -> Fix -> Retake.
- Sensitive inference remains forbidden; copy avoids face, skin, age, gender, attractiveness / beauty, emotion / mental state, health, identity, ethnicity, religion, disability, and body judgment.

### Verification

- `git diff --check` passed.
- `plutil -lint` passed for English and Traditional Chinese `Localizable.strings`.
- Advisor language-pack key coverage check passed for all generated `advisor.*` keys in both supported localization files.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- No iOS XCTest target exists in this repo structure, so no iOS unit tests were run.
- Backend source / package files were not changed; backend provider payloads remain unchanged, so backend tests were not required for this phase.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the app source diff.
- Camera cloud-entry scan found no new Camera UI entry; existing Phase 16 cloud snapshot boundary files remain present but no Camera UI entry was added by this phase.
- GPS/location/raw EXIF/sensor scan found no CoreLocation, GPS collection, raw EXIF dump, raw image / base64 logging, raw sensor stream logging, sensor persistence, or new settings persistence in the app source diff.
- Unsafe phrase scan found no banned phrase, explicit profanity, score / rating UI, raw provider output, chain-of-thought display, "bad photo", "wrong exposure", "failed photo", "must fix", "retake it", "retake required", face recognition, identity recognition, attractiveness score, body shaming, or skin-quality wording in the app Photo Advisor source / localization surface.
- Backend upload payload unchanged scan found no backend source / package / function changes.
- Ignored `.env`, local synthetic QA images, approved real sample folders, generated provider QA reports, local manual QA result paths, and media artifacts remain unstaged.

### Ready to Commit Phase 18-A1

Yes, after user review. Codex has not committed or pushed Phase 18-A1.

---

## Phase 18-A0 - Photo Advisor App Language + Capability Audit

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added `docs/ai-photo-advisor-language-audit.md`.
- Audited current Photo Advisor coverage for captured / imported flows, mood, composition, lighting, crop, filters, retake advice, creative intent, capture context, local image signals, fallback, multilingual support, DEBUG preview, and safety.
- Inventoried current English, Traditional Chinese, Simplified Chinese, and Cantonese Photo Advisor language.
- Identified language gaps: generic base copy, short filter reasons, limited imported-photo-specific wording, uneven Cantonese / Simplified review status, and production-facing mock label cleanup.
- Defined recommended app voice: warm, practical, retro-camera-aware, concise, non-judgmental, not a score system, and not generic AI.
- Defined future real AI language contract for capture context and provider prompts.
- Recommended next phases: 18-A1 language pack, 18-A2 filter reason library, 18-A3 capture context cloud schema boundary, and 18-B provider prompt alignment.
- Updated README, iOS README, backend README, phase log, handoff, and manual smoke tests.

### Safety Notes

- Documentation-only; no Swift source, localization strings, backend source, provider config, request payload, runtime behavior, or production flag was changed.
- Capture context is still not uploaded.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw photo persistence, continuous sensor stream persistence, raw sensor stream logging, Gemini Live, WebSocket, StoreKit, or export behavior was added.

### Verification

- `git diff --check` passed.
- Xcode build was not required because Phase 18-A0 changed documentation only; no Swift source, Xcode project, resources, or localization files were changed.
- Backend tests were not required because backend source / package files were not changed.
- Backend upload payload unchanged scan found no backend source / package / function changes.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the app source diff.
- Camera cloud-entry scan found no Camera AI Snapshot / Quick Advice / Cloud AI entry in the app source diff.
- GPS/location/raw EXIF/sensor scan found no runtime additions; documentation-only matches explicitly state that GPS/location, raw EXIF, capture-context upload, and sensor persistence remain out of scope.
- Unsafe phrase scan found no banned phrase, explicit profanity, face recognition, identity recognition, attractiveness score, body shaming, skin wording, "bad photo", "wrong exposure", "retake it", "retake required", "failed", or "poor" copy in changed app/runtime files. The audit document contains some prohibited phrases only as explicit "avoid" examples.
- Ignored `.env`, local synthetic QA images, approved real sample folders, generated provider QA reports, and local manual QA result paths remain untracked / ignored.

### Ready to Commit Phase 18-A0

Yes, after final verification and user review. Codex has not committed or pushed.

---

## Phase 17D-D - Real-device Manual QA Kit + Capture Intelligence Tuning

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added a commit-safe real-device QA template at `tests/manual/capture-intelligence-real-device-qa-template.md`.
- Expanded manual smoke tests with real-device Camera lifecycle, capture scenario, Photo Advisor, DEBUG preview, and safety-boundary checks.
- Added ignored local QA artifact paths for filled manual results and Xcode result bundles.
- Tuned the bright / overexposed local mock Photo Advisor fixture so it no longer marks the scene as an automatic retake.
- Reviewed level, motion, light / exposure, blur hint, and creative-intent buckets; no threshold changes were made because the existing buckets are conservative and real-device results are needed before numeric tuning.
- Preserved DEBUG capture context preview as bucket-only and non-production.
- Updated README, iOS README, backend README, phase log, handoff, and manual smoke tests.

### Safety Notes

- Local-only QA / tuning phase; no capture context or local image intelligence signals are uploaded.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw photo persistence, continuous sensor stream persistence, raw sensor stream logging, Gemini Live, WebSocket, StoreKit, or export behavior was added.
- Real-device QA photos, filled reports, generated QA images, `.xcresult` bundles, and device-specific debug artifacts must remain local / ignored unless a future safe-asset policy explicitly approves committing sanitized artifacts.
- Capture intelligence remains context, not a score system; CreativeIntentGuard still prevents lazy fix-it / retake advice.

### Verification

- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed. The build still reports the existing unrelated Swift 6 warning in `LocalRuleBasedGuidanceProvider.swift` about `CameraCoachToneSettingsStore.shared`.
- No iOS XCTest target exists in this repo structure, so no iOS unit tests were run.
- Backend source / package files were not changed; backend provider payloads remain unchanged, so backend tests were not required for this phase.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the app source diff.
- Camera cloud-entry scan found no Camera AI Snapshot / Quick Advice / Cloud AI entry in the app source diff.
- GPS/location/raw EXIF/continuous sensor scan found no CoreLocation, GPS collection, raw EXIF dump, raw image / base64 logging, raw sensor stream logging, sensor persistence, or new settings persistence in the app source diff.
- Unsafe phrase scan found no banned phrase, explicit profanity, face recognition, identity recognition, attractiveness score, body shaming, skin wording, "bad photo", "wrong exposure", "retake it", "retake required", "failed", or "poor" copy in the updated app surface.
- DEBUG preview guard scan found no raw sensor values added; the preview remains bucket-only from prior phases.
- Backend upload payload unchanged scan found no backend source / package / function changes.
- Ignored `.env`, local synthetic QA images, approved real sample folders, generated provider QA reports, and local manual QA result paths remain untracked / ignored.

### Ready to Commit Phase 17D-D

Yes, after final verification and user review. Codex has not committed or pushed.

---

## Phase 17D-C - Capture Intelligence Real-device QA + Stability Polish

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added Camera scene-phase handling so background / inactive states cancel capture countdowns, stop Camera, and clear the local motion monitor.
- Added foreground resume behavior that restarts Camera / motion monitoring only when the active capture flow is visible and no selected photo is open.
- Hardened permission-denied, restricted, unavailable, selected-photo, import, and Camera configuration-failure paths so motion monitoring stops or stays unavailable safely.
- Hardened `CameraCaptureDeviceSignalMonitor` with stale-snapshot rejection and unavailable fallback when device motion is unavailable.
- Kept CoreMotion sampling short-window and in-memory only; samples are cleared on stop and are not logged or persisted.
- Hardened `LocalImageSignalAnalyzer` with small-image / invalid-value guards that return unknown buckets instead of guessing.
- Polished DEBUG capture context preview labels so Light maps to low / balanced / bright / unknown bucket wording.
- Preserved intent-aware Photo Advisor behavior from 17D-B; no lazy retake / fix-it advice was introduced.
- Updated README, iOS README, backend README, phase log, handoff, and manual smoke tests.

### Safety Notes

- Local-only; no capture context or image intelligence signals are uploaded to the backend in this phase.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw photo persistence, continuous sensor stream persistence, raw sensor stream logging, Gemini Live, WebSocket, StoreKit, or export behavior was added.
- DEBUG preview is bucket-only and guarded by `#if DEBUG`; production UI does not expose raw sensor values, raw EXIF, raw JSON, provider errors, or raw localization keys.
- Capture intelligence remains context, not a score system.

### Verification

- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed. The build still reports the existing unrelated Swift 6 warning in `LocalRuleBasedGuidanceProvider.swift` about `CameraCoachToneSettingsStore.shared`.
- No iOS XCTest target exists in this repo structure, so no iOS unit tests were run.
- Backend source / package files were not changed; backend provider payloads remain unchanged, so backend tests were not required for this phase.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the app source diff.
- Camera cloud-entry scan found no Camera AI Snapshot / Quick Advice / Cloud AI entry in Camera UI files.
- GPS/location/raw EXIF/continuous sensor scan found no CoreLocation, GPS collection, raw EXIF dump, raw image / base64 logging, raw sensor stream logging, sensor persistence, or new settings persistence in the app source diff.
- Unsafe phrase scan found no banned phrase, explicit profanity, face recognition, identity recognition, attractiveness score, body shaming, skin wording, "bad photo", "wrong exposure", or default "retake it" copy in the updated app surface.
- Raw sensor production UI scan found the DEBUG preview remains wrapped in `#if DEBUG` and displays bucket labels only.
- Ignored `.env`, local synthetic QA images, approved real sample folders, and generated provider QA reports remain untracked.

### Ready to Commit Phase 17D-C

Yes, after final verification and user review. Codex has not committed or pushed.

---

## Phase 17D-B - Local Capture Intelligence Pack

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Extended `CameraCaptureContext` with safer bucketed / rounded local intelligence fields for level, motion, exposure, focus, lens, selected / preview filter context, local image signals, and creative intent advice mode.
- Added a short-window in-memory `CameraCaptureDeviceSignalMonitor` for local level / motion snapshots at capture time.
- Added a lightweight local image signal analyzer for brightness, contrast, saturation, warmth, blur hint, and clutter hint buckets.
- Wired capture and import flows so captured photos receive level / motion / image buckets and imported photos receive local image buckets while capture-only fields remain unavailable / unknown.
- Strengthened `CreativeIntentGuard` to combine capture context, selected filters, and local image signals for low-light mood, motion blur, tilt, retro grain, high contrast, faded color, soft focus, and unusual framing.
- Updated mock/local Photo Advisor heuristic behavior so it preserves creative intent and uses optional refinement wording instead of default retake / fix-it advice.
- Added a compact DEBUG-only capture context bucket preview in Photo Advisor; production UI remains free of raw sensor values, raw EXIF, raw JSON, or continuous motion streams.
- Added localization for the faded-color intent-aware advisory copy.
- Updated README, iOS README, backend README, phase log, handoff, and manual smoke tests.

### Safety Notes

- Local-only; no capture context or image intelligence signals are uploaded to the backend in this phase.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- No provider key, provider SDK, direct provider call, Camera cloud AI entry, production remote rollout, GPS/location collection, raw EXIF dump, raw photo persistence, continuous sensor stream persistence, raw sensor stream logging, Gemini Live, WebSocket, StoreKit, or export behavior was added.
- Capture context is not a score system; advisor copy treats blur, tilt, low light, grain, over/underexposure, faded color, high contrast, soft focus, motion, and unusual framing as possible creative style.

### Verification

- `git diff --check` passed.
- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build` passed.
- No iOS XCTest target exists in this repo structure, so no iOS unit tests were run.
- Backend source / package files were not changed; backend provider payloads remain unchanged, so backend tests were not required for this phase.
- Secret / provider scan found no new iOS provider keys, provider URLs, provider SDK imports, or direct provider calls in the iOS diff.
- Camera cloud-entry scan found no new Camera AI Snapshot / Quick Advice / Cloud AI entry; only existing unused cloud-debug / future-cloud strings remain outside the production Camera flow.
- GPS/location/raw EXIF/continuous sensor scan found no CoreLocation, GPS collection, raw EXIF dump, sensor logging, sensor persistence, or new settings persistence. The new CoreMotion monitor keeps only a short in-memory rolling summary and clears it on stop.
- Unsafe phrase scan found no banned phrase, explicit profanity, face recognition, identity recognition, attractiveness score, body shaming, or skin wording in the updated iOS surface.
- Raw sensor production UI scan found rounded level / motion values only in model / monitor code; the Photo Advisor preview shows bucket labels only and is wrapped in `#if DEBUG`.
- Ignored local synthetic images and generated provider QA reports remain untracked.

### Ready to Commit Phase 17D-B

Yes, after final verification and user review. Codex has not committed or pushed.

---

## Phase 17D-A - Local Camera Capture Context Model

Status: Completed; ready for commit review
Date: 2026-06-13

### Completed

- Added local Swift capture context models for captured / imported / mock photo sources.
- Added bucketed / summarized context fields for orientation, level, motion, exposure, focus, lens, composition helpers, selected / preview filter, local image signals, and creative intent guard.
- Added a local snapshotter that creates capture context at capture time from existing safe camera state and local guidance signals.
- Imported photos default to unavailable / unknown context rather than raw EXIF or external metadata.
- Passed capture context through `CapturedPhoto`, selected-photo flow, imported-photo flow, and mock/local Photo Advisor input.
- Updated mock/local Photo Advisor heuristic copy so blur / low light / tilt / grain / soft focus / high contrast / unusual framing are treated as possible intentional retro style.
- Added intent-aware optional advice wording and conservative retake/crop behavior; retake is not the default for creative style signals.
- Updated localization strings for English, Traditional Chinese, Simplified Chinese, Cantonese HK, and non-explicit ??????copy.

### Safety Notes

- Local-only; no capture context is uploaded to the backend in this phase.
- Backend `/v1/ai/photo-advisor` payloads are unchanged.
- No GPS/location, raw EXIF dump, raw sensor stream persistence, continuous motion log persistence, raw photo persistence, backend upload, provider key in iOS, direct provider call from iOS, Camera cloud AI entry, Gemini Live, WebSocket, StoreKit, or production rollout was added.
- Capture context is used as context, not a correction score.
- Advisor copy preserves creative intent and avoids default fix-it / retake advice.

### Verification

- `git diff --check` passed.
- Xcode generic iOS Simulator build passed.
- Backend tests were not run because no `npm` executable is available in this shell/runtime; backend source and package files were not changed.
- Secret / provider scan found only placeholder or documentation references, not real keys.
- iOS direct provider scan found no QweAPI / Intenext / Code0 / Gemini / OpenAI key or direct provider URL in iOS source; only existing local-only Firebase setup comments matched `GoogleService-Info.plist`.
- Camera cloud-entry scan found no visible AI Snapshot / Quick Advice / Cloud AI entry; only the existing unused mock cloud snapshot consent method name remains in `CameraViewModel`.
- GPS/location/raw EXIF/continuous sensor scan found no new CoreLocation, GPS, raw EXIF dump, CoreMotion stream, accelerometer/gyro logging, or sensor persistence additions; the only persistence match is the existing language/tone settings store.
- Unsafe copy scan for iOS advisor/localization found no banned phrase, explicit profanity, skin wording, face recognition, identity recognition, attractiveness score, or body shaming text in the updated advisor/localization surface.

### Ready to Commit Phase 17D-A

Yes, after user review. Codex has not committed or pushed.

---

## Phase 17C-R5 - Unsafe Response Reduction + Approved Real Sample QA Workflow

Status: Unsafe-response risk reduced in latest QA run; production rollout remains blocked
Date completed: 2026-06-13

### Completed

- Tightened the Photo Advisor provider prompt to only discuss light, color, contrast, exposure, framing, crop, background clutter, non-identifying subject placement, retro mood, and filter fit.
- Reinforced prompt restrictions against face, skin, age, gender, attractiveness, beauty, emotion / mental state, health, body, identity, ethnicity, nationality, religion, disability, and protected-class wording.
- Added safe unsafe diagnostic labels for QA: `appearance_or_identity_guard`, `sensitive_attribute_guard`, `banned_term_guard`, and `unknown_safety_guard`.
- Preserved strict `unsafe_response` fallback behavior; R5 does not remove or weaken banned-term / sensitive-inference guards.
- Extended sanitized QA reports with `unsafeByCategory` and per-case `unsafeCategory`.
- Added approved real sample workflow under ignored `backend/tests/approved-real-samples/`; committed only its README.
- Updated QA script image set selection: `--image-set=synthetic`, `--image-set=approved-real`, and `--image-set=all`.
- QA script warns about and ignores macOS `._*.jpg` resource-fork files.
- Expanded manual review template with sample type, unsafe diagnostic label, crop / framing usefulness, and local reviewer ID fields.
- Added backend tests for unsafe diagnostic labels, safe redaction, prompt wording, and QA report fields.
- Updated backend README, phase log, handoff, manual smoke tests, README, and iOS README.

### QA Observation

- Ran 20 cases across the ignored synthetic local QA image set.
- Cloud success: 19.
- Fallback: 1.
- Fallback reason: 1 `provider_invalid_json`.
- Unsafe-response count: 0.
- Average latency: 6130 ms.
- p50 latency: 4842 ms.
- p90 latency: 5837 ms.
- p95 latency: 9637 ms.
- Max latency: 24372 ms.
- Timeout count: 0.
- Schema failures: 0.
- Safety metadata failures: 0.
- Invalid filter IDs: 0.
- `latencyAssessment.productionRollout`: `blocked`.

### Safety Notes

R5 does not add production remote enablement, provider keys to iOS, direct QweAPI calls from iOS, Camera cloud AI, AI Snapshot, Filter Generator real backend, ????? image generation, Gemini Live, WebSocket, cloud storage upload, request payload logging, provider raw response logging, raw image persistence, account / payment / StoreKit, production feature flags, or production rollout.

### Production Blockers

- The latest synthetic QA run reduced unsafe fallbacks to zero, but this needs repeated validation.
- Manual language naturalness review is still required.
- Approved real sample review is still required.
- Filter recommendation fit and crop / framing usefulness need manual review.
- Production rollout remains blocked pending cost guard, abuse guard, privacy review, monitoring, and explicit user approval.

### Ready to Commit Phase 17C-R5

Yes, after user review. Codex has not committed or pushed.

---

## Phase 17C-R4 - Provider QA Latency / Fallback Hardening

Status: Provider QA report hardening completed; production rollout remains blocked
Date completed: 2026-06-13

### Completed

- Added centralized Photo Advisor QA latency / fallback classification config at `backend/src/qa/photoAdvisorQAConfig.mjs`.
- Extended sanitized provider QA reports with `cloudSuccessCount`, `fallbackCount`, `p90LatencyMs`, `maxLatencyMs`, `timeoutCount`, `unsafeResponseCount`, `fallbackByCategory`, per-case `latencyBucket`, per-case `fallbackCategory`, and `latencyAssessment`.
- Kept timeout behavior explicit and measurable; R4 does not raise provider timeouts to mask slow provider calls.
- Improved fallback classification for provider timeouts, unsafe responses, invalid JSON, invalid schema, invalid filter IDs, provider / network errors, and unknown errors.
- Expanded backend tests for sanitized QA report redaction, fallback summaries, latency buckets, fallback categories, and latency assessment.
- Expanded `backend/tests/local-images/manual-review-template.json` so reviewers can record image fixture name, locale, provider status, fallback code, latency bucket, language naturalness, filter recommendation fit, crop / framing usefulness, safety concern, and notes.
- Updated backend README, phase log, handoff, manual smoke tests, README, and iOS README.

### Safety Notes

R4 does not add production remote enablement, provider keys to iOS, direct QweAPI calls from iOS, Camera cloud AI, AI Snapshot, Filter Generator real backend, ????? image generation, Gemini Live, WebSocket, cloud storage upload, request payload logging, provider raw response logging, raw image persistence, account / payment / StoreKit, or production rollout.

### Production Blockers

- Latest R4 latency is acceptable for internal/debug QA, but prior R3 latency instability means more runs are needed before rollout.
- Fallback rate and unsafe-response paths need manual review.
- Language quality, caption quality, filter fit, and crop / framing usefulness require manual QA.
- Production rollout remains blocked pending latency tuning, cost guard, abuse guard, privacy review, and explicit user approval.

### QA Observation

- Ran 20 cases across the ignored local QA image set.
- Cloud success: 18.
- Fallback: 2.
- Fallback reasons: 2 `unsafe_response`.
- Average latency: 4969 ms.
- p50 latency: 4958 ms.
- p90 latency: 5421 ms.
- p95 latency: 5894 ms.
- Max latency: 6778 ms.
- Timeout count: 0.
- Schema failures: 0.
- Safety metadata failures: 0.
- Invalid filter IDs: 0.
- `latencyAssessment.productionRollout`: `blocked`.

### Ready to Commit Phase 17C-R4

Yes, after user review. Codex has not committed or pushed.

---

## Phase 17C-R3 - Provider QA Image Set + Latency Review

Status: Local QA image set workflow exercised; production rollout remains blocked
Date completed: 2026-06-13

### Completed

- Generated five ignored synthetic local QA JPEGs under `backend/tests/local-images/` for provider QA:
  - `warm-rooftop.jpg`
  - `low-light-street.jpg`
  - `portrait-headroom.jpg`
  - `busy-background.jpg`
  - `flat-indoor.jpg`
- Kept local QA images ignored; committed only README / sanitized manual review template.
- Hardened QA script to ignore macOS AppleDouble `._*.jpg` metadata files.
- Added `maxLatencyMs` and `fallbackByCode` to sanitized QA reports.
- Added a committed sanitized `manual-review-template.json` for human quality review notes.
- Further tuned prompt wording to avoid attractiveness, faces, skin, age, gender, emotion, health, or identity wording even when positive.
- Updated backend README, phase log, handoff, and manual smoke tests.

### QA Observation

- Ran 20 cases: 5 synthetic images x `en`, `zh-Hant`, `zh-Hans`, `yue-Hant-HK`.
- Cloud success: 17.
- Fallback: 3.
- Fallback reasons: 2 `unsafe_response`, 1 `provider_timeout`.
- Average latency: 9963 ms.
- p50 latency: 4657 ms.
- p95 latency: 35803 ms.
- Max latency: 44980 ms.
- Schema failures: 0.
- Safety metadata failures: 0.
- Invalid filter IDs: 0.
- Language quality remains manual-review only.

### Production Blockers

- p95 / max latency is too high for rollout.
- English outputs still sometimes trigger `unsafe_response`, likely due wording that intersects with appearance / sensitive guard patterns.
- More approved realistic local QA images and manual language / caption / filter review are needed before any production rollout.

### Safety Notes

R3 does not add production remote enablement, provider keys to iOS, direct QweAPI calls from iOS, Camera cloud AI, AI Snapshot, Filter Generator real backend, ????? image generation, Gemini Live, WebSocket, cloud storage upload, request payload logging, provider raw response logging, raw image persistence, account / payment / StoreKit, or production rollout.

### Ready to Commit Phase 17C-R3

No. Wait until the user reviews the QA workflow and Xcode / Simulator behavior.

---

## Phase 17C-R2 - Provider QA Batch + Prompt Tuning

Status: Provider QA batch workflow added; production/default remains mock/local
Date completed: 2026-06-13

### Completed

- Added backend Photo Advisor provider QA script at `backend/scripts/run-photo-advisor-provider-qa.mjs`.
- Added sanitized QA report helpers at `backend/src/qa/photoAdvisorQAReport.mjs`.
- Added `npm run qa:photo-advisor` backend script.
- Added ignored local QA image policy at `backend/tests/local-images/`.
- Added ignored generated report location at `backend/reports/provider-qa/`.
- QA script uses backend route handling so request validation, internal/debug guard, provider retry, response validation, safety validation, and fallback are exercised together.
- QA script records total cases, cloud success, fallback count, average / p50 / p95 latency, schema failures, safety failures, invalid filter IDs, provider errors, provider timeouts, invalid JSON/schema fallback counts, and manual language review flags.
- QA reports do not include API keys, base64 image payloads, raw request bodies, provider raw responses, EXIF, GPS, or face data.
- Prompt wording tightened to keep Photo Advisor output short, practical, gentle, non-poetic, non-overconfident, and not generation-oriented.
- Added backend tests for QA report redaction and fallback metrics.
- Updated backend README, README, iOS README, handoff, phase log, and manual smoke tests.

### QA Observation

- Local QA batch used the built-in tiny JPEG smoke image across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK`.
- Result: 4 total cases, 3 cloud successes, 1 fallback, 0 schema failures, 0 safety failures, 0 invalid filter IDs.
- Latency: average 15429 ms, p50 6606 ms, p95 34403 ms.
- Language quality remains manual-review only; script intentionally does not attempt automatic language-quality judgment.
- The p95 latency is high and should be reviewed before any production rollout.

### Safety Notes

R2 does not add production remote enablement, provider keys to iOS, direct QweAPI calls from iOS, Camera cloud AI, AI Snapshot, Filter Generator real backend, ????? image generation, Gemini Live, WebSocket, cloud storage upload, request payload logging, provider raw response logging, raw image persistence, account / payment / StoreKit, or production rollout.

### Verification

- [x] Backend tests passed with bundled Node runtime.
- [x] QA script ran with sanitized output and generated an ignored report.
- [x] QA report redaction checks passed.
- [x] `git diff --check` passed.
- [x] Xcode generic iOS Simulator build passed.
- [x] Secret scan passed.
- [x] Payload logging scan passed.
- [x] iOS direct provider scan passed.
- [x] Camera cloud entry regression scan passed.
- [x] Unsafe phrase scan found only backend banned-term guard entries.

### Ready to Commit Phase 17C-R2

No. Wait until the user reviews the QA workflow and Xcode / Simulator behavior.

---

## Phase 17C - Gemini Photo Advisor Internal Beta

Status: Backend-only Photo Advisor internal beta path through QweAPI gateway added; image provider path passes with gemini-3.1-flash-image-preview
Date completed: 2026-06-13

### Goal

Move the Cloud AI boundary from mock-only provider readiness to a first internal/debug real provider beta for post-capture Photo Advisor only, while keeping production/default behavior mock/local and Camera local-only.

### Completed

- Added backend `QwePhotoAdvisorProvider` adapter using backend -> QweAPI OpenAI-compatible gateway -> `gemini-3.1-flash-image-preview` routing.
- Added server-side Cloud AI config for `CLOUD_AI_PROVIDER_MODE`, `ALLOW_INTERNAL_CLOUD_AI`, `INTERNAL_CLOUD_AI_DEBUG_TOKEN`, `QWE_API_KEY`, `QWE_BASE_URL`, and `QWE_PHOTO_ADVISOR_MODEL`.
- QweAPI base URL config trims whitespace, requires `https`, rejects query strings / fragments, allows only `https://qweapi.com`, and fails safely when missing or invalid.
- Default provider mode remains `mock`.
- QweAPI provider path only activates when provider mode is `qweInternal`, internal cloud AI is allowed, the internal debug header / token guard passes, and the server-side QweAPI key / base URL / model config exist.
- iOS debug request now sends the internal debug header and keeps provider calls behind DEBUG-only remote wiring.
- iOS request timeout is 35 seconds; backend provider timeout is 30 seconds.
- Updated consent copy to say the selected compressed photo is uploaded for one-time analysis and neither original nor compressed image is stored.
- Added Photo Advisor prompt contract that bans identity / sensitive inference, appearance / body scoring, profanity, arbitrary filter IDs, provider references, and non-JSON output.
- QweAPI response parsing accepts JSON text from OpenAI-compatible `choices[0].message.content` responses and maps the result into existing `CloudAIResponse` v1.0.
- Provider output is validated by the existing Cloud AI response validator and unsafe text guard.
- Added one retry for invalid JSON, invalid schema, transient provider error, and timeout.
- Unsafe output, invalid request, missing consent, oversized image, rate limit, and quota paths do not retry.
- Provider failure maps to structured fallback / unavailable response.
- Backend image limit is capped for the internal beta; no cloud storage upload or file persistence was added.
- Updated `.env.example` with placeholder-only QweAPI/internal config; `.env` remains gitignored.
- Added QweAPI provider tests for mock default, internal flag guard, missing key/base URL fallback, base URL validation, prompt construction, structured provider response, invalid JSON retry, invalid schema retry, unsafe fallback, missing consent no-call, and image-too-large no-call.
- Updated README, iOS README, backend README, transition handoff, phase log, and manual smoke tests.
- Internal verification with a local QweAPI key confirmed text-only chat completions succeed against `https://qweapi.com/v1/chat/completions`.
- Internal image Photo Advisor smoke using OpenAI-compatible `image_url` returned a validated `source=cloud` Photo Advisor response with `gemini-3.1-flash-image-preview`.
- Direct diagnostic confirmed text-only chat and image_url multimodal payload both succeed with sanitized output only.

### Safety Notes

Phase 17C does not add provider keys to iOS; Gemini / OpenAI / Firebase / StoreKit SDK imports in iOS; real provider calls from iOS; Camera cloud AI entry; AI Snapshot; Filter Generator real backend; ?????real image editing; image generation; Gemini Live; WebSocket; live video streaming; production remote rollout; cloud storage upload; Firestore write; account / auth / payment / StoreKit; raw image persistence; request body logging; provider raw response logging; face recognition; identity inference; sensitive inference; app-wide language switching; or production cloud AI enablement.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] iOS unit tests, if available; no separate iOS test target exists in this repo.
- [x] Backend tests passed with bundled Node runtime.
- [x] Backend JSON schema sanity check passed.
- [x] Forbidden iOS imports scan.
- [x] Provider key scan.
- [x] Provider URL scan.
- [x] Secrets / config scan.
- [x] Request payload logging scan.
- [x] Raw image persistence scan.
- [x] Storage upload scan.
- [x] Unsafe phrase scan.
- [x] Network path scan.
- [x] Swift source change summary.
- [x] Backend source change summary.
- [x] Xcode generic iOS Simulator build passed on 2026-06-13.

### Ready to Commit Phase 17C

No. Wait until the user reviews the Phase 17C result.

---

## Phase 17C-R1 - Switch Photo Advisor Provider to QweAPI OpenAI-Compatible Gateway

Status: QweAPI OpenAI-compatible gateway contract added; text-only and image smoke succeed with gemini-3.1-flash-image-preview
Date completed: 2026-06-13

### Completed

- Replaced the active Code0 gateway attempt with QweAPI backend config: `QWE_API_KEY`, `QWE_BASE_URL=https://qweapi.com`, and `QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview`.
- Provider adapter posts to `https://qweapi.com/v1/chat/completions` using OpenAI-compatible chat completions shape.
- Auth is server-side `Authorization: Bearer <QWE_API_KEY>` only.
- `.env.example` now defaults to `CLOUD_AI_PROVIDER_MODE=mock` and `ALLOW_INTERNAL_CLOUD_AI=false`.
- Added safe developer probe script at `backend/scripts/probe-qwe-endpoint.mjs`.
- Probe sends text-only request first, prints sanitized status / latency only, and never prints API key, request body, base64 image, or provider raw response.
- Added backend tests for QweAPI v1 base URL validation, `gemini-3.1-flash-image-preview` model use, final `/v1/chat/completions` URL construction, Authorization Bearer headers, OpenAI-compatible choices parsing, non-JSON rejection, and probe script safety.
- Updated `.env.example`, backend README, phase log, handoff, and manual smoke tests.
- Verified local `.env` remains gitignored and the QweAPI key is not printed.
- Text-only provider probe succeeded with HTTP 200 and sanitized output only.
- Image Photo Advisor internal smoke returned a validated `source=cloud` response with `gemini-3.1-flash-image-preview`.

### Safety Notes

R1 keeps backend-only provider calls, internal/debug guard, production/default mock/local behavior, Camera local-only behavior, schema validation, safety validation, and fallback behavior. It does not add provider keys to iOS, direct QweAPI iOS calls, production remote enablement, Camera cloud AI, payload logging, raw provider response logging, storage upload, Gemini Live, WebSocket, StoreKit, export, or production rollout.

### Ready for Production Rollout

No.

---

## Phase 17C-Prep - Provider Readiness + Schema Hardening

Status: Provider readiness and schema hardening added; ready for user review
Date completed: 2026-06-12

### Goal

Prepare the Cloud AI backend boundary for a future provider phase by hardening schemas, validation, provider abstraction, safety fallback, and tests without adding any real provider integration.

### Completed

- Added backend provider adapter boundary with `CloudAIProvider`, `MockCloudAIProvider`, `DisabledProvider`, and a mock-only `ProviderRegistry`.
- Kept executable provider kinds limited to `mock` and `disabled`.
- Hardened `/v1/ai/photo-advisor` request validation for schema version, feature, mode, consent, locale, JPEG image shape, metadata stripping, valid base64, client platform, debug payload size, and selected filter whitelist.
- Hardened backend `CloudAIResponse` validation for allowed modes, summary length, suggestions max 3, suggestion text/action, recommended filters max 3, filter whitelist, confidence, source, safety, error shape, and unsafe text.
- Added backend filter whitelist aligned with the app filter catalog IDs.
- Added unsafe output guard for banned Cantonese / appearance / body / identity terms and simple sensitive-inference patterns.
- Added standardized fallback Cloud AI response contract with safe error codes.
- Added dev-only rate-limit, quota, and provider timeout placeholders.
- Added redacted operational metadata / safe logging helper that excludes image payloads and request bodies.
- Added backend fixtures for valid request, missing consent, invalid schema version, oversized image, valid response, invalid filter response, unsafe response, and too-many-suggestions response.
- Expanded backend tests to cover valid / invalid / unsafe / mock-only provider / no-payload metadata cases.
- Updated backend JSON schemas to match the hardened request / response contract.
- Existing iOS debug remote chain from Phase 17B remains compatible and still validates backend responses before mapping them into Photo Advisor.
- Production/default Photo Advisor remains mock/local.
- Camera remains local-only and no cloud AI entry was added.
- Updated README, iOS README, backend README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 17C-Prep does not add real OpenAI, Gemini, Firebase AI, Stability, or provider calls; provider SDK imports; provider API keys; provider URLs; production remote Cloud AI; cloud storage upload; Firebase Storage upload; Firestore writes; request payload logging; provider raw response logging; Camera cloud AI entry; Gemini Live; WebSocket; live video streaming; StoreKit; payment; account / auth; save-to-Photos; export; raw photo / frame persistence; face recognition; identity inference; sensitive inference; app-wide language switching; Phase 17C real provider beta; or changes to Filter Lab / ?????runtime behavior.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] iOS unit tests, if available; no separate iOS test target exists in this repo.
- [x] Backend tests passed with bundled Node runtime.
- [x] Backend JSON schema sanity check passed.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Provider key scan.
- [x] Provider URL scan.
- [x] Request payload logging scan.
- [x] Unsafe phrase scan.
- [x] Filter whitelist tests.
- [x] Persistence scope scan.
- [x] Swift source change summary.
- [x] Backend source change summary.
- [x] Xcode generic iOS Simulator build passed on 2026-06-12.

### Ready to Commit Phase 17C-Prep

No. Wait until the user reviews the Phase 17C-Prep result.

### Ready for Real Provider Integration

No.

---

## Phase 17B - Debug-only Remote CloudAIService Wiring

Status: Debug-only remote Cloud AI boundary wiring added; ready for user review
Date completed: 2026-06-12

### Goal

Let internal DEBUG builds test the Phase 17A backend mock `/v1/ai/photo-advisor` chain without changing production/default Photo Advisor behavior or connecting any real provider.

### Completed

- Added `CloudAIEndpointClient` for DEBUG-only local backend mock requests.
- Extended `RemoteCloudAIService` with `.debugRemoteMock` mode while keeping default mode `.remoteDisabled`.
- Added structured `CloudAIPhotoAdvisorRequest` / image / client request DTOs.
- Added response mapping from validated `CloudAIResponse` into the existing `PhotoAdvisorResult` UI model.
- Added DEBUG-only Photo Advisor footer action: `Debug: Test Cloud Boundary`.
- DEBUG-only remote path shows `CloudAIConsentView` before sending a request.
- DEBUG-only remote path uses `CloudAIImageCompressor` before building the request.
- DEBUG-only remote path validates the backend response with `CloudAIResponseValidator`.
- DEBUG-only remote path falls back to existing local/mock Photo Advisor advice if backend is unavailable, invalid, timed out, or cancelled.
- Backend request validator now requires `feature = photo_advisor`.
- Backend schema and tests updated for the Phase 17B request shape.
- Normal Photo Advisor behavior remains mock/local by default.
- Camera remains local-only and no cloud AI entry was added.
- Updated README, iOS README, backend README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 17B does not add real OpenAI, Gemini, Firebase AI, Stability, or provider calls; provider SDK imports; provider API keys; provider URLs; production remote Cloud AI; cloud storage upload; Firebase Storage upload; Firestore writes; request payload logging; provider raw response logging; Camera cloud AI entry; Gemini Live; WebSocket; live video streaming; StoreKit; payment; account / auth; save-to-Photos; export; raw photo / frame persistence; face recognition; identity inference; sensitive inference; app-wide language switching; Phase 17C provider integration; or changes to Filter Lab / ?????runtime behavior.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate iOS test target exists in this repo.
- [x] Backend tests passed with bundled Node runtime.
- [x] Backend JSON schema sanity check passed.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Provider key scan.
- [x] Provider URL scan.
- [x] Request payload logging scan.
- [x] Persistence scope scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode generic iOS Simulator build passed on 2026-06-12.

### Ready to Commit Phase 17B

No. Wait until the user reviews the Phase 17B debug-only wiring result.

### Ready for Real Provider Integration

No.

---

## Phase 17A - Real Cloud AI Backend Boundary Skeleton

Status: Cloud AI boundary skeleton added; ready for user review
Date completed: 2026-06-12

### Goal

Start Phase 17 with a safe backend boundary skeleton for future Cloud AI while keeping the app mock/local by default and avoiding any real provider integration.

### Completed

- Added iOS `CloudAIService` protocol.
- Added typed Cloud AI request / response models for post-capture Photo Advisor.
- Added `CloudAIResponseValidator` with schema, suggestion count, filter whitelist, generated filter parameter, and sensitive inference checks.
- Added `MockCloudAIService`.
- Added `RemoteCloudAIService` as a disabled / mock-fallback skeleton with no production network path.
- Added `CloudAIBackendMode` with `.mockOnly` as the default mode.
- Added neutral `CloudAIConsentView` copy for English, Traditional Chinese, Simplified Chinese, and Cantonese.
- Added `CloudAIImageCompressor` scaffold for downsampled JPEG re-encoding / metadata stripping without file persistence.
- Added a dependency-free `backend/` mock boundary skeleton.
- Added backend `GET /health` mock-only status endpoint.
- Added backend `POST /v1/ai/photo-advisor` mock-safe endpoint with request validation and structured mock response.
- Added backend JSON schema files for request / response contracts.
- Added backend consent helper, response validator, redaction helper, mock provider, and Node tests.
- Kept existing Photo Advisor mock/local flow as the default app behavior.
- Kept Camera as a local-only AI surface.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 17A does not add real OpenAI, Gemini, Firebase AI, Stability, or provider calls; provider SDK imports; provider API keys; provider URLs; real backend provider integration; production-reachable iOS remote Cloud AI calls; real cloud upload; Firebase Storage upload; Firestore writes; cloud image persistence; request payload logging; provider raw response logging; Camera cloud AI entry; Gemini Live; WebSocket; live video streaming; StoreKit; payment; account / auth; save-to-Photos; export; raw photo / frame persistence; face recognition; identity inference; sensitive inference; app-wide language switching; Phase 17B / 17C provider integration; or changes to Filter Lab / ?????runtime behavior.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate iOS test target exists in this repo.
- [x] Backend tests passed with bundled Node runtime.
- [x] Backend JSON schema sanity check passed.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Provider key scan.
- [x] Request payload logging scan.
- [x] Persistence scope scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode generic iOS Simulator build passed on 2026-06-12.

### Ready to Commit Phase 17A

No. Wait until the user reviews the Phase 17A boundary skeleton result.

### Ready for Real Provider Integration

No.

---

## Phase 16X - Inspiration AI Hub Cleanup

Status: Inspiration organized as mock/local AI Hub; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Make Inspiration / ??? the clear home for import photo advice, Photo Advisor, Filter Lab, future Photo Edit, and future cloud AI planning, while preserving Camera as a local-only guidance surface.

### Completed

- Reworked the Inspiration top area into an AI Hub / creative hub.
- Made import photo analysis the primary action.
- Added Photo Advisor orientation inside the AI Hub and kept the actual advisor flow tied to imported / selected photos.
- Preserved Filter Lab mock entry and clarified that it generates a mock custom filter direction from a reference photo.
- Added a disabled future Photo Edit / ?????placeholder card.
- Added a compact future cloud AI notice that states cloud analysis is not enabled and future upload would require clear consent with no background upload.
- Kept Phase 16W language-aware Photo Advisor behavior.
- Kept Phase 16W-R2 Camera local-only surface and did not reintroduce Camera AI Snapshot / Quick Advice.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16X does not add real AI, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, raw image / frame persistence, Photo Advisor output persistence, new persistence beyond existing language / tone settings, app-wide language switching, full localization runtime, explicit profanity runtime, `troublemakerExplicit` runtime output, LLM-generated copy, AI-generated live camera copy, Filter Lab backend generation, ?????real image generation, History schema changes, Core Data, SwiftData, save-to-Photos, export, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, face recognition, identity inference, or sensitive attribute inference.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate test target exists in this repo.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scope scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16X

No. Wait until the user visually accepts the Phase 16X result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16W-R2 - Camera Local-only AI Surface Cleanup

Status: Camera surface changed to local-only AI guidance; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Apply the latest product decision that Camera should only expose local guidance / ???????, while cloud-style AI / Photo Advisor entry points live in Inspiration / imported / selected photo flows.

### Completed

- Removed / hid Camera AI Snapshot / cloud-style quick advice entry points from `CameraView`.
- Removed the Camera guidance mode selector from the Camera UI so the Camera surface remains local-coach focused.
- Kept Local Guidance / ???????™è???on the Camera screen.
- Local Guidance chip title now follows persisted language / tone preference.
- Local Guidance sentence copy continues through the deterministic resolver and now covers more local signal fallback categories.
- Main Camera selected-photo floating tray keeps filter access but no longer shows the AI Advisor button on the Camera tab.
- Main Camera selected-photo floating filter grid no longer shows AI recommended filters.
- Inspiration / imported photo selected flow still shows AI ?????/ Photo Advisor and remains language-aware from Phase 16W.
- Kept Phase 15B brightness, Phase 15C face framing / headroom, and Phase 15D stability / priority / anti-flicker behavior intact.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16W-R2 does not add real AI, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, raw image / frame persistence, Photo Advisor output persistence, new persistence beyond existing language / tone settings, app-wide language switching, full localization runtime, explicit profanity runtime, `troublemakerExplicit` runtime output, LLM-generated copy, AI-generated live camera copy, Filter Lab copy changes, ?????copy changes, History schema changes, Core Data, SwiftData, save-to-Photos, export, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, face recognition, identity inference, or sensitive attribute inference.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate test target exists in this repo.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scope scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16W-R2

No. Wait until the user visually accepts the Phase 16W-R2 result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16W - Extend Language / Tone Resolver to Photo Advisor

Status: Extended persisted language / tone preference to mock/local Post-capture Photo Advisor copy; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Make Post-capture Photo Advisor / AI ?????/ ?????¦è??? follow the same persisted Language / Tone preference introduced in Phase 16V, while keeping the feature mock/local-only.

### Completed

- Added `PhotoAdvisorCopyResolver` for deterministic post-capture advisor copy.
- Extended `PhotoAdvisorInput` with language / tone fields.
- `PhotoAdvisorResultView` now passes the persisted `CameraCoachToneSettingsStore` language / tone into Photo Advisor analysis input.
- Mock / local Photo Advisor results now resolve summary, suggestions, filter recommendation reasons, retake advice, crop advice, and unavailable fallback copy through the deterministic resolver.
- Added phrase keys for English neutral, Traditional Chinese neutral, Simplified Chinese neutral, Cantonese HK conversational, and Cantonese non-explicit ??????Photo Advisor copy.
- Kept existing Photo Advisor result card structure, filter apply behavior, validator, mock service boundary, and no-upload footer.
- Kept Local Camera Coach resolver working.
- Kept Filter Lab, ?????/ image editing, AI Snapshot, History, and cloud AI surfaces unchanged.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16W does not add real AI, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, raw image / frame persistence, Photo Advisor output persistence, app-wide language switching, full localization runtime, explicit profanity runtime, `troublemakerExplicit` runtime output, LLM-generated copy, AI-generated live camera copy, Filter Lab copy changes, ?????copy changes, History schema changes, Core Data, SwiftData, save-to-Photos, export, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, face recognition, identity inference, or sensitive attribute inference.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate test target exists in this repo.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scope scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16W

No. Wait until the user visually accepts the Phase 16W result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16V - Persistent Language / Tone Settings + Camera Coach Runtime Integration

Status: Added persistent Local Camera Coach language / tone preference and runtime resolver integration; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Promote the HK3 / HK4 language-tone work from Settings mock and neutral resolver scaffold into a limited production runtime path for Local Camera Coach / ??????? only.

### Completed

- Added centralized `CameraCoachToneSettingsStore` persistence for language / tone preference only.
- Settings Language / Tone now saves `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- English, Traditional Chinese, and Simplified Chinese force neutral tone.
- Cantonese supports Hong Kong conversational and non-explicit ??????tone.
- `troublemakerExplicit` remains unavailable in Settings and falls back to non-explicit safe tone if encountered.
- Local Camera Coach reads the selected language / tone at suggestion composition time.
- Deterministic resolver supports lighting, headroom, stability, framing, background clutter, and success praise phrase categories.
- Added language-specific phrase keys for English, Traditional Chinese, Simplified Chinese, Cantonese HK conversational, and Cantonese non-explicit ??????
- Preserved existing Phase 15D stability / priority / anti-flicker controller.
- Kept Photo Advisor, Filter Lab, ?????/ image editing, AI Snapshot, History, and Inspiration runtime copy unchanged.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Persistence Scope

Phase 16V intentionally persists only app settings preference keys:

- `cameraCoach.languageMode`
- `cameraCoach.toneMode`

It does not persist photos, camera frames, face data, raw image data, AI responses, provider responses, prompts, identity data, sensitive inference, exports, cloud data, or history changes.

### Safety Notes

Phase 16V does not add app-wide language switching, full localization runtime, explicit profanity runtime, production coarse profanity enablement, `troublemakerExplicit` runtime output, LLM-generated copy, AI-generated live camera copy, Photo Advisor copy changes, Filter Lab copy changes, ?????copy changes, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, raw image / frame persistence, Core Data, SwiftData, save-to-Photos, export, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Unit tests, if available; no separate test target exists in this repo.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scope scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16V

No. Wait until the user visually accepts the Phase 16V result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16U / HK4 - Deterministic Camera Coach Copy Resolver Integration

Status: Added local-only deterministic camera coach copy resolver scaffold / neutral runtime integration; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Introduce a very limited deterministic copy resolver for Local Camera Coach / ??????? copy, based on HK2 safety rules, without app-wide language switching or explicit profanity runtime.

### Completed

- Added `GuidanceCopyResolver`, `SafetyCopyPolicy`, `GuidancePraiseResolver`, and `GuidanceIssueMemory` scaffolds.
- Added `FeatureContext`, `GuidanceCopyCategory`, and runtime-safe `ToneMode` values.
- Resolver supports neutral, Hong Kong conversational, and non-explicit ??????copy keys.
- `troublemakerExplicit` is rejected for runtime and falls back to non-explicit `troublemaker`.
- Public contexts and non-live-camera contexts fall back to neutral.
- Routed selected Local Camera Coach deterministic categories through resolver: lighting, headroom, framing, and success praise.
- Runtime Local Camera Coach uses neutral default tone only.
- Kept existing Phase 15D stability / priority / anti-flicker controller untouched.
- Added localized phrase bank keys for neutral / HK / non-explicit ??????copy.
- Kept Settings Language / Tone UI mock-only and non-persistent.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Runtime Tone Decision

HK4 uses runtime default neutral only. The resolver scaffold can resolve HK conversational and non-explicit ??????keys, but no Settings state, app-wide language switching, or persistence is connected to production runtime.

### Safety Notes

Phase 16U is local-only deterministic copy work. It does not add app-wide language switching, Settings persistence, copy resolver persistence, explicit profanity runtime, `troublemakerExplicit` runtime output, LLM-generated copy, AI-generated live camera copy, Photo Advisor copy changes, Filter Lab copy changes, ?????copy changes, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, `@AppStorage`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse / build check.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Explicit profanity runtime scan.
- [x] Banned phrase scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16U

No. Wait until the user visually accepts the Phase 16U result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16T-R2 / HK3 - Hide Mock Preview Cards From Production UI

Status: Hid production-visible mock preview cards from Settings Language / Tone UI; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Keep the Language / Tone Settings UI production-clean by removing mock preview phrase cards from the visible Settings surface.

### Completed

- Removed production-visible mock preview cards from the Language / Tone Settings UI.
- Removed production-visible Tip / After fixing praise loop examples.
- Removed production-visible explicit profanity example.
- Kept language buttons for English, Traditional Chinese, Simplified Chinese, and Cantonese.
- Kept a short Cantonese / ??????safety notice when Cantonese is selected.
- Updated English and Traditional Chinese localization keys.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16T-R2 remains Settings-only mock UI. It does not add app-wide language switching, runtime language mode, Settings persistence, copy resolver, localization runtime, Camera guidance copy integration, Photo Advisor copy integration, Filter Lab copy integration, ?????copy integration, explicit profanity production path, visible explicit phrase examples in production UI, LLM-generated copy, AI-generated live camera copy, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, `@AppStorage`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse / build check.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16T-R2

No. Wait until the user visually accepts the Phase 16T-R2 result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16T-R1 / HK3 - Simplified Mock Language Tone UI

Status: Simplified Settings-only mock language / tone mode UI; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Simplify the Phase 16T Settings mock so it shows language choices only, with preview content driven by the selected language instead of separate tone selector buttons.

### Completed

- Removed the separate tone selector buttons for Neutral, Hong Kong conversational, ?????? and ??????explicit.
- Kept language choices: English, Traditional Chinese, Simplified Chinese, and Cantonese.
- English, Traditional Chinese, and Simplified Chinese now show neutral mock previews.
- Cantonese now shows a ??????/ controlled explicit preview and Cantonese-only safety notice.
- Kept all preview content deterministic and static.
- Kept explicit / profanity direction preview-only and not runtime-enabled.
- Updated English and Traditional Chinese localization keys.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16T-R1 remains Settings-only mock UI. It does not add app-wide language switching, runtime language mode, Settings persistence, copy resolver, localization runtime, Camera guidance copy integration, Photo Advisor copy integration, Filter Lab copy integration, ?????copy integration, explicit profanity production path, LLM-generated copy, AI-generated live camera copy, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, `@AppStorage`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse / build check.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16T-R1

No. Wait until the user visually accepts the Phase 16T-R1 result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16T / HK3 - Mock Language Mode UI

Status: Implemented Settings-only mock language / tone mode UI; ready for user Xcode / Simulator review
Date completed: 2026-06-12

### Goal

Add a Settings-only mock language / tone preview based on Phase 16R research and Phase 16S / HK2 style guide, without changing runtime Camera, Advisor, Filter Lab, or editing copy.

### Completed

- Added `LanguageToneSettingsView` to Settings.
- Added view-local `AppLanguageMode` and `ToneMode` enum state for mock preview only.
- Added language choices: English, Traditional Chinese, Simplified Chinese, Cantonese.
- Added tone choices: Neutral, Hong Kong conversational, ?????? and ??????explicit as future / disabled.
- Added deterministic static preview examples for neutral, Hong Kong conversational, ?????? and disabled explicit mode.
- Added safety notice: ??????comments on shooting choices and photo state, not appearance, body, or identity.
- Added explicit mode notice: explicit mode is not enabled and would require future confirmation.
- Added praise loop preview for "???????™è??????????????????.
- Added localization keys for English and Traditional Chinese.
- Updated README, iOS README, transition handoff, phase log, and manual smoke tests.

### Safety Notes

Phase 16T is Settings-only mock UI. It does not add runtime language mode, Settings persistence, copy resolver, localization runtime, Camera guidance copy integration, Photo Advisor copy integration, Filter Lab copy integration, ?????copy integration, explicit profanity production path, LLM-generated copy, AI-generated live camera copy, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, `@AppStorage`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse / build check.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Swift source change summary.
- [x] Xcode build passed, if environment allows.

### Ready to Commit Phase 16T

No. Wait until the user visually accepts the Phase 16T result in Xcode / Simulator.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16S - Save HK2 Hong Kong / ??????Copy System + Safety Style Guide

Status: Documentation-only product / copy style guide save; ready to commit after final review
Date completed: 2026-06-12

### Goal

Save the user-provided ChatGPT HK2 product / copy style guide for Hong Kong / ??????Copy System + Safety Style Guide into the repo, then update documentation indexes and handoff status.

### Completed

- Added `docs/product/hk-troublemaker-copy-system-style-guide.md`.
- Preserved the provided document title: `HK2 ??Hong Kong / ??????Copy System + Safety Style Guide`.
- Saved the full ChatGPT-provided HK2 Markdown content to the repo.
- Removed `utm_source=chatgpt.com` query strings without changing source meaning.
- Preserved the required sections:
  - Executive Summary
  - Design Principles
  - Language / Tone Modes
  - Context Rules
  - Safety Rules
  - Banned Phrase List
  - Safe Rewrite Table
  - Copy Template Categories
  - Phrase Bank
  - Positive Feedback / Praise Loop
  - Localization Key Plan
  - QA Checklist
  - Implementation Notes for Future Codex Phase
  - Final Recommendation
- Preserved the reference-style source links at the end of the provided document.
- Recorded that HK2 is a product / copy style guide after Phase 16R, not a research report and not a runtime implementation spec.
- Recorded that HK2 remains documentation-only with no runtime language mode, explicit profanity implementation, LLM-generated live copy, cloud dependency, or persistence change.
- Recorded the deterministic copy system goal and the three core principles: ?è¬œî????????????™è?????????; ?è¬œî????????????™è???? ???????™è??????????????????
- Recorded the AppLanguageMode and ToneMode taxonomy, with MVP limited to neutral, Hong Kong conversational, and non-explicit troublemaker.
- Recorded that `troublemakerExplicit` is future-only and explicit copy must not enter MVP, default UI, App Store screenshots, privacy / consent / legal copy, notifications, widgets, or post-capture criticism.
- Recorded that future implementation should use deterministic templates and should not use AI to generate live profanity.
- Recorded that the next safe implementation candidate, if explicitly requested later, is HK3 Mock Language Mode UI, not explicit profanity or runtime copy resolver.
- Updated transition handoff and README references.

### Safety Notes

Phase 16S is documentation-only. Codex only saved the ChatGPT-provided HK2 style guide and updated docs references. It does not add Swift source changes, app UI changes, app behavior changes, Settings UI implementation, language mode implementation, copy resolver implementation, localization runtime implementation, explicit profanity mode implementation, LLM-generated copy, AI-generated live camera copy, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Markdown heading sanity check confirmed required sections exist.
- [x] Reference-style source links preserved.
- [x] `utm_source=chatgpt.com` removed from saved guide links.
- [x] Reference-style link sanity check.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Swift source change scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16S

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16R - Save Hong Kong / ??????Language Mode Research

Status: Documentation-only research save; ready to commit after final review
Date completed: 2026-06-12

### Goal

Save the user-provided ChatGPT research report for Hong Kong / ??????Language Mode UX + Safety into the repo, then update documentation indexes and handoff status.

### Completed

- Added `docs/research/hong-kong-troublemaker-language-mode-research.md`.
- Preserved the provided report title: `Hong Kong / ??????Language Mode UX + Safety for iOS Retro Camera App ????????™è??????`.
- Saved the full ChatGPT-provided Markdown research report to the repo.
- Removed `utm_source=chatgpt.com` query strings without changing source meaning.
- Preserved the required sections:
  - Executive Summary
  - My Product Idea ????????????
  - Product Positioning: Local Interest and Brand Differentiation
  - Product Goal
  - Language Mode Taxonomy
  - Hong Kong / ??????Tone Definition
  - Profanity Policy
  - Safety Boundaries
  - Context-based Tone Rules
  - Positive Feedback Loop: ???????™è??????????????????
  - UX Design
  - Copywriting System
  - Feature Integration
  - Localization Architecture
  - Free vs Paid Policy
  - App Store / Legal / Brand Risk
  - Moderation / QA Strategy
  - Technical Architecture Proposal
  - MVP / Future Phase Plan
  - Risk Table
  - Final Recommendation
  - Sources / Links
- Recorded the research conclusion that ???Šå?îª´å??/ ??????mode is a Hong Kong localization brand personality, not a generic AI tone pack, translation mode, or profanity feature.
- Recorded the core principles: criticize the shooting behavior / photo state, not the person; say it once; praise when the issue is fixed.
- Recorded the tone taxonomy: Neutral, Hong Kong Conversational, ?????? and ??????+ explicit profanity opt-in.
- Recorded that profanity must be default off, explicit opt-in, double-confirmed, previewed, one-tap-off, excluded from public / legal / privacy contexts, and mainly limited to `??? as a Hong Kong tone particle.
- Recorded that live camera copy should start with deterministic templates and should not use LLM-generated profanity / live camera copy.
- Recorded that privacy / consent / legal copy must remain neutral and technical cloud AI / third-party AI disclosures must remain clear.
- Recorded that MVP should start with HK conversational + non-explicit ??????
- Recorded that the next safe implementation candidate, if explicitly requested later, is HK2 copy system / style guide documentation, not runtime language mode.
- Updated transition handoff and README references.

### Safety Notes

Phase 16R is documentation-only. Codex only saved the ChatGPT-provided research report and updated docs references. It does not add Swift source changes, app UI changes, app behavior changes, Settings UI implementation, language mode implementation, copy resolver implementation, localization runtime implementation, explicit profanity mode implementation, LLM-generated copy, AI-generated live camera copy, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, persistence changes, `UserDefaults`, Core Data, SwiftData, StoreKit, payment, credits, moderation implementation, runtime profanity filtering, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Markdown heading sanity check confirmed required sections exist.
- [x] Source links section preserved.
- [x] `utm_source=chatgpt.com` removed from saved report links.
- [x] Reference-style link sanity check.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] Swift source change scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16R

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16Q - Save Paid AI Image Editing / ?????Research

Status: Documentation-only research save; ready to commit after final review
Date completed: 2026-06-12

### Goal

Save the user-provided ChatGPT research report for Paid AI Image Editing / ?????into the repo, then update documentation indexes and handoff status.

### Completed

- Added `docs/research/paid-ai-image-editing-research.md`.
- Preserved the provided report title: `Paid AI Image Editing / ?????for iOS Retro Camera App ????????™è??????`.
- Saved the full ChatGPT-provided Markdown research report to the repo.
- Removed `utm_source=chatgpt.com` query strings without changing source meaning.
- Preserved the required sections:
  - Executive Summary
  - Product Goal
  - Feature Boundary: Photo Editing, Not General Image Generation
  - Relationship with Photo Advisor / Filter Lab / Local Coach
  - Provider / Model Landscape
  - Recommended Architecture
  - Prompt Design
  - Prompt Guard / Abuse Prevention
  - Free vs Paid / Quota / Cost Policy
  - UX Design
  - Privacy / Consent / Retention
  - Safety / Legal / App Store Considerations
  - Backend Contract Proposal
  - Data Model Proposal
  - Failure States and Recovery
  - MVP / Future Phase Plan
  - Risk Table
  - Final Recommendation
  - Sources / Links
- Recorded the research conclusion that ?????/ AI image editing should be a paid post-capture / imported-photo enhancement tool.
- Recorded that it should not be used for pre-capture / in-capture continuous live guidance or as a general text-to-image generator.
- Recorded that user-facing UI may call it ?????/ ??????™è?????/ ??????????????/ Photo Fix / Style Edit and can reduce everyday `AI` wording.
- Recorded that privacy / consent screens must clearly disclose cloud AI / third-party AI.
- Recorded that first implementation should be mock-first and real provider integration must be backend-mediated.
- Recorded that iOS must not contain provider API keys or directly call OpenAI / Gemini / Stability / any provider.
- Recorded that backend must handle entitlement, quota, prompt guard, provider adapter, timeout / cancellation, moderation / safety, response validation, and logging minimization before real provider work.
- Recorded that the next safe implementation candidate, if explicitly requested later, is mock image editing UX, not real provider integration.
- Updated transition handoff and README references.

### Safety Notes

Phase 16Q is documentation-only. Codex only saved the ChatGPT-provided research report and updated docs references. It does not add Swift source changes, app UI changes, app behavior changes, mock image editing UI implementation, prompt guard implementation, AI image editing implementation, provider adapter implementation, backend code, cloud AI, network calls, `URLSession`, `URLRequest`, WebSocket, OpenAI / Gemini / Stability / Firebase / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, image upload, photo upload, raw photo persistence, AI response persistence, provider raw response persistence, `UserDefaults`, Core Data, SwiftData, export, save-to-Photos, StoreKit, payment, credits, real quota system, real entitlement system, moderation implementation, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Markdown heading sanity check confirmed required sections exist.
- [x] Source links section preserved.
- [x] `utm_source=chatgpt.com` removed from saved report links.
- [x] Reference-style link sanity check.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence / export scan.
- [x] Provider import scan.
- [x] StoreKit scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16Q

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16P - Save Encrypted App-to-App Photo Transfer Research

Status: Documentation-only research save; ready to commit after final review
Date completed: 2026-06-12

### Goal

Save the user-provided ChatGPT research report for Encrypted App-to-App High Quality / Lossless Photo Transfer into the repo, then update documentation indexes and handoff status.

### Completed

- Added `docs/research/encrypted-app-to-app-photo-transfer-research.md`.
- Preserved the provided report title: `Encrypted App-to-App High Quality / Lossless Photo Transfer for iOS Retro Camera App ????????™è??????`.
- Saved the full ChatGPT-provided Markdown research report to the repo.
- Removed `utm_source=chatgpt.com` query strings without changing source meaning.
- Preserved the required sections:
  - Executive Summary
  - Product Goal
  - High Quality vs Lossless Definition
  - User Flow
  - Free vs Paid Entitlement Policy
  - Security Model
  - Encryption Architecture
  - Transfer Token / Link Design
  - Backend / Storage Architecture
  - Receiver Access Model
  - UX Design
  - Privacy / Legal / App Store Considerations
  - Abuse / Quota / Cost Control
  - Failure States and Recovery
  - Technical Architecture Proposal
  - Data Model Proposal
  - MVP / Future Phase Plan
  - Risk Table
  - Final Recommendation
  - Sources / Links
- Recorded the research conclusion that this feature is a paid-sender high-quality / private app-to-app photo transfer concept where receivers can be free but need the app.
- Recorded that MVP should use "high-quality encrypted transfer" rather than promising true lossless before export format, render path, color space, bit depth, and compression are defined.
- Recorded that the safest architecture is client-side encryption before upload, with backend / storage unable to see plaintext and backend not storing decrypt keys.
- Recorded that crypto must not be custom-built and future implementation should rely on platform authenticated encryption concepts only after a dedicated phase.
- Recorded that StoreKit / entitlement / backend / privacy policy must exist before real paid transfer.
- Recorded that the next safe implementation candidate, if explicitly requested later, is local high-quality export renderer planning / prototype, not encrypted transfer backend.
- Updated transition handoff and README references.

### Safety Notes

Phase 16P is documentation-only. Codex only saved the ChatGPT-provided research report and updated docs references. It does not add Swift source changes, app UI changes, app behavior changes, export implementation, Share Sheet implementation, save-to-Photos implementation, encrypted transfer implementation, CryptoKit prototype, Universal Links, QR code implementation, backend code, cloud storage, signed URL implementation, StoreKit, payment, credits, real AI, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, photo upload, raw photo persistence, AI response persistence, encrypted file persistence implementation, `UserDefaults`, Core Data, SwiftData, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Markdown heading sanity check confirmed required sections exist.
- [x] Source links section preserved.
- [x] `utm_source=chatgpt.com` removed from saved report links.
- [x] Reference-style link sanity check.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence / export scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16P

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16O - Save Local On-device Camera Coach + LiDAR Research

Status: Documentation-only research save; ready to commit after final review
Date completed: 2026-06-12

### Goal

Save the user-provided ChatGPT research report for Local On-device Camera Coach + LiDAR Scene Understanding into the repo, then update documentation indexes and handoff status.

### Completed

- Added `docs/research/local-on-device-camera-coach-lidar-research.md`.
- Preserved the provided report title: `Local On-device Camera Coach + LiDAR Scene Understanding for iOS Retro Camera App ????????™è??????`.
- Saved the full ChatGPT-provided Markdown research report to the repo.
- Removed `utm_source=chatgpt.com` query strings without changing source meaning.
- Preserved the required sections:
  - Executive Summary
  - Product Goal
  - Why Continuous Live Cloud AI Is Not Recommended
  - Current Local Guidance Baseline
  - Local Heuristic Guidance Layer
  - iOS Native Signal Sources
  - On-device AI / Core ML Feasibility
  - Dataset and Training Requirements
  - LiDAR-aware Scene Understanding
  - Device Compatibility and Fallback
  - Guidance UX Design
  - Free vs Paid Policy
  - Privacy / Safety / App Store Considerations
  - Technical Architecture Proposal
  - Integration with Current App Phases
  - MVP / Future Phase Plan
  - Risk Table
  - Final Recommendation
  - Sources / Links
- Recorded the research conclusion that pre-capture / in-capture guidance should not depend on continuous live cloud AI.
- Recorded that local camera guidance should remain local-first / on-device-first, while cloud AI should mainly remain post-capture / imported-photo analysis.
- Recorded that the next safe implementation candidate is local coach architecture refactor, not live cloud AI.
- Updated transition handoff and README references.

### Safety Notes

Phase 16O is documentation-only. Codex only saved the ChatGPT-provided research report and updated docs references. It does not add Swift source changes, app UI changes, app behavior changes, LiDAR implementation, Core ML implementation, ARKit implementation, Vision body pose implementation, local model training, real AI, cloud AI, backend code, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, photo upload, live camera frame upload, raw frame persistence, photo persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, cloud save, StoreKit, premium / credits, payment, real local download, save-to-Photos, export, Gemini Live, streaming, profanity language mode implementation, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Markdown heading sanity check confirmed required sections exist.
- [x] Source links section preserved.
- [x] `utm_source=chatgpt.com` removed from saved report links.
- [x] Reference-style link sanity check.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence / export scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16O

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16N - Future AI / Premium Feature Policy Backfill

Status: Documentation-only product policy backfill; ready to commit after final review
Date completed: 2026-06-12

### Goal

Record the user's latest product decisions for future AI, local intelligence, paid features, cloud save, high-quality photo transfer, AI image editing, Filter Lab entitlement, advanced retro effects, language modes, and user-facing AI wording.

### Completed

- Added `docs/product/future-ai-premium-feature-policy.md`.
- Recorded local AI / local camera intelligence policy: pre-capture and in-capture guidance should primarily be local, available to free and paid users, and should not upload live camera frames.
- Recorded `Local On-device Camera Coach + LiDAR Research` as future research.
- Recorded LiDAR-aware local camera intelligence as a future high-end-device research topic with non-LiDAR fallback.
- Recorded post-capture cloud AI quota policy: free users may receive 20 analyses per placeholder monthly quota period; paid users may be higher / fair-use, with cost guard and kill switch.
- Recorded `POST /v1/ai/photo-advisor` as the first future real cloud endpoint recommendation, still blocked until backend boundary work.
- Recorded paid app-to-app encrypted high-quality / lossless photo transfer policy and the `Encrypted App-to-App High Quality Photo Transfer Research` title.
- Recorded paid AI image editing / ?????policy, provider research requirement, backend proxy requirement, prompt guard, consent, quota, moderation, timeout, and cost guard.
- Recorded AI Filter Generator / Filter Lab free vs paid policy: free session-only use; paid save / manage / reuse / future cloud sync.
- Recorded advanced retro camera effects / double exposure ideas and research title.
- Recorded Hong Kong / ??????language mode policy: opt-in, default off, profanity as tone only, no identity / age / gender / race / body / appearance attacks, App Store age rating research required.
- Recorded user-facing AI wording reduction guidance.
- Added free / paid feature matrix.
- Added research backlog and guardrails.
- Updated this phase log, transition handoff, and README references.

### Safety Notes

Phase 16N is documentation-only. It does not add Swift source changes, app UI changes, real AI, cloud AI, backend code, network calls, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, photo upload, reference image upload, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, cloud save, StoreKit, premium / credits, payment, real local download, save-to-Photos, export, Gemini Live, streaming, image editing implementation, encrypted transfer implementation, LiDAR implementation, local model training, profanity language mode implementation, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

### Verification

- [x] `git status --short` checked before implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.
- [x] Persistence / export scan.
- [x] No Swift source changed; Xcode build not required.

### Ready to Commit Phase 16N

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16K-L - Local Heuristic Advisor + Selected Photo UX Polish

Status: Implemented and manually accepted by the user in Xcode / Simulator; ready to commit after final review
Date completed: 2026-06-12

### Goal

Make the Mock Post-capture AI Advisor less random by using safe local signals while polishing the selected / imported photo result screen hierarchy. Keep the floating advisor / filter tray intact and preserve all mock-only / local-only boundaries.

### Completed

- Added local image signal models for selected-photo aspect ratio buckets: square, portrait, tall portrait, landscape, wide landscape, and unavailable.
- Added `PhotoAdvisorHeuristicResolver` to map selected filter family, photo source, aspect ratio bucket, and retry seed into deterministic advisor fixture / recommendation output.
- Updated `MockPhotoAdvisorService` to use the local heuristic resolver instead of random-only fixture selection.
- Preserved fallback and whitelist validation through `PhotoAdvisorResultValidator`.
- Updated advisor retry to preserve local image signal context.
- Updated floating recommended filters to use the same heuristic resolver as the advisor result.
- Added local-only heuristic copy for warm, street / chrome, night / neon, cinematic, travel, and chrome / monochrome directions.
- Added aspect-ratio-aware retake / crop advice for landscape, wide landscape, portrait, tall portrait, and square images.
- Kept recommendations limited to existing filter IDs in the current catalog.
- Polished selected-photo preview hierarchy with a safer preview max height, tighter vertical rhythm, compact error cards, and a shorter local-only note.
- Kept the Phase 16I-R1 floating bar UX, floating filter grid, auto-dismiss behavior, and floating AI advisor access intact.
- Updated README / iOS README and manual smoke tests.
- User manually accepted the local heuristic advisor / filter recommendation prototype and selected-photo / Inspiration UX polish in Xcode / Simulator.
- User accepted that selected filter family can influence advisor summary / suggestions / recommendations, image aspect ratio can influence crop / retake advice, recommendations remain limited to the existing 20 filters, invalid recommendation fallback is safe, and the floating bar remains unchanged and usable.

### Safety Notes

Phase 16K-L remains local-only and mock-only. It does not add real AI, cloud AI, backend code, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, photo upload, reference image upload, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, cloud save, StoreKit, premium / credits, real local download, save-to-Photos, export, Gemini Live, streaming, caption / social copy, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

Cloud save / paid-user cloud save / free local lossless download remain future dedicated entitlement / export phases only.

### Known TODOs

- Advisor heuristic remains local and simple, not real AI.
- Future local heuristic expansion may inspect safer image statistics only if explicitly scoped.
- Future real cloud advisor requires a backend boundary first.
- Cloud save / paid-user cloud save / free local lossless download require a dedicated entitlement / export phase.
- No StoreKit or export exists yet.

### Verification

- [x] `git status --short` checked before implementation.
- [x] Targeted Swift parse passed during implementation.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Persistence / export scan.
- [x] Frame / photo payload persistence scan.
- [x] Score / beauty wording scan.
- [x] Xcode build passed.

### User Xcode / Simulator Review

Accepted. User manually verified Phase 16K-L in Xcode / Simulator on 2026-06-12.

### Ready to Commit Phase 16K-L

Yes. Latest commit has not been created; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16J - Codex API Work Handoff Update

Status: Documentation-only handoff update; ready to commit after final review
Date completed: 2026-06-11

### Goal

Update the Codex transition handoff after the Codex API work period so the original Codex can resume later without relying on chat history.

### Completed

- Updated `docs/handoff/codex-transition-handoff.md` with a Codex API period update dated 2026-06-11.
- Recorded current branch / repo state, latest commit, clean git status at task start, and origin sync state.
- Recorded Phase 16H-Recovery completion.
- Recorded Phase 16I, Phase 16I-R1, and Phase 16I-R2 completion and user acceptance.
- Recorded current accepted app status for Camera, shutter, Pose Overlay, AI Snapshot, Filter Lab, Mock Post-capture Advisor, floating bar, selected-photo navigation, Inspiration, History, and Settings.
- Reconfirmed hard restrictions: no Phase 17, real AI, backend, network, upload, persistence, export, StoreKit, provider SDKs, secrets, or sensitive inference.
- Recorded known TODOs for placeholder pose artwork, mock-only Filter Generator, mock-only Photo Advisor, future local heuristic advisor, future backend boundary, and future entitlement / export phase.
- Recorded next recommended options: Phase 16K local heuristic advisor prototype, Phase 16L selected-photo / Inspiration polish, or Phase 16M export / local lossless download planning research.
- Preserved the 2026-06-15 handback template and added a draft / pending final update section.
- Updated README with a short pointer to the refreshed handoff.

### Safety Notes

Phase 16J is documentation-only. It does not change Swift source, app UI, app behavior, backend source, real AI integration, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, cloud save, StoreKit, premium / credits, real local download, save-to-Photos, export, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, Gemini Live, streaming, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

### Verification

- [x] `git status --short` checked before documentation edits.
- [x] Latest commit checked with `git log -1 --oneline`.
- [x] Origin sync checked with `git rev-list --left-right --count @{u}...HEAD`.
- [x] `git status --short` final check.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Forbidden behavior scan.

### Ready to Commit Phase 16J

Yes, after final verification. Commit only if explicitly requested by the user; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16I Closeout Acceptance

Status: User manually verified and accepted Phase 16I, Phase 16I-R1, and Phase 16I-R2 in Xcode / Simulator on 2026-06-11.

Accepted scope:

- Phase 16I Mock Post-capture AI Advisor UX is accepted.
- Phase 16I-R1 floating advisor / filter grid UX is accepted.
- Phase 16I-R2 selected-photo cleanup, Inspiration navigation fixes, and Filter Lab layout hardening are accepted.
- Floating bar is preserved as the primary selected-photo AI advice / filter entry.
- AI advisor and filter grid operate through the floating bar.
- Duplicate selected-photo inline AI / filter / mock save sections are reduced or removed.
- Back to Camera from Inspiration selected-photo flow switches to the outer Camera tab instead of nesting `CameraView`.
- Clear from Inspiration selected-photo flow clears the selected photo and returns to Inspiration.
- Filter Lab layout is hardened for square, portrait, landscape, wide, tall, and placeholder reference images.

Known TODOs:

- Mock Photo Advisor remains mock-only.
- Future real cloud advisor requires a backend boundary before any provider integration.
- Future local heuristic advisor may be added before real cloud AI if explicitly requested.
- Cloud save, paid-user cloud save, and free local lossless download require a dedicated future entitlement / export phase.
- StoreKit, premium gates, export, real local download, save-to-Photos, backend upload, and provider AI remain unimplemented.

Safety confirmation:

- No real AI, backend, `URLSession`, `URLRequest`, WebSocket, upload, cloud save, StoreKit, export, save-to-Photos, raw photo persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, Firebase / Gemini / OpenAI / StoreKit imports, API keys, provider config, score UI, beauty / attractiveness wording, or sensitive inference was added.

Ready to commit Phase 16I: Yes, when explicitly requested by the user. Do not commit or push automatically.

Ready for Phase 17 / Real AI: No.

---

## Phase 16I-R2 - Selected Photo Cleanup, Navigation Fix, and Filter Lab Layout Hardening

Status: Implemented and manually accepted by the user in Xcode / Simulator; ready to commit after final review
Date completed: 2026-06-11

### Goal

Keep the Phase 16I-R1 floating bar intact while removing selected-photo duplicate inline sections, fixing Inspiration import navigation, and hardening Filter Lab layout for varied reference image aspect ratios.

### Completed

- Removed large duplicate inline selected-photo filter grid, inline AI Photo Advisor card, legacy mock AI photo advice card, mock save card, and extra bottom Back / Continue section from the default selected-photo result content.
- Kept primary AI advice and filter operation in the floating bottom tray.
- Kept floating filter grid auto-dismiss behavior and floating AI advisor access unchanged.
- Replaced the Inspiration import sheet's nested `CameraView` with a selected-photo result flow.
- Fixed Back to Camera from Inspiration selected-photo flow to dismiss the result flow and switch to the outer Camera tab.
- Fixed Clear from Inspiration selected-photo flow to dismiss the result flow and return to Inspiration without switching tabs.
- Hardened Filter Lab before / after previews with aspect-fit images, max heights, safe clipping, and `ViewThatFits` fallback from horizontal to vertical layout.
- Hardened Filter Lab result card, slider, tags, warnings, and parameter summary to stay within container width.
- Documented future paid cloud save and future free local lossless download as a separate export / entitlement phase only.
- Updated README and manual smoke tests.
- User manually accepted the selected-photo cleanup, Back to Camera navigation fix, Clear navigation fix, and Filter Lab layout hardening in Xcode / Simulator.

### Safety Notes

Phase 16I-R2 is mock-only UX refinement. It does not add real AI, cloud AI, backend code, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, cloud save, StoreKit, premium / credits, real local download, save-to-Photos, export, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, Gemini Live, streaming, caption / social copy, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

Future paid cloud save and future free local lossless download require a dedicated export / entitlement phase.

### Verification

- [x] User Xcode / Simulator verification accepted on 2026-06-11.
- [x] `git status --short` checked during implementation.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse passed.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Persistence / export scan.
- [x] Frame / photo payload persistence scan.
- [x] Xcode build passed.

### Ready for User Review

Accepted. User visually reviewed and accepted the R2 result in Xcode / Simulator.

### Ready to Commit Phase 16I

Yes. Commit only if explicitly requested by the user; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16I-R1 - Floating Advisor / Filter Grid for Selected Photo UX

Status: Implemented and manually accepted by the user in Xcode / Simulator; ready to commit after final review
Date completed: 2026-06-11

### Goal

Reduce selected-photo result screen scroll friction across portrait, square, 4:5, 3:4, landscape, and placeholder images by keeping the main AI advice and filter controls reachable from a compact floating layer.

### Completed

- Added a selected-photo floating bottom action tray with AI advice and current filter access.
- Added compact floating filter grid access for the existing local filter catalog.
- Shows AI recommended filters first when available, validated against the existing filter catalog.
- Filter selection applies through the existing local filter mechanism and auto-dismisses the floating grid.
- Added floating AI advisor sheet access so users can view mock advisor content without scrolling to the inline card.
- Enforced one floating panel at a time: opening filters closes advisor, opening advisor closes filters, background / close collapses the active panel.
- Preserved the existing inline filter selector and inline Photo Advisor card as fallback / detail content.
- Added EN and zh-Hant localization for the floating tray, filter grid, recommendation, and collapse copy.
- Updated README and manual smoke tests.
- User manually accepted the floating advisor / filter grid UX in Xcode / Simulator.

### Safety Notes

Phase 16I-R1 is a UX refinement only. It does not add real AI, cloud AI, backend code, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, upload, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, save-to-Photos, export, Gemini Live, streaming, caption / social copy, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, local guidance, filter entry, lens controls, timer, flash, flip, AI Filter Generator Mock, History, and Settings remain preserved by scope.

### Verification

- [x] User Xcode / Simulator verification accepted on 2026-06-11.
- [x] `git status --short` checked during implementation.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Targeted Swift parse / build check.
- [x] Localization lint.
- [x] Forbidden imports scan.
- [x] Network / upload behavior scan.
- [x] Secrets / config scan.
- [x] Persistence / export scan.
- [x] Frame / photo payload persistence scan.
- [x] Xcode build passed.

### Ready for User Review

Accepted. User visually reviewed and accepted the R1 floating bar result in Xcode / Simulator.

### Ready to Commit Phase 16I

Yes. Commit only if explicitly requested by the user; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16I - Mock Post-capture AI Advisor UX

Status: Implemented and manually accepted by the user in Xcode / Simulator; ready to commit after final review
Date completed: 2026-06-11

### Goal

Add the first mock-only Post-capture AI Photo Advisor UX to the selected-photo result context so captured or imported photos can show a compact advisor card with mock analysis, existing-filter recommendations, retake / crop advice, and clear no-upload / no-persistence copy.

### Completed

- Added typed Post-capture Photo Advisor models:
  - `PhotoAdvisorInput`
  - `PhotoAdvisorResult`
  - `PhotoAdvisorSuggestion`
  - `PhotoAdvisorFilterRecommendation`
  - `PhotoAdvisorRetakeAdvice`
  - `PhotoAdvisorCropAdvice`
  - mode / source / confidence / priority / scene enums
- Added mock-only `PhotoAdvisorService` boundary and `MockPhotoAdvisorService`.
- Added 8 mock fixtures:
  - warm portrait
  - night street
  - dim indoor
  - CCD party
  - travel landscape
  - overexposed highlight
  - busy background
  - chrome mood
- Added `PhotoAdvisorResultValidator` with schema version, mode, source, max-count, filter whitelist, and fallback handling.
- Added `PhotoAdvisorViewModel` with idle, analyzing, success, failed, and unavailable states.
- Added compact `PhotoAdvisorResultView` and `PhotoAdvisorFilterRecommendationView`.
- Integrated the advisor card into `FilteredPhotoPreview`, so both captured and imported selected-photo result flows reuse the same card.
- Recommended filters apply through the existing filter selection mechanism and never create new filters or mutate the 20-filter catalog.
- Added English and Traditional Chinese localization for advisor labels, states, actions, fixtures, retake / crop advice, no-upload copy, and fallback copy.
- Updated README and manual smoke tests.
- User manually accepted the Mock Post-capture AI Advisor UX in Xcode / Simulator.

### Safety Notes

Phase 16I is mock-only. It does not add real AI, cloud AI, backend code, `CloudAIService`, `URLSession`, `URLRequest`, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, provider SDKs, API keys, Firebase config, `GoogleService-Info.plist`, `.env`, `.firebaserc`, real upload, photo upload, raw image persistence, AI response persistence, `UserDefaults`, Core Data, SwiftData, save-to-Photos, export, Gemini Live, streaming, caption / social copy, photo score, beauty / attractiveness score, identity / gender / age / emotion inference, sensitive attribute inference, or backend changes.

The advisor card is shown only in selected-photo result context, not as a live Camera preview overlay. Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, filter, lens, timer, flash, flip, Filter Lab, History, and Settings are preserved by scope.

### Verification

- [x] User Xcode / Simulator verification accepted on 2026-06-11.
- [x] `git status --short` checked during implementation.
- [x] Targeted Swift parse passed for new PostCapture advisor files plus filter/design dependencies.
- [x] Localization plist lint passed for EN and zh-Hant.
- [x] Command-line Xcode generic iOS Simulator build succeeded on 2026-06-11.
- [x] Docs and manual smoke tests updated.
- [x] `git diff --check` final pass.
- [x] `git diff --stat` final review.
- [x] Forbidden imports scan final pass.
- [x] Network / upload behavior scan final pass.
- [x] Secrets / config scan final pass.
- [x] Persistence / export scan final pass.
- [x] Frame / photo payload persistence scan final pass.
- [x] Xcode build passed.

### Ready for User Review

Accepted. User visually reviewed and accepted the mock advisor result in Xcode / Simulator.

### Ready to Commit Phase 16I

Yes. Commit only if explicitly requested by the user; do not commit or push automatically.

### Ready for Phase 17 / Real AI

No.

---

## Phase 16H-Recovery - Post-capture AI Advisor UX Research Backfill + Handoff Status Fix

Status: Added missing research backfill and corrected handoff mismatch; documentation-only; ready to commit after review
Date completed: 2026-06-11

### Goal

Recover the missing Phase 16H Post-capture AI Photo Advisor UX research backfill and fix the transition handoff state after read-only onboarding found that the handoff referenced Phase 16H before the research document existed in the repo / origin branch.

### Completed

- Added `docs/research/post-capture-ai-photo-advisor-ux-research.md`.
- Documented Post-capture AI Photo Advisor as the preferred mock-first advisor UX and the best current candidate for a future first real cloud AI endpoint after backend boundary work.
- Recorded product role, placement, UX pattern comparison, result content design, existing-filter recommendation rules, retake / crop copy principles, response schema, 8 mock fixtures, future real AI strategy, History / Inspiration integration, safety / privacy boundaries, UI copy, future architecture proposal, MVP phase plan, risks, and final recommendation.
- Updated `docs/handoff/codex-transition-handoff.md` to state that Phase 16H originally appeared in the handoff before its doc existed locally, and that Phase 16H-Recovery added the missing doc and corrected the state.
- Updated README research / roadmap references for Post-capture AI Advisor UX.

### Safety Notes

This was documentation-only. It did not change Swift source, app UI, backend code, real AI integration, network behavior, upload behavior, persistence, export, Firebase / Gemini / OpenAI / StoreKit imports, secrets, API keys, `GoogleService-Info.plist`, `.env`, or `.firebaserc`.

### Verification

- [x] `git status --short` checked.
- [x] `git diff --check` passed.
- [x] `git diff --stat` reviewed.
- [x] Forbidden imports scan passed.
- [x] Network / upload behavior scan passed.
- [x] Secrets / config scan passed.
- [x] Forbidden behavior scan passed.
- [x] Frame / photo persistence scan passed.
- [x] Xcode build not required because this task did not modify Swift source.

### Ready to Commit Phase 16H-Recovery

Yes, after user review.

### Ready for Phase 16I

No. Do not start Phase 16I until Phase 16H-Recovery is committed, pushed, read-only confirmed, and explicitly requested.

### Ready for Phase 17 / Real AI

No.

---

## Project Handoff - Codex API Transition Handoff Document

Status: Added as documentation-only handoff; ready to commit after review
Date completed: 2026-06-11

### Goal

Add a repository-local Codex transition handoff note so future Codex / Codex API sessions can continue work on the same Mac, repo, branch, and working tree without relying on the previous chat history.

### Completed

- Added `docs/handoff/codex-transition-handoff.md`.
- Documented the transition purpose, repo / environment, normal user workflow, current locally verified status, product direction, hard restrictions, recommended AI roadmap, key research docs, known TODOs, June 15 handback protocol, and how future Codex sessions should use the file.
- Recorded that Phase 16H was user-stated in the handoff request but not locally visible in this checkout at handoff creation time, so future Codex should verify git history / remote state before relying on it.
- Added README link to the handoff document.

### Safety Notes

This was documentation-only. It did not change Swift source, app UI, backend code, network behavior, upload behavior, persistence, export, Firebase / Gemini / OpenAI / StoreKit imports, secrets, API keys, `GoogleService-Info.plist`, `.env`, or `.firebaserc`.

### Verification

- [x] `git status --short` checked.
- [x] `git diff --check` passed.
- [x] `git diff --stat` reviewed.
- [x] Forbidden imports scan passed.
- [x] Network / upload behavior scan passed.
- [x] Secrets / config scan passed.
- [x] Forbidden behavior scan passed.
- [x] Xcode build not required because this task did not modify Swift source.

### Ready to Commit Handoff Doc

Yes, after user review.

### Ready for Phase 16I

No. Do not start Phase 16I until the handoff doc is committed, pushed, read-only confirmed, and explicitly requested.

---

## Phase 16G - AI Filter Generator Mock in Inspiration

Status: Implemented as F1 mock-only Filter Lab; user Xcode / Simulator verification temporarily accepted; ready to commit
Date completed: 2026-06-11

### Goal

Add the first AI Filter Generator mock flow inside the Inspiration tab so users can choose a reference image, see a mock analyzing state, preview a structured mock generated filter recipe, adjust intensity, and apply it as a session-only mock preview without upload, backend, real AI, persistence, LUT, or catalog changes.

### Completed

- Added a visible Filter Lab / Generate My Filter entry card to the Inspiration tab.
- Added `Features/Inspiration/FilterLab/` with:
  - `GeneratedFilterRecipe`
  - `GeneratedFilterParameterSet`
  - `FilterGenerationService`
  - `MockFilterGenerationService`
  - `FilterRecipeValidator`
  - `FilterLabViewModel`
  - `FilterLabView`
  - `ReferenceImagePickerView`
  - `GeneratedFilterResultView`
  - `GeneratedFilterPreviewView`
  - `GeneratedFilterPreviewRenderer`
- Reused PhotosPicker for one reference image without full-library access.
- Added a sample-reference fallback so the mock flow can be tested when picker / simulator photo selection is inconvenient.
- Added a mock unavailable state for failure / unavailable UI coverage.
- Added short mock analyzing copy:
  - extracting tone
  - generating mock recipe
  - preparing preview
- Added 6 structured mock recipe options:
  - Golden Rooftop Dream
  - Soft Film Memory
  - Neon Street Fade
  - CCD Party Warm
  - Cool Chrome Portrait
  - Amber Travel Glow
- Added validator / clamp helper for finite values and safe ranges.
- Added local before / after preview using a mock Core Image recipe approximation.
- Added intensity slider for session-only preview tuning.
- Added session-only apply action that marks the mock filter as applied to the Filter Lab preview only.
- Fixed Phase 16G Swift concurrency isolation build issues reported by Xcode by moving the default mock service construction into the view model initializer body and moving the fallback recipe to the non-UI recipe model.
- User manually verified Phase 16G in Xcode / Simulator and temporarily accepted the current mock-only flow.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README status notes.
- Updated manual smoke tests.

### Changed Files

- README.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterRecipe.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterParameterSet.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterGenerationService.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/MockFilterGenerationService.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterRecipeValidator.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabView.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/ReferenceImagePickerView.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterResultView.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewView.swift
- ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewRenderer.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Safety Notes

Phase 16G is F1 mock-only. It does not add real AI, provider calls, backend code, CloudAIService, URLSession, URLRequest, WebSocket, Firebase / Gemini / OpenAI / StoreKit imports, API keys, Firebase config, GoogleService-Info.plist, `.env`, `.firebaserc`, real upload, reference image upload, raw image persistence, UserDefaults, Core Data, SwiftData, save-to-Photos, export, LUT generation, local heuristic real analysis, public sharing, premium credits, exact-copy / brand / film / creator clone claims, or Phase 17 work.

Reference images stay in memory for the current Filter Lab session. Generated filters are mock/session-only and are not added to the permanent 20-filter catalog.

### Verification

- [x] Targeted Swift parse passed for `HomeView.swift` and the Filter Lab files.
- [x] Targeted Filter Lab typecheck caught and fixed an `EmptyStateView` argument-order issue.
- [x] Targeted Filter Lab typecheck passed after the Xcode-reported `FilterLabViewModel` / `FilterRecipeValidator` actor-isolation fix.
- [x] User Xcode / Simulator verification temporarily accepted on 2026-06-11.
- [x] Localization lint passed for English and Traditional Chinese `Localizable.strings`.
- [x] Final `git status --short --untracked-files=all` checked before response.
- [x] `git diff --check` passed.
- [x] `git diff --stat` reviewed for tracked files; untracked Filter Lab source files are listed in git status.
- [x] Forbidden imports scan passed.
- [x] Network / upload behavior scan passed.
- [x] Secrets / config scan passed.
- [x] Persistence / export scan passed.
- [x] Frame / photo payload persistence scan passed; matches are existing camera capture / local guidance analyzer code only.
- [x] Sandboxed Xcode build was attempted and failed due CoreSimulator / `sandbox-exec` environment restrictions.
- [x] Follow-up Swift typecheck excluding AppleDouble metadata was attempted and blocked by the existing SwiftUI `#Preview` macro plugin / sandbox environment after the Phase 16G argument-order issue was fixed.

### Known TODOs

- Filter Generator currently remains mock-only.
- Generated filter recipe visual quality and recipe-to-filter mapping may need tuning.
- F2 local heuristic extraction is not implemented.
- F3 / real backend AI remains blocked until Cloud AI boundary work is explicitly implemented.
- LUT generation is not implemented.
- Generated filters are not saved, synced, exported, or added to the permanent catalog.
- Custom filter persistence is not implemented.

### Ready to Commit Phase 16G

Yes. User Xcode / Simulator review has been temporarily accepted; do not commit until explicitly requested.

### Ready for Phase 17 / Real AI

No. Phase 16G is mock-only and does not authorize real AI, backend implementation, upload, or provider integration.

---

## Phase 16F - AI Filter Generator + Cloud AI Architecture Research Backfill

Status: Implemented as documentation-only research backfill; awaiting review
Date completed: 2026-06-11

### Goal

Backfill two research reports into the repo as source-of-truth planning documents for future AI Filter Generator work and future real cloud AI backend boundary work.

### Completed

- Added `docs/research/ai-filter-generator-research.md`.
- Added `docs/research/cloud-ai-architecture-research.md`.
- Recorded AI Filter Generator recommendation:
  - Start with F1 Mock Filter Generator.
  - Add F2 Local Heuristic Filter Extractor before cloud.
  - Add F3 Cloud AI Style Analysis only after consent, backend, quota, validation, and privacy copy are ready.
  - Leave F4 LUT / Saved Custom Filter for later.
  - Use structured filter recipe JSON, not AI-generated bitmaps, arbitrary Core Image names, shader/code, or direct rendering control.
- Recorded Cloud AI Architecture recommendation:
  - Keep the current app mock-only / local-only until an explicit backend boundary phase.
  - Do not put Gemini / OpenAI SDKs or provider API keys in iOS.
  - iOS should talk only to our backend.
  - Backend owns provider credentials, request validation, image handling, provider calls, structured JSON validation, safety filtering, and quota / cost guard.
  - First real AI endpoint should be `POST /v1/ai/photo-advisor`, not Gemini Live, streaming, or AI Filter Generator.
- Updated `README.md` with a short Phase 16F status and links to both research docs.

### Changed Files

- README.md
- docs/phase-log.md
- docs/research/ai-filter-generator-research.md
- docs/research/cloud-ai-architecture-research.md

### Safety Notes

Phase 16F is documentation-only. It does not modify Swift app behavior, Camera UI, filter UI, backend code, AI Filter Generator implementation, CloudAIService implementation, real AI integration, real network calls, URLSession/URLRequest usage, WebSocket usage, upload, Firebase / Gemini / OpenAI / StoreKit imports, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, persistence, UserDefaults, Core Data, SwiftData, save-to-Photos, export, raw frame/photo/cloud request payload persistence, or logging.

### Verification

- [x] Pre-check confirmed working tree was clean before Phase 16F edits.
- [x] No Swift source was modified by Phase 16F.
- [x] No backend source was modified by Phase 16F.
- [x] Documentation-only change; Xcode build not required.
- [x] Final `git status --short` checked before response.
- [x] `git diff --check` passed.
- [x] `git diff --stat` reviewed.
- [x] Forbidden imports scan found no iOS Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore / Gemini / OpenAI / StoreKit imports.
- [x] Network / upload behavior scan found no new iOS real network, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior; existing future-only TypeScript analyzer placeholders remain unchanged.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, private keys, provisioning profiles, or production config files.
- [x] Forbidden behavior scan found only docs safety text and existing placeholder references, not new implementation.
- [x] Frame / photo persistence scan found only existing Phase 15B / 15C in-memory frame analyzer references, not new raw frame/photo/cloud payload persistence or logging.

### Known TODOs

- Future AI Filter Generator should start with F1 mock UX and F2 local heuristic analysis before cloud AI.
- Future Cloud AI work should start with a backend boundary and `POST /v1/ai/photo-advisor`, not Gemini Live or Filter Generator.
- Draft JSON Schemas, consent copy, privacy labels, provider choice, cost estimates, and logging policy before any real AI implementation.

### Ready to Commit Phase 16F

Yes, after final verification; do not commit / push automatically.

### Ready for Phase 17 / Real AI

No. Phase 16F is research backfill only and does not authorize real AI, backend implementation, or upload.

---

## Phase 16E - Static Pose Overlay MVP

Status: Manually verified and accepted by the user in Xcode / Simulator after R1; ready to commit after final review
Date completed: 2026-06-11

### R1 Fix - Pose Button Safe-Area + Simulator Overlay Visibility

Status: Manually verified and accepted by the user in Xcode / Simulator
Date completed: 2026-06-11

R1 fixes two Phase 16E blockers found in Simulator review:

- Moved the compact Pose button out of the top control row so it no longer collides with the Dynamic Island / status area.
- Placed Pose with the existing lower-left viewfinder tool area above the Filter pill.
- Removed the `permissionState == .authorized` guard from the pose overlay layer so selected static pose outlines also render over the camera-unavailable / Simulator fallback canvas.
- Increased placeholder outline visibility for testing by using warm-white line art, a slightly thicker stroke, stronger shadow, and `0.5` overlay opacity.
- Kept the overlay passive with `.allowsHitTesting(false)` and `.accessibilityHidden(true)`.
- Did not change capture output or camera pipeline.

R1 verification:

- `git diff --check` passed.
- Targeted Swift parse passed for Phase 16E PoseGuides files and `CameraView.swift`.
- Localization lint passed for English and Traditional Chinese `Localizable.strings`.
- Sandboxed command-line Xcode simulator build was attempted and reached Swift compilation, but failed due CoreSimulator / sandbox-exec environment restrictions, not a confirmed Phase 16E-R1 source error.
- Forbidden imports, Vision body pose, network / upload, secrets / config, persistence / export, and frame / photo payload persistence scans passed with only existing local/mock scaffolds and docs placeholders noted.

### User Manual Verification

The user manually verified Phase 16E in Xcode / Simulator after the R1 fix and accepted the MVP state:

- Pose button is no longer blocked by the Dynamic Island / status area.
- Tapping Pose opens the pose picker.
- Selecting a pose displays the static overlay.
- Simulator / camera-unavailable fallback also displays the selected overlay.
- Close pose hides the overlay.
- Mirror pose flips the overlay horizontally.
- The overlay does not block shutter, AI Snapshot, filter, guidance, lens, timer, flash, or flip controls.
- Camera remains fullscreen without requiring scroll; shutter remains visible and tappable.
- Existing AI Snapshot, guidance, filter, and lens callouts still work.
- No Vision body pose, real AI, network, upload, persistence, or export behavior was added.
- Current pose outlines are placeholder / visually rough, but accepted for this MVP. A later dedicated phase should replace them with proper original PDF/vector pose assets and improve pose gallery artwork.

### Goal

Add the first camera-first, non-AI static Pose Overlay MVP so users can select a simple pose guide, see a passive outline over the viewfinder, close it, or mirror it without changing capture output or adding AI / Vision body pose detection.

### Completed

- Added a `Features/Camera/PoseGuides/` feature folder.
- Added session-only pose guide models and catalog:
  - `PoseGuide`
  - `PoseGuideCategory`
  - `PoseFramingHint`
  - `PoseOverlayAnchor`
  - `PoseGuideCatalog`
  - `CameraPoseOverlayState`
- Added 8 static MVP pose guides:
  - `solo_side_stand`
  - `solo_walk`
  - `half_body_turn_back`
  - `couple_side_by_side`
  - `couple_staggered`
  - `menswear_wall_lean`
  - `womenswear_hair_touch`
  - `seated_side_pose`
- Added a SwiftUI `Canvas`-based placeholder line-art renderer so the MVP uses original in-code outlines instead of external or copied assets.
- Preserved `assetName` on `PoseGuide` so future original PDF vector assets can replace the placeholder line art.
- Added `PoseGuideButton` to the Camera top controls as a compact dark-glass Pose entry.
- Added `PoseSelectorView` as a compact Camera quick picker with title, category, hint, and selected state.
- Integrated `.pose` into the existing `CameraCallout` flow so guidance, AI Snapshot, filter, lens, and pose picker are mutually exclusive.
- Added `PoseOverlayView` above the camera preview and below interactive camera controls.
- Added an active pose badge with close and mirror controls in the camera controls layer.
- Kept the pose overlay passive with `.allowsHitTesting(false)` and `.accessibilityHidden(true)`.
- Kept overlay state in memory only; no UserDefaults, Core Data, SwiftData, disk persistence, or cloud sync was added.
- Updated English and Traditional Chinese localization strings for Pose button, picker, categories, and 8 pose titles / hints.
- Updated README / iOS README status notes.
- Updated manual smoke tests.

### Changed Files

- README.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/PoseGuide.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/PoseGuideCatalog.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/CameraPoseOverlayState.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/PoseOverlayView.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/PoseSelectorView.swift
- ios-app/AIPhotoApp/Features/Camera/PoseGuides/PoseGuideButton.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Safety Notes

Phase 16E implements a UI-only static Pose Overlay MVP. It does not add AI pose suggestion, Apple Vision body pose detection, `VNDetectHumanBodyPoseRequest`, pose matching, pose score, body / appearance scoring, face recognition, identity / gender / age / emotion inference, real AI, network calls, URLSession/URLRequest, WebSocket, camera frame upload, Firebase / Gemini / OpenAI / StoreKit imports, Firebase config, API keys, backend code, persistence, UserDefaults, Core Data, SwiftData, save-to-Photos, export, raw frame/photo/cloud request payload persistence, logging, or third-party assets.

The overlay is a SwiftUI UI layer only. It is not part of `AVCapturePhotoOutput` and should not be written into captured photos.

### Verification

- [x] Final `git status --short` checked before response.
- [x] `git diff --check` passed.
- [x] `git diff --stat` reviewed.
- [x] Targeted Swift parse passed for Phase 16E PoseGuides files and `CameraView.swift`.
- [x] Sandboxed command-line Xcode simulator build was attempted and reached Swift compilation, but failed due CoreSimulator / sandbox-exec environment restrictions, not a confirmed Phase 16E source error.
- [x] Generic iOS device command-line build with signing disabled was attempted; new PoseGuides files were included in target compile input, but the build still failed due sandbox-exec environment restrictions, not a confirmed Phase 16E source error.
- [x] Localization lint passed for English and Traditional Chinese `Localizable.strings`.
- [x] Forbidden imports scan passed for Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore / Gemini / OpenAI / StoreKit imports.
- [x] Vision body pose scan found no `VNDetectHumanBodyPoseRequest`, no body pose matching, and no pose scoring implementation.
- [x] Network / upload behavior scan found no new real network, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior; only existing future-only TypeScript analyzer placeholders remain.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, private keys, provisioning profiles, or production config; broader text scan only found existing `.env.example` placeholders and docs/test safety text.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, disk persistence, save-to-Photos, or export behavior; existing PhotosPicker `loadTransferable` paths remain expected.
- [x] Frame / photo payload persistence scan found only existing Phase 15B / 15C in-memory frame analyzer references, not new raw frame/photo/cloud payload persistence or logging.
- [x] User Xcode / Simulator review accepted on 2026-06-11 after R1.

### Known TODOs

- Current Canvas placeholder outlines are visually rough and accepted only for the Phase 16E MVP.
- Replace placeholder outlines with original or commercially licensed PDF/vector pose assets in a later dedicated pose artwork phase.
- Add a better pose gallery and broader pose categories in a later phase.
- Tune overlay scale / offset per real device after iPhone Simulator and physical-device review.
- Keep categories inclusive: `???` / `????` / `???¢Â€è¬’î–¥ are browsing labels only, not user classification.
- AI pose suggestion and Vision body matching remain future work and are not part of P1.

### Ready to Commit Phase 16E

Yes. User Xcode / Simulator verification has accepted the MVP state after R1; do not commit / push automatically.

### Ready for Phase 17 / Real AI

No. Phase 16E is a non-AI static overlay MVP and does not authorize real AI integration.

---

## Phase 16D - Pose Overlay Research Report Backfill

Status: Implemented as documentation-only research backfill; awaiting review
Date completed: 2026-06-11

### Goal

Formalize the Pose Overlay / Pose Master-like camera guide research report inside the repo as the source of truth for a future static Pose Overlay MVP implementation phase.

### Completed

- Added `docs/research/pose-overlay-camera-guide-research.md`.
- Recorded executive summary that Pose Overlay is worth building and fits the camera-first retro camera app.
- Recorded the MVP recommendation: static, low-risk, non-AI pose overlay first.
- Recorded recommended architecture:
  - SwiftUI `ZStack`
  - `UIViewRepresentable` hosting `AVCaptureVideoPreviewLayer`
  - camera preview at bottom
  - pose overlay above preview
  - guidance overlay above pose overlay
  - camera controls as topmost interactive layer
  - `PoseOverlayView.allowsHitTesting(false)`
  - capture output remains `AVCapturePhotoOutput`
- Recorded asset strategy: Asset Catalog PDF vector assets first, PNG fallback, SVG not primary MVP path, Canvas/Shape/Lottie deferred.
- Recorded overlay layout strategy: align to viewfinder rect, consider `resizeAspectFill`, portrait-only MVP, scale / offset / opacity / anchor defaults, and manual mirror support.
- Recorded hit-testing and capture safety requirements.
- Recorded Camera quick Pose button, compact picker, Inspiration pose gallery, pose name badge, close, and mirror UX direction.
- Recorded pose categories and inclusive principle.
- Recorded Vision body pose detection evaluation as P4/later research, not MVP.
- Recorded privacy / App Store / safety boundaries.
- Recorded future implementation file architecture and model shape for Phase 16E.
- Recorded P1-P4 MVP phase plan.
- Updated `README.md` with a short Phase 16D status and link.

### Changed Files

- README.md
- docs/phase-log.md
- docs/research/pose-overlay-camera-guide-research.md

### Safety Notes

Phase 16D is documentation-only. It did not modify Swift app behavior, Camera UI, Pose Overlay implementation, Vision body pose implementation, AI pose suggestion, real AI integration, real network calls, URLSession/URLRequest usage, Firebase/Gemini/OpenAI/StoreKit imports, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, backend code, persistence, UserDefaults, Core Data, SwiftData, save-to-Photos, export, raw frame/photo/cloud request payload persistence, or logging.

### Verification

- [x] Pre-check found an existing modified Swift file `ios-app/AIPhotoApp/App/AppTabBarMetrics.swift` in the working tree before Phase 16D edits; Phase 16D did not touch it.
- [x] No Swift source was intentionally modified by Phase 16D.
- [x] No backend source was modified by Phase 16D.
- [x] Documentation-only change; Xcode build not required.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan found no iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Network / upload behavior scan found only existing future-only TypeScript placeholder analyzer names, not new real behavior.
- [x] Secrets / config scan found only existing `.env.example` placeholders and docs scan commands, not real secrets or production config.
- [x] Frame / photo persistence scan found only existing Phase 15B / 15C local frame analyzer references, not new raw frame/photo/cloud request payload persistence or logging behavior.

### Known TODOs

- User should review the research backfill.
- Future Phase 16E can implement P1 Static Pose Overlay MVP only if explicitly requested.
- Future Phase 16E should use original or commercially licensed pose assets.
- Vision body pose detection remains P4/later research and should not be included in the first Pose Overlay MVP.

### Ready for Phase 16E

No. Phase 16E implementation should not start until Phase 16D is reviewed and explicitly requested.

### Ready for Phase 17 / Real AI

No. Phase 16D is Pose Overlay research documentation only and does not authorize real AI integration.

---

## Phase 16C - AI Feature Definition + Prompt UX Contract

Status: Implemented as documentation-only contract; awaiting review
Date completed: 2026-06-10

### Goal

Define the future AI / AI-like product role, feature map, prompt UX style, shared response schema, safety boundaries, Pose Overlay concept, AI Filter Generator concept, research backlog, and future roadmap without changing app behavior or connecting real AI.

### Completed

- Added `docs/ai-feature-definition-and-prompt-contract.md`.
- Defined Product AI Role: camera-first assistant, coach, filter recommender, style advisor, and inspiration engine; not an AI chat app.
- Documented AI / AI-like Feature Map:
  - Local Camera Coach
  - Pose Overlay / Pose Master-like Guide
  - AI Snapshot
  - Post-capture AI Photo Advisor
  - AI Filter Recommendation
  - AI Filter Generator
  - Inspiration AI
  - Future AI Edit
  - Future Voice / Spoken Camera Assistant
  - Future Gemini Live / Real-time AI
- Documented Local Camera Coach behavior and copy examples.
- Added Pose Overlay concept, including couple / male / female / neutral categories, inclusive principles, and staged roadmap.
- Documented Phase 16 AI Snapshot boundaries as explicit-tap, consent-gated, mock-only, no background upload, no live stream, and no raw frame / request persistence.
- Defined Post-capture AI Photo Advisor boundaries and prohibited sensitive / appearance scoring behavior.
- Added AI Filter Recommendation mapping for existing filter families.
- Added AI Filter Generator concept, structured recipe example, analyzed style features, and F1-F4 phases.
- Added Inspiration AI, Future AI Edit, Future Voice, and Future Gemini Live sections.
- Added initial structured AI response contract shared by mock / local / cloud sources.
- Added prompt style guide with Traditional Chinese / Cantonese-friendly examples.
- Added explicit safety / privacy boundaries and research backlog.
- Added future roadmap: Phase 16C, 16D, 16E, 16F, 17, 18, 19+.
- Updated `README.md` with a short Phase 16C status and link.

### Changed Files

- README.md
- docs/ai-feature-definition-and-prompt-contract.md
- docs/phase-log.md

### Safety Notes

Phase 16C is documentation-only. It did not modify Swift app behavior, Camera UI, Pose Overlay implementation, Filter Generator implementation, backend code, real AI integration, Gemini Live, live video streaming, WebSocket, URLSession/URLRequest usage, real network calls, upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Firebase/Gemini/OpenAI/StoreKit imports, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, UserDefaults, Core Data, SwiftData, persistence, save-to-Photos, export, third-party SDKs, face recognition, identity inference, sensitive inference, raw frame/photo/cloud request payload persistence, or logging.

### Verification

- [x] `git status --short` checked before changes.
- [x] No Swift source was modified.
- [x] No backend source was modified.
- [x] Documentation-only change; Xcode build not required.
- [ ] Final `git diff --check` and safety scans to be run before response.

### Known TODOs

- Phase 16D can do AI UX unification only if explicitly requested.
- Phase 16E Pose Overlay MVP can start static/non-AI only if explicitly requested.
- Phase 16F AI Filter Generator should start mock-only if explicitly requested.
- Real cloud AI backend boundary should not start before Phase 17.
- Real provider integration should not start before Phase 18 and requires backend, privacy, consent, cost, quota, and schema validation review.

### Ready for Phase 17 / Real AI

No. Phase 16C only defines the contract. Real AI integration remains blocked until a later explicit Phase 17+ request.

---

## Phase 16 + Phase 16A-R UX Rescue Closeout

Status: Manually verified by user in Xcode / Simulator; ready to commit after final review
Date completed: 2026-06-10

### Accepted Manual Verification

The user manually verified the current Phase 16 / 16A-R working tree in Xcode / Simulator and accepted the current state:

- Camera UX is acceptable.
- Shutter is visible and tappable.
- Camera does not require scrolling.
- AI Snapshot compact entry, consent, and mock result work.
- Mock / Local guidance works.
- Guidance / AI / filter / lens callouts do not have obvious overlap.
- Filter pill / callout works.
- Lens dropdown works.
- Flash, timer, flip, and capture work.
- Front-camera screen flash scaffold remains available.
- Phase 15B brightness guidance works.
- Phase 15C face framing / headroom guidance works.
- Phase 15D stability / priority / anti-flicker works.
- Camera tab no longer has Photo Picker.
- Inspiration tab has the photo import entry.
- Ordinary pages bottom tab bar is acceptable.
- Settings, Inspiration, and History content no longer have blocker-level bottom navigation obstruction.
- 20 filters / grouping work.
- Mock save, mock AI, and local history work.
- English and Traditional Chinese localization has no raw keys.
- No real network, upload, AI, Firebase, StoreKit, persistence, or export behavior was observed.
- No secrets, Firebase config, or API keys were added.
- No backend changes were added.

### Scope Confirmation

- Current changed / untracked files are Phase 16 mock cloud snapshot boundary, Phase 16A-R Camera UX rescue, ordinary tab bar safe-area polish, localization, and docs/test updates.
- `ios-app/AIPhotoApp/App/File.txt` was previously identified as an accidental prompt dump and has been removed.
- Phase 16 remains mock-only: app-side UI, memory-only state, service protocol boundary, mock cloud response, consent / privacy UX, and failed / unavailable mock states.
- Phase 16A-R remains UX rescue only: fullscreen Camera shell, compact AI Snapshot, compact guidance, filter callout, lens dropdown, Inspiration import flow, bottom navigation polish, and ordinary tab bar safe-area fixes.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, Firebase config, or production config.
- Did not add UserDefaults, Core Data, SwiftData, raw frame persistence, selected photo persistence, or cloud request payload persistence.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to commit Phase 16 + 16A-R: Yes, after final review.

Ready for Phase 16B: No. Phase 16 + 16A-R should be committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R10 - Ordinary Tab Bar Placement Hard Fix

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Fix ordinary-page floating tab bar placement at the app shell layer so Inspiration, History, and Settings show a complete floating tab bar above the home indicator instead of relying on a bottom `safeAreaInset` that could still appear clipped.

### Findings

- Phase 16A-R9 did update shared metrics, but ordinary tab bar rendering still lived inside `.safeAreaInset(edge: .bottom)`.
- On the affected simulator layout, that meant increasing bottom padding mostly changed the inset container instead of guaranteeing the tab bar itself was positioned fully inside visible screen bounds.
- No `.offset(y:)`, Camera rail sharing, or content-page clipping was found as the main cause.
- The staged `ios-app/AIPhotoApp/App/File.txt` was an accidentally generated prompt text file, not source code, and was removed.

### Completed

- Replaced the ordinary-page `safeAreaInset` tab bar presentation with a root `GeometryReader` / `ZStack` bottom overlay.
- The ordinary floating tab bar now uses explicit bottom placement via `ordinaryTabBarBottomOffset(for:)`.
- Added explicit ordinary tab bar estimated height, bottom fallback, bottom clearance, and content bottom padding metrics.
- Kept Camera on the fullscreen path and did not route Camera through ordinary tab bar placement.
- Kept Inspiration and History shared bottom content padding and Settings shared footer spacer.
- Removed the accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Full sandboxed command-line Xcode simulator build remains blocked by CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions, not a confirmed Phase 16A-R10 source error.
- No real service integration was added.

### Known TODOs

- Xcode / Simulator visual QA is required to confirm the ordinary tab bar is now fully visible and no longer clipped.
- Ordinary content bottom padding may need minor tuning after visual QA if the tab bar now floats higher than desired.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R10 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R9 - Bottom Navigation Safe-Area Polish

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Polish bottom navigation safe-area behavior without redesigning the Camera viewfinder: lift ordinary content-page navigation, keep content clear of the floating tab bar, and add a small safe-area guard to the Camera compact mode rail.

### Completed

- Split bottom navigation metrics into clearer ordinary-page and Camera-specific values.
- Raised ordinary-page floating tab bar spacing so Inspiration, History, and Settings sit farther above the home indicator / bottom edge.
- Added a shared ordinary content footer inset and applied it to Inspiration and History ScrollView content.
- Increased the existing Settings footer spacer through the same shared metric so the subscription / polish row can scroll above the floating tab bar.
- Added a minimum Camera mode rail home-indicator clearance while keeping the Camera rail more compact than the ordinary floating tab bar.
- Kept Camera viewfinder structure, top controls, shutter row, AI Snapshot, Live Guidance, filter callout, and lens dropdown behavior unchanged except for bottom safe-area metrics.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/History/HistoryView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Full sandboxed command-line Xcode simulator build remains blocked by CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions, not a confirmed Phase 16A-R9 source error.
- No real service integration was added.

### Known TODOs

- Xcode / Simulator visual QA is required to confirm ordinary-page tab bar lift is sufficient and not excessive.
- Xcode / Simulator visual QA is required to confirm Settings bottom CTA, Inspiration bottom content, and History empty/list content clear the floating tab bar.
- Real-device safe-area polish may still be needed for home-indicator variants.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R9 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R8 - Hide Camera Status Bar + Lift Content Tab Bar

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Hide the iOS status bar only on the fullscreen Camera tab, keep normal status bars on Inspiration / History / Settings, and lift the ordinary floating tab bar so content tabs look stable above the home indicator.

### Completed

- Added Camera-only `.statusBarHidden(selectedTab == .camera)` at the app shell level.
- Kept Inspiration, History, and Settings on the ordinary content-page path so those tabs retain the normal iOS status bar.
- Added a Camera-specific top control metric so Live Guidance mode, flash, and timer controls can sit at a natural top-camera position without colliding with status UI.
- Lifted the ordinary floating tab bar above the safe-area baseline while leaving Camera mode rail metrics separate.
- Preserved Settings bottom footer spacing so the subscription / polish CTA remains scrollable above the tab bar.
- Kept Camera fullscreen layout, shutter row, compact mode rail, AI Snapshot, Live Guidance, filter, and lens callout behavior unchanged except for top/bottom inset polish.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Full sandboxed command-line Xcode simulator build remains blocked by CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions, not a confirmed Phase 16A-R8 source error. The failed frontend command includes `AppTabBarMetrics.swift`, confirming it is part of the build input.
- No real service integration was added.

### Known TODOs

- Xcode / Simulator visual QA is required to confirm Camera hides the iOS status bar while Inspiration, History, and Settings still show it.
- Xcode / Simulator visual QA is required to confirm the lifted ordinary floating tab bar is high enough without feeling detached from the bottom navigation area.
- Device-specific safe-area polish may still be needed after real-device review.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R8 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R7 - Camera Control Position Polish + Content Tab Bar Lift

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Polish Camera overlay positions after the R6 fullscreen fix, prevent controls from crowding the status bar or each other, and lift the non-Camera floating tab bar so it is fully visible above the bottom edge.

### Completed

- Raised ordinary-page floating tab bar bottom fallback spacing so Inspiration, History, and Settings no longer place the tab bar too close to the home indicator / bottom edge.
- Kept Settings bottom footer spacer so the subscription / polish row can still scroll above the tab bar.
- Added more Camera top safe-area clearance so Live Guidance mode, flash, and timer controls sit below the status bar / Dynamic Island area.
- Split Camera filter and guidance overlay bottom metrics so the filter pill and guidance pill/card use separate vertical slots.
- Kept AI Snapshot, shutter, flip camera, and lens dropdown in one coordinated bottom control band.
- Moved the lens dropdown slightly higher and right-aligned near the flip / lens control so it is less likely to collide with the flip button.
- Added a small shadow to the Camera compact mode rail to better match the ordinary floating tab bar visual language.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Full sandboxed command-line Xcode simulator build remains blocked by CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions, not a confirmed Phase 16A-R7 source error.
- No real service integration was added.

### Known TODOs

- Xcode / Simulator visual QA is required to confirm top controls are comfortably below the status area on the target simulator.
- Xcode / Simulator visual QA is required to confirm the ordinary-page bottom tab bar is lifted enough without creating excessive content-page bottom space.
- Device-specific safe-area polish may still be needed after real-device review.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R7 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R6 - Source-to-Simulator Verification + Hard Layout Fix

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Confirm whether Phase 16A-R5 source changes were actually part of the iOS target, then make a more visible layout fix for Settings bottom CTA obstruction and Camera bottom empty space.

### Source-to-Simulator Findings

- The app entry path is `AIPhotoApp` -> `AppRootView` -> `MainTabShellView`; there is no second root shell.
- `MainTabShellView` no longer contains the native `TabView`; it switches directly between Camera, Inspiration, History, and Settings.
- `AppTabBarMetrics.swift` sits inside the Xcode project's filesystem-synchronized `AIPhotoApp` root group.
- The sandboxed `xcodebuild` frontend command listed `AppTabBarMetrics.swift`, confirming the file is included in the target compile input.
- `CameraView.swift` is the active Camera view used by `MainTabShellView`.
- R5 likely looked visually unchanged because non-Camera pages still used an overlay-style custom tab bar plus content spacing, while Settings is a `List`; Camera capture mode also still lived inside a `NavigationStack`, leaving room for navigation safe-area behavior to soften the fullscreen change.

### Completed

- Changed non-Camera navigation from an overlay floating tab bar to a bottom `safeAreaInset`, so Inspiration / History / Settings content is laid out above the tab bar instead of being covered by it.
- Added a small Settings `List` footer spacer using `AppTabBarMetrics.contentPageFooterSpacer` so the bottom subscription / polish row can scroll fully above the tab bar.
- Kept Camera on a separate fullscreen path with no ordinary content-page inset.
- Removed `NavigationStack` from the primary Camera capture path. Navigation chrome is now only used for selected/imported photo flow or explicit close-button presentation.
- Tightened Camera metrics so the compact mode rail sits directly at the bottom and the shutter row remains an overlay above it.
- Reduced Camera overlay spacing further so Live Guidance / filter overlays sit closer to the shutter controls without consuming layout height.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed during implementation.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Layout modifier scan confirmed the primary Camera capture path no longer uses `NavigationStack`; remaining Camera `NavigationStack` usage is for selected/imported photo flow and sheets.
- Full sandboxed command-line Xcode simulator build remains blocked by CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions, not a confirmed Phase 16A-R6 source error. The failed frontend command includes `AppTabBarMetrics.swift`, confirming it is part of the build input.
- Unsandboxed command-line Xcode build was requested but rejected by the current workspace credits limit, so no unsandboxed build result is available.

### Known TODOs

- Xcode / Simulator visual QA is required to confirm Settings bottom CTA is now fully visible and tappable.
- Xcode / Simulator visual QA is required to confirm Camera bottom black space is visibly reduced after removing `NavigationStack` from capture mode.
- If Simulator still shows the old layout after a clean build, clear DerivedData / uninstall the simulator app and rebuild to rule out stale install state.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R6 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R5 - Navigation Overlay Root-Cause Investigation + Layout Fix

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Investigate the shared bottom navigation root cause behind Settings CTA obstruction and Camera bottom empty space, then fix the layout at the app shell / overlay level instead of continuing surface-level Camera padding tweaks.

### Root Cause Findings

- `MainTabShellView` was using a fixed `86` point bottom clear inset for all non-Camera pages, while the floating tab bar itself also used safe-area bottom padding. On taller home-indicator devices this could leave the final Settings subscription / polish CTA too close to the overlay.
- Settings uses a `List`, so the app shell needs a reliable shared bottom inset that is large enough for the custom floating tab bar rather than a per-page magic number.
- Camera was no longer using the ordinary page tab bar, but `CameraView` kept shutter controls and the compact mode rail in the same bottom `VStack`. Changing the rail size could push the shutter row upward and make the bottom area feel like a layout block instead of a native camera overlay.
- Camera's bottom gradients were taller than needed after the controls became compact overlays, adding to the visual impression of unused black space.

### Completed

- Added shared `AppTabBarMetrics` for content-page bottom inset, floating tab bottom padding, and Camera compact rail / control spacing.
- Updated `MainTabShellView` so non-Camera pages use `AppTabBarMetrics.contentPageBottomInset` instead of an inline `86` point clear inset.
- Kept Camera on the fullscreen path with no ordinary content-page bottom padding.
- Split Camera shutter controls and Camera compact mode rail into separate bottom overlays.
- Kept the Camera mode rail lower and independent from the shutter row so it does not push shutter / viewfinder layout upward.
- Reduced bottom preview/chrome gradient heights to reclaim more visible camera area.
- Preserved one-tap access to Inspiration, History, and Settings.
- Preserved Inspiration photo import and Camera's lack of Photo Picker CTA.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/AppTabBarMetrics.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, and `CameraView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage. Matches were limited to existing mock placeholder service comments.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions. The reported Swift `error:` lines point to existing preview macro loading failures across multiple files, not a confirmed Phase 16A-R5 source error.
- No real service integration was added.

### Known TODOs

- Xcode / Simulator visual QA is still needed to confirm Settings bottom CTA is no longer obstructed by the floating tab bar.
- Xcode / Simulator visual QA is still needed to confirm the Camera bottom rail feels lower while the shutter remains tappable.
- Floating tab bar / compact rail metrics may need small device-specific tuning after real-device review.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R5 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R4 - Unified Navigation Insets + Camera Fullscreen Space Fix

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Remove ordinary tab-bar safe-area reservation from the Camera surface, unify app navigation styling, preserve normal bottom spacing for content pages, and let Camera own its fullscreen bottom controls.

### Summary

Phase 16A-R4 replaces the native `TabView` shell with a small custom navigation shell. Camera is rendered as the fullscreen variant without ordinary page bottom padding or native tab-bar reservation. Inspiration, History, and Settings render as content pages with a custom floating tab bar and explicit bottom content spacing. Camera keeps its compact mode rail, now using the same icon / label / accent visual language as the content-page floating tab bar.

### Completed

- Replaced native `TabView` tab items with a custom `MainTabShellView` switcher.
- Kept Camera as the default selected screen.
- Hid the content-page floating tab bar on Camera.
- Added a custom floating tab bar for Inspiration, History, and Settings.
- Added non-camera bottom content spacing so the floating tab bar does not cover content.
- Tightened Camera bottom inset now that Camera does not share ordinary floating-tab reservation.
- Updated Camera compact mode rail to use matching icon / label / selected-accent styling.
- Preserved one-tap access from Camera to Inspiration, History, and Settings.
- Preserved Inspiration photo import, selected-photo flow, 20 filters / grouping, mock save, mock AI, local history, History, Settings, localization, front-camera screen flash scaffold, timer, lens dropdown, AI Snapshot mock boundary, and guidance logic.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Targeted `swiftc -parse` passed for `MainTabShellView.swift` and `CameraView.swift`.
- Localization lint passed for English and Traditional Chinese strings.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / `sandbox-exec` / SwiftUI `#Preview` macro environment restrictions. The reported Swift `error:` lines point to existing preview macro loading failures across multiple files, not a confirmed Phase 16A-R4 source error.

### Known TODOs

- Xcode / Simulator visual QA is still needed to confirm Camera no longer inherits ordinary page bottom spacing.
- Floating tab bar size and content page bottom spacer may need device-specific polish after real-device review.
- Lens dropdown remains a mock UI scaffold and does not perform real hardware lens switching.
- AI Snapshot remains mock-only and does not capture, serialize, upload, or persist a real snapshot.
- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 request.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R4 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R3 - Overlay Collision Fix + Bottom Space Reclaim

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Fix overlapping Camera overlays, ensure only one callout is expanded at a time, and reclaim additional bottom empty space while preserving the Phase 16 mock-only AI Snapshot boundary.

### Summary

Phase 16A-R3 adds a small active camera callout state to keep Live Guidance, AI Snapshot, filter picker, and lens dropdown mutually exclusive. Live Guidance no longer renders both the compact pill and expanded card together; it now shows either a collapsed pill or a compact expanded card inside the lower-right viewfinder area. The filter pill remains lower-left and uses a different overlay slot. The lens selector was converted from a system `Menu` to a compact custom dropdown strip that can be explicitly collapsed after selecting a focal length.

### Completed

- Added `CameraCallout` state for `.none`, `.guidance`, `.aiSnapshot`, `.filter`, and `.lens`.
- Collapsed other callouts when opening AI Snapshot, filter picker, lens dropdown, flash, timer, flip camera, or guidance mode controls.
- Changed Live Guidance overlay so compact pill and expanded card are mutually exclusive.
- Moved expanded Live Guidance into the viewfinder lower-right, away from the lower-left filter pill.
- Kept AI Snapshot as a compact shutter-side button that opens a mock-only consent / result sheet.
- Replaced the lens `Menu` with an in-view custom capsule dropdown that auto-collapses after selection.
- Tightened bottom inset, guidance/filter overlay offsets, and lower controls so the mode rail has less dead space below it.
- Preserved Camera primary screen, no-scroll capture layout, shutter visibility, filter picker, 20 filters / grouping, Mock / Local guidance, Phase 15B / 15C / 15D guidance, mock save, mock AI, local history, Inspiration, History, Settings, and localization.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- Verification commands are recorded in `tests/manual-smoke-tests.md`.
- `git diff --check` passed.
- Localization lint passed for English and Traditional Chinese strings.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Unsandboxed command-line Xcode simulator build was not retried because the prior escalation path was rejected by the current Codex usage/credits limit.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found no iOS Swift `URLSession`, `URLRequest`, or `WebSocket` usage.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Frame / photo persistence scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.

### Known TODOs

- Physical iPhone visual QA is still needed for exact overlay collision behavior, shutter hit testing, and bottom spacing.
- Lens dropdown remains a mock UI scaffold and does not perform real hardware lens switching.
- AI Snapshot remains mock-only and does not capture, serialize, upload, or persist a real snapshot.
- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 request.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R3 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R2 Final - Native Camera Layout Alignment + Viewfinder Expansion

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Align the Phase 16A-R fullscreen Camera layout more closely with native iPhone Camera behavior, further expand the viewfinder feel by reclaiming bottom empty space, and keep Phase 16 mock cloud snapshot guidance mock-only while avoiding Phase 16B / 17.

### Summary

Phase 16A-R2 Final keeps the fullscreen camera canvas but reduces persistent chrome so the viewfinder feels larger. The bottom gradient, guidance/filter overlay offsets, capture rail height, bottom padding, and mode rail spacing were tightened so the preview feels closer to the shutter controls. The always-expanded `24mm / 35mm / 77mm` lens strip is replaced with a compact lens menu near the flip camera control. Timer Off no longer renders visible text, while active 3s / 5s / 10s values render inside the timer control. Inspiration, History, and Settings are exposed as a thin one-tap mode rail instead of being hidden only behind a top overflow menu.

### Completed

- Kept capture mode free of vertical scrolling.
- Reduced top and bottom chrome gradients to make the viewfinder feel larger.
- Moved Live Guidance and filter overlay offsets closer to the shutter controls without overlapping the shutter.
- Tightened bottom capture rail height, mode rail spacing, and bottom safe-area padding to reduce empty black space.
- Removed the always-visible lens selector from the lower camera chrome.
- Added a compact shutter-side lens menu using existing mock lens options and state.
- Kept flash and timer as the only top-right camera controls; flash / timer are not duplicated beside the shutter.
- Changed timer presentation so Off shows only the timer icon, while 3s, 5s, and 10s appear inside the timer circle.
- Kept AI Snapshot as a compact shutter-side mock-only button that opens consent / result UI only after explicit tap.
- Kept Live Guidance as a compact lower-preview pill / optional callout.
- Kept filter entry as a translucent lower-left viewfinder pill that opens the grouped 20-filter picker only on tap.
- Replaced the top overflow navigation dependency with a bottom mode rail for Camera, Inspiration, History, and Settings.
- Preserved Inspiration photo import, selected-photo flow, 20 filters / grouping, mock save, mock AI, local history, History, Settings, localization, front-camera screen flash scaffold, and timer capture flow.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift

### Build / Verification

- `git diff --check` passed.
- Localization lint passed for English and Traditional Chinese strings.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Final unsandboxed command-line Xcode simulator build could not be completed because escalation was rejected by the current Codex usage/credits limit.
- Earlier Phase 16A-R2 unsandboxed command-line Xcode simulator build succeeded before the final bottom-spacing adjustment.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found only existing placeholder comments and safety copy, not new real URLSession, URLRequest, WebSocket, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase config, private keys, OAuth secrets, or Apple credentials.
- Persistence / export scan found no UserDefaults, Core Data, SwiftData, file writes, save-to-Photos, export, raw-frame logging, or image-data persistence behavior in iOS Swift files.
- Frame / photo safety scan found only existing Phase 15B / 15C in-memory analyzer references and Phase 16 mock consent copy, not new frame/photo upload, stream, persistence, or logging behavior.

### Known TODOs

- Physical iPhone visual QA is still needed for exact native-camera proportions, shutter hit testing, and compact control spacing.
- The compact lens menu remains a mock UI scaffold and does not perform real hardware lens switching.
- Screen flash remains UI-only and does not perform hardware flash sync.
- AI Snapshot remains mock-only and does not capture, serialize, upload, or persist a real snapshot.
- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 request.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R2 should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A-R - Native Camera-style Fullscreen UX Rescue

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Rescue the Phase 16 / 16A Camera UX so the capture surface behaves like a native fullscreen camera rather than a scrolling app page, while keeping all Phase 16 cloud snapshot behavior mock-only.

### Summary

Phase 16A-R replaces the capture-mode card stack with a fullscreen camera canvas. The Camera tab hides the bottom tab bar while shooting so the shutter cannot be covered by tab chrome. A small top menu preserves navigation to Inspiration, History, and Settings. Live Guidance and AI Snapshot are no longer long persistent cards below the preview; they are compact overlay controls. The filter entry now sits as a translucent button on the lower-left of the viewfinder.

### Completed

- Replaced the capture-mode card layout with a fullscreen `GeometryReader` / `ZStack` camera canvas.
- Kept selected-photo / imported-photo mode scrollable for filter preview, mock save, mock AI, and local-only notes.
- Hid the bottom tab bar while Camera is in shooting mode.
- Added a compact top camera navigation menu so users can still jump to Inspiration, History, and Settings while the tab bar is hidden.
- Moved flash and timer into small native-camera-style top controls.
- Kept timer options as Off, 3s, 5s, and 10s.
- Kept front-camera + flash screen-flash scaffold.
- Moved filter entry to the lower-left of the viewfinder as a translucent pill showing the current preset.
- Kept the filter picker as a sheet so the full filter catalog is not permanently occupying the capture surface.
- Kept Live Guidance as a compact lower-preview overlay with optional expansion.
- Kept Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability / priority logic unchanged.
- Moved AI Snapshot to a compact button beside the shutter.
- Preserved Phase 16 mock-only `CloudSnapshotGuidanceService` boundary, consent UX, success, failed, and unavailable states.
- Kept Photo Picker out of the Camera capture UI; import remains in Inspiration.
- Preserved Camera primary screen, Dazz-like / native-camera direction, mock lens selector, capture, flip, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, Settings, and localization.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Localization lint passed for English and Traditional Chinese strings.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase16ar-derived-unsandboxed CODE_SIGNING_ALLOWED=NO build`.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found only existing placeholder comments and quota/settings copy, not new real URLSession, URLRequest, WebSocket, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched documentation / placeholder TODOs and localizable safety copy, not real secrets, Firebase config, API keys, signing credentials, or production config.
- Persistence / export scan found no UserDefaults, Core Data, SwiftData, file writes, save-to-Photos, export, base64, raw-frame logging, or image-data persistence behavior in iOS Swift files.
- Frame / photo safety scan found only existing Phase 15B / 15C in-memory `CMSampleBuffer` / `CVPixelBuffer` analyzer references and Phase 16 mock consent copy, not new frame upload, stream, persistence, or logging behavior.
- Vision / face safety scan still found `import Vision` and `VNDetectFaceRectanglesRequest` only in `LiveGuidanceFaceAnalyzer.swift`; no new Vision request type, face recognition, identity inference, or sensitive inference was added.

### Known TODOs

- Physical iPhone verification is still needed for shutter hit testing, full-screen proportions, filter overlay placement, and tab-bar hiding behavior.
- The top camera navigation menu is a pragmatic scaffold while the Camera tab hides the tab bar; final navigation treatment can be refined later.
- Screen flash remains UI-only and does not perform hardware flash sync.
- AI Snapshot remains mock-only and does not capture, serialize, upload, or persist a real snapshot.
- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 request.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A-R should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16A - Camera One-Screen UX Consolidation

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Consolidate the Camera tab into a more one-screen-first shooting surface, move photo import to Inspiration, keep live guidance and mock AI snapshot guidance compact, and add small camera-control scaffolds without starting Phase 16B / 17 or connecting real cloud AI.

### Summary

Phase 16A keeps Camera as the primary shooting surface and reduces the need to scroll in normal capture mode. Live Guidance now defaults to a compact expandable pill, and AI Snapshot now defaults to a compact entry that opens a consent/result sheet instead of occupying the capture surface. Camera no longer exposes a Photo Picker entry; Inspiration now owns the import-photo entry and opens the existing selected-photo filter / mock save / mock AI flow.

### Completed

- Changed the Camera capture state to a one-screen-first layout instead of an always-scrolling capture surface.
- Kept the selected-photo / imported-photo flow scrollable because filter preview, mock save, and mock AI analysis still need vertical space.
- Moved the filter preset picker from inline capture content to a medium/large sheet.
- Changed Live Guidance from a persistent full overlay to a compact expandable guidance pill.
- Preserved Mock / Local guidance modes, the guidance toggle, Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability / anti-flicker logic.
- Changed AI Snapshot from a persistent full panel to a compact entry that opens a consent/result sheet.
- Preserved the Phase 16 mock-only service boundary, consent step, success, failed, and unavailable states.
- Removed the Photo Picker entry from Camera controls and selected-photo fallback actions.
- Added an Inspiration import-photo card that loads a single photo and opens the existing selected-photo flow with filters, mock save, mock AI, and local history.
- Added a front-camera + flash screen-flash scaffold using a short local white overlay before capture.
- Changed Timer from on/off to Off, 3s, 5s, and 10s options via a confirmation dialog.
- Kept timer countdown state in memory only and integrated it with the existing capture button.
- Preserved Camera primary screen, Dazz-like viewport, mock lens selector, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, Settings, and localization.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase16a-derived-unsandboxed CODE_SIGNING_ALLOWED=NO build`.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Network / upload scan found only existing local/mock placeholder comments and quota/settings copy, not new real URLSession, URLRequest, WebSocket, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched documentation / placeholder TODOs and localizable safety copy, not real secrets, Firebase config, API keys, signing credentials, or production config.
- Persistence / export scan found no UserDefaults, Core Data, SwiftData, file writes, save-to-Photos, export, base64, raw-frame logging, or image-data persistence behavior in iOS Swift files.
- Frame / photo safety scan found only existing Phase 15B / 15C in-memory `CMSampleBuffer` / `CVPixelBuffer` analyzer references and Phase 16 mock consent copy, not new frame upload, stream, persistence, or logging behavior.
- Vision / face safety scan still found `import Vision` and `VNDetectFaceRectanglesRequest` only in `LiveGuidanceFaceAnalyzer.swift`; no new Vision request type, face recognition, identity inference, or sensitive inference was added.

### Known TODOs

- Physical iPhone layout verification is still needed for the one-screen capture surface, especially on smaller screens.
- Front-camera screen flash is a local UI scaffold only; it does not implement real front-camera hardware flash sync.
- The mock lens selector still does not switch real iPhone lenses.
- AI Snapshot remains mock-only and does not capture, serialize, upload, or persist a real snapshot.
- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 request.

### Safety Notes

- Did not start Phase 16B or Phase 17.
- Did not add real network requests, URLSession/URLRequest calls, WebSocket, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, backend code, StoreKit, quota, persistence, export, save-to-Photos, third-party SDKs, secrets, or production config.
- Did not increase frame sampling frequency or add new Vision request types.
- Did not add voice input, ASR, Parakeet, face recognition, identity inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16B: No. Phase 16A should be reviewed, committed, pushed, and read-only confirmed before any real cloud AI integration begins.

---

## Phase 16 - Cloud Snapshot AI Guidance Prototype

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Add the first app-side, explicitly triggered, consent-gated cloud snapshot guidance prototype without starting Gemini Live, connecting real cloud AI, adding real network/upload behavior, adding backend code, adding persistence, or adding secrets.

### Summary

Phase 16 adds a compact AI snapshot entry to the Camera screen, a memory-only state model, a future-facing service protocol boundary, a mock cloud response service, privacy / consent UX, and mock failed / unavailable states.

Local guidance remains the default live guidance layer. The Phase 16 flow is optional and requires the user to tap the AI entry, review consent copy, and explicitly start the mock check. No real image upload, network call, provider call, Firebase write, or persistence occurs.

### Completed

- Added `CloudSnapshotGuidanceRequest`, `CloudSnapshotGuidanceResponse`, `CloudSnapshotGuidanceSuggestion`, mock outcome, and mock error models.
- Added `CloudSnapshotGuidanceState` with idle, consent, preparing, analyzing, result, failed, and unavailable states.
- Added `CloudSnapshotGuidanceService` protocol as the app-side service boundary.
- Added `MockCloudSnapshotGuidanceService` with local mock success, failure, and unavailable outcomes only.
- Added `CloudSnapshotGuidanceConsentView` with privacy copy before mock analysis.
- Added `CloudSnapshotGuidanceResultView` for compact camera-like mock results and recovery states.
- Added a compact AI snapshot / AI Quick Advice panel to the Camera capture surface.
- Required explicit user tap before showing consent and another explicit tap before mock analysis.
- Kept request context derived-only: filter preset ID/key, lens label, guidance mode, and request date.
- Did not include raw image, base64, pixel buffer, sample buffer, selected photo, or serialized request payload in the Phase 16 request model.
- Preserved Mock / Local guidance, Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability.
- Preserved Camera primary screen, Dazz-like viewport, mock lens selector, flash / timer / flip / capture, Photo Picker, selected-photo Back to Camera / Clear, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceConsentView.swift
- ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceModels.swift
- ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceResultView.swift
- ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceService.swift
- ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceState.swift
- ios-app/AIPhotoApp/Features/Camera/MockCloudSnapshotGuidanceService.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -quiet -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase16-derived-unsandboxed CODE_SIGNING_ALLOWED=NO build`.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Vision import / request scan still found `import Vision` and `VNDetectFaceRectanglesRequest` only in `LiveGuidanceFaceAnalyzer.swift`.
- Network / upload scan found no Phase 16 URLSession, URLRequest, WebSocket, real upload, Gemini/OpenAI, Firebase, Cloud Functions, or StoreKit behavior.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched `.env.example` placeholder values and docs/prompt scan commands, not real secrets, Firebase config, API keys, signing credentials, or production config.
- Frame / photo persistence scan found no Phase 16 raw image, base64, sample buffer, pixel buffer, file write, upload, stream, persistence, or logging behavior. Existing Phase 15B / 15C local in-memory frame analyzer references remain expected.
- Refined face safety scan found no Phase 16 face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation.

### Known TODOs

- Real cloud AI integration remains deferred to a later explicit Phase 16B / 17 after backend, server-issued credential, privacy, pricing/rate-limit, abuse, and quota review.
- Phase 16 does not capture, serialize, upload, or persist a real snapshot.
- Future real cloud version should keep Local guidance as the default and keep cloud snapshot guidance explicit, cancelable, and consent-gated.
- The UI copy may need final legal / App Store privacy review before a real cloud analysis feature ships.

### Safety Notes

- Did not start Gemini Live.
- Did not add live video streaming, WebSocket realtime guidance, background frame upload, continuous frame upload, or cloud snapshot automation.
- Did not add URLSession, URLRequest, real network calls, real upload, Firebase Storage upload, Firestore writes, Cloud Functions calls, Gemini calls, OpenAI calls, or provider SDK calls.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not save raw frames, selected photos, cloud request payloads, base64 image data, pixel buffers, sample buffers, face data, or face rectangle history.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, backend changes, npm dependencies, third-party SDKs, commit, or push.
- Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for real cloud AI integration: No. Real cloud AI integration must wait for a later explicit Phase 16B / 17 request after Phase 16 is reviewed, committed, pushed, and read-only confirmed.

---

## Phase 15D - Guidance Stability and Priority

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Add a conservative Guidance Stability / Priority / Anti-flicker UX layer on top of existing Local guidance signals without starting Phase 16, adding new AI capability, adding new frame analysis types, adding new Vision request types, increasing frame sampling frequency, or touching backend/cloud services.

### Summary

Phase 15D adds `LiveGuidanceStabilityController`, a small memory-only controller that ranks already-composed Local guidance suggestions, limits visible hints to at most two, applies repeat cooldown, requires a short confirmation before replacing current hints, and briefly holds stable suggestions when incoming signals change.

The phase preserves Phase 15B brightness guidance and Phase 15C face framing / headroom guidance. It does not modify `CameraCaptureService` sampling cadence and does not expand Vision beyond the existing face rectangle analyzer.

### Completed

- Added memory-only Local guidance stability controller.
- Added suggestion priority ordering for lighting, face distance, composition, filter, portrait-ready, and fallback hints.
- Added cooldown to reduce repeated suggestions.
- Added confirmation count to reduce one-frame hint jumps.
- Added short hold behavior when a signal disappears briefly.
- Limited Local guidance to at most two visible suggestions.
- Limited Mock guidance display to at most two suggestions without changing the mock provider.
- Kept Mock guidance mode available.
- Preserved Phase 15B brightness guidance.
- Preserved Phase 15C face framing / headroom guidance.
- Preserved Camera as the primary screen, Dazz-like viewport, mock lens selector, flash / timer / flip / capture, Photo Picker, selected-photo Back to Camera / Clear, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, and Settings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- docs/prompts/phase-15D-guidance-stability-and-priority.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Vision import / request scan found `import Vision` and `VNDetectFaceRectanglesRequest` only in the existing `LiveGuidanceFaceAnalyzer.swift`; no new Vision request type was added.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched `.env.example` placeholder values and docs/prompt scan commands, not real secrets, Firebase config, API keys, signing credentials, or production config.
- Camera-scoped forbidden behavior scan matched only existing local/mock explanatory strings, not new upload, persistence, StoreKit, Gemini/OpenAI, speech/ASR, Parakeet, save-to-Photos, or related behavior.
- Frame safety scan only matched the expected existing in-memory `CMSampleBuffer` / `CVPixelBuffer` brightness and face rectangle analysis path; no raw-frame storage, upload, stream, base64 conversion, raw-frame logging, network behavior, or persistence was found.
- Face safety scan only matched the existing local Vision face rectangle detector, signal names, and UI/message identifiers; no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation was found.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15d-derived CODE_SIGNING_ALLOWED=NO build`.

### Known TODOs

- Physical iPhone testing is still required to tune stability constants against real lighting and face-framing motion.
- Cooldown, confirmation count, and hold duration may need product tuning after real-device use.
- This remains local guidance UX stabilization, not cloud AI, Gemini Live, voice guidance, or production-grade pose coaching.

### Safety Notes

- Did not start Phase 16.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, or Cloud Functions.
- Did not add cloud snapshot guidance.
- Did not increase camera frame sampling frequency.
- Did not add new frame analysis types.
- Did not add new Vision request types.
- Did not modify `LiveGuidanceFaceAnalyzer`.
- Did not upload, stream, persist, or log camera frames.
- Did not store face rectangles or face history.
- Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect Firebase Storage or Firestore.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, backend changes, npm dependencies, third-party SDKs, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16: No. Phase 15D should be reviewed, committed, pushed, and read-only confirmed before Phase 16 starts.

---

## Phase 15C - Local Face Framing Vision Prototype

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit
Date completed: 2026-06-10

### Goal

Add a conservative local Apple Vision face rectangle prototype on top of Phase 15B brightness guidance without starting Phase 16, cloud AI, Gemini Live, voice, persistence, export, backend work, or secrets.

### Summary

Phase 15C adds `LiveGuidanceFaceAnalyzer`, a small local analyzer that uses `VNDetectFaceRectanglesRequest` for face bounding boxes only. It derives simple framing signals such as subject off-center, low headroom, face too close, face too far, and portrait framing ready, then merges those derived signals with the existing Phase 15B brightness signals.

This phase intentionally does not perform face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, sensitive attribute inference, face data persistence, or face rectangle history.

### Completed

- Added local Vision face rectangle analysis in `LiveGuidanceFaceAnalyzer`.
- Kept `import Vision` limited to the local face analyzer file.
- Reused the Phase 15B low-frequency frame signal path.
- Preserved Phase 15B brightness guidance for too dark, too bright, and balanced lighting.
- Added simple derived face framing signals for off-center subject, low headroom, face too close, face too far, and portrait framing ready.
- Updated the suggestion composer so a reasonable portrait frame gets a stable short hint instead of an incorrect headroom warning.
- Kept raw frame handling in memory only, with no raw frame logging, upload, stream, persistence, or base64 conversion.
- Did not store face rectangles or face history.
- Preserved Mock guidance provider and Phase 15 fallback local suggestions.
- Preserved Camera as the primary first tab.
- Preserved Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- docs/prompts/phase-15C-local-face-framing-vision-prototype.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFaceAnalyzer.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Vision import scan found `import Vision` only in `LiveGuidanceFaceAnalyzer.swift`.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched placeholder/documentation references, not real secrets, Firebase config, API keys, signing credentials, or production config.
- Camera-scoped forbidden behavior scan passed for upload, persistence, StoreKit, Gemini/OpenAI, speech/ASR, Parakeet, save-to-Photos, and related behavior.
- Frame safety scan only matched the expected immediate in-memory `CMSampleBuffer` / `CVPixelBuffer` brightness and face rectangle analysis path; no raw-frame storage, upload, stream, base64 conversion, raw-frame logging, network behavior, or persistence was found.
- Face safety scan only matched the expected local Vision face rectangle detector and docs/prompt safety notes; no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation was found.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15c-derived CODE_SIGNING_ALLOWED=NO build`.
- User manually verified Phase 15C in Xcode / Simulator on 2026-06-10 and accepted the current result:
  - app builds and runs
  - Camera remains the primary screen
  - Mock / Local guidance mode can be switched
  - Mock guidance mode remains normal
  - Local guidance mode remains normal
  - Phase 15B brightness guidance remains normal
  - Apple Vision face rectangle / bounding box detection is used only for local face framing / headroom guidance
  - face framing hints can show short composition suggestions without obvious flicker
  - camera preview / capture has no obvious lag
  - guidance overlay remains below the viewfinder and does not block the main preview
  - Dazz-like camera layout, mock lens selector, flash / timer / flip / capture, Photo Picker import, selected-photo Back to Camera / Clear, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, and Settings remain usable
  - English / Traditional Chinese localization shows no raw keys
  - no Gemini Live, cloud AI, voice, ASR, Parakeet, Firebase Storage / Firestore, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, Firebase config, or API keys were added
  - no raw frames are stored, uploaded, streamed, persisted, or logged
  - no face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, sensitive inference, face rectangle history storage, or face rectangle logging was added

### Known TODOs

- Physical iPhone testing is required to validate Vision face rectangle behavior and preview responsiveness with actual camera frames.
- Face framing thresholds may need tuning after real-device portrait testing.
- Future Vision features must remain local-only and require explicit phase approval.
- This is still not cloud AI, Gemini Live, voice guidance, identity recognition, or production-grade pose coaching.

### Safety Notes

- Did not start Phase 16.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, or Cloud Functions.
- Did not add cloud snapshot guidance.
- Did not upload, stream, persist, or log camera frames.
- Did not store face rectangles or face history.
- Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect Firebase Storage or Firestore.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, backend changes, npm dependencies, third-party SDKs, commit, or push.

### Ready for Next Phase

Ready to commit Phase 15C: Yes.

Ready for Phase 16: No. Phase 15C should be reviewed, committed, pushed, and read-only confirmed before Phase 16 starts.

---

## Phase 15B - Local Frame Signal Prototype

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit
Date completed: 2026-06-10

### Goal

Add the first low-frequency, local-only frame signal prototype on top of Phase 15 local guidance without starting Phase 16, cloud snapshot guidance, Gemini Live, voice, persistence, export, backend work, or secrets.

### Summary

Phase 15B adds a narrow AVFoundation video data output for local brightness analysis only. The frame signal path is throttled to roughly 1-2 samples per second, analyzes luma values on a background queue, and returns only derived guidance signals to the main thread.

This implementation intentionally prioritizes brightness / too dark / too bright. Face rectangle, headroom, and Vision analysis were left out to keep this phase low-risk.

### Completed

- Added `LiveGuidanceBrightnessAnalyzer` for local luma-based brightness signals.
- Added a throttled optional frame signal output to `CameraCaptureService`.
- Added an enable gate so brightness analysis runs only when Local guidance is active, guidance is not paused/off, and the Camera preview is active.
- Kept raw frame handling in memory only, with no raw frame logging, upload, stream, persistence, or base64 conversion.
- Updated `CameraViewModel` to receive derived local frame signals and refresh Local guidance suggestions on the main thread.
- Updated `LocalRuleBasedGuidanceProvider` to prefer real frame-derived signals when available and keep Phase 15 fallback signals when unavailable.
- Added a balanced-light local suggestion for frames that are neither too dark nor too bright.
- Preserved Mock guidance provider and Phase 15 fallback local suggestions.
- Preserved Camera as the primary first tab.
- Preserved Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- docs/prompts/phase-15B-local-frame-signal-prototype.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceBrightnessAnalyzer.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift
- ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Vision import scan found no `import Vision`; Phase 15B did not implement face rectangle / headroom.
- Secrets / config file scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Refined secrets scan only matched existing `.env.example` placeholder variables and docs/prompt scan commands, not real secrets.
- Camera-scoped forbidden behavior scan passed for upload, persistence, StoreKit, Gemini/OpenAI, speech/ASR, Parakeet, save-to-Photos, and related behavior.
- Frame safety scan only matched Phase 15B's immediate in-memory `CMSampleBuffer` / `CVPixelBuffer` brightness analysis path; no raw-frame storage, upload, stream, base64 conversion, raw-frame logging, network behavior, or persistence was found.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15b-derived CODE_SIGNING_ALLOWED=NO build`.
- User manually verified Phase 15B in Xcode / Simulator on 2026-06-10 and accepted the current result:
  - app builds and runs
  - Camera remains the primary screen
  - Mock / Local guidance mode can be switched
  - Mock guidance mode remains normal
  - Local guidance mode can show brightness / fallback suggestions
  - Simulator / camera-unavailable fallback does not crash
  - camera preview / capture has no obvious lag
  - guidance overlay remains below the viewfinder and does not block the main preview
  - Dazz-like camera layout, mock lens selector, flash / timer / flip / capture, Photo Picker, selected-photo Back to Camera / Clear, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, and Settings remain usable
  - English / Traditional Chinese localization shows no raw keys
  - no Gemini Live, cloud AI, voice, ASR, Parakeet, Firebase Storage / Firestore, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, Firebase config, or API keys were added
  - no raw frames are stored, uploaded, streamed, persisted, or logged

### Known TODOs

- Physical iPhone testing is required to validate real brightness behavior and preview responsiveness with actual camera frames.
- Face rectangle / headroom remains deferred; do not add Vision until a later explicit phase or focused follow-up.
- Future tuning may adjust brightness thresholds after physical-device testing.
- This is still not cloud AI, Gemini Live, voice guidance, or production-grade live camera intelligence.

### Safety Notes

- Did not start Phase 16.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, or Cloud Functions.
- Did not add cloud snapshot guidance.
- Did not upload, stream, persist, or log camera frames.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect Firebase Storage or Firestore.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, StoreKit, or Vision imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, backend changes, npm dependencies, third-party SDKs, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16: No. Phase 15B should be reviewed, committed, pushed, and read-only confirmed before Phase 16 starts.

---

## Phase 15 - Local Live Guidance Prototype

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Add the first local live guidance prototype on top of the Phase 14 mock guidance system without starting Phase 16 or adding cloud AI, Gemini Live, voice input, persistence, export, backend changes, or secrets.

### Summary

Phase 15 adds a switchable local guidance mode while preserving the Phase 14 mock guidance provider. The local mode uses a rule-based provider with sample/fallback local signals so the feature works safely on Simulator or devices without a live frame analyzer.

This implementation intentionally does not import Vision and does not add AVFoundation video frame sampling. It establishes the provider, signal, analyzer, and suggestion-composer architecture for later local frame analysis while keeping Camera capture, Photo Picker, filters, selected-photo controls, mock save, mock AI, and local history stable.

### Completed

- Added `LiveGuidanceMode` for Mock / Local guidance mode selection.
- Added a compact `LiveGuidanceModeSelectorView` in the Camera status bar.
- Kept the existing `MockLiveGuidanceProvider`.
- Added `LocalRuleBasedGuidanceProvider`.
- Added `LiveGuidanceSignal`.
- Added `LiveGuidanceFrameAnalyzer` with safe sample/fallback local signals only.
- Added `LiveGuidanceSuggestionComposer` to map local signals into short localized suggestions.
- Updated `CameraViewModel` to switch between mock and local providers.
- Updated the live guidance overlay to use local-mode state titles.
- Added local/rule-based suggestions for too dark, too bright, subject centering, headroom, face too close / too far, warm filter suggestion, and local signal unavailable fallback.
- Preserved Camera as the primary first tab.
- Preserved the Dazz-like compact viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- docs/prompts/phase-15-local-live-guidance-prototype.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMode.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceModeSelectorView.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameAnalyzer.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift
- ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- Vision import scan found no `import Vision`; Phase 15 uses sample/fallback local signals only.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, signing secrets, provisioning profiles, or mobile provisioning files.
- Refined secrets scan only matched existing `functions/.env.example` placeholder variable names, not real secrets.
- Camera-scoped forbidden behavior scan passed for upload, persistence, StoreKit, Gemini/OpenAI, speech/ASR, Parakeet, save-to-Photos, and related behavior.
- Frame safety scan passed for raw-frame storage, upload, stream, base64, pixel-buffer logging, and network behavior in Camera feature files.
- Broader Swift forbidden behavior scan only matched existing placeholder/comment/enum references outside the Phase 15 Camera changes.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15-derived CODE_SIGNING_ALLOWED=NO build`.
- User manually verified Phase 15 in Xcode / Simulator on 2026-06-10 and accepted the current result:
  - app builds and runs
  - Camera remains the primary screen
  - Mock / Local guidance mode chip works
  - Mock guidance mode still works
  - Local guidance mode shows sample / fallback local suggestions
  - Local mode does not analyze real frames
  - no Vision import or AVFoundation video frame sampling was added
  - guidance overlay stays below the viewfinder and does not block the main preview
  - Dazz-like camera layout, mock lens selector, Photo Picker, selected-photo Back to Camera / Clear, 20 filters/grouping, mock save, mock AI, local history, Inspiration, History, and Settings remain usable
  - English / Traditional Chinese localization shows no raw keys
  - no raw frames are read, stored, uploaded, streamed, persisted, or logged
  - no Gemini Live, cloud AI, voice, ASR, Parakeet, Firebase Storage / Firestore, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, Firebase config, or API keys were added

### Known TODOs

- Phase 15 does not analyze real camera frames yet.
- Phase 15 does not import Vision yet.
- Future local frame analysis can add throttled Vision / AVFoundation sampling in a later explicit phase or Phase 15B.
- Physical iPhone testing remains needed for any future true live-frame analyzer and preview-lag validation.

### Safety Notes

- Did not start Phase 16.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, or Cloud Functions.
- Did not add cloud snapshot guidance.
- Did not upload, stream, persist, or log camera frames.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect Firebase Storage or Firestore.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, StoreKit, or Vision imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, backend changes, npm dependencies, third-party SDKs, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 16: No. Phase 15 should be reviewed, committed, pushed, and read-only confirmed before Phase 16 starts.

---

## Phase 14C - Selected Photo Back / Clear UX Fix

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Make it easy to return from the selected-photo / imported-photo preview back to the camera shell without scrolling to the bottom of the selected-photo flow.

### Summary

Phase 14C adds a compact dark camera-chrome action bar whenever a selected or imported photo is active. The action bar stays visible at the top of the selected-photo screen and provides Back to Camera / Clear controls that both clear the selected image and return to the camera preview or simulator fallback.

### Completed

- Added a fixed selected-photo action bar in the Camera screen.
- Added Back to Camera / Clear actions that are visible without scrolling to the bottom of the selected-photo flow.
- Added `clearSelectedPhoto()` to clear the selected image, picker item, render preview, filter error, save state, and loading render state while preserving the selected filter preset.
- Kept `resetSelection()` available for the older full reset behavior.
- Updated the lower selected-photo fallback button to Back to Camera.
- Preserved Photo Picker re-import, 20 filters/grouping, mock save, mock AI, local session history, live guidance mock, lens selector, Inspiration, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated manual smoke tests.

### Changed Files

- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git status --short --branch` confirmed the working tree contains Phase 14 / 14B / 14C changes.
- `git diff --check` passed.
- New Phase 14 / 14B Swift files are present in the working tree and can be included in the next commit: `LiveGuidanceMockState.swift`, `LiveGuidanceOverlayView.swift`, `LiveGuidanceToggleView.swift`, `LensOption.swift`, and `CameraLensSelectorView.swift`.
- Source inspection confirmed selected-photo / imported-photo mode has fixed visible Back to Camera / Clear controls.
- Source inspection confirmed Back to Camera / Clear call `clearSelectedPhoto()` and return to the camera preview / fallback state.
- Source inspection confirmed the Camera screen keeps the compact framed 4:5-style viewport.
- Source inspection confirmed the lens selector remains a local/mock UI scaffold and does not perform real iPhone hardware lens switching.
- Source inspection confirmed Inspiration remains the former Guide tab refinement and no longer presents Open Camera as the primary CTA.
- Source inspection confirmed the 20-filter catalog and grouping remain present.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, StoreKit, and Vision imports.
- Config file scan passed for `GoogleService-Info.plist`, `.env`, `.firebaserc`, signing secrets, provisioning profiles, and mobile provisioning files.
- Refined secrets scan found only existing `functions/.env.example` placeholder variable names, not real secrets or newly added config.
- Swift forbidden behavior scan for the Phase 14 Camera area passed for new Vision, frame analysis, frame upload/stream/persistence, Gemini Live, voice, ASR, Parakeet, Firebase, AI, StoreKit, persistence, quota, export, or save-to-Photos behavior.
- Broader Swift forbidden behavior scan only matched existing placeholder/comment/enum references outside the Phase 14 changes.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase14-final-derived CODE_SIGNING_ALLOWED=NO build`.

### Known TODOs

- Physical-device small-screen spacing should be checked to confirm the fixed selected-photo action bar does not crowd the preview.
- Phase 14C does not change filter parameters, filter grouping, live guidance behavior, or real camera hardware integration.

### Safety Notes

- Did not start Phase 15.
- Did not add Apple Vision or import Vision.
- Did not analyze live video frames.
- Did not read, upload, stream, or persist camera frames.
- Did not add Gemini Live, voice input, ASR, Parakeet, Firebase, OpenAI, Gemini, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, backend changes, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 15: No. Phase 14C should be reviewed, committed, pushed, and read-only confirmed before Phase 15 starts.

---

## Phase 14B - Dazz-like Camera Frame + Inspiration Tab Refinement

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Refine the Phase 14 local/mock camera UI so it feels more like a Dazz-style retro camera back, then reposition the former Guide tab as an Inspiration area. This is not Phase 15.

### Summary

Phase 14B keeps Camera as the primary tab, removes the large Camera page-title feel in the primary tab context, gives the capture screen a compact framed viewport inside a dark camera shell, moves guidance out of the main viewfinder, and adds a local/mock lens selector with camera-like focal labels.

The former Guide tab is now Inspiration-focused. It no longer presents Open Camera as the primary call to action and instead shows local/mock inspiration cards for shooting ideas, mock AI advice entry points, filter ideas, and future AI photo placeholders.

### Completed

- Moved the live guidance overlay below the viewport and above the shutter/control area.
- Kept the viewfinder clean by removing guidance from the main preview surface.
- Removed the large Camera navigation title from the primary camera tab context.
- Replaced the visible `Local camera shell` label with compact camera-style focal/filter/guidance chips.
- Added a compact framed 4:5-style viewport inside a dark camera chrome.
- Added focal labels such as 24mm, 35mm, and 77mm.
- Added `LensOption` for local/mock lens choices.
- Added `CameraLensSelectorView` for selectable mock lens chips.
- Stored the selected lens option in `CameraViewModel` memory only.
- Preserved flash, timer, flip, capture, Photo Picker import, filter entry, and live guidance toggle.
- Preserved 20 local filters/grouping, mock save, mock AI, local session history, History, and Settings.
- Changed the former Guide tab label to Inspiration / ???.
- Reworked `HomeView` into local/mock Inspiration cards and removed the Open Camera primary CTA.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/LensOption.swift
- ios-app/AIPhotoApp/Features/Camera/CameraLensSelectorView.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

Phase 14 base files still present in the working tree:

- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceToggleView.swift

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, StoreKit, and Vision imports.
- Secrets / config scan passed for `GoogleService-Info.plist`, `.env`, `.firebaserc`, signing secrets, API-key patterns, and private-key patterns.
- Swift code forbidden behavior scan passed for new Firebase, AI, Cloud Functions, StoreKit, Vision, frame analysis, frame upload/stream/persistence, speech/ASR, persistence, export, save-to-Photos, quota, paywall, or subscription behavior.
- The broader iOS diff scan only matched localization safety copy that says StoreKit / quota are not connected; no behavior or import was added.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase14b-derived CODE_SIGNING_ALLOWED=NO build`.

### Known TODOs

- The lens selector is UI scaffold only and does not switch real iPhone camera hardware.
- Physical-device layout should be checked for camera-shell proportions and control spacing.
- Phase 14B guidance remains mock/local only.
- Phase 15 may prototype local rule-based / Apple Vision guidance only after explicit request.

### Safety Notes

- Did not start Phase 15.
- Did not add Apple Vision or import Vision.
- Did not analyze live video frames.
- Did not read, upload, stream, or persist camera frames.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, Cloud Functions, or external AI.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, npm dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 15: No. Phase 14B should be committed, pushed, and read-only confirmed before Phase 15 starts.

---

## Phase 14 - Live Camera Guidance Mock UX

Status: Implemented; ready for review before commit
Date completed: 2026-06-10

### Goal

Add a local/mock Live Camera Guidance UX to the Camera screen without starting Phase 15 or adding real Vision, AI, frame analysis, voice, backend, persistence, or service integrations.

### Summary

Phase 14 adds a compact camera overlay for mock pre-capture guidance. The overlay is local-only, shows short shooting suggestions, and can be toggled on/off from the Camera status bar.

The guidance state is in-memory only and does not read, analyze, upload, stream, or persist live camera frames.

### Completed

- Added `LiveGuidanceMockState` with off, idle, scanning, suggestion available, and paused states.
- Added `LiveGuidanceSuggestion` and `LiveGuidanceSuggestionCategory`.
- Added `LiveGuidanceProvider` and active `MockLiveGuidanceProvider`.
- Added `LiveGuidanceOverlayView` for compact viewfinder guidance UI.
- Added `LiveGuidanceToggleView` for the Camera status bar.
- Integrated the mock overlay into `CameraView` without blocking capture controls, filter picker, Photo Picker import, flash/timer/flip controls, or tab navigation.
- Added English and Traditional Chinese localization strings.
- Preserved Camera-first flow, Photo Picker fallback, 20 local filters/grouping, mock save, mock AI, local session history, History, and Settings.
- Updated README / iOS README / manual smoke tests.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift
- ios-app/AIPhotoApp/Features/Camera/LiveGuidanceToggleView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, StoreKit, and Vision imports.
- Secrets / config scan passed for `GoogleService-Info.plist`, `.env`, `.firebaserc`, signing secrets, API-key patterns, and private-key patterns.
- Forbidden behavior scan passed for new Firebase, AI, Cloud Functions, StoreKit, Vision, frame analysis, frame upload/stream/persistence, speech/ASR, persistence, export, save-to-Photos, quota, paywall, or subscription behavior.
- Sandboxed command-line Xcode simulator build failed due CoreSimulator / sandbox-exec environment restrictions.
- Unsandboxed command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase14-derived CODE_SIGNING_ALLOWED=NO build`.

### Known TODOs

- Phase 14 guidance is mock UX only, not real AI guidance.
- Phase 15 may prototype local rule-based / Apple Vision guidance only after explicit request.
- Future local providers, cloud snapshot guidance, Gemini Live, and voice/ASR remain later phases.
- Physical-device camera overlay readability and responsiveness should be checked in Xcode / Simulator and ideally on a real iPhone.

### Safety Notes

- Did not start Phase 15.
- Did not add Apple Vision or import Vision.
- Did not analyze live video frames.
- Did not read, upload, stream, or persist camera frames.
- Did not add Gemini Live.
- Did not call Gemini, OpenAI, Cloud Functions, or external AI.
- Did not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, npm dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to review before commit: Yes.

Ready for Phase 15: No. Phase 14 should be committed, pushed, and read-only confirmed before Phase 15 starts.

---

## Filter Research Docs Backfill + Alignment Check

Status: Docs-only backfill and alignment check completed; ready to review before commit
Date completed: 2026-06-09

### Goal

Backfill the filter research documentation from the supplied `/Users/a1234/Downloads/???™è?????md` report and verify that the Phase 12B / Phase 13 Swift filter catalog still aligns with the documented product direction.

This is not a new implementation phase.

### Summary

The filter research docs already existed, but `docs/filter-research-popular-film-looks.md` still described the original source report as unavailable. This task reconciled that doc with the supplied filter research report, clarified the implemented Phase 13 20-preset catalog, and recorded the implementation alignment result without changing Swift or backend code.

### Completed

- Backfilled `docs/filter-research-popular-film-looks.md` with the supplied source report path and current Phase 13 20-preset catalog.
- Updated `docs/filter-preset-schema.md` with the research-backed `grain_size` range and a schema alignment note.
- Updated `docs/filter-roadmap.md` with the current implemented 20-preset catalog and Phase 13B TODO candidates.
- Verified `Original` remains the no-filter option.
- Verified legacy starter filters remain available:
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Verified Batch 1 hero filters remain available:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- Verified Phase 13 additional filters remain available:
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
- Verified stable IDs remain present in `FilterPresetCatalog.swift`.
- Verified filter grouping / category metadata remains present.
- Verified public UI display names remain brand-safe.

### Alignment Result

Phase 12B / Phase 13 implementation aligns with the backfilled research direction at MVP approximation level.

Important caveats:

- Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- Current Swift catalog is in-code, not JSON/catalog-file loaded.
- HSL-specific tuning is not implemented.
- LUT support is not implemented.
- True grain overlays are not implemented.
- Halation, light leak, dust, frames, CCD / instant camera asset treatment, and Metal/custom shader work remain future phases.

### Phase 13B TODO Candidates

- Tune individual filter parameters after more real-photo testing.
- Revisit filter ordering, grouping, and picker UI after user taste review.
- Decide whether to add a file-backed local catalog or keep the Swift catalog.
- Add LUT support only in a later explicit phase.
- Add true grain overlays, halation, light leak, dust, frames, CCD / instant camera asset treatment, and Metal/custom shader work only in later explicit phases.

### Safety Notes

- Docs-only maintenance task.
- Did not modify Swift code.
- Did not modify backend code.
- Did not add filters.
- Did not change filter visual parameters.
- Did not redo filter UI.
- Did not start Phase 13B.
- Did not start Phase 14.
- Did not add Firebase, Gemini, OpenAI, or StoreKit imports.
- Did not add secrets, API keys, Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist`.
- Did not commit.
- Did not push.

### Ready for Commit

Ready to commit docs backfill: Yes, after review and final verification checks.

---

## Phase 14R - Live Guidance Research Integration

Status: Docs-only research integration completed; ready to review before commit
Date completed: 2026-06-09

### Goal

Integrate the Live Camera Guidance, Spoken Camera Assistant / ASR, and Gemini Live research into repo documentation, then update the Phase 14 prompt so the next implementation stays aligned with research conclusions.

This phase does not implement Phase 14.

### Summary

Phase 14R formalizes the live guidance roadmap:

- Phase 14: Mock UX only.
- Phase 15: Local rule-based / Apple Vision prototype.
- Phase 16: Server-side low-frequency snapshot guidance.
- Phase 17: Gemini Live voice + visual assistant prototype.
- Voice branch: push-to-talk mock, then Apple Speech prototype, then cloud STT / Gemini Live research.

The research integration confirms that Phase 14 should not include Vision, frame analysis, Gemini Live, voice input, ASR, Parakeet, or live video upload.

### Completed

- Added `docs/live-camera-guidance-research.md`.
- Added `docs/spoken-camera-assistant-research.md`.
- Added `docs/gemini-live-implementation-notes.md`.
- Added `docs/live-guidance-roadmap.md`.
- Updated `docs/prompts/phase-14-live-camera-guidance-mock-ux.md` with Phase 14R research conclusions.
- Added future provider abstraction names to the Phase 14 prompt:
  - `MockLiveGuidanceProvider`
  - `FutureLocalRuleBasedGuidanceProvider`
  - `FutureVisionGuidanceProvider`
  - `FutureCloudSnapshotGuidanceProvider`
  - `FutureGeminiLiveGuidanceProvider`
- Kept Phase 14 prompt scoped to mock UX only.

### Changed Files

- docs/live-camera-guidance-research.md
- docs/spoken-camera-assistant-research.md
- docs/gemini-live-implementation-notes.md
- docs/live-guidance-roadmap.md
- docs/prompts/phase-14-live-camera-guidance-mock-ux.md
- docs/phase-log.md

### Research Conclusions

- Live guidance is a strong long-term product direction, but the MVP should not use real-time cloud video AI.
- Phase 14 should validate overlay placement, toggle behavior, mock state, and short suggestion copy only.
- Phase 15 is the right place for local rule-based / Apple Vision prototype work.
- Phase 16 is the right place for optional server-side low-frequency snapshot guidance.
- Phase 17 is the right place for Gemini Live voice + visual assistant research.
- Voice input is worth a long-term branch, but should not enter MVP or Phase 14.
- Parakeet TDT 0.6B is not suitable as an iPhone on-device ASR solution and is not a good Cantonese / Traditional Chinese primary ASR route.
- Gemini Live should not be the MVP guidance engine.

### Safety Notes

- Docs-only phase.
- Did not modify Swift code.
- Did not modify backend code.
- Did not implement Phase 14.
- Did not start Phase 15.
- Did not connect Gemini Live.
- Did not connect Apple Vision.
- Did not connect ASR or Parakeet.
- Did not add Firebase, OpenAI, Gemini, or StoreKit imports.
- Did not add secrets, API keys, Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist`.
- Did not commit.
- Did not push.

### Ready for Next Phase

Ready to execute Phase 14 mock UX: Yes, after Phase 14R docs are reviewed and Phase 14 is explicitly requested.

Ready for Phase 15: No. Phase 14 mock UX should be implemented, reviewed, committed, pushed, and read-only confirmed first.

---

## Phase 13 - Expanded Filter Library - 20 Presets

Status: Manually verified by user in Xcode / Simulator and temporarily accepted; ready to commit after review
Date completed: 2026-06-09

### Goal

Expand the local filter library to 20 research presets using MVP / Core Image approximation quality only, without starting Phase 14 or adding real services.

### Summary

Phase 13 expands the local filter catalog from the Phase 12B Batch 1 set to 20 research presets. The filter picker now uses filter group chips and a grouped preset grid instead of a single long horizontal row.

Original remains the no-filter option and is not counted as one of the 20 research presets. Classic Film, Warm Vintage, and Faded Chrome remain available as legacy starter filters.

### 20-Preset Catalog

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

### Filter Grouping

Filter picker groups:

- Featured
- Portrait
- Daily
- Street
- Cinema
- Black & White
- Night
- Camera Looks
- Starter

### Completed

- Added `FilterPresetGroup` and localized group titles.
- Added group metadata to `FilterPreset`.
- Added 14 new research presets.
- Preserved the 6 Phase 12B Batch 1 hero filters.
- Preserved Original as no-filter.
- Preserved Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- Added a Core Image bloom adjustment for subtle night / instant / soft-camera MVP approximations.
- Replaced the single horizontal preset list with grouped chips and a preset grid.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.
- Kept Camera-first flow, Photo Picker fallback, mock save, mock AI, local session history, History, and Settings in scope.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan found no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, or Apple credentials.
- Forbidden behavior scan found no Phase 13 additions for real upload, Firestore write, Storage write, Cloud Functions calls, real AI calls, StoreKit, quota, persistence, export, or save-to-Photos behavior. Existing mock/future placeholder references remain documented from earlier phases.
- Brand-name UI scan found no Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar protected brand names in public filter UI source.
- Sandboxed CLI `xcodebuild` failed due to CoreSimulator/sandbox environment. Unsandboxed `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase13-derived CODE_SIGNING_ALLOWED=NO build` completed with `BUILD SUCCEEDED`.
- User manually verified Phase 13 in Xcode / Simulator and temporarily accepted the current result on 2026-06-09.
- User confirmed app build/run, camera-first flow, Photo Picker fallback, filter picker/grouping, all 20 research presets, Original no-filter behavior, legacy starter filters, Batch 1 filters, mock save, mock AI, local session history, History, and Settings are acceptable for Phase 13.
- User confirmed no real Firebase / AI / Cloud Functions / StoreKit / persistence / upload / export / save-to-Photos behavior and no secrets / Firebase config / API keys were added.

### Known TODOs

- Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- Phase 13B can be opened later to adjust individual filter parameters, ordering, grouping, picker UI, or visual differences.
- True grain overlays, LUT assets, light leaks, dust, frames, accurate halation, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- Instant Dream, Diana Soft, CCD Party 2008, Flash Party, and other camera looks are color / contrast / vignette / bloom approximations only.
- CCD / instant camera asset treatment remains future phase work.
- AI custom filters, reference-image-to-filter, and AI image generation remain future phases.
- Premium gating remains future monetization work only.
- Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.

### Safety Notes

- Did not start Phase 14.
- Did not add AI live guidance.
- Did not add AI custom filter generation.
- Did not add AI reference image analysis.
- Did not add AI image generation or editing.
- Did not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add upload, Firestore write, Storage write, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, npm dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to commit Phase 13: Yes, after final status and scan checks are reviewed.

Ready for Phase 14: No. Phase 13 should be committed, pushed, and read-only confirmed before Phase 14 starts.

---

## Phase 12B - Filter Preset Schema And Batch 1

Status: Manually verified by user; ready to commit after review
Date completed: 2026-06-09

### Goal

Implement the first small local filter catalog expansion from the Phase 12A planning docs without starting Phase 13.

### Summary

Phase 12B extends the local filter preset model with app-level catalog metadata and implements the first 6 Batch 1 hero filters using only Core Image operations in the existing local pipeline.

The current catalog now presents:

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

Original remains unfiltered. The existing Classic Film, Warm Vintage, and Faded Chrome presets remain available as legacy starter filters with their existing IDs and localized names.

### Completed

- Added local preset metadata for category, implementation priority, MVP flag, and premium placeholder flag.
- Added a local `FilterPresetCategory` enum.
- Added a Core Image highlight/shadow adjustment step to the existing filter pipeline.
- Added 6 Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- Kept Original as the no-filter preset.
- Kept Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- Updated English and Traditional Chinese localization strings.
- Updated filter planning docs to record the Phase 12B Core Image approximation boundary.
- Updated manual smoke tests for the Phase 12B flow.
- Kept Camera-first flow, Photo Picker fallback, mock save, mock AI, local session history, History, and Settings in scope.

### Changed Files

- README.md
- ios-app/README.md
- docs/filter-preset-schema.md
- docs/filter-roadmap.md
- docs/filter-research-popular-film-looks.md
- docs/prompts/phase-12-filter-preset-schema-and-batch1.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase12b-derived CODE_SIGNING_ALLOWED=NO build`
  - Sandboxed attempt failed due CoreSimulator / `sandbox-exec` environment restrictions.
  - Unsandboxed retry succeeded on 2026-06-09.
- User manually verified Phase 12B in Xcode / Simulator on 2026-06-09 and accepted the current result:
  - App can build / run.
  - Camera-first flow remains normal.
  - Photo Picker fallback works.
  - Filter selection opens.
  - Original, Classic Film, Warm Vintage, and Faded Chrome remain preserved or clearly mapped.
  - Soft Warm 400, Summer Gold 200, Street Chrome, Soft Sun Portrait, Cinema Flat, and Silver Gradation are available.
  - The 6 new filters have acceptable visual differences.
  - Mock save success / failure works.
  - Mock AI analysis success / failure works.
  - Local session history works.
  - History and Settings remain normal.
  - No real Firebase, AI, Cloud Functions, StoreKit, persistence, upload, export, or save-to-Photos behavior was observed.
  - No secrets, Firebase config, or API keys were added.
- `git diff --check` passed.
- Forbidden import scan passed for iOS source.
- Secrets / config scan passed.
- Forbidden behavior scan passed for Phase 12B scope.

### Known TODOs

- Phase 12B uses Core Image approximations only. It does not implement HSL-specific tuning, vibrance, true fade controls, grain, LUTs, bloom, glow, halation, Metal, or custom shader passes.
- Phase 12B is not the final realistic film emulation engine.
- Phase 13 or later should handle expansion to 12 filters and then 20 filters.
- LUT, grain overlay, halation, light leak, CCD-style looks, and instant camera looks should remain for later phases.
- Street Chrome is a Core Image approximation; more accurate chrome / slide color may need a future LUT after licensing and asset strategy are settled.
- Soft Warm 400, Summer Gold 200, and Silver Gradation do not include grain yet.
- Soft Sun Portrait does not include real glow or skin-aware masking.
- Cinema Flat does not include scene-aware highlight protection.
- Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.

### Safety Notes

- Did not start Phase 13.
- Did not implement all 20 proposed filters.
- Did not add expanded filter monetization.
- Did not add premium gating.
- Did not add StoreKit, subscription, paywall, or quota enforcement.
- Did not add AI custom filters.
- Did not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, or Apple credentials.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to commit Phase 12B: Yes, after final review.

Ready for Phase 13: No. Phase 12B should be committed, pushed, and read-only confirmed before Phase 13 starts.

---

## Phase 12A - Filter Research Integration & Preset Schema Planning

Status: Ready for review
Date completed: 2026-06-09

### Goal

Integrate the provided Phase 12 filter research direction into formal repository documentation and prepare the next construction prompt for a small, data-driven Batch 1 filter implementation.

This phase is documentation-only.

### Summary

Phase 12A created filter research, preset schema, implementation roadmap, and Phase 12B construction prompt documents. It defines a brand-safe naming direction, a 20-preset research catalog, a prioritized first 12, app-level filter preset schema fields, parameter ranges, and a staged roadmap that keeps Phase 12B limited to the first 6 hero filters.

The requested source file `deep-research-report.md` was not found in the local repo or nearby workspace during this pass. The new research document records that source-status caveat and should be reconciled with the original source report if it is later added.

### Completed

- Added a formal filter research document for popular film / retro / photographer-style looks.
- Added public display-name guidance to avoid using protected brand names as product filter names.
- Added 20 proposed presets and the first 12 implementation priority set.
- Added engineering seed JSON for catalog planning.
- Added app-level filter preset schema planning.
- Added parameter ranges for defaults, HSL, tone curve, render hints, and asset references.
- Added a filter implementation roadmap with Batch 1, Batch 2, and Batch 3.
- Marked which presets are good Core Image MVP candidates.
- Marked which presets may need LUTs, grain overlays, Metal, custom shader, or halation passes later.
- Added a Phase 12B construction prompt for schema/catalog implementation plus the first 6 hero filters only.

### Changed Files

- README.md
- ios-app/README.md
- docs/filter-research-popular-film-looks.md
- docs/filter-preset-schema.md
- docs/filter-roadmap.md
- docs/prompts/phase-12-filter-preset-schema-and-batch1.md
- docs/phase-log.md

### Phase 12A Safety Notes

- Did not modify Swift code.
- Did not modify backend code.
- Did not implement filters.
- Did not start Phase 13.
- Did not add expanded filter library implementation.
- Did not add Firebase, Gemini, OpenAI, Cloud Functions, or StoreKit.
- Did not add secrets, API keys, `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Did not commit.
- Did not push.

### Ready for Next Phase

Ready to review Phase 12B prompt: Yes.

Ready to start Phase 13: No. Phase 12B should be reviewed and explicitly requested first.

---

## Maintenance - Mac/Xcode Build Error Fix

Status: Completed
Date completed: 2026-06-09

### Summary

Completed minimal Mac/Xcode build fixes for the Phase 01/02 scaffold. The Mac/Xcode project was detected at `ios-app/AIPhotoApp.xcodeproj`, and the Phase 01 UI scaffold plus Phase 02 Auth scaffold build succeeded on MacBook/Xcode.

### Completed

- Checked `git status --short`.
- Checked `ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift`.
- Searched Swift files under `ios-app/AIPhotoApp/` for `ObservableObject` and `@Published`.
- Added the missing `import Combine` to `AuthViewModel.swift`.
- Removed the default `MockAuthService()` argument from `AuthViewModel.init` to avoid actor-isolation errors in synchronous nonisolated contexts.
- Updated the Auth preview to inject `MockAuthService()` explicitly.
- Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- Confirmed Phase 01/02 Mac/Xcode build succeeded.
- Confirmed Auth scaffold build was verified.
- Did not start Phase 03.
- Did not implement Camera, Firebase Storage upload, AI, or StoreKit.
- Did not add secrets, API keys, credentials, or `GoogleService-Info.plist`.

### Changed Files

- .gitignore
- docs/phase-log.md
- ios-app/AIPhotoApp/Features/Auth/AuthView.swift
- ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift
- ios-app/AIPhotoApp.xcodeproj/
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirmed only `AuthViewModel.swift` uses `ObservableObject` / `@Published`.
- [x] Mac/Xcode build succeeded for Phase 01/02.
- [x] Phase 01 UI scaffold verified.
- [x] Phase 02 Auth scaffold verified.
- [x] Confirmed no Phase 03 work was started.

---

## Phase 00 - Repo Setup and Documentation

Status: Completed
Date started: 2026-06-07
Date completed: 2026-06-07

### Goal

Create the initial repository structure, documentation layout, AGENTS.md, placeholder folders, Firebase placeholder files, Cloud Functions placeholder files, scripts, and phase prompts.

No real app features should be implemented in this phase.

### Scope

This phase creates:

- README.md
- AGENTS.md
- .gitignore
- .env.example
- .firebaserc.example
- docs/
- docs/prompts/
- ios-app/ placeholder
- functions/ placeholder
- firebase/ placeholder
- scripts/ placeholder
- tests/ placeholder

### Summary

Phase 00 initialized the repository skeleton and documentation baseline for the iOS-first AI Support Retro Camera app.

### Completed

- Created root project documentation and agent instructions.
- Added common background, product reports, phase plan, decisions, and phase log.
- Added phase prompt placeholders for Phase 00 through Phase 12.
- Added iOS app, Firebase, Cloud Functions, scripts, and manual smoke test placeholders.
- Added no-secrets placeholders and ignore rules.

### Changed Files

- README.md
- AGENTS.md
- .gitignore
- .env.example
- .firebaserc.example
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/03-camera-filter-image-pipeline.md
- docs/04-ai-photo-advisor.md
- docs/05-firebase-storage-firestore-functions.md
- docs/06-ui-ux-design-system.md
- docs/07-subscription-quota-storekit.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/decisions.md
- docs/prompts/phase-00-setup.md
- docs/prompts/phase-01-design-navigation.md
- docs/prompts/phase-02-auth.md
- docs/prompts/phase-03-camera-picker.md
- docs/prompts/phase-04-filters.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- docs/prompts/phase-06-ai-function.md
- docs/prompts/phase-07-ai-result-ui.md
- docs/prompts/phase-08-quota.md
- docs/prompts/phase-09-subscription.md
- docs/prompts/phase-10-history-delete-download.md
- docs/prompts/phase-11-privacy-deletion.md
- docs/prompts/phase-12-testing-release.md
- ios-app/README.md
- functions/README.md
- functions/package.json
- functions/tsconfig.json
- functions/.env.example
- functions/src/index.ts
- firebase/firebase.json
- firebase/firestore.rules
- firebase/storage.rules
- firebase/firestore.indexes.json
- firebase/remote-config.template.json
- scripts/README.md
- scripts/bootstrap.sh
- scripts/emulators.sh
- scripts/validate-no-secrets.sh
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirm repo structure exists.
- [x] Confirm no real secrets are committed.
- [x] Confirm README.md exists.
- [x] Confirm AGENTS.md exists.
- [x] Confirm docs/phase-log.md exists.
- [x] Confirm functions placeholder exists.
- [x] Confirm firebase placeholder exists.
- [x] Confirm ios-app placeholder exists.
- [x] Confirm manual smoke test checklist exists.

### Known TODOs

- Add real Firebase project later.
- Add real `GoogleService-Info.plist` later.
- Add Apple Developer capabilities later.
- Add Gemini API key to server-side secret manager later.
- Add OpenAI key to server-side secret manager later only when image/edit feature begins.
- Initialize real SwiftUI Xcode project in Phase 01 or when requested.
- Implement Firebase Auth in Phase 02.
- Implement AVFoundation camera in Phase 03.

### Ready for Next Phase

Yes. Phase 01 can begin when explicitly requested.

---

## Phase 01 - Design System + Navigation

Status: Completed
Date started: 2026-06-07
Date completed: 2026-06-07

### Goal

Create the SwiftUI app shell, root navigation, basic design system, placeholder Home / History / Settings screens, dark mode support, and localization skeleton.

### Summary

Phase 01 created a dependency-free SwiftUI source scaffold under `ios-app/AIPhotoApp/`, expanded the Phase 01 construction prompt, added design system tokens and reusable UI components, added placeholder Home / History / Settings navigation, and added English / Traditional Chinese localization skeleton files.

No Auth, Camera, Firebase upload, AI, or StoreKit implementation was added.

### Completed

- Expanded `docs/prompts/phase-01-design-navigation.md` into a complete implementation prompt.
- Added SwiftUI app entry and root view scaffold.
- Added `TabView` + per-tab `NavigationStack` shell.
- Added placeholder Home / History / Settings views.
- Added design system tokens for colors, typography, spacing, and corner radius.
- Added reusable placeholder components: primary button, icon button, quota badge, empty state.
- Added simple UI preview models for presets, quota status, and history items.
- Added `en` and `zh-Hant` localization skeleton files.
- Updated iOS app README with Phase 01 structure and Xcode notes.
- Updated manual smoke tests with Phase 01 checks.

### Changed Files

- docs/prompts/phase-01-design-navigation.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/AIPhotoApp.swift
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppColors.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppTypography.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppSpacing.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppCornerRadius.swift
- ios-app/AIPhotoApp/DesignSystem/Components/PrimaryButton.swift
- ios-app/AIPhotoApp/DesignSystem/Components/IconCircleButton.swift
- ios-app/AIPhotoApp/DesignSystem/Components/QuotaBadge.swift
- ios-app/AIPhotoApp/DesignSystem/Components/EmptyStateView.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/History/HistoryView.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Models/CameraPreset.swift
- ios-app/AIPhotoApp/Models/QuotaStatus.swift
- ios-app/AIPhotoApp/Models/HistoryPhotoItem.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirmed Phase 01 files are limited to prompt, iOS scaffold, iOS README, manual tests, and phase log.
- [x] Confirmed placeholder UI does not import Firebase, Google Sign-In, StoreKit, AVFoundation, PhotosUI, Gemini, OpenAI, or third-party packages.
- [x] Confirmed no `.env`, `.firebaserc`, `GoogleService-Info.plist`, or real credential files were added.
- [x] Confirmed manual test checklist includes Phase 01 checks.
- [ ] Xcode build / simulator verification not run in this Windows environment.

### Known TODOs

- Create a real Xcode iOS project or target on macOS and add `ios-app/AIPhotoApp/` files.
- Verify SwiftUI previews and simulator rendering in Xcode.
- Implement Auth in Phase 02.
- Implement Camera and photo picker in Phase 03.
- Implement real filter pipeline in Phase 04.
- Implement Firebase upload and Firestore metadata in Phase 05.
- Implement AI Cloud Function and AI UI in later phases.
- Implement StoreKit subscription flow in Phase 09.

### Ready for Phase 02

Yes. Phase 02 can begin when explicitly requested.

### Notes

Do not implement Auth, Camera, Firebase, AI, or StoreKit in this phase.

---

## Phase 01.5 - Xcode Project Setup

Status: Completed with documentation fallback
Date started: 2026-06-07
Date completed: 2026-06-07

### Goal

Create or document the setup for a real Xcode-openable iOS SwiftUI project/target that connects the existing `ios-app/AIPhotoApp/` Phase 01 SwiftUI source files, so the Phase 01 UI can be viewed in Xcode Preview and the iOS Simulator.

### Summary

Phase 01.5 verified that the repo still has no `.xcodeproj`. Because this work was performed in a Windows environment without Xcode, no `.xcodeproj` was generated or hand-written. Instead, a clear manual setup guide was added at `ios-app/XCODE_SETUP.md`.

No Auth, Camera, Firebase upload, AI, StoreKit, real secrets, API keys, Apple credentials, Firebase keys, Google keys, provisioning profiles, or `GoogleService-Info.plist` were added.

### Completed

- Read the required Phase 01.5 context documents.
- Verified the working tree state before editing.
- Verified no `.xcodeproj` exists in the current repo.
- Confirmed existing Phase 01 SwiftUI scaffold files under `ios-app/AIPhotoApp/`.
- Confirmed the current environment cannot reliably generate and verify an Xcode project.
- Added `ios-app/XCODE_SETUP.md` with manual Xcode project creation steps.
- Documented how to place the project at `ios-app/AIPhotoApp.xcodeproj`.
- Documented how to add existing Swift files to the app target.
- Documented how to add English and Traditional Chinese localization resources.
- Updated `ios-app/README.md` to reference the Phase 01.5 setup guide.
- Updated manual smoke tests with Phase 01.5 checks.

### Changed Files

- docs/prompts/phase-01-5-xcode-project-setup.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/XCODE_SETUP.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short`.
- [x] Ran `rg --files`.
- [x] Ran `Get-ChildItem -Recurse -Filter *.xcodeproj` and found no `.xcodeproj`.
- [x] Confirmed `ios-app/AIPhotoApp/AIPhotoApp.swift` is the only current `@main` app entry in the Swift source scaffold.
- [x] Confirmed no app code imports Firebase, Google Sign-In, StoreKit, AVFoundation, PhotosUI, Gemini, OpenAI, or third-party packages.
- [x] Confirmed no generated `.xcodeproj` was added.
- [x] Confirmed no real `GoogleService-Info.plist` was added.
- [ ] Xcode build not run because this environment is Windows without Xcode.
- [ ] Xcode Preview not run because this environment is Windows without Xcode.
- [ ] iOS Simulator not run because this environment is Windows without Xcode.

### Known TODOs

- On macOS, follow `ios-app/XCODE_SETUP.md`.
- Create or verify `ios-app/AIPhotoApp.xcodeproj`.
- Add all existing `ios-app/AIPhotoApp/` Swift files to the app target.
- Add localization files to the app target resources.
- Verify `AppRootView` and `MainTabShellView` in Xcode Preview.
- Build and run the app in an iOS Simulator.
- Commit the verified `.xcodeproj` only after it opens and builds correctly.
- Implement Auth only in Phase 02 after explicit instruction.

### Ready for Phase 02

No. The Phase 01.5 fallback documentation is complete, but the real Xcode project has not yet been created or verified on macOS.

### Notes

Do not start Phase 02, Auth, Camera, Firebase upload, AI, or StoreKit from this phase.

---

## Phase 02 - Auth

Status: Completed as source scaffold / mock-only Auth
Date started: 2026-06-07
Date completed: 2026-06-07

### Goal

Implement Firebase Auth flow scaffolding for email/password, Google login, and Sign in with Apple.

### Summary

Phase 02 added dependency-free SwiftUI Auth UI scaffolding, mock Auth state, a mockable `AuthService` protocol, provider row placeholders for Google and Apple, guest try mode, Settings sign-out and account deletion placeholders, and Auth setup TODO documentation.

No real Firebase Auth, Google Sign-In, Sign in with Apple capability, Firebase Storage upload, Camera, AI, StoreKit, secrets, API keys, credentials, project IDs, production plist files, or `GoogleService-Info.plist` were added.

### Completed

- Read the required Phase 02 prompt and context documents.
- Ran `Get-ChildItem -Recurse -Filter '*.xcodeproj'` and confirmed no `.xcodeproj` exists.
- Added Auth UI scaffold under `ios-app/AIPhotoApp/Features/Auth/`.
- Added email/password form scaffold with local mock validation.
- Added Google sign-in row scaffold.
- Added Apple sign-in row scaffold.
- Added guest/try-mode copy and mock local state.
- Added `AuthService` protocol for dependency injection.
- Added `MockAuthService` for local-only sign-in/sign-out flows.
- Added `FirebaseAuthService` as a non-operational placeholder without Firebase imports.
- Connected the app root to the mock Auth flow before entering the existing tab shell.
- Added Settings mock sign-out and account deletion placeholder entries.
- Added English and Traditional Chinese Auth localization keys.
- Added Auth provider setup TODO documentation.
- Updated iOS README with Phase 02 Auth scaffold notes.
- Updated manual smoke tests with Phase 02 checks.

### Changed Files

- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Auth/AuthView.swift
- ios-app/AIPhotoApp/Features/Auth/EmailAuthForm.swift
- ios-app/AIPhotoApp/Features/Auth/AppleSignInButtonRow.swift
- ios-app/AIPhotoApp/Features/Auth/GoogleSignInButtonRow.swift
- ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift
- ios-app/AIPhotoApp/Features/Auth/AuthMode.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Models/AuthUser.swift
- ios-app/AIPhotoApp/Models/AuthProviderID.swift
- ios-app/AIPhotoApp/Services/Auth/AuthService.swift
- ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift
- ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift
- ios-app/AIPhotoApp/Services/Auth/AuthSetupTODO.md
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `Get-ChildItem -Recurse -Filter '*.xcodeproj'` and found no `.xcodeproj`.
- [x] Confirmed Phase 02 uses mock-only Auth source files because no verified Xcode project exists.
- [x] Confirmed `FirebaseAuthService.swift` does not import Firebase modules.
- [x] Confirmed Google and Apple sign-in rows are both present.
- [x] Confirmed guest mode is local-only scaffold state.
- [x] Confirmed account deletion is a Settings placeholder and does not claim backend deletion is complete.
- [x] Confirmed no `GoogleService-Info.plist` was added.
- [x] Confirmed no `.env`, `.firebaserc`, production plist, private key, OAuth secret, Firebase project ID, Google key, Apple credential, Gemini key, OpenAI key, or API key was added.
- [x] Confirmed no Camera, PhotosUI, Firebase Storage upload, AI, StoreKit, or Phase 03 work was added.
- [x] Mac/Xcode build succeeded after `ios-app/AIPhotoApp.xcodeproj` was created and verified.
- [ ] Xcode Preview verification is not recorded in this update.
- [ ] iOS Simulator verification is not recorded in this update.

### Known TODOs

- Keep `ios-app/AIPhotoApp.xcodeproj` committed after review.
- Add Firebase Apple SDK packages only after the Xcode project is verified.
- Keep `GoogleService-Info.plist` local-only and out of git.
- Configure Firebase Console Email/Password, Google, and Apple providers outside the repo.
- Configure Google reversed client ID URL scheme locally in Xcode.
- Configure Sign in with Apple capability in Apple Developer and Xcode.
- Implement real Firebase Auth only after dependencies and local config are ready.
- Implement backend account/data deletion in the later privacy/deletion phase.
- Confirm Gemini/public consumer 18+ and minors risk before public AI release.

### `.xcodeproj` Status

`ios-app/AIPhotoApp.xcodeproj` exists in the repo.

### Xcode Build / Simulator

Mac/Xcode build succeeded for the Phase 01 UI scaffold and Phase 02 Auth scaffold. Simulator verification is not recorded in this update.

### Ready for Phase 03

Yes, after this verification commit is pushed. Phase 03 has not been started.

### Notes

Use placeholders and TODOs for manual Firebase Console / Apple Developer setup. Do not invent real credentials.

Do not mark Phase 03 started from Phase 02.

---

## Phase 03 - Camera + Photo Picker

Status: Completed as local-only scaffold
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement AVFoundation single-photo camera flow and PhotosPicker / PHPicker single-image import flow.

### Summary

Phase 03 added a local-only Camera + Photo Picker scaffold. Home can open the camera flow, camera permission states are represented, AVFoundation preview/capture scaffolding exists, PhotosPicker imports one image, and captured/imported images are previewed from in-memory state only.

No filters, Core Image presets, Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions AI proxy, StoreKit, subscription/paywall logic, quota enforcement, history persistence, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

### Completed

- Read the Phase 03 prompt and required project documents.
- Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- Added Camera feature scaffold under `ios-app/AIPhotoApp/Features/Camera/`.
- Added AVFoundation camera session and single still-photo capture scaffold.
- Added `AVCaptureVideoPreviewLayer` SwiftUI wrapper.
- Added camera permission states and UI copy.
- Added PhotosPicker single-image import flow.
- Added selected/captured image preview with local-only memory state.
- Wired Home camera and import CTAs to the Camera scaffold.
- Added placeholder-safe camera and photo library usage descriptions to Xcode build settings.
- Added English and Traditional Chinese localization keys for Camera / Photo Picker UI.
- Updated manual smoke tests with Phase 03 checks.
- Ran command-line Xcode simulator build successfully.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- ios-app/README.md
- ios-app/AIPhotoApp.xcodeproj/project.pbxproj
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/CameraPermissionState.swift
- ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift
- ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift
- ios-app/AIPhotoApp/Features/Camera/PhotoPickerView.swift
- ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
- ios-app/AIPhotoApp/Models/CapturedPhoto.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed selected/captured image state is local-only and in memory.
- [x] Confirmed no filters or Core Image presets were implemented.
- [x] Confirmed no Firebase Storage upload or Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions AI proxy was implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, or history persistence was implemented.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] User manually checked Phase 03 in Xcode after implementation.
- [x] User confirmed build / basic UI flow looked acceptable.
- [x] User reported no obvious major bugs.
- [ ] Camera capture should still be verified more deeply on a physical iPhone / iPad before production.
- [ ] Photo picker should still be verified more deeply in Xcode Simulator or on a physical device before production.

### Known TODOs

- Verify camera permission prompt and real capture on a physical iPhone / iPad.
- Verify PhotosPicker import in Xcode Simulator or on device.
- Verify Home -> Camera full-screen flow manually.
- Verify guest/mock-auth users can access the local camera scaffold.
- Implement filters in Phase 04 only after Phase 03 is reviewed.
- Implement Firebase Storage / Firestore in Phase 05 only.
- Implement AI analysis in later phases only.
- Implement StoreKit in Phase 09 only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded.

### Camera / Photo Picker Verification

Codex did not perform interactive simulator/device testing. The user manually checked Phase 03 in Xcode and reported that build / basic UI flow looked acceptable with no obvious major bugs. The feature remains a scaffold and is not final product quality yet.

### Ready for Phase 04

Yes, if the build status is confirmed. Phase 03 remains a local-only scaffold; retro filters, AI advice, Firebase upload, Firestore metadata, history persistence, StoreKit, and quota work belong to later phases.

### Notes

Do not implement Firebase upload, AI analysis, filters, or history in this phase.

---

## Phase 04 - Filter Presets

Status: Implemented as local-only scaffold; command-line build succeeded; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement Core Image filter pipeline and at least 3 local retro film presets.

### Summary

Phase 04 added a local-only Core Image filter pipeline and preset selector for Phase 03 captured/imported images. The app can keep the original image in memory, render a local filtered preview, switch among Original, Classic Film, Warm Vintage, and Faded Chrome, and return to the unfiltered original.

No Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions, StoreKit, subscription/paywall logic, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, paid presets, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

### Completed

- Read the Phase 04 prompt and required project documents.
- Confirmed branch, latest commit, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added data-driven filter preset model and catalog.
- Added Original / None plus Classic Film, Warm Vintage, and Faded Chrome presets.
- Added local Core Image rendering pipeline.
- Added filtered preview UI and preset selector UI.
- Wired Camera / Photo Picker selected image preview to the local filter selector.
- Preserved Original / None as the unfiltered source image.
- Kept selected source image and filtered preview state in local memory only.
- Added orientation normalization for filtered preview rendering.
- Dispatched filter rendering off the main thread.
- Updated English and Traditional Chinese localization strings.
- Updated iOS app notes and manual smoke tests.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-04-filters.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed no Firebase Storage upload or Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions were implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, or paid presets were implemented.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug -derivedDataPath /private/tmp/ai-photo-phase04-derived build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] User manually verified app build / run in Xcode / Simulator.
- [x] User manually verified Home -> Camera scaffold flow.
- [x] User manually verified photo picker can select one image.
- [x] User manually verified Original, Classic Film, Warm Vintage, and Faded Chrome can be switched.
- [x] User manually verified filtered preview updates.
- [x] User manually verified Original returns to the unfiltered image.
- [x] User manually verified Continue placeholder does not start upload, AI, StoreKit, history persistence, export, or Phase 05 behavior.
- [x] User manually verified Home / History / Settings still render.
- [ ] Camera capture plus filter preview physical device verification pending.

### Known TODOs

- If a physical iPhone / iPad is available, manually test capture plus filter preview.
- Keep Firebase Storage / Firestore for Phase 05 only.
- Keep AI analysis, StoreKit, quota, history persistence, and export for later phases only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded. The first sandboxed build attempt failed because of sandbox/CoreSimulator/SwiftUI preview macro environment errors; a non-sandboxed build was then approved and succeeded.

### Ready for Phase 05

No. Phase 04 has command-line build and user manual Simulator verification, but Phase 05 should not begin until Phase 04 is committed, pushed, and explicitly requested.

### Notes

Do not implement half-frame, double exposure, or advanced camera library as MVP requirements.

---

## Phase 05 - Firebase Storage + Firestore

Status: Implemented as mock-only save scaffold; command-line build succeeded; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a safe, mockable Firebase Storage / Firestore save scaffold for selected/captured and filtered photos.

### Summary

Phase 05 added a mock-only photo save service architecture. The app now has a `PhotoSaveService` protocol, mock success/failure service, saved photo metadata model, save state model, Storage path convention draft, Firestore document shape draft, and a mock Save UI after the filtered preview.

No real `GoogleService-Info.plist`, Firebase project ID, `.env`, `.firebaserc`, API key, private key, OAuth secret, Apple Team ID, signing credential, provisioning profile, Firebase import, production Firebase upload, production Firestore write, AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription/quota logic, history persistence, export/save to Photos, account deletion backend, public sharing, or Phase 06 work was added.

### Completed

- Read the Phase 05 prompt and required project documents.
- Confirmed branch, latest commit, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added `SavedPhoto` metadata model.
- Added `PhotoSaveState`.
- Added `PhotoSaveService` protocol.
- Added `MockPhotoSaveService` for local success and failure flows.
- Added `FirebasePhotoSaveService` placeholder/TODO without Firebase imports.
- Added `PhotoStoragePath` with Storage path and Firestore document path drafts.
- Added mock Save UI after the filtered preview.
- Added visible mock save success and failure states.
- Kept History as an honest placeholder without cross-page saved-item persistence.
- Updated English and Traditional Chinese localization strings.
- Updated iOS app notes and manual smoke tests.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Models/PhotoSaveState.swift
- ios-app/AIPhotoApp/Models/SavedPhoto.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/PhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/MockPhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/FirebasePhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/PhotoStoragePath.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed no real Firebase upload was implemented.
- [x] Confirmed no real Firestore write was implemented.
- [x] Confirmed no Firebase, FirebaseStorage, or FirebaseFirestore imports were added.
- [x] Confirmed no AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription, quota, history persistence, export/save to Photos, public sharing, account deletion backend, or Phase 06 work was added.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, `.env`, `.firebaserc`, or `GoogleService-Info.plist` were added.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug -derivedDataPath /private/tmp/ai-photo-phase05-derived build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] User manually verified app build / run in Xcode / Simulator.
- [x] User manually verified Home -> Camera scaffold flow.
- [x] User manually verified photo picker can select one image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success state.
- [x] User manually verified mock save failure state.
- [x] User manually verified Save / Continue does not start upload, Firestore writes, AI, StoreKit, quota, history persistence, export, or Phase 06 behavior.
- [x] User manually verified History remains an honest placeholder.
- [x] User manually verified no real Firebase config or secrets were added.

### Known TODOs

- Keep real Firebase Storage / Firestore integration for a later explicitly requested setup task.
- Keep AI analysis and Cloud Functions for Phase 06 only.
- Keep StoreKit, subscription, quota, history persistence, export/save to Photos, account deletion backend, and public sharing for later phases only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded. The first sandboxed build attempt failed because of sandbox/CoreSimulator/SwiftUI preview macro environment errors; a non-sandboxed build was then approved and succeeded.

### Ready for Phase 06

No. Phase 05 has command-line build and user manual Simulator verification, but Phase 06 should not begin until Phase 05 is committed, pushed, and explicitly requested.

### Notes

Do not store image binary data in Firestore.

---

## Phase 06 - AI Photo Advisor Backend / Service Scaffold

Status: Implemented as mock-only scaffold; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a safe, mockable AI Photo Advisor backend / service scaffold with request / response contracts, mock analyzer behavior, Cloud Functions placeholder shape, provider adapter placeholders, and future prompt template draft.

### Summary

Phase 06 added mock-only AI Photo Advisor models and services on iOS plus a dependency-free backend TypeScript scaffold. The app now has photo analysis request / response models, analysis status/error/provider models, a `PhotoAnalysisService` protocol, mock success/failure service, and a Cloud Function placeholder service that does not import Firebase.

The functions scaffold now has an `analyzePhoto` mock handler, typed photo analysis contract, `AIProviderAdapter`, `MockAnalyzer`, placeholder-only `GeminiAnalyzer` and `OpenAIAnalyzer`, and a future-only prompt template draft.

No Gemini API key, OpenAI API key, Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, FirebaseFunctions import in iOS, real Gemini call, real OpenAI call, Cloud Functions deploy, production Firebase, Firebase Admin SDK import, npm dependency, image upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.

### Completed

- Read the Phase 06 prompt and required project documents.
- Confirmed branch, latest commit, sync status, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` was present before implementation.
- Added `PhotoAnalysisRequest` model draft.
- Added `PhotoAnalysisResult` model draft.
- Added `PhotoAnalysisStatus`, provider, and error models.
- Added `PhotoAnalysisService` protocol.
- Added `MockPhotoAnalysisService` for local mock success and failure paths.
- Added `CloudFunctionPhotoAnalysisService` placeholder/TODO without Firebase imports.
- Added backend `analyzePhoto` mock handler.
- Added backend `AIProviderAdapter`.
- Added backend `MockAnalyzer`.
- Added backend `GeminiAnalyzer` placeholder/TODO.
- Added backend `OpenAIAnalyzer` placeholder/TODO.
- Added TypeScript photo analysis contract.
- Added future-only prompt template draft.
- Updated English and Traditional Chinese localization strings for mock AI output and errors.
- Updated iOS and functions README notes.
- Updated manual smoke tests with Phase 06 checks.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-06-ai-photo-advisor-backend.md
- functions/README.md
- functions/src/index.ts
- functions/src/analyzePhoto.ts
- functions/src/ai/AIProviderAdapter.ts
- functions/src/ai/MockAnalyzer.ts
- functions/src/ai/GeminiAnalyzer.ts
- functions/src/ai/OpenAIAnalyzer.ts
- functions/src/contracts/photoAnalysis.ts
- functions/src/prompts/photoAdvisorPrompt.ts
- ios-app/README.md
- ios-app/AIPhotoApp/Models/PhotoAnalysisRequest.swift
- ios-app/AIPhotoApp/Models/PhotoAnalysisResult.swift
- ios-app/AIPhotoApp/Models/PhotoAnalysisStatus.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/PhotoAnalysisService.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/MockPhotoAnalysisService.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/CloudFunctionPhotoAnalysisService.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed local branch was synchronized with `origin/feat/phase-02-auth`.
- [x] Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` existed before implementation.
- [x] Confirmed iOS Phase 06 files do not import Firebase or FirebaseFunctions.
- [x] Confirmed backend Phase 06 files do not import Gemini SDK, OpenAI SDK, or Firebase Admin SDK.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed mock response contains one short summary, up to three suggestions, adjustment hints, `provider = mock`, and `isMock = true`.
- [x] Confirmed no complete AI result UI was added.
- [x] Confirmed no real Gemini call, OpenAI call, Cloud Functions deploy, production Firebase, upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.
- [x] Attempted command-line Xcode simulator build. It failed in the sandbox because SwiftUI `#Preview` macro expansion could not load `PreviewsMacros.SwiftUIView` and CoreSimulator services were unavailable.
- [x] Attempted command-line Xcode device build with signing disabled. It failed for the same sandbox / SwiftUI Preview macro environment.
- [x] Filtered Xcode build errors and confirmed reported Swift `error:` lines point to existing `#Preview` macro expansion failures, not Phase 06 files.
- [x] Backend TypeScript build/check was attempted but could not run because `tsc` is not installed and `functions/node_modules` is absent.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera flow.
- [x] User manually verified photo picker can select an image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success and failure still work.
- [x] User manually verified Home / History / Settings still work.
- [x] User manually verified no AI result UI appears.
- [x] User manually verified no real AI call occurs.
- [x] User manually verified no upload, Firestore write, Storage write, StoreKit, quota, history persistence, or export behavior occurs.
- [x] User manually verified no real Firebase config or secrets were added.

### Known TODOs

- Keep real Cloud Functions callable wiring for a later explicitly requested setup task.
- Keep real Gemini/OpenAI provider setup for a later explicitly requested setup task with server-side secret management.
- Add consent gate, quota enforcement, App Check, structured response validation, cost controls, and provider fallback only in later phases.
- Build complete AI result UI in Phase 07 only after Phase 06 is verified, committed, pushed, and explicitly requested.

### Xcode Build

Codex attempted command-line simulator and device builds. Both failed inside the managed sandbox because Xcode could not access CoreSimulator services and SwiftUI `#Preview` macro expansion reported `PreviewsMacros.SwiftUIView` as unavailable. A filtered error scan showed the Swift `error:` lines are from existing preview declarations, not the new Phase 06 source files.

The user manually verified Phase 06 in Xcode / Simulator and reported that app build / run was acceptable.

### Backend Check

`git diff --check` passed. Backend TypeScript build did not run because `tsc` is not installed in this environment and `functions/node_modules` is absent. No npm install was run and no npm dependency was added.

### Ready for Phase 07

No. Phase 06 has been implemented as a mock-only scaffold and manually verified by user in Xcode / Simulator, but Phase 07 should not begin until Phase 06 is committed, pushed, and explicitly requested.

### Notes

Do not put AI API keys in the iOS app. Real provider keys should use server-side secret management in a later explicitly requested setup task.

---

## Phase 07 - AI Photo Advisor Result UI Scaffold

Status: Implemented as mock-only scaffold; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a mock-only iOS AI Photo Advisor result UI using the Phase 06 `PhotoAnalysisService` protocol and `MockPhotoAnalysisService`, while keeping all analysis state local to memory and avoiding real AI, Firebase, Cloud Functions, StoreKit, quota, persistence, and secrets.

### Summary

Phase 07 added a mock AI advice panel after the filtered preview / mock save flow. The panel can trigger local mock analysis, display loading / success / failure states, retry after failure, dismiss results, and render the Phase 06 mock `PhotoAnalysisResult` with a short summary, up to three suggestions, adjustment hints, and composition / lighting notes.

After user Simulator testing, Phase 07 also received a minimal UI fix for the selected-photo flow: the mock AI result panel is now reachable through vertical scrolling on small iPhone screens, and dynamic priority / adjustment localization labels now render user-readable strings instead of raw localization keys. The user manually verified the scroll and localization fixes in Xcode / Simulator.

No Gemini API key, OpenAI API key, Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, real Gemini call, real OpenAI call, Cloud Functions call, Cloud Functions deploy, image upload, Firestore write, Storage write, AI result persistence, history persistence, AI chat, image editing, realtime video AI, StoreKit, subscription/paywall, quota enforcement, npm dependency, or Phase 08 work was added.

### Completed

- Read the Phase 07 prompt and required project context.
- Confirmed current branch, latest commit, sync status, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added `AIAnalysisViewModel` using the Phase 06 `PhotoAnalysisService` protocol.
- Added mock-only AI analysis entry UI after the filtered preview / mock save flow.
- Added loading, success, failure, retry, and dismiss UI states.
- Added result UI for summary, up to three suggestions, adjustment hints, and composition / lighting notes.
- Added suggestion and adjustment hint card views.
- Wired `FilteredPhotoPreview` to show the Phase 07 mock AI advice panel.
- Kept analysis state local to memory for the current selected photo flow.
- Fixed selected-photo layout so the Phase 07 result panel can scroll vertically on small simulator screens.
- Fixed dynamic priority and adjustment labels so they display localized text instead of raw localization keys.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 07 checks.
- Ran command-line Xcode simulator build successfully with `iPhone 17`.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-07-ai-advisor-result-ui.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisViewModel.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisSuggestionCard.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAdjustmentHintCard.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran pre-implementation git and project checks.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed local branch was synchronized with `origin/feat/phase-02-auth` before implementation.
- [x] Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` existed before implementation.
- [x] Confirmed the implementation uses `MockPhotoAnalysisService` and does not call Cloud Functions.
- [x] Confirmed iOS Phase 07 files do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed no real Gemini call, OpenAI call, Cloud Functions deploy, production Firebase, upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, realtime video AI, or Phase 08 work was added.
- [x] Command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 17' build`.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera flow.
- [x] User manually verified photo picker can select an image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success and failure still work.
- [x] User manually verified mock AI analysis can be triggered.
- [x] User manually verified loading / result / failure / retry / dismiss states work.
- [x] User manually verified the AI result panel can scroll vertically.
- [x] User manually verified localization keys no longer appear for priority / adjustment labels.
- [x] User manually verified Home / History / Settings still work.
- [x] User manually verified no obvious major bug is present.
- [x] User manually verified no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, history persistence, export behavior, real Firebase config, or secrets are present.

### Known TODOs

- Keep real Cloud Functions callable wiring for a later explicitly requested setup task.
- Keep real Gemini/OpenAI provider setup for a later explicitly requested setup task with server-side secret management.
- Add consent gate, quota enforcement, App Check, structured response validation, cost controls, provider fallback, and production AI result persistence only in later phases.
- Do not add AI chat follow-up, image editing, realtime video AI, StoreKit, subscription/paywall, or quota logic in Phase 07.

### Ready for Phase 08

Yes. Phase 07 has been manually verified, committed, and pushed; Phase 08 local session history work has now started.

---

## Phase 08 - Local Session History / Timeline Scaffold

Status: Completed; manually verified by user in Xcode / Simulator

### Goal

Add current-session, memory-only History tab items for the local photo flow after mock save or mock AI analysis.

### Completed

- Added `SessionHistoryItem` and `SessionHistoryStatus` model scaffolds.
- Added an app-level in-memory `SessionHistoryStore` / `MockSessionHistoryStore`.
- Shared the session history store through SwiftUI environment object state.
- Updated Camera / Filter / Mock Save / Mock AI flow so mock save or mock AI success can add/update the same local session item.
- Updated History tab from an honest placeholder to a local-only session timeline scaffold.
- Added empty state, scrollable local cards, local/mock badges, created time, source, filter preset, mock save status, optional mock AI summary, and clear local session history action.
- Kept thumbnails as small in-memory UI images only.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 08 checks.
- Fixed a History tab freeze caused by mismatched SwiftUI `EnvironmentObject` injection / lookup types for the session history store.

### Safety Notes

No Firebase Storage upload, Firestore write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, new SDK, npm dependency, real Firebase config, API key, secret, or Phase 09 work was added.

### Manual Verification

- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified the History tab can be entered normally and no longer freezes.
- [x] User manually verified the History empty state is usable.
- [x] User manually verified mock save success adds a local-only session card.
- [x] User manually verified mock AI analysis success updates the History card with a mock AI summary.
- [x] User manually verified the History list scrolls.
- [x] User manually verified clear local session history works.
- [x] User manually verified cards show local-only / mock labels.
- [x] User manually verified UI copy does not claim cloud history, permanent history, or sync.
- [x] User manually verified Home / Camera / Filters / Mock Save / Mock AI / History / Settings still work.
- [x] User manually verified no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, export, disk persistence, UserDefaults persistence, real Firebase config, or secrets were added.

### Ready for Phase 09

No. Phase 08 has been manually verified, but Phase 09 should not begin until Phase 08 is committed, pushed, and explicitly requested.

---

## Phase 09 - MVP Polish / UX Hardening

Status: Completed; manually verified by user in Xcode / Simulator

### Goal

Polish the existing mock MVP flow without adding new product features or connecting production services.

### Completed

- Added `docs/prompts/phase-09-mvp-polish-ux-hardening.md`.
- Polished Home copy and hierarchy so the app is presented as a mock MVP demo instead of implying active quota enforcement.
- Improved Camera scroll behavior by using one outer scroll container for capture, selected-photo, filter, mock save, mock AI, status messages, and local-only notes.
- Added clearer Camera helper copy for Simulator / photo import testing.
- Made mock save failure a visible text button instead of an icon-only action.
- Improved mock save state text wrapping.
- Made mock AI result retry / dismiss controls easier to tap.
- Made History clear action clearer and visually destructive.
- Changed History card filter detail from raw preset id to localized preset name.
- Added Settings copy that explicitly states cloud, subscription, AI, quota, and account deletion backend services are not connected.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 09 checks.

### Safety Notes

No real Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, new SDK, npm dependency, real Firebase config, API key, secret, or Phase 10 work was added.

### Verification

- [x] Codex performed source-level safety checks for forbidden imports and config files.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera -> Photo Picker -> Filter -> Mock Save -> Mock AI -> History main flow was smooth.
- [x] User manually verified Camera selected-photo flow can scroll and is not blocked by tab bar / safe area.
- [x] User manually verified AI result UI can scroll and retry / dismiss work.
- [x] User manually verified History tab can be entered, card list scrolls, and clear local history works.
- [x] User manually verified empty / loading / error states look acceptable.
- [x] User manually verified Traditional Chinese copy looks natural and no obvious raw localization key appears.
- [x] User manually verified local-only / mock labels are clear but not too noisy.
- [x] User manually verified Settings placeholders do not claim real backend, subscription, or account deletion completion.
- [x] User manually verified no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, export, disk persistence, UserDefaults behavior, real Firebase config, or secrets were added.

### Ready for Phase 10

No. Phase 09 has been manually verified, but Phase 10 should not begin until Phase 09 is committed, pushed, and explicitly requested.

---

## Phase 10 - MVP Demo QA / Release Readiness

Status: Implemented as documentation / QA readiness scaffold; awaiting user review

### Goal

Create a demo script, QA checklist, known limitations document, and readiness gates for the current local/mock MVP without adding product features or connecting production services.

### Completed

- Added `docs/prompts/phase-10-mvp-demo-qa-readiness.md`.
- Added `docs/mvp-demo-script.md`.
- Added `docs/mvp-known-limitations.md`.
- Added `docs/mvp-readiness-checklist.md`.
- Updated root README with current mock MVP status and links to Phase 10 docs.
- Updated iOS README with Phase 10 documentation notes.
- Updated manual smoke tests with Phase 10 documentation and QA readiness checks.
- Recorded that Phase 10 is docs-only and does not require Xcode build unless UI code changes later.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/mvp-known-limitations.md
- docs/mvp-readiness-checklist.md
- docs/phase-log.md
- docs/prompts/phase-10-mvp-demo-qa-readiness.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No Swift code, backend code, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, Firebase project ID, Gemini/OpenAI key, private key, OAuth secret, Apple credential, Firebase import, Gemini/OpenAI import, StoreKit import, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, subscription/paywall, quota enforcement, disk persistence, UserDefaults persistence, Core Data, SwiftData, export, save-to-Photos, new npm dependency, third-party SDK, production release claim, or Phase 11 work was added.

### Verification

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed latest commit was Phase 09 MVP UX polish.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Pre-check confirmed Phase 09 is recorded as completed / manually checked.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, or export implementation.
- [x] Secret/config scan found only `.env.example` placeholders and documentation command references, not real secrets.
- [x] Xcode build was not run because Phase 10 did not modify Swift code.

### Known TODOs

- User should review the new MVP demo script and readiness docs.
- User should run the demo script in Xcode / Simulator if a fresh demo rehearsal is desired.
- Physical iPhone / iPad capture remains optional but recommended before a real demo.
- Real Firebase, real AI, StoreKit, persistence, export, privacy consent, account deletion, and production App Store readiness remain future phases.

### Ready for Phase 11

No. Phase 10 should be reviewed, committed, pushed, and explicitly approved before Phase 11 starts.

---

## Phase 11 - Camera-First UX Redesign

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit with known product gaps documented
Date completed: 2026-06-09

### Goal

Make the current local/mock MVP camera-first without starting Phase 12 or connecting real services.

### Completed

- Made Camera the default primary tab in `MainTabShellView`.
- Kept Guide / Home as a secondary tab instead of deleting existing explanatory content.
- Kept History and Settings accessible.
- Updated Camera so tab-hosted Camera does not show a Close button, while full-screen Camera launched from the guide still can close.
- Updated the camera viewfinder surface to a larger 4:5 portrait frame to support the 5:4-style camera-first direction on iOS portrait screens.
- Added a lower-right filter entry on the camera surface.
- Reused the existing local preset selector from the lower-right filter entry.
- Preserved only the existing presets: Original, Classic Film, Warm Vintage, and Faded Chrome.
- Preserved Photo Picker fallback.
- Preserved mock save, mock AI advice, and local session history flow.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / MVP demo script / manual smoke tests for Phase 11.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/phase-log.md
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API key, Firebase project ID, private key, Apple credential, Firebase import, FirebaseFunctions import, FirebaseStorage import, FirebaseFirestore import, Gemini/OpenAI import, StoreKit import, Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, backend code change, new npm dependency, third-party SDK, production cloud history, or Phase 12 work was added.

### Verification

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [x] User Xcode / Simulator verification accepted on 2026-06-09.
- [x] User confirmed Camera tab can be entered and the current Phase 11 result is acceptable for commit.
- [x] User confirmed Photo Picker fallback, existing four filter presets, mock save, mock AI, local history, History, and Settings remain available.
- [x] User confirmed no real Firebase, real AI, StoreKit, persistence, or export behavior was added.
- [ ] Codex command-line build remains blocked by sandbox-exec / CoreSimulator environment restrictions after reaching Swift compilation.

### Known TODOs

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera page should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should become more prominent and overall information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Phase 11B / Camera Entry Flow & Camera Shell Redesign, if the current implementation is not yet product-satisfying.
- Optional physical iPhone / iPad capture verification remains useful.
- Phase 12 filter research and preset schema should not begin until Phase 11 is reviewed, committed, pushed, and explicitly requested.

### Ready for Phase 12

No. Phase 11 should be committed, pushed, and read-only confirmed before Phase 12 starts.

---

## Phase 11B - Camera Entry Flow & Camera Shell Redesign

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit with known product gaps documented
Date completed: 2026-06-09

### Goal

Refine Phase 11 so the app truly enters Camera first, does not gate basic camera use behind landing or Auth, and makes the Camera page feel more like a real camera shell.

### Completed

- Removed the launch landing / browse screen from the default app entry path.
- Removed launch-time Auth gating from the default app entry path.
- Updated `AppRootView` to enter the main tab shell directly.
- Preserved the existing mock Auth scaffold.
- Moved mock Auth access into Settings as a future cloud-feature entry point.
- Updated Settings copy to explain that login is not required for basic camera use.
- Preserved Camera as the default first tab.
- Redesigned the Camera capture state toward a darker camera shell.
- Kept the large central 4:5 viewfinder.
- Added top camera shell status / selected preset display.
- Added bottom camera controls for flash, timer, capture, camera flip, and photo import.
- Implemented flash / timer / camera flip as UI-only scaffold interactions.
- Preserved the lower-right filter picker entry.
- Preserved Photo Picker fallback.
- Preserved the existing four local presets only.
- Preserved mock save, mock AI advice, local session history, Guide, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / MVP demo script / manual smoke tests.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/phase-log.md
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API key, Firebase project ID, private key, Apple credential, Firebase import, FirebaseFunctions import, FirebaseStorage import, FirebaseFirestore import, Gemini/OpenAI import, StoreKit import, Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, backend code change, new npm dependency, third-party SDK, production cloud history, or Phase 12 work was added.

### Verification

- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [x] Secret/config scan found no real `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, provisioning profile, or Apple credential file.
- [x] Backend / Firebase / package files were not modified.
- [x] User Xcode / Simulator run accepted on 2026-06-09.
- [x] User accepted the current result as commit-ready.
- [ ] Codex command-line build remains blocked by existing `#Preview` macro / CoreSimulator tooling issues after reaching Swift compilation.

### Known TODOs

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera page should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should become more prominent and overall information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign if the current shell remains visually insufficient.
- Small-screen camera shell layout should be verified again after the next camera-shell pass.
- Optional physical iPhone / iPad capture and controls verification remains useful.
- Phase 12 filter research and preset schema should not begin until Phase 11B is reviewed, committed, pushed, and explicitly requested.

### Ready for Phase 12

No. Phase 11 / 11B should be committed, pushed, and read-only confirmed before Phase 12 starts.

---

## Deferred - Quota System (Former Phase 08 Plan)

Status: Not started

### Goal

Implement free 20 starter analysis credits, daily login +1, free 20-photo storage limit, and quota UI.

### Notes

Quota enforcement should not rely only on client-side logic.

---

## Deferred - Subscription + Paywall (Former Phase 09 Plan)

Status: Not started

### Goal

Implement StoreKit 2 subscription scaffolding, local `.storekit` testing, PaywallView, and entitlement state.

### Notes

RevenueCat is not the MVP default. Do not lock basic camera behind VIP.

---

## Deferred - History + Delete + Local Download (Former Phase 10 Plan)

Status: Not started

### Goal

Implement history list, photo detail, delete single photo, and local download/export flow.

### Notes

Server backup is not required for MVP.

---

## Phase 11 - Privacy Consent + Account Deletion

Status: Not started

### Goal

Implement AI processing consent gate, privacy settings, data management, and account deletion request flow.

### Notes

Photos should not be assumed to be used for model training. `trainingConsent` defaults to false.

---

## Phase 12 - Testing + Release Preparation

Status: Not started

### Goal

Add manual smoke tests, emulator notes, no-secrets validation, release checklist, and TestFlight preparation docs.

### Notes

Do not add new major product features in this phase.

## Phase 21-Z2E-SF-AUTO - SiliconFlow Prompt/Schema Alignment and Bounded Retry

Status: completed`r`nDate: 2026-06-20`r`nProduction readiness: `productionReady:false`

### Summary

Phase 21-Z2E-SF-AUTO completes explicitly approved bounded autonomous SiliconFlow prompt/schema alignment and API retry. The phase keeps SiliconFlow and `Qwen/Qwen3-VL-30B-A3B-Instruct` fixed, uses only approved fixtures `smoke_004` through `smoke_015`, keeps retry `0`, and stays below the hard provider-call cap of `28`.

### Completed Work

- Added `backend/src/providers/siliconflowPhotoAdvisorPromptContract.mjs` with a schema-enum-driven backend prompt contract.
- Updated SiliconFlow provider parsing/diagnostics to report sanitized schema diagnostic buckets without raw provider text.
- Added synthetic prompt/schema alignment tests for valid output, malformed JSON wrappers, unsupported enums, wrong shapes/types, unsafe language, prompt echo, debug leakage, retake-first language, and capture-context overclaim.
- Ran one approved canary call on `smoke_004`, then one approved controlled 12-fixture run.
- Added sanitized result doc `docs/phase-21-z2e-sf-auto-siliconflow-prompt-schema-alignment-and-bounded-retry-summary.md`.

### Sanitized Result

- Total provider calls made: `13` of cap `28`
- Canary call count: `1`
- Full run count: `1`
- Retry count: `0`
- Accepted count: `13`
- Rejected count: `0`
- Validation buckets: `accepted x13`
- Fallback buckets: `none x13`
- Error buckets: none
- Schema diagnostic buckets: none
- Latency buckets: `5s_to_15s x9`, `gt_15s x4`
- Token usage bucket: `lte_20k`
- Cost estimate bucket: `usage_available_cost_not_computed`

### Boundary Checks

- Raw provider response printed/persisted/committed: no
- Raw model text printed/persisted/committed: no
- Raw prompt/request payload printed/persisted/committed: no
- Raw image/base64/path printed/persisted/committed: no
- API key printed/persisted/committed: no
- Provider credential or raw report committed: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Production rollout: no

### Changed Files

- `backend/package.json`
- `backend/src/providers/siliconflowPhotoAdvisorProviderContract.mjs`
- `backend/src/providers/siliconflowPhotoAdvisorPromptContract.mjs`
- `backend/tests/siliconflow-photo-advisor-prompt-schema-alignment.test.mjs`
- `docs/phase-21-z2e-sf-auto-siliconflow-prompt-schema-alignment-and-bounded-retry-summary.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

### Known TODOs

- Review latency buckets before any beta decision because `gt_15s` appeared in four accepted calls.
- Recheck SiliconFlow pricing, terms, retention/training policy, and consent requirements before any real-user beta.
- Keep iOS integration, upload-payload changes, app-facing endpoints, live camera cloud AI, and production rollout blocked until separately approved.

### Next Phase

Ready for Phase 21-Z2F-SF: SiliconFlow Accepted Benchmark Review and Beta Readiness Decision Gate. Not ready for production rollout.

## Phase 21-Z2F-SF-LATENCY - SiliconFlow Single-image Latency Probe and Compact Prompt

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-Z2F-SF-LATENCY responds to the operator request to reduce severe SiliconFlow latency using one smoke JPG per provider call. It runs approved single-image probes with `smoke_004` only, retry `0`, JavaScript / Node.js backend path, sanitized aggregate output only, and no iOS/runtime/upload changes.

### Completed Work

- Ran `11` total SiliconFlow single-image provider calls with `smoke_004` only and retry `0`.
- Tested baseline prompt, compact prompt, ultra-compact prompt, lower `max_tokens`, JSON object response format, and `enable_thinking:false`.
- Found `enable_thinking:false` invalid for this VLM request shape and did not commit it.
- Found `max_tokens:128` too tight for valid schema output.
- Set the no-runtime backend contract default to compact prompt + `maxOutputTokens:192`.
- Added latency summary doc `docs/phase-21-z2f-sf-single-image-latency-probe-and-compact-prompt-summary.md`.

### Sanitized Result

- Baseline accepted probe: `9427ms`, token usage bucket `lte_5k`.
- Best accepted compact probe: `5466ms`, token usage bucket `lte_1k`.
- Post-patch accepted validation: `10473ms`, token usage bucket `lte_1k`.
- Current evidence does not support `0.15s` end-to-end SiliconFlow serverless latency for backend-mediated image upload plus remote VLM generation.

### Boundary Checks

- Raw provider response printed/persisted/committed: no
- Raw model text printed/persisted/committed: no
- Raw prompt/request payload printed/persisted/committed: no
- Raw image/base64/path printed/persisted/committed: no
- API key printed/persisted/committed: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Production rollout: no

### Next Phase

Ready for Phase 21-Z2G-SF: SiliconFlow Latency Architecture Decision Gate. Not ready for production rollout.


## Phase 21-Z2G-SF - SiliconFlow Network/Parameter Latency Probe

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-Z2G-SF responds to operator-proposed latency tactics: keep-alive / connection pooling, HTTP/2, closer routing, image compression, streaming, shorter output, lower temperature, and shorter prompts. It tests only backend-safe request/transport parameters with `smoke_004`, retry `0`, sanitized aggregate output only, and no iOS/runtime/upload changes.

### Completed Work

- Ran `5` successful escalated SiliconFlow provider calls with `smoke_004` only and retry `0`.
- Confirmed sandboxed network attempts returned `provider_network_error` before provider response, so the real probe required escalated network access.
- Tested sequential same-process Node `fetch`, `stream:true` TTFT, and ultra-short `max_tokens:80` / `50` variants.
- Kept the backend contract at compact prompt + `maxOutputTokens:192`.
- Added latency summary doc `docs/phase-21-z2g-sf-network-parameter-latency-probe-summary.md`.

### Sanitized Result

- Compact `max_tokens:192` sequential accepted calls: `8637ms` and `8529ms`.
- Compact `max_tokens:192` with `stream:true`: TTFT `3979ms`, full validated JSON `9898ms`.
- Ultra-short `max_tokens:80` and `50`: rejected with `provider_json_parse_failed` / `free_form_text_detected`.
- Request body size bucket: `lte_100kb`.
- Current evidence still does not support `0.15s` end-to-end SiliconFlow serverless latency for backend-mediated image upload plus remote VLM validation.

### Boundary Checks

- Raw provider response printed/persisted/committed: no
- Raw model text printed/persisted/committed: no
- Raw prompt/request payload printed/persisted/committed: no
- Raw image/base64/path printed/persisted/committed: no
- API key printed/persisted/committed: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Production rollout: no

### Next Phase

Ready for Phase 21-Z2H-SF: SiliconFlow Latency Architecture Decision Gate. Not ready for production rollout.

## Docs - On-device Live Framing AI Roadmap Direction Update

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Updated roadmap documentation to reflect today's AI direction change: real-time / live camera guidance should move away from cloud live VLM as the primary path and prioritize on-device Apple Vision / AVFoundation geometry, hardware depth when available, and app-side retro-aware composition rules.

### Completed Work

- Added `docs/on-device-live-framing-ai-roadmap.md`.
- Repositioned SiliconFlow / RunPod / open-weight VLM work as valid for post-capture Photo Advisor, offline benchmark, internal evaluation, schema validation, and possible future labeling/distillation, but not the default live camera guidance path.
- Set revised Phase 21 plan: Phase 21-A Vision geometry spike, Phase 21-B AVFoundation depth capability probe, Phase 21-C Depth Anything V2 Small Core ML sandbox, Phase 21-D Florence-2-base feasibility study, and Phase 21-E dataset collector + AI-assisted labeling pipeline skeleton.
- Recorded safety language: short, non-judgmental, retro-aware hints following Observation -> Mood -> Retro intent -> Optional action.
- Recorded not-now boundaries for Florence-2 production integration, Depth Anything production bundle, live cloud AI, automatic dataset crawler, AI provider labeling run, fine-tuning, and user-photo training.

### Changed Files

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/on-device-live-framing-ai-roadmap.md`
- `docs/product-roadmap-next.md`
- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/live-guidance-roadmap.md`
- `docs/local-on-device-cv-camera-aids-plan.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Docs-only update: yes
- Runtime code changed: no
- Model files / Core ML packages added: no
- Dataset crawler or provider labeling adapter added: no
- Network/model/provider calls made: no
- iOS provider/model SDK/key/direct call added: no
- Camera live cloud AI entry added: no
- Preview frame upload added: no
- Backend/iOS upload payload changed: no
- Raw frames/images/GPS/EXIF/sensor data/face descriptors/sensitive attributes persisted: no
- Generated reports, local fixtures, real photos, model outputs, downloaded datasets, local configs, or provider responses committed: no

### Next Phase

Ready for Phase 21-A: On-device Vision Geometry Spike. Not ready for production rollout.

## Research Docs - On-device Live Framing AI Research Set

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Added deep research Markdown reports for the new on-device Live Framing AI direction. The research set supports the existing roadmap/register decision and does not change the next recommended implementation phase: `Phase 21-A - On-device Vision Geometry Spike`.

### Created Reports

- `docs/research/on-device-ai-research-index.md`
- `docs/research/apple-vision-live-framing-advisor-report.md`
- `docs/research/on-device-live-framing-hybrid-architecture.md`
- `docs/research/device-capability-matrix-live-ai.md`
- `docs/research/depth-anything-v2-small-coreml-report.md`
- `docs/research/florence-2-base-ios-live-framing-report.md`
- `docs/research/live-ai-privacy-safety-appstore-report.md`
- `docs/research/dataset-collector-bot-labeling-pipeline-report.md`
- `docs/research/florence-2-finetune-distillation-workflow.md`

### Updated Existing Docs

- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Research Markdown only: yes
- Runtime code added: no
- Model files / Core ML / ONNX / TFLite packages added: no
- Dataset crawler code added: no
- AI provider labeling adapter added: no
- Provider/model API keys added: no
- Direct provider/model calls in iOS added: no
- Camera live cloud AI added: no
- Preview frames uploaded: no
- Backend/iOS upload payload changed: no
- Real photos, generated reports, local fixtures, model outputs, downloaded datasets, local configs, provider responses, or raw labels committed: no
- `productionReady:false` remains locked.

### Next Phase

Ready for `Phase 21-A - On-device Vision Geometry Spike`. Not ready for production rollout.
## Phase 21-A - On-device Vision Geometry Spike

Status: implemented, pending Xcode verification
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-A starts the revised on-device live framing intelligence track with Apple Vision / AVFoundation only. It extends the existing local live guidance path so sampled preview frames can produce geometry-only composition signals without cloud VLM latency, frame upload, provider keys, model files, or backend payload changes.

### Completed Work

- Added typed local `LiveFrameSignals` / `GeometrySignals` / `DepthSignals` / `CompositionSignals` / `SafetyFlags` contracts.
- Added Apple Vision geometry analysis for face rectangles and human body pose-derived subject bounds.
- Added composition buckets for subject center, edge margin, headroom, footroom, subject size ratio, rule-of-thirds proximity, negative space, subject balance, and vertical balance.
- Added a normalized coordinate mapper for future SwiftUI debug overlays.
- Connected the analyzer into the existing local live guidance sample-buffer path with the existing `0.6s` throttle.
- Reused existing safe guidance copy keys and stability logic; no score/rating, harsh critique, sensitive inference, or retake-first language was added.

### Changed Files

- `ios-app/AIPhotoApp/Features/Camera/LiveFrameGeometrySignals.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceVisionGeometryAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraOverlayCoordinateMapper.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift`
- `docs/phase-21-a-on-device-vision-geometry-spike-summary.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Apple Vision / AVFoundation only: yes
- Cloud live AI added: no
- Provider/model key or direct iOS provider/model call added: no
- Model files / Core ML / ONNX / TFLite packages added: no
- Depth Anything / Florence runtime added: no
- Preview frame upload added: no
- Backend/iOS upload payload changed: no
- Raw frame/image/GPS/EXIF/sensor stream/face descriptor/sensitive attribute persistence added: no
- Sensitive inference added: no
- Production rollout: no

### Verification

- Source-level checks and repository scans are recorded in the final Phase 21-A handoff.
- Xcode build/run still needs local verification on macOS/Xcode.

### Next Phase

Ready for `Phase 21-B - AVFoundation Depth Capability Probe` after Phase 21-A is committed and pushed. Not ready for production rollout.
## Phase 21-B - AVFoundation Depth Capability Probe

Status: implemented, pending Xcode verification
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-B adds an AVFoundation-only depth capability probe to the on-device live framing track. It detects whether the active camera/photo-output path supports hardware depth data delivery or portrait effects matte support and stores only safe in-memory capability state in local `DepthSignals`.

### Completed Work

- Added `CameraDepthCapabilityProbe` for AVFoundation support detection.
- Added capability states: `hardwareDepthAvailable`, `portraitMatteAvailable`, and `depthUnavailable`.
- Extended `LiveFrameDepthState` with the same states.
- Threaded depth capability state into the existing local Vision geometry analysis path.
- Kept foreground/background separation, subject distance, and confidence buckets as `unknown` until a future phase explicitly uses real depth data.
- Added `docs/phase-21-b-avfoundation-depth-capability-probe-summary.md`.

### Changed Files

- `ios-app/AIPhotoApp/Features/Camera/CameraDepthCapabilityProbe.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveFrameGeometrySignals.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceVisionGeometryAnalyzer.swift`
- `docs/phase-21-b-avfoundation-depth-capability-probe-summary.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/on-device-live-framing-ai-roadmap.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- AVFoundation-only capability probe: yes
- Raw `AVDepthData` read/logged/persisted/uploaded: no
- `AVCaptureDepthDataOutput` added: no
- Depth delivery enabled: no
- Portrait matte delivery enabled: no
- Depth Anything / Florence / Core ML runtime added: no
- Model files / packages added: no
- Preview frame upload added: no
- Backend/iOS upload payload changed: no
- Sensitive inference added: no
- Production rollout: no

### Verification

- Source-level checks and repository scans are recorded in the final Phase 21-B handoff.
- Xcode build/run still needs local verification on macOS/Xcode.

### Next Phase

Ready for `Phase 21-C - Depth Anything V2 Small Core ML Sandbox` after Phase 21-B is committed and pushed. Not ready for production rollout.
## Phase 21-A2 - Live Framing Aesthetic Spatial Codebook

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-A2 adds a docs-only Live Framing Aesthetic Spatial Codebook for future live framing labels, AI-assisted label candidates, Florence-2 feasibility, and distillation planning. It does not define a good/bad photo dictionary and does not add runtime behavior.

### Completed Work

- Added `docs/research/live-framing-aesthetic-spatial-codebook.md`.
- Defined Risk Signal, Strength Signal, Retro Intent Preservation, Advisor Action, and Safety Rejection codebooks.
- Defined severity, confidence, review status, and evidence buckets without numeric scoring.
- Added a non-runtime label candidate JSON example for future schema planning.
- Linked the codebook from `docs/research/on-device-ai-research-index.md`.
- Recorded this docs-only phase in handoff and manual smoke test notes.

### Changed Files

- `docs/research/live-framing-aesthetic-spatial-codebook.md`
- `docs/research/on-device-ai-research-index.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Docs-only update: yes
- Swift/iOS runtime code changed by this phase: no
- Backend runtime code changed by this phase: no
- JSON schema implementation files added: no
- Dataset crawler added: no
- AI provider labeling adapter added: no
- Model files / Core ML / ONNX / TFLite / MLX packages added: no
- Florence-2 / Depth Anything runtime added: no
- Provider/model calls made: no
- API keys, local configs, raw labels, provider outputs, reports, datasets, or photos added: no
- Camera live cloud AI entry added: no
- Backend/iOS upload payload changed: no
- Good/bad photo scoring dictionary added: no
- `productionReady:false` remains locked.

### Verification

- Git baseline before editing showed existing uncommitted Phase 21-A / Phase 21-B runtime and docs changes; upstream divergence was `0 0` and there were no local-only commits.
- `git diff --check` should be run before commit.
- Runtime build/Xcode behavior is not expected to change from this docs-only phase.

### Known TODOs

- Phase 21-A and Phase 21-B runtime changes remain pending Xcode verification in the existing worktree.
- Convert codebook enums into schema files only in a later explicitly approved phase.
- Add dry-run validators and dataset/label-candidate plumbing only in later phases.

### Next Phase

This phase does not change the current main next implementation phase. The roadmap still lists `Phase 21-C - Depth Anything V2 Small Core ML Sandbox` after Phase 21-B commit/push, with explicit debug/benchmark approval required before any model package is added. Not ready for production rollout.
## Phase 21-C-PRE - Depth Anything V2 Small Core ML Sandbox Preflight

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase 21-C-PRE adds a no-runtime preflight gate before the Depth Anything V2 Small Core ML sandbox. It defines the debug-only sandbox boundary, hardware-depth-first rule, required benchmark metrics, sanitized CLI output, and fail-closed blockers before any model file or Core ML runtime is considered.

### Completed Work

- Added `backend/src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs`.
- Added `backend/scripts/check-depth-anything-v2-small-coreml-sandbox-preflight.mjs`.
- Added `backend/tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs`.
- Added `npm run qa:depth-anything:preflight`.
- Added `docs/phase-21-c-pre-depth-anything-v2-small-coreml-sandbox-preflight.md`.
- Updated roadmap, README, backend/iOS README, handoff, and manual smoke notes.
- Aligned the preflight policy/output with the requested Phase 21-C keys: `eligibleForFutureBenchmark`, `modelFileAdded`, `runtimeInferenceEnabled`, `cameraPreviewIntegrationEnabled`, `liveFrameProcessingEnabled`, `rawFramePersistence`, `rawDepthMapPersistence`, `hardwareDepthPriority`, `requiredFutureGates`, and `blockedReasons`.

### Changed Files

- `backend/package.json`
- `backend/src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs`
- `backend/scripts/check-depth-anything-v2-small-coreml-sandbox-preflight.mjs`
- `backend/tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs`
- `docs/phase-21-c-pre-depth-anything-v2-small-coreml-sandbox-preflight.md`
- `docs/on-device-live-framing-ai-roadmap.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Model file / package added: no
- Core ML runtime enabled: no
- Model download added: no
- Depth Anything inference run: no
- Benchmark run: no
- Preview-frame upload added: no
- Camera live cloud AI entry added: no
- iOS provider/model key or direct provider/model call added: no
- Backend/iOS upload payload changed: no
- Raw frame/depth/image logging or persistence added: no
- Sensitive inference added: no
- Production rollout: no

### Verification

- `git diff --check` should be run before commit.
- `cd backend && npm run qa:depth-anything:preflight` should pass.
- `cd backend && node --test tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs` should pass.
- Xcode build/run still needs local verification on macOS/Xcode.

### Next Phase

Ready for Phase OD naming. A future Depth Anything sandbox remains debug/benchmark-only, hardware-depth-first, local-only, and not production-ready.
## Phase OD-03 - Depth Anything V2 Small Core ML Sandbox Preflight Plan

Status: completed
Date: 2026-06-20
Production readiness: `productionReady:false`

### Summary

Phase OD-03 records a docs-only plan for a future Depth Anything V2 Small Core ML sandbox. It does not add a backend preflight gate, CLI script, backend tests, Swift runtime file, model file, Core ML package, model download, inference execution, benchmark run, Camera integration, upload path, provider call, API key, or production rollout.

The local `ios-app/AIPhotoApp/Features/Camera/DepthAnythingV2SmallSandbox.swift` scaffold remains untracked for a later separate phase such as `Phase OD-03B - Depth Anything iOS Sandbox Placeholder` and must not be staged with this docs-only commit.

### Completed Work

- Added a docs-only Depth Anything V2 Small Core ML sandbox preflight plan.
- Recorded future hardware-depth-first, debug-only, sanitized-metric, and benchmark-gate expectations.
- Recorded that no backend preflight gate/script/tests were added in this commit.
- Recorded that no Swift runtime/scaffold file is included in this commit.
- Added `docs/phase-21-c-depth-anything-v2-small-coreml-sandbox-summary.md` as a planning document only.
- Updated roadmap, README, backend/iOS README, handoff, and manual smoke notes.

### Changed Files

- `docs/phase-21-c-depth-anything-v2-small-coreml-sandbox-summary.md`
- `docs/on-device-live-framing-ai-roadmap.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Docs-only planning: yes
- Backend preflight gate/script/tests added: no
- Swift runtime/scaffold file staged: no
- Depth Anything model file / package added: no
- Core ML package added: no
- Model download added: no
- Inference execution added: no
- Benchmark run: no
- Camera runtime integration added: no
- Preview-frame upload added: no
- Camera live cloud AI entry added: no
- Provider/model key or direct provider/model call added: no
- Backend/iOS upload payload changed: no
- Raw frame/depth/image logging or persistence added: no
- Sensitive inference added: no
- Production rollout: no

### Verification

- `git diff --check` should be run before commit.
- `git diff --cached --check` should be run before commit.
- Xcode runtime behavior is not expected to change because this commit is docs-only.

### Next Phase

Recommended next if continuing Depth Anything: `Phase OD-03B - Depth Anything iOS Sandbox Placeholder`, requiring separate explicit approval. Not ready for production rollout.
## Phase OD-03A - Depth Anything V2 Small Core ML Backend No-runtime Preflight Gate

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

### Summary

Phase OD-03A adds the backend no-runtime preflight gate for future Depth Anything V2 Small Core ML sandbox work. The gate validates policy objects only and does not read images, load models, call Core ML, call network, inspect local model paths, run inference, or change iOS runtime behavior.

### Completed Work

- Added/confirmed `backend/src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs`.
- Added/confirmed `backend/scripts/check-depth-anything-v2-small-coreml-sandbox-preflight.mjs`.
- Added/confirmed backend tests for default pass, fail-closed forbidden flags, missing required gates, and no required provider/cloud fields.
- Added/confirmed `npm run qa:depth-anything:preflight`.
- Updated README, backend/iOS README, handoff, manual smoke notes, and OD-03 summary docs.

### Changed Files

- `backend/src/qa/depthAnythingV2SmallCoreMlSandboxPreflightGate.mjs`
- `backend/scripts/check-depth-anything-v2-small-coreml-sandbox-preflight.mjs`
- `backend/tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-21-c-depth-anything-v2-small-coreml-sandbox-summary.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Backend policy gate only: yes
- Swift runtime file added: no
- iOS project/runtime change: no
- Model file / Core ML package / model download added: no
- Runtime inference / benchmark run added: no
- Camera integration / camera frame processing added: no
- Upload path / provider call / API key added: no
- Dataset, fixture, local config, generated report, or real photo added: no
- Raw frame/image/depth persistence added: no
- Production rollout: no

### Verification

- `git diff --check` should pass before commit.
- `cd backend && npm test` should pass before commit.
- `cd backend && npm run qa:depth-anything:preflight` should pass before commit.

### Next Phase

Recommended next if continuing Depth Anything: `Phase OD-03B - Depth Anything iOS Sandbox Placeholder`, requiring separate explicit approval. Not ready for production rollout.
## Phase OD-R1 - Aesthetic Parameter Registry

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

### Summary

Phase OD-R1 starts the OD-R research / definition / parameter / dataset / fine-tune preparation direction. It adds a backend-only Aesthetic Parameter Registry for structured photography aesthetic error tags and keeps app/model installation for later OD-P product integration after benchmark and safety gates pass.

### Completed Work

- Added `backend/src/qa/aestheticParameterRegistry.mjs`.
- Added `backend/scripts/check-aesthetic-parameter-registry.mjs`.
- Added `backend/tests/aesthetic-parameter-registry.test.mjs`.
- Added `npm run qa:aesthetic-parameters:registry`.
- Added `docs/od-r1-aesthetic-parameter-registry.md`.
- Updated roadmap, README, backend/iOS README, handoff, and manual smoke notes for the OD-R / OD-P direction.

### Changed Files

- `backend/package.json`
- `backend/src/qa/aestheticParameterRegistry.mjs`
- `backend/scripts/check-aesthetic-parameter-registry.mjs`
- `backend/tests/aesthetic-parameter-registry.test.mjs`
- `docs/od-r1-aesthetic-parameter-registry.md`
- `docs/on-device-live-framing-ai-roadmap.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `README.md`
- `backend/README.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `docs/handoff/codex-transition-handoff.md`
- `tests/manual-smoke-tests.md`

### Boundary Checks

- Backend registry/validator only: yes
- Swift runtime file added: no
- OD-03B Swift placeholder brought back: no
- Model file / Core ML package / model download added: no
- Runtime inference / Camera integration / live frame processing added: no
- Crawler/download mode added: no
- Cloud teacher call added: no
- Training/fine-tuning/distillation run added: no
- Upload path / provider call / API key added: no
- Dataset, fixture, photo, local config, generated report, or raw label added: no
- Production rollout: no

### Verification

- `git diff --check` should pass before commit.
- `cd backend && npm test` should pass before commit.
- `cd backend && npm run qa:aesthetic-parameters:registry` should pass before commit.

### Next Phase

Recommended next OD-R phase: `Phase OD-R2 - Dataset / Source Manifest Schema`. Not ready for production rollout.
