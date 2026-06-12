# Encrypted App-to-App High Quality / Lossless Photo Transfer for iOS Retro Camera App 深入研究報告

## 1. Executive Summary

這個功能應定位為 **付費 sender 的高質、私密、app-to-app 照片傳送功能**，而不是一般公開分享、雲端相簿、社交 feed 或 AirDrop 替代品的完整複製。Receiver 可以免費接收，但需要使用你的 app 打開，從而形成 app-to-app network effect。

最重要的產品與技術結論：

* **第一版不應直接承諾 true lossless。** 如果現階段 export pipeline、render path、color space、bit depth、format、compression strategy 未完全定義，MVP 應使用「高質加密傳送」而不是「無損傳送」。JPEG 1 的核心常見路線是 DCT-based lossy image format；PNG 則是 W3C 定義的 lossless、portable、compressed raster format，但 PNG 大檔案與 photographic image 的效率要另行評估。([JPEG][1])
* **最安全架構是 client-side encryption before upload。** Sender 裝置先 render final image，再用每次 transfer 的隨機 file key 做 authenticated encryption，然後才上傳 ciphertext；backend / storage 不應看到 plaintext photo，也不應保存 decrypt key。
* **Crypto 不應自創。** 應使用 CryptoKit / platform crypto，並採用 authenticated encryption，例如 AES-GCM / ChaChaPoly 類型；NIST SP 800-38D 定義 GCM 為 authenticated encryption with associated data，OWASP 也建議可用 authenticated modes，如 GCM / CCM，以同時提供 confidentiality、integrity、authenticity。([NIST 電腦安全資源中心][2])
* **MVP 推薦 link-based receiver access。** Transfer link 可以包含 `transferId`，decrypt key 放 URL fragment；RFC 3986 指出 fragment 會在 dereference 前與 URI 其他部分分離，並由 user agent 處理，因此正常 HTTP request 不會把 fragment 送到 server。([RFC Editor][3]) 但產品必須清楚說明：**任何持有完整 link 的人都可能解密與打開這張相**。
* **Backend 仍然必要。** 它不看明文，但要管理 entitlement、quota、expiry、revoke、signed upload/download URL、metadata、abuse report、cleanup job。Signed URL 本質是限時授權；Google Cloud Storage 文件說明，任何持有 signed URL 的人可在有效期內執行指定操作，AWS S3 presigned URL 亦是 time-limited access。([Google Cloud][4])
* **不能在未有 StoreKit / entitlement / backend / privacy policy 前實作真 transfer。** Apple App Review Guidelines 要求 app 內解鎖 digital features / functionality 通常必須使用 In-App Purchase；StoreKit 2 亦提供 entitlement 與交易狀態檢查能力。([Apple Developer][5])
* **需要 privacy / legal / abuse policy。** Apple App Privacy Details 把 photos/videos 歸類為 User Content；如果 app 有上傳 photos/videos 的功能，需要在 App Store Connect privacy details 反映資料實務。([Apple Developer][6]) 同時，App Review Guidelines 對 user-generated content 要求有舉報、過濾、封鎖等 abuse control；client-side encryption 會令內容審核更困難，這是必須在產品政策層面先決定的 tradeoff。([Apple Developer][5])

最安全 implementation path：

```text
T1 Research / Product Policy
→ T2 Local High-quality Export Renderer
→ T3 Transfer UX Mock
→ T4 Local-only Encryption Prototype
→ T5 Backend Boundary Design
→ T6 StoreKit / Entitlement Prototype
→ T7 Encrypted Transfer Backend Beta
→ T8 Advanced Controls
```

---

## 2. Product Goal

### 2.1 正確產品定位

這個功能應叫：

```text
高質加密傳送
私密高質傳送
App-to-App 高質傳送
高質相片交收
```

不建議 MVP 一開始叫：

```text
無損傳送
端對端加密相簿
絕對安全傳相
永久防外流
```

產品目標：

* 付費 sender 可以把 **filtered final photo / high-quality render / future generated filter result / future edited photo** 傳給指定 receiver。
* Receiver 不需要付費，但要使用 app 接收。
* 傳送是 **private / permissioned / revocable where possible**，不是公開分享。
* 傳送必須由用戶明確觸發，不自動上傳、不背景上傳、不掃描整個相簿。
* Backend / storage 只保存 encrypted object 和最少 metadata。
* 功能應比 AirDrop 更品牌化、更可控：可以有 transfer status、expiry、revoke、QR、receiver preview、app-specific style。

### 2.2 不應過度承諾

產品 copy 不應暗示：

```text
接收者無法截圖
接收者無法轉發
任何人都永遠無法外流
我們可以保證真正無損
backend 完全無風險
```

更準確的說法是：

```text
照片會先在你的裝置加密，再上傳作傳送。
伺服器只保存加密檔案。
持有完整連結和解密資料的人可以打開。
你可以設定過期時間，並在下載前撤回傳送。
```

---

## 3. High Quality vs Lossless Definition

### 3.1 High Quality

**High Quality** 應定義為：app 使用受控 render pipeline 產生高解析 final output，並用高品質格式輸出。MVP 最實際是：

```text
JPEG high-quality export
long edge / original edited resolution
quality setting e.g. 0.90–0.95
metadata stripped or user-selectable
color profile policy defined
```

優點：

* 檔案比 PNG / TIFF 小。
* 適合大多數照片分享。
* 上傳 / 下載速度可控。
* 對照片類內容更實用。

限制：

* JPEG 通常是 lossy；JPEG 1 的 core coding system 包含 DCT-based lossy image format。([JPEG][1])
* 如果原圖是 JPEG，套 filter 後再輸出 JPEG，就是重新 render + 重新壓縮。
* 「高質」不等於「無損」。
* 如果 app 的 filter pipeline 已對像素做 creative transform，final image 本身已不是原始相片。

