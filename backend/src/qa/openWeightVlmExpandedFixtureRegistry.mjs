export const OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REGISTRY_SCHEMA_VERSION = "open_weight_vlm_expanded_fixture_registry.v1";

export const OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CATEGORIES = Object.freeze([
  "bright_daylight_clean",
  "low_light_grain",
  "motion_blur_intentional",
  "severe_blur_reject",
  "high_contrast_shadow",
  "faded_color_retro",
  "warm_indoor_ambient",
  "street_chrome_high_contrast",
  "soft_focus_dreamy",
  "overexposed_unreadable",
  "imported_limited_context",
  "black_or_near_black_unreadable"
]);

export const OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CORE_CATEGORIES = Object.freeze([
  "bright_daylight_clean",
  "low_light_grain",
  "motion_blur_intentional",
  "severe_blur_reject",
  "high_contrast_shadow",
  "faded_color_retro",
  "imported_limited_context",
  "black_or_near_black_unreadable"
]);

export const OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES = Object.freeze([
  "bright_daylight_clean",
  "low_light_grain",
  "motion_blur_intentional",
  "high_contrast_shadow",
  "faded_color_retro",
  "imported_limited_context",
  "severe_blur_reject",
  "black_or_near_black_unreadable",
  "warm_indoor_ambient",
  "soft_focus_dreamy",
  "street_chrome_high_contrast",
  "overexposed_unreadable"
]);

const ALLOWED_SOURCE_TYPES = new Set(["captured", "imported", "synthetic_local_fixture"]);
const ALLOWED_ALLOWED_CONTEXTS = new Set(["captureContextAvailable", "imageOnly", "unknown"]);
const ALLOWED_RISK_BUCKETS = new Set(["none", "mild", "moderate", "severe_unusable"]);
const ALLOWED_CREATIVE_INTENT_BUCKETS = new Set(["style_positive", "acceptable_imperfection", "technical_risk", "unknown"]);
const ALLOWED_FILTER_FAMILIES = new Set([
  "warm_film",
  "faded_pastel",
  "cinematic_contrast",
  "night_grain",
  "soft_dream",
  "street_chrome",
  "amber_glow",
  "cool_fade",
  "classic_film",
  "original"
]);

const REQUIRED_ENTRY_KEYS = Object.freeze([
  "fixtureId",
  "category",
  "sourceType",
  "approvedForLocalSmoke",
  "metadataStripped",
  "privacyReviewed",
  "containsFace",
  "containsSensitiveContent",
  "containsPrivateIdentifier",
  "expectedAllowedContext",
  "expectedRiskBucket",
  "expectedCreativeIntentBucket"
]);

const OPTIONAL_ENTRY_KEYS = Object.freeze([
  "expectedFilterFamilyCandidate",
  "notesBucket"
]);

const ALLOWED_ENTRY_KEYS = new Set([...REQUIRED_ENTRY_KEYS, ...OPTIONAL_ENTRY_KEYS]);

