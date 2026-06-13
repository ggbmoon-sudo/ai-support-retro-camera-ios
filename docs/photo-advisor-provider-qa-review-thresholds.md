# Photo Advisor Provider QA Review Thresholds

Phase: 18-B4
Status: Internal/debug QA policy only

This document defines how to review sanitized Photo Advisor provider QA metrics from synthetic-contract mode and future optional real-provider QA runs.

It does not enable production cloud AI, does not add iOS provider keys, does not add iOS direct provider calls, does not add a Camera cloud AI entry, does not upload capture context, and does not change backend provider request payloads or iOS upload payloads.

Production rollout remains blocked. `productionReady` must remain `false`.

## Review Principle

Provider QA measures whether backend-mediated provider output follows the app-owned Photo Advisor voice:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

Provider output must not regress into:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

The review is a gate for internal QA quality. Passing this gate is not production approval.

## QA Status Categories

Use these categories when reviewing a sanitized QA run.

| Status | Meaning | Production implication |
| --- | --- | --- |
| `pass_for_synthetic_contract` | Synthetic fixtures ran without network/API keys; invalid and unsafe cases rejected or fell back safely; report redaction passed. | Still not production-ready. |
| `needs_review` | No hard blocker, but one or more warning thresholds were triggered. | Investigate before more real-provider QA. |
| `blocked_for_safety` | Sensitive inference, abusive copy, score/rating, harsh fix-it wording, chain-of-thought, provider/debug leakage, or unsafe text passed validation. | Blocks production. |
| `blocked_for_schema` | Invalid JSON/schema, missing required fields, overlong display text, or invalid response shape reached an accepted path. | Blocks production until fixed. |
| `blocked_for_filter_integrity` | Unsupported `filterId`, raw filter-family ID, or invented filter reached accepted/displayable output. | Blocks production. |
| `blocked_for_language_contract` | Output violates Observation -> Mood -> Retro intent -> Optional action, uses Score -> Problem -> Fix -> Retake, or becomes generic AI critique. | Blocks production. |
| `blocked_for_artifact_leakage` | Raw image/base64, raw prompt, request payload, provider response, secret, GPS/raw EXIF, stack trace, unsafe text, real photo, or generated report is logged, persisted, staged, or committed. | Blocks production and blocks commit until cleaned. |
| `blocked_for_provider_integration` | Provider QA runs without explicit `--run-provider`, without internal/debug guard, with tracked credentials, or with missing/unsafe config behavior. | Blocks provider QA and production. |
| `not_production_ready` | Default status for all Phase 18-B4 QA results. | Production remains blocked. |

## Hard Blockers

Any of the following blocks production and should stop the review until fixed:

- Raw image data, base64 image data, raw prompt, request payload, raw provider response, Authorization header, API key, provider secret, stack trace containing provider text, or unsafe provider text is logged or persisted.
- Real photos, approved real samples, provider reports, generated reports, screenshots, recordings, local QA reports, or device-specific artifacts are staged or committed.
- GPS/location or raw EXIF is collected or persisted.
- Unsupported `filterId` is accepted as valid output.
- Score/rating language passes validation.
- Sensitive inference passes validation, including face, skin, age, gender, attractiveness, beauty, emotion, mental state, health, identity, ethnicity, race, religion, nationality, disability, sexuality, body, or protected-attribute wording.
- Chain-of-thought, provider/debug/system details, raw stack traces, or raw provider leakage pass validation.
- Raw localization keys appear in displayable output.
- Raw filter-family IDs appear in displayable output unless a future UI phase explicitly makes that string user-facing.
- iOS contains a provider API key.
- iOS directly calls QweAPI, Gemini, OpenAI, Code0, Intenext, or any future provider endpoint.
- Camera adds AI Snapshot, Quick Advice, Cloud AI, cloud upload, or provider-backed capture entry.
- iOS upload payload changes without explicit approval.
- Backend provider request payload changes without explicit approval.
- Capture context upload is added without explicit approval.
- `productionReady` is `true`.
- Synthetic-contract QA fails.
- Redaction checks fail.

## Warning Thresholds

Warnings do not automatically block internal QA, but they must be reviewed before expanding the provider run or planning production.

