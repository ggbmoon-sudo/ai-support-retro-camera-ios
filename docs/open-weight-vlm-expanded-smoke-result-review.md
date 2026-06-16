# Open-weight VLM Expanded Smoke Result Review

Status: Phase 20-K review / planning only
Date: 2026-06-16
Scope: Windows-primary local/private VLM sandbox review

## Executive Summary

Phase 20-J successfully reran the controlled expanded local/private Qwen2.5-VL smoke after the fixture-routing fix. The run made exactly eight approved fixture calls, one per fixture token, with no retries and no extra fixtures. All eight were accepted by the backend validator with no validation, fallback, or schema diagnostic buckets.

This is useful sandbox evidence, not production readiness. Phase 20-K does not run Qwen inference, add fixture images, expand the real local registry, benchmark serving stacks, start iOS integration, add an app-facing endpoint, add a production endpoint, train/fine-tune, or change `productionReady:false`.

Recommended next phase: **Phase 20-L - 12-Fixture Coverage Expansion Plan + No-model Registry Gate**. The next useful step is coverage planning, not iOS integration or production rollout.

## Phase 20-J Result Summary

- `fixtureCount:8`
- `acceptedCount:8`
- `rejectedCount:0`
- `acceptanceRate:100%`
- `validationCodeCounts:null x8`
- `fallbackCategoryCounts:null x8`
- `schemaErrorBucketCounts:none`
- `schemaFieldBucketCounts:none`
- `latencyBucketCounts:gt_15s x3, 5s_to_15s x5`
- `networkCallsMade:true`
- `productionReady:false`
- raw prompt, model response, image, image path, and request payload persisted flags false

The repeatability gate and failure/latency taxonomy passed with a latency note.

## What The 8-Fixture Smoke Proves

- The backend can call the local/private Windows Qwen2.5-VL FastAPI server through the sandbox path.
- The expanded fixture routing issue was resolved for the approved eight-token set.
- `smoke_001` through `smoke_008` can route and infer through the local/private server.
- All eight returned candidates can pass the strict backend validator.
- The repeatability and failure/latency taxonomy gates can interpret the sanitized aggregate result.
- Raw persistence flags stayed false in the recorded result.
- The Windows-primary backend/VLM workflow is viable for controlled sandbox evaluation.

## What It Still Does Not Prove

- No production readiness.
- No iOS integration.
- No real user-photo upload.
- No consent UI for real self-hosted VLM analysis.
- No app-facing endpoint.
- No production endpoint.
- No quota, billing, entitlement, abuse, or cost control implementation.
- No retention/deletion policy implementation for VLM image handling.
- No App Store privacy disclosure update.
- No broad dataset coverage.
- No hard negative set beyond limited categories.
- No concurrency, throughput, timeout, cancellation, or load test.
- No vLLM, SGLang, Ollama, or LM Studio comparison.
- No multilingual real-output review.
- No fine-tuning or training.
- No on-device model.

## Latency Note Interpretation

Phase 20-J latency distribution was:

- `gt_15s x3`
- `5s_to_15s x5`

Interpretation:

- The functional smoke passed.
- A latency note remains for sandbox review.
- This is not a production blocker inside the current sandbox because the phase measures contract validity and routeability, not product latency.
- This is not production approval.
- Future benchmark work should track latency distribution across a stable fixture set.
- Serving-stack benchmarking may be considered later, but only after the coverage plan and no-model registry controls are stable.

## Dataset Coverage Matrix

| Category | Phase 20-J Coverage | Notes |
| --- | --- | --- |
| `bright_daylight_clean` | covered | Basic clean daylight signal is represented. |
| `low_light_grain` | covered | Low-light / grain acceptance is represented. |
| `motion_blur_intentional` | covered | Intentional motion / blur acceptance is represented. |
| `high_contrast_shadow` | covered | Contrast / shadow acceptance is represented. |
| `faded_color_retro` | covered | Faded retro color acceptance is represented. |
| `imported_limited_context` | covered by registry target | Needs broader imported-photo scenario review later. |
| `severe_blur_reject` | covered by registry target | Needs stronger hard-negative review later. |
| `black_or_near_black_unreadable` | covered by registry target | Needs stronger severe-risk review later. |
| `warm_indoor_ambient` | missing | Useful next coverage candidate. |
| `soft_focus_dreamy` | missing | Useful next acceptable-imperfection candidate. |
| `street_chrome_high_contrast` | missing | Useful next filter-fit / contrast candidate. |
| `overexposed_unreadable` | missing | Useful next severe technical-risk candidate. |

