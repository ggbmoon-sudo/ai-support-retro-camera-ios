# Phase Log

This file records the progress of each development phase.

Every Codex task must update this file before finishing.

---

## Current Status

Current phase: Phase 13 - Expanded Filter Library - 20 Presets
Status: Phase 13 manually verified by user in Xcode / Simulator and temporarily accepted; ready to commit after review
Mac/Xcode verification: Phase 01/02 build succeeded on 2026-06-09
Phase 03 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 04 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 05 build verification: command-line Xcode simulator build succeeded on 2026-06-09
Phase 06 build verification: attempted by Codex; sandboxed command-line builds failed due existing SwiftUI `#Preview` macro / CoreSimulator sandbox environment, not Phase 06 source errors; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 08 build verification: command-line Xcode simulator build succeeded on 2026-06-09 after the History tab environment object fix; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 09 build verification: user Xcode / Simulator build-run accepted on 2026-06-09
Phase 11 build verification: attempted by Codex; generic iOS Simulator build reached Swift compilation but failed due sandbox-exec / CoreSimulator environment restrictions, not a confirmed Phase 11 source error; user Xcode / Simulator run accepted on 2026-06-09
Phase 11B build verification: attempted by Codex; generic iOS Simulator build reached Swift compilation but failed due existing SwiftUI `#Preview` macro / CoreSimulator tooling issues, not a confirmed Phase 11B source error; user Xcode / Simulator run accepted on 2026-06-09
Phase 12B build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox-exec environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-09; user Xcode / Simulator build-run accepted on 2026-06-09
Phase 13 build verification: sandboxed command-line Xcode build failed due CoreSimulator / sandbox environment restrictions; unsandboxed command-line simulator build succeeded on 2026-06-09; user Xcode / Simulator build-run accepted on 2026-06-09
Next phase: Phase 14 should not start until Phase 13 is reviewed, committed, pushed, and explicitly requested

---

## Phase 13 - Expanded Filter Library - 20 Presets

Status: Manually verified by user in Xcode / Simulator and temporarily accepted; ready to commit after review
Date completed: 2026-06-09

### Goal

Expand the local filter library to 20 research presets using MVP / Core Image approximation quality only, without starting Phase 14 or adding real services.

### Summary

Phase 13 expands the local filter catalog from the Phase 12B Batch 1 set to 20 research presets. The filter picker now uses filter group chips and a grouped preset grid instead of a single long horizontal row.

Original remains the no-filter option and is not counted as one of the 20 research presets. Classic Film, Warm Vintage, and Faded Chrome remain available as legacy starter filters.

### 20-Preset Catalog

- Soft Warm 400
- Summer Gold 200
- Street Chrome
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation
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

### Filter Grouping

Filter picker groups:

- Featured
- Portrait
- Daily
- Street
- Cinema
- Black & White
- Night
- Camera Looks
- Starter

### Completed

- Added `FilterPresetGroup` and localized group titles.
- Added group metadata to `FilterPreset`.
- Added 14 new research presets.
- Preserved the 6 Phase 12B Batch 1 hero filters.
- Preserved Original as no-filter.
- Preserved Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- Added a Core Image bloom adjustment for subtle night / instant / soft-camera MVP approximations.
- Replaced the single horizontal preset list with grouped chips and a preset grid.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / manual smoke tests.
- Kept Camera-first flow, Photo Picker fallback, mock save, mock AI, local session history, History, and Settings in scope.

### Changed Files

