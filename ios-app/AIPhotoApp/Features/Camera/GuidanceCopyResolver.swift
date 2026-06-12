import Foundation

nonisolated enum ToneMode: String, CaseIterable, Sendable {
    case neutral
    case hongKongConversational
    case troublemaker
    case troublemakerExplicit
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
        requestedTone: ToneMode = .neutral,
        featureContext: FeatureContext = .liveCameraCoach,
        isPublicContext: Bool = false
    ) -> String {
        let tone = safetyPolicy.resolvedTone(
            requestedTone: requestedTone,
            featureContext: featureContext,
            isPublicContext: isPublicContext
        )

        switch category {
        case .lighting,
             .headroom,
             .stability,
             .framing,
             .backgroundClutter,
             .successPraise:
            return "camera.guidance.copy.\(tone.keyComponent).\(category.rawValue)"
        case .directLight:
            return "camera.guidance.suggestion.avoid_direct_light"
        case .portraitDistance:
            return "camera.guidance.suggestion.step_back_portrait"
        case .filter:
            return "camera.guidance.suggestion.try_warm_filter"
        case .unavailable:
            return "camera.guidance.suggestion.local_signal_unavailable"
        }
    }
}

nonisolated struct GuidancePraiseResolver: Sendable {
    private let copyResolver: GuidanceCopyResolver

    init(copyResolver: GuidanceCopyResolver = GuidanceCopyResolver()) {
        self.copyResolver = copyResolver
    }

    func praiseKey(
        requestedTone: ToneMode = .neutral,
        featureContext: FeatureContext = .liveCameraCoach
    ) -> String {
        copyResolver.messageKey(
            for: .successPraise,
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
