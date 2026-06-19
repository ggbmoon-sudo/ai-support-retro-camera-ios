# Phase 21-Y-R1: Asia-first RunPod Region Selection Gate

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Y-R1 adds the Asia-first product constraint to the RunPod/Qwen3 target runtime plan. The initial service audience is Korea, Taiwan, and Hong Kong, so the next RunPod deployment prep must evaluate user-perceived latency from Asia-near regions rather than treating the cheapest US/EU GPU as the first baseline.

This addendum does not provision RunPod, create cloud resources, install/download/load/call `Qwen3-VL-30B-A3B`, run model calls, run benchmarks, call inference endpoints, modify iOS runtime, store credentials, or change `productionReady:false`.

## Asia-first Region Gate

- Initial user regions: Korea, Taiwan, Hong Kong.
- `userRegionBucket`: `korea_taiwan_hong_kong`
- `backendRegionPreference`: `asia_near`
- `gpuRegionPreference`: `asia_near`
- Product serving path remains post-capture batch/queue Photo Advisor.
- Live camera / real-time cloud analysis remains out of scope.
- US/EU GPU latency must not be treated as the first user-latency baseline.

## Provider and GPU Decision

Primary target remains RunPod on-demand A100 80GB if Asia-near availability and cost are acceptable.

Region preference:

1. Japan/Tokyo-like or Korea/Seoul-like Asia-near region if available.
2. Singapore-like Asia region if Japan/Korea-like capacity is unavailable.
3. US West only as a cost/functionality fallback, not the Asia latency baseline.

Fallback plan:

- RunPod H100 80GB Asia-near short benchmark only if A100 latency fails or A100 Asia availability is poor.
- 48GB GPU only for a later quantized experiment, not the first `Qwen3-VL-30B-A3B` target baseline.
- Vast.ai only as a later cheap experiment, not the first trusted beta baseline.
- Lambda/AWS/GCP only as later reliability/compliance/cost comparison, not the initial cheap path.

No real provider region ID, RunPod pod ID, raw URL, account ID, credential, API key, provider token, or SSH key is committed.

## Phase 21-Z Selection Gate

Before any provisioning, Phase 21-Z must verify and document:

- RunPod A100 80GB availability in an Asia-near region.
- Current price at provisioning time.
- Estimated daily 2-3 hour cost.
- Storage/cache cost estimate.
- Whether Asia-near A100 is available.
- Fallback decision if Asia-near A100 is unavailable or not affordable.
- No public inference endpoint.
- Budget hard stop.
- Manual kill switch.
- No committed credentials.

Phase 21-Z remains no-provisioning by default unless separately approved.

## Latency and Cost Measurement Additions

Future benchmarks must measure end-to-end Asia user perspective:

- App/user region bucket.
- Backend region bucket.
- GPU region bucket.
- Queue wait bucket.
- Cold-start bucket.
- Warm-start bucket.
- p50/p95 result-ready time.
- Cost per accepted result.

The batch/queue UX can tolerate seconds-to-minutes better than live camera. Live camera cloud AI remains a separate future architecture.

## Localization QA Additions

Future Qwen3 benchmark review should include:

- Hong Kong Traditional Chinese tone.
- Taiwan Traditional Chinese tone.
- Korean output QA.
- English fallback only.
- No harsh retake-first language.
- No score/rating/aesthetic grading.
- No sensitive inference.

## Recommended Next Phase

`Phase 21-Z: Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls`

Later phases:

- `Phase 21-Z1: Asia-first RunPod Instance Security + No-model Contract Gate`
- `Phase 21-Z2: Approved Qwen3-VL-30B-A3B 12-fixture Benchmark on RunPod A100 Asia-near`
- `Phase 21-Z3: A100 vs H100 Asia latency/cost decision`, if needed
- `Phase 22-A: Debug-only iOS Backend Integration Plan`, only after target-server benchmark review

## Boundary Confirmations

- RunPod resources created or modified: no.
- Cloud GPU provisioned: no.
- Provider credentials stored or committed: no.
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called: no.
- Model calls executed: no.
- Benchmark executed: no.
- Real inference endpoint called: no.
- Fixture inference run: no.
- vLLM/SGLang/Ollama installed or run: no.
- Serving stack switched in code: no.
- External Windows server runtime modified: no.
- iOS runtime changed: no.
- App-facing endpoint added: no.
- Production endpoint added: no.
- Camera live cloud AI runtime entry added: no.
- Auto-Trigger runtime added: no.
- WSS runtime added: no.
- iOS upload payload changed: no.
- Raw artifacts, prompts, outputs, payloads, provider tokens, API keys, SSH keys, RunPod IDs, raw URLs, account IDs, credentials, or secrets committed: no.
- `productionReady:false`.
