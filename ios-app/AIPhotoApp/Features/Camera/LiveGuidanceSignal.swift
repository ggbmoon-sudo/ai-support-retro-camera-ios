import Foundation

nonisolated enum LiveGuidanceSignal: Hashable, Sendable {
    case localSignalUnavailable
    case tooDark
    case tooBright
    case subjectOffCenter
    case lowHeadroom
    case faceTooClose
    case faceTooFar
    case portraitLikely
    case warmFilterHelpful
}

