import Foundation

enum PhotoAdvisorHeuristicResolver {
    static func result(for input: PhotoAdvisorInput, allowedFilterIds: Set<String>) -> PhotoAdvisorResult {
        let scene = scene(for: input)
        let base = PhotoAdvisorFixtures.result(for: scene)
        let recommendations = filterRecommendations(for: input, scene: scene)
        let suggestions = suggestions(for: input, base: base)
        let copyResolver = PhotoAdvisorCopyResolver()

        let result = PhotoAdvisorResult(
            id: "\(base.id)_\(input.selectedFilterId ?? "none")_\(input.imageSignal.aspectRatioBucket.rawValue)",
            schemaVersion: PhotoAdvisorResultValidator.schemaVersion,
            mode: .postCapture,
            summaryKey: summaryKey(for: input, scene: scene, base: base),
            strengthsKeys: base.strengthsKeys,
            suggestions: suggestions,
            recommendedFilters: recommendations,
            retakeAdvice: retakeAdvice(for: input, base: base),
            cropAdvice: cropAdvice(for: input, base: base),
            confidence: confidence(for: input),
            source: .local
        )

        let localizedResult = copyResolver.localizedResult(result, input: input)
        return PhotoAdvisorResultValidator.validated(localizedResult, allowedFilterIds: allowedFilterIds)
    }

    static func scene(for input: PhotoAdvisorInput) -> PhotoAdvisorMockScene {
        if let mockScene = input.mockScene {
            return mockScene
        }

        if !input.imageSignal.hasPreviewImage {
            return PhotoAdvisorFixtures.fallbackScene
        }

        switch filterFamily(for: input.selectedFilterId) {
        case .warmPortrait:
            return .warmPortrait
        case .streetChrome:
            return .busyBackground
        case .nightNeon:
            return .nightStreet
        case .cinematic:
            return .overexposedHighlight
        case .ccd:
            return .ccdParty
        case .travel:
            return .travelLandscape
        case .chromeMono:
            return .chromeMood
        case .generic:
            if input.variantSeed > 0 {
                return stableScene(
                    seed: "\(input.photoId)-\(input.imageSignal.aspectRatioBucket.rawValue)-\(input.variantSeed)",
                    source: input.source
                )
            }

            switch input.imageSignal.aspectRatioBucket {
            case .landscape, .wideLandscape:
                return .travelLandscape
            case .portrait, .tallPortrait:
                return .warmPortrait
            case .square:
                return .busyBackground
            case .unavailable:
                return stableScene(seed: input.photoId, source: input.source)
            }
        }
    }

    private static func summaryKey(
        for input: PhotoAdvisorInput,
        scene: PhotoAdvisorMockScene,
        base: PhotoAdvisorResult
    ) -> String {
        if input.imageSignal.hasPreviewImage {
            return PhotoAdvisorLanguagePack.moodSummaryKey(for: scene, input: input)
        }

        return base.summaryKey
    }

    private static func suggestions(for input: PhotoAdvisorInput, base: PhotoAdvisorResult) -> [PhotoAdvisorSuggestion] {
        var suggestions = base.suggestions

        if let intentSuggestion = intentSuggestion(for: input) {
            suggestions.insert(intentSuggestion, at: 0)
        }

        if input.source == .imported {
            suggestions.insert(importedPhotoSuggestion(for: input), at: min(1, suggestions.count))
        }

        if let aspectSuggestion = aspectSuggestion(for: input.imageSignal.aspectRatioBucket, input: input) {
            suggestions.insert(aspectSuggestion, at: min(1, suggestions.count))
        }

        return Array(suggestions.prefix(3))
    }

    private static func intentSuggestion(for input: PhotoAdvisorInput) -> PhotoAdvisorSuggestion? {
        guard let signal = CreativeIntentLanguageRules.primarySignal(in: input.captureContext.creativeIntent) else {
            return nil
        }

        return PhotoAdvisorSuggestion(
            id: "intent_\(signal.rawValue)",
            type: suggestionType(for: signal),
            textKey: PhotoAdvisorLanguagePack.intentSignalKey(for: signal, input: input),
            priority: .medium
        )
    }

    private static func importedPhotoSuggestion(for input: PhotoAdvisorInput) -> PhotoAdvisorSuggestion {
        PhotoAdvisorSuggestion(
            id: "imported_photo_context",
            type: .composition,
            textKey: PhotoAdvisorLanguagePack.importedFallbackKey(for: input),
            priority: .low
        )
    }

