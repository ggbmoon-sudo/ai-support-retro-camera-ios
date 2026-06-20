# SiliconFlow Fastest API Connection Research

Date: 2026-06-20
Status: research / documentation only
Production readiness: `productionReady:false`

## Executive Summary

This document records the current SiliconFlow API connection shape, every latency-oriented method already tried, the fastest usable result, and the recommended fastest-safe connection strategy for the backend-mediated Photo Advisor path.

The fastest schema-valid accepted result measured so far is:

- **`5466ms`** with compact prompt, `max_tokens:192`, `stream:false`, `image_url.detail:"low"`, model `Qwen/Qwen3-VL-30B-A3B-Instruct`.

The fastest perceived first-token/first-chunk result measured so far is:

- **TTFT `3979ms`** with `stream:true`, but the full validated JSON result still took **`9898ms`**.

Important conclusion:

- The current remote serverless VLM path is **seconds-level**, not `0.15s`.
- `0.15s` is not realistic for the full backend-mediated image upload + remote VLM inference + JSON validation path unless the architecture changes.
- The safest current production-blocked backend contract remains compact prompt + `maxOutputTokens:192`.
- Lowering `max_tokens` to `128`, `80`, or `50` has caused invalid/free-form output and should not be used for this schema.
- `stream:true` may help perceived progress later, but raw provider stream chunks must not be shown to the app; backend validation still needs the full JSON object.

## Current API Connection Shape

### Provider

- Provider: SiliconFlow
- API style: OpenAI-compatible chat completions
- Base URL env name: `SILICONFLOW_BASE_URL`
- Default base URL used by local probes: `https://api.siliconflow.com/v1`
- Path: `/chat/completions`
- Endpoint bucket: `siliconflow_chat_completions`
- API key env name: `SILICONFLOW_API_KEY`
- API key location: backend environment only
- iOS API key: not allowed
- iOS direct provider call: not allowed

Reference:

- SiliconFlow Chat Completions docs: <https://docs.siliconflow.com/en/api-reference/chat-completions/chat-completions>

### Current Model

- Primary model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- Provider mode: `api_serverless` for approved probes
- Repo contract mode: `no_runtime_contract` by default
- RunPod status: fallback / comparison only
- Product mode: post-capture / imported photo only
- Live camera cloud AI: blocked
- Production readiness: `productionReady:false`

### Current Backend Request Parameters

Current best-safe request settings:

```json
{
  "method": "POST",
  "path": "/chat/completions",
  "headers": {
    "Authorization": "Bearer <BACKEND_ONLY_SILICONFLOW_API_KEY>",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "Qwen/Qwen3-VL-30B-A3B-Instruct",
    "stream": false,
    "temperature": 0.1,
    "top_p": 0.8,
    "max_tokens": 192,
    "messages": [
      {
        "role": "system",
        "content": "<COMPACT_BACKEND_ONLY_SCHEMA_PROMPT>"
      },
      {
        "role": "user",
        "content": [
          {
            "type": "image_url",
            "image_url": {
              "url": "<SAFE_IMAGE_URL_OR_BASE64_PLACEHOLDER>",
              "detail": "low"
            }
          },
          {
            "type": "text",
            "text": "<COMPACT_SCHEMA_ENUM_PROMPT>"
          }
        ]
      }
    ]
  }
}
```

Notes:

- The actual API key must never be committed, printed, logged, or sent to iOS.
- Raw image/base64, raw prompt, raw request payload, and raw provider response must not be printed or persisted.
- The provider output is untrusted.
- Backend parser extracts text from the OpenAI-compatible response shape.
- Backend validator remains the source of truth.
- App receives semantic keys only after validation/fallback.

### Current Output Handling

The provider response is expected to contain model text in an OpenAI-compatible shape:

```json
{
  "choices": [
    {
      "message": {
        "content": "<PROVIDER_TEXT_IN_MEMORY_ONLY>"
      }
    }
  ]
}
```

Backend then:

1. Extracts provider text in memory.
2. Rejects non-string or empty content.
3. Requires one strict JSON object.
4. Parses JSON defensively.
5. Validates against the Photo Advisor candidate schema.
6. Rejects unsafe/free-form/debug/sensitive/score/retake-first output.
7. Returns only semantic keys or a safe fallback.

## Current Best-Safe Settings

