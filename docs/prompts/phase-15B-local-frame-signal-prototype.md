# Phase 15B Prompt: Local Frame Signal Prototype

Use this prompt in a new Codex session only when Phase 15B is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `2906b22 feat: add phase 15 local guidance provider scaffold`
- Expected repo status before starting: working tree clean and synchronized with `origin/feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, local session history, and progressively improving pre-capture shooting guidance

## Current Repo Status

Phase 15 has been completed, committed, pushed, and read-only confirmed.

The app currently has:

- Camera as the primary screen / first selected tab.
- Dazz-like compact framed camera viewport.
- Live Guidance mock overlay.
- Mock / Local guidance mode chip.
- Mock guidance mode.
- Local guidance mode using sample / fallback local signals only.
- No real camera frame analysis yet.
- No `import Vision` yet.
- No AVFoundation video frame sampling yet.
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
- Cloud snapshot guidance.
- Voice input, ASR, or Parakeet.
- StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Disk persistence, UserDefaults persistence, Core Data, or SwiftData.
- Cloud history or sync.
- Export or save-to-Photos.
- Production Firebase config.
- Real secrets, API keys, Firebase project IDs, private keys, or Apple credentials.

## Phase 15B Goal

Build the first real local frame signal prototype for live camera guidance.

Phase 15B should move beyond Phase 15 sample/fallback local signals by adding a low-risk, low-frequency, on-device frame signal path. It should be intentionally narrow: brightness signals first, optional simple Vision face rectangle / headroom only if safe.

Phase 15B is still local-only. It is not cloud AI, not Gemini Live, not voice, not persistence, and not a production-grade film/camera intelligence engine.

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
- `docs/prompts/phase-15-local-live-guidance-prototype.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMode.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceModeSelectorView.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift`
- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is `2906b22 feat: add phase 15 local guidance provider scaffold`.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 15B has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 15B should do:

1. Add a low-frequency local frame signal path on top of the existing `LocalRuleBasedGuidanceProvider` / `LiveGuidanceFrameAnalyzer` direction.
2. Preserve the Phase 15 Mock guidance mode.
3. Preserve the Phase 15 Local guidance sample/fallback path.
4. Extract only minimal real local signals:
   - brightness / too dark
   - too bright
   - optional simple face rectangle / headroom if safe
5. Keep all frame analysis local and on-device.
6. Keep analysis throttled to low frequency, such as 1-2 samples per second.
7. Keep analysis work off the main thread.
8. Return UI state updates to the main actor/thread.
9. Keep suggestions short and camera-like.
10. Keep Simulator and camera-unavailable fallback stable.
11. Keep Camera preview and capture responsiveness.
12. Preserve Photo Picker import.
13. Preserve selected-photo / imported-photo Back to Camera / Clear.
14. Preserve all 20 filters and filter grouping.
15. Preserve mock save, mock AI, local session history, Inspiration, History, and Settings.
16. Update English and Traditional Chinese localization only if new user-facing text is added.
17. Update:
   - `docs/phase-log.md`
   - `tests/manual-smoke-tests.md`
   - `README.md` if current phase/status or feature summary needs update
   - `ios-app/README.md` if iOS implementation notes need update

## Suggested Architecture

Keep this phase small. Do not rewrite the camera architecture.

Prefer adding a narrow frame signal boundary around the existing local guidance code:

- `LocalRuleBasedGuidanceProvider`
  - Continues to compose guidance from local signals.
  - Uses real frame-derived signals when available.
  - Falls back to Phase 15 sample/local signals when real frame signals are unavailable.
- `LiveGuidanceFrameAnalyzer`
  - Converts a throttled frame sample into `LiveGuidanceSignal` values.
  - Starts with brightness signals.
  - Optionally delegates face rectangle detection to a tiny Vision-only analyzer if safe.
- `CameraViewModel`
  - Receives analyzed signals and updates guidance state on the main actor/thread.
  - Does not retain raw frames or pixel buffers.
- `CameraCaptureService` or a small frame sampler
  - Provides a throttled local sample stream only when Local guidance mode is active and the camera preview is available.
  - Must not interfere with capture or preview.

Suggested new files only if useful:

- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameSignalSource.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameSample.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameSampler.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceBrightnessAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFaceAnalyzer.swift`

