# Phase 16 Prompt: Cloud Snapshot AI Guidance Prototype

Use this prompt in a new Codex session only when Phase 16 is explicitly requested.

Do not execute this prompt while generating or reviewing the prompt.

## Project

- Repo: `https://github.com/ggbmoon-sudo/ai-support-retro-camera-ios`
- Local path: `/Volumes/moon/Projects/ai-support-retro-camera-ios`
- Expected branch: `feat/phase-02-auth`
- Latest expected commit: `b493d98 feat: add phase 15D guidance stability layer`
- Expected repo status before starting: working tree clean and synchronized with `origin/feat/phase-02-auth`
- Current app status: local/mock MVP
- Current product direction: camera-first retro camera with local filters, mock save, mock post-capture AI advice, local session history, local pre-capture guidance, and a future optional cloud snapshot AI guidance flow

## Current Repo Status

Phase 14 / 14B / 14C, Phase 15, Phase 15B, Phase 15C, and Phase 15D have been completed, committed, pushed, and read-only confirmed.

Important commit note:

- Phase 15B implementation commit: `078e4f6 15`
- The commit message `15` is a typo.
- The actual content of `078e4f6` is Phase 15B local frame brightness guidance implementation.
- Phase 15D implementation commit: `b493d98 feat: add phase 15D guidance stability layer`

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
- Phase 15D guidance stability / priority / anti-flicker layer.
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

- Phase 16 implementation.
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
- Real secrets, API keys, Firebase project IDs, private keys, OAuth secrets, Apple credentials, or signing credentials.
- Raw frame storage, upload, streaming, persistence, or logging.
- Face rectangle history storage or logging.
- Face recognition, identity inference, age inference, gender inference, emotion inference, beauty scoring, attractiveness scoring, health inference, or sensitive attribute inference.

## Phase 16 Goal

Build the first Cloud Snapshot AI Guidance Prototype.

Phase 16 is not Gemini Live, not live video streaming, not WebSocket realtime guidance, and not background automatic upload.

Phase 16 should add an app-side, explicitly triggered, consent-gated cloud snapshot guidance UX and service boundary. The first version should stay mock-only unless a safe backend, server-issued credential path, and explicit user approval are provided in a later phase.

The core product idea:

- Local guidance remains the default live guidance layer.
- Cloud snapshot guidance is an optional enhancement.
- The user explicitly taps an AI snapshot entry.
- The app shows clear privacy / consent copy before any analysis.
- The first implementation uses a mock cloud service response.
- No real network call, upload, provider API call, Firebase write, or persistence happens in Phase 16.

## Read First

Run read-only checks:

