# HK2 — Hong Kong / 麻煩友 Copy System + Safety Style Guide

## 1. Executive Summary

HK2 是 Phase 16R「Hong Kong / 麻煩友 Language Mode UX + Safety」之後的 **產品與文案規格文件**。它不是研究報告，也不是 runtime implementation spec；它的用途是把已確認的產品方向轉成可交給產品、設計、文案、QA 和未來 Codex implementation 參考的 **copy system / safety style guide**。

HK2 目前維持：

```text
documentation-only
no runtime language mode implementation
no explicit profanity implementation
no LLM-generated live copy
no cloud dependency
no persistence change
```

HK2 的目標是先建立 deterministic copy system，讓之後的 Local Camera Coach、Photo Advisor、Filter Lab、改圖師等功能都可以用同一套安全、可控、可測試的語氣規則。

最重要三條原則：

```text
鬧拍攝，不鬧被拍的人。
鬧張相，不鬧人。
講一次就好，做返對就讚。
```

「麻煩友」是香港本地化品牌 personality，不是普通 AI tone pack，不是普通翻譯，不是單純粗口功能。它要像一個很煩、很直接、很固執，但真心想你張相靚的香港朋友。它可以批評手震、構圖、光線、距離、filter、crop、重拍時機，但永遠不應批評外貌、身材、年齡、性別、身份、健康或吸引力。

App Store 風險方面，Apple App Review Guidelines 禁止 offensive、insensitive、discriminatory、mean-spirited content，特別是會羞辱、恐嚇或傷害個人或 targeted groups 的內容；Apple age rating 亦會把 profanity / crude humor 納入分級評估。因此 explicit 麻煩友只可作 future opt-in，不能進 MVP、不能預設啟用、不能出現在 App Store screenshots、privacy、consent、notifications 或 public contexts。([Apple Developer][1])

---

## 2. Design Principles

### 2.1 Core Copy Principles

所有麻煩友 copy 必須符合以下原則：

```text
short
action-oriented
camera-first
photo-specific
useful before funny
funny but not cruel
direct but not abusive
no personal attack
no body / beauty / age / identity judgment
no sensitive inference
no repeated scolding
praise after correction
privacy / legal / consent always neutral
no AI jargon in user-facing copy unless needed for cloud consent
```

### 2.2 Copy Quality Rules

| Rule                    | 說明                                               |
| ----------------------- | ------------------------------------------------ |
| Short                   | Camera screen 只容納一句；避免長解釋                        |
| Action-oriented         | 每句都要有可做的下一步                                      |
| Photo-specific          | 只講光線、構圖、穩定、背景、距離、filter                          |
| Useful before funny     | 先有用，再好笑                                          |
| Funny but not cruel     | 可以吐槽，不可羞辱                                        |
| Direct but not abusive  | 直接指出問題，不攻擊人                                      |
| No repeated scolding    | 同一問題 cooldown                                    |
| Praise after correction | 修正後要有正向 feedback                                 |
| No AI jargon            | UI 用「本機導拍 / 相片顧問 / 麻煩友」，不是「AI 正在分析」              |
| Neutral legal copy      | privacy / consent / safety / rejection 永遠不用麻煩友語氣 |

### 2.3 Core Safety Sentence

文案 reviewer 和未來 Codex implementation 應把這句作最高優先級：

```text
麻煩友只可以鬧拍攝操作和照片狀態，不可以鬧人。
```

---

## 3. Language / Tone Modes

### 3.1 AppLanguageMode

```swift
enum AppLanguageMode {
    case english
    case traditionalChinese
    case simplifiedChinese
    case cantonese
}
```

User-facing settings label：

```text
English
繁體中文
简体中文
廣東話
```

### 3.2 ToneMode

```swift
enum ToneMode {
    case neutral
    case hongKongConversational
    case troublemaker
    case troublemakerExplicit
}
```

### 3.3 Mode Definition

| Mode                     | User-facing label | Description       | MVP           |
| ------------------------ | ----------------- | ----------------- | ------------- |
| `neutral`                | 標準                | 乾淨、清楚、友善          | ✅             |
| `hongKongConversational` | 香港口語              | 廣東話口語，無粗口         | ✅             |
| `troublemaker`           | 麻煩友               | 有吐槽、有挑剔感，但無粗口     | ✅             |
| `troublemakerExplicit`   | 麻煩友（粗口）           | 受控粗口，主要限於「屌」作語氣助詞 | ❌ Future only |

### 3.4 Required Rules

```text
廣東話是麻煩友主要入口。
廣東話不等於自動粗口。
troublemakerExplicit 必須後期、opt-in、二次確認。
MVP 只應準備 neutral / HK conversational / non-explicit troublemaker。
explicit copy 可放入規格作 future examples，但標記為 future / not MVP。
```

### 3.5 Suggested Settings Hierarchy

```text
語言
- English
- 繁體中文
- 简体中文
- 廣東話

語氣
- 標準
- 香港口語
- 麻煩友
- 麻煩友（粗口）Future / hidden / debug only
```

---

## 4. Context Rules

### 4.1 Context Tone Matrix

