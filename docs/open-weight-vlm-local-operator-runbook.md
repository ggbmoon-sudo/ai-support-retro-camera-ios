# Open-weight VLM Local Operator Runbook

Status: Backend-only operator runbook
Date: 2026-06-14
Phase: 20-C

This runbook prepares a future approved local real-model smoke run for the self-hosted/open-weight VLM Photo Advisor path. It does not approve a production rollout, app-facing endpoint, iOS integration, Camera cloud AI, training/fine-tuning, or user-photo use.

## Purpose

Give an operator a repeatable way to prepare, gate, and review a backend-only local VLM smoke run without leaking raw images, prompts, model output, request payloads, secrets, private paths, GPS/raw EXIF, or generated reports into git, logs, docs, or app UI.

The safe default remains synthetic/stubbed/no-network.

## What this phase does

- Adds an operator checklist for future local/self-hosted VLM smoke testing.
- Adds a real-model smoke gate command that checks config, prerequisites, and redaction without calling a model.
- Keeps synthetic benchmark and local stub smoke checks as prerequisites.
- Keeps `productionReady:false`.
- Keeps the work backend-only.

## What this phase does not do

- It does not run a real VLM.
- It does not add model server code.
- It does not add an app-facing or production endpoint.
- It does not add iOS integration.
- It does not add iOS provider/model keys or direct calls.
- It does not change backend provider request payloads or iOS upload payloads.
- It does not upload capture context.
- It does not add Camera cloud AI.
- It does not commit model server URLs, credentials, real photos, local fixtures, raw reports, prompts, model output, or generated artifacts.
- It does not train or fine-tune a model.

## Prerequisites

Before any future real-model smoke run:

- Phase 19-C through Phase 20-B checks are passing.
- `npm run qa:open-weight-vlm:synthetic` passes.
- `npm run qa:open-weight-vlm:gate` passes with no hard blockers.
- `npm run qa:open-weight-vlm:local-config` still prints sanitized config buckets only.
- `npm run qa:open-weight-vlm:local-smoke` passes in default no-network mode.
- `npm run qa:open-weight-vlm:local-smoke-gate` is reviewed and blocks until ignored local config is intentionally prepared.
- Phase 20-D1 adapter prep is present; read `docs/open-weight-vlm-transformers-fastapi-local-adapter.md`.
- Phase 20-D2A setup guidance is present; read `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`.
- The operator has explicit approval to prepare a local real-model smoke run.

## Approved local fixture policy

Future local real-model smoke fixtures must follow these rules:

- Use only approved local fixtures.
- Keep fixtures in an ignored folder such as `backend/tests/vlm-local-samples/`.
- Do not use user photos by default.
- Do not commit private real photos, generated images, screenshots, recordings, or local samples.
- Strip metadata before any future model request path.
- Do not persist GPS/location or raw EXIF.
- Use non-sensitive scenario names.
- Do not label people by identity, face, skin, age, gender, emotion, health, beauty, body, race, religion, disability, or other sensitive attributes.

## Ignored config policy

The real local config must stay ignored:

- Use `backend/config/open-weight-vlm.local.json`.
- Do not commit the real local config.
- Do not commit model server URLs, model registry tokens, provider credentials, API keys, private model paths, or `.env` files.
- Keep `enabled:false` and `allowNetworkCalls:false` unless an approved local smoke run is being prepared.
- Use `servingStack:"transformers_fastapi"` for the first approved real-model smoke path.
- Use a short non-sensitive `fixtureId` token only; do not store raw fixture paths in config.
- Use loopback by default, or an explicitly approved private LAN IPv4 model host only when `allowPrivateLanModelServer:true` is set in ignored local config.
- Do not use public model URLs by default.
- Do not use public IPs/domains, tunnel/ngrok/cloud hosts, HTTPS URLs, credentialed URLs, query-string secrets, or `0.0.0.0` for the local smoke path.

The committed example remains only a template:

```sh
backend/config/open-weight-vlm.local.example.json
```

The first Transformers FastAPI smoke should also use an ignored local fixture registry:

```sh
backend/config/open-weight-vlm.fixtures.local.json
```