### 3.2 Lossless-like

**Lossless-like** 可以考慮 PNG 或未來 TIFF / HEIF lossless / 其他格式，但必須嚴格定義：

```text
export format
bit depth
color space
alpha handling
Core Image render color space
source format
whether filter output is pixel-perfect preserved after render
metadata handling
```

PNG 的 W3C specification 明確描述 PNG 是 lossless、portable、compressed raster image format，並把 lossless 定義為可 bit-for-bit 重建原始資料。([W3C][7]) 但這只代表 PNG compression 對它接收到的 raster data 是 lossless；它不代表你的 app 從 camera source 到 filter render 到 export 的整個 pipeline 沒有任何 transformation。

### 3.3 Product wording 建議

MVP：

```text
高質加密傳送
高質照片傳送
原尺寸高質傳送（如真的維持原輸出尺寸）
```

後期若技術符合，才可使用：

```text
PNG 無損格式傳送
無損壓縮傳送
以 PNG / TIFF / HEIF lossless 輸出
```

但要附註：

```text
「無損」指最終渲染結果以無損格式保存，不代表還原未套濾鏡前的原始照片或 camera RAW。
```

### 3.4 建議 quality tiers

| Tier          | Product label        | Format      | Use case                | Notes   |
| ------------- | -------------------- | ----------- | ----------------------- | ------- |
| Standard      | 高質                   | JPEG q≈0.90 | 大部分分享                   | MVP 首選  |
| High          | 最高質 JPEG             | JPEG q≈0.95 | 需要細節                    | 檔案更大    |
| Lossless-like | PNG 無損格式             | PNG         | 插畫、低噪、需要無損 final render | 不等於 RAW |
| Future Pro    | TIFF / HEIF lossless | TBD         | 專業流程                    | 需另行研究   |

---

## 4. User Flow

### 4.1 Sender flow

```text
1. 用戶拍攝或匯入照片
2. 套用 filter / advisor / edit result
3. 點擊「傳送高質照片」
4. App 檢查 sender 是否付費
5. 如未付費，顯示付費說明，不 render、不加密、不上傳
6. 如已付費，顯示 privacy / transfer notice
7. 選擇 quality / format
8. 本機 render final image 到 temporary file
9. 本機產生 per-transfer file key
10. 本機加密 final image
11. 向 backend 建立 transfer metadata
12. 取得 signed upload URL 或 upload session
13. 上傳 encrypted file
14. backend 標記 upload complete
15. app 生成 transfer link / QR / code
16. sender 用 share sheet 分享給 receiver
17. sender 可查看 status / revoke / delete
```

### 4.2 Receiver flow

```text
1. receiver 打開 link / scan QR / enter code
2. 若未安裝 app，導向 App Store / landing page
3. 若已安裝 app，Universal Link / custom scheme 打開 app
4. app 解析 transferId + decrypt capability
5. app 向 backend 查 metadata
6. app 檢查 active / expired / revoked / app version
7. app 取得 signed download URL
8. app 下載 encrypted file
9. app 本機解密
10. app 驗證 AEAD tag / integrity
11. 顯示 photo preview
12. receiver 可保存到本機 / app session / future history
13. receiver 不需要付費
```

### 4.3 Link / QR / share sheet / code 方案比較

| 方案                  | 優點                                                 | 缺點                                                    | MVP 建議                |
| ------------------- | -------------------------------------------------- | ----------------------------------------------------- | --------------------- |
| Universal Link      | 未裝 app 可落 landing page / App Store；已裝 app 可直接開 app | 需要 Associated Domains / apple-app-site-association 設定 | 強烈建議                  |
| Custom URL scheme   | 實作相對簡單                                             | scheme 可能被其他 app 註冊攔截；未裝 app fallback 差               | 只作備援                  |
| QR code             | 面對面傳送方便；適合 party / event                           | 截圖外流風險；掃碼 UX 要做                                       | P1                    |
| Share sheet         | 使用者熟悉；可傳 WhatsApp / Messages / IG DM               | 完整 link 可能被平台 preview / log；receiver 可轉發              | MVP 必備                |
| Short code          | 口頭傳送方便                                             | 要 backend lookup；若 entropy 不足易被猜                      | 不建議作唯一方式              |
| Passphrase fallback | 私密性較高                                              | UX 麻煩；忘記就無法解密                                         | Advanced private mode |

Apple 有 Universal Links 與 Associated Domains 官方文件，也有 UIActivityViewController 作 iOS share sheet 入口；這些 docs 頁面目前在瀏覽器需 JavaScript，但仍是實作時應參考的 Apple 官方 API 文件。([Apple Developer][8])

---

## 5. Free vs Paid Entitlement Policy

### 5.1 Sender

Sender 必須付費才可建立 encrypted transfer。

Sender entitlement 需要：

```text
StoreKit entitlement check
backend entitlement validation
daily / monthly transfer quota
storage quota
file size limit
upload limit
fair-use policy
revoke / delete option
transfer history / management
```

Apple App Review Guidelines 3.1.1 指出，如果要在 app 內 unlock features or functionality，通常必須使用 In-App Purchase，不可用 license keys、QR codes 等自家機制解鎖。([Apple Developer][5]) StoreKit 2 提供 Swift / SwiftUI API、transaction history、entitlement / subscription status 等能力；交易亦由 App Store 以 JWS 格式簽署。([Apple Developer][9])

### 5.2 Receiver

Receiver policy：

```text
不需要付費
需要 app 才可接收
只可 access 指定 transfer
不可列出 sender storage
不可看到 sender 其他照片
可 anonymous receive in MVP
可 optional account-bound receive in future
```

