# PT2-SF-R9-R13 - Filter Lab Recipe Fidelity Calibration

Status: implemented; pending Mac/Xcode and bounded provider compatibility/fidelity QA

Date: 2026-07-19

Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R13 improves how Filter Lab converts one already-styled reference image into the app's bounded local filter recipe. It is a prompt/schema/renderer calibration phase, not an exact-copy feature and not a production Cloud AI rollout.

The phase follows the operator-approved research direction:

- separate repeatable filter characteristics from subject matter, object colors, scene lighting, time of day, camera exposure, and composition;
- give the model explicit renderer semantics instead of parameter names/ranges only;
- remove the amber/soft-film fallback recipe from the runtime prompt so uncertain images do not inherit a preferred look;
- use SiliconFlow structured `json_schema` output instead of JSON mode for the Filter Lab recipe path;
- make the local renderer consume every approved recipe control, including grain;
- compare future synthetic known-recipe runs with sanitized aggregate parameter error buckets.

## Research Basis

- SiliconFlow recommends Structured Outputs over JSON mode when the response must follow a schema and recommends clear field names/descriptions plus evals: <https://docs.siliconflow.com/en/userguide/guides/structured_outputs>
- SiliconFlow documents `detail: high` for multimodal image input: <https://api-docs.siliconflow.cn/docs/userguide/capabilities/multimodal-vision>
- Qwen3-VL supports image reasoning and multi-image comparison, but this phase keeps the app contract at exactly one uploaded style/reference image: <https://github.com/QwenLM/Qwen3-VL/blob/main/README.md>
- Filter Style Transfer research describes extraction from one already-filtered reference as an ill-posed inverse problem rather than a text-prompt-only problem: <https://arxiv.org/abs/2007.07925>
- WACV 2022 filter-extraction work evaluates known synthetic vignette/grain strengths and regenerates those effects separately: <https://openaccess.thecvf.com/content/WACV2022/papers/Abdelhamed_Extracting_Vignetting_and_Grain_Filter_Effects_From_Photos_WACV_2022_paper.pdf>
- LUT research shows that richer color mappings can improve style transfer but remains outside this parameter-only phase: <https://openaccess.thecvf.com/content/WACV2025/html/Li_D-LUT_Photorealistic_Style_Transfer_via_Diffusion_Process_WACV_2025_paper.html>

## Backend Changes

- Added a strict Filter Lab recipe JSON Schema with `additionalProperties:false`, required fields, enums, numeric limits, and renderer-specific descriptions.
- Added a shared color-science system prompt.
- Added ordered visual evidence rules: visible controls, neutral surfaces, luminance distribution, chroma distribution, then spatial grain/vignette evidence.
- Added explicit content/style disentanglement and ambiguity handling.
- Added renderer calibration anchors for all eight parameters.
- Removed the runtime example recipe and preferred amber/soft fallback from the SiliconFlow and QA prompts.
- Updated the SiliconFlow runtime and QA request builders to use `response_format.type=json_schema`.
- Kept Xiaoyi on JSON mode for compatibility while sharing the calibrated prompt contract.

## iOS Renderer Changes

- Generated Filter Lab previews now start at intensity `1.0`, so the returned recipe is shown at full strength before the user reduces it.
- Exposure is applied only once through `CIExposureAdjust`; it is no longer duplicated through `CIColorControls` brightness.
- Grain is now rendered locally with bounded monochrome noise and a soft-light blend.
- Existing R12 memory controls remain: imported and preview images are bounded to a `1600` pixel long edge, Core Image intermediate caching is disabled, and caches are cleared after render.

## Synthetic No-network QA

Added a sanitized fidelity evaluator that:

- validates expected and actual recipes with the production recipe validator;
- computes per-parameter absolute-error buckets;
- records direction mismatches and strong controls neutralized toward zero;
- never includes the expected/actual raw recipes, images, provider text, or provider payloads;
- makes zero provider calls and reads zero images in its unit tests;
- always reports `productionReady:false`.

This evaluator is ready to consume future approved synthetic provider results, but no provider/model call was made in this phase.

## Verification

- Targeted Node tests: `83/83` passed during implementation.
- Provider/model calls: `0`.
- Network image uploads: `0`.
- Xcode/Swift build: pending Mac/Xcode.
- Physical-device memory and repeated-intensity test: pending.
- SiliconFlow Qwen3-VL `json_schema` deployment compatibility: pending a separately approved bounded provider QA.
- Visual temperature/tint direction and grain-strength calibration: pending physical-device review.

## Non-negotiable Boundaries

- Backend receives exactly one style/reference image.
- Apply/original image remains local-only.
- No iOS provider key, provider URL, SDK, or direct provider call.
- No Camera cloud AI entry or capture-context upload.
- No raw prompt, request, provider response, image/base64, API key, or Authorization-header logging/persistence.
- No generated bitmap, shader, remote LUT URL, real image-editing provider, or exact-copy promise.
- No production rollout; `productionReady:false` remains locked.

## Required Follow-up

1. Build and run on a physical iPhone from Mac/Xcode.
2. Confirm the R12 bounded-memory test still passes with local grain rendering and repeated intensity changes.
3. Confirm positive/negative temperature and tint directions visually match the documented recipe semantics.
4. Compare the generated result at intensity `1.0` with the reference, then reduce intensity only as a user choice.
5. If explicitly approved later, run one bounded synthetic SiliconFlow compatibility case first. Stop if `json_schema` is rejected; do not silently fall back or run a batch.
6. A multi-fixture prompt A/B or LUT/advanced renderer phase requires separate explicit approval.
