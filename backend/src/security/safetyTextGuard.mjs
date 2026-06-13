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

const APP_LANGUAGE_GUARD_PATTERNS = Object.freeze([
  { pattern: /\b\d{1,3}\s*\/\s*10\b/i, category: "unknown_safety_guard" },
  { pattern: /\b\d{1,3}\s*%\b/i, category: "unknown_safety_guard" },
  { pattern: /\b(score|rating)\b/i, category: "unknown_safety_guard" },
  { pattern: /\b(bad photo|wrong exposure|failed photo|retake this|retake it|must fix|please retake|out of focus)\b/i, category: "unknown_safety_guard" },
  { pattern: /\b(Try this filter|best filter|perfect filter)\b/i, category: "unknown_safety_guard" },
  { pattern: /\b(stack trace|traceback|exception|api endpoint|status code|http\s+\d{3})\b/i, category: "unknown_safety_guard" },
  { pattern: /水平錯誤|構圖錯誤|曝光錯誤|照片太暗|光線不足|噪點太多|對焦失敗|相片模糊|你手震/, category: "unknown_safety_guard" },
  { pattern: /\b(provider|system prompt|debug field|raw json|raw provider|chain[- ]?of[- ]?thought)\b/i, category: "unknown_safety_guard" },
  { pattern: /\badvisor\.[a-z0-9_.-]+/i, category: "unknown_safety_guard" },
  { pattern: /\b(warm_film|faded_pastel|cinematic_contrast|night_grain|soft_dream|street_chrome|amber_glow|cool_fade|classic_film)\b/i, category: "unknown_safety_guard" }
]);

const NON_DISPLAY_TEXT_KEYS = new Set([
  "action",
  "blockedReason",
  "code",
  "confidence",
  "consentVersion",
  "filterId",
  "id",
  "locale",
  "mode",
  "priority",
  "schemaVersion",
  "source",
  "type"
]);

export function validateSafeTextOutput(value) {
  const texts = collectText(value);
  const joined = texts.join("\n");
  const displayTexts = collectDisplayText(value);
  const joinedDisplayText = displayTexts.join("\n");

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

  for (const { pattern, category } of APP_LANGUAGE_GUARD_PATTERNS) {
    if (pattern.test(joinedDisplayText)) {
      return invalid("unsafe_app_language", category);
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

function collectDisplayText(value, key = "") {
  if (typeof value === "string") {
    return NON_DISPLAY_TEXT_KEYS.has(key) ? [] : [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectDisplayText(item, key));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([childKey, childValue]) => collectDisplayText(childValue, childKey));
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