MVP 不建議強迫 receiver 登入，因為會降低接收成功率；但如果產品定位偏高私隱，就要考慮 account-bound receive 或 separate key delivery。

### 5.3 Unknown / free sender

Free sender：

```text
可看到功能說明
可看到付費價值
不可 render transfer export
不可加密 upload
不可建立 transfer metadata
不可產生有效 transfer link
```

重要：不要「先上傳再要求付款」。付費 gate 應在 render / encryption / upload 之前。

---

## 6. Security Model

### 6.1 Threat model

| Threat                                  | 說明                                        |
| --------------------------------------- | ----------------------------------------- |
| attacker guesses transferId             | 隨機度不足時可暴力掃描                               |
| attacker intercepts link                | link holder 可能下載與解密                       |
| receiver forwards link                  | link-based 模式無法阻止                         |
| sender wants revoke                     | 需要 backend revoke / delete                |
| backend compromised                     | 若保存明文或 key，會洩漏照片                          |
| storage bucket misconfigured            | public bucket 會曝露 encrypted objects       |
| expired link replay                     | 過期後仍被重放                                   |
| malicious receiver downloads repeatedly | cost / abuse                              |
| file tampering                          | ciphertext 被改導致 decrypt crash 或錯誤         |
| corrupted ciphertext                    | 上傳中斷 / storage bit rot / partial download |
| quota abuse                             | 付費帳號被濫用作 storage                          |
| illegal content abuse                   | encrypted storage 難以 moderation           |
| lost decrypt key                        | receiver 永久無法打開                           |
| app reinstall                           | sender 失去本地 key / transfer management     |
| device lost                             | 本地 keychain / local state 風險              |
| sender shares wrong photo               | privacy incident                          |
| receiver screenshot / re-share          | 技術上不能完全阻止                                 |

### 6.2 Mitigation

```text
random high-entropy transferId
CSPRNG for transferId and file key
client-side encryption before upload
authenticated encryption / AEAD
integrity check through authentication tag
signed upload/download URLs with short expiry
server-side entitlement validation
server-side quota and rate limit
transfer expiry
revoke / delete
download count / rate limit
private storage bucket
no directory listing
metadata minimization
never log full URL with key
analytics strip fragment / key
abuse report endpoint
audit logs without raw photo
```

OWASP Session Management Cheat Sheet 建議 session ID 至少 64 bits entropy，若自建 session ID 建議使用 CSPRNG 並至少 128 bits；對 transferId 這種 bearer capability，建議直接使用 128–192 bits 以上 entropy，而不是短 code 或可猜 UUID variant。([OWASP Cheat Sheet Series][10]) OWASP Cryptographic Storage Cheat Sheet 亦指出安全關鍵 random strings / keys / IVs / tokens 應使用 CSPRNG，不可使用低品質 PRNG。([OWASP Cheat Sheet Series][11])

---

## 7. Encryption Architecture

### 7.1 基本要求

MVP encryption architecture：

```text
1. Sender renders final image locally
2. App generates random per-transfer file key
3. App encrypts file locally using AEAD
4. App uploads ciphertext only
5. Backend stores encrypted object + metadata only
6. Receiver obtains ciphertext
7. Receiver uses decrypt key from link / separate channel
8. Receiver decrypts locally
```

要求：

```text
client-side encryption before upload
backend should not see plaintext
authenticated encryption
random per-transfer file key
secure random nonce
integrity authentication
avoid rolling custom crypto
no hardcoded keys
no decrypt key in backend logs
consider Keychain for sender transfer management
consider key wrapping for account-based future
```

CryptoKit 的 AES.GCM、SymmetricKey 等是 Apple 官方 CryptoKit API；其頁面在瀏覽器中需 JavaScript，但實作時應使用 Apple 官方 documentation 與 Xcode symbol docs。([Apple Developer][12]) 加密原理上，NIST SP 800-38D 指定 GCM 為 authenticated encryption with associated data；OWASP 亦建議使用 authenticated modes，如 GCM / CCM，而不是自製 crypto。([NIST 電腦安全資源中心][2])

### 7.2 Option comparison

#### Option A — Link contains transferId + decrypt key

```text
https://app.example.com/t/{transferId}#key={decryptKey}
```

優點：

* UX 最簡單。
* Receiver 點 link 即可接收。
* Backend 不需知道 key。
* 適合 MVP。

缺點：

* 任何持有完整 link 的人都可解密。
* Receiver 轉發 link 就等於轉發 access。
* Link 截圖 / clipboard / chat backup 都可能洩漏。
* Revoke 只能阻止 future download；如果對方已下載 ciphertext + key，就無法阻止本地保留。

MVP 可用，但 copy 必須清楚：

```text
持有完整連結的人可以打開呢張相。請只傳給你信任的人。
```

#### Option B — transferId in link, decrypt key delivered separately

優點：

* Link 洩漏時不一定可解密。
* 適合 high privacy mode。
* 可以用 face-to-face passphrase / QR split key。

缺點：

* UX 複雜。
* Receiver 容易輸錯 / 遺失 key。
* support 成本增加。

適合作 advanced private mode。

#### Option C — receiver account public key encryption

做法：

```text
receiver 有 public key
sender 取得 receiver public key
sender 產生 file key
sender 用 receiver public key wrap file key
server 保存 wrappedKey
receiver 用 private key unwrap
```

優點：

* 更接近 account-bound E2EE。
* Receiver forward link 不一定能讓其他人解密。
* 可做更強 revoke / device binding。

缺點：

* 需要 receiver account / identity / public key directory。
* 需要 key rotation / multi-device recovery。
* 產品與安全設計複雜很多。

