import Foundation

nonisolated struct PhotoAnalysisResult: Identifiable, Hashable, Sendable {
    let id: String
    let photoId: String
    let summary: String
    let suggestions: [PhotoSuggestion]
    let adjustments: [PhotoAdjustmentHint]
    let compositionNotes: String?
    let lightingNotes: String?
    let analysisStatus: PhotoAnalysisStatus
    let provider: PhotoAnalysisProvider
    let isMock: Bool
    let createdAt: Date

    static func mockSuccess(photoId: String, createdAt: Date = Date()) -> PhotoAnalysisResult {
        PhotoAnalysisResult(
            id: "mock-analysis-\(UUID().uuidString.lowercased())",
            photoId: photoId,
            summary: NSLocalizedString("ai.mock.summary", comment: ""),
            suggestions: [
                PhotoSuggestion(
                    title: NSLocalizedString("ai.mock.suggestion.light.title", comment: ""),
                    detail: NSLocalizedString("ai.mock.suggestion.light.detail", comment: ""),
                    priority: .high
                ),
                PhotoSuggestion(
                    title: NSLocalizedString("ai.mock.suggestion.frame.title", comment: ""),
                    detail: NSLocalizedString("ai.mock.suggestion.frame.detail", comment: ""),
                    priority: .medium
                ),
                PhotoSuggestion(
                    title: NSLocalizedString("ai.mock.suggestion.distance.title", comment: ""),
                    detail: NSLocalizedString("ai.mock.suggestion.distance.detail", comment: ""),
                    priority: .low
                )
            ],
            adjustments: [
                PhotoAdjustmentHint(
                    control: .exposure,
                    value: -0.3,
                    displayValue: "-0.3",
                    reason: NSLocalizedString("ai.mock.adjustment.exposure.reason", comment: "")
                ),
                PhotoAdjustmentHint(
                    control: .temperature,
                    value: 8,
                    displayValue: "+8",
                    reason: NSLocalizedString("ai.mock.adjustment.temperature.reason", comment: "")
                )
            ],
            compositionNotes: NSLocalizedString("ai.mock.composition_notes", comment: ""),
            lightingNotes: NSLocalizedString("ai.mock.lighting_notes", comment: ""),
            analysisStatus: .completed,
            provider: .mock,
            isMock: true,
            createdAt: createdAt
        )
    }
}

nonisolated struct PhotoSuggestion: Identifiable, Hashable, Sendable {
    enum Priority: String, CaseIterable, Sendable {
        case high
        case medium
        case low
    }

    let id: String
    let title: String
    let detail: String
    let priority: Priority

    init(
        id: String = UUID().uuidString,
        title: String,
        detail: String,
        priority: Priority
    ) {
        self.id = id
        self.title = title
        self.detail = detail
        self.priority = priority
    }
}

nonisolated struct PhotoAdjustmentHint: Identifiable, Hashable, Sendable {
    enum Control: String, CaseIterable, Sendable {
        case exposure
        case contrast
        case temperature
        case saturation
    }

    let id: String
    let control: Control
    let value: Double
    let displayValue: String
    let reason: String

    init(
        id: String = UUID().uuidString,
        control: Control,
        value: Double,
        displayValue: String,
        reason: String
    ) {
        self.id = id
        self.control = control
        self.value = value
        self.displayValue = displayValue
        self.reason = reason
    }
}
