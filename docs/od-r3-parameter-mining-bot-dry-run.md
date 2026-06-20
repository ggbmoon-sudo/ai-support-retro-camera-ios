# Phase OD-R3 - Parameter Mining Bot Dry-run

Status: completed
Production readiness: `productionReady:false`

## Executive Summary

Phase OD-R3 adds a backend-only dry-run Parameter Mining Bot. It connects the OD-R1 Aesthetic Parameter Registry with the OD-R2 Dataset / Source Manifest Schema and produces sanitized label-job planning output from in-memory synthetic manifest objects only.

This is not a crawler, not a dataset downloader, not cloud teacher labeling, not training or fine-tuning, and not product runtime integration. It reads no images, fetches no URLs, calls no provider/model API, writes no generated report file, and adds no Swift/iOS runtime behavior.

## What The Dry-run Does

- Loads the OD-R1 registry through `aestheticParameterRegistry()`.
- Validates the registry through `evaluateAestheticParameterRegistry()`.
- Validates safe source/image/label-job manifest objects through `evaluateAestheticDatasetManifest()`.
- Builds a sanitized teacher-stub label-job plan.
- Reports source count, image count, requested/eligible/blocked job counts, category counts, tag counts, and blocker buckets.
- Keeps only opaque IDs and buckets in output.

Each job plan item contains only:

- `jobId`
- `imageId`
- `sourceId`
- `assetRefType`
- `assetRefBucket`
- `allowedTagSubset`
- `humanReviewRequired:true`
- `teacherMode:"stub_only"`
- `status`
- `blockedReasons`

## Hard Boundaries

OD-R3 keeps these flags disabled and reported as false:

- `crawlerEnabled:false`
- `downloadEnabled:false`
- `cloudTeacherEnabled:false`
- `trainingEnabled:false`
- `runtimeIntegrationEnabled:false`
- `imageReadsPerformed:false`
- `networkCallsMade:false`
- `rawImagesCommitted:false`
- `productionReady:false`

The dry-run fails closed if any of the execution flags are enabled, if a manifest includes raw local image paths or real URLs, if an unknown registry tag appears, if human review is missing, or if a job/source/image is not approved for the teacher-stub dry-run path.

## Not Included

- No public web crawler.
- No dataset download.
- No image read.
- No real photo paths or URLs in committed samples.
- No cloud AI teacher call.
- No provider/model API call.
- No API key or secret.
- No training or fine-tuning.
- No model install, Core ML package, ONNX/TFLite/weights, or runtime inference.
- No iOS runtime integration or Swift file.
- No upload path or upload payload change.
- No generated report, local config, fixture, dataset, or real photo.

## Relationship To Later OD Phases

Cloud AI teacher contract work belongs later in OD-R4. A cloud teacher sandbox belongs later in OD-R5. Human review queue schema belongs later in OD-R6. Local CV benchmark work belongs later in OD-R7. Product/runtime integration waits for OD-P after benchmark and safety gates pass.

## Verification

Run from `backend/`:

```sh
npm test
npm run qa:aesthetic-parameters:bot-dry-run
```

Expected sanitized CLI output includes `eligibleJobCount:1`, `blockedReasons:[]`, `crawlerEnabled:false`, `downloadEnabled:false`, `cloudTeacherEnabled:false`, `trainingEnabled:false`, `runtimeIntegrationEnabled:false`, `imageReadsPerformed:false`, `networkCallsMade:false`, `rawImagesCommitted:false`, and `productionReady:false`.
