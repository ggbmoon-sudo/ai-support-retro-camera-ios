# AI 拍攝建議與即時引導功能報告

這份報告的核心結論很明確：你的 **MVP 應該採用「拍完一張照片後再做 AI 分析」作為主路線**，後端用 **Firebase Callable Cloud Functions 當 AI proxy**，預設接 **Gemini 的 flash 類視覺模型** 做單張照片理解與結構化 JSON 回傳；而 **相機預覽中的即時引導** 應先用 **AVFoundation + Vision** 做本機輕量 overlay，例如構圖格線、人像框、姿勢點與亮暗提示。這樣做的原因是，Gemini 官方文件已明確支援影像理解、結構化 JSON 輸出與低延遲 Live API；但 Live API 目前仍是 **preview**，而且影片輸入是把影格當作單張圖片送入，**上限為每秒 1 張**，不適合直接當成 MVP 的真正雲端即時構圖教練。相對地，OpenAI 官方文件在 **圖片生成、改圖、multi-turn image editing** 與結構化輸出方面更適合作為你未來的 **改圖 / 參考畫面生成** 能力，而不是 MVP 的主要單張拍攝建議引擎。citeturn21view1turn21view0turn12view0turn12view4turn20search3turn20search1

## 核心結論與功能分層

### AI 功能分層

**MVP** 應只做「拍完一張 → 上傳壓縮分析圖 → 回來 1 句 summary + 最多 3 條可執行建議 + 一組簡單數值微調」，不要做真正的雲端即時 video streaming。這條路最符合你現在的產品邊界，也最符合 Gemini 與 OpenAI 目前公開文件的成熟能力：Gemini 對單張影像理解與 JSON 結構化輸出已經直接支援，Cloud Functions callable 也能直接從 App 端帶上 Auth 與 App Check 權杖，適合做安全的行動端 AI proxy。citeturn21view1turn21view0turn18view2

**MVP+** 可以做「依上一張照片建議下一張怎樣拍」，但我建議仍然維持 **單張為主、上一張分析結果為輔**，而不是把兩張完整原圖都送去模型。Gemini 官方文件支援多圖 prompting，但對你的成本與延遲來說，較好的做法是把上一張照片的 **結構化分析結果** 當上下文，再送入最新一張照片，這樣能保留「連續拍攝教練」體驗，又不會讓 token 與延遲失控。citeturn26view1turn21view0

**VIP** 應解鎖兩件事：其一是「針對同一張照片追問」，其二是「在連續拍攝 session 中保留短暫上下文」。如果你未來要做串流式回覆，Firebase 官方文件已說明 callable functions 具備 **傳送及接收串流結果** 的機制，因此 VIP 聊天可以用 callable + streaming 漸進式顯示回覆，而不需要一開始就拉進複雜的自建 WebSocket 架構。citeturn18view0turn18view2

**Future** 才是「相機預覽中的近即時建議」與「真正 Live AI」。Google 官方文件指出 Gemini Live API 支援低延遲的 voice + vision 互動，並可透過 WebSocket 處理連續的音訊、圖片與文字；但同一份能力文件也明確說明，影片是以 **單張 JPEG/PNG frame** 的方式送進去，而且 **最大 1 fps**。這代表它很適合做「每秒一次的高層建議」，不適合直接做你想像中的高刷新率 AR 骨架引導。citeturn12view0turn12view2turn12view4

### 最終功能邊界建議

你的 App 在產品定義上是「**復古底片感相機 + 單張 AI 拍攝教練**」，不是完整 AI 修圖工作室。基於這個定位，我建議把 **MVP、MVP+、Future** 的邊界定死如下：  
MVP 只做單張分析與單張建議；MVP+ 才做上一張帶下一張；Future 才做近即時 snapshot 分析與 Live API；而 **OpenAI 圖片改圖 / 圖片生成** 只保留 adapter 與資料結構，不納入第一版交付。這樣的切法同時符合你既定的產品邊界，也和目前官方 API 能力成熟度相符。citeturn20search3turn20search10turn12view0

## 拍後分析流程與資料契約

### 拍照後 AI 分析流程

建議你的 **MVP 正式流程** 是：

```text
iOS App
  ├─ 拍照 / 相簿匯入
  ├─ 本地產生 AI 分析用壓縮圖
  ├─ 上傳 Firebase Storage
  ├─ 寫入 Firestore photo metadata（status = uploaded）
  └─ 呼叫 callable function: analyzePhoto

Cloud Functions v2
  ├─ 驗證 Firebase Auth
  ├─ 驗證 App Check
  ├─ 檢查 consent / quota / photo ownership
  ├─ 從 Storage 讀取 AI 分析圖
  ├─ AIProviderRouter 選 provider
  │   ├─ GeminiPhotoAdvisor
  │   └─ OpenAIPhotoAdvisor（未來 / fallback）
  ├─ PromptBuilder + JSON Schema
  ├─ 驗證模型回傳
  ├─ Firestore 寫入 analysis doc
  ├─ 更新 photo.latestAnalysis
  └─ 回傳 typed result 給 iOS
```

