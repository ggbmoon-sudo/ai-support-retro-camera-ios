# Quantization + Serving Benchmark Plan

Status: Phase 21-M planning/gate/source-audit only  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-M defines the future quantization and serving benchmark plan before running any benchmark, downloading any model, switching serving stacks, enabling `local_model`, or making production/iOS claims.

The plan keeps Qwen 3.5 35B-A3B MoE as the preferred future target only if a vision-capable / VLM-compatible path is verified. Qwen2.5-VL remains the current correctness/reference baseline from local sandbox evidence. Transformers+FastAPI remains the local/operator correctness reference. vLLM is the primary future benchmark candidate, SGLang is the structured-output/performance challenger, and Ollama/LM Studio remain manual/local smoke only.

This phase does not run a serving benchmark, run real model smoke, run Qwen inference, run fixture inference, call vLLM/SGLang/Ollama, download quantized weights, modify the external server workspace, switch serving stacks, enable `local_model`, add iOS runtime dependency, add endpoints, or change `productionReady:false`.

## Current Implementation Audit

This audit is source/docs-level only and should be re-run before any future benchmark execution phase.

| Area | Current status | Notes |
| --- | --- | --- |
| vLLM runtime | not found | Current repo records vLLM as a future benchmark candidate in docs/gates, but no active vLLM runtime path was found. |
| SGLang runtime | not found | Current repo records SGLang as a future challenger, but no active SGLang runtime path was found. |
| Ollama / LM Studio runtime | not found / manual-only policy | Current docs/gates keep Ollama/LM Studio manual/local-only; no production route or benchmark runtime was found. |
| Transformers+FastAPI local sandbox | implemented / local-operator-only | Existing local sandbox config/client docs support a Transformers+FastAPI local/private path behind explicit `--run-local-model`; it remains sandbox evidence, not production serving approval. |
| Quantized model deployment | not found | Docs mention quantized fallback/benchmark planning, but no committed quantized deployment, weight download, or model switch was found. |
| Serving benchmark script that runs real models | not found for approved runtime | Existing `qa:open-weight-vlm:serving-benchmark-preflight` is no-network/no-model; `qa:open-weight-vlm:local` exists for explicit local model smoke, not for this phase. |
| Model weights / config URLs / secrets committed | not found in Phase 21-M scope | Committed examples and tests use placeholders/buckets. Ignored local config may exist locally and must remain untracked. |
| Production serving endpoint | not found | Backend gates keep app-facing and production endpoints blocked. |
| iOS runtime dependency on serving stack | not found | iOS remains provider/model-key-free and does not depend on vLLM, SGLang, Ollama, local model URLs, or Windows paths. |

Use cautious wording: this document records the Phase 21-M audit result, not a permanent proof that future code cannot change.

## Benchmark Purpose

Future benchmark work should answer whether a serving stack and quantization choice can improve latency, throughput, memory pressure, and cost without weakening the strict Photo Advisor schema, safety/fallback gates, privacy boundaries, or product voice.

Benchmark output can support planning decisions only. It must not be interpreted as production readiness, iOS readiness, user-photo readiness, endpoint approval, or `local_model` route approval.

## Model Candidate Matrix

| Model class | Role | Benchmark requirement | Boundary |
| --- | --- | --- | --- |
| `qwen3_5_35b_a3b_moe_preferred` | Preferred future target | Only if vision-capable / VLM-compatible serving path is verified; must support non-thinking / instruct direct-output mode and structured output or deterministic mapping | Not adopted, not switched, and not production/iOS-claimable until benchmarked |
| `qwen2_5_vl_reference` | Current correctness/reference baseline | Use existing local sandbox evidence as the reference behavior | Sandbox evidence only, not production approval |
| `qwen3_vl_moe_fallback_candidate` | Fallback/candidate | Evaluate if preferred Qwen 3.5 35B-A3B vision path is unavailable | Must verify VLM compatibility first |
| `qwen_9b_vision_fast_fallback` | Lower-cost/latency fallback | Consider only if vision-capable and schema/safety behavior holds | Cannot become production route by default |
| `text_only_qwen_blocked` | Blocked | No benchmark for Photo Advisor image analysis | Text-only Qwen is blocked for image analysis |

