# Live Framing Aesthetic Spatial Codebook

Status:

- research/codebook only
- productionReady:false

## 1. Executive Summary

This codebook is not a good/bad photo scoring system. It does not judge whether a frame is a "good photo" or a "bad photo," and it must not become a quality-rating dictionary.

It defines typed live-framing signals for future Apple Vision geometry rules, AVFoundation depth capability work, dataset labeling, AI-assisted label candidates, Florence-2 feasibility, and possible distillation. The app can use these signals to choose short, retro-aware hints while preserving creative intent.

The app language layer remains responsible for final UI copy. The desired pattern is:

`Observation -> Mood -> Retro intent -> Optional action`

Fine-tuning, LoRA, provider labeling, dataset crawling, and model distillation remain blocked until dataset, legal, consent, evaluation, safety, and benchmark gates pass.

## 2. Product Principles

This app is a retro / film / Dazz-like camera app. Live framing should feel like a calm camera companion, not a judge.

Principles:

- Mood-first guidance.
- Non-judgmental language.
- Creative-intent preservation.
- Signals before advice.
- Optional actions, not commands.
- No score.
- No bad-photo wording.
- No retake-first language.
- No sensitive inference.

Use:

`Observation -> Mood -> Retro intent -> Optional action`

Do not use:

`Score -> Problem -> Fix -> Retake`

## 3. How The Codebook Should Be Used

Allowed future users of this codebook:

- Apple Vision geometry rules.
- AVFoundation depth capability and safe depth buckets.
- Future Depth Anything V2 Small fallback benchmark, debug only.
- Future Florence-2 typed region signals, research/debug/post-capture only.
- Future dataset collector manifests.
- Future AI-assisted label candidates.
- Future human review workflows.
- Future distillation or LoRA only after legal, dataset, benchmark, and evaluation gates.

Models should not write final UI copy directly. Models should emit evidence and typed signal candidates only. The app language pack and rules engine choose the final hint, apply cooldowns, preserve retro intent, and reject unsafe wording.

No runtime implementation is added by this Markdown file.

## 4. Risk Signal Codebook

Risk codes mean "may need a gentle hint." They do not mean a frame is bad.

### A. Geometry Risk Codes

