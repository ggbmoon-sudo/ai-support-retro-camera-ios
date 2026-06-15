# Open-weight VLM Transformers FastAPI Smoke Server Setup

Status: Local operator setup guide
Date: 2026-06-15
Phase: 20-D2A

This guide prepares the local operator environment for a future Phase 20-D2B first approved Transformers + FastAPI local VLM smoke. It is documentation and local-operator prep only. It does not add a FastAPI server implementation, run Qwen2.5-VL, create local config, create fixtures, call a model, add iOS integration, add an app-facing endpoint, change payloads, train/fine-tune, or approve production rollout.

## Purpose

Phase 20-D2 remains blocked until the operator prepares three local-only pieces outside committed source:

- ignored local config
- exactly one approved ignored fixture
- a local/private Transformers + FastAPI server

Phase 20-D2A documents how to prepare those pieces safely so Phase 20-D2B can later run exactly one backend-only local smoke through the existing sandbox client and validator. Phase 20-D2E extends that setup for a MacBook + Windows GPU split: the MacBook runs Codex, Xcode, backend schema/gates, and iOS testing, while a Windows GPU machine may run the Transformers + FastAPI server on an explicitly allowed private LAN address.

## Why Transformers + FastAPI Was Selected For First Smoke

Transformers + FastAPI is the first smoke path because it is the correctness/reference path:

- close to the Hugging Face reference runtime for Qwen2.5-VL
- direct prompt and image preprocessing control
- easiest place to inspect schema-following failures without adding production serving complexity
- simpler than vLLM/SGLang for the first one-image smoke
- safer than an app-facing route because it stays local/private and operator-managed

vLLM and SGLang remain later benchmark/serving candidates. Ollama or LM Studio may be useful for manual local smoke only, not as the first automated gate.

## Hardware / Runtime Decision Tree

First model target:

- `Qwen2.5-VL-7B-Instruct`

Fallbacks if hardware is insufficient:

- `Qwen2.5-VL-3B-Instruct`
- 7B 8-bit or 4-bit local experiment, if the operator can keep all artifacts local/ignored

Decision tree:

- NVIDIA GPU with roughly 24 GB VRAM: try Qwen2.5-VL-7B-Instruct with dtype auto / BF16 / FP16.
- NVIDIA GPU around 12-16 GB VRAM: try 7B quantized, then fall back to 3B if out of memory.
- Apple Silicon: optional manual experiment only; do not block repo work or change app architecture.
- CPU only: do not run real smoke; keep Phase 20-D2 blocked and use stub/no-network gates.

Model weights, caches, Python virtual environments, and logs must stay outside committed app resources or under ignored local paths.

## Local Server Architecture

The local FastAPI server is not the app backend. It is a local operator-only model runner:

```text
backend local sandbox client
  -> POST http://127.0.0.1:<port>/local/vlm/photo-advisor
  -> or an explicitly allowed private LAN IPv4 endpoint
  -> fixtureId token only

local Transformers + FastAPI server
  -> resolves fixtureId through ignored local registry
  -> loads one approved ignored fixture
  -> runs Qwen2.5-VL locally
  -> returns candidate JSON only

existing backend validator/gate
  -> validates schema/safety/source context/retake/filter family
  -> prints sanitized aggregate only
```

Default same-machine smoke should bind only to:

```text
127.0.0.1
```

For MacBook + Windows GPU smoke, the Windows server may be reachable from the MacBook only through a private LAN IPv4 address in `10.0.0.0/8`, `172.16.0.0/12`, or `192.168.0.0/16`. The ignored MacBook config must set `allowPrivateLanModelServer:true` before that URL bucket is accepted. Prefer binding the Windows server to the specific private LAN interface. Do not use `0.0.0.0` as the client target URL, expose a tunnel, use ngrok, use HTTPS/cloud URLs, add a public endpoint, or add an app-facing backend route.

## Endpoint Contract

Required endpoint:

```text
POST /local/vlm/photo-advisor
```

Optional health endpoint:

```text
GET /healthz
```

Do not add `/v1/ai/photo-advisor`, `/v1/chat/completions`, `/upload`, `/debug/prompt`, `/debug/image`, or `/debug/raw-output` for this smoke server.

## Request Contract Using fixtureId Token

The backend sandbox client sends only a non-sensitive fixture token and contract metadata. It must not send a raw image path, base64, multipart image, raw prompt, request payload containing image data, or final UI prose.

Expected local request shape:

```json
{
  "schemaVersion": "open_weight_vlm_local_fastapi_request.v1",
  "fixtureId": "smoke_001",
  "modelId": "qwen2.5-vl-7b-instruct",
  "outputContract": "photo_advisor_vlm_candidate.v1"
}
```

`fixtureId` must be a short token only. The FastAPI server maps it to one approved ignored local fixture through the ignored fixture registry.

## Response Contract Using Candidate JSON Only

The server may return the candidate directly or under `candidate`.

The candidate must match `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`. Use the repository schema as the source of truth:

```json
{
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
```

