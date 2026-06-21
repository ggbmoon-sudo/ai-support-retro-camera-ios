# Phase 21-A6 - App-side Composition Hint Suppression

Status: implemented, pending MacBook/Xcode physical-device verification  
Date: 2026-06-21  
Production readiness: `productionReady:false`

## Summary

Phase 21-A6 aligns the iOS Camera runtime with the Phase 21-A5 ownership decision: richer composition guidance belongs to the separate training-AI branch, while the app-side Camera layer stays a lightweight local signal / hint-shell layer.

The app may still collect safe local geometry/depth/lighting signals in memory, but it no longer authors user-facing composition or portrait-layout hint copy from local geometry signals. This prevents the runtime from drifting into a deeper composition coach before the training-AI branch defines label schema, human-reviewed guidance policy, and typed composition outputs.

## Completed Work

- Updated `LiveGuidanceSuggestionComposer` so app-side composition / portrait layout signals return no visible suggestion.
- Updated Mock guidance sample suggestions and SwiftUI preview data so app-side demo/runtime surfaces no longer show composition / portrait-layout sample copy.
- Suppressed local app-authored hint copy for subject centering, edge margin, headroom, face distance, subject size, portrait readiness, rule-of-thirds alignment, and vertical balance readiness.
- Kept safe local lighting, filter, and unavailable-state suggestions available.
- Kept Apple Vision / AVFoundation local signal collection unchanged for future typed signal use and debug inspection.
- Kept `Next hint` UX shell from Phase 21-A4 intact for remaining visible local suggestions.

## Suppressed Runtime Hint Sources

- `subjectOffCenter`
- `subjectNearEdge`
- `lowHeadroom`
- `faceTooClose`
- `faceTooFar`
- `subjectTooLarge`
- `subjectTooSmall`
- `portraitLikely`
- `ruleOfThirdsAligned`
- `verticalBalanceReady`

## Still Allowed App-side Hints

- Local signal unavailable fallback.
- Conservative lighting hints.
- Conservative direct-light / low-light hints.
- Conservative filter-family suggestion when it does not overclaim composition quality.

## Training-AI Branch Boundary

Richer composition guidance should be handled outside this iOS runtime phase. The training-AI branch should own:

- Composition label schema.
- AI-assisted labeling policy and human review gates.
- Learned layout / scene / retro-intent patterns.
- Typed composition output contract.
- Future safe app copy mapping after validation.

## Boundary Confirmations

- Provider/model/cloud call: no
- Camera live cloud AI entry: no
- Preview-frame upload: no
- Upload payload changed: no
- Raw frame/depth/image persistence: no
- Dataset crawler added: no
- AI-assisted labeling run added: no
- User-photo training added: no
- Depth Anything runtime added: no
- Florence runtime added: no
- Core ML model inference run: no
- Sensitive inference added: no
- Scoring/rating language added: no
- Retake-first language added: no
- `productionReady:false` remains locked.

## Xcode Verification Needed

Build and run on iPhone. Open Camera with local guidance enabled and confirm:

- Lighting guidance can still appear when the scene is very dark or bright.
- Filter guidance can still appear when the warm-filter rule is eligible.
- Local unavailable fallback can still appear when no safe signal exists.
- Subject centering, edge margin, headroom, face distance, subject size, rule-of-thirds, vertical balance, and portrait-ready hints no longer appear as app-authored runtime copy.
- The `Next hint` action still works for the remaining visible hint list.
- Camera capture, live filter preview, selfie mirror parity, flash, and focal crop behavior remain unchanged.

## Ready for Next Phase

If continuing app-side work, choose a non-composition Camera polish phase such as Camera runtime QA, performance, filter UX, focal crop UX, or capture/export polish. If continuing composition intelligence, use a separate training-AI branch phase for dataset/label schema and legal/source/consent gates before runtime integration.

Not ready for production rollout.
