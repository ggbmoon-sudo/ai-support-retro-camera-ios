# AI Support 復古拍照 App 產品需求與 MVP 範圍報告

這份報告把你的構想收斂成一份可以直接交給 Codex 與開發者執行的產品邊界文件。技術與合規判斷優先參照 Apple 的 App Review、App Privacy、StoreKit、AVFoundation、PhotosPicker、Vision、Core Image，以及 Firebase、OpenAI、Gemini 的最新官方文件；至於 AI 模型版本、價格與速率限制，因更新頻繁，正式接入前仍應再核對一次。citeturn24view2turn28view1turn29search6turn4search1turn4search2turn4search7turn19view0turn11view0turn22view0turn11view2turn17view0

## 產品定位與目標用戶

**App 一句話定位**

一個 iOS-first 的復古底片感 AI 拍照助手：先用一鍵直出讓照片更有氛圍，再用短而準的 AI 拍攝建議，讓攝影小白也能幫女朋友、家人、朋友拍出更有電影感、構圖更好、姿勢更自然的照片。

> 這不是第一版就要做成「大型 AI 修圖工作室」，而是先做成「底片感相機 + 單張 AI 拍攝教練」。

**目標用戶 Persona**

攝影小白。平常會拍照，但不知道怎樣判斷角度、背景、光線、曝光、構圖與姿勢，拍完常常覺得「好像差一點」，卻說不出差在哪裡。

想幫女朋友、家人、朋友拍好相的人。這群用戶不是為了研究攝影器材，而是想在吃飯、逛街、旅行、節日、約會時，快速拍出「看起來很會拍」的照片。

喜歡復古底片相機的人。他們在意顏色、顆粒、閃光燈感、時間戳、半格感、老鏡頭味道，但未必願意進 Lightroom 或手動修一堆數值。

想快速得到 AI 拍攝建議的人。他們不想看長篇教學，希望 AI 直接告訴他下一步要做什麼，例如「往左半步」「臉轉向窗邊」「肩膀放鬆」「曝光再低一點」。

**核心痛點**

第一，是「不知道怎麼拍才對」。用戶面對的不是修圖問題，而是拍攝當下不知道怎麼移動、怎麼調整、怎麼叫被拍者擺姿勢。

第二，是「好看的照片太依賴經驗」。很多人知道自己喜歡 Dazz 類型的底片感，但不知道怎麼穩定拍出那種氛圍。

第三，是「建議太抽象」。大多數拍照教學會說「注意構圖」「光線很重要」，但不會直接把下一步變成可執行的動作。

第四，是「想快」。在日常生活裡，用戶通常只有幾秒鐘到一分鐘拍照，不會接受一條很長的 AI 講解或複雜後製流程。

**核心價值主張**

你的 App 要提供的不是單純濾鏡，也不是單純 AI 聊天，而是三件事合在一起：

先給用戶一個**好看的起點**，也就是復古底片風的一鍵直出。

再給用戶一個**可執行的下一步**，也就是針對單張照片輸出短、準、能立刻照做的拍攝建議。

最後把「看起來會拍」這件事，變成一個**低壓、低門檻、可重複**的日常體驗。

## MVP 邊界與技術決策

**產品結論**

MVP 應該定義成：**單張照片分析 + 底片感直出 + 短建議 + 基本歷史保存**。  
不要一開始就把焦點分散到完整相機博物館、真實即時影片 AI、複雜 AR、完整聊天記憶、超多鏡頭模擬與大型改圖工作室。

**平台與技術建議**

我建議這個產品的 iOS MVP 直接使用 **Swift + SwiftUI**，相機用 **AVFoundation**，相簿匯入用 **PhotosPicker**，基本濾鏡用 **Core Image**，基礎姿勢／框線導引與部分即時判斷用 **Vision**。Apple 官方把 SwiftUI 定位為建立新 App 的最佳選擇；Apple 的 AVCam 相機範例已經用 SwiftUI 與 Swift concurrency 做相機 App；PhotosPicker 是原生相簿選取介面；Core Image 提供高效能影像處理；Vision 既能做人體 Pose，也能對影像或影片 frame 做分析。相對地，Flutter 官方明確寫到需要透過 platform channels 撰寫 iOS 原生碼，相機仰賴 plugin；React Native 官方也寫明，當平台 API 沒有內建時要自己做 Turbo Native Module，而且舊的 ImagePickerIOS 已經移除、改用社群套件。對這種重相機、重影像管線、重 iOS 原生能力的產品，原生是 MVP 與長期擴展都更穩的基線。這是工程判斷，不是單純語言偏好。citeturn8search8turn4search1turn4search2turn4search7turn23search0turn23search15turn25view0turn25view1turn25view2turn9search1

