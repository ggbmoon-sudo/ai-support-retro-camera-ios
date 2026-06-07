# Firebase 資料庫、Storage、權限與成本設計報告

## 架構總覽

以你已定的技術邊界來看，這個 App 的 Firebase 最佳做法不是再拆更多服務，而是把責任切乾淨：**Firebase Auth 做身份、Firestore 做 metadata 與 quota 狀態、Storage 放圖片本體、Cloud Functions v2 做所有有信任需求的業務邏輯、Remote Config 管功能旗標與模型切換、App Check 做防濫用**。這樣可以把 iOS client 保持輕量，也符合 Firebase 官方目前對 Authentication、Security Rules、Remote Config、App Check 與 Cloud Functions 第 2 代的建議使用方式。Firestore 位置建立後不可變更，而且官方明確建議把資料放在**靠近用戶與運算資源**的區域；若你重視低成本與低寫入延遲，MVP 應優先選**單一區域**而不是多區域。citeturn23view5turn23view2turn22view1turn22view0turn23view1turn22view6turn12search6turn0search7

有一個很重要、而且是近年變動很大的前提：**Cloud Storage for Firebase 現在需要 Blaze 計費方案**。Firebase 官方 FAQ 已寫明，自 **2026 年 2 月 3 日** 起，要繼續存取預設 bucket 與其他 Cloud Storage 資源，專案必須是 Blaze；另外，自 **2024 年 10 月 30 日** 起，新預設 bucket 的名稱格式已改成 `PROJECT_ID.firebasestorage.app`。這代表你的 MVP 從第一天起就應假設專案是 Blaze，但低量使用仍可吃到各自的免付費額度或低費率。citeturn16view3turn23view4turn0search6

我建議區域策略直接定成：**Firestore、Functions、Storage 都放同一個單一區域**，不要拆區。若你的首批用戶以香港為主，可選 `asia-east2`；若以台灣或台港混合為主，可選 `asia-east1`。Firestore 官方位置文件列出了 `asia-east1` 與 `asia-east2`，而 Storage 定價頁也列出相同亞洲區域；同區部署可以省去很多日後延遲與維運麻煩。citeturn15search1turn31view1

建議的 MVP 系統圖如下：

```text
iOS App
  ├─ Firebase Auth
  │   ├─ email/password
  │   ├─ Google login
  │   └─ Apple login
  ├─ Firebase Storage
  │   └─ 上傳 preview.jpg / thumb.jpg
  ├─ Cloud Firestore
  │   └─ 讀取自己的 users / photos / aiAnalyses / quotas / subscriptions
  ├─ Cloud Functions v2
  │   ├─ analyzePhoto
  │   ├─ grantDailyLoginBonus
  │   ├─ deletePhoto
  │   ├─ requestAccountDeletion / deleteAccountData
  │   ├─ syncSubscriptionStatus
  │   └─ cleanupExpiredPhotos
  ├─ Remote Config
  │   └─ 模型、額度、feature flags
  └─ App Check
      └─ 保護 Auth / Firestore / Storage / Functions

Cloud Functions v2
  ├─ Firestore Admin SDK
  ├─ Storage Admin SDK
  ├─ Secret Manager
  │   └─ Gemini API key
  └─ Gemini paid tier
```

**Analytics** 在這一版可以保持選配，不必先開。這樣隱私面比較簡單，也能避免你一開始就把事件數據、轉換埋點與 consent banner 複雜化。Remote Config 則值得第一天就接，因為它可以在**不發新版 App**的情況下改模型名稱、免費額度、feature flag 與法律文案版本。citeturn22view1turn23view9

## 登入與帳號設計

Firebase Authentication 官方文件已覆蓋你要的三種登入：**email/password、Google Sign-In、Sign in with Apple**。其中 email/password 文件明確提到密碼政策與電子郵件列舉防護是建議項目；Google 與 Apple 的 Apple-platform 文件則已對應 iOS 整合流程。Apple 登入另外有兩個現實前提：你必須先在 Apple Developer 端完成設定，而且使用者必須有啟用雙重驗證的 Apple ID 並登入 iCloud。citeturn0search4turn22view7turn22view8

MVP 我**不建議開匿名登入**。不是因為 Firebase 不支援，而是因為你的產品從第一天就有「分析額度、雲端照片上限、刪除帳號與刪除所有資料、跨裝置同步、付費升級」這些需求。匿名帳號會讓 quota、合併、刪除、VIP 升級與客服定位全部變複雜。官方確實支援匿名帳號，之後也可以把匿名身份連到正式帳號；若你未來真的想做「先試用後註冊」，可以再加，但那應該是 MVP+。另外，官方也提到匿名帳號的自動清除能力要在升級到 Identity Platform 後才可用。citeturn22view9turn36view0

帳號合併策略建議如下。這是你最不容易後悔的做法：

| 項目 | 建議 |
|---|---|
| 主鍵 | 永遠以 Firebase `uid` 為主鍵 |
| 同 email 多 Provider | 先要求使用者用既有 Provider 登入，再做 provider linking |
| 帳號合併 | 以 Firestore 資料為主，合併到「保留的 uid」底下 |
| planTier / quota | 一律走 server-side 重新計算，不在 client 端硬合 |
| consent | 保留最新 `acceptedAt`，但 `trainingConsent` 預設維持 `false` |
| 刪除帳號 | 只能刪當前登入者自己的資料，實際刪除由 Cloud Functions 執行 |