| Code | Meaning | Possible evidence | Severity guidance | When to suppress | Safe hint style | Banned wording |
| --- | --- | --- | --- | --- | --- | --- |
| `geo.edge_crowding.left` | Subject is close to the left edge. | Subject bbox left margin in tight bucket. | Low if stylized, medium if repeated, high only if likely clipping. | Strong candid energy, intentional asymmetry, subject looking into space. | "The subject is riding the left edge; that can feel candid, or leave a touch more air." | "too far left", "bad crop", "fix the mistake" |
| `geo.edge_crowding.right` | Subject is close to the right edge. | Subject bbox right margin in tight bucket. | Low to medium; high only for clipping risk. | Strong street snapshot or intentional off-center frame. | "The right edge feels close; keeping a little air can soften the frame." | "wrong side", "poor composition" |
| `geo.edge_crowding.top` | Subject or head area is near the top edge. | Top bbox/head region margin tight. | Medium if face/head likely clipped; low if silhouette. | Backlight silhouette, low-angle editorial crop, face not primary. | "The top edge is close; a little room can keep the film mood relaxed." | "head is cut badly" |
| `geo.edge_crowding.bottom` | Subject lower body or object is near the bottom edge. | Bottom bbox margin tight. | Medium for feet/object clipping risk. | Tight portrait crop, table/food detail crop, intentional half-body frame. | "The lower edge is tight; leave a little base if you want a calmer frame." | "clipped legs are bad" |
| `geo.headroom.tight` | Head/upper subject has little top space. | Face/person upper bound near frame top. | Medium if portrait-like subject. | Intentional close portrait, centered snapshot, low ceiling/background shape. | "Headroom is close; a small lift of space can keep the portrait softer." | "bad headroom" |
| `geo.headroom.too_open` | Too much empty space above subject may weaken focus. | Head top far below upper third with large blank upper area. | Low to medium. | Intentional empty sky, signage, backlight, negative-space mood. | "There is a lot of top air; it can feel quiet, or lower the frame slightly." | "too much dead space" |
| `geo.footroom.tight` | Lower subject has little bottom room. | Body/person lower bound near frame bottom. | Medium for full-body/group frames. | Half-body portrait, table/object crop, intentional close detail. | "Footroom is tight; a touch more base can make the frame breathe." | "feet are wrong" |
| `geo.footroom.clipped_risk` | Feet/object base may be clipped. | Pose/body lower keypoints or bbox below safe margin. | Medium to high if full-body intent is likely. | Portrait crop, no full-body evidence, subject intentionally cropped. | "The base may clip; step back softly if you want the full shape." | "retake", "ruined feet" |
| `geo.subject_scale.too_dominant` | Subject fills most of frame. | Subject area ratio high. | Low if close portrait; medium if context seems intended. | Beauty/identity wording forbidden; preserve close-up mood. | "The subject fills the frame; it feels intimate, or step back for more story." | "too big", "face too close", "unflattering" |
| `geo.subject_scale.too_small` | Subject occupies little frame area. | Subject bbox area low, center unclear. | Low to medium. | Landscape/street scene, silhouette, intentional small human scale. | "The subject sits small in the scene; that can feel cinematic, or move a little closer." | "subject is lost", "weak photo" |
| `geo.subject_center.too_edge_weighted` | Subject center is strongly weighted to one side. | Subject center near outer frame zone. | Low unless edge margin is also tight. | Intentional negative space, gaze direction, strong diagonal. | "The frame leans to one side; keep it for a candid feel or nudge inward." | "off balance is bad" |
| `geo.rule_of_thirds.off_balance` | Main subject is far from thirds/center balance. | Subject center not near center/thirds and no intent signal. | Low to medium. | Snapshot centering, symmetry, negative space, street energy. | "The balance feels loose; sliding slightly toward a third can calm it." | "does not follow the rule" |
| `geo.vertical_balance.tilt_unintentional` | Vertical lines or subject axis suggest accidental tilt. | Horizon/pose/body axis tilted without intent signal. | Low to medium; high only if severe and unstable. | Motion energy, Dutch angle, playful snapshot, handheld retro mood. | "There is a little tilt; it can feel lively, or level it for a calmer frame." | "crooked", "wrong angle" |
| `geo.negative_space.overpowering` | Empty space dominates subject focus. | Large low-detail area overwhelms subject bbox. | Low to medium. | Intentional empty sky/wall, minimal film mood, poster-like frame. | "The empty space is strong; it can feel quiet, or bring the subject closer." | "dead space", "wasted space" |
| `geo.multi_subject.spread_too_wide` | Group subjects are spread too far for the frame. | Multiple subject boxes near opposite edges. | Medium when group is likely main subject. | Environmental group, action scene, diagonal flow. | "The group stretches wide; stepping back can keep everyone in the same film frame." | "bad group shot" |
| `geo.main_subject.unclear` | The likely main subject is ambiguous. | Multiple boxes/saliency regions with similar prominence. | Low to medium; prefer no hint if confidence low. | Street scenes, layered compositions, abstract/object frames. | "Several shapes compete softly; choose one anchor if you want a clearer mood." | "confusing photo", "messy" |

### B. Depth / Spatial Risk Codes

