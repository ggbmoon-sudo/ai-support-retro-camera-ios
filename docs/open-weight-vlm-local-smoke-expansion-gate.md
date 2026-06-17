# Open-weight VLM Local Smoke Expansion Gate

Status: Phase 20-E-B2 completed
Date: 2026-06-16
Phase: 20-E-B2

## Purpose

Phase 20-E-A records the first accepted Qwen-backed private LAN local VLM smoke and defines the conservative gate for a future Phase 20-E-B small fixture expansion.

This document does not approve iOS integration, an app-facing endpoint, a production endpoint, Camera cloud AI, training/fine-tuning, or production rollout. `productionReady:false` remains required.

Phase 20-E-B2 completed the first approved 3-fixture local/private Qwen-backed expansion after fixing fixture availability in the external Windows server workspace. The run remains backend-only and sanitized.

## D2J Accepted Smoke Record

Phase 20-D2J succeeded with a Windows GPU Transformers/FastAPI Qwen2.5-VL server on private LAN and the MacBook backend sandbox client.

Sanitized health check summary:

- `ok:true`
- `modelLoaded:true`
- `modelFamily:qwen2.5-vl`
- `fixtureSmoke001Available:true`
- `rawLoggingDisabled:true`
- `publicExposure:no`

Sanitized local model smoke summary:

- `acceptedCount:1`
- `rejectedCount:0`
- `validationCode:null`
- `fallbackCategory:null`
- `schemaDiagnostic:null`
- `latencyBucket:gt_15s`
- `networkCallsMade:true`
- `productionReady:false`
- `hardBlockers:[]`
- `rawPromptPersisted:false`
- `rawModelResponsePersisted:false`
- `rawImagePersisted:false`
- `rawImagePathPersisted:false`
- `requestPayloadPersisted:false`

The D2J result means the local/private Windows server mapper can produce one candidate JSON object that passes the MacBook repo validator. It is not production approval and does not imply repeated reliability.

## Current Architecture Split

- Windows GPU machine: runs the operator-managed Qwen2.5-VL Transformers/FastAPI server outside this repo.
- MacBook repo: runs the backend sandbox client, schema validator, smoke gate, synthetic benchmark, and sanitized reporting.
- iOS/Xcode: unchanged; no direct model call, provider key, Camera cloud entry, upload payload change, or capture-context upload is added.

The Windows server code remains outside this iOS/backend repo unless a future phase explicitly approves an operator-tooling location. If the patched Windows `server.py` is valuable, preserve it manually or move it into a future approved ignored/operator-managed location. Do not commit raw server logs, model outputs, local config, fixture images, model weights, or secrets.

## Phase 20-E-B Expansion Gate

Phase 20-E-B may be planned only as a small backend-only local/private LAN evaluation:

- use 3 to 5 approved ignored fixtures
- use fixture IDs only
- keep the fixture registry ignored and local-only
- run at most one model call per fixture
- do not retry individual fixtures to chase pass rate
- use sanitized aggregate metrics only
- keep `productionReady:false`
- keep iOS untouched

Before any 20-E-B run:

- repo is clean and upstream-synced
- backend tests pass
- synthetic benchmark passes
- synthetic benchmark gate has no hard blockers
- local config dry-run is sanitized
- default local sandbox smoke passes in no-network mode
- local smoke gate has no hard blockers under ignored local config
- Windows `/healthz` reports reachable, model loaded, raw logging disabled, fixture registry available, and no public exposure
- contract echo passes after any Windows mapper change
- every fixture is approved, local-only, ignored, metadata-stripped, non-sensitive, and not staged/tracked

## Fixture Policy

Allowed:

- neutral objects, street/landscape/architecture/food/pet-style test images only when approved
- synthetic or self-created non-person images for local smoke if real neutral images are unavailable
- short fixture tokens such as `smoke_001`, `smoke_002`, `smoke_003`
- ignored local registry entries under `backend/config/open-weight-vlm.fixtures.local.json`

Not allowed:

- user/customer photos
- private or sensitive photos
- identifiable faces by default
- GPS/raw EXIF persistence
- raw image paths in logs or reports
- committed fixture images or fixture registry

## Metrics To Review

Allowed sanitized metrics:

- fixture count
- accepted count
- rejected count
- validation/fallback categories
- schema diagnostic buckets only
- safety pass/fail booleans
- latency buckets
- `networkCallsMade:true` only for the explicitly approved local/private LAN run
- raw artifact persistence flags
- `productionReady:false`

Forbidden report/log content:

- raw prompt
- raw model output
- raw image path
- image/base64
- request payload
- full model server URL or LAN IP
- credentials/tokens
- GPS/raw EXIF
- Windows server logs
- generated unsanitized reports

## Stop Conditions

Stop immediately if:

- any gate has a hard blocker
- contract echo fails after mapper changes
- Windows server is public, tunneled, cloud-hosted, or exposes unsafe routes
- raw prompt/model output/image path/base64/request payload appears in output
- any fixture/config/registry/report/log is staged or tracked
- any candidate includes score/rating, sensitive inference, chain-of-thought, provider/debug leakage, unsupported filter family, source-context overclaim, raw localization key, or UI prose
- any backend/iOS payload changes appear
- any iOS integration or Camera cloud entry appears
- `productionReady` becomes true

## Phase 21-G Local Model Route Approval Gate

Phase 21-G adds a no-network/no-model approval gate for any future `local_model` route review:

```sh
npm run qa:open-weight-vlm:local-model-route-approval
```

This gate does not approve another local smoke, does not enable `local_model`, does not call Qwen, does not run fixture inference, does not run serving benchmarks, and does not add iOS integration or endpoints. It keeps all Phase 20 local smoke stop conditions in force and also blocks production readiness, app-facing endpoints, production endpoints, user-photo upload, missing consent/retention/deletion policy, validator bypass, fallback bypass, free-form model text, score/rating, sensitive inference, chain-of-thought, debug/provider leakage, model calls, and Qwen inference.

## Phase 21-H Local Model Route Dry-run Plan

Phase 21-H adds:

```sh
npm run qa:open-weight-vlm:local-model-route-dry-run-plan
```

The gate does not approve another local smoke. It only records that a future first route test must be one declared synthetic local fixture token, one call only, no retries, backend-internal, local/private, structured candidate JSON only, validator/fallback protected, raw artifact policy locked, and `productionReady:false`.

## Phase 20-E-B Readiness

Completed for the first approved 3-fixture set. Phase 20-E-B was a small local/private LAN benchmark expansion, not a product integration.

## Phase 20-E-B2 Completed Smoke Record

Root cause of the initial `smoke_002` / `smoke_003` block:

- the external Windows server workspace exposed only `smoke_001`
- `smoke_002` and `smoke_003` were unavailable before inference
- the backend summarized those pre-inference HTTP failures as `blocked_for_provider_integration`
- the backend request contract, validator, and iOS boundary did not require changes

Sanitized health check after the fix:

- `ok:true`
- `modelLoaded:true`
- `modelFamily:qwen2.5-vl`
- `rawLoggingDisabled:true`
- `publicExposure:no`

Sanitized per-fixture results:

| fixtureIdBucket | acceptedCount | rejectedCount | validationCode | fallbackCategory | schemaDiagnostic | latencyBucket | networkCallsMade | productionReady |
| --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| `smoke_001` | 1 | 0 | `null` | `null` | none | `gt_15s` | `true` | `false` |
| `smoke_002` | 1 | 0 | `null` | `null` | none | `5s_to_15s` | `true` | `false` |
| `smoke_003` | 1 | 0 | `null` | `null` | none | `5s_to_15s` | `true` | `false` |

Sanitized aggregate:

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

Raw prompt, raw model output, raw image path, base64, request payload, local config contents, fixture registry contents, fixture images, generated reports, credentials, and server logs must remain out of git and docs.

## Phase 20-E-C Readiness

Phase 20-E-C is implemented as a backend-only repeatability/regression review gate. It is not production rollout.

## Phase 20-E-C Repeatability Gate

The repeatability gate evaluates sanitized local VLM smoke expansion aggregates only. It does not require raw model output, raw prompt, raw image path, base64, request payload, local config contents, fixture registry contents, fixture images, or server logs.

Run:

```sh
cd backend
npm run qa:open-weight-vlm:local-repeatability-gate
```

Equivalent direct command:

```sh
node scripts/check-open-weight-vlm-local-smoke-repeatability-gate.mjs --baseline
```

Reviewed fields:

- `fixtureCount`
- `acceptedCount`
- `rejectedCount`
- `acceptanceRate`
- `validationCodeCounts`
- `fallbackCategoryCounts`
- `schemaErrorBucketCounts`
- `schemaFieldBucketCounts`
- `latencyBucketCounts`
- `networkCallsMade`
- `productionReady`
- raw persistence flags

Gate categories:

- `pass_for_local_repeatability_review`
- `pass_with_latency_note`
- `blocked_for_schema_regression`
- `blocked_for_provider_integration`
- `blocked_for_raw_persistence`
- `blocked_for_unapproved_fixture`
- `blocked_for_production_flag`
- `not_production_ready`

The B2 baseline passes repeatability review with a latency note because one accepted result was `gt_15s`. Passing this gate only means the sanitized B2 aggregate remains reviewable. It does not approve iOS integration, app-facing endpoints, production endpoints, Camera cloud AI, payload changes, training/fine-tuning, or production rollout.

## Phase 20-E-D Readiness

Phase 20-E-D is implemented as a backend-only failure and latency taxonomy review. It is not production rollout.

## Phase 20-E-D Failure And Latency Taxonomy

The taxonomy evaluates sanitized local VLM smoke aggregates only. It does not require raw model output, raw prompt, raw image path, base64, request payload, local config contents, fixture registry contents, fixture images, or server logs.

Run:

```sh
cd backend
npm run qa:open-weight-vlm:local-failure-taxonomy
```

Equivalent direct command:

```sh
node scripts/check-open-weight-vlm-local-smoke-failure-taxonomy.mjs --sample=clean
```

Reviewed fields:

- `fixtureCount`
- `acceptedCount`
- `rejectedCount`
- `acceptanceRate`
- `validationCodeCounts`
- `fallbackCategoryCounts`
- `schemaErrorBucketCounts`
- `schemaFieldBucketCounts`
- `latencyBucketCounts`
- `networkCallsMade`
- `productionReady`
- raw persistence flags
- optional model/server availability buckets
- optional fixture readiness buckets

Pass / review categories:

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

Accepted `gt_15s` results are review notes. All accepted fixtures at `gt_15s` become a latency regression review note, not production readiness. Timeout or unavailable buckets block review. Phase 20-E-D did not run a larger fixture expansion or real Qwen smoke.

## Phase 20-E-E / 20-F Readiness

Phase 20-E-E is implemented in `docs/open-weight-vlm-local-sandbox-review-summary.md`.

The E-E summary records:

- what D2J through E-D proved
- what remains unproven
- the current gate inventory
- safety/privacy/product boundaries
- Windows-primary backend workflow
- MacBook/Xcode verification role
- Phase 20-F entry criteria
- recommended Phase 20-F option

Phase 20-F may start only after the repo is clean, upstream comparison is `0 0`, E-E is reviewed/committed/pushed, ignored local artifacts remain ignored, Windows server remains local/private, raw logging remains disabled, all existing gates pass, and the 20-F scope is explicitly chosen.

Recommended Phase 20-F direction: expanded fixture set planning plus fixture registry schema. Any future phase remains backend-only/local-private unless explicitly scoped otherwise, and production rollout remains blocked.

## Phase 20-F Expanded Fixture Registry Dry-run Gate

Phase 20-F implements the recommended expanded fixture planning step with:

- `docs/open-weight-vlm-expanded-fixture-registry-plan.md`
- `backend/src/qa/openWeightVlmExpandedFixtureRegistry.mjs`
- `backend/scripts/check-open-weight-vlm-expanded-fixture-registry.mjs`
- `npm run qa:open-weight-vlm:expanded-fixtures`

The dry-run gate validates sanitized registry metadata only. It does not require fixture images, read local config, call a model, make network calls, print raw paths/prompts/model outputs/request payloads, or mark production ready.

The target categories are `bright_daylight_clean`, `low_light_grain`, `motion_blur_intentional`, `severe_blur_reject`, `high_contrast_shadow`, `faded_color_retro`, `warm_indoor_ambient`, `street_chrome_high_contrast`, `soft_focus_dreamy`, `overexposed_unreadable`, `imported_limited_context`, and `black_or_near_black_unreadable`.

