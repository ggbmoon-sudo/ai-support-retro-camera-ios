# AI Support 復古拍照 App 技術架構選型報告

## 技術需求摘要

你的 App 不是一般的「濾鏡相機」，而是 **iOS-first、重相機控制、重影像處理、帶 AI 視覺分析、並且未來可能走向即時 overlay / pose guidance 的拍照產品**。這代表你需要的不是單純跨平台 UI 技術，而是能穩定整合 **相機輸入、照片挑選、原生影像處理、裝置端視覺能力、訂閱流程、雲端儲存、可控的 AI 成本與隱私風險** 的整體架構。Apple 的原生能力已經把這幾個核心需求各自拆成成熟框架：相機用 AVFoundation、照片挑選用 PhotosUI、電腦視覺用 Vision、影像濾鏡用 Core Image、GPU 加速用 Metal、訂閱用 StoreKit。這是你做 iOS-first 相機類 App 時最大的技術優勢。 citeturn47search11turn47search8turn47search18turn33search5turn33search0turn33search4turn23search3

就後端來說，你的需求非常適合 **Firebase-first**：登入要支援 email/password、Google、Apple；照片與縮圖要存 Storage；分析結果、配額、歷史、訂閱快照要進 Firestore；AI 呼叫要透過可控的 server layer；而初期只有約 100 位用戶，重點是快上線、低維運、跨裝置同步、成本可預期。Firebase 官方目前也已經把 Auth、Storage、Firestore、Callable Functions、Remote Config、App Check 都整理成可直接組合的產品路線。 citeturn39search7turn39search1turn39search0turn44search0turn42search1turn41search4turn20search5

在 iOS 權限與審核面，你還有兩個現實限制要先納入架構。第一，Apple 要求相機與受保護資源必須明確取得授權；但如果你只是讓使用者從相簿挑圖，**PhotosPicker / PHPicker** 可以只讓 App 取得使用者挑選的項目，而不是整個相簿，這更符合 Apple 的資料最小化原則。第二，如果你用第三方登入建立主要帳號，例如 Google Sign-In，就必須同時提供符合 Apple 4.8 規則的等價登入方式；Sign in with Apple 正好是你現在就計劃支援的。Apple 也要求有帳號建立功能的 App 提供 **app 內刪除帳號**。 citeturn47search8turn47search18turn25view1turn39search1turn39search3

## 前端技術比較

以下比較不是跑分，而是**根據官方文件可直接使用的原生能力、是否需要橋接／外掛層，以及對你這種重相機與影像處理 App 的整合風險所做的工程判斷**。依據的核心來源是 Apple 的 SwiftUI / AVFoundation / Vision / Core Image / Metal / StoreKit 文件、Flutter 的 platform channels 文件，以及 React Native 的 architecture / native modules 文件。 citeturn33search18turn47search11turn33search5turn33search0turn33search4turn23search3turn48search0turn8search14turn8search13

| 方案 | iOS 相機控制 | 即時 overlay / Vision 整合 | 濾鏡與 GPU 處理 | Codex 生成完整 App 難度 | 長期維護 | 開發速度 | Android 擴展 | 學習成本 | 推薦程度 |
|---|---|---|---|---|---|---|---|---|---|
| Swift + SwiftUI | 很高 | 很高 | 很高 | 中低 | 高 | 高 | 低 | 中 | **最高** |
| Flutter | 中高 | 中 | 中 | 中 | 中高 | 高 | 很高 | 中 | 次佳 |
| React Native | 中 | 中低 | 中低 | 中高 | 中 | 中高 | 很高 | 低到中 | 不建議做第一版主方案 |

### Swift + SwiftUI

如果你的目標是 **iOS-first 的相機產品**，Swift + SwiftUI 幾乎就是最順手的路。相機層可以直接走 AVFoundation；即時或拍後的構圖、主體、姿勢、後續 pose guidance 可以直接搭 Vision；復古濾鏡與一鍵直出可先走 Core Image，需要更重的 shader / overlay 才再下探 Metal；訂閱直接用 StoreKit 2 與 StoreKit views；相簿選圖也能直接吃 PhotosPicker。這種「全部都在 Apple 官方原生框架裡」的特性，會直接降低 bridge、plugin 相依、執行緒與效能調校上的風險。對 Codex 來說，這也代表檔案邊界更清楚：相機、影像、AI、購買流程都能對到官方 API，而不是再跨一層抽象。 citeturn47search11turn33search5turn33search0turn33search4turn23search1turn23search3turn47search0turn33search18

更重要的是，你未來想做的「半即時 AI 拍攝引導」其實有兩條技術線。第一條是雲端模型做單張建議或低頻率即時建議；第二條是裝置端先做 **框線、姿勢點、畫面構圖輔助**。Vision 已經提供人體姿勢能力，包含 2D 與 3D body pose 相關能力，這對你未來做「拍完一張後，疊線提示下一個動作」特別有幫助。用 SwiftUI / UIKit 混合實作這類 overlay，比跨平台框架少掉很多折返。 citeturn33search2turn33search8turn33search20turn33search23

