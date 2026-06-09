# Filter Research: Popular Film Looks

This document captures Phase 12A filter research integration for the local/mock MVP.

Phase 12A is planning-only. It does not implement filters, change Swift code, change backend code, add services, add secrets, or start Phase 13.

## Source Status

The requested source report is `deep-research-report.md`.

At the time of this Phase 12A documentation pass, that file was not found in the local repository or nearby project workspace. This document is therefore based on the user's provided research summary and should be reconciled with `deep-research-report.md` if that source file is later added.

## Naming Safety

Public UI filter names should not directly use protected film, camera, or product brand names such as Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar marks.

Brand and stock names may be retained only as internal inspiration / research reference notes while implementation uses neutral display names.

Examples:

- Public display name: `Soft Warm 400`
- Internal inspiration: consumer color negative film, warm daylight portrait stocks
- Public display name: `Street Chrome`
- Internal inspiration: high-contrast slide / chrome street photography looks

## Research Conclusions

Popular retro camera users tend to value filters that feel immediately recognizable, easy to choose, and useful across common social-photo situations.

Key look families:

- Warm color negative: soft contrast, warm skin, gentle grain, flexible everyday use.
- Sunny consumer film: bright yellows, warm highlights, cheerful outdoor color.
- Chrome / slide: deeper contrast, clean shadows, stronger color separation.
- Soft portrait: lower contrast, warm highlights, gentle skin handling.
- Cinematic flat: lower saturation, controlled highlights, editorial base grade.
- Black and white: strong tonal separation, restrained grain, timeless street / portrait use.
- Night / tungsten: strong color casts, glow, grain, and low-light mood.
- Instant / compact camera: fade, vignette, color shifts, nostalgic imperfection.
- Editorial muted: restrained saturation, controlled contrast, modern social style.

Engineering implication:

- Phase 12 should define the schema before scaling the library.
- Phase 12B should implement a small first batch of 6 hero filters only.
- Phase 13 can expand toward 12 and later 20+ filters after the catalog architecture is stable.
- Early filters should prefer Core Image parameters already close to the Phase 04 local pipeline.
- Film grain, halation, glow, LUTs, and texture overlays should be added gradually.

## Recommended 20 Presets

| Priority | Display name | Category | Internal inspiration | Summary | MVP fit |
| --- | --- | --- | --- | --- | --- |
| 1 | Soft Warm 400 | color_negative | warm consumer negative film | Warm, soft everyday film look with gentle contrast. | Yes |
| 2 | Summer Gold 200 | color_negative | sunny daylight consumer film | Golden highlights, bright outdoor warmth, light grain. | Yes |
| 3 | Street Chrome | chrome_slide | high-contrast slide street looks | Crisp contrast, cooler shadows, stronger color separation. | Yes |
| 4 | Soft Sun Portrait | portrait | soft warm portrait film | Gentle skin, lifted shadows, warm highlights. | Yes |
| 5 | Cinema Flat | cinematic | modern flat cinema base grade | Muted saturation, protected highlights, editorial tone. | Yes |
| 6 | Silver Gradation | black_white | classic black and white film | Smooth monochrome contrast with controlled grain. | Yes |
| 7 | Night Glow 800 | night | tungsten / night color negative | Low-light warmth, glow, grain, green-blue shadows. | Later |
| 8 | Instant Fade | instant | instant camera print fade | Pastel fade, vignette, nostalgic print feel. | Later |
| 9 | Classic Slide | chrome_slide | saturated slide film | Rich color, higher contrast, clean daylight pop. | Later |
| 10 | Muted Editorial | editorial | modern photographer muted grade | Lower saturation, clean contrast, polished lifestyle look. | Later |
| 11 | Dusty Rose | portrait | soft rosy portrait grade | Pink warmth, softer contrast, gentle highlights. | Later |
| 12 | Forest Negative | color_negative | green-rich outdoor negative film | Organic greens, warm mids, soft highlight rolloff. | Later |
| 13 | Blue Hour Tungsten | night | tungsten-balanced night look | Cool ambient shadows, warm light sources, low saturation. | Later |
| 14 | Creamy Pastel | pastel | pastel lifestyle film | Low contrast, creamy highlights, soft color. | Later |
| 15 | High Contrast Mono | black_white | punchy monochrome street film | Strong blacks, crisp whites, classic grain. | Later |
| 16 | Clean Documentary | documentary | neutral documentary photographer grade | Balanced tones, low stylization, honest color. | Later |
| 17 | Amber Flash | compact | direct flash compact camera | Warm flash center, darker edges, saturated skin warmth. | Later |
| 18 | Old Compact | compact | early compact digital / toy camera | Vignette, crushed shadows, imperfect saturation. | Later |
| 19 | Green Shadow | experimental | cross-process inspired green shadows | Green-blue shadows, warm highlights, stylized mood. | Later |
| 20 | Sepia Archive | archive | aged print / archive photo | Warm brown mono, fade, low clarity. | Later |

