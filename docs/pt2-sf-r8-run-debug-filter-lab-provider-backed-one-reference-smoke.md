# PT2-SF-R8-RUN - Debug Filter Lab Provider-backed One-reference Smoke

Status: completed with sanitized fallback before provider execution
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R8-RUN ran the explicitly approved DEBUG Filter Lab backend smoke exactly once through the app backend boundary at `/v1/ai/filter-lab`.

The request used one in-memory synthetic JPEG as the style reference image. No apply/original image was sent. The apply image remains a local-only app concern under the PT2-SF-R7 two-image flow.

The backend returned a `2xx` sanitized fallback with `internal_cloud_disabled`. A no-network config bucket check after the run showed the SiliconFlow credential/model/base URL/path buckets were present, but the debug provider gate was closed because `CLOUD_AI_PROVIDER_MODE` resolved to `mock` and `ALLOW_INTERNAL_CLOUD_AI` resolved to `false`. Because the R8-RUN scope allowed only one app endpoint request, the smoke was not rerun.

## Sanitized Result

- App endpoint requests: `1`
- Backend path: `/v1/ai/filter-lab`
- Style reference images sent: `1`
- Apply/original images sent: `0`
- HTTP status bucket: `2xx`
- Response source: `fallback`
- Generated filter present: `false`
- Fallback error code: `internal_cloud_disabled`
- Latency bucket: `lt_1s`
- Provider/model call reached: `no`
- Image upload attempted by provider: `no`
- `productionReady:false`

## Completed Work

- Confirmed branch `feat/phase-02-auth`, clean worktree, and upstream count `0 0` before the run.
- Confirmed `backend/.env.local` exists by filename only.
- Started the existing backend app boundary on `127.0.0.1:8789` using ignored server-side env.
- Sent exactly one sanitized DEBUG Filter Lab backend request with the existing internal debug header.
- Generated the style reference JPEG in memory only.
- Printed only bucketed/sanitized smoke output.
- Ran a no-network config bucket diagnosis after the single request.
- Stopped the temporary backend listener.

## Boundary Confirmations

- Swift runtime changed: no
- Xcode project changed: no
- Backend runtime changed: no
- Backend payload expanded: no
- App endpoint request count: one
- Provider/model call run: no, blocked by backend debug env gate
- API key printed/saved/committed: no
- Authorization header printed/saved/committed: no
- Raw request payload printed/saved/committed: no
- Raw provider response printed/saved/committed: no
- Raw image/base64 printed/saved/committed: no
- Direct iOS provider call: no
- Direct provider URL/key in iOS: no
- Provider SDK in iOS: no
- Apply/original image uploaded: no
- Camera cloud AI entry: no
- Image editor provider behavior: no
- StoreKit/quota runtime: no
- Production rollout: no
- `productionReady:false` remains locked.

## Next Recommendation

Recommended next phase is `PT2-SF-R8-R1 - Server-side Debug Env Gate Correction and One-reference Smoke Retry Approval`.

That phase should first fix only the ignored server-side env/config gate outside git:

- `CLOUD_AI_PROVIDER_MODE=siliconflowInternal`
- `ALLOW_INTERNAL_CLOUD_AI=true`
- Keep the existing SiliconFlow API key/base URL/path/model values server-side only.
- If `INTERNAL_CLOUD_AI_DEBUG_TOKEN` is introduced later, the debug client/request must send the matching token header; otherwise leave it unset for the current `X-Internal-Debug-CloudAI: true` path.

After the env gate is corrected, a second provider-backed smoke should require a fresh explicit approval because the approved R8-RUN endpoint request has already been consumed.
