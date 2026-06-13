import CoreGraphics
import Foundation

enum CameraCaptureContextSnapshotter {
    static func snapshot(
        source: CameraCaptureContextSource,
        imageSize: CGSize?,
        selectedFilterId: String?,
        previewFilterId: String?,
        lensOption: LensOption?,
        liveGuidanceSignals: [LiveGuidanceSignal]?,
        deviceSignalSnapshot: CameraCaptureDeviceSignalSnapshot = .unavailable,
        analyzedImageSignals: LocalImageSignalContext = .unknown,
        compositionHelpers: CameraCompositionHelperContext = .unavailable
    ) -> CameraCaptureContext {
        guard source == .captured else {
            return CameraCaptureContext.imported(
                imageSize: imageSize,
                localImageSignals: analyzedImageSignals
            )
        }

        let localSignals = analyzedImageSignals.merged(
            preferring: localImageSignals(from: liveGuidanceSignals)
        )
        let exposure = exposureContext(from: liveGuidanceSignals, localImageSignals: localSignals)
        let context = CameraCaptureContext(
            source: source,
            orientation: CameraCaptureOrientation(size: imageSize),
            level: deviceSignalSnapshot.level,
            motion: deviceSignalSnapshot.motion,
            exposure: exposure,
            focus: .unavailable,
            lens: lensContext(from: lensOption),
            compositionHelpers: compositionHelpers,
            selectedFilterAtCapture: selectedFilterId,
            previewFilterAtCapture: previewFilterId,
            localImageSignals: localSignals,
            creativeIntent: .neutral
        )

        return context.withCreativeIntent(CreativeIntentGuard.context(for: context))
    }

    private static func exposureContext(
        from signals: [LiveGuidanceSignal]?,
        localImageSignals: LocalImageSignalContext
    ) -> CameraExposureContext {
        if signals?.contains(.tooDark) == true {
            return CameraExposureContext(
                available: true,
                exposureBucket: .lowLight,
                lowLightDetected: true,
                isoBucket: .unknown,
                exposureBiasBucket: .under
            )
        }

        if signals?.contains(.tooBright) == true {
            return CameraExposureContext(
                available: true,
                exposureBucket: .bright,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBiasBucket: .over
            )
        }

        if signals?.contains(.lightingLooksBalanced) == true {
            return CameraExposureContext(
                available: true,
                exposureBucket: .balanced,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBiasBucket: .neutral
            )
        }

        switch localImageSignals.brightness {
        case .low:
            return CameraExposureContext(
                available: true,
                exposureBucket: .lowLight,
                lowLightDetected: true,
                isoBucket: .unknown,
                exposureBiasBucket: .under
            )
        case .medium:
            return CameraExposureContext(
                available: true,
                exposureBucket: .balanced,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBiasBucket: .neutral
            )
        case .high:
            return CameraExposureContext(
                available: true,
                exposureBucket: .bright,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBiasBucket: .over
            )
        case .unknown:
            return .unavailable
        }
    }

    private static func localImageSignals(from signals: [LiveGuidanceSignal]?) -> LocalImageSignalContext {
        guard let signals, !signals.isEmpty else {
            return .unknown
        }

        let brightness: LocalImageSignalBucket
        if signals.contains(.tooDark) {
            brightness = .low
        } else if signals.contains(.tooBright) {
            brightness = .high
        } else if signals.contains(.lightingLooksBalanced) {
            brightness = .medium
        } else {
            brightness = .unknown
        }

        let warmth: LocalImageWarmth = signals.contains(.warmFilterHelpful) ? .warm : .unknown

        return LocalImageSignalContext(
            brightness: brightness,
            contrast: .unknown,
            saturation: .unknown,
            blurRisk: .unknown,
            warmth: warmth,
            clutter: signals.contains(.subjectOffCenter) ? .medium : .unknown
        )
    }

