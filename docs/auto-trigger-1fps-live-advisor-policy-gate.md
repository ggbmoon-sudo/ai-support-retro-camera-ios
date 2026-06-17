# Auto-Trigger + 1 FPS Live Advisor Policy Gate

Status: Phase 21-J planning/gate/source-audit only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-J defines the future Auto-Trigger + 1 FPS Live Advisor policy before any runtime implementation. It turns the stillness threshold, `<=1s` no-capture/no-upload rule, sparse cloud analysis cadence, consent/no-silent-upload boundary, off state, throttle/backoff, compression/upload relationship, and future WSS relationship into gateable policy.

This phase does not implement Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, image upload, image compression runtime, iOS payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

## Current Implementation Audit

This audit is source-level only and should be re-run before any future implementation phase.

| Area | Current status | Notes |
| --- | --- | --- |
| Auto-Trigger runtime | not found | No source path was found that automatically captures/uploads frames based on stillness. |
| Camera live cloud AI runtime entry | not found for live cloud runtime; mock-only Camera snapshot exists | Existing `CloudSnapshotGuidance*` files and localization are pre-existing mock-only boundaries. They do not implement live cloud Auto-Trigger. |
| WSS runtime | not found | No `WebSocket` / `wss://` runtime path was found in the current source audit. |
| Stillness `>1s` trigger logic | not found | Current CoreMotion sampling summarizes short-window motion/level buckets for capture context; it does not implement an Auto-Trigger threshold timer for cloud upload. |
| 1 FPS cloud-analysis cadence | not found | No current live cloud cadence or frame analysis loop was found. |
| iOS frame upload runtime | partial / debug post-capture only | Existing DEBUG post-capture CloudAI path can build a compressed request for `v1/ai/photo-advisor`, but Phase 21-J does not modify it and does not add live frame upload. |
| Local motion/stability signal | implemented locally / partial | `CameraCaptureDeviceSignalMonitor` uses CoreMotion at about 12 Hz and snapshots level/motion buckets for local capture context. This is local-only capture intelligence, not cloud Auto-Trigger. |
| Existing Camera snapshot/mock files | mock-only / pre-existing | Existing mock snapshot guidance says no background upload, no streaming, no provider key, and no saved cloud request payload. |

## Future Auto-Trigger Policy

Future Auto-Trigger is eligible only when:

- the user explicitly enables Live Advisor.
- visible consent is accepted before cloud analysis.
- the app has a local device/viewfinder stability signal.
- the stability signal is certain enough to evaluate.
- the viewfinder has been stable for greater than 1 second.
- Phase 21-I compressed preview payload policy is satisfied.
- backend mediation, metadata stripping, rate limit, off state, and backoff policies are satisfied.

If stability is unknown or uncertain, the flow must fail closed.

`productionReady:false` remains locked.

## Stillness Threshold Policy

The future threshold is:

- stable for greater than 1 second.

The threshold must be based on local device/viewfinder stability buckets, not cloud-side frame sampling. The policy should not require uploading frames to decide whether the app is stable enough to upload.

## `<=1s` No-capture / No-upload Rule

If stable time is less than or equal to 1 second:

- do not capture a frame.
- do not upload.
- do not call backend.
- do not call model.
- do not retry to create another upload.
- keep UI in local/off/waiting state.

This rule must be explicit and fail-closed.

## 1 FPS Cloud-analysis Cap

Future cloud VLM frame analysis must be capped at max 1 FPS.

The app must not:

- treat the camera preview as 30fps video.
- stream raw camera video to the cloud.
- upload repeated frames without trigger eligibility.
- retry in a way that creates extra uploads beyond policy.

Each eligible cloud frame must follow Phase 21-I compressed preview payload policy.

## Relationship to Image Compression / Upload Policy

Phase 21-I is a prerequisite for future Live Advisor upload:

- compressed preview payload only.
- planning target around `1024px` long edge and `150KB-200KB` JPEG preview, exact values to be tested later.
- metadata stripping required.
- visible consent required.
- retention/deletion dependency required.
- backend-mediated only.
- no original full-resolution upload by default.
- no raw path, GPS, raw EXIF, raw sensor, raw capture context, provider/model fields, model URL, API key, or raw prompt.

Auto-Trigger cannot bypass this policy.

