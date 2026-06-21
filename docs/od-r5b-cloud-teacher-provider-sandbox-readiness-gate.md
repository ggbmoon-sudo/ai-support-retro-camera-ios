# Phase OD-R5B - Cloud Teacher Provider Sandbox Readiness Gate

Status: backend-only readiness gate / redacted envelope builder / CLI / tests
Production readiness: `productionReady:false`

## Executive Summary

OD-R5B prepares a future opt-in Cloud Teacher provider smoke without running one. It adds a fail-closed backend readiness gate, a disabled local config example, a redacted future request-envelope builder, a sanitized CLI, and regression tests.

This phase does not call cloud AI, does not call a provider, does not use a network, does not upload images, does not read real images, does not train or fine-tune, and does not transfer anything to app runtime.

## What This Adds

- Disabled example config at `backend/config/aesthetic-cloud-teacher.local.example.json`.
- Git ignore protections for ignored local config, approved local samples, and generated provider sandbox reports.
- Provider sandbox readiness evaluator at `backend/src/qa/aestheticCloudTeacherProviderGate.mjs`.
- Redacted request-envelope builder at `backend/src/qa/aestheticCloudTeacherRequestEnvelope.mjs`.
- Sanitized CLI: `npm run qa:aesthetic-teacher:provider-gate`.
- Backend tests covering disabled default behavior, redacted envelope output, unsafe URL/path/base64/prompt/payload/key rejection, logging blocks, runtime/training/app-transfer blocks, and CLI no-call behavior.

## Gate Behavior

Default output is safely blocked, not failed:

- `eligibleForProviderSmoke:false`
- `providerConfigured:false`
- `cloudTeacherEnabled:false`
- `allowNetworkCalls:false`
- `allowImageUpload:false`
- `networkCallsMade:false`
- `imageReadsPerformed:false`
- `trainingEnabled:false`
- `runtimeIntegrationEnabled:false`
- `productionReady:false`

Hard validation failure is reserved for unsafe or production-like attempts, including raw prompt logging, provider response logging, request payload logging, generated report output, production readiness, runtime integration, app runtime transfer, network/image call evidence, raw URLs, local image paths, base64, raw prompt text, provider payload fields, model/API key/secret fields, GPS, or EXIF.

## Redacted Request Envelope

The future-provider envelope contains only:

- `schemaVersion`
- `jobId`
- `imageId`
- `registryVersion`
- `allowedTagSubset`
- `assetRefType`
- `assetRefBucket`
- `sourceType`
- `teacherMode:"provider_sandbox_pending"`
- `humanReviewRequired:true`
- `reviewQueueRequired:true`
- `redactionPolicy`

It does not include raw image data, base64, local file paths, real URLs, prompt text, provider payloads, model names, API keys, user identity, GPS, or EXIF.

## Relationship To OD-R6B

All future teacher outputs must enter the OD-R6B Human Review Queue before tuning, calibration, evaluation, or benchmark use. Teacher output must not become app UI copy, app runtime payload, or product behavior directly.

Mainline app work already has a future integration entry point, but OD-R5B does not connect to it. App transfer remains blocked until later benchmark, safety, performance, and product gates pass.

## Deferred OD-R5C

A real provider smoke is deferred to OD-R5C and requires explicit approval, ignored local config, approved local/consented sample mode, redacted logging, and another gate pass. OD-R5B itself makes no provider call and no network call.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-teacher:provider-gate
```

Expected CLI output is sanitized JSON only and keeps `eligibleForProviderSmoke:false`, `networkCallsMade:false`, `imageReadsPerformed:false`, `trainingEnabled:false`, `runtimeIntegrationEnabled:false`, and `productionReady:false`.
