# PT2-SF-R5 Debug-only iOS Inspiration Backend Integration Scaffold

Status: implemented, pending MacBook/Xcode debug verification
Date: 2026-06-21
Phase type: debug-only iOS selected-photo scaffold
Production readiness: `productionReady:false`

## Executive Summary

PT2-SF-R5 adds the smallest app-side scaffold needed for selected-photo Inspiration backend integration.

The implemented runtime path is debug/internal only:

- Photo Advisor keeps its existing DEBUG cloud boundary button.
- Filter Lab now has a DEBUG-only backend test action after a reference image is selected.
- The app sends only a compressed, metadata-stripped selected image to the project backend boundary.
- iOS still contains no SiliconFlow key, provider key, or direct SiliconFlow URL.
- Production/default behavior remains mock/local.

This phase does not run a provider smoke, read credentials, add provider keys, change Xcode project files, add Camera cloud AI, add image editor provider behavior, or approve production rollout.

## Implemented App Scaffold

CloudAI service changes:

- Added `CloudAIFilterLabInput`.
- Added `CloudAIFilterLabRequest` using `feature:"filter_lab"` and `mode:"reference_image"`.
- Added `CloudAIEndpointClient.postFilterLab(...)` for `v1/ai/filter-lab`.
- Kept endpoint base URL as the existing local project backend default `http://127.0.0.1:8787`.
- Kept network execution behind `#if DEBUG` and `CloudAIBackendMode.debugRemoteMock`.
- Added `CloudAIService.generateFilterLab(...)` for mock/remote service parity.
- Expanded `CloudAIGeneratedFilter` to match the backend generated recipe contract.
- Added generated filter validation ranges matching the backend recipe contract.
- Added `CloudAIFilterLabMapper` to convert backend `CloudAIResponse.generatedFilter` into `GeneratedFilterRecipe`.

Filter Lab UI / ViewModel changes:

- Added `FilterLabViewModel.generateCloudDebug(consent:)`.
- The debug flow compresses the selected reference image with `CloudAIImageCompressor`.
- The debug flow calls `RemoteCloudAIService(mode: .debugRemoteMock).generateFilterLab(...)`.
- Invalid, unavailable, disabled, or fallback backend responses fall back to the local mock recipe service.
- Added a DEBUG-only Filter Lab backend test button that appears only after a reference image exists.
- Reused the existing `CloudAIConsentView` before any debug backend call.
- Added localized debug action/fallback strings.

## Behavior Boundary

Default behavior remains unchanged:

- `FilterLabViewModel()` still uses `MockFilterGenerationService()`.
- `CloudAIBackendMode.defaultMode` remains `.mockOnly`.
- Production builds cannot call `CloudAIEndpointClient.postFilterLab(...)`.
- Filter Lab still renders previews locally from validated recipe parameters.
- Camera remains local-only.

The debug backend action is allowed to call only the project backend boundary:

- `POST /v1/ai/filter-lab`

iOS does not call or store:

- SiliconFlow URL
- SiliconFlow API key
- provider `Authorization` header
- provider model ID
- provider SDK
- raw provider request/response

## Verification Notes

This Windows environment cannot run Xcode or iPhone runtime verification.

Required MacBook/Xcode debug checks:

- Build the app in DEBUG.
- Select or import a reference image in Filter Lab.
- Confirm the debug backend button appears only after a reference image exists.
- Tap the debug button and confirm the consent sheet appears before upload.
- With backend disabled/unavailable, confirm the UI falls back to a local recipe and does not crash.
- With a local backend mock/fallback response, confirm no provider key or provider URL appears in app logs/UI.
- Confirm production/default launch still uses mock/local behavior.
- Confirm Camera capture, live filter preview, and Camera local guidance remain unchanged.

## Recommended Next Phase

Recommended next phase:

- `PT2-SF-R5-VERIFY - MacBook/Xcode Debug Inspiration Backend Smoke`

Scope:

- Operator-run Xcode DEBUG build.
- Local backend boundary only.
- First verify disabled/fallback behavior without provider credentials.
- Provider-backed debug smoke requires a separate explicit approval and should be one selected image only.

Do not start image editor / 改圖師 provider work yet. Keep it separate after Photo Advisor and Filter Lab selected-photo debug paths are stable.

## Boundary Confirmations

- Swift runtime changed: yes, debug-only selected-photo Filter Lab scaffold
- Xcode project changed: no
- Backend runtime changed: no
- Provider/model call run: no
- API key read/printed/committed: no
- Direct provider URL/key in iOS: no
- Provider SDK in iOS: no
- Image upload run during this phase: no
- Upload payload changed for production/default: no
- Camera cloud AI entry: no
- Image editor provider behavior: no
- StoreKit/quota runtime: no
- Production rollout: no
- `productionReady:false`
