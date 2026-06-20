# Cloud AI Boundary Backend Skeleton

Phase 17A adds a backend boundary for future Cloud AI work.

By default this backend runs in mock mode. Phase 17C-R1 adds a Photo Advisor internal beta path through the QweAPI OpenAI-compatible gateway, but it is disabled unless explicitly enabled with local/internal backend config and server-side secrets. It must not store uploaded images or request payloads.

Today's AI direction update is docs-only: live camera guidance should prioritize on-device Apple Vision / AVFoundation geometry, hardware depth when available, and app-side rules before cloud VLM. Backend/self-hosted/API VLM work remains useful for post-capture Photo Advisor, offline benchmark, internal evaluation, schema validation, and future labeling/distillation, but this update adds no backend runtime, provider call, model call, dataset crawler, provider labeling run, upload payload change, endpoint, raw artifact, credential, secret, or production rollout. `productionReady:false` remains locked.

The on-device live framing research index is `../docs/research/on-device-ai-research-index.md`. It proposes future backend/offline dataset and labeling skeletons as research only; no schemas, scripts, local configs, datasets, reports, provider adapters, provider calls, or training jobs are added by the research set.

Phase 21-A implements the first iOS on-device Vision geometry spike only. Backend runtime remains unchanged: no endpoint, provider call, model call, dataset crawler, AI labeling adapter, upload payload change, raw artifact, credential, secret, or production rollout is added.

Phase 21-B is also iOS-local only. It adds AVFoundation depth capability detection for the active camera/photo-output path and records only safe in-memory capability buckets. Backend runtime remains unchanged: no endpoint, provider call, model call, dataset crawler, AI labeling adapter, upload payload change, raw depth artifact, credential, secret, or production rollout is added.

Phase 21-C-PRE adds backend no-runtime preflight tooling for the future Depth Anything V2 Small Core ML sandbox. It adds a sanitized CLI and tests only; no backend endpoint, provider call, model call, model file, Core ML package, iOS runtime execution, benchmark, preview-frame upload, upload payload change, raw depth/frame artifact, credential, secret, or production rollout is added.

Phase 21-C is iOS-local sandbox scaffolding only. Backend runtime remains unchanged: no endpoint, provider call, model call, model file, Core ML package, benchmark, preview-frame upload, upload payload change, raw depth/frame artifact, credential, secret, or production rollout is added.

Phase 21-C-R1 adds backend no-runtime approval-gate tooling for Depth Anything V2 Small model artifact source/license review and a future Xcode physical-device benchmark harness. It adds a sanitized CLI and tests only; no backend endpoint, provider call, model call, model artifact, Core ML package, model download, Xcode harness runtime, inference, benchmark, upload payload change, raw artifact, credential, secret, or production rollout is added.

Phase 17C-Prep hardens the boundary before real provider work. Phase 17C-R1 adds backend-only QweAPI gateway support for the Photo Advisor internal beta at `/v1/ai/photo-advisor`; production rollout is still out of scope.

Phase 21-W-FINAL-R2 completes the backend-local controlled 12-fixture Transformers+FastAPI reference benchmark after runtime reconnect and routeability repair. The single approved run used `smoke_004` through `smoke_015`, made exactly `12` local/private model calls, used retry count `0`, and accepted all `12` fixtures with latency buckets `gt_15s x1` and `5s_to_15s x11`. Raw outputs, prompts, payloads, image paths, local config, fixture registry contents, server URL/logs, and secrets were not printed or committed; Qwen3-VL-30B-A3B was not used; `productionReady:false` remains locked.

Phase 21-X is a documentation-only review gate for that accepted result. It marks the current Transformers+FastAPI path as a backend correctness baseline and records `decisionBucket:correctness_baseline_pass_latency_not_product_ready`; serving latency is not ready for live camera or production real-time flows, so it led to Phase 21-Y target runtime planning. Phase 21-X runs no model call, benchmark, inference endpoint call, serving switch, iOS integration, raw artifact, or production rollout.

Phase 21-Y is a backend/docs-only target runtime plan. It selects RunPod on-demand A100 80GB as the first target benchmark environment and `Qwen3-VL-30B-A3B` as the target model candidate, with the existing Qwen2.5 / Qwen VLM Transformers+FastAPI path retained as a correctness baseline only. The first product serving pattern is post-capture batch/queue Photo Advisor with scheduled 2-3 hour GPU windows and a rough `$80-$170/month` cost assumption to verify before purchase. Phase 21-Y runs no model call, benchmark, inference endpoint call, RunPod provisioning, Qwen3-VL install/download/load/call, vLLM/SGLang/Ollama install/run, serving switch, iOS integration, raw artifact, or production rollout.

Phase 21-Y-R1 adds the Asia-first region/provider selection gate for Korea, Taiwan, and Hong Kong. RunPod A100 80GB remains primary only if Asia-near availability and cost are acceptable; Japan/Tokyo-like or Korea/Seoul-like regions are preferred, Singapore-like Asia is second, and US West is only a cost/functionality fallback rather than the first Asia latency baseline. Phase 21-Z must verify Asia-near A100 availability, current price, estimated daily 2-3 hour cost, storage/cache cost, fallback decision, no public inference endpoint, budget hard stop, manual kill switch, and no committed credentials before any provisioning. No RunPod provisioning, model call, benchmark, Qwen3 install/download/load/call, iOS integration, raw artifact, credential, secret, or production rollout occurs in Phase 21-Y-R1.

Phase 21-Z adds Asia-first RunPod deployment prep without model calls. It documents the A100 80GB Asia-near selection checklist, fallback provider/GPU order, security/network/storage/budget guardrails, no-model healthz/contract/dry-run target shape, batch/queue startup-shutdown checklist, localization QA, and `backend/config/open-weight-vlm.runpod.example.json` as a placeholder-only bucket config. It does not create RunPod resources, provision GPU, create provider account resources, install/download/load/call `Qwen3-VL-30B-A3B`, run model calls, run benchmarks, call inference endpoints, install/run vLLM/SGLang/Ollama, switch serving stack, modify the external Windows server runtime, add iOS integration, add endpoints, commit raw URLs/real region IDs/credentials/secrets, or change `productionReady:false`.

Phase 21-Z-R1 adds a backend/docs-only API-first serverless VLM alternative evaluation gate. SiliconFlow and DashScope / Alibaba Cloud Model Studio / 阿里雲百煉 are candidate providers only; RunPod A100 80GB remains fallback/comparison. The future adapter direction is backend-mediated and provider-agnostic across `siliconflow`, `dashscope`, and `runpod_self_hosted_fallback`, with raw provider text blocked from app display and the existing backend validator remaining the source of truth. Phase 21-Z-R1 adds no provider SDK/runtime, provider API call, API key, RunPod resource, Qwen3 install/download/load/call, model call, benchmark, inference endpoint call, iOS runtime change, upload payload change, raw artifact, credential, secret, or production rollout.

