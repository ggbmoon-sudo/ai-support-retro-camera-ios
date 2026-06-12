# Hong Kong / 麻煩友 Language Mode UX + Safety for iOS Retro Camera App 深入研究報告

## 1. Executive Summary

**廣東話 / 麻煩友 mode** 應定位為香港本地化品牌 personality，而不是普通 AI tone pack、不是單純翻譯、也不是粗口功能。它的價值是令 camera-first retro photo app 有香港語感、記憶點和本地文化辨識度：像一個很煩、很直接、很固執，但真心想你張相靚的朋友，在拍攝中提醒你構圖、光線、手震、頭頂空間、背景、距離和濾鏡選擇。

核心原則應固定為三句：

```text
鬧拍攝，不鬧被拍的人。
鬧張相，不鬧人。
講一次就好，做返對就讚。
```

廣東話 mode 可以是「麻煩友」入口，但不應一進入廣東話就突然粗口轟炸。建議內部分四級：Neutral、Hong Kong Conversational、麻煩友、麻煩友 + 粗口 opt-in。粗口可以存在，但必須受控、default off、明確 opt-in、可一鍵關閉，只限 live camera coach 等即時拍攝場景；拍攝後 Photo Advisor 不應用粗口批評成品。

App Store 風險主要來自 objectionable content、profanity / crude humor、harassment / bullying、age rating、metadata screenshots，以及如果未來用 AI 生成文案，就會涉及 user-generated / AI-generated content moderation。Apple App Review Guidelines 明確禁止 offensive、insensitive、discriminatory、mean-spirited content，特別是針對 religion、race、sexual orientation、gender、national/ethnic origin 等群體的羞辱、恐嚇或傷害；Apple 亦要求 App Store metadata、screenshots、previews 準確反映 app 核心體驗，且 metadata 即使 app 評級較高，也應適合 4+ audience。([Apple Developer][1])

最安全路線是：

```text
HK1 Research / Product Policy
→ HK2 Copy System / Style Guide
→ HK3 Mock Language Mode UI
→ HK4 Deterministic Template Integration
→ HK5 Explicit Opt-in Mode only after review
→ HK6 Advanced Personality Packs
→ HK7 Future AI-generated Tone only with moderation
```

MVP 應先做 **香港口語 + non-explicit 麻煩友 deterministic templates**，不要一開始做 AI 即時生成粗口。未來若涉及 cloud AI / third-party AI，privacy / consent copy 必須 neutral 且清楚說明，不可用麻煩友語氣處理法律、私隱或安全拒絕。你現有產品方向已確立「拍攝前 / 拍攝中 local-only，不做 continuous cloud AI；拍攝後才考慮 cloud AI」，這與之前 cloud backend boundary 的安全原則一致。

---

## 2. My Product Idea — 整理你的想法

你的產品想法不是「加一個廣東話翻譯」或「加一個粗口模式」，而是建立一個有本地文化辨識度的 **camera coach persona**。

「麻煩友」是一個品牌角色：

* 很煩。
* 很直接。
* 很固執。
* 對張相有要求。
* 真心想你影得好。
* 用香港口語提醒你。
* 做錯時講一次。
* 做返對時即刻讚。
* 只針對拍攝行為和照片狀態，不針對人。

它要幫用戶改善照片，而不是羞辱用戶。它可以提醒：

```text
手震
頭頂空間太多
光線太死
背景太亂
主體太遠
構圖未到位
濾鏡唔啱
可以行近窗邊
可以等穩定啲再拍
可以重拍 / 裁切
```

它不應評論：

```text
外貌
身材
年齡
性別
種族
膚色
宗教
性取向
殘疾
健康
精神狀態
社會階層
吸引力
beauty / attractiveness
```

你希望 app 減少 user-facing UI 直接使用「AI」字眼，把功能包裝成更有品牌感的名詞，例如：

| 原本 AI 名稱            | 建議品牌化名稱           |
| ------------------- | ----------------- |
| AI Guidance         | 本機導拍 / 相機教練 / 打工仔 |
| AI Photo Advisor    | 相片顧問 / 麻煩友        |
| AI Snapshot         | 快速建議 / 麻煩友看看      |
| AI Filter Generator | Filter Lab / 專屬濾鏡 |
| AI Image Editing    | 改圖師 / 相片改造        |
| AI Assistant        | 打工仔 / 麻煩友 / 相片顧問  |

同時，privacy / consent 場景仍然要清楚說明 cloud AI / third-party AI，不能因為品牌化而隱藏資料處理方式。Apple privacy guidance 要求 privacy policy 清楚說明收集什麼資料、如何使用、第三方如何保護資料，以及 retention / deletion 和撤回 consent 的方式。([Apple Developer][1])

---

## 3. Product Positioning: Local Interest and Brand Differentiation

### 3.1 正確定位

「麻煩友」的產品定位應是：

```text
香港 / 廣東話本地化 camera coach persona
```

它服務三個目標：

1. **吸引本地用家**
   香港 / 廣東話用戶對自然口語、朋友式吐槽、港式節奏有親切感。普通 AI camera app 可能用「建議你改善構圖」；麻煩友會說「頭頂留咁多位做展覽咩？落返少少啦。」兩者功能相同，但記憶點完全不同。

2. **品牌差異化**
   你的 app 方向是 retro camera，不只是 AI 工具。麻煩友令 app 像有性格，而不是一個 generic AI assistant。

3. **社交話題 / meme potential**
   非粗口版本的麻煩友 copy 可做 marketing hook，例如「個頭頂位留咁多做展覽咩？」這類句子有 shareability。Explicit copy 不應放在 App Store screenshots 或預設 onboarding。

### 3.2 文化語境的重要性

