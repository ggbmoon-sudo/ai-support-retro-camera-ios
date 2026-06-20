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

### Phase 21-C - Depth Anything V2 Small Core ML Sandbox

Scope:

- Future/debug-only benchmark path.
- Measure latency, memory, FPS, thermal, and battery.
- Use resized preview frames only.
- Compare against AVFoundation hardware depth availability.

Boundaries:

- No production bundling until explicitly approved.
- No raw frame logging.
- No model file added in this direction-update phase.
- `productionReady:false`.

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
