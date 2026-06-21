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
??? README.md
??? AGENTS.md
??? .gitignore
??? .env.example
??? .firebaserc.example
??? docs/
??  ??? 00-common-background-v2.md
??  ??? 01-product-mvp-scope.md
??  ??? 02-technical-architecture.md
??  ??? 03-camera-filter-image-pipeline.md
??  ??? 04-ai-photo-advisor.md
??  ??? 05-firebase-storage-firestore-functions.md
??  ??? 06-ui-ux-design-system.md
??  ??? 07-subscription-quota-storekit.md
??  ??? 08-privacy-security-app-store-risk.md
??  ??? 09-codex-phase-plan.md
??  ??? phase-log.md
??  ??? decisions.md
??  ??? prompts/
??? ios-app/
??? functions/
??? firebase/
??? scripts/
??? tests/
```

## Phase-Based Development Workflow

Development happens one phase at a time. Do not start the next phase unless it is explicitly requested.

Current phase:

- Phase 21-A3-R5 polishes the local Camera flash/session/filter-preview runtime after physical-device verification of selfie parity. Front camera keeps the local screen-flash behavior, back camera flash is enabled only when the active hardware camera supports flash, unsupported flash UI is dimmed/disabled, capture only receives an effective flash-enabled value, `AVCaptureSession.startRunning()` / `stopRunning()` run on a dedicated background queue, and live filtered preview rendering is throttled with Core Image intermediate caching disabled to reduce memory pressure. It adds no cloud AI, provider/model call, provider key, preview-frame upload, upload payload change, raw frame persistence beyond in-memory rendering, Depth Anything/Core ML model runtime, or production rollout.
- Phase 21-A3-R4 fixes the Camera live filter preview path and adds a front-camera final-save mirror toggle. Non-original filters now use the same Core Image adjustment pipeline for live AVFoundation video frames via a local Metal-backed preview layer, so the viewfinder is designed to match the filtered captured result instead of showing an unfiltered feed. Front-camera preview remains mirrored, while a local toggle controls whether the captured/saved selfie source image is mirrored. It adds no cloud AI, provider/model call, provider key, preview-frame upload, upload payload change, raw frame persistence beyond in-memory rendering, Depth Anything/Core ML model runtime, or production rollout.
- Phase 21-A3-R3-R1 keeps the simple focal framing-box crop path and tunes it for dynamic aspect + pinch control. The Camera preview remains the standard 1x aspect-fit feed; the focal box is hidden at the selected lens/base focal length, auto-shows when pinch-out or slider focal length goes above base, clamps/hides again when pinched back to base, and reshapes to the selected `4:5`, `1:1`, or `3:4` crop aspect. It adds no cloud AI, provider/model call, provider key, preview-frame upload, upload payload change, raw frame persistence beyond normal captured photo flow, Depth Anything/Core ML runtime, or production rollout.
- Phase 21-A3-R1 fixes real-device Camera controls and preview behavior after iPhone testing found front-camera toggle, mm/lens switching, viewfinder/capture framing, live filter preview, and flash behavior were not correctly wired. It adds local AVFoundation camera/lens switching, device-detected lens options, aspect-fit preview framing, mirrored selfie preview, lightweight live filter preview, and flash capture settings. It adds no cloud AI, provider/model call, provider key, preview-frame upload, upload payload change, raw frame persistence, Depth Anything/Core ML runtime, or production rollout.
- Phase 21-A3 tunes the already-running on-device Apple Vision live guidance path after physical-device feedback showed brightness and Vision geometry hints working but not fully smooth. It reduces analysis interval to `0.5s`, strengthens suggestion hold/cooldown/confirmation, makes geometry thresholds less jittery, and removes automatic positive geometry "ready" hints. It adds no Depth Anything runtime, Core ML inference, cloud AI, provider call, upload, raw frame persistence, or production rollout.
- Phase 21-C-R3-RUN prerequisite check attempted to follow the roadmap into the approved physical-device benchmark step, but safely blocked before execution because the exact C-R3-RUN approval phrase was not present, the local ignored Depth Anything artifact folder contained only the placeholder README, and this Windows environment has no Xcode/physical-device benchmark capability. It adds no model artifact, Core ML package, model download, inference, benchmark, Camera runtime integration, upload path, provider key, raw artifact, or production rollout.
- Phase 21-C-R3 drafts the operator model-artifact verification and physical-device benchmark approval request for Depth Anything V2 Small. It records the exact future C-R3-RUN approval phrase, source/license/checksum/local-ignore prerequisites, physical-device-only benchmark scope, sanitized output format, failure gates, and success criteria. It adds no model artifact, Core ML package, model download, inference execution, benchmark run, Camera runtime integration, upload path, provider key, raw artifact, or production rollout.
- Phase 21-C-R2 adds a local-only ignored artifact folder policy and an iOS Xcode benchmark harness draft for future Depth Anything V2 Small physical-device benchmarking. It adds no model artifact, compiled Core ML model, Core ML package, model download, inference execution, benchmark run, Camera runtime integration, upload path, provider key, raw artifact, or production rollout. The next safe step is an operator model-artifact verification and physical-device benchmark approval request before any real inference.
- Phase 21-C-R1 adds a no-runtime approval gate for Depth Anything V2 Small model artifact source/license review and a future Xcode physical-device benchmark harness. It adds backend CLI/tests and docs only; it does not add a model artifact, Core ML package, model download, Xcode benchmark harness runtime, inference execution, benchmark run, Camera runtime integration, upload path, provider key, raw artifact, or production rollout. The next safe step, if continuing Depth Anything, is a separately approved local-ignored model artifact and Xcode benchmark harness draft.
- Phase 21-C adds a debug-only Depth Anything V2 Small sandbox scaffold for future on-device Core ML depth fallback benchmarking. It is disabled by default, not wired into Camera runtime, hardware-depth-first, and sanitized-metrics-only. It adds no model file, Core ML package, model download, inference execution, benchmark run, preview-frame upload, upload payload change, Camera live cloud AI entry, iOS provider/model key, raw frame/depth persistence, or production rollout. The next practical step is MacBook/Xcode build verification, then a separate model-artifact/source/license and device benchmark harness gate if continuing Depth Anything.
- Phase 21-C-PRE adds a no-runtime Depth Anything V2 Small Core ML sandbox preflight gate. It defines the debug-only sandbox boundary, required benchmark metrics, sanitized CLI/tests, hardware-depth-first rule, and fail-closed blockers for model files, Core ML runtime, model downloads, inference, benchmark execution, raw logging, uploads, cloud/provider calls, iOS provider keys, sensitive inference, and `productionReady:true`. It adds no model file, Core ML package, iOS runtime behavior, preview-frame upload, upload payload change, Camera live cloud AI entry, inference, benchmark, or production rollout. The next recommended phase after commit/push is `Phase 21-C - Depth Anything V2 Small Core ML Sandbox`.
- Phase 21-B adds an AVFoundation-only depth capability probe for the active camera/photo-output path. It records only in-memory capability states (`hardwareDepthAvailable`, `portraitMatteAvailable`, `depthUnavailable`) inside local `DepthSignals`; it does not enable depth delivery, read/persist/upload raw `AVDepthData`, add Depth Anything/Florence runtime, add model files, change upload payloads, or change production readiness. The next recommended phase after commit/push is `Phase 21-C - Depth Anything V2 Small Core ML Sandbox`, which still requires explicit debug/benchmark approval before any model package is added.
- Phase 21-A started the on-device live framing implementation track with Apple Vision geometry-only analysis for ephemeral preview frames. It adds typed local geometry/composition signal contracts, a Vision face/body/pose geometry analyzer, safe composition buckets, and a future overlay coordinate mapper. It adds no cloud live AI, no provider/model key, no direct iOS provider/model call, no model file, no frame upload, no backend/iOS upload payload change, no raw frame persistence, and no production rollout.
- Today's AI direction update adds `docs/on-device-live-framing-ai-roadmap.md`. Real-time camera guidance should now prioritize on-device Apple Vision / AVFoundation geometry, hardware depth when available, and app-side retro-aware rules instead of cloud live VLM as the primary path. Existing SiliconFlow / RunPod / open-weight VLM work remains valid for post-capture Photo Advisor, offline benchmark, internal evaluation, and future labeling/distillation, but no runtime code, model file, provider call, upload payload change, Camera live cloud AI entry, or production readiness change is added.
- The on-device live framing AI research set is indexed at `docs/research/on-device-ai-research-index.md`. It covers Apple Vision, hybrid architecture, device tiers, Depth Anything V2 Small, Florence-2-base, privacy/App Store safety, dataset collection, and fine-tuning/distillation as research Markdown only. Phase 21-A implements the first Apple Vision geometry spike; later Depth Anything / Florence work remains blocked until separately approved and benchmarked.
- Phase 21-G2 adds `docs/missing-features-and-deferred-roadmap-register.md`, a docs-only memory/backlog register for missing, deferred, blocked, partially built, and not-yet-integrated app/backend/VLM features. It records newly discussed Qwen MoE, Live Advisor trigger/WSS, compression, quantization, and local CV directions without approving runtime implementation.
- Phase 21-G3 adds `docs/phase-roadmap-sequencing-and-next-action-register.md`, a docs-only "what next?" sequencing register for future phase recommendations after commit/push completion.
- Phase 21-H2 adds `docs/qwen35b-a3b-moe-live-advisor-target-reevaluation.md` and a no-network backend target gate for Qwen MoE / Live Advisor direction. Phase 21-W-R1 later clarifies the future target candidate as `Qwen3-VL-30B-A3B`; model upgrade/benchmarking remains a later separately approved phase. This record runs no model calls, no Qwen inference, no benchmark, no iOS integration, no endpoint, and no production readiness change.
- Phase 21-I adds `docs/image-compression-upload-payload-policy-gate.md` and a no-network backend policy gate for future compressed preview upload payload boundaries. It audits the existing DEBUG post-capture compression/upload scaffold, keeps Live Advisor upload runtime blocked, requires metadata stripping, consent, retention/deletion, Auto-Trigger linkage, 1 FPS policy, backend mediation, and `productionReady:false`, and adds no upload runtime, compression runtime, iOS payload change, cloud AI runtime, endpoint, model call, Qwen inference, or benchmark.
- Phase 21-J adds `docs/auto-trigger-1fps-live-advisor-policy-gate.md` and a no-network backend policy gate for future Auto-Trigger + 1 FPS Live Advisor boundaries. It audits local CoreMotion/capture-context and mock Camera snapshot scaffolds, requires stillness greater than 1 second, `<=1s` no-capture/no-upload/no-backend/no-model behavior, max 1 FPS cloud analysis, consent, disabled/off state, Phase 21-I compression/upload policy, backend mediation, backoff, local-CV-only fast aids, and `productionReady:false`, and adds no runtime, endpoint, model call, Qwen inference, or benchmark.
- Phase 21-K adds `docs/stateful-wss-live-advisor-protocol-preflight.md` and a no-network backend protocol preflight gate for future Stateful WSS Live Advisor boundaries. It audits for WSS/WebSocket/live-session behavior, defines backend-mediated session lifecycle, server busy/backoff, safe retry, no raw video streaming, Auto-Trigger/1 FPS/compression dependencies, privacy/logging, iOS/backend boundaries, and `productionReady:false`, and adds no WSS runtime, WebSocket server/client runtime, upload runtime, endpoint, model call, Qwen inference, or benchmark.
- Phase 21-L adds `docs/local-on-device-cv-camera-aids-plan.md` and a no-network backend policy gate for future local on-device CV camera aids. It audits existing grid overlay, local capture context/motion/level/exposure buckets, local/mock guidance building blocks, and mock/debug cloud scaffolds; defines grid alignment, horizon/level, exposure warning, motion/stability buckets, 60fps smoothness, local-only privacy/data-retention, Auto-Trigger relationship, cloud VLM boundary, and `productionReady:false`; and adds no local CV runtime, Camera cloud AI runtime, Auto-Trigger runtime, WSS runtime, upload/compression runtime, iOS payload change, endpoint, model call, Qwen inference, or benchmark.
- Phase 21-M adds `docs/quantization-serving-benchmark-plan.md` and a no-network backend plan gate for future quantization and serving benchmark decisions. Phase 21-W-R1 clarifies the future target candidate as `Qwen3-VL-30B-A3B`; the current reference path remains the existing Transformers+FastAPI local/private Qwen VLM sandbox. No serving benchmark runtime, model download, model switch, `local_model` enablement, vLLM/SGLang/Ollama call, Qwen inference, fixture inference, iOS runtime dependency, endpoint, or production rollout is added.
- Phase 21-N records an explicitly approved one-fixture backend local/private model smoke attempt that stopped before any model call because required fixture token `smoke_001` was not present/approved in the ignored local fixture registry. It adds a sanitized blocked report only and adds no serving benchmark, model switch, production `local_model` enablement, vLLM/SGLang/Ollama call, iOS integration, endpoint, runtime upload, raw artifact, secret, or production rollout.
- Phase 21-N-R0 inspects the missing `smoke_001` prerequisite and keeps the model-call boundary closed. The ignored local `smoke_001.*` fixture file is missing, so the ignored registry was not edited and the next step is operator-provided local-only fixture preparation.
- Phase 21-N-R0B rechecks operator-provided `smoke_001` fixture preparation and the fixture file is still missing. The ignored registry remains unedited and no model call, Qwen inference, fixture inference, benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R0C rechecks operator supply of exactly one approved local-only `smoke_001` fixture. The fixture file is now present locally and ignored, the ignored registry now has an approved `smoke_001` entry, and no model call, Qwen inference, fixture inference, benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R1 attempted the approved one-fixture local model smoke retry but stopped before healthz/model execution because the ignored local config fixture token was not `smoke_001`. It adds a guarded retry CLI and sanitized blocked report only; no model call, Qwen inference, fixture inference, benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R1B resolves the ignored local config fixture-token mismatch locally so the configured fixture token is now `smoke_001`. The ignored local config, fixture registry, and fixture image remain ignored/untracked/unstaged. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R1C attempted the approved one-fixture local model smoke retry after config fix. The guarded command ran once and blocked at healthz before any model call. No retry, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R1D diagnoses the healthz blocker with no-model healthz-only checks. After operator local/private server startup, healthz is now sanitized bucket `safe`; the ignored local config, fixture registry, and `smoke_001` fixture remain ready. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-N-R1E runs the explicitly approved one-fixture backend local/private model smoke retry after the healthz fix. The guarded command ran once with `smoke_001`, zero retries, and was accepted with sanitized aggregate output only. No serving benchmark, model switch, production `local_model`, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-O adds a no-model serving benchmark execution preflight/scope gate. It defines no-model contract checks, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation boundaries while running no benchmark, model call, Qwen inference, fixture inference, vLLM/SGLang/Ollama call, serving switch, endpoint, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-P adds a no-model serving benchmark plan approval matrix. It records approval requirements for no-model contract preflight, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation while running no benchmark, model call, Qwen inference, fixture inference, vLLM/SGLang/Ollama call, serving switch, endpoint, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-Q adds a no-model vLLM serving contract preflight. It defines future vLLM request/response boundaries, backend-mediated structured JSON expectations, validator/fallback/safety requirements, and raw-artifact/iOS/endpoint blocks while running no vLLM runtime, vLLM endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, endpoint, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-R adds a no-model SGLang serving contract preflight. It defines future SGLang request/response boundaries, backend-mediated structured JSON expectations, validator/fallback/safety requirements, and raw-artifact/iOS/endpoint blocks while running no SGLang runtime, SGLang endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, endpoint, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-S adds a no-model serving stack comparison matrix. It compares Transformers+FastAPI reference, vLLM candidate, SGLang challenger, and Ollama/LM Studio manual-only roles while running no serving runtime, endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-T adds a one-fixture serving benchmark approval request draft and no-model approval-request gate. It drafts a future Phase 21-U approval phrase for exactly one Transformers+FastAPI reference benchmark with fixture `smoke_001`, one call, zero retries, healthz required, sanitized report only, and `productionReady:false`, while running no serving runtime, endpoint call, model call, Qwen inference, fixture inference, benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-U runs the explicitly approved Transformers+FastAPI reference one-fixture serving benchmark with `smoke_001`, exactly one backend local/private model call, and zero retries. The sanitized result is accepted with latency bucket `gt_15s`; no 12-fixture benchmark, concurrency benchmark, quantization benchmark, Live Advisor simulation, vLLM/SGLang/Ollama call, serving switch, endpoint, iOS integration, raw artifact, secret, or production rollout occurs.
- Phase 21-V adds a controlled multi-fixture serving benchmark approval request draft and no-model dry-run gate. It proposes future Phase 21-W approval phrases for a controlled 3-fixture pilot or controlled 12-fixture benchmark while running no serving runtime, endpoint call, model call, Qwen inference, fixture inference, benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-W0 inventories the ignored local fixture registry with sanitized token/count output only. It finds 13 approved ready fixture tokens, not exactly 12, so no benchmark, model call, endpoint call, fixture inference, registry/config/fixture modification, raw artifact, secret, or production rollout occurs.
- Phase 21-W adds a guarded Transformers+FastAPI controlled 12-fixture benchmark wrapper and attempts the approved command exactly once for `smoke_004` through `smoke_015`. The attempt preflight-blocks before model calls with sanitized bucket `blocked_for_unsafe_endpoint_bucket`; call count remains `0`, retry count remains `0`, no raw artifacts are printed or persisted, and `productionReady:false` remains locked.
- Phase 21-W-R1 resolves the controlled wrapper endpoint bucket mismatch by normalizing local config buckets such as `local_loopback_ip` and `private_lan_ipv4` before policy checks. It runs no model call, benchmark, fixture inference, inference endpoint call, serving switch, iOS integration, raw artifact, or production rollout. It also clarifies `Qwen3-VL-30B-A3B` as a future target candidate only, not used in this phase.
- Phase 21-W-R1B retries the approved controlled 12-fixture Transformers+FastAPI benchmark exactly once after the endpoint bucket fix. It uses `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. The result is mixed/rejected with accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`, no raw artifacts, no iOS/runtime/endpoint change, and `productionReady:false`.
- Phase 21-W-R2 diagnoses the W-R1B rejection path with no model call, benchmark, healthz, inference endpoint call, or external server change. It identifies the likely failure layer as `external_route_error_mapping_or_fixture_token_contract` and keeps `productionReady:false`.
- Phase 21-W-R2C fixes the external Windows FastAPI server no-model fixture-token contract and route-error mapping for approved tokens `smoke_001` and `smoke_004` through `smoke_015`. It adds a no-model external contract check and docs only in the main repo; no model call, benchmark, inference endpoint call, serving switch, iOS integration, endpoint addition, raw artifact, secret, or production rollout occurred.
- Phase 21-W-R2C2 adds backend-side no-model contract echo validation. The external checker still passes and a local/private no-model HTTP endpoint is reachable, but validation blocked because unsupported/missing token responses returned `unknown` buckets instead of explicit sanitized buckets.
- Phase 21-W-R2C-FINAL fixes the no-model contract echo mismatch end to end. External checker and backend validation now pass with unsupported bucket `unsupported_fixture_token`, missing bucket `missing_fixture_token`, approved token count `13`, and no model call, benchmark, inference endpoint call, raw artifact, secret, or production rollout.
- Phase 21-W-R3 was explicitly approved to retry the controlled 12-fixture Transformers+FastAPI benchmark after contract echo validation passed, but healthz preflight blocked with `model_not_loaded` before any benchmark/model calls. Call count stayed `0`, retry count stayed `0`, no inference endpoint was called, no Qwen3-VL-30B-A3B switch/download/load/benchmark/call occurred, and `productionReady:false` remains locked.
- Phase 21-W-R3-R1 diagnoses the `model_not_loaded` healthz block. External no-model contract checking still passes, healthz remains blocked, dependency classes are present, no model/inference/benchmark call occurred, and the next safe action is operator model-enabled startup for the existing reference server.
- Phase 21-W-GOAL was an approved autonomous attempt to reach the controlled 12-fixture benchmark final result. Codex confirmed no-model contract health and attempted one existing helper model-enabled startup, but healthz stayed `model_not_loaded`; no benchmark command ran, model call count stayed `0`, retry count stayed `0`, and `productionReady:false` remains locked.
- Phase 21-W-GOAL-R2 runs the explicitly approved controlled 12-fixture Transformers+FastAPI benchmark after fresh model runtime readiness. Healthz was `safe` with `modelLoaded:true`; the guarded benchmark ran exactly once with `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. All 12 calls rejected with `local_model_unavailable` / `blocked_for_provider_integration` and `lt_1s` latency; no extra calls, retry, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-GOAL-R2-R2 diagnoses that post-readiness `local_model_unavailable` path without model calls or benchmark reruns. It adds external/backend no-model route-contract dry-run diagnostics, identifies primary root cause `fixture_lookup_mismatch`, fixes backend HTTP non-OK mapping so explicit fixture buckets do not collapse to `local_model_unavailable`, and keeps `productionReady:false`.
- Phase 21-W-GOAL-R2-R2A follows up the live route-contract dry-run without model calls or benchmark reruns. Static external dry-run and fixture-token checks still pass, live dry-run still showed `route_not_found`, the cause bucket is `stale_server_process`, and the safe reload attempt then blocked at post-reload healthz with `connection_refused`. No backend live dry-run was rerun after healthz failed, and `productionReady:false` remains locked.
- Phase 21-W-FINAL was an approved bounded autonomous real-model route debug plus benchmark finalization attempt with a total model-call cap of `14`, final benchmark cap of `12`, and retry count `0`. It fixed external sanitized route-error bucket ordering, but the live local/private server remained unavailable after restart and healthz blocked with `connection_refused`, so no diagnostic model call or final benchmark ran. No Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-FINAL-R1 attempts to reconnect model runtime readiness with no model call or benchmark. External static contracts still pass; the server was not listening, a safe local/private restart was attempted, a listener briefly appeared, then backend healthz still blocked with `connection_refused` and the listener exited. Backend live route dry-run was not run after healthz failed, and `productionReady:false` remains locked.
- Phase 21-W-FINAL-R2 completes the Phase 21-W controlled benchmark goal. Codex restored the existing local/private Transformers+FastAPI reference server, mirrored the approved ignored 12-fixture runtime set into the external ignored registry, confirmed safe healthz plus live no-model route dry-run, and ran exactly one controlled benchmark with `smoke_004` through `smoke_015`, call count `12`, retry count `0`. Sanitized aggregate result: accepted `12`, rejected `0`, latency `gt_15s x1` and `5s_to_15s x11`; no raw artifacts, extra calls, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, endpoint addition, production rollout, or `productionReady:true`.
- Phase 21-X reviews the accepted 12-fixture result and records decision bucket `correctness_baseline_pass_latency_not_product_ready`. Phase 21-W is considered reached and the Transformers+FastAPI reference path is a backend correctness baseline, but latency `5s_to_15s x11` plus `gt_15s x1` is not suitable for live camera or production real-time advisor UX. No model call, benchmark, inference endpoint call, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-Y plans the target runtime path: RunPod on-demand A100 80GB, `Qwen3-VL-30B-A3B` as the next target benchmark candidate, daily 2-3 hour scheduled/batch GPU windows, a rough `$80-$170/month` cost assumption to verify before purchase, and post-capture batch/queue Photo Advisor serving rather than live camera real-time. It runs no model call, benchmark, inference endpoint call, RunPod provisioning, Qwen3-VL install/download/load/call, vLLM/SGLang/Ollama install/run, iOS runtime change, raw artifact, secret, or production rollout.
- Phase 21-Y-R1 adds the Asia-first user constraint for Korea, Taiwan, and Hong Kong. RunPod A100 80GB remains primary only if Asia-near availability/cost is acceptable; Japan/Tokyo-like or Korea/Seoul-like regions are preferred, Singapore-like Asia is second, and US West is only a cost/functionality fallback rather than the first Asia latency baseline. It adds no RunPod provisioning, model call, benchmark, Qwen3 install/download/load/call, iOS runtime change, raw artifact, provider credential, secret, or production rollout.
- Phase 21-Z adds Asia-first RunPod A100 80GB + `Qwen3-VL-30B-A3B` deployment prep, no-model contract planning, security/network/storage/budget/batch-queue/localization checklists, and a placeholder-only RunPod config shape. It creates no RunPod resource, provisions no GPU, installs/downloads/loads/calls no Qwen3 model, runs no benchmark, calls no inference endpoint, changes no iOS runtime, commits no provider credential/raw URL/region ID/secret, and keeps `productionReady:false`.
- Phase 21-Z-R1 adds a docs-only API-first serverless VLM re-evaluation gate before RunPod provisioning. SiliconFlow and DashScope / Alibaba Cloud Model Studio / 阿里雲百煉 are candidate providers only; RunPod A100 80GB remains fallback/comparison. It adds cost, privacy/legal/data-governance, product-mode, provider-agnostic adapter, and future benchmark gates without provider API calls, API keys, provider SDKs, RunPod provisioning, Qwen3 install/download/load/call, model calls, benchmarks, inference endpoint calls, iOS runtime changes, upload payload changes, raw artifacts, secrets, or production rollout.
- Phase 21-Z2A-SF consolidates the provided SiliconFlow Qwen3-VL research drafts. SiliconFlow is selected as the primary API-first provider direction, `Qwen/Qwen3-VL-30B-A3B-Instruct` is selected as the primary model direction, and RunPod remains fallback/comparison. It records model-page facts with JSON/structured-output, pricing, privacy/legal, latency, and benchmark caveats, then recommends Phase 21-Z2B-SF no-runtime backend adapter contracts. It adds no provider API call, API key, provider SDK/runtime, image upload, model call, benchmark, RunPod provisioning, local Qwen3 install/download/load/call, iOS runtime change, upload payload change, live cloud AI runtime, raw artifact, secret, or production rollout.
- Phase 21-Z2B-SF adds backend-only SiliconFlow no-runtime provider contracts. It records JavaScript / Node.js as the backend implementation path, captures the operator-provided OpenAI-compatible base URL and `/chat/completions` path for future approved runtime work, adds fail-closed config validation, sanitized placeholder request-shape construction, OpenAI-compatible response text extraction, schema-backed parser/fallback tests, sanitized error buckets, and a readiness CLI. It adds no provider runtime execution, provider SDK, SiliconFlow API call, API key, provider account, image upload, model call, benchmark, inference endpoint call, iOS runtime change, upload payload change, live cloud AI runtime, raw artifact, credential, secret, or production rollout.
- Phase 21-Z2C-SF adds a docs-only approval request draft for a future SiliconFlow 12-fixture API benchmark. It defines exact future scope, copyable approval wording, operator confirmation checklist, local ignored prerequisites, sanitized aggregate output format, failure gates, and success criteria. It does not approve execution by itself and adds no SiliconFlow API call, API key creation/read/print/commit, provider runtime execution, image upload, model call, benchmark, iOS runtime change, upload payload change, live cloud AI runtime, raw artifact, secret, or production rollout.
- Phase 21-Z2C-SF-RUN-PRE adds the missing SiliconFlow benchmark dry-run gate only. It adds a deterministic no-runtime benchmark plan, sanitized dry-run CLI, and tests that pin fixtures `smoke_004` through `smoke_015`, planned calls `12`, actual calls `0`, retry `0`, no API key read, no fixture image open, no network call, and `productionReady:false`.
- Phase 21-Z2C-SF-RUN completed the approved SiliconFlow 12-fixture API benchmark. It used the approved model and fixtures with planned calls `12`, actual calls `12`, retry `0`, and sanitized aggregate output only. Result: accepted `0`, rejected `12`, validation bucket `provider_schema_invalid x12`, fallback bucket `provider_validation_rejected x12`, latency bucket `5s_to_15s x12`, token usage bucket `lte_20k`, and cost bucket `usage_available_cost_not_computed`. No raw provider response, raw prompt, raw request payload, raw image/base64/path, API key, provider credential, iOS runtime change, upload payload change, live cloud AI runtime, app-facing endpoint, production endpoint, raw artifact, secret, or production rollout was added.
- Phase 21-Z2D-SF reviews that SiliconFlow benchmark result as a provider-output/schema alignment failure, not a network/auth/base URL failure, not proof of poor model quality, and not production readiness. SiliconFlow and `Qwen/Qwen3-VL-30B-A3B-Instruct` remain the primary provider/model candidates, RunPod remains fallback/comparison, and the next safe phase is prompt/schema alignment without API calls. No provider API rerun, API key read, model call, benchmark, iOS runtime change, upload payload change, raw artifact, secret, or production rollout is added.
- Phase 21-Z2E-SF-AUTO completes explicitly approved bounded SiliconFlow prompt/schema alignment and retry. It adds a schema-enum-driven backend prompt contract, sanitized parser diagnostic buckets, and synthetic prompt/schema tests; the approved bounded run made `13` provider calls of cap `28`, retry `0`, accepted `13`, rejected `0`, latency buckets `5s_to_15s x9` and `gt_15s x4`, and `productionReady:false`. It commits no raw provider response, raw prompt, request payload, raw image/base64/path, API key, provider credential, raw report, iOS runtime/upload change, live cloud AI runtime, app-facing endpoint, production endpoint, or production rollout. The next recommended phase is Phase 21-Z2F-SF accepted benchmark review and beta readiness decision gate.
- Phase 21-Z2F-SF-LATENCY runs approved one-image SiliconFlow latency probes using `smoke_004` only. It finds compact prompt + `max_tokens:192` as the safest accepted profile, records `enable_thinking:false` as invalid for this VLM request shape, keeps JSON mode disabled, and updates the backend no-runtime contract default to compact prompt + `maxOutputTokens:192`. Best accepted probe was `5466ms`, post-patch validation was `10473ms`, so `0.15s` end-to-end serverless latency is not supported by current evidence. No iOS runtime/upload payload change, raw artifact, secret, app-facing endpoint, production endpoint, or production rollout is added.
- Phase 21-Z2G-SF runs approved backend-only SiliconFlow network/parameter latency probes using `smoke_004` only. Sequential same-process `fetch` with compact `max_tokens:192` stayed accepted at `8637ms` and `8529ms`; `stream:true` produced first chunk at `3979ms` but full validated JSON at `9898ms`; ultra-short `max_tokens:80` and `50` failed schema with `provider_json_parse_failed`. Keep compact `192`; do not enable streaming or lower tokens by default. No iOS runtime/upload payload change, raw artifact, secret, app-facing endpoint, production endpoint, or production rollout is added.
- Phase 21-H adds the controlled backend `local_model` route dry-run plan. It is a no-network/no-model/no-Qwen/no-benchmark plan gate for a future explicitly approved one-fixture, one-call, no-retry backend-internal local/private route test. It does not enable `local_model`, run fixture inference, add iOS integration, add app-facing or production endpoints, accept user-photo uploads, or change `productionReady:false`.

