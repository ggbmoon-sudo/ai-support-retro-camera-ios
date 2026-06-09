export type AnalysisLanguage = "en" | "zh-Hant";

export type PhotoAnalysisProvider = "mock" | "gemini" | "openai";

export type PhotoAnalysisStatus =
  | "notStarted"
  | "analyzing"
  | "completed"
  | "failed"
  | "blockedByConsentLater"
  | "quotaRequiredLater"
  | "unsafeContent";

export type PhotoAnalysisErrorCode =
  | "invalidImage"
  | "quotaRequiredLater"
  | "providerUnavailable"
  | "networkUnavailable"
  | "unsafeContent"
  | "notConfigured"
  | "unknown";

export type PhotoSuggestionPriority = "high" | "medium" | "low";

export type PhotoAdjustmentControl =
  | "exposure"
  | "contrast"
  | "temperature"
  | "saturation";

export interface AnalyzePhotoRequest {
  photoId: string;
  ownerId: string;
  storagePath?: string;
  filterPresetId?: string | null;
  language: AnalysisLanguage;
  trainingConsent: false;
  isMock?: boolean;
}

export interface AnalyzePhotoResponse {
  analysisId: string;
  photoId: string;
  summary: string;
  suggestions: PhotoSuggestion[];
  adjustments: PhotoAdjustmentHint[];
  compositionNotes?: string;
  lightingNotes?: string;
  analysisStatus: PhotoAnalysisStatus;
  provider: PhotoAnalysisProvider;
  isMock: boolean;
  createdAt: string;
}

export interface PhotoSuggestion {
  id: string;
  title: string;
  detail: string;
  priority: PhotoSuggestionPriority;
}

export interface PhotoAdjustmentHint {
  id: string;
  control: PhotoAdjustmentControl;
  value: number;
  displayValue: string;
  reason: string;
}

export interface PhotoAnalysisError {
  code: PhotoAnalysisErrorCode;
  message: string;
}