export function validateOpenWeightVlmExpandedFixtureEntry(entry = {}) {
  const reasons = [];

  if (!isPlainObject(entry)) {
    return entryReview("unknown", "unknown", ["blocked_invalid_schema"]);
  }

  for (const key of REQUIRED_ENTRY_KEYS) {
    if (!(key in entry)) {
      reasons.push("blocked_invalid_schema");
    }
  }

  for (const key of Object.keys(entry)) {
    if (!ALLOWED_ENTRY_KEYS.has(key)) {
      reasons.push("blocked_invalid_schema");
    }
  }

  if (!isSafeFixtureId(entry.fixtureId)) {
    reasons.push("blocked_invalid_schema");
  }

  if (!OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CATEGORIES.includes(entry.category)) {
    reasons.push("blocked_unknown_category");
  }

  if (!ALLOWED_SOURCE_TYPES.has(entry.sourceType)) {
    reasons.push("blocked_invalid_schema");
  }

  if (!ALLOWED_ALLOWED_CONTEXTS.has(entry.expectedAllowedContext)) {
    reasons.push("blocked_invalid_schema");
  }

  if (!ALLOWED_RISK_BUCKETS.has(entry.expectedRiskBucket)) {
    reasons.push("blocked_invalid_schema");
  }

  if (!ALLOWED_CREATIVE_INTENT_BUCKETS.has(entry.expectedCreativeIntentBucket)) {
    reasons.push("blocked_invalid_schema");
  }

  if ("expectedFilterFamilyCandidate" in entry
    && !ALLOWED_FILTER_FAMILIES.has(entry.expectedFilterFamilyCandidate)) {
    reasons.push("blocked_invalid_schema");
  }

  if ("notesBucket" in entry && !isSanitizedBucket(entry.notesBucket)) {
    reasons.push("blocked_invalid_schema");
  }

  if (entry.approvedForLocalSmoke !== true) {
    reasons.push("blocked_unapproved_fixture");
  }
  if (entry.metadataStripped !== true) {
    reasons.push("blocked_missing_metadata_strip");
  }
  if (entry.privacyReviewed !== true) {
    reasons.push("blocked_privacy_review_missing");
  }
  if (entry.containsFace !== false) {
    reasons.push("blocked_face_presence");
  }
  if (entry.containsSensitiveContent !== false) {
    reasons.push("blocked_sensitive_content");
  }
  if (entry.containsPrivateIdentifier !== false) {
    reasons.push("blocked_private_identifier");
  }

  return entryReview(
    entry.fixtureId,
    entry.category,
    reasons.length === 0 ? ["approved_for_local_smoke"] : unique(reasons)
  );
}

export function evaluateOpenWeightVlmExpandedFixtureRegistry(entries = []) {
  const normalizedEntries = Array.isArray(entries)
    ? entries
    : (Array.isArray(entries?.fixtures) ? entries.fixtures : []);
  const entryReviews = normalizedEntries.map(validateOpenWeightVlmExpandedFixtureEntry);
  const categoryCoverage = Object.fromEntries(
    OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CATEGORIES.map((category) => [category, 0])
  );

  for (const review of entryReviews) {
    if (Object.hasOwn(categoryCoverage, review.category)) {
      categoryCoverage[review.category] += 1;
    }
  }

  const missingRequiredCategories = OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES
    .filter((category) => categoryCoverage[category] === 0);
  const blockedReasonCounts = countReasons(entryReviews);
  const approvedCount = entryReviews.filter((review) => review.status === "approved_for_local_smoke").length;
  const blockedCount = entryReviews.length - approvedCount;

  const report = {
    schemaVersion: OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REGISTRY_SCHEMA_VERSION,
    runMode: "expanded_fixture_registry_dry_run",
    totalTargetFixtures: OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES.length,
    requiredCategories: [...OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES],
    totalFixtures: entryReviews.length,
    approvedCount,
    blockedCount,
    categoryCoverage,
    missingRequiredCategories,
    blockedReasonCounts,
    eligibleForControlledSmoke: entryReviews.length === OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_REQUIRED_CATEGORIES.length
      && blockedCount === 0
      && missingRequiredCategories.length === 0,
    productionReady: false,
    networkCallsMade: false,
    reviewedFixtures: entryReviews
  };

  const redaction = assertOpenWeightVlmExpandedFixtureRegistryReportRedacted(report);
  if (!redaction.ok) {
    report.blockedCount += 1;
    report.blockedReasonCounts.blocked_invalid_schema = (report.blockedReasonCounts.blocked_invalid_schema ?? 0) + 1;
    report.eligibleForControlledSmoke = false;
  }

  return report;
}

export function assertOpenWeightVlmExpandedFixtureRegistryReportRedacted(report = {}) {
  const serialized = JSON.stringify(report);
  const forbiddenSnippets = [
    "data:image",
    "image_url",
    "fullPrompt",
    "rawResponse",
    "modelResponseText",
    "modelOutput",
    "requestPayload",
    "Authorization",
    "Bearer ",
    "apiKey",
    "QWE_API_KEY",
    "GEMINI_API_KEY",
    "OPENAI_API_KEY",
    "http://",
    "https://",
    ".jpg",
    ".jpeg",
    ".png",
    "/Users/",
    "/Volumes/",
    "/private/",
    "C:\\",
    "stack trace"
  ];

  for (const snippet of forbiddenSnippets) {
    if (serialized.includes(snippet)) {
      return {
        ok: false,
        error: {
          code: "expanded_fixture_registry_not_redacted",
          message: "Expanded fixture registry dry-run report contains a forbidden artifact marker."
        }
      };
    }
  }

  return { ok: true };
}

