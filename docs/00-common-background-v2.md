# Common Background v2

I am building an iOS-first AI Support retro camera app.

Product positioning:

This is not a full AI photo editing studio. It is a retro film-style camera plus a single-photo AI photo coach. The goal is to help photography beginners take better cinematic, retro, well-composed, well-lit, natural-looking photos of partners, family, friends, food, and scenery.

MVP goals:

- Single-photo capture
- Single-photo import from photo library
- At least 3 retro film presets
- One-tap retro output
- One-photo AI analysis after capture
- AI returns 1 short summary, up to 3 actionable suggestions, and simple adjustment values
- Basic history
- Firebase Storage stores images
- Firestore stores metadata, AI advice values, and preset IDs
- Free users receive 20 starter analysis credits
- Daily login grants 1 analysis credit
- Free users can save up to 20 cloud photos
- Subscription page scaffold
- Privacy consent
- Delete single photo
- Delete account

Confirmed technical architecture:

- iOS frontend: Swift + SwiftUI
- Camera: AVFoundation
- Photo import: PhotosPicker / PHPicker
- Local filters: Core Image
- Advanced GPU work: Metal only if needed
- Local visual guidance: Vision for lightweight grid, horizon, face/person framing, pose points, brightness hints
- Backend: Firebase-first
- Auth: Firebase Auth with email/password, Google login, Apple login
- Storage: Firebase Storage
- Database: Cloud Firestore
- Server logic: Cloud Functions v2
- Config: Remote Config
- Abuse protection: App Check
- Subscription: StoreKit 2 + StoreKit views
- AI: Cloud Functions server-side proxy + provider adapter
- MVP AI provider: Gemini paid tier / GeminiAnalyzer
- OpenAI image/edit: adapter placeholder only for future image editing and reference image generation

Important boundaries:

- MVP does not implement true cloud real-time video streaming AI.
- MVP does not implement full AR.
- MVP does not implement 3D pose overlay.
- MVP does not implement complex skeleton tracking.
- MVP does not implement social features.
- MVP does not implement a full AI image editing studio.
- MVP does not include personalized ads SDK.
- Half-frame, double exposure, and a full camera/lens library are future features.
- VIP must not lock the basic camera.
- Basic camera and basic filters should remain free.
- VIP benefits should focus on more AI analysis, more cloud storage, original image storage, premium presets, future follow-up chat, and future image editing.

Privacy direction:

- First AI analysis requires consent.
- Consent should explain that photos are sent to third-party AI services for analysis.
- Do not assume user photos are used for model training.
- `trainingConsent` defaults to false.
- Any future model improvement or training usage must be separate, revocable, auditable opt-in.
- Users can delete single photos.
- Users can delete account and data.
- iOS app must not store Gemini or OpenAI API keys.
- API keys must be server-side only.

Report requirements:

- Use Traditional Chinese for product reports.
- Keep outputs Codex-executable.
- Do not reopen already-set architecture decisions.
- Do not over-engineer.
- Clearly separate MVP, MVP+, and Future.
- Include file names, class/module names, data schemas, Cloud Function contracts, Security Rules, test checklists, and acceptance criteria where relevant.
