import Foundation

nonisolated struct LiveGuidanceSuggestionComposer: Sendable {
    private let copyResolver: GuidanceCopyResolver

    init(copyResolver: GuidanceCopyResolver = GuidanceCopyResolver()) {
        self.copyResolver = copyResolver
    }

    func suggestions(
        for signals: [LiveGuidanceSignal],
        selectedPreset: FilterPreset,
        limit: Int = 3,
        languageMode: AppLanguageMode = .traditionalChinese,
        toneMode: ToneMode = .neutral
    ) -> [LiveGuidanceSuggestion] {
        var suggestions: [LiveGuidanceSuggestion] = []

        for signal in ranked(signals) {
            guard let suggestion = suggestion(
                for: signal,
                selectedPreset: selectedPreset,
                languageMode: languageMode,
                toneMode: toneMode
            ),
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
        selectedPreset: FilterPreset,
        languageMode: AppLanguageMode,
        toneMode: ToneMode
    ) -> LiveGuidanceSuggestion? {
        switch signal {
        case .localSignalUnavailable:
            return LiveGuidanceSuggestion(
                id: "local_signal_unavailable",
                messageKey: copyResolver.messageKey(
                    for: .unavailable,
                    language: languageMode,
                    requestedTone: toneMode
                ),
                category: .composition
            )
        case .lightingLooksBalanced:
            return LiveGuidanceSuggestion(
                id: "lighting_balanced",
                messageKey: copyResolver.messageKey(
                    for: .successPraise,
                    language: languageMode,
                    requestedTone: toneMode
                ),
                category: .lighting
            )
        case .tooDark:
            return LiveGuidanceSuggestion(
                id: "move_closer_to_light",
                messageKey: copyResolver.messageKey(
                    for: .lighting,
                    language: languageMode,
                    requestedTone: toneMode
                ),
                category: .lighting
            )
        case .tooBright:
            return LiveGuidanceSuggestion(
                id: "avoid_direct_light",
                messageKey: copyResolver.messageKey(
                    for: .directLight,
                    language: languageMode,
                    requestedTone: toneMode
                ),
                category: .lighting
            )
        case .subjectOffCenter,
             .subjectNearEdge,
             .lowHeadroom,
             .faceTooClose,
             .subjectTooLarge,
             .faceTooFar,
             .subjectTooSmall,
             .portraitLikely,
             .ruleOfThirdsAligned,
             .verticalBalanceReady:
            return nil
        case .warmFilterHelpful:
            guard !selectedPreset.id.contains("warm"),
                  !selectedPreset.id.contains("gold"),
                  !selectedPreset.id.contains("portrait") else {
                return nil
            }

            return LiveGuidanceSuggestion(
                id: "try_warm_filter",
                messageKey: copyResolver.messageKey(
                    for: .filter,
                    language: languageMode,
                    requestedTone: toneMode
                ),
                category: .filter
            )
        }
    }
}