| Code | Meaning | Possible evidence | Hardware depth / model help | Safety notes | Safe hint style |
| --- | --- | --- | --- | --- | --- |
| `depth.subject_background_merge` | Subject blends into background layer. | Low foreground/background separation, overlapping region colors/shapes. | Hardware depth, segmentation, or Depth Anything benchmark may help. | Do not describe body, skin, attractiveness, or identity. | "The subject and background are close together; a small angle shift can add film depth." |
| `depth.flat_layering` | Frame lacks foreground/midground/background separation. | Depth bucket flat, no clear layer regions. | Depth Anything benchmark may help; Vision geometry alone may be weak. | Flatness can be intentional retro style. | "The layers feel flat; a side step can bring more street depth." |
| `depth.foreground_obstruction` | Foreground object blocks main subject or anchor. | Segmentation/region overlap in front of subject bbox. | Segmentation/depth can help. | Do not identify private objects beyond broad safe region types. | "A foreground shape is taking attention; shift slightly if you want the subject cleaner." |
| `depth.background_too_busy` | Background regions compete with subject. | Many semantic/segmentation regions behind subject. | Florence-2 region candidates may help in research/debug. | Avoid "messy" or judgmental wording. | "The background has a lot of texture; a tiny angle shift can make the mood softer." |
| `depth.subject_distance_too_near` | Subject may be too close for intended framing. | Subject scale high, near depth bucket, edge clipping. | Hardware depth can help; otherwise infer only from bbox scale. | Never comment on appearance or body. | "The frame feels close and intimate; step back softly for more scene." |
| `depth.subject_distance_too_far` | Subject may be far from camera for intended framing. | Subject scale low, far depth bucket. | Hardware depth or Depth Anything benchmark may help. | Preserve landscape/silhouette intent. | "The subject sits far back; it can feel cinematic, or move closer for a warmer snapshot." |
| `depth.layer_confusion` | Multiple depth layers make the visual anchor unclear. | Several foreground/background candidates with similar prominence. | Depth + semantic regions may help. | Prefer no hint if confidence low. | "The layers overlap softly; choose one anchor if you want a quieter frame." |
| `depth.silhouette_subject_lost` | Backlit subject shape may not read clearly. | Backlight/low exposure plus weak subject mask/edge. | Segmentation/depth may help; Vision may detect outline. | Preserve silhouette mood first. | "The silhouette mood is strong; a slight side angle can make the outline clearer." |
| `depth.depth_confidence_low` | Depth/spatial signal is uncertain. | Missing depth, noisy segmentation, model confidence low bucket. | Use as a suppressor, not a hint trigger. | Do not invent depth claims. | Usually `action.no_hint`; if shown, say "The frame is changing quickly." |
| `depth.no_clear_foreground` | No foreground anchor is detected. | No foreground regions, flat depth buckets. | Depth Anything benchmark may help. | Not a problem in minimal frames. | "The scene is clean and open; adding a foreground edge can make it more cinematic." |

## 5. Strength Signal Codebook

Strength codes are reasons to preserve the frame. They are not photo scores.

### A. Geometry Strength Codes

| Code | Meaning | Evidence | Why preserve | Safe hint style |
| --- | --- | --- | --- | --- |
| `strength.geo.clean_subject_margin` | Subject has comfortable edge space. | Edge margins in safe bucket. | Keeps frame calm and printable. | "The subject has clean air around it; this frame can stay simple." |
| `strength.geo.balanced_headroom` | Top space supports portrait balance. | Headroom in balanced bucket. | Preserves natural snapshot feel. | "Headroom feels easy; keep the soft portrait balance." |
| `strength.geo.good_footroom` | Lower subject/base has comfortable room. | Footroom safe bucket. | Protects full-body or object base. | "The base has room to breathe; hold this framing." |
| `strength.geo.strong_centered_symmetry` | Centered composition appears intentional. | Subject centered, background symmetry. | Supports Dazz-like snapshot centering. | "The centered frame has a clean snapshot mood; keep it steady." |
| `strength.geo.near_rule_of_thirds` | Subject aligns near thirds. | Subject/face/anchor near thirds line/intersection. | Adds quiet composition without looking forced. | "The subject sits near a third; it gives the frame a calm rhythm." |
| `strength.geo.intentional_negative_space` | Empty space supports mood. | Large clean area with stable subject anchor. | Can feel cinematic, lonely, airy, or poster-like. | "The empty space feels intentional; it gives the film mood room." |
| `strength.geo.clear_subject_shape` | Subject outline reads clearly. | Bbox/mask/pose region distinct. | Helps retro silhouettes and small screens. | "The subject shape reads clearly; this is worth preserving." |
| `strength.geo.good_group_spacing` | Group members have comfortable spacing. | Multiple boxes separated without edge crowding. | Keeps group readable without formal posing. | "The group spacing feels natural; keep the candid rhythm." |
| `strength.geo.dynamic_diagonal_balance` | Diagonal placement creates energy. | Subject/region axis forms stable diagonal. | Preserves motion and street energy. | "The diagonal gives the frame energy; keep it if you like the lively mood." |