**後端與資料流建議**

第一版建議維持 **Firebase-first**。Cloud Firestore 原生就支援文件／集合模型、即時同步、離線快取；Cloud Storage 預設就能與 Firebase Authentication 與 Security Rules 搭配；Cloud Functions for Firebase 支援 HTTPS callable functions、Cloud Scheduler jobs，且支援 JavaScript、TypeScript、Python。換句話說，你的登入、跨裝置同步、圖片保存、額度管理、每日登入送次數、90 日後自動清理，都可以先放在同一套 Firebase 體系中。對一個預計先服務約 100 人的 iOS MVP，這比在早期就額外分出 PythonAnywhere 更簡單；PythonAnywhere 只有在你之後真的要跑自訂 Python 視覺流水線時，才值得另開。citeturn19view0turn19view1turn19view2turn19view4turn1view2turn30search2turn19view5

**訂閱技術建議**

訂閱第一版建議直接用 **StoreKit 2 + SubscriptionStoreView**。Apple 官方已提供 SwiftUI 的商店／訂閱視圖、產品資訊本地化，以及跨裝置交易更新；對 iOS-first MVP 而言，先不接第三方訂閱平台是合理的。後續如果你的訂閱方案愈來愈複雜，再評估加上伺服器驗證或第三方訂閱層。citeturn29search6turn29search2turn29search10

**雲端 AI 與本機 AI 的分工**

MVP 最合理的策略不是「所有事都丟雲端 AI」，而是分工：

本機處理：相機預覽、基本濾鏡、Grid、水平線、簡單的人像框線、基礎姿勢點位、局部亮暗提示。Apple 的 Vision 可分析影像與影片 frame，也能做人像 pose 檢測；而 Apple 也明確說明，若資料只在裝置上處理、不送出裝置，就不算 App Privacy 中的「收集」。這很適合拿來做輕量即時提示。citeturn23search0turn23search15turn28view1

雲端處理：單張照片的語意分析、圖像內容理解、簡短自然語言建議、場景推理、以及未來的參考畫面生成／改圖。這部分適合放在受控的 server function 後面，而不是直接從 client 裸呼叫外部 AI API。citeturn30search2turn11view0turn22view0

## 功能分層與付費分級

### 功能分層

**MVP 必須有**

- iOS App，首頁、相機頁、AI 建議頁、歷史頁、登入頁、設定頁、訂閱頁基本骨架完成  
- Email/password、Google、Apple 三種登入  
- 可讓新用戶先體驗，再在需要雲端保存／同步時要求登入  
- 單張拍照  
- 從相簿匯入單張圖片  
- 至少 3 個可用的復古底片風預設  
- Firebase Storage 上傳圖片  
- Firestore 儲存 metadata 與 AI 建議數值  
- 一次只分析一張照片  
- AI 輸出短建議，不做長篇分析  
- 支援人像、食物、景物三大場景  
- 基本歷史紀錄頁  
- 免費額度與免費 20 張上限  
- 訂閱頁雛形  
- 設定頁可查看隱私、同意、資料刪除、登出  

**MVP 可以延後**

- 拍完第一張後，AI 建議下一個動作  
- 簡單姿勢庫  
- 簡單即時線條／框架導引  
- 以本機 Vision 做更細緻的人體點位疊圖  
- 本地匯出／一鍵下載選取圖片  
- 前鏡頭專屬自拍體驗  
- 更多相機預設與更多鏡頭風格  
- 更精細的手動數值調整面板

**正式版才需要**

- 完整相機／底片／鏡頭大庫  
- 半格機、雙重曝光、時間戳、閃燈模擬等進階復古玩法  
- VIP 多輪追問聊天  
- 更即時的拍攝建議頁與 shot-to-shot guidance  
- 圖片生成／改圖 API  
- 更完整的歷史分析與搜尋  
- 進階 A/B 測試與遠端配置  
- 更成熟的公平使用限制與成本監控面板  

