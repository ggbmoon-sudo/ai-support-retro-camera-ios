const BANNED_TERMS = Object.freeze([
  "屌",
  "你醜",
  "你肥",
  "你老",
  "你皮膚差",
  "你樣衰",
  "你個樣唔得",
  "你條廢物",
  "你有病",
  "你弱智",
  "你唔正常"
]);

const SENSITIVE_INFERENCE_PATTERNS = Object.freeze([
  /beauty\s*score/i,
  /attractiveness\s*score/i,
  /attractive(ness)?/i,
  /race\s*(is|looks|appears|detected)/i,
  /gender\s*(is|looks|appears|detected)/i,
  /age\s*(is|looks|appears|detected)/i,
  /emotion\s*(is|looks|appears|detected)/i,
  /health\s*(is|looks|appears|detected)/i,
  /religion\s*(is|looks|appears|detected)/i,
  /sexuality\s*(is|looks|appears|detected)/i,
  /identity\s*(is|looks|appears|detected|recognized)/i,
  /face\s*(recognized|identified)/i,
  /美醜/,
  /吸引力/,
  /種族/,
  /性別/,
  /年齡/,
  /情緒/,
  /健康狀態/,
  /宗教/,
  /身份(辨識|識別|推斷)/
]);

export function validateSafeTextOutput(value) {
  const texts = collectText(value);
  const joined = texts.join("\n");

  for (const term of BANNED_TERMS) {
    if (joined.includes(term)) {
      return invalid("unsafe_banned_term");
    }
  }

  for (const pattern of SENSITIVE_INFERENCE_PATTERNS) {
    if (pattern.test(joined)) {
      return invalid("unsafe_sensitive_inference");
    }
  }

  return { ok: true };
}

export function bannedTermsForTests() {
  return [...BANNED_TERMS];
}

function collectText(value) {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectText);
  }

  return [];
}

function invalid(code) {
  return {
    ok: false,
    error: {
      code,
      message: "Unsafe output was blocked"
    }
  };
}