### Flutter

Flutter 的優點很明確：你如果很快就想上 Android，它是一個相對整齊的單碼庫選項；UI 一致性也很好，開發速度通常不差。問題在於，你的 App 不是表單型或內容型 App，而是 **相機與影像處理是核心價值**。Flutter 官方文件明確說明，和原生平台的整合要透過 platform channels 非同步傳遞方法呼叫；這意味著一旦你走到較深的 iOS 相機控制、即時 frame 分析、Vision、Metal / Core Image 客製處理，你仍然會經常回到原生層。換句話說，Flutter 對你不是做不到，而是 **第一版就要做相機產品時，抽象層帶來的磨損不划算**。 citeturn48search0

因此，Flutter 更像你的 **第二選項**：如果你已經確定六個月內就要雙平台，並且願意接受 iOS 影像核心能力仍要落原生插件，那可以考慮。但如果 MVP 的首要目標是「低風險、快做出拍照體驗、先把 AI 建議與濾鏡體驗打磨好」，Flutter 不如 SwiftUI 直接。這是基於你目前的產品型態，而不是 Flutter 本身不好。 citeturn48search0turn47search11turn33search0turn33search5

### React Native

React Native 最大的問題不是它不能做相機，而是 **你的關鍵功能會過度依賴橋接與生態外掛**。React Native 官方架構文件本身就把 native integration 與 architecture 講得很清楚；如果你要吃深度相機與高效能 frame processing，通常會落到 Native Modules / TurboModules 或第三方高效能相機庫。以現今常見路徑來說，多半會用 Expo Camera 這類較簡單方案，或 VisionCamera 這種更高性能、支援 frame processors 的方案。這會讓你的 MVP 一開始就把風險壓在「JS 層 + 原生層 + 第三方庫」的交界面上。 citeturn8search14turn8search13turn9search1turn9search4

如果你的產品是社交內容型、Feed 型、表單型、會員型 App，我不會這麼保守。但你是「AI Support 拍照 App」，相機、濾鏡、即時導引就是主戰場。對這種產品，React Native 比較適合在功能成熟後再評估跨平台重構，而不是第一版主力。 citeturn8search14turn9search4turn33search0turn47search11

### 前端結論

**最推薦：Swift + SwiftUI。**  
理由不是「原生比較高級」，而是對你這個產品來說，原生 Apple 框架已經完整覆蓋你最核心的能力：相機、照片挑選、視覺分析、濾鏡、GPU、訂閱。這會同時降低 MVP 技術風險、提高效能下限，並讓 Codex 生出來的專案更穩。**Flutter 是次佳方案，但前提是你短期就要 Android。React Native 不建議作為第一版主方案。** citeturn47search11turn47search18turn33search5turn33search0turn33search4turn23search3turn48search0turn8search14

## 後端與雲端基礎設施比較

就你的需求來看，後端不是要追求最強可塑性，而是要在 **100 人級別 MVP** 下，把登入、儲存、同步、配額、AI 代理、基本清理排程做好，同時把維運負擔壓到最低。這類情境下，BaaS / serverless 會明顯比自建後端更適合。Firebase、Supabase 都屬於這個區間；但你已經明確偏好 Firebase，而且 Firebase 在 Apple 生態、Storage、Firestore、Callable Functions、Auth provider 上的組合更貼近你的目標。 citeturn39search7turn44search0turn42search1turn41search4turn10search4turn35search0

| 方案 | 適合 MVP 程度 | 維運負擔 | 與需求貼合度 | 成本可控性 | 主要問題 | 推薦程度 |
|---|---|---|---|---|---|---|
| Firebase-first | 很高 | 低 | 很高 | 高 | NoSQL 與圖片成本需設計 | **最高** |
| PythonAnywhere + Flask/FastAPI + Firebase Storage | 中 | 中 | 中 | 中 | ASGI/FastAPI 仍屬 beta、非 serverless | 低 |
| Supabase | 中高 | 中 | 中高 | 中高 | 需改用 Postgres/RLS/Edge Functions 思維 | 中 |
| 自建 FastAPI + PostgreSQL + S3/R2 | 低 | 很高 | 高 | 中 | DevOps、監控、備援、清理都自己來 | 低 |

### Firebase-first

Firebase-first 最大的優勢，是你要的功能幾乎都已經是「現成拼圖」：Firebase Auth 支援 Apple、Google、email/password；Cloud Storage for Firebase 適合照片；Firestore 適合 metadata、歷史、額度與同步；Callable Functions 會自動帶上 Firebase Auth、FCM、App Check 權杖，而且現在也能處理 streaming 結果；Remote Config 很適合控制模型名稱、免費額度與功能旗標。這樣的組合對初期產品特別有效，因為你不必先解決大量橫切面工程。 citeturn39search0turn39search1turn39search2turn44search0turn42search1turn41search4turn41search0turn20search5

