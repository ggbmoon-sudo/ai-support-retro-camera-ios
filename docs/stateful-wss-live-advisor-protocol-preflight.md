# Stateful WSS Live Advisor Protocol Preflight

Status: Phase 21-K planning/gate/schema-policy/source-audit only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-K defines the future Stateful WSS Live Advisor session protocol before any WebSocket runtime is implemented. It turns session lifecycle, backend mediation, server busy/backoff state, retry limits, Auto-Trigger linkage, 1 FPS cloud-analysis limits, compression/upload dependency, privacy/logging rules, and iOS/backend boundary rules into gateable policy.

This phase does not implement WSS runtime, WebSocket server runtime, iOS WebSocket client runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, image upload, image compression runtime, iOS upload payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

## Current Implementation Audit

| Area | Audit result | Notes |
| --- | --- | --- |
| WSS / WebSocket runtime | not found | No backend WebSocket server or WSS runtime was found in the current source scan. |
| iOS WebSocket client | not found | No `URLSessionWebSocketTask`, `ws://`, or `wss://` iOS client runtime was found. |
| Backend WebSocket server | not found | Backend scripts and source remain HTTP/mock/gate oriented; no WebSocket server runtime is added by this phase. |
| Live Advisor session state | not found | No persistent live session channel, state machine, or WSS session lifecycle was found. |
| Server busy/backoff protocol | partial / policy only | Phase 21-J added policy gate language for backoff, but no runtime protocol exists. |
| Raw video streaming path | not found | Existing Camera copy explicitly says no continuous video stream; no raw video stream upload path was found. |
| Direct iOS-to-model/provider route | not found | Existing boundary scans keep provider/model keys and direct model routes out of iOS. |
| Camera snapshot/mock files | mock-only / pre-existing | Existing `CloudSnapshotGuidance*` and DEBUG CloudAI scaffolds are pre-existing boundaries; Phase 21-K does not modify them. |

Use cautious wording in future audits: this document records what was found during this phase, not a permanent proof that future code cannot change.

## Future WSS Purpose

Future WSS may only be used as a backend-mediated Live Advisor session channel. Its purpose is to carry small state transitions and short structured advice, not raw camera media.

WSS may carry:

- session ID bucket.
- consent state bucket.
- Live Advisor enabled/disabled state.
- client capability buckets.
- stillness eligibility bucket.
- frame eligibility state.
- throttle state.
- server busy/backoff state.
- structured short advice result keys.
- safe fallback/error state.
- `productionReady:false`.

WSS must not carry:

- raw camera video stream.
- 30fps frames.
- raw original image.
- base64 image unless a later phase explicitly approves it.
- raw file path.
- GPS.
- raw EXIF.
- raw sensor stream.
- raw prompt.
- raw model output.
- provider/model URL.
- API key.
- provider/model selection from iOS.
- raw backend request payload.
- debug/provider leakage.
- chain-of-thought.

## Session Lifecycle

Future intended lifecycle:

1. Live Advisor is closed/off by default.
2. User explicitly enables Live Advisor.
3. Consent state must be known before any cloud frame eligibility.
4. WSS session opens to the app backend only.
5. Backend sends policy/session limits.
6. Client sends only bucketed state until a later upload phase separately approves frame upload.
7. Auto-Trigger gate determines future frame eligibility.
8. If stillness is `<=1s`, the client captures no frame, uploads nothing, calls no backend model path, and makes no model call.
9. If stillness is `>1s`, future runtime may become eligible for one compressed preview frame, subject to 1 FPS, backoff, consent, and Phase 21-I upload policy.
10. Backend sends structured advice/fallback only.
11. Disabled/off state closes the session and blocks capture/upload/cloud calls.
12. Unknown consent/session/backoff/stability state fails closed.

## Client-to-backend Message Policy

Future client messages should be bucketed and minimal:

- session state bucket.
- consent state bucket.
- Live Advisor enabled/disabled state.
- device/viewfinder stillness eligibility bucket.
- throttle/backoff acknowledgement bucket.
- client capability bucket.
- request/response contract version bucket.

Client messages must not include raw prompt, provider/model fields, model URL, API key, GPS, raw EXIF, raw sensor streams, raw file path, raw backend payload, raw image bytes, base64 image, raw original image, or chain-of-thought.

Frame bytes are not approved in Phase 21-K. Any future frame upload requires a separate runtime phase after Phase 21-I and Phase 21-J policies remain satisfied.

## Backend-to-client Message Policy

Future backend messages should be structured and short:

- session accepted/rejected state.
- policy/session limits.
- server busy/backoff bucket.
- throttle state.
- frame eligibility acknowledgement/rejection bucket.
- structured advice keys.
- safe fallback/error state.
- no-production marker.

Backend messages must not expose raw provider responses, raw model output, debug provider text, internal prompts, chain-of-thought, provider/model URLs, API keys, raw request payloads, numeric confidence/rating, or sensitive inference.

## Server Busy / Backoff Policy

Future backend may send busy/backoff state. Client must respect it before any future upload.

Rules:

- retries must not create additional unapproved frame uploads.
- no silent retry loop.
- no retry may bypass 1 FPS.
- no retry when stillness is `<=1s`.
- no retry after user disables Live Advisor.
- conflicting server/client state fails closed.
- server busy state should prefer safe fallback/paused guidance over repeated uploads.

