# Backend Internal VLM Gateway Contract Preflight

Status: Phase 21-A contract preflight plus Phase 21-B adapter stub alignment

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-A defines the backend-internal VLM gateway contract for future self-hosted / open-weight Photo Advisor integration. It is a contract and preflight gate only. It does not expose an app-facing endpoint, does not add a production endpoint, does not connect iOS, does not accept real user-photo upload, does not run Qwen inference, and does not run a serving benchmark.

The gateway contract keeps the app repo as the source of truth for request shape, candidate schema, validation, safety, fallback, docs, and tests. The external Windows VLM server remains a private local model-provider sandbox only.

## Why Phase 21 Starts Backend-internal Only

The Phase 20 local/private sandbox proved that approved fixture tokens can produce structured candidates accepted by the backend validator. It did not prove product readiness, privacy readiness, retention/deletion readiness, app consent readiness, latency readiness, or endpoint readiness.

Phase 21 therefore starts with an internal gateway contract instead of product integration. The goal is to define the backend boundary before any future upload, endpoint, or app-facing feature exists.

## Gateway Responsibility

The internal gateway may eventually coordinate:

- sanitized backend-internal request metadata
- adapter/provider selection
- fixture-token sandbox routing
- structured candidate response normalization
- existing VLM candidate validation
- safety and fallback mapping
- language-pack / UI handoff through app-owned keys

The gateway must not bypass the existing validator. It must treat `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs` as the source of truth for candidate JSON.

## Non-goals

Phase 21-A does not:

- run real model smoke
- run Qwen inference
- run vLLM, SGLang, Ollama, or LM Studio
- run a serving benchmark
- start iOS integration
- add an app-facing endpoint
- add a production endpoint
- accept real user-photo upload
- add consent UI
- change iOS upload payloads
- upload capture context
- train or fine-tune
- commit local config, fixture images, registries, raw reports, prompts, model output, logs, weights, or credentials
- weaken smoke, repeatability, failure, provider, routing, or validator gates

## Request Contract

The request is backend-internal only:

```json
{
  "schemaVersion": "open_weight_vlm_gateway_request.v1",
  "requestIdBucket": "synthetic_request_bucket",
  "sourceType": "captured | imported | synthetic_local_fixture",
  "fixtureId": "configured",
  "allowedContext": "captureContextAvailable | imageOnly | unknown",
  "languageCode": "en | zh-Hant | zh-Hans | yue-Hant-HK",
  "advisorMode": "post_capture_photo_advisor",
  "outputContractVersion": "photo_advisor_vlm_candidate.v1",
  "productionReady": false
}
```

Allowed sandbox inputs:

- request ID bucket only
- source type bucket
- optional fixture token for sandbox mode
- allowed context bucket
- language code
- advisor mode
- output contract version
- `productionReady:false`

Forbidden request inputs:

- raw image bytes
- base64
- raw file path
- GPS/location
- raw EXIF
- raw sensor values
- raw prompt
- provider secrets
- provider/model URLs
- direct iOS provider fields
- app-facing endpoint flags
- production endpoint flags

## Future Real Upload Is Blocked

Future real upload is not implemented in Phase 21-A. Before any future real user-photo upload can exist, a later explicit phase must define and implement:

- explicit user consent
- image compression and size limits
- metadata stripping
- retention and deletion policy
- privacy policy and App Store disclosure updates
- abuse, quota, and rate-limit controls
- backend-only provider routing
- no raw payload logging

## Response Contract

The gateway response is structured candidate JSON plus `productionReady:false`. The preflight strips only that gateway wrapper flag before passing the candidate into the existing open-weight VLM validator.

```json
{
  "schemaVersion": "photo_advisor_vlm_candidate.v1",
  "sourceType": "captured | imported | synthetic | internal",
  "allowedContext": "captureContextAvailable | imageOnly | unknown",
  "moodKey": "mood.warm_calm",
  "visualObservationKey": "observation.warm_indoor_light",
  "creativeIntent": {
    "classification": "style_positive | acceptable_imperfection | technical_risk | unknown",
    "preserveSignals": []
  },
  "technicalRisk": {
    "level": "none | mild | moderate | severe_unusable",
    "reasonKey": null
  },
  "filterFamilyCandidate": "warm_film",
  "optionalActionKey": "action.try_filter_first",
  "retakeAllowed": false,
  "retakeReasonKey": null,
  "safety": {
    "sensitiveInferenceDetected": false,
    "forbiddenInferenceTypes": [],
    "scoreOrRatingDetected": false,
    "chainOfThoughtDetected": false,
    "debugLeakageDetected": false
  },
  "productionReady": false
}
```

