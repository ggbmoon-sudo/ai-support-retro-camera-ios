export function nowMs() {
  return Date.now();
}

export function elapsedMs(startMs, endMs = nowMs()) {
  return Math.max(0, endMs - startMs);
}
