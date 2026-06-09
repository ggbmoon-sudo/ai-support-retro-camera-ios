import type {
  AnalyzePhotoRequest,
  AnalyzePhotoResponse,
} from "../contracts/photoAnalysis";
import type { AIProviderAdapter } from "./AIProviderAdapter";
import { AIProviderNotConfiguredError } from "./AIProviderAdapter";

export class GeminiAnalyzer implements AIProviderAdapter {
  readonly provider = "gemini" as const;

  async analyzePhoto(_request: AnalyzePhotoRequest): Promise<AnalyzePhotoResponse> {
    // TODO: Future phase only. Real Gemini setup must use server-side secrets,
    // consent/quota checks, structured response validation, and no client-side keys.
    throw new AIProviderNotConfiguredError(this.provider);
  }
}
