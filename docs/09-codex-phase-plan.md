# AI Support 復古拍照 App 的 Codex 分階段開發總計劃與任務 Prompt 報告

## 執行摘要

這個 App 的最佳 MVP 技術路線，我的明確建議是：**iOS 端採 Swift + SwiftUI，直接整合 AVFoundation、Vision、Core Image、StoreKit 2；後端採 Firebase-first 架構，包含 Firebase Auth、Firestore、Firebase Storage、Cloud Functions v2、Remote Config、App Check；AI 先用 Gemini 的付費 tier 做單張照片分析，再用 adapter 層預留 OpenAI 圖像生成／改圖能力**。這個選型最符合你「iOS-first、相機能力重、AI 要快、成本要低、Codex 要能分段生成」的前提。Apple 官方已提供以 SwiftUI 與 Swift concurrency 建立相機 App 的 AVCam 範例；SwiftUI 也可以和 UIKit 混用；Core Image 與 Metal 本來就是 Apple 官方的高效能圖像處理與 GPU 管線；Vision 原生支援人體姿勢偵測。相對地，Flutter 需要 platform channels 才能深入平台 API；React Native 官方也明說它不規定怎麼存取大量平台 API，進入深度相機、Vision、StoreKit 整合時通常仍要寫 native modules。citeturn20search8turn31view6turn20search4turn21search2turn31view5turn21search1turn20search0turn20search2turn31view7

對這個產品來說，**MVP 不應該做真正的即時 video streaming AI**。更務實的做法是：**拍攝前／拍攝中先靠 iPhone 本機 Vision 做低延遲的框線、人體姿勢點位、簡單構圖提示；拍完後再把單張縮圖送到 Cloud Functions 代理的 AI provider 做「簡短建議」**。Apple Vision 已可做人像姿勢偵測，並能對 `CVPixelBuffer` 執行；這代表你未來的 overlay 功能，其實可以先走 on-device 路線，把雲端 AI 留給「拍完後」分析，既省錢，也比較快。citeturn21search0turn21search5turn21search9turn21search11

後端方面，**Firebase-first 明顯優先於 PythonAnywhere 當主後端**。原因不是 PythonAnywhere 不能用，而是它比較像一般 Python web hosting；你仍要自己額外處理 iOS App 與後端之間的 auth token 驗證、檔案存取策略、配額與 storage metadata 對齊。反過來，Firebase 的 callable functions 可直接配合 App SDK；文件也明確指出，Callable 會自動帶上 Firebase Authentication token 與 App Check token；Firestore 在 Apple 平台又自帶離線同步；Cloud Functions 現在本身也支援 Python，所以你如果只是因為自己熟 Python 而考慮 PythonAnywhere，這個理由已經不足以推翻 Firebase-first。citeturn26search1turn26search4turn29view2turn26search5turn28view1turn28view0

AI provider 的選擇要分兩條線看。若是 **MVP 的核心任務是「單張照片理解 + 短建議」**，Gemini 的付費 tier 目前更適合做預設分析器，因為官方定價頁顯示 `gemini-2.5-flash-lite` 是成本導向模型，`gemini-2.5-flash-native-audio` 對未來 Live API 路徑也有幫助；而且官方條款寫得很清楚：**Paid Services 不會用 prompts、files、responses 來改善 Google 的產品**。但同一份官方定價頁也寫了：**免費 tier 的資料可用於 improve products**。所以如果你要處理使用者真實照片，**不要用 Gemini free tier 做正式環境**。OpenAI 這邊，官方文件確認它同時支援 image generation／editing 以及 vision，且 API 資料預設不會用於訓練，除非你主動 opt in；因此 OpenAI 更適合作為後續「改圖／生成」或高品質影像編修的第二供應商，而不是 MVP 第一優先。citeturn32view2turn32view3turn15view3turn15view5turn8search0turn22search3turn22search7turn15view6turn0search4

私隱與 App Store 合規有一個特別重要的結論：**不要在正式版預設寫「圖片可能會被第三方 AI API 用作模型訓練」**，除非你真的使用了會這樣做的供應商／方案，或你另外設計了明確 opt-in。Apple 要求 App privacy 回答必須準確、最新，而且必須涵蓋第三方 SDK / partners；OpenAI API 官方說 API 資料預設不拿來訓練；Gemini 付費服務也明確說不會拿 prompts、files、responses 來改善產品。也就是說，如果你最後是用 **OpenAI API 或 Gemini paid tier**，那句話在正式版很可能反而變成**不準確的隱私聲明**。你真正該寫的，是「圖片會傳送至第三方 AI 服務作分析；供應商可能因安全、法規或服務維護而短期記錄請求」。citeturn29view7turn29view9turn30view2turn0search4turn15view5

還有三個 Apple 規則不能漏。第一，只要你支援 Google login 這類第三方登入作為主要帳戶登入，就必須提供符合條件的 Apple 等效登入；你目前規劃 Apple login，方向正確。第二，只要 App 支援帳戶建立，就必須提供**App 內帳戶刪除**。第三，數位訂閱必須走 In-App Purchase / StoreKit，且在要求訂閱之前要清楚說明使用者會得到什麼。citeturn33view1turn30view1turn30view0turn19search4turn19search6

## 官方查核後的架構結論

### 最推薦技術棧

我建議你把 MVP 的主架構鎖定為下面這一套：

- **前端**：Swift + SwiftUI + AVFoundation + Vision + Core Image + StoreKit 2。SwiftUI 可以逐步採用，也能和 UIKit 混用；AVFoundation 是 Apple 官方的相機／音視頻框架；Core Image 提供高效能圖片濾鏡鏈；Metal 提供更進階 GPU 能力；Vision 提供人體姿勢與其他影像理解基礎。citeturn31view6turn20search4turn21search2turn31view5turn21search1

- **後端**：Firebase Auth + Firestore + Firebase Storage + Cloud Functions v2 + App Check + Remote Config。Callable Functions 對 App 端最友善，因為 Firebase SDK 會自動附帶 auth / App Check token；Remote Config 還支援 JSON 參數與條件式下發，剛好適合控制免費額度、模型開關、灰度功能。citeturn26search1turn26search4turn16view3turn16view4

- **AI**：Cloud Functions 內建 **provider adapter**；預設 `GeminiAnalyzer`；保留 `OpenAIImageEditor`。Gemini paid tier 比較適合 MVP 的單張照片分析與低成本規模化；OpenAI 則保留給後續「把使用者腦中的畫面做成改圖／生成草圖」的正式版能力。citeturn32view2turn32view3turn15view5turn22search3turn15view6

- **訂閱**：StoreKit 2 + StoreKit views。StoreKit 2 是 Apple 現行的 Swift/SwiftUI 購買路徑；StoreKit Testing in Xcode 可以在本地測試，不需要真的連 App Store server。MVP 可以先做 client-side entitlement + Firestore 快取；如果日後要更嚴格伺服器驗證，再補 App Store Server Notifications / App Store Server API。citeturn19search4turn19search2turn19search1turn19search3

- **MVP 的 AI 邏輯切分**：拍攝中用本機 Vision，拍攝後用雲端 LLM。官方 Vision 已支援人體姿勢偵測與 3D pose；這條路徑比一開始就做 Live streaming AI 更符合你的成本與速度目標。citeturn21search0turn21search5turn21search9

### 不建議當主架構的方案

**Flutter** 不是差，而是**不適合你這個「iOS-first、重相機、重 Apple 原生能力」的第一版**。Flutter 官方文件清楚說，存取平台特定功能時要透過 platform channels；Flutter 也確實有 camera plugin，但你未來如果要做到更深的相機管線、Vision overlay、StoreKit、多種 Apple capability，repo 最後會自然分裂成 Dart + Swift 雙層維護。若你明確預計在 iOS MVP 後三個月內立刻追 Android，Flutter 可以重新評估；但不是現在。citeturn20search0turn20search1turn20search12

**React Native** 同樣不是做不到，但官方首頁也明說，React Native 本身**不規定怎麼做 routing，也不規定怎麼存取眾多平台 API**；進入原生能力深水區時，通常還是要靠 Expo/native code 或新架構下的 native modules。對你這種一開始就碰相機控制、Vision、StoreKit、Firebase、再加 AI 流程的 App，這會增加 Codex 每一階段的失敗面積。citeturn31view7turn20search2turn20search15

**PythonAnywhere 當主後端** 也不推薦。官方定價與說明顯示它很適合跑一般 web app、always-on tasks、scheduled tasks；但你這個產品最需要的是「跟 Firebase Auth / Storage / Firestore / App Check 無縫接在一起的輕量 serverless proxy」。Cloud Functions 本身已經支援 Python，而且 callable、排程、秘密管理、區域部署都已經在同一個 Firebase/GCP 專案內。PythonAnywhere 更適合作為你日後某個獨立 AI worker 或資料處理工具，而不是 MVP 主幹。citeturn35search0turn28view0turn26search5turn28view8turn16view6