| Feature Context                          | Allowed Tone                     | Not Allowed Tone | Explicit Ever Allowed? | Notes                                           |
| ---------------------------------------- | -------------------------------- | ---------------- | ---------------------- | ----------------------------------------------- |
| Live Camera Coach                        | neutral / HK / troublemaker      | 人身攻擊、外貌批評        | Future opt-in only     | 最直接；同一問題講一次；修正後讚                                |
| Photo Advisor                            | neutral / HK / mild troublemaker | 粗口批評成品           | No                     | 拍攝後要建議、鼓勵、下一步                                   |
| Filter Lab                               | neutral / HK / brand tone        | offensive / 粗口   | No                     | 可幽默但不需要粗口                                       |
| 改圖師                                      | neutral / mild HK                | 粗口拒絕、羞辱          | No                     | prompt/suggestion 可口語；rejection/consent neutral |
| Privacy / Consent / Legal                | neutral only                     | 麻煩友 / 粗口         | Never                  | 清楚、正式、可信                                        |
| Notifications / Widgets / Public Context | neutral / HK non-explicit        | 粗口               | Never                  | 避免 public embarrassment                         |
| App Store Screenshots / Marketing        | neutral / HK non-explicit        | 粗口 / 高風險吐槽       | Never                  | 不展示 explicit copy                               |

### 4.2 Live Camera Coach

Allowed:

```text
可以最直接
可以使用麻煩友語氣
同一問題講一次
修正後要讚
explicit 粗口只限 future opt-in
```

Not allowed:

```text
連續鬧
粗口 spam
評論被拍攝者
拍攝後成品粗口批評
```

### 4.3 Photo Advisor

Allowed:

```text
香港口語
麻煩友式幽默
建議、鼓勵、下一步
```

Not allowed:

```text
粗口批評成品
「呢張相好差」式羞辱
外貌 / 身體 / 身份評論
```

Safe example:

```text
呢張差少少穩定度，下次唔好咁心急撳。
```

Unsafe:

```text
屌，呢張相影到咁差。
```

### 4.4 Filter Lab

Allowed:

```text
呢個色幾有港式夜景味。
呢個 filter 有啲舊相機感。
```

Not allowed:

```text
攻擊用戶審美
粗口批評 filter choice
```

### 4.5 改圖師

Allowed:

```text
呢個方向可以，幫張相柔返少少。
```

Rejection / safety / consent 必須 neutral：

```text
呢個要求涉及不安全改動，暫時未能處理。
```

### 4.6 Privacy / Consent / Legal

Always neutral:

```text
這會把目前照片傳送到雲端服務進行分析。
你可以取消，照片不會上傳。
```

Never:

```text
麻煩友語氣
粗口
吐槽
玩笑
```

---

## 5. Safety Rules

### 5.1 Never Target

Copy must never target:

```text
被拍攝者
race / ethnicity
religion
nationality
gender / gender identity
sexual orientation
disability
age
body shape
skin color
facial appearance
attractiveness
health
mental health
socioeconomic status
```

### 5.2 Never Include

Copy must never include:

```text
beauty score
attractiveness score
body shaming
sexual comments
harassment
threats
hate speech
slurs
demeaning protected class references
minors sexualization
self-harm encouragement
repeated aggressive profanity
sexual body-part profanity
mental health insult
```

### 5.3 Safe Targets

Copy may safely target:

```text
拍攝者操作
framing
lighting
composition
background
camera shake
distance
angle
filter choice
crop
timing
pose overlay alignment, if not body judgment
```

### 5.4 Safety Test

Every phrase must pass this test:

```text
Does this comment criticize a photo-taking action or photo state?
If yes, maybe safe.

Does this comment criticize a person, body, identity, face, age, attractiveness, health, or protected trait?
If yes, reject.
```

---

## 6. Banned Phrase List

### 6.1 Appearance

```text
你醜
你樣衰
你個樣唔得
你個樣太差
你皮膚差
你塊面唔得
你咁樣影都冇用
```

### 6.2 Body

```text
你肥
你瘦到唔好睇
你身材差
你條腰唔得
你個身形唔靚
任何 body shape insult
```

### 6.3 Age

```text
你老
你老到點影都冇用
你睇落好老
你太細個唔識影
任何 age insult
```

### 6.4 Identity

```text
任何 race / ethnicity insult
任何 gender insult
任何 nationality insult
任何 religion insult
任何 sexual orientation insult
任何 disability insult
任何 protected class insult
```

### 6.5 Mental Health

```text
你有病
你弱智
你唔正常
你傻
你精神有問題
任何 mental health insult
```

### 6.6 Sexual

```text
sexual comments
sexualized insult
sexual body-part profanity
性侮辱
任何以性器官作攻擊的詞語
```

### 6.7 Harassment

```text
你條廢物
你識唔識影相
你影得好廢
你真係冇用
你唔好再影相
你咁都影唔到
```

### 6.8 Repeated Profanity

```text
連續多句粗口
同一提示重複粗口
每次 frame update 都粗口
以粗口作攻擊而非語氣助詞
```

### 6.9 Protected Class

```text
針對 race / ethnicity / religion / nationality / gender / sexual orientation / disability / age / health / socioeconomic status 的任何貶低或笑話
```

---

## 7. Safe Rewrite Table

