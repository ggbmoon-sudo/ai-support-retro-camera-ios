# Cloud AI Architecture Research

Phase 16F research backfill for the future real AI backend boundary.

This document is a product and technical research source of truth. It is not an implementation spec and does not authorize iOS network code, backend code, provider SDKs, API keys, upload, persistence, or real AI integration.

---

## 1. Executive Summary

The app should remain mock-only / local-only until a real backend boundary is intentionally built.

iOS must not contain Gemini / OpenAI SDKs, provider API keys, production Firebase project IDs, or direct provider calls. The iOS app should talk only to our backend. The backend should own:

- provider credentials
- request validation
- image handling
- AI provider call
- structured JSON validation
- safety filtering
- quota / cost guard

The app should receive only an app-safe structured response.

---

## 2. Phase 17 Recommendation

Phase 17 should not start with Gemini Live / streaming.

Phase 17 should not start with AI Filter Generator.

The first real AI feature should be Post-capture AI Photo Advisor.

Recommended first endpoint:

```text
POST /v1/ai/photo-advisor
```

Reasons:

- Post-capture is user-initiated.
- Explicit consent is easy to show.
- It requires only one compressed image.
- Latency tolerance is higher than live camera guidance.
- UI can render a result card.
- Risk is lower than AI Snapshot, Gemini Live, or AI Filter Generator.

---

## 3. Architecture Principles

Core boundary:

```text
iOS app
  -> our backend proxy
  -> AI provider
  -> backend validation / safety / schema layer
  -> iOS typed model / UI
```

Principles:

- No provider API key in iOS app.
- iOS app only talks to our backend.
- Backend owns provider credentials.
- Explicit user consent before image upload.
- No background auto upload.
- No live stream in initial phases.
- No raw frame persistence.
- No request payload logging.
- Structured JSON response only.
- Timeout / cancellation / retry guard.
- Quota / cost guard.
- Mock / real service interchangeable.
- All cloud AI features share a consistent service boundary.

---

## 4. Feature-specific Backend Needs

### AI Snapshot

- One-shot image analysis.
- Pre-capture advice.
- Consent required.
- Small compressed image.
- Low latency target.
- Not the first real AI endpoint.

### Post-capture AI Photo Advisor

- Best first real AI endpoint.
- Analyze captured / imported / selected photo.
- Composition / lighting / filter / retake / crop suggestions.
- Structured card response.
- Consent required.
- No raw image persistence.

### AI Filter Generator

- Higher risk and cost.
- Requires reference image analysis.
- Outputs `GeneratedFilterRecipe` JSON.
- Requires strict schema validation.
- Requires numeric clamp.
- Recipe only, no raw image retention.
- Should come after the photo advisor backend boundary is stable.

### Inspiration AI

- Can start text-only / mock.
- Lower privacy risk.
- May not require image upload.

### Future Voice / Gemini Live

- Not Phase 17.
- Needs WebSocket / streaming gateway.
- Needs ephemeral token strategy.
- Needs separate privacy / cost guard.

---

## 5. Backend Platform Options

Options:

- Firebase Cloud Functions 2nd gen
- Google Cloud Run
- Vercel Functions
- Supabase Edge Functions
- Custom backend
- Local-only

Recommendation:

- One-shot image AI MVP: Google Cloud Run or Firebase Cloud Functions 2nd gen.
- Future Gemini Live / streaming: Cloud Run or a dedicated backend.
- Do not use Vercel / Supabase Edge as the main image AI backend unless the feature is text-only or extremely small-payload.

Cloud Run is the more provider-agnostic and extensible option. Firebase Cloud Functions 2nd gen can be reasonable if Firebase Auth / App Check / Firebase ecosystem integration is central to the app.

---

## 6. Request Flow

Secure flow:

1. User taps AI analysis.
2. iOS shows consent.
3. User accepts.
4. iOS compresses image.
5. iOS strips metadata.
6. iOS sends request to backend.
7. Backend authenticates / validates / quota checks.
8. Backend calls provider with structured output schema.
9. Provider returns candidate.
10. Backend validates JSON.
11. Backend validates `filterId` / `poseId` / recipe params.
12. Backend safety filters.
13. Backend returns app-safe response.
14. iOS validates again.
15. UI renders card.
16. No raw image persistence.

Timeout / cancellation recommendation:

- iOS timeout: 15-25 seconds.
- Backend provider timeout: 12-20 seconds.
- Retry at most once for transient network/provider errors.
- No retry for unsafe response, invalid schema, consent declined, or user cancelled.

---

## 7. Image Compression / Upload Strategy

Recommended image sizes:

| Feature | Long edge | JPEG quality | Strategy |
| --- | ---: | ---: | --- |
| AI Snapshot | 512-768 px | 0.55-0.70 | low latency / low detail |
| Post-capture Advisor | 768-1024 px | 0.65-0.75 | enough for composition, light, filter advice |
| Filter Generator Reference | 1024-1536 px | 0.75-0.85 | more color and style detail |

