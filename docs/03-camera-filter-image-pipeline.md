# 相機、復古濾鏡與圖片處理技術報告

## 報告結論

以你已經確定的技術邊界來看，這個 App 的相機與圖片處理層，最穩健的做法是：**相機使用 AVFoundation 自建拍照介面、單張匯入使用 PhotosPicker、濾鏡與輸出使用 Core Image、輕量即時導引只用 Vision、雲端保存只保存必要版本、AI 分析只吃「已正向化但未套復古風格」的單張來源圖**。這個組合剛好符合你目前的產品定位：不是大型修圖工作室，而是「底片感相機 + 單張 AI 拍攝教練」。AVFoundation 本來就是 Apple 提供自訂相機 UI 的主要 capture 架構；PhotosPicker 是 Apple 提供的相簿選擇元件；Core Image 提供高效的內建濾鏡鍊式處理，而且可以用 Metal-backed `CIContext`；Vision 則提供臉框、人體姿勢、地平線等本機電腦視覺能力。這些官方能力本身就足以完成你要的 MVP，不需要第一版就跳進純 Metal shader 或第三方濾鏡框架。citeturn6search10turn0search1turn18search11turn6search17turn0search10turn19search8

就產品分層來說，建議明確切成三層。**MVP** 只做：單張拍照、單張匯入、三個底片 preset、一鍵直出、基本數值微調、壓縮圖與縮圖保存、VIP 原圖保存、AI 分析按鈕、基本歷史頁。**MVP+** 才加入：半格機編輯器、雙重曝光編輯器、簡單 live overlay 輔助。**Future** 再做：真正的大型相機庫 / 鏡頭庫、更多光學模擬、複雜實時預覽、多段非破壞編輯、完整 draft 同步與更進階的動態導引。這樣的切法可避免第一版被「相機體驗、濾鏡體驗、雲端保存、AI 分析」四條主線同時拉爆。

## 相機與相簿流程

你的 **MVP 相機功能範圍** 建議固定為以下內容，而且不要再往外擴：**單張拍照、單張相簿匯入、拍後預覽、套用 preset、基本數值微調、AI 分析按鈕、保存壓縮版、VIP 保存原圖、歷史 metadata 寫入 Firestore**。不要在 MVP 納入 RAW、Live Photo、Burst、錄影、AR、多人即時骨架追蹤。AVFoundation 的拍照工作流本來就以 `AVCaptureSession` 與 `AVCapturePhotoOutput` 為核心，`AVCapturePhotoOutput` 也支援 still photo 的主流程；Apple 官方文件同時指出 photo output 支援 HEIF / JPEG / RAW / bracketed capture / Live Photo 等更高階能力，因此你完全可以在第一版只取其中最簡單、最穩的 still photo 子集。citeturn6search3turn0search4turn0search16

相簿匯入這一段，建議 **MVP 直接使用 SwiftUI `PhotosPicker`，並限制為單張 `.images`**。Apple 官方文件明確指出 `PhotosPicker` 可做單選與多選；而 Apple 也另外說明，使用 `PHPickerViewController` 這類系統 picker 時，App **不需要先要求相簿完整讀取權限**。對你的產品來說，這是一個很重要的 UX 優勢：使用者第一次進來，不會看到一個很重的「請允許存取所有相片」權限窗，而是只有真的打開系統 picker 時，才與系統相簿互動。citeturn0search1turn4search14

權限策略建議做得非常克制。**相機拍照一定要有 `NSCameraUsageDescription`**，這是 Apple 明確要求的；如果你未來提供「直接存回使用者 Photos」功能，才需要 `NSPhotoLibraryAddUsageDescription`；如果你改成自己讀寫 PhotoKit 資產，才需要 `NSPhotoLibraryUsageDescription`。換句話說，若 MVP 只做「拍照到 App 沙盒、相簿用 PhotosPicker 匯入、備份靠匯出或分享」，你可以把權限最小化到只先要相機權限。這對 App Store 審查敘述、隱私信任與首次打開轉化率都更有利。citeturn4search0turn4search1turn7search0turn7search12

本地備份與下載，建議**不要做 server backup，也不要第一版直接寫回使用者系統相簿**。Apple 已提供 `fileExporter` 與 `UIActivityViewController` 這類系統匯出 / 分享界面，足夠滿足你「一鍵下載或選擇下載圖片」的需求，而且不必額外承擔 Photo Library 寫入權限與更複雜的 PhotoKit 保存流程。這和你目前「只需要本地備份，不需要 server 備份」的方向完全一致。citeturn7search2turn7search1turn7search9

**建議的相機流程** 應該是這樣：