| Unsafe copy | Why unsafe                      | Safe neutral       | Safe HK            | Safe 麻煩友                 |
| ----------- | ------------------------------- | ------------------ | ------------------ | ------------------------ |
| 你個樣太暗沉      | 評論外貌 / 膚色                       | 主體光線有點暗，可以靠近窗邊。    | 主體有啲暗，行近窗邊啦。       | 個光死咗，行近窗邊啦。              |
| 你肥，唔好影側面    | body shaming                    | 這個角度背景有點亂，轉少少會乾淨啲。 | 呢個角度背景有啲亂，轉少少啦。    | 背景搶晒鏡，轉少少啦。              |
| 你老到點影都冇用    | age insult / harassment         | 光線柔和一點會更自然。        | 用柔和啲嘅光會自然好多。       | 呢個光太硬，換個柔位啦。             |
| 你影得好廢       | 人身攻擊 / harassment               | 構圖未到位，鏡頭稍微向下。      | 構圖差少少，鏡頭落返啲。       | 構圖未到位，鏡頭落返少少先啦。          |
| 你條廢物識唔識影相   | 人身攻擊 / bullying                 | 畫面有點手震，等穩定一點再拍。    | 有少少震，定一定先撳。        | 唔好心急，定一定先撳啦。             |
| 屌，呢張相影到咁差   | post-capture 粗口羞辱               | 這張差少少穩定度，下次等定啲先拍。  | 呢張差少少穩定度，下次唔好咁心急撳。 | 呢張係心急咗少少，下次定一定會 sharp 啲。 |
| 你皮膚差        | 外貌 / health inference           | 光線有點硬，可以用柔和一點的方向。  | 個光有啲硬，柔返少少會自然啲。    | 呢個光太硬，轉個柔位啦。             |
| 你個樣唔得       | 外貌羞辱                            | 這個角度未夠自然，可以轉少少。    | 呢個角度未夠自然，轉少少試下。    | 呢個角度唔順眼，轉少少啦。            |
| 你有病呀        | mental health insult            | 不要太急，畫面穩定後再拍。      | 唔好咁急，穩定啲先撳。        | 唔好心急，定返先撳啦。              |
| 你唔正常        | mental health / identity insult | 這個構圖有點偏，可以移回中間。    | 構圖偏咗少少，移返中間啦。      | 主體走咗位，拉返中間啦。             |

---

## 8. Copy Template Categories

| Category                   | 使用場景                      | Allowed tone                     | Not allowed tone            |             Explicit ever? | Praise applicable? |
| -------------------------- | ------------------------- | -------------------------------- | --------------------------- | -------------------------: | -----------------: |
| `lighting`                 | 光線暗、爆光、硬光                 | neutral / HK / troublemaker      | 外貌 / 膚色批評                   |           Future live only |                  ✅ |
| `framing`                  | 主體位置、構圖偏移                 | neutral / HK / troublemaker      | 人身攻擊                        |           Future live only |                  ✅ |
| `headroom`                 | 頭頂空間太多 / 太少               | neutral / HK / troublemaker      | 外貌 / 身高評論                   |           Future live only |                  ✅ |
| `stability`                | 手震、穩定度                    | neutral / HK / troublemaker      | 侮辱拍攝者人格                     |           Future live only |                  ✅ |
| `background_clutter`       | 背景太亂 / 搶鏡                 | neutral / HK / troublemaker      | 社會階層 / 居住環境羞辱               |           Future live only |                  ✅ |
| `distance`                 | 主體太遠 / 太近                 | neutral / HK / troublemaker      | 身體評論                        |           Future live only |                  ✅ |
| `filter_suggestion`        | 推薦 filter                 | neutral / HK / brand tone        | 攻擊審美                        | Future live only, optional |                  ✅ |
| `pose_overlay`             | pose overlay 對齊           | neutral / HK / troublemaker      | body judgment               |           Future live only |                  ✅ |
| `retake`                   | 重拍建議                      | neutral / HK / mild troublemaker | post-capture 粗口羞辱           |  Live future only; post no |                  ✅ |
| `crop`                     | 裁切建議                      | neutral / HK / mild troublemaker | 嘲笑成品                        |        No for post-capture |                  ✅ |
| `advisor_result`           | 拍後相片顧問                    | neutral / HK / mild troublemaker | 粗口批評成品                      |                      Never |                  ✅ |
| `image_editing_suggestion` | 改圖師建議                     | neutral / HK                     | 粗口 / 羞辱                     |                      Never |                  ✅ |
| `permission`               | 權限提示                      | neutral only                     | 麻煩友 / 粗口                    |                      Never |                  ❌ |
| `camera_unavailable`       | camera unavailable        | neutral only                     | 麻煩友 / 粗口                    |                      Never |                  ❌ |
| `consent`                  | cloud / privacy consent   | neutral only                     | 麻煩友 / 粗口                    |                      Never |                  ❌ |
| `safety_rejection`         | prompt / safety rejection | neutral / very mild HK           | 粗口拒絕 / shame                |                      Never |                  ❌ |
| `success_praise`           | 修正後讚                      | neutral / HK / troublemaker      | sarcasm / backhanded insult |         No explicit needed |                  ✅ |

---

## 9. Phrase Bank

> Implementation note: `troublemakerExplicit` examples are **future / opt-in only**. They must not be used in MVP, post-capture, consent, privacy, legal, notifications, widgets, or App Store screenshots.