Use exactly one first-smoke fixture token, `smoke_001`, mapped by the local server to an approved ignored image under `backend/tests/vlm-local-samples/`. Do not commit the registry or fixture image.

## Safe command sequence

Run these commands from `backend/`:

```sh
npm test
npm run qa:open-weight-vlm:synthetic
npm run qa:open-weight-vlm:gate
npm run qa:open-weight-vlm:local-config
npm run qa:open-weight-vlm:local-smoke
npm run qa:open-weight-vlm:local-smoke-gate
```

Expected current behavior:

- Synthetic benchmark passes.
- Synthetic benchmark gate passes.
- Local config dry-run is sanitized.
- Local smoke passes in no-network stub mode.
- Local smoke gate fails closed until ignored local config is present, enabled, network opt-in is true, approved local fixture mode is set, and all prerequisites pass.

Do not run a real model from this phase.

## Phase 20-D2J Accepted Smoke Note

Phase 20-D2J produced the first accepted Qwen-backed private LAN local VLM smoke:

- Windows GPU ran Qwen2.5-VL with Transformers/FastAPI.
- MacBook ran the repo backend sandbox client and validator.
- Contract echo passed first.
- One `smoke_001` Qwen-backed candidate passed with `acceptedCount:1`, `rejectedCount:0`, `validationCode:null`, `fallbackCategory:null`, `schemaDiagnostic:null`, `latencyBucket:gt_15s`, `networkCallsMade:true`, and `productionReady:false`.
- Raw prompt/model output/image/base64/path/request payload/full URL/local config/fixture registry/fixture image/report/secrets were not persisted or committed.

After any Windows mapper change, require contract echo to pass again before running Qwen-backed smoke.

The D2J result permits planning a conservative Phase 20-E-B expansion only. It does not approve iOS integration, app-facing endpoints, production endpoints, production rollout, training/fine-tuning, or user-photo use.

## Real-model smoke gate checks

The smoke gate checks:

- ignored local config exists
- config path is the local ignored config pattern
- `enabled:true` is present only in local ignored config
- `allowNetworkCalls:true` is present only in local ignored config
- model server URL is sanitized into a bucket and must be loopback/private-approved
- private LAN URLs require `allowPrivateLanModelServer:true` and must be IPv4 only in `10.0.0.0/8`, `172.16.0.0/12`, or `192.168.0.0/16`
- no public model URL by default
- serving stack is `transformers_fastapi`
- `fixtureMode` is `approved_local_only`
- fixture token is configured without printing the real fixture path or name
- synthetic benchmark gate has passed
- local sandbox smoke passes in default no-network mode
- output redacts URL/path/secret-like values
- `productionReady:false`
- `networkCallsMade:false`

The gate does not call a model.

## Stop conditions

Stop immediately if any of these occur:

- config is missing or unsafe
- public model URL appears
- private LAN model URL appears without the explicit ignored-config opt-in
- tunnel, cloud, HTTPS, credentialed, query-string, or `0.0.0.0` model URL appears
- credentials or token-like values appear in config, output, docs, or staged files
- real photo, user photo, screenshot, recording, generated image, or local sample appears in staged files
- raw image, base64, private path, prompt, request payload, or model output appears in output or docs
- synthetic benchmark gate fails
- local smoke default no-network check fails
- any hard blocker appears from the benchmark gate
- any payload change appears
- any iOS integration diff appears
- any Camera cloud entry diff appears
- `productionReady` is set to true
- raw EXIF/GPS is persisted
- training or fine-tuning starts

## Sanitized reporting rules

Allowed output:

- sanitized status categories
- sanitized blocker/warning codes
- config buckets, not raw config values
- prerequisite pass/fail booleans
- aggregate benchmark/smoke counts
- `productionReady:false`
- `networkCallsMade:false` unless a later approved phase explicitly runs a local model

Forbidden output:

- raw image
- base64 image
- raw prompt
- raw request payload
- raw model output
- raw provider/model response
- model server URL
- credentials, tokens, Authorization headers, or secrets
- private file paths
- GPS/location
- raw EXIF
- stack traces containing model output
- unsafe model text

## Post-run artifact scan

Before committing after any operator QA work:

```sh
git status --short --untracked-files=all
git diff --check
```

Then confirm no staged/untracked artifacts include:

- real photos
- approved local samples
- generated images
- screenshots or recordings
- raw reports
- model outputs
- prompts or request payloads
- `.env` files
- local config files

## Troubleshooting

- `config_missing`: expected until `backend/config/open-weight-vlm.local.json` is created locally and remains ignored.
- `sandbox_disabled`: set `enabled:true` only for an approved local run.
- `network_opt_in_missing`: set `allowNetworkCalls:true` only for an approved local run.
- `private_lan_not_allowed`: set `allowPrivateLanModelServer:true` only in ignored local config after confirming the Windows GPU server is reachable only on private LAN.
- `model_server_missing`: the ignored local config needs a validated local/private model server URL bucket.
- `unsupported_local_serving_stack`: use the Phase 20-D1 `transformers_fastapi` adapter path for the first local smoke.
- `synthetic_benchmark_gate_not_passed`: rerun the synthetic benchmark and gate before trying local model work.
- `local_smoke_default_not_passed`: fix the no-network stub smoke path before any real-model work.
- `local_smoke_gate_redaction_failed`: stop and inspect only code, not raw reports; do not commit generated output.
- `invalid_schema`: align the Windows FastAPI response mapper to `openWeightVlmPhotoAdvisorSchema`. Review only sanitized `schemaDiagnostic` buckets. Common field buckets are `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, `safety`, `observationKey`, and `safetyFlags`.
- `missing_required_field`: return every required schema field, including `visualObservationKey`, `retakeReasonKey`, and `safety`.
- `additional_property`: remove unsupported response fields such as `observationKey` or `safetyFlags` before returning the candidate, but only after safety screening and without hiding unsafe content.
- `wrong_type`: use the repo shape exactly: string `allowedContext`, object `creativeIntent`, object `technicalRisk`, object `safety`.
- `unsupported_enum`: map local model labels deterministically to allowed enum values before returning JSON; do not ask the backend validator to accept new values.

## Boundary confirmations

- No iOS integration is added.
- No app-facing endpoint is added.
- No production endpoint is added.
- No model server URL config is committed.
- No provider/model credentials are committed.
- No backend provider request payload is changed.
- No iOS upload payload is changed.
- No capture context upload is added.
- No Camera cloud AI entry is added.
- No real photos or generated raw model reports are committed.
- No training/fine-tuning is added.
- `productionReady:false` remains required.

## Phase 20-D handoff checklist

Phase 20-D may start only after explicit approval and only if:

- synthetic benchmark passes
- synthetic benchmark gate has no hard blockers
- local config dry-run is sanitized
- local sandbox smoke passes in no-network mode
- local smoke gate has no hard blockers under ignored local config
- local config uses `servingStack:"transformers_fastapi"`
- Windows GPU hosting, if used, is explicitly private LAN only and the smoke gate reports `private_lan_ipv4` rather than a raw URL/IP
- the local setup follows `docs/open-weight-vlm-transformers-fastapi-smoke-server-setup.md`
- the first fixture token is `smoke_001`
- approved local fixtures are present only in ignored folders
- operator confirms no real/user photos will be committed
- operator confirms raw prompt/model output/image/path/request payload logging is disabled
- generated reports remain ignored
- app/backend payloads are unchanged
- iOS has no provider/model key or direct call
- Camera has no cloud AI entry
- `productionReady:false`

Passing this checklist is not production approval. It only prepares a backend-only local real-model smoke run.

## Phase 20-E-B Expansion Checklist

Phase 20-E-B may be planned only after explicit request and only as a backend-only local/private LAN expansion:

- [ ] Use 3 to 5 approved ignored fixtures.
- [ ] Use fixture IDs only; do not send raw image paths, base64, or multipart images from the MacBook repo.
- [ ] Keep fixture registry and fixture images ignored/untracked/unstaged.
- [ ] Run one model call per fixture only; do not retry to chase pass rate.
- [ ] Run backend tests, synthetic benchmark, benchmark gate, local config dry-run, default local smoke, and local smoke gate first.
- [ ] Run Windows healthz and contract echo before Qwen-backed fixtures.
- [ ] Record sanitized aggregate metrics only.
- [ ] Keep raw prompt/model output/image path/base64/request payload/server logs out of git, docs, and reports.
- [ ] Keep iOS unchanged and `productionReady:false`.

## Phase 20-E-B2 Completed 3-Fixture Note

Phase 20-E-B2 completed the first approved 3-fixture local/private Qwen-backed smoke expansion on 2026-06-16.

Sanitized root cause of the initial `smoke_002` / `smoke_003` block:

- the external Windows server workspace had only `smoke_001` available
- `smoke_002` and `smoke_003` failed before inference with provider-integration fallback buckets
- adding approved local fixture availability in the external Windows server workspace resolved the block
- no backend validator, backend request-contract, or iOS change was required

Sanitized completed result:

- `fixtureCount:3`
- `acceptedCount:3`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x3`
- `fallbackCategoryCounts:null x3`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:gt_15s x1, 5s_to_15s x2`
- `networkCallsMade:true`
- `productionReady:false`

For any future expansion, keep the same controls: fixture IDs only, one model call per fixture, no retries to chase pass rate, no raw prompt/model output/image path/base64/request payload/config/registry/log printing, and no committed local fixtures or reports.

## Phase 20-E-C Repeatability Gate

Phase 20-E-C adds a backend-only repeatability/regression gate for sanitized local VLM smoke expansion aggregates.

Run:

```sh
cd backend
npm run qa:open-weight-vlm:local-repeatability-gate
```

The gate reviews only:

- fixture counts
- accepted/rejected counts
- acceptance rate
- validation, fallback, schema error, and schema field buckets
- latency buckets
- `networkCallsMade`
- `productionReady`
- raw persistence booleans

The B2 baseline passes with:

- `pass_for_local_repeatability_review`
- `pass_with_latency_note`
- `productionReady:false`

The latency note is expected for the B2 baseline because one accepted fixture was `gt_15s`. Treat it as sandbox review information, not production readiness.

The gate blocks schema regressions, provider-integration fallback buckets, raw persistence, unapproved fixture counts, and `productionReady:true`. It does not call a model, read local config contents, inspect fixture registry contents, print raw prompts/model output/image paths/base64/request payloads, or approve iOS/product rollout.

## Phase 20-E-D Failure And Latency Taxonomy

Phase 20-E-D adds a backend-only taxonomy for interpreting sanitized local VLM smoke failures and latency outcomes.

Run:

```sh
cd backend
npm run qa:open-weight-vlm:local-failure-taxonomy
```

Default behavior uses a synthetic sanitized sample and makes no model call. The taxonomy reviews only:

- fixture counts
- accepted/rejected counts
- acceptance rate
- validation, fallback, schema error, and schema field buckets
- latency buckets
- `networkCallsMade`
- `productionReady`
- raw persistence booleans
- optional model/server availability buckets
- optional fixture readiness buckets

Pass and review categories:

- `pass_clean_local_smoke`
- `pass_with_latency_note`
- `pass_with_minor_review_note`
- `not_production_ready`

Block categories:

- `blocked_for_schema_regression`
- `blocked_for_provider_integration`
- `blocked_for_raw_persistence`
- `blocked_for_fixture_readiness`
- `blocked_for_unapproved_fixture`
- `blocked_for_model_server_unavailable`
- `blocked_for_network_not_made_when_required`
- `blocked_for_unexpected_network_call`
- `blocked_for_repeatability_drift`
- `blocked_for_latency_regression`
- `blocked_for_production_flag`
- `blocked_for_unknown_smoke_state`

Latency categories:

- `latency_ok`
- `latency_note`
- `latency_regression`
- `latency_blocker`

Accepted `gt_15s` latency is a sandbox review note. All accepted fixtures at `gt_15s` are latency regression review data. Timeout, unavailable, or pre-inference block buckets stop review. Safe rejections remain useful local smoke data, but they do not approve production readiness.

Phase 20-E-D does not run a larger fixture expansion, run real Qwen smoke, read local config contents, inspect fixture registry contents, print raw prompts/model output/image paths/base64/request payloads, or approve iOS/product rollout.

## Phase 20-E-E Sandbox Review Summary

Phase 20-E-E adds the consolidated sandbox review at:

```text
docs/open-weight-vlm-local-sandbox-review-summary.md
```

Use that summary before starting Phase 20-F. It records:

- completed D2J through E-D milestones
- what the local/private Windows Qwen2.5-VL sandbox proved
- what remains unproven
- the full gate inventory
- safety/privacy/product boundaries
- Windows-primary workflow and MacBook/Xcode role
- Phase 20-F entry criteria
- recommended Phase 20-F direction

Phase 20-F may start only after:

- repo is clean
- upstream comparison is `0 0`
- E-E is reviewed, committed, and pushed
- ignored local config, registry, fixtures, reports, logs, weights, and credentials remain ignored/untracked/unstaged
- Windows server remains local/private only
- raw logging remains disabled
- healthz is safe if future smoke is planned
- all existing gates pass
- Phase 20-F scope is explicitly chosen

Recommended Phase 20-F direction is expanded fixture set planning plus fixture registry schema. Do not run real model smoke, expand fixture count, benchmark vLLM/SGLang, or start iOS integration unless a future explicit phase asks for that scope.

## Phase 20-F Expanded Fixture Registry Dry-run

Phase 20-F adds a backend-only dry-run gate for future expanded fixture planning:

```sh
cd backend
npm run qa:open-weight-vlm:expanded-fixtures
```

The command reviews sanitized sample registry metadata only. It does not read ignored local config, require fixture images, call a model, make network calls, print raw paths/prompts/model outputs/request payloads, or approve production readiness.

Before any future controlled 6-8 fixture smoke:

- Phase 20-F must be reviewed, committed, and pushed.
- The expanded fixture dry-run gate must pass.
- Ignored local fixture registry and fixture images must be prepared safely and remain untracked/unstaged.
- Every fixture must be metadata-stripped, privacy-reviewed, approved for local smoke, face-free, non-sensitive, and free of private identifiers.
- Existing backend tests, synthetic benchmark/gate, local config dry-run, default local smoke, local smoke gate, repeatability gate, failure taxonomy, and boundary scans must pass.
- Windows healthz must be safe, local/private only, and raw logging disabled.
- The user must explicitly approve real local/private model calls for that future phase.

Passing the dry-run gate is not permission to run real smoke by itself.

## Phase 20-G Blocked Run Note

The approved Phase 20-G controlled expanded smoke ran exactly eight local/private fixture calls and stopped. All eight returned sanitized provider-integration fallbacks before schema validation:

- `fixtureCount:8`
- `acceptedCount:0`
- `rejectedCount:8`
- `fallbackCategoryCounts:blocked_for_provider_integration x8`
- `latencyBucketCounts:lt_1s x8`
- no schema diagnostic buckets
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags false

For this pattern, do not retry fixtures to chase pass rate. Diagnose only sanitized local/private Windows server state, especially expanded fixture availability and request handling. Do not print raw prompts, raw model outputs, image paths, base64, request payloads, local config contents, fixture registry contents, credentials, or server logs.

## Phase 20-H Provider Diagnostic

Run the backend-only diagnostic:

```sh
npm run qa:open-weight-vlm:expanded-fixture-provider-diagnostic
```

This command is no-model by default and reviews sanitized aggregate buckets only. Optional registry or healthz inspection must stay sanitized and must not print raw paths, local config contents, fixture registry contents, prompts, model output, base64, request payloads, credentials, EXIF, or server logs.

The Phase 20-H diagnosis points to a pre-inference fixture availability / routing mismatch between the backend expanded registry and the external Windows FastAPI server. A future real expanded smoke is blocked until a local/private no-model contract-echo fixture-routing check proves the approved fixture tokens route without Qwen inference.

## Phase 20-I Fixture Routing Contract Echo

Run:

```sh
npm run qa:open-weight-vlm:fixture-routing-echo
```

The command calls only the local/private fixture routing contract echo endpoint. It verifies `smoke_001` through `smoke_008` route without Qwen inference, prompt creation, model output, raw image path printing, request payload printing, or production readiness.

Sanitized passing aggregate:

- `totalFixtureTokens:8`
- `routeableCount:8`
- `unavailableCount:0`
- `modelInferenceRun:false`
- raw persistence flags false
- `networkCallsMade:true`
- `productionReady:false`

Only after this check and all existing gates pass may a future explicitly approved phase consider another controlled expanded real smoke.

## Phase 20-J Controlled Retry Result

Phase 20-J ran that explicitly approved controlled retry:

- exactly eight local/private Qwen-backed calls
- one call per approved fixture token
- no retries
- no extra fixtures
- fixture IDs only
- sanitized metrics only

Sanitized aggregate: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`, `validationCodeCounts:null x8`, `fallbackCategoryCounts:null x8`, no schema diagnostic buckets, `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.

Repeatability and failure/latency gates passed with a latency note. Treat this as backend-only sandbox evidence, not production readiness.

## Phase 20-K Review And Coverage Gap Plan

Phase 20-K adds `docs/open-weight-vlm-expanded-smoke-result-review.md`. It reviews the accepted eight-fixture result, records coverage gaps, and recommends Phase 20-L as a no-model 12-fixture coverage expansion plan plus registry gate.

Operator implications:

- Do not run more real local model smoke from Phase 20-K.
- Do not add fixture images or expand the real ignored registry during Phase 20-K.

## Phase 20-L 12-Fixture No-model Gate

Phase 20-L updates `npm run qa:open-weight-vlm:expanded-fixtures` so the dry-run target is 12 planned categories. It must report `totalTargetFixtures:12`, the required categories, missing required categories, `networkCallsMade:false`, and `productionReady:false`.

The Phase 20-J eight categories remain covered, and the planned additions are `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`. Do not run real model smoke, add fixture images, commit local registry/config, print raw paths, or start iOS/product integration from this phase.

## Phase 20-M Ignored Fixture Prep And 12-Token Routing Echo

Phase 20-M prepares the ignored local 12-fixture set and updates the no-model routing echo to 12 approved tokens. It uses only sanitized fixture IDs and registry metadata, and it keeps `productionReady:false`.

The operator should treat the result as sandbox readiness only. Do not run Qwen inference, real model smoke, app-facing endpoints, iOS integration, or production rollout from this phase.

## Phase 20-N Controlled 12-Fixture Smoke

Phase 20-N ran the explicitly approved controlled local/private smoke:

- exactly 12 Qwen-backed calls
- one call per approved ignored fixture token `smoke_004` through `smoke_015`
- no retries
- no extra fixtures
- sanitized metrics only

Sanitized aggregate: `fixtureCount:12`, `acceptedCount:12`, `rejectedCount:0`, `acceptanceRate:100%`, `validationCodeCounts:null x12`, `fallbackCategoryCounts:null x12`, no schema diagnostic buckets, `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.

