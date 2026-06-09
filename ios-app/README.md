# iOS App

This folder contains the Swift + SwiftUI iOS app scaffold.

Planned stack:

- Swift
- SwiftUI
- AVFoundation
- PhotosPicker / PHPicker
- Core Image
- Vision
- Firebase Apple SDK
- StoreKit 2

## Phase 01 Scaffold

Phase 01 adds a dependency-free SwiftUI source scaffold under:

```text
ios-app/AIPhotoApp/
```

Current Phase 01 files include:

- `AIPhotoApp.swift`
- `App/AppRootView.swift`
- `App/MainTabShellView.swift`
- `DesignSystem/Tokens/`
- `DesignSystem/Components/`
- `Features/Home/HomeView.swift`
- `Features/History/HistoryView.swift`
- `Features/Settings/SettingsView.swift`
- `Models/`
- `Resources/Localization/en.lproj/Localizable.strings`
- `Resources/Localization/zh-Hant.lproj/Localizable.strings`

The Phase 01 scaffold started as UI-only:

- Auth is not implemented.
- Camera is implemented later as a local-only Phase 03 scaffold.
- Firebase upload is not implemented.
- AI is not implemented.
- StoreKit is not implemented.

## Xcode Notes

There is a checked-in `.xcodeproj` at:

```text
ios-app/AIPhotoApp.xcodeproj
```

Phase 01.5 documents the manual Xcode setup path in `ios-app/XCODE_SETUP.md`. The Phase 01/02 Mac/Xcode build succeeded on 2026-06-09, and the Phase 03 command-line Xcode simulator build also succeeded.

Suggested target settings:

- Platform: iOS
- UI framework: SwiftUI
- Minimum iOS version: iOS 17 or later
- Localization: English and Traditional Chinese

Do not add real `GoogleService-Info.plist` to git.

The real Firebase, AI, and StoreKit integrations should be added only in their later phases.

## Phase 01.5 Xcode Setup

Phase 01.5 did not generate a `.xcodeproj` from this Windows environment because it could not be reliably verified in Xcode.

Use `ios-app/XCODE_SETUP.md` on macOS to:

- create the real iOS SwiftUI Xcode project
- place the project at `ios-app/AIPhotoApp.xcodeproj`
- add the existing `ios-app/AIPhotoApp/` Swift files to the app target
- add the English and Traditional Chinese localization files to the target resources
- verify `AppRootView` / `MainTabShellView` previews and simulator rendering

Do not start Phase 02 Auth work until the Xcode setup path has been completed or explicitly accepted as a documentation-only fallback.

## Phase 02 Auth Scaffold

Phase 02 adds dependency-free Auth UI and service scaffolding under:

```text
ios-app/AIPhotoApp/Features/Auth/
ios-app/AIPhotoApp/Services/Auth/
```

Current Phase 02 Auth files include:

- `AuthView.swift`
- `EmailAuthForm.swift`
- `GoogleSignInButtonRow.swift`
- `AppleSignInButtonRow.swift`
- `AuthViewModel.swift`
- `AuthMode.swift`
- `AuthService.swift`
- `MockAuthService.swift`
- `FirebaseAuthService.swift`
- `AuthSetupTODO.md`

The current Auth scaffold is intentionally local/mock only:

- Email/password validation is simulated by `MockAuthService`.
- Google login is a UI row plus mock provider state.
- Sign in with Apple is a UI row plus mock provider state.
- Guest try mode is local-only.
- Settings includes mock sign-out and account deletion placeholders.
- `FirebaseAuthService` is a non-operational placeholder with TODOs.

The Xcode project now exists and Phase 01/02 build verification has passed. Firebase Auth, Google Sign-In, and Sign in with Apple remain mock/placeholders until real provider setup is explicitly requested.

Do not add real `GoogleService-Info.plist`, Firebase keys, Google keys, Apple credentials, API keys, `.env`, or production plist files to git. Complete `ios-app/AIPhotoApp/Services/Auth/AuthSetupTODO.md` and `ios-app/XCODE_SETUP.md` on macOS before wiring real providers.

