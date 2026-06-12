# Paid AI Image Editing / 改圖師 for iOS Retro Camera App 深入研究報告

## 1. Executive Summary

**AI image editing / 改圖師** 應定位為付費用戶的 **post-capture / imported-photo enhancement tool**，而不是拍攝前 live camera coach，也不是通用 text-to-image generator。它應只處理「目前這張相」的修圖任務，例如提亮主體、降低高光、加強復古感、柔化背景、改善色調、保留自然質感等；不應開放成任意生圖、聊天、caption、政治宣傳、成人內容、deepfake 或身份冒充工具。

產品上可以叫「改圖師」、「相片改造」、「麻煩友幫你執相」、「Photo Fix」、「Style Edit」。UI 可以少用「AI」字眼，但在 consent / privacy 場景必須清楚說明：這會上傳目前照片到雲端 / 第三方 AI 服務作修圖。Apple App Review Guidelines 要求 app 在分享個人資料到第三方前清楚披露並取得 explicit permission；Photos / Videos 亦屬 App Privacy Details 裡的 User Content，未來若加入上傳修圖，必須更新 privacy disclosure。([Apple Developer][1])

架構上，真 provider integration 必須 **backend-mediated**：iOS app 不放 provider API key、不直接 call OpenAI / Gemini / Stability / 其他 provider；backend 負責 entitlement、quota、prompt guard、provider adapter、timeout、moderation、安全回應、logging minimization。這延續你前一份 cloud backend boundary：iOS 只和自家 backend 溝通，provider key 只存在 backend，並要求 explicit consent、no background upload、no raw persistence、structured response、quota / cost guard。 OpenAI 官方 API key safety 文件亦明確建議不要把 API key 部署在 browser 或 mobile app 等 client-side 環境，而應 route requests through your own backend server。([OpenAI Help Center][2])

最安全 implementation path：

```text
IE1 Research / Product Policy
→ IE2 Mock Image Editing UX
→ IE3 Prompt Contract + Guard Design
→ IE4 Backend Boundary Skeleton
→ IE5 StoreKit / Entitlement Prototype
→ IE6 Limited Provider Beta
→ IE7 Multi-provider / Advanced Edits
```

---

## 2. Product Goal

「改圖師」的目標是：幫用戶對 **已拍攝 / 已匯入的照片** 做高階修圖，而不是取代相機、filter、Filter Lab 或 Photo Advisor。

### 核心目標

```text
輸入：目前 selected / captured / imported photo
輸入：advisor suggestion 或 user custom prompt
輸出：一張 edited image result
場景：post-capture / imported-photo only
資格：付費用戶可真生成；免費用戶可看 mock / 建議
```

適合做：

* 提亮主體。
* 降低高光。
* 柔化背景。
* 增強復古感。
* 修正色調。
* 加強底片感。
* 加 grain / vignette / film mood。
* 清理小雜物，後期。
* 保留人物自然質感。
* 保持原圖構圖與人物身份，不做冒充。

不適合做：

* 生成完全新圖片。
* 做與目前照片無關的任務。
* 做文字聊天。
* 做 social caption generation。
* 做政治宣傳、成人內容、非法用途。
* 做 deepfake / identity misuse。
* 做外貌羞辱 / beauty scoring / attractiveness scoring。

### User-facing 命名

| 名稱                 | 適合程度 | 說明                             |
| ------------------ | ---: | ------------------------------ |
| 改圖師                |    高 | 有品牌感，少用 AI 字眼                  |
| 相片改造               |    高 | 偏創意但不過度技術化                     |
| Photo Fix          |   中高 | 適合英文 UI                        |
| Style Edit         |   中高 | 適合復古濾鏡 / 風格改造                  |
| 麻煩友幫你執相            |    中 | 有港式 personality，但要 opt-in tone |
| AI Image Generator |    低 | 容易被理解成通用生圖                     |

Consent 場景要明確：

```text
這會把目前照片傳送到雲端 AI 服務進行改圖。
```

---

## 3. Feature Boundary: Photo Editing, Not General Image Generation

### 3.1 Allowed

| 類型                            | 例子                                    |
| ----------------------------- | ------------------------------------- |
| Edit provided photo           | `幫呢張相變得更有日系底片感`                       |
| Lighting enhancement          | `提亮主體，降低高光`                           |
| Color / mood adjustment       | `色調偏暖，保留復古感`                          |
| Retro style                   | `加少少菲林 grain，同低對比感`                   |
| Background softening          | `背景柔一點，但不要改人樣`                        |
| Minor distraction removal     | `移走右下角細小雜物`，需 provider / policy 支援    |
| Composition-related safe edit | `裁成 4:5，保留上方天空`                       |
| Advisor-generated edit        | 由 Photo Advisor 建議轉成 safe edit prompt |

### 3.2 Not Allowed

