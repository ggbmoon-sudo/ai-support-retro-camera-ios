# AI Support 復古拍照 App UI/UX、頁面流程與 Design System 報告

這份報告以你已經確定的技術與產品邊界為前提，不重新推翻主架構，而是直接把 **Swift + SwiftUI 的 iOS-first MVP** 轉成可以交給 Codex 落地的 UI/UX 規格。結論先講：**UI 技術建議直接採用 SwiftUI，最低支援版本建議設為 iOS 17**。原因不是因為 Flutter 或 React Native 做不到，而是 Apple 已明確把 SwiftUI定位為建立新 App 的最佳選擇；你的 MVP 又同時需要 `NavigationStack`、`PhotosPicker`、`SignInWithAppleButton`、`StoreKit` 的商店視圖，以及與 `AVFoundation` / `Vision` 的原生整合，SwiftUI 會是最少橋接層、最少外掛、最容易讓 Codex 按檔案分段生成的方案。`PhotosPicker` 自 iOS 16 可用，`SubscriptionStoreView` 則是 iOS 17 起可用；若把最低版本直接設到 iOS 17，可以明顯減少支付頁與權限流程的兼容複雜度。citeturn18search22turn18search0turn0search2turn1search0turn9search10turn12search1

你的產品在 UI 上最重要的，不是「做得像某個底片相機 App」，而是把三件事做清楚：**拍照優先、AI 不干擾構圖、付費牆不阻擋基本拍照能力**。Apple 的 Human Interface Guidelines 強調清楚的視覺層級、可適應不同情境的版面、以及在沉浸式媒體場景中讓介面退到背景；Dark Mode 也特別提到，對媒體檢視類體驗，深色外觀能讓 UI recede、讓內容成為重點。這非常適合你的相機頁：相機預覽是主體，文字提示、AI 建議、格線與框線都應是次要層。citeturn7search0turn7search3turn0search1turn6search3

此外，登入、AI 同意、訂閱、刪除帳號這四個高風險流程，不能只靠一堆按鈕堆在設定頁。Apple 對帳號刪除有明確要求：如果 App 支援建立帳號，就必須讓使用者能在 App 內發起刪除；App Store Connect 也要求所有 App 提供隱私政策網址。你的 UI 必須把這些入口做成可找得到、可理解、可完成，而不是藏在多層設定深處。citeturn8search0turn8search1turn8search4turn8search6

## 設計結論與實作前提

### 推薦的 UI 技術與最低版本

建議直接用 **SwiftUI 作為唯一 UI 輸出目標**，並採用以下組合：

- UI 框架：SwiftUI
- 導航：`TabView` + 每個分頁內的 `NavigationStack`
- 相機：`AVFoundation`，以 `UIViewRepresentable` 包裝 `AVCaptureVideoPreviewLayer`
- 相簿匯入：`PhotosPicker`
- 支付頁：`SubscriptionStoreView` 為主，必要時輔以自訂說明區塊
- Sheet/Bottom Sheet：SwiftUI `.sheet`
- 本地化：Xcode String Catalog
- 無障礙：SwiftUI accessibility modifiers + Dynamic Type + VoiceOver

這樣選的最大價值，是直接吃到 Apple 原生元件的語義、可及性、深色模式、本地化與商店流程。Apple 官方說明中，`TabView` 在 iPhone 緊湊尺寸下會出現底部 tab bar；`NavigationStack` 是新的導航結構；`sheet` 是標準的模態呈現方式；`SubscriptionStoreView` 會自動展示**本地化名稱、描述、價格與購買按鈕**。citeturn18search14turn18search0turn18search7turn1search0turn1search14

### 相機頁實作前提

相機頁不要試圖「純 SwiftUI 直接渲染相機預覽」。Apple 的 `AVCam` 範例與 `AVCaptureVideoPreviewLayer` 文件都明確指出，預覽層是 Core Animation layer；SwiftUI 不能直接承接這個 layer，所以官方範例是把它包進 `UIView` 裡，再由 SwiftUI 透過 `UIViewRepresentable` 承載。這件事在架構上要先定死，否則 Codex 很容易生成一個能 compile 但不能穩定顯示相機預覽的版本。citeturn13search12turn13search0

### AI 與隱私的 UI 前提

你當前的 MVP AI provider 是 Gemini paid tier，且 App 內不能保存 API key，這與最佳實務一致。對 UI 而言，這意味著：

- **第一次 AI 分析前一定要出 consent sheet**
- 文案重點是「照片會送到第三方 AI 服務分析」
- 不應預設要求用戶同意模型訓練
- `trainingConsent` 預設應為 `false`
- 若未來接 OpenAI API，其 API 平台資料預設也不是拿來訓練模型，除非你顯式 opt-in；Gemini 的付費層官方也明示 prompts / responses 不用於改善 Google 產品

