# Florence-2-base iOS Live Framing Report

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

Microsoft Florence-2-base is a strong research candidate for a retro / film / Dazz-like camera app because it is designed as a vision-language foundation model that can return task-specific outputs for object detection, phrase grounding, detailed captioning, region descriptions, and segmentation-style tasks. For this product, the useful output is not free-form text; it is typed geometry and semantic-region signals that the app rules engine can convert into mood-first, non-judgmental Live Framing hints.

Recommendation: Florence-2-base should be treated as a research-only candidate for live framing and a possible debug-only / post-capture-only candidate after benchmark. Do not treat it as a production live camera engine, and do not assume 30-50ms iPhone runtime until a device benchmark proves it.

## Why This Matters For Our App

The app needs short, creative-intent preserving guidance, not a generic AI critic. Florence-2 could help identify regions such as person, sky, background, table, window, street sign, or object clusters. Those signals could support app-generated hints like:

`Observation -> Mood -> Retro intent -> Optional action`

Example app-side interpretation:

- Geometry signal: person box too close to left edge.
- Semantic signal: strong window/backlight region behind subject.
- App hint: `Subject is close to the edge; the backlight has a film silhouette mood; leave a little air if you want a calmer frame.`

Florence-2 must not write final UI copy directly.

## Useful Florence-2 Tasks

Priority tasks for this app:

1. Object detection
   - Useful for subject boxes, prop regions, background objects, sky/building/street/table clusters.
   - Must map into bounded region IDs, not open-ended labels shown to users.
2. Phrase grounding
   - Useful for asking bounded phrases such as `person`, `sky`, `window`, `table`, `car`, `building`, `background`.
   - Best fit for typed semantic regions if output can be validated.
3. Detailed captioning
   - Useful for offline QA and post-capture scene understanding.
   - Too risky for live UI because captions may include sensitive or unsupported language.
4. Segmentation
   - Useful if it produces stable masks for foreground/background, person regions, or sky/background separation.
   - Expensive and must be benchmarked before live use.

Lower priority:

- OCR unless a future feature needs signage awareness.
- Open-vocabulary rich captioning in the live camera loop.
- Any output that invites identity, age, gender, emotion, attractiveness, health, ethnicity, religion, disability, or body inference.

## Recommended Architecture

Florence-2 output should be converted into app-safe typed geometry JSON:

```json
{
  "source": "florence_2_base_debug",
  "frameIdBucket": "ephemeral",
  "regions": [
    {
      "regionId": "r1",
      "kind": "person_or_subject",
      "box": { "x": 0.33, "y": 0.18, "width": 0.32, "height": 0.64 },
      "confidenceBucket": "medium",
      "maskRef": null
    }
  ],
  "semanticBuckets": ["subject_present", "backlight_possible"],
  "unsafeOutputRejected": false,
  "rawTextStored": false,
  "productionReady": false
}
```

Rules:

- Keep normalized coordinates only.
- Drop or bucket confidence; do not expose scores.
- Reject sensitive labels and free-form user-facing text.
- Validate against a schema before app rules consume it.
- Never persist raw model text, raw prompts, raw frames, or raw masks unless a later safe artifact policy explicitly allows synthetic/debug assets.

## Technical Options

### Core ML

Core ML is the preferred iOS-native runtime if the model can be converted and decoded safely. Blockers include model size, encoder/decoder graph shape, tokenizer/decoder complexity, unsupported operations, memory pressure, app launch time, and latency.

Use only after a conversion feasibility spike. Do not bundle a converted model in the app until app size, device compatibility, thermal, and App Store implications are reviewed.

### ONNX Runtime + CoreML Execution Provider

ONNX Runtime may be useful as a conversion bridge if Core ML direct conversion is blocked. It adds dependency/runtime complexity and still needs CoreML Execution Provider compatibility checks. It is not automatically faster or simpler than Core ML.

### MLX / Swift Path

