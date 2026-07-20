# 相機、復古濾鏡與圖片處理技術報告

## Local AI Compose P22-R1

P22-R1 is a focused Mac/Xcode diagnostic repair with no intended Camera runtime behavior change.

- `LocalAIComposeTemporalSubjectTracker.translated(...)` computes two local bounds before constructing its result, so it is not a Swift single-expression function. The normalized rectangle now has an explicit `return`, resolving both the build-blocking missing-return diagnostic and the associated unused-initializer warning.
- `CameraCaptureService` uses `@preconcurrency import AVFoundation`. This scopes the compatibility treatment to AVFoundation's legacy/incomplete `Sendable` annotations; it does not declare the service/session globally safe, move work to the main thread, or change start/stop sequencing.
- `AVCaptureSession.startRunning()` and `stopRunning()` remain on the existing dedicated serial `sessionQueue`. Preview, configuration, depth synchronization, capture, and lifecycle behavior are unchanged.
- Xcode's generic "Update to recommended settings" project notice is not a source compiler failure. It remains pending operator inspection because bulk-accepting it may change deployment, signing, asset, localization, or concurrency build settings beyond this repair.

P22-R1 adds no new AR/depth analysis, camera control, network/provider path, logging, persistence, upload, model/training, or production rollout. Camera stays local-only and `productionReady:false` remains locked.

## Local AI Compose P22

P22 makes the existing 2D AR composition grid visually respect a reliable hardware-depth foreground without turning Camera into a world-tracking or semantic-segmentation system.

- `LiveGuidanceDepthAnalyzer` may export one fixed 18-by-24 binary occupancy mask only when P20 already has absolute hardware depth, a current full-analysis Vision subject rectangle, `high` foreground/background separation, and adequate valid samples. Metric depth, pixel values, sample coordinates, ratios, and confidence never cross the analyzer boundary.
- Sampling is limited to an expanded neighborhood around the current subject. Private near/far bounds follow the subject median, isolated cells are removed, and cells surrounded by at least three cardinal neighbors are filled. Empty, weak, oversized, or unsupported results become no mask.
- `LocalAIComposeDepthOcclusionController` requires two compatible full-analysis masks before activation. Compatible continuation is stabilized, one missing sample is tolerated, two misses clear, and a distant replacement requires two mutually compatible samples. P13 fast tracker callbacks never create new mask evidence.
- P17 motion-pause entry, P21 thermal protection, Compose/camera/lens/selected-photo lifecycle resets, and Group Balance clear the spatial mask. Group Balance never reuses a single-subject cutout.
- The mask remains in logical portrait preview coordinates. The front camera mirrors only the display column, matching the existing preview/overlay contract without mutating or retaining source geometry.
- SwiftUI renders grid and tint inside one isolated compositing group and applies the foreground cells with `destinationOut`. Only the composition grid/tint is punched out; the subject outline, target frame, action, Hold, Ready, and depth-layer explanation remain above it.
- No mask changes the captured photo, Core Image recipe, focus, exposure, zoom, crop, shutter availability, or automatic-capture behavior. Weak/no depth keeps the ordinary overlay.

The implementation follows SwiftUI's documented isolated compositing and blend behavior: [compositingGroup()](https://developer.apple.com/documentation/swiftui/view/compositinggroup()) and [blendMode(_:)](https://developer.apple.com/documentation/swiftui/view/blendmode(_:)). Hardware acquisition remains the P20 AVFoundation path documented below.

The mask is ephemeral local display geometry, not a depth map, semantic subject mask, portrait matte, identity signal, quality score, analytics event, or training artifact. No raw/coarse mask, depth, or geometry is logged, persisted, uploaded, or sent to Xiaoyi. ARKit remains unnecessary because P22 has no world anchor, plane, mesh, camera pose, or persistent virtual object. Xiaoyi `gpt-5.6` remains suitable only for separately consented backend-mediated semantic still-image analysis, not frame-synchronous local occlusion. Camera remains local-only and `productionReady:false` remains locked.

## Local AI Compose P21

P21 makes local AR AI capture-first under power and thermal pressure instead of allowing optional analysis to compete indefinitely with preview, filter rendering, and shutter response.

- `LocalCameraAIWorkloadController` reads `ProcessInfo.thermalState` and Low Power Mode only on the existing background frame callback. It exports one `nominal`, `reduced`, or `thermallyPaused` bucket; raw OS state, transition timestamps, recovery timing, and cadence values remain inside the scheduler.
- Nominal mode preserves the existing `0.5`-second full Vision/luma/depth cadence and `12 FPS` explicit-lock sequence ceiling.
- Low Power Mode or `.fair` thermal pressure selects reduced mode: full analysis uses a `0.85`-second ceiling and explicit-lock tracking uses `8 FPS`. The same bounded analyzers and privacy contract remain; no quality or confidence meaning is attached to the mode.
- `.serious` or `.critical` enters thermal protection immediately. RGB delivery to filtered preview happens before this gate; Vision, luma, depth reduction, and P13 tracking are skipped. One bucket-only analysis callback clears app-side action/pose/Ready evidence and removes the depth output.
- Preview, live filter, focus/exposure controls, lens/camera controls, and shutter are not gated. The existing subject/target geometry may remain dimmed for continuity, but cannot advance or emit Ready.
- The overlay replaces motion cues with a localized orange thermometer reticle and explains that preview/shutter remain available. No numeric temperature, severity, timer, FPS, score, warning grade, or device-health claim is shown.
- Leaving serious/critical starts a private five-second recovery dwell. Reheating cancels the dwell; only a complete dwell resumes the current nominal/reduced tier, runs a fresh detector sample, and allows depth to be rebuilt.
- Disabling analysis or leaving Camera resets app-side pause presentation. The scheduler itself still rechecks the current OS state on the next frame, so toggling Compose cannot bypass thermal protection.