港式幽默的好處是快、短、直接，但風險是容易由「朋友式吐槽」滑向「羞辱」。所以 tone design 必須把 target 鎖定在：

```text
拍攝操作 / 畫面狀態 / 下一步行動
```

而不是：

```text
用戶人格 / 被拍攝者外貌 / 身份特徵 / 身體特徵
```

### 3.3 Brand memory vs review risk

| 做法                  | Brand memory | App Store risk | 建議       |
| ------------------- | -----------: | -------------: | -------- |
| 香港口語，但無粗口           |            高 |            低至中 | MVP 推薦   |
| 麻煩友吐槽，但不人身攻擊        |            高 |              中 | 可做       |
| 受控粗口 opt-in         |           很高 |            中至高 | 後期、嚴格 QA |
| 粗口 / 侮辱 / body joke |         高但負面 |             很高 | 不做       |
| AI 即時生成粗口           |           不穩 |             很高 | 不做 MVP   |

Apple App Store Connect 的 age rating 定義把 profanity / crude humor 定義為 offensive or vulgar language，包括 swearing、derogatory slurs、insult-based humor 等；infrequent/mild profanity 可能提高評級，frequent/intense profanity 會進一步提高評級。([Apple Developer][2])

---

## 4. Product Goal

### 4.1 目標

「麻煩友」應達成：

* 讓 app 有香港本地化特色。
* 令導拍 / 相片顧問不再像普通 AI chatbot。
* 代表一個固執、很煩、但真心想你張相靚的人。
* 增加 personality、幽默感、記憶點。
* 提升品牌差異化。
* 支援不同用戶接受程度：Neutral、繁中、簡中、English、廣東話 / 麻煩友。
* 不讓 camera core UX 變得冒犯或分心。
* 不攻擊用戶本人、被拍攝者、外貌、身體、身份。

### 4.2 麻煩友不是

```text
bullying mode
insult mode
beauty judge
body judge
identity judge
hate speech generator
random profanity generator
AI chat assistant
```

### 4.3 產品設計一句話

```text
麻煩友係一個嘴賤少少但有用嘅本機相機教練，目標係幫你影好啲，而唔係笑你或者笑被拍嘅人。
```

---

## 5. Language Mode Taxonomy

設定頁可顯示語言：

```text
English
繁體中文
简体中文
廣東話
```

其中「廣東話」是麻煩友 mode 的主要入口，但內部 tone 應再分級。

### 5.1 Tone levels

| Level   | 名稱                       | 說明             | 例子                      | Default suitability |
| ------- | ------------------------ | -------------- | ----------------------- | ------------------- |
| Level 0 | Neutral                  | 乾淨、友善、清楚       | `頭頂空間有點多，鏡頭稍微向下。`       | ✅ 預設                |
| Level 1 | Hong Kong Conversational | 廣東話 / 香港口語，無粗口 | `個頭頂位有啲多，鏡頭落返少少會靚啲。`    | ✅ 可作廣東話預設           |
| Level 2 | 麻煩友                      | 有挑剔感、吐槽、無人身攻擊  | `頭頂留咁多位做展覽咩？落返少少啦。`     | ✅ 可 opt-in          |
| Level 3 | 麻煩友 + 粗口                 | 明確 opt-in，受控粗口 | `屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。` | ⚠️ 後期               |

### 5.2 每級分析

| Level             | User acceptance | App Store risk | Brand value | Localization cost | QA difficulty |
| ----------------- | --------------: | -------------: | ----------: | ----------------: | ------------: |
| Neutral           |              最高 |             最低 |           低 |                 低 |             低 |
| HK Conversational |               高 |              低 |          中高 |                 中 |             中 |
| 麻煩友               |              中高 |              中 |           高 |                中高 |            中高 |
| 麻煩友 + 粗口          |              分眾 |            中至高 |      很高但有爭議 |                 高 |             高 |

建議：

```text
MVP：Level 0 + Level 1 + Level 2
Explicit phase：Level 3 only after age rating / App Review / QA review
```

---

## 6. Hong Kong / 麻煩友 Tone Definition

### 6.1 Personality

麻煩友 personality：

* 煩。
* 固執。
* 對相片很有要求。
* 快、短、直接。
* 有香港口語節奏。
* 有幽默感。
* 不是惡意。
* 不侮辱人。
* 不評價美醜。
* 不評價身材。
* 不評價年齡、性別、種族、殘疾。
* 不用身份特徵作笑點。
* 看到用戶修正後會讚。

### 6.2 Tone pillars

1. **Direct but useful**
   直接指出問題，但給下一步。

2. **Annoying but caring**
   煩，但出發點是幫你影好啲。

3. **Funny but not cruel**
   可以吐槽，但不能惡毒。

4. **Photo-focused, not person-focused**
   只講光線、構圖、手震、距離、filter、crop。

5. **Action-oriented**
   每句都應可行動。

6. **Short and camera-friendly**
   live camera chip 只顯示一句。

7. **Correct once, then praise**
   做錯提醒一次，做返對要讚。

### 6.3 應該講

```text
光線
構圖
頭頂空間
背景太亂
手震
filter 選擇
鏡頭距離
pose overlay alignment
crop suggestion
retake suggestion
```

### 6.4 不應該講

```text
你醜
你肥
你老
你似某性別 / 種族 / 身份
你皮膚差
你身材差
你唔識影相到人身攻擊程度
protected class insult
mental health insult
sexual comment
```

---

## 7. Profanity Policy

### 7.1 粗口是否應該加入？

可以加入，但不應是 MVP 核心，不應是預設，不應當作賣點主軸。粗口應是 **受控 personality layer**，不是功能本身。

### 7.2 Policy