| 類型                            | 應拒絕                                |
| ----------------------------- | ---------------------------------- |
| Unrelated generation          | `生成一張太空戰艦圖`                        |
| New unrelated scene           | `把照片變成火星殖民地`                       |
| Impersonation                 | `把我變成某明星`                          |
| Face swap / deepfake          | `換成另一個人的臉`                         |
| Protected trait modification  | `改成某種族 / 改性別 / 改年齡`                |
| Unsafe minors edit            | 涉及未成年人的性感化、暴露、剝削                   |
| Adult sexualization           | `令佢性感啲 / 少啲衫`                      |
| Political persuasion          | `幫我整成候選人宣傳圖`                       |
| Deception / fake news         | `整到似真實新聞照片`                        |
| Copyrighted character copying | `變成某 copyrighted character`        |
| Watermark removal             | `移除攝影師 watermark / copyright mark` |
| General chatbot               | `幫我寫一篇文`                           |
| General design generator      | `幫我設計 logo`                        |
| Non-photo memes               | `生成 meme 模板，唔關張相事`                 |

OpenAI usage policies 明確要求保護個人私隱、肖像、敏感特徵與未成年人，並禁止危害、欺騙、未經同意處理個人資料等用途；Google Generative AI prohibited use policy 亦禁止侵犯私隱/IP、未經同意追蹤或識別、欺騙、冒充、兒童剝削、成人/非自願性內容等。([OpenAI][3])

### 3.3 Contract 原則

Backend 不應把 user prompt 原封不動 pass-through 到 provider。應改為：

```text
user prompt
→ classify intent
→ reject / rewrite / constrain
→ structured edit request
→ provider adapter prompt
```

---

## 4. Relationship with Photo Advisor / Filter Lab / Local Coach

| Feature            | 時機                   |                     是否 cloud | 目的                     | 與改圖師關係                        |
| ------------------ | -------------------- | ---------------------------: | ---------------------- | ----------------------------- |
| Local Camera Coach | 拍攝前 / 拍攝中            |                            否 | 構圖、光線、穩定度提示            | 不取代；改圖師只在拍後                   |
| Photo Advisor      | 拍攝後 / 匯入後            |  mock / local / future cloud | 分析相片、推薦 filter、建議重拍/裁切 | 可生成 edit prompt               |
| Filter Lab         | 拍後 / reference style | mock / future cloud or local | 生成 filter recipe       | 不一定產出新 image；偏 reusable style |
| 改圖師                | 拍後 / 匯入後             |                     是，future | 直接產出 edited image      | 成本最高，付費 + quota               |

### 4.1 Local Camera Coach

* 拍攝前 / 拍攝中。
* local-only。
* no upload。
* no cloud AI。
* 不做 continuous cloud live guidance。

### 4.2 Photo Advisor

* 拍攝後 / 匯入後。
* 可 mock / local / future cloud。
* 分析照片，推薦 filters。
* 可把「光線 / 構圖 / 風格」建議轉成 edit prompt。

例如：

```text
Advisor:
主體有點暗，高光偏硬，背景稍亂。

改圖師 Prompt:
Lightly brighten the subject, reduce harsh highlights, soften the background slightly, keep the warm retro mood, preserve natural skin texture and original composition.
```

### 4.3 Filter Lab

* 主要產生 filter recipe。
* Free users 可 session-only 試用。
* Paid users 可保存 generated filters。
* 不一定需要 image editing provider。
* 不應被改圖師取代，因為 filter 是可重用 style，改圖師是一次性 image output。

### 4.4 改圖師

* 付費 post-capture tool。
* 根據 advisor prompt 或 user prompt 修改照片。
* 產出新 image result。
* 成本最高，需 quota、consent、backend、provider、safety。

---

## 5. Provider / Model Landscape

實作前必須再查最新 docs / pricing / policy，因為 image models、API 名稱、cost、rate limit 都變動很快。架構上應做 provider-agnostic adapter，不要把 app UI 綁死在單一 provider。

### 5.1 Provider 類型比較

| Provider / 類型                                     | Image edit input                                                   | Prompt control        | Output / editing                                                         | 適合度 | 注意事項                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------ | --------------------- | ------------------------------------------------------------------------ | --: | -------------------------------------------------------------------------------------------------- |
| OpenAI GPT Image-class provider                   | 支援 image edits；可用 existing image / reference image / mask editing  | 強                     | 支援 image edits、mask/inpainting、output size/quality/format/compression 設定 |   高 | 成本由 input text/image tokens + output image tokens 驅動；需 backend key；需 moderation / retention review |
| Google Gemini / image generation-editing provider | 支援 text-and-image-to-image；可加/移除/修改元素、style transfer、color grading | 中高                    | Generated images include SynthID watermark                               |   高 | Gemini docs 提醒用戶需有圖片使用權，且不可侵權、欺騙、騷擾或造成傷害                                                           |
| Stability / SD-based image editing provider       | 需 implementation 前重查最新 API                                         | 中高，視 endpoint / model | inpainting / img2img / style transfer 常見於 SD 類模型                         |   中 | self-host or provider API 都需要安全、moderation、cost、GPU/infra 策略；政策限制需遵守                               |
| Apple on-device / Core ML custom model            | 可做 local enhancement / classification / small model                | 可控但能力有限               | 不適合作為初期 cloud image editing provider                                     | 低至中 | 適合未來 local heuristic / small edit assist，不是高階生成式修圖 MVP                                             |
| 自家 backend + open-source model                    | 完全可控                                                               | 高                     | 可自訂模型/LoRA/inpainting                                                    |  後期 | GPU 成本、safety、latency、ops、license、IP risk 高                                                        |