這個流程之所以適合你的 App，是因為 Firebase callable functions 會自動帶上 Firebase Authentication 與 App Check 權杖並驗證它們，正好適合做行動端 AI proxy；而 Storage 官方文件也明確建議正式環境使用驗證與嚴格安全規則。對單張照片分析來說，你不需要 client 直接碰第三方 AI API。citeturn18view2turn3search2turn1search4turn25search6

在 **影像傳遞方式** 上，Gemini 官方文件寫得很清楚：小圖可以直接用 **inline image data**，總 request 大小包含 prompt 在內要小於 20MB；若檔案較大、或同一張圖要多次重用，則建議先上傳到 **Gemini Files API** 再做 generateContent。對你的 MVP 來說，最務實的做法是：Storage 中保留一份 AI 用壓縮圖，Cloud Function 讀出 bytes 後，如果圖很小就直接 inline；若未來 VIP 追問會重用同圖，再考慮 Gemini Files API。citeturn26view0turn26view1turn26view2

如果未來接 OpenAI，官方文件指出 Responses API 可以把檔案以 **Base64、File ID、或 external URL** 傳入。這代表你可以在 `OpenAIPhotoAdvisor` 裡做三種策略：直接傳 bytes、先上傳 File API 再傳 `file_id`、或在必要時給 temporary URL。**但不要把 Firebase Admin SDK 產生的 non-expiring download URL 直接交給第三方 AI provider**，因為 Firebase Admin 文件明講 `getDownloadURL` 可產生不會過期的分享網址；若真的要用 URL 給第三方抓圖，應改用 **time-limited signed URL**，或更乾脆由 Cloud Function 下載 bytes 後再轉送給模型。citeturn28view0turn24search4turn24search2

### Cloud Function contract

我建議你把 MVP 的 callable function contract 固定成以下型別，讓 iOS 與 Functions 之間保持穩定：

```ts
// functions/src/contracts/analyzePhoto.ts
export interface AnalyzePhotoRequest {
  photoId: string;
  storagePath: string;              // e.g. users/{uid}/photos/{photoId}/ai/analyze.jpg
  sceneType?: "portrait" | "food" | "landscape" | "unknown";
  language: "zh-Hant" | "en";
  presetId?: string | null;
  previousAnalysisId?: string | null;  // MVP+ / VIP 可用
  askNextShot?: boolean;               // MVP false, MVP+ true
  clientImageHash?: string | null;     // 用於快取去重
}

export interface AnalyzePhotoResponse {
  analysisId: string;
  photoId: string;
  provider: "gemini" | "openai";
  model: string;
  result: AIPhotoAdvice;
  remainingQuota: number;
  cached: boolean;
  createdAt: string;                   // ISO string
}
```

配合這個 callable，後端應以 Firestore transaction 來處理 **quota 檢查、扣減與寫入分析結果**，因為 Firebase 官方文件說明 transaction/batched writes 可做原子操作，而 Firestore 也提供 serializable isolation，用於避免多裝置並發時的重複扣額與競態條件。citeturn9search1turn9search6

### 固定 JSON schema

