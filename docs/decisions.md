# Decisions

This file records important product and technical decisions.

## Decision 001 - iOS-first MVP

Status: Accepted

The MVP will target iOS first. Android and cross-platform expansion are future considerations.

## Decision 002 - Swift + SwiftUI

Status: Accepted

The iOS app will use Swift + SwiftUI. Native iOS frameworks are preferred because this is a camera-heavy and image-processing-heavy app.

## Decision 003 - Firebase-first backend

Status: Accepted

The MVP backend will use Firebase Auth, Firestore, Firebase Storage, Cloud Functions v2, Remote Config, and App Check.

## Decision 004 - Cloud Functions AI proxy

Status: Accepted

The iOS app must not call Gemini or OpenAI directly with client-side API keys. AI calls go through Cloud Functions server-side proxy and provider adapter.

## Decision 005 - Gemini for MVP photo analysis

Status: Accepted

The MVP default AI analysis provider is Gemini paid tier / GeminiAnalyzer for single-photo analysis and short advice.

## Decision 006 - OpenAI image/edit as future adapter

Status: Accepted

OpenAI image/edit integration is not required for MVP. Only adapter placeholders may be added when appropriate.

## Decision 007 - No true real-time cloud video AI in MVP

Status: Accepted

MVP will not stream camera frames to cloud AI in real time. Local Vision may be used for lightweight guidance. Cloud AI analyzes single photos after capture.

## Decision 008 - StoreKit 2 for MVP subscription

Status: Accepted

The MVP uses StoreKit 2 + StoreKit views. RevenueCat may be reconsidered later but is not the default.

## Decision 009 - No default model training consent

Status: Accepted

User photos should not be assumed to be used for model training. Any future training or model improvement usage must be separate, opt-in, revocable, and auditable.

## Decision 010 - No personalized ads SDK in MVP

Status: Accepted

The MVP will not include personalized ads SDKs. "No ads" can remain a future VIP benefit but should not add privacy complexity during MVP.

## Decision 011 - Bounded on-device AI Compose prototype

Status: Accepted on 2026-07-20 by explicit user request

The Camera may provide a user-invoked, local-only composition guide that turns existing Apple Vision geometry into a visual target frame, directional subject-placement hints, distance / zoom guidance, and an optional level line.

This decision supersedes the Phase 21-A5/A6 app-side composition-copy suppression only for this bounded prototype. It does not approve a custom model artifact, user-photo training, dataset crawling, sensitive inference, raw preview-frame persistence, preview-frame upload, cloud live AI, scoring, automatic shutter control, or production rollout. A learned composition model still requires a separate governed dataset / label / license / consent / human-review phase.

## Decision 012 - Local long-press subject lock and AR-style 2D overlay

Status: Accepted on 2026-07-20 by explicit user continuation

Local AI Compose may expose a bounded set of ephemeral Vision subject candidates and let the user long-press the live preview to select one. The lock may follow only the same local candidate kind near its previous center and must enter a reacquiring state rather than jump to a different subject when matching fails.

This is a 2D viewfinder overlay, so ARKit world tracking is not required. The user's conditional approval to use Xiaoyi `gpt-5.6-luna` does not require a provider call when local geometry is sufficient. This decision does not approve continuous frame upload, direct iOS provider access, a Camera cloud route, raw candidate/touch/frame persistence, identity tracking, face recognition, automatic capture, or production rollout.

## Decision 013 - Conservative temporal geometry matching for subject lock

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved local Compose work

The P2 nearest-center continuation may be replaced with an in-memory temporal matcher that combines a short motion prediction, screen-space rectangle overlap, relative size consistency, bounded reacquisition gates, ambiguity rejection, and rectangle smoothing. If two same-kind candidates are similarly plausible, the tracker must return no visible match and use the existing reacquiring state rather than guess.

This is geometric continuity only. It does not establish identity, recognize a face/person/object, store a trajectory, or authorize `VNTrackObjectRequest`, ARKit world tracking, a custom model, user-photo training, Xiaoyi/Camera cloud processing, automatic shutter control, or production rollout. All temporal state must clear with the current Compose/camera lifecycle and remain unlogged and unpersisted.

