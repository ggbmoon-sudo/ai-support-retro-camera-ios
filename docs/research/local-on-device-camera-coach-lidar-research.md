# Local On-device Camera Coach + LiDAR Scene Understanding for iOS Retro Camera App 深入研究報告

## 1. Executive Summary

你的 iOS retro camera app 的「拍攝前 / 拍攝中」導拍功能，最安全、最可持續的路線應該是 **local-first / on-device-first**，而不是 continuous cloud AI。也就是：

```text
現有 rule-based guidance
→ local heuristic enrichment
→ Vision / AVFoundation / Core Motion / Core Image safe local signals
→ optional LiDAR-aware guidance for supported devices
→ future Core ML / on-device model
→ cloud AI only for post-capture / imported photo analysis
```

核心結論：

* **拍攝前 / 拍攝中 guidance 不應依賴 continuous cloud AI。** Camera preview 可能長時間開啟，如果每幾秒甚至每幀上傳 live frame，會造成不可控成本、延遲、電量、私隱與 App Store trust 風險。
* **Cloud AI 應保留給用戶主動觸發的 post-capture / imported photo advisor。** 這和前一份 cloud backend boundary 研究一致：第一個 real cloud AI endpoint 應優先是 post-capture photo advisor，而不是 live / snapshot / filter generator；同時要保持 no raw photo persistence、no request payload logging、mock fallback。
* **本地導拍應成為長期核心差異化功能。** Apple 的 AI & Machine Learning 頁面明確把 on-device machine learning 放在智能功能建構路線中，並提到 Core ML 可把傳統 ML models 整合到 apps；Vision 亦用於 image / video analysis。([Apple Developer][1])
* **LiDAR / depth 應是增強，不是必需。** ARKit / RealityKit 是 Apple 的 AR 基礎框架，而 AVFoundation 也有「Capturing depth using the LiDAR camera」sample code；但 LiDAR 並非所有 iPhone 都有，必須 runtime capability check + graceful fallback。([Apple Developer][2])
* **Core ML 不應是下一個 implementation。** 現階段應先把現有 brightness / framing / stability guidance 統一成 provider-based local coach architecture；Core ML 需要 dataset、label、evaluation、device/battery/thermal 測試，應在後期獨立 phase。
* **免費用戶應有 basic local coach。** 付費可以加 advanced local modes、LiDAR-enhanced packs、advanced pose packs、premium language/personality packs，但不應阻擋基本拍攝與基本本地導拍。

---

## 2. Product Goal

「本地相機教練 / 本地導拍」不是 chat assistant，也不是 cloud AI agent。它是一層 **低延遲、短句、可忽略、camera-first 的本機 guidance layer**。

產品目標：

```text
幫用戶在拍攝前 / 拍攝中改善：
- 構圖
- 光線
- 距離
- 穩定度
- 主體位置
- filter / lens 選擇
- pose overlay alignment
```

設計原則：

| 原則                     | 產品意思                            |
| ---------------------- | ------------------------------- |
| 低延遲                    | 提示要跟得上構圖變化                      |
| 不依賴網絡                  | 地鐵、旅行、室內弱網都可用                   |
| 不上傳 live camera frames | 保持私隱與信任                         |
| 不阻礙拍攝                  | 不遮住 shutter，不遮住主體               |
| 不做聊天                   | 不要問答式 UI；只做 compact guidance    |
| 短句                     | 一次一個主要建議                        |
| 可忽略                    | 用戶不理會也能正常拍                      |
| 可調 intensity           | Quiet / Normal / Active         |
| 可調語氣                   | normal / 繁中 / 香港口語 / 麻煩友 opt-in |

推薦 user-facing wording：

```text
本機導拍
相機教練
構圖提示
拍攝提示
相片顧問
麻煩友模式
```

避免過度使用：

```text
AI 即時分析
AI live assistant
AI 看住你拍
```

---

## 3. Why Continuous Live Cloud AI Is Not Recommended

### 3.1 成本

Continuous cloud AI 的成本模型對 camera app 特別危險。相機 viewfinder 可能開 30 秒、3 分鐘甚至更久；如果每幾秒上傳一張 frame，免費用戶或 bot usage 都會造成難以預測的 provider cost。前一份 cloud boundary 研究已把 live stream / Gemini Live / filter generator 排除在 first real AI MVP 之外，並建議 post-capture photo advisor 才是第一個 real AI endpoint。

成本風險包括：

```text
- 長時間 camera session
- 多次 frame upload
- image token / inference cost
- retry storm
- 免費用戶濫用
- 需要 aggressive quota
- 需要 kill switch
- provider price / quota 變動
```

結論：continuous cloud AI 不適合作 basic live guidance。

### 3.2 延遲

拍攝中 guidance 對時效要求很高。Cloud round trip 包含：

```text
capture frame
→ compress
→ upload
→ provider inference
→ response validation
→ download
→ UI render
```

當 response 回來時，用戶可能已經改變角度、移動主體、按下 shutter。這會造成「過時建議」，例如：

```text
AI：主體偏左
但用戶已經移回中間
```

所以拍攝中 guidance 應盡量本地化：brightness、face rectangle、motion、tilt、filter context 都可以低成本、低延遲地在 device 上處理。

### 3.3 私隱

Live viewfinder 可能包含：

```text
人臉
家居
街景
文件
小朋友
螢幕內容
私人物件
地址
車牌
工作場所
醫療 / 財務資料
```

Apple App Privacy Details 把 photos/videos 歸類為 User Content；若 app 有功能讓用戶上傳特定 media type，例如 photos/videos，需要披露對應資料類型。([Apple Developer][3]) Apple 也說，若 location、device identifiers 或 sensitive data 只在 device 上處理且不送 server，這類資料不算「collected」；如果 derivation 送出裝置，就要另行評估披露。([Apple Developer][3])

因此，live camera guidance 的安全產品邊界應是：

```text
live camera frames stay on device
no background upload
no hidden analytics of frames
cloud only after explicit post-capture consent
```

### 3.4 電量 / 網絡 / thermal

