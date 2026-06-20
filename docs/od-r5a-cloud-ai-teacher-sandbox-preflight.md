# Phase OD-R5A - Cloud AI Teacher Sandbox Preflight

Status: completed
Production readiness: `productionReady:false`

## Executive Summary

Phase OD-R5A adds a backend-only Cloud AI Teacher labeling sandbox preflight and stub adapter. It accepts sanitized OD-R3-style job plans, emits OD-R4 teacher-contract-shaped stub responses, and validates those responses through the OD-R4 contract validator.

This is a sandbox preflight and stub adapter only. It is not a provider integration, not cloud AI labeling, not a network call, not image processing, not training, and not app runtime transfer.

## What The Stub Adapter Does

- Accepts sanitized job plans from the OD-R3 dry-run shape.
- Checks sandbox flags remain disabled.
- Blocks raw image/base64/path/URL/provider/API-key-looking fields.
- Generates enum/bucket-only stub candidate labels from OD-R1 registry entries.
- Marks all labels with `needsHumanReview:true`.
- Marks all responses with `humanReviewRequired:true` and `reviewStatus:"pending"`.
- Keeps `eligibleForAppRuntime:false` and `appRuntimeTransferBlocked:true`.
- Validates every stub response with the OD-R4 Cloud AI Teacher contract.
- Prints sanitized aggregate JSON only.

## Hard Boundaries

- No provider/cloud AI call.
- No provider/model API key.
- No network call.
- No image read or upload.
- No real photo processing.
- No dataset download.
- No crawler.
- No training or fine-tuning.
- No iOS runtime integration.
- No Swift file.
- No Depth Anything placeholder brought back.
- No model file, Core ML package, ONNX/TFLite/weights.
- No backend/iOS upload payload change.
- No raw image, base64, prompt, provider response, or request payload logging.
- No generated report with real data.
- No app runtime transfer.
- `productionReady:false`.

## Relationship To OD-R4

OD-R4 defined the Cloud AI Teacher request/response contract. OD-R5A uses that contract as a validator for locally generated stub responses. The stub adapter does not bypass OD-R4 safety, review, or app-transfer-readiness gates.

## Later Phases

OD-R5B may add an explicitly approved opt-in provider sandbox later. Human review remains required before labels can be used for evaluation, tuning, training candidates, or app-transfer artifacts. Future app transfer waits for benchmark, safety, and performance gates.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-teacher:sandbox-preflight
```

Expected sanitized CLI output includes `runMode:"stub_only"`, `acceptedStubResponseCount:1`, `rejectedStubResponseCount:0`, `blockedReasons:[]`, `cloudTeacherEnabled:false`, `providerConfigured:false`, `networkCallsMade:false`, `imageReadsPerformed:false`, `crawlerEnabled:false`, `downloadEnabled:false`, `trainingEnabled:false`, `runtimeIntegrationEnabled:false`, `productionReady:false`, `eligibleForAppRuntime:false`, and `appRuntimeTransferBlocked:true`.
