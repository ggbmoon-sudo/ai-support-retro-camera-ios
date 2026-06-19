# Phase Roadmap Sequencing and Next Action Register

Status: Phase 21-G3 docs-only roadmap sequencing register  
Date: 2026-06-17  
Production readiness: `productionReady:false`

## Executive Summary

This document reorganizes missing/deferred features into a recommended phase sequence and acts as the "what next?" source of truth after each completed phase.

It is not implementation approval. Future Codex sessions should read this file after every completed phase, especially when the user says "commit/push 摰? or asks what to do next.

If a user asks for the next prompt, Codex should consult this register, identify the current next recommended phase, and provide the next phase prompt directly. If the next phase involves model calls, upload, iOS runtime, endpoint work, WSS, serving benchmarks, or production behavior, Codex must remind the user that explicit approval is required.

`productionReady:false` remains locked. Cloud upload, Live Advisor, iOS integration, WSS runtime, model calls, serving benchmarks, app-facing endpoints, and production endpoints still need explicit future approval.

## Current Next Recommended Phase

**Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate**

Reason: Phase 21-Z2A-SF consolidated the operator-provided SiliconFlow Qwen3-VL API research drafts. SiliconFlow is now the primary API-first provider direction, `Qwen/Qwen3-VL-30B-A3B-Instruct` is the primary model direction, and RunPod A100 80GB remains fallback/comparison. The next step should create backend-only no-runtime contracts, config shape, request-builder shape, parser/fallback tests, and sanitized error buckets without API calls, API keys, provider account creation, image upload, model calls, benchmarks, iOS runtime changes, upload payload changes, or production rollout.

Marker note: Phase 21-W-R2 was implemented and pushed, but its visible commit marker missed the final `e` in `unavailable`. The corrective marker commit restores the exact prerequisite marker `Phase 21-W-R2: diagnose controlled benchmark local model unavailable` without model calls, benchmarks, endpoint calls, external server edits, runtime changes, raw artifacts, secrets, or production rollout.

Phase 21-Z2B-SF should be backend-only and no-runtime: provider enum / adapter type definitions, SiliconFlow provider config schema, error bucket mapper, request builder that does not execute network calls, response parser tests using synthetic strings only, schema validation/fallback tests, readiness script that fails closed when API key is absent, and scans for no raw logging and no iOS provider leakage. Later branches may include Phase 21-Z2C-SF Approved 12-fixture SiliconFlow API VLM Benchmark, Phase 21-Z2D-SF SiliconFlow Cost/Latency/Privacy Decision, and Phase 22-A debug-only iOS backend integration planning after provider benchmark review. Do not call SiliconFlow APIs, create provider keys, create provider accounts, provision RunPod, run another benchmark, run diagnostic model calls, rerun fixtures, call SGLang/vLLM/Ollama, run quantization benchmarks, run concurrency benchmarks, run Live Advisor simulation, download models, switch serving stacks, add app-facing endpoints, add iOS integration, or start production rollout without separate explicit approval.

## How Codex Should Use This File

After any phase is reported complete:

1. Verify whether the phase was committed and pushed.
2. Verify upstream sync is `0 0`.
3. Read this roadmap sequencing file.
4. Check `Current Next Recommended Phase`.
5. Tell the user the next phase name and purpose.
6. If the user asks for a prompt, provide the next phase prompt directly.
7. If the next phase is model-call, upload, iOS-runtime, endpoint, WSS, benchmark, or production-related, remind the user that it requires explicit approval.

Command reminder:

```powershell
git status
git log --oneline "@{u}..HEAD"
git rev-list --left-right --count "@{u}...HEAD"
```

## Current State Snapshot

Use cautious wording and re-check source docs before implementation:

- Phase 20 local VLM sandbox work appears to provide local/private Qwen2.5-VL evidence, including accepted one-fixture and 12-fixture smoke history. This remains sandbox evidence only, not production readiness.
- Phase 21 backend gateway work appears to provide contract, adapter, routing, no-model HTTP, cross-platform deployment, deployment config/env, approval, and dry-run plan gates.
- Phase 21-G local model route approval gate appears to keep `local_model` disabled and blocks model calls, Qwen inference, endpoints, iOS integration, raw artifacts, and `productionReady:true`.
- Phase 21-G2 missing/deferred register now records unfinished feature areas and new Qwen MoE / Auto-Trigger / WSS / compression / quantization / local CV directions.
- Phase 21-I image compression/upload payload policy gate now records the future compressed preview payload boundary and keeps runtime upload blocked.
- Phase 21-J Auto-Trigger + 1 FPS Live Advisor policy gate now records the future stillness, no-upload, sparse cadence, consent/off-state, compression dependency, and backoff boundaries while keeping runtime blocked.
- Phase 21-K Stateful WSS Live Advisor protocol preflight now records future session lifecycle, backend mediation, server busy/backoff, retry, no-raw-video, Auto-Trigger/1 FPS/compression dependency, privacy/logging, and iOS/backend boundaries while keeping WSS runtime blocked.
- Phase 21-L Local On-device CV Camera Aids Plan now records future grid alignment, horizon/level, exposure warning, motion/stability bucket, 60fps smoothness, local-only privacy/data-retention, Auto-Trigger relationship, and cloud VLM boundary policies while keeping local CV runtime blocked.
- Phase 21-M Quantization + Serving Benchmark Plan now records future model, serving stack, quantization, fixture, metrics, safety/fallback, latency/throughput, and cost/hardware planning policies while keeping benchmark runtime, model download, serving-stack switch, `local_model`, Qwen inference, fixture inference, vLLM/SGLang/Ollama calls, iOS runtime dependencies, endpoints, and production rollout blocked.
- Phase 21-N one-fixture backend local/private model smoke was approved but preflight-blocked before any model call because `smoke_001` was not present/approved in the ignored local fixture registry. No model call, retry, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R0 inspected ignored local prerequisites and found `smoke_001.*` fixture file missing, so the ignored registry was not edited and the prerequisite remains blocked. No model call, Qwen inference, fixture inference, serving benchmark, local registry commit, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R0B rechecked operator fixture preparation and `smoke_001.*` is still missing. No ignored registry edit, model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R0C rechecked operator supply of exactly one approved local-only `smoke_001` fixture. The fixture is now present locally and ignored, and the ignored local registry now has an approved `smoke_001` entry. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R1 was explicitly approved for one backend local/private model smoke retry, but preflight blocked before healthz/model execution because the ignored local config fixture token was not `smoke_001`. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R1B resolved the ignored local config fixture-token mismatch locally so the configured fixture token is now `smoke_001`. No model call, healthz check, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R1C was explicitly approved for one backend local/private model smoke retry after config fix. The guarded command ran once and blocked at healthz before any model call. No retry, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R1D diagnosed the healthz block with a healthz-only no-model preflight, then rechecked after operator server startup. The ignored local config, fixture registry, and `smoke_001` fixture remain ready and ignored, and healthz is now `safe`. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-N-R1E was explicitly approved for one backend local/private model smoke retry after healthz fix. The guarded command ran once with `smoke_001`, zero retries, and was accepted by backend validation with sanitized aggregate only. No serving benchmark, model switch, production `local_model`, endpoint, iOS integration, raw artifact, or production rollout occurred.
- Phase 21-O added the serving benchmark execution preflight/scope gate and dry-run CLI. It allows only no-model contract scope by default and blocks model/benchmark execution, fixture expansion, retries, raw artifacts, endpoints, iOS integration, unsafe serving stacks, quantization production use, and Live Advisor over-1-FPS simulation unless future explicit approval and scope gates exist.
- Phase 21-P added the serving benchmark plan approval matrix and dry-run CLI. It allows no-model contract preflight without model-call approval, maps one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation to explicit approval classes, and keeps execution blocked by default.
- Phase 21-Q added the vLLM no-model serving contract preflight and dry-run CLI. It blocks vLLM runtime start, vLLM endpoint calls, model calls, Qwen inference, fixture inference, serving benchmarks, model downloads, serving switches, raw logging/persistence, endpoints, iOS integration, text-only image-analysis models, unsafe output modes, and production readiness.
- Phase 21-R added the SGLang no-model serving contract preflight and dry-run CLI. It blocks SGLang runtime start, SGLang endpoint calls, model calls, Qwen inference, fixture inference, serving benchmarks, model downloads, serving switches, raw logging/persistence, endpoints, iOS integration, text-only image-analysis models, unsafe output modes, and production readiness.
- Phase 21-S added the serving stack no-model comparison matrix and dry-run CLI. It compares Transformers+FastAPI, vLLM, SGLang, and Ollama/LM Studio roles while blocking serving runtime, endpoint calls, model calls, Qwen inference, fixture inference, serving benchmarks, model downloads, serving switches, raw artifacts, endpoints, iOS integration, and production readiness.
- Phase 21-T added the one-fixture serving benchmark approval request draft and dry-run CLI. It drafts copyable approval language for a possible Phase 21-U Transformers+FastAPI reference benchmark with `smoke_001`, one call, zero retries, healthz required, sanitized report only, and `productionReady:false`, while blocking current serving runtime, endpoint calls, model calls, Qwen inference, fixture inference, serving benchmarks, serving switches, raw artifacts, endpoints, iOS integration, and production readiness.
- Phase 21-T-R1A corrects the visible git history marker only: the Phase 21-T artifacts existed, but one pushed commit was mislabeled as Phase 21-S. No model call, benchmark, healthz check, runtime change, ignored local artifact change, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.
- Phase 21-U ran the explicitly approved Transformers+FastAPI reference one-fixture serving benchmark with `smoke_001`, one call, and zero retries. The sanitized benchmark was accepted with latency bucket `gt_15s`; no 12-fixture, concurrency, quantization, Live Advisor, vLLM/SGLang/Ollama, serving-switch, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.
- Phase 21-V added the controlled multi-fixture serving benchmark approval request draft, no-model gate, CLI, and tests. It proposes future Phase 21-W approval phrases for either a controlled 3-fixture pilot or a controlled 12-fixture run, while running no model call, fixture inference, benchmark, endpoint call, serving runtime, serving switch, vLLM/SGLang/Ollama call, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-W0 inspected the ignored fixture registry with sanitized output only. It found 13 approved ready opaque fixture tokens with local ignored files present, so exactly-12 readiness is false and no Phase 21-W approval phrase was generated.
- Phase 21-W added a guarded controlled 12-fixture Transformers+FastAPI wrapper and attempted the approved benchmark command exactly once with `smoke_004` through `smoke_015`, but preflight blocked with `blocked_for_unsafe_endpoint_bucket` before any model calls. Call count stayed `0`, retry count stayed `0`, standalone healthz was safe, no raw artifacts were printed/persisted, and `productionReady:false` remains locked.
- Phase 21-W-R1 resolved the controlled wrapper endpoint bucket mismatch by normalizing local/private endpoint buckets before policy checks and ran no model call or benchmark.
- Phase 21-W-R1B retried the approved controlled 12-fixture Transformers+FastAPI benchmark exactly once after the endpoint bucket fix. It used `smoke_004` through `smoke_015`, made 12 approved local/private route calls, used zero retries, and returned a sanitized mixed rejection: accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`; no raw artifacts were printed/persisted and `productionReady:false` remains locked.
- Phase 21-W-R2 adds no-network rejection diagnostics for the W-R1B `local_model_unavailable` / `blocked_for_provider_integration` pattern. It compares the accepted Phase 21-U `smoke_001` path with the W-R1B controlled fixture path and identifies the likely failure layer as `external_route_error_mapping_or_fixture_token_contract`. It runs no model call, benchmark, healthz, inference endpoint call, fixture inference, serving switch, iOS integration, raw artifact, secret, or production rollout.
- Phase 21-W-R2-marker corrects only the visible commit marker typo from `unavailabl` to the exact prerequisite marker `Phase 21-W-R2: diagnose controlled benchmark local model unavailable`. It does not amend or rebase pushed commits and runs no model call, benchmark, inference endpoint call, external server edit, runtime change, raw artifact, secret, or production rollout.
- Phase 21-W-R2C fixes the external Windows FastAPI server no-model fixture-token contract and route-error mapping for approved tokens `smoke_001` and `smoke_004` through `smoke_015`. The external contract check passed with `modelLoaded:false`, `inferenceEndpointCalled:false`, `benchmarkRun:false`, no raw leakage, and `productionReady:false`. It adds no iOS runtime change, app endpoint, serving-stack switch, model download, Qwen3-VL-30B-A3B call, or production rollout.
- Phase 21-W-R2C2 adds backend-side no-model contract echo validation and a CLI. The external checker passed, and the backend reached a local/private no-model contract echo endpoint, but validation blocked because unsupported/missing token buckets were `unknown` instead of explicit sanitized buckets. No model call, benchmark, fixture inference, inference endpoint call, serving switch, iOS integration, raw artifact, secret, or production rollout occurred.
- Phase 21-W-R2C-FINAL fixes the no-model contract echo mismatch end to end. The external checker and backend contract echo validation both pass with approved token count `13`, unsupported bucket `unsupported_fixture_token`, missing bucket `missing_fixture_token`, no model call, no benchmark, no inference endpoint call, no fixture inference, no serving switch, no iOS runtime change, no raw artifact, no secret, and `productionReady:false`.
- Phase 21-W-R3 attempted the explicitly approved controlled 12-fixture Transformers+FastAPI benchmark retry after contract echo validation passed, using only `smoke_004` through `smoke_015`, but healthz preflight blocked with `model_not_loaded` before any benchmark/model calls. Call count stayed `0`, retry count stayed `0`, no inference endpoint call occurred, no Qwen3-VL-30B-A3B switch/download/load/benchmark/call occurred, no raw artifact or secret was printed/persisted, and `productionReady:false` remains locked.
- Phase 21-W-R3-R1 diagnosed the healthz `model_not_loaded` block with no-model contract checks, healthz-only checking, startup/readiness inspection, and a sanitized no-load dependency probe. Healthz remains blocked, dependencies are present, no model/inference/benchmark call ran, and the next safe action is operator model-enabled startup for the existing reference server.
- Phase 21-W-GOAL was an approved autonomous attempt to reach a controlled 12-fixture benchmark final result. It confirmed no-model contract health, attempted one model-enabled local/private startup using the existing helper, and rechecked healthz through the backend gate, but healthz stayed `model_not_loaded`. No benchmark command ran, model call count stayed `0`, retry count stayed `0`, no Qwen3-VL-30B-A3B use occurred, no raw artifact or secret was printed/persisted, and `productionReady:false` remains locked.
- Phase 21-W-GOAL-R2 retried the explicitly approved controlled 12-fixture Transformers+FastAPI benchmark after fresh live healthz readiness passed. It used only `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. Accepted count was `0`, rejected count was `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`; no retry, extra call, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-GOAL-R2-R2 added no-model route-contract dry-run diagnostics and fixed backend HTTP non-OK bucket preservation. External in-process dry-run accepted all 12 approved benchmark tokens and exposed `fixture_not_available x12`; backend live dry-run safely blocked with `route_not_found` because the running external process had not loaded the new endpoint. No model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-GOAL-R2-R2A attempted the live route-contract dry-run follow-up. Static external no-model checkers passed, the initial backend live dry-run still returned `route_not_found`, and the cause bucket was `stale_server_process`. The local/private server listener was restarted, then post-reload healthz blocked with `connection_refused`; backend live dry-run was not rerun after healthz failed. No model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-FINAL attempted bounded route-debug and final benchmark completion. External static no-model contracts passed and known external HTTP detail buckets now win before generic `route_not_found`, but the local/private server did not stay available after startup and backend healthz blocked with `connection_refused`. Model-call usage stayed `0/14`, no diagnostic call ran, no final benchmark ran, retry count stayed `0`, and no Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-FINAL-R1 attempted runtime reconnect only. Static external no-model contracts passed, the expected port was not listening, a safe local/private restart was attempted, and a listener briefly appeared before backend healthz blocked with `connection_refused` and the listener exited. Backend live route dry-run was not run after healthz failed. No model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-W-FINAL-R2 completes the controlled 12-fixture benchmark goal. Codex restored the existing local/private Transformers+FastAPI server via the external workspace venv, mirrored the approved ignored 12-fixture runtime files/metadata into the external ignored registry, confirmed safe healthz and live route dry-run, and ran exactly one approved benchmark with `smoke_004` through `smoke_015`. Result: `acceptedCount:12`, `rejectedCount:0`, `callCount:12`, `retryCount:0`, `latencyBuckets:gt_15s x1, 5s_to_15s x11`, raw artifact policy intact, no Qwen3-VL-30B-A3B use, no serving switch, no iOS runtime change, no endpoint addition, and `productionReady:false`.
- Phase 21-X reviews the accepted controlled benchmark result and records `decisionBucket:correctness_baseline_pass_latency_not_product_ready`. Phase 21-W is considered reached and Transformers+FastAPI is a correctness baseline, but latency `5s_to_15s x11` plus `gt_15s x1` is not live-camera or production real-time ready. It led to Phase 21-Y RunPod A100 Qwen3-VL runtime and batch/queue planning. No model call, benchmark, inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama call, iOS runtime change, raw artifact, secret, or production rollout occurred.
- Phase 21-Y plans the target runtime path: RunPod on-demand A100 80GB, `Qwen3-VL-30B-A3B` as the target benchmark candidate, scheduled 2-3 hour daily GPU windows with a rough `$80-$170/month` cost assumption to verify before purchase, and a post-capture batch/queue Photo Advisor architecture. It runs no model call, benchmark, inference endpoint call, RunPod provisioning, Qwen3-VL install/download/load/call, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout. The next recommended phase is Phase 21-Z: RunPod A100 Qwen3-VL Deployment Prep Without Model Calls.
- Phase 21-Y-R1 adds the Asia-first user constraint: Korea, Taiwan, and Hong Kong with `userRegionBucket:korea_taiwan_hong_kong`, `backendRegionPreference:asia_near`, and `gpuRegionPreference:asia_near`. RunPod A100 80GB remains primary only if Asia-near availability/cost is acceptable; US/EU GPU capacity is fallback, not first Asia latency baseline. It adds no RunPod provisioning, model call, benchmark, Qwen3 install/download/load/call, iOS runtime change, raw artifact, credential, secret, or production rollout. The next recommended phase is Phase 21-Z: Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls.
- Phase 21-Z adds Asia-first RunPod deployment prep and a placeholder-only config shape. It documents the A100 80GB Asia-near selection checklist, fallback provider/GPU policy, no-model healthz/contract/dry-run target shape, cloud security, network exposure, storage/cache, batch/queue ops, budget guardrails, localization QA, and future Z1/Z2 gates. It creates no RunPod resource, provisions no GPU, installs/downloads/loads/calls no Qwen3 model, runs no model call, runs no benchmark, calls no inference endpoint, changes no iOS runtime, commits no raw URL/real region ID/credential/secret, and keeps `productionReady:false`. The next recommended phase is Phase 21-Z1: Asia-first RunPod Instance Security + No-model Contract Gate.
- Phase 21-Z-R1 re-evaluates API-first serverless VLM alternatives before RunPod provisioning. SiliconFlow and DashScope / Alibaba Cloud Model Studio / 阿里雲百煉 are candidate providers only; RunPod A100 80GB remains fallback/comparison. It adds cost, privacy/legal/data-governance, product-mode, provider-agnostic adapter, and future benchmark gates without provider API calls, API keys, provider SDKs, RunPod provisioning, Qwen3 install/download/load/call, model calls, benchmarks, inference endpoint calls, iOS runtime changes, upload payload changes, raw artifacts, secrets, or production rollout. The next recommended phase is Phase 21-Z2A: SiliconFlow / DashScope Account + Pricing + Terms Verification Gate.
- Phase 21-Z2A-SF consolidates the operator-provided SiliconFlow Qwen3-VL research drafts. It narrows the primary provider direction to SiliconFlow, selects `Qwen/Qwen3-VL-30B-A3B-Instruct` as the primary model direction, keeps RunPod A100 80GB as fallback/comparison, records model-page facts with billing/terms/JSON caveats, and recommends Phase 21-Z2B-SF no-runtime backend adapter contracts. It adds no provider runtime, provider SDK, API call, API key, provider account, image upload, model call, benchmark, inference endpoint call, RunPod provisioning, local Qwen3 install/download/load/call, iOS runtime change, upload payload change, raw artifact, secret, or production rollout. The next recommended phase is Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate.
- `productionReady:false` remains the cross-phase default.