```text
default off
explicit opt-in only
二次確認
preview examples before enable
user can disable anytime
no profanity in system notifications
no profanity in widgets
no profanity in App Store screenshots
no profanity in default onboarding
no profanity in consent / privacy / legal copy
no profanity toward protected traits
no sexual profanity
no sexual body-part profanity
no threats
no slurs
no hate speech
no harassment
primarily allow only「屌」as Cantonese tone marker
no sexualized insults
no repeated profanity spam
```

Apple age rating system 明確把 profanity / crude humor 納入 rating 判斷；infrequent or mild profanity 可令 app 不再是 4+，frequent or intense profanity 會提升到更高 rating。([Apple Developer][2]) 所以 explicit mode 必須先做 age rating review，而不是當普通 localization 處理。

### 7.3 Allowed examples

允許方向：

```text
屌，手震到咁，定一定先撳啦。
屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。
屌，個光死咗，行近窗邊啦。
```

原因：target 是拍攝操作 / 畫面狀態；沒有攻擊身份、外貌、身體、被拍攝者。

### 7.4 Disallowed examples

不允許：

```text
你條廢物識唔識影相？
你個樣咁樣影都冇用。
你肥到點影都唔靚。
你老到點影都冇用。
你有病呀？
```

原因：

* 人身攻擊。
* 外貌羞辱。
* body shaming。
* age shaming。
* mental health insult。
* 不是攝影建議。
* 可能構成 bullying / harassment。

Apple Guidelines 對 offensive、mean-spirited、discriminatory content 特別敏感；如果 copy 可能羞辱、恐嚇或傷害個人或群體，審核風險會上升。([Apple Developer][1])

---

## 8. Safety Boundaries

### 8.1 Must never target

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

### 8.2 Must never include

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
```

OpenAI policies are only relevant if future AI-generated copy is introduced, but they are useful as safety reference: they prohibit threats, harassment, defamation, hate-based violence, non-consensual intimate content, sensitive trait inference, and body/appearance shaming of minors. ([OpenAI][3])

### 8.3 Safe targets

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

### 8.4 Safe rewrite examples

| Bad          | Safe Neutral         | Safe 麻煩友                   |
| ------------ | -------------------- | -------------------------- |
| `你個樣太暗沉。`    | `主體光線有點暗，可以靠近窗邊。`    | `個光死咗，行近窗邊會醒神好多。`          |
| `你肥，唔好影側面。`  | `呢個角度背景有點亂，轉少少會乾淨啲。` | `個背景搶晒鏡，轉少少啦。`             |
| `你影得好廢。`     | `構圖未到位，鏡頭稍微向下。`      | `構圖未到位，鏡頭落返少少先啦。`          |
| `屌，呢張相影到咁差。` | `呢張差少少穩定度，下次等定啲先撳。`  | `呢張係心急咗少少，下次定一定會 sharp 啲。` |

---

## 9. Context-based Tone Rules

| Feature Context           |             Tone strength |     Profanity allowed? | Rules                                      |
| ------------------------- | ------------------------: | ---------------------: | ------------------------------------------ |
| Local Camera Coach        |                       最直接 | Level 3 only if opt-in | 只講拍攝操作；同一問題一次；修正後讚                         |
| Photo Advisor             |                         中 |                    不建議 | 拍後不粗口批評；建議、鼓勵、下一步                          |
| Filter Lab                |                        中低 |                    不需要 | 有品牌感、幽默，但不 offensive                       |
| 改圖師                       |                        中低 |                     不應 | prompt guard / privacy / rejection neutral |
| Privacy / Consent / Legal |              neutral only |                     不可 | 清楚、正式、可信                                   |
| Notifications / Widgets   |              neutral only |                     不可 | 避免 public context 尷尬                       |
| App Store screenshots     | neutral / HK non-explicit |                     不可 | metadata 要適合 all audiences                 |

Apple metadata guidelines say screenshots and previews should accurately reflect the app, age rating questions must be answered honestly, and metadata should be appropriate for all audiences even if the app is rated higher. ([Apple Developer][1])

---

## 10. Positive Feedback Loop: 講一次就好，做返對就讚

### 10.1 UX principle

麻煩友如果只會鬧，就會變 bullying。完整 loop 必須是：

```text
Issue detected
→ show one direct suggestion
→ cooldown
→ user fixes issue
→ show praise
→ praise cooldown
```

### 10.2 Rules

```text
same issue cooldown
same category cooldown
no repeated profanity spam
max one strong warning per issue window
if user ignores suggestion, do not spam
if issue resolves, praise once
if issue returns, wait before repeating
quiet mode suppresses praise or lowers frequency
praise should not block shutter
```

### 10.3 Examples

#### Headroom

Issue:

```text
頭頂留咁多位做展覽咩？落返少少啦。
```

Fixed:

```text
係，呢個位順眼好多。
```

Explicit issue:

```text
屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。
```

Fixed:

```text
係啦，順眼返好多。
```

#### Shake

Issue:

```text
唔好震啦，定一定先撳。
```

Explicit issue:

```text
屌，手震到咁，定一定先撳啦。
```

Fixed:

```text
係啦，穩好多，撳啦。
```

#### Low light

Issue:

```text
個光死咗，行近窗邊啦。
```

Fixed:

```text
啱啦，呢個光醒神好多。
```

### 10.4 Architecture implication

`GuidanceIssueMemory` 應保存最近 issue state：

```swift
struct GuidanceIssueMemory {
    var lastIssueId: String?
    var lastShownAt: Date?
    var lastResolvedAt: Date?
    var cooldownUntil: Date?
    var hasPraisedResolution: Bool
}
```

State transition：

```text
notDetected
→ detected
→ shownOnce
→ coolingDown
→ resolved
→ praised
→ idle
```

---

## 11. UX Design

### 11.1 Entry points

```text
Settings → Language / Voice
Settings → 廣東話 / 麻煩友
Camera guidance chip
Photo Advisor result
Onboarding later, but default must not be profanity
```

### 11.2 Enable flow

```text
1. 用戶進入 Settings
2. 選擇「語言」
3. 選擇 English / 繁體中文 / 简体中文 / 廣東話
4. 如果選廣東話，再選：
   - 香港口語
   - 麻煩友
   - 麻煩友（粗口）
