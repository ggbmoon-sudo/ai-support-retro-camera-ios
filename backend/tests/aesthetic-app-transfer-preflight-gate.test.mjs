import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

import {
  aestheticAppTransferPreflightGateSample,
  runAestheticAppTransferPreflightGate
} from "../src/qa/aestheticAppTransferPreflightGate.mjs";

function cloneSample() {
  return structuredClone(aestheticAppTransferPreflightGateSample());
}

function reportFor(patch) {
  const sample = cloneSample();
  patch(sample);
  return runAestheticAppTransferPreflightGate(sample);
}

function candidatePatch(patch) {
  return (sample) => patch(sample.exportCandidate, sample);
}

function contractPatch(patch) {
  return (sample) => patch(sample.appContract, sample);
}

function blockedFor(report, token) {
  return report.blockedReasons.some((reason) => reason.includes(token));
}

test("valid synthetic export candidate plus app contract passes preflight as transfer candidate", () => {
  const report = runAestheticAppTransferPreflightGate(cloneSample());

  assert.equal(report.schemaVersion, "aesthetic_app_transfer_preflight_gate.v1");
  assert.equal(report.runMode, "app_transfer_preflight");
  assert.equal(report.preflightPassed, true);
  assert.equal(report.eligibleForAppTransferCandidate, true);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.xcodeProjectModified, false);
  assert.equal(report.appBundleArtifactWritten, false);
  assert.deepEqual(report.blockedReasons, []);
  assert.equal(report.contractCompatibility.exportCandidateStructurallyValidated, true);
  assert.equal(report.appTransferChecklist.languagePackOnlyUiCopy, true);
  assert.equal(report.appTransferChecklist.creativeIntentGuardRequired, true);
  assert.equal(report.appTransferChecklist.offlineFallbackRequired, true);
  assert.equal(report.appTransferChecklist.killSwitchRequired, true);
  assert.equal(report.productionReady, false);
});

for (const [field, value, token] of [
  ["eligibleForAppRuntime", true, "app_runtime_eligibility"],
  ["appRuntimeTransferBlocked", false, "app_runtime_transfer_not_blocked"],
  ["appRuntimeWritePerformed", true, "app_runtime_write_performed_not_false"],
  ["xcodeProjectModified", true, "xcode_project_modified_not_false"],
  ["appBundleArtifactWritten", true, "app_bundle_artifact_written_not_false"],
  ["runtimeIntegrationEnabled", true, "runtime_integration_enabled_not_false"],
  ["productionReady", true, "production_ready_not_false"]
]) {
  test(`${field} ${value} fails`, () => {
    const report = reportFor((sample) => {
      sample[field] = value;
    });

    assert.equal(report.preflightPassed, false);
    assert.equal(report.eligibleForAppTransferCandidate, false);
    assert.equal(blockedFor(report, token), true);
  });
}

test("missing contractVersion fails", () => {
  const report = reportFor(contractPatch((contract) => {
    delete contract.contractVersion;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_app_contract_version"), true);
});

test("missing fallback rules fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.fallbackRules;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_fallback_rules"), true);
});

test("missing app contract fallback rules fails", () => {
  const report = reportFor(contractPatch((contract) => {
    delete contract.requiredFallbackRules;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_app_contract_fallback_rules"), true);
});

test("missing safety requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.safetyRequirements;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_safety_requirements"), true);
});

test("missing app contract safety flags fails", () => {
  const report = reportFor(contractPatch((contract) => {
    delete contract.requiredSafetyFlags;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_app_contract_safety_flags"), true);
});

test("missing review requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.reviewRequirements;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_review_requirements"), true);
});

test("missing benchmark requirements fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    delete candidate.benchmarkRequirements;
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "missing_benchmark_requirements"), true);
});

for (const [field, value, token] of [
  ["uiCopyMode", "raw_teacher_text", "ui_copy_not_language_pack_only"],
  ["allowsRawTeacherText", true, "allows_raw_teacher_text"],
  ["allowsScores", true, "allows_scores"],
  ["allowsSensitiveInference", true, "allows_sensitive_inference"],
  ["allowsProviderPayload", true, "allows_provider_payload"],
  ["requiresCreativeIntentGuard", false, "missing_creative_intent_guard"],
  ["requiresOfflineFallback", false, "missing_offline_fallback"],
  ["requiresKillSwitch", false, "missing_kill_switch"]
]) {
  test(`app contract ${field} fails closed`, () => {
    const report = reportFor(contractPatch((contract) => {
      contract[field] = value;
    }));

    assert.equal(report.preflightPassed, false);
    assert.equal(blockedFor(report, token), true);
  });
}

