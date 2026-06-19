# Phase 21-Z2B-SF SiliconFlow No-runtime Backend Adapter Contract Gate

Status: completed  
Date: 2026-06-20  
Phase type: backend-only no-runtime provider contract gate  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2B-SF adds the backend-only SiliconFlow Photo Advisor provider contract shape without provider runtime execution.

This phase creates inert JavaScript / Node.js contract modules, config validation, sanitized request-shape construction, OpenAI-compatible response text extraction, defensive candidate parsing, schema/fallback tests, sanitized error buckets, and a readiness CLI that fails closed.

No SiliconFlow API call was made. No API key was created or committed. No provider account was created. No provider SDK/runtime execution was added. No image upload, model call, benchmark, real inference endpoint call, RunPod provisioning, iOS runtime change, upload payload change, Camera live cloud AI entry, raw artifact, credential, or production rollout occurred.

## Provider Contract Summary

Provider and model contract decisions:

- `primaryProvider:siliconflow`
- `primaryModel:Qwen/Qwen3-VL-30B-A3B-Instruct`
- `providerMode:no_runtime_contract`
- `futureRuntimeMode:api_serverless`
- `runpodStatus:fallback_comparison`
- `productMode:post_capture_imported_photo_only`
- `liveCameraCloudAI:blocked`
- `productionReady:false`

Added backend-only provider enums:

- `local_stub`
- `local_model`
- `siliconflow`
- `runpod_self_hosted_fallback`

Added provider mode enums:

- `mock`
- `no_runtime_contract`
- `api_serverless`
- `self_hosted`

Added model candidate enums:

- `qwen3_vl_30b_a3b_instruct`
- `qwen3_vl_32b_instruct`
- `qwen3_vl_8b_instruct`
- `glm_4_5v`

## SiliconFlow JavaScript Request Shape

The operator-provided SiliconFlow API facts are recorded for future approved runtime work:

- JavaScript / Node.js is the backend implementation path.
- Base URL reference: `https://api.siliconflow.com/v1`
- Chat completions path: `/chat/completions`
- Full endpoint reference: `https://api.siliconflow.com/v1/chat/completions`
- API compatibility: OpenAI-compatible.
- Primary model ID: `Qwen/Qwen3-VL-30B-A3B-Instruct`

Z2B-SF does not execute this request shape. It only builds a sanitized placeholder object with:

- `endpointBucket:siliconflow_chat_completions`
- `baseUrlEnvName:SILICONFLOW_BASE_URL`
- `apiKeyEnvName:SILICONFLOW_API_KEY`
- `method:POST`
- `path:/chat/completions`
- `stream:false`
- `temperature:0.1`
- `top_p:0.8`
- `max_tokens:256`
- `image_url.detail:low`
- placeholder-only system prompt, user prompt, and image URL/base64 fields
- `executionAllowed:false`
- `networkCallsMade:false`
- `productionReady:false`

The request builder must not call `fetch()`, call a provider SDK, include a real endpoint at runtime, include an API key, include a real user image/base64 payload, log the prompt, log the request body, or execute network.

cURL is only a future manual smoke/reference format. Python is not the main implementation path for the backend adapter.

## Config Schema Summary

Default config:

- `provider:siliconflow`
- `enabled:false`
- `apiKeyEnvName:SILICONFLOW_API_KEY`
- `baseUrlEnvName:SILICONFLOW_BASE_URL`
- `model:Qwen/Qwen3-VL-30B-A3B-Instruct`
- `allowNetworkCalls:false`
- `allowImageUpload:false`
- `allowLiveCamera:false`
- `allowJsonModeForVlm:false`
- `maxOutputTokens:256`
- `imageDetail:low`
- `timeoutBucketOnly:true`
- `productionReady:false`

Fail-closed blockers cover enabled runtime attempts, network execution attempts, missing or unsafe env-name placeholders, raw API-key-like config fields, raw provider URL config fields, image upload enablement, live camera enablement, JSON mode enablement for VLM, production readiness flag, and unsupported provider/model values.

## Parser and Validator Strategy

The parser handles OpenAI-compatible response shape by extracting `choices[0].message.content`. It requires exactly one JSON object string, parses defensively, validates against `openWeightVlmPhotoAdvisorSchema.mjs`, returns semantic keys only, and rejects invalid schema, unsupported enums, unsupported filter families, wrong types, extra fields, free-form prose, score/rating language, sensitive inference, chain-of-thought, provider/debug leakage, raw prompt echo, retake-first wording, and imported-photo capture-context overclaim.

Valid provider output must map to:

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

Raw provider output is never printed, persisted, or shown directly to app UI/history.

## Sanitized Error Buckets

Added sanitized buckets:

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
- `provider_runtime_not_enabled`
- `provider_network_not_approved`
- `provider_benchmark_not_approved`
- `provider_upload_not_approved`

Synthetic HTTP/status/error classes map only to sanitized buckets. Reports do not include raw provider body, stack trace, provider URL, account ID, token, prompt, request payload, or model output.

## Readiness CLI Result

Added:

- `npm run qa:siliconflow:readiness`
- `npm run qa:siliconflow:contract`

The readiness CLI performs no network call and reports sanitized JSON only.

Observed default readiness result:

- `providerConfigured:false`
- `apiKeyLoaded:false`
- `keyPresenceBucket:missing`
- `networkCallsMade:false`
- `imageUploadAttempted:false`
- `benchmarkRun:false`
- `modelCallsMade:false`
- `providerRuntimeExecutionAdded:false`
- `productionReady:false`
- blockers include `provider_not_configured`, `provider_network_not_approved`, `provider_terms_unverified`, `provider_pricing_unverified`, `provider_benchmark_not_approved`, and `provider_upload_not_approved`

## Verification

Safe verification run during this phase:

- `npm run qa:siliconflow:contract` passed
- `npm run qa:siliconflow:readiness` passed fail-closed

Additional final verification scans are recorded in the phase closeout response.

## Boundary Confirmations

- Provider API calls executed: no
- Model calls executed: no
- Benchmark executed: no
- Image upload executed: no
- API keys created or committed: no
- Provider runtime execution added: no
- Provider SDK added: no
- iOS runtime changed: no
- Upload payload changed: no
- Camera live cloud AI entry added: no
- RunPod provisioned: no
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called locally: no
- vLLM/SGLang/Ollama installed/run: no
- Raw artifacts committed: no
- Secrets committed: no
- `productionReady:false`

## Recommended Next Phase

Next recommended phase:

- `Phase 21-Z2C-SF Approval Request Draft for SiliconFlow 12-fixture API Benchmark`

Scope should remain approval-draft only unless the user separately and explicitly approves provider API calls, API-key setup, image upload, and the controlled benchmark.
