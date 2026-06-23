# PT2-SF-R9-R2 - DEBUG Home Launch Workaround

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R2 changes DEBUG app launch to start on Home instead of Camera after physical-device testing showed a launch-time black screen / `abort_with_payload` crash. The app's main tab shell previously opened Camera immediately, so Camera runtime initialized before the user could reach Filter Lab.

This is a temporary DEBUG-only workaround to unblock Filter Lab LAN backend testing and isolate the crash to the Camera launch path. Release launch still starts on Camera.

## Changed Files

- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `docs/pt2-sf-r9-r2-debug-home-launch-workaround.md`
- `docs/phase-log.md`

## Boundary Confirmations

- DEBUG launch tab changed: yes, Home first.
- Release launch tab changed: no.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Apply/original image upload: no.
- Production rollout: no.
- `productionReady:false` remains locked.
