# Serving Benchmark Execution Preflight Scope Gate

Status: Phase 21-O preflight/scope only

Date: 2026-06-19

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-O defines the approval and scope gate for any future serving benchmark execution after the accepted Phase 21-N-R1E one-fixture local/private model smoke.

This phase does not run a benchmark, model call, Qwen inference, fixture inference, vLLM/SGLang/Ollama call, fixture expansion, serving stack switch, iOS integration, app-facing endpoint, or production endpoint. Future benchmark execution requires separate explicit user approval.

The Phase 21-N-R1E result proves only that the local/private backend route can produce one accepted structured result for `smoke_001`. It is not production readiness.

## Why R1E Is Not Production Readiness

- only one fixture was tested
- only one local/private server path was tested
- latency bucket was `gt_15s`
- no concurrency was tested
- no 12-fixture benchmark was run
- no vLLM/SGLang comparison was run
- no quantization benchmark was run
- no Live Advisor 1 FPS simulation was run
- no iOS integration exists
- no production endpoint exists
- `productionReady:false` remains locked

The `gt_15s` latency bucket is a key blocker for production, iOS, and live-readiness claims.

## Scope Rules

Future serving benchmark execution must start small and gated:

- clean repo and upstream sync required
- ignored local config, fixture registry, and fixtures must remain ignored/untracked/unstaged
- approved ignored fixtures only
- one serving stack at a time
- sanitized aggregate reports only
- no raw prompt/model output/image path/base64/request payload/server URL/server logs/secrets
- backend validator/fallback/safety remains source of truth
- no production endpoint or iOS integration
- `productionReady:false`

## Benchmark Categories

### A. No-model Serving Contract Checks

Allowed by default for preflight/scope review only:

- vLLM no-model contract candidate
- SGLang no-model contract candidate
- Transformers+FastAPI reference contract
- structured candidate echo
- no raw output

These checks must not call models or fixtures.

### B. One-fixture Serving Path Smoke

Requires separate explicit approval:

- one fixture only
- `smoke_001` or explicitly approved fixture token
- one call only
- zero retry
- sanitized aggregate output only

### C. Controlled 12-fixture Benchmark

Requires separate explicit approval:

- approved ignored fixtures only
- one serving stack at a time
- no retries unless explicitly approved
- sanitized aggregate report only
- stop on raw artifact leakage, unsafe healthz, schema regression, public exposure, or production readiness drift

### D. Serving Stack Comparison

Future candidates:

- Transformers+FastAPI reference
- vLLM primary candidate
- SGLang structured-output/performance challenger
- Ollama/LM Studio manual-only, not production

Ollama/LM Studio must not become a production serving direction from this gate.

### E. Quantization Benchmark

Future benchmark dimensions:

- FP16/BF16 baseline
- INT8
- AWQ
- GPTQ
- INT4 stress only after baseline

Production quantization remains blocked until benchmarked and reviewed.

### F. Live Advisor 1 FPS Simulation

Future simulation constraints:

- no 30fps video
- no silent upload
- max 1 FPS
- Auto-Trigger only after greater-than-1-second stability policy
- no capture/upload semantics at or below 1 second
- WSS protocol only after explicit phase approval

## Gate Stop Conditions

Stop before execution if any of these appear:

- missing explicit approval for model/benchmark execution
- fixture count exceeds approved scope
- retries enabled without approval
- raw output/prompt/image/base64/path/request payload logging or persistence
- public/cloud/ngrok/tunnel endpoint class
- iOS integration or app-facing endpoint
- production endpoint or `productionReady:true`
- Camera live cloud AI entry
- Auto-Trigger/WSS/upload runtime enabled
- unknown serving stack
- Ollama/LM Studio proposed as production stack
- quantization production use before benchmark
- Live Advisor simulation above 1 FPS
- Auto-Trigger capture/upload at or below 1 second

## Phase 21-O Boundary

Phase 21-O creates a preflight/scope gate only. It does not run:

- model calls
- Qwen inference
- fixture inference
- serving benchmarks
- vLLM/SGLang/Ollama calls
- model downloads
- serving stack switches
- endpoint work
- iOS integration
- upload runtime
- Auto-Trigger/WSS/local CV runtime

## Next Recommended Phase

Phase 21-P: Serving Benchmark Plan Approval Matrix

Phase 21-P should remain no-model/docs/gate unless separately approved.

## productionReady:false

`productionReady:false` remains locked.
