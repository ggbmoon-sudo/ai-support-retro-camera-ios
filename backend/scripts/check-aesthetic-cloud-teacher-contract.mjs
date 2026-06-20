#!/usr/bin/env node
import {
  aestheticCloudTeacherContractSample,
  evaluateAestheticCloudTeacherContract
} from "../src/qa/aestheticCloudTeacherContract.mjs";

const report = evaluateAestheticCloudTeacherContract(aestheticCloudTeacherContractSample());

console.log(JSON.stringify(report, null, 2));

if (!report.contractValid) {
  process.exit(1);
}