Camera preview 本身已消耗電量；如果再加 continuous upload、AI inference、response polling 或 streaming，會進一步增加：

```text
battery drain
thermal risk
network usage
roaming cost
bad UX in weak network
```

Apple App Review Guidelines 亦要求 app 應有效率地使用電力，不應快速耗電、產生過量熱力或對裝置資源造成不必要壓力。([Apple Developer][4]) Apple 的 Energy Efficiency Guide 也建議對 motion updates 降低頻率，因為較大的 update interval 會減少事件並改善 battery life。([Apple Developer][5])

### 3.5 App Store / Trust

Apple App Review Guidelines 強調用戶安裝 app 時應能信任 app 安全、無冒犯內容、不損害裝置、也不會造成身體傷害；app 亦要妥善處理個人資料與安全。([Apple Developer][4]) 若 app 做 live camera upload，必須非常清楚 disclosure，否則會降低用戶信任，亦可能影響 App Privacy labels。

### 3.6 技術複雜度

Continuous cloud AI 不是「加一個 API call」；它需要：

```text
throttling
cancellation
quota
consent state
retry policy
upload failure handling
provider timeout
backend cost control
privacy policy
retention policy
unsafe response fallback
App Store review explanation
```

結論：

> **不應用 cloud AI 做 continuous viewfinder guidance。Cloud AI 只應用於用戶主動觸發的 post-capture / imported photo advisor。**

---

## 4. Current Local Guidance Baseline

你目前已有的 baseline 是正確方向：

```text
brightness guidance
face framing / headroom guidance，只使用 face rectangle，不做身份辨識
stability / priority / anti-flicker
compact guidance chip / pill
mock AI Snapshot boundary
post-capture mock advisor
local heuristic advisor / filter recommendation
Pose Overlay MVP
```

這些 baseline 做得對的地方：

| Baseline                 | 做得對的點                                   |
| ------------------------ | --------------------------------------- |
| brightness guidance      | 可用 downsampled frame / luminance，本地、低成本 |
| face rectangle framing   | 只用 rectangle 作構圖，不做人臉辨識                 |
| headroom guidance        | 可轉成短句，不涉及外貌評價                           |
| stability / anti-flicker | 避免提示跳來跳去，提升 trust                       |
| priority resolver        | 一次只顯示最重要提示                              |
| compact UI               | 不阻擋 camera-first flow                   |
| mock AI Snapshot         | 保持 no upload / no backend boundary      |
| local heuristic advisor  | 可平滑銜接 post-capture mock / future cloud  |
| Pose Overlay MVP         | 用 static overlay 先行，避免 body pose 風險     |

最重要的是，目前方向已符合：

```text
local-first
mock-only / no upload
no identity inference
no face recognition
no sensitive attribute inference
no raw frame persistence
```

這應該保留為所有後續 local coach phase 的底線。

---

## 5. Local Heuristic Guidance Layer

不用訓練模型，本地 heuristic 已經可以做到相當多。它的優點是可控、可測試、可 explain、低成本、低風險。

### 5.1 光線 heuristics

可做：

| Signal              | Heuristic                                | Guidance copy      |
| ------------------- | ---------------------------------------- | ------------------ |
| brightness bucket   | dark / normal / bright                   | `光線有點暗，可以靠近窗邊。`    |
| underexposure       | mean luminance 低                         | `畫面偏暗，等光多一點再拍。`    |
| overexposure        | highlights clipped                       | `高光有點爆，可以避開直射光。`   |
| high contrast       | bright/dark range 過大                     | `光暗差有點大，可以換個柔和位置。` |
| low contrast        | histogram compressed                     | `畫面有點平，可以試高對比底片。`  |
| backlight           | face/subject area darker than background | `逆光感幾強，可以補一點光。`    |
| low-light stability | dark + motion high                       | `光線暗，定一定再撳會穩啲。`    |

Core Image 官方 archive 說明 Core Image 是 image processing / analysis technology，可對 still / video image 做接近 real-time processing，且提供 built-in filters、feature detection、自動 enhancement、filter chaining 等能力。([Apple Developer][6]) Core Image Filter Reference 亦列出 `CIAreaAverage`、`CIAreaHistogram`、`CIColorControls`、`CIExposureAdjust`、`CIHighlightShadowAdjust` 等可支援 brightness / histogram / exposure / contrast 分析或調整的 filters。([Apple Developer][7])

### 5.2 構圖 heuristics

可做：

```text
face rectangle position
headroom
subject placement
rule of thirds
center framing
framing density
crop intent
portrait / landscape aspect awareness
horizon / tilt later
```

Safe implementation：

```text
Use face rectangle as geometry only.
Do not identify person.
Do not infer age, gender, emotion, attractiveness.
Do not store face embeddings.
Do not compare faces across frames.
```

Vision 可做 image / video analysis，Apple 亦將 Vision 描述為用於 computer vision 的 framework；但短期應只用 safe geometric signals，例如 face rectangle、rectangle/horizon request，避免 body / identity / sensitive inference。([Apple Developer][1])

### 5.3 穩定度 heuristics

可做：

```text
camera shake
device motion variance
ready-to-shoot hint
anti-flicker suggestion
low-light + movement warning
```

Core Motion 可接收 accelerometer、gyroscope、device motion 等 continuous updates；Apple 能源文件建議設定合適 update interval，interval 越大事件越少、battery life 越好，並且不再需要時要 stop updates。([Apple Developer][5])

Guidance examples：

```text
畫面穩定了，可以拍。
有少少震，定一定先撳。
夜晚光線暗，穩住會清楚啲。
```

### 5.4 鏡頭 / 濾鏡 heuristics

可用現有 app 狀態：

```text
selected mock lens
selected filter family
time of day, if local and non-sensitive
brightness bucket
face framing state
scene mood selected by user
```

Guidance examples：

```text
呢個光適合暖色底片。
夜景可以試 Amber Night 800。
街拍構圖可以試 Street Chrome。
如果想 CCD 感，可以試 CCD Party 2008。
```

### 5.5 Pose / subject guidance

短期可做：

