# 訂閱制、額度、App Store 與商業模式報告

## 核心結論

這個 App 的 MVP 應該明確採用 **StoreKit 2 + StoreKit SwiftUI views**，並只做 **一個 auto-renewable subscription group**，底下放兩個商品：**月費 VIP** 與 **年費 VIP**。原因很直接：Apple 對 App 內數位功能解鎖要求使用 In-App Purchase；自動續訂訂閱必須提供持續價值、可在使用者所有裝置上使用；而 Apple 也明確禁止把裝置內建能力，例如相機，當成可付費解鎖的能力。因此，你的可付費點應放在 **AI 分析額度、雲端保存量、原圖保存、高級 preset、未來 VIP 追問與未來進階功能**，而不是基本相機或基本濾鏡。若你要照你的要求使用 `SubscriptionStoreView` / `ProductView` 等 StoreKit views，官方可用版本是 **iOS 17+**，所以最省事的 MVP 建議把部署目標直接設為 **iOS 17**。 citeturn41search1turn24view1turn35view1turn14search1turn25search0turn25search2

商業模型上，我建議你在 MVP 只賣 **兩個 SKU**：`com.yourapp.vip.monthly` 與 `com.yourapp.vip.yearly`。**不建議一開始就做 lifetime plan**，因為你的主要 premium 成本是持續性的 AI、雲端儲存與客服支援，和 auto-renewable subscription 的商業邏輯更吻合；**也不建議在 MVP 再疊一層 free trial**，因為免費版本身已經提供 20 次起始分析 + 每日 +1，這已經是很完整的「體驗入口」。Apple 官方支援 auto-renewable subscriptions 的 introductory offers，包括 **free trial**、**pay as you go** 與 **pay up front**，等你有初步轉換率數據，再決定是否加 3 天或 7 天試用會更合理。定價方面，我建議先上 **HKD 38/月** 與 **HKD 298/年**，並在 App Store Connect 選最接近的 price point。若你符合 App Store Small Business Program，Apple 對付費 App 與 In-App Purchases 的佣金可降到 **15%**。 citeturn29search1turn29search2turn29search0turn27view1turn27view2

MVP 的核心原則也要寫死：**VIP 不是相機開關**。Apple 的審核指南寫得很清楚，不能把相機這類硬體或系統內建能力本身拿來付費解鎖；所以你的付費層級應該圍繞「附加價值」，例如更高 AI 使用量、更高保存量、原圖保存、進階 preset 與未來聊天式教練，而不是「能不能拍照」。這一點不只是產品定位正確，也是過審風險控制。 citeturn35view1

## 方案設計與額度模型

我建議 MVP 的免費版與 VIP 權益，不要使用「無限」這種容易在 App Review、消費者認知與日後成本控制上出問題的說法，而是從一開始就寫成 **明確上限**。Apple 要求訂閱在購買前清楚描述使用者能得到什麼，所以 paywall 與訂閱介紹頁面應該直接寫具體數字，而不是只寫「更多」。 citeturn24view1

**免費版建議**如下。新使用者在第一次完成可追蹤帳號建立後，得到 **20 次 starter analyses**。之後每天登入最多補 **1 次免費分析**，但我建議加一個 **carry cap = 30**，避免長期不使用的帳號無限囤積額度。免費版另外有 **20 張雲端相片上限**，且只保存 **preview/compressed** 圖，不保存 original。免費版可以使用相機、基本濾鏡、相簿匯入、AI 單張分析，但不能用未來的 VIP 追問、高級 preset、原圖保存或更高保存量。這樣的設計同時滿足「可用」、「可升級」與「可控成本」。訂閱部分則必須提供持續性價值，所以免費版與 VIP 的差異要集中在 AI 與雲端，而不是一次性靜態內容。 citeturn24view1turn35view1

**VIP 建議**如下。MVP 先不要做複雜 add-on，也不要做多層方案。年費與月費都給同樣權益，只是年費比較便宜。具體建議是：**每 30 天最多 300 次 AI 分析**、**最多 500 張雲端相片**、**可保存 original**、**可用高級 preset**，以及預留未來的 **VIP follow-up / chat** 權限欄位，但在 MVP 先只做 entitlement，不做完整聊天。之所以選「每 30 天 300 次」而不是「無限」，是因為你已經把產品定位為單張拍攝教練，不是高頻批次修圖工具；這樣的限制夠用、容易寫進 paywall，也便於成本預估與防濫用。Apple 也明確指出，訂閱不應要求使用者透過額外任務才能獲得他們已付費的內容，所以 VIP 額度不要綁每日簽到才能啟用；VIP 的 higher limit 應直接根據有效訂閱給到位。 citeturn35view1

