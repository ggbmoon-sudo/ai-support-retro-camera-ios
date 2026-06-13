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

export const SAFE_UNSAFE_DIAGNOSTIC_LABELS = Object.freeze([
  "appearance_or_identity_guard",
  "sensitive_attribute_guard",
  "banned_term_guard",
  "unknown_safety_guard"
]);

const SENSITIVE_INFERENCE_PATTERNS = Object.freeze([
  { pattern: /beauty\s*score/i, category: "appearance_or_identity_guard" },
  { pattern: /attractiveness\s*score/i, category: "appearance_or_identity_guard" },
  { pattern: /attractive(ness)?/i, category: "appearance_or_identity_guard" },
  { pattern: /beautiful\s+(person|people|face|skin|body|woman|man|girl|boy)/i, category: "appearance_or_identity_guard" },
  { pattern: /pretty\s+(person|people|face|skin|body|woman|man|girl|boy)/i, category: "appearance_or_identity_guard" },
  { pattern: /handsome/i, category: "appearance_or_identity_guard" },
  { pattern: /skin\s*(tone|texture|looks|appears|is)/i, category: "appearance_or_identity_guard" },
  { pattern: /face\s*(looks|appears|recognized|identified|detected)/i, category: "appearance_or_identity_guard" },
  { pattern: /body\s*(looks|appears|is|shape)/i, category: "appearance_or_identity_guard" },
  { pattern: /race\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /ethnicity\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /nationality\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /disability\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /gender\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /age\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /emotion\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /health\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /religion\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /sexuality\s*(is|looks|appears|detected)/i, category: "sensitive_attribute_guard" },
  { pattern: /identity\s*(is|looks|appears|detected|recognized)/i, category: "sensitive_attribute_guard" },
  { pattern: /美醜/, category: "appearance_or_identity_guard" },
  { pattern: /吸引力/, category: "appearance_or_identity_guard" },
  { pattern: /種族/, category: "sensitive_attribute_guard" },
  { pattern: /性別/, category: "sensitive_attribute_guard" },
  { pattern: /年齡/, category: "sensitive_attribute_guard" },
  { pattern: /情緒/, category: "sensitive_attribute_guard" },
  { pattern: /健康狀態/, category: "sensitive_attribute_guard" },
  { pattern: /宗教/, category: "sensitive_attribute_guard" },
  { pattern: /身份(辨識|識別|推斷)/, category: "sensitive_attribute_guard" }
]);

export function validateSafeTextOutput(value) {
  const texts = collectText(value);
  const joined = texts.join("\n");

  for (const term of BANNED_TERMS) {
    if (joined.includes(term)) {
      return invalid("unsafe_banned_term", "banned_term_guard");
    }
  }

  for (const { pattern, category } of SENSITIVE_INFERENCE_PATTERNS) {
    if (pattern.test(joined)) {
      return invalid("unsafe_sensitive_inference", category);
    }
  }

  return { ok: true };
}

export function bannedTermsForTests() {
  return [...BANNED_TERMS];
}

export function sanitizeUnsafeCategory(value) {
  return SAFE_UNSAFE_DIAGNOSTIC_LABELS.includes(value)
    ? value
    : "unknown_safety_guard";
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

function invalid(code, unsafeCategory = "unknown_safety_guard") {
  return {
    ok: false,
    error: {
      code,
      message: "Unsafe output was blocked",
      unsafeCategory: sanitizeUnsafeCategory(unsafeCategory)
    }
  };
}
