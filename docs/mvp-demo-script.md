# MVP Demo Script

This document describes the current local/mock MVP demo flow for AI Support Retro Camera iOS.

The app is not production-ready. The current MVP is a demo scaffold that shows the intended user journey without real cloud save, real AI analysis, real subscription, quota enforcement, export, or persistent history.

## Demo Purpose

Use this script to demonstrate the current end-to-end mock MVP flow:

```text
Launch app
-> guest / mock auth
-> Home
-> Camera scaffold
-> Photo Picker import
-> Filter presets
-> Mock save success / failure
-> Mock AI advice
-> Local session history
-> Clear local session history
-> Settings placeholders
```

## Prerequisites

- Xcode can open `ios-app/AIPhotoApp.xcodeproj`.
- Use an iPhone Simulator for the standard demo.
- Keep one sample image available in the Simulator photo library.
- No real Firebase project is required.
- No `GoogleService-Info.plist`, `.env`, `.firebaserc`, Gemini key, OpenAI key, StoreKit product, or Apple credential is required.

## Demo Script

1. Launch `AIPhotoApp`.
2. If an auth entry appears, use the guest / mock auth path.
3. Open Home and explain that the current build is a local/mock MVP demo.
4. Tap the Camera entry.
5. On Simulator, explain that live camera preview may be unavailable and Photo Picker is the reliable demo path.
6. Import one image using Photo Picker.
7. Review the selected-photo flow and confirm the screen can scroll.
8. Switch filter presets:
   - Original / None
   - Classic Film
   - Warm Vintage
   - Faded Chrome
9. Trigger mock save success and show the success state.
10. Trigger mock save failure and show the failure state.
11. Trigger mock AI analysis.
12. Show AI loading state.
13. Show mock AI result:
   - short summary
   - up to 3 suggestions
   - adjustment hints
   - mock/scaffold label
14. Trigger mock AI failure if needed, then retry.
15. Open History.
16. Show the local-only session card.
17. Explain that History is memory-only and may disappear after app restart.
18. Clear local session history.
19. Confirm History returns to the empty state.
20. Open Settings.
21. Explain that backend, cloud save, real AI, subscription, quota, and account deletion backend are placeholders.

## Demo Close

End the demo by stating:

- Save is mock-only.
- AI advice is mock-only.
- History is current-session memory-only.
- No photo is uploaded.
- No Firestore or Storage write occurs.
- No Cloud Functions call occurs.
- No Gemini or OpenAI call occurs.
- No StoreKit, subscription, paywall, or quota enforcement exists.
- No image export or save-to-Photos exists.

The next real-service phases must pass the readiness gates in `docs/mvp-readiness-checklist.md` before production service integration begins.