適合後期，不適合 MVP。

#### Option D — passphrase-based transfer

優點：

* 不需要 receiver account。
* Link 與 passphrase 分離。
* 適合私密分享。

缺點：

* UX 差。
* 弱 passphrase 會被 brute force。
* 需要 KDF / salt / iteration / memory-hard design。
* support 成本高。

只建議作 fallback / advanced mode。

### 7.3 MVP 推薦

MVP 推薦：

```text
Option A: Universal Link with transferId + decrypt key in URL fragment
+ expiry
+ revoke
+ short-lived signed download URL
+ no plaintext / no key on server
+ clear "anyone with link can access" copy
```

高私隱模式後期再加：

```text
Option B: separate key delivery
Option C: receiver public key encryption
```

---

## 8. Transfer Token / Link Design

### 8.1 Link format

建議 Universal Link：

```text
https://app.example.com/t/{transferId}#k={base64url(decryptKey)}&v=1
```

備援 custom scheme：

```text
appname://transfer/{transferId}#k={base64url(decryptKey)}&v=1
```

### 8.2 為什麼 key 放 URL fragment？

RFC 3986 指出 fragment identifier 不用於 URI scheme-specific processing，會在 dereference 前從 URI 其他部分分離，並由 user agent 處理。([RFC Editor][3]) 這表示正常 HTTP request 到 `https://app.example.com/t/{transferId}` 時，server 不會收到 `#k=...` 後面的 fragment。

好處：

```text
server access log 不應收到 decrypt key
landing page request 不需要 key
backend metadata lookup 只用 transferId
```

限制：

```text
完整 link 仍會出現在 sender / receiver clipboard、messages、screenshots、share targets
某些 app 可能自行處理 / preview link
Universal Link handling 要實機測試 fragment 是否完整交給 app
analytics SDK 不得記錄完整 URL
```

### 8.3 TransferId design

```text
transferId = "tr_" + base64url(random 128–192 bits)
```

不要用：

```text
incremental ID
short numeric code as only credential
senderUserId + timestamp
UUID v1
guessable slug
```

OWASP 建議 security-sensitive IDs / tokens 使用 CSPRNG，且自建 session ID 應至少 128 bits 並唯一；transferId 建議採用更高 entropy，因為它可能被當成 bearer access handle。([OWASP Cheat Sheet Series][10])

### 8.4 Token expiry / rotation / revoke

```text
metadata expiry: e.g. 7 days
signed download URL expiry: e.g. 5–15 minutes
upload URL expiry: short, e.g. 15 minutes
revoke: mark transfer revoked + delete object if possible
rotation: not possible for link key after shared, unless re-encrypt and issue new link
```

Cloud signed URLs 的 security model 是「持有 URL 者可在有效期內使用」；Google Cloud Storage 文件也明確指出 anyone in possession of signed URL can use it while active。([Google Cloud][4]) 所以 signed URL 不應長期保存或放在 analytics。

### 8.5 Analytics / logging rule

```text
never log full transfer URL
strip fragment before analytics
strip query secrets from logs
do not log decryptKey
do not log signed URL
do not include key in crash reports
do not include key in support screenshots by default
```

---

## 9. Backend / Storage Architecture

### 9.1 Backend components

```text
Auth / Entitlement Service
Transfer Service
Storage Service
Metadata Database
Signed Upload URL Service
Signed Download URL Service
Quota Service
Revocation / Delete Service
Expiry Cleanup Job
Abuse Report Endpoint
Audit Logging
```

### 9.2 Backend 保存什麼

可以保存：

```text
transferId
senderUserId
encryptedObjectPath
fileSizeBytes
contentType = application/octet-stream
originalFormat
exportFormat
exportQuality
createdAt
expiresAt
revokedAt
downloadCount
maxDownloadCount
status
encryptionVersion
algorithm identifier
nonce / salt if needed and not secret
keyId reference only if using key wrapping
ciphertext checksum / upload checksum
receiver access state, if any
```

不應保存：

```text
plaintext photo
decrypt key in plaintext
full transfer URL with key
raw camera frame
unnecessary EXIF
sender private photo metadata
raw AI response
sensitive inference
unredacted signed URL
```

OWASP Cryptographic Storage Cheat Sheet 建議最好的保護敏感資料方式是「不要保存它」，且應從 threat model 決定在哪一層加密。([OWASP Cheat Sheet Series][11]) 這支持「server 不保存 plaintext、不保存 decrypt key」的架構。

### 9.3 Storage policy

```text
private bucket
no public ACL
no directory listing
object names not guessable
signed URL only
short-lived upload/download URLs
server validates entitlement before issuing upload URL
server validates status before issuing download URL
lifecycle deletion after expiry
orphan object cleanup
region selection documented
storage access logs without plaintext/key
```

OWASP File Upload Cheat Sheet 建議 upload 實作要 allowlist extension / type、設定 file size limit、只允許授權用戶上傳、將檔案存放於不同 server 或 webroot 外、必要時用 handler 間接映射檔案。([OWASP Cheat Sheet Series][13]) 你的系統即使只上傳 encrypted file，也仍應套用這些防禦：限制大小、限制 MIME、授權 upload、不直接 public object。

### 9.4 Signed URL

Signed upload / download URL 是可行方案，但要注意：

* Signed URL 是 bearer capability。
* 任何持有者可在有效期內使用。
* 必須短效。
* 不應記錄。
* Backend 應先驗證 entitlement / quota / transfer status 才發 URL。([Google Cloud][4])

---

## 10. Receiver Access Model

### 10.1 Options

