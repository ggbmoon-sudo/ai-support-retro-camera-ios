# MVP Readiness Checklist

This checklist captures the gates that should be completed before moving from the current local/mock MVP toward real services or release preparation.

The current MVP is local/mock only. It is not a production release.

## Demo Readiness

- [ ] Run the full script in `docs/mvp-demo-script.md`.
- [ ] Confirm Home explains the mock/local MVP clearly.
- [ ] Confirm Camera scaffold opens.
- [ ] Confirm Photo Picker import works in Simulator.
- [ ] Confirm filter presets update the preview.
- [ ] Confirm mock save success and failure states are visible.
- [ ] Confirm mock AI loading, success, failure, retry, and dismiss states work.
- [ ] Confirm History shows local-only session cards.
- [ ] Confirm clear local session history works.
- [ ] Confirm Settings does not claim real backend, subscription, AI, quota, or account deletion completion.
- [ ] Confirm no raw localization keys appear in the demo flow.

## Device And Simulator Readiness

- [ ] Build and run on iPhone Simulator.
- [ ] Test a small-screen iPhone Simulator.
- [ ] Confirm selected-photo flow scrolls fully.
- [ ] Confirm AI result UI scrolls fully.
- [ ] Confirm History list scrolls.
- [ ] Confirm safe area and tab bar do not block controls.
- [ ] Optionally build and run on physical iPhone / iPad.
- [ ] On physical device, verify camera permission prompt and preview.
- [ ] On physical device, capture one still photo.
- [ ] On physical device, confirm no upload, persistence, export, save-to-Photos, real AI, Cloud Functions, or StoreKit behavior occurs.

## Pre-Real Firebase Readiness

- [ ] Create a Firebase project manually.
- [ ] Confirm iOS bundle ID.
- [ ] Define a safe `GoogleService-Info.plist` handling plan.
- [ ] Confirm real Firebase config is never committed.
- [ ] Confirm secrets are never committed.
- [ ] Review Firestore document model.
- [ ] Review Firebase Storage path convention.
- [ ] Write and review Firestore Security Rules.
- [ ] Write and review Storage Security Rules.
- [ ] Define App Check monitor / enforcement plan.
- [ ] Configure Auth providers only in a confirmed Firebase project.
- [ ] Define delete photo flow.
- [ ] Define account and data deletion flow.
- [ ] Review retention and soft-delete wording.
- [ ] Prepare emulator or staging project testing.

## Pre-Real AI Readiness

- [ ] Use server-side proxy only.
- [ ] Keep Gemini / OpenAI keys out of iOS.
- [ ] Require explicit consent before third-party AI analysis.
- [ ] Keep `trainingConsent` default false.
- [ ] Review provider data handling policy.
- [ ] Define cost controls.
- [ ] Define quota / rate limits.
- [ ] Define provider fallback.
- [ ] Validate structured responses.
- [ ] Define prompt logging policy.
- [ ] Define image downscaling policy before analysis.
- [ ] Handle timeout, malformed response, provider error, and abuse fallback.
- [ ] Confirm mock provider remains available for local testing.

## Pre-StoreKit Readiness

- [ ] Define subscription products in App Store Connect.
- [ ] Create local `.storekit` testing plan.
- [ ] Implement purchase flow only in a later explicit phase.
- [ ] Implement restore purchases flow only in a later explicit phase.
- [ ] Clearly describe subscription benefits before purchase.
- [ ] Do not lock basic camera or basic filters behind VIP.
- [ ] Define entitlement state.
- [ ] Define refund / cancellation copy.
- [ ] Define backend subscription sync plan if needed.

## Privacy / App Store Readiness

- [ ] Prepare real privacy policy URL.
- [ ] Prepare App Store privacy labels that match production data flows.
- [ ] Add AI analysis consent before real third-party AI processing.
- [ ] Add account deletion request flow if account creation exists.
- [ ] Add data deletion documentation and support path.
- [ ] Confirm no tracking, personalized ads, or analytics SDKs are added without a separate review.
- [ ] Confirm App Store metadata does not claim unavailable features.
- [ ] Confirm all local/mock labels are removed or updated only when real services are connected.

## Secret And Safety Checks

Run before demo and before future real-service work:

```bash
find . -name "GoogleService-Info.plist" -o -name ".env" -o -name ".firebaserc" -o -name "*.p8" -o -name "*.mobileprovision" -o -name "*.provisionprofile"
rg -n "import Firebase|import FirebaseFunctions|import FirebaseStorage|import FirebaseFirestore|import StoreKit|import Gemini|import OpenAI" ios-app/AIPhotoApp -g '*.swift'
rg -n "FirebaseApp\\.configure|httpsCallable|Functions\\.functions|URLSession|putData|putFile|setData\\(|addDocument\\(|UIImageWriteToSavedPhotosAlbum|PHPhotoLibrary\\.shared|UserDefaults|CoreData|SwiftData|Product\\.products" ios-app/AIPhotoApp functions/src -g '*.swift' -g '*.ts'
rg -n "AIza|GEMINI_API_KEY|OPENAI_API_KEY|apiKey|private_key|client_secret|firebase_project_id|projectId|APPLE_TEAM_ID|DEVELOPMENT_TEAM" . -g '!**/.git/**'
```

Expected:

- Only `.env.example` or documentation may mention placeholder secret names.
- No real secret or production config exists.
- No forbidden iOS imports exist.
- No real Firebase / AI / Cloud Functions / StoreKit / persistence / upload / export behavior exists.
