# AI Feature Definition + Prompt UX Contract

Phase: 16C  
Status: Documentation-only product / technical contract  
Scope: Future AI and AI-like features for the camera-first retro photo app

This document defines the product role, feature map, response contract, prompt style, privacy boundaries, research backlog, and future roadmap for AI and AI-like features.

It is not an implementation spec. It does not connect real AI, does not change app behavior, and does not authorize Phase 17 or real provider integration.

---

## 1. Product AI Role

This app is not an AI chat app.

The product is a camera-first retro photo app. AI should support the shooting and styling experience without becoming the main destination.

AI may act as:

- Photography assistant
- Shooting coach
- Filter recommender
- Style advisor
- Inspiration engine

AI should:

- Stay close to the camera workflow.
- Give short next-step guidance.
- Help users take or style one better photo.
- Respect the user's attention while shooting.
- Prefer compact UI surfaces such as chips, pills, callouts, sheets, and concise cards.

AI should not:

- Block Camera.
- Replace the viewfinder.
- Become a long-form chat entry point in the MVP.
- Interrupt shutter timing.
- Create pressure or judgment around the user's appearance.
- Present itself as a production cloud service when running as mock/local guidance.

The best product posture is: AI is helpful, quiet until needed, and easy to ignore.

---

## 2. AI / AI-like Feature Map

| Feature | Role | Current / Future Direction |
| --- | --- | --- |
| 1. Local Camera Coach / 本機導拍 | Fast on-device guidance while framing | Local, low-latency, privacy-safe hints |
| 2. Pose Overlay / Pose Master-like Guide | Visual pose outline reference in viewfinder | Future optional overlay, first version can be static and non-AI |
| 3. AI Snapshot | User-triggered pre-capture snapshot advice | Phase 16 mock-only service boundary, future cloud possible |
| 4. Post-capture AI Photo Advisor | Analyze captured/imported photo after selection | Mock exists; future real AI via backend only |
| 5. AI Filter Recommendation | Recommend existing 20 filters | Can begin rule-based / mock, later AI-backed |
| 6. AI Filter Generator / 專屬濾鏡生成器 | Generate custom filter recipe from reference image | Future staged feature, structured recipe only |
| 7. Inspiration AI | Creative hub for prompts, poses, style, challenges | Future Inspiration expansion |
| 8. Future AI Edit | Suggest or execute edits | Later staged feature; generative edit requires research |
| 9. Future Voice / Spoken Camera Assistant | Push-to-talk camera assistant | Long-term research, not MVP |
| 10. Future Gemini Live / Real-time AI | Real-time visual + voice assistant | Long-term research, not MVP |

---

## 3. Local Camera Coach

Local Camera Coach is the app's immediate guidance layer.

It does not have to be "real AI." In many cases, local heuristics, camera signals, brightness analysis, and simple Vision-derived geometry can produce useful hints faster and with better privacy than a cloud model.

Current direction:

- Real-time or near-real-time local hints.
- Low latency.
- Privacy-safe.
- No upload.
- No background network call.
- No raw frame persistence.
- Compact chip / pill UI.
- Tap to expand into a callout.
- Do not block shutter.
- Do not cover the viewfinder subject.
- Do not interrupt camera controls.

Current and future hint categories:

- Frame is too dark.
- Frame is too bright.
- Portrait is too close.
- Portrait is too far.
- Headroom is too tight.
- Subject is too far left / right.
- Try a specific filter.
- Stay quiet when confidence is low.
- Use anti-flicker / priority / stability logic so hints do not jump around.

Example Traditional Chinese / Cantonese-style copy:

- `畫面有點暗，試試靠近光源。`
- `人像可以稍微退後一點。`
- `頭頂可以多留一點空間。`
- `主體可以再靠中間少少。`
- `光線已經幾舒服，可以試下 Soft Warm 400。`

Behavior principles:

- If confidence is low, say nothing.
- If multiple signals compete, show only the highest priority hints.
- If the user is about to shoot, do not flash new guidance aggressively.
- Guidance should feel like a quiet coach, not a warning system.

---

## 4. Pose Overlay / Pose Master-like Guide

Pose Overlay is a future optional shooting aid.

Concept:

Add a transparent, non-interactive pose outline overlay inside the viewfinder. The overlay helps users frame portraits, couple photos, street photos, travel photos, and fashion-like shots by showing a reference pose outline.