| Model                  | 優點                   | 缺點                                       | 建議     |
| ---------------------- | -------------------- | ---------------------------------------- | ------ |
| Anonymous receiver     | 最低 friction；link 即開  | anyone with link can access              | MVP 可用 |
| App-installed receiver | 促進 app adoption；體驗可控 | 未裝 app 多一步                               | MVP 核心 |
| Logged-in receiver     | 控制更強；可做 history      | onboarding friction                      | P2     |
| Contact-based receiver | 最安全；可綁身份             | 要 account / contact graph / key exchange | 後期     |

### 10.2 MVP 建議

```text
app-installed link-based receiver
receiver free
link possession grants access
expiry and revoke
no account requirement initially
no receiver listing sender storage
```

### 10.3 必須清楚說明的風險

```text
receiver can forward link
receiver can screenshot
receiver can save decrypted photo
sender cannot revoke already-downloaded copies
absolute prevention impossible
```

建議 copy：

```text
持有完整連結的人可以打開呢張相。請只傳給你信任的人。
撤回只會阻止之後下載，不能刪除對方已保存的副本。
```

---

## 11. UX Design

### 11.1 Sender UI

Sender UI sections：

```text
[傳送高質照片] CTA
Paid badge / entitlement gate
Transfer privacy notice
Quality / format selection
Render progress
Encrypting progress
Upload progress
Cancel
Generate link
Share sheet
Copy link
QR code
Transfer status
Revoke / delete
```

Suggested hierarchy：

```text
Result Screen
→ More / Share
→ 傳送高質照片 Pro
→ Notice
→ Quality
→ Create Transfer
→ Share Link / QR
```

### 11.2 Receiver UI

Receiver UI states：

```text
Open transfer
Checking transfer
Downloading
Decrypting
Preview
Save / keep in app / export later
Expired
Revoked
Failed
Old app version
```

Receiver should not see:

```text
sender storage
sender other transfers
sender private metadata
plaintext before decrypt
```

### 11.3 Copy examples

Sender notice：

```text
這張相會先在你的裝置加密，再上傳作傳送。
伺服器只會保存加密檔案，不會看到明文照片。
```

Link safety：

```text
只有持有完整連結和解密資料的人可以打開。
請只傳給你信任的人。
```

Receiver free：

```text
接收者不需要付費，但需要使用本 app 打開。
```

Expiry：

```text
連結過期後將無法再下載。
```

Revoke：

```text
撤回後，對方將不能再下載。已保存的副本無法收回。
```

Avoid：

```text
絕對安全
永久無法外流
真正無損
完全防截圖
我們也永遠無法被攻破
```

### 11.4 香港口語 copy

```text
呢張相會先喺你部機加密，再上傳用嚟傳送。
攞住完整連結嘅人先開到，記得淨係傳俾信得過嘅人。
接收嗰邊唔使畀錢，但要用返呢個 app 開。
過咗期就下載唔到。
你可以撤回傳送，但對方已經 save 咗嘅副本收唔返。
```

---

## 12. Privacy / Legal / App Store Considerations

### 12.1 Consent and explicit action

Transfer 必須是 explicit user action：

```text
user taps transfer
user sees upload/encryption notice
user chooses quality
user confirms upload
```

不可做：

```text
background upload
auto upload after capture
auto sync all exports
hidden cloud save
silent analytics of photos
```

Apple App Review Guidelines 要求所有 app 都要有 privacy policy，說明收集什麼資料、如何使用、第三方保護、retention/deletion，以及用戶如何撤回 consent / request deletion。([Apple Developer][5])

### 12.2 App Privacy labels

由於這個功能會讓用戶上傳 photos/videos 類型內容，即使是 encrypted object，也需要仔細填寫 App Privacy Details。Apple App Privacy Details 把 Photos or Videos 列在 User Content，並指出如果 app 功能允許用戶上傳特定 media type，例如 photos/videos，就要披露該 specific data type。([Apple Developer][6])

關鍵 nuance：

* 如果資料只在裝置上處理，不送 server，Apple 表示不算 collected。
* 如果資料送出裝置並以 readable form 保存超過服務 request 所需時間，才符合 Apple 對 collect 的定義。
* 但 encrypted storage 是否「readable form」與 App Store privacy disclosure 實務需要法律 / App Store Connect 解讀，不應自行假設完全不需披露。Apple 同頁明確要求即使非 analytics / ads 用途，收集資料也要申報。([Apple Developer][6])

### 12.3 User-generated content / illegal content

Encrypted app-to-app photo transfer 會接近 user-generated content / file hosting。Apple 對 apps with user-generated content 要求過濾 objectionable material、report offensive content、block abusive users、published contact information。([Apple Developer][5])

但 client-side encryption 會造成 moderation tradeoff：

```text
backend cannot see plaintext
therefore backend cannot easily scan for illegal / abusive content
privacy stronger
abuse prevention harder
```

MVP mitigation：

```text
small paid sender quota
receiver must use app
report transfer endpoint
sender account required for upload
no public discovery
short expiry
file size quota
rapid revoke/delete
terms of service
lawful request process
```

### 12.4 不要 claim end-to-end encryption unless true

可以說：

```text
裝置端加密
伺服器只保存加密檔案
```

只有在以下條件滿足後才可 claim E2EE：

```text
server never receives plaintext
server never receives decrypt key
key delivery cannot be intercepted by server
analytics/logging strips keys
receiver decrypts locally
account recovery / multi-device design does not give server decrypt capability
security review completed
```

Link-based fragment key 是「client-side encrypted link-sharing」，但不等於強 account-bound E2EE，因為任何持有完整 link 的人都能解密。

---

## 13. Abuse / Quota / Cost Control

### 13.1 Quota placeholders

以下只是產品決策 placeholder：

