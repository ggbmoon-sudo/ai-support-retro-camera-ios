# Phase OD-R8A - Parameter Tuning Harness Dry-run

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

OD-R8A adds a backend-only Parameter Tuning Harness dry-run. It converts reviewed synthetic parameter candidates and synthetic local CV benchmark signals into a structured, versioned parameter-pack candidate.

The parameter-pack candidate is not app-ready. App runtime transfer remains blocked until later benchmark, safety, performance, export, and product integration gates pass.

## What It Does

- Accepts safe inline synthetic parameter candidates shaped like OD-R6A output.
- Accepts safe inline synthetic human review items and decisions shaped like OD-R6B.
- Accepts safe inline synthetic local CV benchmark signals shaped like OD-R7A.
- Uses OD-R1 registry keys for tags, feature keys, threshold keys, suppression keys, and safe action keys.
- Emits a sanitized `parameterPackCandidate` with threshold maps, suppression maps, safe action maps, fallback rules, review requirements, benchmark requirements, safety requirements, and app-transfer blockers.
- Keeps `eligibleForAppRuntime:false`, `appRuntimeTransferBlocked:true`, and `productionReady:false`.

Only candidates with accepted calibration or accepted eval-only human review plus accepted synthetic benchmark signals can influence the parameter-pack candidate. Rejected, blocked, unreviewed, unsupported, or unsafe candidates stay out of the pack or fail the dry-run gate.

## What It Does Not Do

- No training or fine-tuning.
- No real images.
- No image read or upload.
- No real CV inference.
- No Python, OpenCV, PyTorch, model, Core ML, ONNX, TFLite, or weight dependency.
- No provider or cloud AI call.
- No network call.
- No crawler or download.
- No generated report output with real data.
- No iOS runtime integration.
- No Swift file.
- No app upload path or payload change.
- No app runtime transfer.
- No production rollout.

## Backend Entry Points

- Module: `backend/src/qa/aestheticParameterTuningHarness.mjs`
- CLI: `backend/scripts/run-aesthetic-parameter-tuning-dry-run.mjs`
- Package script: `npm run qa:aesthetic-parameters:tuning-dry-run`
- Tests: `backend/tests/aesthetic-parameter-tuning-harness.test.mjs`

## Output Shape

The dry-run output includes:

- `schemaVersion:"aesthetic_parameter_tuning_harness_dry_run.v1"`
- `runMode:"parameter_tuning_dry_run"`
- input, accepted, and rejected candidate counts
- `parameterPackCandidate`
- `thresholdMapCandidate`
- `suppressionRuleMapCandidate`
- `safeActionMapCandidate`
- `benchmarkReadiness`
- `appTransferReadiness`
- disabled execution flags
- `tuningDryRunValid`

The parameter-pack candidate contains structured fields only:

- `parameterPackVersion`
- `registryVersion`
- `createdFromRunMode:"dry_run_only"`
- `tagThresholds`
- `suppressionRules`
- `safeActionMappings`
- `fallbackRules`
- `reviewRequirements`
- `benchmarkRequirements`
- `safetyRequirements`
- `appRuntimeTransferBlocked:true`
- `eligibleForAppRuntime:false`
- `blockedReasons`

It does not contain raw image data, base64, local file paths, real URLs, prompts, provider payloads, raw teacher text, UI copy, model names, API keys, user identity, GPS, or EXIF.

## Validation

The harness fails closed for:

- unknown registry tags
- unknown feature keys
- unknown threshold keys
- unsupported suppression keys
- unsupported safe action keys
- missing human review requirement
- rejected or blocked candidates used for tuning
- app runtime eligibility
- app runtime transfer not blocked
- score or rating fields
- sensitive inference fields
- free-form UI copy
- raw teacher text
- raw provider, debug, prompt, or request leakage
- local paths, real URLs, base64, or raw image fields
- provider/cloud/network/image/CV/crawler/download/training/fine-tuning/runtime/production flags

## Future Work

OD-R8B or OD-R9 may add benchmark thresholds, export-readiness checks, or distillation/fine-tune readiness gates. Those future phases still need explicit approval before any real images, CV inference, training, model artifact, app runtime transfer, or production rollout.

Mainline app already has an integration entry point, but this phase does not transfer OD-R output into app runtime. App/model installation remains an OD-P concern after review, benchmark, safety, performance, and product gates pass.