**不建議第一版做**

- 完整 AR 導拍  
- 真正的雲端即時影片串流 AI  
- 3D 人體骨架與高難度追蹤  
- 社交動態牆、按讚留言、社群關係鏈  
- 完整 AI 改圖工作室  
- Android 與多平台同時開發  
- 個人化廣告 SDK 與廣告追蹤

不建議把完整 AR、3D 人體骨架、真正即時影片串流 AI 放進第一版，原因很直接：Apple 的 Vision 雖然已支援 2D/3D 人體 Pose，但 3D pose 會帶來裝置條件與 QA 複雜度；另一方面，持續雲端分析影片 frame 會把延遲、成本、隱私與穩定性一次放大。MVP 應先把「單張分析」做穩，再擴充到「連續引導」。citeturn23search0turn23search1turn23search4turn11view2turn31view0

### 免費用戶與 VIP 用戶功能差異

**免費工具型流程**

免費用戶的產品心智應該是：**拿起來就拍，拍完即得一個短建議**。  
這個流程要快、低負擔、不聊天。

建議免費方案如下：

- 基本相機與基本濾鏡可用  
- 初始送 20 次分析額度  
- 每日登入送 1 次分析額度  
- 單張照片分析  
- AI 僅輸出簡短建議  
- 雲端歷史最多保留 20 張  
- 可手動刪除照片與資料  
- 可看訂閱頁，但不強迫一打開就付費

**VIP 流程**

VIP 應該賣的是：**更高成功率、更多回合、更多保留、少摩擦**。  
不是賣「相機能不能開」。

建議 VIP 第一階段權益如下：

- 更高分析次數上限  
- 更多歷史保存能力  
- 無廣告  
- 更完整數值建議顯示  
- 後續版本開放追問／聊天與更即時導拍  
- 後續版本開放更多相機包與姿勢包

Apple 不允許把相機這種內建硬體能力直接貨幣化，因此 VIP 付費點應該放在 AI 分析額度、歷史保存、追問能力、免廣告與更高雲端配額，而不是「VIP 才能使用相機」。另外，Auto-renewable subscription 必須提供持續價值、跨裝置可用，而且在訂閱前要清楚說明用戶會得到什麼。citeturn24view2turn24view0

**付費頁文案原則**

付費頁要說清楚：

- 每個週期給多少分析次數  
- 可保存多少歷史  
- 有沒有無廣告  
- 有沒有追問能力  
- 如何取消  
- 是否有免費試用

這不只是轉化問題，也是 App Store 審核問題。citeturn24view0turn24view1

## 主要使用流程

### 第一次打開 App

第一次開啟時，首頁應該先傳達三件事：這是一個復古底片感相機、AI 可以幫你拍得更好、你可以先體驗再決定要不要登入。

建議流程是：

先看一個很短的 onboarding。內容只講「底片感直出」「AI 幫你指出下一步」「可保存歷史與跨裝置同步」。  
接著給兩個入口：**先體驗**、**登入同步**。  
這樣做的原因很實際：Apple 明確要求，如果核心功能不是社交網路身分本身，應提供不用登入也能使用的方式或替代機制，而你的核心功能是拍照與拍攝建議，不是社交帳戶。citeturn24view2

### 登入與註冊

當用戶需要雲端同步、保存歷史、或準備正式使用額度時，再要求登入。  
登入方式為：

- email/password  
- Google login  
- Apple login

因為你有 Google login，Apple 的規則要求必須同時提供一個等價、限制資料收集、且可隱藏 email 的登入方式；實務上就是 Sign in with Apple。若 App 支援帳戶建立，也必須能在 App 內發起帳戶刪除。citeturn24view1turn24view2

### 選擇相機與濾鏡

首頁應該以「相機 preset 選擇」為主，不以複雜參數為主。  
MVP 只要讓用戶清楚知道自己正在用哪個風格即可，例如：

- 溫暖底片  
- 閃燈夜拍  
- 綠調老鏡  
- 乾淨電影感

這一頁可以參考 Dazz 那種「先選相機再拍」的心理模型，但 UI 不能像 Dazz；Apple 對 copycat UI 有明確風險。citeturn1view0

### 拍照

相機頁應該是全螢幕、低干擾。MVP 只需保留最必要操作：

