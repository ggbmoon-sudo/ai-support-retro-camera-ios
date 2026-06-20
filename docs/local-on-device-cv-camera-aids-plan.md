# Local On-device CV Camera Aids Plan

Status: Phase 21-L planning/gate/source-audit only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-L defines the future local on-device CV camera aids plan before implementing any new runtime camera aid. It separates fast local camera/UI guidance from consented backend-mediated cloud VLM analysis, and turns grid alignment, horizon/level, exposure warning, motion/stability buckets, 60fps smoothness, Auto-Trigger linkage, privacy/data retention, and iOS/backend boundaries into gateable policy.

This phase does not implement local CV runtime, grid alignment runtime, horizon/level runtime, exposure warning runtime, motion/stability runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, image upload, image compression runtime, iOS upload payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, fixture inference, serving benchmark execution, or production rollout.

## Current Implementation Audit

This audit is source-level only and should be re-run before any future implementation phase.

| Area | Current status | Notes |
| --- | --- | --- |
| Grid overlay | implemented / pre-existing | `CameraView` contains a visual rule-of-thirds grid overlay. This is UI overlay behavior, not a new Phase 21-L runtime change. |
| Grid alignment analysis | not found | No source path was found that analyzes frame geometry and emits grid alignment guidance. |
| Horizon / level guide | partial / local buckets | `CameraCaptureDeviceSignalMonitor` and capture context snapshots include local device level buckets, but no dedicated horizon/level guide runtime is added by this phase. |
| Motion / stability signal | partial / local buckets | CoreMotion-backed capture context buckets exist for local capture intelligence; no Auto-Trigger threshold timer or upload eligibility runtime is added by this phase. |
| Exposure warning | partial / local buckets | Local image/capture context analysis includes exposure buckets; no new live exposure warning runtime is added by this phase. |
| Local CV frame analysis | partial / pre-existing | `LiveGuidance*` and `LocalImageSignalAnalyzer` files provide existing local/mock guidance building blocks. Phase 21-L does not expand or enable runtime behavior. |
| Raw frame/sensor/GPS/EXIF persistence | not found for new Phase 21-L scope | Existing policy scans did not identify a new Phase 21-L persistence path. Future audits must verify no raw frame, raw sensor stream, GPS, or raw EXIF persistence before implementation. |
| Camera aid affects cloud upload | not found | No current local camera aid was found to trigger cloud upload or model calls. |
| Camera snapshot/mock files | mock-only / pre-existing | Existing `CloudSnapshotGuidance*`, `CloudAI*`, and post-capture debug scaffolds remain pre-existing boundaries and are not changed by this phase. |

Use cautious wording in future audits: this document records what was found during this phase, not a permanent proof that future code cannot change.

## Local CV Purpose

Local on-device CV is for fast mechanical camera aids that need camera/UI-rate responsiveness and should not require cloud analysis.

Future local CV may support:

- grid alignment hints.
- horizon/level guide.
- overexposed or underexposed warning.
- basic motion/stability buckets.
- optional bucketed frame eligibility signal for a separately approved future Auto-Trigger phase.

Local CV must be optional, fail-soft, and local-only. It must not upload anything by itself, call backend, call a model, persist raw camera frames, persist raw sensor streams, persist GPS, persist raw EXIF, or export raw capture context.

## Grid Alignment Policy

Future grid alignment should remain an on-device framing aid.

Policy:

- Use lightweight local geometry/framing buckets only.
- Prefer UI hints over grading language.
- Avoid score/rating labels.
- Do not persist raw frames or alignment traces.
- Do not upload grid evidence to backend unless a later phase explicitly approves a bucketed schema.
- Do not trigger cloud upload by itself.

The existing visual grid overlay may remain a UI tool, but Phase 21-L does not add grid analysis runtime.

## Horizon / Level Policy

Future horizon/level guidance should be local and bucketed.

Policy:

- Use device/viewfinder level buckets instead of raw continuous sensor streams where possible.
- Keep any short-window motion/level calculations in memory.
- Clear state when the Camera lifecycle stops.
- Treat tilt as style context, not an automatic mistake.
- Do not persist raw gyroscope/accelerometer streams.
- Do not upload level data unless a later phase explicitly approves a bucketed schema.

Phase 21-L does not implement a dedicated horizon/level runtime.

## Exposure Warning Policy

Future exposure warnings should be local, gentle, and optional.

Policy:

- Use coarse exposure buckets such as underexposed, balanced, or overexposed.
- Treat low light, high contrast, faded color, and grain as possible retro intent.
- Avoid ¡§problem/fix/retake¡¨ framing.
- Do not persist raw frame histograms or full image data.
- Do not call cloud VLM for camera/UI-rate exposure warnings.
- Do not upload exposure evidence unless a later phase explicitly approves a bucketed schema.

Phase 21-L does not implement exposure warning runtime.

## Motion / Stability Bucket Policy

Future motion/stability guidance should be local, short-window, and bucketed.

Policy:

- Use in-memory local device/viewfinder stability buckets.
- Avoid raw continuous motion logs.
- Clear state when Camera stops.
- Treat motion blur as potentially intentional retro style.
- Do not persist raw sensor streams.
- Do not upload raw stability traces or capture context.

A future Auto-Trigger phase may consume only a separately approved bucketed stability signal.

## 60fps Camera Smoothness Target

Camera preview smoothness is the priority for local aids.

Future implementation should target 60fps UI responsiveness by default and should:

- keep analysis lightweight.
- throttle or sample analysis when needed.
- run optional aids fail-soft if performance drops.
- avoid blocking capture or preview rendering.
- prefer simple buckets over expensive frame analysis.
- keep cloud VLM out of the camera preview loop.

Exact device/performance thresholds require a later runtime implementation and device testing phase.