Next phase:

- Recommended practical next step is MacBook/Xcode physical-device verification of Phase 21-A3-R5. Confirm front-camera screen flash works, unsupported back-camera flash states are disabled/dimmed, supported hardware flash still fires, Xcode no longer reports the `startRunning` main-thread hang-risk warning, non-original filters visibly affect the live viewfinder before shutter without memory termination, selfie mirror parity still works, and Phase 21-A3-R3-R1 focal crop behavior still works. Phase 21-C-R3-RUN remains available only after the exact approval phrase in `docs/phase-21-c-r3-depth-anything-operator-artifact-verification-and-physical-device-benchmark-approval-request.md` is provided, a local ignored artifact is ready, and MacBook/Xcode physical-device benchmarking is available. Any model artifact handling, Core ML package use, inference execution, benchmark run, Camera runtime integration beyond explicit local scope, upload path, provider/cloud call, iOS provider/model key, raw artifact, sensitive inference, raw frame persistence, or production rollout requires separate explicit approval.
- Do not start production cloud rollout without explicit approval
- Production rollout remains blocked until a later explicit release phase

Before each task, read `AGENTS.md`, follow the consolidated project rules there, then read the required docs listed there and the relevant phase prompt in `docs/prompts/`.

After each phase, update `docs/phase-log.md` with status, changed files, checks, TODOs, and readiness for the next phase.

