import Foundation

enum CreativeIntentLanguageRules {
    static func classification(
        for intentSignals: [CreativeIntentSignal],
        styleSignals: [CreativeIntentStyleSignal],
        severeTechnicalRiskLikely: Bool
    ) -> CreativeIntentClassification {
        if severeTechnicalRiskLikely {
            return .technicalRisk
        }

        if !styleSignals.isEmpty {
            return .stylePositive
        }

        if intentSignals.contains(where: acceptableImperfectionSignals.contains) {
            return .acceptableImperfection
        }

        return intentSignals.isEmpty ? .unknown : .acceptableImperfection
    }

    static func adviceMode(for classification: CreativeIntentClassification) -> CreativeIntentAdviceMode {
        switch classification {
        case .stylePositive:
            return .preserveStyle
        case .acceptableImperfection:
            return .optionalRefinement
        case .technicalRisk, .unknown:
            return .technicalHint
        }
    }

    static func primarySignal(in context: CreativeIntentContext) -> CreativeIntentSignal? {
        let orderedSignals: [CreativeIntentSignal] = [
            .softFocus,
            .grain,
            .lowLight,
            .motion,
            .blur,
            .tilt,
            .overexposure,
            .underexposure,
            .highContrast,
            .fadedColor,
            .unusualFraming,
            .clutter,
            .cropRisk
        ]

        return orderedSignals.first { context.intentSignals.contains($0) }
    }

    static func shouldOfferOptionalRetake(for context: CreativeIntentContext) -> Bool {
        context.classification == .technicalRisk
    }

    static func uniqueSignals(_ signals: [CreativeIntentSignal]) -> [CreativeIntentSignal] {
        unique(signals)
    }

    static func uniqueStyleSignals(_ signals: [CreativeIntentStyleSignal]) -> [CreativeIntentStyleSignal] {
        unique(signals)
    }

    private static let acceptableImperfectionSignals: Set<CreativeIntentSignal> = [
        .blur,
        .motion,
        .lowLight,
        .tilt,
        .grain,
        .softFocus,
        .overexposure,
        .underexposure,
        .highContrast,
        .fadedColor,
        .unusualFraming,
        .clutter,
        .cropRisk
    ]

    private static func unique<T: Hashable>(_ values: [T]) -> [T] {
        var seen = Set<T>()
        return values.filter { seen.insert($0).inserted }
    }
}