## First 12 Priority Set

The first 12 should be treated as the practical product target for Phase 12B and Phase 13 planning, but Phase 12B should implement only the first 6 hero filters.

| Rank | Preset | Reason |
| --- | --- | --- |
| 1 | Soft Warm 400 | Best default everyday retro look. |
| 2 | Summer Gold 200 | Strong outdoor / travel appeal. |
| 3 | Street Chrome | Gives the set a crisp contrast option. |
| 4 | Soft Sun Portrait | Covers portraits and skin-friendly use. |
| 5 | Cinema Flat | Adds modern editorial utility. |
| 6 | Silver Gradation | Required monochrome anchor. |
| 7 | Night Glow 800 | Important for evening social photos, but needs grain/glow care. |
| 8 | Instant Fade | Strong nostalgic identity, but benefits from texture overlays later. |
| 9 | Classic Slide | Popular color style, may need LUT-like tuning for accuracy. |
| 10 | Muted Editorial | Useful for modern creator workflows. |
| 11 | Dusty Rose | Adds softer portrait variety. |
| 12 | Forest Negative | Useful for outdoor / nature photos. |

## Engineering Seed JSON

This seed is a planning reference for the future app-level catalog. It is not an implementation artifact yet.

```json
[
  {
    "preset_id": "soft_warm_400",
    "display_name": "Soft Warm 400",
    "category": "color_negative",
    "internal_inspiration": ["warm consumer negative film", "daylight portrait stock"],
    "style_summary": "Warm everyday film tone with soft contrast and gentle grain.",
    "typical_use_case": "Daily photos, food, portraits, daylight scenes.",
    "difficulty": "core_image_mvp",
    "implementation_priority": 1,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": 0.05, "contrast": -8, "brightness": 2, "highlights": -12, "shadows": 8, "whites": -4, "blacks": 6, "saturation": 6, "vibrance": 10, "temperature": 10, "tint": 2, "fade": 12, "grain_amount": 16, "grain_size": 28, "vignette": 8, "sharpness": 0, "clarity": -4, "dehaze": -2, "bloom": 0, "halation": 0, "glow": 3 },
    "hsl": { "red": { "hue": 0, "saturation": 4, "luminance": 4 }, "orange": { "hue": -2, "saturation": 6, "luminance": 6 }, "yellow": { "hue": -4, "saturation": 4, "luminance": 3 }, "green": { "hue": -6, "saturation": -8, "luminance": 2 }, "aqua": { "hue": 0, "saturation": -4, "luminance": 0 }, "blue": { "hue": 2, "saturation": -6, "luminance": 0 }, "purple": { "hue": 0, "saturation": -4, "luminance": 0 }, "magenta": { "hue": 0, "saturation": -4, "luminance": 0 } },
    "tone_curve": [[0, 0.04], [0.25, 0.28], [0.5, 0.53], [0.75, 0.77], [1, 0.96]],
    "render_hints": { "core_image": true, "lut": false, "grain_overlay": "procedural_ok", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  {
    "preset_id": "summer_gold_200",
    "display_name": "Summer Gold 200",
    "category": "color_negative",
    "internal_inspiration": ["sunny consumer film", "travel daylight looks"],
    "style_summary": "Golden highlights, cheerful warmth, and bright outdoor color.",
    "typical_use_case": "Travel, beach, food, daytime street photos.",
    "difficulty": "core_image_mvp",
    "implementation_priority": 2,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": 0.08, "contrast": -2, "brightness": 4, "highlights": -8, "shadows": 6, "whites": 2, "blacks": 3, "saturation": 10, "vibrance": 14, "temperature": 16, "tint": -1, "fade": 8, "grain_amount": 10, "grain_size": 22, "vignette": 5, "sharpness": 2, "clarity": -2, "dehaze": -2, "bloom": 2, "halation": 0, "glow": 4 },
    "hsl": { "orange": { "hue": -4, "saturation": 8, "luminance": 6 }, "yellow": { "hue": -8, "saturation": 10, "luminance": 8 }, "green": { "hue": -8, "saturation": -6, "luminance": 3 }, "blue": { "hue": 4, "saturation": -4, "luminance": 2 } },
    "tone_curve": [[0, 0.03], [0.25, 0.27], [0.5, 0.54], [0.75, 0.8], [1, 0.98]],
    "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  {
    "preset_id": "street_chrome",
    "display_name": "Street Chrome",
    "category": "chrome_slide",
    "internal_inspiration": ["chrome slide film", "high-contrast street photography"],
    "style_summary": "Crisp contrast, cooler shadows, and strong color separation.",
    "typical_use_case": "Street, architecture, cars, signs, urban daylight.",
    "difficulty": "core_image_mvp_lut_later",
    "implementation_priority": 3,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": 0, "contrast": 18, "brightness": 0, "highlights": -6, "shadows": -8, "whites": 8, "blacks": -10, "saturation": 12, "vibrance": 8, "temperature": -4, "tint": 3, "fade": 0, "grain_amount": 8, "grain_size": 18, "vignette": 10, "sharpness": 8, "clarity": 8, "dehaze": 4, "bloom": 0, "halation": 0, "glow": 0 },
    "hsl": { "red": { "hue": 1, "saturation": 8, "luminance": -2 }, "yellow": { "hue": 2, "saturation": 5, "luminance": -2 }, "green": { "hue": 6, "saturation": -2, "luminance": -4 }, "blue": { "hue": -2, "saturation": 8, "luminance": -3 } },
    "tone_curve": [[0, 0.0], [0.22, 0.18], [0.5, 0.5], [0.78, 0.84], [1, 1.0]],
    "render_hints": { "core_image": true, "lut": "future_for_accuracy", "grain_overlay": "optional", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  {
    "preset_id": "soft_sun_portrait",
    "display_name": "Soft Sun Portrait",
    "category": "portrait",
    "internal_inspiration": ["soft warm portrait film", "golden-hour skin tone"],
    "style_summary": "Warm highlights, lifted shadows, and gentle skin contrast.",
    "typical_use_case": "Portraits, selfies, couples, pets.",
    "difficulty": "core_image_mvp",
    "implementation_priority": 4,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": 0.04, "contrast": -14, "brightness": 3, "highlights": -18, "shadows": 14, "whites": -6, "blacks": 8, "saturation": 2, "vibrance": 8, "temperature": 12, "tint": 4, "fade": 10, "grain_amount": 8, "grain_size": 20, "vignette": 4, "sharpness": -2, "clarity": -10, "dehaze": -4, "bloom": 4, "halation": 0, "glow": 6 },
    "hsl": { "red": { "hue": -1, "saturation": 2, "luminance": 5 }, "orange": { "hue": -2, "saturation": 4, "luminance": 8 }, "yellow": { "hue": -4, "saturation": 2, "luminance": 3 }, "green": { "hue": -6, "saturation": -10, "luminance": 0 } },
    "tone_curve": [[0, 0.05], [0.3, 0.33], [0.55, 0.58], [0.8, 0.82], [1, 0.96]],
    "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  {
    "preset_id": "cinema_flat",
    "display_name": "Cinema Flat",
    "category": "cinematic",
    "internal_inspiration": ["flat cinema base grade", "editorial video stills"],
    "style_summary": "Muted color with protected highlights and cinematic restraint.",
    "typical_use_case": "Lifestyle, city, food, moody interiors.",
    "difficulty": "core_image_mvp",
    "implementation_priority": 5,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": -0.02, "contrast": -10, "brightness": 0, "highlights": -20, "shadows": 12, "whites": -8, "blacks": 4, "saturation": -12, "vibrance": -4, "temperature": -2, "tint": 1, "fade": 6, "grain_amount": 6, "grain_size": 18, "vignette": 8, "sharpness": 2, "clarity": 2, "dehaze": -2, "bloom": 0, "halation": 0, "glow": 0 },
    "hsl": { "red": { "hue": 0, "saturation": -4, "luminance": 2 }, "orange": { "hue": -2, "saturation": -4, "luminance": 3 }, "yellow": { "hue": -4, "saturation": -10, "luminance": 0 }, "green": { "hue": -8, "saturation": -18, "luminance": -2 }, "blue": { "hue": 4, "saturation": -12, "luminance": -2 } },
    "tone_curve": [[0, 0.04], [0.25, 0.27], [0.5, 0.5], [0.75, 0.74], [1, 0.94]],
    "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  {
    "preset_id": "silver_gradation",
    "display_name": "Silver Gradation",
    "category": "black_white",
    "internal_inspiration": ["classic monochrome film", "fine-grain black and white"],
    "style_summary": "Smooth black and white contrast with restrained grain.",
    "typical_use_case": "Street, portraits, documentary, architecture.",
    "difficulty": "core_image_mvp",
    "implementation_priority": 6,
    "is_mvp": true,
    "is_premium": false,
    "defaults": { "exposure": 0, "contrast": 14, "brightness": 0, "highlights": -8, "shadows": 6, "whites": 6, "blacks": -8, "saturation": -100, "vibrance": -100, "temperature": 0, "tint": 0, "fade": 4, "grain_amount": 18, "grain_size": 26, "vignette": 10, "sharpness": 4, "clarity": 6, "dehaze": 2, "bloom": 0, "halation": 0, "glow": 0 },
    "hsl": {},
    "tone_curve": [[0, 0.02], [0.25, 0.22], [0.5, 0.5], [0.75, 0.8], [1, 0.98]],
    "render_hints": { "core_image": true, "lut": false, "grain_overlay": "procedural_ok", "halation_pass": false },
    "assets": { "lut": null, "grain": null, "overlay": null }
  },
  { "preset_id": "night_glow_800", "display_name": "Night Glow 800", "category": "night", "internal_inspiration": ["night color negative", "tungsten glow"], "implementation_priority": 7, "is_mvp": false, "is_premium": false, "difficulty": "needs_grain_glow_later", "defaults": { "contrast": 8, "highlights": -22, "shadows": 10, "temperature": 8, "tint": 8, "grain_amount": 38, "bloom": 8, "halation": 14, "glow": 12 }, "render_hints": { "core_image": "partial", "lut": "optional", "grain_overlay": true, "halation_pass": "future" }, "assets": { "lut": null, "grain": "future", "overlay": null } },
  { "preset_id": "instant_fade", "display_name": "Instant Fade", "category": "instant", "internal_inspiration": ["instant print fade"], "implementation_priority": 8, "is_mvp": false, "is_premium": false, "difficulty": "core_image_plus_texture_later", "defaults": { "contrast": -18, "highlights": -10, "shadows": 18, "saturation": -6, "temperature": 10, "fade": 28, "grain_amount": 18, "vignette": 22 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "future_texture", "halation_pass": false }, "assets": { "lut": null, "grain": "future", "overlay": "future_print_edge" } },
  { "preset_id": "classic_slide", "display_name": "Classic Slide", "category": "chrome_slide", "internal_inspiration": ["saturated slide film"], "implementation_priority": 9, "is_mvp": false, "is_premium": false, "difficulty": "lut_recommended_later", "defaults": { "contrast": 22, "highlights": -4, "shadows": -8, "saturation": 16, "vibrance": 10, "fade": 0, "grain_amount": 8 }, "render_hints": { "core_image": "partial", "lut": "future_for_accuracy", "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": "future", "grain": null, "overlay": null } },
  { "preset_id": "muted_editorial", "display_name": "Muted Editorial", "category": "editorial", "internal_inspiration": ["modern muted photographer grade"], "implementation_priority": 10, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": 4, "highlights": -16, "shadows": 8, "saturation": -18, "vibrance": -8, "temperature": 2, "fade": 4, "grain_amount": 6 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": false, "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "dusty_rose", "display_name": "Dusty Rose", "category": "portrait", "internal_inspiration": ["rosy portrait grade"], "implementation_priority": 11, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": -10, "highlights": -14, "shadows": 12, "saturation": -2, "temperature": 8, "tint": 8, "fade": 12, "grain_amount": 8 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "forest_negative", "display_name": "Forest Negative", "category": "color_negative", "internal_inspiration": ["outdoor green-rich negative film"], "implementation_priority": 12, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp_lut_optional", "defaults": { "contrast": -4, "highlights": -12, "shadows": 8, "saturation": 4, "vibrance": 8, "temperature": 4, "green_hsl_saturation": -6, "grain_amount": 12 }, "render_hints": { "core_image": true, "lut": "optional", "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "blue_hour_tungsten", "display_name": "Blue Hour Tungsten", "category": "night", "internal_inspiration": ["tungsten-balanced night color"], "implementation_priority": 13, "is_mvp": false, "is_premium": false, "difficulty": "needs_glow_later", "defaults": { "temperature": -8, "tint": 4, "contrast": 6, "saturation": -8, "grain_amount": 28, "glow": 8, "halation": 8 }, "render_hints": { "core_image": "partial", "lut": "optional", "grain_overlay": true, "halation_pass": "future" }, "assets": { "lut": null, "grain": "future", "overlay": null } },
  { "preset_id": "creamy_pastel", "display_name": "Creamy Pastel", "category": "pastel", "internal_inspiration": ["pastel lifestyle film"], "implementation_priority": 14, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": -20, "highlights": -18, "shadows": 16, "saturation": -10, "vibrance": 4, "temperature": 6, "fade": 18, "glow": 4 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "high_contrast_mono", "display_name": "High Contrast Mono", "category": "black_white", "internal_inspiration": ["punchy monochrome street film"], "implementation_priority": 15, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": 30, "saturation": -100, "blacks": -18, "whites": 12, "clarity": 10, "grain_amount": 24 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "procedural_ok", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "clean_documentary", "display_name": "Clean Documentary", "category": "documentary", "internal_inspiration": ["neutral documentary photographer grade"], "implementation_priority": 16, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": 4, "highlights": -8, "shadows": 4, "saturation": 0, "vibrance": 4, "temperature": 0, "grain_amount": 4 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": false, "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "amber_flash", "display_name": "Amber Flash", "category": "compact", "internal_inspiration": ["direct flash compact camera"], "implementation_priority": 17, "is_mvp": false, "is_premium": false, "difficulty": "core_image_plus_vignette", "defaults": { "contrast": 10, "temperature": 12, "saturation": 6, "vignette": 24, "grain_amount": 20, "sharpness": 6 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } },
  { "preset_id": "old_compact", "display_name": "Old Compact", "category": "compact", "internal_inspiration": ["old compact digital / toy camera"], "implementation_priority": 18, "is_mvp": false, "is_premium": false, "difficulty": "core_image_plus_texture_later", "defaults": { "contrast": 16, "shadows": -8, "saturation": 10, "temperature": 4, "vignette": 28, "grain_amount": 26, "sharpness": 10 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": true, "halation_pass": false }, "assets": { "lut": null, "grain": "future", "overlay": null } },
  { "preset_id": "green_shadow", "display_name": "Green Shadow", "category": "experimental", "internal_inspiration": ["cross-process green shadows"], "implementation_priority": 19, "is_mvp": false, "is_premium": false, "difficulty": "lut_recommended_later", "defaults": { "contrast": 12, "temperature": -2, "tint": -10, "saturation": 6, "fade": 6, "grain_amount": 18 }, "render_hints": { "core_image": "partial", "lut": "future_for_accuracy", "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": "future", "grain": null, "overlay": null } },
  { "preset_id": "sepia_archive", "display_name": "Sepia Archive", "category": "archive", "internal_inspiration": ["aged print / archive photo"], "implementation_priority": 20, "is_mvp": false, "is_premium": false, "difficulty": "core_image_mvp", "defaults": { "contrast": -8, "saturation": -80, "temperature": 22, "tint": -4, "fade": 24, "grain_amount": 30, "vignette": 16, "clarity": -8 }, "render_hints": { "core_image": true, "lut": false, "grain_overlay": "optional", "halation_pass": false }, "assets": { "lut": null, "grain": null, "overlay": null } }
]
```

