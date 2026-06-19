# Phase 21-Z: Asia-first RunPod A100 Qwen3-VL Deployment Prep Without Model Calls

Status: Completed
Date: 2026-06-19
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-Z prepares the Asia-first RunPod A100 80GB deployment path for a later `Qwen3-VL-30B-A3B` benchmark without creating resources, provisioning GPU, installing/downloading/loading a model, calling inference, or running a benchmark.

The plan keeps Phase 21-W as the correctness baseline, keeps Phase 21-Y/Y-R1 as the target runtime decision, and defines the no-model readiness checklist for the next operator phase.

## Asia-first Service Audience

- Initial user regions: Korea, Taiwan, Hong Kong.
- `userRegionBucket`: `korea_taiwan_hong_kong`
- `backendRegionPreference`: `asia_near`
- `gpuRegionPreference`: `asia_near`
- Product serving path: post-capture batch/queue Photo Advisor.
- Live camera / real-time cloud analysis remains out of scope.
- US/EU GPU capacity is fallback only and must not be treated as the first Asia user-latency baseline.

## RunPod A100 80GB Target Assumptions

- Primary provider bucket: `runpod`
- Primary GPU bucket: `a100_80gb`
- Primary endpoint bucket: `private_cloud_gpu`
- Primary region preference: Asia-near if available and affordable.
- Preferred region shape: Japan/Tokyo-like or Korea/Seoul-like.
- Secondary Asia region shape: Singapore-like.
- US West is allowed only as cost/functionality fallback, not Asia latency baseline.
- No real provider region ID is committed in this phase.

## Qwen3-VL-30B-A3B Target Model Assumptions

- `modelCandidateBucket`: `qwen3_vl_30b_a3b`
- Current Qwen2.5 / existing Qwen VLM Transformers+FastAPI path remains correctness baseline only.
- `Qwen3-VL-30B-A3B` is not installed, downloaded, loaded, benchmarked, or called in Phase 21-Z.
- Future model install/download/load requires separate explicit approval.

## Asia-near Region Selection Checklist

Before any provisioning, document:

- `userRegionBucket:korea_taiwan_hong_kong`
- `backendRegionPreference:asia_near`
- `gpuRegionPreference:asia_near`
- RunPod A100 80GB Asia-near availability: yes/no/unknown.
- Current A100 80GB price at planning/provisioning time.
- Estimated daily 2-3 hour GPU cost.
- Estimated monthly cost.
- Storage/cache cost estimate.
- Cold-start risk bucket.
- Whether Japan/Tokyo-like or Korea/Seoul-like region is available.
- Whether Singapore-like region is available.
- Fallback if no Asia-near A100 is acceptable.
- US West allowed only as cost/functionality fallback, not Asia latency baseline.
- No public inference endpoint.
- Budget hard stop.
- Manual kill switch.
- No committed credentials.

Do not hardcode real region IDs unless a later separately approved provisioning phase verifies them and keeps secrets out of the repo.

## Provider / GPU Fallback Policy

Primary:

- RunPod on-demand A100 80GB in an Asia-near region if availability and cost are acceptable.

Fallback order:

1. RunPod H100 80GB Asia-near short benchmark if A100 latency fails or A100 Asia availability is poor.
2. RunPod A100 80GB US West only as cost/functionality fallback, not Asia latency baseline.
3. 48GB GPU only for a later quantized experiment, not first `Qwen3-VL-30B-A3B` baseline.
4. Vast.ai only as a later cheap experiment.
5. Lambda/AWS/GCP only as later reliability/compliance/cost comparison.

## No-model Deployment Prep Checklist

- Confirm the provider/GPU/region selection fields are documented as buckets only.
- Confirm the worker config is placeholder/example-only.
- Confirm no real provider URL, account ID, RunPod ID, SSH key, API key, token, model path, region ID, or credential exists in committed files.
- Confirm no RunPod resource is created or modified.
- Confirm no cloud GPU is provisioned.
- Confirm no model weights are downloaded.
- Confirm no model process is started.
- Confirm no inference endpoint is called.
- Confirm no fixture image is opened or inspected.
- Confirm `productionReady:false`.

## Cloud Security Checklist

- Private model server only.
- No public inference endpoint.
- No public unauthenticated control endpoint.
- No committed credentials.
- No credential values in logs.
- No raw RunPod URL in committed docs/config.
- No SSH private key in repo.
- Budget hard stop required before provisioning.
- Manual kill switch required before provisioning.
- Stop/start procedure required before paid beta.
- Raw prompt/output/payload/image path logging disabled.