- 快門  
- 相簿匯入  
- 相機 preset 切換  
- Grid on/off  
- AI 分析按鈕  
- 保存按鈕

如果做相簿匯入，優先用 PhotosPicker 單張挑圖，而不是要求整個相簿全面權限。Apple 一方面推薦使用 out-of-process picker，另一方面也把資料最小化列為隱私要求。citeturn4search2turn24view2

### AI 分析

按下分析後，MVP 只做**單張**。  
不要在第一版做多張比較、連續追問、長對話記憶。

第一次進行雲端分析前，要先顯示清楚的 consent sheet，至少包含：

- 照片可能會送到第三方 AI 服務做分析  
- AI 建議只供參考  
- 你會保存哪些資料  
- 如何刪除資料  
- 隱私政策連結

Apple 的最新 App Review Guidelines 已明確要求：把個人資料分享給第三方，包括第三方 AI 時，必須清楚披露、說明用途，並取得明確許可。citeturn3view1turn24view2

### 顯示建議

建議頁不是聊天頁，而是**一個短結果頁**。  
MVP 建議固定格式如下：

- 1 句總結  
- 最多 3 條可立即執行的下一步  
- 1 組簡單數值建議  
- 1 個「再拍一次」按鈕  
- 1 個「保存」按鈕

例如：

- 總結：光線很美，但人物離背景太近。  
- 建議：後退半步、把人移到窗邊、把曝光降一點。  
- 數值：曝光 -0.3、色溫 +200、對比 +5。

### 保存圖片

保存時，應分成兩層：

- 本地相簿保存  
- 雲端歷史保存

免費用戶若已滿 20 張，系統要明確提示：刪除舊圖或升級 VIP。  
不要默默失敗，也不要讓用戶以為已保存但其實沒保存。

### 查看歷史

歷史頁只需要做到基本可用：

- 縮圖列表  
- 拍攝時間  
- 使用的相機 preset  
- AI 摘要  
- 點進去看完整建議  
- 可刪除

這一頁的角色不是做知識庫，而是讓用戶回看自己最近拍過什麼、AI 曾建議過哪些數值。

### 訂閱升級

當用戶在以下情境碰到限制時再顯示 paywall：

- 分析額度用完  
- 保存照片數量已滿  
- 點擊 VIP 專屬功能  
- 想開啟追問或更多歷史

不要在第一次打開 App 就硬上訂閱牆；這會同時傷轉化與體驗，也與你的產品價值主張不一致。

## MVP 驗收標準

下面的 acceptance criteria 都寫成「可測試」格式，Codex 與開發者可以直接拿去做驗收。

**首頁與 onboarding**

- 新安裝後，使用者第一次開啟 App 時會看到 onboarding，而不是直接進入空白相機頁。  
- onboarding 結束後，畫面至少提供「先體驗」與「登入同步」兩個清楚入口。  
- 使用者未登入時，仍可進入體驗流程；只有在需要雲端保存、跨裝置同步或正式扣額時，系統才要求登入。這樣的設計符合 Apple 對非社交核心功能 App 的登入要求。citeturn24view2

**登入與帳戶**

- 使用者可以透過 email/password 建立帳戶與登入。  
- 使用者可以透過 Google 登入。  
- 使用者可以透過 Apple 登入。  
- 若登入頁顯示 Google 登入，就必須同頁顯示 Apple 登入。  
- 設定頁中可找到「刪除帳戶」入口，刪除動作不依賴只寄 email 給客服。citeturn6search2turn6search3turn1view1turn24view1turn24view2

**相機頁**

- 使用者可從首頁進入相機頁並看到即時預覽。  
- 可成功拍下一張照片。  
- 至少可切換 3 個預設風格。  
- 可顯示 grid。  
- 第一版不要求完整專業手動模式，不要求影片拍攝。citeturn4search1turn4search7

**相簿匯入**

- 使用者可從相簿匯入**一張**圖片。  
- 匯入流程優先使用 PhotosPicker，不要求整個相簿的完整讀取權限。  
- 即使用戶未授予完整 Photos 權限，仍可透過 picker 匯入單張圖片。citeturn4search2turn24view2

**AI 分析**

