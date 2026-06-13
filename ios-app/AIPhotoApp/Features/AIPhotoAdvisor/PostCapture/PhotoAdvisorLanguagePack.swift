import Foundation

enum PhotoAdvisorLanguagePack {
    static func moodSummaryKey(for scene: PhotoAdvisorMockScene, input: PhotoAdvisorInput) -> String {
        switch scene {
        case .warmPortrait:
            return localizedKey("advisor.mood.warm_light", input: input)
        case .nightStreet:
            return localizedKey("advisor.mood.low_light_night", input: input)
        case .dimIndoor:
            return localizedKey("advisor.mood.indoor_soft", input: input)
        case .ccdParty:
            return localizedKey("advisor.mood.snapshot_flash", input: input)
        case .travelLandscape:
            return localizedKey("advisor.mood.travel_memory", input: input)
        case .overexposedHighlight:
            return localizedKey("advisor.mood.bright_retro", input: input)
        case .busyBackground:
            return localizedKey("advisor.mood.street_snapshot", input: input)
        case .chromeMood:
            return localizedKey("advisor.mood.chrome_contrast", input: input)
        }
    }

    static func signalKey(for signal: CreativeIntentStyleSignal, input: PhotoAdvisorInput) -> String {
        switch signal {
        case .lowLight:
            return intentSignalKey(for: .lowLight, input: input)
        case .motionBlur:
            if input.captureContext.localImageSignals.blurRisk == .high
                || input.captureContext.motion.motionBucket == .shaky {
                return intentSignalKey(for: .blur, input: input)
            }
            return intentSignalKey(for: .motion, input: input)
        case .tilt:
            return intentSignalKey(for: .tilt, input: input)
        case .softFocus:
            return intentSignalKey(for: .softFocus, input: input)
        case .retroGrain:
            return intentSignalKey(for: .grain, input: input)
        case .highContrast:
            return intentSignalKey(for: .highContrast, input: input)
        case .fadedColor:
            return intentSignalKey(for: .fadedColor, input: input)
        case .unusualFraming:
            return intentSignalKey(for: .unusualFraming, input: input)
        }
    }

    static func intentSignalKey(for signal: CreativeIntentSignal, input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.intent.signal.\(signal.rawValue)", input: input)
    }

    static func aspectSuggestionKey(for bucket: PhotoAdvisorAspectRatioBucket, input: PhotoAdvisorInput) -> String? {
        switch bucket {
        case .landscape, .wideLandscape:
            return localizedKey("advisor.signal.framing.negative_space", input: input)
        case .portrait, .tallPortrait:
            return localizedKey("advisor.signal.framing.center", input: input)
        case .square, .unavailable:
            return nil
        }
    }

    static func importedFallbackKey(for input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.fallback.imported_photo", input: input)
    }

    static func cropAdviceKey(for input: PhotoAdvisorInput) -> String {
        if input.captureContext.localImageSignals.clutter == .high {
            return localizedKey("advisor.action.crop.clutter", input: input)
        }
        return localizedKey("advisor.action.crop.subtle", input: input)
    }

    static func straightenAdviceKey(for input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.action.straighten.optional", input: input)
    }

    static func retakeOptionalKey(for input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.action.retake.optional", input: input)
    }

    static func retakeTechnicalRiskKey(for input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.action.retake.technical_risk", input: input)
    }

    static func keepStyleKey(for input: PhotoAdvisorInput) -> String {
        localizedKey("advisor.intent.keep_style.current", input: input)
    }

    static func localOnlyFallbackKey(
        language: AppLanguageMode,
        requestedTone: ToneMode
    ) -> String {
        localizedKey(
            "advisor.fallback.local_only",
            language: language,
            requestedTone: requestedTone
        )
    }

    static func providerUnavailableKey(
        language: AppLanguageMode,
        requestedTone: ToneMode
    ) -> String {
        localizedKey(
            "advisor.fallback.provider_unavailable",
            language: language,
            requestedTone: requestedTone
        )
    }

    static func filterReasonKey(filterId: String, input: PhotoAdvisorInput) -> String {
        PhotoAdvisorFilterReasonLibrary.reasonKey(filterId: filterId, input: input)
    }

    static func localizedKey(_ base: String, input: PhotoAdvisorInput) -> String {
        localizedKey(base, language: input.languageMode, requestedTone: input.toneMode)
    }

    static func localizedKey(
        _ base: String,
        language: AppLanguageMode,
        requestedTone: ToneMode
    ) -> String {
        "\(base).\(localeComponent(language: language, requestedTone: requestedTone))"
    }

    private static func localeComponent(
        language: AppLanguageMode,
        requestedTone: ToneMode
    ) -> String {
        switch language {
        case .english:
            return "en"
        case .traditionalChinese:
            return "zh_hant"
        case .simplifiedChinese:
            return "zh_hans"
        case .cantonese:
            switch requestedTone {
            case .troublemaker, .troublemakerExplicit:
                return "yue_troublemaker"
            case .neutral, .hongKongConversational:
                return "yue_hk"
            }
        }
    }
}