Do not add broad abstractions unless they remove real complexity.

## Frame Signal Requirements

Brightness:

- Compute a simple brightness estimate from a throttled frame sample.
- Emit signals such as:
  - too dark
  - too bright
  - balanced / no brightness warning
- Use conservative thresholds.
- Prefer stable suggestions over noisy rapid changes.

Optional face rectangle / headroom:

- Only add if it can be done safely without destabilizing camera capture.
- If using Vision, limit it to local face rectangle detection.
- Do not attempt complex pose coaching.
- Do not attempt identity, recognition, age, emotion, beauty scoring, or sensitive inference.
- If the Vision path creates build, threading, or camera risk, skip it and record a TODO for a later phase.

Suggestion examples:

- The frame looks a little dark. Try moving closer to the light.
- The scene is very bright. Try turning slightly away from direct light.
- Leave a little more space above the head.
- Move the face slightly toward the center.
- Try a warmer filter for this portrait.

Keep suggestions localized and short.

## AVFoundation / Vision Rules

Allowed:

- `AVFoundation` camera frame sampling only if it is low-frequency, local-only, and does not break existing photo capture.
- `import Vision` only in a local guidance analyzer file, and only for local face rectangle detection.
- Background queue analysis.
- Main actor/thread UI updates.

Required if frame sampling is added:

- Throttle analysis to about 1-2 samples per second.
- Do not analyze every frame.
- Do not block preview, capture, filter picker, lens selector, Photo Picker, or tab navigation.
- Do not store raw frames.
- Do not persist raw frames.
- Do not upload, stream, or send raw frames to any network endpoint.
- Do not log raw image data, base64 image data, pixel buffers, or sample buffers.
- Do not retain `CMSampleBuffer` or `CVPixelBuffer` beyond the immediate in-memory analysis window.
- Simulator / unavailable camera must gracefully fall back to Phase 15 sample/local signals.

If the camera frame pipeline is too complex or risky:

- Keep the Phase 15 provider architecture.
- Keep sample/fallback local signals.
- Add a documented TODO for physical-device frame sampling.
- Do not destabilize the Camera flow.

## Do Not Do

Phase 15B must not:

- Do not start Phase 16.
- Do not connect Gemini Live.
- Do not call Gemini.
- Do not call OpenAI.
- Do not call Cloud Functions.
- Do not do cloud snapshot guidance.
- Do not upload camera frames.
- Do not stream camera frames.
- Do not persist camera frames.
- Do not log raw frame data, base64, or pixel buffers.
- Do not do voice input.
- Do not do ASR.
- Do not do Parakeet.
- Do not connect Firebase Storage.
- Do not write Firestore.
- Do not import Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, or Apple credentials.
- Do not add persistence, UserDefaults persistence, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not add npm dependencies or third-party SDKs.
- Do not change backend code.
- Do not auto commit.
- Do not auto push.

## UX Requirements

- Camera remains the primary screen.
- Local guidance remains a compact camera overlay, not a chat UI or article.
- Mock / Local guidance mode chip remains understandable.
- Local mode should show real local brightness-based suggestions on a physical iPhone when frame samples are available.
- Simulator should show sample/fallback local suggestions without crashing.
- Guidance overlay should stay below / outside the main viewfinder obstruction.
- Guidance should not block:
  - capture button
  - filter picker
  - Photo Picker import
  - flash
  - timer
  - flip
  - mock lens selector
  - selected-photo Back to Camera / Clear
  - bottom tab bar

## Acceptance Criteria

