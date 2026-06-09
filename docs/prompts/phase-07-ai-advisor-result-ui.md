# Phase 07: AI Photo Advisor Result UI

## 1. Phase name

Phase 07 - AI Photo Advisor Result UI Scaffold

## 2. Goal

Build the iOS mock AI Photo Advisor result UI flow using the Phase 06 mock analysis service.

After a user selects or captures one photo, applies a Phase 04 local filter preset, and reaches the Phase 05 mock save area, the app should be able to trigger mock AI analysis and display a structured mock advice result.

This phase is UI-only and mock-only:

- No real Gemini call.
- No real OpenAI call.
- No Cloud Functions call or deploy.
- No Firebase upload, Firestore write, or Storage write.
- No persistence of AI results.
- No secrets or production credentials.

## 3. Current repo status

Expected starting state:

- Repo path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Current branch: `feat/phase-02-auth`
- Latest committed phase: Phase 06 AI Photo Advisor Backend / Service Scaffold
- Latest commit at prompt generation time: `95226d6 feat: add phase 06 AI photo advisor scaffold`
- Local branch is expected to be synchronized with `origin/feat/phase-02-auth`
- Working tree should be clean before implementation starts
- `ios-app/AIPhotoApp.xcodeproj` exists
- Phase 01/02 Mac/Xcode build succeeded
- Phase 03 Camera + Photo Picker scaffold completed, manually checked, committed, and pushed
- Phase 04 Local Core Image Filter Presets completed, manually checked, committed, and pushed
- Phase 05 Firebase Storage / Firestore mock save scaffold completed, manually checked, committed, and pushed
- Phase 06 AI Photo Advisor backend/service scaffold completed, manually checked, committed, and pushed
- `docs/phase-log.md` records Phase 06 completed / manually checked
- `tests/manual-smoke-tests.md` has Phase 06 checks

Phase 07 has not started yet.

## 4. Read first

Before implementing Phase 07, read:

- `README.md`
- `AGENTS.md`
- `docs/00-common-background-v2.md`
- `docs/01-product-mvp-scope.md`
- `docs/02-technical-architecture.md`
- `docs/03-camera-filter-image-pipeline.md`
- `docs/04-ai-photo-advisor.md`
- `docs/05-firebase-storage-firestore-functions.md`
- `docs/07-subscription-quota-storekit.md`
- `docs/08-privacy-security-app-store-risk.md`
- `docs/09-codex-phase-plan.md`
- `docs/phase-log.md`
- `docs/prompts/phase-03-camera-picker.md`
- `docs/prompts/phase-04-filters.md`
- `docs/prompts/phase-05-firebase-storage-firestore.md`
- `docs/prompts/phase-06-ai-photo-advisor-backend.md`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`

Also inspect the existing Phase 06 iOS AI service scaffold under:

- `ios-app/AIPhotoApp/Services/AIPhotoAdvisor/`

## 5. Pre-implementation checks

Run these checks before editing files:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short
git log --oneline -3
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc"
rg -n "import Firebase|import FirebaseFunctions|import StoreKit|Gemini|OpenAI|apiKey|API_KEY|private_key|projectId" ios-app functions docs --glob '!docs/prompts/phase-07-ai-advisor-result-ui.md'
```

Expected:

- Current branch is `feat/phase-02-auth`
- Working tree is clean
- Latest commit is the Phase 06 AI photo advisor scaffold commit
- Local branch is synchronized with `origin/feat/phase-02-auth`
- `ios-app/AIPhotoApp.xcodeproj` exists
- No real Firebase config, API keys, private keys, Gemini keys, OpenAI keys, Apple credentials, or production secrets are present
- No iOS Firebase / FirebaseFunctions / Gemini / OpenAI / StoreKit imports are present for this phase

If any pre-check fails, report it before making functional changes.

## 6. This phase should only do

Implement a mock-only AI Photo Advisor result UI scaffold:

- Add an AI analysis mock trigger UI after the filtered preview / mock save flow.
- Use the existing Phase 06 `PhotoAnalysisService` contract.
- Default to `MockPhotoAnalysisService`.
- Add local-only in-memory AI analysis state.
- Show loading, success, and failure states.
- Show retry and dismiss controls.
- Display the mock `PhotoAnalysisResult`.
- Display one short summary.
- Display up to three actionable suggestions.
- Display simple adjustment hints.
- Display composition / lighting notes if available in the existing model or safe to represent from existing mock data.
- Clearly label the result as mock / scaffold only.
- Keep result state local to the current selected photo flow.
- Update English and Traditional Chinese localization.
- Update `ios-app/README.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `docs/phase-log.md`.

## 7. This phase must not do

Do not start Phase 08.

Do not add or implement:

- Gemini API key
- OpenAI API key
- Firebase project ID
- `GoogleService-Info.plist`
- `.env`
- `.firebaserc`
- Private key
- OAuth secret
- Apple credential
- Real Gemini call
- Real OpenAI call
- Real Cloud Functions call
- Cloud Functions deploy
- Firebase upload
- Firestore write
- Storage write
- AI result persistence
- History persistence
- Save AI result to history
- AI chat follow-up
- Image editing
- Generative edit
- Realtime video AI
- StoreKit
- Subscription
- Paywall
- Quota enforcement
- AI billing
- Training consent flow
- Production Firebase setup
- New npm dependency
- New third-party AI SDK dependency

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

## 8. Suggested files to create or modify

Suggested new files:

- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisViewModel.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisResultView.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisSuggestionCard.swift`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAdjustmentHintCard.swift`

Suggested existing files to modify:

- `ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Services/AIPhotoAdvisor/MockPhotoAnalysisService.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `ios-app/AIPhotoApp.xcodeproj/project.pbxproj`
- `ios-app/README.md`
- `tests/manual-smoke-tests.md`
- `docs/phase-log.md`

Only modify the files needed for the mock UI scaffold. Keep changes small and consistent with the existing SwiftUI architecture.

If new Swift files are added, ensure they are included in the Xcode project target so Xcode can build without missing type errors.

## 9. Technical requirements

- Use Swift + SwiftUI.
- Use the Phase 06 `PhotoAnalysisService` protocol.
- Use `MockPhotoAnalysisService` as the default service.
- Keep `CloudFunctionPhotoAnalysisService` placeholder-only.
- The UI must not directly depend on Gemini, OpenAI, Firebase, FirebaseFunctions, or Cloud Functions.
- Analysis state must be local memory only.
- Do not persist analysis state to disk, Firestore, Storage, UserDefaults, or history.
- Do not upload the selected image.
- Do not send the selected image to any backend.
- Do not save the selected image to Photos.
- Do not add StoreKit or quota logic.
- Use async-friendly state handling so mock analysis loading does not block the main thread.
- Reset or dismiss analysis state when the selected photo is cleared.
- Preserve Phase 03 Camera, Phase 04 Filters, and Phase 05 Mock Save behavior.
- Keep models and display logic separated from SwiftUI views where practical.
- Avoid hard-coding all mock result copy in the view; prefer existing model data from `MockPhotoAnalysisService`.
- Keep placeholder copy honest: this is mock advice and not real AI analysis.

## 10. UI / UX requirements

The Phase 07 UI should appear after the filtered preview / mock save area in the selected photo flow.

Required UI behavior:

- Show a mock AI entry point, for example:
  - `Analyze photo (mock)`
  - `Mock AI advice`
- Clearly label the feature as Phase 07 mock / scaffold only.
- Tapping the mock analysis button starts a visible loading state.
- Mock success shows a structured result.
- Mock failure shows a clear error state.
- The user can retry after failure.
- The user can dismiss or clear the current analysis result.
- The result view should be readable in both English and Traditional Chinese localization.
- Continue / Save / Analyze controls must not trigger upload, Firestore, Storage, real AI, StoreKit, quota, export, or history persistence.

Suggested result layout:

- Mock/scaffold status badge
- Short summary
- Suggestion cards, up to three
- Adjustment hint cards
- Optional notes section for composition / lighting if available
- Retry / dismiss actions

Keep the UI simple and app-like. Do not build a chat interface, paywall, quota meter, provider picker, or production AI settings screen in this phase.

## 11. AI result display contract

The UI should display the Phase 06 mock result contract.

Expected result fields:

- `summary`
  - One short sentence.
- `suggestions`
  - Maximum of three visible suggestions.
  - Each suggestion should include a title or label if available.
  - Each suggestion should include a short detail / rationale if available.
  - Priority may be displayed if the existing model supports it.
- `adjustmentHints`
  - Display control / adjustment name.
  - Display suggested value or display value.
  - Display reason if available.
- `provider`
  - Retain or display as `mock`.
- `isMock`
  - Must be `true` for Phase 07 results.
- `status`
  - Supports idle / loading / completed / failed.

Rules:

- Do not invent a production provider response.
- Do not claim the result is real AI advice.
- Do not display any raw prompt or provider payload.
- Do not display internal secrets, file paths, URLs, or local image identifiers.
- If the existing model does not include a field, do not force an unrelated model change unless it is small, local, and necessary for the mock UI.

## 12. Privacy / App Store requirements