Repeatability and failure/latency taxonomy gates passed with a latency note. Treat this as sandbox evidence only, not iOS readiness or production approval.
- Treat accepted `gt_15s` buckets as sandbox latency notes, not production approval.
- Keep all local config, fixture registry, fixture images, reports, logs, prompts, model outputs, request payloads, credentials, and model weights ignored.
- Require a future explicit prompt before any additional real local/private model calls.
- Keep `productionReady:false`.

## Phase 20-O Serving Benchmark Decision

Phase 20-O reviews the accepted 12-fixture smoke and records the serving benchmark decision gate. The next recommended step is Phase 20-P serving-stack benchmark preflight only.

Operator implications:

- Do not run vLLM, SGLang, Ollama, or LM Studio benchmarks from Phase 20-O.
- Do not switch model stacks from Phase 20-O.
- Do not run more real smoke without a future explicit prompt.
- Keep benchmark planning backend-only and sanitized aggregate-only.
- Keep `productionReady:false`.

## Phase 20-P Serving Benchmark Preflight

Phase 20-P adds `npm run qa:open-weight-vlm:serving-benchmark-preflight` and `docs/open-weight-vlm-serving-benchmark-preflight.md`. The command validates a sanitized benchmark plan only.

Expected preflight output:

- `networkCallsMade:false`
- `benchmarkRun:false`
- `qwenInferenceRun:false`
- `eligibleForPhase21EntryReview:true`
- `eligibleForBenchmarkExecution:false`
- `productionReady:false`

