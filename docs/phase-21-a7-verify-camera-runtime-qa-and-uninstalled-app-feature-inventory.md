# Phase 21-A7-VERIFY - Camera Runtime Non-composition Polish QA and Uninstalled App Feature Inventory

Status: docs-only verification handoff; physical-device QA still pending
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-A7-VERIFY records the MacBook/Xcode physical-device QA checklist for the Phase 21-A7 Camera runtime polish and organizes, from the current roadmap/registers, which planned features are not yet installed in the iOS app runtime.

This phase does not claim physical-device verification. This Windows/Codex environment cannot run Xcode on an attached iPhone, so the runtime QA remains an operator task on MacBook/Xcode.

## Cloud AI Scope Update

Camera-page Live Cloud AI / Live Advisor is no longer a desired app direction because local on-device guidance is the Camera path. Cloud AI is still desired outside the Camera live view, specifically in the Inspiration / post-capture AI surfaces:

- Inspiration photo analysis: Qwen3-family / Qwen3-VL-style model through a mainland relay provider.
- Inspiration generated filter / Filter Lab: Qwen3-family model through a mainland relay provider.
- Image editor / 改圖師: GPT Image 2.0-style image editing provider through a mainland relay provider.

These future providers must remain backend-mediated. Mainland relay API keys must not be stored in iOS, printed, committed, or exposed in app UI. Future work needs a separate backend provider contract, local ignored server-side credentials, consent/privacy copy, sanitized request/response logging, quota/rate limits, and explicit approval before any real provider call.

## A7 Physical-device QA Checklist

Run on iPhone from Xcode:

- Open Camera with local guidance enabled.
- Confirm safe local lighting hints still appear for very dark / very bright scenes.
- Confirm safe filter / unavailable hints can still appear.
- Confirm app-authored composition / portrait-layout hints remain suppressed:
  - subject centering
  - edge margin
  - headroom
  - face distance
  - subject size
  - portrait-ready
  - rule-of-thirds
  - vertical balance
- Create a scene where local geometry is detected but no lighting/filter hint is eligible; confirm the expanded guidance surface falls back to the safe local-unavailable hint instead of appearing blank.
- Confirm compact local guidance does not use the `sparkles` icon when no visible suggestion exists.
- Confirm `Next hint` is disabled when only one hint is visible.
- Confirm Camera capture still works.
- Confirm live filter preview still matches post-capture output.
- Confirm selfie mirror parity still works.
- Confirm back-camera hardware flash / front-camera local screen flash still works.
- Confirm focal crop box, pinch, aspect, drag, and capture-crop behavior still works.

## Currently Installed in App Runtime

These are present in the iOS app/runtime track and should be regression-tested before new app work:

- AVFoundation camera capture path.
- Device-detected front/back/lens switching.
- Local retro filter pipeline and live filtered preview.
- Front-camera mirror preview / mirror-save / post-capture flip behavior.
- Hardware-gated back flash and local front screen flash behavior.
- Focal framing-box crop with dynamic aspect and pinch control.
- Local Apple Vision / AVFoundation signal path for in-memory live guidance signals.
- AVFoundation depth capability bucket probe only.
- Local non-composition guidance shell with safe lighting/filter/unavailable hints.
- A7 safe fallback when post-A6 filtering leaves no visible hint.

## Not Yet Installed in App Runtime

These items are planned, scaffolded, research-only, backend-only, or blocked; they are not installed as production app runtime features:

### Camera Live Cloud AI / Live Advisor

- Camera live cloud AI entry.
- Live Advisor UI surface for cloud analysis.
- Auto-Trigger runtime.
- Stillness-triggered frame capture.
- Max 1 FPS cloud frame analysis runtime.
- Stateful WSS client/session runtime.
- Server busy/backoff live session handling.
- Preview-frame upload loop.
- Capture-context upload.

Status: no longer needed for the Camera page under the current product direction. Keep blocked unless the user explicitly reverses this decision.

### Inspiration / Post-capture Cloud AI

- Real Qwen3-family photo analysis in Inspiration / post-capture Photo Advisor.
- Real Qwen3-family generated filter / Filter Lab provider path.
- Real GPT Image 2.0-style image editor / 改圖師 provider path.
- Backend-mediated mainland relay provider adapter.
- Server-side local ignored API key handling.
- Sanitized backend request/response contract.
- Consent, quota, rate limit, fallback, and privacy/App Store copy.

