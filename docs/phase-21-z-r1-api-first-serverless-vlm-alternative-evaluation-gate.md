# Phase 21-Z-R1 API-first Serverless VLM Alternative Evaluation Gate

Status: completed
Date: 2026-06-19
Phase type: docs-only re-evaluation gate
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z-R1 re-evaluates whether an API-first serverless VLM path should be considered before provisioning the Phase 21-Z RunPod A100 80GB self-hosted path.

The recommended near-term direction is to evaluate API-first providers first because the initial workload is post-capture or imported-photo advice, not live camera real-time analysis. A serverless API path may reduce startup complexity, idle GPU cost, and operator burden if pricing, privacy, latency, rate limits, terms, and structured-output quality pass later gates.

This phase does not adopt a provider, create keys, call APIs, provision cloud GPU, install models, run benchmarks, change iOS runtime, or modify upload payloads.

## Why API-first Is Being Reconsidered

- The initial workload is small-batch, stateless, post-capture Photo Advisor output rather than continuous live analysis.
- Phase 21-W proved the backend validator and schema pipeline can accept 12/12 controlled fixtures, but the local reference path is too slow for product real-time use.
- Phase 21-Y and Phase 21-Z planned a self-hosted RunPod A100 80GB path, but daily 2-3 hour GPU windows may be operationally heavier than an API-first beta workload.
- API-first may be cheaper for low-to-moderate beta usage if image-token billing, request minimums, failed-request billing, and rate limits are favorable.
- API-first may be simpler to operate if privacy, retention, cross-region, and structured-output requirements are acceptable.

## Why RunPod Remains Fallback and Comparison

RunPod A100 80GB remains the planned self-hosted fallback/comparison path. It is still useful if API-first providers fail privacy, quality, cost, latency, rate-limit, terms, structured-output, or availability requirements.

RunPod remains especially relevant for:

- dedicated benchmark reproducibility
- self-hosted model control
- future Qwen3-VL-30B-A3B evaluation
- fallback when API terms or data handling are not acceptable
- comparison against serverless cost per accepted result

No RunPod resource was created in this phase.

## Asia-first Service Context

- Primary user regions: Korea, Taiwan, Hong Kong
- `userRegionBucket:korea_taiwan_hong_kong`
- Product path: post-capture or imported-photo Photo Advisor
- Live camera real-time analysis: out of scope
- Sparse debug-only still snapshot advisor: possible only after separate approval
- Production rollout: blocked
- `productionReady:false`

Later provider checks must measure Hong Kong, Taiwan, and Korea user-perspective latency instead of treating US/EU latency as the default baseline.

## Workload Assumptions

- Input mode: post-capture or imported photo
- Image size class: 512px-class image
- Output: short structured Photo Advisor candidate JSON
- Request style: stateless backend-mediated call
- iOS provider access: none
- Raw provider text shown directly to app: no
- Backend validator: source of truth
- Fallback: required if provider output fails schema, safety, language, or sensitive-inference checks

## Provider Candidate Matrix

| Candidate | Role | Required Later Verification | Phase 21-Z-R1 Action |
| --- | --- | --- | --- |
| SiliconFlow | Candidate serverless VLM provider | Exact model list; Qwen3-VL, Qwen2.5-VL, Qwen2-VL, or InternVL availability; pricing; Hong Kong/Taiwan/Korea latency; rate limits; data retention/training policy; structured JSON behavior | No API call; candidate only |
| DashScope / Alibaba Cloud Model Studio / ?¿é??²ç™¾??| Candidate official Qwen ecosystem provider | Exact VLM model list; pricing; account/payment/region requirements; Hong Kong/Taiwan/Korea latency; data retention/training policy; structured JSON behavior | No API call; candidate only |
| RunPod A100 80GB | Self-hosted fallback/comparison path | Asia-near availability; current price; storage/cache cost; startup time; security; no-model contract; later approved benchmark | No provisioning; fallback/comparison retained |

## Cost Model Gate

Do not hardcode unverified provider prices as final facts. A later gate must verify pricing directly from provider materials or account console before any account setup, API call, benchmark, or purchase decision.

Required later pricing inputs:

- image input token count for a 512px-class image
- prompt input tokens
- output tokens
- input token price
- output token price
- minimum billing unit
- image token billing method
- failed request billing
- rate-limit throttling behavior
- free quota or monthly quota
- payment, currency, and invoice requirements

Formula-only estimate:

```text
estimatedCostPerImage =
  (imageInputTokens + promptInputTokens) * inputPricePerToken
  + outputTokens * outputPricePerToken
```

Later estimates must include:

- cost per 1,000 accepted images
- cost per 10,000 accepted images
- cost per active user session
- monthly beta cost
- comparison with RunPod 2-3 hour daily GPU windows
- failed/invalid response overhead
- cost per accepted validated Photo Advisor result

## Privacy, Legal, and Data-governance Gate

API-first means user photos would be processed by a third-party provider, so a later approval gate must verify:

- backend-only provider calls
- no iOS provider key
- no direct iOS provider call
- explicit user consent before real photo upload
- privacy policy update before beta
- provider terms review
- provider data retention review
- whether inputs or outputs are stored
- whether data may be used for training
- deletion and retention policy
- cross-region or cross-border data transfer disclosure
- Korea, Taiwan, and Hong Kong privacy review
- no raw image, base64, prompt, output, or request-payload logging
- no GPS, raw EXIF, or sensor persistence
- no sensitive inference
- no score, rating, beauty, attractiveness, demographic, identity, health, emotion, or protected-class inference

## Product Mode Decision

Initial API-first evaluation is limited to:

- post-capture Photo Advisor
- imported-photo Photo Advisor
- debug-only still snapshot advisor after separate approval

Not allowed by default:

- live camera cloud AI
- 0.8 FPS viewfinder upload
- silent upload
- WSS live runtime
- Auto-Trigger runtime
- background upload
- capture-context upload

If future sparse live analysis is desired, it needs a separate policy phase with explicit approval, compression/downscale policy, consent/off-state behavior, backoff, rate limiting, abuse prevention, and cost caps.

## Provider-agnostic Adapter Plan

A future adapter should remain backend-mediated and provider-agnostic.

Provider enum candidates:

- `siliconflow`
- `dashscope`
- `runpod_self_hosted_fallback`

Provider output must map into the existing Photo Advisor candidate JSON shape:

- `schemaVersion`
- `sourceType`
- `allowedContext`
- `moodKey`
- `visualObservationKey`
- `creativeIntent`
- `technicalRisk`
- `filterFamilyCandidate`
- `optionalActionKey`
- `retakeAllowed`
- `retakeReasonKey`
- `safety`

Raw provider text must never be shown directly to the app. The backend validator remains the source of truth, and invalid provider output must fall back safely.

## Future Benchmark Plan

Any future API VLM benchmark requires separate explicit approval and must define:

- candidate provider
- exact model candidate
- exact fixture set
- call count
- retry count
- budget cap
- no raw artifact policy
- sanitized aggregate report only
- Asia user-perspective latency buckets
- schema/safety/fallback metrics
- comparison with Phase 21-W and RunPod planning baselines
- `productionReady:false`

The expected controlled fixture set remains `smoke_004` through `smoke_015` only if explicitly approved in a future phase.

## Roadmap Decision

Primary direction for the next planning step:

- `Phase 21-Z2A: SiliconFlow / DashScope Account + Pricing + Terms Verification Gate`

Comparison branch if more provider-neutral analysis is needed first:

- `Phase 21-Z2: API vs RunPod Decision Gate Without Model Calls`

RunPod remains available as:

- `Phase 21-Z1: Asia-first RunPod Instance Security + No-model Contract Gate`

Later candidate phases:

- `Phase 21-Z2B: API Provider No-model Contract Adapter Gate`
- `Phase 21-Z2C: Approved 12-fixture API VLM Benchmark`
- `Phase 21-Z2D: API vs RunPod Cost/Latency/Privacy Decision`
- `Phase 22-A: Debug-only iOS Backend Integration Plan`

## Boundary Confirmation

- Provider API calls executed: no
- SiliconFlow API called: no
- DashScope / Alibaba Cloud API called: no
- API keys created: no
- API keys committed: no
- Provider SDK added to iOS: no
- Provider SDK runtime added to backend: no
- RunPod resources created: no
- Cloud GPU provisioned: no
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called: no
- Model calls executed: no
- Benchmarks executed: no
- Real inference endpoint called: no
- Images uploaded: no
- iOS runtime changed: no
- iOS upload payload changed: no
- Camera live cloud AI runtime added: no
- WSS runtime added: no
- Auto-Trigger runtime added: no
- Raw artifacts committed: no
- Provider credentials committed: no
- Secrets committed: no
- `productionReady:false`
