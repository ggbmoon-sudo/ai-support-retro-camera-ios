# Open-weight VLM Structured Advisor Benchmark Plan

Status: Proposed benchmark plan; documentation only
Date: 2026-06-14
Phase: 19-B

## Goal

Define a repeatable benchmark plan for evaluating open-weight VLMs as future structured Photo Advisor backends.

This phase does not add runtime model server code, backend request payload changes, iOS upload payload changes, app integration, real-provider QA, real VLM QA, or fine-tuning.

The benchmark must test whether candidate models can produce safe, structured, backend-validated Photo Advisor candidate JSON that preserves the app voice:

```text
Observation -> Mood -> Retro intent -> Optional action
```

It must reject or fallback anything that regresses into:

```text
Score -> Problem -> Fix -> Retake
```

## Inputs Read For This Plan

This plan incorporates:

- `docs/open-weight-vlm-backend-architecture-adr.md`
- Open-weight VLM Candidate Report for Retro Photo Advisor App
- VLM Serving Stack Report for Self-hosted Retro Photo Advisor Backend
- Photo Advisor Fine-tuning Dataset + Evaluation Report
- Phase 18-A app-side language pack / filter reasons / CreativeIntentGuard / result-card rules
- Phase 18-B provider language contract, regression fixtures, QA runner, thresholds, gate helper, and operator runbook
- Phase 18-C post-capture Advisor beta hardening baseline

## Non-goals

Phase 19-B does not approve or implement:

- production rollout
- iOS app integration
- Camera live cloud AI
- Camera cloud AI entry points
- iOS provider/model keys
- iOS direct model/provider calls
- iOS upload payload changes
- backend provider request payload changes
- capture-context upload
- real-provider QA
- real VLM QA
- model server code
- model downloads or model cache changes
- raw image / base64 / prompt / model response / request payload logging
- GPS/location collection
- raw EXIF dumps or persistence
- training or fine-tuning
- user-photo training without explicit future consent

`productionReady` remains `false`.

## Candidate Model List

| Candidate | Phase 19-B role | Why it enters the benchmark plan | Main risk to measure |
| --- | --- | --- | --- |
| Qwen2.5-VL-7B-Instruct | First prototype | Best balance of 7B scale, Chinese capability, structured-output direction, and serving ecosystem | JSON reliability, safety, latency, Cantonese-style label consistency through app rendering |
| Qwen3-VL-8B-Instruct | Structured JSON challenger | Newer Qwen VL family, stronger long-context / OCR / spatial claims, useful as a stricter schema-following challenger | Newer dependency risk, latency, production stability, exact serving compatibility |
| MiniCPM-V 4.5 | Efficiency / fine-tune / edge-path candidate | Apache-2.0, smaller-efficiency direction, multi-language support, quantization / GGUF / Ollama / vLLM / SGLang / LLaMA-Factory ecosystem | Whether it matches Qwen quality for retro mood, filter family, and schema compliance |
| InternVL3-8B | Optional secondary challenger | Strong VLM benchmark ecosystem, Apache-2.0, Qwen language backbone in common variants | More complex pipeline; may not beat Qwen on app-specific JSON / language-contract behavior |

Qwen2-VL-7B is no longer a first-batch requirement. It may remain an older regression baseline only if Phase 19-C has spare benchmark capacity.

## Serving Stack Plan

| Serving stack | Phase 19-B role | Use | Not for |
| --- | --- | --- | --- |
| Transformers + FastAPI | Correctness / reference path | Verify exact Hugging Face checkpoint behavior and model-specific preprocessing before comparing serving engines | Production serving, concurrency benchmark truth |
| Ollama / LM Studio | Local smoke / manual QA only | Quick local prompt checks, manual one-image experiments, product-language review | Production, automated gate, final benchmark truth |
| vLLM | Primary internal benchmark serving stack | OpenAI-compatible internal benchmark, batching / throughput, structured-output experiments, metrics, LoRA path evaluation | Direct app contract; still must sit behind backend validator |
| SGLang | Performance / structured-output challenger | Compare multimodal structured output, latency, throughput, and adapter path against vLLM | Direct app contract; still must sit behind backend validator |

Serving stack is an implementation detail behind the backend. It must never become the iOS app contract.

## Benchmark Dataset Scope

Start with approved synthetic / internal fixtures only.