- 每次分析只接受一張圖片。  
- 雲端分析前，若用戶尚未同意第三方 AI 處理，系統必須先顯示 consent sheet。  
- AI 回傳內容必須是結構化結果，而不是不可控長文；至少包含 `summary`、`adviceList`、`adjustments`。  
- `adviceList` 最多 3 條，每條都必須是可執行建議。  
- AI 回答語言跟隨用戶當前語言設定，至少支援繁中與英文。  
- 分析失敗時要顯示 retriable error，不可直接吞掉。citeturn3view1turn24view2turn13search1turn13search4

**AI 建議內容品質**

- 人像圖至少要嘗試輸出姿勢、構圖、光線其中兩類建議。  
- 食物圖至少要嘗試輸出角度、曝光、背景乾淨度其中兩類建議。  
- 景物圖至少要嘗試輸出構圖、水平、明暗層次其中兩類建議。  
- 所有建議必須短，不可變成攝影教學文章。  

**保存與雲端同步**

- 拍完或匯入的圖片可成功上傳到 Firebase Storage。  
- 同時在 Firestore 建立對應 metadata 文件。  
- 同一帳戶於第二台裝置登入後，可看到同一份歷史資料。  
- 刪除歷史項目後，對應 Storage 檔案與 Firestore metadata 都會移除。citeturn19view0turn19view1turn19view2turn19view3turn19view4

**免費額度與每日登入加一**

- 新註冊免費用戶建立後，自動擁有 20 次分析額度。  
- 免費用戶每日首次登入只會獲得 1 次額度，同一天重複登入不會重複加。  
- 當額度歸零時，分析按鈕不能照常扣負數；系統必須顯示用完提示與升級入口。  
- 額度判斷應由後端或可信任伺服器時間控制，而不是只靠本機時間。citeturn1view2turn30search2

**免費 20 張上限**

- 免費用戶嘗試保存第 21 張雲端照片時，系統必須顯示「刪除舊照片」或「升級 VIP」兩條明確路徑。  
- 系統不可自動覆蓋舊資料。  
- 用戶手動刪除後，立即釋放容量。  

**歷史紀錄頁**

- 歷史頁至少顯示圖片縮圖、日期時間、相機 preset、AI 摘要。  
- 點入某一筆歷史後，可看到該圖與當次 AI 建議數值。  
- MVP 不要求完整聊天對話紀錄，也不要求跨照片關聯搜尋。  

**訂閱頁**

- 訂閱頁至少能清楚列出免費與 VIP 差異。  
- 若是公開 App Store 版，訂閱頁文案需完整說明週期、價格、會給什麼、如何取消。  
- 無論是否升級，基本相機與基本濾鏡都能用；VIP 不應成為「相機開關」。  
- 若先做 TestFlight MVP，可先上「訂閱頁雛形」；正式公開版本再接 StoreKit 2 真實商品。citeturn24view0turn24view2turn29search2turn29search10

**隱私、同意與刪除**

- App 內有可直接打開的隱私政策頁。  
- 第一次雲端分析前，會要求用戶同意照片送第三方 AI 處理。  
- 設定頁可讓用戶撤回同意或至少停止未來分析。  
- 設定頁可讓用戶刪除所有資料。  
- 隱私政策中需寫明資料保留期間與刪除方式。citeturn2view6turn3view1turn3view4turn24view2

**深色模式與雙語**

- App 需支援深色模式。  
- 介面文案至少支援繁體中文與英文。  
- AI 輸出需跟隨用戶語言，而不是永遠固定英文或固定中文。  

## 產品風險與合規界線

**AI 成本風險**

最大的成本風險不是單張分析本身，而是你若太早做「每個 frame 都雲端分析」或「大型多輪聊天」。現在官方定價都以 token 為基礎；OpenAI 影像輸入會轉成 tokens，Gemini 也是按 input/output/cached token 計費，所以真正成本會受到圖片尺寸、壓縮、prompt 長度、輸出長度影響。以目前官方公開價格來看，成本優先的路線會比較接近 OpenAI 的 mini/nano 級模型，或 Gemini 的 Flash-Lite 級模型，而不是一開始就上前沿大模型；但**每張照片實際成本仍需用真實 sample 跑測**，不能只用文字 token 心算。citeturn11view2turn15view0turn17view0turn17view1turn31view0

**圖片儲存成本風險**

