# Cloud AI Boundary Backend Skeleton

Phase 17A adds a backend boundary for future Cloud AI work.

By default this backend runs in mock mode. Phase 17C-R1 adds a Photo Advisor internal beta path through the QweAPI OpenAI-compatible gateway, but it is disabled unless explicitly enabled with local/internal backend config and server-side secrets. It must not store uploaded images or request payloads.

Phase 17C-Prep hardens the boundary before real provider work. Phase 17C-R1 adds backend-only QweAPI gateway support for the Photo Advisor internal beta at `/v1/ai/photo-advisor`; production rollout is still out of scope.

## Run

```sh
npm test
npm start
```

The server listens on `PORT` or `8787`.

Phase 17B iOS DEBUG builds expect the local mock server at:

```text
http://127.0.0.1:8787
```

This is for internal boundary testing only. It is not a production provider URL.

## Local QweAPI Internal Beta Setup

Do not commit real secrets. `.env` and `.env.*` remain gitignored.

Local internal test config:

```sh
QWE_API_KEY=replace_me
QWE_BASE_URL=https://qweapi.com
QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview
CLOUD_AI_PROVIDER_MODE=qweInternal
ALLOW_INTERNAL_CLOUD_AI=true
```

The active base URL is `https://qweapi.com`, and the provider adapter posts to `https://qweapi.com/v1/chat/completions`. The config loader trims whitespace, requires `https`, rejects query strings / fragments, and falls back safely when the base URL is missing or unsupported.

The auth header is OpenAI-compatible:

- `Authorization: Bearer <QWE_API_KEY>`

The API key is never printed, committed, or sent to iOS.

Optional internal token:

```sh
INTERNAL_CLOUD_AI_DEBUG_TOKEN=replace_me
```

If `INTERNAL_CLOUD_AI_DEBUG_TOKEN` is set, requests must send `X-Internal-Cloud-AI-Debug-Token`.
Otherwise DEBUG iOS requests send `X-Internal-Debug-CloudAI: true`.

Firebase-friendly deployment direction:

- store `QWE_API_KEY` in Firebase Functions secrets / Google Secret Manager
- keep QweAPI base URL configurable via `QWE_BASE_URL`
- keep model name configurable via `QWE_PHOTO_ADVISOR_MODEL`
- keep `ALLOW_INTERNAL_CLOUD_AI=false` unless intentionally running an internal beta
- do not commit Firebase project IDs, service account JSON, or production secrets

## Endpoints

- `GET /health`
  - Returns mock-only service status.
- `POST /v1/ai/photo-advisor`
  - Validates the hardened request shape.
  - Requires `schemaVersion: "1.0"`, `feature: "photo_advisor"`, `mode: "post_capture"`, locale, and explicit consent.
  - Accepts only mock-safe compressed JPEG image metadata / base64 payload shape.
  - Requires metadata stripping.
  - Validates optional `selectedFilterId` against the app filter whitelist.
  - Returns a structured `CloudAIResponse`.
  - Uses mock provider by default.
  - Can use QweAPI internal provider only when explicitly enabled and internally guarded.

## Provider Boundary

Executable provider kinds:

- `mock`
- `qweInternal`
- `disabled`

There is no Firebase AI, Stability, or image-generation provider implementation. QweAPI gateway access is backend-only and internal/debug guarded. Do not add provider SDKs to iOS or provider keys to the repo.

## Validation / Safety

Phase 17C-Prep adds:

- stricter request validation
- stricter response validation
- known filter ID whitelist
- unsafe text / sensitive inference guard
- standardized fallback / unavailable response
- dev-only rate-limit, quota, and provider timeout placeholders
- valid / invalid / unsafe backend fixtures

Phase 17C-R1 adds:

- QweAPI OpenAI-compatible Photo Advisor prompt contract
- server-side provider config / secret reads
- internal debug guard / kill switch
- structured JSON parsing
- one retry for invalid JSON / invalid schema / transient provider error / timeout
- fallback response for missing key, disabled internal cloud, provider failure, invalid schema, and unsafe output

Run:

```sh
npm test
```

Developer-only text probe:

```sh
node scripts/probe-qwe-endpoint.mjs
```

The probe sends a text-only OpenAI-compatible chat completion request to `https://qweapi.com/v1/chat/completions`. It prints only sanitized status, path, auth mode, model, and latency. It does not print the API key, request body, base64 image data, or provider raw response.