- App builds.
- Camera is still the primary screen.
- Mock guidance provider still works.
- Local guidance mode still works.
- On a physical iPhone, Local guidance mode can use real local brightness signals if camera frames are available.
- Simulator / no-camera fallback does not crash.
- Preview and capture remain responsive, with no obvious lag from analysis.
- No raw frames are stored, uploaded, streamed, persisted, or logged.
- `import Vision`, if added, appears only in a local guidance analyzer file.
- No Firebase / Gemini / OpenAI / StoreKit imports are added.
- No secrets, API keys, or Firebase config are added.
- Selected-photo Back to Camera / Clear still works.
- Photo Picker import still works.
- All 20 filters and grouping still work.
- Mock save, mock AI, local history, Inspiration, History, and Settings still work.
- English and Traditional Chinese localization has no raw keys.

## Manual Test Steps

1. Launch the app.
2. Confirm Camera is the primary screen.
3. Confirm Dazz-like camera shell, mock lens selector, and bottom controls still render.
4. Toggle guidance off/on.
5. Switch between Mock and Local guidance modes.
6. Confirm Mock guidance still shows mock suggestions.
7. On Simulator, confirm Local guidance falls back to sample/local suggestions and does not crash.
8. On a physical iPhone, if available, point the camera at a dark scene and confirm Local mode can show a too-dark suggestion.
9. On a physical iPhone, if available, point the camera at a very bright scene and confirm Local mode can show a too-bright suggestion.
10. Confirm preview remains responsive while Local guidance is active.
11. Capture or import a photo through the existing flow.
12. Confirm selected-photo Back to Camera / Clear is visible and works.
13. Open the filter picker and confirm all 20 filters / grouping still work.
14. Run mock save success / failure if existing debug controls support it.
15. Run mock AI analysis success / failure if existing debug controls support it.
16. Confirm local session history updates as before.
17. Visit Inspiration, History, and Settings.
18. Check English and Traditional Chinese UI for raw localization keys.

## Verification Commands

Run:

```bash
git status --short
git diff --check
```

Forbidden imports scan:

```bash
rg -n "^\s*import\s+(Firebase|FirebaseFunctions|FirebaseStorage|FirebaseFirestore|Gemini|OpenAI|StoreKit)\b" ios-app/AIPhotoApp -g "*.swift"
rg -n "^\s*import\s+Vision\b" ios-app/AIPhotoApp -g "*.swift"
```

The Vision scan may return a match only in a local guidance analyzer file if Phase 15B safely uses Vision for local face rectangle detection.

Secrets / config scan:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc"
rg -n "(API_KEY|SECRET|PRIVATE_KEY|FIREBASE_PROJECT|GOOGLE_APP_ID|GEMINI|OPENAI|sk-|AIza)" .
```

Forbidden behavior scan:

```bash
rg -n "(FirebaseStorage|Firestore|Functions|httpsCallable|URLSession|StoreKit|Product\.products|UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary)" ios-app/AIPhotoApp -g "*.swift"
```

Frame safety scan:

```bash
rg -n "(base64|jpegData|pngData|write\\(|persist|upload|stream|URLSession|WebSocket|CMSampleBuffer|CVPixelBuffer)" ios-app/AIPhotoApp/Features/Camera -g "*.swift"
```

Interpret `CMSampleBuffer` / `CVPixelBuffer` matches carefully: Phase 15B may reference them only for immediate, local, throttled, in-memory analysis. There must be no persistence, upload, stream, base64 conversion, or raw frame logging.

If CLI build is available:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'platform=iOS Simulator,name=iPhone 16' build
```

If CLI build fails because of CoreSimulator, sandbox, or local Xcode destination availability, report that clearly and wait for user Xcode / Simulator validation.

## Completion Response Requirements

When finished, reply with:

- changed files
- summary
- local frame signal architecture summary
- Vision / AVFoundation scope summary
- privacy / frame handling summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 16: no, until Phase 15B commit/push/read-only confirmation completed
