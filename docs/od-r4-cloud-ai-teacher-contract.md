# Phase OD-R4 - Cloud AI Teacher Contract

Status: completed
Production readiness: `productionReady:false`

## Executive Summary

Phase OD-R4 defines a backend-only Cloud AI Teacher contract for future offline structured labeling. It adds a request/response schema, validator, sanitized CLI, tests, and app-transfer-readiness fields.

This phase is contract-only. It does not call a cloud provider, upload images, read image files, download datasets, crawl sources, train or fine-tune models, install model artifacts, add Swift runtime code, or transfer anything into the app runtime.

## What The Contract Defines

Teacher requests contain structured fields only:

- `schemaVersion`
- `jobId`
- `imageId`
- `registryVersion`
- `allowedTagSubset`
- `assetRefType`
- `assetRefBucket`
- `sourceType`
- `teacherMode:"contract_stub_only"`
- `humanReviewRequired:true`

Teacher responses contain enum-like candidate labels, safety flags, review status, and app-transfer-readiness gates. Candidate labels may include only registry tags, confidence/severity buckets, evidence keys, feature buckets, threshold signals, suppression candidates, a safe action key, and `needsHumanReview:true`.

## App Transfer Readiness

The mainline app already has an implementation/integration entry point, but OD-R4 does not wire this contract into it. Cloud AI Teacher output is not app runtime output and must not become UI copy directly.

Future app-transfer artifacts may include:

- versioned parameter pack
- threshold map
- suppression rule map
- safe action map
- benchmark report
- safety gate summary

In OD-R4, `eligibleForAppRuntime:false` and `appRuntimeTransferBlocked:true` are mandatory. Teacher labels may become future parameter-tuning inputs only after later human review, benchmark, safety, and performance gates.

## Safety Rules

The contract rejects:

- unknown registry tags
- score or rating fields
- beauty or attractiveness fields
- age, gender, emotion, identity, ethnicity, health, or body inference fields
- chain-of-thought fields
- raw prompt, provider, request payload, model, API key, or debug leakage fields
- free-form UI copy
- retake-first or bad-photo wording
- `humanReviewRequired:false`
- `eligibleForAppRuntime:true`
- `appRuntimeTransferBlocked:false`

## Hard Boundaries

- No cloud provider call.
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
- `productionReady:false`.

## Relationship To Later OD Phases

OD-R5 may add an opt-in backend-only Cloud AI Teacher sandbox later. OD-R6 should define human review queue schema. OD-R7/OD-R8 should decide whether reviewed outputs are good enough for local CV benchmarking and parameter tuning. Product transfer waits for OD-P after benchmark and safety gates pass.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-teacher:contract
```

Expected sanitized CLI output includes `requestValid:true`, `responseValid:true`, `candidateLabelCount:1`, `blockedReasons:[]`, `cloudTeacherEnabled:false`, `providerConfigured:false`, `networkCallsMade:false`, `imageReadsPerformed:false`, `trainingEnabled:false`, `runtimeIntegrationEnabled:false`, `productionReady:false`, `eligibleForAppRuntime:false`, and `appRuntimeTransferBlocked:true`.