OpenAI Images docs 說明 API 可 generate 或 edit images，Image API 包含 Generations 與 Edits；Images guide 亦列出 edits endpoint 可編輯 existing image、以 image 作 reference、用 image + mask 局部編輯，並可控制 output size、quality、format、compression。([OpenAI][4]) OpenAI docs 亦提醒 image generation 有 latency、文字渲染、一致性、構圖等限制，並建議使用 moderation / retry / prompt 調整處理失敗。([OpenAI][4])

Gemini image generation docs 描述其可處理 text / image / video input，並支援 image editing：加入/移除/修改元素、style transfer、color grading；Google 亦提醒用戶要有圖片使用權，且不可生成侵權、欺騙、騷擾或有害內容。([Google AI for Developers][5]) Gemini image understanding docs 說明較小圖片可 inline，較大或需重用可用 File API；pricing docs 顯示 free / paid tiers 與內容是否用於改善產品可能不同，實作前要按實際付費層與資料使用條款確認。([Google AI for Developers][6])

Stability / SD-based provider 可以作後期候選，但本報告不建議直接 provider-specific implementation。Stability Acceptable Use Policy 禁止侵犯權利、未經同意處理個人資料、欺騙、冒充、NCII、未成年人性剝削、hate/harassment、bypass safeguards 等行為；若選用 Stability 或自家 SD-based backend，要把這類政策轉成 prompt guard / moderation / report / enforcement。([Stability AI][7])

---

## 6. Recommended Architecture

### 6.1 High-level architecture

```text
iOS app
→ backend proxy
→ entitlement / quota check
→ prompt guard / policy check
→ image validation / upload handling
→ provider adapter
→ image edit provider
→ result validation / safety check
→ short-lived result URL / app-safe response
→ iOS preview
```

不可破壞原則：

```text
No provider API key in iOS
No direct iOS → provider call
Backend validates paid entitlement
Backend enforces quota
Backend checks prompt is photo-editing only
Backend rewrites prompt into safe provider prompt
Backend handles timeout / cancellation / retries
Backend sanitizes provider response
No raw input/output persistence by default
No training on user photos without explicit opt-in
No provider raw response stored by default
Structured request / response
Content moderation before provider call and after result
```

這與你現有 cloud backend boundary 方向一致：iOS 用 protocol 保留 mock / real service switch，backend 才有 provider credential、validation、quota、safety、no raw persistence、no request payload logging。

### 6.2 Provider adapter pattern

```text
ImageEditProviderAdapter
  ├─ OpenAIImageEditAdapter
  ├─ GeminiImageEditAdapter
  ├─ StabilityImageEditAdapter
  └─ MockImageEditAdapter
```

共同 interface：

```text
submitEdit(request: NormalizedImageEditRequest) -> ProviderEditJob
pollResult(jobId) -> ProviderEditResult
cancel(jobId)
```

Provider adapter 不應暴露給 iOS。iOS 只知道：

```text
jobId
status
editSummary
resultPreviewUrl
quotaRemaining
```

### 6.3 Sync vs async

| 模式                  | 優點                             | 缺點                        | 建議                         |
| ------------------- | ------------------------------ | ------------------------- | -------------------------- |
| Synchronous request | UX 簡單                          | image edit 可能慢，容易 timeout | 只適合 mock / very short edit |
| Async job           | 可處理長 latency、cancel、retry、poll | backend 複雜                | 真 provider beta 推薦         |
| Streaming progress  | 體驗好                            | provider support 不一致      | 後期                         |

OpenAI docs 提到 image generation/editing latency 可能受 prompt 複雜度影響，complex prompts can take up to 2 minutes；因此真 image editing beta 建議用 job-based async contract，而不是假設每次都可 10 秒內完成。([OpenAI][4])

### 6.4 Cost guard

```text
per-user monthly edits
per-user concurrent jobs
max image size
max prompt length
max provider retries
max output resolution
provider kill switch
budget alerts
per-provider routing flag
```

OpenAI image cost 由 input text tokens、input image tokens、output image tokens 驅動；edit request 若有 reference images 可能使用更多 input tokens。([OpenAI][4]) OWASP API Security Top 10 亦把 unrestricted resource consumption 列為 API 風險，因 requests 會消耗 network、CPU、memory、storage 或 provider costs，可能導致 DoS 或成本上升。([owasp.org][8])

---

## 7. Prompt Design

Prompt 來源分兩種：Advisor-generated prompt 和 user custom prompt。兩者都要先轉成 structured edit request，再由 backend 生成 provider-specific prompt。

### 7.1 Advisor-generated prompt

Advisor result：

```text
主體有點暗，高光偏硬，背景稍亂。
```

Converted edit prompt：

```text
Lightly brighten the subject, reduce harsh highlights, soften the background slightly, keep the warm retro mood, preserve natural skin texture and the original composition.
```

Structured request：

