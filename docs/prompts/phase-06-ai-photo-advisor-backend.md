# Phase 06: AI Photo Advisor Backend Scaffold

## Phase name

Phase 06 - AI Photo Advisor Backend / Service Scaffold

## Goal

Create a safe, mockable AI Photo Advisor backend and service scaffold for the iOS-first AI Support Retro Camera app.

This phase should define the request / response contract for single-photo analysis, local mock analyzer behavior, backend Cloud Functions scaffold shape, provider adapter interfaces, Gemini / OpenAI placeholder adapters, prompt template drafts, and manual test requirements for future real AI integration.

Phase 06 must remain a mock/scaffold phase. It must not connect to real Gemini, OpenAI, Firebase production, deployed Cloud Functions, billing, quota enforcement, StoreKit, or image upload. It should prepare the codebase for future AI analysis without adding real credentials or paid external-service calls.

## Current repo status

- Branch expected for this work: `feat/phase-02-auth`.
- Latest known commit before this phase prompt: `a1d39f6 feat: add phase 05 mock photo save scaffold`.
- Local branch is expected to be synchronized with `origin/feat/phase-02-auth`.
- Working tree should be clean before starting Phase 06 implementation.
- Phase 00 repo setup is completed.
- Phase 01 UI scaffold is completed.
- Phase 02 Auth scaffold is completed.
- Phase 01/02 Mac/Xcode build succeeded.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03 Camera + Photo Picker scaffold is completed, manually checked, committed, and pushed.
- Phase 04 Local Core Image Filter Presets is completed, manually verified, committed, and pushed.
- Phase 05 Mock Photo Save Scaffold is completed, manually verified, committed, and pushed.
- `docs/phase-log.md` records Phase 05 completed / manually checked.
- `tests/manual-smoke-tests.md` includes Phase 05 checks.
- No real Firebase config is present.
- No `GoogleService-Info.plist` is present.
- No `.env` is present.
- No `.firebaserc` is present.
- No Firebase / FirebaseStorage / FirebaseFirestore imports are present in Swift source.
- Current app source lives under `ios-app/AIPhotoApp/`.
- Current functions scaffold only has placeholder files under `functions/`.
- Phase 06 has not been implemented yet.

## Please read first

Before making changes, read:

- README.md
- AGENTS.md
- docs/00-common-background-v2.md
- docs/01-product-mvp-scope.md
- docs/02-technical-architecture.md
- docs/04-ai-photo-advisor.md
- docs/05-firebase-storage-firestore-functions.md
- docs/07-subscription-quota-storekit.md
- docs/08-privacy-security-app-store-risk.md
- docs/09-codex-phase-plan.md
- docs/phase-log.md
- docs/prompts/phase-03-camera-picker.md
- docs/prompts/phase-04-filters.md
- docs/prompts/phase-05-firebase-storage-firestore.md
- docs/prompts/phase-06-ai-photo-advisor-backend.md
- ios-app/README.md
- tests/manual-smoke-tests.md

## Pre-implementation checks

Before editing, run:

```bash
pwd
git branch --show-current
git status --short
git status -sb
git log --oneline -3
git rev-list --left-right --count HEAD...origin/feat/phase-02-auth
find ios-app -maxdepth 2 -name '*.xcodeproj' -print
rg -n "Phase 05|Ready for Phase 06|Phase 06" docs/phase-log.md
rg -n "PhotoSaveService|MockPhotoSaveService|FirebasePhotoSaveService|FilteredPhotoPreview|PhotoSaveState" ios-app/AIPhotoApp -g '*.swift'
find . -name 'GoogleService-Info.plist' -print
find . -name '.env' -print
find . -name '.firebaserc' -print
rg -n "^import (Firebase|FirebaseStorage|FirebaseFirestore|FirebaseFunctions|StoreKit|GoogleSignIn|OpenAI|Gemini)" ios-app/AIPhotoApp -g '*.swift'
```

