import CoreGraphics

enum AppTabBarMetrics {
    static let minimumHomeIndicatorClearance: CGFloat = 12
    static let ordinaryTabBarEstimatedHeight: CGFloat = 68
    static let ordinaryTabBarBottomFallback: CGFloat = 52
    static let ordinaryTabBarBottomClearance: CGFloat = 28
    static let ordinaryContentBottomInset: CGFl 土oat = 124
    static let contentPageFooterSpacer: CGFloat = ordinaryContentBottomInset

    static let cameraTopControlMinimumInset: CGFloat = 30
    static let cameraTopControlSafeAreaGap: CGFloat = 8

    static let cameraRailEstimatedHeight: CGFloat = 42
    static let cameraRailBottomCompression: CGFloat = 24
    static let cameraControlGap: CGFloat = 6

    static func floatingTabBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        ordinaryTabBarBottomOffset(for: safeBottom)
    }

    static func ordinaryTabBarBottomOffset(for safeBottom: CGFloat) -> CGFloat {
        max(safeBottom + ordinaryTabBarBottomClearance, ordinaryTabBarBottomFallback)
    }

    static func ordinaryContentBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        ordinaryTabBarEstimatedHeight + ordinaryTabBarBottomOffset(for: safeBottom) + ordinaryTabBarBottomClearance
    }

    static func cameraTopControlPadding(for safeTop: CGFloat) -> CGFloat {
        max(safeTop + cameraTopControlSafeAreaGap, cameraTopControlMinimumInset)
    }

    static func cameraRailBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        max(safeBottom - cameraRailBottomCompression, minimumHomeIndicatorClearance)
    }

    static func cameraControlBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        cameraRailBottomPadding(for: safeBottom) + cameraRailEstimatedHeight + cameraControlGap
    }

    static func cameraOverlayBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        cameraControlBottomPadding(for: safeBottom) + 74
    }

    static func cameraFilterBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        cameraOverlayBottomPadding(for: safeBottom) + 18
    }

    static func cameraGuidanceBottomPadding(for safeBottom: CGFloat) -> CGFloat {
        cameraOverlayBottomPadding(for: safeBottom) + 64
    }
}
