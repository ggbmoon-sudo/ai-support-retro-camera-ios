# Open-weight VLM Transformers FastAPI Local Adapter

Status: Backend-only local adapter prep
Date: 2026-06-15
Phase: 20-D1

## Purpose

Phase 20-D1 selects Transformers + FastAPI as the first real-model smoke path for the open-weight VLM Photo Advisor sandbox. This path is for correctness/reference testing only. It is not an app-facing endpoint, production endpoint, rollout approval, training workflow, or iOS integration.

The default repo behavior remains synthetic/stubbed/no-network. A real local model call can only happen through the backend sandbox command when an ignored local config explicitly enables it.

## What This Phase Adds

- Documents the local Transformers + FastAPI request and response contract.
- Adds the `transformers_fastapi` local sandbox serving stack.
- Keeps `backend/config/open-weight-vlm.local.example.json` disabled with `enabled:false` and `allowNetworkCalls:false`.
- Keeps default scripts no-network.
- Allows the explicit local smoke command to call a configured local/private FastAPI endpoint only when the ignored config passes validation.
- Validates any returned candidate JSON through `openWeightVlmPhotoAdvisorSchema`.
- Emits sanitized aggregate result fields only.

## What This Phase Does Not Do

- It does not start or bundle a FastAPI server.
- It does not download model weights.
- It does not run a real VLM.
- It does not commit model server URLs, credentials, tokens, model paths, fixture images, generated reports, prompts, request payloads, or model outputs.
- It does not add iOS integration, app-facing endpoints, production endpoints, backend provider payload changes, iOS upload payload changes, capture-context upload, Camera cloud AI, training, fine-tuning, or production rollout.
- It does not set `productionReady:true`.

## Local FastAPI Server Contract

The local server must be operator-managed and outside the repo. It must be local/private only, with no public endpoint and no credentials in the URL.

The local config should point directly at the local candidate endpoint, for example a loopback URL handled outside git. The committed repo must not contain the real endpoint URL.

Required server behavior:

- use Qwen2.5-VL-7B-Instruct as the first prototype target
- load model weights outside the repo
- map a safe fixture token to an approved ignored local fixture
- strip or ignore image metadata before model inference
- never log raw image, base64, image path, prompt, request payload, model output, credentials, or stack traces containing model text
- return candidate JSON only
- return no localized UI prose
- return no score/rating
- return no sensitive inference
- return no chain-of-thought
- return no debug/provider leakage

## Request Contract

The backend sandbox client sends a minimal local-only JSON request. It does not send an image path, image bytes, base64, raw prompt, final UI prose, or capture context.

```json
{
  "schemaVersion": "open_weight_vlm_local_fastapi_request.v1",
  "fixtureId": "local_smoke_fixture",
  "modelId": "qwen2.5-vl-7b-instruct",
  "outputContract": "photo_advisor_vlm_candidate.v1"
}
```

`fixtureId` must be a short non-sensitive token. The local FastAPI server is responsible for mapping that token to exactly one approved ignored local fixture.

## Response Contract

The FastAPI server may return the candidate directly or wrap it in a `candidate` field.

```json
{
  "candidate": {
    "schemaVersion": "photo_advisor_vlm_candidate.v1",
    "sourceType": "captured",
    "allowedContext": "imageOnly",
    "moodKey": "mood.low_light_night",
    "visualObservationKey": "observation.low_light",
    "creativeIntent": {
      "classification": "style_positive",
      "preserveSignals": ["low_light"]
    },
    "technicalRisk": {
      "level": "none",
      "reasonKey": null
    },
    "filterFamilyCandidate": "night_grain",
    "optionalActionKey": "action.keep_style",
    "retakeAllowed": false,
    "retakeReasonKey": null,
    "safety": {
      "sensitiveInferenceDetected": false,
      "forbiddenInferenceTypes": [],
      "scoreOrRatingDetected": false,
      "chainOfThoughtDetected": false,
      "debugLeakageDetected": false
    }
  }
}
```

The backend validator rejects free-form prose, markdown, chain-of-thought, score/rating, sensitive inference, provider/debug leakage, unsupported filter families, imported-context overclaim, retake false positives, raw localization key leakage, and unsupported fields.

## Local Config

The committed example remains disabled:

```json
{
  "enabled": false,
  "servingStack": "transformers_fastapi",
  "modelId": "qwen2.5-vl-7b-instruct",
  "modelServerUrl": "http://127.0.0.1:8000",
  "timeoutMs": 30000,
  "fixtureMode": "approved_local_only",
  "allowNetworkCalls": false,
  "fixtureId": "local_smoke_fixture"
}
```

The real config must stay ignored at `backend/config/open-weight-vlm.local.json`. It may set `enabled:true` and `allowNetworkCalls:true` only for an approved local smoke run.

## Safe Command Flow

Default no-network checks:

```sh
cd backend
npm test
npm run qa:open-weight-vlm:synthetic
npm run qa:open-weight-vlm:gate
npm run qa:open-weight-vlm:local-config
npm run qa:open-weight-vlm:local-smoke
npm run qa:open-weight-vlm:local-smoke-gate
```

The explicit local model command remains operator-only:

```sh
cd backend
npm run qa:open-weight-vlm:local
```

This command still fails closed unless the ignored local config is present, enabled, network opt-in is true, the serving stack is `transformers_fastapi`, the model URL validates as local/private, the fixture mode is `approved_local_only`, the fixture token is configured, and the local server returns valid structured candidate JSON.

## Sanitized Output

Allowed output fields include:

- `runMode`
- `servingStack`
- `modelId`
- `fixtureCount`
- `acceptedCount`
- `rejectedCount`
- `validationCode`
- `fallbackCategory`
- `latencyBucket`
- `productionReady:false`
- `networkCallsMade`

Forbidden output remains:

- raw prompt
- raw model response
- raw image or base64
- raw image path
- full model server URL
- request payload
- credentials or tokens
- GPS/raw EXIF
- chain-of-thought
- generated unsanitized reports

## Phase 20-D Readiness

Phase 20-D remains blocked until the operator prepares:

- ignored local config
- one approved ignored local fixture
- local/private FastAPI server
- passing synthetic benchmark and gate
- passing default local smoke
- passing local smoke gate

For local server setup details, use `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`. That guide defines the first model target, loopback-only endpoint, `fixtureId` request style, ignored fixture registry policy, `smoke_001` first fixture token, and candidate-JSON-only response contract.

Passing Phase 20-D1 does not approve production rollout. `productionReady:false` remains required.
