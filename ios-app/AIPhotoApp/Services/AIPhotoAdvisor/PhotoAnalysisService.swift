import Foundation

protocol PhotoAnalysisService {
    func analyzePhoto(_ request: PhotoAnalysisRequest) async throws -> PhotoAnalysisResult
}
