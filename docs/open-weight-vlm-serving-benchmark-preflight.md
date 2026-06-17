# Open-Weight VLM Serving Benchmark Preflight

Status: Phase 20-P preflight only, referenced by Phase 21-G local model route approval gate

Production readiness: `productionReady:false`

## Executive Summary

Phase 20-P defines the serving benchmark preflight and Phase 21 entry criteria after the accepted Phase 20-N 12-fixture local/private smoke. It is planning and no-network gate work only. No Qwen inference, real model smoke, vLLM, SGLang, Ollama, LM Studio benchmark, model-stack switch, iOS integration, app-facing endpoint, production endpoint, training, fine-tuning, or production rollout is approved.

The preflight adds a sanitized backend gate for a future benchmark plan. The gate validates benchmark scope, serving stack inventory, metrics, fixture rules, artifact policy, stop conditions, and Phase 21 boundaries without requiring local config, fixture images, raw reports, prompts, model output, request payloads, paths, logs, credentials, or network calls.

## Why Serving Benchmark Is Needed

Phase 20-N proved correctness for a controlled local/private sandbox path, but latency remains a major planning concern. The accepted 12-fixture result had `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`. That is acceptable for a local correctness sandbox review, but it is not a production claim and it justifies a carefully gated serving benchmark preflight.

The benchmark question is not whether the backend validator accepts structured candidates. That has already been shown for the approved fixture set. The next question is whether serving-stack alternatives can improve latency, timeout behavior, and future throughput without weakening privacy, fixture controls, schema validation, or raw artifact restrictions.

## What Phase 20-N Proved

- The backend can call the local/private Windows Qwen2.5-VL FastAPI server through the sandbox path.
- The 12 approved ignored fixture tokens can route and infer exactly once per fixture.
- The deterministic mapper produced structured candidate JSON accepted by the backend validator for all 12 fixtures.
- Expanded fixture routing works for the controlled set.
- Repeatability and failure taxonomy gates can interpret the sanitized aggregate.
- Raw persistence flags stayed false.
- The Windows-primary backend workflow is viable for controlled local smoke.

## What Latency Still Blocks

The Phase 20-N latency distribution was:

- `gt_15s x10`
- `5s_to_15s x2`

This does not block sandbox correctness review. It does block any production-readiness claim, and it makes serving benchmark preflight the right next planning step. A future benchmark should measure latency distribution, timeout behavior, cold and warm server behavior, concurrency bucket, throughput bucket, provider-integration blocks, and model-server-unavailable states.

## Benchmark Scope

Future serving benchmark work must be backend-only and sandbox-only. It may compare serving stack behavior only after a future phase explicitly approves benchmark execution.

Phase 20-P itself only validates a benchmark plan. The added CLI is no-network, no-model, and sanitized aggregate only.

## Out Of Scope

- Real model smoke.
- Qwen inference.
- vLLM, SGLang, Ollama, or LM Studio execution.
- Model-stack switching.
- Fixture image changes.
- Local registry changes.
- iOS integration.
- App-facing endpoints.
- Production endpoints.
- Real user-photo upload.
- Prompt, model output, request payload, image path, base64, EXIF, or server log printing.
- Training or fine-tuning.
- Production rollout.

## Serving Stack Matrix

| Serving stack | Role | Phase 20-P status |
| --- | --- | --- |
| Transformers + FastAPI | Correctness/reference baseline | Already working, not optimized for throughput |
| vLLM | Primary serving benchmark candidate | Future benchmark candidate only |
| SGLang | Structured-output/performance challenger | Future benchmark candidate only |
| Ollama / LM Studio | Manual smoke/local dev only | Not the main benchmark path |

No stack is implemented or run by Phase 20-P.

## Metrics

Future benchmark reports must be sanitized and bucketed. Required metrics:

- `fixtureCount`
- `acceptedCount`
- `rejectedCount`
- `acceptanceRate`
- `validationCodeCounts`
- `fallbackCategoryCounts`
- `schemaErrorBucketCounts`
- `schemaFieldBucketCounts`
- `latencyBucketCounts`
- `p50LatencyBucket`
- `p95LatencyBucket`
- `timeoutCount`
- `providerIntegrationBlockCount`
- `modelServerUnavailableCount`
- `coldStartBucket`
- `warmRunBucket`
- `concurrencyBucket`
- `throughputBucket`
- `networkCallsMade`
- `productionReady:false`
- `rawPersistenceFlags`

