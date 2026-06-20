# Depth Anything V2 Small Local-only Artifact Folder

Status: local-only placeholder
Production readiness: `productionReady:false`

This folder is reserved for a future operator-provided local-only Depth Anything V2 Small Core ML artifact during an explicitly approved Xcode physical-device benchmark phase.

Rules:

- Do not commit model artifacts.
- Do not commit compiled model bundles.
- Do not commit checksums that reveal local paths.
- Do not commit raw source URLs.
- Do not automate model downloads from this app repo.
- Keep any future artifact local, ignored, and review-only.
- Use hardware AVFoundation depth first.
- Use sanitized aggregate benchmark buckets only.
- Do not log raw frames, raw depth maps, raw image paths, or raw model output.
- Keep `productionReady:false`.

Current phase adds only this placeholder and ignore policy. No model artifact is present.
