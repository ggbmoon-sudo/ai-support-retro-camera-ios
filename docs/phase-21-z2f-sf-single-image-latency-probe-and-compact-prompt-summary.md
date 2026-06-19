# Phase 21-Z2F-SF-LATENCY: SiliconFlow Single-image Latency Probe and Compact Prompt Summary

Date: 2026-06-20
Status: completed
Production readiness: `productionReady:false`

## Executive Summary

The operator approved single-image SiliconFlow latency tuning with one `smoke_004` JPG per call. The goal was to reduce the severe Phase 21-Z2E-SF-AUTO latency and evaluate whether `Qwen/Qwen3-VL-30B-A3B-Instruct` can approach a target around `0.15s` per image.

Result: compact prompt + `max_tokens:192` reduces input token bucket and can improve accepted latency versus the original prompt in a single-image probe, but the observed end-to-end SiliconFlow serverless API latency remains seconds-level, not sub-second. The current evidence does not support `0.15s` end-to-end latency for backend-mediated image upload + remote VLM generation on this provider path.

## Scope

- Provider: SiliconFlow
- Model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- Fixture: `smoke_004` only
- Retry count: `0`
- Image detail: `low`
- Stream: `false`
- Implementation path: JavaScript / Node.js backend only
- iOS integration: no
- Upload payload change: no
- Production readiness: `productionReady:false`

## Provider Calls

- Total provider calls in this latency tuning pass: `11`
- Round 1: `6` single-image probes
- Round 2: `4` single-image probes
- Post-patch validation: `1` single-image probe
- Alternative model calls: `0`
- Fixture expansion: no
- Real user photos: no

## Sanitized Probe Results

| Variant | Accepted | Latency | Token Bucket | Outcome |
| --- | --- | ---: | --- | --- |
| Baseline current prompt, default provider behavior, `max_tokens:256` | yes | `9427ms` | `lte_5k` | Accepted baseline |
| Current prompt with `enable_thinking:false` | no | `2037ms` | unavailable | `provider_invalid_request` |
| Compact prompt with `enable_thinking:false` | no | `1774ms`-`1819ms` | unavailable | `provider_invalid_request` |
| Ultra compact + JSON object + `enable_thinking:false` | no | `1660ms`-`1740ms` | unavailable | `provider_invalid_request` |
| Current prompt, no thinking parameter, `max_tokens:128` | no | `5196ms` | `lte_5k` | `provider_json_parse_failed` |
| Compact prompt, no thinking parameter, `max_tokens:192` | yes | `5466ms` | `lte_1k` | Best accepted probe |
| Compact prompt, no thinking parameter, `max_tokens:128` | no | `5921ms` | `lte_1k` | `provider_json_parse_failed` |
| Ultra compact + JSON object, no thinking parameter, `max_tokens:128` | no | `7620ms` | `lte_1k` | `provider_json_parse_failed` |
| Post-patch compact prompt, no thinking parameter, `max_tokens:192` | yes | `10473ms` | `lte_1k` | Accepted but queue/serverless variance remained high |

## Interpretation

- The safest accepted optimization is compact prompt + `max_tokens:192`.
- `max_tokens:128` is too tight for the current schema and can lead to invalid/free-form output.
- `response_format:{type:"json_object"}` did not improve acceptance in the tested ultra-compact shape and remains disabled by default.
- `enable_thinking:false` was rejected for this VLM request shape. The SiliconFlow static OpenAPI docs list `enable_thinking` under the LLM request schema, while the VLM request schema used for image input does not list it, matching the observed `provider_invalid_request` result.
- The accepted post-patch run still measured `10473ms`, showing queue/serverless/provider-side variance dominates after prompt compression.

## Code Change

- Added compact SiliconFlow Photo Advisor prompt builders.
- Switched the no-runtime request contract default placeholders to the compact prompt profile.
- Reduced default contract `maxOutputTokens` from `256` to `192`.
- Kept backend schema validation strict.
- Kept JSON mode disabled by default.
- Did not add provider runtime execution, iOS integration, app-facing endpoint, or production endpoint.

## Boundary Confirmations

- Raw provider response printed/persisted/committed: no
- Raw model text printed/persisted/committed: no
- Raw prompt/request payload printed/persisted/committed: no
- Raw image/base64/path printed/persisted/committed: no
- API key printed/persisted/committed: no
- Provider credential committed: no
- Raw report committed: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI runtime added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Production rollout: no

## Latency Decision

`0.15s` is not supported by the current evidence for SiliconFlow serverless `Qwen/Qwen3-VL-30B-A3B-Instruct` with image upload and strict JSON validation. To pursue sub-second behavior, the next decision should consider a different execution architecture:

- provider-side reserved capacity or SLA discussion,
- smaller/faster model canary such as `Qwen/Qwen3-VL-8B-Instruct`,
- alternative provider comparison,
- RunPod/self-hosted warm worker comparison,
- local/on-device CV prefilter for instant UI feedback,
- asynchronous Photo Advisor UX with latency buckets and queue status.

## Next Recommended Phase

Phase 21-Z2G-SF: SiliconFlow Latency Architecture Decision Gate.

Recommended scope: no default iOS integration and no production rollout. Decide whether to request explicit approval for a bounded single-image alternative-model latency canary, provider/SLA check, or RunPod warm-worker comparison.