| Category | Current Setting | Reason |
| --- | --- | --- |
| Model | `Qwen/Qwen3-VL-30B-A3B-Instruct` | Primary selected model |
| Image detail | `low` | Lowest supported detail tested for 512px-class Photo Advisor |
| Prompt | compact schema-enum prompt | Reduced token bucket while preserving schema validity |
| `max_tokens` | `192` | Fastest accepted profile; lower values failed schema |
| `temperature` | `0.1` | Low randomness; stable schema output |
| `top_p` | `0.8` | Current tested stable value |
| `stream` | `false` by default | Full output required before validation |
| `response_format` | disabled | Did not improve acceptance in tested ultra-compact shape |
| `enable_thinking` | not sent | Rejected for the VLM request shape |
| Runtime location | backend only | Keeps API key and provider boundary out of iOS |
| Raw logging | disabled | Required privacy/safety boundary |

## Methods Already Tried

### Phase 21-Z2C-SF-RUN: First 12-fixture Benchmark

| Method | Calls | Accepted | Result |
| --- | ---: | ---: | --- |
| Approved 12-fixture SiliconFlow benchmark, `max_tokens:256`, retry `0` | `12` | `0` | All rejected with `provider_schema_invalid` |

Interpretation:

- Network/auth/base URL were not the blocker.
- Provider/model returned responses.
- Failure layer was prompt/schema alignment.

### Phase 21-Z2E-SF-AUTO: Prompt/Schema Alignment Retry

| Method | Calls | Accepted | Latency Bucket |
| --- | ---: | ---: | --- |
| Bounded prompt/schema alignment canary + full run | `13` | `13` | `5s_to_15s x9`, `gt_15s x4` |

Interpretation:

- Schema alignment was fixed.
- Latency remained seconds-level.

### Phase 21-Z2F-SF-LATENCY: Single-image Prompt/Parameter Probe

| Variant | Accepted | Latency | Token Bucket | Outcome |
| --- | --- | ---: | --- | --- |
| Baseline current prompt, `max_tokens:256` | yes | `9427ms` | `lte_5k` | accepted |
| Current prompt + `enable_thinking:false` | no | `2037ms` | unavailable | `provider_invalid_request` |
| Compact prompt + `enable_thinking:false` | no | `1774ms`-`1819ms` | unavailable | `provider_invalid_request` |
| Ultra compact + JSON object + `enable_thinking:false` | no | `1660ms`-`1740ms` | unavailable | `provider_invalid_request` |
| Current prompt, `max_tokens:128` | no | `5196ms` | `lte_5k` | `provider_json_parse_failed` |
| Compact prompt, `max_tokens:192` | yes | `5466ms` | `lte_1k` | fastest accepted result |
| Compact prompt, `max_tokens:128` | no | `5921ms` | `lte_1k` | `provider_json_parse_failed` |
| Ultra compact + JSON object, `max_tokens:128` | no | `7620ms` | `lte_1k` | `provider_json_parse_failed` |
| Post-patch compact prompt, `max_tokens:192` | yes | `10473ms` | `lte_1k` | accepted, provider variance high |

Important:

- Fast invalid requests are not useful latency wins.
- The fastest usable accepted result is `5466ms`.
- `enable_thinking:false` is not usable for this VLM request shape based on observed provider rejection.

### Phase 21-Z2G-SF: Network/Parameter Probe

| Variant | Accepted | Latency | TTFT | Outcome |
| --- | --- | ---: | ---: | --- |
| Sequential same-process fetch, compact `max_tokens:192`, warmup | yes | `8637ms` | n/a | accepted |
| Sequential same-process fetch, compact `max_tokens:192`, same process | yes | `8529ms` | n/a | accepted |
| Sequential same-process fetch, compact `max_tokens:192`, `stream:true` | yes | `9898ms` | `3979ms` | accepted after full stream |
| Ultra-short prompt, `max_tokens:80` | no | `5618ms` | n/a | `provider_json_parse_failed` / `free_form_text_detected` |
| Ultra-short prompt, `max_tokens:50` | no | `9852ms` | n/a | `provider_json_parse_failed` / `free_form_text_detected` |

Interpretation:

- Sequential same-process fetch did not materially reduce end-to-end latency.
- `stream:true` improves perceived first chunk but not full validated result latency.
- `max_tokens:80` and `50` are too low for the current strict schema.
- Request body size bucket was `lte_100kb`; upload size was not the dominant blocker in this probe.
- Custom direct `https.Agent({ keepAlive:true })` was not useful in the local environment because it returned sanitized network errors before provider responses.

## Fastest Results So Far