## Decision 014 - Explainable local composition-policy families

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

Local AI Compose may map ephemeral subject rectangle/kind geometry into one of three descriptive policy families: rule of thirds, centered balance, or negative space. The active family, target anchor, and target size must remain stable within the current plan, while confirmed multiple-subject ambiguity pauses automatic guidance and requests explicit long-press selection. Multiple-subject entry and exit use two-sample hysteresis.

These policies are optional creative starting points, not scores, ratings, defect labels, or claims of objective aesthetic quality. This decision does not approve scene/sensitive/identity inference, face recognition, user profiling, ARKit world tracking, Camera cloud/VLM calls, raw preview upload, geometry/policy persistence, automatic capture, a custom trained model, user-photo training, or production rollout.

## Decision 015 - Optional local Vision scene-horizon cue

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

While Local AI Compose is explicitly active, the existing throttled background Vision pass may run `VNDetectHorizonRequest` and expose only a bounded, half-degree-rounded angle after confidence/range gating. A local stability controller must require repeated evidence, smooth accepted continuation, tolerate only one missing sample, and clear stale state. The AR-style overlay may compare the detected scene horizon with a horizontal reference, while CoreMotion remains a fallback.

The cue must be optional creative context. It must not label deliberate tilt as a defect, score/rate the frame, rotate/crop/capture automatically, or block capture. Raw observations, confidence, transforms, frames, angle history, or sensor streams must not be logged, persisted, uploaded, or used for training. This decision does not approve ARKit world tracking, Xiaoyi/Camera cloud processing, identity/sensitive inference, custom models, or production rollout.

## Decision 016 - Stable dominant-error AR action guidance

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

Local AI Compose may resolve one typed action at a time by comparing normalized horizontal/vertical target displacement and then subject scale. The first action may appear immediately, while later switches require two agreeing samples and action-specific exit hysteresis. The 2D overlay may render a bounded directional arrow or nonnumeric zoom/space/aligned cue corresponding to the stabilized action.

Actions are optional manual guidance, not numeric scores or camera commands. This decision does not approve automatic zoom, pan, crop, rotation, capture, action/trajectory persistence, ARKit world control, Xiaoyi/Camera cloud calls, identity/sensitive inference, custom model training, or production rollout.

## Decision 017 - Conservative local pose-edge framing guard

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

The already-running human-body pose request may reduce high-confidence recognized points to an optional four-edge proximity bitmask. At least five reliable points and repeated temporal evidence are required before the guide may select the existing leave-space action or draw a short marker at an affected preview edge. Normal X/Y target placement remains the first action priority, and front-camera display swaps left/right flags.

This signal indicates only that a reliable visible pose point is close to a frame edge. It must not claim a limb is absent, cropped, defective, or aesthetically wrong. Raw joints, joint names, observations, confidences, histories, and trajectories remain inside the local analyzer and are not logged or persisted. This decision adds no skeleton overlay, extra Vision request, pose/identity recognition, automatic zoom/crop/capture, ARKit session, Xiaoyi/Camera cloud call, model training, or production rollout.

## Decision 018 - Explicit portrait pixel-buffer and Vision orientation contract

Status: Accepted on 2026-07-20 as a correctness hardening step for the user-approved Local AI Compose feature

The live video-data output may keep a 90-degree hardware rotation for the existing filtered-preview path. The capture service must record whether that physical rotation was applied and pass a typed buffer-orientation state to Vision: physically rotated portrait buffers use `.up`, while sensor-native landscape fallback buffers use `.right`. Preview rotation, filtered-preview fallback, overlay mapping, and long-press selection share one contract and normalized portrait 3:4 source size.

The current camera feed remains portrait and aspect-fit when the surrounding interface is landscape. Dynamic interface-following camera rotation is not part of this decision and must not be implemented piecemeal. This decision adds no frame upload/persistence, extra Vision request, automatic camera/capture action, ARKit session, Xiaoyi/provider call, Camera backend route, custom model/training, or production rollout.

