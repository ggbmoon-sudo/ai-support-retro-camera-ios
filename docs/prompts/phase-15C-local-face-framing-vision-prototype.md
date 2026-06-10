# Phase 15C Prompt: Local Face Framing Vision Prototype

Use this prompt in a new Codex session only when Phase 15C is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `48f2de6 docs: record phase 15B verification`
- Expected repo status before starting: working tree clean and synchronized with `origin/feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, local session history, and progressively improving pre-capture shooting guidance

## Current Repo Status

Phase 15 and Phase 15B have been completed, committed, pushed, and read-only confirmed.

Important commit note:

- Phase 15B implementation commit: `078e4f6 15`
- The commit message `15` is a typo.
- The actual content of `078e4f6` is Phase 15B local frame brightness guidance implementation.
- Phase 15B verification docs commit: `48f2de6 docs: record phase 15B verification`

The app currently has:

- Camera as the primary screen / first selected tab.
- Dazz-like compact framed camera viewport.
- Live Guidance overlay below the viewfinder.
- Mock / Local guidance mode chip.
- Mock guidance mode.
- Local guidance provider architecture.
- Phase 15 sample/fallback local signals.
- Phase 15B low-frequency local brightness frame signal path.
- Phase 15B in-memory `CMSampleBuffer` / `CVPixelBuffer` brightness analysis path.
- No `import Vision` yet.
- Mock lens selector UI scaffold.
- Photo Picker fallback.
- Selected-photo / imported-photo fixed Back to Camera / Clear controls.
- Local Core Image filter pipeline.
- Expanded local filter catalog with 20 research presets and grouping.
- Mock save success / failure.
- Mock AI analysis success / failure after capture/import.
- Local session history.
- Inspiration, History, and Settings tabs.

The app still does not include:

- Phase 16.
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
- Raw frame storage, upload, streaming, persistence, or logging.

## Phase 15C Goal

Build the first Local Face Framing / Headroom Vision Prototype.

Phase 15C should add a small, local-only Apple Vision face rectangle analysis path on top of the Phase 15B low-frequency frame signal path. It should produce simple composition hints from face bounding boxes only.

This phase must not perform face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or any other sensitive attribute inference.

Phase 15C is still local-only. It is not cloud AI, not Gemini Live, not voice, not persistence, and not a production-grade pose coach.

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
- `docs/prompts/phase-15B-local-frame-signal-prototype.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraPreviewView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceBrightnessAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFrameAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMockState.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceMode.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceModeSelectorView.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift`
- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is `48f2de6 docs: record phase 15B verification`.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 15C has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 15C should do:

1. Add optional Apple Vision face rectangle analysis to the existing Phase 15B low-frequency frame signal path.
2. Keep Phase 15B brightness guidance:
   - too dark
   - too bright
   - balanced lighting
3. Preserve Phase 15 sample/fallback local signals.
4. Preserve Mock guidance mode.
5. Use Vision only for:
   - face rectangle detection
   - face center approximation
   - headroom approximation
   - face too close / too far approximation
6. Produce simple local guidance signals such as:
   - subject off-center
   - low headroom
   - face too close
   - face too far
   - portrait likely
7. Keep analysis low-frequency, around 1-2 samples per second.
8. Keep analysis work off the main thread.
9. Return UI state updates to the main actor/thread.
10. Do not store face rectangles or face history.
11. Do not store, upload, stream, persist, or log raw frames.
12. Keep Simulator and camera-unavailable fallback stable.
13. Preserve camera preview and capture responsiveness.
14. Preserve Photo Picker import.
15. Preserve selected-photo / imported-photo Back to Camera / Clear.
16. Preserve all 20 filters and filter grouping.
17. Preserve mock save, mock AI, local session history, Inspiration, History, and Settings.
18. Update English and Traditional Chinese localization only if new user-facing text is added.
19. Update:
   - `docs/phase-log.md`
   - `tests/manual-smoke-tests.md`
   - `README.md` if current phase/status or feature summary needs update
   - `ios-app/README.md` if iOS implementation notes need update

## Suggested Architecture

Keep this phase small. Do not rewrite the camera architecture.

Prefer extending the existing Phase 15B frame signal flow:

- `CameraCaptureService`
  - Keep the existing low-frequency sampling path.
  - Do not make a broad camera service rewrite.
  - Do not interfere with `AVCapturePhotoOutput`.
- `LiveGuidanceBrightnessAnalyzer`
  - Keep existing brightness behavior.
- `LiveGuidanceFaceAnalyzer`
  - New small file if useful.
  - The only place where `import Vision` should appear.
  - Receives a single in-memory pixel buffer / frame sample.
  - Runs `VNDetectFaceRectanglesRequest` only.
  - Returns derived `LiveGuidanceSignal` values.
  - Does not store raw frames.
  - Does not store face rectangles after analysis.
- `LiveGuidanceSignal`
  - Extend only if current signals are insufficient.
  - Existing `subjectOffCenter`, `lowHeadroom`, `faceTooClose`, `faceTooFar`, and `portraitLikely` may already cover this phase.
- `LiveGuidanceSuggestionComposer`
  - Reuse existing short localized suggestions when possible.
- `LocalRuleBasedGuidanceProvider`
  - Prefer real frame-derived signals when available.
  - Keep Phase 15 sample/fallback path when unavailable.
- `CameraViewModel`
  - Continue to receive only derived signals.
  - Do not retain frames, pixel buffers, or face rectangles.

Suggested new files only if useful:

- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFaceAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFaceFramingSignal.swift`