| Ranking | Result Type | Variant | Time | Usable? |
| ---: | --- | --- | ---: | --- |
| 1 | Fastest invalid/provider-rejected path | Ultra compact + `enable_thinking:false` | `1660ms`-`1740ms` | no |
| 2 | Fastest perceived stream first chunk | Compact `max_tokens:192`, `stream:true` | `3979ms` TTFT | partial only |
| 3 | Fastest schema-valid final output | Compact `max_tokens:192`, `stream:false` | `5466ms` | yes |
| 4 | Best same-process fetch probe | Compact `max_tokens:192`, `stream:false` | `8529ms` | yes |
| 5 | Post-patch accepted validation | Compact `max_tokens:192`, `stream:false` | `10473ms` | yes |

Decision:

- Use `5466ms` as the fastest measured accepted final-result data point.
- Use `3979ms` only as a possible future perceived-progress data point.
- Do not count invalid request latencies as wins.

## Deep Research Recommendation: Best API Connection Method

### Goal

Minimize real user-perceived latency while preserving:

- backend-only provider access,
- schema validation,
- privacy boundaries,
- no raw output leakage,
- no iOS provider key,
- no Camera live cloud AI,
- `productionReady:false` until a later rollout phase.

### Best Current Backend Connection Strategy

Recommended default:

1. Backend-mediated JavaScript / Node.js only.
2. Use Node global `fetch` or an explicit production HTTP client that supports keep-alive connection pooling.
3. Keep a warm backend worker where possible.
4. Send one image per request.
5. Use `image_url.detail:"low"`.
6. Use compact schema-enum prompt.
7. Use `max_tokens:192`.
8. Use `temperature:0.1`.
9. Use `top_p:0.8`.
10. Keep `stream:false` for the default validated result path.
11. Parse and validate the full result before returning anything user-visible.

Why:

- This is the fastest schema-valid setting already measured.
- Lower `max_tokens` failed schema.
- Streaming does not produce validated JSON earlier.
- Prompt compression reduced token bucket but did not eliminate provider/serverless latency.

### Best Future Perceived-Speed Strategy

If the product needs a faster-feeling UX without weakening schema validation:

1. Keep the provider call backend-only.
2. Optionally use `stream:true` inside backend only.
3. Do not forward raw provider chunks to iOS.
4. Backend can send safe progress states such as:
   - `queued`
   - `analyzing`
   - `validating`
   - `fallback`
   - `ready`
5. Backend returns final semantic keys only after schema validation.

This can improve perceived progress but does not currently reduce full validated latency.

### Best Future Actual-Speed Strategy

The highest-impact next experiments are architectural, not small parameter tweaks:

1. **Provider region / SLA verification**
   - Ask SiliconFlow whether a Hong Kong / South China / Asia-near route exists.
   - Verify whether paid/reserved capacity exists.
   - Verify whether endpoint routing can reduce queue time.

2. **Smaller model canary**
   - Run a bounded one-image latency canary for `Qwen/Qwen3-VL-8B-Instruct` if available.
   - Expected benefit: lower inference latency.
   - Risk: weaker Photo Advisor quality.

3. **Direct image URL vs base64 experiment**
   - Current request uses `image_url` with a safe placeholder/base64 style.
   - Base64 increases payload size.
   - A future experiment could compare short-lived backend-generated image URLs against base64.
   - Must review privacy, signed URL TTL, access logging, deletion, and no raw URL persistence first.

4. **RunPod warm-worker comparison**
   - A warm self-hosted worker may avoid serverless queue variance.
   - It may cost more but gives more control over model runtime.
   - RunPod remains fallback/comparison.

5. **Async Photo Advisor UX**
   - Treat Photo Advisor as post-capture batch/queue.
   - Show local UI immediately.
   - Show safe progress state while backend waits.
   - Store only validated semantic result.

### Lower-Impact or Blocked Tactics

| Tactic | Current Status | Recommendation |
| --- | --- | --- |
| Keep-alive / pooling | Same-process fetch did not materially improve latency | Keep in production anyway, but do not expect sub-second |
| HTTP/2 | Not tested in runtime | Only test in a separate approved transport phase |
| WebP | Not tested; provider support must be verified | Future image-format gate only |
| Binary multipart | Not current chat completions shape | Do not assume support |
| GPU resizing in iOS | Requires iOS upload-payload/runtime phase | Do not implement in this backend doc phase |
| `stream:true` | TTFT `3979ms`, final `9898ms` | Future perceived-progress only |
| `max_tokens:128` | Failed schema | Do not use |
| `max_tokens:80/50` | Failed schema | Do not use |
| `enable_thinking:false` | Provider rejected for VLM shape | Do not send |
| `response_format:{type:"json_object"}` | Did not improve tested shape | Keep disabled |

