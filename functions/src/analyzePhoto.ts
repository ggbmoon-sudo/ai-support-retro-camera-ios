import { MockAnalyzer } from "./ai/MockAnalyzer";
import type {
  AnalyzePhotoRequest,
  AnalyzePhotoResponse,
} from "./contracts/photoAnalysis";

const mockAnalyzer = new MockAnalyzer();

export async function analyzePhoto(
  request: AnalyzePhotoRequest
): Promise<AnalyzePhotoResponse> {
  validateAnalyzePhotoRequest(request);
  return mockAnalyzer.analyzePhoto(request);
}

function validateAnalyzePhotoRequest(request: AnalyzePhotoRequest): void {
  if (!request.photoId || !request.ownerId) {
    throw new Error("invalidImage");
  }

  if (request.trainingConsent !== false) {
    throw new Error("trainingConsentMustRemainFalse");
  }
}
