# Filter Roadmap

This document defines the implementation roadmap for expanded local filters after Phase 12A research planning.

Phase 12A is docs-only. It does not implement filters, change Swift code, change backend code, add dependencies, or start Phase 13.

## Roadmap Principles

- Do not implement too many filters in Phase 12.
- Make the catalog data-driven before expanding the library.
- Build a small, high-quality first batch of 6 hero filters.
- Keep filters local-only through the first implementation batches.
- Preserve the current mock save, mock AI, local history, History, Settings, and Photo Picker fallback flows.
- Keep public filter names brand-safe.
- Defer LUTs, grain overlays, halation, and custom shaders until the basic catalog is stable.

## Batch 1: Six Hero Filters

Target phase: Phase 12B

Status: Implemented in Phase 12B as Core Image-only approximations.

Goal:

- Establish the Swift preset model and local catalog.
- Implement 6 hero filters that cover the main product needs.
- Preserve or map the existing four presets.

| Preset | Category | Core Image MVP | LUT / grain overlay | Future Metal / shader / halation | Notes |
| --- | --- | --- | --- | --- | --- |
| Soft Warm 400 | color_negative | Yes | Optional procedural grain | No | Best default everyday look. |
| Summer Gold 200 | color_negative | Yes | Optional procedural grain | No | Outdoor and travel anchor. |
| Street Chrome | chrome_slide | Yes | LUT optional later | No | Chrome accuracy may improve with LUT later. |
| Soft Sun Portrait | portrait | Yes | Optional grain | No | Keep skin-friendly and low contrast. |
| Cinema Flat | cinematic | Yes | Optional grain | No | Muted editorial base grade. |
| Silver Gradation | black_white | Yes | Procedural grain optional | No | Monochrome anchor. |

Phase 12B should not:

- Implement more than the first 6 hero filters unless explicitly approved.
- Add premium gating.
- Add AI custom filters.
- Add real Firebase, AI, StoreKit, persistence, export, or dependencies.

## Batch 2: Expand To 12

Target phase: Phase 13 candidate scope

Goal:

- Expand the library after the schema and Batch 1 implementation are stable.
- Add more situational variety while keeping local rendering deterministic.

| Preset | Category | Core Image MVP | LUT / grain overlay | Future Metal / shader / halation | Notes |
| --- | --- | --- | --- | --- | --- |
| Night Glow 800 | night | Partial | Grain recommended | Halation/glow future | Avoid overpromising true night film without a future pass. |
| Instant Fade | instant | Yes | Grain / print texture later | No | Strong nostalgic identity. |
| Classic Slide | chrome_slide | Partial | LUT recommended later | No | Accurate slide color may need LUT. |
| Muted Editorial | editorial | Yes | Optional | No | Modern creator-friendly grade. |
| Dusty Rose | portrait | Yes | Optional | No | Soft portrait variant. |
| Forest Negative | color_negative | Yes | LUT optional | No | Outdoor greens need careful HSL. |

Batch 2 should still avoid:

- Real AI.
- AI custom filter generation.
- Cloud preset sync.
- StoreKit premium gating.
- Persistence or export.

## Batch 3: 20+ Filters

Target phase: Later Phase 13 extension or a later product hardening phase.

Goal:

- Complete the initial 20-preset product catalog.
- Introduce more distinct nighttime, compact camera, archive, and experimental looks.
- Decide whether licensed/internal LUTs and texture assets are worth adding.

| Preset | Category | Core Image MVP | LUT / grain overlay | Future Metal / shader / halation | Notes |
| --- | --- | --- | --- | --- | --- |
| Blue Hour Tungsten | night | Partial | Grain recommended | Glow/halation future | Needs careful low-light handling. |
| Creamy Pastel | pastel | Yes | Optional | No | Good lifestyle variation. |
| High Contrast Mono | black_white | Yes | Procedural grain optional | No | Punchier black and white option. |
| Clean Documentary | documentary | Yes | No | No | Low-stylization fallback. |
| Amber Flash | compact | Yes | Grain optional | No | Direct-flash compact feel. |
| Old Compact | compact | Yes | Grain/texture recommended | No | Vignette and imperfect color. |
| Green Shadow | experimental | Partial | LUT recommended later | No | Cross-process style can become harsh. |
| Sepia Archive | archive | Yes | Texture optional | No | Nostalgic archive / aged print. |

## Implementation Readiness

Recommended order:

1. Phase 12A: research integration and schema planning. Docs only.
2. Phase 12B: Swift preset model, data-driven catalog, and 6 hero filters.
3. Phase 13: expanded local filter library after Batch 1 review.
4. Later: LUTs, grain overlays, custom textures, halation pass, or Metal/custom shader work.

## Core Image MVP Candidates

Strong Core Image MVP candidates:

- Soft Warm 400
- Summer Gold 200
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation
- Muted Editorial
- Dusty Rose
- Forest Negative
- Creamy Pastel
- High Contrast Mono
- Clean Documentary
- Amber Flash
- Old Compact
- Sepia Archive

Partial Core Image candidates that may benefit from LUTs or later effects:

- Street Chrome
- Night Glow 800
- Classic Slide
- Blue Hour Tungsten
- Green Shadow

## LUT / Grain Candidates

LUT useful later:

- Street Chrome
- Classic Slide
- Forest Negative
- Green Shadow

Grain / texture useful later:

- Soft Warm 400
- Summer Gold 200
- Silver Gradation
- Night Glow 800
- Instant Fade
- High Contrast Mono
- Amber Flash
- Old Compact
- Sepia Archive

## Future Shader / Halation Candidates

Potential future Metal / custom shader / halation pass:

- Night Glow 800
- Blue Hour Tungsten

Possible future glow-only enhancement:

- Soft Sun Portrait
- Creamy Pastel

These should not be implemented in Phase 12B unless explicitly requested.
