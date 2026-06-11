# Post-capture AI Photo Advisor UX Research

Phase: 16H-Recovery
Status: Research backfill / documentation-only
Source: `Post-capture AI Photo Advisor UX for iOS Retro Camera App 深入研究報告.md`

This document is the source of truth for future Mock Post-capture AI Advisor UX and later Real Cloud AI Photo Advisor planning.

It is not an implementation spec for this phase. It does not add Swift app behavior, real AI, backend code, network calls, upload, persistence, export, provider SDKs, API keys, or production configuration.

---

## 1. Executive Summary

Post-capture AI Photo Advisor is a strong AI feature candidate for a camera-first retro photo app.

It is lower risk than live AI / Gemini Live and more appropriate as the first real AI endpoint than a real-cloud AI Filter Generator because:

- The user triggers it after taking or importing a photo.
- A consent screen can be shown before any future upload.
- It needs one still image, not a live camera stream.
- It does not require continuous frame upload.
- Latency tolerance is higher than live camera guidance.
- The result can be rendered as a compact result card.
- Mock fallback feels natural if cloud AI is unavailable.
- It can recommend from the existing local filter catalog.

MVP should start with mock UX, response schema, fixtures, and validation. Real cloud AI should wait until a Phase 17 backend boundary is explicitly implemented.

---

## 2. Product Goal

Post-capture AI Photo Advisor helps the user understand one captured or imported photo and decide the next action.

It may help with:

- Mood / atmosphere.
- Composition improvements.
- Lighting improvements.
- Filter choice.
- Whether to retake.
- Whether to crop.
- Caption / social copy in a later phase.

It is not:

- A chat entry point.
- A photo scoring system.
- A beauty or attractiveness judge.
- An appearance critic.

The product role is an action-oriented photo advisor. It should give the user a next step instead of criticizing the photo or the person in it.

---

## 3. Placement in App

### MVP Recommended Placement

- Capture result screen / 拍完後 result.
- Imported photo result / 匯入相片後 result.
- Inspiration import analysis flow.

### Later Placement

- History detail.
- Filter preview page.
- AI Snapshot result extension.
- Filter Lab result after a generated filter.

The first mock implementation can start with imported photo flow, capture result flow, and Inspiration import analysis. It should not turn the Camera tab into a scroll page and should not interfere with the fullscreen camera shooting surface.

---

## 4. UX Pattern

| Pattern | Recommendation | Notes |
| --- | --- | --- |
| Compact result card | Recommended | Best MVP shape: short, glanceable, and close to the result screen. |
| Expandable sections | Recommended | Summary first; strengths and details can expand later. |
| Bottom sheet | Useful later | Good for "more advice" but should not be the first primary surface. |
| Tabbed result | Not MVP | Too heavy for a camera-first flow. |
| Checklist | Good secondary pattern | Works for 1-3 next actions. |
| Before / after filter preview | Recommended after MVP | Valuable when applying a recommended filter. |
| One primary recommendation + secondary suggestions | Strongly recommended | Best fit for post-capture decision making. |
| Chat-like response | Not recommended | Pulls the product toward chat instead of camera. |
| Score card | Not recommended | Risks becoming judgmental or beauty/quality scoring. |

Conclusion:

- Do not use long-form chat UI.
- Do not show a 0-100 photo score.
- Do not score beauty or attractiveness.
- Use a compact action card.
- Show one summary sentence, 1-3 suggestions, and 1-3 filter recommendations.
- Details may be expandable, but the default result should stay short.

---

## 5. AI Result Content Design

### Summary

One short mood and direction sentence.

Example:

```text
這張相有溫暖的夕陽感，適合柔和復古濾鏡。
```

### Strengths

Strengths should identify what is already working:

- 氛圍好.
- 光線有層次.
- 主體清楚.
- 背景有電影感.
- 色彩適合復古濾鏡.

### Suggestions

Suggestions should give 1-3 next actions:

- Try another filter.
- Brighten slightly.
- Lower highlights.
- Crop.
- Step back when retaking.
- Move the subject closer to center.
- Avoid cluttered background.

### Filter Recommendations

Recommend 1-3 existing filters only.

### Retake Advice

Retake advice should be optional and gentle:

- 不建議重拍，只需換 filter.
- 建議重拍一張，主體退後少少.
- 建議保留這張，再試另一個 filter.

