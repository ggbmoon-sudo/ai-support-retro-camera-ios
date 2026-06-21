import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticParameterPackExportGateSample,
  runAestheticParameterPackExportGate
} from "../src/qa/aestheticParameterPackExportGate.mjs";

function cloneSample() {
  return structuredClone(aestheticParameterPackExportGateSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticParameterPackExportGate(sample);
}

function candidatePatch(patch) {
  return (sample) => patch(sample.parameterPackCandidate, sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("valid synthetic parameter-pack candidate passes export gate", () => {
  const report = runAestheticParameterPackExportGate(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_parameter_pack_export_gate.v1");
  assert.equal(report.runMode, "parameter_pack_export_gate");
  assert.equal(report.exportGatePassed, true);
  assert.equal(report.exportCandidateVersion, "aesthetic_parameter_pack_candidate.dry_run.v1");
  assert.equal(report.registryVersion, "aesthetic_parameter_registry.v1");
  assert.equal(report.tagCount, 2);
  assert.equal(report.thresholdCount, 2);
  assert.equal(report.suppressionRuleCount, 2);
  assert.equal(report.safeActionMappingCount, 2);
  assert.equal(report.fallbackRuleCount, 4);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.exportArtifactSummary.artifactWritePerformed, false);
  assert.equal(report.exportArtifactSummary.appRuntimeWritePerformed, false);
  assert.equal(report.exportArtifactSummary.iosProjectModified, false);
  assert.equal(report.exportArtifactSummary.swiftFilesModified, false);
  assert.equal(report.exportArtifactSummary.modelFilesIncluded, false);
  assert.equal(report.appTransferReadiness.eligibleForAppTransferCandidate, true);
  assert.equal(report.appTransferReadiness.eligibleForAppRuntime, false);
  assert.equal(report.appTransferReadiness.appRuntimeTransferBlocked, true);
  assert.equal(report.appTransferReadiness.requiresODPGate, true);
  assert.equal(report.productionReady, false);
});

test("unknown tag fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagThresholds.ERR_FUTURE_UNKNOWN = ["headroom_soft_high"];
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "unknown_registry_tag_ERR_FUTURE_UNKNOWN"), true);
});

test("unknown feature key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagFeatureRequirements = {
      ERR_COMP_EXCESSIVE_HEADROOM: ["futureFeature"]
    };
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("unknown threshold key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagThresholds.ERR_COMP_EXCESSIVE_HEADROOM = ["future_threshold"];
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "unknown_threshold_key_future_threshold"), true);
});

test("unsupported suppression key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.suppressionRules.ERR_COMP_EXCESSIVE_HEADROOM = ["future_suppression"];
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "unknown_suppression_key_future_suppression"), true);
});

test("unsupported safeActionKey fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.safeActionMappings.ERR_COMP_EXCESSIVE_HEADROOM = "future_action";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "unsupported_safe_action_key_future_action"), true);
});

test("missing parameterPackVersion fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.parameterPackVersion;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "missing_parameter_pack_version"), true);
});

test("missing registryVersion fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.registryVersion;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "missing_candidate_registry_version"), true);
});

test("missing benchmark requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.benchmarkRequirements;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "missing_benchmark_requirements"), true);
});

test("missing review requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.reviewRequirements;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "missing_review_requirements"), true);
});

test("missing safety requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.safetyRequirements;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "missing_safety_requirements"), true);
});

test("eligibleForAppRuntime true fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.eligibleForAppRuntime = true;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(report.eligibleForAppTransferCandidate, false);
  assert.equal(blockedFor(report, "candidate_app_runtime_eligibility"), true);
});

test("appRuntimeTransferBlocked false fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.appRuntimeTransferBlocked = false;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(report.eligibleForAppTransferCandidate, false);
  assert.equal(blockedFor(report, "candidate_app_runtime_transfer_not_blocked"), true);
});

test("eligibleForAppTransferCandidate may be true only when gate passes", () => {
  const passingReport = runAestheticParameterPackExportGate(cloneSample());
  const failingReport = reportFor((sample) => {
    sample.eligibleForAppTransferCandidate = true;
  });

  assert.equal(passingReport.eligibleForAppTransferCandidate, true);
  assert.equal(failingReport.exportGatePassed, false);
  assert.equal(failingReport.eligibleForAppTransferCandidate, false);
  assert.equal(blockedFor(failingReport, "input_app_transfer_candidate_claim"), true);
});

test("appRuntimeWritePerformed true fails", () => {
  const report = reportFor((sample) => {
    sample.appRuntimeWritePerformed = true;
  });

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "app_runtime_write_performed_not_false"), true);
});

test("runtimeIntegrationEnabled true fails", () => {
  const report = reportFor((sample) => {
    sample.runtimeIntegrationEnabled = true;
  });

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "runtime_integration_enabled_not_false"), true);
});

test("productionReady true fails", () => {
  const report = reportFor((sample) => {
    sample.productionReady = true;
  });

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "production_ready_not_false"), true);
});

test("score and rating fail", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.qualityScore = 0.98;
    candidate.starRating = 5;
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "qualityScore"), true);
  assert.equal(blockedFor(report, "starRating"), true);
});

test("sensitive inference fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.ageBucket = "adult";
    candidate.genderLabel = "unknown";
    candidate.emotionLabel = "happy";
    candidate.identityLabel = "person";
    candidate.sensitiveInference = "personality";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "ageBucket"), true);
  assert.equal(blockedFor(report, "genderLabel"), true);
  assert.equal(blockedFor(report, "emotionLabel"), true);
  assert.equal(blockedFor(report, "identityLabel"), true);
  assert.equal(blockedFor(report, "sensitiveInference"), true);
});

test("raw teacher text fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.rawTeacherText = "unredacted teacher text";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "rawTeacherText"), true);
});

test("raw provider debug and prompt leakage fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.providerPayload = { hidden: true };
    candidate.debugText = "provider diagnostic text";
    candidate.promptText = "raw prompt";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "providerPayload"), true);
  assert.equal(blockedFor(report, "debugText"), true);
  assert.equal(blockedFor(report, "promptText"), true);
});

test("local path fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.appBundlePath = "C:\\Users\\example\\AppBundle\\parameter-pack.json";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "appBundlePath"), true);
});

test("real URL fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.downloadUrl = "https://example.com/parameter-pack.json";
  }));
  const serialized = JSON.stringify(report);

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "downloadUrl"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("base64 raw image fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.rawImage = "data:image/png;base64,AAAA";
  }));

  assert.equal(report.exportGatePassed, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

for (const flag of [
  "cloudTeacherEnabled",
  "providerConfigured",
  "networkCallsMade",
  "imageReadsPerformed",
  "cvInferencePerformed",
  "crawlerEnabled",
  "downloadEnabled",
  "trainingEnabled",
  "fineTuningEnabled"
]) {
  test(`${flag} true fails closed`, () => {
    const report = reportFor((sample) => {
      sample[flag] = true;
    });

    assert.equal(report.exportGatePassed, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("CLI confirms export gate and runtime transfer remain blocked", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-aesthetic-parameter-pack-export-gate.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.exportGatePassed, true);
  assert.equal(report.runMode, "parameter_pack_export_gate");
  assert.equal(report.appTransferReadiness.eligibleForAppTransferCandidate, true);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.fineTuningEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
