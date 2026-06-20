# Live Guidance Roadmap

This roadmap formalizes the staged path for live camera guidance after Phase 13.

Phase 14R is documentation-only. It does not start Phase 14 implementation.

## Today's Direction Change

Real-time / live camera guidance should now prioritize on-device intelligence instead of cloud live VLM. Cloud/self-hosted VLM remains useful for post-capture Photo Advisor, offline benchmark, internal evaluation, and future model-assisted labeling, but live guidance should become Apple Vision / AVFoundation geometry, hardware depth when available, and app-side composition rules first.

Depth Anything V2 Small is only a future Core ML fallback sandbox after latency, memory, FPS, thermal, and battery checks. Florence-2-base is only a feasibility/research candidate for object detection, grounding, detailed caption, and segmentation; do not assume production live runtime until benchmarked.

## Roadmap Principles

- Keep the camera-first experience primary.
- Validate UX before technical complexity.
- Prefer local processing before cloud processing.
- Avoid continuous viewfinder upload.
- Avoid real-time cloud video AI in the MVP.
- Keep guidance short, calm, and camera-like.
- Do not claim mock guidance is real AI.
- Keep future provider architecture replaceable.
- Keep live hints short, non-judgmental, retro-aware, and creative-intent preserving.
- Preserve the language shape: Observation -> Mood -> Retro intent -> Optional action.
- Do not turn guidance into Score -> Problem -> Fix -> Retake.

## Phase 14: Mock UX Only

Goal:

- Add local/mock live guidance overlay to the Camera screen.
- Add guidance toggle and mock state.
- Show 1-3 short mock suggestions.
- Validate overlay placement and interaction with camera controls.

Provider:

- `MockLiveGuidanceProvider` only.

Must not do:

- No Vision.
- No frame analysis.
- No Gemini Live.
- No voice input.
- No ASR.
- No Parakeet.
- No frame upload.
- No backend.

## Phase 15: Local Rule-Based / Vision Prototype

Goal:

- Prototype on-device guidance signals.
- Explore brightness, subject position, headroom, tilt, blur, simple composition, and basic filter suggestion heuristics.

Potential providers:

- `FutureLocalRuleBasedGuidanceProvider`.
- `FutureVisionGuidanceProvider`.

Must not do:

- No cloud video AI.
- No default upload.
- No Gemini Live as main engine.
- No complex pose coaching.

## Phase 16: Server-Side Snapshot Guidance

Goal:

- Explore optional low-frequency snapshot guidance.
- Send a low-resolution still image only when explicitly enabled and consented.
- Use backend/server-side credentials.
- Return structured short suggestions.

Potential provider:

- `FutureCloudSnapshotGuidanceProvider`.

Must not do:

- No continuous viewfinder upload.
- No live video stream.
- No client API keys.
- No unmanaged cloud AI calls.

## Phase 17: Gemini Live Voice + Visual Assistant Prototype

Goal:

- Research Gemini Live for optional voice + visual camera assistant.
- Test realtime session feasibility, latency, session lifecycle, interruption, audio routing, and visual input constraints.

Potential provider:

- `FutureGeminiLiveGuidanceProvider`.

Must not do:

- Do not treat Gemini Live as MVP main engine.
- Do not ship without rechecking official docs, pricing, rate limits, and preview status.
- Do not hardcode provider keys in iOS.

## Voice Branch

Voice is a parallel branch, not part of Phase 14.

Recommended sequence:

1. Push-to-talk mock.
2. Apple Speech prototype.
3. Cloud STT / Gemini Live research.

### Push-To-Talk Mock

Goal:

- Validate placement and interaction.
- Use fake transcripts.
- Do not request microphone permission.
- Do not connect ASR.

### Apple Speech Prototype

Goal:

- Validate local short voice commands.
- Keep grammar narrow.
- Test language and locale support.

### Cloud STT / Gemini Live Research

Goal:

- Explore multilingual voice and spoken assistant use cases.
- Require privacy, consent, credential, backend, cost, and App Store readiness first.

## Provider Abstraction Direction

Future guidance code should be organized around a provider boundary:

```text
LiveGuidanceProvider
├─ MockLiveGuidanceProvider
├─ FutureLocalRuleBasedGuidanceProvider
├─ FutureVisionGuidanceProvider
├─ FutureCloudSnapshotGuidanceProvider
└─ FutureGeminiLiveGuidanceProvider
```

Phase 14 may introduce only the mock provider. Future provider names can be reserved in docs or comments, but must not be implemented as real services until their phases are explicitly requested.
