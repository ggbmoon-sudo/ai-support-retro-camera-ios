import Foundation

@MainActor
struct LocalRuleBasedGuidanceProvider: LiveGuidanceProvider {
    private let frameAnalyzer: LiveGuidanceFrameAnalyzer
    private let suggestionComposer: LiveGuidanceSuggestionComposer

    init(
        frameAnalyzer: LiveGuidanceFrameAnalyzer = LiveGuidanceFrameAnalyzer(),
        suggestionComposer: LiveGuidanceSuggestionComposer = LiveGuidanceSuggestionComposer()
    ) {
        self.frameAnalyzer = frameAnalyzer
        self.suggestionComposer = suggestionComposer
    }

    func suggestions(
        for state: LiveGuidanceMockState,
        selectedPreset: FilterPreset
    ) -> [LiveGuidanceSuggestion] {
        switch state {
        case .off, .paused, .scanning:
            return []
        case .idle:
            return [
                LiveGuidanceSuggestion(
                    id: "local_signal_unavailable",
                    messageKey: "camera.guidance.suggestion.local_signal_unavailable",
                    category: .composition
                )
            ]
        case .suggestionAvailable:
            let signals = frameAnalyzer.fallbackSignals(selectedPreset: selectedPreset)
            return suggestionComposer.suggestions(for: signals, selectedPreset: selectedPreset)
        }
    }
}

