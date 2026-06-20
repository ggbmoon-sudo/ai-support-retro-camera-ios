# Dataset Collector Bot and Labeling Pipeline Report

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

A dataset collector and AI-assisted labeling pipeline may become useful for evaluating or distilling live framing models, but it must start as a manifest-only, legal/privacy-first skeleton. No crawler, download mode, provider labeling adapter, or training data collection is approved in this task.

Recommendation: define schemas and ignore-protected local paths first, then local dry-run validation, then approved download mode only after legal/source review, then AI labeling dry-run, then human review.

## Why This Matters For Our App

Live framing needs reliable geometry, depth, and retro composition labels. Without a governed dataset, future Florence-2, Depth Anything, or smaller model work can become unsafe, legally unclear, or unreviewable.

## What The Bot Should Collect

Only after approval:

- owned photos.
- staged internal photos.
- consented beta user submissions.
- synthetic fixtures.
- approved open datasets.
- approved CC/licensed datasets with commercial, derivative, and AI-training review.

What to collect in manifests:

- source category.
- license/consent status.
- allowed use.
- image item ID.
- local ignored file path bucket.
- metadata stripping status.
- label status.
- train/validation/test/holdout split.

## What The Bot Must Never Collect

Banned sources:

- Google Images.
- Instagram.
- Pinterest.
- TikTok.
- Flickr unless license is explicitly verified.
- Unsplash unless license/use is explicitly reviewed.
- random web pages.
- any source without clear license/consent.

Never collect:

- GPS.
- raw EXIF.
- face descriptors.
- identity data.
- sensitive attributes.
- private user photos without explicit consent.

## Proposed Files For Future Implementation

Research only; do not create these files in this task:

- `backend/schemas/live-framing-dataset-source.v1.schema.json`
- `backend/schemas/live-framing-image-item.v1.schema.json`
- `backend/schemas/live-framing-label-candidate.v1.schema.json`
- `backend/scripts/prepare-live-framing-dataset.mjs`
- `backend/scripts/check-live-framing-dataset-manifest.mjs`
- `backend/scripts/run-live-framing-ai-labeling-dry-run.mjs`
- `backend/config/live-framing-sources.local.json`
- `backend/config/live-framing-labeling.local.json`
- `backend/datasets/`
- `backend/reports/live-framing-labels/`

Future local config and datasets must remain ignored.

## Manifest Design

Source manifest fields:

- `sourceId`
- `sourceCategory`
- `licenseBucket`
- `consentBucket`
- `commercialUseReviewed`
- `derivativeUseReviewed`
- `aiTrainingUseReviewed`
- `retentionPolicyBucket`
- `deletionPolicyBucket`
- `reviewStatus`

Image item fields:

- `imageItemId`
- `sourceId`
- `localPathBucket`
- `sha256Bucket` or perceptual duplicate bucket, not raw path in reports.
- `metadataStripped`
- `split`
- `approvedForEval`
- `approvedForTraining`

Label candidate fields:

- `schemaVersion`
- `imageItemId`
- `labelSource`
- `geometryLabels`
- `depthWeakLabels`
- `compositionLabels`
- `retroMoodLabels`
- `advisorCopyKeys`
- `safetyFlags`
- `humanReviewStatus`

## Duplicate Detection

Use future local-only hashing/perceptual hashing in ignored workspace. Reports should contain only buckets/counts, not raw file paths or images.

## Metadata Stripping

Verification should prove:

- GPS removed.
- EXIF removed unless explicitly approved synthetic fields.
- no camera serial/device identifiers.
- no raw sensor data.
- no original unstripped images committed.

## AI-assisted Labeling

Provider/model output must be:

- structured JSON only.
- validated against schema.
- sanitized into labels.
- rejected if sensitive, free-form, or debug-leaking.
- reviewed by humans before eval/training use.

Do not log raw prompts, raw provider responses, raw images, base64, file paths, API keys, or request payloads.

## Train / Validation / Test / Holdout

Splits must be deterministic and manifest-based. Holdout should be locked before tuning. User-contributed photos, if ever allowed, need separate consent and deletion handling.

## Bot Phases

1. Manifest-only skeleton.
2. Local dry-run.
3. Approved download mode.
4. Metadata stripping.
5. AI labeling dry-run.
6. One-provider labeling adapter.
7. Human review dashboard later.

## Risks / Blockers

- unclear licensing.
- consent revocation.
- hidden GPS/EXIF.
- raw image leakage.
- provider output leakage.
- label bias.
- sensitive labels.
- dataset drift.

## Privacy And Safety Notes

No user photo training without explicit consent, privacy policy, retention/deletion policy, and legal review. No arbitrary scraping. No sensitive labels.

## Do Now / Do Later / Do Not Do

Do now:

- Keep this research-only.
- Plan schemas and local ignored paths.

Do later:

- Add manifest schemas and dry-run checks.
- Add human review requirements.

Do not do:

- Do not implement crawler.
- Do not download datasets.
- Do not run AI labeling provider.
- Do not commit photos, reports, labels, local configs, or provider output.

## Concrete Next Codex Prompt

`Phase 21-E: Dataset Collector + AI-assisted Labeling Pipeline Skeleton - add schema files and dry-run manifest checker only. No crawler, downloads, provider calls, real photos, local configs, generated reports, raw labels, or model training. Keep productionReady:false.`

