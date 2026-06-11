# AI Filter Generator Research

Phase 16F research backfill for future AI Filter Generator work.

This document is a product and technical research source of truth. It is not an implementation spec and does not authorize app, backend, AI, upload, persistence, StoreKit, or production configuration changes.

---

## 1. Executive Summary

AI Filter Generator is worth building for a camera-first retro photo app, but the first version should not depend on real cloud AI analysis.

Recommended path:

1. F1 Mock Filter Generator
2. F2 Local Heuristic Filter Extractor
3. F3 Cloud AI Style Analysis
4. F4 LUT / Saved Custom Filter

MVP does not need a cloud model first. Core Image, Accelerate / vImage, histogram analysis, palette analysis, and local rule mapping are enough to create an early local generator that feels useful while staying private, cheap, and testable.

Real AI should output a structured filter recipe. It should not directly edit the image, output a stylized bitmap, choose arbitrary Core Image filter names, emit shader/code, or control the rendering layer directly.

---

## 2. Product Goal

The goal is not to precisely copy a reference image. The goal is to turn a user's visual inspiration into an app-executable look recipe that can be previewed, adjusted, validated, and mapped into the existing filter pipeline.

Avoid copy-like promises:

- `exact copy`
- `same as`
- `clone`
- claims tied to a specific brand, movie, creator, or proprietary preset

Prefer safer product language:

- Extract color and style inspiration from a reference image.
- Generate an approximate look.
- Generate editable filter parameters.
- Build a recipe inspired by the image, not a pixel-perfect copy.

---

## 3. Recommended User Flow

1. User enters Inspiration / Filter Lab.
2. User taps `Generate My Filter` / `生成我的濾鏡`.
3. User selects one reference image.
4. F1 / F2 performs mock or local analysis.
5. F3 cloud mode shows a consent sheet before any upload.
6. UI shows loading.
7. UI shows a generated filter result card.
8. UI provides before / after preview.
9. UI provides an intensity slider.
10. UI provides apply / try another image actions.
11. MVP does not save the custom filter.
12. If session-only, UI clearly says the generated look will not remain after leaving the current session.

Suggested copy:

- `從參考圖提取色調與風格靈感`
- `生成近似 look`
- `這次生成只在目前工作階段暫存，離開後不會保留`

---

## 4. Technical Direction

There are four technical routes:

- Mock-only UX
- Local heuristic + template mapping
- Cloud AI style analysis
- LUT / advanced generated preset

Recommendation:

- F1 should start with mock UX.
- F2 should add local heuristic analysis.
- F3 should add cloud AI only after consent, backend, quota, validation, and privacy copy are ready.
- F4 should add LUT / saved custom filters later.
- MVP should use a parameter recipe, not LUT.
- AI should never directly control Core Image filter names, shaders, code, remote LUT URLs, or runtime executable logic.

---

## 5. Local Heuristic Strategy

Local analysis can produce a useful first real recipe without cloud AI.

Possible analysis:

- Downsample reference image to 512-1024 px long edge.
- Average color.
- Dominant color / palette.
- Histogram.
- Brightness / exposure estimation.
- Contrast estimation.
- Saturation estimation.
- Warm / cool estimation.
- Shadow / highlight distribution.
- Preset family matching.

Suggested Apple-side tools:

- Core Image
- Accelerate / vImage
- Histogram analysis
- Possible Vision feature print later
- Saliency / aesthetics later

Local heuristic is good at numeric and color-statistical work. It is weaker at high-semantic style understanding, naming, scene labels, and aesthetic descriptions. Those higher-semantic jobs can be deferred to cloud AI after the backend boundary is ready.

---

## 6. Filter Recipe Schema

Generated filters should use a structured JSON recipe.

Required shape should include:

- `recipeVersion`
- `id`
- `name`
- `description`
- `source`
- `createdFromReferenceImage` metadata
- `recommendedUse`
- `warnings`
- `parameters`
- `validation`

Parameters may include:

- `exposure`
- `contrast`
- `brightness`
- `saturation`
- `vibrance`
- `temperature`
- `tint`
- `fade`
- `highlightWarmth`
- `shadowTint`
- `shadowFade`
- `grain`
- `vignette`
- `clarity`
- `softness`
- `bloom` later
- `halation` later
- `lightLeak` later

Example:

```json
{
  "recipeVersion": "1.0",
  "id": "gen_20260611_abc123",
  "name": "Golden Rooftop Dream",
  "description": "暖色高光、柔和陰影、輕微褪色與夕陽感。",
  "source": {
    "mode": "local_heuristic",
    "provider": "none",
    "basePresetFamily": "warmVintage",
    "confidence": 0.78
  },
  "createdFromReferenceImage": {
    "assetLocalIdentifier": null,
    "downsampledHash": "sha256:...",
    "width": 1024,
    "height": 768,
    "capturedAt": null
  },
  "recommendedUse": ["portrait", "travel", "golden_hour"],
  "warnings": [
    "不適合非常低光環境",
    "套用在人像時請把強度調至 0.7 以下"
  ],
  "parameters": {
    "exposure": 0.08,
    "contrast": -0.12,
    "brightness": 0.03,
    "saturation": 0.18,
    "vibrance": 0.1,
    "temperature": 0.22,
    "tint": 0.04,
    "fade": 0.18,
    "highlightWarmth": 0.3,
    "shadowTint": -0.08,
    "shadowFade": 0.14,
    "grain": 0.12,
    "vignette": 0.08,
    "clarity": -0.06,
    "softness": 0.1,
    "bloom": 0,
    "halation": 0,
    "lightLeak": 0
  },
  "validation": {
    "status": "valid",
    "clampedFields": [],
    "droppedFields": [],
    "workingColorSpace": "sRGB"
  }
}
```

