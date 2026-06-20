# Phase 21-C-R1 - Depth Anything Model Artifact Source and Xcode Benchmark Harness Approval Gate

Status: completed
Date: 2026-06-21
Production readiness: `productionReady:false`

## Summary

Phase 21-C-R1 adds an approval gate for the next possible Depth Anything V2 Small step: verifying model artifact source/license and defining an Xcode/device benchmark harness before any model artifact, Core ML package, inference run, or benchmark is added.

This phase is gate-only. It does not approve execution by itself.

## Scope

- Adds a backend no-runtime gate for model artifact/source/license and Xcode benchmark harness policy.
- Adds a sanitized CLI report for the gate.
- Adds tests that block unsafe model artifacts, downloads, Core ML runtime, inference, benchmark execution, camera integration, uploads, raw logging, sensitive inference, and `productionReady:true`.
- Records that model source must be verified by bucket only; no raw source URL or local model path is committed.

## Required Future Conditions

A future model-artifact / benchmark-harness phase must require:

- verified model source bucket.
- model card review.
- license review.
- checksum bucket.
- local ignored artifact policy.
- no committed model artifact.
- no automated model download unless separately approved.
- Xcode physical-device benchmark, not simulator-only.
- hardware AVFoundation depth first.
- sanitized aggregate metrics only.
- stop conditions for thermal, Low Power Mode, memory warning, FPS regression, raw-artifact risk, and `productionReady:true`.

## Future Benchmark Metrics

- model load time bucket.
- first inference latency bucket.
- warmed inference latency bucket.
- peak memory bucket.
- preview FPS impact bucket.
- thermal state bucket.
- battery drain bucket.
- depth stability bucket.
- invalid output rate bucket.
- app size increase bucket.

## Not Added

- Depth Anything model artifact: no.
- Core ML package: no.
- Model download: no.
- Xcode benchmark harness runtime: no.
- Inference execution: no.
- Benchmark run: no.
- Camera runtime integration: no.
- Preview-frame upload: no.
- Camera live cloud AI entry: no.
- iOS provider/model key or direct provider/model call: no.
- Backend/iOS upload payload change: no.
- Raw frame/depth/image/path logging or persistence: no.
- Production rollout: no.

## Verification

Run from the repo root:

```powershell
cd backend
npm run qa:depth-anything:artifact-gate
node --test tests/depth-anything-v2-small-model-artifact-benchmark-harness-gate.test.mjs
```

The CLI output is sanitized and reports:

- `artifactHarnessGateEligible:true`
- `networkCallsMade:false`
- `modelCallsMade:false`
- `productionReady:false`

## Next Recommendation

If continuing Depth Anything, the next phase should be `Phase 21-C-R2 - Approved Local-Ignored Depth Anything Model Artifact and Xcode Benchmark Harness Draft`.

That phase still must not commit model artifacts or run inference unless explicitly approved with exact source/license/checksum/local-ignore and Xcode physical-device benchmark boundaries.
