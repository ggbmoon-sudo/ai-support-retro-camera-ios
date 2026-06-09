import Combine
import SwiftUI
import UIKit

@MainActor
class SessionHistoryStore: ObservableObject {
    @Published private(set) var items: [SessionHistoryItem] = []

    func addOrUpdate(_ item: SessionHistoryItem) {
        if let index = items.firstIndex(where: { $0.id == item.id }) {
            items[index] = items[index].merged(with: item)
        } else {
            items.insert(item, at: 0)
        }
    }

    func recordMockSave(
        photo: CapturedPhoto,
        previewImage: UIImage,
        filterPreset: FilterPreset,
        saveState: PhotoSaveState
    ) {
        let status: SessionHistoryStatus
        let savedPhotoId: String?

        switch saveState {
        case .saved(let savedPhoto):
            status = .mockSaved
            savedPhotoId = savedPhoto.id
        case .failed:
            status = .mockSaveFailed
            savedPhotoId = nil
        case .idle, .saving:
            status = .localDraft
            savedPhotoId = nil
        }

        let item = SessionHistoryItem(
            id: localID(for: photo),
            createdAt: existingItem(for: photo)?.createdAt ?? Date(),
            updatedAt: Date(),
            source: photo.source,
            thumbnailImage: thumbnail(from: previewImage),
            filterPresetId: filterPreset.id,
            filterPresetNameKey: filterPreset.nameKey,
            saveStatus: status,
            analysisStatus: nil,
            mockSavedPhotoId: savedPhotoId,
            mockAnalysisSummary: nil,
            mockAnalysisProvider: nil,
            isMock: true,
            localOnly: true
        )

        addOrUpdate(item)
    }

    func recordMockAnalysis(
        photo: CapturedPhoto,
        previewImage: UIImage,
        filterPreset: FilterPreset,
        result: PhotoAnalysisResult
    ) {
        let existing = existingItem(for: photo)
        let item = SessionHistoryItem(
            id: localID(for: photo),
            createdAt: existing?.createdAt ?? Date(),
            updatedAt: Date(),
            source: photo.source,
            thumbnailImage: thumbnail(from: previewImage),
            filterPresetId: filterPreset.id,
            filterPresetNameKey: filterPreset.nameKey,
            saveStatus: existing?.saveStatus ?? .localDraft,
            analysisStatus: .mockAnalyzed,
            mockSavedPhotoId: existing?.mockSavedPhotoId,
            mockAnalysisSummary: result.summary,
            mockAnalysisProvider: result.provider,
            isMock: true,
            localOnly: true
        )

        addOrUpdate(item)
    }

    func clear() {
        items.removeAll()
    }

    func existingItem(for photo: CapturedPhoto) -> SessionHistoryItem? {
        items.first { $0.id == localID(for: photo) }
    }

    private func localID(for photo: CapturedPhoto) -> String {
        "local-\(photo.id.uuidString.lowercased())"
    }

    private func thumbnail(from image: UIImage) -> UIImage? {
        let targetSize = CGSize(width: 120, height: 120)
        let format = UIGraphicsImageRendererFormat()
        format.scale = image.scale
        format.opaque = true

        let renderer = UIGraphicsImageRenderer(size: targetSize, format: format)
        return renderer.image { _ in
            let sourceSize = image.size
            guard sourceSize.width > 0, sourceSize.height > 0 else { return }

            let scale = max(targetSize.width / sourceSize.width, targetSize.height / sourceSize.height)
            let scaledSize = CGSize(width: sourceSize.width * scale, height: sourceSize.height * scale)
            let origin = CGPoint(
                x: (targetSize.width - scaledSize.width) / 2,
                y: (targetSize.height - scaledSize.height) / 2
            )
            image.draw(in: CGRect(origin: origin, size: scaledSize))
        }
    }
}