### B. Depth / Spatial Strength Codes

| Code | Meaning | Evidence | Why preserve | Safe hint style |
| --- | --- | --- | --- | --- |
| `strength.depth.clear_foreground_background` | Subject separates from background. | Depth/segmentation separation bucket high. | Adds clarity without harsh critique. | "The subject separates nicely from the background; hold the depth." |
| `strength.depth.layered_street_depth` | Scene has street-like spatial layers. | Foreground/mid/background regions present. | Supports cinematic retro street mood. | "The layers give it a street-film feeling; keep the angle." |
| `strength.depth.soft_background_separation` | Background falls away gently. | Soft depth separation, subject clear. | Keeps portrait warm and film-like. | "The background falls away softly; this keeps the portrait mood warm." |
| `strength.depth.strong_silhouette_shape` | Backlit outline reads well. | Subject outline distinct against bright region. | Preserves dramatic film silhouette. | "The silhouette shape is strong; keep the backlight mood." |
| `strength.depth.cinematic_depth_stack` | Multiple layers create cinematic depth. | Clear foreground/midground/background stack. | Adds visual story. | "The depth stack feels cinematic; this frame has room and story." |
| `strength.depth.subject_space_breathing` | Subject has spatial room around it. | Margin + depth separation + open space. | Avoids over-correction toward tight crop. | "There is breathing space around the subject; keep the relaxed frame." |

### C. Retro / Mood Strength Codes

| Code | Meaning | Evidence | Why preserve | Safe hint style |
| --- | --- | --- | --- | --- |
| `strength.retro.candid_street_energy` | Frame has spontaneous street energy. | Tilt/motion/asymmetry with stable anchor. | Prevents over-correcting candid style. | "The candid street energy works; keep the loose rhythm." |
| `strength.retro.soft_backlight` | Backlight gives gentle glow. | Bright region behind/around subject. | Supports film halation and silhouette. | "The backlight feels soft and film-like; keep it if you like the glow." |
| `strength.retro.low_light_mood` | Low light supports mood. | Low exposure bucket without total loss. | Preserves night/indoor film style. | "The low light has mood; keep the shadows gentle." |
| `strength.retro.film_grain_friendly` | Texture/noise may suit film preset. | Low light/high ISO-like texture bucket or grain preset context. | Avoids treating grain as failure. | "The texture can take grain well; a warm film preset may suit it." |
| `strength.retro.shadow_shape` | Shadows create graphic shape. | Strong dark region geometry. | Supports noir/retro contrast. | "The shadow shape gives it character; keep the contrast if it feels right." |
| `strength.retro.motion_energy` | Motion blur/subject movement adds energy. | Motion/stability bucket plus readable subject. | Preserves Dazz-like imperfection. | "The motion adds life; keep it for a looser snapshot feel." |
| `strength.retro.faded_color_mood` | Muted/faded color supports retro tone. | Low saturation/warm fade preset context. | Guides filter choice without correction. | "The faded color mood is already there; a soft film filter can carry it." |
| `strength.retro.snapshot_centering` | Centered frame feels like casual film snapshot. | Centered subject, simple margins. | Prevents unnecessary rule-of-thirds nudging. | "The centered snapshot feel works; keep it simple." |

## 6. Retro Intent Preservation Codebook

Intent codes tell the rules engine not to over-correct.