為了讓 Codex 好做、後端也容易防作弊，我建議把資料模型落在以下幾個文件路徑，全部以 **同一個 Firebase UID** 為核心。Firebase 官方也建議在多登入供應商情境下把 provider 連到同一個使用者帳號，這樣 Email/Apple/Google 登入都會共用同一個 Firebase user ID；這對合併 starter 額度、VIP 狀態與歷史紀錄非常重要。 citeturn21search0turn21search5

```text
users/{uid}

users/{uid}/usageQuotas/current
users/{uid}/subscriptionEntitlements/current
users/{uid}/billing/current
users/{uid}/dailyLoginRewards/{dayKey}
users/{uid}/analysisTransactions/{txId}
```

建議欄位如下。這些是 **MVP 夠用** 的最小集合，不要再拆太細：

```json
// users/{uid}
{
  "displayName": "Moon",
  "email": "ggbmoon@gmail.com",
  "preferredLanguage": "zh-Hant",
  "createdAt": "serverTimestamp",
  "lastActiveAt": "serverTimestamp",
  "trainingConsent": false,
  "aiAnalysisConsentAt": "timestamp|null"
}
```

```json
// users/{uid}/usageQuotas/current
{
  "starterGranted": true,
  "starterAnalysesTotal": 20,
  "freeBalance": 20,
  "freeBalanceCarryCap": 30,
  "dailyLoginRewardAmount": 1,
  "lastDailyBonusDayKey": "2026-06-07",
  "rolling30AnalysisUsed": 0,
  "rolling30AnalysisWindowKey": "2026-05-09..2026-06-07",
  "freeCloudPhotoCap": 20,
  "vipCloudPhotoCap": 500,
  "cloudPhotoCount": 0,
  "updatedAt": "serverTimestamp"
}
```

```json
// users/{uid}/subscriptionEntitlements/current
{
  "tier": "free",
  "status": "none",
  "productId": null,
  "sourceOfTruth": "storekit_device",
  "features": {
    "canStoreOriginal": false,
    "canUsePremiumPresets": false,
    "canUseVipFollowUp": false,
    "rolling30AnalysisCap": 20,
    "cloudPhotoCap": 20
  },
  "effectiveUntil": null,
  "updatedAt": "serverTimestamp"
}
```

```json
// users/{uid}/billing/current
{
  "tier": "free",
  "productId": null,
  "environment": "StoreKitTest|Sandbox|Production",
  "latestTransactionId": null,
  "originalTransactionId": null,
  "purchaseDate": null,
  "expirationDate": null,
  "revocationDate": null,
  "lastSyncedAt": "serverTimestamp",
  "syncSource": "device_cache"
}
```

```json
// users/{uid}/dailyLoginRewards/{dayKey}
{
  "dayKey": "2026-06-07",
  "amount": 1,
  "grantedAt": "serverTimestamp",
  "idempotencyKey": "uid_2026-06-07"
}
```

```json
// users/{uid}/analysisTransactions/{txId}
{
  "type": "starter_grant|daily_bonus|analysis_consume|manual_adjust|vip_override",
  "delta": -1,
  "balanceAfter": 19,
  "photoId": "photo_123",
  "analysisId": "analysis_456",
  "provider": "gemini-2.5-flash",
  "cacheKey": "sha256(normalizedPreview+promptVersion+model)",
  "createdAt": "serverTimestamp"
}
```

這裡最重要的安全原則是：**iOS client 只讀 quota / entitlement，不直接寫 balance 或 billing 狀態**。因為 Firebase 官方文件明確說明，server client libraries 會繞過 Firestore Security Rules；也就是說，真正應該改動 balance、grant daily bonus、同步 billing cache 的，應該是 **Cloud Functions**，不是 app 直寫。對 client 而言，Rules 要求只能讀自己的資料；對 server 而言，Admin SDK 是受信任通道。Storage/Firestore 的 user-based control 也都應依賴 `request.auth.uid`。 citeturn39search0turn39search1

