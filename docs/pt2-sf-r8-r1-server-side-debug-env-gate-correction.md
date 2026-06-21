# PT2-SF-R8-R1 - Server-side Debug Env Gate Correction

Status: implemented, no provider smoke rerun
Date: 2026-06-22
Production readiness: `productionReady:false`

## Summary

PT2-SF-R8-R1 corrects the local ignored backend debug env gate after PT2-SF-R8-RUN returned the sanitized fallback `internal_cloud_disabled`.

Only non-secret gate keys were changed in the ignored local `backend/.env.local` file. No provider credential value was printed, saved into tracked files, or committed.

The follow-up no-network gate check now resolves Filter Lab with the existing debug header to `siliconflowInternal`. This phase does not start a backend server, does not call `/v1/ai/filter-lab`, and does not make a provider/model call. A second provider-backed smoke still requires fresh explicit approval.

## Local Ignored Env Gate Change

Updated ignored local env keys only:

- `CLOUD_AI_PROVIDER_MODE` now resolves to `siliconflowInternal`
- `ALLOW_INTERNAL_CLOUD_AI` now resolves to `true`

The SiliconFlow API key/base URL/path/model buckets were checked only as present/configured buckets. Secret values were not printed.

## Sanitized No-network Gate Check

- Network call made: `false`
- App endpoint request made: `false`
- Provider/model call made: `false`
- Internal debug token configured: `false`
- SiliconFlow API key bucket present: `true`
- SiliconFlow base URL bucket configured: `true`
- SiliconFlow chat completions path bucket configured: `true`
- SiliconFlow Filter Lab model bucket configured: `true`
- Filter Lab gate with `X-Internal-Debug-CloudAI: true`: `siliconflowInternal`
- Secret values printed: `false`
- `productionReady:false`

## Boundary Confirmations

- Swift runtime changed: no
- Xcode project changed: no
- Backend runtime changed: no
- Tracked backend code changed: no
- Ignored local env changed: yes, non-secret gate keys only
- App endpoint request run: no
- Provider/model call run: no
- API key value printed/saved/committed: no
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

Recommended next phase is `PT2-SF-R8-R2 - Fresh Approved One-reference Provider Smoke Retry`.

That phase should require a fresh explicit approval phrase because the original R8-RUN already consumed its one allowed app endpoint request. The retry should still be one DEBUG backend endpoint request only, one style reference image only, no apply/original image upload, no direct iOS provider call, no raw logging, and `productionReady:false`.
