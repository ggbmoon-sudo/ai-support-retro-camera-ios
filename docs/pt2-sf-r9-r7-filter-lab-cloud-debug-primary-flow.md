# PT2-SF-R9-R7 - Filter Lab Cloud Debug Primary Flow

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-24
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R7 changes DEBUG Filter Lab behavior so selecting the style reference image and apply/original image no longer auto-generates a mock recipe. Instead, DEBUG builds show a clear "Ready for Cloud AI" state and require the operator to tap the backend test action and accept consent before the style reference image is sent to the backend.

When the backend returns a cloud generated recipe, the result card source label shows `Cloud result` / `雲端結果`. If the cloud call fails and the fallback path is used, the result remains a mock/local recipe and the fallback message is shown.

## Changed Files

- `ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift`
- `ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `docs/pt2-sf-r9-r7-filter-lab-cloud-debug-primary-flow.md`
- `docs/phase-log.md`

## Xcode Check

- Open Filter Lab in DEBUG.
- Choose one target filter/style reference image.
- Choose one separate original/apply image.
- Confirm no mock result is auto-generated.
- Tap `Debug: Test Filter Lab Backend` / `Debug：測試 Filter Lab 後端`.
- Accept the cloud consent sheet.
- Confirm successful backend result shows `Cloud result` / `雲端結果`.

## Boundary Confirmations

- DEBUG Filter Lab cloud test made primary operator flow: yes.
- Consent remains required before upload: yes.
- Backend receives only the style reference image: yes.
- Apply/original image remains local-only: yes.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Production/default behavior changed: no.
- Production rollout: no.
- `productionReady:false` remains locked.
