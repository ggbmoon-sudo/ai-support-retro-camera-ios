# Phase OD-R7C - Local CV Calibration Fixture Gate

Status: backend/local-only fixture gate
Production readiness: `productionReady:false`

## Executive Summary

OD-R7C adds a calibration fixture gate for the OD-R7B Local CV Feature Extractor prototype. It prepares ignored local fixture registry policy and fixture-token validation before any real image read, real CV inference, or app runtime integration.

The default path is safely blocked with no image reads. It reports the missing ignored local registry/config requirements and exits successfully because the blocked state is expected.

## What This Adds

- Backend gate module: `aestheticLocalCvCalibrationFixtureGate.mjs`.
- Disabled local example config: `backend/config/aesthetic-local-cv-calibration-fixtures.local.example.json`.
- Ignored real local config/sample/report paths in `.gitignore`.
- Sanitized CLI: `npm run qa:aesthetic-local-cv:calibration-fixture-gate`.
- Backend tests for safe default blocking, disabled example config, synthetic/ignored fixture-token structure, unsafe execution flags, unknown feature keys, raw URL/path/base64 leakage, app runtime blockers, and production readiness.

## Feature Keys

The gate references the OD-R7B extractor feature keys:

- `headroomRatio`
- `horizonAngle`
- `highlightClipRatio`
- `edgeMargin`
- `backgroundObjectDensity`
- `sharpnessRatio`
- `subjectAnchor`
- `visualWeightMoment`

## Ignored Local Fixture Policy

Real local calibration work must stay ignored unless a later phase explicitly approves otherwise:

- `backend/config/aesthetic-local-cv-calibration-fixtures.local.json`
- `backend/tests/local-cv-calibration-fixtures/`
- `backend/reports/local-cv-calibration/`

The committed example config is disabled:

- `enabled:false`
- `allowImageReads:false`
- `approvedFixtureMode:false`
- `productionReady:false`

## Hard Boundaries

- No real image read by default.
- No real CV inference.
- No real photos committed.
- No local config committed.
- No generated reports committed.
- No cloud/provider/Xiaoyi relay call.
- No network call.
- No upload/download/crawler.
- No model files, Core ML packages, ONNX/TFLite packages, or weights.
- No training or fine-tuning.
- No iOS runtime integration.
- No Swift or Xcode project changes.
- No Camera live cloud AI.
- No app runtime transfer.
- `productionReady:false`.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-local-cv:calibration-fixture-gate
```

Expected default CLI output keeps:

- `gateName:"aesthetic_local_cv_calibration_fixture_gate"`
- `runMode:"fixture_gate_no_image_read"`
- `eligibleForCalibration:false`
- `fixtureRegistryConfigured:false`
- `imageReadsPerformed:false`
- `cvInferencePerformed:false`
- `networkCallsMade:false`
- `uploadPerformed:false`
- `generatedReportsPersisted:false`
- `realUserPhotosCommitted:false`
- `localConfigCommitted:false`
- `appRuntimeIntegrationEnabled:false`
- `productionReady:false`

## Suggested Next Step

Recommended next local-AI phase: `Phase OD-R7D - Explicit Ignored Local Fixture Calibration Smoke`.

OD-R7D should only run after explicit user approval and should still use ignored local fixtures, no committed real photos, sanitized reports, no iOS runtime integration, no cloud/provider/Xiaoyi relay work, no model files, and `productionReady:false`.