Phase 21-Z2A-SF consolidates the provided SiliconFlow Qwen3-VL research drafts into a backend/docs-only model-selection gate. SiliconFlow is the primary API-first provider direction, `Qwen/Qwen3-VL-30B-A3B-Instruct` is the primary model direction, and RunPod A100 80GB remains fallback/comparison. The recommended next backend phase is `Phase 21-Z2B-SF: SiliconFlow No-runtime Backend Adapter Contract Gate`, limited to provider enum/config shapes, request-builder shape without execution, synthetic parser tests, sanitized error buckets, schema/fallback tests, absent-key readiness checks, and raw-logging/iOS-leakage scans. Phase 21-Z2A-SF adds no provider SDK/runtime, provider API call, API key, provider account, image upload, model call, benchmark, inference endpoint call, iOS runtime change, upload payload change, raw artifact, credential, secret, or production rollout.

Phase 21-Z2B-SF adds the SiliconFlow backend-only no-runtime contract. The backend implementation path is JavaScript / Node.js; the operator-provided SiliconFlow OpenAI-compatible base URL and `/chat/completions` path are recorded for future approved runtime work only. New scripts `npm run qa:siliconflow:contract` and `npm run qa:siliconflow:readiness` run synthetic tests and fail-closed readiness checks without network calls. No SiliconFlow API call, API key, provider account, provider SDK/runtime execution, image upload, model call, benchmark, iOS runtime change, upload payload change, raw artifact, credential, secret, or production rollout was added.

Phase 21-Z2C-SF adds a docs-only approval request draft for a future SiliconFlow 12-fixture API benchmark. The future run is scoped to SiliconFlow, `Qwen/Qwen3-VL-30B-A3B-Instruct`, fixtures `smoke_004` through `smoke_015`, exactly 12 calls, retry 0, backend-mediated JavaScript / Node.js only, image detail low, stream false, max output tokens 256, sanitized aggregate report only, no iOS integration, no live camera upload, no raw image/base64/prompt/provider response/request payload logging, and `productionReady:false`. This draft does not approve execution and makes no API call, reads no key, uploads no image, runs no benchmark, and adds no provider runtime.

Phase 21-Z2C-SF-RUN-PRE adds the missing no-network dry-run gate for that future benchmark. Use `npm run qa:siliconflow:benchmark-dry-run` for the sanitized plan summary and `npm run qa:siliconflow:benchmark-plan` for the dry-run tests. These scripts do not call SiliconFlow, read API keys, open fixture images, upload images, execute provider runtime, run a benchmark, or change `productionReady:false`.

Phase 21-Z2C-SF-RUN completed the approved SiliconFlow benchmark with exactly 12 calls and retry `0`. Sanitized aggregate result: accepted `0`, rejected `12`, `provider_schema_invalid x12`, `provider_validation_rejected x12`, `5s_to_15s x12`, token usage bucket `lte_20k`, and cost bucket `usage_available_cost_not_computed`. No raw provider response, prompt, request payload, image/base64/path, API key, provider credential, iOS runtime change, upload payload change, live cloud AI runtime, app-facing/production endpoint, raw artifact, secret, or production rollout was added.

Phase 21-Z2D-SF reviews the SiliconFlow benchmark without rerunning API calls. The result is classified as `provider_output_schema_alignment_failed`: the provider path returned latency/token evidence, but no response matched the strict backend Photo Advisor schema. This does not prove SiliconFlow is unusable or Qwen3-VL quality is bad. The next backend-safe phase is `Phase 21-Z2D-SF-R1: SiliconFlow Prompt and Schema Alignment Gate Without API Calls`; it should use synthetic strings only and must not read API keys, upload images, call providers/models, rerun benchmarks, add endpoints, or change `productionReady:false`.

Phase 21-Z2E-SF-AUTO completes the explicitly approved bounded SiliconFlow prompt/schema alignment and retry. It adds a schema-enum-driven backend prompt contract, sanitized parser diagnostic buckets, and `npm run qa:siliconflow:prompt-schema`. The approved bounded run made `13` SiliconFlow calls of cap `28`, retry `0`, accepted `13`, rejected `0`, with latency buckets `5s_to_15s x9` and `gt_15s x4`; no raw provider response, prompt, request payload, image/base64/path, API key, credential, raw report, iOS runtime change, upload payload change, app-facing endpoint, production endpoint, or production rollout was added. `productionReady:false` remains locked.

Phase 21-Z2F-SF-LATENCY runs approved single-image SiliconFlow latency probes with `smoke_004` only. The backend no-runtime contract now defaults to the compact SiliconFlow prompt profile and `maxOutputTokens:192` because `128` caused invalid output and `enable_thinking:false` was rejected for the VLM request shape. Best accepted probe was `5466ms`; post-patch validation was `10473ms`, so latency remains provider/serverless-bound and not product-ready. No provider runtime execution, iOS runtime change, upload payload change, app-facing endpoint, production endpoint, raw artifact, secret, or production rollout was added.

Phase 21-Z2G-SF runs approved backend-only SiliconFlow network/parameter latency probes with `smoke_004` only. Sequential same-process `fetch` with compact `max_tokens:192` remained seconds-level (`8637ms`, `8529ms`), `stream:true` gave TTFT `3979ms` but full validated JSON `9898ms`, and ultra-short `max_tokens:80` / `50` failed schema. The backend contract remains compact prompt + `maxOutputTokens:192`; no provider runtime execution, iOS runtime change, upload payload change, app-facing endpoint, production endpoint, raw artifact, secret, or production rollout was added.

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

## Phase 20-G Controlled Expanded Local Smoke Block

Phase 20-G ran the explicitly approved Windows-primary local/private eight-fixture smoke once per approved fixture token. It did not retry or run extra fixtures.

Sanitized aggregate:

