# On-device AI Research Index

Status: research index
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

This index links the research set for the new on-device Live Framing AI direction. It preserves the current roadmap/register decision: the next recommended implementation phase remains `Phase 21-A - On-device Vision Geometry Spike`.

The research set is documentation-only. It adds no runtime code, no model files, no Core ML/ONNX/TFLite packages, no dataset crawler, no provider labeling adapter, no provider/model API keys, no direct iOS provider/model calls, no Camera live cloud AI entry, no preview-frame upload, and no upload payload change.

## Recommended Reading Order

1. `docs/on-device-live-framing-ai-roadmap.md`
2. `docs/research/apple-vision-live-framing-advisor-report.md`
3. `docs/research/on-device-live-framing-hybrid-architecture.md`
4. `docs/research/device-capability-matrix-live-ai.md`
5. `docs/research/depth-anything-v2-small-coreml-report.md`
6. `docs/research/florence-2-base-ios-live-framing-report.md`
7. `docs/research/live-ai-privacy-safety-appstore-report.md`
8. `docs/research/dataset-collector-bot-labeling-pipeline-report.md`
9. `docs/research/florence-2-finetune-distillation-workflow.md`

## Reports Created

| Report | Purpose | Recommendation |
| --- | --- | --- |
| `apple-vision-live-framing-advisor-report.md` | Apple Vision + AVFoundation live geometry path | Implementation-ready for Phase 21-A |
| `on-device-live-framing-hybrid-architecture.md` | Unified architecture and typed signal contracts | Use Vision/depth/rules as production path |
| `device-capability-matrix-live-ai.md` | Device tiers and runtime gating | iOS-first tiers; experimental models disabled by default |
| `depth-anything-v2-small-coreml-report.md` | Depth Anything V2 Small fallback research | Debug-only benchmark first |
| `florence-2-base-ios-live-framing-report.md` | Florence-2 feasibility for semantic regions | Research-only / debug-post-capture candidate |
| `live-ai-privacy-safety-appstore-report.md` | Privacy, App Store, and safety policy | Local/ephemeral live inference; legal gates for data |
| `dataset-collector-bot-labeling-pipeline-report.md` | Dataset and AI-assisted labeling pipeline | Manifest-only first; no crawler now |
| `florence-2-finetune-distillation-workflow.md` | Fine-tuning/distillation workflow | Blocked until dataset/legal/eval gates pass |

## Recommended Next Implementation Phases

Do next:

- `Phase 21-A - On-device Vision Geometry Spike`
  - Apple Vision / AVFoundation only.
  - Geometry-only signals.
  - No cloud, no upload, no model files, no sensitive inference.

Do after Phase 21-A:

- `Phase 21-B - AVFoundation Depth Capability Probe`
  - hardware depth / portrait matte capability states.
  - no depth persistence.

Research/debug later:

- `Phase 21-C - Depth Anything V2 Small Core ML Sandbox`
- `Phase 21-D - Florence-2-base Feasibility Study`
- `Phase 21-E - Dataset Collector + AI-assisted Labeling Pipeline Skeleton`

## Research-only Items

- Florence-2 live production use.
- Depth Anything production bundle.
- Fine-tuning / LoRA / QLoRA.
- Dataset crawler.
- AI provider labeling run.
- Android runtime options.

## Items That Can Become Implementation Phases

- Apple Vision geometry signal extraction.
- Coordinate mapping tests.
- Composition signal buckets.
- AVFoundation depth capability detection.
- Device tier/capability detection.
- Debug-only overlay after Phase 21-A/B.

## Blocked By Benchmark / Legal / Privacy Review

- Depth Anything model bundling or download.
- Florence-2 on-device inference.
- Provider-assisted labeling.
- User photo training/eval use.
- Dataset downloading.
- Fine-tuning.
- Production rollout.

## Shared Product Language

All reports preserve:

- retro / film / Dazz-like camera app.
- mood-first.
- non-judgmental.
- creative-intent preserving.
- `Observation -> Mood -> Retro intent -> Optional action`.

Do not convert guidance into:

- score.
- problem.
- fix.
- retake.

## Boundary Confirmation

- Runtime implementation added: no.
- Model files added: no.
- Core ML / ONNX / TFLite package added: no.
- Dataset crawler added: no.
- AI provider labeling adapter added: no.
- Provider/model API key added: no.
- Direct provider/model call in iOS added: no.
- Camera live cloud AI added: no.
- Preview frames uploaded: no.
- Backend/iOS upload payload changed: no.
- `productionReady:false` remains locked.

