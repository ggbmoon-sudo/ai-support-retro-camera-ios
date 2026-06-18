# SGLang No-model Serving Contract Preflight

Status: Phase 21-R no-model contract preflight only  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-R defines a no-model SGLang serving contract preflight so the repo can reason about a future SGLang serving path before any SGLang runtime exists.

This phase does not install, start, or call SGLang. It does not run a model call, Qwen inference, fixture inference, serving benchmark, serving-stack switch, endpoint work, iOS integration, or production rollout.

SGLang is only a future structured-output/performance challenger. vLLM remains the primary future benchmark candidate. Transformers+FastAPI remains the correctness/reference path until benchmarked. Ollama/LM Studio remains manual-only and not production.

The Phase 21-N-R1E accepted one-fixture result is not production readiness. It proved one accepted local/private backend path for `smoke_001`, but it used one fixture, one call, zero retries, one server path, and latency bucket `gt_15s`. That latency bucket is a key reason serving-stack benchmarking may be needed later, after explicit approval.

Any future SGLang model call, SGLang endpoint call, SGLang server startup, model download, or benchmark requires separate explicit user approval.

## Future SGLang Contract Assumptions

- Backend-mediated only.
- No iOS direct SGLang call.
- No iOS model/provider keys.
- No public, cloud, ngrok, or tunnel endpoint.
- No raw prompt logging.
- No raw model output logging.
- No raw image, base64, or path logging.
- No request payload persistence.
- No server log leakage.
- Structured candidate JSON only.
- Backend validator, fallback, and safety gates remain source of truth.
- `productionReady:false`.

## Future SGLang Request Boundary

Allowed sanitized/request-planning fields only:

- Request ID bucket or opaque ID.
- Fixture token or approved upload token.
- Source type.
- Output contract version.
- Model class bucket.
- Serving stack bucket: `sglang_challenger`.
- Quantization class bucket.
- Max output tokens bucket.
- Timeout bucket.
- Schema version.
- `productionReady:false`.

Blocked fields:

- Raw image path.
- Raw base64 image.
- Raw original photo.
- Raw prompt.
- Raw provider/model output.
- Raw request payload.
- Provider/model API key.
- Server URL printed in tracked docs.
- GPS/location.
- Raw EXIF.
- Raw sensor stream.
- Capture-context upload.
- Score/rating request.
- Sensitive inference request.
- Chain-of-thought request.
- Debug/provider leakage fields.

## Future SGLang Response Boundary

Allowed:

- Structured candidate JSON.
- Sanitized latency bucket.
- Sanitized validation result.
- Sanitized fallback category.
- Model class bucket.
- Serving stack bucket.
- `rawOutputPersisted:false`.
- `rawOutputPrinted:false`.
- `productionReady:false`.

Blocked:

- Raw model text directly to UI.
- Chain-of-thought.
- Debug traces.
- Provider payload.
- Logits/token details.
- Raw prompt.
- Raw image or base64.
- Score/rating.
- Sensitive inference.

## Backend Gate

Phase 21-R adds:

```sh
npm run qa:open-weight-vlm:sglang-contract-preflight
```

The CLI is no-model and no-network. It validates dry-run scenarios only:

- Safe no-model SGLang contract plan passes.
- Model call, benchmark, SGLang server start, SGLang endpoint call, model download, serving switch, and `productionReady:true` block.
- Public/ngrok/tunnel endpoint classes block.
- Raw prompt, output, request payload, image, base64, path, EXIF/GPS/sensor, provider-debug, server-log, and persistence flags block.
- Missing structured JSON, validator, fallback, or safety requirements block.
- Free-form raw model text output blocks.
- iOS direct call/key, app/prod endpoint, and Camera live cloud entry block.
- Text-only model class, score/rating, sensitive inference, and chain-of-thought block.

## Boundary Confirmation

Phase 21-R does not run SGLang, call a SGLang endpoint, run a model call, run Qwen inference, run fixture inference, run a serving benchmark, switch serving stack, call vLLM/Ollama, add iOS integration, add an endpoint, add Auto-Trigger runtime, add WSS runtime, add upload runtime, commit raw artifacts, commit secrets, or change production readiness.

## Next Recommended Phase

Phase 21-S: Serving Stack No-model Comparison Matrix

Phase 21-S must remain no-model unless separately approved. It should not run SGLang inference, vLLM inference, Ollama inference, model calls, fixture inference, serving benchmarks, model downloads, serving-stack switches, endpoint work, iOS integration, or production rollout.
