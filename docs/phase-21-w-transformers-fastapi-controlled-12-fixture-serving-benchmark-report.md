# Phase 21-W: Transformers+FastAPI Controlled 12-fixture Serving Benchmark Report

Status: preflight blocked before benchmark/model calls  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-W attempted exactly one approved controlled 12-fixture Transformers+FastAPI reference serving benchmark command after the explicit user approval phrase.

The benchmark did not execute because the guarded wrapper stopped during preflight with sanitized blocker bucket `blocked_for_unsafe_endpoint_bucket`. No fixture inference, model call, serving benchmark call, vLLM/SGLang/Ollama call, serving-stack switch, iOS integration, app-facing endpoint, production endpoint, raw artifact persistence, or production rollout occurred.

The standalone healthz preflight was safe before the benchmark attempt.

## User Approval Text

The user explicitly approved:

```text
批准跑 Phase 21-W 一次 Transformers+FastAPI controlled 12-fixture serving benchmark，fixtures=smoke_004,smoke_005,smoke_006,smoke_007,smoke_008,smoke_009,smoke_010,smoke_011,smoke_012,smoke_013,smoke_014,smoke_015，call count=12，retry=0
```

## Prior Phase Summaries

- Phase 21-V drafted the controlled multi-fixture benchmark approval request and required explicit fixture tokens, one call per fixture, zero retries, local/private endpoint only, sanitized aggregate report only, and `productionReady:false`.
- Phase 21-W0 inventoried the ignored local fixture registry with sanitized output only and found 13 approved ready tokens; the user then selected exactly 12 explicit tokens for Phase 21-W.
- Phase 21-U completed one accepted local/private Transformers+FastAPI reference serving benchmark for `smoke_001` with one call, zero retries, sanitized output only, and latency bucket `gt_15s`.

## Approved Scope

- Benchmark kind: `controlled_multifixture_serving_benchmark`
- Serving stack: `transformers_fastapi_reference`
- Approved fixture tokens: `smoke_004`, `smoke_005`, `smoke_006`, `smoke_007`, `smoke_008`, `smoke_009`, `smoke_010`, `smoke_011`, `smoke_012`, `smoke_013`, `smoke_014`, `smoke_015`
- Fixture count: `12`
- Intended call count: `12`
- Actual call count: `0`
- Retry count: `0`
- Healthz required: yes
- Endpoint class: local/private only
- Report policy: sanitized aggregate only
- Production readiness: `productionReady:false`

## Preconditions

- Repo state before Phase 21-W: clean
- Upstream sync before Phase 21-W: `0 0`
- Phase 21-V commit marker present: yes
- Phase 21-W0 commit marker present: yes
- Ignored local config present/ignored/unstaged/untracked: yes
- Ignored local fixture registry present/ignored/unstaged/untracked: yes
- Approved 12 fixture files present/ignored/unstaged/untracked: yes
- `smoke_001` excluded from the Phase 21-W token set: yes

## Healthz Safe Summary

- Healthz checked before benchmark attempt: yes
- Healthz result bucket: `safe`
- Model loaded: yes
- Model family bucket: `qwen_vlm_compatible`
- Raw logging disabled: yes
- Public exposure: `no`
- Model call executed by healthz: no
- Fixture inference executed by healthz: no
- Benchmark executed by healthz: no

## Benchmark Execution Summary

- Benchmark command executed: yes, exactly once
- Benchmark/model calls executed: no
- Result: preflight blocked
- Preflight blocker bucket: `blocked_for_unsafe_endpoint_bucket`
- Call count: `0`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `0`
- Blocked count: `1`
- Latency bucket distribution: not applicable

## Per-fixture Sanitized Rows

No per-fixture model rows exist because the benchmark stopped before the first model call.

## Validator and Fallback Summary

- Validator result: not run
- Validation code buckets: not applicable
- Fallback category buckets: not applicable
- Backend validator/fallback/safety gates were not weakened.

## Raw Artifact Policy Confirmation

- Raw output persisted: false
- Raw output printed: false
- Raw prompt persisted: false
- Raw prompt printed: false
- Raw payload persisted: false
- Raw payload printed: false
- Raw image path printed: false
- Base64 printed: false
- Server URL printed: false
- Server logs printed: false
- Local config contents printed: false
- Fixture registry contents printed: false
- Secrets printed: false
- EXIF/GPS/sensor data inspected or printed: false

## Boundary Confirmations

- New serving runtime started: no
- Existing inference endpoint called: no
- vLLM/SGLang/Ollama called: no
- Serving stack switched: no
- Concurrency benchmark run: no
- Quantization benchmark run: no
- Live Advisor simulation run: no
- `local_model` production route enabled: no
- iOS integration added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Camera live cloud AI runtime entry added: no
- Auto-Trigger runtime added: no
- WSS runtime added: no
- Upload runtime added: no
- Production rollout: no
- Production readiness: `productionReady:false`

## What Remains Blocked

The controlled 12-fixture benchmark remains blocked before model calls. The sanitized blocker bucket is `blocked_for_unsafe_endpoint_bucket`.

## Next Recommended Phase

Phase 21-W-R1: Controlled 12-fixture Serving Benchmark Block Resolution.

Phase 21-W-R1 should remain scoped to resolving the preflight blocker and must not run model calls unless the user gives separate explicit approval.