1. 首頁選一個 `CameraRecipe`。
2. 進入 `CameraView`。
3. 相機預覽只顯示：快門、前後鏡切換、AI 按鈕、preset 名稱、歷史入口。
4. 拍照後立即進入 `PhotoReviewView`。
5. `PhotoReviewView` 先顯示套用 preset 後的預覽。
6. 使用者可微調曝光 / 對比 / 色溫 / 飽和 / 顆粒 / 暗角 / 漏光。
7. 點「AI 分析」後先確保雲端有 `sourceCompressed`，再呼叫 `analyzePhoto`。
8. 點「保存」後寫 Storage 與 Firestore。
9. 歷史頁只拉縮圖與 metadata，點入單張再重建全尺寸 render。

這條路線對 Codex 最友善，因為每一段都能獨立生成、獨立測試。

## 復古底片 preset 與濾鏡引擎

你要的「Dazz 類型體驗但不抄 UI」，最安全的工程拆法是：**把首頁上的“相機”其實做成 `CameraRecipe` 卡片；把“鏡頭”做成可選的 `LensProfile` ；把真正可運算的顏色與質感參數都收斂到 `VintagePreset`**。也就是說，第一版不要真的做成「物理相機模型 + 鏡頭系統 + 膠卷系統」三層完全分離，而是讓首頁卡片只是 UX 包裝，底層還是以同一份 preset 參數作為唯一渲染來源。這樣可以保留未來擴充空間，但不會第一版把資料模型做得過深。

在濾鏡實作上，建議 **全部用 Core Image 完成 MVP**。Apple 官方文件說明，Core Image 本身就是 still / video 影像處理框架，可以用內建濾鏡鏈出複合效果；Apple 也明確指出，Core Image 會對濾鏡鍊進行優化，包含重排與合併 kernel，以降低額外運算。對你這種「單張拍照 + 單張匯入 + 三個 preset + 少量微調」的需求，這正是最合適的能力範圍。citeturn18search11turn0search10

建議的 **MVP 三個免費 preset** 可以這樣定義，而不要直接借用真實底片品牌名稱：

- `retro_warm_day`：日光暖調、輕褪色、微顆粒、輕暗角。
- `cine_fade_green`：低飽和、陰影帶一點綠、對比較低、電影感褪色。
- `flash_party_night`：高一點亮部、冷暖混合、較強顆粒、可選紅橙漏光。

這三個 preset 足夠覆蓋你最常見的人像、食物、景物三種情境，而且不需要 LUT 也能先成立。LUT 可以保留為 Future 或高級 preset 再加。

對應的 **Core Image 濾鏡映射** 建議如下：

- 曝光：`CIExposureAdjust`
- 色溫：`CITemperatureAndTint`
- 對比 / 飽和 / 亮度：`CIColorControls`
- 銳利度：`CISharpenLuminance`
- 褪色：`CIToneCurve` 搭配較低對比
- 暗角：`CIVignette`
- 漏光：以 gradient 或 PNG overlay，再用 composite operations 合成
- 顆粒：MVP 建議用預烘焙 grain overlay 資產；若之後要程式生成，可考慮 `CIRandomGenerator`
- 雙重曝光：直接用 Core Image composite operations，例如 screen / lighten / addition 類型citeturn5search0turn5search1turn13search0turn5search3turn18search0turn5search2turn17search3turn12search1

漏光與雙重曝光不需要第一版就寫自定義 Metal shader。Apple 的 Core Image 已經有 composite operations 與 gradient filters；你可以用 `CILinearGradient` / `CIRadialGradient` 生成簡單漏光遮罩，或直接用 PNG asset 疊加，再用 screen / addition 類型合成。這足以做出「看起來像底片 app」而不是「精準底片物理模擬」的 MVP。citeturn17search1turn17search2turn12search1

建議的 `FilterEngine` 應維持**純函式風格**：`sourceImage + preset + adjustments -> renderedImage`。另外，`CIContext` 建議整個 App 共用單例，並且用 Metal-backed `CIContext(mtlDevice:)`。Apple 文件指出 `CIContext` 與 `CIImage` 都是 immutable，可跨執行緒共用；這很適合你做成 app-level `ImageRenderingContext.shared`。citeturn6search2turn6search17