```text
static pose overlay
face / headroom alignment
subject inside safe zone
distance / framing density
```

短期不建議做 full body pose scoring。Apple Vision 有 human body pose request documentation，但 body pose guidance 容易變成「姿勢評分 / 身體評價」，對 safety、accessibility、文化差異都更敏感。([Apple Developer][8])

### 5.6 Feasibility classification

| 類型    | Short-term feasible                      | Medium-term feasible           | Risky / avoid for now             |
| ----- | ---------------------------------------- | ------------------------------ | --------------------------------- |
| 光線    | brightness bucket, under/over exposure   | backlight, contrast histogram  | 「照片質素分」                           |
| 構圖    | face rectangle, headroom, center framing | rule of thirds, horizon / tilt | beauty / attractiveness scoring   |
| 穩定    | shake, ready-to-shoot                    | low-light stability model      | continuous cloud inference        |
| 濾鏡    | selected filter family hints             | scene-to-filter heuristic      | AI hallucinated filter names      |
| Pose  | static overlay                           | catalog pose suggestion        | body score / gendered pose advice |
| Scene | local mood tags                          | Core ML scene category         | sensitive place inference         |

---

## 6. iOS Native Signal Sources

### 6.1 Signal source table

| Signal Source | 可幫到什麼                                                   | Cost / Battery   | Privacy                                       | Difficulty | MVP use? |
| ------------- | ------------------------------------------------------- | ---------------- | --------------------------------------------- | ---------- | -------- |
| AVFoundation  | preview、frame sampling、capture、camera auth、depth sample | 中；camera 已開時可共享  | 高敏感，必須不 upload                                | 中          | 是        |
| Vision        | face rectangle、horizon、rectangle、saliency、body pose     | 中，高頻會耗電          | geometry safe；identity/sensitive risky        | 中          | 部分       |
| Core Image    | brightness、histogram、contrast、saturation                | 低至中，可 downsample | local safe                                    | 低至中        | 是        |
| Core Motion   | tilt、shake、stability、orientation                        | 低至中，需 throttle   | local safe                                    | 低          | 是        |
| ARKit / LiDAR | depth、distance、foreground/background                    | 中至高              | surroundings / environment scanning sensitive | 高          | 後期       |
| Core ML       | scene category、composition class、filter family          | 中至高，視 model      | local privacy advantage                       | 高          | 後期       |

### 6.2 AVFoundation

AVFoundation 是 Apple 的 full-featured framework，用於 iOS / iPadOS / macOS / tvOS / visionOS / watchOS 上 time-based audiovisual media；AVFoundation 頁面列出 setting up capture session、choosing capture device、AVCam sample、LiDAR depth capture sample 等 camera 相關資源。([Apple Developer][9])

可用於：

```text
camera preview
photo capture pipeline
video frame sampling
exposure / focus / lens context where available
depth data support where available
authorization flow
```

MVP 建議：

```text
Use existing AVCapture preview.
Only sample downsampled frames at low frequency.
Do not persist frames.
Do not upload frames.
Run analysis on background queue.
```

### 6.3 Vision

Vision 適合做局部安全 signal：

```text
face rectangle detection for framing
horizon / rectangle detection later
saliency / object hints later
body pose only after safety review
```

Apple 的 AI & Machine Learning 頁面描述 Vision 可做 image / video analysis；直接的 VNDetectFaceRectanglesRequest、VNDetectHumanBodyPoseRequest、VNDetectHorizonRequest docs 也存在，但這些 developer docs 頁面在瀏覽器中需要 JavaScript，實作時應以 Xcode / Apple Docs 查 runtime availability。([Apple Developer][1])

Safety rule：

```text
Allowed:
- face rectangle
- bounding box geometry
- subject placement

Not allowed:
- identity recognition
- age
- gender
- emotion
- attractiveness
- race / religion / sensitive traits
```

### 6.4 Core Image / Image Processing

Core Image 適合 brightness / histogram / filter context：

```text
CIAreaAverage
CIAreaHistogram
CIColorControls
CIExposureAdjust
CIHighlightShadowAdjust
CITemperatureAndTint
CIVignette
```

Apple Core Image Programming Guide 指出 Core Image 可近 real-time 處理 still / video images，支援 GPU / CPU rendering path，並有 built-in filters、feature detection、自動 enhancement 和 filter chaining。([Apple Developer][6]) Filter Reference 亦列出多個 reduction / histogram / color adjustment filters。([Apple Developer][7])

MVP 建議：

```text
Downsample frame to e.g. 64x64 / 128x128 for luminance.
Compute average brightness and highlight ratio.
Use thresholds + hysteresis.
Do not run full filter pipeline for every frame.
```

### 6.5 Core Motion

Core Motion 可提供：

```text
device tilt
shake
orientation
stability
ready-to-shoot
```

Apple Energy Efficiency Guide 說明 motion events 由 accelerometer、gyroscope、magnetometer 等硬件偵測；Core Motion 可接收 accelerometer、gyroscope、device motion events，並建議指定合適 interval、減少更新頻率及在不需要時停止 updates。([Apple Developer][5])

MVP 建議：

```text
20–30Hz motion sampling for stability, lower if enough.
Aggregate over 300–700ms.
Use variance threshold.
Use anti-flicker before showing "stable / shaky".
```

### 6.6 ARKit / LiDAR / Depth

ARKit / RealityKit 可建立 AR experiences；Apple 的 Augmented Reality 頁面說 ARKit / RealityKit 是建立 AR experiences 的 powerful frameworks。([Apple Developer][2]) AVFoundation 也列出「Capturing depth using the LiDAR camera」sample code，代表 LiDAR depth can be accessed on supported configurations.([Apple Developer][9])

可用於：

```text
scene depth
distance-to-subject
foreground/background separation
pose overlay scale
portrait distance guidance
depth layering
AR framing aids
```

但不應作 MVP 必需能力。

### 6.7 Core ML

Core ML / Core AI 是未來路線。Apple AI & Machine Learning 頁面提到 Apple 的 on-device ML stack 可建立、使用、訓練、部署 AI/ML models；Core ML 用於把傳統 ML models 整合到 apps and games，支援從 popular training libraries 轉換 models。([Apple Developer][1])