**Supabase** 是合理替代方案，因為它也有 Auth、Storage、Edge Functions、RLS；但你目前已明確偏好 Firebase-first，而且 Firebase 在 Apple 平台 SDK、callable flow、App Check、Remote Config、Emulator Suite 的組合，對這個 MVP 更直接。除非你一開始就確定未來要非常強的 SQL / Postgres 能力，否則不值得在第一版中途切換。citeturn28view2turn28view3turn28view4turn28view5

### MVP 與正式版的邊界

MVP 只做下面這些：

- 登入：email/password、Google、Apple。
- 相機拍照：單張照片為主。
- 相簿上傳：用 PHPicker。
- Firebase Storage 上傳圖片，Firestore 存 metadata。
- 基本復古濾鏡 preset。
- AI 單張分析：短建議、跟隨語言、免費工具型流程。
- 歷史頁：可看最近照片與分析結果。
- Paywall 雛形：可展示 VIP 差異與本地 StoreKit 測試。
- 隱私 consent、刪照、刪帳號。
- 免費 20 張限制、每日登入送 1 次分析額度。

正式版再做：

- VIP 追問聊天。
- AI 對上一張照片提出下一個 pose 建議。
- 圖片生成／改圖。
- 更豐富的相機／鏡頭庫。
- 半格機、雙重曝光、進階數值微調 UI。
- 更精細的即時導引 overlay。
- 真正完善的訂閱同步與伺服器驗證。

第一版不建議做：

- 真正即時 video streaming AI。
- 完整 AR skeleton / 3D 綁點。
- 複雜多人 pose 追蹤。
- 社交 feed、分享社群、關注系統。
- 大型雲端備份／相簿管理工作室。

### 官方合規重點

登入與刪帳號這塊，Apple 規則非常明確：你用了 Google 這類第三方登入，就要提供符合條件的替代登入；在 iOS 生態中這通常就是 Sign in with Apple。而只要你有帳號建立，就必須有 App 內帳戶刪除。citeturn33view1turn30view1

隱私標示這塊也不能含糊。Apple 說明裡對「collect」的定義很重要：**只要資料被傳到裝置外，而且可被你或第三方存取超過即時服務請求所必需的時間，就要算作資料收集**。這個 App 會把照片上傳到 Firebase Storage，也會把縮圖或圖片內容送給第三方 AI API，所以 photos、user identifiers、purchase、可能的 usage data，基本都要準備好 App Privacy labels。citeturn29view7turn29view9

另外，Firebase Storage 官方文件指出：**刪除的檔案預設通常可透過 soft delete 在 7 天內復原**。這意味著你如果在隱私政策或刪除流程裡承諾「立即且不可逆刪除」，就必須先確認 bucket soft delete 設定，否則文字會有風險。citeturn34view3

## Repo 初始化與技術藍圖

### 系統架構圖

```text
iOS App
  ├─ SwiftUI screens
  ├─ AVFoundation camera pipeline
  ├─ PHPicker photo import
  ├─ Core Image filter presets
  ├─ Vision local pose / composition helpers
  ├─ StoreKit 2 paywall + entitlement check
  ├─ Firebase Auth
  ├─ Firebase Storage upload
  ├─ Firestore metadata sync
  ├─ Remote Config fetch
  └─ Callable Functions client

Callable Functions
  ├─ analyzePhoto
  │    ├─ verify Firebase Auth
  │    ├─ verify App Check
  │    ├─ read user quota + plan
  │    ├─ fetch compressed photo from Storage
  │    ├─ call AI Provider Adapter
  │    │    ├─ GeminiAnalyzer
  │    │    └─ OpenAIImageEditor
  │    ├─ validate structured JSON
  │    ├─ store analysis result to Firestore
  │    └─ decrement quota
  ├─ grantDailyLoginBonus
  ├─ deletePhoto
  ├─ deleteAccountData
  ├─ syncSubscriptionStatus
  └─ cleanupExpiredPhotos (scheduled)

Firebase
  ├─ Auth
  ├─ Firestore
  ├─ Storage
  ├─ Remote Config
  ├─ App Check
  └─ Emulator Suite
```

這個圖的核心原則只有三個：**圖片原檔與縮圖進 Storage、可查詢的 metadata 進 Firestore、第三方 AI key 只放在 Cloud Functions / Secret Manager，不進 App**。Cloud Functions callable 對這種架構特別合適，因為它可以直接從 App 叫、並自動帶上 Auth / App Check token；而 Functions 環境也已有內建的 parameterized config 與 Secret Manager 整合。citeturn26search1turn26search4turn28view8

### 建議的資料模型

Firestore 不適合把大段完整聊天歷史、長 prompt、完整照片資料全塞進單一 document。官方限制寫得很清楚：單一 document 最大 1 MiB；單一欄位值接近 1 MiB；被索引的欄位值超過 1500 bytes 會被截斷，查詢結果可能不一致。因此，MVP 應把「摘要」留在主 document，把完整分析結果拆到子集合；圖片本體則只放 Storage。citeturn36view0turn36view3

```text
users/{uid}
  displayName: string
  email: string
  preferredLanguage: "zh-Hant" | "en"
  createdAt: timestamp
  lastActiveAt: timestamp
  plan: "free" | "vip"
  photoCount: number
  starterAnalysisRemaining: number
  lastDailyBonusDate: string | null
  aiProcessingConsentAt: timestamp | null
  privacyPolicyVersion: string
  termsVersion: string
  trainingConsent: boolean   // 預設 false；只有真的需要才開
  accountDeletionRequestedAt: timestamp | null

users/{uid}/photos/{photoId}
  source: "camera" | "library"
  originalPath: string
  previewPath: string
  width: number
  height: number
  createdAt: timestamp
  expiresAt: timestamp | null
  subjectType: "portrait" | "food" | "scene" | "unknown"
  filterPresetId: string | null
  latestAnalysisId: string | null
  latestShortAdvice: string | null
  status: "uploaded" | "analyzing" | "ready" | "failed" | "deleted"

users/{uid}/photos/{photoId}/analyses/{analysisId}
  mode: "free" | "vip"
  provider: "gemini" | "openai" | "mock"
  model: string
  promptVersion: string
  latencyMs: number | null
  estimatedCostUsd: number | null
  shortAdvice: string
  language: "zh-Hant" | "en"
  result:
    angleSuggestion: string | null
    lightingSuggestion: string | null
    compositionSuggestion: string | null
    poseSuggestion: string | null
    cropSuggestion: string | null
    suggestedAdjustments:
      exposure: number | null
      temperature: number | null
      contrast: number | null
      highlights: number | null
      shadows: number | null
      saturation: number | null
      grain: number | null
  createdAt: timestamp

users/{uid}/billing/current
  platform: "ios"
  productId: string | null
  entitlementStatus: "free" | "active" | "expired" | "revoked"
  expiresAt: timestamp | null
  lastSyncedAt: timestamp | null
  originalTransactionId: string | null

users/{uid}/audit/{eventId}
  type: string
  createdAt: timestamp
  payload: map
```

### Cloud Functions 合約設計

建議 MVP 先做這幾支 callable / scheduled functions：

```text
analyzePhoto(data)
  input:
    photoId: string
    photoPath?: string        // 僅內部調試可用，正式版以 photoId 為主
    language?: "zh-Hant" | "en"
    followUpQuestion?: string | null
  output:
    analysisId: string
    shortAdvice: string
    result: { ...structured json... }
    quotaRemaining: number

grantDailyLoginBonus(data)
  input: {}
  output:
    granted: boolean
    quotaRemaining: number
    reason?: string

deletePhoto(data)
  input:
    photoId: string
  output:
    deleted: boolean

deleteAccountData(data)
  input:
    hardDelete: boolean
  output:
    accepted: boolean
    status: "scheduled" | "done"

syncSubscriptionStatus(data)
  input:
    productId: string
    entitlementStatus: "active" | "expired" | "revoked"
    expiresAt?: string | null
    originalTransactionId?: string | null
    signedPayload?: string | null   // MVP 可先 TODO，正式版再做 server verify
  output:
    ok: boolean
    plan: "free" | "vip"

cleanupExpiredPhotos()
  schedule:
    every day 03:30 local project time
```

其中 **`analyzePhoto` 一定要用 callable**。因為 Firebase 文件已說明 callable 與 App SDK 配合時，會自動帶上 Firebase Auth token 和 App Check token；這比一般裸 HTTP endpoint 更適合你的 App。`cleanupExpiredPhotos` 則用排程函式，每天跑一次即可，成本通常很低，Cloud Scheduler 每個 job 每月約 0.10 美元，而且每個 Google account 有 3 個免費 job 額度。citeturn26search1turn26search4turn16view6

要注意的是，**不要把 90 日自動刪除完全交給 Firestore TTL**。官方說 TTL delete 不在免費用量內；而且 Firestore 對 document 的一般刪除不會連動刪子集合，Storage 物件也不會因 Firestore doc 到期而自動刪掉。所以你的主刪除邏輯要放在 `cleanupExpiredPhotos()`：先刪 Storage，再刪子集合／主 doc；TTL 最多只當補救措施，而不是主流程。citeturn16view5turn29view4turn29view5

