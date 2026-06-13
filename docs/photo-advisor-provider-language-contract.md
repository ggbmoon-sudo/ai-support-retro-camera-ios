# Photo Advisor Provider Language Contract

Phase: 18-B0
Status: Provider language contract and schema alignment audit
Scope: Backend-mediated real AI Photo Advisor only; production rollout remains blocked.

## Purpose

The backend provider path must follow the same app-owned language system introduced in Phase 18-A1 through Phase 18-A5. Real provider output is allowed only when it can be shaped into the same concise Photo Advisor card voice as the local/mock advisor.

Provider output must follow:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

Provider output must not follow:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

## Non-Goals

Phase 18-B0 does not:

- enable production cloud AI
- add provider keys to iOS
- add direct provider calls from iOS
- add Camera cloud AI entry points
- upload capture context from iOS
- change the iOS upload payload
- persist raw images
- log raw image / base64 payloads
- log raw provider responses
- log prompts containing image data
- collect GPS/location
- collect raw EXIF dumps
- add Gemini Live, streaming, WebSocket, StoreKit, AI Filter Generator, or image editing

## App Voice Contract

Provider output must be:

- warm
- practical
- retro-camera-aware
- short enough for the result card
- non-judgmental
- not a generic AI critique
- not a photography score or grading system

Provider output must avoid:

- score/rating language
- "bad photo", "wrong exposure", "failed photo", "retake this", "must fix", or harsh "out of focus" copy
- generic "try this filter" as the main reason
- chain-of-thought
- system/provider/debug details
- raw markdown prose when structured JSON is required
- face, skin, age, gender, attractiveness, beauty, emotion, health, identity, ethnicity, religion, disability, body judgment, or other sensitive personal inference

Provider output must treat these as possible retro creative style unless severe unreadability is clear:

- blur
- motion
- tilt
- low light
- grain/noise
- soft focus
- overexposure
- underexposure
- high contrast
- faded color
- unusual framing

Retake advice must be rare, conservative, optional, and lower priority than mood/filter/style preservation.

## Schema Alignment Audit

The backend `CloudAIResponse` v1 schema currently maps to the app result card as follows.

| Backend field | App-side destination | Status | Notes |
| --- | --- | --- | --- |
| `schemaVersion` | `CloudAIResponseValidator` / mapper gate | Implemented | Must remain `"1.0"`. |
| `locale` | Remote response locale / fallback locale | Implemented | Provider should use requested locale for user-facing text. |
| `mode` | `PhotoAdvisorMode.postCapture` | Implemented | Real provider path is Photo Advisor post-capture only. |
| `source` | `PhotoAdvisorSource.cloud` or fallback | Implemented | Production card must not display provider/source labels. |
| `summary` | Mood headline / visual reason source | Partial | Existing backend uses `summary`; provider prompt now requires mood-first card-ready language. |
| `suggestions[]` | Visual reason / optional refinement / crop / retake candidates | Implemented | Max 3; UI displays only a prioritized subset. |
| `recommendedFilters[]` | Primary filter recommendation | Implemented | Filter IDs must be whitelisted and reasons must be short. |
| `recommendedFilters[].reason` | Filter reason text before app mapping | Partial | Provider must include photo signal + retro aesthetic result. App local path still uses reason keys. |
| `cropAdvice` | Optional crop / framing advice | Implemented | Must be optional and not framed as correction. |
| `retakeAdvice` | Optional retake advice | Implemented | Must remain rare and optional; null is preferred unless severe risk is likely. |
| `safety` | Backend and iOS validation gate | Implemented | `containsSensitiveInference` must be false. |
| `error` | Fallback state | Implemented | Must be safe, short, and never expose raw provider errors. |
| `moodHeadline` | Future provider field | Missing | Not in v1. Use `summary` as a short mood-first headline until a future schema phase. |
| `visualObservations[]` | Future provider field | Missing | Use `suggestions[]` conservatively until a future schema phase. |
| `creativeIntentNotes[]` | Future provider field | Missing | Use prompt/validator rules now; do not upload capture context in B0. |
| `straightenAdvice` | Future provider field | Missing | Currently represented as composition/crop suggestion if needed. |

## Prompt Alignment

`backend/src/prompts/photoAdvisorPrompt.mjs` must instruct the provider to:

- analyze only non-sensitive photographic qualities
- use the app voice pattern
- keep text short and UI-ready
- include a recommended whitelisted filter with a reason
- treat imperfections as possible retro style
- make refinements optional
- make retake rare and conservative
- return JSON only
- avoid score/rating, harsh fix-it language, sensitive inference, provider details, and chain-of-thought

Do not add capture context fields to the prompt until a future explicit schema phase.

## Validator Alignment

Backend validation must reject or safely fall back for:

- invalid JSON
- invalid schema
- too many suggestions
- overlong summary / suggestion / filter reason text
- unsupported filter IDs
- sensitive inference
- banned terms
- score/rating language
- harsh fix-it language
- provider/system/debug leakage
- chain-of-thought wording