- README.md
- ios-app/README.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `git diff --check` passed.
- Forbidden imports scan found no Firebase / Gemini / OpenAI / StoreKit imports in iOS source.
- Secrets / config scan found no `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, or Apple credentials.
- Forbidden behavior scan found no Phase 13 additions for real upload, Firestore write, Storage write, Cloud Functions calls, real AI calls, StoreKit, quota, persistence, export, or save-to-Photos behavior. Existing mock/future placeholder references remain documented from earlier phases.
- Brand-name UI scan found no Kodak, Fujifilm, Leica, Polaroid, CineStill, or similar protected brand names in public filter UI source.
- Sandboxed CLI `xcodebuild` failed due to CoreSimulator/sandbox environment. Unsandboxed `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase13-derived CODE_SIGNING_ALLOWED=NO build` completed with `BUILD SUCCEEDED`.
- User manually verified Phase 13 in Xcode / Simulator and temporarily accepted the current result on 2026-06-09.
- User confirmed app build/run, camera-first flow, Photo Picker fallback, filter picker/grouping, all 20 research presets, Original no-filter behavior, legacy starter filters, Batch 1 filters, mock save, mock AI, local session history, History, and Settings are acceptable for Phase 13.
- User confirmed no real Firebase / AI / Cloud Functions / StoreKit / persistence / upload / export / save-to-Photos behavior and no secrets / Firebase config / API keys were added.

### Known TODOs

- Phase 13 filters are Core Image MVP approximations, not final realistic film simulation.
- Phase 13B can be opened later to adjust individual filter parameters, ordering, grouping, picker UI, or visual differences.
- True grain overlays, LUT assets, light leaks, dust, frames, accurate halation, Metal/custom shader work, and camera-specific optical simulation remain future phases.
- Instant Dream, Diana Soft, CCD Party 2008, Flash Party, and other camera looks are color / contrast / vignette / bloom approximations only.
- CCD / instant camera asset treatment remains future phase work.
- AI custom filters, reference-image-to-filter, and AI image generation remain future phases.
- Premium gating remains future monetization work only.
- Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.

### Safety Notes

- Did not start Phase 14.
- Did not add AI live guidance.
- Did not add AI custom filter generation.
- Did not add AI reference image analysis.
- Did not add AI image generation or editing.
- Did not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Did not add upload, Firestore write, Storage write, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, StoreKit, subscription, paywall, premium gating, quota enforcement, npm dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to commit Phase 13: Yes, after final status and scan checks are reviewed.

Ready for Phase 14: No. Phase 13 should be committed, pushed, and read-only confirmed before Phase 14 starts.

---

## Phase 12B - Filter Preset Schema And Batch 1

Status: Manually verified by user; ready to commit after review
Date completed: 2026-06-09

### Goal

Implement the first small local filter catalog expansion from the Phase 12A planning docs without starting Phase 13.

### Summary

Phase 12B extends the local filter preset model with app-level catalog metadata and implements the first 6 Batch 1 hero filters using only Core Image operations in the existing local pipeline.

The current catalog now presents:

- Original
- Soft Warm 400
- Summer Gold 200
- Street Chrome
- Soft Sun Portrait
- Cinema Flat
- Silver Gradation
- Classic Film
- Warm Vintage
- Faded Chrome

Original remains unfiltered. The existing Classic Film, Warm Vintage, and Faded Chrome presets remain available as legacy starter filters with their existing IDs and localized names.

### Completed

- Added local preset metadata for category, implementation priority, MVP flag, and premium placeholder flag.
- Added a local `FilterPresetCategory` enum.
- Added a Core Image highlight/shadow adjustment step to the existing filter pipeline.
- Added 6 Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- Kept Original as the no-filter preset.
- Kept Classic Film, Warm Vintage, and Faded Chrome as legacy starter filters.
- Updated English and Traditional Chinese localization strings.
- Updated filter planning docs to record the Phase 12B Core Image approximation boundary.
- Updated manual smoke tests for the Phase 12B flow.
- Kept Camera-first flow, Photo Picker fallback, mock save, mock AI, local session history, History, and Settings in scope.

### Changed Files

- README.md
- ios-app/README.md
- docs/filter-preset-schema.md
- docs/filter-roadmap.md
- docs/filter-research-popular-film-looks.md
- docs/prompts/phase-12-filter-preset-schema-and-batch1.md
- docs/phase-log.md
- tests/manual-smoke-tests.md
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings

### Build / Verification

- `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase12b-derived CODE_SIGNING_ALLOWED=NO build`
  - Sandboxed attempt failed due CoreSimulator / `sandbox-exec` environment restrictions.
  - Unsandboxed retry succeeded on 2026-06-09.
- User manually verified Phase 12B in Xcode / Simulator on 2026-06-09 and accepted the current result:
  - App can build / run.
  - Camera-first flow remains normal.
  - Photo Picker fallback works.
  - Filter selection opens.
  - Original, Classic Film, Warm Vintage, and Faded Chrome remain preserved or clearly mapped.
  - Soft Warm 400, Summer Gold 200, Street Chrome, Soft Sun Portrait, Cinema Flat, and Silver Gradation are available.
  - The 6 new filters have acceptable visual differences.
  - Mock save success / failure works.
  - Mock AI analysis success / failure works.
  - Local session history works.
  - History and Settings remain normal.
  - No real Firebase, AI, Cloud Functions, StoreKit, persistence, upload, export, or save-to-Photos behavior was observed.
  - No secrets, Firebase config, or API keys were added.
- `git diff --check` passed.
- Forbidden import scan passed for iOS source.
- Secrets / config scan passed.
- Forbidden behavior scan passed for Phase 12B scope.

### Known TODOs

- Phase 12B uses Core Image approximations only. It does not implement HSL-specific tuning, vibrance, true fade controls, grain, LUTs, bloom, glow, halation, Metal, or custom shader passes.
- Phase 12B is not the final realistic film emulation engine.
- Phase 13 or later should handle expansion to 12 filters and then 20 filters.
- LUT, grain overlay, halation, light leak, CCD-style looks, and instant camera looks should remain for later phases.
- Street Chrome is a Core Image approximation; more accurate chrome / slide color may need a future LUT after licensing and asset strategy are settled.
- Soft Warm 400, Summer Gold 200, and Silver Gradation do not include grain yet.
- Soft Sun Portrait does not include real glow or skin-aware masking.
- Cinema Flat does not include scene-aware highlight protection.
- Public UI filter names should continue avoiding Kodak, Fujifilm, Leica, Polaroid, CineStill, and similar protected brand names unless legal approval exists.

### Safety Notes

- Did not start Phase 13.
- Did not implement all 20 proposed filters.
- Did not add expanded filter monetization.
- Did not add premium gating.
- Did not add StoreKit, subscription, paywall, or quota enforcement.
- Did not add AI custom filters.
- Did not call Gemini, OpenAI, Cloud Functions, or any external AI API.
- Did not connect real Firebase.
- Did not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Did not add `GoogleService-Info.plist`, `.env`, `.firebaserc`, API keys, Firebase project IDs, private keys, OAuth secrets, or Apple credentials.
- Did not add persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, dependencies, third-party SDKs, backend changes, commit, or push.

### Ready for Next Phase

Ready to commit Phase 12B: Yes, after final review.

Ready for Phase 13: No. Phase 12B should be committed, pushed, and read-only confirmed before Phase 13 starts.

---

## Phase 12A - Filter Research Integration & Preset Schema Planning

Status: Ready for review
Date completed: 2026-06-09

### Goal

Integrate the provided Phase 12 filter research direction into formal repository documentation and prepare the next construction prompt for a small, data-driven Batch 1 filter implementation.

This phase is documentation-only.

### Summary

Phase 12A created filter research, preset schema, implementation roadmap, and Phase 12B construction prompt documents. It defines a brand-safe naming direction, a 20-preset research catalog, a prioritized first 12, app-level filter preset schema fields, parameter ranges, and a staged roadmap that keeps Phase 12B limited to the first 6 hero filters.

The requested source file `deep-research-report.md` was not found in the local repo or nearby workspace during this pass. The new research document records that source-status caveat and should be reconciled with the original source report if it is later added.

### Completed

- Added a formal filter research document for popular film / retro / photographer-style looks.
- Added public display-name guidance to avoid using protected brand names as product filter names.
- Added 20 proposed presets and the first 12 implementation priority set.
- Added engineering seed JSON for catalog planning.
- Added app-level filter preset schema planning.
- Added parameter ranges for defaults, HSL, tone curve, render hints, and asset references.
- Added a filter implementation roadmap with Batch 1, Batch 2, and Batch 3.
- Marked which presets are good Core Image MVP candidates.
- Marked which presets may need LUTs, grain overlays, Metal, custom shader, or halation passes later.
- Added a Phase 12B construction prompt for schema/catalog implementation plus the first 6 hero filters only.

### Changed Files

- README.md
- ios-app/README.md
- docs/filter-research-popular-film-looks.md
- docs/filter-preset-schema.md
- docs/filter-roadmap.md
- docs/prompts/phase-12-filter-preset-schema-and-batch1.md
- docs/phase-log.md

### Phase 12A Safety Notes

- Did not modify Swift code.
- Did not modify backend code.
- Did not implement filters.
- Did not start Phase 13.
- Did not add expanded filter library implementation.
- Did not add Firebase, Gemini, OpenAI, Cloud Functions, or StoreKit.
- Did not add secrets, API keys, `GoogleService-Info.plist`, `.env`, or `.firebaserc`.
- Did not commit.
- Did not push.

### Ready for Next Phase

Ready to review Phase 12B prompt: Yes.

Ready to start Phase 13: No. Phase 12B should be reviewed and explicitly requested first.

---

## Maintenance - Mac/Xcode Build Error Fix

Status: Completed
Date completed: 2026-06-09

### Summary

Completed minimal Mac/Xcode build fixes for the Phase 01/02 scaffold. The Mac/Xcode project was detected at `ios-app/AIPhotoApp.xcodeproj`, and the Phase 01 UI scaffold plus Phase 02 Auth scaffold build succeeded on MacBook/Xcode.

### Completed

- Checked `git status --short`.
- Checked `ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift`.
- Searched Swift files under `ios-app/AIPhotoApp/` for `ObservableObject` and `@Published`.
- Added the missing `import Combine` to `AuthViewModel.swift`.
- Removed the default `MockAuthService()` argument from `AuthViewModel.init` to avoid actor-isolation errors in synchronous nonisolated contexts.
- Updated the Auth preview to inject `MockAuthService()` explicitly.
- Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- Confirmed Phase 01/02 Mac/Xcode build succeeded.
- Confirmed Auth scaffold build was verified.
- Did not start Phase 03.
- Did not implement Camera, Firebase Storage upload, AI, or StoreKit.
- Did not add secrets, API keys, credentials, or `GoogleService-Info.plist`.

### Changed Files

- .gitignore
- docs/phase-log.md
- ios-app/AIPhotoApp/Features/Auth/AuthView.swift
- ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift
- ios-app/AIPhotoApp.xcodeproj/
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirmed only `AuthViewModel.swift` uses `ObservableObject` / `@Published`.
- [x] Mac/Xcode build succeeded for Phase 01/02.
- [x] Phase 01 UI scaffold verified.
- [x] Phase 02 Auth scaffold verified.
- [x] Confirmed no Phase 03 work was started.

---

## Phase 00 - Repo Setup and Documentation

Status: Completed  
Date started: 2026-06-07  
Date completed: 2026-06-07

### Goal

Create the initial repository structure, documentation layout, AGENTS.md, placeholder folders, Firebase placeholder files, Cloud Functions placeholder files, scripts, and phase prompts.

No real app features should be implemented in this phase.

### Scope

This phase creates:

- README.md
- AGENTS.md
- .gitignore
- .env.example
- .firebaserc.example
- docs/
- docs/prompts/
- ios-app/ placeholder
- functions/ placeholder
- firebase/ placeholder
- scripts/ placeholder
- tests/ placeholder

### Summary

Phase 00 initialized the repository skeleton and documentation baseline for the iOS-first AI Support Retro Camera app.

### Completed

- Created root project documentation and agent instructions.
- Added common background, product reports, phase plan, decisions, and phase log.
- Added phase prompt placeholders for Phase 00 through Phase 12.
- Added iOS app, Firebase, Cloud Functions, scripts, and manual smoke test placeholders.
- Added no-secrets placeholders and ignore rules.

### Changed Files

- README.md
- AGENTS.md
- .gitignore
- .env.example
- .firebaserc.example
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/03-camera-filter-image-pipeline.md
- docs/04-ai-photo-advisor.md
- docs/05-firebase-storage-firestore-functions.md
- docs/06-ui-ux-design-system.md
- docs/07-subscription-quota-storekit.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/decisions.md
- docs/prompts/phase-00-setup.md
- docs/prompts/phase-01-design-navigation.md
- docs/prompts/phase-02-auth.md
- docs/prompts/phase-03-camera-picker.md
- docs/prompts/phase-04-filters.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- docs/prompts/phase-06-ai-function.md
- docs/prompts/phase-07-ai-result-ui.md
- docs/prompts/phase-08-quota.md
- docs/prompts/phase-09-subscription.md
- docs/prompts/phase-10-history-delete-download.md
- docs/prompts/phase-11-privacy-deletion.md
- docs/prompts/phase-12-testing-release.md
- ios-app/README.md
- functions/README.md
- functions/package.json
- functions/tsconfig.json
- functions/.env.example
- functions/src/index.ts
- firebase/firebase.json
- firebase/firestore.rules
- firebase/storage.rules
- firebase/firestore.indexes.json
- firebase/remote-config.template.json
- scripts/README.md
- scripts/bootstrap.sh
- scripts/emulators.sh
- scripts/validate-no-secrets.sh
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirm repo structure exists.
- [x] Confirm no real secrets are committed.
- [x] Confirm README.md exists.
- [x] Confirm AGENTS.md exists.
- [x] Confirm docs/phase-log.md exists.
- [x] Confirm functions placeholder exists.
- [x] Confirm firebase placeholder exists.
- [x] Confirm ios-app placeholder exists.
- [x] Confirm manual smoke test checklist exists.

### Known TODOs

- Add real Firebase project later.
- Add real `GoogleService-Info.plist` later.
- Add Apple Developer capabilities later.
- Add Gemini API key to server-side secret manager later.
- Add OpenAI key to server-side secret manager later only when image/edit feature begins.
- Initialize real SwiftUI Xcode project in Phase 01 or when requested.
- Implement Firebase Auth in Phase 02.
- Implement AVFoundation camera in Phase 03.

### Ready for Next Phase

Yes. Phase 01 can begin when explicitly requested.

---

## Phase 01 - Design System + Navigation

Status: Completed  
Date started: 2026-06-07  
Date completed: 2026-06-07

### Goal

Create the SwiftUI app shell, root navigation, basic design system, placeholder Home / History / Settings screens, dark mode support, and localization skeleton.

### Summary

Phase 01 created a dependency-free SwiftUI source scaffold under `ios-app/AIPhotoApp/`, expanded the Phase 01 construction prompt, added design system tokens and reusable UI components, added placeholder Home / History / Settings navigation, and added English / Traditional Chinese localization skeleton files.

No Auth, Camera, Firebase upload, AI, or StoreKit implementation was added.

### Completed

- Expanded `docs/prompts/phase-01-design-navigation.md` into a complete implementation prompt.
- Added SwiftUI app entry and root view scaffold.
- Added `TabView` + per-tab `NavigationStack` shell.
- Added placeholder Home / History / Settings views.
- Added design system tokens for colors, typography, spacing, and corner radius.
- Added reusable placeholder components: primary button, icon button, quota badge, empty state.
- Added simple UI preview models for presets, quota status, and history items.
- Added `en` and `zh-Hant` localization skeleton files.
- Updated iOS app README with Phase 01 structure and Xcode notes.
- Updated manual smoke tests with Phase 01 checks.

### Changed Files

- docs/prompts/phase-01-design-navigation.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/AIPhotoApp.swift
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppColors.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppTypography.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppSpacing.swift
- ios-app/AIPhotoApp/DesignSystem/Tokens/AppCornerRadius.swift
- ios-app/AIPhotoApp/DesignSystem/Components/PrimaryButton.swift
- ios-app/AIPhotoApp/DesignSystem/Components/IconCircleButton.swift
- ios-app/AIPhotoApp/DesignSystem/Components/QuotaBadge.swift
- ios-app/AIPhotoApp/DesignSystem/Components/EmptyStateView.swift
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/History/HistoryView.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Models/CameraPreset.swift
- ios-app/AIPhotoApp/Models/QuotaStatus.swift
- ios-app/AIPhotoApp/Models/HistoryPhotoItem.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Confirmed Phase 01 files are limited to prompt, iOS scaffold, iOS README, manual tests, and phase log.
- [x] Confirmed placeholder UI does not import Firebase, Google Sign-In, StoreKit, AVFoundation, PhotosUI, Gemini, OpenAI, or third-party packages.
- [x] Confirmed no `.env`, `.firebaserc`, `GoogleService-Info.plist`, or real credential files were added.
- [x] Confirmed manual test checklist includes Phase 01 checks.
- [ ] Xcode build / simulator verification not run in this Windows environment.

### Known TODOs

- Create a real Xcode iOS project or target on macOS and add `ios-app/AIPhotoApp/` files.
- Verify SwiftUI previews and simulator rendering in Xcode.
- Implement Auth in Phase 02.
- Implement Camera and photo picker in Phase 03.
- Implement real filter pipeline in Phase 04.
- Implement Firebase upload and Firestore metadata in Phase 05.
- Implement AI Cloud Function and AI UI in later phases.
- Implement StoreKit subscription flow in Phase 09.

### Ready for Phase 02

Yes. Phase 02 can begin when explicitly requested.

### Notes

Do not implement Auth, Camera, Firebase, AI, or StoreKit in this phase.

---

## Phase 01.5 - Xcode Project Setup

Status: Completed with documentation fallback  
Date started: 2026-06-07  
Date completed: 2026-06-07

### Goal

Create or document the setup for a real Xcode-openable iOS SwiftUI project/target that connects the existing `ios-app/AIPhotoApp/` Phase 01 SwiftUI source files, so the Phase 01 UI can be viewed in Xcode Preview and the iOS Simulator.

### Summary

Phase 01.5 verified that the repo still has no `.xcodeproj`. Because this work was performed in a Windows environment without Xcode, no `.xcodeproj` was generated or hand-written. Instead, a clear manual setup guide was added at `ios-app/XCODE_SETUP.md`.

No Auth, Camera, Firebase upload, AI, StoreKit, real secrets, API keys, Apple credentials, Firebase keys, Google keys, provisioning profiles, or `GoogleService-Info.plist` were added.

### Completed

- Read the required Phase 01.5 context documents.
- Verified the working tree state before editing.
- Verified no `.xcodeproj` exists in the current repo.
- Confirmed existing Phase 01 SwiftUI scaffold files under `ios-app/AIPhotoApp/`.
- Confirmed the current environment cannot reliably generate and verify an Xcode project.
- Added `ios-app/XCODE_SETUP.md` with manual Xcode project creation steps.
- Documented how to place the project at `ios-app/AIPhotoApp.xcodeproj`.
- Documented how to add existing Swift files to the app target.
- Documented how to add English and Traditional Chinese localization resources.
- Updated `ios-app/README.md` to reference the Phase 01.5 setup guide.
- Updated manual smoke tests with Phase 01.5 checks.

### Changed Files

- docs/prompts/phase-01-5-xcode-project-setup.md
- docs/phase-log.md
- ios-app/README.md
- ios-app/XCODE_SETUP.md
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short`.
- [x] Ran `rg --files`.
- [x] Ran `Get-ChildItem -Recurse -Filter *.xcodeproj` and found no `.xcodeproj`.
- [x] Confirmed `ios-app/AIPhotoApp/AIPhotoApp.swift` is the only current `@main` app entry in the Swift source scaffold.
- [x] Confirmed no app code imports Firebase, Google Sign-In, StoreKit, AVFoundation, PhotosUI, Gemini, OpenAI, or third-party packages.
- [x] Confirmed no generated `.xcodeproj` was added.
- [x] Confirmed no real `GoogleService-Info.plist` was added.
- [ ] Xcode build not run because this environment is Windows without Xcode.
- [ ] Xcode Preview not run because this environment is Windows without Xcode.
- [ ] iOS Simulator not run because this environment is Windows without Xcode.

