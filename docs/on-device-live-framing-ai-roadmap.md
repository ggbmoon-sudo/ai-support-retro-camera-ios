# On-device Live Framing AI Roadmap

Status: docs-only direction update
Date: 2026-06-20
Production readiness: `productionReady:false`

## Today's Direction Change

Real-time / live camera guidance should move away from cloud live VLM as the primary path. The current SiliconFlow, RunPod, and open-weight/self-hosted VLM work remains valuable for post-capture Photo Advisor, offline benchmark, internal evaluation, schema validation, and possible future model-assisted labeling or distillation, but it is no longer the default answer for live camera guidance.

The live guidance direction is now on-device geometry / depth / rules first:

- Apple Vision and AVFoundation are the first production-leaning path for geometry, subject boxes, face/body regions, pose regions, margins, and composition rules.
- Hardware depth from AVFoundation should be used first when available.
- Depth Anything V2 Small is a future on-device Core ML fallback candidate only after benchmark, memory, FPS, battery, and thermal checks.
- Microsoft Florence-2-base is a feasibility/research candidate for object detection, grounding, detailed caption, and segmentation, not an assumed first live production engine.
- The app rules engine remains the brain: AI/model layers may provide coordinates, regions, depth, and typed signals, while the app produces short mood-first retro-aware guidance.

## OD-R / OD-P Direction

The on-device live-framing work is now split into two tracks:

- `OD-R`: research / definition / parameter / dataset / labeling / benchmark / fine-tune preparation.
- `OD-P`: product / runtime / mainline-ready integration after benchmark and safety gates pass.

OD-R is not an app/model installation track. App/model installation belongs later to OD-P only when the work is practical, testable, and ready for product integration. OD-03B Swift placeholder work is paused and should not continue on this branch.

Planned OD-R sequence:

- `OD-R1`: Aesthetic Parameter Registry.
- `OD-R2`: Dataset / Source Manifest Schema.
- `OD-R3`: Parameter Mining Bot Dry-run.
- `OD-R4`: Cloud AI Teacher Contract.
- `OD-R5`: Cloud AI Teacher Labeling Stub / Sandbox.
- `OD-R6`: Human Review Queue Schema.
- `OD-R7`: Local CV Feature Extractor Benchmark.
- `OD-R8`: Parameter Tuning Harness.
- `OD-R8B`: Parameter Pack Export Gate.
- `OD-P1A`: App Transfer Preflight Gate.
- `OD-R9`: Fine-tune / Distillation Readiness Gate.
- `OD-P1`: Product Integration Candidate, only after benchmark and safety gates pass.

Parameter Mining Bot work must not be a public web crawler. Cloud AI is a future offline teacher for structured labeling, not live app runtime. Local CV / local AI is the future runtime student. `productionReady:false` remains locked.

OD-R2 implementation note: `docs/od-r2-dataset-source-manifest-schema.md` defines source, image, and label-job manifests with safe opaque asset references, consent/license/review gates, metadata stripping requirements, and no crawler/download/cloud-teacher/training/runtime behavior.

OD-R3 implementation note: `docs/od-r3-parameter-mining-bot-dry-run.md` adds a backend-only dry-run Parameter Mining Bot that connects the OD-R1 registry and OD-R2 manifest validators, then emits sanitized label-job planning output from inline synthetic manifest objects only. It does not crawl, download, read images, call cloud AI, train, fine-tune, install models, or integrate with iOS runtime.

OD-R4 implementation note: `docs/od-r4-cloud-ai-teacher-contract.md` adds a backend-only Cloud AI Teacher request/response contract with app-transfer-readiness fields. It is contract-only and keeps `eligibleForAppRuntime:false` and `appRuntimeTransferBlocked:true`; no cloud call, image read/upload, crawler/download, training, model install, Swift runtime, or app transfer is added.

OD-R5A implementation note: `docs/od-r5a-cloud-ai-teacher-sandbox-preflight.md` adds a backend-only Cloud AI Teacher sandbox preflight and stub adapter. It accepts OD-R3-style sanitized job plans, emits OD-R4-contract-shaped stub responses, validates them locally, and keeps provider/cloud/network/image/training/runtime/app-transfer flags disabled.

