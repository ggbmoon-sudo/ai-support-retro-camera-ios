# Xcode Setup

Phase 01.5 does not add a generated `.xcodeproj` because this repository is currently being worked on from a Windows environment where Xcode project generation and verification cannot be done reliably.

Do not hand-write a `.xcodeproj` unless it can be opened and verified in Xcode. Use this guide on macOS to create the real iOS SwiftUI project and connect the existing Phase 01 source files.

## Goal

Create an iOS SwiftUI app target that uses the existing source files in:

```text
ios-app/AIPhotoApp/
```

The target should let you preview or run the Phase 01 UI:

- `AppRootView`
- `MainTabShellView`
- Home tab
- History tab
- Settings tab

This setup must not add Auth, Camera, Firebase upload, AI, StoreKit, real secrets, API keys, Apple credentials, or `GoogleService-Info.plist`.

## Recommended Project Shape

Preferred checked-in project path after manual setup:

```text
ios-app/AIPhotoApp.xcodeproj/
```

Existing source path to add to the target:

```text
ios-app/AIPhotoApp/
```

Keep the Swift source files in their existing folder. Do not move them into a new Xcode-generated source folder unless you intentionally update the repo structure and document the change.

## Create The Project

On macOS with Xcode installed:

1. Open Xcode.
2. Choose **File > New > Project...**.
3. Select **iOS > App**.
4. Use these project settings:
   - Product Name: `AIPhotoApp`
   - Team: `None` or your local development team only
   - Organization Identifier: placeholder such as `com.example`
   - Bundle Identifier: placeholder such as `com.example.AIPhotoApp`
   - Interface: `SwiftUI`
   - Language: `Swift`
   - Testing System: choose the Xcode default
   - Storage: `None`
5. Save the temporary project somewhere outside this repo, for example Desktop.
6. Close Xcode.
7. Copy or move only the generated `AIPhotoApp.xcodeproj` into:

```text
ios-app/AIPhotoApp.xcodeproj
```

8. Reopen `ios-app/AIPhotoApp.xcodeproj` in Xcode.
9. Remove template file references from the project navigator, such as:
   - `AIPhotoAppApp.swift`
   - `ContentView.swift`

Choose **Remove References** unless you are deleting only temporary files outside this repo.

## Add Existing Files To Target

In Xcode:

1. Right-click the project navigator.
2. Choose **Add Files to "AIPhotoApp"...**.
3. Select the existing folder:

```text
ios-app/AIPhotoApp/
```

4. Use these options:
   - Destination: uncheck **Copy items if needed**
   - Added folders: **Create groups**
   - Add to targets: check the `AIPhotoApp` app target
5. Confirm these Swift files appear under **Build Phases > Compile Sources**:
   - `AIPhotoApp.swift`
   - `AppRootView.swift`
   - `MainTabShellView.swift`
   - `HomeView.swift`
   - `HistoryView.swift`
   - `SettingsView.swift`
   - all files under `DesignSystem/`
   - all files under `Models/`
6. Confirm there is only one `@main` app entry:

```text
ios-app/AIPhotoApp/AIPhotoApp.swift
```

## Add Localization Resources

The existing localization files are:

```text
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
```

In Xcode:

1. Select the project.
2. Open the app target settings.
3. In **Info > Localizations**, add:
   - English
   - Chinese, Traditional
4. Confirm both `Localizable.strings` files are included in the target.
5. Confirm they appear under **Build Phases > Copy Bundle Resources**.

If Xcode does not automatically treat them as localized variants, remove the resource references and re-add the `en.lproj` and `zh-Hant.lproj` folders so the final app bundle contains:

```text
en.lproj/Localizable.strings
zh-Hant.lproj/Localizable.strings
```

## Target Settings

Use these minimum settings:

- Platform: iOS
- Minimum deployment target: iOS 17.0 or later
- Swift language version: Xcode default
- Interface: SwiftUI
- App lifecycle: SwiftUI app lifecycle
- Signing team: local placeholder only until the app owner configures a real Apple Developer team
- Bundle identifier: placeholder only until the app owner chooses the real identifier

Do not add:

- real Apple Team ID
- provisioning profiles
- Firebase project configuration
- `GoogleService-Info.plist`
- Gemini key
- OpenAI key
- other API keys or secrets

## Phase 01 UI Check

After the files are added:

1. Open `ios-app/AIPhotoApp/App/AppRootView.swift`.
2. Open the canvas.
3. Resume the preview for `AppRootView`.
4. Open `ios-app/AIPhotoApp/App/MainTabShellView.swift`.
5. Resume the preview for `MainTabShellView`.
6. Build the app.
7. Run the app in an iOS Simulator.
8. Confirm the intro placeholder appears.
9. Tap the continue action to enter the tab shell.
10. Confirm these tabs render:
    - Home
    - History
    - Settings
11. Confirm placeholder CTAs do not start Auth, Camera, Firebase upload, AI, or StoreKit behavior.
12. Check light and dark appearance.
13. Check English and Traditional Chinese localization resources are present.

## Expected Phase Boundaries

Phase 01.5 is only Xcode setup.

Do not implement:

- Phase 02 Auth
- Camera
- Firebase Storage upload
- AI
- StoreKit
- real credentials or secrets

## Troubleshooting

If Xcode reports duplicate app entry points:

- Remove the generated template `AIPhotoAppApp.swift` from the target.
- Keep `ios-app/AIPhotoApp/AIPhotoApp.swift` as the only `@main` entry.

If views cannot find design system symbols:

- Confirm every file under `DesignSystem/` is in **Compile Sources**.
- Confirm target membership is enabled for those files.

If localization does not work:

- Confirm the app target has English and Traditional Chinese localizations.
- Confirm the `.lproj` folders are copied into the app bundle.
- Confirm both `Localizable.strings` files are in **Copy Bundle Resources**.

If the simulator cannot build because of signing:

- Use automatic signing with a local development team, or set signing to manual only after the app owner provides the correct Apple Developer settings.
- Do not commit personal signing credentials.

## Completion Checklist

- [ ] `ios-app/AIPhotoApp.xcodeproj` exists after manual setup.
- [ ] All existing Swift files under `ios-app/AIPhotoApp/` are added to the target.
- [ ] Only `ios-app/AIPhotoApp/AIPhotoApp.swift` contains `@main`.
- [ ] English localization is included.
- [ ] Traditional Chinese localization is included.
- [ ] `AppRootView` preview runs.
- [ ] `MainTabShellView` preview runs.
- [ ] The app builds.
- [ ] The app runs in an iOS Simulator.
- [ ] No Auth implementation is added.
- [ ] No Camera implementation is added.
- [ ] No Firebase upload implementation is added.
- [ ] No AI implementation is added.
- [ ] No StoreKit implementation is added.
- [ ] No real secret, API key, Apple credential, Firebase key, Google key, or `GoogleService-Info.plist` is added.

