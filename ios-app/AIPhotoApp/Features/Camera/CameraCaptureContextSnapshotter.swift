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
        compositionHelpers: CameraCompositionHelperContext = .unavailable
    ) -> CameraCaptureContext {
        guard source == .captured else {
            return CameraCaptureContext.imported(imageSize: imageSize)
        }

        let exposure = exposureContext(from: liveGuidanceSignals)
        let localSignals = localImageSignals(from: liveGuidanceSignals)
        let context = CameraCaptureContext(
            source: source,
            orientation: CameraCaptureOrientation(size: imageSize),
            level: .unavailable,
            motion: .unavailable,
            exposure: exposure,
            focus: .unavailable,
            lens: lensContext(from: lensOption),
            compositionHelpers: compositionHelpers,
            selectedFilterAtCapture: selectedFilterId,
            previewFilterAtCapture: previewFilterId,
            localImageSignals: localSignals,
            creativeIntent: .neutral
        )

        return CameraCaptureContext(
            source: context.source,
            orientation: context.orientation,
            level: context.level,
            motion: context.motion,
            exposure: context.exposure,
            focus: context.focus,
            lens: context.lens,
            compositionHelpers: context.compositionHelpers,
            selectedFilterAtCapture: context.selectedFilterAtCapture,
            previewFilterAtCapture: context.previewFilterAtCapture,
            localImageSignals: context.localImageSignals,
            creativeIntent: CreativeIntentGuard.context(for: context)
        )
    }

    private static func exposureContext(from signals: [LiveGuidanceSignal]?) -> CameraExposureContext {
        guard let signals, !signals.isEmpty else {
            return .unavailable
        }

        if signals.contains(.tooDark) {
            return CameraExposureContext(
                available: true,
                lowLightDetected: true,
                isoBucket: .unknown,
                exposureBias: .under
            )
        }

        if signals.contains(.tooBright) {
            return CameraExposureContext(
                available: true,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBias: .over
            )
        }

        if signals.contains(.lightingLooksBalanced) {
            return CameraExposureContext(
                available: true,
                lowLightDetected: false,
                isoBucket: .unknown,
                exposureBias: .neutral
            )
        }

        return .unavailable
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
            || captureContext.localImageSignals.brightness == .low {
            signals.append(.lowLight)
        }

        if captureContext.motion.stability == .slightMotion
            || captureContext.motion.stability == .shaky
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
            || isHighContrastFilter(captureContext.previewFilterAtCapture) {
            signals.append(.highContrast)
        }

        if captureContext.localImageSignals.clutter == .medium
            || captureContext.localImageSignals.clutter == .high {
            signals.append(.unusualFraming)
        }

        let uniqueSignals = signals.reduce(into: [CreativeIntentStyleSignal]()) { result, signal in
            guard !result.contains(signal) else { return }
            result.append(signal)
        }

        return CreativeIntentContext(
            possibleIntentionalStyle: !uniqueSignals.isEmpty,
            styleSignals: uniqueSignals,
            avoidOvercorrecting: !uniqueSignals.isEmpty
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
}