OD-R6A implementation note: `docs/od-r6a-parameter-candidate-runner-dry-run.md` adds a backend-only Parameter Candidate Runner dry-run. It converts validated teacher stub labels into structured parameter candidates and aggregate counts while keeping provider/cloud/network/image/training/runtime/app-transfer flags disabled.

OD-R6B implementation note: `docs/od-r6b-human-review-queue-schema.md` adds a backend-only Human Review Queue schema. It validates review items and decisions before label/parameter candidates can become calibration, evaluation, or tuning candidates while keeping provider/cloud/network/image/training/runtime/app-transfer flags disabled.

OD-R5B implementation note: `docs/od-r5b-cloud-teacher-provider-sandbox-readiness-gate.md` adds a backend-only Cloud Teacher provider sandbox readiness gate and redacted request-envelope builder. It prepares for a future explicitly approved OD-R5C provider smoke while keeping provider/cloud/network/image/training/runtime/app-transfer behavior disabled by default.

OD-R5C implementation note: `docs/od-r5c-cloud-teacher-provider-smoke-harness.md` adds a backend-only opt-in Cloud Teacher provider smoke harness. The default path is `blocked_no_network`, uses the OD-R5B gate and redacted envelope, validates represented outputs through the OD-R4 contract and OD-R6B review queue, and adds no real provider adapter, provider SDK, cloud call, network call, image read/upload, training, runtime integration, app transfer, or production rollout.

OD-R7A implementation note: `docs/od-r7a-local-cv-feature-vector-benchmark.md` adds a backend-only Local CV Feature Vector Benchmark dry-run. It evaluates safe inline synthetic numeric feature vectors against OD-R1 registry keys, OD-R6A parameter candidates, and OD-R6B review decisions while keeping image reads, CV inference, provider/cloud/network calls, training, runtime integration, app transfer, and production rollout disabled.

OD-R7B implementation note: `docs/od-r7b-local-cv-feature-extractor-prototype.md` adds a backend/local-only Local CV Feature Extractor prototype. It maps safe inline synthetic local-CV observations into OD-R7A-compatible feature vectors for the local AI parameter-pack pipeline while keeping image reads, real CV inference, provider/cloud/Xiaoyi relay calls, network, training/fine-tuning, iOS runtime integration, app transfer, and production rollout disabled.

OD-R7C implementation note: `docs/od-r7c-local-cv-calibration-fixture-gate.md` adds a backend/local-only calibration fixture gate for OD-R7B. It validates ignored local fixture registry policy and approved synthetic/ignored fixture-token shape while keeping default execution no-image-read, no real CV inference, no provider/cloud/Xiaoyi relay calls, no uploads, no committed real photos/local configs/generated reports, no iOS runtime integration, and no production rollout.

OD-R7D implementation note: `docs/od-r7d-local-cv-calibration-smoke.md` adds a backend/local-only ignored local fixture calibration smoke. The default path safely blocks when ignored config/fixture prerequisites are absent; when explicitly approved locally, it may read only the ignored `calibration_001` fixture and emit sanitized in-memory feature buckets. It writes no reports and adds no committed real photos/local configs/generated reports, provider/cloud/Xiaoyi relay calls, network calls, uploads, model files, iOS runtime integration, app transfer, or production rollout.

OD-R7E implementation note: `docs/od-r7e-local-cv-expected-range-comparison.md` adds backend/local-only expected range comparison for sanitized OD-R7D calibration output. The default path compares inline sanitized feature values only, reads no images, runs no CV inference, emits soft warning buckets rather than scores, and adds no committed real photos/local configs/generated reports, provider/cloud/Xiaoyi relay calls, network calls, uploads, model files, iOS runtime integration, app transfer, or production rollout.

OD-R7F implementation note: `docs/od-r7f-local-cv-calibration-aggregation-gate.md` adds backend/local-only aggregation for sanitized OD-R7E expected-range outputs. The default path reads no images and aggregates warning frequencies/features for manual review only. The current fixture count is `1`, so `insufficientSampleSize:true` keeps parameter tuning blocked until more approved ignored local fixture smokes are reviewed. No score/rating/aesthetic grading, retake-first guidance, provider/cloud/Xiaoyi relay call, Swift/Xcode change, app runtime transfer, or production rollout is added.