```json
{
  "intent": "photo_enhancement",
  "source": "advisor_suggestion",
  "allowedOperations": [
    "exposure_adjust",
    "highlight_reduce",
    "background_soften",
    "retro_style_enhance"
  ],
  "preserve": [
    "identity",
    "composition",
    "natural_skin_texture",
    "original_scene"
  ],
  "style": "warm retro mood",
  "strength": "subtle",
  "disallowedChanges": [
    "identity_change",
    "age_change",
    "gender_change",
    "body_shape_change",
    "new_unrelated_objects"
  ]
}
```

Prompt principles：

```text
短
photo-editing only
preserve identity / composition
avoid over-editing
include negative constraints
preserve natural texture
keep retro camera style
avoid changing age / gender / identity
avoid creating unrelated elements
```

### 7.2 User custom prompt

User input：

```text
幫我變得更有日系底片感，背景柔一點，但不要改樣。
```

Backend normalized request：

```json
{
  "intent": "style_enhancement",
  "allowedOperations": [
    "color_grade",
    "background_soften",
    "light_adjust",
    "grain_add"
  ],
  "preserve": [
    "identity",
    "composition",
    "natural_skin_texture"
  ],
  "style": "soft Japanese film mood",
  "strength": "subtle",
  "userPrompt": "幫我變得更有日系底片感，背景柔一點，但不要改樣。"
}
```

### 7.3 Provider prompt template

```text
System:
You are a photo editing engine for an iOS retro camera app.
Only edit the provided photo.
Do not create an unrelated image.
Do not change identity, age, gender, race, body shape, or protected traits.
Do not sexualize people.
Do not imitate a real person or copyrighted character.
Do not remove watermarks or copyright marks.
Preserve natural texture and original composition unless crop is explicitly allowed.
Keep edits subtle and photo-realistic unless a permitted retro style is requested.

Developer:
Allowed operations: {allowedOperations}
Preserve: {preserve}
Disallowed changes: {disallowedChanges}
Locale: {locale}
Output: edited image only, no extra text.

User:
{safeRewrittenPrompt}
```

OpenAI safety best practices recommend using prompt engineering to constrain topic and tone, validating user inputs, limiting outputs, and using structured/validated choices where possible.([OpenAI 開發者][9]) OWASP input validation guidance likewise recommends allowlists over denylists and server-side validation because client-side validation can be bypassed.([OWASP Cheat Sheet Series][10])

---

## 8. Prompt Guard / Abuse Prevention

### 8.1 Input guard

Input guard should classify:

```text
photo_editing_allowed
photo_editing_needs_rewrite
non_photo_task
unsafe_identity
unsafe_minor
unsafe_adult
unsafe_hate_or_harassment
unsafe_deception
unsafe_political
unsafe_copyright
unsafe_watermark_removal
```

Reject:

* Unrelated text-to-image.
* Unsafe sexual / exploitative / adult edits.
* Minors unsafe edits.
* Identity misuse / celebrity impersonation.
* Face swap.
* Protected characteristic modification.
* Political persuasion / propaganda.
* Deceptive news / fake evidence.
* Copyrighted character / brand copying if risky.
* Watermark / copyright mark removal.
* General chatbot / design task.

### 8.2 Allowed operations allowlist

```text
exposure_adjust
highlight_reduce
shadow_lift
color_grade
contrast_adjust
background_soften
noise_reduction
grain_add
vignette_add
minor_distraction_remove
crop_suggestion
retro_style_enhance
warmth_adjust
skin_texture_preserve
```

Avoid or postpone:

```text
face_swap
identity_change
age_change
gender_change
body_shape_change
sexualize_person
remove_watermark
add_political_symbol
create_fake_document
```

### 8.3 Rewrite / constrain

User prompt:

```text
幫我變靚啲，瘦啲，似某明星。
```

Backend decision:

```json
{
  "decision": "rejected",
  "reason": "identity_and_body_modification"
}
```

User-facing copy:

```text
呢個要求涉及改變身份或身體外觀，暫時未能處理。可以改為「提亮主體、柔化背景、保留自然質感」。
```

User prompt:

```text
幫我有日系菲林感，背景柔啲。
```

Backend rewrite:

```text
Apply a subtle soft Japanese film color grade, gently soften the background, preserve the original person, composition, and natural skin texture.
```

### 8.4 Output guard

Output guard:

```text
validate result exists
validate format / size
validate provider safety metadata if available
block unsafe output
do not store unsafe output
return failed / output_blocked state
```

OpenAI image docs describe moderation details with input and output moderation stages, and recommend generic user messages while using details for developer logs.([OpenAI][4]) Logging must avoid sensitive payloads: OWASP logging guidance says logs should not record access tokens, session IDs, PII, passwords, database strings, encryption keys/secrets, and should sanitize event data.([OWASP Cheat Sheet Series][11])

---

## 9. Free vs Paid / Quota / Cost Policy

### 9.1 Free user

Free user can:

```text
see mock / preview
receive advisor suggestions
try Filter Lab session-only
see suggested edit prompts
use local filters
```

Free user cannot:

```text
run real provider image editing
trigger upload
consume provider credits
accidentally create paid cost
```

### 9.2 Paid user

Paid user can:

```text
run image editing
use monthly quota / credits
use retry within limits
maybe get queue priority
save result if future export / cloud save exists
```

