import CoreGraphics
import Foundation

struct CameraCaptureContext: Codable, Hashable {
    let source: CameraCaptureContextSource
    let orientation: CameraCaptureOrientation
    let level: CameraLevelContext
    let motion: CameraMotionContext
    let exposure: CameraExposureContext
    let focus: CameraFocusContext
    let lens: CameraLensContext
    let compositionHelpers: CameraCompositionHelperContext
    let selectedFilterAtCapture: String?
    let previewFilterAtCapture: String?
    let localImageSignals: LocalImageSignalContext
    let creativeIntent: CreativeIntentContext

    static let mock = CameraCaptureContext(
        source: .mock,
        orientation: .unknown,
        level: .unavailable,
        motion: .unavailable,
        exposure: .unavailable,
        focus: .unavailable,
        lens: .unknown,
        compositionHelpers: .unavailable,
        selectedFilterAtCapture: nil,
        previewFilterAtCapture: nil,
        localImageSignals: .unknown,
        creativeIntent: .neutral
    )

    static func imported(imageSize: CGSize? = nil) -> CameraCaptureContext {
        let context = CameraCaptureContext(
            source: .imported,
            orientation: CameraCaptureOrientation(size: imageSize),
            level: .unavailable,
            motion: .unavailable,
            exposure: .unavailable,
            focus: .unavailable,
            lens: .unknown,
            compositionHelpers: .unavailable,
            selectedFilterAtCapture: nil,
            previewFilterAtCapture: nil,
            localImageSignals: .unknown,
            creativeIntent: .neutral
        )
        return context
    }
}

enum CameraCaptureContextSource: String, Codable, Hashable {
    case captured
    case imported
    case mock
}

enum CameraCaptureOrientation: String, Codable, Hashable {
    case portrait
    case landscape
    case unknown

    init(size: CGSize?) {
        guard let size,
              size.width > 0,
              size.height > 0 else {
            self = .unknown
            return
        }

        self = size.height >= size.width ? .portrait : .landscape
    }
}

struct CameraLevelContext: Codable, Hashable {
    let available: Bool
    let rollDegrees: Double?
    let pitchDegrees: Double?
    let isNearLevel: Bool?

    static let unavailable = CameraLevelContext(
        available: false,
        rollDegrees: nil,
        pitchDegrees: nil,
        isNearLevel: nil
    )
}

struct CameraMotionContext: Codable, Hashable {
    let available: Bool
    let stability: CameraMotionStability
    let motionScore: Double?

    static let unavailable = CameraMotionContext(
        available: false,
        stability: .unknown,
        motionScore: nil
    )
}

enum CameraMotionStability: String, Codable, Hashable {
    case stable
    case slightMotion = "slight_motion"
    case shaky
    case unknown
}

struct CameraExposureContext: Codable, Hashable {
    let available: Bool
    let lowLightDetected: Bool
    let isoBucket: CameraISOBucket
    let exposureBias: CameraExposureBias

    static let unavailable = CameraExposureContext(
        available: false,
        lowLightDetected: false,
        isoBucket: .unknown,
        exposureBias: .unknown
    )
}

enum CameraISOBucket: String, Codable, Hashable {
    case low
    case medium
    case high
    case unknown
}

enum CameraExposureBias: String, Codable, Hashable {
    case under
    case neutral
    case over
    case unknown
}

struct CameraFocusContext: Codable, Hashable {
    let available: Bool
    let focusState: CameraFocusState
    let focusPointBucket: CameraFocusPointBucket

    static let unavailable = CameraFocusContext(
        available: false,
        focusState: .unknown,
        focusPointBucket: .unknown
    )
}

enum CameraFocusState: String, Codable, Hashable {
    case locked
    case adjusting
    case unknown
}

enum CameraFocusPointBucket: String, Codable, Hashable {
    case center
    case upper
    case lower
    case left
    case right
    case unknown
}

struct CameraLensContext: Codable, Hashable {
    let cameraPosition: CameraCapturePosition
    let lensType: CameraLensType
    let zoomBucket: CameraZoomBucket
    let digitalZoomLikely: Bool?

    static let unknown = CameraLensContext(
        cameraPosition: .unknown,
        lensType: .unknown,
        zoomBucket: .unknown,
        digitalZoomLikely: nil
    )
}

enum CameraCapturePosition: String, Codable, Hashable {
    case back
    case front
    case unknown
}

enum CameraLensType: String, Codable, Hashable {
    case wide
    case ultraWide
    case telephoto
    case unknown
}

enum CameraZoomBucket: String, Codable, Hashable {
    case normal
    case moderate
    case high
    case unknown
}

struct CameraCompositionHelperContext: Codable, Hashable {
    let gridEnabled: Bool
    let levelGuideEnabled: Bool
    let centerGuideEnabled: Bool

    static let unavailable = CameraCompositionHelperContext(
        gridEnabled: false,
        levelGuideEnabled: false,
        centerGuideEnabled: false
    )
}

struct LocalImageSignalContext: Codable, Hashable {
    let brightness: LocalImageSignalBucket
    let contrast: LocalImageSignalBucket
    let saturation: LocalImageSignalBucket
    let blurRisk: LocalImageSignalBucket
    let warmth: LocalImageWarmth
    let clutter: LocalImageSignalBucket

    static let unknown = LocalImageSignalContext(
        brightness: .unknown,
        contrast: .unknown,
        saturation: .unknown,
        blurRisk: .unknown,
        warmth: .unknown,
        clutter: .unknown
    )
}

enum LocalImageSignalBucket: String, Codable, Hashable {
    case low
    case medium
    case high
    case unknown
}

enum LocalImageWarmth: String, Codable, Hashable {
    case cool
    case neutral
    case warm
    case unknown
}

struct CreativeIntentContext: Codable, Hashable {
    let possibleIntentionalStyle: Bool
    let styleSignals: [CreativeIntentStyleSignal]
    let avoidOvercorrecting: Bool

    static let neutral = CreativeIntentContext(
        possibleIntentionalStyle: false,
        styleSignals: [],
        avoidOvercorrecting: false
    )
}

enum CreativeIntentStyleSignal: String, Codable, Hashable {
    case softFocus = "soft_focus"
    case motionBlur = "motion_blur"
    case lowLight = "low_light"
    case tilt
    case retroGrain = "retro_grain"
    case highContrast = "high_contrast"
    case unusualFraming = "unusual_framing"
}
