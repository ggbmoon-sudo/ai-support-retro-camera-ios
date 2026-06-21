# PT2-SF-R6 - Backend SiliconFlow App Endpoint Routing Fix

Status: implemented, pending MacBook/Xcode debug verification
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R6 fixes the backend routing gap found after the DEBUG Filter Lab app scaffold was run: the app could call the backend path, but the backend runtime only treated the old Xiaoyi relay mode as executable for Filter Lab. With the env switched to SiliconFlow, `/v1/ai/filter-lab` could not activate a provider-backed generated recipe path.

This phase wires SiliconFlow into the existing internal/debug backend boundary for selected-photo Photo Advisor and Filter Lab. It does not add provider credentials, run a live credential smoke, change Swift/Xcode files, add Camera AI, or enable production/default cloud rollout.

## Root Cause

- PT2-SF-R5 added the app-side DEBUG selected-photo Filter Lab backend scaffold.
- The backend app route still recognized only `xiaoyiRelayInternal` for Filter Lab provider resolution.
- When the backend env used `CLOUD_AI_PROVIDER_MODE=siliconflowInternal`, the route failed closed to fallback, so the app saw no AI-connected generated filter result.

## Completed Work

- Added backend `SiliconFlowCloudAIProvider` runtime adapter for internal/debug use.
- Added server-side SiliconFlow config normalization for:
  - `SILICONFLOW_API_KEY`
  - `SILICONFLOW_BASE_URL`
  - `SILICONFLOW_CHAT_COMPLETIONS_PATH`
  - `SILICONFLOW_PHOTO_ADVISOR_MODEL`
  - `SILICONFLOW_FILTER_LAB_MODEL`
- Registered `siliconflowInternal` in the backend provider registry and provider boundary metadata.
- Routed `/v1/ai/photo-advisor` through SiliconFlow when the internal debug gate and server-side config are present.
- Routed `/v1/ai/filter-lab` through SiliconFlow when the internal debug gate and server-side config are present.
- Kept Photo Advisor output app-safe by mapping provider semantic output through the existing backend validator.
- Kept Filter Lab output app-safe by validating generated filter recipe JSON before returning it to the app.
- Added mocked route/provider tests for SiliconFlow request shape, config normalization, Photo Advisor route activation, Filter Lab route activation, and parser rejection.

## Backend Env Shape

Use server-side env only:

```sh
CLOUD_AI_PROVIDER_MODE=siliconflowInternal
ALLOW_INTERNAL_CLOUD_AI=true
SILICONFLOW_API_KEY=replace_me
SILICONFLOW_BASE_URL=https://api.siliconflow.com
SILICONFLOW_CHAT_COMPLETIONS_PATH=/v1/chat/completions
SILICONFLOW_PHOTO_ADVISOR_MODEL=Qwen/Qwen3-VL-32B-Instruct
SILICONFLOW_FILTER_LAB_MODEL=Qwen/Qwen3-VL-32B-Instruct
```

Do not put these values in iOS. Do not print the key, raw prompt, raw request body, raw provider response, raw image/base64, or Authorization header.

## Verification

- `npm --prefix backend test`
  - Result: 408 tests passed.

## Boundary Confirmations

- Swift runtime changed: no
- Xcode project changed: no
- Backend runtime changed: yes, internal/debug SiliconFlow provider routing only
- Provider credential added/read/printed/committed: no
- Live provider/network smoke run: no
- Tests used mocked fetch only: yes
- Direct provider URL/key in iOS: no
- Provider SDK in iOS: no
- Camera cloud AI entry: no
- Image editor provider behavior: no
- Generated bitmap/shader/LUT/rendering output: no
- Upload payload changed for production/default: no
- StoreKit/quota runtime: no
- Production rollout: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Run `PT2-SF-R6-VERIFY - MacBook/Xcode Debug SiliconFlow App Endpoint Routing Verification`.

Recommended order:

1. Run DEBUG app with backend disabled or missing internal gate and confirm selected-photo Photo Advisor / Filter Lab fall back safely.
2. Confirm no SiliconFlow URL, provider key, Authorization header, raw prompt, raw request body, raw provider response, or raw image/base64 appears in app logs/UI.
3. If separately approved, run one selected-photo provider-backed debug smoke through the backend only.
4. Confirm Camera runtime remains unchanged and local-only.

## Ready For Next Phase

Recommended next step is `PT2-SF-R6-VERIFY - MacBook/Xcode Debug SiliconFlow App Endpoint Routing Verification`.

Do not start image editor provider work, Camera AI work, production rollout, direct iOS provider calls, or live provider smoke without separate explicit approval.