The server must not return final UI prose, localized strings, markdown, chain-of-thought, score/rating, sensitive inference, provider/debug leakage, raw localization keys, unsupported filter families, or unknown fields.

Important Phase 20-D2G alignment note: backend validation is authoritative. The Windows FastAPI server must map model output to this exact schema before returning it to the MacBook sandbox client. Shorthand objects used in planning prompts are not accepted. Common invalid-schema buckets include:

- `allowedContext` must be a string enum such as `imageOnly` or `captureContextAvailable`, not an object.
- `visualObservationKey` is required; `observationKey` is an unsupported extra field.
- `creativeIntent` must be an object with `classification` and `preserveSignals`, not a scalar string.
- `technicalRisk` must be an object with `level` and `reasonKey`, not a scalar string.
- `safety` must be an object with the five safety fields shown above; `safetyFlags` is not accepted.
- `retakeReasonKey` is required even when its value is `null`.
- Additional unknown fields are rejected because the candidate schema is closed.

When the backend rejects a real local smoke as `invalid_schema`, it may report only sanitized buckets such as `missing_required_field`, `additional_property`, `wrong_type`, `unsupported_enum`, and field buckets such as `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, or `safety`. It must not print raw model output or raw enum values.

## Minimal Prompt Policy

Keep the local prompt short and contract-focused:

- ask for one JSON object only
- forbid markdown and explanations
- forbid final UI copy
- forbid model/provider/system/debug details
- allow only non-sensitive visual signals: light, shadow, color, contrast, grain, blur, motion softness, composition, framing, retro mood, and filter-family fit
- forbid face/skin/age/gender/emotion/identity/beauty/body/health/race/religion/disability and other sensitive inference
- forbid score/rating
- treat blur, grain, low light, tilt, faded color, soft focus, motion, high contrast, and unusual framing as possible retro creative intent
- require allowed enum values only
- if uncertain, use `mood.unknown`, `observation.unknown`, `unknown`, `original`, or `action.none` as allowed by the schema

Recommended generation settings for the first smoke:

- low temperature or deterministic decoding
- small `max_new_tokens`
- one image
- one request
- strict timeout

## JSON Repair / Rejection Policy

Allowed deterministic cleanup:

- trim whitespace
- remove a surrounding JSON code fence only if the entire output is fenced JSON
- parse exactly one top-level JSON object only if no extra prose exists
- map known local server-side model labels to the exact repo enum values before returning candidate JSON, after safety screening

Not allowed:

- LLM-based repair
- invent missing fields
- accept partial objects from the backend validator
- ask the backend validator to accept unsupported enum values
- convert prose into JSON
- hide safety violations by dropping fields
- accept chain-of-thought plus JSON

If output is still invalid, reject it and report only a sanitized category such as `invalid_json`, `schema_failed`, `unsupported_enum`, or `unsafe_response`.

## Approved Ignored Fixture Policy

Recommended ignored fixture folder:

```text
backend/tests/vlm-local-samples/
```

Recommended ignored fixture registry:

```text
backend/config/open-weight-vlm.fixtures.local.json
```

The first smoke should use exactly one fixture:

```text
fixtureId: smoke_001
```

Fixture rules:

- no user photos
- no private/sensitive content
- avoid identifiable faces if possible
- strip EXIF/GPS before use
- keep image files ignored/untracked
- do not print full local paths
- do not log image bytes or base64
- do not commit generated model output or reports

Suggested local registry shape, local-only and ignored:

```json
{
  "fixtures": {
    "smoke_001": {
      "path": "backend/tests/vlm-local-samples/smoke_001.jpg",
      "sourceType": "captured",
      "approvedForLocalSmoke": true,
      "metadataStripped": true
    }
  }
}
```

The registry shape is for the local operator server only. Do not commit the real registry.

## Ignored Config And Registry Policy

Use the committed example only as a template:

```text
backend/config/open-weight-vlm.local.example.json
```

The real local config must stay ignored:

```text
backend/config/open-weight-vlm.local.json
```

Expected local-only intent for Phase 20-D2B:

```json
{
  "enabled": true,
  "servingStack": "transformers_fastapi",
  "modelId": "qwen2.5-vl-7b-instruct",
  "modelServerUrl": "http://127.0.0.1:<port>/local/vlm/photo-advisor",
  "timeoutMs": 30000,
  "fixtureMode": "approved_local_only",
  "allowNetworkCalls": true,
  "allowPrivateLanModelServer": false,
  "fixtureId": "smoke_001"
}
```

For a Windows GPU server on private LAN, keep the real URL only in ignored local config and use a placeholder shape like:

```json
{
  "modelServerUrl": "http://192.168.1.50:8025/local/vlm/photo-advisor",
  "allowPrivateLanModelServer": true
}
```

Do not commit the real Windows IP if it identifies the operator's network. Public IPs, public domains, tunnel domains, credentialed URLs, query-string secrets, HTTPS URLs, and `0.0.0.0` remain blocked for this smoke path.

Do not commit this file. Do not include credentials, tokens, query strings, URL credentials, public URLs, private model paths, or registry secrets.

## Operator Setup Checklist

Before Phase 20-D2B:

- [ ] Repo is clean and upstream-synced.
- [ ] Synthetic benchmark passes.
- [ ] Benchmark gate has no hard blockers.
- [ ] Default local sandbox smoke passes in no-network mode.
- [ ] Ignored local config exists and passes the config dry-run.
- [ ] Ignored fixture registry exists and is untracked.
- [ ] Exactly one approved local fixture exists for `smoke_001`.
- [ ] Fixture metadata is stripped.
- [ ] Local FastAPI server binds to `127.0.0.1` only, or Windows GPU server is reachable only via explicitly allowed private LAN IPv4.
- [ ] Server access logs do not print request bodies, prompt, raw output, raw image path, base64, or stack traces with model text.
- [ ] Server returns candidate JSON only.
- [ ] No config, registry, fixture, model cache, generated report, prompt, or model output is staged.

## Phase 20-D2B Run Checklist

For the future smoke phase only:

1. Run backend tests.
2. Run synthetic benchmark.
3. Run benchmark gate.
4. Run local config dry-run against the ignored local config.
5. Run local sandbox smoke in default no-network mode.
6. Run local smoke gate.
7. Only if all gates pass, run exactly one explicit local model smoke through `--run-local-model`.
8. Review sanitized aggregate output only.
9. Stop if the candidate is invalid or unsafe; do not patch around model output silently.
10. Run secret/artifact/payload scans before any commit.

## Phase 20-D2J Accepted Smoke Record

Phase 20-D2J succeeded after the Windows FastAPI mapper was aligned to the repo candidate schema.

Sanitized record:

- Windows GPU server: Qwen2.5-VL + Transformers/FastAPI on private LAN.
- MacBook role: backend sandbox client, schema validator, smoke gate, and sanitized reporting.
- Contract echo passed before the Qwen-backed smoke.
- Qwen-backed smoke used `smoke_001` and passed validation:
  - `acceptedCount:1`
  - `rejectedCount:0`
  - `validationCode:null`
  - `fallbackCategory:null`
  - `schemaDiagnostic:null`
  - `latencyBucket:gt_15s`
  - `networkCallsMade:true`
  - `productionReady:false`
  - `hardBlockers:[]`

The Windows server implementation and patched mapper remain outside this repo. Preserve the patched server manually or move it only into a future explicitly approved operator-managed location. Do not commit Windows server logs, raw model output, raw prompts, local fixture paths, local config, fixture registry, fixture images, model weights, or generated raw reports into this iOS/backend repo.

Phase 20-E-B should expand only to a small approved ignored fixture set after explicit request. Contract echo remains required after any mapper change before Qwen-backed smoke.

## Failure Modes

| Failure mode | Safe handling |
| --- | --- |
| Missing local config | Stop; keep `networkCallsMade:false`. |
| Public model URL | Stop; fix ignored local config only. |
| Private LAN URL without opt-in | Stop; set `allowPrivateLanModelServer:true` only in ignored local config after confirming the server is private LAN only. |
| Tunnel, cloud, HTTPS, credentialed, query-string, or `0.0.0.0` URL | Stop; these are blocked for the local smoke path. |
| Fixture missing | Stop; do not print path. |
| Server unavailable | Stop; record sanitized `local_model_unavailable`. |
| Model load failure | Stop; do not retry in a loop. |
| Out of memory | Stop; reduce image tokens or use approved 3B / quantized fallback later. |
| Invalid JSON | Reject; report `invalid_json`. |
| Unsupported enum/schema | Reject; report sanitized schema category. |
| Sensitive inference/score/chain-of-thought/debug leakage | Hard reject. |
| Raw path/base64/prompt/model output in logs | Stop, delete raw artifacts, fix logging before retry. |
| Generated report appears in git status | Stop; keep reports ignored/untracked. |

## What Not To Do

- Do not start a real model in Phase 20-D2A.
- Do not add a FastAPI implementation to the app backend.
- Do not add an app-facing endpoint.
- Do not add a production endpoint.
- Do not bind to `0.0.0.0`.
- Do not use public URLs, tunnels, or cloud-hosted endpoints.
- Do not create or commit local config, fixture registry, fixture images, model outputs, or generated reports.
- Do not log raw prompt, raw model output, image/base64/path, request payload, credentials, tokens, GPS/raw EXIF, or stack traces with model text.
- Do not change backend provider request payloads.
- Do not change iOS upload payloads.
- Do not add iOS provider/model keys or direct calls.
- Do not add Camera cloud AI.
- Do not start Phase 20-E.
- Do not train/fine-tune.
- Do not set `productionReady:true`.

## Boundary Confirmations

- Backend-only local operator preparation.
- Docs-only; no runtime server was added.
- No real model was run.
- No network/model call was made.
- No local config, fixture registry, fixture image, model output, or report was created or committed.
- No app-facing endpoint or production endpoint was added.
- No iOS integration was added.
- No backend provider request payload or iOS upload payload changed.
- No capture-context upload or Camera cloud AI entry was added.
- No training/fine-tuning was added.
- `productionReady:false` remains required.