Phase 20-G controlled 6-8 fixture smoke is only conditionally ready after Phase 20-F is reviewed/committed/pushed, this dry-run gate passes, ignored local fixtures and registry are safely prepared, all existing gates pass, Windows healthz is safe, and the user explicitly approves real local/private model calls. Production rollout remains blocked.

## Phase 20-G Blocked Eight-fixture Smoke

Phase 20-G ran the approved controlled expanded local/private smoke once per eight approved fixture tokens. It stopped after the approved eight calls and did not retry.

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
- raw persistence flags all false

The repeatability gate and failure/latency taxonomy correctly blocked the aggregate. Treat this as a provider-integration / fixture-availability diagnostic result, not as a model-quality or schema-regression result. Phase 20-H is not ready until the local/private Windows server expanded fixture handling is diagnosed without raw artifact exposure.

## Phase 20-H Provider Diagnostic

Phase 20-H adds a no-network, no-model diagnostic gate for the Phase 20-G provider-integration block:

```sh
npm run qa:open-weight-vlm:expanded-fixture-provider-diagnostic
```

The diagnostic uses sanitized aggregate and availability buckets only. It reports the Phase 20-G pattern as a likely pre-inference local server fixture availability / routing mismatch and keeps another expanded real smoke blocked until a no-model contract-echo fixture-routing check passes. `productionReady:false` remains required.

## Phase 20-I Routing Echo

Phase 20-I added the no-model fixture routing contract echo route and backend CLI. It verified `smoke_001` through `smoke_008` route successfully with `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, and `productionReady:false`.

This satisfies the routing prerequisite for a future explicitly approved expanded real smoke retry, but it does not itself run Qwen or authorize production rollout.

## Phase 20-J Accepted Eight-fixture Retry

Phase 20-J ran the approved controlled expanded retry after the routing fix. The run made exactly eight local/private Qwen-backed calls, one per approved fixture token, with no retries and no extra fixtures.

Sanitized aggregate:

- `fixtureCount:8`
- `acceptedCount:8`
- `rejectedCount:0`
- `acceptanceRate:100%`
- no validation, fallback, or schema diagnostic buckets
- `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags false

The aggregate passed repeatability and failure/latency review with a latency note. It remains backend-only sandbox evidence and does not approve iOS integration or production rollout.

## Phase 20-K Result Review

Phase 20-K is review/planning only. The accepted Phase 20-J aggregate is interpreted in `docs/open-weight-vlm-expanded-smoke-result-review.md` as useful sandbox evidence with remaining coverage gaps.

The next recommended step is Phase 20-L: plan 12 total fixtures and add a no-model registry/routing gate before any future real smoke. Do not run more model calls, add fixture images, expand the real local registry, benchmark serving stacks, start iOS integration, add app-facing or production endpoints, or change `productionReady:false` without explicit future approval.

## Phase 20-L 12-Fixture Registry Gate

Phase 20-L adds that no-model registry gate. The expanded fixture dry-run now targets exactly 12 planned categories and reports `totalTargetFixtures:12`, `requiredCategories`, category coverage, missing required categories, `networkCallsMade:false`, and `productionReady:false`.

The four planned additions beyond the Phase 20-J eight are `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`. An 8-category registry should fail eligibility with those missing categories, but without model calls or raw artifact output.

## Phase 20-M 12-Fixture Prep Gate

Phase 20-M prepares the ignored local fixture set and verifies no-model routing for 12 approved tokens. The registry dry-run must pass with `approvedCount:12`, `blockedCount:0`, no missing required categories, `networkCallsMade:false`, and `productionReady:false`. The routing echo must pass with `routeableCount:12`, `modelInferenceRun:false`, raw persistence flags false, and `productionReady:false`.

Do not treat this as approval for real smoke; Phase 20-N still requires explicit user approval and fresh gates.

## Phase 20-N Controlled 12-Fixture Smoke

Phase 20-N is the explicitly approved real local/private smoke. It must run exactly 12 calls, one per approved ignored fixture token `smoke_004` through `smoke_015`, with no retries, no extra fixtures, and `productionReady:false`.

Sanitized Phase 20-N result:

- `fixtureCount:12`
- `acceptedCount:12`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x12`
- `fallbackCategoryCounts:null x12`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:gt_15s x10, 5s_to_15s x2`
- `networkCallsMade:true`
- raw prompt/model response/image/image path/request payload persisted flags false