| Code | What it preserves | When to use | When not to use | Example safe hint |
| --- | --- | --- | --- | --- |
| `intent.preserve_backlight` | Glow, flare, silhouette, bright rim. | Backlight supports subject shape or mood. | Subject is fully unreadable and no silhouette intent is clear. | "The backlight has a film glow; keep it, or shift slightly for a clearer outline." |
| `intent.preserve_shadow` | Deep shadow and graphic contrast. | Shadow shape strengthens mood. | Shadow hides every intended subject anchor. | "The shadow shape feels cinematic; keep the contrast if you like the drama." |
| `intent.preserve_grain` | Texture/noise as film character. | Low light or grain preset context. | Severe noise removes all subject/scene readability. | "The texture can feel like film grain; keep it soft." |
| `intent.preserve_motion_blur` | Movement as candid energy. | Motion blur still leaves readable shape. | Blur removes all anchor and user appears to seek clean portrait. | "The motion gives it life; hold steady only if you want a calmer frame." |
| `intent.preserve_tilt` | Handheld/Dutch-angle energy. | Tilt pairs with street/candid/diagonal strength. | Strong tilt conflicts with symmetry or horizon intent. | "The tilt feels lively; level it only for a quieter mood." |
| `intent.preserve_centered_snapshot` | Dazz-like simple centered framing. | Centered subject has clean margin/snapshot mood. | Centering hides important context or clips subject. | "The centered snapshot mood works; keep it steady." |
| `intent.preserve_empty_space` | Negative space and quiet mood. | Empty space is clean and subject anchor is stable. | Subject becomes unclear or clipped. | "The empty space feels intentional; let it breathe." |
| `intent.preserve_low_light_mood` | Night/indoor dimness. | Low light supports retro atmosphere. | Exposure is so low that no safe subject/scene anchor remains. | "The low light has mood; brighten only if you want more detail." |
| `intent.preserve_candid_imperfection` | Minor imbalance, softness, or off-center charm. | Snapshot/street energy is present. | Safety risk or severe unreadability. | "The little imperfection feels candid; keep it if that is the mood." |
| `intent.unknown_do_not_correct` | Unclear creative intent. | Confidence is low or signals conflict. | A high-confidence safety/non-sensitive framing risk exists. | "No hint needed; let the frame settle." |

## 7. Advisor Action Codebook

Advisor actions are optional app actions, not commands.

| Action key | Purpose | Compatible codes | Example copy key | UI severity level | Cooldown suggestion | When to avoid |
| --- | --- | --- | --- | --- | --- | --- |
| `action.no_hint` | Stay silent. | `depth.depth_confidence_low`, `intent.unknown_do_not_correct`, strong intent/strength only. | `live_hint.none` | none | 0-2s | Avoid if high-confidence clipping risk repeats. |
| `action.preserve_current_frame` | Encourage holding a strong frame. | Any strength code, intent preservation codes. | `live_hint.preserve_frame` | low | 5-8s | Avoid if high clipping risk is active. |
| `action.leave_more_air_soft` | Add margin around subject. | Edge/headroom/footroom tight risks. | `live_hint.leave_more_air_soft` | low/medium | 6-10s | Avoid with intentional negative space or close portrait intent. |
| `action.move_subject_slightly_center` | Nudge subject away from edge. | `geo.subject_center.too_edge_weighted`, edge crowding. | `live_hint.move_subject_slightly_center` | low | 6-10s | Avoid with strong asymmetry, gaze-space, candid street energy. |
| `action.lower_camera_slightly` | Reduce excessive top space or recover lower subject. | `geo.headroom.too_open`, `geo.footroom.tight`. | `live_hint.lower_camera_slightly` | low | 8-12s | Avoid if lower frame is already crowded. |
| `action.raise_camera_slightly` | Add top/head space or reduce bottom crowding. | `geo.headroom.tight`, `geo.edge_crowding.top`. | `live_hint.raise_camera_slightly` | low | 8-12s | Avoid if top space is already overpowering. |
| `action.step_back_soft` | Increase scene context and reduce clipping. | `geo.subject_scale.too_dominant`, `geo.footroom.clipped_risk`, `depth.subject_distance_too_near`. | `live_hint.step_back_soft` | medium | 10-15s | Avoid if close-up/portrait crop intent is strong. |
| `action.shift_angle_for_depth` | Improve layer separation. | `depth.subject_background_merge`, `depth.flat_layering`, `depth.layer_confusion`. | `live_hint.shift_angle_for_depth` | low/medium | 10-15s | Avoid with low confidence or minimal composition intent. |
| `action.try_backlight_silhouette` | Suggest a creative silhouette option. | `strength.retro.soft_backlight`, `intent.preserve_backlight`, `depth.silhouette_subject_lost`. | `live_hint.try_backlight_silhouette` | low | 12-20s | Avoid if subject is fully unreadable or safety confidence low. |
| `action.crop_after_capture_optional` | Defer crop choice until after capture. | Mild edge/scale risk with strong mood/intent. | `live_hint.crop_after_capture_optional` | low | 15-25s | Avoid as a replacement for live clipping warnings. |
| `action.filter_warm_soft` | Suggest warm/soft film family after capture. | `strength.retro.soft_backlight`, `strength.retro.faded_color_mood`, low-light mood. | `live_hint.filter_warm_soft` | low | 20-30s | Avoid before capture if it distracts from framing. |
| `action.filter_cinematic_contrast` | Suggest contrast film family after capture. | `strength.retro.shadow_shape`, `strength.depth.strong_silhouette_shape`, backlight. | `live_hint.filter_cinematic_contrast` | low | 20-30s | Avoid if scene is already too dark to read. |

