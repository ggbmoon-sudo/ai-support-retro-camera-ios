# Phase 13 Prompt: Expanded Filter Library - 20 Presets

Use this prompt in a new Codex session only when Phase 13 is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `221ea7d feat: add phase 12B filter preset catalog and batch 1`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters and mock AI advice

## Current State

Phase 12B is completed, manually verified, committed, pushed, and read-only confirmed.

The app currently has:

- Camera-first flow.
- Photo Picker fallback.
- Local Core Image filter pipeline.
- Data-driven local filter preset catalog.
- Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- Legacy starter filters:
  - Original
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Mock save success / failure.
- Mock AI analysis success / failure.
- Local session history.
- History and Settings tabs.

The app still does not include real Firebase, real AI, Cloud Functions calls, StoreKit, persistence, upload, export, save-to-Photos, secrets, or production config.

## Phase 13 Goal

Expand the local filter library to 20 research presets using MVP / Core Image approximation quality only.

Phase 13 should improve the local camera product feel by making the filter catalog broad enough for a real demo, while keeping all behavior local/mock.

Phase 13 must not build a high-fidelity film emulation engine. Do not add LUT asset loading, true grain overlays, light leaks, frame textures, Metal shaders, AI custom filters, premium gating, cloud sync, or real services.

## Phase 13 Should Do

1. Expand the filter catalog to 20 research presets.
2. Keep `Original` as the no-filter option.
3. Preserve the existing legacy starter filters:
   - Classic Film
   - Warm Vintage
   - Faded Chrome
4. Preserve the 6 Batch 1 hero filters:
   - Soft Warm 400
   - Summer Gold 200
   - Street Chrome
   - Soft Sun Portrait
   - Cinema Flat
   - Silver Gradation
5. Add 14 new research presets:
   - Everyday Color 400
   - Amber Night 800
   - Vivid Landscape 100
   - Slide Pop
   - Memory Negative
   - Amber Nostalgia
   - Tri Grit 400
   - Neon Tungsten 800
   - Instant Dream
   - Metro Pop
   - Diana Soft
   - Flash Party
   - CCD Party 2008
   - Editor Classic
6. Add filter category / grouping support if the current model is insufficient.
7. Update the filter picker UI so 20 filters do not become one hard-to-use horizontal row.
8. Keep every filter data-driven with:
   - stable id
   - localized display name
   - category / group
   - short summary
   - rendering parameters
9. Keep public UI filter names brand-safe.
10. Keep high-difficulty effects as MVP approximations only.
11. Ensure filter switching does not visibly freeze.
12. Keep camera-first flow, Photo Picker fallback, mock save, mock AI, local history, History, and Settings working.
13. Update:
   - `docs/phase-log.md`
   - `tests/manual-smoke-tests.md`
   - `README.md` if current phase/status or catalog summary needs update
   - `ios-app/README.md` if iOS filter implementation notes need update

## Phase 13 Must Not Do

- Do not start Phase 14.
- Do not add AI live guidance.
- Do not add AI custom filter generation.
- Do not add AI reference image analysis.
- Do not add AI image generation or editing.
- Do not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Do not connect real Firebase.
- Do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit in iOS.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Do not upload to Firebase Storage.
- Do not write to Firestore.
- Do not add persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not add npm dependencies.
- Do not add third-party SDKs.
- Do not modify backend code.
- Do not auto-commit.
- Do not auto-push.

## Read First