Rules:

- Strip metadata.
- Do not upload original HEIC / full-res image.
- Enforce max size on client and server.
- Prefer `multipart/form-data` for larger images.
- Avoid storage bucket raw image persistence in Phase 17.
- JSON + base64 is acceptable only for very small payloads.

---

## 8. Structured Response Schema

Use JSON Schema / Structured Outputs. UI should not rely on free text.

Validation should happen on both server and iOS.

Schema requirements:

- `schemaVersion`
- `mode` enum
- suggestions max 3
- recommended filters max 3
- `filterId` whitelist
- `poseId` whitelist
- generated filter numeric clamp
- unsafe response rejection

Mode enum:

- `pre_capture`
- `post_capture`
- `filter_recommendation`
- `filter_generation`
- `inspiration`
- `pose_guide`
- `unavailable`
- `error`

Example app-safe response:

```json
{
  "schemaVersion": "1.0",
  "mode": "post_capture",
  "summary": "這張相有暖光感，可以試柔和復古濾鏡。",
  "suggestions": [
    {
      "type": "filter",
      "text": "可以試 Instant Dream，令暖光更柔和。",
      "priority": "high",
      "action": "apply_filter"
    }
  ],
  "recommendedFilters": [
    {
      "filterId": "instant_dream",
      "reason": "適合暖光人像。",
      "confidence": "high"
    }
  ],
  "generatedFilter": null,
  "poseGuide": null,
  "retakeAdvice": {
    "shouldRetake": false,
    "reason": "可以保留這張，先試濾鏡。"
  },
  "confidence": "medium",
  "source": "cloud",
  "locale": "zh-Hant-HK",
  "safety": {
    "containsSensitiveInference": false,
    "requiresUserConsent": true,
    "blockedReason": null
  },
  "error": null
}
```

Server-side validation:

- Validate JSON parse.
- Validate `schemaVersion`.
- Validate mode enum.
- Reject unknown fields.
- Validate text length.
- Validate suggestion and filter counts.
- Validate `filterId` exists in app catalog.
- Validate `poseId` exists in app catalog.
- Clamp generated filter numeric parameters.
- Reject unsafe response.
- Map provider errors to app-safe error codes.

iOS-side validation:

- Strongly typed decode.
- Unknown enum fallback.
- Filter and pose whitelist check.
- Generated filter clamp again.
- Unsafe text fallback.
- Never crash UI.
- Show unavailable / mock fallback state.

---

## 9. Security / Privacy / Consent

Required boundaries:

- Explicit consent before cloud image analysis.
- No background upload.
- No raw image persistence.
- No request payload logging.
- App Privacy labels need review.
- User Content / Photos data type may apply if uploaded.
- App Check / device attestation may reduce abuse.
- Provider raw response should not be logged.

Logging policy: do not log:

- raw image
- base64 image
- raw camera frame
- full prompt
- request payload
- provider raw response
- EXIF / GPS metadata
- face descriptors
- identity / sensitive inference

Logging policy: may log:

- requestId
- endpoint
- mode
- schemaVersion
- response status
- latencyMs
- image byte size bucket
- provider family
- token estimate bucket
- error code
- user/device hash

Consent copy example:

```text
AI 需要上傳一張壓縮相片到我們的伺服器作一次性分析。
相片只用於今次分析，不會背景上傳，也不會保存原圖。
你可以取消，繼續手動揀濾鏡。
```

---

## 10. Provider Comparison

Provider options:

- OpenAI vision / multimodal.
- Gemini vision / multimodal.
- Other providers.
- Local heuristic + text model hybrid.
- Local-only approach.

Guidance:

- Do not put provider SDKs or API keys in iOS.
- OpenAI and Gemini should both be proxied through backend.
- Gemini Live may later use ephemeral tokens, but that is not Phase 17.
- Provider choice must align with privacy copy, retention policy, cost, and structured output reliability.

---

## 11. Error / Unavailable States

App-safe error codes:

- `network_unavailable`
- `timeout`
- `quota_exceeded`
- `provider_error`
- `invalid_json`
- `unsafe_response`
- `image_too_large`
- `user_cancelled`
- `consent_declined`
- `unsupported_image`
- `backend_unavailable`

UI copy examples:

| Error | UI copy |
| --- | --- |
| `network_unavailable` | `網絡未連線，先用本地建議。` |
| `timeout` | `AI 暫時太慢，可以稍後再試。` |
| `quota_exceeded` | `今日 AI 分析次數暫時用完。` |
| `provider_error` | `AI 服務暫時未穩定，先用本地建議。` |
| `invalid_json` | `AI 回應格式唔穩定，已改用安全建議。` |
| `unsafe_response` | `呢次回應未能安全顯示，已略過。` |
| `image_too_large` | `呢張相太大，請用壓縮版本再試。` |
| `user_cancelled` | `已取消分析，張相唔會上傳。` |
| `consent_declined` | `無問題，呢張相會留喺本機。` |
| `unsupported_image` | `呢個圖片格式暫時未支援。` |
| `backend_unavailable` | `伺服器暫時連唔到，先用 mock 建議。` |