This concept is similar in spirit to VIVO Pose Master-like guidance, but this app should implement its own original visual language and assets.

First-version principles:

- The first version does not need AI.
- It can start with static pose outlines.
- The overlay is only a visual guide.
- The overlay should not be written into the captured photo.
- The overlay should not be uploaded.
- The overlay should not intercept shutter or control taps.
- SwiftUI implementation should use `.allowsHitTesting(false)` for the overlay layer.
- Do not perform face recognition.
- Do not perform identity judgment.
- Do not infer gender.
- Do not score body, pose, beauty, attractiveness, or appearance.

### Pose Categories

Initial categories:

- 單人
- 情侶
- 男生
- 女生
- 街拍
- 旅行
- 坐姿
- 半身
- 全身
- 中性 / 不限

Categories are for browsing and inspiration, not identity classification.

### 情侶 Pose

Use cases:

- 情侶照
- 旅行照
- 約會感相片
- 街拍情侶
- 日系 / 韓系 couple photo
- 復古 film couple photo

Examples:

- 並肩站立
- 一前一後
- 回頭望鏡頭
- 牽手背影
- 坐著靠近
- 一人看鏡頭、一人側望
- 城市街角情侶 pose
- 黃昏情侶 pose

### 男生 Pose

Use cases:

- 男生個人照
- 街拍
- 穿搭照
- 旅行照
- 城市感 portrait
- CCD / film look 男生相

Examples:

- 側身站立
- 手插袋
- 微微低頭
- 靠牆
- 走路 pose
- 回頭看鏡頭
- 坐姿
- 交叉手
- 看遠方
- 半身 portrait

### 女生 Pose

Use cases:

- 女生個人照
- 日系人像
- 旅行人像
- 閨蜜照
- 甜美 / 復古 / film look portrait
- 半身 / 全身人像

Examples:

- 側身回頭
- 手扶頭髮
- 坐姿
- 看向旁邊
- 半身微笑
- 走路 pose
- 靠欄杆
- 低角度全身
- 黃昏人像 pose
- 雜誌感 pose

### Inclusive / Neutral Principle

- `男生` / `女生` / `情侶` are browsing and inspiration categories.
- Users may freely use any pose.
- The app should not use AI to judge a user's gender.
- The app should not restrict any pose to a specific kind of person.
- The app should not score faces, bodies, attractiveness, or appearance.
- Pose copy should be inclusive, light, and optional.

### Pose Overlay MVP Phases

P1 Static Pose Overlay MVP:

- 6-8 static pose outlines.
- On / off toggle.
- Horizontal mirror support.
- Opacity / scale adjustment if needed.
- Overlay does not affect capture.
- Overlay uses `.allowsHitTesting(false)`.

P2 Pose Categories:

- Add categories and 20-30 pose guides.
- Include single, couple, street, travel, sitting, half-body, full-body, neutral.
- Add simple selector UX.

P3 AI Pose Suggestion:

- AI recommends a pose based on a user-selected scene.
- No face recognition.
- No identity inference.
- No gender inference.
- No body / pose / attractiveness scoring.

P4 Advanced Pose Matching:

- Research Vision body pose detection / auto-align.
- Late-stage research only.
- Not MVP.
- Must pass privacy and UX review before implementation.

---

## 5. AI Snapshot

AI Snapshot is the current Phase 16 direction for optional pre-capture advice.

Current direction:

- User actively taps AI Snapshot.
- Compact control near the shutter.
- Consent / privacy UX appears before future real analysis.
- Current implementation is mock-only.
- App-side service boundary exists.
- Future real cloud AI can only be connected in a later explicit phase.
- No background auto upload.
- No live stream.
- No raw frame persistence.
- No request payload persistence.
- No provider API key in iOS.

AI Snapshot can eventually provide:

- Pre-capture composition suggestion.
- Lighting suggestion.
- Portrait distance suggestion.
- "Ready to shoot" confidence.
- Filter recommendation.
- One short summary.
- 1-3 suggestions.

Product rule:

AI Snapshot must remain user-triggered. It should never quietly upload the viewfinder or start a long-running live stream.

---

## 6. Post-capture AI Photo Advisor

Post-capture AI Photo Advisor analyzes a captured or imported single photo after the user has selected it.

It may provide:

- Composition analysis.
- Lighting analysis.
- Mood / style summary.
- Filter recommendation.
- Retake advice.
- Crop suggestion.
- Caption / social copy in a later phase.

It should avoid:

- Beauty scoring.
- Attractiveness scoring.
- Age inference.
- Gender inference.
- Emotion inference.
- Identity recognition.
- Negative appearance criticism.
- Medical, health, race, religion, or sensitive attribute inference.

Tone:

Helpful, short, practical, and encouraging. The advisor should suggest a next action instead of judging the person or the photo.

---

## 7. AI Filter Recommendation

AI can recommend from the existing filter set.

This can start as rule-based / mock mapping and later move to model-backed recommendations.

| Scene | Recommendation |
| --- | --- |
| 人像 + 暖光 | Soft Warm 400 / Instant Dream |
| 夜景 | Amber Night 800 / Neon Tungsten 800 |
| 街拍 | Street Chrome / Metro Pop |
| CCD 感 | CCD Party 2008 |
| 電影感 | Cinema Flat / Editor Classic |
| 陽光夏日 | Summer Gold 200 / Everyday Color 400 |

Recommendation output should include:

- `filterId`
- display name
- short reason
- confidence
- source: `mock | local | cloud`

The UI should never depend on a free-text paragraph to decide which filter to select.

---

## 8. AI Filter Generator / 專屬濾鏡生成器

AI Filter Generator is a future feature concept.

The user imports a reference image they like. AI or local heuristics analyze the style and generate a custom filter recipe that can be previewed in the app.

### Product Flow

1. User enters Inspiration / Filter Lab.
2. User selects `生成我的濾鏡`.
3. User imports a reference image.
4. App shows consent / privacy explanation.
5. AI or local analyzer extracts image style.
6. App generates a custom filter preview.
7. User can apply / name / adjust intensity.
8. Saving custom filters is a later feature and should not be in the first version unless explicitly requested.

### Features To Analyze

- dominant colors
- highlight color
- shadow color
- midtone color
- saturation
- contrast
- temperature
- tint
- exposure bias
- high key / low key
- film-like / CCD-like / cinematic / dreamy / matte / neon night
- grain
- softness
- vignette
- halation-like feeling, later phase
- light leak feeling, later phase

### Structured Output Only

AI Filter Generator should output structured filter recipe JSON, not free text.

The iOS app should only accept a schema that can be validated, clamped, and safely mapped to Core Image / local filter parameters.

Example:

```json
{
  "name": "Golden Rooftop Dream",
  "description": "暖色高光、柔和陰影、輕微褪色和夕陽感。",
  "parameters": {
    "exposure": 0.08,
    "contrast": -0.12,
    "saturation": 0.18,
    "temperature": 0.22,
    "tint": 0.04,
    "highlightWarmth": 0.3,
    "shadowFade": 0.18,
    "grain": 0.12,
    "vignette": 0.08
  },
  "recommendedUse": [
    "夕陽人像",
    "城市天台",
    "旅行照"
  ]
}
```

### AI Filter Generator Phases

F1 Mock Filter Generator:

- Mock analysis.
- Mock custom filter card.
- No real AI.
- No upload.
- No persistence.

F2 Local Heuristic Filter Extractor:

- Histogram.
- Average color.
- Brightness.
- Saturation.
- Contrast.
- Local-only analysis.

F3 Cloud AI Style Analysis:

- Backend proxy.
- Structured JSON.
- No provider key in iOS.
- Consent required.
- Validate and clamp output before UI use.

F4 LUT / Advanced Preset Generation:

- LUT generation.
- Advanced matching.
- Premium possibility.
- Later phase only.

---

## 9. Inspiration AI

Inspiration should become the creative hub.

Possible AI / AI-like entries:

- Import photo for style analysis.
- AI filter recommendation.
- AI Filter Generator entry.
- Pose guide entry.
- Today's shooting mission.
- Style cards.
- Pose challenge.
- AI edit direction.

Example copy:

- `今日任務：黃昏人像`
- `今日 Pose：回頭看鏡頭`
- `用一張你喜歡的照片，生成你的專屬濾鏡。`
- `今日風格：CCD 夜拍`

Inspiration should stay playful and practical. It should not become a feed or a full social network in MVP.

---

## 10. Future AI Edit

Future AI Edit should be staged carefully.

### Stage 1 - AI Edit Suggestion Only

AI suggests edits, but the app does not automatically execute them.

