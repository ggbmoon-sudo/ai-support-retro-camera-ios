# iOS 復古拍照 App 私隱、安全、AI 圖片使用與 App Store 風險報告

## 政策基線與核心結論

### P25-R6 internal Live AI consent note

The DEBUG/internal Live AI Camera experiment remembers the user's first explicit acceptance of one exact image-processing disclosure version. Only a version-scoped boolean is stored locally; no image, prompt, response, provider text, or training consent is persisted. The same disclosure is not repeated on every session, but Settings provides a reset action and any material disclosure change must use a new key and request consent again. No first-use upload occurs before acceptance, and this does not enable a Release/production Camera cloud route.

截至 **2026 年 6 月 7 日**，以你描述的 MVP 路線來看，最穩妥、最符合官方政策與後續上架風險控制的做法，不是先讓用戶廣泛同意「照片可被拿去訓練模型」，而是把首個必需 consent 僅限於：**為了完成 AI 分析，照片會傳送到第三方 AI 服務**。原因很直接：Apple 現行《App Store Review Guidelines》已明確要求，若個人資料會分享給第三方，包含**第三方 AI**，App 必須清楚說明並取得使用者明示許可；同時，若 App 有帳戶建立功能，必須讓所有使用者都能在 App 內發起帳戶刪除。Apple 也要求隱私政策要說明收集、使用、分享、保留/刪除資料與撤回同意的方式。citeturn4view0turn38view0turn28view0

就第三方 AI 供應商而言，你目前選的 **Gemini paid tier** 與你未來預留的 **OpenAI API business/API**，官方文件都指向同一個結論：**業務/API 資料預設不會被拿來訓練其產品或模型**。Google 的 Gemini API Additional Terms 說明，**Paid Services** 下，Google **不會**使用提示、快取內容、檔案（包括圖片）或回覆來改善產品；OpenAI 也說明，API/Business 資料預設**不會**用於訓練模型，除非你另外明確 opt in。這代表如果你的 MVP UI 一開始就把「照片可能會用作模型訓練」寫成預設或綁定條件，除了法律風險，也有**真實性與 App Review** 風險，因為它可能和你實際使用的付費 API 路徑不相符。citeturn17view0turn15search0turn14view1turn14view2

另一個高風險點是 **Gemini Developer API 的年齡與分發條款**。Google 目前的 Additional Terms 寫明：使用 API 的人必須 **18 歲或以上**，而且你**不得**把服務用在「面向 18 歲以下，或可能被 18 歲以下人士存取」的 App/服務中；同時，若面向 **EEA、瑞士、英國** 用戶提供 API client，必須使用 **Paid Services**。這對公開上架的 consumer App 是一個很重要的**契約與產品定位風險**：如果你要用 Gemini Developer API 做公開消費者產品，至少 MVP 應採 **成人向定位與年齡閘門**，並在正式公開前做一次 provider/legal 確認。citeturn17view0

Firebase 層面上，官方文件很清楚：在一般情況下，**你是資料控制者**，Google/Firebase 通常是**處理者/服務提供者**；因此，刪除權、使用者查詢、保存期限、實際安全配置，責任都還是在你這邊，而不是因為用了 Firebase 就自動合規。Firebase 也明確建議使用 **App Check、Authentication、Security Rules、Secret Manager**，並提醒 **Cloud Functions 記錄會進入 Cloud Logging**，所以敏感資料不應被寫入 log。citeturn32view0turn10view0turn9view0turn11search0

## 風險總覽

**人臉照片**：你這個 App 處理的是可識別人像照片，這在香港 PDPO 與 GDPR 架構下都屬於個人資料；在 GDPR 下，如果你未來把臉部影像做成用於**唯一識別**的技術處理，例如 face embedding、身份比對、人物聚類，則可能進一步落入**生物特徵資料**與較高敏感度處理。你目前的 Vision 用途若只限於本機輕量取景輔助、構圖與 pose points，且不離開裝置，風險明顯低很多。citeturn19view1turn22search7turn19view0turn28view0

**第三方 AI API**：一旦照片送到第三方 AI，風險就不只在你自己的 Firebase。Google 明說 Gemini 會做濫用監控，並保留 prompts、context 與 output **55 天** 來偵測政策違規；被安全過濾器標記的內容，可能會由授權人員進行人工審閱。OpenAI 則說 API 預設可能為濫用監控保留資料**最多 30 天**，合資格客戶才可申請更嚴格的 retention 控制。這意味著「刪除 App 內照片」**不等於**「第三方 AI 端立即完全沒有任何殘留」。citeturn17view1turn14view0turn14view1

**照片可能被用作模型訓練**：對你目前的 MVP 來說，最大的風險不是「一定會被訓練」，而是**錯誤告知**。Gemini 付費服務明示不把 prompts、檔案與回覆拿去改善產品；OpenAI API business data 也預設不訓練。因此，MVP 不應把「用作模型訓練」當作預設同意項，也不應暗示這是分析功能的必要條件。若未來你真的要建立第一方資料集改善自家模型，應把它當成**全新目的**來處理。citeturn17view0turn15search0turn14view1turn13search2

