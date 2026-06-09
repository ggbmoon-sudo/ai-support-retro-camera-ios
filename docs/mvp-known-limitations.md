# MVP Known Limitations

This document lists current limitations of the local/mock MVP.

The current app is useful for demonstrating the intended flow, but it is not a production release.

## Camera And Photo Input

- Camera preview on Simulator may be unavailable.
- Physical camera capture should be verified on a real iPhone or iPad.
- Photo Picker import is the most reliable Simulator demo path.
- Imported or captured images remain local to the current app flow.

## Filters

- Filters are local Core Image preview presets.
- Current presets are Original / None, Classic Film, Warm Vintage, and Faded Chrome.
- There is no export or save-to-Photos behavior.
- There is no half-frame, double exposure, full camera/lens library, or paid preset library.

## Save

- Save is mock-only.
- Mock save does not upload image bytes.
- Mock save does not write Firestore metadata.
- Mock save does not write Firebase Storage objects.
- `FirebasePhotoSaveService` is a placeholder and does not import Firebase.

## AI Advice

- AI advice is mock-only.
- Mock AI does not call Gemini.
- Mock AI does not call OpenAI.
- Mock AI does not call Cloud Functions.
- Mock AI result is not real photography advice from a provider.
- There is no AI chat, image editing, generative edit, or realtime video AI.

## History

- History is current-session memory-only.
- History does not persist across app restart.
- History does not sync across devices.
- History is not cloud-backed.
- There is no permanent cloud history.
- Thumbnails are small in-memory UI images only.

## Backend And Services

- No real Firebase config is connected.
- No `GoogleService-Info.plist` is committed.
- No `.env` or `.firebaserc` is committed.
- No real Firebase Auth provider is connected.
- No real Firebase Storage upload exists.
- No real Firestore write exists.
- No production Cloud Functions deployment exists.
- No real AI provider is connected.
- No StoreKit, subscription, paywall, or quota enforcement exists.

## Privacy And App Store

- No production privacy policy URL is configured.
- App Store privacy labels have not been finalized.
- No production App Store metadata is ready.
- No account deletion backend exists.
- No delete-photo backend exists.
- No App Check enforcement is configured.
- Firebase Security Rules have not been production-validated against real data flows.

## Production Readiness

The app should not be described as production-ready until real service setup, privacy consent, data deletion, production rules, App Store metadata, TestFlight validation, and security checks are completed in later phases.
