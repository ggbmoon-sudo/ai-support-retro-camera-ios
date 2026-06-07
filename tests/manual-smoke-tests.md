# Manual Smoke Tests

## Phase 00

Check:

- [x] README.md exists.
- [x] AGENTS.md exists.
- [x] docs/ folder exists.
- [x] docs/phase-log.md exists.
- [x] docs/prompts/ folder exists.
- [x] ios-app/ placeholder exists.
- [x] functions/ placeholder exists.
- [x] firebase/ placeholder exists.
- [x] scripts/ placeholder exists.
- [x] .gitignore exists.
- [x] .env.example exists.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

## Phase 01

Check:

- [x] `docs/prompts/phase-01-design-navigation.md` is expanded into a full construction prompt.
- [x] `ios-app/AIPhotoApp/` source scaffold exists.
- [x] SwiftUI app entry exists.
- [x] Root navigation shell exists.
- [x] Home / History / Settings placeholder views exist.
- [x] Design system token files exist.
- [x] Reusable UI components exist.
- [x] Placeholder UI models exist.
- [x] English localization file exists.
- [x] Traditional Chinese localization file exists.
- [x] No Auth implementation was added.
- [x] No Camera implementation was added.
- [x] No Firebase upload implementation was added.
- [x] No AI implementation was added.
- [x] No StoreKit implementation was added.
- [x] No real API keys are committed.
- [x] No real GoogleService-Info.plist is committed.

Manual Xcode check on macOS:

- [ ] Create or open an iOS SwiftUI Xcode target.
- [ ] Add files under `ios-app/AIPhotoApp/` to the target.
- [ ] Add the localization files to the target.
- [ ] Build the target.
- [ ] Preview or run `AppRootView`.
- [ ] Confirm the intro placeholder can enter the Home / History / Settings tab shell.
- [ ] Confirm dark and light mode are readable.
- [ ] Confirm placeholder CTAs do not start Auth, Camera, Firebase, AI, or StoreKit work.
