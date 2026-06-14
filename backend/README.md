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

Phase 18-B0 aligns the backend-mediated provider language contract with the app-side Photo Advisor language system from Phase 18-A1 through Phase 18-A5:

- provider output must follow Observation -> Mood -> Retro intent -> Optional action
- provider output must not use Score -> Problem -> Fix -> Retake
- filter recommendations must include a short safe reason connecting photo signal + retro aesthetic result
- blur, tilt, low light, grain, soft focus, high contrast, faded color, and unusual framing remain possible creative style
- retake advice must be rare, conservative, optional, and lower priority than mood / filter / style preservation
- validator coverage blocks score/rating language, harsh fix-it wording, provider/debug leakage, chain-of-thought wording, sensitive inference, banned terms, unsupported filter IDs, and overlong filter reasons
- fallback responses remain structured, short, recoverable, and free of raw provider details

Phase 18-B1 adds backend/provider contract regression fixtures and fallback parity checks:

- committed fixtures are synthetic JSON / text only; no photos, provider reports, or real user data are included
- valid fixtures cover low-light mood, warm indoor light, cool quiet tone, soft focus, slight tilt, high contrast, faded color, and imported limited-context responses
- invalid fixtures cover invalid JSON, markdown prose, missing fields, unsupported filter IDs, overlong summary / filter reason text, score/rating wording, harsh fix-it / retake-first copy, sensitive inference, chain-of-thought, provider/debug leakage, raw stack-trace-style text, raw localization keys, and raw filter-family IDs in displayable text
- provider failure fixtures cover provider unavailable and timeout / network fallback mapping
- rejected provider output maps to structured fallback before iOS can display it
- fallback parity tests confirm responses stay app-safe, short, validated, and free of raw provider text

See `../docs/photo-advisor-provider-language-contract.md`.

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

Run the safe provider contract QA:

```sh
npm run qa:photo-advisor
```

If this runtime does not have `npm`, run the script directly:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract
```

Run the dry-run safety gate before any real-provider QA:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --check-safety-gate
```

