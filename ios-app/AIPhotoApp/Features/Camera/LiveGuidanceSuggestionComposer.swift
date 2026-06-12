import Foundation

nonisolated struct LiveGuidanceSuggestionComposer: Sendable {
    private let copyResolver: GuidanceCopyResolver
    private let runtimeTone: ToneMode

    init(
        copyResolver: GuidanceCopyResolver = GuidanceCopyResolver(),
        runtimeTone: ToneMode = .neutral
    ) {
        self.copyResolver = copyResolver
        self.runtimeTone = runtimeTone
    }

    func suggestions(
        for signals: [LiveGuidanceSignal],
        selectedPreset: FilterPreset,
        limit: Int = 3
    ) -> [LiveGuidanceSuggestion] {
        var suggestions: [LiveGuidanceSuggestion] = []

        for signal in ranked(signals) {
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

    private func ranked(_ signals: [LiveGuidanceSignal]) -> [LiveGuidanceSignal] {
        signals
            .reduce(into: [LiveGuidanceSignal]()) { result, signal in
                guard !result.contains(signal) else { return }
                result.append(signal)
            }
            .sorted { lhs, rhs in
                if lhs.guidancePriority != rhs.guidancePriority {
                    return lhs.guidancePriority < rhs.guidancePriority
                }

                return lhs.stableSortKey < rhs.stableSortKey
            }
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
                messageKey: copyResolver.messageKey(
                    for: .successPraise,
                    requestedTone: runtimeTone
                ),
                category: .lighting
            )
        case .tooDark:
            return LiveGuidanceSuggestion(
                id: "move_closer_to_light",
                messageKey: copyResolver.messageKey(
                    for: .lighting,
                    requestedTone: runtimeTone
                ),
                category: .lighting
            )
        case .tooBright:
            return LiveGuidanceSuggestion(
                id: "avoid_direct_light",
                messageKey: copyResolver.messageKey(
                    for: .directLight,
                    requestedTone: runtimeTone
                ),
                category: .lighting
            )
        case .subjectOffCenter:
            return LiveGuidanceSuggestion(
                id: "center_subject",
                messageKey: copyResolver.messageKey(
                    for: .framing,
                    requestedTone: runtimeTone
                ),
                category: .composition
            )
        case .lowHeadroom:
            return LiveGuidanceSuggestion(
                id: "more_headroom",
                messageKey: copyResolver.messageKey(
                    for: .headroom,
                    requestedTone: runtimeTone
                ),
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
