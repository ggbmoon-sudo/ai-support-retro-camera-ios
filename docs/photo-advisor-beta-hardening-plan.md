# Photo Advisor Beta Hardening Plan

Phase: 18-C0
Status: Planning only

This plan defines the next internal QA and polish track for the Post-capture Photo Advisor.

It does not enable production cloud AI, add iOS provider keys, add iOS direct provider calls, add a Camera cloud AI entry, upload capture context, or change backend provider request payloads / iOS upload payloads.

Production rollout remains blocked. `productionReady` must remain `false`.

## Goal

Phase 18-C focuses on hardening the post-capture Advisor beta before any future debug/internal remote advisor integration changes.

The Advisor should continue to feel like a warm retro-camera-aware photo companion:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

It must not regress into:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

## Non-goals

Phase 18-C0 and the Phase 18-C beta-hardening track do not approve:

- production cloud AI rollout
- Camera cloud AI entry
- iOS provider keys
- iOS direct provider calls
- capture-context upload
- backend provider request payload changes
- iOS upload payload changes
- real-provider QA without explicit approval
- StoreKit, premium quota, Gemini Live, streaming, WebSocket, AI Filter Generator real backend, or image editing provider work

## Beta Hardening Areas

### Captured Photo Advisor Flow

- Confirm capture still opens the local/mock Advisor reliably.
- Confirm safe local capture context can influence copy without exposing raw sensor values.
- Confirm captured-photo copy starts with mood/style rather than diagnosis.
- Confirm no score/rating, harsh correction, or retake-first language appears.

### Imported Photo Advisor Flow

- Confirm imported photos open the local/mock Advisor reliably.
- Confirm imported-photo copy does not pretend capture-time motion, tilt, focus, lens, or exposure context is known.
- Confirm imported photos may use safe local image signals only when available.
- Confirm imported limited-context copy is calm and short.

### Fallback / Provider-unavailable UX

- Confirm fallback copy is calm, short, and app-safe.
- Confirm no raw provider error, raw JSON, stack trace, endpoint, provider name, or debug detail appears in production UI.
- Confirm provider-unavailable paths return local/mock-style advice where possible.
- Confirm fallback does not imply the product is broken.

### Local/mock Advisor Consistency

- Confirm A1 language pack, A2 filter reason library, A3 CreativeIntentGuard rules, and A4 result-card model remain aligned.
- Confirm A5 copy regression checks remain the default guard for local/mock copy.
- Confirm local/mock behavior does not drift from the provider language contract.

### Result Card Readability

- Keep the card concise by default:
  - mood headline
  - one visual reason
  - one filter recommendation with reason
  - one optional refinement when useful
  - crop/straighten/retake only when appropriate
- Avoid showing multiple similar refinements.
- Avoid numeric confidence, scores, internal classification names, raw keys, or debug labels in production UI.

### Filter Recommendation + Reason Quality

- Every recommendation should include:
  - filter name or family
  - matched safe photo signal
  - retro aesthetic result
- Reasons should be short and UI-ready.
- Unknown or unsupported filter IDs must fall back safely.
- The app must not recommend filters outside the current catalog.

### CreativeIntentGuard Behavior

- Treat blur, motion, tilt, low light, grain/noise, soft focus, high contrast, faded color, underexposure, overexposure, unusual framing, and clutter as possible retro style unless severe technical risk is likely.
- Preserve style before offering optional refinement.
- Keep `technical_risk` language conservative.
- Never frame creative choices as failure.

### Crop / Straighten / Retake Restraint

- Crop and straighten advice must be optional and style-preserving.
- Retake advice must be rare, conservative, and lower priority than mood/filter/style guidance.
- If severe risk is not reliably detected, prefer no retake advice.
- Retake copy must preserve the current photo first.

### Multilingual QA

Review the result card in:

- English
- Traditional Chinese
- Simplified Chinese
- Cantonese-style wording where supported

Language should be natural, short, retro-aware, and free of sensitive inference or harsh correction. Cantonese-style copy should avoid awkward literal translation and explicit profanity.

### Manual Real-device QA

Manual QA should cover:

