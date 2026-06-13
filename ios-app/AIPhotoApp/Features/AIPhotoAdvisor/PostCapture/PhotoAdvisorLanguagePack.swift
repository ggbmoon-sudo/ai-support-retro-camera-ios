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
            return localizedKey("advisor.signal.light.low", input: input)
        case .motionBlur:
            if input.captureContext.localImageSignals.blurRisk == .high
                || input.captureContext.motion.motionBucket == .shaky {
                return localizedKey("advisor.signal.blur.strong", input: input)
            }
            return localizedKey("advisor.signal.motion.slight", input: input)
        case .tilt:
            if input.captureContext.level.levelBucket == .strongTilt {
                return localizedKey("advisor.signal.tilt.strong", input: input)
            }
            return localizedKey("advisor.signal.tilt.slight", input: input)
        case .softFocus:
            return localizedKey("advisor.signal.blur.soft_focus", input: input)
        case .retroGrain:
            return localizedKey("advisor.signal.grain.retro", input: input)
        case .highContrast:
            return localizedKey("advisor.signal.contrast.high", input: input)
        case .fadedColor:
            return localizedKey("advisor.signal.color.faded", input: input)
        case .unusualFraming:
            return localizedKey("advisor.signal.framing.unusual", input: input)
        }
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
        switch filterId {
        case "soft_warm_400", "soft_sun_portrait", "instant_dream", "warm-vintage", "classic-film":
            return localizedKey("advisor.filter.reason.warm_light", input: input)
        case "amber_night_800", "neon_tungsten_800":
            return localizedKey("advisor.filter.reason.low_light", input: input)
        case "street_chrome", "metro_pop", "slide_pop", "faded-chrome", "silver_gradation", "tri_grit_400":
            return localizedKey("advisor.filter.reason.street_contrast", input: input)
        case "cinema_flat", "editor_classic":
            return localizedKey("advisor.filter.reason.soft_shadow", input: input)
        case "ccd_party_2008", "flash_party", "diana_soft":
            return localizedKey("advisor.filter.reason.grain_snapshot", input: input)
        default:
            return localizedKey("advisor.filter.reason.generic", input: input)
        }
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
