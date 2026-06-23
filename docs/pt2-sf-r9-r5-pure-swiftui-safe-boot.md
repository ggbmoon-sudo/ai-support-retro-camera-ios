# PT2-SF-R9-R5 - Pure SwiftUI DEBUG Safe Boot

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R5 reduces the DEBUG safe boot root to a pure SwiftUI `Text("DEBUG SAFE BOOT")` view. It references no app design tokens, Home, Filter Lab, Camera, backend client, or app services.

If this still black-screens, the failure is very likely outside the app view tree or the new backend URL code, such as Xcode scheme state, stale DerivedData, install cache, signing/runtime launch state, or a project/build artifact problem.

## Changed Files

- `ios-app/AIPhotoApp/AIPhotoApp.swift`
- `docs/pt2-sf-r9-r5-pure-swiftui-safe-boot.md`
- `docs/phase-log.md`

## Retry

- Remove `AI_PHOTO_CLOUD_AI_BASE_URL` from Xcode Scheme environment variables.
- Clean Build Folder.
- Delete the app from the iPhone.
- Build and run.
- Expected DEBUG launch: black screen with white `DEBUG SAFE BOOT` text.

## Boundary Confirmations

- DEBUG launch root changed: yes, pure SwiftUI Text only.
- Release launch root changed: no.
- Camera/Home/Filter Lab initialized on launch: no.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Production rollout: no.
- `productionReady:false` remains locked.