5. 若選粗口，顯示二次確認
6. 顯示 preview examples
7. 顯示 safety notice
8. 用戶確認
9. 可隨時關閉 / 改回標準語氣
```

### 11.3 UX requirements

```text
Default Neutral
no forced profanity
no surprise profanity
no profanity in public contexts
no profanity in cloud AI consent
VoiceOver should not unexpectedly read profanity unless opted in
parental / age rating concern
quick disable button
quiet mode
simple segmented control
post-capture no profanity criticism
```

### 11.4 Settings copy

```text
語言
語氣
標準
繁體中文
简体中文
English
廣東話
香港口語
麻煩友
麻煩友（粗口）
```

Explicit notice:

```text
此模式包含較強香港口語和受控粗口，只會在 app 內拍攝提示使用。
只會針對拍攝操作，不會評論樣貌、身材或身份。
你可以隨時關閉。
```

Short version:

```text
麻煩友只鬧拍攝，唔鬧人。可以隨時熄。
```

---

## 12. Copywriting System

### 12.1 Style rules

```text
short
action-oriented
photo-specific
no personal attack
no sensitive inference
no body/beauty judgment
no long explanation inside camera screen
no AI jargon
no repeated scolding
praise when fixed
```

### 12.2 Template categories

Below are template examples. MVP should store them as deterministic localization strings, not live-generated LLM text.

#### Lighting

| Tone              | Examples                                                 |
| ----------------- | -------------------------------------------------------- |
| Neutral           | `光線有點暗，可以靠近窗邊。` / `高光有點強，可以避開直射光。` / `光暗差有點大，換個柔和位置會好啲。` |
| HK conversational | `個光有啲暗，行近窗邊啦。` / `高光有啲爆，避開直射光會舒服啲。` / `光暗差太大，轉少少位啦。`     |
| 麻煩友               | `個光死咗，行近窗邊啦。` / `高光爆到搶鏡，避一避啦。` / `呢個光咁硬，轉個位啦。`           |
| 麻煩友 + 粗口          | `屌，個光死咗，行近窗邊啦。` / `屌，高光爆晒，避開直射光啦。` / `屌，呢個光硬到咁，轉位啦。`     |
| Praise            | `啱啦，呢個光醒神好多。` / `係，光線順眼返。` / `好，呢個位舒服好多。`                |

#### Framing

| Tone              | Examples                                              |
| ----------------- | ----------------------------------------------------- |
| Neutral           | `主體可以再靠中間少少。` / `畫面左邊有點空，可以微調角度。` / `構圖差少少，鏡頭移右一點。`   |
| HK conversational | `主體偏咗少少，移返中間啦。` / `左邊空咗啲，轉少少角度。` / `鏡頭移右少少會順眼啲。`      |
| 麻煩友               | `主體走咗位喎，拉返中間啦。` / `左邊空到咁，轉少少啦。` / `構圖未到位，移右少少先啦。`     |
| 麻煩友 + 粗口          | `屌，主體走晒位，拉返中間啦。` / `屌，左邊空咁多做乜？轉少少啦。` / `屌，構圖差少少，移右啦。` |
| Praise            | `係，呢個構圖順眼好多。` / `好，主體清楚返。` / `啱啦，呢個位穩陣。`              |

#### Headroom

| Tone              | Examples                                                       |
| ----------------- | -------------------------------------------------------------- |
| Neutral           | `頭頂空間有點多，鏡頭稍微向下。` / `頭頂留少一點，主體會更集中。` / `鏡頭向下少少會自然啲。`           |
| HK conversational | `個頭頂位有啲多，鏡頭落返少少。` / `頭頂唔使留咁多，落少少啦。` / `落返少少，主體會集中啲。`           |
| 麻煩友               | `頭頂留咁多位做展覽咩？落返少少啦。` / `個頭頂位太闊喇，鏡頭落返啲。` / `留咁多天花冇著數，落少少啦。`      |
| 麻煩友 + 粗口          | `屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。` / `屌，天花搶晒鏡，落返啲啦。` / `屌，唔使留咁多頭頂位，落少少啦。` |
| Praise            | `係，呢個位順眼好多。` / `好，頭頂位啱啱好。` / `啱啦，主體集中返。`                       |

#### Stability

| Tone              | Examples                                        |
| ----------------- | ----------------------------------------------- |
| Neutral           | `有點手震，等穩定一點再拍。` / `畫面穩定了，可以拍。` / `夜景容易震，定一定先撳。` |
| HK conversational | `有少少震，定一定先撳。` / `畫面穩喇，可以拍。` / `夜晚唔好急，穩啲先。`      |
| 麻煩友               | `唔好震啦，定一定先撳。` / `而家穩好多，撳啦。` / `夜晚咁暗，唔好心急啦。`     |
| 麻煩友 + 粗口          | `屌，手震到咁，定一定先撳啦。` / `屌，唔好急，穩咗先影。` / `屌，夜景咁震會糊㗎。` |
| Praise            | `係啦，穩好多，撳啦。` / `好，畫面定返。` / `啱啦，呢下穩。`            |

#### Background clutter

| Tone              | Examples                                               |
| ----------------- | ------------------------------------------------------ |
| Neutral           | `背景有點亂，可以靠近主體。` / `右邊有雜物，可以轉少少角度。` / `背景太搶眼，主體可以再近一點。` |
| HK conversational | `背景有啲亂，行近少少啦。` / `右邊啲嘢搶鏡，轉少少。` / `背景太多嘢，近啲會乾淨啲。`       |
| 麻煩友               | `背景亂到搶晒鏡，行近少少啦。` / `右邊嗰堆嘢好煩，轉少少啦。` / `主體太遠，背景贏晒喎。`     |
| 麻煩友 + 粗口          | `屌，背景亂到咁，行近少少啦。` / `屌，右邊嗰堆嘢搶晒鏡，轉啦。` / `屌，背景贏晒，近返啲啦。`   |
| Praise            | `係，背景乾淨好多。` / `好，主體突出返。` / `啱啦，冇咁亂。`                   |

#### Distance

| Tone              | Examples                                           |
| ----------------- | -------------------------------------------------- |
| Neutral           | `主體有點遠，可以行近一點。` / `退後少少，背景會完整啲。` / `距離啱啱好，可以拍。`    |
| HK conversational | `主體有啲遠，行近少少啦。` / `退後少少，背景會入得靚啲。` / `呢個距離啱喇。`       |
| 麻煩友               | `企咁遠做乜？行近少少啦。` / `太貼喇，退後少少先。` / `呢個距離唔差，撳啦。`       |
| 麻煩友 + 粗口          | `屌，企咁遠影空氣咩？行近啲啦。` / `屌，太貼喇，退後少少。` / `屌，呢個距離啱喇，撳啦。` |
| Praise            | `係，距離啱好多。` / `好，主體清楚返。` / `啱啦，唔遠唔近。`               |

#### Filter suggestion

| Tone              | Examples                                                                  |
| ----------------- | ------------------------------------------------------------------------- |
| Neutral           | `這個光線適合暖色底片。` / `夜景可以試 Amber Night。` / `街拍感可以試 Street Chrome。`            |
| HK conversational | `呢個光幾啱暖色底片。` / `夜景試下 Amber Night 啦。` / `街拍味可以試 Street Chrome。`            |
| 麻煩友               | `呢個光唔好浪費，轉暖色底片啦。` / `夜景仲用咁淡？試 Amber Night 啦。` / `呢個街拍位，Street Chrome 啱晒。` |
| 麻煩友 + 粗口          | `屌，呢個光唔轉暖色底片好嘥。` / `屌，夜景試 Amber Night 啦。` / `屌，呢個位 Street Chrome 啱晒。`     |
| Praise            | `係，呢個 filter 夾好多。` / `好，個 mood 出返嚟。` / `啱啦，呢個色順眼。`                        |

#### Pose overlay

| Tone              | Examples                                                        |
| ----------------- | --------------------------------------------------------------- |
| Neutral           | `對齊 pose 線條會自然一點。` / `主體可以再靠近 overlay。` / `手部位置可以跟線條微調。`        |
| HK conversational | `跟返條 pose 線會自然啲。` / `主體近返 overlay 少少。` / `手位跟返少少會順眼啲。`          |
| 麻煩友               | `條 pose 線喺度㗎，跟返少少啦。` / `人同 overlay 分咗家，拉近返啲。` / `手位差少少，跟返條線啦。`  |
| 麻煩友 + 粗口          | `屌，條 pose 線喺度，跟返少少啦。` / `屌，overlay 同人分咗家，拉近啲。` / `屌，手位差少少，跟線啦。` |
| Praise            | `係，pose 順眼好多。` / `好，對齊返。` / `啱啦，姿勢自然好多。`                        |

#### Retake

| Tone              | Examples                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| Neutral           | `可以保留這張，再試多一張。` / `如果想更自然，可以退後少少再拍。` / `光線有點硬，可以換個位置再試。`                |
| HK conversational | `呢張可以留，再試多張啦。` / `想自然啲，退後少少再拍。` / `個光有啲硬，換位再試啦。`                        |
| 麻煩友               | `呢張唔差，但可以再試多張。` / `想靚啲就退後少少再嚟。` / `個光太硬，唔好死撐，換位啦。`                      |
| 麻煩友 + 粗口          | Live only: `屌，唔好心急，退後少少再嚟。` / Post-capture explicit should not be used. |
| Praise            | `好，第二張自然好多。` / `係，呢個光順眼啲。` / `啱啦，重拍有用。`                                 |

#### Crop

| Tone              | Examples                                             |
| ----------------- | ---------------------------------------------------- |
| Neutral           | `可以裁走右邊少少空白。` / `保留上方天空，畫面會更有旅行感。` / `試 4:5，主體會更集中。` |
| HK conversational | `右邊可以裁少少。` / `上面天空留返，會有旅行感。` / `試下 4:5，主體集中啲。`       |
| 麻煩友               | `右邊空咁多，裁少少啦。` / `天空幾靚，唔好裁走晒。` / `4:5 會集中啲，唔好咁散。`     |
| 麻煩友 + 粗口          | Post-capture 不建議粗口；可用 non-explicit 麻煩友。              |
| Praise            | `係，裁完集中好多。` / `好，畫面乾淨返。` / `啱啦，主體突出返。`               |

#### Advisor result / Image editing suggestion

| Tone              | Examples                                                   |
| ----------------- | ---------------------------------------------------------- |
| Neutral           | `這張相有暖光感，可以試柔和復古濾鏡。` / `主體有點暗，可以稍微提亮。` / `背景有點搶眼，可以柔化一點。`  |
| HK conversational | `呢張有暖光 feel，可以試柔和復古色。` / `主體暗咗少少，可以提亮啲。` / `背景搶咗少少，可以柔返啲。` |
| 麻煩友               | `呢張有得救，暖色復古會幾啱。` / `主體暗咗，提亮少少先似樣。` / `背景有啲搶鏡，柔返少少啦。`       |
| 麻煩友 + 粗口          | 不建議 post-capture 粗口批評。                                     |
| Praise            | `好，呢個方向啱張相。` / `係，改完自然好多。` / `啱啦，個 mood 出返嚟。`              |

### 12.3 Banned phrase list

```text
你醜
你肥
你老
你皮膚差
你樣衰
你個樣唔得
你條廢物
你有病
你弱智
任何 protected class insult
sexual comments
slurs
repeated aggressive profanity
sexual body-part profanity
mental health insult
body shape insult
age insult
gender insult
race / ethnicity insult
```

### 12.4 Safer alternatives

| Banned / unsafe | Safer alternative  |
| --------------- | ------------------ |
| `你醜`            | `光線可以柔和一點，主體會自然啲。` |
| `你肥`            | `鏡頭角度轉少少，背景會乾淨啲。`  |
| `你老`            | `用柔和暖色會自然啲。`       |
| `你樣衰`           | `呢個角度未夠自然，轉少少試下。`  |
| `你影得廢`          | `構圖未到位，鏡頭落返少少。`    |
| `你有病`           | `唔好咁心急，穩定啲先撳。`     |

---

## 13. Feature Integration

### 13.1 Local Camera Coach

* 本機導拍 chip 根據 language / tone mode 選 copy。
* 不用 cloud。
* deterministic templates。
* 不應用 LLM 即時生成粗口。
* Level 3 粗口只可 live camera coach 使用。
* issue resolved 後顯示 praise。

### 13.2 Photo Advisor

* Result summary 可根據 tone mode 變化。
* 拍攝後不作粗口批評。
* mock / cloud advisor structured data 不應直接生成任意粗口。
* Safe structured result → localized template。

### 13.3 Filter Lab

* Generated filter result copy 可以有 brand tone。
* 不需要粗口。
* 用「呢個色幾有港式夜景味」這類 brand copy。

### 13.4 改圖師

* Prompt guard copy 可用香港口語。
* Rejection / privacy / consent 保持 neutral。
* 不用粗口拒絕用戶，避免 escalation。

### 13.5 AI wording reduction

| Old                 | Suggested         |
| ------------------- | ----------------- |
| AI Advisor          | 相片顧問 / 麻煩友        |
| AI Snapshot         | 快速建議 / 麻煩友看看      |
| AI Filter Generator | Filter Lab / 專屬濾鏡 |
| AI Edit             | 改圖師 / 相片改造        |
| AI Guidance         | 本機導拍 / 相機教練       |
| AI Agent            | 打工仔 / 麻煩友         |

Privacy / consent exception：

```text
「這會使用雲端 AI / 第三方 AI 服務分析或改圖」
```

---

## 14. Localization Architecture

Apple localization guidance says iOS/iPadOS users can choose an app-specific language independent of device language; Apple also recommends internationalizing app UI, separating user-visible text, using String Catalogs, and providing context to translators. ([Apple Developer][4]) This supports a structured copy system rather than hardcoded phrases.

### 14.1 Modes

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
```