因此，MVP 的隱私介面應呈現為 **分析同意**，而不是 **訓練同意**。如果 UI 一開始就強迫用戶勾選「同意拿照片訓練模型」，反而會與目前 provider 的官方資料處理政策不一致，也會增加審核與信任風險。citeturn16search5turn16search1turn15search0turn15search7

### MVP、MVP+、Future 在 UI 上的分界

| 範圍 | UI 應提供 | 不應在這階段做的事 |
|---|---|---|
| MVP | Onboarding、登入、首頁 preset 選擇、全螢幕相機、單張預覽、AI 結果 sheet、歷史、設定、訂閱頁雛形、刪除照片、刪除帳號 | 連續即時 AI 串流、3D 骨架疊圖、複雜編輯工作室 |
| MVP+ | 上一張照片推下一張姿勢、局部 overlay 提示、VIP 追問入口、更多 preset 篩選 | 真正雲端 video streaming AI |
| Future | Pose library、即時 AI overlay、半格機與雙重曝光的完整體驗、高級相機/鏡頭庫 | 社交 feed、沉重社群系統 |

## 資訊架構與導航模型

### 建議的導航骨架

整個 App 建議採用 **三層導航模型**：

**根節點**：`AppRootView`  
→ `OnboardingFlowView` / `AuthGateView` / `MainTabShellView`

**MainTabShellView**：`TabView`
- `HomeView`
- `HistoryView`
- `SettingsView`

**模態頁 / 全螢幕頁**
- `CameraView` 以 `.fullScreenCover` 打開
- `FilmPresetPickerSheet`
- `AIResultSheet`
- `PermissionEducationSheet`
- `PaywallSheet`
- `DeleteAccountSheet`

這樣做的原因是：`TabView` 在 iPhone 上天然就是底部 tab bar，適合放 Home / History / Settings 這種穩定入口；相機則應該是沉浸式全螢幕體驗，不應被 tab bar 長期佔住底部空間。`NavigationStack` 適合各分頁自己的層級推進，例如從 History 進入 Photo Detail，或從 Settings 進入 Subscription / Privacy / Delete Account。citeturn18search14turn18search2turn18search4

### 主要頁面 IA

以下是建議的資訊架構。這份 IA 是 **SwiftUI 優先**，但概念上也足夠抽象，可讓 Codex 或開發者轉成 Flutter / React Native。

| 群組 | 頁面 | 路由型態 | MVP 狀態 |
|---|---|---|---|
| 首次體驗 | Onboarding | full screen flow | 必做 |
| 首次體驗 | Login / Register | push or full screen | 必做 |
| 核心拍攝 | Home | tab root | 必做 |
| 核心拍攝 | Camera | fullScreenCover | 必做 |
| 核心拍攝 | Camera Library | push from Home | MVP+ 可先簡化 |
| 核心拍攝 | Lens / Film Preset Picker | sheet | 必做 |
| 核心拍攝 | AI Suggestion Overlay | overlay layer | MVP 只做靜態框架 / feature flag |
| 核心拍攝 | Photo Preview | push / replace inside Camera flow | 必做 |
| 核心拍攝 | AI Result Bottom Sheet | sheet | 必做 |
| 管理 | History | tab root | 必做 |
| 管理 | Settings | tab root | 必做 |
| 管理 | Subscription | push or sheet | 必做 |
| 管理 | Account / Data Deletion | push | 必做 |

### 首次流程與登入策略

Onboarding 不要一打開就塞滿登入表單。Apple 對 Sign in with Apple 的 HIG 建議是：**只有在能交換到明確價值時才請人登入**。所以你的 Onboarding 應先說清楚「登入後可同步相片、保留歷史、領每日分析額度、跨裝置使用」，再進入 Auth 畫面。Auth 頁面則直接提供 email/password、Google、Apple 三種入口，其中 Apple login 用原生 `SignInWithAppleButton`。Firebase 官方也提供 Apple、Google、email/password 在 Apple 平台的整合文件。citeturn9search9turn9search10turn9search2turn9search3turn9search4turn9search6

### 離線與快取狀態如何反映在 UI

Cloud Firestore 在 Apple 平台預設就支援離線資料持久化，這表示 History 頁、Settings 中的 quota 狀態、近期 AI 結果摘要可以在離線時讀到快取資料。UI 上不應把「離線」當成整頁不可用，而是應採單一橫幅或徽章方式提示：**可瀏覽快取內容，但上傳 / AI 分析 / 刪除同步可能延後**。citeturn3search1turn10search2turn10search6

## 頁面線框與互動規格

### 首次體驗與首頁頁面

