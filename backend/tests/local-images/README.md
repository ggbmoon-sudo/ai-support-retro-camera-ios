# Local Photo Advisor QA Images

Place small, non-sensitive JPEG files in this folder when running local provider QA.

Rules:

- Do not commit real QA images.
- Do not use private user photos.
- Do not use unapproved private faces.
- Strip EXIF / GPS metadata before testing.
- Keep images small; the backend rejects oversized payloads.
- Generated reports are written to `backend/reports/provider-qa/` and are ignored.