## Relationship to Future Stateful WSS

Future WSS may be used only after a separate protocol preflight.

WSS may eventually carry:

- session state.
- throttle state.
- server busy/backoff state.
- short structured advice.

WSS must not:

- stream raw camera video.
- run at 30fps.
- bypass the backend gateway.
- allow iOS to talk directly to a model server.
- create extra uploads through retry loops.

WSS runtime remains blocked in Phase 21-J.

## Consent / No-silent-upload Policy

No silent upload is allowed.

Future Live Advisor must show:

- explicit opt-in.
- visible consent/privacy wording.
- clear on/off state.
- when cloud analysis is active.
- what type of compressed preview may be uploaded.

Off must mean no capture, no upload, no backend call, and no model call.

## Disable / Off State Policy

The disabled state must block:

- frame capture for cloud analysis.
- upload.
- backend calls.
- model calls.
- WSS session startup.
- retries.

The disabled state must be honored even if device stillness exceeds 1 second.

## Throttle / Backoff Policy

Future runtime must respect:

- max 1 FPS cloud analysis.
- server busy state.
- retry/backoff policy.
- no retry loop that creates extra uploads.
- fail-closed behavior on uncertain state.

If the server is busy, unavailable, or policy state is unclear, the app should stay local/off/waiting and not upload additional frames.

## Local On-device CV Relationship

Local iOS CV may run at camera/UI rate for fast aids:

- grid alignment.
- horizon/level.
- exposure warnings.
- motion/stability buckets.

Local CV must remain local-only. It must not persist raw sensor streams, GPS, raw EXIF, or raw frame data.

Cloud VLM should handle higher-level composition, mood, and retro intent only after consent, stillness, compression, upload, rate-limit, and backend gates pass.

Runtime local CV expansion remains for a later phase.

## Backend Validation Requirements

Future backend validation must reject:

- runtime Auto-Trigger without explicit approval.
- missing `>1s` stillness policy.
- missing `<=1s` no-capture/no-upload rule.
- max cloud-analysis cadence above 1 FPS.
- silent upload.
- missing consent.
- missing disabled/off-state enforcement.
- missing compressed preview policy.
- missing metadata stripping.
- missing backend mediation.
- raw video streaming.
- unsafe retry policy.
- missing backoff/server busy policy.
- provider/model fields in iOS payload.
- model calls, Qwen inference, benchmark execution, or `productionReady:true` in planning phases.

Backend validator and safety/fallback gates remain the source of truth.

## iOS Boundary Requirements

iOS must not:

- add Auto-Trigger runtime in this phase.
- add Camera live cloud AI runtime entry in this phase.
- add WSS runtime in this phase.
- add image upload runtime in this phase.
- modify image compression runtime in this phase.
- modify upload payload in this phase.
- contain provider/model keys.
- directly call provider/model servers.
- upload capture context.
- depend on Windows local paths or local model server URLs.

## Stop Conditions

Stop before future implementation or test if any of these are true:

- repo dirty or upstream not `0 0`.
- Auto-Trigger, Live Advisor, Camera cloud entry, WSS, or upload runtime is enabled without explicit approval.
- stillness threshold is missing or not greater than 1 second.
- `<=1s` no-capture/no-upload rule is missing.
- cloud-analysis cadence is above 1 FPS.
- silent upload is allowed.
- consent is missing.
- off/disabled state does not block capture/upload/cloud calls.
- compression/upload policy from Phase 21-I is missing.
- metadata stripping is missing.
- backend mediation is missing.
- raw video streaming is allowed.
- retry policy can create extra uploads.
- backoff/server busy policy is missing.
- provider/model fields appear in iOS.
- model calls, Qwen inference, fixture inference, serving benchmark, app-facing endpoint, production endpoint, or `productionReady:true` appears.
- raw prompt, raw image, base64, raw path, GPS, raw EXIF, raw sensor stream, request payload, model output, provider response, or secret would be logged or persisted.

## productionReady:false Boundary

`productionReady:false` remains locked.

Passing Phase 21-J means only that future Auto-Trigger + 1 FPS Live Advisor policy is documented and gate-tested. It is not runtime approval, not cloud upload approval, not iOS approval, not WSS approval, not endpoint approval, not model-call approval, not Qwen approval, not serving benchmark approval, and not production rollout.