Allowed early sources:

- synthetic test images
- internally created non-sensitive samples
- licensed / curated public or stock samples, if license is documented
- approved internal sample photos that remain ignored and untracked

Forbidden:

- user photos
- raw private photos committed to git
- social-media scraped photos without license
- GPS/raw EXIF retention
- face/person identity labels
- sensitive attribute labels
- generated real-run reports committed to git

Initial scenario categories:

| Group | Required scenarios |
| --- | --- |
| Normal lighting/style | bright scene, warm indoor light, cool quiet tone, balanced clean photo |
| Retro creative intent | intentional blur, slight motion, tilt / snapshot, grain / night grain, high contrast, faded color, soft focus |
| Composition | background clutter, negative space, centered clean framing, crop suggestion, optional straighten |
| Imported behavior | imported limited context, imported low light, imported faded color, imported framing suggestion |
| Severe technical risk | severe blur, black image, severe underexposure, severe overexposure |
| Contract/safety | unsupported filter, prompt injection, request for score/rating, request for chain-of-thought, sensitive inference bait, provider/debug leakage bait |

The benchmark should use image IDs and scenario IDs that contain no private names or locations.

## Structured VLM Candidate JSON

Model output should be candidate JSON only. The model should not write final UI prose.

The app language pack renders final English / Traditional Chinese / Simplified Chinese / Cantonese-style copy.

Docs-only candidate shape:

```json
{
  "schemaVersion": "photo_advisor_vlm_candidate.v1",
  "analysisMode": "post_capture",
  "sourceType": "captured",
  "allowedContext": "captureContextAvailable",
  "moodKey": "mood.dreamy_soft",
  "visualObservationKeys": [
    "signal.low_light",
    "signal.soft_motion"
  ],
  "creativeIntent": {
    "classification": "acceptable_imperfection",
    "preserveSignals": ["low_light", "soft_motion"]
  },
  "technicalRisk": {
    "level": "mild",
    "reasonKey": null
  },
  "filter": {
    "family": "night_grain",
    "reasonKey": "filter.night_grain.low_light_mood"
  },
  "composition": {
    "cropKey": null,
    "straightenKey": null
  },
  "optionalActionKeys": [
    "action.keep_low_light_mood",
    "action.hold_steady_if_cleaner"
  ],
  "retakeAdvice": {
    "shouldRetake": false,
    "riskLevel": "low",
    "reasonKey": null
  },
  "safety": {
    "sensitiveInferenceDetected": false,
    "forbiddenInferenceTypes": [],
    "promptInjectionDetected": false
  }
}
```

Schema rules for Phase 19-C implementation:

- `additionalProperties: false`
- enum / key-based values only
- no final UI prose
- no markdown
- no score/rating
- no chain-of-thought
- no provider/debug/system details
- no raw localization keys shown to UI without app resolver
- no unsupported `filterId`
- model recommends `filter.family`; backend maps to whitelisted app filter IDs
- imported photos use `allowedContext: "imageOnly"`
- imported photos must not claim capture-time motion, tilt, focus, lens, stability, or exposure conditions

## Validator And Fallback Responsibilities

Backend validator responsibilities:

- parse JSON
- validate schema version
- enforce `additionalProperties: false`
- enforce enum whitelist
- validate `sourceType` against request context
- validate `allowedContext`
- reject imported-photo capture-context overclaims
- map filter family to whitelisted app filter IDs
- reject unsupported filter IDs
- enforce max array sizes
- enforce retake gate
- run sensitive-inference / banned-text / provider-leakage / chain-of-thought scans
- reject score/rating or harsh fix-it wording
- fallback on invalid JSON, invalid schema, unsupported filter, unsafe output, timeout, provider/server error, or overlong output

App responsibilities:

- render final localized copy through the existing language pack
- keep result card mood-first and concise
- avoid raw model keys in production UI
- avoid provider/source/debug labels in production UI
- keep retake lower priority and optional

## Benchmark Metrics

Functional metrics:

- valid JSON rate
- schema pass rate
- `additionalProperties` violation count
- enum whitelist pass rate
- sourceType / allowedContext pass rate
- fallback rate
- invalid JSON count
- invalid schema count
- unsupported filter count
- timeout / provider-server error count
- overlong output count

Advisor quality metrics:

- filter family match
- creative intent preservation
- retake false positive rate
- imported-context overclaim count
- visual observation relevance
- retro mood fit
- optional refinement usefulness
- fallback calmness
- multilingual key consistency

Safety metrics:

- accepted sensitive inference count
- score/rating violation count
- chain-of-thought leakage count
- provider/debug leakage count
- harsh fix-it / retake-first count
- raw localization key / raw family ID display risk count
- prompt-injection handling count

Performance / ops metrics:

- latency p50 / p90 / p95 / max
- cold-start load time
- image preprocessing time if available
- output token count
- VRAM peak or model loading notes if available
- quantization / precision mode
- GPU type
- model revision and serving stack version

## Pass / Fail Gates

Hard blockers:

- accepted sensitive inference
- accepted score/rating
- accepted chain-of-thought
- accepted provider/debug/system leakage
- accepted unsupported filter
- imported photo capture-context overclaim
- raw model prose used as production UI
- raw localization key or raw filter-family ID shown in production UI
- raw image/base64/prompt/model response/request payload/secrets logged or persisted
- real photos, local samples, provider reports, screenshots, recordings, or generated reports staged/committed
- iOS provider/model key or direct model/provider call
- Camera cloud AI entry
- backend provider request payload change without explicit approval
- iOS upload payload change without explicit approval
- capture-context upload without explicit approval
- `productionReady=true`

Warning thresholds for internal review:

- invalid JSON count > 0
- schema failure count > 0
- fallback rate unexpectedly high on normal scenarios
- timeout / server error count > 0
- overlong output count > 0
- filter family top-1 match below target
- creative intent preservation below target
- retake false positive above target
- p95 latency above internal review target
- repeated failures by scenario group
- locale / key consistency drift

Suggested initial targets for benchmark planning:

- valid JSON rate: >= 99.5% before any release-candidate discussion
- schema pass rate: >= 99%
- unsupported filter accepted: 0
- accepted sensitive inference: 0
- imported-context overclaim: 0
- retake false positive: < 2%
- creative intent preservation: >= 95%
- filter family top-1: >= 80%, top-2 acceptable: >= 92%
- p95 latency internal target: track at < 10-12s before deeper integration discussion

Passing these gates is not production approval.

## Future Phase 19-C Implementation Sketch

Expected future files/scripts, if Phase 19-C is explicitly approved:

- `docs/open-weight-vlm-local-sandbox-runbook.md`
- `backend/tests/fixtures/vlm-structured-advisor-cases.json`
- `backend/schemas/photo-advisor-vlm-candidate.v1.schema.json`
- `backend/src/vlm/validatePhotoAdvisorVLMCandidate.mjs`
- `backend/scripts/run-photo-advisor-vlm-benchmark.mjs`
- `backend/scripts/check-photo-advisor-vlm-benchmark-report.mjs`
- ignored `backend/reports/vlm-benchmark/`
- ignored `backend/tests/vlm-local-samples/`
- ignored model cache / sandbox paths documented in `.gitignore`

Expected Phase 19-C behavior:

- local / ignored benchmark sandbox only
- synthetic fixtures first
- no iOS app integration
- no production endpoint
- no real user photos
- no raw model outputs committed
- no training or fine-tuning
- `productionReady=false`

## Fine-tuning Readiness Position

Do not start LoRA / QLoRA yet.

Fine-tuning becomes worth discussing only after:

- prompt/schema tuning has been tested on at least two candidate models
- a fixed benchmark dataset exists
- safety red-team cases exist
- JSON/schema failures remain > 1-2% after prompt/schema work
- retake false positives remain > 2-3%
- imported-context overclaim still appears
- filter family top-1 remains below target
- multilingual key consistency is below target
- at least 1,500 high-quality structured examples exist, preferably 3,000+

Training data must be curated, consented, non-sensitive, metadata-stripped, versioned, and deletable. User photos are not training data by default.

## Phase 19-C Recommendation

Recommended next phase:

```text
Phase 19-C: Open-weight VLM Local Benchmark Harness Plan
```

Keep Phase 19-C narrow:

- define local ignored benchmark fixture folders
- add committed synthetic text/JSON fixtures only
- add a schema/validator if explicitly approved
- add docs-only or no-network smoke commands first
- do not run real models unless explicitly approved
- do not integrate iOS
- do not change backend/iOS payloads
- keep production rollout blocked