Backend should never pass raw provider errors directly to iOS UI.

---

## 12. Cost / Quota Strategy

Cost drivers:

- image resolution
- detail level
- number of images
- input / output tokens
- model choice
- retry count

Quota suggestions:

- Anonymous user daily limits.
- Signed-in user higher quota later.
- Per IP / device / user rate limit.
- Hard kill switch.
- Session-only cache possible.
- No persistent image cache in Phase 17.

Cost guard:

- Compress image before upload.
- Limit output length.
- Suggestions max 3.
- Recommended filters max 3.
- No caption / social copy in Phase 17.
- No retry storm.
- Provider usage monitoring.

---

## 13. API Contract Proposal

Future iOS files:

- `CloudAIService.swift`
- `CloudAIModels.swift`
- `CloudAIEndpointClient.swift`
- `MockCloudAIService.swift`
- `RemoteCloudAIService.swift`
- `CloudAIConsentView.swift`
- `CloudAIResultView.swift`
- `CloudAIResponseValidator.swift`
- `CloudAIImageCompressor.swift`

Possible endpoints:

- `POST /v1/ai/photo-advisor`
- `POST /v1/ai/snapshot`
- `POST /v1/ai/filter-generator`
- `POST /v1/ai/inspiration`

Phase 17 first endpoint recommendation:

```text
POST /v1/ai/photo-advisor
```

Future backend structure:

```text
backend/
  schemas/
  validators/
  prompts/
  routes/
  providers/
  security/
```

---

## 14. MVP Recommendation

Suggested real AI backend roadmap:

### Phase 17A Backend Boundary Skeleton

- Backend project.
- `/health`.
- `/v1/ai/photo-advisor` mock-safe endpoint.
- Schema validation only.
- No provider call.

### Phase 17B Remote CloudAIService Behind Feature Flag

- iOS `CloudAIService` protocol.
- Mock remains default.
- Remote hidden behind feature flag.
- Consent sheet.
- Compressed JPEG upload.
- Timeout / cancel / fallback.

### Phase 17C Real Provider Call

- Provider key only in backend.
- Structured Outputs / JSON Schema.
- Response validation.
- Safety validation.
- No raw image persistence.
- Rate limit.

### Phase 17D Internal Test

- Small quota.
- Logs without payload.
- App Store privacy review draft.
- Provider cost monitoring.

Do not include in Phase 17:

- Gemini Live / streaming.
- Real cloud AI Filter Generator.
- Caption / social copy.
- History persistence of raw AI response.
- Provider SDK in iOS.
- API key in iOS.

---

## 15. Risk Table

| Risk | Impact | Mitigation |
| --- | --- | --- |
| API key leakage | Cost spike, provider account risk | No key in iOS; backend only; Secret Manager; rotation |
| Privacy complaint | User trust and App Store risk | Explicit consent; no background upload; no raw persistence |
| Upload too slow | Camera UX degradation | Compress image; timeout; mock fallback |
| Provider cost spike | Uncontrolled spending | Quota, rate limits, budget alerts |
| Provider hallucination | Bad UI advice | Structured schema, validation, filter whitelist |
| Invalid JSON | Crash / blank UI risk | Structured outputs, backend validation, iOS fallback |
| Prompt injection | Unsafe/off-contract output | System prompt, schema output, unsafe text rejection |
| App Store review concern | Review delay | Privacy labels, consent, no sensitive inference |
| Bad AI advice | User distrust | Action-oriented suggestions, no scores |
| Sensitive inference | Safety risk | Reject identity / age / gender / emotion / health / race / religion inference |
| Backend downtime | Feature unavailable | Local mock fallback, health checks |
| Quota abuse | Cost and stability risk | App Check / auth / IP / device / user limits |
| Logging mistakes | Accidental retention | Metadata-only logs, redaction |
| Region / compliance issues | Legal / privacy risk | Choose region deliberately; document retention |
| Image too large | Failed requests / high cost | Client and server max bytes |
| Live stream scope creep | Architecture complexity | Explicitly defer Gemini Live / streaming |

---

## Known TODOs

- Draft `CloudAIResponse` v1.0 JSON Schema.
- Draft Photo Advisor prompt contract.
- Draft consent copy and privacy policy wording.
- Map App Store privacy labels before real upload.
- Choose provider only after backend boundary planning.
- Estimate cost and quota before enabling any provider call.
- Keep Phase 17 focused on backend boundary, not Gemini Live or Filter Generator.