**用戶同意是否足夠**：**不夠**。Apple 要求的是**明示許可、清楚揭露、可撤回**；GDPR 對有效 consent 的條件是**自由給予、特定、知情、明確**，而「綁定式同意」並不穩妥；香港 PDPO 的 DPP3 則要求，若要把個人資料用於與原收集目的無關的新目的，需取得資料當事人的**明示且自願**同意，而且可以以書面撤回。所以，一個總括式「我同意你分析、分享、訓練、改圖、改進服務」的單一 checkbox，風險太高。citeturn4view0turn23search2turn23search11turn29search0

**刪除權**：GDPR 有明確的**刪除權/被遺忘權**，團隊通常應在原則上於 **1 個月內**回覆資料權利請求；香港 PDPO 雖沒有完全等價的廣義刪除權設計，但要求資料**不得保存超過必要時間**，且不再需要時應採取步驟刪除；Apple 則進一步把「App 內可發起帳戶刪除」變成上架要求。對你的 App 來說，這三者合起來的實務結論非常清楚：**必做單張照片刪除、全帳戶刪除、清楚保留政策**。citeturn23search1turn23search10turn30search0turn38view0

**App Store 審核**：你最容易踩雷的審核點不是「用了 AI」，而是**資料真實揭露、帳戶刪除、登入綁定、Apple Login、年齡與內容風險**。Apple 要求如果 App 沒有顯著的帳戶導向功能，應允許用戶在不登入的情況下使用；若用第三方或社交登入作主要帳戶登入，通常必須提供**Sign in with Apple**；如果個資會分享給第三方 AI，要先取得明示允許；如果有帳戶，就要在 App 內刪除；而描述 AI 功能時不能誤導或過度保證。citeturn4view0turn38view0

**兒童與未成年用戶**：這是你目前最大的紅旗之一。Apple 對兒童資料與 Kids 類別有額外限制；GDPR 對以 consent 為基礎處理兒童資料有家長同意門檻；而 Gemini Additional Terms 直接把 API 使用門檻拉到 **18+**，並禁止用於面向或可能由 18 歲以下使用者存取的服務。這代表你的 MVP 若使用 Gemini Developer API，**最安全的實作不是「先上再說」**，而是要麼把 AI 功能與產品定位鎖在成年人，要麼在正式公開前先完成 provider/legal 確認。citeturn4view0turn23search0turn17view0

**敏感照片**：雖然你的定位是拍照教練，不是成人內容或臉辨識產品，但真實世界中使用者仍可能上傳**未經授權的人像、未成年人照片、親密照片、醫療照片**。Google 的 Generative AI Prohibited Use Policy 明確禁止涉及 **CSAM、未經同意的親密影像、未經法定同意使用個資或生物識別資料、追蹤他人**等行為；OpenAI 使用政策也明確禁止未經同意的親密內容、人臉辨識資料庫、對未成年人造成傷害等用途。你的 App 即使沒有社交功能，也應在 terms、warning text 與客服處理流程上把這條線畫清楚。citeturn37search0turn39search1turn39search2

## 建議的 MVP 私隱策略

你的 MVP 建議採以下原則，這也是我認為最實際、最不會推翻主架構的方案。

| 範圍 | MVP | MVP+ | Future |
|---|---|---|---|
| AI 分析同意 | **必需**。只同意「照片會上傳至第三方 AI 作分析」 | 加入 provider 名稱與區域說明 | 依功能分供應商與用途展示 |
| 模型訓練同意 | **不出現或預設 false** | 若真的啟動資料集計畫，再做獨立 opt-in | 做成可稽核、可撤回、可分用途 |
| 供應商模式 | **只用 Gemini paid tier**，不可 fallback 到 unpaid/AI Studio | 加入 provider kill switch | 依地區切換合約與資料策略 |
| 帳戶策略 | 基本相機/基本濾鏡盡量不綁登入；AI/雲端歷史再要求登入 | 可加本地 guest mode | 依平台與法域擴充 |
| 刪除能力 | 單張照片刪除、帳戶刪除 | 全量匯出 | provider-aware deletion orchestration |
| 未成年人 | **成人向定位**；AI 功能前加 18+ 確認 | 年齡風險審核與客服流程 | 若要擴至未成年人，先重審 provider/法律 |

這個矩陣的官方基礎很清楚：Apple 要求分享至第三方（包括第三方 AI）前須有明示許可；Gemini **Paid Services** 不使用 prompt/檔案/回覆改善產品，但 **Unpaid Services** 會使用內容與回覆來提供、改善與開發 Google 產品，且可能有人類審閱；Gemini 也要求對 EEA/UK/CH 用戶提供 API client 時使用 Paid Services。OpenAI business/API 則預設不拿資料訓練。citeturn4view0turn17view0turn15search0turn14view1

我對你的 **MVP 私隱策略** 的明確建議如下：

1. **不要把用戶照片預設用作模型訓練。**  
   `trainingConsent` 應維持 `false`，而且在你沒有真實訓練流程、明確資料流與可撤回機制之前，最好**不要在 MVP UI 出現這個選項**。如果現在就把它寫進 consent，容易形成「先拿寬同意、但實際沒有這用途」的真實性風險。citeturn17view0turn14view1turn4view0

