# PT2-SF-R9 - Physical-device DEBUG Filter Lab Backend E2E Smoke

Status: implemented; awaiting operator physical-device run
Date: 2026-06-23
Production readiness: `productionReady:false`

## Summary

PT2-SF-R9 adds the DEBUG-only iOS backend base URL override needed for a physical iPhone to reach the local/LAN backend during Filter Lab testing. The app can now read `AI_PHOTO_CLOUD_AI_BASE_URL` from the Xcode scheme environment in DEBUG builds and keep the default simulator/local value as `http://127.0.0.1:8787`.

This phase does not add any provider credential to iOS, does not add a direct SiliconFlow/Xiaoyi provider call, does not change Xcode project settings, does not run a provider smoke, and does not change the backend payload contract. Filter Lab still sends only the style reference image to the backend; the apply/original image remains local and is used only for local preview rendering.

## Operator Setup for Physical Device

1. Start the backend on the Mac/PC in a phone-reachable LAN mode, for example binding to `0.0.0.0` on the chosen debug port.
2. Confirm the phone and computer are on the same Wi-Fi or otherwise reachable LAN.
3. In Xcode, edit the DEBUG run scheme and add an environment variable:

```text
AI_PHOTO_CLOUD_AI_BASE_URL=http://<computer-lan-ip>:8787
```

4. Do not put any SiliconFlow/Xiaoyi/OpenAI/provider API key in the Xcode scheme.
5. Run the app on the physical iPhone.
6. Open Filter Lab, choose one style reference image and one separate apply/original image.
7. Accept the DEBUG cloud consent sheet.
8. Confirm the generated recipe comes back from the backend and the before/after preview applies locally to the apply/original image.

## Expected Result

- iPhone DEBUG Filter Lab reaches the computer-hosted backend by LAN URL.
- Backend receives exactly one style reference image for Filter Lab recipe generation.
- Backend does not receive the apply/original image.
- iOS receives a generated recipe and renders the preview locally.
- Fallback remains available if the LAN backend is unavailable or response validation fails.

## Changed Files

- `ios-app/AIPhotoApp/Services/CloudAI/CloudAIEndpointClient.swift`
- `README.md`
- `ios-app/README.md`
- `docs/pt2-sf-r9-physical-device-debug-filter-lab-backend-e2e.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`

## Tests and Checks

- Static source inspection of Filter Lab cloud path.
- `git diff --check`
- Safety scans for provider credential leakage, raw request/provider/image/base64 leakage, direct iOS provider calls, upload payload expansion, Xcode project edits, backend runtime edits, model artifacts, and `productionReady:true`.

Physical-device Xcode run is still operator-side because this Windows Codex environment cannot run the iPhone/Xcode test directly.

## Boundary Confirmations

- Swift runtime changed: yes, DEBUG-only backend URL override.
- Xcode project changed: no.
- Backend runtime code changed: no.
- Backend payload expanded: no.
- Backend received apply/original image: no.
- Provider/model call run in this phase: no.
- API key value printed/saved/committed: no.
- Authorization header printed/committed: no.
- Raw request payload printed/committed: no.
- Raw provider response printed/committed: no.
- Raw image/base64 printed/committed: no.
- Direct iOS provider call: no.
- Direct provider URL/key in iOS: no.
- Provider SDK in iOS: no.
- Camera cloud AI entry: no.
- Image editor provider behavior: no.
- StoreKit/quota runtime: no.
- Production rollout: no.
- `productionReady:false` remains locked.

## Ready for Next Phase

Recommended next step is `PT2-SF-R9-RUN - Operator Physical-device Filter Lab LAN Backend Verification`.

Run it only when the backend is reachable from the phone and the Xcode DEBUG scheme has `AI_PHOTO_CLOUD_AI_BASE_URL` pointing to the computer LAN backend. Keep it one physical-device E2E verification, backend-mediated only, one style reference upload only, apply/original image local-only, no direct iOS provider call, no raw logging, and `productionReady:false`.
