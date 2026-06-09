import Foundation

nonisolated struct LiveGuidanceFrameAnalyzer: Sendable {
    func fallbackSignals(selectedPreset: FilterPreset) -> [LiveGuidanceSignal] {
        // Phase 15 avoids live frame sampling for the first prototype. These local
        // sample signals exercise the rule engine and keep Simulator behavior safe.
        switch scenarioIndex(for: selectedPreset) {
        case 0:
            return [.localSignalUnavailable, .tooDark, .subjectOffCenter, .lowHeadroom, .warmFilterHelpful]
        case 1:
            return [.localSignalUnavailable, .tooBright, .faceTooClose, .subjectOffCenter]
        default:
            return [.localSignalUnavailable, .faceTooFar, .lowHeadroom, .portraitLikely, .warmFilterHelpful]
        }
    }

    private func scenarioIndex(for preset: FilterPreset) -> Int {
        preset.id.unicodeScalars.reduce(0) { partialResult, scalar in
            partialResult + Int(scalar.value)
        } % 3
    }
}