Firebase 官方的 account linking 文件明確指出：一個 Firebase user 可以綁多個驗證 provider，並維持同一個 Firebase UID；如果憑證已連到別的帳號，應由你的應用程式處理資料合併。這很適合你的情境，因為你之後很可能會遇到「先 email/password，後來想補綁 Google 或 Apple」的使用者。citeturn36view0

我建議 `users/{uid}` 只允許 client 直接改「安全的個人偏好」，像是 `displayName`、`preferredLanguage`、`aiConsent.thirdPartyAnalysis`；`role`、`planTier`、`subscriptionStatus`、`quota` 這些一律由 server 寫入。Authentication 本身會跟 Security Rules 緊密整合，這也是 Firebase 適合這個 App 的原因之一。citeturn23view2turn23view3

## Firestore 與 Storage 資料模型

這個 App 最合適的資料模型是**以 `users/{uid}` 為根的子集合結構**。原因很簡單：權限規則好寫、刪除時好清、歷史頁也天然就是「目前使用者自己的東西」。圖片本體只放在 Storage；Firestore 只放路徑、參數、AI 結果、配額與訂閱狀態。Cloud Storage for Firebase 本身就是建在 Google Cloud Storage bucket 之上，而且行動端 SDK 對不穩定網路有續傳與重試能力，適合直接上傳圖片變體。citeturn2search0turn27search8

### Firestore collections schema

下表是我建議直接交給 Codex 實作的 schema。這份 schema 以 **MVP 先穩定** 為第一原則，不做多資料庫、不做複雜 join、不把圖片 bytes 放進 Firestore。

| Collection | Document path | 主要欄位與型別 | 範例 document | 索引建議 | Security note |
|---|---|---|---|---|---|
| users | `/users/{uid}` | `uid:string` `email:string?` `displayName:string?` `authProviders:array<string>` `preferredLanguage:string` `planTier:string` `role:string` `aiConsent:map` `createdAt:timestamp` `updatedAt:timestamp` `lastActiveAt:timestamp` `isDeleted:bool` | `{uid:"u1", planTier:"free", preferredLanguage:"zh-TW", aiConsent:{thirdPartyAnalysis:true, trainingConsent:false}}` | 無自訂索引 | owner 可讀；owner 只能改安全欄位；`planTier` / `role` / `isDeleted` server only |
| photos | `/users/{uid}/photos/{photoId}` | `photoId:string` `ownerUid:string` `source:string` `presetId:string` `cameraPresetId:string?` `files:map` `sizes:map` `imageMeta:map` `status:string` `latestAnalysisId:string?` `retention:map` `createdAt:timestamp` `updatedAt:timestamp` | `{photoId:"p1", ownerUid:"u1", files:{previewPath:"users/u1/photos/p1/preview.jpg", thumbPath:"users/u1/photos/p1/thumb.jpg", originalPath:null}, status:"ready"}` | `status + createdAt desc` 可選；否則先靠自動索引 | owner 只讀；建立、更新、刪除都走 Cloud Functions |
| aiAnalyses | `/users/{uid}/aiAnalyses/{analysisId}` | `analysisId:string` `photoId:string` `ownerUid:string` `provider:string` `model:string` `summary:string` `suggestions:array<string>` `scores:map` `suggestedAdjustments:map` `language:string` `latencyMs:number` `status:string` `createdAt:timestamp` | `{analysisId:"a1", photoId:"p1", provider:"gemini", model:"gemini-3.1-flash-lite", summary:"主體好看但偏暗", suggestions:["往左一步","曝光+0.3","抬高機位"], language:"zh-TW"}` | `photoId + createdAt desc` 可選 | owner 只讀；server only write |
| subscriptions | `/users/{uid}/subscriptions/current` | `source:string` `productId:string?` `status:string` `planTier:string` `currentPeriodEndAt:timestamp?` `willAutoRenew:bool?` `lastVerifiedAt:timestamp` `updatedAt:timestamp` | `{source:"app_store", planTier:"free", status:"inactive"}` | 無 | owner 可讀；client 不可寫 |
| usageQuotas | `/users/{uid}/usageQuotas/current` | `freeStarterRemaining:int` `dailyBonusBalance:int` `vipCycleAllowance:int` `vipCycleUsed:int` `currentCloudPhotoCount:int` `currentOriginalPhotoCount:int` `currentStorageBytesApprox:int` `maxCloudPhotos:int` `maxOriginalBytes:int` `lastDailyBonusDateLocal:string` `dailyBonusTimeZone:string` `updatedAt:timestamp` | `{freeStarterRemaining:20, dailyBonusBalance:0, currentCloudPhotoCount:0, maxCloudPhotos:20, dailyBonusTimeZone:"Asia/Taipei"}` | 無 | owner 可讀；client 不可寫 |
| filterPresets | `/filterPresets/{presetId}` | `presetId:string` `name:string` `description:string` `parameters:map` `isPremium:bool` `version:int` `updatedAt:timestamp` | `{presetId:"gold200", name:"Golden 200", isPremium:false, version:1}` | 無 | public read；admin write |
| cameraPresets | `/cameraPresets/{cameraPresetId}` | `cameraPresetId:string` `name:string` `lensProfile:string?` `aspectRatio:string` `defaultPresetId:string` `isPremium:bool` `version:int` | `{cameraPresetId:"mvp_cam_01", name:"Classic Compact", aspectRatio:"4:3", defaultPresetId:"gold200"}` | 無 | public read；admin write |
| poseGuides | `/poseGuides/{poseId}` | `poseId:string` `poseName:string` `category:string` `thumbnailUrl:string?` `overlayAssetName:string?` `isPremium:bool` `recommendedDistance:string?` `recommendedAngle:string?` `version:int` | `{poseId:"pose_basic_01", poseName:"側身回眸", category:"portrait", isPremium:false}` | `category + isPremium` 可選 | public read；admin write |
| appConfig | `/appConfig/public`、`/appConfig/server` | `public` doc：`privacyPolicyVersion:string` `termsVersion:string` `minSupportedAppVersion:string`；`server` doc：只供後端讀的營運配置 | `public:{privacyPolicyVersion:"2026-06-01"}` | 無 | `public` 可讀不可寫；`server` client 不可讀寫 |
| deletionRequests | `/users/{uid}/deletionRequests/{requestId}` | `requestId:string` `ownerUid:string` `status:string` `requestedAt:timestamp` `processedAt:timestamp?` `reason:string?` `errorCode:string?` | `{requestId:"d1", ownerUid:"u1", status:"pending", requestedAt:...}` | `status + requestedAt` 僅後台需要時再加 | owner 可建立與讀自己；server 更新狀態 |

