# Photo Advisor App Language + Capability Audit

Phase: 18-A0  
Date: 2026-06-13  
Status: Audit / planning only

## Executive Summary

The current Photo Advisor already has a solid local/mock foundation: captured and imported photo flows exist, result cards support mood / suggestions / filter recommendations / crop / retake guidance, local capture context feeds CreativeIntentGuard, and language / tone preferences can affect mock/local Photo Advisor copy. The strongest app-specific voice currently lives in the Phase 17D intent-aware strings, especially around low light, motion, tilt, soft focus, grain, high contrast, and faded color.

The main gap is not capability plumbing. The main gap is language depth and consistency. Some base Photo Advisor strings still read like generic AI advice, especially filter reasons and broad neutral copy. Before sending capture context to a real provider, the app should define and implement a stronger Photo Advisor language pack so the real provider matches a retro camera assistant rather than a generic critic.

This phase does not implement new backend, cloud, provider, payload, or runtime behavior.

## Capability Coverage

| Capability | Status | Evidence | Notes |
| --- | --- | --- | --- |
| Captured photo advisor flow | Implemented | `CameraView` opens `PhotoAdvisorResultView` for captured `CapturedPhoto` with `captureContext`. | Local/mock by default; DEBUG remote path remains separate. |
| Imported photo advisor flow | Implemented | Imported photos use `CameraCaptureContext.imported(...)` with capture-only fields unavailable. | Imported source avoids fake level / motion claims. |
| Mood / vibe analysis | Partial | Fixture summaries cover warm, night street, indoor daily, CCD party, travel, bright, street-documentary, chrome mood. | Good range, but base resolver copy can still be generic. |
| Composition / framing advice | Partial | Aspect-ratio suggestions and fixture crop / composition strings exist. | Needs richer language for negative space, edge clutter, subject placement, and intentional unusual framing. |
| Lighting advice | Partial | Low light, bright light, warm highlights, shadows, contrast, and highlight control are represented. | Strongest in intent strings; base strings could better distinguish style-preserving vs cleaner alternatives. |
| Crop advice | Implemented | `PhotoAdvisorCropAdvice`, aspect-ratio logic, and fixture crop keys exist. | Some crop suggestions are practical; future pack should make “optional refinement” clearer. |
| Filter recommendation | Implemented | Resolver recommends whitelisted local filters by filter family / scene. | Reasons exist but are often short; needs stronger “why this filter fits” library. |
| Retake advice | Partial | `shouldRetake` exists, but current local path mostly keeps retake false and intent path avoids default retake. | Good direction; future copy must keep retake conservative and optional. |
| Creative intent preservation | Implemented | `CreativeIntentGuard` marks low light, motion blur, tilt, retro grain, soft focus, high contrast, faded color, unusual framing. | Strongest part of current app voice. |
| Capture context usage | Implemented locally | Capture context includes source, orientation, level, motion, exposure, lens, filters, local image buckets, creative intent. | Local-only; not uploaded. |
| Local image signal analyzer | Implemented | Buckets brightness, contrast, saturation, blur risk, warmth, clutter. | Approximate and safe; no identity / face inference. |
| DEBUG capture context preview | Implemented | DEBUG-only bucket preview shows Level / Motion / Light / Blur hint / Creative intent. | Good QA surface; not production UI. |
| Fallback / unavailable state | Implemented | Local fallback service and safe unavailable strings exist. | Copy is short and safe, but still says “mock” in some user-facing debug copy. |
| Multilingual support | Partial | English, Traditional Chinese, Simplified Chinese, Cantonese HK, Cantonese troublemaker strings exist. | Structurally good, but some strings are duplicated across `.lproj` files and tone quality varies by category. |
| Safety / sensitive inference guard | Implemented in policy and copy direction | Prompt / validator phases prohibit face, identity, age, gender, health, emotion, appearance, beauty, body judgments. | App copy mostly complies; future provider output must still be validated. |

## Current Language Inventory

### Mood / Vibe

Current strengths:

- Warm golden-hour / relaxed mood.
- Night street / high-ISO retro color.
- Indoor daily-life mood.
- Party snapshot / CCD style.
- Travel memory / summer light.
- Chrome / low-color street mood.
- Retro grain, dreamy retro, faded old-print, punchy film mood in intent strings.

Gaps:

- Mood language is often broad and reusable rather than scene-specific.
- “Retro camera” identity is strongest in intent strings, weaker in base fixture copy.
- Cantonese mood copy is better than neutral Chinese in personality, but not all categories get that flavor.

### Composition / Framing

Current strengths:

- Crop edge / empty space / right-bottom clutter language.
- Street-documentary and busy-background framing.
- Tilt as possible street-photo style.
- Unusual framing as possible intentional style.

Gaps:

- Negative space language is basic.
- Subject placement language is safe but can be generic.
- More explicit “keep the looseness if it feels intentional” patterns would help.
- Imported-photo-specific composition wording is not distinct.

### Lighting

Current strengths:

- Low light can carry retro mood.
- Warm highlights / shadows can be preserved.
- Bright highlights can be softened with lower-contrast filters.
- Strong contrast can be a film mood rather than a mistake.

Gaps:

- Base lighting suggestions sometimes still imply correction first, e.g. “lower highlights” or “brighten slightly.”
- Under / over exposure needs more consistent “style first, optional cleaner version second” language.

### Filter Fit

Current strengths:

- Filter IDs are whitelisted and mapped through local recommendations.
- Filter families include warm, street chrome, night neon, cinematic, CCD, travel, chrome mono.
- Some reasons are concrete, e.g. warm low-light street scenes, direct-flash warmth, black-and-white tone.

Gaps:

- Many reasons are too short to feel like a camera app point of view.
- Filter explanations should tie to image signals: light, contrast, color, shadow, grain, mood.
- Avoid generic “try this filter” without a photographic reason.

### Retake / Refinement

Current strengths:

- Local intent path explicitly says no default retake.
- Bright / overexposed mock scene no longer requires retake after Phase 17D-D.
- Retake copy is usually optional and framed as an alternate.

Gaps:

- Some base strings still mention retake as a category; future language pack should reduce prominence and rename mentally as “alternate shot” where possible.
- Real provider prompts must not convert technical signals into retake instructions.

### Creative Intent

Current strengths:

- Low light, motion, tilt, soft focus, grain, high contrast, faded color, unusual framing are treated as style possibilities.
- Cantonese troublemaker copy mostly stays playful without explicit profanity.
- CreativeIntentGuard is a good app-language anchor.

Gaps:

- Base fixture copy does not always use CreativeIntentGuard-style phrasing.
- Some languages are more natural than others; manual review is still needed for Cantonese and Simplified Chinese.

### Fallback / Unavailable

Current strengths:

- Fallback copy is short and non-alarming.
- Provider failure does not expose raw provider errors.
- Cloud debug fallback uses local advice.

Gaps:

- Some UI labels still explicitly say “mock,” which is useful internally but should be reviewed before production-facing release copy.

## Language Gaps

1. Base Photo Advisor copy is less distinctive than intent-aware copy.
2. Filter reasons need a stronger reason library tied to light, contrast, color, grain, and scene mood.
3. Crop / framing language needs more optional “style-preserving” alternatives.
4. Imported-photo-specific copy is limited; imported photos should not imply capture-only context.
5. Cantonese conversational tone is present but should be manually reviewed for naturalness and consistency.
6. Simplified Chinese exists but should be checked for naturalness rather than direct conversion feel.
7. Unavailable / debug labels mention mock/local concepts that are fine for internal QA but not final product language.
8. Future real AI output could become too generic unless provider prompts include a stronger app voice contract.
9. Future real AI could overcorrect capture context unless the prompt explicitly says capture context is not a scoring system.
10. Current app has no dedicated language QA checklist for Photo Advisor voice beyond safety/manual smoke tests.

## Recommended App Voice

Voice:

- Warm.
- Practical.
- Retro-camera-aware.
- Calm and non-judgmental.
- Short and UI-friendly.
- Opinionated about photographic mood, but not overconfident.
- Not a generic AI assistant.
- Not a score, rating, beauty, or correction system.

Core wording pattern:

1. Start with mood or style.
2. Acknowledge possible creative intent.
3. Recommend one filter, crop, or style-preserving adjustment.
4. Offer technical improvement only as optional.
5. Avoid default retake.

Preferred examples:

- “呢張有低光復古 snapshot 感，暗位可以保留。”
- “如果你想乾淨少少，可以下次靠近光源或者用柔和暖色 filter。”
- “微微鬆郁幾有菲林隨拍感。”
- “畫面有少少斜，可能幾有街拍感；如果你想更工整，可以後期拉直少少。”
- “For a cleaner look, wait half a second before tapping the shutter; for a dreamy retro look, the slight motion can work.”
- “If you want to keep the dreamy retro mood, keep the softness and use a gentler filter.”

