# PT2-SF-R9-R3 - Stop Reading Xcode Scheme Environment URL

Status: implemented; awaiting Xcode physical-device retry
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9-R3 stops reading `AI_PHOTO_CLOUD_AI_BASE_URL` from Xcode Scheme environment variables after physical-device testing showed a launch-time black screen immediately after the scheme value was added. The DEBUG backend URL resolver now reads only the local `UserDefaults` key `AIPhotoCloudAIBaseURL`, falling back to `http://127.0.0.1:8787`.

For the immediate retry, remove the Xcode Scheme environment variable and confirm the app opens. A safer in-app DEBUG backend URL control can be added next if the launch is stable.

## Changed Files

- `ios-app/AIPhotoApp/Services/CloudAI/CloudAIEndpointClient.swift`
- `docs/pt2-sf-r9-r3-stop-scheme-env-read.md`
- `docs/phase-log.md`

## Xcode Retry Needed

1. Remove `AI_PHOTO_CLOUD_AI_BASE_URL` from the Xcode Scheme environment variables.
2. Product > Clean Build Folder.
3. Delete the app from the iPhone.
4. Build and run again.
5. Confirm the app opens to Home in DEBUG.

## Boundary Confirmations

- Xcode Scheme env URL read disabled: yes.
- Provider/model call run: no.
- Provider key in iOS: no.
- Direct iOS provider call: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Apply/original image upload: no.
- Production rollout: no.
- `productionReady:false` remains locked.
