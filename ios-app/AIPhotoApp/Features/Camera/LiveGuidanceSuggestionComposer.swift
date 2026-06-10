import Foundation

nonisolated struct LiveGuidanceSuggestionComposer: Sendable {
    func suggestions(
        for signals: [LiveGuidanceSignal],
        selectedPreset: FilterPreset,
        limit: Int = 3
    ) -> [LiveGuidanceSuggestion] {
        var suggestions: [LiveGuidanceSuggestion] = []

        for signal in signals {
            guard let suggestion = suggestion(for: signal, selectedPreset: selectedPreset),
                  !suggestions.contains(where: { $0.id == suggestion.id }) else {
                continue
            }

            suggestions.append(suggestion)
            if suggestions.count == limit {
                break
            }
        }

        return suggestions
    }

    private func suggestion(
        for signal: LiveGuidanceSignal,
        selectedPreset: FilterPreset
    ) -> LiveGuidanceSuggestion? {
        switch signal {
        case .localSignalUnavailable:
            return LiveGuidanceSuggestion(
                id: "local_signal_unavailable",
                messageKey: "camera.guidance.suggestion.local_signal_unavailable",
                category: .composition
            )
        case .lightingLooksBalanced:
            return LiveGuidanceSuggestion(
                id: "lighting_balanced",
                messageKey: "camera.guidance.suggestion.lighting_balanced",
                category: .lighting
            )
        case .tooDark:
            return LiveGuidanceSuggestion(
                id: "move_closer_to_light",
                messageKey: "camera.guidance.suggestion.move_closer_to_light",
                category: .lighting
            )
        case .tooBright:
            return LiveGuidanceSuggestion(
                id: "avoid_direct_light",
                messageKey: "camera.guidance.suggestion.avoid_direct_light",
                category: .lighting
            )
        case .subjectOffCenter:
            return LiveGuidanceSuggestion(
                id: "center_subject",
                messageKey: "camera.guidance.suggestion.center_subject",
                category: .composition
            )
        case .lowHeadroom:
            return LiveGuidanceSuggestion(
                id: "more_headroom",
                messageKey: "camera.guidance.suggestion.more_headroom",
                category: .portrait
            )
        case .faceTooClose:
            return LiveGuidanceSuggestion(
                id: "step_back_portrait",
                messageKey: "camera.guidance.suggestion.step_back_portrait",
                category: .portrait
            )
        case .faceTooFar:
            return LiveGuidanceSuggestion(
                id: "move_closer_portrait",
                messageKey: "camera.guidance.suggestion.move_closer_portrait",
                category: .portrait
            )
        case .portraitLikely:
            return LiveGuidanceSuggestion(
                id: "portrait_framing_ready",
                messageKey: "camera.guidance.suggestion.portrait_framing_ready",
                category: .portrait
            )
        case .warmFilterHelpful:
            guard !selectedPreset.id.contains("warm"),
                  !selectedPreset.id.contains("gold"),
                  !selectedPreset.id.contains("portrait") else {
                return nil
            }

            return LiveGuidanceSuggestion(
                id: "try_warm_filter",
                messageKey: "camera.guidance.suggestion.try_warm_filter",
                category: .filter
            )
        }
    }
}
