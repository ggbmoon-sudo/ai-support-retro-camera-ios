# Backend Deployment Config / Env Preflight

Status: Phase 21-F deployment config/env preflight

## Executive Summary

Phase 21-F defines backend deployment config and environment boundaries before any production server work. It adds a no-network, no-model preflight for future backend deployment policy objects only. It does not add production runtime behavior, app-facing endpoints, production endpoints, iOS integration, real user-photo upload, Qwen inference, serving benchmark execution, auth/billing/quota runtime, committed secrets, provider credentials, or production rollout.

The app repo remains the source of truth for backend contracts, gateway policy, validators, safety gates, QA scripts, docs, tests, and future app integration. The external Windows VLM server workspace remains a local/private model provider sandbox only.

`productionReady:false` remains mandatory.

## Why Config / Env Boundary Is Needed

The Windows sandbox has proven useful for local backend/VLM development, but production server work must not inherit local machine assumptions. Before any app-facing backend route or production deployment exists, the repo needs a clear gate that separates:

- local sandbox config examples from production config,
- secret category names from real secret values,
- provider URL buckets from committed URLs,
- future upload policy requirements from implemented upload behavior,
- backend-mediated VLM calls from direct iOS-to-model calls.

Phase 21-F is therefore a preflight only. It lets future phases review deployment policy shape without reading real environment variables or printing sensitive values.

## Local Sandbox Config vs Production Config

Local sandbox config may exist only in ignored local files or operator docs. It may describe loopback/private local testing as buckets, and it may be used only for explicitly approved local/private checks.

Production config must be injected by deployment environment, secret manager, or equivalent server-side configuration. Production config must not be committed as concrete provider URLs, model URLs, credentials, local paths, LAN addresses, or provider-specific secrets.

Staging and production are represented as blocked/review buckets in this phase. Their presence in policy samples does not create runtime deployment support.

## Allowed Env / Config Categories

Future backend deployment may define names and categories only:

- `APP_ENV` bucket: `local`, `staging`, or `production_blocked`.
- `PHOTO_ADVISOR_GATEWAY_MODE` bucket.
- `VLM_PROVIDER_MODE` bucket.
- `VLM_PROVIDER_URL` bucket only, with no committed real URL.
- `VLM_PROVIDER_AUTH_MODE` bucket only.
- `VLM_TIMEOUT_BUCKET`.
- `VLM_MAX_IMAGE_BYTES_BUCKET`.
- `VLM_METADATA_STRIPPING_REQUIRED`.
- `VLM_RAW_LOGGING_DISABLED`.
- `PHOTO_ADVISOR_PRODUCTION_READY=false`.
- `PHOTO_ADVISOR_CONSENT_REQUIRED`.
- `PHOTO_ADVISOR_RETENTION_POLICY_REQUIRED`.
- `PHOTO_ADVISOR_DELETION_POLICY_REQUIRED`.

These are policy categories, not approved runtime variables with real values. This phase does not add real secrets, real production URLs, real LAN URLs in committed runtime config, model keys, or provider credentials.

## Forbidden Committed Config

The deployment config/env preflight blocks:

- provider/model API keys in iOS.
- provider/model API keys in committed backend source.
- hardcoded Windows paths in runtime.
- hardcoded Mac paths in runtime.
- hardcoded LAN model URLs in iOS.
- committed production model URLs.
- public/ngrok/cloud model URLs for local sandbox.
- raw image/base64/path logging enabled.
- raw prompt/model response/request payload logging enabled.
- `productionReady:true`.
- app-facing endpoint enabled.
- production endpoint enabled.
- real upload enabled without consent, retention, deletion, and metadata-stripping policy requirements.
- capture-context upload enabled.
- Camera cloud AI entry enabled.

## Secret Injection Expectations

Secrets must be server-side only. Future staging or production deployments must use deployment env, secret manager, or an equivalent secret injection path. Committed source may contain only non-sensitive bucket labels and `.example`-style placeholders.

iOS must never contain provider/model keys, provider auth tokens, provider SDK configuration, or direct provider/model route fields.

## Provider URL Boundary

Committed runtime config must not contain real provider/model URLs. A future backend may receive a provider URL through server-side deployment config, but this phase only allows bucketed labels such as `staging_secret_injected` or `production_secret_injected_blocked`.

Local/private model URLs remain sandbox-only. They belong in ignored local config or operator docs, not iOS runtime, backend production runtime, or committed production config.

## Runtime Path Boundary

Windows and Mac local paths are allowed in docs, operator runbooks, manual smoke notes, ignored local examples, and tests that assert sandbox-only behavior. They are not allowed in backend runtime, iOS runtime, or production deployment config.

MacBook/Xcode must not depend on Windows local paths, Windows fixture paths, or local model server URLs.

## iOS Boundary

iOS remains a client. It must not call Qwen, vLLM, SGLang, Ollama, LM Studio, or any provider/model endpoint directly. It must not contain provider/model keys or upload capture context to a VLM path.

Future app-facing Photo Advisor work must go through the backend, with consent, compression, metadata stripping, retention/deletion policy, validation, safety fallback, and App Store privacy review handled before rollout.

## Production Rollout Blockers

Production rollout remains blocked until a future explicit phase approves all required runtime work. Open blockers include app-facing API design, consent UI, compression, metadata stripping, upload payload review, retention/deletion policy, privacy policy/App Store disclosure, auth/abuse/quota controls, production secret injection, provider health checks, fallback taxonomy, latency/cost review, and real provider readiness.

## Fail-closed Rules

The preflight fails closed when a policy enables production readiness, endpoints, direct iOS provider access, model calls, Qwen inference, benchmarks, raw logging, committed secrets, unsafe URLs, runtime local paths, Camera cloud entry, capture-context upload, or missing future real-upload privacy requirements.

The CLI prints sanitized bucket summaries only. It must not print raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, raw provider response, real provider URL, or credentials.

## Phase 21-G Recommendation

Phase 21-G should remain backend-internal and no-model unless explicitly scoped otherwise. A safe next candidate is a gateway fallback/failure taxonomy dry-run that maps contract, route, healthz, echo, validation, privacy, deployment-boundary, and config/env blockers into structured backend fallback categories.

Do not start iOS integration, app-facing endpoint work, production endpoint work, real user-photo upload, serving benchmark execution, Qwen inference, fixture inference, vLLM/SGLang/Ollama execution, auth/billing/quota runtime, or production rollout without a future explicit prompt.

## productionReady:false Boundary

Passing Phase 21-F means only that the deployment config/env policy shape is reviewable and sanitized. It is not production approval, deployment approval, endpoint readiness, iOS readiness, privacy readiness, provider readiness, latency readiness, or upload readiness.

`productionReady:false` remains locked.
