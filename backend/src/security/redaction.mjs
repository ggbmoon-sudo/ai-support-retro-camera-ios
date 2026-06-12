export function redactedOperationalMetadata({ endpoint, mode, schemaVersion, status, latencyMs, image }) {
  return {
    endpoint,
    mode,
    schemaVersion,
    status,
    latencyMs,
    imageSizeBucket: imageSizeBucket(image)
  };
}

function imageSizeBucket(image) {
  if (!image || !Number.isFinite(image.width) || !Number.isFinite(image.height)) {
    return "unknown";
  }

  const pixels = image.width * image.height;
  if (pixels < 300_000) {
    return "small";
  }
  if (pixels < 1_200_000) {
    return "medium";
  }
  return "large";
}
