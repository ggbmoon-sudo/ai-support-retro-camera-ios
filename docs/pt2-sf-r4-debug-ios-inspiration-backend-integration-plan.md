# PT2-SF-R4 Debug-only iOS Inspiration Backend Integration Plan

Status: completed planning-only
Date: 2026-06-21
Phase type: docs-only integration plan
Production readiness: `productionReady:false`

## Executive Summary

PT2-SF-R4 defines the first safe app-side path for using the accepted SiliconFlow backend QA evidence from PT2-SF-R2C and PT2-SF-R3.

The planned product surface is Inspiration selected-photo only:

- Photo Advisor: analyze one user-selected/imported photo and return a validated advisor result.
- Filter Lab: generate a validated structured filter recipe from one selected reference image.

This phase does not implement iOS runtime integration, backend endpoint changes, provider calls, upload payload changes, Camera AI, image editing, StoreKit/quota runtime, or production rollout. It only records the boundary and the recommended next implementation sequence.

## Current Evidence

Accepted backend evidence before this plan:

- PT2-SF-R2C accepted one backend-only synthetic Photo Advisor image QA call with `Qwen/Qwen3-VL-32B-Instruct`.
- PT2-SF-R3 accepted one backend-only synthetic Filter Lab structured recipe QA call with `Qwen/Qwen3-VL-32B-Instruct`.
- Both runs used server-side credentials only and printed no API key, raw prompt, raw request body, raw provider response, raw image/base64, or Authorization header.
- PT2-SF-R3 validates generated filter recipe JSON only. It does not approve generated bitmaps, shader code, LUT URLs, direct rendering instructions, final localized UI copy, image editing, iOS integration, or production rollout.

## Product Scope

Allowed future app surface for the next implementation phase:

- Inspiration selected-photo Photo Advisor.
- Inspiration / Filter Lab selected reference image.
- Debug/internal-only operator flow.
- Backend-mediated calls only.
- Existing local/mock behavior remains the default.

Blocked from PT2-SF follow-ups:

- Camera-page AI.
- Live Cloud AI / Live Advisor.
- Preview-frame upload.
- Auto-trigger upload.
- WSS runtime.
- Direct provider URL or provider key in iOS.
- Image editor / 改圖師 provider behavior.
- Generated image output.
- Production/default cloud rollout.

## iOS Boundary Plan

The next implementation should reuse the current app abstractions instead of adding provider-specific iOS code:

- Keep `CloudAIBackendMode.defaultMode` as mock/local.
- Add any real backend mode as DEBUG/internal gated only.
- Keep `PhotoAdvisorViewModel` fallback behavior so debug backend failure returns safe mock/local output or unavailable state.
- Add Filter Lab backend integration behind the same selected-photo/debug boundary, but keep `MockFilterGenerationService` as the default.
- Keep `CloudAIImageCompressor` or equivalent metadata-stripping compression before any debug upload.
- Keep provider names, model names, base URLs, and raw provider errors out of production UI.

iOS must not contain:

- `SILICONFLOW_API_KEY`.
- Provider API key aliases.
- `https://api.siliconflow.com`.
- OpenAI-compatible provider paths.
- Authorization bearer construction for provider calls.
- Raw provider request/response logging.

## Backend Boundary Plan

The app should call only the project backend boundary:

- Photo Advisor backend path remains the app-facing analysis boundary.
- Filter Lab backend path remains the app-facing generated recipe boundary.
- Backend validates request schema, consent, metadata stripping, content type, size, and supported filter IDs.
- Backend maps provider output into existing validated app-safe response contracts.
- Backend returns sanitized error buckets only.
- Backend never returns raw provider text, prompts, request payloads, image/base64, stack traces with provider text, or provider credentials.

Provider credentials remain server-side only:

- `SILICONFLOW_API_KEY` in ignored local env or future server secret manager.
- Provider base/model config in backend/server-controlled config only.
- No provider URL or key copied into iOS, localization strings, Xcode project settings, or committed config.