### Crop Advice

Keep crop advice short.

Example:

```text
可以裁走右邊空白，主體會更集中。
```

### Caption / Social Copy

Caption can be a later optional feature:

- IG caption.
- 小紅書文案.
- Mood caption.

MVP should not include caption UI because it widens scope and introduces platform-specific writing expectations. The schema may keep `captionSuggestions` empty.

---

## 6. Filter Recommendation Integration

AI may recommend only existing filters from the 20-filter catalog. It must not invent a new `filterId`.

| Scene | Recommendation |
| --- | --- |
| 人像 + 暖光 | Soft Warm 400 / Instant Dream |
| 夜景 | Amber Night 800 / Neon Tungsten 800 |
| 街拍 | Street Chrome / Metro Pop |
| CCD 感 | CCD Party 2008 |
| 電影感 | Cinema Flat / Editor Classic |
| 陽光夏日 | Summer Gold 200 / Everyday Color 400 |

UX behavior:

- Provide one-tap apply recommended filter.
- Show a short reason for each recommendation.
- A before / after preview can be added after the compact card is stable.
- If AI returns an unknown `filterId`, fall back to a safe existing filter.
- Do not mutate or expand the existing 20-filter catalog during the advisor MVP.

---

## 7. Retake / Crop Advice

Copy principles:

- Do not criticize.
- Do not command.
- Offer options.
- Use a gentle photography-assistant tone.

Recommended examples:

- `可以保留這張，不需要重拍。`
- `如果想更自然，可以重拍一張，人物退後少少。`
- `光線有點硬，可以換到陰影位置再拍。`
- `可以裁走右邊空白，主體會更集中。`
- `保留上方天空，畫面會更有旅行感。`

Avoid:

- `這張拍得不好。`
- `你應該重拍。`
- `構圖很差。`
- `AI 已計算出唯一正確裁切。`

---

## 8. Response Schema

Example response:

```json
{
  "schemaVersion": "1.0",
  "mode": "post_capture",
  "summary": "這張相有溫暖的夕陽感，適合柔和復古濾鏡。",
  "strengths": [
    "背景光有電影感。",
    "人物位置清楚。"
  ],
  "suggestions": [
    {
      "type": "filter",
      "text": "可以試試 Instant Dream，令夕陽感更柔和。",
      "priority": "high"
    }
  ],
  "recommendedFilters": [
    {
      "filterId": "instant_dream",
      "reason": "適合暖光人像。"
    }
  ],
  "retakeAdvice": {
    "shouldRetake": false,
    "reason": "目前構圖已可接受，只需微調濾鏡。"
  },
  "cropAdvice": {
    "recommended": true,
    "text": "可裁走右邊空白，主體會更集中。"
  },
  "captionSuggestions": [
    "golden hour mood"
  ],
  "confidence": "medium",
  "source": "mock"
}
```

Schema rules:

- `schemaVersion` is required.
- `mode` must be `post_capture`.
- `suggestions` max 3.
- `recommendedFilters` max 3.
- `captionSuggestions` is optional and may be empty for MVP.
- `filterId` must validate against the existing catalog.
- `source` may be `mock`, `local`, `cloud`, or `fallback`.
- Unsafe, invalid, overlong, or unknown-filter responses must fall back to a safe local result.

---

## 9. Mock MVP Strategy

Without real AI, mock advisor responses may be selected from:

- Selected filter.
- Imported vs captured source.
- Local brightness signal.
- Mock scene type.
- Random fixture.
- User-chosen mood.
- Image placeholder state.

### Mock Fixtures

