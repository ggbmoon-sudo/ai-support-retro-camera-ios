export function mockPhotoAdvisorResponse({ locale, selectedFilterId }) {
  const preferredFilterId = selectedFilterId === "soft_warm_400" ? "soft_warm_400" : "instant_dream";

  return {
    schemaVersion: "1.0",
    mode: "post_capture",
    summary: "這張相有暖光感，可以試柔和復古濾鏡。",
    suggestions: [
      {
        type: "filter",
        text: "可以試柔和暖色復古濾鏡，保留舒服的氛圍。",
        priority: "high",
        action: "apply_filter"
      }
    ],
    recommendedFilters: [
      {
        filterId: preferredFilterId,
        reason: "適合暖光人像。",
        confidence: "high"
      }
    ],
    generatedFilter: null,
    poseGuide: null,
    retakeAdvice: {
      shouldRetake: false,
      reason: "可以保留這張，先試濾鏡和裁切。"
    },
    cropAdvice: {
      recommended: true,
      text: "可以裁走邊緣少少空白，主體會更集中。"
    },
    confidence: "medium",
    source: "mock",
    locale: locale ?? "zh-Hant-HK",
    safety: {
      containsSensitiveInference: false,
      requiresUserConsent: true,
      blockedReason: null
    },
    error: null
  };
}
