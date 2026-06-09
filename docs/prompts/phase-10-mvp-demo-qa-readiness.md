# Phase 10: MVP Demo QA / Release Readiness

## 1. Phase name

Phase 10 - MVP Demo QA / Release Readiness

## 2. Goal

Create an MVP demo QA and release-readiness scaffold for the current local/mock iOS MVP.

This phase should organize the current mock MVP flow into a clear demo script, QA checklist, known limitations, manual test matrix, device testing notes, and readiness gates for future real Firebase, real AI, Cloud Functions, StoreKit, privacy, and release work.

This phase is primarily documentation and QA readiness work. It must not connect production services, add new product capabilities, or start Phase 11.

The current demo flow is:

```text
Launch app
-> Guest / mock auth
-> Home
-> Camera scaffold
-> Photo Picker import
-> Filter presets
-> Mock save success / failure
-> Mock AI advice result
-> Local session history
-> Clear local session history
-> Settings placeholders
```

The output should make it easy for a tester, founder, or future Codex run to understand what can be demoed today, what remains mock/local-only, and what must be true before connecting real Firebase, real AI, or StoreKit.

## 3. Current repo status

Expected starting state:

- Repo path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- Latest commit at prompt generation time: `5a8d3c9 chore: polish phase 09 MVP UX`
- Latest commit is Phase 09 MVP UX polish
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
- Phase 09 MVP Polish / UX Hardening completed, manually verified, committed, and pushed
- `docs/phase-log.md` records Phase 09 completed / manually checked
- `tests/manual-smoke-tests.md` includes Phase 09 checks
- No real Firebase config is present
- No `GoogleService-Info.plist` is present
- No `.env` is present
- No `.firebaserc` is present
- No Gemini or OpenAI key is present
- No iOS Firebase / FirebaseFunctions / Gemini / OpenAI / StoreKit imports are present
- No persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, or export implementation is present

Phase 10 has not started yet.

Note: older repo docs may name Phase 10 as History / Delete / Local Download work. This prompt intentionally scopes Phase 10 to MVP Demo QA / Release Readiness per the current user request. Do not implement delete, local download, export, or production history in this phase.

## 4. Read first

