# Backend Internal VLM Gateway Provider Routing

Status: Phase 21-C dry-run gate plus Phase 21-D no-model HTTP adapter check plus Phase 21-E deployment boundary audit

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-C defines backend-internal provider routing states for the future VLM Gateway and adds a no-network dry-run gate. It validates routing policy only: allowed provider states, blocked provider states, fail-closed behavior, raw artifact policy, validator requirement, safety fallback requirement, and `productionReady:false`.

This phase does not call a model, run Qwen inference, run a serving benchmark, execute vLLM/SGLang/Ollama, start iOS integration, add app-facing endpoints, add production endpoints, or accept real user-photo uploads.

## Routing Modes

| Provider mode | Route state | Notes |
| --- | --- | --- |
| `local_stub` | allowed | No network, no model call, deterministic structured candidate through validator. |
| `local_contract_echo` | allowed | Local/private no-model HTTP echo policy only. The Phase 21-C dry-run does not call it. |
| `local_model_blocked` | blocked | Real local model path exists conceptually but is blocked in this phase. |
| `future_vllm_blocked` | blocked | Future serving candidate only; no vLLM call. |
| `future_sglang_blocked` | blocked | Future serving candidate only; no SGLang call. |
| `manual_ollama_lmstudio_blocked` | blocked | Manual smoke only, not a backend gateway route. |
| `production_blocked` | blocked | Production endpoint remains blocked. |
| unknown mode | blocked | Unknown provider modes fail closed. |

## Dry-run Output

The routing dry-run prints sanitized aggregate decisions only:

- `schemaVersion`
- `requestedProviderMode`
- `selectedRoute`
- `routeAllowed`
- `blockReason`
- `networkCallsAllowed`
- `modelCallsAllowed`
- `qwenInferenceAllowed`
- `benchmarkAllowed`
- `appFacingEndpointAllowed`
- `productionEndpointAllowed`
- `rawArtifactPolicy`
- `validatorRequired`
- `safetyFallbackRequired`
- `productionReady:false`

## Safety Rules

- `local_stub` may pass only with `networkCallsAllowed:false` and `modelCallsAllowed:false`.
- `local_contract_echo` may pass only as no-model echo policy; model calls and Qwen inference remain false.
- `local_model_blocked`, future serving stacks, manual Ollama / LM Studio, production, and unknown modes block.
- `productionReady:true` always blocks.
- App-facing or production endpoint flags block.
- Model calls, Qwen inference, and benchmark execution block.
- Raw prompt/model output/image path/base64/request payload/provider response logging remains blocked.
- Existing candidate validator and safety fallback gates remain required for any future route.

## CLI

Run:

```sh
npm run qa:open-weight-vlm:gateway-provider-routing
```

Expected current behavior:

- `networkCallsMade:false`
- `modelCallsMade:false`
- `qwenInferenceRun:false`
- `benchmarkRun:false`
- `allowedProviderModes:["local_stub","local_contract_echo"]`
- blocked real/future/manual/production/unknown modes
- `eligibleForPhase21DPlanning:true`
- `eligibleForAppIntegration:false`
- `productionReady:false`

## Phase 21-D No-model Provider Adapter HTTP Check

Phase 21-D adds an adapter-level check for the allowed `local_contract_echo` route:

```sh
npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http
```

The adapter check verifies the Phase 21-C route decision before any HTTP call. It may call only local/private healthz and `/local/vlm/gateway-contract-echo`, and only for no-model contract echo compatibility.

It fails closed if the route is not `local_contract_echo`, the endpoint is public/cloud/tunnel/non-local, healthz is unsafe, `publicExposure` is not `no`, raw logging is enabled, model/Qwen inference is reported, model calls are reported, raw persistence is reported, the echo response is leaky, the candidate is not structured JSON accepted by the existing validator, or `productionReady:true` appears.

Expected current behavior:

- `networkCallsMade:true` only for local/private no-model HTTP
- `modelCallsMade:false`
- `qwenInferenceRun:false`
- `modelInferenceRun:false`
- `benchmarkRun:false`
- raw persistence flags false
- `eligibleForProviderAdapterNoModelHttpReview:true`
- `eligibleForAppIntegration:false`
- `productionReady:false`

## Non-goals

Phase 21-C does not:

- run real model smoke
- run Qwen inference
- run serving benchmarks
- call vLLM/SGLang/Ollama
- start iOS integration
- add app-facing endpoints
- add production endpoints
- accept real user-photo upload
- add consent UI
- train or fine-tune
- weaken validator or safety/fallback gates
- commit local config, local registry, fixture images, raw reports, logs, model outputs, prompts, request payloads, model weights, or credentials

## Phase 21-E Recommendation

Phase 21-E is implemented as a backend-internal cross-platform deployment boundary audit:

```sh
npm run qa:open-weight-vlm:cross-platform-boundary
```

It confirms Windows local VLM paths and local model URLs are sandbox/docs/operator-only, MacBook/Xcode does not depend on Windows paths or model server URLs, future production config uses env/secrets/config instead of committed local paths or LAN IPs, iOS never calls provider/model routes directly, and the backend remains the mediator for all future VLM calls.

## Phase 21-F Recommendation

Phase 21-F should remain backend-internal and explicit. A safe candidate is a broader fallback / failure taxonomy review for gateway adapter and deployment-boundary blockers that still runs no model calls and no serving benchmarks. Do not start iOS integration, endpoints, upload handling, model routing, or production rollout without a future explicit prompt.