Source references for future operators include `docs/phase-log.md`, `docs/handoff/codex-transition-handoff.md`, `docs/missing-features-and-deferred-roadmap-register.md`, and the Phase 20/21 backend gateway docs.

## Phase Numbering Reconciliation

The previous register notes that the repo may already contain a committed Phase 21-H local model route dry-run plan.

Rules:

- Do not blindly reuse old Phase 21-H labels.
- If Phase 21-H already exists in repo history, use suffix labels such as `Phase 21-H2` or advance to `Phase 21-I`.
- Before starting any new phase, check `docs/phase-log.md` and `git log`.
- The phase sequence below is a recommended logical order, not guaranteed existing numbering.

## Recommended Next Phase Sequence

| Phase label | Title | Purpose | Runtime change | Model call | iOS change | Endpoint change | Requires explicit approval | Depends on | Exit criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Phase 21-H2 or next available label | Qwen VLM + Live Advisor Target Re-evaluation Gate | Phase 21-W-R1 clarifies `Qwen3-VL-30B-A3B` as the future target candidate for a later separately approved model upgrade/benchmark phase; record non-thinking mode, vLLM/SGLang, quantization, and Live Advisor directions | no | no | no | no | yes | Phase 21-G2 register | Docs/gate records model capability checks, blocked text-only models, target stack direction, and no-runtime boundaries |
| Phase 21-I | Image Compression + Upload Payload Policy Gate | Define compressed preview frame, metadata stripping, consent, retention/deletion, no original full-res upload by default, and no capture-context upload unless approved | no | no | no | no | yes | Phase 21-H2 target reset | Policy/gate defines safe upload payload shape and stop conditions |
| Phase 21-J | Auto-Trigger + 1 FPS Live Advisor Policy Gate | Define stillness >1s trigger, <=1s no capture/no upload, max 1 FPS, throttle, fail-closed behavior, off state | no | no | no | no | yes | Phase 21-I upload policy | Policy/gate covers trigger, rate, no-silent-upload, and failure states |
| Phase 21-K | Stateful WSS Live Advisor Protocol Preflight | Define session state, backoff, server busy, structured advice, no video stream, backend-mediated only | no | no | no | no | yes | Phase 21-J trigger policy | Protocol/schema preflight exists with no WSS runtime |
| Phase 21-L | Local On-device CV Camera Aids Plan | Plan grid alignment, horizon/level, exposure warning, motion/stability buckets, 60fps smoothness target | no | no | no runtime | no | yes | Phase 21-J trigger policy | Local-only camera-aid plan and performance/safety gates documented |
| Phase 21-M | Quantization + Serving Benchmark Plan | Add INT4/INT8/AWQ/GPTQ/equivalent benchmark dimensions; vLLM primary, SGLang challenger, Transformers+FastAPI reference | no | no | no | no | yes | Phase 21-H2 target reset | Benchmark plan/gate exists; no benchmark execution |
| Phase 21-N-R0 | One-fixture Local Model Smoke Preflight Block Resolution | Prepare ignored local `smoke_001` fixture prerequisite after blocked Phase 21-N preflight | no | no | no | no | explicit approval required for any later model call | Phase 21-N blocked report | `smoke_001` present/approved locally, ignored, unstaged, and safe for a later explicitly approved one-call smoke |
| Phase 21-N-R0B | Operator-provided smoke_001 Fixture Preparation | Place approved local-only `smoke_001` fixture in ignored sample folder | no | no | no | no | explicit approval required for any later model call | Phase 21-N-R0 report | `smoke_001.*` exists locally, ignored/untracked/unstaged; no raw artifacts committed |
| Phase 21-N-R0C | Operator supplies approved smoke_001 local fixture | Operator supplies exactly one approved local-only `smoke_001` fixture image | no | no | no | no | explicit approval required for any later model call | Phase 21-N-R0B report | `smoke_001.*` exists locally, ignored/untracked/unstaged; registry prepared locally only |
| Phase 21-N-R1 | Approved One-fixture Local Model Smoke Retry | Retry the backend local/private one-fixture route smoke with `smoke_001` only | yes | yes, one only | no | no app/prod endpoint | explicit approval required | Phase 21-N-R0C report | One declared fixture, one call only, no retries, sanitized result, validator/fallback enforced |
| Phase 21-N-R1B | One-fixture Local Model Smoke Retry Block Resolution | Resolve ignored local config fixture token mismatch before any retry | no | no | no | no | explicit approval required for any later model call | Phase 21-N-R1 blocked report | Ignored local config points to `smoke_001`; no model call run |
| Phase 21-N-R1C | Approved One-fixture Local Model Smoke Retry After Config Fix | Retry the backend local/private one-fixture smoke after config token fix | yes | yes, one only | no | no app/prod endpoint | explicit approval required | Phase 21-N-R1B report | One declared fixture, one call only, no retries, sanitized result, validator/fallback enforced |
| Phase 21-N-R1D | One-fixture Local Model Smoke Retry Healthz Block Resolution | Resolve unsafe/unavailable local/private healthz before any retry | no | no | no | no | explicit approval required for any later model call | Phase 21-N-R1C healthz-blocked report | Healthz safe buckets restored; no model call run |
| Phase 21-N-R1E | Approved One-fixture Local Model Smoke Retry After Healthz Fix | Retry only after healthz safe buckets are restored | yes | yes, one only | no | no app/prod endpoint | explicit approval required | Phase 21-N-R1D safe healthz report | One declared fixture, one call only, no retries, sanitized result, validator/fallback enforced |
| Phase 21-O | Approved Serving Benchmark Execution Preflight / Scope Gate | Define execution approval/scope gate before any serving benchmark | no | no | no | no | explicit approval required for any future execution | Phase 21-N-R1E accepted one-fixture report | Scope gate blocks execution by default and records allowed benchmark categories |
| Phase 21-P | Serving Benchmark Plan Approval Matrix | Map future benchmark plans to explicit approval requirements | no | no | no | no | explicit approval required for any future execution | Phase 21-O scope gate | Approval matrix exists without running benchmark/model calls |
| Phase 21-Q | vLLM No-model Serving Contract Preflight | Define vLLM contract expectations without loading/running vLLM | no | no | no | no | explicit approval required for any future execution | Phase 21-P approval matrix | No-model vLLM contract gate only |
| Phase 21-R | SGLang No-model Serving Contract Preflight | Define SGLang contract expectations without loading/running SGLang | no | no | no | no | explicit approval required for any future execution | Phase 21-Q vLLM contract preflight | No-model SGLang contract gate only |
| Phase 21-S | Serving Stack No-model Comparison Matrix | Compare Transformers+FastAPI, vLLM, SGLang, and manual-only Ollama/LM Studio roles without executing any stack | no | no | no | no | explicit approval required for any future execution | Phase 21-R SGLang contract preflight | No-model comparison matrix only |
| Phase 21-T | One-fixture Serving Benchmark Approval Request Draft | Draft approval language and scope for a possible one-fixture serving benchmark without executing it | no | no by default | no | no | explicit model-call approval required for any execution | Phase 21-S comparison matrix | Approval request draft only unless separately approved |
| Phase 21-U | Approved Transformers+FastAPI One-fixture Serving Benchmark | Run at most one explicitly approved reference serving benchmark using `smoke_001` | yes | yes, one only | no | no app/prod endpoint | explicit model-call approval required | Phase 21-T approval request draft | One fixture, one call, zero retries, healthz safe, sanitized report only |
| Phase 21-V | Controlled Multi-fixture Serving Benchmark Approval Request Draft | Draft approval language and scope for a possible controlled multi-fixture benchmark | no | no by default | no | no | explicit model-call/benchmark approval required for any execution | Phase 21-U accepted one-fixture benchmark | Approval request draft only; no direct 12-fixture execution |
| Phase 21-W | Approved Controlled Multi-fixture Transformers+FastAPI Serving Benchmark | Run an explicitly approved controlled multi-fixture reference benchmark | yes | yes, one per approved fixture only | no | no app/prod endpoint | explicit multi-call benchmark approval required | Phase 21-V approval request draft | Exact approved fixture tokens/count only, zero retries, healthz safe, sanitized aggregate report |
| Phase 21-N or later | Approved One-fixture Backend Local Model Route Smoke | First controlled backend `local_model` route call through gateway chain | yes | yes, one only | no | no app/prod endpoint | explicit approval required | Approval gate, dry-run plan, policy gates | One declared fixture, one call only, no retries, sanitized result, validator/fallback enforced |
| Phase 21-O or later | Approved Serving Benchmark Execution | Compare serving stacks/quantization/latency on sanitized fixtures | yes | yes | no | no app/prod endpoint | explicit approval required | Phase 21-M plan and user approval | Sanitized benchmark metrics only; no raw artifacts; production remains false |
| Phase 22-A | Debug-only iOS Backend Integration Preflight | Plan debug-only backend result flow with no production endpoint | no runtime by default | no | no runtime by default | no production endpoint | yes | Backend policy gates | Preflight documents debug-only path and no iOS provider/model keys |
| Phase 22-B or later | Debug-only Compressed Upload Prototype | Implement app-side compressed preview frame after policy gate | yes | no by default | yes | debug-only backend path | explicit approval required | Phase 21-I and 22-A | Debug-only compressed preview upload works with consent and no raw full-res default |
| Phase 22-C or later | Debug-only Auto-Trigger Live Advisor Prototype | Opt-in live cloud AI prototype, not production | yes | yes if approved | yes | debug-only backend path | explicit approval required | Phase 21-J, 21-K, 22-B | Stillness gate, <=1s no upload, max 1 FPS, WSS/session/backoff, off state verified |
| Phase 23+ | Beta / production readiness gates | Auth, quota, billing, privacy, deletion, monitoring, App Store disclosure, TestFlight | yes | maybe | yes | production only when approved | explicit approval required | Phase 22 validation | Production readiness checklist passes and `productionReady` change is explicitly approved |

