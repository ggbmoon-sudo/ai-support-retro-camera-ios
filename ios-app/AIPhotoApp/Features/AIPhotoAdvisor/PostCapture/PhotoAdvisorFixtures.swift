import Foundation

enum PhotoAdvisorFixtures {
    static let fallbackScene: PhotoAdvisorMockScene = .warmPortrait

    static func result(for scene: PhotoAdvisorMockScene) -> PhotoAdvisorResult {
        switch scene {
        case .warmPortrait:
            return warmPortrait
        case .nightStreet:
            return nightStreet
        case .dimIndoor:
            return dimIndoor
        case .ccdParty:
            return ccdParty
        case .travelLandscape:
            return travelLandscape
        case .overexposedHighlight:
            return overexposedHighlight
        case .busyBackground:
            return busyBackground
        case .chromeMood:
            return chromeMood
        }
    }

    static func scene(for input: PhotoAdvisorInput) -> PhotoAdvisorMockScene {
        if let mockScene = input.mockScene {
            return mockScene
        }

        guard input.variantSeed == 0 else {
            return stableScene(
                photoId: "\(input.photoId)-\(input.selectedFilterId ?? "original")-\(input.variantSeed)",
                source: input.source
            )
        }

        switch input.selectedFilterId {
        case "instant_dream", "soft_warm_400", "soft_sun_portrait":
            return .warmPortrait
        case "amber_night_800", "neon_tungsten_800":
            return .nightStreet
        case "editor_classic", "cinema_flat":
            return .dimIndoor
        case "ccd_party_2008", "flash_party":
            return .ccdParty
        case "summer_gold_200", "everyday_color_400", "vivid_landscape_100":
            return .travelLandscape
        case "street_chrome", "metro_pop":
            return .busyBackground
        case "silver_gradation", "tri_grit_400":
            return .chromeMood
        default:
            return stableScene(photoId: input.photoId, source: input.source)
        }
    }

    private static func stableScene(photoId: String, source: PhotoAdvisorPhotoSource) -> PhotoAdvisorMockScene {
        let salt = source == .imported ? 3 : 0
        let value = photoId.unicodeScalars.reduce(salt) { partialResult, scalar in
            partialResult + Int(scalar.value)
        }
        let scenes = PhotoAdvisorMockScene.allCases
        return scenes[value % scenes.count]
    }

