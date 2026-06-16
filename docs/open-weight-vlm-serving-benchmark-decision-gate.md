# Open-weight VLM Serving Benchmark Decision Gate

Status: Phase 20-O review / planning only
Date: 2026-06-16
Scope: Windows-primary backend/local VLM sandbox decision gate

## Executive Summary

Phase 20-N produced a clean controlled 12-fixture local/private Qwen2.5-VL smoke result: 12 accepted, 0 rejected, no validation/fallback/schema diagnostic buckets, raw persistence flags false, and `productionReady:false`.

The result is strong enough to justify planning a serving benchmark preflight, but not a benchmark execution. Phase 20-O does not run Qwen inference, vLLM, SGLang, Ollama, LM Studio, fixture expansion, iOS integration, app-facing endpoints, production endpoints, training, fine-tuning, or production rollout.

Recommended next phase: **Phase 20-P - Serving Stack Benchmark Preflight**. Phase 20-P should define the benchmark matrix, metrics, fixture rules, logging rules, safety gates, and stop conditions before any serving-stack benchmark is run.

## Phase 20-N Result Review

Sanitized Phase 20-N aggregate:

- `fixtureCount:12`
- `acceptedCount:12`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x12`
- `fallbackCategoryCounts:null x12`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`
- `networkCallsMade:true`
- `productionReady:false`
- raw prompt, model response, image, image path, and request payload persisted flags false

The run used exactly one local/private model call per approved ignored fixture token and no retries.

## What 12/12 Accepted Proves

- The local/private Windows Qwen2.5-VL FastAPI server can process the 12 approved fixture tokens.
- Deterministic mapper output passed the backend validator for all 12 fixtures.
- Expanded fixture routing works for the approved 12-token set.
- Raw persistence remained false in the sanitized result.
- Backend repeatability and failure/latency gates can interpret the accepted aggregate.
- The Windows-primary workflow is viable for controlled local smoke review.

## What It Does Not Prove

- No production readiness.
- No iOS readiness.
- No real user-photo upload.
- No consent UI for real self-hosted VLM analysis.
- No app-facing endpoint.
- No production endpoint.
- No quota, billing, or entitlement implementation.
- No retention/deletion policy implementation for VLM image handling.
- No App Store privacy disclosure update.
- No throughput or concurrency benchmark.
- No serving-stack comparison.
- No vLLM, SGLang, Ollama, or LM Studio benchmark.
- No broader real-world dataset coverage.
- No multilingual real-output review.
- No fine-tuning.
- No on-device model.

## Latency Interpretation

Phase 20-N latency buckets were:

- `gt_15s x10`
- `5s_to_15s x2`

Interpretation:

- Functional smoke passed.
- The latency note is significant.
- This is acceptable for a local correctness sandbox.
- This is not acceptable as a production claim.
- Serving benchmark preflight is justified.
- Future benchmark work should measure latency distribution, timeout behavior, cold/warm server behavior, and failure taxonomy.
- Phase 20-O must not optimize latency or change serving stacks.

## Current Gate Inventory

- Structured candidate validator.
- Synthetic benchmark.
- Synthetic benchmark gate.
- Local config dry-run.
- Default local sandbox smoke stub/no-network.
- Local smoke gate.
- Expanded fixture registry dry-run.
- No-model fixture routing contract echo.
- Provider-integration diagnostic.
- Repeatability gate.
- Failure/latency taxonomy gate.
- Copy/filter/CreativeIntent/card coverage.
- Secret scan.
- iOS direct provider/model scan.
- Camera cloud entry scan.
- Backend/iOS payload drift scan.
- Artifact scan.

## Risks Before Serving Benchmark

- The current reference Transformers + FastAPI stack has frequent `gt_15s` latency.
- Benchmarking can accidentally become a model-stack switch if scope is not constrained first.
- Benchmark output can leak raw prompts, model outputs, request payloads, paths, or logs unless sanitized output rules are defined up front.
- Fixture reuse must remain token-only and ignored local artifacts must stay uncommitted.
- Serving benchmark results must not be treated as iOS or production readiness.

## Serving Benchmark Preflight Criteria

Before Phase 20-P starts:

- Repo is clean and upstream comparison is `0 0`.
- Phase 20-O is committed and pushed.
- Ignored local config, registry, and fixtures remain ignored.
- No raw artifacts are printed or committed.
- Existing backend gates pass.
- Benchmark scope is backend-only.
- Benchmark output is sanitized aggregate-only.
- Benchmark must not commit model outputs, prompts, request payloads, logs, configs, fixture images, credentials, or model weights.
- `productionReady:false` remains required.

## Recommended Phase 20-P Direction

Recommend: **Phase 20-P - Serving Stack Benchmark Preflight**.

Phase 20-P should be preflight only:

- no vLLM/SGLang/Ollama benchmark run yet
- no model stack switch
- no production endpoint
- define benchmark matrix
- define metrics
- define safety gates
- define fixture usage rules
- define logging/redaction rules
- define stop conditions

Candidate serving stacks for later phases:

- Transformers + FastAPI: correctness/reference baseline.
- vLLM: primary benchmark candidate for throughput and serving performance.
- SGLang: structured-output/performance challenger.
- Ollama/LM Studio: manual/local smoke only, not the main benchmark path.

## Production Boundary

`productionReady:false` remains required. Phase 20-O is review/decision only and does not authorize production rollout, iOS integration, Camera cloud AI, capture-context upload, app-facing endpoints, production endpoints, serving-stack benchmark execution, training, fine-tuning, model-stack switching, or user-photo use.

## Phase 20-P Follow-up

Phase 20-P now adds `docs/open-weight-vlm-serving-benchmark-preflight.md` and `npm run qa:open-weight-vlm:serving-benchmark-preflight`. The preflight remains no-network and no-model: it validates the benchmark plan, serving stack matrix, sanitized metrics, fixture rules, artifact policy, stop conditions, and Phase 21 backend gateway entry criteria only.

Phase 20-P does not run Qwen inference, real model smoke, vLLM/SGLang/Ollama/LM Studio, model-stack switching, iOS integration, app-facing endpoints, production endpoints, training/fine-tuning, or production rollout. `productionReady:false` remains mandatory.
