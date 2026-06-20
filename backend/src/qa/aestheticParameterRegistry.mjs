export const AESTHETIC_PARAMETER_REGISTRY_VERSION =
  "aesthetic_parameter_registry.v1";

export const ALLOWED_AESTHETIC_CATEGORIES = Object.freeze([
  "composition_geometry",
  "framing_anatomy_cutting",
  "depth_spatial_relations",
  "lighting_contrast",
  "exposure_color",
  "perspective_lens",
  "environment_clutter"
]);

export const ALLOWED_FEATURE_KEYS = Object.freeze([
  "subjectAnchor",
  "subjectBox",
  "faceBox",
  "headroomRatio",
  "horizonAngle",
  "edgeMargin",
  "visualWeightMoment",
  "subjectBackgroundDepthDelta",
  "boundaryColorDelta",
  "sharpnessRatio",
  "highlightClipRatio",
  "backgroundObjectDensity"
]);

export const ALLOWED_THRESHOLD_KEYS = Object.freeze([
  "headroom_soft_high",
  "headroom_strong_high",
  "horizon_tilt_soft",
  "horizon_tilt_strong",
  "subject_background_delta_low",
  "highlight_clip_ratio_high",
  "edge_margin_soft_low",
  "visual_weight_imbalance_soft",
  "background_object_density_high",
  "boundary_color_delta_low",
  "wide_edge_stretch_soft"
]);

export const ALLOWED_SUPPRESSION_KEYS = Object.freeze([
  "intentional_symmetry",
  "intentional_centering",
  "intentional_negative_space",
  "intentional_silhouette",
  "intentional_dutch_angle",
  "intentional_retro_flash",
  "contextual_environmental_portrait",
  "low_confidence_detection"
]);

export const ALLOWED_SAFE_ACTION_KEYS = Object.freeze([
  "preserve_current_frame",
  "leave_less_empty_air_above",
  "level_frame_softly",
  "give_subject_more_breathing_room",
  "shift_angle_for_cleaner_background",
  "keep_if_intentional"
]);

export const ALLOWED_EVIDENCE_TYPES = Object.freeze([
  "bbox",
  "pose_region",
  "composition_bucket",
  "depth_bucket",
  "segmentation_region",
  "semantic_region",
  "human_review",
  "synthetic_fixture",
  "provider_label_candidate"
]);

export const ALLOWED_SOURCE_TYPES = Object.freeze([
  "human_reviewed",
  "synthetic_fixture",
  "licensed_dataset",
  "consented_user_sample",
  "provider_label_candidate"
]);

const FORBIDDEN_FIELD_PATTERNS = Object.freeze([
  /score/i,
  /rating/i,
  /beauty/i,
  /attractiveness/i,
  /age/i,
  /gender/i,
  /emotion/i,
  /identity/i,
  /ethnicity/i,
  /race/i,
  /health/i,
  /body/i,
  /rawPrompt/i,
  /promptText/i,
  /rawProvider/i,
  /providerResponse/i,
  /rawModel/i,
  /debugText/i,
  /requestPayload/i
]);

const REQUIRED_ITEM_FIELDS = Object.freeze([
  "tag",
  "category",
  "definitionKey",
  "featureKeys",
  "thresholdKeys",
  "suppressionKeys",
  "safeActionKey",
  "evidenceTypes",
  "allowedSourceTypes",
  "requiresHumanReview",
  "safetyNotes"
]);