Status: still needed as future cloud AI product work, but not installed in app runtime yet. Must not add direct iOS provider calls or provider keys.

### Upload Payload / Cloud Photo Processing

- App-side compressed preview upload runtime for live guidance.
- Metadata stripping runtime for future cloud frame upload.
- Original full-resolution cloud upload for live guidance.
- Retention/deletion policy enforcement for live cloud analysis payloads.
- Production app-facing Photo Advisor endpoint integration.

Status: policy/planning exists, but runtime remains blocked. Current app must not change upload payloads without a future approved schema/consent phase.

### Provider / Model Integration in iOS

- SiliconFlow endpoint/key in iOS.
- RunPod raw URL/key in iOS.
- Qwen/OpenAI/Gemini/provider SDK direct calls in iOS.
- Provider/model selection from iOS.
- Raw provider output display in app UI/history.

Status: blocked by backend-mediated provider boundary. Provider keys must remain server-side only.

### On-device Model Runtime

- Depth Anything V2 Small model artifact.
- Depth Anything Core ML package in app bundle.
- Depth Anything inference execution.
- Depth Anything Camera runtime integration.
- Florence-2-base model/runtime.
- Florence semantic region / caption / segmentation runtime.
- MLX / ONNX / TFLite model package for live framing.

Status: research/scaffold/gate only. Future physical-device benchmark and artifact/source/license review are required before any model package is added.

### Training-AI / Dataset / Labeling Branch

- Dataset collector runtime.
- Dataset crawler.
- AI-assisted labeling provider adapter.
- Provider labeling run.
- Human review dashboard.
- User-photo training.
- Fine-tuning / LoRA / QLoRA / distillation runtime.
- Typed composition output contract from training-AI into app.

Status: separate branch. It must start with source/license/consent manifest, label schema, human review, privacy/legal gates, and sanitized outputs only.

### Advanced Local Camera Aids

- Grid alignment analysis beyond static/grid UI.
- Horizon/level guide as a polished production aid.
- Overexposed/underexposed warning beyond existing safe local hints.
- Motion/stability bucket UI.
- Debug-only typed geometry/depth overlays for developer QA.
- 60 FPS local CV aid tuning.

Status: planned/partial. Must remain local-only, in-memory, non-sensitive, and non-uploading.

### Account / Storage / Monetization / Release

- Production Firebase project wiring.
- Production Firestore/Storage history policy.
- Production Photo Advisor storage/deletion flow.
- StoreKit/paywall/quota production runtime.
- Backend entitlement bridge.
- App Store privacy labels finalization.
- TestFlight/beta rollout checklist.
- Production monitoring / alerting / kill switch.

Status: partial/scaffold/planned. Production rollout remains blocked.

### Advanced/Future Product Features

- Paid AI image editing backend.
- Social caption generation.
- Live voice or conversational camera guidance.
- High-quality export/transfer workflow.
- Advanced retro effects beyond current local filter path.

Status: deferred and not MVP default.

## Roadmap Interpretation

- Phase 21-A/A3/A4/A6/A7 are the current app-side on-device live framing path.
- Phase 21-B is capability-only depth probing, not depth-map runtime.
- Phase 21-C remains Depth Anything sandbox/gating, not production model integration.
- Phase 21-D/E and training-AI work remain separate research/offline/backend branches.
- Backend VLM/SiliconFlow/RunPod work remains useful for post-capture Photo Advisor and evaluation, not live Camera default.

## Next Recommended Step

Do not start another feature phase until the operator verifies Phase 21-A7 on MacBook/Xcode physical device or explicitly accepts the pending QA risk.

Recommended next label:

`Phase 21-A7-VERIFY-RUN - Operator MacBook/Xcode Physical-device QA`

## Boundary Confirmations

- Swift runtime changed: no
- iOS project settings changed: no
- Provider/model/cloud call: no
- Camera live cloud AI entry: no
- Preview-frame upload: no
- Upload payload changed: no
- Raw frame/depth/image persistence: no
- Dataset crawler added: no
- AI-assisted labeling run added: no
- User-photo training added: no
- Model file / Core ML package added: no
- Depth Anything runtime added: no
- Florence runtime added: no
- Sensitive inference added: no
- `productionReady:false` remains locked.
