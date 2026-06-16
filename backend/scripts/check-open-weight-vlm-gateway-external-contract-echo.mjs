#!/usr/bin/env node
import {
  evaluateOpenWeightVlmGatewayExternalContractEcho
} from "../src/qa/openWeightVlmGatewayAdapterStub.mjs";

const report = await evaluateOpenWeightVlmGatewayExternalContractEcho({
  endpointUrl: endpointFromArgs(process.argv.slice(2)),
  fetchImpl: mockFetchFromArgs(process.argv.slice(2))
});

console.log(JSON.stringify(report, null, 2));

if (!report.eligibleForExternalContractEchoReview) {
  process.exit(1);
}

process.exit(0);

function endpointFromArgs(args) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--endpoint") {
      return args[index + 1] || undefined;
    }
    if (arg.startsWith("--endpoint=")) {
      return arg.slice("--endpoint=".length) || undefined;
    }
  }
  return undefined;
}

function mockFetchFromArgs(args) {
  if (args.includes("--mock-safe")) {
    return async (url) => jsonResponse(String(url).endsWith("/healthz")
      ? {
        ok: true,
        publicExposure: "no",
        rawLoggingDisabled: true,
        gatewayContractEchoAvailable: true,
        modelInferenceRun: false,
        productionReady: false
      }
      : {
        ok: true,
        mode: "gateway_contract_echo",
        candidate: {
          schemaVersion: "photo_advisor_vlm_candidate.v1",
          sourceType: "internal",
          allowedContext: "imageOnly",
          moodKey: "mood.warm_calm",
          visualObservationKey: "observation.warm_indoor_light",
          creativeIntent: {
            classification: "style_positive",
            preserveSignals: []
          },
          technicalRisk: {
            level: "none",
            reasonKey: null
          },
          filterFamilyCandidate: "warm_film",
          optionalActionKey: "action.try_filter_first",
          retakeAllowed: false,
          retakeReasonKey: null,
          safety: {
            sensitiveInferenceDetected: false,
            forbiddenInferenceTypes: [],
            scoreOrRatingDetected: false,
            chainOfThoughtDetected: false,
            debugLeakageDetected: false
          }
        },
        modelInferenceRun: false,
        rawLoggingDisabled: true,
        publicExposure: "no",
        productionReady: false,
        rawPromptPersisted: false,
        rawModelResponsePersisted: false,
        rawImagePersisted: false,
        rawImagePathPersisted: false,
        requestPayloadPersisted: false
      });
  }
  if (args.includes("--mock-unsafe")) {
    return async (url) => jsonResponse(String(url).endsWith("/healthz")
      ? {
        ok: true,
        publicExposure: "public",
        rawLoggingDisabled: false,
        modelInferenceRun: true,
        productionReady: true
      }
      : {
        ok: true,
        mode: "gateway_contract_echo",
        text: "free form",
        modelInferenceRun: true,
        rawLoggingDisabled: false,
        publicExposure: "public",
        productionReady: true,
        rawPromptPersisted: true,
        rawModelResponsePersisted: true,
        rawImagePersisted: true,
        rawImagePathPersisted: true,
        requestPayloadPersisted: true
      });
  }
  return undefined;
}

function jsonResponse(value) {
  return {
    ok: true,
    json: async () => value
  };
}