## Serving Stack Matrix

| Serving stack | Role | Future evaluation |
| --- | --- | --- |
| `transformers_fastapi_reference` | Correctness/reference baseline | Keep as operator/local sandbox path; not a production serving decision by itself |
| `vllm_primary_benchmark_candidate` | Primary future benchmark candidate | Evaluate throughput, batching, latency, memory, multimodal compatibility, and structured-output compatibility |
| `sglang_structured_output_challenger` | Structured-output/performance challenger | Evaluate against vLLM for JSON/control behavior, latency, throughput, and memory pressure |
| `ollama_lmstudio_manual_only` | Manual/local smoke only | Keep for manual/dev exploration; not production serving direction |

No serving stack switch is approved in Phase 21-M.

## Quantization Matrix

Future benchmark candidates may include:

- `fp16_bf16_baseline` if hardware allows.
- `int8_candidate`.
- `int4_candidate`.
- `awq_candidate`.
- `gptq_candidate`.
- `equivalent_supported_quantization_candidate`.

Quantization benchmark must later evaluate:

- schema validity.
- accepted/rejected counts.
- fallback rate.
- invalid schema rate.
- safety/fallback regression.
- latency buckets.
- throughput/concurrency buckets.
- GPU memory pressure.
- visual reasoning regression.
- Photo Advisor voice quality.
- filter-family recommendation consistency.
- no score/rating/sensitive inference/chain-of-thought/debug leakage.

No quantized model download, quantized model deployment, weight cache change, or benchmark execution is approved in Phase 21-M.

## Metrics To Collect Later

Future reports should include sanitized aggregate metrics only:

- model class.
- serving stack class.
- quantization class.
- fixture count.
- accepted count.
- rejected count.
- fallback categories.
- invalid schema categories.
- latency buckets.
- throughput/concurrency buckets.
- memory bucket.
- `rawOutputPersisted:false`.
- `rawOutputPrinted:false`.
- `rawPromptPersisted:false`.
- `rawPayloadLoggingAllowed:false`.
- `productionReady:false`.

Do not include raw model/provider text, raw prompts, raw request payloads, image bytes, base64, file paths, local config contents, registry contents, logs, credentials, or secrets.

## Fixture Scope Policy

Future benchmark execution must use only approved sanitized fixtures.

Rules:

- no real user photos.
- no raw photo reports committed.
- no raw model output committed.
- no raw prompt committed.
- no image/base64/path logs.
- use fixture IDs or buckets in reports where possible.
- start with one fixture if the route is not proven.
- use the controlled 12-fixture set only after one-call route passes.
- larger benchmark requires explicit user approval.
- no retries to chase pass rate unless a separate repeatability phase explicitly approves it.

## Structured Output / Schema Validity Policy

Backend validator and safety/fallback gates remain authoritative.

Future benchmark candidates must preserve:

- structured candidate JSON only.
- deterministic mapping where model-native structured output is insufficient.
- valid `allowedContext`, `visualObservationKey`, `creativeIntent`, `technicalRisk`, and `safety` fields.
- safe fallback for invalid JSON, invalid schema, unsupported filters, unsafe text, sensitive inference, score/rating language, chain-of-thought, and provider/debug leakage.
- app voice pattern: Observation → Mood → Retro intent → Optional action.

Do not replace the validator with free-form professional photographer prose.

## Latency And Throughput Policy

Future benchmark planning should measure:

- p50/p90/p95/max latency buckets.
- timeout bucket.
- cold-start bucket.
- warm-run bucket.
- batching bucket.
- throughput/concurrency bucket.
- server busy/backoff bucket.
- GPU memory bucket.