### 14.2 Key structure

```text
guidance.lighting.dark.neutral
guidance.lighting.dark.zh_hant
guidance.lighting.dark.zh_hans
guidance.lighting.dark.hk
guidance.lighting.dark.troublemaker
guidance.lighting.dark.troublemaker_explicit
guidance.lighting.dark.praise

guidance.headroom.too_much.neutral
guidance.headroom.too_much.hk
guidance.headroom.too_much.troublemaker
guidance.headroom.too_much.troublemaker_explicit
guidance.headroom.too_much.praise

advisor.summary.warm_light.neutral
advisor.summary.warm_light.hk
advisor.summary.warm_light.troublemaker

privacy.cloud_ai.consent.neutral
```

### 14.3 Fallback rules

```text
explicit mode keys separated
explicit copy not used unless explicit setting enabled
explicit copy only valid for live camera coach contexts
post-capture no profanity criticism
consent / privacy copy always neutral
App Store screenshots use neutral / HK non-explicit only
fallback to neutral if explicit key missing
never fallback from neutral to explicit
never fallback from post-capture to live explicit copy
```

### 14.4 Deterministic phrase selection

```text
category + severity + language + tone + feature context
→ SafetyCopyPolicy
→ ContextToneRule
→ LocalizationKey
→ localized template
→ fallback if missing
```

