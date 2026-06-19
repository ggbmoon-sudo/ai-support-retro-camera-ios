# Phase 21-W-GOAL-R2-R2 - Local Model Unavailable After Runtime Readiness

Date: 2026-06-19

## Executive Summary

Phase 21-W-GOAL-R2-R2 diagnosed why Phase 21-W-GOAL-R2 returned `local_model_unavailable x12` even after healthz reported `modelLoaded:true`.

The primary root cause bucket is `fixture_lookup_mismatch`: the external no-model contract allowlist accepts `smoke_004` through `smoke_015`, but the real route still performs a separate fixture lookup/image-readiness path. Token-only external diagnostics showed those 12 approved benchmark tokens are not routeable in the external server workspace.

The secondary fix bucket is `local_model_client_error_mapping_too_broad`: the backend benchmark wrapper previously collapsed every HTTP non-OK response to `local_model_unavailable`. It now preserves sanitized HTTP error buckets such as `fixture_not_available`, `missing_fixture_token`, `unsupported_fixture_token`, and `route_not_found`.

No model call, benchmark, real inference endpoint call, fixture inference, fixture image open, OCR, EXIF/GPS/sensor inspection, Qwen inference, Qwen3-VL-30B-A3B use, serving switch, iOS runtime change, raw artifact, secret, or production rollout occurred.

`productionReady:false`

## R2 Starting Point

- Healthz result: `safe`
- `modelLoaded:true`
- External no-model contract checker: pass
- Backend contract echo validation: pass
- Benchmark executed in R2: yes
- R2 call count: `12`
- R2 retry count: `0`
- R2 accepted count: `0`
- R2 rejected count: `12`
- R2 validation bucket: `local_model_unavailable x12`
- R2 fallback bucket: `blocked_for_provider_integration x12`
- R2 latency bucket: `lt_1s x12`

## No-model Readiness Recheck

- External no-model checker: pass
- Approved token count: `13`
- Unsupported token bucket: `unsupported_fixture_token`
- Missing token bucket: `missing_fixture_token`
- Backend no-model contract echo validation: pass
- Backend healthz preflight: `safe`
- Healthz model loaded: `true`
- Healthz public exposure: `no`
- Healthz raw logging disabled: `true`

## Diagnosis

Compared paths:

- Backend benchmark wrapper sends `fixtureId` with the same request shape for each approved token.
- External contract echo accepts approved tokens through `fixture_contract_status`.
- External real route calls `open_request_image`, which performs registry/file routeability checks before model inference.
- External real route failures were previously returned as generic HTTP non-OK responses.
- Backend benchmark wrapper mapped HTTP non-OK responses to `local_model_unavailable`.

Root cause buckets:

- Primary: `fixture_lookup_mismatch`
- Secondary: `local_model_client_error_mapping_too_broad`
- Live dry-run blocker: `external_http_error_mapping_too_ambiguous`

The live dry-run blocker occurred because the currently running external server process had not loaded the newly added no-model dry-run endpoint, so the backend CLI received `route_not_found`. The external in-process checker validated the new endpoint code without a server restart.

## External Fix

External workspace changes:

- Added `/local/vlm/benchmark-route-contract-dry-run`.
- Added `check_route_contract_dry_run.py`.
- Aligned real route token validation with the contract echo token parser before image lookup.
- Aligned image lookup to use the shared fixture token extractor.
- Added explicit `fixture_not_available` route bucket.
- Adjusted sanitized HTTP exception mapping so known fixture/contract details are not collapsed to generic route errors.

External dry-run checker result:

- `routeContractDryRun:true`
- `approvedFixtureCount:12`
- `acceptedDryRunCount:12`
- `unsupportedBucket:unsupported_fixture_token`
- `missingBucket:missing_fixture_token`
- `fixtureRouteabilityBuckets: fixture_not_available x12`
- `modelCallExecuted:false`
- `inferenceEndpointCalled:false`
- `benchmarkRun:false`
- `productionReady:false`

## Backend Fix

Backend changes:

- Added `openWeightVlmBenchmarkRouteContractDryRun.mjs`.
- Added `check-open-weight-vlm-benchmark-route-contract-dry-run.mjs`.
- Added `benchmark-route-contract-dry-run.test.mjs`.
- Added npm script `qa:open-weight-vlm:benchmark-route-contract-dry-run`.
- Updated the guarded controlled benchmark wrapper to preserve sanitized HTTP error buckets instead of flattening every HTTP non-OK response to `local_model_unavailable`.
- Added tests for request shape, explicit bucket validation, ambiguous bucket blocking, fixture lookup mismatch, and preserved HTTP error buckets.

Backend live dry-run result:

- `routeContractDryRunEligible:false`
- `acceptedDryRunCount:0`
- `unsupportedBucket:route_not_found`
- `missingBucket:route_not_found`
- `rootCauseBucket:external_http_error_mapping_too_ambiguous`
- `modelCallExecuted:false`
- `inferenceEndpointCalled:false`
- `benchmarkRun:false`
- `productionReady:false`

This is a safe no-model blocker and indicates the running external process needs the new dry-run endpoint available before a future retry. No benchmark was rerun.

## Verification

- External syntax AST parse: passed.
- External `check_fixture_token_contract.py`: passed.
- External `check_route_contract_dry_run.py`: passed.
- Backend targeted tests: passed.
- Backend benchmark route dry-run CLI: blocked safely with `route_not_found` from the currently running server.
- No model call: yes.
- No benchmark: yes.
- No real inference endpoint call: yes.
- No fixture inference: yes.
- No raw artifact or secret: yes.

## Next Recommended Phase

Phase 21-W-GOAL-R2-R2A: Route Contract Dry-run Follow-up

This follow-up should make the live external server process expose the new no-model dry-run endpoint and then rerun only the no-model dry-run checks. Any model call or benchmark retry still requires separate explicit user approval.