Run read-only checks:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -5
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
```

Read:

- `README.md`
- `AGENTS.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `docs/filter-research-popular-film-looks.md`
- `docs/filter-preset-schema.md`
- `docs/filter-roadmap.md`
- `docs/prompts/phase-12-filter-preset-schema-and-batch1.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is Phase 12B.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 13 has been explicitly requested.
- No unrelated local changes will be overwritten.

## Preset Inventory

The 20 research presets for Phase 13 are the 6 existing Batch 1 hero filters plus 14 new filters.

`Original` is a no-filter option and should not count as one of the 20 research presets.

Legacy starter filters should remain available or clearly mapped, but they are not part of the 20 research-presets count unless the implementation explicitly documents that mapping.

### Existing Batch 1 Presets To Preserve

| Display name | Stable id | Suggested group | Notes |
| --- | --- | --- | --- |
| Soft Warm 400 | `soft_warm_400` | Featured / Daily | Preserve current rendering intent. |
| Summer Gold 200 | `summer_gold_200` | Featured / Daily | Preserve current rendering intent. |
| Street Chrome | `street_chrome` | Featured / Street | Preserve current rendering intent. |
| Soft Sun Portrait | `soft_sun_portrait` | Featured / Portrait | Preserve current rendering intent. |
| Cinema Flat | `cinema_flat` | Featured / Cinema | Preserve current rendering intent. |
| Silver Gradation | `silver_gradation` | Featured / Black & White | Preserve current rendering intent. |

### New Phase 13 Presets To Add

| Display name | Stable id | Suggested group | MVP approximation intent |
| --- | --- | --- | --- |
| Everyday Color 400 | `everyday_color_400` | Daily | Balanced color negative look; useful default with moderate warmth and soft contrast. |
| Amber Night 800 | `amber_night_800` | Night | Warm low-light look; use contrast, warmth, vignette, and optional bloom/glow approximation only. |
| Vivid Landscape 100 | `vivid_landscape_100` | Daily / Street | Crisp daylight color with stronger saturation, clearer greens/blues, and moderate contrast. |
| Slide Pop | `slide_pop` | Street | High contrast, vivid color, clean shadows; LUT-like accuracy deferred. |
| Memory Negative | `memory_negative` | Daily | Soft nostalgic negative look with lifted shadows, lower contrast, and gentle warmth. |
| Amber Nostalgia | `amber_nostalgia` | Experimental / Camera Looks | Warm faded archive/compact-camera mood; use temperature, fade curve, vignette. |
| Tri Grit 400 | `tri_grit_400` | Black & White | Punchier monochrome street look; no true grain asset. |
| Neon Tungsten 800 | `neon_tungsten_800` | Night | Night color cast with cool shadows and warm highlights; halation deferred. |
| Instant Dream | `instant_dream` | Experimental / Camera Looks | Pastel instant-photo approximation; no frame, dust, or print texture. |
| Metro Pop | `metro_pop` | Street | Urban pop color, higher contrast, stronger saturation, sharpness. |
| Diana Soft | `diana_soft` | Experimental / Camera Looks | Soft toy-camera approximation; use lower sharpness/clarity feel, fade, vignette. |
| Flash Party | `flash_party` | Experimental / Camera Looks | Direct-flash party approximation; use contrast, warmth, vignette, sharpness. |
| CCD Party 2008 | `ccd_party_2008` | Experimental / Camera Looks | Early compact digital / CCD mood; use high contrast, saturation, sharpness, vignette. |
| Editor Classic | `editor_classic` | Cinema | Clean editorial grade; muted color, controlled highlights, practical for many images. |

## Suggested Category / Grouping Model

Use the existing code style and avoid overbuilding. The filter picker should remain easy to scan on small iPhone screens.

Suggested groups:

- Featured
- Portrait
- Daily
- Street
- Cinema
- Black & White
- Night
- Experimental / Camera Looks

Implementation options:

- Add a display group field to `FilterPreset` if needed.
- Add a `FilterPresetGroup` enum if it keeps code clear.
- Keep `FilterPresetCategory` if it already satisfies grouping, but ensure UI grouping is user-friendly.
- Use localized group titles.

UI guidance:

- Do not show all 20 filters as one single long horizontal row.
- Prefer category tabs / chips plus a grid or grouped sections.
- Keep touch targets large enough for iPhone.
- Keep selected state obvious.
- Keep filter descriptions short.
- Keep the picker usable from both camera capture preselect and selected-photo preview.
- Do not add marketing copy, brand references, or instructions inside the app.

## Rendering Guidance

Use only Core Image and the existing local pipeline.

Allowed approximation tools:

- exposure
- temperature / tint
- color controls
- highlight / shadow adjustment if already available
- tone curve
- vignette
- sharpen / soften where supported by the current pipeline
- simple bloom / glow approximation only if it can be done with built-in Core Image and without assets/dependencies

Deferred:

- true LUT asset engine
- licensed LUT assets
- true grain overlays
- light leak overlays
- dust, scratches, frame, instant-print borders
- accurate halation pass
- Metal or custom shader
- camera-specific lens simulation
- AI-generated filter recipes

Approximation notes:

- Halation can be approximated with subtle bloom/glow only if the existing pipeline can support it safely.
- Instant / Diana / CCD / disposable looks can be approximated with color, contrast, vignette, sharpness/softness, and fade.
- If a research parameter cannot be represented by the current pipeline, use the smallest viable Core Image approximation and record the TODO in docs.

## Suggested Changed Files

Likely Swift files:

- `ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`

Likely localization:

- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Likely docs:

- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `README.md` if current phase/status or catalog summary needs update
- `ios-app/README.md` if iOS filter implementation notes need update

Do not modify backend files.

Do not modify Firebase config files.

Do not add assets unless explicitly approved by the user.

## Build / Verification Commands

Run before finishing:

```bash
git status --short
git diff --check
```

Forbidden imports scan:

```bash
rg -n "^\s*import\s+(Firebase|FirebaseFunctions|FirebaseStorage|FirebaseFirestore|Gemini|OpenAI|StoreKit)\b" ios-app/AIPhotoApp -g '*.swift'
```

Secrets / config scan:

```bash
find . -name GoogleService-Info.plist -o -name .env -o -name .firebaserc -o -name '*.p8' -o -name '*.mobileprovision'
rg -n "(AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----)" . -g '!**/.git/**'
```

Forbidden behavior scan:

```bash
rg -n "(FirebaseApp|FirebaseStorage|Storage\.storage|Firestore|Firestore\.firestore|Functions\.functions|URLSession|Gemini|OpenAI|StoreKit|UserDefaults|CoreData|SwiftData|modelContainer|performChanges|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\.shared|quota|paywall|subscription)" ios-app/AIPhotoApp -g '*.swift'
```

Brand-name UI scan:

```bash
rg -n "Kodak|Fujifilm|Leica|Polaroid|CineStill" ios-app/AIPhotoApp/Features ios-app/AIPhotoApp/Resources -g '*.swift' -g '*.strings'
```

Xcode build if local environment allows it:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase13-derived CODE_SIGNING_ALLOWED=NO build
```