StoreKit should manage paid entitlement. StoreKit 2 provides Swift APIs for product info, purchasing, transaction history, and access/entitlement status; App Review Guidelines require in-app purchase for unlocking digital features/functionality in most cases.([Apple Developer][12])

### 9.3 Quota placeholders

| Policy              |                            Placeholder |
| ------------------- | -------------------------------------: |
| Monthly edits       |                   20–100 edits / month |
| Free mock previews  | Unlimited local mock, no provider call |
| Max image size      |           1024–1536 long edge for beta |
| Max prompt length   |                          300–500 chars |
| Max retries         |                        1 retry per job |
| Max concurrent jobs |                          1 active edit |
| Cooldown            |                          10–30 seconds |
| Provider timeout    |             60–120 seconds job timeout |
| Result expiry       |                    24h–7d if not saved |
| Kill switch         |                Per-provider and global |

Even paid “unlimited” should still have fair-use guard. Provider cost can change; backend should have per-provider kill switch and cost ceiling. OpenAI docs state image cost is proportional to image tokens, including input text/image and output image tokens; Gemini pricing docs show free / paid tiers and rate/cost differences, so production policy needs real-time cost review before launch.([OpenAI][4])

---

## 10. UX Design

### 10.1 Entry points

```text
selected photo result screen
Photo Advisor result
History detail, later
Filter Lab generated result, later
```

### 10.2 User flow

```text
1. User opens selected photo
2. Taps「改圖師」/「相片改造」
3. If free: show paid feature explanation / mock preview only
4. If paid: show consent
5. Choose advisor suggestion or write custom prompt
6. Prompt guard validates / rewrites
7. Show estimated action summary
8. User confirms
9. Upload compressed image to backend
10. Processing state
11. Result preview before / after
12. User can accept / retry / discard
13. Saving/exporting remains separate future feature if not implemented
```

### 10.3 UI states

```text
not_available
paid_required
consent_required
prompt_input
prompt_rejected
processing
timeout
result
failed
quota_exceeded
provider_unavailable
output_blocked
cancelled
```

### 10.4 繁中 / 香港口語文案

| State                | 文案                                            |
| -------------------- | --------------------------------------------- |
| Paid required        | `改圖師是 Pro 功能。你可以先預覽建議，真實改圖需要升級。`              |
| Consent              | `這會把目前照片傳送到雲端 AI 服務進行改圖。`                     |
| Consent HK           | `呢個功能會將而家呢張相傳去雲端改圖。你同意先會上傳。`                  |
| Prompt input         | `想點樣改？請只描述呢張相嘅修圖方向。`                          |
| Prompt rejected      | `呢個要求唔屬於相片修圖，或者涉及不安全改動。可以試「提亮主體、柔化背景、保留自然感」。` |
| Processing           | `改圖師執緊相，可能要等一陣。`                              |
| Result               | `已完成改圖，可以比較前後效果。`                             |
| Output blocked       | `呢次結果未能安全顯示，未有保存。`                            |
| Quota                | `今個月改圖額度已用完。`                                 |
| Cancelled            | `已取消，照片不會繼續處理。`                               |
| Provider unavailable | `改圖服務暫時未可用，可以稍後再試。`                           |

### 10.5 UX 避免

不要寫：

```text
AI 保證令你變靚
無限改圖
一定成功
絕對私密
完全不會保存
```

除非對應技術和 provider terms 真正支持。OpenAI data controls 顯示 API data 預設不會用於訓練，除非 explicit opt-in，但 abuse monitoring logs 可能保留 up to 30 days；部分 zero data retention / modified abuse monitoring 需 approval。([OpenAI][13])

---

## 11. Privacy / Consent / Retention

### 11.1 Consent copy

```text
這會把目前照片傳送到雲端服務進行改圖。
完成後，我們只會把結果傳回給你。
除非你選擇保存，否則不會把原圖或結果作長期保存。
第三方 AI 服務可能有自己的安全與濫用監控保留政策。
```

Short version:

```text
同意後才會上傳目前照片。你可以取消，繼續使用本機濾鏡。
```

### 11.2 Privacy principles

```text
explicit consent before upload
show what is uploaded
no background upload
image compression / minimization
no raw image persistence by default
no provider raw response persistence by default
no training on user images unless explicit opt-in
output retention policy
delete temp input after processing
delete output after expiry if user does not save
privacy policy update
App Privacy labels update
provider retention settings review
region / compliance review
user deletion request support
avoid full prompt/image in logs
```

Apple App Privacy Details states Photos / Videos are User Content and must be disclosed when uploaded; it also clarifies that data processed only on-device is not collected, but data sent off-device or retained in readable form must be considered.([Apple Developer][14])

### 11.3 Provider retention caveat

Do not claim:

```text
第三方永遠不會保留任何資料
```

unless you have contractual / API-tier support. OpenAI data controls state API data is not used to train or improve models unless explicitly opted in, but abuse monitoring logs may retain prompts/responses for up to 30 days; image/file inputs for certain endpoints may be scanned for CSAM and retained for manual review if suspected.([OpenAI][13])

---

## 12. Safety / Legal / App Store Considerations

### 12.1 App Store / UGC