真正會把成本慢慢墊高的，其實是雲端保存與長期留存。因此免費用戶保留 20 張、長期不活躍 90 日後清理，是合理而且必要的產品邊界。Firebase 的 scheduled functions 可直接做週期清理，而且官方寫明 Cloud Scheduler job 的成本通常可控，每個 job 每月 0.10 美元，且每個 Google account 有 3 個免費 job 額度。對小型 MVP 來說，這是便宜、明確、可落地的作法。citeturn19view5

**即時 AI 建議技術難度**

如果你把「即時」理解成每秒都把 camera frame 丟去雲端模型，那第一版幾乎一定會把速度、成本、散熱、電量、穩定性與隱私一起放大。更好的第一步是：用本機 Vision 做姿勢點位、框線與簡單提示，用雲端 AI 做「拍完這一張後怎麼改」。這樣既符合 Apple 的 on-device 隱私優勢，也符合你的預算上限。citeturn23search0turn23search15turn28view1turn11view2turn31view0

**App Store 審核風險**

這個 App 目前最現實的審核風險有六個：

第一，若你提供 Google 登入，就必須提供 Sign in with Apple。  
第二，若你支援帳戶建立，就必須支援 App 內刪除帳戶。  
第三，若你的核心功能不是社交身分本身，就不應把登入硬綁在第一步。  
第四，隱私政策要明寫資料收集、用途、保存與刪除。  
第五，把照片分享給第三方 AI 時，要明確揭露並取得明確同意。  
第六，首頁可以參考 Dazz 的相機選擇心理模型，但不能做成 copycat UI。citeturn24view1turn24view2turn2view6turn3view1turn1view0

**私隱與人臉照片風險**

你的圖片很可能包含人臉，所以最重要的決策不是「能不能送第三方 AI」，而是「送到哪一種方案」。  
OpenAI 官方明寫：API 資料預設不會拿去訓練模型，但預設會保留最多 30 天的 abuse monitoring logs。  
Gemini 官方則明寫：**Unpaid Services** 會使用你提交的內容與回應來改進與開發 Google 產品，且可能有人審；**Paid Services** 則不會拿 prompts、files、responses 去改進產品，但仍會為安全與違規防護保留有限期間的 logs。  
因此，若你的正式版照片可能包含人臉或其他個資，**不要把 Gemini 免費／未付費配額當成正式生產路徑**；若你用 OpenAI API 或 Gemini Paid Services，雖然資料預設不拿去訓練，但因為仍有 retention／logging，App Privacy、隱私政策與 consent sheet 仍要把第三方 AI 處理寫清楚。citeturn11view0turn22view0

**用戶同意照片用作模型訓練的法律與平台風險**

這一點我會給你很明確的產品建議：**第一版不要預設要求用戶同意把照片拿去第三方模型訓練。**

原因不是道德口號，而是產品與審核風險：

Apple 要求你在與第三方、包括第三方 AI 分享個資時，明確揭露並取得明確許可；也要求你說明如何撤回同意與刪除資料。另一方面，Apple 的 App Privacy 對「collect」的定義是：資料離開裝置，且在超過即時服務請求所需時間內可被你或第三方存取，就可能算被收集。這代表只要外部 AI 服務保留 logs，你就很可能要做資料揭露。若你又額外加入「可用於模型訓練」，那不僅 consent、撤回、刪除、隱私政策與 App Privacy label 都會更複雜，實作上也必須跟**實際 provider／實際 plan**一一對齊。更關鍵的是，OpenAI API 與 Gemini Paid Services 官方都已提供「不拿資料改進產品」的路徑，所以你其實沒有必要在第一版主動走高風險路徑。citeturn3view1turn24view2turn28view1turn11view0turn22view0

更具體地說：

- 若用 **OpenAI API**：不要在同意文案裡寫成「你的照片可能被拿去訓練 OpenAI 模型」作為預設事實，因為官方說 API 預設不是這樣。citeturn11view0
- 若用 **Gemini Paid Services**：也不要寫成預設會訓練，因為官方 Paid Services 不是這樣。citeturn22view0
- 若你真的想啟用資料分享／訓練：必須做成**獨立、可撤回、可審計**的 opt-in，而不是和一般服務條款綁在一起。Gemini 的 logs/datasets 分享與 OpenAI 的 opt-in data sharing 都屬於更高風險設定。citeturn11view1turn11view0

**廣告風險**