- `fixtureCount:8`
- `acceptedCount:0`
- `rejectedCount:8`
- `acceptanceRate:0%`
- `validationCodeCounts:null x8`
- `fallbackCategoryCounts:blocked_for_provider_integration x8`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:lt_1s x8`
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags false

The repeatability gate and failure/latency taxonomy blocked the aggregate. Treat this as a local server / provider-integration fixture-handling block, not as production readiness and not as a schema validator weakening reason. Phase 20-H is not ready until the Windows local/private server expanded fixture path is diagnosed with sanitized evidence only.

## Phase 20-H Expanded Fixture Provider Diagnostic

Run:

```sh
npm run qa:open-weight-vlm:expanded-fixture-provider-diagnostic
```

The diagnostic is no-model by default. It classifies sanitized Phase 20-G aggregate signals, optional sanitized fixture registry buckets, and optional sanitized healthz buckets without printing raw paths, local config contents, registry contents, prompts, model output, base64, request payloads, credentials, or server logs.

Current sanitized categories include `likely_pre_inference_block`, `likely_server_fixture_unavailable`, `likely_healthz_fixture_availability_gap`, `unlikely_schema_validator_issue`, `unsafe_to_retry_real_smoke`, `eligible_for_contract_echo_fixture_routing_check`, and `not_production_ready`.

The current working hypothesis is that the backend expanded fixture registry and the external Windows FastAPI server fixture availability / routing are out of sync before inference. Another expanded real model smoke remains blocked until a local/private no-model fixture-routing or contract-echo check passes.

## Phase 20-I Fixture Routing Contract Echo

Run:

```sh
npm run qa:open-weight-vlm:fixture-routing-echo
```

This calls only the local/private Windows FastAPI fixture routing contract echo route. It does not call Qwen, build a prompt, read model output, use the real smoke endpoint, print raw image paths, print local config or registry contents, print request payloads, or mark production ready.

Sanitized Phase 20-I result:

- `totalFixtureTokens:8`
- `routeableCount:8`
- `unavailableCount:0`
- `modelInferenceRun:false`
- raw persistence flags false
- `networkCallsMade:true`
- `productionReady:false`

Phase 20-I makes a future explicitly approved controlled expanded smoke retry planning-ready only after all gates pass again. It does not approve iOS integration, app-facing endpoints, production endpoints, or production rollout.

## Phase 20-J Controlled Expanded Smoke Retry

Phase 20-J reran the approved Windows-primary local/private Qwen-backed smoke after the fixture routing contract echo passed. The run used exactly eight fixture tokens, one call per fixture, no retries, no extra fixtures, and sanitized reporting only.

Sanitized aggregate:

- `fixtureCount:8`
- `acceptedCount:8`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x8`
- `fallbackCategoryCounts:null x8`
- no schema diagnostic buckets
- `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags false

The repeatability gate and failure/latency taxonomy passed with a latency note. This is still sandbox evidence only and does not approve iOS integration, app-facing endpoints, production endpoints, larger fixture expansion, serving-stack benchmarking, or production rollout.

## Phase 20-K Expanded Smoke Result Review

Phase 20-K is review/planning only. It records the Phase 20-J accepted eight-fixture result, interprets `gt_15s x3` as a sandbox latency note, and documents dataset coverage gaps in:

```text
../docs/open-weight-vlm-expanded-smoke-result-review.md
```

The recommended next step is Phase 20-L: 12-fixture coverage expansion planning plus a no-model registry gate. Do not run more real model smoke, add fixture images, expand the real local registry, benchmark serving stacks, start iOS integration, add endpoints, or change `productionReady:false` without a future explicit phase.

## Phase 20-L 12-Fixture No-model Registry Gate

Phase 20-L keeps the work backend-only and Windows-primary. It updates the expanded fixture registry dry-run gate so the planned target is exactly 12 categories:

- current eight: `bright_daylight_clean`, `low_light_grain`, `motion_blur_intentional`, `high_contrast_shadow`, `faded_color_retro`, `imported_limited_context`, `severe_blur_reject`, `black_or_near_black_unreadable`
- planned additions: `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, `overexposed_unreadable`

`npm run qa:open-weight-vlm:expanded-fixtures` remains no-model and no-network. It reports `totalTargetFixtures:12`, `requiredCategories`, category coverage, missing required categories, blocked reason counts, `eligibleForControlledSmoke`, `networkCallsMade:false`, and `productionReady:false`.

An 8-category registry is expected to be ineligible and report the four planned missing categories. Phase 20-L does not run Qwen inference, add fixture images, commit local registries/config, start iOS integration, add endpoints, benchmark serving stacks, or approve production rollout.

## Phase 20-M Ignored Fixture Prep And 12-Token Routing Echo

Phase 20-M prepares the ignored local 12-fixture set only and updates the no-model routing echo token target to 12 approved fixtures. The ignored registry and ignored fixture images remain uncommitted, and no Qwen inference runs.

Sanitized results:

- expanded fixture registry dry-run: `totalFixtures:12`, `approvedCount:12`, `blockedCount:0`, `missingRequiredCategories:[]`, `eligibleForControlledSmoke:true`, `networkCallsMade:false`, `productionReady:false`
- fixture routing contract echo: `totalFixtureTokens:12`, `routeableCount:12`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, `productionReady:false`

Phase 20-M does not add iOS integration, app-facing endpoints, production endpoints, benchmark serving stacks, or production rollout.

## Phase 20-O Serving Benchmark Decision Gate

Phase 20-O adds `../docs/open-weight-vlm-serving-benchmark-decision-gate.md` as a backend-only review/planning gate after the accepted 12-fixture Phase 20-N smoke.

The decision gate records the sanitized Phase 20-N aggregate, interprets `gt_15s x10` as a significant sandbox latency note, and recommends Phase 20-P as serving-stack benchmark preflight only. Phase 20-O does not run Qwen inference, real smoke, vLLM/SGLang/Ollama benchmarks, model-stack switching, iOS integration, app-facing endpoints, production endpoints, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 20-P Serving Benchmark Preflight

Phase 20-P adds `../docs/open-weight-vlm-serving-benchmark-preflight.md` and a no-network benchmark-plan gate:

```sh
npm run qa:open-weight-vlm:serving-benchmark-preflight
```

The gate validates the future serving stack matrix, sanitized metric inventory, 12-fixture usage rules, artifact policy, stop conditions, and Phase 21 backend gateway entry criteria. It does not call Qwen, run real smoke, run vLLM/SGLang/Ollama/LM Studio, switch model stacks, require local config, read fixture images, modify ignored registries, add iOS integration, add endpoints, or change production readiness. Expected output includes `networkCallsMade:false`, `benchmarkRun:false`, `qwenInferenceRun:false`, `eligibleForPhase21EntryReview:true`, `eligibleForBenchmarkExecution:false`, and `productionReady:false`.

## Phase 21-A Backend Internal VLM Gateway Contract Preflight

Phase 21-A adds `../docs/backend-internal-vlm-gateway-contract-preflight.md` and a no-network/no-model gateway contract gate:

```sh
npm run qa:open-weight-vlm:gateway-contract-preflight
```

The gate validates backend-internal request and response contracts only. Requests allow sanitized buckets such as `requestIdBucket`, `sourceType`, optional `fixtureId`, `allowedContext`, `languageCode`, `advisorMode`, `outputContractVersion`, and `productionReady:false`. They reject raw image/base64/path/prompt, GPS/raw EXIF, raw sensor values, provider secrets, direct iOS provider fields, and app-facing/production endpoint flags.