### Known TODOs

- On macOS, follow `ios-app/XCODE_SETUP.md`.
- Create or verify `ios-app/AIPhotoApp.xcodeproj`.
- Add all existing `ios-app/AIPhotoApp/` Swift files to the app target.
- Add localization files to the app target resources.
- Verify `AppRootView` and `MainTabShellView` in Xcode Preview.
- Build and run the app in an iOS Simulator.
- Commit the verified `.xcodeproj` only after it opens and builds correctly.
- Implement Auth only in Phase 02 after explicit instruction.

### Ready for Phase 02

No. The Phase 01.5 fallback documentation is complete, but the real Xcode project has not yet been created or verified on macOS.

### Notes

Do not start Phase 02, Auth, Camera, Firebase upload, AI, or StoreKit from this phase.

---

## Phase 02 - Auth

Status: Completed as source scaffold / mock-only Auth
Date started: 2026-06-07
Date completed: 2026-06-07

### Goal

Implement Firebase Auth flow scaffolding for email/password, Google login, and Sign in with Apple.

### Summary

Phase 02 added dependency-free SwiftUI Auth UI scaffolding, mock Auth state, a mockable `AuthService` protocol, provider row placeholders for Google and Apple, guest try mode, Settings sign-out and account deletion placeholders, and Auth setup TODO documentation.

