import Foundation
import UIKit

struct SessionHistoryItem: Identifiable {
    let id: String
    var createdAt: Date
    var updatedAt: Date
    var source: CapturedPhoto.Source
    var thumbnailImage: UIImage?
    var filterPresetId: String
    var filterPresetNameKey: String
    var saveStatus: SessionHistoryStatus
    var analysisStatus: SessionHistoryStatus?
    var mockSavedPhotoId: String?
    var mockAnalysisSummary: String?
    var mockAnalysisProvider: PhotoAnalysisProvider?
    let isMock: Bool
    let localOnly: Bool

    var sourceTitleKey: String {
        switch source {
        case .camera:
            return "history.source.camera"
        case .photoLibrary:
            return "history.source.photo_library"
        }
    }

    var statusTitleKey: String {
        analysisStatus?.titleKey ?? saveStatus.titleKey
    }

    func merged(with newer: SessionHistoryItem) -> SessionHistoryItem {
        SessionHistoryItem(
            id: id,
            createdAt: createdAt,
            updatedAt: newer.updatedAt,
            source: newer.source,
            thumbnailImage: newer.thumbnailImage ?? thumbnailImage,
            filterPresetId: newer.filterPresetId,
            filterPresetNameKey: newer.filterPresetNameKey,
            saveStatus: newer.saveStatus == .localDraft ? saveStatus : newer.saveStatus,
            analysisStatus: newer.analysisStatus ?? analysisStatus,
            mockSavedPhotoId: newer.mockSavedPhotoId ?? mockSavedPhotoId,
            mockAnalysisSummary: newer.mockAnalysisSummary ?? mockAnalysisSummary,
            mockAnalysisProvider: newer.mockAnalysisProvider ?? mockAnalysisProvider,
            isMock: true,
            localOnly: true
        )
    }
}