If users can upload photos and prompts, this can become user-generated content and content manipulation. App Review Guidelines require apps with user-generated content to include methods for filtering objectionable material, reporting offensive content, blocking abusive users, and published contact information.([Apple Developer][1]) Apple also requires user permission before using/transmitting/sharing personal data and appropriate security measures for user information.([Apple Developer][1])

### 12.2 Safety rules

Must reject or block:

```text
beauty score
attractiveness score
identity change
age / gender / race modification
face swap
celebrity impersonation
explicit sexualization
unsafe minors edits
watermark removal
copyrighted character copying
hidden photo manipulation for deception
political persuasion / propaganda
fake official document edits
harassment / bullying edits
body shaming
health / legal / financial document manipulation
```

### 12.3 Hong Kong / 麻煩友 language

「麻煩友」語氣可以出現在 UX copy / mock prompts，但不應用於羞辱用戶、攻擊外貌、身份、年齡、性別、種族、殘疾、身體。對 image editing prompt 也要避免：

```text
幫佢變靚啲
瘦啲
後生啲
白啲
似某明星
```

可以改寫成：

```text
提升光線，保留自然質感。
色調柔和一點，保留原本樣貌。
```

### 12.4 Copyright / watermark / deception

Reject examples:

```text
幫我移除攝影師 watermark
整到似迪士尼角色
將佢變成某明星
做成新聞現場照
把證件資料改掉
```

User-facing copy:

```text
呢個要求可能涉及版權、身份冒充或誤導性改圖，暫時未能處理。
```

---

## 13. Backend Contract Proposal

### 13.1 Endpoints

```text
POST /v1/ai/image-edits
GET /v1/ai/image-edits/{jobId}
POST /v1/ai/image-edits/{jobId}/cancel
POST /v1/ai/image-edits/{jobId}/retry
```

### 13.2 Create request schema

```json
{
  "schemaVersion": "1.0",
  "source": "selected_photo",
  "imageUploadId": "img_123",
  "editMode": "advisor_suggestion",
  "userPrompt": "幫我變得更有日系底片感",
  "advisorSuggestionId": "lighting_soften",
  "allowedOperations": [
    "color_grade",
    "background_soften"
  ],
  "preserve": [
    "identity",
    "composition",
    "natural_skin_texture"
  ],
  "locale": "zh-Hant-HK",
  "consent": {
    "cloudAIEdit": true,
    "consentVersion": "2026-06-12.v1"
  }
}
```

### 13.3 Create response schema

```json
{
  "schemaVersion": "1.0",
  "jobId": "edit_123",
  "status": "processing",
  "estimatedWaitSeconds": 20,
  "quotaRemaining": 9
}
```

### 13.4 Result schema

```json
{
  "schemaVersion": "1.0",
  "jobId": "edit_123",
  "status": "succeeded",
  "resultImageUrl": "short-lived-signed-url",
  "resultExpiresAt": "2026-06-12T12:00:00Z",
  "editSummary": "已提亮主體並柔化背景。",
  "provider": "provider_key",
  "safety": {
    "inputAllowed": true,
    "outputAllowed": true,
    "blockedReason": null
  },
  "quota": {
    "quotaCost": 1,
    "quotaRemaining": 9
  }
}
```

### 13.5 Backend responsibilities

```text
validate entitlement
validate consent marker
validate prompt guard
validate image size / format
sanitize / rewrite prompt
call provider adapter
handle timeout / retries
validate provider result
return short-lived result URL
no provider raw response by default
no persistent image unless user saves
```

OWASP file upload guidance recommends file size limits, server-side validation, authorization before upload, generated filenames, safe storage, and defense in depth.([OWASP Cheat Sheet Series][15])

---

## 14. Data Model Proposal

```json
{
  "jobId": "edit_123",
  "userId": "user_123",
  "entitlement": "pro",
  "inputImageRef": "temp/img_123",
  "outputImageRef": "temp/out_123",
  "promptHash": "sha256_...",
  "promptCategory": "style_enhancement",
  "allowedOperations": [
    "color_grade",
    "background_soften"
  ],
  "preserve": [
    "identity",
    "composition",
    "natural_skin_texture"
  ],
  "status": "processing",
  "provider": "openai_or_gemini_adapter_key",
  "costEstimate": {
    "providerUnits": "estimated",
    "quotaCost": 1
  },
  "createdAt": "2026-06-12T00:00:00Z",
  "expiresAt": "2026-06-13T00:00:00Z",
  "deletedAt": null,
  "safetyDecision": {
    "inputAllowed": true,
    "outputAllowed": null,
    "reason": null
  },
  "failureReason": null
}
```

### 不應保存

```text
raw image by default
full prompt forever
provider raw response by default
face embeddings
identity analysis
sensitive inference
unrelated user content
full signed URL
full provider request payload
```

### Status enum

```text
created
awaiting_upload
guarding_prompt
queued
processing
succeeded
failed
cancelled
timeout
blocked_input
blocked_output
expired
deleted
```

---

## 15. Failure States and Recovery