你要求的固定欄位應該保持 **扁平、淺層、枚舉化**，這樣最適合 Gemini 與 OpenAI 的 structured output。Gemini 官方文件說明它只支援 JSON Schema 的子集，而且 schema 太深太複雜時可能被拒收；同時 Gemini 與 OpenAI 都建議在 schema 裡把 key、title、description 寫清楚，才能提升產出品質。citeturn21view0turn22view0

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "composition_score",
    "lighting_score",
    "pose_score",
    "background_score",
    "suggested_angle",
    "suggested_distance",
    "suggested_lighting",
    "suggested_camera_settings",
    "suggested_filter",
    "next_shot_instruction",
    "short_user_message",
    "safety_warning",
    "language"
  ],
  "properties": {
    "composition_score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Overall composition quality score."
    },
    "lighting_score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Lighting quality score."
    },
    "pose_score": {
      "type": ["integer", "null"],
      "minimum": 0,
      "maximum": 100,
      "description": "Pose quality score for portraits; null if not applicable."
    },
    "background_score": {
      "type": "integer",
      "minimum": 0,
      "maximum": 100,
      "description": "Background cleanliness and supportiveness."
    },
    "suggested_angle": {
      "type": "string",
      "enum": [
        "eye_level",
        "slightly_high",
        "slightly_low",
        "top_down",
        "move_left",
        "move_right"
      ]
    },
    "suggested_distance": {
      "type": "string",
      "enum": [
        "step_closer",
        "step_back",
        "keep_distance"
      ]
    },
    "suggested_lighting": {
      "type": "string",
      "maxLength": 120
    },
    "suggested_camera_settings": {
      "type": "object",
      "additionalProperties": false,
      "required": [
        "exposure",
        "contrast",
        "temperature",
        "saturation"
      ],
      "properties": {
        "exposure": { "type": "number", "minimum": -2, "maximum": 2 },
        "contrast": { "type": "integer", "minimum": -100, "maximum": 100 },
        "temperature": { "type": "integer", "minimum": -100, "maximum": 100 },
        "saturation": { "type": "integer", "minimum": -100, "maximum": 100 }
      }
    },
    "suggested_filter": {
      "type": "object",
      "additionalProperties": false,
      "required": ["preset_id", "reason"],
      "properties": {
        "preset_id": { "type": "string", "maxLength": 50 },
        "reason": { "type": "string", "maxLength": 120 }
      }
    },
    "next_shot_instruction": {
      "type": "string",
      "maxLength": 120
    },
    "short_user_message": {
      "type": "string",
      "maxLength": 120,
      "description": "One short summary sentence in user's language."
    },
    "safety_warning": {
      "type": ["string", "null"],
      "maxLength": 160
    },
    "language": {
      "type": "string",
      "enum": ["zh-Hant", "en"]
    }
  }
}
```

建議在 Firestore 中把模型原始 JSON 與 App 內規範化結果分開存，避免未來 schema 版本升級時資料難以遷移：

```ts
// photos/{photoId}/analyses/{analysisId}
{
  ownerUid: "...",
  provider: "gemini",
  model: "gemini-2.5-flash",
  schemaVersion: 1,
  rawJson: {...},
  normalizedResult: {...},
  latencyMs: 1830,
  cached: false,
  createdAt: Timestamp,
  sourceStoragePath: ".../ai/analyze.jpg"
}
```

## Prompt 與 Provider Adapter 設計

### Prompt 設計原則

這個產品的 prompt 不應追求「像攝影老師講很多道理」，而是要追求 **短、穩定、可解析、語言跟隨、建議可執行**。Gemini 的 structured output 文件明確建議用 description 去定義欄位意義，也提醒你即使語法合法，最後仍要在應用程式端自行驗證語意；OpenAI 的 Structured Outputs 文件則明確說，使用 `json_schema` 與 `strict: true` 可以讓模型遵守 schema，但若模型因安全理由拒絕，可能會走到 schema 外的 refusal 路徑，因此後端 parser 一定要有 fallback。citeturn21view0turn22view1turn22view0turn20search8

### 可直接使用的 system prompt

```text
You are PhotoCoach, an AI photography assistant for an iOS vintage camera app.

Your job:
- Analyze exactly one photo at a time.
- Return concise, practical advice for non-expert users.
- Focus on composition, lighting, pose, background, angle, distance, and simple edit values.
- Keep the response actionable, kind, and short.
- Follow the user's language exactly.
- Do not mention camera brands unless explicitly provided.
- Do not invent details that are not visible in the image.
- If the image is not a portrait, set pose-related fields to null or neutral.
- If advice is uncertain, be conservative and say what is most likely helpful.
- Output JSON only and strictly follow the provided schema.
```

### 免費用戶 prompt

```text
Analyze this single photo for a free-tier user.

Requirements:
- Output exactly 1 short summary sentence.
- Output at most 3 actionable suggestions.
- Prioritize the biggest fixes first.
- Keep advice tool-like, not chatty.
- Assume the user wants to improve the next shot immediately.
- Respect this language: {{language}}
- Scene type hint: {{sceneType}}
- Current preset: {{presetId}}
```

### VIP 用戶 prompt

```text
Analyze this single photo for a VIP user.

Requirements:
- Output concise but slightly richer guidance than free-tier.
- If previous analysis context is provided, use it to suggest what to improve next.
- Be ready for follow-up style conversation, but this response must still be valid JSON only.
- Respect this language: {{language}}
- Scene type hint: {{sceneType}}
- Current preset: {{presetId}}
- Previous analysis context: {{previousAnalysisSummary}}
```

### 拍攝建議 prompt

```text
Focus on immediate shooting advice:
- Tell the user where to move.
- Tell the user whether to go closer or farther.
- Tell the user how to improve framing and light in the next shot.
- Prefer instructions that can be executed in under 5 seconds.
- Output JSON only.
```

### 姿勢建議 prompt

```text
Focus on human pose only if a person is visible.
- Evaluate whether the pose feels natural, stiff, cropped, or flattering.
- Suggest one better body direction or hand placement.
- Suggest one next pose for the next shot.
- If no person is visible, set pose_score to null and do not hallucinate pose advice.
- Output JSON only.
```

### 濾鏡數值建議 prompt

```text
Map your recommendation to the app's supported edit controls only:
- exposure
- contrast
- temperature
- saturation
- preset_id

Do not recommend unsupported controls.
Keep values conservative and realistic for a vintage-film aesthetic.
Output JSON only.
```

### 下一張照片建議 prompt

```text
Use the current photo as the baseline.
Suggest the next shot, not a full re-analysis.