**建議的 preset schema** 如下。這份 schema 是**App 自己的抽象層**，不是 Core Image API 原樣鏡射；這樣 AI 之後給的數值建議也能直接回填到同一套 UI 模型，而不用暴露 CI 的低層參數給產品層。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "docs/schemas/vintage-preset.schema.json",
  "title": "VintagePreset",
  "type": "object",
  "required": [
    "preset_id",
    "name",
    "description",
    "preview_image",
    "filter_parameters",
    "is_premium",
    "created_at",
    "version"
  ],
  "properties": {
    "preset_id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "preview_image": {
      "type": "string"
    },
    "category": {
      "type": "string",
      "enum": ["camera", "film", "lens"]
    },
    "filter_parameters": {
      "type": "object",
      "required": [
        "exposure_ev",
        "contrast",
        "temperature_shift",
        "saturation",
        "sharpness",
        "fade",
        "grain_opacity",
        "vignette_intensity",
        "light_leak_opacity"
      ],
      "properties": {
        "exposure_ev": { "type": "number", "minimum": -2.0, "maximum": 2.0 },
        "contrast": { "type": "number", "minimum": 0.5, "maximum": 1.8 },
        "temperature_shift": { "type": "number", "minimum": -100, "maximum": 100 },
        "saturation": { "type": "number", "minimum": 0.0, "maximum": 2.0 },
        "sharpness": { "type": "number", "minimum": 0.0, "maximum": 2.0 },
        "fade": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "grain_opacity": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "vignette_intensity": { "type": "number", "minimum": 0.0, "maximum": 3.0 },
        "light_leak_opacity": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
        "light_leak_asset": { "type": ["string", "null"] },
        "grain_asset": { "type": ["string", "null"] }
      }
    },
    "default_output": {
      "type": "object",
      "properties": {
        "aspect_ratio": {
          "type": "string",
          "enum": ["4:3", "3:2", "1:1", "9:16"]
        },
        "show_frame_overlay": { "type": "boolean" }
      }
    },
    "is_premium": {
      "type": "boolean"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "version": {
      "type": "integer",
      "minimum": 1
    }
  }
}
```

**建議檔案名稱與型別**：

- `ios-app/Features/Filters/Models/VintagePreset.swift`
- `ios-app/Features/Filters/Models/FilterAdjustments.swift`
- `ios-app/Features/Filters/Services/PresetCatalogService.swift`
- `ios-app/Features/Filters/Services/FilterEngine.swift`
- `ios-app/Features/Filters/Services/GrainOverlayProvider.swift`
- `ios-app/Features/Filters/Services/LightLeakOverlayProvider.swift`
- `ios-app/Resources/Presets/vintage-presets.json`

## 圖片 pipeline 與雲端保存

這個 App 最容易在第一版失控的地方，不是相機，而是**圖片版本管理**。如果你把原圖、壓縮圖、濾鏡圖、AI 圖、縮圖、再次導出圖都一口氣永久保存，Storage 成本和刪除流程很快就會變亂。因此我建議你用「**運算態**」與「**持久化態**」分開的設計。

**建議的 pipeline**：

- **原始照片 `original`**：相機原始輸出或相簿原始 bytes。**VIP 才上雲**；免費方案只在本機暫存，完成壓縮後可刪。
- **壓縮來源圖 `sourceCompressed`**：所有方案都保存。這是之後重新渲染 preset、UI 詳頁重建大圖、跨裝置同步的核心來源。
- **縮圖 `thumb`**：所有方案都保存。歷史頁只拉這張。
- **濾鏡後圖片 `rendered`**：MVP 建議預設只做**本機即時 render**，不必永久上雲；若你要加速跨裝置開啟，可作為選用 cache。
- **AI 分析用圖片 `analysisInput`**：建議由 `sourceCompressed` 再縮一次或直接重用 `sourceCompressed`，但**分析前不要套底片濾鏡**，只做 orientation normalize 與尺寸收斂。
- **本地導出圖 `exportedRender`**：使用者按下載 / 分享時才生成。  

這樣做的關鍵好處是：歷史頁只要 `thumb`；詳頁只要 `sourceCompressed + preset snapshot` 就能重建；免費方案不需要存 full render 與 original；VIP 才多一個 original。Apple 的 `AVCapturePhotoOutput` 本身支援 HEIF / JPEG 等輸出格式，因此你可以保留 VIP original 的原格式；而衍生版本則統一轉成 JPEG，降低跨裝置與 AI 服務相容性風險。citeturn0search4turn0search16

很重要的一點是：**AI 分析應該吃未套底片風格的標準化來源圖，而不是復古風格圖**。原因不是 Apple 或 Firebase 的技術限制，而是產品判斷的準確性：如果你先套了很重的褪色、漏光、低對比，再叫 AI 判斷曝光與白平衡，它更容易把風格當成錯誤。因此 `analyzePhoto` 的 request 應同時傳 `presetId` 與 `adjustments`，但圖片本身建議使用 `sourceCompressed` 或解析度更小的 `analysisInput`。這樣 AI 可以知道使用者的創作意圖，卻不會被風格處理本身誤導。

**建議的 Storage path**：

```text
users/{uid}/photos/{photoId}/source.jpg
users/{uid}/photos/{photoId}/thumb.jpg
users/{uid}/photos/{photoId}/original.heic        // VIP only, optional
users/{uid}/photos/{photoId}/render-cache.jpg     // optional, not MVP must-have
```

**建議的 Firestore metadata** 建議做成單文件，不要在 MVP 先拆多層子集合。Firebase 文件提醒，刪除 Firestore 文件**不會自動刪除其子集合**，而刪除整個集合 / 子集合也建議在受信任的伺服器環境執行。你的需求只是「基本歷史 + 單張刪除」，因此把 photo 的 metadata 做扁平化文件，會比一開始拆成 `edits` / `analysis` / `assets` 子集合更容易維護與清理。citeturn9search4

```json
{
  "photoId": "auto-id",
  "userId": "uid",
  "sourceType": "camera",
  "captureMode": "normal",
  "presetId": "retro_warm_day",
  "presetVersion": 1,
  "isPremiumSourcePreserved": false,
  "storage": {
    "sourcePath": "users/uid/photos/photoId/source.jpg",
    "thumbPath": "users/uid/photos/photoId/thumb.jpg",
    "originalPath": null,
    "renderCachePath": null
  },
  "dimensions": {
    "sourceWidth": 2048,
    "sourceHeight": 2731,
    "thumbWidth": 512,
    "thumbHeight": 683
  },
  "renderAdjustments": {
    "exposureEV": 0.2,
    "contrast": 1.08,
    "temperatureShift": 12,
    "saturation": 0.92,
    "sharpness": 0.25,
    "fade": 0.16,
    "grainOpacity": 0.22,
    "vignetteIntensity": 0.7,
    "lightLeakOpacity": 0.0
  },
  "analysis": {
    "status": "done",
    "summary": "主體自然，但臉部略暗。",
    "suggestions": [
      "相機上移少許，讓眼睛靠近上三分線。",
      "向窗邊移一步，補臉部亮度。",
      "讓被拍者肩膀微側，姿勢更自然。"
    ],
    "numericSuggestions": {
      "exposureEV": 0.3,
      "temperatureShift": 8,
      "contrast": -0.05
    },
    "analyzedAt": "serverTimestamp"
  },
  "quotaSnapshot": {
    "planTier": "free",
    "countedTowardPhotoLimit": true,
    "countedTowardAnalysisQuota": true
  },
  "createdAt": "serverTimestamp",
  "updatedAt": "serverTimestamp",
  "deletedAt": null
}
```

Firebase Storage 的 Apple 平台 SDK 支援從記憶體資料或本機檔案 URL 上傳，也支援 progress / pause / resume / cancel。這意味著你的 `UploadService` 應該公開一個 `UploadState`，而不是把上傳工作完全藏在 repository 裡。另一方面，Cloud Firestore 支援 sorting、filtering 與 limits，因此歷史頁只需要用 `createdAt desc` 做簡單分頁查詢，不需要第一版再做 ElasticSearch 類型的歷史系統。citeturn1search5turn1search2

**免費與付費圖片保存策略** 建議如下：

- **免費**：只保存 `sourceCompressed + thumb`；最多 20 張雲端照片；不保存 original。
- **VIP**：保存 `sourceCompressed + thumb + optional original`；render cache 可視需要再開。
- **超出 20 張限制時**：不要先拍完再報錯。應在使用者按「保存到雲端」前先檢查 `photoCount`，若已滿，顯示三選一：`刪除舊照片`、`升級 VIP`、`只保留本機暫存不同步`。
- **AI 每日登入送 1 次分析**：記在 `users/{uid}`，不要記在 photo doc。

建議的 `users/{uid}` 文件最低欄位：

```json
{
  "planTier": "free",
  "photoCount": 12,
  "analysisCredits": 6,
  "dailyLoginBonusClaimedAt": "2026-06-07T08:00:00Z",
  "lastActiveAt": "serverTimestamp"
}
```

**刪除單張照片** 不建議純客戶端直接做。原因有兩個：第一，photo 通常不是一個檔，而是多個 Storage object；第二，Cloud Functions 的 callable 會自動攜帶 Firebase Auth token 與 App Check token，適合做 owner 驗證與集中刪除邏輯。Firebase 官方也提供對 callable functions 的 App Check enforcement。對你這種有 AI 成本與 Storage 成本的 App，`deletePhoto` 與 `analyzePhoto` 都建議走 callable，而且開啟 App Check enforcement。citeturn11search2turn11search1

**建議的 Cloud Function contract**：

```ts
// functions/src/photo/analyzePhoto.ts
type AnalyzePhotoRequest = {
  photoId: string;
  sourcePath: string;
  presetId: string;
  renderAdjustments: {
    exposureEV: number;
    contrast: number;
    temperatureShift: number;
    saturation: number;
    sharpness: number;
    fade: number;
    grainOpacity: number;
    vignetteIntensity: number;
    lightLeakOpacity: number;
  };
  locale: "zh-Hant" | "en";
  subjectHint?: "portrait" | "food" | "scene";
};

