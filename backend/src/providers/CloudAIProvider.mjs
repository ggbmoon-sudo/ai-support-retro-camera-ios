/**
 * Provider boundary for future Cloud AI integrations.
 *
 * Phase 17C-Prep intentionally ships only mock/disabled providers. Do not add
 * real provider clients, SDK imports, API key reads, or provider URLs here
 * without an explicit future provider phase.
 */
export class CloudAIProvider {
  async analyzePhotoAdvisor(_input) {
    throw new Error("CloudAIProvider.analyzePhotoAdvisor must be implemented by a safe provider");
  }
}
