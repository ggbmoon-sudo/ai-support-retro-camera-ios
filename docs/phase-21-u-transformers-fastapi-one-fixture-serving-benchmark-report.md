# Phase 21-U: Transformers+FastAPI One-fixture Serving Benchmark Report

Status: accepted  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-U ran the explicitly approved Transformers+FastAPI reference one-fixture serving benchmark after the Phase 21-T approval request draft and Phase 21-N-R1E accepted local/private smoke result.

The guarded benchmark command executed exactly one backend local/private model call using exactly one approved fixture token, `smoke_001`, with zero retries. Backend validator, fallback, and safety gates remained the source of truth. The sanitized result was accepted.

This is not production rollout and does not prove iOS, live, concurrent, multi-fixture, quantized, vLLM, or SGLang readiness. The latency bucket remains `gt_15s`, which is a production and live-readiness blocker.

## User Approval

The user explicitly approved this phase by saying:

```text
批准跑 Phase 21-U 一次 Transformers+FastAPI reference one-fixture serving benchmark，fixture=smoke_001，call count=1，retry=0
```

## Phase 21-T Approval Request Summary

- Benchmark kind: `one_fixture_serving_benchmark`
- Serving stack: `transformers_fastapi_reference`
- Fixture token: `smoke_001`
- Fixture count: `1`
- Call count: `1`
- Retry count: `0`
- Healthz required: yes
- Endpoint class: local/private only
- Report policy: sanitized aggregate only
- Production readiness: `productionReady:false`

## R1E Reference Smoke Summary

- Prior accepted smoke: yes
- Fixture token: `smoke_001`
- Call count: `1`
- Retry count: `0`
- Accepted count: `1`
- Rejected count: `0`
- Validation code: `null`
- Fallback category: `null`
- Latency bucket: `gt_15s`
- Raw output/prompt/payload printed or persisted: false
- Production readiness: `productionReady:false`

## Preconditions

- Repo was clean and upstream sync was `0 0` before Phase 21-U work.
- Correct Phase 21-T commit marker was present in git history.
- Ignored local config was present, ignored, untracked, and unstaged.
- Ignored local fixture registry was present, ignored, untracked, and unstaged.
- Ignored `smoke_001` fixture file was present, ignored, untracked, and unstaged.
- Local config fixture token was `smoke_001`.
- Registry entry for `smoke_001` was present and approved.
- No fixture image was opened, OCRed, uploaded separately, or inspected for EXIF/GPS/sensor data.

## Healthz Safe Summary

- Healthz checked: yes
- Healthz result bucket: `safe`
- Healthz prerequisite resolved: yes
- Model family bucket: `qwen_vlm_compatible`
- Raw logging disabled: true
- Public exposure: `no`
- Endpoint bucket: local/private
- Production readiness: `productionReady:false`

## Benchmark Execution Summary

- Benchmark kind: `one_fixture_serving_benchmark`
- Serving stack class: `transformers_fastapi_reference`
- Model class bucket: `qwen_vlm_compatible`
- Fixture token used: `smoke_001`
- Fixture count: `1`
- Call count: `1`
- Retry count: `0`
- Preflight passed: yes
- Benchmark executed: yes
- Model call executed: yes
- Qwen inference run: yes, only as the approved single local/private backend call
- Serving runtime started by this phase: no new runtime

## Validator Result Summary

- Accepted count: `1`
- Rejected count: `0`
- Validation code: `null`
- Schema diagnostic bucket: `none`
- Backend structured candidate validator remained enabled.

## Fallback And Safety Summary

- Fallback category: `null`
- Sensitive inference guard remained enabled.
- Score/rating, harsh fix-it language, provider/debug leakage, chain-of-thought leakage, and unsupported filter controls remained enforced by backend validation.
- No validator, fallback, or safety gate was weakened.

## Latency

- Latency bucket: `gt_15s`
- Production/live implication: blocked for production rollout, iOS live readiness, concurrency claims, and Live Advisor timing claims until later benchmark phases explicitly approve and measure broader performance.

## Raw Artifact Policy

- Raw output persisted: false
- Raw output printed: false
- Raw prompt persisted: false
- Raw prompt printed: false
- Raw payload persisted: false
- Raw payload printed: false
- Raw image content/path/base64 printed or committed: false
- Local config contents printed or committed: false
- Fixture registry contents printed or committed: false
- Model server URL, server logs, credentials, and provider raw response printed or committed: false
- EXIF/GPS/sensor data inspected, printed, or committed: false

## Boundary Confirmations

- No 12-fixture benchmark.
- No controlled multi-fixture benchmark.
- No concurrency benchmark.
- No quantization benchmark.
- No Live Advisor 1 FPS simulation.
- No vLLM call.
- No SGLang call.
- No Ollama or LM Studio call.
- No serving stack switch.
- No model download.
- No production `local_model` route enablement.
- No app-facing endpoint.
- No production endpoint.
- No iOS integration.
- No Camera live cloud AI runtime entry.
- No Auto-Trigger runtime.
- No WSS runtime.
- No local CV runtime.
- No upload runtime or image compression runtime.
- No iOS upload payload change.
- No auth, billing, quota, consent UI, training, or fine-tuning runtime.
- `productionReady:false` remains locked.

## What Remains Blocked

- Production rollout.
- iOS app integration.
- App-facing and production endpoints.
- 12-fixture or controlled multi-fixture benchmark.
- Concurrency and throughput benchmark.
- vLLM/SGLang/Ollama execution.
- Quantization benchmark.
- Live Advisor 1 FPS simulation.
- Camera cloud AI runtime.
- Auto-Trigger/WSS/upload runtime.
- Production latency claims, because the accepted benchmark remained `gt_15s`.

## Next Recommended Phase

Phase 21-V: Controlled Multi-fixture Serving Benchmark Approval Request Draft.

Phase 21-V should draft scope/approval only unless the user separately approves execution. Do not jump directly to a 12-fixture run, serving-stack switch, quantization benchmark, Live Advisor simulation, iOS integration, endpoint work, or production rollout.