幾個實作上的關鍵點要先定下來。第一，**`usageQuotas/current` 用單文件就夠了**。官方的 distributed counter 解法是為高頻率熱點寫入準備的；對你現在 100 人級別的 MVP，單一 quota doc 搭配 transaction 已足夠，反而更簡單。第二，**基礎查詢先吃 Firestore 自動索引**，只有當你真的在歷史頁做 `where status == ready orderBy createdAt desc` 這類複合查詢，才補 `firestore.indexes.json`。Firebase 官方也建議你透過 missing-index error 鏈接來加索引。citeturn12search1turn23view7

建議的 `firestore.indexes.json` 起始版本可以極簡：

```json
{
  "indexes": [
    {
      "collectionGroup": "photos",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "aiAnalyses",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "photoId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

### Storage path 設計

你已經把 canonical path 定得很清楚，這個方向是對的。MVP 只需要三個正式圖片變體：

| 用途 | Storage path | 說明 |
|---|---|---|
| 原圖 | `users/{uid}/photos/{photoId}/original.jpg` | **僅付費用戶**保留；server 確認 entitlement 後才寫入 |
| 預覽圖 | `users/{uid}/photos/{photoId}/preview.jpg` | App 顯示主圖、AI 分析主要使用此圖 |
| 縮圖 | `users/{uid}/photos/{photoId}/thumb.jpg` | 歷史頁列表與快速載入使用 |

我另外建議加一個**非正式暫存路徑**，專門處理付費原圖保存與刪除失敗重試：

| 類型 | Storage path | 是否 MVP 必做 |
|---|---|---|
| draft upload | `users/{uid}/drafts/{uploadId}/source.jpg` | 建議做 |
| local export placeholder | `users/{uid}/exports/{exportId}.zip` | **不建議 MVP 做 server-side ZIP** |

保存策略我建議這樣定：

| 方案 | 可保存圖片 | Storage 實際保存 | 刪除策略 |
|---|---|---|---|
| 免費 | 最多 20 張雲端照片 | `preview.jpg` + `thumb.jpg` | 不活躍 90 日後由 cleanup job 明確刪除 |
| 付費 | 更多雲端照片，不宣稱真正無限 | `preview.jpg` + `thumb.jpg` + `original.jpg` | 不自動刪除，或給更長 retention |
| 本地下載 | 單張 / 多選 / 一鍵存到 Photos | 不必 server 備份 | 由使用者裝置自行管理 |

這裡有兩個務實建議。第一，**免費方案不要把 20 張限制建立在「Storage 實際有幾個檔」**，而是建立在 `usageQuotas.currentCloudPhotoCount` 與 `photos` metadata 是否正式註冊。第二，**不要在 MVP 就對外宣稱 VIP 無限保存**；你可以在 UI 文案寫「更多保存與原圖保存」，而 server 端預設一個 fair-use 上限，例如 `500 張` 或 `20GB original bytes`，後續再用 Remote Config 調整。這樣比日後硬砍更穩。

### Remote Config 建議參數

Remote Config 很適合放「可即時調整，但不應被視為權限真相」的參數。也就是說，client 可以用來**顯示**與**體驗切換**，真正生效值還是由 Cloud Functions 寫進 `usageQuotas/current`。官方文件也明確指出，Remote Config 支援參數、條件與模板版本管理。citeturn22view1turn23view9

建議參數如下：

```json
{
  "quota_free_starter_analysis": 20,
  "quota_daily_login_bonus": 1,
  "quota_free_cloud_photo_cap": 20,
  "quota_vip_cycle_allowance": 500,
  "quota_vip_original_bytes_cap": 21474836480,
  "ai_model_free": "gemini-3.1-flash-lite",
  "ai_model_vip": "gemini-3.5-flash",
  "feature_image_edit": false,
  "feature_half_frame": false,
  "feature_double_exposure": false,
  "legal_ai_consent_version": "2026-06-01"
}
```

## Cloud Functions 與配額控制

這個 App 最重要的原則是：**所有會影響額度、資料刪除、原圖保存、訂閱權益與第三方 AI 呼叫的動作，都必須在 Cloud Functions 做**。Firebase 官方的 callable functions 文件指出，callable function 會自動攜帶 Firebase Authentication、FCM 與 App Check token；這對你的 iOS App 很重要，因為 client 不需要自己手組一套驗證協議。另一方面，Cloud Functions 的最新環境設定文件也已明確建議用 **parameterized configuration** 與 **Secret Manager** 保存第三方 API key；`.env` 不應視為安全的機密存放方式，而且 `functions.config()` 已標示將在 **2027 年 3 月** 停止支援部署。citeturn33search2turn22view2

另外，App Check 對 Firestore、Storage、Authentication 與 Cloud Functions 都能啟用強制執行；但官方同時提醒，啟用 enforcement 之前要先看 metrics，且完全生效可能需要最多 15 分鐘。iOS 端建議正式環境用 **App Attest**，本機與 CI 則用 debug provider。citeturn23view0turn23view1turn7search7

### 核心 function contract

下表把你前面要求的 function 一次整理成 Codex 可落地的 contract。**加粗**的是 MVP 必做。

| Function | Trigger | Input | Output | Auth / App Check | Rate limit | pseudo flow |
|---|---|---|---|---|---|---|
| **analyzePhoto** | `onCall` | `photoId`, `language`, `sceneHint?` | `analysisId`, `summary`, `suggestions`, `suggestedAdjustments` | 必須登入；必須 App Check | 建議 `5/min/user`、`1 concurrent photo` | 讀 user/quota/photo → 檢查 consent 與額度 → 保留 1 次 quota → 下載 `preview.jpg` → 呼叫 Gemini → 寫 `aiAnalyses` → 更新 `photos.latestAnalysisId` → 成功結算或失敗退款 |
| **grantDailyLoginBonus** | `onCall` | 無或 `clientDate?` | `granted`, `dailyBonusBalance`, `effectiveDate` | 必須登入；必須 App Check | 同日可重複呼叫但只成功一次 | 用 **Asia/Taipei** 日期字串比對 → 若今天未領過則 `dailyBonusBalance += 1` → 更新 `lastDailyBonusDateLocal` |
| checkQuota | `onCall` | 無 | 目前餘額、照片數、有效上限 | 必須登入；必須 App Check | `30/min/user` | 讀 `usageQuotas/current` + `subscriptions/current` → 回傳前端顯示所需資料 |
| consumeQuota | internal helper | `uid`, `quotaType`, `amount`, `reservationId?` | success / fail | server only | N/A | transaction 扣除 starter / daily / vip allowance，必要時做 reservation 與 refund |
| **deletePhoto** | `onCall` | `photoId` | `deleted:true` | 必須登入；必須 App Check | 建議 `30/day/user` | 讀 photo doc → 標記 `status=deleting` → 刪 `preview` / `thumb` / `original` → 刪 analysis docs → 更新 quota counters |
| generateImageEdit | `onCall` | `photoId`, `prompt` | `jobId` 或 edited image URL | 必須登入；必須 App Check | 關閉於 MVP | 檢查 VIP + feature flag → 呼叫 ImageEdit provider → 儲存結果 |
| **syncSubscriptionStatus** | `onCall` + `onRequest` | client sync：`signedTransactionInfo/JWS`；server notify：Apple server payload | `planTier`, `status`, `periodEnd` | client sync 需登入 + App Check；server notify 用 shared secret / Apple verification | client sync `10/day/user` | 驗 Apple 交易 → 寫 `subscriptions/current` → 更新 `users.planTier` 與 `usageQuotas` 有效上限 |
| requestAccountDeletion | `onCall` | `confirm=true` | `requestId`, `status=pending` | 必須登入；必須 App Check | `3/day/user` | 建 `deletionRequests` → enqueue `deleteAccountData` task |
| **deleteAccountData** | `onTaskDispatched` 或 internal HTTP | `uid`, `requestId` | server-only | server only | queue-based | 列出並刪除 Storage 路徑 → 遞迴刪 Firestore 子集合 → 刪 Auth user → 更新 `deletionRequests` |
| **cleanupExpiredPhotos** | `onSchedule` | 無 | summary metrics | server only | 每日一次 | 找出 free 且不活躍超 90 天的使用者，或已設 `retention.deleteAfterAt` 的 photo → 分批刪除 Storage 與 metadata |
| cleanupInactiveFreeUsers | `onSchedule` | 無 | summary metrics | server only | 可併入上面 | 若保留此 function，負責先標記哪些使用者與照片進入待清除狀態 |

### 幾個實作上很容易踩坑的點

**不要把第三方 AI 呼叫放在 Firestore transaction 內。** 官方交易文件提醒你 transaction 會自動 retry；如果你把有副作用的外部 API 呼叫塞進去，會很容易造成重複分析或重複扣額。正確做法是：先 transaction 保留 quota，再在 transaction 外呼叫 AI，最後二次 transaction 完成寫入或退款。citeturn12search0turn23view6

**大刪除動作不要直接在 mobile client 做。** Firebase 官方有專門的「用 callable function 刪除資料」文件，說明為什麼 collection tree 的刪除不適合放在資源受限的行動裝置，而且刪大量文件時需要多個 batch 或大量單刪。對你的 `deleteAccountData` 與 `cleanupExpiredPhotos`，更穩的做法是用 callable + Cloud Tasks／schedule function 的組合。citeturn22view5turn10search1

**每日登入送 1 次分析必須由 server 時間決定。** 我建議在 Cloud Functions 裡固定用 `Asia/Taipei` 做日曆日判斷，將結果寫入 `lastDailyBonusDateLocal`。這樣你就不會被 client 偽造時間、跨時區、跨裝置重領問題打爆。

### 建議檔案結構

```text
/functions/
  package.json
  tsconfig.json
  src/
    index.ts
    config/
      params.ts
      secrets.ts
    lib/
      firestore.ts
      storage.ts
      quota.ts
      appCheck.ts
      auth.ts
      logger.ts
      geminiAnalyzer.ts
      subscriptionVerifier.ts
    functions/
      analyzePhoto.ts
      grantDailyLoginBonus.ts
      checkQuota.ts
      deletePhoto.ts
      requestAccountDeletion.ts
      deleteAccountData.ts
      syncSubscriptionStatus.ts
      cleanupExpiredPhotos.ts
      cleanupInactiveFreeUsers.ts
    types/
      firestore.ts
      api.ts
  test/
    analyzePhoto.test.ts
    grantDailyLoginBonus.test.ts
    deletePhoto.test.ts
    rules.test.ts