test("unknown tag fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagThresholds.ERR_FUTURE_UNKNOWN = ["headroom_soft_high"];
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "unknown_registry_tag_ERR_FUTURE_UNKNOWN"), true);
});

test("unknown feature key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagFeatureRequirements = {
      ERR_COMP_EXCESSIVE_HEADROOM: ["futureFeature"]
    };
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "unknown_feature_key_futureFeature"), true);
});

test("unknown threshold key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.tagThresholds.ERR_COMP_EXCESSIVE_HEADROOM = ["future_threshold"];
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "unknown_threshold_key_future_threshold"), true);
});

test("unsupported suppression key fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.suppressionRules.ERR_COMP_EXCESSIVE_HEADROOM = ["future_suppression"];
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "unknown_suppression_key_future_suppression"), true);
});

test("unsupported safeActionKey fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.safeActionMappings.ERR_COMP_EXCESSIVE_HEADROOM = "future_action";
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "unsupported_safe_action_key_future_action"), true);
});

test("raw teacher text fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.rawTeacherText = "unredacted teacher text";
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "rawTeacherText"), true);
});

test("raw provider debug and prompt leakage fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.providerPayload = { hidden: true };
    candidate.debugText = "provider diagnostic text";
    candidate.promptText = "raw prompt";
    candidate.chainOfThought = "hidden reasoning";
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "providerPayload"), true);
  assert.equal(blockedFor(report, "debugText"), true);
  assert.equal(blockedFor(report, "promptText"), true);
  assert.equal(blockedFor(report, "chainOfThought"), true);
});

test("local path fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.localFilePath = "C:\\Users\\example\\parameter-pack.json";
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "localFilePath"), true);
});

test("real URL fails and is not echoed", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.downloadUrl = "https://example.com/parameter-pack.json";
  }));
  const serialized = JSON.stringify(report);

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "downloadUrl"), true);
  assert.equal(serialized.includes("https://example.com"), false);
});

test("base64 raw image fails", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.rawImage = "data:image/png;base64,AAAA";
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "rawImage"), true);
});

test("GPS EXIF and raw metadata fail", () => {
  const report = reportFor(candidatePatch((candidate) => {
    candidate.gps = "22.3,114.1";
    candidate.exif = { camera: "example" };
    candidate.rawMetadata = { capture: "raw" };
  }));

  assert.equal(report.preflightPassed, false);
  assert.equal(blockedFor(report, "gps"), true);
  assert.equal(blockedFor(report, "exif"), true);
  assert.equal(blockedFor(report, "rawMetadata"), true);
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

    assert.equal(report.preflightPassed, false);
    assert.equal(blockedFor(report, flag.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)), true);
  });
}

test("CLI confirms app transfer preflight with runtime blocked", () => {
  const output = execFileSync(
    process.execPath,
    ["scripts/check-aesthetic-app-transfer-preflight-gate.mjs"],
    { cwd: new URL("../", import.meta.url), encoding: "utf8" }
  );
  const report = JSON.parse(output);

  assert.equal(report.runMode, "app_transfer_preflight");
  assert.equal(report.preflightPassed, true);
  assert.equal(report.eligibleForAppRuntime, false);
  assert.equal(report.appRuntimeTransferBlocked, true);
  assert.equal(report.appRuntimeWritePerformed, false);
  assert.equal(report.xcodeProjectModified, false);
  assert.equal(report.appBundleArtifactWritten, false);
  assert.equal(report.networkCallsMade, false);
  assert.equal(report.imageReadsPerformed, false);
  assert.equal(report.cvInferencePerformed, false);
  assert.equal(report.trainingEnabled, false);
  assert.equal(report.fineTuningEnabled, false);
  assert.equal(report.runtimeIntegrationEnabled, false);
  assert.equal(report.productionReady, false);
});
