# Cloud AI Boundary Backend Skeleton

Phase 17A adds a mock-only backend boundary for future Cloud AI work.

This backend does not call OpenAI, Gemini, Firebase AI, Stability, or any other provider. It does not require provider API keys and must not store uploaded images or request payloads.

Phase 17C-Prep hardens the boundary before any real provider work. The executable provider adapter remains mock / disabled only.

## Run

```sh
npm test
npm start
```

The mock server listens on `PORT` or `8787`.

Phase 17B iOS DEBUG builds expect the local mock server at:

```text
http://127.0.0.1:8787
```

This is for internal boundary testing only. It is not a production provider URL.

## Endpoints

- `GET /health`
  - Returns mock-only service status.
- `POST /v1/ai/photo-advisor`
  - Validates the hardened request shape.
  - Requires `schemaVersion: "1.0"`, `feature: "photo_advisor"`, `mode: "post_capture"`, locale, and explicit consent.
  - Accepts only mock-safe compressed JPEG image metadata / base64 payload shape.
  - Requires metadata stripping.
  - Validates optional `selectedFilterId` against the app filter whitelist.
  - Returns a structured mock `CloudAIResponse`.

## Provider Boundary

Executable provider kinds:

- `mock`
- `disabled`

There is no OpenAI, Gemini, Firebase AI, Stability, or other real provider implementation. Do not add provider SDKs, provider URLs, or provider API key reads without an explicit future provider phase.

## Validation / Safety

Phase 17C-Prep adds:

- stricter request validation
- stricter response validation
- known filter ID whitelist
- unsafe text / sensitive inference guard
- standardized fallback / unavailable response
- dev-only rate-limit, quota, and provider timeout placeholders
- valid / invalid / unsafe backend fixtures

Run:

```sh
npm test
```

## No Payload Logging

Do not log:

- raw image data
- base64 image data
- full request payloads
- provider prompts
- provider raw responses
- EXIF / GPS metadata
- face data
- identity data
- sensitive inference

Allowed operational metadata, if needed in a future phase:

- request ID
- endpoint
- mode
- schema version
- status
- latency
- coarse image size bucket
- error code
- provider kind

## Future TODO

- Add authenticated backend boundary only after explicit approval.
- Add signed upload / download planning only after export and storage policy are approved.
- Add real provider integration only after Phase 17C-style approval, provider policy review, cost guard, timeout, moderation, and validation work.
- Do not commit secrets, `.env`, provider keys, Firebase config, or production storage config.