```

## Security Rules 草稿

Firebase 官方對 Firestore 與 Storage 都強調：Rules 的工作是**存取控制與資料驗證**。Storage Rules 可以按照路徑限制上傳，也可以檢查 `contentType` 與 `size`；Firestore Rules 則適合做 owner-based data access。另一個很重要但常被忽略的事實是：**若 Rules 在評估時需要讀取其他 Firestore 文件，這些額外讀取會計費**。因此，Rules 要盡量簡單，真正複雜的 entitlement 與 quota 邏輯應該進 Cloud Functions。再補一個關鍵點：官方也明確寫到，**伺服器端 client libraries 會略過 Firestore Security Rules，改走 IAM**；這正是為什麼刪除、同步訂閱、清除過期照片都應該在 Functions 做。citeturn23view2turn23view3turn16view0turn27search5

### Firestore Rules draft

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    function isAdmin() {
      return signedIn() &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid);

      // 使用者只能改安全欄位；plan/role/quota/subscription 一律 server 控制
      allow update: if isOwner(uid)
        && request.resource.data.uid == resource.data.uid
        && request.resource.data.role == resource.data.role
        && request.resource.data.planTier == resource.data.planTier
        && request.resource.data.isDeleted == resource.data.isDeleted
        && request.resource.data.diff(resource.data).changedKeys().hasOnly([
          'displayName',
          'preferredLanguage',
          'updatedAt',
          'lastActiveAt',
          'aiConsent'
        ])
        && request.resource.data.aiConsent.trainingConsent == false;

      allow delete: if false;

      match /photos/{photoId} {
        allow read: if isOwner(uid);
        allow write: if false; // metadata 一律由 Cloud Functions 建立與維護
      }

      match /aiAnalyses/{analysisId} {
        allow read: if isOwner(uid);
        allow write: if false;
      }

      match /subscriptions/{docId} {
        allow read: if isOwner(uid);
        allow write: if false;
      }

      match /usageQuotas/{docId} {
        allow read: if isOwner(uid);
        allow write: if false;
      }

      match /deletionRequests/{requestId} {
        allow read: if isOwner(uid);
        allow create: if isOwner(uid)
          && request.resource.data.ownerUid == uid
          && request.resource.data.status == 'pending';
        allow update, delete: if false;
      }
    }

    match /filterPresets/{presetId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /cameraPresets/{cameraPresetId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /poseGuides/{poseId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /appConfig/{docId} {
      allow read: if docId == 'public';
      allow write: if isAdmin();
    }
  }
}
```

