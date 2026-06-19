# Phase 21-Z2D-SF SiliconFlow Benchmark Review and Provider Decision Gate

Status: completed  
Date: 2026-06-20  
Phase type: docs-only benchmark review and provider decision gate  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z2D-SF reviews the approved Phase 21-Z2C-SF-RUN SiliconFlow 12-fixture API benchmark result without rerunning SiliconFlow, reading an API key, uploading images, calling a model, or changing iOS runtime.

The benchmark execution itself already happened in Phase 21-Z2C-SF-RUN. This phase only classifies the result and decides the next safe engineering step.

Sanitized benchmark facts:

| Field | Value |
| --- | --- |
| Provider | `siliconflow` |
| Model | `Qwen/Qwen3-VL-30B-A3B-Instruct` |
| Implementation | backend-mediated JavaScript / Node.js |
| Fixtures | `smoke_004` through `smoke_015` |
| Planned calls | `12` |
| Actual attempts | `12` |
| Retry count | `0` |
| Accepted count | `0` |
| Rejected count | `12` |
| Validation bucket | `provider_schema_invalid x12` |
| Fallback bucket | `provider_validation_rejected x12` |
| Latency bucket | `5s_to_15s x12` |
| Token usage bucket | `lte_20k` |
| Cost bucket | `usage_available_cost_not_computed` |
| Raw artifacts | none printed or committed |
| Secrets | none printed or committed |
| iOS runtime change | no |
| Upload payload change | no |
| Production readiness | `productionReady:false` |

## Decision Statement

Decision bucket:

- `provider_output_schema_alignment_failed`

Interpretation:

- This is not a network, auth, or base URL failure anymore.
- This is not proof that SiliconFlow is unusable.
- This is not proof that `Qwen/Qwen3-VL-30B-A3B-Instruct` model quality is bad.
- This is not a production readiness pass.
- This is a provider-output-to-backend-schema alignment failure.

Reasoning:

- The approved run attempted exactly `12` provider/model calls within scope.
- Latency was `5s_to_15s x12`, not a fast `lt_1s` preflight block.
- A token usage bucket was available, which indicates provider responses reached the runtime path.
- All failures were schema/validation buckets.
- No accepted backend Photo Advisor candidate JSON was produced.

## Sanitized Evidence Boundary

This review intentionally uses only sanitized aggregate evidence.

It does not:

- inspect raw provider responses
- print raw provider responses
- inspect raw prompts
- print raw prompts
- inspect raw image/base64/path values
- read API keys
- rerun provider calls
- open fixture images
- inspect EXIF, GPS, or sensor data

## Likely Failure Layer Review

The exact raw provider responses are intentionally unavailable, so the table below is a safe hypothesis list rather than a raw-output diagnosis.

| Possible layer | Why it remains plausible | Safe next action |
| --- | --- | --- |
| Prompt did not force exact candidate JSON strongly enough | All responses failed schema validation despite bounded prompt settings | Tighten prompt with exact candidate object shape using synthetic tests only |
| Model returned natural language around JSON | VLMs often add prose unless strongly constrained | Add parser tests for prose-before/after-JSON synthetic strings |
| Model returned unsupported enum values | Backend schema intentionally accepts only approved semantic keys/enums | Add enum/key instruction table and unsupported-enum synthetic fixtures |
| Model returned old field names | Provider may infer nearby naming from generic examples | Add exact field-name checklist and field-alias rejection tests |
| Model omitted required fields | `provider_schema_invalid x12` is consistent with missing required fields | Add required-field synthetic failures and prompt reminders |
| Model added extra fields | Backend must reject debug/provider/internal fields | Add extra-property tests and strict no-debug wording |
| Model used wrong object shape for `creativeIntent`, `technicalRisk`, or `safety` | Nested shape mismatches are common for constrained VLM JSON | Add exact nested-shape examples in prompt-contract tests |
| Model used free-form text instead of semantic keys | Photo Advisor contract requires app-owned semantic keys, not final UI prose | Add key-only prompt instructions and free-form rejection tests |
| Model included score/rating/sensitive/debug/retake-first content | Existing safety rules reject these patterns | Keep strict rejection; add synthetic coverage for these cases |
| Parser could not extract valid JSON safely | Parser must avoid unsafe extraction from ambiguous raw text | Add parser tests for common malformed VLM output strings |
| JSON mode / structured output is unreliable for this VLM | Phase 21-Z2A-SF already recorded structured-output caveats | Keep backend validator as source of truth; do not trust JSON mode alone |
| Backend schema is intentionally strict | Strict rejection protects product language and privacy boundaries | Keep strictness; align prompt/schema before another paid run |

## Provider and Model Decision

Current decision:

- SiliconFlow remains the selected primary provider candidate.
- `Qwen/Qwen3-VL-30B-A3B-Instruct` remains the selected primary model candidate.
- Do not switch provider yet.
- Do not switch model yet.
- RunPod remains fallback/comparison.
- Do not approve iOS integration.
- Do not approve production rollout.
- Do not approve alternative model benchmark yet.
- Do not approve immediate rerun until prompt/schema alignment work is complete.

Rationale:

- The run reached provider/model execution and produced token/latency evidence.
- The failure class is schema alignment, not provider reachability.
- A prompt/schema/parser alignment pass is cheaper and safer than switching providers or models immediately.
- The current backend validator did its job by rejecting invalid candidates instead of allowing raw provider output into product flow.

## Next Safe Engineering Action

Recommended next phase:

- `Phase 21-Z2D-SF-R1: SiliconFlow Prompt and Schema Alignment Gate Without API Calls`

R1 scope:

- no SiliconFlow API calls
- no API key read
- no image upload
- no benchmark
- synthetic provider-like response strings only
- tighten prompt template
- define exact candidate JSON example
- add enum/key instructions
- add schema-shape contract tests
- add parser tests for common malformed VLM outputs
- improve sanitized rejection diagnostics without raw output
- prepare a future bounded retry approval draft

Future retry option, not approved by this phase:

- `Phase 21-Z2E-SF-RUN: Approved SiliconFlow Prompt-aligned 12-fixture Retry`

That retry must happen only after R1 and separate explicit approval.

## Non-goals

Phase 21-Z2D-SF does not:

- call SiliconFlow
- rerun the benchmark
- run diagnostic provider calls
- create, read, print, store, or commit API keys
- execute `fetch()`
- execute provider SDK/runtime calls
- upload images
- open fixture images
- inspect EXIF/GPS/sensor data
- call any model
- add app-facing endpoints
- add production endpoints
- add iOS integration
- modify iOS upload payloads
- add Camera live cloud AI
- implement WSS or Auto-Trigger runtime
- provision RunPod
- run vLLM/SGLang/Ollama
- change `productionReady:false`

## Boundary Confirmation

- Provider API calls executed in this phase: no
- Model calls executed in this phase: no
- Benchmark executed in this phase: no
- API key created/read/printed/committed: no
- Raw provider output printed/persisted: false
- Raw prompt/request/image printed/persisted: false
- iOS runtime changed: no
- Upload payload changed: no
- Live camera cloud AI runtime added: no
- Production readiness: `productionReady:false`