對應的安全規則草稿可以先寫成這樣：

```javascript
// firestore.rules
match /users/{uid} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow update: if request.auth != null && request.auth.uid == uid
                && !("trainingConsent" in request.resource.data.diff(resource.data).affectedKeys());
}

match /users/{uid}/usageQuotas/{docId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false; // Cloud Functions only
}

match /users/{uid}/subscriptionEntitlements/{docId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false; // Cloud Functions only
}

match /users/{uid}/billing/{docId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false; // Cloud Functions only
}

match /users/{uid}/dailyLoginRewards/{docId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false; // Cloud Functions only
}

match /users/{uid}/analysisTransactions/{docId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow write: if false; // append-only from Cloud Functions
}
```

## StoreKit 方案與同步流程

MVP 我明確建議使用 **StoreKit 2 原生方案**，而不是預設導入 RevenueCat。StoreKit 2 本身已經提供現代 Swift/SwiftUI API、StoreKit views、App Store 簽名交易、`currentEntitlements`、`updates`、`AppStore.sync()`，還有 Xcode `.storekit` 本地測試與 `StoreKitTest` 自動化測試。對一個 **iOS-first、先做一個訂閱群組、兩個 SKU** 的 MVP 來說，這組工具已經足夠，而且是最少外部依賴、最適合 Codex 逐步生成的方案。 citeturn25search2turn37search3turn14search0turn14search3turn14search6

RevenueCat 的定位也很清楚：它提供自己的 backend，包住 StoreKit 與 Google Play Billing，讓你更容易做跨平台 entitlement、dashboard、webhooks、A/B 測試與 growth tools；而且官方目前的定價是 **每月 tracked revenue 低於 USD 2,500 免費，之後收 1%**。這對未來 Android、Web、跨平台統一收入分析很有價值；但以你目前的條件來看，它會多一層 vendor、dashboard、同步策略與故障面。換句話說，它不是「不能用」，而是 **現在還不值得先用**。你的 MVP 先讓 StoreKit 2 自己跑順，等真的要做 Android / Web / App Store Server Notifications / marketing analytics，再導入 RevenueCat 會更乾淨。 citeturn22view1turn22view0

MVP 的訂閱狀態同步，建議採用 **本地真相 + Firestore cache**。也就是說，**App 端的 StoreKit verified transactions 是解鎖 UI 的即時來源**，而 Firestore `users/{uid}/billing/current` 只是 cache，方便跨頁面、客服與後端配額邏輯使用。StoreKit 官方說明，`Transaction.currentEntitlements` 會提供目前仍然有效的訂閱與 IAP，且 **已退款或已撤銷的項目不會出現在 current entitlements**；`Transaction.updates` 會在 App 執行期間持續送出新的交易，包括其他裝置上的完成交易；而 `AppStore.sync()` 的官方說法是 StoreKit 本身會自動讓 app 在重裝與新裝置上拿到交易資訊，所以在大多數情況下並不需要使用者手動「恢復購買」，但仍然可以提供一個 restore / refresh 入口來處理支援情境。 citeturn37search0turn37search1turn37search2turn37search5

所以，MVP 的同步流程我建議這樣寫：

```text
App launch
→ start Transaction.updates listener
→ read Transaction.currentEntitlements
→ derive EntitlementState on device
→ update UI immediately
→ call syncSubscriptionStatus() callable
→ Cloud Function writes users/{uid}/billing/current and subscriptionEntitlements/current
```

`syncSubscriptionStatus` 在 **MVP 階段** 不需要做完整的 Apple Server API 驗證；它先作為 **device-signed status cache writer** 就夠。因為 StoreKit 2 已經給你 App Store 簽名的交易資訊，可以在裝置上做 verified entitlement。等正式版再把同一個 callable 升級成真正的 Apple server verification，並補上 App Store Server Notifications / Server API。Apple 官方也說明，App Store Server API 是 **server-side 的 REST API**，可根據交易 ID 查詢訂閱狀態，而且與使用者是否安裝 App 無關；這正適合你未來做退款、取消、billing retry、客服查詢與 server-side entitlement。 citeturn37search3turn26search0turn26search1

