import Foundation

struct HistoryPhotoItem: Identifiable, Hashable {
    let id: String
    let presetNameKey: String
    let shortAdviceKey: String
    let createdAt: Date
    let hasAnalysis: Bool
}

extension HistoryPhotoItem {
    static let samples: [HistoryPhotoItem] = [
        HistoryPhotoItem(
            id: "sample-1",
            presetNameKey: "preset.warm_film.name",
            shortAdviceKey: "history.sample.advice",
            createdAt: .now,
            hasAnalysis: true
        )
    ]
}