## Phase 03 Camera + Photo Picker Scaffold

Phase 03 adds a local-only Camera + Photo Picker scaffold under:

```text
ios-app/AIPhotoApp/Features/Camera/
```

Current Phase 03 Camera files include:

- `CameraView.swift`
- `CameraViewModel.swift`
- `CameraPermissionState.swift`
- `CameraCaptureService.swift`
- `CameraPreviewView.swift`
- `PhotoPickerView.swift`
- `SelectedPhotoPreview.swift`
- `CapturedPhoto.swift`

The current Camera scaffold is intentionally local-only:

- AVFoundation is used for camera permission, preview, and single-photo capture scaffolding.
- PhotosPicker is used for one-image library import.
- Captured or imported images are kept in memory only.
- Home can open the Camera scaffold.
- Camera and photo-library usage description placeholders are set in the Xcode project.
- Command-line Xcode simulator build succeeded.

This phase does not add filters, Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions AI proxy, StoreKit, quota enforcement, history persistence, secrets, credentials, API keys, or `GoogleService-Info.plist`.

## Phase 04 Local Filter Presets

Phase 04 adds a local-only Core Image filter scaffold under:

```text
ios-app/AIPhotoApp/Features/Filters/
```

Current Phase 04 Filter files include:

- `FilterPreset.swift`
- `FilterPresetCatalog.swift`
- `FilterPipeline.swift`
- `FilterPreviewView.swift`
- `FilterPresetSelectorView.swift`
- `FilteredPhotoPreview.swift`

The current Filter scaffold is intentionally local-only:

- Core Image renders basic retro previews on device.
- Presets are data-driven in `FilterPresetCatalog`.
- Available presets include Original, Classic Film, Warm Vintage, and Faded Chrome.
- Captured or imported images remain in memory only.
- Filtered previews remain in memory only.
- The Continue placeholder remains disabled and does not start upload, AI, StoreKit, quota, export, or history behavior.

This phase does not add Firebase Storage upload, Firestore metadata, AI analysis, Cloud Functions, StoreKit, subscription/paywall logic, quota enforcement, history persistence, export/save to Photos, half-frame, double exposure, full camera/lens library, paid presets, secrets, credentials, API keys, Firebase project IDs, Apple credentials, Google credentials, or `GoogleService-Info.plist`.

## Phase 05 Firebase Storage / Firestore Save Scaffold

Phase 05 adds a mock-only save scaffold under:

```text
ios-app/AIPhotoApp/Services/PhotoStorage/
```

Current Phase 05 storage files include:

- `SavedPhoto.swift`
- `PhotoSaveState.swift`
- `PhotoSaveService.swift`
- `MockPhotoSaveService.swift`
- `FirebasePhotoSaveService.swift`
- `PhotoStoragePath.swift`

The current save scaffold is intentionally mock-only:

- `PhotoSaveService` defines the save contract.
- `MockPhotoSaveService` returns local mock metadata for success and failure checks.
- `FirebasePhotoSaveService` is a placeholder/TODO and does not import Firebase.
- Storage paths are drafted as `users/{ownerId}/photos/{photoId}/preview.jpg` and `thumb.jpg`.
- Firestore document shape is drafted as `users/{ownerId}/photos/{photoId}` metadata.
- Save UI appears after the filtered preview.
- Mock save success / failure states are visible.
- History remains an honest placeholder and does not persist saved photos.

This phase does not add a real `GoogleService-Info.plist`, Firebase project ID, `.env`, `.firebaserc`, API keys, private keys, OAuth secrets, Apple credentials, production Firebase upload, production Firestore writes, Firebase imports, AI analysis, Cloud Functions, StoreKit, subscription/quota logic, history persistence, export/save to Photos, public sharing, account deletion backend, or Phase 06 work.