Requirements:
- Keep next_shot_instruction short and specific.
- Prefer changes in angle, distance, subject pose, or light direction.
- If the current shot is already strong, suggest a variation rather than repeating the same composition.
- Output JSON only.
```

### 圖片改圖 prompt

這個功能不是 MVP 必做，但 adapter 可以先預留。因為 OpenAI 官方文件已把 **single-shot 生成/編輯** 與 **multi-turn conversational image editing** 的 API 分工說清楚：單次任務用 Image API 較合適；如果要做多輪可編輯體驗，則用 Responses API。citeturn19view1turn19view2turn20search3

```text
You are creating a reference edit brief, not changing the original photo yet.

Goal:
- Preserve the scene identity and subject intent.
- Increase cinematic, vintage, film-like mood.
- Improve framing clarity, subject separation, and light direction.
- Do not over-retouch skin.
- Keep the output suitable as an image-edit or image-generation instruction.

Return JSON only with:
- edit_goal
- preserve_elements
- change_elements
- vintage_style_keywords
- risk_notes
```

### AI Provider Adapter 架構

我建議將 provider 層做成 **明確可切換** 的 interface，而不要把 Gemini / OpenAI SDK 直接塞進 callable function。本質原因是兩家都支援結構化輸出與影像能力，但長處不同，且你未來很可能會因成本、地區、rate limit、品質回歸而切換或 fallback。官方文件顯示 Gemini 適合做 image understanding + structured outputs + 之後的 Live path；OpenAI 則適合做 vision + structured outputs + image generation/edit。citeturn21view1turn21view0turn12view0turn20search0turn20search3turn22view1

```ts
// functions/src/providers/types.ts
export interface PhotoAdvisorProvider {
  analyzePhoto(input: AnalyzeContext): Promise<AIPhotoAdvice>;
}

export interface ImageEditProvider {
  buildEditReference(input: EditContext): Promise<ImageEditBrief>;
}
```

```ts
// functions/src/providers/GeminiPhotoAdvisor.ts
export class GeminiPhotoAdvisor implements PhotoAdvisorProvider {
  async analyzePhoto(input: AnalyzeContext): Promise<AIPhotoAdvice> { ... }
}

// functions/src/providers/OpenAIPhotoAdvisor.ts
export class OpenAIPhotoAdvisor implements PhotoAdvisorProvider {
  async analyzePhoto(input: AnalyzeContext): Promise<AIPhotoAdvice> { ... }
}

// functions/src/providers/OpenAIImageEditProvider.ts
export class OpenAIImageEditProvider implements ImageEditProvider {
  async buildEditReference(input: EditContext): Promise<ImageEditBrief> { ... }
}

