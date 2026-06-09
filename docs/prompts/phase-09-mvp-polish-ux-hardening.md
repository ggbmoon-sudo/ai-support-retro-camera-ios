# Phase 09: MVP Polish / UX Hardening

## 1. Phase name

Phase 09 - MVP Polish / UX Hardening

## 2. Goal

Polish and harden the current mock MVP flow for the iOS-first AI Support Retro Camera app.

This phase should make the existing local/mock flow feel more coherent, readable, stable, and demo-ready across Home, Camera / Photo Picker, Filters, Mock Save, Mock AI Result, Local Session History, and Settings.

This phase is intentionally not a new product-feature phase. It should improve UX quality, spacing, scroll behavior, safe-area handling, copy, empty/loading/error states, localization consistency, and manual test coverage for the work already completed in Phases 03 through 08.

This phase must not connect real Firebase, real AI, Cloud Functions, StoreKit, quota enforcement, persistence, export, or any paid/service dependency.

## 3. Current repo status

Expected starting state:

- Repo path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- Latest commit at prompt generation time: `501baeb feat: add phase 08 local session history`
- Local branch is synchronized with `origin/feat/phase-02-auth`
- Working tree is clean
- `ios-app/AIPhotoApp.xcodeproj` exists
- Phase 01/02 Mac/Xcode build succeeded
- Phase 03 Camera + Photo Picker scaffold completed, manually verified, committed, and pushed
- Phase 04 Local Core Image Filter Presets completed, manually verified, committed, and pushed
- Phase 05 Mock Photo Save Scaffold completed, manually verified, committed, and pushed
- Phase 06 AI Photo Advisor Backend / Service Scaffold completed, manually verified, committed, and pushed
- Phase 07 AI Photo Advisor Result UI Scaffold completed, manually verified, committed, and pushed
- Phase 08 Local Session History completed, manually verified, committed, and pushed
- `docs/phase-log.md` records Phase 08 completed / manually checked
- `tests/manual-smoke-tests.md` includes Phase 08 checks
- History tab freeze bugfix has been verified
- No real Firebase config is present
- No `GoogleService-Info.plist` is present
- No `.env` is present
- No `.firebaserc` is present
- No Gemini or OpenAI key is present
- No iOS Firebase / FirebaseFunctions / Gemini / OpenAI / StoreKit imports are present

Phase 09 has not started yet.

Note: older docs may name Phase 09 as subscription / paywall work. This prompt intentionally scopes Phase 09 to MVP Polish / UX Hardening per the current user request. Do not implement StoreKit, subscription, paywall, or quota in this phase.

## 4. Read first

Before implementing Phase 09, read:

- `README.md`
- `AGENTS.md`
- `docs/00-common-background-v2.md`
- `docs/01-product-mvp-scope.md`
- `docs/02-technical-architecture.md`
- `docs/03-camera-filter-image-pipeline.md`
- `docs/04-ai-photo-advisor.md`
- `docs/05-firebase-storage-firestore-functions.md`
- `docs/06-ui-ux-design-system.md`
- `docs/07-subscription-quota-storekit.md`
- `docs/08-privacy-security-app-store-risk.md`
- `docs/09-codex-phase-plan.md`
- `docs/phase-log.md`
- `docs/prompts/phase-03-camera-picker.md`
- `docs/prompts/phase-04-filters.md`
- `docs/prompts/phase-05-firebase-storage-firestore.md`
- `docs/prompts/phase-06-ai-photo-advisor-backend.md`
- `docs/prompts/phase-07-ai-advisor-result-ui.md`
- `docs/prompts/phase-08-local-session-history.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Also inspect the existing iOS UI and state flow:

- `ios-app/AIPhotoApp/App/AppRootView.swift`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Home/HomeView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift`
- `ios-app/AIPhotoApp/Features/History/HistoryView.swift`
- `ios-app/AIPhotoApp/Features/History/HistoryItemCard.swift`
- `ios-app/AIPhotoApp/Features/Settings/SettingsView.swift`
- `ios-app/AIPhotoApp/DesignSystem/`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

