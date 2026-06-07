# Phase 01.5: Xcode Project Setup

## Phase name

Phase 01.5 - Xcode Project Setup

## Goal

Establish a real iOS SwiftUI Xcode project/target that can open in Xcode and include the existing Phase 01 SwiftUI scaffold under `ios-app/AIPhotoApp/`, so the Phase 01 UI can be checked in Xcode Preview and the iOS Simulator.

If the current Codex environment cannot reliably generate a valid `.xcodeproj`, do not invent or hand-write a broken Xcode project. Instead, create clear manual setup documentation in `ios-app/XCODE_SETUP.md` that explains exactly how to create the Xcode project and add the existing `ios-app/AIPhotoApp/` files to the app target.

This phase is only for making Phase 01 viewable/buildable in Xcode. It must not start Phase 02 or implement any product feature beyond Xcode project setup.

## Please read first

Before making changes, read:

- `README.md`
- `AGENTS.md`
- `docs/00-common-background-v2.md`
- `docs/01-product-mvp-scope.md`
- `docs/02-technical-architecture.md`
- `docs/06-ui-ux-design-system.md`
- `docs/09-codex-phase-plan.md`
- `docs/phase-log.md`
- `ios-app/README.md`
- `docs/prompts/phase-01-design-navigation.md`
- `docs/prompts/phase-01-5-xcode-project-setup.md`

## Current status

- Phase 00 is completed.
- Phase 01 is completed.
- `docs/prompts/phase-02-auth.md` has already been drafted, but Phase 02 has not started.
- The current repo has no checked-in `.xcodeproj`.
- `ios-app/README.md` documents that a real Xcode project still needs to be created on macOS with Xcode.
- `ios-app/AIPhotoApp/` already contains the Phase 01 SwiftUI source scaffold:

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

- The current branch has been pushed to `feat/phase-00-setup`.

Before editing, verify the actual repo state with:

```powershell
git status --short
rg --files
Get-ChildItem -Recurse -Filter *.xcodeproj
```

## This phase only does

- Work on Phase 01.5 only.
- Check whether a `.xcodeproj` already exists.
- If a valid `.xcodeproj` already exists, inspect it before modifying it.
- If it is reliable in the current environment, create a real Xcode iOS SwiftUI project/target for the existing app scaffold.
- Add the existing Swift files under `ios-app/AIPhotoApp/` to the iOS app target.
- Add the existing localization resources under `ios-app/AIPhotoApp/Resources/Localization/` to the app target.
- Configure only the minimum project settings needed for local Xcode Preview / Simulator checks.
- If a valid project cannot be generated reliably, create `ios-app/XCODE_SETUP.md` instead of creating a bad `.xcodeproj`.
- Update `ios-app/README.md` only if needed to reference the actual project or the manual setup guide.
- Update `tests/manual-smoke-tests.md` only if needed to add Phase 01.5 manual Xcode checks.
- Update `docs/phase-log.md` before finishing.

## This phase does not do

- Do not start Phase 02.
- Do not implement Auth.
- Do not add Firebase Auth.
- Do not add Google Sign-In.
- Do not add Sign in with Apple credentials.
- Do not implement Camera.
- Do not add AVFoundation camera capture behavior.
- Do not implement PhotosPicker / PHPicker behavior.
- Do not implement Firebase Storage upload.
- Do not write Firestore data.
- Do not call Cloud Functions.
- Do not implement AI.
- Do not add Gemini, OpenAI, or other AI integrations.
- Do not implement StoreKit.
- Do not add subscription, paywall purchase, quota purchase, or receipt logic.
- Do not add real secrets, API keys, Firebase keys, Google keys, Apple credentials, Apple Team IDs, provisioning profiles, private bundle identifiers, or `GoogleService-Info.plist`.
- If external settings are needed, add placeholders and TODO notes only.
- Do not delete or rewrite existing Phase 00 or Phase 01 files.
- Do not claim Xcode build success unless it was actually verified on macOS with Xcode.

## Suggested files to create or modify

Base all work on the actual repo structure. Do not assume paths that are not present.

Preferred path if a real project can be generated safely:

```text
ios-app/AIPhotoApp.xcodeproj/
```

Existing source files that should be connected to the app target:

```text
ios-app/AIPhotoApp/
```

Fallback documentation path if `.xcodeproj` generation is not reliable:

```text
ios-app/XCODE_SETUP.md
```

Existing files that may be updated if needed:

```text
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Do not modify other files unless a very small documentation change is necessary for Phase 01.5.

## Technical requirements

- The app target should be an iOS app target.
- Use Swift and SwiftUI.
- Use the SwiftUI app lifecycle with `AIPhotoApp.swift` as the app entry point.
- Minimum deployment target should be iOS 17 or later, matching the project documentation.
- Keep the implementation dependency-free for this phase.
- Do not add Firebase, Google Sign-In, StoreKit, AVFoundation capture, PhotosUI picker, AI SDKs, or third-party packages.
- Use a placeholder bundle identifier if a bundle identifier is required, such as `com.example.AIPhotoApp`, and document that it must be changed by the app owner.
- Do not configure a real Apple Development Team.
- Do not add signing credentials or provisioning profiles.
- Ensure all existing Swift files under `ios-app/AIPhotoApp/` are members of the app target.
- Ensure localization files under `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings` and `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings` are included as resources.
- Preserve the existing Phase 01 UI behavior:
  - root app entry
  - intro/auth-gate placeholder UI
  - Home / History / Settings tabs
  - design system tokens and components
  - placeholder CTAs only
- If running on Windows or another environment without Xcode, do not pretend that Xcode build or Preview was verified.

## If `.xcodeproj` cannot be generated reliably

If Codex cannot reliably create a valid Xcode project in the current environment:

- Do not hand-write a fragile or invalid `.xcodeproj`.
- Do not commit a project file that was not verified enough to be useful.
- Create `ios-app/XCODE_SETUP.md`.
- In `ios-app/XCODE_SETUP.md`, document the manual Xcode setup steps clearly:
  - Open Xcode on macOS.
  - Create a new project.
  - Choose iOS App.
  - Use Swift as language.
  - Use SwiftUI as interface.
  - Use the SwiftUI app lifecycle.
  - Set minimum deployment target to iOS 17 or later.
  - Use a placeholder bundle identifier until the owner chooses the real one.
  - Do not add a real Apple Team ID unless the owner does it locally.
  - Remove any duplicate template app entry file if it conflicts with `ios-app/AIPhotoApp/AIPhotoApp.swift`.
  - Add the existing `ios-app/AIPhotoApp/` folder/files to the Xcode project.
  - Check target membership for all Swift files.
  - Add `Resources/Localization/en.lproj/Localizable.strings` and `Resources/Localization/zh-Hant.lproj/Localizable.strings` to the target resources.
  - Open `AppRootView` or `MainTabShellView` in Xcode Preview.
  - Run the app in an iOS Simulator.
- Record in `docs/phase-log.md` that the fallback documentation was created and that `.xcodeproj` creation remains a local macOS/Xcode TODO.

## Acceptance criteria

One of the following must be true:

- A real `ios-app/AIPhotoApp.xcodeproj/` exists, opens in Xcode, includes the existing `ios-app/AIPhotoApp/` Swift files and localization resources in the app target, and Phase 01 UI can be checked in Xcode Preview or Simulator.
- Or `ios-app/XCODE_SETUP.md` exists and gives clear, step-by-step manual Xcode setup instructions because project generation was not reliable in the current environment.

In both cases:

- Phase 01 source files are preserved.
- No Auth implementation is added.
- No Camera implementation is added.
- No Firebase upload implementation is added.
- No AI implementation is added.
- No StoreKit implementation is added.
- No real secrets, API keys, Apple credentials, Firebase keys, Google keys, provisioning profiles, or `GoogleService-Info.plist` are added.
- `ios-app/README.md` is accurate for the resulting state.
- `tests/manual-smoke-tests.md` includes or references Phase 01.5 manual Xcode checks if new checks are needed.
- `docs/phase-log.md` records the Phase 01.5 result, changed files, verification, known TODOs, and whether the repo is ready for Phase 02.

## Manual Xcode check steps

When macOS and Xcode are available, manually check:

1. Open `ios-app/AIPhotoApp.xcodeproj` in Xcode, or follow `ios-app/XCODE_SETUP.md` to create the project manually.
2. Confirm the app target is an iOS target using Swift and SwiftUI.
3. Confirm the deployment target is iOS 17 or later.
4. Confirm all Swift files under `ios-app/AIPhotoApp/` have target membership enabled.
5. Confirm the localization files are included in the app target resources.
6. Confirm no duplicate `@main` app entry conflicts with `AIPhotoApp.swift`.
7. Open `AppRootView` or `MainTabShellView` in Xcode Preview.
8. Build the app.
9. Run the app in an iOS Simulator.
10. Confirm the Phase 01 UI renders:
    - intro/auth-gate placeholder screen
    - Home tab
    - History tab
    - Settings tab
    - disabled or placeholder CTAs only
11. Confirm dark and light mode still render acceptably.
12. Confirm English and Traditional Chinese localization files are present.
13. Confirm no Auth, Camera, Firebase upload, AI, or StoreKit behavior was added.

If these checks cannot be run because the environment is not macOS with Xcode, document that clearly in `docs/phase-log.md` and in the final response.

## Completion requirement

Before finishing Phase 01.5, update `docs/phase-log.md`.

The Phase 01.5 log entry must include:

- status
- date started / completed
- summary
- whether a real `.xcodeproj` was created or `ios-app/XCODE_SETUP.md` fallback was used
- changed files
- tests or manual checks
- checks that could not be run
- known TODOs
- ready for Phase 02: yes/no

Do not mark Phase 02 started.

## Final response format

When Phase 01.5 is executed, finish with:

- changed files
- how to test
- known TODOs
- ready for Phase 02: yes/no

