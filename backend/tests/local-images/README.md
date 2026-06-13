# Local Photo Advisor QA Images

Place small, non-sensitive synthetic JPEG files in this folder when running local provider QA.

Rules:

- Do not commit synthetic QA images unless a future explicit asset policy approves them.
- Do not use private user photos.
- Do not use unapproved private faces.
- Strip EXIF / GPS metadata before testing.
- Keep images small; the backend rejects oversized payloads.
- Generated reports are written to `backend/reports/provider-qa/` and are ignored.

Run the synthetic set:

```sh
node scripts/run-photo-advisor-provider-qa.mjs --image-set=synthetic
```

Approved real sample photos belong in `backend/tests/approved-real-samples/`, not this folder.