Firebase 的資料面也很適合你的使用習慣。Firestore 是文件式資料庫，集合、文件、子集合的層次能自然表達 `users / photos / analyses / quotas / subscriptions`。官方也特別提醒：**刪除父文件不會自動刪除子集合**。這一點對你的「刪除帳號、刪除所有資料、免費用戶 90 日清理」非常重要，因為你必須明確做遞迴刪除或排程清理，而不能以為刪掉 user document 就結束。 citeturn42search0turn42search1

成本面上，Firebase 對小型 MVP 很友善。官方價格頁顯示 Firestore 標準版有每日讀寫免費配額，Cloud Functions 有每月 200 萬次免費呼叫，Cloud Storage 也有免費儲存與下載配額，但新式 `*.firebasestorage.app` bucket 的免費額度只在特定美國區域提供。這代表你會遇到一個實際取捨：**如果你把資料放在離香港／台灣較近的區域，延遲會更好；但部分 Storage 免費額度不一定吃得到。** 以你的優先順序「速度快 > 絕對最低費用」來看，我會接受這個小幅成本交換。 citeturn22view2turn42search8

### PythonAnywhere + Flask / FastAPI + Firebase Storage

PythonAnywhere 的價值，在於你已經有帳號，而且 Flask 很快能跑起來；但它不是這個產品的最佳主架構。官方說明裡，Flask 是成熟路線，但 **ASGI / FastAPI 目前仍是 beta / experimental**；如果你想常駐某些行程，則需要 paid account 的 always-on tasks。這代表它更像「我已經有一個 Python 服務要放上去」的方案，而不是「我要快速拼一個以行動 App 為中心的 serverless AI backend」。 citeturn11search1turn11search0turn11search2turn11search3

如果你很依賴 Python 生態，例如你已經有成熟的影像前處理、CLIP、OpenCV 或排程腳本，那可以把 PythonAnywhere 當成**輔助服務**，但不建議當主幹。因為一旦你把 Auth、儲存、同步、IAP sync、清理排程、AI proxy 都壓到這條路上，你就會同時得到更多維運責任，卻未必比 Firebase-first 更快。 citeturn11search0turn11search2turn41search5turn39search7

### Supabase

Supabase 是目前最像 Firebase 的替代選項之一，而且官方文件已經提供 Auth、Storage、Edge Functions、Database、Swift SDK 與 RLS。若你強烈想要 SQL、明確的關聯資料模型、以及把授權規則下沉到 Postgres RLS，Supabase 是合理替代。對於未來如果你想做更複雜的查詢、報表、後台分析，Postgres 會比 Firestore 更自然。 citeturn10search4turn35search0turn10search0turn35search4turn35search2turn35search14

但你現在的產品並不缺 SQL；你缺的是 **快、穩、少維運、少決策成本**。而且你已經偏好 Firebase Storage / Firestore / Auth。換平台意味著你要連資料模型、規則設計、Edge Functions、Object Storage 都換思維。這不是不能做，而是對 MVP 不划算。 citeturn10search5turn10search6turn35search2turn35search14

### 自建 FastAPI + PostgreSQL + S3 / R2

這一套的優點是最自由：FastAPI 可自己定義 API，PostgreSQL 關聯模型完整，S3 / R2 可控制媒體成本與結構。但官方文件也很清楚，這等於你要自己處理部署、資料庫、物件儲存、權限、備份、監控、清理、擴展與安全。S3 是高可擴展物件儲存；R2 主打無 egress fees；FastAPI 本身只是框架，不會幫你省掉周邊維運。對 100 人級 MVP 來說，這是典型的過度設計。 citeturn12search0turn12search1turn12search2turn12search3

### 後端結論

**最終後端推薦：Firebase-first。**  
具體是 **Firebase Auth + Firebase Storage + Firestore + Cloud Functions 2nd gen + Remote Config + App Check**。  
PythonAnywhere 不建議作為主幹；Supabase 可作為「如果後面真的需要 SQL/RLS」時的替代方向；自建 FastAPI + PostgreSQL + S3/R2 不適合第一版。 citeturn39search7turn44search0turn42search1turn41search4turn20search5turn11search0turn10search4turn12search0

## AI 架構比較

你這個產品的 AI 需求其實分成三層。第一層是 **單張照片理解與簡短建議**，也就是 MVP 要先做好的能力。第二層是 **多輪追問與即時建議**，偏 VIP 體驗。第三層是 **圖片生成 / 改圖 / 想像畫面轉成參考圖**，這比較像增強型功能，而不是 MVP 核心。把三層拆開後，模型選型就會清楚很多。 citeturn19search1turn19search0turn16search0turn15view1

### Gemini 做圖片理解與未來即時建議

Gemini 官方文件已經把兩件事講得很明確。第一，Gemini 可以做 image understanding，而且包含物件與 bounding box 類型能力。第二，Live API 的方向就是 **low-latency、real-time 的 voice and vision interactions**。這非常貼近你未來想做的「AI 即時拍攝建議」與「框線／下一個動作提示」路線。模型頁面也顯示，Gemini 2.5 Flash 是面向大量低延遲工作與推論能力的平衡點；Gemini 2.5 Flash-Lite 則更便宜；Gemini 3.1 Flash Live 與 2.5 Flash Live 則是即時互動路線，但目前仍屬 preview。 citeturn19search1turn19search0turn32view0turn30view1turn31view0

