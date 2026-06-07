# Phase 02: Auth

## Phase name

Phase 02 - Auth

## Goal

Create the Auth UI and service scaffold for the iOS-first AI Support Retro Camera app.

This phase should prepare email/password, Google login, Sign in with Apple, guest/try-mode UI state, sign-out UI, and account deletion entry scaffolding. It should also document all required Firebase Console, Google, and Apple Developer setup steps as TODOs/placeholders.

This phase must not pretend that real Firebase Auth is complete if the repo still does not contain a real Xcode project or configured Firebase credentials.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/05-firebase-storage-firestore-functions.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- ios-app/README.md
- docs/prompts/phase-02-auth.md

## Current status

- Phase 00 is completed.
- Phase 01 is completed.
- Current iOS scaffold exists under `ios-app/AIPhotoApp/`.
- Current iOS scaffold is SwiftUI source only.
- Current repo may not contain a real `.xcodeproj`.
- Current repo must be checked for `.xcodeproj` before implementation.
- `ios-app/README.md` currently says there is no checked-in `.xcodeproj` yet.
- Auth is not implemented.
- Firebase Apple SDK is not configured.
- No real `GoogleService-Info.plist` is committed, and it must stay that way.
- Phase 02 is the next phase and is explicitly allowed by `docs/phase-log.md`.

## Required first check

At the start of Phase 02 implementation, run:

```powershell
Get-ChildItem -Recurse -Filter '*.xcodeproj'
```

Then:

- If a real `.xcodeproj` exists, update only the source files and docs needed for Phase 02. Do not assume package dependencies are already configured unless the project files prove it.
- If no `.xcodeproj` exists, create Auth UI/service scaffold source files only. Do not claim build, simulator, Firebase Auth, Google Sign-In, or Sign in with Apple works.
- If no `.xcodeproj` exists, record an Xcode project setup TODO in `docs/phase-log.md`.

## This phase only does

- Work on Phase 02 Auth only.
- Add Auth UI scaffold under the existing `ios-app/AIPhotoApp/` tree.
- Add email/password form UI scaffold.
- Add Google login button row scaffold.
- Add Apple login button row scaffold.
- Add local Auth state model / view model scaffold.
- Add Auth service protocol and mock Auth service.
- Add placeholder Firebase Auth service file only if it contains no real credentials and no false claims.
- Add Settings sign-out and delete-account entry placeholders if needed.
- Add manual setup TODO documentation for:
  - Firebase Console Auth providers
  - Email/password provider
  - Google provider
  - Sign in with Apple provider
  - Apple Developer capability
  - Google reversed client ID URL scheme
  - `GoogleService-Info.plist` local-only handling
- Add localization keys for Auth UI in existing `en` and `zh-Hant` localization files.
- Add manual test checklist entries for Phase 02.
- Update `docs/phase-log.md` before finishing Phase 02 implementation.

## This phase does not do

- Do not do Camera.
- Do not do PhotosPicker / PHPicker.
- Do not do Firebase Storage upload.
- Do not do Firestore photo metadata.
- Do not do AI.
- Do not do Cloud Functions AI proxy.
- Do not do StoreKit.
- Do not do subscription/paywall logic.
- Do not do quota enforcement.
- Do not do real account deletion backend.
- Do not do Firebase Storage rules changes unless strictly needed for Auth documentation.
- Do not add true Firebase keys.
- Do not add true Google keys.
- Do not add Apple credentials.
- Do not add real Firebase project IDs.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`, `.firebaserc`, production plist files, private keys, or OAuth secrets.
- Do not add paid external service connections.
- Do not start Phase 03.
- Do not delete or rewrite Phase 00 / Phase 01 files unrelated to Auth.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new files:

```text
ios-app/AIPhotoApp/Features/Auth/AuthView.swift
ios-app/AIPhotoApp/Features/Auth/EmailAuthForm.swift
ios-app/AIPhotoApp/Features/Auth/AppleSignInButtonRow.swift
ios-app/AIPhotoApp/Features/Auth/GoogleSignInButtonRow.swift
ios-app/AIPhotoApp/Features/Auth/AuthViewModel.swift
ios-app/AIPhotoApp/Features/Auth/AuthMode.swift
ios-app/AIPhotoApp/Models/AuthUser.swift
ios-app/AIPhotoApp/Models/AuthProviderID.swift
ios-app/AIPhotoApp/Services/Auth/AuthService.swift
ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift
ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift
ios-app/AIPhotoApp/Services/Auth/AuthSetupTODO.md
```

Suggested existing files to modify:

```text
ios-app/AIPhotoApp/App/AppRootView.swift
ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Only modify the files needed for Auth scaffold. Keep changes small and reviewable.