No real Firebase Auth, Google Sign-In, Sign in with Apple capability, Firebase Storage upload, Camera, AI, StoreKit, secrets, API keys, credentials, project IDs, production plist files, or `GoogleService-Info.plist` were added.

### Completed

- Read the required Phase 02 prompt and context documents.
- Ran `Get-ChildItem -Recurse -Filter '*.xcodeproj'` and confirmed no `.xcodeproj` exists.
- Added Auth UI scaffold under `ios-app/AIPhotoApp/Features/Auth/`.
- Added email/password form scaffold with local mock validation.
- Added Google sign-in row scaffold.
- Added Apple sign-in row scaffold.
- Added guest/try-mode copy and mock local state.
- Added `AuthService` protocol for dependency injection.
- Added `MockAuthService` for local-only sign-in/sign-out flows.
- Added `FirebaseAuthService` as a non-operational placeholder without Firebase imports.
- Connected the app root to the mock Auth flow before entering the existing tab shell.
- Added Settings mock sign-out and account deletion placeholder entries.
- Added English and Traditional Chinese Auth localization keys.
- Added Auth provider setup TODO documentation.
- Updated iOS README with Phase 02 Auth scaffold notes.
- Updated manual smoke tests with Phase 02 checks.

### Changed Files

- docs/phase-log.md
- ios-app/README.md
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Auth/AuthView.swift
- ios-app/AIPhotoApp/Features/Auth/EmailAuthForm.swift
- ios-app/AIPhotoApp/Features/Auth/AppleSignInButtonRow.swift
- ios-app/AIPhotoApp/Features/Auth/GoogleSignInButtonRow.swift
- ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift
- ios-app/AIPhotoApp/Features/Auth/AuthMode.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Models/AuthUser.swift
- ios-app/AIPhotoApp/Models/AuthProviderID.swift
- ios-app/AIPhotoApp/Services/Auth/AuthService.swift
- ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift
- ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift
- ios-app/AIPhotoApp/Services/Auth/AuthSetupTODO.md
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `Get-ChildItem -Recurse -Filter '*.xcodeproj'` and found no `.xcodeproj`.
- [x] Confirmed Phase 02 uses mock-only Auth source files because no verified Xcode project exists.
- [x] Confirmed `FirebaseAuthService.swift` does not import Firebase modules.
- [x] Confirmed Google and Apple sign-in rows are both present.
- [x] Confirmed guest mode is local-only scaffold state.
- [x] Confirmed account deletion is a Settings placeholder and does not claim backend deletion is complete.
- [x] Confirmed no `GoogleService-Info.plist` was added.
- [x] Confirmed no `.env`, `.firebaserc`, production plist, private key, OAuth secret, Firebase project ID, Google key, Apple credential, Gemini key, OpenAI key, or API key was added.
- [x] Confirmed no Camera, PhotosUI, Firebase Storage upload, AI, StoreKit, or Phase 03 work was added.
- [x] Mac/Xcode build succeeded after `ios-app/AIPhotoApp.xcodeproj` was created and verified.
- [ ] Xcode Preview verification is not recorded in this update.
- [ ] iOS Simulator verification is not recorded in this update.

### Known TODOs

- Keep `ios-app/AIPhotoApp.xcodeproj` committed after review.
- Add Firebase Apple SDK packages only after the Xcode project is verified.
- Keep `GoogleService-Info.plist` local-only and out of git.
- Configure Firebase Console Email/Password, Google, and Apple providers outside the repo.
- Configure Google reversed client ID URL scheme locally in Xcode.
- Configure Sign in with Apple capability in Apple Developer and Xcode.
- Implement real Firebase Auth only after dependencies and local config are ready.
- Implement backend account/data deletion in the later privacy/deletion phase.
- Confirm Gemini/public consumer 18+ and minors risk before public AI release.

### `.xcodeproj` Status

`ios-app/AIPhotoApp.xcodeproj` exists in the repo.

### Xcode Build / Simulator

Mac/Xcode build succeeded for the Phase 01 UI scaffold and Phase 02 Auth scaffold. Simulator verification is not recorded in this update.

### Ready for Phase 03

Yes, after this verification commit is pushed. Phase 03 has not been started.

### Notes

Use placeholders and TODOs for manual Firebase Console / Apple Developer setup. Do not invent real credentials.

Do not mark Phase 03 started from Phase 02.

---

## Phase 03 - Camera + Photo Picker

Status: Completed as local-only scaffold
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement AVFoundation single-photo camera flow and PhotosPicker / PHPicker single-image import flow.

### Summary

Phase 03 added a local-only Camera + Photo Picker scaffold. Home can open the camera flow, camera permission states are represented, AVFoundation preview/capture scaffolding exists, PhotosPicker imports one image, and captured/imported images are previewed from in-memory state only.

No filters, Core Image presets, Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions AI proxy, StoreKit, subscription/paywall logic, quota enforcement, history persistence, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

### Completed

- Read the Phase 03 prompt and required project documents.
- Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- Added Camera feature scaffold under `ios-app/AIPhotoApp/Features/Camera/`.
- Added AVFoundation camera session and single still-photo capture scaffold.
- Added `AVCaptureVideoPreviewLayer` SwiftUI wrapper.
- Added camera permission states and UI copy.
- Added PhotosPicker single-image import flow.
- Added selected/captured image preview with local-only memory state.
- Wired Home camera and import CTAs to the Camera scaffold.
- Added placeholder-safe camera and photo library usage descriptions to Xcode build settings.
- Added English and Traditional Chinese localization keys for Camera / Photo Picker UI.
- Updated manual smoke tests with Phase 03 checks.
- Ran command-line Xcode simulator build successfully.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- ios-app/README.md
- ios-app/AIPhotoApp.xcodeproj/project.pbxproj
- ios-app/AIPhotoApp/Features/Home/HomeView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/CameraPermissionState.swift
- ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift
- ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift
- ios-app/AIPhotoApp/Features/Camera/PhotoPickerView.swift
- ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
- ios-app/AIPhotoApp/Models/CapturedPhoto.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] Confirmed selected/captured image state is local-only and in memory.
- [x] Confirmed no filters or Core Image presets were implemented.
- [x] Confirmed no Firebase Storage upload or Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions AI proxy was implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, or history persistence was implemented.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] User manually checked Phase 03 in Xcode after implementation.
- [x] User confirmed build / basic UI flow looked acceptable.
- [x] User reported no obvious major bugs.
- [ ] Camera capture should still be verified more deeply on a physical iPhone / iPad before production.
- [ ] Photo picker should still be verified more deeply in Xcode Simulator or on a physical device before production.

### Known TODOs

- Verify camera permission prompt and real capture on a physical iPhone / iPad.
- Verify PhotosPicker import in Xcode Simulator or on device.
- Verify Home -> Camera full-screen flow manually.
- Verify guest/mock-auth users can access the local camera scaffold.
- Implement filters in Phase 04 only after Phase 03 is reviewed.
- Implement Firebase Storage / Firestore in Phase 05 only.
- Implement AI analysis in later phases only.
- Implement StoreKit in Phase 09 only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded.

### Camera / Photo Picker Verification