成本上，Gemini 2.5 Flash 標準層級目前的官方價格是 **輸入 $0.30 / 1M tokens、輸出 $2.50 / 1M tokens**；2.5 Flash-Lite 則是 **輸入 $0.10 / 1M、輸出 $0.40 / 1M**。這對「單張照片 + 簡短建議」的場景來說非常有吸引力，因為你大部分需求其實不是長對話，而是小量高頻的視覺分析。 citeturn30view1

### OpenAI 做圖片理解與圖片生成 / 改圖

OpenAI 這邊的優勢是兩個。第一，官方模型文件明說，最新 OpenAI models 支援 **text + image input + vision**；如果你要做單張照片理解，這條路可行。第二，OpenAI 的 Images / Responses 文件已經把 **圖片生成與編輯** 路線講得很完整：Image API 適合單次生成／編輯，Responses API 適合多輪編輯與會話式圖像工作流；`gpt-image-2` 是現行 state-of-the-art image generation / editing 模型。這很適合你未來做「用戶描述理想畫面 → 生成參考圖 → 轉成拍攝建議」或者「依原圖做改圖示意」的增值功能。 citeturn28view0turn16search0turn16search1turn15view1turn16search3turn16search5

成本上，OpenAI 目前官方價格頁顯示 `gpt-5.4-mini` 為 **輸入 $0.75 / 1M、輸出 $4.50 / 1M**，而 `GPT-Image-2` 則是 **image input $8 / 1M image tokens、output $30 / 1M image tokens**。OpenAI 圖片生成的精準成本還會隨尺寸與品質而變；官方圖像文件也明示 `gpt-image-2` 要用 calculator 估算輸出成本。因此，把 OpenAI 當成 **MVP 主分析引擎** 不一定是成本最低；但把它當成 **未來的高價值圖片編輯 / 生成模組**，就很合理。 citeturn22view1turn15view1

### 混合方案

如果你要同時滿足 **成本低、AI 準確、速度快、且未來能擴展影像生成／改圖**，混合方案是最合理的。也就是：

- **Gemini**：先負責 MVP 的單張照片分析、簡短建議、未來低延遲即時建議路線。
- **OpenAI**：只在付費功能或後續版本啟用圖片生成／圖片改圖／多輪圖像工作流。  

這樣做的好處，是你不會在 MVP 階段就把高成本圖像生成混進免費用戶流程，也不會把整個平台綁死在單一供應商。它也最符合你想做的 **AI provider adapter** 設計。 citeturn19search0turn30view1turn15view1turn16search1turn22view1

### AI 成本、速度、穩定性比較結論

| 方案 | 成本 | 速度 | 對單張照片建議 | 對圖片生成 / 改圖 | API 穩定性 | 開發難度 | 結論 |
|---|---|---|---|---|---|---|---|
| Gemini only | 低 | 高 | 很適合 | 中 | 分析模型穩，Live 多為 preview | 低到中 | 可做 MVP |
| OpenAI only | 中 | 中高 | 可做 | 很強 | 穩定 | 中 | 不建議作 MVP 唯一引擎 |
| 混合方案 | 中 | 高 | 很適合 | 很強 | 最靈活 | 中 | **最佳長期方案** |

### 隱私與資料使用風險

這一段很重要，因為它直接影響你的 consent copy 與供應商選型。OpenAI 官方說明目前非常清楚：**發送到 OpenAI API 的資料預設不會拿來訓練或改進模型，除非你明確 opt in**；而且 OpenAI 也明確要求 API key 不能暴露在 client-side code。這正是你應該用 server-side proxy 的原因之一。 citeturn36search0turn36search10turn36search5turn36search1

Gemini 這邊則要更小心。官方價格頁寫得很清楚：**Gemini Developer API 的 Free 層內容會用來改善產品，Paid 層則不會**。另外，Google 的濫用監控政策又明確指出，為了安全與政策執行，Google 會保留提示、背景資訊與輸出 55 天做 abuse monitoring，而且這部分不是拿來訓練一般模型，而是做安全與政策執行用途。對於你的照片 App，這代表：**如果你要處理使用者臉部照片，請不要把正式產品建在 Gemini free tier；至少要用 paid tier，並在 consent 中清楚揭露會傳送給第三方 AI 供應商處理，以及供應商可能因安全稽核暫時保留資料。** citeturn31view0turn37search3

### AI 結論

**MVP 最佳 AI 策略：先上混合架構，但只啟用 Gemini 分析。**  
具體做法是：  
前端與 Cloud Functions 都實作 provider adapter；MVP 預設 provider = **Gemini 2.5 Flash**；OpenAI adapter 先留好，但只保留到 phase 2 / VIP / 圖片改圖功能再開。這樣你能在成本、速度、準確度與未來擴展之間取得最好的平衡。 citeturn30view1turn32view0turn15view1turn16search1

