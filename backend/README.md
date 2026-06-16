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

Run the synthetic gate summary:

```sh
npm run qa:open-weight-vlm:gate
```

If this runtime does not have `npm`, run the script directly:

```sh
node scripts/run-open-weight-vlm-photo-advisor-benchmark.mjs --synthetic
node scripts/check-open-weight-vlm-photo-advisor-benchmark-gate.mjs --synthetic
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

Phase 19-D adds the gate helper for the synthetic benchmark report. The helper prints:

- `productionReady:false`
- `eligibleForSyntheticContractReview`
- `statusCategories`
- `hardBlockers`
- `blockedFixtureCounts`
- reviewed metrics for total / accepted / rejected / expectation pass-fail / rejection categories
- `providerConfigured:false`
- `modelServerConfigured:false`
- `networkCallsMade:false`

Gate hard blockers include expectation failures, accepted sensitive inference, accepted score/rating, accepted chain-of-thought, accepted debug/provider leakage, accepted imported context overclaim, accepted unsupported filter family, network calls, or `productionReady:true`.

The gate helper does not print raw prompts, raw model output, raw images, base64, request payloads, credentials, secrets, private file paths, real photo references, GPS, raw EXIF, or stack traces.

Phase 19-E expands the synthetic benchmark fixture set and formalizes the failure taxonomy used by the benchmark report and gate helper.

Expanded synthetic coverage:

- 40 committed JSON/text-only cases
- 24 accepted cases
- 16 rejected contract/failure cases
- no photos, image paths, base64, user data, prompts, real model responses, provider reports, or private content

Accepted scenario coverage includes daylight, low light, warm indoor light, neon/night street, intentional blur, accidental motion blur, soft focus, tilt, grain, high contrast, faded color, backlight/silhouette, clutter, minimal composition, food/object, street, landscape, pet, architecture, imported limited context, severe blur, black image, and overexposed image.

Failure taxonomy coverage includes:

- `invalid_json`
- `schema_failed`
- `unsupported_enum`
- `unsupported_filter_family`
- `sensitive_inference`
- `score_or_rating`
- `chain_of_thought`
- `debug_or_provider_leakage`
- `source_context_overclaim`
- `retake_false_positive`
- `overlong_output`
- `prompt_injection`
- `raw_localization_key`
- `unsafe_free_text`
- `timeout_stub`

The synthetic report and gate remain sanitized aggregate output only. They keep `productionReady:false`, `providerConfigured:false`, `modelServerConfigured:false`, and `networkCallsMade:false`, and they do not add real model serving, model server URL config, provider/model credentials, image upload, network calls, backend provider request payload changes, iOS upload payload changes, capture-context upload, or production rollout.

Phase 19-F adds a real-model sandbox preflight plan in `../docs/open-weight-vlm-real-model-sandbox-preflight.md`.

This is documentation-only and does not add runtime model calls. It defines the safety boundary for a possible future Phase 20-A backend-only local/self-hosted VLM sandbox.

Future Phase 20-A may only proceed if explicitly requested and must keep these gates:

- backend-only local/self-hosted sandbox
- explicit operator opt-in before any model call
- ignored local config for any model server URL
- ignored approved local image folder
- synthetic benchmark and gate pass before real-model testing
- no iOS integration
- no public endpoint
- no production endpoint
- no backend provider request payload change
- no iOS upload payload change
- no Camera cloud AI entry
- no `productionReady:true`
- no training or fine-tuning
- no user-photo training

Runtime safety requirements for a future real-model sandbox:

- no raw prompt logging
- no raw model response logging
- no raw image/base64 logging
- no image path logging unless sanitized
- no request payload logging
- no GPS/raw EXIF persistence
- sanitized aggregate metrics only
- generated reports and local fixtures remain ignored

Phase 19-F itself does not add model server code, model server URL config, provider/model credentials, image upload, network calls, local samples, generated reports, backend provider request payload changes, iOS upload payload changes, capture-context upload, or production rollout.

## Phase 20-A Local Self-hosted VLM Sandbox Setup

Phase 20-A adds a backend-only local/self-hosted VLM sandbox setup. It remains disabled by default and does not add an app-facing endpoint.

Added files / commands:

- `config/open-weight-vlm.local.example.json`
  - committed example only
  - `enabled:false`
  - `allowNetworkCalls:false`
  - uses local-loopback example URL only
- `src/qa/openWeightVlmLocalSandboxConfig.mjs`
  - validates local config shape
  - rejects unsupported serving stacks, unsupported model IDs, invalid fixture modes, unsafe timeouts, public/non-local URLs, URL credentials, query strings, and fragments
  - summarizes config using safe buckets only
- `scripts/check-open-weight-vlm-local-sandbox-config.mjs`
  - default dry-run validates the example config
  - prints sanitized config / gate status only
  - never prints the full model server URL, raw image paths, prompts, model output, request payloads, credentials, or secrets

Run the local config dry-run:

```sh
npm run qa:open-weight-vlm:local-config
```

If `npm` is unavailable:

```sh
node scripts/check-open-weight-vlm-local-sandbox-config.mjs --dry-run
```

Future local-model command name:

```sh
npm run qa:open-weight-vlm:local
```

Phase 20-A/20-B kept this command explicit and fail-closed. Phase 20-D1 prepares the `transformers_fastapi` local adapter path, but the command still fails closed unless ignored local config, approved local fixture policy, local/private URL validation, and structured response validation all pass.

Ignored local paths:

- `config/open-weight-vlm.local.json`
- `config/open-weight-vlm.local.*.json`
- `reports/vlm-local-sandbox/`
- `reports/vlm-benchmark/`
- `tests/vlm-local-samples/`
- `tests/generated-images/`

Boundary notes:

- Default scripts/tests remain synthetic/no-network.
- Actual local config must stay ignored.
- Approved local image fixtures must stay ignored.
- No model server URL runtime config is committed.
- No provider/model credentials are committed.
- No backend provider request payload changes are made.
- No iOS upload payload changes are made.
- No capture context is uploaded.
- No iOS provider/model key or direct provider/model call is added.
- No Camera cloud AI entry is added.
- No production endpoint or public endpoint is added.
- No training or fine-tuning is added.
- `productionReady` remains `false`.

## Phase 20-B Local VLM Sandbox Client Smoke Path

Phase 20-B adds a backend-only local VLM sandbox client smoke path. It remains disabled by default and does not add an app-facing endpoint, production endpoint, model server implementation, or real model call.

Added components:

- `src/qa/openWeightVlmLocalSandboxClient.mjs`
  - loads the safe local sandbox config summary
  - runs one stubbed candidate through the existing open-weight VLM schema validator and benchmark gate
  - emits sanitized aggregate smoke metrics only
  - keeps `productionReady:false`, `providerConfigured:false`, and `networkCallsMade:false`
- `scripts/run-open-weight-vlm-local-sandbox-smoke.mjs`
  - default mode is stub/no-network
  - never uploads an image
  - never calls a model server
  - never prints raw prompt, raw model output, raw image/base64/path, full model URL, request payload, credentials, or secrets

Run the safe local smoke path:

```sh
npm run qa:open-weight-vlm:local-smoke
```

If `npm` is unavailable:

```sh
node scripts/run-open-weight-vlm-local-sandbox-smoke.mjs --dry-run
```

Expected safe output includes:

- `runMode:"stub_no_network"`
- `eligibleForLocalSandboxSmoke:true`
- `stubbedBenchmark.totalCases:1`
- `stubbedBenchmark.acceptedCount:1`
- `benchmarkGate.eligibleForSyntheticContractReview:true`
- `productionReady:false`
- `networkCallsMade:false`

The explicit future local-model command remains:

```sh
npm run qa:open-weight-vlm:local
```

In default repository state this command still fails closed unless an ignored local config exists, network opt-in is true, the serving stack is `transformers_fastapi`, and a local/private FastAPI server returns valid candidate JSON. The default repository path sends no network request and reports sanitized hard blockers such as missing ignored config / disabled sandbox / unsupported serving stack.

Boundary notes:

- Default scripts/tests remain synthetic or stubbed no-network.
- Actual local config must stay ignored.
- Approved local image fixtures must stay ignored.
- No full model server URL, raw image path, prompt, model response, base64, request payload, credential, or secret is printed.
- No model server code, public endpoint, production endpoint, iOS integration, backend provider request payload change, iOS upload payload change, capture-context upload, Camera cloud AI entry, training, fine-tuning, real photo commit, generated report commit, or production rollout is added.
- `productionReady` remains `false`.

## Phase 20-D2A Transformers FastAPI Smoke Server Setup Guide

Phase 20-D2A adds `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md` as a local operator setup guide for a future first approved Qwen2.5-VL smoke.

It documents:

- first model target: `Qwen2.5-VL-7B-Instruct`
- fallback options: `Qwen2.5-VL-3B-Instruct` or 7B quantized local experiments if hardware is insufficient
- local server path: Transformers + FastAPI, bound to `127.0.0.1` only
- expected endpoint: `POST /local/vlm/photo-advisor`
- request style: `fixtureId` token only
- response style: candidate JSON compatible with `openWeightVlmPhotoAdvisorSchema`
- approved ignored fixture folder: `backend/tests/vlm-local-samples/`
- ignored fixture registry: `backend/config/open-weight-vlm.fixtures.local.json`
- first smoke fixture token: `smoke_001`
- no raw prompt/model output/image path/base64/request payload logging

The phase is docs/operator-prep only. It does not add server runtime code, start FastAPI, run Qwen2.5-VL, create local config, create fixture images, make a network/model call, change backend provider request payloads, change iOS upload payloads, add iOS integration, or enable production rollout.

## Phase 20-D2E Private LAN Transformers FastAPI Smoke Server Support

Phase 20-D2E keeps the same backend-only local sandbox path but allows the model server to run on a Windows GPU machine on the same private LAN while the MacBook runs Codex, Xcode, backend validators, and iOS testing.

Validation behavior:

- loopback URLs remain accepted: `http://127.0.0.1:8025/local/vlm/photo-advisor` and `http://localhost:8025/local/vlm/photo-advisor`
- private LAN IPv4 URLs require ignored local config with `allowPrivateLanModelServer:true`
- accepted private LAN ranges are `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`
- public IPs/domains, tunnel/ngrok/cloud-looking URLs, HTTPS URLs, credentialed URLs, query-string secrets, and `0.0.0.0` are rejected
- report output uses sanitized buckets such as `private_lan_ipv4`; it must not print the raw model URL or LAN IP

