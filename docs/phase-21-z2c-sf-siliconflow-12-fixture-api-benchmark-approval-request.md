# Phase 21-Z2C-SF SiliconFlow 12-fixture API Benchmark Approval Request

Status: completed  
Date: 2026-06-20  
Phase type: approval-request draft only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2C-SF creates an approval request draft for a possible future SiliconFlow 12-fixture API benchmark.

This document does not approve execution by itself. It does not run the benchmark, call SiliconFlow, create or read an API key, create a provider account, upload images, execute provider runtime, call a model, call a real inference endpoint, modify iOS runtime, modify upload payloads, or change production readiness.

Boundary summary for this draft phase:

- Provider API calls executed: no
- Model calls executed: no
- Benchmark executed: no
- API key created/read/printed/stored/committed: no
- Provider account created: no
- Image upload executed: no
- Provider runtime execution added: no
- iOS runtime changed: no
- Upload payload changed: no
- Live camera cloud AI added: no
- `productionReady:false`

## Future Benchmark Scope

Future benchmark scope, only if explicitly approved later:

| Field | Future approved-run value |
| --- | --- |
| Provider | `SiliconFlow` |
| Model | `Qwen/Qwen3-VL-30B-A3B-Instruct` |
| Endpoint bucket | `siliconflow_chat_completions` |
| API style | OpenAI-compatible |
| Implementation path | JavaScript / Node.js backend only |
| Product mode | post-capture / imported-photo only |
| Fixtures | `smoke_004` through `smoke_015` |
| Fixture count | `12` |
| Call count | `12` |
| Retry count | `0` |
| Image detail | `low` |
| Stream | `false` |
| Max output tokens | `256` |
| Temperature | `0.1` |
| Parser/validator/fallback | required |
| Report type | sanitized aggregate only |
| iOS integration | none |
| Live camera upload | none |
| Production readiness | `productionReady:false` |

Required future runtime boundaries:

- Backend-mediated only.
- No raw provider response logging.
- No raw prompt logging.
- No raw image/base64 logging.
- No request payload logging.
- No provider credentials committed.
- No iOS provider key.
- No direct iOS provider call.
- No app-facing endpoint.
- No production endpoint.
- No live camera upload.

## Copyable Approval Wording

The future execution phase must not run unless the operator explicitly sends this approval wording or an equivalent unambiguous approval:

> Approve Phase 21-Z2C-SF-RUN: SiliconFlow 12-fixture API benchmark with provider SiliconFlow, model Qwen/Qwen3-VL-30B-A3B-Instruct, fixtures smoke_004 through smoke_015, exactly 12 calls, retry 0, backend-mediated JavaScript/Node.js only, image detail low, stream false, max output tokens 256, sanitized aggregate report only, no iOS integration, no live camera upload, no raw image/base64/prompt/provider response/request payload logging, no provider credentials committed, productionReady:false.

## Operator Confirmation Checklist

Before any future execution phase, the operator must confirm:

- I understand this will make real SiliconFlow API calls.
- I understand it may consume paid quota.
- I confirm API key will stay local/ignored/backend-only.
- I confirm no real user photos will be used.
- I confirm only approved fixtures `smoke_004` through `smoke_015` will be used.
- I confirm retry count is `0`.
- I confirm no iOS integration is included.

## Required Local/Ignored Prerequisites for Future Execution

Do not create these prerequisites in Phase 21-Z2C-SF. A future approved execution phase must require:

- Local ignored env file or operator-provided environment variable only.
- `SILICONFLOW_API_KEY` present locally, but never printed, logged, copied into docs, or committed.
- `SILICONFLOW_BASE_URL` optional and sanitized.
- Provider readiness CLI passes in the future approved execution context.
- Provider terms and pricing caveats acknowledged before paid calls.
- No raw key in config.
- No key in git.
- No key in iOS.
- Approved fixture registry ready.
- Benchmark budget cap stated before execution.
- Network approval explicitly granted.

## Future Sanitized Output Format

Future execution should output sanitized aggregate JSON only:

- `phase`
- `providerClass:siliconflow`
- `modelClass:qwen3_vl_30b_a3b_instruct`
- `fixtureCount`
- `callCount`
- `retryCount`
- `acceptedCount`
- `rejectedCount`
- `validationCodeBuckets`
- `fallbackCategoryBuckets`
- `errorBuckets`
- `latencyBuckets`
- `costEstimateBucket` if available
- `tokenUsageBucket` if available
- `rawOutputPrinted:false`
- `rawOutputPersisted:false`
- `rawImagePrinted:false`
- `rawImagePersisted:false`
- `requestPayloadPrinted:false`
- `requestPayloadPersisted:false`
- `apiKeyPrinted:false`
- `apiKeyPersisted:false`
- `networkCallsMade:true` only in the future execution phase
- `productionReady:false`

For this approval draft phase:

- `networkCallsMade:false`
- `modelCallsMade:false`
- `benchmarkRun:false`
- `productionReady:false`

## Future Failure Gates

The future benchmark must stop or fail closed if any of these occur:

- API key missing.
- API key appears in repo, diff, console output, report, or log.
- Provider base URL is unsafe.
- Provider disabled.
- `allowNetworkCalls:false`.
- Benchmark not explicitly approved.
- Fixture count is not exactly `12`.
- Fixture list differs from `smoke_004` through `smoke_015`.
- Retry count is not `0`.
- Raw logging is enabled.
- `productionReady:true`.
- iOS runtime changed.
- Upload payload changed.
- Camera cloud AI entry added.
- Provider output parser bypasses schema.
- Fallback disabled.

## Future Success Criteria

Future benchmark execution success means the run stayed inside the approved boundary, not that all outputs were accepted.

Success criteria:

- All 12 calls attempted only once.
- Retry count is `0`.
- No raw artifacts printed or persisted.
- No secret leakage.
- No iOS runtime changes.
- No upload payload changes.
- Accepted and rejected counts reported.
- Schema, fallback, safety, and provider error buckets reported.
- Latency buckets reported.
- `productionReady:false`.
- Result does not imply production readiness.

`12/12 accepted` is not required for execution success. Rejected cases are allowed if sanitized and correctly bucketed.

## Future Non-goals

The future approved benchmark would still not approve:

- production rollout
- iOS integration
- app-facing endpoint
- production endpoint
- live camera upload
- 0.8 FPS cloud analysis
- WSS runtime
- Auto-Trigger runtime
- RunPod provisioning
- local Qwen3 install/download/load/call
- vLLM/SGLang/Ollama runtime
- user-photo upload or beta

## Recommended Next Phase

Next recommended phase:

- `Phase 21-Z2C-SF-RUN: Approved SiliconFlow 12-fixture API Benchmark`

This next phase is not automatic. It requires explicit approval using the exact approval wording above or an equivalent unambiguous approval, plus local ignored prerequisites and network/budget acceptance.