## 最終 MVP 推薦架構

### 明確推薦方案

我給你的明確結論是：

**前端：Swift + SwiftUI**  
**後端：Firebase-first**  
**AI：Cloud Functions proxy + provider adapter，MVP 先啟用 Gemini 2.5 Flash，預留 OpenAI image/edit adapter**  
**訂閱：StoreKit 2 + StoreKit views，後端用 App Store Server Notifications V2 同步**  
**配置：Remote Config + App Check** citeturn47search11turn33search18turn39search7turn44search0turn42search1turn41search4turn23search3turn23search1turn23search2turn20search5

這個選擇的核心原則很簡單。MVP 要先把 **拍照、相簿上傳、復古濾鏡、單張 AI 建議、歷史紀錄、升級頁** 做穩，而不是第一天就把即時 Live overlay、AR、生成式改圖工作室全部拉進來。Apple 原生技術棧可以把相機與影像處理壓到最低風險；Firebase 能把帳號、同步、媒體、配額與 serverless 背景邏輯快速拼好；Cloud Functions 可以把 AI 金鑰留在 server side 並統一做配額控制、日額度、A/B 開關與 observability。 citeturn33search0turn33search5turn23search3turn39search7turn41search4turn36search1

### 為什麼不是直接用 Firebase AI Logic 從 App 打 Gemini

Firebase AI Logic 官方確實已經支援從 app 直接呼叫 Gemini API，並且強烈建議搭配 App Check 與 Remote Config。對於 **純 Gemini、低複雜度、快速原型**，這是可行路。可是你的產品已經明確要預留 **Gemini / OpenAI 切換、未來圖片編輯、日額度、會員差異、成本控制、同意紀錄與統一審計**。這時候如果把 AI 直接放在 client，不論是治理、配額、切換模型、供應商切換或觀測都會比 server proxy 更麻煩。我的建議因此不是否定 Firebase AI Logic，而是認為它**不適合你這個產品做最終 MVP 主路徑**。 citeturn20search1turn20search5turn41search4turn36search1

### 文字版系統架構圖

```text
iOS App
├─ SwiftUI UI
├─ AVFoundation Camera
├─ PhotosPicker / PHPicker
├─ Core Image filters
├─ Vision helper layer (future pose / framing assist)
├─ StoreKit 2
├─ Firebase Auth
├─ Firebase Storage
├─ Firestore
├─ Remote Config
└─ App Check

iOS App
  ├─(callable) analyzePhoto → Cloud Functions
  ├─(callable) getHistoryPage → Cloud Functions
  ├─(callable) syncSubscriptionSnapshot → Cloud Functions
  └─(callable) deleteAccountData → Cloud Functions

Cloud Functions
├─ AI Provider Adapter
│  ├─ GeminiAnalysisProvider
│  └─ OpenAIImageProvider
├─ quota / credit logic
├─ history aggregation
├─ delete / retention jobs
└─ App Store Server Notifications V2 endpoint

Storage / Data
├─ Firebase Storage
│  ├─ /users/{uid}/photos/original/
│  ├─ /users/{uid}/photos/analysis/
│  └─ /users/{uid}/photos/thumbs/
└─ Firestore
   ├─ users/{uid}
   ├─ users/{uid}/photos/{photoId}
   ├─ users/{uid}/analyses/{analysisId}
   ├─ users/{uid}/quota/{quotaDoc}
   └─ users/{uid}/subscription/{subDoc}
```

這張圖的設計對應到官方能力：相機與照片挑選是 Apple 原生；Storage/Firestore 是 Firebase 原生；AI 透過 callable functions 可自動帶 auth / App Check，且可在未來需要時做串流；訂閱在裝置端可直接用 StoreKit 2 與 StoreKit views 快速完成，而如果你要更穩定地處理跨裝置／續訂／取消／退款，再加上 Apple 的 App Store Server Notifications V2。 citeturn47search11turn47search18turn41search4turn41search0turn23search1turn23search2turn23search10

### 區域與成本建議

Firestore 官方最佳實務建議把資料庫放在最靠近使用者與 compute resources 的地區，因為這會直接影響延遲。基於你的用戶很可能集中在香港、台灣與華語市場，我會優先考慮把 Firestore / Functions / Storage 放在鄰近亞洲區域，而不是只為了追求某些 Storage 免費額度而選美國區。Firebase 價格頁的確顯示某些 `*.firebasestorage.app` bucket 免費額度只在特定美國區域提供，但對以拍照與 AI 回饋為主的 App，**延遲體驗通常比那點初期免費額度更重要**。 citeturn42search8turn22view2

### 訂閱與權限落地建議

MVP 的訂閱頁不需要先做到完整後台同步，但要用 **StoreKit 2 作為權限真相來源**，因為訂閱本質上是 Apple 的交易。SwiftUI 可直接使用 StoreKit views 做基本 paywall；使用者目前的訂閱狀態則可透過 `Product.SubscriptionInfo.Status` 與更新串流觀察。若你之後需要後端同步、退款、續訂、過期等事件，就用 App Store Server Notifications V2 對接 Cloud Functions HTTP endpoint，再把結果寫入 Firestore 做快取。 citeturn23search1turn23search11turn23search10turn23search2turn23search12