type AnalyzePhotoResponse = {
  summary: string;
  suggestions: string[]; // max 3
  numericSuggestions: {
    exposureEV?: number;
    contrast?: number;
    temperatureShift?: number;
    saturation?: number;
  };
  analysisVersion: string;
};

// functions/src/photo/deletePhoto.ts
type DeletePhotoRequest = {
  photoId: string;
};

type DeletePhotoResponse = {
  success: boolean;
  deletedPaths: string[];
};
```

**到期清理策略** 建議用排程函式。Firebase 官方的 scheduled functions 可用 `onSchedule` 觸發，因此你可以每天跑一次 `cleanupExpiredFreePhotos`，檢查免費用戶是否長期不活躍，並依 `lastActiveAt` 與 `planTier` 清理 Storage 與 Firestore。伺服器端 Admin SDK 會繞過 Firestore client Security Rules，因此這類批次清理與帳號全刪除更適合放在 Functions，而不是寄望客戶端自己維持一致性。citeturn9search6turn3search2

**建議的 Security Rules 草稿**，MVP 先做到 owner-only 即可：

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /photos/{photoId} {
        allow read, create, update, delete:
          if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}
```

```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{uid}/photos/{photoId}/{fileName} {
      allow read, delete:
        if request.auth != null && request.auth.uid == uid;

      allow create, update:
        if request.auth != null
        && request.auth.uid == uid
        && request.resource != null
        && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Firestore 與 Storage 的 Security Rules 都建議結合 Firebase Authentication 使用；Storage Rules 也支援基於 auth 與 request / resource metadata 的條件驗證。citeturn3search2turn3search1turn3search10

## 半格機、雙重曝光與微調介面

根據你的共用背景，**半格機與雙重曝光都不應該進入 base MVP**；最合理的位置是 **MVP+**。下面的設計，是在不推翻主架構的前提下，給 Codex 用的最小可行方案。

**半格機的最簡單可行版本**，我建議只做成一個獨立 editor mode，而不是直接塞到主相機的預設快門流程。流程如下：

1. 使用者在首頁點進 `HalfFrameEditor`。
2. 顯示左右兩格預覽框與拍攝提示。
3. 先拍第一張，暫存在 app 本機 cache，不立刻上傳。
4. 顯示第二格 overlay，拍第二張。
5. 本機把兩張圖裁成一致比例後 side-by-side 拼接。
6. 只把**合成後的最終圖**當成一個 `photo` 寫入雲端；未完成 draft 不同步。

這樣的好處是：你不需要在 MVP+ 立即處理 draft recovery、跨裝置續拍、來源圖與最終圖多版本同步。對歷史頁來說，它仍然只是一張普通照片，只是 `captureMode = "half_frame"`。這非常重要，因為你現在的歷史與刪除系統都還在 MVP 階段。

**建議的 half-frame metadata**：

```json
{
  "captureMode": "half_frame",
  "composition": {
    "layout": "side_by_side",
    "partCount": 2,
    "sourceRefs": [],
    "gutterPx": 24
  }
}
```

**雙重曝光的最簡單可行版本** 也不應綁死在主相機 shutter 上，而是做成拍後 / 匯入後的 editor。建議流程：

1. 選一張 base image。
2. 再選第二張 overlay image。
3. 兩張圖先做同尺寸 canvas 對齊與中心裁切。
4. 預設 blend mode 用 `screen`。
5. 提供一個 `intensity` slider。
6. 輸出成一張 final image。
7. 歷史頁只看 final image；metadata 裡記錄 base / overlay 與 blend 參數。

Apple 官方的 Core Image composite operations 已包含多種 blend / compositing filter，因此這裡不需要第一版再寫自己的 Metal blending shader。citeturn12search1turn12search9

**建議的 double exposure metadata**：

```json
{
  "captureMode": "double_exposure",
  "composition": {
    "blendMode": "screen",
    "intensity": 0.45,
    "sourceRefs": ["photoA", "photoB"]
  }
}
```

**數值微調 UI** 建議不要做成 Lightroom 式長面板。MVP 最好的做法是「**一條 slider + 一列 chip**」。理由很簡單：你的產品是拍攝教練，不是專業修圖器，太複雜的面板會直接破壞一鍵直出的定位。

建議 wireframe：

```text
┌──────────────────────────────────┐
│           PhotoReviewView        │
│                                  │
│          [ rendered photo ]      │
│                                  │
│  Preset: Retro Warm Day          │
│                                  │
│  [預設] [曝光] [對比] [色溫] [飽和] │
│  [顆粒] [暗角] [漏光]               │
│                                  │
│  value: +0.3                     │
│  ─────────●────────────           │
│                                  │
│  [AI 分析]     [保存]             │
└──────────────────────────────────┘
```

建議的 UI 規則：

- 一次只調一個參數。
- slider 下方顯示目前值。
- 使用者切換 chip 時，slider 綁定到不同欄位。
- `重設` 可以 reset 當前參數；`回復 preset` 則重設全部。
- AI 建議若回傳數值，可顯示「套用 AI 建議」按鈕，一次映射進同一個 `FilterAdjustments`。

**建議的資料模型**：

```swift
struct FilterAdjustments: Codable, Equatable {
    var exposureEV: Double
    var contrast: Double
    var temperatureShift: Double
    var saturation: Double
    var sharpness: Double
    var fade: Double
    var grainOpacity: Double
    var vignetteIntensity: Double
    var lightLeakOpacity: Double
}
```

本機即時導引若要在 MVP+ 先開一點點，不要做完整 AI overlay，而是只做 **grid、水平線、臉框、簡單 pose points**。Vision 本身可做臉框、人體姿勢偵測與地平線偵測；Apple 對人體姿勢的文件指出可偵測最多 19 個 body points，而其 sample 也示範了用相對較低的預覽解析度跑姿勢以降低負擔。這足以支援你說的「即時線條 / 框架導引」，但還不應該包裝成真正的雲端即時 AI。citeturn16search8turn0search3turn19search0turn0search15

## iOS 技術建議與建議檔案結構

**AVFoundation** 是必要選項，不是可選。你要的是自訂拍照 UI、Dazz 類相機頁、拍後流程控制、基礎 overlay，以及日後可能加入更多 capture mode。Apple 的 AVFoundation capture subsystem 就是為這類自訂 camera 體驗設計；官方 AVCam sample 也直接示範了如何用 AVFoundation 存取相機、設定 session、拍照與保存。結論很簡單：**相機層只能選 AVFoundation**。citeturn6search10turn6search22

**Core Image** 是 MVP 應該主用的圖片處理技術。它已經提供 still / video 的高效處理、內建濾鏡、濾鏡鍊優化、Metal-backed context 與自定義 kernel 擴充能力。也就是說，你現在需要的曝光、對比、色溫、暗角、銳利度、褪色、blend，都在 Core Image 能力圈內；未來真要做更重的自定義處理，還可以透過 `CIImageProcessorKernel` 把 Metal / MPS 整合進既有 Core Image pipeline，而不是整個重寫 renderer。這是 MVP 與長期演進之間最好的折衷。citeturn18search11turn0search10turn6search17turn6search15

**Metal** 在這個專案裡不是現在不用，而是**現在不應該先用**。Apple 也明說，Core Image 等高階框架本身已經 leverage Metal；如果你自己寫 Metal shader，的確可能拿到更高性能，但也會同時拉高 shader 維護、顏色管理、裝置差異、debug 與 Codex 生成難度。對一個先做 iOS-first MVP、三個 preset、單張分析的 App，這個交換比不划算。Metal 應該留到你真的要做：高頻即時預覽、多 pass 自定義漏光 / halation、極大量自定義 blend、或更重的 live camera filter pipeline 時再上。citeturn6search4turn6search1

**Vision** 應該用，但只用在輕量功能。Apple 將 Vision 定位為 still image 與 video 的電腦視覺框架，支援物件偵測、臉、文字、分割、姿勢等能力。對這個 App 來說，Vision 非常適合做：臉框、安全構圖框、姿勢點、地平線、注意區域提示。但它不應該在 MVP 被過度包裝成「實時雲端 AI 教練」。第一版你只要把它當成本機輔助層就好。citeturn19search8turn0search3turn19search0turn16search20

**第三方圖片濾鏡 library** 在第一版不建議導入。MetalPetal 官方將自己定位為基於 Metal 的即時 still / video 處理框架；GPUImage3 也提供基於 Metal 的 GPU image / video pipeline。這些框架都不是不能用，但它們都等於在你的 MVP 再加一層抽象、學習面與依賴風險。因為 Apple 原生的 AVFoundation + Core Image + Vision 已足夠完成你目前的需求，所以第一版不值得先把基礎渲染綁到第三方。若未來你真的需要更進階、持續性的 live processing，**MetalPetal 可作為後續評估對象**；但現在先不要碰。citeturn15view0turn15view1turn18search11turn6search10

**最終推薦結論**：

- **MVP 必用**：AVFoundation、PhotosPicker、Core Image、Firebase Storage / Firestore。
- **MVP 可用但要節制**：Vision。
- **MVP 不建議導入**：純 Metal shader pipeline、MetalPetal、GPUImage3、完整 PhotoKit 寫回相簿流程。

**建議的 iOS 端檔案結構**：

```text
ios-app/
  App/
    AppEntry.swift
    RootView.swift

  Features/
    Camera/
      Views/
        CameraView.swift
        CameraPreviewView.swift
        PhotoReviewView.swift
      ViewModels/
        CameraViewModel.swift
        PhotoReviewViewModel.swift
      Services/
        CameraSessionController.swift
        PhotoCaptureService.swift
        CameraPermissionService.swift
      Models/
        CapturedPhoto.swift
        CameraRecipe.swift

    PhotoPicker/
      Views/
        SinglePhotoPickerButton.swift
      Services/
        PhotoImportService.swift

    Filters/
      Models/
        VintagePreset.swift
        FilterAdjustments.swift
        LensProfile.swift
      Services/
        PresetCatalogService.swift
        FilterEngine.swift
        GrainOverlayProvider.swift
        LightLeakOverlayProvider.swift
        ImageRenderingContext.swift

    Editing/
      Views/
        HalfFrameEditorView.swift
        DoubleExposureEditorView.swift
        AdjustmentBarView.swift
      Services/
        HalfFrameComposer.swift
        DoubleExposureComposer.swift

    Photos/
      Models/
        PhotoMetadata.swift
        UserQuotaSnapshot.swift
      Services/
        ImageCompressor.swift
        StoragePathBuilder.swift
        UploadService.swift
        PhotoMetadataRepository.swift
        PhotoDeletionService.swift

    History/
      Views/
        HistoryListView.swift
        HistoryDetailView.swift
      ViewModels/
        HistoryListViewModel.swift

  Resources/
    Presets/
      vintage-presets.json
    Overlays/
      grain_01.png
      grain_02.png
      light_leak_red_01.png
      light_leak_orange_01.png
