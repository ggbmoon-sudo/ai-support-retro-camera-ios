# Image Compression + Upload Payload Policy Gate

Status: Phase 21-I planning/gate/source-audit only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-I defines the future image compression and upload payload policy before any new iOS/backend upload runtime, Live Advisor runtime, Auto-Trigger runtime, WSS runtime, app-facing endpoint, or production endpoint is implemented.

This phase is not upload approval. It does not add image upload runtime, image compression runtime, iOS payload changes, cloud AI runtime, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

The policy target is a backend-mediated, consented, metadata-stripped compressed preview frame only. The future Live Advisor direction remains sparse and gated: stillness must be greater than 1 second, stability less than or equal to 1 second means no capture and no upload, and cloud analysis cadence must be at most 1 FPS.

## Current Implementation Audit

This audit is source-level only and should be re-run before any future implementation phase.

| Area | Current status | Notes |
| --- | --- | --- |
| Real cloud image upload path | partial / debug-gated | `ios-app/AIPhotoApp/Services/CloudAI/CloudAIEndpointClient.swift` contains a DEBUG-only `URLSession` POST to `v1/ai/photo-advisor`. The default app flow remains mock/local unless explicitly configured for debug remote behavior. |
| iOS compression before cloud upload | partial / existing debug scaffold | `ios-app/AIPhotoApp/Services/CloudAI/CloudAIImageCompressor.swift` already resizes to a default max long edge of `1024`, writes JPEG with quality `0.7`, and marks `metadataStripped:true` for the DEBUG post-capture cloud path. Phase 21-I does not modify it. |
| Current Post-capture Advisor | mock/local by default, backend-mediated only in debug/internal path | `PhotoAdvisorViewModel` defaults to `MockPhotoAdvisorService`. DEBUG `analyzeCloudDebug` can build a compressed cloud input and call `RemoteCloudAIService(mode: .debugRemoteMock)`, then falls back to local/mock on failure. |
| iOS upload payload capture context | not found in current cloud request model | `CloudAIPhotoAdvisorRequest` includes consent, image metadata/data, client, locale, mode, and selected filter ID. It does not include `CameraCaptureContext` in the cloud request model observed in this audit. |
| Raw image/base64/path/GPS/EXIF/sensor persistence | not found for persistence; base64 exists in debug JSON payload model | `CloudAIRequestImage` currently encodes compressed image data as `dataBase64`. No file path, GPS, raw EXIF, or raw sensor stream fields were found in the iOS cloud request model. Base64 remains a current debug/post-capture payload shape and is not approved for future Live Advisor policy unless explicitly re-approved. |
| Camera live cloud AI entry | existing mock-only Camera snapshot boundary; no new live runtime | Existing `CloudSnapshotGuidance*` source and localization describe a mock-only Camera AI snapshot boundary from earlier phases. Phase 21-I does not add a live cloud AI entry, Auto-Trigger, WSS, or background frame upload. |
| Backend request validator | partial / existing post-capture base64 validator | `backend/src/validators/validatePhotoAdvisorRequest.mjs` validates the existing debug/internal Photo Advisor request with consent and base64 image payload limits. Future Live Advisor upload policy still needs a separate explicit contract before runtime. |

## What Is Implemented / Not Implemented

Implemented or partial:

- DEBUG post-capture cloud endpoint client scaffold.
- DEBUG post-capture image compression scaffold.
- Backend-mediated Photo Advisor request validation for the existing post-capture path.
- Mock-only Camera snapshot guidance boundary from earlier phases.

Not implemented or still blocked:

- Future Live Advisor upload runtime.
- Auto-Trigger runtime.
- WSS runtime.
- App-facing production Photo Advisor endpoint.
- Production endpoint.
- Real user-photo upload acceptance for Live Advisor.
- Production upload compression contract.
- Capture-context upload.
- Raw original full-resolution upload.
- Auth/billing/quota runtime.
- Retention/deletion production policy.

## Future Compression Policy

Before any future cloud upload:

- The app must compress the image before upload.
- Planning target: long edge around `1024px`.
- Planning target: JPEG preview frame.
- Planning target: approximate payload size around `150KB-200KB`.
- Exact long edge, quality, and payload size must be tested later on device/network/quality samples.
- Original full-resolution upload is not allowed by default.
- Metadata stripping is required.
- GPS, raw EXIF, raw sensor data, and raw capture context are not allowed.
- If a compressed preview cannot be generated safely, the flow must fail closed.
- `productionReady:false` remains locked.

## Future Upload Payload Contract

Any future cloud upload must be backend-mediated. An app-facing endpoint remains blocked until a later explicitly approved phase.

Allowed future payload fields should be limited to:

- requestId bucket.
- sourceType.
- compressed image preview bytes or upload file field, not base64 unless explicitly approved in a later phase.
- languageCode.
- advisorMode.
- outputContractVersion.
- consent token/state.
- `productionReady:false`.

Forbidden future payload fields:

- raw original full-resolution image by default.
- base64 unless explicitly approved later.
- raw file path.
- GPS.
- raw EXIF.
- raw sensor stream.
- raw capture context unless explicitly approved later.
- provider/model fields.
- model URL.
- API key.
- raw prompt.

