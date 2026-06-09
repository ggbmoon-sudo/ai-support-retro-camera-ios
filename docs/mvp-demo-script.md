# MVP Demo Script

This document describes the current local/mock MVP demo flow for AI Support Retro Camera iOS.

The app is not production-ready. The current MVP is a demo scaffold that shows the intended user journey without real cloud save, real AI analysis, real subscription, quota enforcement, export, or persistent history.

## Demo Purpose

Use this script to demonstrate the current end-to-end mock MVP flow:

```text
Launch app
-> guest / mock auth
-> Camera-first scaffold
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
2. Confirm the app enters the Camera-first surface directly, without a landing screen or launch-time Auth gate.
3. Explain that login is optional for now and lives in Settings for future cloud features.
4. Explain that the current build is a local/mock MVP demo.
5. Show the large 5:4-style camera frame, dark camera shell, lower-right filter entry, and bottom camera controls.
6. Toggle flash / timer / camera flip to show they are UI scaffold controls.
7. On Simulator, explain that live camera preview may be unavailable and Photo Picker is the reliable demo path.
8. Import one image using Photo Picker.
9. Review the selected-photo flow and confirm the screen can scroll.
10. Switch filter presets:
   - Original / None
   - Classic Film
   - Warm Vintage
   - Faded Chrome
11. Trigger mock save success and show the success state.
12. Trigger mock save failure and show the failure state.
13. Trigger mock AI analysis.
14. Show AI loading state.
15. Show mock AI result:
   - short summary
   - up to 3 suggestions
   - adjustment hints
   - mock/scaffold label
16. Trigger mock AI failure if needed, then retry.
17. Open History.
18. Show the local-only session card.
19. Explain that History is memory-only and may disappear after app restart.
20. Clear local session history.
21. Confirm History returns to the empty state.
22. Open Guide if needed to show secondary demo notes.
23. Open Settings.
24. Show that mock Auth / account entry is in Settings for future cloud features.
25. Explain that backend, cloud save, real AI, subscription, quota, and account deletion backend are placeholders.

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
