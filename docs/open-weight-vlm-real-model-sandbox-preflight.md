# Open-weight VLM Real-model Sandbox Preflight

Status: Preflight plan only
Date: 2026-06-14
Phase: 19-F

## Goal

Define the safety gate before any future real-model sandbox for open-weight VLM Photo Advisor benchmarking.

Phase 19-F does not add runtime model calls, model server code, model server URL config, provider/model credentials, iOS integration, backend provider request payload changes, iOS upload payload changes, real photos, training, fine-tuning, or production rollout.

The current approved path remains synthetic/stubbed only. A later Phase 20-A must explicitly approve any local/self-hosted model call before it happens.

## Phase 20-A May Safely Do Later

Only if explicitly requested, Phase 20-A may introduce a backend-only local/self-hosted VLM sandbox for benchmark research.

Allowed later scope:

- backend-only benchmark sandbox
- local/self-hosted VLM endpoint calls only through ignored local config
- approved local test images only
- explicit operator opt-in before any real-model run
- sanitized aggregate metrics only
- schema validation through the existing open-weight VLM candidate contract
- synthetic benchmark and gate must pass before any real-model test
- no iOS integration
- no production endpoint
- no Camera cloud AI entry
- no production rollout

Not allowed without a separate explicit phase:

- iOS app integration
- public endpoint
- production Photo Advisor rollout
- Camera live or cloud AI
- iOS provider/model keys
- iOS direct model/provider calls
- backend provider request payload changes
- iOS upload payload changes
- capture-context upload
- training or fine-tuning
- user-photo training
- committing real photos, local images, model outputs, or generated reports

## Candidate Models

First-batch candidates for a future sandbox:

| Candidate | Role | Preflight note |
| --- | --- | --- |
| Qwen2.5-VL-7B-Instruct | First prototype | Preferred first correctness benchmark if local hardware can support it. |
| Qwen3-VL-8B-Instruct | Structured JSON challenger | Use to compare schema-following behavior after the first prototype path is stable. |
| MiniCPM-V 4.5 | Efficiency / fine-tune / edge-path candidate | Useful for smaller hardware, later LoRA/QLoRA research, and latency/cost comparison. |
| InternVL3-8B | Optional secondary challenger | Use only if resources allow and the first three candidates leave a clear gap. |

All model use must pass license, local hardware, privacy, and artifact-safety review before running.

## Serving Paths

Allowed later serving paths:

| Serving path | Role | Boundary |
| --- | --- | --- |
| Transformers + FastAPI | Correctness/reference path | Useful for checkpoint behavior and preprocessing inspection; not a production serving claim. |
| vLLM | Primary internal benchmark stack | Candidate for throughput and OpenAI-compatible internal benchmark experiments. |
| SGLang | Performance / structured-output challenger | Candidate for structured generation and adapter-path evaluation. |
| Ollama / LM Studio | Local smoke / manual QA only | Useful for quick local checks; not an automated gate or production benchmark by itself. |

Serving stack details must remain backend-only. iOS must never call these services directly.

## Ignored Local Config Rules

Future real-model sandbox config must be local and ignored.

Required rules:

- model server URL must live only in ignored local config
- no model server URL committed to source, docs examples, or package scripts as an active runtime config
- no provider/model credentials committed
- no `.env` committed
- no private/local model weight path committed
- no local model cache committed
- no generated benchmark reports committed unless a later phase explicitly approves a sanitized artifact
- no raw request payload or raw model response file committed

Recommended future ignored locations:

- `backend/.env`
- `backend/.env.local`
- `backend/reports/vlm-benchmark/`
- `backend/tests/vlm-local-samples/`
- `backend/tests/generated-images/`

Phase 20-A should verify or add ignore rules before creating any local config or report path.

## Approved Local Image Fixture Policy

Future real-model tests may use only approved local images.

Rules:

- no user photos by default
- no private real photos committed
- no raw image artifacts in git
- local images must stay under an ignored folder
- image names should be non-sensitive and scenario-based
- metadata stripping is required before model requests in any later real-model phase
- no GPS/location or raw EXIF persistence
- no face/person identity labels
- no sensitive attribute labels
- no generated local report may include raw image paths, raw prompts, raw model output, or user-identifying content

Synthetic JSON/text fixtures remain the default safe verification path.

## Runtime Safety Preflight

Before any later real-model request is allowed, the operator must confirm:

- synthetic benchmark passes
- synthetic gate reports no hard blockers
- local config is ignored
- local sample folder is ignored
- operator explicitly opts into a real-model run
- generated report folder is ignored
- raw prompt logging is disabled
- raw model response logging is disabled
- raw image/base64 logging is disabled
- local image path logging is disabled or sanitized
- request payload logging is disabled
- stack traces containing model output are not persisted
- GPS/raw EXIF persistence is disabled
- aggregate sanitized metrics are the only report output

Report output may include:

- run mode
- model candidate bucket
- serving stack bucket
- total cases
- accepted/rejected counts
- expectation pass/fail counts
- validation categories
- fallback categories
- latency summaries
- `productionReady:false`
- `providerConfigured:false`
- `networkCallsMade:true` only if a later phase explicitly approves local/self-hosted model calls

Report output must not include:

- raw image
- base64 image
- raw prompt
- raw request payload
- raw model response
- provider/model credentials
- secrets
- exact private image path
- GPS/location
- raw EXIF
- face/person identity descriptors
- chain-of-thought
- unsafe model text
- stack traces containing model output

## Phase 20-A Hard Gates

Phase 20-A must stop immediately if any of these occur:

- synthetic benchmark fails
- synthetic gate has hard blockers
- local config is not ignored
- local sample folder is not ignored
- operator did not explicitly opt in
- generated report path is not ignored
- raw image/base64/prompt/request/model output is logged or persisted
- provider/model credential is printed or committed
- GPS/raw EXIF is persisted
- iOS upload payload changes
- backend provider request payload changes
- capture context upload is added
- Camera cloud AI entry appears
- public endpoint is added
- production endpoint is enabled
- `productionReady:true`
- training or fine-tuning starts
- user-photo training is attempted

Network calls are allowed only to an explicitly configured local/self-hosted model server in ignored local config, and only if Phase 20-A explicitly approves that run. Phase 19-F does not approve network/model calls.

## Local Operator Checklist

Before any future Phase 20-A real-model sandbox:

- [ ] GPU/runtime is ready outside the repo.
- [ ] Model weights are downloaded outside the repo.
- [ ] Local model cache is outside git or ignored.
- [ ] Local config is ignored.
- [ ] Approved local images are in an ignored folder.
- [ ] Images are non-sensitive and approved for internal QA.
- [ ] Metadata stripping path is defined.
- [ ] Synthetic benchmark passes.
- [ ] Synthetic gate reports no hard blockers.
- [ ] Operator explicitly opts into a real-model run.
- [ ] Report output is sanitized aggregate metrics only.
- [ ] No generated report, image, model output, prompt, payload, or credential is staged.

## Phase 20-A Readiness Recommendation

Phase 20-A is not production integration. It should be a backend-only local/self-hosted model sandbox if explicitly requested.

Recommended Phase 20-A scope:

- add ignored local config example only if safe
- add a backend-only adapter boundary for one local/self-hosted VLM endpoint
- require explicit `--run-local-model` or equivalent opt-in
- keep synthetic mode as the default
- run no model call unless local config and operator opt-in are present
- validate output through the existing open-weight VLM schema and gate
- write no generated reports unless ignored
- summarize only sanitized aggregate metrics

Production rollout remains blocked.
