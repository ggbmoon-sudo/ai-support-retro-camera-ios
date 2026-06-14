# Open-weight VLM Backend Architecture ADR

Status: Proposed architecture direction; documentation only
Date: 2026-06-14
Phase: 19-A

## Decision

Future Photo Advisor model research should move toward a self-hosted / open-weight VLM backend evaluation path before any additional real AI product integration.

The recommended first benchmark direction is:

- Primary baseline candidate: Qwen2.5-VL-7B-Instruct.
- Compatibility baseline: Qwen2-VL-7B-Instruct.
- Efficiency candidate: MiniCPM-V.
- Watchlist only: InternVL, LLaVA-next, and newer Qwen VL variants.
- Prototype serving: Ollama or Transformers / FastAPI for local research only.
- Production-style serving evaluation: vLLM or SGLang, depending on current multimodal support, structured-output behavior, LoRA / adapter support, and operational fit at the time of implementation.

Phase 19-A does not approve implementation. Phase 19-B should create only a local / ignored backend VLM sandbox or benchmark plan unless explicitly expanded.

## Context

Phase 18 completed the app-owned Photo Advisor language foundation:

- A1 language pack
- A2 filter recommendation reason library
- A3 CreativeIntentGuard language rules and retake restraint
- A4 UI-facing result card model
- A5 multilingual copy QA kit
- B0-B7 provider language contract, regression fixtures, sanitized QA runner, dry-run gate, thresholds, gate helper, operator runbook, and readiness audit
- C0-C4 post-capture Advisor beta hardening and Phase 19-A handoff

The app now has a local/mock beta baseline for a mood-first Photo Advisor:

```text
Observation -> Mood -> Retro intent -> Optional action
```

Future VLM output must not regress into:

```text
Score -> Problem -> Fix -> Retake
```

## Non-goals

Phase 19-A does not approve or implement:

- production rollout
- Camera live cloud AI
- Camera cloud AI entry points
- iOS provider keys
- iOS direct model / provider calls
- iOS upload payload changes
- backend provider request payload changes
- capture-context upload
- real-provider QA runs
- raw image / base64 / prompt / model response / request payload logging
- GPS/location collection
- raw EXIF dumps or persistence
- user-photo training or fine-tuning without explicit consent
- from-scratch model training
- Gemini Live, streaming, voice, WebSocket, AI Filter Generator, StoreKit, premium quota, social caption generation, or production feature flags

Production rollout remains blocked and `productionReady` must remain `false`.

## Candidate Model Comparison

| Candidate | Role | Strengths to evaluate | Risks / questions | Phase 19-A recommendation |
| --- | --- | --- | --- | --- |
| Qwen2.5-VL-7B-Instruct | Primary baseline | Strong multimodal capability, active model family, image-text-to-text support, structured-output claims in official materials, supported examples for Transformers, vLLM, and SGLang | GPU memory, latency, JSON reliability, Traditional Chinese / Cantonese-style tone, safety guard behavior, license / usage review at implementation time | Use as first benchmark candidate in Phase 19-B sandbox planning |
| Qwen2-VL-7B-Instruct | Compatibility baseline | Earlier Qwen VL line with broad community references, useful for comparing Qwen2.5 gains, likely easier fallback baseline | Older than Qwen2.5-VL, may have weaker instruction following / structured output / multilingual style | Keep as benchmark fallback, not first choice |
| MiniCPM-V | Efficiency candidate | Compact VLM direction, useful for smaller hardware and cost-sensitive internal tests, relevant if latency / hosting budget dominates | Output quality, structured JSON consistency, Cantonese-style copy quality, serving compatibility, safety behavior need direct evaluation | Benchmark if hardware budget makes Qwen2.5-VL-7B too heavy |
| InternVL | Watchlist | Strong open VLM ecosystem and benchmarks | Not chosen yet; license, serving compatibility, structured output, and language style need separate review | Revisit after Qwen / MiniCPM baseline |
| LLaVA-next | Watchlist | Mature research ecosystem and many variants | Model quality / maintenance / licensing vary by checkpoint; structured output and app voice need validation | Revisit only if first candidates fail |

Notes:

- Model ranking must be rechecked before implementation because VLM releases move quickly.
- Any chosen checkpoint must pass license / terms review before use with user images.
- Model capability is not enough; the selected model must obey the Photo Advisor contract after backend validation and fallback.

## Serving Stack Comparison

| Serving option | Best use | Strengths | Risks / questions | Recommendation |
| --- | --- | --- | --- | --- |
| Ollama | Local prototype | Fastest local operator experience, simple install, good for quick qualitative checks | Model availability / quantization may lag, structured JSON enforcement may be weaker, not a production gate by itself | Acceptable for Phase 19-B local prototype only |
| vLLM | Production-style evaluation | OpenAI-compatible server, batching / throughput-oriented serving, common deployment path, official model-card examples exist for Qwen2.5-VL | Need to verify current multimodal support for the exact checkpoint, memory, JSON behavior, and deployment complexity | Strong production-style candidate if current support is clean |
| SGLang | Structured / multimodal serving evaluation | OpenAI-compatible serving path, structured generation focus, useful LoRA / adapter evaluation path if supported for chosen model | Operational complexity and exact model support must be verified | Strong candidate for structured-output and adapter-path evaluation |
| Transformers / FastAPI | Research sandbox | Maximum control, simplest to inspect, easiest to wrap with custom validation during experiments | Lower throughput, more manual memory / batching / timeout work, not a production serving stack | Good minimal research harness, not production-ready |

## Target Architecture

Future architecture, only after explicit approval:

```text
iOS post-capture Photo Advisor
  -> explicit consent
  -> backend Photo Advisor endpoint
  -> metadata strip + size/type limits
  -> self-hosted VLM adapter
  -> structured PhotoAdvisor JSON
  -> backend schema/language/safety/filter validation
  -> safe fallback for invalid/unsafe/timeout output
  -> iOS renders through existing language pack/result card
```

Key boundaries:

- iOS uploads an image only after explicit post-capture consent.
- Camera live view remains local-only.
- iOS never receives model credentials.
- iOS never calls the model server directly.
- Backend strips metadata and enforces image size/type limits before inference.
- The VLM must return structured PhotoAdvisor JSON, not freeform markdown.
- Backend validates model output against the existing Photo Advisor provider language contract.
- Unsupported filter IDs, unsafe copy, overlong text, score/rating language, raw debug leakage, chain-of-thought, and sensitive inference must fallback safely.
- The app renders accepted or fallback output through the existing Photo Advisor language pack and result card model.

## Structured Output Contract

Future self-hosted VLM output should remain compatible with the existing backend-mediated Photo Advisor contract:

- schema version
- locale
- post-capture mode / source mode
- short mood headline
- short visual reason / mood summary
- visual observations
- recommended filter IDs from the existing whitelist only
- filter reason: safe photo signal + retro aesthetic result
- optional refinements
- optional crop / straighten / retake advice where appropriate
- creative intent notes that preserve style
- fallback / safety state where needed

The backend remains the enforcement point. Provider/model output is never trusted directly.

## Safety And Privacy Requirements

Future implementation must preserve these boundaries:

- No raw image, base64 image, prompt with image content, request payload, model response, provider response, API key, Authorization header, stack trace, unsafe model text, GPS, or raw EXIF in logs or committed reports.
- Local samples and generated reports stay ignored.
- User-photo training and fine-tuning require explicit future consent, a curated dataset policy, and separate review.
- Sensitive inference remains forbidden: face, skin, age, gender, attractiveness, beauty, emotion, health, identity, ethnicity, religion, disability, body judgment, and other protected or identity-adjacent claims.
- Capture context is not uploaded unless a later explicit phase approves a schema, privacy review, and QA plan.

## Evaluation Plan

Phase 19-B should define a local / ignored benchmark sandbox, not app integration.

Initial evaluation metrics:

- JSON validity rate
- schema validation rate
- fallback rate
- unsafe response rate
- unsupported filter ID count
- overlong text count
- language contract violations
- filter reason quality
- English / Traditional Chinese / Simplified Chinese / Cantonese-style quality
- latency p50 / p90 / p95 / max
- memory / GPU requirements
- timeout and provider/server error count
- redaction and artifact safety checks

Evaluation should reuse Phase 18-B QA assets:

- provider language contract
- provider contract regression fixtures
- synthetic-contract QA mode
- dry-run gate
- review thresholds
- gate summary helper
- operator runbook
- copy regression scripts

Passing a local VLM benchmark is not production approval.

## Future Fine-tuning Path

Do not train from scratch.

If baseline prompting is not enough, use this order:

1. Prompt and schema tuning.
2. Curated evaluation dataset with synthetic and approved local samples.
3. Manual multilingual language review.
4. LoRA / QLoRA experiment only after the baseline, privacy, QA, artifact, and consent gates are ready.
5. Adapter / checkpoint versioning before any internal comparison.

Training data rules:

- curated
- consented
- non-sensitive
- metadata-stripped
- no user-photo training by default
- no private or identifying content unless a future explicit policy approves it
- no use of provider QA reports containing raw output

## Phase 19-B Recommendation

Recommended next phase:

```text
Phase 19-B: Open-weight VLM Local Sandbox / Benchmark Plan
```

Recommended Phase 19-B scope:

- choose one local hardware target
- define ignored model-cache / sandbox artifact paths
- define benchmark commands as docs or scripts that do not run by default
- compare Qwen2.5-VL-7B against one smaller candidate if feasible
- use synthetic fixtures first
- optionally use approved ignored local samples only
- produce sanitized aggregate benchmark notes only
- do not integrate with iOS
- do not change backend provider request payloads
- do not change iOS upload payloads
- keep `productionReady=false`

## Open Questions

- What GPU / Apple Silicon / cloud GPU target should the first benchmark assume?
- Which model license and deployment terms are acceptable for internal photo QA?
- Should Phase 19-B test Ollama first for speed, or vLLM / SGLang first for serving realism?
- What quantization level is acceptable before language quality degrades?
- Which server stack provides the strongest structured JSON enforcement for the chosen checkpoint?
- How will Cantonese-style and Traditional Chinese copy be judged in a repeatable evaluation set?
- What is the minimum acceptable p95 latency for internal debug use before future integration?

## Source Notes

Official docs and model cards checked during this ADR:

- Qwen2.5-VL-7B-Instruct model card: https://huggingface.co/Qwen/Qwen2.5-VL-7B-Instruct
- Qwen2-VL-7B-Instruct model card: https://huggingface.co/Qwen/Qwen2-VL-7B-Instruct
- Qwen VL GitHub repository: https://github.com/QwenLM/Qwen2.5-VL
- MiniCPM-V repository: https://github.com/OpenBMB/MiniCPM-V
- MiniCPM-V-2_6 model card: https://huggingface.co/openbmb/MiniCPM-V-2_6
- vLLM OpenAI-compatible server docs: https://docs.vllm.ai/en/latest/serving/openai_compatible_server/
- SGLang docs: https://docs.sglang.ai/

Re-check current model cards, licenses, serving support, and security guidance before any implementation phase.