Codex did not perform interactive simulator/device testing. The user manually checked Phase 03 in Xcode and reported that build / basic UI flow looked acceptable with no obvious major bugs. The feature remains a scaffold and is not final product quality yet.

### Ready for Phase 04

Yes, if the build status is confirmed. Phase 03 remains a local-only scaffold; retro filters, AI advice, Firebase upload, Firestore metadata, history persistence, StoreKit, and quota work belong to later phases.

### Notes

Do not implement Firebase upload, AI analysis, filters, or history in this phase.

---

## Phase 04 - Filter Presets

Status: Implemented as local-only scaffold; command-line build succeeded; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement Core Image filter pipeline and at least 3 local retro film presets.

### Summary

Phase 04 added a local-only Core Image filter pipeline and preset selector for Phase 03 captured/imported images. The app can keep the original image in memory, render a local filtered preview, switch among Original, Classic Film, Warm Vintage, and Faded Chrome, and return to the unfiltered original.

No Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions, StoreKit, subscription/paywall logic, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, paid presets, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.

### Completed

- Read the Phase 04 prompt and required project documents.
- Confirmed branch, latest commit, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added data-driven filter preset model and catalog.
- Added Original / None plus Classic Film, Warm Vintage, and Faded Chrome presets.
- Added local Core Image rendering pipeline.
- Added filtered preview UI and preset selector UI.
- Wired Camera / Photo Picker selected image preview to the local filter selector.
- Preserved Original / None as the unfiltered source image.
- Kept selected source image and filtered preview state in local memory only.
- Added orientation normalization for filtered preview rendering.
- Dispatched filter rendering off the main thread.
- Updated English and Traditional Chinese localization strings.
- Updated iOS app notes and manual smoke tests.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-04-filters.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPreset.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPipeline.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift
- ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed no Firebase Storage upload or Firestore metadata persistence was implemented.
- [x] Confirmed no AI analysis or Cloud Functions were implemented.
- [x] Confirmed no StoreKit, subscription, paywall, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, or paid presets were implemented.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist` were added.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug -derivedDataPath /private/tmp/ai-photo-phase04-derived build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] User manually verified app build / run in Xcode / Simulator.
- [x] User manually verified Home -> Camera scaffold flow.
- [x] User manually verified photo picker can select one image.
- [x] User manually verified Original, Classic Film, Warm Vintage, and Faded Chrome can be switched.
- [x] User manually verified filtered preview updates.
- [x] User manually verified Original returns to the unfiltered image.
- [x] User manually verified Continue placeholder does not start upload, AI, StoreKit, history persistence, export, or Phase 05 behavior.
- [x] User manually verified Home / History / Settings still render.
- [ ] Camera capture plus filter preview physical device verification pending.

### Known TODOs

- If a physical iPhone / iPad is available, manually test capture plus filter preview.
- Keep Firebase Storage / Firestore for Phase 05 only.
- Keep AI analysis, StoreKit, quota, history persistence, and export for later phases only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded. The first sandboxed build attempt failed because of sandbox/CoreSimulator/SwiftUI preview macro environment errors; a non-sandboxed build was then approved and succeeded.

### Ready for Phase 05

No. Phase 04 has command-line build and user manual Simulator verification, but Phase 05 should not begin until Phase 04 is committed, pushed, and explicitly requested.

### Notes

Do not implement half-frame, double exposure, or advanced camera library as MVP requirements.

---

## Phase 05 - Firebase Storage + Firestore

Status: Implemented as mock-only save scaffold; command-line build succeeded; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a safe, mockable Firebase Storage / Firestore save scaffold for selected/captured and filtered photos.

### Summary

Phase 05 added a mock-only photo save service architecture. The app now has a `PhotoSaveService` protocol, mock success/failure service, saved photo metadata model, save state model, Storage path convention draft, Firestore document shape draft, and a mock Save UI after the filtered preview.

No real `GoogleService-Info.plist`, Firebase project ID, `.env`, `.firebaserc`, API key, private key, OAuth secret, Apple Team ID, signing credential, provisioning profile, Firebase import, production Firebase upload, production Firestore write, AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription/quota logic, history persistence, export/save to Photos, account deletion backend, public sharing, or Phase 06 work was added.

### Completed

- Read the Phase 05 prompt and required project documents.
- Confirmed branch, latest commit, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added `SavedPhoto` metadata model.
- Added `PhotoSaveState`.
- Added `PhotoSaveService` protocol.
- Added `MockPhotoSaveService` for local success and failure flows.
- Added `FirebasePhotoSaveService` placeholder/TODO without Firebase imports.
- Added `PhotoStoragePath` with Storage path and Firestore document path drafts.
- Added mock Save UI after the filtered preview.
- Added visible mock save success and failure states.
- Kept History as an honest placeholder without cross-page saved-item persistence.
- Updated English and Traditional Chinese localization strings.
- Updated iOS app notes and manual smoke tests.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Models/PhotoSaveState.swift
- ios-app/AIPhotoApp/Models/SavedPhoto.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/PhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/MockPhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/FirebasePhotoSaveService.swift
- ios-app/AIPhotoApp/Services/PhotoStorage/PhotoStoragePath.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed no real Firebase upload was implemented.
- [x] Confirmed no real Firestore write was implemented.
- [x] Confirmed no Firebase, FirebaseStorage, or FirebaseFirestore imports were added.
- [x] Confirmed no AI analysis, Cloud Functions, Gemini, OpenAI, StoreKit, subscription, quota, history persistence, export/save to Photos, public sharing, account deletion backend, or Phase 06 work was added.
- [x] Confirmed no secrets, API keys, credentials, Firebase project IDs, Apple credentials, Google credentials, `.env`, `.firebaserc`, or `GoogleService-Info.plist` were added.
- [x] Ran `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -sdk iphonesimulator -configuration Debug -derivedDataPath /private/tmp/ai-photo-phase05-derived build`.
- [x] Command-line Xcode simulator build succeeded.
- [x] User manually verified app build / run in Xcode / Simulator.
- [x] User manually verified Home -> Camera scaffold flow.
- [x] User manually verified photo picker can select one image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success state.
- [x] User manually verified mock save failure state.
- [x] User manually verified Save / Continue does not start upload, Firestore writes, AI, StoreKit, quota, history persistence, export, or Phase 06 behavior.
- [x] User manually verified History remains an honest placeholder.
- [x] User manually verified no real Firebase config or secrets were added.

### Known TODOs

- Keep real Firebase Storage / Firestore integration for a later explicitly requested setup task.
- Keep AI analysis and Cloud Functions for Phase 06 only.
- Keep StoreKit, subscription, quota, history persistence, export/save to Photos, account deletion backend, and public sharing for later phases only.

### Xcode Build

Command-line Xcode simulator build was run by Codex and succeeded. The first sandboxed build attempt failed because of sandbox/CoreSimulator/SwiftUI preview macro environment errors; a non-sandboxed build was then approved and succeeded.

### Ready for Phase 06

No. Phase 05 has command-line build and user manual Simulator verification, but Phase 06 should not begin until Phase 05 is committed, pushed, and explicitly requested.

### Notes

Do not store image binary data in Firestore.

---

## Phase 06 - AI Photo Advisor Backend / Service Scaffold

Status: Implemented as mock-only scaffold; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a safe, mockable AI Photo Advisor backend / service scaffold with request / response contracts, mock analyzer behavior, Cloud Functions placeholder shape, provider adapter placeholders, and future prompt template draft.

### Summary

Phase 06 added mock-only AI Photo Advisor models and services on iOS plus a dependency-free backend TypeScript scaffold. The app now has photo analysis request / response models, analysis status/error/provider models, a `PhotoAnalysisService` protocol, mock success/failure service, and a Cloud Function placeholder service that does not import Firebase.

The functions scaffold now has an `analyzePhoto` mock handler, typed photo analysis contract, `AIProviderAdapter`, `MockAnalyzer`, placeholder-only `GeminiAnalyzer` and `OpenAIAnalyzer`, and a future-only prompt template draft.

No Gemini API key, OpenAI API key, Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, FirebaseFunctions import in iOS, real Gemini call, real OpenAI call, Cloud Functions deploy, production Firebase, Firebase Admin SDK import, npm dependency, image upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.

### Completed

- Read the Phase 06 prompt and required project documents.
- Confirmed branch, latest commit, sync status, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` was present before implementation.
- Added `PhotoAnalysisRequest` model draft.
- Added `PhotoAnalysisResult` model draft.
- Added `PhotoAnalysisStatus`, provider, and error models.
- Added `PhotoAnalysisService` protocol.
- Added `MockPhotoAnalysisService` for local mock success and failure paths.
- Added `CloudFunctionPhotoAnalysisService` placeholder/TODO without Firebase imports.
- Added backend `analyzePhoto` mock handler.
- Added backend `AIProviderAdapter`.
- Added backend `MockAnalyzer`.
- Added backend `GeminiAnalyzer` placeholder/TODO.
- Added backend `OpenAIAnalyzer` placeholder/TODO.
- Added TypeScript photo analysis contract.
- Added future-only prompt template draft.
- Updated English and Traditional Chinese localization strings for mock AI output and errors.
- Updated iOS and functions README notes.
- Updated manual smoke tests with Phase 06 checks.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-06-ai-photo-advisor-backend.md
- functions/README.md
- functions/src/index.ts
- functions/src/analyzePhoto.ts
- functions/src/ai/AIProviderAdapter.ts
- functions/src/ai/MockAnalyzer.ts
- functions/src/ai/GeminiAnalyzer.ts
- functions/src/ai/OpenAIAnalyzer.ts
- functions/src/contracts/photoAnalysis.ts
- functions/src/prompts/photoAdvisorPrompt.ts
- ios-app/README.md
- ios-app/AIPhotoApp/Models/PhotoAnalysisRequest.swift
- ios-app/AIPhotoApp/Models/PhotoAnalysisResult.swift
- ios-app/AIPhotoApp/Models/PhotoAnalysisStatus.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/PhotoAnalysisService.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/MockPhotoAnalysisService.swift
- ios-app/AIPhotoApp/Services/AIPhotoAdvisor/CloudFunctionPhotoAnalysisService.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran `git status --short` before implementation.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed local branch was synchronized with `origin/feat/phase-02-auth`.
- [x] Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` existed before implementation.
- [x] Confirmed iOS Phase 06 files do not import Firebase or FirebaseFunctions.
- [x] Confirmed backend Phase 06 files do not import Gemini SDK, OpenAI SDK, or Firebase Admin SDK.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed mock response contains one short summary, up to three suggestions, adjustment hints, `provider = mock`, and `isMock = true`.
- [x] Confirmed no complete AI result UI was added.
- [x] Confirmed no real Gemini call, OpenAI call, Cloud Functions deploy, production Firebase, upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, generative edit, realtime video AI, or Phase 07 work was added.
- [x] Attempted command-line Xcode simulator build. It failed in the sandbox because SwiftUI `#Preview` macro expansion could not load `PreviewsMacros.SwiftUIView` and CoreSimulator services were unavailable.
- [x] Attempted command-line Xcode device build with signing disabled. It failed for the same sandbox / SwiftUI Preview macro environment.
- [x] Filtered Xcode build errors and confirmed reported Swift `error:` lines point to existing `#Preview` macro expansion failures, not Phase 06 files.
- [x] Backend TypeScript build/check was attempted but could not run because `tsc` is not installed and `functions/node_modules` is absent.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera flow.
- [x] User manually verified photo picker can select an image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success and failure still work.
- [x] User manually verified Home / History / Settings still work.
- [x] User manually verified no AI result UI appears.
- [x] User manually verified no real AI call occurs.
- [x] User manually verified no upload, Firestore write, Storage write, StoreKit, quota, history persistence, or export behavior occurs.
- [x] User manually verified no real Firebase config or secrets were added.

