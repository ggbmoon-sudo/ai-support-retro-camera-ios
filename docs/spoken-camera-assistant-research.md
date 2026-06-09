# Spoken Camera Assistant Research

This document summarizes the spoken camera assistant, voice input, ASR, and Parakeet research for the camera-first local/mock MVP.

Phase 14R is documentation-only. It does not authorize voice implementation, microphone permission work, ASR, Parakeet integration, Gemini Live integration, backend work, or Phase 14 implementation.

## Executive Summary

Voice input is worth keeping in the long-term roadmap, but it should not enter the MVP.

The best near-term product is still visual camera guidance. Voice becomes useful later as a low-friction control layer for short commands, not as the main product surface. A spoken assistant cannot answer useful framing questions unless a visual guidance state already exists.

Recommended order:

1. Phase 14 visual live guidance mock UX.
2. Phase 15 local visual guidance prototype.
3. Push-to-talk mock commands.
4. Apple Speech / local speech prototype.
5. Cloud STT or Gemini Live research.

## Product Positioning

Spoken camera assistant should be an optional camera control layer.

High-value examples:

- Switch filter.
- Start timer.
- Capture photo.
- Toggle guidance.
- Open Photo Picker.
- Ask for a short readout of current guidance.

Lower-priority examples:

- Open-ended composition coaching.
- Conversational voice coach.
- Always-listening hands-free mode.
- Voice-first AI camera assistant.

Voice should reduce touch friction without making the camera feel like a chatbot.

## MVP Decision

Voice input should not be in the MVP.

Reasons:

- Microphone access adds privacy and App Store review burden.
- ASR quality for Cantonese / Traditional Chinese / English code-switching needs dedicated testing.
- Voice answers depend on visual guidance state that does not exist yet.
- Always-listening or wake-word behavior would be high-risk for privacy, battery, and trust.
- Gemini Live remains better suited to later experimental work.

## ASR Findings

### Apple Speech / Local Speech

Apple Speech is the best future prototype path for local short commands.

Potential benefits:

- On-device direction is privacy-friendlier.
- Good fit for push-to-talk command mode.
- Can support a narrow grammar and app-specific terms.

Risks:

- Locale-driven recognition can make code-switching difficult.
- Cantonese / Traditional Chinese performance must be tested directly.
- Newer Apple speech APIs may require newer iOS versions and should not drive current MVP timing.

### Cloud STT

Cloud STT may be useful later for multilingual beta testing.

Potential benefits:

- Better official language coverage for Cantonese / Traditional Chinese in some provider ecosystems.
- Useful as fallback for difficult locales.

Risks:

- Audio upload requires consent and privacy disclosure.
- Adds cost, latency, dependency, and provider policy review.
- Should not be always-on.

### Gemini Live Voice Assistant

Gemini Live is worth researching for a future experimental voice + visual assistant.

Potential use:

- Premium or experimental spoken camera coach.
- Push-to-talk or short-session voice interaction.
- Multimodal visual context after visual pipeline maturity.

Risks:

- Preview / evolving status.
- Session lifecycle and rate limits must be rechecked.
- Requires server-issued credentials or ephemeral token flow.
- Not suitable as MVP default.

### Parakeet TDT 0.6B

Parakeet TDT 0.6B is not a good primary ASR route for this app.

Research conclusion:

- Not suitable as an iPhone on-device solution.
- Not suitable as the main Cantonese / Traditional Chinese ASR path.
- TDT 0.6B variants are stronger for English or supported European-language server/offline ASR scenarios, not this camera app's target language mix.
- GPU / deployment requirements make it a poor fit for early mobile product work.

Parakeet may remain a long-term speech R&D reference, but it should not drive MVP or early iOS implementation.

## Suggested Future Voice Roadmap

### Voice Branch 1: Push-To-Talk Mock

Goal:

- Validate whether a voice entry point interrupts the camera experience.
- Use fake transcripts and rule-based command routing.
- Do not request microphone permission.
- Do not connect ASR.

### Voice Branch 2: Apple Speech Prototype

Goal:

- Add push-to-talk local speech recognition for a narrow command grammar.
- Test English first, then Traditional Chinese / Cantonese beta if feasible.
- Keep transcripts in memory only.

### Voice Branch 3: Cloud STT / Gemini Live Research

Goal:

- Compare cloud STT and Gemini Live for multilingual and spoken assistant use cases.
- Require consent, privacy review, rate limits, backend credential flow, and App Store review before implementation.

## Privacy Notes

Any real voice feature must be optional and explicit.

Future implementation should prefer:

- Push-to-talk.
- Clear recording indicator.
- No wake word in early phases.
- No raw audio persistence.
- No transcript persistence by default.
- No cloud STT without consent.
- No Gemini Live without server-issued credentials and updated privacy docs.

Required future permission copy:

- Microphone usage.
- Speech recognition usage, if Apple Speech is used.

Phase 14 must not include voice input, ASR, Parakeet, microphone permission, spoken assistant UI, or Gemini Live.
