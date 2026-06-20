import Foundation

nonisolated enum LiveGuidanceSignal: Hashable, Sendable {
    case localSignalUnavailable
    case lightingLooksBalanced
    case tooDark
    case tooBright
    case subjectOffCenter
    case subjectNearEdge
    case lowHeadroom
    case faceTooClose
    case faceTooFar
    case subjectTooLarge
    case subjectTooSmall
    case portraitLikely
    case ruleOfThirdsAligned
    case verticalBalanceReady
    case warmFilterHelpful

    var guidancePriority: Int {
        switch self {
        case .tooDark, .tooBright, .faceTooClose, .faceTooFar, .subjectTooLarge, .subjectTooSmall:
            return 0
        case .lowHeadroom, .subjectOffCenter, .subjectNearEdge:
            return 1
        case .warmFilterHelpful, .portraitLikely, .lightingLooksBalanced, .ruleOfThirdsAligned, .verticalBalanceReady:
            return 2
        case .localSignalUnavailable:
            return 3
        }
    }

    var stableSortKey: Int {
        switch self {
        case .tooDark:
            return 0
        case .tooBright:
            return 1
        case .faceTooClose:
            return 2
        case .faceTooFar:
            return 3
        case .subjectTooLarge:
            return 4
        case .subjectTooSmall:
            return 5
        case .lowHeadroom:
            return 6
        case .subjectNearEdge:
            return 7
        case .subjectOffCenter:
            return 8
        case .ruleOfThirdsAligned:
            return 9
        case .verticalBalanceReady:
            return 10
        case .warmFilterHelpful:
            return 11
        case .portraitLikely:
            return 12
        case .lightingLooksBalanced:
            return 13
        case .localSignalUnavailable:
            return 14
        }
    }
}
