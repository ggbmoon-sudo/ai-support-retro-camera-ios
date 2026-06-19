# Phase 21-W-R2 Controlled Multi-fixture Benchmark Rejection Diagnostics

Status: Implemented
Date: 2026-06-19
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-W-R2 diagnosed the Phase 21-W-R1B controlled 12-fixture rejection path without running model calls, benchmark calls, fixture inference, or inference endpoint calls.

The likely failure layer is `external_route_error_mapping_or_fixture_token_contract`. The controlled wrapper reached the local/private route during W-R1B, but all 12 fixture calls returned `local_model_unavailable` / `blocked_for_provider_integration` with latency bucket `lt_1s`. In the app repo code path, this pair is emitted before JSON parsing and before schema validation when the fetch fails or the HTTP response is non-OK.

This is probably not a model-quality failure: all 12 rows failed in `lt_1s`, no accepted rows were produced, and the rejection bucket is provider-integration/local-model availability rather than schema/content validation.

## Phase 21-W-R1B Summary

- Serving stack: `transformers_fastapi_reference`
- Fixture set: `smoke_004` through `smoke_015`
- Fixture count: `12`
- Call count: `12`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `12`
- Validation bucket: `local_model_unavailable x12`
- Fallback bucket: `blocked_for_provider_integration x12`
- Latency bucket: `lt_1s x12`
- Endpoint bucket normalization: confirmed
- Raw prompt/output/payload persisted or printed: `false`
- `productionReady:false`

## Phase 21-U Versus W-R1B Comparison

| Area | Phase 21-U accepted path | Phase 21-W-R1B rejected path | Diagnostic interpretation |
| --- | --- | --- | --- |
| Serving stack | `transformers_fastapi_reference` | `transformers_fastapi_reference` | Serving stack switch ruled out |
| Fixture scope | `smoke_001` | `smoke_004` through `smoke_015` | Difference is fixture-token set |
| Call count | `1` | `12` | W-R1B was not dry-run/no-network |
| Retry count | `0` | `0` | Retry expansion ruled out |
| Endpoint bucket | local/private safe | local/private safe after normalization | Endpoint bucket mismatch ruled out |
| Result | accepted | all rejected | Failure is controlled path specific |
| Latency | `gt_15s` | `lt_1s x12` | W-R1B likely failed before model inference |
| Validation/fallback | `null` / `null` | `local_model_unavailable` / `blocked_for_provider_integration` | Fetch/non-OK mapping path, not schema validator path |

## Emitting Component Buckets

Sanitized code-path review found the bucket pair is emitted by:

- `controlled_multifixture_wrapper_fetch_or_http_non_ok_mapping`
- `local_sandbox_client_uses_same_mapping_for_fetch_or_http_non_ok`
- `schema_validator_not_reached_for_local_model_unavailable_bucket`

## Likely Failure Layer

`external_route_error_mapping_or_fixture_token_contract`

The controlled wrapper constructs the same local FastAPI request schema shape but sends each approved controlled fixture token as `fixtureId`. Since Phase 21-U accepted `smoke_001` using the local config fixture path, while W-R1B rejected all controlled tokens quickly, the likely issue is a fixture-token contract/support mismatch at the external local route or an HTTP non-OK route response that the wrapper maps to `local_model_unavailable`.

## Possible Root Causes

- `external_server_fixture_token_contract_mismatch`
- `external_route_returned_http_non_ok_for_controlled_fixture_tokens`
- `controlled_wrapper_maps_fetch_or_http_non_ok_to_local_model_unavailable`
- `server_can_report_safe_healthz_while_fixture_inference_route_rejects_tokens`

## Ruled Out Causes

- `serving_stack_switch`
- `endpoint_bucket_policy_mismatch`
- `retry_expansion`
- `fixture_count_mismatch`
- `controlled_wrapper_dry_run_no_network_path`
- `response_schema_validation_failure_after_json_parse`
- `model_quality_or_slow_generation_failure`

## Next Safe Action

Recommended next phase:

`Phase 21-W-R2C: External Server Fixture-token Contract Fix`

Phase 21-W-R2C should align the external local server fixture-token contract or route-error mapping without running a benchmark by default. Any later controlled benchmark retry still requires separate explicit user approval.

Another immediate benchmark retry is not justified now because the current sanitized evidence points to a contract/route mapping failure, not a model-quality or latency benchmark result.

## Future Target Model Note

`Qwen3-VL-30B-A3B` remains a future target candidate only. It was not installed, downloaded, loaded, benchmarked, called, or switched to in Phase 21-W-R2.

## Boundary Confirmations

- Model call executed: no
- Benchmark executed: no
- Inference endpoint called: no
- Fixture inference executed: no
- Healthz called: no
- vLLM/SGLang/Ollama called: no
- Serving stack switched: no
- External server modified: no
- iOS runtime changed: no
- App-facing endpoint added: no
- Production endpoint added: no
- Auto-Trigger runtime added: no
- WSS runtime added: no
- Upload runtime added: no
- Raw prompt/output/payload/image path/config/registry/server URL/log/secrets committed: no
- `productionReady:false`