## Debug Gate Plan

The next runtime phase should require all of these gates before network execution:

- DEBUG build or internal backend environment.
- Explicit local/internal feature flag, for example `allowDebugInspirationBackendAI`.
- User-visible AI analysis consent accepted for that request.
- Single selected image, not background scanning.
- Quota or operator cap check before calling the backend.
- App Check/Auth boundary if using Firebase path.
- Timeout and cancel behavior.
- Safe fallback when backend is disabled, unavailable, rate-limited, quota-blocked, or validation rejects output.

Production/default behavior should remain:

- Photo Advisor mock/local.
- Filter Lab mock/local recipe generator.
- Camera local-only.
- `productionReady:false`.

## Request Shape Guardrails

Future debug runtime may send only a compressed selected-photo payload after consent:

- JPEG or approved compressed image data.
- Metadata stripped.
- Width/height/content type.
- Locale.
- Feature surface: `photo_advisor` or `filter_lab`.
- Mode: selected/imported/reference image.
- Optional selected filter ID from app whitelist.

Do not send:

- Raw EXIF dump.
- GPS/location.
- Continuous motion or sensor stream.
- Camera live frame stream.
- Background upload.
- Full-resolution original by default.
- Raw prompt, provider model choice, provider URL, or provider credential from iOS.

## Response Handling Plan

Photo Advisor response handling:

- Accept only validated backend `CloudAIResponse` / app-safe mapped result.
- App language pack owns final user-facing copy.
- Preserve Observation -> Mood -> Retro intent -> Optional action.
- Reject score/rating, harsh fix-it language, sensitive inference, provider/debug leakage, chain-of-thought leakage, unsupported filters, and imported-photo capture-context overclaim.

Filter Lab response handling:

- Accept only validated `GeneratedFilterRecipe`.
- Use app renderer to preview supported recipe parameters.
- Do not accept arbitrary Core Image filter names, shader/code, LUT URLs, generated bitmap URLs, or direct render instructions.
- Do not persist raw recipe/provider text.

## Manual Checklist for PT2-SF-R5

Before writing runtime code:

- Confirm worktree clean and upstream synced.
- Confirm no active Camera QA/regression task is being mixed into this phase.
- Re-read `CloudAIBackendMode`, `RemoteCloudAIService`, `PhotoAdvisorViewModel`, and `FilterLabViewModel`.
- Confirm backend README SiliconFlow config still points to server-side-only credentials.
- Decide whether R5 touches iOS only, backend only, or both; keep the commit small.

During implementation:

- Add or adjust tests for debug gate defaults.
- Add no-provider-leak scans.
- Add manual Xcode checklist for selected-photo debug flow.
- Keep provider calls disabled unless the user separately approves a bounded provider run.

Exit criteria:

- Default app runtime still mock/local.
- Debug/internal path exists only if explicitly enabled.
- No provider key/direct URL in iOS.
- No Camera cloud entry.
- No production rollout.
- `productionReady:false`.

## Recommended Next Phase

Recommended next phase:

- `PT2-SF-R5 - Debug-only iOS Inspiration Backend Integration Scaffold`

Suggested R5 scope:

- Implement the smallest debug-only app/backend scaffold for selected-photo Photo Advisor and/or Filter Lab.
- Keep production/default mock/local.
- Keep Camera local-only.
- Add tests or manual Xcode checklist.
- Do not run provider calls unless the user separately approves a bounded smoke.

Do not start image editor / 改圖師 provider work until Photo Advisor and Filter Lab debug integration are stable.

## Boundary Confirmations

- Docs-only phase: yes
- Swift runtime changed: no
- Xcode project changed: no
- Backend runtime changed: no
- Provider/model/cloud call: no
- API key read/printed/committed: no
- Image upload: no
- Upload payload changed: no
- Camera cloud AI entry: no
- Filter Lab generated bitmap/shader/LUT behavior: no
- Image editor provider behavior: no
- StoreKit/quota runtime: no
- Production rollout: no
- `productionReady:false`
