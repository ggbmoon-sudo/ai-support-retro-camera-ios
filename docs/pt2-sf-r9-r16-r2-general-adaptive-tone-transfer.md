# PT2-SF-R9-R16-R2 - General Adaptive Recipe v2 Tone Transfer

Status: experimental polished candidate; source-contract and synthetic policy checks pass; Mac/Core Image multi-style verification pending  
Date: 2026-07-20  
Production readiness: `productionReady:false`

## Goal

Improve transfer fidelity for every generated Recipe v2 filter without memorizing one reference/apply pair. Warm faded, cool chrome, intentional low-key, muted pastel, and neutral film recipes must remain different when applied to unrelated bright and dark photos.

## Evidence from the returned 100% result

R16-R1 corrected the earlier global gray wash:

- whole-image q10 reached `0.2176`; the target photograph region was approximately `0.2145`;
- mean R-minus-B reached `0.1194`; the target was approximately `0.1219`;
- mean saturation reached `0.2275`; the target was approximately `0.2536`.

The remaining gap was local shadow separation rather than a global black-floor error:

- source deep-pixel share below luma `0.12`: `2.23%`;
- returned 100% deep-pixel share: `7.80%`;
- dark-fabric q10 moved from about `0.110` to `0.043`;
- black-fur q10 moved from about `0.192` to `0.086`.

The saved ignored recipe associated with that result had an almost-identity luma shadow point (`0.255`) plus exposure, positive contrast, channel curves, basis looks, and vignette. This motivated a general compound-density budget rather than an image, subject, preset, or recipe-ID special case.

## Transferable provider guidance

- `lumaCurve` owns the primary reusable tone transfer.
- Exposure, contrast, fade, and shadow lift are modest residual controls, not a duplicate curve.
- Subject colour, room brightness, flash exposure, and dark objects in the reference scene are not reusable filter evidence.
- The luma x=`0.25` point declares shadow-detail intent. A lower point is reserved for consistently intentional low-key texture, not the mere presence of a black object.
- RGB curve endpoints remain exact `0/1`; raw LUTs, shaders, arbitrary renderer code, and exact third-party clone claims remain forbidden.

The request and response schema are unchanged. The selected style/reference image still follows the existing consented backend route; no apply/original image or adaptive statistic is added to the provider request.

## Local guard design

### Pipeline position and sample

The Recipe v2-only guard runs after input normalization, exposure, colour controls, temperature, fade/shadow/highlight tone, and the deterministic colour cube. It runs before bloom, diffusion, halation, grain, dust, vignette, and the user's final intensity blend.

- source and tone-colour output are sampled locally at a maximum long edge of 64 pixels;
- the grid is 6×6;
- samples with alpha below `0.95` are ignored;
- at least 75% of each tile's sample pixels must be opaque;
- Recipe `1.1` does not enter the guard.

### Evidence gates

A tile is eligible only when:

- source q10 is above `0.004` and at most `0.38`;
- source q25-q10 is at least `0.018`, so flat black has no recoverable-detail claim;
- bottom-quartile absolute chroma is at most `0.12`;
- bottom-quartile relative chroma is at most `0.45`;
- the selected source q10 pixel's relative chroma is at most `0.55`.

The absolute-plus-relative chroma gates protect highly saturated dark reds/blues that would otherwise look numerically close to black. At least three tiles must be eligible and at least two must show damage, which prevents one isolated dark object from driving the frame.

### Declared-intent budget

For each eligible tile:

1. A primary floor applies normalization plus the recipe's `lumaCurve` and style intensity to source q10.
2. A legacy residual path estimates exposure/contrast/fade/shadow influence. Downward legacy density allowance is capped at `0.016`.
3. Every opaque low-resolution colour in that source tile is packed into one calibration strip, transformed through pointwise normalization/exposure/contrast/fade/temperature plus the actual colour cube, and reduced back to aligned tile q10. The strip deliberately omits spatial `CIHighlightShadowAdjust`; colour-style density allowance is capped at `0.020`.
4. Combined declared density allowance is capped at `0.034`, with a small temperature/tint tolerance.
5. The floor-index q75 of eligible damage drives strength. No worst-outlier boost is used.

### Local correction

