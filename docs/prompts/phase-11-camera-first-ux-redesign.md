# Phase 11: Camera-First UX Redesign

## 1. Phase Name

Phase 11 - Camera-First UX Redesign

## 2. Goal

Redesign the current local/mock MVP so the app becomes camera-first.

The app should launch / route into a camera-primary experience instead of treating Home as the main first screen. The camera viewfinder should dominate the screen, use roughly 80% of the camera surface, and visually lean toward a 5:4 frame. Filter selection should be reachable from the camera surface with a clear lower-right filter picker entry.

This phase should preserve the current mock MVP behavior:

```text
Camera / Photo Picker
-> Filter
-> Mock Save
-> Mock AI Advice
-> Local Session History
-> History
-> Settings
```

Home can be weakened into secondary info / demo guide, but important current explanations must not be deleted. The app must remain local/mock-only.

This prompt is a construction prompt for a future Codex session. Do not execute it until the user explicitly asks to start Phase 11.

## 3. Current Repo Status

Expected starting state:

- Repo path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- Phase 10 has been committed and pushed.
- Working tree should be clean before implementation begins.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- The current app is a local/mock MVP.
- Current flow is Home -> Camera / Photo Picker -> Filter -> Mock Save -> Mock AI Advice -> Local Session History -> Settings.
- No real Firebase config is present.
- No `GoogleService-Info.plist` is present.
- No `.env` is present.
- No `.firebaserc` is present.
- No Gemini or OpenAI key is present.
- No iOS Firebase / FirebaseFunctions / FirebaseStorage / FirebaseFirestore / Gemini / OpenAI / StoreKit imports are present.
- No persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation is present.

If any of these assumptions fail, stop and report the mismatch before editing files.

## 4. Read First

Before implementing Phase 11, read:

- `README.md`
- `AGENTS.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/product-roadmap-next.md`
- `docs/feature-change-requests.md`
- `docs/prompts/phase-10-mvp-demo-qa-readiness.md`
- `docs/prompts/phase-11-camera-first-ux-redesign.md`

Also inspect the current SwiftUI flow before editing:

- `ios-app/AIPhotoApp/App/AppRootView.swift`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Home/HomeView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/PhotoPickerView.swift`
- `ios-app/AIPhotoApp/Features/Camera/SelectedPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift`
- `ios-app/AIPhotoApp/Features/History/HistoryView.swift`
- `ios-app/AIPhotoApp/Features/Settings/SettingsView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

## 5. Pre-Implementation Checks

Run these checks before editing files:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -5
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
rg -n "Phase 10|MVP Demo QA|Release Readiness|Ready for Phase 11" docs/phase-log.md tests/manual-smoke-tests.md README.md ios-app/README.md
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "FirebaseApp\\.configure|httpsCallable|Functions\\.functions|URLSession|putData|putFile|setData\\(|addDocument\\(|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|UserDefaults|CoreData|SwiftData|Product\\.products" ios-app/AIPhotoApp functions/src -g '*.swift' -g '*.ts'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

Expected:

- Current branch is `feat/phase-02-auth`.
- Working tree is clean.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Latest commit is Phase 10 MVP demo QA / release readiness or later approved planning docs.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 10 is recorded as completed / committed / pushed.
- No real Firebase config, API key, private key, Gemini key, OpenAI key, Apple credential, production plist, `.env`, `.firebaserc`, or `GoogleService-Info.plist` is present.
- iOS Swift source does not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- No real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos implementation exists.

If any pre-check fails, stop and report it before making UI changes.

## 6. This Phase Should Do

Implement camera-first UX changes only:

- Make the app launch or route into the camera-primary experience.
- Adjust the main tab shell so Camera is the primary tab / default destination.
- Keep History and Settings accessible.
- Keep Home accessible only if useful as secondary info / demo guide.
- Do not delete important Home content; adapt it to a secondary role if needed.
- Make the camera viewfinder dominate the camera screen, roughly 80% of the available camera surface.
- Make the viewfinder visually lean toward 5:4 framing.
- Add a lower-right filter picker entry on the camera surface.
- Preserve the existing filter presets:
  - Original / None
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Keep Photo Picker fallback visible and reliable, especially for Simulator demo.
- Preserve the existing selected-photo flow.
- Preserve the existing mock save success / failure flow.
- Preserve the existing mock AI advice loading / success / failure / retry / dismiss flow.
- Preserve local session history updates.
- Preserve History clear local session history behavior.
- Preserve Settings placeholders and mock-only copy.
- Update English and Traditional Chinese localization strings if UI copy changes.
- Update `ios-app/README.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `docs/phase-log.md`.

## 7. UX Requirements

Camera-first behavior:

- The first useful app surface after mock auth / guest entry should be Camera, not Home.
- The Camera tab or route should feel like the main product surface.
- Home should not block the user from shooting.

Viewfinder:

- The viewfinder should be the strongest visual object on the screen.
- Target roughly 80% of the camera screen, adjusted responsibly for safe areas and small devices.
- Use a 5:4-ish visual frame or container.
- Do not distort images or camera feed to fake 5:4 unless clearly intended and tested.
- On Simulator camera-unavailable state, the fallback view should still occupy the camera frame cleanly.

Filter picker entry:

- Add a clear filter picker entry near the lower-right of the camera surface.
- It may open / reveal the existing preset selector rather than creating a new filter system.
- It should not imply an expanded filter library.
- It should not imply paid filters or cloud presets.

Photo Picker:

- Keep Photo Picker available as a fallback.
- It should remain easy to use in Simulator.
- Imported images should remain in memory only.

Mock flow preservation:

- Mock Save must remain mock-only.
- Mock AI Advice must remain mock-only.
- Local Session History must remain current-session memory-only.
- History and Settings must remain accessible.

## 8. This Phase Must Not Do

Do not start Phase 12.

Do not add or implement:

- Real Firebase setup.
- `GoogleService-Info.plist`.
- `.env`.
- `.firebaserc`.
- Firebase project ID.
- Gemini API key.
- OpenAI API key.
- Private key.
- OAuth secret.
- Apple credential.
- Signing credential.
- Provisioning profile.
- Firebase SDK imports.
- FirebaseFunctions imports.
- FirebaseStorage imports.
- FirebaseFirestore imports.
- Gemini SDK imports.
- OpenAI SDK imports.
- StoreKit imports.
- Firebase Storage upload.
- Firestore write.
- Storage write.
- Cloud Functions call.
- Cloud Functions deploy.
- Real Gemini call.
- Real OpenAI call.
- StoreKit.
- Subscription.
- Paywall.
- Quota enforcement.
- AI billing.
- Disk persistence.
- UserDefaults persistence.
- Core Data.
- SwiftData.
- Export.
- Save to Photos.
- Public sharing.
- Expanded filter library.
- New filter research implementation.
- Paid presets.
- Live AI guidance.
- Real Vision guidance prototype.
- AI custom filter generation.
- AI reference image upload.
- AI image generation.
- AI image editing.
- New npm dependency.
- Third-party SDK dependency.
- Account deletion backend.
- Production cloud history.
- Delete photo implementation.
- Local download implementation.
- Any Phase 12, Phase 13, Phase 14, Phase 15, Phase 16, or Phase 17 work.

Do not log:

- Raw image data.
- Base64 image data.
- Local file paths.
- Signed URLs.
- Full prompts.
- Provider responses.
- Secret values.

Do not claim the app is production-ready.

## 9. Suggested Files To Modify

Modify only files needed for the camera-first UX redesign.

Likely Swift files:

```text
ios-app/AIPhotoApp/App/AppRootView.swift
ios-app/AIPhotoApp/App/MainTabShellView.swift
ios-app/AIPhotoApp/Features/Home/HomeView.swift
ios-app/AIPhotoApp/Features/Camera/CameraView.swift
ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift
ios-app/AIPhotoApp/Features/Camera/PhotoPickerView.swift
ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
```

Likely docs / test files:

```text
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Avoid modifying backend code in `functions/`.

Avoid modifying Firebase rules or config files.

Avoid modifying package dependencies.

Avoid modifying Xcode signing settings or user-specific Xcode files.

## 10. Implementation Guidance

Keep the change small and reviewable:

- Prefer reusing existing camera, filter, mock save, mock AI, and history state.
- Avoid rewriting the whole app shell.
- Avoid replacing existing services.
- Avoid deleting existing demo explanations; move or weaken them if needed.
- Preserve localization coverage for changed visible strings.
- Use existing design tokens and local UI patterns where possible.
- Check small-screen layout.
- Check that controls do not overlap the tab bar or safe areas.
- Check that the viewfinder does not squeeze or hide Photo Picker fallback.

If a design tradeoff appears:

- Prioritize camera usability.
- Preserve demo reliability.
- Preserve mock-only honesty.
- Keep future phases separate.

## 11. Verification

Run source safety checks after implementation:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "FirebaseApp\\.configure|httpsCallable|Functions\\.functions|URLSession|putData|putFile|setData\\(|addDocument\\(|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|UserDefaults|CoreData|SwiftData|Product\\.products" ios-app/AIPhotoApp functions/src -g '*.swift' -g '*.ts'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

Expected:

- No real secret or production config exists.
- No forbidden imports exist.
- No real Firebase / AI / Cloud Functions / StoreKit / persistence / upload / export behavior exists.

Run Xcode build if available:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 17' build
```

If command-line Xcode build fails due sandbox / CoreSimulator limitations, report the failure and ask the user to verify in Xcode / Simulator.

Manual simulator checks:

- Launch app.
- Continue through mock auth / guest entry if shown.
- Confirm Camera is the primary first useful surface.
- Confirm Home no longer blocks the camera-first flow.
- Confirm viewfinder is visually dominant and approximately 5:4.
- Confirm lower-right filter picker entry is visible and usable.
- Confirm existing presets still work.
- Confirm Photo Picker fallback can import one image.
- Confirm selected-photo flow still reaches mock save.
- Confirm mock save success and failure still work.
- Confirm mock AI advice loading, success, failure, retry, and dismiss still work.
- Confirm local session history still receives mock save / mock AI updates.
- Confirm History remains accessible and clear local session history works.
- Confirm Settings remains accessible and still states real backend / AI / StoreKit / quota are not connected.
- Confirm no raw localization keys appear.
- Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, persistence, export, or save-to-Photos behavior occurs.

Manual physical device checks, if available:

- Launch app on iPhone or iPad.
- Confirm camera permission flow still works.
- Confirm live preview is visible.
- Confirm 5:4-ish frame and lower-right filter entry are usable.
- Capture one photo.
- Apply an existing filter.
- Trigger mock save and mock AI advice.
- Confirm no real upload, persistence, export, save-to-Photos, real AI, Cloud Functions, or StoreKit behavior occurs.

## 12. Completion Response Requirements

When Phase 11 is actually implemented in a future session, respond with:

- Changed files.
- Summary.
- Git status.
- Build / verification results.
- Confirmation that Swift changes stayed within Phase 11.
- Confirmation that backend code was not modified.
- Confirmation that no real Firebase / AI / StoreKit / persistence / export behavior was added.
- Ready to commit Phase 11: yes/no.
- Ready for Phase 12: no, until Phase 11 is reviewed, committed, pushed, and explicitly requested.
