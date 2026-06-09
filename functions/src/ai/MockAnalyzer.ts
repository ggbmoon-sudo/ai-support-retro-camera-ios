import type {
  AnalyzePhotoRequest,
  AnalyzePhotoResponse,
} from "../contracts/photoAnalysis";
import type { AIProviderAdapter } from "./AIProviderAdapter";

export class MockAnalyzer implements AIProviderAdapter {
  readonly provider = "mock" as const;

  async analyzePhoto(request: AnalyzePhotoRequest): Promise<AnalyzePhotoResponse> {
    return {
      analysisId: `mock-analysis-${request.photoId}`,
      photoId: request.photoId,
      summary: "Mock analysis: the photo has a clear subject and can be improved with small framing and light adjustments.",
      suggestions: [
        {
          id: "mock-suggestion-light",
          title: "Soften the light",
          detail: "Move the subject slightly closer to the window or open shade for a gentler highlight.",
          priority: "high",
        },
        {
          id: "mock-suggestion-frame",
          title: "Clean the edges",
          detail: "Leave a little more space around the subject and remove distracting objects near the border.",
          priority: "medium",
        },
        {
          id: "mock-suggestion-distance",
          title: "Step back a little",
          detail: "Take half a step back to make the pose and background feel more relaxed.",
          priority: "low",
        },
      ],
      adjustments: [
        {
          id: "mock-adjustment-exposure",
          control: "exposure",
          value: -0.3,
          displayValue: "-0.3",
          reason: "A small exposure reduction helps preserve highlights in the retro preview.",
        },
        {
          id: "mock-adjustment-temperature",
          control: "temperature",
          value: 8,
          displayValue: "+8",
          reason: "A touch of warmth supports the vintage film look without changing the image too much.",
        },
      ],
      compositionNotes: "Keep the subject away from the frame edge and simplify the background.",
      lightingNotes: "Prefer soft side light over harsh direct light.",
      analysisStatus: "completed",
      provider: "mock",
      isMock: true,
      createdAt: new Date().toISOString(),
    };
  }
}