Operator implications:

- Do not run a serving benchmark from Phase 20-P.
- Do not run Qwen inference or real model smoke from Phase 20-P.
- Do not switch model stacks from Phase 20-P.
- Treat Phase 21-C as backend internal provider routing dry-run only unless a future prompt explicitly chooses another no-network planning phase.
- Keep `productionReady:false`.

## Phase 21-A Gateway Contract Preflight

Phase 21-A adds:

```sh
npm run qa:open-weight-vlm:gateway-contract-preflight
```

This command is no-network and no-model. It validates backend-internal gateway request/response contracts only, rejects raw image/base64/path/prompt/provider-response artifacts, rejects direct iOS provider fields and endpoint flags, requires structured candidate JSON, and keeps the existing candidate validator/safety chain as the source of truth.

Operator implications:

- Do not run Qwen inference or real model smoke from Phase 21-A.
- Do not start iOS integration from Phase 21-A.
- Do not add app-facing or production endpoints from Phase 21-A.
- Do not accept real user-photo upload from Phase 21-A.
- Keep `productionReady:false`.

## Phase 21-B Gateway Adapter Stub And No-model Echo

Phase 21-B adds:

```sh
npm run qa:open-weight-vlm:gateway-adapter-stub
npm run qa:open-weight-vlm:gateway-external-contract-echo
```

