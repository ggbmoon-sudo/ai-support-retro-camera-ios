import {
  AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
  aestheticCloudTeacherContractSample
} from "./aestheticCloudTeacherContract.mjs";

export const AESTHETIC_CLOUD_TEACHER_PROVIDER_ADAPTER_CONTRACT_VERSION =
  "aesthetic_cloud_teacher_provider_adapter.v1";

export const PROVIDER_ADAPTER_MODES = Object.freeze([
  "disabled",
  "stub_test_only"
]);

export function createDisabledCloudTeacherProviderAdapter() {
  return {
    contractVersion: AESTHETIC_CLOUD_TEACHER_PROVIDER_ADAPTER_CONTRACT_VERSION,
    adapterMode: "disabled",
    providerSmokeAttempted: false,
    providerResponseReceived: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    async requestTeacherLabels() {
      return {
        adapterMode: "disabled",
        providerSmokeAttempted: false,
        providerResponseReceived: false,
        teacherResponse: null,
        blockedReasons: ["blocked_for_disabled_provider_adapter"],
        networkCallsMade: false,
        imageReadsPerformed: false
      };
    }
  };
}

export function createStubCloudTeacherProviderAdapter(options = {}) {
  return {
    contractVersion: AESTHETIC_CLOUD_TEACHER_PROVIDER_ADAPTER_CONTRACT_VERSION,
    adapterMode: "stub_test_only",
    providerSmokeAttempted: false,
    providerResponseReceived: false,
    networkCallsMade: false,
    imageReadsPerformed: false,
    async requestTeacherLabels(envelope) {
      const sample = aestheticCloudTeacherContractSample();
      return {
        adapterMode: "stub_test_only",
        providerSmokeAttempted: false,
        providerResponseReceived: false,
        teacherResponse: {
          ...sample.response,
          schemaVersion: AESTHETIC_CLOUD_TEACHER_CONTRACT_SCHEMA_VERSION,
          jobId: sanitizeToken(envelope?.jobId || sample.response.jobId),
          imageId: sanitizeToken(envelope?.imageId || sample.response.imageId),
          candidateLabels: options.teacherResponse?.candidateLabels || sample.response.candidateLabels,
          ...(options.teacherResponse || {})
        },
        blockedReasons: [],
        networkCallsMade: false,
        imageReadsPerformed: false
      };
    }
  };
}

export function isCloudTeacherProviderAdapter(value) {
  return Boolean(value) &&
    typeof value === "object" &&
    value.contractVersion === AESTHETIC_CLOUD_TEACHER_PROVIDER_ADAPTER_CONTRACT_VERSION &&
    PROVIDER_ADAPTER_MODES.includes(value.adapterMode) &&
    typeof value.requestTeacherLabels === "function";
}

function sanitizeToken(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9_.:-]/g, "_")
    .slice(0, 140);
}
