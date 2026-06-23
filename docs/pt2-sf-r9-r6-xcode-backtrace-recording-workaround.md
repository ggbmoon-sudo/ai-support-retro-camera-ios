# PT2-SF-R9-R6 - Xcode Backtrace Recording Workaround

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R6 identifies the physical-device launch crash as the known Xcode/iOS debugger issue that reports:

```text
-[OS_dispatch_mach_msg _setContext:]: unrecognized selector sent to instance
```

This occurs before the app's SwiftUI root can render, even with a pure `Text("DEBUG SAFE BOOT")` root. The app-side temporary safe boot changes were restored. The required operator workaround is to disable Xcode scheme backtrace recording:

```text
Edit Scheme > Run > Options > uncheck Enable backtrace recording
```

The DEBUG backend URL resolver supports both `UserDefaults` key `AIPhotoCloudAIBaseURL` and the Xcode Scheme environment variable `AI_PHOTO_CLOUD_AI_BASE_URL`.

## Changed Files

- `ios-app/AIPhotoApp/AIPhotoApp.swift`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Services/CloudAI/CloudAIEndpointClient.swift`
- `docs/pt2-sf-r9-r6-xcode-backtrace-recording-workaround.md`
- `docs/phase-log.md`

## Xcode Retry

1. Product > Scheme > Edit Scheme.
2. Select `Run`.
3. Open the `Options` tab.
4. Uncheck `Enable backtrace recording`.
5. Keep `AI_PHOTO_CLOUD_AI_BASE_URL=http://192.168.68.60:8787` only as an Environment Variable if needed for the LAN backend test.
6. Clean Build Folder.
7. Delete the app from the iPhone.
8. Build and run again.

## Boundary Confirmations

- App launch restored to normal root: yes.
- Temporary DEBUG safe boot removed: yes.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Production rollout: no.
- `productionReady:false` remains locked.
