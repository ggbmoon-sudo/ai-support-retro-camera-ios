# Phase 21-Z2A-SF SiliconFlow Qwen3-VL API Research and Model Selection Gate

Status: completed
Date: 2026-06-20
Phase type: docs-only research consolidation and model-selection gate
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2A-SF consolidates two operator-provided external research drafts for the API-first VLM direction after Phase 21-Z-R1.

Inputs incorporated:

- `Phase 21Z2ASF Research Report_SiliconFlow Qwen3VL API Deployment and Model Selection Plan v1.md`
- `Phase 21Z2ASF Research Report_SiliconFlow Qwen3VL API Deployment and Model Selection Plan v2.md`

Consolidation stance:

- Use v1 as the conservative master source.
- Merge v2 model-page, cost, and deployment-planning details only when they do not weaken safety.
- Treat v2 claims about JSON mode, pricing, retention, no-training, account requirements, and region behavior as planning inputs that require official re-verification before any benchmark or beta.

This phase is documentation only. It does not implement a provider runtime, call SiliconFlow, create an API key, create a provider account, upload images, run a benchmark, call an inference endpoint, provision RunPod, change iOS runtime, or change upload payloads.

## Final Recommendation

Proceed to a backend-only no-runtime contract gate for SiliconFlow before any live API use.

Recommended next engineering phase:

- `Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate`

Do not approve a SiliconFlow benchmark yet. The next phase should define provider config shapes, request builders, parser tests, error buckets, schema/fallback tests, and safety scans without API credentials or network execution.

## Final Provider and Model Decision

| Field | Decision |
| --- | --- |
| `primaryProvider` | `siliconflow` |
| `primaryModel` | `Qwen/Qwen3-VL-30B-A3B-Instruct` |
| `providerMode` | `api_serverless` |
| `runpodStatus` | `fallback_comparison` |
| `productMode` | `post_capture_imported_photo_only` |
| `liveCameraCloudAI` | `blocked` |
| `productionReady` | `false` |

SiliconFlow is the primary API-first provider direction. RunPod A100 80GB remains a self-hosted fallback/comparison path, not removed.

## Model-page Facts to Recheck Before Runtime

The operator-provided v2 research draft reports that the SiliconFlow model page currently indicates the following for `Qwen/Qwen3-VL-30B-A3B-Instruct`:

| Field | Reported value |
| --- | --- |
| Model id | `Qwen/Qwen3-VL-30B-A3B-Instruct` |
| Status | Available |
| Architecture | Vision-Language MoE |
| Total parameters | 30B |
| Activated parameters | 3B |
| Precision | FP8 |
| Context length | 262K |
| Max output length | 262K |
| Serverless | Supported |
| Image input | Supported |
| JSON mode | Supported on model page |
| Structured output | Not supported |
| Tool support | Supported |
| Input price on model page | `$0.29 / M tokens` |
| Output price on model page | `$1.0 / M tokens` |

Important caveat:

- These are recorded as model-page research facts from the operator-provided draft, not billing-verified runtime facts.
- Pricing, availability, context limits, JSON behavior, structured-output behavior, and tool support must be rechecked from official provider materials or provider console before any API call, benchmark, beta, or purchase decision.

## JSON and Structured-output Caveat

The engineering stance must remain conservative:

- Provider output is untrusted.
- Do not trust provider JSON mode alone.
- Structured output is not supported for this model according to the recorded model-page fact.
- SiliconFlow documentation around VLM JSON behavior may be inconsistent or limited.
- Optional JSON mode can be added later only behind a safe feature flag.
- Use strict prompt constraints.
- Parse JSON defensively.
- Validate against the existing backend Photo Advisor schema.
- Fall back if the provider output is invalid, unsafe, free-form, overlong, score/rating-based, sensitive, or provider/debug-leaking.

Recommended initial setting:

- prompt-only JSON plus backend parser/validator
- `siliconFlowJsonModeForVlmExperimental:false`
- no tool/function calling for the first Photo Advisor benchmark

## SiliconFlow Multimodal Request Facts

The consolidated research records these no-runtime request-shape facts:

- SiliconFlow multimodal models use `/chat/completions`.
- Message content can include text and `image_url`.
- `image_url.url` supports URL or base64.
- `image_url.detail` supports `auto`, `low`, and `high`.
- For 512px-class Photo Advisor, `detail:"low"` should be the first benchmark setting.
- `stream:false` is preferred for the first controlled benchmark.
- Future `max_tokens` should be small and bounded, likely around 256 for candidate JSON.

