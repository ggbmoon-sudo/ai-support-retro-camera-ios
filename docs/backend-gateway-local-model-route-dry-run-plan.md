# Backend Gateway Local Model Route Dry-run Plan

Status: Phase 21-H controlled dry-run plan only

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-H defines the controlled dry-run plan for a future backend `local_model` provider route test. It is planning and policy validation only. It does not enable `local_model`, call Qwen, run model inference, run fixture inference, run a serving benchmark, add iOS integration, add an app-facing endpoint, add a production endpoint, or accept real user-photo upload.

The new dry-run plan gate validates future plan objects only:

```sh
npm run qa:open-weight-vlm:local-model-route-dry-run-plan
```

The CLI is no-network, no-model, no-Qwen, no-benchmark, and prints sanitized buckets only.

## Why `local_model` Remains Disabled

The Windows local/private VLM server is a backend sandbox, not the production backend and not an app-facing service. A real `local_model` route would introduce model calls, provider latency, fixture governance, healthz trust, raw artifact risk, and future privacy obligations. Those responsibilities require a separate explicit approval phase.

Phase 21-H therefore keeps the route disabled and validates only the shape of a future dry-run plan.

## What Phase 21-G Approved / Did Not Approve

Phase 21-G approved a no-network approval gate for reviewing future `local_model` prerequisites.

Phase 21-G did not approve:

- route enablement
- Qwen inference
- fixture inference
- serving benchmark execution
- iOS integration
- app-facing endpoints
- production endpoints
- real user-photo upload
- auth, billing, quota, or production runtime
- `productionReady:true`

## Future One-call Route Test Shape

A future explicitly approved phase may run a first `local_model` route test only with this shape:

- backend-internal only
- local/private only
- route: `local_model`
- source type: `synthetic_local_fixture`
- fixture count: `1`
- fixture token: explicitly declared in that future phase
- one call only
- no retries
- no real user photo
- no iOS integration
- no app-facing endpoint
- no production endpoint
- structured candidate JSON only
- backend validator remains source of truth
- fallback/safety chain mandatory
- raw persistence flags remain false
- `networkCallsMade:true` only for the approved local/private backend-to-provider call
- `modelCallsMade:true` only in that future explicitly approved phase
- `qwenInferenceRun:true` only in that future explicitly approved phase
- `productionReady:false`

No broader 12-fixture run should occur until the one-call result passes review.

## Fixture Scope Rules

The first future route test must use one declared fixture token only. The token must be non-sensitive, approved in that future phase, metadata-stripped, local/private, ignored, and unstaged.

Blocked fixture scopes:

- multi-fixture plans
- missing fixture token scope
- real user photos
- raw image paths
- base64 or multipart image payloads from this repo
- committed local fixture registries
- committed fixture images

## Healthz Requirements

Before a future one-call test, healthz evidence must be sanitized and safe:

- server is local/private only
- `publicExposure:no`
- `rawLoggingDisabled:true`
- model-loaded status is bucketed only
- no raw server logs
- no raw prompt, model output, image path, base64, request payload, local config, registry contents, EXIF, GPS, or provider response text

## Config / Env Requirements

Before a future one-call test:

- repo is clean
- upstream comparison is `0 0`
- local model route approval gate passes
- deployment config/env preflight passes
- cross-platform boundary gate passes
- provider routing gate passes
- provider adapter no-model HTTP gate passes
- local config remains ignored
- fixture registry remains ignored
- fixture images remain ignored
- no staged local configs, fixture registries, fixtures, reports, logs, prompts, model outputs, request payloads, credentials, or weights

## Provider Routing Requirements

The future plan must require the route to remain disabled until explicit approval. Provider routing must be backend-internal, local/private, and structured-candidate-only. `local_model` must not become an allowed route through default config, iOS config, app-facing routing, production routing, or committed runtime config.

## Validator / Safety Requirements

The backend validator remains authoritative. The future route may return only structured candidate JSON and must pass:

- gateway response contract checks
- open-weight VLM candidate schema validation
- safety/fallback gate
- score/rating rejection
- sensitive inference rejection
- chain-of-thought rejection
- debug/provider leakage rejection
- unsupported enum/filter rejection
- raw artifact leakage rejection

Validator bypass and fallback/safety bypass are stop conditions.

## Raw Artifact Policy

Do not print, persist, commit, or include in reports:

- raw prompt
- raw model output
- raw provider response
- raw request payload
- raw image path
- base64 image data
- fixture registry contents
- local config contents
- server logs
- EXIF or GPS
- credentials, Authorization headers, model keys, API keys, tokens, or secrets

Allowed output is sanitized buckets and aggregate booleans only.

## Stop Conditions

Stop before any future model call if:

- repo is dirty or upstream is not `0 0`
- local config, registry, fixtures, reports, logs, prompts, model outputs, request payloads, credentials, or weights are staged
- healthz is unsafe
- `publicExposure` is not `no`
- `rawLoggingDisabled` is not true
- endpoint is public, cloud, tunnel, ngrok, or production
- `productionReady:true`
- iOS direct provider/model call appears
- Camera cloud AI entry appears
- backend/iOS payload drift appears
- app-facing endpoint appears
- production endpoint appears
- real user-photo upload appears
- consent, retention, or deletion policy is missing for future real upload
- validator is bypassed
- fallback/safety is bypassed
- raw prompt/model output/request/image path/base64 logging would occur

## Failure Taxonomy

The dry-run plan gate uses sanitized blocker buckets:

- `blocked_for_local_model_route_enabled`
- `blocked_for_multi_fixture_plan`
- `blocked_for_missing_fixture_token_scope`
- `blocked_for_retry_enabled`
- `blocked_for_unsafe_healthz_requirement`
- `blocked_for_public_exposure`
- `blocked_for_raw_artifact_policy`
- `blocked_for_validator_bypass`
- `blocked_for_fallback_safety_bypass`
- `blocked_for_ios_integration`
- `blocked_for_app_facing_endpoint`
- `blocked_for_production_endpoint`
- `blocked_for_model_call_in_planning_phase`
- `blocked_for_qwen_inference_in_planning_phase`
- `blocked_for_benchmark_execution`
- `blocked_for_production_flag`

These are planning blockers only, not model result categories.

## Future Approval Wording

A future model-call phase must explicitly say it approves a backend-internal, local/private `local_model` one-call test for one declared fixture token, with no retries, no iOS integration, no app-facing endpoint, no production endpoint, structured candidate JSON only, mandatory validator/fallback gates, false raw persistence flags, sanitized output only, and `productionReady:false`.

Without wording this explicit, do not run model inference.

## Still Blocked From iOS / Production

- no iOS provider/model key
- no direct iOS-to-Qwen/model/provider call
- no Camera cloud AI entry
- no iOS upload payload change
- no capture-context upload
- no app-facing endpoint
- no production endpoint
- no real user-photo upload
- no consent UI
- no auth/billing/quota runtime
- no production rollout

## productionReady:false Boundary

Phase 21-H is a dry-run plan only. Passing the gate means the future one-call test shape is policy-clean for review. It is not route enablement, model approval, endpoint approval, iOS approval, upload approval, benchmark approval, or production approval.

`productionReady:false` remains locked.
