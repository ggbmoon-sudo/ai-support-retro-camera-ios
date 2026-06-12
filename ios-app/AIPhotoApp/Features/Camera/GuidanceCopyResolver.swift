import Foundation

nonisolated enum AppLanguageMode: String, CaseIterable, Identifiable, Sendable {
    case english
    case traditionalChinese
    case simplifiedChinese
    case cantonese

    var id: String { rawValue }
}

nonisolated enum ToneMode: String, CaseIterable, Identifiable, Sendable {
    case neutral
    case hongKongConversational
    case troublemaker
    case troublemakerExplicit

    var id: String { rawValue }
}

nonisolated enum FeatureContext: String, CaseIterable, Sendable {
    case liveCameraCoach
    case photoAdvisor
    case filterLab
    case imageEditing
    case consent
    case privacy
    case legal
    case notification
    case widget
}

nonisolated enum GuidanceCopyCategory: String, CaseIterable, Sendable {
    case lighting
    case headroom
    case stability
    case framing
    case backgroundClutter = "background_clutter"
    case successPraise = "success_praise"
    case directLight = "direct_light"
    case portraitDistance = "portrait_distance"
    case filter
    case unavailable
}

nonisolated struct SafetyCopyPolicy: Sendable {
    func resolvedTone(
        requestedTone: ToneMode,
        featureContext: FeatureContext,
        isPublicContext: Bool
    ) -> ToneMode {
        if isPublicContext {
            return .neutral
        }

        if featureContext != .liveCameraCoach {
            return .neutral
        }

        if requestedTone == .troublemakerExplicit {
            return .troublemaker
        }

        return requestedTone
    }
}

nonisolated struct GuidanceCopyResolver: Sendable {
    private let safetyPolicy: SafetyCopyPolicy

    init(safetyPolicy: SafetyCopyPolicy = SafetyCopyPolicy()) {
        self.safetyPolicy = safetyPolicy
    }

    func messageKey(
        for category: GuidanceCopyCategory,
        language: AppLanguageMode = .traditionalChinese,
        requestedTone: ToneMode = .neutral,
        featureContext: FeatureContext = .liveCameraCoach,
        isPublicContext: Bool = false
    ) -> String {
        let resolvedTone = safetyPolicy.resolvedTone(
            requestedTone: requestedTone,
            featureContext: featureContext,
            isPublicContext: isPublicContext
        )
        let tone = language.resolvedTone(for: resolvedTone)

        switch category {
        case .lighting,
             .headroom,
             .stability,
             .framing,
             .backgroundClutter,
             .successPraise:
            return "camera.guidance.copy.\(language.keyComponent).\(tone.keyComponent).\(category.rawValue)"
        case .directLight:
            return "camera.guidance.copy.\(language.keyComponent).\(tone.keyComponent).direct_light"
        case .portraitDistance:
            return "camera.guidance.copy.\(language.keyComponent).\(tone.keyComponent).portrait_distance"
        case .filter:
            return "camera.guidance.copy.\(language.keyComponent).\(tone.keyComponent).filter"
        case .unavailable:
            return "camera.guidance.copy.\(language.keyComponent).\(tone.keyComponent).unavailable"
        }
    }

    func chipTitleKey(
        language: AppLanguageMode = .traditionalChinese,
        requestedTone: ToneMode = .neutral,
        featureContext: FeatureContext = .liveCameraCoach,
        isPublicContext: Bool = false
    ) -> String {
        let resolvedTone = safetyPolicy.resolvedTone(
            requestedTone: requestedTone,
            featureContext: featureContext,
            isPublicContext: isPublicContext
        )
        let tone = language.resolvedTone(for: resolvedTone)

        return "camera.guidance.chip.\(language.keyComponent).\(tone.keyComponent)"
    }
}

nonisolated struct GuidancePraiseResolver: Sendable {
    private let copyResolver: GuidanceCopyResolver

    init(copyResolver: GuidanceCopyResolver = GuidanceCopyResolver()) {
        self.copyResolver = copyResolver
    }

    func praiseKey(
        language: AppLanguageMode = .traditionalChinese,
        requestedTone: ToneMode = .neutral,
        featureContext: FeatureContext = .liveCameraCoach
    ) -> String {
        copyResolver.messageKey(
            for: .successPraise,
            language: language,
            requestedTone: requestedTone,
            featureContext: featureContext,
            isPublicContext: false
        )
    }
}

nonisolated struct GuidanceIssueMemory: Sendable {
    private(set) var lastIssueID: String?

    mutating func record(issueID: String?) {
        lastIssueID = issueID
    }

    func shouldPraiseResolvedIssue(currentIssueID: String?) -> Bool {
        guard lastIssueID != nil else { return false }
        return currentIssueID == nil
    }
}

private extension AppLanguageMode {
    var keyComponent: String {
        switch self {
        case .english:
            return "en"
        case .traditionalChinese:
            return "zh_hant"
        case .simplifiedChinese:
            return "zh_hans"
        case .cantonese:
            return "yue"
        }
    }

    func resolvedTone(for tone: ToneMode) -> ToneMode {
        switch self {
        case .english, .traditionalChinese, .simplifiedChinese:
            return .neutral
        case .cantonese:
            switch tone {
            case .neutral:
                return .hongKongConversational
            case .troublemakerExplicit:
                return .troublemaker
            case .hongKongConversational, .troublemaker:
                return tone
            }
        }
    }
}

private extension ToneMode {
    var keyComponent: String {
        switch self {
        case .neutral:
            return "neutral"
        case .hongKongConversational:
            return "hk"
        case .troublemaker, .troublemakerExplicit:
            return "troublemaker"
        }
    }
}
