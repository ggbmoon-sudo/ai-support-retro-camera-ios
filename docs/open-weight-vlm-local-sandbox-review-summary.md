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

## Phase 21-G Local Model Route Approval Gate Note

Phase 21-G adds a backend-internal local model route approval gate for future review only:

```sh
npm run qa:open-weight-vlm:local-model-route-approval
```

The gate documents prerequisites for a future `local_model` route request after the local sandbox work, but it does not enable the route, call Qwen, run fixture inference, run serving benchmarks, start iOS integration, add endpoints, accept user-photo upload, or change `productionReady:false`. It requires safe healthz, `publicExposure:no`, `rawLoggingDisabled:true`, ignored local config/registry/fixtures, explicit future user approval, scoped fixture tokens, structured candidate JSON, backend validator enforcement, fallback/safety enforcement, and no raw artifact logging.

## Phase 21-H Local Model Route Dry-run Plan Note

Phase 21-H adds the controlled dry-run plan:

```sh
npm run qa:open-weight-vlm:local-model-route-dry-run-plan
```

The plan defines the first future `local_model` route test as backend-internal, local/private, one declared synthetic fixture token, one call only, no retries, structured candidate JSON only, validator/fallback protected, raw persistence flags false, and `productionReady:false`. Phase 21-H itself does not call Qwen, run model inference, run fixture inference, run a serving benchmark, add iOS integration, add endpoints, accept real upload, or enable the route.

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

## Phase 20-I Routing Echo Note

Phase 20-I adds a no-model fixture routing contract echo and backend gate. The sanitized result verifies the approved eight fixture tokens route locally/private before any future real smoke retry:

- `totalFixtureTokens:8`
- `routeableCount:8`
- `unavailableCount:0`
- `modelInferenceRun:false`
- raw persistence flags false
- `networkCallsMade:true`
- `productionReady:false`

This proves routing only. It does not prove model quality, latency, schema behavior under Qwen output, iOS integration, app-facing endpoints, or production readiness.

## Phase 20-J Accepted Retry Note

Phase 20-J reran the controlled expanded local/private Qwen smoke after the Phase 20-I routing fix. It made exactly eight approved fixture calls, one per token, with no retries and no extra fixtures.

Sanitized result: `fixtureCount:8`, `acceptedCount:8`, `rejectedCount:0`, `acceptanceRate:100%`, no validation/fallback/schema diagnostic buckets, `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`, `networkCallsMade:true`, raw persistence flags false, and `productionReady:false`.

This strengthens sandbox confidence for the current fixture set, but it still does not prove production readiness, iOS integration, real user-photo upload, consent UI, quota/abuse controls, retention/deletion implementation, serving-stack performance, larger dataset coverage, or App Store privacy readiness.

## Phase 20-K Coverage Review Note

Phase 20-K adds `docs/open-weight-vlm-expanded-smoke-result-review.md` to interpret the accepted eight-fixture result and identify dataset gaps. The review confirms the current result proves local/private routeability and validator acceptance for the approved set, but does not prove production readiness, iOS integration, broad dataset quality, hard-negative robustness, imported-photo behavior breadth, multilingual real-output quality, throughput, serving-stack performance, fine-tuning, or on-device readiness.

The review records `gt_15s x3` and `5s_to_15s x5` as sandbox latency evidence only. The recommended next step is Phase 20-L: 12-fixture coverage expansion planning plus a no-model registry gate. Phase 20-K does not run real smoke, add fixture images, expand the real local registry, benchmark serving stacks, start iOS integration, add endpoints, or change `productionReady:false`.

## Phase 20-L 12-Fixture Gate Note

Phase 20-L implements that recommendation as a no-model registry gate. The expanded fixture registry target is now 12 categories: the Phase 20-J eight plus `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`.

The dry-run reports `totalTargetFixtures:12`, `requiredCategories`, category coverage, missing required categories, `networkCallsMade:false`, and `productionReady:false`. This prepares Phase 20-M controlled fixture preparation only. It does not run Qwen inference, add fixture images, commit local registries/config, start iOS integration, add endpoints, or approve production rollout.

## Phase 20-M Prep Note

Phase 20-M prepares the ignored local 12-fixture set and verifies 12-token no-model routing echo. The result remains backend-only sandbox readiness: ignored fixture images and registry stay uncommitted, no Qwen inference runs, raw artifacts are not printed, and `productionReady:false` remains required.

## Phase 20-N Smoke Note

Phase 20-N ran the explicitly approved controlled 12-fixture local/private Qwen smoke. The run made exactly 12 approved fixture calls, one per token, with no retries and no extra fixtures.

Sanitized Phase 20-N aggregate:

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
- `productionReady:false`
- raw persistence flags false

The sandbox remains backend-only and Windows-primary. This does not approve iOS integration, app-facing endpoints, production endpoints, or production rollout.

## Phase 20-O Decision Note

Phase 20-O reviews the accepted 12-fixture result and adds `docs/open-weight-vlm-serving-benchmark-decision-gate.md`. The decision gate records that `gt_15s x10` is a significant latency note and recommends Phase 20-P as serving-stack benchmark preflight only.

Phase 20-O does not run real model smoke, run vLLM/SGLang/Ollama, switch model stacks, add fixture images, modify ignored local registry, start iOS integration, add endpoints, or change `productionReady:false`.