你有「VIP 無廣告」的商業方向，但我仍建議第一版**不要先接個人化廣告 SDK**。一旦接了廣告或某些分析 SDK，你就要處理更複雜的 App Privacy 揭露，甚至可能牽涉 ATT。MVP 階段先把營收重點放訂閱，不要一開始同時處理訂閱、廣告、ATT、隱私標籤與多家 SDK 的組合爆炸。citeturn28view2turn28view1

**建議第一版不要做的功能**

- 完整 AR 導拍  
- 真正即時 video streaming AI  
- 複雜姿勢骨架追蹤  
- 3D pose overlay  
- 多人同時導拍  
- 社交分享社群  
- 完整 AI 改圖工作室  
- 個人化廣告  
- Android 版本  
- 超過 10 個以上的相機／鏡頭 preset 套件

## Codex 開發階段與可執行任務清單

下面這份拆分，是以 **「最短時間做出可測 MVP」** 為主，而不是「一開始就把所有正式版設計做完」。

### 建議 Repo 骨架

```text
App/
  AppEntry/
  Features/
    Home/
    Camera/
    Analysis/
    History/
    Auth/
    Settings/
    Subscription/
  Services/
    Firebase/
    AI/
    Camera/
    ImageProcessing/
    Subscription/
  Models/
  Resources/
    Localization/
    Assets/
functions/
  src/
    ai/
    quota/
    cleanup/
    user/
firestore.rules
storage.rules
firebase.json
README.md
```

### 開發階段拆分

**Phase 0 Repo 初始化**

交付物：

- 建立 iOS 原生專案  
- 設定 SwiftUI app lifecycle  
- 加入 Firebase 與 Google Sign-In 套件  
- 建立 App 模組目錄  
- 建立 zh-Hant / en 本地化骨架  
- 建立 `.env` / config placeholder  
- 建立 README 與開發流程文件  
- 建立 `firestore.rules`、`storage.rules`、`firebase.json`

完成定義：

- 專案可成功 build  
- 空白 tab/navigation 架構可跑  
- Firebase config 可注入不同環境

**Phase 1 Firebase Auth**

交付物：

- Email/password 註冊登入  
- Google login  
- Apple login  
- Guest / try mode  
- Settings 頁登出  
- Settings 頁刪除帳戶入口  
- 同意狀態與 user profile 寫入 Firestore

完成定義：

- 三種登入都能成功建立 session  
- Guest 可以進入體驗  
- Account deletion 能觸發完整資料刪除流程

**Phase 2 相機與相簿**

交付物：

- 相機預覽  
- 快門拍照  
- 單張照片預覽  
- PhotosPicker 單張匯入  
- 基本 crop / resize / thumbnail pipeline  
- Grid overlay

完成定義：

- 用戶能從相機或相簿得到一張可供分析的圖片  
- Image resize 後可進入下一步

**Phase 3 Firebase Storage 與 Firestore**

交付物：

- Storage 上傳原圖或壓縮圖  
- Storage 上傳縮圖  
- Firestore 建立 `users` / `photos` / `analyses` / `entitlements`  
- 歷史列表 query  
- 刪除單張圖片與 metadata  
- 免費 20 張上限邏輯

建議最小資料結構：

- `users/{uid}`：plan、analysisCredits、photoLimit、lastLoginBonusAt、consents、locale、lastActiveAt  
- `photos/{photoId}`：uid、storagePath、thumbPath、source、presetId、createdAt  
- `analyses/{analysisId}`：uid、photoId、summary、adviceList、exposure、whiteBalance、contrast、composition、pose、language、provider、model、createdAt  
- `entitlements/{uid}`：tier、status、expiresAt、updatedAt

完成定義：

- 重新登入後可看見歷史  
- 第二台裝置能同步  
- 刪除會同步消失

**Phase 4 AI 分析 API**

交付物：

- 建立 callable function：`analyzePhoto`  
- 建立 callable function：`claimDailyLoginBonus`  
- 建立 callable function：`deleteAllUserData`  
- provider adapter：`OpenAIAdapter`、`GeminiAdapter`  
- 結構化輸出 schema  
- zh-Hant / en prompt template  
- consent gate  
- 成本記錄欄位：provider、model、latencyMs、tokenUsage

建議 `analyzePhoto` 回傳格式：

