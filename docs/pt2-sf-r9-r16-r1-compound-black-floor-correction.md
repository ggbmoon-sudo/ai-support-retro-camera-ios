# PT2-SF-R9-R16-R1 - Recipe v2 Compound Black-Floor Correction

Status: implemented; automated, saved-recipe regression, and bounded live-provider verification passed; Mac/Xcode physical-device visual verification pending  
Date: 2026-07-20  
Production readiness: `productionReady:false`

## Why this follow-up exists

The operator confirmed that the newest returned comparison was a 100% intensity Recipe v2 result. R16 had already moved the result much closer to the target in warm colour direction and tonal spread, but the result still had an elevated black floor and bright midtones.

The failure was not caused by the user intensity blend. Several independently valid controls were lifting black in sequence:

- the luma curve black point;
- nonzero black endpoints on the R/G/B curves;
- fade;
- shadow lift; and
- negative contrast.

Prompt wording alone cannot guarantee that these individually bounded fields remain safe in combination, so R16-R1 adds the same deterministic rule on both sides of the backend/iOS boundary.

## Shared black-floor contract

The luma curve owns tonal black/white endpoints. Each R/G/B curve must start at exactly `0` and end at exactly `1`; its three interior points remain available for channel-specific colour shaping.

For Recipe v2, backend and iOS calculate:

`compoundBlackFloor = lumaBlack + fade*0.15 + shadowLift*0.22 + max(-contrast, 0)*0.35`

The accepted maximum is:

`max(0.035, lumaBlack)`

If a candidate exceeds the limit, normalization proceeds deterministically:

1. Neutralize negative contrast first when fade or shadow lift is also contributing.
2. Proportionally scale fade and shadow lift to the remaining budget.
3. If negative contrast is the only excess contributor, cap it to the remaining budget.
4. Preserve exposure, saturation, temperature, tint, curve midpoints, basis-look weights, and film-response controls.

The cloud response validator also rejects an unsafe, unnormalized v2 response, and the local recipe validator repeats normalization as defense in depth.

## Saved real-recipe regression

The ignored sanitized artifact associated with the supplied 100% result contained:

- `contrast:-0.03`
- `fade:0.07`
- `shadowLift:0.05`
- `temperature:0.18`
- `saturation:0.06`
- non-identity R/G/B black and white endpoints

The new validator produces:

- `contrast:0`
- `fade:0.048837`
- `shadowLift:0.034884`
- exact R/G/B endpoints `0/1`
- compound black-floor total `0.035`
- unchanged `temperature:0.18` and `saturation:0.06`

This regression reads only the sanitized normalized recipe. It makes zero provider calls and does not read a raw image.

## Verification completed

- Focused Recipe v2/provider/artifact/QA suites: 94 passed, 0 failed.
- Full backend regression suite: 428 passed, 0 failed.
- Saved real-recipe regression reaches the exact safe budget and reports the expected clamped fields.
- One bounded target-only Luna request returned cloud Recipe `2.0` in one provider attempt with `contrast:0.06`, `fade:0.04`, `shadowLift:0.02`, and compound black floor `0.0204` against budget `0.035`.
- The live recipe kept exact R/G/B endpoints, eight basis weights summing to `1`, all four five-point curves, and all seven film fields.
- The ignored `filter_lab_sanitized_analysis.v2` artifact reports `single_attempt`; all seven privacy flags are false and `productionReady:false`.
- Localhost and `192.168.68.60:8787` are reachable in `xiaoyiLunaInternal` mode with Filter Lab ready.
- `git diff --check`: passed with line-ending warnings only.
- Full Swift/Xcode compilation is unavailable on this Windows host and remains a Mac verification item.

## Physical-device acceptance

- Pull/build the project on the MacBook and generate the same target/reference plus original/apply pair.
- Set intensity to 100%, long-press-save the corrected after image, and return it for comparison.
- Confirm dark fur and hanging dark fabric retain separated blacks without a global gray veil.
- Confirm warm red/brown styling remains present while the cyan wall does not become a global pale cast.
- Confirm 0% remains identical to source and 50% remains between source and full effect.
- Repeat preview changes for ten minutes to verify the existing 1600-pixel memory bound.

## Boundaries

- Backend input remains exactly one style/reference image.
- Apply/original and all Core Image/cube rendering remain local.
- No raw image/base64, prompt, request body, provider response/error text, Authorization header, or key is persisted.
- No provider URL/key/SDK/direct call is added to iOS.
- Camera remains local-only.
- No production cloud rollout is enabled; `productionReady:false` remains locked.