Responses must be structured candidate JSON that maps into `openWeightVlmPhotoAdvisorSchema.mjs` fields and passes the existing validator/safety chain before any future app-facing use. The gateway must not return score/rating, sensitive inference, chain-of-thought, debug/provider leakage, raw provider response, raw model output, raw prompt, request payload, or free-form model text.

Phase 21-A does not call Qwen, run model smoke, run serving benchmarks, add iOS integration, add endpoints, accept real user-photo uploads, change backend/iOS payloads, upload capture context, or change production readiness. `productionReady:false` remains required.

## Phase 21-B Backend Internal VLM Gateway Adapter Stub

Phase 21-B adds a backend-internal adapter stub and no-model external contract echo alignment:

```sh
npm run qa:open-weight-vlm:gateway-adapter-stub
npm run qa:open-weight-vlm:gateway-external-contract-echo
```

The adapter stub accepts only the sanitized Phase 21-A internal request contract in fixture-token sandbox mode. It does not accept raw image bytes, base64, raw paths, GPS/raw EXIF, raw sensor values, raw prompts, provider secrets, direct iOS provider fields, app-facing endpoint flags, or `productionReady:true`. It returns structured candidate JSON only, validates through `src/qa/openWeightVlmPhotoAdvisorSchema.mjs`, and reports sanitized aggregate pass/fail state only.

The external contract echo command may call only a local/private no-model endpoint such as `/local/vlm/gateway-contract-echo`. It fails closed if healthz or echo reports public exposure, raw logging enabled, model inference, raw persistence, unstructured/free-form output, unsafe candidate fields, or `productionReady:true`.

Phase 21-B does not run real model smoke, Qwen inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo uploads, consent UI, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 21-C Backend Internal VLM Gateway Provider Routing Dry-run

Phase 21-C adds the provider routing policy dry-run:

```sh
npm run qa:open-weight-vlm:gateway-provider-routing
```