### UI wireframe 描述

MVP 的主要畫面我建議這樣拆：

- **登入頁**：上半部是品牌標語與復古底片風格 hero 視覺，下半部是三個主要入口：Email、Google、Apple；頁底放隱私政策、條款、AI 圖片處理同意。Google login 既然存在，Apple login 必須並列，不要藏在次級流程。citeturn33view1

- **首頁**：上方是可左右滑動的相機 preset 卡片；中間是最近一次拍攝縮圖與「再分析」快捷；下方固定底部 tab：首頁、歷史、設定。首頁不做 Dazz 式完全重 UI 複製，因為 Apple 明確禁止 copycat UI / metadata。citeturn30view4

- **相機頁**：全螢幕預覽，底部是快門、相簿匯入、濾鏡切換。MVP 只做單張靜態拍照、簡單曝光線與框線提示，不做真正 AR。相機 permission 應在使用者進入相機功能時才要求。citeturn37search1

- **AI 結果頁／Bottom Sheet**：第一屏只顯示三段內的短建議，例如「向右轉 10°」「臉部亮一點更好」「上方留白太多」。VIP 再出現「追問」與「下一個 pose 建議」入口。這樣可以保持免費用戶工具型流程乾淨。

- **歷史頁**：卡片 list，顯示照片縮圖、拍攝時間、套用 preset、最近 AI 建議摘要；支援刪除、重新分析、本機下載。

- **設定頁**：帳號資訊、方案狀態、語言、深色模式、隱私與資料管理、刪除帳號、訂閱入口。

- **訂閱頁**：一版簡單 paywall。先用 StoreKit views 或自訂 paywall + 本地 StoreKit config 測試；先把免費與 VIP 差異說清楚。Apple 對訂閱資訊揭露有明確要求。citeturn19search2turn30view0

### Repo 初始化計劃與建議結構

建議 repo 名稱直接取功能型，不要太抽象。我的首選是：

```text
ai-support-retro-camera-ios
```

branch 策略也不要過度設計，MVP 期建議：

```text
main                 // 永遠可跑、可交付
feat/<slug>          // 每個 Codex phase 一支短分支
release/testflight   // 發 TestFlight 前彙整，可選
```

README 至少要包含：

1. 專案一句話說明  
2. 技術棧  
3. 本機需求：Xcode、SwiftPM、Node、Firebase CLI、Java（Emulator Suite 需要）、Apple Developer 帳號說明  
4. 如何 bootstrap iOS 專案  
5. 如何啟動 Firebase Emulator  
6. `.env`、Secret、sample config 的放置方式  
7. 各 phase 對應文件索引  
8. 不准提交真 API key 的規則  

Firebase 與 Functions 的官方文件已明示：Functions 建議用 parameterized config / Secret Manager，而 `functions.config()` 已被棄用；Cloud Functions 現行 runtime 支援 Node 20 和 22；Emulator Suite 需配合 Firebase CLI 與 Java。citeturn28view8turn28view9turn27search1

建議的最終 repo tree：

```text
/
├─ README.md
├─ .gitignore
├─ .editorconfig
├─ .env.example
├─ firebase.json
├─ .firebaserc.example
├─ docs/
│  ├─ architecture.md
│  ├─ product-mvp-scope.md
│  ├─ phase-plan.md
│  ├─ testing-checklist.md
│  ├─ release-checklist.md
│  └─ prompts/
│     ├─ phase-setup.md
│     ├─ phase-design-navigation.md
│     ├─ phase-auth.md
│     ├─ phase-camera-picker.md
│     ├─ phase-filters.md
│     ├─ phase-storage-firestore.md
│     ├─ phase-ai-function.md
│     ├─ phase-ai-result-ui.md
│     ├─ phase-quota.md
│     ├─ phase-subscription.md
│     ├─ phase-history-delete-download.md
│     ├─ phase-privacy-deletion.md
│     └─ phase-testing-release.md
├─ firebase/
│  ├─ firestore.rules
│  ├─ firestore.indexes.json
│  ├─ storage.rules
│  ├─ remote-config.template.json
│  └─ appcheck-notes.md
├─ ios-app/
│  ├─ RetroSupportCamApp.xcodeproj
│  ├─ RetroSupportCamApp/
│  │  ├─ App/
│  │  ├─ Core/
│  │  │  ├─ Theme/
│  │  │  ├─ Extensions/
│  │  │  └─ Utils/
│  │  ├─ Models/
│  │  ├─ Services/
│  │  │  ├─ Auth/
│  │  │  ├─ Camera/
│  │  │  ├─ Picker/
│  │  │  ├─ Filters/
│  │  │  ├─ Repository/
│  │  │  ├─ AI/
│  │  │  ├─ Billing/
│  │  │  └─ Consent/
│  │  ├─ Features/
│  │  │  ├─ Launch/
│  │  │  ├─ Auth/
│  │  │  ├─ Home/
│  │  │  ├─ Camera/
│  │  │  ├─ AIResult/
│  │  │  ├─ History/
│  │  │  ├─ Paywall/
│  │  │  └─ Settings/
│  │  ├─ Resources/
│  │  │  ├─ Assets.xcassets
│  │  │  ├─ Localizable.xcstrings
│  │  │  ├─ GoogleService-Info.plist.sample
│  │  │  └─ StoreKit/
│  │  │     └─ MVP.storekit
│  │  └─ Config/
│  │     ├─ Build.xcconfig
│  │     └─ FirebaseConfig.plist.sample
│  ├─ RetroSupportCamAppTests/
│  └─ RetroSupportCamAppUITests/
├─ functions/
│  ├─ package.json
│  ├─ tsconfig.json
│  ├─ .env.example
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ config/
│  │  ├─ adapters/
│  │  │  └─ ai/
│  │  │     ├─ provider.ts
│  │  │     ├─ geminiAdapter.ts
│  │  │     ├─ openAIAdapter.ts
│  │  │     └─ mockAdapter.ts
│  │  ├─ callable/
│  │  │  ├─ analyzePhoto.ts
│  │  │  ├─ grantDailyLoginBonus.ts
│  │  │  ├─ deletePhoto.ts
│  │  │  ├─ deleteAccountData.ts
│  │  │  └─ syncSubscriptionStatus.ts
│  │  ├─ jobs/
│  │  │  └─ cleanupExpiredPhotos.ts
│  │  ├─ schemas/
│  │  │  └─ analyzePhoto.schema.ts
│  │  ├─ services/
│  │  └─ utils/
│  └─ test/
├─ scripts/
│  ├─ bootstrap.sh
│  ├─ emulators.sh
│  ├─ deploy-functions.sh
│  └─ validate-no-secrets.sh
└─ tests/
   └─ manual-smoke-tests.md
```

## 分階段開發計劃與 Codex Prompt

### 專案基礎建設

對應：**Phase 0**

**目標**  
建立可長期維護的空 repo，先放好文件、sample config、Firebase 與 iOS placeholder，不急著接真 API。

**要建立的檔案**
- `README.md`
- `.gitignore`
- `.env.example`
- `docs/architecture.md`
- `docs/phase-plan.md`
- `firebase.json`
- `firebase/firestore.rules`
- `firebase/storage.rules`
- `ios-app/` 基本 Xcode 專案骨架
- `functions/package.json`
- `functions/tsconfig.json`

**要修改的檔案**
- 無既有檔案時，僅初始化。

**資料模型**
- 只建立 schema 文件，不建立實際資料。

**UI 元件**
- 只有 app launch placeholder 與 tab placeholder。

**service 層**
- 建立空 interface：`AuthServiceProtocol`、`AIServiceProtocol`、`PhotoRepositoryProtocol`。

**Firebase / Cloud Functions**
- 先做 `firebase init` 所需 placeholder。
- 不接真專案 ID。
- Functions 只放 `helloCallable` 或註解骨架。

**測試項目**
- Xcode 專案能 build。
- functions 能 install dependencies。
- `.env.example` 與 sample plist 都存在。

**Acceptance criteria**
1. Repo 可 clone 後啟動。
2. 文件完整描述目錄用途。
3. 沒有任何真 API key。
4. iOS 專案與 functions 目錄可分別安裝依賴。

**手動驗證**
- 開 Xcode，確認專案能跑 placeholder。
- 在 `functions/` 下執行 install 成功。
- 檢查 `.gitignore` 是否排除真 config。

**可直接貼給 Codex 的 prompt**
```text
請在一個全新 repo 內完成「Phase 0 專案基礎建設」。

要求：
1. 先建立 README、docs、firebase、ios-app、functions、scripts、tests 目錄。
2. 不要刪除任何既有檔案；如果同名檔案存在，只做最小修改。
3. 先讀 README 與 docs 架構占位，確保未來 phase 可以直接接續。
4. 產出 .gitignore、.env.example、firebase.json、firestore.rules、storage.rules、Xcode 專案 placeholder、functions/package.json、functions/tsconfig.json。
5. 所有 secret 一律放 sample / placeholder；不要寫入真 API key。
6. 幫我把 docs/phase-plan.md 初始化，列出 Phase 0 到 Phase 12 標題。
7. 補最基本的 smoke test 說明文件。
8. 完成後更新 README，寫清楚如何 bootstrap。
```

