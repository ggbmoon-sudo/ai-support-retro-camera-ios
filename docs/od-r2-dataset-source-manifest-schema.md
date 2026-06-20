# OD-R2 Dataset / Source Manifest Schema

Status: backend QA schema only
Production readiness: `productionReady:false`

## Summary

OD-R2 defines the source, image, and label-job manifest layer for the OD-R research / parameter / dataset / labeling / benchmark / fine-tune preparation track. It gives later phases a safe contract for representing approved sources and image candidates before any dataset bot, parameter mining bot, cloud teacher, training job, or product runtime exists.

This phase is not a crawler, does not download images, does not call cloud AI, does not train or fine-tune, and does not add app runtime.

## Source Manifests

Source entries must use approved categories such as `owned_internal`, `consented_beta`, `staged_internal`, `synthetic`, `approved_open_dataset`, `approved_cc_dataset`.

Banned source categories include `google_images`, `instagram`, `pinterest`, `tiktok`, `random_web`, `unknown_license`, and `scraped_social_media`.

Source approval is controlled by license status, consent status, approval status, allowed-use flags, metadata policy, retention policy, review status, and notes keys. `productRuntime` must remain false in OD-R2.

## Image Manifests

Image entries use opaque or redacted references only. Committed raw image paths, actual photo URLs, base64 data, and real photo files are not allowed. OD-R2 does not require real image files.

Approved image candidates must have GPS, EXIF, camera serial, and raw sensor data removed or marked not applicable. Training eligibility requires both source-level training approval and image-level privacy review.

## Label Job Manifests

Label jobs define allowed registry tag subsets, teacher-labeling permission, human-review requirements, and job status. OD-R2 may represent `teacherLabelingAllowed`, but no cloud teacher call is enabled. Human review remains required by default.

Allowed tag subsets must reference valid OD-R1 Aesthetic Parameter Registry tags.

## Later Phases

- OD-R3 can add a Parameter Mining Bot dry-run, but it must not become a public web crawler.
- OD-R4 and OD-R5 can define and sandbox Cloud AI Teacher structured labeling, offline only.
- OD-R6 can add human review queue schema.
- OD-R7 and OD-R8 can benchmark local CV/local AI feature extraction and tune thresholds after reviewed labels exist.
- OD-R9 can decide fine-tune / distillation readiness.
- OD-P is the later product/runtime integration track after benchmark and safety gates pass.

## Boundaries

- No iOS runtime integration.
- No Swift runtime file.
- No model install, model download, Core ML package, or inference.
- No crawler/download mode.
- No cloud teacher call.
- No training/fine-tuning.
- No image upload path or provider/model API key.
- No datasets/photos/local configs/generated reports committed.
- `productionReady:false`.
