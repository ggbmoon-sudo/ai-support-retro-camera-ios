# Manual Smoke Tests

## Phase 00

Check:

- [x] README.md exists.
- [x] AGENTS.md exists.
- [x] docs/ folder exists.
- [x] docs/phase-log.md exists.
- [x] docs/prompts/ folder exists.
- [x] ios-app/ placeholder exists.
- [x] functions/ placeholder exists.
- [x] firebase/ placeholder exists.
- [x] scripts/ placeholder exists.
- [x] .gitignore exists.
- [x] .env.example exists.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

## Phase 01

Check:

- [x] `docs/prompts/phase-01-design-navigation.md` is expanded into a full construction prompt.
- [x] `ios-app/AIPhotoApp/` source scaffold exists.
- [x] SwiftUI app entry exists.
- [x] Root navigation shell exists.
- [x] Home / History / Settings placeholder views exist.
- [x] Design system token files exist.
- [x] Reusable UI components exist.
- [x] Placeholder UI models exist.
- [x] English localization file exists.
- [x] Traditional Chinese localization file exists.
- [x] No Auth implementation was added.
- [x] No Camera implementation was added.
- [x] No Firebase upload implementation was added.
- [x] No AI implementation was added.
- [x] No StoreKit implementation was added.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [ ] Create or open an iOS SwiftUI Xcode target.
- [ ] Add files under `ios-app/AIPhotoApp/` to the target.
- [ ] Add the localization files to the target.
- [ ] Build the target.
- [ ] Preview or run `AppRootView`.
- [ ] Confirm the intro placeholder can enter the Home / History / Settings tab shell.
- [ ] Confirm dark and light mode are readable.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.

## Phase 02

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo during Phase 02 setup.
- [x] Added Auth UI scaffold under `ios-app/AIPhotoApp/Features/Auth/`.
- [x] Added mockable Auth service protocol under `ios-app/AIPhotoApp/Services/Auth/`.
- [x] Added `MockAuthService` for local email/password, Google, Apple, guest, and sign-out state.
- [x] Added `FirebaseAuthService` placeholder without importing Firebase SDKs.
- [x] Added visible Google and Apple sign-in rows together.
- [x] Added guest/try-mode copy and local mock flow.
- [x] Added Settings sign-out and account deletion placeholders.
- [x] Added Phase 02 Auth setup TODO notes.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase Storage upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual source review without Mac:

- [ ] Open `ios-app/AIPhotoApp/Features/Auth/AuthView.swift` and confirm email/password, Google, Apple, and guest options are present.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/AuthService.swift` and confirm UI depends on a protocol.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/MockAuthService.swift` and confirm mock sign-in/sign-out state is local only.
- [ ] Open `ios-app/AIPhotoApp/Services/Auth/FirebaseAuthService.swift` and confirm it has TODOs but no Firebase imports.
- [ ] Confirm `GoogleService-Info.plist`, `.env`, `.firebaserc`, production plist files, private keys, OAuth secrets, Firebase project IDs, and API keys were not added.
- [ ] Confirm source files do not import AVFoundation, PhotosUI, Firebase Storage, AI SDKs, or StoreKit for Phase 02.

Manual Xcode check on macOS later:

- [ ] Follow `ios-app/XCODE_SETUP.md` and create or open a verified `.xcodeproj`.
- [ ] Add all Phase 02 Auth Swift files to the app target.
- [ ] Build the target.
- [ ] Preview `AuthView`.
- [ ] Run the app and confirm intro can continue to Auth.
- [ ] Test mock email/password sign-in with a valid email and at least 6 password characters.
- [ ] Test invalid email and short password error states.
- [ ] Test mock Google sign-in row.
- [ ] Test mock Apple sign-in row.
- [ ] Test guest try mode.
- [ ] Test Settings mock sign-out returns to Auth.
- [ ] Confirm account deletion entry is visible but does not claim backend deletion is complete.

## Phase 01.5

Check:

- [x] Confirmed no `.xcodeproj` exists in the current repo.
- [x] Confirmed the current environment cannot reliably verify an Xcode project.
- [x] Added `ios-app/XCODE_SETUP.md` instead of generating an unverified `.xcodeproj`.
- [x] Documented how to create `ios-app/AIPhotoApp.xcodeproj` on macOS.
- [x] Documented how to add existing `ios-app/AIPhotoApp/` Swift files to the app target.
- [x] Documented how to add `en.lproj` and `zh-Hant.lproj` localization files to target resources.
- [x] Confirmed no Auth implementation was added.
- [x] Confirmed no Camera implementation was added.
- [x] Confirmed no Firebase upload implementation was added.
- [x] Confirmed no AI implementation was added.
- [x] Confirmed no StoreKit implementation was added.
- [x] Confirmed no real API keys are committed.
- [x] Confirmed no real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [ ] Follow `ios-app/XCODE_SETUP.md`.
- [ ] Create or open `ios-app/AIPhotoApp.xcodeproj`.
- [ ] Confirm all Swift files under `ios-app/AIPhotoApp/` are in the app target.
- [ ] Confirm `ios-app/AIPhotoApp/AIPhotoApp.swift` is the only `@main` entry.
- [ ] Confirm localization resources are copied into the app bundle.
- [ ] Build the target.
- [ ] Preview `AppRootView`.
- [ ] Preview `MainTabShellView`.
- [ ] Run the app in an iOS Simulator.
- [ ] Confirm Home / History / Settings render.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.
