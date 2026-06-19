# Phase 21-W-FINAL-R2: Controlled 12-fixture Benchmark Final Result

Date: 2026-06-19

## Executive Summary

Phase 21-W reached a final controlled benchmark result. Codex restored the existing local/private Transformers+FastAPI reference runtime, repaired the remaining live fixture routeability mismatch using only ignored local runtime artifacts, confirmed healthz and live no-model route-contract dry-run, then ran exactly one approved controlled 12-fixture benchmark.

Sanitized aggregate result:

- `benchmarkKind`: `controlled_multifixture_serving_benchmark`
- `servingStackClass`: `transformers_fastapi_reference`
- `modelClass`: `qwen_vlm_compatible`
- `futureTargetCandidate`: `qwen3_vl_30b_a3b`
- `fixtureCount`: `12`
- `callCount`: `12`
- `retryCount`: `0`
- `acceptedCount`: `12`
- `rejectedCount`: `0`
- `blockedCount`: `0`
- `validationCodes`: `null x12`
- `fallbackCategories`: `null x12`
- `latencyBuckets`: `gt_15s x1`, `5s_to_15s x11`
- `productionReady`: `false`

## What Codex Did

- Reconfirmed external static no-model fixture-token contract: `approvedTokenCount:13`, explicit `unsupported_fixture_token` and `missing_fixture_token`, no inference endpoint call, no benchmark, `productionReady:false`.
- Reconfirmed external static route-contract dry-run after local runtime fixture repair: `acceptedDryRunCount:12`, `approvedFixtureCount:12`, `fixtureRouteabilityBuckets:routeable x12`.
- Restarted the existing local/private Transformers+FastAPI reference server through the external workspace venv.
- Mirrored the approved ignored fixture runtime files and metadata for `smoke_004` through `smoke_015` into the external ignored server workspace.
- Confirmed backend healthz `safe` with `modelLoaded:true`, `modelFamilyBucket:qwen_vlm_compatible`, raw logging disabled, and public exposure `no`.
- Confirmed backend live route-contract dry-run: `acceptedDryRunCount:12`, `fixtureRouteabilityBuckets:routeable x12`, `modelReadinessBuckets:model_loaded x12`, `rootCauseBucket:route_contract_ready`.
- Ran exactly one controlled benchmark with the approved 12 fixtures, call count `12`, retry count `0`.

## Root Cause Fixed

The previous live runtime blocker had two safe buckets:

- `server_not_running` / `connection_refused`: resolved by launching the existing local/private FastAPI server directly with the external workspace virtual environment.
- `fixture_lookup_mismatch`: resolved by making the external ignored runtime registry and local ignored fixture files routeable for the approved 12 benchmark fixtures.

No raw image contents, raw image paths, local config contents, fixture registry contents, prompts, model outputs, request payloads, server URLs, server logs, EXIF/GPS/sensor data, credentials, or secrets were printed or committed.

## Approved Fixture Set

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

The benchmark did not include `smoke_001`, did not add fixtures, did not substitute fixtures, and did not retry.

## Per-fixture Sanitized Rows

| Fixture | Accepted | Validation bucket | Fallback bucket | Latency bucket |
| --- | --- | --- | --- | --- |
| `smoke_004` | yes | `null` | `null` | `gt_15s` |
| `smoke_005` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_006` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_007` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_008` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_009` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_010` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_011` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_012` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_013` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_014` | yes | `null` | `null` | `5s_to_15s` |
| `smoke_015` | yes | `null` | `null` | `5s_to_15s` |

Each sanitized row kept `rawOutputPersisted:false`, `rawOutputPrinted:false`, `rawPromptPersisted:false`, `rawPromptPrinted:false`, `rawPayloadPersisted:false`, and `rawPayloadPrinted:false`.

## Boundary Confirmations

- Current path remained the existing Transformers+FastAPI local/private Qwen VLM reference path.
- Qwen3-VL-30B-A3B remains a future target candidate only; it was not installed, downloaded, loaded, benchmarked, or called.
- No vLLM, SGLang, Ollama, or LM Studio endpoint was called.
- No serving stack switch, model switch, quantization benchmark, concurrency benchmark, or Live Advisor simulation occurred.
- No app-facing endpoint, production endpoint, iOS integration, Camera cloud AI runtime entry, Auto-Trigger runtime, WSS runtime, upload runtime, or iOS upload payload change was added.
- No raw artifacts, local configs, fixture registries, model outputs, prompts, payloads, server logs, server URLs, secrets, or credentials were committed.
- `productionReady:false` remains locked.

## Next Recommended Phase

`Phase 21-X: Controlled 12-fixture Benchmark Review + Latency Decision Gate`

This next phase should review the accepted aggregate result and latency buckets before any serving-stack comparison, quantization run, vLLM/SGLang experiment, Live Advisor simulation, iOS integration, endpoint addition, or production rollout.
