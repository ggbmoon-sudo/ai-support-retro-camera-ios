# Phase 21-Z2G-SF: SiliconFlow Network/Parameter Latency Probe Summary

Date: 2026-06-20
Status: completed
Production readiness: `productionReady:false`

## Executive Summary

The operator suggested network and request-level latency optimizations, including keep-alive / connection pooling, HTTP/2, closer routing, image compression, streaming, shorter output, lower temperature, and shorter prompts.

This phase tested the safe backend-only parts using one approved smoke JPG per call. The result reinforces Phase 21-Z2F-SF-LATENCY: compact prompt + `max_tokens:192` remains the safest schema-valid setting, but end-to-end SiliconFlow serverless latency stays seconds-level. The `0.15s` target is not supported by the measured backend-mediated remote VLM path.

## Scope

- Provider: SiliconFlow
- Model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- Fixture: `smoke_004` only
- Successful escalated provider calls in this probe: `5`
- Retry count: `0`
- Image detail: `low`
- Request body size bucket: `lte_100kb`
- Implementation path: JavaScript / Node.js backend probe only
- iOS runtime change: no
- Upload payload change: no
- Production readiness: `productionReady:false`

## Probe Results

| Variant | Accepted | Latency | TTFT | Outcome |
| --- | --- | ---: | ---: | --- |
| Sequential fetch compact `max_tokens:192` warmup | yes | `8637ms` | n/a | accepted |
| Sequential fetch compact `max_tokens:192` same process | yes | `8529ms` | n/a | accepted |
| Sequential fetch compact `max_tokens:192`, `stream:true` | yes | `9898ms` | `3979ms` | accepted after full stream |
| Ultra-short prompt `max_tokens:80` | no | `5618ms` | n/a | `provider_json_parse_failed` / `free_form_text_detected` |
| Ultra-short prompt `max_tokens:50` | no | `9852ms` | n/a | `provider_json_parse_failed` / `free_form_text_detected` |

## Interpretation

- Sequential same-process fetch did not materially reduce latency: `8637ms` to `8529ms`.
- `stream:true` can expose the first chunk earlier (`3979ms`) but does not produce a validated Photo Advisor candidate until the full JSON completes (`9898ms`).
- `max_tokens:80` and `max_tokens:50` are too low for the current strict candidate schema and caused invalid/free-form output.
- The request body is already small enough for this fixture (`lte_100kb`), so upload size is unlikely to be the dominant blocker in this probe.
- A custom direct `https.Agent({ keepAlive:true })` attempt was not useful in this environment because it returned sanitized network errors before provider responses. The successful path remains Node global `fetch`.
- HTTP/2, WebP, binary multipart upload, GPU resizing, provider region routing, and iOS `URLSession` transport were not implemented in this phase because they require separate runtime or provider-support decisions.

## Decision

Keep the current backend contract at compact prompt + `maxOutputTokens:192`.

Do not change default to `stream:true` yet. Streaming may be useful later for perceived progress, but the app cannot safely act on provider output until backend parser/schema validation succeeds after the full response.

Do not lower `maxOutputTokens` to `80` or `50` for the current schema.

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

## Next Recommended Phase

Phase 21-Z2H-SF: SiliconFlow Latency Architecture Decision Gate.

Recommended decisions: whether to pursue provider-region/SLA verification, an explicitly approved smaller-model latency canary, direct URL vs base64 hosting experiment, RunPod warm-worker comparison, or asynchronous backend-mediated Photo Advisor UX.
