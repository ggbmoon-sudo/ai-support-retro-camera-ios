# Open-weight VLM Local Sandbox Review Summary

Status: Phase 20-E-E review / planning gate
Date: 2026-06-16
Scope: backend-only local/private VLM sandbox review

## Executive Summary

Phase 20-E proved that the backend sandbox can safely evaluate a local/private Windows Qwen2.5-VL Transformers/FastAPI server through the existing Photo Advisor VLM candidate contract. It proved one accepted local smoke, a 3-fixture accepted expansion, and one accepted 3-fixture repeat run, all with sanitized metrics and `productionReady:false`.

This is not production readiness. The work did not add iOS integration, an app-facing endpoint, a production endpoint, real user-photo upload, consent UI, quota/billing, retention/deletion policy implementation, large fixture coverage, serving-stack comparison, throughput testing, fine-tuning, or on-device model work.

Recommended Phase 20-F direction: **Option A - Expanded Fixture Set Planning + Fixture Registry Schema**. The next useful step is better dataset coverage before vLLM/SGLang benchmarking or iOS integration.

## Completed Milestones

### Phase 20-D2J

- Windows FastAPI Qwen2.5-VL mapper aligned with the backend candidate schema.
- Contract echo passed before the Qwen-backed smoke.
- First accepted Qwen-backed local/private smoke completed with one approved fixture.
- `productionReady:false`.
- Raw prompt, model output, image/base64/path, and request payload were not persisted.

### Phase 20-E-A

- Accepted local VLM smoke and expansion gate recorded.
- Documentation-only repo update.
- Defined conservative small expansion rules: approved ignored fixtures, fixture IDs only, one call per fixture, sanitized aggregate metrics only, no retry loops, and `productionReady:false`.

### Phase 20-E-B1

- Windows local VLM config/path handling fixed with `fileURLToPath(...)`.
- Ignored local config loading works on Windows.
- Validator and schema rules were not weakened.

### Phase 20-E-B2

- `smoke_001`, `smoke_002`, and `smoke_003` each ran exactly once.
- Aggregate: `fixtureCount:3`, `acceptedCount:3`, `rejectedCount:0`, `acceptanceRate:100%`.
- Latency buckets: `gt_15s x1`, `5s_to_15s x2`.
- No schema diagnostics and no fallback categories.
- `productionReady:false`.
- Raw persistence flags remained false.

### Phase 20-E-C

- Repeatability gate added.
- One repeat smoke ran per approved fixture.
- Aggregate: `fixtureCount:3`, `acceptedCount:3`, `rejectedCount:0`.
- Latency buckets: `5s_to_15s x3`.
- Repeatability gate passed.
- B2 baseline still passes with a latency note.
- `productionReady:false`.

### Phase 20-E-D

- Failure and latency taxonomy gate added.
- No real model smoke and no larger fixture expansion.
- Taxonomy covers schema regression, provider integration block, raw persistence, fixture readiness, unapproved fixture count, server unavailable, network mismatch, repeatability drift, latency regression, production flag, and unknown smoke state.
- CLI and backend tests were added.
- `productionReady:false`.

## What Was Proven

- The backend can call a local/private Windows Qwen2.5-VL FastAPI server through the sandbox path.
- The deterministic Windows mapper can produce candidate JSON accepted by the strict backend validator.
- Three approved ignored fixtures can pass once.
- The same three approved ignored fixtures can pass a repeat smoke.
- Failure and latency taxonomy exists for safe interpretation of sanitized local smoke outcomes.
- Raw persistence flags remain false in the recorded sanitized runs.
- Windows-primary backend/VLM workflow is viable while MacBook/Xcode remains reserved for later iOS verification.

## What Was Not Proven

- Not production-ready.
- No iOS integration.
- No real user-photo upload.
- No consent UI for a real self-hosted VLM flow.
- No app-facing endpoint.
- No production endpoint.
- No quota, billing, entitlement, or abuse controls for VLM use.
- No deletion/retention policy implementation for real uploaded images.
- No App Store privacy disclosure update.
- No large fixture set.
- No model comparison.
- No vLLM, SGLang, Ollama, or LM Studio benchmark.
- No throughput, concurrency, cancellation, or load test.
- No multilingual real-image evaluation beyond existing copy gates.
- No fine-tuning or training.
- No on-device model.

## Gate Inventory

- Structured candidate validator: `backend/src/qa/openWeightVlmPhotoAdvisorSchema.mjs`.
- Synthetic benchmark: `npm run qa:open-weight-vlm:synthetic`.
- Synthetic benchmark gate: `npm run qa:open-weight-vlm:gate`.
- Local config dry-run: `npm run qa:open-weight-vlm:local-config`.
- Default local sandbox smoke stub/no-network: `npm run qa:open-weight-vlm:local-smoke`.
- Local smoke gate: `npm run qa:open-weight-vlm:local-smoke-gate`.
- Windows path/config handling tests in backend test coverage.
- Repeatability gate: `npm run qa:open-weight-vlm:local-repeatability-gate`.
- Failure/latency taxonomy gate: `npm run qa:open-weight-vlm:local-failure-taxonomy`.
- Photo Advisor copy/filter/CreativeIntent/card coverage scripts.
- Secret scan.
- iOS direct provider/model scan.
- Camera cloud entry scan.
- Backend/iOS payload drift scan.
- Artifact scan for ignored local config, fixture registry, fixtures, reports, logs, and model outputs.

## Safety And Privacy Boundary Inventory