### 14.5 QA localization

Apple recommends native speaker testing when using machine translation, creating guides with character personalities, jokes, glossary, screenshots, and testing for clipping/truncation/layout issues. ([Apple Developer][4]) For 麻煩友, native HK speaker review is mandatory.

---

## 15. Free vs Paid Policy

### 15.1 Recommended free

```text
Neutral
繁體中文
简体中文
English
廣東話 / 香港口語
basic 麻煩友 non-explicit
```

Reason: basic localization and core personality should help acquisition and brand differentiation, not be hidden behind paywall.

### 15.2 Possible paid

```text
premium personality packs
advanced 麻煩友 packs
seasonal copy
creator voice packs
custom tone presets
more advisor styles
```

### 15.3 Caution

```text
不要把基本 localization paywall
不要用粗口作主要付費誘因
付費不應等於更 offensive
profane copy 不適合作 App Store / subscription marketing headline
```

Best recommendation:

```text
HK conversational + basic 麻煩友 = free
Advanced personality packs = optional paid later
Explicit profanity = safety/age-gated setting, not main paid value
```

---

## 16. App Store / Legal / Brand Risk

### 16.1 App Store risks

| Area                  | Risk                                            | Source / implication                                                                                      |
| --------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Objectionable content | offensive / mean-spirited / discriminatory copy | Apple 1.1 prohibits offensive, insensitive, discriminatory, mean-spirited content. ([Apple Developer][1]) |
| Profanity             | age rating changes                              | Apple age rating includes profanity / crude humor. ([Apple Developer][2])                                 |
| Metadata              | screenshots with explicit copy                  | Metadata must be accurate and appropriate for all audiences. ([Apple Developer][1])                       |
| Kids / minors         | if targeting younger users                      | Kids Category has stricter privacy and content rules. ([Apple Developer][1])                              |
| AI-generated copy     | unsafe output                                   | Future AI text requires moderation / red-teaming / constrained output. ([OpenAI 開發者][5])                  |
| Privacy copy          | inappropriate tone                              | Privacy policy / consent must be clear and explicit. ([Apple Developer][1])                               |

