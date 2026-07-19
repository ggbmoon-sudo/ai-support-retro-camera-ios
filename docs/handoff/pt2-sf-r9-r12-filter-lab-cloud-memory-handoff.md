# PT2-SF-R9-R12 Filter Lab Cloud and Memory Handoff

Date prepared: 2026-07-19

Repository: `ai-support-retro-camera-ios`

Working directory: `C:\Users\lamch\OneDrive\桌面\aiko\APP\ai-support-retro-camera-ios`

Branch: `feat/phase-02-auth`

Production readiness: `productionReady:false`

This is a focused handoff for the current Filter Lab physical-device work. It is not approval to start another phase, commit or push, run another provider smoke, add credentials, expand upload payloads, or enable production Cloud AI.

## 1. Current Outcome

The DEBUG Filter Lab path has successfully reached the LAN backend, connected through the backend to SiliconFlow, and generated a Cloud filter recipe on a physical iPhone.

The remaining issue observed after generation was an iOS memory termination:

- Xcode domain: `IDEDebugSessionErrorDomain`
- Xcode code: `11`
- Process exit: code `9`
- Failure reason: terminated by the operating system due to excessive memory use
- Device model: `iPhone14,5`
- Device identifier: `00008110-00186D3A2138801E`
- Device OS observed: `27.0 (24A5370h)`
- Xcode observed: `26.5 (17F42)`
- Event timestamp: `2026-06-24T01:42:15+08:00`

PT2-SF-R9-R12 adds a bounded app-side memory fix. It has not yet been verified on the physical iPhone.

## 2. Git State at Handoff

- Branch: `feat/phase-02-auth`
- Upstream comparison: `0 0`
- Latest committed phase: `c47fe27 PT2-SF-R9-R11: clarify Filter Lab Cloud readiness diagnostics`
- R11 is committed and upstream-synced.
- R12 is implemented locally but not committed or pushed.

Expected dirty files for R12 only:

- `README.md`
- `docs/phase-log.md`
- `ios-app/AIPhotoApp/Features/Inspiration/FilterLab/FilterLabViewModel.swift`
- `ios-app/AIPhotoApp/Features/Inspiration/FilterLab/GeneratedFilterPreviewRenderer.swift`

Do not discard or overwrite these local changes. Inspect the worktree again before editing or staging because the operator may have changed it after this handoff was prepared.

## 3. What R11 Already Established

R11 fixed misleading Cloud readiness diagnostics and is already committed.

- Backend `GET /health` reports safe readiness buckets instead of hardcoded `mock-only`.
- DEBUG Filter Lab endpoint Test decodes `filterLabReady`.
- The last verified LAN backend URL was `http://192.168.68.60:8787`.
- The last verified safe health state was:
  - `providerMode: siliconflowInternal`
  - `internalCloudAIAllowed: true`
  - `filterLabReady: true`
  - `productionReady: false`
- Provider credentials remain server-side only.
- The health response exposes only safe readiness/provider-mode buckets. It does not expose provider credentials, provider endpoints, raw provider responses, raw requests, Authorization headers, API keys, or image/base64 content.

The backend process may need to be restarted after a computer restart. Do not assume PID or process state from the earlier session is still current.

## 4. R12 Memory Fix in the Dirty Worktree

The likely memory spike was caused by simultaneously retaining two full-resolution PhotosPicker images and rendering a full-resolution Core Image result.

### `FilterLabViewModel.swift`

- Imports `ImageIO`.
- Downsamples PhotosPicker image data before creating the long-lived `UIImage` stored by the view model.
- Uses `CGImageSourceCreateThumbnailAtIndex` with orientation transform.
- Caps imported images to a `1600` pixel long edge.
- Avoids eagerly decoding and retaining the original full-resolution image as the app-side Filter Lab working image.

### `GeneratedFilterPreviewRenderer.swift`

- Caps generated preview rendering to a `1600` pixel long edge.
- Uses `CIContext(options: [.cacheIntermediates: false])` for this preview path.
- Clears Core Image caches after each preview render.
- Uses scale `1` for bounded preview bitmap rendering.

The Cloud upload contract is unchanged. The existing Cloud compressor still creates the style/reference upload separately with its existing `1024` pixel long-edge boundary.