Avoid:

- “This photo is bad.”
- “Wrong exposure.”
- “Retake this.”
- “The photo failed.”
- “Your subject / person / face / skin looks...”
- “The person seems happy / sad...”
- “Beautiful / attractive / young / old...”
- Any identity, health, body, beauty, gender, age, race, religion, disability, emotion, or face-recognition wording.

## Future Real AI Language Contract

Future Phase 18 real AI prompts and backend validators should follow this contract:

- Provider output must match the app voice: warm, practical, retro-camera-aware, concise.
- Output must use structured categories such as mood summary, composition, light, filter fit, crop, optional alternate shot, and caption only if approved.
- Provider must avoid face recognition, identity inference, age, gender, race, ethnicity, religion, health, disability, sexuality, emotion, attractiveness, beauty, body, and skin judgments.
- Capture context is non-sensitive technical metadata only.
- Use capture context to support light, framing, motion, filter fit, and style interpretation.
- Never use capture context to infer identity, emotion, attractiveness, health, or protected attributes.
- Do not overcorrect intentional retro style.
- Blur, tilt, grain, low light, soft focus, underexposure, overexposure, high contrast, faded color, and unusual framing may be intentional.
- Retake advice must be conservative, optional, and framed as “alternate shot” when possible.
- Technical improvements must use “if you want...” / “如果你想...” wording.
- Output should be short enough for the current card UI.
- Provider raw output must still be validated by backend schema, safety, filter whitelist, length, and no-payload logging guards.
- Invalid, unsafe, overlong, or generic provider output should fall back safely.

## Recommended Next Phases

1. Phase 18-A1 - Photo Advisor Language Pack Implementation
   - Implement a stronger local language pack for mood, composition, light, crop, filter reasons, and optional refinements across English, Traditional Chinese, Simplified Chinese, and Cantonese.

2. Phase 18-A2 - Filter Recommendation Reason Library
   - Build a deterministic reason library that explains why each filter fits based on light, contrast, color, grain, warmth, and scene mood.

3. Phase 18-A3 - Capture Context Cloud Schema Boundary
   - Design, but do not yet fully roll out, a backend schema placeholder for safe capture context fields. Keep it non-sensitive and explicitly exclude GPS, EXIF, raw sensor streams, identity, face, and personal inference.

4. Phase 18-B - Real AI Provider Prompt Alignment
   - Align provider prompts with the app voice and the capture-context contract, then test internally through the existing debug-only remote path.

## Audit Conclusion

The app is ready for a language-pack phase before deeper real AI integration. The current local/mock implementation already proves the product direction: Photo Advisor can preserve creative intent, recommend filters, and use capture context without becoming a lazy critic. The next step should strengthen the app-owned vocabulary first, then let real AI follow that language contract.

Production rollout remains blocked.

## Phase 18-A1 Implementation Note

Phase 18-A1 implements the first app-side language pack recommended by this audit. The local/mock Photo Advisor now uses structured `advisor.*` localization keys for mood, visual signals, retro intent, optional crop / straighten / retake wording, imported-photo fallback, provider-unavailable fallback, and filter recommendation reasons.

The implemented wording follows:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

It explicitly avoids treating blur, tilt, low light, grain, high contrast, faded color, soft focus, motion, or unusual framing as automatic mistakes. Backend provider payloads remain unchanged, capture context is not uploaded, Camera remains local-only, and production rollout remains blocked.

## Phase 18-A2 Implementation Note

Phase 18-A2 implements the filter recommendation reason library recommended by this audit. The local/mock Photo Advisor now maps every current app filter to a language family and resolves filter reasons from:

1. Filter family.
2. Matched safe photo signal.
3. Retro aesthetic result.

The first family set is:

- warm film
- faded pastel
- cinematic contrast
- night grain
- soft dream
- street chrome
- amber glow
- cool fade
- classic film

Filter reason wording is designed to explain why a filter fits without turning local image signals into a score or correction demand. Low light, blur, grain, tilt, faded color, high contrast, and soft focus remain possible retro style choices. Backend provider payloads remain unchanged, capture context and filter reason metadata are not uploaded, Camera remains local-only, and production rollout remains blocked.
