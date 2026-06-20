import assert from "node:assert/strict";
import test from "node:test";
import {
  aestheticDatasetManifestSample,
  evaluateAestheticDatasetManifest
} from "../src/qa/aestheticDatasetManifestSchema.mjs";

function cloneSample() {
  return structuredClone(aestheticDatasetManifestSample());
}

test("aesthetic dataset manifest valid synthetic source image and job passes", () => {
  const report = evaluateAestheticDatasetManifest(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_dataset_manifest.v1");
  assert.equal(report.phase, "Phase_OD-R2");
  assert.equal(report.manifestValid, true);
  assert.equal(report.sourceCount, 1);
  assert.equal(report.imageCount, 1);
  assert.equal(report.labelJobCount, 1);
  assert.equal(report.productionReady, false);
  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.rawImagesCommitted, false);
  assert.deepEqual(report.blockedReasons, []);
});

test("aesthetic dataset manifest owned internal draft passes only with safe non-runtime uses", () => {
  const manifest = cloneSample();
  manifest.sources[0] = {
    ...manifest.sources[0],
    sourceId: "src_owned_draft_001",
    sourceType: "owned_internal",
    licenseStatus: "owned",
    licenseType: "internal_owned",
    consentStatus: "owner_approved",
    allowedUses: {
      evaluation: false,
      teacherLabeling: false,
      trainingCandidate: false,
      productRuntime: false
    },
    approvalStatus: "draft",
    reviewStatus: "pending"
  };
  manifest.images[0] = {
    ...manifest.images[0],
    sourceId: "src_owned_draft_001",
    allowedUse: {
      evaluation: false,
      teacherLabeling: false,
      trainingCandidate: false,
      productRuntime: false
    },
    privacyReviewStatus: "pending"
  };

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, true);
  assert.deepEqual(report.blockedReasons, []);
});

test("aesthetic dataset manifest rejected source cannot enable evaluation teacher or training", () => {
  const manifest = cloneSample();
  manifest.sources[0] = {
    ...manifest.sources[0],
    licenseStatus: "rejected",
    consentStatus: "rejected",
    approvalStatus: "rejected",
    reviewStatus: "rejected",
    allowedUses: {
      evaluation: true,
      teacherLabeling: true,
      trainingCandidate: true,
      productRuntime: false
    }
  };

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_pending_or_rejected_source_use_src_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest pending license cannot enable teacher labeling or training", () => {
  const manifest = cloneSample();
  manifest.sources[0] = {
    ...manifest.sources[0],
    licenseStatus: "pending_review",
    consentStatus: "pending_review",
    reviewStatus: "pending",
    allowedUses: {
      evaluation: false,
      teacherLabeling: true,
      trainingCandidate: true,
      productRuntime: false
    }
  };

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_pending_or_rejected_source_use_src_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest training candidate requires approved license consent and review", () => {
  const manifest = cloneSample();
  manifest.sources[0] = {
    ...manifest.sources[0],
    approvalStatus: "approved_for_training_candidate",
    licenseStatus: "pending_review",
    consentStatus: "owner_approved",
    reviewStatus: "approved",
    allowedUses: {
      evaluation: true,
      teacherLabeling: false,
      trainingCandidate: true,
      productRuntime: false
    }
  };

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(
    report.blockedReasons.includes(
      "blocked_for_training_candidate_without_approved_license_consent_review_src_synthetic_stub_001"
    ),
    true
  );
});

test("aesthetic dataset manifest product runtime use fails", () => {
  const manifest = cloneSample();
  manifest.sources[0].allowedUses.productRuntime = true;
  manifest.images[0].allowedUse.productRuntime = true;

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_product_runtime_use_src_synthetic_stub_001"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_product_runtime_image_use_img_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest banned source type fails", () => {
  const manifest = cloneSample();
  manifest.sources[0].sourceType = "instagram";

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_banned_source_type_instagram"), true);
});

test("aesthetic dataset manifest committed raw image path fails", () => {
  const manifest = cloneSample();
  manifest.images[0].assetRef = "C:\\Users\\example\\photo.jpg";

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_raw_or_external_asset_ref_img_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest actual URL fixture fails", () => {
  const manifest = cloneSample();
  manifest.images[0].assetRefType = "redacted_external_id";
  manifest.images[0].assetRef = "https://example.com/photo.jpg";

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_raw_or_external_asset_ref_img_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest missing metadata removal flags fails for approved image", () => {
  const manifest = cloneSample();
  manifest.images[0].metadataStatus.exifRemoved = false;

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_missing_metadata_removal_img_synthetic_stub_001"), true);
});

test("aesthetic dataset manifest boundary enablement flags fail", () => {
  const manifest = {
    ...cloneSample(),
    cloudTeacherEnabled: true,
    crawlerEnabled: true,
    downloadEnabled: true,
    trainingEnabled: true,
    runtimeIntegrationEnabled: true
  };

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_cloud_teacher_enabled"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_crawler_enabled"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_download_enabled"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_training_enabled"), true);
  assert.equal(report.blockedReasons.includes("blocked_for_runtime_integration_enabled"), true);
});

test("aesthetic dataset manifest forbidden score sensitive and raw leakage fields fail", () => {
  const manifest = cloneSample();
  manifest.sources[0].qualityScore = 0.9;
  manifest.images[0].ageBucket = "adult";
  manifest.labelJobs[0].rawProviderResponse = "hidden";
  manifest.labelJobs[0].rawPrompt = "hidden";
  manifest.debugText = "hidden";

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("qualityScore")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("ageBucket")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("rawProviderResponse")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("rawPrompt")), true);
  assert.equal(report.blockedReasons.some((reason) => reason.includes("debugText")), true);
});

test("aesthetic dataset manifest label job with unknown registry tag fails", () => {
  const manifest = cloneSample();
  manifest.labelJobs[0].allowedTagSubset = ["ERR_UNKNOWN_TAG"];

  const report = evaluateAestheticDatasetManifest(manifest);

  assert.equal(report.manifestValid, false);
  assert.equal(report.blockedReasons.includes("blocked_for_unknown_registry_tag_ERR_UNKNOWN_TAG"), true);
});

test("aesthetic dataset manifest CLI-shaped output keeps disabled flags false", () => {
  const report = evaluateAestheticDatasetManifest(cloneSample());

  assert.equal(report.crawlerEnabled, false);
  assert.equal(report.downloadEnabled, false);
  assert.equal(report.cloudTeacherEnabled, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.rawImagesCommitted, false);
  assert.equal(report.productionReady, false);
});
