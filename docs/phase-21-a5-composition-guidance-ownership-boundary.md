# Phase 21-A5 - Composition Guidance Ownership Boundary

Status: docs-only boundary update  
Date: 2026-06-21  
Production readiness: `productionReady:false`

## Summary

Phase 21-A5 records the product direction clarification that richer composition guidance should be owned by the training-AI branch, not expanded inside the on-device Camera runtime.

The app-side live Camera layer should remain the lightweight, local, low-latency shell:

- collect safe local geometry signals.
- collect safe depth capability / depth buckets where available.
- show short fallback guidance and UI affordances.
- preserve the mood-first retro UX.
- avoid becoming a score / problem / fix / retake system.

The training-AI branch should own deeper composition intelligence:

- richer composition hint generation.
- learned scene/layout patterns.
- dataset labels and human review.
- AI-assisted labeling and distillation planning.
- future model output converted to typed app-safe signal JSON.

## App Runtime Boundary

The iOS Camera runtime should not add more app-authored composition advice beyond conservative local fallback hints. It may pass through safe typed signals later only after an explicit approved contract.

Allowed app-side responsibilities:

- Apple Vision / AVFoundation geometry and depth capability detection.
- safe signal buckets such as subject position, margins, headroom, size ratio, and depth availability.
- short non-judgmental fallback hints.
- local UI controls, hint shell, and debug-only overlays if separately approved.

Blocked in this phase:

- no new model file.
- no Core ML inference.
- no Depth Anything runtime.
- no Florence runtime.
- no cloud live AI.
- no preview-frame upload.
- no upload payload change.
- no provider/model key.
- no dataset crawler.
- no AI-assisted labeling run.
- no user-photo training.
- no raw frame/image/depth persistence.
- no sensitive inference.
- no production rollout.

## Training-AI Branch Boundary

The training-AI branch may later define:

- label schema for composition and retro intent.
- source/consent/license manifest.
- AI-assisted labeling dry-runs with structured JSON only.
- human review gates.
- benchmark gaps that justify distillation or fine-tuning.
- typed composition signal output for app integration.

Any training-AI work must still respect privacy, consent, retention/deletion, source licensing, human review, no sensitive attributes, and `productionReady:false` until a separate rollout phase.

## Next Recommended Step

If continuing app-side feature development, choose a non-composition Camera feature or a UI/runtime polish phase. If continuing AI composition work, use a separate training-AI branch phase that starts with dataset/label schema and legal/source gates, not app runtime composition logic.
