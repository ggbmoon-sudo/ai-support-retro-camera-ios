# Phase OD-P1A - App Transfer Preflight Gate

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

OD-P1A adds a backend-only App Transfer Preflight Gate. It validates whether a structurally exportable OD-R8B parameter-pack candidate is compatible with the app contract before any future app-side transfer is considered.

The phase is preflight only. It does not write into the iOS app, modify Xcode project files, copy parameter packs into app resources, or enable runtime behavior. Actual app wiring waits for OD-P1B or another explicit app integration phase.

## What It Does

- Accepts only a safe inline synthetic OD-R8B export candidate and a safe inline app contract.
- Reuses the OD-R8B Parameter Pack Export Gate before checking app-transfer requirements.
- Validates parameter-pack version, registry version, tag thresholds, suppression rules, safe action mappings, fallback rules, benchmark requirements, review requirements, safety requirements, and app contract requirements.
- Confirms the app contract supports the candidate's feature, threshold, suppression, and safe action keys.
- Requires UI copy to remain `language_pack_only`.
- Requires CreativeIntentGuard, offline fallback, and kill switch gates.
- Emits sanitized JSON only.
- Allows `eligibleForAppTransferCandidate:true` only when all preflight checks pass.
- Keeps `eligibleForAppRuntime:false`, `appRuntimeTransferBlocked:true`, `appRuntimeWritePerformed:false`, `xcodeProjectModified:false`, `appBundleArtifactWritten:false`, and `productionReady:false`.

## What It Does Not Do

- No iOS runtime integration.
- No Swift runtime behavior change.
- No Xcode project modification.
- No app bundle write.
- No parameter pack copied into app resources.
- No model, Core ML, ONNX, TFLite, or weight file.
- No provider or cloud AI call.
- No API key or provider credential.
- No network call.
- No image read or upload.
- No real CV inference.
- No Python, OpenCV, or PyTorch dependency.
- No crawler or download.
- No training or fine-tuning.
- No real photos, datasets, local configs, or generated reports.
- No raw image, base64, raw prompt, raw provider response, request payload, raw teacher text, provider payload, debug leakage, GPS/EXIF, or raw metadata.
- No app runtime write.
- No app runtime transfer.
- No production rollout.

## Backend Entry Points

- Module: `backend/src/qa/aestheticAppTransferPreflightGate.mjs`
- CLI: `backend/scripts/check-aesthetic-app-transfer-preflight-gate.mjs`
- Package script: `npm run qa:aesthetic-parameters:app-transfer-preflight`
- Tests: `backend/tests/aesthetic-app-transfer-preflight-gate.test.mjs`

The CLI uses safe inline synthetic data only. It takes no file input, reads no image, calls no network/provider path, performs no CV inference, trains nothing, writes no app files, modifies no Xcode files, and prints sanitized JSON only.

## App Contract Requirements

The preflight contract requires:

- `contractVersion`
- matching `expectedParameterPackVersion`
- matching `supportedRegistryVersion`
- supported feature, threshold, suppression, and safe action keys
- required fallback rules
- required safety flags
- `uiCopyMode:"language_pack_only"`
- `allowsRawTeacherText:false`
- `allowsScores:false`
- `allowsSensitiveInference:false`
- `allowsProviderPayload:false`
- `requiresCreativeIntentGuard:true`
- `requiresOfflineFallback:true`
- `requiresKillSwitch:true`

## Fail-closed Rules

The gate fails closed for:

- unknown tag
- unknown feature key
- unknown threshold key
- unsupported suppression key
- unsupported safe action key
- missing fallback, safety, review, benchmark, or app contract requirements
- UI copy mode that allows raw teacher text
- score/rating, sensitive inference, provider payload, raw teacher text, prompt, debug, or chain-of-thought leakage
- local path, real URL, base64/raw image, GPS/EXIF, or raw metadata
- `eligibleForAppRuntime:true`
- `appRuntimeTransferBlocked:false`
- `appRuntimeWritePerformed:true`
- `xcodeProjectModified:true`
- `appBundleArtifactWritten:true`
- `runtimeIntegrationEnabled:true`
- `productionReady:true`
- enabled cloud teacher, provider, network, image read, CV inference, crawler, download, training, or fine-tuning flags

## Future Work

OD-P1A is not app integration. Future OD-P1B or another explicit app integration phase must separately review Xcode runtime behavior, app resource packaging, language-pack copy, fallback behavior, kill switch behavior, benchmark pass criteria, privacy/safety, rollback, and production readiness.

Mainline app already has an integration entry point, but this phase does not connect the parameter pack to it. `productionReady:false` remains locked.
