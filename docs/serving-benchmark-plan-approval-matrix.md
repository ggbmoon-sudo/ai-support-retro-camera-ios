# Serving Benchmark Plan Approval Matrix

Status: Phase 21-P approval matrix only  
Date: 2026-06-19  
Production readiness: `productionReady:false`

## Executive Summary

Phase 21-P creates the approval matrix for future serving benchmark plans after the accepted Phase 21-N-R1E one-fixture local/private smoke and the Phase 21-O execution scope gate.

This phase does not run a model call, Qwen inference, fixture inference, serving benchmark, vLLM/SGLang/Ollama call, serving-stack switch, iOS integration, endpoint, upload runtime, WSS runtime, Auto-Trigger runtime, raw artifact flow, or production rollout.

The accepted R1E smoke remains useful sandbox evidence only. It used one fixture, one call, one local/private route, zero retries, and had latency bucket `gt_15s`. It is not production readiness.

Future benchmark execution requires separate explicit user approval scoped to the benchmark type, fixture set, serving stack, call limit, retry policy, artifact policy, and reporting policy.

## Approval Matrix

| Benchmark type | Model call allowed | Benchmark allowed | Fixture scope | Approval requirement | Default Phase 21-P outcome |
| --- | --- | --- | --- | --- | --- |
| No-model contract preflight | no | no | 0 | no model-call approval required | allowed as normal next phase |
| One-fixture smoke | yes, only after approval | no broad benchmark | exactly 1 explicit approved fixture token | explicit model-call approval | blocked pending approval |
| Controlled 12-fixture benchmark | yes, only after approval | yes, narrowly scoped | exactly approved ignored fixture set | explicit benchmark approval | blocked pending approval |
| Serving stack comparison | yes, only after approval | yes, one stack at a time | explicit approved fixture set | explicit benchmark approval | blocked pending approval |
| Quantization benchmark | yes, only after approval | yes, controlled matrix | explicit approved fixture set | explicit benchmark approval | blocked pending approval |
| Live Advisor 1 FPS simulation | yes/upload simulation only after approval | simulation only | explicit approved scope | explicit Live Advisor approval | blocked pending approval |

## A. No-model Contract Preflight

- Model call allowed: no.
- Benchmark allowed: no.
- Fixture count: 0.
- Approval required: no, if no model call, no fixture inference, and no benchmark execution occurs.
- Allowed as a normal next phase for contract and CLI dry-run validation.
- Must print sanitized buckets only and keep `productionReady:false`.

## B. One-fixture Smoke

- Model call allowed: yes, only with explicit user approval naming the one-call scope.
- Fixture count: exactly 1.
- Call count: exactly 1.
- Retry count: 0 unless retry approval is separately explicit.
- Allowed fixture token must be explicit, approved, ignored, untracked, and unstaged.
- Sanitized report required.
- Raw prompt, raw model output, raw image path/content, base64, request payload, server logs, config contents, registry contents, and secrets are blocked.
- Raw output persistence and raw output printing are blocked.

## C. Controlled 12-fixture Benchmark

- Model call allowed: yes, only with explicit benchmark approval.
- Fixture count: exactly the approved ignored fixture set.
- Retry policy must be explicit.
- One serving stack at a time.
- Sanitized aggregate report only.
- Not allowed immediately after Phase 21-P unless separately approved by a future phase prompt.
- No raw report, raw logs, prompts, request payloads, image paths, model outputs, or credentials may be committed.

## D. Serving Stack Comparison

- Transformers+FastAPI is the current reference/local-operator baseline.
- vLLM is a future candidate and needs no-model contract preflight before any execution.
- SGLang is a future challenger and needs no-model contract preflight before any execution.
- Ollama/LM Studio is manual-only and is not approved as a production serving stack.
- No production serving switch is allowed without a separate gate.
- No public, cloud, ngrok, tunnel, app-facing, or production endpoint is allowed.

## E. Quantization Benchmark

- FP16/BF16 baseline must be established before production quantization claims.
- INT8 may be benchmarked only after explicit benchmark approval.
- AWQ may be benchmarked only after explicit benchmark approval.
- GPTQ may be benchmarked only after explicit benchmark approval.
- INT4 is stress-only after baseline evidence exists.
- No production quantization is allowed until benchmarked and separately approved.
- No vision encoder quantization production claim is allowed without evidence.

## F. Live Advisor 1 FPS Simulation

- No 30 FPS cloud video streaming.
- Maximum cadence: 1 FPS.
- Auto-Trigger capture/upload semantics require greater-than-1-second stillness.
- `<=1s` means no capture and no upload.
- WSS must not carry raw video.
- Any model call, upload simulation, or live simulation execution requires explicit approval.
- This matrix does not add Auto-Trigger runtime, WSS runtime, upload runtime, local CV runtime, or iOS integration.

## Required Safety and Reporting Constraints

- `productionReady:false` remains locked.
- Backend validator, fallback, and safety gates remain source of truth.
- Sanitized aggregate reports only.
- Raw prompt, raw model output, raw provider response, raw image content, raw image path, base64, request payload, server logs, EXIF/GPS/sensor data, local config contents, fixture registry contents, and secrets must not be printed or persisted.
- Ignored local config, fixture registry, fixture images, raw reports, logs, model outputs, prompts, request payloads, model weights, and credentials must not be committed.
- iOS direct provider/model calls, provider keys, upload payload changes, Camera cloud AI entries, app-facing endpoints, and production endpoints remain blocked.

## Backend Gate

Phase 21-P adds:

```sh
npm run qa:open-weight-vlm:serving-benchmark-approval-matrix
```

The CLI is no-model and no-benchmark. It validates dry-run scenarios only:

- No-model contract plan passes.
- One-fixture smoke without explicit approval blocks.
- One-fixture smoke with fixture-count or retry-scope violations blocks.
- Controlled 12-fixture, serving-stack comparison, quantization benchmark, and Live Advisor simulation without approval block.
- Raw output printing/persistence, `productionReady:true`, iOS integration, endpoints, public endpoints, unknown stack/kind, and Ollama/LM Studio production use block.

## Next Recommended Phase

Phase 21-Q: vLLM No-model Serving Contract Preflight

Phase 21-Q must remain no-model unless separately approved. It should not run vLLM inference, SGLang inference, Ollama inference, model calls, fixture inference, serving benchmarks, model downloads, serving-stack switches, endpoint work, iOS integration, or production rollout.
