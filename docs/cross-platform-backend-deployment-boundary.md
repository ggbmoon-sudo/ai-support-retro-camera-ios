# Cross-platform Backend Deployment Boundary

Status: Phase 21-E cross-platform / deployment boundary audit plus Phase 21-F config/env preflight

Production readiness: `productionReady:false`

## Executive Summary

Phase 21-E adds a backend-internal deployment boundary audit for the Windows-primary VLM sandbox, future MacBook/Xcode work, and future production backend/provider deployment. It is a no-network, no-model gate only. It does not run Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, or production rollout.

The audit keeps Windows local paths and local model URLs in operator documentation and ignored local examples only. They must not become backend production runtime dependencies, iOS runtime dependencies, committed production config, or future app architecture.

## Why Windows Is Safe As Local VLM Sandbox

Windows is safe in this project only as a local/private backend and VLM development machine:

- it may run the external Qwen/VLM sandbox outside the app repo
- it may hold ignored local fixtures, ignored local config, and local model weights
- it may expose local/private no-model contract echo checks for backend QA
- it must not be treated as the production backend
- it must not be directly called by iOS
- it must not contribute committed raw reports, fixture images, local registries, logs, prompts, model output, request payloads, model weights, or credentials

Windows paths are allowed in docs, manual smoke instructions, operator runbooks, ignored local config examples, and tests that explicitly assert sandbox-only behavior.

## Why MacBook / Xcode Remains Safe

MacBook/Xcode remains the iOS client development and future runtime verification machine. Xcode must not require access to Windows paths, Windows fixture folders, LAN model URLs, local model servers, or provider credentials.

iOS must remain provider-key-free and must not call Qwen, vLLM, SGLang, Ollama, LM Studio, the external Windows server, or any provider directly. Any future photo analysis must go through the main backend boundary after a separate explicit consent, upload, validation, and rollout phase.

## Future Production Server Boundary

The future production server is the app-facing API owner. It must use environment variables, secret managers, deployment config, and controlled backend provider adapters. It must not depend on committed local paths, committed LAN IPs, Windows workspaces, Mac user folders, local fixture registries, or external sandbox code.

Production deployment must still add consent, compression, metadata stripping, retention/deletion policy, App Store privacy disclosure, abuse/rate/quota controls, validation, fallback, observability redaction, and an explicit production rollout approval.

## Runtime Vs Docs-only Path Rules

Allowed buckets:

- docs
- manual smoke instructions
- operator runbooks
- ignored local config examples
- tests that assert sandbox-only behavior

Blocked runtime buckets:

- backend runtime source
- iOS runtime source
- backend runtime config
- iOS runtime config
- production config

Blocked committed values include hardcoded Windows local paths, Mac local paths in runtime, LAN model URLs in iOS runtime, committed public/cloud/tunnel/ngrok model URLs, provider/model secrets, raw image/base64/path/prompt/model output policy allowances, app-facing endpoint flags, production endpoint flags, and `productionReady:true`.

## Deployment Roles

Windows local machine:

- backend/VLM development
- Qwen local sandbox
- ignored local fixtures/config
- no production claim
- no app-facing production service

MacBook:

- Xcode/iOS development
- future iOS runtime validation
- must not require Windows local paths
- must not contain provider/model keys
- must not call model server directly

Main backend:

- future app-facing API owner
- consent, payload, validation, and fallback owner
- must mediate all VLM calls
- must not expose raw model text directly to app

VLM provider server:

- self-hosted Qwen/vLLM/SGLang/etc. behind backend only
- not directly called by iOS
- not source of app contract
- provider output must be structured candidate JSON or mapped into it

## iOS-to-backend Boundary

iOS may only call approved app backend APIs in a future explicit phase. Until then:

- no Camera cloud AI entry
- no iOS provider/model keys
- no direct model/provider calls
- no iOS upload payload change
- no capture-context upload
- no app-facing endpoint
- no production rollout

## Backend-to-provider Boundary

The backend owns provider routing, validation, safety fallback, raw artifact redaction, and structured candidate mapping. Provider output must never become app-facing free-form model text. The existing VLM candidate validator and safety gates remain the source of truth before any future app use.

## Config / Secrets / Env Rules

Future production must use environment/secrets/config:

- no committed provider/model credentials
- no committed local model URLs
- no committed LAN model URLs
- no committed Windows or Mac runtime paths
- no provider keys in iOS
- no direct iOS provider fields
- no raw payload logging

Phase 21-F adds a dedicated deployment config/env preflight:

```sh
npm run qa:open-weight-vlm:deployment-config-env-preflight
```

The preflight validates policy buckets only. It allows category names for app environment, gateway mode, provider mode, provider URL bucket, provider auth bucket, secret injection bucket, timeout bucket, max image bytes bucket, raw logging disabled, metadata stripping required, consent required, retention/deletion policy required, and `PHOTO_ADVISOR_PRODUCTION_READY=false`. It blocks committed secrets, provider/model key fields, runtime Windows/Mac paths, hardcoded LAN model URLs in iOS, committed production model URLs, public/cloud/tunnel local provider URLs, raw logging, endpoint flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmarks, and `productionReady:true`.

## Local Sandbox Rules

The external workspace at `C:\Projects\vlm-smoke-server-work` remains a local/private sandbox only. It may support no-model compatibility checks and approved local smoke workflows only when a phase explicitly allows them. The main app repo remains the source of truth for contracts, validators, gates, docs, tests, and future app integration.

## Production Blockers

Production rollout remains blocked by:

- no approved production endpoint
- no app-facing VLM gateway endpoint
- no self-hosted production serving architecture
- no real upload consent flow
- no compression / metadata stripping / retention / deletion policy
- no App Store privacy disclosure update
- no quota, abuse, rate-limit, timeout, and observability policy
- no serving benchmark execution
- no production approval

## Phase 21-G Recommendation

Phase 21-G should remain backend-internal unless explicitly scoped otherwise. A safe next candidate is a gateway fallback/failure taxonomy dry-run that reviews how contract, route, healthz, echo, validation, privacy, deployment-boundary, and config/env blockers map to structured backend fallback categories. Do not start iOS integration, endpoint work, real upload, auth/billing/quota runtime, serving benchmarks, Qwen inference, fixture inference, or production rollout.

## productionReady:false Boundary

`productionReady:false` is mandatory. Passing the Phase 21-E audit or Phase 21-F config/env preflight means only that the current boundary policy is reviewable. It is not app readiness, endpoint readiness, privacy readiness, latency readiness, provider readiness, deployment readiness, or production approval.
