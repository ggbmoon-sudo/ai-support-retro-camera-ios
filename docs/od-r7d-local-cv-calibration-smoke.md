# OD-R7D Local CV Calibration Smoke

Phase OD-R7D adds a backend/local-only ignored local fixture calibration smoke for the OD-R7B Local CV Feature Extractor prototype and OD-R7C fixture gate.

This phase is the first approved local-AI phase that may read one ignored local fixture image, but only after an ignored local config explicitly enables the smoke, approves fixture mode, allows image reads, limits the run to `maxFixtureCount:1`, and approves exactly the `calibration_001` fixture token.

The default CLI remains safely blocked when `backend/config/aesthetic-local-cv-calibration-fixtures.local.json` is absent. The committed example config stays disabled, and the real local config remains ignored.

## Runtime Boundary

- Backend/local-only.
- No iOS runtime integration.
- No Swift files.
- No Xcode project changes.
- No Camera behavior change.
- No Camera live cloud AI.
- No provider/cloud/Xiaoyi relay call.
- No network call.
- No upload/download/crawler.
- No model/Core ML/ONNX/TFLite/weight file.
- No training/fine-tuning.
- No app runtime transfer.
- No production rollout.
- `productionReady:false`.

## Local Fixture Policy

The only approved runtime fixture location for this phase is:

```text
backend/tests/local-cv-calibration-fixtures/
```

The ignored local config must remain uncommitted and use:

```json
{
  "schemaVersion": "aesthetic_local_cv_calibration_smoke_config.v1",
  "enabled": true,
  "allowImageReads": true,
  "approvedFixtureMode": true,
  "approvedFixtureTokens": ["calibration_001"],
  "fixtureRoot": "backend/tests/local-cv-calibration-fixtures",
  "maxFixtureCount": 1,
  "allowReportWrite": false,
  "allowNetworkCalls": false,
  "allowUploads": false,
  "productionReady": false
}
```

Real fixture images, local config, and generated calibration reports must stay ignored and untracked.

## Sanitized Output

The CLI prints a sanitized JSON summary only. It may include the safe fixture token, reviewed feature keys, deterministic feature buckets, calibration warnings, and disabled execution flags.

It must not print raw image paths, image bytes, base64, EXIF/GPS, raw image metadata, raw debug dumps, generated report paths, user-identifying content, provider payloads, prompts, or secrets.

## Verification

Run from `backend/`:

```bash
npm test
npm run qa:aesthetic-local-cv:calibration-smoke
```

Without the ignored local config and fixture, the CLI should exit successfully as safely blocked with `imageReadsPerformed:false`.

If an approved ignored local config and exactly one approved local fixture exist, the CLI may read only `calibration_001`, emit sanitized in-memory feature output, write no reports, and keep all runtime, network, upload, provider, training, app-transfer, and production flags disabled.

## Next Step

Future OD-R7E may compare calibration output against expected feature ranges after manual review. It should remain backend/local-only, ignored-fixture scoped, sanitized, and blocked from iOS runtime transfer unless a later explicit product integration gate approves otherwise.
