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

    static func imported(
        imageSize: CGSize? = nil,
        localImageSignals: LocalImageSignalContext = .unknown
    ) -> CameraCaptureContext {
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
            localImageSignals: localImageSignals,
            creativeIntent: .neutral
        )
        return context.withCreativeIntent(CreativeIntentGuard.context(for: context))
    }

    func withCreativeIntent(_ creativeIntent: CreativeIntentContext) -> CameraCaptureContext {
        CameraCaptureContext(
            source: source,
            orientation: orientation,
            level: level,
            motion: motion,
            exposure: exposure,
            focus: focus,
            lens: lens,
            compositionHelpers: compositionHelpers,
            selectedFilterAtCapture: selectedFilterAtCapture,
            previewFilterAtCapture: previewFilterAtCapture,
            localImageSignals: localImageSignals,
            creativeIntent: creativeIntent
        )
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
    let rollDegreesRounded: Double?
    let pitchDegreesRounded: Double?
    let levelBucket: CameraLevelBucket
    let isNearLevel: Bool?

    static let unavailable = CameraLevelContext(
        available: false,
        rollDegreesRounded: nil,
        pitchDegreesRounded: nil,
        levelBucket: .unknown,
        isNearLevel: nil
    )

    static func rounded(rollDegrees: Double?, pitchDegrees: Double?) -> CameraLevelContext {
        let roundedRoll = rollDegrees.map { ($0 * 10).rounded() / 10 }
        let roundedPitch = pitchDegrees.map { ($0 * 10).rounded() / 10 }
        let absoluteRoll = abs(roundedRoll ?? 0)
        let bucket: CameraLevelBucket

        if roundedRoll == nil {
            bucket = .unknown
        } else if absoluteRoll <= 2.5 {
            bucket = .level
        } else if absoluteRoll <= 8 {
            bucket = .slightTilt
        } else {
            bucket = .strongTilt
        }

        return CameraLevelContext(
            available: roundedRoll != nil,
            rollDegreesRounded: roundedRoll,
            pitchDegreesRounded: roundedPitch,
            levelBucket: bucket,
            isNearLevel: bucket == .level
        )
    }
}

enum CameraLevelBucket: String, Codable, Hashable {
    case level
    case slightTilt = "slight_tilt"
    case strongTilt = "strong_tilt"
    case unknown
}

struct CameraMotionContext: Codable, Hashable {
    let available: Bool
    let motionBucket: CameraMotionStability
    let captureStabilityScore: Double?
    let captureWindowMs: Int?

    static let unavailable = CameraMotionContext(
        available: false,
        motionBucket: .unknown,
        captureStabilityScore: nil,
        captureWindowMs: nil
    )

    static func summary(
        score: Double?,
        captureWindowMs: Int?
    ) -> CameraMotionContext {
        guard let score else {
            return .unavailable
        }

        let normalized = min(max((score * 100).rounded() / 100, 0), 1)
        let bucket: CameraMotionStability

        if normalized < 0.24 {
            bucket = .stable
        } else if normalized < 0.58 {
            bucket = .slightMotion
        } else {
            bucket = .shaky
        }

        return CameraMotionContext(
            available: true,
            motionBucket: bucket,
            captureStabilityScore: normalized,
            captureWindowMs: captureWindowMs
        )
    }

    var stability: CameraMotionStability {
        motionBucket
    }

    var motionScore: Double? {
        captureStabilityScore
    }
}

enum CameraMotionStability: String, Codable, Hashable {
    case stable
    case slightMotion = "slight_motion"
    case shaky
    case unknown
}

struct CameraExposureContext: Codable, Hashable {
    let available: Bool
    let exposureBucket: CameraExposureBucket
    let lowLightDetected: Bool
    let isoBucket: CameraISOBucket
    let exposureBiasBucket: CameraExposureBias

    static let unavailable = CameraExposureContext(
        available: false,
        exposureBucket: .unknown,
        lowLightDetected: false,
        isoBucket: .unknown,
        exposureBiasBucket: .unknown
    )

    var exposureBias: CameraExposureBias {
        exposureBiasBucket
    }
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

enum CameraExposureBucket: String, Codable, Hashable {
    case lowLight = "low_light"
    case balanced
    case bright
    case unknown
}

struct CameraFocusContext: Codable, Hashable {
    let available: Bool
    let focusBucket: CameraFocusState
    let focusPointBucket: CameraFocusPointBucket

    static let unavailable = CameraFocusContext(
        available: false,
        focusBucket: .unknown,
        focusPointBucket: .unknown
    )

    var focusState: CameraFocusState {
        focusBucket
    }
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

    func merged(preferring preferred: LocalImageSignalContext) -> LocalImageSignalContext {
        LocalImageSignalContext(
            brightness: preferred.brightness == .unknown ? brightness : preferred.brightness,
            contrast: preferred.contrast == .unknown ? contrast : preferred.contrast,
            saturation: preferred.saturation == .unknown ? saturation : preferred.saturation,
            blurRisk: preferred.blurRisk == .unknown ? blurRisk : preferred.blurRisk,
            warmth: preferred.warmth == .unknown ? warmth : preferred.warmth,
            clutter: preferred.clutter == .unknown ? clutter : preferred.clutter
        )
    }
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
    let adviceMode: CreativeIntentAdviceMode

    static let neutral = CreativeIntentContext(
        possibleIntentionalStyle: false,
        styleSignals: [],
        avoidOvercorrecting: false,
        adviceMode: .technicalHint
    )
}

enum CreativeIntentStyleSignal: String, Codable, Hashable {
    case softFocus = "soft_focus"
    case motionBlur = "motion_blur"
    case lowLight = "low_light_mood"
    case tilt
    case retroGrain = "retro_grain"
    case highContrast = "high_contrast"
    case fadedColor = "faded_color"
    case unusualFraming = "unusual_framing"
}

enum CreativeIntentAdviceMode: String, Codable, Hashable {
    case preserveStyle = "preserve_style"
    case optionalRefinement = "optional_refinement"
    case technicalHint = "technical_hint"
}
