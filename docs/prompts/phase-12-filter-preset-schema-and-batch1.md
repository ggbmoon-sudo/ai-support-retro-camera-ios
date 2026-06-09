# Phase 12B Prompt: Filter Preset Schema And Batch 1

Use this prompt in a new Codex session when Phase 12B is explicitly requested.

Do not execute this prompt during Phase 12A.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters and mock AI advice

## Phase 12B Goal

Build the first implementation step for the expanded filter system:

- Create an app-level Swift filter preset model if the current model is not sufficient.
- Create or refactor toward a data-driven local filter catalog.
- Implement the first 6 hero filters only:
  1. Soft Warm 400
  2. Summer Gold 200
  3. Street Chrome
  4. Soft Sun Portrait
  5. Cinema Flat
  6. Silver Gradation
- Preserve existing four filters or map them into the new catalog:
  - Original
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Keep the existing mock MVP flow working:
  - Camera / Photo Picker
  - Filter
  - Mock Save
  - Mock AI Advice
  - Local Session History
  - History
  - Settings
- Keep all behavior local/mock only.

## Do Not Do

- Do not start Phase 13.
- Do not implement all 20 proposed filters.
- Do not add expanded filter monetization.
- Do not add premium gating.
- Do not add StoreKit, subscription, paywall, or quota enforcement.
- Do not add AI custom filter generation.
- Do not add real AI.
- Do not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Do not add real Firebase integration.
- Do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, OAuth secrets, or Apple credentials.
- Do not upload to Firebase Storage.
- Do not write to Firestore.
- Do not add disk persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not add npm dependencies or third-party SDKs.
- Do not modify backend code unless a build-breaking shared contract issue is discovered and explicitly approved.
- Do not auto-commit or push.

## Read First

Run read-only checks:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -5
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
```

Read:

- `README.md`
- `AGENTS.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `docs/product-roadmap-next.md`
- `docs/feature-change-requests.md`
- `docs/filter-research-popular-film-looks.md`
- `docs/filter-preset-schema.md`
- `docs/filter-roadmap.md`
- `docs/prompts/phase-04-filters.md`

Inspect current filter implementation:

- `ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

## Implementation Guidance

Prefer the existing SwiftUI and Core Image patterns.

Keep the implementation small and local:

- A preset should have a stable ID, display name, category, short summary, and rendering parameters.
- The catalog should be easy to extend but should not over-abstract the MVP.
- Use public display names from the Phase 12A docs.
- Do not show internal brand/stock inspiration in the UI.
- Keep `is_premium` as data only if useful, but do not gate behavior.
- Keep filters deterministic and in memory.
- Avoid adding assets unless strictly necessary. Batch 1 should be Core Image only.
- Use simple approximations for grain/glow only if they already fit the existing pipeline without new assets or dependencies.

Suggested Batch 1 rendering intent:

- `Soft Warm 400`: warm, soft contrast, slight fade.
- `Summer Gold 200`: golden daylight, bright color, mild warmth.
- `Street Chrome`: stronger contrast, cooler shadows, crisp color separation.
- `Soft Sun Portrait`: warm portrait tone, lifted shadows, gentle clarity.
- `Cinema Flat`: muted saturation, protected highlights, editorial contrast.
- `Silver Gradation`: black and white, smooth contrast, restrained grain/fade.

## Suggested Changed Files

Likely Swift files:

- `ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift`

Likely docs:

- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `README.md` if current phase/status needs update
- `ios-app/README.md` if filter implementation notes need update

Do not modify backend files.

## Acceptance Criteria

- App still builds in Xcode or command-line build if the local environment allows it.
- Camera-first app flow remains intact.
- Photo Picker fallback still works in Simulator.
- Existing four filter choices are preserved or clearly mapped.
- The 6 Batch 1 hero filters are available from the filter UI.
- Mock save success/failure still works.
- Mock AI analysis success/failure still works.
- Local session history still works.
- History and Settings tabs still exist.
- No real Firebase, AI, Cloud Functions, StoreKit, persistence, export, secrets, or new dependencies are added.

## Manual Test Steps

1. Launch the app in Simulator.
2. Confirm the app opens to the camera-first shell.
3. Use Photo Picker fallback to import one image.
4. Open filter selection.
5. Confirm existing filters are preserved or mapped.
6. Apply each Batch 1 hero filter:
   - Soft Warm 400
   - Summer Gold 200
   - Street Chrome
   - Soft Sun Portrait
   - Cinema Flat
   - Silver Gradation
7. Continue to mock save.
8. Verify mock save success.
9. Trigger mock AI analysis.
10. Verify mock AI result UI.
11. Verify the item appears in local session history.
12. Visit History and Settings.
13. Confirm no real upload, real AI call, StoreKit, persistence, export, or secret/config file was added.

## Completion Response

When finished, reply with:

- changed files
- summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no

Do not commit.

Do not push.