// functions/src/core/AIProviderRouter.ts
export class AIProviderRouter {
  routeAnalyze(input: AnalyzeContext): PhotoAdvisorProvider { ... }
  routeImageEdit(input: EditContext): ImageEditProvider { ... }
}
```

### Gemini 與 OpenAI 分工建議

**圖片理解**：MVP 先選 Gemini。Google 官方文件對 image understanding、inline/file input、JSON schema、以及未來 Live API 的視覺串流能力描述最直接，對你的「拍照教練」場景最順。citeturn21view1turn26view0turn21view0turn12view0

**即時建議**：Future 也優先看 Gemini。原因不是它一定最強，而是目前官方文件對「連續 image/video frame + WebSocket + ephemeral tokens」路徑說得最明白；不過它仍在 preview，且影片 frame 速率有限，因此只能列為後續能力，不應作為首版承諾。citeturn12view0turn12view2turn12view3

**圖片改圖 / 參考圖生成**：優先用 OpenAI。OpenAI 最新文件明確把 `gpt-image-2` 定位為 state-of-the-art image generation model，並說明了 Image API 與 Responses API 在 single-shot edit 與 multi-turn edit 之間的分工，這很適合你未來的「想像畫面 → 參考改圖 / 拍攝建議」延伸功能。citeturn20search3turn20search10turn19view1turn19view2

**成本與 API 成熟度**：在這次查證到的官方文件中，OpenAI 的價格表比 Google AI Studio 官方 doc 更公開透明；OpenAI 也直接公布了 GPT-Realtime 與 GPT Image 的 token pricing。Google 官方文件則更明確揭露付費層級、預付 credit 與動態 rate limit，但這次查到的 AI Studio 文件沒有同等清楚的 Gemini 單位價格頁，因此你在發版前應再次核對 Google 現行實價。也正因為 Live 與改圖都會顯著提高成本，所以 **MVP 不應把即時雲端建議或改圖放進基本免費額度**。citeturn17view0turn17view2turn14search0turn16search1turn16search4

## 即時引導、姿勢庫與 Overlay 設計

### 三階段技術路線

**Stage 1** 應做成「非真正即時」：相機預覽中只顯示本機輕量引導，例如 3x3 格線、水平線、構圖 safe zone、人像框線、亮暗提示；真正的 AI 建議仍在拍完後出現。Apple 官方文件顯示 AVFoundation 適合建置相機 capture/pipeline，`AVCaptureVideoDataOutput` 可以把預覽 frame 交給你的程式做後續處理，而 Apple 最新 AVCam 範例也採用 SwiftUI + Swift Concurrency + `CaptureService` actor 的方式來管理 capture pipeline，這個設計很適合你直接複用。citeturn0search1turn0search5turn8search0turn8search7

**Stage 2** 才做「準即時 snapshot 分析」：每隔 2 至 3 秒截一張低解析預覽圖送去雲端分析，同時本機維持持續的 Vision overlay。這一層要非常節制，因為 Apple 官方文件提醒 `AVCaptureVideoDataOutput` 的像素格式選擇會顯著影響效能，且不應預設使用 BGRA，因為它不是原生格式、還更吃記憶體；因此 Stage 2 應讓相機預覽輸出原生像素格式，先在本機做快速 luminance / horizon / subject-box 分析，再以節流方式少量送雲端。citeturn8search0turn8search11

**Stage 3** 才是「真正 Live AI」：可優先評估 Gemini Live。官方文件指出 Live API 支援 audio、images、text 的連續互動，影片 frame 以單張圖片送入，最大 1 fps；client-to-server 路徑能得到更好的效能，但 production 建議使用 ephemeral tokens 來降低安全風險。這代表未來若你真的做 Live camera coach，架構上要把它視為「每秒一次的高層語意建議」，而不是 30fps 骨架追蹤。citeturn12view0turn12view2turn12view3turn12view4

如果你未來想探索 OpenAI 的 Realtime 路線，官方文件也提供了 **Realtime client secrets**，那是可以安全下發到 mobile/web client 的短時效 token。這說明了同一個原則：**標準 API key 永遠不要放 iOS App 裡**，無論你最後用 Gemini 或 OpenAI。citeturn20search9turn29view0turn30view0

### 姿勢庫與本機 Vision 能力建議

Apple 官方文件顯示，Vision 可做 **人體框偵測**、**人像臉框偵測**、**2D 人體姿勢**，其中 2D 人體姿勢自 iOS 14 起可辨識最多 **19 個 body points**；3D 人體姿勢則自 iOS 17 起可量測 **17 個 3D joints**，而且需要看到完整肢體、且裝置需 A12 或更新。這足以支撐你做出「簡單姿勢輪廓 + 人像構圖建議」的 MVP+，但遠遠不等於可以在首版做完整的 3D 骨架 AR 教練。citeturn1search3turn8search2turn8search10turn8search6

因此我建議你的 Overlay 能力分工如下：  
本機 Vision 負責 **人像框、人頭不要切頂、主體是否偏中、四肢是否被切斷、站姿大致方向**；Cloud AI 則只負責高層語意，例如「往左半步，背景會乾淨很多」「臉再轉向窗邊一點」「下一張改成側身回頭」。這樣能避免你誤把 LLM 當成即時 CV engine。citeturn8search2turn8search5turn21view1

### 姿勢庫 schema

```json
{
  "pose_id": "pose_stand_half_turn_smile",
  "pose_name": "半側身回頭微笑",
  "category": "portrait_couple",
  "overlay_line_asset": "pose_stand_half_turn_smile.json",
  "sample_thumbnail": "pose_stand_half_turn_smile.jpg",
  "description": "主體半側身，肩膀與臉不同方向，較自然顯瘦。",
  "is_premium": false,
  "recommended_lens": "1x",
  "recommended_distance": "2.0m",
  "recommended_angle": "eye_level"
}
```

建議你把姿勢庫做成 **本地 JSON + asset bundle**，而不是首版就做雲端 CMS。因為這個資料量不大，而且 UI/資產檔迭代比資料後台更頻繁。Cloud 端只需要在分析結果裡回傳 `recommended_pose_id` 或 `next_shot_instruction`，由 App 去選對應姿勢卡與 overlay asset。

### UI overlay 設計

我建議 Overlay 的佈局遵守一個原則：**所有輔助 UI 總遮擋面積不超過畫面有效構圖區的 15% 到 20%**。具體可這樣做：

```text
┌────────────────────────────┐
│  Top bar                    │
│  [光線偏硬] [距離稍近]       │
│                            │
│    ───── 構圖格線 ─────     │
│      ╭────────────╮         │
│      │ 人像安全框 │         │
│      │   ○ 頭部   │         │
│      │  /|\ 姿勢  │         │
│      │  / \ 輪廓  │         │
│      ╰────────────╯         │
│                            │
│  ← 往左半步       退後一步 → │
│                            │
│       [拍照]  [AI 指引]      │
└────────────────────────────┘
```

文字提示不應該壓在主體臉部或身體中心；最佳位置是 **上方狀態條** 與 **底部短指令條**。長句不要進 overlay；overlay 只放「往左半步」「靠近窗邊」「臉抬高一點」這種 2 至 6 字的短提示。完整解釋留到拍完後的 AI 結果頁。

### 為什麼 ARKit 暫時不需要

Apple 官方文件指出 ARKit 的強項是 **device motion tracking、world tracking、scene understanding**，適合把 2D/3D 物件真正錨定在真實世界中。你的第一版需求其實只是把 2D guide 疊在 camera preview 上，因此 **ARKit 是過度設計**；至少在 MVP 與 MVP+ 階段，AVFoundation + Vision 足夠。citeturn5search3turn0search1

## 成本控制、安全與合規

### 成本控制

你的成本控制必須建立在 **「單張、短輸出、壓縮、快取、硬額度」** 五件事上，而不是寄望模型自然便宜。Gemini 官方文件允許小圖 inline、大圖或重用圖走 Files API；OpenAI 官方文件則允許 Base64、file ID 或 external URL。這代表你完全有能力把 AI 輸入限制在一張經過壓縮的分析圖，而不是原圖。citeturn26view0turn26view2turn28view0

我建議你的 **AI 分析圖規格** 一開始就定死：  
長邊 1280px、JPEG 品質 0.72 左右、目標檔案 250KB 到 900KB。對構圖、姿勢、亮暗、背景這類建議來說，這個大小通常夠用；只有當 VIP 用戶後續真的需要讀細節文字或產品包裝細節時，才考慮提高 resolution。

此外，Quota 應該由 server 端用 Firestore transaction 原子處理。因為 Firestore 官方文件已說明 transactions 是原子且有 serializable isolation，所以每日登入送 1 次、免費 20 次 starter quota、VIP 額度扣減，都不應在 client 端自算。citeturn9search1turn9search6

再進一步，你應該做 **AI response caching**。快取 key 建議為：

```text
sha256(aiAnalyzeImageBytes + promptVersion + modelId + presetId + language)
```

若 key 命中，就直接回傳先前結果，不再重打模型。這對「同一張照片反覆開關結果頁」或「分析失敗重開頁面」很有用。

### 金鑰與後端安全

Firebase 官方文件現在已明確建議用 **parameterized configuration / Secret Manager** 來管理 Cloud Functions 機密，並指出舊的 `functions.config()` 已在 6.0.0 版棄用，**2027 年 3 月之後新部署會失敗**。所以你的 Functions 專案應直接用 `defineSecret()` 綁定 `GEMINI_API_KEY`、`OPENAI_API_KEY`，不要再走舊 config。citeturn1search5turn1search1

OpenAI 官方文件與 Help Center 都明確警告：**API key 不可部署在 mobile app 或 browser**，所有請求都應透過你自己的後端路由；Google 的 Gemini 金鑰文件也同樣說明，在正式版 web/mobile app 中公開金鑰是不安全的，而且用戶端程式碼中的 key 可以被擷取。更進一步，Gemini 官方目前還公告 **自 2026-06-19 起將停止支援未設限流量金鑰**。對你的產品來說，這些都指向同一個結論：**iOS App 不保存任何第三方 AI key；所有 AI 呼叫都經 Cloud Functions server-side proxy；後端金鑰要限制 API 與來源。**citeturn29view0turn30view0

App Check 在這個 App 是必需品，不是加分項。Firebase 官方文件說明 App Check 用來證明流量來自你的真實 App，並可保護 Firebase 服務與自訂後端；對 Cloud Functions 而言，官方強調其保護對象是 **callable functions**，而對自訂 backend 也有額外教學與 Apple 平台的 token/replay protection 路徑。這讓 **callable analyzePhoto** 成為 MVP 最合適的安全介面。citeturn25search1turn25search6turn25search7turn18view2

### 私隱與 App Store 風險

Apple 的 App Review Guidelines 對你的場景有幾條非常直接。其一，所有 App 都必須在 App Store Connect 與 App 內提供 **可輕鬆存取的隱私政策**，並清楚說明收集什麼資料、如何收集、如何使用、分享給哪些第三方、以及保留與刪除政策。其二，App 收集使用者或使用資料時需要取得 **使用者同意**，而且要提供容易理解與容易撤回的方式。其三，**為一個目的收集的資料，不得在沒有進一步同意下再拿去別的目的**。其四，如果 App 支援帳號建立，就必須提供 **app 內刪除帳號**。citeturn11view0turn11view2

這些規則直接推導出一個產品決策：  
**「分析照片給 AI provider 用」的 consent，和「拿照片作模型訓練 / 產品改進」的 consent，絕對不能綁在一起。** Apple 的規則已清楚指出資料不能無 consent 地為新目的再利用，而 App Privacy Details 頁面也強調你必須申報第三方夥伴與第三方程式碼的資料收集使用方式。因此，你的 `trainingConsent` 應維持 **預設 false**，若未來真的要做資料改進模型，只能做成 **獨立、可撤回、可審計** 的 opt-in。citeturn11view2turn10search1turn10search4

相簿匯入流程方面，Apple 指南也建議在可能情況下使用 **out-of-process picker** 而不是要求完整相簿權限；而 PhotosPicker 正是 Apple 官方提供的照片選擇器。這對你很重要，因為你的 App 雖然要做拍照與相簿匯入，但實際上並不需要掃描整個相簿。這會讓你的權限請求更容易過審，也更符合資料最小化。citeturn11view1turn7search4turn10search2

還有一個很容易被忽略，但對你非常重要的點：**Cloud Storage 的 soft delete**。Google Cloud 官方文件現在明確指出，soft delete 在所有 bucket 預設開啟，預設保留 **7 天**，而且這會增加短期暫存資料的儲存成本。這對你的兩個地方有影響：  
第一，若你在隱私政策中承諾「立即永久刪除照片」，你要非常小心這件事是否與 bucket policy 相符；第二，對你這種會反覆上傳、刪除、清理 AI 分析圖的 App，soft delete 可能會悄悄墊高成本。比較務實的做法是把「AI 暫存分析圖」與「使用者歷史圖」分開管理；若是臨時分析圖，應檢查是否需要單獨 bucket 或至少重新評估 soft delete policy。citeturn27search0turn27search2

如果你要支援「刪除帳號與所有資料」，Firebase 也有官方的 **Delete User Data extension**；但官方同時提醒，若用 traversal discovery 去找大型資料庫中的文件，會產生額外 reads / deletes 成本。Firestone 端若你有大量子集合，完整刪除整個 collection/subcollection 也需要逐批讀刪。這意味著你的刪帳功能設計應 **資料結構扁平化 + 可預測路徑 + 分批刪除**，不能把刪除成本留到最後才發現。citeturn9search13turn27search3turn4search5

## Codex 任務清單、測試清單與驗收標準

### 建議檔案與模組

**iOS 端**

```text
ios-app/
  Features/
    Camera/
      CaptureService.swift
      CameraView.swift
      CameraPreviewView.swift
      LiveGuideAnalyzer.swift
      Overlay/
        GridOverlayView.swift
        PortraitFrameOverlayView.swift
        PoseGuideOverlayView.swift
        LightHintOverlayView.swift
    AI/
      AIAnalysisService.swift
      AIResultView.swift
      AIOverlayView.swift
      PromptLanguageMapper.swift
    History/
      HistoryListView.swift
      HistoryDetailView.swift
  Models/
    AI/
      AIPhotoAdvice.swift
      AIPhotoAdviceSchema.swift
      PoseGuide.swift
    Photo/
      PhotoRecord.swift
  Services/
    Firebase/
      StorageService.swift
      FirestorePhotoService.swift
    Quota/
      QuotaService.swift
    Subscription/
      SubscriptionGate.swift
  Shared/
    DesignSystem/
    Extensions/
    Utils/