- `productionReady:false` remains required.
- Backend validator remains strict and authoritative.
- Local smoke gates remain fail-closed.
- Fixture approval checks remain required.
- Raw prompt, raw model output, raw image/base64/path, request payload, local config contents, fixture registry contents, credentials, server logs, and generated raw reports must not be printed or committed.
- Local config, fixture registry, fixture images, reports, logs, model weights, and credentials must remain ignored.
- Windows model server must remain local/private only.
- iOS must not contain provider/model keys or direct provider/model calls.
- Camera must not add a cloud AI entry.
- Backend provider payload and iOS upload payload must remain unchanged unless a future phase explicitly approves a change.
- Capture context upload remains blocked.
- Training, fine-tuning, user-photo training, and production rollout remain blocked.

## Windows-primary Workflow Summary

- Windows is the primary backend/VLM development machine.
- The external server workspace is `C:\Projects\vlm-smoke-server-work`.
- The server is operator-managed and outside this repo.
- The repo keeps only the backend sandbox client, schema validator, gates, tests, and docs.
- Real local config, fixture registry, fixture images, server logs, model weights, and raw outputs stay ignored/outside committed source.

## MacBook / Xcode Verification Role

- MacBook is reserved for later Xcode/iOS verification.
- Phase 20-E-E does not require Xcode runtime testing because no iOS source/project/localization files change.
- Future iOS work must still confirm no Camera cloud entry, no iOS provider/model key, no iOS direct provider/model call, no iOS upload payload change, no capture-context upload, and no production remote rollout.

## Known Limitations

- The accepted fixture set is only three approved local fixtures.
- The successful repeat does not prove robustness across diverse scenes.
- Latency remains sandbox-level data; accepted `gt_15s` results are review notes, not production approval.
- The current serving path is Transformers/FastAPI only.
- The local Windows server implementation is outside the repo and not a production serving architecture.
- Healthz, raw logging controls, and fixture availability must be rechecked before any future real smoke.
- The current gates judge sanitized outputs; they do not replace product privacy, abuse, cost, deletion, consent, or App Store review work.

## Phase 20-F Entry Criteria

Phase 20-F may start only after:

- Repo working tree is clean.
- Upstream comparison is `0 0`.
- Phase 20-E-E is reviewed, committed, and pushed.
- Ignored local config, fixture registry, fixture images, reports, logs, model weights, and credentials remain ignored/untracked/unstaged.
- Windows server remains local/private only.
- Raw logging remains disabled.
- Healthz is sanitized and safe if any future smoke is planned.
- Existing gates pass: backend tests, synthetic benchmark, benchmark gate, local config dry-run, default local smoke, local smoke gate, repeatability gate, failure taxonomy gate, copy/filter/CreativeIntent/card coverage, secret scan, iOS direct provider/model scan, Camera cloud entry scan, payload drift scan, and artifact scan.
- Phase 20-F scope is explicitly chosen.

## Recommended Phase 20-F Option

Prefer Option A: **Phase 20-F - Expanded Fixture Set Planning + Fixture Registry Schema**.

Why:

- The app needs stronger local VLM evaluation coverage before serving-stack benchmarking or iOS integration.
- Fixture diversity will make future smoke results easier to interpret.
- This option can remain backend-only and planning/schema-focused without running real smoke.
- It can define 8-12 approved fixture categories, fixture registry validation, readiness buckets, and review criteria before spending more model calls.

Other options:

- Option B - Serving Stack Benchmark Preflight: useful later for vLLM/SGLang/Ollama comparison, but should be docs/gate-only first.
- Option C - Controlled Expanded Local Smoke, 6-8 Fixtures: useful only if fixtures are already safely prepared; it costs more model calls and creates noisier result interpretation.

## Phase 20-F Completion Note

Phase 20-F implemented the recommended Option A as a backend-only dry-run gate. It added `docs/open-weight-vlm-expanded-fixture-registry-plan.md`, a sanitized expanded fixture registry policy module, a no-network CLI, and backend tests.

The new dry-run gate validates fixture metadata buckets, approval state, metadata stripping, privacy review, face/sensitive/private identifier exclusions, category coverage, and missing core categories. It does not read local config, require fixture images, call a model, make network calls, print raw paths/prompts/model outputs/request payloads, or change production readiness.

After Phase 20-F, the next candidate phase is a controlled 6-8 fixture local smoke only if explicitly requested and only after ignored fixtures/registry are safely prepared, existing gates pass, Windows healthz is safe, and raw logging remains disabled.

## Phase 20-G Blocked Expanded Smoke Note

Phase 20-G attempted the explicitly approved controlled eight-fixture local/private smoke. The ignored expanded registry dry-run was eligible before the run, Windows healthz was safe, and the smoke used fixture IDs only with one call per fixture and no retries.

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
- raw prompt/model response/image/image path/request payload persisted flags false

This does not change the core sandbox boundary: the local VLM path remains backend-only, local/private, and not production-ready. Phase 20-H should diagnose expanded fixture availability and request handling in the local/private Windows server before another controlled expanded smoke is considered.

## Phase 20-H Provider Diagnostic Note

Phase 20-H is diagnosis-only. It adds a sanitized backend helper, CLI, and tests for the Phase 20-G provider-integration block without running real model smoke or Qwen inference.

The diagnostic points to a pre-inference mismatch between backend expanded fixture readiness and external Windows server fixture availability / routing. The server-shape inspection was sanitized and found only the original fixture token bucket advertised in the external server implementation. Another expanded real smoke remains blocked until no-model fixture routing or contract echo proves the approved tokens can route locally.

This phase does not add iOS integration, app-facing endpoints, production endpoints, raw artifact persistence, serving-stack benchmarking, training/fine-tuning, or production rollout.

## Boundary Confirmation

Phase 20-E-E is a review/summary/planning gate only. It does not run real model smoke, expand fixture count, benchmark vLLM/SGLang, start iOS integration, add app-facing or production endpoints, train/fine-tune, weaken validation, loosen fixture approval, commit local artifacts, or change production readiness.