### 9.1 `lighting`

**Neutral**

```text
光線有點暗，可以靠近窗邊。
高光有點強，可以避開直射光。
光暗差有點大，換個柔和位置會好啲。
```

**HK conversational**

```text
個光有啲暗，行近窗邊啦。
高光有啲爆，避開直射光會舒服啲。
光暗差太大，轉少少位啦。
```

**麻煩友**

```text
個光死咗，行近窗邊啦。
高光爆到搶鏡，避一避啦。
呢個光咁硬，轉個位啦。
```

**Future explicit / opt-in only**

```text
屌，個光死咗，行近窗邊啦。
屌，高光爆晒，避開直射光啦。
```

**Praise**

```text
啱啦，呢個光醒神好多。
係，光線順眼返。
好，呢個位舒服好多。
```

---

### 9.2 `framing`

**Neutral**

```text
主體可以再靠中間少少。
畫面左邊有點空，可以微調角度。
構圖差少少，鏡頭移右一點。
```

**HK conversational**

```text
主體偏咗少少，移返中間啦。
左邊空咗啲，轉少少角度。
鏡頭移右少少會順眼啲。
```

**麻煩友**

```text
主體走咗位喎，拉返中間啦。
左邊空到咁，轉少少啦。
構圖未到位，移右少少先啦。
```

**Future explicit / opt-in only**

```text
屌，主體走晒位，拉返中間啦。
屌，左邊空咁多做乜？轉少少啦。
```

**Praise**

```text
係，呢個構圖順眼好多。
好，主體清楚返。
啱啦，呢個位穩陣。
```

---

### 9.3 `headroom`

**Neutral**

```text
頭頂空間有點多，鏡頭稍微向下。
頭頂留少一點，主體會更集中。
鏡頭向下少少會自然啲。
```

**HK conversational**

```text
個頭頂位有啲多，鏡頭落返少少。
頭頂唔使留咁多，落少少啦。
落返少少，主體會集中啲。
```

**麻煩友**

```text
頭頂留咁多位做展覽咩？落返少少啦。
個頭頂位太闊喇，鏡頭落返啲。
留咁多天花冇著數，落少少啦。
```

**Future explicit / opt-in only**

```text
屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。
屌，天花搶晒鏡，落返啲啦。
```

**Praise**

```text
係，呢個位順眼好多。
好，頭頂位啱啱好。
啱啦，主體集中返。
```

---

### 9.4 `stability`

**Neutral**

```text
有點手震，等穩定一點再拍。
畫面穩定了，可以拍。
夜景容易震，定一定先撳。
```

**HK conversational**

```text
有少少震，定一定先撳。
畫面穩喇，可以拍。
夜晚唔好急，穩啲先。
```

**麻煩友**

```text
唔好震啦，定一定先撳。
而家穩好多，撳啦。
夜晚咁暗，唔好心急啦。
```

**Future explicit / opt-in only**

```text
屌，手震到咁，定一定先撳啦。
屌，唔好急，穩咗先影。
```

**Praise**

```text
係啦，穩好多，撳啦。
好，畫面定返。
啱啦，呢下穩。
```

---

### 9.5 `background_clutter`

**Neutral**

```text
背景有點亂，可以靠近主體。
右邊有雜物，可以轉少少角度。
背景太搶眼，主體可以再近一點。
```

**HK conversational**

```text
背景有啲亂，行近少少啦。
右邊啲嘢搶鏡，轉少少。
背景太多嘢，近啲會乾淨啲。
```

**麻煩友**

```text
背景亂到搶晒鏡，行近少少啦。
右邊嗰堆嘢好煩，轉少少啦。
主體太遠，背景贏晒喎。
```

**Future explicit / opt-in only**

```text
屌，背景亂到咁，行近少少啦。
屌，右邊嗰堆嘢搶晒鏡，轉啦。
```

**Praise**

```text
係，背景乾淨好多。
好，主體突出返。
啱啦，冇咁亂。
```

---

### 9.6 `distance`

**Neutral**

```text
主體有點遠，可以行近一點。
退後少少，背景會完整啲。
距離啱啱好，可以拍。
```

**HK conversational**

```text
主體有啲遠，行近少少啦。
退後少少，背景會入得靚啲。
呢個距離啱喇。
```

**麻煩友**

```text
企咁遠做乜？行近少少啦。
太貼喇，退後少少先。
呢個距離唔差，撳啦。
```

**Future explicit / opt-in only**

```text
屌，企咁遠影空氣咩？行近啲啦。
屌，太貼喇，退後少少。
```

**Praise**

```text
係，距離啱好多。
好，主體清楚返。
啱啦，唔遠唔近。
```

---

### 9.7 `filter_suggestion`

**Neutral**

```text
這個光線適合暖色底片。
夜景可以試 Amber Night。
街拍感可以試 Street Chrome。
```

**HK conversational**

```text
呢個光幾啱暖色底片。
夜景試下 Amber Night 啦。
街拍味可以試 Street Chrome。
```

**麻煩友**

```text
呢個光唔好浪費，轉暖色底片啦。
夜景仲用咁淡？試 Amber Night 啦。
呢個街拍位，Street Chrome 啱晒。
```

**Future explicit / opt-in only**

