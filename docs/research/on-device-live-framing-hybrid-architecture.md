# On-device Live Framing Hybrid Architecture

Status: research-only architecture
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

The production path should be Apple Vision + AVFoundation geometry/depth + app rules engine. Depth Anything V2 Small and Florence-2-base are optional future/debug branches, not the first live production engine. The app should normalize all local model and framework outputs into typed internal contracts, then generate short retro-aware hints using the app language/rules layer.

Required flow:

```text
iOS Camera Frame
-> Apple Vision geometry
-> AVFoundation hardware depth if available
-> optional Depth Anything fallback
-> optional Florence-2 debug semantic regions
-> app rules engine
-> short retro-aware hint
```

## Why This Matters For Our App

Live Framing Advisor must feel immediate and camera-native. Cloud VLM latency is not suitable as the default live camera path. The app rules engine should translate geometry/depth/semantic signals into mood-first guidance:

`Observation -> Mood -> Retro intent -> Optional action`

No component should produce Score -> Problem -> Fix -> Retake.

## Recommended Production Architecture

Production path:

- Apple Vision geometry at controlled cadence.
- AVFoundation frame/preview transform.
- AVFoundation hardware depth where available.
- App composition rules.
- Safety/language guard.
- One short hint at a time.

Debug path:

- Depth Anything V2 Small benchmark fallback.
- Florence-2 semantic-region experiment.
- Debug overlays and aggregate metrics only.

Post-capture path:

- Higher-cost semantic analysis after capture/import only.
- Backend/self-hosted/API VLM can remain useful here.

Blocked/not-now:

- live cloud VLM as default.
- frame upload for live guidance.
- Florence-2 production live integration.
- Depth Anything production bundle.
- dataset crawler / provider labeling run.

## Cadence Plan

Every frame:

- camera preview.
- existing UI overlay rendering.
- no heavy model by default.

5-10 FPS:

- face/person rectangle if device allows.
- body pose if stable.
- composition signal smoothing.

1 FPS or lower:

- expensive saliency/segmentation.
- Depth Anything fallback only in debug/approved benchmark.
- Florence-2 debug semantic regions only in debug/post-capture.

After capture:

- richer Photo Advisor / post-capture analysis.
- optional backend VLM benchmark paths.

## Internal Typed Contract

### LiveFrameSignals

```json
{
  "schemaVersion": "live_frame_signals.v1",
  "sourceFrameBucket": "ephemeral_preview",
  "timestampBucket": "current_session_only",
  "geometry": {},
  "depth": {},
  "semanticRegions": {},
  "composition": {},
  "retroIntent": {},
  "safety": {},
  "productionReady": false
}
```

### GeometrySignals

- `subjectPresent`
- `subjectBoxNormalized`
- `faceBoxNormalized`
- `bodyBoxNormalized`
- `poseKeypointBuckets`
- `subjectCenter`
- `edgeMarginBucket`
- `headroomBucket`
- `footroomBucket`
- `subjectSizeRatioBucket`
- `ruleOfThirdsBucket`
- `verticalBalanceBucket`

### DepthSignals

- `depthState`: `hardwareDepthAvailable`, `portraitMatteAvailable`, `depthUnavailable`, `modelFallbackDebugOnly`
- `foregroundBackgroundSeparationBucket`
- `subjectDistanceBucket`
- `depthConfidenceBucket`

### SemanticRegionSignals

- `source`: `none`, `vision_only`, `florence_debug`, `post_capture_provider`
- `regionKinds`: bounded enum only.
- `regionBoxesNormalized`
- `regionMasksAvailable`
- `rawTextRejected`

### CompositionSignals

- `framingTensionBucket`
- `negativeSpaceBucket`
- `edgeCrowdingBucket`
- `subjectBalanceBucket`
- `backgroundLayeringBucket`
- `backlightSilhouetteBucket`
- `motionOrTiltStyleBucket`

### RetroIntentSignals

- `preserveGrain`
- `preserveBlur`
- `preserveShadow`
- `preserveBacklight`
- `preserveUnusualFraming`
- `suggestedFilterFamilyBucket`

### AdvisorHintCandidate

- `observationKey`
- `moodKey`
- `retroIntentKey`
- `optionalActionKey`
- `priorityBucket`
- `cooldownBucket`
- `showHint`

### SafetyFlags

- `sensitiveInferenceBlocked`
- `identityInferenceBlocked`
- `scoreLanguageBlocked`
- `retakeFirstBlocked`
- `rawOutputBlocked`
- `debugOnlyBlocked`

## Missing Or Invalid Output

If any signal is missing:

- use lower-tier signals.
- keep prior hint briefly if still valid.
- show no hint if confidence is low.
- never invent a subject.
- never bypass safety.

If model output is invalid:

- reject it.
- return sanitized bucket only.
- do not show raw output.

## Risks / Blockers

- Signal flicker.
- Competing hints.
- Device thermal/FPS impact.
- Coordinate mismatch.
- Free-form model output.
- Over-guidance that distracts from shooting.

## Privacy And Safety Notes

- Live signals are ephemeral.
- No raw frames, GPS, EXIF, raw sensor streams, face descriptors, identity data, or sensitive attributes.
- Debug overlays must be internal/debug only.
- App UI shows final language-pack-driven copy only.

## Suggested Phases

- Phase 21-A: Vision geometry.
- Phase 21-B: hardware depth capability.
- Phase 21-C: Depth Anything debug benchmark.
- Phase 21-D: Florence feasibility.
- Phase 21-E: dataset/labeling skeleton.
- Phase 22+: debug overlays after 21-A/B.

## Do Now / Do Later / Do Not Do

Do now:

- Define contracts and implement Vision geometry first.

Do later:

- Add hardware depth.
- Add debug-only expensive models.
- Add post-capture richer analysis.

Do not do:

- Do not upload preview frames.
- Do not add live cloud AI.
- Do not let models write final UI copy.

## Concrete Next Codex Prompt

`Phase 21-A - On-device Vision Geometry Spike: implement LiveFrameSignals v1, GeometrySignals, CompositionSignals, and AdvisorHintCandidate with Apple Vision / AVFoundation only. No Depth Anything, no Florence, no cloud, no upload, no model files, no production rollout. Keep productionReady:false.`