## Recommended Production-Blocked Pseudocode

This is the best connection shape for a future backend implementation, still blocked from production rollout:

```js
const baseUrl = process.env.SILICONFLOW_BASE_URL || "https://api.siliconflow.com/v1";
const endpoint = `${baseUrl.replace(/\/+$/, "")}/chat/completions`;

const requestBody = {
  model: "Qwen/Qwen3-VL-30B-A3B-Instruct",
  stream: false,
  temperature: 0.1,
  top_p: 0.8,
  max_tokens: 192,
  messages: [
    {
      role: "system",
      content: "<COMPACT_BACKEND_ONLY_SCHEMA_PROMPT>"
    },
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: "<SAFE_IMAGE_URL_OR_BASE64_PLACEHOLDER>",
            detail: "low"
          }
        },
        {
          type: "text",
          text: "<COMPACT_SCHEMA_ENUM_PROMPT>"
        }
      ]
    }
  ]
};

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify(requestBody),
  signal: AbortSignal.timeout(30000)
});

// Never log requestBody, raw image/base64, prompt, Authorization, or raw provider response.
// Parse provider text in memory only.
// Validate against backend Photo Advisor schema.
// Return semantic keys only, or safe fallback.
```

## Recommended Next Research Prompt

Use this prompt if asking another GPT/deep-research model to continue:

```text
We are building an iOS-first retro camera Photo Advisor. The provider path is backend-only JavaScript/Node.js to SiliconFlow OpenAI-compatible /chat/completions using Qwen/Qwen3-VL-30B-A3B-Instruct. iOS must never contain provider keys or direct provider calls. Product mode is post-capture/imported photo only; live camera cloud AI is blocked; productionReady:false.

Current request uses image_url detail low, compact schema-enum prompt, temperature 0.1, top_p 0.8, max_tokens 192, stream false, and backend schema validation. Raw provider text, prompts, request payloads, API keys, and raw images must not be logged or persisted.

Measured results:
- First 12-fixture run max_tokens 256: 0/12 accepted due schema invalid, latency 5s-15s.
- Prompt/schema alignment run: 13/13 accepted, latency 5s-15s x9 and >15s x4.
- Single-image fastest schema-valid result: compact prompt max_tokens 192, stream false, 5466ms.
- max_tokens 128 failed JSON parse.
- max_tokens 80 and 50 failed JSON parse/free-form text.
- enable_thinking:false was rejected for VLM request shape.
- response_format json_object did not improve acceptance in tested shape.
- stream:true gave TTFT 3979ms but full validated JSON 9898ms.
- sequential same-process fetch accepted but remained 8529ms-8637ms.
- request body size bucket was <=100KB.

Research task:
Find the fastest safe API connection strategy for this exact backend-mediated Photo Advisor path. Compare Node fetch/undici keep-alive, HTTP/2 feasibility, SiliconFlow regional routing/SLA/reserved capacity, image_url direct URL vs base64, JPEG/WebP support, smaller Qwen3-VL model canaries, and RunPod warm-worker fallback. Do not propose iOS direct provider calls, raw output streaming to app, raw logging, live camera cloud AI, upload payload changes, or production rollout. Recommend a bounded next experiment plan with call caps, safety gates, and expected latency impact.
```

## Final Recommendation

For the current SiliconFlow `Qwen/Qwen3-VL-30B-A3B-Instruct` path, the best safe connection method is:

- backend-only Node.js,
- keep process warm where possible,
- connection-pooled fetch/HTTP client,
- `image_url.detail:"low"`,
- compact schema prompt,
- `max_tokens:192`,
- `temperature:0.1`,
- `top_p:0.8`,
- `stream:false` for validated final result,
- strict backend parse/validate/fallback,
- no raw logging.

For real speed improvement beyond seconds-level, the next highest-value work is not more prompt trimming. It is a bounded architecture decision:

- verify SiliconFlow region/SLA/capacity,
- test a smaller model with one-image cap,
- compare direct URL vs base64 if privacy-approved,
- compare RunPod warm worker,
- design asynchronous Photo Advisor UX.

`productionReady:false` remains locked.