Invalid or unsafe provider output must never be returned directly to iOS.

## Fallback Contract

Fallback responses must be:

- structured `CloudAIResponse`
- short
- calm
- recoverable when appropriate
- source `fallback`
- free of raw provider error text
- free of stack traces, endpoint details, prompts, and provider response text

Preferred app-facing direction:

- "Cloud AI is unavailable right now, so I’m showing a safe local suggestion instead."
- "I’m showing a safe local suggestion instead."
- "This imported photo has limited capture context, so I’m reading light, color, and framing only."

## Provider QA Fixture Plan

Provider QA should use synthetic descriptions or ignored local images only. Do not commit real photos or generated provider reports.

Required categories:

1. low light mood
2. warm indoor light
3. cool quiet tone
4. slight motion blur
5. soft focus / dreamy
6. tilt / snapshot
7. high contrast / street
8. faded color / low saturation
9. grain / night mood
10. background clutter
11. negative space
12. imported limited context
13. unsupported filter ID attempt
14. unsafe face / skin / beauty inference attempt
15. harsh retake wording attempt
16. overlong response attempt
17. invalid JSON attempt
18. provider unavailable fallback

## Phase 18-B1 Regression Fixture Matrix

Phase 18-B1 turns the fixture plan into committed synthetic regression fixtures at:

- `backend/tests/fixtures/provider-contract-regression-cases.json`
- `backend/tests/cloud-ai-boundary.test.mjs`

The fixture file is safe to commit because it contains JSON/text only. It contains no photos, image payloads, provider reports, API keys, raw provider responses from a live service, EXIF, GPS, or device-specific artifacts.

### Valid Provider Output Fixtures

| Fixture | Scenario | Expected validator result | A1-A5 / B0 rule |
| --- | --- | --- | --- |
| `valid-low-light-night-grain` | low light mood with night / grain language | accepted | preserve low-light retro mood before optional action |
| `valid-warm-indoor-warm-film` | warm indoor light with warm film reason | accepted | filter reason = warm light + softer film result |
| `valid-cool-quiet-tone` | cool quiet tone with faded finish | accepted | mood-first, short, non-generic copy |
| `valid-soft-focus-dreamy` | soft focus / dreamy mood | accepted | blur / softness can be intentional style |
| `valid-tilt-snapshot` | tilt / snapshot energy | accepted | straighten only if user wants a cleaner frame |
| `valid-high-contrast-street` | high contrast / street mood | accepted | high contrast can be cinematic or street-like |
| `valid-faded-color-pastel` | faded color / low saturation | accepted | faded color can be worn film style |
| `valid-imported-limited-context` | imported limited-context response | accepted | imported photos do not overclaim capture-time context |

### Rejected Provider Output Fixtures

| Fixture group | Examples | Expected behavior |
| --- | --- | --- |
| Parser failures | invalid JSON, markdown prose instead of JSON | throw `provider_invalid_json`, retry once in provider route, then safe fallback |
| Schema failures | missing summary, unknown mode, missing locale | reject as invalid schema and return safe fallback |
| Filter failures | unsupported filterId, filterId not in catalog | reject; provider cannot invent filters |
| Length failures | overlong summary, overlong filter reason | reject; output must stay UI-ready |
| App-voice failures | score/rating, generic "Try this filter", raw family id | reject; provider must not become a score / generic AI critique |
| Fix-it failures | bad photo, wrong exposure, retake-first wording, harsh out-of-focus copy | reject; provider must not use Score -> Problem -> Fix -> Retake language |
| Sensitive inference failures | face, skin, beauty, age, gender, emotion, health, race, religion, disability wording | reject as unsafe response |
| Leakage failures | chain-of-thought, provider/system/debug wording, stack-trace-style text, raw localization key | reject; raw internals must never reach iOS |
| Provider failures | provider unavailable, timeout / network failure | map to structured fallback without raw error text |

### Fallback Parity Requirements

B1 tests assert rejected provider output maps to a `CloudAIResponse` fallback that is:

- `mode: "unavailable"`
- `source: "fallback"`
- recoverable when appropriate
- schema-valid
- short and calm
- free of raw provider text
- free of stack traces, endpoint details, prompt contents, provider names, raw JSON, raw localization keys, score/rating, chain-of-thought, and sensitive inference wording

If backend fallback cannot provide final localized app copy, it must return only safe structured fallback fields. iOS then maps that state through the app-side language pack / result card model.

## A1-A5 Integration

Provider contract review should be run together with:

- `scripts/validate-photo-advisor-copy-regression.sh`
- `scripts/validate-photo-advisor-filter-reasons.sh`
- `scripts/validate-creative-intent-language.sh`
- `scripts/validate-photo-advisor-card-language.sh`
- backend cloud AI boundary tests

The provider contract is downstream of the app language system, not a replacement for it.

## Production Status

Production rollout remains blocked. A future production phase needs explicit approval plus provider QA, privacy review, cost/abuse guards, latency review, fallback review, and App Store-facing UX review.
