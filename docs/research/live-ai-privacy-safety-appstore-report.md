# Live AI Privacy, Safety, App Store, and Legal Report

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

On-device live inference is safer than cloud live VLM because preview frames do not need to leave the device. However, privacy and safety obligations remain: face/person geometry must not become identity or sensitive inference, raw frames must not be logged or persisted, and any future user-photo training or AI-assisted labeling requires explicit consent, privacy policy, retention/deletion policy, and legal review.

Recommendation: keep live on-device inference local, ephemeral, geometry-only, and non-judgmental. Keep dataset collection, labeling, fine-tuning, and cloud post-capture analysis behind separate gates.

## Why This Matters For Our App

The app is a camera-first retro / film / Dazz-like product. Users are pointing a camera at people and private spaces. Live guidance must earn trust by staying local, quiet, and respectful.

## What Is Safer On-device

- No live preview upload.
- Lower provider exposure.
- Lower network latency/cost.
- Easier fail-closed behavior.
- Ephemeral geometry signals can be discarded.

Still needs review:

- what sensors are accessed.
- what data is logged.
- whether face/person detection is disclosed clearly.
- whether any data leaves device in post-capture flows.
- whether beta user photos are used for evaluation/training.

## Safety Policy By Area

### Live On-device Inference

Allowed:

- geometry boxes.
- pose regions.
- composition buckets.
- hardware depth buckets.
- ephemeral local signals.

Banned:

- identity recognition.
- age/gender/emotion/attractiveness/skin/health/ethnicity/religion/disability/body inference.
- raw frame persistence.
- face descriptors.
- score/rating language.

### Post-capture Advisor

Allowed only through approved backend/provider gates:

- one-photo analysis.
- schema-validated semantic keys.
- language-pack-driven final copy.

Banned:

- raw provider output in app UI.
- raw prompt/request/image logs.
- sensitive inference.

### Dataset Collection

Allowed only after separate approval:

- owned/staged/consented/licensed sources.
- manifest validation.
- metadata stripping.
- human review.

Banned:

- arbitrary scraping.
- user photos without explicit consent.
- unclear license sources.

### AI-assisted Labeling

Allowed only after approval:

- structured JSON label candidates.
- schema validation.
- human review.

Banned:

- raw provider response logs.
- free-form labels.
- sensitive labels.

### Fine-tuning

Blocked until:

- dataset/legal gates pass.
- consent and deletion policy exists.
- benchmark gaps are proven.
- safety labels are enforced.

## Consent And Privacy Policy Needs

Before user photos are used for training/eval:

- explicit opt-in.
- purpose explanation.
- retention period.
- deletion/revocation path.
- third-party processor disclosure if any.
- data categories in privacy policy.
- App Store privacy label review.
- legal review for minors/children risk.

## App Store Privacy Labels

Needs source verification before submission:

- On-device-only live geometry may reduce collected data categories if nothing leaves device and nothing is stored.
- Post-capture cloud analysis may require disclosure of photos/images processed by third parties.
- Beta user contributed training/eval data needs explicit disclosure and consent.
- Cloud AI-assisted labeling needs processor/vendor review.

## Logs

Allowed logs:

- feature enabled/disabled bucket.
- latency bucket.
- thermal bucket.
- FPS bucket.
- validation bucket.
- error bucket.

Banned logs:

- raw image/frame/base64.
- GPS.
- raw EXIF.
- raw sensor streams.
- face descriptors.
- raw prompts.
- request payloads.
- raw provider responses.
- API keys.
- provider URLs/secrets.
- sensitive labels.

## Recommended Architecture

```text
On-device live geometry/depth
-> ephemeral signals
-> safety guard
-> app language rules
-> short hint
```

For labeling/fine-tuning:

```text
approved source manifest
-> metadata stripping
-> schema labels
-> human review
-> benchmark only
-> legal/privacy gate before training
```

## Risks / Blockers

- accidental raw frame logging.
- misleading face detection wording.
- user misunderstanding of training use.
- consent revocation complexity.
- sensitive label leakage.
- App Store privacy mismatch.

## Suggested Phases

- Phase 21-A/B: on-device only, no upload.
- Phase 21-E: manifest-only dataset skeleton.
- Later: privacy/legal review before any user photo dataset or provider labeling.

## Do Now / Do Later / Do Not Do

Do now:

- Keep live inference local and ephemeral.
- Document banned sensitive inference.

Do later:

- Draft privacy copy before beta.
- Add consent flow only when data leaves device or training/eval use is proposed.

Do not do:

- Do not train on user photos now.
- Do not upload live frames.
- Do not store face/person descriptors.
- Do not show raw model/provider output.

## Concrete Next Codex Prompt

`Phase 21-A - On-device Vision Geometry Spike: add local-only geometry signals with no raw frame persistence, no cloud upload, no sensitive inference, no scoring, and no production rollout. Keep productionReady:false.`

## Source Notes

- Apple App Privacy Details: https://developer.apple.com/app-store/app-privacy-details/
- Apple Vision framework: https://developer.apple.com/documentation/vision