Raw latency logs are not allowed if they include request detail. Raw prompt, raw model output, raw request payload, raw image path, base64, EXIF, local config contents, fixture registry contents, logs, credentials, and model weights must not be printed or committed.

## Latency Policy

- `5s_to_15s`: acceptable sandbox smoke range.
- `gt_15s`: latency note for local correctness; benchmark concern.
- Repeated `gt_15s` majority: benchmark priority.
- Timeout: blocker.
- `lt_1s` with rejection: likely pre-inference/provider block.
- Production claim: forbidden.

## Fixture Usage Rules

Future benchmark phases should use:

- Approved ignored fixture tokens only.
- The 12-fixture controlled set first.
- No raw paths.
- No fixture images committed.
- No local registry committed.
- One cold run only if explicitly approved.
- One warm run only if explicitly approved.
- No retries to chase pass rate unless a separate repeatability phase explicitly approves it.

## Safety And Logging Rules

- Backend validator remains the source of truth.
- Candidate JSON must stay structured.
- Free-form model text must not become backend gateway output.
- Raw prompt/model output/image path/base64/request payload/logs/config/registry contents must not print or persist.
- Raw persistence flags must remain false.
- Local/private server exposure must stay private.
- iOS payload and app behavior must remain unchanged.
- `productionReady:false` is mandatory.

## Artifact Policy

Benchmark reports are not committed by default. A future sanitized-report gate must explicitly allow committing any benchmark report, and only if the report contains sanitized aggregate fields with no raw content.

Ignored local config, fixture registry, fixture images, raw reports, logs, model outputs, prompts, request payloads, model weights, and credentials remain uncommitted.

## Future Report Schema

Suggested sanitized report shape:

- `schemaVersion`
- `runMode`
- `servingStack`
- `modelIdBucket`
- `hardwareBucket`
- `fixtureSetBucket`
- `aggregateMetrics`
- `latencyBuckets`
- `failureTaxonomy`
- `repeatabilitySummary`
- `rawPersistenceFlags`
- `productionReady:false`
- `networkCallsMade`
- `eligibleForPhase21GatewayReview:false` by default

## Stop Conditions

Stop immediately if any of these occur:

- Repo is not clean or upstream is not `0 0`.
- Local config, registry, fixtures, reports, logs, model output, prompts, request payloads, model weights, or credentials are staged.
- Healthz is unsafe.
- Public exposure is not `no`.
- Raw logging is not disabled.
- Model output, prompt, request payload, path, base64, EXIF, or server log would be printed.
- Fixture registry gate fails.
- Routing echo fails.
- Schema regression appears.
- Raw persistence flag is true.
- `productionReady:true` appears.
- Any app/iOS payload changes appear.
- Benchmark tries to add an app-facing or production endpoint.

## Decision Rules

Phase 20-P approves only a preflight plan. A later benchmark phase must be explicitly requested and must pass all existing gates before execution.

Future benchmark output can support planning decisions only. It must not be interpreted as production readiness, iOS readiness, user-photo readiness, retention/deletion readiness, privacy-disclosure readiness, or endpoint rollout readiness.

## Phase 21 Entry Criteria

Phase 21 should remain backend-internal only. Recommended next phase:

**Phase 21-A: Backend Internal VLM Gateway Contract Preflight**

Before Phase 21:

- Phase 20-P is committed and pushed.
- Serving benchmark preflight is complete.
- Benchmark scope is chosen explicitly.
- At least one safe benchmark plan exists.
- The 12-fixture smoke is accepted and reviewed.
- Latency risk is documented.
- All existing backend gates pass.
- No iOS integration is started.
- No production endpoint is added.
- Backend gateway contract still validates structured candidate JSON.
- Backend gateway does not expose free-form model text.
- Backend gateway does not accept raw app uploads until consent and backend policy are defined.
- `productionReady:false` remains mandatory.

If benchmark tooling needs one more no-network gate before Phase 21-A, use a separate Phase 20-Q serving benchmark dry-run plan instead of executing a real benchmark.

