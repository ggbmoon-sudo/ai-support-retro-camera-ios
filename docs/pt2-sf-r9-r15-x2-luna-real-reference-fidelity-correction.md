# PT2-SF-R9-R15-X2 - Luna Real-reference Fidelity Correction

Status: implemented; backend/provider verification passed; physical-device visual retest pending  
Date: 2026-07-19  
Production readiness: `productionReady:false`

## Evidence

The operator supplied a Luna-generated 100% result, the target-filter screenshot, and the previously supplied original image. The result was visibly over-lifted, low-contrast, under-saturated, and insufficiently warm relative to the target photograph region.

Sanitized image statistics confirmed the failure:

- original luminance q10 / q90: `0.241 / 0.870`;
- generated result luminance q10 / q90: `0.506 / 0.849`;
- target photograph region luminance q10 / q90: `0.214 / 0.793`;
- generated result contrast spread q90-q10: `0.342`, versus target `0.579`;
- generated result mean saturation: `0.114`, versus original `0.178` and target photograph region `0.253`.

The saved recipe explained the washout: `contrast:-0.18`, `fade:0.20`, and `shadowLift:0.16` compounded on an already bright original. The renderer also mapped `shadowLift` to Core Image at `1.8x`, so the small recipe value produced a much stronger visible lift than the model calibration text implied.

## Changes

- The shared Filter Lab prompt now isolates the actual photograph region before analysis and excludes white settings panels, QR codes, controls, borders, captions, and sharing UI from tonal/color estimates.
- Black point is now judged from the darkest photographic areas rather than average/reference brightness.
- White/gray UI and pale backgrounds cannot be used as evidence of low saturation or a raised black floor.
- The prompt explicitly warns that fade, shadow lift, and negative contrast compound.
- When the photograph retains deep separated blacks, the prompt caps fade guidance at `0.10`, shadow lift at `0.08`, and negative contrast at `-0.05`.
- Luna Filter Lab image detail changed from `low` to `high`; Photo Advisor remains `low`.
- Luna JSON typing guidance now explicitly requires `recommendedUseKeys` and `warningsKeys` arrays.
- The iOS Core Image shadow mapping changed from `shadowLift * 1.8` to a bounded `min(0.22, shadowLift * 0.55)`.

## Bounded Provider QA

Only the supplied target-filter image was uploaded. The original/apply image and generated result were not uploaded.

- First real-reference call: one call, zero retry, HTTP 200; rejected safely as `wrong_type / recommended_use_keys`; no artifact saved.
- After explicit array typing: one call, zero retry, HTTP 200; strict recipe `1.1` accepted; sanitized artifact saved.
- Accepted calibrated recipe: `exposure:0.02`, `contrast:0.01`, `saturation:-0.08`, `temperature:0.22`, `tint:0.03`, `fade:0.06`, `shadowLift:0.04`, `highlightRollOff:0.12`, `bloom:0.02`, `grain:0.20`, `dust:0.18`, `vignette:0.08`.
- The negative saturation remains plausible because the supplied third-party settings screenshot also shows a negative saturation-like control. It should not be forced positive before a rendered comparison.
- No raw prompt, request, response, image/base64, Authorization header, API key, or provider error text was printed or persisted.

## Verification

- Focused provider/renderer/artifact tests: 83 passed, then 77 passed after array typing alignment.
- Full backend suite: 425 passed, 0 failed.
- Updated backend is reachable on localhost and `192.168.68.60:8787` in `xiaoyiLunaInternal` mode.
- Filter Lab ready: yes.
- `productionReady:false`: unchanged.

## Xcode Retest

The backend prompt is already live, but the renderer gain change requires the updated iOS source to be built on the MacBook. After updating the Mac clone:

1. Build and run the DEBUG app on the physical iPhone.
2. Use the same target screenshot and original cat photo.
3. Generate at 100% intensity.
4. Long-press the after preview and save it.
5. Return the new saved result for target/original/result comparison.

Expected correction: substantially deeper blacks, restored tonal separation, much less white haze, slightly warmer output, and retained film grain/dust. Exact visual fidelity remains pending this physical-device result.

## Boundaries

- Direct iOS provider key/URL/SDK/call: no.
- iOS upload payload expansion: no.
- Apply/original image upload: no.
- Camera cloud AI entry: no.
- Raw provider/image/secret persistence: no.
- Production/default cloud rollout: no.
- `productionReady:false` remains locked.
