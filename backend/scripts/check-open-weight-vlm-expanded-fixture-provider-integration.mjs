#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import {
  evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic,
  phase20GBlockedProviderIntegrationSample
} from "../src/qa/openWeightVlmExpandedFixtureProviderIntegrationDiagnostic.mjs";
import { evaluateOpenWeightVlmExpandedFixtureRegistry } from "../src/qa/openWeightVlmExpandedFixtureRegistry.mjs";

const options = parseArgs(process.argv.slice(2));
const signalSource = await loadSignals(options);
const report = evaluateOpenWeightVlmExpandedFixtureProviderIntegrationDiagnostic(signalSource);

console.log(JSON.stringify(report, null, 2));

if (report.hardBlockers.length > 0) {
  process.exit(1);
}

process.exit(0);

async function loadSignals(options) {
  if (options.inputPath) {
    return JSON.parse(await readFile(options.inputPath, "utf8"));
  }

  const sample = phase20GBlockedProviderIntegrationSample();
  if (options.inspectRegistry) {
    const registry = await loadRegistrySummary(options.registryPath);
    return {
      ...sample,
      fixtureCount: registry.totalFixtures,
      fixtureIdBuckets: { configured: registry.approvedCount },
      categoryBuckets: registry.categoryCoverage,
      backendFixtureRegistryEligible: registry.eligibleForControlledSmoke === true,
      externalServerFixtureRegistryEligible: sample.externalServerFixtureRegistryEligible
    };
  }

  if (options.inspectHealthz) {
    const healthz = JSON.parse(await readFile(options.healthzPath, "utf8"));
    return {
      ...sample,
      serverHealthBucket: sanitizeBucket(healthz.fixtureAvailabilityBucket || healthz.publicExposure || "unknown"),
      networkCallsMade: Boolean(healthz.ok)
    };
  }

  return sample;
}

async function loadRegistrySummary(registryPath) {
  const registry = JSON.parse(await readFile(registryPath, "utf8"));
  const report = evaluateOpenWeightVlmExpandedFixtureRegistry(registry);
  return {
    totalFixtures: report.totalFixtures,
    approvedCount: report.approvedCount,
    categoryCoverage: report.categoryCoverage,
    eligibleForControlledSmoke: report.eligibleForControlledSmoke
  };
}

function parseArgs(args) {
  const options = {
    inputPath: null,
    inspectRegistry: false,
    registryPath: null,
    inspectHealthz: false,
    healthzPath: null
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--inspect-registry") {
      options.inspectRegistry = true;
      continue;
    }
    if (arg === "--registry") {
      options.registryPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--registry=")) {
      options.registryPath = arg.slice("--registry=".length) || null;
      continue;
    }
    if (arg === "--inspect-healthz") {
      options.inspectHealthz = true;
      continue;
    }
    if (arg === "--healthz") {
      options.healthzPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--healthz=")) {
      options.healthzPath = arg.slice("--healthz=".length) || null;
      continue;
    }
    if (arg === "--input") {
      options.inputPath = args[index + 1] || null;
      index += 1;
      continue;
    }
    if (arg.startsWith("--input=")) {
      options.inputPath = arg.slice("--input=".length) || null;
      continue;
    }
  }

  return options;
}

function sanitizeBucket(value) {
  return String(value ?? "unknown").replace(/[^a-zA-Z0-9._:-]/g, "_").slice(0, 80) || "unknown";
}