MVP 不建議直接做 Core ML，因為 model design / dataset / evaluation 未成熟。

---

## 7. On-device AI / Core ML Feasibility

### 7.1 可做的未來能力

未來 on-device model 可以做：

```text
scene type classification
composition category
lighting category
subject placement quality
depth / portrait suitability
style recommendation
retake suggestion
pose suggestion
filter family recommendation
scene-specific camera coaching
```

### 7.2 Feasibility analysis

| 項目                           | 可行性 | 備註                                        |
| ---------------------------- | --- | ----------------------------------------- |
| Scene classification         | 中高  | 可用小型 CNN / ViT-like classifier，但要 dataset |
| Lighting category            | 高   | 可先 heuristic，再 ML refine                  |
| Composition quality category | 中   | 主觀性高，需要清楚 label taxonomy                  |
| Filter family recommendation | 中高  | 可用 scene + brightness + style label       |
| Retake suggestion            | 中   | 要避免批評語氣與 overconfidence                   |
| Pose suggestion              | 中低  | body / sensitive concerns 較高              |
| Depth / portrait suitability | 中   | LiDAR / depth device fragmentation        |
| Full local coach model       | 中   | 需要 dataset + battery/thermal evaluation   |

### 7.3 Inference frequency

不要每幀跑 model。建議：

```text
Rule-based / heuristic:
- 5–10Hz for lightweight signals
- 1–3Hz for image analysis
- anti-flicker / smoothing

Core ML future:
- 0.5–2Hz
- downsampled frame input
- pause when app thermal / low power
- no inference during shutter animation / capture if it risks lag
```

Apple App Review Guidelines 要求 app 不應快速耗電或產生過量熱力；這支持 throttled inference 和 low-power fallback。([Apple Developer][4])

### 7.4 Privacy advantage

On-device model 的最大優勢是：

```text
no frame upload
offline
lower latency
lower cloud cost
easier trust story
App Privacy labels simpler if no data leaves device
```

Apple App Privacy Details 明確指出，只在裝置上處理且不送出 server 的資料不算 collected；若衍生資料送出 device，則要分開評估。([Apple Developer][3])

### 7.5 明確建議

```text
目前不要實作 Core ML model。
第一版應先用 rule-based + heuristic。
Core ML 需要 dedicated model design / dataset / evaluation phase。
On-device model 應該在 dataset / evaluation 成熟後才做。
```

---

## 8. Dataset and Training Requirements

### 8.1 Dataset 類型

未來若要訓練 local camera coach model，需要覆蓋：

```text
good / bad composition examples
lighting examples
portrait framing examples
street photography
landscape
food
night
indoor
backlight
group photos
retro camera style examples
Hong Kong / Asian city context examples, only if legally licensed
LiDAR / depth paired examples, future
```

### 8.2 Label 類型

建議 labels 不應是「好相 / 爛相」這種審美判斷，而應是 action-oriented：

```text
composition_issue: too_much_headroom / subject_too_low / subject_too_close
lighting_issue: underexposed / overexposed / harsh_light / low_contrast
crop_suggestion: crop_right / keep_sky / use_4_5
subject_placement: center / left_third / right_third
headroom: too_much / ok / too_little
horizon: tilted_left / tilted_right / ok
background_clutter: low / medium / high
filter_family: warm / chrome / night / ccd / cinematic
retake_reason: step_back / move_to_shadow / hold_steady
confidence: low / medium / high
safe_to_show: true / false
```

### 8.3 資料來源

可用：

```text
licensed stock images
internally produced photo dataset
synthetic / generated training data, after legal review
public dataset, license review required
opt-in user contribution, later only
LiDAR / RGB-D public datasets, license review required
```

RGB-D / LiDAR research datasets can inform dataset design. ARKitScenes is a real-world RGB-D dataset captured with mobile devices and includes high-resolution depth maps and 3D boxes; ARKitTrack includes consumer-grade LiDAR scanner RGB-D sequences and annotations. These are useful as research references, but commercial training use requires license/legal review. ([arXiv][10])

### 8.4 不可做

```text
偷偷用用戶相片訓練
未同意上傳相片
未同意保存 live frames
使用私人照片作 training without explicit consent
使用不明來源圖片訓練商業模型
保存敏感推斷 label
保存 face identity / embeddings
保存 age / gender / emotion labels
```

Apple App Review Guidelines 要求 apps collecting user or usage data 必須取得 user consent，且需提供容易理解的撤回方式；paid functionality 亦不能依賴或強迫用戶授權不必要資料存取。([Apple Developer][4])

### 8.5 Training risks

| Risk                     | 說明                                            |
| ------------------------ | --------------------------------------------- |
| bias                     | 訓練資料偏向某種審美、城市、膚色、場景                           |
| bad advice               | 模型給出錯誤構圖建議                                    |
| overfitting              | 過度迎合 retro style，忽略一般拍攝                       |
| cultural mismatch        | 港式街拍 / 亞洲夜景和西方 stock dataset 差異               |
| device differences       | 不同 iPhone lens / sensor / HDR pipeline        |
| lighting variation       | 夜景、室內、背光差異大                                   |
| privacy / licensing      | dataset 權利不清                                  |
| annotation inconsistency | 不同標註員審美不一致                                    |
| model drift              | filter catalog / product style 改變後 model 不再適合 |

### 8.6 Dataset strategy

```text
Stage 1:
- heuristic fixtures
- handcrafted scenes
- deterministic simulator fixtures

Stage 2:
- internally produced photo set
- manual label taxonomy
- small evaluation set

Stage 3:
- licensed dataset
- clear commercial rights
- diverse scenes

Stage 4:
- optional opt-in user contribution
- explicit consent
- deletion flow
- no default live frame saving

Stage 5:
- LiDAR / depth paired dataset
- only after LiDAR prototype proves value
```

---

## 9. LiDAR-aware Scene Understanding

### 9.1 實際價值