MVP 的 callable contract 可以先固定成這樣：

```json
// syncSubscriptionStatus request
{
  "environment": "StoreKitTest|Sandbox|Production",
  "productId": "com.yourapp.vip.monthly",
  "transactionId": "200000000000001",
  "originalTransactionId": "200000000000001",
  "purchaseDateMs": 1780819200000,
  "expirationDateMs": 1783411200000,
  "revocationDateMs": null
}
```

```json
// syncSubscriptionStatus response
{
  "tier": "vip",
  "status": "active",
  "sourceOfTruth": "storekit_device",
  "canStoreOriginal": true,
  "cloudPhotoCap": 500,
  "rolling30AnalysisCap": 300,
  "effectiveUntilMs": 1783411200000
}
```

iOS 端建議建立以下模組與檔案：

```text
ios-app/App/Monetization/PremiumProduct.swift
ios-app/App/Monetization/EntitlementState.swift
ios-app/App/Monetization/StoreKitManager.swift
ios-app/App/Monetization/SubscriptionService.swift
ios-app/App/Features/Paywall/PaywallView.swift
ios-app/App/Features/Settings/ManageSubscriptionView.swift
ios-app/Resources/StoreKit/RetroCoach.storekit
```

而 functions 端則建議：

```text
functions/src/billing/syncSubscriptionStatus.ts
functions/src/quota/grantDailyLoginBonus.ts
functions/src/quota/consumeAnalysisQuota.ts
functions/src/quota/getQuotaSnapshot.ts
```

## App Store 合規與 Paywall 策略

你的 paywall 觸發點應該非常克制，只在「高價值升級場景」出現，而不是在使用者一打開相機時就擋住。最合理的 MVP 觸發點有五個：**分析額度用完**、**嘗試保存原圖**、**想保存第 21 張以上雲端相片**、**點到 premium preset**、**點未來 VIP follow-up 入口**。相反地，**不應在開啟基本相機、使用基本濾鏡、取景、拍照、相簿匯入時出現 paywall**。這不只是 UX 比較健康，也符合 Apple 對 built-in capability 的態度。 citeturn35view1

Paywall 內容本身必須「可審核、可理解、可對帳」。Apple 對訂閱的要求不是只要能付款就好，而是你在訂閱前要清楚說明使用者能拿到什麼、升降級體驗要平順、不能讓使用者不小心同時訂到多個變體。因此你的月費與年費一定要放在 **同一個 subscription group**；畫面上要直接寫出 **價錢、週期、每 30 天 AI 分析上限、雲端保存上限、是否保存 original、是否含 premium presets**，以及「自動續訂，直到取消」這類文案。不要寫「無限分析」「無限保存」；在這個階段，寫死上限反而比較安全。 citeturn24view1turn35view1

一段可直接落地的 paywall 主文案，可以長這樣：

> 免費版：20 次起始 AI 分析、每日登入 +1、最多 20 張雲端預覽圖。  
> VIP：每 30 天最多 300 次 AI 分析、最多 500 張雲端相片、可保存原圖、可用高級底片 preset。  
> 訂閱會自動續訂，直到你在 Apple 帳號中取消。

在 App Store 合規上，還有幾個你不能忽略的點。第一，你一旦提供 Google Sign-In 之類的第三方登入作為主帳號登入方式，就必須提供 **Sign in with Apple** 作為等效選項。第二，Apple 目前要求只要 App 支援 account creation，就必須在 App 內提供 **account deletion**，而且刪除流程要容易找到、刪的是整個帳號與關聯個資，不只是 deactivation。第三，如果使用者刪帳時還有 auto-renewable subscription，Apple 的官方建議是清楚提醒「Apple 端的計費仍會持續，請先取消訂閱」，並提供管理訂閱入口；在 iOS 15+ 可以用 `showManageSubscription`，退款則可用 `beginRefundRequest`。 citeturn24view0turn36view0