```text
屌，呢個光唔轉暖色底片好嘥。
屌，夜景試 Amber Night 啦。
```

**Praise**

```text
係，呢個 filter 夾好多。
好，個 mood 出返嚟。
啱啦，呢個色順眼。
```

---

### 9.8 `pose_overlay`

**Neutral**

```text
對齊 pose 線條會自然一點。
主體可以再靠近 overlay。
手部位置可以跟線條微調。
```

**HK conversational**

```text
跟返條 pose 線會自然啲。
主體近返 overlay 少少。
手位跟返少少會順眼啲。
```

**麻煩友**

```text
條 pose 線喺度㗎，跟返少少啦。
人同 overlay 分咗家，拉近返啲。
手位差少少，跟返條線啦。
```

**Future explicit / opt-in only**

```text
屌，條 pose 線喺度，跟返少少啦。
屌，overlay 同人分咗家，拉近啲。
```

**Praise**

```text
係，pose 順眼好多。
好，對齊返。
啱啦，姿勢自然好多。
```

---

### 9.9 `retake`

**Neutral**

```text
可以保留這張，再試多一張。
如果想更自然，可以退後少少再拍。
光線有點硬，可以換個位置再試。
```

**HK conversational**

```text
呢張可以留，再試多張啦。
想自然啲，退後少少再拍。
個光有啲硬，換位再試啦。
```

**麻煩友**

```text
呢張唔差，但可以再試多張。
想靚啲就退後少少再嚟。
個光太硬，唔好死撐，換位啦。
```

**Future explicit / opt-in only**

```text
屌，唔好心急，退後少少再嚟。
屌，個光太硬，換位再試啦。
```

**Restriction**

```text
以上 explicit retake 只限 live camera context。
Photo Advisor / post-capture 不可用粗口批評。
```

**Praise**

```text
好，第二張自然好多。
係，呢個光順眼啲。
啱啦，重拍有用。
```

---

### 9.10 `crop`

**Neutral**

```text
可以裁走右邊少少空白。
保留上方天空，畫面會更有旅行感。
試 4:5，主體會更集中。
```

**HK conversational**

```text
右邊可以裁少少。
上面天空留返，會有旅行感。
試下 4:5，主體集中啲。
```

**麻煩友**

```text
右邊空咁多，裁少少啦。
天空幾靚，唔好裁走晒。
4:5 會集中啲，唔好咁散。
```

**Future explicit**

```text
N/A — crop is mostly post-capture; no explicit profanity.
```

**Praise**

```text
係，裁完集中好多。
好，畫面乾淨返。
啱啦，主體突出返。
```

---

### 9.11 `advisor_result`

**Neutral**

```text
這張相有暖光感，可以試柔和復古濾鏡。
主體有點暗，可以稍微提亮。
背景有點搶眼，可以柔化一點。
```

**HK conversational**

```text
呢張有暖光 feel，可以試柔和復古色。
主體暗咗少少，可以提亮啲。
背景搶咗少少，可以柔返啲。
```

**麻煩友**

```text
呢張有得救，暖色復古會幾啱。
主體暗咗，提亮少少先似樣。
背景有啲搶鏡，柔返少少啦。
```

**Future explicit**

```text
N/A — Photo Advisor 不作粗口批評。
```

**Praise**

```text
好，呢個方向啱張相。
係，改完自然好多。
啱啦，個 mood 出返嚟。
```

---

### 9.12 `image_editing_suggestion`

**Neutral**

```text
可以提亮主體，保留自然質感。
可以柔化背景，但不改變構圖。
可以加一點底片感，保持原本氛圍。
```

**HK conversational**

```text
可以提亮主體，保留自然感。
背景可以柔少少，但唔好改構圖。
加少少底片感會幾啱。
```

**麻煩友**

```text
主體暗咗少少，提亮返先似樣。
背景有啲搶鏡，柔返少少啦。
呢張加少少底片味會醒神啲。
```

**Future explicit**

```text
N/A — 改圖師不使用粗口，特別是 prompt guard / rejection / consent。
```

**Praise**

```text
好，呢個改法自然。
係，改完順眼好多。
啱啦，保留到原本個 mood。
```

---

### 9.13 `permission`

**Neutral only**

```text
需要相機權限先可以拍攝。
你可以到設定開啟相機權限。
沒有相機權限時，仍然可以匯入相片。
```

**HK conversational**

```text
N/A — permission copy should remain neutral.
```

**麻煩友**

```text
N/A — permission copy should remain neutral.
```

**Future explicit**

```text
N/A
```

**Praise**

```text
N/A
```

---

### 9.14 `camera_unavailable`

**Neutral only**

```text
暫時未能使用相機。
相機目前不可用，可以改為匯入相片。
請檢查相機權限或稍後再試。
```

**HK conversational**

```text
N/A — camera unavailable copy should remain neutral.
```

**麻煩友**

```text
N/A
```

**Future explicit**

```text
N/A
```

**Praise**

```text
N/A
```

---

### 9.15 `consent`

**Neutral only**

```text
這會把目前照片傳送到雲端服務進行分析。
你可以取消，照片不會上傳。
同意後才會開始處理這張照片。
```

**HK conversational**

```text
N/A — consent copy must remain neutral.
```

**麻煩友**

```text
N/A
```

**Future explicit**

```text
N/A
```