LiDAR / depth 對 camera coach 的價值不是「更 AI」，而是提供 **幾何與距離 signal**：

| 場景                               | LiDAR / depth 能幫什麼             |
| -------------------------------- | ------------------------------ |
| portrait distance guidance       | 提醒太近 / 太遠                      |
| subject-background distance      | 建議離背景遠一點，增加層次                  |
| foreground/background separation | 協助 portrait / retro depth feel |
| pose overlay scale               | overlay 隨距離調整大小                |
| low-light spatial hints          | RGB 很暗時仍可有粗略距離                 |
| depth layering                   | 建議前景 / 中景 / 背景分層               |
| background compression           | 提示退後 + zoom/lens effect，後期     |
| double exposure alignment        | 用 depth layer 對齊，後期            |
| AR framing aids                  | 顯示地面 / 空間框線，後期                 |

### 9.2 技術方向

```text
LiDAR-supported devices only
runtime capability check
ARKit scene depth / frame semantics if available
AVFoundation depth data where applicable
downsample depth map
confidence / validity checks
fallback to no-depth behavior
no persistence
no cloud
```

不建議 hardcode device model list。應使用 runtime capability checks，例如 camera / AR session configuration / depth delivery support，而不是用「某某 iPhone 型號」判斷，因為 Apple API availability 與硬件支援會隨年份改變。

### 9.3 限制

```text
not all iPhones have LiDAR
simulator limitations
reflective / transparent surfaces
outdoor sunlight and range limitations
depth noise
battery / thermal
API complexity
privacy expectations
environment scanning label considerations
```

Apple App Privacy Details 把 Environment Scanning 定義為 surroundings 類資料，例如 mesh、planes、scene classification、image detection of surroundings；如果未來把 environment scanning data 送出 device 或保存，需要仔細評估 privacy label。([Apple Developer][3])

### 9.4 結論

```text
LiDAR should enhance guidance, not be required.
App must gracefully fallback on non-LiDAR devices.
LiDAR implementation should be a dedicated future phase, not MVP.
```

---

## 10. Device Compatibility and Fallback

| Environment           | Available signals                           | UX behavior                       |
| --------------------- | ------------------------------------------- | --------------------------------- |
| iPhone Pro with LiDAR | camera + heuristics + optional depth        | depth-enhanced guidance           |
| iPhone without LiDAR  | camera + heuristics                         | normal local guidance             |
| older iPhone          | limited camera / motion / processing        | simpler guidance, lower frequency |
| simulator             | mock / placeholder / deterministic fixtures | deterministic mock guidance       |
| camera unavailable    | no live camera                              | import/photo guidance only        |
| permission denied     | no camera                                   | permission copy / import flow     |
| low power / thermal   | reduced analysis                            | quiet mode / lower frequency      |

Fallback principles:

```text
no crash
hide depth-specific hints
no misleading LiDAR copy
never say "LiDAR active" unless real depth signal exists
user can still shoot / import
mock fixtures for simulator
reduced frequency under low power / thermal
no raw keys / provider keys
no upload
```

Permission denied copy:

```text
需要相機權限先可以拍攝。你仍然可以匯入相片試濾鏡。
```

No LiDAR copy:

```text
呢部機未支援深度導拍，已使用一般本機導拍。
```

Low power copy:

```text
已降低導拍頻率，幫你慳電。
```

---

## 11. Guidance UX Design

### 11.1 UX principles

```text
不要長卡片常駐
使用 compact chip / pill
不阻擋 shutter
不遮住主體
用戶可以點擊展開
一次只顯示一個主要建議
priority queue
anti-flicker
confidence threshold
quiet mode
coach intensity setting
language mode support
VoiceOver support
減少 user-facing "AI" wording
```

### 11.2 Guidance display model

```text
CameraGuidanceCandidate[]
→ priority resolver
→ anti-flicker controller
→ current CameraGuidanceState
→ compact pill
```

Display example:

```text
[本機導拍] 光線有點暗，可以靠近窗邊。
```

Tap to expand:

```text
光線有點暗
建議：靠近窗邊或用暖色底片
[關閉提示] [降低頻率]
```

### 11.3 Priority rules

| Priority | Example                                       | Notes                    |
| -------- | --------------------------------------------- | ------------------------ |
| Critical | camera permission denied / camera unavailable | blocks feature           |
| High     | too shaky / too dark                          | directly affects capture |
| Medium   | headroom / subject placement                  | composition              |
| Low      | filter style hint                             | optional                 |
| Quiet    | nice-to-have                                  | only active mode         |

### 11.4 Anti-flicker rules

```text
minimum display duration: 1.5–2.5s
same category cooldown: 3–5s
state hysteresis: threshold + margin
confidence threshold before show
only show if stable across N frames / time window
do not swap guidance during shutter press
```

### 11.5 Normal / 繁中 copy

```text
光線有點暗，可以靠近窗邊。
頭頂空間有點多，鏡頭稍微向下。
畫面穩定了，可以拍。
背景有點亂，可以靠近主體。
這個構圖適合暖色底片。
有少少逆光，可以轉一點角度。
夜景可以定一定先撳。
主體可以再靠中間少少。
```

### 11.6 Hong Kong / 麻煩友 opt-in copy

```text
屌，個頭頂留咁多位做乜？鏡頭落返少少啦。
唔好震啦，定一定先撳。
呢個光有啲死，行近窗邊會靚好多。
背景咁亂，行近少少影啦。
呢個位唔差，撳啦。
逆光有啲勁，側少少會好啲。
夜晚唔好急，穩陣啲先影。
```

### 11.7 Profanity / 麻煩友 safety rules

Profanity mode 必須：

```text
opt-in
default off
easy to disable
clear preview examples before enable
no identity insult
no body shaming
no age / gender / race / disability insult
no hate speech
no harassment
no appearance scoring
no beauty score
no target against protected groups
```

