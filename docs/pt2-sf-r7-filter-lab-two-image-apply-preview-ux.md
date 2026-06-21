# PT2-SF-R7 - Filter Lab Two-image Apply Preview UX

Status: implemented, user verified on physical device
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R7 updates the iOS Filter Lab flow so custom filter generation no longer uses one photo for both recipe generation and preview. The app now separates the target filter reference image from the original/apply image, then applies the generated recipe locally to the original image for the effect preview.

## Completed Work

- Added separate Filter Lab picker state for the target filter reference image and the original/apply image.
- Updated `FilterLabViewModel` so recipe generation uses only the style reference image.
- Updated preview rendering so `GeneratedFilterPreviewRenderer` applies the generated recipe to the separate original/apply image.
- Kept DEBUG backend Filter Lab payload to one image: the selected style reference image only.
- Updated the result view to show the style reference image plus original/effect before-after preview.
- Updated English and Traditional Chinese Filter Lab copy for the two-image flow.
- Updated README and roadmap next action notes.

## Boundary Confirmations

- Swift runtime changed: yes, Filter Lab app-side UX/runtime only.
- Xcode project changed: no.
- Backend runtime changed: no.
- Backend payload expanded: no.
- Provider/model call run: no.
- API key read/printed/committed: no.
- Direct provider URL/key in iOS: no.
- Provider SDK in iOS: no.
- Camera cloud AI entry: no.
- Image editor provider behavior: no.
- Generated bitmap/shader/LUT behavior: no.
- StoreKit/quota runtime: no.
- Production rollout: no.
- `productionReady:false` remains locked.

## Manual Verification Result

The operator reported physical-device testing OK on 2026-06-22. Filter Lab's two-image app-side flow is accepted for this phase. Provider-backed DEBUG AI behavior remains separate and was not run in this phase.

## Recommended Next Step

Run `PT2-SF-R8 - Debug-only Filter Lab Provider-backed One-reference Smoke Approval Gate` only if the operator wants to verify real AI next. Any provider-backed debug smoke still requires separate explicit approval and must remain backend-mediated with server-side credentials only. The backend may receive only the selected style reference image; the original/apply image must stay local.