## Phase 20-P Preflight Note

Phase 20-P adds `docs/open-weight-vlm-serving-benchmark-preflight.md` and `npm run qa:open-weight-vlm:serving-benchmark-preflight`. The gate is no-network/no-model and validates only a sanitized benchmark plan, including stack matrix, metrics, fixture rules, artifact policy, stop conditions, and Phase 21 entry criteria.

The sandbox remains backend-only, Windows-primary, and local/private. Phase 20-P does not run a benchmark, Qwen inference, real smoke, vLLM/SGLang/Ollama/LM Studio, iOS integration, app-facing endpoints, production endpoints, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 21-A Gateway Contract Preflight Note

Phase 21-A adds a backend-internal VLM Gateway contract preflight. The contract accepts sanitized backend-internal request metadata only and returns structured candidate JSON only. The existing open-weight VLM candidate validator and safety gates remain the source of truth before any future app-facing use.

Phase 21-A does not add iOS integration, app-facing endpoints, production endpoints, real user-photo upload, raw image/base64/path/prompt/provider response handling, Qwen inference, serving benchmark execution, training/fine-tuning, or production rollout. `productionReady:false` remains required.

## Phase 21-B Gateway Adapter Stub Note

Phase 21-B adds a backend-internal VLM Gateway adapter stub and optional external local server no-model contract echo alignment. The app repo remains the source of truth for the request contract, adapter stub, candidate validator, safety gates, docs, tests, and QA scripts.

The adapter stub accepts only sanitized fixture-token sandbox requests, returns structured candidate JSON only, validates through the existing open-weight VLM schema/safety chain, and prints sanitized aggregate results only. The external server workspace may expose `/local/vlm/gateway-contract-echo` only as a private no-model compatibility echo with `modelInferenceRun:false`, `rawLoggingDisabled:true`, `publicExposure:no`, raw persistence flags false, and `productionReady:false`.

Phase 21-B does not run real model smoke, Qwen inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, consent UI, training/fine-tuning, or production rollout.

## Phase 21-C Provider Routing Dry-run Note

Phase 21-C adds a backend-internal provider routing dry-run gate. It keeps `local_stub` and `local_contract_echo` as the only allowed backend-internal routes and blocks `local_model_blocked`, `future_vllm_blocked`, `future_sglang_blocked`, `manual_ollama_lmstudio_blocked`, `production_blocked`, and unknown modes.

The dry-run is sanitized, no-network, no-model, and `productionReady:false`. It does not add iOS integration, app-facing endpoints, production endpoints, real user-photo upload, serving benchmark execution, Qwen inference, vLLM/SGLang/Ollama execution, or production rollout.

## Phase 21-D / 21-E Boundary Notes

Phase 21-D adds the no-model provider adapter HTTP check for the `local_contract_echo` route only. It remains local/private, backend-internal, structured-candidate-only, and `productionReady:false`.

Phase 21-E adds the cross-platform deployment boundary audit. Windows remains the backend/VLM development sandbox only; MacBook/Xcode remains iOS client development and future runtime verification only; future production must use backend-mediated provider calls with environment/secrets/config, not committed local paths, Windows workspace paths, Mac local paths, LAN model URLs, public/cloud/tunnel model URLs, or external sandbox assumptions.

The audit does not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, or production rollout.

## Phase 21-F Config / Env Boundary Note

Phase 21-F adds the backend deployment config/env preflight. Future production/server config must use env/secrets/config injection and committed source may contain only sanitized category names or placeholders. The preflight blocks committed secrets, provider/model key fields, runtime Windows/Mac paths, hardcoded LAN model URLs in iOS, committed production model URLs, public/cloud/tunnel local provider URLs, raw logging, app-facing endpoint flags, production endpoint flags, Camera cloud AI entry, capture-context upload, model calls, Qwen inference, benchmarks, and `productionReady:true`.

Phase 21-F does not run real model smoke, Qwen inference, fixture inference, serving benchmarks, vLLM/SGLang/Ollama, iOS integration, app-facing endpoints, production endpoints, real user-photo upload, auth/billing/quota runtime, or production rollout.

## Boundary Confirmation

Phase 20-E-E is a review/summary/planning gate only. It does not run real model smoke, expand fixture count, benchmark vLLM/SGLang, start iOS integration, add app-facing or production endpoints, train/fine-tune, weaken validation, loosen fixture approval, commit local artifacts, or change production readiness.

## Phase 21-N Preflight Block Note

Phase 21-N was explicitly approved for exactly one backend local/private model route smoke, but the required preflight blocked execution before any healthz/model call because `smoke_001` was not present and approved in the ignored local fixture registry.

Ignored local config, ignored local fixture registry, and ignored local sample folder were present, ignored, untracked, and unstaged. No fixture was substituted. No model call, retry, serving benchmark, Qwen inference, vLLM/SGLang/Ollama call, model download, model switch, endpoint, iOS integration, raw artifact, secret, or production rollout occurred. `productionReady:false` remains locked.

## Phase 21-N-R0 Fixture Preparation Note

Phase 21-N-R0 found that the ignored local `smoke_001.*` fixture file is missing. The ignored local registry was not edited, and `smoke_001` remains not present/approved. The next step is operator-provided local-only fixture preparation, not a model call.

No model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, endpoint, iOS integration, raw artifact, secret, or production rollout occurred.