### Storage Rules draft

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    function signedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    match /users/{uid}/photos/{photoId}/preview.jpg {
      allow read: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 3 * 1024 * 1024;
      allow delete: if false;
    }

    match /users/{uid}/photos/{photoId}/thumb.jpg {
      allow read: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 512 * 1024;
      allow delete: if false;
    }

    // 正式 original 路徑不開給 client 直接寫，避免免費用戶繞過 plan 檢查
    match /users/{uid}/photos/{photoId}/original.jpg {
      allow read: if isOwner(uid);
      allow write: if false;
      allow delete: if false;
    }

    // 付費原圖若要 client 先上傳，先進 draft，再由 server 驗證後搬到 canonical path
    match /users/{uid}/drafts/{uploadId}/{fileName} {
      allow read: if isOwner(uid);
      allow create, update: if isOwner(uid)
        && request.resource.contentType.matches('image/.*')
        && request.resource.size < 15 * 1024 * 1024;
      allow delete: if isOwner(uid);
    }

    match /users/{uid}/exports/{exportId}/{fileName} {
      allow read, write, delete: if isOwner(uid);
    }
  }
}
```

這份 rules 草稿有一個很實際的取捨：**把「官方資料是否成立」交給 Functions，把「誰能讀自己的東西、能不能亂傳大檔」交給 Rules**。這樣做的好處是 schema 穩、Rules 短、除錯簡單。壞處是 authenticated user 理論上仍可能往自己的 `drafts/` 或 `photos/preview.jpg` 路徑亂上傳垃圾檔。但配合 **App Check、size 限制、server-side finalize、orphan draft cleanup**，對現在的 MVP 已經夠用；如果日後真的遇到濫用，再升級到 `preparePhotoUpload` + signed upload / server-copy flow。citeturn23view3turn23view1

## 成本估算與控制方案

先說結論：**以你目前的 100 人級別 MVP，HKD 1000 / 月大概率足夠，而且通常會有明顯餘裕。** 真正可能把你成本拉高的，不是 Firestore，也不是圖片 Storage，而是**AI 模型選錯、圖片太大、輸出太長、或過早做 live / image edit**。這個判斷不是拍腦袋：Firestore 官方文件給了你每天的免費 quota；Cloud Storage 區域 Standard Storage 與對亞洲地區下載流量的價格也很低；Cloud Run free tier 對輕量 function 夠大；真正波動最大的是 Gemini 模型與 token 消耗。citeturn0search5turn31view1turn17view4turn35view0turn37view0turn30search1

Firestore 的早期成本通常接近零。官方文件列出的免費額度是：**1 GiB 儲存、每天 50,000 reads、20,000 writes、20,000 deletes**，而且是對「每個專案的一個免費資料庫」生效。你的 MVP 若以 100 人、每天低頻分析與歷史頁瀏覽為主，通常還在免費額度內。要注意的是，若你的 Rules 透過 `get()` 去讀其他文件，這些附加文件讀取也會計費，所以 quota / plan 驗證不要塞進每一個熱路徑查詢的 Rules。citeturn0search5turn17view0turn16view0

Storage 成本比很多人想像中低。Cloud Storage 區域 Standard Storage 的價格頁顯示，像 `asia-east1` / `asia-east2` 這一組區域的 Standard Storage 量級大約是 **US$0.000027397 / GiB-hour**，換算約 **US$0.02 / GiB-month**；而從 bucket 對亞洲地區下載資料，0–10TB 區間的通用網路費率是 **US$0.12 / GiB**。這代表你真正要控制的是**下載流量**與**是否保留原圖**，而不是預覽圖本身的存放費。citeturn31view1turn17view4

Cloud Functions v2 的計價跟 Cloud Run 綁在一起。官方 Cloud Run 定價頁顯示，每月有 **240,000 vCPU-seconds** 與 **450,000 GiB-seconds** 的免費方案，而且計費只按實用資源。甚至 Google 官方範例裡，**每月 1,000 萬次**輕量 serverless function 請求，在套用 free tier 後都還只是個位數美元級。你的 5,000–10,000 次 callable / month 幾乎可以視為不是主要成本。真正要留意的反而是 schedule job 之外的額外服務；例如 Cloud Scheduler 是 **每個 job 每月 US$0.10，前三個免費**，而 source deploy / functions 部署也會用到 Cloud Build 與 Artifact Registry，但早期通常只是零頭。citeturn35view0turn22view4

AI 成本則必須分模型看。Gemini 官方定價頁顯示，像 **Gemini 3.1 Flash-Lite** 的 paid tier，文字/圖片/影片輸入是 **US$0.25 / 百萬 token**、輸出 **US$1.50 / 百萬 token**；而 **Gemini 3.5 Flash** 則是輸入 **US$1.50 / 百萬 token**、輸出 **US$9.00 / 百萬 token**。Gemini token 文件也明確說明：如果輸入圖片尺寸兩邊都不超過 **384px**，圖片只算 **258 tokens**；較大圖片則按 768×768 tile 計，每個 tile 也是 258 tokens。再加上 `countTokens` 與回應 `usage_metadata` 都能拿來做實測，這讓你可以把 AI 成本量測成為正式指標，而不是靠猜。citeturn37view0turn30search1

還有一個隱私上很關鍵的成本選型結論：**生產環境不要用 Gemini free tier 做照片分析。** 官方定價頁在模型表格中直接標示，free tier 的資料「**用於改善我們的產品：是**」，paid tier 則是「**否**」。既然你的產品方向已明確是 `trainingConsent = false` 預設值，那就應該從一開始就走 paid tier，並在同意畫面上說明照片會傳送到第三方 AI 服務作分析，但不是預設拿去做模型訓練。citeturn37view0

以下是依照你的假設所做的**粗估成本表**。表格數字是用上面官方單價與你提供的容量條件推導的估算值，重點是讓你知道主成本在哪裡，不是做會計結帳。citeturn0search5turn31view1turn17view4turn35view0turn37view0turn30search1

| 項目 | 假設 | 粗估月成本 |
|---|---|---|
| 預覽圖 + 縮圖儲存 | 100 人 × 20 張 × `(1MB preview + 0.1MB thumb)` ≈ 2.15 GiB | 約 **US$0.04** |
| 加上付費原圖 | 再假設 10 個付費用戶，各存 100 張 `5MB original`，總量約 7.03 GiB | 約 **US$0.14** |
| 圖片下載流量 | 每月 20 GiB 歷史頁/下載流量 | 約 **US$2.40** |
| Firestore | 100 人級 MVP，正常瀏覽與分析紀錄 | 大多仍在免費額度內 |
| Cloud Functions v2 | 5,000–10,000 次小型 callable + 1–3 個排程 job | 多半接近 **US$0** |
| AI 分析 | 5,000 次/月；每次約 1,000 input token + 300 output token | **Flash-Lite：約 US$3.5**；**3.5 Flash：約 US$21** |

把這些加起來，你的 MVP 在 100 人規模下，就算保守地用 **Gemini 3.5 Flash** 做 5,000 次分析、外加幾十 GB 的圖片下載流量，整體仍然大概率低於 **HKD 1000 / 月**。真正會讓你爆預算的是這幾種情況：把分析模型切到 Pro、讓輸出太長、免費用戶也保留原圖、提早做 live vision、或上線 image edit / generation。對你現在的產品階段，最穩的做法是：**免費分析走 Flash-Lite，VIP 或疑難案例再切到 3.5 Flash，模型 ID 由 Remote Config 控制。**citeturn37view0turn22view1turn23view9

### 成本控制落地清單

| 控制點 | 建議 |
|---|---|
| AI 圖片尺寸 | `preview.jpg` 下採樣後同時給 UI 與 AI 使用；不要另外存 `ai.jpg` |
| AI 模型 | free flow 預設 `gemini-3.1-flash-lite`；VIP / fallback 再切 `gemini-3.5-flash` |
| AI 輸出長度 | 固定 1 句 summary + 最多 3 條建議 + 短數值調整 |
| AI 成本量測 | 每次都記錄 `usage_metadata` 或呼叫 `countTokens` |
| Storage | history 頁只吃 `thumb.jpg`；詳情頁才拉 `preview.jpg` |
| 原圖保存 | 付費才保留，且走 server 驗證後寫入 canonical path |
| Firestore | `usageQuotas/current` 存聚合數字，避免大量 collection count |
| Rules | 避免在熱路徑 Rules 裡用太多 `get()`，減少附加 read cost |
| Cleanup | 每日清理免費用戶 90 日不活躍照片、stale drafts、孤兒 metadata |
| Remote Config | 動態調整免費額度、VIP allowance、feature flags，不必發版 |

## 本地備份、測試清單與 Codex 任務

本地備份的方向我建議非常克制：**MVP 只做裝置本地保存，不做 server-side backup，也不做 server-side ZIP export**。單張下載與多選下載都在 iOS 端完成，寫入 Photos 或用 share sheet 匯出。若你之後真的要做匯出壓縮檔，也先做**本地 zip**，不要在 Cloud Functions 上建立 ZIP；那會多出運算、暫存與額外下載流量成本，而且和你「不需要 server backup」的產品邊界相衝突。

### 本地備份設計

| 功能 | 建議 |
|---|---|
| 單張下載 | free 下載 `preview.jpg`；付費若有 `original.jpg` 則可下載原圖 |
| 多選下載 | 依序下載到本地暫存，再寫入 Photos 或 share sheet |
| 一鍵下載全部 | **不建議 MVP 直接做**；先做「多選上限 20 張」 |
| ZIP export | 不建議 MVP；若保留路徑，只當 future placeholder |
| 大量下載保護 | 下載前顯示估計數量與本地空間提醒 |

### 測試 checklist

Firebase 官方建議在正式部署前用 **Local Emulator Suite** 驗證 Rules 與 Functions；Storage Rules 的起手式文件也明確建議先在本機做更徹底測試，再推正式版。App Check 在 CI / 模擬器環境則要用 debug provider，而且 debug token 不能進 public repo。citeturn26search2turn2search3turn7search7

建議至少覆蓋以下測試：

1. **未登入不能上傳與不能讀資料**  
   驗證 Firestore 與 Storage 都被拒絕。

2. **不同使用者不可互讀**  
   User A 不能讀 User B 的 `photos`、`aiAnalyses`、`usageQuotas`、`subscriptions` 與 Storage 圖片。

3. **免費用戶第 21 張被擋下**  
   `finalizePhotoUpload` 或同等 server flow 必須回 `resource-exhausted` / `failed-precondition`。

4. **免費用戶不能建立 canonical `original.jpg`**  
   client 直接對 `users/{uid}/photos/{photoId}/original.jpg` 上傳必須被 Storage Rules 擋下。

5. **每日登入送 1 次額度只能領一次**  
   同一天、同一 `uid`、跨裝置重複呼叫 `grantDailyLoginBonus` 必須 idempotent。

6. **analyzePhoto 沒有 consent 會失敗**  
   `users.aiConsent.thirdPartyAnalysis != true` 時直接回錯。

7. **analyzePhoto 成功後會寫入 aiAnalyses 並扣額**  
   失敗時要退款或釋放 reservation。

8. **deletePhoto 會刪 Storage + Firestore metadata**  
   同一張圖二次呼叫也不應爆炸，必須 idempotent。

9. **90 日不活躍清理有效**  
   `cleanupExpiredPhotos` 在 staging 對符合條件的 free user 生效，付費用戶不受影響。

10. **Remote Config 失敗時有本地預設值**  
    App 不會因拉不到參數而崩潰或錯開配額 UI。

11. **App Check rollout**  
    在 enforcement 前先看 metrics；enforcement 後確定未驗證請求被拒絕。citeturn23view1

### Codex 可執行任務清單

1. **初始化 Firebase 專案設定**
   - 檔案：`firebase.json`、`.firebaserc`、`firestore.rules`、`storage.rules`、`firestore.indexes.json`
   - 驗收標準：本機 emulator 可啟動，Rules 與 indexes 可部署，沒有任何真 API key。

2. **建立 Auth 與基本 user document flow**
   - 檔案：`ios-app/Services/AuthService.swift`、`functions/src/functions/onUserCreated.ts` 或 iOS 首次登入寫入邏輯
   - 驗收標準：email/password、Google、Apple 首次登入後都會建立 `/users/{uid}`。

3. **建立 Firestore model 與 Repository**
   - 檔案：`ios-app/Models/UserDoc.swift`、`PhotoDoc.swift`、`AIAnalysisDoc.swift`、`UsageQuotaDoc.swift`、`SubscriptionDoc.swift`
   - 驗收標準：Codable 映射成功；讀寫 `users`、`photos`、`usageQuotas` 不需手刻 dictionary。

4. **建立 StorageService 與圖片變體上傳**
   - 檔案：`ios-app/Services/StorageService.swift`
   - 驗收標準：可把 `preview.jpg` 與 `thumb.jpg` 上傳到指定 canonical path；離線/中斷後可重試。

5. **實作 quota 與每日登入獎勵**
   - 檔案：`functions/src/functions/grantDailyLoginBonus.ts`、`checkQuota.ts`、`lib/quota.ts`
   - 驗收標準：新用戶初始 `freeStarterRemaining=20`；每天只能領一次 `dailyBonusBalance += 1`。

6. **實作 analyzePhoto**
   - 檔案：`functions/src/functions/analyzePhoto.ts`、`lib/geminiAnalyzer.ts`、`config/secrets.ts`
   - 驗收標準：必須檢查 auth、App Check、consent、quota、photo existence；成功後建立 `aiAnalyses`，失敗不重複扣額；Gemini key 只在 server 端。

7. **實作刪圖與刪帳號流程**
   - 檔案：`functions/src/functions/deletePhoto.ts`、`requestAccountDeletion.ts`、`deleteAccountData.ts`
   - 驗收標準：刪單張會刪 Firestore + Storage；刪帳號會移除 Auth user 及所有相關資料並留下 `deletionRequests` audit。

8. **實作 cleanup job**
   - 檔案：`functions/src/functions/cleanupExpiredPhotos.ts`
   - 驗收標準：每天排程掃描 free 用戶 `lastActiveAt` 與 `retention.deleteAfterAt`，會分批刪除資料，並輸出摘要 log。

9. **接上 Remote Config**
   - 檔案：`ios-app/Services/RemoteConfigService.swift`
   - 驗收標準：可拉到免費額度、模型名稱、feature flags；抓不到時有安全預設值。

10. **補 Emulator 測試與 Rules 測試**
    - 檔案：`functions/test/*.test.ts`
    - 驗收標準：至少覆蓋「未登入拒絕、跨用戶拒絕、免費第 21 張失敗、original client upload 被擋、每日 bonus 只發一次、deletePhoto idempotent」。

### Acceptance criteria 總表

- 所有圖片 bytes 都在 Storage，不在 Firestore。
- `preview.jpg` / `thumb.jpg` 路徑固定為 `users/{uid}/photos/{photoId}/...`。
- 免費用戶只能建立正式 `preview` / `thumb`，不能建立正式 `original`。
- 免費 20 張限制與每日 +1 分析額度都由 server time + Cloud Functions 控制。
- `trainingConsent` 預設為 `false`，且 MVP 不提供默認為 true 的流程。
- analyzePhoto 的 Gemini / 第三方 API key 不會出現在 iOS App、repo、`.plist` 或 client logs。
- subscription、quota、AI 分析結果都不是 client authority。
- 清理流程不依賴 Firestore TTL 當唯一機制；Storage 檔案會被明確刪除。
- Rules 與 Functions 在 Emulator 跑過。
- Blaze plan、App Check、Remote Config 與排程 job 都完成設定。