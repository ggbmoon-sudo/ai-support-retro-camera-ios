# Phase 01: Design System + Navigation

## Phase name

Phase 01 - Design System + Navigation

## Goal

Create the first SwiftUI-oriented iOS app scaffold inside the existing `ios-app/` folder, with a small design system, root navigation, placeholder Home / History / Settings screens, dark/light appearance support, localization skeleton, and manual checks.

This phase should make the app structure ready for later feature phases, but it must not implement real Auth, Camera, Firebase upload, AI, or StoreKit behavior.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/06-ui-ux-design-system.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/prompts/phase-01-design-navigation.md

## Current status

- Phase 00 is completed.
- Current repo has Phase 00 documentation, Firebase placeholder files, Cloud Functions placeholder files, helper scripts, and manual smoke tests.
- Current `ios-app/` folder only contains `ios-app/README.md`.
- There is no existing SwiftUI Xcode project checked in yet.
- Phase 01 is the next phase and is explicitly allowed by `docs/phase-log.md`.

## This phase only does

- Work on Phase 01 only.
- Create a minimal SwiftUI app source scaffold under `ios-app/`.
- Create root app entry and navigation shell files.
- Create `MainTabShellView` with placeholder tabs:
  - Home
  - History
  - Settings
- Create placeholder onboarding/auth gate state only as local UI state or preview state if needed.
- Create a small design system:
  - colors
  - typography
  - spacing
  - corner radius
  - reusable buttons / badges / empty state components
- Create placeholder data models needed by UI previews:
  - camera preset
  - quota status
  - history item
- Create localization skeleton for `zh-Hant` and `en`.
- Update `ios-app/README.md` with Phase 01 structure and manual open/build notes.
- Add or update manual test checklist for Phase 01.
- Update `docs/phase-log.md` before finishing.

## This phase does not do

- Do not start Phase 02.
- Do not implement Auth.
- Do not connect Firebase Auth.
- Do not implement Camera.
- Do not use AVFoundation beyond TODO notes or placeholder file names.
- Do not implement PhotosPicker / PHPicker.
- Do not implement Firebase upload.
- Do not write Firestore data.
- Do not call Cloud Functions.
- Do not implement AI.
- Do not add Gemini or OpenAI integration.
- Do not implement StoreKit.
- Do not create real subscriptions or paywall purchase logic.
- Do not add real API keys, secrets, Firebase project IDs, Apple Team IDs, bundle IDs, or `GoogleService-Info.plist`.
- Do not delete or rewrite Phase 00 docs, Firebase placeholders, Functions placeholders, or scripts.
- Do not claim placeholder UI is a complete feature.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new files:

```text
ios-app/AIPhotoApp/AIPhotoApp.swift
ios-app/AIPhotoApp/App/AppRootView.swift
ios-app/AIPhotoApp/App/MainTabShellView.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppColors.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppTypography.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppSpacing.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppCornerRadius.swift
ios-app/AIPhotoApp/DesignSystem/Components/PrimaryButton.swift
ios-app/AIPhotoApp/DesignSystem/Components/IconCircleButton.swift
ios-app/AIPhotoApp/DesignSystem/Components/QuotaBadge.swift
ios-app/AIPhotoApp/DesignSystem/Components/EmptyStateView.swift
ios-app/AIPhotoApp/Features/Home/HomeView.swift
ios-app/AIPhotoApp/Features/History/HistoryView.swift
ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
ios-app/AIPhotoApp/Models/CameraPreset.swift
ios-app/AIPhotoApp/Models/QuotaStatus.swift
ios-app/AIPhotoApp/Models/HistoryPhotoItem.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
```

Suggested existing files to modify:

```text
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Do not modify other files unless a small documentation note is necessary for Phase 01.

## Technical requirements

- Use Swift + SwiftUI source files.
- Keep implementation dependency-free. Do not add Firebase, Google Sign-In, StoreKit, AVFoundation, PhotosUI, Gemini, OpenAI, or third-party packages in this phase.
- Prefer `TabView` plus per-tab `NavigationStack`.
- Keep the camera entry as a disabled or placeholder CTA with TODO text for Phase 03.
- Keep auth/login state as placeholder UI only; real Auth begins in Phase 02.
- Keep subscription entry as navigation placeholder only; real StoreKit begins in Phase 09.
- Use semantic design tokens instead of scattering raw colors and magic spacing through views.
- Support dark and light mode through SwiftUI dynamic colors where possible.
- Add accessibility labels for important buttons and badges.
- Keep UI copy short and localizable.
- Use Traditional Chinese and English localization files.
- If an Xcode project cannot be safely generated in this environment, document that the SwiftUI source scaffold should be added to a real Xcode iOS target manually.

## Acceptance criteria

- `ios-app/` contains a clear SwiftUI source scaffold for Phase 01.
- App entry, root view, and tab navigation shell exist.
- Home / History / Settings placeholder views exist.
- Design system token files and basic reusable components exist.
- Placeholder UI does not call Auth, Camera, Firebase, AI, or StoreKit APIs.
- Localization skeleton exists for `zh-Hant` and `en`.
- `ios-app/README.md` explains the Phase 01 scaffold and how to open/add it to Xcode.
- `tests/manual-smoke-tests.md` includes Phase 01 manual checks.
- `docs/phase-log.md` records Phase 01 status, changed files, checks, known TODOs, and readiness for Phase 02.
- No real secrets or project credentials are added.

## Tests / manual check

Run or perform:

- `git status --short` to review changed files.
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, or real credential files were added.
- Confirm the only functional source added is SwiftUI UI scaffold under `ios-app/AIPhotoApp/`.
- Confirm root navigation can be inspected in SwiftUI previews or added to a local Xcode iOS app target.
- Confirm Home / History / Settings views render placeholder content.
- Confirm placeholder CTAs do not start Auth, Camera, Firebase upload, AI, or StoreKit work.
- Confirm `tests/manual-smoke-tests.md` contains Phase 01 checks.

If running on Windows without Xcode, document that compile/simulator verification was not performed and provide manual Xcode verification steps.

## Completion requirement

Before finishing, update `docs/phase-log.md`.

The Phase 01 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- ready for Phase 02: yes/no

Do not mark Phase 02 started.