## Repo 結構與 Codex 任務

### 建議 repo 結構

下面這個結構是以 **Codex 可直接開始生成** 為目標，刻意避免過度設計：

```text
ai-vintage-camera/
├─ apps/
│  └─ ios/
│     └─ VintageCameraAI/
│        ├─ App/
│        │  ├─ VintageCameraAIApp.swift
│        │  ├─ AppBootstrap.swift
│        │  └─ Routing/
│        ├─ Features/
│        │  ├─ Auth/
│        │  ├─ Home/
│        │  ├─ Camera/
│        │  ├─ PhotoPicker/
│        │  ├─ Analysis/
│        │  ├─ History/
│        │  ├─ Subscription/
│        │  └─ Settings/
│        ├─ Services/
│        │  ├─ Firebase/
│        │  ├─ Camera/
│        │  ├─ Filters/
│        │  ├─ AI/
│        │  ├─ StoreKit/
│        │  └─ Permissions/
│        ├─ Domain/
│        │  ├─ Models/
│        │  ├─ Repositories/
│        │  └─ UseCases/
│        ├─ UI/
│        │  ├─ Components/
│        │  ├─ Theme/
│        │  └─ Resources/
│        ├─ Config/
│        │  ├─ GoogleService-Info.plist.example
│        │  ├─ InfoPlist.strings
│        │  └─ BuildSettings.xcconfig
│        └─ Tests/
│           ├─ Unit/
│           └─ UITests/
├─ functions/
│  ├─ src/
│  │  ├─ index.ts
│  │  ├─ config/
│  │  ├─ adapters/
│  │  │  ├─ ai/
│  │  │  │  ├─ geminiAnalysisProvider.ts
│  │  │  │  ├─ openAIImageProvider.ts
│  │  │  │  └─ providerFactory.ts
│  │  ├─ callable/
│  │  │  ├─ analyzePhoto.ts
│  │  │  ├─ getHistoryPage.ts
│  │  │  ├─ deleteAccountData.ts
│  │  │  └─ syncClientSubscription.ts
│  │  ├─ http/
│  │  │  └─ appStoreNotifications.ts
│  │  ├─ jobs/
│  │  │  ├─ resetDailyCredits.ts
│  │  │  └─ purgeExpiredFreeUserMedia.ts
│  │  ├─ firestore/
│  │  ├─ storage/
│  │  ├─ prompts/
│  │  └─ utils/
│  ├─ test/
│  ├─ package.json
│  ├─ tsconfig.json
│  └─ .env.example
├─ firebase/
│  ├─ firestore.rules
│  ├─ storage.rules
│  ├─ firestore.indexes.json
│  ├─ remoteconfig.template.json
│  └─ firebase.json
├─ docs/
│  ├─ architecture.md
│  ├─ api-contracts.md
│  ├─ firestore-schema.md
│  ├─ prompts.md
│  ├─ app-store-review-notes.md
│  ├─ privacy-consent-copy.md
│  └─ rollout-checklist.md
├─ scripts/
│  ├─ bootstrap.sh
│  └─ seed_remote_config.sh
├─ .gitignore
├─ README.md
└─ LICENSE
```

### 最推薦技術棧

**最推薦技術棧**

- iOS 前端：**Swift + SwiftUI**
- 相機：**AVFoundation**
- 相簿上傳：**PhotosPicker / PHPicker**
- 本地濾鏡：**Core Image**，必要時再補 **Metal**
- 裝置端輔助視覺：**Vision**，先保留給後續 pose / framing assist
- 身分驗證：**Firebase Auth**
- 圖片儲存：**Firebase Storage**
- metadata / 歷史 / 額度 / 同步：**Cloud Firestore**
- 後端：**Cloud Functions for Firebase 2nd gen**
- Functions 語言：**TypeScript**
- AI：**Cloud Functions AI proxy + provider adapter**
- MVP AI provider：**Gemini 2.5 Flash**
- 後續圖像生成 / 改圖：**OpenAI GPT-Image-2 或等價後續模型**
- 訂閱：**StoreKit 2 + StoreKit views**
- 配置與開關：**Firebase Remote Config**
- 濫用防護：**Firebase App Check** citeturn47search11turn33search0turn33search5turn39search7turn44search0turn42search1turn41search4turn23search3turn23search1turn20search5turn30view1turn15view1

### 不推薦技術棧

**不推薦技術棧**

- **React Native 作為第一版主前端**：對重相機 / frame processing / overlay 類產品，橋接與外掛依賴太重。 citeturn8search14turn8search13turn9search4
- **PythonAnywhere 作為主 backend**：Flask 可以，但 FastAPI / ASGI 仍屬 beta，產品成熟度不如 Firebase-first 路線，且你會自己背更多 server 維運責任。 citeturn11search0turn11search1turn11search2
- **自建 FastAPI + PostgreSQL + S3/R2 作為 MVP 主架構**：太早、太重、太多 DevOps。 citeturn12search0turn12search1turn12search2turn12search3

