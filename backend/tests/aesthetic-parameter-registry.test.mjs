import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticParameterRegistry,
  evaluateAestheticParameterRegistry
} from "../src/qa/aestheticParameterRegistry.mjs";

function registryWithFirstItemPatch(patch) {
  const registry = aestheticParameterRegistry();
  return {
    ...registry,
    items: [{ ...registry.items[0], ...patch }, ...registry.items.slice(1)]
  };
}

test("aesthetic parameter registry valid starter set passes", () => {
  const registry = aestheticParameterRegistry();
  const report = evaluateAestheticParameterRegistry(registry);

  assert.equal(report.registryVersion, "aesthetic_parameter_registry.v1");
  assert.equal(report.phase, "Phase_OD-R1");
  assert.equal(report.registryValid, true);
  assert.equal(report.totalTags, 9);
  assert.equal(report.productionReady, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.deepEqual(report.blockedReasons, []);
});

test("aesthetic parameter registry duplicate tag fails", () => {
  const registry = aestheticParameterRegistry();
  const duplicate = {
    ...registry,
    items: [{ ...registry.items[0] }, { ...registry.items[0] }, ...registry.items.slice(1)]
  };
  const report = evaluateAestheticParameterRegistry(duplicate);

  assert.equal(report.registryValid, false);
  assert.equal(
    report.blockedReasons.includes("blocked_for_duplicate_tag_ERR_COMP_RULE_OF_THIRDS_MISS"),
    true
  );
});

test("aesthetic parameter registry unsupported category fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ category: "portrait_quality_score" })
  );

  assert.equal(report.registryValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unsupported_category_portrait_quality_score"), true);
});

test("aesthetic parameter registry unsupported feature key fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ featureKeys: ["subjectAnchor", "beautyScore"] })
  );

  assert.equal(report.registryValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unsupported_feature_key_beautyScore"), true);
});

test("aesthetic parameter registry unsupported threshold key fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ thresholdKeys: ["score_high"] })
  );

  assert.equal(report.registryValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unsupported_threshold_key_score_high"), true);
});

test("aesthetic parameter registry unsupported suppression key fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ suppressionKeys: ["identity_match"] })
  );

  assert.equal(report.registryValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unsupported_suppression_key_identity_match"), true);
});

test("aesthetic parameter registry unsupported safe action key fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ safeActionKey: "retake_bad_photo" })
  );

  assert.equal(report.registryValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unsupported_safe_action_key_retake_bad_photo"), true);
});

test("aesthetic parameter registry score or rating field fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ scoreValue: "0.8", starRating: "5" })
  );

  assert.equal(report.registryValid, false);
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("scoreValue")),
    true
  );
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("starRating")),
    true
  );
});

test("aesthetic parameter registry sensitive inference field fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({ ageBucket: "adult", emotionLabel: "happy" })
  );

  assert.equal(report.registryValid, false);
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("ageBucket")),
    true
  );
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("emotionLabel")),
    true
  );
});

test("aesthetic parameter registry raw prompt provider or debug leakage field fails", () => {
  const report = evaluateAestheticParameterRegistry(
    registryWithFirstItemPatch({
      rawPrompt: "hidden prompt",
      rawProviderResponse: "hidden response",
      debugText: "hidden debug"
    })
  );

  assert.equal(report.registryValid, false);
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("rawPrompt")),
    true
  );
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("rawProviderResponse")),
    true
  );
  assert.equal(
    report.blockedReasons.some((reason) => reason.includes("debugText")),
    true
  );
});

test("aesthetic parameter registry output confirms disabled runtime-adjacent modes", () => {
  const blocked = evaluateAestheticParameterRegistry({
    ...aestheticParameterRegistry(),
    crawlerEnabled: true,
    downloadEnabled: true,
    cloudTeacherEnabled: true,
    trainingEnabled: true,
    runtimeIntegrationEnabled: true,
    productionReady: true
  });

  assert.equal(blocked.registryValid, false);
  assert.equal(blocked.productionReady, true);
  assert.equal(blocked.crawlerEnabled, true);
  assert.equal(blocked.downloadEnabled, true);
  assert.equal(blocked.cloudTeacherEnabled, true);
  assert.equal(blocked.trainingEnabled, true);
  assert.equal(blocked.runtimeIntegrationEnabled, true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_production_ready_not_false"), true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_crawler_enabled"), true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_download_enabled"), true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_cloud_teacher_enabled"), true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_training_enabled"), true);
  assert.equal(blocked.blockedReasons.includes("blocked_for_runtime_integration_enabled"), true);
});