## Missing Fixture Categories

Recommended missing or under-covered categories:

- `warm_indoor_ambient`
- `soft_focus_dreamy`
- `street_chrome_high_contrast`
- `overexposed_unreadable`
- `backlit_subject_or_scene`
- `cluttered_frame`
- `tilted_intentional_snapshot`
- `night_grain_city`
- `washed_out_flash`
- `mixed_light_color_cast`
- `low_detail_texture_scene`
- `abstract_or_minimal_scene`

## Missing Real-world Scenarios

- Indoor mixed lighting.
- Backlit scenes.
- Cluttered but non-sensitive scenes.
- Tilted snapshots that should preserve style rather than force correction.
- Night city grain and high-contrast artificial light.
- Washed-out flash or harsh exposure.
- Low-detail texture scenes that may confuse subject/focus assumptions.
- Minimal or abstract scenes where advisor copy should stay humble.
- Imported photos with limited capture context.
- Repeat runs across the same fixture set on different days or server restarts.

## Risk / Reject Coverage Gaps

The current accepted aggregate is encouraging, but risk coverage remains thin. Future coverage should add no-model registry planning before any real smoke for:

- severe overexposure / unreadable image
- severe blur / unreadable image
- black or near-black image
- low-detail scene that should avoid hallucinated details
- safe reject cases that are expected to reject without raw artifacts

Safe rejection is valid data and should not be hidden or retried away.

## Imported-photo Coverage Gaps

Imported-photo review still needs more evidence that the model and mapper avoid capture-time overclaims. Future fixtures should include image-only context cases where the advisor must not claim motion, tilt, exposure, lens, focus, or device-stability context from capture metadata.

## Multilingual / Copy Coverage Gaps

Phase 20-J validates backend candidate schema, not final multilingual UI copy. Existing copy gates still cover Photo Advisor language, filter reasons, CreativeIntent, and result-card regression. Future real-output review should still check that accepted backend candidates can map into English, Traditional Chinese, Simplified Chinese, and Cantonese-style app copy without score/rating language, harsh fix-it phrasing, sensitive inference, raw localization keys, or internal classification leakage.

## Recommended Next Phase

Recommend:

**Phase 20-L: 12-Fixture Coverage Expansion Plan + No-model Registry Gate**

Phase 20-L should:

- stay backend-only and Windows-primary
- target 12 fixtures total, not more
- plan category coverage before model calls
- validate only sanitized registry metadata
- include no-model routing/registry checks
- keep fixture images, local registry, local config, reports, logs, prompts, model outputs, request payloads, credentials, and model weights ignored
- require explicit future user approval before any real local/private model smoke

Do not recommend iOS integration, production endpoints, or serving-stack benchmarking yet. The fixture coverage plan should become stronger first.

## Production Boundary

`productionReady:false` remains required. Phase 20-K is review/planning only and does not authorize production rollout, iOS integration, Camera cloud AI, capture-context upload, app-facing endpoints, production endpoints, broader real smoke, serving-stack benchmarking, training/fine-tuning, or user-photo use.

## Phase 20-L Follow-up

Phase 20-L implements the recommended next step as a no-model 12-fixture registry gate. The planned target keeps the eight Phase 20-J/K categories and adds `warm_indoor_ambient`, `soft_focus_dreamy`, `street_chrome_high_contrast`, and `overexposed_unreadable`.

The gate reports `totalTargetFixtures:12`, the required category list, category coverage, missing required categories, `networkCallsMade:false`, and `productionReady:false`. It prepares Phase 20-M controlled fixture preparation only; it does not run Qwen inference, add fixture images, expand the real local registry with committed files, start iOS integration, add endpoints, or approve production rollout.
