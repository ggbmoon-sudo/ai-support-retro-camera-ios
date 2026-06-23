# PT2-SF-R9-R1 - Physical-device Local Network Launch Hotfix

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R1 fixes the physical-device launch/LAN debug setup after the app showed an early `abort_with_payload` crash in Xcode. The hotfix adds the generated Info.plist local network usage description and allows DEBUG local networking for the phone-to-computer backend test path.

This does not add a provider key, direct provider URL, provider SDK, backend runtime change, provider smoke, upload payload expansion, Camera cloud AI entry, or production rollout.

## Changed Files

- `ios-app/AIPhotoApp.xcodeproj/project.pbxproj`
- `docs/pt2-sf-r9-r1-local-network-launch-hotfix.md`
- `docs/phase-log.md`
- `README.md`

## Xcode Retry Steps

1. Keep `AI_PHOTO_CLOUD_AI_BASE_URL=http://192.168.68.60:8787` in the DEBUG run scheme.
2. Product > Clean Build Folder.
3. Delete the app from the iPhone.
4. Build and run again from Xcode.
5. If iOS asks for Local Network permission, allow it.

## Boundary Confirmations

- Xcode project changed: yes, generated Info.plist local-network keys only.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Apply/original image upload: no.
- Camera cloud AI entry: no.
- Production rollout: no.
- `productionReady:false` remains locked.