## 8. Safety Rejection Codebook

These banned label/output codes must reject an AI-assisted label candidate or any generated text. Human reviewers must not add sensitive labels. Face/person/body regions are geometry only.

| Ban code | Rejects |
| --- | --- |
| `ban.identity` | Identity, recognition, named person, face matching. |
| `ban.age` | Age estimation or age category labels. |
| `ban.gender` | Gender inference or presentation labels. |
| `ban.emotion` | Emotion, mood, mental state, or intent of a person. |
| `ban.attractiveness` | Beauty, attractiveness, flattering/unflattering claims. |
| `ban.skin` | Skin quality, color, texture, condition, or complexion labels. |
| `ban.health` | Health, illness, fatigue, disability-health assumptions. |
| `ban.ethnicity` | Race, ethnicity, nationality, ancestry labels. |
| `ban.religion` | Religion or belief labels. |
| `ban.disability` | Disability or impairment labels. |
| `ban.body_judgment` | Body size, shape, weight, attractiveness, or posture judgment. |
| `ban.personality` | Personality, character, social status, or intent labels. |
| `ban.score_rating` | Numeric quality score, stars, grades, or ranking. |
| `ban.bad_photo_wording` | "Bad photo", "poor shot", "ruined", "wrong", or equivalent judge copy. |
| `ban.retake_first` | Retake as the first or primary advice. |
| `ban.raw_model_text` | Free-form model text shown or stored as label truth. |
| `ban.raw_provider_response` | Raw provider response in logs, docs, UI, reports, or labels. |
| `ban.raw_prompt` | Raw prompts or request payloads. |
| `ban.raw_frame` | Raw preview frames, base64 image content, or raw image bytes. |
| `ban.gps_exif` | GPS, raw EXIF, camera serial/device identifiers. |
| `ban.face_descriptor` | Face embeddings, landmarks used for identity, biometric descriptors. |

Any AI-assisted label candidate containing these must be rejected. A rejected candidate may be summarized only by safe buckets such as `safety_rejected_sensitive_inference` or `safety_rejected_raw_output`.

## 9. Severity / Confidence Buckets

Allowed buckets:

- `severityBucket: low | medium | high | unknown`
- `confidenceBucket: low | medium | high | unknown`
- `reviewStatus: pending | accepted | rejected | needs_human_review`

Rules:

- No numeric scores.
- No 0-100 quality values.
- No star ratings.
- No "bad photo" labels.
- No "good photo" labels.
- No ranking users or images.

Severity means urgency of an optional hint, not image quality.

Confidence means reliability of the evidence, not photo quality.

## 10. Evidence Types

| Evidence type | Can support | Cannot prove |
| --- | --- | --- |
| `bbox` | Subject/region location, scale, margins, edge crowding. | Identity, age, emotion, attractiveness, final subject intent. |
| `pose_region` | Approximate body extent, headroom/footroom, group spread. | Body judgment, health, fitness, gender, emotion. |
| `composition_bucket` | App-derived framing categories such as margin, center, thirds. | Universal quality, good/bad labels. |
| `depth_bucket` | Foreground/background separation, distance buckets, layer relation. | Identity, private context, exact depth map truth unless approved hardware data exists. |
| `segmentation_region` | Foreground/object/sky/background masks or coarse regions. | Sensitive attributes, final UI copy. |
| `semantic_region` | Bounded region types such as person/subject/sky/window/street/table. | Open-ended captions, identity, demographics, personality. |
| `human_review` | Accepted/rejected code choices after policy training. | Permission to add sensitive labels or override privacy rules. |
| `synthetic_fixture` | Regression coverage and safe test cases. | Real-world distribution or production readiness. |
| `provider_label_candidate` | Draft code candidates from a model/provider. | Truth until schema validation and human review accept it. |

