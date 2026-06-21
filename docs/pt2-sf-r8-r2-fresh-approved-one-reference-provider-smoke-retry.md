# PT2-SF-R8-R2 - Fresh Approved One-reference Provider Smoke Retry

Status: completed
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R8-R2 ran the fresh-approved DEBUG Filter Lab backend smoke once after PT2-SF-R8-R1 corrected the ignored server-side debug env gate.

The smoke used the existing backend app endpoint only. It sent one style reference image to `/v1/ai/filter-lab`, sent no apply/original image, used server-side SiliconFlow env, returned a cloud generated filter recipe, and stopped after the first endpoint response.

No Swift, Xcode project, backend runtime code, provider credentials, production rollout, Camera AI, image editor provider, StoreKit/quota behavior, or upload payload expansion was added.

## Fresh Approval Basis

The operator continued to the next step after the R8-R1 closeout with "可以下一步". This was treated as fresh approval for the next recorded phase, `PT2-SF-R8-R2`, under the already documented one-request DEBUG/backend-mediated boundaries.

## Preflight

- Branch: `feat/phase-02-auth`
- Worktree before run: clean
- Upstream count before run: `0 0`
- `backend/.env.local`: present and ignored
- `CLOUD_AI_PROVIDER_MODE`: `siliconflowInternal`
- `ALLOW_INTERNAL_CLOUD_AI`: `true`
- Internal debug token configured: `false`
- SiliconFlow API key bucket present: `true`
- SiliconFlow base URL bucket configured: `true`
- SiliconFlow chat completions path bucket configured: `true`
- SiliconFlow Filter Lab model bucket configured: `true`
- Filter Lab gate with `X-Internal-Debug-CloudAI: true`: `siliconflowInternal`
- Network call made during preflight: `false`
- App endpoint request made during preflight: `false`
- Provider/model call made during preflight: `false`
- Secret values printed: `false`

## Sanitized Smoke Result

- Backend listener: temporary local debug listener on `127.0.0.1:8789`
- App endpoint: `/v1/ai/filter-lab`
- App endpoint requests: `1`
- Manual retry count: `0`
- Style reference images sent: `1`
- Apply/original images sent: `0`
- HTTP status bucket: `2xx`
- Response source: `cloud`
- Generated filter present: `true`
- Fallback error code: `null`
- Latency bucket: `15s_to_30s`
- Provider/model call likely reached: `true`
- Provider image upload likely attempted: `true`
- Client fetch error bucket: `null`
- Request body printed: `false`
- Response body printed: `false`
- Authorization header printed: `false`
- Raw provider response printed: `false`
- Raw smoke image/base64 printed: `false`
- Secret values printed: `false`
- `productionReady:false`

## Operational Note

The backend direct-run guard did not keep the server alive from this Windows path, so the smoke started the existing `createServer()` export directly from a temporary Node process. No tracked backend runtime code was changed.

One pre-smoke source-inspection command displayed an existing committed tiny synthetic JPEG constant from a test helper. The R8-R2 smoke itself did not print the request image/base64, request body, raw provider response, raw app endpoint response body, API key, bearer token, or Authorization header.

## Changed Files

- `README.md`
- `ios-app/README.md`
- `docs/pt2-sf-r8-r2-fresh-approved-one-reference-provider-smoke-retry.md`
- `docs/phase-roadmap-sequencing-and-next-action-register.md`
- `docs/phase-log.md`

## Tests and Checks

- Branch/status/upstream preflight
- No-network env bucket preflight
- One DEBUG backend app endpoint smoke request
- Temporary backend listener stopped after the one response
- `git diff --check`
- Safety scans for Swift/Xcode/backend runtime drift, provider credential leakage, raw request/provider/image/base64 leakage, direct iOS provider calls, upload payload expansion, model artifacts, and `productionReady:true`

## Boundary Confirmations

- Swift runtime changed: no
- Xcode project changed: no
- Backend runtime code changed: no
- Backend payload expanded: no
- Backend received apply/original image: no
- App endpoint request count: one
- Provider/model call run: yes, through backend only
- Provider image upload attempted: yes, one style reference image only
- API key value printed/saved/committed: no
- Authorization header printed/committed: no
- Raw request payload printed/committed: no
- Raw provider response printed/committed: no
- Raw smoke image/base64 printed/committed: no
- Direct iOS provider call: no
- Direct provider URL/key in iOS: no
- Provider SDK in iOS: no
- Camera cloud AI entry: no
- Image editor provider behavior: no
- StoreKit/quota runtime: no
- Production rollout: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Xcode runtime behavior should be unchanged by this docs/report closeout. No Swift or Xcode project files changed.

The recommended next device check is a separate `PT2-SF-R9` phase: run a physical-device DEBUG Filter Lab end-to-end smoke where the iPhone reaches the local/LAN backend, receives a cloud generated recipe, and applies it locally to the separate apply/original image. That phase should explicitly confirm the phone networking setup without putting provider keys, provider URLs, or direct provider calls in iOS.

## Ready for Next Phase

Recommended next step is `PT2-SF-R9 - Physical-device DEBUG Filter Lab Backend E2E Smoke`.

Purpose:

- Verify the accepted backend cloud recipe path from the real iOS DEBUG Filter Lab UI.
- Use a local/LAN backend URL that the phone can reach, similar to the operator's other-project server workaround.
- Keep provider credentials server-side only.
- Upload only the style reference image.
- Keep the apply/original image local-only.
- Confirm UI fallback behavior if the backend is unreachable.
- Keep Camera AI, image editor provider, StoreKit/quota, and production rollout out of scope.

`PT3 - Image Editor Provider Contract` should remain separate until Filter Lab's device debug path is stable.