This phase does not start a server, run Qwen, run `--run-local-model`, commit local config/fixture/report/model URLs, add app-facing endpoints, add production endpoints, add iOS integration, change backend provider request payloads, change iOS upload payloads, add capture-context upload, train/fine-tune, or enable production rollout.

## Phase 20-D2G Local VLM Schema Mismatch Diagnostics

Phase 20-D2G adds sanitized diagnostics for a private LAN local VLM smoke that reached the Windows Transformers FastAPI Qwen2.5-VL server but was safely rejected by the backend validator as `invalid_schema`.

The validator remains the source of truth. D2G does not loosen required fields, enum whitelists, closed-schema behavior, safety scanning, source-context checks, retake gating, or filter-family validation.

Local smoke reports may now include a `schemaDiagnostic` object with only:

- `category`
- `errorBuckets`
- `fieldBuckets`
- `rawOutputPersisted:false`
- `rawOutputPrinted:false`

Expected buckets include `missing_required_field`, `additional_property`, `wrong_type`, `unsupported_enum`, `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, and `safety`. The report must not include raw model output, raw enum values, raw prompt, request payload, image/base64/path, full server URL, fixture path, credentials, or secrets.

Windows server mapper alignment notes:

- Return `visualObservationKey`, not `observationKey`.
- Return string `allowedContext`, not an object.
- Return object `creativeIntent`, object `technicalRisk`, and object `safety`.
- Return `retakeReasonKey:null` when retake is not allowed.
- Do not return `safetyFlags`.
- Do deterministic enum mapping before returning candidate JSON, after safety screening.
- Do not use LLM repair or ask the backend validator to accept unsupported values.

## Phase 20-E-A Accepted Local VLM Smoke Record And Expansion Gate

Phase 20-E-A records the first accepted Qwen-backed private LAN local VLM smoke from Phase 20-D2J.

Sanitized D2J result:

- Windows Qwen2.5-VL Transformers/FastAPI health check reported model loaded, `qwen2.5-vl`, `smoke_001` available, raw logging disabled, and no public exposure.
- Contract echo passed before the Qwen-backed smoke.
- The MacBook backend sandbox client accepted one Qwen-backed candidate:
  - `acceptedCount:1`
  - `rejectedCount:0`
  - `validationCode:null`
  - `fallbackCategory:null`
  - `schemaDiagnostic:null`
  - `latencyBucket:gt_15s`
  - `networkCallsMade:true`
  - `productionReady:false`
  - `hardBlockers:[]`
- Raw prompt, raw model output, image/base64/path, request payload, local config, fixture registry, fixture image, generated report, full model URL, credentials, and secrets were not printed, persisted, or committed.

Phase 20-E-A also adds `docs/open-weight-vlm-local-smoke-expansion-gate.md` for the future Phase 20-E-B small fixture expansion. Phase 20-E-B should remain backend-only, local/private LAN only, 3-5 approved ignored fixtures, fixture IDs only, one run per fixture, sanitized aggregate metrics only, and `productionReady:false`. It must not add iOS integration, app-facing endpoints, production endpoints, backend provider request payload changes, iOS upload payload changes, capture-context upload, Camera cloud AI, training/fine-tuning, or production rollout.

Passing one D2J smoke is not production readiness. It only makes Phase 20-E-B planning-ready after explicit request.

## Phase 20-E-C Local VLM Smoke Repeatability Gate

Phase 20-E-C adds a backend-only repeatability/regression gate for sanitized local VLM smoke expansion aggregates.

Run:

```sh
npm run qa:open-weight-vlm:local-repeatability-gate
```

The gate reviews only fixture count, accepted/rejected counts, acceptance rate, validation/fallback/schema buckets, latency buckets, `networkCallsMade`, `productionReady`, and raw persistence booleans. It does not read or print raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, fixture images, credentials, or server logs.

The Phase 20-E-B2 baseline passes as `pass_for_local_repeatability_review` with `pass_with_latency_note` because one accepted fixture was `gt_15s`. This is sandbox review only. It does not approve iOS integration, app-facing endpoints, production endpoints, Camera cloud AI, payload changes, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 20-E-D Local VLM Smoke Failure And Latency Taxonomy

Phase 20-E-D adds a backend-only taxonomy gate for interpreting sanitized local VLM smoke outcomes without treating one pass or failure as production readiness.

Run:

```sh
npm run qa:open-weight-vlm:local-failure-taxonomy
```

The command uses a synthetic sanitized sample by default and makes no model call. The taxonomy reviews only fixture counts, accepted/rejected counts, acceptance rate, validation/fallback/schema buckets, latency buckets, `networkCallsMade`, `productionReady`, raw persistence booleans, optional model/server availability buckets, and optional fixture readiness buckets.

Pass/review categories include `pass_clean_local_smoke`, `pass_with_latency_note`, `pass_with_minor_review_note`, and `not_production_ready`. Block categories include schema regression, provider integration, raw persistence, fixture readiness, unapproved fixture count, model/server unavailable, network mismatch, repeatability drift, latency regression, production flag, and unknown smoke state. Latency categories are `latency_ok`, `latency_note`, `latency_regression`, and `latency_blocker`.

E-D does not run a larger fixture expansion, real Qwen smoke, iOS integration, app-facing endpoint, production endpoint, Camera cloud entry, payload change, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 20-E-E Local VLM Sandbox Review Summary

Phase 20-E-E adds `../docs/open-weight-vlm-local-sandbox-review-summary.md` as the consolidated backend-only review of the local/self-hosted VLM sandbox.

The summary records what D2J through E-D proved: the backend can call the local/private Windows Qwen2.5-VL FastAPI server through the sandbox path, the deterministic mapper can produce validator-accepted candidate JSON, three approved ignored fixtures can pass once and in repeat smoke, sanitized failure/latency taxonomy exists, raw persistence flags remained false, and the Windows-primary workflow is viable.

It also records what remains unproven: production readiness, iOS integration, real user-photo upload, consent UI, app-facing/production endpoints, quota/billing/entitlement, deletion/retention implementation, App Store privacy disclosure update, large fixture coverage, model comparison, vLLM/SGLang benchmarking, throughput/concurrency testing, multilingual real-image evaluation beyond existing copy gates, fine-tuning, and on-device model work.

Phase 20-F may start only after the repo is clean, upstream comparison is `0 0`, E-E is committed and pushed, ignored local artifacts remain ignored, Windows server remains local/private, raw logging stays disabled, all existing gates pass, and the Phase 20-F scope is chosen explicitly. Recommended Phase 20-F direction is Option A: expanded fixture set planning plus fixture registry schema.

## Phase 20-F Expanded Fixture Registry Dry-run Gate

Phase 20-F adds a backend-only fixture registry policy and dry-run gate for planning a future controlled 6-8 fixture local smoke.

Run:

```sh
npm run qa:open-weight-vlm:expanded-fixtures
```

The command validates sanitized sample registry entries only. It does not read local config, require fixture images, call a model, make network calls, print raw paths, print prompts, print model output, print request payloads, or mark production ready.

The gate reviews fixture metadata buckets, approval booleans, metadata stripping, privacy review, face/sensitive/private identifier exclusions, category coverage, missing core categories, and blocked reason counts. Output keeps `networkCallsMade:false` and `productionReady:false`.

## Phase 20-C Local VLM Operator Runbook + Smoke Gate

Phase 20-C adds an operator runbook and a backend-only real-model smoke gate for future approved local/self-hosted VLM testing. The gate does not call a model and does not create an app-facing endpoint.

Run the local smoke gate:

```sh
npm run qa:open-weight-vlm:local-smoke-gate
```

If `npm` is unavailable:

```sh
node scripts/check-open-weight-vlm-local-smoke-gate.mjs --dry-run
```

Expected current behavior:

- The command runs synthetic benchmark and default local smoke prerequisites without network.
- The command reads the ignored local config path `config/open-weight-vlm.local.json`.
- If the ignored local config is absent, disabled, missing network opt-in, missing a validated loopback/private URL bucket, or not in approved fixture mode, the gate fails closed with sanitized blockers.
- The command prints only sanitized buckets and booleans; it does not print raw URLs, image paths, prompts, model output, base64, request payloads, credentials, or secrets.
- `productionReady:false` and `networkCallsMade:false` remain present in output.

The operator runbook is:

```text
../docs/open-weight-vlm-local-operator-runbook.md
```

Phase 20-D may only run a real local model if explicitly requested, with ignored local config, approved ignored fixtures, synthetic gate success, default local smoke success, no raw artifact logging, and sanitized aggregate output only.

## Phase 20-D Local Real-model Smoke Preflight

Phase 20-D ran the backend-only real-model smoke preflight and stopped before any model call because the ignored real local config was not present.

Observed safe result:

- `backend/config/open-weight-vlm.local.json` is covered by `.gitignore`.
- The ignored real local config was absent on disk, untracked, and unstaged.
- Backend tests passed.
- Synthetic benchmark and benchmark gate passed.
- Local config dry-run passed against the committed example config.
- Local sandbox smoke passed in default no-network mode.
- Local smoke gate failed closed with sanitized blockers: `config_missing`, `sandbox_disabled`, `network_opt_in_missing`, `model_server_missing`, and `non_approved_fixture_mode`.
- `productionReady:false` and `networkCallsMade:false` remained true for the gate output.

Because the local smoke gate did not pass, `--run-local-model` was not run. No model server was contacted, no raw prompt/model output/image/path/request payload was logged or persisted, and no generated report was created.

## Phase 20-D1 Transformers FastAPI Local Adapter Prep

Phase 20-D1 selects Transformers + FastAPI as the first backend-only real-model smoke path. The adapter is for local correctness/reference testing only and remains disabled by default.

Added / updated components:

- `../docs/open-weight-vlm-transformers-fastapi-local-adapter.md`
  - documents the local FastAPI server contract, candidate JSON response contract, safe request shape, and redaction rules
- `config/open-weight-vlm.local.example.json`
  - remains disabled with `enabled:false` and `allowNetworkCalls:false`
  - uses `servingStack:"transformers_fastapi"` as the selected first smoke path
  - includes a non-sensitive `fixtureId` token only
- `src/qa/openWeightVlmLocalSandboxConfig.mjs`
  - accepts `transformers_fastapi`
  - validates `fixtureId`
  - exposes only `fixtureIdBucket`, never the fixture token/path
- `src/qa/openWeightVlmLocalSandboxClient.mjs`
  - keeps default `stub_no_network` behavior
  - only uses the local FastAPI adapter behind explicit `--run-local-model`
  - sends a minimal local request with fixture token, model id, and output contract
  - validates returned candidate JSON through the existing open-weight VLM schema
  - emits sanitized aggregate smoke results only
- `src/qa/openWeightVlmLocalSmokeGate.mjs`
  - treats non-`transformers_fastapi` serving stacks as blocked for this first adapter path

Expected default commands:

```sh
npm run qa:open-weight-vlm:local-config
npm run qa:open-weight-vlm:local-smoke
npm run qa:open-weight-vlm:local-smoke-gate
```

Default behavior remains no-network unless the operator explicitly prepares ignored local config and runs:

```sh
npm run qa:open-weight-vlm:local
```

That explicit command still blocks if the ignored config is absent, disabled, missing `allowNetworkCalls:true`, not using `transformers_fastapi`, using a public/non-local URL, missing approved-local fixture mode, or receiving invalid/unsafe model output.

Phase 20-D1 does not start a FastAPI server, download model weights, run a real model, commit model URLs, commit credentials, commit local fixtures, commit generated reports, add app-facing endpoints, add production endpoints, add iOS integration, change backend provider request payloads, change iOS upload payloads, upload capture context, add Camera cloud AI, train/fine-tune, or enable production rollout. `productionReady:false` remains required.

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