The dry-run reviews only backend-internal provider modes. `local_stub` and `local_contract_echo` are allowed. `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes are blocked. The command stays sanitized, no-network, no-model, and `productionReady:false`.

Phase 21-C does not run Qwen inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, or production rollout.

## Phase 21-D Gateway Provider Adapter No-model HTTP Check

Phase 21-D adds a backend-internal provider adapter no-model HTTP check:

```sh
npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http
```

The check accepts only the Phase 21-C `local_contract_echo` route, verifies provider routing before any HTTP call, validates local/private healthz, calls only `/local/vlm/gateway-contract-echo`, validates the returned structured candidate through `src/qa/openWeightVlmPhotoAdvisorSchema.mjs`, and prints sanitized aggregate status only. Expected live-safe output has `networkCallsMade:true` only for local/private no-model HTTP, `modelCallsMade:false`, `qwenInferenceRun:false`, `modelInferenceRun:false`, raw persistence flags false, and `productionReady:false`.

Phase 21-D does not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, consent UI, training/fine-tuning, or production rollout.

## Phase 21-E Cross-platform Deployment Boundary

Phase 21-E adds the cross-platform backend deployment boundary audit:

```sh
npm run qa:open-weight-vlm:cross-platform-boundary
```

The gate is no-network, no-model, and no-benchmark. It verifies that Windows local paths and local model URLs remain docs/operator/ignored-example/test-sandbox material only, not backend runtime, iOS runtime, committed production config, or app architecture. It also blocks Mac local paths in runtime, committed LAN/public/cloud/tunnel model URLs, provider/model secrets, direct iOS provider routes, Camera cloud AI entries, backend/iOS upload payload drift, capture-context upload, app-facing endpoint flags, production endpoint flags, raw artifact policy allowances, and `productionReady:true`.

Deployment roles:

- Windows local machine: backend/VLM development sandbox only.
- MacBook/Xcode: iOS client development and future runtime verification only.
- Main backend: future app-facing API owner and VLM mediator.
- VLM provider server: behind-backend provider only, not the app contract source.

Phase 21-E does not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, consent UI, training/fine-tuning, or production rollout.

## Phase 21-F Deployment Config / Env Preflight

Phase 21-F adds the backend deployment config/env preflight:

```sh
npm run qa:open-weight-vlm:deployment-config-env-preflight
```

The preflight validates policy/config objects only. It does not read real secrets, call a model, call Qwen, run a benchmark, or create runtime deployment behavior. Allowed output is sanitized bucket data for environment, gateway mode, provider mode, provider URL, provider auth mode, secret injection mode, timeout, max image bytes, raw logging disabled, metadata stripping required, consent required, retention/deletion policy required, endpoint flags, iOS direct provider flags, and `productionReady:false`.

The gate blocks committed secrets, provider/model key fields, hardcoded Windows or Mac runtime paths, hardcoded LAN model URLs in iOS, committed production model URLs, public/cloud/tunnel local provider URLs, raw logging, missing future real-upload policy requirements, app-facing endpoint flags, production endpoint flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmark execution, and `productionReady:true`.

Phase 21-F does not add production endpoints, app-facing endpoints, iOS integration, model calls, Qwen inference, serving benchmarks, real user-photo upload, auth/billing/quota runtime, committed secrets, raw artifacts, or production rollout.

## Phase 21-G Local Model Route Approval Gate

Phase 21-G adds a backend-internal approval gate for a future `local_model` provider route:

```sh
npm run qa:open-weight-vlm:local-model-route-approval
```

The gate validates policy objects only. It is no-network, no-model, no-Qwen, and no-benchmark. A passing approval-ready policy still keeps `localModelRouteEnabled:false`, `modelCallsAllowed:false`, `qwenInferenceAllowed:false`, `networkCallsMade:false`, `eligibleForAppIntegration:false`, and `productionReady:false`.

The gate requires clean/upstream-synced repo state, Phase 21-G committed/pushed status, deployment config/env preflight, cross-platform boundary, provider routing, provider adapter no-model HTTP, safe healthz, `publicExposure:no`, `rawLoggingDisabled:true`, local/private endpoint scope, ignored local config/registry/fixtures, future explicit user approval, scoped fixture tokens, structured candidate JSON, existing backend validator, and fallback/safety gates.

It fails closed for production readiness, public/cloud/tunnel exposure, raw logging, raw persistence, direct iOS provider/model calls, Camera cloud AI entry, backend/iOS payload drift, app-facing endpoints, production endpoints, user-photo upload, missing consent/retention/deletion policy, staged local config/registry/fixture images, unsupported routes, validator bypass, fallback bypass, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, Qwen inference, model calls, or benchmark execution.

Phase 21-G does not enable `local_model`, run real model smoke, run Qwen inference, run fixture inference, run serving benchmarks, execute vLLM/SGLang/Ollama, start iOS integration, add endpoints, accept real user-photo upload, add auth/billing/quota runtime, commit raw artifacts, or change production readiness.

## Phase 21-H Local Model Route Dry-run Plan

Phase 21-H adds the controlled dry-run plan for a future backend `local_model` route:

```sh
npm run qa:open-weight-vlm:local-model-route-dry-run-plan
```

The gate validates sample future plan objects only. It is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. A passing plan still keeps `networkCallsMade:false`, `modelCallsMade:false`, `qwenInferenceRun:false`, `benchmarkRun:false`, and `productionReady:false`.

The first future route test, if explicitly approved later, must be backend-internal, local/private, one declared synthetic local fixture token, one call only, no retries, no real user photo, no iOS integration, no app-facing endpoint, no production endpoint, structured candidate JSON only, mandatory backend validator and fallback/safety chain, raw persistence flags false, and `productionReady:false`.

Phase 21-H does not enable `local_model`, run Qwen, run model inference, run fixture inference, run a serving benchmark, call vLLM/SGLang/Ollama, add iOS integration, add endpoints, accept real user-photo upload, add consent UI, add auth/billing/quota runtime, commit local config/registry/fixtures/reports/logs/model outputs/prompts/request payloads/weights/credentials, or change production readiness.

## Phase 21-G2 Missing Feature + Deferred Roadmap Register

Phase 21-G2 adds a docs-only missing/deferred roadmap register:

```text
docs/missing-features-and-deferred-roadmap-register.md
```

The register records planned, missing, deferred, blocked, partially built, and not-yet-integrated app/backend/VLM features so future sessions do not rely on chat memory. Phase 21-W-R1 clarifies the future strategic VLM target candidate as `Qwen3-VL-30B-A3B`; model upgrade/benchmarking remains a later separately approved phase. The current reference path remains the existing Transformers+FastAPI local/private Qwen VLM sandbox.

Phase 21-G2 is documentation only. It does not enable routes, call Qwen, run model or fixture inference, run serving benchmarks, add iOS integration, add app-facing or production endpoints, implement Auto-Trigger/WSS/image compression/upload runtime, add auth/billing/quota runtime, or change `productionReady:false`.

## Phase 21-G3 Phase Roadmap Sequencing Register

Phase 21-G3 adds `../docs/phase-roadmap-sequencing-and-next-action-register.md` as the docs-only "what next?" source of truth after a phase is committed and pushed. Later Phase 21-W-R1 clarifies `Qwen3-VL-30B-A3B` as the future target candidate, while keeping model calls, upload, WSS, iOS runtime, endpoints, serving benchmarks, and production readiness blocked until explicitly approved.

## Phase 21-H2 Qwen MoE + Live Advisor Target Gate

Phase 21-H2 adds the model/serving/live-advisor target re-evaluation policy:

```sh
npm run qa:open-weight-vlm:qwen-moe-live-advisor-target
```

The gate is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. Phase 21-W-R1 clarifies the future target candidate as `Qwen3-VL-30B-A3B`, not as a model switch in the current reference path. Qwen2.5-VL remains the current reference baseline; text-only Qwen is blocked for image analysis; non-thinking/direct-output, structured output, quantization planning, benchmark requirement, Auto-Trigger policy, compression policy, WSS policy, local CV policy, consent, retention, and deletion boundaries are required.

Phase 21-H2 does not enable `local_model`, switch models, run Qwen, run model inference, run fixture inference, run serving benchmarks, call vLLM/SGLang/Ollama, add iOS integration, add endpoints, implement Auto-Trigger/WSS/image compression/upload runtime, add auth/billing/quota runtime, or change `productionReady:false`.

## Phase 21-I Image Compression + Upload Payload Policy Gate

Phase 21-I adds the future image compression/upload payload policy gate:

```bash
npm run qa:open-weight-vlm:image-compression-upload-policy
```

The gate is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. It validates policy objects only: upload runtime and compression runtime must remain disabled in this planning phase; future upload policy requires a compressed preview target, metadata stripping, consent, retention/deletion dependency, backend mediation, Auto-Trigger linkage, 1 FPS cloud-analysis policy, no original full-resolution default, no base64 unless explicitly approved later, no raw path/GPS/EXIF/sensor/capture-context payload, no provider fields in iOS, and `productionReady:false`.

Phase 21-I does not implement image upload, image compression runtime, iOS payload changes, Camera live cloud AI runtime, Auto-Trigger runtime, WSS runtime, app-facing endpoints, production endpoints, model calls, Qwen inference, serving benchmarks, auth/billing/quota runtime, or production rollout.

## Phase 21-J Auto-Trigger + 1 FPS Live Advisor Policy Gate

Phase 21-J adds the future Auto-Trigger + 1 FPS Live Advisor policy gate:

```bash
npm run qa:open-weight-vlm:auto-trigger-live-advisor-policy
```

The gate is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. It validates policy objects only: Auto-Trigger, Live Advisor runtime, Camera cloud entry, WSS, and upload runtime must remain disabled; stillness must be greater than 1 second; `<=1s` must mean no capture, no upload, no backend call, and no model call; cloud analysis is capped at max 1 FPS; consent/no-silent-upload, disabled/off state, Phase 21-I compression/upload policy, metadata stripping, backend mediation, local-CV-only fast aids, no raw video streaming, safe retry policy, and backoff/server busy policy are required.

Phase 21-J does not implement Auto-Trigger runtime, Camera live cloud AI runtime, WSS runtime, image upload, image compression runtime, iOS payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, serving benchmarks, auth/billing/quota runtime, or production rollout.

## Phase 21-K Stateful WSS Live Advisor Protocol Preflight

Phase 21-K adds the future Stateful WSS Live Advisor protocol preflight:

```bash
npm run qa:open-weight-vlm:stateful-wss-live-advisor-protocol
```

The gate is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. It validates policy objects only: WSS runtime, WebSocket server runtime, iOS WebSocket client runtime, Live Advisor runtime, Camera cloud entry, and upload runtime must remain disabled; backend mediation, max 1 FPS, Auto-Trigger policy, compression/upload policy, consent/no-silent-upload, disabled/off session blocking, server busy/backoff, safe retry, no raw video streaming, no provider fields in iOS, no raw payload/prompt/model output, no chain-of-thought, no debug leakage, and `productionReady:false` are required.

Phase 21-K does not implement WSS runtime, WebSocket server runtime, iOS WebSocket client runtime, Auto-Trigger runtime, Camera live cloud AI runtime, image upload, image compression runtime, iOS payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, serving benchmarks, auth/billing/quota runtime, or production rollout.

## Phase 21-L Local On-device CV Camera Aids Plan

Phase 21-L adds the future local on-device CV camera aids plan gate:

```bash
npm run qa:open-weight-vlm:local-cv-camera-aids-plan
```

The gate is no-network, no-model, no-Qwen, no-fixture-inference, and no-benchmark. It validates policy objects only: local CV runtime, grid alignment runtime, horizon/level runtime, exposure warning runtime, motion/stability runtime, Camera cloud entry, and upload runtime must remain disabled; local-only, no-backend-call, no-upload, no raw frame/sensor/GPS/EXIF persistence, 60fps smoothness target, Auto-Trigger relationship, cloud VLM boundary, no provider/model fields in iOS, and `productionReady:false` are required.

Phase 21-L does not implement local CV runtime, grid alignment runtime, horizon/level runtime, exposure warning runtime, motion/stability runtime, Camera live cloud AI runtime, Auto-Trigger runtime, WSS runtime, image upload, image compression runtime, iOS payload changes, app-facing endpoints, production endpoints, model calls, Qwen inference, serving benchmarks, auth/billing/quota runtime, or production rollout.

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

## Phase 21-M Quantization + Serving Benchmark Plan

Phase 21-M adds a planning-only gate for future quantization and serving benchmark decisions:

```sh
npm run qa:open-weight-vlm:quantization-serving-benchmark-plan
```

The gate validates sanitized benchmark-plan policy objects only. It keeps `benchmarkRuntimeEnabled:false`, `servingStackSwitchEnabled:false`, `modelDownloadEnabled:false`, `qwenInferenceRun:false`, `fixtureInferenceRun:false`, `servingBenchmarkRun:false`, `networkCallsMade:false`, and `productionReady:false`.

The future plan now treats `Qwen3-VL-30B-A3B` as the strategic target candidate for a later separately approved model upgrade/benchmark phase. Qwen2.5-VL remains the current correctness/reference baseline, vLLM remains a primary benchmark candidate, SGLang remains a structured-output/performance challenger, Transformers+FastAPI remains the reference/local-operator baseline, Ollama/LM Studio remains manual-only, and INT4/INT8/AWQ/GPTQ/equivalent quantization remains later benchmark dimensions.

Phase 21-M does not run a serving benchmark, download model weights, switch serving stacks, enable `local_model`, call vLLM/SGLang/Ollama, run Qwen inference, run fixture inference, add an endpoint, add an iOS runtime dependency, or approve production rollout.

## Phase 21-N One-fixture Local Model Smoke Attempt

Phase 21-N was explicitly approved for exactly one backend local/private model call, but preflight stopped before execution because required fixture token `smoke_001` was not present and approved in the ignored local fixture registry.

The blocked result is recorded in `../docs/phase-21-n-one-fixture-local-model-smoke-report.md`. No model call, retry, serving benchmark, serving-stack switch, production `local_model` enablement, vLLM/SGLang/Ollama call, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.

Next backend work should resolve the ignored local `smoke_001` fixture prerequisite only, unless a later prompt explicitly approves another one-call smoke attempt.

Phase 21-N-R0 inspected that prerequisite and found the ignored local `smoke_001.*` fixture file missing. The ignored fixture registry was not edited, no model call ran, and the next backend step is operator-provided local-only `smoke_001` fixture preparation.

Phase 21-N-R0B rechecked the operator-provided fixture prerequisite and `smoke_001.*` is still missing. The ignored fixture registry remains unedited, no model call ran, and the next backend step remains local-only fixture supply.

Phase 21-N-R0C rechecked operator supply of exactly one approved local-only `smoke_001` fixture. The fixture is now present locally and ignored, the ignored fixture registry now has an approved `smoke_001` entry, no model call ran, and the next backend step is an explicitly approved one-fixture local model smoke retry.

Phase 21-N-R1 attempted the explicitly approved one-fixture local/private model smoke retry but stopped before healthz/model execution because the ignored local config fixture token was not `smoke_001`. The phase adds a guarded retry CLI and sanitized blocked report only; no model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.

Phase 21-N-R1B resolves that ignored local config fixture-token mismatch locally only. The ignored local config now points to `smoke_001`, while the ignored local config, fixture registry, and fixture image remain ignored/untracked/unstaged. No model call, healthz check, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurred. A future R1C retry still requires separate explicit approval.

Phase 21-N-R1C attempted that explicitly approved retry after config fix. The guarded command ran once, checked healthz once, and blocked before any model call because healthz was unsafe or unavailable in sanitized buckets. No retry, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurred. The next step is healthz block resolution only.

Phase 21-N-R1D adds a healthz-only no-model preflight helper and records that the healthz blocker was resolved after operator local/private server startup. The recheck returned sanitized bucket `safe`; the ignored local config still targets `smoke_001`, and the ignored registry/fixture prerequisites remain ready and unstaged. No model call, Qwen inference, fixture inference, serving benchmark, endpoint, iOS integration, raw artifact, secret, or production rollout occurred. Phase 21-N-R1E still requires separate explicit approval before any one-fixture model call.

Phase 21-N-R1E runs the explicitly approved one-fixture local/private model smoke retry after healthz fix. The guarded retry command ran once with `--approved-one-call`, `--fixture smoke_001`, and `--no-retry`; it passed preflight, made one local/private model call, and was accepted by backend validation with `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, and latency bucket `gt_15s`. No raw output was printed or persisted. No serving benchmark, model switch, production `local_model`, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.