| 頁面 | 頁面目的 | 主要元件 | 用戶操作 | 狀態 | Error / Empty | Premium Gate |
|---|---|---|---|---|---|---|
| Onboarding | 解釋產品價值與 AI 分析邏輯 | 3 張全屏卡、跳過、開始使用 | 左右滑或按下一步 | 初次開啟、已看過 | 無網路不影響 | 不出現 |
| Login / Register | 建立帳號或登入 | Logo、email 欄位、password 欄位、Apple、Google、切換登入/註冊 | 輸入、第三方登入 | loading、成功、失敗 | 錯誤訊息 inline 顯示 | 不出現 |
| Home | 讓用戶快速選 preset 然後開拍 | 頂部 quota badge、主 preset hero、preset shelf、從相簿匯入、最近一次拍攝快捷 | 選 preset、開相機、匯入、進入付費頁 | free / vip / quota low | 首次使用顯示教學卡 | 僅高級 preset 顯示鎖頭，不擋免費 preset |

### 拍攝與結果頁面

| 頁面 | 頁面目的 | 主要元件 | 用戶操作 | 狀態 | Error / Empty | Premium Gate |
|---|---|---|---|---|---|---|
| Camera | 進行單張拍攝或匯入 | 全屏 preview、關閉、grid toggle、preset selector、PhotosPicker、shutter、AI analyze 入口 | 拍照、切換格線、切換 preset、開相簿 | live、capturing、permission denied | 相機不可用時改顯示教育頁 | 不阻擋基本拍照 |
| Lens / Film Preset Picker | 快速切換 preset | 底部 sheet、使用中標記、free / premium 分類 | 點擊套用 | open / selected | 無 | 點 premium 才出 paywall |
| Photo Preview | 確認剛拍的單張結果 | 大圖預覽、retake、analyze、save、preset 再套用、簡單調整入口 | 保存、重新拍、分析 | ready、analyzing、saved | 儲存失敗 toast | free 保存上限才彈 paywall |
| AI Result Bottom Sheet | 顯示 summary、最多 3 條 advice、adjustments | summary 區塊、advice list、adjustment chips、再拍一次、保存 | 閱讀、收起、再拍、保存 | loading、success、timeout、malformed response | timeout 顯示重新分析 | free 次數用完才 gate |

### 歷史、設定與付費頁面

| 頁面 | 頁面目的 | 主要元件 | 用戶操作 | 狀態 | Error / Empty | Premium Gate |
|---|---|---|---|---|---|---|
| History | 看已保存照片與過去 AI 建議 | grid、篩選 chips、quota banner、空態插畫、photo card | 查看詳情、刪除、下載、本地保存 | loading、offline cached、vip/original | 無歷史時顯示 CTA 回首頁 | 到 20 張上限時顯示升級或刪除 |
| Settings | 管理帳號、AI、隱私、語言 | account card、quota 摘要、manage subscription、privacy links、delete account | 查看政策、管理訂閱、切換語言、刪除帳號 | signed in / signed out | 無網路時保留本地資訊 | VIP 權益入口可在此展示 |
| Subscription | 展示免費與 VIP 差異並完成訂閱 | feature comparison、`SubscriptionStoreView`、restore、manage | 購買、恢復、管理 | loading、eligible / not eligible | 取價失敗顯示 fallback 文案 | 核心 gate 頁 |
| Account / Data Deletion | 符合規範地刪除帳號與資料 | 風險說明、再次驗證、刪除按鈕、訂閱提醒 | 重新驗證、刪除 | in progress、done | 錯誤時可重試 | 不出現 |

### 首頁的原創視覺方向

首頁可以借用「先選相機 preset 再開拍」這個**心理模型**，但視覺語言應完全原創。建議採用 **Editorial Film Shelf** 風格：上半部是一張主打 preset 卡片，下半部是橫向底片卡架，不做仿真相機機身，也不複製 Dazz 類產品常見的硬體 skeuomorphism。卡片以字體階層、色塊、樣張、少量顆粒質感與標籤資訊表達氣質，而不是假裝是實體相機機面。這樣更容易維持專業感，也更利於後續擴充 preset 與 premium 標記。

### 相機頁為什麼應該極簡

相機頁的工作不是教育，而是**拍到一張圖**。因此 live preview 狀態下只保留必要控制：關閉、grid、preset selector、PhotosPicker、shutter。`save` 應移到拍完後的 `PhotoPreviewView`，避免在 live 狀態出現沒有上下文的空按鈕。這個取捨也符合你「AI 建議不能干擾構圖」的產品前提。

## 相機與 AI 支援介面

### 相機頁的詳細設計

相機頁建議拆成兩個 UI 狀態，而不是一個頁面塞滿所有動作。

#### Live Capture 狀態

版面自上而下：

- 頂部安全區細條控制列  
  - 左：關閉  
  - 中：目前 preset pill  
  - 右：grid toggle

- 中央全屏預覽  
  - `CameraPreviewView`
  - 可疊上 rule-of-thirds grid
  - MVP 不疊複雜 AI overlay

- 底部控制區  
  - 上層：`PresetSelectorStrip`
  - 下層：左 `PhotosPickerButton`，中 `ShutterButton`，右 `AnalyzeCurrentFrameButton`（MVP 可先 disable 或當作拍後分析捷徑文案）