你的 AI/照片處理流程在隱私上也有明確風險控制要求。Apple 最新官方說明已把 **third-party AI** 明文放進資料分享規範：如果你要把個人資料分享給第三方，包括第三方 AI，就必須清楚揭露分享對象與用途，並在分享前取得 **explicit permission**。另外，App Store 的 privacy details 也要求你在 App Store Connect 申報你自己與第三方夥伴收集的資料，以及資料用途；而且如果資料使用方式改變，必須更新。這直接支持你現在的產品邊界：**AI 分析 consent 要獨立顯示；trainingConsent 預設 false；如果未來真的要把照片用於模型改善，必須是獨立、可撤回、可審計的 opt-in，不能綁進一般 AI 分析同意裡。** citeturn24view2turn23search0turn23search2turn23search5

另外，Apple 也明確寫到：如果 App 的核心功能並不依賴帳號，就不應把登入當成使用門檻。因此，從 App Review 角度來看，**更穩妥的做法**是讓未登入使用者先使用基本相機與本地濾鏡；等到他要做 AI 分析、雲同步、歷史紀錄、訂閱或跨裝置同步時，再要求登入。這和你的產品也很一致：拍照優先、升級與雲功能後置。至於 User-Generated Content 規範目前對你不是主風險，因為你沒有社群分享；但如果未來做社群或公開相簿，1.2 的 moderation、report、block 流程都會變成必需項。 citeturn35view1turn24view1

最後，送審時要在 App Review Notes 裡主動交代三件事：**AI 分析 consent 在哪裡**、**paywall 出現在哪些場景**、**如何測試月費/年費與刪帳流程**。Apple 官方在送審前清單中也明確要求，如果 App 有帳號功能，就提供 demo account 或完整 demo mode，並對不明顯的功能與 IAP 在 review notes 裡給詳細說明。 citeturn41search1

## 成本推算與防濫用

從成本角度看，你的 HKD 1000/月預算對 **100 位初期使用者** 其實很寬。真正需要注意的不是「會不會不夠」，而是「會不會因為規則寫錯或選錯模型而意外超支」。先講 Firebase：Cloud Storage for Firebase 現在已要求專案在 **Blaze** pay-as-you-go 方案上才能使用 bucket，但即使在 Blaze，仍然會有 no-cost usage；而且 Google Cloud Storage 的 Always Free 在特定美國區域提供 **5 GB Standard Storage、5,000 次 Class A、50,000 次 Class B、100 GB data transfer**。如果你把 bucket 放在這些 Always Free 區域，小型 MVP 幾乎吃不到明顯儲存費；即使不用 Always Free，Cloud Storage Standard 的起始價格也只是 **USD 0.02 / GiB / month**。 citeturn15view5turn33view0turn33view1

拿你自己的假設來算：100 位用戶、每位先存 20 張、每張 preview 約 1 MB，總 preview 只有 **約 2 GB**。以 Cloud Storage 起始價 USD 0.02/GiB-month 粗算，原始儲存費大約只在 **幾美分美元等級**。就算再加上縮圖與少量 VIP original，儲存費依然遠低於 AI 成本。下載流量也通常還是小數目；即使離開 free tier，一般外部 data transfer 起始價也只是 **USD 0.08/GiB**。因此，這個產品的 MVP 成本主體幾乎一定是 **AI，不是 Storage**。 citeturn33view1

Firestore 也同樣便宜。官方列出的 free tier 是 **1 GiB storage、50,000 reads/day、20,000 writes/day、20,000 deletes/day、10 GiB outbound/month**。對 100 位用戶的 MVP 來說，只要你的歷史頁用 pagination，不開大量 chatty realtime listeners，大概率能把 Firestore 成本壓在免費額度之內或非常接近免費。不過要注意，Firestore 官方也明確說明：如果 Security Rules 用到 `get()`、`exists()`、`getAfter()` 去讀依賴文件，這些規則評估會產生額外 reads。因此，規則裡引用 quota / entitlement 文件要克制，只引用少量、固定路徑即可。 citeturn16view0turn16view4

Cloud Functions v2 方面，關鍵不是單價，而是配置方式。Firebase 官方說明第 2 代函式可以設定 **memory、timeout、min/max instances、concurrency**；而底層走 Cloud Run。Cloud Run / 2nd gen functions 最重要的省錢做法是 **request-based billing + `minInstances: 0`**，因為 request-based billing 只在處理請求時收費；一旦你開了最少執行個體保暖，才會開始有固定閒置成本。對你這種早期低流量產品，`minInstances` 應該維持 0，`maxInstances` 則保守設一個上限避免爆量。 citeturn19view0turn34search1turn34search2