## Big Phase Grouping

| Big phase | Scope | Representative phases |
| --- | --- | --- |
| Big Phase A | Backend/VLM policy and target reset | 21-H2 |
| Big Phase B | Upload/compression/live transport policy | 21-I, 21-J, 21-K |
| Big Phase C | Local CV and iOS camera aids planning | 21-L |
| Big Phase D | Controlled backend model execution | 21-N or later |
| Big Phase E | Serving benchmark and deployment decision | 21-M, 21-O or later |
| Big Phase F | Debug-only iOS backend integration | 22-A, 22-B, 22-C |
| Big Phase G | Beta/production hardening | 23+ |
| Big Phase H | Advanced features | later image editing, voice, fine-tuning, export, language productization |

## Feature-to-phase Mapping

| Feature | Proposed phase | Notes |
| --- | --- | --- |
| Qwen3-VL-30B-A3B future target candidate | 21-W-R1 | Later separately approved model upgrade/benchmark phase only; not used by W-R1 |
| Non-thinking mode | 21-H2 | Direct-output low-latency structured mode |
| vLLM/SGLang target | 21-H2 / 21-M | Direction in H2, benchmark dimensions in M |
| INT4/INT8 quantization | 21-M | AWQ/GPTQ/equivalent benchmark dimension |
| Image compression | 21-I | Policy first, runtime later |
| Metadata stripping | 21-I | Required before upload |
| Consent/upload policy | 21-I / 22-A | No silent upload |
| Auto-Trigger >1s | 21-J | Stillness policy gate |
| <=1s no capture/no upload | 21-J | Must be explicit fail-closed rule |
| 1 FPS cloud analysis maximum | 21-J | Do not treat viewfinder as 30fps video |
| Stateful WSS | 21-K | Protocol preflight only before runtime |
| Local CV grid/horizon/exposure | 21-L | Local-only camera aids |
| Debug iOS backend integration | 22-A | Preflight first |
| Production endpoint | 23+ | Requires production readiness approval |
| StoreKit/quota/paywall | 23+ | Requires account/billing plan |
| Retention/deletion | 23+ | Required before real uploads |
| App Store privacy | 23+ | Required before beta/production rollout |
| Paid AI editing | later | Separate product/safety scope |
| Live voice | later | Separate from Photo Advisor |
| Fine-tuning | later | Only after evaluation proves need and consent/training governance exists |

## When a Phase Completes, Remind Next Checklist

When Codex sees a completed phase report:

- [ ] Was it committed?
- [ ] Was it pushed?
- [ ] Is upstream `0 0`?
- [ ] Did it modify runtime or docs only?
- [ ] Did it violate any hard boundary?
- [ ] What phase is listed as next in this document?
- [ ] Does the next phase require explicit approval?
- [ ] Provide the next phase prompt if the user asks.

## Boundary Reminders

Do not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, WSS runtime, Auto-Trigger runtime, upload/compression runtime, iOS integration, endpoints, auth/billing/quota runtime, training/fine-tuning, or production rollout unless a future prompt explicitly approves that scope.

Do not modify the external local VLM server workspace from this sequencing phase.

Do not commit local config, local registry, fixture images, raw reports, logs, model outputs, prompts, request payloads, model weights, or credentials.

Keep `productionReady:false`.