Apple App Review Guidelines 將 defamatory、discriminatory、mean-spirited content，尤其針對 religion、race、sexual orientation、gender、national/ethnic origin 等 targeted groups，列為 objectionable content；麻煩友 mode 即使是品牌語氣，也必須避免攻擊身份或羞辱外貌。([Apple Developer][4]) App Store age rating 亦要誠實回答，metadata 和 rating 需反映實際內容；粗口語氣可能影響分級。([Apple Developer][4])

### 11.8 Accessibility

建議：

```text
VoiceOver reads only current main guidance
do not announce every flicker
respect Reduce Motion
high contrast pill option
large text support
haptic optional
coach quiet mode
```

---

## 12. Free vs Paid Policy

### 12.1 Free

Free 應包括：

```text
basic local camera coach
brightness guidance
face framing / headroom guidance
stability guidance
basic pose overlay
local heuristic suggestions
basic filter-aware hints
no continuous cloud live AI
manual import/photo flow
camera core flow
```

理由：basic local guidance 是 camera product 的核心，不應被 paywall 阻擋。Apple App Review Guidelines 也指出 paid functionality 不應依賴或要求用戶授權不必要資料存取；你的設計應避免把基本 camera flow 或基本 privacy-respecting guidance 變成 forced account / forced permission。([Apple Developer][4])

### 12.2 Paid

Paid 可考慮：

```text
advanced local coach modes
LiDAR-enhanced guidance packs
advanced pose packs
premium language/personality packs
advanced scene modes
higher / fair-use post-capture cloud AI quota
save generated filters
advanced retro effects
```

### 12.3 Avoid

不要做：

```text
paywall blocking basic camera
paywall blocking basic local guidance
cloud live guidance as paid feature until cost model proven
forcing account before camera use
forcing photo upload for core experience
```

### 12.4 Suggested matrix

| Feature                          |               Free |            Paid |
| -------------------------------- | -----------------: | --------------: |
| Camera capture                   |                  ✅ |               ✅ |
| Basic local coach                |                  ✅ |               ✅ |
| Brightness / framing / stability |                  ✅ |               ✅ |
| Basic pose overlay               |                  ✅ |               ✅ |
| Advanced pose packs              |                  — |               ✅ |
| LiDAR-enhanced mode              |    limited / trial |               ✅ |
| Premium personality packs        |                  — |               ✅ |
| Post-capture cloud quota         | small future quota | higher fair-use |
| Generated filter saving          |            limited |               ✅ |

---

## 13. Privacy / Safety / App Store Considerations

### 13.1 Privacy commitments

```text
no live camera upload
no background upload
no raw frame persistence
no training on user photos without explicit opt-in
no hidden analytics of camera frames
no face recognition
no identity inference
no age / gender / emotion inference
no sensitive attribute inference
no body shaming
no appearance scoring
no beauty score
clear camera permission copy
clear cloud AI distinction for post-capture
retention / deletion policy for future cloud features
consent for any user-contributed training data
```

### 13.2 App Privacy labels

For local-only guidance:

```text
if camera frames / motion / depth stay on device
and are not sent off device
and not stored in readable server-accessible form
→ generally simpler privacy label impact
```

Apple App Privacy Details says data processed only on device is not “collected”; but if a derived result is sent off device, that result must be considered separately.([Apple Developer][3])

For future cloud / training:

```text
photos/videos upload
environment scanning / depth if transmitted or stored
user content
diagnostics / performance logs
```

Apple App Privacy Details explicitly lists Photos or Videos under User Content, and Environment Scanning under Surroundings.([Apple Developer][3])

### 13.3 Consent and data minimization

Apple guidelines require privacy policies to explain collected data, uses, third-party sharing, retention/deletion, and how users revoke consent or request deletion.([Apple Developer][4]) They also require data minimization: request only data relevant to core functionality and collect/use only what is required; where possible, use out-of-process picker/share sheet rather than full Photos/Contacts access.([Apple Developer][4])

This supports:

```text
本地導拍：no upload, no storage
post-capture cloud：explicit consent
imported photo：use picker, not full Photos library unless needed
training data：separate opt-in
```

---

## 14. Technical Architecture Proposal

### 14.1 Components

```text
LocalCameraCoachService
CameraGuidanceSignal
CameraGuidanceSignalProvider

BrightnessSignalProvider
FramingSignalProvider
StabilitySignalProvider
MotionSignalProvider
LensSignalProvider
FilterContextSignalProvider
DepthSignalProvider
LiDARSceneSignalProvider
OnDeviceModelGuidanceProvider

CameraGuidancePriorityResolver
CameraGuidanceAntiFlickerController
CameraCoachViewModel
CameraCoachOverlayView
CameraCoachFixtures
CameraCoachSettings
```

### 14.2 Architecture principles

```text
provider-based
local-only
no upload
no persistence
mock fallback
deterministic fixtures for testing
throttled frame analysis
one final guidance state output
priority + anti-flicker separated
UI does not know raw signal internals
future Core ML provider can be swapped in
future LiDAR provider optional by device capability
```

### 14.3 Data flow

```text
Camera frame / local state
→ signal providers
→ guidance candidates
→ priority resolver
→ anti-flicker controller
→ compact guidance UI
```

### 14.4 Suggested Swift model sketch

```swift
enum CameraGuidanceCategory: String, Codable {
    case lighting
    case framing
    case stability
    case pose
    case filter
    case depth
    case unavailable
}

enum CameraGuidancePriority: Int, Codable {
    case low = 0
    case medium = 1
    case high = 2
    case critical = 3
}

struct CameraGuidanceSignal: Equatable {
    let category: CameraGuidanceCategory
    let confidence: Double
    let timestamp: Date
    let metadata: [String: String]
}

struct CameraGuidanceCandidate: Equatable {
    let id: String
    let category: CameraGuidanceCategory
    let priority: CameraGuidancePriority
    let textKey: String
    let fallbackText: String
    let confidence: Double
    let cooldownKey: String
}

protocol CameraGuidanceSignalProvider {
    var id: String { get }
    func update(context: CameraCoachContext) async -> [CameraGuidanceCandidate]
}
```

### 14.5 Provider examples