2. **把「AI 分析需要上傳」與「同意用作改善模型」完全拆開。**  
   前者是 MVP 必需；後者只能是未來獨立 opt-in，而且不得綁功能、不得綁訂閱、不得用預設勾選。Apple 禁止把不必要的個資使用當成功能前提；GDPR 對 tied consent 很敏感；PDPO 對新目的使用要求另行明示自願同意。citeturn4view0turn23search2turn29search0

3. **允許隨時撤回 consent。**  
   撤回後，未來的 AI 分析應立刻停用；已存在的分析歷史不必自動全部刪掉，但要提供**一鍵刪除所有照片與歷史**。Apple 要求撤回機制清楚可得；GDPR 也把撤回同意當成核心權利之一。citeturn4view0turn23search17

4. **把雲端照片與分析結果當成可刪除資產，而不是永久資產。**  
   單張照片刪除時應刪 `Storage 檔案 + Firestore metadata + AI 建議 + 縮圖/衍生檔`；帳戶刪除則刪整個 user scope。PDPO 與 GDPR 都要求不要保存超過必要時間；Apple 也要求刪帳號時刪除與帳戶關聯的資料。citeturn30search0turn23search1turn38view0

5. **Gemini 用法上，MVP 盡量採「stateless、短存活、少功能」策略。**  
   你的單張照片分析不需要 Grounding with Google Search、不需要 Interactions API、不需要 Live API；這些功能會引入額外保存行為。若不得不用 Files API，上傳後要在分析完成後**立即 delete**，不要等 48 小時自動刪。citeturn15search0turn34view1turn34view2

6. **App Store App Privacy 預期要揭露的資料類型，要提早設計。**  
   依 Apple 的官方定義，只要照片從裝置送出，且你或第三方可以在即時請求完成後仍可存取，就屬於「collect」。對你的 MVP 來說，幾乎可以預期至少會涉及 **Photos or Videos、User ID、Email Address**；若有訂閱同步，還可能涉及 **Purchase History**；若加入 crash/analytics，也可能涉及 **Product Interaction / Crash Data / Performance Data**。相對地，你的本機 Vision 輔助若**完全不出裝置**，Apple 明說可不視為 collected data。citeturn28view0

7. **基本相機與基本濾鏡不應被 AI consent 或訓練 consent 鎖住。**  
   這不只是產品邊界正確，也有利 App Review。Apple 指出，若 App 沒有顯著帳戶導向功能，應允許使用者不登入就能使用；而不必要的資料收集不應成為使用功能的條件。citeturn4view0

## 用戶同意流程與 App 內警告文字

建議把 consent flow 做成**功能前閘門**，而不是啟動時一次性全部綁死。這樣最符合 Apple 對明確揭露、用戶控制與可撤回的要求，也符合 GDPR/PDPO 對特定目的同意的精神。citeturn4view0turn23search2turn29search0

**第一次啟動**  
不先要求 AI consent。先顯示簡短 onboarding：  
- 基本相機與濾鏡可先用。  
- AI 分析功能會把照片傳到第三方 AI。  
- 提供 `Privacy Policy`、`Terms of Service` 入口。  
- 若你決定採 Gemini Developer API 直上 public consumer MVP，這一步建議加入 **18+ 年齡確認**，否則至少要在第一次 AI 分析前做。citeturn17view0turn28view0

**第一次使用 AI 分析**  
這裡才出現真正的 consent gate，而且只能綁**分析上傳**，不能綁**訓練**。建議 UI 上有三個層級：  
- 主文案：照片會傳送到第三方 AI 服務作分析。  
- 次文案：AI 建議只供參考，可能不完全準確。  
- 行動按鈕：`不同意`、`同意並分析`。  
如果你未來才會做訓練資料集，MVP 這一步**不要**放第二個 opt-in。若現在就放，只會增加理解負擔與合規風險。citeturn4view0turn17view0turn14view1

**第一次使用圖片改圖**  
這雖然不是 MVP 必做，但你既然已預留 OpenAI image/edit adapter，我建議把它當成**獨立 consent gate**。原因是資料流、風險描述、輸出性質與誤用風險都不同於「單純分析」。若未來改圖功能會上傳原圖與文字指令，應分開說明供應商、保留策略與不準確風險。OpenAI business/API 預設不訓練，但 API 資料仍可能有最多 30 天的濫用監控保留；如果它用到 files，也應在工作完成後主動 delete。citeturn14view0turn14view1turn33search0turn33search2

**Privacy Policy / Terms 入口**  
至少要出現在：  
- 首次啟動 onboarding  
- AI 分析 consent gate  
- 設定頁  
- 訂閱頁  
- 帳戶刪除頁  
Apple 要求 privacy policy URL；Privacy Choices URL 雖是 optional，但很值得做。citeturn28view0turn6search1

