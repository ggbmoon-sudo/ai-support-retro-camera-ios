#!/usr/bin/env node
import {
  aestheticDatasetManifestSample,
  evaluateAestheticDatasetManifest
} from "../src/qa/aestheticDatasetManifestSchema.mjs";

const report = evaluateAestheticDatasetManifest(aestheticDatasetManifestSample());

console.log(JSON.stringify(report, null, 2));

if (!report.manifestValid) {
  process.exit(1);
}
