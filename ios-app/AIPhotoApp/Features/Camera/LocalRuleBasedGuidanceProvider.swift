import Foundation

@MainActor
struct LocalRuleBasedGuidanceProvider: LiveGuidanceProvider {
    private let frameAnalyzer: LiveGuidanceFrameAnalyzer
    private let suggestionComposer: LiveGuidanceSuggestionComposer
    private let toneSettingsStore: CameraCoachToneSettingsStore

    init(
        frameAnalyzer: LiveGuidanceFrameAnalyzer = LiveGuidanceFrameAnalyzer(),
        suggestionComposer: LiveGuidanceSuggestionComposer = LiveGuidanceSuggestionComposer(),
        toneSettingsStore: CameraCoachToneSettingsStore? = nil
    ) {
        self.frameAnalyzer = frameAnalyzer
        self.suggestionComposer = suggestionComposer
        self.toneSettingsStore = toneSettingsStore ?? CameraCoachToneSettingsStore.shared
    }

    func suggestions(
        for state: LiveGuidanceMockState,
        selectedPreset: FilterPreset,
        frameSignals: [LiveGuidanceSignal]? = nil
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
            let languageMode = toneSettingsStore.runtimeLanguageMode
            let toneMode = toneSettingsStore.runtimeToneMode

            if let frameSignals {
                return suggestionComposer.suggestions(
                    for: frameSignals,
                    selectedPreset: selectedPreset,
                    languageMode: languageMode,
                    toneMode: toneMode
                )
            }

            let signals = frameAnalyzer.fallbackSignals(selectedPreset: selectedPreset)
            return suggestionComposer.suggestions(
                for: signals,
                selectedPreset: selectedPreset,
                languageMode: languageMode,
                toneMode: toneMode
            )
        }
    }
}
