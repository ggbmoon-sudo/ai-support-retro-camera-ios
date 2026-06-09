# Phase 14 Prompt: Live Camera Guidance Mock UX

Use this prompt in a new Codex session only when Phase 14 is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected state: Phase 13 expanded filter library / 20 presets completed, manually verified, committed, pushed, and read-only confirmed
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, and future live shooting guidance

## Current Repo Status

The app currently has:

- Camera-first flow.
- Camera shell with large viewfinder.
- Photo Picker fallback.
- Local Core Image filter pipeline.
- Expanded local filter catalog with 20 research presets.
- `Original` as no-filter.
- Legacy starter filters:
  - Classic Film
  - Warm Vintage
  - Faded Chrome
- Batch 1 hero filters:
  - Soft Warm 400
  - Summer Gold 200
  - Street Chrome
  - Soft Sun Portrait
  - Cinema Flat
  - Silver Gradation
- Filter picker grouping / category UI.
- Mock save success / failure.
- Mock AI analysis success / failure after capture/import.
- Local session history.
- History and Settings tabs.

The app still does not include:

- Real Firebase upload, Firestore write, or Storage write.
- Real Cloud Functions calls.
- Real Gemini or OpenAI calls.
- StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Disk persistence, UserDefaults persistence, Core Data, or SwiftData.
- Cloud history or sync.
- Export or save-to-Photos.
- Production Firebase config.
- Real secrets, API keys, Firebase project IDs, private keys, or Apple credentials.

## Phase 14 Goal

Create a local/mock Live Camera Guidance UX on the Camera screen.

This phase is the first UX step toward future pre-capture shooting guidance. It should show short mock shooting suggestions inside or near the viewfinder before the user captures/imports a photo.

Phase 14 must remain UI-only and local/mock-only:

- Do not implement real AI live guidance.
- Do not implement a Vision frame-analysis prototype.
- Do not analyze real video frames.
- Do not read, upload, stream, or persist camera frames.
- Do not implement Gemini Live.
- Do not implement voice input.
- Do not implement ASR or Parakeet.
- Do not claim the guidance is real AI.

The guidance should feel like a camera overlay, not a content page or long article.

## Phase 14R Research Conclusions

Phase 14R integrated the Live Camera Guidance, Spoken Camera Assistant, and Gemini Live research into repo docs.

Key conclusions to follow during Phase 14:

- Phase 14 should build mock UX only.
- Phase 15 is the earliest phase for local rule-based / Apple Vision prototype work.
- Phase 16 is the earliest phase for server-side low-frequency snapshot AI.
- Phase 17 is the earliest phase for Gemini Live voice + visual assistant research.
- Voice input belongs to a future branch, not Phase 14.
- Parakeet TDT 0.6B is not suitable as an iPhone on-device solution and is not a good primary Cantonese / Traditional Chinese ASR route.
- Gemini Live is long-term experimental research, not an MVP guidance engine.
- Continuous viewfinder upload and real-time cloud video AI should not enter the MVP.

## Read First

Run read-only checks:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -5
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
test -d ios-app/AIPhotoApp.xcodeproj && echo "xcode project exists" || echo "missing xcode project"
```

Read:

- `README.md`
- `AGENTS.md`
- `ios-app/README.md`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `docs/product-roadmap-next.md`
- `docs/feature-change-requests.md`
- `docs/mvp-demo-script.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/filter-roadmap.md`
- `docs/live-camera-guidance-research.md`
- `docs/spoken-camera-assistant-research.md`
- `docs/gemini-live-implementation-notes.md`
- `docs/live-guidance-roadmap.md`
- `docs/prompts/phase-13-expanded-filter-library-20-presets.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/`
- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Features/AIAnalysis/` or the existing mock AI result feature folder, if relevant to wording
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Settings/SettingsView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is Phase 13 expanded filter library / 20 presets.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 14 has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 14 should do:

1. Add a live guidance mock overlay to the Camera screen.
2. Show 1-3 short shooting suggestions at a time.
3. Add a guidance toggle that can turn mock guidance on/off.
4. Add a visible mock guidance state:
   - idle
   - scanning
   - suggestion available
   - paused / off