```

**建議的 Cloud Functions 檔案**：

```text
functions/src/
  photo/
    analyzePhoto.ts
    deletePhoto.ts
    cleanupExpiredFreePhotos.ts
  shared/
    auth.ts
    appCheck.ts
    errors.ts
```

## Codex 任務清單與驗收標準

下面這份清單是以 **「每個任務都能小步完成、可單獨驗證、不會一次生成太多」** 為目標寫的。每個任務都假設 Codex 先讀 `README` 與 `docs/`，不刪除既有功能，只做增量修改。

**任務一：`CameraView`**

- **輸入**：SwiftUI app skeleton、無相機功能。
- **輸出**：可預覽後鏡頭畫面、可拍單張、可切前後鏡、拍後回傳 `CapturedPhoto`。
- **檔案**：`CameraView.swift`、`CameraPreviewView.swift`、`CameraSessionController.swift`、`PhotoCaptureService.swift`、`CameraPermissionService.swift`
- **驗收標準**：
  - 首次進入相機頁時能正確請求相機權限。
  - 權限允許後，2 秒內看到預覽。
  - 點快門後能拿到 1 張照片並進入預覽頁。
  - 權限拒絕時顯示 fallback UI，而不是白屏或 crash。
- **手動驗證**：
  - 真機測試允許 / 拒絕權限各一次。
  - 拍照後確認預覽圖正向、不倒轉。

**任務二：`PhotoPicker`**

- **輸入**：已有預覽頁，但只能用相機。
- **輸出**：可從相簿單選 1 張圖片進入同一個預覽頁。
- **檔案**：`SinglePhotoPickerButton.swift`、`PhotoImportService.swift`
- **驗收標準**：
  - 只能選 1 張 image。
  - 成功匯入後與相機拍照走同一條 review flow。
  - 不需先出現「允許完整相簿權限」的自訂權限流程。
- **手動驗證**：
  - 從系統相簿選 portrait、landscape、大圖各 1 張。
  - 驗證 EXIF orientation 正常。

**任務三：`PresetModel`**

- **輸入**：已有 review 頁，但沒有 preset 系統。
- **輸出**：可載入 bundled JSON，得到至少 3 個 preset。
- **檔案**：`VintagePreset.swift`、`FilterAdjustments.swift`、`PresetCatalogService.swift`、`Resources/Presets/vintage-presets.json`
- **驗收標準**：
  - App 啟動後可載入 3 個 preset。
  - preset 有 id、name、preview、filter parameters。
  - 壞掉的 JSON 會回傳可處理錯誤，不直接 crash。
- **手動驗證**：
  - 切換 3 個 preset，UI 名稱與預覽變化正確。

**任務四：`FilterEngine`**

- **輸入**：已有 preset 資料，但不能套濾鏡。
- **輸出**：單張圖片可套 3 個 preset，並支援基礎數值微調。
- **檔案**：`FilterEngine.swift`、`ImageRenderingContext.swift`、`GrainOverlayProvider.swift`、`LightLeakOverlayProvider.swift`
- **驗收標準**：
  - 支援曝光、對比、色溫、飽和、顆粒、暗角、漏光、銳利度、褪色。
  - 同一張圖套同一組 preset + adjustments，輸出應 deterministic。
  - 2048px 長邊圖片在真機上切換 preset 時有可接受流暢度，不可明顯卡死主執行緒。
- **手動驗證**：
  - 三個 preset 視覺差異明顯。
  - slider 調整後即時預覽變化合理。

**任務五：`ImageCompressor`**

- **輸入**：可拍照與套濾鏡，但沒有雲端上傳前處理。
- **輸出**：能生成 `sourceCompressed`、`thumb`，VIP 模式可保留 `original` 路徑。
- **檔案**：`ImageCompressor.swift`
- **驗收標準**：
  - `sourceCompressed` 長邊壓到你設定的上限。
  - `thumb` 長邊壓到你設定的歷史尺寸。
  - 免費方案不生成 `original upload` 任務。
  - VIP 方案保留 original 的本機檔案引用。
- **手動驗證**：
  - 匯入大圖後不 OOM。
  - 輸出圖大小與畫質符合預期。

**任務六：`UploadService`**

- **輸入**：本機已有圖片版本，但沒有上雲能力。
- **輸出**：可把 `sourceCompressed`、`thumb` 上傳到 Storage，並回傳 storage path。
- **檔案**：`StoragePathBuilder.swift`、`UploadService.swift`
- **驗收標準**：
  - 上傳期間有 progress state。
  - 網路中斷時可回傳錯誤並保留 retry 能力。
  - 同一張照片的 Storage path 命名規則一致。
- **手動驗證**：
  - 開啟飛航模式模擬失敗。
  - 恢復網路後可重試成功。

**任務七：`PhotoMetadataService`**

- **輸入**：Storage 上傳可成功，但沒有 Firestore metadata。
- **輸出**：成功寫入 photo doc，歷史頁可依 `createdAt` 反向排序。
- **檔案**：`PhotoMetadata.swift`、`PhotoMetadataRepository.swift`、`HistoryListView.swift`、`HistoryListViewModel.swift`
- **驗收標準**：
  - 每張照片至少寫入 `presetId`、`renderAdjustments`、`storage paths`、`createdAt`。
  - 歷史頁只拉縮圖與 metadata。
  - 列表更新不需要重啟 app。
- **手動驗證**：
  - 連拍 3 張後歷史順序正確。
  - 切換帳號後不看到別人的 metadata。

**任務八：`HalfFrameEditor`**

- **輸入**：已有一般 review flow。
- **輸出**：可用兩張圖拼成 side-by-side half-frame 成品。
- **檔案**：`HalfFrameEditorView.swift`、`HalfFrameComposer.swift`
- **驗收標準**：
  - 兩張圖能完成 side-by-side 拼接。
  - 未完成第二張前，不寫入雲端 photo doc。
  - 完成後只生成一個最終 `photo` 記錄。
- **手動驗證**：
  - 相機拍兩張、相簿選兩張都能成功合成。
  - 中途退出不留下髒資料。

**任務九：`DoubleExposureEditor`**

- **輸入**：已有一般 review flow。
- **輸出**：可選兩張圖做 screen blend，並用 slider 控制強度。
- **檔案**：`DoubleExposureEditorView.swift`、`DoubleExposureComposer.swift`
- **驗收標準**：
  - 預設 blend mode 為 `screen`。
  - 有 0 到 1 的強度 slider。
  - 產出 final image 與 metadata 中的 composition 資料。
- **手動驗證**：
  - 不同亮度、不同方向的兩張圖都能合成。
  - intensity 拉到極低與極高時結果差異明顯。

**測試 checklist** 應至少覆蓋以下情境：

- 不同 iPhone 尺寸：小螢幕與大螢幕的 review UI、slider、歷史頁是否壓版。
- 權限拒絕：相機拒絕、相機之後去設定開回來。
- 相機不可用：Simulator、受限裝置、初始化失敗。
- 大圖片壓縮：高像素相簿圖、全景圖、方向資訊複雜的圖。
- 上傳失敗：離線、弱網路、中途中斷。
- 離線狀態：拍照後圖片是否仍能先在本地 review，之後手動 retry。
- 免費額度用完：20 張 photo limit、analysis quota 0 時的 UI。
- 付費原圖保存：VIP 模式下確認 original path 與 source path 都被正確處理。
- 刪除單張照片：Storage object 與 Firestore doc 是否一致移除。
- 歷史同步：第二台裝置登入後能拉到同一批照片 metadata。

**整體 acceptance criteria** 應該長這樣：

- 使用者可在 iPhone 上完成：拍一張照片 → 套一個 preset → 微調數值 → 保存到 Firebase Storage / Firestore → 在歷史頁看到該筆資料。
- 使用者可在 iPhone 上完成：從相簿匯入一張圖 → AI 分析按鈕可用 → 保存 metadata。
- 免費方案到達 20 張限制時，不會再偷偷上傳第 21 張雲端圖片。
- VIP 模式下，原圖保存路徑會被建立；免費模式下不建立。
- 刪除單張照片後，歷史頁、Firestore doc、Storage objects 三者狀態一致。
- 半格機與雙重曝光若尚未正式開啟，不影響主拍照流程；若開啟，也必須是獨立 editor，不破壞原 MVP 拍照路徑。

**Codex 可執行任務清單**：

- 先建立 `CameraView` 與 `CameraSessionController`。
- 再接 `SinglePhotoPickerButton` 與 `PhotoImportService`。
- 建立 `VintagePreset`、`FilterAdjustments`、`vintage-presets.json`。
- 實作 `FilterEngine`，先完成 3 個 preset。
- 加上 `AdjustmentBarView` 與 slider UI。
- 實作 `ImageCompressor` 生成 `sourceCompressed` 與 `thumb`。
- 實作 `UploadService` 與 `StoragePathBuilder`。
- 實作 `PhotoMetadataRepository` 與 `HistoryListView`。
- 實作 `deletePhoto` callable function 與 `PhotoDeletionService`。
- 實作 `HalfFrameComposer`。
- 實作 `DoubleExposureComposer`。
- 最後補測試：權限、壓縮、上傳失敗、照片限制、VIP 原圖保存。

這份順序的核心原則只有一個：**先完成單張主路徑，再做風格，再做保存，再做歷史，最後才做半格機與雙重曝光**。這樣 Codex 每一步都能有可運行輸出，不容易在一次產生過多檔案時失敗。