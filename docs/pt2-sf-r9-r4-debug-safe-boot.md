# PT2-SF-R9-R4 - DEBUG Safe Boot Isolation

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R4 adds a temporary DEBUG-only safe boot root that bypasses `AppRootView`, `MainTabShellView`, and Camera initialization. It shows only a small DEBUG landing surface with a Filter Lab entry.

This isolates the launch black-screen crash. If safe boot opens, the crash is in the normal app root or Camera launch path. If safe boot still black-screens, the issue is likely outside those views, such as Xcode scheme/project/cache/install state.

## Changed Files

- `ios-app/AIPhotoApp/AIPhotoApp.swift`
- `docs/pt2-sf-r9-r4-debug-safe-boot.md`
- `docs/phase-log.md`

## Retry

- Remove `AI_PHOTO_CLOUD_AI_BASE_URL` from Xcode Scheme environment variables.
- Clean Build Folder.
- Delete the app from the iPhone.
- Build and run.
- Expected DEBUG launch: simple `AIPhotoApp` / `DEBUG safe boot` screen with Filter Lab button.

## Boundary Confirmations

- DEBUG launch root changed: yes, temporary safe boot only.
- Release launch root changed: no.
- Camera runtime initialized on launch: no.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Production rollout: no.
- `productionReady:false` remains locked.
