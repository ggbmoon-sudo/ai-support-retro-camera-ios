# Phase 21-A4 - On-device Live Framing Hint UX Pass

Status: implemented, pending Xcode physical-device verification  
Date: 2026-06-21  
Production readiness: `productionReady:false`

## Summary

Phase 21-A4 improves the local-only live framing hint UX using the existing Apple Vision / AVFoundation signal path. It does not add cloud AI, model files, Core ML inference, Depth Anything runtime, Florence runtime, preview-frame upload, provider keys, backend/iOS upload payload changes, raw frame persistence, or production rollout.

## Completed Work

- Changed the expanded live guidance panel action from debug-style state cycling to a local `Next hint` action when the app is in local guidance mode.
- Added manual hint cycling so users can rotate through the currently visible local hint candidates without waiting for the next frame signal.
- Added category-specific icons for lighting, composition, background, portrait, and filter suggestions in compact and expanded hint UI.
- Added English and Traditional Chinese localization for `camera.guidance.action.next_hint`.

## Product Boundary

- Guidance remains mood-first, non-judgmental, and creative-intent preserving.
- No score, rating, harsh critique, retake-first copy, identity inference, age/gender/emotion/attractiveness inference, or other sensitive inference was added.
- The app still uses local geometry/depth/signal buckets only; it does not upload preview frames.

## Xcode Verification Needed

- Build and run on iPhone.
- Open Camera with local guidance enabled.
- Confirm compact hints use category icons instead of always showing sparkles.
- Expand the guidance panel and confirm `Next hint` cycles visible local hints when more than one hint is available.
- Confirm the action is dimmed/disabled when only one local hint is available.
- Confirm Camera filter preview, selfie mirror parity, flash behavior, and focal crop still work.
- Confirm there is no Camera cloud AI entry, provider/model key, preview-frame upload, upload payload change, model runtime, or production rollout.

## Next Recommended Step

MacBook/Xcode physical-device verification for Phase 21-A4.
