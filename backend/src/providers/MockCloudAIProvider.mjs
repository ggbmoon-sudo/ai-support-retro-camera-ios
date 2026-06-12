import { CloudAIProvider } from "./CloudAIProvider.mjs";
import { mockPhotoAdvisorResponse } from "./mockProvider.mjs";

export class MockCloudAIProvider extends CloudAIProvider {
  async analyzePhotoAdvisor(input) {
    return mockPhotoAdvisorResponse({
      locale: input.locale,
      selectedFilterId: input.selectedFilterId
    });
  }
}