Possible suggestions:

- 提亮
- 降高光
- 裁切
- 換 filter
- 加 grain
- 降 saturation
- 提升暖色
- 重拍建議

### Stage 2 - App Local Tools Execute Suggestions

The app can apply local edits using existing tools:

- apply filter
- crop
- tone adjustment
- intensity slider

### Stage 3 - Real Generative AI Edit

Examples:

- remove object
- background blur
- relight
- style transfer
- retouch

Stage 3 requires privacy, backend, cost, safety, and App Store review research. It should not be treated as MVP.

---

## 11. Future Voice / Spoken Camera Assistant

Long-term direction:

- Push-to-talk.
- Apple Speech prototype.
- Cloud ASR research.
- Cantonese / Traditional Chinese support research.
- Spoken camera assistant.
- Possible Gemini Live direction later.

This is not MVP.

Voice should only be introduced after the camera, local guidance, consent, and privacy story are stable.

---

## 12. Future Gemini Live / Real-time AI

Gemini Live / real-time AI is long-term research.

Possible direction:

- Real-time visual + voice assistant.
- Camera-aware spoken suggestions.
- Low-latency coaching.

Constraints:

- Not MVP.
- Requires backend / server-issued credentials.
- No provider key in iOS.
- Requires cost research.
- Requires privacy review.
- Requires latency research.
- Requires streaming architecture research.
- Requires clear consent.

Do not begin this before explicit Phase 17+ planning and safety approval.

---

## 13. AI Response Contract

Mock, local, and cloud sources should use the same response shape where practical.

The UI should not depend on free text to decide behavior. Cloud responses must be validated and clamped before UI use. Filter parameters must have safe ranges.

Initial response shape:

```json
{
  "mode": "pre_capture | post_capture | inspiration | filter_recommendation | filter_generation | pose_guide",
  "summary": "短總結",
  "suggestions": [
    {
      "type": "composition | lighting | filter | pose | retake | crop | style",
      "text": "主體可以再靠中間少少。",
      "priority": "low | medium | high"
    }
  ],
  "recommendedFilters": [
    {
      "filterId": "instant_dream",
      "reason": "適合暖光人像。"
    }
  ],
  "generatedFilter": {
    "name": "Golden Rooftop Dream",
    "description": "暖色高光、柔和陰影、輕微褪色和夕陽感。",
    "parameters": {
      "exposure": 0.08,
      "contrast": -0.12,
      "saturation": 0.18,
      "temperature": 0.22,
      "tint": 0.04,
      "grain": 0.12,
      "vignette": 0.08
    }
  },
  "poseGuide": {
    "poseId": "street_turn_back",
    "category": "street",
    "title": "回頭街拍",
    "description": "適合街拍和旅行照，讓人物回頭看鏡頭。"
  },
  "retakeAdvice": {
    "shouldRetake": false,
    "reason": "目前構圖已可接受，只需微調光線。"
  },
  "confidence": "low | medium | high",
  "source": "mock | local | cloud"
}
```

Validation principles:

- `mode` must be known.
- `source` must be known.
- `confidence` must be known.
- `suggestions` should be capped, usually 1-3.
- Unknown suggestion types should be ignored or mapped to safe fallback.
- Unknown `filterId` should not be auto-selected.
- Generated filter parameters must be clamped.
- Empty or malformed cloud responses should produce a safe unavailable / retry state.
- UI should preserve the mock/local/cloud label honestly.

Suggested filter parameter clamp ranges:

| Parameter | Suggested Safe Range |
| --- | --- |
| exposure | -0.5 to 0.5 |
| contrast | -0.5 to 0.5 |
| saturation | -0.5 to 0.5 |
| temperature | -0.5 to 0.5 |
| tint | -0.3 to 0.3 |
| highlightWarmth | 0.0 to 1.0 |
| shadowFade | 0.0 to 1.0 |
| grain | 0.0 to 0.4 |
| vignette | 0.0 to 0.5 |

---

## 14. Prompt Style Guide

AI copy should be:

- Short.
- Friendly.
- Photographic.
- Practical.
- Not preachy.
- Not appearance-critical.
- Not based on sensitive inference.
- Light on technical jargon.
- Natural in Traditional Chinese / Cantonese-style phrasing.
- Focused on the next step, not scoring.

Bad:

`你的臉部曝光不足且構圖比例不理想。`

Better:

`畫面有點暗，可以靠近光源少少，膚色會自然啲。`

Bad:

`這張照片不好看。`

Better:

`氛圍不錯，如果重拍一張，可以讓人物再靠中間少少。`

Good patterns:

- `可以試下...`
- `如果想再自然啲...`
- `這張已經可以拍，想更穩可以...`
- `氛圍不錯，下一步可以...`

Avoid:

- "score"
- "rating"
- "ugly"
- "beautiful enough"
- body judgment
- age / gender / emotion assumptions
- medical or health language

---

## 15. Safety / Privacy Boundaries

AI should not do:

- Identity recognition.
- Age judgment.
- Gender judgment.
- Emotion judgment.
- Beauty / attractiveness scoring.
- Health status inference.
- Race / religion / sensitive attribute inference.
- Upload photos without consent.
- Background auto analysis.
- Long-running live stream.
- Store raw frames.
- Store selected photo.
- Store cloud request payload.
- Put provider API keys in the iOS app.
- Log raw image data.
- Log base64 image data.
- Log full prompts with user image context.
- Log provider responses containing sensitive content.

AI can do:

- Composition suggestions.
- Lighting suggestions.
- Lens distance suggestions.
- Filter recommendations.
- Pose guide suggestions.
- Shooting inspiration.
- Non-sensitive scene / style analysis.

Consent principle:

Any future cloud AI feature must clearly explain what is sent, why it is sent, where processing happens, and whether anything is stored. The default should be no training consent unless a future explicit opt-in is designed.

---

## 16. Future Research Backlog

### Research A - Pose Overlay / Pose Master-like Camera Guide

Research:

- SwiftUI / AVFoundation overlay technique.
- Canvas / SVG / PDF vector assets.
- Ensuring overlay is not captured.
- Hit testing / zIndex.
- Different iPhone aspect ratios.
- Mirror / opacity / scale.
- Pose selector UX.
- Whether Vision body pose detection is worth adding later.
- Pose asset licensing / self-made assets.

### Research B - AI Filter Generator

Research:

- Local histogram / color analysis.
- Core Image recipe mapping.
- LUT generation.
- AI vision style extraction.
- Structured JSON schema.
- Parameter clamp.
- Preview performance.
- Privacy / backend.
- Premium model possibility.

### Research C - AI Response Schema + Prompt Contract

Research:

- Pre-capture / post-capture / filter / inspiration / pose schema.
- Mock-to-real service boundary.
- Prompt templates.
- JSON validation.
- Error / unavailable states.
- Localization.

### Research D - Cloud AI Architecture

Research:

- Backend proxy.
- No API key in iOS.
- Timeout / retry / cancellation.
- Image compression.
- Consent.
- Quota / cost guard.
- Provider comparison.

### Research E - Voice / ASR / Spoken Camera Assistant

Research:

- Apple Speech.
- Cantonese / Traditional Chinese support.
- Push-to-talk UX.
- Privacy.
- Local vs cloud ASR.
- Voice response style.
- Later Gemini Live possibility.

---

## 17. Future Phase Roadmap

Suggested roadmap:

- Phase 16C - AI Feature Definition + Prompt UX Contract.
- Phase 16D - AI UX Unification Pass.
- Phase 16E - Pose Overlay MVP.
- Phase 16F - AI Filter Generator Mock.
- Phase 17 - Real Cloud AI Backend Boundary.
- Phase 18 - Real AI Provider Integration.
- Phase 19+ - Voice / Gemini Live.

Roadmap constraints:

- Phase 16C does not connect real AI.
- Phase 16E Pose Overlay MVP does not necessarily need AI.
- Phase 16F Filter Generator should start mock-only, then research local heuristic extraction / cloud AI.
- Real provider integration should not start before Phase 17.
- Gemini Live, voice, and realtime streaming are later research, not MVP.

---

## Phase 16C Completion Notes

Phase 16C is complete when this document exists, the phase log references it, and README has a short pointer to it.

Phase 16C must remain documentation-only:

- No Swift app feature changes.
- No Camera UI changes.
- No Pose Overlay implementation.
- No Filter Generator implementation.
- No real AI integration.
- No Phase 17 work.
- No Gemini Live.
- No real network call.
- No upload.
- No Firebase / Gemini / OpenAI / StoreKit imports.
- No secrets or production config.
- No persistence.
- No backend changes.