Boundary requirements:

- No raw image logging.
- No base64 logging.
- No request-payload logging.
- No raw prompt logging.
- No raw provider response logging.
- No direct iOS upload to SiliconFlow.
- Backend-mediated only.

Placeholder-only future request shape:

```json
{
  "model": "Qwen/Qwen3-VL-30B-A3B-Instruct",
  "stream": false,
  "temperature": 0.1,
  "top_p": 0.8,
  "max_tokens": 256,
  "messages": [
    {
      "role": "system",
      "content": "<PHOTO_ADVISOR_SYSTEM_PROMPT_PLACEHOLDER>"
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
          "text": "<PHOTO_ADVISOR_PROMPT_PLACEHOLDER>"
        }
      ]
    }
  ]
}
```

This placeholder is not executable and contains no provider URL, API key, real image, raw prompt, request payload, or credential.

## Primary Model

Primary target:

- `Qwen/Qwen3-VL-30B-A3B-Instruct`

Rationale:

- Product decision narrowed the provider/model direction to SiliconFlow plus Qwen3-VL-30B-A3B-Instruct.
- Qwen3-VL MoE architecture fits the latency/quality trade-off target better than the current local Transformers+FastAPI correctness baseline.
- Vision-language capability is aligned with Photo Advisor mood/composition/filter-family extraction.
- Serverless API delivery is operationally simpler than self-hosted RunPod for early post-capture/imported-photo workloads if privacy, cost, latency, and quality gates pass.

Remaining blockers before runtime:

- SiliconFlow account feasibility.
- Exact model availability at time of benchmark.
- Current pricing and billing behavior.
- HK/TW/KR latency.
- Rate limits and quota.
- Data retention/training terms.
- Provider JSON behavior for VLM.
- Schema/safety/fallback behavior under real responses.

## Alternative Model Shortlist

Primary:

- `Qwen/Qwen3-VL-30B-A3B-Instruct`

Benchmark alternatives:

1. `Qwen/Qwen3-VL-32B-Instruct`
   - Include only if SiliconFlow availability and pricing are verified at benchmark time.
   - Potential cheaper/quality challenger.
   - Speed unknown until benchmark.

2. `Qwen/Qwen3-VL-8B-Instruct`
   - Include only if SiliconFlow availability and pricing are verified.
   - Potential faster/cheaper baseline.
   - Quality may be weaker for subtle Photo Advisor mood/composition decisions.

3. `zai-org/GLM-4.5V`
   - Keep as a cross-family fallback/challenger.
   - Not first comparison unless Qwen alternatives are blocked.
   - Language, safety, and schema behavior must be benchmarked.

## Models to Exclude

Exclude from the first Photo Advisor benchmark:

- PaddleOCR-VL for Photo Advisor mood/composition.
- OCR-only/document models.
- Text-only Qwen models.
- Unverified InternVL variants unless exact model id, pricing, and token behavior are later verified.
- Unverified DeepSeekVL2 variants unless exact model id, pricing, and token behavior are later verified.

Reasoning:

- Photo Advisor needs mood, composition, retro intent, and safe semantic keys, not document OCR extraction.
- Token math and provider availability must be predictable before benchmark approval.
- Each added model increases cost/latency/privacy analysis scope and must be separately approved.

## Prompt and Validator Strategy

Prompt class:

- Generate a backend Photo Advisor candidate only.
- Return exactly one JSON object.
- No Markdown.
- No prose outside JSON.
- No score or rating.
- No face, skin, age, gender, attractiveness, emotion, health, identity, ethnicity, religion, disability, sexuality, body, or protected/sensitive inference.
- No chain-of-thought.
- No provider, model, prompt, image path, debug, or internal detail leakage.
- Do not write final UI copy.
- Use semantic keys only.

Backend validator remains source of truth. Provider output must map into:

- `schemaVersion`
- `sourceType`
- `allowedContext`
- `moodKey`
- `visualObservationKey`
- `creativeIntent`
- `technicalRisk`
- `filterFamilyCandidate`
- `optionalActionKey`
- `retakeAllowed`
- `retakeReasonKey`
- `safety`

Reject:

- invalid JSON
- missing required field
- extra property
- unsupported enum
- wrong type
- free-form prose
- score/rating
- sensitive inference
- identity/age/gender/attractiveness/emotion/health/ethnicity/religion/disability inference
- chain-of-thought
- debug/provider leakage
- raw prompt echo
- unsupported filter family
- retake-first language
- capture-context overclaim