### 設計系統與導覽

對應：**Phase 1**

**目標**  
先把整體 App 骨架、色彩、字體、按鈕、tab 與導航打好，後續每 phase 只補功能，不重做殼。

**要建立的檔案**
- `ios-app/.../Core/Theme/AppTheme.swift`
- `.../Core/Theme/ColorTokens.swift`
- `.../Core/Theme/Typography.swift`
- `.../App/AppRouter.swift`
- `.../Features/Home/HomeView.swift`
- `.../Features/History/HistoryView.swift`
- `.../Features/Settings/SettingsView.swift`

**要修改的檔案**
- `App entry` 檔案
- root navigation

**資料模型**
- `AppRoute`
- `AppTab`
- `AppLanguage`

**UI 元件**
- 底部 tab bar
- primary / secondary button
- card
- section header
- loading / empty state

**service 層**
- 暫時不接實作，先用 mock state。

**Firebase / Cloud Functions**
- 無。

**測試項目**
- Dark mode snapshot
- 中英語切換 placeholder
- tab navigation UI test

**Acceptance criteria**
1. 有首頁、歷史、設定三個 tab。
2. 深色模式正常。
3. 所有頁面能從 root navigation 進入。
4. 可用假資料渲染卡片列表。

**手動驗證**
- 切換 dark/light。
- 切換系統繁中／英文。
- 模擬空資料與假資料。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 1 設計系統與導覽」。

要求：
1. 不要刪除 Phase 0 的任何檔案或說明。
2. 先讀 README.md、docs/architecture.md、docs/phase-plan.md。
3. 用 SwiftUI 建立最小但可擴充的設計系統：色彩 token、字體 token、按鈕、卡片、空狀態。
4. 建立 root navigation 與 tab：Home、History、Settings。
5. 先用 mock data，不接真後端。
6. 支援 dark mode 與 zh-Hant / en 基礎字串。
7. 補基本 UI test 或 snapshot test。
8. 完成後更新 docs，說明目前 navigation 與 theme 結構。
```

### 身分驗證

對應：**Phase 2**

Firebase Auth 官方已支援 Apple 平台上的 email/password、Google Sign-In 與 Apple Sign-In；Google Sign-In 的 iOS 設定需要導入 GoogleSignIn SDK、`GoogleService-Info.plist`、自訂 URL scheme 與 `handleURL` 流程；Apple 登入則要經過 `AuthenticationServices` 與 nonce；另外，Apple App Review 明確要求，只要你用第三方登入做主要帳戶登入，就要提供等效登入服務，你的 Apple login 不是可選項，而是必要項。citeturn16view8turn39view4turn17view5turn33view1

**要建立的檔案**
- `Services/Auth/AuthService.swift`
- `Features/Auth/LoginView.swift`
- `Features/Auth/EmailLoginView.swift`
- `Features/Auth/AppleSignInButtonView.swift`
- `Features/Auth/GoogleSignInButtonView.swift`
- `Models/AuthUser.swift`

**要修改的檔案**
- `AppRouter.swift`
- app launch flow
- settings page sign-out entry

**資料模型**
- `AuthUser { uid, email, displayName, providers[] }`

**UI 元件**
- login landing
- email sign in / sign up
- Apple button
- Google button

**service 層**
- `signInWithEmail`
- `signUpWithEmail`
- `signInWithApple`
- `signInWithGoogle`
- `signOut`

**Firebase / Cloud Functions**
- 啟用 Auth provider placeholder。
- 先不接 Firestore profile 寫入；只在登入後建立 session state。

**測試項目**
- Auth service mock tests
- login validation
- sign out flow
- provider button visibility

**Acceptance criteria**
1. 未登入看到 Login。
2. Email register / sign in mock flow 能跑。
3. Apple / Google button 與 handler 存在。
4. 登入成功後能進主畫面。
5. 登出後回 Login。

**手動驗證**
- Email 表單驗證。
- Apple / Google placeholder handler 被正確呼叫。
- Firebase 模擬器串接預備完成。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 2 身分驗證」。

要求：
1. 不要刪除既有 navigation 與 theme。
2. 先讀 README、docs/architecture.md、docs/phase-plan.md。
3. 以 SwiftUI + service layer 實作登入流程，支援 email/password、Google、Apple 三種入口。
4. 先把 Google 與 Apple 的 UI 與 service 骨架建好；如果某些 capability 需要手動設定，請在程式與 docs 中留下 TODO，不要亂填 key。
5. Auth service 必須可替換 mock 與 Firebase 實作。
6. 補表單驗證與基本測試。
7. 完成後更新 docs，寫清楚哪些步驟需要人工去 Firebase Console / Apple Developer 完成。
```

### 相機與相簿選圖

對應：**Phase 3**

Apple 官方文件指出，相機要有 `NSCameraUsageDescription`，並在真正需要相機時才要求權限；而對相簿選圖，`PHPickerViewController` 的重要好處是**使用時不需要先要求相簿權限**。這對你的 MVP 很有價值，因為可以降低首次使用的隱私阻力。citeturn37search1turn37search0turn18search15

**要建立的檔案**
- `Services/Camera/CameraService.swift`
- `Services/Picker/PhotoPickerService.swift`
- `Features/Camera/CameraView.swift`
- `Features/Camera/CameraOverlayView.swift`
- `Models/CapturedPhoto.swift`

**要修改的檔案**
- Home view 加入「拍照」入口
- router 加入 camera route

**資料模型**
- `CapturedPhoto { localURL, imageData?, width, height, source }`

**UI 元件**
- camera preview
- shutter button
- import-from-library button
- basic guide overlay

**service 層**
- AVFoundation capture
- PHPicker wrapper
- image resize helper

**Firebase / Cloud Functions**
- 無。

**測試項目**
- camera permission denied state
- picker result UI
- local image resize test

**Acceptance criteria**
1. 可進入相機頁。
2. 拍完一張照片可回傳 local image object。
3. 從相簿選一張照片可回傳 local image object。
4. 權限被拒時會顯示可理解的提示。

**手動驗證**
- 真機測相機。
- 模擬器／真機測 PHPicker。
- 測拍照和選圖兩條路徑都可進 AI 前置頁。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 3 相機與相簿選圖」。

要求：
1. 不要刪除 Auth 與 navigation 的既有流程。
2. 先讀 README 與 docs。
3. 用 AVFoundation 建立最小可用的單張拍照流程。
4. 用 PHPicker 建立相簿選圖流程。
5. 把相機 preview、快門、返回、相簿匯入做成可重用 SwiftUI 元件。
6. 權限拒絕時必須有對應 UI。
7. 先不要接 Firebase；輸出為 local image model 即可。
8. 補 image resize helper 與基本測試，並更新 docs。
```

### 濾鏡預設

對應：**Phase 4**

Core Image 官方文件明確強調，它是高效能 still / video image processing 技術，支援多個 built-in filter 串接；若日後需要，你也能接自訂 kernel 或 Metal。這很適合你的「復古底片感、一鍵直出、先做 MVP preset」策略。citeturn21search2turn21search6

**要建立的檔案**
- `Services/Filters/FilterPreset.swift`
- `Services/Filters/FilterPipeline.swift`
- `Services/Filters/FilterPreviewRenderer.swift`
- `Features/Camera/FilterSelectorView.swift`

**要修改的檔案**
- Camera page
- AI Result page（顯示當前 preset）

**資料模型**
- `FilterPreset { id, name, grain, contrast, temperature, vignette, fade }`

**UI 元件**
- preset selector strip
- before/after preview

**service 層**
- Core Image pipeline
- thumbnail preview generation

**Firebase / Cloud Functions**
- 無。

**測試項目**
- preset output snapshot
- non-crash on large image
- preview generation time smoke test

**Acceptance criteria**
1. 至少有 3 個 preset。
2. 可對 local image 套用 preset 並輸出。
3. Camera / AI Result 可顯示目前 preset 名稱。
4. 套濾鏡不阻塞 UI 主線程。

**手動驗證**
- 在不同亮度照片測 3 個 preset。
- 用超大圖測試不爆 memory。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 4 濾鏡預設」。

要求：
1. 不要刪除拍照與選圖流程。
2. 用 Core Image 建立可擴充的 FilterPreset 與 FilterPipeline。
3. 至少實作 3 個復古風格 preset，但避免過度複雜。
4. 請把濾鏡參數做成資料模型，不要把數值硬寫死在 View。
5. 支援縮圖預覽與套用到原圖。
6. 加基本測試與效能注意事項。
7. 更新 docs，說明如何再新增 preset。
```

### Firebase Storage 與 Firestore

對應：**Phase 5**