- capture flow
- import flow
- low light
- bright light
- intentional blur / motion
- intentional tilt
- grainy retro look
- high contrast
- faded color
- filter recommendation reason quality
- fallback behavior
- language variants

Real photos, reports, screenshots, recordings, and device artifacts must remain local / ignored unless a later safe-asset policy explicitly approves committing them.

### Regression Scripts and Smoke Tests

Before starting any deeper Phase 18-C implementation, keep these checks passing:

```sh
scripts/validate-photo-advisor-copy-regression.sh
scripts/validate-photo-advisor-filter-reasons.sh
scripts/validate-creative-intent-language.sh
scripts/validate-photo-advisor-card-language.sh
cd backend && npm run qa:photo-advisor
cd backend && npm run qa:photo-advisor:gate
cd backend && npm run qa:photo-advisor:review
```

Real-provider QA is not required for Phase 18-C start and must not run unless explicitly approved for that run.

## Beta Acceptance Criteria

The post-capture Advisor beta is acceptable for the next internal hardening step only when:

- Advisor card is short, mood-first, and useful.
- Copy follows Observation -> Mood -> Retro intent -> Optional action.
- No score/rating wording appears.
- No sensitive inference appears.
- No harsh fix-it language appears.
- No retake-first behavior appears.
- Imported photos do not pretend to know capture-time context.
- Fallback copy is calm and app-safe.
- Filter recommendations include a short reason with photo signal + retro aesthetic result.
- CreativeIntentGuard preserves possible retro style before optional refinements.
- Provider path remains internal/debug-only.
- Camera remains local-only.
- iOS has no provider key or direct provider call.
- Backend provider request payloads are unchanged.
- iOS upload payloads are unchanged.
- Capture context is not uploaded.
- Generated reports, local samples, screenshots, recordings, and device artifacts remain ignored.
- `productionReady` remains `false`.

## Internal QA Scenario Matrix

| Scenario | Source | Expected Advisor Behavior | Acceptance Notes |
| --- | --- | --- | --- |
| Captured bright scene | captured | Start with clean light / airy mood; recommend a balanced or warm film filter if useful. | Do not call bright light wrong. No score. |
| Captured low light | captured | Preserve night mood / shadow atmosphere first; optional detail lift only if useful. | No default "too dark" criticism. |
| Intentional blur / motion | captured | Treat slight motion as candid film or dreamy retro style. | No retake-first advice. Optional cleaner version only. |
| Intentional tilt | captured | Treat slight tilt as snapshot / street energy. | Straighten only as optional. |
| Grainy retro look | captured/imported | Treat grain as possible film texture. | Do not say noise should be removed by default. |
| High contrast | captured/imported | Treat contrast as street / cinematic energy. | Optional softening only if useful. |
| Faded color | captured/imported | Treat low saturation as worn film / nostalgic color. | Do not say color is insufficient. |
| Imported limited context | imported | State limited capture context only when useful; analyze light, color, framing, and filters. | Do not claim camera movement, lens, focus, or capture exposure cause. |
| Provider unavailable fallback | fallback | Show calm local suggestion. | No provider name, status code, raw error, or raw JSON. |
| Unknown / unsupported filter fallback | fallback | Fall back to a safe catalog filter or generic local suggestion. | No raw filter ID or family ID. |
| Missing localization key fallback | fallback | Show safe fallback copy. | No raw localization key in UI. |

## Phase 18-C Starting Gate

Phase 18-C can proceed as beta hardening when:

- B0-B7 provider QA chain remains coherent.
- Synthetic provider QA passes.
- Dry-run gate passes.
- QA gate helper reports no hard blockers.
- A5 copy regression checks pass.
- Warnings are reviewed rather than treated as release approval.
- No real-provider QA is required.
- `productionReady` remains `false`.

## Suggested Next Phase Shape

The next implementation phase should stay app-side/local unless explicitly approved otherwise.

Possible next step:

- Phase 18-C1: Post-capture Advisor beta QA polish for captured/imported flows, result-card readability, fallback calmness, and multilingual copy review.

Production rollout, Camera cloud AI, capture-context upload, backend/iOS payload changes, and real-provider expansion remain blocked until explicitly requested.