## Documentation

Product and architecture reports live in `docs/`.

Phase execution prompts live in `docs/prompts/`.

Transition handoff notes live in `docs/handoff/`; the current Codex / Codex API transition note is `docs/handoff/codex-transition-handoff.md`. Phase 16J refreshes that handoff with the Codex API period work through Phase 16I/R1/R2 and the next recommended Phase 16-only options.

Phase 17A adds a Cloud AI boundary skeleton only: iOS CloudAI models / service protocol / validator / disabled remote skeleton / consent view / image compressor scaffold, plus a mock-only `backend/` with `GET /health` and `POST /v1/ai/photo-advisor`. No real provider is connected, no provider key belongs in iOS or the repo, and existing Photo Advisor remains mock/local by default.

Phase 17B adds DEBUG-only wiring from iOS `RemoteCloudAIService` to the local backend mock `/v1/ai/photo-advisor` endpoint. Production/default behavior remains mock/local, and real provider integration remains future-only.

Phase 17C-Prep hardens the backend boundary before any real provider work: mock-only provider adapter / registry, stricter request and response validation, filter whitelist checks, unsafe response guard, standardized fallback errors, quota / rate-limit / timeout placeholders, redacted logging helper, and backend fixtures/tests. There is still no real provider call, no provider API key, no production remote enablement, and no Camera cloud AI entry.

Phase 17C-R1 switches the backend-only Photo Advisor internal beta to the QweAPI OpenAI-compatible gateway. It is disabled by default and only runs when backend config explicitly sets `ALLOW_INTERNAL_CLOUD_AI=true`, `CLOUD_AI_PROVIDER_MODE=qweInternal`, an internal debug header / token guard passes, server-side `QWE_API_KEY` is configured, `QWE_BASE_URL=https://qweapi.com`, and `QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview`. iOS still has no provider SDK, provider key, or direct QweAPI call; production/default Photo Advisor remains mock/local, and Camera remains local-only.

Current MVP demo / QA readiness docs:

- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/product-roadmap-next.md`
- `docs/feature-change-requests.md`
- `docs/ai-photo-advisor-language-audit.md`
- `docs/photo-advisor-provider-language-contract.md`
- `docs/photo-advisor-provider-qa-dry-run-gate.md`
- `docs/photo-advisor-provider-qa-review-thresholds.md`
- `docs/photo-advisor-provider-qa-operator-runbook.md`
- `docs/photo-advisor-provider-qa-chain-readiness.md`
- `docs/photo-advisor-beta-hardening-plan.md`
- `docs/open-weight-vlm-backend-architecture-adr.md`
- `docs/open-weight-vlm-structured-advisor-benchmark-plan.md`
- `docs/open-weight-vlm-transformers-fastapi-local-adapter.md`
- `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`
- `docs/open-weight-vlm-local-smoke-expansion-gate.md`
- `docs/open-weight-vlm-local-sandbox-review-summary.md`
- `docs/open-weight-vlm-expanded-fixture-registry-plan.md`
- `docs/open-weight-vlm-expanded-smoke-result-review.md`
- `docs/open-weight-vlm-serving-benchmark-decision-gate.md`
- `docs/open-weight-vlm-serving-benchmark-preflight.md`
- `docs/filter-research-popular-film-looks.md`
- `docs/filter-preset-schema.md`
- `docs/filter-roadmap.md`
- `docs/ai-feature-definition-and-prompt-contract.md`
- `docs/product/future-ai-premium-feature-policy.md`
- `docs/product/hk-troublemaker-copy-system-style-guide.md`
- `docs/research/local-on-device-camera-coach-lidar-research.md`
- `docs/research/encrypted-app-to-app-photo-transfer-research.md`
- `docs/research/paid-ai-image-editing-research.md`
- `docs/research/hong-kong-troublemaker-language-mode-research.md`
- `docs/research/pose-overlay-camera-guide-research.md`
- `docs/research/ai-filter-generator-research.md`
- `docs/research/cloud-ai-architecture-research.md`
- `docs/research/post-capture-ai-photo-advisor-ux-research.md`

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

Phase 17A does not change that production boundary: the new backend folder is mock-only and provider-disabled, and the iOS remote Cloud AI service is not production-reachable by default.

Phase 17B keeps the same production boundary. The remote chain is DEBUG/internal only, requires consent, uses compressed JPEG input, validates the structured response, and falls back to local advice on failure.

Phase 17C-Prep keeps provider integration blocked. It only prepares the backend boundary with mock-only provider plumbing, schema hardening, safety fallback, and no-payload logging rules.

Phase 17C is still not a production rollout. It adds backend-only QweAPI OpenAI-compatible internal beta support for Photo Advisor, with structured output validation, safety validation, retry/fallback, and server-side secrets only. Current verification confirms QweAPI text-only chat works and `gemini-3.1-flash-image-preview` returns a validated Photo Advisor image result in internal testing.

Phase 17C-R2 adds a backend provider QA batch workflow for the internal Photo Advisor beta. It records sanitized latency / schema / safety / fallback metrics only; generated QA reports and local QA images are ignored, and production/default remains mock/local.

Phase 17C-R3 runs that QA workflow against five ignored synthetic local QA images. The result keeps production rollout blocked because p95 / max latency and unsafe-response fallbacks still need provider QA review.

Phase 17C-R4 hardens backend QA reporting with p90 / p95 / max latency, timeout / unsafe fallback counters, normalized fallback categories, latency assessment, and an expanded manual review template. It is still internal/debug QA only: iOS has no provider key or direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 17C-R5 tightens Photo Advisor prompt and safety diagnostics to reduce `unsafe_response` fallback risk, adds safe unsafe-category labels to sanitized QA reports, and adds a local-only approved real sample photo workflow. Synthetic images, approved real sample images, and generated QA reports stay ignored; production rollout remains blocked.

Phase 17D-A adds a local-only Camera Capture Context model for safe summarized capture metadata. Captured photos can carry bucketed context such as orientation, lens, selected filter, local guidance exposure summary, and creative intent signals; imported photos default to unavailable / unknown context. Mock/local Photo Advisor can use that context to preserve retro creative intent instead of treating blur, low light, tilt, grain, or unusual framing as automatic mistakes. No GPS/location, raw EXIF dump, continuous sensor stream persistence, backend payload change, provider key, direct provider call, Camera cloud entry, or production rollout is added.

Phase 17D-B extends that local-only context into a Capture Intelligence Pack. Captured photos now snapshot safe bucketed level / motion summaries, local image signal buckets, selected filter context, and a stronger CreativeIntentGuard; imported photos can receive local image buckets while capture-only fields stay unavailable / unknown. DEBUG builds may show a compact bucket preview in Photo Advisor, but production UI does not expose raw sensor streams, raw EXIF, or JSON. Backend provider payloads are unchanged, capture context is not uploaded, Camera remains local-only, and advisor copy still frames blur / tilt / low light / grain / faded color / high contrast as possible retro style rather than automatic retake problems.

Phase 17D-C hardens that local capture intelligence lifecycle for real-device QA. Camera scene changes now stop local motion monitoring when the app backgrounds / becomes inactive and resume only when returning to the active Camera capture flow. Selected-photo, permission-denied, interrupted / unavailable, and import paths clear or avoid motion monitoring safely. The local image signal analyzer now falls back to unknown for very small / invalid inputs and keeps its analysis lightweight. DEBUG context preview remains bucket-only and non-production. Backend provider payloads are still unchanged, capture context is not uploaded, and production rollout remains blocked.

Phase 17D-D adds a commit-safe real-device QA kit for capture intelligence. Reviewers can follow the expanded manual smoke checklist and copy `tests/manual/capture-intelligence-real-device-qa-template.md` into ignored local notes before testing level / motion / light / blur / creative-intent behavior on device. The local mock Photo Advisor no longer marks bright / overexposed mock scenes as automatic retakes; advice remains optional and intent-aware. Real-device QA photos, filled reports, generated images, and device artifacts must stay local / ignored unless a later safe-asset policy explicitly approves committing them.

Phase 18-A0 audits Photo Advisor language and capability coverage before any capture-context backend integration. The new `docs/ai-photo-advisor-language-audit.md` records implemented / partial / missing / unclear capabilities, current multilingual photography language, gaps, the recommended app voice, the future real AI language contract, and recommended next phases. It is documentation-only: no app source, localization, backend payload, provider key, direct provider call, Camera cloud entry, capture-context upload, GPS/location, raw EXIF, sensor persistence, or production rollout was added.

Phase 18-A1 implements the first app-side Photo Advisor language pack. The local/mock advisor now uses structured `advisor.*` language keys for mood, visual signals, retro intent, optional crop / straighten / retake wording, imported-photo fallback, local-only / provider-unavailable fallback, and filter recommendation reasons. The language follows Observation -> Mood -> Retro intent -> Optional action, not Score -> Problem -> Fix -> Retake. It does not add cloud AI functionality, change backend provider payloads, upload capture context, add provider keys to iOS, add a Camera cloud entry, or enable production rollout.

Phase 18-A2 adds a local Filter Recommendation Reason Library for the mock/local Photo Advisor. Every current filter catalog preset is mapped to a language family such as warm film, night grain, street chrome, soft dream, cool fade, or classic film, and recommendation copy now resolves from filter family + safe photo signal + retro aesthetic result. It is app-side/local language work only: no backend provider payload changed, capture context is still not uploaded, iOS still has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 18-A3 formalizes CreativeIntentGuard language rules for the local/mock Photo Advisor. Capture signals are classified as `style_positive`, `acceptable_imperfection`, `technical_risk`, or `unknown` before advice is selected. Blur, motion, tilt, low light, grain, soft focus, high contrast, faded color, overexposure, underexposure, and unusual framing are treated as possible retro creative style unless a severe technical risk is likely. Retake advice remains rare, conservative, and optional. This phase does not add cloud AI functionality, change backend provider payloads, upload capture context, add provider keys to iOS, add a Camera cloud entry, or enable production rollout.

Phase 18-A4 adds a UI-facing Photo Advisor result card language model that consolidates the Phase 18-A1 language pack, Phase 18-A2 filter reason library, and Phase 18-A3 CreativeIntentGuard rules. The local/mock card now prioritizes a mood headline, one short visual reason, one primary filter recommendation with a reason, one optional refinement, and only then optional crop / straighten / retake advice when useful. Production UI no longer displays provider/source labels, raw JSON, raw localization keys, raw capture context, raw EXIF, numeric confidence, score/rating, or internal classification names. Backend payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 18-A5 adds a multilingual local/mock Photo Advisor copy QA and regression kit. `docs/photo-advisor-copy-regression-matrix.md` covers 30 captured / imported / fallback scenarios across English, Traditional Chinese, Cantonese-style, and Simplified Chinese review notes, including copy length guidance, captured-vs-imported rules, CreativeIntentGuard regression rules, and filter reason regression rules. `scripts/validate-photo-advisor-copy-regression.sh` wraps the A2/A3/A4 checks and scans UI-facing advisor code/localization for missing namespaces, raw keys, provider/debug wording, score/rating language, generic filter advice, harsh fix-it copy, and sensitive inference wording. This is app-side QA/documentation/script work only: backend payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 18-B0 aligns the backend-mediated real AI Photo Advisor contract with the Phase 18-A1 through Phase 18-A5 app language system before any production provider output is allowed. `docs/photo-advisor-provider-language-contract.md` records the provider voice contract, CloudAIResponse-to-result-card schema alignment, prompt/validator/fallback audit, and provider QA fixture plan. Backend validation now rejects score/rating wording, harsh fix-it / retake-first language, provider/debug leakage, chain-of-thought wording, and overlong filter reasons. This does not enable production cloud AI, does not change the iOS upload payload, does not upload capture context, does not add provider keys/direct calls to iOS, and does not add a Camera cloud AI entry.

Phase 18-B1 adds synthetic provider contract regression fixtures and fallback parity checks for the backend-mediated Photo Advisor path. The fixtures cover valid app-voice responses plus invalid JSON, markdown prose, schema errors, unsupported filter IDs, overlong text, score/rating language, harsh fix-it / retake-first wording, sensitive inference, chain-of-thought, provider/debug leakage, raw localization keys, raw filter-family IDs, and provider failure fallbacks. Invalid, unsafe, overlong, or provider-leaking output is rejected or mapped to structured fallback before iOS can display it. This does not enable production cloud AI, does not change backend provider request payloads or iOS upload payloads, does not upload capture context, does not add provider keys/direct calls to iOS, and does not add a Camera cloud AI entry.

Phase 18-B2 aligns the real-provider QA runner with the B0/B1 provider contract. `backend/scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract` runs the committed B1 fixtures without credentials, network, real photos, raw prompts, or raw provider responses. Real-provider QA still requires explicit local QweAPI credentials and internal/debug config, and generated reports remain ignored under `backend/reports/provider-qa/`. Reports contain sanitized metrics and redaction flags only, with `productionReady: false`.

Phase 18-B3 adds an internal real-provider QA dry-run gate. `backend/scripts/run-photo-advisor-provider-qa.mjs --check-safety-gate` prints sanitized operator gate status, `npm run qa:photo-advisor` is safe-by-default synthetic-contract QA, and real-provider QA now requires explicit `--run-provider` opt-in plus local ignored credentials and approved ignored samples. No production cloud AI is enabled, backend provider request payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, generated reports/photos remain ignored, and `productionReady` remains false.

Phase 18-B4-pre consolidates long-term Codex project rules into `AGENTS.md` so future phase prompts can reference that file instead of repeating every safety boundary. The consolidated rules cover iOS provider-key/direct-call bans, Camera cloud-entry restrictions, capture-context upload restrictions, raw payload/provider logging bans, GPS/raw EXIF/sensor persistence bans, sensitive-inference bans, provider QA artifact hygiene, `productionReady=false`, and the Photo Advisor language pattern: Observation -> Mood -> Retro intent -> Optional action, never Score -> Problem -> Fix -> Retake. This is documentation/instruction work only and does not change app behavior, backend provider payloads, cloud functionality, or production rollout status.

Phase 18-B4 defines provider QA review thresholds for Photo Advisor in `docs/photo-advisor-provider-qa-review-thresholds.md`. The policy classifies sanitized QA runs as synthetic-contract pass, needs-review, or blocked by safety, schema, filter integrity, language contract, artifact leakage, or provider integration. It records hard blockers, warning thresholds, synthetic-contract acceptance, optional real-provider QA acceptance, and next-phase readiness while keeping `productionReady=false`. This is documentation-only: backend provider request payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 18-B5 adds a lightweight backend provider QA gate summary helper. `backend/scripts/check-photo-advisor-provider-qa-gate.mjs` reads only sanitized Photo Advisor QA report JSON and prints `productionReady: false`, `eligibleForDebugInternalReview`, status categories, hard blockers, warnings, and aggregate metrics. `npm run qa:photo-advisor:review` runs the helper after synthetic or optional real-provider QA. It does not print raw provider text, raw prompts, raw image/base64, request payloads, secrets, or real sample paths. Backend provider request payloads and iOS upload payloads are unchanged, capture context is not uploaded, iOS has no provider key / direct provider call, Camera remains local-only, and production rollout remains blocked.

Phase 18-B6 adds a concise provider QA operator runbook and final pre-integration checklist in `docs/photo-advisor-provider-qa-operator-runbook.md`. It tells operators how to run synthetic QA, the dry-run gate, the QA gate summary helper, and optional real-provider QA only with explicit approval, ignored local credentials, and approved ignored samples. It also defines when to stop immediately, what must never be committed, how to report skipped real-provider QA honestly, and the final checklist before any future debug/internal remote advisor integration. This is docs-only: app behavior, backend provider request payloads, iOS upload payloads, capture-context upload, Camera UI, cloud availability, provider credential handling, and production rollout are unchanged.

Phase 18-B7 performs the final B0-B6 provider QA chain audit in `docs/photo-advisor-provider-qa-chain-readiness.md`. The audit confirms the provider language contract, regression fixtures, sanitized QA runner/reporting, dry-run gate, review thresholds, gate summary helper, and operator runbook form a coherent internal QA safety chain. Phase 18-C is safe to start only as post-capture Advisor beta hardening / internal QA work after the synthetic QA, dry-run gate, and QA helper pass with no hard blockers. This does not enable production cloud AI, change backend/iOS payloads, upload capture context, add iOS provider keys/direct calls, add a Camera cloud entry, or mark production ready.

Phase 18-C0 adds the post-capture Advisor beta hardening plan in `docs/photo-advisor-beta-hardening-plan.md`. The plan defines captured/imported Advisor flow checks, fallback/provider-unavailable UX checks, local/mock consistency, result-card readability, filter recommendation reason quality, CreativeIntentGuard behavior, crop/straighten/retake restraint, multilingual QA, real-device manual QA, regression scripts, acceptance criteria, and an internal QA scenario matrix. It is planning-only: no app/backend runtime behavior changes, no backend provider request payload changes, no iOS upload payload changes, no capture-context upload, no provider key/direct provider call in iOS, no Camera cloud AI entry, no real-provider QA run, and no production rollout.

Phase 18-C1 polishes the local/mock post-capture Advisor result card for beta readability. The UI-facing card keeps the mood headline first, one visual reason, one filter recommendation with a short reason, and at most two optional advice rows. Crop/straighten advice is prioritized before optional retake, non-retake keep-style copy can appear as a gentle secondary note, and missing filters show a calm unavailable note instead of an unusable apply action. This does not change backend provider request payloads, iOS upload payloads, capture-context upload behavior, provider credential handling, Camera UI cloud entry, production remote AI availability, or `productionReady=false`.

Phase 18-C2 hardens the captured / imported / fallback Advisor QA path. Captured photos may still use safe local capture/image context, imported photos keep limited-context wording and do not claim capture-time motion / tilt / exposure / stability, fallback results are explicitly marked as fallback, fallback/error copy avoids mock/internal-result wording, and fallback filters choose from the allowed local catalog when possible. Backend provider request payloads, iOS upload payloads, capture-context upload behavior, provider credential handling, Camera UI cloud entry, production remote AI availability, and `productionReady=false` are unchanged.

Phase 18-C3 polishes multilingual local/mock Photo Advisor copy for beta QA. English, Traditional Chinese, Simplified Chinese, and Cantonese-style Advisor strings were reviewed for short mood-first language, calmer imported/fallback wording, clearer local/on-device labels, and less slang-heavy Cantonese-style phrasing. Backend provider request payloads, iOS upload payloads, capture-context upload behavior, provider credential handling, Camera UI cloud entry, production remote AI availability, and `productionReady=false` are unchanged.

Phase 18-C4 closes the Post-capture Advisor beta hardening track with a readiness audit and Phase 19-A handoff. The local/mock Advisor beta baseline is ready for future architecture planning: mood-first result card, captured/imported/fallback flow rules, multilingual copy baseline, filter reasons, and CreativeIntentGuard behavior are aligned. The next planned phase is `Phase 19-A: Open-weight VLM Backend Architecture ADR`, focused on comparing Qwen2.5-VL / Qwen2-VL / MiniCPM-V candidates, Ollama prototype vs vLLM/SGLang serving, structured JSON output, backend validation/fallback, explicit post-capture consent, no raw image/prompt/provider logging, and no user-photo training without explicit consent. This does not approve production rollout, Camera cloud AI, iOS provider keys/direct model calls, capture-context upload, backend/iOS payload changes, or real-provider production exposure.

Phase 19-A adds `docs/open-weight-vlm-backend-architecture-adr.md`, a documentation-only architecture ADR for a future self-hosted / open-weight VLM Photo Advisor backend. It compares Qwen2.5-VL-7B, Qwen2-VL-7B, MiniCPM-V, and future watchlist candidates; compares Ollama, vLLM, SGLang, and Transformers / FastAPI serving paths; defines a consented post-capture backend architecture with metadata stripping, structured PhotoAdvisor JSON, backend validation, and safe fallback; and documents a prompt/schema-first, evaluation-dataset-next, LoRA/QLoRA-later fine-tuning path. Phase 19-A does not add model server code, cloud functionality, real-provider QA, iOS provider keys/direct model calls, Camera cloud AI, capture-context upload, backend provider request payload changes, iOS upload payload changes, or production rollout.

Phase 19-B adds `docs/open-weight-vlm-structured-advisor-benchmark-plan.md`, a documentation-only benchmark plan for evaluating open-weight VLMs as structured Photo Advisor backends. It narrows the first benchmark candidates to Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B; compares Transformers/FastAPI, Ollama/LM Studio, vLLM, and SGLang roles; defines synthetic/internal fixture categories; proposes enum/key-based VLM candidate JSON with no final UI prose; assigns backend validator/fallback responsibilities; and records metrics/gates for JSON validity, schema compliance, safety, filter family fit, creative intent preservation, retake restraint, imported-context overclaim, latency, and artifact hygiene. Phase 19-B does not add model server code, run real VLM/provider QA, train or fine-tune models, change backend provider request payloads, change iOS upload payloads, upload capture context, add iOS provider/model keys or direct calls, add Camera cloud AI, or enable production rollout.

Phase 19-C adds a backend-only synthetic open-weight VLM benchmark harness skeleton. It includes a candidate JSON schema / validator helper, committed synthetic fixtures, a local no-network benchmark runner, backend tests, and a package script for sanitized aggregate metrics. The harness does not add a model server URL, provider/model credentials, real VLM calls, real provider calls, image upload, iOS integration, backend provider request payload changes, iOS upload payload changes, capture-context upload, Camera cloud AI, training/fine-tuning, or production rollout.

Phase 19-D adds a synthetic benchmark report gate summary for the backend-only open-weight VLM harness. The gate summarizes accepted/rejected counts, expectation pass/fail, rejection categories, safety/schema/source-context/retake/leakage blocker counts, hard blockers, and reviewed metrics while preserving `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`. It does not add model server code, model server URL config, provider/model credentials, real VLM/provider calls, image upload, iOS integration, payload changes, capture-context upload, Camera cloud AI, training/fine-tuning, or production rollout.

Phase 19-E expands the backend-only synthetic open-weight VLM benchmark fixture set from 20 to 40 cases and formalizes failure taxonomy coverage. The expanded fixtures remain JSON/text-only and cover daylight, low light, warm indoor light, neon/night street, blur/motion, soft focus, tilt, grain, high contrast, faded color, backlight/silhouette, clutter/minimal composition, food/object, street, landscape, pet, architecture, imported limited context, severe blur, black image, overexposed image, unsupported filters/enums, sensitive inference, body/appearance judgement, score/rating, chain-of-thought, debug/provider leakage, source-context overclaim, retake false positive, prompt injection, raw localization key leakage, overlong output, unsafe free text, malformed JSON, and timeout stub behavior. The synthetic gate remains passing with `productionReady:false`, no network/model server calls, no provider/model credentials, no real photos, no app integration, and no production rollout.

Phase 19-F adds `docs/open-weight-vlm-real-model-sandbox-preflight.md`, a documentation-only safety plan for a future backend-only local/self-hosted real-model sandbox. It defines what a later Phase 20-A may safely do, allowed model candidates, allowed serving paths, ignored local config rules, approved local image fixture policy, runtime logging/redaction requirements, hard gates, and an operator checklist. Phase 19-F does not add model server code, model server URL config, provider/model credentials, real VLM/provider calls, image upload, iOS integration, payload changes, capture-context upload, Camera cloud AI, training/fine-tuning, or production rollout.

Phase 20-A adds a backend-only local/self-hosted VLM sandbox setup. It introduces an ignored local config pattern with `backend/config/open-weight-vlm.local.example.json`, a config validator / dry-run gate, and package scripts for safe local sandbox checks. The default path remains synthetic/no-network; the future real-model command fails closed in this phase and sends no model request. No app-facing endpoint, model server implementation, model server URL runtime config, provider/model credential, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is added.

Phase 20-B adds a backend-only local VLM sandbox client smoke path. It introduces a stub/no-network client module and smoke script that validates one safe synthetic candidate through the existing VLM schema and benchmark gate, prints sanitized aggregate metrics only, and keeps `networkCallsMade:false`. The explicit future local-model command remains opt-in and fail-closed unless ignored local config, approved local fixtures, synthetic gate success, and a later phase approve real local/self-hosted calls. No app-facing endpoint, real model call, model server implementation, provider/model credential, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is added.

Phase 20-C adds `docs/open-weight-vlm-local-operator-runbook.md` and a backend-only local smoke gate helper for future approved local real-model smoke runs. `npm run qa:open-weight-vlm:local-smoke-gate` checks ignored local config, synthetic benchmark gate status, default no-network smoke status, approved fixture mode, URL/config buckets, redaction flags, and `productionReady:false` without calling a model. The gate fails closed until an ignored local config is explicitly prepared for a later approved Phase 20-D run. No app-facing endpoint, real model call, model server implementation, provider/model credential, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is added.

Phase 20-D ran the first local real-model smoke preflight and stopped safely before any model call. The branch was clean and upstream-synced, backend tests passed, the synthetic benchmark and benchmark gate passed, the local config dry-run passed against the example config, and the default local sandbox smoke passed in no-network mode. The ignored real local config path `backend/config/open-weight-vlm.local.json` is ignored by git but absent on disk, untracked, and unstaged, so the local smoke gate failed closed with sanitized blockers and `networkCallsMade:false`. No real VLM/provider call, app-facing endpoint, model server implementation, provider/model credential, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is added.

Phase 20-D1 prepares the backend-only Transformers + FastAPI local adapter path for a future approved local VLM smoke run. It adds `docs/open-weight-vlm-transformers-fastapi-local-adapter.md`, updates the local sandbox config to recognize `servingStack:"transformers_fastapi"` and a safe fixture token bucket, and lets the explicit local smoke command validate a local FastAPI candidate JSON response through the existing open-weight VLM schema. Default scripts remain no-network/stubbed; no real VLM is run, no model server URL/config is committed, no raw image/path/base64/prompt/model output is logged, and no app-facing endpoint, iOS integration, backend/iOS payload change, capture-context upload, Camera cloud AI, training/fine-tuning, or production rollout is added. `productionReady` remains `false`.

Phase 20-D2E supports a Windows GPU private LAN Transformers FastAPI smoke server for the backend-only local VLM sandbox. Loopback URLs remain accepted by default, while private LAN IPv4 URLs require ignored local config with `allowPrivateLanModelServer:true` and are limited to `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. Public IPs/domains, tunnel/ngrok/cloud-looking URLs, HTTPS URLs, credentialed URLs, query-string secrets, and `0.0.0.0` are rejected, and reports show only sanitized buckets such as `private_lan_ipv4`. This phase does not run a model, start a server, call `--run-local-model`, commit local config/fixtures/reports/model URLs, add app-facing endpoints, add iOS integration, change payloads, upload capture context, add Camera cloud AI, train/fine-tune, or enable production rollout.