Firebase Storage 官方文件指出，上傳可從記憶體資料或裝置檔案 URL 做；而 Firebase Storage 與 Firestore 預設都建議配合 Authentication 與 Security Rules。Firestore 在 Apple 平台有自動離線同步，所以歷史頁和 metadata 管理很適合放這裡。citeturn29view6turn29view1turn29view3turn29view2

**要建立的檔案**
- `Services/Repository/PhotoRepository.swift`
- `Services/Repository/UserRepository.swift`
- `Models/PhotoRecord.swift`
- `Models/AnalysisRecord.swift`
- `functions/src/callable/bootstrapUser.ts` 可選
- Firestore / Storage rules 初版

**要修改的檔案**
- Camera flow
- picker flow
- home recent card

**資料模型**
- 實作 `users/{uid}` 與 `users/{uid}/photos/{photoId}`

**UI 元件**
- upload progress
- upload success / fail toast

**service 層**
- upload original image
- generate / upload preview image
- write photo metadata
- fetch recent photos

**Firebase / Cloud Functions**
- Firestore collections 初始化
- security rules 初版
- 如果需要，登入後建立 user document

**測試項目**
- repository mock
- path builder tests
- metadata creation tests
- rules emulator tests

**Acceptance criteria**
1. 拍照或選圖後可上傳到 Storage。
2. Firestore 可寫入對應 metadata。
3. 首頁可讀取最近一張照片卡片。
4. 上傳失敗有 UI 回饋。

**手動驗證**
- 用 Firebase Emulator 或測試專案測一輪。
- 檢查 Storage path 與 Firestore doc 一致。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 5 Firebase Storage 與 Firestore」。

要求：
1. 不要破壞現有拍照、選圖、濾鏡流程。
2. 先讀 README、docs/architecture.md 的資料模型。
3. 實作 PhotoRepository，負責：
   - 上傳原圖
   - 上傳 preview
   - 建立 Firestore metadata
   - 讀取 recent photos
4. Storage path 與 Firestore schema 請依 docs 命名，不要自行改名。
5. 加上 Firestore / Storage rules 初版與 emulator 測試檔。
6. 不要把圖片本體寫進 Firestore。
7. 完成後更新 docs，記錄 collections、paths、rules。
```

### AI 分析函式

對應：**Phase 6**

這一階段是整個 App 的核心。Cloud Functions 官方建議使用 parameterized config / Secret Manager 管理第三方 API key，且 `functions.config()` 已棄用；OpenAI 官方也明確要求 API key 不要出現在 client-side code；Gemini 付費服務不會把 prompts / files / responses 用於改善產品，但 free tier 會，所以正式環境不該走 free tier。citeturn28view8turn22search11turn15view5turn15view0

**要建立的檔案**
- `functions/src/adapters/ai/provider.ts`
- `functions/src/adapters/ai/geminiAdapter.ts`
- `functions/src/adapters/ai/openAIAdapter.ts`
- `functions/src/adapters/ai/mockAdapter.ts`
- `functions/src/callable/analyzePhoto.ts`
- `functions/src/schemas/analyzePhoto.schema.ts`
- `functions/src/services/promptBuilder.ts`
- `functions/src/services/quotaGuard.ts`
- `functions/src/utils/imageFetch.ts`

**要修改的檔案**
- `functions/src/index.ts`
- iOS `AIService.swift`

**資料模型**
- `AnalysisRecord`
- `PromptVersion`
- `AIProviderResponse`

**UI 元件**
- analyzing loading state
- retry state

**service 層**
- provider adapter
- prompt builder
- JSON schema validator
- fallback strategy
- quota check

**Firebase / Cloud Functions**
- callable `analyzePhoto`
- Secret Manager / parameterized config
- logs with request id

**測試項目**
- mock provider tests
- schema validation tests
- prompt builder tests
- quota fail tests
- callable emulator tests

**Acceptance criteria**
1. `analyzePhoto` 可用 mock provider 跑通。
2. 成功時回 structured JSON + short advice。
3. 失敗時回明確錯誤碼。
4. 沒 quota 時不會真的呼叫 AI provider。
5. 秘密資料不出現在 iOS 專案。

**手動驗證**
- 用 mock provider 跑 end-to-end。
- 再切真 provider 一次。
- 檢查 Firestore 是否寫入 analysis subcollection。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 6 AI 分析函式」。

要求：
1. 不要刪除既有上傳與 metadata 流程。
2. 先讀 docs 內的 Cloud Functions 設計與資料模型。
3. 用 TypeScript 實作 provider adapter：
   - provider.ts
   - geminiAdapter.ts
   - openAIAdapter.ts
   - mockAdapter.ts
4. 實作 callable analyzePhoto：
   - 驗證 auth
   - 驗證 quota
   - 從 Storage 取 preview
   - 呼叫 provider
   - 驗證 structured JSON
   - 寫回 Firestore
5. 所有 API key 一律 server side；如果真 key 未提供，請保留 TODO 並讓 mock provider 可用。
6. 補 schema tests、mock tests、callable emulator tests。
7. 更新 docs，說明 request / response 與 secret 設定。
```

### AI 結果頁

對應：**Phase 7**

**目標**  
讓使用者在 3 秒內看懂建議，不做長篇 AI 對話。

**要建立的檔案**
- `Features/AIResult/AIResultView.swift`
- `Features/AIResult/AdviceCard.swift`
- `Features/AIResult/AdjustmentList.swift`
- `Features/AIResult/RetrySection.swift`

**要修改的檔案**
- 拍照後流程導到 AI result
- history detail card

**資料模型**
- `AIResultViewData`

**UI 元件**
- short advice hero
- 角度／光線／構圖／姿勢／數值調整卡片
- VIP follow-up CTA placeholder

**service 層**
- mapping: Firestore / function response -> UI model

**Firebase / Cloud Functions**
- 無新 function
- 讀 analysis 資料

**測試項目**
- result mapper tests
- missing fields fallback
- loading / fail states

**Acceptance criteria**
1. 分析完成後能進結果頁。
2. 結果頁只顯示短建議，不出現冗長段落。
3. 缺欄位時 UI 不會崩潰。
4. 可從結果頁返回首頁或歷史。

**手動驗證**
- 用 portrait / food / scene 假資料各測一次。
- 用失敗 response 測 retry UI。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 7 AI 結果頁」。

要求：
1. 不要改壞 analyzePhoto 的既有 contract。
2. 把 AI 回傳資料轉成適合 UI 顯示的 view data。
3. 結果頁要以短建議為核心，分成 angle、lighting、composition、pose、adjustments 幾個區塊。
4. 缺值時要優雅降級，不要直接顯示 null 或崩潰。
5. 加 retry 與 loading 狀態。
6. 補映射層測試與基本 UI test。
7. 更新 docs，寫清楚 free 與 VIP 在結果頁的差異。
```

### 配額系統

對應：**Phase 8**

**目標**  
把「免費 20 次 starter 分析 + 每日登入送 1 次 + 免費用戶最多保留 20 張照片」做成後端有防呆的機制。

**要建立的檔案**
- `functions/src/callable/grantDailyLoginBonus.ts`
- `functions/src/services/quotaEngine.ts`
- `ios-app/.../Services/Quota/QuotaService.swift`
- `Models/QuotaState.swift`

**要修改的檔案**
- Home view
- Settings view
- analyzePhoto guard

**資料模型**
- `starterAnalysisRemaining`
- `lastDailyBonusDate`
- `photoCount`

**UI 元件**
- quota badge
- free limit warning
- upgrade CTA

**service 層**
- daily bonus fetch
- remaining quota fetch
- client caching

**Firebase / Cloud Functions**
- callable `grantDailyLoginBonus`
- transaction-safe quota updates

**測試項目**
- same-day double bonus blocked
- analyze decrements quota
- free photo count warning
- race condition test for quota engine

**Acceptance criteria**
1. 新免費用戶預設有 20 次 starter 分析。
2. 同一天只能領 1 次 daily bonus。
3. analyze 成功後 quota 正確減少。
4. 免費用戶超過 20 張照片會被阻止新增或提示清理。

**手動驗證**
- 模擬跨天。
- 模擬兩台裝置同時領 bonus。
- 模擬 quota 為 0 時 analyze。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 8 配額系統」。

要求：
1. 不要改動 analyzePhoto 的主要成功回傳結構。
2. 實作 quotaEngine 與 grantDailyLoginBonus callable。
3. 規則：
   - 免費新用戶 starterAnalysisRemaining = 20
   - 每日登入最多 +1
   - 免費最多保留 20 張照片
4. quota 更新要盡量用 transaction / 原子邏輯。
5. App 端要能顯示剩餘額度與升級 CTA。
6. 補 race condition / same-day replay 測試。
7. 更新 docs，記錄 quota rules 與可調整參數。
```

### 訂閱與付費牆

對應：**Phase 9**

StoreKit 2 與 StoreKit views 是 Apple 官方目前建議的 Swift / SwiftUI 購買路線；StoreKit Testing in Xcode 可在本機測試，不需要真的連到 App Store server。數位訂閱在 App Store 上必須走 IAP，且要先說明用戶會得到什麼。citeturn19search4turn19search2turn19search1turn30view0