`gt_15s` remains a sandbox latency note and benchmark concern, not production readiness. Any production claim remains blocked.

## Safety / Fallback Regression Policy

Quantization and serving changes must not regress:

- schema validity.
- safety rejection behavior.
- fallback mapping.
- filter allowlist enforcement.
- no score/rating language.
- no harsh Score → Problem → Fix → Retake tone.
- no sensitive inference.
- no chain-of-thought.
- no debug/provider leakage.
- no raw output/prompt/payload persistence.

Regression in any of these areas is a stop condition.

## Cost / Hardware Planning Policy

Future benchmark planning should use sanitized hardware/cost buckets only:

- GPU memory bucket.
- concurrency/throughput bucket.
- latency bucket.
- quantization class.
- serving stack class.
- estimated cost bucket if a future production environment is considered.

Do not commit hardware-specific local paths, model cache paths, model server URLs, provider URLs, credentials, or raw logs.

## Stop Conditions

Stop immediately if a future phase attempts any of the following without explicit approval:

- serving benchmark runtime.
- real model smoke.
- Qwen inference.
- fixture inference.
- vLLM/SGLang/Ollama/LM Studio call.
- model download.
- quantized weight download.
- model cache change.
- serving stack switch.
- `local_model` route enablement.
- external server workspace modification.
- iOS runtime dependency.
- app-facing endpoint.
- production endpoint.
- real user-photo upload.
- raw report/log/model output/prompt/request payload/image/base64/path/EXIF/GPS/credential persistence.
- validator weakening.
- safety/fallback weakening.
- training/fine-tuning.
- `productionReady:true`.

## What Remains Blocked

Phase 21-M keeps blocked:

- serving benchmark execution.
- model download.
- model switch.
- `local_model` enablement.
- vLLM/SGLang/Ollama call.
- Qwen inference.
- fixture inference.
- external workspace changes.
- iOS runtime dependency.
- Camera cloud AI runtime.
- Auto-Trigger runtime.
- WSS runtime.
- local CV runtime.
- upload/compression runtime.
- app-facing endpoint.
- production endpoint.
- production rollout.

## Gate Expectations

The Phase 21-M gate validates benchmark plan policy objects only and must report:

- benchmark runtime disabled.
- serving stack switch disabled.
- model download disabled.
- no model calls.
- no Qwen inference.
- no fixture inference.
- no serving benchmark run.
- preferred model class.
- serving stack candidate.
- quantization candidate.
- vision-capable requirement.
- non-thinking/direct-output requirement.
- structured output requirement.
- approved fixture policy required.
- sanitized metrics required.
- raw output/prompt/payload persistence or logging blocked.
- real user photos blocked.
- production endpoint disabled.
- iOS runtime dependency disabled.
- `networkCallsMade:false`.
- `productionReady:false`.

## productionReady:false Boundary

`productionReady:false` remains locked.

Passing Phase 21-M means only that future quantization and serving benchmark policy is documented and gate-tested. It is not benchmark execution approval, not model download approval, not model switch approval, not `local_model` route approval, not vLLM/SGLang/Ollama approval, not Qwen inference approval, not fixture inference approval, not iOS approval, not endpoint approval, and not production rollout.

## Phase 21-N Follow-up

Phase 21-N was explicitly approved for exactly one backend local/private model route smoke, but preflight blocked execution before any model call because required preferred fixture token `smoke_001` was not present and approved in the ignored local fixture registry.

This does not change the Phase 21-M benchmark plan. Serving benchmark execution, model downloads, model switching, production `local_model` enablement, vLLM/SGLang/Ollama calls, fixture benchmark inference, iOS dependencies, endpoints, and production rollout remain blocked. The next recommended step is Phase 21-N-R0: resolve the ignored local `smoke_001` fixture prerequisite without committing local config, fixture registry contents, fixture images, raw reports, prompts, model outputs, request payloads, logs, model weights, or credentials.