export function expandedFixtureRegistrySample() {
  return OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CATEGORIES.map((category, index) => ({
    fixtureId: `expanded_${String(index + 1).padStart(3, "0")}`,
    category,
    sourceType: sourceTypeForCategory(category),
    approvedForLocalSmoke: true,
    metadataStripped: true,
    privacyReviewed: true,
    containsFace: false,
    containsSensitiveContent: false,
    containsPrivateIdentifier: false,
    expectedAllowedContext: category === "imported_limited_context" ? "imageOnly" : "captureContextAvailable",
    expectedRiskBucket: riskBucketForCategory(category),
    expectedCreativeIntentBucket: creativeIntentForCategory(category),
    expectedFilterFamilyCandidate: filterFamilyForCategory(category),
    notesBucket: "phase_20_f_planned_fixture"
  }));
}

function entryReview(fixtureId, category, statuses) {
  const uniqueStatuses = unique(statuses.map(sanitizeToken));
  return {
    fixtureIdBucket: bucketFixtureId(fixtureId),
    category: sanitizeCategory(category),
    status: uniqueStatuses.includes("approved_for_local_smoke")
      ? "approved_for_local_smoke"
      : uniqueStatuses[0] || "blocked_invalid_schema",
    blockedReasons: uniqueStatuses.filter((status) => status !== "approved_for_local_smoke")
  };
}

function countReasons(reviews) {
  const counts = {};
  for (const review of reviews) {
    for (const reason of review.blockedReasons) {
      counts[reason] = (counts[reason] ?? 0) + 1;
    }
  }
  return counts;
}

function sourceTypeForCategory(category) {
  if (category === "imported_limited_context") {
    return "imported";
  }
  return "synthetic_local_fixture";
}

function riskBucketForCategory(category) {
  if ([
    "severe_blur_reject",
    "overexposed_unreadable",
    "black_or_near_black_unreadable"
  ].includes(category)) {
    return "severe_unusable";
  }
  return "mild";
}

function creativeIntentForCategory(category) {
  if ([
    "severe_blur_reject",
    "overexposed_unreadable",
    "black_or_near_black_unreadable"
  ].includes(category)) {
    return "technical_risk";
  }
  if ([
    "motion_blur_intentional",
    "low_light_grain",
    "soft_focus_dreamy"
  ].includes(category)) {
    return "acceptable_imperfection";
  }
  return "style_positive";
}

function filterFamilyForCategory(category) {
  switch (category) {
  case "low_light_grain":
    return "night_grain";
  case "high_contrast_shadow":
    return "cinematic_contrast";
  case "faded_color_retro":
    return "faded_pastel";
  case "warm_indoor_ambient":
    return "warm_film";
  case "street_chrome_high_contrast":
    return "street_chrome";
  case "soft_focus_dreamy":
    return "soft_dream";
  default:
    return "classic_film";
  }
}

function bucketFixtureId(value) {
  return isSafeFixtureId(value) ? "configured" : "invalid";
}

function sanitizeCategory(value) {
  const category = sanitizeToken(value);
  return OPEN_WEIGHT_VLM_EXPANDED_FIXTURE_CATEGORIES.includes(category) ? category : "unknown";
}

function isSafeFixtureId(value) {
  return typeof value === "string" && /^[a-z0-9_:-]{3,64}$/i.test(value);
}

function isSanitizedBucket(value) {
  return typeof value === "string" && /^[a-z0-9_.:-]{1,80}$/i.test(value);
}

function unique(values) {
  return Array.from(new Set(values));
}

function sanitizeToken(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