整個預覽層由 `AVCaptureVideoPreviewLayer` 提供，SwiftUI 外層只負責 chrome 與 overlay，而不是自己畫相機影像。citeturn13search12turn13search0turn0search3

#### Captured Preview 狀態

拍照或匯入完成後，切到 `PhotoPreviewView`：

- 頂部：返回 / Retake
- 圖片預覽：可縮放但 MVP 可先不做捏合
- 底部動作列：`Analyze`、`Save`、`Adjust`
- 次層：目前 preset 標記與簡單數值微調入口

這個狀態才是 AI 分析與保存的正確位置，因為使用者已經有了要分析的單張照片。

### AI 建議 UI 的三種呈現方式

#### 拍完後 bottom sheet

這是 **MVP 主形態**。建議檔案：

- `AIResultSheet.swift`
- `AIAdviceRow.swift`
- `AdjustmentChipRow.swift`

內容固定為：

- 1 句 summary
- 最多 3 條 advice
- adjustments chips
- CTA：`再拍一次`、`保存`

這種 UI 和你的 AI contract 最匹配，也最容易控制 token 成本、畫面密度與解析錯誤處理。Gemini 與 OpenAI 目前都支援依 JSON Schema 輸出結構化資料，因此 UI 可以直接綁定固定欄位，而不是依賴自然語言解析。citeturn17search1turn17search7turn17search0

建議的 UI 對應 view model：

```swift
struct AIResultViewData: Identifiable {
    let id: String
    let summary: String
    let advices: [String]
    let adjustments: [AdjustmentChip]
    let shortUserMessage: String?
    let languageCode: String
    let warningMessage: String?
}
```

#### 相機預覽中的簡短 overlay

這是 **MVP+**。不要一開始就接雲端 AI 逐秒分析。可先用本地規則與 Vision 的輕量資訊做提示，例如：

- 主體太靠邊
- 地平線偏斜
- 臉太接近邊界
- 畫面過暗 / 過亮

Apple 的 Vision 框架可以做人臉框與人體姿勢偵測，2D 人體姿勢可識別最多 19 個 body points；3D 人體姿勢則是從 iOS 17 起提供 17 個 3D joints。你的共用背景已明確說 MVP 不做複雜骨架追蹤，所以建議只把這些能力用於**輕量對齊提示**，不要把它包裝成「精準 AI 姿勢教練」。citeturn2search0turn2search3turn13search7

建議 UI 元件：

- `AIHintBubble.swift`
- `FaceFrameOverlayView.swift`
- `HorizonGuideView.swift`
- `PoseGuideOverlayView.swift`（MVP 先 stub）

#### VIP 聊天式建議

這是 **Future / VIP**。不應在 MVP 做成完整聊天主場景。較好的做法是：在 `AIResultSheet` 右上角先預留 `追問` 入口，未開啟時顯示為 disabled badge；未來再接 `AIChatFollowupSheet`。這樣不會讓 MVP 的資訊架構被聊天模型綁架。

### AI overlay 怎麼做到不擋畫面

遵守三個規則：

- 任何文字提示都只允許一行，超過就折疊成 icon + 點擊展開
- overlay 永遠放在安全區附近，不壓在主體臉部中心
- grid、frame、pose 線條的透明度要比 UI chrome 更低

這種做法也符合 HIG 的層級與媒體優先原則：內容是主角，控制與輔助只做引導。citeturn7search0turn7search3turn0search1

### AI 結果頁與 Cloud Function contract

UI 端建議只依賴一個穩定 contract，例如：

**Callable Function 名稱**：`analyzePhoto`

**建議 input**
```json
{
  "photoId": "string",
  "language": "zh-Hant | en",
  "presetId": "string",
  "captureMode": "portrait | food | scenery",
  "userTier": "free | vip"
}
```

**建議 output**
```json
{
  "analysisId": "string",
  "summary": "string",
  "advices": ["string", "string", "string"],
  "adjustments": {
    "exposure": -10,
    "contrast": 8,
    "warmth": 6,
    "saturation": 4
  },
  "nextShotInstruction": "string",
  "warningMessage": "string | null",
  "language": "zh-Hant"
}
```

Firebase 的 callable functions 會自動在請求中附帶 Firebase Auth 與 App Check token，並自動處理 request body 的序列化與驗證；這很適合你的 Analyze 按鈕，因為 client 可以保持簡單，server 端再去路由 Gemini / OpenAI adapter。citeturn22search2turn22search0turn3search7

## 歷史、訂閱與隱私流程

### 歷史紀錄頁設計

History 頁不是相簿，而是 **「已保存照片 + 分析紀錄索引」**。建議由兩層組成：

- 頂部摘要區  
  - `QuotaBadge`
  - `CloudPhotoUsageBar`
  - `FilterChipRow`

- 內容區  
  - `PhotoGrid`
  - 每張卡片顯示：縮圖、preset 名、是否已分析、日期
  - 長按或進入 detail 後才顯示刪除與下載

