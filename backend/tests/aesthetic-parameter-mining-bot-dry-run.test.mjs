import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticParameterMiningBotDryRunSample,
  runAestheticParameterMiningBotDryRun
} from "../src/qa/aestheticParameterMiningBotDryRun.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterMiningBotDryRunSample());
}

function firstJobReasons(report) {
  return report.jobPlan[0].blockedReasons;
}

test("parameter mining bot dry-run creates eligible synthetic teacher-stub jobs", () => {
  const report = runAestheticParameterMiningBotDryRun(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_mining_bot_dry_run.v1");
  assert.equal(report.registryVersion, "aesthetic_parameter_registry.v1");
  assert.equal(report.sourceCount, 1);
  assert.equal(report.imageCount, 1);
  assert.equal(report.requestedJobCount, 1);
  assert.equal(report.eligibleJobCount, 1);
  assert.equal(report.blockedJobCount, 0);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.jobPlan[0].status, "eligible_for_teacher_stub_dry_run");
  assert.equal(report.jobPlan[0].teacherMode, "stub_only");
  assert.equal(report.jobPlan[0].humanReviewRequired, true);
  assert.equal(report.jobPlan[0].assetRefBucket, "synthetic_stub");
  assert.equal(report.productionReady, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
});

test("owned internal draft remains blocked unless approved for teacher stub", () => {
  const manifest = cloneSample();
  manifest.sources[0] = {
    ...manifest.sources[0],
    sourceId: "src_owned_draft_001",
    sourceType: "owned_internal",
    licenseStatus: "owned",
    licenseType: "internal_owned",
    consentStatus: "owner_approved",
    approvalStatus: "draft",
    reviewStatus: "pending",
    allowedUses: {
      evaluation: false,
      teacherLabeling: false,
      trainingCandidate: false,
      productRuntime: false
    }
  };
  manifest.images[0].sourceId = "src_owned_draft_001";
  manifest.images[0].allowedUse.teacherLabeling = false;

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_source_not_approved_for_teacher_stub_src_owned_draft_001"), true);
});

test("banned source type blocks jobs", () => {
  const manifest = cloneSample();
  manifest.sources[0].sourceType = "instagram";

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("blocked_for_manifest_blocked_for_banned_source_type_instagram")), true);
});

test("pending or rejected source blocks jobs", () => {
  const manifest = cloneSample();
  manifest.sources[0].reviewStatus = "rejected";
  manifest.sources[0].approvalStatus = "rejected";

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_source_not_approved_for_teacher_stub_src_synthetic_teacher_stub_001"), true);
});

test("missing metadata stripping blocks approved image", () => {
  const manifest = cloneSample();
  manifest.images[0].metadataStatus.gpsRemoved = false;

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_missing_metadata_removal_img_synthetic_teacher_stub_001"), true);
});

test("unknown tag blocks job", () => {
  const manifest = cloneSample();
  manifest.labelJobs[0].allowedTagSubset = ["ERR_UNKNOWN_TAG"];

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
  assert.deepEqual(report.jobPlan[0].allowedTagSubset, []);
});

test("empty tag subset blocks job", () => {
  const manifest = cloneSample();
  manifest.labelJobs[0].allowedTagSubset = [];

  const report = runAestheticParameterMiningBotDryRun(manifest);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_empty_allowed_tag_subset_job_synthetic_teacher_stub_001"), true);
});

test("raw local image path blocks job and is not echoed", () => {
  const manifest = cloneSample();
  manifest.images[0].assetRef = "C:\\Users\\example\\private_photo.jpg";

  const report = runAestheticParameterMiningBotDryRun(manifest);
  const serialized = JSON.stringify(report);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_raw_or_external_asset_ref_img_synthetic_teacher_stub_001"), true);
  assert.equal(serialized.includes("private_photo.jpg"), false);
  assert.equal(serialized.includes("C:\\Users"), false);
});

test("real URL in assetRef blocks job and is not echoed", () => {
  const manifest = cloneSample();
  manifest.images[0].assetRefType = "redacted_external_id";
  manifest.images[0].assetRef = "https://example.com/private-photo.jpg";

  const report = runAestheticParameterMiningBotDryRun(manifest);
  const serialized = JSON.stringify(report);

  assert.equal(report.dryRunValid, false);
  assert.equal(firstJobReasons(report).includes("blocked_for_raw_or_external_asset_ref_img_synthetic_teacher_stub_001"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("crawlerEnabled true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), crawlerEnabled: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_crawler_enabled_not_false"), true);
});

test("downloadEnabled true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), downloadEnabled: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_download_enabled_not_false"), true);
});

test("cloudTeacherEnabled true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), cloudTeacherEnabled: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_cloud_teacher_enabled_not_false"), true);
});

test("trainingEnabled true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), trainingEnabled: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_training_enabled_not_false"), true);
});

test("runtimeIntegrationEnabled true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), runtimeIntegrationEnabled: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_runtime_integration_enabled_not_false"), true);
});

test("productionReady true fails closed", () => {
  const report = runAestheticParameterMiningBotDryRun({ ...cloneSample(), productionReady: true });

  assert.equal(report.dryRunValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_production_ready_not_false"), true);
});

test("output contains no raw image path raw URL provider payload prompt or base64", () => {
  const report = runAestheticParameterMiningBotDryRun(cloneSample());
  const serialized = JSON.stringify(report).toLowerCase();

  assert.equal(serialized.includes("c:\\users"), false);
  assert.equal(serialized.includes("https://"), false);
  assert.equal(serialized.includes("rawprompt"), false);
  assert.equal(serialized.includes("requestpayload"), false);
  assert.equal(serialized.includes("/9j/"), false);
});

test("disabled flags remain false in sanitized output", () => {
  const report = runAestheticParameterMiningBotDryRun(cloneSample());

  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.rawImagesCommitted, false);
  assert.equal(report.productionReady, false);
});