### Known TODOs

- Keep real Cloud Functions callable wiring for a later explicitly requested setup task.
- Keep real Gemini/OpenAI provider setup for a later explicitly requested setup task with server-side secret management.
- Add consent gate, quota enforcement, App Check, structured response validation, cost controls, and provider fallback only in later phases.
- Build complete AI result UI in Phase 07 only after Phase 06 is verified, committed, pushed, and explicitly requested.

### Xcode Build

Codex attempted command-line simulator and device builds. Both failed inside the managed sandbox because Xcode could not access CoreSimulator services and SwiftUI `#Preview` macro expansion reported `PreviewsMacros.SwiftUIView` as unavailable. A filtered error scan showed the Swift `error:` lines are from existing preview declarations, not the new Phase 06 source files.

The user manually verified Phase 06 in Xcode / Simulator and reported that app build / run was acceptable.

### Backend Check

`git diff --check` passed. Backend TypeScript build did not run because `tsc` is not installed in this environment and `functions/node_modules` is absent. No npm install was run and no npm dependency was added.

### Ready for Phase 07

No. Phase 06 has been implemented as a mock-only scaffold and manually verified by user in Xcode / Simulator, but Phase 07 should not begin until Phase 06 is committed, pushed, and explicitly requested.

### Notes

Do not put AI API keys in the iOS app. Real provider keys should use server-side secret management in a later explicitly requested setup task.

---

## Phase 07 - AI Photo Advisor Result UI Scaffold

Status: Implemented as mock-only scaffold; manually verified by user in Xcode / Simulator
Date started: 2026-06-09
Date completed: 2026-06-09

### Goal

Implement a mock-only iOS AI Photo Advisor result UI using the Phase 06 `PhotoAnalysisService` protocol and `MockPhotoAnalysisService`, while keeping all analysis state local to memory and avoiding real AI, Firebase, Cloud Functions, StoreKit, quota, persistence, and secrets.

### Summary

Phase 07 added a mock AI advice panel after the filtered preview / mock save flow. The panel can trigger local mock analysis, display loading / success / failure states, retry after failure, dismiss results, and render the Phase 06 mock `PhotoAnalysisResult` with a short summary, up to three suggestions, adjustment hints, and composition / lighting notes.

After user Simulator testing, Phase 07 also received a minimal UI fix for the selected-photo flow: the mock AI result panel is now reachable through vertical scrolling on small iPhone screens, and dynamic priority / adjustment localization labels now render user-readable strings instead of raw localization keys. The user manually verified the scroll and localization fixes in Xcode / Simulator.

No Gemini API key, OpenAI API key, Firebase project ID, `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, OAuth secret, Apple credential, real Gemini call, real OpenAI call, Cloud Functions call, Cloud Functions deploy, image upload, Firestore write, Storage write, AI result persistence, history persistence, AI chat, image editing, realtime video AI, StoreKit, subscription/paywall, quota enforcement, npm dependency, or Phase 08 work was added.

### Completed

- Read the Phase 07 prompt and required project context.
- Confirmed current branch, latest commit, sync status, and `ios-app/AIPhotoApp.xcodeproj` before implementation.
- Added `AIAnalysisViewModel` using the Phase 06 `PhotoAnalysisService` protocol.
- Added mock-only AI analysis entry UI after the filtered preview / mock save flow.
- Added loading, success, failure, retry, and dismiss UI states.
- Added result UI for summary, up to three suggestions, adjustment hints, and composition / lighting notes.
- Added suggestion and adjustment hint card views.
- Wired `FilteredPhotoPreview` to show the Phase 07 mock AI advice panel.
- Kept analysis state local to memory for the current selected photo flow.
- Fixed selected-photo layout so the Phase 07 result panel can scroll vertically on small simulator screens.
- Fixed dynamic priority and adjustment labels so they display localized text instead of raw localization keys.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 07 checks.
- Ran command-line Xcode simulator build successfully with `iPhone 17`.

### Changed Files

- docs/phase-log.md
- docs/prompts/phase-07-ai-advisor-result-ui.md
- ios-app/README.md
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisViewModel.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisSuggestionCard.swift
- ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAdjustmentHintCard.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- tests/manual-smoke-tests.md

### Tests / Manual Checks

- [x] Ran pre-implementation git and project checks.
- [x] Confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Confirmed local branch was synchronized with `origin/feat/phase-02-auth` before implementation.
- [x] Confirmed no real Firebase config, `.env`, `.firebaserc`, or `GoogleService-Info.plist` existed before implementation.
- [x] Confirmed the implementation uses `MockPhotoAnalysisService` and does not call Cloud Functions.
- [x] Confirmed iOS Phase 07 files do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- [x] Confirmed no npm dependency was added.
- [x] Confirmed no real Gemini call, OpenAI call, Cloud Functions deploy, production Firebase, upload, Firestore write, Storage write, AI billing/quota, StoreKit, subscription/paywall, AI chat, image editing, realtime video AI, or Phase 08 work was added.
- [x] Command-line Xcode simulator build succeeded with `xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 17' build`.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera flow.
- [x] User manually verified photo picker can select an image.
- [x] User manually verified filter presets can be switched.
- [x] User manually verified mock save success and failure still work.
- [x] User manually verified mock AI analysis can be triggered.
- [x] User manually verified loading / result / failure / retry / dismiss states work.
- [x] User manually verified the AI result panel can scroll vertically.
- [x] User manually verified localization keys no longer appear for priority / adjustment labels.
- [x] User manually verified Home / History / Settings still work.
- [x] User manually verified no obvious major bug is present.
- [x] User manually verified no real AI call, Cloud Functions call, upload, Firestore write, Storage write, StoreKit, quota, history persistence, export behavior, real Firebase config, or secrets are present.