**Praise**

```text
N/A
```

---

### 9.16 `safety_rejection`

**Neutral**

```text
這個要求暫時未能安全處理。
請改用與相片修圖相關的描述。
我們不會處理涉及外貌羞辱、身份攻擊或不安全內容的要求。
```

**Very mild HK**

```text
呢個要求暫時唔適合處理。
可以改成「提亮主體」或者「柔化背景」呢類修圖方向。
涉及外貌、身份或不安全內容嘅要求唔會處理。
```

**麻煩友**

```text
N/A — safety rejection should not use troublemaker tone.
```

**Future explicit**

```text
N/A
```

**Praise**

```text
N/A
```

---

### 9.17 `success_praise`

**Neutral**

```text
現在畫面穩定了。
這個構圖更自然。
光線順眼了，可以拍。
```

**HK conversational**

```text
而家穩好多。
呢個構圖自然啲。
個光順眼返，可以拍。
```

**麻煩友**

```text
係啦，穩好多，撳啦。
啱啦，呢個位順眼好多。
好，個光醒神返。
```

**Future explicit**

```text
N/A — praise does not need profanity.
```

**Praise variants**

```text
係，呢個位啱喇。
好，做返啱。
啱啦，張相即刻順眼好多。
```

---

## 10. Positive Feedback / Praise Loop

### 10.1 Behavior Requirements

```text
issue detected copy
issue shown once
cooldown
issue resolved
praise copy
praise cooldown
issue returns
quiet mode
no spam
no repeated profanity
```

### 10.2 State Model

```text
notDetected
→ detected
→ shownOnce
→ coolingDown
→ resolved
→ praised
→ idle
```

### 10.3 Rules

| Rule              | Requirement                                |
| ----------------- | ------------------------------------------ |
| Issue shown once  | 同一 issue 不可連續顯示                            |
| Cooldown          | 同類 issue 需等待 cooldown                      |
| Praise on resolve | issue 從 bad → good 時可顯示 praise             |
| Praise cooldown   | praise 也不可 spam                            |
| Quiet mode        | 降低提示與 praise 頻率                            |
| Explicit limit    | explicit phrase 在 same issue window 只可出現一次 |
| Return handling   | issue returns after cooldown 才可再提示         |
| Shutter priority  | praise 不應遮住 shutter 或阻礙拍攝                  |

### 10.4 Example Flow — Headroom

```text
notDetected
→ detected: headroom too much
→ shownOnce: 頭頂留咁多位做展覽咩？落返少少啦。
→ coolingDown
→ resolved: headroom ok
→ praised: 係，呢個位順眼好多。
→ idle
```

### 10.5 Example Flow — Shake

```text
detected: camera shake high
shownOnce: 唔好震啦，定一定先撳。
coolingDown
resolved: stable for threshold window
praised: 係啦，穩好多，撳啦。
```

Future explicit version:

```text
shownOnce: 屌，手震到咁，定一定先撳啦。
resolved: 係啦，穩好多，撳啦。
```

### 10.6 Example Flow — Low Light

```text
detected: brightness too low
shownOnce: 個光死咗，行近窗邊啦。
coolingDown
resolved: brightness normal
praised: 啱啦，呢個光醒神好多。
```

### 10.7 Example Flow — Background Clutter

```text
detected: background clutter high
shownOnce: 背景亂到搶晒鏡，行近少少啦。
coolingDown
resolved: clutter reduced
praised: 係，背景乾淨好多。
```

### 10.8 Example Flow — Framing

```text
detected: subject off-center
shownOnce: 主體走咗位喎，拉返中間啦。
coolingDown
resolved: subject centered
praised: 好，主體清楚返。
```

---

## 11. Localization Key Plan

### 11.1 Key Naming Convention

Recommended pattern:

```text
<surface>.<category>.<state>.<tone>
```

Examples:

```text
guidance.lighting.dark.neutral
guidance.lighting.dark.hk
guidance.lighting.dark.troublemaker
guidance.lighting.dark.troublemaker_explicit
guidance.lighting.dark.praise

advisor.result.warm_light.neutral
advisor.result.warm_light.hk
advisor.result.warm_light.troublemaker

privacy.consent.cloud_ai.neutral
```

### 11.2 Language vs Tone

`language` and `tone` should be separate.

```text
language = english / zh_hant / zh_hans / cantonese
tone = neutral / hk / troublemaker / troublemaker_explicit
```

Do not encode all behavior into language alone. 廣東話 language can still use neutral / HK conversational / troublemaker.

### 11.3 Fallback Rules

| Condition                 | Fallback                                        |
| ------------------------- | ----------------------------------------------- |
| Missing explicit key      | fallback to troublemaker, then hk, then neutral |
| Missing troublemaker key  | fallback to hk, then neutral                    |
| Missing hk key            | fallback to zh_hant neutral                     |
| Missing zh_hans key       | fallback to neutral base                        |
| Consent / privacy / legal | always use neutral                              |
| Post-capture context      | never use explicit                              |
| Notification / widget     | never use explicit                              |
| App Store screenshots     | never use explicit                              |

### 11.4 Explicit Fallback Safety

Required:

```text
Never fallback from neutral to explicit.
Never fallback from HK to explicit.
Never fallback from post-capture to live explicit.
Never show explicit if userOptedInExplicit == false.
Never show explicit in publicContext == true.
```