| Fixture | Summary | Strengths | Suggestions | Recommended Filters | Retake Advice | Crop Advice | Confidence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 暖光人像 | 這張相有溫暖的夕陽感，適合柔和復古濾鏡。 | 暖光令畫面更有情緒；主體位置清楚。 | 試 Instant Dream；保留多一點背景光。 | `instant_dream`, `soft_warm_400` | 不需要重拍。 | 目前構圖自然。 | medium |
| 夜景街拍 | 這張相有夜晚街頭感，適合高 ISO 復古色調。 | 街燈有氣氛；暗位保留夜景感。 | 試 Amber Night 800。 | `amber_night_800`, `neon_tungsten_800` | 先試濾鏡。 | 可裁走底部少少暗位。 | medium |
| 室內偏暗 | 這張相有室內生活感，可以用柔和暖色提升氣氛。 | 室內光線自然；畫面有日常感。 | 稍微提亮；試 Editor Classic。 | `editor_classic`, `soft_warm_400` | 先試提亮和濾鏡。 | 不需要明顯裁切。 | low |
| CCD party | 這張相有派對 snapshot 感，適合 CCD 風格。 | 畫面有即興感；閃光感適合復古處理。 | 試 CCD Party 2008。 | `ccd_party_2008` | 保留即興感會更自然。 | 可裁走邊位雜物。 | medium |
| 旅行風景 | 這張相有旅行記錄感，適合明亮、輕暖的色調。 | 背景空間感清楚；畫面輕鬆。 | 試 Summer Gold 200；保留上方天空。 | `summer_gold_200`, `everyday_color_400` | 保留這張，再試暖色 filter。 | 建議保留背景空間。 | medium |
| 高光過曝 | 這張相光線比較亮，可以用低對比濾鏡保留柔和感。 | 畫面乾淨；亮部有夏日感。 | 降低高光；試 Cinema Flat。 | `cinema_flat`, `soft_warm_400` | 如想保留細節，可在陰影位置再拍。 | 先調整光線，比裁切更重要。 | medium |
| 背景太亂 | 這張相有街頭記錄感，可以透過裁切令主體更集中。 | 畫面有生活感；背景帶出現場感。 | 裁走右邊少少空白；試 Street Chrome。 | `street_chrome`, `metro_pop` | 先用裁切和 filter 集中視線。 | 可裁走右邊或底部少少雜物。 | medium |
| 黑白 / chrome mood | 這張相線條感比較強，適合 chrome 或低彩度風格。 | 光暗層次清楚；畫面有街拍感。 | 試 Street Chrome。 | `street_chrome`, `editor_classic` | 目前光影適合 chrome 方向。 | 可裁成 4:5，線條會更集中。 | medium |

---

## 10. Future Real AI Strategy

Post-capture Advisor is a good first real cloud AI feature, but only after the backend boundary is ready.

Requirements:

- No provider API key in iOS.
- Backend proxy only.
- Explicit consent.
- Compressed JPEG.
- Metadata stripping where possible.
- Structured JSON response.
- Backend validation.
- iOS validation.
- No raw photo persistence.
- No request payload logging.
- Timeout and cancellation.
- Mock fallback.

Future Phase 17 endpoint:

```text
POST /v1/ai/photo-advisor
```

Phase 16H-Recovery does not implement backend code or real AI.

---

## 11. History Integration

### Current / MVP

- Session-only advisor result.
- Do not save raw AI response.
- Do not save raw photo.
- Do not change local history schema unless an existing mock-only path can be safely reused.

### Future

- May save validated summary and recommended filter ids.
- Do not save provider raw response.
- Do not save raw image or request payload.
- User must be able to delete saved advisor metadata if it is ever persisted.

---

## 12. Inspiration Integration

Post-capture Advisor can later connect with Inspiration:

- Show AI analysis after importing a photo.
- Recommend inspiration cards based on mood.
- Recommend pose guides.
- Recommend Filter Generator entry points.
- Suggest using the imported image as a reference image for a future generated filter.
- Recommend shooting tasks.

MVP should not attempt all of these at once. The first implementation should focus on the compact advisor card and existing-filter recommendations.

---

## 13. Safety / Privacy Boundaries

AI must not do:

- Beauty scoring.
- Attractiveness scoring.
- Age inference.
- Gender inference.
- Emotion inference.
- Identity recognition.
- Health-state inference.
- Race, religion, or sensitive attribute inference.
- Appearance criticism.
- Upload without consent.
- Background auto-analysis.
- Raw photo / request payload storage.
- Long-running live stream.

AI may do:

- Composition advice.
- Lighting advice.
- Style analysis.
- Filter recommendation.
- Crop / retake suggestion.
- Caption in a later optional phase.

---

## 14. UI Copy

Copy should be short, gentle, action-oriented, and photography-assistant-like.