| Quota                  |                         MVP placeholder |
| ---------------------- | --------------------------------------: |
| Max file size          |                 25–50 MB encrypted file |
| Transfer expiry        |                                  7 days |
| Sender daily count     |                     10–30 transfers/day |
| Sender monthly storage |                                  1–5 GB |
| Download count         | unlimited until expiry, or 20 downloads |
| Upload URL expiry      |                              15 minutes |
| Download URL expiry    |                            5–15 minutes |
| Revoked cleanup        |   immediate object deletion best effort |
| Expired cleanup        |                       daily cleanup job |

### 13.2 Controls

```text
paid entitlement check
per-user quota
per-IP / device rate limit
file size limit
transfer expiry
download count / rate limit
backend kill switch
storage lifecycle cleanup
failed upload cleanup
orphan object cleanup
abuse report endpoint
sender suspension
```

### 13.3 Fair-use copy

```text
高質傳送包含合理使用限制，以保障服務穩定。
```

---

## 14. Failure States and Recovery

| State                             | UX copy                          | Recovery                      |
| --------------------------------- | -------------------------------- | ----------------------------- |
| sender not paid                   | `高質加密傳送是 Pro 功能。`                | show StoreKit purchase sheet  |
| entitlement check failed          | `暫時未能確認 Pro 狀態。`                 | retry / restore purchases     |
| render failed                     | `相片輸出失敗，請再試一次。`                  | retry render / lower quality  |
| encryption failed                 | `加密失敗，未有上傳任何照片。`                 | retry / report                |
| upload failed                     | `上傳中斷，已保留本機檔案。`                  | retry upload                  |
| network offline                   | `網絡未連線，稍後再傳送。`                   | queue? not MVP / manual retry |
| transfer created but share failed | `連結已建立，可以稍後分享。`                  | show share again / copy link  |
| link expired                      | `呢個傳送連結已過期。`                     | ask sender to send again      |
| transfer revoked                  | `傳送者已撤回呢張相。`                     | no access                     |
| object deleted                    | `加密檔案已被刪除。`                      | no access / request resend    |
| key missing                       | `缺少解密資料，無法打開。`                   | ask sender for full link      |
| decrypt failed                    | `解密失敗，連結可能不完整或檔案已損壞。`            | retry / request new link      |
| corrupted file                    | `檔案不完整，請重新下載。`                   | retry download                |
| app not installed                 | Landing page: `用本 app 打開高質相片傳送。` | App Store link                |
| receiver offline                  | `網絡未連線，稍後再下載。`                   | retry                         |
| old app version                   | `請更新 app 以接收這張相。`                | App Store update              |
| quota exceeded                    | `今日傳送額度已用完。`                     | wait / upgrade tier           |
| backend unavailable               | `傳送服務暫時未能連線。`                    | retry later                   |
| sender shared wrong photo         | `你可以撤回未下載的傳送。`                   | revoke/delete                 |

---

## 15. Technical Architecture Proposal

### 15.1 iOS components

```text
TransferEntitlementService
HighQualityPhotoRenderer
LocalPhotoEncryptionService
EncryptedTransferService
TransferUploadService
TransferDownloadService
TransferLinkBuilder
TransferReceiverRouter
TransferQuotaService
TransferMetadataStore
TransferRevocationService
TransferCleanupJob
```

UI components：

```text
PhotoTransferViewModel
PhotoTransferSenderView
PhotoTransferReceiverView
TransferProgressView
TransferExpiredView
TransferSecurityNoticeView
TransferQualityPickerView
TransferQRCodeView
TransferManagementView
```

### 15.2 Backend endpoints planning

```text
POST   /v1/transfers
POST   /v1/transfers/{id}/upload-url
POST   /v1/transfers/{id}/complete
GET    /v1/transfers/{id}
POST   /v1/transfers/{id}/download-url
POST   /v1/transfers/{id}/revoke
DELETE /v1/transfers/{id}
POST   /v1/transfers/{id}/report
```

Endpoint notes：

```text
endpoint 只是 planning
no implementation yet
iOS must not directly expose storage credentials
iOS must not store secrets in code
backend must validate entitlement
backend must never receive decrypt key
backend must never log full transfer URL
```

### 15.3 High-level flow

```text
Sender iOS
  → entitlement check
  → local render
  → local encrypt
  → create transfer metadata
  → get signed upload URL
  → upload encrypted file
  → complete transfer
  → build link with fragment key
  → share

Receiver iOS
  → open Universal Link
  → parse transferId + fragment key
  → get metadata
  → get signed download URL
  → download ciphertext
  → decrypt locally
  → preview / save
```

### 15.4 Suggested Swift protocols

```swift
protocol HighQualityPhotoRenderer {
    func render(_ input: PhotoRenderInput) async throws -> RenderedPhotoFile
}

protocol LocalPhotoEncryptionService {
    func encrypt(fileURL: URL, metadata: TransferAAD) async throws -> EncryptedPhotoPackage
    func decrypt(packageURL: URL, key: Data, metadata: TransferAAD) async throws -> URL
}

protocol EncryptedTransferService {
    func createTransfer(_ request: CreateTransferRequest) async throws -> TransferMetadata
    func uploadEncryptedFile(_ file: EncryptedPhotoPackage, to uploadURL: URL) async throws
    func fetchTransfer(_ transferId: String) async throws -> TransferMetadata
    func downloadEncryptedFile(_ transferId: String) async throws -> URL
}
```

---

## 16. Data Model Proposal

### 16.1 Transfer metadata