| State                        | UX copy                  | Recovery                           |
| ---------------------------- | ------------------------ | ---------------------------------- |
| user not paid                | `改圖師是 Pro 功能。`           | show purchase / mock preview       |
| quota exceeded               | `今個月改圖額度已用完。`            | wait / upgrade / buy credits later |
| consent declined             | `無問題，呢張相唔會上傳。`           | return to local filters            |
| prompt rejected              | `呢個要求唔屬於相片修圖，或者涉及不安全改動。` | suggest safe prompt                |
| upload failed                | `上傳失敗，請檢查網絡再試。`          | retry                              |
| backend unavailable          | `改圖服務暫時連唔到。`             | retry later                        |
| provider unavailable         | `改圖服務暫時未穩定。`             | fallback / retry later             |
| provider timeout             | `今次處理太耐，未有扣除結果。`         | retry if quota policy allows       |
| moderation blocked           | `呢個修圖要求未能安全處理。`          | edit prompt                        |
| output failed                | `結果產生失敗，請換個簡單啲嘅要求。`      | retry simplified prompt            |
| output unsafe                | `呢次結果未能安全顯示，未有保存。`       | block + no preview                 |
| result expired               | `結果已過期，請重新生成。`           | re-run if quota available          |
| user cancelled               | `已取消改圖。`                 | return                             |
| app killed during processing | `找到未完成改圖工作。`             | resume polling                     |
| network offline              | `網絡未連線，稍後再試。`            | retry                              |
| image too large              | `呢張相太大，請用壓縮版本再試。`        | compress                           |
| unsupported format           | `暫時未支援呢個圖片格式。`           | convert JPEG/PNG                   |

---

## 16. MVP / Future Phase Plan

### IE1 — Research / Product Policy

```text
current research
no implementation
define feature boundary
define naming and privacy copy
define provider selection criteria
```

### IE2 — Mock Image Editing UX

```text
no upload
no real provider
mock advisor-generated prompt
mock user prompt guard
mock result state
paid-only placeholder
docs / tests
```

### IE3 — Prompt Contract + Guard Design

```text
structured schema
allowlist operations
prompt classifier spec
rejection copy
backend contract planning
no provider call
```

### IE4 — Backend Boundary Skeleton

```text
no provider key in iOS
upload endpoint planning
job endpoint planning
entitlement check mock
prompt guard endpoint
no real provider yet
```

### IE5 — StoreKit / Entitlement Prototype

```text
paid eligibility
restore purchases
quota placeholder
backend entitlement validation
no real provider yet
```

### IE6 — Provider Beta

```text
one provider
limited quota
explicit consent
prompt guard
timeout / cancellation
no long-term persistence
internal / TestFlight only
```

### IE7 — Multi-provider / Advanced Edits

```text
provider adapter
masks / inpainting
batch edits
save / export integration
cloud history if paid
advanced safety tooling
```

---

## 17. Risk Table

| Risk                                | Impact                   | Mitigation                                             |
| ----------------------------------- | ------------------------ | ------------------------------------------------------ |
| runaway provider cost               | 成本失控                     | quota, max image size, max retries, kill switch        |
| prompt abuse                        | policy / cost risk       | input guard + allowlist operations                     |
| non-photo task abuse                | 變通用生圖工具                  | reject non-photo tasks                                 |
| unsafe image edits                  | App Store / user harm    | pre/post moderation, output block                      |
| privacy concern                     | 用戶不信任                    | explicit consent, no background upload                 |
| provider retention                  | false privacy claim      | disclose provider retention; evaluate ZDR / paid terms |
| output quality disappointment       | refund / churn           | before/after preview; no guarantee copy                |
| identity / face misuse              | deepfake risk            | no face swap / impersonation                           |
| minors safety                       | severe policy risk       | strict rejection for unsafe minors edits               |
| copyrighted style / IP issue        | legal risk               | block risky character/brand imitation                  |
| watermark removal                   | IP violation             | reject                                                 |
| beauty / body shaming               | harm / brand risk        | no beauty score; no body modification                  |
| StoreKit complexity                 | implementation delay     | separate IE5 phase                                     |
| backend failure                     | bad UX                   | async job + retry + fallback                           |
| quota resentment                    | paid dissatisfaction     | clear fair-use copy                                    |
| latency                             | user frustration         | async state, estimated wait                            |
| app review rejection                | launch risk              | privacy labels, UGC controls, safety policy            |
| misleading AI edits                 | deception risk           | label AI-edited result where appropriate               |
| data deletion complexity            | compliance risk          | expiry, deletion job, user delete request              |
| prompt injection through image/text | unsafe provider behavior | system constraints + output moderation                 |
| logging mistakes                    | data exposure            | no raw image/prompt logs; sanitize logs                |

---

## 18. Final Recommendation

清楚建議：

1. **不要直接接 provider。**
   先做 mock UX、prompt contract、backend boundary、entitlement、privacy/safety policy。

2. **下一步最安全是 Mock Image Editing UX。**
   不上傳、不生成、不消耗 provider cost，只驗證產品流程。

3. **Prompt guard 必須早於 provider integration。**
   Backend 不應把 user prompt 原封不動 pass-through。

4. **真 provider 必須 backend-mediated。**
   iOS 不可放 API key，不可直接 call provider。([OpenAI Help Center][2])

5. **只允許 photo-related edits。**
   不做 general generator、chatbot、caption、logo、meme、政治宣傳、成人、identity misuse。

