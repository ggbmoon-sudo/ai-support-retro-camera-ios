# Photo Advisor Provider QA Chain Readiness

Phase: 18-B7
Status: Final B0-B6 provider QA chain audit

This document records whether the Phase 18-B provider QA safety chain is coherent enough to move into Phase 18-C: Post-capture Advisor Beta Hardening.

It does not enable production cloud AI, add iOS provider keys, add iOS direct provider calls, add a Camera cloud AI entry, upload capture context, or change backend provider request payloads / iOS upload payloads.

Production rollout remains blocked. `productionReady` must remain `false`.

## B0-B6 Chain Status

| Phase | Artifact | Status |
| --- | --- | --- |
| B0 provider language contract | `docs/photo-advisor-provider-language-contract.md` | Complete. Defines app voice, schema alignment, prompt/validator/fallback contract, and fixture plan. |
| B1 regression fixtures | `backend/tests/fixtures/provider-contract-regression-cases.json`, `backend/tests/cloud-ai-boundary.test.mjs` | Complete. Synthetic valid/invalid/provider-failure fixtures protect app voice, schema, filter whitelist, safety, and fallback parity. |
| B2 QA runner/report alignment | `backend/scripts/run-photo-advisor-provider-qa.mjs`, `backend/src/qa/photoAdvisorQAReport.mjs` | Complete. Synthetic-contract mode runs without credentials/network; reports are sanitized and keep `productionReady=false`. |
| B3 dry-run gate | `docs/photo-advisor-provider-qa-dry-run-gate.md`, `npm run qa:photo-advisor:gate` | Complete. Real-provider QA is explicit opt-in and gated by local ignored credentials/samples. |
| B4 review thresholds | `docs/photo-advisor-provider-qa-review-thresholds.md` | Complete. Defines hard blockers, warnings, synthetic acceptance, and optional real-provider acceptance. |
| B5 gate helper | `backend/scripts/check-photo-advisor-provider-qa-gate.mjs`, `npm run qa:photo-advisor:review` | Complete. Reads sanitized report JSON and emits hard blockers/warnings/reviewed metrics only. |
| B6 operator runbook | `docs/photo-advisor-provider-qa-operator-runbook.md` | Complete. Documents safe operator sequence, stop conditions, never-commit artifacts, skipped-run reporting, and pre-integration checklist. |

## Consistency Audit

The Phase 18-B chain is internally consistent:

- `backend/package.json` exposes the expected commands:
  - `npm run qa:photo-advisor`
  - `npm run qa:photo-advisor:gate`
  - `npm run qa:photo-advisor:review`
  - `npm run qa:photo-advisor:provider`
- `backend/tests/cloud-ai-boundary.test.mjs` covers provider contract fixtures, fallback parity, sanitized QA reports, synthetic-contract mode, real-provider opt-in, and the gate helper.
- `tests/manual-smoke-tests.md` has manual coverage for B0/B1/B3/B4/B5/B6/B7.
- `docs/photo-advisor-provider-language-contract.md`, `docs/photo-advisor-provider-qa-dry-run-gate.md`, `docs/photo-advisor-provider-qa-review-thresholds.md`, and `docs/photo-advisor-provider-qa-operator-runbook.md` all preserve the same internal/debug-only boundaries.
- `docs/phase-log.md` and `docs/handoff/codex-transition-handoff.md` record that production rollout remains blocked.

## Phase 18-C Readiness Criteria

Phase 18-C can start only when:

- B0-B6 verification passes.
- Backend tests pass.
- Synthetic provider QA passes.
- Dry-run gate passes.
- QA gate helper reports no hard blockers.
- Warnings are reviewed and documented.
- `productionReady` remains `false`.
- No real-provider QA is required for the phase start.
- No Camera cloud AI entry exists.
- No iOS provider key or direct provider call exists.
- Backend provider request payload is unchanged unless explicitly approved.
- iOS upload payload is unchanged unless explicitly approved.
- Capture context is not uploaded unless explicitly approved.
- Generated reports, real photos, local samples, screenshots, recordings, and device artifacts remain ignored/untracked.

## Readiness Decision

Phase 18-C is safe to start after this audit only as post-capture Advisor beta hardening / internal QA work.

Phase 18-C is not a production rollout, not a Camera cloud AI phase, and not an approval to upload capture context or change provider/iOS payloads.

Production rollout remains blocked until a separate explicit production rollout phase covers cost guard, abuse guard, privacy review, App Store-facing UX/copy, monitoring, cancellation/timeout behavior, quota, and product approval.