## Relationship to Auto-Trigger

Phase 21-J remains the Auto-Trigger boundary.

Future Auto-Trigger may consume a local stability bucket only after explicit runtime approval. Stillness greater than 1 second may make one compressed preview frame eligible only after consent, upload, WSS/session, metadata stripping, rate-limit, and backend policy gates are satisfied.

If stillness is less than or equal to 1 second:

- do not capture a frame.
- do not upload.
- do not call backend.
- do not call model.

Local stability signals must remain in-memory and bucketed. No raw gyroscope stream, raw sensor stream, GPS, raw EXIF, raw frame data, or capture-context upload is approved by Phase 21-L.

## Relationship to Live Advisor / Cloud VLM

Local CV handles fast mechanical/framing aids. Cloud VLM handles higher-level composition, mood, retro intent, and optional action only after explicit consent and trigger gates.

Cloud VLM must not be used for 60fps preview analysis. It must not receive raw video, raw camera frames by default, raw sensor data, raw GPS, raw EXIF, raw capture context, provider/model fields from iOS, or direct iOS calls.

All future cloud analysis remains backend-mediated and subject to Phase 21-I compression/upload policy, Phase 21-J Auto-Trigger/1 FPS policy, and Phase 21-K Stateful WSS protocol policy.

## Privacy / Data-retention Policy

Local CV must preserve privacy by default.

Do not persist:

- raw camera frames.
- raw video.
- raw sensor streams.
- continuous motion logs.
- GPS/location.
- raw EXIF.
- raw capture context.
- raw prompts.
- request payloads.
- model/provider output.

Any future exported signal must be separately approved, bucketed, minimal, consent-aware, and covered by retention/deletion policy before real upload.

## iOS Runtime Boundary

iOS must not add new Phase 21-L runtime behavior until a separate implementation phase explicitly approves it.

Blocked in this phase:

- local CV runtime enablement.
- grid alignment runtime.
- horizon/level runtime.
- exposure warning runtime.
- motion/stability runtime.
- Camera live cloud AI entry.
- Auto-Trigger runtime.
- WSS runtime.
- image upload runtime.
- image compression runtime changes.
- iOS upload payload changes.
- provider/model keys or direct provider/model calls.
- capture-context upload.
- MacBook/Xcode dependency on Windows local paths or local model server URLs.

## Backend / Model Boundary

Backend must not receive local CV data in Phase 21-L. The backend gate validates policy objects only and must make no network call, model call, Qwen inference, fixture inference, or serving benchmark call.

Future backend integration, if approved later, must accept only bucketed, consent-aware, schema-validated state and must not expose provider/model fields to iOS.

## Future Implementation Phases

Recommended future sequence after Phase 21-L:

1. Phase 21-M: Quantization + Serving Benchmark Plan.
2. Later iOS local CV implementation preflight for one camera aid at a time.
3. Later optional local stability bucket implementation, still local-only.
4. Later debug-only Live Advisor integration preflight after upload/WSS/Auto-Trigger policies remain satisfied.
5. Later production readiness only after explicit approval, privacy/deletion/quota/auth/monitoring checks, and `productionReady` change approval.

## Stop Conditions

Stop immediately if a future phase attempts any of the following without explicit approval:

- local CV runtime.
- grid alignment runtime.
- horizon/level runtime.
- exposure warning runtime.
- motion/stability runtime.
- Auto-Trigger runtime.
- Camera live cloud AI runtime entry.
- WSS runtime.
- image upload runtime.
- image compression runtime.
- iOS upload payload change.
- app-facing endpoint.
- production endpoint.
- direct iOS provider/model route.
- provider/model fields in iOS.
- backend call or upload from local CV.
- raw frame, raw video, raw sensor stream, GPS, raw EXIF, raw capture context, raw prompt, request payload, model output, provider response, or secret persistence/logging.
- model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, or `productionReady:true`.

## Gate Expectations

The Phase 21-L gate validates local CV camera aids plan policy objects only and must report:

- local CV runtime disabled.
- grid alignment runtime disabled.
- horizon/level runtime disabled.
- exposure warning runtime disabled.
- motion/stability runtime disabled.
- Camera cloud entry disabled.
- upload runtime disabled.
- local-only requirement enabled.
- backend calls blocked.
- upload blocked.
- raw frame/sensor/GPS/EXIF persistence blocked.
- 60fps smoothness target present.
- Auto-Trigger relationship present.
- cloud VLM boundary present.
- provider/model fields in iOS blocked.
- `networkCallsMade:false`.
- `modelCallsMade:false`.
- `qwenInferenceRun:false`.
- `benchmarkRun:false`.
- `productionReady:false`.

## productionReady:false Boundary

`productionReady:false` remains locked.

Passing Phase 21-L means only that future local on-device CV camera aids are documented and gate-tested. It is not local CV runtime approval, not grid/horizon/exposure/motion runtime approval, not Auto-Trigger runtime approval, not WSS runtime approval, not cloud upload approval, not iOS payload approval, not endpoint approval, not model-call approval, not Qwen approval, not serving benchmark approval, and not production rollout.

## Today's Direction Change Addendum

Live camera guidance should now prioritize on-device Apple Vision / AVFoundation geometry, hardware depth when available, and app-side retro-aware rules instead of cloud live VLM. Depth Anything V2 Small is only a future Core ML fallback benchmark candidate, and Florence-2-base is only a research feasibility candidate for object detection, grounding, detailed caption, and segmentation. The app rules engine remains the brain that converts coordinates, regions, depth, and typed signals into short guidance.

This addendum is docs-only. It adds no local CV runtime, no model file, no Core ML package, no dataset crawler, no provider call, no frame upload, no upload payload change, no Camera live cloud AI entry, and no production rollout. `productionReady:false` remains locked.