## Technical requirements

- Use Swift + SwiftUI source files.
- Keep Auth UI usable as a scaffold with local/mock state.
- Use dependency injection through an `AuthService` protocol so real Firebase Auth can be connected later without rewriting UI.
- `MockAuthService` may simulate sign-in, sign-out, and error states locally.
- `FirebaseAuthService` may be a non-operational placeholder if dependencies are unavailable.
- If Firebase SDK is not available, do not import Firebase modules in files that need to compile without dependencies.
- If using placeholder imports or conditional compilation, clearly mark them with TODO comments.
- Google login row must be UI scaffold only unless real dependencies and Xcode setup exist.
- Apple login row must be UI scaffold only unless real Xcode capability and dependencies exist.
- If Google login is shown, Apple login must also be shown in the same Auth UI.
- Include guest/try-mode UI copy, but do not implement anonymous Firebase Auth in this phase unless explicitly requested later.
- Account deletion entry should be visible as a placeholder in Settings, but real deletion backend belongs to later privacy/deletion phases.
- Do not store secrets in the iOS app.
- Do not include Gemini or OpenAI API key paths.
- Do not add real `GoogleService-Info.plist`; document that it is local-only and gitignored.

## Privacy and App Store requirements

- Auth UI must not force login before all future basic camera/basic filter use. Login should be framed as needed for sync, cloud history, quota, or account features.
- If Google login exists, Sign in with Apple must be present.
- Account deletion entry must be findable in Settings as a placeholder.
- Do not claim account deletion is complete unless backend deletion is implemented.
- Do not collect or request unnecessary data in the scaffold.
- Add copy/TODOs for Privacy Policy and Terms links, but do not invent final URLs.
- If a future production app uses Gemini Developer API, document that 18+ / minors risk must be confirmed before public release.

## Acceptance criteria

- `docs/prompts/phase-02-auth.md` has been read and followed.
- The implementation checks whether `.xcodeproj` exists before making Auth assumptions.
- If no `.xcodeproj` exists, Auth scaffold files are created but build/simulator success is not claimed.
- Auth UI scaffold exists with:
  - email/password form
  - Google sign-in row
  - Apple sign-in row
  - guest/try-mode messaging
  - loading/error state placeholders
- Auth service protocol and mock service exist.
- Real Firebase/Google/Apple credential setup is documented as TODO/placeholders only.
- `GoogleService-Info.plist` is not added.
- No Firebase key, Google key, Apple credential, OAuth secret, project ID, or private key is added.
- No Camera, Storage upload, AI, StoreKit, or Phase 03 work is added.
- Settings contains sign-out and account deletion placeholders if touched.
- Existing localization includes Auth strings in `en` and `zh-Hant`.
- `ios-app/README.md` explains Phase 02 Auth scaffold and manual setup notes.
- `tests/manual-smoke-tests.md` includes Phase 02 checks.
- `docs/phase-log.md` records Phase 02 status, changed files, checks, known TODOs, and readiness for Phase 03.

## Tests / manual check

Run or perform:

- `git status --short` to review changed files.
- `Get-ChildItem -Recurse -Filter '*.xcodeproj'` to verify whether a real Xcode project exists.
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, or real credential files were added.
- Confirm Auth files do not contain real Firebase project ID, Google client ID, Apple Team ID, private key, or API key.
- Confirm Google login UI and Apple login UI appear together.
- Confirm mock email/password sign-in state can be reasoned through in previews or SwiftUI local state.
- Confirm sign-out is mock/local only unless real dependencies exist.
- Confirm account deletion entry is a placeholder and does not claim backend deletion is complete.
- Confirm no imports or dependencies for Camera, PhotosUI, Firebase Storage, AI, or StoreKit were added.
- If running on Windows without Xcode, document that compile/simulator verification was not performed.
- If running on macOS with Xcode and a project exists, manually build and preview Auth UI.

## Completion requirement

Before finishing Phase 02 implementation, update `docs/phase-log.md`.

The Phase 02 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether `.xcodeproj` exists
- whether Xcode build/simulator was run
- ready for Phase 03: yes/no

Do not mark Phase 03 started.