**可撤回 consent**  
`PrivacySettingsView` 裡應有：  
- `允許第三方 AI 分析` 開關  
- `刪除所有雲端照片與歷史` 按鈕  
- （現在先不顯示）`同意用作改善模型` 開關  
撤回 `AI analysis consent` 後，只影響**未來請求**，不自動刪歷史；歷史交由 `Delete All Data` 或逐張刪除處理。這樣行為比較可預期。citeturn4view0turn23search17

**Account deletion**  
必須 App 內可發起、容易找到、流程簡單透明；不能只提供停用帳號，也不能強迫寄 email 給客服才可刪。若 App 支援 Sign in with Apple，刪帳時還要處理 token revocation；若有自動續期訂閱，UI 必須說清楚「刪帳不等於取消 Apple 訂閱」，並引導到管理訂閱頁面。citeturn38view0

下面這組文案可以直接做成 `Localizable.strings` 的初版。

| Key | 中文範例 | English Sample |
|---|---|---|
| `warning.ai_reference_only` | AI 建議只供參考，可能不完全準確，請自行判斷是否採用。 | AI suggestions are for reference only and may be inaccurate. Please use your own judgment. |
| `warning.third_party_ai_upload` | 使用 AI 分析時，圖片會被傳送到第三方 AI 服務處理。 | When you use AI analysis, your image will be sent to a third-party AI service for processing. |
| `warning.no_sensitive_illegal_unauthorized` | 請勿上傳敏感、非法、未經授權，或你無權處理的人像照片。 | Do not upload sensitive, illegal, unauthorized, or otherwise non-permitted photos. |
| `warning.deletion_may_take_time` | 圖片刪除後，系統與第三方處理完成可能需要一段時間。 | After deletion, it may take some time for our systems and third-party processing to fully complete. |
| `warning.ai_edit_may_be_inaccurate` | AI 改圖結果可能不完全準確，亦可能與你的預期不一致。 | AI edits may be imperfect and may not match your expectations. |
| `warning.subscription_not_cancelled` | 刪除帳戶不會自動取消 Apple 訂閱，請先在 Apple 訂閱管理中取消。 | Deleting your account does not automatically cancel your Apple subscription. Please cancel it in Apple subscription settings first. |
| `warning.adult_only_ai` | AI 功能目前僅供年滿 18 歲用戶使用。 | AI features are currently available only to users aged 18 or above. |

## Privacy Policy 與 Terms of Service 草稿大綱

**Privacy Policy 草稿大綱**

你不需要在 MVP 就把它寫成長篇法律文件，但結構必須完整，而且不能和實際資料流不一致。建議至少包含以下段落：

- **我們收集什麼資料**：帳戶資料（email、登入供應商、UID）、照片/圖片、分析結果、preset 與歷史、訂閱狀態、基本技術與安全資料。若未啟用 Crashlytics/Analytics，就不要先寫進去。  
- **為什麼收集**：提供相機、儲存歷史、AI 分析、同步、帳戶管理、防濫用、付款/恢復訂閱。  
- **如何使用照片**：  
  - 照片可儲存在 Firebase Storage 以支援雲端歷史。  
  - 照片在你使用 AI 分析時會傳送到第三方 AI 提供者。  
  - **預設不會用於模型訓練**。  
  - 若日後要用於改善模型，會另行請求獨立 opt-in。  
- **第三方服務**：Firebase、Apple、Google Sign-In、StoreKit、Gemini；未來若上線 OpenAI image/edit，再新增 OpenAI。  
- **保存期限**：  
  - 用戶主動保存的雲端照片與歷史，依方案與政策保存。  
  - 免費用戶不活躍 90 日可清理雲端照片與分析歷史。  
  - 第三方 AI 供應商可能依其政策保留有限期濫用監控記錄。  
- **刪除方式**：單張刪除、刪除所有雲端資料、刪除帳號；說明完成可能需要時間。  
- **兒童資料**：目前 AI 功能不面向 18 歲以下用戶；不要把未成年人照片拿去做訓練用途。  
- **跨境處理**：若面向香港以外、特別是 EU/EEA 用戶，要補上 DPA/跨境資料傳輸說明。  
- **聯絡方式**：privacy email、support email、資料權利請求入口。  

Apple 要求 privacy policy 說明收集、使用、揭露、分享、保留/刪除及撤回同意；GDPR 也要求使用者得知蒐集何種資料、原因與對象；香港 PDPO 也要求在直接收集個資時告知目的、轉移對象類別，以及查閱/改正權利。citeturn4view0turn28view0turn23search17turn30search0

**Terms of Service 草稿大綱**

