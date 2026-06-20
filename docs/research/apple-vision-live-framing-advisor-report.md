# Apple Vision Live Framing Advisor Report

Status: research-only, implementation-ready plan for Phase 21-A
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

Apple Vision + AVFoundation is the first production-leaning path for Live Framing Advisor. It can provide fast on-device geometry and quality signals without cloud VLM latency, provider cost, or frame upload. The app should compute composition rules from boxes, pose landmarks, saliency/depth signals, preview transforms, and camera frame geometry, then generate short retro-aware hints.

Recommendation: Phase 21-A should implement Apple Vision / AVFoundation only, geometry-only, no sensitive inference, no model download, no cloud, no upload, and no raw frame persistence.

## Why This Matters For Our App

The product is a retro / film / Dazz-like camera. Live guidance should feel like a calm camera assistant, not a judge. Apple Vision can provide local geometry such as face/person rectangles, body pose points, hand pose if useful, saliency, and possible segmentation. AVFoundation provides frame dimensions, camera session data, preview transforms, zoom/focal context where available, and depth when supported.

The app rules engine remains the brain:

`Vision geometry + AVFoundation frame/depth -> Composition signals -> Retro-aware hint`

Language must remain:

`Observation -> Mood -> Retro intent -> Optional action`

## Recommended Architecture

```text
iOS Camera Frame
-> sample/throttle frame locally
-> Apple Vision geometry requests
-> AVFoundation frame + preview transform
-> optional hardware depth in Phase 21-B
-> composition signal calculator
-> safety/language guard
-> short Live Framing hint
```

No backend is involved. No provider key is involved. No frame upload is involved.

## Useful Apple Vision APIs

Candidate Vision requests:

- Face rectangles: geometry only; useful for headroom and edge margin. Do not infer identity, age, gender, emotion, attractiveness, skin, or health.
- Human body pose: useful for approximate body bounds, posture extent, footroom, and full-body framing.
- Hand pose: optional; only useful if hand positioning becomes a composition feature.
- Person segmentation: optional; useful for foreground mask / subject area if performance allows.
- Saliency / attention-style signals: optional; useful when no person is detected, but must be treated as heuristic.
- Image quality / blur/exposure-like local signals: useful only as gentle context; do not turn into scoring.

## Useful AVFoundation Data

- Camera frame size and orientation.
- Preview layer transform / aspect-fill crop mapping.
- Pixel buffer dimensions.
- Camera position and active format.
- Zoom/focal information if available and safe to bucket.
- Hardware depth / `AVDepthData` where supported, scoped to Phase 21-B.
- Portrait matte availability where supported.

## Composition Signals To Compute

GeometrySignals:

- `subjectCenter`: normalized center of largest safe subject.
- `edgeMargin`: minimum normalized distance from subject box to frame edges.
- `headroom`: top margin above face/head/person upper bound.
- `footroom`: bottom margin below body/person lower bound.
- `subjectSizeRatio`: subject box area / frame area.
- `ruleOfThirdsProximity`: distance from subject center or eye-line to thirds intersections/lines.
- `verticalBalance`: rough horizon/vertical balance heuristic if available.
- `multiSubjectSpread`: optional group framing signal.

DepthSignals for later Phase 21-B:

- `foregroundBackgroundSeparation`.
- `subjectDistanceBucket`.
- `depthAvailableState`.

## Coordinate Mapping

Vision often returns normalized coordinates relative to the analyzed image. SwiftUI overlay coordinates are affected by:

- image orientation.
- camera buffer dimensions.
- preview aspect-fill or aspect-fit behavior.
- front/back camera mirroring.
- safe-area and viewfinder crop.

Phase 21-A should create a dedicated coordinate mapper:

```text
Vision normalized rect
-> image pixel rect
-> oriented camera rect
-> preview-layer rect
-> SwiftUI overlay rect
```

Rules:

- Unit-test mapping using synthetic frame sizes.
- Keep all raw frames out of logs.
- Log only dimensions and bucketed mapping status.
- Render debug overlays only in DEBUG/internal builds.

## Throttling Strategy

Do not run every Vision request every frame.

Suggested starting point:

- Every frame: camera preview only, no heavy analysis.
- 10-15 FPS: lightweight rectangle/saliency if device stays cool.
- 5-10 FPS: body/face geometry.
- 1-2 FPS: expensive segmentation or optional fallback.
- On capture/post-capture: richer analysis if needed.

Throttle when:

- camera preview drops below target FPS.
- thermal state rises.
- battery is low.
- device tier is low.
- user disables guidance.

## UI Guidance

Hints should be calm and non-blocking:

- one short line at a time.
- no score.
- no red error state for creative choices.
- fade out when stable.
- avoid covering the subject.
- offer optional action, not command.
- preserve retro intent: blur, grain, tilt, shadow, underexposure, and backlight can be style.

## Safe Fallback

If no person/face/body is detected:

- use saliency or center-weighted composition if available.
- provide generic framing tips only.
- do not invent a subject.
- do not mention identity or appearance.
- allow silent state if confidence is low.

Fallback hint examples:

- `Frame feels open; the empty space can keep the film mood calm.`
- `Strong light shape detected; keeping it off-center can feel more cinematic.`

## Technical Options

Phase 21-A should be Vision-only. It should not include Depth Anything, Florence-2, cloud VLM, provider SDKs, or backend calls.

Implementation modules for a later phase:

- `LiveFrameSignalSampler`
- `VisionGeometryAnalyzer`
- `CameraOverlayCoordinateMapper`
- `CompositionSignalCalculator`
- `RetroHintRulesEngine`
- `LiveFramingSafetyGuard`

## Risks / Blockers

- Coordinate transform bugs.
- Vision request latency on older devices.
- Preview FPS drops.
- Device thermal behavior.
- False positives or missing subjects.
- Face/person geometry being misinterpreted as sensitive inference.
- UI becoming distracting.

## Privacy And Safety Notes

- Face/person detection is geometry only.
- Do not infer identity, age, gender, emotion, attractiveness, skin, health, ethnicity, religion, disability, or body traits.
- Do not persist raw frames, raw images, GPS, EXIF, raw sensor streams, face descriptors, or identity data.
- No cloud upload for live guidance.

## Suggested Phases

- Phase 21-A: On-device Vision Geometry Spike.
- Phase 21-B: AVFoundation Depth Capability Probe.
- Phase 22+: debug-only overlay after Phase 21-A/B are scoped.

## Do Now / Do Later / Do Not Do

Do now:

- Implement no-cloud Vision geometry spike in Phase 21-A.
- Build coordinate mapper tests.
- Add safe composition signal buckets.

Do later:

- Add depth states in Phase 21-B.
- Add debug overlay after safe signals exist.
- Add device capability gating.

Do not do:

- Do not add cloud VLM.
- Do not add provider keys.
- Do not persist raw frames.
- Do not score users or photos.

## Concrete Next Codex Prompt

`Phase 21-A - On-device Vision Geometry Spike: implement Apple Vision / AVFoundation geometry-only live framing signals, coordinate mapping tests, and safe composition buckets. No cloud, no upload, no model files, no sensitive inference, no production rollout. Keep productionReady:false.`

## Source Notes

- Apple Vision framework: https://developer.apple.com/documentation/vision
- Apple Vision human body pose request docs: https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest
- Apple Vision face rectangle docs: https://developer.apple.com/documentation/vision/vndetectfacerectanglesrequest
- Apple AVFoundation depth data docs: https://developer.apple.com/documentation/avfoundation/avdepthdata

