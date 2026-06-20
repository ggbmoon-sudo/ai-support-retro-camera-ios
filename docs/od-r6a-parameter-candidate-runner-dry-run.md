# Phase OD-R6A - Parameter Candidate Runner Dry-run

Status: completed
Production readiness: `productionReady:false`

## Executive Summary

Phase OD-R6A adds a backend-only Parameter Candidate Runner dry-run. It converts validated OD-R4/OD-R5A teacher stub labels into structured parameter candidates for later review, tuning, and benchmark planning.

This is dry-run only. It does not read images, call cloud/provider AI, use network, crawl or download datasets, train or fine-tune models, install model artifacts, add Swift runtime code, or transfer anything into the app runtime.

## What The Runner Does

- Accepts OD-R4-shaped teacher request/response pairs.
- Validates each teacher response through the OD-R4 Cloud AI Teacher contract.
- Converts accepted labels into parameter candidates.
- Aggregates category, tag, feature key, threshold key, suppression candidate, and safe action counts.
- Keeps app-transfer-readiness blocked with `eligibleForAppRuntime:false` and `appRuntimeTransferBlocked:true`.
- Emits sanitized aggregate JSON only.

## Output Buckets

The dry-run report includes:

- `parameterCandidateCount`
- `categoryCounts`
- `tagCounts`
- `featureKeyCounts`
- `thresholdKeyCounts`
- `suppressionCandidateCounts`
- `safeActionCounts`
- `appTransferReadiness`
- `productionReady:false`
- `eligibleForAppRuntime:false`
- `appRuntimeTransferBlocked:true`

## Hard Boundaries

- No real images.
- No cloud/provider call.
- No network.
- No crawler or download.
- No training or fine-tuning.
- No app runtime transfer.
- No Swift files.
- No model files or Core ML packages.
- No raw image, base64, prompt, provider response, or request payload logging.
- `productionReady:false`.

## Later Phases

Future phases may add human review schemas, parameter tuning harnesses, benchmark gates, or app-transfer package planning. Product runtime transfer still waits for OD-P after review, benchmark, safety, and performance gates.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-parameters:candidate-dry-run
```

Expected sanitized CLI output includes nonzero `parameterCandidateCount`, populated aggregate count buckets, `blockedReasons:[]`, `productionReady:false`, `eligibleForAppRuntime:false`, and `appRuntimeTransferBlocked:true`.