- **用戶責任**：你只能上傳你擁有權利、已獲授權或依法可處理的照片。  
- **圖片權利**：用戶保留對其照片的權利；你僅取得提供服務所需的有限使用權。OpenAI business/API 與 Gemini 都不是要你把內容永久授權用作產品訓練的預設路徑。citeturn14view1turn17view0  
- **AI 生成或分析內容**：AI 建議與未來 AI 改圖結果可能不準確，不應被描述為專業攝影、法律、醫療或其他專業意見。Gemini 條款也要求對生成內容自行判斷，並由開發者決定適當的安全設定與 factuality 工具。citeturn17view0turn37search1  
- **禁止內容**：不得上傳非法、侵權、未經同意的人像、未成年人受害內容、未經同意的親密影像、規避安全機制或其他違反供應商政策的內容。citeturn37search0turn39search1  
- **訂閱與退款**：說明由 Apple 處理計費；刪除帳號不會自動取消 Apple 訂閱；退款由 Apple 機制處理。citeturn38view0  
- **責任限制**：AI 建議僅供參考；不保證任何特定攝影效果、審美結果或商業用途適配性。  
- **刪除與終止**：你可以刪除單張照片、刪除帳號；你也可因違反內容政策而限制帳戶。  

一個很重要的實務提醒是：**不要承諾你做不到的刪除效果**。你可以承諾「你自己的系統會刪除」，但第三方 AI 供應商的濫用監控保留仍須依其官方政策表述。Gemini paid service 雖不拿資料做產品改善，但仍存在有限期間的安全監控記錄；OpenAI API 也存在最多 30 日的 default abuse-monitoring retention。citeturn17view1turn14view0

## Firebase 安全設計、資料刪除與九十日政策

你的架構本身是合理的：**SwiftUI + AVFoundation + PhotosPicker + Firebase + Cloud Functions v2 + App Check + StoreKit 2**。真正要補強的是「資料最小化、規則落地、secret 管理、可刪除資料編排」。Firebase 官方把 **Authentication** 與 **App Check** 視為互補；也建議所有支援的服務都啟用 App Check enforcement、以鎖定模式起步寫 Security Rules，並用 Secret Manager 管理敏感憑證。對 Cloud Functions 而言，官方也明示 `.env` 不是儲存 API keys 的安全方式。citeturn7search1turn8search0turn10view0turn9view0turn11search2

### 建議檔案名稱與模組命名

**iOS**
- `App/Features/Privacy/ConsentView.swift`
- `App/Features/Privacy/PrivacySettingsView.swift`
- `App/Features/Privacy/AccountDeletionView.swift`
- `App/Features/Privacy/PrivacyPolicyPlaceholderView.swift`
- `App/Features/Privacy/TermsPlaceholderView.swift`
- `App/Services/ConsentService.swift`
- `App/Services/DataDeletionService.swift`
- `App/Services/AIAnalysisGatekeeper.swift`
- `App/Localization/WarningText.strings`
- `App/Models/PrivacyModels.swift`

**Cloud Functions**
- `functions/src/privacy/requestAccountDeletion.ts`
- `functions/src/privacy/cleanupUserData.ts`
- `functions/src/privacy/requestPhotoDeletion.ts`
- `functions/src/privacy/redaction.ts`
- `functions/src/privacy/rateLimit.ts`
- `functions/src/ai/analyzePhoto.ts`
- `functions/src/providers/gemini/GeminiAnalyzer.ts`
- `functions/src/providers/openai/OpenAIImageAdapter.ts` 只保留 adapter，先不啟用
- `functions/src/schedules/cleanupInactiveFreeUsers.ts`

### 建議資料 schema

```ts
// users/{uid}
type UserDoc = {
  uid: string
  createdAt: Timestamp
  updatedAt: Timestamp
  lastActiveAt: Timestamp
  authProviders: ("password" | "google.com" | "apple.com")[]
  planTier: "free" | "premium"

  consent: {
    aiAnalysis: {
      accepted: boolean
      acceptedAt?: Timestamp
      version?: string
      withdrawnAt?: Timestamp
    }
    training: {
      accepted: boolean   // MVP 預設 false
      acceptedAt?: Timestamp
      version?: string
      withdrawnAt?: Timestamp
    }
    adultConfirmed: {
      accepted: boolean
      acceptedAt?: Timestamp
      version?: string
    }
    policy: {
      privacyVersion?: string
      termsVersion?: string
      acceptedAt?: Timestamp
    }
  }

  usage: {
    analysisQuotaRemaining: number
    dailyBonusLastClaimedAt?: Timestamp
    cloudPhotoCount: number
  }

  deletion: {
    status: "none" | "requested" | "processing" | "done" | "failed"
    requestedAt?: Timestamp
    completedAt?: Timestamp
  }
}

// users/{uid}/photos/{photoId}
type PhotoDoc = {
  photoId: string
  ownerUid: string
  createdAt: Timestamp
  updatedAt: Timestamp
  storagePath: string               // 不存 public URL
  previewStoragePath?: string
  originalStoragePath?: string      // MVP 可不開
  presetId?: string
  status: "active" | "pendingDelete" | "deleted"

  ai?: {
    provider: "gemini"
    analyzedAt: Timestamp
    summary: string
    suggestions: string[]           // max 3
    adjustments: {
      exposure?: number
      contrast?: number
      warmth?: number
      cropTightness?: number
    }
    requestIdHash?: string          // hash，不存 raw provider id
  }
}

// deletionRequests/{requestId}
type DeletionRequestDoc = {
  requestId: string
  uid: string
  type: "photo" | "account" | "inactiveCleanup"
  photoId?: string
  status: "queued" | "processing" | "done" | "partial" | "failed"
  reason: "userInitiated" | "inactivity90d" | "supportAction"
  requestedAt: Timestamp
  startedAt?: Timestamp
  completedAt?: Timestamp
  retryCount: number

  targets: {
    firestorePaths: string[]
    storagePaths: string[]
  }

  providerCleanup: {
    provider: "gemini" | "openai" | "none"
    mode: "none" | "manualFileDelete" | "retentionWindowOnly"
    status: "n/a" | "queued" | "done" | "notSupported"
  }

  audit: {
    actor: "user" | "system" | "support"
    uidHash: string
  }
}
```