## Decision 019 - Fresh-frame-only temporal evidence and stable Ready cue

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

Temporal composition controllers may advance consecutive-sample state only when a fresh local frame analysis arrives. User toggles, long-press selection, target/lens/camera resets, lifecycle refreshes, and ordinary view updates may redraw current state but must not count as new ambiguity, pose-edge, action-switch, or readiness evidence.

After raw and stabilized guidance both report alignment, one fresh frame produces a hold presentation and a second consecutive fresh aligned frame produces Ready. The UI may provide one local success haptic when entering Ready. Any non-aligned frame resets readiness. Ready is optional manual guidance, not a score, confidence, countdown, shutter gate, or automatic capture authorization. No temporal samples are logged or persisted. This decision adds no extra Vision request, ARKit, Xiaoyi/Camera cloud call, upload, automatic camera control/capture, custom model/training, or production rollout.

## Decision 020 - Session-only user steering over composition policy and target side

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

While Local AI Compose is active, the photographer may keep automatic local policy selection or explicitly choose thirds, centered balance, or negative space. For an active non-centered plan, the photographer may mirror the target horizontally. Centered balance remains horizontally invariant.

Changing the policy or target side starts a new target/action/readiness plan but must preserve the explicit subject lock and local temporal tracker. Preference is in-memory only, survives ordinary target recomputation during the active Compose session, and resets to automatic/default-side when Compose is toggled. The options are creative alternatives, not rankings or claims that one layout is best. This decision adds no new inference request, score/confidence, ARKit, Xiaoyi/Camera cloud call, upload/persistence, automatic camera control/capture, custom model/training, or production rollout.

## Decision 021 - Geometry-only confirmed ambiguity candidate affordances

Status: Accepted on 2026-07-20 as a bounded continuation of the user-approved Local AI Compose feature

After multi-subject ambiguity is confirmed by repeated fresh-frame evidence, Local AI Compose may display a bounded set of candidate rectangles so the existing long-press selection gesture is visually actionable. The candidate set must use one shared plausibility gate, deterministic order, and maximum of four for ambiguity detection, display, and confirmed-ambiguity hit testing. A hidden candidate must not remain selectable while the UI presents a different set.

The frames are temporary 2D geometry only. They must disappear after selection/ambiguity clear and expose no number, candidate kind, identity, face/person recognition, confidence, score, or quality ranking. They are decorative for accessibility; localized instruction text remains semantic. This decision adds no candidate/frame persistence or logging, new Vision request, ARKit, Xiaoyi/Camera cloud call, upload, automatic camera control/capture, custom model/training, or production rollout.

## Decision 022 - Explicit preview-layer tap focus/exposure only

Status: Accepted on 2026-07-20 as a bounded Camera-control continuation of Local AI Compose

The photographer may explicitly tap inside displayed camera content to request focus and exposure at that visible point. Letterbox space is not camera content and must be rejected. The live `AVCaptureVideoPreviewLayer` owns conversion from layer point to capture-device point so preview gravity, rotation, and front-camera mirroring stay inside AVFoundation's coordinate contract.

The active device must be capability-checked and held under `lockForConfiguration()` only while supported point/mode properties are set. The point is set before auto/continuous mode, and the lock is always released. The visible reticle is short-lived and carries no score or promise of sharpness. A VoiceOver user may invoke an equivalent explicit center-focus action.

Local AI Compose, Vision detections, subject locks, Hold/Ready, and policy changes must never trigger this hardware method automatically. Tap points and focus/exposure state must not be logged, uploaded, or persisted. This decision adds no ARKit session, Xiaoyi/provider call, Camera route/upload, automatic capture, model/training path, or production rollout.

## Decision 023 - User-lock-only local Vision sequence tracking

Status: Accepted on 2026-07-20 as a bounded responsiveness continuation of Local AI Compose

After the photographer explicitly long-presses and locks one visible subject candidate, Camera may run one local `VNTrackObjectRequest` between the slower full-scene detection samples. The request must run on the existing background frame queue with a fixed cadence ceiling and late-frame discard preserved. It must stop when no explicit lock seed exists.