## Engineering Landing Recommendations

Phase 12B should:

- Add an app-level filter preset model and catalog format.
- Keep catalog data local and deterministic.
- Preserve or map the existing four presets: Original, Classic Film, Warm Vintage, and Faded Chrome.
- Implement only the first 6 hero filters.
- Keep the existing mock save, mock AI, local session history, History, and Settings flows.
- Avoid premium gating even if the schema includes an `is_premium` placeholder.

Phase 12B should not:

- Implement all 20 filters.
- Add AI custom filter generation.
- Add real AI calls.
- Add StoreKit or premium filter gates.
- Add Firebase, cloud sync, persistence, export, or third-party SDKs.

Suggested implementation path:

- Use Core Image for exposure, contrast, saturation, temperature/tint, mono conversion, vignette, and simple bloom/glow approximations.
- Represent more advanced needs as `render_hints` rather than forcing them into Phase 12B.
- Treat grain as procedural or deferred until a stable local rendering approach exists.
- Treat LUTs as future licensed/internal assets only.
- Treat halation as a future pass that may require Metal or custom shader work.

## Phase 12B Implementation Status

Phase 12B implemented the first 6 hero filters as Core Image-only approximations:

- Soft Warm 400
- Summer Gold 200
- Street Chrome
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation

The implementation intentionally does not include LUTs, grain overlays, light leak assets, halation, custom shaders, AI-generated filters, real AI, StoreKit, persistence, export, or backend integration.

Research parameters that cannot yet be represented by the current pipeline are recorded as future TODOs in the phase log and schema docs.
