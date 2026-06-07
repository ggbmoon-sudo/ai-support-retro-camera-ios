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

The current scaffold is intentionally UI-only:

- Auth is not implemented.
- Camera is not implemented.
- Firebase upload is not implemented.
- AI is not implemented.
- StoreKit is not implemented.

## Xcode Notes

There is no checked-in `.xcodeproj` yet. Phase 01.5 documents the manual Xcode setup path in:

```text
ios-app/XCODE_SETUP.md
```

On macOS with Xcode, create a new iOS SwiftUI app target and add the files under `ios-app/AIPhotoApp/` to that target.

Suggested target settings:

- Platform: iOS
- UI framework: SwiftUI
- Minimum iOS version: iOS 17 or later
- Localization: English and Traditional Chinese

Do not add real `GoogleService-Info.plist` to git.

The real Firebase, Auth, Camera, AI, and StoreKit integrations should be added only in their later phases.

## Phase 01.5 Xcode Setup

Phase 01.5 did not generate a `.xcodeproj` from this Windows environment because it could not be reliably verified in Xcode.

Use `ios-app/XCODE_SETUP.md` on macOS to:

- create the real iOS SwiftUI Xcode project
- place the project at `ios-app/AIPhotoApp.xcodeproj`
- add the existing `ios-app/AIPhotoApp/` Swift files to the app target
- add the English and Traditional Chinese localization files to the target resources
- verify `AppRootView` / `MainTabShellView` previews and simulator rendering

Do not start Phase 02 Auth work until the Xcode setup path has been completed or explicitly accepted as a documentation-only fallback.