    private static func aspectSuggestion(
        for bucket: PhotoAdvisorAspectRatioBucket,
        input: PhotoAdvisorInput
    ) -> PhotoAdvisorSuggestion? {
        guard let textKey = PhotoAdvisorLanguagePack.aspectSuggestionKey(for: bucket, input: input) else {
            return nil
        }

        switch bucket {
        case .landscape, .wideLandscape:
            return PhotoAdvisorSuggestion(
                id: "heuristic_landscape_space",
                type: .crop,
                textKey: textKey,
                priority: .medium
            )
        case .portrait:
            return PhotoAdvisorSuggestion(
                id: "heuristic_portrait_space",
                type: .composition,
                textKey: textKey,
                priority: .medium
            )
        case .tallPortrait:
            return PhotoAdvisorSuggestion(
                id: "heuristic_tall_portrait_space",
                type: .composition,
                textKey: textKey,
                priority: .medium
            )
        case .square, .unavailable:
            return nil
        }
    }

    private static func retakeAdvice(
        for input: PhotoAdvisorInput,
        base: PhotoAdvisorResult
    ) -> PhotoAdvisorRetakeAdvice {
        if CreativeIntentLanguageRules.shouldOfferOptionalRetake(for: input.captureContext.creativeIntent) {
            return PhotoAdvisorRetakeAdvice(
                shouldRetake: true,
                reasonKey: PhotoAdvisorLanguagePack.retakeTechnicalRiskKey(for: input)
            )
        }

        if input.captureContext.creativeIntent.avoidOvercorrecting {
            return PhotoAdvisorRetakeAdvice(
                shouldRetake: false,
                reasonKey: PhotoAdvisorLanguagePack.keepStyleKey(for: input)
            )
        }

        switch input.imageSignal.aspectRatioBucket {
        case .landscape, .wideLandscape:
            return PhotoAdvisorRetakeAdvice(
                shouldRetake: false,
                reasonKey: PhotoAdvisorLanguagePack.keepStyleKey(for: input)
            )
        case .portrait, .tallPortrait:
            return PhotoAdvisorRetakeAdvice(
                shouldRetake: false,
                reasonKey: PhotoAdvisorLanguagePack.keepStyleKey(for: input)
            )
        case .square:
            return PhotoAdvisorRetakeAdvice(
                shouldRetake: false,
                reasonKey: PhotoAdvisorLanguagePack.keepStyleKey(for: input)
            )
        case .unavailable:
            return base.retakeAdvice
        }
    }

    private static func cropAdvice(
        for input: PhotoAdvisorInput,
        base: PhotoAdvisorResult
    ) -> PhotoAdvisorCropAdvice? {
        if input.captureContext.creativeIntent.styleSignals.contains(.tilt)
            || input.captureContext.creativeIntent.styleSignals.contains(.unusualFraming) {
            return PhotoAdvisorCropAdvice(
                recommended: false,
                textKey: PhotoAdvisorLanguagePack.straightenAdviceKey(for: input)
            )
        }

        switch input.imageSignal.aspectRatioBucket {
        case .landscape, .wideLandscape:
            return PhotoAdvisorCropAdvice(
                recommended: false,
                textKey: PhotoAdvisorLanguagePack.cropAdviceKey(for: input)
            )
        case .portrait:
            return PhotoAdvisorCropAdvice(
                recommended: false,
                textKey: PhotoAdvisorLanguagePack.cropAdviceKey(for: input)
            )
        case .tallPortrait:
            return PhotoAdvisorCropAdvice(
                recommended: false,
                textKey: PhotoAdvisorLanguagePack.cropAdviceKey(for: input)
            )
        case .square:
            return PhotoAdvisorCropAdvice(
                recommended: false,
                textKey: PhotoAdvisorLanguagePack.keepStyleKey(for: input)
            )
        case .unavailable:
            return base.cropAdvice
        }
    }

