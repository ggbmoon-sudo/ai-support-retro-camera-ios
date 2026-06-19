# Phase 21-Z2C-SF-RUN SiliconFlow 12-fixture API Benchmark Summary

Status: completed with provider schema validation rejections
Date: 2026-06-20  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2C-SF-RUN retried the approved SiliconFlow 12-fixture API benchmark after the RUN-PRE dry-run gate was committed and the local ignored API key was present.

The approved runner attempted exactly 12 SiliconFlow calls for fixtures `smoke_004` through `smoke_015`, used retry count `0`, and emitted sanitized aggregate JSON only. All 12 attempts reached the provider path and were rejected by the backend validator with sanitized bucket `provider_schema_invalid`.

No raw provider response, raw prompt, raw request payload, raw image/base64/path, API key, provider credential, account detail, stack trace with payload, or raw report was printed or persisted.

## Approved Scope

| Field | Value |
| --- | --- |
| Phase | `Phase 21-Z2C-SF-RUN` |
| Provider | `siliconflow` |
| Model | `Qwen/Qwen3-VL-30B-A3B-Instruct` |
| Model class | `qwen3_vl_30b_a3b_instruct` |
| Fixture tokens | `smoke_004` through `smoke_015` |
| Fixture count | `12` |
| Planned call count | `12` |
| Actual call count | `12` |
| Retry count | `0` |
| Image detail | `low` |
| Stream | `false` |
| Max output tokens | `256` |
| Temperature | `0.1` |
| JavaScript / Node.js backend only | yes |
| iOS integration | no |
| Live camera upload | no |
| Production readiness | `productionReady:false` |

## Sanitized Aggregate Result

```json
{
  "phase": "Phase 21-Z2C-SF-RUN",
  "providerClass": "siliconflow",
  "modelClass": "qwen3_vl_30b_a3b_instruct",
  "fixtureCount": 12,
  "plannedCallCount": 12,
  "actualCallCount": 12,
  "retryCount": 0,
  "acceptedCount": 0,
  "rejectedCount": 12,
  "validationCodeBuckets": {
    "provider_schema_invalid": 12
  },
  "fallbackCategoryBuckets": {
    "provider_validation_rejected": 12
  },
  "errorBuckets": {},
  "latencyBuckets": {
    "5s_to_15s": 12
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
  "networkCallsMade": true,
  "productionReady": false
}
```

## Interpretation

- Execution stayed inside the approved 12-call, zero-retry scope.
- The result is a backend schema/contract rejection bucket, not a network-connectivity failure.
- No provider output was accepted because every provider response failed backend Photo Advisor schema validation.
- Token usage was available only as a sanitized bucket; cost remained uncomputed because the phase records aggregate safety evidence, not billing verification.
- This benchmark result does not imply production readiness.

## Boundary Confirmation

- Provider API calls executed: yes, exactly 12 attempted
- Model calls executed: attempted through approved provider API scope only
- Retry count: `0`
- Raw provider output printed/persisted: false
- Raw prompt printed/persisted: false
- Raw request payload printed/persisted: false
- Raw image/base64/path printed/persisted: false
- API key printed/persisted/committed: false
- iOS runtime changed: no
- Upload payload changed: no
- Live camera cloud AI added: no
- App-facing endpoint added: no
- Production endpoint added: no
- RunPod provisioned: no
- vLLM/SGLang/Ollama run: no
- `productionReady:false`

## Recommended Next Phase

Next recommended phase:

- `Phase 21-Z2D-SF: SiliconFlow Benchmark Review and Provider Decision Gate`

This should review the `provider_schema_invalid x12` result, compare the SiliconFlow OpenAI-compatible response behavior against the backend parser/validator contract, and decide whether a separately approved prompt/schema-alignment phase is justified. Do not move to iOS integration automatically.