```json
{
  "transferId": "tr_7Q8p9R...highEntropy",
  "senderUserId": "user_123",
  "encryptedObjectPath": "transfers/tr_7Q8p9R/photo.enc",
  "fileSizeBytes": 12345678,
  "contentType": "application/octet-stream",
  "originalFormat": "jpeg",
  "exportFormat": "jpeg",
  "exportQuality": "high",
  "encryption": {
    "version": "v1",
    "algorithm": "AES-GCM",
    "keyStoredOnServer": false,
    "nonceStoredWithCiphertext": true,
    "aadVersion": "v1"
  },
  "createdAt": "2026-06-12T00:00:00Z",
  "expiresAt": "2026-06-19T00:00:00Z",
  "revokedAt": null,
  "downloadCount": 0,
  "maxDownloadCount": 20,
  "status": "active"
}
```

### 16.2 Status enum

```text
creating
awaiting_upload
uploaded
active
expired
revoked
deleted
failed
reported
blocked
```

### 16.3 What not to store

```text
decryptKey
plaintext photo
full link
URL fragment
signed URL
EXIF GPS
raw image preview
receiver decrypted file
AI result
face / identity / sensitive inference
```

### 16.4 Sender local state

```json
{
  "transferId": "tr_...",
  "createdAt": "...",
  "expiresAt": "...",
  "status": "active",
  "localKeychainReference": "optional",
  "sharedVia": "share_sheet",
  "lastKnownDownloadCount": 1
}
```

If the sender stores the key locally for management / re-share, use Keychain rather than app config files; Apple Keychain Services is the platform API for keychain-related secure storage, though implementation details require Xcode docs because the web page is JavaScript-rendered.([Apple Developer][14])

### 16.5 Receiver local state

```json
{
  "transferId": "tr_...",
  "receivedAt": "...",
  "status": "decrypted",
  "savedToPhotos": false,
  "keptInApp": true,
  "source": "universal_link"
}
```

---

## 17. MVP / Future Phase Plan

### T1 — Research / Product Policy

```text
current phase
no implementation
define product copy
define high-quality vs lossless wording
define privacy policy direction
define abuse policy
```

### T2 — Local High-quality Export Renderer

```text
local only
no upload
no StoreKit
no cloud
render final image to temp file
share sheet / Files export
define JPEG quality
define PNG option if feasible
test color / quality
```

### T3 — Transfer UX Mock

```text
no upload
mock entitlement
mock encryption
mock transfer link
sender / receiver UI prototype
mock expired / revoked / failed states
```

### T4 — Encryption Prototype Local-only

```text
CryptoKit proof of concept
encrypt / decrypt local file
test AES-GCM / ChaChaPoly
test large file memory usage
test corrupt ciphertext failure
no backend
no upload
```

### T5 — Backend Boundary Design

```text
API contract
storage contract
quota
entitlement validation
deletion
privacy policy
audit logging
no plaintext
```

### T6 — Paid Entitlement / StoreKit Prototype

```text
paid sender only
StoreKit 2
restore purchases
backend entitlement validation
no upload yet
```

### T7 — Encrypted Transfer Backend Prototype

```text
explicit user action
encrypted upload
receiver download
expiry / revoke
limited beta
small quota
private bucket
report endpoint
```

### T8 — Advanced Controls

```text
QR code
separate key delivery
receiver account binding
transfer history
abuse report
download count limits
high privacy mode
```

---

## 18. Risk Table

| Risk                                    | Impact                             | Mitigation                                                   |
| --------------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| false “lossless” marketing              | 用戶投訴 / App Review 風險               | MVP 用「高質」；lossless 需格式與 pipeline 定義                          |
| link leakage                            | 未授權者可打開                            | clear warning；expiry；revoke；separate key mode later          |
| key leakage                             | ciphertext 可解密                     | key in fragment; no server logging; strip analytics          |
| transferId guessing                     | 大量掃描 metadata                      | 128–192 bit random transferId; rate limit                    |
| backend compromise                      | metadata / encrypted files exposed | no plaintext; no key; private bucket                         |
| storage bucket misconfiguration         | public object exposure             | private ACL; signed URL; no listing                          |
| receiver forwarding link                | access spreads                     | state limitation in copy; account-bound future               |
| inability to moderate encrypted content | illegal content risk               | small paid quota; report endpoint; terms; abuse controls     |
| illegal content abuse                   | App Store / legal risk             | UGC policy; report; block sender; limited beta               |
| high storage cost                       | cost spike                         | quotas; expiry; lifecycle cleanup                            |
| large file upload failure               | bad UX                             | resumable upload later; file size limits; retry              |
| entitlement bypass                      | unpaid upload                      | backend entitlement validation before upload URL             |
| StoreKit complexity                     | implementation risk                | T6 separate phase                                            |
| App Store privacy concern               | rejection / metadata issue         | privacy labels; clear policy; no hidden upload               |
| user trust                              | adoption risk                      | transparent copy; no overclaims                              |
| expired link confusion                  | support burden                     | clear expired UI; resend request                             |
| lost decrypt key                        | impossible recovery                | warn user; re-share before expiry; sender local key optional |
| device compatibility                    | receiver cannot open               | minimum app version; landing page                            |
| color / quality mismatch                | pro user dissatisfaction           | export tests; color space policy                             |
| memory pressure during render           | crash                              | stream / temp file; avoid loading huge bitmap twice          |
| slow upload / download                  | bad UX                             | progress; cancel; quality options                            |
| deletion / revoke not understood        | false expectations                 | copy: revoke cannot delete already saved copies              |

---

## 19. Final Recommendation

### 19.1 Clear recommendations