    private static func filterRecommendations(
        for input: PhotoAdvisorInput,
        scene: PhotoAdvisorMockScene
    ) -> [PhotoAdvisorFilterRecommendation] {
        switch filterFamily(for: input.selectedFilterId) {
        case .warmPortrait:
            return [
                recommendation("heuristic_soft_warm", filterId: "soft_warm_400", reasonKey: "photo_advisor.fixture.warm_portrait.filter.soft_warm", confidence: .high),
                recommendation("heuristic_instant_dream", filterId: "instant_dream", reasonKey: "photo_advisor.fixture.warm_portrait.filter.instant_dream", confidence: .high),
                recommendation("heuristic_summer_gold", filterId: "summer_gold_200", reasonKey: "photo_advisor.fixture.travel_landscape.filter.summer", confidence: .medium)
            ]
        case .streetChrome:
            return [
                recommendation("heuristic_street_chrome", filterId: "street_chrome", reasonKey: "photo_advisor.fixture.busy_background.filter.street", confidence: .high),
                recommendation("heuristic_metro_pop", filterId: "metro_pop", reasonKey: "photo_advisor.fixture.busy_background.filter.metro", confidence: .medium),
                recommendation("heuristic_silver", filterId: "silver_gradation", reasonKey: "photo_advisor.fixture.chrome_mood.filter.silver", confidence: .medium)
            ]
        case .nightNeon:
            return [
                recommendation("heuristic_amber_night", filterId: "amber_night_800", reasonKey: "photo_advisor.fixture.night_street.filter.amber", confidence: .high),
                recommendation("heuristic_neon_tungsten", filterId: "neon_tungsten_800", reasonKey: "photo_advisor.fixture.night_street.filter.neon", confidence: .high),
                recommendation("heuristic_ccd_party", filterId: "ccd_party_2008", reasonKey: "photo_advisor.fixture.ccd_party.filter.ccd", confidence: .medium)
            ]
        case .cinematic:
            return [
                recommendation("heuristic_cinema_flat", filterId: "cinema_flat", reasonKey: "photo_advisor.fixture.overexposed_highlight.filter.cinema", confidence: .high),
                recommendation("heuristic_editor_classic", filterId: "editor_classic", reasonKey: "photo_advisor.fixture.dim_indoor.filter.editor", confidence: .medium)
            ]
        case .ccd:
            return [
                recommendation("heuristic_ccd", filterId: "ccd_party_2008", reasonKey: "photo_advisor.fixture.ccd_party.filter.ccd", confidence: .high),
                recommendation("heuristic_flash", filterId: "flash_party", reasonKey: "photo_advisor.fixture.ccd_party.filter.flash", confidence: .medium),
                recommendation("heuristic_instant", filterId: "instant_dream", reasonKey: "photo_advisor.fixture.warm_portrait.filter.instant_dream", confidence: .medium)
            ]
        case .travel:
            return [
                recommendation("heuristic_summer", filterId: "summer_gold_200", reasonKey: "photo_advisor.fixture.travel_landscape.filter.summer", confidence: .high),
                recommendation("heuristic_everyday", filterId: "everyday_color_400", reasonKey: "photo_advisor.fixture.travel_landscape.filter.everyday", confidence: .medium),
                recommendation("heuristic_vivid", filterId: "vivid_landscape_100", reasonKey: "photo_advisor.heuristic.filter.vivid_landscape", confidence: .medium)
            ]
        case .chromeMono:
            return [
                recommendation("heuristic_silver_gradation", filterId: "silver_gradation", reasonKey: "photo_advisor.fixture.chrome_mood.filter.silver", confidence: .high),
                recommendation("heuristic_street", filterId: "street_chrome", reasonKey: "photo_advisor.fixture.chrome_mood.filter.street", confidence: .medium),
                recommendation("heuristic_tri_grit", filterId: "tri_grit_400", reasonKey: "photo_advisor.heuristic.filter.tri_grit", confidence: .medium)
            ]
        case .generic:
            return PhotoAdvisorFixtures.result(for: scene).recommendedFilters
        }
    }

    private static func recommendation(
        _ id: String,
        filterId: String,
        reasonKey: String,
        confidence: PhotoAdvisorConfidence
    ) -> PhotoAdvisorFilterRecommendation {
        PhotoAdvisorFilterRecommendation(
            id: id,
            filterId: filterId,
            reasonKey: reasonKey,
            confidence: confidence
        )
    }

    private static func suggestionType(for signal: CreativeIntentSignal) -> PhotoAdvisorSuggestionType {
        switch signal {
        case .lowLight, .overexposure, .underexposure:
            return .lighting
        case .grain, .softFocus, .highContrast, .fadedColor:
            return .filter
        case .blur, .motion, .tilt, .unusualFraming, .clutter, .cropRisk:
            return .composition
        }
    }

    private static func confidence(for input: PhotoAdvisorInput) -> PhotoAdvisorConfidence {
        if input.selectedFilterId == nil || input.selectedFilterId == "original" {
            return input.imageSignal.hasPreviewImage ? .medium : .low
        }

        return .high
    }

    private static func stableScene(seed: String, source: PhotoAdvisorPhotoSource) -> PhotoAdvisorMockScene {
        let salt = source == .imported ? 3 : 0
        let value = seed.unicodeScalars.reduce(salt) { partialResult, scalar in
            partialResult + Int(scalar.value)
        }
        let scenes = PhotoAdvisorMockScene.allCases
        return scenes[value % scenes.count]
    }

    private static func filterFamily(for filterId: String?) -> FilterFamily {
        switch filterId {
        case "soft_warm_400", "soft_sun_portrait", "instant_dream", "warm-vintage", "classic-film":
            return .warmPortrait
        case "street_chrome", "metro_pop", "slide_pop", "faded-chrome":
            return .streetChrome
        case "amber_night_800", "neon_tungsten_800":
            return .nightNeon
        case "cinema_flat", "editor_classic":
            return .cinematic
        case "ccd_party_2008", "flash_party", "diana_soft":
            return .ccd
        case "summer_gold_200", "everyday_color_400", "vivid_landscape_100", "memory_negative", "amber_nostalgia":
            return .travel
        case "silver_gradation", "tri_grit_400":
            return .chromeMono
        default:
            return .generic
        }
    }

    private enum FilterFamily {
        case warmPortrait
        case streetChrome
        case nightNeon
        case cinematic
        case ccd
        case travel
        case chromeMono
        case generic
    }
}
