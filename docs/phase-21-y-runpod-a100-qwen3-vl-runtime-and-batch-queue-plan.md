# Phase 21-Y: RunPod A100 Qwen3-VL Runtime and Batch Queue Plan

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Y converts the Phase 21-X latency decision into a target deployment plan. Phase 21-W proved the backend route/schema/validator/fallback pipeline by accepting all 12 approved fixtures, but the Transformers+FastAPI local reference latency buckets of `5s_to_15s x11` and `gt_15s x1` are not suitable for live camera or production real-time advisor UX.

The next benchmark path should move toward the intended deployment class instead of further local Windows optimization:

- Primary provider target: RunPod.
- Primary GPU target: on-demand A100 80GB.
- Primary model candidate: `Qwen3-VL-30B-A3B`.
- Product serving pattern: post-capture batch/queue Photo Advisor, not live camera real-time.
- Current Qwen2.5 / existing Qwen VLM Transformers+FastAPI path: retained as the correctness baseline only.
- Cost assumption: daily 2-3 hour GPU windows, roughly `$80-$170/month` class, to be verified against current provider pricing before purchase.

This phase is planning only. It creates no RunPod resource, installs no model, downloads no weights, runs no benchmark, makes no model call, and changes no iOS runtime.

## Decision

`decisionBucket`: `target_runtime_plan_runpod_a100_batch_queue`

RunPod on-demand A100 80GB is the first target benchmark environment because the product question is no longer whether the backend validator can accept model output. The useful next question is whether the target model and deployment class can produce accepted, safe Photo Advisor results with latency and cost suitable for a queued post-capture flow.

## Why Local Windows Benchmarking Is Not Enough

The Phase 21-W local/private Transformers+FastAPI reference path is valuable because it proves correctness under the backend contract. It is not enough for the next target decision because:

- Latency on the local reference path is already outside live-camera and real-time product tolerance.
- Local hardware/runtime behavior does not predict A100 80GB throughput, cold start, VRAM headroom, or batch-window economics.
- The future target model is `Qwen3-VL-30B-A3B`, not the current Qwen2.5 / existing Qwen VLM baseline.
- Product fit depends on queue throughput, scheduled GPU windows, and cost per accepted result, not only single-call route correctness.

## Target Architecture

### iOS App

- No direct model/provider call.
- No provider/model key.
- No direct RunPod call.
- No upload payload change in this phase.
- No Camera live cloud AI entry.
- Future debug-only backend integration only after explicit approval.

### Backend

- Future backend receives a post-capture advisor job after a separately approved integration phase.
- Future backend stores only safe job metadata under privacy-reviewed rules.
- Future backend pushes work to a queue instead of trying live viewfinder inference.
- GPU worker pulls queued jobs during scheduled RunPod windows.
- Worker calls a local/private model server on the RunPod instance.
- Worker validates structured Photo Advisor JSON with the same schema, safety, fallback, and language boundaries.
- Backend returns language-pack keys and result-card data rather than raw model text.
- Raw model text is never shown directly to the app.

### RunPod Worker

- Uses on-demand A100 80GB as the first target runtime.
- Starts with scheduled 2-3 hour windows for internal/beta evaluation.
- Keeps the model server private/firewalled.
- Exposes no public inference endpoint.
- Logs no raw prompt, raw output, raw image path, request payload, provider token, credential, or secret.
- Produces sanitized aggregate benchmark reports only.

## Batch / Queue Operating Model

The first product-serving path should be queue-based post-capture advice:

1. User submits a photo after capture or import in a future approved flow.
2. Backend creates an advisor job with safe metadata only.
3. Job enters the queue.
4. RunPod worker processes jobs during the scheduled GPU window.
5. Validated result becomes available when ready.
6. App shows a gentle "analysis is preparing" / "ready shortly" state and a fallback if the queue or server is unavailable.

This path deliberately avoids live viewfinder analysis, WSS, Auto-Trigger, 1 FPS live AI, direct iOS provider calls, and Camera cloud AI runtime in this phase.

## Cost and Risk Plan

- Primary target: RunPod on-demand A100 80GB.
- Initial operating window: daily 2-3 hours for internal/beta testing.
- Monthly cost assumption: roughly `$80-$170/month` class, subject to actual RunPod pricing, utilization, cold-start overhead, storage, bandwidth, and scheduling behavior.
- Pricing must be verified before purchase or provisioning.
- H100 80GB remains a later latency/cost comparison fallback.
- 48GB GPUs remain later quantized experiments, not the first target baseline.
- Stop/start scheduling should avoid 24/7 idle cost.
- Monthly budget watch is required before any paid beta.
- Job queue limits and per-user quotas should be defined before production.
- Manual kill switch is required before any rollout.
- Budget hard stop is required before production.

No credentials, provider IDs, API keys, SSH keys, raw URLs, or account-specific identifiers are committed.

## Future Qwen3-VL-30B-A3B Benchmark Plan

Future benchmark only; not run in Phase 21-Y.

- Fixture set: `smoke_004` through `smoke_015`.
- Fixture count: `12`.
- Target call count: `12`.
- Retry count: `0`.
- Same schema validator.
- Same safety/fallback gates.
- Same sanitized aggregate report format.
- No raw output, prompt, payload, image path, fixture registry content, RunPod URL, provider token, or secret.

Compare against Phase 21-W baseline:

- Acceptance rate.
- Schema validity.
- Fallback categories.
- p50 and p95 latency.
- Cold-start latency.
- Warm-start latency.
- Cost per accepted result.
- VRAM bucket.
- Queue throughput.

## Serving Stack Path

- Start with Transformers+FastAPI for correctness continuity and adapter portability.
- Evaluate vLLM compatibility later with a separate no-model/prep phase.
- Evaluate SGLang compatibility later with a separate no-model/prep phase.
- Do not install vLLM or SGLang now.
- Do not run vLLM or SGLang now.
- Do not switch serving stack now.

## Recommended Next Phases

1. `Phase 21-Z: RunPod A100 Qwen3-VL Deployment Prep Without Model Calls`
2. `Phase 21-Z1: RunPod Instance Security + No-model Contract Gate`
3. `Phase 21-Z2: Approved Qwen3-VL-30B-A3B 12-fixture Benchmark on RunPod A100`
4. `Phase 21-Z3: A100 vs H100 Latency/Cost Decision`, if needed
5. `Phase 22-A: Debug-only iOS Backend Integration Plan`, only after target server benchmark review

Any phase that provisions RunPod, installs/downloads/loads Qwen3-VL-30B-A3B, calls inference, or runs a benchmark requires separate explicit approval.

## Boundary Confirmations

- Model calls executed: no.
- Benchmark executed: no.
- Real inference endpoint called: no.
- RunPod resource created or modified: no.
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called: no.
- vLLM/SGLang/Ollama installed or run: no.
- Serving stack switched in code: no.
- External server runtime modified: no.
- iOS runtime changed: no.
- App-facing endpoint added: no.
- Production endpoint added: no.
- Camera live cloud AI entry added: no.
- Auto-Trigger runtime added: no.
- WSS runtime added: no.
- iOS upload payload changed: no.
- Raw artifacts, prompts, outputs, payloads, logs, local config, fixture registry, model weights, credentials, provider tokens, API keys, SSH keys, or secrets committed: no.
- Production rollout: no.
- `productionReady:false`.