### 11.5 Missing Key Behavior

If key missing:

```text
1. Log missing key in debug only.
2. Fallback to safest neutral phrase.
3. Do not show raw localization key.
4. Do not fallback to explicit.
```

### 11.6 Sample Keys — Main Categories

```text
guidance.lighting.dark.neutral
guidance.lighting.dark.zh_hant
guidance.lighting.dark.zh_hans
guidance.lighting.dark.hk
guidance.lighting.dark.troublemaker
guidance.lighting.dark.troublemaker_explicit
guidance.lighting.dark.praise

guidance.framing.off_center.neutral
guidance.framing.off_center.hk
guidance.framing.off_center.troublemaker
guidance.framing.off_center.troublemaker_explicit
guidance.framing.off_center.praise

guidance.headroom.too_much.neutral
guidance.headroom.too_much.hk
guidance.headroom.too_much.troublemaker
guidance.headroom.too_much.troublemaker_explicit
guidance.headroom.too_much.praise

guidance.stability.shaky.neutral
guidance.stability.shaky.hk
guidance.stability.shaky.troublemaker
guidance.stability.shaky.troublemaker_explicit
guidance.stability.shaky.praise

guidance.background_clutter.busy.neutral
guidance.background_clutter.busy.hk
guidance.background_clutter.busy.troublemaker
guidance.background_clutter.busy.troublemaker_explicit
guidance.background_clutter.busy.praise

guidance.distance.too_far.neutral
guidance.distance.too_far.hk
guidance.distance.too_far.troublemaker
guidance.distance.too_far.troublemaker_explicit
guidance.distance.too_far.praise

guidance.filter_suggestion.warm_light.neutral
guidance.filter_suggestion.warm_light.hk
guidance.filter_suggestion.warm_light.troublemaker
guidance.filter_suggestion.warm_light.troublemaker_explicit
guidance.filter_suggestion.warm_light.praise

guidance.pose_overlay.misaligned.neutral
guidance.pose_overlay.misaligned.hk
guidance.pose_overlay.misaligned.troublemaker
guidance.pose_overlay.misaligned.troublemaker_explicit
guidance.pose_overlay.misaligned.praise

advisor.retake.optional.neutral
advisor.retake.optional.hk
advisor.retake.optional.troublemaker

advisor.crop.right_space.neutral
advisor.crop.right_space.hk
advisor.crop.right_space.troublemaker

advisor.result.warm_retro.neutral
advisor.result.warm_retro.hk
advisor.result.warm_retro.troublemaker

image_editing.suggestion.soft_film.neutral
image_editing.suggestion.soft_film.hk
image_editing.suggestion.soft_film.troublemaker

permission.camera.denied.neutral
camera_unavailable.default.neutral
consent.cloud_ai.photo_analysis.neutral
safety_rejection.unsafe_prompt.neutral
success_praise.generic.neutral
success_praise.generic.hk
success_praise.generic.troublemaker
```

### 11.7 Apple Localization Notes

Use Apple localization infrastructure such as String Catalogs and separate user-visible text from code. Apple localization guidance also recommends considering cultural context, translator notes, screenshots, and native-speaker review, which is especially important for Hong Kong Cantonese humor and 麻煩友 tone. ([Apple Developer][2])

---

## 12. QA Checklist

### 12.1 Copy Safety QA

```text
[ ] no banned phrase in neutral
[ ] no banned phrase in HK
[ ] no banned phrase in troublemaker
[ ] no body judgment
[ ] no beauty judgment
[ ] no age judgment
[ ] no identity judgment
[ ] no protected class reference
[ ] no mental health insult
[ ] no sexual body-part profanity
[ ] no threat
[ ] no slur
```

### 12.2 Context QA

```text
[ ] no explicit copy in post-capture
[ ] no explicit copy in consent
[ ] no explicit copy in privacy
[ ] no explicit copy in legal
[ ] no explicit copy in notification
[ ] no explicit copy in widget
[ ] no explicit copy in App Store screenshots
[ ] no troublemaker copy in permission denied
[ ] no troublemaker copy in camera unavailable
```

### 12.3 Fallback QA

```text
[ ] no fallback to explicit
[ ] missing explicit key falls back to non-explicit
[ ] missing troublemaker key falls back to HK / neutral
[ ] missing key never displays raw localization key
[ ] post-capture context never resolves explicit key
[ ] public context never resolves explicit key
```

### 12.4 Behavior QA

```text
[ ] no repeated scolding
[ ] same issue cooldown works
[ ] same category cooldown works
[ ] praise after correction
[ ] praise cooldown works
[ ] quiet mode reduces hints
[ ] explicit phrase not repeated in same issue window
```

### 12.5 Accessibility / Localization QA

```text
[ ] VoiceOver check
[ ] VoiceOver does not read unexpected profanity
[ ] native HK speaker review
[ ] zh-Hant review
[ ] zh-Hans review
[ ] English fallback review
[ ] truncation / layout check
[ ] compact chip fits camera UI
[ ] Dynamic Type check where applicable
```

### 12.6 Scenario QA

