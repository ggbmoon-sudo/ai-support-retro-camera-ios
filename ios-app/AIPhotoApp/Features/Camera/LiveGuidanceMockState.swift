import Foundation

nonisolated enum LiveGuidanceMockState: String, CaseIterable, Sendable {
    case off
    case idle
    case scanning
    case suggestionAvailable
    case paused

    var titleKey: String {
        switch self {
        case .off:
            return "camera.guidance.state.off"
        case .idle:
            return "camera.guidance.state.idle"
        case .scanning:
            return "camera.guidance.state.scanning"
        case .suggestionAvailable:
            return "camera.guidance.state.suggestion_available"
        case .paused:
            return "camera.guidance.state.paused"
        }
    }

    func titleKey(for mode: LiveGuidanceMode) -> String {
        guard mode == .local else { return titleKey }

        switch self {
        case .off:
            return "camera.guidance.state.off"
        case .idle:
            return "camera.guidance.state.local_idle"
        case .scanning:
            return "camera.guidance.state.local_scanning"
        case .suggestionAvailable:
            return "camera.guidance.state.local_suggestion_available"
        case .paused:
            return "camera.guidance.state.paused"
        }
    }
}

nonisolated enum LiveGuidanceSuggestionCategory: String, Hashable, Sendable {
    case lighting
    case composition
    case background
    case portrait
    case filter
}

nonisolated struct LiveGuidanceSuggestion: Identifiable, Hashable, Sendable {
    let id: String
    let messageKey: String
    let category: LiveGuidanceSuggestionCategory
}

@MainActor
protocol LiveGuidanceProvider {
    func suggestions(
        for state: LiveGuidanceMockState,
        selectedPreset: FilterPreset,
        frameSignals: [LiveGuidanceSignal]?
    ) -> [LiveGuidanceSuggestion]
}

extension LiveGuidanceProvider {
    func suggestions(
        for state: LiveGuidanceMockState,
        selectedPreset: FilterPreset
    ) -> [LiveGuidanceSuggestion] {
        suggestions(for: state, selectedPreset: selectedPreset, frameSignals: nil)
    }
}

@MainActor
struct MockLiveGuidanceProvider: LiveGuidanceProvider {
    private let availableSuggestions = [
        LiveGuidanceSuggestion(
            id: "move_closer_to_light",
            messageKey: "camera.guidance.suggestion.move_closer_to_light",
            category: .lighting
        ),
        LiveGuidanceSuggestion(
            id: "center_subject",
            messageKey: "camera.guidance.suggestion.center_subject",
            category: .composition
        ),
        LiveGuidanceSuggestion(
            id: "change_angle",
            messageKey: "camera.guidance.suggestion.change_angle",
            category: .background
        ),
        LiveGuidanceSuggestion(
            id: "more_headroom",
            messageKey: "camera.guidance.suggestion.more_headroom",
            category: .portrait
        ),
        LiveGuidanceSuggestion(
            id: "try_warm_filter",
            messageKey: "camera.guidance.suggestion.try_warm_filter",
            category: .filter
        )
    ]

    func suggestions(
        for state: LiveGuidanceMockState,
        selectedPreset: FilterPreset,
        frameSignals: [LiveGuidanceSignal]? = nil
    ) -> [LiveGuidanceSuggestion] {
        switch state {
        case .off, .paused:
            return []
        case .idle:
            return Array(availableSuggestions.prefix(1))
        case .scanning:
            return []
        case .suggestionAvailable:
            let offset = selectedPreset.id.unicodeScalars.reduce(0) { partialResult, scalar in
                partialResult + Int(scalar.value)
            } % availableSuggestions.count
            let rotated = Array(availableSuggestions[offset...]) + Array(availableSuggestions[..<offset])
            return Array(rotated.prefix(3))
        }
    }
}