| State | Traditional Chinese / Cantonese-style Copy |
| --- | --- |
| analyzing | `正在分析這張相…` / `幫你睇緊呢張相嘅氛圍…` |
| success | `這張相有柔和的復古感。` / `搵到幾個適合呢張相嘅方向。` |
| partial success | `分析到部分建議，可以先試濾鏡。` |
| unavailable | `AI 暫時未能分析，先用本地建議。` |
| consent declined | `無問題，呢張相會留喺本機。` |
| no recommendation | `暫時未有明確推薦，可以試自然色調。` |
| apply filter | `套用呢個濾鏡` |
| retake suggestion | `如果重拍，可以退後少少，背景會更有空間。` |
| crop suggestion | `可以裁走右邊少少空位，主體會更集中。` |
| caption suggestion | `幫你諗一句短 caption` |

---

## 15. Implementation Architecture Proposal

Future implementation may add:

- `PhotoAdvisorModels.swift`
- `PhotoAdvisorService.swift`
- `MockPhotoAdvisorService.swift`
- `PhotoAdvisorViewModel.swift`
- `PhotoAdvisorResultView.swift`
- `PhotoAdvisorFilterRecommendationView.swift`
- `PhotoAdvisorConsentView.swift`
- `PhotoAdvisorFixtures.swift`

Suggested service protocol:

```swift
protocol PhotoAdvisorService {
    func analyzePhoto(_ input: PhotoAdvisorInput) async throws -> PhotoAdvisorResult
}
```

Suggested state:

- `idle`
- `analyzing`
- `success`
- `failed`
- `unavailable`
- `consentRequired`

This proposal is for future Phase 16I / later work only. Phase 16H-Recovery does not add these files.

---

## 16. MVP Phase Plan

### Phase A1 - Mock Post-capture Advisor UX

- Result card.
- Mock fixtures.
- Filter recommendations.
- Apply filter CTA.
- No real AI.
- No upload.
- No persistence.

### Phase A2 - Inspiration Import Advisor

- Imported photo flow uses the same advisor result.
- Recommendations link to filters / pose / inspiration.

### Phase A3 - Real Cloud Advisor

- Backend proxy.
- Consent.
- Compressed image.
- Structured JSON.
- Validation.
- No raw image persistence.

### Phase A4 - Caption / Social Copy

- Optional caption suggestions.
- Platform-specific copy.
- Still safety-bounded.

---

## 17. Risk Table

| Risk | Impact | Mitigation |
| --- | --- | --- |
| AI sounds judgmental | User trust loss | Ban beauty, quality score, and appearance criticism; give next actions only. |
| Bad recommendation | User distrust | Recommend 1-3 filters and provide fallback. |
| Unavailable cloud | Broken experience | Local mock fallback and unavailable state. |
| Invalid JSON | UI crash or blank card | Backend schema validation and iOS decoding fallback. |
| Overlong response | Feels like chat | Limit summary to one sentence and suggestions to max 3. |
| Filter recommendation mismatch | Apply action fails | Filter id whitelist and safe fallback. |
| User expects real editing | Misleading UX | CTA says apply filter, not AI retouch or AI edit. |
| Privacy concern | User trust / review risk | Explicit consent, compression, metadata stripping, no raw persistence. |
| History persistence confusion | User does not know what is saved | MVP session-only; future metadata must be explicit and deletable. |
| App Store review concern | Review delay | Avoid sensitive inference and disclose third-party AI before upload. |
| Sensitive inference risk | Safety violation | Reject age, gender, emotion, identity, health, race, religion, and other sensitive inference. |
| Scope creep into Gemini Live | Architecture complexity | Keep live AI and streaming out of Phase 16 / initial Phase 17. |
| Scope creep into real backend too early | Privacy and cost risk | Start with mock UX; real cloud only after backend boundary. |

---

## 18. Final Recommendation

- MVP should be mock-first, not real AI.
- The first placement should be capture / imported photo result.
- Minimum result card fields:
  - Summary.
  - 1-3 suggestions.
  - 1-3 filter recommendations.
  - Retake advice.
  - Optional crop advice.
- Do not add a score.
- Do not add caption UI in MVP.
- Do not save AI result in MVP.
- Post-capture Advisor is the best current candidate for the first real cloud AI feature.
- Real cloud AI must wait for a Phase 17 backend boundary.
- Phase 16H-Recovery should not implement app features.
