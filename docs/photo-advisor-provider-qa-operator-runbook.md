# Photo Advisor Provider QA Operator Runbook

Phase: 18-B6
Status: Internal/debug operator runbook only

This runbook explains how to run Photo Advisor provider QA safely before any future debug/internal remote advisor integration work.

It does not enable production cloud AI, add iOS provider keys, add iOS direct provider calls, add a Camera cloud AI entry, upload capture context, or change backend provider request payloads / iOS upload payloads.

Production rollout remains blocked. `productionReady` must remain `false`.

## Operating Principle

Provider QA is an internal validation workflow. It checks whether provider output follows:

1. Observation.
2. Mood.
3. Retro intent.
4. Optional action.

It must stop or fallback when output drifts into:

1. Score.
2. Problem list.
3. Correction command.
4. Retake-first advice.

Passing this runbook is not production approval.

## Pre-run Safety Checklist

Before running any provider QA command, confirm:

- B0 provider language contract is current.
- B1 provider regression fixtures pass.
- B2 sanitized report flow is current.
- B3 dry-run gate is available.
- B4 review thresholds are current.
- B5 gate summary helper is available.
- Provider credentials exist only in ignored local env/config.
- No provider credentials are tracked by git.
- Approved real sample photos, if used, are consented for internal QA.
- Approved real samples stay under ignored local folders.
- Generated provider QA reports stay under ignored local folders.
- Real photos, provider reports, screenshots, recordings, debug exports, and device-specific artifacts will not be committed.
- Raw image/base64, prompts, request payloads, provider responses, unsafe provider text, secrets, Authorization headers, GPS/raw EXIF, and stack traces will not be logged, pasted, or persisted.
- `productionReady` remains `false`.

## Required Local Inputs

### Ignored local credentials

Real-provider QA requires local ignored provider credentials and internal/debug config. Do not put these values in iOS source, committed docs, committed reports, or screenshots.

Use local ignored env/config only.

### Approved ignored sample folder

Approved real samples must be:

- consented for internal QA
- local-only
- ignored by git
- metadata-stripped where practical
- small enough for QA
- free of private or sensitive content unless explicitly approved for internal testing

Do not commit real sample photos.

## Commands

Run commands from `backend/`.

### 1. Synthetic-contract QA

```sh
npm run qa:photo-advisor
```

Expected:

- no API key required
- no network request
- no real photo
- sanitized report only
- `productionReady: false`

### 2. Dry-run safety gate

```sh
npm run qa:photo-advisor:gate
```

Expected:

- sanitized operator gate status
- ignored sample/report policy
- required operator confirmations
- `productionReady: false`

### 3. QA gate summary helper

```sh
npm run qa:photo-advisor:review
```

Expected safe output fields:

- `productionReady: false`
- `eligibleForDebugInternalReview`
- `statusCategories`
- `hardBlockers`
- `warnings`
- `reviewedMetrics`

The helper reads sanitized report JSON only. It must not print raw provider text, raw prompts, raw image/base64, request payloads, secrets, or real sample paths.

### 4. Optional real-provider QA

Run only when explicitly approved for the current run and all pre-run conditions pass:

```sh
npm run qa:photo-advisor:provider -- --image-set=approved-real
```

Synthetic local images may be used for internal provider behavior checks:

```sh
npm run qa:photo-advisor:provider -- --image-set=synthetic
```

If `--run-provider` is not present through the package script, the runner must fail closed and send no provider request.

## Reviewing Gate Helper Output

### `hardBlockers[]`

Stop immediately if any hard blocker is present.

Examples:

- artifact leakage
- redaction failure
- unsupported provider filter accepted
- unsafe response accepted
- payload logging not disabled
- `productionReady=true`
- provider integration guard failure

Do not continue to larger QA until hard blockers are fixed and verified.

### `warnings[]`

Warnings require review before expanding real-provider QA.

Examples:

- invalid JSON/schema count above 0
- timeout/provider error count above 0
- overlong text count above 0
- repeated fallback category
- high p95/max latency
- manual language/filter-fit review needed

Warnings do not approve production.

### `statusCategories[]`

Expected healthy synthetic status:

- `not_production_ready`
- `pass_for_synthetic_contract`

Possible review status:

- `needs_review`
- `blocked_for_safety`
- `blocked_for_schema`
- `blocked_for_filter_integrity`
- `blocked_for_language_contract`
- `blocked_for_artifact_leakage`
- `blocked_for_provider_integration`

Any blocked status stops production planning.

### `eligibleForDebugInternalReview`

`true` means the sanitized report has no hard blockers and can be reviewed internally.

It does not mean production-ready.

`false` means stop and fix the blocker before continuing.

## Stop Immediately When

Stop the run and do not commit generated artifacts if:

- any raw image/base64, prompt, request payload, provider response, unsafe provider text, secret, Authorization header, GPS/raw EXIF, or stack trace appears in console/report
- any real photo or generated provider report is staged
- real-provider QA runs without explicit opt-in
- local credentials are missing or not ignored
- approved samples are missing, unapproved, or not ignored
- provider output bypasses schema/safety/filter validation
- `productionReady` is true
- iOS source contains provider credentials or direct provider calls
- Camera adds a cloud AI entry
- backend/iOS payload changes are detected without explicit phase approval

## What Must Never Be Committed

Do not commit:

- real photos
- approved real samples
- generated provider QA reports
- local QA reports
- screenshots
- simulator recordings
- generated local QA images
- device-specific debug exports
- `.env` or local env files
- provider credentials
- raw prompts
- raw provider responses
- request payloads
- raw image/base64 content
- GPS/raw EXIF dumps

## Reporting Skipped Real-provider QA

If real-provider QA is skipped, report it plainly:

- skipped because local ignored credentials were unavailable
- skipped because approved ignored samples were unavailable
- skipped because operator approval was not provided for this run
- skipped because safety gate failed

Do not invent real-provider metrics.

## Final Pre-integration Checklist

Before any future debug/internal remote advisor integration phase starts, confirm:

- synthetic QA passes
- dry-run gate passes
- QA gate helper has no hard blockers
- warnings are reviewed and documented
- no raw artifact leakage occurred
- no provider reports or real photos are committed
- no iOS provider key or direct provider call exists
- no Camera cloud AI entry exists
- backend provider request payload is unchanged unless explicitly approved
- iOS upload payload is unchanged unless explicitly approved
- capture context is not uploaded unless explicitly approved
- `productionReady: false`
- production rollout remains blocked

If any item fails, do not start integration work.

