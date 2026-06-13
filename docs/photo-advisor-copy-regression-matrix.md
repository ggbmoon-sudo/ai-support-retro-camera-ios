# Photo Advisor Copy Regression Matrix

Phase 18-A5 adds this matrix as a repeatable local/mock Photo Advisor copy QA kit.

The QA goal is to keep the app-owned Photo Advisor voice consistent across English, Traditional Chinese, Cantonese-style Traditional Chinese, and Simplified Chinese key variants already present in the existing localization files.

Phase 18-B0 adds `docs/photo-advisor-provider-language-contract.md`, which makes the backend/provider contract downstream of the same copy regression rules. Real provider output must satisfy this matrix before it can be considered for production rollout.

The card should follow:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

It must not regress into:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

No real photos, screenshots, generated reports, provider responses, raw capture context, raw EXIF, raw sensor values, or device-specific QA artifacts should be committed for this matrix.

## UI Copy Length Guidelines

These are review guidelines, not strict parser limits:

- Mood headline: very short.
- Visual reason: one short sentence.
- Filter reason: one short sentence with photo signal + retro aesthetic result.
- Optional refinement: one short sentence.
- Retake advice: one optional sentence, only for likely severe technical risk.
- Fallback copy: one calm sentence.

If a localized sentence needs more length to sound natural, prefer natural language over brittle character limits, but keep it suitable for the compact result card.

## Language QA Notes

English:

- Short, natural, practical.
- Avoid generic AI wording and over-technical critique.
- Prefer "for a cleaner look..." over correction commands.

Traditional Chinese:

- Use natural Traditional Chinese.
- Keep 攝影 / 菲林 / 氣氛 / 畫面 wording natural.
- Avoid overly Mainland phrasing when the selected language is Traditional Chinese.

Cantonese-style:

- Natural written Cantonese where supported.
- Prefer phrases like "幾有...感", "可以試...", "唔一定要重拍".
- No explicit profanity and no aggressive scolding.
- Avoid awkward literal translation.

Simplified Chinese:

- Natural Simplified Chinese where supported.
- Use 胶片 / 氛围 / 画面 naturally.
- Do not rely on direct Traditional Chinese conversion if wording feels stiff.

All variants:

- No score/rating.
- No sensitive inference.
- No body, face, skin, beauty, age, gender, emotion, health, identity, ethnicity, religion, disability, or body judgment.
- No raw provider/debug/internal wording.
- No raw localization keys.
- No overclaiming imported photo capture context.

## Captured vs Imported Rules

Captured photos:

- May use safe local capture context summaries.
- May mention light, motion, tilt, framing, and filter fit only through localized, bucketed wording.
- Must not expose raw sensor values.
- Must not upload capture context.

Imported photos:

- Must not claim capture-time motion, tilt, focus, lens, ISO, exposure settings, or user movement.
- May describe observable light, color, contrast, framing, and crop fit.
- May show a calm limited-context note.
- May recommend filters safely.

## Creative Intent Regression Rules

Treat these as possible style unless severe unreadability is likely:

- blur
- motion
- low light
- tilt
- grain
- soft focus
- overexposure
- underexposure
- high contrast
- faded color
- unusual framing

Expected behavior:

- Preserve style first.
- Offer optional refinement second.
- Hide retake unless likely severe technical risk.
- Avoid "fix", "failed", "wrong", "bad", and retake-first wording.

## Filter Reason Regression Rules

- Every current `FilterPresetCatalog` preset should have a filter reason profile.
- Every mapped family should resolve to localized family / reason keys.
- Recommendation reasons should include matched photo signal + retro aesthetic result.
- Unknown filter IDs should fall back safely.
- `original` should have a safe reason.
- Raw family IDs must not appear in production UI.
- Generic filter reasons should not replace family-specific reasons.

## Scenario Matrix