If the sandboxed CLI build fails due CoreSimulator or `sandbox-exec`, report that clearly and ask the user to verify in Xcode / Simulator. If an unsandboxed build is available and approved, rerun it.

## Acceptance Criteria

- App builds in Xcode or command-line build if the environment allows it.
- Filter UI exposes the 20 research presets.
- Existing `Original` remains available as no-filter.
- Existing `Classic Film`, `Warm Vintage`, and `Faded Chrome` remain available or clearly mapped.
- Batch 1 hero filters remain available and keep their stable IDs.
- The 14 new Phase 13 filters are available.
- The 14 new filters can be selected and show acceptable visual differences.
- Filter category / grouping UI is usable and avoids one long horizontal row.
- Camera-first flow remains intact.
- Photo Picker fallback remains intact.
- Mock save success / failure remains intact.
- Mock AI analysis success / failure remains intact.
- Local session history remains intact.
- History and Settings remain intact.
- No public UI filter name uses Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar brand names.
- No real Firebase, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, save-to-Photos, secrets, forbidden imports, new dependencies, third-party SDKs, or backend changes are added.

## Manual Test Steps

1. Launch the app in Simulator.
2. Confirm Camera-first flow still opens correctly.
3. Use Photo Picker fallback to import one image.
4. Open the filter picker from the camera / selected-photo flow.
5. Confirm the filter picker is grouped and not a single hard-to-use horizontal list.
6. Confirm `Original` is available and shows the unfiltered image.
7. Confirm legacy starter filters are available or clearly mapped:
   - Classic Film
   - Warm Vintage
   - Faded Chrome
8. Confirm Batch 1 filters remain available:
   - Soft Warm 400
   - Summer Gold 200
   - Street Chrome
   - Soft Sun Portrait
   - Cinema Flat
   - Silver Gradation
9. Confirm new Phase 13 filters are available:
   - Everyday Color 400
   - Amber Night 800
   - Vivid Landscape 100
   - Slide Pop
   - Memory Negative
   - Amber Nostalgia
   - Tri Grit 400
   - Neon Tungsten 800
   - Instant Dream
   - Metro Pop
   - Diana Soft
   - Flash Party
   - CCD Party 2008
   - Editor Classic
10. Switch through several filters quickly and confirm the app does not freeze.
11. Trigger mock save success and failure.
12. Trigger mock AI success and failure.
13. Confirm local session history records the selected filter ID.
14. Open History and Settings.
15. Confirm no raw localization keys appear in the tested flow.
16. Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

## Documentation Updates

Update `docs/phase-log.md` with:

- Phase 13 status.
- Summary.
- 20-preset catalog list.
- Filter grouping implementation.
- Changed files.
- Build / verification result.
- Manual test steps.
- Known TODOs.
- Safety notes.
- Whether Phase 14 is ready. It should remain no until Phase 13 is reviewed, committed, pushed, and explicitly approved.

Update `tests/manual-smoke-tests.md` with:

- Phase 13 checklist.
- 20-preset availability checks.
- Grouping UI checks.
- Mock MVP regression checks.
- Forbidden service / secrets checks.

Known TODOs to record:

- Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- LUTs, true grain overlays, halation, light leaks, dust, frames, CCD/instant camera asset treatments, and Metal/custom shader work remain future phases.
- AI custom filters and reference-image filter generation remain future phases.
- Premium gating remains future monetization work only.

## Completion Response

When finished, reply with:

- changed files
- summary
- 20-preset catalog list
- filter grouping / picker UI summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 14: no, until Phase 13 commit/push/read-only confirmation completed

Do not commit.

Do not push.
