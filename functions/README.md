# Cloud Functions Placeholder

This folder will contain Firebase Cloud Functions v2.

Planned responsibilities:

- AI provider adapter
- GeminiAnalyzer
- OpenAI image/edit adapter placeholder
- analyzePhoto callable
- quota enforcement
- daily login bonus
- deletePhoto
- deleteAccountData
- cleanupExpiredPhotos
- syncSubscriptionStatus

Phase 00 only creates placeholder structure.

Do not commit real API keys.
Use server-side secret management for Gemini and OpenAI keys.

## Phase 06 AI Photo Advisor Scaffold

Phase 06 adds a dependency-free AI Photo Advisor backend scaffold under:

```text
functions/src/
```

Current Phase 06 files include:

- `analyzePhoto.ts`
- `ai/AIProviderAdapter.ts`
- `ai/MockAnalyzer.ts`
- `ai/GeminiAnalyzer.ts`
- `ai/OpenAIAnalyzer.ts`
- `contracts/photoAnalysis.ts`
- `prompts/photoAdvisorPrompt.ts`

This scaffold is intentionally mock-only:

- `analyzePhoto` validates the draft request and returns `MockAnalyzer` output.
- `MockAnalyzer` returns one short summary, up to three suggestions, adjustment hints, `provider = mock`, and `isMock = true`.
- `GeminiAnalyzer` and `OpenAIAnalyzer` are TODO placeholders and throw not-configured errors.
- The prompt template is future-only documentation and is not sent to any provider.

Phase 06 does not add Gemini or OpenAI SDKs, Firebase Admin SDK imports, npm dependencies, real API keys, `.env`, `.firebaserc`, Firebase project IDs, real Storage reads, real Firestore writes, deployed functions, AI billing, quota enforcement, StoreKit, image editing, or realtime video AI.