Phase 20-D2G keeps the validator strict and adds sanitized schema mismatch diagnostics for local Transformers FastAPI smoke rejects. A D2F private LAN smoke reached the Windows Qwen2.5-VL server and made exactly one local model call, but the backend safely rejected the candidate as `invalid_schema`; raw model output stayed unprinted and unpersisted. D2G diagnostics report only bucketed categories and field names such as `missing_required_field`, `additional_property`, `wrong_type`, `unsupported_enum`, `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, and `safety`. The Windows FastAPI mapper must return the exact repo schema: `visualObservationKey`, string `allowedContext`, object `creativeIntent`, object `technicalRisk`, object `safety`, required `retakeReasonKey`, and no unsupported fields such as `observationKey` or `safetyFlags`. This phase does not loosen validation, retry the model by default, add iOS integration, change payloads, add app-facing endpoints, train/fine-tune, or enable production rollout.

Phase 20-E-A records the first accepted Qwen-backed local VLM smoke from Phase 20-D2J and adds `docs/open-weight-vlm-local-smoke-expansion-gate.md`. The D2J smoke used the Windows GPU Qwen2.5-VL Transformers/FastAPI private LAN server and the MacBook backend sandbox client; contract echo passed first, then one `smoke_001` Qwen-backed candidate passed backend schema/safety validation with `acceptedCount:1`, `rejectedCount:0`, `networkCallsMade:true`, `latencyBucket:gt_15s`, no hard blockers, no schema diagnostic, and all raw artifact persistence flags false. Phase 20-E-A prepares a conservative Phase 20-E-B gate for 3-5 approved ignored fixtures, fixture IDs only, one run per fixture, sanitized aggregate metrics only, no retry loops to chase pass rate, no iOS integration, and `productionReady:false`.

Phase 20-E-E adds `docs/open-weight-vlm-local-sandbox-review-summary.md` as the consolidated backend-only local VLM sandbox review. It summarizes D2J through E-D, records what the Windows-primary sandbox proved, what remains unproven, the current gate inventory, safety/privacy boundaries, Phase 20-F entry criteria, and recommends Phase 20-F Option A: expanded fixture set planning plus fixture registry schema. It does not run real model smoke, expand fixture count, benchmark vLLM/SGLang, add iOS integration, change payloads, or approve production rollout.

Phase 20-F adds `docs/open-weight-vlm-expanded-fixture-registry-plan.md`, a sanitized expanded fixture registry policy module, and `npm run qa:open-weight-vlm:expanded-fixtures`. The dry-run gate validates sample fixture metadata and category coverage without local config, fixture images, model calls, network calls, raw paths, prompts, model outputs, request payloads, or production readiness. It prepares a future controlled 6-8 fixture smoke only after explicit approval.

Phase 20-G ran the explicitly approved controlled eight-fixture local/private smoke once per fixture token with no retries. The sanitized aggregate was `fixtureCount:8`, `acceptedCount:0`, `rejectedCount:8`, `fallbackCategoryCounts:blocked_for_provider_integration x8`, `latencyBucketCounts:lt_1s x8`, no schema diagnostic buckets, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`. The repeatability and failure/latency gates blocked the aggregate, so Phase 20-H is not ready until server-side expanded fixture handling is diagnosed.