| # | Scenario | Source | Safe local signals / buckets | Expected mood behavior | Expected filter reason behavior | Expected optional refinement | Retake expected | Forbidden wording | English notes | Traditional Chinese notes | Cantonese-style notes | Simplified Chinese notes | Xcode visual check |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Low light mood | captured | light low, warmth warm, lowLight | Night / quiet shadow mood first | Amber glow or night grain reason preserves low light | Optional brighten only if user wants more detail | No | "too dark", "wrong exposure" | Mention mood before detail | 暗位 / 夜色 / 氣氛 natural | 暗位幾有 mood | 暗位 / 夜色 / 氛围 natural | One mood line, one filter reason |
| 2 | Warm indoor light | captured | brightness medium, warmth warm | Warm relaxed film mood | Warm film reason preserves warm light | Optional soften contrast | No | "yellow cast problem" | Warm light sounds positive | 暖光 / 柔和菲林感 | 暖光幾夾 | 暖光 / 胶片感 | Filter reason is not generic |
| 3 | Cool quiet mood | captured | warmth cool, saturation low/medium | Quiet cool-tone mood | Cool fade or classic film reason | Optional add warmth only if desired | No | "color is wrong" | Avoid overcorrecting cool tone | 冷調 / 安靜氣氛 | 冷調有 quiet feel | 冷调 / 安静氛围 | No correction command |
| 4 | Slight motion blur | captured | motion slight, blur medium | Candid film / snapshot motion | Soft dream or night grain reason | Optional hold steady for cleaner version | No | "you shook the camera" | Motion can work | 隨拍菲林感 | 鬆郁有菲林感 | 随拍胶片感 | Retake not first |
| 5 | Strong blur but possible style | captured | blur high, soft/dream filter | Dreamy softness if content still readable | Soft dream reason | Optional sharper alternate shot | Only if severe risk is likely | "photo is blurry, retake" | "only if you want" | 柔焦可以保留 | 想 sharp 先再影 | 柔焦可以保留 | Retake optional if shown |
| 6 | Soft focus / dreamy | captured | blur medium, softFocus style | Dreamy retro look | Soft dream reason | Optional tap/hold only for cleaner detail | No | "focus failed" | Softness as style | 柔焦 / 夢幻 | 柔焦幾夢幻 | 柔焦 / 梦幻 | No failure language |
| 7 | Slight tilt / snapshot | captured | level slight_tilt | Snapshot / street energy | Street chrome if suitable | Optional straighten only if cleaner frame wanted | No | "level is wrong" | Tilt can add energy | 快拍感 / 街拍感 | 微微斜有 snapshot 感 | 快拍感 / 街拍感 | Straighten optional |
| 8 | High contrast / street | captured | contrast high | Bold street / cinematic mood | Street chrome or cinematic contrast reason | Optional protect shadows/highlights | No | "contrast too high" | Strong contrast positive | 強對比有力 | 對比強幾有力 | 强对比有力量 | No score |
| 9 | Faded color / low saturation | captured | saturation low | Old film / faded memory | Faded pastel or cool fade reason | Optional add contrast if desired | No | "color is insufficient" | Faded color as style | 褪色舊菲林感 | 低飽和有舊相味 | 褪色胶片感 | Natural short copy |
| 10 | Grain / night grain | captured | low light, grain-like filter | Film grain / lo-fi night mood | Night grain reason turns grain into style | Optional cleaner version only if desired | No | "noise too much" | Grain as texture | grain 變成菲林氣氛 | grain 有菲林感 | grain 变成胶片氛围 | No noise removal demand |
| 11 | Background clutter | captured | clutter high | Busy street / lived-in frame if fitting | Street chrome or crop-friendly reason | Optional crop to reduce edge clutter | No | "messy background" | Focus on edges/framing | 邊位 / 背景空間 | 邊位有啲散 | 边缘 / 背景空间 | Crop optional |
| 12 | Negative space | captured | wide/landscape, space | Breathing room / quiet frame | Classic film or cool fade reason | Optional crop only for tighter frame | No | "too much empty space" | Negative space can work | 留白有呼吸感 | 留白幾有呼吸感 | 留白有呼吸感 | No command |
| 13 | Centered clean framing | captured | portrait/centered, balanced | Simple usable frame | Classic film reason | Optional crop if user wants focus | No | "boring" | Calm and practical | 構圖可保留 | 構圖留得低 | 构图可以保留 | No harsh critique |
| 14 | Crop suggestion | captured | clutter medium/high or edge space | Mood stays first | Filter reason still appears before crop | Crop optional and specific | No | "must crop" | Crop as refinement | 可以稍微裁 | 可以裁少少 | 可以稍微裁切 | Crop not first |
| 15 | Optional straighten | captured | slight_tilt | Tilt may be snapshot style | Street/candid reason if useful | Straighten only if cleaner frame wanted | No | "fix level" | Straighten optional | 想整齊才拉直 | 想整齊先拉直 | 想整齐再拉直 | No level score |
| 16 | Severe technical risk | captured | high blur/shaky or unreadable buckets | Keep current mood if any | Safe filter if possible | Conservative hint | Yes, optional only | "retake this", "failed" | Keep this + alternate shot | 保留 mood，再拍清晰版 | 留 mood，想乾淨版先再影 | 保留氛围，再拍清晰版 | Retake lower priority |
| 17 | Selected filter at capture | captured | selectedFilterAtCapture set | Style respects chosen filter family | Reason matches selected/related family | Optional compare adjacent filter | No | "wrong filter" | User choice respected | 保留目前風格 | 先留呢個 feel | 保留当前风格 | No shaming selected filter |
| 18 | Balanced photo | captured | brightness/contrast/saturation medium | Clean simple retro direction | Classic film reason | Optional subtle crop/filter compare | No | "no issue found" | Not generic AI | 乾淨、可保留 | 乾淨，可以留 | 干净、可以保留 | Short card |
| 19 | Imported limited context | imported | source imported, context unknown | State limited capture context calmly | Still recommend based on light/color/framing | Optional crop/filter | No | "you moved", "camera tilted" | Do not claim capture data | 只分析光線、色彩、構圖 | 只睇光、色、構圖 | 只分析光线、色彩、构图 | Limited note calm |
| 20 | Imported low light | imported | image brightness low | Low-light mood from image only | Amber/night reason | Optional brighten for detail | No | "camera was underexposed" | Observable only | 不講拍攝設定 | 唔講拍攝設定 | 不说拍摄设置 | No capture-time claim |
| 21 | Imported faded color | imported | saturation low | Faded film mood | Faded pastel/cool fade reason | Optional contrast | No | "color is bad" | Old film feel | 舊菲林褪色感 | 舊相味 | 旧胶片褪色感 | No correction framing |
| 22 | Imported crop/framing | imported | aspect/clutter bucket | Framing observation only | Filter still reasoned | Optional crop | No | "you framed it wrong" | No user blame | 不怪拍攝者 | 唔怪人 | 不责怪拍摄者 | Crop optional |
| 23 | Imported filter recommendation | imported | local image buckets available | Mood + filter fit | Signal + retro result | Optional compare one filter | No | "best/perfect filter" | Soft recommendation | 幾適合 / 可以試 | 幾夾 / 可以試 | 比较适合 / 可以试 | No confidence % |
| 24 | Imported unavailable signals | imported | image signals unavailable | Safe local fallback | Safe fallback filter reason | Minimal optional compare | No | raw key / error | Calm fallback | 安全本機建議 | 安全本機建議 | 安全本机建议 | No blank UI |
| 25 | Provider unavailable fallback | fallback | source fallback | Calm fallback state | Safe local suggestion | None or one local suggestion | No | provider error / stack trace | No provider raw error | 不顯示 raw error | 唔顯示 raw error | 不显示 raw error | Calm warning only |
| 26 | Local-only fallback | fallback | cloud off | Local suggestion stays useful | Existing catalog reason | None or one optional suggestion | No | degraded / broken | Local is normal | 本機建議正常 | 本機建議正常 | 本机建议正常 | No scare copy |
| 27 | Missing filter reason fallback | fallback | unknown reason key | Safe fallback reason | No raw family id | No crash | No | raw key | Filter unavailable safe | 安全 fallback | 安全 fallback | 安全 fallback | No raw key |
| 28 | Missing localization fallback | fallback | missing key simulated manually | UI should avoid raw keys where feasible | Safe fallback / manual catch | No crash | No | `advisor.*` visible | Manual QA catches | 手動檢查 raw key | 手動檢查 raw key | 手动检查 raw key | No raw key visible |
| 29 | Blocked unsafe wording fallback | fallback | unsafe wording fixture | Safe fallback only | No unsafe text | No unsafe text | No | banned phrases | No unsafe copy shown | 無敏感/攻擊字眼 | 無粗口/攻擊 | 无敏感/攻击词 | Safe replacement |
| 30 | Unknown filter ID fallback | fallback | unsupported filterId | Mood remains | Known safe filter or missing filter label | Optional local compare | No | raw id / crash | No invented filter | 不推薦不存在濾鏡 | 唔推薦不存在 filter | 不推荐不存在滤镜 | No crash |

## Manual Review Result Template

Copy this locally when reviewing a build. Do not commit filled reports unless a future safe artifact policy explicitly approves them.

```text
Reviewer:
Date:
Build:
Device / Simulator:
Language mode:
Tone mode:

Scenario number / name:
Source: captured / imported / fallback
Selected filter:
Observed mood headline:
Observed visual reason:
Observed filter recommendation + reason:
Observed optional refinement:
Observed crop / straighten / retake:
Retake was optional and conservative: yes / no / not shown
Imported photo avoided capture-time claims: yes / no / not applicable
Language naturalness: pass / needs review
Filter reason fit: pass / needs review
Safety concern: yes / no
Raw key / provider / debug wording visible: yes / no
Notes:
```
