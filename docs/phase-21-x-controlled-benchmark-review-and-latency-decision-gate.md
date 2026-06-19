# Phase 21-X: Controlled Benchmark Review and Latency Decision Gate

Date: 2026-06-19

## Executive Summary

Phase 21-W met the backend/local VLM controlled benchmark goal. The final accepted run used the existing local/private Transformers+FastAPI reference path, ran exactly one approved 12-fixture benchmark, made exactly 12 model calls, used zero retries, and accepted all 12 fixtures with sanitized aggregate output only.

Decision:

- `decisionBucket`: `correctness_baseline_pass_latency_not_product_ready`
- `phase21WGoalReached`: `true`
- `correctnessBaselineStatus`: `pass`
- `latencyReadinessStatus`: `not_live_or_realtime_ready`
- `productReadinessStatus`: `not_product_ready`
- `recommendedNextPhase`: `Phase 21-Y: Serving Performance Plan for Local VLM Advisor`
- `productionReady`: `false`

The result is strong evidence that the route, request contract, schema validator, fallback safety, fixture scope, and local/private endpoint controls are working as a backend correctness baseline. The latency distribution is still too slow for live camera guidance or real-time product UX.

## Phase 21-W Final Result

- `benchmarkKind`: `controlled_multifixture_serving_benchmark`
- `servingStackClass`: `transformers_fastapi_reference`
- `modelClass`: `qwen_vlm_compatible`
- `futureTargetCandidate`: `qwen3_vl_30b_a3b`
- `fixtures`: `smoke_004` through `smoke_015`
- `fixtureCount`: `12`
- `callCount`: `12`
- `retryCount`: `0`
- `acceptedCount`: `12`
- `rejectedCount`: `0`
- `blockedCount`: `0`
- `validationCodes`: `null x12`
- `fallbackCategories`: `null x12`
- `latencyBuckets`: `5s_to_15s x11`, `gt_15s x1`
- `rawOutputPersisted`: `false`
- `rawOutputPrinted`: `false`
- `rawPromptPersisted`: `false`
- `rawPromptPrinted`: `false`
- `rawPayloadPersisted`: `false`
- `rawPayloadPrinted`: `false`
- `productionReady`: `false`

## Correctness Baseline Assessment

The Transformers+FastAPI reference path is acceptable as a backend correctness baseline.

Evidence:

- All 12 approved controlled fixtures were accepted by the backend validator.
- The result no longer fails closed as `local_model_unavailable`.
- The live route-contract dry-run was routeable for all 12 approved fixtures before the benchmark.
- The benchmark wrapper enforced exact fixture scope, exact call count, and retry count `0`.
- Sanitized validator/fallback buckets remained `null x12`.
- Raw artifact policy remained intact.

This supports using the current path for internal backend correctness checks, schema/fallback validation, and offline post-capture advisor experimentation.

## Serving Readiness Assessment

The current serving path is not latency-ready for live or real-time UX.

Latency interpretation:

- `5s_to_15s x11` means most calls are slower than a responsive in-camera interaction.
- `gt_15s x1` means at least one call exceeds an already-high interaction threshold.
- The current reference path is useful for correctness and operator testing, not for camera-live or production real-time guidance.

Serving performance work should happen before any live camera advisor, Auto-Trigger, WSS, 1 FPS simulation, or production-facing route decision.

## Product Readiness Assessment

The result is not production-ready.

Blocked for product/beta rollout:

- Latency is too slow for live camera UX.
- No production endpoint has been approved.
- No app-facing endpoint has been added.
- No iOS integration has been added.
- No quota, auth, billing, abuse, consent, retention, monitoring, or production rollout gate has passed.
- The current local/private Windows runtime and ignored fixture setup are operator-only sandbox artifacts.
- `productionReady:false` remains locked.

## Roadmap Decision

Recommended next phase:

`Phase 21-Y: Serving Performance Plan for Local VLM Advisor`

Reason:

The controlled benchmark now provides a correctness baseline. The next bottleneck is serving latency and runtime shape, not schema correctness or route contract. Phase 21-Y should plan performance work without immediately running another benchmark or switching serving stacks unless explicitly approved.

Possible later branches:

- `Phase 22-A: Debug-only iOS Photo Advisor Backend Integration Plan` after backend review and performance expectations are clarified.
- `Phase 21-Y2: Qwen3-VL-30B-A3B Runtime Planning Without Model Call` if future-model planning should precede integration.
- `Phase 21-Z: vLLM/SGLang Benchmark Preparation` as no-model preparation only until explicit benchmark approval exists.
- `Phase 23: Beta/Production Gates` much later, after latency, endpoint, auth/quota, privacy, consent, and rollout gates.

## Boundary Confirmations

- No model call was run in Phase 21-X.
- No benchmark was run in Phase 21-X.
- No real inference endpoint was called in Phase 21-X.
- No fixture inference was run in Phase 21-X.
- No fixture image was opened, OCRed, uploaded, or inspected for EXIF/GPS/sensor data.
- Qwen3-VL-30B-A3B was not installed, downloaded, loaded, benchmarked, or called.
- No vLLM, SGLang, Ollama, or LM Studio runtime was started or called.
- No serving stack or model switch occurred.
- No app-facing endpoint, production endpoint, iOS integration, Camera live cloud AI entry, Auto-Trigger runtime, WSS runtime, or iOS upload payload change was added.
- No local config, fixture registry, fixture image, raw report, log, model output, prompt, request payload, model weight, credential, or secret was committed.
- `productionReady:false` remains locked.