```json
{
  "sceneType": "portrait | food | landscape | unknown",
  "summary": "短總結",
  "adviceList": ["建議一", "建議二", "建議三"],
  "adjustments": {
    "exposure": "-0.3",
    "whiteBalance": "+200K",
    "contrast": "+5",
    "framing": "move-left",
    "pose": "turn-shoulder"
  },
  "nextShotHint": "再拍時的下一步"
}
```

完成定義：

- App 能從一張圖得到結構化短建議  
- 免費額度會正確扣減  
- 失敗可重試  
- 可切換 provider

**Phase 5 基本濾鏡**

交付物：

- 至少 3 個可用 preset  
- preset preview  
- 套用後保存  
- preset metadata 寫入 Firestore

完成定義：

- 用戶能清楚區分不同風格  
- 保存後歷史頁可看出當時用的 preset

**Phase 6 歷史紀錄**

交付物：

- 歷史列表  
- 歷史詳情頁  
- 顯示 AI 摘要與數值建議  
- 刪除單張  
- 空狀態頁  
- 免費 20 張滿額提示

完成定義：

- 歷史頁可完整支援 MVP 回看流程  
- 無需聊天紀錄也能回看建議結果

**Phase 7 訂閱頁**

交付物：

- 免費 vs VIP 差異頁  
- paywall 文案  
- StoreKit 2 skeleton  
- 本地 entitlement 判斷  
- 訂閱後 UI state 改變

完成定義：

- App 內可看到訂閱頁  
- 受限制功能會正確導向 paywall  
- 如果先不做公開版購買，至少內部測試版要有完整文案與畫面骨架

**Phase 8 測試與部署**

交付物：

- 單元測試：quota、history limit、consent gate  
- UI 測試：登入、拍照、匯入、分析、保存、刪除  
- Firestore rules / Storage rules 測試  
- App Check  
- scheduled cleanup function：`cleanupExpiredFreeAssets`  
- TestFlight build  
- App Store metadata、隱私政策、App Privacy answers 初稿

完成定義：

- 主要 happy path 全通  
- 主要失敗情境都有 fallback  
- 免費用戶 90 日清理 job 可正常跑  
- 上線前風險文件完成

上線前建議啟用 App Check；Firebase 官方說明，App Check 可透過 App Attest 或 DeviceCheck 驗證流量確實來自你的正版 App，而 callable functions 也能自動帶上 Auth 與 App Check token。這對防止盜刷分析額度與濫用後端非常重要。citeturn20search10turn20search2turn30search2

### Codex 可執行任務清單

- [ ] 建立 SwiftUI iOS 專案與模組目錄  
- [ ] 接上 Firebase Core、Auth、Firestore、Storage、Functions  
- [ ] 完成 email/password 登入  
- [ ] 完成 Google login  
- [ ] 完成 Apple login  
- [ ] 加入 guest / try mode  
- [ ] 做相機預覽、拍照、單張預覽  
- [ ] 做 PhotosPicker 單張匯入  
- [ ] 做圖片 resize、thumbnail、preset apply pipeline  
- [ ] 建立 `users`、`photos`、`analyses`、`entitlements` 資料結構  
- [ ] 上傳 Storage 並寫入 Firestore metadata  
- [ ] 建立 `analyzePhoto` callable function  
- [ ] 建立 `claimDailyLoginBonus` callable function  
- [ ] 建立 `deleteAllUserData` callable function  
- [ ] 建立 `cleanupExpiredFreeAssets` scheduled function  
- [ ] 接一個 AI provider adapter，保留第二個 provider adapter 介面  
- [ ] 規定 AI 回傳短 JSON，不接受長散文  
- [ ] 做免費 20 次分析與每日加一邏輯  
- [ ] 做免費 20 張雲端保存上限  
- [ ] 做歷史列表、詳情、刪除  
- [ ] 做設定頁：隱私政策、同意狀態、登出、刪除帳戶  
- [ ] 做訂閱頁雛形  
- [ ] 規劃但暫不實作 VIP 追問聊天  
- [ ] 完成 Firestore / Storage Security Rules  
- [ ] 啟用 App Check  
- [ ] 做 TestFlight 內測包  
- [ ] 撰寫 App Privacy / consent / paywall 文案初稿  

**最後的產品邊界一句話**

第一版要證明的，不是「AI 可以做多少花式功能」，而是：  
**用戶拿起 App，選一個復古 preset，拍一張照，立刻得到一個真的有用的短建議，並且願意再拍第二張。**