    private static func lensContext(from option: LensOption?) -> CameraLensContext {
        guard let option else {
            return .unknown
        }

        switch option.id {
        case LensOption.wide24.id:
            return CameraLensContext(
                cameraPosition: .back,
                lensType: .ultraWide,
                zoomBucket: .normal,
                digitalZoomLikely: false
            )
        case LensOption.portrait77.id:
            return CameraLensContext(
                cameraPosition: .back,
                lensType: .telephoto,
                zoomBucket: .moderate,
                digitalZoomLikely: false
            )
        default:
            return CameraLensContext(
                cameraPosition: .back,
                lensType: .wide,
                zoomBucket: .normal,
                digitalZoomLikely: false
            )
        }
    }
}

enum CreativeIntentGuard {
    static func context(for captureContext: CameraCaptureContext) -> CreativeIntentContext {
        var signals: [CreativeIntentStyleSignal] = []

        if captureContext.exposure.lowLightDetected
            || captureContext.exposure.exposureBucket == .lowLight
            || captureContext.localImageSignals.brightness == .low {
            signals.append(.lowLight)
        }

        if captureContext.motion.motionBucket == .slightMotion
            || captureContext.motion.motionBucket == .shaky
            || captureContext.localImageSignals.blurRisk == .medium
            || captureContext.localImageSignals.blurRisk == .high {
            signals.append(.motionBlur)
        }

        if captureContext.level.available,
           captureContext.level.isNearLevel == false {
            signals.append(.tilt)
        }

        if isRetroGrainFilter(captureContext.selectedFilterAtCapture)
            || isRetroGrainFilter(captureContext.previewFilterAtCapture) {
            signals.append(.retroGrain)
        }

        if isSoftFilter(captureContext.selectedFilterAtCapture)
            || isSoftFilter(captureContext.previewFilterAtCapture) {
            signals.append(.softFocus)
        }

        if isHighContrastFilter(captureContext.selectedFilterAtCapture)
            || isHighContrastFilter(captureContext.previewFilterAtCapture)
            || captureContext.localImageSignals.contrast == .high {
            signals.append(.highContrast)
        }

        if isFadedColorFilter(captureContext.selectedFilterAtCapture)
            || isFadedColorFilter(captureContext.previewFilterAtCapture)
            || captureContext.localImageSignals.saturation == .low {
            signals.append(.fadedColor)
        }

        if captureContext.localImageSignals.clutter == .medium
            || captureContext.localImageSignals.clutter == .high {
            signals.append(.unusualFraming)
        }

        let uniqueSignals = signals.reduce(into: [CreativeIntentStyleSignal]()) { result, signal in
            guard !result.contains(signal) else { return }
            result.append(signal)
        }

        let adviceMode: CreativeIntentAdviceMode
        if uniqueSignals.contains(.lowLight)
            || uniqueSignals.contains(.motionBlur)
            || uniqueSignals.contains(.tilt)
            || uniqueSignals.contains(.retroGrain)
            || uniqueSignals.contains(.softFocus)
            || uniqueSignals.contains(.highContrast)
            || uniqueSignals.contains(.fadedColor) {
            adviceMode = .preserveStyle
        } else if !uniqueSignals.isEmpty {
            adviceMode = .optionalRefinement
        } else {
            adviceMode = .technicalHint
        }

        return CreativeIntentContext(
            possibleIntentionalStyle: !uniqueSignals.isEmpty,
            styleSignals: uniqueSignals,
            avoidOvercorrecting: !uniqueSignals.isEmpty,
            adviceMode: adviceMode
        )
    }

    private static func isRetroGrainFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("ccd")
            || filterId.contains("tri_grit")
            || filterId.contains("film")
            || filterId.contains("grain")
    }

    private static func isSoftFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("soft")
            || filterId.contains("dream")
            || filterId.contains("diana")
    }

    private static func isHighContrastFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("street_chrome")
            || filterId.contains("chrome")
            || filterId.contains("flash")
    }

    private static func isFadedColorFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("faded")
            || filterId.contains("flat")
            || filterId.contains("pastel")
            || filterId.contains("vintage")
            || filterId.contains("film")
    }
}