Validation rules:

- All numeric values must be hard-clamped.
- Unknown keys should be dropped or rejected.
- `NaN` / `Infinity` must be rejected.
- If too many fields are out of range, fallback to the nearest preset family.
- `name` and `description` must not affect rendering.
- `recipeVersion` must exist.
- AI response must not go directly into the rendering layer.

---

## 7. iOS Filter Pipeline Mapping

MVP recipe parameters can map to existing Core Image concepts:

- `CIExposureAdjust`
- `CIColorControls`
- `CITemperatureAndTint`
- `CIVibrance`
- `CIToneCurve`
- `CIColorMatrix`
- `CIVignette`
- `CIUnsharpMask`
- `CIBloom` / `CIGloom` later
- `CIColorCube` / `CIColorCubeWithColorSpace` for F4 LUT later

Implementation principles:

- Reuse `CIContext`.
- Still preview and camera preview should share the mapper.
- Generated recipe should map into the app-level filter pipeline.
- The renderer should not consume AI free text or provider-specific parameter names.
- The same recipe should preview and render consistently.

---

## 8. LUT Evaluation

LUT is technically viable on iOS through `CIColorCube` / `CIColorCubeWithColorSpace`.

MVP should not start with LUT:

- Harder to validate.
- Harder to fallback.
- Harder to control with an intensity slider.
- More complex asset and color-space management.
- More difficult to keep preview/output consistent.

F4 can research LUT, saved custom filters, advanced matching, and premium/custom filter workflows later.

---

## 9. UX Recommendation

Recommended UX:

- Inspiration / Filter Lab entry.
- Reference image picker.
- Consent only when cloud analysis is used.
- Loading state.
- Generated filter result card.
- Before / after preview.
- Intensity slider.
- Apply.
- Try another.
- Unavailable / failed state.
- Session-only no-persistence copy.

The UI should feel creative and controlled, not like a promise to copy another person's work. It should say the generated look is inspired by the reference image and remains editable.

---

## 10. Privacy / Legal / App Store Boundaries

Boundaries:

- Do not silently upload reference images.
- Cloud analysis requires explicit consent.
- No background upload.
- No raw image persistence.
- No provider raw response persistence.
- No exact copy / brand / movie / creator clone claims.
- Reference image sharing and public custom filters are not MVP.
- Generated filter names should avoid trademarks, movie names, and creator names.
- Gemini free tier should not be used for formal user photo traffic if the product promises not to train or improve provider models with user content.
- OpenAI / Gemini provider choice must align with privacy copy.

If cloud analysis exists, the product must clearly explain where the image goes, what it is used for, whether a third-party AI provider is involved, and that the user can decline.

---

## 11. Implementation Architecture Proposal

Future files may include:

- `GeneratedFilterRecipe.swift`
- `GeneratedFilterParameterSet.swift`
- `FilterGenerationService.swift`
- `MockFilterGenerationService.swift`
- `LocalFilterHeuristicAnalyzer.swift`
- `CloudStyleAnalysisService.swift`
- `FilterRecipeValidator.swift`
- `FilterRecipeMapper.swift`
- `GeneratedFilterPreviewRenderer.swift`
- `FilterLabViewModel.swift`
- `FilterLabView.swift`
- `GeneratedFilterResultView.swift`
- `ReferenceImageConsentView.swift`

Layering:

- UI layer: picker, consent, loading, result card, slider, apply actions.
- Generation layer: mock / local / cloud recipe generation.
- Validation layer: schema, clamp, drop/reject invalid fields.
- Rendering layer: map app-level recipe into the existing filter pipeline.

---

## 12. Phase Plan

### F1 Mock Filter Generator

- Inspiration / Filter Lab entry.
- Import reference image.
- Mock analysis.
- Mock generated filter recipe.
- Result card.
- Before / after.
- Intensity slider.
- No real AI.
- No upload.
- No persistence.

### F2 Local Heuristic Filter Extractor

- Downsample image.
- Palette / histogram / contrast / saturation analysis.
- Preset family matching.
- Generate rough recipe.
- Validate / clamp.
- Still no backend.

### F3 Cloud AI Style Analysis

- Backend proxy.
- Structured JSON.
- No provider key in iOS.
- Explicit consent.
- No raw payload persistence.

### F4 LUT / Saved Custom Filter

- LUT / advanced preset.
- Saved custom filters.
- Premium / account sync later.

---

## Known TODOs

- Define exact normalized parameter ranges.
- Map existing 20 filters into preset families.
- Draft `GeneratedFilterRecipe` JSON Schema before any cloud AI work.
- Design Filter Lab UX separately.
- Keep F1/F2 local/mock before F3 cloud.
