# Phase 21-W-R2C External Server Fixture-token Contract Fix

Date: 2026-06-19

## Executive Summary

Phase 21-W-R2C fixed the external Windows FastAPI server fixture-token contract and no-model route-error mapping for the existing Transformers+FastAPI Qwen VLM reference path.

No model call, benchmark, fixture inference, inference endpoint call, Qwen inference, vLLM/SGLang/Ollama call, model download, serving-stack switch, iOS integration, endpoint addition, raw artifact persistence, secret exposure, or production rollout occurred.

`productionReady:false` remains locked.

## W-R2 Diagnosis Summary

Phase 21-W-R2 found the W-R1B all-12 `local_model_unavailable` / `blocked_for_provider_integration` rejection pattern most likely belongs to `external_route_error_mapping_or_fixture_token_contract`.

The W-R1B calls failed in the `lt_1s` bucket before backend JSON parsing/schema validation, making model quality unlikely as the immediate failure layer.

## External Contract Fix

The external FastAPI server now supports a no-model approved fixture-token contract for:

- `smoke_001`
- `smoke_004`
- `smoke_005`
- `smoke_006`
- `smoke_007`
- `smoke_008`
- `smoke_009`
- `smoke_010`
- `smoke_011`
- `smoke_012`
- `smoke_013`
- `smoke_014`
- `smoke_015`

The no-model contract paths accept `fixtureId`, `fixtureToken`, or `fixture` request keys, normalize them to the same approved token policy, and return deterministic schema-shaped candidate JSON for approved tokens.

Unsupported or missing fixture tokens fail closed with sanitized buckets:

- `missing_fixture_token`
- `unsupported_fixture_token`
- `route_not_found`
- `method_not_allowed`
- `contract_echo_disabled`
- `provider_integration_blocked`

The contract echo path does not open fixture images, inspect EXIF/GPS/sensor data, load the model, run inference, print prompts, print model output, print raw payloads, or expose server URLs.

## Verification

External workspace verification:

- External server AST syntax parse passed.
- No-model fixture-token contract check passed.
- Contract check result: `fixtureTokenContractCheck:pass`
- Approved token count: `13`
- Model loaded: `false`
- Inference endpoint called: `false`
- Benchmark run: `false`
- Raw leakage detected: `false`

Main repo verification:

- No iOS runtime files changed.
- No app-facing endpoint was added.
- No production route was enabled.

## Strategic Model Boundary

`Qwen3-VL-30B-A3B` remains a future target candidate only. It was not installed, downloaded, loaded, benchmarked, called, or selected in Phase 21-W-R2C.

## Next Recommended Phase

`Phase 21-W-R2C2: Backend No-model Contract Echo Validation Against External Server`

Phase 21-W-R2C2 may call a no-model contract echo endpoint only. It must not run model inference or any serving benchmark. Any benchmark/model-call retry after that still requires separate explicit approval.