### Codex 建立 project 的第一批任務

這份任務清單是按照「先把能跑的 MVP 做出來」排序的。

**Phase A：repo 與基礎設定**

1. 初始化 monorepo 與 README。
2. 建立 SwiftUI iOS App 專案骨架。
3. 加入 Firebase Apple SDK：Auth、Firestore、Storage、Functions、Remote Config、App Check。
4. 建立 `BuildSettings.xcconfig`、環境切換與 `.example` 檔案。
5. 建立 `functions/` TypeScript 專案與本地 emulator 設定。 citeturn39search7turn41search9turn20search5

**Phase B：登入與權限**

1. Email/password 登入與註冊。
2. Google Sign-In。
3. Sign in with Apple。
4. 登出、刪除帳號入口。
5. 相機權限檢查與照片挑選流程。
6. `Info.plist` 權限說明文字。  
若後續支援 Firebase 發信，記得補 Apple private email relay 設定。 citeturn39search2turn39search1turn39search3turn47search8turn47search18turn25view1

**Phase C：相機、濾鏡、照片輸入**

1. AVFoundation 建立拍照流程。
2. PhotosPicker 單張匯入。
3. Core Image 建立第一批復古濾鏡管線。
4. 本地預覽與暫存縮圖。
5. 圖片基本 resize / normalize。 citeturn47search11turn47search0turn33search0

**Phase D：Firebase 資料流**

1. 上傳圖片到 Storage。
2. Firestore 寫入 photo metadata。
3. 建立 `users/{uid}/photos/{photoId}` 文件模型。
4. 安全規則：只有資料擁有者可讀寫自己的內容。
5. 歷史頁查詢與分頁。 citeturn44search0turn43search0turn43search6turn42search1turn42search8

**Phase E：AI 分析**

1. 建立 `analyzePhoto` callable function。
2. 建立 `GeminiAnalysisProvider`。
3. 統一輸出 JSON schema：構圖、光線、角度、姿勢、數值微調、短建議。
4. 依語言回傳繁中/英文簡短建議。
5. 寫入 Firestore `analyses` 文件。
6. 做免費額度扣減與每日登入 +1。 citeturn41search4turn41search0turn30view1turn19search1

**Phase F：歷史與會員**

1. 歷史頁可看縮圖、時間、建議摘要。
2. 訂閱頁先用 StoreKit views。
3. 會員權限本地判斷。
4. `syncClientSubscription` callable 先把狀態快照寫到 Firestore。
5. 後續再接 App Store Server Notifications V2。 citeturn23search1turn23search11turn23search10turn23search2

**Phase G：後台治理**

1. Remote Config：模型名、配額、feature flags。
2. `resetDailyCredits` 定時作業。
3. `purgeExpiredFreeUserMedia` 清理 90 天免費用戶圖片。
4. `deleteAccountData` 遞迴刪除 Firestore + Storage。  
注意 Firestore 子集合不會自動 cascade delete。 citeturn20search5turn42search0

**Phase H：測試與交付**

1. Auth / quota / AI callable unit tests。
2. Storage / Firestore rules 測試。
3. iOS UI tests：登入、拍照、上傳、分析、歷史、升級頁。
4. App Review notes、隱私政策、同意文案。 citeturn43search1turn25view1

### 需要手動建立的第三方帳號與設定清單

你需要手動準備的服務與設定如下：

- **Apple Developer Program**：這是 Sign in with Apple 與正式上架的前提。Firebase 也明確寫明 Apple Sign-In 需要加入 Apple Developer Program。 citeturn39search3turn39search0
- **App Store Connect**：建立 app、IAP / subscription、StoreKit 設定、server notification URL。
- **Firebase 專案**：啟用 Auth、Firestore、Storage、Functions、Remote Config、App Check。 citeturn39search7turn44search0turn41search5turn20search5
- **Google Sign-In 設定**：Firebase console 啟用 Google provider，加入 Google SignIn iOS SDK。 citeturn39search1
- **Sign in with Apple 設定**：Apple team ID、service ID、private key、key ID、redirect URL；若用 Firebase 發信，還要加 Apple email relay。 citeturn39search3turn39search0
- **Gemini Developer API / Google AI Studio（付費層）**：正式上線建議不要用 free tier 處理使用者照片。 citeturn31view0
- **OpenAI API 專案與金鑰**：如果你要做改圖 / 圖片生成，金鑰必須放 server side，不能埋在 App 裡。 citeturn36search1

## 技術風險與替代方案

### 與 App Store、隱私政策、同意機制直接相關的風險

