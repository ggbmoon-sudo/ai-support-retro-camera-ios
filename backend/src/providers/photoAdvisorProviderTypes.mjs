export const PhotoAdvisorProviderKind = Object.freeze({
  localStub: "local_stub",
  localModel: "local_model",
  siliconflow: "siliconflow",
  runpodSelfHostedFallback: "runpod_self_hosted_fallback"
});

export const PhotoAdvisorProviderMode = Object.freeze({
  mock: "mock",
  noRuntimeContract: "no_runtime_contract",
  apiServerless: "api_serverless",
  selfHosted: "self_hosted"
});

export const PhotoAdvisorModelCandidate = Object.freeze({
  deepseekV4Flash: "deepseek_v4_flash",
  qwen3Vl30BA3BInstruct: "qwen3_vl_30b_a3b_instruct",
  qwen3Vl32BInstruct: "qwen3_vl_32b_instruct",
  qwen3Vl8BInstruct: "qwen3_vl_8b_instruct",
  glm45v: "glm_4_5v"
});

export const PHOTO_ADVISOR_MODEL_IDS = Object.freeze({
  [PhotoAdvisorModelCandidate.deepseekV4Flash]: "deepseek-ai/DeepSeek-V4-Flash",
  [PhotoAdvisorModelCandidate.qwen3Vl30BA3BInstruct]: "Qwen/Qwen3-VL-30B-A3B-Instruct",
  [PhotoAdvisorModelCandidate.qwen3Vl32BInstruct]: "Qwen/Qwen3-VL-32B-Instruct",
  [PhotoAdvisorModelCandidate.qwen3Vl8BInstruct]: "Qwen/Qwen3-VL-8B-Instruct",
  [PhotoAdvisorModelCandidate.glm45v]: "zai-org/GLM-4.5V"
});

export function isSupportedPhotoAdvisorProvider(value) {
  return Object.values(PhotoAdvisorProviderKind).includes(value);
}

export function isSupportedPhotoAdvisorModelCandidate(value) {
  return Object.values(PhotoAdvisorModelCandidate).includes(value);
}

export function photoAdvisorProductionReadyFlag() {
  return false;
}