Confirm that:

- The repo path is `/Volumes/moon/Projects/ai-support-retro-camera-ios`.
- The current branch is `feat/phase-02-auth`, unless the user explicitly moved this work to another branch.
- The working tree state is understood before edits.
- The latest commit is the Phase 05 mock photo save scaffold commit.
- The local branch is synchronized with `origin/feat/phase-02-auth`.
- `ios-app/AIPhotoApp.xcodeproj` exists.
- Phase 03, Phase 04, and Phase 05 source files are present and buildable.
- No unrelated uncommitted changes will be overwritten.
- No real AI key, Firebase config, production project ID, `.env`, `.firebaserc`, or `GoogleService-Info.plist` is present.
- Phase 06 implementation has been explicitly requested by the user.

## This phase only does

- Work on Phase 06 AI Photo Advisor backend / service scaffold only.
- Add AI analysis request / response model drafts.
- Add photo analysis status model.
- Add AI Photo Advisor service protocol for iOS.
- Add a mock AI analyzer service for local success and failure paths.
- Add a placeholder Cloud Functions callable / HTTPS function scaffold.
- Add a provider adapter interface, for example `AIProviderAdapter`.
- Add placeholder `GeminiAnalyzer` and `OpenAIAnalyzer` adapter files with TODOs only.
- Add a prompt template draft for future single-photo analysis.
- Add an analysis error model, for example:
  - `invalidImage`
  - `quotaRequiredLater`
  - `providerUnavailable`
  - `networkUnavailable`
  - `unsafeContent`
  - `notConfigured`
- Add local mock analysis success / failure path.
- Document future Gemini / OpenAI setup without adding real keys.
- Keep all AI behavior mock/local unless the user explicitly provides backend setup and asks for real AI integration in a later task.
- Keep Auth, Home, Camera, Filter Preview, Mock Save, History, and Settings buildable.
- Add localization strings for AI mock/scaffold copy in English and Traditional Chinese if any iOS placeholder UI is added.
- Update `ios-app/README.md` with Phase 06 scaffold notes.
- Update `functions/README.md` with Phase 06 backend scaffold notes.
- Update `tests/manual-smoke-tests.md` with Phase 06 manual checks.
- Update `docs/phase-log.md` before finishing Phase 06 implementation.

## This phase does not do

- Do not add a Gemini API key.
- Do not add an OpenAI API key.
- Do not add a Firebase project ID.
- Do not add `GoogleService-Info.plist`.
- Do not add `.env`.
- Do not add `.firebaserc`.
- Do not add private keys.
- Do not add OAuth secrets.
- Do not add Apple credentials.
- Do not add signing credentials.
- Do not add provisioning profiles.
- Do not make real Gemini calls.
- Do not make real OpenAI calls.
- Do not deploy Cloud Functions.
- Do not enable production Firebase.
- Do not import real Gemini SDKs.
- Do not import real OpenAI SDKs.
- Do not import Firebase Admin SDK unless the repo already has a safe placeholder pattern and no credentials are required. If unsure, keep backend code dependency-free or documentation-only.
- Do not import Firebase / FirebaseFunctions in iOS if the app cannot build without Firebase SDK/config.
- Do not upload images.
- Do not write Firestore documents.
- Do not write Firebase Storage objects.
- Do not implement real AI billing.
- Do not implement quota enforcement.
- Do not implement StoreKit.
- Do not implement subscription or paywall logic.
- Do not implement user paid quota enforcement.
- Do not implement AI chat follow-up.
- Do not implement image editing.
- Do not implement generative image editing.
- Do not implement realtime video AI.
- Do not implement Gemini Live.
- Do not implement OpenAI image edit.
- Do not start Phase 07.

## Suggested files to create or modify

Use the current repo structure. Do not assume paths outside this repo.

Suggested new iOS files:

```text
ios-app/AIPhotoApp/Models/PhotoAnalysisRequest.swift
ios-app/AIPhotoApp/Models/PhotoAnalysisResult.swift
ios-app/AIPhotoApp/Models/PhotoAnalysisStatus.swift
ios-app/AIPhotoApp/Services/AIPhotoAdvisor/PhotoAnalysisService.swift
ios-app/AIPhotoApp/Services/AIPhotoAdvisor/MockPhotoAnalysisService.swift
ios-app/AIPhotoApp/Services/AIPhotoAdvisor/CloudFunctionPhotoAnalysisService.swift
```

Suggested new backend / functions scaffold files:

```text
functions/src/analyzePhoto.ts
functions/src/ai/AIProviderAdapter.ts
functions/src/ai/MockAnalyzer.ts
functions/src/ai/GeminiAnalyzer.ts
functions/src/ai/OpenAIAnalyzer.ts
functions/src/contracts/photoAnalysis.ts
functions/src/prompts/photoAdvisorPrompt.ts
```

Suggested existing files to modify:

```text
functions/src/index.ts
functions/README.md
ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings
ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings
ios-app/README.md
tests/manual-smoke-tests.md
docs/phase-log.md
```

Optional iOS UI files only if the implementation chooses to expose a disabled/mock placeholder:

```text
ios-app/AIPhotoApp/Features/AIPhotoAdvisor/AIAnalysisPlaceholderView.swift
ios-app/AIPhotoApp/Features/Filters/FilteredPhotoPreview.swift
```

Only modify files needed for the Phase 06 mock AI scaffold. Keep changes small and reviewable.

If new Swift files are added under `ios-app/AIPhotoApp/`, confirm Xcode target membership through the existing Xcode file-system synchronized group and by running an Xcode build. If project editing becomes necessary, keep `ios-app/AIPhotoApp.xcodeproj/project.pbxproj` changes minimal and do not add user-specific Xcode files.

## Technical requirements

- Use Swift + SwiftUI for iOS-side service/UI scaffolding.
- iOS app must build without Firebase SDK, Cloud Functions SDK, Gemini SDK, OpenAI SDK, or API keys.
- iOS service layer must be mockable.
- iOS UI, if added, must depend on a protocol such as `PhotoAnalysisService`, not directly on a concrete Cloud Functions implementation.
- Provide `MockPhotoAnalysisService` for local success and failure paths.
- Provide `CloudFunctionPhotoAnalysisService` only as a placeholder/TODO unless Cloud Functions SDK and Firebase config are explicitly provided later.
- If Firebase SDK/config is absent, the app must still build.
- Do not import Firebase modules in iOS files that must build without Firebase dependencies.
- Backend scaffold must not require deployment.
- Backend scaffold must not require real Firebase credentials.
- Provider adapters must be interfaces/placeholders only.
- Do not import real Gemini or OpenAI SDKs.
- Do not import Firebase Admin SDK unless it remains a safe placeholder and does not require credentials. If uncertain, document the future setup instead of adding the dependency.
- Do not upload image bytes in this phase.
- Do not persist images to disk in this phase.
- Do not write real Firestore documents.
- Do not write real Storage objects.
- Do not log raw image data, base64 image content, local file paths, signed URLs, full prompts, provider request payloads, provider response payloads, or sensitive user metadata.
- Do not put raw image data or base64 into analysis request models.
- Prefer storage path / photo ID references in contracts, but keep them as draft/mock values only.
- Keep `trainingConsent` default false.
- Do not add a model training consent flow.
- Explicitly label Phase 06 behavior as mock/scaffold, not real AI analysis.
- Keep Phase 03 camera, Phase 04 filters, and Phase 05 mock save behavior intact.
- Keep all UI copy localizable.

## AI response contract

The response contract should be short, structured, and suitable for MVP photo advice. It should not become a long chat transcript.

Suggested iOS / backend result fields:

```text
PhotoAnalysisResult
- id / analysisId
- photoId
- summary
- suggestions: [PhotoSuggestion]
- adjustments: [PhotoAdjustmentHint]
- compositionNotes
- lightingNotes
- analysisStatus
- provider
- isMock
- createdAt
```

Suggested nested types:

```text
PhotoSuggestion
- id
- title
- detail
- priority

PhotoAdjustmentHint
- id
- control
- value
- displayValue
- reason
```

Suggested status values:

```text
notStarted
analyzing
completed
failed
blockedByConsentLater
quotaRequiredLater
unsafeContent
```

Suggested provider values:

```text
mock
cloudFunction
gemini
openAI
unknown
```

Suggested error values:

```text
invalidImage
quotaRequiredLater
providerUnavailable
networkUnavailable
unsafeContent
notConfigured
unknown
```

Suggested TypeScript contract:

```ts
export type PhotoAnalysisProvider = "mock" | "gemini" | "openai";

export interface AnalyzePhotoRequest {
  photoId: string;
  ownerId: string;
  storagePath?: string;
  filterPresetId?: string | null;
  language: "en" | "zh-Hant";
  trainingConsent: false;
  isMock?: boolean;
}

export interface AnalyzePhotoResponse {
  analysisId: string;
  photoId: string;
  summary: string;
  suggestions: PhotoSuggestion[];
  adjustments: PhotoAdjustmentHint[];
  compositionNotes?: string;
  lightingNotes?: string;
  analysisStatus: "completed" | "failed";
  provider: PhotoAnalysisProvider;
  isMock: boolean;
  createdAt: string;
}

export interface PhotoSuggestion {
  id: string;
  title: string;
  detail: string;
  priority: "high" | "medium" | "low";
}

export interface PhotoAdjustmentHint {
  id: string;
  control: "exposure" | "contrast" | "temperature" | "saturation";
  value: number;
  displayValue: string;
  reason: string;
}
```

Requirements:

- `summary` should be one short sentence.
- `suggestions` should contain at most 3 actionable suggestions.
- `adjustments` should use only controls the app can understand later.
- The result must include `isMock`.
- The result must include `provider`.
- The result must include `analysisStatus`.
- The result must not include raw provider responses.
- The result must not include raw prompt text.
- The result must not include image bytes, base64, signed URLs, local paths, or email addresses.

## Cloud Functions / backend scaffold requirements

- Add a callable / HTTPS function scaffold named conceptually `analyzePhoto`.
- The scaffold may return mock data only.
- Do not deploy functions.
- Do not require Firebase emulator setup to build the app.
- Do not import real Gemini or OpenAI SDKs.
- Do not call Gemini or OpenAI.
- Do not read Firebase Storage.
- Do not write Firestore.
- Do not decrement quota.
- Do not require Secret Manager setup.
- Keep function code safe to inspect without credentials.
- Add `AIProviderAdapter` interface for future real providers.
- Add `MockAnalyzer` that returns deterministic mock analysis.
- Add `GeminiAnalyzer` placeholder/TODO that throws or returns not-configured mock behavior.
- Add `OpenAIAnalyzer` placeholder/TODO that throws or returns not-configured mock behavior.
- Add a prompt template draft for future analysis.
- The prompt template must be documented as future-only and must not include secrets or user-specific data.
- Avoid logging request bodies, prompts, signed URLs, storage paths, provider responses, or user metadata.

Suggested backend flow for future documentation only:

```text
analyzePhoto callable / HTTPS
  -> validate auth/app-check later
  -> validate photo ownership later
  -> validate consent later
  -> validate quota later
  -> select provider adapter later
  -> call mock analyzer in Phase 06 only
  -> return typed mock AnalyzePhotoResponse
```

## iOS service scaffold requirements

