import Foundation

enum PoseGuideCategory: String, Codable, CaseIterable, Identifiable {
    case neutral
    case solo
    case couple
    case menswear
    case womenswear
    case street
    case travel
    case seated
    case halfBody
    case fullBody

    var id: String { rawValue }

    var titleKey: String {
        switch self {
        case .neutral:
            return "camera.pose.category.neutral"
        case .solo:
            return "camera.pose.category.solo"
        case .couple:
            return "camera.pose.category.couple"
        case .menswear:
            return "camera.pose.category.menswear"
        case .womenswear:
            return "camera.pose.category.womenswear"
        case .street:
            return "camera.pose.category.street"
        case .travel:
            return "camera.pose.category.travel"
        case .seated:
            return "camera.pose.category.seated"
        case .halfBody:
            return "camera.pose.category.half_body"
        case .fullBody:
            return "camera.pose.category.full_body"
        }
    }
}

enum PoseFramingHint: String, Codable {
    case halfBody
    case threeQuarter
    case fullBody
    case seated
}

enum PoseOverlayAnchor: String, Codable {
    case center
    case bottomCenter
}

struct PoseGuide: Identifiable, Codable, Hashable {
    let id: String
    let titleKey: String
    let shortHintKey: String
    let category: PoseGuideCategory
    let assetName: String
    let framingHint: PoseFramingHint
    let defaultScale: Double
    let defaultOffsetNormX: Double
    let defaultOffsetNormY: Double
    let defaultOpacity: Double
    let anchor: PoseOverlayAnchor
    let supportsMirroring: Bool
    let isPremium: Bool
}