## Preflight Gate

Run:

```sh
npm run qa:open-weight-vlm:serving-benchmark-preflight
```

Expected sanitized behavior:

- `networkCallsMade:false`
- `benchmarkRun:false`
- `qwenInferenceRun:false`
- `eligibleForPhase21EntryReview:true`
- `eligibleForBenchmarkExecution:false`
- `productionReady:false`

## Boundary

Phase 20-P is preflight only. It does not run Qwen inference, run real smoke, run vLLM/SGLang/Ollama/LM Studio, add fixture images, modify ignored registries, start iOS integration, add app-facing endpoints, add production endpoints, train, fine-tune, or change production readiness.

## Phase 21-A Follow-up

Phase 21-A now adds `docs/backend-internal-vlm-gateway-contract-preflight.md` and `npm run qa:open-weight-vlm:gateway-contract-preflight`. The new gate validates the backend-internal gateway request/response contract only: sanitized bucket/fixture-token request metadata, structured candidate JSON response, existing validator/safety chain handoff, no app-facing endpoint, no production endpoint, no iOS integration, no real user-photo upload, and `productionReady:false`.

Phase 21-A does not run Qwen inference, real model smoke, serving benchmarks, vLLM/SGLang/Ollama/LM Studio, model-stack switches, fixture changes, ignored registry changes, endpoint work, iOS integration, training/fine-tuning, or production rollout.

## Phase 21-B / 21-C Follow-up

Phase 21-B adds the backend-internal adapter stub and no-model external echo alignment. Phase 21-C adds the backend-internal provider routing dry-run gate. Both remain backend-only and fail-closed. Neither phase approves iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, Qwen inference, or `productionReady:true`.

## Phase 21-D / 21-E Follow-up

Phase 21-D adds a no-model provider adapter HTTP check for the `local_contract_echo` route. Phase 21-E adds the cross-platform deployment boundary audit:

```sh
npm run qa:open-weight-vlm:cross-platform-boundary
```

Phase 21-E is no-network/no-model and verifies that Windows local sandbox paths, Mac local paths, LAN model URLs, public/cloud/tunnel model URLs, provider secrets, direct iOS provider routes, Camera cloud entries, app-facing endpoint flags, production endpoint flags, raw artifact policy allowances, and `productionReady:true` do not leak into runtime or production-facing buckets. It does not run real model smoke, Qwen inference, serving benchmarks, vLLM/SGLang/Ollama/LM Studio, model-stack switches, endpoint work, iOS integration, training/fine-tuning, or production rollout.

## Phase 21-F Follow-up

Phase 21-F adds a deployment config/env preflight:

```sh
npm run qa:open-weight-vlm:deployment-config-env-preflight
```

It validates sanitized config policy buckets only and keeps future production config behind env/secrets/config injection. It blocks committed secrets, runtime local paths, unsafe provider URLs, raw logging, endpoint flags, direct iOS provider flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmarks, and `productionReady:true`. It does not run serving benchmarks, execute vLLM/SGLang/Ollama/LM Studio, start endpoint work, integrate iOS, upload real photos, or approve production rollout.

## Phase 21-G Follow-up

Phase 21-G adds a local model route approval gate:

```sh
npm run qa:open-weight-vlm:local-model-route-approval
```

It validates future `local_model` approval prerequisites only. It does not run this serving benchmark, enable `local_model`, call Qwen, run fixture inference, or switch to vLLM/SGLang/Ollama. Passing Phase 21-G still reports `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, `benchmarkAllowed:false`, and `productionReady:false`.

## Phase 21-H Follow-up

Phase 21-H adds the controlled dry-run plan gate:

```sh
npm run qa:open-weight-vlm:local-model-route-dry-run-plan
```

The dry-run plan keeps serving benchmark execution blocked. A future first `local_model` route test must be explicitly approved, backend-internal, local/private, one declared synthetic fixture token, one call only, no retries, structured candidate JSON only, validator/fallback protected, and `productionReady:false`. Phase 21-H itself does not run Qwen, model inference, fixture inference, a serving benchmark, vLLM/SGLang/Ollama, iOS integration, endpoints, or real upload.