The full detector remains authoritative and periodically reseeds the sequence to correct drift. Each seed uses a new temporary callback token plus seed-local monotonic update index; they distinguish sequence generations/order only and must never become a person/object identity, persistent identifier, analytics field, or UI label. Stale or reordered updates are ignored. Bounded private confidence/geometry checks and repeated misses must return the UI to existing reacquiring behavior rather than guessing.

Sequence updates may smooth and redraw the locked rectangle, but may not count as full analyzed-frame evidence for ambiguity, action hysteresis, pose-edge state, Hold, or Ready. Raw frames, observations, confidences, boxes, tokens, and trajectories must not be logged, uploaded, or persisted. This decision adds no face/identity recognition, ARKit session, Xiaoyi/provider call, Camera route/upload, automatic focus/exposure/capture, custom model/training, or production rollout.

## Decision 024 - Bucket-only local symmetry evidence

Status: Accepted on 2026-07-20 as a bounded scene-structure continuation of Local AI Compose

While Local AI Compose is explicitly active, the existing throttled full-frame background pass may sample a fixed sparse set of mirrored points from the full-range bi-planar luma plane. Mirror difference, left/right mean balance, dynamic range, and local texture must stay inside the analyzer; only `observed`, `notObserved`, or `unavailable` may leave that call. Blank or low-texture scenes return unavailable rather than being treated as useful symmetry.

Automatic Symmetry may activate only after two fresh full-analysis observations and only for a bounded, near-center subject. Two fresh clear/unavailable samples remove the preference. A state transition may rebuild target/action/readiness geometry but must preserve an explicit photographer subject lock. Symmetry is also available as a manual creative alternative with a central-axis 2D guide and no horizontal target flip.

This is explainable structural evidence, not semantic scene understanding, aesthetic scoring, or a claim that symmetry is best. Raw pixels, sample grids, measurements, histories, and evidence must not be logged, uploaded, or persisted. This decision adds no Vision request, ARKit session, Xiaoyi/provider call, Camera route/upload, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 025 - Bounded local leading-line convergence evidence

Status: Accepted on 2026-07-20 as a bounded scene-geometry continuation of Local AI Compose

While Local AI Compose is explicitly active, the existing throttled background path may reduce a fixed-resolution full-range luma grid to strong local edge directions, bounded pairwise intersections, and one optional convergence point. Spatial edge caps, intersection-region/extension gates, direct radial support, multiple support sectors, and divergent orientation families must bound both work and false-positive risk. Only `observed`, `notObserved`, or `unavailable` plus one bounded normalized point may leave the analyzer; all grids, gradients, edges, intersections, votes, weights, counts, and intermediate statistics remain private and ephemeral.

Two nearby fresh full-analysis observations are required before the point becomes active. Nearby continuation keeps a stable target, two consistent distant observations may replace it, and two clear/unavailable samples remove it. Automatic Leading Lines may be chosen only for a bounded subject sufficiently near the active point. It is also a manual creative alternative with a centered fallback and explanatory 2D guides. A point transition may rebuild the relevant target/action/readiness plan but must preserve explicit photographer subject lock/tracking.

Leading Lines is optional perspective context, not a score, semantic scene label, or claim that the composition is best. Fast tracker callbacks cannot count as scene evidence. This decision adds no contour or other Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, direct iOS provider access, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 026 - Bucket-only local quiet-space side evidence

Status: Accepted on 2026-07-20 as a bounded scene-structure continuation of Local AI Compose

While Local AI Compose is explicitly active, the P15 luma pass may reuse its fixed 24×32 logical portrait grid and read-only Core Video lock to compare local activity in fixed left and right zones. Active-side floor, absolute side difference, and quiet-to-active ratio must remain private. Only `observed`, `notObserved`, or `unavailable` plus one horizontal side bucket may leave the analyzer; pixels, activity measurements, ratios, grids, and histories remain ephemeral.