```text
[ ] child / family photo context check
[ ] face detected but no identity inference
[ ] no face detected
[ ] low light
[ ] headroom
[ ] shake
[ ] pose overlay
[ ] filter suggestion
[ ] post-capture advisor
[ ] image editing suggestion
[ ] permission denied
[ ] camera unavailable
[ ] cloud AI consent copy
[ ] safety rejection copy
```

### 12.7 App Store Metadata QA

```text
[ ] screenshots use neutral or HK non-explicit only
[ ] no explicit profanity in marketing copy
[ ] no hidden explicit mode if not reviewed
[ ] review notes explain tone mode if included
[ ] age rating answers match actual content
```

Apple requires metadata, screenshots, previews, and privacy information to accurately reflect the app’s core experience, and age rating information should be answered honestly. ([Apple Developer][1])

---

## 13. Implementation Notes for Future Codex Phase

### 13.1 Future Components

```swift
enum AppLanguageMode {
    case english
    case traditionalChinese
    case simplifiedChinese
    case cantonese
}

enum ToneMode {
    case neutral
    case hongKongConversational
    case troublemaker
    case troublemakerExplicit
}

enum FeatureContext {
    case liveCameraCoach
    case photoAdvisor
    case filterLab
    case imageEditing
    case permission
    case cameraUnavailable
    case consent
    case notification
    case widget
    case appStoreMarketing
}

enum GuidanceCategory {
    case lighting
    case framing
    case headroom
    case stability
    case backgroundClutter
    case distance
    case filterSuggestion
    case poseOverlay
    case retake
    case crop
    case advisorResult
    case imageEditingSuggestion
    case permission
    case cameraUnavailable
    case consent
    case safetyRejection
    case successPraise
}
```

Planning components:

```text
GuidanceCopyResolver
SafetyCopyPolicy
ContextToneRule
GuidanceIssueMemory
GuidancePraiseResolver
LocalizationKeyBuilder
CameraCoachCopyProvider
PhotoAdvisorCopyProvider
FilterLabCopyProvider
ImageEditingCopyProvider
```

### 13.2 Resolver Flow

```text
GuidanceCategory
+ guidance state
+ severity
+ AppLanguageMode
+ ToneMode
+ FeatureContext
+ explicit opt-in flag
+ public context flag
→ SafetyCopyPolicy
→ ContextToneRule
→ LocalizationKeyBuilder
→ localized template
→ fallback
```

### 13.3 SafetyCopyPolicy Requirements

```text
no LLM
no cloud
deterministic templates
no explicit mode in MVP
no persistence unless approved
privacy copy neutral
consent copy neutral
permission copy neutral
tests for fallback safety
tests for banned phrase scan
tests for no post-capture profanity
```

### 13.4 Explicit Gating Pseudocode

```swift
func canUseExplicitCopy(
    toneMode: ToneMode,
    featureContext: FeatureContext,
    userExplicitOptIn: Bool,
    isPublicContext: Bool
) -> Bool {
    guard toneMode == .troublemakerExplicit else { return false }
    guard userExplicitOptIn else { return false }
    guard !isPublicContext else { return false }
    guard featureContext == .liveCameraCoach else { return false }
    return false // MVP: explicit remains disabled until future approved phase
}
```

### 13.5 Issue Memory Requirements

```text
store last issue category
store last issue id
store last shown timestamp
store cooldown until
store resolved state
store praise shown state
do not store photo frames
do not store face data
do not store sensitive inference
```

### 13.6 Tests Required in Future Codex Phase

```text
testNeutralNeverUsesExplicit
testPostCaptureNeverUsesExplicit
testConsentAlwaysNeutral
testPermissionAlwaysNeutral
testMissingExplicitFallsBackToTroublemakerOrNeutral
testNoRawLocalizationKeyDisplayed
testBannedPhraseScanPasses
testPraiseAfterIssueResolved
testNoRepeatedScoldingWithinCooldown
testExplicitDisabledInMVP
```

---

## 14. Final Recommendation

HK2 應先做成 **docs-only style guide**，不應直接進 runtime implementation。這份文件的目標是先固定語氣、邊界、phrase bank、banned phrase、rewrite table、key plan 和 QA checklist。

清楚建議：

```text
1. HK2 先做成 docs-only style guide。
2. 之後才做 mock Settings UI。
3. 再之後才做 deterministic template integration。
4. explicit profanity 最後才考慮。
5. 不應用 AI 即時生成粗口。
6. 不應把廣東話等同粗口。
7. 麻煩友應成為品牌 personality，而不是 offensive gimmick。
8. Live Camera Coach 可以較直接，但同一問題講一次。
9. 用戶做返對時要讚。
10. Photo Advisor / post-capture 不作粗口批評。
11. Privacy / consent / legal / safety rejection 永遠 neutral。
12. Future Codex phase 必須用 deterministic templates、SafetyCopyPolicy 和 context rules 保證不漏出 explicit copy。
```

Recommended next step:

```text
HK3 — Mock Language Mode UI

Scope:
- Settings mock only.
- No real persistence or temporary in-memory setting only.
- Show neutral / HK / troublemaker examples.
- Explicit mode hidden or debug only.
- No runtime camera copy resolver yet.
- No LLM.
- No cloud.
- No explicit production copy.
```

[1]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines - Apple Developer"
[2]: https://developer.apple.com/localization/ "Localization - Apple Developer"