## 11. Proposed Label Candidate JSON

This is a non-runtime example for future schema planning only:

```json
{
  "schemaVersion": "live_framing_label.v1",
  "imageId": "opaque_image_id",
  "labelSource": "human_reviewed",
  "sceneType": "street_portrait",
  "riskCodes": [
    "geo.edge_crowding.left",
    "geo.footroom.clipped_risk"
  ],
  "strengthCodes": [
    "strength.depth.layered_street_depth",
    "strength.retro.candid_street_energy"
  ],
  "intentCodes": [
    "intent.preserve_candid_imperfection"
  ],
  "advisorActionKeys": [
    "action.leave_more_air_soft"
  ],
  "severityBucket": "medium",
  "confidenceBucket": "medium",
  "evidenceTypes": [
    "bbox",
    "composition_bucket",
    "human_review"
  ],
  "safety": {
    "containsSensitiveInference": false,
    "containsIdentityInference": false,
    "containsScoreOrRating": false,
    "containsRetakeFirstLanguage": false
  },
  "reviewStatus": "accepted"
}
```

## 12. Future Schema Plan

Future schema files may be useful, but they are not created in this phase:

- `backend/schemas/live-framing-aesthetic-codebook.v1.schema.json`
- `backend/schemas/live-framing-label-candidate.v1.schema.json`

This phase is Markdown only. JSON schema implementation, validators, package scripts, and backend test gates should be a later explicitly approved phase.

## 13. Dataset / AI-assisted Labeling Relationship

The future dataset bot should use this codebook as the allowed enum source for risk, strength, intent, advisor action, safety, bucket, and evidence values.

AI-assisted labeling should output code candidates only. It should not output final UI copy, arbitrary free-form labels, sensitive labels, raw provider text, raw prompts, raw images, or raw reports.

Human review is required before any label candidate can be used for evaluation, distillation, or training. Human reviewers must also follow the safety rejection codebook and must not add sensitive personal labels.

No arbitrary scraping is approved. No user photo training is approved without explicit consent, privacy policy, retention/deletion policy, revocation path, and legal review.

## 14. Florence-2 / Distillation Relationship

Florence-2 should not learn "good photo" or "bad photo" labels. It may help identify typed region/evidence candidates such as:

- person/subject bbox.
- sky/background/window/street/object regions.
- segmentation masks.
- grounding regions.

The app rules engine maps region evidence to codebook signals. For example, a person bbox near the left edge may map to `geo.edge_crowding.left`, while a strong backlit region plus readable outline may map to `strength.depth.strong_silhouette_shape` and `intent.preserve_backlight`.

Fine-tuning remains blocked until benchmark gaps prove need and dataset/legal/eval gates pass.

## 15. Do Now / Do Later / Do Not Do

Do now:

- Add the Markdown codebook.
- Link it from the research index.
- Record the docs-only phase.

Do later:

- Convert codebook values into schema enums.
- Add a dry-run validator.
- Use in dataset manifest and label candidate pipeline planning.
- Human-review label candidates.

Do not do:

- Do not train now.
- Do not scrape images.
- Do not run cloud AI labeling.
- Do not add model runtime.
- Do not add iOS runtime changes.
- Do not call Florence-2.
- Do not label photos good/bad.

## 16. Concrete Next Phase Suggestions

Suggested future phases only:

- `Phase 21-A2B: Codebook Schema Enum Gate`
- `Phase 21-E: Dataset Collector + AI-assisted Labeling Pipeline Skeleton`
- `Phase 21-D: Florence-2-base Feasibility Study`
- `Phase 21-C: Depth Anything V2 Small Core ML Sandbox`

This codebook does not change the current main next implementation phase unless the roadmap already requires it.