The gateway must never return:

- score/rating
- sensitive inference
- chain-of-thought
- debug/provider leakage
- raw provider response
- raw model output
- raw prompt
- request payload
- final free-form UI prose

## Adapter / Provider Abstraction

The future adapter boundary should map provider output into candidate JSON only. Provider-specific details must stay behind the backend boundary and must not appear in iOS, UI copy, reports, or committed docs.

Allowed adapter output is a candidate object that can pass the existing validator. Adapter metadata may be summarized only as sanitized buckets in internal reports.

## Validation Chain

Phase 21-A defines this chain:

1. Gateway request shape validation.
2. Raw artifact / secret / direct-iOS-provider-field rejection.
3. `productionReady:false` lock.
4. Structured candidate-only response check.
5. Existing open-weight VLM candidate validator.
6. Safety and fallback gate.
7. Language-pack / UI handoff through keys only.

## Safety / Fallback Chain

Any invalid, unsafe, leaky, overclaiming, unsupported, or production-flagged candidate must be blocked before app-facing use. Future runtime behavior should map those blocks to structured fallback, not raw provider text.

Existing gate families remain required:

- synthetic benchmark
- benchmark gate
- local config dry-run
- default no-network local smoke
- local smoke gate
- expanded fixture registry dry-run
- provider integration diagnostic
- fixture routing echo
- repeatability gate
- failure taxonomy gate
- serving benchmark preflight
- gateway contract preflight

## Language-pack / UI Handoff Boundary

The gateway does not create final visible prose. It returns enum/key candidate fields that the app-owned language pack and result card can render later. Production UI must not show provider names, raw JSON, raw localization keys, raw capture context, raw EXIF, raw sensor values, numeric confidence, score, rating, debug fields, or internal classifications.

## Privacy / Logging Rules

Do not print, persist, commit, or return:

- raw image data
- base64
- raw paths
- raw prompts
- request payloads
- raw provider responses
- raw model output
- local config contents
- fixture registry contents
- server logs
- GPS/location
- raw EXIF
- Authorization headers
- provider/model credentials

Allowed output is sanitized aggregate or bucket-only contract status.

## Production Blockers

Production rollout remains blocked by:

- no app-facing endpoint
- no production endpoint
- no consent UI for self-hosted VLM upload
- no real upload policy
- no retention/deletion implementation
- no App Store privacy disclosure update
- no serving benchmark execution
- unresolved latency planning
- no quota/abuse/cost controls for VLM use
- no production approval

## Future Phase 21-B / 21-C Candidates

Recommended next options:

- Phase 21-B: backend-internal gateway adapter skeleton, still no-network/no-model by default.
- Phase 21-C: sandbox gateway dry-run using fixture tokens only, still no app-facing endpoint and no iOS integration.

Do not start iOS integration, endpoint rollout, real user-photo upload, or production cloud AI without a later explicit phase prompt.

## Phase 21-B Adapter Stub Alignment

Phase 21-B implements the Phase 21-A contract as a backend-internal adapter stub:

- request validation uses the Phase 21-A internal gateway request contract
- adapter mode is fixture-token sandbox only
- raw image/base64/path/GPS/raw EXIF/raw sensor/prompt/provider secret/direct iOS fields remain blocked
- adapter output is structured candidate JSON only
- candidate JSON passes through `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`
- CLI output is sanitized aggregate only
- default adapter stub behavior makes no network call and no model call

Phase 21-B also allows the external local VLM server workspace to expose a no-model `/local/vlm/gateway-contract-echo` compatibility endpoint. That endpoint is not an app backend, not a production endpoint, not an iOS integration, and not a model inference path. It must report `modelInferenceRun:false`, `rawLoggingDisabled:true`, `publicExposure:no`, raw persistence flags false, and `productionReady:false`.

Commands:

```sh
npm run qa:open-weight-vlm:gateway-adapter-stub
npm run qa:open-weight-vlm:gateway-external-contract-echo
```

The external echo command may use local/private HTTP only and must fail closed on public/cloud/tunnel exposure, raw logging, raw persistence, model inference, free-form response text, invalid candidate JSON, or `productionReady:true`.

## ProductionReady Boundary

`productionReady:false` is mandatory for Phase 21-A and every generated report. Passing this preflight only means the backend-internal gateway contract is reviewable for future planning. It is not product readiness, iOS readiness, endpoint readiness, privacy readiness, latency readiness, or production approval.