Current internal verification: text-only QweAPI chat completions succeed, and the `gemini-3.1-flash-image-preview` OpenAI-compatible `image_url` payload returns a validated `source=cloud` Photo Advisor response through `/v1/ai/photo-advisor`.

## Photo Advisor Provider QA

Phase 17C-R2 adds a repeatable provider QA batch workflow for the internal Photo Advisor beta.

Run backend tests first:

```sh
npm test
```

Run provider QA:

```sh
npm run qa:photo-advisor
```

If this runtime does not have `npm`, run the script directly:

```sh
node scripts/run-photo-advisor-provider-qa.mjs
```

Image set options:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --image-set=synthetic
node scripts/run-photo-advisor-provider-qa.mjs --image-set=approved-real
node scripts/run-photo-advisor-provider-qa.mjs --image-set=all
```

The QA script:

- loads local `.env`
- requires `CLOUD_AI_PROVIDER_MODE=qweInternal`
- requires `ALLOW_INTERNAL_CLOUD_AI=true`
- sends only internal/debug Photo Advisor requests
- runs the backend route path, including request validation, provider retry, response validation, safety validation, and fallback
- writes a sanitized report to `backend/reports/provider-qa/photo-advisor-qa-report.json`

Local image policy:

- synthetic local QA JPEGs go in ignored `backend/tests/local-images/`
- approved real sample JPEGs go in ignored `backend/tests/approved-real-samples/`
- `backend/tests/local-images/` is ignored except for its README and `manual-review-template.json`
- `backend/tests/approved-real-samples/` is ignored except for its README
- the committed `manual-review-template.json` is a sanitized checklist template only
- use only non-sensitive, approved, metadata-stripped, small JPEGs
- do not commit private photos, large originals, EXIF / GPS metadata, or real user images
- approved real sample filenames should be non-personal, descriptive, and kebab-cased, for example `street-night-approved-01.jpg`
- macOS `._*.jpg` resource fork files are warned about and ignored

If no local QA images are present, the script uses a tiny built-in JPEG smoke image across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK`.

The generated report is ignored and must remain metadata-only. It includes counts for cloud success, fallback, latency, schema failures, safety failures, invalid filter IDs, safe unsafe-diagnostic labels, and manual language review flags. It must not include API keys, base64 images, raw request bodies, provider raw responses, EXIF, GPS, or face data.

Phase 17C-R3 local QA used five ignored synthetic JPEGs:

- `warm-rooftop.jpg`
- `low-light-street.jpg`
- `portrait-headroom.jpg`
- `busy-background.jpg`
- `flat-indoor.jpg`

Latest R3 QA observation:

- 20 total cases across `en`, `zh-Hant`, `zh-Hans`, and `yue-Hant-HK`
- 17 cloud successes
- 3 fallbacks
- fallback reasons: 2 `unsafe_response`, 1 `provider_timeout`
- average latency 9963 ms
- p50 latency 4657 ms
- p95 latency 35803 ms
- max latency 44980 ms
- 0 schema failures
- 0 safety validation failures in returned report metadata
- 0 invalid filter IDs

The p95 / max latency and remaining unsafe fallbacks are blockers for production rollout. Keep using internal QA before any public cloud AI release.

Phase 17C-R4 hardens the same internal/debug QA workflow. It does not change the product surface and does not enable production rollout.

R4 QA reports now include:

- `cloudSuccessCount` and `fallbackCount`
- average, p50, p90, p95, and max latency
- explicit timeout / unsafe-response / invalid-JSON / invalid-schema / invalid-filter / provider-error / unknown fallback counters
- `fallbackByCode` and normalized `fallbackByCategory`
- per-case `latencyBucket` and `fallbackCategory`
- `latencyAssessment` with separate recommendations for debug QA, internal testing, and production rollout

Timeout thresholds are centralized in `src/qa/photoAdvisorQAConfig.mjs` for reporting and review only. R4 does not raise provider timeouts to hide slow cases.

Manual review readiness:

- use the committed `backend/tests/local-images/manual-review-template.json`
- record image fixture name, locale, provider status, fallback code, latency bucket, language naturalness, filter fit, crop / framing usefulness, safety concern, and notes
- keep approved real sample photos local and ignored unless a future explicit safe asset policy allows committing them

Latest R4 QA observation:

- 20 total cases across the ignored local QA image set
- 18 cloud successes
- 2 fallbacks
- fallback reasons: 2 `unsafe_response`
- average latency 4969 ms
- p50 latency 4958 ms
- p90 latency 5421 ms
- p95 latency 5894 ms
- max latency 6778 ms
- timeout count 0
- 0 schema failures
- 0 safety metadata failures
- 0 invalid filter IDs
- `latencyAssessment.productionRollout` remains `blocked`

Production rollout remains blocked until latency instability, fallback rate, unsafe-response QA, and manual language / filter-fit review are resolved.

Phase 17C-R5 tightens unsafe-response reduction and approved real sample review:

- provider prompt is stricter about allowed photo-only topics: light, color, contrast, exposure, framing, crop, background clutter, non-identifying subject placement, retro mood, and filter fit
- provider prompt avoids face, skin, age, gender, attractiveness, beauty, emotion / mental state, health, body, identity, ethnicity, nationality, religion, disability, and protected-class wording
- unsafe fallback diagnostics use safe labels only: `appearance_or_identity_guard`, `sensitive_attribute_guard`, `banned_term_guard`, or `unknown_safety_guard`
- raw unsafe provider text is not written to reports, logs, README, tests, or UI
- manual review template now includes sample type, unsafe diagnostic label, crop / framing usefulness, and reviewer-local ID fields

Latest R5 QA observation:

- 20 total cases across the ignored synthetic local QA image set
- 19 cloud successes
- 1 fallback
- fallback reason: 1 `provider_invalid_json`
- unsafe-response count 0
- average latency 6130 ms
- p50 latency 4842 ms
- p90 latency 5837 ms
- p95 latency 9637 ms
- max latency 24372 ms
- timeout count 0
- 0 schema failures
- 0 safety metadata failures
- 0 invalid filter IDs
- `latencyAssessment.productionRollout` remains `blocked`

Production rollout remains blocked until unsafe-response reduction is stable across more runs, approved real sample review is complete, language quality is manually checked, and filter / crop usefulness is reviewed.

## No Payload Logging

Do not log:

- raw image data
- base64 image data
- full request payloads
- provider prompts
- provider raw responses
- EXIF / GPS metadata
- face data
- identity data
- sensitive inference

Allowed operational metadata, if needed in a future phase:

- request ID
- endpoint
- mode
- schema version
- status
- latency
- coarse image size bucket
- error code
- provider kind

## Future TODO

- Add authenticated backend boundary only after explicit approval.
- Add signed upload / download planning only after export and storage policy are approved.
- Tune QweAPI internal beta latency / QA before any production rollout.
- Phase 17D-A iOS capture context is local-only. Backend request payloads are unchanged in that phase, and capture context is not uploaded to `/v1/ai/photo-advisor`.
- Phase 17D-B local Capture Intelligence Pack is also iOS-local only. Backend request payloads remain unchanged; level / motion / local image signal buckets and creative intent context are not uploaded in this phase.
- Phase 17D-C is iOS local-only QA / stability polish. Backend request payloads remain unchanged; capture context, local image signal buckets, and CoreMotion summaries are still not uploaded.
- Phase 17D-D is an iOS local-only real-device manual QA kit / tuning pass. Backend request payloads remain unchanged; capture context, device QA notes, local image signal buckets, and CoreMotion summaries are still not uploaded.
- Phase 18-A0 is a documentation-only Photo Advisor language / capability audit. Backend request payloads remain unchanged; capture context is still not uploaded.
- Phase 18-A1 is an iOS app-side Photo Advisor language pack implementation. Backend request payloads remain unchanged; capture context is still not uploaded, and provider prompts / endpoints are not changed in this phase.
- Phase 18-A2 is an iOS app-side local filter recommendation reason library. Backend request payloads remain unchanged; capture context and filter reason metadata are not uploaded, and provider prompts / endpoints are not changed in this phase.
- Phase 18-A3 is an iOS app-side CreativeIntentGuard language / retake restraint polish. Backend request payloads remain unchanged; capture context, creative-intent classifications, and filter reason metadata are not uploaded, and provider prompts / endpoints are not changed in this phase.
- Do not add Gemini Live, WebSocket, Camera cloud AI, Filter Generator real backend, or 改圖師 image editing in this backend phase.
- Do not commit secrets, `.env`, provider keys, Firebase config, or production storage config.
