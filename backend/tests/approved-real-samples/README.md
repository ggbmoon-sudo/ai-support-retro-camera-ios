# Approved Real Photo Advisor QA Samples

Use this ignored folder for local-only approved real sample photos when running internal/debug provider QA.

Rules:

- Do not commit real sample photos.
- Use only photos explicitly approved for internal QA.
- Do not use private or sensitive content unless it has explicit internal testing approval.
- Strip EXIF / GPS metadata before testing.
- Keep files small; the backend rejects oversized payloads.
- Use JPEG files only.
- Use descriptive, non-personal filenames such as `street-night-approved-01.jpg`, `indoor-flat-light-approved-01.jpg`, or `busy-background-approved-01.jpg`.
- Generated QA reports are written to `backend/reports/provider-qa/` and are ignored.

Run approved real samples:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=approved-real
```

Run synthetic plus approved real samples:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --run-provider --image-set=all
```

Manual review notes should use `backend/tests/local-images/manual-review-template.json` and must not include raw image data, base64 payloads, private photo details, provider raw responses, API keys, EXIF, GPS, or face data.