User-visible app UI must use language-pack-driven output. Raw provider output must never go directly to UI or history.

## Backend-only Adapter Implications

Future adapter name:

- `SiliconFlowPhotoAdvisorProvider`

Contract:

- API key from `process.env.SILICONFLOW_API_KEY` only.
- No API key in iOS.
- No provider URL in iOS.
- No direct iOS provider call.
- No raw provider output shown to app.
- Parse provider text.
- Parse JSON.
- Validate against existing Photo Advisor schema.
- Reject invalid/unsafe output.
- Return semantic keys / language-pack-driven result only.

Future no-runtime Z2B-SF should include:

- provider enum / adapter type definitions
- SiliconFlow provider config schema
- request builder that does not execute network calls
- response parser tests using synthetic strings only
- sanitized error bucket mapper
- schema validation/fallback tests
- readiness script that fails closed when API key is absent
- scans proving no raw logging and no iOS provider leakage

## Sanitized Error Buckets

Future adapter and tests should use these sanitized buckets:

- `provider_timeout`
- `provider_rate_limited`
- `provider_auth_failed`
- `provider_quota_exceeded`
- `provider_network_error`
- `provider_invalid_response`
- `provider_json_parse_failed`
- `provider_schema_invalid`
- `provider_safety_rejected`
- `provider_model_unavailable`
- `provider_image_too_large`
- `provider_unsupported_image_format`
- `provider_budget_cap_reached`
- `provider_disabled`
- `provider_not_configured`
- `provider_region_latency_unknown`
- `provider_pricing_unverified`
- `provider_terms_unverified`

Do not expose raw provider HTTP bodies, provider URLs, keys, model outputs, prompts, payloads, stack traces, or account details in app-facing errors.

## Cost Model

Pricing caveat:

- The operator-provided v2 draft reports model-page pricing for `Qwen/Qwen3-VL-30B-A3B-Instruct` as `$0.29 / M input tokens` and `$1.0 / M output tokens`.
- Treat this as a model-page estimate, not billing-verified truth.
- Production pricing must be rechecked before benchmark or beta.

Token assumptions:

- `detail:"low"`: about 256 visual tokens for a Qwen-series 512px-class image.
- `detail:"high"`: around 361 tokens for a 512px-class square image using the 28-grid formula.
- Prompt tokens must be measured later.
- Output tokens must be measured later.
- Failed/invalid response overhead must be measured later.

Formula:

```text
estimatedCostPerImage =
  (imageInputTokens + promptInputTokens) * inputPricePerToken
  + outputTokens * outputPricePerToken
```

Illustrative estimate only, using v2 model-page price and a 512px low-detail assumption:

| Scenario | Formula inputs | Estimate status |
| --- | --- | --- |
| Cost per image | image tokens + prompt tokens + output tokens | model-page estimate; not billing verified |
| Cost per 1,000 accepted images | cost per accepted image * 1,000 plus invalid/fallback overhead | requires measured acceptance and failure rate |
| Cost per 10,000 accepted images | cost per accepted image * 10,000 plus invalid/fallback overhead | requires measured acceptance and failure rate |
| Cost per 100,000 accepted images | cost per accepted image * 100,000 plus invalid/fallback overhead | requires measured acceptance and failure rate |
| Debug session 5-20 images | cost per image * 5-20 | planning estimate only |
| Live 0.8 FPS | warning only | not approved, not product mode |

Do not use this phase to create accounts, verify billing through console, call APIs, or run benchmark cost measurements.

## HK/TW/KR Latency Considerations

Initial user regions:

- Korea
- Taiwan
- Hong Kong

Future benchmark and provider checks must capture:

- HK latency bucket
- TW latency bucket
- KR latency bucket
- p50/p95 provider response latency
- p50/p95 result-ready time
- provider timeout count
- rate-limit / quota bucket
- queue/wait bucket if a backend queue is introduced

Official public region-specific endpoint or edge-node behavior was not treated as verified in this consolidation. Any claim about favorable HK/TW/KR routing must be measured later.

## Privacy, Legal, and Data-governance Risks

No legal conclusion is granted by this phase.

API-first means user images become third-party API interaction data. Before beta or real user-photo upload, the project must verify:

- provider terms
- provider privacy policy
- whether inputs/outputs are stored
- whether data may be used for training
- retention/deletion behavior
- support access process
- data residency and cross-border transfer for Korea/Taiwan/Hong Kong
- minors/children policy
- privacy policy disclosures
- App Store privacy disclosure
- explicit user consent

Important weakening of v2 claims:

- Any v2 claim that no storage or no training is confirmed is recorded only as a research-draft report.
- The safe project wording is: reported by research draft but requires legal/privacy verification before beta.
- Do not assume no-training/no-retention until exact official source text is reviewed and accepted for the project.

Backend privacy requirements:

- backend-only provider call
- no iOS provider key
- no direct iOS provider call
- no raw image/base64 logging
- no raw prompt logging
- no raw output logging
- no request-payload logging
- no raw provider response logging
- no GPS/raw EXIF/sensor persistence
- no sensitive inference
- no score/rating

## Product Mode Decision

Allowed future API-first product mode:

- post-capture Photo Advisor
- imported-photo Photo Advisor

Possible later debug mode:

- debug-only still snapshot advisor after separate approval

Blocked by default:

- live camera cloud AI
- 0.8 FPS viewfinder upload
- silent upload
- WSS live runtime
- Auto-Trigger runtime
- background upload
- capture-context upload
- production endpoint
- app-facing provider endpoint

If sparse live analysis is ever reconsidered, it requires a separate policy phase with compression/downscale policy, consent/off-state behavior, backoff, rate limiting, abuse prevention, cost cap, and explicit approval.

## Future Benchmark Plan

Benchmark is not approved in Phase 21-Z2A-SF.

Future primary benchmark, if explicitly approved:

- provider: SiliconFlow
- model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- fixtures: `smoke_004` through `smoke_015`
- call count: `12`
- retry: `0`
- backend-mediated only
- no iOS integration
- no live camera upload
- no raw image/base64/prompt/provider response/request payload logging
- sanitized aggregate report only
- `productionReady:false`

Future alternative model benchmark candidates:

- `Qwen/Qwen3-VL-32B-Instruct`
- `Qwen/Qwen3-VL-8B-Instruct`
- optionally `zai-org/GLM-4.5V` as cross-family challenger

Exact model set, call counts, budget cap, and credentials/network approval require a separate future phase.

## Risks and Unknowns

| Risk | Status | Required mitigation |
| --- | --- | --- |
| Exact model availability | reported available by v2 model-page draft; must recheck | verify before benchmark |
| Pricing | model-page estimate only | billing verification before benchmark/beta |
| JSON mode for VLM | inconsistent/limited | do not trust; parse/validate/fallback |
| Structured output | recorded as not supported | backend schema remains source of truth |
| HK/TW/KR latency | unknown | future regional latency measurement |
| No-training/no-retention | not assumed | legal/privacy verification |
| Rate limits | unknown for project account | account/pricing/terms gate |
| API key handling | future backend-only | no iOS key, no committed key |
| Raw artifact leakage | blocked by policy | scans and tests before runtime |
| Live camera scope creep | blocked | separate policy/approval required |

## Recommended Next Engineering Phase

`Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate`

Scope:

- backend-only
- no API call
- no API key
- no provider account creation
- no image upload
- no benchmark
- no iOS integration
- no production endpoint
- `productionReady:false`

Expected Z2B-SF work:

- provider enum / adapter type definitions
- SiliconFlow provider config schema
- error bucket mapper
- request builder that does not execute network calls
- response parser tests using synthetic strings only
- schema validation/fallback tests
- readiness script that fails closed when API key is absent
- scans for no raw logging
- scans for no iOS provider leakage

## Codex Handoff Summary

- Primary provider: `siliconflow`
- Primary model: `Qwen/Qwen3-VL-30B-A3B-Instruct`
- Provider mode: `api_serverless`
- Product mode: `post_capture_imported_photo_only`
- RunPod status: `fallback_comparison`
- Live camera cloud AI: `blocked`
- JSON mode: optional future flag only; do not trust alone
- Structured output: recorded as not supported for primary model
- Adapter name: `SiliconFlowPhotoAdvisorProvider`
- Future benchmark status: not approved
- Next phase: `Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate`
- Provider API calls executed in this phase: no
- API key created/committed in this phase: no
- Model calls executed in this phase: no
- Benchmark executed in this phase: no
- Provider SDK/runtime added in this phase: no
- iOS runtime changed in this phase: no
- Upload payload changed in this phase: no
- `productionReady:false`
