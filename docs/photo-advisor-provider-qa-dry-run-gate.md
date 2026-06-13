# Photo Advisor Provider QA Dry-run Gate

Phase: 18-B3
Status: Internal/debug QA gate only

This gate is for controlled real-provider Photo Advisor QA. It does not enable production cloud AI, does not add iOS provider credentials, does not add a Camera cloud entry, does not upload capture context, and does not change the iOS upload payload.

Real-provider QA must measure whether provider output still follows:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

It must reject, fallback, or block review if provider output drifts into:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

## Pre-run Gate

Before any real-provider QA run, confirm:

- B0 provider language contract is current.
- B1 provider contract regression fixtures pass.
- B2 sanitized QA report checks pass.
- Backend tests pass.
- `node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract` passes.
- Provider credentials exist only in ignored local env/config.
- No provider credentials are tracked by git.
- Approved real sample photos are consented for internal QA.
- Approved real sample photos are local-only, ignored, metadata-stripped JPEGs.
- `backend/tests/approved-real-samples/` is ignored.
- `backend/tests/local-images/` is ignored except committed README/template files.
- `backend/reports/provider-qa/` is ignored.
- The operator will not commit photos, generated reports, screenshots, recordings, debug exports, or device-specific artifacts.
- The operator will not log or paste raw image/base64, prompts with image data, request payloads, provider responses, unsafe provider text, secrets, GPS/raw EXIF, or provider stack traces.
- `productionReady` must remain `false`.

Run the dry-run gate:

```sh
cd backend
node scripts/run-photo-advisor-provider-qa.mjs --check-safety-gate
```

The gate prints only sanitized status, selected image-set policy, provider configured yes/no, and required operator confirmations.

## Safe Synthetic Run

Synthetic-contract QA is the default safe verification path:

```sh
cd backend
node scripts/run-photo-advisor-provider-qa.mjs --synthetic-contract
```

Expected behavior:

- no API key required
- no network request
- no real photo
- no raw prompt
- no raw provider response
- sanitized report written to ignored `backend/reports/provider-qa/photo-advisor-qa-report.json`
- `productionReady: false`

Synthetic-contract metrics may be recorded as aggregate counts only:

- total cases
- success count
- fallback count
- validation failure categories
- unsafe response count
- invalid JSON / schema / unsupported filter / overlong text counts
- timeout / provider error counts
- `productionReady: false`

Do not commit the generated report.

## Real-provider Run Gate

Run real-provider QA only when all conditions are true:

- local ignored provider credentials already exist
- internal provider mode is explicitly enabled locally
- approved sample photos are local, ignored, consented, and metadata-stripped
- the operator has confirmed this is an internal/debug QA run
- generated reports are ignored
- no raw payload, prompt, provider response, unsafe text, or secret will be logged or persisted

Real-provider QA requires explicit opt-in:

```sh
cd backend
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=approved-real
```

Synthetic local images may be used instead:

```sh
cd backend
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=synthetic
```

If `--run-provider` is omitted, the runner fails closed and sends no provider request.

## Post-run Gate

After any QA run:

- inspect only sanitized aggregate metrics
- confirm the report contains `payloadLoggingDisabled: true`
- confirm `rawImagePersisted: false`
- confirm `rawPromptPersisted: false`
- confirm `rawProviderResponsePersisted: false`
- confirm `reportContainsRawUserContent: false`
- confirm `productionReady: false`
- confirm no raw image/base64, prompt, request payload, provider response, unsafe provider text, auth header, API key, GPS/raw EXIF, or provider stack trace appears in console or report
- confirm generated reports remain ignored/untracked
- confirm real photos remain ignored/untracked
- confirm git status contains only intended source/docs changes
- delete ignored local reports if they are no longer needed

## Internal QA Thresholds

These are review gates, not production approval:

- any redaction failure blocks the run
- any raw leakage blocks production
- any unsupported filter count above zero blocks production
- any unsafe response count above zero blocks production
- any invalid JSON/schema count above zero requires investigation before production
- fallback count must be explainable before production
- timeout count must be tracked and reviewed
- p50/p90/p95/max latency are measured but do not approve production
- `productionReady` must remain `false` in Phase 18-B3

Production rollout requires a separate explicit phase with cost guard, abuse guard, privacy review, monitoring, App Store-facing UX review, and product approval.

## Artifact Policy

Do not commit:

- real photos
- local synthetic QA images unless a future safe-asset policy approves them
- generated provider QA reports
- provider raw responses
- provider prompts with image data
- screenshots
- simulator recordings
- debug exports
- device-specific QA artifacts
- `.env` or local env files

Allowed committed files:

- synthetic provider contract fixtures
- README/checklist/template docs
- test code that uses synthetic text/JSON only