Apple exposes coarse thermal state and Low Power Mode through `ProcessInfo` and recommends reducing optional work as thermal pressure rises: [thermalState](https://developer.apple.com/documentation/foundation/processinfo/thermalstate-swift.property), [isLowPowerModeEnabled](https://developer.apple.com/documentation/foundation/processinfo/islowpowermodeenabled), and [Energy Efficiency Guide — Respond to thermal state changes](https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/RespondToThermalStateChanges.html).

P21 does not infer image blur, device damage, battery health, scene quality, or whether a photograph is good. It adds no thermal history/logging/analytics, ARKit session, Xiaoyi/provider call, Camera upload/route, automatic focus/zoom/capture, model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P20

P20 adds real, hardware-gated depth layers to the local 2D AR composition loop without introducing a world-tracking session or a learned depth fallback.

- Only while Local AI Compose needs live analysis, compatible active camera formats select a bounded depth format, prefer `DepthFloat32`, enable temporally filtered `AVCaptureDepthDataOutput`, and synchronize it with the existing `AVCaptureVideoDataOutput` on the existing frame queue. Disabling Compose or entering selected-photo mode removes the depth output.
- RGB preview delivery remains full cadence. Vision, luma structure, and depth reduction remain on the existing approximately 2 FPS full-analysis cadence. A dropped depth frame yields capability-only unknown buckets rather than blocking RGB analysis.
- Video and depth connections independently attempt the existing 90-degree portrait rotation. A typed depth orientation falls back to sensor-native landscape when the depth connection cannot rotate, keeping the Vision lower-left subject rectangle aligned with top-left depth rows.
- The private analyzer accepts only absolute hardware depth, converts it to `DepthFloat32`, sparsely samples an inset subject region plus a bounded surrounding ring, ignores invalid/nonfinite values, and reduces private metric medians/valid ratios to distance, separation, and confidence buckets.
- Distance bucket semantics are `low = near`, `balanced = middle`, and `high = far`. These labels and all metric thresholds stay internal; the UI never displays distance or confidence.
- The AR cue requires `high` foreground/background separation plus `balanced` or `high` confidence in two consecutive full-analysis frames. One clear sample retains it and the second clears. P17 motion pause freezes state, and Group Balance hides the single-subject cue.
- The output is a low-opacity pair of offset subject halos and a localized `Depth layers · on-device` badge. It is an optional spatial explanation, not a portrait-quality score, bokeh claim, capture gate, or automatic focus/zoom/shutter command.
- Lens/camera/session reconfiguration tears down the synchronizer and depth output before input replacement, then safely rebuilds it only when the new active format supports depth. The ordinary video delegate is restored for every no-depth fallback.

Apple's guidance uses a separate depth output, an active supported depth format, and synchronized video/depth delivery: [Streaming depth data from the TrueDepth camera](https://developer.apple.com/documentation/avfoundation/streaming-depth-data-from-the-truedepth-camera), [AVCaptureDataOutputSynchronizer](https://developer.apple.com/documentation/avfoundation/avcapturedataoutputsynchronizer), [activeDepthDataFormat](https://developer.apple.com/documentation/avfoundation/avcapturedevice/activedepthdataformat), and [Capturing depth using the LiDAR camera](https://developer.apple.com/documentation/AVFoundation/capturing-depth-using-the-lidar-camera). Filtering is deliberately enabled for a stable coarse cue and is not treated as precision measurement: [isFilteringEnabled](https://developer.apple.com/documentation/avfoundation/avcapturedepthdataoutput/isfilteringenabled).

Raw `AVDepthData`, maps, metric values, ratios, medians, sample points, and histories remain inside the local background call and are never logged, persisted, uploaded, displayed, sent to analytics, or used for training. Portrait matte capability alone cannot activate the cue. No Depth Anything model is enabled. ARKit adds no value because no world anchor, plane, mesh, occlusion compositor, or persistent 3D object is needed; Xiaoyi `gpt-5.6` adds latency/disclosure without improving synchronized hardware geometry. Camera remains local-only and `productionReady:false` remains locked.

## Local AI Compose P19

P19 adds a manual Group Balance path so a photographer can guide several visible subjects as one 2D composition without asking the app to infer social membership.

- The existing P11 candidate gate supplies at most four rectangles with deterministic area ordering. `LocalAIComposeGroupStabilityController` requires at least two and computes only their bounded normalized union.
- Union area must stay in `0.035...0.78`, with width/height at most `0.94`. This rejects one-subject input and an almost full-viewfinder accidental group before temporal state is considered.
- Two compatible full-analysis samples activate a group. Compatible continuation is smoothed; a distant replacement requires two compatible replacement samples. One absent/invalid sample retains the displayed group and the second clears it.
- Retained-on-miss and first replacement samples export `hasFreshActiveObservation:false`. They may prevent visual flicker but cannot advance pose/action/Hold/Ready evidence from stale geometry.
- Group state updates only while P17 says device motion is stable. P13 tracking callbacks do not enter the controller. Selecting Group Balance clears an individual lock and starts a fresh two-sample group acquisition.
- Group Balance is never returned by automatic policy selection. The photographer explicitly chooses it from the existing policy menu; long-pressing an individual while it is selected returns to automatic single-subject guidance.
- An active group uses a centered anchor, bounded target area `0.38`, expanded target maxima for the union aspect, no horizontal flip, a dashed cyan union frame with group badge, and a distinct central safe-region grid.
- Searching and privacy copy are localized. No member number/kind, confidence, score, relationship, identity, or ranking is exposed.

P19 treats the explicitly requested set of visible candidate rectangles as composition geometry only. It does not decide that people or objects belong together, identify them, preserve a group across sessions, or judge social relationship, importance, attractiveness, or photographic quality. It adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, rectangle/group history logging or persistence, automatic focus/exposure/zoom/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P18

P18 lets the 2D AR composition loop reserve visible space ahead of a user-locked subject whose horizontal screen-space movement remains stable.

- The existing approximately 2 FPS full-analysis temporal matcher already derives a bounded, smoothed normalized velocity from consecutive accepted detector matches. P18 consumes only its horizontal sign/magnitude after a fresh match; predicted misses and P13 fast tracker callbacks are not observations.
- `LocalAIComposeLeadRoomStabilityController` exports only left/right/none. Two matching samples at or above the private entry magnitude activate or reverse direction, a lower same-direction continuation magnitude adds hysteresis, one weak/missing sample is tolerated, and the second clears the active bucket.
- The controller updates only for an explicit subject lock and only while P17 says the phone is stable. A moving phone freezes Lead Room evidence with every other temporal controller so camera pan is not silently treated as subject movement.
- Automatic policy priority is bounded as Leading Lines, Lead Room, quiet-space Negative Space, Symmetry, then existing subject-geometry fallback. Lead Room accepts subject area `0.025...0.32` only when the corresponding opposite-third target is within `0.32` of the current center.
- Rightward image-space motion places the subject target on the left third and leaves the right side open; leftward motion does the reverse. The existing front-camera mapper preserves the visible relationship, while manual Lead Room and horizontal target flip remain photographer overrides.
- The overlay derives the open side from the displayed target, draws a low-opacity cyan region plus three dashed motion lanes, and keeps the ordinary subject/target/action/Hold/Ready loop. It displays no numeric velocity, confidence, trajectory, or ranking.
- Direction state resets with subject selection/unlock and all existing Compose/camera/lens/photo/lifecycle reset paths. It remains memory-only and session-only.

P18 detects only coarse normalized screen-space geometry for an explicitly selected track. It does not infer physical speed, gaze, pose intent, identity, activity class, destination, story meaning, or whether a composition is good. It adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, velocity/trajectory logging or persistence, automatic focus/exposure/zoom/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P17

P17 makes the AR guidance loop motion-coherent so a moving phone cannot silently count unstable frames as new composition evidence.

- `CameraCaptureDeviceSignalMonitor` keeps its existing approximately 12 Hz, maximum-36-sample, memory-only CoreMotion lifecycle. Each sample now also holds rotation-rate magnitude beside user-acceleration magnitude and is still cleared when monitoring stops.
- `composeMotionStability()` considers only a 500 ms window. It averages each magnitude, normalizes acceleration and rotation privately, uses the stronger signal, and exports only `stable`, `moving`, or `unavailable` through `LocalAIComposeMotionBucket`.
- The bucket deliberately combines the existing slight/shaky distinction into one AR `moving` state. Raw acceleration, rotation rate, normalized score, thresholds, sample history, and timing never enter the guide/UI or logs.
- `LocalAIComposeMotionGateController` enters pause immediately on a fresh moving full-analysis sample. While paused, a later moving sample resets release progress; two fresh stable or unavailable samples are required to resume. Unavailable hardware never activates the gate and can release a prior pause rather than trapping the UI.
- Pause freezes P5 horizon, P14 symmetry, P15 convergence, P16 quiet-side, multi-subject ambiguity, pose-edge, guidance-action, Hold, and Ready evidence. P13 sequence tracking may still redraw ephemeral locked-subject geometry but cannot advance the gate or any frozen evidence.
- If a target already exists it stays frozen and dimmed while the subject outline may move. If no target exists, the app does not choose/cache/show a new one until the gate releases. Entering pause clears action, pose-edge, and readiness state without clearing the explicit subject lock/tracker.
- The overlay hides movement arrows and level/horizon cues during pause, then renders a centered, decorative gyroscope-style 2D AR reticle. English/Traditional Chinese copy describes the pause and explicitly preserves intentional handheld motion.

CoreMotion exposes `CMDeviceMotion.userAcceleration` and `rotationRate` for local device-motion updates through `CMMotionManager`: [CMMotionManager](https://developer.apple.com/documentation/coremotion/cmmotionmanager), [CMDeviceMotion](https://developer.apple.com/documentation/coremotion/cmdevicemotion), [rotationRate](https://developer.apple.com/documentation/coremotion/cmdevicemotion/rotationrate), [userAcceleration](https://developer.apple.com/documentation/coremotion/cmdevicemotion/useracceleration). P17 measures device motion only; it does not claim image blur, subject motion, or photographic quality. It adds no new Vision request, ARKit session, Xiaoyi/provider call, Camera upload/route, raw sensor logging/persistence, auto-trigger, automatic focus/exposure/zoom/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P16

P16 makes the existing Negative Space policy respond to simple viewfinder structure instead of subject size alone.

- `LiveGuidanceLumaConvergenceAnalyzer` now returns a combined luma-composition result. P15 convergence and P16 side activity reuse the same 24×32 logical portrait grid, the same `.readOnly` Core Video lock, and the same approximately 2 FPS Compose full-analysis callback.
- P16 compares columns `1...8` and `15...22` across the thirty interior rows. Each cell contributes the average absolute horizontal and vertical luma difference, giving a fixed 240 comparisons per side regardless of camera resolution.
- Private active-side floor, absolute side-difference, and quiet-to-active ratio gates reject blank and similarly textured halves. Only `observed`, `notObserved`, or `unavailable` plus a left/right bucket leaves the analyzer; luma values, activity values, ratios, grids, and histories do not.
- `LocalAIComposeQuietSpaceStabilityController` requires two matching fresh full-analysis observations before activation or a side switch. One clear/unavailable sample is tolerated and the second removes the active side. P13 fast tracking never advances these counters.
- Automatic Negative Space remains bounded to subject area `0.020...0.14`; its target is placed on the third opposite the stable quieter side only when the current subject is within `0.34` of that target. Valid nearby Leading Lines still takes priority, then quiet-space Negative Space, Symmetry, and the established subject-geometry fallback.
- The target stays frozen until a stable side transition. Automatic or manually fixed Negative Space rebuilds target/action/pose/Hold/Ready geometry on that transition without clearing an explicit subject lock or P13 tracker.
- The 2D AR-style Negative Space grid softly shades the side inferred from the displayed target as the region to preserve. Front-camera mirroring follows the existing coordinate mapper, while the photographer can still choose another policy or flip a supported target.

This signal measures local luminance activity only. It does not determine that a region is semantically empty, visually uncluttered in every respect, or aesthetically better; richer visual clutter research includes feature congestion and other colour/orientation structure beyond this bounded cue ([Rosenholtz et al., 2007](https://citeseerx.ist.psu.edu/document?doi=c8318039383ab2963c3b7778db5f71fcb4a00f32&repid=rep1&type=pdf)). The pixel access follows Core Video's read-only lock and plane APIs: [CVPixelBufferLockBaseAddress](https://developer.apple.com/documentation/corevideo/cvpixelbufferlockbaseaddress%28_%3A_%3A%29), [CVPixelBufferGetBaseAddressOfPlane](https://developer.apple.com/documentation/corevideo/cvpixelbuffergetbaseaddressofplane%28_%3A_%3A%29). P16 adds no new Vision request/lock, ARKit, Xiaoyi/provider call, Camera upload/route, direct iOS provider key/call, raw artifact retention, automatic camera control/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P15

P15 adds one bounded local perspective-structure signal and a corresponding Leading Lines composition family.

- `LiveGuidanceLumaConvergenceAnalyzer` runs only on the existing approximately 2 FPS Compose full-analysis background path. It adds no Vision request and never runs on P13 fast tracking callbacks.
- The analyzer requires the configured full-range bi-planar buffer, uses a `.readOnly` Core Video lock, reads plane 0 only, and applies the P8 portrait/sensor-native orientation contract.
- A fixed 24×32 logical portrait grid produces a Sobel-style local gradient field. A 6×8 spatial partition retains at most four strongest edges per cell, bounding the working set to 192 edges and pairwise work to 18,336 pairs regardless of camera resolution.
- Edge pairs must be separated, directionally divergent, and have a bounded extrapolation. Only intersections in a bounded viewfinder region enter an 8×7 accumulator.
- The private peak must also receive enough direct radial edge support, sufficient support weight, multiple spatial sectors, and divergent orientation families. A single diagonal, horizontal bands, regular checker pattern, random texture, and blank scene therefore do not become leading-line evidence in deterministic fixtures.
- Only `observed`, `notObserved`, or `unavailable` plus one bounded normalized point crosses to the main actor. Grid pixels, gradients, edges, intersections, weights, counts, sectors, orientation bins, and measurements do not.
- CPU grid Y is converted from top-down pixel space to the existing Vision/Compose bottom-up normalized contract. The visible point is bounded to display X `0.14...0.86` and display Y `0.20...0.72` before conversion.
- `LocalAIComposeLeadingLineStabilityController` requires two nearby fresh full-analysis observations to activate. The active point stays frozen for nearby continuation; two consistent distant observations replace it and two clear/unavailable samples remove it.
- Automatic Leading Lines requires subject-center distance at most `0.26` and subject area in `0.025...0.55`. Valid convergence evidence takes precedence over the less specific symmetry bucket; otherwise P14/P4 policy fallback remains unchanged.
- Leading Lines is also a photographer-selectable creative alternative. Without active evidence it uses a safe centered manual target. The AR-style grid draws four dashed guides toward the target and does not offer horizontal flip.
- Entering, replacing, or clearing a leading-line point rebuilds automatic/Leading-Lines target, action, pose, Hold, and Ready state without clearing an explicit subject lock or P13 tracker.

This is explainable 2D perspective geometry, not semantic scene understanding or a photographic-quality judgment. Apple provides a contour request, but P15 deliberately avoids another full-frame Vision request and keeps fixed sparse work beside the existing detector set: [VNDetectContoursRequest](https://developer.apple.com/documentation/vision/vndetectcontoursrequest), [CVPixelBufferGetBaseAddressOfPlane](https://developer.apple.com/documentation/corevideo/cvpixelbuffergetbaseaddressofplane%28_%3A_%3A%29). P15 adds no ARKit, Xiaoyi/provider call, Camera upload/route, direct iOS provider key/call, raw artifact retention, automatic focus/exposure/zoom/crop/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P14

P14 adds one explainable background-structure signal and a corresponding symmetry composition family.

- `LiveGuidanceLumaStructureAnalyzer` runs only on the existing approximately 2 FPS full-analysis path while Compose is active. It adds no Vision request and never runs on the P13 fast-tracking updates.
- The analyzer requires the configured `kCVPixelFormatType_420YpCbCr8BiPlanarFullRange` buffer, takes a `.readOnly` Core Video lock, reads plane 0 only, and always unlocks with the same flag.
- Fourteen pair positions across eighteen rows sample mirrored luma outside the outer margin and a narrow central exclusion. The fixed 252-pair workload does not scale with image resolution.
- P8 orientation is applied to CPU sampling: portrait-rotated buffers use logical X/Y directly; sensor-native landscape maps the same logical portrait points through the `.right` rotation contract.
- Mirror difference, mean left/right balance, dynamic range, and local horizontal/vertical texture remain local variables. Only `observed`, `notObserved`, or `unavailable` crosses to the main actor.
- Low-dynamic-range or low-texture scenes return unavailable rather than labeling a blank wall as useful symmetry.
- `LocalAIComposeSymmetryStabilityController` requires two fresh full-analysis observations to activate and two not-observed/unavailable samples to clear. P13 sequence updates never call it.
- When automatic symmetry activation changes, only target/policy/action/pose/readiness geometry resets; explicit subject selection and its local tracker remain intact.
- Automatic symmetry requires active stable evidence, subject horizontal distance from center at most `0.24`, and subject area in `0.035...0.62`. Otherwise the prior face/body/object geometry rules remain authoritative.
- `LocalAIComposePolicy.symmetry` is also a photographer-selectable creative alternative. It targets the central axis, has bounded subject-fill targets, and does not support a meaningless horizontal flip.
- The AR grid distinguishes symmetry from centered balance with a cyan center axis and paired dashed quarter guides. The policy name is localized and no score/confidence is shown.

The analyzer retains no pixel, grid, histogram, metric, or evidence history beyond the two bounded counters. This is structural evidence, not an objective quality judgment or semantic scene understanding. It adds no new Vision request, ARKit, Xiaoyi/provider call, Camera upload/route, automatic focus/exposure/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P13

P13 adds a bounded Vision sequence tracker for the subject that the photographer explicitly locked in P2/P11.

- `LocalAIComposeVisionTrackingSeed` carries one ephemeral UUID plus one normalized box. Updates also carry a seed-local monotonic index. UUID/index gates reject stale or reordered callbacks after reseed/unlock and are not subject identities.
- `LocalAIComposeVisionSequenceTracker` creates a `VNDetectedObjectObservation` from that box, runs one `.fast` `VNTrackObjectRequest` with one `VNSequenceRequestHandler`, and uses the accepted observation to seed the next tracked frame.
- The tracker runs synchronously on the existing serial background frame-signal queue, never the main actor. `AVCaptureVideoDataOutput.alwaysDiscardsLateVideoFrames` remains enabled.
- Tracking has a 12 FPS ceiling and only runs while frame analysis is active and an explicit lock seed exists. The existing full Vision analysis remains at approximately 2 FPS.
- Each accepted full-detector match reseeds the sequence with a new ephemeral token. This supplies periodic drift correction and makes updates from the superseded sequence harmless.
- Confidence, finite/bounded-coordinate box, minimum side, bounded area, area-ratio, and maximum-center-jump checks remain private inside the background tracker. They are never displayed, logged, or persisted.
- One miss is tolerated. The second consecutive miss emits one `lost` update, clears the fast tracker, and lets the existing geometric detector/tracker recover through its normal reacquiring state.
- A bounded interpolation (`alpha 0.62`) smooths only the displayed tracked rectangle; raw Vision observations remain internal and are not stored beyond the active sequence.
- Main-actor sequence updates replace only the selected subject's display box while preserving its local kind and latest bounded pose-edge context.
- Fast tracking refreshes the guide with `consumesFreshFrameSample:false`, so it cannot advance ambiguity, action switching, pose-edge hysteresis, Hold, or Ready.

The sequence begins only from an explicit user lock and stops on unlock, lost tracking, Compose reset, lens/camera change, selected-photo transition, frame-analysis shutdown, or Camera lifecycle stop. It adds one tracking request only while locked, not an extra full-scene detector. There is no face recognition, identity descriptor, trajectory/history persistence, ARKit, Xiaoyi/provider call, Camera upload/route, automatic focus/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P12

P12 adds a user-initiated tap-to-focus and tap-to-expose path to the existing AVFoundation preview.

- `PreviewContainerView` owns the tap recognizer so it can ask the live `AVCaptureVideoPreviewLayer` to convert a visible layer point into the capture-device point-of-interest coordinate space.
- Before conversion, the shared portrait 3:4 coordinate mapper computes the displayed aspect-fit content rectangle. Taps in top/bottom or side letterbox space are ignored and produce no reticle or device change.
- Preview-layer conversion, rather than manual front-camera inversion, accounts for active layer size, `videoGravity`, rotation, and mirroring.
- `CameraCaptureService` verifies finite input, current device availability, point-of-interest support, and focus/exposure mode support before requesting a short configuration lock.
- Focus and exposure points are set before their automatic modes. `.autoFocus`/`.autoExpose` are preferred; continuous modes are conservative capability fallbacks.
- The SwiftUI camera shows a bounded 1.1-second reticle at the actual tapped display point. Applied focus/exposure gets the accent treatment and light haptic; unsupported or lock-failed hardware gets a neutral dashed treatment and warning haptic.
- The preview exposes a localized VoiceOver custom action that performs the same explicit operation at center.
- Reticle state and dismissal task clear on lens/camera switch, selected-photo transition, Camera disappearance, and inactive/background lifecycle.

The point and reticle are memory-only and are never logged or persisted. Local AI Compose does not call this method, so Hold/Ready, subject tracking, and policy changes cannot auto-focus or auto-expose. This adds no new Vision request, ARKit, Xiaoyi/provider call, Camera upload/route, model/training path, automatic zoom/capture, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P11

P11 adds a bounded display contract for the existing multi-subject ambiguity state.

- `LocalAIComposePolicyResolver.selectionCandidates` filters ephemeral `LiveFrameSubjectCandidate`s at area `>= 0.012`, sorts largest-first for deterministic bounding, and returns at most four.
- Ambiguity detection, visible candidate boxes, and confirmed-ambiguity hit testing all derive from that same function. A fifth eligible or any smaller candidate is not silently selectable while only four frames are shown.
- Candidate boxes cross to `LocalAIComposeGuide` only after the P9 fresh-frame-only ambiguity controller has confirmed multiple candidates.
- The guide additionally caps the geometry array to four and clears it in searching, reacquisition, normal guidance, selected-subject, action, and readiness states.
- `LocalAIComposeOverlayView` uses the same `mappedRect` helper as the subject/target, so portrait aspect-fit letterboxing, Vision Y inversion, P8 orientation, and front-camera mirroring stay consistent.
- The AR treatment uses dashed cyan outlines and small accent corner marks to distinguish alternatives from the solid cyan locked-subject frame.
- The candidate drawing is accessibility-hidden; the localized long-press instruction and hint remain the semantic output.

Only normalized rectangles leave the existing analyzer path. No candidate number/kind/identity/confidence appears in UI, logs, or storage. This adds no new Vision request, identity recognition, score, persistence, ARKit, Xiaoyi/provider call, Camera upload/route, automatic camera control/capture, training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P10

P10 separates local policy recommendation from user creative preference.

- `LocalAIComposePolicyPreference` is either `automatic` or a fixed existing policy. Automatic continues to call the bounded geometry resolver; fixed selection supplies the chosen family directly.
- `LocalAIComposePolicy` is now a three-case `CaseIterable`/`Identifiable` menu source: thirds, centered, and negative space. No new classifier or semantic label is introduced.
- `targetAnchor(...horizontallyFlipped:)` mirrors only the X coordinate of thirds/negative-space anchors. Centered anchors remain invariant at X = 0.5.
- The ViewModel exposes explicit policy-selection and target-side methods. Both clear target/action/pose/readiness geometry but never clear the selected candidate or tracker.
- Front-camera display behavior remains correct because flip occurs in analysis coordinates before the existing mirrored target mapping and display-action delta conversion.
- Preference and flip state are in-memory only. They survive target recomputation inside an active Compose session and reset when Compose is toggled.
- The compact SwiftUI menu appears only while Compose is on, marks the selected preference, hides target flip until an active non-centered policy exists, and keeps the shutter/control layout otherwise unchanged.

This is human steering over a heuristic, not an aesthetic score or claim that a composition is objectively better. It adds no extra Vision request, ARKit, Xiaoyi/provider call, upload/persistence, automatic camera action/capture, custom model/training, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P9

P9 adds the missing stable completion state to the live composition loop and makes temporal sampling truthful.

- The only call marked `consumesFreshFrameSample: true` is the frame-analysis callback after local Vision results arrive.
- Ambiguity hysteresis, pose-edge hysteresis, action-switch hysteresis, and the new readiness controller advance only inside that fresh-frame branch.
- Toggle/selection/reset/lifecycle refreshes may immediately redraw current state but cannot increment consecutive-sample counters.
- `LocalAIComposeReadinessController` requires two consecutive frames where both the raw proposed action and stabilized action are aligned. This prevents an action held by hysteresis from falsely extending Ready after raw geometry has departed.
- First aligned evidence maps to `holding`; second aligned evidence maps to `ready`. A non-aligned sample resets immediately to `inactive`.
- Holding draws a scope plus dashed outer target ring. Ready changes the target/cue to mint and emits one UIKit success haptic only on the non-Ready -> Ready transition.
- The short readiness color/cue transition honors Reduce Motion; the localized instruction remains available without animation.
- All readiness state is bounded, in-memory, nonnumeric, and cleared with target/lens/camera/Compose lifecycle resets.

This does not claim objective photo quality or guarantee a successful photograph. It adds no score, percentage, confidence, countdown, shutter gate, automatic capture/control, frame persistence/upload, extra Vision request, ARKit, Xiaoyi/provider call, model/training path, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P8

P8 defines one orientation contract for the portrait camera feed and fixes a likely double-rotation mismatch between AVFoundation and Vision.

- The app keeps `AVCaptureVideoDataOutput` at a 90-degree portrait rotation so its Core Image/Metal filtered-preview consumer continues to receive portrait buffers when hardware rotation is supported.
- The capture connection records whether physical rotation was actually applied. A physically rotated buffer maps to Vision `.up`; the sensor-native fallback maps to Vision `.right`.
- `FrameSignalState` carries only the typed orientation enum under its existing lock. It stores no image, frame metadata dump, or device history.
- The geometry analyzer, optional legacy face analyzer, and horizon request all use the same orientation supplied to their shared Vision handler.
- The native preview connection uses the same 90-degree constant. The filtered preview uses the same sensor-native fallback orientation only when its input dimensions are still landscape.
- Compose drawing and long-press hit testing share the same normalized portrait `3:4` source size, preserving aspect-fit letterbox rejection and coordinate parity.

Apple documents that a video-data output may deliver physically rotated `CVPixelBuffer`s after rotation is requested on its connection. Passing `.right` to Vision after that physical rotation would describe another 90-degree transform, so `.up` is correct for the rotated path while `.right` remains the unrotated fallback: [Apple Technical Q&A QA1744](https://developer.apple.com/library/archive/qa/qa1744/_index.html).

This phase deliberately does not make the camera feed follow interface landscape orientation. The current viewport stays portrait 3:4 inside any surrounding landscape UI; dynamic camera-orientation support requires a separate device-tested phase covering preview, filters, photo capture metadata, Vision, gestures, and saved output together. P8 adds no extra Vision request, ARKit, Xiaoyi/provider call, upload, persistence, automatic camera action, or production rollout. `productionReady:false` remains locked.

## Local AI Compose P7

P7 adds a conservative person-framing guard without adding another Vision request.

- The existing `VNDetectHumanBodyPoseRequest` keeps producing body boxes and now evaluates only recognized points at confidence `>= 0.55`.
- At least five high-confidence points are required before the analyzer can emit a four-edge bitmask; an edge is near when one of those points is within `0.045` normalized units of it.
- Raw recognized points, joint names, observations, and confidence values never cross the background analyzer. Only optional left/right/top/bottom flags attach to the ephemeral body candidate.
- The selected-subject temporal tracker carries the current matched candidate's pose flags while retaining its smoothed box; it does not store a joint trajectory.
- `LocalAIComposePoseFramingStabilityController` requires two identical nonempty samples before activation or edge-set replacement, holds one clear sample, and clears on the second.
- Stable pose-edge evidence never outranks an unresolved X/Y placement action. Once placement is inside tolerance, it selects the existing leave-space action before normal size guidance.
- The overlay renders a short orange marker on each affected preview edge and mirrors left/right flags for the front camera. The marker is decorative; the localized detail pill explains the optional reason.

This is an edge-proximity safeguard, not a claim that a limb is missing, cropped, or aesthetically wrong. It adds no skeleton overlay, extra Vision request, pose identity, sensitive inference, score, persistence, automatic zoom/crop/capture, ARKit session, Xiaoyi call, Camera upload/route, or training. Camera remains local-only and `productionReady:false` remains locked.

## Local AI Compose P6

P6 adds a typed, temporally stable action layer and direct AR movement cues.

- `LocalAIComposeGuidanceAction` represents one bounded action: move left/right/up/down, zoom in, leave space, or aligned.
- `LocalAIComposeGuidanceActionResolver` normalizes horizontal and vertical error by their own tolerances, selects the dominant placement error, then considers subject-to-target area ratio only after placement is within tolerance.
- Active aligned, movement, zoom-in, and step-back actions use separate exit thresholds so small boundary jitter does not immediately reverse the instruction.
- `LocalAIComposeGuidanceActionStabilityController` shows the first action immediately but requires two consecutive matching proposals before every later switch. A return to the active proposal cancels the pending change.
- Missing/reacquiring/multiple-subject states clear action history rather than displaying a stale arrow.
- The overlay renders movement as a bounded screen-space arrow from the current subject in the stable action direction. Zoom-in, step-back, and aligned states use centered nonnumeric symbols inside the target.
- Arrow direction follows the already-mirrored display action and mapped subject/target rectangles, while endpoint clamping keeps it inside the overlay.
- Cues are hit-test disabled and accessibility-hidden; localized instruction text remains the semantic VoiceOver output.

This is a local control policy over normalized geometry, not a composition score or automatic camera controller. It does not move optical/digital zoom, rotate/crop pixels, trigger the shutter, store action history, or upload any geometry. ARKit and Xiaoyi remain unnecessary for these 2D screen-space cues. Camera remains local-only and `productionReady:false` remains locked.

## Local AI Compose P5

P5 adds an image-content horizon cue without replacing the optional CoreMotion level fallback or introducing ARKit.

- `FrameSignalState` enables the horizon request only when the Camera frame-analysis loop is active and the user has explicitly enabled Local AI Compose.
- `LiveGuidanceVisionGeometryAnalyzer` performs `VNDetectHorizonRequest` on the existing background Vision queue after the face/body pass. Failure does not discard subject analysis.
- Observations require bounded confidence, finite angle, and an absolute angle no greater than 25 degrees. Confidence and the raw observation never cross actors; the angle is rounded to 0.5-degree steps.
- Horizon-only samples are delivered even when no subject is found so stability can advance or clear instead of retaining stale state.
- `LocalAIComposeHorizonStabilityController` requires two agreeing detections before activation, smooths bounded continuation, requires two agreeing samples before a large replacement, holds one missing sample, and clears on the second.
- The front-camera display negates the horizon angle to match its mirrored preview.
- The overlay draws a cyan/mint detected-horizon line over a dashed horizontal reference. When stable scene horizon is present it replaces the device-roll line; CoreMotion remains the fallback.
- Horizon copy is deliberately optional and never becomes the primary composition instruction, capture gate, score, or automatic rotation.

Apple documents `VNDetectHorizonRequest` as the image-analysis request for determining horizon angle and `VNHorizonObservation` as its angle/transform result. Vision observations inherit normalized confidence from `VNObservation`: [VNDetectHorizonRequest](https://developer.apple.com/documentation/vision/vndetecthorizonrequest), [VNHorizonObservation](https://developer.apple.com/documentation/vision/vnhorizonobservation), [VNObservation confidence](https://developer.apple.com/documentation/vision/vnobservation/confidence).

All angle/stability state remains short-lived and in memory. No preview frame, raw observation, confidence, transform, angle history, or CoreMotion stream is logged, persisted, uploaded, or used for training. ARKit world anchors and Xiaoyi `gpt-5.6-luna` are unnecessary for this local visual measurement. Camera remains local-only and `productionReady:false` remains locked.

## Local AI Compose P4

P4 introduces the missing composition-policy layer between local subject geometry and the AR-style guide.

- `LocalAIComposePolicyResolver` selects one of three bounded families: rule of thirds, centered balance, or negative space.
- The resolver uses only ephemeral normalized subject kind/rectangle geometry. Small generic objects preserve negative space; centered close subjects can retain a centered treatment; remaining portrait/body/object cases use thirds.
- The policy is descriptive and actionable, not an aesthetic score or a claim that one composition is objectively better.
- Once a target is created, its policy, anchor, and target size remain stable until explicit subject selection, a confirmed multiple-subject transition, lens/camera change, Compose disable, selected-photo entry, or Camera stop.
- More than one plausible local subject must appear in two consecutive Vision samples before automatic guidance pauses and requests a long press. It takes two consecutive clear samples to resume, preventing one-sample candidate flicker.
- The overlay exposes the active policy in localized copy and draws a corresponding thirds/negative-space or centered screen-space grid behind the target.
- During P3 reacquisition, the selected policy and target frame remain visible while the subject rectangle waits for a safe match.

This remains an explainable on-device geometry policy. It does not infer identity, attractiveness, emotion, scene semantics, or photographic quality, and it does not score the user. ARKit is still unnecessary because the grids and target are 2D preview geometry. Xiaoyi `gpt-5.6-luna` is reserved for a future separately approved, user-initiated still-image semantic analysis; the live Camera loop adds no provider call, backend route, or upload. No geometry/policy state is logged, persisted, or used for training, and `productionReady:false` remains locked.

## Local AI Compose P3

P3 hardens the P2 lock against jitter and same-kind subject swaps while keeping the same local-only Camera boundary.

- A selected candidate initializes an ephemeral temporal state containing only its candidate kind, smoothed normalized rectangle, short motion vector, and bounded missed-sample count.
- Each sampled frame predicts the next screen-space rectangle, then evaluates same-kind candidates using center distance, rectangle intersection-over-union, and relative area consistency.
- Hard gates reject implausible jumps or major size changes. A small bounded distance allowance is added only while reacquiring.
- If the two best viable candidates are too close in score, the frame is treated as ambiguous. The guide shows the existing reacquiring state instead of guessing which visible person/object is the original selection.
- Accepted rectangles are smoothed before they drive the cyan lock frame and composition actions. Velocity decays on misses, and all state still clears with the existing Compose/camera lifecycle.

The matcher is geometric continuity, not identity recognition, face recognition, or a claim that the same real-world person has been identified. State stays in memory and is never logged, persisted, uploaded, or used for training. ARKit remains unnecessary because the guide has no world anchor or 3D placement. Xiaoyi `gpt-5.6-luna` remains unnecessary for this latency-sensitive geometric step; no Camera provider route or payload is added. `productionReady:false` remains locked.

## Local AI Compose P2

P2 extends the local composition loop with explicit long-press subject selection and an AR-style 2D lock overlay.

- The existing low-frequency Vision pass exposes at most six ephemeral candidates. Human-body boxes are preferred, faces already contained by a body box are deduplicated, and objectness saliency runs only when person candidates are absent.
- A long press is mapped from the aspect-fit preview into Vision-normalized coordinates. Front-camera display coordinates are unmirrored before candidate matching.
- A candidate containing the press point wins; otherwise the nearest center must remain within a bounded distance.
- Once locked, tracking considers only the same candidate kind near the previous center. A missed frame produces a reacquiring state rather than silently switching to another subject.
- Target position and subject-fill scale remain locked while the selected subject is reacquired. Lens/camera changes, Compose disable, photo selection, and Camera stop clear all selection state.
- The cyan lock frame, target box, level cue, and directional/distance action are 2D viewfinder overlays. ARKit is not installed because P2 does not need world anchors, plane detection, scene reconstruction, or 3D placement.

The operator allowed Xiaoyi `gpt-5.6-luna` when needed, but P2 makes no provider call: spatial selection and live alignment are faster and safer locally. Any future still-image semantic composition request must remain user initiated, backend mediated, consent gated, non-continuous, and separately scoped. No candidates, touch points, frames, or tracking history are logged, persisted, or uploaded. `productionReady:false` remains locked.

## Local AI Compose P1

The user explicitly requested a Doka Cam-style composition loop on 2026-07-20. This phase implements a bounded functional equivalent rather than copying Doka branding, assets, or proprietary model behavior.

- The live camera reuses the existing approximately 2 FPS off-main Vision path.
- Face and body observations are preferred as subject geometry; objectness-based saliency is the local fallback for non-person subjects.
- Only typed, in-memory subject geometry is returned to `CameraViewModel`; raw frames, saliency buffers, and Vision observations are not persisted or logged.
- A stable rule-of-thirds target is selected for the current Compose session. The overlay compares the live subject box with that target and emits one calm action at a time: move left/right/up/down, zoom in, step back, or hold steady.
- The existing local device-roll summary can show an optional level cue. It is context, not a score or capture gate.
- Lens/camera changes, photo selection, Compose disable, and camera stop clear the old target and ephemeral geometry.

This explicit feature decision supersedes the Phase 21-A6 app-authored composition-hint suppression only inside the opt-in Local AI Compose prototype. It does not approve a custom model, user-photo training, dataset crawling, cloud camera AI, automatic shutter, continuous tracking persistence, numeric composition scores, or production rollout. A future learned composition policy requires a separately approved, licensed and consent-governed dataset phase with human-reviewed labels and held-out evaluation.

## PT2-SF-R9-R16-R2 General Adaptive Tone Transfer

Recipe v2 filtering must transfer across unrelated source photos rather than memorize one successful reference/apply pair. The backend prompt assigns primary reusable tone intent to `lumaCurve`, treats exposure/contrast/fade/shadow lift as residual controls, and excludes reference-scene subject colour, room brightness, and flash exposure from reusable filter evidence.

The experimental iOS guard runs after deterministic normalization, legacy tone controls, temperature, and the Recipe v2 colour cube, but before bloom, diffusion, halation, grain, dust, vignette, and the user's final intensity blend. It creates alpha-aware source/tone-color samples with a maximum long edge of 64 pixels and divides them into a 6×6 grid. A tile is eligible only when at least 75% of its sample pixels are opaque, source q10 is `0.004...0.38`, q25-q10 is at least `0.018`, bottom-quartile absolute chroma is at most `0.12`, bottom-quartile relative chroma is at most `0.45`, and the selected q10 pixel's relative chroma is at most `0.55`.

The detector compares tone-color q10 with a `lumaCurve`-owned primary floor. It permits bounded downward residuals from legacy tone (`0.016`), pointwise temperature/RGB-curve/basis style (`0.020`), their combined density (`0.034`), plus a small temperature/tint allowance. The style allowance transforms every opaque sampled colour in the tile and then takes the aligned q10; the packed calibration strip deliberately omits spatial `CIHighlightShadowAdjust`. At least three eligible tiles and two damaged tiles must agree. A floor-index q75 damage estimate drives the correction, avoiding both a single-object trigger and a worst-outlier boost.

Repair is local rather than a global tone curve. A deterministic 17-cube multiplies RGB by one gain, preserving chromaticity and exact black. Maximum luminance lift is `0.025`, it fades out between luma `0.10...0.24`, and luma `>=0.24` is identity. A 6×6 weight grid becomes a 144×144 piecewise-constant mask (24 pixels per tile), then receives Lanczos scaling and only 2...6 output-pixel Gaussian feathering before `CIBlendWithMask`. Declared vignette and stochastic film effects remain downstream and untouched. Recipe `1.1` never enters this guard.

Sampling, mask generation, and repair stay local and in-memory; they are not logged, persisted, or uploaded. The selected style/reference image still uses the existing consented backend path, while the apply/original image is not added to that request. Source-contract and synthetic policy tests pass, but actual Swift/Core Image compilation, mask orientation, multi-style pixels, latency, and memory remain Mac/device checks.

## PT2-SF-R9-R16-R1 Compound Black-Floor Correction

The operator confirmed that the latest returned comparison was the 100% result. Its warmth and tonal spread were substantially closer than R15, but its black floor and midtones remained too bright. Recipe v2 now assigns black/white endpoint shaping only to the luma curve; R/G/B curves must keep exact `0/1` endpoints so channel styling cannot silently lift the entire black floor a second time.

Both backend and iOS enforce the same deterministic budget:

`lumaBlack + fade*0.15 + shadowLift*0.22 + max(-contrast, 0)*0.35 <= max(0.035, lumaBlack)`

When a candidate exceeds the budget, negative contrast is neutralized first when it compounds fade/shadow lift, then fade and shadow lift are proportionally reduced. Temperature, tint, saturation, curve midpoints, basis-look intent, and film texture remain intact. The correction is validation/input normalization; renderer order, 1600-pixel memory bound, local intensity blend, and local-only apply/original image are unchanged.

## PT2-SF-R9-R16 Filter Lab Recipe v2

Recipe `2.0` keeps the twelve existing global controls as final fine adjustments and adds bounded five-point luma/R/G/B curves, normalized weights over eight app-owned basis looks, local luminance normalization, grain size/roughness/luminance response, warm highlight halation, and diffusion. iOS builds a deterministic 17-cube locally; the provider cannot return a raw LUT, LUT URL, arbitrary renderer name, shader, or code. Historical `1.1` recipes map to identity v2 structures. The user intensity is now a final source-versus-complete-result blend, so `0%` is the original, `100%` is the entire recipe, and `50%` is their true midpoint. The backend still receives only one style/reference image; the apply/original and all rendering stay local, Camera remains local-only, and `productionReady:false` remains locked.

## PT2-SF-R9-R15-X2 real-reference fidelity correction

The first Luna physical-device result showed an excessive black-floor lift: result luminance q10 was `0.506`, while the original was `0.241` and the target photograph region was `0.214`. The saved recipe combined `contrast:-0.18`, `fade:0.20`, and `shadowLift:0.16`; the local renderer then mapped shadow lift at `1.8x`. X2 corrects both sources. The backend prompt excludes screenshot UI from tone/color evidence, protects deep photographic blacks, avoids compounded faded-look controls, and uses `detail:high` for Filter Lab. The iOS renderer now maps shadow lift at bounded `0.55x`. The accepted real-reference recipe is `contrast:0.01`, `fade:0.06`, `shadowLift:0.04`, `temperature:0.22`, with strict recipe `1.1` still enforced. Physical-device rendering of this combined correction is pending; only the target reference was uploaded, the apply/original stayed local, and `productionReady:false` remains locked.

## PT2-SF-R9-R15-X1 Xiaoyi Luna relay rebuild

Filter Lab now has a separate backend-only `xiaoyiLunaInternal` candidate built from the supplied Xiaoyi integration guide and OpenAPI records. The runtime resolves `XiaoyiLunaRelayProvider` rather than the historical DeepSeek relay adapter. It pins `gpt-5.6-luna`, `https://xiaoyiapi.xyz/v1/chat/completions`, Bearer auth, `Accept: application/json`, non-stream JSON mode, `max_tokens: 2000`, and a 90-second total upstream timeout. `/v1/responses` is not selected because the supplied guide verifies Luna on Chat Completions.

The supplied Chat Completions OpenAPI schema documents string message content but does not document image content parts. The new adapter therefore keeps its standard OpenAI-compatible `image_url` content part behind the existing internal/debug, consent, one-reference-image, validator, and fallback gates. A replacement-key text smoke passed with HTTP 200. Sanitized validator buckets then identified `recipe_version` and `id` prompt mismatches without exposing raw output; explicit typing constraints fixed both without changing the validator. Zero-retry synthetic-image, backend route, and running HTTP endpoint checks now pass strict recipe `1.1` validation with all 12 renderer parameters. The current internal/debug backend process runs Luna and keeps SiliconFlow as rollback. Real-reference fidelity still requires the operator's Xcode comparison; the apply/original image remains local, Camera remains local-only, and `productionReady:false` remains locked.

## PT2-SF-R9-R15 Filter Lab fidelity calibration

Filter Lab generated recipes now use contract `1.1`. Final rendered pixels are the primary reference; unknown third-party preset codes and slider values are relative clues only, never direct absolute mappings. The local Core Image pipeline adds bounded `shadowLift`, `highlightRollOff`, `bloom`, and `dust`, changes fade to raise the black floor, and reduces vignette calibration. This targets the supplied comparison's black-crush, weak warmth/magenta, and missing analog-defect gaps while preserving the R12 1600-pixel/memory bound and R14 local preview export. The backend still receives exactly one style/reference image and the apply/original remains local-only.

## PT2-SF-R9-R14 Filter Lab 本機預覽匯出

Filter Lab 的「套用後」預覽現在支援明確長按儲存到 Apple Photos。相簿寫入只會在使用者主動匯出時要求 `.addOnly` 權限，並只儲存現有 R12 1600 像素長邊上限內的本機 `previewImage`；因此輸出適合用作濾鏡準確度比較，但不視為全解像度匯出。此流程不會自動保存來源圖、不會新增 backend/provider call 或上載，亦不會改變只上載一張 style reference、apply/original image 留在本機的邊界。

## 報告結論

以你已經確定的技術邊界來看，這個 App 的相機與圖片處理層，最穩健的做法是：**相機使用 AVFoundation 自建拍照介面、單張匯入使用 PhotosPicker、濾鏡與輸出使用 Core Image、輕量即時導引只用 Vision、雲端保存只保存必要版本、AI 分析只吃「已正向化但未套復古風格」的單張來源圖**。這個組合剛好符合你目前的產品定位：不是大型修圖工作室，而是「底片感相機 + 單張 AI 拍攝教練」。AVFoundation 本來就是 Apple 提供自訂相機 UI 的主要 capture 架構；PhotosPicker 是 Apple 提供的相簿選擇元件；Core Image 提供高效的內建濾鏡鍊式處理，而且可以用 Metal-backed `CIContext`；Vision 則提供臉框、人體姿勢、地平線等本機電腦視覺能力。這些官方能力本身就足以完成你要的 MVP，不需要第一版就跳進純 Metal shader 或第三方濾鏡框架。citeturn6search10turn0search1turn18search11turn6search17turn0search10turn19search8

就產品分層來說，建議明確切成三層。**MVP** 只做：單張拍照、單張匯入、三個底片 preset、一鍵直出、基本數值微調、壓縮圖與縮圖保存、VIP 原圖保存、AI 分析按鈕、基本歷史頁。**MVP+** 才加入：半格機編輯器、雙重曝光編輯器、簡單 live overlay 輔助。**Future** 再做：真正的大型相機庫 / 鏡頭庫、更多光學模擬、複雜實時預覽、多段非破壞編輯、完整 draft 同步與更進階的動態導引。這樣的切法可避免第一版被「相機體驗、濾鏡體驗、雲端保存、AI 分析」四條主線同時拉爆。

## 相機與相簿流程

你的 **MVP 相機功能範圍** 建議固定為以下內容，而且不要再往外擴：**單張拍照、單張相簿匯入、拍後預覽、套用 preset、基本數值微調、AI 分析按鈕、保存壓縮版、VIP 保存原圖、歷史 metadata 寫入 Firestore**。不要在 MVP 納入 RAW、Live Photo、Burst、錄影、AR、多人即時骨架追蹤。AVFoundation 的拍照工作流本來就以 `AVCaptureSession` 與 `AVCapturePhotoOutput` 為核心，`AVCapturePhotoOutput` 也支援 still photo 的主流程；Apple 官方文件同時指出 photo output 支援 HEIF / JPEG / RAW / bracketed capture / Live Photo 等更高階能力，因此你完全可以在第一版只取其中最簡單、最穩的 still photo 子集。citeturn6search3turn0search4turn0search16

相簿匯入這一段，建議 **MVP 直接使用 SwiftUI `PhotosPicker`，並限制為單張 `.images`**。Apple 官方文件明確指出 `PhotosPicker` 可做單選與多選；而 Apple 也另外說明，使用 `PHPickerViewController` 這類系統 picker 時，App **不需要先要求相簿完整讀取權限**。對你的產品來說，這是一個很重要的 UX 優勢：使用者第一次進來，不會看到一個很重的「請允許存取所有相片」權限窗，而是只有真的打開系統 picker 時，才與系統相簿互動。citeturn0search1turn4search14

權限策略建議做得非常克制。**相機拍照一定要有 `NSCameraUsageDescription`**，這是 Apple 明確要求的；如果你未來提供「直接存回使用者 Photos」功能，才需要 `NSPhotoLibraryAddUsageDescription`；如果你改成自己讀寫 PhotoKit 資產，才需要 `NSPhotoLibraryUsageDescription`。換句話說，若 MVP 只做「拍照到 App 沙盒、相簿用 PhotosPicker 匯入、備份靠匯出或分享」，你可以把權限最小化到只先要相機權限。這對 App Store 審查敘述、隱私信任與首次打開轉化率都更有利。citeturn4search0turn4search1turn7search0turn7search12

本地備份與下載，建議**不要做 server backup，也不要第一版直接寫回使用者系統相簿**。Apple 已提供 `fileExporter` 與 `UIActivityViewController` 這類系統匯出 / 分享界面，足夠滿足你「一鍵下載或選擇下載圖片」的需求，而且不必額外承擔 Photo Library 寫入權限與更複雜的 PhotoKit 保存流程。這和你目前「只需要本地備份，不需要 server 備份」的方向完全一致。citeturn7search2turn7search1turn7search9

**建議的相機流程** 應該是這樣：

1. 首頁選一個 `CameraRecipe`。
2. 進入 `CameraView`。
3. 相機預覽只顯示：快門、前後鏡切換、AI 按鈕、preset 名稱、歷史入口。
4. 拍照後立即進入 `PhotoReviewView`。
5. `PhotoReviewView` 先顯示套用 preset 後的預覽。
6. 使用者可微調曝光 / 對比 / 色溫 / 飽和 / 顆粒 / 暗角 / 漏光。
7. 點「AI 分析」後先確保雲端有 `sourceCompressed`，再呼叫 `analyzePhoto`。
8. 點「保存」後寫 Storage 與 Firestore。
9. 歷史頁只拉縮圖與 metadata，點入單張再重建全尺寸 render。

這條路線對 Codex 最友善，因為每一段都能獨立生成、獨立測試。

## 復古底片 preset 與濾鏡引擎

你要的「Dazz 類型體驗但不抄 UI」，最安全的工程拆法是：**把首頁上的“相機”其實做成 `CameraRecipe` 卡片；把“鏡頭”做成可選的 `LensProfile` ；把真正可運算的顏色與質感參數都收斂到 `VintagePreset`**。也就是說，第一版不要真的做成「物理相機模型 + 鏡頭系統 + 膠卷系統」三層完全分離，而是讓首頁卡片只是 UX 包裝，底層還是以同一份 preset 參數作為唯一渲染來源。這樣可以保留未來擴充空間，但不會第一版把資料模型做得過深。

在濾鏡實作上，建議 **全部用 Core Image 完成 MVP**。Apple 官方文件說明，Core Image 本身就是 still / video 影像處理框架，可以用內建濾鏡鏈出複合效果；Apple 也明確指出，Core Image 會對濾鏡鍊進行優化，包含重排與合併 kernel，以降低額外運算。對你這種「單張拍照 + 單張匯入 + 三個 preset + 少量微調」的需求，這正是最合適的能力範圍。citeturn18search11turn0search10

建議的 **MVP 三個免費 preset** 可以這樣定義，而不要直接借用真實底片品牌名稱：

- `retro_warm_day`：日光暖調、輕褪色、微顆粒、輕暗角。
- `cine_fade_green`：低飽和、陰影帶一點綠、對比較低、電影感褪色。
- `flash_party_night`：高一點亮部、冷暖混合、較強顆粒、可選紅橙漏光。

這三個 preset 足夠覆蓋你最常見的人像、食物、景物三種情境，而且不需要 LUT 也能先成立。LUT 可以保留為 Future 或高級 preset 再加。

對應的 **Core Image 濾鏡映射** 建議如下：

- 曝光：`CIExposureAdjust`
- 色溫：`CITemperatureAndTint`
- 對比 / 飽和 / 亮度：`CIColorControls`
- 銳利度：`CISharpenLuminance`
- 褪色：`CIToneCurve` 搭配較低對比
- 暗角：`CIVignette`
- 漏光：以 gradient 或 PNG overlay，再用 composite operations 合成
- 顆粒：MVP 建議用預烘焙 grain overlay 資產；若之後要程式生成，可考慮 `CIRandomGenerator`
- 雙重曝光：直接用 Core Image composite operations，例如 screen / lighten / addition 類型citeturn5search0turn5search1turn13search0turn5search3turn18search0turn5search2turn17search3turn12search1

漏光與雙重曝光不需要第一版就寫自定義 Metal shader。Apple 的 Core Image 已經有 composite operations 與 gradient filters；你可以用 `CILinearGradient` / `CIRadialGradient` 生成簡單漏光遮罩，或直接用 PNG asset 疊加，再用 screen / addition 類型合成。這足以做出「看起來像底片 app」而不是「精準底片物理模擬」的 MVP。citeturn17search1turn17search2turn12search1

建議的 `FilterEngine` 應維持**純函式風格**：`sourceImage + preset + adjustments -> renderedImage`。另外，`CIContext` 建議整個 App 共用單例，並且用 Metal-backed `CIContext(mtlDevice:)`。Apple 文件指出 `CIContext` 與 `CIImage` 都是 immutable，可跨執行緒共用；這很適合你做成 app-level `ImageRenderingContext.shared`。citeturn6search2turn6search17

**建議的 preset schema** 如下。這份 schema 是**App 自己的抽象層**，不是 Core Image API 原樣鏡射；這樣 AI 之後給的數值建議也能直接回填到同一套 UI 模型，而不用暴露 CI 的低層參數給產品層。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "docs/schemas/vintage-preset.schema.json",
  "title": "VintagePreset",
  "type": "object",
  "required": [
    "preset_id",
    "name",
    "description",
    "preview_image",
    "filter_parameters",
    "is_premium",
    "created_at",
    "version"
  ],
  "properties": {
    "preset_id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "preview_image": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": ["camera", "film", "lens"]
    },
    "filter_parameters": {
      "type": "object",
      "required": [
        "exposure_ev",
        "contrast",
        "temperature_shift",
        "saturation",
        "sharpness",
        "fade",
        "grain_opacity",
        "vignette_intensity",
        "light_leak_opacity"
      ],
      "properties": {
        "exposure_ev": { "type": "number", "minimum": -2.0, "maximum": 2.0 },
        "contrast": { "type": "number", "minimum": 0.5, "maximum": 1.8 },
        "temperature_shift": { "type": "number", "minimum": -100, "maximum": 100 },
        "saturation": { "type": "number", "minimum": 0.0, "maximum": 2.0 },
        "sharpness": { "type": "number", "minimum": 0.0, "maximum": 2.0 },
        "fade": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "grain_opacity": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "vignette_intensity": { "type": "number", "minimum": 0.0, "maximum": 3.0 },
        "light_leak_opacity": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "light_leak_asset": { "type": ["string", "null"] },
        "grain_asset": { "type": ["string", "null"] }
      }
    },
    "default_output": {
      "type": "object",
      "properties": {
        "aspect_ratio": {
          "type": "string",
          "enum": ["4:3", "3:2", "1:1", "9:16"]
        },
        "show_frame_overlay": { "type": "boolean" }
      }
    },
    "is_premium": {
      "type": "boolean"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "version": {
      "type": "integer",
      "minimum": 1
    }
  }
}
```

**建議檔案名稱與型別**：

- `ios-app/Features/Filters/Models/VintagePreset.swift`
- `ios-app/Features/Filters/Models/FilterAdjustments.swift`
- `ios-app/Features/Filters/Services/PresetCatalogService.swift`
- `ios-app/Features/Filters/Services/FilterEngine.swift`
- `ios-app/Features/Filters/Services/GrainOverlayProvider.swift`
- `ios-app/Features/Filters/Services/LightLeakOverlayProvider.swift`
- `ios-app/Resources/Presets/vintage-presets.json`

## 圖片 pipeline 與雲端保存

這個 App 最容易在第一版失控的地方，不是相機，而是**圖片版本管理**。如果你把原圖、壓縮圖、濾鏡圖、AI 圖、縮圖、再次導出圖都一口氣永久保存，Storage 成本和刪除流程很快就會變亂。因此我建議你用「**運算態**」與「**持久化態**」分開的設計。

**建議的 pipeline**：

- **原始照片 `original`**：相機原始輸出或相簿原始 bytes。**VIP 才上雲**；免費方案只在本機暫存，完成壓縮後可刪。
- **壓縮來源圖 `sourceCompressed`**：所有方案都保存。這是之後重新渲染 preset、UI 詳頁重建大圖、跨裝置同步的核心來源。
- **縮圖 `thumb`**：所有方案都保存。歷史頁只拉這張。
- **濾鏡後圖片 `rendered`**：MVP 建議預設只做**本機即時 render**，不必永久上雲；若你要加速跨裝置開啟，可作為選用 cache。
- **AI 分析用圖片 `analysisInput`**：建議由 `sourceCompressed` 再縮一次或直接重用 `sourceCompressed`，但**分析前不要套底片濾鏡**，只做 orientation normalize 與尺寸收斂。
- **本地導出圖 `exportedRender`**：使用者按下載 / 分享時才生成。  

這樣做的關鍵好處是：歷史頁只要 `thumb`；詳頁只要 `sourceCompressed + preset snapshot` 就能重建；免費方案不需要存 full render 與 original；VIP 才多一個 original。Apple 的 `AVCapturePhotoOutput` 本身支援 HEIF / JPEG 等輸出格式，因此你可以保留 VIP original 的原格式；而衍生版本則統一轉成 JPEG，降低跨裝置與 AI 服務相容性風險。citeturn0search4turn0search16

很重要的一點是：**AI 分析應該吃未套底片風格的標準化來源圖，而不是復古風格圖**。原因不是 Apple 或 Firebase 的技術限制，而是產品判斷的準確性：如果你先套了很重的褪色、漏光、低對比，再叫 AI 判斷曝光與白平衡，它更容易把風格當成錯誤。因此 `analyzePhoto` 的 request 應同時傳 `presetId` 與 `adjustments`，但圖片本身建議使用 `sourceCompressed` 或解析度更小的 `analysisInput`。這樣 AI 可以知道使用者的創作意圖，卻不會被風格處理本身誤導。

**建議的 Storage path**：

```text
users/{uid}/photos/{photoId}/source.jpg
users/{uid}/photos/{photoId}/thumb.jpg
users/{uid}/photos/{photoId}/original.heic        // VIP only, optional
users/{uid}/photos/{photoId}/render-cache.jpg     // optional, not MVP must-have
```

**建議的 Firestore metadata** 建議做成單文件，不要在 MVP 先拆多層子集合。Firebase 文件提醒，刪除 Firestore 文件**不會自動刪除其子集合**，而刪除整個集合 / 子集合也建議在受信任的伺服器環境執行。你的需求只是「基本歷史 + 單張刪除」，因此把 photo 的 metadata 做扁平化文件，會比一開始拆成 `edits` / `analysis` / `assets` 子集合更容易維護與清理。citeturn9search4

```json
{
  "photoId": "auto-id",
  "userId": "uid",
  "sourceType": "camera",
  "captureMode": "normal",
  "presetId": "retro_warm_day",
  "presetVersion": 1,
  "isPremiumSourcePreserved": false,
  "storage": {
    "sourcePath": "users/uid/photos/photoId/source.jpg",
    "thumbPath": "users/uid/photos/photoId/thumb.jpg",
    "originalPath": null,
    "renderCachePath": null
  },
  "dimensions": {
    "sourceWidth": 2048,
    "sourceHeight": 2731,
    "thumbWidth": 512,
    "thumbHeight": 683
  },
  "renderAdjustments": {
    "exposureEV": 0.2,
    "contrast": 1.08,
    "temperatureShift": 12,
    "saturation": 0.92,
    "sharpness": 0.25,
    "fade": 0.16,
    "grainOpacity": 0.22,
    "vignetteIntensity": 0.7,
    "lightLeakOpacity": 0.0
  },
  "analysis": {
    "status": "done",
    "summary": "主體自然，但臉部略暗。",
    "suggestions": [
      "相機上移少許，讓眼睛靠近上三分線。",
      "向窗邊移一步，補臉部亮度。",
      "讓被拍者肩膀微側，姿勢更自然。"
    ],
    "numericSuggestions": {
      "exposureEV": 0.3,
      "temperatureShift": 8,
      "contrast": -0.05
    },
    "analyzedAt": "serverTimestamp"
  },
  "quotaSnapshot": {
    "planTier": "free",
    "countedTowardPhotoLimit": true,
    "countedTowardAnalysisQuota": true
  },
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp",
  "deletedAt": null
}
```

Firebase Storage 的 Apple 平台 SDK 支援從記憶體資料或本機檔案 URL 上傳，也支援 progress / pause / resume / cancel。這意味著你的 `UploadService` 應該公開一個 `UploadState`，而不是把上傳工作完全藏在 repository 裡。另一方面，Cloud Firestore 支援 sorting、filtering 與 limits，因此歷史頁只需要用 `createdAt desc` 做簡單分頁查詢，不需要第一版再做 ElasticSearch 類型的歷史系統。citeturn1search5turn1search2

**免費與付費圖片保存策略** 建議如下：

- **免費**：只保存 `sourceCompressed + thumb`；最多 20 張雲端照片；不保存 original。
- **VIP**：保存 `sourceCompressed + thumb + optional original`；render cache 可視需要再開。
- **超出 20 張限制時**：不要先拍完再報錯。應在使用者按「保存到雲端」前先檢查 `photoCount`，若已滿，顯示三選一：`刪除舊照片`、`升級 VIP`、`只保留本機暫存不同步`。
- **AI 每日登入送 1 次分析**：記在 `users/{uid}`，不要記在 photo doc。

建議的 `users/{uid}` 文件最低欄位：

```json
{
  "planTier": "free",
  "photoCount": 12,
  "analysisCredits": 6,
  "dailyLoginBonusClaimedAt": "2026-06-07T08:00:00Z",
  "lastActiveAt": "serverTimestamp"
}
```

**刪除單張照片** 不建議純客戶端直接做。原因有兩個：第一，photo 通常不是一個檔，而是多個 Storage object；第二，Cloud Functions 的 callable 會自動攜帶 Firebase Auth token 與 App Check token，適合做 owner 驗證與集中刪除邏輯。Firebase 官方也提供對 callable functions 的 App Check enforcement。對你這種有 AI 成本與 Storage 成本的 App，`deletePhoto` 與 `analyzePhoto` 都建議走 callable，而且開啟 App Check enforcement。citeturn11search2turn11search1

**建議的 Cloud Function contract**：

```ts
// functions/src/photo/analyzePhoto.ts
type AnalyzePhotoRequest = {
  photoId: string;
  sourcePath: string;
  presetId: string;
  renderAdjustments: {
    exposureEV: number;
    contrast: number;
    temperatureShift: number;
    saturation: number;
    sharpness: number;
    fade: number;
    grainOpacity: number;
    vignetteIntensity: number;
    lightLeakOpacity: number;
  };
  locale: "zh-Hant" | "en";
  subjectHint?: "portrait" | "food" | "scene";
};

type AnalyzePhotoResponse = {
  summary: string;
  suggestions: string[]; // max 3
  numericSuggestions: {
    exposureEV?: number;
    contrast?: number;
    temperatureShift?: number;
    saturation?: number;
  };
  analysisVersion: string;
};

// functions/src/photo/deletePhoto.ts
type DeletePhotoRequest = {
  photoId: string;
};

type DeletePhotoResponse = {
  success: boolean;
  deletedPaths: string[];
};
```

**到期清理策略** 建議用排程函式。Firebase 官方的 scheduled functions 可用 `onSchedule` 觸發，因此你可以每天跑一次 `cleanupExpiredFreePhotos`，檢查免費用戶是否長期不活躍，並依 `lastActiveAt` 與 `planTier` 清理 Storage 與 Firestore。伺服器端 Admin SDK 會繞過 Firestore client Security Rules，因此這類批次清理與帳號全刪除更適合放在 Functions，而不是寄望客戶端自己維持一致性。citeturn9search6turn3search2

**建議的 Security Rules 草稿**，MVP 先做到 owner-only 即可：

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /photos/{photoId} {
        allow read, create, update, delete:
          if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/photos/{photoId}/{fileName} {
      allow read, delete:
        if request.auth != null && request.auth.uid == uid;

      allow create, update:
        if request.auth != null
        && request.auth.uid == uid
        && request.resource != null
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Firestore 與 Storage 的 Security Rules 都建議結合 Firebase Authentication 使用；Storage Rules 也支援基於 auth 與 request / resource metadata 的條件驗證。citeturn3search2turn3search1turn3search10

## 半格機、雙重曝光與微調介面

根據你的共用背景，**半格機與雙重曝光都不應該進入 base MVP**；最合理的位置是 **MVP+**。下面的設計，是在不推翻主架構的前提下，給 Codex 用的最小可行方案。

**半格機的最簡單可行版本**，我建議只做成一個獨立 editor mode，而不是直接塞到主相機的預設快門流程。流程如下：

1. 使用者在首頁點進 `HalfFrameEditor`。
2. 顯示左右兩格預覽框與拍攝提示。
3. 先拍第一張，暫存在 app 本機 cache，不立刻上傳。
4. 顯示第二格 overlay，拍第二張。
5. 本機把兩張圖裁成一致比例後 side-by-side 拼接。
6. 只把**合成後的最終圖**當成一個 `photo` 寫入雲端；未完成 draft 不同步。

這樣的好處是：你不需要在 MVP+ 立即處理 draft recovery、跨裝置續拍、來源圖與最終圖多版本同步。對歷史頁來說，它仍然只是一張普通照片，只是 `captureMode = "half_frame"`。這非常重要，因為你現在的歷史與刪除系統都還在 MVP 階段。

**建議的 half-frame metadata**：

```json
{
  "captureMode": "half_frame",
  "composition": {
    "layout": "side_by_side",
    "partCount": 2,
    "sourceRefs": [],
    "gutterPx": 24
  }
}
```

**雙重曝光的最簡單可行版本** 也不應綁死在主相機 shutter 上，而是做成拍後 / 匯入後的 editor。建議流程：

1. 選一張 base image。
2. 再選第二張 overlay image。
3. 兩張圖先做同尺寸 canvas 對齊與中心裁切。
4. 預設 blend mode 用 `screen`。
5. 提供一個 `intensity` slider。
6. 輸出成一張 final image。
7. 歷史頁只看 final image；metadata 裡記錄 base / overlay 與 blend 參數。

Apple 官方的 Core Image composite operations 已包含多種 blend / compositing filter，因此這裡不需要第一版再寫自己的 Metal blending shader。citeturn12search1turn12search9

**建議的 double exposure metadata**：

```json
{
  "captureMode": "double_exposure",
  "composition": {
    "blendMode": "screen",
    "intensity": 0.45,
    "sourceRefs": ["photoA", "photoB"]
  }
}
```

**數值微調 UI** 建議不要做成 Lightroom 式長面板。MVP 最好的做法是「**一條 slider + 一列 chip**」。理由很簡單：你的產品是拍攝教練，不是專業修圖器，太複雜的面板會直接破壞一鍵直出的定位。

建議 wireframe：

```text
┌──────────────────────────────────┐
│           PhotoReviewView        │
│                                  │
│          [ rendered photo ]      │
│                                  │
│  Preset: Retro Warm Day          │
│                                  │
│  [預設] [曝光] [對比] [色溫] [飽和] │
│  [顆粒] [暗角] [漏光]               │
│                                  │
│  value: +0.3                     │
│  ─────────●────────────           │
│                                  │
│  [AI 分析]     [保存]             │
└──────────────────────────────────┘
```

建議的 UI 規則：

- 一次只調一個參數。
- slider 下方顯示目前值。
- 使用者切換 chip 時，slider 綁定到不同欄位。
- `重設` 可以 reset 當前參數；`回復 preset` 則重設全部。
- AI 建議若回傳數值，可顯示「套用 AI 建議」按鈕，一次映射進同一個 `FilterAdjustments`。

**建議的資料模型**：

```swift
struct FilterAdjustments: Codable, Equatable {
    var exposureEV: Double
    var contrast: Double
    var temperatureShift: Double
    var saturation: Double
    var sharpness: Double
    var fade: Double
    var grainOpacity: Double
    var vignetteIntensity: Double
    var lightLeakOpacity: Double
}
```

本機即時導引若要在 MVP+ 先開一點點，不要做完整 AI overlay，而是只做 **grid、水平線、臉框、簡單 pose points**。Vision 本身可做臉框、人體姿勢偵測與地平線偵測；Apple 對人體姿勢的文件指出可偵測最多 19 個 body points，而其 sample 也示範了用相對較低的預覽解析度跑姿勢以降低負擔。這足以支援你說的「即時線條 / 框架導引」，但還不應該包裝成真正的雲端即時 AI。citeturn16search8turn0search3turn19search0turn0search15

## iOS 技術建議與建議檔案結構

**AVFoundation** 是必要選項，不是可選。你要的是自訂拍照 UI、Dazz 類相機頁、拍後流程控制、基礎 overlay，以及日後可能加入更多 capture mode。Apple 的 AVFoundation capture subsystem 就是為這類自訂 camera 體驗設計；官方 AVCam sample 也直接示範了如何用 AVFoundation 存取相機、設定 session、拍照與保存。結論很簡單：**相機層只能選 AVFoundation**。citeturn6search10turn6search22

**Core Image** 是 MVP 應該主用的圖片處理技術。它已經提供 still / video 的高效處理、內建濾鏡、濾鏡鍊優化、Metal-backed context 與自定義 kernel 擴充能力。也就是說，你現在需要的曝光、對比、色溫、暗角、銳利度、褪色、blend，都在 Core Image 能力圈內；未來真要做更重的自定義處理，還可以透過 `CIImageProcessorKernel` 把 Metal / MPS 整合進既有 Core Image pipeline，而不是整個重寫 renderer。這是 MVP 與長期演進之間最好的折衷。citeturn18search11turn0search10turn6search17turn6search15

**Metal** 在這個專案裡不是現在不用，而是**現在不應該先用**。Apple 也明說，Core Image 等高階框架本身已經 leverage Metal；如果你自己寫 Metal shader，的確可能拿到更高性能，但也會同時拉高 shader 維護、顏色管理、裝置差異、debug 與 Codex 生成難度。對一個先做 iOS-first MVP、三個 preset、單張分析的 App，這個交換比不划算。Metal 應該留到你真的要做：高頻即時預覽、多 pass 自定義漏光 / halation、極大量自定義 blend、或更重的 live camera filter pipeline 時再上。citeturn6search4turn6search1

**Vision** 應該用，但只用在輕量功能。Apple 將 Vision 定位為 still image 與 video 的電腦視覺框架，支援物件偵測、臉、文字、分割、姿勢等能力。對這個 App 來說，Vision 非常適合做：臉框、安全構圖框、姿勢點、地平線、注意區域提示。但它不應該在 MVP 被過度包裝成「實時雲端 AI 教練」。第一版你只要把它當成本機輔助層就好。citeturn19search8turn0search3turn19search0turn16search20

**第三方圖片濾鏡 library** 在第一版不建議導入。MetalPetal 官方將自己定位為基於 Metal 的即時 still / video 處理框架；GPUImage3 也提供基於 Metal 的 GPU image / video pipeline。這些框架都不是不能用，但它們都等於在你的 MVP 再加一層抽象、學習面與依賴風險。因為 Apple 原生的 AVFoundation + Core Image + Vision 已足夠完成你目前的需求，所以第一版不值得先把基礎渲染綁到第三方。若未來你真的需要更進階、持續性的 live processing，**MetalPetal 可作為後續評估對象**；但現在先不要碰。citeturn15view0turn15view1turn18search11turn6search10

**最終推薦結論**：

- **MVP 必用**：AVFoundation、PhotosPicker、Core Image、Firebase Storage / Firestore。
- **MVP 可用但要節制**：Vision。
- **MVP 不建議導入**：純 Metal shader pipeline、MetalPetal、GPUImage3、完整 PhotoKit 寫回相簿流程。

**建議的 iOS 端檔案結構**：

```text
ios-app/
  App/
    AppEntry.swift
    RootView.swift

  Features/
    Camera/
      Views/
        CameraView.swift
        CameraPreviewView.swift
        PhotoReviewView.swift
      ViewModels/
        CameraViewModel.swift
        PhotoReviewViewModel.swift
      Services/
        CameraSessionController.swift
        PhotoCaptureService.swift
        CameraPermissionService.swift
      Models/
        CapturedPhoto.swift
        CameraRecipe.swift

    PhotoPicker/
      Views/
        SinglePhotoPickerButton.swift
      Services/
        PhotoImportService.swift

    Filters/
      Models/
        VintagePreset.swift
        FilterAdjustments.swift
        LensProfile.swift
      Services/
        PresetCatalogService.swift
        FilterEngine.swift
        GrainOverlayProvider.swift
        LightLeakOverlayProvider.swift
        ImageRenderingContext.swift

    Editing/
      Views/
        HalfFrameEditorView.swift
        DoubleExposureEditorView.swift
        AdjustmentBarView.swift
      Services/
        HalfFrameComposer.swift
        DoubleExposureComposer.swift

    Photos/
      Models/
        PhotoMetadata.swift
        UserQuotaSnapshot.swift
      Services/
        ImageCompressor.swift
        StoragePathBuilder.swift
        UploadService.swift
        PhotoMetadataRepository.swift
        PhotoDeletionService.swift

    History/
      Views/
        HistoryListView.swift
        HistoryDetailView.swift
      ViewModels/
        HistoryListViewModel.swift

  Resources/
    Presets/
      vintage-presets.json
    Overlays/
      grain_01.png
      grain_02.png
      light_leak_red_01.png
      light_leak_orange_01.png
```

**建議的 Cloud Functions 檔案**：

```text
functions/src/
  photo/
    analyzePhoto.ts
    deletePhoto.ts
    cleanupExpiredFreePhotos.ts
  shared/
    auth.ts
    appCheck.ts
    errors.ts
```

## Codex 任務清單與驗收標準

下面這份清單是以 **「每個任務都能小步完成、可單獨驗證、不會一次生成太多」** 為目標寫的。每個任務都假設 Codex 先讀 `README` 與 `docs/`，不刪除既有功能，只做增量修改。

**任務一：`CameraView`**

- **輸入**：SwiftUI app skeleton、無相機功能。
- **輸出**：可預覽後鏡頭畫面、可拍單張、可切前後鏡、拍後回傳 `CapturedPhoto`。
- **檔案**：`CameraView.swift`、`CameraPreviewView.swift`、`CameraSessionController.swift`、`PhotoCaptureService.swift`、`CameraPermissionService.swift`
- **驗收標準**：
  - 首次進入相機頁時能正確請求相機權限。
  - 權限允許後，2 秒內看到預覽。
  - 點快門後能拿到 1 張照片並進入預覽頁。
  - 權限拒絕時顯示 fallback UI，而不是白屏或 crash。
- **手動驗證**：
  - 真機測試允許 / 拒絕權限各一次。
  - 拍照後確認預覽圖正向、不倒轉。

**任務二：`PhotoPicker`**

- **輸入**：已有預覽頁，但只能用相機。
- **輸出**：可從相簿單選 1 張圖片進入同一個預覽頁。
- **檔案**：`SinglePhotoPickerButton.swift`、`PhotoImportService.swift`
- **驗收標準**：
  - 只能選 1 張 image。
  - 成功匯入後與相機拍照走同一條 review flow。
  - 不需先出現「允許完整相簿權限」的自訂權限流程。
- **手動驗證**：
  - 從系統相簿選 portrait、landscape、大圖各 1 張。
  - 驗證 EXIF orientation 正常。

**任務三：`PresetModel`**

- **輸入**：已有 review 頁，但沒有 preset 系統。
- **輸出**：可載入 bundled JSON，得到至少 3 個 preset。
- **檔案**：`VintagePreset.swift`、`FilterAdjustments.swift`、`PresetCatalogService.swift`、`Resources/Presets/vintage-presets.json`
- **驗收標準**：
  - App 啟動後可載入 3 個 preset。
  - preset 有 id、name、preview、filter parameters。
  - 壞掉的 JSON 會回傳可處理錯誤，不直接 crash。
- **手動驗證**：
  - 切換 3 個 preset，UI 名稱與預覽變化正確。

**任務四：`FilterEngine`**

- **輸入**：已有 preset 資料，但不能套濾鏡。
- **輸出**：單張圖片可套 3 個 preset，並支援基礎數值微調。
- **檔案**：`FilterEngine.swift`、`ImageRenderingContext.swift`、`GrainOverlayProvider.swift`、`LightLeakOverlayProvider.swift`
- **驗收標準**：
  - 支援曝光、對比、色溫、飽和、顆粒、暗角、漏光、銳利度、褪色。
  - 同一張圖套同一組 preset + adjustments，輸出應 deterministic。
  - 2048px 長邊圖片在真機上切換 preset 時有可接受流暢度，不可明顯卡死主執行緒。
- **手動驗證**：
  - 三個 preset 視覺差異明顯。
  - slider 調整後即時預覽變化合理。

**任務五：`ImageCompressor`**

- **輸入**：可拍照與套濾鏡，但沒有雲端上傳前處理。
- **輸出**：能生成 `sourceCompressed`、`thumb`，VIP 模式可保留 `original` 路徑。
- **檔案**：`ImageCompressor.swift`
- **驗收標準**：
  - `sourceCompressed` 長邊壓到你設定的上限。
  - `thumb` 長邊壓到你設定的歷史尺寸。
  - 免費方案不生成 `original upload` 任務。
  - VIP 方案保留 original 的本機檔案引用。
- **手動驗證**：
  - 匯入大圖後不 OOM。
  - 輸出圖大小與畫質符合預期。

**任務六：`UploadService`**

- **輸入**：本機已有圖片版本，但沒有上雲能力。
- **輸出**：可把 `sourceCompressed`、`thumb` 上傳到 Storage，並回傳 storage path。
- **檔案**：`StoragePathBuilder.swift`、`UploadService.swift`
- **驗收標準**：
  - 上傳期間有 progress state。
  - 網路中斷時可回傳錯誤並保留 retry 能力。
  - 同一張照片的 Storage path 命名規則一致。
- **手動驗證**：
  - 開啟飛航模式模擬失敗。
  - 恢復網路後可重試成功。

**任務七：`PhotoMetadataService`**

- **輸入**：Storage 上傳可成功，但沒有 Firestore metadata。
- **輸出**：成功寫入 photo doc，歷史頁可依 `createdAt` 反向排序。
- **檔案**：`PhotoMetadata.swift`、`PhotoMetadataRepository.swift`、`HistoryListView.swift`、`HistoryListViewModel.swift`
- **驗收標準**：
  - 每張照片至少寫入 `presetId`、`renderAdjustments`、`storage paths`、`createdAt`。
  - 歷史頁只拉縮圖與 metadata。
  - 列表更新不需要重啟 app。
- **手動驗證**：
  - 連拍 3 張後歷史順序正確。
  - 切換帳號後不看到別人的 metadata。

**任務八：`HalfFrameEditor`**

- **輸入**：已有一般 review flow。
- **輸出**：可用兩張圖拼成 side-by-side half-frame 成品。
- **檔案**：`HalfFrameEditorView.swift`、`HalfFrameComposer.swift`
- **驗收標準**：
  - 兩張圖能完成 side-by-side 拼接。
  - 未完成第二張前，不寫入雲端 photo doc。
  - 完成後只生成一個最終 `photo` 記錄。
- **手動驗證**：
  - 相機拍兩張、相簿選兩張都能成功合成。
  - 中途退出不留下髒資料。

**任務九：`DoubleExposureEditor`**

- **輸入**：已有一般 review flow。
- **輸出**：可選兩張圖做 screen blend，並用 slider 控制強度。
- **檔案**：`DoubleExposureEditorView.swift`、`DoubleExposureComposer.swift`
- **驗收標準**：
  - 預設 blend mode 為 `screen`。
  - 有 0 到 1 的強度 slider。
  - 產出 final image 與 metadata 中的 composition 資料。
- **手動驗證**：
  - 不同亮度、不同方向的兩張圖都能合成。
  - intensity 拉到極低與極高時結果差異明顯。

**測試 checklist** 應至少覆蓋以下情境：

- 不同 iPhone 尺寸：小螢幕與大螢幕的 review UI、slider、歷史頁是否壓版。
- 權限拒絕：相機拒絕、相機之後去設定開回來。
- 相機不可用：Simulator、受限裝置、初始化失敗。
- 大圖片壓縮：高像素相簿圖、全景圖、方向資訊複雜的圖。
- 上傳失敗：離線、弱網路、中途中斷。
- 離線狀態：拍照後圖片是否仍能先在本地 review，之後手動 retry。
- 免費額度用完：20 張 photo limit、analysis quota 0 時的 UI。
- 付費原圖保存：VIP 模式下確認 original path 與 source path 都被正確處理。
- 刪除單張照片：Storage object 與 Firestore doc 是否一致移除。
- 歷史同步：第二台裝置登入後能拉到同一批照片 metadata。

**整體 acceptance criteria** 應該長這樣：

- 使用者可在 iPhone 上完成：拍一張照片 → 套一個 preset → 微調數值 → 保存到 Firebase Storage / Firestore → 在歷史頁看到該筆資料。
- 使用者可在 iPhone 上完成：從相簿匯入一張圖 → AI 分析按鈕可用 → 保存 metadata。
- 免費方案到達 20 張限制時，不會再偷偷上傳第 21 張雲端圖片。
- VIP 模式下，原圖保存路徑會被建立；免費模式下不建立。
- 刪除單張照片後，歷史頁、Firestore doc、Storage objects 三者狀態一致。
- 半格機與雙重曝光若尚未正式開啟，不影響主拍照流程；若開啟，也必須是獨立 editor，不破壞原 MVP 拍照路徑。

**Codex 可執行任務清單**：

- 先建立 `CameraView` 與 `CameraSessionController`。
- 再接 `SinglePhotoPickerButton` 與 `PhotoImportService`。
- 建立 `VintagePreset`、`FilterAdjustments`、`vintage-presets.json`。
- 實作 `FilterEngine`，先完成 3 個 preset。
- 加上 `AdjustmentBarView` 與 slider UI。
- 實作 `ImageCompressor` 生成 `sourceCompressed` 與 `thumb`。
- 實作 `UploadService` 與 `StoragePathBuilder`。
- 實作 `PhotoMetadataRepository` 與 `HistoryListView`。
- 實作 `deletePhoto` callable function 與 `PhotoDeletionService`。
- 實作 `HalfFrameComposer`。
- 實作 `DoubleExposureComposer`。
- 最後補測試：權限、壓縮、上傳失敗、照片限制、VIP 原圖保存。

這份順序的核心原則只有一個：**先完成單張主路徑，再做風格，再做保存，再做歷史，最後才做半格機與雙重曝光**。這樣 Codex 每一步都能有可運行輸出，不容易在一次產生過多檔案時失敗。
## Phase 21-A3-R4 Runtime Status - Live Filter Preview

The current Camera runtime uses a local-only AVFoundation + Core Image path for live filter parity. `CameraPreviewView` still owns the base `AVCaptureVideoPreviewLayer`, but non-original filters are rendered through `RealtimeFilteredCameraPreviewView`, which receives in-memory `AVCaptureVideoDataOutput` frames and draws the shared `FilterPipeline.filteredCIImage` result into a Metal-backed `MTKView`. This keeps the live viewfinder aligned with the post-capture filter definitions without uploading frames, persisting raw frames, adding provider calls, or changing backend/iOS upload payloads.

Front-camera preview remains mirrored for natural selfie framing. The final captured/saved front-camera source image is controlled separately by the local mirror-save toggle, which applies a horizontal image transform only when enabled. Phase 21-A3-R4-R2 defaults that mirror-save toggle to enabled so selfies match the viewfinder unless the user turns it off, and adds a local post-capture flip-photo action for camera captures so users can correct horizontal orientation without upload, cloud processing, or raw frame persistence.

## Phase 21-A3-R5 Runtime Status - Flash Availability Polish

Phase 21-A3-R5 keeps the same local-only AVFoundation + Core Image preview/capture architecture and adds a small flash-state / session-threading / memory stability pass. The Camera UI now treats front-camera flash as the existing local screen-flash effect, while back-camera flash remains gated by hardware flash availability. Unsupported flash states are dimmed/disabled and capture only receives an effective flash-enabled value. `AVCaptureSession.startRunning()` and `stopRunning()` run on a dedicated background queue instead of the main thread. Live filtered preview rendering is capped to a conservative cadence and uses a live `CIContext` with intermediate caching disabled to reduce physical-device memory pressure. This does not change filter definitions, focal crop mapping, backend/iOS upload payloads, preview-frame persistence, provider calls, model runtime, or production readiness.

## Phase 21-A4 Runtime Status - Live Framing Hint UX

Phase 21-A4 keeps the existing local-only Apple Vision / AVFoundation signal path and improves how hints are presented in Camera. The expanded local guidance panel now exposes a user-facing `Next hint` action instead of cycling debug states, visible local hints can be manually rotated, and compact/expanded hint UI uses category-specific icons. This does not add cloud guidance, provider/model calls, model files, frame upload, upload payload changes, raw frame persistence, or production readiness.

## Phase 21-A6 Runtime Status - Composition Hint Boundary

Phase 21-A6 keeps the local Vision / AVFoundation signal path available for safe in-memory geometry/depth/lighting signals, but suppresses app-authored composition and portrait-layout hint copy in the live Camera runtime. Subject centering, edge margin, headroom, face distance, subject size, portrait-ready, rule-of-thirds, and vertical-balance signals no longer become visible app-side copy. Lighting, filter, and local-unavailable hints remain available. Richer composition guidance belongs to the training-AI branch after label schema, human review, and typed-output gates. This does not add cloud guidance, provider/model calls, model files, frame upload, upload payload changes, raw frame/depth/image persistence, dataset crawler, AI-assisted labeling, user-photo training, or production readiness.

## Phase 21-A7 Runtime Status - Non-composition Guidance Polish

Phase 21-A7 keeps the same local-only Camera guidance architecture and polishes the post-A6 empty-hint behavior. When current local signals only produce suppressed composition / portrait-layout candidates, the local provider now falls back to the safe local-unavailable hint instead of leaving the expanded guidance surface empty. Compact local guidance also uses a plain guidance icon rather than `sparkles` when no visible hint is present. This does not change capture, filter rendering, focal crop mapping, backend/iOS upload payloads, preview-frame persistence, provider calls, model runtime, or production readiness.