**要建立的檔案**
- `Services/Billing/SubscriptionService.swift`
- `Features/Paywall/PaywallView.swift`
- `Models/EntitlementState.swift`
- `Resources/StoreKit/MVP.storekit`

**要修改的檔案**
- Settings page
- Home quota warning CTA
- AI result VIP CTA

**資料模型**
- `EntitlementState { free | vip }`

**UI 元件**
- paywall
- feature comparison block
- restore purchases button

**service 層**
- fetch products
- purchase
- restore
- entitlement refresh
- sync to Firestore (MVP cache)

**Firebase / Cloud Functions**
- callable `syncSubscriptionStatus`
- Firestore `billing/current`

**測試項目**
- StoreKit local config test
- restore flow
- entitlement toggles UI

**Acceptance criteria**
1. 可在本地 StoreKit 測試 product。
2. 購買後 UI 變成 VIP。
3. 可 restore。
4. subscription 狀態可被寫入 Firestore 快取。

**手動驗證**
- 用 `.storekit` 檔本地測試購買／恢復。
- 測 paywall 與 quota badge 是否聯動。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 9 訂閱與付費牆」。

要求：
1. 不要刪除免費流程。
2. 使用 StoreKit 2，先以本地 .storekit 測試檔完成 MVP。
3. 建立 PaywallView，清楚顯示 free / VIP 差異。
4. 實作 purchase、restore、entitlement refresh。
5. Firestore 只做 billing/current 快取；若 server-side 驗證還未完成，請明確標 TODO。
6. 補 StoreKit local testing 的說明與測試。
7. 完成後更新 docs，列出 App Store Connect 需要人工建立的商品。
```

### 歷史、刪除與本地下載

對應：**Phase 10**

Firebase 文件指出，刪除 Firestore document 不會自動幫你一路清掉複雜子集合；對於整棵 collection tree，比較安全的是 callable function 或明確後端流程。同時，Firebase Storage 刪除後預設常有 7 天 soft delete 視窗，所以 UI 文案要避免寫成「立即不可逆」。citeturn29view4turn29view5turn34view3

**要建立的檔案**
- `Features/History/HistoryListView.swift`
- `Features/History/HistoryDetailView.swift`
- `Services/Repository/DeleteService.swift`
- `Services/Export/LocalDownloadService.swift`

**要修改的檔案**
- Settings page
- Home recent card

**資料模型**
- 讀 `photos` 與 `analyses`

**UI 元件**
- history list
- delete confirmation
- local export sheet

**service 層**
- fetch paginated history
- delete photo
- export selected images locally

**Firebase / Cloud Functions**
- `deletePhoto`
- 如果需要批次刪除，再補 callable

**測試項目**
- history list rendering
- delete action
- empty state
- local export trigger

**Acceptance criteria**
1. 歷史頁可列出照片與最新摘要。
2. 可刪單張照片。
3. 刪除後首頁 recent card 會更新。
4. 可觸發本地下載／分享流程。

**手動驗證**
- 先建立 5 筆照片，測 history。
- 刪中間一筆，再查剩餘列表。
- 匯出一張與多張圖片。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 10 歷史、刪除與本地下載」。

要求：
1. 不要破壞現有 quota 與 paywall UI。
2. 建立 HistoryList 與 HistoryDetail。
3. 支援刪除單張照片，並同步刪掉 Firestore metadata 與 Storage 物件。
4. 本地備份只做 on-device download / share，不做 server 備份。
5. 如某些刪除流程需 Cloud Function，請補對應 callable。
6. 補 empty state、delete confirm、history fetch 測試。
7. 更新 docs，記錄刪除與下載流程。
```

### 隱私同意與帳戶刪除

對應：**Phase 11**

Apple 規則要求：所有 App 都必須提供隱私政策連結；若支援帳號建立，就要提供 App 內帳號刪除；App privacy 回答還必須涵蓋第三方 partners 的資料處理。這一階段不是「文案附加題」，而是上架前硬需求。citeturn30view2turn29view9turn30view1turn29view7

**要建立的檔案**
- `Features/Privacy/ConsentView.swift`
- `Features/Settings/DataManagementView.swift`
- `Services/Consent/ConsentService.swift`
- `functions/src/callable/deleteAccountData.ts`

**要修改的檔案**
- Login view
- Settings view
- user profile schema

**資料模型**
- `aiProcessingConsentAt`
- `privacyPolicyVersion`
- `termsVersion`
- `accountDeletionRequestedAt`
- `trainingConsent` 預設關閉

**UI 元件**
- consent modal
- privacy links
- data delete section
- delete account CTA

**service 層**
- save consent status
- request account deletion

**Firebase / Cloud Functions**
- callable `deleteAccountData`
- scheduled cleanup follow-up

**測試項目**
- consent required before upload/analyze
- delete account request path
- settings link availability

**Acceptance criteria**
1. 第一次進 App 必須能看到 AI 處理同意。
2. 未同意前不能上傳照片做 AI 分析。
3. 設定頁可找到帳號刪除入口。
4. 帳號刪除請求能被後端接收並標記事件。

**手動驗證**
- 新帳戶首次啟動流程。
- 拒絕 consent 後的限制。
- 送出 delete account request。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 11 隱私同意與帳戶刪除」。

要求：
1. 不要刪掉既有登入與設定流程。
2. 在首次使用 AI 相關功能前，加入 consent gate。
3. 儲存 consent version、acceptedAt 等欄位。
4. 在 Settings 內實作 Data Management 區塊，包含刪除帳號入口。
5. 補 deleteAccountData callable；如果完整 hard delete 尚未完成，先做可追蹤的 request flow，並在 docs 留下 TODO。
6. 更新 docs，列出需要最終替換成真 Privacy Policy / Terms 的位置。
7. 補基本測試。
```

### 測試與部署

對應：**Phase 12**

Firebase 官方提供 Emulator Suite；StoreKit 官方提供本地 StoreKit Testing；Firestore 官方支援離線同步；這幾樣加起來足夠讓 MVP 在上 TestFlight 之前做出很像正式環境的驗證。citeturn27search1turn27search0turn19search1turn19search5turn29view2

**要建立的檔案**
- `tests/manual-smoke-tests.md`
- `docs/release-checklist.md`
- `scripts/validate-no-secrets.sh`
- `scripts/emulators.sh`

**要修改的檔案**
- README
- phase docs
- env docs

**資料模型**
- 無新增。

**UI 元件**
- 無新增，主要修 bug。

**service 層**
- mock provider / test doubles 收尾。

**Firebase / Cloud Functions**
- Emulator setup
- deploy scripts
- remote config template

**測試項目**
- unit tests
- UI tests
- emulator integration
- StoreKit local tests
- offline tests
- slow network tests
- permission denied tests

**Acceptance criteria**
1. 能在本機跑 emulator + iOS app。
2. mock AI 與真 AI 都能切換。
3. StoreKit local testing 可重現購買流程。
4. repo 無真 secret。
5. 有一份可照著跑的 release checklist。

**手動驗證**
- 全流程 smoke test 一次。
- 發內部 TestFlight build 一次。
- 用真機測權限、網路慢、離線。

**可直接貼給 Codex 的 prompt**
```text
請完成「Phase 12 測試與部署」。

要求：
1. 不要新增與 MVP 無關的大功能。
2. 先讀 docs/testing-checklist.md 與 docs/release-checklist.md。
3. 補齊 unit tests、UI tests、Firebase emulator 相關腳本、mock AI 切換能力。
4. 加入 no-secrets 檢查腳本。
5. 更新 README，寫清楚如何：
   - 啟動 emulators
   - 切換 mock AI
   - 使用 .storekit 測試
   - 產出 TestFlight 前的 build 檢查