## Metadata Stripping Policy

Metadata stripping is mandatory for any future cloud-upload preview frame. The upload policy must reject or fail closed when metadata stripping cannot be confirmed.

Future validation should check a safe boolean/bucket such as `metadataStripped:true`; it must not log or persist raw EXIF, GPS, image path, or binary payload content.

## Consent Policy

No silent upload is allowed.

Future upload requires:

- visible user opt-in before any cloud frame upload.
- consent token/state in the backend-mediated request.
- clear wording that a compressed preview frame may be sent for cloud analysis.
- an off/disable state where no capture and no upload occurs.

Phase 21-I does not add consent UI runtime.

## Retention / Deletion Dependency

Future cloud upload remains blocked until retention and deletion behavior is explicitly defined:

- whether compressed preview frames are persisted at all.
- how long transient payloads may exist in memory or transport.
- how user deletion/account deletion affects any stored server artifacts.
- how logs avoid raw image, base64, prompt, provider response, path, GPS, EXIF, or request payload persistence.

## Capture-context Boundary

Capture context remains local-only unless a later phase explicitly approves a safe schema, consent copy, validation, payload limits, and rollout boundary.

Future upload policy must not include:

- raw motion streams.
- raw sensor streams.
- GPS.
- raw EXIF.
- raw camera file path.
- raw capture context.

If a future phase approves any capture-context upload, it must be bucketed, minimal, consented, validator-gated, and backend-mediated.

## Auto-Trigger Relationship

Future Auto-Trigger is upload-eligible only when all policy gates pass:

- Device/viewfinder stability is greater than 1 second.
- If stability is less than or equal to 1 second, do not capture a frame and do not upload anything.
- One compressed preview frame maximum per eligible tick.
- No silent upload.
- Live Advisor opt-in and visible consent are required.
- The compression, metadata stripping, retention/deletion, and backend validation policies apply to every eligible upload.

Phase 21-I does not implement Auto-Trigger runtime.

Phase 21-J now formalizes this relationship as a docs/gate/source-audit policy: stillness must be greater than 1 second; stable time less than or equal to 1 second means no capture, no upload, no backend call, and no model call; cloud analysis is capped at max 1 FPS; and runtime remains blocked.

Phase 21-K now formalizes the WSS relationship as a docs/gate/schema-policy preflight: WSS may carry backend-mediated session/throttle/backoff/advice buckets only, must not carry raw video, 30fps frames, raw image/base64/path/GPS/EXIF/sensor/prompt/model output/provider fields, and does not approve upload runtime.

## 1 FPS Relationship

Cloud AI must not treat the viewfinder as 30fps video.

Future Live Advisor cloud analysis:

- is at most 1 FPS.
- must also satisfy the stillness trigger.
- must upload only sparse compressed preview frames.
- must never stream raw camera video.

Local on-device CV may run at camera/UI cadence for lightweight aids, but cloud VLM analysis must remain sparse and consent-gated.

## Backend Validation Requirements

Future backend validation must reject:

- original full-resolution upload by default.
- base64 unless explicitly approved later.
- raw path.
- GPS.
- raw EXIF.
- raw sensor stream.
- raw capture context unless explicitly approved.
- provider/model fields from iOS.
- model URL.
- API key.
- raw prompt.
- missing consent.
- missing metadata stripping proof.
- missing retention/deletion policy.
- missing Auto-Trigger and 1 FPS policy requirements for Live Advisor.

Backend validator and safety/fallback gates must remain the source of truth.

## iOS Boundary Requirements

iOS must not:

- contain provider/model API keys.
- call a provider/model server directly.
- add a new upload payload or endpoint in this phase.
- add a Camera live cloud AI runtime entry in this phase.
- upload capture context in this phase.
- depend on Windows local paths or local model server URLs.

Any future iOS upload runtime must be debug/explicitly approved first and remain backend-mediated.

## Stop Conditions

Stop before future implementation or test if any of these are true:

- repo dirty or upstream not `0 0`.
- upload runtime is enabled without explicit approval.
- compression runtime is newly enabled by an upload policy phase.
- app-facing endpoint appears.
- production endpoint appears.
- `productionReady:true`.
- original full-resolution upload is allowed by default.
- base64 is allowed without explicit approval.
- raw path, GPS, raw EXIF, raw sensor, raw capture context, provider fields, model URL, API key, or raw prompt would be sent.
- metadata stripping is missing.
- consent is missing.
- retention/deletion policy is missing.
- Auto-Trigger policy is missing.
- 1 FPS cloud-analysis policy is missing.
- no-off/no-disable state.
- validator or safety/fallback gates are bypassed.
- raw image, base64, prompt, request payload, provider response, model output, EXIF, path, or secret would be logged or persisted.

## productionReady:false Boundary

`productionReady:false` remains locked.

Passing Phase 21-I means only that future image compression and upload payload policy is documented and gate-tested. It is not runtime approval, not upload approval, not compression-runtime approval, not iOS payload approval, not endpoint approval, not model-call approval, not Qwen approval, not serving benchmark approval, and not production rollout.