- Keep all Phase 07 analysis mock-only and local.
- Do not upload photos.
- Do not call production AI providers.
- Do not write Firestore or Storage.
- Do not save AI results to history.
- Do not save images or results to disk.
- Do not add tracking.
- Do not add analytics.
- Do not add ad SDKs.
- Do not add training-data consent UI in this phase.
- Do not imply that the app provides professional, guaranteed, or safety-critical advice.
- Keep copy clear that the feature is a scaffold/mock preview.

## 13. AI safety / secret safety requirements

- No Gemini key.
- No OpenAI key.
- No Firebase project ID.
- No `GoogleService-Info.plist`.
- No `.env`.
- No `.firebaserc`.
- No private key.
- No OAuth secret.
- No Apple credential.
- No provider SDK import.
- No production Cloud Functions endpoint.
- No deployed function.
- No real AI call.

After implementation, run checks such as:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|Gemini|OpenAI|apiKey|API_KEY|private_key|projectId" ios-app functions docs
```

If these checks return references in documentation or placeholders, verify they are clearly non-secret and non-production. If any real secret or production config appears, stop and report it.

## 14. Acceptance criteria

Phase 07 is acceptable when:

- App builds in Xcode.
- Existing Phase 03 Camera / Photo Picker scaffold still works.
- Existing Phase 04 filter preset switching still works.
- Existing Phase 05 mock save success / failure still works.
- Mock AI analysis can be triggered from the selected filtered photo flow.
- Loading state is visible.
- Mock success state displays one summary.
- Mock success state displays up to three suggestions.
- Mock success state displays adjustment hints.
- Mock result clearly shows it is mock / scaffold only.
- Mock failure state is visible.
- Retry works for mock failure.
- Dismiss or clear works for current analysis result.
- Analysis state remains local in memory.
- No upload occurs.
- No Firestore write occurs.
- No Storage write occurs.
- No real Gemini / OpenAI call occurs.
- No Cloud Functions call or deploy occurs.
- No StoreKit, quota, paywall, or subscription behavior is added.
- No AI result is persisted to history.
- No image or result is exported or saved to Photos.
- No secrets or production Firebase config are added.
- `ios-app/README.md` documents the Phase 07 mock-only AI result UI.
- `tests/manual-smoke-tests.md` includes Phase 07 checks.
- `docs/phase-log.md` records Phase 07 implementation status.

## 15. Tests / manual checks

Implementation should run safe local checks where possible:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
git status --short
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 16' build
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|Gemini|OpenAI|apiKey|API_KEY|private_key|projectId" ios-app functions docs
```

If the exact simulator destination is unavailable, use an available iOS Simulator destination and report the command used.

Manual Xcode / Simulator checks:

- Build and run `AIPhotoApp`.
- Sign in with mock Auth or continue as guest.
- Open Home.
- Open Camera.
- Pick one photo from the photo picker.
- Apply Classic Film.
- Apply Warm Vintage.
- Apply Faded Chrome.
- Return to Original / None.
- Trigger mock save success.
- Trigger mock save failure.
- Trigger mock AI analysis success.
- Confirm loading state appears.
- Confirm result summary appears.
- Confirm up to three suggestions appear.
- Confirm adjustment hints appear.
- Confirm mock/scaffold label is visible.
- Trigger or simulate mock AI failure if supported.
- Confirm failure state appears.
- Retry after failure.
- Dismiss or clear result.
- Confirm Home / History / Settings still render.
- Confirm History does not persist AI result.
- Confirm no upload, Firestore write, Storage write, real AI call, Cloud Functions call, StoreKit, quota, paywall, export, or save-to-Photos behavior occurs.

Manual physical iPhone / iPad checks, if available:

- Build and run on device.
- Capture one photo.
- Apply one preset.
- Trigger mock save.
- Trigger mock AI analysis.
- Confirm result UI appears.
- Confirm no real network upload or provider call occurs.

## 16. Completion requirement

When Phase 07 implementation is complete:

- Update `docs/phase-log.md`.
- Update `tests/manual-smoke-tests.md`.
- Update `ios-app/README.md`.
- Run an Xcode build or clearly report why it could not be run.
- Confirm no real AI, Firebase, Cloud Functions, StoreKit, quota, persistence, upload, Firestore write, or Storage write was added.
- Confirm no secrets or production config were added.
- Do not commit automatically.
- Do not push automatically.
- Do not start Phase 08.
- Wait for user Xcode verification before commit / push.

Final response after implementation should include:

- Changed files
- Implemented summary
- Verification result
- Known TODOs
- Manual test steps
- Whether user should verify in Xcode
- Ready for Phase 08: no, until Phase 07 is manually verified, committed, and pushed