Apple 的審核規則對你這類 App 有幾個非常實際的影響。第一，如果你用 Google 作為主要帳號登入，必須提供符合 4.8 的等價登入服務，而 Sign in with Apple 正是你應該保留的必要項。第二，若 App 建立帳號，Apple 要求提供 **app 內刪除帳號**。第三，隱私政策必須清楚說明你蒐集哪些資料、如何使用、與哪些第三方共享、保留／刪除政策是什麼。第四，Apple 也明講，**能用 out-of-process picker 就盡量不要要求完整受保護資源存取**；因此，你的相簿上傳建議優先使用 PhotosPicker，而不是要求 full Photos library access。 citeturn25view1turn47search18turn47search4

還有一條很容易踩雷：Apple 4.10 寫得很清楚，**不能把 built-in camera capability 本身拿來收費**。所以你的訂閱價值主張要放在 **AI 建議次數、VIP 多輪追問、進階相機/鏡頭庫、濾鏡庫、歷史保存、去廣告、圖片改圖功能**，而不是「付費才能用相機」。這一點在產品文案與 paywall 設計上一定要先想清楚。 citeturn25view0

### AI 供應商的資料使用與保留風險

如果你讓使用者同意「圖片可能交由第三方 AI 處理」，這沒問題，但同意文案必須精準。OpenAI API 預設不會拿你的 API 資料訓練模型，除非你明確 opt in；Gemini Developer API 則是 free tier 內容會用於改善產品、paid tier 不會。此外，Google 又有 55 天濫用監控保留；這和是否用於一般模型訓練是兩回事。你的同意文案不應只寫「可能用於模型訓練」，而是要寫成更精確的版本，例如：**照片會傳送至第三方 AI 供應商處理；供應商可能基於安全監控暫時保留資料；是否用於改善模型依供應商與方案而異。** citeturn36search0turn36search10turn31view0turn37search3

### 成本與延遲風險

以你現在的規模，Firebase 本身很可能不是主要成本炸點；真正的變數通常是 **圖片 storage、下載流量、AI 視覺分析次數、以及未來圖片生成／改圖**。Firebase 價格頁顯示 Firestore、Functions、Storage 都有免費額度，但儲存原圖與頻繁下載仍會逐步累積成本。AI 方面，Gemini 2.5 Flash 這類分析模型價格遠低於圖片生成功能；而圖片生成不管是 Gemini image 還是 OpenAI GPT Image，都會明顯更昂貴，所以建議 **圖片生成 / 改圖只放在 VIP，且要有 feature flag 與 hard quota**。Remote Config 正是用來遠端調整模型名、額度與功能開關的最佳工具。 citeturn22view2turn30view1turn30view0turn22view1turn20search5

### 即時 AI overlay 的技術風險

你想做的 overlay / pose guidance 非常有產品吸引力，但在技術上要把它切對層次。**真正的即時 video streaming AI**、持續影格上傳、低延遲視覺推理，目前不是 MVP 該先攻的地方，特別是 Gemini Live 相關能力仍有 preview 成分。比較穩的做法是：MVP 先做 **單張拍後分析 + 下一張建議**；下一階段再引入 **裝置端 Vision pose / framing assist**；最後才評估雲端 Live API。這樣你會得到更穩的產品迭代節奏，也更符合成本控制。 citeturn32view0turn19search0turn33search2turn33search20

### 開放問題與限制

目前仍有幾個需要在實作前後持續查證的點。

第一，**Gemini Live、部分 image / TTS / generation 模型仍含 preview 屬性**；Google 官方也明說 preview 版本可以用於 production，但速率限制可能更嚴、且至少提前兩週通知停用。因此，production 應使用 **特定穩定 model string** 或把 model 放進 Remote Config，而不是硬寫 `latest`。 citeturn32view0turn32view1turn20search5

第二，**OpenAI 的圖像生成精準成本仍需依最新 calculator 與實際尺寸／品質參數驗算**。官方文件已經指出 `gpt-image-2` 的輸出成本要透過 calculator 估算，而不同尺寸／品質會改變 token 消耗。對你的報價模型與 VIP 功能設計，這是後續一定要再核一次的地方。 citeturn15view1turn22view1

第三，**如果你堅持未登入也能拍照與做本地濾鏡，Apple 的 5.1.1(v) 其實會更友善**；但如果你把跨裝置同步、歷史、AI 配額、訂閱都放在雲端帳號上，也能合理主張登入是核心功能。這部分屬產品取捨，而不是單純技術問題。 citeturn25view1

### 最終結論

如果只給一個最明確、最適合你現在狀態的答案：

**用 Swift + SwiftUI 做 iOS App。**  
**用 Firebase-first 做 Auth / Storage / Firestore / Functions / Remote Config / App Check。**  
**用 Cloud Functions 2nd gen TypeScript 當 AI proxy 與訂閱 webhook 層。**  
**MVP 的 AI 分析先用 Gemini 2.5 Flash。**  
**把 OpenAI GPT-Image-2 留給後續 VIP 的圖片生成 / 改圖。**  
**StoreKit 2 先做裝置端權限，之後再接 App Store Server Notifications V2。**  

這套方案最符合你現在的三個關鍵：約束夠低、成本夠省、速度夠快，而且不會把未來擴展路線堵死。 citeturn47search11turn39search7turn41search4turn30view1turn15view1turn23search3turn23search2