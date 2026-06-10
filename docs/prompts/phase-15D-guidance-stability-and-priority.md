# Phase 15D Prompt: Guidance Stability and Priority

Use this prompt in a new Codex session only when Phase 15D is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `4e3fb54 feat: add phase 15C local face framing guidance`
- Expected repo status before starting: working tree clean and synchronized with `origin/feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, local session history, and progressively improving local pre-capture shooting guidance

## Current Repo Status

Phase 14 / 14B / 14C, Phase 15, Phase 15B, and Phase 15C have been completed, committed, pushed, and read-only confirmed.

Important commit note:

- Phase 15B implementation commit: `078e4f6 15`
- The commit message `15` is a typo.
- The actual content of `078e4f6` is Phase 15B local frame brightness guidance implementation.
- Phase 15B verification docs commit: `48f2de6 docs: record phase 15B verification`
- Phase 15C implementation commit: `4e3fb54 feat: add phase 15C local face framing guidance`

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
- Phase 15C local Apple Vision face rectangle / face framing / headroom guidance.
- `import Vision` only in the local face analyzer file.
- Vision used only for local face rectangle / bounding box detection.
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
- Face rectangle history storage or logging.
- Face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.

## Phase 15D Goal

Build a Guidance Stability / Priority / Anti-flicker UX Layer.

Phase 15D should make the existing Local Guidance hints feel calmer, more stable, and more like a real camera coaching overlay. It should not add new AI capability, new frame analysis types, new Vision request types, cloud AI, or Phase 16 work.

The goal is to take existing derived signals from Phase 15 / 15B / 15C and decide what to show, when to replace it, and how often a suggestion can repeat.

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
- `docs/live-guidance-roadmap.md`
- `docs/mvp-known-limitations.md`
- `docs/mvp-readiness-checklist.md`
- `docs/prompts/phase-15-local-live-guidance-prototype.md`
- `docs/prompts/phase-15B-local-frame-signal-prototype.md`
- `docs/prompts/phase-15C-local-face-framing-vision-prototype.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceBrightnessAnalyzer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceFaceAnalyzer.swift`
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
- Latest commit is `4e3fb54 feat: add phase 15C local face framing guidance`.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 15D has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 15D should do:

1. Add a stability / priority layer on top of the existing guidance signal and suggestion flow.
2. Improve suggestion priority ordering.
3. Add anti-flicker / cooldown / debounce / hysteresis behavior.
4. Avoid replacing guidance immediately every time frame-derived signals change.
5. Reduce repeated suggestions within a short time window.
6. When multiple signals exist, show only the most important 1-2 suggestions.
7. Keep guidance copy short and camera-like.
8. Make Local guidance feel stable, rhythmic, and confident.
9. Preserve Simulator / camera-unavailable fallback behavior.
10. Preserve Mock guidance mode.
11. Preserve Phase 15 sample/fallback local signals.
12. Preserve Phase 15B brightness guidance.
13. Preserve Phase 15C face framing / headroom guidance.
14. Do not increase camera frame sampling frequency.
15. Do not add new Vision request types.
16. Do not add new frame analysis types.
17. Do not store raw frames.
18. Do not store face rectangle history.
19. Keep camera preview and capture responsive.
20. Preserve Photo Picker import.
21. Preserve selected-photo / imported-photo Back to Camera / Clear.
22. Preserve all 20 filters and filter grouping.
23. Preserve mock save, mock AI, local session history, Inspiration, History, and Settings.
24. Update English and Traditional Chinese localization only if new user-facing text is added.
25. Update:
    - `docs/phase-log.md`
    - `tests/manual-smoke-tests.md`
    - `README.md` if current phase/status or feature summary needs update
    - `ios-app/README.md` if iOS implementation notes need update

## Suggested Architecture

Keep this phase small. Do not rewrite the camera architecture.

Prefer placing the new behavior after signals have already been derived, before suggestions are displayed.

Suggested new files if useful:

- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionPriority.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionCooldown.swift`

Or extend existing files if simpler:

- `LiveGuidanceSuggestionComposer.swift`
- `LocalRuleBasedGuidanceProvider.swift`
- `LiveGuidanceSignal.swift`
- `CameraViewModel.swift`

Guidance:

- Do not make broad changes to `CameraCaptureService`.
- Do not change the AVFoundation sampling pipeline.
- Do not increase the frame analysis rate.
- Do not add new Vision requests.
- Do not add storage, persistence, network, backend, or cloud behavior.
- Keep the stability logic deterministic and local.
- Prefer simple, testable value types or a small controller.

Potential flow:

1. `CameraCaptureService` emits existing derived `LiveGuidanceSignal` values.
2. `CameraViewModel` or `LocalRuleBasedGuidanceProvider` receives those signals.
3. A stability controller ranks, filters, and cools down candidates.
4. The UI receives only 1-2 stable suggestions.
5. If signals disappear briefly, the previous stable suggestions can remain for a short hold duration.
6. If no strong local signal exists, show a calm fallback suggestion.