## 5. Pre-implementation checks

Run these checks before editing files:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short
git status --short --branch
git log --oneline -3
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
rg -n "Phase 08|Ready for Phase 09|History tab|freeze|manually verified" docs/phase-log.md tests/manual-smoke-tests.md
rg -n "HomeView|CameraView|FilteredPhotoPreview|AIAnalysisView|AIAnalysisResultView|HistoryView|HistoryItemCard|SettingsView" ios-app/AIPhotoApp -g '*.swift'
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary|putData|putFile|setData\\(|addDocument\\(|httpsCallable|Functions\\.functions|URLSession|StoreKit|Product\\.products" ios-app/AIPhotoApp -g '*.swift'
rg -n "^[^/]*[A-Za-z0-9_-]*(API_KEY|apiKey|private_key|client_secret|projectId|firebase_project_id|GEMINI|OPENAI)" . -g '!**/.git/**'
```

Expected:

- Current branch is `feat/phase-02-auth`.
- Working tree is clean.
- Latest commit is `501baeb feat: add phase 08 local session history` or an equivalent Phase 08 local session history commit.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 08 is recorded as completed / manually checked.
- History tab freeze bugfix is recorded and verified.
- No real Firebase config, API key, private key, Gemini key, OpenAI key, Apple credential, production plist, `.env`, `.firebaserc`, or `GoogleService-Info.plist` is present.
- iOS Swift source does not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- No real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, or export implementation is present.

If any pre-check fails, stop and report it before making UI changes.

## 6. This phase should only do

Polish and harden the existing mock MVP flow:

- Review and polish existing Home UI.
- Review and polish Camera / Photo Picker scaffold UI.
- Review and polish Filter preset UI.
- Review and polish Mock Save UI.
- Review and polish Mock AI Result UI.
- Review and polish Local Session History UI.
- Review and polish Settings placeholder UI.
- Improve spacing, visual hierarchy, section grouping, and readable density.
- Improve scroll behavior and safe-area handling.
- Improve small-screen layout.
- Improve empty states.
- Improve loading states.
- Improve local-only / mock labels.
- Improve button copy and disabled states.
- Improve error messages.
- Improve Traditional Chinese and English localization consistency.
- Remove or fix obvious raw localization keys if any remain.
- Make the existing mock-only flow feel more coherent and demo-ready.
- Keep existing mock-only behavior.
- Update `ios-app/README.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `docs/phase-log.md`.

## 7. This phase must not do

Do not start Phase 10.

Do not add or implement:

- Real Firebase Storage upload
- Real Firestore write
- Cloud history
- Disk persistence
- UserDefaults persistence
- Core Data
- SwiftData
- Save images to Photos
- Export images
- Public sharing
- Account deletion backend
- Real Gemini call
- Real OpenAI call
- Cloud Functions call
- Cloud Functions deploy
- StoreKit
- Subscription
- Paywall
- Quota enforcement
- AI billing
- Real cloud save
- Real AI analysis
- AI chat follow-up
- Image editing
- Generative edit
- Realtime video AI
- `GoogleService-Info.plist`
- `.env`
- `.firebaserc`
- Firebase project ID
- Gemini API key
- OpenAI API key
- Private key
- OAuth secret
- Apple credential
- Signing credential
- Provisioning profile
- New npm dependency
- Third-party SDK dependency
- A new product feature beyond polishing existing Phase 03 through Phase 08 behavior

Do not import these in iOS:

- `Firebase`
- `FirebaseFunctions`
- `FirebaseStorage`
- `FirebaseFirestore`
- Gemini SDKs
- OpenAI SDKs
- `StoreKit`

Do not log:

- Raw image data
- Base64 image data
- Local file paths
- Signed URLs
- Full prompts
- Provider responses
- Secrets or credentials

Do not rewrite the app architecture. Keep changes small and reviewable.

## 8. Suggested files to create or modify

Prefer modifying existing UI files. Create new helper views only when they reduce real duplication or match an existing pattern.

Suggested existing files to inspect and possibly modify:

```text
ios-app/AIPhotoApp/Features/Home/HomeView.swift
ios-app/AIPhotoApp/Features/Camera/CameraView.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
ios-app/AIPhotoApp/Features/Filters/FilterPreviewView.swift
ios-app/AIPhotoApp/Features/Filters/FilterPresetSelectorView.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisSuggestionCard.swift
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAdjustmentHintCard.swift
ios-app/AIPhotoApp/Features/History/HistoryView.swift
ios-app/AIPhotoApp/Features/History/HistoryItemCard.swift
ios-app/AIPhotoApp/Features/History/HistoryEmptyStateView.swift
ios-app/AIPhotoApp/Features/Settings/SettingsView.swift
ios-app/AIPhotoApp/DesignSystem/Components/PrimaryButton.swift
ios-app/AIPhotoApp/DesignSystem/Components/EmptyStateView.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppSpacing.swift
ios-app/AIPhotoApp/DesignSystem/Tokens/AppTypography.swift
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Possible new UI helper files, only if clearly useful:

```text
ios-app/AIPhotoApp/DesignSystem/Components/InfoBadge.swift
ios-app/AIPhotoApp/DesignSystem/Components/SectionHeader.swift
ios-app/AIPhotoApp/DesignSystem/Components/StatusMessageView.swift
ios-app/AIPhotoApp/DesignSystem/Components/LocalOnlyBadge.swift
```

Avoid modifying:

```text
functions/
firebase/
scripts/
ios-app/AIPhotoApp.xcodeproj/
```

Only edit the Xcode project if new Swift files are added and target membership is not covered by the existing file-system synchronized setup. Do not add user-specific Xcode files.

## 9. UX polish requirements

The existing flow should feel coherent:

```text
Home
-> Camera / Photo Picker
-> Filter presets
-> Mock Save
-> Mock AI result
-> Local Session History
-> Settings
```

Polish requirements:

- Improve visible hierarchy so users can tell what to do next.
- Make primary actions clear.
- Make disabled actions explain themselves through nearby copy or a clear label.
- Keep destructive / clear actions visually distinct.
- Keep mock/local-only labels clear but not overly noisy.
- Make the current scaffold status honest without making every panel feel like a warning.
- Ensure long Traditional Chinese text wraps cleanly.
- Ensure English copy is concise and not overly technical.
- Ensure no important button is hidden behind tab bar, toolbar, keyboard, or safe area.
- Ensure scrollable screens actually scroll on iPhone Simulator.
- Ensure History cards do not freeze, duplicate unexpectedly, or imply cloud sync.
- Ensure AI result cards do not overflow.
- Ensure Camera unavailable state on Simulator remains understandable.
- Ensure Settings placeholders do not claim backend deletion, subscription, or real cloud setup is complete.

Do not redesign the whole product. Polish what exists.

## 10. Layout / small-screen requirements

Focus on small iPhone Simulator readability and touchability:

- Test on at least one small iPhone Simulator if possible.
- Avoid fixed heights that prevent scrolling.
- Prefer `ScrollView`, `LazyVStack`, `safeAreaInset`, and bottom padding where appropriate.
- Avoid bottom controls being hidden behind the tab bar or home indicator.
- Keep Camera selected-photo flow readable when save and AI panels are both present.
- Keep AI result content readable when summary, suggestions, adjustment hints, notes, retry, and dismiss are all visible.
- Keep History list scrollable with multiple local session cards.
- Keep cards within screen bounds.
- Avoid layout shifts that make controls jump during loading / success / failure transitions.
- Preserve Dynamic Type-friendly wrapping where practical.
- Avoid clipping localized Traditional Chinese text.

## 11. Error / empty / loading state requirements

Review and improve existing states without adding new backend behavior:

- Home should explain the next action clearly.
- Camera unavailable should explain Simulator limitations and permission state clearly.
- Photo picker no-selection / initial state should be clear.
- Photo picker loading should remain understandable.
- Filter rendering loading should be visible.
- Filter render failure fallback should be clear and should not crash.
- Mock save idle / saving / success / failure should be visible and honest.
- Mock AI not-started / loading / success / failure / retry / dismiss should be visible and honest.
- History empty state should clearly say it is current-session and local-only.
- History clear action should clearly clear only the local session history.
- Settings placeholders should not claim unimplemented backend behavior.

Do not add real retry networking, real upload retries, real persistence retries, or real provider error handling.

## 12. Localization / copy requirements

Localization must be reviewed in both:

- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Requirements:

- Traditional Chinese should be natural, consistent, and not machine-stiff.
- English should be clear and not overly technical.
- Do not display raw localization keys in UI.
- Avoid mixing English and Chinese where a localized phrase exists.
- Use terms consistently:
  - mock
  - local-only
  - session history
  - cloud history not connected
  - AI advice mock
  - scaffold
- UI must not imply real cloud, real AI, real subscription, or permanent save.
- Avoid claiming any result is final, synced, uploaded, backed up, paid, or production-ready.
- Keep the distinction between mock save, mock AI, and local session history obvious enough for testers.

Useful copy direction:

- Use `local-only` for device/session-only behavior.
- Use `mock` for fake service responses.
- Use `not connected to cloud` for current Firebase / history behavior.
- Use `not real AI advice` or equivalent for Phase 07 mock result copy.
- Use `current session` for Phase 08 History behavior.

## 13. Privacy / App Store requirements

This phase should improve UI honesty and trust:

- Do not imply photos are uploaded.
- Do not imply photos are permanently saved.
- Do not imply cloud sync is active.
- Do not imply real AI providers are contacted.
- Do not imply subscriptions or paid entitlements are active.
- Do not request new permissions.
- Do not add tracking, ads, analytics, or personalized ads SDKs.
- Do not add age gate, consent gate, privacy policy UI, account deletion backend, or subscription management unless explicitly requested in a later phase.
- Do not add model-training consent.
- Keep `trainingConsent` assumptions unchanged.
- Keep basic camera and basic filters available in the local/mock flow.

Any privacy copy touched in this phase must match current behavior: local-only, mock-only, no upload, no persistence, no real third-party AI call.

## 14. Secret / Firebase / AI safety requirements

Before finishing, confirm:

- No `GoogleService-Info.plist` was added.
- No `.env` was added.
- No `.firebaserc` was added.
- No Firebase project ID was added.
- No Gemini API key was added.
- No OpenAI API key was added.
- No API key, private key, OAuth secret, Apple credential, signing credential, or provisioning profile was added.
- No Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit import was added to iOS source.
- No real Firebase upload was added.
- No real Firestore write was added.
- No real Storage write was added.
- No Cloud Functions call was added.
- No real AI call was added.
- No StoreKit / subscription / paywall / quota enforcement was added.
- No persistence via disk, UserDefaults, Core Data, or SwiftData was added.
- No export or save-to-Photos behavior was added.

Suggested verification commands:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary|putData|putFile|setData\\(|addDocument\\(|httpsCallable|Functions\\.functions|URLSession|Product\\.products" ios-app/AIPhotoApp -g '*.swift'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId" . -g '!**/.git/**'
```

If a search result is only documentation or an existing placeholder, mention that clearly in the final response.

## 15. Acceptance criteria

Phase 09 is acceptable when:

- `docs/prompts/phase-09-mvp-polish-ux-hardening.md` has been read and followed.
- The app builds in Xcode after Phase 09 changes.
- Existing Auth / Home / Camera / Filter / Mock Save / Mock AI / History / Settings flows still build.
- Home gives a clear next step.
- Camera / Photo Picker scaffold remains usable and understandable.
- Camera unavailable state on Simulator remains clear.
- Filter preset switching remains usable.
- Mock save success / failure remains usable.
- Mock AI loading / result / failure / retry / dismiss remains usable.
- AI result panel remains scrollable on small screens.
- History tab enters without freezing.
- History empty state remains clear.
- History local session card list remains scrollable.
- History clear local session history remains clear and local-only.
- Settings placeholders remain honest and do not claim backend completion.
- Local-only / mock labels are clear but not excessive.
- No raw localization keys are visible in the primary tested flow.
- Traditional Chinese and English copy are both updated where touched.
- No real Firebase config, secrets, provider keys, or production credentials are added.
- No iOS Firebase / FirebaseFunctions / Gemini / OpenAI / StoreKit imports are added.
- No persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, export, or save-to-Photos behavior is added.
- `ios-app/README.md` records Phase 09 polish notes.
- `tests/manual-smoke-tests.md` includes Phase 09 checks.
- `docs/phase-log.md` records Phase 09 status, changed files, checks, known TODOs, safety notes, and readiness for the next phase.

## 16. Tests / manual checks

Run or perform:

```bash
git status --short
git branch --show-current
git log --oneline -3
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
```

Build:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build
```

If the command-line build is blocked by local Xcode / CoreSimulator sandbox conditions, report the exact blocker and ask the user to verify in Xcode. Do not treat a sandbox-only CLI failure as an app source failure without evidence.

Manual Simulator checks:

- Build and run `AIPhotoApp` in Xcode / Simulator.
- Test on a small iPhone Simulator if possible.
- Enter Home.
- Confirm Home copy and primary action are clear.
- Open Camera scaffold.
- Confirm Camera unavailable / permission state is understandable on Simulator.
- Use Photo Picker to import one image.
- Confirm selected-photo screen scrolls.
- Switch Original / Classic Film / Warm Vintage / Faded Chrome.
- Confirm filter loading / rendering state remains usable.
- Trigger mock save success.
- Confirm success state is visible and clearly mock-only.
- Trigger mock save failure.
- Confirm failure state is visible and recoverable.
- Trigger mock AI analysis success.
- Confirm loading / result / retry / dismiss UI remains readable and scrollable.
- Trigger mock AI failure.
- Confirm failure / retry / dismiss UI remains readable.
- Open History.
- Confirm empty state before items or after clear is understandable.
- Confirm local-only card appears after mock save.
- Confirm mock AI summary can appear on the same card after mock AI success.
- Confirm card list scrolls.
- Confirm clear local session history works and does not imply cloud deletion.
- Open Settings.
- Confirm Settings placeholders do not claim real backend, subscription, or account deletion completion.
- Confirm Home / Camera / Filters / Mock Save / Mock AI / History / Settings still render after tab switching.
- Confirm no raw localization keys appear in the primary tested flow.
- Confirm no real upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota, export, disk persistence, UserDefaults persistence, Core Data, SwiftData, or cloud history occurs.
- Confirm no real Firebase config or secrets are present.

Manual physical iPhone / iPad checks, if available:

- Build and run on device.
- Confirm camera permission and camera preview still work.
- Capture one still photo.
- Apply one filter preset.
- Trigger mock save success.
- Trigger mock AI success.
- Confirm History updates local session item.
- Confirm small-screen / safe-area layout remains usable.
- Confirm no image is uploaded, persisted, exported, saved to Photos, or sent to AI.

## 17. Completion requirement

Before finishing Phase 09 implementation:

- Run `git status --short`.
- Run or attempt an Xcode build.
- Confirm no forbidden imports were added.
- Confirm no secrets / production config files were added.
- Confirm no real Firebase / AI / Cloud Functions / StoreKit dependency was added.
- Confirm no persistence / upload / Firestore write / Storage write / export behavior was added.
- Update `docs/phase-log.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `ios-app/README.md`.
- Do not commit automatically.
- Do not push automatically.
- Do not start Phase 10.

Final response after implementation should include:

- changed files
- implemented summary
- verification result
- known TODOs
- manual test steps
- whether Xcode build was run by Codex or needs user verification
- ready for Phase 10: `no, until Phase 09 manual verification and commit/push are completed`