### Known TODOs

- Keep real Cloud Functions callable wiring for a later explicitly requested setup task.
- Keep real Gemini/OpenAI provider setup for a later explicitly requested setup task with server-side secret management.
- Add consent gate, quota enforcement, App Check, structured response validation, cost controls, provider fallback, and production AI result persistence only in later phases.
- Do not add AI chat follow-up, image editing, realtime video AI, StoreKit, subscription/paywall, or quota logic in Phase 07.

### Ready for Phase 08

Yes. Phase 07 has been manually verified, committed, and pushed; Phase 08 local session history work has now started.

---

## Phase 08 - Local Session History / Timeline Scaffold

Status: Completed; manually verified by user in Xcode / Simulator

### Goal

Add current-session, memory-only History tab items for the local photo flow after mock save or mock AI analysis.

### Completed

- Added `SessionHistoryItem` and `SessionHistoryStatus` model scaffolds.
- Added an app-level in-memory `SessionHistoryStore` / `MockSessionHistoryStore`.
- Shared the session history store through SwiftUI environment object state.
- Updated Camera / Filter / Mock Save / Mock AI flow so mock save or mock AI success can add/update the same local session item.
- Updated History tab from an honest placeholder to a local-only session timeline scaffold.
- Added empty state, scrollable local cards, local/mock badges, created time, source, filter preset, mock save status, optional mock AI summary, and clear local session history action.
- Kept thumbnails as small in-memory UI images only.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 08 checks.
- Fixed a History tab freeze caused by mismatched SwiftUI `EnvironmentObject` injection / lookup types for the session history store.

### Safety Notes

No Firebase Storage upload, Firestore write, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI call, Cloud Functions call, StoreKit, subscription/paywall, quota enforcement, new SDK, npm dependency, real Firebase config, API key, secret, or Phase 09 work was added.

### Manual Verification

- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified the History tab can be entered normally and no longer freezes.
- [x] User manually verified the History empty state is usable.
- [x] User manually verified mock save success adds a local-only session card.
- [x] User manually verified mock AI analysis success updates the History card with a mock AI summary.
- [x] User manually verified the History list scrolls.
- [x] User manually verified clear local session history works.
- [x] User manually verified cards show local-only / mock labels.
- [x] User manually verified UI copy does not claim cloud history, permanent history, or sync.
- [x] User manually verified Home / Camera / Filters / Mock Save / Mock AI / History / Settings still work.
- [x] User manually verified no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, export, disk persistence, UserDefaults persistence, real Firebase config, or secrets were added.

### Ready for Phase 09

No. Phase 08 has been manually verified, but Phase 09 should not begin until Phase 08 is committed, pushed, and explicitly requested.

---

## Phase 09 - MVP Polish / UX Hardening

Status: Completed; manually verified by user in Xcode / Simulator

### Goal

Polish the existing mock MVP flow without adding new product features or connecting production services.

### Completed

- Added `docs/prompts/phase-09-mvp-polish-ux-hardening.md`.
- Polished Home copy and hierarchy so the app is presented as a mock MVP demo instead of implying active quota enforcement.
- Improved Camera scroll behavior by using one outer scroll container for capture, selected-photo, filter, mock save, mock AI, status messages, and local-only notes.
- Added clearer Camera helper copy for Simulator / photo import testing.
- Made mock save failure a visible text button instead of an icon-only action.
- Improved mock save state text wrapping.
- Made mock AI result retry / dismiss controls easier to tap.
- Made History clear action clearer and visually destructive.
- Changed History card filter detail from raw preset id to localized preset name.
- Added Settings copy that explicitly states cloud, subscription, AI, quota, and account deletion backend services are not connected.
- Updated English and Traditional Chinese localization strings.
- Updated iOS README notes.
- Updated manual smoke tests with Phase 09 checks.

### Safety Notes

No real Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, cloud history, disk persistence, UserDefaults persistence, Core Data, SwiftData, save-to-Photos, export, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, new SDK, npm dependency, real Firebase config, API key, secret, or Phase 10 work was added.

### Verification

- [x] Codex performed source-level safety checks for forbidden imports and config files.
- [x] User manually verified app build / run in Xcode / Simulator was acceptable.
- [x] User manually verified Home -> Camera -> Photo Picker -> Filter -> Mock Save -> Mock AI -> History main flow was smooth.
- [x] User manually verified Camera selected-photo flow can scroll and is not blocked by tab bar / safe area.
- [x] User manually verified AI result UI can scroll and retry / dismiss work.
- [x] User manually verified History tab can be entered, card list scrolls, and clear local history works.
- [x] User manually verified empty / loading / error states look acceptable.
- [x] User manually verified Traditional Chinese copy looks natural and no obvious raw localization key appears.
- [x] User manually verified local-only / mock labels are clear but not too noisy.
- [x] User manually verified Settings placeholders do not claim real backend, subscription, or account deletion completion.
- [x] User manually verified no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, export, disk persistence, UserDefaults behavior, real Firebase config, or secrets were added.

### Ready for Phase 10

No. Phase 09 has been manually verified, but Phase 10 should not begin until Phase 09 is committed, pushed, and explicitly requested.

---

## Phase 10 - MVP Demo QA / Release Readiness

Status: Implemented as documentation / QA readiness scaffold; awaiting user review

### Goal

Create a demo script, QA checklist, known limitations document, and readiness gates for the current local/mock MVP without adding product features or connecting production services.

### Completed

- Added `docs/prompts/phase-10-mvp-demo-qa-readiness.md`.
- Added `docs/mvp-demo-script.md`.
- Added `docs/mvp-known-limitations.md`.
- Added `docs/mvp-readiness-checklist.md`.
- Updated root README with current mock MVP status and links to Phase 10 docs.
- Updated iOS README with Phase 10 documentation notes.
- Updated manual smoke tests with Phase 10 documentation and QA readiness checks.
- Recorded that Phase 10 is docs-only and does not require Xcode build unless UI code changes later.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/mvp-known-limitations.md
- docs/mvp-readiness-checklist.md
- docs/phase-log.md
- docs/prompts/phase-10-mvp-demo-qa-readiness.md
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No Swift code, backend code, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, Firebase project ID, Gemini/OpenAI key, private key, OAuth secret, Apple credential, Firebase import, Gemini/OpenAI import, StoreKit import, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, subscription/paywall, quota enforcement, disk persistence, UserDefaults persistence, Core Data, SwiftData, export, save-to-Photos, new npm dependency, third-party SDK, production release claim, or Phase 11 work was added.

### Verification

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed latest commit was Phase 09 MVP UX polish.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Pre-check confirmed Phase 09 is recorded as completed / manually checked.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, or export implementation.
- [x] Secret/config scan found only `.env.example` placeholders and documentation command references, not real secrets.
- [x] Xcode build was not run because Phase 10 did not modify Swift code.

### Known TODOs

