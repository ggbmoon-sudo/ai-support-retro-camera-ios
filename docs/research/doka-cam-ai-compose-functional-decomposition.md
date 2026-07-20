# Doka Cam AI Compose Functional Decomposition

Status: researched and bounded local prototype implemented
Date: 2026-07-20
Production readiness: `productionReady:false`

## Outcome

The referenced Doka Cam Reel demonstrates a closed-loop composition coach, not a single object detector and not a filter feature. The visible behavior can be decomposed into six stages:

1. The user explicitly enters an AI composition mode.
2. The app identifies a likely subject and summarizes the scene.
3. A composition policy chooses a target layout, such as a rule-of-thirds placement.
4. The policy becomes viewfinder geometry: target frame, anchor, grid, and level line.
5. The app compares the live subject geometry with the target and emits one action at a time, such as subject direction or zoom/distance.
6. When the subject approaches the target, the guide changes to a ready/hold state and the user remains in control of capture.

The Reel visibly shows a rounded target region, rule-of-thirds grid, a level line, a short scene-aware composition sentence, and a `Zoom In More` instruction. The exact Doka implementation is proprietary; model architecture, data, thresholds, server/on-device split, and training process cannot be determined from the video alone. The breakdown above is therefore a behavioral inference, not a claim about Doka source code.

## Public Product Signals

