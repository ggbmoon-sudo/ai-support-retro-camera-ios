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
        var styleSignals: [CreativeIntentStyleSignal] = []
        var intentSignals: [CreativeIntentSignal] = []
        let selectedFilter = captureContext.selectedFilterAtCapture
        let previewFilter = captureContext.previewFilterAtCapture
        let hasSoftStyle = isSoftFilter(selectedFilter) || isSoftFilter(previewFilter)
        let hasGrainStyle = isRetroGrainFilter(selectedFilter) || isRetroGrainFilter(previewFilter)
        let hasLowLightStyle = isLowLightStyleFilter(selectedFilter) || isLowLightStyleFilter(previewFilter)
        let hasLightLeakStyle = isLightLeakStyleFilter(selectedFilter) || isLightLeakStyleFilter(previewFilter)

        if captureContext.exposure.lowLightDetected
            || captureContext.exposure.exposureBucket == .lowLight
            || captureContext.localImageSignals.brightness == .low {
            intentSignals.append(.lowLight)
            styleSignals.append(.lowLight)
        }

        if captureContext.exposure.exposureBiasBucket == .under {
            intentSignals.append(.underexposure)
        }

        if captureContext.exposure.exposureBiasBucket == .over
            || captureContext.exposure.exposureBucket == .bright
            || captureContext.localImageSignals.brightness == .high {
            intentSignals.append(.overexposure)
        }

        if captureContext.motion.motionBucket == .slightMotion
            || captureContext.motion.motionBucket == .shaky {
            intentSignals.append(.motion)
            styleSignals.append(.motionBlur)
        }

        if captureContext.localImageSignals.blurRisk == .medium
            || captureContext.localImageSignals.blurRisk == .high {
            intentSignals.append(.blur)
            if hasSoftStyle || hasGrainStyle || captureContext.localImageSignals.blurRisk == .medium {
                styleSignals.append(.motionBlur)
            }
        }

        if captureContext.level.available,
           captureContext.level.isNearLevel == false {
            intentSignals.append(.tilt)
            styleSignals.append(.tilt)
        }

        if hasGrainStyle {
            intentSignals.append(.grain)
            styleSignals.append(.retroGrain)
        }

        if hasSoftStyle {
            intentSignals.append(.softFocus)
            styleSignals.append(.softFocus)
        }

        if isHighContrastFilter(selectedFilter)
            || isHighContrastFilter(previewFilter)
            || captureContext.localImageSignals.contrast == .high {
            intentSignals.append(.highContrast)
            styleSignals.append(.highContrast)
        }

        if isFadedColorFilter(selectedFilter)
            || isFadedColorFilter(previewFilter)
            || captureContext.localImageSignals.saturation == .low {
            intentSignals.append(.fadedColor)
            styleSignals.append(.fadedColor)
        }

        if captureContext.localImageSignals.clutter == .medium
            || captureContext.localImageSignals.clutter == .high {
            intentSignals.append(.unusualFraming)
            styleSignals.append(.unusualFraming)
        }

        if captureContext.localImageSignals.clutter == .high {
            intentSignals.append(.clutter)
            intentSignals.append(.cropRisk)
        }

        let uniqueIntentSignals = CreativeIntentLanguageRules.uniqueSignals(intentSignals)
        let uniqueStyleSignals = CreativeIntentLanguageRules.uniqueStyleSignals(styleSignals)
        let severeTechnicalRiskLikely = severeTechnicalRiskLikely(
            captureContext: captureContext,
            hasSoftStyle: hasSoftStyle,
            hasGrainStyle: hasGrainStyle,
            hasLowLightStyle: hasLowLightStyle,
            hasLightLeakStyle: hasLightLeakStyle
        )
        let classification = CreativeIntentLanguageRules.classification(
            for: uniqueIntentSignals,
            styleSignals: uniqueStyleSignals,
            severeTechnicalRiskLikely: severeTechnicalRiskLikely
        )
        let adviceMode = CreativeIntentLanguageRules.adviceMode(for: classification)

        return CreativeIntentContext(
            possibleIntentionalStyle: classification == .stylePositive || classification == .acceptableImperfection,
            classification: classification,
            intentSignals: uniqueIntentSignals,
            styleSignals: uniqueStyleSignals,
            avoidOvercorrecting: classification != .unknown,
            adviceMode: adviceMode
        )
    }

    private static func severeTechnicalRiskLikely(
        captureContext: CameraCaptureContext,
        hasSoftStyle: Bool,
        hasGrainStyle: Bool,
        hasLowLightStyle: Bool,
        hasLightLeakStyle: Bool
    ) -> Bool {
        let severeBlurWithoutStyle = captureContext.localImageSignals.blurRisk == .high
            && captureContext.motion.motionBucket == .shaky
            && !hasSoftStyle
            && !hasGrainStyle

        let severeUnderexposureWithoutStyle = captureContext.localImageSignals.brightness == .low
            && captureContext.exposure.exposureBiasBucket == .under
            && !hasLowLightStyle

        let severeOverexposureWithoutStyle = captureContext.localImageSignals.brightness == .high
            && captureContext.exposure.exposureBiasBucket == .over
            && !hasLightLeakStyle

        return severeBlurWithoutStyle || severeUnderexposureWithoutStyle || severeOverexposureWithoutStyle
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

    private static func isLowLightStyleFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("amber")
            || filterId.contains("night")
            || filterId.contains("neon")
            || filterId.contains("ccd")
            || filterId.contains("flash")
            || filterId.contains("grain")
    }

    private static func isLightLeakStyleFilter(_ filterId: String?) -> Bool {
        guard let filterId else { return false }
        return filterId.contains("instant")
            || filterId.contains("dream")
            || filterId.contains("diana")
            || filterId.contains("faded")
            || filterId.contains("flat")
            || filterId.contains("warm")
    }
}