Two matching fresh full-analysis observations are required before a side becomes active or switches. Two clear/unavailable samples remove it, and P13 fast tracker callbacks never count as scene evidence. Automatic Negative Space may use the evidence only for a bounded small subject close enough to the opposite-third target. Leading Lines retains higher priority. Manual policy and supported horizontal target flip remain photographer overrides, and an evidence transition must preserve explicit subject lock/tracking while rebuilding only the target/action/readiness plan.

The bucket means lower local luminance activity, not semantic emptiness, complete visual-clutter estimation, an aesthetic score, or a claim that the composition is best. This decision adds no new Vision request or pixel-buffer lock, ARKit session, Xiaoyi/provider call, Camera upload/route, direct iOS provider access, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 027 - Motion-coherent AR evidence gate

Status: Accepted on 2026-07-20 as a reliability continuation of Local AI Compose

The existing short-window CoreMotion monitor may combine in-memory user-acceleration and rotation-rate magnitudes into one `stable`, `moving`, or `unavailable` bucket for Local AI Compose. Raw sensor axes, magnitudes, normalized values, thresholds, timestamps, and histories must remain private to the monitor, clear on stop, and never be logged, persisted, uploaded, or displayed.

A fresh moving bucket must pause new target creation and all scene-policy, ambiguity, pose, action, Hold, and Ready evidence. Existing target and subject tracking geometry may remain visible/redraw, but fast tracker callbacks cannot advance the motion gate. Two fresh stable/unavailable full-analysis samples are required to release the pause. Unavailable hardware must not activate the gate or permanently block guidance.

The pause is a device-motion coherence state, not a blur detector, subject-motion inference, quality score, capture gate, or instruction that intentional handheld motion is wrong. The UI may use a nonnumeric 2D gyroscope reticle and optional wording. This decision adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, auto-trigger, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 028 - Explicit-lock Lead Room from bounded screen-space motion

Status: Accepted on 2026-07-20 as a bounded composition continuation of Local AI Compose

The existing full-analysis temporal matcher may reduce consecutive fresh, accepted matches for one photographer-locked subject to a coarse horizontal left/right/none bucket. Smoothed velocity magnitude, thresholds, candidate counters, boxes, and trajectories remain private, ephemeral, and must not be logged, persisted, uploaded, displayed numerically, or treated as a score.

Two matching full-analysis observations are required to activate or reverse direction, with continuation hysteresis and two weak/missing observations required to clear it. P13 fast tracking never counts as motion evidence. P17 device-motion pause freezes the controller so camera movement is not silently counted as subject movement. Automatic Lead Room remains bounded by subject area/proximity and below a valid Leading Lines cue in policy priority; manual policy and horizontal target flip remain photographer overrides.

The bucket means horizontal movement of selected screen-space geometry, not physical speed, gaze, intent, identity, activity, destination, story meaning, or aesthetic quality. This decision adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 029 - Photographer-selected bounded Group Balance

Status: Accepted on 2026-07-20 as a multi-subject composition continuation of Local AI Compose

The photographer may explicitly choose Group Balance to treat the existing bounded P11 candidate set as one temporary composition union. The app must not automatically infer that visible candidates form a social or semantic group. At least two and at most four plausible rectangles may contribute, with strict union area/dimension gates.

Two compatible fresh full-analysis observations are required for activation or distant replacement. Compatible continuation may be smoothed. One missing observation may preserve display continuity, but a retained miss or pending replacement must not advance action, Hold, or Ready; a second miss clears the group. P17 device-motion pause freezes evidence and P13 fast tracking cannot update it. Selecting group mode clears an individual lock, while explicitly long-pressing an individual exits group mode to automatic single-subject guidance.

The union is ephemeral geometry, not identity, face recognition, relationship inference, social grouping, importance, attractiveness, or quality scoring. This decision adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, geometry history, persistence, automatic camera control/capture, custom model/training, sensitive inference, or production rollout. `productionReady:false` remains locked.

## Decision 030 - Synchronized hardware-depth layer cue

