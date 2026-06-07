# Phase 02 Auth Setup TODO

This repo currently has no verified `.xcodeproj`, no Firebase Apple SDK setup, and no local credential plist.

Phase 02 only adds dependency-free Auth UI and service scaffolding. Do not commit real secrets or provider credentials.

## Firebase Console

- TODO: Create or select the Firebase project outside this repo.
- TODO: Enable Firebase Authentication.
- TODO: Enable Email/Password provider.
- TODO: Enable Google provider.
- TODO: Enable Apple provider.
- TODO: Confirm App Check strategy before production rollout.

## iOS / Xcode

- TODO: Complete `ios-app/XCODE_SETUP.md` on macOS.
- TODO: Add Firebase Apple SDK packages to the verified Xcode project.
- TODO: Add Firebase Auth dependency only after the project opens and builds.
- TODO: Keep `GoogleService-Info.plist` local-only and out of git.
- TODO: Add `REVERSED_CLIENT_ID` URL scheme locally in Xcode after downloading the real plist.

## Google Sign-In

- TODO: Configure OAuth client IDs in Firebase / Google Cloud.
- TODO: Add Google Sign-In iOS SDK only after package setup is verified.
- TODO: Test cancelled login, failed login, and provider-linking later.

## Sign in with Apple

- TODO: Enable Sign in with Apple capability in the Apple Developer account.
- TODO: Add the Xcode target capability.
- TODO: Configure Apple provider in Firebase Auth.
- TODO: Implement nonce handling and token revocation in a later verified integration pass.

## Account Deletion

- TODO: Keep Settings deletion entry visible.
- TODO: Implement real backend account/data deletion in the later privacy/deletion phase.
- TODO: Include an Apple subscription cancellation warning when StoreKit is implemented.