5. Keep guidance local-only and clearly mock/scaffolded.
6. Keep guidance copy short, calm, and camera-friendly.
7. Make the UI look like a camera overlay, not a paragraph-heavy page.
8. Ensure the overlay does not block:
   - capture button
   - filter picker entry
   - Photo Picker import button
   - flash / timer / camera flip controls
   - tab navigation
9. Preserve camera-first flow.
10. Preserve all 20 local filters and filter grouping.
11. Preserve Photo Picker fallback.
12. Preserve mock save, mock AI analysis, local session history, History, and Settings.
13. Update English and Traditional Chinese localization strings.
14. Introduce or reserve a small provider abstraction only if it helps keep Phase 14 mock guidance replaceable in later phases.
15. Use `MockLiveGuidanceProvider` as the only active provider in Phase 14 if a provider is added.
16. Do not implement real future providers; keep future provider names as documentation/comments/placeholders only if needed.
17. Update:
   - `docs/phase-log.md`
   - `tests/manual-smoke-tests.md`
   - `README.md` if current phase/status or feature summary needs update
   - `ios-app/README.md` if iOS implementation notes need update

## Do Not Do

- Do not start Phase 15.
- Do not implement real AI live guidance.
- Do not call Gemini.
- Do not call OpenAI.
- Do not call Cloud Functions.
- Do not connect real Firebase.
- Do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit in iOS.
- Do not implement a Vision frame-analysis prototype.
- Do not import or use Vision for frame analysis in Phase 14.
- Do not add Apple Vision guidance logic.
- Do not read live video frames for guidance.
- Do not upload camera frames.
- Do not stream camera frames.
- Do not persist camera frames.
- Do not add live video upload.
- Do not add real-time cloud video AI.
- Do not add Gemini Live.
- Do not add realtime WebSocket sessions.
- Do not add ephemeral token handling.
- Do not add voice input.
- Do not add ASR.
- Do not add Parakeet.
- Do not add microphone permission copy.
- Do not add speech recognition permission copy.
- Do not add AI custom filter generation.
- Do not add AI reference image analysis.
- Do not add AI image generation or editing.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not add persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Do not add npm dependencies.
- Do not add third-party SDKs.
- Do not modify backend code.
- Do not auto-commit.
- Do not auto-push.

## Suggested Files

Prefer the existing structure and style. Keep changes small and reviewable.

Likely iOS files:

- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift` if the overlay belongs near the preview shell
- A new small SwiftUI view under `ios-app/AIPhotoApp/Features/Camera/`, only if it keeps `CameraView` readable, for example:
  - `LiveGuidanceOverlayView.swift`
  - `LiveGuidanceToggleView.swift`
- A new small local model file under `ios-app/AIPhotoApp/Features/Camera/`, only if useful:
  - `LiveGuidanceMockState.swift`
  - `LiveGuidanceSuggestion.swift`
- A small provider boundary under `ios-app/AIPhotoApp/Features/Camera/`, only if it keeps the mock UX clean:
  - `LiveGuidanceProvider.swift`
  - `MockLiveGuidanceProvider.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Likely docs:

- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `README.md` if current phase/status needs update
- `ios-app/README.md` if implementation notes need update

Avoid touching:

- `functions/`
- `firebase/`
- package/dependency files
- Xcode project settings unless absolutely required for new Swift files in the existing project setup

## UX Requirements

The guidance overlay should:

- Feel integrated with the camera shell.
- Sit inside or near the viewfinder without covering the main subject too aggressively.
- Use compact rows, chips, badges, translucent panels, or minimal camera-chrome styling.
- Show a small state indicator such as `Mock guidance`, `Scanning`, or `Paused`.
- Make the on/off state obvious.
- Be easy to reach with one hand.
- Avoid long explanatory text.
- Avoid marketing copy.
- Avoid implying the app is analyzing the real camera feed.
- Avoid implying advice comes from Gemini, OpenAI, or any real AI provider.
- Avoid implying Gemini Live, Apple Vision, ASR, voice input, or cloud snapshot guidance exists.
- Avoid blocking core controls.
- Work on small iPhone screens without text overlap.
- Keep the viewfinder visually dominant.
- Respect light/dark behavior if the existing camera shell uses dark UI.

