# Depth Anything V2 Small Core ML Report

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

Depth Anything V2 Small is a future on-device fallback candidate for devices or camera modes where usable hardware depth is not available. It should not replace AVFoundation hardware depth when hardware depth exists. It should not be bundled or enabled in production until latency, memory, FPS, thermal, battery, model size, and safety thresholds pass on representative iPhones.

Recommendation: Depth Anything V2 Small should be a debug-only benchmark first and a possible future fallback only after pass/fail gates are met.

## Why This Matters For Our App

Depth can make retro live framing more cinematic without cloud latency:

- foreground/background separation.
- subject distance bucket.
- layered composition.
- background compression / silhouette-aware hints.

The app should use depth as a composition signal only. It must not infer identity, body traits, health, or precise real-world measurements.

## Recommended Architecture

```text
AVFoundation hardware depth available?
-> yes: use AVDepthData buckets
-> no: if high-tier/debug-approved, run Depth Anything V2 Small on resized frame
-> normalize into DepthSignals
-> app rules engine
-> short retro-aware hint
```

Hardware depth always wins. Depth Anything is optional, disabled by default, and benchmark-gated.

## Model Variants And iPhone Realism

Depth Anything V2 includes multiple sizes. The realistic iPhone candidate is the small variant because larger variants are more likely to exceed latency, memory, thermal, and app-size budgets. Exact parameter counts, Core ML package details, license, and model-card version must be verified before use.

Do not claim any specific iPhone tier can run it until benchmarked.

## Core ML Package

Public Core ML packages / examples exist for Depth Anything V2 Small. Before any use:

- verify source and license.
- verify model input/output format.
- verify deployment target.
- verify whether it uses Neural Engine, GPU, or CPU.
- verify app size impact.
- verify whether post-processing is required.

No Core ML package is added in this task.

## Input Size To Test

Benchmark multiple resized inputs:

- 256 short side or square-like low input for live fallback.
- 384 if quality is insufficient.
- 518 or model-native size only for post-capture/debug if latency allows.

The target is not photorealistic metric depth; it is stable relative depth buckets for composition.

## Depth Output Use

Allowed:

- relative foreground/background separation.
- subject distance bucket: near / mid / far / unknown.
- background layering: flat / layered / uncertain.
- depth confidence bucket.
- silhouette/backlight composition context.

Not allowed:

- identity inference.
- body/health inference.
- precise real-world measurement unless calibrated and approved.
- face depth profiling.
- persistent depth maps.
- raw frame/depth logging.

## Benchmark Pass / Fail Gates

Required metrics:

- model load time.
- first inference latency.
- warmed inference latency.
- peak memory.
- preview FPS impact.
- thermal state over 3-5 minutes.
- battery drain bucket.
- output stability across adjacent frames.
- invalid/low-confidence output rate.
- app size increase.

Suggested initial pass gates, all needing real device validation:

- no crash or memory pressure.
- no sustained preview FPS degradation.
- no thermal escalation beyond acceptable bucket during short debug run.
- warmed inference fast enough for chosen cadence.
- output stable enough for composition buckets.
- disabled automatically on low-tier devices.

Fail closed if:

- thermal state rises quickly.
- memory warning occurs.
- output flickers between frames.
- model load blocks camera launch.
- app size impact is unacceptable.

## Device Handling

- Low-end/older phones: disabled.
- Mid-tier phones: debug-only if benchmark passes.
- High-end phones: possible fallback candidate after benchmark.
- M-series iPad/Mac: good sandbox, not proof of iPhone production readiness.

Runtime should detect device tier, thermal state, battery state, and camera FPS before enabling any model fallback.

## Bundle vs On-demand

Bundling:

- simpler offline behavior.
- increases app size.
- may affect App Store download size.

On-demand:

- smaller base app.
- requires download policy, integrity checks, offline fallback, deletion behavior, and App Store/privacy review.

Recommendation: no bundle and no on-demand download until benchmarks justify the feature.

## Risks / Blockers

- App size.
- Neural Engine / GPU compatibility.
- Thermal throttling.
- Battery impact.
- Model load time.
- Depth flicker across frames.
- Low-light failure.
- User expectation that depth is precise.

## Privacy And Safety Notes

On-device depth is safer than cloud upload, but it still needs privacy review if any depth-derived data is stored or transmitted. Current direction: do not store or transmit depth maps. Use ephemeral buckets only.

## Suggested Phases

- Phase 21-B: AVFoundation Depth Capability Probe.
- Phase 21-C: Depth Anything V2 Small Core ML Sandbox.
- Later: disabled-by-default fallback only if benchmark passes.

## Do Now / Do Later / Do Not Do

Do now:

- Keep AVFoundation hardware depth first.
- Document benchmark gates.

Do later:

- Run debug-only Core ML benchmark with synthetic/approved samples.
- Compare against hardware depth and Vision-only baseline.

Do not do:

- Do not bundle Depth Anything now.
- Do not download models now.
- Do not use depth for identity/body/health inference.
- Do not persist raw depth maps.

## Concrete Next Codex Prompt

`Phase 21-C: Depth Anything V2 Small Core ML Sandbox Plan - add benchmark-only docs/tests for latency, memory, FPS, thermal, battery, and safety gates. Do not add model files, Core ML packages, runtime code, downloads, frame uploads, or production rollout. Keep productionReady:false.`

## Source Notes

- Depth Anything V2 GitHub: https://github.com/DepthAnything/Depth-Anything-V2
- Apple Core ML Depth Anything V2 Small model page: https://huggingface.co/apple/coreml-depth-anything-v2-small
- Apple AVDepthData docs: https://developer.apple.com/documentation/avfoundation/avdepthdata

