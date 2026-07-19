# PT2-SF-R9-R15 Filter Lab Sanitized Analysis and Fidelity Calibration

## Status

Implemented on 2026-07-19. Offline/backend contract verification passed. Mac/Xcode physical-device rendering and a new live-provider comparison remain pending. No provider call was made in this implementation phase.

## Why R15 exists

The supplied target/original/result comparison showed that the generated result darkened most pixels and clipped too many blacks, while the target retained a lifted, warm, slightly magenta faded-flash look with visible analog defects. The prior prompt also treated a third-party settings panel as if its signed values were absolute values for this app's renderer. That is unsafe because a third-party slider is usually a relative adjustment layered on an unknown base preset.

R15 therefore makes final rendered pixels the primary evidence. Third-party preset names, icons, and slider values are secondary directional hints only and must never be proportionally copied into this app's absolute parameter ranges.

## Recipe contract 1.1

The existing controls remain bounded and four reproducible effect controls are added:

- `shadowLift` (`0...0.4`) opens dark detail without using exposure.
- `highlightRollOff` (`0...0.4`) softens bright peaks without lowering the whole image.
- `bloom` (`0...0.3`) adds bounded highlight diffusion.
- `dust` (`0...0.35`) adds sparse dust and short scratches separately from uniform film grain.

`fade` now represents a gentle raised black floor. The renderer uses dedicated tone controls, applies bounded bloom/grain/dust locally, and reduces vignette calibration so a faded look is not recreated by crushing edges and shadows.

The provider output token bound for the larger strict recipe object is `512`. The outer Cloud AI response remains schema `1.0`; the nested generated recipe is schema `1.1`.

## Sanitized server analysis artifact

Persistence is disabled by default. It is enabled only with this ignored local backend setting:

```dotenv
FILTER_LAB_SAVE_SANITIZED_ANALYSIS=true
```

After a provider candidate passes backend recipe validation, the server may write one ignored local JSON file under:

```text
backend/reports/filter-lab-sanitized-analysis/
```

The file contains only:

- artifact schema/version and timestamp;
- provider mode, attempt count, and latency buckets;
- an explicit allowlist of validated recipe version/source/localization keys, confidence bucket, use/warning keys, and the 12 normalized parameters;
- explicit privacy flags set to `false`;
- `productionReady: false`.

It never contains the model-generated recipe ID, exact confidence value, uploaded image, image/base64 data, raw prompt, raw request, raw provider response, Authorization header, API key, provider error text, or apply/original photo. New future recipe fields are not persisted unless they are explicitly reviewed and added to this allowlist. A write failure is reduced to `artifact_write_failed` metadata and does not expose unsafe content.

The directory is gitignored. Generated artifacts and real comparison photos must remain untracked.

## Next Mac/Xcode comparison

1. Pull/clone this R15 code and build the DEBUG app in Xcode.
2. In the ignored backend `.env.local`, enable sanitized analysis persistence while keeping all provider credentials server-side.
3. Start the backend and confirm the DEBUG Filter Lab health check is ready.
4. Only after a fresh explicit provider-test approval, upload exactly one style/reference image and keep the separate apply/original image local.
5. Save the filtered preview with the existing long-press action.
6. Compare target, original, R15 result, and the newest sanitized recipe artifact. Pay particular attention to black clipping, shadow detail, warmth/magenta bias, highlight roll-off, grain versus dust, and corner falloff.

Do not share `.env.local`, server logs, raw provider content, requests, base64, or credentials. The safe comparison inputs are the user-selected images plus the normalized artifact JSON.

## Verification completed in this phase

- Sanitized artifact persistence tests: 6 passed.
- Focused Filter Lab/backend regression set: 90 passed.
- Full backend test suite: 424 passed.
- Cross-layer recipe 1.1 alignment test covers all 12 parameters.
- No-network QA gate remains default and reports `productionReady:false`.
- `git diff --check` passed before documentation closeout.

## Boundaries

- One style/reference image may reach the backend only in the existing DEBUG/internal flow.
- The apply/original image remains local-only.
- No raw provider response or raw analysis payload is persisted.
- No provider key, provider URL, SDK, or direct provider call is added to iOS.
- Camera receives no cloud AI entry.
- No live provider call was made by R15 implementation.
- Production/default behavior remains mock/local and `productionReady:false`.
