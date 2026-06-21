# PT2-SF-R7 - Filter Lab Two-image Apply Preview UX

Status: implemented, pending MacBook/Xcode verification
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

## Manual Verification Needed

Build and run on MacBook/Xcode. Open Filter Lab, choose a target filter image, then choose a different original/apply image. Confirm generation starts only after both exist, the result shows the target filter image plus original/effect preview, intensity changes re-render the effect image, and `Choose other images` clears both images. In DEBUG, confirm the backend test action appears only after both images exist and, if tested with consent, sends only the style reference image through the backend while the original/apply image stays local.

## Recommended Next Step

Run `PT2-SF-R7-VERIFY - MacBook/Xcode Filter Lab Two-image Apply Preview Verification`. Start with local/sample/fallback verification. Any provider-backed debug smoke still requires separate explicit approval and must remain backend-mediated with server-side credentials only.