## Throttle / Rate-limit Policy

Future WSS policy must reinforce that cloud VLM frame analysis is capped at max 1 FPS.

The viewfinder must not be treated as 30fps cloud video. WSS is not a video stream. It may coordinate sparse, consented, compressed-frame eligibility only after a later upload runtime phase is approved.

## Auto-Trigger Relationship

Phase 21-J remains the trigger boundary:

- stillness must be greater than 1 second before any future frame can become eligible.
- stillness `<=1s` means no frame capture, no upload, no backend call, and no model call.
- unknown stability fails closed.
- disabled/off state blocks capture/upload/cloud calls.

WSS must not weaken or bypass the Auto-Trigger gate.

Phase 21-L now formalizes the local on-device CV side of this relationship: future local CV may provide only bucketed, in-memory stability/framing aids for local UI responsiveness, and it does not approve raw sensor/frame persistence, upload, backend calls, model calls, or runtime local CV expansion.

## 1 FPS Relationship

WSS must carry or enforce throttle state consistent with the max 1 FPS cloud-analysis policy.

No WSS message may imply continuous frame analysis, raw video streaming, 30fps upload, or repeated retry uploads.

## Compression / Upload Relationship

Phase 21-I remains the upload payload boundary:

- app-side compressed preview policy is required before any future cloud upload.
- metadata stripping is required.
- no original full-resolution upload by default.
- no base64 unless explicitly approved later.
- no GPS, raw EXIF, raw sensor stream, raw path, raw prompt, provider fields, model URL, API key, or raw capture context.
- retention/deletion policy remains a dependency before real user-photo upload.

Phase 21-K does not approve frame upload over WSS or HTTP.

## Consent / No-silent-upload Relationship

WSS session eligibility requires visible Live Advisor opt-in and known consent state before any future cloud frame eligibility.

No silent upload is allowed. Off/disabled state must close or disable the session and block capture/upload/cloud calls.

## Privacy / Logging Policy

Future WSS logs must be sanitized bucket summaries only.

Do not log or persist:

- raw images.
- raw video.
- base64 image content.
- raw prompts.
- raw request payloads.
- raw provider/model output.
- API keys or Authorization headers.
- provider/model URLs.
- GPS.
- raw EXIF.
- raw sensor streams.
- raw capture context.
- chain-of-thought.
- sensitive inference.

## iOS Boundary Policy

iOS must not:

- open WSS to a model/provider server.
- choose provider/model route.
- contain provider/model URL or API key.
- upload raw video.
- upload at 30fps.
- send raw prompt, raw payload, GPS, raw EXIF, raw sensor stream, raw capture context, raw image path, or chain-of-thought.
- bypass consent/off state.
- bypass Phase 21-I compression/upload policy.
- bypass Phase 21-J Auto-Trigger/1 FPS policy.

iOS may only use a future WSS client after a separate explicit runtime phase approves it.

## Backend / Model Boundary Policy

Backend must mediate all model calls through the existing gateway/provider boundary. WSS must not bypass validator, fallback, safety, language, routing, deployment, local-model approval, or production readiness gates.

Backend must not expose provider/model raw output or debug/provider details to the client.

## Stop Conditions

Stop immediately if a future phase attempts any of the following without explicit approval:

- WSS runtime.
- WebSocket server runtime.
- iOS WebSocket client runtime.
- Auto-Trigger runtime.
- Camera live cloud AI runtime entry.
- image upload runtime.
- image compression runtime change.
- iOS upload payload change.
- app-facing endpoint.
- production endpoint.
- direct iOS provider/model route.
- provider/model fields in iOS.
- raw video streaming.
- raw image/base64/path/GPS/EXIF/sensor/capture-context payload.
- raw prompt/model output/provider response exposure.
- chain-of-thought exposure.
- model call, Qwen inference, fixture inference, or serving benchmark.
- `productionReady:true`.

## Gate Expectations

The Phase 21-K gate validates protocol policy objects only and must report:

- WSS runtime disabled.
- WebSocket server/client runtime disabled.
- Live Advisor runtime disabled.
- Camera cloud entry disabled.
- upload runtime disabled.
- backend mediation required.
- raw video streaming blocked.
- max cloud-analysis FPS bucket capped at `max_1fps`.
- Auto-Trigger and compression policies required.
- consent and no-silent-upload required.
- disabled/off state blocks session/capture/upload.
- backoff policy required.
- unsafe retry blocked.
- provider fields in iOS blocked.
- raw payload/prompt/model output blocked.
- chain-of-thought and debug leakage blocked.
- `networkCallsMade:false`.
- `modelCallsMade:false`.
- `qwenInferenceRun:false`.
- `benchmarkRun:false`.
- `productionReady:false`.

## productionReady:false Boundary

`productionReady:false` remains locked.

Passing Phase 21-K means only that future Stateful WSS Live Advisor protocol policy is documented and gate-tested. It is not WSS runtime approval, not WebSocket server approval, not iOS WebSocket client approval, not upload approval, not Auto-Trigger runtime approval, not model-call approval, not Qwen approval, not endpoint approval, not serving benchmark approval, and not production rollout.