6. 對尚未完成的 server-side subscription verification 請保留 TODO，不要硬接錯誤流程。
```

## Firebase、AI API 與 iOS 手動設定任務

### Firebase 設定任務

**Auth providers**  
在 Firebase Console 裡啟用 Email/Password、Google、Apple。Google 與 Apple 都是你需求中的必要項；而 Apple 也是 App Review 對第三方 login 的必要補件。Apple 平台上的 Firebase Auth 文件已提供 email/password、Google、Apple 的接法。citeturn16view8turn39view4turn16view9turn33view1

**Firestore collections**  
直接照本報告的 schema 建：`users/{uid}`、`users/{uid}/photos/{photoId}`、`users/{uid}/photos/{photoId}/analyses/{analysisId}`、`users/{uid}/billing/current`。避免把長 JSON 或複數分析結果硬塞單 doc，因為 Firestore document 有 1 MiB 上限。citeturn36view0

**Storage bucket / path**  
以使用者隔離為主，建議：

```text
users/{uid}/photos/{photoId}/original.jpg
users/{uid}/photos/{photoId}/preview.jpg
```

Storage 官方文件預設要求 Authentication；正式版應搭配嚴格 Storage Rules。citeturn29view1turn29view0

**Security Rules**  
Firestore rules：使用者只可讀寫自己的 `users/{uid}` 節點；對 `billing/current`、`audit` 這類 server 管理欄位，要限制 client 直接寫。  
Storage rules：只允許 `request.auth.uid == uid` 的路徑寫入，並限制 `contentType` 必須是 `image/*`，再加檔案大小上限。Firestore 與 Storage 都應由 Auth + Rules 保護。citeturn29view3turn29view1

**Cloud Functions**  
用 **2nd gen + TypeScript**。原因不是 Firebase 不支援 Python，而是這個 repo 會靠 callable、schema 驗證、Secret Manager、測試與 Codex 分階段生成；TS 在這裡的整體維護成本較低。若你後續真想寫 Python AI worker，再補一個獨立 service 即可。Cloud Functions 官方現已支援 Node 20/22，也支援 Python。citeturn28view9turn26search5

**App Check**  
MVP 建議上線前至少開 monitor，正式流量穩定後再 enforcement。Firebase 文件說 App Check with App Attest 可以幫你確保只有真 App 在打 Firebase；但 Apple 也建議大型現網 app 要逐步導入，以避免 quota 問題。預設 token TTL 1 小時通常合理。citeturn17view6

**Remote Config**  
用來控制：
- `free_max_saved_photos`
- `free_daily_bonus_amount`
- `free_starter_analysis_quota`
- `ai_default_provider`
- `ai_default_model`
- `feature_vip_followup_enabled`
- `feature_realtime_overlay_enabled`
- `image_upload_max_dimension`
- `image_upload_jpeg_quality`

Remote Config 支援 `String`、`Boolean`、`Number`、`JSON`，而且可以用 conditions 發灰度。建議把 quota policy 與 AI model policy 做成 JSON 參數。citeturn16view4

### AI API 設定任務

**Provider adapter**  
先定義一個統一介面：

```text
analyzePhoto(input) -> structured result
editPhoto(input) -> optional image output
generateReference(input) -> optional image output
```

這樣 MVP 先實作 `GeminiAnalyzer`，OpenAI adapter 先留空骨架即可。

**API key server side only**  
OpenAI 官方文件明確寫 API key 是 secret，不能放在 app 端；Cloud Functions 官方也建議用 parameterized config 或 Secret Manager。這兩項合在一起，結論就是：**iOS App 永遠不直接持有 OpenAI / Gemini key**。citeturn22search11turn28view8

**PromptBuilder**  
把輸入統一成：
- scene type
- ui language
- free / vip mode
- optional follow-up question
- image url or image bytes reference

輸出統一成：

```json
{
  "shortAdvice": "string",
  "angleSuggestion": "string|null",
  "lightingSuggestion": "string|null",
  "compositionSuggestion": "string|null",
  "poseSuggestion": "string|null",
  "cropSuggestion": "string|null",
  "suggestedAdjustments": {
    "exposure": 0,
    "temperature": 0,
    "contrast": 0,
    "highlights": 0,
    "shadows": 0,
    "saturation": 0,
    "grain": 0
  }
}
```

**JSON schema validation**  
OpenAI 官方對 structured outputs 有明確 schema 要求；即使 Gemini 端你用 prompt 約束，也建議後端自己做第二層驗證，否則結果很容易在 UI 階段炸。citeturn22search1turn22search5turn22search8

**Error fallback**
- provider timeout -> 回短錯誤碼 + retry
- malformed JSON -> 自動重試一次
- quota exhausted -> 不呼叫 provider
- image fetch fail -> 不呼叫 provider
- provider down -> 切 `mock` 或 `backup provider`

**Cost limiter**
- 縮圖後再送 AI，例如只送 1024px 以內長邊
- Free 不允許 follow-up
- Free 只保留單次結果
- Remote Config 可切換 `flash-lite` / `flash`

Gemini 官方定價顯示 `gemini-2.5-flash-lite` 是成本導向；付費 tier 也標示不會拿資料改善產品。這使它很適合做 MVP 預設分析。citeturn32view2turn15view5

**Rate limit**
- 以 uid 為主體
- server side 每分鐘／每天限制
- 加上 App Check
- 對 follow-up 問答再設更低上限

**Mock AI provider for local testing**
- 固定輸出 portrait / food / scene 三套 JSON
- 可手動注入 malformed JSON、timeout、quota errors
- iOS debug menu 可切換 mock / live

### iOS 手動設定清單

**Camera permission**  
`NSCameraUsageDescription` 必須填，而且應在真正進入相機功能時才要求。否則系統可直接終止 App。citeturn37search0turn37search1

**Photo library permission**  
相簿匯入建議優先走 `PHPickerViewController`，因為 Apple 文件明確指出，選圖時不需要先要求 photo library permission。這能大幅降低 MVP 首次使用摩擦。若你後續真的要直接讀寫 Photos library，再補 `NSPhotoLibraryUsageDescription` / `NSPhotoLibraryAddUsageDescription`。citeturn18search15turn18search2turn18search16

**Sign in with Apple**  
- Apple Developer 後台開 capability
- Xcode target 加 Sign in with Apple capability
- Firebase Apple provider 啟用
- 依官方流程實作 nonce 與 `AuthenticationServices`。citeturn16view9turn17view5

**Google Sign-In**
- Firebase Console 開 Google provider
- 下載 `GoogleService-Info.plist`
- 加入 `GoogleSignIn-iOS`
- 在 Xcode 設定 `REVERSED_CLIENT_ID` 的 URL scheme
- `FirebaseApp.configure()`
- 在 URL open flow 中 `handleURL`
- 用 `FirebaseApp.app()?.options.clientID` 建 `GIDConfiguration`。citeturn39view4turn17view0turn39view3

**StoreKit products**
- App Store Connect 建 auto-renewable subscription
- Xcode 建 `.storekit` 本地測試檔
- 測 purchase / restore / expired / revoked 幾種狀態。citeturn19search0turn19search1turn19search5

**Push notification**
- MVP **暫不需要**。
- 如果之後要做「今天送你 1 次分析額度」推播，再加。

**App icons / launch screen**
- MVP 可以先做簡版，但不要拖到上架前一天。
- Launch screen 保持簡潔，避免用大量網路依賴。

### 需要手動建立的第三方帳號與設定清單

- Apple Developer Program
- App Store Connect
- Firebase project
- Google Cloud billing（Functions / Secret Manager / Blaze）
- Firebase Auth provider 設定
- Google OAuth / Google Sign-In 設定
- Apple Sign In capability / identifiers
- Gemini API paid tier 或對應的 Google AI / Google Cloud 設定
- OpenAI API project（如果你要做改圖 / 生成）
- 隱私政策與條款的正式 hosting 位址

## 測試、發佈前檢查與風險 fallback

### 測試策略

**Unit tests**  
你最應該優先測的不是 View，而是這幾個純邏輯：
- `FilterPipeline`
- `QuotaEngine`
- `PromptBuilder`
- `AIResultMapper`
- `PhotoPathBuilder`
- `ConsentGate`
- `SubscriptionService` mock state

**UI tests**  
至少做這幾條：
- 未登入進 App -> Login
- Email login -> 主頁
- Camera permission denied
- PHPicker 選圖 -> AI result
- Quota = 0 -> 顯示升級 CTA
- Paywall 顯示與 restore
- Settings -> delete account

**Firebase Emulator**  
Firebase 官方已提供 Emulator Suite 與 Firestore/Auth emulator 連線方式。MVP 至少要讓 Auth、Firestore、Functions 的本地測試能跑起來；Storage emulator 能接更好。citeturn27search1turn27search0turn27search4

**Mock AI**  
本機測試預設走 mock provider；CI 不應依賴真 AI provider。

**StoreKit testing**  
用 Xcode StoreKit Testing 做本地購買測試，因為它不需要真的連 App Store server。這對 Codex / CI 都非常友善。citeturn19search1turn19search11

**Offline test**  
Firestore 在 Apple 平台的離線同步代表：歷史 metadata 可以在斷網時保有基本可讀性；但 Storage upload、AI analyze 仍要給出排隊或失敗回饋。citeturn29view2

**Slow network test**
- 拍完上傳 3G 模擬
- analyze timeout
- retry
- 回首頁後再次進入結果頁

**Permission denied test**
- camera denied
- photo picker path
- future photo save denied
- sign in cancelled

### MVP 發佈前 checklist

下面這份 checklist 是「上 TestFlight 前必過」：

- repo、Xcode project、functions、docs **都不能含真 API key**。OpenAI 官方已明確要求不要把 API key 放在 client-side code。citeturn22search11
- App Store Connect 必須有**真實可用**的 privacy policy URL。App Store Connect 說明明確要求 iOS app 要提供 privacy policy URL。`placeholder` 可以在內部開發期存在，但在真正送審前必須換掉。citeturn29view9turn30view2
- Terms link 可以先 internal placeholder，但正式上架前應替換為真頁面。
- App Privacy labels 要預先整理：照片、使用者帳戶、購買、使用數據、第三方 AI partner 是否可存取。Apple 要求這些回答準確且涵蓋第三方 partners。citeturn29view7turn29view9
- Settings 內必須能找到帳戶刪除。citeturn30view1
- Google login 存在時，Apple login 也必須存在。citeturn33view1
- 訂閱頁文案要清楚寫出 VIP 會得到什麼。citeturn30view0
- 相機權限文案、相簿／資料處理 consent 文案都要可理解。citeturn37search1turn18search16
- 不要在正式隱私文案裡寫「照片可能被用作模型訓練」，除非你真的是用會這樣做的服務或使用了 free tier。OpenAI API 與 Gemini paid tier 的官方文件都不支持把這句當成通用預設。citeturn0search4turn15view5turn15view0
- 如果你承諾刪除資料，先確認 Firebase Storage 的 soft delete 行為與你的文案一致。citeturn34view3

### 風險清單與 fallback

**AI API 太貴**  
先把正式版預設分析器鎖為 Gemini paid tier 的 `flash-lite` 級成本模型，並且只送縮圖、只回短 JSON、Free 不開 follow-up。必要時用 Remote Config 直接切模型。citeturn32view2turn16view4

**Firebase 成本超支**  
你的 100 人初期規模，最大的成本通常不是 Firestore，而是**圖片儲存與 AI 呼叫**。所以要做的不是過度優化 Firestore，而是：
- 限制上傳尺寸
- 存原圖 + preview，暫不存太多派生檔
- 免費只保留 20 張
- 每日清理過期資料
- 不做 server backup  
Firestore 免費額度存在，但 Cloud Functions、TTL deletes 等正式流程通常仍要上 Blaze。citeturn16view5turn16view6

**即時 AI 太慢**  
不要一開始做 server-side 逐幀分析。用本機 Vision 做姿勢／框線／簡單構圖，拍完後再用雲端 LLM。這是最符合你成本與速度的 fallback。citeturn21search0turn21search9turn21search11

**相機功能太複雜**  
MVP 只做單張 capture，不做 RAW、不做 Live Photo、不做雙鏡頭同步、不做真正 half-frame camera simulator。把 half-frame / double exposure 先做成**後處理 preset 概念**，而不是重新實作完整相機模型。

**StoreKit 太難**  
先靠 `.storekit` 本地測試把 purchase / restore 路徑做通，再慢慢補伺服器驗證。MVP 允許你把「server-side subscription verification」明確列為 TODO，但**不允許沒有 restore 與 entitlement 顯示**。citeturn19search1turn19search5

**App Store 隱私審核**
- 拿掉不準確的「模型訓練」宣告
- 把第三方資料處理講清楚
- 有真隱私政策 URL
- 有 App 內帳戶刪除
- 有 Sign in with Apple

**Codex 生成失敗**
- 縮任務，不要一次叫它生整個 App
- 每 phase 最好只改一個 vertical slice
- 把真 provider 接線延到 mock provider 之後
- 不確定就標 TODO，不要硬接真 key

### 尚待查證的開放問題

- OpenAI 在你最終上線那一天要選哪個 vision-capable model，與其實際影像理解價格，仍應以當日官方 pricing / models 頁面再確認；本報告只把 OpenAI 的 image generation / editing 能力與 API 資料訓練政策列為高信度結論。citeturn22search0turn22search3turn15view6turn0search4
- Gemini 各模型名、preview 狀態、區域可用性與限流，正式接線當日也應再看一次官方 pricing / terms。尤其 free tier 與 paid tier 的資料使用政策不同。citeturn15view0turn15view5
- Firestore / Storage 最終地區要與 Functions 地區一起定，避免跨區延遲與費用；Cloud Functions 文件只確認了 functions 的區域支援與跨區延遲風險。citeturn38view0

## 時程、每日任務順序與第一個 Codex Prompt

### 十四天 MVP 開發時間表

**Day 1**  
Phase 0：repo、docs、sample config、functions / iOS skeleton。

**Day 2**  
Phase 1：design system、tab、route、dark mode、localization scaffold。

**Day 3**  
Phase 2：email auth 流程 + Apple / Google button 骨架。

**Day 4**  
Phase 2 收尾：Firebase Auth 接線、Login / Logout、Auth state 管理。

**Day 5**  
Phase 3：AVFoundation 單張拍照 + PHPicker 匯入。

**Day 6**  
Phase 4：3 個 filter preset + preview strip。

**Day 7**  
Phase 5：Storage upload + Firestore metadata + recent photo。

**Day 8**  
Phase 6：mock AI provider + callable `analyzePhoto` 骨架。

**Day 9**  
Phase 6 收尾：接 Gemini paid tier、structured JSON validation。

**Day 10**  
Phase 7：AI 結果頁；Phase 8：quota core logic。

**Day 11**  
Phase 8 收尾：daily bonus；Phase 10：history list。

**Day 12**  
Phase 10 / 11：delete photo、本地下載、consent gate、delete account request。

**Day 13**  
Phase 9：StoreKit paywall skeleton + local `.storekit` test。

**Day 14**  
Phase 12：Emulator、mock/live 切換、release checklist、TestFlight build。

### 三十天正式 MVP 時間表

**第一週**
- 基礎建設、導航、Auth、Camera
- 成果：可以登入並拍／選一張照片

**第二週**
- 濾鏡、Storage、Firestore、AI callable
- 成果：可以上傳、分析並得到短建議

**第三週**
- History、Quota、Consent、Delete flows
- 成果：產品閉環成立

**第四週**
- StoreKit、測試、效能、隱私與上架材料
- 成果：可內部 TestFlight

**第五週可選延伸**
- VIP follow-up 雛形
- 更細的 overlay
- Crash logging / analytics
- 訂閱同步加強
- polish、copy、國際化收尾

### Codex 每日任務順序

最穩定的 Codex 任務順序如下：

1. 先建 repo，不先寫功能。  
2. 先建導航，不先接後端。  
3. 先做 Auth shell，不先接 Apple / Google 真 API。  
4. 先做 Camera / Picker，不先上傳。  
5. 先做濾鏡資料模型，不先追求漂亮效果。  
6. 先上傳 preview，再上傳原圖。  
7. 先做 mock AI，再接真 provider。  
8. 先做 result UI，再做 follow-up。  
9. 先做 quota engine，再做 paywall。  
10. 先做本地 StoreKit testing，再做同步到 Firestore。  
11. 先做 delete request，再做 hard delete。  
12. 最後才做 release checklist 與 polish。

### 第一個 Codex prompt

```text
你現在要初始化一個全新的 iOS-first AI Support 復古拍照 App repo。

目標：
建立一個可讓後續 Phase 逐步接續的 monorepo，包含：
- ios-app
- functions
- firebase
- docs
- scripts
- tests

必要規則：
1. 不要假設任何真 API key、真 Firebase 專案 ID、真 Apple Team ID 已存在。
2. 如果需要敏感設定，請建立 sample / placeholder 檔案，不要亂填。
3. 不要一次生成整個 App；只完成 repo 初始化與最小骨架。
4. 先建立 README、docs/architecture.md、docs/phase-plan.md。
5. 先建立 .gitignore、.env.example、firebase.json、firestore.rules、storage.rules。
6. 在 ios-app 建立可編譯的 SwiftUI app placeholder。
7. 在 functions 建立 TypeScript Cloud Functions placeholder。
8. 所有目錄與檔案命名要清楚、可維護、可讓後續 Codex phase 小步修改。
9. 生成完成後，更新 README，寫出 bootstrap 步驟與後續 phase 清單。
10. 補一份 tests/manual-smoke-tests.md 與 docs/release-checklist.md 的初版。

交付標準：
- 專案結構完整
- 無真 secrets
- 文件足夠讓下一個 phase 直接開始
- iOS placeholder 可開啟
- functions 依賴可安裝
```

### Codex 可執行任務清單

你可以直接把整個專案拆成這一串任務，依序丟給 Codex：

1. 初始化 repo 與 docs。  
2. 建 design system 與 tab navigation。  
3. 建 Auth shell。  
4. 接 Firebase Auth email/password。  
5. 接 Apple Sign-In。  
6. 接 Google Sign-In。  
7. 建 AVFoundation camera。  
8. 建 PHPicker import。  
9. 建 FilterPreset + Core Image pipeline。  
10. 接 Firebase Storage upload。  
11. 接 Firestore metadata。  
12. 建 mock AI provider。  
13. 建 callable `analyzePhoto`。  
14. 接 Gemini paid tier。  
15. 建 AI result UI。  
16. 建 quota engine。  
17. 建 daily login bonus callable。  
18. 建 paywall + StoreKit local testing。  
19. 建 history list/detail。  
20. 建 delete photo flow。  
21. 建 local download/export。  
22. 建 consent gate。  
23. 建 delete account request。  
24. 補 Emulator / UI tests / StoreKit tests。  
25. 整理 release checklist、privacy materials、TestFlight build。