```text
BrightnessSignalProvider
- input: downsampled luminance
- output: underexposed / overexposed / normal

FramingSignalProvider
- input: face rectangle / safe subject box
- output: headroom / subject too low / centered

MotionSignalProvider
- input: Core Motion variance
- output: stable / shaky / low-light-shaky

FilterContextSignalProvider
- input: selected filter + brightness bucket
- output: warm / night / street filter hint

DepthSignalProvider
- input: optional depth map
- output: too close / subject-background distance / no-depth

OnDeviceModelGuidanceProvider
- future only
- input: downsampled frame
- output: scene category / composition class
```

### 14.6 Testing fixtures

```text
fixture_dark_room
fixture_bright_window
fixture_face_too_low
fixture_headroom_too_much
fixture_shaky_low_light
fixture_stable_ready
fixture_lidar_subject_close
fixture_no_camera_permission
fixture_simulator_mock
```

---

## 15. Integration with Current App Phases

### 15.1 Existing phase mapping

| Current phase / capability                    | Future local coach mapping                                            |
| --------------------------------------------- | --------------------------------------------------------------------- |
| Phase 15B brightness guidance                 | `BrightnessSignalProvider`                                            |
| Phase 15C face framing / headroom             | `FramingSignalProvider`                                               |
| Phase 15D stability / priority / anti-flicker | `MotionSignalProvider` + `PriorityResolver` + `AntiFlickerController` |
| Phase 16 local/mock AI Snapshot boundary      | `LocalCameraCoachService` / mock fixtures                             |
| Phase 16I post-capture advisor                | stays post-capture, not live cloud                                    |
| Phase 16K-L local heuristic advisor           | `FilterContextSignalProvider` / heuristic recommendation              |
| Phase 16N future AI / premium policy          | Free vs paid local coach policy                                       |

### 15.2 What this research should become

```text
current research: documentation-only
next implementation: local coach architecture refactor
LiDAR: later dedicated prototype
Core ML: much later after dataset/evaluation
do not jump to live cloud AI
```

### 15.3 Relationship with cloud AI boundary

The local coach should not compete with cloud AI; it should reduce cloud dependency. 前一份 backend boundary 已建議 Phase 17 以 one-shot, consent-based, backend-mediated post-capture photo advisor 作 real cloud AI 起點，而不是 live / snapshot / filter-generator-first。

---

## 16. MVP / Future Phase Plan

### LC1 — Research

```text
docs only
source review
local-first policy
LiDAR / Core ML feasibility notes
privacy / safety boundary
```

### LC2 — Local Coach Architecture Refactor

```text
unify existing brightness / framing / stability providers
no new ML
no LiDAR
no upload
no persistence
deterministic fixtures
shared guidance model
```

Deliverables:

```text
LocalCameraCoachService
CameraGuidanceSignalProvider protocol
CameraGuidancePriorityResolver
CameraGuidanceAntiFlickerController
CameraCoachOverlayView
```

### LC3 — More Local Heuristics

```text
horizon / tilt
subject placement
low-light stability
filter-aware guidance
landscape / portrait awareness
deterministic fixtures
```

### LC4 — LiDAR Feasibility Prototype

```text
supported devices only
depth signal only
no cloud
no persistence
no raw depth logging
fallback for non-LiDAR
battery / thermal test
```

### LC5 — On-device Model Dataset Plan

```text
dataset spec
label taxonomy
annotation guide
evaluation metrics
bias / privacy review
no app implementation
```

### LC6 — Core ML Prototype

```text
small local model
throttled inference
downsampled frame input
battery / thermal tests
no cloud
no training on user photos
```

### LC7 — Paid Advanced Local Coach Modes

```text
only after free core stable
optional premium packs
advanced pose packs
LiDAR enhanced packs
language/personality packs
no core paywall
```

---

## 17. Risk Table

| Risk                        | Impact                             | Mitigation                                                |
| --------------------------- | ---------------------------------- | --------------------------------------------------------- |
| bad guidance                | 用戶不信任                              | start heuristic, test fixtures, feedback later            |
| guidance flicker            | UX 煩躁                              | priority resolver + hysteresis + cooldown                 |
| latency                     | 提示過時                               | local-only, downsample, throttle                          |
| battery drain               | 裝置耗電                               | lower frequency, pause when inactive, use low power mode  |
| thermal                     | camera lag / system throttling     | reduce analysis, quiet mode, no continuous ML             |
| frame analysis cost         | preview 卡頓                         | background queue, downsample, avoid per-frame heavy work  |
| LiDAR not available         | 功能不一致                              | capability check + hide depth hints                       |
| depth noise                 | 錯誤距離提示                             | confidence threshold + smoothing + fallback               |
| simulator limitation        | 測試不完整                              | deterministic mock fixtures                               |
| dataset bias                | bad cultural fit                   | curated HK/Asian scenes only with legal rights            |
| bad training labels         | model learns bad advice            | annotation guide + inter-rater agreement                  |
| privacy concern             | 用戶流失 / review risk                 | no live upload, no persistence, clear copy                |
| user photos training risk   | legal / trust risk                 | opt-in only, deletion policy                              |
| App Store rejection risk    | 上架延誤                               | privacy labels, no hidden features, no offensive defaults |
| profanity mode risk         | age rating / objectionable content | opt-in, default off, no identity attacks                  |
| accessibility / distraction | 拍攝受阻                               | compact UI, VoiceOver control, quiet mode                 |
| over-coaching user          | app 變煩                             | intensity setting, one suggestion at a time               |
| free/paid resentment        | 轉化負面                               | basic local coach free; paid for advanced packs           |
| device fragmentation        | inconsistent behavior              | compatibility matrix + runtime checks                     |
| sensitive inference         | safety risk                        | no age/gender/emotion/identity/body score                 |
| live cloud creep            | privacy/cost risk                  | explicit product policy: post-capture cloud only          |

---

## 18. Final Recommendation

清楚建議：

1. **短期不要做 live cloud AI。**
   Continuous viewfinder upload 成本、延遲、私隱、電量、thermal 和 App Store trust 風險都太高。

