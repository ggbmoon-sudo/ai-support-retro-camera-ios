# Manual Smoke Tests

## Local AI Compose P25-R1 - Live badge Xcode scope repair

Windows/static verification:

- [x] Confirm every `topControlInset` reference in `CameraView.swift` remains inside the outer `captureContent` `GeometryReader` closure where it is defined.
- [x] Confirm the Live AI badge appears exactly once, remains inside `#if DEBUG`, and uses `.allowsHitTesting(false)`.
- [x] Confirm Swift delimiter balance, full 440/440 backend/source-contract tests, and `git diff --check` pass.

Mac/Xcode verification:

- [ ] Product > Clean Build Folder and build DEBUG. Confirm `Cannot find 'topControlInset' in scope` is gone and no replacement Swift diagnostic appears.
- [ ] Start Live AI Compose and confirm the badge is visible below the top controls on the current iPhone.
- [ ] Tap focus and long-press through/near the badge region; confirm it does not intercept preview gestures.
- [ ] Stop Live AI Compose and confirm the badge disappears immediately.

## Local AI Compose P25 - bounded live Xiaoyi keyframes

Windows/backend verification:

- [x] Confirm the full backend test suite passes 440/440 after schema `1.1`, focus grounding, subject-box validation, live-session source contracts, ignored key-file loading, and boundary coverage are added.
- [x] Confirm an invalid/missing/out-of-range/undersized/oversized subject box, extra field, or box inconsistent with the focus hint fails closed.
- [x] Confirm iOS source owns one session ID and one request ID, captures the next frame only after the prior reply, waits at least one second before the next cycle, and has no frame queue.
- [x] Confirm stop/reset paths cancel snapshot/network work and stale session/request IDs cannot apply a reply.
- [x] Confirm provider/model/key/base URL remain backend-only and `productionReady:false` is unchanged.
- [x] Restart the current Windows backend through ignored `XIAOYI_API_KEY_FILE` configuration and confirm localhost plus `192.168.68.60:8787` report `xiaoyiLunaInternal`, `compositionPlannerReady:true`, and `productionReady:false` without printing the key.
- [ ] Run one explicitly approved ignored sample through the schema `1.1` Xiaoyi smoke runner on the configured Mac/backend; print only the validated enum/geometry plan and never raw prompt, response, base64, key, or header.

Mac/Xcode and physical-device verification:

- [ ] Configure ignored backend values for Xiaoyi internal mode, restart, and confirm `/health` reports `compositionPlannerReady:true` and `productionReady:false` without exposing credentials.
- [ ] Open `ios-app/AIPhotoApp.xcodeproj`, Clean Build Folder, and build DEBUG. Confirm all Hybrid Composition files, including `HybridCompositionConsentView.swift`, are included and no Swift/concurrency diagnostic appears.
- [ ] Enable Compose and long-press a person, pet, or object. If no local candidate is highlighted, confirm the touch still creates a provisional box and enables Start Live AI.
- [ ] Start the session, cancel consent, and confirm no upload. Start again, accept, and confirm the live indicator is visible until Stop or a lifecycle boundary.
- [ ] Inspect network timing for at least 30 seconds: never more than one composition request in flight; the next capture starts no earlier than one second after the prior reply; slow replies reduce cadence; no queue or catch-up burst occurs.
- [ ] Confirm the first valid reply grounds the chosen subject and strategy. Pan/zoom/walk while keeping it visible; the local outline should update near 15 FPS and AR-style move/zoom/distance guidance should remain materially steadier than 1 FPS cloud boxes alone.
- [ ] Confirm the app does not repeatedly snap a healthy local track back to an older cloud keyframe box. Cover/reveal the subject and verify safe local reacquisition or cloud grounding without switching silently to an unrelated subject.
- [ ] Cause two successive cloud replies to recommend another supported strategy and confirm replacement occurs only after the second match; one isolated change must not flicker the plan.
- [ ] Tap Stop and confirm no later frame/request. Repeat Compose off, capture, selected-photo change, front/rear/lens switch, Camera dismissal, and app background; confirm outstanding work is cancelled and stale replies cannot reapply.
- [ ] Disconnect backend during a session. Confirm the session stops safely, the last validated guide may remain local, Camera/shutter stay usable, and there is no silent retry storm.
- [ ] Repeat on front-camera mirrored preview and rear cameras. Confirm the top-left cloud box, bottom-left Vision geometry, and display mirroring map to the same visible subject without double mirroring.
- [ ] Confirm guidance never actuates zoom, lens, focus, exposure, crop, shutter, or capture and never blocks manual capture.
- [ ] Build RELEASE and confirm the live Xiaoyi Camera entry and remote client path remain unavailable.
- [ ] Inspect console, backend files, and traffic metadata: no key, Authorization header, raw/base64 image, prompt, raw provider response, EXIF/GPS, box history, sensor stream, identity/sensitive inference, score/rating, or training artifact.

## Local AI Compose P24 - Xiaoyi one-shot composition planner

Windows/backend verification:

- [x] Confirm the full backend test suite passes after adding exact enum contract, request validation, Xiaoyi request-shape, route/fallback, iOS source-boundary, and smoke-output redaction coverage.
- [x] Confirm a disabled/non-Xiaoyi local configuration returns `internal_cloud_disabled` before any provider call.
- [x] Run the explicitly approved ignored cat sample through the Xiaoyi smoke runner; confirm the final request returns a validated cloud plan and exit code 0 without printing key, Authorization header, base64, prompt, or raw provider response.
- [x] Confirm no real sample, generated smoke JPEG, provider response, prompt, or QA artifact is tracked in Git.

Mac/Xcode and physical-device verification:

- [ ] Configure the Mac backend using ignored local environment only: `xiaoyiLunaInternal`, internal cloud allowed, approved Xiaoyi base/path, `gpt-5.6-luna`, and the local key. Restart backend and confirm `/health` reports `compositionPlannerReady:true` and `productionReady:false`.
- [ ] Open `ios-app/AIPhotoApp.xcodeproj`, Clean Build Folder, and build DEBUG. Confirm the three `HybridCompositionPlanner*` files are included automatically and there are no Swift/concurrency errors.
- [ ] Open Camera, enable AI Compose, and verify the Xiaoyi menu action is disabled before a subject is locked. Long-press a person, pet, or object and verify it becomes enabled.
- [ ] Tap the Xiaoyi action and cancel consent. Confirm there is no request and local Compose continues unchanged.
- [ ] Accept consent once. Confirm the sheet progresses through one-frame preparation and analysis, then displays only a localized policy/reason plus coarse lens/distance suggestions—not raw JSON, confidence, provider error, or debug text.
- [ ] Use Network Instruments/Charles/backend safe metadata to confirm exactly one JPEG request for that accepted attempt, no repeated/background upload, no video/WebSocket, and no second call after the plan is applied.
- [ ] Close the result and pan/move around the locked subject for at least 20 seconds. Confirm the target policy/anchor/size remains frozen and the local subject outline/action/Hold/Ready continues smoothly without half-second target changes.
- [ ] Confirm another cloud attempt always presents fresh consent. A timeout, invalid response, or disconnected backend should show the safe unavailable state and leave local Compose usable with no new plan.
- [ ] Repeat on front camera with selfie mirroring and rear lenses. Confirm the uploaded visible orientation and returned left/right target match the displayed preview once, without double mirror.
- [ ] Change subject, policy, target side, lens/camera, Compose off/on, selected-photo state, or Camera lifecycle. Confirm the hybrid plan clears only at the intended explicit/lifecycle boundary and no stale request can reapply afterward.
- [ ] Confirm the returned focal/distance buckets never change hardware zoom, lens, focus, exposure, crop, or shutter; capture remains manual and available throughout.
- [ ] Build RELEASE and confirm the Xiaoyi Camera menu entry is absent and the remote client path is disabled.
- [ ] Inspect app/backend console and filesystem: no API key, Authorization header, base64, prompt, raw provider response, raw frame, EXIF/GPS, subject geometry/history, score/confidence, or training artifact may appear.

## Local AI Compose P23 - True Subject Lock

Windows/static verification:

- [x] Confirm 17/17 deterministic geometry cases pass: close match, far/undersized rejection, first/second miss retention, third miss loss, no miss translation, detector-miss preservation across fast tracking, material-only reseed, and position/size dead zones.
- [x] Confirm 14/14 source-contract cases pass: three detector phases, conditional sequence reseed, transient-only loss clear, five locked-target freeze guards, tighter Vision confidence/jump/area/miss gates, and no predicted miss drift.
- [x] Confirm full detector confirmation is the only path that clears detector misses; fast Vision reconciliation preserves `missedFrameCount` and never enters action/Hold/Ready evidence.
- [x] Confirm automatic Symmetry, Leading Lines, Negative Space, Lead Room, and ambiguity transitions cannot call target clear while a subject is locked.
- [x] Confirm lost tracking retains cached policy/target geometry, clears action/pose/Ready/depth evidence, stops the old sequence, and uses localized reacquiring copy.
- [x] Confirm English and Traditional Chinese each contain one lock-held and one reacquiring-detail key.
- [x] Confirm Camera Swift delimiter balance, `git diff --check`, and no ARKit, Xiaoyi/provider/network, logging, persistence, upload, identity, model/training, automatic capture, or `productionReady:true` path.

Mac/Xcode and physical-device verification:

- [ ] Clean Build Folder and build DEBUG; confirm the P22-R1 compiler/concurrency diagnostics remain resolved and P23 adds no new warning or error.
- [ ] Enable Compose, long-press one stationary person, pet, or object, and record at least 20 seconds. Confirm the cyan subject frame has restrained micro-motion and the policy, target anchor, target size, and target side do not alternate.
- [ ] While locked, create/remove visible symmetry, leading lines, quiet space, and horizontal subject motion. Confirm automatic evidence does not change the frozen composition plan.
- [ ] Pan slowly while keeping the locked subject visible; confirm the subject frame follows smoothly, the target stays fixed, and periodic full detector samples do not cause a half-second pulse or jump.
- [ ] Move two same-kind subjects through or near one another. Confirm an ambiguous/crossing sample is retained/reacquiring and never silently transfers the lock to the other subject.
- [ ] Briefly cover the locked subject, then reveal it near its prior location. Confirm short loss does not predict the box across the screen, and compatible reappearance can resume the same frozen plan.
- [ ] Hide or move the locked subject far away long enough to lose tracking. Confirm the subject frame disappears, target/policy remain, movement/Hold/Ready/depth cues clear, and the localized reacquiring message suggests another long press.
- [ ] With the old subject absent, show another large same-kind subject elsewhere. Confirm the lock does not jump. Long-press that new subject and confirm only this explicit action creates a new plan.
- [ ] While locked, explicitly choose another policy or flip target side; confirm that photographer action intentionally rebuilds the target once and then remains stable.
- [ ] Repeat with front camera mirroring, rear lenses, compatible/unsupported depth, non-original live filter, P17 motion pause, P21 thermal protection, background/foreground, Compose off/on, and selected-photo transitions.
- [ ] Confirm shutter, tap focus/exposure, flash, zoom/lens controls, saved orientation, selfie parity, filters, and P22 depth cutout remain operational and no lock state gates capture.
- [ ] Use Instruments for at least 15 minutes; compare tracking FPS, CPU/GPU, memory, preview drops, thermal transitions, and shutter latency against P22.
- [ ] Inspect console/artifacts and confirm no raw frame, box/history, trajectory, confidence, UUID, miss count, prompt, provider response, Authorization header, or key is logged, persisted, uploaded, or sent to analytics.
- [ ] Confirm Camera makes no network request, iOS contains no provider key/direct provider call, ARKit remains absent, automatic capture remains absent, and `productionReady:false` remains unchanged.

## Local AI Compose P22-R1 - Xcode diagnostic repair

Windows/static verification:

- [x] Confirm `LocalAIComposeTemporalSubjectTracker.translated(...)` explicitly returns `LiveFrameNormalizedRect` after its two local bound calculations.
- [x] Confirm `CameraCaptureService` has exactly one `@preconcurrency import AVFoundation` and no plain duplicate AVFoundation import.
- [x] Confirm `startSession()` and `stopSession()` still dispatch `AVCaptureSession` work through the existing private serial `sessionQueue`.
- [x] Confirm 65 Camera Swift files have balanced delimiters and `git diff --check` passes.
- [x] Confirm no Camera UI, capture/depth/filter logic, provider/network route, secret, upload, persistence, logging, automatic capture, or `productionReady:true` path was introduced by this repair.

Mac/Xcode verification:

- [ ] Pull the repair and use Product > Clean Build Folder, then build the DEBUG app. Confirm the temporal tracker missing-return error and unused-initializer warning are gone.
- [ ] Confirm the AVFoundation preconcurrency recommendation and the two `AVCaptureSession` capture-in-`@Sendable`-closure warnings are gone.
- [ ] Start/stop Camera repeatedly, background/foreground the app, and switch front/back camera plus lenses; confirm no session hang, duplicate callback, frozen preview, or crash.
- [ ] Capture with Original and one non-original live filter; confirm preview, shutter, saved orientation, selfie parity, flash, and focal crop remain unchanged.
- [ ] Enable Compose on compatible depth hardware and confirm P22 foreground cutout behavior remains available after the compile repair.
- [ ] Expand the separate Xcode "Update to recommended settings" issue and record each proposed setting before accepting anything. Do not bulk-apply it as part of P22-R1; send a screenshot/list for a scoped review if it remains.
- [ ] Confirm Camera makes no network request, iOS contains no provider key/direct provider call, ARKit remains absent, and `productionReady:false` remains unchanged.

## Local AI Compose P22 - Foreground-aware AR guide occlusion

Windows/static verification:

- [x] Confirm the exported mask is fixed at 18 by 24, bounded to valid unique cell indices, contains no depth value/pixel/confidence/identity/label, and is produced only for reliable high-separation hardware depth near the current full-analysis subject.
- [x] Confirm isolated-cell cleanup, enclosed-neighbor fill, two-compatible-sample activation, one-miss retention, two-miss clear, and two-sample distant replacement.
- [x] Confirm 20/20 deterministic mask/stability/source cases pass, including IoU near/distant behavior, empty input, bounds/deduplication, front display mirroring without double mirroring, thermal nil-mask output, P17 motion clear, isolated compositing, and Group Balance exclusion.
- [x] Confirm both `LiveGuidanceFrameAnalysis` construction paths explicitly provide `depthOcclusionMask`, with thermal protection always providing nil.
- [x] Confirm grid/tint alone are inside the compositing group and `destinationOut`; subject/target/action/readiness overlays remain outside and above the cutout.
- [x] Confirm Camera Swift delimiter balance, `git diff --check`, and scans for no ARKit, Xiaoyi/provider/network, logging, persistence, upload, analytics, model/training, automatic capture, or `productionReady:true` path.

Mac/Xcode and physical-device verification:

- [ ] Pull the branch, open `ios-app/AIPhotoApp.xcodeproj`, and build DEBUG on a physical iPhone; confirm `LocalAIComposeDepthOcclusionStability.swift` is included by the synchronized Xcode group.
- [ ] On a compatible TrueDepth or LiDAR/depth lens, enable Compose and place one clearly nearer subject against a distant textured background. Hold stable until P20 depth settles; confirm grid/tint disappears behind the foreground silhouette while the subject outline and target remain visible.
- [ ] Compare front and back cameras; confirm front-camera cutout follows the mirrored visible subject exactly and is not mirrored twice, rotated, transposed, or vertically flipped.
- [ ] Move the subject slightly for several seconds; confirm the coarse edge remains restrained and temporally stable rather than flashing across the frame. Then remove/occlude depth briefly and confirm one miss is tolerated but two clear samples remove the cutout.
- [ ] Trigger P17 phone-motion pause; confirm the spatial mask clears immediately and fresh stable evidence is required after release.
- [ ] Enter P21 serious/critical thermal protection; confirm the cutout clears, the cooling reticle appears, and preview/filter/manual shutter remain available. After recovery, confirm no stale mask returns.
- [ ] Select Group Balance; confirm no single-subject grid cutout remains. Return to a one-subject policy and confirm fresh P20/P22 evidence is required.
- [ ] Test an unsupported lens, flat wall, reflective surface, dark scene, depth-sensor occlusion, and weak separation; confirm the unchanged ordinary 2D guide remains usable without a false cutout or crash.
- [ ] Switch Compose, selected-photo mode, front/back camera, and compatible/incompatible lenses repeatedly; confirm no stale mask, frozen preview, duplicate callback, depth-session failure, or lost ordinary video delegate.
- [ ] Capture while cutout is visible and absent; confirm the saved image and Core Image recipe contain no overlay/cutout change and no focus, exposure, zoom, crop, shutter, or automatic-capture behavior changes.
- [ ] Run Instruments for at least 15 minutes with a non-original live filter, Compose, P20 depth, and P22 occlusion. Record CPU/GPU, memory, preview drops, thermal transitions, and shutter latency; compare with P21 and verify capture remains higher priority.
- [ ] Inspect console/runtime artifacts and confirm no raw/coarse mask, depth map/value, subject geometry/history, frame, provider text, Authorization header, or key is logged, persisted, uploaded, or sent to analytics.
- [ ] Confirm Camera makes no network request, iOS has no provider key/direct provider call, ARKit is absent, automatic capture remains absent, and `productionReady:false` remains unchanged.

## Local AI Compose P21 - Capture-first adaptive workload

Windows/static verification:

- [x] Confirm nominal, Low Power, fair, serious, and critical states resolve to the expected nominal/reduced/thermal-pause buckets.
- [x] Confirm serious/critical enters immediately, first cool sample begins recovery, less than five seconds stays paused, five seconds resumes the current nominal/reduced tier, and renewed heat cancels recovery.
- [x] Confirm 18/18 deterministic policy/source cases pass, including preview-before-gate, Vision skip, tracker reset, bucket-only pause callback, app-side pause-before-frame-assignment, Ready clearing, depth removal, and preserved-target-only presentation.
- [x] Confirm both normal and thermal `LiveGuidanceFrameAnalysis` constructors set an explicit workload mode.
- [x] Confirm thermal entry is handled before latest frame/candidate assignment and cannot count as fresh ambiguity/action/Hold/Ready evidence.
- [x] Confirm English and Traditional Chinese thermal instruction/detail keys each occur once.
- [x] Confirm no thermal state/timestamp/history logging, persistence, analytics, upload, score, ARKit, Xiaoyi/provider call, Camera route, automatic capture, model/training, or `productionReady:true` path was added.

Mac/Xcode and physical-device verification:

- [ ] Pull the branch, open `ios-app/AIPhotoApp.xcodeproj`, and build DEBUG on a physical iPhone; confirm `LocalCameraAIWorkloadPolicy.swift` is included automatically by the synchronized group.
- [ ] In nominal state with AI Compose and a non-original live filter, confirm subject detection remains approximately 2 FPS, explicit-lock movement remains smooth, depth may activate on supported hardware, and shutter response matches P20.
- [ ] Enable iOS Low Power Mode; confirm preview/filter/shutter remain stable and Compose continues at visibly slower but usable cadence without displaying numeric FPS or a warning.
- [ ] Use Xcode's thermal-state simulation or a controlled Instruments stress session to enter fair; confirm it follows the reduced tier without clearing the current plan unnecessarily.
- [ ] Enter serious/critical thermal state; confirm the orange cooling reticle and localized message appear promptly, movement arrows/level/depth/Ready disappear, depth output is removed, and no Ready haptic fires.
- [ ] While thermally paused, confirm filtered preview, tap focus/exposure, lens/camera controls, filter selection, photo capture, and saving remain available; no AI state blocks the shutter.
- [ ] Confirm explicit-lock fast tracking stops during protection and the displayed subject/target can remain only as dimmed continuity geometry without advancing.
- [ ] Return to nominal/fair and confirm protection remains for about five seconds, reheating restarts the dwell, and a fresh detector sample—not stale pre-pause geometry—resumes action guidance.
- [ ] After recovery on a depth-compatible lens, confirm depth is rebuilt only while Compose is active and its badge requires fresh P20 evidence.
- [ ] Toggle Compose or leave/re-enter Camera during serious thermal state; confirm the next frame re-enters protection and the UI cannot bypass it by toggling.
- [ ] Repeat nominal/reduced/protection/recovery transitions with front/back cameras and compatible/incompatible depth lenses; confirm no duplicate callbacks, frozen preview, stale Ready, session crash, or lost video delegate.
- [ ] Run Instruments for at least 15 minutes with live filter + Compose + depth. Record CPU/GPU, memory, thermal state, preview drops, capture latency, and recovery behavior; compare nominal and reduced tiers.
- [ ] Inspect console/artifacts and confirm no raw thermal state, timestamp, dwell/cadence value, frame/depth data, subject geometry/history, provider text, Authorization header, or key is logged or persisted.
- [ ] Confirm Camera makes no network request, iOS contains no provider key/direct provider call, ARKit is absent, automatic capture remains absent, and `productionReady:false` remains unchanged.

## Local AI Compose P20 - Synchronized hardware-depth layers

Windows/static verification:

- [x] Confirm exactly one `AVCaptureDepthDataOutput` and one `AVCaptureDataOutputSynchronizer` are installed in `CameraCaptureService`.
- [x] Confirm unsupported/no-format paths restore the ordinary video sample-buffer delegate and keep RGB/Vision analysis available.
- [x] Confirm depth reduction runs only after the existing full-analysis Vision subject rectangle exists and never from the P13 fast tracker callback.
- [x] Confirm 15/15 deterministic bucket/orientation/hysteresis/source cases pass: two-sample activation, one-clear retention, two-clear removal, portrait-matte rejection, weak-separation rejection, private near/mid/far bucket boundaries, separation boundaries, portrait/sensor-native coordinate mapping, motion-gate placement, and Group Balance suppression.
- [x] Confirm English/Traditional Chinese depth-layer keys each occur once; Camera Swift delimiters and `git diff --check` pass.
- [x] Confirm no ARKit, Xiaoyi/provider/network call, iOS provider key, logging, persistence, upload, analytics, model/training, automatic capture, or `productionReady:true` path was added.

Mac/Xcode and physical-device verification:

- [ ] Pull the branch on the MacBook, open `ios-app/AIPhotoApp.xcodeproj`, and build the DEBUG app; confirm `LiveGuidanceDepthAnalyzer.swift` and `LocalAIComposeDepthStability.swift` are included by the synchronized Xcode group.
- [ ] Run on a physical iPhone with a TrueDepth front camera. Enable AI Compose, frame one clear subject in front of a more distant background, hold the phone stable, and confirm the `Depth layers · on-device` badge plus subtle offset halo appears only after the guide settles.
- [ ] Disable AI Compose and enter/leave selected-photo mode; confirm the depth cue clears, ordinary filtered preview remains live, and re-enabling Compose requires fresh two-sample depth evidence.
- [ ] Repeat on each back lens. On a LiDAR/depth-compatible format confirm the cue can appear; on an unsupported ultra-wide/telephoto format confirm Camera, live filter, Vision guide, tap focus, and shutter continue normally without a cue or crash.
- [ ] Cover part of the depth sensor, use a flat wall, low-validity edge subject, reflective surface, and dark scene; confirm missing/weak depth does not fabricate the badge and never blocks ordinary guidance.
- [ ] Confirm one brief dropped/weak sample does not flicker the cue off, while two full-analysis clear samples remove it.
- [ ] Move the phone enough to trigger the P17 motion pause; confirm the depth badge/halo is hidden during pause and no new depth evidence advances until stable release.
- [ ] Select Group Balance; confirm the single-subject depth badge/halo is hidden even when hardware depth remains available. Return to one subject and confirm fresh evidence is required again after a Compose/camera/lens reset.
- [ ] Verify front preview mirroring and every back lens: the depth halo follows the same visible subject rectangle and is not rotated, transposed, vertically flipped, or offset to the background.
- [ ] Switch front/back and compatible/incompatible lenses repeatedly for at least 20 cycles; confirm no frozen preview, duplicate callback, stale cue, session error, crash, or lost filtered preview.
- [ ] Capture photos while the cue is active and inactive; confirm no automatic focus, zoom, crop, bokeh, depth effect, capture, or shutter gating is applied.
- [ ] Use Instruments for at least 10 minutes with AI Compose plus a non-original live filter. Record dropped frames, CPU/GPU, thermal state, memory, and shutter latency; confirm the synchronized depth path remains acceptable and unsupported-lens fallback is no worse than P19.
- [ ] Inspect console/runtime artifacts and confirm no raw image, depth map, metric distance, depth median, valid ratio, sample coordinate, subject box/history, prompt, provider response, Authorization header, or key is logged or persisted.
- [ ] Confirm Camera makes no network request, iOS contains no provider key/direct provider call, the dormant Depth Anything sandbox remains disabled, and `productionReady:false` remains unchanged.

## Phase 21-H2

Qwen MoE + Live Advisor target re-evaluation gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:qwen-moe-live-advisor-target`.
- [ ] Confirm the gate reports `targetGateEligible:true`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm `Qwen3-VL-30B-A3B` is only a future target candidate for a later separately approved model phase when vision-capable / VLM-compatible verification is true.
- [ ] Confirm text-only Qwen blocks for image analysis, and Qwen2.5-VL remains a reference baseline.
- [ ] Confirm blockers cover missing non-thinking/direct-output mode, missing structured output, missing quantization plan, missing benchmark requirement, Auto-Trigger runtime, WSS runtime, iOS upload runtime, direct iOS model route, production readiness, model calls, Qwen inference, benchmark execution, free-form model text, score/rating, sensitive inference, chain-of-thought, and debug/provider leakage.
- [ ] Confirm no model switch, `local_model` route enablement, Auto-Trigger runtime, WSS runtime, image upload/compression runtime, iOS integration, endpoint, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, or production readiness change is introduced.

## Phase 21-I

Image compression + upload payload policy gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:image-compression-upload-policy`.
- [ ] Confirm the CLI output has `uploadPolicyEligible:true`, `uploadRuntimeEnabled:false`, `compressionRuntimeEnabled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm `docs/image-compression-upload-payload-policy-gate.md` records the current source audit, future compressed-preview target, metadata stripping, consent, retention/deletion, capture-context, Auto-Trigger, 1 FPS, backend validation, iOS boundary, and stop-condition policies.
- [ ] Confirm no upload runtime, compression runtime change, iOS payload change, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, app-facing endpoint, production endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, or production rollout was added.

## Phase 21-J

Auto-Trigger + 1 FPS Live Advisor policy gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:auto-trigger-live-advisor-policy`.
- [ ] Confirm the CLI output has `autoTriggerPolicyEligible:true`, `autoTriggerRuntimeEnabled:false`, `liveAdvisorRuntimeEnabled:false`, `cameraCloudEntryEnabled:false`, `wssRuntimeEnabled:false`, `uploadRuntimeEnabled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm `docs/auto-trigger-1fps-live-advisor-policy-gate.md` records the current source audit, stillness `>1s` threshold, `<=1s` no-capture/no-upload/no-backend/no-model rule, max 1 FPS cloud-analysis policy, compression/upload relationship, WSS relationship, local CV relationship, backend validation, iOS boundary, and stop-condition policies.
- [ ] Confirm no Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, upload runtime, compression runtime change, iOS payload change, endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, or production rollout was added.

## Phase 21-K

Stateful WSS Live Advisor protocol preflight:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:stateful-wss-live-advisor-protocol`.
- [ ] Confirm the CLI output has `protocolPreflightEligible:true`, `wssRuntimeEnabled:false`, `webSocketServerRuntimeEnabled:false`, `iosWebSocketClientRuntimeEnabled:false`, `liveAdvisorRuntimeEnabled:false`, `cameraCloudEntryEnabled:false`, `uploadRuntimeEnabled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm `docs/stateful-wss-live-advisor-protocol-preflight.md` records the current source audit, future WSS purpose, session lifecycle, client/backend message policy, server busy/backoff, throttle/rate-limit, Auto-Trigger, 1 FPS, compression/upload, consent/no-silent-upload, privacy/logging, iOS/backend boundary, and stop-condition policies.
- [ ] Confirm the roadmap current next phase is Phase 21-L: Local On-device CV Camera Aids Plan.
- [ ] Confirm no WSS runtime, WebSocket server/client runtime, Auto-Trigger runtime, Camera live cloud AI runtime entry, upload runtime, compression runtime change, iOS payload change, endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, or production rollout was added.

## Phase 21-L

Local On-device CV Camera Aids Plan gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:local-cv-camera-aids-plan`.
- [ ] Confirm the CLI output has `localCvPlanEligible:true`, `localCvRuntimeEnabled:false`, `gridAlignmentRuntimeEnabled:false`, `horizonLevelRuntimeEnabled:false`, `exposureWarningRuntimeEnabled:false`, `motionStabilityRuntimeEnabled:false`, `cameraCloudEntryEnabled:false`, `uploadRuntimeEnabled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm `docs/local-on-device-cv-camera-aids-plan.md` records the current source audit, local CV purpose, grid alignment, horizon/level, exposure warning, motion/stability bucket, 60fps smoothness, Auto-Trigger relationship, cloud VLM boundary, privacy/data-retention, iOS/backend boundary, and stop-condition policies.
- [ ] Confirm the roadmap current next phase is Phase 21-M: Quantization + Serving Benchmark Plan.
- [ ] Confirm no local CV runtime, grid/horizon/exposure/motion runtime, Camera live cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, upload runtime, compression runtime change, iOS payload change, endpoint, model call, Qwen inference, fixture inference, serving benchmark, raw artifact, secret, or production rollout was added.

## Phase 21-N

Approved one-fixture backend local model route smoke:

- [x] Confirm user explicitly approved one backend local/private model smoke.
- [x] Confirm repo was clean and upstream sync was `0 0` before preflight.
- [x] Confirm ignored local config, ignored local fixture registry, and ignored local sample folder were present, ignored, untracked, and unstaged.
- [x] Confirm required preferred fixture token `smoke_001` was not present/approved in the ignored local registry.
- [x] Confirm the phase stopped before healthz/model-call execution.
- [x] Confirm no substitute fixture token was used.
- [x] Confirm model call count `0`, retry count `0`, network calls made `false`, model calls made `false`, Qwen inference run `false`, serving benchmark run `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-one-fixture-local-model-smoke-report.md` records sanitized preflight-block result only.
- [x] Confirm roadmap current next phase is Phase 21-N-R0: One-fixture Local Model Smoke Preflight Block Resolution.
- [x] Confirm no serving benchmark, model switch, production `local_model` enablement, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R0

smoke_001 preflight block resolution:

- [x] Confirm ignored local config, fixture registry, and sample folder are present, ignored, untracked, and unstaged.
- [x] Confirm `smoke_001.*` local fixture file is missing.
- [x] Confirm only extension bucket `missing` is reported; no image is opened, OCRed, uploaded, or sent to a model.
- [x] Confirm ignored local registry remains unmodified because the fixture file is missing.
- [x] Confirm `smoke_001` registry entry is absent and approved false.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r0-smoke001-preflight-block-resolution.md` records sanitized facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R0B: Operator-provided smoke_001 Fixture Preparation.
- [x] Confirm no model call, Qwen inference, fixture inference, serving benchmark, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R0B

Operator-provided smoke_001 fixture preparation:

- [x] Confirm ignored local sample folder exists and remains ignored, untracked, and unstaged.
- [x] Confirm `smoke_001.*` local fixture file is still missing.
- [x] Confirm extension bucket is `missing`.
- [x] Confirm ignored local fixture registry was not edited because the fixture file is missing.
- [x] Confirm `smoke_001` registry entry is absent and approved false.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r0b-smoke001-fixture-preparation.md` records sanitized facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R0C: Operator supplies approved smoke_001 local fixture.
- [x] Confirm no model call, Qwen inference, fixture inference, serving benchmark, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R0C

Operator-supplied smoke_001 fixture check:

- [x] Confirm ignored local sample folder exists and remains ignored, untracked, and unstaged.
- [x] Confirm `smoke_001.*` local fixture file is now present.
- [x] Confirm extension bucket is `jpg`.
- [x] Confirm ignored local fixture registry was updated locally only.
- [x] Confirm `smoke_001` registry entry is present and approved true.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r0c-smoke001-operator-fixture-supply.md` records sanitized facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R1: Approved One-fixture Local Model Smoke Retry, requiring separate explicit model-call approval.
- [x] Confirm no model call, Qwen inference, fixture inference, serving benchmark, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R1

Approved one-fixture local model smoke retry:

- [x] Confirm user explicitly approved one backend local/private model smoke retry.
- [x] Confirm guarded retry CLI requires `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`.
- [x] Confirm preflight blocked before healthz/model execution because ignored local config fixture token was not `smoke_001`.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r1-one-fixture-local-model-smoke-retry-report.md` records sanitized blocked facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R1B: One-fixture Local Model Smoke Retry Block Resolution.
- [x] Confirm no model call, serving benchmark, model switch, production `local_model`, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R1B

Local config fixture-token block resolution:

- [x] Confirm ignored local config is present, ignored, untracked, and unstaged.
- [x] Confirm ignored local config fixture-token bucket was not `smoke_001` before the local-only fix.
- [x] Confirm `smoke_001` fixture file is present with extension bucket `jpg`, ignored, untracked, and unstaged.
- [x] Confirm ignored local registry has `smoke_001` entry present and approved.
- [x] Confirm ignored local config was touched locally only and now has fixture token `smoke_001`.
- [x] Confirm ignored local config, registry, and fixture remain unstaged/untracked/ignored.
- [x] Confirm model call executed `no`, healthz run `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r1b-local-config-fixture-token-resolution.md` records sanitized facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R1C: Approved One-fixture Local Model Smoke Retry After Config Fix, requiring separate explicit model-call approval.
- [x] Confirm no serving benchmark, model switch, production `local_model`, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R1C

Approved one-fixture local model smoke retry after config fix:

- [x] Confirm user explicitly approved one backend local/private model smoke retry after config fix.
- [x] Confirm repo was clean and upstream sync was `0 0` before preflight.
- [x] Confirm ignored local config, ignored local fixture registry, and ignored `smoke_001` fixture were present, ignored, untracked, and unstaged.
- [x] Confirm local config fixture token is `smoke_001`.
- [x] Confirm `smoke_001` registry entry is present and approved.
- [x] Confirm guarded retry command ran exactly once with `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`.
- [x] Confirm healthz ran once and blocked before model call.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm `docs/phase-21-n-r1c-one-fixture-local-model-smoke-retry-after-config-fix-report.md` records sanitized facts only.
- [x] Confirm roadmap current next phase is Phase 21-N-R1D: One-fixture Local Model Smoke Retry Healthz Block Resolution.
- [x] Confirm no model call, serving benchmark, model switch, production `local_model`, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R1D

Healthz block resolution:

- [x] Confirm ignored local config, fixture registry, and `smoke_001` fixture remain present, ignored, untracked, and unstaged.
- [x] Confirm healthz-only preflight ran once and reported sanitized bucket `connection_refused`.
- [x] Confirm healthz prerequisite resolved `false`.
- [x] Confirm model call executed `no`, call count `0`, retry count `0`, Qwen inference `false`, fixture inference `false`, serving benchmark `false`, and `productionReady:false`.
- [x] Confirm roadmap current next phase remains Phase 21-N-R1D: One-fixture Local Model Smoke Retry Healthz Block Resolution.
- [x] Confirm no model call, serving benchmark, model switch, production `local_model`, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-N-R1E

Approved one-fixture local model smoke retry after healthz fix:

- [x] Confirm user explicitly approved one backend local/private model smoke retry after healthz fix.
- [x] Confirm ignored local config, fixture registry, and `smoke_001` fixture remained present, ignored, untracked, and unstaged.
- [x] Confirm healthz preflight was safe before model call.
- [x] Confirm guarded command ran exactly once with `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`.
- [x] Confirm model call executed `yes`, call count `1`, retry count `0`, fixture count `1`, accepted count `1`, rejected count `0`, and `productionReady:false`.
- [x] Confirm no raw prompt, raw model output, raw image path/content, request payload, local config contents, fixture registry contents, server logs, or secrets were printed or persisted.
- [x] Confirm roadmap current next phase is Phase 21-O: Approved Serving Benchmark Execution Preflight / Scope Gate.
- [x] Confirm no serving benchmark, model switch, production `local_model`, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-O

Serving benchmark execution preflight / scope gate:

- [x] Confirm `docs/serving-benchmark-execution-preflight-scope-gate.md` defines no-model contract, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation boundaries.
- [x] Confirm `npm run qa:open-weight-vlm:serving-benchmark-scope-gate` reports `scopeGateEligible:true`, `defaultNoModelContractPassed:true`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include one-fixture without approval, 12-fixture without approval, vLLM/SGLang/quantization/live simulation without approval, Live Advisor over 1 FPS, raw output logging, `productionReady:true`, iOS integration, endpoints, public endpoint class, and Ollama/LM Studio production use.
- [x] Confirm no model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-P: Serving Benchmark Plan Approval Matrix.

## Phase 21-P

Serving benchmark approval matrix:

- [x] Confirm `docs/serving-benchmark-plan-approval-matrix.md` defines approval requirements for no-model contract preflight, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation.
- [x] Confirm `npm run qa:open-weight-vlm:serving-benchmark-approval-matrix` reports `approvalMatrixEligible:true`, `defaultNoModelContractPassed:true`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include one-fixture without approval, one-fixture fixture expansion, retry without approval, 12-fixture/vLLM/SGLang/quantization/live simulation without approval, Live Advisor over 1 FPS, raw output logging, `productionReady:true`, iOS integration, endpoints, public endpoint class, and Ollama/LM Studio production use.
- [x] Confirm no model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-Q: vLLM No-model Serving Contract Preflight.

## Phase 21-Q

vLLM no-model serving contract preflight:

- [x] Confirm `docs/vllm-no-model-serving-contract-preflight.md` defines future vLLM backend-mediated request/response boundaries, structured JSON output, validator/fallback/safety requirements, raw artifact blocks, iOS boundary blocks, and `productionReady:false`.
- [x] Confirm `npm run qa:open-weight-vlm:vllm-contract-preflight` reports `vllmContractPreflightEligible:true`, `safeNoModelContractPassed:true`, `vllmRuntimeStarted:false`, `vllmEndpointCalled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include model call, benchmark, vLLM server start, vLLM endpoint call, model download, serving switch, `productionReady:true`, public/ngrok endpoint, raw prompt/output/image/base64/path/request payload logging, EXIF/GPS/sensor logging, missing validator/fallback/safety, free-form output, iOS direct call/key, app/prod endpoint, Camera cloud entry, text-only model, score/rating, sensitive inference, and chain-of-thought.
- [x] Confirm no vLLM runtime, vLLM endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-R: SGLang No-model Serving Contract Preflight.

## Phase 21-R

SGLang no-model serving contract preflight:

- [x] Confirm `docs/sglang-no-model-serving-contract-preflight.md` defines future SGLang backend-mediated request/response boundaries, structured JSON output, validator/fallback/safety requirements, raw artifact blocks, iOS boundary blocks, and `productionReady:false`.
- [x] Confirm `npm run qa:open-weight-vlm:sglang-contract-preflight` reports `sglangContractPreflightEligible:true`, `safeNoModelContractPassed:true`, `sglangRuntimeStarted:false`, `sglangEndpointCalled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include model call, benchmark, SGLang server start, SGLang endpoint call, model download, serving switch, `productionReady:true`, public/ngrok endpoint, raw prompt/output/image/base64/path/request payload logging, EXIF/GPS/sensor logging, missing validator/fallback/safety, free-form output, iOS direct call/key, app/prod endpoint, Camera cloud entry, text-only model, score/rating, sensitive inference, and chain-of-thought.
- [x] Confirm no SGLang runtime, SGLang endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-S: Serving Stack No-model Comparison Matrix.

## Phase 21-S

Serving stack no-model comparison matrix:

- [x] Confirm `docs/serving-stack-no-model-comparison-matrix.md` compares Transformers+FastAPI reference, vLLM candidate, SGLang challenger, and Ollama/LM Studio manual-only roles with `productionReady:false`.
- [x] Confirm `npm run qa:open-weight-vlm:serving-stack-comparison-matrix` reports `comparisonMatrixEligible:true`, `safeNoModelComparisonPassed:true`, `servingRuntimeStarted:false`, `endpointCalled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `servingStackSwitched:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include model call, endpoint call, benchmark, serving switch, model download, production route, `productionReady:true`, raw prompt/output/image/base64/path/request payload logging, EXIF/GPS/sensor logging, missing structured JSON/validator/fallback/safety, iOS integration, app/prod endpoint, Camera cloud runtime, unknown stack, and Ollama/LM Studio production use.
- [x] Confirm no serving runtime, endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-T: One-fixture Serving Benchmark Approval Request Draft.

## Phase 21-T

One-fixture serving benchmark approval request draft:

- [x] Confirm `docs/one-fixture-serving-benchmark-approval-request-draft.md` is a user-facing approval request draft, not an execution plan.
- [x] Confirm `npm run qa:open-weight-vlm:one-fixture-serving-benchmark-approval-request` reports `approvalRequestGateEligible:true`, `safeDraftOnlyRequestPassed:true`, `servingRuntimeStarted:false`, `endpointCalled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `servingStackSwitched:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include current model call, current benchmark execution, fixture/call/retry expansion, non-`smoke_001` fixture, non-Transformers+FastAPI stack, missing explicit approval requirement, raw output/logging, `productionReady:true`, iOS integration, endpoints, Camera cloud runtime, Auto-Trigger/WSS/upload runtime, and serving stack switch.
- [x] Confirm no serving runtime, endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-U: Approved Transformers+FastAPI One-fixture Serving Benchmark, requiring separate explicit model-call approval.

## Phase 21-U

Approved Transformers+FastAPI one-fixture serving benchmark:

- [x] Confirm user explicitly approved one Transformers+FastAPI reference one-fixture serving benchmark with `smoke_001`, call count 1, and retry count 0.
- [x] Confirm healthz preflight was safe before the benchmark call.
- [x] Confirm the guarded benchmark wrapper ran exactly once with `--approved-one-call`, `--serving-stack transformers_fastapi_reference`, `--fixture smoke_001`, `--call-count 1`, and `--no-retry`.
- [x] Confirm model call executed `yes`, benchmark executed `yes`, fixture count `1`, call count `1`, retry count `0`, accepted count `1`, rejected count `0`, and `productionReady:false`.
- [x] Confirm sanitized validation/fallback summary has `validationCode:null` and `fallbackCategory:null`.
- [x] Confirm latency bucket is `gt_15s`.
- [x] Confirm no raw prompt, raw model output, raw image path/content, request payload, local config contents, fixture registry contents, server logs, or secrets were printed or persisted.
- [x] Confirm no 12-fixture benchmark, concurrency benchmark, quantization benchmark, Live Advisor simulation, vLLM/SGLang/Ollama call, serving switch, endpoint, iOS integration, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-V: Controlled Multi-fixture Serving Benchmark Approval Request Draft.

## Phase 21-V

Controlled multi-fixture serving benchmark approval request draft:

- [x] Confirm `docs/controlled-multifixture-serving-benchmark-approval-request-draft.md` is a user-facing approval request draft, not an execution plan.
- [x] Confirm `npm run qa:open-weight-vlm:controlled-multifixture-serving-benchmark-approval-request` reports `approvalRequestGateEligible:true`, `safeDraftOnlyRequestPassed:true`, `servingRuntimeStarted:false`, `endpointCalled:false`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `servingStackSwitched:false`, and `productionReady:false`.
- [x] Confirm blocked scenarios include current model call, current benchmark execution, fixture count `<=1`, fixture/call count mismatch, fixture-token count mismatch, retry count above zero, non-Transformers+FastAPI stack, missing explicit approval, missing explicit fixture-token requirement, missing approved registry requirement, raw output/logging, `productionReady:true`, iOS integration, endpoints, Camera cloud runtime, Auto-Trigger/WSS/upload runtime, and serving stack switch.
- [x] Confirm no serving runtime, endpoint call, model call, Qwen inference, fixture inference, serving benchmark, serving switch, vLLM/SGLang/Ollama call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-W: Approved Controlled Multi-fixture Transformers+FastAPI Serving Benchmark, requiring separate explicit multi-call benchmark approval.

## Phase 21-W0

Approved fixture token inventory:

- [x] Confirm ignored local fixture registry was inspected with sanitized token/count output only.
- [x] Confirm approved fixture count is `13`, ready fixture count is `13`, missing fixture files count is `0`, duplicate token count is `0`, and unexpected token shape count is `0`.
- [x] Confirm exactly 12 ready is `false`, so no Phase 21-W approval phrase was generated.
- [x] Confirm model call executed `no`, benchmark executed `no`, endpoint called `no`, healthz checked `no`, call count `0`, retry count `0`, and `productionReady:false`.
- [x] Confirm ignored local config, fixture registry, and fixture files remain ignored, untracked, and unstaged.

## Phase 21-W

Approved controlled 12-fixture Transformers+FastAPI serving benchmark:

- [x] Confirm Phase 21-V and Phase 21-W0 commit markers were present before the approved controlled 12-fixture attempt.
- [x] Confirm exact approved fixture tokens were `smoke_004` through `smoke_015`, with `smoke_001` excluded.
- [x] Confirm standalone healthz preflight was safe before the benchmark attempt.
- [x] Confirm the approved benchmark command ran exactly once and preflight-blocked with `blocked_for_unsafe_endpoint_bucket` before any model calls.
- [x] Confirm model call count `0`, benchmark/inference endpoint call count `0`, retry count `0`, accepted count `0`, rejected count `0`, and `productionReady:false`.
- [x] Confirm no concurrency benchmark, quantization benchmark, Live Advisor simulation, vLLM/SGLang/Ollama call, serving switch, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-W-R1

Controlled 12-fixture endpoint bucket block resolution:

- [x] Confirm endpoint bucket mismatch was fixed by normalizing `local_loopback_name`, `local_loopback_ip`, and `private_lan_ipv4` to approved local/private buckets before controlled wrapper policy checks.
- [x] Confirm unsafe buckets remain blocked, including public IP/domain, tunnel/ngrok, credentialed URL, query-string secret, `0.0.0.0`, missing, and unknown buckets.
- [x] Confirm private LAN still requires explicit local opt-in.
- [x] Confirm no model call, benchmark, fixture inference, inference endpoint call, 12-fixture benchmark rerun, serving switch, vLLM/SGLang/Ollama call, external server change, iOS runtime change, raw artifact, secret, or production rollout occurred.
- [x] Confirm `Qwen3-VL-30B-A3B` is documented only as a future target candidate and was not installed, downloaded, loaded, benchmarked, or called in this phase.
- [x] Confirm roadmap current next phase is Phase 21-W-R1B and requires separate explicit approval before model calls.

## Phase 21-W-R1B

Approved controlled 12-fixture benchmark retry after endpoint bucket fix:

- [x] Confirm prerequisite commit markers for Phase 21-W0, Phase 21-W, and Phase 21-W-R1 were present before healthz/benchmark.
- [x] Confirm healthz preflight was safe and endpoint bucket normalization was active before the retry.
- [x] Confirm the approved retry command ran exactly once with `smoke_004` through `smoke_015`, call count `12`, and retry count `0`.
- [x] Confirm sanitized aggregate result was mixed/rejected with accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, and latency bucket `lt_1s x12`.
- [x] Confirm no raw prompt, raw model output, raw image path/content, request payload, local config contents, fixture registry contents, server logs, EXIF/GPS/sensor data, or secrets were printed or persisted.
- [x] Confirm no concurrency benchmark, quantization benchmark, Live Advisor simulation, vLLM/SGLang/Ollama call, serving switch, Qwen3-VL-30B-A3B switch/download/load/benchmark/call, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.
- [x] Confirm roadmap current next phase is Phase 21-W-R2: Controlled Multi-fixture Benchmark Rejection Diagnostics.

## Phase 21-W-R2

Controlled multi-fixture rejection diagnostics:

- [x] Confirm diagnostics ran no model call, no benchmark, no healthz, no fixture inference, and no inference endpoint call.
- [x] Confirm diagnostics CLI reports `diagnosticEligible:true`, likely failure layer `external_route_error_mapping_or_fixture_token_contract`, and `productionReady:false`.
- [x] Confirm Phase 21-U accepted path versus W-R1B rejected path comparison rules out serving stack switch, endpoint bucket mismatch, retry expansion, dry-run/no-network path, schema validation after JSON parse, and model-quality failure.
- [x] Confirm next safe action is Phase 21-W-R2C: External Server Fixture-token Contract Fix.
- [x] Confirm no serving switch, Qwen3-VL-30B-A3B switch/download/load/benchmark/call, vLLM/SGLang/Ollama, iOS integration, endpoint, Auto-Trigger runtime, WSS runtime, upload runtime, raw artifact, secret, or production rollout was added.

## Phase 21-W-R2C

External server fixture-token contract fix:

- [x] Confirm external server no-model fixture-token contract accepts `smoke_001` and `smoke_004` through `smoke_015`.
- [x] Confirm missing/unsupported token buckets are sanitized.
- [x] Confirm contract check reports `modelLoaded:false`, `inferenceEndpointCalled:false`, and `benchmarkRun:false`.
- [x] Confirm no model call, benchmark, fixture inference, inference endpoint call, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-R2C2: Backend No-model Contract Echo Validation Against External Server.

## Phase 21-W-R2C2

Backend no-model contract echo validation:

- [x] Confirm external no-model checker still passes with `approvedTokenCount:13`.
- [x] Confirm backend validator/CLI exists and blocks model call, inference endpoint, benchmark, raw artifact leakage, and `productionReady:true`.
- [x] Confirm backend no-model HTTP validation blocks safely when unsupported/missing token buckets are not explicit.
- [x] Confirm no model call, benchmark, fixture inference, inference endpoint call, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-R2C4: Contract Echo Validation Failure Fix.

## Phase 21-W-R2C-FINAL

Backend no-model contract echo validation pass:

- [x] Confirm external checker passes with `approvedTokenCount:13`.
- [x] Confirm backend contract echo validation passes.
- [x] Confirm unsupported token bucket is `unsupported_fixture_token`.
- [x] Confirm missing token bucket is `missing_fixture_token`.
- [x] Confirm no model call, benchmark, fixture inference, inference endpoint call, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-R3 only after separate explicit approval.

## Phase 21-W-R3

Controlled 12-fixture benchmark retry after contract echo fix:

- [x] Confirm external no-model contract checker passed before healthz.
- [x] Confirm backend no-model contract echo validation passed before healthz.
- [x] Confirm approved run scope was exactly `smoke_004` through `smoke_015`, call count `12`, retry count `0`.
- [x] Confirm healthz preflight blocked with `model_not_loaded` before benchmark/model calls.
- [x] Confirm actual call count `0`, retry count `0`, accepted count `0`, rejected count `0`.
- [x] Confirm no inference endpoint call, model call, benchmark, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-R3-R1 healthz block resolution.

## Phase 21-W-R3-R1

Healthz model-not-loaded block resolution:

- [x] Confirm external no-model contract checker still passes.
- [x] Confirm healthz-only checker remains blocked with `model_not_loaded`.
- [x] Confirm sanitized dependency probe reports no missing dependency class.
- [x] Confirm likely blocker bucket is `model_load_disabled`.
- [x] Confirm resolved:no, modelLoaded:no, call count `0`, retry count `0`.
- [x] Confirm no inference endpoint call, model call, benchmark, fixture inference, Qwen3-VL-30B-A3B install/load/call, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-R3-R1A operator model-enabled server startup.

## Phase 21-W-GOAL

Autonomous controlled 12-fixture benchmark final result attempt:

- [x] Confirm external no-model contract checker still passes.
- [x] Confirm one model-enabled local/private startup attempt was made through the existing helper.
- [x] Confirm healthz remained blocked with `model_not_loaded`.
- [x] Confirm likely blocker bucket is `missing_local_model_runtime`.
- [x] Confirm benchmark executed:no, model call count `0`, retry count `0`, accepted count `0`, rejected count `0`, blocked count `1`.
- [x] Confirm no extra calls, benchmark retry, fixture substitution, inference endpoint call, Qwen3-VL-30B-A3B install/load/call, vLLM/SGLang/Ollama, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-GOAL-R1 operator model runtime preparation.

## Phase 21-W-GOAL-R2

Approved controlled 12-fixture benchmark retry after model runtime readiness:

- [x] Confirm user explicitly approved one controlled 12-fixture Transformers+FastAPI benchmark retry after model runtime readiness.
- [x] Confirm external no-model fixture-token contract check still passes.
- [x] Confirm backend no-model contract echo validation still passes.
- [x] Confirm ignored local config, ignored fixture registry, and `smoke_004` through `smoke_015` fixture files are present, ignored, untracked, and unstaged.
- [x] Confirm exact fixture set is `smoke_004` through `smoke_015`, with no `smoke_001` in the controlled benchmark.
- [x] Confirm fresh healthz before benchmark is `safe` with `modelLoaded:true`, `modelFamilyBucket:qwen_vlm_compatible`, raw logging disabled, public exposure `no`, and `productionReady:false`.
- [x] Confirm guarded benchmark ran exactly once with call count `12` and retry count `0`.
- [x] Confirm accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, and latency bucket `lt_1s x12`.
- [x] Confirm raw output, raw prompt, raw payload, raw image content, raw image paths, raw server URL, config contents, registry contents, server logs, and secrets were not printed or persisted.
- [x] Confirm no retry, no extra fixture, no Qwen3-VL-30B-A3B install/download/load/call, no vLLM/SGLang/Ollama, no serving switch, no iOS runtime change, no endpoint addition, no Auto-Trigger runtime, no WSS runtime, no upload runtime, no local CV runtime, and no production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-GOAL-R2-R2 local model unavailable after model runtime readiness; any further model or benchmark call requires separate explicit approval.

## Phase 21-W-GOAL-R2-R2

Local model unavailable after runtime readiness diagnostics:

- [x] Confirm external no-model contract checker still passes.
- [x] Confirm backend no-model contract echo validation still passes.
- [x] Confirm healthz preflight is `safe` with `modelLoaded:true`.
- [x] Confirm no real inference endpoint call, model call, benchmark, fixture inference, fixture image open, OCR, EXIF/GPS/sensor inspection, Qwen inference, or Qwen3-VL-30B-A3B use occurred.
- [x] Confirm external no-model route-contract dry-run was added.
- [x] Confirm external dry-run accepted `smoke_004` through `smoke_015` with `acceptedDryRunCount:12`.
- [x] Confirm external dry-run reports unsupported bucket `unsupported_fixture_token`, missing bucket `missing_fixture_token`, and routeability bucket `fixture_not_available x12`.
- [x] Confirm backend dry-run CLI was added and blocks `unknown` / `local_model_unavailable` contract buckets.
- [x] Confirm backend live dry-run safely blocked with `route_not_found` because the running external process had not loaded the new endpoint.
- [x] Confirm benchmark wrapper preserves explicit HTTP error buckets instead of mapping every HTTP non-OK response to `local_model_unavailable`.
- [x] Confirm next safe action is Phase 21-W-GOAL-R2-R2A route contract dry-run follow-up; any further model or benchmark call requires separate explicit approval.

## Phase 21-W-GOAL-R2-R2A

Route contract dry-run follow-up:

- [x] Confirm external static route-contract dry-run checker still passes.
- [x] Confirm external fixture-token contract checker still passes.
- [x] Confirm backend live dry-run still blocked with `route_not_found` before reload.
- [x] Confirm route-not-found cause bucket is `stale_server_process`.
- [x] Confirm local/private listener restart was attempted through the approved helper only.
- [x] Confirm post-reload backend healthz blocked with `connection_refused`.
- [x] Confirm backend live route dry-run was not rerun after healthz failed.
- [x] Confirm no controlled 12-fixture benchmark, one-fixture benchmark, model call, real inference endpoint call, fixture inference, Qwen inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-GOAL-R2-R2A-R2 healthz recheck / runtime restart follow-up; any further model or benchmark call requires separate explicit approval.

## Phase 21-W-FINAL

Bounded route debug and benchmark finalization attempt:

- [x] Confirm total model-call cap was `14`, diagnostic cap was `2`, final benchmark cap was `12`, and retry count was `0`.
- [x] Confirm external fixture-token checker passed.
- [x] Confirm external route-contract dry-run checker passed.
- [x] Confirm external route error mapping preserves known sanitized buckets before generic `route_not_found`.
- [x] Confirm backend live dry-run was unavailable while the server was down.
- [x] Confirm safe local/private server startup was attempted through the approved helper.
- [x] Confirm backend healthz blocked with `connection_refused`.
- [x] Confirm diagnostic model calls used `0`, final benchmark calls used `0`, total model calls used `0`, and retry count stayed `0`.
- [x] Confirm no controlled 12-fixture benchmark, one-fixture benchmark, real inference endpoint call, fixture inference, Qwen inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-FINAL-R1 model runtime readiness reblocked; any further model or benchmark call requires separate explicit approval.

## Phase 21-W-FINAL-R1

Model runtime readiness reconnect:

- [x] Confirm external fixture-token checker passed.
- [x] Confirm external route-contract dry-run checker passed.
- [x] Confirm the expected local/private port was not listening before restart.
- [x] Confirm server restart was attempted through the approved local/private helper.
- [x] Confirm a listener briefly appeared after restart.
- [x] Confirm backend healthz blocked with `connection_refused`.
- [x] Confirm backend live route dry-run was not run after healthz failed.
- [x] Confirm no controlled 12-fixture benchmark, one-fixture benchmark, model call, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred.
- [x] Confirm next safe action is Phase 21-W-FINAL-R1A persistent server process availability fix; any further model or benchmark call requires separate explicit approval.

## Phase 21-G2

Missing feature + deferred roadmap register:

- [ ] Confirm `docs/missing-features-and-deferred-roadmap-register.md` exists.
- [ ] Confirm it records Live Advisor, local CV, compression/upload payload, backend production API, VLM model/serving, Photo Advisor UX, iOS integration, Store/account/release, and advanced future-feature gaps.
- [ ] Confirm it includes the updated `Qwen3-VL-30B-A3B` future target candidate, non-thinking mode, vLLM/SGLang, Auto-Trigger stillness >1s, no capture/upload at <=1s, max 1 FPS cloud analysis, stateful WSS, frontend compression, INT4/INT8 quantization, local on-device CV split, and consent/no-silent-upload boundary.
- [ ] Confirm this phase adds no runtime implementation, no iOS integration, no Camera cloud AI runtime entry, no Auto-Trigger runtime, no WSS runtime, no upload/compression runtime, no endpoint, no model call, no Qwen inference, no benchmark, and no production readiness change.

## Phase 21-H

Controlled backend local model route dry-run plan:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:local-model-route-dry-run-plan`.
- [ ] Confirm the gate reports `dryRunPlanEligible:true`, `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.
- [ ] Confirm the future first route shape is one declared `synthetic_local_fixture` token, fixture count `1`, one call only, no retries, local/private backend-internal only, and structured candidate JSON only.
- [ ] Confirm blocker coverage includes multi-fixture plans, retry enabled, missing fixture token scope, real user-photo scope, unsafe healthz, public/cloud/ngrok endpoint, raw logging, raw persistence, staged local config/registry/fixture policy, validator bypass, fallback/safety bypass, iOS integration, app-facing endpoint, production endpoint, `modelCallsMade:true`, `qwenInferenceRun:true`, `benchmarkRun:true`, and `productionReady:true`.
- [ ] Confirm no raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, raw provider response, URL, credential, token, or secret is printed.
- [ ] Confirm no `local_model` route is enabled, no Qwen inference runs, no model inference runs, no fixture inference runs, no serving benchmark runs, no iOS integration is added, no app-facing endpoint is added, no production endpoint is added, no real user-photo upload is accepted, and no production rollout is enabled.

## Phase 21-G

Backend Gateway local model route approval gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:local-model-route-approval`.
- [ ] Confirm the gate reports `approvalEligible:true`, `localModelRouteEnabled:false`, `networkCallsMade:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `benchmarkAllowed:false`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] Confirm required approval buckets cover clean/upstream-synced repo state, Phase 21-G committed/pushed status, deployment config/env preflight, cross-platform boundary, provider routing, provider adapter no-model HTTP, safe healthz, `publicExposure:no`, `rawLoggingDisabled:true`, local/private endpoint scope, ignored local config/registry/fixtures, future explicit user approval, scoped fixture tokens, structured candidate JSON, backend validator, and fallback/safety gates.
- [ ] Confirm blockers cover production readiness, public/cloud/tunnel exposure, raw logging, raw persistence, direct iOS provider/model calls, Camera cloud AI entry, backend/iOS payload drift, app-facing endpoint, production endpoint, user-photo upload, missing consent/retention/deletion policy, staged local sandbox artifacts, unsupported provider modes, validator bypass, fallback bypass, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, model calls, Qwen inference, and benchmark execution.
- [ ] Confirm no raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, provider response text, real provider URL, or secret value is printed.
- [ ] Confirm no real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, local model route enablement, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, auth/billing/quota runtime, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-F

Backend deployment config/env preflight:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:deployment-config-env-preflight`.
- [ ] Confirm the gate reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, `eligibleForDeploymentConfigEnvReview:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] Confirm allowed policy categories are bucket-only: app environment, gateway mode, provider mode, provider URL, provider auth, secret injection, timeout, max image bytes, raw logging disabled, metadata stripping required, consent required, retention policy required, deletion policy required, and production readiness false.
- [ ] Confirm forbidden config is blocked: committed secrets, iOS/backend provider keys, runtime Windows/Mac paths, hardcoded LAN model URLs in iOS, committed production URLs, public/cloud/tunnel local provider URLs, raw logging, app-facing endpoint flags, production endpoint flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmarks, and `productionReady:true`.
- [ ] Confirm no raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, provider response text, real provider URL, or secret value is printed.
- [ ] Confirm no real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, auth/billing/quota runtime, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-E

Cross-platform backend deployment boundary audit:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:cross-platform-boundary`.
- [ ] Confirm the gate reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, `eligibleForDeploymentBoundaryReview:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] Confirm Windows local paths and local model URLs are allowed only in docs/operator/manual-smoke/ignored-example/test-sandbox buckets.
- [ ] Confirm backend runtime, iOS runtime, production config, and future production architecture do not require Windows paths, Mac local paths, LAN model URLs, public/cloud/tunnel model URLs, or provider/model secrets.
- [ ] Confirm iOS still has no direct provider/model route, no Camera cloud AI entry, no iOS upload payload change, no capture-context upload, no app-facing endpoint, no production endpoint, and no production rollout.
- [ ] Confirm future production must use backend-mediated provider calls with env/secrets/config, not committed local paths or LAN URLs.
- [ ] Confirm no real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-B

Backend internal VLM Gateway adapter stub and external no-model echo:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:gateway-adapter-stub`.
- [ ] Confirm the adapter stub reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `acceptedCount:1`, `eligibleForPhase21CPlanning:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] If the external local server is running, run `npm run qa:open-weight-vlm:gateway-external-contract-echo`.
- [ ] Confirm the external echo checks healthz and `/local/vlm/gateway-contract-echo` only, with `publicExposure:no`, `rawLoggingDisabled:true`, `modelInferenceRun:false`, raw persistence flags false, structured candidate JSON, and `productionReady:false`.
- [ ] Confirm the external server is still a local/private sandbox only, not the app backend or a production backend.
- [ ] Confirm no real model smoke, Qwen inference, serving benchmark, vLLM/SGLang/Ollama call, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-C

Backend internal VLM gateway provider routing dry-run:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:gateway-provider-routing`.
- [ ] Confirm the dry-run reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, `eligibleForPhase21DPlanning:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] Confirm `local_stub` and `local_contract_echo` are the only allowed provider modes.
- [ ] Confirm `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes are blocked.
- [ ] Confirm the dry-run reports only sanitized routing decisions and does not print raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, or provider response text.
- [ ] Confirm no real model smoke, Qwen inference, serving benchmark, vLLM/SGLang/Ollama call, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-D

Backend internal provider adapter no-model HTTP check:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http`.
- [ ] Confirm the check accepts only the `local_contract_echo` route.
- [ ] If the external local server is running, confirm it checks healthz first and then `/local/vlm/gateway-contract-echo` only.
- [ ] Confirm `publicExposure:no`, `rawLoggingDisabled:true`, `modelInferenceRun:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm the returned candidate is structured JSON and passes the existing validator/safety chain.
- [ ] Confirm no raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, server logs, EXIF, or provider response text is printed.
- [ ] Confirm no real model smoke, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 21-A

Backend internal VLM Gateway contract preflight:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:gateway-contract-preflight`.
- [ ] Confirm the preflight reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `eligibleForPhase21BPlanning:true`, `eligibleForAppIntegration:false`, and `productionReady:false`.
- [ ] Open `docs/backend-internal-vlm-gateway-contract-preflight.md`.
- [ ] Confirm the request contract is backend-internal only and uses sanitized buckets / optional fixture token only.
- [ ] Confirm the response contract is structured candidate JSON only and must pass the existing open-weight VLM validator/safety gates before any app-facing use.
- [ ] Confirm blocked fields include raw image/base64/path/prompt, GPS/raw EXIF, raw sensor values, provider secrets, direct iOS provider fields, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, raw provider response, request payload, app-facing endpoint flags, and production endpoint flags.
- [ ] Confirm no real model smoke, Qwen inference, serving benchmark, iOS integration, app-facing endpoint, production endpoint, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout is introduced.

## Phase 20-P

Serving benchmark preflight and Phase 21 entry criteria:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:serving-benchmark-preflight`.
- [ ] Confirm the preflight reports `networkCallsMade:false`, `benchmarkRun:false`, `qwenInferenceRun:false`, `eligibleForPhase21EntryReview:true`, `eligibleForBenchmarkExecution:false`, and `productionReady:false`.
- [ ] Open `docs/open-weight-vlm-serving-benchmark-preflight.md`.
- [ ] Confirm the serving stack matrix lists Transformers + FastAPI, vLLM, SGLang, and Ollama / LM Studio as future benchmark planning categories only.
- [ ] Confirm no real model smoke, Qwen inference, vLLM/SGLang/Ollama/LM Studio execution, fixture image change, ignored local registry change, iOS integration, app-facing endpoint, production endpoint, or production rollout is introduced.

## Phase 20-M

12 approved ignored fixtures and no-model routing echo:

- [ ] Confirm the ignored local fixture registry reports `totalFixtures:12`, `approvedCount:12`, `blockedCount:0`, `missingRequiredCategories:[]`, `eligibleForControlledSmoke:true`, `networkCallsMade:false`, and `productionReady:false`.
- [ ] Confirm fixture routing contract echo reports `totalFixtureTokens:12`, `routeableCount:12`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `publicExposure:no`, and `productionReady:false`.
- [ ] Confirm fixture images and local registry remain ignored/uncommitted.
- [ ] Confirm no real model smoke, Qwen inference, raw prompt/model output/image path/base64/request payload, app-facing endpoint, iOS integration, production endpoint, or production rollout is introduced.

## Phase 20-N

Controlled 12-fixture local/private smoke:

- [ ] Confirm the smoke ran exactly once per approved ignored token `smoke_004` through `smoke_015`.
- [ ] Confirm the sanitized aggregate is `fixtureCount:12`, `acceptedCount:12`, `rejectedCount:0`, `acceptanceRate:100%`, `validationCodeCounts:null x12`, `fallbackCategoryCounts:null x12`, no schema diagnostic buckets, `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm repeatability and failure/latency gates pass with a latency note only.
- [ ] Confirm this remains backend-only and does not approve iOS integration, app-facing endpoints, production endpoints, or production rollout.

## Phase 20-O

12-fixture smoke review and serving benchmark decision gate:

- [ ] Open `docs/open-weight-vlm-serving-benchmark-decision-gate.md`.
- [ ] Confirm the Phase 20-N aggregate is recorded as sanitized review data only: `fixtureCount:12`, `acceptedCount:12`, `rejectedCount:0`, `acceptanceRate:100%`, no validation/fallback/schema diagnostic buckets, `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm the decision is Phase 20-P serving-stack benchmark preflight only, not benchmark execution.
- [ ] Confirm no real model smoke, Qwen inference, vLLM/SGLang/Ollama benchmark, model-stack switch, fixture image change, ignored local registry change, iOS integration, app-facing endpoint, production endpoint, or production rollout is introduced.

## Phase 20-L

12-fixture coverage expansion plan and no-model registry gate:

- [ ] From `backend/`, run `npm run qa:open-weight-vlm:expanded-fixtures`.
- [ ] Confirm the dry-run is no-model/no-network and reports `totalTargetFixtures:12`, 12 `requiredCategories`, `approvedCount:12`, `blockedCount:0`, `missingRequiredCategories:[]`, `eligibleForControlledSmoke:true`, `networkCallsMade:false`, and `productionReady:false`.
- [ ] Confirm an 8-category registry remains ineligible and reports the four planned missing categories: `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`.
- [ ] Confirm no real model smoke, Qwen inference, fixture image commit, local config/registry commit, raw prompt/model output/image path/base64/request payload output, iOS integration, app-facing endpoint, production endpoint, serving-stack benchmark, training/fine-tuning, or production readiness change is introduced.

## Phase 20-K

Expanded local VLM smoke result review and coverage gap plan:

- [ ] Open `docs/open-weight-vlm-expanded-smoke-result-review.md`.
- [ ] Confirm the Phase 20-J aggregate is recorded as sanitized evidence only: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`, no validation/fallback/schema diagnostic buckets, `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm the review distinguishes what was proven from what remains unproven, including no production readiness, no iOS integration, no user-photo upload, no consent UI, no app-facing/production endpoint, no broad dataset, no concurrency/throughput, no serving-stack comparison, no multilingual real-output review, no fine-tuning, and no on-device model.
- [ ] Confirm the coverage gaps include warm indoor, soft focus, street chrome / high contrast, overexposed unreadable, backlit, cluttered, tilted, night grain, washed-out flash, mixed light, low-detail, and abstract/minimal scenes.
- [ ] Confirm the latency note says `gt_15s x3` is sandbox review data, not production approval.
- [ ] Confirm recommended Phase 20-L is 12-fixture coverage expansion planning plus a no-model registry gate.
- [ ] Confirm no real model smoke, Qwen inference, fixture image changes, real local registry expansion, serving-stack benchmark, iOS integration, app-facing endpoint, production endpoint, training/fine-tuning, raw artifact commit, or production readiness change is introduced.

## Phase 20-G

Controlled expanded local VLM smoke blocked result:

- [ ] Confirm the recorded Phase 20-G aggregate is sanitized only: `fixtureCount:8`, `acceptedCount:0`, `rejectedCount:8`, `fallbackCategoryCounts:blocked_for_provider_integration x8`, `latencyBucketCounts:lt_1s x8`, no schema diagnostic buckets, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm the run used exactly eight approved fixture tokens, one call per fixture, no retries, and no extra fixtures.
- [ ] Confirm repeatability and failure/latency gates blocked the aggregate.
- [ ] Confirm Phase 20-H provider diagnostic output is sanitized, no-model, and classifies the block as a likely pre-inference fixture availability / routing mismatch before any future real smoke is considered.
- [ ] Confirm Phase 20-I fixture routing contract echo passes for `smoke_001` through `smoke_008` with `routeableCount:8`, `modelInferenceRun:false`, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm Phase 20-J controlled retry records exactly eight local/private Qwen calls, one per approved fixture token, no retries, `acceptedCount:8`, `rejectedCount:0`, latency note only, raw persistence flags false, and `productionReady:false`.
- [ ] Confirm no raw prompt, raw model output, image path, base64, request payload, local config contents, fixture registry contents, server logs, credentials, raw reports, local config, local registry, fixture images, or model weights were committed.
- [ ] Confirm no iOS source/project/localization files changed, no Camera cloud entry was added, no iOS provider/model key or direct call was added, no iOS upload payload changed, no capture-context upload was added, and no production remote rollout was enabled.

## Phase 20-F

Expanded fixture registry dry-run and backend-only planning gate:

- [ ] Open `docs/open-weight-vlm-expanded-fixture-registry-plan.md`.
- [ ] Confirm the plan records the 8-12 target fixture categories, sanitized metadata schema, approval rules, privacy/safety exclusions, coverage matrix, dry-run gate, future controlled-smoke rules, and `productionReady:false`.
- [ ] From `backend/`, run `npm run qa:open-weight-vlm:expanded-fixtures`.
- [ ] Confirm the dry-run reports sanitized aggregate fields only: `totalFixtures`, `approvedCount`, `blockedCount`, `categoryCoverage`, `missingRequiredCategories`, `blockedReasonCounts`, `eligibleForControlledSmoke`, `productionReady:false`, and `networkCallsMade:false`.
- [ ] Confirm no real model smoke ran, no fixture images were required or committed, no local config or local registry was committed, and no raw paths, prompts, model outputs, request payloads, reports, logs, weights, or credentials were printed or staged.
- [ ] Confirm no iOS source/project/localization files changed, no Camera cloud entry was added, no iOS provider/model key or direct call was added, no iOS upload payload changed, no capture-context upload was added, and no production remote rollout was enabled.

## Phase 20-E-E

Local VLM sandbox review summary and Phase 20-F entry criteria:

- [ ] Open `docs/open-weight-vlm-local-sandbox-review-summary.md`.
- [ ] Confirm the summary covers D2J, E-A, E-B1, E-B2, E-C, and E-D.
- [ ] Confirm proven items include backend-to-Windows local/private Qwen2.5-VL sandbox path, validator-accepted deterministic mapper output, 3 approved ignored fixtures passing once and in repeat smoke, failure/latency taxonomy, false raw persistence flags, and viable Windows-primary workflow.
- [ ] Confirm not-proven items include production readiness, iOS integration, real user-photo upload, consent UI, app-facing/production endpoint, quota/billing/entitlement, deletion/retention implementation, App Store privacy disclosure, large fixture set, model comparison, vLLM/SGLang benchmark, throughput/concurrency, multilingual real-image evaluation beyond copy gates, fine-tuning, and on-device model work.
- [ ] Confirm Phase 20-F entry criteria require clean repo, upstream `0 0`, E-E committed/pushed, ignored local artifacts still ignored, local/private Windows server, raw logging disabled, safe healthz before future smoke, all gates passing, and explicit 20-F scope.
- [ ] Confirm recommended Phase 20-F option is expanded fixture set planning plus fixture registry schema.
- [ ] Confirm no real model smoke, fixture expansion, vLLM/SGLang benchmark, iOS integration, endpoint work, training/fine-tuning, validator weakening, fixture approval loosening, local artifact commit, or production readiness change is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-E-A

Accepted local VLM smoke record and expansion gate:

- [ ] Open `docs/open-weight-vlm-local-smoke-expansion-gate.md`.
- [ ] Confirm the D2J record is sanitized and contains no raw prompt, raw model output, raw image/base64/path, request payload, full server URL, local config, fixture registry, fixture image, credentials, or Windows server logs.
- [ ] Confirm D2J recorded `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, `schemaDiagnostic:null`, `networkCallsMade:true`, and `productionReady:false`.
- [ ] Confirm the MacBook + Windows GPU split remains backend-only and iOS does not call the model server.
- [ ] Confirm Phase 20-E-B is limited to 3-5 approved ignored fixtures, fixture IDs only, one run per fixture, no retry loops to chase pass rate, and sanitized aggregate metrics only.
- [ ] Confirm Phase 20-E-B still requires backend tests, synthetic benchmark, benchmark gate, local config dry-run, default local smoke, local smoke gate, Windows healthz, and contract echo before Qwen-backed runs.
- [ ] Confirm no iOS integration, app-facing endpoint, production endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-E-B2

Completed 3-fixture local VLM smoke expansion:

- [ ] Confirm the initial `smoke_002` / `smoke_003` block was due to missing approved fixture availability in the external Windows server workspace, not a backend validator or iOS issue.
- [ ] Confirm the 3-fixture run completed exactly once per fixture with `smoke_001`, `smoke_002`, and `smoke_003`.
- [ ] Confirm the sanitized aggregate was `fixtureCount:3`, `acceptedCount:3`, `rejectedCount:0`, `acceptanceRate:100%`, `validationCodeCounts:null x3`, `fallbackCategoryCounts:null x3`, no schema diagnostic buckets, `latencyBucketCounts:gt_15s x1, 5s_to_15s x2`, `networkCallsMade:true`, and `productionReady:false`.
- [ ] Confirm no raw prompt, raw model output, raw image/base64/path, request payload, local config, fixture registry, fixture image, credentials, or Windows server logs were printed.
- [ ] Confirm no iOS integration, app-facing endpoint, production endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-E-C

Local VLM smoke repeatability gate:

- [ ] Run `cd backend && npm run qa:open-weight-vlm:local-repeatability-gate`.
- [ ] Confirm the B2 baseline gate reports `pass_for_local_repeatability_review`, `pass_with_latency_note`, no hard blockers, and `productionReady:false`.
- [ ] Confirm the gate reviews only fixture counts, accepted/rejected counts, acceptance rate, validation/fallback/schema buckets, latency buckets, `networkCallsMade`, `productionReady`, and raw persistence flags.
- [ ] Confirm tests cover schema diagnostic rejection, provider-integration fallback rejection, raw prompt/model-response persistence rejection, `productionReady:true` rejection, and the `gt_15s` latency note case.
- [ ] Confirm the gate does not require or print raw prompt, raw model output, raw image/base64/path, request payload, local config contents, fixture registry contents, fixture images, credentials, or Windows server logs.
- [ ] Confirm no optional repeat smoke is run unless all safe gates and healthz pass and the operator explicitly chooses to spend exactly one call per approved fixture.
- [ ] Confirm no iOS integration, app-facing endpoint, production endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-E-D

Local VLM smoke failure and latency taxonomy:

- [ ] Run `cd backend && npm run qa:open-weight-vlm:local-failure-taxonomy`.
- [ ] Confirm the default command uses a synthetic sanitized sample, makes no model call, and reports `pass_clean_local_smoke`, `latency_ok`, no hard blockers, and `productionReady:false`.
- [ ] Confirm taxonomy tests cover clean pass, accepted latency note, schema regression, provider-integration fallback, raw persistence, model/server unavailable, fixture readiness, repeatability drift, latency regression/blocker, `productionReady:true`, unknown aggregate state, and sanitized CLI output.
- [ ] Confirm accepted `gt_15s` latency is a review note, all accepted `gt_15s` is latency regression review data, and timeout/unavailable buckets block review.
- [ ] Confirm the taxonomy does not require or print raw prompt, raw model output, raw image/base64/path, request payload, local config contents, fixture registry contents, fixture images, credentials, or Windows server logs.
- [ ] Confirm no larger fixture expansion or real Qwen smoke is run for this phase.
- [ ] Confirm no iOS integration, app-facing endpoint, production endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-D2G

Local VLM schema mismatch diagnostics:

- [ ] Confirm a D2F-style invalid-schema local smoke rejection reports only sanitized buckets.
- [ ] Confirm `schemaDiagnostic.errorBuckets` may include `missing_required_field`, `additional_property`, `wrong_type`, or `unsupported_enum`.
- [ ] Confirm `schemaDiagnostic.fieldBuckets` may include `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, `safety`, `observationKey`, or `safetyFlags`.
- [ ] Confirm diagnostics do not include raw model output, raw enum values, raw prompt, request payload, image/base64/path, full server URL, fixture path, credentials, or secrets.
- [ ] Confirm the backend validator still rejects shorthand candidates that use object `allowedContext`, `observationKey`, scalar `creativeIntent`, scalar `technicalRisk`, or `safetyFlags`.
- [ ] Confirm Windows FastAPI mapper guidance points back to `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs` as the source of truth.
- [ ] Confirm no retry smoke is run unless the Windows mapper is aligned and all gates pass.
- [ ] Confirm no app-facing endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, raw report commit, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-D2E

Private LAN Transformers FastAPI smoke server support:

- [ ] Confirm loopback URLs such as `http://127.0.0.1:8025/local/vlm/photo-advisor` and `http://localhost:8025/local/vlm/photo-advisor` remain accepted.
- [ ] Confirm private LAN IPv4 URLs are rejected unless ignored local config sets `allowPrivateLanModelServer:true`.
- [ ] Confirm private LAN support is limited to `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`.
- [ ] Confirm public IPs/domains, tunnel/ngrok/cloud-looking URLs, HTTPS URLs, credentialed URLs, query-string secrets, and `0.0.0.0` are rejected.
- [ ] Confirm smoke gate output uses sanitized buckets such as `private_lan_ipv4` and does not print full model server URLs or LAN IPs.
- [ ] Confirm the MacBook + Windows GPU split remains backend-only: MacBook runs Codex/Xcode/backend validators, Windows may run the local Transformers FastAPI model server, and iOS never calls the server directly.
- [ ] Confirm no real model is run by default and `--run-local-model` is not used in this phase.
- [ ] Confirm no app-facing endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, local config commit, fixture commit, report commit, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-D2A

Docs-only local Transformers FastAPI smoke server setup guide:

- [ ] Open `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`.
- [ ] Confirm the first model target is `Qwen2.5-VL-7B-Instruct`.
- [ ] Confirm fallback options are `Qwen2.5-VL-3B-Instruct` or 7B 4-bit / 8-bit only if hardware is insufficient.
- [ ] Confirm the local server is Transformers + FastAPI and must bind to `127.0.0.1` only for same-machine smoke, or to an explicitly allowed private LAN IPv4 path for the Windows GPU split.
- [ ] Confirm the endpoint contract is `POST /local/vlm/photo-advisor`.
- [ ] Confirm request style is `fixtureId` token only and does not use raw paths, base64, multipart image, raw prompt, or final UI prose.
- [ ] Confirm response style is candidate JSON only and must pass `openWeightVlmPhotoAdvisorSchema`.
- [ ] Confirm ignored fixture folder is `backend/tests/vlm-local-samples/`.
- [ ] Confirm ignored fixture registry is `backend/config/open-weight-vlm.fixtures.local.json`.
- [ ] Confirm first smoke uses exactly one fixture token: `smoke_001`.
- [ ] Confirm `.gitignore` protects local config, fixture registry, local fixture folder, and local VLM report patterns.
- [ ] Confirm no FastAPI server implementation, model server URL config, local fixture image, model output, generated report, app-facing endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-D1

Backend-only Transformers + FastAPI local adapter prep:

- [ ] Open `docs/open-weight-vlm-transformers-fastapi-local-adapter.md`.
- [ ] Confirm the selected first local serving path is `transformers_fastapi`.
- [ ] Confirm the committed example config has `enabled:false` and `allowNetworkCalls:false`.
- [ ] Confirm the real local config path remains ignored and untracked.
- [ ] Run backend tests.
- [ ] Run synthetic benchmark and benchmark gate.
- [ ] Run local sandbox config dry-run.
- [ ] Run local sandbox smoke in default no-network mode and confirm `runMode:stub_no_network`.
- [ ] Run local smoke gate and confirm it fails closed unless ignored local config is prepared.
- [ ] Confirm non-`transformers_fastapi` serving stacks are blocked for the first adapter path.
- [ ] Confirm adapter tests use injected fetch / stubs and do not require a real model server.
- [ ] Confirm local FastAPI response is candidate JSON only and is validated by `openWeightVlmPhotoAdvisorSchema`.
- [ ] Confirm invalid/unsafe FastAPI candidate output is rejected with sanitized categories.
- [ ] Confirm output does not print raw prompt, raw model output, raw image/base64/path, request payload, full model server URL, credentials, tokens, GPS/raw EXIF, or generated raw reports.
- [ ] Confirm no app-facing endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, local fixture image, generated report, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-D

Backend-only first approved local real-model smoke preflight:

- [ ] Confirm Phase 20-C is committed and upstream-synced before starting.
- [ ] Confirm `git status` is clean and `git rev-list --left-right --count @{u}...HEAD` is `0 0`.
- [ ] Confirm `backend/config/open-weight-vlm.local.json` is ignored by git.
- [ ] Confirm the ignored real local config is not tracked or staged.
- [ ] If the ignored real local config is absent, stop before any real-model call and record the safe block.
- [ ] Run backend tests.
- [ ] Run the synthetic benchmark and benchmark gate.
- [ ] Run local sandbox config dry-run.
- [ ] Run local sandbox smoke in default no-network mode.
- [ ] Run local smoke gate and confirm it fails closed unless ignored local config is present, enabled, network opt-in is true, a local/private model URL bucket is configured, and approved-local fixture mode is active.
- [ ] Confirm `--run-local-model` is not run if any gate prerequisite fails.
- [ ] Confirm output includes only sanitized blockers/categories, `productionReady:false`, and `networkCallsMade:false`.
- [ ] Confirm no raw prompt, raw model output, raw image/base64/path, request payload, full model server URL, credential, token, GPS/raw EXIF, or generated raw report is printed or persisted.
- [ ] Confirm no app-facing endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, real photo, local sample, generated report, training/fine-tuning, or production rollout is introduced.

## Phase 20-C

Backend-only local VLM operator runbook and real-model smoke gate:

- [ ] Open `docs/open-weight-vlm-local-operator-runbook.md`.
- [ ] Confirm the runbook covers purpose, scope, prerequisites, approved local fixture policy, ignored config policy, safe commands, smoke gate checks, stop conditions, sanitized reporting, artifact scan, troubleshooting, boundary confirmations, and Phase 20-D handoff.
- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] Run synthetic gate summary: `cd backend && npm run qa:open-weight-vlm:gate`.
- [ ] Run local sandbox config dry-run: `cd backend && npm run qa:open-weight-vlm:local-config`.
- [ ] Run local sandbox smoke path: `cd backend && npm run qa:open-weight-vlm:local-smoke`.
- [ ] Run local smoke gate: `cd backend && npm run qa:open-weight-vlm:local-smoke-gate`.
- [ ] Confirm local smoke gate fails closed when ignored local config is absent, disabled, missing `allowNetworkCalls:true`, using a public/non-local URL, or using a non-approved fixture mode.
- [ ] Confirm local smoke gate output includes `productionReady:false`, `networkCallsMade:false`, sanitized `hardBlockers[]`, sanitized config buckets, and prerequisite booleans.
- [ ] Confirm local smoke gate output does not print a full model server URL, raw image path, raw prompt, raw model output, base64, request payload, credentials, token-like values, secrets, or real sample names.
- [ ] Confirm no real VLM/provider call is run and no model server is contacted.
- [ ] Confirm no app-facing backend endpoint, production endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud AI entry, real photo, generated raw model report, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-B

Backend-only local VLM sandbox client smoke path:

- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] Run synthetic gate summary: `cd backend && npm run qa:open-weight-vlm:gate`.
- [ ] Run local sandbox config dry-run: `cd backend && npm run qa:open-weight-vlm:local-config`.
- [ ] Run local sandbox smoke path: `cd backend && npm run qa:open-weight-vlm:local-smoke`.
- [ ] Confirm smoke output shows `runMode:stub_no_network`, `eligibleForLocalSandboxSmoke:true`, `networkCallsMade:false`, `productionReady:false`, one accepted stubbed benchmark case, and no hard blockers.
- [ ] Confirm smoke output does not print the full model server URL, raw image path, raw prompt, raw model output, base64, request payload, credentials, or secrets.
- [ ] Confirm explicit local-model command still fails closed unless a later phase approves real local/self-hosted calls: `cd backend && npm run qa:open-weight-vlm:local`.
- [ ] Confirm the fail-closed local command sends no network/model request and reports sanitized blockers only.
- [ ] Confirm missing config, `enabled:false`, `allowNetworkCalls:false`, public/non-local URLs, URL credentials, query strings, and fragments block real local-model mode.
- [ ] Confirm no app-facing backend endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 20-A

Backend-only local/self-hosted VLM sandbox setup:

- [ ] Confirm `backend/config/open-weight-vlm.local.example.json` is an example only with `enabled:false` and `allowNetworkCalls:false`.
- [ ] Confirm actual local config files such as `backend/config/open-weight-vlm.local.json` remain ignored.
- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] Run synthetic gate summary: `cd backend && npm run qa:open-weight-vlm:gate`.
- [ ] Run local sandbox config dry-run: `cd backend && npm run qa:open-weight-vlm:local-config`.
- [ ] Run local sandbox smoke path: `cd backend && npm run qa:open-weight-vlm:local-smoke`.
- [ ] Confirm dry-run output is sanitized and does not print the full model server URL, raw image paths, raw prompts, raw model output, base64, request payloads, credentials, or secrets.
- [ ] Confirm future local-model command fails closed unless explicitly approved later: `cd backend && npm run qa:open-weight-vlm:local`.
- [ ] Confirm no network/model request is sent by the dry-run or fail-closed command.
- [ ] Confirm public/non-local model server URLs, URL credentials, query strings, and fragments are rejected.
- [ ] Confirm ignored report/image folders protect `backend/reports/vlm-local-sandbox/`, `backend/reports/vlm-benchmark/`, `backend/tests/vlm-local-samples/`, and `backend/tests/generated-images/`.
- [ ] Confirm no app-facing backend endpoint, backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud AI entry, real photo, generated report, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 19-F

Open-weight VLM real-model sandbox preflight:

- [ ] Open `docs/open-weight-vlm-real-model-sandbox-preflight.md`.
- [ ] Confirm Phase 19-F is documentation-only and does not add model server code, model server URL config, provider/model credentials, image upload, network calls, local samples, generated reports, iOS integration, training, fine-tuning, or production rollout.
- [ ] Confirm future Phase 20-A scope is backend-only local/self-hosted VLM sandbox work with explicit operator opt-in.
- [ ] Confirm allowed model candidates are Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B.
- [ ] Confirm allowed serving paths are Transformers + FastAPI, vLLM, SGLang, and Ollama / LM Studio for local smoke/manual QA only.
- [ ] Confirm model server URL, local config, local sample images, private model paths, generated reports, and model output artifacts must stay ignored/local-only.
- [ ] Confirm approved image fixtures must not include user photos by default, private real photos in git, raw image artifacts in git, GPS/raw EXIF persistence, face/person identity labels, or sensitive attribute labels.
- [ ] Confirm future runtime rules forbid raw prompt logging, raw model response logging, raw image/base64 logging, request payload logging, unsanitized image path logging, GPS/raw EXIF persistence, secrets, and unsafe model text in reports.
- [ ] Confirm future Phase 20-A hard gates include no iOS payload change, no backend provider payload change, no Camera cloud entry, no public endpoint, no `productionReady:true`, no training/fine-tuning, and no user-photo training.
- [ ] Confirm synthetic benchmark and gate must pass before any future real-model test.
- [ ] Confirm no Camera cloud entry, iOS provider/model key/direct call, iOS upload payload change, capture-context upload, or production remote rollout is introduced.

## Phase 19-E

Open-weight VLM synthetic benchmark expansion and failure taxonomy:

- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] Run synthetic gate summary: `cd backend && npm run qa:open-weight-vlm:gate`.
- [ ] If `npm` is unavailable, run the same commands through local Node: `node --test tests/*.test.mjs`, `node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic`, and `node scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs --synthetic`.
- [ ] Confirm the fixture set has 40 synthetic JSON/text-only cases and no photos, image paths, base64, user data, real model outputs, provider reports, or private content.
- [ ] Confirm accepted scenarios cover daylight, low light, warm indoor light, neon/night street, intentional blur, accidental motion blur, soft focus, tilt, grain, high contrast, faded color, backlight/silhouette, clutter, minimal composition, food/object, street, landscape, pet, architecture, imported limited context, severe blur, black image, and overexposed image.
- [ ] Confirm failure taxonomy coverage includes `invalid_json`, `schema_failed`, `unsupported_enum`, `unsupported_filter_family`, `sensitive_inference`, `score_or_rating`, `chain_of_thought`, `debug_or_provider_leakage`, `source_context_overclaim`, `retake_false_positive`, `overlong_output`, `prompt_injection`, `raw_localization_key`, `unsafe_free_text`, and `timeout_stub`.
- [ ] Confirm synthetic benchmark reports 40 expectation passes, 0 expectation failures, 0 accepted sensitive inference, 0 accepted score/rating, 0 accepted chain-of-thought, 0 accepted debug/provider leakage, 0 accepted imported overclaim, 0 accepted unsupported filter, and `productionReady:false`.
- [ ] Confirm gate summary reports no hard blockers, `eligibleForSyntheticContractReview:true`, `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`.
- [ ] Confirm output does not include raw prompt, raw model output, raw image path, base64, request payload, provider/model credentials, secrets, real photo references, GPS, raw EXIF, stack traces, or generated report artifacts.
- [ ] Confirm no backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud entry, real VLM/provider QA, training/fine-tuning, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 19-D

Open-weight VLM synthetic benchmark report and gate summary:

- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] Run synthetic gate summary: `cd backend && npm run qa:open-weight-vlm:gate`.
- [ ] If `npm` is unavailable, run the same commands through local Node: `node --test tests/*.test.mjs`, `node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic`, and `node scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs --synthetic`.
- [ ] Confirm gate output includes `productionReady:false`, `eligibleForSyntheticContractReview`, `statusCategories`, `hardBlockers`, `blockedFixtureCounts`, and reviewed metrics.
- [ ] Confirm gate output shows `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`.
- [ ] Confirm clean synthetic fixtures report no hard blockers and `pass_for_synthetic_contract`.
- [ ] Confirm blocked fixture counts include safety, schema, filter integrity, language contract, source-context overclaim, retake gate, and leakage categories.
- [ ] Confirm gate would fail on expectation failures, accepted sensitive inference, accepted score/rating, accepted chain-of-thought, accepted debug/provider leakage, accepted imported overclaim, accepted unsupported filter, `networkCallsMade:true`, or `productionReady:true`.
- [ ] Confirm output does not include raw prompt, raw model output, raw image path, base64, request payload, provider/model credentials, secrets, real photo references, GPS, raw EXIF, or stack traces.
- [ ] Confirm no backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud entry, real VLM/provider QA, training/fine-tuning, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 19-C

Backend-only open-weight VLM synthetic benchmark harness:

- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run synthetic benchmark: `cd backend && npm run qa:open-weight-vlm:synthetic`.
- [ ] If `npm` is unavailable, run `cd backend && node --test tests/*.test.mjs` and `cd backend && node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic`.
- [ ] Confirm the synthetic benchmark uses committed fixtures only and does not require a model server URL, provider/model key, network call, image upload, or real photos.
- [ ] Confirm output includes sanitized aggregate metrics only, including `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, `networkCallsMade:false`, accepted/rejected counts, and fallback categories.
- [ ] Confirm report output does not include raw image/base64, raw prompt, raw model/provider response, request payload, secrets, private paths, GPS, raw EXIF, stack trace, or real sample names.
- [ ] Confirm valid fixtures cover bright daylight, low light, intentional blur, motion blur, tilted snapshot, grainy retro, high contrast, faded color, imported limited context, severe blur, and black image.
- [ ] Confirm invalid fixtures cover invalid JSON, schema failure, unsupported filter family, sensitive inference, score/rating, chain-of-thought, debug/provider leakage, imported capture-context overclaim, and retake false positive.
- [ ] Confirm imported fixtures use `allowedContext:imageOnly` and do not claim capture-time motion, tilt, focus, lens, stability, or exposure context.
- [ ] Confirm retake is allowed only for severe unusable technical risk and remains optional.
- [ ] Confirm `.gitignore` protects future VLM benchmark reports, generated images, and local VLM sample folders.
- [ ] Confirm no backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider/model key/direct call, Camera cloud entry, real VLM/provider QA, training/fine-tuning, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 19-B

Open-weight VLM structured Advisor benchmark plan:

- [ ] Open `docs/open-weight-vlm-structured-advisor-benchmark-plan.md`.
- [ ] Confirm the plan is documentation-only and does not approve model server implementation.
- [ ] Confirm first benchmark candidates are Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B.
- [ ] Confirm serving stack roles are Transformers + FastAPI for correctness, Ollama / LM Studio for local smoke/manual QA, vLLM as primary internal benchmark stack, and SGLang as performance / structured-output challenger.
- [ ] Confirm benchmark dataset categories cover bright, low light, intentional blur, motion, tilt, grain, high contrast, faded color, imported limited context, severe blur, black image, unsupported filter, prompt injection, and safety cases.
- [ ] Confirm structured VLM candidate JSON is enum/key-based only and does not include final UI prose.
- [ ] Confirm validator responsibilities include JSON parsing, schema validation, `additionalProperties=false`, enum whitelist, source/context validation, filter-family mapping to whitelisted filter IDs, retake gate, safety scan, and fallback.
- [ ] Confirm metrics include valid JSON, schema pass, safety pass, fallback, filter family match, creative intent preservation, retake false positive, imported-context overclaim, latency, and VRAM/model-loading notes.
- [ ] Confirm hard gates block accepted sensitive inference, score/rating, chain-of-thought, provider/debug leakage, unsupported filters, imported capture-context overclaim, raw artifact leakage, iOS provider/model keys/direct calls, Camera cloud entry, payload changes, capture-context upload, and `productionReady=true`.
- [ ] Confirm no app/backend runtime behavior, model server code, backend provider request payload, iOS upload payload, capture-context upload, iOS provider/model key/direct call, Camera cloud entry, generated artifact commit, real VLM/provider QA, training/fine-tuning, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 19-A

Open-weight VLM Backend Architecture ADR:

- [ ] Open `docs/open-weight-vlm-backend-architecture-adr.md`.
- [ ] Confirm the ADR is architecture / research only and does not approve implementation.
- [ ] Confirm candidate model comparison covers Qwen2.5-VL-7B, Qwen2-VL-7B, MiniCPM-V, and future watchlist candidates.
- [ ] Confirm serving comparison covers Ollama, vLLM, SGLang, and Transformers / FastAPI.
- [ ] Confirm target architecture requires explicit post-capture consent, backend metadata stripping, size/type limits, self-hosted VLM adapter, structured PhotoAdvisor JSON, backend validation, safe fallback, and existing app language-pack/result-card rendering.
- [ ] Confirm non-goals forbid production rollout, Camera live cloud AI, iOS provider keys, iOS direct model/provider calls, capture-context upload unless explicitly approved later, backend/iOS payload changes, raw image/prompt/model response logging, and user-photo training without explicit consent.
- [ ] Confirm future fine-tuning path is prompt/schema tuning first, evaluation dataset next, and LoRA/QLoRA later only with curated, consented, non-sensitive data.
- [ ] Confirm Phase 19-B recommendation is a local / ignored backend VLM sandbox or benchmark plan with no app integration unless explicitly approved.
- [ ] Confirm no app/backend runtime behavior, backend provider request payload, iOS upload payload, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated artifact commit, real-provider QA, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 18-C3

Multilingual Advisor copy beta QA pass:

- [ ] App launches normally.
- [ ] Captured photo opens local/mock Photo Advisor.
- [ ] Imported photo opens local/mock Photo Advisor.
- [ ] English Advisor copy is short, natural, mood-first, and not generic AI critique.
- [ ] Traditional Chinese copy is natural, concise, and not overly literal.
- [ ] Simplified Chinese copy is natural and uses appropriate local terms such as 拍摄信息 / 氛围 / 画面 where relevant.
- [ ] Cantonese-style copy feels natural for production UI but is not too slang-heavy or harsh.
- [ ] Imported-photo copy does not claim capture-time motion, tilt, exposure, stability, focus, lens, or camera conditions.
- [ ] Fallback/provider-unavailable copy is calm, short, and non-technical.
- [ ] Missing/unknown filter copy remains calm and does not show raw filter IDs or unusable actions.
- [ ] Filter reasons mention safe photo signal plus retro aesthetic result.
- [ ] Crop/straighten/refinement copy is optional, not corrective.
- [ ] Retake advice remains conservative, optional, and lower priority than mood/filter advice.
- [ ] UI does not show raw JSON, raw provider error, raw localization key, internal classification, numeric confidence, score/rating, sensitive inference, or identity-adjacent wording.
- [ ] No backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 18-C2

Captured / imported / fallback Advisor flow QA pass:

- [ ] App launches normally.
- [ ] Camera opens and captures normally.
- [ ] Captured photo opens local/mock Photo Advisor.
- [ ] Captured Advisor may use safe local capture/image context through localized mood/style wording only.
- [ ] Imported photo opens local/mock Photo Advisor.
- [ ] Imported Advisor does not claim capture-time motion, tilt, exposure, device stability, focus, lens, or camera conditions.
- [ ] Imported limited-context message is calm, short, and only mentions reading light, color, and framing.
- [ ] Provider-unavailable / fallback state is calm, short, and app-safe.
- [ ] Fallback copy does not show raw provider errors, raw JSON, debug internals, stack traces, endpoint names, or raw localization keys.
- [ ] Unknown/missing filter recommendation shows the unavailable note and no unusable apply action.
- [ ] Fallback filter recommendation stays inside the local filter catalog.
- [ ] Result card remains mood-first and does not show score/rating, numeric confidence, sensitive inference, harsh fix-it wording, or retake-first advice.
- [ ] No backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 18-C1

Post-capture Advisor result card beta polish:

- [ ] App launches normally.
- [ ] Camera opens and captures normally.
- [ ] Captured photo opens local/mock Photo Advisor.
- [ ] Imported photo opens local/mock Photo Advisor.
- [ ] Result card starts with a short mood/style headline.
- [ ] Result card shows one clear visual reason, not a long critique.
- [ ] Filter recommendation shows filter name plus one short reason.
- [ ] Long localized filter names/reasons wrap cleanly without clipping important text.
- [ ] Unknown/missing filter recommendation shows a calm unavailable note and no unusable apply action.
- [ ] Optional crop/straighten/refinement appears below the primary mood/filter advice.
- [ ] Crop/straighten advice is framed as optional, not as correction.
- [ ] Retake advice remains optional, conservative, and lower priority than crop/straighten/keep-style guidance.
- [ ] Imported photo does not claim capture-time motion, tilt, focus, lens, or exposure context.
- [ ] Fallback/provider-unavailable copy is calm and app-safe.
- [ ] UI does not show raw JSON, provider error, raw localization key, internal classification, score/rating, numeric confidence, chain-of-thought, banned copy, or identity-adjacent wording.
- [ ] No backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 18-C0

Post-capture Advisor beta hardening plan:

- [ ] Open `docs/photo-advisor-beta-hardening-plan.md`.
- [ ] Confirm the plan covers captured Photo Advisor flow, imported Photo Advisor flow, fallback/provider-unavailable UX, local/mock consistency, result-card readability, filter recommendation reason quality, CreativeIntentGuard behavior, crop/straighten/retake restraint, multilingual QA, manual real-device QA, and regression scripts.
- [ ] Confirm beta acceptance criteria require a short, mood-first, useful Advisor card.
- [ ] Confirm beta acceptance criteria forbid score/rating wording, sensitive inference, harsh fix-it language, and retake-first behavior.
- [ ] Confirm imported-photo criteria forbid overclaiming capture-time motion, tilt, focus, lens, or exposure context.
- [ ] Confirm fallback criteria require calm app-safe copy with no provider name, status code, raw error, raw JSON, or debug detail.
- [ ] Confirm the internal QA scenario matrix includes captured bright scene, captured low light, intentional blur/motion, intentional tilt, grainy retro look, high contrast, faded color, imported limited context, provider unavailable fallback, unknown/unsupported filter fallback, and missing localization key fallback.
- [ ] Run copy QA scripts when preparing a Phase 18-C implementation: `scripts/validate-photo-advisor-copy-regression.sh`, `scripts/validate-photo-advisor-filter-reasons.sh`, `scripts/validate-creative-intent-language.sh`, and `scripts/validate-photo-advisor-card-language.sh`.
- [ ] Run provider readiness checks only when relevant: `cd backend && npm run qa:photo-advisor`, `cd backend && npm run qa:photo-advisor:gate`, and `cd backend && npm run qa:photo-advisor:review`.
- [ ] Confirm real-provider QA is not required for C0 and is not run unless explicitly approved.
- [ ] Confirm no app/backend runtime behavior, backend provider request payload, iOS upload payload, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated artifact commit, or production rollout is introduced.
- [ ] Confirm `productionReady=false`.

## Phase 18-B7

Provider QA chain final audit and Phase 18-C readiness gate:

- [ ] Open `docs/photo-advisor-provider-qa-chain-readiness.md`.
- [ ] Confirm B0 provider language contract, B1 regression fixtures, B2 sanitized QA runner/reporting, B3 dry-run gate, B4 review thresholds, B5 QA gate helper, and B6 operator runbook are all listed.
- [ ] Run backend tests: `cd backend && npm test`.
- [ ] Run safe synthetic QA: `cd backend && npm run qa:photo-advisor`.
- [ ] Run dry-run gate: `cd backend && npm run qa:photo-advisor:gate`.
- [ ] Run gate helper: `cd backend && npm run qa:photo-advisor:review`.
- [ ] Confirm gate helper reports no hard blockers.
- [ ] Confirm any warnings are reviewed and documented before larger internal QA.
- [ ] Confirm real-provider QA is not required to start Phase 18-C.
- [ ] Confirm Phase 18-C readiness is limited to post-capture Advisor beta hardening / internal QA work.
- [ ] Confirm `productionReady=false`.
- [ ] Confirm no backend provider request payload change, iOS upload payload change, capture-context upload, iOS provider key/direct call, Camera cloud entry, generated report commit, real photo commit, or production rollout is introduced.

## Phase 18-B6

Provider QA operator runbook and pre-integration checklist:

- [ ] Open `docs/photo-advisor-provider-qa-operator-runbook.md`.
- [ ] Confirm pre-run safety checklist requires B0-B5 contract/gate readiness, ignored local credentials, ignored approved samples, ignored generated reports, and `productionReady=false`.
- [ ] Run safe synthetic QA first: `cd backend && npm run qa:photo-advisor`.
- [ ] Run the dry-run gate: `cd backend && npm run qa:photo-advisor:gate`.
- [ ] Run the gate summary helper: `cd backend && npm run qa:photo-advisor:review`.
- [ ] Confirm helper output has no `hardBlockers[]` before any debug/internal integration planning.
- [ ] Confirm warnings are reviewed and documented, not treated as production approval.
- [ ] Confirm optional real-provider QA is skipped unless explicitly approved for this run with ignored local credentials and approved ignored samples.
- [ ] If real-provider QA is skipped, report the reason honestly without inventing metrics.
- [ ] Confirm no raw image/base64, raw prompt, request payload, raw provider response, unsafe provider text, API key, Authorization header, GPS/raw EXIF, stack trace, real sample path, or generated report content appears in console or docs.
- [ ] Confirm no provider reports, real photos, local QA reports, screenshots, recordings, generated images, or device artifacts are staged/committed.
- [ ] Confirm the final pre-integration checklist blocks work unless synthetic QA passes, dry-run gate passes, gate helper has no hard blockers, warnings are reviewed, no artifact leakage exists, backend/iOS payloads are unchanged, no iOS provider key/direct call exists, no Camera cloud entry exists, capture context is not uploaded, and `productionReady=false`.
- [ ] Confirm Phase 18-B6 does not change app/backend runtime behavior, backend provider request payloads, iOS upload payloads, capture-context upload, iOS provider key/direct provider call, Camera cloud entry, or production rollout status.

## Phase 18-B5

Provider QA gate summary helper:

- [ ] Run safe synthetic QA first: `cd backend && npm run qa:photo-advisor`.
- [ ] Run the summary helper: `cd backend && npm run qa:photo-advisor:review`.
- [ ] Confirm helper output includes `productionReady: false`.
- [ ] Confirm helper output includes `eligibleForDebugInternalReview`.
- [ ] Confirm helper output includes `statusCategories`, `hardBlockers`, `warnings`, and `reviewedMetrics`.
- [ ] Confirm a healthy synthetic-contract report includes `pass_for_synthetic_contract`.
- [ ] Confirm helper output does not include raw provider text, raw prompts, raw image/base64, request payloads, API keys, Authorization headers, GPS/raw EXIF, unsafe provider text, or real sample paths.
- [ ] Confirm hard blockers stop review and warnings require manual review before expanding real-provider QA.
- [ ] Confirm helper does not mark production-ready.
- [ ] Confirm Phase 18-B5 does not change backend provider request payloads, iOS upload payloads, capture-context upload, iOS provider key/direct provider call, Camera cloud entry, or production rollout status.

## Phase 18-B4

Provider QA review thresholds:

- [ ] Open `docs/photo-advisor-provider-qa-review-thresholds.md`.
- [ ] Confirm the status categories include `pass_for_synthetic_contract`, `needs_review`, `blocked_for_safety`, `blocked_for_schema`, `blocked_for_filter_integrity`, `blocked_for_language_contract`, `blocked_for_artifact_leakage`, `blocked_for_provider_integration`, and `not_production_ready`.
- [ ] Confirm hard blockers include raw image/base64/prompt/provider response/request payload/secrets leakage, real photos or provider reports staged/committed, GPS/raw EXIF persistence, unsupported filter acceptance, sensitive inference, chain-of-thought/provider leakage, raw localization keys, raw filter-family IDs, iOS provider key/direct call, Camera cloud entry, unapproved payload changes, and `productionReady=true`.
- [ ] Confirm warning thresholds include invalid JSON/schema above 0, high fallback count, timeout/provider error above 0, overlong text above 0, repeated fallback by scenario group, high p95 latency, and locale mismatch.
- [ ] Confirm synthetic-contract QA acceptance requires no network/API key, invalid/unsafe fixtures falling back safely, redaction checks passing, and `productionReady=false`.
- [ ] Confirm optional real-provider QA requires explicit `--run-provider`, ignored local credentials, approved ignored samples, sanitized aggregate metrics only, ignored generated reports, and no production approval.
- [ ] Confirm Phase 18-B4 does not change backend provider request payloads, iOS upload payloads, capture-context upload, iOS provider key/direct provider call, Camera cloud entry, or production rollout status.

Automated local checks:

- [ ] `cd backend && npm run qa:photo-advisor` runs synthetic-contract QA only.
- [ ] `cd backend && npm run qa:photo-advisor:gate` prints sanitized dry-run gate status.
- [ ] `scripts/validate-photo-advisor-copy-regression.sh` passes.
- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

## Phase 18-B3

Internal real-provider QA dry-run gate:

- [ ] Open `docs/photo-advisor-provider-qa-dry-run-gate.md`.
- [ ] Confirm B3 says production rollout remains blocked and `productionReady` must remain `false`.
- [ ] Confirm the pre-run gate requires backend tests, synthetic-contract QA, ignored local credentials, ignored approved samples, ignored generated reports, and operator consent for approved real samples.
- [ ] Confirm real-provider QA requires explicit `--run-provider` and must fail closed without it.
- [ ] Confirm generated reports stay under ignored `backend/reports/provider-qa/`.
- [ ] Confirm approved real samples stay under ignored `backend/tests/approved-real-samples/`.
- [ ] Confirm no raw image/base64, prompt, request payload, provider response, unsafe provider text, API key, Authorization header, GPS/raw EXIF, or provider stack trace is logged or persisted.

Automated local checks:

- [ ] `cd backend && npm test` passes, or use the bundled Node fallback.
- [ ] `cd backend && npm run qa:photo-advisor` runs synthetic-contract QA only.
- [ ] `cd backend && npm run qa:photo-advisor:gate` prints sanitized gate status.
- [ ] `cd backend && node scripts/run-photo-advisor-provider-qa.mjs --image-set=synthetic` fails closed and sends no provider request.
- [ ] `scripts/validate-photo-advisor-copy-regression.sh` passes.
- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Real-provider QA, only when approved local credentials and approved ignored samples exist:

- [ ] Run `cd backend && npm run qa:photo-advisor:provider -- --image-set=approved-real`.
- [ ] Record sanitized aggregate metrics only.
- [ ] Do not paste raw provider output, raw prompts, raw request payloads, image names that identify private photos, or generated report contents.
- [ ] Confirm generated report remains ignored/untracked.
- [ ] Confirm `productionReady: false`.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` request payload shape remains unchanged.
- [ ] iOS Cloud AI request/upload payload remains unchanged.
- [ ] Capture context is not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] Camera remains local-only with no AI Snapshot / Quick Advice / Cloud AI entry.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, real photos, generated reports, screenshots, recordings, or production cloud rollout is enabled.

## Phase 18-B1

Provider contract regression and fallback parity check:

- [ ] Open `backend/tests/fixtures/provider-contract-regression-cases.json`.
- [ ] Confirm fixtures are synthetic JSON / text only and contain no photos, base64 images, provider reports, screenshots, local QA reports, EXIF, GPS, or secrets.
- [ ] Confirm valid fixtures cover low light / night grain, warm indoor light, cool quiet tone, soft focus, slight tilt / snapshot, high contrast / street, faded color, and imported limited-context scenarios.
- [ ] Confirm invalid fixtures cover invalid JSON, markdown prose, missing fields, unsupported filter IDs, overlong summary / filter reason text, score/rating wording, harsh fix-it / retake-first copy, sensitive inference, chain-of-thought, provider/debug leakage, raw stack-trace-style text, raw localization keys, and raw filter-family IDs in displayable text.
- [ ] Confirm provider failure fixtures cover provider unavailable and timeout / network fallback behavior.
- [ ] Confirm `docs/photo-advisor-provider-language-contract.md` includes the Phase 18-B1 fixture matrix and fallback parity requirements.

Automated local checks:

- [ ] `cd backend && npm test` passes, or use the bundled Node fallback: `/Users/a1234/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node --test tests/*.test.mjs`.
- [ ] `scripts/validate-photo-advisor-copy-regression.sh` passes.
- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` request payload shape remains unchanged.
- [ ] iOS Cloud AI request/upload payload remains unchanged.
- [ ] Capture context is not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] Camera remains local-only with no AI Snapshot / Quick Advice / Cloud AI entry.
- [ ] Production UI does not show raw provider errors, raw JSON, provider names, chain-of-thought, raw localization keys, score/rating, internal classification names, raw EXIF, or raw sensor values.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, generated reports, real photos, or production cloud rollout is enabled.

## Phase 18-B0

Provider language contract alignment check:

- [ ] Open `docs/photo-advisor-provider-language-contract.md`.
- [ ] Confirm the provider contract follows Observation -> Mood -> Retro intent -> Optional action.
- [ ] Confirm the contract explicitly forbids Score -> Problem -> Fix -> Retake.
- [ ] Confirm schema alignment maps `summary`, `suggestions`, `recommendedFilters`, `cropAdvice`, `retakeAdvice`, `safety`, and `error` to the app result-card needs.
- [ ] Confirm missing future fields such as `moodHeadline`, `visualObservations`, `creativeIntentNotes`, and `straightenAdvice` are documented as future-only and not implemented in the payload.
- [ ] Confirm provider output must use whitelisted filter IDs and short filter reasons with safe photo signal + retro aesthetic result.
- [ ] Confirm fallback copy remains calm and does not expose raw provider errors, raw JSON, provider endpoints, prompts, stack traces, or provider names in production UI.
- [ ] Confirm provider QA fixture planning uses synthetic descriptions or ignored local images only.

Automated local checks:

- [ ] `cd backend && npm test` passes.
- [ ] `scripts/validate-photo-advisor-copy-regression.sh` passes.
- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` request payload shape remains unchanged.
- [ ] iOS Cloud AI request/upload payload remains unchanged.
- [ ] Capture context is not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] Camera remains local-only with no AI Snapshot / Quick Advice / Cloud AI entry.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A5

Multilingual Photo Advisor copy regression check:

- [ ] Open `docs/photo-advisor-copy-regression-matrix.md`.
- [ ] Review 3-5 captured scenarios and 2-3 imported/fallback scenarios from the matrix.
- [ ] Confirm English copy is short, natural, practical, and not generic AI.
- [ ] Confirm Traditional Chinese copy sounds natural and not overly literal.
- [ ] Confirm Cantonese-style copy uses natural safe phrasing such as “幾有…感”, “可以試…”, and “唔一定要重拍”.
- [ ] Confirm Simplified Chinese copy is natural where supported and uses 胶片 / 氛围 / 画面 naturally.
- [ ] Confirm imported photo copy does not claim capture-time motion / tilt / focus / lens / exposure context.
- [ ] Confirm blur, motion, low light, tilt, grain, soft focus, overexposure, underexposure, high contrast, faded color, and unusual framing remain possible retro style unless severe unreadability is likely.
- [ ] Confirm filter reasons include a safe photo signal plus retro aesthetic result.
- [ ] Confirm retake advice remains hidden unless useful and is always optional / conservative.
- [ ] Confirm fallback copy is calm and does not show raw provider errors, raw JSON, raw localization keys, provider names, debug fields, or internal classification names.
- [ ] Confirm no real photos, screenshots, simulator recordings, generated reports, provider reports, or device-specific artifacts are committed.

Automated local checks:

- [ ] `scripts/validate-photo-advisor-copy-regression.sh` passes.
- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` payloads remain unchanged.
- [ ] Capture context and QA metadata are not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A4

Photo Advisor result card language model check:

- [ ] Launch the app and confirm Camera opens normally.
- [ ] Confirm Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture or import a photo and open mock/local Photo Advisor.
- [ ] Confirm the result card starts with a short mood / style headline where available.
- [ ] Confirm the card shows one short visual reason, not a long generic AI critique.
- [ ] Confirm the filter recommendation shows filter name + one short reason.
- [ ] Confirm the filter reason mentions a safe photo signal and retro aesthetic result.
- [ ] Confirm optional crop / straighten / refinement wording is not framed as a correction.
- [ ] Confirm retake advice appears only as optional and conservative.
- [ ] Confirm imported photos do not pretend to know capture-time motion / tilt / exposure context.
- [ ] Confirm fallback copy is calm and app-safe.
- [ ] Confirm UI does not show provider/source labels, score / rating, numeric confidence, raw sensor streams, raw EXIF, raw JSON, provider errors, raw localization keys, internal classification names, chain-of-thought, banned copy, or identity-adjacent wording.

Automated local checks:

- [ ] `scripts/validate-photo-advisor-card-language.sh` passes.
- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` payloads remain unchanged.
- [ ] Capture context and result-card display metadata are not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A3

CreativeIntentGuard language / retake restraint check:

- [ ] Launch the app and confirm Camera opens normally.
- [ ] Confirm Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture or import a photo and open mock/local Photo Advisor.
- [ ] Confirm blur / softness is treated as dreamy or retro texture unless severe detail loss is likely.
- [ ] Confirm motion is treated as candid film / street snapshot energy unless the frame is unreadable.
- [ ] Confirm tilt is treated as snapshot / street energy and straighten advice is optional only.
- [ ] Confirm low light, underexposure, overexposure, grain, high contrast, faded color, and unusual framing are described as possible retro style.
- [ ] Confirm non-severe blur / tilt / low light / grain / high contrast / faded color does not produce retake-first advice.
- [ ] Confirm retake copy, if shown, is optional and says to keep the current mood first.
- [ ] Confirm filter reasons remain style-preserving and mention photo signal + retro aesthetic result.
- [ ] Select English, 繁體中文, 简体中文, 廣東話 / 香港口語, and 廣東話 / 麻煩友 where practical, then confirm no raw `advisor.intent.signal.*` localization keys appear.
- [ ] Confirm UI does not show score / rating, numeric confidence, raw JSON, raw provider output, chain-of-thought, raw sensor streams, raw EXIF, provider keys, direct provider URLs, or identity-adjacent wording.

Automated local checks:

- [ ] `scripts/validate-creative-intent-language.sh` passes.
- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` payloads remain unchanged.
- [ ] Capture context, creative-intent classifications, and filter reason metadata are not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A2

Photo Advisor filter reason library check:

- [ ] Launch the app and confirm Camera opens normally.
- [ ] Confirm Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture or import a photo and open mock/local Photo Advisor.
- [ ] Confirm filter recommendations show a filter name plus one short reason.
- [ ] Confirm filter reasons mention a photo signal and retro aesthetic result, not only “try this filter.”
- [ ] Check low light, warm light, high contrast, faded color, soft / dreamy, and street / busy scenes where practical.
- [ ] Confirm low light, blur, grain, tilt, faded color, and high contrast are not described as automatic mistakes.
- [ ] Confirm retake advice remains optional / conservative and does not become the default.
- [ ] Select English, 繁體中文, 简体中文, 廣東話 / 香港口語, and 廣東話 / 麻煩友 where practical, then confirm no raw `advisor.filter.*` localization keys appear.
- [ ] Confirm UI does not show score / rating, numeric confidence, raw JSON, raw provider output, chain-of-thought, raw sensor streams, raw EXIF, provider keys, direct provider URLs, or identity-adjacent wording.

Automated local check:

- [ ] `scripts/validate-photo-advisor-filter-reasons.sh` passes.
- [ ] `rg -n "Try this filter|Best filter|best filter|bad photo|wrong exposure|failed photo|must fix|retake it|retake required|7/10|8/10|score|rating" ios-app/AIPhotoApp/Features/AIPhotoAdvisor ios-app/AIPhotoApp/Resources/Localization` should not find production UI copy.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` payloads remain unchanged.
- [ ] Capture context and filter reason metadata are not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A1

Photo Advisor language pack check:

- [ ] Launch the app and confirm Camera opens normally.
- [ ] Confirm Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture or import a photo and open mock/local Photo Advisor.
- [ ] Confirm Photo Advisor language starts with mood / style where appropriate.
- [ ] Confirm blur, tilt, low light, grain, high contrast, faded color, soft focus, motion, and unusual framing are treated as possible retro style.
- [ ] Confirm technical advice uses optional wording such as “if you want...” / “如果你想...”.
- [ ] Confirm retake advice appears only as optional / conservative wording, not a default instruction.
- [ ] Confirm filter recommendations include a short photographic reason, not only “try this filter.”
- [ ] Select English, 繁體中文, 简体中文, 廣東話 / 香港口語, and 廣東話 / 麻煩友 where practical, then confirm no raw `advisor.*` localization keys appear.
- [ ] Confirm imported photos say capture context is limited and only light / color / framing are being read.
- [ ] Confirm unavailable / cloud fallback copy is short, safe, and does not expose raw provider errors.
- [ ] Confirm UI does not show score / rating, numeric confidence, raw JSON, raw provider output, chain-of-thought, raw sensor streams, raw EXIF, provider keys, or direct provider URLs.
- [ ] Confirm no banned or sensitive wording appears: face / skin / age / gender / attractiveness / beauty / emotion / health / identity / ethnicity / religion / disability / body judgment.

Manual grep checks:

- [ ] `rg -n "advisor\\." ios-app/AIPhotoApp/Resources/Localization` confirms the new language pack keys exist in supported locale files.
- [ ] `rg -n "7/10|8/10|score|rating|bad photo|wrong exposure|failed photo|must fix|retake it|retake required|chain-of-thought" ios-app/AIPhotoApp/Features/AIPhotoAdvisor ios-app/AIPhotoApp/Resources/Localization` should not find production UI copy.
- [ ] `rg -n "face recognition|skin quality|beauty|attractive|gender|emotion|health|race|ethnicity|religion|disability|body shaming" ios-app/AIPhotoApp/Features/AIPhotoAdvisor ios-app/AIPhotoApp/Resources/Localization` should not find production UI copy.

Boundary check:

- [ ] Backend `/v1/ai/photo-advisor` payloads remain unchanged.
- [ ] Capture context is not uploaded.
- [ ] iOS still has no provider key, provider SDK import, or direct provider URL call.
- [ ] No GPS/location collection, raw EXIF dump, raw sensor persistence, StoreKit, Gemini Live, WebSocket, export, or production cloud rollout is enabled.

## Phase 18-A0

Documentation / language audit check:

- [ ] Open `docs/ai-photo-advisor-language-audit.md`.
- [ ] Confirm the capability coverage table marks implemented / partial / missing / unclear areas.
- [ ] Review current app language categories: mood, composition, lighting, filter fit, retake / refinement, creative intent, fallback / unavailable.
- [ ] Confirm gaps include generic AI wording, weak filter reasons, missing imported-photo-specific copy, Cantonese / Simplified review needs, and production-facing mock label cleanup.
- [ ] Confirm recommended app voice is warm, practical, retro-camera-aware, non-judgmental, not a score system, and not generic AI.
- [ ] Confirm the future real AI language contract says capture context is non-sensitive technical metadata and must not be used for identity, face, emotion, beauty, health, age, gender, or protected-attribute inference.
- [ ] Confirm Phase 18-A0 makes no app behavior, backend payload, provider, Camera cloud, GPS/location, raw EXIF, or sensor persistence changes.

## Phase 17D-D

Real-device QA kit:

- [ ] Copy `tests/manual/capture-intelligence-real-device-qa-template.md` into ignored `tests/manual/local-results/` before filling in device results.
- [ ] Confirm no filled report, real test photo, generated QA image, `.xcresult`, or device-specific artifact is staged for commit.

Camera lifecycle:

- [ ] Launch app and open Camera.
- [ ] Switch away from Camera tab, return to Camera, and confirm capture still works.
- [ ] Background app from Camera, foreground app, and confirm Camera resumes safely.
- [ ] Deny / revoke Camera permission if practical and confirm the app does not crash or show stale capture context.
- [ ] Confirm motion monitoring stops / clears safely when Camera is not active.

Capture scenarios:

- [ ] Hold device level and capture.
- [ ] Slightly tilt device and capture.
- [ ] Strongly tilt device and capture.
- [ ] Hold device still and capture.
- [ ] Move device slightly before capture.
- [ ] Capture in low light.
- [ ] Capture in bright light.
- [ ] Capture a high-contrast scene.
- [ ] Capture a low-saturation / faded-looking scene.
- [ ] Capture with soft / dreamy / retro filter selected.
- [ ] Capture with no filter or neutral filter selected.

Advisor behavior:

- [ ] Captured Photo Advisor opens normally.
- [ ] Imported Photo Advisor opens normally.
- [ ] Advice starts with mood / style where possible.
- [ ] Advice remains optional and intent-aware.
- [ ] Advice does not default to retake / fix-it for blur, tilt, low light, grain, underexposure, overexposure, unusual framing, or motion.
- [ ] Technical refinement uses wording such as “if you want...” / “如果你想...”.
- [ ] No identity-adjacent or sensitive wording appears.
- [ ] No wording like bad / wrong / failed / poor / retake required appears.

DEBUG preview:

- [ ] DEBUG capture context preview appears only in DEBUG builds.
- [ ] Release / production UI does not show the DEBUG capture context preview.
- [ ] Preview shows bucket labels only: Level, Motion, Light, Blur hint, Creative intent.
- [ ] Preview does not expose raw accelerometer values, raw gyro values, raw roll / pitch, raw stability score, raw EXIF, raw JSON, provider errors, localization keys, secrets, or API keys.

Safety / boundary:

- [ ] Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] No GPS/location collection is visible.
- [ ] No raw EXIF dump is visible.
- [ ] No continuous sensor stream persistence or logging is visible.
- [ ] No capture context or local image signal upload is visible.
- [ ] Backend provider payload remains unchanged.
- [ ] No provider key / direct provider call was added to iOS.
- [ ] No production remote AI rollout is enabled.

Known TODOs:

- [ ] Real-device QA results should remain local unless a future safe-asset policy explicitly approves sanitized commits.
- [ ] Future threshold changes should be based on repeated real-device observations, not a single photo.
- [ ] Future backend schema support for capture context requires a separate explicit phase.

## Phase 17D-C

Check:

- [ ] App launches normally.
- [ ] Camera opens and captures normally.
- [ ] Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture a photo and confirm the mock/local Photo Advisor opens normally.
- [ ] Import a photo and confirm the mock/local Photo Advisor opens normally.
- [ ] Hold the device level, capture, and confirm DEBUG preview / advice remains bucketed and optional.
- [ ] Tilt the device slightly, capture, and confirm tilt is treated as optional refinement, not a fix-it failure.
- [ ] Move the device slightly before capture and confirm motion / blur advice remains optional and does not default to retake.
- [ ] Capture in low light or with a warm / retro filter and confirm advice preserves mood before offering a cleaner alternative.
- [ ] Import a photo and confirm imported source behavior does not invent capture-only level / motion claims.
- [ ] Background the app from Camera, return to foreground, and confirm Camera resumes safely without stale motion context.
- [ ] Switch tabs away from Camera and return; confirm motion monitoring does not leak state or leave stale capture context running.
- [ ] Deny camera permission in a fresh install / simulator reset if feasible and confirm no motion context crash occurs.
- [ ] In DEBUG builds, confirm capture context preview shows only bucket labels: Level, Motion, Light, Blur hint, Creative intent.
- [ ] Confirm release / production UI does not show the DEBUG capture context preview.
- [ ] Confirm UI does not show raw roll / pitch, raw stability score, raw sensor streams, raw EXIF, raw JSON, provider errors, raw localization keys, image payloads, banned copy, or identity-adjacent wording.
- [ ] Confirm no GPS/location, raw EXIF dump, continuous sensor logging, continuous sensor persistence, raw photo persistence, or backend capture-context upload is visible in behavior.
- [ ] Confirm no provider key / direct provider call was added to iOS.
- [ ] Confirm no production remote AI rollout is enabled.

Known TODOs:

- [ ] Physical-device QA should verify CoreMotion availability and level / motion bucket reasonableness.
- [ ] Phase 17D-C keeps backend provider payloads unchanged and does not upload capture context.
- [ ] Future backend schema support for capture context requires a separate explicit phase.

## Phase 17D-B

Check:

- [ ] App launches normally.
- [ ] Camera still opens and captures photos normally.
- [ ] Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture a photo and confirm the mock/local Photo Advisor opens normally.
- [ ] Import a photo and confirm the mock/local Photo Advisor opens normally.
- [ ] Confirm capture / import still uses mock/local Photo Advisor unless DEBUG remote mode is explicitly enabled.
- [ ] Confirm blur, tilt, low light, grain, high contrast, faded color, soft focus, motion, and unusual framing are treated as possible creative style rather than automatic mistakes.
- [ ] Confirm advice uses optional wording such as “if you want...” / “如果你想...” and does not default to retake / fix-it advice.
- [ ] Confirm retake advice remains conservative and optional.
- [ ] In DEBUG builds, confirm the capture context preview is compact and shows only buckets such as Level, Motion, Light, Blur hint, and Creative intent.
- [ ] Confirm DEBUG capture context preview does not show raw roll / pitch values, raw motion streams, raw EXIF, raw JSON, provider errors, raw localization keys, or image payloads.
- [ ] Confirm release / production UI does not show the DEBUG capture context preview.
- [ ] Confirm no GPS/location, raw EXIF dump, continuous sensor logging, continuous sensor persistence, raw photo persistence, or backend capture-context upload is visible in behavior.
- [ ] Confirm no provider key / direct provider call was added to iOS.
- [ ] Confirm no production remote AI rollout is enabled.

Known TODOs:

- [ ] Phase 17D-B keeps backend provider payloads unchanged and does not upload capture context.
- [ ] Physical-device QA should verify level / motion bucket behavior because simulator device-motion data may be unavailable.
- [ ] Future backend schema support for capture context requires a separate explicit phase.

## Phase 17D-A

Check:

- [ ] App launches normally.
- [ ] Camera still opens and captures photos normally.
- [ ] Camera remains local-only and no AI Snapshot / Quick Advice / Cloud AI entry appears.
- [ ] Capture a photo and open the mock/local Photo Advisor.
- [ ] Import a photo and open the mock/local Photo Advisor.
- [ ] Confirm imported photos still work with unavailable / unknown capture context.
- [ ] Confirm local/mock Photo Advisor does not default to retake for blur, tilt, low light, grain, motion, or unusual framing.
- [ ] Confirm advice uses optional wording such as “if you want...” / “如果你想...”.
- [ ] Confirm Photo Advisor suggestions preserve possible retro intent before offering technical refinement.
- [ ] Confirm UI does not show raw sensor values, raw EXIF, raw JSON, provider errors, raw localization keys, banned copy, or identity-adjacent wording.
- [ ] Confirm DEBUG-only cloud path, if used, still asks consent first and remains separate from local capture context.
- [ ] Confirm no GPS/location, raw EXIF dump, continuous sensor logging, or raw photo persistence is visible in behavior.
- [ ] Confirm no production remote AI rollout is enabled.

Known TODOs:

- [ ] Phase 17D-A does not upload capture context to backend.
- [ ] Future backend schema support for capture context requires a separate explicit phase.
- [ ] Future real motion / level sensor sampling must remain summarized, local-only, and non-persistent unless separately approved.
- [ ] Physical-device validation should check that capture still works and local advice stays intent-aware.

## Phase 17C

Check:

- [ ] Normal app launch still uses mock/local Photo Advisor.
- [ ] Camera remains local-only and no Camera AI Snapshot / Quick Advice cloud entry returns.
- [ ] Inspiration AI Hub still works.
- [ ] Debug/internal real provider test shows consent first.
- [ ] Cancel consent stops the request and does not crash.
- [ ] Missing backend server returns safe local/mock fallback.
- [ ] Missing backend secret returns safe fallback.
- [ ] With `ALLOW_INTERNAL_CLOUD_AI=true`, `CLOUD_AI_PROVIDER_MODE=qweInternal`, backend `QWE_API_KEY`, `QWE_BASE_URL=https://qweapi.com`, `QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview`, and internal debug header, the backend can return a structured Photo Advisor result.
- [ ] Run `backend/scripts/probe-qwe-endpoint.mjs` before image smoke testing; it should call `https://qweapi.com/v1/chat/completions`.
- [ ] Confirm text-only QweAPI probe succeeds before testing image analysis.
- [ ] Confirm image Photo Advisor smoke returns a validated `source=cloud` response when internal QweAPI config is enabled and backend is running.
- [ ] Run safe synthetic provider QA with `cd backend && npm run qa:photo-advisor`.
- [ ] Run the dry-run gate with `cd backend && npm run qa:photo-advisor:gate` before any real-provider QA.
- [ ] Run real-provider QA only with explicit opt-in, for example `cd backend && npm run qa:photo-advisor:provider -- --image-set=approved-real`.
- [ ] Confirm provider QA report is written to ignored `backend/reports/provider-qa/photo-advisor-qa-report.json`.
- [ ] Confirm provider QA report contains no API key, base64 image, raw image, request body, provider raw response, EXIF, GPS, or face data.
- [ ] Review provider QA summary: cloud success, fallback count, average / p50 / p95 latency, schema failures, safety failures, invalid filter IDs.
- [ ] Run synthetic provider contract QA without credentials: `cd backend && node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract`.
- [ ] Confirm synthetic provider contract QA uses committed fixtures only, reports `runMode=synthetic`, `providerConfigured=false`, and `productionReady=false`.
- [ ] Confirm the synthetic report includes invalid JSON, invalid schema, unsupported filter, overlong text, unsafe response, timeout, provider error, fallback, and latency counters.
- [ ] Confirm provider-mode QA refuses to run when `CLOUD_AI_PROVIDER_MODE=qweInternal`, `ALLOW_INTERNAL_CLOUD_AI=true`, and `QWE_API_KEY` / base URL / model are not configured.
- [ ] Confirm real-provider QA console output shows only sanitized case IDs, categories, aggregate metrics, and latency values.
- [ ] Confirm no raw prompt, full request payload, raw provider response, unsafe provider text, Authorization header, API key, GPS, raw EXIF, face descriptors, or identity/sensitive inference details appear in console output or ignored report artifacts.
- [ ] Confirm R3 local QA image set stays ignored under `backend/tests/local-images/`.
- [ ] Confirm R3 report includes `maxLatencyMs` and `fallbackByCode`.
- [ ] Confirm R4 report includes `p90LatencyMs`, `timeoutCount`, `unsafeResponseCount`, `fallbackByCategory`, per-case `latencyBucket`, per-case `fallbackCategory`, and `latencyAssessment`.
- [ ] Confirm R5 report includes `unsafeByCategory`, per-case `unsafeCategory`, and per-case `sampleType`.
- [ ] Confirm `latencyAssessment.productionRollout` remains blocked when p95 / max latency or fallback risk is high.
- [ ] Confirm fallback reasons are reviewed, especially `unsafe_response` and `provider_timeout`.
- [ ] Confirm fallback classifications distinguish provider timeout, unsafe response, invalid JSON, invalid schema, invalid filter ID, provider / network error, and unknown error where applicable.
- [ ] Run real-provider synthetic image QA only after the dry-run gate, with explicit opt-in: `backend/scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=synthetic`.
- [ ] Run approved real sample QA only when approved local images exist under ignored `backend/tests/approved-real-samples/`.
- [ ] Confirm approved real samples remain ignored / untracked and use non-personal filenames.
- [ ] Manually review 3-5 real approved local QA image results when available.
- [ ] Use `backend/tests/local-images/manual-review-template.json` to record sample type, fixture name, locale, provider status, fallback code, unsafe diagnostic label, latency bucket, language naturalness, filter recommendation fit, crop / framing usefulness, safety concern, reviewer ID, and notes.
- [ ] Manually check language quality for English, Traditional Chinese, Simplified Chinese, and Cantonese.
- [ ] Check captions are short and not weird.
- [ ] Check filter recommendations are valid and reasonable.
- [ ] Check no sensitive inference, face recognition, identity inference, or appearance/body/identity attack appears.
- [ ] Probe script prints sanitized status / latency only and does not print API key, request body, base64 image, or provider raw response.
- [ ] No QweAPI API key or QweAPI base URL appears in iOS source.
- [ ] Result language follows Settings where supported.
- [ ] Provider invalid JSON / invalid schema fixtures fall back after retry.
- [ ] Unsafe provider output fixture falls back without showing unsafe text.
- [ ] Invalid provider filter ID is rejected or falls back.
- [ ] No raw image / base64 image / request body appears in backend logs.
- [ ] No provider raw error / raw response is shown to the user.
- [ ] No provider key exists in iOS or repo.
- [ ] No `屌` or banned appearance / body / identity copy appears.
- [ ] No raw localization keys appear.

Known TODOs:

- [ ] Phase 17C is internal/debug only, not production rollout.
- [ ] QweAPI `gemini-3.1-flash-image-preview` image_url smoke now returns a validated cloud response; production rollout still requires explicit approval, QA, and cost/safety guard review.
- [ ] Phase 17C-R2 QA batch currently uses built-in tiny JPEG smoke cases unless approved local images are placed in ignored `backend/tests/local-images/`.
- [ ] R2 initial QA p95 latency was high; review latency with real approved sample images before any production rollout.
- [ ] R3 synthetic QA pass showed p95 / max latency and unsafe fallbacks remain production rollout blockers.
- [ ] R4 hardens latency / fallback reporting and manual review readiness, but production rollout remains blocked.
- [ ] R5 reduces unsafe-response fallback risk and adds approved-real-sample QA workflow, but production rollout remains blocked.
- [ ] Next safe step is provider latency / QA tuning, not Camera cloud AI, Gemini Live, Filter Generator real backend, 改圖師, StoreKit, or production cloud AI.

## Phase 17C-Prep

Check:

- [ ] Normal app launch still uses mock/local Photo Advisor.
- [ ] Debug remote path still works with the backend mock endpoint.
- [ ] Backend valid request returns a structured mock `CloudAIResponse`.
- [ ] Backend invalid request returns a structured fallback / unavailable response.
- [ ] Backend missing consent fixture is rejected.
- [ ] Backend invalid schema fixture is rejected.
- [ ] Backend oversized image fixture is rejected.
- [ ] Backend invalid filter ID is rejected or blocked before provider output reaches iOS.
- [ ] Backend unsafe output fixture is rejected and maps to safe fallback.
- [ ] Backend too-many-suggestions fixture is rejected.
- [ ] Provider registry exposes mock / disabled only.
- [ ] No provider key exists in app or backend.
- [ ] No real provider package exists.
- [ ] Backend logs do not contain raw image, base64 image, full request payload, EXIF / GPS, face data, or provider raw response.
- [ ] Camera remains local-only and no Camera AI Snapshot / Quick Advice cloud entry returns.
- [ ] Inspiration AI Hub still works.
- [ ] No raw localization keys appear.
- [ ] No explicit profanity / unsafe appearance / body / identity copy appears.

Known TODOs:

- [ ] Phase 17C-Prep does not connect a real provider.
- [ ] Phase 17C-Prep does not enable production remote Cloud AI.
- [ ] Future real provider integration requires explicit approval, secret management, provider policy review, cost guard, moderation / safety, timeout, and validation readiness.

## Phase 17B

Check:

- [ ] Normal app launch still uses mock/local Photo Advisor.
- [ ] Camera remains local-only and no Camera AI Snapshot / Quick Advice cloud entry returns.
- [ ] Inspiration AI Hub still works.
- [ ] In release/default mode, no remote cloud call occurs.
- [ ] In DEBUG/internal path, open an imported / selected photo Photo Advisor.
- [ ] Tap `Debug: Test Cloud Boundary` if available.
- [ ] Consent appears before the remote debug request.
- [ ] Cancel consent returns safely and does not call backend.
- [ ] If backend is not running, fallback appears and the app does not crash.
- [ ] If backend is running, structured mock result appears in the existing Photo Advisor UI.
- [ ] Recommended filter apply still works.
- [ ] No provider key exists in app or backend.
- [ ] No raw image / base64 image / request payload is logged.
- [ ] No raw localization keys appear.
- [ ] No offensive / explicit profanity copy appears.

Known TODOs:

- [ ] Phase 17B does not connect a real provider.
- [ ] Phase 17B does not enable production remote Cloud AI.
- [ ] Future Phase 17C may add real provider integration only after explicit approval and safety / cost / secrets review.

## Phase 17A

Check:

- [ ] App still launches.
- [ ] Camera remains local-only and no Camera AI Snapshot / Quick Advice cloud entry returns.
- [ ] Inspiration AI Hub still works.
- [ ] Imported / selected photo Photo Advisor still uses mock/local result by default.
- [ ] Existing Photo Advisor language / tone behavior still works.
- [ ] Consent view copy exists in the reusable Cloud AI boundary component if reached through an internal path.
- [ ] Normal production UI does not trigger a real remote AI call.
- [ ] No provider API key exists in the iOS app or new backend skeleton.
- [ ] Backend `GET /health` returns mock-only service status.
- [ ] Backend `POST /v1/ai/photo-advisor` returns a structured mock response for a valid consented request.
- [ ] Backend rejects missing consent.
- [ ] Backend rejects unsupported schema versions.
- [ ] Backend does not require a provider key.
- [ ] Backend does not log raw image, base64 image, request payload, EXIF / GPS, face data, or provider raw response.
- [ ] No raw localization keys appear.
- [ ] No offensive / explicit profanity copy appears.

Known TODOs:

- [ ] Phase 17A does not connect a real provider.
- [ ] Phase 17A does not enable production remote Cloud AI from iOS.
- [ ] Future Phase 17B may wire remote service behind an internal debug flag only after explicit approval.
- [ ] Future Phase 17C may add real provider integration only after provider policy, secret management, timeout, validation, moderation, and cost guard work is explicitly approved.

## Phase 00

Check:

- [x] README.md exists.
- [x] AGENTS.md exists.
- [x] docs/ folder exists.
- [x] docs/phase-log.md exists.
- [x] docs/prompts/ folder exists.
- [x] ios-app/ placeholder exists.
- [x] functions/ placeholder exists.
- [x] firebase/ placeholder exists.
- [x] scripts/ placeholder exists.
- [x] .gitignore exists.
- [x] .env.example exists.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

## Phase 01

Check:

- [x] `docs/prompts/phase-01-design-navigation.md` is expanded into a full construction prompt.
- [x] `ios-app/AIPhotoApp/` source scaffold exists.
- [x] SwiftUI app entry exists.
- [x] Root navigation shell exists.
- [x] Home / History / Settings placeholder views exist.
- [x] Design system token files exist.
- [x] Reusable UI components exist.
- [x] Placeholder UI models exist.
- [x] English localization file exists.
- [x] Traditional Chinese localization file exists.
- [x] No Auth implementation was added.
- [x] No Camera implementation was added.
- [x] No Firebase upload implementation was added.
- [x] No AI implementation was added.
- [x] No StoreKit implementation was added.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [x] Create or open an iOS SwiftUI Xcode target.
- [x] Add files under `ios-app/AIPhotoApp/` to the target.
- [x] Add the localization files to the target.
- [x] Build the target.
- [x] Preview or run `AppRootView`.
- [x] Confirm the intro placeholder can enter the Home / History / Settings tab shell.
- [ ] Confirm dark and light mode are readable.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.

## Phase 02

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo during Phase 02 setup.
- [x] Added Auth UI scaffold under `ios-app/AIPhotoApp/Features/Auth/`.
- [x] Added mockable Auth service protocol under `ios-app/AIPhotoApp/Services/Auth/`.
- [x] Added `MockAuthService` for local email/password, Google, Apple, guest, and sign-out state.
- [x] Added `FirebaseAuthService` placeholder without importing Firebase SDKs.
- [x] Added visible Google and Apple sign-in rows together.
- [x] Added guest/try-mode copy and local mock flow.
- [x] Added Settings sign-out and account deletion placeholders.
- [x] Added Phase 02 Auth setup TODO notes.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase Storage upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual source review without Mac:

- [ ] Open `ios-app/AIPhotoApp/Features/Auth/AuthView.swift` and confirm email/password, Google, Apple, and guest options are present.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/AuthService.swift` and confirm UI depends on a protocol.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift` and confirm mock sign-in/sign-out state is local only.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift` and confirm it has TODOs but no Firebase imports.
- [ ] Confirm `GoogleService-Info.plist`, `.env`, `.firebaserc`, production plist files, private keys, OAuth secrets, Firebase project IDs, and API keys were not added.
- [ ] Confirm source files do not import AVFoundation, PhotosUI, Firebase Storage, AI SDKs, or StoreKit for Phase 02.

Manual Xcode check on macOS later:

- [x] Follow `ios-app/XCODE_SETUP.md` and create or open a verified `.xcodeproj`.
- [x] Add all Phase 02 Auth Swift files to the app target.
- [x] Build the target.
- [x] Preview `AuthView`.
- [x] Run the app and confirm intro can continue to Auth.
- [ ] Test mock email/password sign-in with a valid email and at least 6 password characters.
- [ ] Test invalid email and short password error states.
- [ ] Test mock Google sign-in row.
- [ ] Test mock Apple sign-in row.
- [ ] Test guest try mode.
- [ ] Test Settings mock sign-out returns to Auth.
- [ ] Confirm account deletion entry is visible but does not claim backend deletion is complete.

## Phase 01.5

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo.
- [x] Confirmed the current environment cannot reliably verify an Xcode project.
- [x] Added `ios-app/XCODE_SETUP.md` instead of generating an unverified `.xcodeproj`.
- [x] Documented how to create `ios-app/AIPhotoApp.xcodeproj` on macOS.
- [x] Documented how to add existing `ios-app/AIPhotoApp/` Swift files to the app target.
- [x] Documented how to add `en.lproj` and `zh-Hant.lproj` localization files to target resources.
- [x] Confirmed no Auth implementation was added.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [x] Follow `ios-app/XCODE_SETUP.md`.
- [x] Create or open `ios-app/AIPhotoApp.xcodeproj`.
- [x] Confirm all Swift files under `ios-app/AIPhotoApp/` are in the app target.
- [x] Confirm `ios-app/AIPhotoApp/AIPhotoApp.swift` is the only `@main` entry.
- [x] Confirm localization resources are copied into the app bundle.
- [x] Build the target.
- [ ] Preview `AppRootView`.
- [ ] Preview `MainTabShellView`.
- [ ] Run the app in an iOS Simulator.
- [ ] Confirm Home / History / Settings render.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.

## Phase 03

Check:

- [x] `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Camera scaffold exists under `ios-app/AIPhotoApp/Features/Camera/`.
- [x] Home has an entry into the Camera / Photo Picker scaffold.
- [x] Camera permission states are represented.
- [x] AVFoundation camera preview/capture scaffold exists.
- [x] PhotosPicker single-image import scaffold exists.
- [x] Captured/imported image preview is local-only and in memory.
- [x] Added camera and photo-library usage description placeholders to Xcode build settings.
- [x] No filters or Core Image presets were implemented.
- [x] No Firebase Storage upload was implemented.
- [x] No Firestore metadata persistence was implemented.
- [x] No AI analysis or Cloud Functions AI proxy was implemented.
- [x] No StoreKit, subscription, paywall, quota enforcement, or history persistence was implemented.
- [x] No real secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] Command-line Xcode simulator build succeeded.

Manual Xcode check on simulator:

- [x] User manually checked Phase 03 in Xcode.
- [x] User confirmed build / basic UI flow looked acceptable.
- [x] User reported no obvious major bugs.
- [ ] Build and run `AIPhotoApp` in an iOS Simulator for a full recorded smoke pass.
- [ ] Sign in with mock Auth or continue as guest.
- [ ] Open Home.
- [ ] Tap `Open camera` and confirm the Camera scaffold opens full-screen.
- [ ] Confirm simulator camera unavailable state is clear and does not crash.
- [ ] Tap `Choose one photo` and select one image.
- [ ] Confirm the selected image appears in the local preview.
- [ ] Tap `Retake or clear` and confirm the preview clears.
- [ ] Confirm `Continue in later phases` is disabled and does not start filters, upload, AI, StoreKit, quota, or history behavior.
- [ ] Confirm Auth sign-out still works.
- [ ] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Open the Camera scaffold from Home.
- [ ] Confirm the camera permission prompt appears when needed.
- [ ] Grant camera permission.
- [ ] Confirm camera preview appears.
- [ ] Capture one still photo.
- [ ] Confirm captured photo appears in the local preview.
- [ ] Clear / retake and confirm the app returns to capture state.
- [ ] Import one library image and confirm it replaces the preview.
- [ ] Confirm no image is uploaded or persisted.

## Phase 04

Check:

- [x] Added local Core Image filter pipeline.
- [x] Added data-driven filter preset model and catalog.
- [x] Added Original / None plus Classic Film, Warm Vintage, and Faded Chrome presets.
- [x] Added preset selector UI for selected/captured photos.
- [x] Added local filtered preview state in memory only.
- [x] Original / None uses the unfiltered image.
- [x] Filter rendering is dispatched off the main thread.
- [x] Added orientation normalization for filtered preview rendering.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed no Firebase Storage upload was implemented.
- [x] Confirmed no Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions were implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, or paid presets were implemented.
- [x] Confirmed no real secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Tap `Choose one photo` and select one image.
- [ ] Confirm the selected image appears in the local preview.
- [x] Confirm the preset selector is visible.
- [x] Switch to Classic Film and confirm the filtered preview updates.
- [x] Switch to Warm Vintage and confirm the filtered preview updates.
- [x] Switch to Faded Chrome and confirm the filtered preview updates.
- [x] Switch back to Original / None and confirm the unfiltered image appears.
- [ ] Confirm `Retake or clear` clears the preview and local filter state.
- [x] Confirm `Continue in later phases` is disabled and does not start upload, AI, StoreKit, quota, history, export, or Phase 05 behavior.
- [x] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Open the Camera scaffold from Home.
- [ ] Capture one still photo.
- [ ] Confirm captured photo appears in the local preview.
- [ ] Switch between Original / None and each retro preset.
- [ ] Confirm filtered previews update without rotated or upside-down output.
- [ ] Import one library image and confirm it replaces the previous preview.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, analyzed, or counted toward quota.

## Phase 05

Check:

- [x] Added `PhotoSaveService` protocol.
- [x] Added `MockPhotoSaveService`.
- [x] Added `SavedPhoto` metadata model.
- [x] Added `PhotoSaveState`.
- [x] Added Storage path convention draft.
- [x] Added Firestore document shape draft.
- [x] Added `FirebasePhotoSaveService` placeholder without Firebase imports.
- [x] Added mock Save UI after filtered preview.
- [x] Added visible mock save success state.
- [x] Added visible mock save failure state.
- [x] History remains an honest placeholder without cross-page saved-item persistence.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed no real `GoogleService-Info.plist` was added.
- [x] Confirmed no Firebase project ID, `.env`, `.firebaserc`, API key, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no Firebase, FirebaseStorage, or FirebaseFirestore imports were added.
- [x] Confirmed no real Firebase upload was implemented.
- [x] Confirmed no real Firestore write was implemented.
- [x] Confirmed no AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription, quota, history persistence, export/save to Photos, account deletion backend, public sharing, or Phase 06 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Confirm the mock Save UI is visible after the filtered preview.
- [x] Tap `Mock save`.
- [x] Confirm mock save success state appears.
- [x] Tap the mock failure button.
- [x] Confirm mock save failure state appears.
- [x] Confirm History remains a placeholder and does not claim real cloud persistence.
- [x] Confirm Save / Continue does not upload, write Firestore, run AI, call Cloud Functions, start StoreKit, enforce quota, persist history, export, save to Photos, or start Phase 06.
- [x] Confirm Home / History / Settings still render.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply a filter preset.
- [ ] Trigger mock save success.
- [ ] Confirm no real upload or Firestore write occurs.

## Phase 06

Check:

- [x] Added `PhotoAnalysisRequest` model draft.
- [x] Added `PhotoAnalysisResult` model draft.
- [x] Added `PhotoAnalysisStatus`.
- [x] Added `PhotoAnalysisService` protocol.
- [x] Added `MockPhotoAnalysisService` with mock success and failure behavior.
- [x] Added `CloudFunctionPhotoAnalysisService` placeholder without Firebase or FirebaseFunctions imports.
- [x] Added backend `analyzePhoto` scaffold.
- [x] Added `AIProviderAdapter`.
- [x] Added `MockAnalyzer`.
- [x] Added `GeminiAnalyzer` placeholder / TODO.
- [x] Added `OpenAIAnalyzer` placeholder / TODO.
- [x] Added TypeScript photo analysis contract.
- [x] Added future-only prompt template draft.
- [x] Mock response includes one short summary.
- [x] Mock response includes up to three actionable suggestions.
- [x] Mock response includes simple adjustment hints.
- [x] Mock response uses `provider = mock`.
- [x] Mock response uses `isMock = true`.
- [x] Confirmed no complete AI result UI was added.
- [x] Confirmed no Gemini API key was added.
- [x] Confirmed no OpenAI API key was added.
- [x] Confirmed no Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no real Gemini call was implemented.
- [x] Confirmed no real OpenAI call was implemented.
- [x] Confirmed no Cloud Functions deploy was run.
- [x] Confirmed no production Firebase was enabled.
- [x] Confirmed no Firebase / FirebaseFunctions imports were added to iOS.
- [x] Confirmed no real Gemini / OpenAI SDK imports were added.
- [x] Confirmed no Firebase Admin SDK imports were added.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed no upload, Firestore write, Storage write, AI billing, quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Trigger mock save failure.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, and Phase 05 Mock Save still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm no AI result UI appears unless a future phase explicitly adds it.
- [x] Confirm no real AI call occurs.
- [x] Confirm no real Firebase config or secrets are present.
- [x] Confirm Save / Continue does not upload, write Firestore, write Storage, call Gemini, call OpenAI, deploy/call Cloud Functions, start StoreKit, enforce quota, persist history, export, or start Phase 07.

Manual source/backend check:

- [ ] Review `ios-app/AIPhotoApp/Services/AIPhotoAdvisor/CloudFunctionPhotoAnalysisService.swift` and confirm it has TODOs but no Firebase imports.
- [ ] Review `functions/src/ai/GeminiAnalyzer.ts` and confirm it is placeholder-only.
- [ ] Review `functions/src/ai/OpenAIAnalyzer.ts` and confirm it is placeholder-only.
- [ ] Review `functions/src/analyzePhoto.ts` and confirm it returns mock analysis only.

## Phase 07

Check:

- [x] Added mock AI analysis result UI scaffold under `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/`.
- [x] Added `AIAnalysisViewModel` using the Phase 06 `PhotoAnalysisService` protocol.
- [x] Default mock analysis service is `MockPhotoAnalysisService`.
- [x] Added mock AI entry after the filtered preview / mock save flow.
- [x] Added loading state.
- [x] Added mock success state.
- [x] Added mock failure state.
- [x] Added retry and dismiss actions.
- [x] Mock result displays one short summary.
- [x] Mock result displays up to three suggestions.
- [x] Mock result displays adjustment hints.
- [x] Mock result displays composition / lighting notes when present.
- [x] UI clearly labels the result as mock / Phase 07 scaffold.
- [x] Analysis state is local memory only.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Command-line Xcode simulator build succeeded with `iPhone 17`.
- [x] Confirmed no Gemini API key was added.
- [x] Confirmed no OpenAI API key was added.
- [x] Confirmed no Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- [x] Confirmed no Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore imports were added to iOS.
- [x] Confirmed no Gemini / OpenAI / StoreKit imports were added to iOS.
- [x] Confirmed no real Gemini or OpenAI call was added.
- [x] Confirmed no Cloud Functions call or deploy was added.
- [x] Confirmed no upload, Firestore write, Storage write, AI result history persistence, AI chat, image editing, realtime video AI, StoreKit, subscription, paywall, quota, npm dependency, or Phase 08 work was added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Trigger mock save failure.
- [x] Confirm the mock AI advice panel is visible after the mock save panel.
- [x] Tap `Analyze photo (mock)`.
- [x] Confirm loading state appears.
- [x] Confirm mock summary appears.
- [x] Confirm up to three suggestions appear.
- [x] Confirm adjustment hints appear.
- [x] Confirm composition / lighting notes appear.
- [x] Confirm the mock / scaffold label is visible.
- [x] Tap the mock AI failure control.
- [x] Confirm mock failure state appears.
- [x] Retry after failure and confirm mock success can appear.
- [x] Dismiss the result and confirm the panel returns to the entry state.
- [x] Confirm the AI result panel can scroll vertically on the simulator.
- [x] Confirm priority and adjustment labels display localized text instead of raw keys.
- [ ] Switch filter presets and confirm stale analysis result is cleared.
- [ ] Clear / retake the photo and confirm analysis state is cleared with the selected photo flow.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, and Phase 05 Mock Save still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm History does not persist AI result.
- [x] Confirm no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, paywall, export, save-to-Photos, or history persistence occurs.
- [x] Confirm no real Firebase config or secrets are present.
- [x] Confirm no obvious major bug is present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save.
- [ ] Trigger mock AI analysis.
- [ ] Confirm mock result UI appears.
- [ ] Confirm no real network upload, provider call, Firestore write, Storage write, or persistence occurs.

## Phase 08

Check:

- [x] Added local in-memory session history item model.
- [x] Added local in-memory session history store.
- [x] Shared session history state through app-level SwiftUI environment object state.
- [x] Mock save success can add or update a local session item.
- [x] Mock AI analysis success can update the same local session item instead of creating a duplicate card.
- [x] History tab has a local session empty state.
- [x] History tab shows a scrollable card list when local session items exist.
- [x] History cards show local-only / mock labels.
- [x] History cards show created time.
- [x] History cards show source.
- [x] History cards show selected filter preset.
- [x] History cards show mock save status.
- [x] History cards show mock AI summary when available.
- [x] Clear local session history action only clears the in-memory store.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Firebase Storage upload, Firestore write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, secret, credential, Firebase config, npm dependency, or Phase 09 work was intentionally added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Sign in with mock Auth or continue as guest.
- [x] Open History before adding items and confirm the local session empty state appears.
- [x] Confirm the History tab can be entered normally and no longer freezes.
- [x] Open Home.
- [x] Open the Camera scaffold.
- [x] Import one image with the photo picker.
- [x] Switch to at least one retro preset.
- [x] Trigger mock save success.
- [x] Open History and confirm one local-only session card appears.
- [x] Confirm the card shows created time, source, filter preset, and mock save status.
- [x] Return to the photo flow and trigger mock AI analysis success.
- [x] Open History and confirm the same card shows the mock AI summary.
- [x] Confirm mock AI success does not create a duplicate card for the same selected photo.
- [x] Tap clear local session history.
- [x] Confirm History returns to the empty state.
- [x] Confirm UI copy says local session history is not cloud-backed and may disappear after closing or restarting the app.
- [x] Confirm Phase 03 Camera, Phase 04 Filters, Phase 05 Mock Save, and Phase 07 Mock AI UI still behave as before.
- [x] Confirm Home / History / Settings still render.
- [x] Confirm no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, paywall, export, save-to-Photos, disk persistence, UserDefaults persistence, or cloud history occurs.
- [x] Confirm no real Firebase config or secrets are present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save.
- [ ] Trigger mock AI analysis.
- [ ] Open History and confirm one local-only session item appears.
- [ ] Clear local session history.
- [ ] Confirm no real network upload, provider call, Firestore write, Storage write, export, save-to-Photos, or persistence occurs.

## Phase 09

Check:

- [x] Added `docs/prompts/phase-09-mvp-polish-ux-hardening.md`.
- [x] Home presents the current flow as a mock MVP demo instead of implying active quota enforcement.
- [x] Camera flow uses a consistent scroll container for capture, selected-photo, filter, mock save, mock AI, messages, and local-only notes.
- [x] Mock save failure is visible as a text button, not only an icon.
- [x] Mock save state text wraps cleanly.
- [x] Mock AI retry / dismiss controls are easier to tap.
- [x] History clear local session history action is visibly destructive.
- [x] History card filter detail uses localized preset text instead of a raw preset id.
- [x] Settings copy clearly says backend, cloud, subscription, AI, quota, and account deletion services are not connected.
- [x] English and Traditional Chinese localization strings were updated.
- [x] Confirmed no Firebase Storage upload, Firestore write, Storage write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, secret, credential, Firebase config, npm dependency, or Phase 10 work was intentionally added.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [x] Test on a small iPhone Simulator if possible.
- [x] Open Home and confirm the primary flow and mock/local-only copy are clear.
- [x] Open Camera and confirm permission / unavailable copy remains readable.
- [x] Import one photo and confirm the selected-photo flow scrolls fully.
- [x] Switch Original / Classic Film / Warm Vintage / Faded Chrome.
- [x] Trigger mock save success and confirm the state is clear.
- [x] Trigger mock save failure and confirm the visible failure button / state are clear.
- [x] Trigger mock AI success and confirm loading / result / retry / dismiss remain readable.
- [x] Trigger mock AI failure and confirm failure / retry / dismiss remain readable.
- [x] Open History and confirm local-only cards scroll.
- [x] Confirm History clear local session history works and is clearly local-only.
- [x] Open Settings and confirm placeholders do not claim real backend, subscription, quota, AI, cloud, or account deletion completion.
- [x] Confirm no raw localization keys appear in the primary tested flow.
- [x] Confirm no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, paywall, export, save-to-Photos, disk persistence, UserDefaults persistence, Core Data, SwiftData, or cloud history occurs.
- [x] Confirm no real Firebase config or secrets are present.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Capture one still photo.
- [ ] Apply one filter preset.
- [ ] Trigger mock save success.
- [ ] Trigger mock AI success.
- [ ] Open History and confirm the local session card remains readable.
- [ ] Confirm safe-area and scroll behavior are usable on device.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 10

Check:

- [x] Added `docs/prompts/phase-10-mvp-demo-qa-readiness.md`.
- [x] Added `docs/mvp-demo-script.md`.
- [x] Added `docs/mvp-known-limitations.md`.
- [x] Added `docs/mvp-readiness-checklist.md`.
- [x] Demo script covers Launch app -> guest/mock auth -> Home -> Camera scaffold -> Photo Picker import -> Filter presets -> Mock save success/failure -> Mock AI advice -> Local session history -> Clear history -> Settings placeholders.
- [x] Known limitations document clearly states save is mock-only, AI is mock-only, History is memory-only, and there is no cloud sync, real Firebase, StoreKit, quota enforcement, export, or save-to-Photos.
- [x] Readiness checklist covers pre-real Firebase, pre-real AI, pre-StoreKit, privacy/App Store, secrets safety, and device testing.
- [x] README and iOS README point to the Phase 10 MVP demo / readiness docs.
- [x] Phase 10 is documentation / QA readiness only.
- [x] No Swift code was modified.
- [x] No backend code was modified.
- [x] Confirmed no Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, secret, credential, Firebase config, npm dependency, or Phase 11 work was intentionally added.

Manual documentation review:

- [ ] Run the demo script in `docs/mvp-demo-script.md`.
- [ ] Confirm the demo script matches the current UI.
- [ ] Confirm `docs/mvp-known-limitations.md` is accurate after a Simulator pass.
- [ ] Confirm `docs/mvp-readiness-checklist.md` matches the next real-service priorities.
- [ ] Confirm no document claims the app is production-ready.
- [ ] Confirm no document claims real cloud save, real AI, real subscription, or permanent history exists.

Manual Xcode check on simulator:

- [ ] Build and run `AIPhotoApp` in an iOS Simulator if UI code changes in a future Phase 10 follow-up.
- [ ] For this docs-only Phase 10 pass, Xcode build is not required because no Swift code changed.

Manual Xcode check on physical iPhone / iPad:

- [ ] Optional: run the demo script on a physical device.
- [ ] Optional: confirm camera capture works on device.
- [ ] Optional: confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 11

Check:

- [x] Added Camera as the default primary tab in the main tab shell.
- [x] Kept Guide / Home content as a secondary tab instead of deleting it.
- [x] Kept History and Settings accessible.
- [x] Camera tab does not show a Close button.
- [x] Full-screen Camera launched from the guide still has a Close button.
- [x] Camera viewfinder uses a larger 4:5 portrait frame to support the 5:4-style camera-first direction.
- [x] Added a lower-right filter entry on the camera surface.
- [x] Lower-right filter entry reveals the existing local preset selector.
- [x] Preset selection before capture / import applies to the next selected photo.
- [x] Photo Picker fallback remains available.
- [x] Existing presets only are preserved: Original / Classic Film / Warm Vintage / Faded Chrome.
- [x] Mock save, mock AI advice, local session history, History, and Settings flows remain in scope.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase, real AI, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secret, credential, Firebase config, or Phase 12 work was intentionally added.

Build / source checks:

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [ ] Command-line Xcode build should be rerun in Xcode / Simulator. Codex sandbox build reached Swift compilation but failed due `sandbox-exec` / CoreSimulator environment restrictions.
- [x] User accepted Xcode / Simulator run result on 2026-06-09.
- [x] User accepted current Phase 11 result as ready to commit.

Manual Xcode check on simulator:

- [x] Build and run `AIPhotoApp` in an iOS Simulator.
- [ ] Continue through mock auth / guest entry if shown.
- [ ] Confirm Camera is the first useful app surface.
- [ ] Confirm the viewfinder is visually dominant and uses the new 5:4-style portrait frame.
- [ ] Tap the lower-right filter entry and confirm the existing preset selector appears.
- [ ] Select Classic Film before importing a photo.
- [ ] Import one photo with Photo Picker and confirm the selected preset is applied.
- [ ] Switch Original / Classic Film / Warm Vintage / Faded Chrome after import.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Open History and confirm local session item behavior still works.
- [ ] Clear local session history.
- [ ] Open Guide and confirm it is secondary explanatory content.
- [ ] Open Settings and confirm placeholders remain honest.
- [ ] Confirm no raw localization keys appear.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

Known product gaps / follow-up TODO:

- [ ] Final product should open directly into Camera and should not show a landing / browse screen first.
- [ ] Auth should not block basic camera use; login should move to Settings or future cloud-feature entry points.
- [ ] Camera page should feel more like a Dazz-style camera shell and less like a content page.
- [ ] Camera viewfinder should be more prominent and overall information density should be lower.
- [ ] Camera controls should be completed later: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- [ ] Recommended follow-up before Phase 12: Phase 11B / Camera Entry Flow & Camera Shell Redesign, if the current implementation is not yet product-satisfying.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Confirm Camera is the first useful app surface.
- [ ] Confirm camera permission and live preview still work.
- [ ] Confirm the lower-right filter entry is reachable while framing.
- [ ] Capture one still photo with a selected preset.
- [ ] Trigger mock save and mock AI advice.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 11B

Check:

- [x] Removed the launch landing / browse screen from the default app entry path.
- [x] Removed the launch-time Auth gate from the default app entry path.
- [x] App root now enters the main tab shell directly.
- [x] Camera remains the default first tab.
- [x] Basic Camera, existing filters, Photo Picker, mock save, mock AI, and local history remain usable without login.
- [x] Existing mock Auth scaffold is preserved as a Settings entry for future cloud features.
- [x] Settings explains that login is not required for basic camera use.
- [x] Camera capture state now uses a darker camera shell.
- [x] Camera viewfinder remains large and central.
- [x] Added top camera shell status / selected preset row.
- [x] Added bottom camera controls: flash, timer, capture, camera flip, and photo import.
- [x] Flash / timer / camera flip controls are UI-only scaffold interactions.
- [x] Kept lower-right filter picker entry on the viewfinder.
- [x] Kept existing four presets only.
- [x] Kept Photo Picker fallback.
- [x] Kept mock save success / failure.
- [x] Kept mock AI success / failure.
- [x] Kept local session history, History tab, Settings tab, and Guide tab.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase, Cloud Functions, Gemini/OpenAI, StoreKit, persistence, export, save-to-Photos, secret, credential, Firebase config, backend code, third-party SDK, or Phase 12 work was intentionally added.

Build / source checks:

- [x] Build and run in Xcode / Simulator.
- [ ] Confirm no raw localization keys appear.
- [x] Confirm source safety scans find no forbidden Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Confirm no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation exists.
- [x] Confirm backend / Firebase / package files were not modified.
- [ ] Command-line Xcode build should be rerun in Xcode / Simulator. Codex sandbox build reached Swift compilation but failed due existing `#Preview` macro / CoreSimulator tooling issues.
- [x] User accepted Xcode / Simulator run result on 2026-06-09.
- [x] User accepted current Phase 11B result as ready to commit.

Manual Xcode check on simulator:

- [ ] Launch app.
- [ ] Confirm there is no landing / browse screen.
- [ ] Confirm there is no launch-time Auth screen.
- [ ] Confirm Camera is the default first tab.
- [ ] Confirm Camera feels like a dark camera shell rather than a white content page.
- [ ] Confirm the viewfinder is large and visually dominant.
- [ ] Toggle flash / timer / camera flip controls.
- [ ] Tap the lower-right filter entry and confirm the existing preset selector appears.
- [ ] Use Photo Picker to import one photo.
- [ ] Confirm selected-photo flow still reaches existing filters, mock save, and mock AI.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Open History and confirm local session item behavior still works.
- [ ] Open Settings and confirm mock Auth / account entry is available there.
- [ ] Confirm Settings says login is for future cloud features and not required for basic camera use.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

Known product gaps / follow-up TODO:

- [ ] Final product should open directly into Camera and should not show a landing / browse screen first.
- [ ] Auth should not block basic camera use; login should move to Settings or future cloud-feature entry points.
- [ ] Camera page should feel more like a Dazz-style camera shell and less like a content page.
- [ ] Camera viewfinder should be more prominent and overall information density should be lower.
- [ ] Camera controls should be completed later: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- [ ] Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign, if the current shell remains visually insufficient.

Manual Xcode check on physical iPhone / iPad:

- [ ] Build and run `AIPhotoApp` on device.
- [ ] Confirm app enters Camera directly.
- [ ] Confirm camera permission and live preview still work.
- [ ] Confirm camera controls are reachable while framing.
- [ ] Capture one still photo.
- [ ] Trigger mock save and mock AI advice.
- [ ] Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## Phase 12B

Check:

- [x] Extended the Swift filter preset model with local catalog metadata.
- [x] Added `FilterPresetCategory`.
- [x] Kept the catalog data-driven in `FilterPresetCatalog`.
- [x] Added a Core Image highlight/shadow adjustment to the existing pipeline.
- [x] Implemented Batch 1 hero filters only:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Kept Original as the no-filter option.
- [x] Kept Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no public UI filter names use Kodak, Fujifilm, Leica, Polaroid, CineStill, or other protected brand names.
- [x] Confirmed no LUT, grain, light leak, or texture assets were added.
- [x] Confirmed no backend code was modified.
- [x] Confirmed no real Firebase, Gemini, OpenAI, Cloud Functions, StoreKit, persistence, export, save-to-Photos, secrets, dependencies, third-party SDKs, monetization, premium gating, quota, Phase 13, or 20-filter implementation was intentionally added.

Build / source checks:

- [x] `git diff --check` passed.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / `sandbox-exec` environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-09.
- [x] Forbidden imports scan found no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, or Apple credentials added.
- [x] Forbidden behavior scan found no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, or save-to-Photos implementation added for Phase 12B.

Manual Xcode check on simulator:

- [x] User manually verified Phase 12B in Xcode / Simulator on 2026-06-09 and accepted the current result.
- [x] Launch the app.
- [x] Confirm Camera-first flow still opens correctly.
- [x] Confirm Photo Picker fallback still works.
- [x] Import one photo.
- [x] Open the filter selector.
- [x] Confirm Original is available and shows the unfiltered image or is clearly preserved as the no-filter option.
- [x] Confirm Soft Warm 400 is available and renders an acceptably distinct look.
- [x] Confirm Summer Gold 200 is available and renders an acceptably distinct look.
- [x] Confirm Street Chrome is available and renders an acceptably distinct look.
- [x] Confirm Soft Sun Portrait is available and renders an acceptably distinct look.
- [x] Confirm Cinema Flat is available and renders an acceptably distinct look.
- [x] Confirm Silver Gradation is available and renders an acceptably distinct look.
- [x] Confirm Classic Film, Warm Vintage, and Faded Chrome remain available or clearly mapped.
- [x] Switch between filters and confirm the app does not freeze in the accepted manual pass.
- [x] Trigger mock save success and failure.
- [x] Trigger mock AI success and failure.
- [x] Confirm local session history works.
- [x] Open History and Settings.
- [x] Confirm no real Firebase, AI, Cloud Functions, StoreKit, persistence, upload, export, or save-to-Photos behavior occurs.
- [x] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] HSL-specific tuning is not implemented yet.
- [ ] Vibrance, true fade, grain, bloom, glow, halation, LUT, Metal, and custom shader support remain future work.
- [ ] Batch 1 filters are Core Image MVP approximations, not the final realistic film emulation engine.
- [ ] Phase 13 or later should handle expansion to 12 filters and then 20 filters.
- [ ] LUT, grain overlay, halation, light leak, CCD-style looks, and instant camera looks should remain for later phases.
- [ ] Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.
- [ ] Street Chrome may need a future LUT for more accurate slide / chrome color.
- [ ] Soft Warm 400, Summer Gold 200, and Silver Gradation do not include grain yet.

## Phase 13

Check:

- [x] Expanded the local research preset catalog to 20 presets.
- [x] Kept Original as the no-filter option outside the 20 research presets.
- [x] Preserved legacy starter filters: Classic Film, Warm Vintage, and Faded Chrome.
- [x] Preserved Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Added 14 Phase 13 filters:
  - Everyday Color 400
  - Amber Night 800
  - Vivid Landscape 100
  - Slide Pop
  - Memory Negative
  - Amber Nostalgia
  - Tri Grit 400
  - Neon Tungsten 800
  - Instant Dream
  - Metro Pop
  - Diana Soft
  - Flash Party
  - CCD Party 2008
  - Editor Classic
- [x] Added filter group metadata and localized group titles.
- [x] Updated filter picker UI to use group chips plus a preset grid instead of one long horizontal row.
- [x] Kept all Phase 13 filters as Core Image MVP approximations.
- [x] Confirmed no public UI filter names intentionally use Kodak, Fujifilm, Leica, Polaroid, CineStill, or other protected brand names.
- [x] Confirmed no LUT, true grain, light leak, dust, frame, Metal shader, AI custom filter, premium gating, or real-service implementation was intentionally added.
- [x] Confirmed no backend code was modified.

Build / source checks:

- [x] `git diff --check` passes.
- [x] Xcode build passes. Sandboxed CLI build hit CoreSimulator/sandbox environment limits, then unsandboxed `xcodebuild` completed with `BUILD SUCCEEDED`.
- [x] Forbidden imports scan finds no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- [x] Secrets / config scan finds no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, or provisioning profiles.
- [x] Forbidden behavior scan finds no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, or save-to-Photos implementation added for Phase 13. Existing mock/future placeholder references remain documented from earlier phases.
- [x] Brand-name UI scan finds no Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar brand names in public UI source.

Manual Xcode check on simulator:

- [x] User manually verified Phase 13 in Xcode / Simulator and temporarily accepted the current result on 2026-06-09.
- [x] Launch the app.
- [x] Confirm app can build / run.
- [x] Confirm Camera-first flow still opens correctly.
- [x] Confirm Photo Picker fallback still works.
- [x] Import one photo.
- [x] Open the filter picker.
- [x] Confirm filter groups are visible and usable.
- [x] Confirm the picker is not one long horizontal row.
- [x] Confirm Original is available and shows the unfiltered image.
- [x] Confirm Classic Film, Warm Vintage, and Faded Chrome remain available or clearly mapped.
- [x] Confirm Batch 1 six hero filters remain available:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- [x] Confirm all 20 research presets are available:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
  - Everyday Color 400
  - Amber Night 800
  - Vivid Landscape 100
  - Slide Pop
  - Memory Negative
  - Amber Nostalgia
  - Tri Grit 400
  - Neon Tungsten 800
  - Instant Dream
  - Metro Pop
  - Diana Soft
  - Flash Party
  - CCD Party 2008
  - Editor Classic
- [x] Switch between filters and confirm the app does not freeze.
- [x] Confirm newly added filters have temporarily acceptable visual differences.
- [x] Trigger mock save success and failure.
- [x] Trigger mock AI success and failure.
- [x] Confirm local session history records the selected filter id.
- [x] Open History and Settings.
- [x] Confirm no raw localization keys appear.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.
- [x] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- [ ] Phase 13B can be opened later to adjust individual filter parameters, ordering, grouping, picker UI, or visual differences.
- [ ] True grain overlays, LUT assets, halation, light leaks, dust, frames, CCD / instant camera asset treatment, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- [ ] Instant Dream, Diana Soft, CCD Party 2008, Flash Party, and other camera looks are color / contrast / vignette / bloom approximations only.
- [ ] AI custom filters, reference-image-to-filter, and AI image generation remain future phases.
- [ ] Premium gating remains future monetization work only.

## Filter Research Docs Backfill + Alignment Check

Check:

- [x] Read supplied filter research report at `/Users/a1234/Downloads/濾鏡.md`.
- [x] Confirmed `docs/filter-research-popular-film-looks.md` exists and backfilled source status / current 20-preset catalog notes.
- [x] Confirmed `docs/filter-preset-schema.md` exists and records current schema / deferred fields.
- [x] Confirmed `docs/filter-roadmap.md` exists and records current Phase 13 implementation alignment.
- [x] Confirmed `docs/prompts/phase-12-filter-preset-schema-and-batch1.md` exists.
- [x] Confirmed `docs/prompts/phase-13-expanded-filter-library-20-presets.md` exists.
- [x] Confirmed `Original` remains no-filter.
- [x] Confirmed legacy starter filters remain present: Classic Film, Warm Vintage, Faded Chrome.
- [x] Confirmed Batch 1 hero filters remain present: Soft Warm 400, Summer Gold 200, Street Chrome, Soft Sun Portrait, Cinema Flat, Silver Gradation.
- [x] Confirmed Phase 13 additional filters remain present: Everyday Color 400, Amber Night 800, Vivid Landscape 100, Slide Pop, Memory Negative, Amber Nostalgia, Tri Grit 400, Neon Tungsten 800, Instant Dream, Metro Pop, Diana Soft, Flash Party, CCD Party 2008, Editor Classic.
- [x] Confirmed stable filter IDs remain present in `FilterPresetCatalog.swift`.
- [x] Confirmed filter grouping / category metadata remains present.
- [x] Confirmed public UI display names remain brand-safe and do not use Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar protected brand names.
- [x] Confirmed Phase 13 filters remain Core Image MVP approximations.
- [x] Confirmed no Swift code was modified for this docs backfill.
- [x] Confirmed no backend code was modified for this docs backfill.

Known TODOs:

- [ ] Phase 13B may tune individual filter parameters after more real-photo testing.
- [ ] Phase 13B may revisit filter ordering, grouping, picker UI, or visual differences.
- [ ] File-backed local catalog loading can be considered later; current catalog remains Swift in-code.
- [ ] True LUT support remains future work.
- [ ] True grain overlays, halation, light leak, dust, frames, CCD / instant camera asset treatment, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- [ ] Public UI filter names should continue avoiding protected brand names unless legal approval exists.

## Phase 16 + Phase 16A-R UX Rescue Closeout

User manual Xcode / Simulator verification:

- [x] Camera UX accepted for current Phase 16 / 16A-R closeout.
- [x] Camera shutter is visible and tappable.
- [x] Camera does not require scroll.
- [x] AI Snapshot compact entry works.
- [x] AI Snapshot consent step works.
- [x] AI Snapshot mock result works.
- [x] Mock guidance works.
- [x] Local guidance works.
- [x] Guidance / AI / filter / lens callouts have no obvious overlap.
- [x] Filter pill / callout works.
- [x] Lens dropdown works.
- [x] Flash works.
- [x] Timer works.
- [x] Flip camera control works.
- [x] Capture works.
- [x] Front-camera screen flash scaffold is preserved.
- [x] Phase 15B brightness guidance works.
- [x] Phase 15C face framing / headroom guidance works.
- [x] Phase 15D stability / priority / anti-flicker works.
- [x] Camera tab no longer has Photo Picker.
- [x] Inspiration tab has the import photo entry.
- [x] Inspiration import flow remains available.
- [x] Ordinary pages bottom tab bar is acceptable.
- [x] Settings bottom navigation no longer has blocker-level content obstruction.
- [x] Inspiration bottom navigation no longer has blocker-level content obstruction.
- [x] History bottom navigation no longer has blocker-level content obstruction.
- [x] 20 filters / grouping work.
- [x] Mock save works.
- [x] Mock AI works.
- [x] Local session history works.
- [x] English and Traditional Chinese localization has no raw keys.
- [x] No real network / upload / AI / Firebase / StoreKit / persistence / export behavior was observed.
- [x] No secrets / Firebase config / API keys were added.
- [x] No backend changes were added.
- [x] `ios-app/AIPhotoApp/App/File.txt` is not present after cleanup.

Final closeout checks to keep before commit:

- [ ] Confirm `git status --short` contains only Phase 16 mock snapshot, Phase 16A-R UX rescue, localization, docs, and smoke-test files.
- [ ] Confirm `git diff --check` passes.
- [ ] Confirm forbidden imports scan has no Firebase / Gemini / OpenAI / StoreKit imports.
- [ ] Confirm network / upload scan has no real `URLSession`, `URLRequest`, WebSocket, upload, Firebase Storage, Firestore, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- [ ] Confirm secrets / config scan finds no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase config, private keys, OAuth secrets, or Apple credentials.
- [ ] Confirm frame / photo persistence scan finds no raw frame, selected photo, or cloud request payload persistence.

Known TODOs:

- [ ] Real cloud AI remains deferred to a later explicit Phase 16B / 17 request after commit, push, and read-only confirmation.
- [ ] Ordinary tab bar and Camera spacing can receive small visual tuning later if new screenshots reveal device-specific spacing issues.

## Phase 16T / HK3 Mock Language Mode UI

Check:

- [ ] Open Settings.
- [ ] Confirm the Language / Tone section appears.
- [ ] Confirm only language buttons are shown.
- [ ] Confirm no separate tone selector appears.
- [ ] Confirm English / 繁體中文 / 简体中文 / 廣東話 options are visible.
- [ ] Select English, 繁體中文, 简体中文, and 廣東話 and confirm the choice only affects the Settings mock selection.
- [ ] Confirm no production-visible preview card appears.
- [ ] Confirm no production-visible Tip / After fixing / 提示 / 修正後 phrase examples appear.
- [ ] Confirm no production-visible explicit profanity example appears.
- [ ] Confirm Cantonese safety notice appears when 廣東話 is selected.
- [ ] Confirm safety notice says 麻煩友 direction comments on shooting choices and photo state, not appearance, body, or identity.
- [ ] Confirm there is no app-wide language switching.
- [ ] Confirm Camera guidance copy remains unchanged.
- [ ] Confirm Photo Advisor, Filter Lab, and 改圖師 runtime copy remain unchanged.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no UserDefaults, persistence, network, backend, real AI, provider SDK, StoreKit, payment, moderation, or runtime profanity filtering behavior occurs.

Known TODOs:

- [ ] Runtime language mode is not implemented.
- [ ] Deterministic copy resolver scaffold is now HK4, but formal language mode remains future-only.
- [ ] Explicit profanity remains future-only and requires separate safety / App Store / age-rating review before any runtime use.

## Phase 16U / HK4 Deterministic Camera Coach Copy Resolver Integration

Check:

- [ ] Open Camera and confirm the camera preview or simulator fallback still opens normally.
- [ ] Confirm Live Guidance / 本機導拍 still appears when enabled.
- [ ] Confirm Local Camera Coach suggestions still update without obvious flicker or repeated aggressive copy.
- [ ] Confirm existing guidance priority / anti-flicker behavior still feels preserved.
- [ ] Confirm no explicit profanity appears in live camera guidance.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm Settings Language / Tone remains mock-only and non-persistent.
- [ ] Confirm changing Settings Language / Tone does not change Camera runtime copy.
- [ ] Confirm Photo Advisor runtime copy is unchanged.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no UserDefaults, @AppStorage, Core Data, SwiftData, persistence, network, backend, real AI, provider SDK, StoreKit, payment, moderation, or runtime profanity filtering behavior occurs.

Known TODOs:

- [ ] Runtime tone remains neutral by default.
- [ ] HK / 麻煩友 runtime activation requires a future explicit HK5 phase.
- [ ] Explicit profanity remains unsupported in runtime.

## Phase 16V Persistent Language / Tone Settings + Camera Coach Runtime Integration

Check:

- [ ] Open Settings.
- [ ] Select English, 繁體中文, 简体中文, and 廣東話 in the Language / Tone section.
- [ ] Confirm non-Cantonese languages do not show a tone selector.
- [ ] Select 廣東話 and confirm only 香港口語 and 麻煩友 tone choices are available.
- [ ] Confirm 麻煩友（粗口） is not available as an active runtime option.
- [ ] Restart the app and confirm the selected language / tone preference persists.
- [ ] Open Camera.
- [ ] Trigger Local Camera Coach guidance where possible.
- [ ] Confirm English selection shows English neutral Camera Coach copy for supported categories.
- [ ] Confirm 繁體中文 selection shows Traditional Chinese neutral Camera Coach copy for supported categories.
- [ ] Confirm 简体中文 selection shows Simplified Chinese neutral Camera Coach copy for supported categories.
- [ ] Confirm 廣東話 + 香港口語 shows Cantonese conversational Camera Coach copy for supported categories.
- [ ] Confirm 廣東話 + 麻煩友 shows non-explicit 麻煩友 Camera Coach copy for supported categories.
- [ ] Confirm no explicit profanity appears in runtime Camera Coach copy.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm existing guidance priority / anti-flicker behavior still feels preserved.
- [ ] Confirm Photo Advisor runtime copy is unchanged.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no photos, camera frames, face data, raw image data, AI responses, prompts, exports, cloud data, or sensitive inference are persisted.
- [ ] Confirm persistence is limited to `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, moderation, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Local Camera Coach currently uses deterministic phrase categories only.
- [ ] Deeper issue-resolved praise wiring can be considered later without destabilizing anti-flicker logic.
- [ ] Expanding the resolver to Photo Advisor / Filter Lab / 改圖師 requires a separate explicit phase.
- [ ] Explicit profanity remains unsupported in runtime and requires separate safety / App Store / age-rating review before any future use.

## Phase 16W Extend Language / Tone Resolver to Photo Advisor

Check:

- [ ] Open Settings and select English.
- [ ] Open captured / imported photo AI 建議 / Photo Advisor.
- [ ] Confirm Photo Advisor copy appears in English.
- [ ] Select 繁體中文.
- [ ] Open Photo Advisor again and confirm copy appears in Traditional Chinese.
- [ ] Select 简体中文.
- [ ] Open Photo Advisor again and confirm copy appears in Simplified Chinese.
- [ ] Select 廣東話 and 香港口語.
- [ ] Open Photo Advisor again and confirm copy appears in Cantonese conversational style.
- [ ] Select 廣東話 and 麻煩友.
- [ ] Open Photo Advisor again and confirm copy appears in non-explicit 麻煩友 style.
- [ ] Confirm no explicit profanity appears in Photo Advisor runtime copy.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm Photo Advisor card structure is unchanged.
- [ ] Confirm recommended filter apply still works.
- [ ] Confirm Camera Coach still follows the selected language / tone.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no new persistence beyond `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Photo Advisor labels can receive deeper localization polish in a later explicit phase.
- [ ] Filter Lab / 改圖師 copy resolver integration remains future-only.
- [ ] Explicit profanity remains unsupported in Photo Advisor runtime.

## Phase 16W-R2 Camera Local-only AI Surface Cleanup

Check:

- [ ] Open Camera.
- [ ] Confirm no AI Snapshot / Quick Advice / cloud-style AI button appears on Camera.
- [ ] Confirm no Camera surface shows `AI Snapshot`, `Quick Advice`, `快速建議`, or `麻煩友看看`.
- [ ] Confirm Local Guidance chip still appears.
- [ ] Select English in Settings.
- [ ] Confirm Local Guidance chip / sentence appears in English.
- [ ] Select 简体中文 in Settings.
- [ ] Confirm Local Guidance chip / sentence appears in Simplified Chinese.
- [ ] Select 廣東話 / 麻煩友 in Settings.
- [ ] Confirm Local Guidance uses non-explicit Cantonese 麻煩友 copy.
- [ ] Confirm no explicit profanity appears in Camera Local Guidance.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm timer, flash, flip, filter, and lens selector still work.
- [ ] Capture or select a photo from the Camera tab and confirm the floating tray does not show AI Advisor access on the Camera surface.
- [ ] Confirm Camera selected-photo filter grid can still apply filters and auto-dismiss.
- [ ] Open Inspiration.
- [ ] Confirm imported / selected photo AI 建議 / Photo Advisor remains available there.
- [ ] Confirm Photo Advisor still follows selected language / tone preference.
- [ ] Confirm Filter Lab runtime copy is unchanged.
- [ ] Confirm 改圖師 / image editing runtime copy is unchanged.
- [ ] Confirm no app-wide language switching occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no new persistence beyond `cameraCoach.languageMode` and `cameraCoach.toneMode`.
- [ ] Confirm no network, backend, real AI, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.

Known TODOs:

- [ ] Future real cloud AI should target Inspiration / Photo Advisor first, not Camera tab.
- [ ] Camera AI Snapshot service boundary files can remain for reference but should not be exposed on Camera without a new explicit phase.
- [ ] Filter Lab / 改圖師 copy resolver integration remains future-only.

## Phase 16X Inspiration AI Hub Cleanup

Check:

- [ ] Open Camera.
- [ ] Confirm Camera remains local-only and no cloud AI / AI Snapshot / Quick Advice entry returns.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Open Inspiration.
- [ ] Confirm AI Hub / creative hub layout appears.
- [ ] Confirm import photo analysis is a clear primary entry.
- [ ] Import a photo and confirm the selected / imported photo workflow still opens.
- [ ] Confirm Photo Advisor / AI 建議 result still works from the imported / selected photo flow.
- [ ] Confirm Photo Advisor follows Settings language / tone preference.
- [ ] Confirm Filter Lab mock remains accessible.
- [ ] Confirm Filter Lab remains mock/local and does not upload.
- [ ] Confirm Photo Edit / 改圖師 placeholder is disabled / future-only if present.
- [ ] Confirm future cloud AI notice says clear consent is required before any cloud analysis.
- [ ] Confirm future cloud AI notice says no background photo upload.
- [ ] Confirm no real network, backend, provider SDK, StoreKit, payment, upload, save-to-Photos, or export behavior occurs.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no explicit profanity appears in production Inspiration UI or Photo Advisor runtime.
- [ ] Confirm no banned appearance, body, identity, age, gender, health, mental health, protected-class, or attractiveness wording appears.

Known TODOs:

- [ ] Future real cloud AI still requires explicit Phase 17 / backend boundary approval.
- [ ] Photo Edit / 改圖師 remains placeholder-only until a dedicated mock UX or provider research implementation phase.
- [ ] Filter Lab remains mock/local until a dedicated future phase.

## Phase 16K-L Local Heuristic Advisor + Selected Photo UX Polish

Check:

- [x] User manually accepted Phase 16K-L in Xcode / Simulator on 2026-06-12.
- [x] Import a photo from Inspiration / 靈感 and confirm the selected-photo result screen opens normally.
- [x] Confirm selected / imported photo result still shows the floating AI / Filter bar.
- [x] Tap AI advice / AI 建議 and confirm the advisor sheet opens.
- [x] Select a warm / portrait-like filter such as Soft Warm 400 or Instant Dream, open AI advice, and confirm the result leans warm / portrait / soft retro.
- [x] Confirm warm recommendations use existing filters such as Soft Warm 400, Instant Dream, and Summer Gold 200.
- [x] Select a street / chrome / high-contrast filter such as Street Chrome or Metro Pop and confirm the result leans street / chrome / city.
- [x] Confirm street / chrome recommendations use existing filters such as Street Chrome, Metro Pop, and Silver Gradation.
- [x] Select a night / neon filter such as Amber Night 800 or Neon Tungsten 800 and confirm the result leans night / neon / low-light.
- [x] Confirm night / neon recommendations use existing filters such as Amber Night 800, Neon Tungsten 800, and CCD Party 2008.
- [x] Select a cinematic filter such as Cinema Flat or Editor Classic and confirm the result leans cinematic / low contrast.
- [x] Confirm cinematic recommendations use existing filters such as Cinema Flat and Editor Classic.
- [x] Import or capture a landscape / wide photo and confirm crop / retake advice suggests keeping background / sky / environment.
- [x] Import or capture a portrait / tall portrait photo and confirm crop / retake advice mentions centered subject / natural vertical spacing / headroom.
- [x] Import or use a square photo and confirm the result remains stable and does not require a retake.
- [x] Confirm recommended filter IDs all resolve to real presets in the existing catalog.
- [x] Confirm invalid recommendation fallback is covered by validator/code review or an injected preview/service test if manually testable.
- [x] Tap Filter / 濾鏡 from the floating bar and confirm the floating grid opens.
- [x] Select a filter from the floating grid and confirm it applies immediately and auto-dismisses.
- [x] Confirm the current filter label updates after selection.
- [x] Confirm the AI advisor sheet can be reopened after filter selection and reflects the selected filter family.
- [x] Confirm selected-photo UI has less clutter, tighter preview spacing, and compact local-only copy.
- [x] Confirm no duplicate full inline AI advisor / filter grid / mock save sections appear below the photo.
- [x] Confirm no cloud save CTA appears for free / unknown user.
- [x] Confirm no local download, export, save-to-Photos, StoreKit paywall, premium gate, or cloud save UI appears.
- [x] Confirm Filter Lab still opens and result preview remains stable.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, History, and Settings still work.
- [x] Confirm English and Traditional Chinese UI show no raw localization keys.
- [x] Confirm no 0-100 score, star rating, beauty wording, attractiveness wording, identity, gender, age, emotion, health, race, religion, or sensitive inference copy appears.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, raw image persistence, AI response persistence, or generated filter save occurs.

Known TODOs:

- [ ] Photo Advisor remains mock-only and local-only.
- [ ] Advisor heuristic remains local/simple, not real AI.
- [ ] Future local heuristic can inspect safer image statistics only if explicitly scoped.
- [ ] Future real cloud advisor requires backend boundary work first.
- [ ] Future local heuristic advisor can be expanded only with safe local signals.
- [ ] Cloud save / paid-user cloud save / free local lossless download require a dedicated entitlement / export phase.
- [ ] No StoreKit or export exists yet.
- [ ] No StoreKit / export / save-to-Photos yet.

## Phase 16I Mock Post-capture AI Advisor UX

Check:

- [x] Added typed Post-capture Photo Advisor models.
- [x] Added `PhotoAdvisorService` protocol.
- [x] Added `MockPhotoAdvisorService`.
- [x] Added 8 mock fixtures.
- [x] Added validator / fallback logic.
- [x] Added compact advisor result card.
- [x] Added analyzing, success, failed, and unavailable states.
- [x] Added existing-filter recommendation cards / chips.
- [x] Added apply recommended filter CTA using the existing filter selection mechanism.
- [x] Added retake / crop advice display.
- [x] Integrated advisor card into selected-photo result flow for captured and imported photos.
- [x] Kept advisor out of the live Camera preview overlay.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed source does not add real AI, backend, network, upload, persistence, export, Firebase, Gemini, OpenAI, StoreKit, provider imports, API keys, caption UI, photo score, beauty / attractiveness scoring, or sensitive inference.

Manual Xcode / Simulator check:

- [x] User manually accepted Phase 16I Mock Post-capture AI Advisor UX in Xcode / Simulator on 2026-06-11.
- [x] Launch the app.
- [x] Import one photo from Inspiration / selected-photo import path and confirm the selected-photo result flow appears.
- [x] Confirm the selected / imported photo screen shows the floating bar.
- [x] Confirm AI advice / AI 建議 opens the mock Photo Advisor through floating access.
- [x] Confirm the advisor shows Mock and local demo labeling.
- [x] Confirm the analyzing state appears briefly.
- [x] Confirm a mock result appears with summary, strengths, suggestions, recommended filters, retake advice, and crop advice.
- [x] Confirm recommended filters show existing filter names and short reasons.
- [x] Tap a recommended filter and confirm the selected-photo preview applies that existing filter.
- [x] Confirm filter grid opens from the floating bar.
- [x] Select a filter from the floating grid and confirm it applies and auto-dismisses the grid.
- [x] Confirm duplicate inline AI / filter sections are cleaned up in the selected-photo flow.
- [x] Confirm invalid filter fallback path is covered by code review / validator review.
- [x] Confirm no 0-100 score, star rating, beauty wording, attractiveness wording, identity, gender, age, emotion, health, race, religion, or sensitive inference copy appears.
- [x] Confirm `Mock demo, no upload/no save` copy is visible.
- [x] Confirm no raw localization keys appear in EN or zh-Hant.
- [x] Capture a photo if camera is available and confirm the selected-photo result flow remains usable.
- [x] Confirm Camera live preview remains fullscreen/native-camera-like and does not become a scroll page.
- [x] Confirm shutter remains visible and tappable in capture mode.
- [x] Confirm Pose Overlay still opens, mirrors, closes, and does not block controls.
- [x] Confirm AI Snapshot compact control still opens and returns mock result.
- [x] Confirm live guidance, filter pill, lens dropdown, timer, flash, flip, and capture still work.
- [x] Confirm Filter Lab in Inspiration still opens and mock generated filter flow still works.
- [x] Confirm History and Settings still render.
- [x] Confirm no cloud save CTA for free / unknown user.
- [x] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, network prompt, StoreKit, quota, persistence, export, save-to-Photos, or backend behavior occurs.

Known TODOs:

- [ ] Mock Photo Advisor remains mock-only.
- [ ] Future real cloud advisor requires backend boundary work.
- [ ] Future local heuristic advisor may be added before real cloud if explicitly requested.
- [ ] Cloud save / paid-user cloud save / free local lossless download require a dedicated future phase.
- [ ] No StoreKit / export / save-to-Photos yet.

## Phase 16I-R1 Floating Advisor / Filter Grid for Selected Photo UX

Check:

- [x] User manually accepted Phase 16I-R1 floating advisor / filter grid UX in Xcode / Simulator on 2026-06-11.
- [x] Import a 4:6 portrait photo.
- [x] Import a 1:1 square photo.
- [x] Import a 4:5 or 3:4 portrait photo if available.
- [x] Import a landscape photo if available.
- [x] Confirm the floating selected-photo tray is visible without scrolling to the page bottom.
- [x] Confirm the tray respects the bottom safe area / home indicator.
- [x] Confirm the tray does not cover Back to Camera / Clear controls.
- [x] Tap Filter / current filter in the tray.
- [x] Confirm the floating filter grid opens without scrolling to the inline filter section.
- [x] Confirm AI recommended filters appear first when available.
- [x] Confirm all existing local filter presets remain available in the grid.
- [x] Select a filter from the floating grid.
- [x] Confirm the selected filter applies immediately.
- [x] Confirm the grid auto-dismisses after filter selection.
- [x] Confirm the current filter label in the tray updates.
- [x] Reopen the floating filter grid and select a different filter.
- [x] Tap AI advice in the tray.
- [x] Confirm the floating AI advisor sheet opens without scrolling to the inline advisor card.
- [x] Confirm the advisor sheet shows mock / no-upload copy.
- [x] Confirm opening AI advice closes the filter grid.
- [x] Confirm opening the filter grid closes the AI panel.
- [x] Confirm tapping background or close collapses the active floating panel.
- [x] Confirm the full inline filter selector is no longer duplicated below the photo.
- [x] Confirm the full inline AI Photo Advisor card is no longer duplicated below the photo.
- [x] Confirm no 0-100 score, star rating, beauty, attractiveness, gender, age, emotion, identity, or sensitive attribute wording appears.
- [x] Confirm no raw localization keys appear in the floating tray, filter grid, or advisor sheet.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, or generated filter save occurs.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, Filter Lab, History, and Settings still work.

Known TODOs:

- [ ] Verify the floating panel max height on more physical iPhone sizes during later polish.
- [ ] Phase 16I-R1 remains mock-only and should not start Phase 17 / real AI.
- [ ] Caption / social copy is intentionally not implemented.
- [ ] Advisor results are session-only and are not saved to History.
- [ ] Visual spacing should be reviewed on small iPhone screens after R2 removed duplicate inline selected-photo sections.

## Phase 16I-R2 Selected Photo Cleanup, Navigation Fix, and Filter Lab Layout Hardening

Check:

- [x] User manually accepted Phase 16I-R2 selected-photo cleanup, navigation fixes, and Filter Lab layout hardening in Xcode / Simulator on 2026-06-11.
- [x] Import a photo from Inspiration / 靈感.
- [x] Confirm the selected-photo screen shows the floating AI / Filter bar.
- [x] Confirm no duplicate full inline AI Photo Advisor card appears below the photo.
- [x] Confirm no duplicate full inline legacy mock AI advice card appears below the photo.
- [x] Confirm no duplicate full inline filter grid appears below the photo.
- [x] Confirm no large Mock cloud save / Mock save card appears by default for free / unknown user.
- [x] Confirm Back to Camera / 返回相機 from Inspiration selected-photo result closes the result flow and switches to the outer Camera tab.
- [x] Confirm Back to Camera does not push, present, or nest another CameraView inside Inspiration.
- [x] Return to Inspiration and import another photo.
- [x] Confirm Clear / 清除 closes the selected-photo result and returns to the Inspiration page.
- [x] Confirm Clear does not switch to Camera tab.
- [x] Confirm the floating filter grid still opens from the floating bar.
- [x] Confirm selecting a filter applies it and auto-dismisses the grid.
- [x] Confirm the floating AI advisor still opens from the floating bar.
- [x] Confirm floating AI panel and filter grid still do not overlap.
- [x] Open Filter Lab / 生成我的濾鏡.
- [x] Test a 1:1 reference image and confirm preview/result does not overflow horizontally.
- [x] Test a 4:5 / 3:4 / 4:6 portrait reference image and confirm preview/result does not overflow horizontally.
- [x] Test a 16:9 or landscape reference image and confirm preview/result does not overflow horizontally.
- [x] Test a very wide or very tall image if available and confirm preview/result remains clamped.
- [x] Confirm before / after preview uses safe aspect-fit sizing.
- [x] Confirm slider stays within screen width.
- [x] Confirm tags, warnings, and parameter summary wrap / stay within screen width.
- [x] Confirm Filter Lab header and close button are not displaced by the image.
- [x] Confirm no cloud save CTA, StoreKit paywall, premium gate, local download, export, or save-to-Photos UI appears.
- [x] Confirm no upload, network call, real AI call, backend call, persistence, export, save-to-Photos, or generated filter save occurs.
- [x] Confirm Camera fullscreen capture layout, shutter, Pose Overlay, AI Snapshot, guidance, Filter Lab, History, and Settings still work.
- [x] Confirm no raw localization keys appear.

Known TODOs:

- [ ] Future paid users may see cloud save only after a dedicated entitlement / cloud save phase.
- [ ] Future free users may get local lossless download only after a dedicated export phase.
- [ ] Phase 16I-R2 remains mock-only and should not start Phase 17 / real AI.

## Phase 16G AI Filter Generator Mock in Inspiration

Check:

- [x] Added Filter Lab / Generate My Filter entry to the Inspiration tab.
- [x] Kept Filter Lab out of the Camera tab.
- [x] Added structured mock `GeneratedFilterRecipe` and `GeneratedFilterParameterSet`.
- [x] Added mock `FilterGenerationService`.
- [x] Added validator / clamp helper for finite values and safe ranges.
- [x] Added mock analyzing, result, failed, and unavailable states.
- [x] Added before / after preview using local mock recipe approximation.
- [x] Added intensity slider for session-only preview.
- [x] Added session-only apply action.
- [x] Added sample fallback for picker / simulator testing.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed source does not add real AI, backend, network, upload, persistence, export, LUT, Firebase, Gemini, OpenAI, StoreKit, or provider imports.

Manual Xcode / Simulator check:

- [x] User manually verified Phase 16G in Xcode / Simulator on 2026-06-11 and temporarily accepted the current result.
- [x] Launch the app.
- [x] Open Inspiration / 靈感 tab.
- [x] Confirm Filter Lab / 生成我的濾鏡 entry is visible.
- [x] Confirm the existing Import Photo / mock AI flow is still visible.
- [x] Tap Start generating / 開始生成.
- [x] Choose a reference image with PhotosPicker.
- [x] If PhotosPicker is inconvenient in Simulator, tap Use sample / 使用範例.
- [x] Confirm mock analyzing state appears.
- [x] Confirm generated filter result card appears.
- [x] Confirm mock/source/session-only/no-upload copy is visible.
- [x] Confirm before / after preview appears.
- [x] Move the intensity slider and confirm the preview updates.
- [x] Tap Apply mock filter / 套用 mock 濾鏡 and confirm it only applies to the current Filter Lab preview session.
- [x] Tap Try another image / 再試另一張 and confirm the flow resets.
- [x] Confirm the generated filter is not added to the permanent 20-filter catalog.
- [x] Confirm existing 20 filters, mock save, mock AI, and local history still work from the existing photo import flow.
- [x] Confirm Camera / Pose Overlay / AI Snapshot / guidance / filter / lens still work.
- [x] Open History and Settings.
- [x] Confirm English and Traditional Chinese UI show no raw localization keys.
- [x] Confirm no network prompt, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, persistence, export, save-to-Photos, LUT generation, or backend behavior occurs.

Known TODOs:

- [ ] Filter Generator currently remains mock-only and does not perform real local heuristic analysis.
- [ ] Generated filter recipe visual quality and recipe-to-filter mapping may need tuning.
- [ ] F2 can add local histogram / palette / preset-family extraction later.
- [ ] F3 / real backend AI remains blocked until Cloud AI boundary work is explicitly implemented.
- [ ] LUT generation is not implemented.
- [ ] Generated mock filters are session-only and are not saved, synced, exported, or added to the permanent catalog.
- [ ] Custom filter persistence is not implemented.

## Phase 16E Static Pose Overlay MVP

Check:

- [x] Added 8 static pose guide definitions.
- [x] Added Pose button to the Camera capture surface.
- [x] R1 moved Pose button out of the top bar so it does not collide with Dynamic Island / status area.
- [x] Added Pose quick picker with title, category, hint, and selected state.
- [x] Added a passive SwiftUI pose overlay layer above the camera preview.
- [x] R1 makes the pose overlay render over camera unavailable / Simulator fallback, not only authorized camera preview.
- [x] R1 increases placeholder outline visibility with warm-white line art and higher opacity.
- [x] Added close pose control.
- [x] Added mirror pose control.
- [x] Confirmed source uses `.allowsHitTesting(false)` on the pose overlay.
- [x] Confirmed source uses `.accessibilityHidden(true)` on the decorative pose overlay.
- [x] Confirmed source does not add Vision body pose detection.
- [x] Confirmed source does not add AI pose suggestion.
- [x] Confirmed source does not add persistence, upload, export, Firebase, Gemini, OpenAI, StoreKit, or backend changes.
- [x] Updated English and Traditional Chinese localization strings.

Manual Xcode / Simulator acceptance on 2026-06-11:

- [x] Launch the app and confirm Camera opens normally.
- [x] Confirm the compact Pose button is visible in the lower-left viewfinder tool area and is not blocked by Dynamic Island / status area.
- [x] Tap Pose and confirm the pose picker opens.
- [x] Confirm only one camera callout / picker is open at a time.
- [x] Select a pose and confirm a semi-transparent pose outline appears on the viewfinder.
- [x] On Simulator / camera unavailable fallback, confirm the selected pose outline is visible over the fallback canvas.
- [x] Confirm the overlay does not block shutter tapping.
- [x] Confirm shutter remains visible and tappable.
- [x] Confirm AI Snapshot, filter, guidance, lens, timer, flash, and flip controls are not blocked by the overlay.
- [x] Confirm existing AI Snapshot, guidance, filter, and lens callouts still work.
- [x] Tap mirror / 左右反轉 and confirm the overlay flips horizontally.
- [x] Tap close and confirm the overlay hides.
- [x] Confirm Camera does not require scrolling in capture mode.
- [x] Confirm source still keeps the overlay as a SwiftUI UI layer, separate from the existing capture output path.
- [x] Confirm no Vision body pose, real AI, network, upload, persistence, or export behavior is present.
- [x] Confirm English and Traditional Chinese UI show no obvious raw localization keys.

Known TODOs:

- [ ] Current in-code placeholder pose line art is visually rough and accepted only for the Phase 16E MVP.
- [ ] Replace placeholder pose outlines with original or commercially licensed PDF/vector pose assets in a later dedicated artwork phase.
- [ ] Add a better pose gallery and broader categories in a later phase.
- [ ] Tune default scale / offset / opacity on real iPhone sizes after visual review.
- [ ] Keep Pose categories inclusive and unrestricted; do not add user gender/body classification.
- [ ] AI pose suggestion and Vision body pose matching remain future phases.

## Phase 16A-R10

Check:

- [x] Confirmed R9 metrics were used by `MainTabShellView`, but ordinary tab bar placement still lived inside bottom `safeAreaInset`.
- [x] Confirmed the main visual risk was the bottom inset container / placement path, not Camera rail sharing.
- [x] Replaced ordinary-page tab bar `safeAreaInset` placement with a root `ZStack` bottom overlay.
- [x] Added explicit ordinary tab bar estimated height, bottom fallback, bottom clearance, and content bottom padding metrics.
- [x] Kept Inspiration, History, and Settings on the ordinary floating tab bar overlay path.
- [x] Kept Camera on the separate fullscreen path and did not alter the Camera viewfinder layout.
- [x] Preserved shared ordinary content bottom padding for Inspiration and History.
- [x] Preserved shared Settings footer spacer.
- [x] Removed accidental `ios-app/AIPhotoApp/App/File.txt` prompt dump.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R10-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Switch to Inspiration and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Switch to History and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Switch to Settings and confirm the floating tab bar is complete and not clipped by the bottom edge.
- [ ] Confirm ordinary tab bar icon, label, and selected pill are fully visible.
- [ ] Confirm ordinary tab bar bottom has clear distance from the home indicator / screen edge.
- [ ] Confirm Inspiration bottom content can scroll above the floating tab bar.
- [ ] Confirm History empty state / list bottom can scroll above the floating tab bar.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Camera layout was not degraded by the ordinary tab bar fix.
- [ ] Confirm Camera shutter remains visible and tappable.
- [ ] Confirm Inspiration remains one-tap reachable from Camera mode rail and ordinary tab bar.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate the hard overlay placement on target iPhone simulator screenshots.
- [ ] Tune ordinary bottom offset only after confirming the tab bar is no longer clipped.

## Phase 16A-R9

Check:

- [x] Split ordinary-page and Camera bottom navigation metrics more clearly.
- [x] Raised ordinary-page floating tab bar bottom spacing above the home indicator.
- [x] Added shared ordinary content footer inset for Inspiration ScrollView content.
- [x] Added shared ordinary content footer inset for History ScrollView content.
- [x] Increased Settings final footer spacer through the same shared metric.
- [x] Added a minimum Camera compact mode rail home-indicator clearance.
- [x] Kept Camera mode rail on separate fullscreen metrics from ordinary floating tab bar spacing.
- [x] Preserved Camera viewfinder structure without wrapping the capture page in a ScrollView.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, `HomeView.swift`, `HistoryView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R9-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm ordinary-page floating tab bar is visibly above the home indicator.
- [ ] Confirm ordinary tab bar icon, label, and selected pill are fully visible.
- [ ] Confirm Inspiration bottom content can scroll above the floating tab bar.
- [ ] Confirm History empty state / list bottom can scroll above the floating tab bar.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Camera compact mode rail is fully visible and does not overlap the home indicator.
- [ ] Confirm Camera compact mode rail does not block shutter or shutter hit testing.
- [ ] Confirm Camera viewfinder is not visibly shrunk by this safe-area polish.
- [ ] Confirm Inspiration remains one-tap reachable from Camera mode rail and ordinary tab bar.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate ordinary tab bar lift on iPhone simulator screenshots; tune if it feels too high or too low.
- [ ] Validate Camera compact mode rail clearance on physical devices with different home-indicator safe areas.

## Phase 16A-R8

Check:

- [x] Added Camera-only status bar hiding at the app shell level.
- [x] Confirmed Inspiration, History, and Settings stay on the ordinary content-page path with normal status bar behavior.
- [x] Added a Camera-specific top control inset metric for Live Guidance mode, flash, and timer controls.
- [x] Lifted ordinary-page floating tab bar spacing above the home indicator.
- [x] Kept Settings footer spacer so the bottom subscription / polish CTA can remain above the tab bar.
- [x] Kept Camera compact mode rail on separate fullscreen metrics from the ordinary floating tab bar.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R8-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera hides the iOS status bar: no time, Wi-Fi, or battery indicators are visible on Camera.
- [ ] Confirm Inspiration, History, and Settings still show the normal iOS status bar.
- [ ] Confirm Camera top controls do not collide with Dynamic Island / top screen edge after status bar hiding.
- [ ] Confirm ordinary-page floating tab bar is lifted and icon / label are fully visible.
- [ ] Confirm Settings bottom subscription / polish row is fully visible and tappable when scrolled to the bottom.
- [ ] Confirm Inspiration / History / Settings content bottom padding is reasonable and not excessive.
- [ ] Confirm Camera compact mode rail is still separate from ordinary tab bar spacing and does not block shutter.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm Camera does not require scrolling.
- [ ] Confirm expanded guidance, AI Snapshot sheet, filter sheet, and lens dropdown do not overlap each other.
- [ ] Confirm AI Snapshot / consent / mock result still works.
- [ ] Confirm Mock / Local guidance still works.
- [ ] Confirm timer, flash, flip, capture, lens dropdown, filters, mock save, mock AI, local history, History, and Settings still work.
- [ ] Confirm localization has no raw keys.
- [ ] Confirm no real network / upload / AI / Firebase / StoreKit / persistence / export behavior.

Known TODOs:

- [ ] Validate Camera-only status bar hiding in Xcode / Simulator because it is a visual runtime behavior.
- [ ] Tune ordinary floating tab bar lift after device screenshots if it now feels too high or too low.
- [ ] Validate Dynamic Island / notch spacing on physical devices after the status bar hidden pass.

## Phase 16A-R7

Check:

- [x] Raised ordinary-page floating tab bar bottom fallback spacing.
- [x] Kept Settings footer spacer so bottom subscription / polish CTA can remain above the tab bar.
- [x] Added more Camera top safe-area clearance for guidance mode, flash, and timer controls.
- [x] Split Camera filter and guidance overlay bottom metrics into separate vertical slots.
- [x] Kept AI Snapshot, shutter, flip camera, and lens dropdown in the same bottom control band.
- [x] Lifted the lens dropdown callout slightly higher around the flip / lens controls.
- [x] Added Camera compact mode rail shadow to better match ordinary floating tab bar styling.
- [x] Preserved Camera primary capture path without `NavigationStack`.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R7-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera top controls do not collide with the status bar, Dynamic Island, time, Wi-Fi, or battery indicators.
- [ ] Confirm filter pill and guidance pill do not overlap.
- [ ] Confirm expanded guidance, AI Snapshot sheet, filter sheet, and lens dropdown do not overlap each other.
- [ ] Confirm AI Snapshot, shutter, flip camera, and lens dropdown feel aligned as one bottom control band.
- [ ] Confirm shutter remains visible and tappable.
- [ ] Confirm Camera compact mode rail does not block shutter.
- [ ] Confirm Camera does not require scrolling.
- [ ] Confirm Camera viewfinder remains larger than the pre-R6 layout.
- [ ] Switch to Inspiration, History, and Settings.
- [ ] Confirm ordinary floating tab bar is fully visible and no longer clipped by the bottom edge / home indicator.
- [ ] Confirm Settings bottom subscription / polish CTA remains fully visible and tappable.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R6

Check:

- [x] Ran source-to-simulator read-only checks: `git status --short`, `git diff --stat`, and diffs for `MainTabShellView.swift`, `AppTabBarMetrics.swift`, and `CameraView.swift`.
- [x] Confirmed `AIPhotoApp` launches `AppRootView`, which launches `MainTabShellView`.
- [x] Confirmed `MainTabShellView` no longer uses native `TabView`.
- [x] Confirmed `AppTabBarMetrics.swift` is under the filesystem-synchronized `AIPhotoApp` Xcode root group.
- [x] Confirmed sandboxed `xcodebuild` frontend compile input includes `AppTabBarMetrics.swift`.
- [x] Confirmed `CameraView.swift` uses `AppTabBarMetrics` for Camera bottom rail / control / overlay spacing.
- [x] Confirmed Camera primary capture path no longer runs inside `NavigationStack`.
- [x] Confirmed selected/imported photo flow still uses navigation chrome for Back / Clear controls.
- [x] Converted non-Camera bottom navigation from overlay-style drawing to `safeAreaInset`.
- [x] Added a Settings `List` footer spacer so the bottom CTA row can scroll above the tab bar.
- [x] Tightened Camera rail / shutter / overlay metrics for a more visible bottom-space change.
- [x] Preserved Inspiration as a one-tap destination.
- [x] Preserved Camera capture UI with no Photo Picker / Choose Photo entry.
- [x] Preserved Inspiration photo import entry at source level.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed during implementation.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, `CameraView.swift`, and `SettingsView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Layout modifier scan confirmed the primary Camera capture path no longer uses `NavigationStack`; remaining Camera `NavigationStack` usage is selected/imported photo flow and sheets.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] The failed sandboxed Xcode frontend command included `AppTabBarMetrics.swift`, confirming it is part of the target compile input.
- [x] Unsandboxed command-line Xcode build was requested but rejected by the current workspace credits limit.

Manual Xcode check on simulator / device:

- [ ] Clean build / run the app. If UI still looks stale, clear DerivedData or uninstall the simulator app, then run again.
- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera bottom rail is visibly lower than Phase 16A-R5.
- [ ] Confirm Camera bottom black empty space is visibly reduced.
- [ ] Confirm Camera viewfinder feels larger / more fullscreen.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Settings and scroll to the bottom.
- [ ] Confirm the subscription / polish CTA row is fully visible and tappable above the bottom tab bar.
- [ ] Confirm Inspiration and History final content is not covered by the bottom tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R5

Check:

- [x] Investigated `MainTabShellView` bottom overlay and content-page inset behavior.
- [x] Investigated `CameraView` bottom control / mode rail flow layout.
- [x] Investigated Inspiration, History, and Settings content-page bottom spacing.
- [x] Added shared `AppTabBarMetrics` for content-page and Camera navigation spacing.
- [x] Non-Camera pages use the shared bottom content inset instead of an inline `86` point spacer.
- [x] Camera does not use the ordinary content-page bottom inset.
- [x] Camera shutter controls and compact mode rail are separate bottom overlays.
- [x] Camera compact mode rail can sit lower without pushing the shutter row upward.
- [x] Camera bottom gradients were reduced to reclaim more viewfinder area.
- [x] Inspiration remains one tap away from Camera.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Targeted `swiftc -parse` passed for `AppTabBarMetrics.swift`, `MainTabShellView.swift`, and `CameraView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R5-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera no longer has a large empty black area below the compact mode rail.
- [ ] Confirm Camera viewfinder feels larger than Phase 16A-R4.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Settings and scroll to the bottom.
- [ ] Confirm the subscription / polish CTA row is fully visible and tappable above the floating tab bar.
- [ ] Confirm Inspiration and History final content is not covered by the floating tab bar.
- [ ] Confirm tab labels, icons, selected color, and rounded styling feel consistent across Camera rail and ordinary floating tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R4

Check:

- [x] Replaced native `TabView` app shell with a custom tab switcher.
- [x] Camera screen no longer uses the ordinary content-page floating tab bar.
- [x] Camera keeps its own compact mode rail.
- [x] Camera compact mode rail uses matching icon / label / accent styling.
- [x] Inspiration, History, and Settings use a custom floating tab bar.
- [x] Non-camera pages reserve bottom content space so floating tab bar does not cover content.
- [x] Camera bottom inset was tightened after removing ordinary tab-bar reservation from Camera.
- [x] Camera still starts as the primary screen.
- [x] Inspiration remains one tap away from Camera.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved filter pill, lens dropdown, flash, timer, flip, capture, 20 filters, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Targeted `swiftc -parse` passed for `MainTabShellView.swift` and `CameraView.swift`.
- [x] English and Traditional Chinese localization lint passed.
- [x] Forbidden imports scan passed for Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no iOS Swift `URLSession`, `URLRequest`, `WebSocket`, real upload, Firebase Storage, Firestore, Cloud Functions, Gemini, OpenAI, or StoreKit integration.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- [x] Frame / photo persistence scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions; no Phase 16A-R4-specific Swift source error was confirmed.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera no longer shows / reserves the ordinary floating tab bar area.
- [ ] Confirm Camera bottom black empty space is visibly reduced.
- [ ] Confirm Camera viewfinder feels larger than Phase 16A-R3.
- [ ] Confirm shutter is visible and tappable.
- [ ] Confirm Camera compact rail does not block shutter.
- [ ] Confirm Camera compact rail can navigate to Inspiration, History, and Settings in one tap.
- [ ] Switch to Inspiration and confirm the content-page floating tab bar appears.
- [ ] Confirm Inspiration content is not covered by the floating tab bar.
- [ ] Confirm History and Settings content are not covered by the floating tab bar.
- [ ] Confirm selected tab color / icon / label language feels consistent across Camera rail and ordinary floating tab bar.
- [ ] Confirm Inspiration photo import still opens selected/imported photo workflow.
- [ ] Confirm Camera has no Photo Picker / Choose Photo entry.
- [ ] Confirm AI Snapshot, guidance, filter, and lens callouts do not overlap.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R3

Check:

- [x] Added a single active camera callout state for guidance, AI Snapshot, filter, and lens.
- [x] Live Guidance compact pill and expanded card are mutually exclusive.
- [x] Expanded Live Guidance sits in the lower-right viewfinder area.
- [x] Filter pill remains in the lower-left viewfinder area and uses a separate overlay slot.
- [x] Opening AI Snapshot collapses Live Guidance and other camera callouts.
- [x] Opening filter picker collapses Live Guidance and marks filter as the active callout.
- [x] Lens selector uses a compact custom dropdown strip near flip camera.
- [x] Lens dropdown auto-collapses after lens selection.
- [x] Flash, timer, flip camera, and guidance mode controls collapse active callouts.
- [x] Bottom inset and overlay offsets were tightened again to reduce empty black space.
- [x] Camera capture mode still does not depend on vertical scrolling.
- [x] Shutter remains fixed in the bottom-center camera controls at source level.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration remains the visible photo import entry point.
- [x] Preserved AI Snapshot mock-only service boundary, consent, success, failed, and unavailable states at source level.
- [x] Preserved Mock / Local guidance, Phase 15B brightness, Phase 15C face framing, and Phase 15D stability logic at source level.
- [x] Preserved 20 filters / grouping, mock save, mock AI, local history, History, Settings, and localization at source level.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode build was not retried because the prior escalation path was rejected by the current Codex usage/credits limit.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera capture mode has no vertical scroll.
- [ ] Confirm shutter is visible and tappable.
- [ ] Tap Live Guidance and confirm the compact pill is replaced by one expanded card, not stacked with a second guidance card.
- [ ] Confirm expanded Live Guidance does not overlap the filter pill.
- [ ] Confirm filter pill remains lower-left in the viewfinder.
- [ ] Tap filter and confirm guidance collapses while the grouped filter picker opens.
- [ ] Tap AI Snapshot and confirm guidance / lens callouts collapse before consent / result UI appears.
- [ ] Tap lens control and confirm only the lens dropdown appears.
- [ ] Select 24mm / 35mm / 77mm and confirm the lens dropdown closes.
- [ ] Confirm bottom black empty space is reduced versus Phase 16A-R2 Final.
- [ ] Confirm mode rail remains thin and does not block shutter.
- [ ] Confirm Inspiration / History / Settings remain one tap away.
- [ ] Confirm Timer Off / 3s / 5s / 10s still works.
- [ ] Confirm front-camera mock + flash screen-flash scaffold still works.
- [ ] Confirm Photo import from Inspiration still opens selected/imported photo workflow.
- [ ] Test filters, mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R2 Final

Check:

- [x] Camera capture mode still uses a fullscreen native-camera-style canvas and does not depend on vertical scrolling to reach shutter.
- [x] Viewfinder space was increased by reducing persistent camera chrome.
- [x] Bottom gradient height and opacity were reduced so the lower camera area feels less like empty black space.
- [x] Guidance / filter overlay offsets were moved closer to the shutter controls without covering the shutter.
- [x] Bottom capture rail height, bottom padding, and mode rail spacing were tightened.
- [x] The always-visible `24mm / 35mm / 77mm` lens strip was removed from the lower camera chrome.
- [x] Lens selection is now a compact menu near the flip camera control.
- [x] Lens selection continues to use existing mock lens state only.
- [x] Timer Off no longer displays a visible `Off` / `關` label below the icon.
- [x] Timer selections 3s, 5s, and 10s display inside the timer control.
- [x] Flash and timer remain top controls and are not duplicated beside the shutter.
- [x] AI Snapshot remains a compact shutter-side button.
- [x] AI Snapshot still opens mock-only consent / result UI only after explicit tap.
- [x] Live Guidance remains a compact lower-preview pill and expands only when tapped.
- [x] Filter entry remains a translucent lower-left viewfinder pill showing the current preset.
- [x] Filter picker still opens as a sheet and preserves 20 filters / grouping.
- [x] Camera capture UI still has no Photo Picker / Choose Photo entry.
- [x] Inspiration, History, and Settings are one tap away through the bottom mode rail.
- [x] Inspiration remains the visible photo import entry point.
- [x] Front-camera + flash screen-flash scaffold remains present.
- [x] Mock / Local guidance modes remain available.
- [x] Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability remain in place.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Final unsandboxed command-line Xcode simulator build could not be completed because escalation was rejected by the current Codex usage/credits limit.
- [x] Earlier Phase 16A-R2 unsandboxed command-line Xcode simulator build succeeded before the final bottom-spacing adjustment.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera feels like a fullscreen native-camera-style surface, not a scrolling app page.
- [ ] Confirm viewfinder feels larger than Phase 16A-R / earlier Phase 16A-R2 attempts.
- [ ] Confirm bottom black empty space is visibly reduced.
- [ ] Confirm viewfinder bottom feels closer to the shutter controls.
- [ ] Confirm no vertical scroll is needed to press shutter.
- [ ] Confirm shutter is visible and tappable at bottom center.
- [ ] Confirm bottom tab / mode rail does not block the shutter.
- [ ] Confirm Inspiration is one tap away and not hidden only in a three-dot menu.
- [ ] Confirm Camera capture UI has no Photo Picker / Choose Photo entry.
- [ ] Confirm photo import from Inspiration still opens selected/imported photo workflow.
- [ ] Confirm filter pill appears at the lower-left of the viewfinder and opens the grouped filter picker.
- [ ] Confirm selected filter state is preserved after using the filter picker.
- [ ] Confirm compact lens button appears near flip camera and opens 24mm / 35mm / 77mm options.
- [ ] Confirm choosing a lens updates the compact lens label and closes the menu.
- [ ] Confirm timer Off shows only the timer icon.
- [ ] Confirm timer 3s / 5s / 10s displays inside the timer control and capture countdown still works.
- [ ] Confirm AI Snapshot appears near the shutter as a compact button.
- [ ] Tap AI Snapshot and confirm consent / success / failed / unavailable mock paths still work.
- [ ] Confirm Live Guidance appears as a compact pill and expands only when tapped.
- [ ] Confirm Mock / Local guidance modes still work.
- [ ] Confirm Phase 15B / 15C / 15D guidance remains stable.
- [ ] Confirm front-camera mock + flash shows the screen-flash scaffold during capture.
- [ ] Capture a mock photo and confirm selected-photo Back to Camera / Clear remains visible.
- [ ] Test mock save, mock AI, local history, History, Settings, and Inspiration.
- [ ] Confirm English / Traditional Chinese UI does not show raw localization keys.
- [ ] Confirm no real upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.

## Phase 16A-R

Check:

- [x] Camera capture mode uses a fullscreen native-camera-style canvas instead of a card stack.
- [x] Camera capture mode does not depend on vertical scrolling to reach shutter.
- [x] Bottom tab bar is hidden while shooting so it cannot cover the shutter.
- [x] A compact top menu preserves navigation to Inspiration, History, and Settings while the Camera tab bar is hidden.
- [x] Shutter is fixed at bottom center in the camera overlay.
- [x] AI Snapshot is a compact button beside the shutter.
- [x] AI Snapshot still opens mock-only consent / result UI only after explicit tap.
- [x] Live Guidance defaults to a compact lower-preview pill.
- [x] Live Guidance can expand into the existing short callout.
- [x] Filter entry is a translucent lower-left viewfinder button showing the current preset.
- [x] Filter picker opens as a sheet and preserves 20 filters / grouping.
- [x] Camera capture UI does not show a Photo Picker / Choose Photo entry.
- [x] Inspiration remains the photo import entry point.
- [x] Timer options remain Off, 3s, 5s, and 10s.
- [x] Front-camera + flash screen-flash scaffold remains present.
- [x] Mock / Local guidance modes remain available.
- [x] Phase 15B brightness guidance, Phase 15C face framing / headroom guidance, and Phase 15D stability remain in place.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Localization lint passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Vision / face safety scan confirmed no new Vision request type, face recognition, identity inference, or sensitive inference behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm Camera feels fullscreen and not like a scrolling app page.
- [ ] Confirm no vertical scroll is needed to press shutter.
- [ ] Confirm bottom tab bar does not cover shutter in Camera shooting mode.
- [ ] Confirm shutter is visible and tappable at bottom center.
- [ ] Confirm the top menu can navigate to Inspiration, History, and Settings.
- [ ] Confirm flash and timer controls are reachable near the top.
- [ ] Confirm Timer options Off, 3s, 5s, and 10s work.
- [ ] Confirm front-camera mock + flash shows the screen-flash scaffold during capture.
- [ ] Confirm AI Snapshot appears beside the shutter as a compact control.
- [ ] Tap AI Snapshot and confirm consent / success / failed / unavailable mock paths still work.
- [ ] Confirm Live Guidance appears as a compact pill and expands only when tapped.
- [ ] Confirm Mock / Local guidance modes still work.
- [ ] Confirm local brightness / face framing / stability behavior remains normal.
- [ ] Confirm filter button appears in the lower-left of the viewfinder.
- [ ] Tap filter and confirm the 20-filter grouped picker works.
- [ ] Confirm Camera tab has no Photo Picker / Choose Photo CTA.
- [ ] Open Inspiration and import one photo.
- [ ] Confirm imported photo opens the selected-photo workflow.
- [ ] Confirm selected-photo Back to Camera / Clear still works.
- [ ] Run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no real network call, upload, Firestore write, Storage write, Cloud Functions call, Gemini/OpenAI call, StoreKit, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Physical iPhone testing remains needed for shutter hit testing, safe-area spacing, filter button position, and tab-bar hiding behavior.
- [ ] Top camera navigation menu is a scaffold while Camera hides the tab bar.
- [ ] Screen flash is UI-only scaffold; no real front-camera hardware flash sync is implemented.
- [ ] AI Snapshot remains mock-only; real cloud snapshot guidance is deferred to a later explicit Phase 16B / 17.

## Phase 16A

Check:

- [x] Camera capture mode uses a one-screen-first layout rather than an always-scrolling capture surface.
- [x] Selected-photo / imported-photo mode remains scrollable for filter preview, mock save, and mock AI content.
- [x] Live Guidance defaults to a compact expandable pill / short bar.
- [x] Live Guidance can expand to the existing short camera-style callout.
- [x] Mock / Local guidance modes remain available.
- [x] Guidance toggle remains available.
- [x] Phase 15B brightness guidance remains wired through the Local guidance provider.
- [x] Phase 15C face framing / headroom guidance remains wired through the Local guidance provider.
- [x] Phase 15D stability / priority / anti-flicker layer remains in the Local guidance path.
- [x] AI Snapshot defaults to a compact entry instead of a persistent long panel.
- [x] AI Snapshot opens a consent / result sheet only after explicit user tap.
- [x] AI Snapshot keeps mock-only success, failed, and unavailable states.
- [x] Camera controls no longer show a Photo Picker / Choose Photo entry.
- [x] Inspiration tab now provides the photo import entry.
- [x] Inspiration import opens the existing selected-photo flow with filters, mock save, mock AI, and local history.
- [x] Front-camera + flash has a local screen-flash scaffold.
- [x] Timer options now support Off, 3 seconds, 5 seconds, and 10 seconds.
- [x] Timer selection is visible on the camera control.
- [x] Filter picker remains available through the Camera filter entry and now opens as a sheet.
- [x] Preserved 20 filters / grouping.
- [x] Preserved mock save, mock AI, local session history, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Network / upload behavior scan found no new real network or upload behavior.
- [x] Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, or Firebase config.
- [x] Persistence / export scan found no new UserDefaults, Core Data, SwiftData, file write, export, or save-to-Photos behavior.
- [x] Frame / photo safety scan found only expected existing in-memory local guidance analyzer references and Phase 16 mock consent copy.
- [x] Vision / face safety scan confirmed no new Vision request type, face recognition, identity inference, or sensitive inference behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator / device:

- [ ] Launch the app and confirm Camera is the primary screen.
- [ ] Confirm the Camera capture screen can reach preview, lens selector, filter entry, guidance entry, AI Snapshot entry, timer, flash, flip, and shutter without routine vertical scrolling on a normal iPhone viewport.
- [ ] Confirm selected-photo / imported-photo mode still scrolls normally and keeps fixed Back to Camera / Clear visible.
- [ ] Confirm Live Guidance appears as a compact pill by default.
- [ ] Tap Live Guidance and confirm the short callout expands / collapses.
- [ ] Toggle Mock / Local guidance and confirm both modes still work.
- [ ] Confirm local brightness / face framing hints still appear when available.
- [ ] Tap AI Snapshot and confirm consent appears in the sheet.
- [ ] Run mock AI Snapshot success, failure, and unavailable paths.
- [ ] Confirm Camera no longer has a Photo Picker / Choose Photo entry.
- [ ] Open Inspiration and import one photo.
- [ ] Confirm imported photo opens the existing selected-photo flow.
- [ ] Apply filters to the imported photo.
- [ ] Run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Switch to front-camera mock, enable flash, and capture to verify the screen-flash scaffold.
- [ ] Open Timer and select Off, 3s, 5s, and 10s.
- [ ] Confirm timer countdown integrates with capture.
- [ ] Confirm 20 filters / grouping still work.
- [ ] Open History and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no real network call, upload, Firestore write, Storage write, Cloud Functions call, Gemini/OpenAI call, StoreKit, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Physical iPhone testing remains needed for one-screen layout, timer ergonomics, and screen-flash timing.
- [ ] Screen flash is UI-only scaffold; no real front-camera hardware flash sync is implemented.
- [ ] AI Snapshot remains mock-only; real cloud snapshot guidance is deferred to a later explicit Phase 16B / 17.
- [ ] The mock lens selector still does not switch real iPhone lenses.

## Phase 16

Check:

- [x] Added a compact AI snapshot / AI Quick Advice entry to the Camera capture surface.
- [x] Required explicit user tap before showing the Phase 16 consent panel.
- [x] Required explicit user action in the consent panel before mock analysis starts.
- [x] Added consent copy explaining that a future real cloud version would send one snapshot to an AI service.
- [x] Added consent copy explaining Phase 16 is mock-only and uploads nothing.
- [x] Added consent copy explaining there is no background upload and no continuous video stream.
- [x] Added consent copy explaining no photo or request payload is saved.
- [x] Added consent copy explaining no provider API key is stored in the iOS app.
- [x] Added `CloudSnapshotGuidanceService` as a service protocol boundary.
- [x] Added `MockCloudSnapshotGuidanceService` with mock success, failure, and unavailable outcomes.
- [x] Added `CloudSnapshotGuidanceState` for idle, consent, preparing, analyzing, result, failed, and unavailable states.
- [x] Kept the Phase 16 request model derived-only and memory-only.
- [x] Did not add raw image, base64, pixel buffer, sample buffer, selected photo, or serialized request payload to the Phase 16 request model.
- [x] Kept mock cloud response short and camera-like.
- [x] Preserved Mock guidance mode.
- [x] Preserved Local guidance mode.
- [x] Preserved Phase 15B brightness guidance.
- [x] Preserved Phase 15C face framing / headroom guidance.
- [x] Preserved Phase 15D stability / priority behavior.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Final forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Final Vision scan still found Vision only in the existing local face analyzer file.
- [x] Final network / upload behavior scan found no Phase 16 real network, upload, Firebase, Cloud Functions, Gemini/OpenAI, or StoreKit behavior.
- [x] Final secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Final forbidden behavior scan found only existing placeholder docs/strings and existing local/mock scaffolds, not Phase 16 real service behavior.
- [x] Final frame / photo persistence scan found no Phase 16 raw frame/photo/request payload storage, upload, stream, persistence, or logging behavior.
- [x] Final face safety scan found no face recognition, identity inference, sensitive inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [ ] Launch the app.
- [ ] Confirm Camera is still the primary screen.
- [ ] Confirm Mock / Local guidance mode can be switched.
- [ ] Confirm Local guidance and stability still work.
- [ ] Tap AI Quick Advice / AI 構圖建議.
- [ ] Confirm consent / privacy copy appears before mock analysis.
- [ ] Confirm mock analysis starts only after the explicit run action.
- [ ] Confirm mock result shows short suggestions, not a chat UI.
- [ ] Confirm mock failure state is visible and recoverable.
- [ ] Confirm mock unavailable state is visible and recoverable.
- [ ] Confirm no real network request, upload, API key, Firebase config, or backend behavior exists.
- [ ] Confirm guidance overlay remains below the viewfinder and does not block the main preview.
- [ ] Confirm Dazz-like camera layout remains normal.
- [ ] Confirm mock lens selector remains normal.
- [ ] Confirm flash / timer / flip / capture remain normal.
- [ ] Confirm Photo Picker import remains normal.
- [ ] Confirm selected-photo Back to Camera / Clear remains normal.
- [ ] Confirm 20 filters / grouping remain normal.
- [ ] Confirm mock save, mock AI, and local history remain normal.
- [ ] Confirm Inspiration, History, and Settings remain normal.
- [ ] Confirm English / Traditional Chinese localization shows no raw keys.
- [ ] Confirm no raw frames, selected photos, request payloads, or face data are stored, uploaded, streamed, persisted, or logged.
- [ ] Confirm no face recognition, identity inference, sensitive inference, Gemini Live, cloud AI, voice, ASR, Parakeet, Firebase Storage / Firestore / Cloud Functions, StoreKit, persistence, export, or save-to-Photos behavior was added.

Known TODOs:

- [ ] Real cloud AI guidance remains deferred to a later explicit Phase 16B / 17.
- [ ] Future real cloud integration requires backend proxy / server-issued credential design, privacy review, pricing/rate-limit review, quota strategy, cancellation behavior, and App Store review.
- [ ] Phase 16 does not capture, serialize, upload, persist, or analyze a real snapshot.

## Phase 15D

Check:

- [x] Added a memory-only Local guidance stability controller.
- [x] Added priority ordering for existing Local guidance suggestions.
- [x] High-priority hints cover too dark, too bright, face too close, and face too far.
- [x] Medium-priority hints cover low headroom and subject off-center.
- [x] Low-priority hints cover warm filter, portrait-ready, balanced lighting, and fallback suggestions.
- [x] Added repeat cooldown to reduce short-interval duplicate suggestions.
- [x] Added confirmation count before replacing the current stable suggestion.
- [x] Added short hold behavior when signals disappear briefly.
- [x] Limited Local guidance to at most two visible suggestions.
- [x] Limited Mock guidance display to at most two visible suggestions.
- [x] Preserved Mock guidance mode.
- [x] Preserved Local guidance mode.
- [x] Preserved Phase 15 sample/fallback local suggestions.
- [x] Preserved Phase 15B brightness guidance.
- [x] Preserved Phase 15C face framing / headroom guidance.
- [x] Did not modify `CameraCaptureService` frame sampling frequency.
- [x] Did not add a new frame analysis type.
- [x] Did not add a new Vision request type.
- [x] Did not modify `LiveGuidanceFaceAnalyzer`.
- [x] Did not store raw frames.
- [x] Did not store face rectangle history.
- [x] Did not log raw frames, base64, pixel buffers, sample buffers, or face rectangles.
- [x] Did not store, upload, stream, or persist raw frames or face data.
- [x] Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Confirmed no new user-facing localization keys were required.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import / request scan found `import Vision` and `VNDetectFaceRectanglesRequest` only in the existing `LiveGuidanceFaceAnalyzer.swift`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no new raw-frame storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Face safety scan found no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [ ] Launch the app.
- [ ] Confirm Camera is still the primary screen.
- [ ] Confirm Mock / Local guidance mode can be switched.
- [ ] Confirm Mock guidance mode still works and shows at most two suggestions.
- [ ] Confirm Local guidance mode still works.
- [ ] Confirm Phase 15B brightness guidance still works.
- [ ] Confirm Phase 15C face framing / headroom guidance still works.
- [ ] Move camera between dark and bright areas and confirm suggestions do not flicker aggressively.
- [ ] On a physical iPhone, move a face off-center, close, and far if available.
- [ ] Confirm suggestion changes feel stable and not too frequent.
- [ ] Confirm repeated suggestions are reduced.
- [ ] Confirm only one or two suggestions are shown.
- [ ] Confirm preview and capture remain responsive.
- [ ] Confirm guidance overlay stays below the viewfinder and does not block the main preview.
- [ ] Confirm Dazz-like camera layout remains normal.
- [ ] Confirm mock lens selector remains normal.
- [ ] Confirm flash / timer / flip / capture remain normal.
- [ ] Confirm Photo Picker import remains normal.
- [ ] Confirm selected-photo Back to Camera / Clear remains normal.
- [ ] Confirm 20 filters / grouping remain normal.
- [ ] Confirm mock save, mock AI, and local history remain normal.
- [ ] Confirm Inspiration, History, and Settings remain normal.
- [ ] Confirm English / Traditional Chinese localization shows no raw keys.
- [ ] Confirm no raw frames or face rectangles are stored, uploaded, streamed, persisted, or logged.
- [ ] Confirm no face recognition, identity inference, sensitive inference, or face rectangle history behavior was added.
- [ ] Confirm no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [ ] Confirm no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [ ] Confirm no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required to tune stability constants with real motion and lighting.
- [ ] Repeat cooldown, confirmation count, and hold duration may need future product tuning.
- [ ] Phase 16 remains blocked until Phase 15D is reviewed, committed, pushed, and read-only confirmed.

## Phase 15C

Check:

- [x] Added local Apple Vision face rectangle prototype.
- [x] Kept `import Vision` limited to the local face analyzer file.
- [x] Used Vision only for local face rectangle / bounding box detection.
- [x] Added derived local face framing signals for subject off-center, low headroom, face too close, face too far, and portrait framing ready.
- [x] Preserved Phase 15B brightness guidance for too dark, too bright, and balanced lighting.
- [x] Preserved Mock guidance mode.
- [x] Preserved Phase 15 sample/fallback local suggestions.
- [x] Kept frame analysis low-frequency through the existing Phase 15B path.
- [x] Kept analysis on the background frame signal queue with UI updates returning to the main thread.
- [x] Did not store face rectangles or face history.
- [x] Did not log raw frames, base64, pixel buffers, sample buffers, or face rectangles.
- [x] Did not store, upload, stream, or persist raw frames.
- [x] Did not add face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.
- [x] Preserved Camera as the first selected tab at source level.
- [x] Preserved Dazz-like compact viewport at source level.
- [x] Preserved mock lens selector at source level.
- [x] Preserved selected-photo Back to Camera / Clear at source level.
- [x] Preserved Photo Picker at source level.
- [x] Preserved 20 filters and filter grouping at source level.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings at source level.
- [x] Added English and Traditional Chinese localization for the stable portrait framing hint.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found `import Vision` only in `LiveGuidanceFaceAnalyzer.swift`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no raw-frame storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Face safety scan found no face recognition, identity inference, sensitive attribute inference, face data persistence, or face rectangle history implementation.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode / Simulator check:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed Mock / Local guidance mode can be switched.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode still works.
- [x] User confirmed Phase 15B brightness guidance still works.
- [x] User confirmed Apple Vision face rectangle / bounding box detection is only used for local face framing / headroom guidance.
- [x] User confirmed face framing hints can show short composition suggestions.
- [x] User confirmed hints do not flicker aggressively.
- [x] User confirmed preview and capture remain responsive, with no obvious lag.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed flash / timer / flip / capture remain normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames or face rectangles are stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive inference was added.
- [x] User confirmed no face rectangle history is stored or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required for Vision face rectangle behavior and preview-lag validation.
- [ ] Face framing thresholds may need tuning after real portrait testing.
- [ ] Phase 16 remains blocked until Phase 15C is reviewed, committed, pushed, and read-only confirmed.

## Phase 15B

Check:

- [x] Added first local real frame signal prototype for brightness only.
- [x] Frame signal analysis is enabled only while Local guidance is active in the camera preview.
- [x] Local frame sampling is throttled to roughly 1-2 samples per second.
- [x] Brightness analysis runs on a background queue.
- [x] UI guidance updates return to the main thread.
- [x] User confirmed Local guidance mode can show brightness / fallback suggestions in Xcode / Simulator.
- [x] User confirmed Simulator / camera-unavailable path falls back safely and does not crash.
- [x] Mock guidance mode still works at source level.
- [x] Phase 15 sample/fallback local suggestions still work when no frame signal is available at source level.
- [x] No Vision import was added.
- [x] No face rectangle / headroom analysis was added in this phase.
- [x] No raw frames, base64, pixel buffers, or sample buffers are logged.
- [x] No raw frames are stored, uploaded, streamed, or persisted.
- [x] Camera remains the first selected tab at source level.
- [x] Dazz-like compact viewport remains normal at source level.
- [x] Mock lens selector remains normal at source level.
- [x] selected-photo Back to Camera / Clear remains normal at source level.
- [x] Photo Picker remains normal at source level.
- [x] 20 filters and filter grouping remain normal at source level.
- [x] mock save, mock AI, local session history, Inspiration, History, and Settings remain normal at source level.
- [x] English and Traditional Chinese localization has Phase 15B keys.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found no `import Vision`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found only immediate in-memory brightness analysis references to sample / pixel buffers, with no storage, upload, stream, base64, raw-frame logging, or network behavior in Camera feature files.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed Mock / Local guidance mode can be switched.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode can show brightness / fallback suggestions.
- [x] User confirmed Simulator / camera-unavailable fallback does not crash.
- [x] User confirmed camera preview / capture has no obvious lag.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed flash / timer / flip / capture remain normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames are stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Physical iPhone testing remains required for real brightness behavior and preview-lag validation.
- [ ] Face rectangle / headroom / Vision analysis remains deferred.
- [ ] Brightness thresholds may need tuning after real-device testing.
- [ ] Phase 16 remains blocked until Phase 15B is reviewed, committed, pushed, and read-only confirmed.

## Phase 15

Check:

- [x] Added switchable Mock / Local live guidance modes.
- [x] Preserved the Phase 14 mock guidance provider.
- [x] Added local rule-based provider architecture.
- [x] Added local guidance sample/fallback signal model.
- [x] Added suggestion composer for local rule-based guidance.
- [x] Added local suggestions for too dark, too bright, subject centering, headroom, face too close, face too far, warm filter, and local signal unavailable fallback.
- [x] Kept Simulator behavior safe by using sample/fallback signals instead of live camera frame sampling.
- [x] Did not import Vision for this first local prototype.
- [x] Did not add AVFoundation video frame sampling.
- [x] Did not store, upload, stream, persist, or log raw frames.
- [x] Preserved Camera as the first selected tab.
- [x] Preserved Dazz-like compact viewport.
- [x] Preserved mock lens selector.
- [x] Preserved selected-photo Back to Camera / Clear.
- [x] Preserved Photo Picker.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, Inspiration, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Gemini Live, Gemini/OpenAI calls, Cloud Functions calls, Firebase Storage / Firestore integration, voice input, ASR, Parakeet, StoreKit, persistence, export, save-to-Photos, backend implementation, or secrets were intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, and StoreKit imports.
- [x] Vision import scan found no `import Vision`.
- [x] Secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Camera-scoped forbidden behavior scan passed.
- [x] Frame safety scan found no raw-frame storage, upload, stream, base64, pixel-buffer logging, or network behavior in Camera feature files.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [x] User manually verified app build / run in Xcode / Simulator on 2026-06-10.
- [x] User confirmed Camera is still the primary screen.
- [x] User confirmed the Mock / Local guidance mode chip is usable.
- [x] User confirmed Mock guidance mode still works.
- [x] User confirmed Local guidance mode shows sample / fallback local suggestions.
- [x] User confirmed Local mode does not analyze real frames.
- [x] User confirmed no Vision import was added.
- [x] User confirmed no AVFoundation video frame sampling was added.
- [x] User confirmed guidance overlay stays below the viewfinder and does not block the main preview.
- [x] User confirmed Dazz-like camera layout remains normal.
- [x] User confirmed mock lens selector remains normal.
- [x] User confirmed Photo Picker import remains normal.
- [x] User confirmed selected-photo Back to Camera / Clear remains normal.
- [x] User confirmed 20 filters / grouping remain normal.
- [x] User confirmed mock save, mock AI, and local history remain normal.
- [x] User confirmed Inspiration, History, and Settings remain normal.
- [x] User confirmed English / Traditional Chinese localization shows no raw keys.
- [x] User confirmed no raw frames are read, stored, uploaded, streamed, persisted, or logged.
- [x] User confirmed no Gemini Live, cloud AI, voice, ASR, or Parakeet was added.
- [x] User confirmed no Firebase Storage / Firestore / Cloud Functions / StoreKit / persistence / export / save-to-Photos behavior was added.
- [x] User confirmed no secrets, Firebase config, or API keys were added.

Known TODOs:

- [ ] Phase 15 local provider uses sample/fallback signals only; it does not analyze real frames yet.
- [ ] A future explicit phase may add throttled Apple Vision / AVFoundation frame sampling.
- [ ] Physical iPhone testing remains needed before any true live-frame analyzer ships.

## Phase 14

Check:

- [x] Added local/mock live guidance overlay to the Camera screen.
- [x] Added guidance toggle in the Camera status bar.
- [x] Added mock guidance states: off, idle, scanning, suggestion available, paused.
- [x] Added 1-3 local mock shooting suggestions.
- [x] Kept the overlay compact and camera-like instead of article/chat-style.
- [x] Kept overlay away from capture, filter picker, Photo Picker import, flash/timer/flip controls, and tab navigation.
- [x] Preserved Camera-first flow.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved Photo Picker fallback.
- [x] Preserved mock save, mock AI, local session history, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Secrets / config scan passed.
- [x] Forbidden behavior scan passed for new Vision, frame analysis, frame upload/stream/persistence, Gemini Live, voice, ASR, Parakeet, Firebase, AI, StoreKit, persistence, quota, or export behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm app enters the camera-first surface.
- [ ] Confirm the Camera status bar shows the guidance toggle.
- [ ] Toggle guidance off and confirm the overlay hides.
- [ ] Toggle guidance on and confirm the overlay appears.
- [ ] Tap the overlay state action and confirm idle, scanning, suggestion, and paused states are reachable.
- [ ] Confirm 1-3 short mock suggestions appear in suggestion state.
- [ ] Confirm capture button remains reachable.
- [ ] Confirm filter picker still opens.
- [ ] Confirm Photo Picker import still works.
- [ ] Confirm flash / timer / flip controls remain reachable.
- [ ] Confirm all 20 filters and grouping still work.
- [ ] Trigger mock save success and failure.
- [ ] Trigger mock AI success and failure.
- [ ] Confirm local session history still records sessions.
- [ ] Open History and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Phase 14 guidance is mock UX only, not real AI guidance.
- [ ] Phase 15 may prototype local rule-based / Apple Vision guidance only after explicit request.
- [ ] Future local providers, cloud snapshot guidance, Gemini Live, and voice / ASR remain later phases.
- [ ] Physical-device camera overlay readability and responsiveness should be checked on a real iPhone.

## Phase 21-M Quantization + Serving Benchmark Plan

Check:

- [x] Added `docs/quantization-serving-benchmark-plan.md` for planning/gate/source-audit only.
- [x] Added `npm run qa:open-weight-vlm:quantization-serving-benchmark-plan`.
- [x] Confirm the new gate validates policy objects only and reports `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, and `productionReady:false`.
- [x] Confirm future model candidates are documented as `Qwen3-VL-30B-A3B` future target candidate, Qwen2.5-VL reference baseline, alternative Qwen VLM fallback candidate, Qwen 9B vision-capable fallback, and text-only Qwen blocked for image analysis.
- [x] Confirm future serving candidates are documented as Transformers+FastAPI reference, vLLM primary benchmark candidate, SGLang structured-output/performance challenger, and Ollama/LM Studio manual-only.
- [x] Confirm future quantization dimensions include fp16/bf16, INT8, INT4, AWQ, GPTQ, and equivalent supported formats.
- [x] Confirm benchmark fixture policy blocks real user photos, raw photo reports, raw model output, raw prompts, image/base64/path logs, and unapproved large benchmark sets.
- [x] Confirm benchmark metrics policy allows sanitized aggregate buckets only and keeps `rawOutputPersisted:false`, `rawOutputPrinted:false`, and `productionReady:false`.
- [x] Confirm no serving benchmark runtime, model download, model switch, `local_model` enablement, vLLM/SGLang/Ollama call, Qwen inference, fixture inference, iOS runtime dependency, app-facing endpoint, production endpoint, raw artifact, secret, or production readiness change was added.

Manual Xcode check:

- [ ] Launch the app only if desired; runtime behavior should be unchanged.
- [ ] Confirm no local CV runtime, Camera cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, iOS WebSocket client runtime, iOS provider/model key/direct call, iOS upload payload change, capture-context upload, app-facing endpoint, production rollout, Windows local path dependency, or local model server URL dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-N-R0 resolves the missing ignored `smoke_001` fixture prerequisite only; any later one-call smoke attempt still requires explicit user approval.
- [ ] Serving benchmark execution, model downloads, vLLM/SGLang/Ollama runs, local model route enablement, and production rollout remain blocked until later explicit approval.

## Phase 14C

Check:

- [x] Added a fixed selected-photo Back to Camera / Clear action bar.
- [x] Kept the action bar visible without scrolling to the bottom of the selected-photo flow.
- [x] Back to Camera clears the selected image and returns to the camera preview / simulator fallback.
- [x] Clear clears the selected image and returns to the camera preview / simulator fallback.
- [x] Clearing a selected photo resets render, filter error, and mock save state for the selected-photo view.
- [x] Clearing a selected photo preserves the currently selected filter preset for the next capture/import.
- [x] Preserved Photo Picker re-import behavior.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, live guidance mock, lens selector, Inspiration, History, and Settings.
- [x] Updated English and Traditional Chinese localization strings for the selected-photo actions.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Refined secrets / config scan found no real secrets, Firebase config, API keys, or signing credentials.
- [x] Swift forbidden behavior scan found no Phase 14 Camera additions for Vision, frame analysis, Gemini Live, voice / ASR, Firebase, StoreKit, persistence, export, or save-to-Photos behavior.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm Camera is the first selected tab.
- [ ] Import a photo from the Camera tab.
- [ ] Confirm the selected-photo screen immediately shows Back to Camera / Clear controls near the top.
- [ ] Confirm the controls are visible without scrolling to the bottom of the selected-photo flow.
- [ ] Tap Back to Camera and confirm the app returns to the camera preview or simulator fallback.
- [ ] Import a photo again.
- [ ] Tap Clear and confirm the app returns to the camera preview or simulator fallback.
- [ ] Confirm Photo Picker can be used again after clearing.
- [ ] Confirm the current filter selection remains available for the next photo.
- [ ] Open filter picker and confirm 20 filters / grouping still work.
- [ ] Trigger mock save success and failure on a selected photo.
- [ ] Trigger mock AI success and failure on a selected photo.
- [ ] Confirm local session history records mock save / AI items.
- [ ] Confirm live guidance mock and lens selector still work in camera mode.
- [ ] Open Inspiration, History, and Settings.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Verify fixed selected-photo action bar spacing on small physical iPhone screens.
- [ ] Phase 14C does not change filter rendering, filter grouping, guidance logic, or real camera hardware behavior.

## Phase 14B

Check:

- [x] Kept Camera as the primary first tab.
- [x] Did not reintroduce a landing intro.
- [x] Moved live guidance below the framed viewport and above the shutter/control area.
- [x] Kept live guidance out of the main viewfinder.
- [x] Removed the large Camera title feel from the primary Camera tab context.
- [x] Replaced the visible `Local camera shell` copy with compact camera-style status chips.
- [x] Adjusted Camera layout toward a darker Dazz-like camera back with a compact framed viewport.
- [x] Added visible focal labels: 24mm, 35mm, 77mm.
- [x] Added mock lens selector UI scaffold.
- [x] Lens selector selection updates the focal label in memory only.
- [x] Lens selector does not perform real AVFoundation multi-lens hardware switching.
- [x] Preserved flash, timer, flip, capture, Photo Picker import, filter entry, and live guidance toggle.
- [x] Preserved 20 filters and filter grouping.
- [x] Preserved mock save, mock AI, local session history, History, and Settings.
- [x] Repositioned the former Guide tab as Inspiration / 靈感.
- [x] Removed Open Camera as the primary Guide / Inspiration CTA.
- [x] Updated English and Traditional Chinese localization strings.
- [x] `git diff --check` passed.
- [x] Forbidden imports scan passed for Firebase, Gemini, OpenAI, StoreKit, and Vision imports.
- [x] Secrets / config scan passed.
- [x] Swift code forbidden behavior scan passed for new Vision, frame analysis, frame upload/stream/persistence, Gemini Live, voice, ASR, Parakeet, Firebase, AI, StoreKit, persistence, quota, or export behavior.
- [x] Broader iOS diff scan only matched localization safety copy that says StoreKit / quota are not connected.
- [x] Sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec / SwiftUI Preview macro environment restrictions.
- [x] Unsandboxed command-line Xcode simulator build succeeded on 2026-06-10.
- [x] Confirmed no Apple Vision, frame analysis, frame reading, frame upload, frame streaming, frame persistence, Gemini Live, voice input, ASR, Parakeet, real Firebase, StoreKit, persistence, export, or backend implementation was intentionally added.

Manual Xcode check on simulator:

- [ ] Launch the app.
- [ ] Confirm Camera is the first selected tab.
- [ ] Confirm no landing intro appears.
- [ ] Confirm the Camera screen no longer shows a large `Camera` / `相機` page title.
- [ ] Confirm the main viewfinder is framed and compact, with dark camera chrome around it.
- [ ] Confirm the viewfinder has a visible focal label.
- [ ] Confirm the lens selector is visible.
- [ ] Tap 24mm, 35mm, and 77mm and confirm the focal label changes.
- [ ] Confirm lens selection does not break flip camera.
- [ ] Confirm guidance appears above the shutter/control area and not over the main viewfinder.
- [ ] Confirm guidance toggle still hides and shows guidance.
- [ ] Confirm capture button remains reachable.
- [ ] Confirm flash, timer, flip, Photo Picker import, and filter entry remain reachable.
- [ ] Open filter picker and confirm 20 filters / grouping still work.
- [ ] Capture or import a photo, then run mock save success and failure.
- [ ] Run mock AI success and failure.
- [ ] Confirm local session history records items.
- [ ] Open History and Settings.
- [ ] Open Inspiration and confirm it is no longer a camera-launch guide.
- [ ] Confirm Inspiration cards show shooting ideas, mock AI advice entry, filter inspiration, and future AI placeholders.
- [ ] Confirm no raw localization keys appear.
- [ ] Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

Known TODOs:

- [ ] Mock lens selector does not switch real device lenses.
- [ ] Physical-device layout should be checked for camera-shell proportions, control spacing, and one-handed reach.
- [ ] Future real camera capability detection can be considered only in a later explicit phase.
- [ ] Phase 15 remains blocked until Phase 14B is reviewed, committed, pushed, and read-only confirmed.
## Phase 21-Z Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls

Check:

- [x] Confirmed Phase 21-Z is docs/config-shape/security/operator-checklist only.
- [x] Added Asia-first RunPod A100 80GB deployment prep for Korea, Taiwan, and Hong Kong.
- [x] Added placeholder-only `backend/config/open-weight-vlm.runpod.example.json`.
- [x] Confirmed placeholder config contains buckets only and no raw URL, real region ID, provider ID, account ID, API key, SSH key, token, credential, model path, or secret.
- [x] Defined provider/GPU fallback policy: RunPod A100 Asia-near primary, H100 Asia-near short benchmark if needed, A100 US West fallback only, 48GB quantized experiment later, Vast.ai cheap experiment later, Lambda/AWS/GCP reliability/compliance/cost comparison later.
- [x] Defined no-model contract plan for healthz, no-model contract echo, no-model route-contract dry-run, fixture-token-only benchmark interface, and sanitized error buckets.
- [x] Added cloud security, network exposure, storage/cache, batch/queue startup-shutdown, budget guardrail, localization QA, no-raw-artifact, future Z1, and future Z2 benchmark gates.
- [x] Confirmed no RunPod provisioning, provider account resource, model call, benchmark, inference endpoint call, Qwen3-VL-30B-A3B install/download/load/call, vLLM/SGLang/Ollama install/run, iOS runtime change, raw artifact, provider credential, secret, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, RunPod raw URL, provider credential, SSH key, real region ID, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z1 requires separate explicit approval before any RunPod instance inspection/provisioning or provider-console pricing verification.
- [ ] Phase 21-Z2 requires separate explicit approval before any Qwen3 install/download/load/call, benchmark, or inference endpoint call.

## Phase 21-Z-R1 API-first Serverless VLM Alternative Evaluation Gate

Check:

- [x] Confirmed Phase 21-Z-R1 is docs-only and was added as an addendum because Phase 21-Z was already committed/pushed.
- [x] Added `docs/phase-21-z-r1-api-first-serverless-vlm-alternative-evaluation-gate.md`.
- [x] Recorded SiliconFlow and DashScope / Alibaba Cloud Model Studio / 阿里雲百煉 as candidate providers only.
- [x] Confirmed RunPod A100 80GB remains fallback/comparison and was not removed.
- [x] Added cost model, privacy/legal/data-governance, product-mode, provider-agnostic adapter, and future benchmark gates.
- [x] Confirmed no provider API call, API key creation/commit, provider SDK/runtime, RunPod provisioning, Qwen3 install/download/load/call, model call, benchmark, inference endpoint call, image upload, iOS runtime change, upload payload change, live cloud AI runtime, raw artifact, credential, secret, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, SiliconFlow/DashScope raw URL, provider credential, API key, RunPod raw URL, real region ID, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2A should verify SiliconFlow / DashScope account feasibility, pricing, terms, retention/training policy, Hong Kong/Taiwan/Korea latency expectations, rate limits, and structured-output behavior without model calls or benchmarks.
- [ ] Phase 21-Z2C requires separate explicit approval before any provider API VLM benchmark, model call, or fixture execution.

## Phase 21-Z2A-SF SiliconFlow Qwen3-VL API Research and Model Selection Gate

Check:

- [x] Confirmed Phase 21-Z2A-SF is docs-only research consolidation.
- [x] Confirmed both operator-provided research drafts were available and incorporated.
- [x] Added `docs/phase-21-z2a-sf-siliconflow-qwen3-vl-api-research-and-model-selection-gate.md`.
- [x] Recorded SiliconFlow as the primary API-first provider direction.
- [x] Recorded `Qwen/Qwen3-VL-30B-A3B-Instruct` as the primary model direction.
- [x] Confirmed RunPod A100 80GB remains fallback/comparison.
- [x] Recorded model-page facts with JSON/structured-output, pricing, latency, and privacy/legal caveats.
- [x] Recorded no provider API call, no API key creation/commit, no provider account, no provider SDK/runtime, no image upload, no model call, no benchmark, no real inference endpoint, no RunPod provisioning, no local Qwen3 install/download/load/call, no iOS runtime change, no upload payload change, no live cloud AI runtime, no raw artifact, no credential, no secret, and no production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, SiliconFlow endpoint/API key in iOS, provider raw output in app UI/history, RunPod raw URL, real region ID, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2B-SF should add backend-only no-runtime SiliconFlow adapter contracts and tests without API calls, API keys, provider account creation, image upload, benchmark, iOS integration, or production endpoint.
- [ ] Phase 21-Z2C-SF requires separate explicit approval before any live SiliconFlow 12-fixture benchmark using active credentials and external network access.

## Phase 21-Z2B-SF SiliconFlow No-runtime Backend Adapter Contract Gate

Check:

- [x] Added backend-only no-runtime SiliconFlow provider contract modules.
- [x] Added fail-closed config validation and sanitized JavaScript / Node.js request-shape builder.
- [x] Added OpenAI-compatible response text extraction and parser/validator tests using synthetic strings only.
- [x] Added sanitized provider error buckets.
- [x] Added fail-closed readiness CLI.
- [x] Confirmed no SiliconFlow API call, no API key creation/commit, no provider account, no provider SDK/runtime execution, no image upload, no model call, no benchmark, no real inference endpoint, no RunPod provisioning, no local Qwen3 install/download/load/call, no iOS runtime change, no upload payload change, no live cloud AI runtime, no raw artifact, no credential, no secret, and no production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, SiliconFlow endpoint/API key in iOS, upload payload change, capture-context upload, app-facing endpoint, production rollout, provider raw output in app UI/history, RunPod raw URL, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2C-SF should draft the explicit approval request for a future SiliconFlow 12-fixture API benchmark.
- [ ] Any live SiliconFlow API call, API key setup, image upload, model call, benchmark, provider runtime, or iOS integration still requires separate explicit approval.

## Phase 21-Z2C-SF SiliconFlow 12-fixture API Benchmark Approval Request

Check:

- [x] Added `docs/phase-21-z2c-sf-siliconflow-12-fixture-api-benchmark-approval-request.md`.
- [x] Confirmed Phase 21-Z2C-SF is approval-request documentation only and does not approve execution by itself.
- [x] Recorded future scope: SiliconFlow, `Qwen/Qwen3-VL-30B-A3B-Instruct`, endpoint bucket `siliconflow_chat_completions`, JavaScript / Node.js backend only, fixtures `smoke_004` through `smoke_015`, exactly 12 calls, retry 0, image detail low, stream false, max output tokens 256, sanitized aggregate report only, and `productionReady:false`.
- [x] Added copyable approval wording and operator confirmation checklist.
- [x] Added local/ignored prerequisite summary, future sanitized output format, failure gates, and success criteria.
- [x] Confirmed no SiliconFlow API call, no API key creation/read/print/commit, no provider account, no provider SDK/runtime execution, no image upload, no model call, no benchmark, no real inference endpoint, no RunPod provisioning, no local Qwen3 install/download/load/call, no iOS runtime change, no upload payload change, no live cloud AI runtime, no raw artifact, no credential, no secret, and no production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, SiliconFlow endpoint/API key in iOS, upload payload change, capture-context upload, app-facing endpoint, production rollout, provider raw output in app UI/history, RunPod raw URL, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2C-SF-RUN requires separate explicit approval before any live SiliconFlow API call, API key use, image upload, model call, or benchmark.

## Phase 21-Z2C-SF-RUN-PRE SiliconFlow Benchmark Dry-run Gate

Check:

- [x] Added a deterministic no-network SiliconFlow benchmark plan for fixtures `smoke_004` through `smoke_015`.
- [x] Added `npm run qa:siliconflow:benchmark-dry-run` for sanitized dry-run output only.
- [x] Added `npm run qa:siliconflow:benchmark-plan` for dry-run contract tests.
- [x] Confirmed planned call count is `12`, actual call count is `0`, retry count is `0`, `benchmarkApproved:false`, `executionAllowed:false`, `networkCallsMade:false`, `apiKeyRead:false`, `fixtureImagesOpened:false`, and `productionReady:false`.
- [x] Confirmed no SiliconFlow API call, API key creation/read/print/commit, provider runtime execution, image upload, fixture image read, model call, real benchmark, iOS runtime change, upload payload change, live cloud AI runtime, raw artifact, credential, secret, or production rollout.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, SiliconFlow endpoint/API key in iOS, upload payload change, capture-context upload, app-facing endpoint, production rollout, provider raw output in app UI/history, RunPod raw URL, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2C-SF-RUN retry requires this dry-run gate to pass and still requires the recorded exact approval phrase plus local ignored API key, network approval, fixture readiness, budget cap, and terms/pricing acknowledgement.

## Phase 21-Z2C-SF-RUN SiliconFlow 12-fixture API Benchmark

Check:

- [x] Confirmed exact approval phrase was present in the Codex session.
- [x] Confirmed local ignored `backend/.env.local` had `SILICONFLOW_API_KEY` present without printing the key.
- [x] Confirmed approved fixture tokens `smoke_004` through `smoke_015` were present and used.
- [x] Ran exactly 12 approved SiliconFlow API attempts with retry `0`.
- [x] Recorded sanitized aggregate only: accepted `0`, rejected `12`, validation bucket `provider_schema_invalid x12`, fallback bucket `provider_validation_rejected x12`, latency bucket `5s_to_15s x12`, token usage bucket `lte_20k`, cost bucket `usage_available_cost_not_computed`.
- [x] Confirmed no raw provider response, raw prompt, raw request payload, raw image/base64/path, API key, provider credential, or raw report was printed or persisted.
- [x] Confirmed no iOS runtime change, upload payload change, live cloud AI runtime, app-facing endpoint, production endpoint, RunPod provisioning, vLLM/SGLang/Ollama run, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, SiliconFlow endpoint/API key in iOS, upload payload change, capture-context upload, app-facing endpoint, production rollout, provider raw output in app UI/history, or dependency on SiliconFlow credentials appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z2D-SF should review the `provider_schema_invalid x12` result before any rerun, prompt/schema-alignment change, alternative model benchmark, provider diagnosis, or iOS integration planning.

## Phase 21-Z2D-SF SiliconFlow Benchmark Review and Provider Decision Gate

Check:

- [x] Confirmed Phase 21-Z2C-SF-RUN executed exactly once with planned calls `12`, actual calls `12`, and retry `0`.
- [x] Confirmed sanitized result remains accepted `0`, rejected `12`, validation bucket `provider_schema_invalid x12`, fallback bucket `provider_validation_rejected x12`, latency bucket `5s_to_15s x12`, token usage bucket `lte_20k`.
- [x] Classified the result as provider-output/schema alignment failure, not network/auth/base URL failure.
- [x] Confirmed this is not proof that SiliconFlow is unusable or that Qwen3-VL quality is bad.
- [x] Confirmed no SiliconFlow API rerun, API key read, image upload, model call, benchmark, iOS runtime change, upload payload change, raw artifact, or production rollout happened in this review phase.
- [x] Set next safe phase to Phase 21-Z2D-SF-R1 prompt/schema alignment without API calls.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, SiliconFlow endpoint/API key in iOS, upload payload change, capture-context upload, app-facing endpoint, production rollout, provider raw output in app UI/history, or dependency on SiliconFlow credentials appears in Xcode.

Known TODOs:

- [ ] Do not rerun SiliconFlow or approve iOS integration until a separate prompt/schema alignment phase and explicit future approval.

## Phase 21-Y-R1 Asia-first RunPod Region Selection Gate

Check:

- [x] Confirmed Phase 21-Y-R1 is docs/planning only.
- [x] Recorded initial user regions: Korea, Taiwan, Hong Kong.
- [x] Recorded `userRegionBucket:korea_taiwan_hong_kong`, `backendRegionPreference:asia_near`, and `gpuRegionPreference:asia_near`.
- [x] Confirmed post-capture batch/queue Photo Advisor remains the product serving path.
- [x] Confirmed live camera / real-time cloud analysis remains out of scope.
- [x] Confirmed US/EU GPU capacity is fallback, not the first Asia latency baseline.
- [x] Added Phase 21-Z gate for Asia-near A100 availability, current price, daily 2-3 hour cost, storage/cache cost, fallback decision, no public endpoint, budget hard stop, manual kill switch, and no committed credentials.
- [x] Added future Asia user-perspective latency/cost buckets and localization QA for Hong Kong Traditional Chinese, Taiwan Traditional Chinese, Korean, and English fallback only.
- [x] Confirmed no RunPod provisioning, model call, benchmark, real inference endpoint call, Qwen3-VL-30B-A3B install/download/load/call, vLLM/SGLang/Ollama install/run, iOS runtime change, raw artifact, provider credential, secret, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, RunPod raw URL, provider credential, SSH key, region ID dependency, or Windows raw local model path dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z should remain no-provisioning by default and verify Asia-near RunPod A100 availability/cost before any resource creation.
- [ ] Any RunPod provisioning, Qwen3 install/download/load/call, model call, benchmark, or inference endpoint call requires separate explicit approval.

## Phase 21-Y RunPod A100 Qwen3-VL Runtime and Batch Queue Plan

Check:

- [x] Confirmed Phase 21-Y is docs/planning only.
- [x] Selected RunPod on-demand A100 80GB as the first target benchmark environment.
- [x] Selected `Qwen3-VL-30B-A3B` as the target model candidate for the next benchmark path.
- [x] Retained the current Qwen2.5 / existing Qwen VLM Transformers+FastAPI path as a correctness baseline only.
- [x] Planned post-capture batch/queue Photo Advisor serving instead of live camera real-time analysis.
- [x] Recorded daily 2-3 hour GPU windows and rough `$80-$170/month` cost assumption, with pricing verification required before purchase.
- [x] Defined future 12-fixture benchmark shape for `smoke_004` through `smoke_015`, call count `12`, retry `0`, sanitized aggregate only.
- [x] Confirmed no model call, benchmark, real inference endpoint call, RunPod provisioning, Qwen3-VL-30B-A3B install/download/load/call, vLLM/SGLang/Ollama install/run, iOS runtime change, raw artifact, secret, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, RunPod raw URL dependency, Windows raw local model path dependency, or provider credential dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Z should prepare RunPod A100 Qwen3-VL deployment/security/no-model gates without provisioning resources or running model calls.
- [ ] Phase 21-Z2 requires separate explicit approval before any Qwen3-VL-30B-A3B 12-fixture benchmark on RunPod A100.

## Phase 21-X Controlled Benchmark Review and Latency Decision Gate

Check:

- [x] Reviewed Phase 21-W-FINAL-R2 accepted aggregate: `acceptedCount:12`, `rejectedCount:0`, `blockedCount:0`.
- [x] Confirmed Phase 21-W controlled benchmark goal is reached.
- [x] Confirmed Transformers+FastAPI reference path is a backend correctness baseline.
- [x] Confirmed latency `5s_to_15s x11` and `gt_15s x1` is not suitable for live camera or production real-time advisor UX.
- [x] Recorded `decisionBucket:correctness_baseline_pass_latency_not_product_ready`.
- [x] Recommended Phase 21-Y target runtime planning.
- [x] Confirmed no model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B install/load/call, vLLM/SGLang/Ollama call, iOS runtime change, raw artifact, secret, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no Camera cloud AI entry, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, Windows raw local model path dependency, or raw local model URL dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-Y should plan the target RunPod A100 Qwen3-VL runtime and batch/queue path before any further model call, benchmark, serving-stack switch, quantization, Live Advisor simulation, iOS integration, endpoint, or production rollout.

## Phase 21-W-FINAL-R2 Controlled 12-fixture Benchmark Final Result

Check:

- [x] Restored the existing local/private Transformers+FastAPI reference server path without switching model or serving stack.
- [x] Confirmed external no-model fixture-token contract and route-contract dry-run passed.
- [x] Confirmed backend healthz was `safe` with `modelLoaded:true`.
- [x] Confirmed backend live route dry-run accepted the approved 12 fixtures with `route_contract_ready`.
- [x] Ran exactly one approved controlled benchmark with `smoke_004` through `smoke_015`.
- [x] Confirmed benchmark call count `12` and retry count `0`.
- [x] Confirmed sanitized aggregate result accepted `12`, rejected `0`, blocked `0`.
- [x] Confirmed latency buckets `gt_15s x1` and `5s_to_15s x11`.
- [x] Confirmed no raw output, prompt, payload, image path, registry contents, config contents, server URL/logs, EXIF/GPS/sensor data, or secrets were printed or committed.
- [x] Confirmed no Qwen3-VL-30B-A3B install/load/call, no vLLM/SGLang/Ollama, no serving switch, no concurrency benchmark, no quantization benchmark, and no Live Advisor simulation.
- [x] Confirmed no iOS runtime change, endpoint addition, Camera cloud AI entry, Auto-Trigger runtime, WSS runtime, upload runtime, upload payload change, or production rollout.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no local CV runtime, Camera cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, iOS provider/model key/direct call, upload payload change, capture-context upload, app-facing endpoint, production rollout, Windows local path dependency, or raw local model URL dependency appears in Xcode.

Known TODOs:

- [ ] Phase 21-X should review accepted aggregate quality/latency before any next benchmark, serving-stack comparison, quantization, Live Advisor, iOS integration, endpoint, or production rollout.


## Phase 21-Z2E-SF-AUTO SiliconFlow Prompt/Schema Alignment and Bounded Retry

- [x] Confirmed Phase 21-Z2D-SF was committed and upstream-synced before starting.
- [x] Confirmed the phase had explicit approval for bounded SiliconFlow calls with cap `28`, retry `0`, model `Qwen/Qwen3-VL-30B-A3B-Instruct`, and fixtures `smoke_004` through `smoke_015` only.
- [x] Added schema-enum-driven backend prompt contract and synthetic prompt/schema tests.
- [x] Ran one canary call on `smoke_004` and one full controlled run over `smoke_004` through `smoke_015`.
- [x] Confirmed total provider calls `13`, retry `0`, accepted `13`, rejected `0`, latency buckets `5s_to_15s x9` and `gt_15s x4`, token usage bucket `lte_20k`, and `productionReady:false`.
- [x] Confirmed no raw provider response, raw model text, raw prompt, raw request payload, raw image/base64/path, API key, credential, or raw report was printed, persisted, staged, or committed.
- [x] Confirmed no iOS runtime change, upload payload change, Camera cloud AI entry, app-facing endpoint, production endpoint, live cloud AI runtime, or production rollout was added.
- [ ] In Xcode, confirm runtime behavior is unchanged: no SiliconFlow endpoint/API key in iOS, no direct provider call, no upload payload change, no capture-context upload, no Camera cloud AI entry, no app-facing endpoint, and no provider raw output in app UI/history.
- [ ] Phase 21-Z2F-SF should review accepted aggregate results, latency/cost/privacy/legal/beta-readiness boundaries, and must not start iOS integration or production rollout without separate explicit approval.


## Phase 21-Z2F-SF-LATENCY SiliconFlow Single-image Latency Probe

- [x] Confirmed repo was clean and upstream-synced before starting.
- [x] Ran only approved single-image SiliconFlow probes with `smoke_004`, retry `0`, and sanitized output only.
- [x] Confirmed total provider calls `11`, no alternative model calls, no fixture expansion, and no real user photos.
- [x] Confirmed compact prompt + `max_tokens:192` accepted and improved token bucket to `lte_1k`.
- [x] Confirmed `enable_thinking:false` was invalid for this VLM request shape and was not committed.
- [x] Confirmed `max_tokens:128` was too tight for the current schema.
- [x] Confirmed no raw provider response, raw model text, raw prompt, raw request payload, raw image/base64/path, API key, credential, or raw report was printed, persisted, staged, or committed.
- [x] Confirmed no iOS runtime change, upload payload change, Camera cloud AI entry, app-facing endpoint, production endpoint, live cloud AI runtime, or production rollout was added.
- [ ] In Xcode, confirm runtime behavior remains unchanged: no SiliconFlow endpoint/API key in iOS, no direct provider call, no upload payload change, no Camera cloud AI entry, and no app-facing endpoint.

## Docs - On-device Live Framing AI Roadmap Direction Update

Check:

- [x] Added `docs/on-device-live-framing-ai-roadmap.md`.
- [x] Recorded today's direction change: real-time guidance should prioritize on-device Vision / AVFoundation geometry, hardware depth when available, and app-side retro-aware rules instead of cloud live VLM.
- [x] Preserved SiliconFlow / RunPod / open-weight VLM work for post-capture Photo Advisor, offline benchmark, internal evaluation, schema validation, and future model-assisted labeling/distillation.
- [x] Recorded revised Phase 21-A through Phase 21-E plan.
- [x] Confirmed no runtime code, model file, Core ML package, Florence-2 implementation, Depth Anything production bundle, dataset crawler, AI provider labeling adapter, network/model/provider call, iOS provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, backend/iOS upload payload change, raw artifact, secret, or production rollout was added.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no new iOS SDK/model/provider dependency appears.
- [ ] Confirm no Camera live cloud AI entry appears.
- [ ] Confirm no SiliconFlow / RunPod / model endpoint or API key appears in iOS.
- [ ] Confirm no upload payload, Photos permission, or Camera permission behavior changed.

## Research Docs - On-device Live Framing AI Research Set

Check:

- [x] Added `docs/research/on-device-ai-research-index.md`.
- [x] Added research reports for Apple Vision / AVFoundation, hybrid architecture, device tiers, Depth Anything V2 Small, Florence-2-base, privacy/App Store safety, dataset collection, and fine-tuning/distillation.
- [x] Confirmed the next recommended implementation phase remains `Phase 21-A - On-device Vision Geometry Spike`.
- [x] Confirmed research-docs-only: no runtime code, model file, Core ML / ONNX / TFLite package, dataset crawler, provider labeling adapter, provider/model API key, direct iOS provider/model call, Camera live cloud AI entry, preview-frame upload, backend/iOS upload payload change, generated report, local fixture, real photo, dataset, local config, provider response, raw label, secret, or production rollout was added.
- [x] Kept `productionReady:false`.

Manual Xcode check:

- [ ] Launch only if desired; Xcode runtime behavior should be unchanged.
- [ ] Confirm no model files appear in the iOS bundle.
- [ ] Confirm no new iOS provider/model SDK or API key appears.
- [ ] Confirm no Camera live cloud AI entry appears.
- [ ] Confirm no upload payload or Photos/Camera permission behavior changed.


## Phase 21-Z2G-SF SiliconFlow Network/Parameter Latency Probe

- [x] Confirmed repo was clean and upstream-synced before starting.
- [x] Ran approved backend-only SiliconFlow probes with `smoke_004`, retry `0`, and sanitized output only.
- [x] Confirmed successful escalated provider calls `5`; sandboxed network attempts returned `provider_network_error` and produced no provider response.
- [x] Confirmed sequential same-process `fetch` compact `max_tokens:192` remained accepted but seconds-level: `8637ms` and `8529ms`.
- [x] Confirmed `stream:true` TTFT was `3979ms`, but full validated JSON was `9898ms`.
- [x] Confirmed ultra-short `max_tokens:80` and `50` failed schema with `provider_json_parse_failed`.
- [x] Confirmed no raw provider response, raw model text, raw prompt, raw request payload, raw image/base64/path, API key, credential, or raw report was printed, persisted, staged, or committed.
- [x] Confirmed no iOS runtime change, upload payload change, Camera cloud AI entry, app-facing endpoint, production endpoint, live cloud AI runtime, or production rollout was added.
- [ ] In Xcode, confirm runtime behavior remains unchanged: no SiliconFlow endpoint/API key in iOS, no direct provider call, no upload payload change, no Camera cloud AI entry, and no app-facing endpoint.

## Phase 21-A - On-device Vision Geometry Spike

- [ ] Build and run the iOS app in Xcode.
- [ ] Open Camera and keep Live Guidance in local mode.
- [ ] Confirm live guidance still appears without crashes while moving a face/person subject around the frame.
- [ ] Confirm edge/headroom/subject-size guidance remains short, optional, non-judgmental, and retro-aware.
- [ ] Confirm no score/rating, attractiveness, identity, age, gender, emotion, health, ethnicity, religion, disability, body judgement, or harsh retake-first wording appears.
- [ ] Confirm preview frames are not uploaded and no backend request is made for live guidance.
- [ ] Confirm no Camera live cloud AI entry appears.
- [ ] Confirm no iOS provider/model key, SDK, endpoint, or direct provider/model call appears.
- [ ] Confirm no model file, Core ML package, ONNX/TFLite package, Florence-2 runtime, or Depth Anything runtime appears in the iOS bundle.
- [ ] Confirm capture/import, local filters, selected-photo review, mock save, and post-capture advisor behavior still work as before.
- [ ] Confirm backend/iOS upload payloads are unchanged.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P1 - Doka-style On-device Composition Loop

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the filesystem-synchronized target includes both `LocalAIComposeGuide.swift` and `LocalAIComposeOverlayView.swift`.
- [ ] Open Camera and tap `AI Compose`; confirm the normal compact Local Guidance card hides while the Compose overlay is active.
- [ ] With no clear person/object, confirm the overlay stays in a searching state and does not invent a composition instruction.
- [ ] Aim at one person; confirm face/body geometry produces a stable target frame and a single placement or distance instruction.
- [ ] Keep the same Compose session active while moving closer/farther; confirm the target frame position and size remain stable instead of following the live subject box.
- [ ] Aim at a clear non-person object such as a cup, plant, or bicycle; confirm objectness saliency can propose a bounded subject frame without a crash.
- [ ] Move the subject toward the target; confirm left/right/up/down guidance converges and changes to the hold/aligned state near the target.
- [ ] Move closer and farther; confirm bounded zoom/distance copy appears without automatic lens zoom or forced capture.
- [ ] Tilt the iPhone slightly; confirm the yellow level line responds and the copy remains optional rather than treating tilt as an error.
- [ ] Toggle Compose off/on; confirm a fresh target is selected for the new session.
- [ ] Switch lens and front/back camera while Compose is active; confirm the old target clears, front-camera subject/target rectangles mirror correctly, and a fresh frame is required.
- [ ] Turn Local Guidance off while Compose remains active; confirm Compose still receives local frames and no cloud entry appears.
- [ ] Apply several live filters; confirm Compose remains responsive and the filter preview/capture path still works.
- [ ] Run Compose for ten minutes across person/object/no-subject scenes; confirm late frames are discarded, camera/shutter remains responsive, and there is no excessive heat or memory growth.
- [ ] Inspect device logs and confirm there is no raw frame, pixel buffer, face/body/saliency rectangle, prompt, image/base64, model output, or sensitive inference logging.
- [ ] Confirm no frame/image upload, URLSession/Cloud Function/provider call, provider key/SDK, `.mlmodel`/`.mlpackage`, user-photo training, automatic save, scoring/rating, or production rollout is present.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P2 - Long-press Subject Lock And AR-style 2D Alignment

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; enable `AI Compose` and confirm normal shutter/top/lens controls still receive taps.
- [ ] With two people visible, long-press each person in turn; confirm the cyan lock frame selects the intended local candidate and the target resets for the newly selected subject.
- [ ] With multiple non-person objects and no person visible, long-press different objectness candidates; confirm selection is bounded and a miss gives warning haptic without inventing a lock.
- [ ] Long-press a blank or aspect-fit letterbox area; confirm no subject is selected and no crash occurs.
- [ ] Move a locked subject gradually; confirm the cyan frame follows the same candidate kind near its prior center and does not jump to another visible subject.
- [ ] Let the selected subject leave the frame; confirm the overlay enters the reacquiring state. Bring it back near the prior area and confirm the same-kind candidate can be reacquired.
- [ ] Cross two similar subjects; confirm behavior is conservative. Record any same-kind swap for a future local `VNTrackObjectRequest` evaluation rather than treating the lock as identity tracking.
- [ ] Repeat selection with the front camera; confirm displayed touch position, cyan subject frame, target frame, and left/right instructions all match the mirrored preview.
- [ ] Switch lens and front/back camera while locked; confirm candidate, tracking point, target position, and target size are all cleared before a fresh frame.
- [ ] Toggle Compose off/on, select a library photo, and leave/re-enter Camera; confirm no old lock or candidate returns.
- [ ] Use the VoiceOver custom action to clear a locked subject; confirm automatic local subject proposal resumes.
- [ ] Pinch the dual-focal crop and operate Camera chrome while Compose is active; confirm the long-press gesture does not block existing controls.
- [ ] Apply several live filters and run for ten minutes across person/object/no-subject scenes; confirm responsive shutter, bounded heat/memory, and no gesture/overlay backlog.
- [ ] Inspect device logs and confirm no raw frame, pixel buffer, candidate box, touch point, tracking center/history, face/body/saliency output, prompt, image/base64, or sensitive inference logging.
- [ ] Confirm no ARKit world session, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, frame upload, model package, user-photo training, identity recognition, automatic capture, or production rollout is present.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P3 - Temporal Lock Stability And Ambiguity Rejection

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the filesystem-synchronized target includes `LocalAIComposeTemporalSubjectTracker.swift` without manual target membership edits.
- [ ] Lock one subject and move it slowly left/right and toward/away from the camera; confirm the cyan frame is visibly smoother than raw low-frequency Vision boxes and guidance remains responsive.
- [ ] Move the locked subject quickly but continuously; confirm bounded motion prediction can follow plausible movement without snapping across the frame.
- [ ] Let the subject disappear for one to four Vision samples and return near the predicted path; confirm reacquisition is possible and the fixed composition target does not reset.
- [ ] Place two similar people at different positions, lock one, and move only the other; confirm center/overlap/size evidence keeps the selected geometry stable.
- [ ] Cross two similar people or same-kind objects; confirm closely scored candidates produce the reacquiring state instead of an arbitrary visible lock swap.
- [ ] After an ambiguous crossing, separate the subjects; confirm reacquisition occurs only when one same-kind candidate becomes geometrically plausible again. Treat this as geometry continuity, not verified identity.
- [ ] Change the selected subject's apparent size abruptly or introduce a distant same-kind subject; confirm hard gates reject implausible size/location jumps.
- [ ] Repeat with front camera, filters, lens switching, Compose off/on, photo selection, and Camera re-entry; confirm mirror behavior stays correct and temporal state is cleared at every existing lifecycle boundary.
- [ ] Run for ten minutes across person/object/no-subject scenes; confirm frame, guidance, shutter, heat, and memory remain acceptable with no tracking backlog.
- [ ] Inspect logs and app storage; confirm no candidate rectangle, velocity, missed count, trajectory, touch, frame, prompt, image/base64, identity descriptor, or sensitive inference is logged or persisted.
- [ ] Confirm no ARKit session, Vision identity/face recognition, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, upload, model/training artifact, automatic shutter, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P4 - Stable Local Policy And AR-style Grids

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target includes `LocalAIComposePolicy.swift` automatically.
- [ ] Frame a normal single face/body subject; confirm the policy badge shows the localized thirds policy and the subtle thirds grid aligns with the aspect-fit preview.
- [ ] Frame a geometrically centered close face/body subject; confirm centered balance is selected and the overlay changes to centered axes/crosshair without describing the person.
- [ ] Frame a small generic object with no person present; confirm negative space is selected, its grid is dashed, and the target does not unnecessarily fill most of the viewfinder.
- [ ] Frame a medium centered square-like generic object; confirm centered balance can be selected. Move it off center before starting a new Compose plan and confirm thirds is selected instead.
- [ ] Keep one policy active while the subject jitters near a threshold; confirm policy badge, target anchor, target size, and grid do not oscillate.
- [ ] Introduce a second plausible subject for only one Vision sample; confirm automatic guidance does not immediately switch into selection mode.
- [ ] Keep multiple subjects visible for at least two samples; confirm the target/grid clears, no central searching reticle appears, and localized copy asks the user to long-press the intended subject.
- [ ] Long-press one subject; confirm subject choice immediately overrides multiple-subject mode and creates a stable policy/target for the locked subject.
- [ ] Clear the lock while multiple subjects remain; confirm two-sample subject-choice hysteresis returns without arbitrary automatic selection.
- [ ] Remove the additional subject for one sample and then two samples; confirm guidance resumes only after the second clear sample.
- [ ] Occlude a locked subject; confirm its policy badge and target remain visible during P3 reacquisition, then recover without changing policy.
- [ ] Repeat with front camera; confirm mirrored arrows remain correct while symmetric thirds/center grids, policy badge, and target remain aligned.
- [ ] Verify English and Traditional Chinese policy/multiple-subject copy, Dynamic Type, VoiceOver reading order, and contrast over bright/dark filtered previews.
- [ ] Switch lens/camera, disable/re-enable Compose, select a photo, and leave/re-enter Camera; confirm policy, target, ambiguity counters, tracking state, and candidate geometry all reset.
- [ ] Run for ten minutes and confirm grids add no interaction blocking, frame backlog, excessive heat, memory growth, or shutter delay.
- [ ] Inspect logs/storage and confirm no policy, candidate rectangle, counter, target, trajectory, frame, identity descriptor, prompt, image/base64, score/rating, or sensitive inference is logged or persisted.
- [ ] Confirm no ARKit session, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, preview upload, custom model/training, automatic shutter, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P5 - Optional Vision Scene Horizon

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target automatically includes `LocalAIComposeHorizonStability.swift` and the classic `VNDetectHorizonRequest` API compiles at the project deployment target.
- [ ] Keep Compose off with Local Guidance on; profile/inspect the frame path and confirm scene-horizon analysis remains disabled.
- [ ] Enable Compose and aim at a clear sea/land horizon or strong architectural horizon; confirm no horizon cue appears after only one sample and it appears after a second agreeing sample.
- [ ] Confirm the detected cyan line visually follows the image-content horizon while the dashed line stays horizontal.
- [ ] Level the scene horizon; confirm the detected line turns mint near ±1.5 degrees and no score/rating appears.
- [ ] Deliberately tilt the camera; confirm copy says leveling is optional, the primary subject-placement instruction remains higher priority, capture is never blocked, and no automatic rotation/crop occurs.
- [ ] Briefly obscure the horizon for one sample; confirm the stable line holds. Keep it unavailable for a second sample and confirm the line clears.
- [ ] Jump between two very different horizon angles; confirm one sample cannot replace the active line and two agreeing samples are required.
- [ ] Aim at scenes without a reliable horizon, highly textured clutter, vertical-only architecture, and low light; confirm the UI safely shows no scene line instead of fabricating one.
- [ ] Test angle beyond approximately ±25 degrees; confirm the bounded cue clears rather than displaying an extreme/likely-invalid result.
- [ ] Test a horizon with no detected subject; confirm horizon stability can still activate/clear while the subject guide remains searching.
- [ ] Repeat on the front camera with an asymmetric tilted line; confirm display angle is mirrored and visually follows the preview rather than rotating the wrong direction.
- [ ] Remove the scene horizon while a subject remains; confirm the existing CoreMotion yellow/mint level cue remains the fallback when applicable, never simultaneously drawing two competing level lines.
- [ ] Repeat across all lenses, several live filters, bright/dark scenes, subject lock/reacquisition, and multi-subject choice mode; confirm the scene cue remains aligned and does not block gestures.
- [ ] Switch lens/camera, disable Compose, select a photo, stop/re-enter Camera, and revoke frame-analysis conditions; confirm horizon pending/active/miss state and request enablement reset.
- [ ] Run Compose for ten minutes while profiling; confirm the extra compose-only request causes no unacceptable frame backlog, thermal rise, memory growth, or shutter delay.
- [ ] Verify English/Traditional Chinese optional-horizon copy, VoiceOver, Dynamic Type, and contrast over bright/dark filtered previews.
- [ ] Inspect logs/storage and confirm no raw frame, horizon observation, confidence, transform, angle history, stability sample, CoreMotion stream, prompt, image/base64, score, identity descriptor, or sensitive inference is logged or persisted.
- [ ] Confirm no ARKit session, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, preview upload, custom model/training, automatic correction/capture, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P6 - Stabilized AR Action Cues

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target automatically includes `LocalAIComposeGuidanceAction.swift`.
- [ ] Create simultaneous horizontal and much larger vertical target error; confirm vertical text/arrow wins instead of horizontal always taking priority.
- [ ] Create simultaneous vertical and much larger horizontal error; confirm horizontal text/arrow wins.
- [ ] Confirm zoom-in or leave-space guidance appears only after placement is within current X/Y tolerance.
- [ ] Move the subject around the horizontal/vertical threshold; confirm the first action appears immediately and a different action needs two consecutive samples before text/icon/arrow switches.
- [ ] Trigger a one-sample pending action and return to the active action; confirm the pending switch is cancelled with no visible flicker.
- [ ] Approach aligned state slowly; confirm movement action persists through its tighter exit threshold, then aligned requires stable evidence and does not immediately leave on small jitter.
- [ ] Approach zoom target from too small and too large states; confirm zoom-in/step-back exit hysteresis prevents rapid alternation with aligned.
- [ ] Verify left/right/up/down arrows visually agree with localized text, start near the current subject, remain bounded inside the preview overlay, and point in the stable action direction.
- [ ] Repeat every direction on the front camera; confirm mirrored target mapping, arrow, and text agree.
- [ ] Confirm zoom-in shows the plus magnifier, leave-space shows the minus magnifier, and aligned shows a mint check at target center without any numeric percentage or score.
- [ ] Lose/reacquire a locked subject; confirm stale arrow/action clears during reacquisition and the first fresh action returns immediately after a valid match.
- [ ] Enter confirmed multiple-subject selection mode and no-subject searching; confirm no stale arrow, zoom, or aligned badge remains.
- [ ] Switch policy/target through a new lock or lifecycle reset; confirm pending/active action state resets with the plan.
- [ ] Verify action cues coexist legibly with thirds/centered/negative-space grids, scene horizon, CoreMotion fallback, cyan lock frame, target frame, and bright/dark live filters.
- [ ] Operate long press, pinch, shutter, lens/filter controls, VoiceOver, and Dynamic Type; confirm decorative arrows/symbols do not intercept interaction or add duplicate accessibility speech.
- [ ] Run for ten minutes across moving subjects and thresholds; confirm no animation/frame backlog, excessive heat, memory growth, or shutter delay.
- [ ] Inspect logs/storage and confirm no proposed/active/pending action, sample count, vector, trajectory, target, frame, prompt, image/base64, score, identity descriptor, or sensitive inference is logged or persisted.
- [ ] Confirm no automatic zoom/pan/crop/rotation/capture, ARKit session, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, preview upload, custom model/training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P19 - Photographer-selected Group Balance

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized membership includes `LocalAIComposeGroupStability.swift` without manual project-file editing.
- [ ] Enable Compose with two clearly visible people or objects, open the policy menu, and choose Group Balance; confirm any individual lock clears and the localized group-searching state appears first.
- [ ] Hold two compatible full-analysis samples; confirm one dashed cyan union frame/group badge, centered target, policy badge, and central safe-region grid appear only on the second sample.
- [ ] Show only one candidate for several samples; confirm Group Balance stays in searching and never treats it as a group.
- [ ] Show five plausible candidates; confirm no more than the existing top four contribute and no member number, kind, confidence, ranking, or identity appears.
- [ ] Spread two candidates across almost the full width/height; confirm the bounded union is rejected rather than drawing an unsafe nearly full-frame target.
- [ ] Move the group slightly while keeping all members visible; confirm the union frame smooths without resetting target/action/Hold/Ready on every sample.
- [ ] Make the detected union jump to a distant set for one full sample; confirm the old group remains and no action/Hold/Ready evidence advances. Hold the replacement for a second compatible sample and confirm one clean replacement/replan.
- [ ] Hide or invalidate the group for one full sample; confirm the frame remains for continuity but Hold cannot become Ready. Keep it missing for a second sample and confirm the union/target clear into group searching.
- [ ] Pan or shake the phone during group acquisition and while a group is active; confirm P17 pauses and neither activation, replacement, clearing, action, Hold, nor Ready advances until stable fresh group observations return.
- [ ] Confirm P13 fast tracking of a previously locked individual stops when Group Balance is selected and cannot update the group union.
- [ ] While Group Balance is active, long-press one visible candidate; confirm policy returns to automatic, the individual becomes locked, the group state clears, and single-subject tracking resumes.
- [ ] Switch from Group Balance to thirds/centered/symmetry/leading/lead-room/negative-space; confirm ordinary policy behavior returns and no hidden group union persists.
- [ ] Confirm Group Balance never appears as an automatic recommendation and has no horizontal target-flip action.
- [ ] Repeat with front/back cameras, mixed face/body/object candidates, different lenses, bright/dark filters, partial occlusion, candidate crossings, and low light; confirm geometry remains bounded and mirrored correctly.
- [ ] Check VoiceOver and Dynamic Type; confirm `Group balance` / `群組平衡`, searching copy, and privacy detail are readable while decorative union/grid geometry stays noninteractive.
- [ ] Toggle Compose, select a photo, switch lens/camera, background/foreground, stop/reopen Camera, and return from capture; confirm no group rectangle, counter, target, or member set returns.
- [ ] Run group scenes for ten minutes; inspect CPU, thermal state, memory, dropped frames, full-analysis cadence, and shutter latency.
- [ ] Inspect logs/storage/network and confirm no candidate/union rectangle, member set, counter, group history, image/base64, identity, relationship, importance, score, sensitive inference, or provider data is logged, persisted, or uploaded.
- [ ] Confirm request counts remain one body pose, one objectness, one horizon, one explicit-lock tracker, and zero contour; P19 adds no ARKit, Xiaoyi/provider call, Camera upload/route, auto-trigger, model, or automatic camera control/capture.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P18 - Explicit-lock Lead Room

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized membership includes `LocalAIComposeLeadRoomStability.swift` without manual project-file editing.
- [ ] Enable Compose, long-press one subject, and move that subject steadily toward the visible right for two full-analysis samples while keeping the phone stable; confirm automatic Lead Room can place the subject on the left third and softly mark the visible right side.
- [ ] Repeat leftward; confirm the subject target moves to the right third and the open-side tint/three dashed lanes move left only after two matching samples.
- [ ] Provide only one strong-direction sample, then stop or reverse; confirm Lead Room does not activate from one sample.
- [ ] Activate rightward Lead Room, provide one leftward sample, then return rightward; confirm the target does not flip. Hold leftward for two fresh matches and confirm it flips once.
- [ ] After activation, lose the detector match for one full-analysis sample; confirm the target remains. Lose it for a second sample and confirm automatic policy replans without stale direction.
- [ ] Move slowly in the active direction near the continuation threshold; confirm hysteresis prevents rapid policy/target flicker. Test hand tremor and near-stationary jitter; confirm they do not activate Lead Room.
- [ ] Pan or shake the phone while the locked subject is stationary; confirm P17 pauses and Lead Room direction/counters freeze. Settle for two full samples, then confirm only later fresh subject matches can change Lead Room.
- [ ] Track a moving subject using only visible P13 fast updates between detector callbacks; confirm the rectangle is smooth but Lead Room cannot enter, reverse, clear, or advance from fast callbacks alone.
- [ ] Present valid leading-line convergence at the same time; confirm Leading Lines retains priority. Remove it and confirm stable bounded Lead Room can become eligible.
- [ ] Test very small/large subjects and a subject too far from the opposite-third target; confirm automatic Lead Room stays bounded out while manual Lead Room remains available.
- [ ] Choose Lead Room manually without motion evidence; confirm a safe current-side target appears. Use target flip and confirm target, open tint, and dashed lanes all mirror together.
- [ ] Repeat front/back cameras and every supported lens; confirm visible subject direction, target side, tint, lanes, touch lock, and movement arrows agree after mirroring.
- [ ] Confirm `Lead room` / `前方留位` appears once in the policy menu and VoiceOver reads the policy without reading decorative lanes.
- [ ] Toggle Compose, unlock/reselect a subject, choose a photo, switch lens/camera, background/foreground, stop/reopen Camera, and return from capture; confirm no old motion direction or target returns.
- [ ] Run moving-subject scenes for ten minutes with bright/dark live filters; inspect CPU, thermal state, memory, dropped frames, full-analysis cadence, and shutter latency.
- [ ] Inspect logs/storage/network and confirm no velocity, threshold, direction history, trajectory, rectangle history, frame/image/base64, provider data, score, identity, activity, gaze, intent, destination, or sensitive inference is logged, persisted, or uploaded.
- [ ] Confirm request counts remain one body pose, one objectness, one horizon, one explicit-lock tracker, and zero contour; P18 adds no ARKit, Xiaoyi/provider call, Camera upload/route, auto-trigger, model, or automatic camera control/capture.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P17 - Motion-coherent AR Guidance Gate

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized membership includes `LocalAIComposeMotionGate.swift` without manual project-file editing.
- [ ] Enable Compose and hold the phone still; confirm normal target, arrow, horizon/level, Hold, and Ready behavior remains unchanged.
- [ ] Pan the phone slowly while a target exists; confirm the next full-analysis update shows the localized motion-pause card and centered gyroscope reticle, dims the existing grid, hides arrows/level lines, and retains the frozen target.
- [ ] Shake or translate the phone; confirm the same bounded pause appears without score, percentage, raw sensor value, harsh warning, or automatic shutter behavior.
- [ ] Start moving before any target exists; confirm subject geometry may remain visible but no target/policy grid is created or cached until the phone settles.
- [ ] Stop moving for one full-analysis sample; confirm pause remains. Hold through the second fresh sample and confirm guidance resumes once without flicker.
- [ ] During release, move again after the first stable sample; confirm release progress resets and two new stable samples are required.
- [ ] Test a device/simulator path where motion is unavailable; confirm unavailable never enters pause and two unavailable samples can release a previously simulated pause without trapping the UI.
- [ ] While paused, present/remove symmetry, leading-line, quiet-space, multiple-subject, and pose-edge evidence; confirm none enters, switches, clears, or advances until stable full-analysis samples resume.
- [ ] Long-press and track a subject, then move the phone; confirm P13 geometry may redraw but cannot update the motion gate, ambiguity, action, pose-edge, Hold, or Ready.
- [ ] Enter pause from Hold and Ready; confirm readiness clears immediately and no success haptic/capture fires. After release, fresh aligned evidence must rebuild Hold then Ready.
- [ ] Change manual policy or target side while moving; confirm no new target appears until release, then the chosen photographer override is respected.
- [ ] Repeat on front/back cameras, every lens, bright/dark live filters, and with an existing P16 Negative Space tint; confirm overlay mapping remains coherent.
- [ ] Perform intentional handheld/candid movement; confirm copy says it may stay part of the shot and does not call motion wrong, bad, blurry, or a failed photo.
- [ ] Toggle Compose, select a photo, switch lens/camera, background/foreground, stop/reopen Camera, and return from capture; confirm no stale paused state or sensor history returns.
- [ ] Run ten minutes while alternating stillness, slow pan, fast pan, and shake; inspect CPU, thermal state, memory, dropped frames, main-thread responsiveness, and shutter latency.
- [ ] Inspect logs/storage/network and confirm no acceleration/gyro axes, magnitude, normalized motion value, threshold, timestamp/history, frame/image/base64, provider data, score, identity, or sensitive inference is logged, persisted, or uploaded.
- [ ] Confirm request counts remain one body pose, one objectness, one horizon, one explicit-lock tracker, and zero contour; P17 adds no ARKit, Xiaoyi/provider call, Camera upload/route, auto-trigger, model, or automatic camera control/capture.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P16 - Scene-aware Negative Space

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized membership includes `LocalAIComposeQuietSpaceStability.swift` and the refactored luma analyzer without manual project-file editing.
- [ ] Enable Compose with a small bounded subject on the right and a visibly low-activity wall/sky area on the left; hold for two full-analysis samples and confirm automatic policy may become Negative Space with the subject target on the right third.
- [ ] Reverse the scene; confirm stable quiet-right evidence produces a left-third target only after two matching samples.
- [ ] Show one matching sample only, then return to balanced detail; confirm the policy does not activate from one frame.
- [ ] After activation, interrupt evidence for one full sample and restore it; confirm no target flicker. Clear for two full samples and confirm fallback planning resumes.
- [ ] Move from quiet-left to quiet-right and hold; confirm the old target survives the first opposite sample, switches once on the second, and action/Hold/Ready restart without losing an explicit subject lock.
- [ ] Aim at a blank wall and evenly detailed scene; confirm they do not become directional Negative Space evidence.
- [ ] Test similarly textured left/right foliage, fabric, grid, low light, motion blur, and high-grain scenes; confirm conservative no-direction behavior unless one side is repeatedly and clearly lower activity.
- [ ] Test a smooth gradient beside strong texture; confirm only the lower-activity side is treated as a bounded cue, without UI wording that calls it empty, uncluttered, or objectively better.
- [ ] Keep quiet-side evidence but use an extremely small/large subject or place it far from the opposite-third target; confirm automatic Negative Space remains bounded out.
- [ ] Present valid nearby leading-line convergence together with a quiet side; confirm Leading Lines retains priority. Remove it and confirm Negative Space/Symmetry/subject fallback can resume from fresh stable evidence.
- [ ] Choose Negative Space manually with and without active side evidence; confirm the target remains safe, the quiet-region tint is opposite the displayed target, and horizontal target flip updates both target and tint.
- [ ] Repeat on front/back cameras and every lens; confirm left/right evidence, mirrored target, movement arrow, target frame, and quiet-region tint agree with the visible portrait preview.
- [ ] Repeat with Original plus bright/dark live filters; confirm analysis remains based on the camera luma plane, overlay stays legible, and saved filter output is unchanged.
- [ ] Move a locked subject at P13 cadence; confirm fast tracking redraws geometry but cannot activate/switch/clear quiet-side evidence or advance Hold/Ready.
- [ ] Toggle Compose, select a photo, switch lens/camera, background/foreground, stop/reopen Camera, and return from capture; confirm no stale side returns.
- [ ] Run ten minutes with live filters and a locked subject; inspect CPU, thermal state, dropped frames, memory, main-thread responsiveness, shutter latency, and confirm P15/P16 use one 768-sample grid/lock rather than two.
- [ ] Inspect logs/storage/network and confirm no pixel/grid/activity/difference/ratio/side history, frame/image/base64, identity, confidence, score, or provider data is logged, persisted, or uploaded.
- [ ] Confirm existing full Vision requests remain one each, P13 remains one explicit-lock tracker, and P16 adds no new Vision request, second P15/P16 pixel lock, ARKit, Xiaoyi/provider call, Camera upload/route, direct provider access, or automatic camera control/capture.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P15 - Local Leading-line Convergence And Policy

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized membership includes `LiveGuidanceLumaConvergenceAnalyzer.swift` and `LocalAIComposeLeadingLineStability.swift` without manual project-file editing.
- [ ] Enable Compose in a textured corridor, road, bridge, railing, or architectural perspective scene with a bounded subject near the visible convergence; keep framing steady for two full-analysis samples and confirm automatic policy may become localized Leading Lines.
- [ ] Confirm the dashed four-ray grid converges on the same visible side/height as the perspective structure and the target remains inside the bounded viewfinder region.
- [ ] Show valid structure for one sample only and remove it; confirm Leading Lines does not activate from one frame.
- [ ] After activation, disturb structure for one sample and restore it; confirm the target does not flicker. Remove it for two full samples and confirm automatic policy falls back.
- [ ] Slowly move a valid convergence point within the continuation radius; confirm the active target stays stable rather than jittering every half second.
- [ ] Move to a clearly different convergence point and hold for two full samples; confirm the plan replaces once and action/Hold/Ready restart without losing an explicit subject lock.
- [ ] Test a blank wall, horizontal blinds, one isolated diagonal, regular grid/checker pattern, foliage/noisy texture, and clutter; confirm unavailable/not-observed behavior rather than false Leading Lines.
- [ ] Keep a valid convergence point but place the subject far from it, extremely small, or extremely large; confirm automatic policy remains bounded out.
- [ ] Present simultaneous symmetric corridor structure; confirm valid nearby Leading Lines takes precedence. Move the subject away from convergence but near center and confirm Symmetry/fallback can remain available.
- [ ] Select Leading Lines manually without detected convergence; confirm a safe centered target appears. When stable evidence appears/disappears, confirm only that manual plan is rebuilt.
- [ ] Confirm Leading Lines never presents target-side flip, while thirds and negative-space retain it.
- [ ] Repeat across front/back cameras and all lenses; confirm CPU top-down to Compose bottom-up Y conversion and front mirroring match the visible portrait preview.
- [ ] Repeat with Original and bright/dark live filters; confirm analysis remains based on the camera luma plane and overlay legibility does not alter saved filter rendering.
- [ ] Move a locked subject at P13 tracking cadence; confirm fast tracking redraws geometry but cannot activate/replace/clear Leading Lines or advance Hold/Ready.
- [ ] Toggle Compose, select a photo, switch lens/camera, background/foreground, and stop/reopen Camera; confirm no stale point returns.
- [ ] Run ten minutes across perspective/non-perspective scenes with live filters and a locked subject; inspect CPU, thermal state, dropped frames, memory, main-thread responsiveness, shutter latency, and the fixed 192-edge/18,336-pair ceiling.
- [ ] Inspect logs/storage/network and confirm no luma grid, gradient, edge, intersection, vote, weight, count, convergence history, frame/image/base64, identity, confidence, score, or provider data is logged, persisted, or uploaded.
- [ ] Confirm existing full Vision requests remain one each, P13 remains one explicit-lock tracker, and P15 adds no `VNDetectContoursRequest`, ARKit, Xiaoyi/provider call, Camera upload/route, direct provider access, or automatic camera control/capture.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P14 - Local Symmetry Evidence And Policy

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized file membership includes `LiveGuidanceLumaStructureAnalyzer.swift` and `LocalAIComposeSymmetryStability.swift` without manual project-file editing.
- [ ] Enable Compose on a clearly left/right-balanced architectural scene with visible texture and a bounded subject near the center; hold for two full-analysis samples and confirm automatic policy may change to localized Symmetry.
- [ ] Show the same scene for one sample only, then break the symmetry; confirm automatic policy does not enter Symmetry from one observation.
- [ ] After Symmetry is active, break the scene for one sample and restore it; confirm the plan does not flicker away. Break it for two full samples and confirm automatic policy returns to the previous geometry rules.
- [ ] Aim at a blank, evenly lit wall and a very low-texture dark scene; confirm they remain unavailable rather than being promoted to Symmetry.
- [ ] Keep a symmetric background but move the subject far from center, extremely small, or extremely large; confirm automatic Symmetry stays bounded out.
- [ ] Open the policy menu and choose Symmetry manually on an asymmetric scene; confirm the cyan center axis and paired dashed quarter guides appear and no left/right flip action is offered.
- [ ] Long-press a subject, then enter/leave automatic Symmetry; confirm the explicit subject lock and P13 tracker remain while target/action/Hold/Ready geometry restarts.
- [ ] Repeat on front/back cameras and every available lens; confirm the central axis and mirrored sampling behavior correspond to the visible portrait preview.
- [ ] Repeat with Original and several bright/dark live filters; confirm policy is based on the camera luma buffer and the overlay remains legible without affecting saved filter rendering.
- [ ] Move a locked subject at P13 tracking cadence while holding scene structure steady; confirm fast rectangle updates do not accelerate Symmetry entry/exit, Hold, or Ready.
- [ ] Toggle Compose off, select a photo, switch lens/camera, background/foreground the app, and stop/reopen Camera; confirm stale Symmetry state never returns.
- [ ] Run Compose for ten minutes across textured/symmetric/asymmetric/blank scenes; inspect CPU/thermal state, dropped frames, memory, main-thread responsiveness, live-filter contention, and shutter latency.
- [ ] Inspect logs/storage/network and confirm no luma pixels, sample grid, mirror/balance/dynamic/texture measurement, evidence history, preview image/base64, provider data, identity, confidence, or score is logged, persisted, or uploaded.
- [ ] Confirm the three existing full Vision requests remain one each, P13 remains one lock-only `VNTrackObjectRequest`, and P14 adds no Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, automatic camera control/capture, or model training.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P13 - User-lock Vision Sequence Tracking

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm synchronized file membership includes `LocalAIComposeVisionSequenceTracker.swift` without manual project-file editing.
- [ ] Enable Compose but do not lock a subject; confirm ordinary searching/candidate/policy behavior is unchanged and Instruments shows no object sequence request running.
- [ ] Long-press one highlighted or ordinary candidate; confirm the cyan locked frame begins following that selected subject more fluidly than the approximately 2 FPS detector cadence.
- [ ] Move the locked subject slowly left/right/up/down and toward/away from camera; confirm the frame follows without obvious half-second stepping, implausible jumps, or growing drift.
- [ ] Move quickly, occlude the subject briefly for one tracking sample, then reveal it; confirm one miss is tolerated without immediate reacquiring flicker.
- [ ] Occlude or leave frame long enough for two rejected tracking samples; confirm the locked frame enters the existing reacquiring state once rather than freezing or jumping to another subject.
- [ ] Let the full detector see the subject again; confirm it reseeds/reacquires the same-kind local lock and fast tracking resumes with no stale box flash.
- [ ] Cross two same-kind subjects; confirm private gating plus periodic detector correction avoids an obvious swap where possible and falls back to reacquiring instead of claiming identity.
- [ ] Unlock and immediately lock a different candidate; confirm updates from the first ephemeral seed never move the second subject frame.
- [ ] Repeat across front/back cameras and all available lenses; confirm overlay mirroring/orientation remains correct and camera/lens changes clear old tracking state.
- [ ] Repeat with Original and several bright/dark live filters, horizon cue, policy changes, target flip, tap focus/exposure, focal pinch, dual-focal frame drag, and shutter; confirm gesture/control behavior remains intact.
- [ ] Move into/out of target while tracking updates rapidly; confirm Hold and Ready still require the existing fresh full-analysis evidence and cannot complete at 12 FPS.
- [ ] Run for ten minutes with a locked moving subject; use Instruments to inspect CPU/GPU/thermal state, dropped frames, memory, main-thread responsiveness, and shutter latency. Confirm the queue discards late frames rather than accumulating work.
- [ ] Inspect logs/storage/network and confirm no raw frame, Vision observation, confidence, box, seed UUID, trajectory, identity descriptor, image/base64, or provider data is logged, persisted, or uploaded.
- [ ] Confirm only one `VNTrackObjectRequest` exists while explicitly locked, existing body/objectness/horizon detector counts remain unchanged, and no ARKit/Xiaoyi/provider call or automatic focus/exposure/capture is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P12 - Explicit Tap Focus And Exposure

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized Xcode project includes the existing edited Camera files without manual membership changes.
- [ ] Tap several visible points near the center and all four content edges; confirm a small accent reticle appears exactly under the finger, a light haptic occurs, and nearby/far subjects visibly refocus or exposure metering reacts where supported.
- [ ] Tap top/bottom or side black aspect-fit letterbox space; confirm no reticle, haptic, focus, or exposure change occurs.
- [ ] Repeat on front and back cameras and every available lens; confirm focus/exposure follows the visible tapped side, with no manual mirror inversion error.
- [ ] Repeat with Original plus bright/dark live filters; confirm the reticle remains visible and conversion still follows the underlying camera preview rather than filtered pixels.
- [ ] Enable Compose and repeat tap, long-press subject selection, pinch focal crop, policy menu, target flip, Hold, and Ready; confirm tap stays independent and the other gestures/actions still work.
- [ ] Confirm no Compose/Vision transition, subject detection, target change, Hold, Ready, lens switch, or camera switch triggers focus/exposure without an explicit tap or accessibility action.
- [ ] On hardware without one of the capabilities, confirm supported focus or exposure still applies; if neither applies or configuration locking fails, confirm a short neutral dashed reticle and warning haptic appear without a crash.
- [ ] Enable VoiceOver, focus the camera preview, invoke `Focus and expose at center`, and confirm the explicit center operation and temporary reticle work without exposing coordinates.
- [ ] Tap repeatedly, select a photo, send the app inactive/background, and return; confirm old reticles/tasks do not reappear and camera controls remain responsive.
- [ ] Run for ten minutes while alternating tap, Compose, front/back, lenses, filters, pinch, long press, and shutter; confirm no lock leak, frame backlog, excessive heat, memory growth, or shutter delay.
- [ ] Inspect logs/storage/network and confirm no tap/device point, focus/exposure state/history, preview frame, image/base64, prompt, identity, confidence, or score is logged, persisted, or uploaded.
- [ ] Confirm no new Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, automatic AI focus/exposure/zoom/capture, custom model/training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P11 - Visible Ambiguity Candidate Frames

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm no project-file membership change is needed because the P11 edits use existing synchronized files.
- [ ] Present two plausible people/objects for one analyzed frame only; confirm no candidate frames appear before the existing second fresh ambiguity sample.
- [ ] Keep both candidates through the second sample; confirm each receives a dashed cyan frame with an accent corner marker, the generic searching reticle is absent, and the localized highlighted-frame hint appears.
- [ ] Present five or six plausible candidates; confirm at most four frames are visible and only those highlighted candidates can be selected during confirmed ambiguity.
- [ ] Include a tiny candidate below the area floor; confirm it is neither highlighted nor selectable during confirmed ambiguity.
- [ ] Long-press inside each highlighted candidate in separate runs; confirm success haptic, immediate solid cyan lock on the chosen subject, alternative-frame removal, and normal target/action guidance resume.
- [ ] Long-press a visible but non-highlighted fifth candidate during confirmed ambiguity; confirm warning feedback/no lock rather than selecting an invisible option.
- [ ] Long-press empty preview space or aspect-fit letterbox space; confirm no candidate locks.
- [ ] Test overlapping candidate boxes; confirm the existing most-specific containing candidate rule applies when both highlighted boxes contain the point.
- [ ] Repeat on the front camera; confirm candidate frames mirror with the preview and a long press selects the visible framed subject rather than the opposite analysis coordinate.
- [ ] Allow ambiguity to clear for two fresh frames; confirm all candidate frames/hint disappear and automatic policy targeting resumes without stale geometry.
- [ ] Lock a subject, lose it, and reacquire it; confirm ambiguity alternatives do not leak into the existing reacquisition state.
- [ ] Verify frames with Original and bright/dark filters, portrait plus surrounding landscape UI, Dynamic Type, VoiceOver, Reduce Motion, and smaller supported screens.
- [ ] Confirm VoiceOver receives the localized long-press guidance but does not enumerate decorative frames as identities or numbered subjects.
- [ ] Run the ambiguity flow for ten minutes; confirm no frame backlog, excessive thermal rise, memory growth, stale frames, or shutter delay.
- [ ] Inspect logs/storage and confirm no candidate box/list/kind/history, touch point, frame, confidence, score, identity, prompt, image/base64, or provider data is logged or persisted.
- [ ] Confirm no new Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, automatic camera control/capture, custom model/training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P10 - User-steerable Policy And Target Side

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the existing synchronized target sees the P10 edits without manual project-file membership changes.
- [ ] Enable Compose and confirm a compact policy menu appears immediately beside the Compose toggle without colliding with the centered shutter, camera flip, or lens control on supported iPhone sizes.
- [ ] Open the menu before a subject is found; confirm AI/thirds/centered/negative-space choices are available but target-side flip is hidden.
- [ ] Select `AI choice`; confirm the displayed policy badge still follows the existing bounded local resolver.
- [ ] Select each fixed policy and confirm the policy badge/grid/target update immediately while the visible subject box remains on the same tracked subject.
- [ ] During a long-press subject lock, change policy; confirm the cyan lock and tracker remain active, target/action/Hold/Ready restart, and no second long press is required.
- [ ] With thirds and negative space active, choose `Flip target side`; confirm the target moves to the opposite visible side and the directional arrow points toward it on the back camera.
- [ ] Repeat target flip on the front camera; confirm visible target side and arrow direction remain consistent with the mirrored preview.
- [ ] Choose centered balance; confirm the flip action is hidden and the target stays at horizontal center.
- [ ] Flip twice on a stable subject; confirm the target returns to its original side without cumulative drift.
- [ ] Change policy or side while Hold/Ready is active; confirm readiness and haptic eligibility reset and require fresh aligned frames for the new plan.
- [ ] Switch lenses/cameras or allow ambiguity to clear/rebuild the target; confirm the selected policy preference and side remain session-stable while the detected subject plan updates safely.
- [ ] Disable then re-enable Compose; confirm policy resets to `AI choice`, side resets to default, no old subject lock/target/Ready survives, and nothing persists after app relaunch.
- [ ] Verify menu labels, selected checkmark, VoiceOver label/value, Dynamic Type, Reduce Motion, portrait plus surrounding landscape UI, bright/dark filters, and smaller supported screen widths.
- [ ] Confirm shutter remains available and policy/side selection never changes zoom, focus, exposure, crop, rotation, or capture automatically.
- [ ] Inspect logs/storage and confirm no policy preference, target side, selected candidate, geometry, frame, score/confidence, prompt, image/base64, or provider data is logged or persisted.
- [ ] Confirm no extra Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, custom model/training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P9 - Stable Hold-to-ready Completion

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target automatically includes `LocalAIComposeReadiness.swift`.
- [ ] Enable Compose on a clearly detected subject and move it into the target. Confirm the first fresh aligned analysis shows “Hold this framing for a moment,” an accent scope, and dashed outer target ring rather than mint Ready.
- [ ] Hold through the next fresh aligned analysis; confirm the target/cue becomes mint, aligned copy appears, and exactly one success haptic fires.
- [ ] Remain aligned for several more analyses; confirm Ready remains stable and the haptic does not repeat every frame.
- [ ] Move clearly outside alignment; confirm readiness clears. Return and verify a new hold frame is required before Ready and one new haptic is allowed only on the new Ready transition.
- [ ] Enter alignment for one frame, leave on the next, then return; confirm the two separated aligned frames do not combine into Ready.
- [ ] While holding for Ready, tap/toggle unrelated Camera controls, open/close a callout, or trigger a non-frame guide refresh; confirm none of these advances Hold to Ready.
- [ ] Create multiple-subject ambiguity for only one analyzed frame, then perform a UI refresh; confirm it does not counterfeit the second ambiguity sample. Repeat the same principle for one pose-edge sample and one pending action switch.
- [ ] Long-press a subject during an aligned scene; confirm target/readiness resets and the new selected-subject plan must gather fresh evidence.
- [ ] Switch lenses, switch front/back camera, disable/re-enable Compose, background/foreground the app, and select/clear a photo; confirm no stale Ready, haptic, sample count, target, or subject lock survives the relevant reset.
- [ ] Verify holding/Ready styling with Original and several bright/dark filters, front-camera mirroring, portrait plus surrounding landscape UI, Dynamic Type, Reduce Motion, VoiceOver, and silent mode as appropriate.
- [ ] Confirm the shutter remains available before, during, and after Ready; Compose never auto-captures or blocks a deliberate early/late capture.
- [ ] Run Compose for ten minutes and confirm no repeated haptic storm, frame backlog, thermal regression, memory growth, or shutter delay.
- [ ] Inspect logs/storage and confirm no frame sample, readiness counter/history, action proposal, geometry, haptic event, score/confidence, prompt, image/base64, or provider data is logged or persisted.
- [ ] Confirm no extra Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, numeric progress/countdown, automatic camera control/capture, training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P8 - Preview/Vision Orientation Contract

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target automatically includes `CameraFrameOrientationContract.swift`.
- [ ] With Original selected, enable Compose on the back camera and place one subject distinctly left, right, high, and low; confirm the subject box, target, movement arrow, pose-edge marker, and long-press hit all agree with the visible portrait preview rather than appearing 90 degrees away.
- [ ] Repeat on the front camera and confirm only display mirroring changes left/right; top/bottom and touch selection remain aligned.
- [ ] Select several live filters and confirm the Metal filtered preview has the same upright orientation and aspect-fit letterboxing as the native preview, with no additional 90-degree turn.
- [ ] Long-press inside the portrait image and then inside black letterbox space in both portrait and landscape interface orientations; confirm the image hit selects normally and the letterbox hit is rejected.
- [ ] Rotate the surrounding iPhone/iPad interface to landscape; confirm the current product contract stays a portrait 3:4 camera feed and all overlays remain aligned within that feed. Do not expect the camera content itself to rotate with the interface in P8.
- [ ] Exercise a scene horizon and asymmetric pose near each edge; confirm horizon sign/position and left/right/top/bottom markers correspond to the visible scene.
- [ ] Switch lenses and front/back cameras repeatedly; confirm orientation state updates without one stale or rotated analysis frame.
- [ ] Capture and save photos in portrait and surrounding landscape UI; confirm existing photo output behavior is unchanged and P8 affects live analysis/preview coordinates only.
- [ ] Run Compose plus a live filter for ten minutes and confirm no frame backlog, unexpected thermal regression, memory growth, overlay drift, or shutter delay.
- [ ] Confirm no pixel buffer, frame dimension history, raw Vision output, raw pose/geometry, touch point, prompt, image/base64, provider secret, or sensor stream is logged or persisted.
- [ ] Confirm no extra Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, automatic rotate/crop/zoom/capture, model/training path, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Local AI Compose P7 - Pose-edge Framing Guard

Mac/Xcode physical-device verification:

- [ ] Build and run on a physical iPhone; confirm the synchronized target automatically includes `LocalAIComposePoseFramingStability.swift`.
- [ ] Frame one standing person with at least five reliably visible pose points and move a confident head/wrist/ankle point within roughly 4.5% of the left edge; confirm one sample shows no cue and the second matching sample activates the optional leave-space action and a left orange marker.
- [ ] Repeat for right, top, and bottom edges; confirm only the affected edge markers appear and no skeleton/joint dot is drawn.
- [ ] Create a simultaneous large X/Y target error and pose-edge risk; confirm movement toward the composition target remains the primary action, then leave-space follows only after placement is close.
- [ ] Clear the edge for one Vision sample and return; confirm the active cue is held and clear is cancelled. Keep it clear for two samples; confirm the pose-edge state clears without stale marker/detail text.
- [ ] Change directly from one edge to another; confirm one different sample is held and the second matching sample changes the marker set.
- [ ] Test two simultaneous edges, such as top plus left, and confirm both markers are bounded inside the preview.
- [ ] Repeat left/right cases with the front camera; confirm the display marker mirrors horizontally while top/bottom remain unchanged.
- [ ] Long-press a body subject among multiple people; confirm only the matched body's current pose-edge flags drive the guard and a lost/ambiguous match shows reacquisition without stale edge markers.
- [ ] Test sitting, partially occluded, low-light, unusual-pose, close-up, and deliberately cropped scenes; confirm weak or fewer-than-five reliable points do not fabricate an edge warning and copy remains optional rather than declaring an error.
- [ ] Confirm face-only and salient-object guidance behaves exactly as P6 with no pose-edge cue.
- [ ] Verify the orange markers remain legible with all policies, movement arrow, target/subject frames, scene/device horizon, bright/dark live filters, Dynamic Type, and VoiceOver.
- [ ] Run Compose for ten minutes while profiling; confirm no extra Vision request, frame backlog, unacceptable thermal rise, memory growth, or shutter delay.
- [ ] Inspect logs/storage and confirm no raw joint, joint name, confidence, pose observation, edge sample history, selected body trajectory, frame, prompt, image/base64, score, identity descriptor, or sensitive inference is logged or persisted.
- [ ] Confirm no automatic zoom/pan/crop/rotation/capture, skeleton overlay, ARKit session, Xiaoyi/provider call, Camera cloud route, URLSession, provider key/SDK, preview upload, custom model/training, or production rollout is added.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-B - AVFoundation Depth Capability Probe

- [ ] Build and run the iOS app in Xcode.
- [ ] Open Camera with local guidance enabled on Simulator; confirm no crash and depth state safely falls back when unavailable.
- [ ] If a depth-capable iPhone is available, open Camera and confirm the app still starts without permission changes or raw depth prompts.
- [ ] Confirm no raw depth map, `AVDepthData`, depth image, face descriptor, GPS, EXIF, raw sensor stream, or sensitive attribute appears in logs/UI/history.
- [ ] Confirm no `AVCaptureDepthDataOutput`, depth delivery enablement, or portrait matte delivery enablement is active in product behavior.
- [ ] Confirm no Depth Anything / Florence / Core ML package / model file appears in the iOS bundle.
- [ ] Confirm no frame upload, Camera live cloud AI entry, provider/model key, SDK, endpoint, or direct provider/model call appears.
- [ ] Confirm capture/import, local filters, selected-photo review, mock save, and post-capture advisor behavior still work as before.
- [ ] Confirm backend/iOS upload payloads are unchanged.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C-PRE - Depth Anything V2 Small Core ML Sandbox Preflight

Backend no-runtime verification:

- [ ] Run `cd backend && npm run qa:depth-anything:preflight`.
- [ ] Run `cd backend && node --test tests/depth-anything-v2-small-coreml-sandbox-preflight.test.mjs`.
- [ ] Confirm output stays sanitized and reports `networkCallsMade:false`, `modelCallsMade:false`, and `productionReady:false`.
- [ ] Confirm no `.mlmodel`, `.mlpackage`, `.onnx`, `.tflite`, model weight, dataset, real photo, local config, raw depth/frame/image artifact, provider response, or generated raw report is staged.

Xcode check:

- [ ] Xcode runtime behavior should be unchanged by this preflight.
- [ ] Confirm no Depth Anything model appears in the iOS bundle.
- [ ] Confirm no Core ML runtime path or model package is added.
- [ ] Confirm no Camera live cloud AI entry, preview-frame upload, provider/model key, direct provider/model call, or upload payload change appears.
- [ ] Confirm Phase 21-A/B local camera behavior still builds/runs as before.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C - Depth Anything V2 Small Core ML Sandbox

Xcode check:

- [ ] Build the app in Xcode.
- [ ] Confirm `DepthAnythingV2SmallSandbox.swift` compiles.
- [ ] Confirm no `DepthAnythingV2Small.mlmodel`, `.mlmodelc`, `.mlpackage`, ONNX, TFLite, or MLX package appears in the iOS bundle.
- [ ] Confirm Camera opens as before and local Vision geometry/depth capability behavior from Phase 21-A/B is unchanged.
- [ ] Confirm the Depth Anything sandbox is disabled by default and not connected to live Camera runtime.
- [ ] Confirm no inference run, benchmark run, raw frame/depth/image logging, raw depth map persistence, preview-frame upload, Camera live cloud AI entry, provider/model key, direct provider/model call, or upload payload change appears.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C-R1 - Depth Anything Model Artifact Source and Xcode Benchmark Harness Gate

Backend no-runtime verification:

- [ ] Run `cd backend && npm run qa:depth-anything:artifact-gate`.
- [ ] Run `cd backend && node --test tests/depth-anything-v2-small-model-artifact-benchmark-harness-gate.test.mjs`.
- [ ] Confirm output stays sanitized and reports `networkCallsMade:false`, `modelCallsMade:false`, and `productionReady:false`.
- [ ] Confirm no `.mlmodel`, `.mlmodelc`, `.mlpackage`, ONNX, TFLite, MLX, model weight, checksum file, local model path, source URL, raw report, dataset, real photo, provider response, or local config is staged.

Xcode check:

- [ ] Xcode runtime behavior should be unchanged by this gate.
- [ ] Confirm no model artifact appears in the app bundle.
- [ ] Confirm no benchmark harness runtime, inference run, Camera integration, preview-frame upload, upload payload change, provider/model key, or production rollout appears.
- [ ] Confirm Phase 21-A/B/C app behavior still builds/runs as before.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C-R2 - Local-Ignored Depth Anything Artifact and Xcode Harness Draft

Xcode check:

- [ ] Build the app in Xcode.
- [ ] Confirm `DepthAnythingV2SmallBenchmarkHarnessDraft.swift` compiles.
- [ ] Confirm `ios-app/LocalOnlyModels/DepthAnythingV2Small/` contains only the committed README.
- [ ] Confirm no `.mlmodel`, `.mlmodelc`, `.mlpackage`, ONNX, TFLite, MLX, or model weight artifact is present or staged.
- [ ] Confirm the benchmark harness draft does not run inference or benchmark.
- [ ] Confirm Camera behavior remains unchanged.
- [ ] Confirm no preview-frame upload, Camera live cloud AI entry, provider/model key, direct provider/model call, upload payload change, raw frame/depth/image/path logging, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C-R3 - Depth Anything Artifact Verification and Benchmark Approval Request

Docs-only verification:

- [ ] Confirm `docs/phase-21-c-r3-depth-anything-operator-artifact-verification-and-physical-device-benchmark-approval-request.md` exists.
- [ ] Confirm the approval request says it does not approve execution by itself.
- [ ] Confirm the future C-R3-RUN scope requires operator-verified local ignored artifact, source/license/model-card/checksum verification, Xcode physical device only, hardware depth first, sanitized aggregate metrics only, and `productionReady:false`.
- [ ] Confirm no `.mlmodel`, `.mlmodelc`, `.mlpackage`, ONNX, TFLite, MLX, model weight, checksum file, source URL, local model path, raw report, dataset, real photo, provider response, or local config is staged.

Xcode check:

- [ ] Xcode runtime behavior should be unchanged by this approval request.
- [ ] Confirm no Depth Anything model artifact appears in the app bundle.
- [ ] Confirm no inference run, benchmark run, Camera integration, preview-frame upload, upload payload change, provider/model key, direct provider/model call, raw frame/depth/image/path logging, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-C-R3-RUN - Blocked Prerequisite Check

Docs-only blocked verification:

- [ ] Confirm `docs/phase-21-c-r3-run-depth-anything-physical-device-benchmark-blocked-prerequisite-check.md` exists.
- [ ] Confirm blocker buckets include missing exact approval phrase, missing local ignored Depth Anything artifact, Xcode unavailable in Windows environment, and missing physical-device benchmark environment.
- [ ] Confirm no `.mlmodel`, `.mlmodelc`, `.mlpackage`, ONNX, TFLite, MLX, model weight, checksum file, source URL, local model path, raw report, dataset, real photo, provider response, or local config is staged.
- [ ] Confirm no inference run, benchmark run, Camera integration, preview-frame upload, upload payload change, provider/model key, direct provider/model call, raw frame/depth/image/path logging, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.
## Phase 21-A3 - Live Vision Geometry Smoothness and Hint Stability Tuning

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera with local guidance enabled.
- [ ] Confirm lighting hints still respond to darker/brighter scenes.
- [ ] Move a person/face slowly near frame edges and confirm framing hints feel less jumpy.
- [ ] Move headroom near the top edge and confirm headroom hints do not flicker excessively.
- [ ] Move subject center/side slowly and confirm suggestions hold before changing.
- [ ] Confirm no Depth Anything inference, Core ML runtime execution, Camera cloud AI entry, provider/model key, direct provider/model call, preview-frame upload, raw frame/depth persistence, upload payload change, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R1 - Real-device Camera Controls and Preview Fixes

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Tap the flip-camera button and confirm the live feed switches between back and front cameras.
- [ ] Confirm the front-camera preview is mirrored like a normal selfie camera.
- [ ] Open the lens picker and confirm only lenses physically available on that iPhone are shown.
- [ ] On iPhone 13 without telephoto hardware, confirm the unavailable 77mm option is not shown.
- [ ] Tap each available lens option and confirm the live feed actually changes camera/lens.
- [ ] Capture a photo and confirm the viewfinder framing is no longer obviously zoomed compared with the saved/captured preview.
- [ ] Select a non-original filter while still in the live viewfinder and confirm the live feed appearance changes before capture.
- [ ] Capture with a selected filter and confirm post-capture rendering still uses the selected filter.
- [ ] Enable flash on a supported back camera, capture in a dim scene, and confirm hardware flash fires.
- [ ] Enable flash on front camera and confirm local screen flash appears.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence, Depth Anything runtime, Core ML inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R3 - Focal Framing Box Crop

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera and confirm normal preview, lens switching, live filter preview, and flash behavior from Phase 21-A3-R1 still work.
- [ ] Open Camera and confirm the preview is no longer zoomed/cropped compared with the captured-photo aspect.
- [ ] Confirm the focal framing box is hidden at base focal length until focal crop moves above base.
- [ ] Confirm the image inside the box is not magnified and looks exactly like the area outside the box.
- [ ] Drag the framing box around and confirm it moves freely while staying inside the visible photo preview area.
- [ ] Open the focal crop slider callout and confirm the slider changes box size continuously from the selected lens focal length to `100mm`.
- [ ] Move the control to around `50mm` on a `35mm` base and confirm the box size reflects a moderate crop region, not a live zoomed inset.
- [ ] Switch to `24mm` if available and confirm the crop lower bound becomes `24mm`.
- [ ] Switch to `77mm` only on devices where the lens is physically available and confirm the crop lower bound becomes `77mm`.
- [ ] Capture a photo and confirm the saved/selected result is only the area that was inside the framing box.
- [ ] Confirm the captured output does not include a PiP inset border, focal label, or the surrounding full frame.
- [ ] Tap the focal chip and confirm it opens focal crop controls only; it should not be required to turn the feature on.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond normal captured photo flow, Depth Anything runtime, Core ML inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R3-R1 - Dynamic Aspect Pinch Focal Crop

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera and confirm normal preview, lens switching, live filter preview, and flash behavior from Phase 21-A3-R1 still work.
- [ ] Confirm the preview remains the normal 1x camera feed and is not zoomed by the focal crop feature.
- [ ] Confirm the focal framing box is hidden at the selected lens/base focal length when Camera opens.
- [ ] Pinch out on the preview and confirm the transparent framing box automatically appears and resizes continuously.
- [ ] Pinch in and confirm the focal value clamps at the selected lens/base focal length and the box disappears completely at base.
- [ ] Confirm pinch cannot zoom out below the active lens/base focal length.
- [ ] Open focal crop controls and confirm `4:5`, `1:1`, and `3:4` aspect choices are available.
- [ ] Select each aspect and confirm the framing box dimensions reshape to that ratio instead of staying locked to `1:1`.
- [ ] Confirm the image inside the box is not magnified and looks exactly like the area outside the box.
- [ ] Drag the visible framing box and confirm it moves freely while staying inside the visible photo preview area.
- [ ] Move the slider above base and confirm it shows/resizes the box using the same limits as pinch.
- [ ] Move the slider back to base and confirm the box hides again.
- [ ] Capture with a visible box and confirm the saved/selected result is only the area inside the box.
- [ ] Confirm the captured output does not include a PiP inset border, focal label, or the surrounding full frame.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond normal captured photo flow, Depth Anything runtime, Core ML inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R4 - Realtime Filter Preview and Selfie Mirror Save

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera and confirm the base/original live preview still appears before selecting a filter.
- [ ] Select `Soft Warm 400` or another non-original filter and confirm the live viewfinder changes before pressing shutter.
- [ ] Capture with that filter and confirm the post-capture preview closely matches the live filtered viewfinder.
- [ ] Switch between multiple filters and confirm the live preview updates without needing to capture first.
- [ ] Confirm Camera FPS remains acceptable; if it stutters heavily, optimize the realtime renderer further.
- [ ] Switch to the front camera and confirm the live preview still behaves like a mirror.
- [ ] Confirm the front-camera mirror-save toggle appears only on the front camera.
- [ ] Capture with mirror-save off and confirm the saved/selected selfie source is unmirrored.
- [ ] Capture with mirror-save on and confirm the saved/selected selfie source is mirrored.
- [ ] Confirm Phase 21-A3-R3-R1 focal crop box, pinch, aspect, and capture-crop behavior still work with filtered live preview.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond in-memory rendering, Depth Anything runtime, Core ML model inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R4-R1 - Selfie Filter Preview Orientation Follow-up

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Select `Soft Warm 400` or another non-original filter.
- [ ] Switch from back camera to front camera and confirm the filtered live preview remains upright, not sideways/rotated.
- [ ] Confirm the filtered overlay fills the same preview area as the base camera feed and stays aligned with the grid.
- [ ] Confirm the front-camera live preview behaves like a mirror, with no double-mirror or upside-down effect.
- [ ] Switch back/front several times and confirm orientation remains stable.
- [ ] Capture with mirror-save off and on, and confirm only final saved/selected selfie orientation changes.
- [ ] Confirm Phase 21-A3-R3-R1 focal crop and Phase 21-A3-R4 filter preview parity still work.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond in-memory rendering, Depth Anything runtime, Core ML model inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R4-R2 - Selfie Capture Mirror Parity

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Switch to the front camera and confirm the mirror-save toggle is enabled by default.
- [ ] Capture a selfie and confirm the selected/captured photo matches the mirror-like viewfinder orientation.
- [ ] Tap `反轉相片` / `Flip photo` and confirm the selected camera photo flips horizontally.
- [ ] Tap `反轉相片` / `Flip photo` again and confirm it flips back.
- [ ] Repeat with a non-original filter and confirm the filtered preview flips consistently with the source image.
- [ ] Import a photo from the library and confirm the camera-capture flip action does not appear.
- [ ] Confirm Phase 21-A3-R4-R1 selfie preview orientation and Phase 21-A3-R3-R1 focal crop still work.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond in-memory rendering, Depth Anything runtime, Core ML model inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A3-R5 - Camera Runtime Polish and Stability Pass

Physical-device verification:

- [x] Operator reported MacBook/Xcode physical-device verification is temporarily OK after R5.
- [ ] Build and run on iPhone.
- [ ] On the front camera, enable flash and confirm shutter triggers the local screen-flash effect.
- [ ] On the back camera, confirm flash is enabled only when the active hardware camera reports flash support.
- [ ] On any camera/lens without flash support, confirm the flash button is dimmed/disabled and does not stay visually active.
- [ ] Switch between front/back cameras and available lens options; confirm unavailable flash state resets safely.
- [ ] Confirm Xcode no longer reports `AVCaptureSession startRunning` main-thread hang-risk warning during Camera startup/resume.
- [ ] Leave Camera open with a non-original live filter for at least 10 minutes and confirm the app is not killed for memory pressure.
- [ ] Capture with Original and a non-original filter; confirm live filter preview and captured result still align.
- [ ] Confirm selfie mirror-save default and post-capture `Flip photo` behavior still work.
- [ ] Confirm Phase 21-A3-R3-R1 focal box pinch/aspect/capture-crop behavior still works.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond in-memory rendering, Depth Anything runtime, Core ML model inference, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A4 - On-device Live Framing Hint UX Pass

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera with local guidance enabled.
- [ ] Confirm the compact guidance pill uses a category-specific icon for the current hint instead of always using sparkles.
- [ ] Expand the guidance panel and confirm the action label is `Next hint` / `下一個提示` in local guidance mode.
- [ ] When two visible local hints are shown, tap `Next hint` and confirm the hint order rotates.
- [ ] When only one local hint is shown, confirm the action is dimmed/disabled and does not break guidance state.
- [ ] Confirm the hint copy remains short, non-judgmental, mood-first, and does not use score/rating or retake-first wording.
- [ ] Confirm filter preview, selfie mirror parity, flash behavior, and focal crop still work.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence beyond in-memory rendering, Depth Anything runtime, Core ML model inference, Florence runtime, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A5 - Composition Guidance Ownership Boundary

Docs-only verification:

- [ ] Confirm `docs/phase-21-a5-composition-guidance-ownership-boundary.md` exists.
- [ ] Confirm docs state richer composition guidance belongs to the training-AI branch, not expanded app-side Camera runtime logic.
- [ ] Confirm iOS Camera remains limited to safe local geometry/depth signals, lightweight hint shell UX, and conservative fallback copy.
- [ ] Confirm no Swift runtime, provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence, dataset crawler, AI-assisted labeling run, user-photo training, Depth Anything runtime, Core ML model inference, Florence runtime, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A6 - App-side Composition Hint Suppression

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera with local guidance enabled.
- [ ] Confirm very dark / very bright scenes can still produce safe local lighting hints.
- [ ] Confirm eligible filter guidance can still appear when the selected preset does not already match the warm-filter rule.
- [ ] Confirm local unavailable fallback can still appear when no safe local signal exists.
- [ ] Move a face/person near frame edges and confirm app-authored subject-centering / edge-margin hints do not appear.
- [ ] Move a face/person near the top edge and confirm app-authored headroom hints do not appear.
- [ ] Move closer/farther from the camera and confirm app-authored face-distance / subject-size hints do not appear.
- [ ] Confirm portrait-ready, rule-of-thirds, and vertical-balance hints do not appear as app-authored runtime copy.
- [ ] Switch to Mock guidance, if available in the build, and confirm mock/sample suggestions no longer include subject-centering or headroom composition copy.
- [ ] Confirm `Next hint` still rotates remaining visible local hints when more than one remains.
- [ ] Confirm Camera capture, live filter preview, selfie mirror parity, flash, and focal crop behavior remain unchanged.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence, dataset crawler, AI-assisted labeling run, user-photo training, Depth Anything runtime, Core ML model inference, Florence runtime, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A7 - Camera Runtime Non-composition Polish

Physical-device verification:

- [ ] Build and run on iPhone.
- [ ] Open Camera with local guidance enabled.
- [ ] Confirm safe lighting / filter / unavailable hints can still appear.
- [ ] Confirm app-authored subject-centering, edge-margin, headroom, face-distance, subject-size, portrait-ready, rule-of-thirds, and vertical-balance hints remain suppressed.
- [ ] Create a scene where geometry is detected but no lighting/filter hint is visible, and confirm the expanded guidance surface falls back to the safe local-unavailable hint instead of appearing blank.
- [ ] Confirm compact local guidance does not show the `sparkles` icon when no visible suggestion is present.
- [ ] Confirm `Next hint` is disabled when only one hint is visible.
- [ ] Confirm Camera capture, live filter preview, selfie mirror parity, flash, and focal crop behavior remain unchanged.
- [ ] Confirm no provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence, dataset crawler, AI-assisted labeling run, user-photo training, Depth Anything runtime, Core ML model inference, Florence runtime, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A7-VERIFY - QA Handoff and Uninstalled App Feature Inventory

Docs-only verification:

- [ ] Confirm `docs/phase-21-a7-verify-camera-runtime-qa-and-uninstalled-app-feature-inventory.md` exists.
- [ ] Confirm the doc does not claim physical-device QA was run from Windows.
- [ ] Confirm the next recommended step remains operator MacBook/Xcode physical-device QA.
- [ ] Confirm the uninstalled app feature inventory clearly marks live cloud AI, Auto-Trigger, WSS, upload payload runtime, direct iOS provider/model calls, Depth Anything runtime, Florence runtime, dataset/labeling/fine-tuning runtime, and production rollout as not installed / blocked / separate future work.
- [ ] Confirm Camera-page Live Cloud AI / Live Advisor is marked no longer needed, while Inspiration / post-capture photo analysis, generated filters, and image editing remain future backend-mediated Cloud AI scope with no iOS provider keys.
- [ ] Confirm no Swift runtime, iOS project setting, provider/model key, direct provider/model call, Camera live cloud AI entry, preview-frame upload, upload payload change, raw frame/image/depth persistence, dataset crawler, AI-assisted labeling run, user-photo training, Depth Anything runtime, Core ML model inference, Florence runtime, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## Phase 21-A2 - Live Framing Aesthetic Spatial Codebook

Docs-only verification:

- [ ] Confirm `docs/research/live-framing-aesthetic-spatial-codebook.md` exists and is linked from `docs/research/on-device-ai-research-index.md`.
- [ ] Confirm the codebook uses Risk Signal, Strength Signal, Retro Intent Preservation, Advisor Action, and Safety Rejection codebooks instead of a good/bad photo scoring dictionary.
- [ ] Confirm severity/confidence/review buckets use `low | medium | high | unknown` or review status enums and no numeric quality score, 0-100 value, star rating, or good/bad photo label.
- [ ] Confirm the proposed label candidate JSON is documented as non-runtime only.
- [ ] Confirm no Xcode runtime behavior is expected to change.
- [ ] Confirm no new Swift runtime file, backend runtime file, model file, Core ML / ONNX / TFLite / MLX package, dataset crawler, provider labeling adapter, provider call, raw label, report, local config, real photo, upload payload change, Camera live cloud AI entry, or production rollout was added by this phase.
- [ ] Confirm `productionReady:false` remains unchanged.

Xcode check:

- [ ] No Xcode runtime behavior should change.
- [ ] No new Swift runtime file should be required for this docs-only phase.
- [ ] No model file should appear in the app bundle.
- [ ] No Camera behavior, permission, network, upload, or Photo Advisor flow should change.
- [ ] Existing app should build/run as before.

## PT2-SF-R9-R15-X1 - Xiaoyi Luna Relay Rebuild

Backend-only verification:

- [x] Keep SiliconFlow available as rollback; switch only after Luna returns a validated recipe `1.1`.
- [x] Confirm `CLOUD_AI_PROVIDER_MODE=xiaoyiLunaInternal` resolves the fresh `XiaoyiLunaRelayProvider`, not `XiaoyiDeepseekRelayProvider`.
- [x] Use only the external/server-side `XIAOYI_API_KEY`; never add it to iOS, Git, logs, screenshots, `.env.local`, or committed env files.
- [x] Replacement-key text smoke accepted HTTP 200, `choices[0].message.content`, `finish_reason:stop`, and the exact expected reply.
- [x] One ignored synthetic style-image request returned HTTP 200 with zero retries but failed recipe validation as `provider_invalid_schema`.
- [x] Add sanitized schema failure-code/field buckets and align `recipe_version` plus `id` without weakening the validator.
- [x] Require and receive a validated recipe `1.1` with all 12 parameters before enabling Luna.
- [x] Confirm backend route smoke succeeds on the first attempt and writes one ignored sanitized artifact.
- [x] Confirm the running HTTP endpoint returns `filter_generation` / `cloud` and localhost plus LAN health report Luna ready.
- [x] Confirm the backend receives only the synthetic/style reference image and never the apply/original image.
- [x] Confirm no raw prompt, request, response, image/base64, provider error text, Authorization header, or key appears in output or persisted artifacts.
- [x] Confirm Camera remains local-only, default/production remains mock/local, and `productionReady:false` remains unchanged.
- [ ] Re-test on the physical iPhone with the operator's target/original pair and long-press-save the after image for visual comparison.

## PT2-SF-R9-R16-R2 - General Adaptive Recipe v2 Tone Transfer

Backend/source-contract and Mac/Xcode multi-style verification:

- [x] Confirm the guard is Recipe v2-wide and contains no target image, subject, third-party preset, or recipe-ID special case.
- [x] Confirm the prompt treats `lumaCurve` as transferable primary tone intent and scene subject/brightness as non-style evidence.
- [x] Confirm alpha-aware source/tone-colour sampling uses only local 64-pixel-long-edge in-memory buffers over a 6×6 grid.
- [x] Confirm each tile requires at least 75% opaque samples, q25-q10 recoverable detail, and absolute-plus-relative low-chroma evidence.
- [x] Confirm at least three eligible/two damaged tiles are required and floor-index q75 has no worst-outlier boost.
- [x] Confirm full-tile sampled colours are pointwise transformed before aligned style q10; the packed strip does not run spatial `CIHighlightShadowAdjust`.
- [x] Confirm the adaptive cube preserves exact black/chromaticity, is identity at luma `>=0.24`, and caps maximum `ΔL` at `0.025`.
- [x] Confirm the piecewise mask is 144×144 (24 pixels per tile) before scaling and receives only 2...6 output-pixel feathering.
- [x] Confirm Recipe `1.1`, declared vignette, stochastic film effects, saturated shadows, and intentional low-key curves remain outside the guard.
- [x] Confirm intensity changes use a 100 ms debounce and stale tasks are cancellation-checked before renderer enqueue.
- [x] Confirm focused tests pass 10/10 and the full backend suite passes 429/429.
- [x] Confirm the offline approximation is documented as non-device evidence: q10 about `0.2176 -> 0.2178`, q50/saturation unchanged, and deep pixels about `7.80% -> 7.45...7.50%`.
- [ ] Build `ios-app/AIPhotoApp.xcodeproj` in DEBUG on Mac without Swift/Core Image errors.
- [ ] Retest the supplied reference/apply pair at 100%; confirm black fur and dark fabric regain texture without returning to the R16 gray veil.
- [ ] Check the saved result for mask Y-orientation errors, tile borders, halo/spill, colour shift, or accidentally weakened vignette.
- [ ] Test at least one warm faded, cool chrome, high-contrast/low-key, muted pastel, neutral, and saturated-neon reference.
- [ ] Apply each reference to both one bright/high-key and one dark/low-key source; confirm the look transfers without forcing every source toward the same exposure.
- [ ] Confirm a deliberately crushed-black luma curve remains visibly low-key and is not flattened by the guard.
- [ ] Confirm a faded/raised-toe curve stays faded and does not receive a duplicate lift.
- [ ] Confirm saturated red/blue shadow styling remains untouched by the low-chroma gate.
- [ ] Compare 0%, 50%, and 100%; confirm 0% remains exact source and 50% remains a true midpoint.
- [ ] Rapidly scrub intensity and repeat previews for ten minutes; confirm no stale preview, long queue, memory growth, or unacceptable latency under the 1600-pixel bound.
- [ ] Confirm no source/output sample, raw image/base64, prompt, request, provider response, key, or Authorization header is logged/persisted.
- [ ] Confirm the selected style/reference still uses only the existing consented backend path; apply/original and adaptive samples remain local, with no iOS provider call, Camera cloud entry, or production rollout.

## PT2-SF-R9-R16-R1 - Recipe v2 Compound Black-Floor Correction

Backend and Mac/Xcode physical-device verification:

- [x] Confirm the operator's newest supplied result represents Recipe v2 at 100% intensity.
- [x] Regress the saved real v2 recipe without reading or uploading a raw image or making a provider call.
- [x] Confirm R/G/B channel curves require exact black/white endpoints `0/1`, while the luma curve retains bounded endpoint ownership.
- [x] Confirm backend normalization and iOS validation use the same black-floor budget formula.
- [x] Confirm the saved recipe normalizes from negative contrast plus `fade:0.07` / `shadowLift:0.05` to `contrast:0`, `fade:0.048837`, and `shadowLift:0.034884`.
- [x] Confirm temperature/saturation intent and curve midpoints remain intact.
- [x] Confirm focused tests pass 94/94 and the full backend suite passes 428/428.
- [x] Restart backend and run one bounded target-only Luna request; the single-attempt recipe has compound black floor `0.0204` against budget `0.035` and writes only an ignored sanitized v2 artifact with all privacy flags false.
- [ ] Pull the changes on the MacBook and build `ios-app/AIPhotoApp.xcodeproj` without Swift/Core Image errors.
- [ ] Generate with the same target/reference and original/apply pair at 100%; confirm the corrected result is not globally gray/washed.
- [ ] Confirm the cat's dark fur and hanging dark fabric retain clear black separation without crushing detail.
- [ ] Confirm warm red/brown target direction remains visible without turning the blue/cyan wall into a global warm cast.
- [ ] Long-press-save the corrected 100% result and return it for measured/visual comparison.
- [ ] Recheck 0% and 50%; confirm 0% matches source and 50% remains a true midpoint.
- [ ] Confirm only the target/reference is uploaded; apply/original stays local and no raw artifacts, iOS provider key/direct call, Camera cloud entry, or production rollout appears.
- [ ] Confirm `productionReady:false` remains unchanged.

## PT2-SF-R9-R16 - Filter Lab Recipe v2

Backend and Mac/Xcode physical-device verification:

- [x] Confirm the strict backend schema/validator requires recipe `2.0`, fixed five-point curves, exact basis-weight keys, and bounded film values.
- [x] Confirm raw LUT data/URLs, arbitrary renderer names, shader/code fields, and malformed/non-monotonic curves are rejected.
- [x] Confirm zero-sum basis weights fall back to neutral and other accepted weights are normalized.
- [x] Confirm sanitized artifacts include only normalized v2 recipe fields plus safe metadata/privacy buckets.
- [x] Confirm backend/iOS source-contract, provider-boundary, artifact, fidelity, and QA tests pass 93/93.
- [x] Restart the backend with the external/untracked Luna key and confirm localhost/LAN health report Filter Lab ready with `productionReady:false`.
- [x] Run one bounded target-only request and accept strict recipe `2.0` in one attempt with a v2 sanitized artifact and all privacy flags false.
- [ ] Pull the phase on the MacBook, open `ios-app/AIPhotoApp.xcodeproj`, and build the DEBUG app without Swift or Core Image errors.
- [ ] Generate the same target/reference and original/apply pair; confirm recipe `2.0` is accepted without local fallback.
- [ ] Save `0%`, `50%`, and `100%` via long press; confirm 0% matches the original and 50% is visibly between original and full effect.
- [ ] Confirm deep blacks remain separated, warm red/brown colour remains targeted, and the blue/cyan wall is not turned into a global pale cast.
- [ ] Confirm halation stays around bright highlights instead of lifting the entire frame.
- [ ] Confirm grain size, roughness, and luminance response change texture independently and do not add coloured noise.
- [ ] Repeat preview/intensity changes for 10 minutes; confirm the 1600-pixel bound remains active and memory stays stable.
- [ ] Confirm only the target/reference image is uploaded; apply/original and the generated 17-cube remain local.
- [ ] Confirm no raw image/base64/prompt/request/provider response/error text, Authorization header, or key appears in logs/artifacts.
- [ ] Confirm no iOS provider key/direct call/SDK, Camera cloud entry, default cloud rollout, or `productionReady:true` appears.

## PT2-SF-R9-R15-X2 - Luna Real-reference Fidelity Correction

Backend and Xcode verification:

- [x] Confirm the first real-reference result has an over-lifted q10 black level and reduced contrast spread relative to the target photograph region.
- [x] Confirm the saved pre-fix recipe combined negative contrast, fade, and shadow lift.
- [x] Exclude white settings/share UI, QR codes, controls, borders, and captions from photographic tone/color estimates.
- [x] Keep Filter Lab image detail high while Photo Advisor remains low.
- [x] Reduce iOS `inputShadowAmount` mapping from `shadowLift * 1.8` to bounded `shadowLift * 0.55`.
- [x] Run two zero-retry target-only Luna calls; safely reject the first array-type mismatch and accept the second strict recipe `1.1` result.
- [x] Confirm the accepted recipe reduces fade to `0.06`, shadow lift to `0.04`, and restores contrast to `0.01`.
- [x] Confirm full backend suite passes 425/425 and LAN health remains Luna ready with `productionReady:false`.
- [ ] Update the Mac clone, build the changed iOS renderer, and run on the physical iPhone.
- [ ] Use the same target screenshot and original photo at 100% intensity.
- [ ] Confirm blacks remain substantially deeper, tonal separation returns, and the white haze is reduced.
- [ ] Long-press-save the new after image and return it for comparison.
- [ ] Confirm only the target reference is uploaded; the original/apply image remains local.
- [ ] Confirm no iOS provider key/direct call, Camera cloud entry, raw artifact leakage, or production rollout appears.

## PT2-SF-R9-R13 - Filter Lab Recipe Fidelity Calibration

Mac/Xcode physical-device verification:

- [ ] Build and run the DEBUG app on iPhone; confirm the updated renderer compiles without warnings or Core Image filter failures.
- [ ] Start the local backend and confirm the Filter Lab DEBUG health test reports reachable and ready before attempting Cloud generation.
- [ ] Select exactly one style/reference image and a separate apply/original image, accept the existing consent, and generate a Cloud recipe.
- [ ] Confirm the backend receives only the style/reference image and the apply/original image remains local to the device.
- [ ] Compare the generated result at the new default intensity `1.0`; confirm the first preview shows the complete generated recipe rather than a reduced-strength blend.
- [ ] With controlled warm/cool and green/magenta references, confirm temperature and tint directions match the displayed recipe semantics.
- [ ] Confirm exposure changes are not visibly doubled and that zero exposure stays neutral.
- [ ] Confirm nonzero grain is visible as bounded monochrome texture, zero grain adds no texture, and repeated preview renders do not produce objectionable flicker.
- [ ] Repeatedly change intensity and regenerate previews for at least 10 minutes; confirm memory remains bounded and the app is not terminated for memory pressure.
- [ ] Confirm the 1600-pixel import/preview bounds from R12 remain effective and before/after comparison still works.
- [ ] Confirm no raw image/base64, prompt, provider response, request body, provider error, secret, or Authorization header appears in app/backend logs.
- [ ] Confirm no provider key/direct provider URL or provider SDK is present in iOS, no Camera cloud AI entry appears, no upload payload expansion occurs, and `productionReady:false` remains unchanged.

Backend compatibility gate:

- [ ] Do not run a live provider test without a separate explicit approval.
- [ ] If separately approved, use one ignored synthetic style image, exactly one provider call, zero retries, sanitized report output only, and verify the deployed model accepts the `json_schema` response format.

## PT2-SF-R9-R14 - Filter Lab Local Preview Export

Mac/Xcode physical-device verification:

- [ ] Build and run the app on iPhone; confirm `FilterLabPhotoLibrarySaver.swift` is included automatically by the filesystem-synchronized Xcode group.
- [ ] Generate a Filter Lab result, wait for rendering to finish, and confirm the hint says to long-press the filtered/after image.
- [ ] Long-press only the original/before image and confirm no Photos save occurs.
- [ ] Long-press the filtered/after image and grant Add Photos access; confirm exactly one asset is saved and the success message appears.
- [ ] Compare the saved asset with the on-screen after preview at the same intensity and confirm their visible filter result matches.
- [ ] Inspect the asset dimensions and confirm the maximum long edge is at most 1600 pixels; this is a comparison preview, not a full-resolution export.
- [ ] Change intensity, wait for the preview to finish, long-press again, and confirm the newly saved asset matches the new intensity.
- [ ] Deny Add Photos access, long-press again, and confirm a localized denied message appears without a crash or network request.
- [ ] While preview rendering or Photos saving is active, confirm repeated long presses do not start duplicate saves.
- [ ] With VoiceOver enabled, invoke the named Save filtered photo action and confirm it follows the same local save path.
- [ ] Confirm no automatic/background save, backend/provider call, Firebase/history write, apply/original image upload, style-reference upload-count change, Camera cloud AI entry, provider key/URL/SDK, or production rollout occurs.
- [ ] Confirm `productionReady:false` remains unchanged.

## PT2-SF-R9-R15 - Filter Lab Sanitized Analysis and Fidelity Calibration

Mac/Xcode and backend verification:

- [ ] Build and run the DEBUG app on a physical iPhone; confirm recipe `1.1` decodes without a fallback and no Core Image filter fails.
- [ ] Confirm the result card shows all 12 parameters, including tint, shadow lift, highlight roll-off, bloom, and dust.
- [ ] With a faded-flash reference, confirm raised blacks retain shadow detail instead of producing crushed black regions.
- [ ] Confirm warm/magenta direction, highlight softness, and corner falloff visually follow the reference more closely.
- [ ] Confirm grain appears as fine uniform texture while dust produces separate sparse spots/short scratches; zero values add neither effect.
- [ ] Re-render and change intensity repeatedly for at least 10 minutes; confirm the R12 1600-pixel bound remains active and memory stays stable.
- [ ] Long-press the after preview and confirm the saved comparison asset matches the visible R15 preview.
- [ ] Leave `FILTER_LAB_SAVE_SANITIZED_ANALYSIS` unset/false and confirm no artifact directory/file is created.
- [ ] In ignored backend `.env.local`, set `FILTER_LAB_SAVE_SANITIZED_ANALYSIS=true`; only after a fresh provider-test approval, make one DEBUG Filter Lab request and confirm exactly one ignored JSON artifact appears under `backend/reports/filter-lab-sanitized-analysis/`.
- [ ] Inspect the JSON and confirm it includes the normalized recipe plus only provider/attempt/latency buckets and false privacy flags.
- [ ] Confirm the artifact contains no image, base64, raw prompt, raw request, raw provider response, Authorization header, API key, provider error text, or apply/original photo.
- [ ] Confirm only one style/reference image is sent to the backend and the separate apply/original image remains local.
- [ ] Confirm no provider key/direct provider URL/call or provider SDK exists in iOS, no Camera cloud AI entry appears, and production/default remains mock/local.
- [ ] Confirm `productionReady:false` remains unchanged.