### 16.2 Explicit recommendations

```text
Do not show profanity in App Store listing screenshots.
Do not enable profanity by default.
Do not use profanity in push notifications.
Do not use profanity in widgets.
Do not use profanity in consent / privacy / legal copy.
If app targets younger users, avoid explicit mode or age gate.
Keep explicit mode local and template-based first.
Avoid other sexual body-part profanity beyond the limited approved marker.
Avoid slurs / hate / threats completely.
```

---

## 17. Moderation / QA Strategy

### 17.1 Static template QA

```text
every phrase reviewed manually
banned phrase scan
sensitive category scan
App Store screenshot review
VoiceOver test
native HK speaker review
context test for live camera guidance
post-capture no profanity criticism check
praise after fix check
fallback test
```

### 17.2 AI-generated copy — future only

OpenAI safety best practices recommend moderation, adversarial testing / red-teaming, prompt engineering to constrain topic and tone, limiting inputs/outputs, and returning outputs from validated backend sets where possible. ([OpenAI 開發者][5]) For this app, that means:

```text
no arbitrary profanity generation
prompt guard
output moderation
allowed tone style guide
template mapping preferred
fallback to neutral copy
logging without sensitive photo data
```

### 17.3 QA test matrix

```text
language mode off
zh-Hant
zh-Hans
English
HK conversational
troublemaker
explicit troublemaker
permission denied
camera unavailable
child / family photo context
face detected
no face
low light
body / pose overlay
rejection copy
cloud AI consent copy
post-capture advisor
VoiceOver
issue fixed praise state
explicit key missing fallback
neutral fallback
public context notification
```

---

## 18. Technical Architecture Proposal

### 18.1 Components

```text
LanguageMode
ToneMode
ProfanityMode
GuidanceCopyTemplate
GuidanceCopyResolver
SafetyCopyPolicy
ContextToneRule
LocalizationKeyBuilder
CameraCoachCopyProvider
PhotoAdvisorCopyProvider
FilterLabCopyProvider
ImageEditingCopyProvider
GuidanceIssueMemory
GuidancePraiseResolver
```

### 18.2 Resolver flow

```text
Guidance category + severity + locale + tone setting + feature context
→ SafetyCopyPolicy
→ ContextToneRule
→ LocalizationKey
→ localized template
→ fallback if missing
```

### 18.3 Praise flow

```text
Issue detected
→ show guidance once
→ cooldown
→ issue resolved
→ show praise template
→ praise cooldown
```

### 18.4 Safety policy concept

```swift
struct SafetyCopyPolicy {
    func allowsExplicitCopy(
        featureContext: FeatureContext,
        toneMode: ToneMode,
        userOptedIn: Bool,
        isPublicContext: Bool
    ) -> Bool {
        guard userOptedIn else { return false }
        guard toneMode == .troublemakerExplicit else { return false }
        guard featureContext == .liveCameraCoach else { return false }
        guard !isPublicContext else { return false }
        return true
    }
}
```

### 18.5 Context restrictions

```text
no LLM required for camera live copy
deterministic templates first
explicit mode behind setting
copy fallback to neutral
privacy/consent always neutral
post-capture no profanity criticism
no persistence beyond user setting, unless later approved
if setting persists, use app settings storage only
```

---

## 19. MVP / Future Phase Plan

### HK1 — Research / Product Policy

```text
current research
no implementation
define safety boundary
define brand tone
define App Store risk
```

### HK2 — Copy System / Style Guide

```text
documentation only
phrase bank
banned phrase list
localization key plan
praise loop design
no app changes
```

### HK3 — Mock Language Mode UI

```text
Settings mock only
no persistence or temporary in-memory setting only
neutral / HK / troublemaker examples
explicit mode hidden or debug only until reviewed
```

### HK4 — Deterministic Template Integration

```text
local camera coach uses copy resolver
no LLM
no cloud
no dynamic profanity
issue resolved praise state
tests for no banned phrases in neutral / post-capture
```

### HK5 — Explicit Opt-in Mode

```text
only after review
confirmation screen
age rating review
manual QA
no App Store screenshot profanity
only live camera coach contexts
```

### HK6 — Advanced Personality Packs

```text
optional paid packs
seasonal copy
creator collaboration
still template-based
paid does not mean more offensive
```

### HK7 — AI-generated Tone, Future

```text
only if prompt guard / moderation mature
fallback to templates
no live camera cloud dependency
no arbitrary profanity generation
```

---

## 20. Risk Table