    private static let warmPortrait = PhotoAdvisorResult(
        id: "warm_portrait",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.warm_portrait.summary",
        strengthsKeys: [
            "photo_advisor.fixture.warm_portrait.strength.light",
            "photo_advisor.fixture.warm_portrait.strength.subject"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "warm_portrait_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.warm_portrait.suggestion.filter",
                priority: .high
            ),
            PhotoAdvisorSuggestion(
                id: "warm_portrait_crop",
                type: .composition,
                textKey: "photo_advisor.fixture.warm_portrait.suggestion.space",
                priority: .medium
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "warm_portrait_instant_dream",
                filterId: "instant_dream",
                reasonKey: "photo_advisor.fixture.warm_portrait.filter.instant_dream",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "warm_portrait_soft_warm",
                filterId: "soft_warm_400",
                reasonKey: "photo_advisor.fixture.warm_portrait.filter.soft_warm",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.warm_portrait.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: false,
            textKey: "photo_advisor.fixture.warm_portrait.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let nightStreet = PhotoAdvisorResult(
        id: "night_street",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.night_street.summary",
        strengthsKeys: [
            "photo_advisor.fixture.night_street.strength.lamps",
            "photo_advisor.fixture.night_street.strength.shadow"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "night_street_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.night_street.suggestion.filter",
                priority: .high
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "night_street_amber",
                filterId: "amber_night_800",
                reasonKey: "photo_advisor.fixture.night_street.filter.amber",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "night_street_neon",
                filterId: "neon_tungsten_800",
                reasonKey: "photo_advisor.fixture.night_street.filter.neon",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.night_street.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: true,
            textKey: "photo_advisor.fixture.night_street.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let dimIndoor = PhotoAdvisorResult(
        id: "dim_indoor",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.dim_indoor.summary",
        strengthsKeys: [
            "photo_advisor.fixture.dim_indoor.strength.light",
            "photo_advisor.fixture.dim_indoor.strength.daily"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "dim_indoor_lighting",
                type: .lighting,
                textKey: "photo_advisor.fixture.dim_indoor.suggestion.brighten",
                priority: .high
            ),
            PhotoAdvisorSuggestion(
                id: "dim_indoor_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.dim_indoor.suggestion.filter",
                priority: .medium
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "dim_indoor_editor",
                filterId: "editor_classic",
                reasonKey: "photo_advisor.fixture.dim_indoor.filter.editor",
                confidence: .medium
            ),
            PhotoAdvisorFilterRecommendation(
                id: "dim_indoor_soft_warm",
                filterId: "soft_warm_400",
                reasonKey: "photo_advisor.fixture.dim_indoor.filter.soft_warm",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.dim_indoor.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: false,
            textKey: "photo_advisor.fixture.dim_indoor.crop"
        ),
        confidence: .low,
        source: .mock
    )

    private static let ccdParty = PhotoAdvisorResult(
        id: "ccd_party",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.ccd_party.summary",
        strengthsKeys: [
            "photo_advisor.fixture.ccd_party.strength.snapshot",
            "photo_advisor.fixture.ccd_party.strength.flash"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "ccd_party_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.ccd_party.suggestion.filter",
                priority: .high
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "ccd_party_ccd",
                filterId: "ccd_party_2008",
                reasonKey: "photo_advisor.fixture.ccd_party.filter.ccd",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "ccd_party_flash",
                filterId: "flash_party",
                reasonKey: "photo_advisor.fixture.ccd_party.filter.flash",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.ccd_party.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: true,
            textKey: "photo_advisor.fixture.ccd_party.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let travelLandscape = PhotoAdvisorResult(
        id: "travel_landscape",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.travel_landscape.summary",
        strengthsKeys: [
            "photo_advisor.fixture.travel_landscape.strength.space",
            "photo_advisor.fixture.travel_landscape.strength.mood"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "travel_landscape_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.travel_landscape.suggestion.filter",
                priority: .high
            ),
            PhotoAdvisorSuggestion(
                id: "travel_landscape_crop",
                type: .crop,
                textKey: "photo_advisor.fixture.travel_landscape.suggestion.sky",
                priority: .medium
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "travel_landscape_summer",
                filterId: "summer_gold_200",
                reasonKey: "photo_advisor.fixture.travel_landscape.filter.summer",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "travel_landscape_everyday",
                filterId: "everyday_color_400",
                reasonKey: "photo_advisor.fixture.travel_landscape.filter.everyday",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.travel_landscape.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: false,
            textKey: "photo_advisor.fixture.travel_landscape.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let overexposedHighlight = PhotoAdvisorResult(
        id: "overexposed_highlight",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.overexposed_highlight.summary",
        strengthsKeys: [
            "photo_advisor.fixture.overexposed_highlight.strength.clean",
            "photo_advisor.fixture.overexposed_highlight.strength.summer"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "overexposed_highlight_lighting",
                type: .lighting,
                textKey: "photo_advisor.fixture.overexposed_highlight.suggestion.highlight",
                priority: .high
            ),
            PhotoAdvisorSuggestion(
                id: "overexposed_highlight_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.overexposed_highlight.suggestion.filter",
                priority: .medium
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "overexposed_highlight_cinema",
                filterId: "cinema_flat",
                reasonKey: "photo_advisor.fixture.overexposed_highlight.filter.cinema",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "overexposed_highlight_soft_warm",
                filterId: "soft_warm_400",
                reasonKey: "photo_advisor.fixture.overexposed_highlight.filter.soft_warm",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.overexposed_highlight.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: false,
            textKey: "photo_advisor.fixture.overexposed_highlight.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let busyBackground = PhotoAdvisorResult(
        id: "busy_background",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.busy_background.summary",
        strengthsKeys: [
            "photo_advisor.fixture.busy_background.strength.life",
            "photo_advisor.fixture.busy_background.strength.place"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "busy_background_crop",
                type: .crop,
                textKey: "photo_advisor.fixture.busy_background.suggestion.crop",
                priority: .high
            ),
            PhotoAdvisorSuggestion(
                id: "busy_background_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.busy_background.suggestion.filter",
                priority: .medium
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "busy_background_street",
                filterId: "street_chrome",
                reasonKey: "photo_advisor.fixture.busy_background.filter.street",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "busy_background_metro",
                filterId: "metro_pop",
                reasonKey: "photo_advisor.fixture.busy_background.filter.metro",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.busy_background.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: true,
            textKey: "photo_advisor.fixture.busy_background.crop"
        ),
        confidence: .medium,
        source: .mock
    )

    private static let chromeMood = PhotoAdvisorResult(
        id: "chrome_mood",
        schemaVersion: "1.0",
        mode: .postCapture,
        summaryKey: "photo_advisor.fixture.chrome_mood.summary",
        strengthsKeys: [
            "photo_advisor.fixture.chrome_mood.strength.contrast",
            "photo_advisor.fixture.chrome_mood.strength.street"
        ],
        suggestions: [
            PhotoAdvisorSuggestion(
                id: "chrome_mood_filter",
                type: .filter,
                textKey: "photo_advisor.fixture.chrome_mood.suggestion.filter",
                priority: .high
            )
        ],
        recommendedFilters: [
            PhotoAdvisorFilterRecommendation(
                id: "chrome_mood_silver",
                filterId: "silver_gradation",
                reasonKey: "photo_advisor.fixture.chrome_mood.filter.silver",
                confidence: .high
            ),
            PhotoAdvisorFilterRecommendation(
                id: "chrome_mood_street",
                filterId: "street_chrome",
                reasonKey: "photo_advisor.fixture.chrome_mood.filter.street",
                confidence: .medium
            )
        ],
        retakeAdvice: PhotoAdvisorRetakeAdvice(
            shouldRetake: false,
            reasonKey: "photo_advisor.fixture.chrome_mood.retake"
        ),
        cropAdvice: PhotoAdvisorCropAdvice(
            recommended: true,
            textKey: "photo_advisor.fixture.chrome_mood.crop"
        ),
        confidence: .medium,
        source: .mock
    )
}
