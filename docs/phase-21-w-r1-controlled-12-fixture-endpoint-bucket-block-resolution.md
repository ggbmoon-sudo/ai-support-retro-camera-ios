# Phase 21-W-R1: Controlled 12-fixture Endpoint Bucket Block Resolution

Status: fixed endpoint bucket policy mismatch  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-W-R1 diagnosed and fixed the Phase 21-W preflight blocker bucket `blocked_for_unsafe_endpoint_bucket`.

The root cause was a sanitized endpoint bucket naming mismatch: the local config parser reports concrete buckets such as `local_loopback_ip`, `local_loopback_name`, and `private_lan_ipv4`, while the controlled multi-fixture wrapper was checking only normalized buckets `local_loopback` and `private_lan`.

The fix normalizes controlled benchmark endpoint buckets before policy evaluation, matching the healthz preflight behavior while keeping unsafe/public endpoint classes blocked.

No model call, benchmark call, fixture inference, inference endpoint call, serving runtime change, serving-stack switch, external server change, iOS runtime change, raw artifact, or production rollout occurred.

## Phase 21-W Blocked Result Recap

- Healthz preflight before Phase 21-W attempt: `safe`
- Endpoint called in Phase 21-W: healthz only
- Inference/model call executed: no
- Benchmark executed: no
- Actual call count: `0`
- Retry count: `0`
- Accepted count: `0`
- Rejected count: `0`
- Blocked count: `1`
- Blocker bucket: `blocked_for_unsafe_endpoint_bucket`
- Production readiness: `productionReady:false`

## Sanitized Root Cause

- Local config parser bucket: concrete local/private bucket, e.g. `local_loopback_ip`
- Healthz preflight bucket: normalized safe bucket, e.g. `local_loopback`
- Controlled wrapper before fix: accepted only normalized bucket names
- Controlled wrapper after fix: normalizes concrete config buckets before deciding safe/unsafe

No raw endpoint URL or raw local config was printed.

## Fixed Policy

The controlled multi-fixture wrapper now normalizes these safe buckets:

- `local_loopback_name` -> `local_loopback`
- `local_loopback_ip` -> `local_loopback`
- `loopback` -> `local_loopback`
- `private_lan_ipv4` -> `private_lan`
- `approved_private_lan` -> `private_lan`

Allowed normalized buckets remain only:

- `local_loopback`
- `private_lan`

The policy still blocks:

- Public IP buckets
- Public domain buckets
- Ngrok/tunnel/cloud buckets
- Credentialed URL buckets
- Query-string or secret-bearing URL buckets
- `0.0.0.0`
- Missing or unknown endpoint buckets

Private LAN still requires explicit local opt-in via the ignored local config policy.

## Strategic Model Context

- Current reference path: existing Transformers+FastAPI local/private Qwen VLM sandbox
- Future target candidate: `Qwen3-VL-30B-A3B`
- Model upgrade/benchmarking is a later separately approved phase
- Phase 21-W-R1 did not switch, install, download, load, benchmark, or call `Qwen3-VL-30B-A3B`

The current blocker was endpoint bucket classification alignment, not model quality.

## Verification Summary

- Focused controlled wrapper tests passed.
- Bucket normalization tests passed for local loopback and private LAN buckets.
- Unsafe endpoint bucket tests passed for public IP/domain, tunnel, credentialed URL, query-string secret, and `0.0.0.0` cases.
- Private LAN opt-in test passed.
- Sanitized current config bucket comparison showed the controlled wrapper now allows the normalized local loopback bucket.

Final full verification is recorded in task closeout.

## Boundary Confirmations

- Model call executed: no
- Benchmark executed: no
- Fixture inference executed: no
- Inference endpoint called: no
- 12-fixture benchmark command rerun: no
- vLLM/SGLang/Ollama called: no
- Serving stack switched: no
- External server restarted or modified: no
- Server prompt/mapper/model behavior patched: no
- iOS integration added: no
- App-facing endpoint added: no
- Production endpoint added: no
- Camera live cloud AI runtime entry added: no
- Auto-Trigger runtime added: no
- WSS runtime added: no
- Upload runtime added: no
- Raw prompt/model output/payload/image path/base64/server URL/server logs/config/registry/secrets printed: no
- Production readiness: `productionReady:false`

## What Remains Blocked

The controlled 12-fixture benchmark remains blocked until the user gives separate explicit approval for a retry phase. Phase 21-W-R1 does not approve model calls.

## Next Recommended Phase

Phase 21-W-R1B: Approved Controlled 12-fixture Benchmark Retry After Endpoint Bucket Fix.

Phase 21-W-R1B requires separate explicit user approval before any model calls.