因為 Firestore 在 Apple 平台有離線持久化，你可以讓歷史頁在離線時正常顯示快取縮圖與 metadata，只在頁頂加一條簡短 offline banner。這種設計比整頁 error state 更貼近使用者預期。citeturn3search1turn10search2turn10search6

建議檔案：

- `HistoryView.swift`
- `PhotoGridView.swift`
- `PhotoCardView.swift`
- `PhotoDetailView.swift`
- `OfflineBanner.swift`

### 免費 20 張限制如何在 UI 呈現

免費用戶限制不應只在儲存當下才突然報錯。建議三個節點都提示：

- Home 頂部 quota badge：`12 / 20 已保存`
- History 頂部 usage bar：靠近上限時變色
- Save 前 confirmation bar：若已達上限，直接給兩個 CTA  
  - `刪除舊照片`
  - `升級 VIP`

這樣 paywall 只會因為**保存上限**而出現，不會阻擋基本相機與基本濾鏡，符合你已定的商業邊界。

### 訂閱頁設計

若最低版本採 iOS 17，訂閱頁最省事的做法是：

- 頁首自訂品牌區塊：說明什麼是 VIP
- 中段 feature comparison
- 下段直接嵌 `SubscriptionStoreView`
- 頁尾加上：
  - `Restore Purchases`
  - `Manage Subscription`
  - `Terms`
  - `Privacy Policy`

`SubscriptionStoreView` 會自動載入本地化名稱、描述、價格與購買按鈕，且可自訂外觀去貼近你的品牌。使用者在管理訂閱時，可用 `showManageSubscriptions(in:)` 直接在 App 內叫出系統管理頁。citeturn1search0turn1search14turn11search1turn21search1

付費比較文案建議固定為：

| 免費 | VIP |
|---|---|
| 基本相機 | 基本相機 + 高級 preset |
| 基本濾鏡 | 更多濾鏡與高級 preset |
| 20 次起始分析 + 每日登入 1 次 | 更多分析次數 |
| 最多保存 20 張雲端圖 | 更高或近似無限保存量 |
| 預覽壓縮圖 | 支援原圖保存 |
| 無 VIP 追問 | 未來可追問 |

### 設定頁與隱私中心

設定頁建議拆成五個 section：

- Account
- Storage & Quota
- AI & Privacy
- Subscription
- Support

其中 `AI & Privacy` 應該包含：

- `AI 分析同意狀態`
- `目前未啟用模型訓練分享`
- `Privacy Policy`
- `User Privacy Choices`
- `刪除單張照片`
- `刪除帳號與資料`

App Store Connect 要求所有 App 提供 Privacy Policy URL；另外也有 `User Privacy Choices URL` 可選填，適合你放一個公開頁面說明資料刪除、同意撤回、聯絡方式。citeturn8search1turn8search2turn8search5

### 帳號刪除頁的必要內容

Apple 已要求支援帳號建立的 App 必須讓用戶能在 App 內發起刪除，因此你的 `DeleteAccountView` 不只是 nice-to-have，而是審核關鍵。這頁應包含：

- 刪除後會失去什麼
- 刪除是否影響已保存圖片與分析紀錄
- 若有訂閱，提醒先管理 / 取消訂閱
- 可要求重新驗證
- 明確區分「登出」與「刪除帳號」

如果用戶有自動續訂訂閱，Apple 的官方說明也建議在刪除流程中說明如何管理訂閱，避免刪除帳號後仍被誤收費。citeturn8search0turn8search3turn8search6turn11search1

### AI 同意 sheet 的建議文案骨架

`ConsentSheet.swift` 建議顯示以下固定段落：

- 你的照片會透過安全的伺服器端流程傳送到第三方 AI 服務以提供拍攝建議。
- App 裝置端不會保存第三方 AI API key。
- 目前 MVP 不會預設將你的照片提交做模型訓練。
- 你可以不開啟 AI，仍然使用基本相機與濾鏡。
- 你可以在設定頁刪除照片與帳號資料。

這個 UI 方向同時符合你自己的產品邊界，也與目前 Gemini paid tier / OpenAI API 的官方資料政策一致。citeturn16search5turn16search1turn15search0turn15search7

## Design System 與元件規格

### 設計原則

你的 Design System 建議以六個原則落地：

| 原則 | 實作含義 |
|---|---|
| 簡潔 | 相機頁只保留必要控制；不做過多文字解釋 |
| 專業 | 不做過度可愛化 AI；用字克制、結構明確 |
| 復古底片感 | 用色、顆粒、字體節奏營造，不用仿冒實體 UI |
| 拍照優先 | 預覽區最大化，控制列最小化 |
| AI 不干擾構圖 | AI 建議一行化、可收合、避開主體 |
| 深色優先 | Camera flow 採 dark-first；Settings / History 同時支援 light/dark |

