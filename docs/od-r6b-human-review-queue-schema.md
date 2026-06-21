# Phase OD-R6B - Human Review Queue Schema

Status: backend-only schema / validator / CLI / tests
Production readiness: `productionReady:false`

## Executive Summary

OD-R6B adds a Human Review Queue schema for reviewing Cloud AI Teacher label candidates and parameter candidates before anything becomes tuning-eligible, benchmark-ready, or app-transfer-ready. This phase is schema-only and dry-run only: it does not call cloud AI, read images, crawl or download datasets, train models, or transfer outputs into app runtime.

Human review remains the gate between offline teacher/candidate signals and any later calibration, evaluation, tuning, or app-transfer artifact. Teacher output must never become app UI copy or app runtime data directly.

## What This Adds

- Review item schema for `teacher_label_candidate`, `parameter_candidate`, `manifest_issue`, and `safety_issue`.
- Review decision schema for calibration, eval-only, more-review, reject, and block decisions.
- Backend validator that checks registry tags, feature keys, threshold keys, suppression candidates, safe action keys, review status, accepted-use flags, and app-transfer blocking.
- Sanitized CLI: `npm run qa:aesthetic-review:queue`.
- Backend tests covering valid review decisions, unsupported enum values, sensitive inference, raw leakage, execution flags, and app-runtime transfer blocks.

## What This Does Not Add

- No cloud/provider call.
- No API key or provider configuration.
- No network call.
- No image read or upload.
- No crawler or dataset download.
- No real photos, datasets, local configs, fixtures, or generated reports.
- No training or fine-tuning.
- No iOS runtime integration.
- No Swift files.
- No model file, Core ML package, ONNX/TFLite package, or model weights.
- No upload path or payload change.
- No raw image, base64, raw prompt, provider response, request payload, debug text, or chain-of-thought logging.

## Review Item Rules

New review items default to `pending`, require `reviewRequired:true`, and must keep `tuningEligible:false`. OD-R6B never allows app runtime eligibility, so every item must keep `eligibleForAppRuntime:false` and `appRuntimeTransferBlocked:true`.

Accepted review items may become calibration-ready or eval-ready through a review decision, but they still remain blocked from app runtime transfer. Tuning candidacy can only be expressed by an accepted calibration decision and still requires later benchmark, safety, and performance gates.

## Review Decision Rules

Review decisions support:

- `accept_for_calibration`
- `accept_for_eval_only`
- `request_more_review`
- `reject`
- `block`

Reviewer roles support:

- `internal_reviewer`
- `qa_reviewer`
- `expert_reviewer`
- `safety_reviewer`

Safety issues require a safety reviewer or they remain blocked. Rejected and blocked items cannot become tuning candidates. `acceptedUse.appRuntime` must remain `false` in OD-R6B.

## Pipeline Relationship

OD-R6B sits after OD-R6A. It reviews teacher label candidates and parameter candidates before later phases use them for calibration, evaluation, benchmark, or tuning candidate preparation.

Future OD-R5B provider sandbox work can only proceed safely after this review layer exists. Future OD-R7/OD-R8 work should use reviewed labels/candidates only and must still keep app runtime transfer blocked until explicit safety, benchmark, and performance gates pass.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-review:queue
```

Expected CLI output keeps:

- `humanReviewRequired:true`
- `appRuntimeEligibleCount:0`
- `cloudTeacherEnabled:false`
- `providerConfigured:false`
- `networkCallsMade:false`
- `imageReadsPerformed:false`
- `crawlerEnabled:false`
- `downloadEnabled:false`
- `trainingEnabled:false`
- `runtimeIntegrationEnabled:false`
- `productionReady:false`

## Boundary

OD-R6B is not a provider sandbox, crawler, trainer, image processor, app runtime integration, or production rollout. It is a backend-only review schema gate.
