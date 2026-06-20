# Phase 21-A3 - Live Vision Geometry Smoothness and Hint Stability Tuning

Status: implemented, pending Xcode verification
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-A3 tunes the already-working on-device Apple Vision live guidance path for smoother physical-device behavior. The user confirmed brightness guidance and Vision geometry guidance run on device, but the geometry hints felt not fully smooth.

This phase keeps the path free, local-only, and on-device. It does not add Depth Anything runtime, Core ML inference, cloud AI, provider calls, upload, raw frame persistence, or production rollout.

## Tuning Changes

- Reduced live frame analysis interval from `0.6s` to `0.5s` for slightly faster perceived response.
- Increased hint stability hold from `2s` to `3s`.
- Increased repeat cooldown from `4s` to `6s`.
- Increased replacement confirmation from `2` to `3` consecutive candidate batches.
- Added a `1.2s` minimum visible duration before higher-priority hints can replace the current hint.
- Raised body-pose point confidence from `0.2` to `0.35`.
- Required at least `4` body-pose points before body bounds are accepted.
- Relaxed geometry warning thresholds to reduce jitter:
  - center tolerance widened.
  - near-edge threshold narrowed.
  - headroom / footroom thresholds made less sensitive.
  - subject size thresholds made less eager.
  - rule-of-thirds tolerance narrowed.
- Removed automatic positive geometry hints for rule-of-thirds / vertical balance so the UI does not flip into "ready" messages when no action is needed.

## Runtime Boundary

- Apple Vision / AVFoundation only.
- Preview frames remain ephemeral and in memory.
- No raw frame, raw image, GPS, EXIF, raw sensor stream, face descriptor, identity data, or sensitive attribute is persisted.
- No preview frame upload.
- No backend endpoint or upload payload change.
- No provider SDK, provider API key, model API key, or direct provider/model call in iOS.
- No Camera live cloud AI entry.

## Xcode Verification Needed

On iPhone:

- Open Camera with local guidance enabled.
- Move a person/face slowly near frame edges.
- Move headroom near the top edge.
- Move subject from center to side and back.
- Confirm hints feel less jumpy.
- Confirm lighting hints still respond.
- Confirm no Camera crash, upload, cloud AI entry, provider key, raw frame/depth logging, or production rollout appears.

## Next Recommendation

Next practical step:

- `Phase 21-A3-R1 - Physical-device Live Guidance Tuning Feedback Pass`

Use direct iPhone feedback to adjust thresholds again only if needed. Keep Depth Anything benchmark work paused unless the exact C-R3-RUN approval, local ignored artifact, and physical-device benchmark scope are ready.
