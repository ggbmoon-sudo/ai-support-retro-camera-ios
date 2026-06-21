# Phase OD-R5C - Cloud Teacher Provider Smoke Harness

Status: backend-only opt-in smoke harness / disabled adapter / stub-only tests
Production readiness: `productionReady:false`

## Executive Summary

OD-R5C adds the backend-only Cloud Teacher provider smoke harness shape for a future opt-in provider run. The default mode is fail-closed and no-network: it does not call cloud AI, does not call a provider, does not read or upload images, does not train or fine-tune, and does not transfer anything to app runtime.

No real provider smoke is run in this phase.

## What This Adds

- Provider adapter contract at `backend/src/qa/aestheticCloudTeacherProviderAdapter.mjs`.
- Disabled adapter and test-only stub adapter; no real provider SDK or package.
- Provider smoke harness at `backend/src/qa/aestheticCloudTeacherProviderSmokeHarness.mjs`.
- Sanitized CLI: `npm run qa:aesthetic-teacher:provider-smoke-harness`.
- Backend tests covering default no-network behavior, opt-in preflight blockers, unsafe provider-shaped output rejection, OD-R4 contract validation, OD-R6B review queue routing, and app-transfer blocks.

## Default Behavior

The default CLI path prints sanitized JSON only and reports:

- `runMode:"blocked_no_network"`
- `eligibleForProviderSmoke:false`
- `providerSmokeAttempted:false`
- `providerResponseReceived:false`
- `networkCallsMade:false`
- `imageReadsPerformed:false`
- `rawPromptPersisted:false`
- `rawProviderResponsePersisted:false`
- `rawRequestPayloadPersisted:false`
- `generatedReportsPersisted:false`
- `trainingEnabled:false`
- `runtimeIntegrationEnabled:false`
- `productionReady:false`

It exits successfully when safely blocked. It exits non-zero only for hard validation failures such as unsafe flags, unsafe fields, missing opt-in prerequisites for `--run-provider-smoke`, or invalid represented provider output.

## Future Provider Smoke Requirements

A future real provider smoke remains deferred and requires separate explicit approval. It must also require:

- `--run-provider-smoke`.
- Ignored local config, not committed config.
- Provider configuration only in ignored local config.
- Approved local ignored or approved consented sample mode.
- Redacted request envelope from OD-R5B.
- OD-R5B provider readiness gate pass.
- OD-R4 teacher contract validation.
- OD-R6B human review queue routing.
- No raw prompt, raw request payload, raw provider response, raw image, base64, local path, real URL, model name, API key, user identity, GPS, or EXIF persistence.

OD-R5C does not implement the real provider adapter. The harness can exercise only the disabled path and a test-only structured stub path.

## Output Safety

Provider output, if represented in tests, must be structured JSON that passes the OD-R4 teacher contract and can route into OD-R6B human review. Free-form UI copy, score/rating language, sensitive inference, chain-of-thought, debug leakage, raw prompt, raw provider payload, or provider response leakage fail the harness.

All teacher output must enter the OD-R6B Human Review Queue before calibration, evaluation, tuning candidacy, benchmark use, or any future app-transfer discussion.

## App Runtime Boundary

Mainline app work already has an integration entry point, but provider output must not enter app runtime directly. OD-R5C adds no iOS runtime integration, no Swift file, no model file, no Core ML package, no upload path, no app payload change, and no Camera cloud behavior.

App transfer remains blocked until later human review, benchmark, safety, performance, and product gates pass.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-teacher:provider-smoke-harness
```

Expected CLI output is sanitized JSON only and keeps the default path no-network, no-provider, no-image-read, no-training, no-runtime, no-app-transfer, and `productionReady:false`.
