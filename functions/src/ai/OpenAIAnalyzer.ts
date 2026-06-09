import type {
  AnalyzePhotoRequest,
  AnalyzePhotoResponse,
} from "../contracts/photoAnalysis";
import type { AIProviderAdapter } from "./AIProviderAdapter";
import { AIProviderNotConfiguredError } from "./AIProviderAdapter";

export class OpenAIAnalyzer implements AIProviderAdapter {
  readonly provider = "openai" as const;

  async analyzePhoto(_request: AnalyzePhotoRequest): Promise<AnalyzePhotoResponse> {
    // TODO: Future phase only. Real OpenAI setup must use server-side secrets,
    // explicit user consent, cost controls, and no image editing in Phase 06.
    throw new AIProviderNotConfiguredError(this.provider);
  }
}