Phase 20-H adds `npm run qa:open-weight-vlm:expanded-fixture-provider-diagnostic`, a sanitized no-model diagnostic for the Phase 20-G provider-integration block. It does not call Qwen, read raw image paths, print local config or registry contents, start iOS integration, add endpoints, or change production readiness. The current root-cause hypothesis is an external Windows server fixture availability / routing mismatch for expanded fixture tokens, so another real smoke remains blocked until a no-model contract-echo routing check passes.

Phase 20-I adds `npm run qa:open-weight-vlm:fixture-routing-echo`, backed by a local/private no-model Windows FastAPI contract echo route. It verifies `smoke_001` through `smoke_008` route before any future real smoke retry and reports sanitized aggregate fields only. The Phase 20-I check passed with `totalFixtureTokens:8`, `routeableCount:8`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, and `productionReady:false`.

Phase 20-J reruns the controlled expanded local/private Qwen smoke after the routing fix. The approved run made exactly eight fixture calls, one for each `smoke_001` through `smoke_008`, with no retries or extra fixtures. Sanitized aggregate: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`, `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`, no validation/fallback/schema diagnostic buckets, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.

Phase 20-K reviews that accepted expanded smoke result and documents dataset coverage gaps in `docs/open-weight-vlm-expanded-smoke-result-review.md`. It is planning-only: no real model smoke, fixture images, local registry expansion, iOS integration, app-facing endpoint, production endpoint, serving-stack benchmark, training/fine-tuning, or production readiness change is added. The recommended next step is a no-model 12-fixture coverage expansion plan and registry gate before any future approved real smoke.

Phase 20-L implements that no-model 12-fixture coverage plan in the expanded fixture registry dry-run gate. The gate now reports `totalTargetFixtures:12`, the 12 required categories, missing planned categories, `networkCallsMade:false`, and `productionReady:false`; an 8-category registry reports the four planned gaps (`warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`). No real model smoke, fixture images, local registry commit, iOS integration, app-facing endpoint, production endpoint, or production rollout is added.

Phase 20-M prepares the ignored local 12-fixture set for the next controlled review and extends the no-model fixture routing echo target to 12 tokens. Sanitized gates pass with `totalFixtures:12`, `approvedCount:12`, `blockedCount:0`, `missingRequiredCategories:[]`, `eligibleForControlledSmoke:true`, `totalFixtureTokens:12`, `routeableCount:12`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, and `productionReady:false`. The ignored local registry and fixture images remain uncommitted; no Qwen inference, real smoke, iOS integration, endpoint, serving-stack benchmark, or production rollout is added.

Phase 20-O adds `docs/open-weight-vlm-serving-benchmark-decision-gate.md` as a review/planning gate after the accepted Phase 20-N 12-fixture local/private smoke. It records that `gt_15s x10` is a significant sandbox latency note and recommends Phase 20-P as serving-stack benchmark preflight only. Phase 20-O does not run real smoke, run vLLM/SGLang/Ollama, switch model stacks, add fixture images, add iOS integration, add endpoints, train/fine-tune, or change `productionReady:false`.

Phase 20-P adds `docs/open-weight-vlm-serving-benchmark-preflight.md` and `npm run qa:open-weight-vlm:serving-benchmark-preflight`. The preflight gate validates a sanitized backend-only benchmark plan, serving stack matrix, metrics, fixture rules, artifact policy, stop conditions, and Phase 21 entry criteria with `networkCallsMade:false`, `benchmarkRun:false`, `qwenInferenceRun:false`, and `productionReady:false`. No real model smoke, Qwen inference, vLLM/SGLang/Ollama/LM Studio execution, fixture change, ignored registry change, iOS integration, endpoint, training/fine-tuning, or production rollout is added.

Phase 21-A adds `docs/backend-internal-vlm-gateway-contract-preflight.md` and `npm run qa:open-weight-vlm:gateway-contract-preflight`. The gate validates the backend-internal VLM Gateway request/response contract only. Requests are bucketed metadata / fixture-token only, responses are structured candidate JSON only, and existing validator/safety gates remain the source of truth before any app-facing use. No iOS integration, app-facing endpoint, production endpoint, real user-photo upload, raw image/base64/path/prompt/provider response, model call, serving benchmark, or production readiness change is added.

Phase 21-B adds `backend/src/qa/openWeightVlmGatewayAdapterStub.mjs`, `npm run qa:open-weight-vlm:gateway-adapter-stub`, and `npm run qa:open-weight-vlm:gateway-external-contract-echo`. The adapter stub accepts only the Phase 21-A sanitized internal request contract in fixture-token sandbox mode, maps to structured candidate JSON, validates through the existing open-weight VLM schema/safety chain, and prints sanitized aggregate results only. The external Windows workspace may expose `/local/vlm/gateway-contract-echo` for no-model compatibility checks only; it must not load/call Qwen, run benchmarks, expose production endpoints, or return raw artifacts. `productionReady:false` remains required.

Phase 21-C adds `backend/src/qa/openWeightVlmGatewayProviderRouting.mjs` and `npm run qa:open-weight-vlm:gateway-provider-routing`. The dry-run reviews only backend-internal provider modes. `local_stub` and `local_contract_echo` are allowed; `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes are blocked. The dry-run stays sanitized, no-network, no-model, and `productionReady:false`.

Phase 21-D adds `backend/src/qa/openWeightVlmGatewayProviderAdapterNoModelHttp.mjs` and `npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http`. The check accepts only the `local_contract_echo` route, validates routing before HTTP, calls only local/private healthz plus `/local/vlm/gateway-contract-echo`, validates structured candidate JSON through the existing schema/safety chain, and reports sanitized aggregate status only. No real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama execution, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, raw artifacts, or production readiness change is added.

Phase 21-E adds `docs/cross-platform-backend-deployment-boundary.md`, `backend/src/qa/openWeightVlmCrossPlatformDeploymentBoundary.mjs`, and `npm run qa:open-weight-vlm:cross-platform-boundary`. The gate is no-network/no-model and audits deployment roles plus runtime vs docs-only path rules. Windows paths and local model URLs are allowed only in docs/operator/ignored-example/test-sandbox buckets; backend/iOS runtime and production config must not hardcode Windows paths, Mac local paths, LAN model URLs, public/cloud/tunnel model URLs, provider secrets, direct iOS provider routes, Camera cloud entries, endpoint flags, raw artifact policy allowances, or `productionReady:true`.

Phase 21-F adds `docs/backend-deployment-config-env-preflight.md`, `backend/src/qa/openWeightVlmDeploymentConfigEnvPreflight.mjs`, and `npm run qa:open-weight-vlm:deployment-config-env-preflight`. The gate is no-network/no-model/no-benchmark and validates deployment policy buckets only: app environment, gateway mode, provider mode, provider URL bucket, provider auth bucket, secret injection bucket, timeout bucket, max image bytes bucket, raw logging disabled, metadata stripping required, consent required, retention/deletion policy required, endpoint flags, iOS direct provider flags, and `productionReady:false`. It blocks committed secrets, provider/model keys in iOS/backend source, runtime local paths, unsafe committed provider URLs, raw logging, Camera cloud AI entry, capture-context upload, app-facing/production endpoints, model calls, Qwen inference, benchmarks, and production readiness.

