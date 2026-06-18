# Serving Stack No-model Comparison Matrix

Status: Phase 21-S no-model comparison matrix only  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-S compares the future serving roles for Transformers+FastAPI, vLLM, SGLang, and Ollama/LM Studio without starting any serving runtime, calling any endpoint, running model inference, running fixture inference, executing a benchmark, downloading weights, switching serving stacks, or changing iOS behavior.

The accepted Phase 21-N-R1E one-fixture result is useful sandbox evidence only. It used `smoke_001`, one backend local/private model call, zero retries, and produced an accepted structured result, but it does not prove production readiness because it tested one fixture, one local/private path, no concurrency, no serving-stack comparison, no quantization path, and latency bucket `gt_15s`.

`gt_15s` remains a blocker for iOS readiness and future Live Advisor readiness. Any real benchmark, model call, endpoint call, serving runtime start, model download, or serving-stack switch requires separate explicit user approval.

## Required Conclusions

- Transformers+FastAPI remains the correctness/reference baseline.
- vLLM remains the primary future benchmark candidate.
- SGLang remains the structured-output/performance challenger.
- Ollama/LM Studio remains manual-only and is not a production route.
- Phase 21-N-R1E accepted one-fixture evidence is not production readiness.
- `gt_15s` latency remains a blocker for iOS/live readiness.
- Any real benchmark/model call requires separate explicit user approval.
- `productionReady:false` remains locked.

## Comparison Matrix

| Category | Transformers+FastAPI Reference | vLLM Candidate | SGLang Challenger | Ollama/LM Studio Manual-only |
| --- | --- | --- | --- | --- |
| Intended role | Correctness/reference baseline | Primary future benchmark candidate | Structured-output/performance challenger | Manual local operator smoke/debug only |
| Photo Advisor fit | Strong for validating schema and safety behavior | Candidate after contract and benchmark evidence | Candidate after contract and benchmark evidence | Manual-only, not app/backend production path |
| Future Live Advisor fit | Blocked by `gt_15s` evidence until benchmarked | Candidate for latency/concurrency benchmark | Challenger for structured output and latency benchmark | Not suitable as production Live Advisor route |
| VLM/Qwen suitability | Existing local/private Qwen/VLM reference path | Future VLM serving candidate | Future VLM serving challenger | Manual suitability only |
| Structured JSON strategy | Backend validator required | Structured candidate JSON required | Structured candidate JSON required | Not a production structured contract |
| Validator/fallback relationship | Backend validator/fallback/safety remains source of truth | Backend validator/fallback/safety remains source of truth | Backend validator/fallback/safety remains source of truth | Manual result must not bypass backend safety |
| Latency expectation | Known accepted path, but `gt_15s` is blocking | Expected to be benchmarked for lower latency | Expected to be benchmarked for output/latency tradeoff | Not used for production latency claims |
| Concurrency expectation | Unknown until controlled benchmark | Candidate for concurrency measurement | Challenger for concurrency measurement | Manual-only; no production concurrency claim |
| Batching expectation | Reference behavior only | Candidate for future batching evaluation | Candidate/challenger for future batching evaluation | Manual-only |
| Quantization path | Reference baseline before quantized candidates | Candidate for FP16/BF16, INT8, AWQ/GPTQ, INT4 stress after baseline | Candidate for quantization comparison after baseline | Manual-only |
| Debug ease | Highest local debug clarity | Lower than reference; needs contract and observability checks | Lower than reference; needs contract and observability checks | Easy manual smoke, not production controlled |
| Local operator suitability | Good for operator reference smoke | Future operator benchmark candidate only | Future operator benchmark challenger only | Good for manual local experiments only |
| Production suitability | Not production-ready; reference only | Blocked until benchmark, safety, rollout approval | Blocked until benchmark, safety, rollout approval | Blocked as production route |
| Known blockers | `gt_15s`, no concurrency, no benchmark, no iOS endpoint | No runtime execution approved, no benchmark evidence | No runtime execution approved, no benchmark evidence | Manual-only, not backend production contract |
| Approval before runtime/model/benchmark | Required | Required | Required | Required, and still manual-only |

## Backend Gate

Phase 21-S adds:

```sh
npm run qa:open-weight-vlm:serving-stack-comparison-matrix
```

The CLI is no-model and no-network. It reviews sanitized dry-run scenarios only:

- Safe no-model serving stack comparison matrix passes.
- Missing reference/candidate/challenger roles warn without executing anything.
- Ollama/LM Studio production role blocks.
- Model call, endpoint call, benchmark execution, serving switch, model download, production route, and `productionReady:true` block.
- Raw prompt/output/image/base64/path/request payload/EXIF/GPS/sensor logging and raw persistence block.
- Missing structured JSON, validator, fallback, or safety requirements block.
- iOS integration, app/prod endpoint, and Camera live cloud runtime block.
- Unknown serving stack blocks.

## Boundary Confirmation

Phase 21-S does not start a serving runtime, call an endpoint, run a model call, run Qwen inference, run fixture inference, execute a serving benchmark, switch serving stack, call vLLM/SGLang/Ollama, add iOS integration, add an endpoint, add Auto-Trigger runtime, add WSS runtime, add upload runtime, commit raw artifacts, commit secrets, or change production readiness.

## Next Recommended Phase

Phase 21-T: One-fixture Serving Benchmark Approval Request Draft

Phase 21-T should be approval-request/draft only unless the user explicitly approves a model call. It must not run a model call, serving runtime, endpoint call, fixture inference, benchmark, model download, serving-stack switch, iOS integration, endpoint, or production rollout unless separately approved.