```

**Functions 端**

```text
functions/
  src/
    index.ts
    callables/
      analyzePhoto.ts
      askPhotoFollowUp.ts
    providers/
      GeminiPhotoAdvisor.ts
      OpenAIPhotoAdvisor.ts
      OpenAIImageEditProvider.ts
    core/
      AIProviderRouter.ts
      PromptBuilder.ts
      JsonSchemaValidator.ts
      CostLimiter.ts
      QuotaChecker.ts
      StorageFetcher.ts
      AnalysisWriter.ts
      ConsentGuard.ts
    contracts/
      analyzePhoto.ts
      askPhotoFollowUp.ts
    schemas/
      aiPhotoAdvice.schema.ts
```

### Codex 可執行任務清單

以下任務順序是我建議你直接交給 Codex 的做法，且每一步都足夠小，能避免一次生成過多導致失敗。

**第一批任務**

- 建立 `AIPhotoAdvice.swift`、`PoseGuide.swift`、`analyzePhoto.ts` contract 型別。
- 建立 `aiPhotoAdvice.schema.ts`，使用 Zod 或 AJV-friendly JSON schema。
- 在 `functions/src/core/PromptBuilder.ts` 先放 system prompt 與免費 / VIP prompt 模板。
- 建立 `GeminiPhotoAdvisor.ts` 的介面與 mock implementation，先不接真 API。
- 建立 `AIAnalysisService.swift`，只先打到 emulator / mock callable。
- 建立 `AIResultView.swift`，可渲染 summary、3 條建議、分數與微調值。

**第二批任務**

- 在 `CaptureService.swift` 補上拍照完成後的 `analyze-ready` 圖像輸出。
- 建立 `StorageService.swift` 上傳 `analyze.jpg` 與 `thumb.jpg`。
- 建立 `FirestorePhotoService.swift` 寫入 `photos/{photoId}`。
- 實作 `analyzePhoto` callable：驗證 auth、驗證 ownership、檢查 consent、回傳 mock JSON。
- 在 `QuotaChecker.ts` 以 transaction 實作 starter quota / daily quota 扣減。

**第三批任務**

- 把 `GeminiPhotoAdvisor.ts` 接上真實 Gemini API，使用 `defineSecret()`。
- 建立 `JsonSchemaValidator.ts`，對模型輸出做 schema 驗證。
- 對 invalid JSON、timeout、provider refusal 做 fallback。
- Function 成功後寫入 `photos/{photoId}/analyses/{analysisId}`。
- iOS 顯示真正 AI 結果，並在錯誤時顯示 retry UI。

**第四批任務**

- 建立 `LiveGuideAnalyzer.swift`，先做本地亮暗提示與人像框。
- 補 `PortraitFrameOverlayView.swift`、`LightHintOverlayView.swift`。
- 建立 `PoseGuideOverlayView.swift`，先能畫靜態 asset overlay。
- 把 `AIOverlayView.swift` 接到 camera preview，但只走本機判斷，不走雲端。

**第五批任務**

- 建立 `askPhotoFollowUp.ts` callable 與 `SubscriptionGate.swift`。
- 把 VIP follow-up context 綁到 `analysisId`，不做長期 chat memory。
- 建立 `OpenAIPhotoAdvisor.ts` 與 `OpenAIImageEditProvider.ts` 空 adapter。
- 文件更新：`docs/ai-advice.md`、`docs/provider-routing.md`、`docs/consent-flow.md`。

### 測試 checklist

**場景測試**

- 人像，主體置中但背景凌亂。
- 人像，主體被切頭。
- 人像，逆光。
- 人像，過暗。
- 食物，主體太遠。
- 食物，桌面雜物多。
- 景物，地平線歪斜。
- 景物，曝光過亮。
- 非人像場景時，`pose_score` 必須是 `null` 或 neutral，不得硬給人像姿勢建議。

**系統測試**

- 相機權限拒絕。
- 相簿權限拒絕或 limited access。
- Storage 上傳失敗。
- callable timeout。
- AI provider 回傳非 JSON。
- AI provider 回傳 JSON 但 schema 不合。
- 免費額度用盡。
- consent 尚未同意。
- 使用者刪除照片後再按分析。
- 同步兩台裝置同時扣額度。
- 離線模式下拍照，稍後重傳。
- 慢網路下結果頁 loading 與取消重試體驗。

**安全測試**

- iOS 專案中不得出現任何 Gemini / OpenAI key。
- Functions 僅從 secret 讀 key。
- 沒有 App Check token 的 callable 要能被拒絕。
- 非照片 owner 呼叫 `analyzePhoto` 必須失敗。
- bucket 路徑越權讀取與寫入必須被 security rules 擋下。

### MVP acceptance criteria

以下 acceptance criteria 建議直接寫進 `docs/mvp-ai-acceptance.md`，也是最適合交給 Codex 的驗收基準。

**拍後分析**

- 使用者拍完或匯入一張照片後，可以成功發起單張 AI 分析。
- 後端只使用一張 AI 分析圖，不會依賴整段影片流。
- AI 回傳內容包含：1 句 summary、最多 3 條建議、固定 schema 分數與數值。
- 若模型輸出不合法，系統顯示 fallback 提示，不讓 App crash。
- 分析成功後，Firestore 中有對應 `analysis` 文件，且 `photo.latestAnalysisId` 被更新。

**免費與 VIP**

- 免費用戶每次分析會正確扣額度。
- 免費用戶每日登入送 1 次分析可以被 server 驗證並防重複領取。
- VIP 可以對同一張已分析照片發出追問。
- VIP 追問不需要長期記憶所有歷史，但會帶入同一張照片的最近分析上下文。

**Overlay**

- 相機預覽頁可顯示 3x3 格線。
- 相機預覽頁可顯示簡單人像框或主體框。
- 相機預覽頁可顯示簡單亮暗提示。
- Overlay 不會覆蓋主體臉部中央區域。
- Overlay 目前不依賴遠端 AI 即可運作。

**安全與合規**

- 第一次使用 AI 分析前必須先完成 consent。
- `trainingConsent` 預設為 false。
- 使用者可在 App 內刪除帳號。
- 使用者可在 App 內刪除單張照片。
- 隱私政策頁面可從設定頁進入。
- App 內不出現硬編碼 AI API key。

### 給 Codex 的最終實作指令建議

把這份報告縮成一條最有用的實作原則，就是：

- **先做拍完後 AI 分析，不做真正 Live cloud AI。**
- **先讓 JSON schema 穩定，再追求模型花樣。**
- **所有 AI key 只放 Cloud Functions secret。**
- **本機 overlay 跟雲端 AI 分工，不要混。**
- **Gemini 做 MVP 分析，OpenAI 先留 adapter 給未來改圖。**
- **任何 quota、consent、ownership 都由 server 決定。**

這樣切，你的 App 會先成為一個真正能交付、能上架、能控制成本、也能被 Codex 逐步完成的產品，而不是一個功能看起來很大、但實際上哪一層都還不穩的 prototype。