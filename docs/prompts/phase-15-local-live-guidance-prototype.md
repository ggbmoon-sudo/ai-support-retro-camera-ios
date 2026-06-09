# Phase 15 Prompt: Local Live Guidance Prototype

Use this prompt in a new Codex session only when Phase 15 is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `0da304b feat: add phase 14 live guidance mock and camera refinements`
- Expected repo status before starting: working tree clean and synchronized with `origin/feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, local session history, and progressively improving pre-capture shooting guidance

## Current Repo Status

Phase 14 / 14B / 14C have been completed, committed, pushed, and read-only confirmed.

The app currently has:

- Camera as the primary screen / first selected tab.
- Dazz-like compact framed camera viewport.
- Live Guidance mock overlay.
- Guidance overlay positioned outside the main viewfinder and near the control area.
- Mock lens selector UI scaffold.
- Photo Picker fallback.
- Selected-photo / imported-photo fixed Back to Camera / Clear controls.
- Local Core Image filter pipeline.
- Expanded local filter catalog with 20 research presets and grouping.
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
- Mock save success / failure.
- Mock AI analysis success / failure after capture/import.
- Local session history.
- Inspiration, History, and Settings tabs.

The app still does not include:

- Real Firebase upload, Firestore write, or Storage write.
- Real Cloud Functions calls.
- Real Gemini or OpenAI calls.
- Gemini Live.
- Voice input, ASR, or Parakeet.
- StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Disk persistence, UserDefaults persistence, Core Data, or SwiftData.
- Cloud history or sync.
- Export or save-to-Photos.
- Production Firebase config.
- Real secrets, API keys, Firebase project IDs, private keys, or Apple credentials.

## Phase 15 Goal

Build the first local live guidance prototype.

This phase should move beyond Phase 14 mock-only guidance by adding a limited on-device local guidance provider using rule-based logic, Apple Vision where appropriate, and carefully throttled AVFoundation frame sampling if needed.

Phase 15 is a technical prototype, not a cloud AI feature.

Phase 15 should:

- Keep the current camera-first flow.
- Keep the Phase 14 mock guidance provider as a fallback / switchable mode.
- Add a local provider that can produce simple pre-capture suggestions from on-device signals.
- Keep guidance suggestions short and camera-like.
- Avoid blocking capture, filter picker, Photo Picker, lens selector, tab navigation, or preview responsiveness.
- Never store, upload, stream, or log raw frames.

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
- `docs/live-camera-guidance-research.md`
- `docs/spoken-camera-assistant-research.md`
- `docs/gemini-live-implementation-notes.md`
- `docs/live-guidance-roadmap.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/filter-roadmap.md`
- `docs/prompts/phase-14-live-camera-guidance-mock-ux.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/`
- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Features/AIPhotoAdvisor/`
- `ios-app/AIPhotoApp/App/MainTabShellView.swift`
- `ios-app/AIPhotoApp/Features/Home/HomeView.swift`
- `ios-app/AIPhotoApp/Features/Settings/SettingsView.swift`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is `0da304b feat: add phase 14 live guidance mock and camera refinements`.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 15 has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 15 should do:

1. Add a local live guidance provider on top of the existing Phase 14 guidance architecture.
2. Preserve the Phase 14 mock guidance provider.
3. Add a provider switch / local guidance mode toggle if needed so mock and local guidance can be selected or gracefully fallback.
4. Add local guidance domain models such as:
   - `LiveGuidanceSignal`
   - `LiveGuidanceSuggestion`
   - `LiveGuidanceFrameAnalyzer`
   - `LiveGuidanceSuggestionComposer`
5. Add a local provider such as:
   - `LocalRuleBasedGuidanceProvider`
6. Keep or extract a mock provider such as:
   - `MockLiveGuidanceProvider`
7. Use Apple Vision only for narrow local, on-device guidance signals where useful.
8. Use AVFoundation frame sampling only if needed and only with strict throttling.
9. Add minimal on-device signals such as:
   - too dark
   - too bright
   - face rectangle
   - face position
   - headroom
   - subject center approximation
   - face too close
   - face too far
   - warm filter suggestion for portrait / low-light
10. Keep the guidance overlay short and camera-like.
11. Keep the guidance overlay below / outside the main viewfinder obstruction.
12. Ensure Simulator without a real camera frame gracefully falls back to mock or sample state.
13. Preserve camera preview responsiveness.
14. Preserve capture controls.
15. Preserve filter picker and all 20 filters / grouping.
16. Preserve Photo Picker import.
17. Preserve selected-photo / imported-photo Back to Camera / Clear.
18. Preserve mock save, mock AI, local session history, Inspiration, History, and Settings.
19. Update English and Traditional Chinese localization.
20. Update:
   - `docs/phase-log.md`
   - `tests/manual-smoke-tests.md`
   - `README.md` if current phase/status or feature summary needs update
   - `ios-app/README.md` if iOS implementation notes need update

## Suggested Local Guidance Architecture

Prefer small files and the repo's existing SwiftUI / ViewModel style.

Suggested files:

- Existing:
  - `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
  - `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceToggleView.swift`
- New, if useful:
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceProvider.swift`
  - `ios-app/AIPhotoApp/Features/Camera/MockLiveGuidanceProvider.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestion.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameAnalyzer.swift`
  - `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`

Keep the shape simple. Do not introduce a broad app architecture rewrite.

Possible model direction:

- `LiveGuidanceProvider`
  - Produces a guidance state and 1-3 short suggestions.
  - Supports mock and local provider implementations.
- `MockLiveGuidanceProvider`
  - Keeps the existing Phase 14 mock suggestions working.
- `LocalRuleBasedGuidanceProvider`
  - Converts `LiveGuidanceSignal` values into short user-facing suggestions.
  - Falls back to mock/sample suggestions if no local frame signal is available.
- `LiveGuidanceFrameAnalyzer`
  - Optionally receives throttled camera frames.
  - Extracts local-only signals such as brightness and face rectangle.
  - Does not store, upload, stream, persist, or log raw frames.
- `LiveGuidanceSuggestionComposer`
  - Converts signals into localized short suggestions.

## Apple Vision / AVFoundation Scope

Phase 15 may use Apple Vision for local on-device analysis only.

Allowed:

- `import Vision` only in files that perform local on-device guidance analysis.
- Minimal Vision face rectangle detection.
- Face position / headroom approximations.
- Subject center approximation from local Vision signals.
- AVFoundation video frame sampling if it is clearly throttled and local-only.

Required if using frame sampling:

- Throttle analysis; do not analyze every frame.
- Keep heavy analysis off the main thread.
- Return UI updates to the main actor/thread.
- Do not retain raw frames after analysis.
- Do not log raw image data, base64 image data, pixel buffers, or frame metadata that could identify user content.
- Do not upload or stream frames.
- Do not persist frames.
- Keep capture and preview responsive.

If camera pipeline work becomes too risky:

- Shrink the scope.
- Prefer brightness or sample-image/fallback local signals.
- Preserve mock fallback.
- Do not destabilize Camera capture or Photo Picker flow.

## Minimum Viable Phase 15 Delivery

Aim for this before expanding anything:

1. Local guidance mode or provider switch.
2. Mock guidance mode still works.
3. Too dark / too bright suggestion.
4. At least one face/framing suggestion when a local face signal is available, for example:
   - `主體可以再靠中間少少`
   - `頭頂可以多留一點空間`
   - `人像距離可以稍微退後`
5. Warm filter suggestion for portrait or low-light.
6. Clear fallback when local analysis is unavailable.
7. Simulator without camera does not crash.

## Do Not Do

- Do not start Phase 16.
- Do not connect Gemini Live.
- Do not call Gemini.
- Do not call OpenAI.
- Do not call Cloud Functions.
- Do not do cloud snapshot guidance.
- Do not upload camera frames.
- Do not stream camera frames.
- Do not persist camera frames.
- Do not log raw frame data, base64 image data, or pixel buffers.
- Do not add voice input.
- Do not add ASR.
- Do not add Parakeet.
- Do not add server-side AI.
- Do not connect Firebase Storage.
- Do not connect Firestore.
- Do not import Firebase, FirebaseFunctions, FirebaseStorage, or FirebaseFirestore.
- Do not add Gemini or OpenAI imports.
- Do not add StoreKit imports.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not add persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not modify backend code.
- Do not add npm dependencies.
- Do not add third-party SDKs.
- Do not auto-commit.
- Do not auto-push.

## UX Requirements

- Keep Camera as the primary first tab.
- Keep the Dazz-like compact framed viewport.
- Keep the guidance overlay outside the main viewfinder obstruction.
- Keep guidance text short: 1-3 suggestions at a time.
- Do not turn guidance into a chat UI, article panel, or long explanation.
- Keep mock/local mode labels compact and honest.
- Do not claim local rule-based guidance is cloud AI or Gemini Live.
- Make unavailable / fallback state clear without alarming the user.
- Do not block:
  - capture button
  - filter entry
  - Photo Picker import
  - flash / timer / flip controls
  - lens selector
  - selected-photo Back to Camera / Clear
  - bottom tab bar

## Suggested Guidance Copy

Add localized English and Traditional Chinese strings for local mode and suggestions.

Example Traditional Chinese suggestions:

- `畫面有點暗，試試移近光源。`
- `畫面太亮，可以避開直射光。`
- `主體可以再靠中間少少。`
- `頭頂可以多留一點空間。`
- `人像距離可以稍微退後。`
- `人像可以試試暖色濾鏡。`
- `本機導拍暫時未有足夠畫面訊號。`

Example English suggestions:

- `Frame is a little dark. Move closer to a light source.`
- `Frame is very bright. Try avoiding direct light.`
- `Try placing the subject closer to center.`
- `Leave a little more headroom.`
- `Step back slightly for a softer portrait frame.`
- `Try a warm filter for portraits.`
- `Local guidance needs a clearer frame signal.`

## Acceptance Criteria

