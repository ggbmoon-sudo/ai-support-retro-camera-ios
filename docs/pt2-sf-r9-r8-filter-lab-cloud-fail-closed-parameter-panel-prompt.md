# PT2-SF-R9-R8 - Filter Lab Cloud Fail-closed and Parameter Panel Prompt

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-24
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R8 fixes two DEBUG Filter Lab test issues found during physical-device QA:

- Cloud debug failures no longer fall back into a mock recipe result. If the backend does not return a cloud recipe, the app shows a cloud failure state so the operator cannot mistake a mock result for AI output.
- The SiliconFlow Filter Lab prompt now prioritizes visible filter/settings panels, numeric slider values, icon/value rows, preset cards, or recipe overlays in the reference image. Filter Lab provider requests use high image detail so small visible parameter text is more likely to be read.

This phase still sends only the target filter/style reference image to the backend. The apply/original image remains local-only for preview rendering.

## Changed Files

- `ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `backend/src/providers/generatedFilterRecipeContract.mjs`
- `backend/src/providers/SiliconFlowCloudAIProvider.mjs`
- `backend/src/qa/siliconFlowFilterLabRecipeQAGate.mjs`
- `backend/tests/cloud-ai-boundary.test.mjs`
- `backend/tests/siliconflow-filter-lab-recipe-qa-gate.test.mjs`
- `docs/pt2-sf-r9-r8-filter-lab-cloud-fail-closed-parameter-panel-prompt.md`
- `docs/phase-log.md`

## Tests and Checks

- `git diff --check`
- `node --test backend/tests/cloud-ai-boundary.test.mjs backend/tests/siliconflow-filter-lab-recipe-qa-gate.test.mjs` passed: 76 tests.
- Safety scans for provider credential leakage, raw request/provider/image/base64 leakage, direct iOS provider calls, backend payload expansion, and `productionReady:true`.

## Xcode Verification

- Run Filter Lab in DEBUG.
- Choose one target filter/style reference image with visible parameters.
- Choose one separate original/apply image.
- Tap `Debug: Test Filter Lab Backend`.
- Accept consent.
- If the backend succeeds, confirm result source is `Cloud result`.
- If backend fails, confirm no `Mock result` recipe is shown for the cloud test.

## Boundary Confirmations

- Cloud debug fallback to mock result disabled: yes.
- Visible parameter-panel prompt guidance added: yes.
- Filter Lab provider image detail changed to high: yes.
- Backend runtime code changed: yes, provider prompt/request detail only.
- Provider/model call run in this phase: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend route/payload expanded: no.
- Backend receives apply/original image: no.
- Production/default behavior changed: no.
- Production rollout: no.
- `productionReady:false` remains locked.