* **不要直接實作 encrypted transfer。** 這個功能涉及 StoreKit、entitlement、backend、storage、client-side encryption、privacy policy、abuse control，不適合跳過 planning。
* **先做 local high-quality export renderer。** 在沒有穩定 export pipeline 前，不應談「無損傳送」。
* **不要過早使用「無損」文案。** MVP 應叫「高質加密傳送」。
* **產品核心應是 paid sender / free receiver。** Sender 付費建立 transfer；receiver 免費接收，但需要 app。
* **MVP transfer 應使用 client-side encryption before upload。** Backend / storage 不應看到 plaintext photo。
* **Link-based receiver 最適合初版。** 但必須明確說明 anyone with full link can access。
* **Backend 不應保存 plaintext 或 decrypt key。** 只保存 encrypted object + metadata。
* **需要 expiry / revoke / quota / deletion。** 沒有這些就不應 beta。
* **StoreKit / entitlement / backend / storage / privacy policy 要在實作前完成。**
* **如果要 claim end-to-end encryption，需要更嚴格設計和安全審查。** Link-based fragment key 可以是 client-side encrypted transfer，但不應輕易標成完整 E2EE。

### 19.2 Safest implementation path

```text
1. Research / product policy
2. Local high-quality export
3. Transfer UX mock
4. Local encryption prototype
5. Backend boundary
6. StoreKit entitlement
7. Encrypted transfer beta
8. Advanced security controls
```

### 19.3 下一個 Codex planning prompt

```text
Create T2 — Local High-quality Export Renderer planning and implementation.

Scope:
- No encrypted transfer backend.
- No StoreKit.
- No upload.
- No cloud storage.
- No universal link.
- No receiver flow.
- No "lossless" marketing.

Implement:
- HighQualityPhotoRenderer
- Render final filtered image to temporary file
- JPEG high-quality export option
- Optional PNG export investigation behind disabled flag
- Local share sheet / Files export only
- Clear product wording: "高質輸出", not "無損"
- Metadata stripping option planning
- Memory pressure safeguards
- Export failure states
- Tests for render success/failure and file size
```

---

## 20. Sources / Links

1. Apple App Review Guidelines — privacy policy, consent, data deletion, data sharing, user-generated content, in-app purchase requirements. ([Apple Developer][5])
2. Apple App Privacy Details — Photos/Videos as User Content; collect definition; on-device-only data; disclosure rules. ([Apple Developer][6])
3. Apple StoreKit 2 — in-app purchases, entitlement / transaction status, signed transactions. ([Apple Developer][9])
4. Apple CryptoKit / AES.GCM / SymmetricKey docs — official API references, JavaScript-rendered pages. ([Apple Developer][15])
5. Apple Keychain Services / SecRandomCopyBytes docs — official API references, JavaScript-rendered pages. ([Apple Developer][14])
6. Apple Universal Links / Associated Domains / UIActivityViewController — official API references, JavaScript-rendered pages. ([Apple Developer][8])
7. NIST SP 800-38D — GCM / GMAC authenticated encryption with associated data. ([NIST 電腦安全資源中心][2])
8. OWASP Cryptographic Storage Cheat Sheet — threat model, minimize storage, AES, authenticated modes, CSPRNG, key management, secure key storage. ([OWASP Cheat Sheet Series][11])
9. OWASP Session Management Cheat Sheet — CSPRNG, entropy, 128-bit recommendation for custom session IDs, URL token leakage considerations. ([OWASP Cheat Sheet Series][10])
10. OWASP File Upload Cheat Sheet — allowlist, file size limit, authorized upload, storage location, public retrieval risks. ([OWASP Cheat Sheet Series][13])
11. RFC 3986 — URI fragment behavior; fragment separated before dereference and handled by user agent. ([RFC Editor][3])
12. Google Cloud Storage Signed URLs — time-limited access; anyone possessing signed URL can use it while active. ([Google Cloud][4])
13. AWS S3 Presigned URLs — time-limited access for upload/download and checksum considerations. ([AWS 文檔][16])
14. W3C PNG Specification Third Edition — PNG as lossless portable compressed raster format; lossless definition. ([W3C][7])
15. JPEG.org JPEG 1 overview — JPEG 1 / ISO/IEC 10918, DCT-based lossy image format. ([JPEG][1])

[1]: https://jpeg.org/jpeg/ "JPEG - JPEG 1"
[2]: https://csrc.nist.gov/pubs/sp/800/38/d/final "SP 800-38D, Recommendation for Block Cipher Modes of Operation: Galois/Counter Mode (GCM) and GMAC | CSRC"
[3]: https://www.rfc-editor.org/rfc/rfc3986 "RFC 3986: Uniform Resource Identifier (URI): Generic Syntax | RFC Editor"
[4]: https://cloud.google.com/storage/docs/access-control/signed-urls "Signed URLs  |  Cloud Storage  |  Google Cloud Documentation"
[5]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines - Apple Developer"
[6]: https://developer.apple.com/app-store/app-privacy-details/ "App Privacy Details - App Store - Apple Developer"
[7]: https://www.w3.org/TR/png/ "Portable Network Graphics (PNG) Specification (Third Edition)"
[8]: https://developer.apple.com/documentation/xcode/supporting-universal-links-in-your-app "Supporting universal links in your app | Apple Developer Documentation"
[9]: https://developer.apple.com/storekit/ "StoreKit 2 - Apple Developer"
[10]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html "Session Management - OWASP Cheat Sheet Series"
[11]: https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html "Cryptographic Storage - OWASP Cheat Sheet Series"
[12]: https://developer.apple.com/documentation/cryptokit/aes/gcm "AES.GCM | Apple Developer Documentation"
[13]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html "File Upload - OWASP Cheat Sheet Series"
[14]: https://developer.apple.com/documentation/security/keychain-services "Keychain services | Apple Developer Documentation"
[15]: https://developer.apple.com/documentation/cryptokit "Apple CryptoKit | Apple Developer Documentation"
[16]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html "Download and upload objects with presigned URLs - Amazon Simple Storage Service"