這個 schema 的重點是：**不存 download URL、不存 raw base64、不存 provider 原始 request payload**，而是存 `storagePath`、結果摘要與最小必要 metadata。這樣比較符合 Apple App Privacy 的最小揭露邏輯，也符合 PDPO/GDPR 的資料最小化與保存限制。citeturn28view0turn21search0turn30search0

### 建議 Cloud Function contract

```ts
// callable / HTTPS + Firebase Auth + App Check
POST /requestAccountDeletion
Request: {
  reauthToken?: string
}
Response: {
  requestId: string
  status: "queued"
  subscriptionWarningShown: boolean
}

// internal trigger or task
cleanupUserData(requestId: string): Promise<{
  deletedFirestoreDocs: number
  deletedStorageObjects: number
  providerCleanup: "done" | "notSupported" | "n/a"
  finalStatus: "done" | "partial" | "failed"
}>

// callable / HTTPS + Firebase Auth + App Check
POST /requestPhotoDeletion
Request: {
  photoId: string
}
Response: {
  requestId: string
  status: "queued"
}

// callable / HTTPS + Firebase Auth + App Check
POST /analyzePhoto
Request: {
  photoId: string
  source: "camera" | "import"
  presetId?: string
}
Response: {
  analysisId: string
  provider: "gemini"
  summary: string
  suggestions: string[]
  adjustments: Record<string, number>
}
```

`analyzePhoto` 應只接受 `photoId`，由 backend 自行讀取 Storage 內容；不要讓 client 直接傳 provider URL、signed URL、base64 image 到 log-heavy 路徑。這也能避免在 Cloud Functions request logging 中殘留敏感圖片引用。由於 Cloud Functions 記錄會自動匯入 Cloud Logging，而預設 log bucket 會保留約 **30 天**，敏感資料本身就不該進 log。citeturn8search3turn11search0

### 建議 Security Rules