## Network Exposure Checklist

- `allowPublicInference:false`
- Endpoint bucket must remain `private_cloud_gpu`.
- Healthz can expose sanitized readiness buckets only.
- Contract endpoints can return sanitized buckets only.
- No model server URL is committed.
- No public endpoint is added to app or backend in this phase.
- No iOS direct provider/RunPod call.

## Storage / Cache Checklist

- Estimate model storage/cache cost before provisioning.
- Document whether model cache persists across scheduled windows.
- Do not commit model path.
- Do not commit storage bucket ID.
- Do not commit raw image/cache path.
- Keep fixture registry/images ignored and unstaged.
- Keep generated reports sanitized or ignored.

## Batch / Queue Startup and Shutdown Checklist

- Scheduled 2-3 hour daily GPU window.
- Job queue limit.
- Queue paused state.
- Worker unavailable fallback.
- Per-user quota later.
- Result-ready UX later.
- Cost per accepted result measurement later.
- No live camera analysis.
- No WSS runtime.
- No Auto-Trigger runtime.
- No silent upload.
- Shutdown should stop worker/model server before the budget window closes.

## Budget Guardrail Checklist

- Current A100 80GB price verified at provisioning time.
- Daily 2-3 hour estimate documented.
- Monthly estimate documented.
- Storage/cache estimate documented.
- Queue/job cap documented.
- Manual kill switch documented.
- Budget hard stop documented.
- Production rollout blocked until explicit future approval.

## Localization QA Checklist

- Hong Kong Traditional Chinese tone.
- Taiwan Traditional Chinese tone.
- Korean output QA.
- English fallback only.
- No harsh retake-first language.
- No score/rating/aesthetic grading.
- No sensitive inference.

## No-raw-artifact Policy

Committed docs/config must not contain:

- Raw prompt.
- Raw model output.
- Raw request payload.
- Raw provider response.
- Raw image path.
- Base64 image content.
- Fixture registry contents.
- Fixture image data.
- Server logs.
- RunPod raw URL.
- Provider token.
- API key.
- SSH key.
- Account ID.
- Real region ID.
- Credential or secret.

## No-model Server Contract Plan

Future RunPod worker no-model contract should provide sanitized equivalents of:

- Healthz endpoint contract.
- No-model contract echo endpoint.
- No-model route-contract dry-run endpoint.
- Fixture-token-only benchmark interface.

Required sanitized error buckets:

- `unsupported_fixture_token`
- `missing_fixture_token`
- `model_not_loaded`
- `route_not_found`
- `unsafe_endpoint_bucket`
- `provider_integration_blocked`
- `benchmark_not_approved`
- `budget_window_closed`
- `worker_queue_paused`
- `region_unavailable`
- `provider_price_unverified`
- `cloud_resource_not_provisioned`

The contract must not return raw URL/path/prompt/output/payload/log fields.

## Future Benchmark Gate Requirements

Phase 21-Z2 requires separate explicit approval and must include:

- `Qwen3-VL-30B-A3B` install/download/load allowed only if approved.
- RunPod A100 80GB Asia-near target.
- Exact fixtures `smoke_004` through `smoke_015`.
- Call count `12`.
- Retry count `0`.
- Sanitized aggregate report only.
- Compare to Phase 21-W baseline.
- Include Asia user-perspective latency metrics.
- No iOS runtime change.
- `productionReady:false`.

## Next Recommended Phase

`Phase 21-Z1: Asia-first RunPod Instance Security + No-model Contract Gate`

Phase 21-Z1 should happen only after explicit user approval to inspect or provision a RunPod instance. It may later verify selected provider/GPU, selected region bucket, current price, budget guardrails, security settings, no public inference, no committed credentials, no-model healthz/contract endpoints, and no Qwen3 loaded unless separately approved.

## Boundary Confirmations

- RunPod resources created or modified: no.
- Cloud GPU provisioned: no.
- Provider account resources created: no.
- Provider credentials stored or committed: no.
- Qwen3-VL-30B-A3B installed/downloaded/loaded/called: no.
- Model weights downloaded: no.
- Model calls executed: no.
- Benchmark executed: no.
- Real inference endpoint called: no.
- Fixture inference run: no.
- Fixture images opened: no.
- EXIF/GPS/sensor data inspected: no.
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
- `productionReady:false`.