```bash
cd /Volumes/moon/Projects/ai-support-retro-camera-ios
pwd
git branch --show-current
git status --short --branch
git log --oneline -6
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
- `docs/prompts/phase-14-live-camera-guidance-mock-ux.md`
- `docs/prompts/phase-15-local-live-guidance-prototype.md`
- `docs/prompts/phase-15B-local-frame-signal-prototype.md`
- `docs/prompts/phase-15C-local-face-framing-vision-prototype.md`
- `docs/prompts/phase-15D-guidance-stability-and-priority.md`

Inspect:

- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraCaptureService.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceStabilityController.swift`
- `ios-app/AIPhotoApp/Features/Camera/LocalRuleBasedGuidanceProvider.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSuggestionComposer.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceSignal.swift`
- `ios-app/AIPhotoApp/Features/Filters/`
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`

Before editing, confirm:

- Current branch is `feat/phase-02-auth`.
- Latest commit is `b493d98 feat: add phase 15D guidance stability layer`.
- Local branch is synchronized with `origin/feat/phase-02-auth`.
- Working tree is clean, unless the user explicitly says otherwise.
- Phase 16 has been explicitly requested.
- No unrelated local changes will be overwritten.

## Implementation Scope

Phase 16 should do:

1. Design and implement the app-side cloud snapshot guidance architecture.
2. Add a visible but non-intrusive explicit user-triggered entry, for example:
   - `Ask AI`
   - `AI Quick Advice`
   - `AI composition check`
3. Add privacy / consent UX before analysis:
   - Explain that a snapshot would be sent to AI analysis in a real cloud version.
   - Explain that this phase uses a mock service boundary only.
   - Explain that the user must explicitly trigger the flow.
   - Explain that there is no background automatic upload.
   - Explain that there is no continuous streaming.
   - Explain that photos are not saved or persisted.
4. Add an app-side state model for the cloud snapshot guidance flow.
5. Add a service protocol boundary and mock implementation.
6. Add short mock result suggestions, not long articles or chat transcripts.
7. Add failed / unavailable mock states.
8. Keep existing Local guidance and the Phase 15D stability layer intact.
9. Keep Cloud snapshot guidance optional; do not replace Local guidance.
10. Ensure Simulator, no-network, and no-backend conditions gracefully use mock behavior.
11. Update English and Traditional Chinese localization.
12. Update:
    - `docs/phase-log.md`
    - `tests/manual-smoke-tests.md`
    - `README.md` if current phase/status or feature summary needs update
    - `ios-app/README.md` if iOS implementation notes need update

## First-Version Scope

Phase 16 first version should be:

- App-side UI only.
- State model only.
- Service protocol boundary only.
- Mock response only.
- No real Gemini call.
- No real OpenAI call.
- No Cloud Functions call.
- No Firebase Storage upload.
- No Firestore write.
- No backend deployment.
- No provider API key.
- No iOS-embedded API key.
- No image persistence.
- No background upload.
- No live video streaming.
- No WebSocket.

If there is no safe backend, ephemeral token, server-issued credential, and production config path, Phase 16 must remain at the mock cloud service boundary.

Real cloud AI integration belongs in a later explicit phase, such as Phase 16B / Phase 17. Gemini Live belongs even later and is not part of Phase 16.

## Suggested Architecture

Keep this phase small. Do not rewrite the camera architecture.

Suggested new files:

- `ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceService.swift`
- `ios-app/AIPhotoApp/Features/Camera/MockCloudSnapshotGuidanceService.swift`
- `ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceState.swift`
- `ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceModels.swift`
- `ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceConsentView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CloudSnapshotGuidanceResultView.swift`

Likely modified files:

- `ios-app/AIPhotoApp/Features/Camera/CameraView.swift`
- `ios-app/AIPhotoApp/Features/Camera/CameraViewModel.swift`
- `ios-app/AIPhotoApp/Features/Camera/LiveGuidanceOverlayView.swift` only if the entry belongs near the existing guidance surface
- `ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings`
- `ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings`
- `docs/phase-log.md`
- `tests/manual-smoke-tests.md`
- `README.md`
- `ios-app/README.md`

Suggested service boundary:

- `CloudSnapshotGuidanceService`
- `MockCloudSnapshotGuidanceService`
- `CloudSnapshotGuidanceRequest`
- `CloudSnapshotGuidanceResponse`
- `CloudSnapshotGuidanceState`

Suggested state model:

- `idle`
- `consentRequired`
- `preparingSnapshot`
- `analyzing`
- `result`
- `failed`
- `unavailable`

Suggested request model:

- A minimal request object that contains only derived local context and an in-memory image reference if absolutely needed for mock flow.
- Do not serialize, persist, upload, log, or base64 encode the image in Phase 16.
- Do not store request payloads.

Suggested response model:

- Short summary.
- One to three short shooting suggestions.
- Optional confidence / source label showing this is a mock cloud boundary.
- No long prose.
- No chat transcript UI.

## UX Requirements

- Camera remains the primary screen.
- Cloud snapshot entry should be visible but not intrusive.
- Cloud snapshot entry should not block capture, filter picker, Photo Picker, flash, timer, flip, lens selector, Local guidance, or tab navigation.
- The user must explicitly tap before any mock cloud analysis starts.
- Consent / privacy copy must be visible before analysis.
- Consent UI must clearly distinguish the future real cloud behavior from the current mock-only implementation.
- The result should be short, camera-like, and actionable.
- Failed / unavailable state should be clear and recoverable.
- No scary or error-like copy when no backend is connected.
- Local guidance remains visible and useful.
- The Phase 15D anti-flicker / stability layer must not be removed or bypassed.
- Do not create a chat UI.
- Do not show long paragraphs inside the camera shell.
- Do not show raw localization keys.

Potential UI placements:

- A compact `Ask AI` / `AI Quick Advice` button near the live guidance panel.
- A compact icon+label action in the lower camera chrome.
- A small sheet or panel for consent and result.

Avoid:

- Full-screen blocking flow unless absolutely needed.
- Large article-style explanation inside Camera.
- Automatic analysis on camera start.
- Automatic analysis on every frame.
- Background upload.

## Privacy / Consent Requirements

The consent UI must state, in plain language:

- A real cloud version would send a snapshot to an AI service for analysis.
- This phase is mock-only and does not upload anything.
- The user must explicitly start analysis.
- No continuous video stream is used.
- No background frame upload is used.
- No photo is saved or persisted by this flow.
- No API key is stored in the iOS app.

Required behavior:

- Do not start mock cloud analysis before the user taps the explicit AI snapshot entry.
- Do not run cloud snapshot analysis automatically in the background.
- Do not repeatedly trigger cloud snapshot analysis from live frame signals.
- Do not save consent in `UserDefaults` or any persistence.
- Consent state may be memory-only for the current flow.

## Preserve Existing Features

Phase 16 must preserve:

- Camera primary screen.
- Dazz-like camera layout.
- Mock guidance mode.
- Local guidance mode.
- Phase 15 sample/fallback local signals.
- Phase 15B brightness guidance.
- Phase 15C face framing / headroom guidance.
- Phase 15D stability / priority / anti-flicker layer.
- Guidance overlay below / outside the main viewfinder.
- Mock lens selector.
- Flash / timer / flip / capture controls.
- Photo Picker import.
- Selected-photo Back to Camera / Clear.
- 20 filters and grouping.
- Mock save.
- Mock AI after capture/import.
- Local history.
- Inspiration.
- History.
- Settings.
- English and Traditional Chinese localization.

## Do Not Do

- Do not start Gemini Live.
- Do not add live video streaming.
- Do not add WebSocket realtime guidance.
- Do not upload camera frames automatically in the background.
- Do not continuously upload frames.
- Do not save raw frames.
- Do not save selected photos.
- Do not save cloud request payloads.
- Do not log raw frames, selected photos, base64 image data, pixel buffers, sample buffers, or cloud payloads.
- Do not put API keys in the iOS app.
- Do not add Gemini or OpenAI API keys.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add Firebase project IDs, private keys, OAuth secrets, Apple credentials, signing credentials, provisioning profiles, or production config.
- Do not connect Firebase Storage real upload.
- Do not write Firestore.
- Do not call Cloud Functions.
- Do not call Gemini.
- Do not call OpenAI.
- Do not add Firebase, FirebaseFunctions, FirebaseStorage, FirebaseFirestore, Gemini, OpenAI, or StoreKit imports.
- Do not add StoreKit, subscription, paywall, premium gating, or quota enforcement.
- Do not add persistence, UserDefaults, Core Data, or SwiftData.
- Do not export or save to Photos.
- Do not modify backend code.
- Do not add npm dependencies, third-party SDKs, or package dependencies.
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

## Backend / Provider Boundary

Phase 16 may define a future-facing app-side protocol, but it must not connect it to real infrastructure.

Allowed:

- Mock cloud snapshot service boundary.
- Local mock delay.
- Mock success response.
- Mock failed response.
- Mock unavailable response.
- Placeholder copy that says real cloud AI is not connected.

Forbidden:

- Real Cloud Functions call.
- Real Firebase Storage upload.
- Real Firestore write.
- Real Gemini call.
- Real OpenAI call.
- Client-side provider API key.
- Hardcoded endpoint URL for production.
- Hardcoded Firebase project ID.
- Any auth token or credential.

If a future real integration is needed, document it as Phase 16B / Phase 17 and require:

- Server-side provider calls.
- Server-issued ephemeral credential or protected backend proxy.
- No iOS-embedded provider API key.
- Fresh official documentation and pricing/rate-limit review.
- Privacy/App Store review.
- Abuse, quota, and cancellation strategy.

## Acceptance Criteria

- App builds.
- Camera is still the primary screen.
- Existing Local guidance still works.
- Phase 15D guidance stability remains active.
- AI snapshot entry is visible but not intrusive.
- User must explicitly tap before mock cloud snapshot analysis.
- Consent / privacy copy is visible before analysis.
- Mock cloud response can show short AI guidance result.
- Failed / unavailable state works.
- No real network call occurs.
- No real upload occurs.
- No API keys, secrets, or Firebase config are added.
- No raw frames or photos are stored, uploaded, streamed, persisted, or logged.
- Selected-photo Back to Camera / Clear still works.
- Photo Picker still works.
- All 20 filters still work.
- Mock save / mock AI / local history / Inspiration / History / Settings still work.
- No raw localization keys appear.

## Manual Test Steps

1. Launch the app.
2. Confirm Camera is the primary screen.
3. Confirm Local guidance still works.
4. Confirm guidance stability remains.
5. Tap the AI snapshot entry.
6. Confirm consent / privacy UX appears.
7. Confirm mock cloud analysis can run only after explicit user action.
8. Confirm result appears as short suggestions.
9. Confirm failed / unavailable mock state.
10. Confirm no network call, upload, API key, or Firebase config exists.
11. Test Photo Picker import.
12. Test selected-photo Back to Camera / Clear.
13. Test filters.
14. Test mock save.
15. Test mock AI.
16. Test local history.
17. Open Inspiration, History, and Settings.
18. Confirm no raw localization keys.

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

Network / upload behavior scan:

```bash
rg -n "(URLSession|URLRequest|http://|https://|upload|download|multipart|WebSocket|NWConnection|FirebaseStorage|Firestore|CloudFunctions|Functions|Gemini|OpenAI)" ios-app/AIPhotoApp -g "*.swift"
```

Secrets / config scan:

```bash
find . -name GoogleService-Info.plist -o -name .env -o -name .firebaserc
rg -n "(AIza[0-9A-Za-z_-]{20,}|sk-[0-9A-Za-z_-]{20,}|-----BEGIN (RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----|FIREBASE_[A-Z0-9_]*=|GOOGLE_APPLICATION_CREDENTIALS|firebase_project_id|project_id\s*[:=]\s*[\"'][^\"']+|api[_-]?key\s*[:=]\s*[\"'][^\"']+)" . -g "!*DerivedData*" -g "!.git/**"
```

Forbidden behavior scan:

```bash
rg -n "(Gemini Live|live video|WebSocket|stream|background upload|Cloud Functions|Firestore write|Storage upload|StoreKit|subscription|paywall|quota|UserDefaults|CoreData|SwiftData|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary|SFSpeech|SpeechRecognizer|Parakeet)" ios-app docs tests -g "*.swift" -g "*.md" -g "*.strings"
```

Frame / photo persistence scan:

```bash
rg -n "(CMSampleBuffer|CVPixelBuffer|pixelBuffer|sampleBuffer|base64|jpegData|pngData|write|FileManager|URLSession|upload|stream|persist|store|print\(|debugPrint|NSLog|cloud request|request payload)" ios-app/AIPhotoApp/Features/Camera -g "*.swift"
```

Face safety scan:

```bash
rg -n "(VNRecognize|face recognition|identity|age|gender|emotion|beauty|attractiveness|health|sensitive|face history|face rectangle history)" ios-app docs tests -g "*.swift" -g "*.md" -g "*.strings"
```

Expected scan notes:

- Existing docs and prompts may mention forbidden future work as warnings.
- Existing local/mock strings may mention Firebase, upload, Gemini, OpenAI, StoreKit, or persistence to say they are not connected.
- Existing Phase 15B / 15C Camera files may mention `CMSampleBuffer`, `CVPixelBuffer`, and face rectangle detection for in-memory local analysis.
- Confirm Phase 16 adds no real network, upload, persistence, provider call, secret, or backend behavior.

Xcode build if environment allows:

```bash
xcodebuild -project ios-app/AIPhotoApp.xcodeproj -scheme AIPhotoApp -destination 'generic/platform=iOS Simulator' -derivedDataPath /private/tmp/ai-support-phase16-derived CODE_SIGNING_ALLOWED=NO build
```

If sandboxed build fails due CoreSimulator / `sandbox-exec` environment restrictions, report that clearly. If an unsandboxed build is available and approved, run it and report the separate result.

## Completion Response Requirements

When done, respond with:

- changed files
- summary
- cloud snapshot service boundary summary
- consent / privacy UX summary
- mock response / state model summary
- preservation of local guidance summary
- network / upload / secrets confirmation
- build / verification result
- manual test steps
- known TODOs
- ready to review before commit: yes/no
- ready for real cloud AI integration: no, until a later explicit Phase 16B / 17 request

Do not commit.

Do not push.

Do not start Gemini Live.

Do not add real cloud AI.
