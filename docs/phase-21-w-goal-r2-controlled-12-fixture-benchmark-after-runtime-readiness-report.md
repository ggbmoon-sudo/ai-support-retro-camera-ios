# Phase 21-W-GOAL-R2 - Controlled 12-fixture Benchmark After Runtime Readiness

Date: 2026-06-19

## Executive Summary

Phase 21-W-GOAL-R2 ran the explicitly approved controlled 12-fixture Transformers+FastAPI reference benchmark after a fresh live healthz preflight reported the local/private model runtime as safe and loaded.

The benchmark executed exactly one guarded run with the approved fixtures `smoke_004` through `smoke_015`, call count `12`, and retry count `0`. The sanitized aggregate result was all rejected with validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, and latency bucket `lt_1s x12`.

The next recommended phase is Phase 21-W-GOAL-R2-R2: Local Model Unavailable After Model Runtime Readiness.

`productionReady:false`

## User Approval

The approved scope was one Transformers+FastAPI controlled 12-fixture benchmark retry after model runtime readiness:

- Fixtures: `smoke_004`, `smoke_005`, `smoke_006`, `smoke_007`, `smoke_008`, `smoke_009`, `smoke_010`, `smoke_011`, `smoke_012`, `smoke_013`, `smoke_014`, `smoke_015`
- Fixture count: `12`
- Call count: `12`
- Retry count: `0`
- Serving stack: `transformers_fastapi_reference`
- Report type: sanitized aggregate only

## Preconditions

- Main repo state was clean and upstream-synced before this phase.
- Required history markers were present:
  - Phase 21-W-GOAL: reach controlled benchmark final result or blocker
  - Phase 21-W-R2C-FINAL: pass backend no-model contract echo validation
- External workspace was not a git repo, so no external git dirty state blocked execution.
- External no-model fixture-token contract check passed.
- Backend no-model contract echo validation passed.
- Ignored local config, fixture registry, and approved fixture files remained present, ignored, untracked, and unstaged.

## No-model Contract Status

- External checker result: `pass`
- Approved token count: `13`
- Unsupported token bucket: `unsupported_fixture_token`
- Missing token bucket: `missing_fixture_token`
- Contract echo model loaded: `false`
- Contract echo inference endpoint called: `false`
- Contract echo benchmark run: `false`
- Contract echo production ready: `false`

## Live Healthz Readiness

- Healthz result bucket: `safe`
- Healthz prerequisite resolved: `true`
- `ok:true`
- `modelLoaded:true`
- Model family bucket: `qwen_vlm_compatible`
- Raw logging disabled: `true`
- Public exposure: `no`
- Model calls made during healthz: `false`
- Fixture inference run during healthz: `false`
- Serving benchmark run during healthz: `false`
- `productionReady:false`

## Benchmark Execution

- Benchmark executed: `yes`
- Benchmark kind: `controlled_12_fixture_benchmark_retry_after_model_runtime_readiness`
- Wrapper benchmark kind: `controlled_multifixture_serving_benchmark`
- Serving stack class: `transformers_fastapi_reference`
- Model class bucket: `qwen_vlm_compatible`
- Endpoint bucket: `local_or_private`
- Fixture count: `12`
- Call count: `12`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `12`
- Blocked count: `0`
- Unsafe stop bucket: `null`

The benchmark command printed a complete sanitized aggregate result and then exited nonzero after a post-output Node assertion. The benchmark was not rerun.

## Sanitized Aggregate Metrics

Validation codes:

- `local_model_unavailable`: `12`

Fallback categories:

- `blocked_for_provider_integration`: `12`

Latency buckets:

- `lt_1s`: `12`

Per-fixture sanitized rows:

| Fixture token | Accepted | Validation code | Fallback category | Latency bucket |
| --- | --- | --- | --- | --- |
| `smoke_004` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_005` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_006` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_007` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_008` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_009` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_010` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_011` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_012` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_013` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_014` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |
| `smoke_015` | no | `local_model_unavailable` | `blocked_for_provider_integration` | `lt_1s` |

## Raw Artifact Policy

- Raw output persisted: `false`
- Raw output printed: `false`
- Raw prompt persisted: `false`
- Raw prompt printed: `false`
- Raw payload persisted: `false`
- Raw payload printed: `false`
- Raw image content printed or persisted: `false`
- Raw image paths printed: `false`
- Raw server URL printed: `false`
- Raw config contents printed: `false`
- Raw fixture registry contents printed: `false`
- Server logs printed: `false`
- Secrets printed or committed: `false`

## Boundaries

- Current path remained the existing local/private Transformers+FastAPI reference Qwen VLM path.
- Future target candidate `Qwen3-VL-30B-A3B` was not installed, downloaded, loaded, benchmarked, or called.
- No vLLM, SGLang, Ollama, or LM Studio runtime was used.
- No serving stack switch occurred.
- No extra fixture was added.
- `smoke_001` was not included in the controlled 12-fixture benchmark.
- No benchmark retry occurred.
- No failed fixture was rerun.
- No concurrency benchmark, quantization benchmark, or Live Advisor simulation ran.
- No app-facing endpoint, production endpoint, iOS integration, Auto-Trigger runtime, WSS runtime, upload runtime, local CV runtime, or production rollout was added.
- `productionReady:false`

## Verification Summary

- External no-model contract checker: passed
- Backend no-model contract echo validation: passed
- Local ignored config/registry/fixture facts: passed
- Backend tests: passed
- Serving benchmark approval gates: passed
- Local smoke gate: passed
- Local model route approval gate: passed
- Fresh healthz preflight: passed with `modelLoaded:true`
- Controlled 12-fixture benchmark: executed once, all rejected with `local_model_unavailable`

## Next Recommended Phase

Phase 21-W-GOAL-R2-R2: Local Model Unavailable After Model Runtime Readiness

This next phase should diagnose why the guarded benchmark route still maps all 12 approved fixture calls to `local_model_unavailable` even though healthz reports the model runtime as loaded. Any further model or benchmark calls require separate explicit approval.