| Risk                                   | Impact              | Mitigation                                                     |
| -------------------------------------- | ------------------- | -------------------------------------------------------------- |
| App Store rejection                    | 延遲上架 / 被拒           | no explicit default; metadata clean; review notes explain mode |
| age rating issue                       | 分級提高                | honest age rating; explicit mode reviewed before release       |
| user offended                          | 差評 / 投訴             | opt-in; preview; easy disable                                  |
| bullying perception                    | 品牌受損                | 鬧拍攝，不鬧人；praise loop                                            |
| body shaming accidental wording        | 高風險                 | banned phrase scan; manual review                              |
| protected class insult                 | 高風險                 | never reference protected traits                               |
| profanity appearing in public          | 尷尬 / 投訴             | no profanity in notifications/widgets/screenshots              |
| VoiceOver reads profanity unexpectedly | accessibility harm  | VoiceOver test; opt-in warning                                 |
| mistranslation                         | 語氣錯位                | native HK speaker QA                                           |
| social media backlash                  | 品牌風險                | non-explicit marketing; clear opt-in                           |
| brand too niche                        | 非香港用戶疏離             | Neutral / English / zh-Hant remain available                   |
| overuse becomes annoying               | churn               | cooldown; quiet mode; one issue at a time                      |
| AI-generated unsafe copy               | 高風險                 | no AI-generated copy in MVP; template only                     |
| localization key fallback bug          | explicit copy leak  | never fallback to explicit; automated tests                    |
| explicit mode accidentally enabled     | 投訴 / review risk    | default off; two-step confirmation                             |
| support burden                         | 增加客服                | clear settings, report issue                                   |
| children / family use case             | age rating / safety | avoid explicit if targeting minors                             |
| repeated scolding                      | bullying perception | same issue cooldown                                            |
| failure to praise after correction     | 麻煩友只剩負面             | issue memory + praise resolver                                 |
| post-capture profanity criticism       | 用戶受辱                | context rule: no post-capture profanity                        |
| consent copy too casual                | privacy trust issue | privacy/legal always neutral                                   |

---

## 21. Final Recommendation

清楚建議：

1. **先不要實作 explicit profanity。**
   先做 copy policy、phrase bank、banned phrase list。

2. **MVP 可先做 HK conversational + non-explicit 麻煩友。**
   這已足夠形成本地化品牌特色，而且 App Store 風險低很多。

3. **廣東話 mode 可以是主要入口。**
   但廣東話不等於粗口；內部分 HK conversational / 麻煩友 / 麻煩友 explicit。

4. **粗口 mode 必須 opt-in、default off、二次確認。**
   必須有 preview examples 和一鍵關閉。

5. **粗口主要限於「屌」作語氣助詞。**
   不使用其他性部位詞語、性侮辱、slur、威脅、hate speech、人身侮辱。

6. **Live camera guidance 可以較直接，但同一問題講一次就好。**
   用戶做返對時要讚。

7. **拍攝後不作粗口批評。**
   Photo Advisor 可保持香港口語，但不應「屌，呢張相影到咁差」。

8. **Privacy / consent / safety / rejection copy 應保持 neutral。**
   這些是信任與合規場景，不適合 persona。

9. **User-facing UI 應少用 AI，但 technical consent 必須清楚講 cloud AI。**
   「本機導拍 / 相片顧問 / 改圖師」可以作品牌名；但 cloud upload 必須清楚披露。

10. **麻煩友應批評拍攝行為 / 照片狀態，不批評人。**

最安全 implementation path：

```text
1. research
2. style guide
3. mock setting
4. deterministic template integration
5. explicit mode only after App Store / age rating review
```

### 下一個 Codex planning prompt

```text
Create HK2 — Hong Kong / 麻煩友 Copy System + Safety Style Guide.

Scope:
- Documentation and fixtures only.
- No runtime language mode implementation yet.
- No explicit profanity in production.
- No LLM-generated copy.
- No cloud AI.
- No StoreKit.
- No persistence change.

Deliverables:
- Define AppLanguageMode: english, traditionalChinese, simplifiedChinese, cantonese
- Define ToneMode: neutral, hongKongConversational, troublemaker, troublemakerExplicit
- Define context rules:
  liveCameraCoach can use direct tone
  photoAdvisor cannot use profanity criticism
  privacy/consent/legal always neutral
- Create phrase bank for:
  lighting, framing, headroom, stability, background, distance, filter, poseOverlay, retake, crop, praise
- Create banned phrase list:
  appearance/body/age/gender/race/religion/disability/mental-health/sexual insults
- Create safe rewrite table
- Create localization key plan
- Create issue memory + praise loop design
- Add QA checklist:
  no banned phrases
  no explicit fallback
  no post-capture profanity
  VoiceOver test
  App Store screenshot safe examples
```

---

## 22. Sources / Links

1. Apple App Review Guidelines — Safety, objectionable content, user-generated content, privacy, metadata, data minimization. ([Apple Developer][1])
2. Apple App Store Connect Age Ratings — profanity / crude humor definition and rating implications. ([Apple Developer][2])
3. Apple App Store metadata rules — screenshots, previews, accurate metadata, all-audience metadata expectation. ([Apple Developer][1])
4. Apple Localization — app-specific language, String Catalogs, cultural relevance, native-speaker QA, localization testing. ([Apple Developer][4])
5. OpenAI Usage Policies — relevant only for future AI-generated copy: harassment, privacy, sensitive traits, minors, body/appearance shaming. ([OpenAI][3])
6. OpenAI Safety Best Practices — relevant only for future AI-generated copy: moderation, red-teaming, prompt engineering, constrained outputs, reporting. ([OpenAI 開發者][5])
7. Project context — previous Cloud AI Backend Boundary report, used here for continuity on no live cloud AI, backend-mediated cloud features, and post-capture AI boundary. 

[1]: https://developer.apple.com/app-store/review/guidelines/ "App Review Guidelines - Apple Developer"
[2]: https://developer.apple.com/help/app-store-connect/reference/age-ratings/ "Age ratings values and definitions - App information - Reference - App Store Connect - Help - Apple Developer"
[3]: https://openai.com/policies/usage-policies/ "Usage policies | OpenAI"
[4]: https://developer.apple.com/localization/ "Localization - Apple Developer"
[5]: https://developers.openai.com/api/docs/guides/safety-best-practices "Safety best practices | OpenAI API"
