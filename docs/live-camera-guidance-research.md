# Live Camera Guidance Research

This document summarizes the Live Camera Guidance research direction for the camera-first local/mock MVP.

Phase 14R is documentation-only. It does not authorize Phase 14 implementation, Apple Vision integration, Gemini Live integration, backend work, persistence, upload, export, or production service setup.

## Executive Summary

Live Camera Guidance is a strong long-term product direction because it moves photo coaching from post-capture critique to pre-capture improvement. For the target user, the product value is not a long AI lecture; it is a short camera-friendly hint that reduces failed shots before the shutter is pressed.

The recommended strategy is staged:

- Phase 14: mock UX only.
- Phase 15: local rule-based / Apple Vision prototype.
- Phase 16: server-side low-frequency snapshot AI.
- Phase 17: Gemini Live voice + visual assistant research prototype.

The important product decision is to avoid treating the viewfinder as a continuous cloud video AI stream. Most early guidance types can be designed, mocked, and later prototyped with local signals before any cloud AI is needed.

## Phase Boundaries

### Phase 14: Mock UX Only

Goal:

- Design the live guidance camera overlay.
- Add the guidance toggle, mock state, and short example suggestions.
- Validate whether guidance can coexist with capture controls, filter picker, Photo Picker fallback, and the camera-first shell.

Must not do:

- No Vision.
- No frame analysis.
- No video frame reading.
- No frame upload.
- No Gemini Live.
- No real AI.
- No backend.
- No persistence.
- No claim that guidance is real AI.

### Phase 15: Local Rule-Based / Apple Vision Prototype

Goal:

- Prototype local guidance signals on device.
- Explore brightness, over-dark / over-bright, subject position, face box, headroom, tilt, blur, and simple composition heuristics.
- Keep processing local.
- Measure device performance, frame rate, battery, and UI stability.

Potential inputs:

- AVFoundation frame sampling.
- Apple Vision face / saliency / body pose / horizon capabilities where appropriate.
- Local rule engine and suggestion composer.

Must not do:

- No cloud video AI.
- No default frame upload.
- No Gemini Live production path.
- No complex pose coaching.

### Phase 16: Server-Side Snapshot Guidance

Goal:

- Explore low-frequency still-frame / snapshot guidance after local UX and local signals are stable.
- Use user-triggered or heavily throttled low-resolution snapshots.
- Route requests through backend/server-side credentials only.
- Return structured suggestions, not long text.

Recommended approach:

- Do not stream the viewfinder.
- Use low-frequency snapshots, for example manual trigger or every few seconds only when explicitly enabled.
- Add privacy consent, rate limits, provider controls, and cost gates before any real provider call.

Must not do:

- No continuous viewfinder upload.
- No API keys in iOS.
- No unmanaged provider calls.

### Phase 17: Gemini Live Voice + Visual Assistant

Goal:

- Research Gemini Live as an experimental voice + visual assistant after local and snapshot guidance paths are understood.
- Treat it as an optional prototype, not the MVP guidance engine.

Research topics:

- Realtime session lifecycle.
- WebSocket connection behavior.
- Audio routing and interruption.
- Ephemeral token / server-issued credential flow.
- Visual input limits and cost controls.
- Privacy consent and visible recording / upload state.

Must not do:

- Do not make Gemini Live the MVP main engine.
- Do not ship without re-checking official Gemini Live documentation, pricing, rate limits, model availability, and preview status.

## Guidance Types

High-priority guidance types for future local prototype:

- Subject position.
- Headroom.
- Rule-of-thirds / composition alignment.
- Low-light warning.
- Over-bright warning.
- Tilt / horizon warning.
- Blur / hand-shake warning.

Medium-priority types:

- Background clutter.
- Filter recommendation.
- Lens / distance suggestion.
- Backlight warning.

Low-priority or future-only types:

- Complex pose coaching.
- Shot timing.
- High-level aesthetic critique.
- Scene-aware creative direction.
- Conversational visual coaching.

## Technical Direction

Recommended future architecture:

```text
Camera Screen
├─ LiveGuidanceOverlayView
├─ LiveGuidanceToggleView
├─ LiveGuidanceViewModel
├─ LiveGuidanceProvider
│  ├─ MockLiveGuidanceProvider
│  ├─ FutureLocalRuleBasedGuidanceProvider
│  ├─ FutureVisionGuidanceProvider
│  ├─ FutureCloudSnapshotGuidanceProvider
│  └─ FutureGeminiLiveGuidanceProvider
├─ SuggestionComposer
└─ SuggestionThrottler
```

For Phase 14, only the mock provider should exist in implementation. The future provider names should guide architecture and naming, but future providers must remain placeholders or comments only unless later explicitly scoped.

## MVP Exclusions

The following should not enter the MVP:

- Real-time cloud video AI.
- Continuous viewfinder upload.
- Gemini Live as the MVP main engine.
- Complex pose coaching.
- AR / 3D overlay.
- Always-on cloud guidance.
- Default frame upload.
- Any guidance that implies real AI when only mock hints exist.

## Privacy And App Store Notes

Local-only guidance has the lowest privacy risk because frames do not leave the device.

Any future snapshot or cloud guidance must add:

- Clear consent.
- Visible upload / cloud guidance status.
- Easy off switch.
- Privacy policy updates.
- App Store privacy label review.
- Provider data handling review.
- Cost, quota, and rate-limit controls.

Phase 14 should use wording such as mock guidance, preview guidance, or local demo guidance. It must not imply real AI, real Vision analysis, or cloud analysis.
