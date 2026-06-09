import type {
  AnalyzePhotoRequest,
  AnalyzePhotoResponse,
  PhotoAnalysisProvider,
} from "../contracts/photoAnalysis";

export interface AIProviderAdapter {
  readonly provider: PhotoAnalysisProvider;

  analyzePhoto(request: AnalyzePhotoRequest): Promise<AnalyzePhotoResponse>;
}

export class AIProviderNotConfiguredError extends Error {
  constructor(provider: PhotoAnalysisProvider) {
    super(`${provider} provider is not configured in this scaffold phase.`);
    this.name = "AIProviderNotConfiguredError";
  }
}
