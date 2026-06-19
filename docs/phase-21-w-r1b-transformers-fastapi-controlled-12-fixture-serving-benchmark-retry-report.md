# Phase 21-W-R1B Transformers+FastAPI Controlled 12-fixture Serving Benchmark Retry Report

Status: Completed with sanitized mixed rejection  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-W-R1B retried the explicitly approved controlled 12-fixture Transformers+FastAPI reference serving benchmark after the Phase 21-W-R1 endpoint bucket normalization fix.

The retry executed exactly one approved benchmark command for the approved fixture token set, with 12 local/private backend route calls and zero retries. The sanitized aggregate result was mixed/rejected: 0 accepted, 12 rejected, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, and latency bucket distribution `lt_1s x12`.

This is not production readiness. It does not add iOS integration, an app-facing endpoint, a production endpoint, a serving stack switch, vLLM/SGLang/Ollama, quantization, Live Advisor simulation, upload runtime, Auto-Trigger runtime, WSS runtime, local CV runtime, raw artifacts, secrets, or production rollout.

## User Approval

The user explicitly approved one Phase 21-W-R1B controlled 12-fixture Transformers+FastAPI serving benchmark retry after endpoint bucket fix with:

- fixtures: `smoke_004`, `smoke_005`, `smoke_006`, `smoke_007`, `smoke_008`, `smoke_009`, `smoke_010`, `smoke_011`, `smoke_012`, `smoke_013`, `smoke_014`, `smoke_015`
- call count: `12`
- retry count: `0`

## Context

- Phase 21-W attempted the same approved 12-fixture benchmark and preflight-blocked before model calls with `blocked_for_unsafe_endpoint_bucket`.
- Phase 21-W-R1 fixed the endpoint bucket mismatch by normalizing concrete local/private buckets before policy checks.
- Current benchmark path remained the existing Transformers+FastAPI local/private Qwen VLM reference sandbox.
- Future target candidate is `Qwen3-VL-30B-A3B`, but it was not installed, downloaded, loaded, benchmarked, called, or switched to in this phase.

## Preconditions

- Git prerequisite gate: clean and upstream-synced before healthz/benchmark.
- Required commit markers present:
  - `Phase 21-W0: inventory approved fixture tokens for controlled benchmark`
  - `Phase 21-W: run Transformers FastAPI controlled 12-fixture benchmark`
  - `Phase 21-W-R1: resolve controlled benchmark endpoint bucket block`
- Ignored local config, fixture registry, and approved fixture files remained ignored, untracked, and unstaged.
- Healthz preflight ran once and returned sanitized bucket `safe`.
- Endpoint bucket normalization confirmed active for the controlled wrapper.

## Approved Scope

- `benchmarkKind`: `controlled_multifixture_serving_benchmark_retry_after_endpoint_bucket_fix`
- `servingStackClass`: `transformers_fastapi_reference`
- `modelClass`: `qwen_vlm_compatible`
- `futureTargetCandidate`: `qwen3_vl_30b_a3b`
- `fixtureCount`: `12`
- `callCount`: `12`
- `retryCount`: `0`
- `productionReady`: `false`

## Approved Fixture Tokens

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

`smoke_001` was not included in the benchmark execution set.

## Aggregate Benchmark Result

- `preflightPassed`: `true`
- `healthzBucket`: `safe`
- `endpointBucketNormalized`: `yes`
- `acceptedCount`: `0`
- `rejectedCount`: `12`
- `blockedCount`: `0`
- `validationCodes`: `local_model_unavailable x12`
- `fallbackCategories`: `blocked_for_provider_integration x12`
- `latencyBuckets`: `lt_1s x12`
- `rawOutputPersisted`: `false`
- `rawOutputPrinted`: `false`
- `rawPromptPersisted`: `false`
- `rawPromptPrinted`: `false`
- `rawPayloadPersisted`: `false`
- `rawPayloadPrinted`: `false`
- `productionReady`: `false`

## Per-fixture Sanitized Rows

| Fixture token | Accepted | Validation code | Fallback category | Latency bucket | Raw output persisted | Raw output printed |
| --- | --- | --- | --- | --- | --- | --- |
| `smoke_004` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_005` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_006` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_007` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_008` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_009` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_010` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_011` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_012` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_013` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_014` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |
| `smoke_015` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` | false | false |

## Raw Artifact Policy

Confirmed:

- no raw prompt persisted or printed
- no raw model output persisted or printed
- no raw request payload persisted or printed
- no raw image content, raw image path, base64, local config contents, fixture registry contents, server URL, server logs, EXIF/GPS/sensor data, credentials, or secrets were added to this tracked report
- ignored local config, registry, and fixture images remain outside git

## Boundary Confirmations

- Serving runtime started: no new runtime
- Endpoint called: only the existing local/private Transformers+FastAPI reference route during the approved retry
- Benchmark executed: yes, exactly one approved controlled retry command
- Backend local/private route calls: `12`
- Retries: `0`
- vLLM/SGLang/Ollama call: no
- Serving stack switch: no
- Qwen3-VL-30B-A3B switch/download/load/benchmark/call: no
- Concurrency benchmark: no
- Quantization benchmark: no
- Live Advisor 1 FPS simulation: no
- iOS integration: no
- App-facing endpoint: no
- Production endpoint: no
- Camera cloud AI runtime entry: no
- Auto-Trigger runtime: no
- WSS runtime: no
- Upload/compression runtime: no
- Local CV runtime: no
- Production rollout: no

## What Remains Blocked

- Production readiness remains blocked.
- iOS integration remains blocked.
- Production/app-facing endpoints remain blocked.
- Serving stack comparison remains blocked until separately approved.
- vLLM/SGLang/Ollama remains blocked.
- Quantization benchmark remains blocked.
- Live Advisor simulation/runtime remains blocked.
- The current result requires rejection diagnostics before another benchmark attempt.

## Next Recommended Phase

Phase 21-W-R2: Controlled Multi-fixture Benchmark Rejection Diagnostics.

Phase 21-W-R2 should diagnose sanitized rejection buckets only and must not rerun benchmark/model calls unless the user separately approves a new execution phase.