2. **短期繼續 local heuristic / rule-based guidance。**
   Brightness、face rectangle framing、headroom、stability、filter context、pose overlay 已足夠形成有感 camera coach。

3. **下一個 implementation 最安全是 Local Coach Architecture Refactor。**
   把現有 brightness / framing / stability / priority / anti-flicker 統一成 provider-based architecture。

4. **LiDAR 要獨立 research / prototype。**
   LiDAR 只作 depth-enhanced guidance，不應是 MVP 依賴；非 LiDAR device 必須完整 fallback。

5. **Core ML 本地模型要等 dataset strategy 完成。**
   先定義 label taxonomy、evaluation metrics、privacy policy，再做小模型 prototype。

6. **Post-capture cloud AI 才是第一個適合接真雲端 AI 的位置。**
   這與前一份 cloud boundary research 一致：post-capture photo advisor 是 one-shot、user-triggered、consent-based、可 fallback 的 cloud AI 起點。

7. **本地導拍應成為 app 長期核心差異化功能。**
   它比「AI chat」更貼近 camera-first retro app：即時、短句、不阻礙拍攝。

8. **免費用戶應得到 basic local coach。**
   基本 camera / brightness / framing / stability 不應被付費牆阻擋。

9. **付費可加 advanced local modes，但不要阻擋基本拍攝。**
   Advanced LiDAR packs、advanced pose packs、premium language/personality packs、advanced scene modes 可作 premium。

### 下一個 Codex implementation prompt

```text
Implement LC2 — Local Coach Architecture Refactor for the iOS retro camera app.

Scope:
- Documentation and local-only implementation only.
- No cloud AI.
- No backend.
- No Firebase / Gemini / OpenAI imports.
- No upload.
- No persistence of camera frames.
- No Core ML model.
- No LiDAR implementation yet.
- Keep existing camera-first SwiftUI UX.
- Keep Phase 16 mock-only AI Snapshot boundary intact.

Add:
- LocalCameraCoachService
- CameraGuidanceSignal
- CameraGuidanceSignalProvider protocol
- BrightnessSignalProvider wrapping existing brightness guidance
- FramingSignalProvider wrapping existing face rectangle / headroom guidance
- StabilitySignalProvider wrapping existing stability guidance
- FilterContextSignalProvider for selected filter / style hints
- CameraGuidancePriorityResolver
- CameraGuidanceAntiFlickerController
- CameraCoachViewModel
- CameraCoachOverlayView compact chip

Requirements:
- One active guidance item at a time.
- Anti-flicker cooldown.
- Confidence threshold.
- Quiet mode setting placeholder.
- Language mode placeholder: normal / zh-Hant / hk_cantonese / troublemaker_opt_in.
- No sensitive inference.
- No identity recognition.
- No age / gender / emotion inference.
- No appearance / beauty scoring.
- Deterministic fixtures for simulator and tests.
```

---

## 19. Sources / Links

1. Apple — AVFoundation overview: AVFoundation framework, capture session / camera sample / LiDAR depth capture resources. ([Apple Developer][9])
2. Apple — AI & Machine Learning overview: on-device machine learning, Vision, Core ML, Core AI. ([Apple Developer][1])
3. Apple — Augmented Reality overview: ARKit / RealityKit for AR experiences. ([Apple Developer][2])
4. Apple — Core Image Programming Guide archive: near-real-time still/video image processing, built-in filters, feature detection, filter chaining. ([Apple Developer][6])
5. Apple — Core Image Filter Reference: built-in filters including color adjustment, exposure, histogram/reduction, temperature/tint, vignette. ([Apple Developer][7])
6. Apple — Energy Efficiency Guide for iOS Apps: motion updates, accelerometer/gyroscope/device motion, update frequency and battery. ([Apple Developer][5])
7. Apple — App Store Review Guidelines: safety, objectionable content, energy/thermal expectations, privacy policy, consent, data minimization. ([Apple Developer][4])
8. Apple — App Privacy Details: Photos/Videos, Environment Scanning, on-device-only data not collected, disclosure duties. ([Apple Developer][3])
9. Apple — Vision API docs pages for face rectangles / human body pose / horizon requests. ([Apple Developer][11])
10. ARKitScenes paper: RGB-D dataset captured using mobile depth sensors, relevant for future depth dataset planning. ([arXiv][10])
11. ARKitTrack paper: RGB-D tracking dataset captured with consumer-grade LiDAR scanners, relevant for future LiDAR/depth research. ([arXiv][12])
12. Uploaded previous project report — Cloud AI Architecture / Real AI Backend Boundary, used here only as project-context continuity for the post-capture cloud boundary and no-live-stream recommendation. 

[1]: https://developer.apple.com/machine-learning/ "AI & Machine Learning   - Apple Developer"
[2]: https://developer.apple.com/augmented-reality/ "Augmented Reality - Apple Developer"
[3]: https://developer.apple.com/app-store/app-privacy-details/ "App Privacy Details - App Store - Apple Developer"
[4]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines - Apple Developer"
[5]: https://developer.apple.com/library/archive/documentation/Performance/Conceptual/EnergyGuide-iOS/MotionBestPractices.html "Energy Efficiency Guide for iOS Apps: Reduce the Frequency of Motion Updates"
[6]: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Conceptual/CoreImaging/ci_intro/ci_intro.html "About Core Image"
[7]: https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/ "Core Image Filter Reference"
[8]: https://developer.apple.com/documentation/vision/vndetecthumanbodyposerequest "VNDetectHumanBodyPoseRequest | Apple Developer Documentation"
[9]: https://developer.apple.com/av-foundation/ "AVFoundation Overview - Apple Developer"
[10]: https://arxiv.org/abs/2111.08897 "ARKitScenes: A Diverse Real-World Dataset For 3D Indoor Scene Understanding Using Mobile RGB-D Data"
[11]: https://developer.apple.com/documentation/vision/vndetectfacerectanglesrequest "VNDetectFaceRectanglesRequest | Apple Developer Documentation"
[12]: https://arxiv.org/abs/2303.13885 "ARKitTrack: A New Diverse Dataset for Tracking Using Mobile RGB-D Data"