export function aestheticParameterRegistry() {
  return {
    registryVersion: AESTHETIC_PARAMETER_REGISTRY_VERSION,
    phase: "Phase OD-R1",
    productionReady: false,
    crawlerEnabled: false,
    downloadEnabled: false,
    cloudTeacherEnabled: false,
    trainingEnabled: false,
    runtimeIntegrationEnabled: false,
    items: [
      {
        tag: "ERR_COMP_RULE_OF_THIRDS_MISS",
        category: "composition_geometry",
        definitionKey: "definition.composition.rule_of_thirds_miss",
        featureKeys: ["subjectAnchor", "visualWeightMoment"],
        thresholdKeys: ["visual_weight_imbalance_soft"],
        suppressionKeys: ["intentional_centering", "intentional_symmetry", "low_confidence_detection"],
        safeActionKey: "keep_if_intentional",
        evidenceTypes: ["composition_bucket", "bbox", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["geometry_only", "no_quality_score", "preserve_snapshot_centering"]
      },
      {
        tag: "ERR_COMP_EXCESSIVE_HEADROOM",
        category: "composition_geometry",
        definitionKey: "definition.composition.excessive_headroom",
        featureKeys: ["subjectBox", "faceBox", "headroomRatio"],
        thresholdKeys: ["headroom_soft_high", "headroom_strong_high"],
        suppressionKeys: ["intentional_negative_space", "contextual_environmental_portrait", "low_confidence_detection"],
        safeActionKey: "leave_less_empty_air_above",
        evidenceTypes: ["bbox", "composition_bucket", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["geometry_only", "no_face_identity", "no_bad_photo_language"]
      },
      {
        tag: "ERR_COMP_HORIZON_TILT",
        category: "composition_geometry",
        definitionKey: "definition.composition.horizon_tilt",
        featureKeys: ["horizonAngle"],
        thresholdKeys: ["horizon_tilt_soft", "horizon_tilt_strong"],
        suppressionKeys: ["intentional_dutch_angle", "low_confidence_detection"],
        safeActionKey: "level_frame_softly",
        evidenceTypes: ["composition_bucket", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: false,
        safetyNotes: ["geometry_only", "preserve_intentional_tilt"]
      },
      {
        tag: "ERR_FRAME_ANKLE_CUT",
        category: "framing_anatomy_cutting",
        definitionKey: "definition.framing.ankle_cut",
        featureKeys: ["subjectBox", "edgeMargin"],
        thresholdKeys: ["edge_margin_soft_low"],
        suppressionKeys: ["intentional_centering", "low_confidence_detection"],
        safeActionKey: "give_subject_more_breathing_room",
        evidenceTypes: ["bbox", "pose_region", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["geometry_only", "body_region_not_body_judgment"]
      },
      {
        tag: "ERR_DEPTH_SUBJECT_BACKGROUND_MERGER",
        category: "depth_spatial_relations",
        definitionKey: "definition.depth.subject_background_merger",
        featureKeys: ["subjectBackgroundDepthDelta", "boundaryColorDelta", "sharpnessRatio"],
        thresholdKeys: ["subject_background_delta_low", "boundary_color_delta_low"],
        suppressionKeys: ["intentional_silhouette", "contextual_environmental_portrait", "low_confidence_detection"],
        safeActionKey: "shift_angle_for_cleaner_background",
        evidenceTypes: ["depth_bucket", "segmentation_region", "bbox", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["spatial_signal_only", "hardware_depth_first"]
      },
      {
        tag: "ERR_LIGHT_BACKGROUND_OUTSHINES_SUBJECT",
        category: "lighting_contrast",
        definitionKey: "definition.light.background_outshines_subject",
        featureKeys: ["subjectBox", "highlightClipRatio", "visualWeightMoment"],
        thresholdKeys: ["highlight_clip_ratio_high"],
        suppressionKeys: ["intentional_silhouette", "intentional_retro_flash", "low_confidence_detection"],
        safeActionKey: "keep_if_intentional",
        evidenceTypes: ["composition_bucket", "bbox", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["lighting_signal_only", "preserve_backlight_mood"]
      },
      {
        tag: "ERR_EXP_HIGHLIGHT_CLIPPING",
        category: "exposure_color",
        definitionKey: "definition.exposure.highlight_clipping",
        featureKeys: ["highlightClipRatio"],
        thresholdKeys: ["highlight_clip_ratio_high"],
        suppressionKeys: ["intentional_retro_flash", "intentional_silhouette", "low_confidence_detection"],
        safeActionKey: "keep_if_intentional",
        evidenceTypes: ["composition_bucket", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: false,
        safetyNotes: ["exposure_signal_only", "retro_flash_may_be_intentional"]
      },
      {
        tag: "ERR_VIEW_WIDE_EDGE_STRETCH",
        category: "perspective_lens",
        definitionKey: "definition.perspective.wide_edge_stretch",
        featureKeys: ["subjectBox", "edgeMargin"],
        thresholdKeys: ["wide_edge_stretch_soft", "edge_margin_soft_low"],
        suppressionKeys: ["intentional_negative_space", "low_confidence_detection"],
        safeActionKey: "give_subject_more_breathing_room",
        evidenceTypes: ["bbox", "composition_bucket", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["lens_geometry_only", "no_body_or_face_judgment"]
      },
      {
        tag: "ERR_CLUTTER_BACKGROUND_OBJECT_DENSITY",
        category: "environment_clutter",
        definitionKey: "definition.environment.background_object_density",
        featureKeys: ["backgroundObjectDensity", "subjectBox"],
        thresholdKeys: ["background_object_density_high"],
        suppressionKeys: ["contextual_environmental_portrait", "intentional_negative_space", "low_confidence_detection"],
        safeActionKey: "shift_angle_for_cleaner_background",
        evidenceTypes: ["semantic_region", "segmentation_region", "composition_bucket", "human_review"],
        allowedSourceTypes: ["human_reviewed", "synthetic_fixture", "provider_label_candidate"],
        requiresHumanReview: true,
        safetyNotes: ["environment_signal_only", "do_not_remove_context_by_default"]
      }
    ]
  };
}

export function evaluateAestheticParameterRegistry(registry = aestheticParameterRegistry()) {
  const items = Array.isArray(registry.items) ? registry.items : [];
  const blockedReasons = unique([
    ...registryBoundaryBlockers(registry),
    ...registryItemBlockers(items),
    ...forbiddenFieldBlockers(registry)
  ]);

  return {
    registryVersion: sanitizeToken(registry.registryVersion || "unknown"),
    phase: sanitizeToken(registry.phase || "unknown"),
    totalTags: items.length,
    categoryCounts: categoryCounts(items),
    blockedReasons,
    productionReady: registry.productionReady === true,
    crawlerEnabled: registry.crawlerEnabled === true,
    downloadEnabled: registry.downloadEnabled === true,
    cloudTeacherEnabled: registry.cloudTeacherEnabled === true,
    trainingEnabled: registry.trainingEnabled === true,
    runtimeIntegrationEnabled: registry.runtimeIntegrationEnabled === true,
    registryValid: blockedReasons.length === 0
  };
}

function registryBoundaryBlockers(registry) {
  const blockers = [];
  if (registry.productionReady !== false) blockers.push("blocked_for_production_ready_not_false");
  if (registry.crawlerEnabled !== false) blockers.push("blocked_for_crawler_enabled");
  if (registry.downloadEnabled !== false) blockers.push("blocked_for_download_enabled");
  if (registry.cloudTeacherEnabled !== false) blockers.push("blocked_for_cloud_teacher_enabled");
  if (registry.trainingEnabled !== false) blockers.push("blocked_for_training_enabled");
  if (registry.runtimeIntegrationEnabled !== false) blockers.push("blocked_for_runtime_integration_enabled");
  return blockers;
}

function registryItemBlockers(items) {
  const blockers = [];
  const seenTags = new Set();

  for (const item of items) {
    for (const field of REQUIRED_ITEM_FIELDS) {
      if (!(field in item)) blockers.push(`blocked_for_missing_field_${field}`);
    }

    if (!item.tag || typeof item.tag !== "string") {
      blockers.push("blocked_for_missing_tag");
    } else if (seenTags.has(item.tag)) {
      blockers.push(`blocked_for_duplicate_tag_${sanitizeToken(item.tag)}`);
    } else {
      seenTags.add(item.tag);
    }

    if (!ALLOWED_AESTHETIC_CATEGORIES.includes(item.category)) {
      blockers.push(`blocked_for_unsupported_category_${sanitizeToken(item.category)}`);
    }
    if (!Array.isArray(item.featureKeys) || item.featureKeys.length === 0) {
      blockers.push(`blocked_for_missing_feature_keys_${sanitizeToken(item.tag)}`);
    } else {
      blockers.push(...unsupportedArrayValues("feature_key", item.featureKeys, ALLOWED_FEATURE_KEYS));
    }
    if (!Array.isArray(item.thresholdKeys)) {
      blockers.push(`blocked_for_missing_threshold_keys_${sanitizeToken(item.tag)}`);
    } else if (item.thresholdKeys.length === 0) {
      blockers.push(`blocked_for_empty_threshold_keys_${sanitizeToken(item.tag)}`);
    } else {
      blockers.push(...unsupportedArrayValues("threshold_key", item.thresholdKeys, ALLOWED_THRESHOLD_KEYS));
    }
    if (!Array.isArray(item.suppressionKeys)) {
      blockers.push(`blocked_for_missing_suppression_keys_${sanitizeToken(item.tag)}`);
    } else {
      blockers.push(...unsupportedArrayValues("suppression_key", item.suppressionKeys, ALLOWED_SUPPRESSION_KEYS));
    }
    if (!ALLOWED_SAFE_ACTION_KEYS.includes(item.safeActionKey)) {
      blockers.push(`blocked_for_unsupported_safe_action_key_${sanitizeToken(item.safeActionKey)}`);
    }
    if (!Array.isArray(item.evidenceTypes) || item.evidenceTypes.length === 0) {
      blockers.push(`blocked_for_missing_evidence_types_${sanitizeToken(item.tag)}`);
    } else {
      blockers.push(...unsupportedArrayValues("evidence_type", item.evidenceTypes, ALLOWED_EVIDENCE_TYPES));
    }
    if (!Array.isArray(item.allowedSourceTypes) || item.allowedSourceTypes.length === 0) {
      blockers.push(`blocked_for_missing_allowed_source_types_${sanitizeToken(item.tag)}`);
    } else {
      blockers.push(...unsupportedArrayValues("source_type", item.allowedSourceTypes, ALLOWED_SOURCE_TYPES));
    }
    if (typeof item.requiresHumanReview !== "boolean") {
      blockers.push(`blocked_for_missing_human_review_flag_${sanitizeToken(item.tag)}`);
    }
    if (!Array.isArray(item.safetyNotes) || item.safetyNotes.length === 0) {
      blockers.push(`blocked_for_missing_safety_notes_${sanitizeToken(item.tag)}`);
    }
  }

  return blockers;
}

function forbiddenFieldBlockers(value, path = "registry") {
  if (!value || typeof value !== "object") return [];
  const blockers = [];

  for (const [key, nested] of Object.entries(value)) {
    const keyPath = `${path}.${key}`;
    if (FORBIDDEN_FIELD_PATTERNS.some((pattern) => pattern.test(key))) {
      blockers.push(`blocked_for_forbidden_field_${sanitizeToken(keyPath)}`);
    }
    if (nested && typeof nested === "object") {
      blockers.push(...forbiddenFieldBlockers(nested, keyPath));
    }
  }

  return blockers;
}

function unsupportedArrayValues(kind, values, allowedValues) {
  return values
    .filter((value) => !allowedValues.includes(value))
    .map((value) => `blocked_for_unsupported_${kind}_${sanitizeToken(value)}`);
}

function categoryCounts(items) {
  return Object.fromEntries(
    ALLOWED_AESTHETIC_CATEGORIES.map((category) => [
      category,
      items.filter((item) => item.category === category).length
    ])
  );
}

function unique(values) {
  return [...new Set(values)];
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 120);
}
