import Foundation

nonisolated enum LiveGuidanceSignal: Hashable, Sendable {
    case localSignalUnavailable
    case lightingLooksBalanced
    case tooDark
    case tooBright
    case subjectOffCenter
    case lowHeadroom
    case faceTooClose
    case faceTooFar
    case portraitLikely
    case warmFilterHelpful

    var guidancePriority: Int {
        switch self {
        case .tooDark, .tooBright, .faceTooClose, .faceTooFar:
            return 0
        case .lowHeadroom, .subjectOffCenter:
            return 1
        case .warmFilterHelpful, .portraitLikely, .lightingLooksBalanced:
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
        case .lowHeadroom:
            return 4
        case .subjectOffCenter:
            return 5
        case .warmFilterHelpful:
            return 6
        case .portraitLikely:
            return 7
        case .lightingLooksBalanced:
            return 8
        case .localSignalUnavailable:
            return 9
        }
    }
}