Apple 的 HIG 對 color、materials、typography、accessibility 都有明確原則：使用可適應不同 appearance mode 的顏色、用語義去選材質而不是只看顏色、保持字體可讀性、確保對比。這意味著你的「復古」不應靠低對比與一堆 faux texture 去做，而應建立在**高對比深色基底 + 有節制的 vintage accent** 上。citeturn6search3turn7search6turn7search1turn6search4

### Design Tokens

#### 色彩

建議語義化 token，不要在畫面裡直接散落 hex 值。

| Token | 建議值 | 用途 |
|---|---|---|
| `bg.primary` | `#0D0C0B` | 主背景，camera / history dark 背景 |
| `bg.secondary` | `#151311` | 卡片背景 |
| `bg.tertiary` | `#201C18` | bottom sheet / pickers |
| `text.primary` | `#F5F1EA` | 主文字 |
| `text.secondary` | `#B8AEA3` | 次文字 |
| `text.inverse` | `#111111` | 淺底深字 |
| `accent.vintage` | `#C88A4D` | 復古銅色重點 |
| `accent.filmGreen` | `#8C9D84` | 次重點 |
| `status.success` | `#7AB07D` | 儲存成功 |
| `status.warning` | `#D6A85C` | quota 低於 20% |
| `status.error` | `#E46C5C` | 刪除 / 失敗 |

實作檔案：
- `AppColors.swift`
- `Color+Theme.swift`

#### 字體層級

Apple 建議優先用系統字體，因為它本身已支援大量語言與權重，並與平台整體視覺一致。這對你的中英文雙語產品尤其重要。citeturn7search1turn6search1

| Token | 建議樣式 |
|---|---|
| `display.l` | 32 / semibold |
| `title.1` | 28 / semibold |
| `title.2` | 22 / semibold |
| `body` | 17 / regular |
| `body.emphasis` | 17 / medium |
| `caption` | 13 / regular |
| `micro` | 11 / medium |

實作檔案：
- `AppTypography.swift`
- `Font+Theme.swift`

#### 間距、圓角、陰影

| Token | 值 |
|---|---|
| `space.xs` | 4 |
| `space.sm` | 8 |
| `space.md` | 12 |
| `space.lg` | 16 |
| `space.xl` | 24 |
| `space.2xl` | 32 |
| `radius.sm` | 10 |
| `radius.md` | 16 |
| `radius.lg` | 24 |
| `radius.pill` | 999 |

陰影只用於卡片與 sheet，不要用在 live camera chrome。  
實作檔案：
- `AppSpacing.swift`
- `AppCornerRadius.swift`
- `Shadow+Theme.swift`

#### 材質與 icon style

Overlay 與 bottom sheet 建議用系統 material，而不是自己畫假的玻璃。Apple HIG 明確建議根據語義用途選材質，而不是只看它看起來的顏色。Icon 方面，建議優先採用 SF Symbols，因其與 San Francisco 字體整合，且官方目前已提供超過 6,900 個 symbols。citeturn7search6turn6search1turn6search2

### 元件清單

| 元件 | 建議檔名 | 用途 |
|---|---|---|
| PrimaryButton | `PrimaryButton.swift` | 主要 CTA |
| IconButton | `IconCircleButton.swift` | 相機關閉、grid、設定等 icon-only 操作 |
| CameraPresetCard | `CameraPresetCard.swift` | 首頁大張 preset 卡 |
| FilmPresetCard | `FilmPresetCard.swift` | picker 內的 preset 卡 |
| PresetSelectorStrip | `PresetSelectorStrip.swift` | 相機底部 preset 橫向列 |
| ShutterButton | `ShutterButton.swift` | 拍攝主按鈕 |
| AIHintBubble | `AIHintBubble.swift` | 一行簡短提示 |
| AIResultSheet | `AIResultSheet.swift` | AI 結果 bottom sheet |
| QuotaBadge | `QuotaBadge.swift` | 分析剩餘次數 / 雲端張數 |
| PremiumGateView | `PremiumGateView.swift` | 升級引導 |
| PhotoGrid | `PhotoGridView.swift` | 歷史與多圖 grid |
| SettingsRow | `SettingsRow.swift` | 設定列 |
| SubscriptionPlanCard | `SubscriptionPlanCard.swift` | 免費 / VIP 比較卡 |
| ConsentSheet | `ConsentSheet.swift` | AI 分析同意 |
| OfflineBanner | `OfflineBanner.swift` | 離線提示 |
| EmptyStateView | `EmptyStateView.swift` | 空態頁 |

### 本地化策略

Xcode 的 String Catalog 會自動追蹤本地化字串，也支援複數與不同裝置變體；SwiftUI 也提供本地化提示能力。因此建議直接使用 `Localizable.xcstrings`，不要回退到分散的 `.strings` 檔。citeturn2search2turn2search5

建議 key 命名規則：

- `onboarding.title.capture_better`
- `auth.button.sign_in`
- `home.section.presets`
- `camera.button.shutter`
- `ai.result.summary_title`
- `history.banner.storage_limit`
- `settings.privacy.ai_consent`
- `subscription.feature.original_photo_save`