Before implementing Phase 10, read:

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
- `docs/prompts/phase-09-mvp-polish-ux-hardening.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Optionally inspect current UI files only to confirm wording and demo flow. Do not edit Swift unless a tiny wording-only correction is explicitly necessary and remains within this phase.

Suggested optional reads:

- `ios-app/AIPhotoApp/App/AppRootView.swift`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Home/HomeView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift`
- `ios-app/AIPhotoApp/Features/History/HistoryView.swift`
- `ios-app/AIPhotoApp/Features/Settings/SettingsView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

## 5. Pre-implementation checks

Run these checks before editing files:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -3
git rev-parse HEAD
git rev-parse origin/feat/phase-02-auth
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
rg -n "Phase 09|MVP Polish|manually verified|Ready for Phase 10" docs/phase-log.md tests/manual-smoke-tests.md ios-app/README.md
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|putData|putFile|setData\\(|addDocument\\(|httpsCallable|Functions\\.functions|URLSession|StoreKit|Product\\.products" ios-app/AIPhotoApp -g '*.swift'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

Expected:

- Current branch is `feat/phase-02-auth`.
- Working tree is clean.
- Latest commit is `5a8d3c9 chore: polish phase 09 MVP UX` or an equivalent Phase 09 MVP UX polish commit.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 09 is recorded as completed / manually checked.
- `tests/manual-smoke-tests.md` includes Phase 09 checks.
- No real Firebase config, API key, private key, Gemini key, OpenAI key, Apple credential, production plist, `.env`, `.firebaserc`, or `GoogleService-Info.plist` is present.
- iOS Swift source does not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- No real persistence, upload, Firestore write, Storage write, Cloud Functions call, real AI call, StoreKit, quota enforcement, or export implementation is present.

If any pre-check fails, stop and report it before making changes.

## 6. This phase should only do

Create MVP demo QA and release-readiness documentation for the current mock/local MVP:

- Add an MVP demo script.
- Add a current mock MVP flow checklist.
- Add a manual QA matrix.
- Add iPhone Simulator test notes.
- Add optional physical iPhone / iPad test notes.
- Add small-screen layout test notes.
- Add localization and raw-key test notes.
- Add known limitations documentation.
- Add a pre-real-service readiness checklist.
- Add privacy / App Store readiness notes.
- Add secret / Firebase / AI safety checks.
- Update README / docs references if useful.
- Update `tests/manual-smoke-tests.md`.
- Update `docs/phase-log.md`.
- Optionally make very small wording-only UI polish if a misleading word is discovered, but prefer documentation / QA readiness only.

This phase should keep changes small and reviewable.

## 7. This phase must not do

Do not start Phase 11.

Do not add or implement:

- Real Firebase setup
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
- Firebase SDK imports
- FirebaseFunctions imports
- FirebaseStorage imports
- FirebaseFirestore imports
- Gemini SDK imports
- OpenAI SDK imports
- StoreKit imports
- Firebase Storage upload
- Firestore write
- Storage write
- Cloud Functions call
- Cloud Functions deploy
- Real Gemini call
- Real OpenAI call
- StoreKit
- Subscription
- Paywall
- Quota enforcement
- AI billing
- Disk persistence
- UserDefaults persistence
- Core Data
- SwiftData
- Export
- Save to Photos
- Public sharing
- AI chat follow-up
- Image editing
- Generative edit
- Realtime video AI
- New npm dependency
- Third-party SDK dependency
- Account deletion backend
- Production cloud history
- Delete photo implementation
- Local download implementation
- Any new major product feature

Do not log:

- Raw image data
- Base64 image data
- Local file paths
- Signed URLs
- Full prompts
- Provider responses
- Secret values

Do not claim the app is production-ready. Phase 10 is readiness documentation for a mock MVP demo, not production release completion.

## 8. Suggested files to create or modify

Create or modify only the files needed for this Phase 10 documentation / QA readiness scaffold.

Strongly suggested:

```text
docs/mvp-demo-script.md
docs/mvp-known-limitations.md
docs/mvp-readiness-checklist.md
tests/manual-smoke-tests.md
ios-app/README.md
README.md
docs/phase-log.md
```

Optional, only if useful and still documentation-only:

```text
docs/decisions.md
docs/testing-checklist.md
docs/release-checklist.md
```

Avoid modifying Swift files. If a tiny wording-only UI change is absolutely necessary, keep it localized, document why, update localization strings if needed, and do not change behavior.

Do not modify backend code in `functions/`.

Do not modify Firebase rules, Firebase config, package dependencies, Xcode signing settings, or user-specific Xcode files.

## 9. MVP demo flow requirements

Create `docs/mvp-demo-script.md` or equivalent documentation that covers the current demo flow.

The demo script must include:

- Purpose of the demo.
- Audience: internal tester / founder demo / future developer handoff.
- Clear disclaimer that the current app is a local/mock MVP, not production.
- Demo prerequisites:
  - iOS Simulator or device
  - Xcode project path
  - no real Firebase / AI / StoreKit config required
  - sample photo available for Photo Picker
- Step-by-step script:
  - Launch app.
  - Use guest / mock auth or existing mock auth path.
  - Open Home.
  - Explain mock/local-only labels.
  - Enter Camera scaffold.
  - Show camera unavailable state on Simulator if applicable.
  - Import one photo using Photo Picker.
  - Switch filter presets:
    - Original / None
    - Classic Film
    - Warm Vintage
    - Faded Chrome
  - Trigger mock save success.
  - Trigger mock save failure.
  - Trigger mock AI advice result.
  - Show loading, success, failure, retry, dismiss.
  - Open History.
  - Show local session card.
  - Clear local session history.
  - Open Settings.
  - Explain placeholders for backend, cloud, subscription, quota, AI, and account deletion.
- Demo close:
  - Reiterate no upload, no real AI, no real subscription, no permanent cloud history.
  - Note future readiness gates before real services can be connected.

The demo script must not pretend that mock save is real cloud save, that mock AI is real AI, or that local session history is permanent.

## 10. QA checklist requirements

Update `tests/manual-smoke-tests.md` and/or create a dedicated QA document.

The QA checklist must include at least one check for each area:

- Home
- Camera
- Photo Picker
- Filter presets
- Mock Save
- Mock AI
- History
- Settings
- Localization
- Small-screen layout
- Secrets / config safety
- Forbidden imports
- Forbidden behavior

Include checks for:

- iPhone Simulator.
- Optional physical iPhone / iPad.
- Small-screen iPhone layout.
- Safe area and tab bar overlap.
- Scroll behavior in selected-photo flow.
- Scroll behavior in AI result UI.
- Scroll behavior in History list.
- Empty states.
- Loading states.
- Error states.
- Traditional Chinese copy.
- English copy.
- No raw localization keys.
- Local-only / mock labels.
- Settings placeholder honesty.
- No real upload.
- No Firestore write.
- No Storage write.
- No Cloud Functions call.
- No real Gemini / OpenAI call.
- No StoreKit.
- No quota enforcement.
- No export / save to Photos.
- No disk persistence / UserDefaults / Core Data / SwiftData.
- No secrets or production config.

The checklist should distinguish:

- Checks already verified in earlier phases.
- Checks to run before a demo.
- Checks to run before real service integration.
- Checks to run before TestFlight / App Store release.

## 11. Known limitations requirements

Create `docs/mvp-known-limitations.md` or equivalent documentation.

Known limitations must explicitly record:

- Camera preview on Simulator may be unavailable.
- Camera capture should be verified on physical iPhone / iPad.
- Photo Picker import is the reliable Simulator demo path.
- Save is mock-only.
- Mock save does not upload image bytes.
- Mock save does not write Firestore metadata.
- AI advice is mock-only.
- Mock AI does not call Gemini, OpenAI, Cloud Functions, or any provider.
- History is current-session memory-only.
- History does not persist across app restart.
- No cloud sync.
- No permanent cloud storage.
- No disk persistence.
- No UserDefaults persistence.
- No Core Data / SwiftData.
- No real Firebase config.
- No real Firebase Auth providers.
- No real Firebase Storage upload.
- No real Firestore write.
- No real AI provider connected.
- No production Cloud Functions deployment.
- No StoreKit / subscription.
- No quota enforcement.
- No export / save to Photos.
- No delete photo backend.
- No account deletion backend.
- No production privacy policy / App Store metadata yet.
- No App Store Connect subscription products yet.
- No App Check enforcement yet.
- No Firebase Security Rules production validation yet.

Known limitations should be honest and user-readable. Avoid burying critical mock-only limits in dense paragraphs.

## 12. Device / Simulator testing requirements

Document the expected test matrix.

Simulator checks should include:

- Build and run `AIPhotoApp`.
- Test small iPhone Simulator if available.
- Launch app.
- Home renders.
- Camera scaffold opens.
- Camera unavailable / permission / fallback copy is readable if camera preview is unavailable.
- Photo Picker can import one image.
- Filter presets switch and preview updates.
- Mock save success state appears.
- Mock save failure state appears.
- Mock AI loading / result / failure / retry / dismiss states work.
- Selected-photo flow scrolls fully.
- AI result scrolls fully.
- History empty state works.
- History local-only card appears after mock save / mock AI flow.
- History clear local session history works.
- Settings placeholders are honest.
- No raw localization keys appear.

Physical iPhone / iPad optional checks should include:

- Build and run on device.
- Camera permission prompt appears with appropriate copy.
- Camera preview appears.
- Capture one still photo.
- Apply at least one filter preset.
- Trigger mock save success.
- Trigger mock AI success.
- Open History and confirm local session card readability.
- Clear local session history.
- Confirm no upload, persistence, export, save-to-Photos, real AI, Cloud Functions, or StoreKit behavior occurs.

Testing notes should clearly say which checks were not run and why.

## 13. Privacy / App Store readiness notes

Create or update documentation with privacy / App Store readiness notes.

The notes must cover:

- Current Phase 10 app state is local/mock-only.
- No photos are uploaded in the current mock MVP.
- No photos are sent to third-party AI providers in the current mock MVP.
- No photo is saved to Photos or exported in the current mock MVP.
- Current session history is memory-only and may disappear after app restart.
- Production AI analysis will require explicit consent before sending photos to third-party AI.
- `trainingConsent` should default to false in future real AI work.
- Do not claim model training usage unless a future provider / tier actually does that and the user opts in.
- App Store release will need real privacy policy URL.
- App Store privacy labels must match actual production data flows.
- If account creation is supported in production, in-app account deletion request flow is required.
- Subscription / StoreKit copy must accurately describe benefits before purchase when implemented later.
- Basic camera and basic filters should not be locked behind VIP.
- Do not add tracking, personalized ads, or analytics SDKs without a separate explicit phase and privacy review.

## 14. Secret / Firebase / AI safety checks

Add a checklist or command section that can be rerun before demo and before future service integration.

Required checks:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "FirebaseApp\\.configure|httpsCallable|Functions\\.functions|URLSession|putData|putFile|setData\\(|addDocument\\(|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|UserDefaults|CoreData|SwiftData|Product\\.products" ios-app/AIPhotoApp functions/src -g '*.swift' -g '*.ts'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

Expected:

- Only `.env.example` or documented placeholder text may mention example secret names.
- No real values are committed.
- No production Firebase config exists.
- No iOS forbidden imports exist.
- No real upload / Firestore / Storage / Cloud Functions / AI / StoreKit behavior exists.

Pre-real-Firebase readiness checklist must include:

- Firebase project creation.
- Bundle ID confirmation.
- `GoogleService-Info.plist` handling plan.
- Secrets must not be committed.
- Firestore document model review.
- Firestore Security Rules review.
- Storage path convention review.
- Storage Security Rules review.
- App Check monitor / enforcement plan.
- Auth provider setup.
- Delete data / account flow plan.
- Backup / retention / soft-delete wording review.
- Emulator or staging project test plan.

Pre-real-AI readiness checklist must include:

- Server-side proxy only.
- No client API keys.
- Explicit consent before third-party AI analysis.
- `trainingConsent` default false.
- Provider data handling policy review.
- Cost controls.
- Quota / rate limit.
- Provider fallback.
- Structured response validation.
- Prompt logging policy.
- Image downscaling policy before analysis.
- Error / timeout / malformed response handling.
- Abuse monitoring and safety fallback.

Pre-StoreKit readiness checklist must include:

- App Store Connect products.
- Local `.storekit` test plan.
- Restore purchases flow.
- Clear subscription benefits.
- No basic camera lock.
- Entitlement state design.
- Refund / cancellation wording.
- Backend sync plan if needed later.

## 15. Acceptance criteria

Phase 10 is acceptable when:

- `docs/mvp-demo-script.md` exists and covers the current mock MVP demo flow.
- `docs/mvp-known-limitations.md` exists and clearly lists current limitations.
- `docs/mvp-readiness-checklist.md` exists and covers pre-real-service gates.
- `tests/manual-smoke-tests.md` includes Phase 10 demo / QA readiness checks.
- `docs/phase-log.md` records Phase 10 status, changed files, checks, known TODOs, and readiness for Phase 11.
- `README.md` and/or `ios-app/README.md` link to or summarize the new MVP demo readiness docs.
- The docs clearly state the app is local/mock-only today.
- The docs clearly state no real Firebase, real AI, Cloud Functions, StoreKit, quota enforcement, persistence, export, or save-to-Photos exists today.
- The docs include iPhone Simulator and optional physical device test notes.
- The docs include small-screen layout checks.
- The docs include localization and raw-key checks.
- The docs include no-secrets and forbidden-import checks.
- No Swift code is modified unless it is tiny wording-only polish and explicitly documented.
- No backend code is modified.
- No dependency is added.
- No secret, credential, production config, Firebase project ID, Gemini key, OpenAI key, or Apple credential is added.
- Phase 11 is not started.

## 16. Tests / manual checks

Because Phase 10 is expected to be documentation-first, tests are mostly file review and safety scans.

Run:

```bash
git status --short
git diff --check
test -f docs/mvp-demo-script.md && echo "demo script exists"
test -f docs/mvp-known-limitations.md && echo "known limitations exists"
test -f docs/mvp-readiness-checklist.md && echo "readiness checklist exists"
rg -n "Phase 10|MVP Demo|QA|Release Readiness|known limitations|readiness" docs/phase-log.md tests/manual-smoke-tests.md README.md ios-app/README.md docs/mvp-demo-script.md docs/mvp-known-limitations.md docs/mvp-readiness-checklist.md
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "FirebaseApp\\.configure|httpsCallable|Functions\\.functions|URLSession|putData|putFile|setData\\(|addDocument\\(|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|UserDefaults|CoreData|SwiftData|Product\\.products" ios-app/AIPhotoApp functions/src -g '*.swift' -g '*.ts'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