MLX is promising for Apple silicon experimentation, especially on Mac and possibly high-end iOS paths later, but it should be treated as feasibility research. The production iOS packaging story, operator support, memory behavior, and Swift integration need source verification and benchmark.

### Server-side Benchmark Fallback

A backend/offline benchmark can evaluate Florence-2 quality without iOS runtime risk. This is useful for comparing Florence output against Apple Vision baseline and for possible future label generation. It must remain backend/offline and sanitized; no live camera upload is approved here.

## Device Tier Considerations

No phone tier should be claimed supported until benchmarked.

- A12 / A13 older devices: likely Vision-only path; Florence-2 live inference should be disabled unless benchmark proves otherwise.
- A15 / A16 mid devices: possible debug still-image or post-capture experiment only after memory/latency checks.
- A17 Pro / A18 Pro high-end devices: best candidate for debug/post-capture on-device experiment, still not assumed real-time.
- iPad / M-series devices: best sandbox for conversion and early performance testing, but iPad success does not prove iPhone live readiness.

## Minimum Benchmark Plan

Before any integration:

1. Convert/load feasibility on Mac.
2. Synthetic still-image inference smoke with no real user photos.
3. Measure model load time, peak memory, first inference latency, warmed latency, and output validity.
4. Test object detection, phrase grounding, detailed captioning, and segmentation separately.
5. Run on representative devices: older, mid, high-end, and M-series if available.
6. Verify thermal over 3-5 minutes of repeated low-frequency sampling.
7. Verify no raw model text or frames are logged.
8. Compare quality against Apple Vision baseline.

Pass gates:

- No crash or memory pressure.
- Output maps to typed geometry JSON.
- Invalid/sensitive output is rejected.
- Latency fits the chosen mode: post-capture, debug still, or low-frequency sampling.

## Risks / Blockers

- Model size and memory pressure.
- Tokenizer and autoregressive decoder complexity.
- Conversion unsupported ops.
- Segmentation mask post-processing complexity.
- Slow first-token / full-output latency.
- Thermal throttling and battery impact.
- App size and launch time.
- Free-form text safety.
- Output instability between frames.

## Privacy And Safety Notes

- Florence must not infer identity, age, gender, emotion, attractiveness, skin, health, ethnicity, religion, disability, or body traits.
- Face/person regions are geometry only.
- No raw frames, masks, captions, prompts, or model outputs should be persisted.
- No cloud upload is approved for live framing.
- User-facing copy must be generated by the app language/rules layer.

## Suggested Phases

- Phase 21-D: Florence-2-base Feasibility Study, research only.
- Later: no-runtime typed output schema.
- Later: debug-only server-side/post-capture benchmark.
- Later: on-device conversion benchmark if still justified.

## Do Now / Do Later / Do Not Do

Do now:

- Keep Florence-2 as research-only.
- Define typed geometry/signal contract.
- Compare intended tasks against Apple Vision baseline.

Do later:

- Run conversion feasibility.
- Run sanitized still-image benchmark.
- Test high-end devices first.

Do not do:

- Do not add Florence-2 model files.
- Do not add Core ML / ONNX / MLX runtime code.
- Do not show Florence free-form text in UI.
- Do not use it for live production until benchmark proves latency, memory, safety, and thermal behavior.

## Concrete Next Codex Prompt

`Phase 21-D: Florence-2-base Feasibility Study - create no-runtime typed output schema and benchmark plan only. Do not add model files, conversion scripts, runtime dependencies, API calls, image uploads, or iOS integration. Keep productionReady:false.`

## Source Notes

- Microsoft Florence-2 model page: https://huggingface.co/microsoft/Florence-2-base
- Microsoft Florence-2 project/model discussion: https://huggingface.co/microsoft/Florence-2-base-ft
- ONNX Runtime CoreML Execution Provider: https://onnxruntime.ai/docs/execution-providers/CoreML-ExecutionProvider.html
- Apple MLX project: https://github.com/ml-explore/mlx