This remains backend-only and does not approve iOS integration, app-facing endpoints, production endpoints, or production rollout.

## Phase 20-O Serving Benchmark Decision

Phase 20-O is review/decision only. It records the accepted 12-fixture result, interprets `gt_15s x10` as a significant sandbox latency note, and recommends Phase 20-P as serving-stack benchmark preflight only.

Do not run real model smoke, vLLM/SGLang/Ollama benchmarks, model-stack switches, fixture expansion, iOS integration, app-facing endpoints, production endpoints, or production rollout from Phase 20-O.

## Phase 20-P Serving Benchmark Preflight

Phase 20-P adds a no-network serving benchmark preflight gate:

```sh
npm run qa:open-weight-vlm:serving-benchmark-preflight
```

The gate validates future benchmark planning only and must report `networkCallsMade:false`, `benchmarkRun:false`, `qwenInferenceRun:false`, `eligibleForPhase21EntryReview:true`, `eligibleForBenchmarkExecution:false`, and `productionReady:false`.

This gate does not replace the local smoke, repeatability, failure taxonomy, expanded registry, provider diagnostic, or routing echo gates. It does not run Qwen inference, real smoke, serving benchmarks, model-stack switches, iOS integration, endpoints, or production rollout.

## Phase 21-A Backend Internal Gateway Contract Preflight

Phase 21-A adds a no-network/no-model backend-internal gateway contract gate:

```sh
npm run qa:open-weight-vlm:gateway-contract-preflight
```

The gate validates only sanitized internal request metadata and structured candidate JSON response shape. Existing validator/safety gates remain authoritative. It does not accept real user photos, raw image/base64/path/prompt/provider responses, iOS direct provider fields, app-facing endpoints, production endpoints, model calls, serving benchmarks, or production readiness.

## Phase 21-B Backend Internal Gateway Adapter Stub

Phase 21-B adds:

```sh
npm run qa:open-weight-vlm:gateway-adapter-stub
npm run qa:open-weight-vlm:gateway-external-contract-echo
```

The adapter stub is backend-internal and fixture-token sandbox only. It maps a sanitized internal request into structured candidate JSON, validates through the existing schema/safety chain, and returns sanitized aggregate pass/fail state only. The external echo command is local/private and no-model only; it validates healthz and `/local/vlm/gateway-contract-echo` compatibility without Qwen inference, fixture image inference, benchmarks, raw logs, raw paths, raw prompts, request payload printing, or production readiness.

Phase 21-B does not add iOS integration, app-facing endpoints, production endpoints, real user-photo uploads, consent UI, serving benchmark execution, model-stack switching, training/fine-tuning, or production rollout. `productionReady:false` remains required.

Phase 21-C adds a backend-internal provider routing dry-run gate only. It keeps `local_stub` and `local_contract_echo` as the only allowed backend-internal routes and blocks `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes. The dry-run remains sanitized, no-network, no-model, and `productionReady:false`.

## Phase 21-D / 21-E No-model And Deployment Boundary

Phase 21-D adds a no-model HTTP check for the allowed `local_contract_echo` route only. It validates local/private healthz and `/local/vlm/gateway-contract-echo`, requires structured candidate JSON through the existing validator/safety chain, and keeps raw persistence flags false and `productionReady:false`.

Phase 21-E adds the cross-platform deployment boundary gate:

```sh
npm run qa:open-weight-vlm:cross-platform-boundary
```

The gate is no-network/no-model. It confirms Windows local paths and local model URLs stay docs/operator/ignored-example/test-sandbox only; MacBook/Xcode does not depend on Windows paths or model server URLs; future production config uses env/secrets/config instead of committed local paths or LAN URLs; iOS never calls model/provider routes directly; and no Camera cloud entry, upload payload change, app-facing endpoint, production endpoint, raw artifact policy allowance, or `productionReady:true` is introduced.

## Phase 21-F Config / Env Preflight

Phase 21-F adds:

```sh
npm run qa:open-weight-vlm:deployment-config-env-preflight
```

The gate is no-network/no-model/no-benchmark. It validates only sanitized deployment policy buckets and blocks committed secrets, provider/model keys, runtime local paths, unsafe provider URLs, raw logging, endpoint flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmark execution, and `productionReady:true`. It does not approve real model smoke, fixture inference, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, auth/billing/quota runtime, or production rollout.