6. **付費才可真生成，但 free 可看 mock / suggestion。**
   StoreKit / backend entitlement 要先完成。

7. **必須有 quota / cost guard。**
   Image editing 是高成本功能，不可用 “unlimited” 無限制。

8. **必須有 consent / retention / deletion policy。**
   特別要披露 third-party AI、provider retention、是否用於訓練、結果保存時間。

9. **UI 應叫「改圖師 / 相片改造」，少用 AI。**
   但 consent 必須清楚寫 cloud AI / third-party AI。

10. **實作前必須查最新 provider docs / pricing / policy。**
    Provider 名稱、model、pricing、retention、safety policy 可能變動，實作前要重新確認。

### 下一個 Codex planning prompt

```text
Create IE2 — Mock Image Editing UX for the iOS retro camera app.

Scope:
- No real AI provider.
- No backend call.
- No Firebase / Gemini / OpenAI imports.
- No upload.
- No StoreKit purchase flow yet.
- No export/save-to-Photos implementation.
- Mock paid entitlement only.
- Keep existing mock-only / local-only AI boundaries intact.

Implement planning / mock UI:
- Entry point from selected photo result screen: "改圖師"
- Paid required state for free users
- Consent copy mock state for future cloud AI
- Advisor-generated prompt mock
- User custom prompt input
- Mock prompt guard:
  allow photo-related edits
  reject non-photo generation / identity misuse / sexual / watermark removal / unsafe requests
- Processing state
- Mock before/after result state
- Quota exceeded mock state
- Provider unavailable mock state
- Output blocked mock state
- No API key in iOS
- No raw image upload
- No persistence
- Add tests for prompt guard examples and UI states
```

---

## 19. Sources / Links

1. OpenAI Images guide — image generation and editing capabilities, image edits endpoint, masks, output format/quality/limitations, moderation and cost drivers. ([OpenAI][4])
2. OpenAI API key safety — do not deploy API keys in browsers or mobile apps; route through backend. ([OpenAI Help Center][2])
3. OpenAI safety best practices — moderation, red-teaming, prompt engineering, input/output constraints, abuse tracing. ([OpenAI 開發者][9])
4. OpenAI Usage Policies — privacy, likeness, minors, manipulation, deception, sensitive traits. ([OpenAI][3])
5. OpenAI data controls — API data training opt-in, abuse monitoring retention, image endpoint retention/ZDR caveats. ([OpenAI][13])
6. Google Gemini image generation / editing docs — image generation/editing, SynthID, image input, pricing tier considerations. ([Google AI for Developers][5])
7. Google Generative AI Prohibited Use Policy — illegal, privacy/IP, minors, deceptive, harassment, impersonation restrictions. ([Google 服務條款與隱私權政策][16])
8. Stability AI Acceptable Use Policy — rights/privacy, minors, NCII, impersonation, deception, hate/harassment, safeguard bypass restrictions. ([Stability AI][7])
9. Apple App Review Guidelines — third-party AI consent, user-generated content controls, IAP / StoreKit requirements, data security. ([Apple Developer][1])
10. Apple App Privacy Details — Photos/Videos as User Content, on-device vs collected data, upload disclosure. ([Apple Developer][14])
11. Apple StoreKit — StoreKit 2 entitlement / transaction status, signed transactions. ([Apple Developer][12])
12. OWASP Input Validation / File Upload / Logging / API Security guidance — allowlist validation, server-side validation, file size/type limits, logging minimization, resource consumption risks. ([OWASP Cheat Sheet Series][10])
13. Project context — previous Cloud AI Backend Boundary research: backend-mediated AI, no provider key in iOS, consent, no raw persistence/logging, structured JSON, quota/cost guard. 

[1]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines - Apple Developer"
[2]: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety "Best Practices for API Key Safety | OpenAI Help Center"
[3]: https://openai.com/policies/usage-policies/ "Usage policies | OpenAI"
[4]: https://platform.openai.com/docs/guides/image-generation "Image generation | OpenAI API"
[5]: https://ai.google.dev/gemini-api/docs/image-generation "Gemini API  |  Google AI for Developers"
[6]: https://ai.google.dev/gemini-api/docs/image-understanding "Gemini API  |  Google AI for Developers"
[7]: https://stability.ai/use-policy "Acceptable Use Policy | Ensure Responsible AI Use Today — Stability AI"
[8]: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ "OWASP Top 10 API Security Risks – 2023 - OWASP API Security Top 10"
[9]: https://developers.openai.com/api/docs/guides/safety-best-practices "Safety best practices | OpenAI API"
[10]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html "Input Validation - OWASP Cheat Sheet Series"
[11]: https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html "Logging - OWASP Cheat Sheet Series"
[12]: https://developer.apple.com/storekit/ "StoreKit 2 - Apple Developer"
[13]: https://platform.openai.com/docs/guides/your-data "Data controls in the OpenAI platform"
[14]: https://developer.apple.com/app-store/app-privacy-details/ "App Privacy Details - App Store - Apple Developer"
[15]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html "File Upload - OWASP Cheat Sheet Series"
[16]: https://policies.google.com/terms/generative-ai/use-policy "Generative AI Prohibited Use Policy"