Do not add broad abstractions unless they remove real complexity.

## Vision Rules

Allowed:

- `import Vision` only in local face analyzer files.
- `VNDetectFaceRectanglesRequest` for local face bounding boxes.
- Face center approximation from a bounding box.
- Headroom approximation from a bounding box.
- Face too close / too far approximation from bounding box size.
- In-memory derived guidance signals only.

Required:

- Vision must run local-only and on-device.
- Vision analysis must run off the main thread.
- UI updates must return to the main actor/thread.
- Vision work must be throttled through the existing Phase 15B low-frequency frame signal path.
- Vision must be disabled or skipped gracefully if it causes build, threading, camera responsiveness, or device compatibility issues.

Forbidden:

- No face recognition.
- No identity inference.
- No face matching.
- No face embeddings.
- No face database.
- No age inference.
- No gender inference.
- No emotion inference.
- No beauty scoring.
- No attractiveness scoring.
- No health inference.
- No sensitive attribute inference.
- No persistent face rectangle history.
- No raw frame persistence.
- No face data persistence.

## Frame Handling Requirements

- Do not save raw frames.
- Do not upload raw frames.
- Do not stream raw frames.
- Do not persist raw frames.
- Do not log raw frames.
- Do not log raw image data, base64 image data, pixel buffers, sample buffers, or face rectangles.
- Do not retain `CMSampleBuffer` or `CVPixelBuffer` beyond the immediate in-memory analysis window.
- Do not retain face rectangles beyond the immediate in-memory signal generation step.
- Do not send frame data or face data to any network endpoint.
- Keep raw frame handling limited to the existing local Camera feature files.
- Keep fallback behavior for Simulator / unavailable camera.

## Face Framing Signal Guidance

Use conservative heuristics and avoid noisy, flickering behavior.

Possible signal mapping:

- No face detected:
  - Keep brightness signals.
  - Fall back to Phase 15 sample/local suggestions only if needed.
- Face center too far left/right:
  - `subjectOffCenter`
- Face bounding box top too close to top edge:
  - `lowHeadroom`
- Face bounding box too large:
  - `faceTooClose`
- Face bounding box too small:
  - `faceTooFar`
- Face detected with reasonable size:
  - `portraitLikely`

Suggested localized copy, reusing existing keys where possible:

- `主體可以再靠中間少少。`
- `頭頂可以多留一點空間。`
- `人像可以稍微退後一點。`
- `人像可以靠近一點。`
- `Try placing the subject closer to center.`
- `Leave a little more headroom.`
- `Step back slightly for a softer portrait frame.`
- `Move a little closer so the portrait fills the frame.`

Keep suggestions short and camera-like.

## Do Not Do

Phase 15C must not:

- Do not start Phase 16.
- Do not connect Gemini Live.
- Do not call Gemini.
- Do not call OpenAI.
- Do not call Cloud Functions.
- Do not do cloud snapshot guidance.
- Do not upload camera frames.
- Do not stream camera frames.
- Do not persist camera frames.
- Do not log raw frame data, base64, pixel buffers, sample buffers, or face rectangles.
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
- Mock guidance mode still works.
- Local guidance mode still works.
- Brightness hints still work.
- Face framing hints should be short and should not flicker aggressively.
- Simulator should show fallback local suggestions without crashing.
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
- Phase 15B brightness guidance still works.
- On a physical iPhone, if a face is visible, Local mode can show simple face framing / headroom hints.
- Simulator / no-camera fallback does not crash.
- Preview and capture remain responsive, with no obvious lag from analysis.
- No raw frames are stored, uploaded, streamed, persisted, or logged.
- No face rectangles or face history are stored or logged.
- `import Vision`, if added, appears only in local face analyzer files.
- Vision is used only for local face rectangle / bounding box detection.
- No face recognition, identity inference, age inference, emotion inference, gender inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference is added.
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
4. Switch between Mock and Local guidance modes.
5. Confirm Mock guidance still works.
6. Confirm Local brightness fallback still works.
7. On Simulator, confirm no crash and fallback works.
8. On a physical iPhone, point the camera at a face.
9. Confirm simple framing / headroom hints can appear.
10. Move the face too high, too low, or off-center if possible.
11. Confirm hints remain short and do not flicker aggressively.
12. Confirm preview and capture remain responsive.
13. Capture or import a photo through the existing flow.
14. Confirm selected-photo Back to Camera / Clear is visible and works.
15. Open the filter picker and confirm all 20 filters / grouping still work.
16. Run mock save success / failure if existing debug controls support it.
17. Run mock AI analysis success / failure if existing debug controls support it.
18. Confirm local session history updates as before.
19. Visit Inspiration, History, and Settings.
20. Check English and Traditional Chinese UI for raw localization keys.
21. Confirm no upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior occurs.

## Verification Commands

Run:

```bash
git status --short
git diff --check
```

Forbidden imports scan:

```bash
rg -n "^\s*import\s+(Firebase|FirebaseFunctions|FirebaseStorage|FirebaseFirestore|Gemini|OpenAI|StoreKit)\b" ios-app/AIPhotoApp -g "*.swift"
```

Vision import scan:

```bash
rg -n "^\s*import\s+Vision\b" ios-app/AIPhotoApp -g "*.swift"
```

The Vision scan may return a match only in a local face analyzer file, such as `LiveGuidanceFaceAnalyzer.swift`.

Secrets / config scan:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc"
rg -n "(API_KEY|SECRET|PRIVATE_KEY|FIREBASE_PROJECT|GOOGLE_APP_ID|GEMINI|OPENAI|sk-|AIza)" . -g '!**/.git/**'
```

Forbidden behavior scan:

```bash
rg -n "(GeminiLive|Gemini Live|Parakeet|SpeechRecognizer|SFSpeech|AVAudioEngine|OpenAI|Gemini|CloudFunctions|httpsCallable|FirebaseStorage|Firestore|StoreKit|Product\\.products|UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary)" ios-app/AIPhotoApp -g "*.swift"
```

Frame safety scan:

```bash
rg -n "(base64|jpegData|pngData|write\\(|persist|upload|stream|URLSession|WebSocket|CMSampleBuffer|CVPixelBuffer|sampleBuffer|pixelBuffer)" ios-app/AIPhotoApp/Features/Camera -g "*.swift"
```

Interpret `CMSampleBuffer` / `CVPixelBuffer` matches carefully: Phase 15C may reference them only for immediate, local, throttled, in-memory analysis. There must be no persistence, upload, stream, base64 conversion, or raw frame logging.

Face safety scan:

```bash
rg -n "(recognition|identity|identify|embedding|database|age|gender|emotion|beauty|attractiveness|health|sensitive|VNRecognize|VNClassify|faceprint|biometric)" ios-app/AIPhotoApp docs -g "*.swift" -g "*.md"
```

Expected face safety scan matches may include this prompt or documentation warnings. There should be no implementation of recognition, identity, sensitive inference, or face data persistence.

If CLI build is available:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15c-derived CODE_SIGNING_ALLOWED=NO build
```

If CLI build fails because of CoreSimulator, sandbox, or local Xcode destination availability, report that clearly and wait for user Xcode / Simulator validation.

## Completion Response Requirements

When finished, reply with:

- changed files
- summary
- local face framing architecture summary
- Vision scope summary
- privacy / face data handling summary
- brightness guidance preservation summary
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 16: no, until Phase 15C commit/push/read-only confirmation completed