## Priority Rules

Implement or document a clear priority order. Suggested ordering:

High priority:

- `tooDark`
- `tooBright`
- `faceTooClose`
- `faceTooFar`

Medium priority:

- `lowHeadroom`
- `subjectOffCenter`

Low priority:

- `warmFilterHelpful`
- `portraitLikely`
- general fallback / unavailable

Rules:

- Each guidance update should show at most 1-2 key suggestions.
- Higher-priority suggestions should win over lower-priority suggestions.
- Lighting warnings may remain first when the frame is clearly too dark or too bright.
- Face distance warnings may remain first when the face is clearly too close or too far.
- Low-priority encouragement should not interrupt active correction hints.
- Fallback / unavailable should not replace a recent strong suggestion too aggressively.

## Stability Rules

Add simple anti-flicker behavior. Suggested rules:

1. The same suggestion should not repeat too frequently. Use a cooldown such as 3-5 seconds.
2. A new suggestion should be present for a short confirmation window, or appear in consecutive signal updates, before replacing the current stable suggestion.
3. If a signal disappears briefly, hold the previous stable suggestion for a short duration instead of immediately clearing it.
4. If a higher-priority signal appears, it may replace the current suggestion sooner than a same-priority or lower-priority signal.
5. If the user switches guidance mode, toggles guidance off/on, clears a selected photo, or returns to camera preview, reset stability state if needed.
6. Keep state in memory only.
7. Do not use `UserDefaults`, Core Data, SwiftData, disk files, or any persistence.

Suggested constants:

- Repeat cooldown: 3-5 seconds.
- Confirmation count: 2 consecutive appearances, if the existing signal cadence makes that practical.
- Hold duration after signal disappears: 1.5-3 seconds.
- Max visible suggestions: 2.

These values can be tuned, but do not overbuild.

## UX Requirements

- Guidance overlay remains below / outside the main viewfinder.
- Guidance overlay must not block capture, filter picker, Photo Picker, flash, timer, flip, lens selector, or tab navigation.
- Guidance text stays short and camera-like.
- Do not turn guidance into a chat UI.
- Do not show long paragraphs.
- Do not show technical signal names.
- Do not show raw localization keys.
- Local mode should feel calm and intentional, not jittery.
- Mock mode should remain predictable and usable.
- Simulator fallback should remain calm and not error-like.

## Do Not Do

- Do not start Phase 16.
- Do not add Gemini Live.
- Do not call Gemini, OpenAI, or Cloud Functions.
- Do not add cloud snapshot guidance.
- Do not add voice input, ASR, Parakeet, microphone permission copy, or speech recognition permission copy.
- Do not connect Firebase Storage or Firestore.
- Do not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Do not add persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not modify backend code.
- Do not add npm dependencies, third-party SDKs, or package dependencies.
- Do not increase camera frame storage or logging.
- Do not save raw frames.
- Do not upload raw frames.
- Do not stream raw frames.
- Do not persist raw frames.
- Do not log raw frames, base64 image data, pixel buffers, sample buffers, or face rectangles.
- Do not save face rectangle history.
- Do not add face recognition.
- Do not add identity inference.
- Do not add age inference.
- Do not add gender inference.
- Do not add emotion inference.
- Do not add beauty scoring.
- Do not add attractiveness scoring.
- Do not add health inference.
- Do not add sensitive attribute inference.
- Do not automatically commit.
- Do not automatically push.

## Vision and Frame Safety

Phase 15D should not change the Vision analysis scope.

Required:

- `import Vision` should remain only in the existing local face analyzer file.
- Vision should remain limited to local face rectangle / bounding box detection.
- No new Vision request type should be added.
- No new frame analysis type should be added.
- No frame sampling frequency increase should be added.
- No frame or face data persistence should be added.

If any Vision or frame-safety scan expands beyond the Phase 15C analyzer path, stop and review before continuing.

## Suggested Files

Likely Swift files:

- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`

Optional new small Swift files:

- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionPriority.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionCooldown.swift`

Likely docs:

- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `README.md` if status needs update
- `ios-app/README.md` if implementation notes need update

Localization if new copy is added:

- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Avoid touching:

- Backend files.
- Firebase files.
- Functions files.
- Dependency files.
- Xcode signing/config/secrets files.
- Filter visual parameters unless required by an accidental compile issue.

## Acceptance Criteria