Phase 21-O adds `backend/src/qa/openWeightVlmServingBenchmarkExecutionScopeGate.mjs` and `npm run qa:open-weight-vlm:serving-benchmark-scope-gate`. The gate is no-model/no-network by default, passes only no-model contract scope, and blocks serving benchmark/model execution, fixture expansion, retries, raw artifacts, endpoints, iOS integration, Camera cloud entry, Auto-Trigger/WSS/upload runtime, public endpoint classes, Ollama/LM Studio production use, quantization production use, and Live Advisor over-1-FPS simulation. It adds no benchmark runtime, model call, Qwen inference, fixture inference, serving stack switch, endpoint, iOS integration, or production rollout.

Phase 21-P adds `backend/src/qa/openWeightVlmServingBenchmarkApprovalMatrix.mjs` and `npm run qa:open-weight-vlm:serving-benchmark-approval-matrix`. The matrix is no-model/no-network and defines approval classes for no-model contract preflight, one-fixture smoke, controlled 12-fixture benchmark, serving stack comparison, quantization benchmark, and Live Advisor 1 FPS simulation. It blocks model calls, benchmark execution, retries, fixture expansion beyond scope, raw artifacts, production readiness, iOS integration, endpoints, Camera cloud entry, Auto-Trigger/WSS/upload runtime, public endpoint classes, Ollama/LM Studio production use, quantization production claims, and unknown stacks/kinds unless a future explicitly approved scope exists.