AI 成本則可以比較具體地算。Gemini Developer API 官方目前對 **Gemini 2.5 Flash Standard** 的定價是 **input USD 0.30 / 1M text-image-video tokens，output USD 2.50 / 1M tokens**；對 **Gemini 2.5 Flash-Lite Standard** 則是 **input USD 0.10 / 1M，output USD 0.40 / 1M**。如果你先用 Flash 做 MVP，而且把 prompt 與 JSON 壓得夠短，假設一個保守但好實作的估算：**每次分析約 8,000 input tokens + 800 output tokens**，那單次成本大約是 **USD 0.0044**；3,000 次分析約 **USD 13.2**，10,000 次分析約 **USD 44**。這代表即使你給 100 個人一個不算小的免費體驗，單純 AI 費用仍在很可控的範圍內。若日後要更激進省成本，甚至可以用 Remote Config 把免費用戶改路由到 Flash-Lite。這個「不同模型路由」是你最有力的成本保險。 citeturn31view0

綜合來看，對 100 人 MVP 而言，**HKD 1000/月是足夠的**。更保守地說，只要你不做以下幾件事，就很難接近這條線：一是免費用戶也傳 original；二是把分析模型升到更貴的大模型；三是 Functions 設了 `minInstances`；四是允許同一張圖重複分析又重複扣額；五是讓 daily bonus 可以被腳本濫刷。Firebase 官方也建議開 **budget alerts**，這應該在你建立 Blaze billing 帳號的第一天就完成。 citeturn15view3turn15view5

防濫用策略上，我建議你做五件很實際的事。第一，對 callable functions 啟用 **App Check enforcement**；Firebase 官方說明 callable requests 會自動帶上 App Check，且可在函式端用 `enforceAppCheck: true` 拒絕無效要求。第二，只在特別敏感的端點，例如 `grantDailyLoginBonus`，考慮開啟 **limited-use App Check token / replay protection**，因為官方也提醒它會增加延遲，不必每一個 AI call 都開。第三，所有 free starter、daily +1、quota consume 都必須用 **Cloud Functions + server time + idempotency key**。第四，對 AI 結果做 **cache**：同一張 normalized preview、同一個 `promptVersion`、同一個 model，在短期內直接回舊結果且不重複扣額。第五，把 **模型選擇、free cap、VIP cap、是否顯示 premium follow-up 開關** 放進 Remote Config；Firebase 官方也明確說 Remote Config 可以在不發版的前提下改變 app 行為，但**不要把 secrets 放進 Remote Config**。 citeturn20view1turn20view0turn40search0turn40search6

## Codex 任務清單與驗收標準

下面這份清單，是我建議直接交給 Codex 的第一批 monetization 任務。順序刻意拆小，避免一次改太多而壞掉。

**第一批檔案與模組**

```text
ios-app/App/Monetization/PremiumProduct.swift
ios-app/App/Monetization/EntitlementState.swift
ios-app/App/Monetization/StoreKitManager.swift
ios-app/App/Monetization/SubscriptionService.swift
ios-app/App/Monetization/QuotaService.swift
ios-app/App/Features/Paywall/PaywallView.swift
ios-app/App/Features/Settings/ManageSubscriptionView.swift
ios-app/Resources/StoreKit/RetroCoach.storekit

functions/src/billing/syncSubscriptionStatus.ts
functions/src/quota/grantDailyLoginBonus.ts
functions/src/quota/consumeAnalysisQuota.ts
functions/src/quota/getQuotaSnapshot.ts

docs/monetization-plan.md
firestore.rules
storage.rules
```

**建議的任務拆分**

