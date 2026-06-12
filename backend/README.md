# Cloud AI Boundary Backend Skeleton

Phase 17A adds a mock-only backend boundary for future Cloud AI work.

This backend does not call OpenAI, Gemini, Firebase AI, Stability, or any other provider. It does not require provider API keys and must not store uploaded images or request payloads.

## Run

```sh
npm test
npm start
```

The mock server listens on `PORT` or `8787`.

## Endpoints

- `GET /health`
  - Returns mock-only service status.
- `POST /v1/ai/photo-advisor`
  - Validates a Phase 17A request shape.
  - Requires `schemaVersion: "1.0"`, `mode: "post_capture"`, and an explicit consent marker.
  - Accepts only mock-safe JPEG image metadata / payload shape.
  - Returns a structured mock `CloudAIResponse`.

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

## Future TODO

- Add authenticated backend boundary only after explicit approval.
- Add signed upload / download planning only after export and storage policy are approved.
- Add real provider integration only after Phase 17C-style approval, provider policy review, cost guard, timeout, moderation, and validation work.
- Do not commit secrets, `.env`, provider keys, Firebase config, or production storage config.