Phase 21-Q adds `backend/src/qa/openWeightVlmVllmServingContractPreflight.mjs` and `npm run qa:open-weight-vlm:vllm-contract-preflight`. The preflight is no-model/no-network and defines future vLLM contract boundaries only. It blocks vLLM server start, vLLM endpoint call, model calls, benchmarks, model downloads, serving-stack switches, public endpoint classes, raw logging/persistence, missing structured JSON/validator/fallback/safety controls, iOS direct calls/keys, app/prod endpoints, Camera cloud entry, text-only image-analysis models, score/rating, sensitive inference, chain-of-thought, and `productionReady:true`.

Phase 21-R adds `backend/src/qa/openWeightVlmSglangServingContractPreflight.mjs` and `npm run qa:open-weight-vlm:sglang-contract-preflight`. The preflight is no-model/no-network and defines future SGLang contract boundaries only. It blocks SGLang server start, SGLang endpoint call, model calls, benchmarks, model downloads, serving-stack switches, public endpoint classes, raw logging/persistence, missing structured JSON/validator/fallback/safety controls, iOS direct calls/keys, app/prod endpoints, Camera cloud entry, text-only image-analysis models, score/rating, sensitive inference, chain-of-thought, and `productionReady:true`.

Phase 21-S adds `backend/src/qa/openWeightVlmServingStackComparisonMatrix.mjs` and `npm run qa:open-weight-vlm:serving-stack-comparison-matrix`. The matrix is no-model/no-network and compares Transformers+FastAPI as correctness/reference baseline, vLLM as primary future benchmark candidate, SGLang as structured-output/performance challenger, and Ollama/LM Studio as manual-only. It blocks serving runtime, endpoint calls, model calls, benchmarks, model downloads, serving-stack switches, production routes, raw logging/persistence, missing structured JSON/validator/fallback/safety controls, iOS integration, app/prod endpoints, Camera cloud entry, unknown stacks, Ollama/LM Studio production use, and `productionReady:true`.

Phase 21-T adds `backend/src/qa/openWeightVlmOneFixtureServingBenchmarkApprovalRequest.mjs` and `npm run qa:open-weight-vlm:one-fixture-serving-benchmark-approval-request`. The gate is no-model/no-network and validates only a copyable approval-request draft for a possible Phase 21-U one-fixture Transformers+FastAPI reference benchmark. It requires draft-only mode, fixture `smoke_001`, fixture count 1, call count 1, retry count 0, healthz required, local/private endpoint class, separate explicit approval, sanitized output policy, and `productionReady:false`. It blocks current model calls, benchmark execution, serving runtime, endpoint calls, serving-stack switch, raw logging/persistence, iOS integration, app/prod endpoints, Camera cloud entry, Auto-Trigger/WSS/upload runtime, and production readiness.

