# Filter Preset Schema

This document defines the app-level filter preset schema for Phase 12 planning.

Phase 12A is docs-only. This schema does not require Swift implementation yet and does not authorize expanded filter implementation, AI custom filters, real AI, StoreKit, Firebase, persistence, export, or third-party dependencies.

## Goals

- Make filters data-driven enough to scale beyond the current four presets.
- Keep Phase 12B small: catalog model plus first 6 hero filters only.
- Preserve current local/mock MVP behavior.
- Avoid public display names that directly use protected film or camera brands.
- Leave placeholders for future premium/custom filters without implementing monetization or cloud sync.

## Preset Object

Required fields:

| Field | Type | Description |
| --- | --- | --- |
| `preset_id` | string | Stable snake_case identifier used by app logic, history metadata, and future cloud records. |
| `display_name` | string | Public UI name. Must avoid protected brand names unless legal approval exists. |
| `category` | string | Product grouping such as `color_negative`, `chrome_slide`, `portrait`, `cinematic`, `black_white`, `night`, `instant`, `editorial`, `compact`, `archive`. |
| `style_summary` | string | One short sentence describing the visual result. |
| `typical_use_case` | string | Best-fit scenes or user intent. |
| `difficulty` | string | Implementation complexity label such as `core_image_mvp`, `core_image_mvp_lut_later`, `needs_grain_glow_later`, `lut_recommended_later`, `future_shader`. |
| `implementation_priority` | integer | Lower number means earlier implementation priority. |
| `is_mvp` | boolean | Whether the preset belongs to the initial MVP/hero set. |
| `is_premium` | boolean | Placeholder only. Do not gate filters until a StoreKit phase explicitly scopes monetization. |
| `defaults` | object | Numeric filter controls in app-level normalized ranges. |
| `hsl` | object | Optional per-color hue, saturation, and luminance adjustments. |
| `tone_curve` | array | Optional normalized tone curve points. |
| `render_hints` | object | Implementation guidance for Core Image, LUT, grain, glow, halation, or shader needs. |
| `assets` | object | Optional references to future LUT, grain, overlay, or texture assets. |

Optional internal-only fields:

| Field | Type | Description |
| --- | --- | --- |
| `internal_inspiration` | array | Internal research references. May include brand/stock/camera inspiration but should not appear in public UI. |
| `notes` | string | Engineering or product caveats. |
| `version` | integer | Catalog migration version if needed later. |

## Parameter Ranges

Use app-level normalized ranges first. Rendering code can map these values to Core Image parameters later.

| Parameter | Range | Meaning |
| --- | --- | --- |
| `exposure` | `-2.0...2.0` | Relative exposure in stops. |
| `contrast` | `-100...100` | Negative lowers contrast, positive increases contrast. |
| `brightness` | `-100...100` | Relative brightness lift or reduction. |
| `highlights` | `-100...100` | Highlight compression or boost. Negative protects highlights. |
| `shadows` | `-100...100` | Shadow lift or crush. Positive lifts shadows. |
| `whites` | `-100...100` | White point adjustment. |
| `blacks` | `-100...100` | Black point adjustment. Positive can lift blacks for fade. |
| `saturation` | `-100...100` | Overall saturation. `-100` can represent monochrome intent. |
| `vibrance` | `-100...100` | Selective saturation, usually gentler than saturation. |
| `temperature` | `-100...100` | Relative cool-to-warm control. |
| `tint` | `-100...100` | Relative green-to-magenta control. |
| `fade` | `0...100` | Film fade / lifted toe strength. |
| `grain_amount` | `0...100` | Grain opacity or procedural intensity. |
| `grain_size` | `0.4...2.0` | Grain scale as a relative size multiplier. |
| `vignette` | `0...100` | Edge darkening strength. |
| `sharpness` | `-100...100` | Negative softens, positive sharpens. |
| `clarity` | `-100...100` | Midtone local contrast. |
| `dehaze` | `-100...100` | Atmospheric contrast control. Negative can soften. |
| `bloom` | `0...100` | Bright-area bloom intensity. |
| `halation` | `0...100` | Red/orange highlight bleed. Future render pass. |
| `glow` | `0...100` | General soft glow. |

## HSL Ranges

HSL adjustments are optional and can be sparse. Missing colors mean no change.

Supported color keys:

```text
red, orange, yellow, green, aqua, blue, purple, magenta
```

Per-color object:

| Field | Range | Meaning |
| --- | --- | --- |
| `hue` | `-30...30` | Hue shift in degrees or mapped app units. |
| `saturation` | `-100...100` | Per-color saturation adjustment. |
| `luminance` | `-100...100` | Per-color luminance adjustment. |

Example:

```json
{
  "orange": { "hue": -2, "saturation": 6, "luminance": 8 },
  "green": { "hue": -6, "saturation": -10, "luminance": 0 }
}
```

## Tone Curve

Tone curve points use normalized input/output coordinates:

```json
[
  [0.0, 0.04],
  [0.25, 0.28],
  [0.5, 0.53],
  [0.75, 0.77],
  [1.0, 0.96]
]
```

Guidelines:

- Points should be ordered by input value.
- Input and output values should stay in `0.0...1.0`.
- Curves should generally remain monotonic to avoid harsh posterization.
- Channel-specific curves can be added later as:

```json
{
  "rgb": [[0, 0.04], [0.5, 0.53], [1, 0.96]],
  "red": [[0, 0.03], [1, 0.98]],
  "green": [[0, 0.04], [1, 0.96]],
  "blue": [[0, 0.05], [1, 0.95]]
}
```

## Render Hints

`render_hints` should describe what the renderer can do now and what may be deferred.

Example:

```json
{
  "core_image": true,
  "lut": false,
  "grain_overlay": "procedural_ok",
  "halation_pass": false,
  "metal_shader": false
}
```

Suggested values:

- `core_image`: `true`, `false`, or `"partial"`
- `lut`: `false`, `"optional"`, `"future_for_accuracy"`, or `"required_later"`
- `grain_overlay`: `false`, `"optional"`, `"procedural_ok"`, `"future_texture"`, or `true`
- `halation_pass`: `false` or `"future"`
- `metal_shader`: `false` or `"future"`

## Asset References

`assets` should be null by default in Phase 12B.

Future fields:

```json
{
  "lut": null,
  "grain": null,
  "overlay": null,
  "thumbnail": null
}
```

Rules:

- Do not add copyrighted LUTs or brand assets without explicit license.
- Do not add external downloads as dependencies.
- Do not add cloud asset loading until backend and privacy phases explicitly scope it.
- Do not use asset names that imply official film/camera brand affiliation.

## Example Preset

```json
{
  "preset_id": "soft_warm_400",
  "display_name": "Soft Warm 400",
  "category": "color_negative",
  "style_summary": "Warm everyday film tone with soft contrast and gentle grain.",
  "typical_use_case": "Daily photos, food, portraits, daylight scenes.",
  "difficulty": "core_image_mvp",
  "implementation_priority": 1,
  "is_mvp": true,
  "is_premium": false,
  "defaults": {
    "exposure": 0.05,
    "contrast": -8,
    "brightness": 2,
    "highlights": -12,
    "shadows": 8,
    "whites": -4,
    "blacks": 6,
    "saturation": 6,
    "vibrance": 10,
    "temperature": 10,
    "tint": 2,
    "fade": 12,
    "grain_amount": 16,
    "grain_size": 0.8,
    "vignette": 8,
    "sharpness": 0,
    "clarity": -4,
    "dehaze": -2,
    "bloom": 0,
    "halation": 0,
    "glow": 3
  },
  "hsl": {
    "orange": { "hue": -2, "saturation": 6, "luminance": 6 },
    "green": { "hue": -6, "saturation": -8, "luminance": 2 },
    "blue": { "hue": 2, "saturation": -6, "luminance": 0 }
  },
  "tone_curve": [[0, 0.04], [0.25, 0.28], [0.5, 0.53], [0.75, 0.77], [1, 0.96]],
  "render_hints": {
    "core_image": true,
    "lut": false,
    "grain_overlay": "procedural_ok",
    "halation_pass": false,
    "metal_shader": false
  },
  "assets": {
    "lut": null,
    "grain": null,
    "overlay": null,
    "thumbnail": null
  }
}
```

## Phase 12B Implementation Boundary

Phase 12B may use this schema to build the local Swift model and first catalog.

Phase 12B should not:

- Implement all 20 presets.
- Implement premium gating.
- Add StoreKit.
- Add AI custom filter generation.
- Add real Gemini, OpenAI, or Cloud Functions calls.
- Add Firebase, Firestore, Storage, persistence, export, or save-to-Photos.
- Add dependencies or third-party SDKs.

## Phase 12B Implementation Note

The Phase 12B Swift implementation maps only the schema subset that is needed for the local Batch 1 catalog:

- `preset_id` maps to `FilterPreset.id`.
- `category` maps to `FilterPresetCategory`.
- `display_name` and `style_summary` map to localized name / description keys.
- `implementation_priority`, `is_mvp`, and `is_premium` exist as preset metadata.
- `defaults` are represented as ordered Core Image `FilterAdjustment` values.

Deferred schema fields:

- HSL-specific tuning is not implemented yet.
- LUT references are not implemented.
- Grain assets and overlays are not implemented.
- Tone-curve support exists only as a 5-point RGB curve.
- Bloom, glow, halation, Metal, and custom shader hints remain future work.

## Backfill Alignment Note

The Filter Research Docs Backfill + Alignment Check reviewed `/Users/a1234/Downloads/濾鏡.md` against the Phase 12B / Phase 13 Swift catalog.

Alignment result:

- The schema remains suitable for the current local catalog.
- Current Swift implementation uses a reduced in-code subset of the schema.
- `preset_id`, public display name localization, category, group, summary localization, implementation priority, `is_mvp`, `is_premium`, and Core Image rendering parameters are represented.
- HSL controls, LUT references, true grain overlays, halation passes, light leaks, dust, frames, CCD / instant camera asset treatment, Metal/custom shader work, and app-level JSON catalog loading remain future work.
- Public UI display names remain brand-safe; brand / stock names are research-only internal inspiration.