If Swift code is not modified, state clearly that Xcode build was not required because Phase 10 only changed documentation.

If Swift code is modified for wording-only polish, run or request Xcode build verification:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' build
```

If command-line Xcode build fails because of local sandbox / CoreSimulator / SwiftUI Preview macro environment issues, report the exact reason and ask the user to verify in Xcode.

Manual demo QA checks should include:

- Build and run the app in Xcode / Simulator if UI code changed.
- Run the documented demo script.
- Confirm the demo script matches current UI.
- Confirm known limitations are accurate.
- Confirm no doc claims real cloud / real AI / real subscription exists.
- Confirm no secrets or production configs are present.
- Confirm no Phase 11 work was started.

## 17. Completion requirement

Before finishing Phase 10 implementation, update `docs/phase-log.md`.

The Phase 10 log entry must include:

- Status.
- Date.
- Summary.
- Completed work.
- Changed files.
- Tests / manual checks.
- Known TODOs.
- Whether Xcode build was run, or why it was not required for docs-only changes.
- Whether no-secrets checks were run.
- Whether forbidden imports were checked.
- Whether real Firebase / AI / Cloud Functions / StoreKit / persistence / upload / export were intentionally not added.
- Ready for Phase 11: yes/no.

Also update `tests/manual-smoke-tests.md` with Phase 10 QA / demo readiness checks.

Also update `README.md` and/or `ios-app/README.md` so future readers can find the MVP demo docs.

When done:

- Do not automatically commit.
- Do not automatically push.
- Do not start Phase 11.
- Report changed files.
- Report implemented summary.
- Report verification results.
- Report known TODOs.
- Report manual test steps.
- State whether user confirmation is needed before commit / push.