Phase 21-U adds `backend/scripts/run-open-weight-vlm-transformers-fastapi-one-fixture-serving-benchmark.mjs` and `npm run qa:open-weight-vlm:transformers-fastapi-one-fixture-serving-benchmark`. The guarded wrapper requires `--approved-one-call`, `--serving-stack transformers_fastapi_reference`, `--fixture smoke_001`, `--call-count 1`, and `--no-retry`. The approved run executed exactly one local/private Transformers+FastAPI reference benchmark call, accepted the sanitized result with `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, and latency bucket `gt_15s`, and kept raw output, prompt, payload, image path/content, local config, fixture registry, server URL/logs, and secrets out of tracked artifacts. It does not run a 12-fixture benchmark, concurrency benchmark, quantization benchmark, Live Advisor simulation, vLLM/SGLang/Ollama call, serving switch, endpoint, iOS integration, or production rollout.

Phase 21-V adds `backend/src/qa/openWeightVlmControlledMultifixtureServingBenchmarkApprovalRequest.mjs` and `npm run qa:open-weight-vlm:controlled-multifixture-serving-benchmark-approval-request`. The gate is no-model/no-network and validates only a user-facing approval request draft for a possible Phase 21-W controlled multi-fixture Transformers+FastAPI reference benchmark. It requires draft-only mode, explicit approved fixture tokens, exact fixture count, matching call count, zero retries, healthz required, local/private endpoint class, approved ignored local registry requirement, sanitized output policy, and `productionReady:false`. It blocks current model calls, benchmark execution, serving runtime, endpoint calls, serving-stack switch, raw logging/persistence, iOS integration, app/prod endpoints, Camera cloud entry, Auto-Trigger/WSS/upload runtime, and production readiness.

Phase 21-W0 adds `docs/phase-21-w0-approved-fixture-token-inventory.md`. It safely inventories the ignored local fixture registry with sanitized token/count output only and records 13 approved ready fixture tokens, not exactly 12. It does not run healthz, call endpoints, run model inference, run fixture inference, run a benchmark, modify ignored local config/registry/fixtures, or change `productionReady:false`.

Phase 21-W adds `backend/scripts/run-open-weight-vlm-transformers-fastapi-controlled-multifixture-serving-benchmark.mjs` and `npm run qa:open-weight-vlm:transformers-fastapi-controlled-multifixture-serving-benchmark`. The guarded wrapper requires `--approved-controlled-benchmark`, `--serving-stack transformers_fastapi_reference`, exact fixtures `smoke_004` through `smoke_015`, `--call-count 12`, and `--no-retry`; it rejects `smoke_001`, duplicates, token mismatch, retry scope, wrong stack, raw artifact leakage, and `productionReady:true`. The approved Phase 21-W attempt ran the command exactly once but preflight-blocked before model calls with `blocked_for_unsafe_endpoint_bucket`, so no benchmark/model calls executed.

Phase 21-W-R1 fixes only the endpoint bucket policy mismatch in the controlled wrapper. It normalizes local config buckets such as `local_loopback_name`, `local_loopback_ip`, and `private_lan_ipv4` to the same local/private buckets used by healthz policy, while keeping public IP/domain, ngrok/tunnel, credentialed URL, query-string secret, `0.0.0.0`, missing, and unknown buckets blocked. It runs no model call, benchmark, fixture inference, inference endpoint call, serving runtime change, serving switch, vLLM/SGLang/Ollama call, external server change, iOS integration, raw artifact, or production rollout.

Phase 21-W-R1B retries the approved controlled 12-fixture Transformers+FastAPI benchmark exactly once after the endpoint bucket fix. It uses `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. The result is mixed/rejected with accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`, no raw artifacts, no iOS/runtime/endpoint change, and `productionReady:false`. It led to Phase 21-W-R2 diagnostics.

Phase 21-W-R2 adds `src/qa/openWeightVlmControlledMultifixtureRejectionDiagnostics.mjs` and `npm run qa:open-weight-vlm:controlled-multifixture-rejection-diagnostics`. The diagnostics are no-network/no-model and compare the accepted Phase 21-U path with the W-R1B all-rejected controlled path using sanitized summaries only. The likely failure layer is `external_route_error_mapping_or_fixture_token_contract`, and the recommended next work is Phase 21-W-R2C: External Server Fixture-token Contract Fix.

Phase 21-W-R2C updates the external Windows FastAPI server workspace only for no-model fixture-token contract and route-error mapping. The external server now recognizes approved contract tokens `smoke_001` and `smoke_004` through `smoke_015`, accepts `fixtureId`, `fixtureToken`, or `fixture` keys on no-model contract paths, returns schema-shaped deterministic candidates for approved tokens, and fails closed with sanitized buckets for missing/unsupported tokens or route errors. No inference endpoint call, model call, benchmark, fixture inference, serving-stack switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred. Main repo docs point next to Phase 21-W-R2C2 for backend no-model contract echo validation against the external server.

Phase 21-W-R2C2 adds `src/qa/openWeightVlmBackendContractEchoValidation.mjs` and `npm run qa:open-weight-vlm:backend-contract-echo-validation`. The CLI may call only no-model contract echo paths and must fail closed for model calls, inference endpoint calls, benchmark execution, raw artifact leakage, and `productionReady:true`. The external no-model checker passed, and the backend reached a local/private no-model HTTP endpoint, but validation blocked because unsupported/missing fixture-token responses returned `unknown` buckets instead of explicit sanitized buckets. Roadmap next is Phase 21-W-R2C4: Contract Echo Validation Failure Fix.

Phase 21-W-R2C-FINAL fixes the no-model contract echo validation mismatch. The external server now returns canonical no-model fields for approved, unsupported, and missing token responses; the backend CLI prefers the safe default no-model loopback path unless explicitly overridden and exits cleanly after validation. `npm run qa:open-weight-vlm:backend-contract-echo-validation` now passes with approved token count `13`, unsupported bucket `unsupported_fixture_token`, missing bucket `missing_fixture_token`, and `productionReady:false`.

Phase 21-W-R3 was explicitly approved to retry the controlled 12-fixture Transformers+FastAPI benchmark after contract echo validation passed. External and backend contract echo checks passed first, but `npm run qa:open-weight-vlm:local-model-healthz-preflight` blocked safely with sanitized bucket `model_not_loaded` before any benchmark/model call. Actual call count stayed `0`, retry count stayed `0`, no inference endpoint was called, no serving switch occurred, Qwen3-VL-30B-A3B was not used, no raw artifacts were printed or persisted, and `productionReady:false` remains locked. Roadmap next is Phase 21-W-R3-R1 healthz block resolution.

Phase 21-W-R3-R1 diagnoses that healthz block without calling the inference endpoint, running fixture inference, or running a benchmark. The external no-model contract checker still passes, the healthz-only checker remains blocked with `model_not_loaded`, and a sanitized no-load dependency probe found no missing dependency class. The likely blocker bucket is `model_load_disabled`; the next safe action is operator model-enabled server startup for the existing local/private reference server. Qwen3-VL-30B-A3B was not installed, downloaded, loaded, benchmarked, or called, and `productionReady:false` remains locked.

Phase 21-W-GOAL was an approved autonomous attempt to resolve readiness and reach a final controlled 12-fixture Transformers+FastAPI benchmark result. Codex confirmed no-model contract health, used the existing local/private startup helper once in model-enabled offline mode, and rechecked healthz through the backend gate. Healthz remained `model_not_loaded`, likely bucket `missing_local_model_runtime`, so no benchmark command ran, model call count stayed `0`, retry count stayed `0`, no inference endpoint was called, no Qwen3-VL-30B-A3B was used, no raw artifacts were printed or persisted, and `productionReady:false` remains locked.

Phase 21-W-GOAL-R2 was explicitly approved to retry the controlled 12-fixture Transformers+FastAPI benchmark after live model runtime readiness. External and backend no-model contract checks passed, ignored local config/registry/fixture prerequisites stayed ignored and unstaged, and fresh healthz was `safe` with `modelLoaded:true`. The guarded benchmark ran exactly once with `smoke_004` through `smoke_015`, call count `12`, retry count `0`, and sanitized aggregate output only. The result was accepted count `0`, rejected count `12`, validation bucket `local_model_unavailable`, fallback bucket `blocked_for_provider_integration`, latency bucket `lt_1s x12`. The command printed the complete sanitized aggregate and then exited nonzero after a post-output Node assertion; it was not rerun. No extra calls, retry, one-fixture benchmark, Qwen3-VL-30B-A3B install/load/call, vLLM/SGLang/Ollama call, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

Phase 21-W-GOAL-R2-R2 diagnoses and partially fixes the post-readiness `local_model_unavailable x12` path without model calls, benchmark reruns, or real inference endpoint calls. The primary root cause bucket is `fixture_lookup_mismatch`: external no-model contract echo accepts the 12 approved tokens, but the real route still has separate fixture routeability/image lookup requirements. The external workspace now has a no-model benchmark route-contract dry-run endpoint and checker, and the backend now has a matching dry-run validator CLI/tests. The guarded benchmark wrapper now preserves sanitized HTTP non-OK buckets such as `fixture_not_available`, `missing_fixture_token`, `unsupported_fixture_token`, and `route_not_found` instead of flattening every non-OK response to `local_model_unavailable`. External in-process dry-run passed and exposed `fixture_not_available x12`; backend live dry-run safely blocked with `route_not_found` because the running external process had not loaded the new endpoint. No Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

Phase 21-W-GOAL-R2-R2A follows up the live no-model route-contract dry-run. External static checkers still pass, and the initial backend live dry-run still failed closed with `route_not_found`, so the cause bucket is `stale_server_process`. The local/private server listener was restarted with the approved helper, but post-reload healthz blocked with `connection_refused`; the backend live dry-run was not rerun after healthz failed. No model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

Phase 21-W-FINAL was an approved bounded route-debug and controlled benchmark finalization attempt. The total model-call cap was `14`, the final benchmark cap was `12`, and retry count was `0`, but no model calls were made because live healthz/model readiness blocked with `connection_refused` after server restart. The external FastAPI error handler now preserves known sanitized route detail buckets before generic `route_not_found` mapping. External static no-model contract checks passed, but backend live route/healthz was unavailable, so the final benchmark did not run. No Qwen3-VL-30B-A3B use, vLLM/SGLang/Ollama, serving switch, iOS runtime change, endpoint addition, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

Phase 21-W-FINAL-R1 attempted runtime reconnect only. External static no-model contract checks still passed, the expected local/private server port was not listening, and the approved helper restart produced only a brief listener before backend healthz blocked with `connection_refused`. The latest sanitized blocker is `startup_failed_after_model_load`. Backend live route dry-run was not run after healthz failed. No model call, benchmark, real inference endpoint call, fixture inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

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
- Do not add Gemini Live, WebSocket, Camera cloud AI, Filter Generator real backend, or ?摮???image editing in this backend phase.
- Do not commit secrets, `.env`, provider keys, Firebase config, or production storage config.