範例字串：

| Key | zh-Hant | en |
|---|---|---|
| `camera.button.analyze` | AI 分析 | Analyze |
| `camera.button.retake` | 再拍一次 | Retake |
| `history.banner.storage_limit` | 你已接近免費保存上限 | You’re close to the free storage limit |
| `privacy.ai_consent.body` | 照片將傳送至第三方 AI 服務作分析 | Photos will be sent to a third-party AI service for analysis |

AI 回答跟隨用戶語言的做法，建議不要只靠 system locale；而是將 app current language 明確傳到 `analyzePhoto` request 中。

### Accessibility

SwiftUI 內建很多 accessibility 能力，但相機型 App 仍需要手動補足。Apple 明確建議用 VoiceOver、Voice Control 等功能實測，並使用 accessibility modifiers；HIG 也強調對比度必須足夠。citeturn1search6turn1search12turn1search16turn6search4

你的 UI 需要落實以下規則：

- 所有 icon button 都要有 `accessibilityLabel`
- `ShutterButton` 要有清楚 label 與 hint
- Dynamic Type 放大時，Camera chrome 仍維持 icon 為主，但要保留語義標籤
- 不只用顏色表示狀態，例如 quota 警告要同時有 icon / 文字
- overlay 純裝飾線條可 `accessibilityHidden(true)`
- History 卡片要能唸出日期、preset、是否已分析
- 深色模式下確保文字與卡片對比足夠

## Codex 實作藍圖與驗收標準

### 建議的 UI 檔案結構

```text
ios-app/
  App/
    RetroCoachApp.swift
    AppRootView.swift
    MainTabShellView.swift

  DesignSystem/
    Tokens/
      AppColors.swift
      AppTypography.swift
      AppSpacing.swift
      AppCornerRadius.swift
    Components/
      PrimaryButton.swift
      IconCircleButton.swift
      QuotaBadge.swift
      OfflineBanner.swift
      EmptyStateView.swift
      PremiumGateView.swift
    Cards/
      CameraPresetCard.swift
      FilmPresetCard.swift
      SubscriptionPlanCard.swift
      PhotoCardView.swift

  Features/
    Onboarding/
      OnboardingFlowView.swift
      OnboardingPageView.swift
    Auth/
      AuthView.swift
      EmailAuthForm.swift
      AppleSignInButtonRow.swift
      GoogleSignInButtonRow.swift
    Home/
      HomeView.swift
      CameraLibraryView.swift
      HomeViewModel.swift
    Camera/
      CameraView.swift
      CameraPreviewView.swift
      PreviewViewRepresentable.swift
      CameraOverlayChrome.swift
      ShutterButton.swift
      PresetSelectorStrip.swift
      FilmPresetPickerSheet.swift
      PermissionEducationSheet.swift
      CameraViewModel.swift
    Preview/
      PhotoPreviewView.swift
      AdjustmentPanelView.swift
      PhotoPreviewViewModel.swift
    AI/
      AIResultSheet.swift
      AIHintBubble.swift
      AIAdviceRow.swift
      AdjustmentChipRow.swift
      ConsentSheet.swift
      AIResultViewModel.swift
    History/
      HistoryView.swift
      PhotoGridView.swift
      PhotoDetailView.swift
      HistoryViewModel.swift
    Settings/
      SettingsView.swift
      PrivacyCenterView.swift
      DeleteAccountView.swift
      SettingsViewModel.swift
    Subscription/
      SubscriptionView.swift
      RestorePurchasesButton.swift
      SubscriptionViewModel.swift

  Models/
    CameraPreset.swift
    FilmPreset.swift
    AIResultViewData.swift
    QuotaStatus.swift
    ConsentState.swift
    HistoryPhotoItem.swift

  Services/
    AuthService.swift
    SubscriptionService.swift
    AIAnalysisService.swift
    PhotoLibraryService.swift
    PermissionService.swift
    RemoteConfigService.swift

  Resources/
    Localizable.xcstrings
    Assets.xcassets
    Preview Content/
```

### UI 與後端契約關係

Codex 在做 UI 時，不需要一次接完整後端，但必須先把 contract 留好。最小必要的 UI-facing model 包含：

| Model | 目的 |
|---|---|
| `CameraPreset` | 首頁與 picker 使用 |
| `HistoryPhotoItem` | History grid 使用 |
| `QuotaStatus` | quota badge / paywall trigger 使用 |
| `ConsentState` | AI consent UI 使用 |
| `AIResultViewData` | AIResultSheet 綁定 |

建議 `AIResultViewData` 與 Cloud Function output 一一對齊，避免中途再做脆弱 mapping。

### Codex 可執行任務清單

