# Phase 21-A7 - Camera Runtime Non-composition Polish

Status: implemented, pending MacBook/Xcode physical-device verification  
Date: 2026-06-21  
Production readiness: `productionReady:false`

## Summary

Phase 21-A7 is a focused Camera runtime polish pass after Phase 21-A6 suppressed app-authored composition / portrait-layout hint copy. It keeps the iOS Camera guidance layer non-composition-focused and improves the visible behavior when local Vision / AVFoundation signals do not produce a safe user-facing hint.

## Completed Work

- Added a local guidance fallback so `LocalRuleBasedGuidanceProvider` returns the existing safe local-unavailable hint when current local signals produce no visible suggestion after A6 filtering.
- Added a shared compact guidance icon decision in `CameraViewModel`.
- Updated both compact guidance pill surfaces in `CameraView` to use the shared icon decision.
- Avoided the `sparkles` suggestion icon for local guidance when there is no visible local hint.
- Kept lighting, filter, and unavailable-state hint behavior available.
- Kept app-authored composition / portrait-layout hint copy suppressed.

## Runtime Behavior

- If local frame signals only contain suppressed composition / portrait-layout signals, the UI now falls back to the safe local-unavailable hint instead of showing an empty suggestion surface.
- If the compact pill has no visible suggestion, local mode uses a plain local guidance icon rather than a suggestion-like sparkle icon.
- Mock guidance remains available for internal/demo behavior without composition / portrait-layout sample copy.

## Boundary Confirmations

- Provider/model/cloud call: no
- Camera live cloud AI entry: no
- Preview-frame upload: no
- Upload payload changed: no
- Raw frame/depth/image persistence: no
- Dataset crawler added: no
- AI-assisted labeling run added: no
- User-photo training added: no
- Depth Anything runtime added: no
- Florence runtime added: no
- Core ML model inference run: no
- Sensitive inference added: no
- Scoring/rating language added: no
- Retake-first language added: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Build and run on iPhone. Confirm:

- Local guidance still shows safe lighting / filter / unavailable hints.
- Local guidance does not show app-authored composition / portrait-layout hints.
- When only suppressed geometry signals are present, the expanded guidance surface is not blank and uses the safe unavailable fallback.
- Compact local guidance uses a plain guidance icon instead of `sparkles` when there is no visible suggestion.
- `Next hint` remains disabled when only one hint is visible.
- Camera capture, live filter preview, selfie mirror parity, flash, and focal crop behavior remain unchanged.

## Ready for Next Phase

Current recommended next step is `Phase 21-A7-VERIFY - Camera Runtime Non-composition Polish Physical-device QA`. Do not add another app-side composition rules phase unless the training-AI branch first defines typed composition outputs and safety gates.

Not ready for production rollout.