Status: Accepted on 2026-07-20 as a capability-gated spatial continuation of Local AI Compose

When the active AVFoundation camera format exposes compatible hardware depth, Camera may add one local `AVCaptureDepthDataOutput` and pair it with the existing video output through `AVCaptureDataOutputSynchronizer`. Unsupported formats, output-configuration failures, and dropped depth frames must preserve the existing RGB/Vision/filtered-preview fallback rather than blocking Camera.

One synchronized absolute depth map may be converted to `DepthFloat32` and sparsely sampled around the current Vision subject rectangle on the existing throttled full-analysis path. Raw depth pixels, metric values, validity ratios, medians, sample points, and thresholds remain private to that call. Only coarse distance, foreground/background separation, and confidence buckets may cross the analyzer boundary. No metric distance or confidence is displayed.

Two reliable strong-separation full-analysis samples are required before a subtle depth-layer cue appears; one clear sample is tolerated and the second removes it. P17 device-motion pause freezes the controller. Group Balance must hide the single-subject cue because its union does not share the primary subject depth sample. The cue is optional spatial context, not a portrait-mode guarantee, depth precision claim, face/body inference, bokeh action, score, quality judgment, focus/zoom command, shutter gate, or automatic capture signal.

Raw `AVDepthData`, depth maps, samples, history, geometry, or derived private measurements must not be logged, persisted, uploaded, sent to analytics, or used for training. This decision does not enable portrait-matte-only activation, Depth Anything/Core ML fallback, ARKit world tracking, Xiaoyi/provider calls, a Camera backend route, direct iOS provider access, automatic camera control/capture, or production rollout. `productionReady:false` remains locked.

## Decision 031 - Capture-first local AI workload protection

Status: Accepted on 2026-07-20 as a performance/reliability continuation of Local AI Compose

The existing local Camera frame path may reduce optional AI cadence when Low Power Mode is enabled or `ProcessInfo` reports fair thermal pressure. Under serious or critical thermal pressure it must preserve RGB preview and shutter priority by pausing Vision/luma/depth analysis plus explicit-lock sequence tracking, removing live depth, and emitting only a coarse thermal-pause state.

Nominal mode keeps the established 0.5-second full-analysis and 12 FPS tracking ceilings. Reduced mode uses 0.85 seconds and 8 FPS. Serious/critical protection enters immediately; leaving it requires a private five-second recovery dwell before a fresh analyzed frame may resume guidance. Renewed pressure cancels recovery. These numeric thresholds are implementation details and must not be displayed as temperature, timer, confidence, score, or health claims.

Entering protection must clear action, pose-edge, depth-layer, Hold, and Ready evidence. Existing subject/target geometry may remain dimmed for continuity but cannot advance. Preview, live filters, explicit focus/exposure, lens/camera controls, and manual shutter remain available and must never be gated by local AI thermal state.

Raw thermal state, transition timestamps, dwell timing, cadence calculations, or history must not be logged, persisted, uploaded, sent to analytics, used for profiling, or used for training. The mode does not infer blur, device damage, battery health, scene quality, or photographic quality. This decision adds no ARKit, Xiaoyi/provider call, Camera route/upload, direct iOS provider access, automatic camera control/capture, model/training, or production rollout. `productionReady:false` remains locked.

## Decision 032 - Ephemeral coarse depth occlusion for AR guides

Status: Accepted on 2026-07-20 as a bounded visual continuation of synchronized hardware depth

When P20 has reliable synchronized absolute hardware depth and one current full-analysis Vision subject rectangle, Camera may reduce a private subject-neighborhood depth test into one fixed 18-by-24 binary occupancy mask. The mask may contain only bounded cell indices; it must contain no metric depth, pixels, sample points, ratio, confidence, identity, class, or semantic label. Private cleanup may remove isolated cells and fill strongly enclosed cells. Empty, weak, oversized, unsupported, or Group Balance input must yield no active mask.

