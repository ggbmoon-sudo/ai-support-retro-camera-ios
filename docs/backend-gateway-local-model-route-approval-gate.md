# Backend Gateway Local Model Route Approval Gate

Status: Phase 21-G local model route approval gate

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-G defines the backend-internal approval gate for a future `local_model` provider route. It is a dry-run approval review only: it does not enable `local_model`, does not call Qwen, does not run inference, does not run fixture inference, does not run a serving benchmark, does not add iOS integration, does not add app-facing endpoints, and does not add production endpoints.

The gate answers one narrow question: whether the documented prerequisites for a future local-model route review are clean enough to consider in a later explicit phase. Even when the gate passes, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, and `productionReady:false` remain mandatory.

## Why `local_model` Remains Blocked By Default

The local/private Windows Qwen sandbox is useful for backend/VLM development, but it is not the production backend and it is not an app-facing service. Enabling a real local model path would introduce network calls, model latency, raw artifact risk, fixture governance risk, and privacy responsibilities that are outside this phase.

`local_model` therefore remains disabled until a future prompt explicitly approves a scoped local model route phase. Phase 21-G only records the conditions that must be true before that future request can be reviewed.

## What Phase 20-N Proved

Phase 20-N proved a controlled local/private correctness path:

- 12 approved ignored fixture tokens routed through the Windows sandbox.
- Each fixture ran exactly once.
- The returned structured candidates were accepted by the backend validator.
- Raw persistence flags remained false.
- `productionReady:false` remained in force.

It did not prove product readiness, privacy readiness, upload readiness, latency readiness, endpoint readiness, serving-stack readiness, production deployment readiness, or iOS readiness.

## What Phase 21-A To 21-F Established

- Phase 21-A: backend-internal gateway request/response contract preflight.
- Phase 21-B: gateway adapter stub and external no-model contract echo alignment.
- Phase 21-C: provider routing dry-run, with real model routes blocked.
- Phase 21-D: no-model HTTP provider adapter check for `local_contract_echo` only.
- Phase 21-E: cross-platform deployment boundary audit.
- Phase 21-F: deployment config/env preflight.

Together these phases establish contract, adapter, routing, no-model echo, deployment-boundary, and config/env guardrails. They still do not enable a real model route.

## Required Approval Conditions

A future `local_model` route may only be considered when all of the following are true:

- Repo working tree is clean.
- Upstream comparison is `0 0`.
- Phase 21-G is committed and pushed.
- Deployment config/env preflight passes.
- Cross-platform deployment boundary gate passes.
- Provider routing gate passes.
- Provider adapter no-model HTTP gate passes.
- External healthz is safe.
- `publicExposure:no`.
- `rawLoggingDisabled:true`.
- Endpoint is local/private only.
- Fixture registry, local config, and fixture images remain ignored.
- A future phase explicitly approves the model route.
- Exactly scoped fixture tokens or synthetic fixture IDs are declared.
- No user-photo upload.
- No iOS integration.
- No app-facing endpoint.
- No production endpoint.
- No raw prompt, raw model output, request payload, image path, or base64 logging.
- Structured candidate JSON is mandatory.
- Backend validator remains the source of truth.
- Fallback and safety gates are mandatory.
- `productionReady:false`.

## Required Preflight Gates

Run and review the existing gates before any future local-model route approval request:

- backend tests
- synthetic benchmark
- benchmark gate
- local config dry-run
- default local sandbox smoke stub/no-network
- local smoke gate
- repeatability gate
- failure taxonomy CLI
- expanded fixture registry dry-run CLI
- provider integration diagnostic CLI
- fixture routing contract echo CLI
- serving benchmark preflight CLI
- gateway contract preflight CLI
- gateway adapter stub CLI
- gateway external contract echo CLI
- gateway provider routing CLI
- gateway provider adapter no-model HTTP CLI
- cross-platform deployment boundary CLI
- deployment config/env preflight CLI
- local model route approval gate CLI
- secret scan
- iOS direct provider/model scan
- Camera cloud entry scan
- backend/iOS payload unchanged scan
- artifact scan
- Photo Advisor copy, filter reason, CreativeIntent, and card language coverage

Phase 21-G adds:

```sh
npm run qa:open-weight-vlm:local-model-route-approval
```

The command is no-network, no-model, no-Qwen, and no-benchmark.

## Required Healthz Constraints

Future local-model route consideration requires sanitized healthz evidence only:

- healthz must be safe.
- `publicExposure` must be `no`.
- `rawLoggingDisabled` must be true.
- Endpoint must be local/private only.
- No public, cloud, tunnel, ngrok, or production exposure.
- No model output, prompt, request payload, path, EXIF, server logs, or provider response text may be printed.

## Required Config / Env Constraints

- Production config must use env/secrets/config injection.
- Committed runtime config must not contain local paths, LAN URLs, provider URLs, or secrets.
- Local config and fixture registry must stay ignored.
- Fixture images must stay ignored.
- iOS must not contain provider/model keys or direct provider fields.
- `PHOTO_ADVISOR_PRODUCTION_READY=false` remains required.

## Required Privacy / Logging Constraints

The route remains blocked unless raw artifact policy is fail-closed:

- No raw image logging.
- No base64 logging.
- No raw path logging.
- No raw prompt logging.
- No raw model output logging.
- No request payload logging.
- No raw provider response logging.
- No GPS/raw EXIF persistence.
- No raw server logs in committed reports.
- Consent, retention, deletion, and metadata stripping remain required before any future real upload.

## Required Validator / Safety Constraints

Any future local-model output must be structured candidate JSON only and must pass the existing backend validator and safety/fallback gates before any app-facing use.

Blocked output categories include:

- free-form model text
- score/rating
- sensitive inference
- chain-of-thought
- debug/provider leakage
- unsupported schema fields
- raw prompt/provider/model output
- request payload leakage

## Stop Conditions

Stop immediately if any of these appear:

- `productionReady:true`
- public/cloud/ngrok model URL
- raw logging enabled
- raw persistence true
- direct iOS call
- Camera cloud AI entry
- backend/iOS payload changes
- app-facing endpoint
- production endpoint
- user-photo upload
- missing consent, retention, or deletion policy
- local config, registry, or fixture images staged
- unsupported provider mode
- schema validator bypassed
- fallback/safety bypassed
- free-form text exposed
- score/rating allowed
- sensitive inference allowed
- chain-of-thought allowed
- debug/provider leakage allowed
- model calls or Qwen inference allowed in this phase

## Future Phase May Enable

A future explicit phase may request a scoped local-model route review. That phase would need to restate the exact fixture-token set, healthz constraints, local/private endpoint rules, model-call permission, logging controls, validator chain, fallback mapping, and stop conditions.

Phase 21-G does not grant that approval.

## Still Blocked From iOS / Production

- No iOS provider/model key.
- No direct iOS-to-Qwen/model/provider call.
- No Camera cloud AI entry.
- No iOS upload payload change.
- No capture-context upload.
- No app-facing endpoint.
- No production endpoint.
- No real user-photo upload.
- No production rollout.

## productionReady:false Boundary

Passing Phase 21-G means only that a future `local_model` route approval request can be reviewed against documented prerequisites. It is not route enablement, model approval, iOS approval, endpoint approval, upload approval, benchmark approval, or production approval.

`productionReady:false` remains locked.
