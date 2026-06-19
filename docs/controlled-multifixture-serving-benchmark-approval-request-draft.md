# Controlled Multi-fixture Serving Benchmark Approval Request Draft

Status: Phase 21-V approval-request draft only  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Purpose

Phase 21-V creates a formal approval request draft for a possible future controlled multi-fixture Transformers+FastAPI serving benchmark.

Phase 21-V does not run a model call, does not run Qwen inference, does not run fixture inference, does not run a benchmark, does not call a serving endpoint, does not start a serving runtime, does not switch serving stacks, and does not add iOS integration or endpoints.

Any future controlled multi-fixture benchmark requires separate explicit user approval.

## Why This Exists After Phase 21-U

Phase 21-U proved that one local/private Transformers+FastAPI reference path can return an accepted structured result for fixture `smoke_001`.

Phase 21-U does not prove production readiness because:

- Only one fixture was benchmarked.
- No controlled multi-fixture benchmark was run.
- No concurrency benchmark was run.
- No quantization benchmark was run.
- No vLLM or SGLang benchmark was run.
- No Live Advisor 1 FPS simulation was run.
- Latency remained `gt_15s`, which is still a production/live-readiness blocker.
- No iOS integration exists.
- No app-facing or production endpoint exists.

The next benchmark, if approved later, should remain controlled, explicit, and small enough to stop safely.

## Proposed Future Benchmark Scope

The first controlled multi-fixture benchmark should stay on the reference path unless the user explicitly chooses a different stack in a later phase.

- Serving stack: `transformers_fastapi_reference`
- Benchmark kind: `controlled_multifixture_serving_benchmark`
- Fixture tokens: explicit approved ignored local fixture tokens only
- Fixture count: exact count required in the approval text
- Call count: exactly one call per approved fixture
- Retry count: `0` unless separately approved
- Healthz required: yes
- Endpoint class: local/private only
- Raw output persisted: false
- Raw output printed: false
- Raw prompt/payload persisted or printed: false
- Report: sanitized aggregate only
- Production readiness: `productionReady:false`

Codex must not infer fixture tokens from memory. For any future execution phase, Codex must read the ignored local fixture registry and report only sanitized fixture-token buckets/counts. The user approval must explicitly name the fixture tokens or explicitly approve the current approved controlled set.

## Approval Phrase Options

Safer pilot option:

```text
批准跑 Phase 21-W 一次 Transformers+FastAPI controlled 3-fixture serving benchmark，fixtures=<explicit approved tokens>，call count=3，retry=0
```

Larger controlled option:

```text
批准跑 Phase 21-W 一次 Transformers+FastAPI controlled 12-fixture serving benchmark，fixtures=<explicit approved tokens>，call count=12，retry=0
```

The 3-fixture pilot is the safer next execution option because Phase 21-U latency remained `gt_15s`.

## Explicit Blocks

Do not run or approve any of the following in Phase 21-V:

- Benchmark execution without explicit future approval.
- Any fixture not in the approved ignored local registry.
- Any fixture count mismatch.
- Any retry unless separately approved.
- vLLM benchmark.
- SGLang benchmark.
- Quantization benchmark.
- Live Advisor 1 FPS simulation.
- Concurrency benchmark.
- Serving stack switch.
- Production route enablement.
- iOS integration.
- App-facing endpoint.
- Production endpoint.
- Upload runtime.
- Auto-Trigger runtime.
- WSS runtime.
- Raw artifacts, logs, prompts, request payloads, or model outputs.

## Required Future Stop Conditions

A future Phase 21-W execution prompt must stop before any model call if:

- The repo is dirty or not upstream-synced.
- The exact explicit fixture tokens are missing from approval text and the user did not explicitly approve the current approved controlled set.
- Any fixture is missing, unapproved, tracked, staged, or not ignored.
- Healthz is unsafe or unavailable.
- The call count does not equal the approved fixture count.
- Retry count is not `0`, unless separately approved.
- Raw logging/persistence is enabled.
- `productionReady:true` appears anywhere in the execution plan.

## Production Boundary

`productionReady:false` remains locked. This draft does not approve production rollout, app-facing endpoints, iOS integration, Camera cloud AI runtime, Auto-Trigger runtime, WSS runtime, upload runtime, serving-stack switch, model downloads, quantization, or Live Advisor simulation.