- Add `PhotoAnalysisService` protocol.
- Add `MockPhotoAnalysisService` with success and failure functions.
- Add `CloudFunctionPhotoAnalysisService` placeholder/TODO without Firebase imports.
- The iOS service must build without Cloud Functions SDK.
- If UI entry is added, keep it disabled or clearly marked mock/scaffold.
- The mock success path should produce a short summary, up to 3 suggestions, and simple adjustment hints.
- The mock failure path should expose a visible local error state if UI is added.
- Do not analyze real image pixels in Phase 06.
- Do not upload image data.
- Do not persist analysis results.
- Do not write history.
- Do not start quota checks.
- Do not start StoreKit or paywall flows.
- Do not claim the result is real AI analysis.

## Privacy / App Store requirements

- Do not transmit user photos in Phase 06.
- Do not imply that photos are sent to AI providers in this scaffold.
- Do not imply real AI advice is available.
- Do not claim cloud AI analysis, billing, quota, account deletion backend, export, or production storage exists.
- Do not request new permissions.
- Do not add tracking, ads, analytics, or personalized ads SDKs.
- Do not collect or transmit images.
- Do not log raw image data, image base64, signed URLs, prompts, provider responses, or sensitive user metadata.
- Keep `trainingConsent` default false.
- Do not introduce model-training consent UI.
- If future consent text is documented, it must distinguish third-party AI analysis consent from model-training consent.
- If any AI warning copy is added, it should state that AI suggestions are for reference only and Phase 06 is mock/scaffold.
- Do not make basic Camera or basic Filters depend on AI consent.

## AI safety / cost / secret safety requirements

- No Gemini API key.
- No OpenAI API key.
- No Firebase project ID.
- No real provider endpoint.
- No `.env`.
- No `.firebaserc`.
- No private key.
- No OAuth secret.
- No Apple credential.
- No production Firebase configuration.
- No real external AI billing.
- No provider API calls.
- No deployment.
- No Secret Manager values.
- Do not commit prompt logs or sample responses containing user data.
- Mock responses must be deterministic and harmless.
- Include future TODOs for:
  - server-side secret management
  - provider selection
  - quota enforcement
  - consent gate
  - App Check
  - abuse monitoring
  - cost controls
  - structured response validation
  - provider fallback policy
- Do not implement these future TODOs in Phase 06 unless explicitly requested later.

## UI requirements

- Phase 06 can be service/model/backend scaffold only; a complete AI result UI is not required.
- If an iOS entry point is added, it must be disabled or clearly marked as mock/scaffold.
- Do not let users believe real AI analysis is available.
- Do not add full AI result UI; that belongs to Phase 07.
- Do not add follow-up chat UI.
- Do not add paywall UI.
- Do not add quota UI.
- Do not modify Camera / Filter / Save flows in a way that breaks Phase 03 / 04 / 05.
- If a placeholder button is added after mock save or filtered preview, it must only trigger mock success/failure and must not upload, write Firestore, call AI providers, call Cloud Functions, start StoreKit, enforce quota, persist history, or export.

## Acceptance criteria

- `docs/prompts/phase-06-ai-photo-advisor-backend.md` has been read and followed.
- The repo starts from the Phase 05 mock save scaffold commit.
- The app builds in Xcode after Phase 06 changes.
- Phase 01/02 Auth, Home, History, and Settings flows still build.
- Phase 03 Camera + Photo Picker scaffold still builds.
- Phase 04 local filters still build.
- Phase 05 mock save still builds.
- iOS includes mockable AI Photo Advisor service models/protocols.
- Mock analysis success path exists.
- Mock analysis failure path exists.
- Backend scaffold includes an `analyzePhoto` placeholder shape.
- Backend scaffold includes provider adapter interface.
- Backend scaffold includes mock analyzer.
- Gemini adapter is placeholder/TODO only.
- OpenAI adapter is placeholder/TODO only.
- Prompt template draft exists for future single-photo advice.
- AI response contract includes summary, up to 3 suggestions, adjustment hints, status, provider, `isMock`, and created timestamp.
- No real Gemini calls are implemented.
- No real OpenAI calls are implemented.
- No Cloud Functions are deployed.
- No production Firebase integration is enabled.
- No real upload is implemented.
- No real Firestore write is implemented.
- No AI billing or quota enforcement is implemented.
- No StoreKit, subscription, paywall, or quota logic is implemented.
- No AI chat follow-up, image editing, generative edit, realtime video AI, Gemini Live, or OpenAI image edit is implemented.
- No secrets, API keys, Firebase project IDs, Apple credentials, Google credentials, `.env`, `.firebaserc`, or `GoogleService-Info.plist` are added.
- iOS source does not import Firebase / FirebaseFunctions unless the app can still build safely without config; prefer no Firebase imports in Phase 06.
- Backend scaffold does not import real Gemini / OpenAI SDKs.
- `tests/manual-smoke-tests.md` includes Phase 06 checks.
- `docs/phase-log.md` records Phase 06 status, changed files, checks, known TODOs, and readiness for Phase 07.

