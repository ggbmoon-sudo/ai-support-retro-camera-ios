# Gemini Live Implementation Notes

This document summarizes Gemini Live technical research for future live camera / multimodal interaction work.

Phase 14R is documentation-only. It does not authorize Gemini Live implementation, API calls, backend work, credentials, WebSocket sessions, video upload, voice input, or Phase 14 implementation.

## Executive Summary

Gemini Live is relevant to the long-term roadmap, especially for a future voice + visual camera assistant. It should not be used as the MVP live guidance engine.

The most important research conclusion is that live camera guidance should not begin as live cloud video streaming. For this app, the safer path is:

1. Mock UX.
2. Local rule-based / Vision prototype.
3. Low-frequency server-side snapshot guidance.
4. Gemini Live experimental prototype.

## Realtime Session Model

Gemini Live-style integrations use a realtime session model, typically over WebSocket / WSS.

Implementation topics for future research:

- Session start and stop.
- Connection recovery.
- Audio input / output streaming.
- Image or frame input limits.
- Backpressure.
- Interruption / barge-in behavior.
- Context window growth and compression.
- Rate limits.
- Preview model availability.

These topics should be rechecked against official Gemini documentation before any production work.

## Camera Frame Strategy

Do not treat Gemini Live as a high-FPS camera computer-vision pipeline.

Recommended future strategy:

- Keep the local camera preview smooth at normal preview frame rates.
- Split any future AI input path from the preview path.
- Send low-frequency images only when explicitly enabled.
- Downscale snapshots.
- Compress snapshots.
- Rate-limit snapshot upload.
- Stop snapshot upload when guidance is off.

Phase 16 should use a low-frequency image / snapshot approach before any Gemini Live experiment.

Phase 14 must not read, analyze, upload, or stream video frames.

## Credential Direction

Never hardcode a Gemini API key in the iOS app.

Future production direction:

- Use server-side credential handling.
- If direct client realtime integration is required, use a server-issued short-lived credential or ephemeral token pattern.
- Keep long-lived provider keys outside the app.
- Scope credentials narrowly.
- Add expiry and revocation.
- Add abuse and quota controls.

Phase 14R and Phase 14 must not add API keys, secrets, Firebase project IDs, `.env`, `.firebaserc`, `GoogleService-Info.plist`, or production config.

## Backend Direction

Server-side snapshot guidance can be handled by a normal backend / callable-style request in a future phase.

Realtime WebSocket mediation is a different architecture from the current local/mock MVP and should not be introduced early.

Future research should decide whether a realtime prototype needs:

- Direct client to Gemini Live with ephemeral credentials.
- Backend broker.
- WebSocket-capable service.
- Cloud Run-like service rather than callable functions for long-lived connections.

No backend changes should be made in Phase 14R or Phase 14.

## Cost And Rate-Limit Notes

Realtime multimodal sessions can create continuous cost even when the user has not captured a photo.

Cost controls needed before any real integration:

- User opt-in.
- Session timeout.
- Rate limits.
- Snapshot frequency caps.
- Quota / entitlement plan.
- Model and provider feature flags.
- Clear off switch.
- Logging without raw image/audio payloads.

Production work must re-check:

- Official Gemini Live docs.
- Current model names.
- Pricing.
- Rate limits.
- Preview / GA status.
- Data handling terms.
- Ephemeral token availability.
- Session duration limits.

## MVP Exclusions

Do not use Gemini Live in the MVP.

Do not add:

- Live video streaming.
- Continuous viewfinder upload.
- Client-hardcoded API keys.
- Always-on visual assistant.
- Always-on microphone.
- Voice assistant.
- Cloud video AI.
- Gemini Live as the default camera guidance engine.

Gemini Live belongs in a future experimental phase after local guidance and snapshot guidance are understood.