OD-R7F-R2 implementation note: `docs/od-r7f-r2-local-cv-aggregation-review.md` updates the aggregation gate to use five manually reviewed sanitized OD-R7F-R1 feature vectors by default. The sample-size gate is no longer insufficient for first aggregation review, but parameter tuning, app runtime transfer, image reads by default, provider/cloud/network/upload, Swift/Xcode changes, model files, and production rollout remain blocked.

OD-R8A implementation note: `docs/od-r8a-parameter-tuning-harness-dry-run.md` adds a backend-only Parameter Tuning Harness dry-run. It converts reviewed synthetic parameter candidates and synthetic local CV benchmark signals into a structured parameter-pack candidate while keeping real image reads, CV inference, provider/cloud/network calls, training/fine-tuning, runtime integration, app transfer, and production rollout disabled.

OD-R8B implementation note: `docs/od-r8b-parameter-pack-export-gate.md` adds a backend-only Parameter Pack Export Gate. It validates a safe inline synthetic OD-R8A parameter-pack candidate as structurally exportable while keeping app runtime eligibility false, app runtime transfer blocked, no app runtime write, no iOS project modification, no real report output, and `productionReady:false`.

OD-P1A implementation note: `docs/od-p1a-app-transfer-preflight-gate.md` adds a backend-only App Transfer Preflight Gate. It validates a safe inline synthetic OD-R8B export candidate against app contract requirements while keeping app runtime eligibility false, app runtime transfer blocked, no app runtime write, no Xcode project modification, no app bundle artifact, and `productionReady:false`.

## Product Language Rule

Live hints must keep the Photo Advisor style:

`Observation -> Mood -> Retro intent -> Optional action`

Allowed examples:

- `主體好貼邊，可以留少少空氣感。`
- `天空佔得幾多，可以微微向下。`
- `背光幾有菲林味，可以試保留剪影。`

Banned style:

- scoring or rating.
- attractiveness grading.
- identity, personality, age, gender, emotion, skin, health, ethnicity, religion, disability, body, or other sensitive inference.
- harsh critique.
- retake-first language.
- `bad photo` wording.

## Revised Phase Plan

Naming note: this is the revised live-framing AI track requested by today's direction change. Older committed Phase 21-A backend-internal VLM records remain historical evidence; future prompts should disambiguate by using the new title `Phase 21-A - On-device Vision Geometry Spike`.

### Phase 21-A - On-device Vision Geometry Spike

Scope:

- Apple Vision / AVFoundation only.
- Detect subject/person/face/body/pose as geometry only.
- Add safe composition signals:
  - subject center.
  - edge margin.
  - headroom.
  - footroom.
  - rule-of-thirds proximity.
  - subject size ratio.
  - horizon / vertical balance heuristic if available.

Boundaries:

- No sensitive inference.
- No model download.
- No cloud.
- No upload.
- No raw frame persistence.
- `productionReady:false`.

Implementation note:

- Phase 21-A now has an implementation summary at `docs/phase-21-a-on-device-vision-geometry-spike-summary.md`.
- It adds iOS Apple Vision geometry-only signals and keeps live guidance local-only.
- The next recommended phase after commit/push is `Phase 21-B - AVFoundation Depth Capability Probe`.

### Phase 21-B - AVFoundation Depth Capability Probe

Scope:

- Detect hardware depth / `AVDepthData` capability.
- Add depth capability states:
  - `hardwareDepthAvailable`
  - `portraitMatteAvailable`
  - `depthUnavailable`
- Use depth only as composition / foreground-background signal.

Boundaries:

- No depth persistence.
- No raw depth map logging.
- No cloud upload.
- `productionReady:false`.

Implementation note:

- Phase 21-B now has an implementation summary at `docs/phase-21-b-avfoundation-depth-capability-probe-summary.md`.
- It detects AVFoundation hardware depth / portrait matte capability only.
- It does not enable depth delivery, read raw `AVDepthData`, persist depth maps, or upload frames.
- Phase 21-C-PRE now has a no-runtime preflight summary at `docs/phase-21-c-pre-depth-anything-v2-small-coreml-sandbox-preflight.md`.
- The next recommended phase after commit/push is `Phase 21-C - Depth Anything V2 Small Core ML Sandbox`, still debug/benchmark-only.

### Phase 21-C - Depth Anything V2 Small Core ML Sandbox

Scope:

- Future/debug-only benchmark path.
- Measure latency, memory, FPS, thermal, and battery.
- Use resized preview frames only.
- Compare against AVFoundation hardware depth availability.
- Start only after the 21-C-PRE gate passes.

Boundaries:

- No production bundling until explicitly approved.
- No raw frame logging.
- No model file should be added unless the sandbox phase explicitly keeps it debug-only, ignored/reviewed as needed, and benchmark-gated.
- `productionReady:false`.

Planning note:

- Phase OD-03 now has a docs-only sandbox preflight plan at `docs/phase-21-c-depth-anything-v2-small-coreml-sandbox-summary.md`.
- This commit does not add a backend preflight gate/script/tests, Swift runtime file, Depth Anything model file, Core ML package, model download, inference execution, benchmark run, Camera runtime integration, upload path, provider call, or production rollout.
- The local `ios-app/AIPhotoApp/Features/Camera/DepthAnythingV2SmallSandbox.swift` scaffold remains untracked for a later separate phase.
- The next practical step is a separate Phase OD-03B approval if an iOS sandbox placeholder should be added, followed later by model-artifact/source/license and device benchmark harness gates before any real Depth Anything inference.

### Phase 21-D - Florence-2-base Feasibility Study

Scope:

- Research only.
- Evaluate conversion/runtime options:
  - Core ML.
  - ONNX Runtime.
  - MLX / Swift inference if practical.
- Test object detection, phrase grounding, detailed caption, and segmentation.
- Compare against the Apple Vision baseline.

Boundaries:

- Do not assume `30-50ms` iPhone runtime until benchmarked.
- No free-form Florence text should be shown directly in UI.
- Convert model output into typed geometry/signal JSON only.
- No production integration in this direction-update phase.
- `productionReady:false`.

### Phase 21-E - Dataset Collector + AI-assisted Labeling Pipeline Skeleton

Scope:

- Backend/offline tooling only.
- Future plan for:
  - legal source manifest.
  - image manifest.
  - label schema.
  - dry-run scripts.
  - ignore protections.
  - tests.
- AI-assisted labeling should output structured JSON only.
- Human review is required before any fine-tune/eval use.

Boundaries:

- No crawler implementation yet unless separately requested.
- Ban arbitrary scraping from Google Images, Instagram, Pinterest, TikTok, Flickr, Unsplash, or random web pages.
- Only approved, consented, or licensed sources may be used in the future.
- No AI provider labeling run in this direction-update phase.
- `productionReady:false`.

## Roadmap Relationship

- Phase 20 backend/self-hosted VLM work remains valid but is no longer the default answer for live camera guidance.
- Phase 20 remains useful for post-capture Photo Advisor, internal model benchmarking, schema validation, and possible data distillation.
- SiliconFlow / RunPod / open-weight VLM research remains useful for post-capture advice and offline evaluation.
- Phase 21 becomes the on-device live framing intelligence track.
- Future Phase 22+ should integrate debug-only iOS overlays only after Phase 21-A and Phase 21-B are documented and scoped.
- Fine-tuning / distillation should come after dataset manifest, label schema, human review, and benchmark gaps are proven.

## Safety and Data Governance

- Live guidance must be short, non-judgmental, retro-aware, and creative-intent preserving.
- Coordinates, regions, depth, and typed signals may be used for composition; sensitive attributes must not be inferred.
- Do not persist raw preview frames, raw images, GPS, EXIF, raw sensor streams, raw depth maps, face descriptors, identity data, or sensitive attributes.
- Do not upload preview frames for live guidance in this track.
- Do not change backend/iOS upload payloads unless a future phase explicitly approves the schema and consent boundary.
- Production UI must not show raw model output, raw JSON, provider names, internal debug keys, scores, or ratings.

## Not Now

- No Florence-2 production integration yet.
- No Depth Anything production bundle yet.
- No live cloud AI.
- No automatic dataset crawler yet.
- No AI provider labeling run yet.
- No fine-tuning yet.
- No user photo training without explicit consent, privacy policy, retention/deletion policy, and legal review.

## Codex Handoff

This document is a roadmap update only. It adds no Swift runtime, no backend runtime, no model file, no Core ML package, no dataset crawler, no provider call, no API key, no upload path, no Camera live cloud AI entry, and no production rollout.
