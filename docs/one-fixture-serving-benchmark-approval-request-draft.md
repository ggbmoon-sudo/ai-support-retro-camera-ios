# One-fixture Serving Benchmark Approval Request Draft

Status: Phase 21-T approval request draft only  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-T drafts the approval request for a possible future one-fixture serving benchmark. It does not run a benchmark, start a serving runtime, call an endpoint, run a model call, run Qwen inference, run fixture inference, switch serving stacks, add iOS integration, add endpoints, persist raw artifacts, or change production readiness.

The accepted Phase 21-N-R1E result proved that one local/private backend model path can return an accepted structured result for `smoke_001`. It does not prove production readiness because it covered one fixture, one local/private path, no concurrency, no serving-stack comparison, no quantization path, no Live Advisor simulation, no iOS integration, no production endpoint, and latency bucket `gt_15s`.

`gt_15s` remains a blocker for production, iOS, and future Live Advisor readiness.

## Proposed Future Scope

The next benchmark should remain tiny and explicitly approved:

- Serving stack: `transformers_fastapi_reference`
- Fixture token: `smoke_001`
- Fixture count: `1`
- Model call count: `1`
- Retry count: `0`
- Healthz required: yes
- Endpoint class: local/private only
- Raw output persisted: `false`
- Raw output printed: `false`
- Report policy: sanitized aggregate only
- Production readiness: `productionReady:false`

Transformers+FastAPI remains the reference path for the first one-fixture serving benchmark unless the user explicitly chooses another stack in a later phase. vLLM and SGLang remain no-model contract candidates until separately approved.

## Copyable Approval Phrase

Use this only if the operator wants to approve Phase 21-U execution:

```text
批准跑 Phase 21-U 一次 Transformers+FastAPI reference one-fixture serving benchmark，fixture=smoke_001，call count=1，retry=0
```

Safer alternative if the operator wants no model call:

```text
只批准 Phase 21-U-preflight only
```

## Explicit Blocks

Phase 21-T does not approve:

- 12-fixture benchmark
- vLLM benchmark
- SGLang benchmark
- Ollama or LM Studio benchmark
- Quantization benchmark
- Live Advisor 1 FPS simulation
- Concurrency benchmark
- Serving stack switch
- Production route enablement
- iOS integration
- App-facing endpoint
- Production endpoint
- Upload runtime
- Auto-Trigger runtime
- WSS runtime
- Raw artifacts, logs, prompts, request payloads, or model outputs

## Backend Guard

Phase 21-T adds:

```sh
npm run qa:open-weight-vlm:one-fixture-serving-benchmark-approval-request
```

The guard is no-model and no-network. It passes only a draft-only approval request where the future scope is `smoke_001`, one fixture, one call, zero retries, Transformers+FastAPI reference, healthz required, local/private endpoint class, separate explicit user approval required, sanitized output only, and `productionReady:false`.

It blocks current model calls, current benchmark execution, fixture expansion, call expansion, retries, non-`smoke_001` fixtures, non-Transformers+FastAPI stacks, missing explicit approval requirement, raw output persistence/printing, raw prompt/image/request logging, iOS integration, app/prod endpoints, Camera cloud entry, Auto-Trigger/WSS/upload runtime, serving stack switch, and `productionReady:true`.

## Next Recommended Phase

Phase 21-U: Approved Transformers+FastAPI One-fixture Serving Benchmark

Phase 21-U requires separate explicit user approval because it may run exactly one backend local/private model call.