## 5. Required Next Action

Do not start a new feature phase yet. First perform one physical-device R12 verification in Xcode.

1. Confirm the Windows LAN backend is running and the iPhone and computer are on the same network.
2. In Filter Lab DEBUG endpoint panel, save `http://192.168.68.60:8787`.
3. Tap endpoint Test.
4. Confirm the endpoint reports Filter Lab Cloud ready.
5. Select exactly one style/reference image.
6. Select one separate apply/original image.
7. Accept the DEBUG Cloud upload consent.
8. Run Cloud Filter Lab once.
9. Confirm a Cloud recipe returns.
10. Confirm the before/after preview is generated locally from the apply/original image.
11. Keep the app open and adjust filter intensity several times.
12. Confirm Xcode does not report process exit code `9` or excessive-memory termination.

Success criteria:

- Cloud recipe generation succeeds.
- Before/after preview appears.
- Intensity changes complete without app termination.
- No repeated memory-pressure termination occurs during this bounded test.
- The original/apply image remains local-only.

## 6. If Memory Termination Persists

Stay in R12. Do not start the next product phase.

- Use Xcode Instruments Allocations or Memory Graph during one bounded reproduction.
- Record only sanitized observations such as total resident-memory trend, allocation category, retained object class, render count, and the point at which memory rises.
- Check whether repeated intensity changes create overlapping render tasks or retained `UIImage` / `CGImage` / Core Image objects.
- Check whether SwiftUI before/after views retain previous preview images after replacement.
- Consider lowering only the Filter Lab working/preview long edge from `1600` to `1280` after evidence from the profile.
- Do not commit screenshots, recordings, device logs containing user content, raw images, raw paths, provider output, request payloads, API keys, or Authorization headers.

Do not solve persistent memory pressure by uploading the apply/original image, moving local rendering to the provider, changing backend payloads, adding a direct iOS provider call, or weakening the privacy boundary.

## 7. Verification Already Completed

Before this handoff was prepared:

- `node --test backend/tests/cloud-ai-boundary.test.mjs` passed `70/70`.
- `git diff --check` reported only Windows CRLF conversion warnings and no whitespace errors.
- Added-line safety scans found no iOS provider URL, provider key, Authorization/Bearer header, or `productionReady:true` addition.
- LAN health was previously verified as `siliconflowInternal`, `filterLabReady:true`, and `productionReady:false`.

Xcode/Swift compilation and physical-device memory behavior cannot be verified from this Windows workspace. The operator's Mac/Xcode retry is still required.

## 8. Non-negotiable Boundaries

- iOS must not contain a SiliconFlow, Xiaoyi, QweAPI, Gemini, OpenAI, or equivalent provider credential.
- iOS must not call a provider endpoint directly.
- Provider calls remain backend-mediated only.
- Filter Lab backend receives exactly one style/reference image.
- Apply/original image remains local-only and is used for local before/after preview rendering.
- No Camera cloud AI entry.
- No capture-context upload.
- No raw prompt, raw request, raw provider response, raw image/base64, API key, or Authorization-header logging or persistence.
- No provider/debug/raw JSON exposure in production UI.
- No production rollout.
- `productionReady:false` remains locked.

## 9. Commit Guidance After Successful Device Verification

Do not commit until the operator confirms the R12 physical-device retry is stable.

Suggested commit message:

```text
PT2-SF-R9-R12: reduce Filter Lab physical-device memory pressure
```

Before committing, run:

```powershell
git status --short
git diff --check
node --test backend/tests/cloud-ai-boundary.test.mjs
git diff --name-only
```

Inspect that the commit contains only the intended R12 files plus this handoff if the operator wants the handoff committed. Commit and push only after explicit user instruction.

## 10. Suggested Work After R12

Only after R12 passes, close and commit the physical-device Cloud Filter Lab integration track. The next recommended planning step is a focused quality pass on Cloud-generated recipe fidelity against the style reference, because the operator previously observed that the generated look differed substantially from the reference image's existing visual parameters.

That future quality phase should begin with sanitized recipe/parameter comparison and UI-visible filter behavior. It must not add a real image-editing provider, generated bitmap output, apply-image upload, Camera Cloud AI, direct iOS provider integration, or production rollout without separate explicit approval.
