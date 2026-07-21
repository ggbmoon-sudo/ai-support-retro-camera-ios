import Foundation

/// A one-way, session-scoped presentation state for the internal Live AI guide.
/// One cloud keyframe is confined to `analyzing`; every later stage uses the
/// frozen plan plus local tracking and never accepts a replacement target.
nonisolated enum HybridCompositionLiveGuideStage: String, Equatable, Sendable {
    case idle
    case analyzing
    case aiming
    case framing
    case ready
    case failed
}
