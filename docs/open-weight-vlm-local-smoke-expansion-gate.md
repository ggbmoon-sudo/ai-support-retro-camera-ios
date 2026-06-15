# Open-weight VLM Local Smoke Expansion Gate

Status: Phase 20-E-A gate-prep
Date: 2026-06-16
Phase: 20-E-A

## Purpose

Phase 20-E-A records the first accepted Qwen-backed private LAN local VLM smoke and defines the conservative gate for a future Phase 20-E-B small fixture expansion.

This document does not approve iOS integration, an app-facing endpoint, a production endpoint, Camera cloud AI, training/fine-tuning, or production rollout. `productionReady:false` remains required.

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

Ready for planning only. Phase 20-E-B should be a small local/private LAN benchmark expansion, not a product integration. It should not start until explicitly requested.