- App builds.
- Camera remains the primary first tab.
- Live Guidance mock mode still works.
- Local guidance mode can show at least 2-3 local/rule-based suggestions when a camera frame or fallback test input is available.
- Simulator without a real camera frame does not crash.
- Guidance overlay remains below / outside main viewfinder obstruction.
- Capture remains usable.
- Filter picker remains usable.
- Photo Picker remains usable.
- Mock lens selector remains usable.
- Selected-photo Back to Camera / Clear remains usable.
- 20 filters / grouping remain usable.
- Mock save, mock AI, local history, Inspiration, History, and Settings remain usable.
- No cloud AI, Gemini Live, voice, ASR, Parakeet, Firebase, Cloud Functions, StoreKit, persistence, export, or save-to-Photos behavior is added.
- No raw frames are stored, uploaded, streamed, or logged.
- No real secrets or production config are added.
- No backend code is changed.

## Manual Test Steps

Run in Xcode / Simulator and, if available, on a physical iPhone:

1. Launch the app.
2. Confirm Camera is the first selected tab.
3. Toggle Live Guidance off/on.
4. Toggle or switch between mock and local guidance modes if a provider switch is added.
5. Confirm mock guidance still works.
6. On Simulator, confirm local provider gracefully falls back if no live frame exists.
7. On physical iPhone if available, confirm too dark / too bright hints appear.
8. On physical iPhone if available, confirm simple face/framing hints appear.
9. Confirm there is no obvious preview lag.
10. Confirm capture button remains reachable.
11. Confirm filter picker and all 20 filters / grouping still work.
12. Confirm mock lens selector remains usable.
13. Test Photo Picker import.
14. Test selected-photo Back to Camera / Clear.
15. Trigger mock save success and failure.
16. Trigger mock AI success and failure.
17. Confirm local session history records mock save / AI items.
18. Open Inspiration, History, and Settings.
19. Confirm no raw localization keys appear.
20. Confirm no upload, Firestore write, Storage write, Cloud Functions call, real AI call, Gemini Live, voice input, ASR, Parakeet, StoreKit, quota, persistence, export, or save-to-Photos behavior occurs.

## Verification Commands

Run:

```bash
git status --short
git diff --check
```

Forbidden imports scan:

```bash
rg -n "^\s*import\s+(Firebase|FirebaseFunctions|FirebaseStorage|FirebaseFirestore|Gemini|OpenAI|StoreKit)\b" ios-app/AIPhotoApp -g '*.swift'
```

Vision is allowed only for Phase 15 local on-device analysis. If `import Vision` exists, confirm it is limited to local guidance analyzer files and does not imply upload, streaming, cloud AI, or persistence.

Vision / voice / Gemini Live / frame handling scan:

```bash
rg -n "(Gemini Live|GeminiLive|Parakeet|SFSpeech|SpeechRecognizer|SpeechAnalyzer|SpeechTranscriber|AVAudioSession|NSMicrophoneUsageDescription|NSSpeechRecognitionUsageDescription|WebSocket)" ios-app/AIPhotoApp -g '*.swift' -g '*.plist'
```

Secrets / config scan:

```bash
find . -name GoogleService-Info.plist -o -name .env -o -name .firebaserc -o -name '*.p8' -o -name '*.mobileprovision' -o -name '*.provisionprofile'
rg -n "AIza|sk-[A-Za-z0-9_-]{20,}|PRIVATE KEY|firebase_project_id|projectId|apiKey|API_KEY|private_key|client_secret" ios-app functions -g '!ios-app/build/**' -g '!**/*.xcuserstate'
```

Forbidden behavior scan:

```bash
rg -n "(FirebaseApp|FirebaseStorage|Storage\.storage|Firestore|Firestore\.firestore|Functions\.functions|Gemini|OpenAI|StoreKit|UserDefaults|CoreData|SwiftData|modelContainer|WebSocket|SpeechRecognizer|SpeechAnalyzer|SpeechTranscriber|SFSpeech|AVAudioSession|Parakeet|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\.shared|quota|paywall|subscription)" ios-app/AIPhotoApp -g '*.swift'
rg -n "(uploadData|putData|setData|addDocument|writeBatch|URLSession|httpsCallable|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\.shared|UserDefaults|CoreData|SwiftData|StoreKit|Gemini|OpenAI|SFSpeech|Parakeet)" ios-app/AIPhotoApp/Features/Camera -g '*.swift'
```

Frame safety scan:

```bash
rg -n "(base64|jpegData|pngData|write|persist|upload|stream|URLSession|WebSocket)" ios-app/AIPhotoApp/Features/Camera -g '*.swift'
```

Run Xcode build if environment allows:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15-derived CODE_SIGNING_ALLOWED=NO build
```

If the sandboxed build fails due CoreSimulator / sandbox-exec restrictions, rerun with the appropriate approval/escalation and clearly report both results.

## Completion Response Requirements

When Phase 15 implementation is complete, reply with:

- changed files
- summary
- local guidance architecture summary
- Vision / rule-based scope summary
- privacy / frame handling summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 16: no, until Phase 15 is reviewed, committed, pushed, and read-only confirmed