**Firestore**

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return signedIn() && request.auth.uid == uid;
    }

    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid);

      allow update: if isOwner(uid)
        && request.resource.data.uid == uid
        && request.resource.data.consent.aiAnalysis.accepted is bool
        && request.resource.data.consent.training.accepted is bool;

      allow delete: if false; // 由後端協調刪除
    }

    match /users/{uid}/photos/{photoId} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid)
        && request.resource.data.ownerUid == uid;
      allow update: if isOwner(uid)
        && resource.data.ownerUid == uid
        && request.resource.data.ownerUid == uid;
      allow delete: if isOwner(uid);
    }

    match /deletionRequests/{requestId} {
      allow create: if signedIn()
        && request.resource.data.uid == request.auth.uid
        && request.resource.data.status == "queued";
      allow read: if signedIn() && resource.data.uid == request.auth.uid;
      allow update, delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Storage**

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isOwner(uid) {
      return request.auth != null && request.auth.uid == uid;
    }

    match /users/{uid}/photos/{photoId}/{fileName} {
      allow read: if isOwner(uid);
      allow write: if isOwner(uid)
        && request.resource.size < 20 * 1024 * 1024
        && request.resource.contentType.matches('image/.*');
      allow delete: if isOwner(uid);
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

Firebase 官方反覆強調：生產環境應從 **deny all / locked mode** 起步，並把 Security Rules 當作 schema 一部分持續測；另外也要記住 **server 端 Admin SDK 會繞過 Firestore Security Rules**，所以 Cloud Functions 仍要在程式碼內檢查 auth、ownership 與 quota。citeturn10view0turn36search10turn36search7

### Auth、App Check、API key、Rate Limit、Logging

- **Auth**：保留 email/password、Google login、Apple login。這和你的既有架構一致，而且因為你用了 Google login，保留 **Sign in with Apple** 是對 App Review 有利的。Firebase 也建議對 email/password 設密碼政策與防 enumeration / brute-force；安全清單也建議把 `identitytoolkit.googleapis.com` 配額收緊。citeturn4view0turn8search2turn10view0  
- **App Check**：對 Firestore、Storage、Functions 都開啟 enforcement。Firebase 說 App Check 與 Auth 是互補關係；啟用 enforcement 後，不帶有效 App Check 的請求會被拒絕。citeturn7search1turn8search0  
- **API key 保護**：Gemini / OpenAI key 只能放在 server-side。用 **Secret Manager** 或 Cloud Functions 參數/secret 綁定，不要放在 iOS client，也不要只靠 `.env`。Firebase 官方已明說 `.env` 不是 secure place for secrets，而 `functions.config()` 也已棄用並將在 2027 年後阻止新部署。citeturn9view0turn11search2  
- **Rate limit**：  
  - client 端：App Check  
  - app 層：每 uid 每日分析額度交易鎖定  
  - function 層：限制 max instances / concurrency，避免濫用與爆帳單  
  - 專案層：預算告警與 usage alert  
  Firebase security checklist 都有直接支持這些作法。citeturn10view0  
- **Logging**：不要記錄完整圖片 URL、signed URL、base64、raw prompt、raw model response、未遮罩 email。只記：`uidHash`、`photoId`、`provider`、`latencyMs`、`status`、`errorCode`。因為 Cloud Logging 預設會保存一段時間，log 本身就會成為個資儲存面。citeturn8search3turn11search0

### 資料刪除流程

**刪除單張照片**  
流程應是：  
1. client 發 `requestPhotoDeletion(photoId)`  
2. server 建立 `deletionRequests/{id}`，把 `PhotoDoc.status` 改成 `pendingDelete`  
3. `cleanupUserData` 刪除 Storage 原圖、預覽圖、衍生圖  
4. 刪除或 hard-delete `users/{uid}/photos/{photoId}` 文件  
5. 若分析曾用到 Gemini Files API，執行 `files.delete`; 若是一般 paid generateContent 圖片輸入，則只能遵守供應商 retention window，不能向使用者承諾即時 provider-side purge  
6. function 回寫完成狀態  
Google 官方明說 Gemini Files API 檔案會在 **48 小時**後自動刪除，也可手動刪；OpenAI files 也有獨立 delete endpoint。citeturn34view1turn33search0

**刪除所有照片**  
不要在 client 直接 loop delete。較穩妥的是：  
- `requestAccountDeletion` 前，先走一次 `Delete All Photos` 或統一由 `cleanupUserData` 處理  
- 使用 server-side 分批/批次刪除  
- 保留一個不含敏感路徑的 audit summary，例如刪掉多少 object、多少 doc  

**刪除帳號**  
必須在 App 內發起，而且不是只停用帳號。建議步驟：  
1. 顯示刪除後果與 Apple 訂閱提醒  
2. 要求 recent reauth  
3. 建立 `deletionRequests`  
4. 鎖定新上傳與新分析  
5. 刪除 Firestore、Storage、歷史、usage、consent 狀態與本地快取  
6. 刪 Firebase Auth user  
7. 若使用 Sign in with Apple，執行 token revoke  
8. 顯示 done 狀態  
Apple 明確要求流程簡單透明，且若有訂閱，需告知如何管理訂閱；對 Sign in with Apple，官方也要求用其 REST API 處理 revoke。citeturn38view0

**是否需要向 AI provider 發 deletion request**  
- **Gemini paid analysis**：通常沒有「每次分析請求都可讓你事後按 request 刪除濫用監控 log」的通用流程；你能控制的是**不用 Unpaid Services**、避免不必要功能、若用了 Files API 就立即刪檔。citeturn17view1turn34view1  
- **OpenAI API future**：若用了 Files / stateful objects，要呼叫 delete endpoint；一般 API abuse-monitoring retention 仍依官方 policy。合資格情況下可洽談 ZDR。citeturn14view0turn33search0turn33search2  

**是否使用 Firebase 官方 Delete User Data extension**  
可以參考，但**不要只靠它**。Firebase 官方文件已明寫，這個 extension 只會刪 Firestore / RTDB / Storage，且**不保證**你自動符合所有法規；若你還有第三方 AI、訂閱、客服系統或其他地方存資料，就要自己 orchestrate。對你而言，最合理的是：保留你自己的 `requestAccountDeletion` / `cleanupUserData` 主流程，必要時把 extension 當作 Firebase-only cleanup 的輔助。citeturn35view1turn35view0

### 九十日刪除策略

這個策略本身不是法律明文指定的「90 天」，但它很符合 **GDPR 的 storage limitation** 與 **PDPO DPP2/section 26** 的精神：資料不應保存超過目的所需時間。對你的產品來說，這是一個合理且可跟免費方案綁定的 retention 規則。citeturn21search0turn30search0turn30search4

建議落法：

- **適用對象**：`planTier == free` 且 `lastActiveAt` 超過 90 天的帳戶  
- **刪除範圍**：只刪 **雲端照片、縮圖、分析歷史、photo metadata**；不要默默刪 Firebase Auth 帳號本身  
- **付費用戶**：有效訂閱、grace period、billing retry 期間一律不納入  
- **提醒機制**：在第 75 天與第 85 天發送 email 或 in-app banner；若之後要加 FCM，再補 push  
- **執行方式**：每日排程 `cleanupInactiveFreeUsers`，把符合條件者批次寫入 `deletionRequests`  
- **重新活躍**：使用者一旦登入、上傳、分析或升級，重置 `lastActiveAt`，取消待刪  
- **邊界情況**：  
  - 正在刪帳的帳戶，跳過 90 日清理  
  - 法定保存、退款爭議、反詐/濫用調查可保留必要最小資料  
  - 本機相簿原圖不歸這個政策；只處理雲端副本  
- **文案要求**：一定要提前寫進 Privacy Policy、雲端保存說明與訂閱頁 FAQ  

## Codex 任務清單與驗收標準

| 任務 | 建議檔案 | 驗收標準 |
|---|---|---|
| 實作 AI consent gate | `ConsentView.swift` | 未同意前，`analyzePhoto` UI 無法送出；同意後才可分析；文案能打開 Privacy/Terms。 |
| 實作私隱設定頁 | `PrivacySettingsView.swift` | 可看到 AI analysis consent 狀態、刪除所有資料入口、政策連結；撤回 consent 後立即停用未來分析。 |
| 實作帳戶刪除頁 | `AccountDeletionView.swift` | 可在 App 內找到；有 reauth；有訂閱提醒；確認後建立 deletion request；完成後登出。 |
| 建立 consent 狀態管理 | `ConsentService.swift` | `aiAnalysis`、`training`、`adultConfirmed`、`policyVersion` 能正確讀寫；`training` 預設 false。 |
| 建立資料刪除服務 | `DataDeletionService.swift` | 支援單張刪除、清空照片、刪帳；所有刪除都走同一套 request/cleanup pipeline。 |
| 建立後端刪帳入口 | `functions/src/privacy/requestAccountDeletion.ts` | 需要 Firebase Auth + App Check；會建立 `deletionRequests`；無法被其他 uid 偽造。 |
| 建立後端清理器 | `functions/src/privacy/cleanupUserData.ts` | 能刪 Firestore + Storage；處理部分失敗重試；寫回狀態；不記錄敏感 payload 到 logs。 |
| 建立 AI 分析守門 | `functions/src/ai/analyzePhoto.ts` | 會檢查 consent、quota、ownership、App Check；只接受 `photoId`，不接受 raw provider URL。 |
| 實作 Firestore/Storage 規則 | `firestore.rules`, `storage.rules` | 非 owner 不可讀寫；root deny all；deletionRequests 只能 create/read own docs；測試通過。 |
| 加入 secret 管理 | `functions/src/index.ts` 與 deploy config | Gemini/OpenAI key 不存在 client、Info.plist、repo 明文；只從 Secret Manager/secret params 取用。 |
| 建立 90 日清理排程 | `functions/src/schedules/cleanupInactiveFreeUsers.ts` | 只清 free + inactive 90d 用戶雲端照片與歷史；premium 不受影響；可取消待刪。 |
| 完成警告文字本地化 | `WarningText.strings` | 中英文文案都可顯示；AI 分析、刪除、帳戶刪除與改圖預留流程有一致 wording。 |

**測試 checklist**

- 未同意 `aiAnalysis consent` 時，不能執行 AI 分析。  
- 同意 AI 分析、但 `trainingConsent == false` 時，分析仍可正常運作。  
- 撤回 AI consent 後，未來分析請求被阻止；既有歷史不會被偷偷重建。  
- 刪除單張照片後，Storage 實體檔案不存在，Firestore 對應 photo doc 與衍生 metadata 已清除或完成 hard-delete。  
- 刪除帳號後，`users/{uid}`、`users/{uid}/photos/*`、Storage user scope、usage/consent/deletion 狀態都被清除；Auth user 被刪除。  
- 若帳戶綁定 Sign in with Apple，刪帳流程有正確處理 revoke。  
- 若用到 Gemini Files API，分析完成後會在 finally block 執行 file delete。  
- `deletionRequests` 只允許本人建立與讀取，client 不能修改 status 為 done。  
- `cleanupInactiveFreeUsers` 只清 free + inactive 90d，premium、grace period、recently active 用戶不被誤刪。  
- PhotosPicker / PHPicker 權限拒絕時，App 會有明確 fallback，不崩潰。  
- App Check enforcement 開啟後，沒有有效 token 的請求被拒絕。  
- Gemini / OpenAI key 不存在於 client bundle、`Info.plist`、`xcconfig`、前端 log、Crash 報告。  
- Cloud Functions / Cloud Logging 中看不到完整圖片 URL、signed URL、base64 圖片或 raw prompt。  
- App 內任何地方都找得到 Privacy Policy / Terms placeholder。  
- 刪帳頁有明確說明：刪帳**不會自動取消 Apple 訂閱**。  

**最重要的 acceptance criteria**

- **MVP 上線時，不預設把任何用戶照片用作模型訓練。**  
- **`trainingConsent` 預設為 `false`，而且不與 AI 分析功能綁定。**  
- **第一次 AI 分析前必須出現 consent gate。**  
- **使用者可以刪除單張照片，也可以刪除帳戶與所有資料。**  
- **Gemini / OpenAI API key 僅存在 server-side secret。**  
- **log 不記錄完整圖片 URL、base64 圖片或敏感 prompt。**  
- **若 MVP 繼續使用 Gemini Developer API，AI 功能需採成人向 gating，並把 minors / public consumer interpretation 視為正式發版前必確認的高風險項。** citeturn17view0turn4view0turn38view0turn9view0turn11search0
