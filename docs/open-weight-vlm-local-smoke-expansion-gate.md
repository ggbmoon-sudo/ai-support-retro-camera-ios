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
