# Device Capability Matrix for Live AI

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

The app should use an iOS-first tiered capability system. Apple Vision-only live geometry is the broadest candidate. Hardware depth should be enabled only when the camera/device reports support. Depth Anything V2 Small and Florence-2-base should be disabled by default and gated by benchmark, thermal, FPS, and battery evidence.

Recommendation: implement feature degradation by device capability and runtime health, not by optimistic model assumptions.

## Why This Matters For Our App

Live framing must protect camera FPS and battery. A retro / film / Dazz-like camera should feel immediate; guidance is secondary to shooting.

## Proposed Device Tiers

Tier 0: no live AI

- static tips only.
- older or constrained devices.
- low power / thermal state.

Tier 1: Vision-only low FPS

- face/person rectangles or saliency at low cadence.
- no depth model.
- no Florence.

Tier 2: Vision + hardware depth

- AVFoundation reports hardware depth or portrait matte capability.
- depth used as ephemeral composition bucket.

Tier 3: Vision + Depth Anything fallback

- disabled by default.
- only after Phase 21-C benchmark passes.
- high-tier devices only until proven otherwise.

Tier 4: experimental Florence-2 debug / post-capture

- debug-only or post-capture-only.
- no live production until benchmark proves memory/latency/thermal safety.

## iPhone Generation Guidance

Needs benchmark before support claims:

- A12 / A13 older devices: Tier 0-1 likely.
- A15 / A16 mid devices: Tier 1-2 likely; Depth Anything only if benchmark passes.
- A17 Pro / A18 Pro high-end devices: best candidate for Tier 3 debug; Florence still debug/post-capture only.
- iPad / M-series: useful benchmark sandbox; do not generalize to iPhone production.

## iOS Version Considerations

Use the minimum iOS version already targeted by the app and gate APIs at runtime:

- Vision request availability.
- AVFoundation depth availability.
- Core ML model execution support.
- thermal state and process info.

Do not fail app launch if an API is unavailable.

## Runtime Capability Detection

Detect:

- device model/tier bucket.
- iOS version.
- camera format/depth support.
- thermal state.
- low power mode.
- current preview FPS health.
- memory pressure.
- feature flags/debug flags.

Decision output:

```json
{
  "liveAiTier": "tier_1_vision_only_low_fps",
  "visionGeometryEnabled": true,
  "hardwareDepthEnabled": false,
  "depthAnythingEnabled": false,
  "florenceDebugEnabled": false,
  "reasonBuckets": ["depth_unavailable", "experimental_models_disabled"],
  "productionReady": false
}
```

## Graceful Degradation

- If Vision fails: show no hint or static tips.
- If depth unavailable: use 2D composition only.
- If thermal state rises: reduce cadence or disable.
- If FPS drops: disable expensive requests.
- If model output invalid: reject and continue with simpler signals.

## Benchmark Logging

Allowed:

- device tier bucket.
- latency bucket.
- FPS bucket.
- thermal bucket.
- memory bucket.
- accepted/rejected signal counts.

Banned:

- raw photos.
- raw frames.
- GPS.
- EXIF.
- raw sensor streams.
- face descriptors.
- raw model output.
- raw file paths.

## Android Future Note

Current app is iOS-first, so Android should be ignored for implementation now. If researched later, compare:

- TensorFlow Lite.
- GPU delegate.
- NNAPI legacy / Android 15 deprecation context needs source verification.
- AICore / Gemini Nano only as separate future research.

## Risks / Blockers

- unsupported devices.
- thermal throttling.
- battery drain.
- camera FPS drops.
- API availability differences.
- app size for model bundles.

## Privacy And Safety Notes

On-device inference reduces cloud exposure but does not remove privacy obligations. Do not store or transmit raw camera data.

## Suggested Phases

- Phase 21-A: establish Vision-only baseline.
- Phase 21-B: depth capability probe.
- Phase 21-C/D: benchmark experimental models.
- Phase 22+: feature flag/debug overlays.

## Do Now / Do Later / Do Not Do

Do now:

- Define iOS-first tiers.
- Build Vision-only first.

Do later:

- Add benchmark-driven feature flags.
- Add runtime capability matrix tests.

Do not do:

- Do not enable experimental models by default.
- Do not claim device support without benchmark.

## Concrete Next Codex Prompt

`Phase 21-A - On-device Vision Geometry Spike: add runtime-safe Vision geometry capability detection and low-FPS signal generation only. No model files, no depth fallback model, no Florence, no cloud, no upload. Keep productionReady:false.`

