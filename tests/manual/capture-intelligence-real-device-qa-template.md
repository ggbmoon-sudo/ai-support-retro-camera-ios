# Capture Intelligence Real-device QA Result Template

Copy this file to a local ignored notes location before filling it in. Do not commit filled-in reports unless a future phase explicitly approves sanitized QA artifacts.

Do not paste photos, raw EXIF, raw sensor values, raw JSON, provider output, personal data, secrets, or API keys into this template.

## Session

- Device model:
- iOS version:
- Build configuration: DEBUG / RELEASE
- Test date:
- Reviewer initials or local-only reviewer id:
- Camera permission state:
- App version / branch:

## Scenario Result

- Scenario name:
- Source: captured / imported
- Selected filter:
- Preview filter:
- Level bucket observed: level / slight tilt / strong tilt / unknown
- Motion bucket observed: stable / slight motion / shaky / unknown
- Light bucket observed: low / balanced / bright / unknown
- Blur hint bucket observed: low / medium / high / unknown
- Creative intent mode observed: preserve style / optional refinement / technical hint / unknown
- Advisor opened: yes / no
- Advisor advice was intent-aware: yes / no
- Advisor defaulted to retake or fix-it: yes / no
- DEBUG preview safe: yes / no / not applicable
- Lifecycle issue observed: yes / no
- Backend upload observed: yes / no
- Raw sensor / EXIF / JSON visible: yes / no
- Identity-adjacent or sensitive wording visible: yes / no
- Notes:

## Local-only Artifact Reminder

- Do not attach real test photos to this report.
- Do not paste raw EXIF, raw sensor values, image payloads, or provider text.
- Keep filled-in reports local unless a later safe-asset policy explicitly approves committing sanitized QA results.
