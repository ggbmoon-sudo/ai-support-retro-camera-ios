import Foundation

final class CloudFunctionPhotoAnalysisService: PhotoAnalysisService {
    func analyzePhoto(_ request: PhotoAnalysisRequest) async throws -> PhotoAnalysisResult {
        // TODO: Phase 06 keeps this adapter as a placeholder only.
        // Real Cloud Functions calls require Firebase SDK setup, App Check,
        // Auth ownership checks, consent/quota handling, server-side AI keys,
        // and an explicit user request in a later task.
        throw PhotoAnalysisError.notConfigured
    }
}
