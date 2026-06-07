# Phase Log

This file records the progress of each development phase.

Every Codex task must update this file before finishing.

---

## Current Status

Current phase: Phase 02 - Auth
Status: Completed as source scaffold / mock-only Auth
Next phase: Phase 03 - Camera + Photo Picker, after Phase 02 is reviewed and a Mac/Xcode check is completed or explicitly deferred

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
- [ ] Xcode build not run because this environment is Windows without a verified `.xcodeproj`.
- [ ] Xcode Preview not run because this environment is Windows without a verified `.xcodeproj`.
- [ ] iOS Simulator not run because this environment is Windows without a verified `.xcodeproj`.

### Known TODOs

- On macOS, complete or verify `ios-app/AIPhotoApp.xcodeproj`.
- Add Phase 02 Auth Swift files to the real Xcode target.
- Add Firebase Apple SDK packages only after the Xcode project is verified.
- Keep `GoogleService-Info.plist` local-only and out of git.
- Configure Firebase Console Email/Password, Google, and Apple providers outside the repo.
- Configure Google reversed client ID URL scheme locally in Xcode.
- Configure Sign in with Apple capability in Apple Developer and Xcode.
- Implement real Firebase Auth only after dependencies and local config are ready.
- Implement backend account/data deletion in the later privacy/deletion phase.
- Confirm Gemini/public consumer 18+ and minors risk before public AI release.

### `.xcodeproj` Status

No `.xcodeproj` exists in the repo.

### Xcode Build / Simulator

Not run.

### Ready for Phase 03

No. Phase 02 source scaffold is complete, but Mac/Xcode target membership and build checks have not been run.

### Notes

Use placeholders and TODOs for manual Firebase Console / Apple Developer setup. Do not invent real credentials.

Do not mark Phase 03 started from Phase 02.

---

## Phase 03 - Camera + Photo Picker

Status: Not started

### Goal

Implement AVFoundation single-photo camera flow and PhotosPicker / PHPicker single-image import flow.

### Notes

Do not implement Firebase upload, AI analysis, filters, or history in this phase.

---

## Phase 04 - Filter Presets

Status: Not started

### Goal

Implement Core Image filter pipeline and at least 3 local retro film presets.

### Notes

Do not implement half-frame, double exposure, or advanced camera library as MVP requirements.

---

## Phase 05 - Firebase Storage + Firestore

Status: Not started

### Goal

Implement Firebase Storage upload and Firestore metadata persistence for photos.

### Notes

Do not store image binary data in Firestore.

---

## Phase 06 - AI AnalyzePhoto Cloud Function

Status: Not started

### Goal

Implement Cloud Functions server-side AI proxy, provider adapter, mock provider, GeminiAnalyzer, schema validation, and analyzePhoto callable function.

### Notes

Do not put AI API keys in the iOS app. Real provider keys should use server-side secret management.

---

## Phase 07 - AI Result UI

Status: Not started

### Goal

Implement AI result UI for short summary, up to 3 actionable advice items, and adjustment suggestions.

### Notes

Do not implement full VIP chat in MVP.

---

## Phase 08 - Quota System

Status: Not started

### Goal

Implement free 20 starter analysis credits, daily login +1, free 20-photo storage limit, and quota UI.

### Notes

Quota enforcement should not rely only on client-side logic.

---

## Phase 09 - Subscription + Paywall

Status: Not started

### Goal

Implement StoreKit 2 subscription scaffolding, local `.storekit` testing, PaywallView, and entitlement state.

### Notes

RevenueCat is not the MVP default. Do not lock basic camera behind VIP.

---

## Phase 10 - History + Delete + Local Download

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
