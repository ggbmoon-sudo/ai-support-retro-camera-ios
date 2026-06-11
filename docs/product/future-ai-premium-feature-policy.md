# Future AI / Premium Feature Policy

This document records future-facing product policy for AI, local intelligence, paid features, cloud save, image transfer, image editing, and language modes.

It is planning-only. It does not mean any feature below has been implemented. Every item here requires a separate phase, research task, implementation prompt, user approval, and verification before any app behavior changes.

---

## 1. Purpose

- Record product policy for future AI, local intelligence, paid features, cloud save, image transfer, image editing, export, language modes, and related entitlement boundaries.
- Provide a source of truth for future research and implementation prompts.
- Prevent accidental scope creep into real AI, backend, upload, persistence, StoreKit, export, or paid gating.
- Clarify that current app behavior remains local / mock-only unless a later explicit phase changes it.
- Require independent research, design, user approval, and phase boundaries before implementation.

---

## 2. Local AI / Local Camera Intelligence

Pre-capture and in-capture guidance should primarily be handled by local intelligence over the long term.

Reasons:

- Running cloud AI for every live viewfinder moment would be too expensive.
- Cloud guidance would add latency and make the camera feel less native.
- Continuous frame upload creates privacy, battery, thermal, and network concerns.
- Live camera guidance should keep working for both free and paid users.
- Local guidance better fits a camera-first retro app where the shutter must stay responsive.

Current state:

- The app already has rule-based and Vision-based local hints.
- These hints are local, bounded, and do not upload live frames.
- Future local intelligence may improve guidance quality without becoming real cloud AI.

Future direction:

- Research on-device Core ML or other local model approaches.
- Research whether safe local image statistics can improve suggestions.
- Any model training requires a large, legally licensed dataset.
- User photos must not be secretly used for training.
- Live camera frames should not be uploaded for continuous cloud analysis.
- Cloud AI should mainly be limited to post-capture or imported-photo one-time analysis.

Future research title:

- `Local On-device Camera Coach + LiDAR Research`

---

## 3. LiDAR-aware Local Camera Intelligence

Future high-end iPhone devices with LiDAR may support richer local scene understanding.

Potential uses:

- Subject distance guidance.
- Foreground / background separation.
- Portrait distance guidance.
- Pose overlay scale help.
- Low-light spatial hints.
- Future double exposure alignment.

Policy:

- LiDAR-aware behavior should not be implemented short-term.
- Non-LiDAR devices must have a graceful fallback.
- LiDAR should be treated as an optional enhancement, not a requirement for the core camera.
- It requires a dedicated technical research phase before implementation.
- It must not upload live camera frames.

---

## 4. Post-capture Cloud AI Quota

Real cloud AI should mainly be used after a photo is captured or imported.

Policy:

- Free users may receive 20 cloud AI analyses.
- The quota period is not final; record it as a monthly placeholder until the user confirms.
- Paid users are tentatively unlimited, but implementation must still include fair-use rules, cost guards, provider failure handling, and a kill switch.
- Cloud AI should not be used for live camera continuous guidance.
- Cloud AI analysis must require explicit consent and clear privacy copy.
- The first future real cloud endpoint recommendation remains:

```text
POST /v1/ai/photo-advisor
```

This endpoint is not implemented in the current app and must wait for a backend boundary phase.

---

## 5. Paid App-to-App High-quality / Lossless Photo Transfer

Future paid users may have an app-exclusive channel for sending high-quality or lossless photos.

Product concept:

- The sender is a paid user.
- The receiver does not need to be paid.
- The receiver must use the app to receive the asset.
- The flow can avoid AirDrop while preserving quality.

Technical concept:

- Sender renders a high-quality photo.
- The client encrypts the rendered file before upload.
- The encrypted file is uploaded to storage.
- The app shares a `transferId` plus a decrypt key / token with the receiver.
- The receiver uses the app to fetch and decrypt the asset.

Security and product rules:

- Backend / storage should not see the plaintext photo.
- Receiver only gets read access to the shared asset.
- The feature needs expiry, revoke, quota, abuse control, and reporting rules.
- It requires dedicated security design and research before implementation.
- It must not be bundled into an unrelated AI or advisor phase.

Future research title:

- `Encrypted App-to-App High Quality Photo Transfer Research`

---

## 6. Paid AI Image Editing / 改圖師

Future paid users may access high-end AI image editing through a provider such as a GPT Image 2-class provider.

Prompt sources:

- Photo Advisor generated edit prompt.
- User custom prompt.

Policy:

- Prompts must be limited to photo-related editing.
- The app must include prompt guards to avoid using the tool as a general image-generation product.
- This should not become a general-purpose AI image generator.
- Provider API keys must never be included in iOS.
- The feature requires a backend proxy.
- The feature requires consent, quota, moderation, timeout, cancellation, provider error handling, and cost guards.
- Raw images should not be persisted by default.
- No unrelated generation should be allowed.

Before implementation:

- Check the latest provider documentation.
- Check latest pricing.
- Check latest image editing policy / safety rules.
- Design backend validation and iOS validation.

Future research title:

- `Paid AI Image Editing Provider Research`

---

## 7. AI Filter Generator Free vs Paid Policy

Current state:

- Phase 16G AI Filter Generator / Filter Lab is mock-only.
- Save generated filter behavior is not implemented.
- Persistent custom filter library and cloud sync do not exist.

### Free Users

- Can use AI Filter Generator / Filter Lab.
- Can generate, preview, try, and apply a session-only filter.
- Cannot save generated filters to a custom filter library.
- Generated filters may disappear after app restart.
- Generated filters cannot cloud sync.

### Paid Users

- Can save generated filters.
- Can name and manage custom filters.
- Can reuse custom filters in Camera preview.
- May get custom filter cloud sync in a later phase.
- May receive higher generation quota.

Implementation rule:

- Saving generated filters requires a dedicated entitlement / persistence phase.
- Cloud sync for custom filters requires a later backend / sync phase.

---

## 8. Advanced Retro Camera Effects / Double Exposure

Future retro camera effects may include:

- Double exposure.
- Light leak.
- Film frame.
- Ghost overlay.
- Long exposure effect.
- CCD flash party mode.
- Split frame.
- Multi-shot collage.

Policy:

- These effects do not necessarily require AI.
- Many can be implemented with Core Image, blend modes, and local processing.
- They should receive dedicated research before implementation.
- Basic packs can be free.
- Advanced packs can be paid later if the entitlement model is designed.

Future research title:

- `Retro Advanced Camera Effects / Double Exposure Research`

---

## 9. Hong Kong Language / 麻煩友 Mode

The app should support English, Traditional Chinese, and Simplified Chinese. A future special Hong Kong language mode may be added:

- `麻煩友模式`

Product style:

- Hong Kong colloquial Cantonese.
- May include profanity.
- Feels like an annoying friend who still wants the user's photo to look better.
- Example: `屌，個頭頂留咁大空位做乜？鏡頭落返少少啦。`

Policy:

- Must be opt-in.
- Default off.
- Can be turned off with one action.
- Must not use hate speech.
- Must not attack identity, age, gender, race, body, appearance, religion, health, or other sensitive attributes.
- Profanity may be used as tone, not as personal attack.
- May affect App Store age rating and requires research.

Future research title:

- `Hong Kong / 麻煩友 Language Mode UX + Safety Research`

---

## 10. Reduce User-facing "AI" Wording

Daily UI should reduce direct use of `AI` wording where possible. Use language that is easier to understand and more brandable.

| Internal / old wording | User-facing wording |
| --- | --- |
| AI Photo Advisor | 相片顧問 / 麻煩友 |
| AI Snapshot | 快速建議 / 麻煩友看看 |
| AI Filter Generator | Filter Lab / 專屬濾鏡 |
| AI Edit | 改圖師 / 相片改造 |
| AI Guidance | 本機導拍 |
| AI Recommendation | 建議 / 推薦 |
| AI Result | 分析結果 / 顧問結果 |

Rules:

- User-facing UI can use less `AI` wording.
- Privacy, consent, upload, and third-party processing screens must clearly disclose cloud AI / third-party AI when applicable.
- Internal code, architecture docs, research docs, and implementation prompts may keep AI terminology for clarity.

---

## 11. Free / Paid Feature Matrix

| Area | Free | Paid |
| --- | --- | --- |
| Camera | Included | Included |
| 20 filters | Included | Included |
| 本機導拍 | Included | Included |
| Pose overlay basic | Included | Included |
| Mock / local Photo Advisor | Included | Included |
| AI Filter Generator / Filter Lab | Session-only use | Save generated filters and higher quota |
| Post-capture cloud AI | 20 analyses per placeholder quota period | Higher / fair-use cloud AI quota |
| Custom filters | No persistent custom library | Name / manage saved generated filters |
| Custom filter sync | Not included | Future cloud sync custom filters |
| Export | Future local high-quality export | Future higher formats / batch export |
| Retro effects | Future basic retro effects | Future advanced retro packs |
| Photo transfer | Not included | App-to-app encrypted high-quality transfer |
| Cloud save | Not included | Paid cloud save |
| AI image editing / 改圖師 | Not included | Included with quota / fair use |
| Pose packs | Basic only | Future advanced pose packs |

Notes:

- Quota periods and exact paid limits still need user confirmation.
- Entitlements, StoreKit, export, cloud save, and backend work are not implemented.

---

## 12. Research Backlog

1. Local On-device Camera Coach + LiDAR Research
2. Encrypted App-to-App High Quality Photo Transfer Research
3. Paid AI Image Editing Provider Research
4. Hong Kong / 麻煩友 Language Mode UX + Safety Research
5. Retro Advanced Camera Effects / Double Exposure Research
6. Export / Local Lossless Download Technical Research
7. StoreKit / Entitlement / Paid Cloud Save Research

---

## 13. Guardrails

Do not do any of the following without explicit user approval and a dedicated phase:

- Real AI.
- Backend.
- Gemini Live.
- Live video streaming.
- Image editing provider integration.
- App-to-app encrypted transfer.
- Cloud save.
- StoreKit.
- Export / save-to-Photos.
- LiDAR / Core ML training.
- Local model training.
- Using user photos for training.
- Persistent generated filters.
- Custom filter cloud sync.
- Paid gating.
- Profanity language mode.

This document is not permission to implement any of the above.
