import Foundation

enum SessionHistoryStatus: String, CaseIterable {
    case localDraft
    case mockSaved
    case mockSaveFailed
    case mockAnalyzed
    case mockAnalysisFailed

    var titleKey: String {
        switch self {
        case .localDraft:
            return "history.status.local_draft"
        case .mockSaved:
            return "history.status.mock_saved"
        case .mockSaveFailed:
            return "history.status.mock_save_failed"
        case .mockAnalyzed:
            return "history.status.mock_analyzed"
        case .mockAnalysisFailed:
            return "history.status.mock_analysis_failed"
        }
    }
}
