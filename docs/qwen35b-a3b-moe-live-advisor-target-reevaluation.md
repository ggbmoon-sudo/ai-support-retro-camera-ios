# Qwen 3.5 35B-A3B MoE + Live Advisor Target Re-evaluation

Status: Phase 21-H2 planning/gate only  
Date: 2026-06-17  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-H2 re-evaluates the future model, serving stack, Live Advisor, Auto-Trigger, WSS, compression, local CV, quantization, and prompt/output direction before any runtime implementation.

This phase does not switch models, enable `local_model`, run Qwen, run model inference, run fixture inference, run serving benchmarks, implement Auto-Trigger, implement WSS, implement image upload/compression runtime, add iOS integration, add app-facing endpoints, add production endpoints, or change production readiness.

## Why The Direction Changed

The project now has two durable planning sources:

- `docs/missing-features-and-deferred-roadmap-register.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`

Those docs record a newer target direction: prefer a future Qwen 3.5 35B-A3B MoE-class model only if it is verified as vision-capable / VLM-compatible, keep Qwen2.5-VL as the current correctness/reference baseline, separate local on-device CV from cloud VLM work, and avoid treating the Camera viewfinder as continuous video AI.

Phase 21-H2 turns that direction into a gateable policy before any upload, WSS, Auto-Trigger, serving benchmark, iOS integration, or model route call is attempted.

## Preferred Future Model Target

Preferred future target:

- `qwen3_5_35b_a3b_moe_preferred`
- It is preferred only if available and verified as vision-capable / VLM-compatible.
- It must support image input through a verified multimodal serving path.
- It must support non-thinking / instruct / direct-output operation.
- It must support structured output or deterministic structured mapping.
- It must be benchmarked before any production or iOS claim.

Fallback candidates:

- `qwen3_vl_moe_fallback_candidate` if the preferred Qwen 3.5 35B-A3B vision path is unavailable.
- `qwen2_5_vl_reference` remains the current correctness/reference baseline.
- `qwen_9b_vision_fast_fallback` may be considered as a latency/cost fallback only.

Blocked:

- Text-only Qwen for image analysis.
- Any model without verified vision input.
- Any model requiring free-form prose directly to UI.
- Any model requiring chain-of-thought output.
- Any production claim without benchmark evidence.

## Vision-capable Requirement

Vision capability must be verified before adoption:

- Image input must be accepted by the serving path.
- The serving path must preserve the structured candidate output contract.
- The backend validator remains the source of truth.
- If vision capability is unverified, the model is blocked/unverified, not enabled.

## Non-thinking / Instruct Direct-output Requirement

Future model policy prefers non-thinking / instruct / direct-output operation because Live Advisor latency must stay low and output must be deterministic enough for backend validation.

Requirements:

- No chain-of-thought output.
- No free-form professional critique directly to UI.
- Structured candidate JSON or deterministic structured mapping only.
- Bounded token budget in a future prompt/token phase.

## Quantization Deployment Direction

Production candidates should evaluate INT4/INT8 quantization such as AWQ/GPTQ or equivalent supported formats.

Quantization is required as a future serving benchmark dimension and must be reviewed for:

- schema validity
- latency
- acceptance/rejection rate
- fallback rate
- visual quality regression
- safety/language regression

No quantized model download, deployment, benchmark, or model weight commit is approved in this phase.

## Serving Stack Direction

Serving stack policy:

- Transformers + FastAPI remains the correctness/reference baseline.
- vLLM becomes the primary future serving benchmark candidate.
- SGLang becomes the structured-output/performance challenger.
- Ollama / LM Studio remain manual/local smoke only.

No serving stack switch happens in this phase. No vLLM/SGLang/Ollama/LM Studio command is run in this phase. No serving benchmark is run in this phase.

## Stateful WSS Direction

Future Stateful WSS may be used for Live Advisor session transport only after policy and privacy gates.

WSS should carry:

- session state
- throttle state
- server busy/backoff state
- short structured advice
- backend-mediated status

WSS must not:

- stream raw camera video
- run at 30fps
- bypass the backend gateway
- let iOS talk directly to a model server
- print or persist raw frames, prompts, outputs, paths, base64, EXIF, or credentials

WSS runtime remains blocked in this phase.

## Auto-Trigger Live Advisor Direction

Future desired behavior:

- Device stillness trigger is based on gyroscope / motion stability buckets.
- The lens/viewfinder must be stable for more than 1 second.
- If stability is less than or equal to 1 second, do not capture a frame and do not upload.
- Max cloud-analysis cadence is 1 FPS.
- Only one compressed frame may be sent per eligible tick.
- User-visible Live Advisor opt-in is required.
- No silent upload.
- Clear consent and privacy wording are required before any cloud frame upload.
- Disable/off state is required.
- Throttle and fail-closed behavior are required.
- Never upload GPS, raw EXIF, or raw sensor streams.
- Capture-context upload remains blocked unless explicitly approved.

Current phase does not implement this runtime.

## 1 FPS Cloud-analysis Policy

Cloud AI must not treat the viewfinder as 30fps video.

Future Live Advisor cloud analysis:

- at most 1 FPS
- only after Auto-Trigger condition passes
- only after user opt-in/consent
- sparse compressed preview frames only
- backend-mediated only

Local on-device CV may run at camera/UI rate for basic aids, but cloud VLM should receive only sparse compressed frames.

## Local On-device CV Policy

iOS local CV should handle millisecond/basic camera aids:

- grid alignment
- horizon/level guide
- overexposed/underexposed warning
- basic motion/stability buckets

These must remain local and lightweight, preserve 60fps camera smoothness, and avoid uploading raw sensor/GPS/EXIF. Cloud VLM should handle higher-level composition, mood, and retro intent only after consent and trigger gates.

## Image Compression / Upload Policy

Current project state: no production cloud upload path is approved, so frontend cloud-upload compression should be treated as not implemented for production unless a future source audit proves otherwise.

Future cloud upload requires:

- app-side compression before upload
- max long edge around 1024px as a planning target
- JPEG compressed preview frame
- approximate target 150KB-200KB as a planning target
- exact target to be tested later
- metadata stripping
- user consent
- retention/deletion policy
- no original full-resolution raw upload by default
- no capture-context upload unless explicitly approved

No implementation and no iOS payload change occur in this phase.

## Current Implementation Audit

Current repo appears to include:

- post-capture mock/local Photo Advisor flow
- backend response/request validators and QA gates
- synthetic open-weight VLM benchmark harness
- local Qwen2.5-VL sandbox history
- backend gateway contract/routing/adapter gates
- deployment config/env and cross-platform boundary gates
- local model route approval and dry-run plan gates
- missing/deferred feature register
- phase roadmap sequencing register

Current repo does not approve:

- production cloud upload
- Live Advisor cloud runtime
- Auto-Trigger runtime
- WSS runtime
- iOS direct model/provider calls
- app-facing or production endpoints
- production `local_model` route
- production readiness

## Blocked Production / iOS / Runtime Items

Blocked in this phase:

- model switch
- `local_model` route enablement
- model call
- Qwen inference
- fixture inference
- serving benchmark
- Auto-Trigger runtime
- WSS runtime
- image upload/compression runtime
- Camera live cloud AI runtime entry
- iOS backend integration
- app-facing endpoint
- production endpoint
- real user-photo upload
- consent UI runtime
- auth/billing/quota runtime
- training/fine-tuning
- validator/safety/fallback weakening

## Photo Advisor Prompt / Token Policy

Do not add a final production prompt yet.

Future server prompt policy:

- short prompt
- bounded token budget
- non-thinking / direct-output mode preferred
- structured keys, not final UI prose
- UI language comes from the app language pack
- target pattern remains Observation -> Mood -> Retro intent -> Optional action
- avoid Score -> Problem -> Fix -> Retake
- never replace validator/schema with free-form professional photographer prose

## Recommended Next Phases

After Phase 21-H2:

1. Phase 21-I: Image Compression + Upload Payload Policy Gate. Completed as a docs/gate/source-audit phase that keeps upload runtime, compression runtime changes, iOS payload changes, endpoints, model calls, Qwen inference, serving benchmarks, and production rollout blocked.
2. Phase 21-J: Auto-Trigger + 1 FPS Live Advisor Policy Gate. Completed as a docs/gate/source-audit phase that keeps Auto-Trigger runtime, Camera live cloud AI runtime entry, WSS runtime, upload runtime, iOS payload changes, endpoints, model calls, Qwen inference, serving benchmarks, and production rollout blocked.
3. Phase 21-K: Stateful WSS Live Advisor Protocol Preflight.
4. Phase 21-L: Local On-device CV Camera Aids Plan.
5. Phase 21-M: Quantization + Serving Benchmark Plan.
6. Phase 21-N or later: explicitly approved one-fixture backend `local_model` route smoke.

## productionReady:false Boundary

`productionReady:false` remains locked. Passing this policy gate means only that future model/serving/live-advisor direction is better organized for review. It is not model adoption, model route enablement, iOS approval, upload approval, WSS approval, endpoint approval, benchmark approval, or production approval.