- maximum decision `toeLift`: `0.045`;
- correction cube maximum luminance lift: `0.025`;
- RGB channels use one multiplicative gain, preserving chromaticity and exact black;
- correction fades out from luma `0.10...0.24`; luma `>=0.24` is identity;
- tile weights become a 144×144 piecewise-constant mask (24 pixels per tile);
- Lanczos scales that mask to output size, followed by only 2...6 output-pixel Gaussian feathering;
- `CIBlendWithMask` applies the lifted image only inside the bounded mask.

Declared vignette and stochastic film effects remain downstream and are not treated as damage. The intensity slider still performs one final source/result blend, and a 100 ms debounce prevents every slider tick from creating new queued work.

## Offline approximation

The supplied saved 100% PNG was used for a deterministic approximation of the local gain/mask. It is not a Swift/Core Image device render.

- estimated known-recipe activation: likely;
- estimated toe: approximately `0.025...0.037`, depending on pointwise style allowance and pre-film sampling;
- maximum local `ΔL`: bounded to `0.025`;
- whole-image q10: approximately `0.2176 -> 0.2178`;
- q50: approximately `0.6949 -> 0.6949`;
- pixels below luma `0.12`: approximately `7.80% -> 7.45...7.50%`;
- mean saturation: effectively unchanged around `0.2275`.

This is the intended behaviour: local shadow texture improves while global black level, midtones, warmth, and saturation remain stable. It does not prove actual device activation or every style family.

## Verification

- Focused Filter Lab recipe/render-policy test: `10/10` passed.
- Full backend regression suite: `429/429` passed.
- Static/source-contract checks cover Recipe v2 gating, alpha handling, full-tile style-percentile alignment, piecewise mask construction, bounded cube, debounce, and absence of target-specific/provider code in iOS.
- Synthetic policy-math fixtures cover repeated accidental crush, one dark object, flat black, intentional low-key, faded, bright normalization, chromatic shadows, and several synthetic style-density buckets.
- Adaptive cube invariants cover exact black, identity at luma `>=0.24`, and maximum `ΔL <= 0.025`.
- Final Swift/Core Image blocker review found no known compile/API, mandatory no-op, or obvious false-positive blocker.
- No Xcode build was run on this Windows host. Real Core Image pixels, mask orientation, grid boundaries, latency, memory, and multi-style fidelity remain pending on Mac/iPhone.

The previously generated ignored `filter_lab_sanitized_analysis.v2` artifact remains privacy-safe with all seven leakage flags false and `productionReady:false`; no additional paid-provider request was required for this local renderer polish.

The backend was restarted with the latest prompt and the user-authorized external process-only credential. Localhost and `192.168.68.60:8787` health checks report `xiaoyiLunaInternal`, Filter Lab ready, and `productionReady:false`.

## Apple API references

- [`CIImage(bitmapData:bytesPerRow:size:format:colorSpace:)`](https://developer.apple.com/documentation/coreimage/ciimage/1437857-init) is used for bounded local calibration and mask images.
- [`CILanczosScaleTransform`](https://developer.apple.com/documentation/coreimage/cilanczosscaletransform) provides the sample/mask scaling stage.
- [`CIBlendWithMask`](https://developer.apple.com/documentation/coreimage/ciblendwithmask/maskimage) selects between corrected and untouched tone-colour output using the local mask.
- Apple's [Core Image Filter Reference](https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/) documents the colour-cube and other filter contracts used by this renderer.

## Privacy and architecture boundaries

- Selected style/reference image uses the existing consented backend path: yes.
- Apply/original and adaptive samples/statistics stay local and in-memory: yes.
- Raw image, base64, sample, statistic, prompt, request body, or provider response logging/persistence added: no.
- Direct iOS provider URL/key/SDK/call: no.
- Camera cloud AI entry: no.
- Historical Recipe `1.1` behaviour intentionally changed: no.
- Default/production cloud rollout: no.
- `productionReady:false` remains locked: yes.

## Required Mac/device checks

1. Build `ios-app/AIPhotoApp.xcodeproj` in DEBUG.
2. Re-render the supplied pair at 0/50/100% and long-press save the 100% result.
3. Verify black fur/fabric separation improves without gray haze, halo, tile boundaries, colour shift, or lost vignette.
4. Test warm faded, cool chrome, intentional low-key, muted pastel, neutral, and saturated-neon references against both bright and dark apply photos.
5. Confirm Recipe `1.1` output remains unchanged.
6. Stress the slider and repeated previews for latency, memory, stale-render, and queue-backlog behaviour.

The candidate is ready for that verification, not for production rollout.