Two compatible full-analysis masks are required to activate or replace a distant mask. One missing sample may retain the current display and two must clear it. Motion-pause entry, thermal protection, camera/lens/Compose/selected-photo lifecycle changes, and Group Balance clear the mask. Fast sequence tracking cannot create occlusion evidence, and front-camera mirroring occurs only while mapping the fixed logical grid to display.

The mask may punch only composition-grid/tint pixels inside an isolated SwiftUI compositing group. Subject/target/action/readiness guides remain visible, and the mask must not change preview delivery, capture output, Core Image processing, focus, exposure, zoom, shutter, or automatic capture. No mask/depth/geometry is logged, persisted, uploaded, analyzed remotely, or used for training. This decision adds no ARKit session, Xiaoyi/provider call, Camera route, direct iOS provider access, semantic segmentation, custom model, or production rollout. `productionReady:false` remains locked.

## Decision 033 - Photographer-controlled True Subject Lock

Status: Accepted on 2026-07-20 as a stability correction to explicit local subject locking

A photographer's long press creates one session-only subject-relative lock. The throttled full detector remains authoritative for validating the same candidate through kind plus bounded center, area, overlap, and ambiguity gates. The faster `VNTrackObjectRequest` sequence may update display geometry and reconcile the current matcher reference, but it must not clear detector misses, create fresh action/Hold/Ready evidence, or silently establish a new subject.

Detector misses must not translate the stored box through prediction. Two may retain the current sequence display; the third enters lost/reacquiring. Sequence loss or authoritative loss clears transient action, pose, readiness, and depth/occlusion evidence while retaining the selected composition policy, target anchor, and target size. Recovery requires a compatible full-detector match near the locked geometry or a new explicit long press. A different plausible candidate must not be selected merely because it is the only or largest visible candidate.

After the initial locked plan is created, automatic symmetry, leading-line, quiet-space, lead-room, and ambiguity evidence must not rebuild it. Only an explicit photographer policy/side/new-subject/unlock action or a normal Compose/camera/lens/photo/lifecycle reset may change the plan. Full detector correction may reseed the sequence only after material drift; routine samples must not restart tracking.

This is a stable 2D subject-relative lock, not identity/re-identification and not an ARKit world anchor. A future world-relative Scene Lock requires a separate decision because it has different semantics, hardware/lifecycle cost, failure behavior, and privacy expectations. This decision adds no face/identity recognition, ARKit session, Xiaoyi/provider call, Camera route/upload, direct iOS provider access, automatic camera control/capture, raw geometry history, persistence, analytics, model/training, or production rollout. `productionReady:false` remains locked.

## Decision 034 - DEBUG-only Xiaoyi one-shot composition strategy

Status: Accepted on 2026-07-20 by explicit user request to try real Xiaoyi AI in Local AI Compose

After the photographer explicitly enables Local AI Compose and long-presses one subject, a DEBUG-only menu action may request fresh cloud consent and upload exactly one bounded, metadata-stripped preview JPEG through the backend to Xiaoyi `gpt-5.6-luna`. The provider may return only one strict enum plan covering scene family, existing supported composition policy, target slots/size, coarse distance/lens suggestion, safe reason code, and confidence bucket. Extra fields, free prose, scores/ratings, sensitive inference, chain-of-thought/provider leakage, and inconsistent policy/target geometry must fail closed.

The validated strategy becomes one frozen session-only P23 target. Continuous subject tracking, geometry comparison, arrows, Hold/Ready, preview, focus/exposure, zoom/lens choice, and shutter remain local and photographer-controlled. The plan must not trigger another request, automatic zoom/focus/exposure/lens switch/crop/capture, or a silent subject change. Failure preserves the local feature without applying a cloud plan.

This decision is a narrow exception to the prior Camera-local-only rule for an explicitly user-approved internal experiment; it does not approve a release/default Camera cloud entry, continuous frame/video streaming, background upload, auto-trigger, WebSocket, direct iOS provider call/URL/SDK/key, raw image/prompt/provider-response logging or persistence, model-training use, identity/sensitive inference, ARKit world tracking, or production rollout. Consent is per attempt, the backend is the only provider boundary, and `productionReady:false` remains locked.
