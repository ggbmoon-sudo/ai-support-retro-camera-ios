# PT2-SF-R9-R16 - Filter Lab Recipe v2

Status: implemented; automated and bounded live-provider verification passed; Mac/Xcode physical-device visual verification pending  
Date: 2026-07-19  
Production readiness: `productionReady:false`

## Why this phase exists

The target/reference comparison showed that twelve global controls are useful for final adjustment but cannot fully describe a transferable film look. They cannot independently shape channel response through shadows, midtones, and highlights; they cannot express a nonlinear colour transform; and one grain amount cannot describe grain scale, roughness, luminance response, halation, and diffusion.

Recipe `2.0` keeps the original twelve controls and adds bounded, deterministic local rendering primitives. The model still returns parameters rather than executable code or an arbitrary LUT.

## Recipe 2.0 contract

- Existing fine controls: exposure, contrast, saturation, temperature, tint, fade, shadow lift, highlight roll-off, bloom, grain, dust, and vignette.
- Colour transform: bounded input-normalization strength, transform intensity, five-point luma/R/G/B curves, and normalized weights over eight fixed app-owned basis looks.
- Film response: grain size, roughness, luminance response, halation strength/radius/warmth, and diffusion.
- Curves use fixed x positions `[0, 0.25, 0.5, 0.75, 1]`, must be monotonic, remain close to identity, retain a safe black point, and retain a safe white point.
- Basis weights use an exact allowlist. The backend and iOS normalize them; a zero-sum candidate falls back to neutral.
- Raw LUT data, LUT URLs, arbitrary Core Image names, shader code, and rendering code are rejected.

## Local rendering order

1. Decode and orient the apply/original image locally.
2. Apply a small local luminance normalization only when the source is clearly dark or bright.
3. Apply the original twelve bounded fine controls.
4. Build and apply a deterministic 17-cube Core Image colour cube from the safe curves and basis weights.
5. Apply bounded diffusion, warm highlight halation, luminance-aware grain, dust, and vignette.
6. Blend the complete result with the untouched source at the user-selected intensity.

The last step makes `0%` the source, `100%` the complete recipe, and `50%` a true midpoint between them. It avoids the previous behaviour where reducing individual controls could leave nonlinear effects disproportionately strong.

## Compatibility and boundaries

- Backend-generated recipes are strict `2.0`.
- iOS can still decode historical `1.1`; missing v2 structures become identity/no-op values.
- The backend receives exactly one style/reference image.
- The apply/original image and all 17-cube construction/rendering remain on device.
- No provider key, provider URL, provider SDK, or direct provider call is added to iOS.
- Camera remains local-only.
- Sanitized analysis artifacts may contain only the validated normalized recipe and safe metadata buckets; never images/base64, raw prompts, request bodies, raw provider responses, Authorization headers, keys, or provider error text.
- `productionReady:false` remains locked.

## Verification completed

- Focused Recipe v2, provider-boundary, sanitized-artifact, fidelity, and QA-gate tests: 93 passed, 0 failed.
- Full backend regression suite: 427 passed, 0 failed.
- `git diff --check`: passed (line-ending warnings only on existing Windows CRLF files).
- One bounded target-only Luna request: accepted strict recipe `2.0` in one provider attempt; latency bucket `gt_15s`.
- Returned structure: 12 fine controls, four five-point curves, eight normalized basis weights with sum `1`, and a complete bounded film block.
- Sanitized artifact: `filter_lab_sanitized_analysis.v2`; all image/base64/raw prompt/raw request/raw response/auth/key flags false; `productionReady:false`.
- Runtime health: localhost and `192.168.68.60:8787` reachable; `xiaoyiLunaInternal`; Filter Lab ready.
- Windows does not provide Xcode/Swift compilation; the new Swift path has source-contract coverage and still requires a Mac/Xcode build.

## Physical-device acceptance checks

- Generate the same target/original pair and confirm the cloud result reports recipe `2.0` rather than falling back.
- Compare and long-press-save `0%`, `50%`, and `100%`; `0%` must match the original and `50%` must sit visibly between original and full effect.
- Confirm deep blacks remain separated, warm red/brown styling does not become a global pale wash, and the cyan wall is not treated as the target colour cast.
- Confirm halation appears around bright highlights rather than lifting the whole frame.
- Confirm grain size, roughness, and luminance response behave independently.
- Repeat intensity changes and renders for ten minutes to confirm the existing 1600-pixel memory bound remains effective.
