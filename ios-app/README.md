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

There is no checked-in `.xcodeproj` yet. On macOS with Xcode, create a new iOS SwiftUI app target and add the files under `ios-app/AIPhotoApp/` to that target.

Suggested target settings:

- Platform: iOS
- UI framework: SwiftUI
- Minimum iOS version: iOS 17 or later
- Localization: English and Traditional Chinese

Do not add real `GoogleService-Info.plist` to git.

The real Firebase, Auth, Camera, AI, and StoreKit integrations should be added only in their later phases.