Real-provider image set options require explicit opt-in:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=synthetic
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=approved-real
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=all
```

The synthetic-contract mode uses the committed B1 fixture file only:

- `backend/tests/fixtures/provider-contract-regression-cases.json`
- no provider credentials
- no network request
- no real photo
- no prompt with image data
- no raw provider response

Use this mode for local / CI-style contract preflight before any real-provider QA run.

The QA script:

- loads local `.env`
- runs in either `provider` mode or explicit `synthetic-contract` mode
- fails closed for real-provider QA unless `--run-provider` is present
- requires `CLOUD_AI_PROVIDER_MODE=qweInternal` only for real-provider QA
- requires `ALLOW_INTERNAL_CLOUD_AI=true` only for real-provider QA
- sends only internal/debug Photo Advisor requests in real-provider mode
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

Phase 18-B2 aligns the provider QA runner with the B0/B1 contract:

- real-provider QA and synthetic-contract QA use the same `CloudAIResponse` validator, safe-text guard, and filter whitelist expectations
- reports include `runMode`, `providerConfigured`, safe provider / model buckets, `successCount`, `validationFailureCount`, invalid JSON / schema / unsupported filter / overlong text / unsafe / timeout / provider-error counters, and latency buckets
- reports include explicit safety flags: `payloadLoggingDisabled: true`, `rawImagePersisted: false`, `rawProviderResponsePersisted: false`, `rawPromptPersisted: false`, `reportContainsRawUserContent: false`, and `productionReady: false`
- console output prints only sanitized aggregate status, categories, and latency metrics
- production readiness remains false even when synthetic-contract QA passes

Real-provider QA still requires explicit local credentials and internal/debug config:

```sh
QWE_API_KEY=replace_me
QWE_BASE_URL=https://qweapi.com
QWE_PHOTO_ADVISOR_MODEL=gemini-3.1-flash-image-preview
CLOUD_AI_PROVIDER_MODE=qweInternal
ALLOW_INTERNAL_CLOUD_AI=true
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=synthetic
```

Do not commit the generated report. Do not paste raw provider output into docs, tests, reports, or issue comments.

Phase 18-B3 adds an internal dry-run gate for this workflow:

- `npm run qa:photo-advisor` is safe-by-default and runs synthetic-contract QA only
- `npm run qa:photo-advisor:gate` prints sanitized gate status and required operator confirmations
- `npm run qa:photo-advisor:provider -- --image-set=approved-real` is the explicit real-provider path
- real-provider QA must use local ignored credentials and local ignored approved samples only
- generated reports remain ignored under `backend/reports/provider-qa/`
- `productionReady` must remain `false`

See `../docs/photo-advisor-provider-qa-dry-run-gate.md`.

Phase 18-B4 defines how to review sanitized provider QA metrics:

- hard blockers include raw artifact leakage, unsupported filters accepted, score/rating or sensitive inference passing validation, raw localization keys, iOS provider keys/direct calls, Camera cloud entries, unapproved payload changes, and `productionReady=true`
- warning thresholds include invalid JSON/schema counts above 0, unexpectedly high fallback count, provider errors/timeouts above 0, overlong text above 0, repeated fallback by scenario, p95 latency above internal review thresholds, and locale mismatch
- synthetic-contract QA may pass only when it runs without network/API keys, rejects invalid/unsafe fixtures, passes redaction checks, and keeps `productionReady=false`
- optional real-provider QA remains internal/debug only, requires explicit `--run-provider`, local ignored credentials, approved ignored samples, sanitized aggregate metrics, ignored reports, and manual review

See `../docs/photo-advisor-provider-qa-review-thresholds.md`.

## Phase 19-A Open-weight VLM Backend ADR

Phase 19-A is documentation-only. It adds `../docs/open-weight-vlm-backend-architecture-adr.md` for a future self-hosted / open-weight VLM Photo Advisor backend direction.

The ADR compares:

- Qwen2.5-VL-7B, Qwen2-VL-7B, and MiniCPM-V as candidate models
- InternVL and LLaVA-next as later watchlist candidates
- Ollama, vLLM, SGLang, and Transformers / FastAPI as possible serving paths

The target architecture is still future-only:

- iOS uploads an image only after explicit post-capture consent
- backend strips metadata and enforces size/type limits
- backend calls a self-hosted VLM adapter
- VLM returns structured PhotoAdvisor JSON
- backend validates the JSON against the existing Photo Advisor contract
- unsafe / invalid / timeout output falls back safely
- iOS renders through the existing language pack and result card

Phase 19-A does not add model server code, run real-provider QA, change backend provider request payloads, change iOS upload payloads, upload capture context, add cloud availability, add iOS provider keys/direct calls, add a Camera cloud AI entry, or change `productionReady=false`.

Recommended next step is Phase 19-B: a local / ignored backend VLM sandbox or benchmark plan with no app integration unless explicitly approved.

## Phase 19-B Structured Advisor Benchmark Plan

Phase 19-B is documentation-only. It adds `../docs/open-weight-vlm-structured-advisor-benchmark-plan.md` for evaluating future open-weight VLMs as structured Photo Advisor backends.

The plan defines:

- first benchmark candidates: Qwen2.5-VL-7B-Instruct, Qwen3-VL-8B-Instruct, MiniCPM-V 4.5, and optional InternVL3-8B
- serving stack roles: Transformers + FastAPI for correctness, Ollama / LM Studio for local smoke/manual QA, vLLM as primary internal benchmark stack, and SGLang as structured-output / performance challenger
- synthetic/internal benchmark scenario categories covering bright, low-light, intentional blur, motion, tilt, grain, high contrast, faded color, imported limited context, severe blur, black image, unsupported filter, prompt injection, and safety cases
- a future enum/key-based VLM candidate JSON shape that does not include final UI prose
- backend validator/fallback responsibilities for JSON parsing, schema validation, `additionalProperties=false`, enum whitelists, source/context validation, filter-family-to-whitelisted-filter mapping, retake gating, safety scanning, and fallback
- metrics and gates for JSON validity, schema pass rate, safety, fallback, filter family match, creative intent preservation, retake false positives, imported-context overclaims, latency, VRAM/model-loading notes, and artifact hygiene

Phase 19-B does not add model server code, run real VLM/provider QA, train or fine-tune models, change backend provider request payloads, change iOS upload payloads, upload capture context, add cloud availability, add iOS provider/model keys or direct calls, add a Camera cloud AI entry, or change `productionReady=false`.

Recommended next step is Phase 19-C: an explicitly approved local benchmark harness plan with ignored fixtures/reports and no iOS app integration.

## Phase 19-C Open-weight VLM Synthetic Benchmark Harness

Phase 19-C adds a backend-only, local/synthetic benchmark harness skeleton for future open-weight VLM Photo Advisor evaluation.

Added components:

- `src/qa/openWeightVlmPhotoAdvisorSchema.mjs`
  - defines the candidate schema version and enum/key-based validation rules
  - validates `additionalProperties=false` behavior manually without adding dependencies
  - rejects invalid JSON, schema failures, unsupported enum values, unsupported filter families, imported capture-context overclaims, retake false positives, score/rating wording, sensitive inference flags, chain-of-thought flags, and debug/provider leakage
  - summarizes sanitized aggregate benchmark metrics only
- `tests/fixtures/open-weight-vlm-photo-advisor-benchmark-cases.json`
  - committed synthetic fixture cases only
  - no photos, private image paths, base64, user data, prompts, provider responses, or model outputs from real runs
- `scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs`
  - default Phase 19-C mode is synthetic only
  - no model server URL
  - no provider/model key
  - no image upload
  - no network call
  - prints sanitized aggregate metrics with `productionReady: false`

Run the synthetic harness:

```sh
npm run qa:open-weight-vlm:synthetic
```

If this runtime does not have `npm`, run the script directly:

```sh
node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic
```

Run all backend tests:

```sh
npm test
```

Boundary notes:

- This is not real model serving.
- Do not add model server URLs, provider/model credentials, image upload, network calls, or generated benchmark reports without a future explicit phase.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- iOS has no provider/model key and no direct provider/model call.
- Camera remains local-only.
- No training or fine-tuning is started.
- `productionReady` remains `false`.

Phase 18-B5 adds a small gate summary helper for sanitized reports:

```sh
npm run qa:photo-advisor:review
```

The helper reads `backend/reports/provider-qa/photo-advisor-qa-report.json` and prints only:

- `productionReady: false`
- `eligibleForDebugInternalReview`
- `statusCategories`
- `hardBlockers`
- `warnings`
- reviewed aggregate metric counts

It does not print raw provider text, raw prompts, raw image/base64, request payloads, secrets, or real sample paths. It is a review helper only; passing it is not production approval.

Phase 18-B6 adds the operator runbook for this workflow:

- read `../docs/photo-advisor-provider-qa-operator-runbook.md` before optional real-provider QA
- run synthetic QA first with `npm run qa:photo-advisor`
- run the dry-run gate with `npm run qa:photo-advisor:gate`
- run the gate summary helper with `npm run qa:photo-advisor:review`
- run real-provider QA only when explicitly approved for the current run, with ignored local credentials and approved ignored samples
- stop immediately on any hard blocker, raw artifact leakage, staged real photo/report, iOS provider key/direct call, Camera cloud entry, unapproved payload change, or `productionReady=true`
- keep generated provider reports, real samples, local reports, screenshots, recordings, and debug exports ignored/untracked

Phase 18-B6 is docs-only. It does not change backend provider request payloads, iOS upload payloads, capture-context upload behavior, provider credential handling, app behavior, Camera UI, cloud availability, or production rollout status.

Phase 18-B7 records the final B0-B6 provider QA chain audit:

- read `../docs/photo-advisor-provider-qa-chain-readiness.md` before Phase 18-C planning
- B0-B6 are considered coherent when backend tests, synthetic QA, dry-run gate, and QA gate helper pass
- Phase 18-C may start only as post-capture Advisor beta hardening / internal QA work
- real-provider QA is not required to start Phase 18-C
- backend provider request payloads and iOS upload payloads must remain unchanged unless a future phase explicitly approves a change
- `productionReady` remains `false`

Phase 18-B7 is docs-only and does not enable production cloud AI.

Phase 18-C0 adds the post-capture Advisor beta hardening plan:

- read `../docs/photo-advisor-beta-hardening-plan.md` before Phase 18-C implementation work
- hardening scope covers captured/imported Advisor flow, fallback UX, local/mock consistency, result-card readability, filter reasons, CreativeIntentGuard, retake restraint, multilingual QA, real-device QA, and regression scripts
- real-provider QA is not required for Phase 18-C start and must not run unless explicitly approved
- backend provider request payloads and iOS upload payloads remain unchanged
- capture context is still not uploaded
- `productionReady` remains `false`

Phase 18-C0 is planning-only and does not change backend runtime behavior or provider payloads.

Phase 18-C1 is iOS local/mock result-card polish only:

- backend provider request payloads remain unchanged
- iOS upload payloads remain unchanged
- capture context is still not uploaded
- real-provider QA is not required and must not run unless explicitly approved
- `productionReady` remains `false`

Phase 18-C2 is an iOS local/mock captured / imported / fallback Advisor QA pass only:

- backend provider request payloads remain unchanged
- iOS upload payloads remain unchanged
- capture context is still not uploaded
- provider credentials and backend provider mode are unchanged
- real-provider QA is not required and must not run unless explicitly approved
- `productionReady` remains `false`

Phase 18-C3 is an iOS localization / copy QA pass only:

- backend provider request payloads remain unchanged
- iOS upload payloads remain unchanged
- capture context is still not uploaded
- provider credentials and backend provider mode are unchanged
- no real-provider QA is required or run
- `productionReady` remains `false`

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
- Phase 18-A4 is an iOS app-side Photo Advisor result card language model polish. Backend request payloads remain unchanged; capture context, result-card display priority, creative-intent classifications, and filter reason metadata are not uploaded, and provider prompts / endpoints are not changed in this phase.
- Phase 18-A5 is an iOS app-side multilingual Photo Advisor copy QA / regression kit. Backend request payloads remain unchanged; copy QA scenarios, result-card expectations, and language review notes are not uploaded, and provider prompts / endpoints are not changed in this phase.
- Phase 18-B0 is a backend/provider language contract and schema alignment audit. Backend request payloads remain unchanged; iOS upload payloads remain unchanged; capture context is still not uploaded; provider output is aligned to the A1-A5 app language system before any production rollout.
- Do not add Gemini Live, WebSocket, Camera cloud AI, Filter Generator real backend, or 改圖師 image editing in this backend phase.
- Do not commit secrets, `.env`, provider keys, Firebase config, or production storage config.