- **任務一**：建立 `PremiumProduct.swift`、`EntitlementState.swift` 與 `.storekit` 測試檔。先把兩個 product ID、方案名稱、是否 premium 的 enum 與測試商品建起來。
- **任務二**：建立 `StoreKitManager.swift`。要能載入 products、購買、監聽 `Transaction.updates`、讀取 `Transaction.currentEntitlements`、呼叫 `AppStore.sync()`。
- **任務三**：建立 `PaywallView.swift`，先用 `SubscriptionStoreView` 或產品列表畫出最小可用 paywall，文案直接寫明：免費 20 次起始分析、每日 +1、免費 20 張預覽圖；VIP 每 30 天 300 次分析、500 張、原圖保存、高級 preset。
- **任務四**：建立 `QuotaService.swift`，從 Firestore 讀 `usageQuotas/current` 與 `subscriptionEntitlements/current`，對外暴露 `canAnalyze`、`canSaveOriginal`、`canSaveToCloud`。
- **任務五**：建立 `grantDailyLoginBonus.ts` 與 `consumeAnalysisQuota.ts`，全部用 server timestamp 與 idempotency。
- **任務六**：建立 `syncSubscriptionStatus.ts`，先實作 MVP 版 device-cache sync，不做 Apple server verification；更新 `billing/current` 與 `subscriptionEntitlements/current`。
- **任務七**：補 `ManageSubscriptionView.swift`，提供「Restore Purchases」「Manage Subscription」「Delete Account」入口。
- **任務八**：補 `firestore.rules` / `storage.rules`，確保 client 不可自行改動 quota / billing 文件。

**Codex 應達成的 acceptance criteria**

- 新使用者完成登入後，`usageQuotas/current` 會被正確建立，並得到 **20 次 starter analyses**。
- 同一個使用者在同一個 UTC+8 日曆日內，不論開 App 幾次，最多只拿到 **1 次每日登入 bonus**。
- 當免費餘額為 0 時，點 AI Analyze 會顯示 paywall，但 **基本相機與基本濾鏡仍可繼續使用**。
- 當免費使用者保存到第 21 張雲端圖時，會被阻擋新保存，並收到升級提示；已保存的 20 張仍可查看與刪除。
- VIP 訂閱成功後，UI 會在同一個 session 內更新 `EntitlementState`，並在數秒內同步到 Firestore `billing/current`。
- 在第二台已登入同帳號的裝置上，App 啟動後可透過 StoreKit entitlement 與 Firebase 資料看到相同 VIP 狀態與雲端歷史。
- 付費試圖保存 original 時成功；免費試圖保存 original 時被擋下並顯示 paywall。
- 刪除帳號畫面會清楚提示：**Apple 端訂閱可能仍持續，需到系統訂閱管理取消**，並提供可操作的管理入口。這與 Apple 的刪帳指引一致。 citeturn36view0

**測試 checklist**

- 新帳號首次登入後 quota 是否為 20。
- 同一天重複登入是否不會重複 +1。
- 第二天登入是否正確 +1。
- `.storekit` 月費購買成功後，premium preset 是否解鎖。
- `.storekit` 年費購買成功後，解鎖狀態是否與月費一致。
- `Restore Purchases` 之後，`Transaction.currentEntitlements` 與 Firestore cache 是否一致。
- StoreKit 測試讓訂閱過期後，是否能自動退回 Free entitlement。
- 免費用戶是否仍能開相機、拍照、套基本濾鏡。
- 未登入時是否至少能先試用基本相機 / 本地濾鏡；若你決定不做 guest mode，則送審前需重新評估 App Review 風險。
- 刪帳流程是否真的刪除 Firebase user data，且不只是 disable。
- App Review demo mode 或 demo account 是否可完整演示 paywall、結果頁、設定頁與刪帳頁。 citeturn35view1turn36view0turn41search1

**最終推薦技術棧**

MVP 的 monetization，我明確推薦：**StoreKit 2 + StoreKit views + 本地 `.storekit` 測試檔 + Firestore `billing/current` cache + Cloud Functions server-side quota control**。這條路對你目前的 iOS-first、Firebase-first 架構最省事、最便宜，也最適合 Codex 分階段生成。 citeturn25search2turn14search0turn20view0turn39search0

**不推薦在 MVP 預設採用的方案**

我不建議你把 **RevenueCat** 當成 MVP 預設依賴，也不建議一開始做 **trial + lifetime + 多層商品 + add-on packs**。前者是因為 iOS-only MVP 的收益不夠大，後者是因為你還沒有轉換數據，商品複雜度只會拖慢開發與測試。等你做出第一個可收費版本、開始看 churn、年費轉換與跨平台需求，再考慮 RevenueCat、Apple Server API 與 Server Notifications，時機會更對。 citeturn22view0turn22view1turn26search0