## Tests / manual checks

Run or perform:

- `git status --short` before and after implementation.
- Confirm `ios-app/AIPhotoApp.xcodeproj` exists.
- Build the app target in Xcode.
- If backend TypeScript files are added and scripts exist, run the safest available local TypeScript check that does not install packages, deploy, or use network access.
- Confirm no files named `.env`, `.firebaserc`, `GoogleService-Info.plist`, production plist files, private keys, OAuth secrets, Firebase project IDs, Apple credentials, Google keys, Gemini keys, OpenAI keys, or API keys were added.
- Confirm iOS source files do not import Gemini, OpenAI, StoreKit, FirebaseStorage, FirebaseFirestore, or FirebaseFunctions for Phase 06.
- Confirm backend source does not import real Gemini SDK, OpenAI SDK, or Firebase Admin SDK unless already present and safe without credentials.
- Confirm no function deployment command was run.
- Confirm no real upload or Firestore write occurs.
- Confirm no raw image data, base64, signed URL, local file path, prompt text, provider response body, or sensitive metadata is logged.
- Confirm mock analysis success returns:
  - one short summary
  - up to 3 actionable suggestions
  - simple adjustment hints
  - `provider = mock`
  - `isMock = true`
- Confirm mock analysis failure can be represented by the service/model layer.
- If a UI placeholder is added:
  - build and run `AIPhotoApp` in an iOS Simulator
  - open Home
  - open the Camera scaffold
  - import one image with the photo picker
  - switch a filter preset
  - trigger mock save success if needed
  - trigger mock AI analysis placeholder if present
  - confirm mock AI success/failure state is visible
  - confirm the UI clearly says this is mock/scaffold only
  - confirm no upload, Firestore write, real AI call, Cloud Functions call, StoreKit, quota, history persistence, export, or Phase 07 behavior starts
  - confirm Home / History / Settings still render
- On a physical iPhone or iPad, if available:
  - capture one still photo
  - apply a filter preset
  - trigger any mock AI placeholder if present
  - confirm no real upload, Firestore write, or AI call occurs

## Completion requirement

Before finishing Phase 06 implementation, update `docs/phase-log.md`.

The Phase 06 log entry must include:

- status
- date started / completed
- summary
- completed work
- changed files
- tests or manual checks
- known TODOs
- whether Xcode build was run
- whether mock analysis success / failure was tested
- whether any backend check was run
- whether secrets were checked
- whether real AI / Firebase production dependencies were intentionally not added
- whether upload, Firestore writes, AI billing, quota, StoreKit, history persistence, export, and Phase 07 were intentionally not implemented
- ready for Phase 07: yes/no

Also update `tests/manual-smoke-tests.md` with Phase 06 manual checks and results.

After implementation:

- Run or request an Xcode build verification.
- Manually test mock analysis success / failure if any UI is added.
- Confirm the app has no real AI or Firebase production dependency.
- Confirm no secrets were added.
- Confirm no real upload occurred.
- Confirm no real Firestore write occurred.
- Do not automatically commit or push.
- Do not mark Phase 07 started.