Operator implications:

- The app repo remains the source of truth for gateway contract, adapter stub, validator, safety gates, docs, tests, and future app integration.
- The external Windows workspace remains a private local model-provider sandbox only.
- `/local/vlm/gateway-contract-echo` is a no-model compatibility endpoint only.
- Healthz and echo must report `publicExposure:no`, `rawLoggingDisabled:true`, `modelInferenceRun:false`, raw persistence flags false, and `productionReady:false`.
- Do not run Qwen inference, real model smoke, serving benchmarks, vLLM/SGLang/Ollama, or fixture image inference from Phase 21-B.
- Do not start iOS integration, app-facing endpoints, production endpoints, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout.

## Phase 21-C Gateway Provider Routing Dry-run

Phase 21-C adds:

```sh
npm run qa:open-weight-vlm:gateway-provider-routing
```

Operator implications:

- The app repo remains the source of truth for gateway routing policy, validator, safety gates, docs, tests, and QA scripts.
- The routing dry-run is no-network and no-model.
- `local_stub` and `local_contract_echo` are the only allowed backend-internal modes.
- `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes must block.
- Do not run Qwen inference, real model smoke, serving benchmarks, vLLM/SGLang/Ollama, or fixture image inference from Phase 21-C.
- Do not start iOS integration, app-facing endpoints, production endpoints, real user-photo upload, consent UI, capture-context upload, training/fine-tuning, or production rollout.
- Keep `productionReady:false`.

## Phase 21-D Provider Adapter No-model HTTP Check

Phase 21-D adds:

```sh
npm run qa:open-weight-vlm:gateway-provider-adapter-no-model-http
```

Operator implications:

- Only the `local_contract_echo` route is allowed.
- The command may call only local/private healthz and `/local/vlm/gateway-contract-echo`.
- The check must report no model call, no Qwen inference, no fixture inference, no raw persistence, no app-facing endpoint, no production endpoint, and `productionReady:false`.

## Phase 21-E Cross-platform Deployment Boundary

Phase 21-E adds:

```sh
npm run qa:open-weight-vlm:cross-platform-boundary
```

Operator implications:

- Windows local paths and local model URLs are allowed only in docs, operator runbooks, manual smoke notes, ignored local config examples, and tests that assert sandbox-only behavior.
- Backend runtime, iOS runtime, committed production config, and future production architecture must not depend on Windows paths, Mac local paths, LAN model URLs, public/cloud/tunnel model URLs, provider secrets, direct iOS model/provider calls, Camera cloud entries, or endpoint flags.
- MacBook/Xcode must remain able to build and verify iOS without Windows local paths or local model server URLs.
- Future production must use environment/secrets/config and backend-mediated provider adapters.
- Do not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, or production rollout from this phase.
- Keep `productionReady:false`.