| Metric | Warning threshold | Review action |
| --- | --- | --- |
| `invalidJsonCount` | greater than 0 | Inspect prompt/parser contract and retry behavior using sanitized categories only. |
| `invalidSchemaCount` | greater than 0 | Review schema mapping and provider prompt field instructions. |
| `fallbackCount` | unexpectedly high for the image set or scenario group | Identify repeated scenario/fallback categories. |
| `timeoutCount` | greater than 0 | Review provider latency, image size, network conditions, and timeout behavior. Do not simply raise timeout. |
| `providerErrorCount` | greater than 0 | Confirm fallback stays safe and no raw provider error is exposed. |
| `overlongTextCount` | greater than 0 | Tighten prompt/validator length expectations. |
| `unsupportedFilterCount` | greater than 0 | Treat as hard blocker if unsupported filters are accepted; otherwise investigate rejected cases. |
| repeated `fallbackByCode` in one scenario group | greater than 1 repeated cause | Review the scenario/prompt/safety behavior before larger QA. |
| `p95LatencyMs` | above 10000 ms for internal QA | Mark `needs_review`; investigate image size, provider latency, and user experience. |
| `p95LatencyMs` | above 20000 ms | Blocks production planning until repeated runs are understood. |
| `maxLatencyMs` | above 30000 ms | Treat as timeout-risk; review cancellation and fallback UX. |
| locale mismatch | any confirmed mismatch in user-visible output | Review prompt locale instruction and fallback localization. |
| manual language/filter-fit concern | any reviewer concern | Keep internal-only and tune prompt/copy before production planning. |

Latency thresholds are internal review thresholds only. They do not approve production.

## Synthetic-contract QA Acceptance

Synthetic-contract QA can be marked `pass_for_synthetic_contract` only when:

- It runs without network access.
- It requires no provider API key.
- It uses committed synthetic B1 fixtures only.
- Valid fixture cases are accepted.
- Invalid JSON and markdown-prose cases are rejected or mapped to fallback.
- Invalid schema cases are rejected or mapped to fallback.
- Unsupported filter cases are rejected.
- Overlong text cases are rejected.
- Unsafe/sensitive/provider-leaking cases are rejected.
- Provider unavailable and timeout fixtures map to safe fallback.
- The report includes sanitized aggregate metrics only.
- Redaction checks pass.
- `payloadLoggingDisabled: true`.
- `rawImagePersisted: false`.
- `rawPromptPersisted: false`.
- `rawProviderResponsePersisted: false`.
- `reportContainsRawUserContent: false`.
- `productionReady: false`.

Passing synthetic-contract QA means the contract fixture path is healthy. It does not mean the real provider is production-ready.

## Optional Real-provider QA Acceptance

Real-provider QA may be reviewed only when all pre-run gates pass:

- The operator intentionally runs with `--run-provider`.
- Local provider credentials exist only in ignored local env/config.
- Approved real samples, if used, are consented, metadata-stripped, local-only, and ignored.
- Generated reports remain ignored.
- Console output remains sanitized.
- Raw image/base64, raw prompt, request payload, raw provider response, unsafe provider text, API key, Authorization header, GPS/raw EXIF, and stack traces are not logged or persisted.
- The same backend validators and safe-text guard used by production route code are applied.
- Fallback output is structured, app-safe, and free of raw provider errors.
- `productionReady: false`.

A real-provider QA run can be considered acceptable for continued internal testing only when:

- No hard blocker is present.
- Unsupported filter count is 0.
- Safety failures that reach accepted/displayable output are 0.
- Redaction flags all show no raw persistence/leakage.
- Fallback count is explainable by sanitized categories.
- Locale behavior and language quality have manual review notes.
- p95/max latency are recorded and reviewed.

Passing real-provider QA is still not production approval. Production requires a later explicit phase covering cost guard, abuse guard, privacy review, monitoring, rollout UX, App Store-facing copy, cancellation behavior, and product approval.

## Next-phase Readiness

Ready for additional internal QA when:

- Synthetic-contract QA passes.
- Dry-run gate passes.
- No hard blocker is present.
- Warning thresholds are documented with a review owner or follow-up.
- Generated reports and local samples remain ignored.
- Backend request payload and iOS upload payload are unchanged.

Not ready for production when:

- Any Phase 18-B4 run exists. This phase always remains `not_production_ready`.
- Any warning threshold is unresolved.
- Any manual language/filter-fit review is incomplete.
- Cost, abuse, privacy, monitoring, and product rollout gates are not complete.

## Reviewer Checklist

For each QA report, reviewers should record:

- run mode: synthetic-contract or real-provider
- image set: fixture, synthetic local, approved real sample, or none
- total cases
- success count
- fallback count
- fallback by code/category
- invalid JSON/schema counts
- unsupported filter count
- unsafe response count
- overlong text count
- provider error/timeout counts
- p50/p90/p95/max latency, if provider run
- locale/language concerns
- filter reason fit concerns
- crop/framing usefulness concerns
- redaction flags
- artifact status
- final status category

Do not paste raw provider output, raw prompts, request payloads, image data, private filenames, or generated report contents into committed docs.

## Commands

Safe synthetic contract QA:

```sh
cd backend
npm run qa:photo-advisor
```

Dry-run gate:

```sh
cd backend
npm run qa:photo-advisor:gate
```

Real-provider QA, internal only:

```sh
cd backend
npm run qa:photo-advisor:provider -- --image-set=approved-real
```

Real-provider QA must remain optional, explicit, local, ignored, and internal/debug only.
