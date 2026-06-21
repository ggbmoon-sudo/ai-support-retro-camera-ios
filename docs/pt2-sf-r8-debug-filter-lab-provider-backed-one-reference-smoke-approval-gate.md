# PT2-SF-R8 - Debug-only Filter Lab Provider-backed One-reference Smoke Approval Gate

Status: implemented, no provider run
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R8 defines the approval gate for the first app-driven DEBUG Filter Lab provider-backed smoke after the two-image Filter Lab flow was physically verified. This phase does not run the smoke, does not read provider credentials, and does not change runtime code.

The future smoke is allowed to verify only this path:

- iOS DEBUG Filter Lab selects two images.
- The app sends only the selected style reference image through the existing backend boundary.
- The original/apply image stays local and receives only the returned generated recipe through local preview rendering.
- The backend may use the existing `siliconflowInternal` provider mode and existing Filter Lab route validation.

## Explicit Non-goals

- No provider/model call is run in PT2-SF-R8.
- No API key is read, printed, copied, committed, or checked into source.
- No backend route, provider adapter, iOS request payload, or Xcode project file is changed.
- No Camera AI, live upload, image editor provider, generated bitmap, shader, LUT URL, StoreKit, quota, or production rollout is added.
- No direct iOS SiliconFlow/Xiaoyi/provider URL, SDK, key, bearer token, or provider request is added.

## Required Preconditions For A Future R8-RUN

- Worktree must be reviewed before running.
- R7 physical-device two-image flow must remain accepted.
- The app must be a DEBUG build.
- The backend must be running through the project backend boundary, not a direct provider call from iOS.
- Backend ignored/server-side environment must be configured without printing secrets:
  - `CLOUD_AI_PROVIDER_MODE=siliconflowInternal`
  - `SILICONFLOW_API_KEY` present in ignored/server-side env only
  - `SILICONFLOW_BASE_URL=https://api.siliconflow.com`
  - `SILICONFLOW_CHAT_COMPLETIONS_PATH=/v1/chat/completions`
  - `SILICONFLOW_FILTER_LAB_MODEL=Qwen/Qwen3-VL-32B-Instruct`
- The DEBUG backend test action must appear only after both Filter Lab images exist.
- `CloudAIConsentView` consent must be accepted before the request.

## Future R8-RUN Scope

Allowed only after the exact approval phrase below:

- Run at most one app-driven DEBUG Filter Lab backend smoke request.
- Use one selected style reference image only as backend/provider image input.
- Keep the original/apply image local-only.
- Use existing backend retry behavior only; do not add manual retries.
- Accept either a validated cloud generated recipe or a sanitized fallback response.
- Stop after the first app endpoint response.

## Stop Conditions

Abort before the smoke if any of these are true:

- The approval phrase is missing or modified.
- Worktree contains unrelated runtime changes.
- Build is not DEBUG.
- Backend env is missing required safe config buckets.
- Any provider key, bearer token, Authorization header, raw request payload, raw provider response, image path, image bytes, or base64 content would be printed or persisted.
- iOS contains a direct provider URL/key/SDK/call.
- The app/backend payload includes the original/apply image.
- More than one app endpoint request would be required.
- Production rollout, production endpoint, `productionReady:true`, Camera AI, image editor provider, StoreKit/quota, or upload-payload expansion appears in scope.

## Exact Approval Phrase For Future Run

```text
批准 PT2-SF-R8-RUN：只跑一次 DEBUG Filter Lab provider-backed smoke；backend 只可接收一張 style reference image；apply image 必須留本機；使用 server-side SiliconFlow env；不打印或保存 API key、Authorization header、raw request、raw provider response、raw image/base64；不做 direct iOS provider call；不改 productionReady:false。
```

## Manual Verification Checklist For Future Run

- Confirm worktree status and upstream count before starting.
- Start the backend with ignored/server-side env only.
- Build/run DEBUG app on device.
- Select a target filter reference image and a separate original/apply image.
- Tap the DEBUG Filter Lab backend action.
- Accept consent.
- Confirm the app receives either a cloud generated recipe or a sanitized fallback.
- Confirm the original/apply image is only rendered locally.
- Confirm logs/UI do not reveal provider name details beyond approved debug state, keys, bearer tokens, raw payloads, raw provider text, image bytes, image path, or base64.
- Confirm Camera remains unchanged.
- Confirm `productionReady:false`.

## Recommended Next Step

If the operator wants to run the smoke, use `PT2-SF-R8-RUN - Approved Debug Filter Lab Provider-backed One-reference Smoke` with the exact approval phrase above. Otherwise, keep Filter Lab on the accepted two-image local/mock path and move later to PT3 image editor provider planning only when requested.