- User should review the new MVP demo script and readiness docs.
- User should run the demo script in Xcode / Simulator if a fresh demo rehearsal is desired.
- Physical iPhone / iPad capture remains optional but recommended before a real demo.
- Real Firebase, real AI, StoreKit, persistence, export, privacy consent, account deletion, and production App Store readiness remain future phases.

### Ready for Phase 11

No. Phase 10 should be reviewed, committed, pushed, and explicitly approved before Phase 11 starts.

---

## Phase 11 - Camera-First UX Redesign

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit with known product gaps documented
Date completed: 2026-06-09

### Goal

Make the current local/mock MVP camera-first without starting Phase 12 or connecting real services.

### Completed

- Made Camera the default primary tab in `MainTabShellView`.
- Kept Guide / Home as a secondary tab instead of deleting existing explanatory content.
- Kept History and Settings accessible.
- Updated Camera so tab-hosted Camera does not show a Close button, while full-screen Camera launched from the guide still can close.
- Updated the camera viewfinder surface to a larger 4:5 portrait frame to support the 5:4-style camera-first direction on iOS portrait screens.
- Added a lower-right filter entry on the camera surface.
- Reused the existing local preset selector from the lower-right filter entry.
- Preserved only the existing presets: Original, Classic Film, Warm Vintage, and Faded Chrome.
- Preserved Photo Picker fallback.
- Preserved mock save, mock AI advice, and local session history flow.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / MVP demo script / manual smoke tests for Phase 11.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/phase-log.md
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API key, Firebase project ID, private key, Apple credential, Firebase import, FirebaseFunctions import, FirebaseStorage import, FirebaseFirestore import, Gemini/OpenAI import, StoreKit import, Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, backend code change, new npm dependency, third-party SDK, production cloud history, or Phase 12 work was added.

### Verification

- [x] Pre-check confirmed branch `feat/phase-02-auth`.
- [x] Pre-check confirmed local branch synchronized with `origin/feat/phase-02-auth`.
- [x] Pre-check confirmed `ios-app/AIPhotoApp.xcodeproj` exists.
- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [x] User Xcode / Simulator verification accepted on 2026-06-09.
- [x] User confirmed Camera tab can be entered and the current Phase 11 result is acceptable for commit.
- [x] User confirmed Photo Picker fallback, existing four filter presets, mock save, mock AI, local history, History, and Settings remain available.
- [x] User confirmed no real Firebase, real AI, StoreKit, persistence, or export behavior was added.
- [ ] Codex command-line build remains blocked by sandbox-exec / CoreSimulator environment restrictions after reaching Swift compilation.

### Known TODOs

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera page should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should become more prominent and overall information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Phase 11B / Camera Entry Flow & Camera Shell Redesign, if the current implementation is not yet product-satisfying.
- Optional physical iPhone / iPad capture verification remains useful.
- Phase 12 filter research and preset schema should not begin until Phase 11 is reviewed, committed, pushed, and explicitly requested.

### Ready for Phase 12

No. Phase 11 should be committed, pushed, and read-only confirmed before Phase 12 starts.

---

## Phase 11B - Camera Entry Flow & Camera Shell Redesign

Status: Implemented; user Xcode / Simulator verification accepted; ready to commit with known product gaps documented
Date completed: 2026-06-09

### Goal

Refine Phase 11 so the app truly enters Camera first, does not gate basic camera use behind landing or Auth, and makes the Camera page feel more like a real camera shell.

### Completed

- Removed the launch landing / browse screen from the default app entry path.
- Removed launch-time Auth gating from the default app entry path.
- Updated `AppRootView` to enter the main tab shell directly.
- Preserved the existing mock Auth scaffold.
- Moved mock Auth access into Settings as a future cloud-feature entry point.
- Updated Settings copy to explain that login is not required for basic camera use.
- Preserved Camera as the default first tab.
- Redesigned the Camera capture state toward a darker camera shell.
- Kept the large central 4:5 viewfinder.
- Added top camera shell status / selected preset display.
- Added bottom camera controls for flash, timer, capture, camera flip, and photo import.
- Implemented flash / timer / camera flip as UI-only scaffold interactions.
- Preserved the lower-right filter picker entry.
- Preserved Photo Picker fallback.
- Preserved the existing four local presets only.
- Preserved mock save, mock AI advice, local session history, Guide, History, and Settings.
- Updated English and Traditional Chinese localization strings.
- Updated README / iOS README / MVP demo script / manual smoke tests.

### Changed Files

- README.md
- docs/mvp-demo-script.md
- docs/phase-log.md
- ios-app/AIPhotoApp/App/AppRootView.swift
- ios-app/AIPhotoApp/App/MainTabShellView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraView.swift
- ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift
- ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
- ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
- ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
- ios-app/README.md
- tests/manual-smoke-tests.md

### Safety Notes

No expanded filter library, live AI guidance, AI custom filter, AI image generation, real Firebase setup, `GoogleService-Info.plist`, `.env`, `.firebaserc`, API key, Firebase project ID, private key, Apple credential, Firebase import, FirebaseFunctions import, FirebaseStorage import, FirebaseFirestore import, Gemini/OpenAI import, StoreKit import, Firebase Storage upload, Firestore write, Storage write, Cloud Functions call, real Gemini/OpenAI call, StoreKit, subscription/paywall, quota enforcement, persistence, UserDefaults, Core Data, SwiftData, export, save-to-Photos, backend code change, new npm dependency, third-party SDK, production cloud history, or Phase 12 work was added.

### Verification

- [x] Source-level safety scan found no forbidden iOS Firebase / Gemini / OpenAI / StoreKit imports.
- [x] Source-level safety scan found no real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation.
- [x] Secret/config scan found no real `GoogleService-Info.plist`, `.env`, `.firebaserc`, private key, provisioning profile, or Apple credential file.
- [x] Backend / Firebase / package files were not modified.
- [x] User Xcode / Simulator run accepted on 2026-06-09.
- [x] User accepted the current result as commit-ready.
- [ ] Codex command-line build remains blocked by existing `#Preview` macro / CoreSimulator tooling issues after reaching Swift compilation.

### Known TODOs

- Final product should open directly into Camera and should not show a landing / browse screen first.
- Auth should not block basic camera use; login should live in Settings or future cloud-feature entry points.
- Camera page should feel more like a Dazz-style camera shell and less like a content page.
- Camera viewfinder should become more prominent and overall information density should be lower.
- Camera controls should be completed in a future hardening pass: flash, timer, camera flip, capture button, filter picker, and photo picker import.
- Recommended follow-up before Phase 12: Camera Entry Flow & Camera Shell Redesign if the current shell remains visually insufficient.
- Small-screen camera shell layout should be verified again after the next camera-shell pass.
- Optional physical iPhone / iPad capture and controls verification remains useful.
- Phase 12 filter research and preset schema should not begin until Phase 11B is reviewed, committed, pushed, and explicitly requested.

### Ready for Phase 12

No. Phase 11 / 11B should be committed, pushed, and read-only confirmed before Phase 12 starts.

---

## Deferred - Quota System (Former Phase 08 Plan)

Status: Not started

### Goal

Implement free 20 starter analysis credits, daily login +1, free 20-photo storage limit, and quota UI.

### Notes

Quota enforcement should not rely only on client-side logic.

---

## Deferred - Subscription + Paywall (Former Phase 09 Plan)

Status: Not started

### Goal

Implement StoreKit 2 subscription scaffolding, local `.storekit` testing, PaywallView, and entitlement state.

### Notes

RevenueCat is not the MVP default. Do not lock basic camera behind VIP.

---

## Deferred - History + Delete + Local Download (Former Phase 10 Plan)

Status: Not started

### Goal

Implement history list, photo detail, delete single photo, and local download/export flow.

### Notes

Server backup is not required for MVP.

---

## Phase 11 - Privacy Consent + Account Deletion

Status: Not started

### Goal

Implement AI processing consent gate, privacy settings, data management, and account deletion request flow.

### Notes

Photos should not be assumed to be used for model training. `trainingConsent` defaults to false.

---

## Phase 12 - Testing + Release Preparation

Status: Not started

### Goal

Add manual smoke tests, emulator notes, no-secrets validation, release checklist, and TestFlight preparation docs.

### Notes

Do not add new major product features in this phase.
