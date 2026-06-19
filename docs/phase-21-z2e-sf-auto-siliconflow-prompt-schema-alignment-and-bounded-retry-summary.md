# Phase 21-Z2E-SF-AUTO: SiliconFlow Prompt/Schema Alignment and Bounded Retry Summary

Date: 2026-06-20`r`nStatus: completed`r`nProduction readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2E-SF-AUTO was an explicitly approved bounded SiliconFlow prompt/schema alignment and API retry phase. It kept the provider/model scope fixed to SiliconFlow with `Qwen/Qwen3-VL-30B-A3B-Instruct`, used only approved fixtures `smoke_004` through `smoke_015`, and stayed under the hard cap of 28 provider calls.

Result: the tightened backend prompt contract and strict parser/validator path accepted the canary plus the controlled 12-fixture run. No second full run was needed.

## Scope

- Provider: SiliconFlow
- Model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- Provider mode: `api_serverless`
- Product mode: `post_capture_imported_photo_only`
- Fixtures: `smoke_004` through `smoke_015`
- Canary fixture: `smoke_004`
- Retry count: `0`
- Image detail: `low`
- Stream: `false`
- Max output tokens: `256`
- Temperature: `0.1`
- Implementation path: JavaScript / Node.js backend only
- Production readiness: `productionReady:false`

## Prompt/Schema Alignment Changes

- Added a backend-only SiliconFlow Photo Advisor prompt contract module.
- The prompt contract uses the existing backend schema enums and requires semantic keys only.
- The provider is not responsible for final UI copy; the app language pack remains the owner of user-facing text.
- The prompt forbids Markdown, prose wrappers, score/rating language, sensitive inference, chain-of-thought, debug/provider leakage, retake-first language, and capture-context overclaim.
- The backend schema was not weakened or loosened to force acceptance.

## Parser and Diagnostic Changes

- Parser output remains untrusted until validated by the existing Photo Advisor schema.
- Added sanitized schema diagnostic buckets for malformed provider-like output.
- Diagnostics do not include raw provider text, generated free-form text, prompts, request payloads, image data, file paths, credentials, or raw responses.
- Synthetic tests cover valid schema output plus malformed, unsafe, unsupported enum, wrong type, extra field, missing field, debug leakage, prompt echo, chain-of-thought, score/rating, retake-first, and capture-context overclaim cases.

## Sanitized Bounded API Result

```json
{
  "phase": "Phase 21-Z2E-SF-AUTO",
  "providerClass": "siliconflow",
  "modelClass": "qwen3_vl_30b_a3b_instruct",
  "totalProviderCallsMade": 13,
  "canaryCallCount": 1,
  "fullRunCount": 1,
  "plannedFixtureCount": 12,
  "actualFixtureCount": 12,
  "retryCount": 0,
  "acceptedCount": 13,
  "rejectedCount": 0,
  "validationCodeBuckets": {
    "accepted": 13
  },
  "fallbackCategoryBuckets": {
    "none": 13
  },
  "errorBuckets": {},
  "schemaDiagnosticBuckets": {},
  "latencyBuckets": {
    "5s_to_15s": 9,
    "gt_15s": 4
  },
  "tokenUsageBucket": "lte_20k",
  "costEstimateBucket": "usage_available_cost_not_computed",
  "rawOutputPrinted": false,
  "rawOutputPersisted": false,
  "rawImagePrinted": false,
  "rawImagePersisted": false,
  "requestPayloadPrinted": false,
  "requestPayloadPersisted": false,
  "apiKeyPrinted": false,
  "apiKeyPersisted": false,
  "iOSRuntimeChanged": false,
  "uploadPayloadChanged": false,
  "networkCallsMade": true,
  "productionReady": false
}
```

## Interpretation

- The prior Phase 21-Z2C-SF-RUN `provider_schema_invalid x12` result was resolved at the prompt/schema alignment layer.
- This result supports continuing SiliconFlow as the primary API-first provider candidate for backend-only Photo Advisor evaluation.
- This result does not approve production rollout, iOS integration, upload-payload changes, live camera cloud AI, app-facing endpoints, or production endpoints.
- Latency still needs review because four calls landed in `gt_15s`.
- Cost remains only a usage-available bucket; production billing must be rechecked before beta.

## Boundary Confirmations

- Raw provider response committed: no
- Raw provider text committed: no
- Raw runtime prompt committed: no
- Raw request payload committed: no
- Raw image/base64/path committed: no
- API key printed or committed: no
- Provider credential committed: no
- Raw benchmark report committed: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- RunPod provisioned: no
- Alternative model calls: no
- `productionReady:true`: no

## Next Recommended Phase

Phase 21-Z2F-SF: SiliconFlow Accepted Benchmark Review and Beta Readiness Decision Gate.

Recommended scope: docs/backend review only. Review the accepted aggregate result, latency buckets, cost/billing caveat, privacy/legal terms, consent requirements, and whether a later internal beta integration plan should be drafted. Do not add iOS integration, production endpoints, live camera cloud AI, upload-payload changes, or production rollout without a separate explicit phase.