Example suggestion copy:

- `Frame is a little dark. Move closer to a light source.`
- `Try placing the subject closer to center.`
- `The background feels busy. Shift angle slightly.`
- `Leave a little more headroom.`
- `Try a warm filter for portraits.`

Traditional Chinese examples:

- `畫面有點暗，試試移近光源。`
- `主體可以再靠中間少少。`
- `背景有點雜亂，試試換個角度。`
- `頭頂可以多留一點空間。`
- `人像可以試試暖色濾鏡。`

Keep the shipped copy short. It is fine to include only a few suggestions for Phase 14.

## Mock State Model

Use a simple local state model. Do not overbuild.

Suggested enum shape:

```swift
enum LiveGuidanceMockState: String, CaseIterable, Sendable {
    case off
    case idle
    case scanning
    case suggestionAvailable
    case paused
}
```

Suggested local suggestion shape:

```swift
struct LiveGuidanceSuggestion: Identifiable, Hashable, Sendable {
    let id: String
    let messageKey: String
    let category: LiveGuidanceSuggestionCategory
}
```

Possible categories:

- lighting
- composition
- background
- portrait
- filter

Implementation guidance:

- The toggle may simply switch between `off` and `idle` / `scanning`.
- `scanning` may be a timed mock UI state, but it must not inspect frames.
- `suggestionAvailable` may show 1-3 static or rotated local suggestions.
- Suggestions may be deterministic or lightly randomized in memory only.
- Do not persist the toggle state.
- Do not use `UserDefaults`.
- Do not store guidance results in history.
- Do not send guidance results to mock AI unless already established by existing flow and explicitly local-only.
- Do not add quotas, credits, or premium gating.
- Do not add microphone or speech-recognition state.
- Do not add any frame-analysis state.

## Provider Abstraction Requirements

Phase 14 may add a lightweight provider boundary if it keeps the camera code clearer. The only active provider should be mock/local.

Suggested future-facing names:

- `MockLiveGuidanceProvider`
- `FutureLocalRuleBasedGuidanceProvider`
- `FutureVisionGuidanceProvider`
- `FutureCloudSnapshotGuidanceProvider`
- `FutureGeminiLiveGuidanceProvider`

Phase 14 implementation rules:

- `MockLiveGuidanceProvider` may return static or deterministic local mock suggestions.
- Future providers must not be implemented as real providers in Phase 14.
- Future provider names may appear in docs, comments, or non-operational placeholders only if useful for architecture clarity.
- Do not import Vision for `FutureVisionGuidanceProvider`.
- Do not add Cloud Functions, Gemini, OpenAI, WebSocket, or networking for future cloud providers.
- Do not add voice / ASR / Parakeet providers.
- Do not add protocol requirements that force frame buffers, snapshots, audio, network clients, persistence, or credentials into Phase 14.

## Localization Requirements

Add localized strings for:

- Guidance toggle on/off labels.
- Guidance state labels.
- Overlay title or short status label.
- 1-3 or more mock guidance suggestion messages.
- Any accessibility labels for icon-only controls.

Requirements:

- English and Traditional Chinese must both be updated.
- Do not leave raw localization keys visible.
- Do not mention Gemini, OpenAI, Firebase, Cloud Functions, StoreKit, or real AI in the guidance overlay.
- Do not mention Apple Vision, ASR, Parakeet, or voice input in the guidance overlay.
- Use wording such as `Mock guidance`, `Local guide`, or equivalent if a disclaimer is needed.
- Keep text short enough for compact camera controls.

## Acceptance Criteria

Phase 14 is acceptable when:

- App builds.
- Camera-first flow still opens normally.
- Camera screen shows a live guidance mock overlay.
- Guidance toggle can turn the overlay on/off.
- Mock state is visible and can represent idle, scanning, suggestion available, and paused/off.
- Overlay shows 1-3 short mock shooting suggestions.
- Overlay looks like a camera overlay and does not become a long article.
- Overlay does not block capture, Photo Picker import, filter picker, flash/timer/flip controls, History, or Settings.
- Photo Picker fallback still works.
- All 20 local filters and filter grouping still work.
- Original remains no-filter.
- Legacy starter filters remain available or clearly mapped.
- Mock save success/failure still works.
- Mock AI analysis success/failure still works.
- Local session history still works.
- History and Settings still work.
- English and Traditional Chinese localization work without raw keys.
- `docs/phase-log.md` is updated.
- `tests/manual-smoke-tests.md` is updated.
- If a provider abstraction is added, only the mock provider is active.
- No real AI, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, Cloud Functions, Firebase, StoreKit, persistence, upload, export, save-to-Photos, secrets, or backend changes were added.

## Manual Test Steps

Run in Xcode / Simulator:

1. Launch the app.
2. Confirm it enters the camera-first surface.
3. Confirm the guidance overlay appears in the Camera screen when enabled.
4. Toggle guidance off and confirm the overlay hides or enters paused/off state.
5. Toggle guidance on and confirm idle/scanning/suggestion state appears.
6. Confirm 1-3 short suggestions appear.
7. Confirm the overlay does not cover or disable capture controls.
8. Tap filter picker and confirm grouped filter UI still opens.
9. Switch several filters and confirm no freeze.
10. Confirm all 20 research presets remain available.
11. Confirm Photo Picker fallback still works.
12. Import one image.
13. Confirm selected-photo flow still works.
14. Trigger mock save success and failure.
15. Trigger mock AI analysis success and failure.
16. Confirm local session history receives the session.
17. Open History.
18. Open Settings.
19. Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Vision frame analysis, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.
20. Confirm no raw localization keys appear.

Optional physical-device check:

1. Build and run on a physical iPhone.
2. Confirm camera permission / preview behavior still works.
3. Confirm the guidance overlay remains readable over the live preview.
4. Confirm the overlay does not visibly harm camera responsiveness.
5. Confirm no frame analysis, frame upload, voice input, ASR, persistence, export, or real-service behavior occurs.

## Verification Commands

After implementation, run:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
git status --short
git diff --check
rg -n "^\s*import\s+(Firebase|FirebaseFunctions|FirebaseStorage|FirebaseFirestore|Gemini|OpenAI|StoreKit)\b" ios-app/AIPhotoApp -g '*.swift'
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "(AIza[0-9A-Za-z_-]{20,}|sk-[A-Za-z0-9_-]{20,}|-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----)" . -g '!**/.git/**'
git diff -U0 -- ios-app/AIPhotoApp | rg -n "(FirebaseApp|FirebaseStorage|Storage\.storage|Firestore|Firestore\.firestore|Functions\.functions|URLSession|Gemini|OpenAI|StoreKit|UserDefaults|CoreData|SwiftData|modelContainer|VNImageRequestHandler|Vision|CMSampleBuffer|CVPixelBuffer|captureOutput|WebSocket|SpeechRecognizer|SpeechAnalyzer|SpeechTranscriber|SFSpeech|AVAudioSession|NSMicrophoneUsageDescription|NSSpeechRecognitionUsageDescription|Parakeet|performChanges|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\.shared|quota|paywall|subscription)"
```

Build if the local environment allows:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase14-derived CODE_SIGNING_ALLOWED=NO build
```

If CLI build fails due CoreSimulator / sandbox restrictions, report that clearly and ask the user to verify in Xcode / Simulator. Do not hide real Swift compile errors if they appear.

## Completion Response Requirements

When Phase 14 implementation is complete, respond with:

- changed files
- summary
- mock guidance UX summary
- mock state model summary
- localization summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 15: no, until Phase 14 commit/push/read-only confirmation completed

Do not commit.

Do not push.

Do not start Phase 15.