The [referenced Instagram Reel](https://www.instagram.com/reels/DajDDVBp9Yg/) presents the live guide. Doka's [App Store listing](https://apps.apple.com/gb/app/doka-cam/id6751240418) describes tap-to-analyze AI composition with AR guides, filter recommendations, a smartphone-photography training direction, and a later long-press subject-selection feature when the subject is ambiguous.

These product claims imply four distinct technical responsibilities:

- subject proposal / selection;
- composition strategy selection;
- live geometric alignment;
- user-facing guidance and stabilization.

Only the middle strategy-selection responsibility necessarily benefits from a custom learned composition model. Live detection, geometry, overlay rendering, and level guidance can use Apple frameworks locally.

## P25 Live-Like Cloud Keyframes Plus Local Tracking

P25 moves the experiment closer to the Reel's repeated analyze-and-guide behavior without attempting to upload a video stream. One explicitly consented session samples independent display-oriented JPEG keyframes at an upper bound of 1 FPS. The backend asks Xiaoyi `gpt-5.6-luna` for both a photographer-grounded subject rectangle and one strict strategy. Only one request is allowed at a time; there is no backlog, catch-up burst, or hidden retry loop.

Between those sparse semantic observations, a provisional or grounded Apple Vision object track runs locally at a nominal 15 FPS. The current local box drives the existing image-space target comparison, directional arrow, zoom/distance, Hold, and Ready overlay. A later cloud reply can update strategy only after stabilization and cannot repeatedly pull a healthy local track back to stale keyframe coordinates.

This division is intentionally similar to the user experience of Gemini Live rather than its transport. The available Xiaoyi relay is request/response `POST /v1/chat/completions`; SSE response streaming does not provide bidirectional frame input. P25 therefore uses complete strictly validated JSON replies, not WebSocket/WebRTC or provider-native live sessions. It remains an inferred functional equivalent, not a copy of Doka's proprietary source, assets, thresholds, model, training data, or server architecture.

## P24 Hybrid Xiaoyi Strategy Selection

P24 tests that split directly: Xiaoyi `gpt-5.6-luna` sees one explicitly consented still preview and selects one strict composition strategy, while Apple Vision keeps the closed-loop subject tracking and alignment local.

- Cloud responsibility ends after an enum-only scene family, policy, target slot/size, coarse lens/distance suggestion, reason code, and confidence bucket are validated.
- Local responsibility begins by freezing the policy/target into P23 and continues for every displayed tracking/action/Hold/Ready update.
- The cloud does not see a video stream, local box history, motion/sensor stream, depth, GPS, EXIF dump, identity, or later live frames.
- The app does not expose free model prose, scores, sensitive inference, raw provider response, provider debug fields, or automatic camera commands.

This is closer to the inferred Doka responsibility split than the prior rule-only selector, but it still does not claim Doka's proprietary model, dataset, thresholds, model placement, or visual design. A single successful sample proves integration and schema alignment, not composition quality across all scene families. Multi-scene human review remains required.

## What This App Implements In P1

P1 implements a functional-equivalent local loop without copying Doka branding, visual assets, proprietary copy, code, or model weights:

- Reuses the existing low-frequency Camera analysis path at about 2 samples per second.
- Keeps face and human-body geometry as the first subject candidates.
- Adds Apple Vision objectness saliency as a generic-subject fallback for scenes without a detected person.
- Chooses and locks a nearby rule-of-thirds target plus a bounded subject-fill target for the current compose session.
- Draws a separate original target frame, current subject outline, center marker, and optional device-level line.
- Emits one calm action at a time: move the subject left/right/up/down, move closer/zoom, leave more space, or hold the framing.
- Keeps capture manual and treats deliberate tilt/unusual framing as valid creative intent.
- Shows an explicit local-only note in the overlay.

Apple documents that Vision saliency can identify image areas likely to contain objects, while Core ML can run predictions with CPU/GPU/Neural Engine on-device: [Vision objectness saliency](https://developer.apple.com/documentation/vision/vngenerateobjectnessbasedsaliencyimagerequest), [Core ML overview](https://developer.apple.com/documentation/coreml/).

## What P1 Does Not Claim

P1 is not a Doka-equivalent trained composition model. It does not yet understand named objects, scene semantics, leading lines, background clutter, visual storytelling, or the relative aesthetic merit of multiple possible layouts. It also does not auto-control optical zoom, auto-capture, or use a cloud VLM.

The guide is a deterministic, bounded policy over local geometry. That makes it testable, private, responsive, and suitable for gathering product feedback before model work.

## P2 Explicit Subject Selection And AR-style Alignment

P2 implements the ambiguity control signaled by Doka's public long-press subject-selection behavior without claiming its proprietary tracker:

- Vision returns a bounded candidate list rather than only the largest subject.
- Aspect-fit preview touches are inverted back into Vision coordinates, including front-camera unmirroring.
- Long press locks a containing or nearby candidate and resets the composition target for that subject.
- Subsequent frames match only the same candidate kind near the prior center.
- A lost match shows reacquisition instead of switching to another person or object.
- A cyan frame and lock badge provide the AR-style visual state; this needs no ARKit world session.

This nearest-candidate tracker is intentionally bounded and is not identity recognition. Crossing subjects and fast motion still require physical-device QA; a future local `VNTrackObjectRequest` evaluation may be considered before any learned tracker. Xiaoyi `gpt-5.6-luna` is not required for P2 because no scene-language decision is needed.

Apple describes AR world tracking as maintaining correspondence between real-world and virtual 3D coordinates, while also warning that AR configuration features consume energy and compute. P2 needs neither 3D coordinates nor anchors, so an AVFoundation/SwiftUI screen-space overlay is the narrower choice: [Understanding World Tracking](https://developer.apple.com/documentation/arkit/understanding-world-tracking), [ARKit configuration objects](https://developer.apple.com/documentation/arkit/configuration-objects). Apple Vision's tracking requests remain a possible local follow-up if device QA shows nearest-candidate matching is insufficient: [VNTrackingRequest](https://developer.apple.com/documentation/vision/vntrackingrequest).

## P3 Conservative Temporal Stabilization

P3 improves the observable lock behavior without claiming identity or adding a learned tracker:

- predict the selected rectangle's next center from its recent bounded motion;
- score only the same local candidate kind by predicted-center distance, rectangle overlap, and relative area;
- reject geometrically implausible candidates before ranking;
- reject a frame when the two best candidates are similarly plausible, avoiding an arbitrary swap during crossings;
- smooth accepted rectangles before driving the cyan lock frame and guidance; and
- decay motion across bounded misses while the UI shows reacquisition.

This closes the largest deterministic P2 weakness—nearest-center jitter and avoidable swaps—without storing a trajectory, recognizing a person, or starting ARKit. Physical-device evidence is still required before deciding whether Apple Vision tracking requests materially improve the bounded use case.

## P4 Explainable Composition Policy

P4 fills the strategy-selection gap identified in the original six-stage decomposition. It does not attempt to reproduce Doka's proprietary learned policy; it introduces three transparent local families that the UI can name and test:

- rule of thirds for most portrait/body subjects and off-center generic objects;
- centered balance for geometrically centered close subjects; and
- negative space for small generic subjects where preserving surrounding room is useful.

The policy uses only subject kind, normalized rectangle area/aspect, and center location. It cannot claim to understand gaze, leading lines, storytelling, symmetry, attractiveness, or whether a composition is “good.” Multiple plausible subjects trigger explicit choice only after two consecutive samples, and the active target stays stable instead of oscillating between policies. The overlay renders a matching 2D grid and names the current creative starting point.

## P5 Image-content Horizon Cue

The Doka-style overlay benefits from distinguishing phone orientation from visible scene orientation. CoreMotion can summarize how the device is held, but it cannot know whether a photographed sea horizon, table edge, or architectural horizon appears tilted in the image. P5 therefore adds Apple's local `VNDetectHorizonRequest` only while Compose is active.

The classic Vision request reports a `VNHorizonObservation` angle/transform and inherits observation confidence. P5 gates confidence and ±25-degree range locally, transfers only a 0.5-degree-rounded angle, requires two agreeing samples, smooths continuation, and clears after two missing samples. The UI overlays the detected line against a dashed horizontal reference and keeps the wording optional. It does not run contour extraction, infer scene meaning, auto-rotate pixels, or declare tilt wrong: [VNDetectHorizonRequest](https://developer.apple.com/documentation/vision/vndetecthorizonrequest), [VNHorizonObservation](https://developer.apple.com/documentation/vision/vnhorizonobservation), [VNObservation confidence](https://developer.apple.com/documentation/vision/vnobservation/confidence).

## P6 Stabilized AR Action Layer

The observable Doka interaction uses spatial guidance, not text alone. P6 converts this app's subject-to-target difference into one visible manual action. Horizontal and vertical displacement are divided by their respective tolerances, so the larger normalized error wins; scale is considered only once placement is close enough. This corrects P1-P5's fixed horizontal-first ordering.

The first action is responsive, but later switches require two consecutive proposals. Movement, zoom, leave-space, and aligned states each have exit hysteresis so a low-frequency detector cannot rapidly alternate around a boundary. Movement becomes a bounded screen-space arrow; scale and ready states use nonnumeric target-centered symbols. The overlay does not actuate the camera or claim that following the cue improves an objective score.

## P7 Pose-edge Framing Guard

Rectangle alignment alone can miss a person-framing risk: a reliable visible head, wrist, or ankle point can approach the preview boundary while the aggregate body box remains close to its target. P7 reuses the human-body pose observation already required to build body boxes and reduces high-confidence points to left/right/top/bottom proximity only. It does not add a second request, identify the joint, or infer that an unseen limb is cropped.

Two repeated samples activate or replace the edge set and two clear samples remove it. Unresolved target placement still wins; once placement is close, stable edge evidence selects the existing leave-space action. Short orange edge markers explain the spatial reason without adding a skeleton or numeric score. This is a conservative local safeguard, not scene semantics, so Xiaoyi `gpt-5.6-luna` remains unnecessary in the live loop.

## P8 Preview/Vision Orientation Contract

The AR-style loop is useful only if detection, drawing, and touch selection describe the same image. AVFoundation can physically rotate video-data-output pixel buffers, while Vision's image-orientation argument describes how the pixels it receives still need to be interpreted. The prior combination requested a 90-degree output rotation and also fixed Vision at `.right`, risking a second logical rotation.

P8 keeps the hardware portrait rotation required by the filtered preview, records whether it was supported, and chooses Vision `.up` for the physically rotated path or `.right` for the sensor-native fallback. Native preview rotation, filtered-preview fallback, Vision requests, overlay mapping, and long-press selection now reference one typed contract. The feed deliberately remains portrait 3:4 and aspect-fit in landscape UI; full interface-following rotation is not silently inferred from screen orientation.

No semantic provider is needed for this deterministic coordinate problem. Xiaoyi `gpt-5.6-luna` remains reserved for a future explicit, consented, backend-mediated still-image analysis phase; ARKit remains unnecessary because the current feature is a 2D screen-space viewfinder overlay.

## P9 Stable Hold-to-ready Completion

The six-stage loop requires a distinction between briefly entering the target and holding a coherent frame. P1-P8 could display aligned as soon as the stabilized action changed, but did not represent that last dwell explicitly. Worse, several temporal controllers lived inside a general guide refresh method, so a user-triggered refresh could be mistaken for repeated frame evidence.

P9 creates one explicit fresh-frame path. Ambiguity, pose-edge, action-switch, and readiness state advance only when a new local frame analysis arrives. Once raw and stabilized geometry both say aligned, the first frame shows a hold cue and the second shows Ready with a one-shot haptic. Departing raw alignment resets the dwell even if action hysteresis briefly retains the previous display action.

This reproduces the observable interaction principle, not Doka's proprietary scoring or model. It exposes no progress percentage, quality score, confidence, countdown, or capture gate and never triggers the shutter. Xiaoyi is unnecessary because the decision is temporal geometry, and ARKit remains unnecessary because the feedback is screen-space 2D AR styling.

## P10 Human-steerable Policy Alternatives

A deterministic or learned composition policy can still disagree with the photographer's intent. Treating its first choice as mandatory would turn a creative assistant into a grader. P10 therefore exposes the three already-supported local policy families plus AI choice, and lets the photographer flip a non-centered target to the opposite side.

Changing the policy or side preserves the selected subject but starts a new target/action/Hold/Ready plan. This means the AR loop responds immediately without pretending that an ordinary UI action is new Vision evidence. The preference is session-only and resets when Compose is toggled.

The feature does not add new scene understanding, rank alternatives, or claim that one is best. Xiaoyi `gpt-5.6-luna` is unnecessary for an explicit user choice, and ARKit remains unnecessary because target alternatives are normalized 2D viewfinder geometry.

## P11 Visible Ambiguity Candidates

Long-press selection is not self-explanatory when several subjects are present but none is visually marked. P11 closes that AR affordance gap: after repeated local ambiguity evidence, the app outlines up to four candidates that the same gesture can actually select.

The displayed and selectable sets share one area gate, ordering, and bound. This avoids the misleading case where a hidden fifth candidate can be selected even though only four frames are visible. After selection, the alternative frames disappear and the existing geometric lock/tracker owns the chosen subject.

The outlines contain no numbering, subject label, identity, confidence, or aesthetic ranking. This is a screen-space selection affordance over existing Vision geometry, so neither Xiaoyi semantic analysis nor ARKit world tracking is needed.

## P12 Explicit Tap Focus And Exposure

AR composition guidance becomes more useful when the photographer can explicitly tell the optical pipeline which visible region matters. This is a Camera-control problem rather than a learned composition-policy problem.

P12 accepts an ordinary tap only inside actual aspect-fit camera content, converts it through the configured `AVCaptureVideoPreviewLayer`, then requests supported focus/exposure point modes under a short device configuration lock. The temporary reticle confirms the user's request; it does not claim the scene is objectively sharp or well exposed. A VoiceOver center action preserves explicit control without retaining coordinates.

Vision candidates and Compose targets never actuate this path. Automatic subject-driven focus could silently override creative intent and would require a separate product/UX decision. Xiaoyi `gpt-5.6-luna` cannot reduce the latency or improve AVFoundation coordinate conversion, while ARKit world anchors add no value to a 2D optical point of interest. Both remain out of the live P12 loop.

## P13 User-lock Vision Sequence Tracking

The Doka-style interaction feels continuous only when the selected subject frame moves between slower full-scene detections. Increasing every face/body/objectness/horizon request to display cadence would waste compute and still conflate detection with tracking.

Apple's sequence-tracking pattern starts from a nominated observation, runs `VNTrackObjectRequest` through `VNSequenceRequestHandler` on a background queue, and feeds accepted observations into the next frame. It also recommends periodic detector refresh. P13 applies that pattern to exactly one photographer-locked normalized rectangle with a 12 FPS ceiling, private conservative gates, two-miss loss, and approximately 0.5-second detector reseeding: [Tracking Multiple Objects or Rectangles in Video](https://developer.apple.com/documentation/vision/tracking-multiple-objects-or-rectangles-in-video), [VNSequenceRequestHandler](https://developer.apple.com/documentation/vision/vnsequencerequesthandler).

The temporary UUID represents a sequence generation, not a subject or person. It exists only to reject an old callback after reseed/unlock. Fast updates improve rectangle display cadence but are not new composition evidence; only the established full-analysis path may advance action and readiness controllers.

This is a 2D local video-sequence problem. Xiaoyi would add network latency and disclosure without improving frame-to-frame optical tracking, while ARKit world anchors would introduce 3D mapping and sensor cost unrelated to the normalized preview rectangle. Neither belongs in P13.

## P14 Sparse Luma Symmetry Evidence

Subject geometry alone cannot distinguish a balanced central scene from an ordinary centered object. P14 adds a deliberately narrow scene-structure signal: a fixed sparse set of left/right luma pairs from the same portrait viewfinder space. The analyzer checks whether the sampled structure is sufficiently textured and dynamic before considering mirror similarity and mean balance. It exports a bucket, never a score or the private measurements.

The evidence is intentionally temporal and conservative. Two fresh full-analysis observations are required before automatic Symmetry becomes eligible, and two clear/unavailable samples are required to leave it. Fast sequence-tracker frames are display updates rather than independent scene evidence. Near-center and area bounds prevent a symmetric background from forcing an inappropriate central target for a strongly off-center or extreme-scale subject.

Symmetry remains a creative alternative rather than a verdict. The photographer can choose it manually, the grid explains the central-axis intent, and no language claims the composition is better. This low-frequency 2D signal is cheaper and more private than sending frames to Xiaoyi, and it has no need for ARKit world anchors. Future semantic scene composition would require a separate user-initiated still-image backend phase; it is not inferred here.

## P15 Bounded Leading-line Convergence

The next observable Doka-style behavior is a target that respects strong perspective structure: roads, corridors, rails, and architectural edges can visually direct attention toward a convergence region. A subject rectangle alone cannot locate that region, while a cloud VLM is too slow and disclosure-heavy for a continuous viewfinder loop.

P15 therefore samples a fixed 24×32 luma grid, derives local edge tangents, and keeps only a small spatially distributed set. Directionally different edge pairs vote for bounded intersections; the selected region must then be supported directly by enough radial edges across several screen sectors and orientation families. The implementation uses fixed ceilings rather than resolution-dependent contour lists. Apple exposes `VNDetectContoursRequest`, but adding another full-image Vision request is unnecessary for this bounded cue: [VNDetectContoursRequest](https://developer.apple.com/documentation/vision/vndetectcontoursrequest), [Core Video plane access](https://developer.apple.com/documentation/corevideo/cvpixelbuffergetbaseaddressofplane%28_%3A_%3A%29).

Temporal policy matters as much as spatial detection. Two nearby full-analysis observations establish a target; small changes retain it, a new distant point needs two confirming samples, and two clear samples remove it. This prevents the grid and action arrow from jumping between incidental intersections. The detected point is useful only when a bounded subject is already reasonably near it, so the assistant never demands an extreme move across the frame.

This remains nonsemantic 2D geometry. The app cannot claim a detected line is a road, hallway, story cue, or objectively good composition. Xiaoyi `gpt-5.6-luna` remains reserved for separately approved, user-initiated still-image semantics through the backend, and ARKit remains unnecessary because the point has no world anchor, depth, or persistent spatial identity.

## P16 Bounded Quiet-space Side Evidence

Subject size alone can suggest negative space but cannot tell which side of the current viewfinder is structurally calmer. A continuous cloud VLM would be too latent and disclosure-heavy, while a complete visual-clutter model would add complexity and make stronger claims than this feature needs.

P16 therefore reuses P15's fixed portrait luma grid and read-only lock. It compares the same number of local horizontal/vertical luma differences in fixed left/right zones, then exports only a stable lower-activity side bucket. Blank and similarly textured halves are rejected through private absolute/relative gates. Two matching full-analysis samples activate or switch the side, while two clears remove it; the fast subject tracker remains display geometry only.

Automatic Negative Space places a bounded small subject opposite the quiet side only when that move is already within a conservative distance. The displayed tint explains which screen region the photographer is being invited to preserve, but manual policy and target flip remain available. Leading Lines keeps priority because a supported convergence point is more spatially specific than a broad half-frame activity difference.

This is not semantic emptiness or full clutter estimation. Visual clutter literature considers richer feature congestion and colour/orientation structure, so P16 deliberately calls its result lower luma activity and never an aesthetic score ([Rosenholtz et al., 2007](https://citeseerx.ist.psu.edu/document?doi=c8318039383ab2963c3b7778db5f71fcb4a00f32&repid=rep1&type=pdf)). Xiaoyi `gpt-5.6-luna` remains reserved for separately approved, user-initiated backend still-image analysis; ARKit remains unnecessary because the guide is normalized 2D screen-space rather than a depth/world anchor.

## P17 Motion-coherent AR Evidence

A responsive overlay is still misleading if it treats a panning or shaking phone as several independent, trustworthy composition observations. Scene lines, quiet-side activity, subject candidates, and readiness can all change rapidly because the camera moved rather than because the intended composition settled.

P17 reuses the existing CoreMotion monitor and adds local rotation-rate magnitude to its short-lived acceleration samples. A 500 ms summary collapses the private values into one stable/moving/unavailable bucket. Moving immediately freezes policy and readiness evidence; an existing target remains as a visual reference, while a new target cannot be chosen until two fresh stable/unavailable full-analysis samples release the pause. Fast sequence tracking may redraw the chosen subject but cannot counterfeit release samples.

The gyroscope-style reticle explains that the guide, not the photographer or shutter, is paused. The wording leaves room for deliberate handheld motion, which is especially important for retro/candid intent. Device motion does not prove image blur or subject movement, so the feature never labels either and never blocks capture.

Apple exposes local device-motion updates through `CMMotionManager`, including `CMDeviceMotion.userAcceleration` and `rotationRate`: [CMMotionManager](https://developer.apple.com/documentation/coremotion/cmmotionmanager), [CMDeviceMotion](https://developer.apple.com/documentation/coremotion/cmdevicemotion). This is a 2D guidance-coherence problem, so Xiaoyi `gpt-5.6-luna` would add latency/disclosure and ARKit world tracking would add unrelated mapping cost. Neither belongs in P17.

## P18 Explicit-lock Lead Room

A moving subject often benefits from visible space ahead, but the live loop does not need a semantic action model to offer that starting point. P18 reuses the horizontal velocity already calculated by the full-analysis temporal matcher for one photographer-selected rectangle. It accepts only fresh detector matches, reduces them to left/right/none, and requires two matching observations before activation or reversal.

P17's device-motion gate is a necessary companion: when the phone moves, Lead Room evidence freezes rather than mistaking camera pan for subject motion. One missing or weak sample is tolerated and a second clears the bucket. P13 fast tracking remains display interpolation and cannot manufacture temporal evidence.

The 2D overlay places the subject on the opposite third and marks the open side with subtle dashed lanes. It does not claim to know speed, gaze, intention, identity, action, destination, or narrative meaning. Photographer policy choice and target flip remain available, and capture is never gated or triggered. This bounded local geometry is lower latency and more privacy-preserving than a live Xiaoyi call; ARKit world anchors do not improve a normalized screen-space relationship. A future user-initiated still-image semantic feature would require its own backend, consent, payload, validation, and rollout phase.

## P19 Photographer-selected Group Balance

The original ambiguity flow is safe for choosing one subject, but it leaves group photos without a coherent target. P19 adds an explicit alternative rather than silently guessing social membership: the photographer selects Group Balance, and the app temporarily unions two to four already-plausible local rectangles.

Two compatible full-analysis samples activate the group. Compatible motion is smoothed, a distant union needs two replacement samples, and two missing samples clear it. One retained miss may prevent visual flicker but cannot count toward action or Ready. P17 freezes the state during device movement, while P13 remains a single-lock display tracker and never supplies group evidence.

The AR output is one dashed union frame, one centered bounded target, and one central safe-region grid. It contains no names, member numbers, relationship labels, confidence, ranking, or claim that the candidates belong together. Because this is an explicit 2D geometry operation, Xiaoyi would add no reliable membership proof and ARKit world anchors would not improve the normalized union. Semantic group understanding would require a separate consented still-image backend phase and must not be inferred in this live path.

## P20 Synchronized Hardware-depth Layers

The remaining visible spatial gap is foreground/background separation. On compatible TrueDepth or LiDAR-capable AVFoundation formats, P20 time-matches the existing RGB output with one filtered hardware depth output rather than estimating depth from a cloud image or enabling the dormant Depth Anything sandbox.

The private analyzer uses the same orientation contract as the viewfinder, samples only a bounded subject interior and surrounding ring, and immediately reduces absolute depth to coarse distance, separation, and confidence buckets. Two reliable strong-separation full-analysis samples reveal a subtle offset halo and local badge; one clear sample is tolerated, the second clears, and P17 freezes the evidence while the phone is moving. The output explains that distinct depth layers exist but does not display metres, confidence, bokeh strength, or a quality judgment.

AVFoundation synchronization is the smaller and more truthful tool here. ARKit world tracking would add world maps, plane/mesh state, and sensor cost without improving a subject-relative 2D cue. Xiaoyi `gpt-5.6` cannot provide frame-synchronous metric geometry and would require continuous image disclosure, so it stays outside Camera. If a future feature needs a persistent 3D placement, occlusion compositor, or world anchor, ARKit should be evaluated in its own phase with a separate lifecycle/privacy/performance contract.

## P21 Capture-first Adaptive Workload

A Doka-style guide is not useful if its analysis makes the viewfinder stutter or delays the shutter. P21 therefore treats live AI as optional work below preview and capture priority. The existing fixed analysis/tracking ceilings remain in nominal state, become slower under Low Power Mode or fair thermal pressure, and stop under serious/critical pressure.

The thermal pause is explicit rather than silently leaving a stale Ready frame. It clears action/pose/readiness evidence, removes the hardware depth stream, dims any preserved target, and shows one nonnumeric cooling reticle. RGB frames still reach the filtered preview before the workload gate, and all manual camera controls remain available. A five-second recovery dwell prevents repeated stop/start oscillation and requires a fresh full detector result before guidance resumes.

This is local resource scheduling, not an AI judgment or device-health diagnosis. Xiaoyi would add work and latency rather than reduce them, while ARKit would introduce another sensor/world-tracking budget. Neither belongs in the protective path. Future semantic still analysis can remain backend-mediated and user initiated without coupling it to this continuous Camera scheduler.

## P22 Foreground-aware AR Guide Occlusion

The Doka-like depth illusion becomes more convincing when the flat composition guide does not draw through a clearly nearer subject. P22 reuses P20's synchronized absolute hardware depth and current full-analysis subject rectangle, then reduces a bounded subject neighborhood to an ephemeral fixed 18-by-24 binary grid. It does not add a second detector, segmentation model, cloud frame, or world-tracking session.

Only reliable high foreground/background separation may produce cells. Private metric comparisons stay in the analyzer; isolated cells are discarded and strongly enclosed gaps are filled before only bounded indices leave the call. Two compatible masks activate, one miss is tolerated, two clear, and a distant replacement requires two observations. P17 motion entry, P21 thermal protection, lifecycle changes, and Group Balance remove the mask so old spatial evidence cannot be presented as live.

The visible implementation isolates grid/tint in a SwiftUI compositing group and cuts those pixels with `destinationOut`. The subject frame, target, action, Hold, and Ready stay visible above the cutout. Front-camera mirroring is a display-only column transform. Missing or weak hardware depth simply shows the existing 2D guide.

This is the smallest truthful tool for the current effect. ARKit should be reconsidered only for a separately scoped feature that needs world anchors, planes, meshes, camera pose, or persistent virtual placement. Xiaoyi `gpt-5.6` should be used only through the backend for separately consented semantic still-image analysis; it cannot improve frame-synchronous hardware occlusion and must not receive this live mask or Camera frames.

## P23 True Subject Lock

A Doka-style long press loses trust if the target family, target position, target size, or displayed subject box keeps changing after the photographer has made a choice. The prior implementation used two independently smoothed streams: each full detector sample overwrote display geometry and created a new fast Vision sequence seed, while later scene-evidence transitions were still allowed to clear the cached composition plan. This produced visible alternation even when every individual analyzer was behaving as designed.

P23 gives the streams separate authority. The full detector alone validates subject continuity through strict same-kind geometry and ambiguity gates. Fast `VNTrackObjectRequest` output fills display cadence and updates the match reference, but cannot erase detector misses or advance composition evidence. Routine detector confirmation keeps the existing sequence; material drift receives one smoothed correction/reseed. Position and size dead zones suppress sub-threshold shimmer in both paths.

The selected composition plan becomes photographer-owned state. Once created, automatic Symmetry, Leading Lines, Negative Space, Lead Room, and ambiguity transitions cannot replace it. Missing evidence holds the plan, removes stale action/Ready/depth cues, and enters a clear reacquiring state instead of following another visible candidate. A new long press remains the explicit way to select a different subject.

ARKit is intentionally not used for this repair. A world anchor can stabilize a point on a wall, table, or floor as the phone moves, but it does not identify or follow a moving person, pet, or object. A later Scene Lock should be a separate mode rather than silently changing Subject Lock semantics. Xiaoyi cannot supply low-latency continuity and remains outside the Camera frame loop.

## Correct Training Path For P3+

A trustworthy learned composition policy needs governed examples rather than scraped social-media photos. The first training branch should define:

- `subjectBox` and optional user-selected subject point;
- scene family without sensitive personal attributes;
- candidate composition family (`thirds`, `centered`, `symmetry`, `negative_space`, `leading_line`);
- target anchor and target size bucket;
- optional camera-motion direction and zoom/distance bucket;
- retro intent / deliberate imperfection flags;
- human reviewer decision and rejection reason;
- source, commercial-use/license, consent, deletion, and split manifests.

Create ML trains image models from labeled representative examples and requires separate train/test evaluation; Core ML can later personalize only models explicitly built as updatable models. See [Create ML image-classifier workflow](https://developer.apple.com/documentation/createml/creating-an-image-classifier-model) and [Core ML on-device model updates](https://developer.apple.com/documentation/coreml/personalizing-a-model-with-on-device-updates).

On-device personalization is not a shortcut around consent. If user photos ever improve a model, the app still needs a separate, false-by-default, revocable, auditable opt-in plus deletion handling. P1 stores no preview frame, model example, label, saliency output, face/body rectangle history, or Compose result.

## Performance And Failure Policy

- Analysis remains low frequency and off the main thread.
- Person geometry avoids the extra saliency request; saliency runs only when face/body proposals are absent.
- Late preview frames continue to be discarded.
- No detected subject produces a searching state, not a fabricated instruction.
- Lens/camera changes reset the target so old geometry is not reused.
- The selected target position and size remain stable during one compose session to prevent directional or zoom-reference flicker.
- Simulator/camera-unavailable behavior must remain safe.

## Next Quality Gate

Physical-device validation should cover people, close portraits, small and centered pets/objects, scenery with no clear subject, natural/artificial horizons, scenes with no reliable horizon, simultaneous X/Y/scale errors, action-threshold jitter, multiple subjects, low light, fast motion, same-kind crossings, front camera mirroring, lens changes, portrait/landscape device handling, policy/grid/horizon/action-cue legibility, filter-preview interaction, thermal load, and false saliency/horizon results. P3 tracking, P4 policy, P5 horizon, and P6 action stability must be evaluated before any `VNTrackObjectRequest`, custom-model artifact, Xiaoyi Camera semantics, or training run.