- App builds.
- Camera is still the primary screen.
- Mock guidance mode still works.
- Local guidance mode still works.
- Phase 15B brightness guidance still works.
- Phase 15C face framing / headroom guidance still works.
- Suggestions do not flicker aggressively.
- Repeated suggestions are reduced.
- Only 1-2 key suggestions are shown at once.
- High-priority suggestions reliably win over low-priority suggestions.
- Guidance overlay remains below / outside the main viewfinder.
- Simulator / camera-unavailable fallback does not crash.
- Preview and capture remain responsive.
- Selected-photo Back to Camera / Clear still works.
- Photo Picker still works.
- All 20 filters still work.
- Mock save / mock AI / local history / Inspiration / History / Settings still work.
- No raw localization keys appear.
- No cloud AI, Gemini Live, Firebase, StoreKit, persistence, export, voice, or ASR behavior is added.
- No raw frames or face data are stored, uploaded, streamed, persisted, or logged.
- No face recognition or sensitive inference is added.

## Manual Test Steps

1. Launch the app.
2. Confirm Camera is the primary screen.
3. Switch Mock / Local guidance mode.
4. Confirm Mock guidance still works.
5. Confirm Local brightness guidance still works.
6. Confirm Local face framing / headroom guidance still works.
7. Move camera between dark and bright areas and confirm suggestions do not flicker too aggressively.
8. On a physical iPhone, move a face off-center, close, and far if available.
9. Confirm suggestion changes feel stable and not too frequent.
10. Confirm repeated suggestions are reduced.
11. Confirm only 1-2 suggestions are shown.
12. Confirm preview and capture remain responsive.
13. Test Photo Picker import.
14. Test selected-photo Back to Camera / Clear.
15. Test filters.
16. Test mock save.
17. Test mock AI.
18. Test local history.
19. Open Inspiration, History, and Settings.
20. Confirm no raw localization keys.
21. Confirm no upload, cloud AI, Firebase, StoreKit, persistence, export, voice, or ASR behavior.
22. Confirm no raw frames or face rectangles are stored, uploaded, streamed, persisted, or logged.
23. Confirm no face recognition, identity inference, sensitive attribute inference, or face rectangle history behavior.

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
rg -n "^\s*import\s+Vision\b|VNDetect|VNRecognize|VNRequest" ios-app/AIPhotoApp -g "*.swift"
```

Secrets / config scan:

```bash
find . -name GoogleService-Info.plist -o -name .env -o -name .firebaserc
rg -n "(AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z_-]{20,}|-----BEGIN (RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----|FIREBASE_[A-Z0-9_]*=|GOOGLE_APPLICATION_CREDENTIALS|firebase_project_id|project_id\s*[:=]\s*[\"'][^\"']+|api[_-]?key\s*[:=]\s*[\"'][^\"']+)" . -g "!*DerivedData*" -g "!.git/**"
```

Forbidden behavior scan:

```bash
rg -n "(upload|Firestore|Firebase|Storage|CloudFunction|Gemini|OpenAI|StoreKit|UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary|saveToPhotos|SFSpeech|SpeechRecognizer|Parakeet|microphone|AVAudio)" ios-app/AIPhotoApp/Features/Camera ios-app/AIPhotoApp/Resources -g "*.swift" -g "*.strings"
```

Frame safety scan:

```bash
rg -n "(CMSampleBuffer|CVPixelBuffer|pixelBuffer|sampleBuffer|base64|jpegData|pngData|write|FileManager|URLSession|upload|stream|persist|store|print\(|debugPrint|NSLog)" ios-app/AIPhotoApp/Features/Camera -g "*.swift"
```

Face safety scan:

```bash
rg -n "(VNDetectFaceRectanglesRequest|VNDetectFace|VNRecognize|face|identity|recognition|recognize|age|gender|emotion|beauty|attract|health|sensitive|history)" ios-app/AIPhotoApp/Features/Camera -g "*.swift"
```

Expected scan notes:

- Vision scan may match the existing Phase 15C `LiveGuidanceFaceAnalyzer.swift`.
- Vision should not appear in new files unless there is a very strong reason, and the default expectation is no new Vision imports.
- Face safety scan may match existing signal names such as `faceTooClose` / `faceTooFar`; confirm no recognition, identity, age, emotion, beauty, attractiveness, health, or sensitive inference implementation exists.
- Frame safety scan may match the existing in-memory Phase 15B / 15C analyzer path; confirm no storage, upload, stream, persistence, or logging exists.
- Secrets scan may match `.env.example` placeholders or docs/prompt scan commands; confirm no real secrets or config were added.

Xcode build if environment allows:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase15d-derived CODE_SIGNING_ALLOWED=NO build
```

If sandboxed build fails due CoreSimulator / `sandbox-exec` environment restrictions, report that clearly. If an unsandboxed build is available and approved, run it and report the separate result.

## Completion Response Requirements

When done, respond with:

- changed files
- summary
- stability / priority architecture summary
- anti-flicker / cooldown / debounce summary
- Vision / frame sampling scope confirmation
- privacy / face data handling confirmation
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for Phase 16: no, until Phase 15D commit/push/read-only confirmation completed

Do not commit.

Do not push.

Do not start Phase 16.
