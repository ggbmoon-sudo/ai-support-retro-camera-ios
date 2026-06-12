import { CloudAIProvider } from "./CloudAIProvider.mjs";

export class DisabledProvider extends CloudAIProvider {
  async analyzePhotoAdvisor() {
    const error = new Error("Provider integration is disabled");
    error.code = "provider_disabled";
    throw error;
  }
}