| 任務 | 檔案 | 輸出 | 驗收標準 |
|---|---|---|---|
| 建立 Design System token | `AppColors.swift` 等 | 顏色、字體、spacing token | 所有畫面不再 hardcode 顏色與 padding |
| 建立 Root navigation | `AppRootView.swift`、`MainTabShellView.swift` | Onboarding/Auth/Main tabs 切換 | 可在 preview 與 simulator 正常切換 |
| 建立 Auth UI | `AuthView.swift` | email / Google / Apple UI | 三種入口都存在，Apple button 為原生樣式 |
| 建立 Home UI | `HomeView.swift` | hero preset + preset shelf + quota badge | 可從 Home 開啟 Camera 與 Subscription |
| 建立 Camera shell | `CameraView.swift`、`CameraPreviewView.swift` | 全屏預覽與底部控制 | 預覽層與 chrome 分離，按鈕位置穩定 |
| 建立 Photo Preview | `PhotoPreviewView.swift` | Analyze / Save / Retake 流程 UI | 拍照後可進預覽畫面並操作 |
| 建立 AI result UI | `AIResultSheet.swift` | summary + 3 advice + adjustments | 支援 loading / success / error 三種狀態 |
| 建立 History UI | `HistoryView.swift` | grid、empty state、banner | 無資料與有資料狀態都完整 |
| 建立 Subscription UI | `SubscriptionView.swift` | 功能比較 + StoreKit views 容器 | 不阻擋基本相機與基本濾鏡 |
| 建立 Settings / Privacy / Delete | 對應檔案 | 隱私、管理訂閱、刪除帳號 | 刪除入口可在 2 次點擊內找到 |
| 加入 localization | `Localizable.xcstrings` | zh-Hant / en 字串 | 手動切換語言後 UI 字串同步切換 |
| 加入 accessibility polishing | 各 component | labels / hints / dynamic type | VoiceOver 可朗讀主要互動元件 |

### 測試 checklist

UI 測試至少要覆蓋以下場景。Xcode previews 可用來快速迭代元件；StoreKit 可以用 Xcode 的本地測試環境；Firebase 可用 Local Emulator Suite。citeturn12search1turn12search3turn11search0turn11search12turn12search0turn12search4

| 類別 | 測試項目 | 通過條件 |
|---|---|---|
| 裝置尺寸 | 小螢幕 iPhone / 大螢幕 iPhone | 控制列不遮住預覽、底部按鈕不跑版 |
| 外觀 | Dark / Light mode | 對比足夠、文字清楚、品牌風格一致 |
| 語言 | zh-Hant / en | 不截字、不超出卡片 |
| 權限 | 相機拒絕 / 相簿拒絕 / 相簿寫入拒絕 | 正確顯示教育頁與 fallback 行為 |
| 相機 | 從 Home 開啟、拍照、進預覽 | 流程完整不中斷 |
| 相簿 | 匯入單張圖 | 正常進入 PhotoPreviewView |
| AI | loading / success / timeout / malformed JSON | sheet 狀態正確且可重試 |
| Quota | 分析額度用完 / 保存超過 20 張 | 正確顯示 paywall，不阻擋免費基本相機 |
| 訂閱 | Free / VIP 狀態切換 | UI 權益差異正確 |
| 刪除 | 刪除單張、刪除帳號入口 | 入口可找、流程可完成 |
| 離線 | History 與 Settings | 顯示快取與 offline banner，不直接白屏 |

### 最終 acceptance criteria

以下是整份 UI/UX 規格的最終驗收標準；Codex 每完成一批 UI，都應以這份清單回頭自測。

- App 啟動後可正確進入 Onboarding、Auth 或 MainTabShell 三種根狀態。
- Home 頁可清楚呈現 preset 選擇模型，且風格原創，不依賴仿製某現有 App 的外觀。
- Camera 頁為 full-screen preview，MVP 只保留必要控制：shutter、PhotosPicker、preset selector、grid toggle、analyze 入口。
- `save` 行為位於 `PhotoPreviewView`，而不是 live preview 狀態。
- AI 結果頁不是聊天頁，而是 `summary + 最多 3 條 advice + adjustments + 再拍一次 + 保存`。
- Paywall 只在額度用完、保存上限、高級 preset、VIP 追問等情境出現，不可阻擋基本相機與基本濾鏡。
- Settings 頁必須含有 Privacy Policy、AI consent 狀態、Manage Subscription、Delete Account。
- Delete Account 入口必須可在 App 內發起，不可只導外部網站完成。
- 所有主要互動元件都有 VoiceOver label；深色模式與中英文切換不跑版。
- 所有 UI 文案集中於 `Localizable.xcstrings`；所有顏色與 spacing 來自 Design System token，而不是散落 hardcode。
- Camera preview 採 `UIViewRepresentable + AVCaptureVideoPreviewLayer`，不可用不穩定的假預覽替代。
- AI 同意文案必須聚焦於第三方 AI 分析與資料刪除權利；`trainingConsent` 預設為 false，且 MVP 不預設要求訓練同意。citeturn13search12turn1search0turn8search0turn8search1turn16search5turn15search0