Phase 21-G adds `docs/backend-gateway-local-model-route-approval-gate.md`, `backend/src/qa/openWeightVlmLocalModelRouteApprovalGate.mjs`, and `npm run qa:open-weight-vlm:local-model-route-approval`. The gate is no-network/no-model/no-benchmark and validates only future `local_model` route approval prerequisites. A passing policy remains disabled with `localModelRouteEnabled:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, and `productionReady:false`. It blocks production readiness, public/cloud/tunnel exposure, raw logging or persistence, staged local sandbox artifacts, direct iOS/provider paths, Camera cloud AI entries, backend/iOS payload drift, endpoints, user-photo upload, missing consent/retention/deletion policy, validator or fallback bypass, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, Qwen inference, and model calls.

Phase 21-H adds `docs/backend-gateway-local-model-route-dry-run-plan.md`, `backend/src/qa/openWeightVlmLocalModelRouteDryRunPlan.mjs`, and `npm run qa:open-weight-vlm:local-model-route-dry-run-plan`. The gate validates future dry-run plan objects only: `local_model` remains disabled, first future test must be one declared synthetic local fixture token, one call only, no retries, local/private backend-internal only, structured candidate JSON only, backend validator and fallback/safety gates mandatory, raw artifact policy locked, and `productionReady:false`. It runs no network calls, no model calls, no Qwen inference, no fixture inference, and no serving benchmark.

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

## Phase 15C Local Face Framing Vision Prototype Status

Phase 15C adds the first local Apple Vision face rectangle prototype for live guidance.

Current Phase 15C behavior:

- Local guidance keeps the Phase 15B low-frequency brightness signal path.
- `LiveGuidanceFaceAnalyzer` uses Vision only for local face rectangle / bounding box detection.
- Face rectangle results are converted immediately into derived framing signals such as subject off-center, low headroom, face too close, face too far, and portrait framing ready.
- `import Vision` is limited to the local face analyzer file.
- Mock guidance, Local guidance fallback, Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15C does not do face recognition, identity inference, age / gender / emotion / beauty / attractiveness / health / sensitive inference, face data persistence, face rectangle history, raw frame upload, raw frame streaming, raw frame persistence, raw frame logging, Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 15D Guidance Stability and Priority Status

Phase 15D adds a memory-only stability layer for Local guidance suggestions.

Current Phase 15D behavior:

- Local guidance suggestions are ranked so lighting and face-distance warnings can win over softer composition or filter hints.
- Local guidance shows at most two stable suggestions at once.
- A small cooldown, confirmation count, and hold duration reduce aggressive flicker and repeated suggestions.
- Fallback suggestions are kept calm and should not immediately replace stronger recent hints.
- Mock guidance remains available.
- Phase 15B brightness guidance and Phase 15C face framing / headroom guidance remain available.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 15D does not add new AI ability, new frame analysis types, new Vision request types, higher frame sampling frequency, face recognition, identity inference, age / gender / emotion / beauty / attractiveness / health / sensitive inference, face data persistence, face rectangle history, raw frame upload, raw frame streaming, raw frame persistence, raw frame logging, Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend changes, secrets, dependencies, or third-party SDKs.

## Phase 16 Cloud Snapshot AI Guidance Prototype Status

Phase 16 adds an explicitly triggered, consent-gated mock cloud snapshot guidance flow without connecting real cloud AI.

Current Phase 16 behavior:

- Camera shows a compact AI snapshot / AI Quick Advice entry near the existing guidance controls.
- The user must tap the AI entry, review privacy copy, then explicitly start the mock check.
- Consent copy explains that a future real cloud version would send one snapshot for AI analysis, while Phase 16 is mock-only.
- Consent copy states that there is no background upload, no continuous video stream, no photo/request persistence, and no provider API key in the iOS app.
- `CloudSnapshotGuidanceService` defines the app-side service boundary.
- `MockCloudSnapshotGuidanceService` returns short mock guidance, failed, and unavailable states without network calls.
- `CloudSnapshotGuidanceState` keeps the flow memory-only with idle, consent, preparing, analyzing, result, failed, and unavailable states.
- Local guidance remains available and is not replaced by the optional cloud snapshot flow.
- Camera primary screen, Dazz-like viewport, mock lens selector, selected-photo Back to Camera / Clear, 20 filters/grouping, Photo Picker, mock save, mock AI, local history, Inspiration, History, and Settings remain in scope.

Phase 16 does not add real network requests, URLSession/URLRequest calls, real upload, Firebase Storage, Firestore writes, Cloud Functions calls, Gemini/OpenAI calls, Gemini Live, WebSocket/live video streaming, background frame upload, API keys, Firebase config, StoreKit, persistence, export, save-to-Photos, backend changes, dependencies, raw frame/photo/request payload persistence, face recognition, identity inference, or sensitive attribute inference.

## Phase 16C AI Feature Definition + Prompt UX Contract Status

Phase 16C adds a documentation-only AI feature definition and prompt UX contract at `docs/ai-feature-definition-and-prompt-contract.md`.

The document defines the future role of AI as a camera-first photography assistant, shooting coach, filter recommender, style advisor, and inspiration engine. It also records the AI / AI-like feature map, Pose Overlay concept, AI Filter Generator concept, shared response schema, prompt style guide, safety / privacy boundaries, research backlog, and future roadmap.

Phase 16C does not change Swift app behavior, Camera UI, backend code, real AI integration, networking, upload, persistence, export, Firebase, Gemini/OpenAI, StoreKit, secrets, or production config.

## Phase 16D Pose Overlay Research Backfill Status

Phase 16D adds the Pose Overlay / Pose Master-like camera guide research backfill at `docs/research/pose-overlay-camera-guide-research.md`.

The research recommends that a future Phase 16E start with a static, non-AI Pose Overlay MVP using a passive SwiftUI overlay above the camera preview, original PDF vector assets, no Vision body pose detection, no camera frame upload, and no pose / body / appearance scoring.

Phase 16D does not change Swift app behavior, Camera UI, Pose Overlay implementation, Vision, AI, networking, upload, persistence, export, backend code, secrets, or production config.

## Phase 16E Static Pose Overlay MVP Status

Phase 16E adds a first static, non-AI Pose Overlay MVP to the Camera capture surface.

Current Phase 16E behavior:

- Camera has a compact Pose button.
- Pose opens a quick picker with 8 built-in static pose guides.
- Selecting a pose shows a passive semi-transparent SwiftUI line-art overlay above the camera preview.
- The active pose can be closed or mirrored.
- Pose picker participates in the existing single active Camera callout flow with guidance, AI Snapshot, filter, and lens controls.

Phase 16E uses original in-code placeholder line art and keeps `assetName` fields for future original PDF vector assets. It does not add AI pose suggestion, Vision body pose detection, pose score, body / appearance scoring, camera frame upload, real AI, networking, Firebase, Gemini/OpenAI, StoreKit, persistence, export, backend changes, secrets, or production config.

Phase 16E was manually accepted in Xcode / Simulator on 2026-06-11 after the R1 safe-area and simulator fallback visibility fix. The current pose outlines are intentionally placeholder / visually rough; a later dedicated phase should replace them with proper original PDF/vector pose assets and a stronger pose gallery.

## Phase 16F AI Filter Generator + Cloud AI Architecture Research Backfill Status

Phase 16F adds two documentation-only research backfills:

- `docs/research/ai-filter-generator-research.md`
- `docs/research/cloud-ai-architecture-research.md`

The AI Filter Generator research recommends starting with F1 mock UX and F2 local heuristic recipe generation before any cloud AI. Future cloud mode should return validated structured filter recipe JSON, not generated bitmaps, arbitrary Core Image names, shader/code, or direct rendering control.

The Cloud AI Architecture research recommends keeping the iOS app mock/local-only until a real backend boundary is explicitly implemented. Future real cloud AI should start with a consent-based post-capture Photo Advisor backend endpoint, `POST /v1/ai/photo-advisor`, not Gemini Live, streaming, or AI Filter Generator.

Phase 16F does not change Swift app behavior, Camera UI, backend code, real AI integration, networking, upload, persistence, export, Firebase, Gemini/OpenAI, StoreKit, secrets, or production config.

## Phase 16G AI Filter Generator Mock Status

Phase 16G adds the first F1 mock-only Filter Lab flow inside the Inspiration tab.

User Xcode / Simulator verification was temporarily accepted on 2026-06-11.

Current Phase 16G behavior:

- Inspiration shows a Filter Lab / Generate My Filter entry.
- Users can choose a reference image or use a sample fallback.
- The flow shows mock analyzing, generated filter result, before / after preview, intensity slider, session-only apply, try-another, failed, and unavailable states.
- Generated filters use structured mock recipes with validation / clamping.

Phase 16G does not add real AI, backend code, URLSession/URLRequest, WebSocket, upload, Firebase/Gemini/OpenAI/StoreKit imports, API keys, persistence, export, LUT generation, local heuristic real analysis, public sharing, premium credits, or provider integration.

Known TODOs: Filter Generator remains mock-only, recipe visuals and mapping may need tuning, local heuristic extraction is future work, real backend AI is blocked until Cloud AI boundary work, LUT generation is not implemented, and custom filter persistence is not implemented.

## Phase 16H-Recovery Post-capture AI Advisor UX Research Status

Phase 16H-Recovery adds the missing Post-capture AI Photo Advisor UX research backfill at `docs/research/post-capture-ai-photo-advisor-ux-research.md` and corrects the handoff mismatch where Phase 16H was referenced before its research doc existed in the repo.

The research recommends starting with mock Post-capture Advisor UX before real cloud AI. Future real cloud AI should use `POST /v1/ai/photo-advisor` only after a backend boundary exists, with consent, compressed image upload, structured JSON, validation, no provider key in iOS, no raw photo persistence, and mock fallback.

Phase 16H-Recovery does not change Swift app behavior, Camera UI, backend code, real AI integration, networking, upload, persistence, export, Firebase, Gemini/OpenAI, StoreKit, secrets, or production config.

## Phase 16I Mock Post-capture AI Advisor UX Status

Phase 16I adds a mock-only AI Photo Advisor compact card to the selected-photo result flow for captured and imported photos. It uses typed models, a mock service boundary, 8 fixtures, validator / fallback logic, existing 20-filter recommendations only, and an apply-filter CTA that reuses the existing local filter selection mechanism.

The advisor card is not a chat UI and does not show scores, beauty ratings, attractiveness ratings, caption generation, or sensitive inference. It clearly labels the feature as mock / local demo and states that no photo is uploaded or saved by this advisor flow.

Phase 16I does not add real AI, backend code, URLSession/URLRequest, WebSocket, upload, Firebase/Gemini/OpenAI/StoreKit imports, API keys, persistence, export, save-to-Photos, Gemini Live, caption/social copy, photo scoring, or provider integration.

Phase 16I-R1 refines the selected-photo UX with a floating bottom action tray plus compact floating filter grid / advisor access. Users can open AI advice, view AI-recommended existing filters, open all 20 presets, apply a filter, and have the grid auto-dismiss without scrolling to the bottom of the result page.

Phase 16I-R1 remains mock-only and local. It does not add real AI, backend code, network calls, upload, persistence, export, generated filters, photo scoring, beauty / attractiveness language, provider SDKs, or secrets.

Phase 16I-R2 keeps the floating tray intact while cleaning up selected-photo duplication: the default result screen no longer shows large inline filter, AI advisor, mock save, or legacy mock AI cards under the photo. Inspiration import now uses a selected-photo result flow instead of nesting `CameraView`; Back to Camera switches to the outer Camera tab, while Clear returns to Inspiration. Filter Lab previews are clamped with aspect-fit image layout for square, portrait, landscape, very wide, and very tall references.

Future paid cloud save and future free local lossless download require a dedicated export / entitlement phase. Phase 16I-R2 does not add StoreKit, premium gates, cloud save, local download, save-to-Photos, export, upload, or persistence.

User Xcode / Simulator verification accepted Phase 16I, Phase 16I-R1, and Phase 16I-R2 on 2026-06-11. The accepted scope remains mock-only: the future real cloud advisor requires a backend boundary, a future local heuristic advisor may be added before real cloud if explicitly requested, and cloud save / paid-user cloud save / free local lossless download require a dedicated future entitlement / export phase.

Phase 16K-L adds a local-only heuristic advisor prototype and selected-photo polish. Advisor recommendations now use safe local signals such as selected filter family, imported / captured source, and simple image aspect ratio buckets; recommendations are still validated against the existing filter catalog. The selected-photo result keeps the floating AI / Filter tray as the primary control and uses more compact preview / local-only status presentation.

User Xcode / Simulator verification accepted Phase 16K-L on 2026-06-12. The accepted scope remains local-only / mock-only.

Phase 16K-L does not add real AI, backend code, URLSession/URLRequest, WebSocket, upload, persistence, export, save-to-Photos, StoreKit, cloud save, local download, provider SDKs, secrets, score UI, beauty / attractiveness wording, or sensitive inference.

Phase 16N adds a planning-only future AI / premium feature policy at `docs/product/future-ai-premium-feature-policy.md`. Use it before scoping paid, cloud, export, AI image editing, encrypted transfer, LiDAR, local model, or Hong Kong / 暻餌??language-mode work. Phase 16N does not change Swift app behavior.

Phase 16O saves the ChatGPT-provided Local On-device Camera Coach + LiDAR research at `docs/research/local-on-device-camera-coach-lidar-research.md`. It recommends local-first / on-device-first pre-capture guidance, keeps continuous live cloud AI guidance out of scope, and treats LiDAR / Core ML as later research-backed phases. Phase 16O does not change Swift app behavior.

Phase 16P saves the ChatGPT-provided Encrypted App-to-App High Quality / Lossless Photo Transfer research at `docs/research/encrypted-app-to-app-photo-transfer-research.md`. It recommends defining local high-quality export before any encrypted transfer backend and keeps real export, StoreKit, backend, cloud storage, signed URLs, CryptoKit prototype, Universal Links, upload, and persistence out of scope. Phase 16P does not change Swift app behavior.

Phase 16Q saves the ChatGPT-provided Paid AI Image Editing / ?孵?撣?research at `docs/research/paid-ai-image-editing-research.md`. It recommends mock image editing UX before any real provider integration and keeps real provider calls, backend, StoreKit, prompt guard implementation, upload, persistence, export, quota, entitlement, moderation, and provider adapters out of scope. Phase 16Q does not change Swift app behavior.

Phase 16R saves the ChatGPT-provided Hong Kong / 暻餌??Language Mode UX + Safety research at `docs/research/hong-kong-troublemaker-language-mode-research.md`. It recommends HK2 copy system / style guide documentation before any runtime language mode and keeps explicit profanity mode, Settings UI, copy resolver, localization runtime, persistence, LLM-generated copy, backend, network, and AI-generated live camera copy out of scope. Phase 16R does not change Swift app behavior.

Phase 16S saves the ChatGPT-provided HK2 Hong Kong / 暻餌??Copy System + Safety Style Guide at `docs/product/hk-troublemaker-copy-system-style-guide.md`. It is a product / copy style guide, not runtime implementation, and keeps runtime language mode, Settings UI, explicit profanity mode, copy resolver, localization runtime, persistence, LLM-generated copy, backend, network, and AI-generated live camera copy out of scope. Phase 16S does not change Swift app behavior.

Phase 16T / HK3 adds a Settings-only mock Language / Tone entry based on Phase 16R and HK2. Phase 16T-R1 simplifies it to language-only buttons for English / 蝜?銝剜? / 蝞雿葉??/ 撱?閰? and Phase 16T-R2 hides mock preview / praise loop / explicit phrase cards from the production Settings UI. Cantonese keeps a short safety notice. It does not change Camera guidance, Photo Advisor, Filter Lab, editing runtime copy, app-wide language switching, persistence, backend, network, AI, StoreKit, or provider integration.

Phase 16U / HK4 adds a local-only deterministic copy resolver scaffold for Local Camera Coach / ?祆?撠? copy. Runtime integration is limited to selected camera guidance categories and uses neutral default tone only; HK conversational and non-explicit 暻餌??keys are scaffolded but not connected to Settings or persistence. Explicit profanity runtime, app-wide language switching, backend, network, AI, and provider integration remain out of scope.

Phase 16V promotes that resolver into a limited runtime path for Local Camera Coach only. Settings now persists language / tone preferences using `cameraCoach.languageMode` and `cameraCoach.toneMode`; Camera Coach can show English, Traditional Chinese, Simplified Chinese, Cantonese conversational, or non-explicit 暻餌??deterministic copy. This does not add app-wide language switching, Photo Advisor / Filter Lab / ?孵?撣?copy changes, explicit profanity runtime, backend, network, real AI, StoreKit, upload, export, or raw image / frame persistence.

Phase 16W extends the same persisted language / tone preference to the mock/local Post-capture Photo Advisor. Advisor copy can now display English, Traditional Chinese, Simplified Chinese, Cantonese conversational, or non-explicit 暻餌??phrasing. This keeps the existing advisor UI structure and does not add real AI, backend, network, upload, advisor output persistence, app-wide language switching, Filter Lab / ?孵?撣?copy changes, or explicit profanity runtime.

Phase 16W-R2 makes the Camera tab a local-only AI guidance surface. Camera keeps Local Camera Coach / ?祆?撠? with persisted language / tone copy, while Camera AI Snapshot / cloud-style quick advice is hidden from Camera UI. Inspiration / imported / selected Photo Advisor remains the place for mock/local advisor and future cloud AI entry planning. This does not add real AI, backend, network, upload, new persistence, StoreKit, export, or explicit profanity runtime.

Phase 16X organizes Inspiration as the mock/local AI Hub and creative hub. It groups import photo analysis, Photo Advisor orientation, Filter Lab, a disabled future Photo Edit / ?孵?撣?placeholder, and a future cloud AI consent/no-background-upload notice. Camera remains local-only, and current AI features remain mock/local with no real AI, backend, network, upload, provider SDK, StoreKit, export, or new persistence.

## Phase 16A Camera One-Screen UX Consolidation Status

Phase 16A consolidates the Camera tab into a more one-screen-first shooting surface while keeping Phase 16 mock-only.

Current Phase 16A behavior:

- Camera capture mode is no longer an always-scrolling surface.
- Live Guidance defaults to a compact expandable pill while preserving Mock / Local modes, toggle, brightness guidance, face framing guidance, and stability logic.
- AI Snapshot defaults to a compact entry and opens consent / result UI in a sheet only after explicit user tap.
- Camera tab no longer shows a Photo Picker / Choose Photo entry.
- Inspiration tab owns photo import and opens the existing selected-photo filter / mock save / mock AI / local history flow.
- Timer supports Off, 3s, 5s, and 10s options.
- Front-camera + flash uses a local screen-flash scaffold.
- Filter picker opens from Camera as a sheet instead of occupying the capture surface.

Phase 16A does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, or third-party SDKs.

## Phase 16A-R Native Camera-style Fullscreen UX Rescue Status

Phase 16A-R rescues the Camera capture surface so it behaves more like a native fullscreen camera instead of a scrolling app page.

Current Phase 16A-R behavior:

- Camera shooting mode uses a fullscreen camera canvas with overlaid controls.
- The bottom tab bar is hidden while shooting so it cannot cover the shutter.
- A compact top menu keeps Inspiration, History, and Settings reachable while the Camera tab bar is hidden.
- Shutter stays fixed at bottom center.
- AI Snapshot is a compact button beside the shutter and still opens consent / mock result UI only after explicit tap.
- Live Guidance is a compact lower-preview overlay and expands only when tapped.
- Filter entry is a translucent lower-left viewfinder button showing the current filter.
- Camera tab has no Photo Picker / Choose Photo entry; Inspiration owns photo import.
- Timer remains selectable with Off, 3s, 5s, and 10s.
- Front-camera + flash screen-flash scaffold remains local-only.

Phase 16A-R does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R2 Final Native Camera Layout Alignment Status

Phase 16A-R2 Final tightens the fullscreen Camera capture layout toward a more native iPhone Camera-like arrangement and further expands the viewfinder feel by reclaiming bottom empty space.

Current Phase 16A-R2 Final behavior:

- Viewfinder space is increased by removing the always-expanded lens selector from the lower camera chrome.
- Bottom camera chrome, guidance/filter offsets, and mode rail spacing were tightened so the preview feels closer to the shutter controls.
- Lens selection is now a compact shutter-side menu near the flip camera control.
- Timer still supports Off, 3s, 5s, and 10s, but Off no longer shows a visible label and active durations appear inside the timer control.
- Inspiration, History, and Settings are one tap away from a thin bottom mode rail instead of being hidden only in an overflow menu.
- AI Snapshot remains a compact shutter-side mock-only control.
- Live Guidance remains a compact lower-preview pill / expandable callout.
- Filter entry remains a translucent lower-left viewfinder pill and opens the grouped 20-filter picker only on tap.
- Camera tab still has no Photo Picker / Choose Photo entry; Inspiration owns photo import.

Phase 16A-R2 Final does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R3 Overlay Collision Fix Status

Phase 16A-R3 fixes camera overlay collisions and reclaims more bottom space without starting real cloud AI.

Current Phase 16A-R3 behavior:

- Camera callouts use a single active state so Live Guidance, AI Snapshot, filter picker, and lens dropdown do not remain expanded at the same time.
- Live Guidance now shows either the compact pill or the expanded card, not both stacked together.
- Expanded Live Guidance sits inside the viewfinder on the lower-right, while the filter pill stays lower-left.
- Lens selection uses a compact custom dropdown strip near the flip camera control and auto-collapses after selection.
- Bottom safe-area padding, guidance/filter offsets, and capture rail spacing were tightened again to reduce empty black space under the mode rail.
- AI Snapshot remains a compact shutter-side mock-only control that opens consent / result UI only after explicit tap.
- Camera tab still has no Photo Picker / Choose Photo entry; Inspiration owns photo import.

Phase 16A-R3 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R4 Unified Navigation Insets Status

Phase 16A-R4 separates Camera fullscreen navigation from ordinary content-page navigation.

Current Phase 16A-R4 behavior:

- `MainTabShellView` no longer uses the native `TabView` for the main app shell, avoiding shared tab bar safe-area reservation on Camera.
- Camera renders as a fullscreen variant with its own compact mode rail and no ordinary page bottom padding.
- Inspiration, History, and Settings use a custom floating tab bar with matching icon / label / selected-color language.
- Ordinary pages keep bottom content spacing so their content is not covered by the floating tab bar.
- Camera bottom inset is tightened further now that it is not sharing the ordinary floating tab bar reservation.
- Inspiration remains one tap away from Camera and still owns photo import.

Phase 16A-R4 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R5 Navigation Overlay Root-Cause Status

Phase 16A-R5 fixes the shared bottom navigation layout causes behind Settings CTA obstruction and Camera bottom empty space.

Current Phase 16A-R5 behavior:

- `AppTabBarMetrics` centralizes content-page bottom inset and Camera compact rail spacing.
- Inspiration, History, and Settings use the shared bottom content inset so the custom floating tab bar does not cover final content or CTA rows.
- Camera remains on the fullscreen path and does not receive ordinary content-page bottom padding.
- Camera shutter controls and compact mode rail are separate overlays, so the mode rail no longer pushes the shutter row upward.
- Camera bottom gradients were reduced to reclaim more visible camera area.
- Inspiration remains one tap away and still owns photo import.

Phase 16A-R5 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R6 Source-to-Simulator Verification Status

Phase 16A-R6 confirms the layout source is part of the app target and applies a harder navigation / Camera layout fix.

Current Phase 16A-R6 behavior:

- `AppTabBarMetrics.swift` is included by the Xcode filesystem-synchronized `AIPhotoApp` root group and appears in the sandboxed `xcodebuild` frontend compile input.
- Non-Camera pages now place the custom bottom tab bar with `safeAreaInset`, so page content is laid out above the tab bar instead of being covered by an overlay.
- Settings adds a small bottom `List` footer spacer so the subscription / polish row can scroll fully above the bottom navigation.
- Camera capture mode no longer sits inside a `NavigationStack`; the primary capture path is a fullscreen camera root.
- Camera still keeps selected/imported photo flow in a navigation presentation for the fixed Back / Clear controls.
- Camera mode rail and shutter controls remain separate overlays, with tighter spacing and lower bottom rail placement.

Phase 16A-R6 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16 + Phase 16A-R Closeout Status

Phase 16 mock cloud snapshot guidance and the Phase 16A-R Camera UX rescue have been manually verified by the user in Xcode / Simulator and accepted for commit review.

Accepted current behavior:

- Phase 16 remains a mock-only cloud snapshot service boundary with explicit user consent and no real network/upload.
- Camera UX is acceptable, shutter is visible/tappable, and Camera no longer requires scrolling for capture.
- AI Snapshot compact entry, consent, and mock result work.
- Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability remain normal.
- Guidance / AI / filter / lens callouts do not show obvious overlap.
- Camera tab no longer has Photo Picker; Inspiration owns photo import.
- Ordinary page bottom tab bar and Settings / Inspiration / History bottom content are acceptable.
- 20 filters, mock save, mock AI, local history, History, and Settings remain normal.
- No real network, upload, AI, Firebase, StoreKit, persistence, export, secrets, Firebase config, API keys, or backend changes were added.

Phase 16B / real cloud AI integration remains blocked until Phase 16 + 16A-R are committed, pushed, read-only confirmed, and explicitly requested.

## Phase 16A-R10 Ordinary Tab Bar Placement Status

Phase 16A-R10 moves ordinary-page floating tab bar placement out of the bottom `safeAreaInset` path and into a root overlay with explicit bottom positioning.

Current Phase 16A-R10 behavior:

- Inspiration, History, and Settings floating tab bar is rendered as a root bottom overlay, not inside a bottom safe-area inset container.
- The ordinary floating tab bar uses explicit estimated height, bottom fallback, and bottom clearance metrics.
- Ordinary content bottom padding remains shared so bottom cards / CTA rows can scroll above the floating tab bar.
- Camera remains on the separate fullscreen path and is not affected by the ordinary tab bar placement fix.
- The accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump was removed.

Phase 16A-R10 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R9 Bottom Navigation Safe-Area Status

Phase 16A-R9 polishes bottom navigation safe-area behavior without redesigning the Camera viewfinder.

Current Phase 16A-R9 behavior:

- Ordinary content-page floating tab bar is lifted farther above the home indicator.
- Inspiration and History ScrollView content use the shared bottom footer inset.
- Settings keeps the shared footer spacer so the final subscription / polish row can scroll above the floating tab bar.
- Camera compact mode rail keeps separate fullscreen metrics and now has a minimum home-indicator clearance.
- Camera viewfinder structure and capture controls remain otherwise unchanged from the accepted Phase 16A-R direction.

Phase 16A-R9 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R8 Camera Status Bar / Content Tab Bar Status

Phase 16A-R8 hides the iOS status bar only on the fullscreen Camera tab and lifts the ordinary floating tab bar on content pages.

Current Phase 16A-R8 behavior:

- Camera uses app-shell status bar hiding so the capture surface feels more like a fullscreen native camera.
- Inspiration, History, and Settings keep the normal iOS status bar.
- Camera top controls use a Camera-specific safe-area metric instead of sharing content-page navigation spacing.
- Inspiration, History, and Settings floating tab bar is lifted above the home indicator while content keeps enough bottom padding.
- Camera compact mode rail keeps its own fullscreen metrics and is not affected by the ordinary floating tab bar lift.

Phase 16A-R8 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

## Phase 16A-R7 Camera Control Position Status

Phase 16A-R7 polishes the Camera control positions after the fullscreen R6 pass and lifts the non-Camera floating tab bar.

Current Phase 16A-R7 behavior:

- Camera top controls sit farther below the status bar / Dynamic Island area.
- Camera filter and guidance overlays use separate bottom spacing so their compact pills are less likely to collide.
- AI Snapshot, shutter, flip camera, and lens dropdown remain in one coordinated bottom control band.
- Lens dropdown opens a little higher near the flip / lens controls.
- Camera compact mode rail keeps the same visual language as the ordinary floating tab bar.
- Inspiration, History, and Settings floating tab bar is lifted farther above the bottom edge while Settings keeps its bottom CTA spacer.

Phase 16A-R7 does not add real cloud snapshot upload, Gemini/OpenAI calls, URLSession/URLRequest calls, WebSocket, Firebase Storage, Firestore writes, Cloud Functions calls, StoreKit, persistence, export, save-to-Photos, backend code, secrets, new Vision request types, higher frame sampling frequency, voice / ASR, Gemini Live, face recognition, identity inference, sensitive inference, or third-party SDKs.

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
