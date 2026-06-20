import Foundation

nonisolated enum PhotoAdvisorFilterLanguageFamily: String, CaseIterable, Codable, Hashable {
    case warmFilm = "warm_film"
    case fadedPastel = "faded_pastel"
    case cinematicContrast = "cinematic_contrast"
    case nightGrain = "night_grain"
    case softDream = "soft_dream"
    case streetChrome = "street_chrome"
    case amberGlow = "amber_glow"
    case coolFade = "cool_fade"
    case classicFilm = "classic_film"
}

nonisolated enum PhotoAdvisorFilterSignalBucket: String, Codable, Hashable {
    case balanced
    case warmLight = "warm_light"
    case coolTone = "cool_tone"
    case lowLight = "low_light"
    case brightLight = "bright_light"
    case fadedColor = "faded_color"
    case highContrast = "high_contrast"
    case softFocus = "soft_focus"
    case motionTexture = "motion_texture"
    case framingClutter = "framing_clutter"
}

nonisolated struct PhotoAdvisorFilterReasonProfile {
    let filterId: String
    let displayName: String
    let languageFamily: PhotoAdvisorFilterLanguageFamily
    let bestSignalBuckets: [PhotoAdvisorFilterSignalBucket]
    let avoidSignalBuckets: [PhotoAdvisorFilterSignalBucket]
    let reasonKeys: [PhotoAdvisorFilterSignalBucket: String]
    let creativeIntentTags: [CreativeIntentStyleSignal]
    let fallbackReasonKey: String
}

nonisolated enum PhotoAdvisorFilterReasonLibrary {
    static let profilesByFilterId: [String: PhotoAdvisorFilterReasonProfile] = Dictionary(uniqueKeysWithValues: [
        profile(
            "original",
            displayName: "Original",
            family: .classicFilm,
            best: [.balanced],
            keys: [.balanced: "advisor.filter.reason.classic_film.balanced"],
            tags: [],
            fallback: "advisor.filter.reason.classic_film.fallback"
        ),
        profile(
            "soft_warm_400",
            displayName: "Soft Warm 400",
            family: .warmFilm,
            best: [.warmLight, .softFocus],
            keys: [
                .warmLight: "advisor.filter.reason.warm_film.warm_light",
                .softFocus: "advisor.filter.reason.warm_film.soft_mood"
            ],
            tags: [.lowLight, .softFocus],
            fallback: "advisor.filter.reason.warm_film.fallback"
        ),
        profile(
            "summer_gold_200",
            displayName: "Summer Gold 200",
            family: .warmFilm,
            best: [.warmLight, .brightLight],
            keys: [
                .warmLight: "advisor.filter.reason.warm_film.warm_light",
                .brightLight: "advisor.filter.reason.warm_film.bright_light"
            ],
            tags: [.highContrast],
            fallback: "advisor.filter.reason.warm_film.fallback"
        ),
        profile(
            "street_chrome",
            displayName: "Street Chrome",
            family: .streetChrome,
            best: [.highContrast, .framingClutter],
            keys: [
                .highContrast: "advisor.filter.reason.street_chrome.high_contrast",
                .framingClutter: "advisor.filter.reason.street_chrome.framing_clutter"
            ],
            tags: [.highContrast, .tilt, .unusualFraming],
            fallback: "advisor.filter.reason.street_chrome.fallback"
        ),
        profile(
            "soft_sun_portrait",
            displayName: "Soft Sun Portrait",
            family: .warmFilm,
            best: [.warmLight, .softFocus],
            keys: [
                .warmLight: "advisor.filter.reason.warm_film.warm_light",
                .softFocus: "advisor.filter.reason.warm_film.soft_mood"
            ],
            tags: [.softFocus],
            fallback: "advisor.filter.reason.warm_film.fallback"
        ),
        profile(
            "cinema_flat",
            displayName: "Cinema Flat",
            family: .fadedPastel,
            best: [.fadedColor, .brightLight],
            keys: [
                .fadedColor: "advisor.filter.reason.faded_pastel.faded_color",
                .brightLight: "advisor.filter.reason.faded_pastel.soft_light"
            ],
            tags: [.fadedColor],
            fallback: "advisor.filter.reason.faded_pastel.fallback"
        ),
        profile(
            "silver_gradation",
            displayName: "Silver Gradation",
            family: .cinematicContrast,
            best: [.highContrast, .balanced],
            keys: [
                .highContrast: "advisor.filter.reason.cinematic_contrast.high_contrast",
                .balanced: "advisor.filter.reason.cinematic_contrast.fallback"
            ],
            tags: [.highContrast],
            fallback: "advisor.filter.reason.cinematic_contrast.fallback"
        ),
        profile(
            "everyday_color_400",
            displayName: "Everyday Color 400",
            family: .classicFilm,
            best: [.balanced, .warmLight],
            keys: [
                .balanced: "advisor.filter.reason.classic_film.balanced",
                .warmLight: "advisor.filter.reason.classic_film.warm_light"
            ],
            tags: [],
            fallback: "advisor.filter.reason.classic_film.fallback"
        ),
        profile(
            "amber_night_800",
            displayName: "Amber Night 800",
            family: .amberGlow,
            best: [.lowLight, .warmLight],
            keys: [
                .lowLight: "advisor.filter.reason.amber_glow.low_light",
                .warmLight: "advisor.filter.reason.amber_glow.warm_light"
            ],
            tags: [.lowLight, .retroGrain],
            fallback: "advisor.filter.reason.amber_glow.fallback"
        ),
        profile(
            "vivid_landscape_100",
            displayName: "Vivid Landscape 100",
            family: .cinematicContrast,
            best: [.brightLight, .highContrast],
            keys: [
                .brightLight: "advisor.filter.reason.cinematic_contrast.bright_light",
                .highContrast: "advisor.filter.reason.cinematic_contrast.high_contrast"
            ],
            tags: [.highContrast],
            fallback: "advisor.filter.reason.cinematic_contrast.fallback"
        ),
        profile(
            "slide_pop",
            displayName: "Slide Pop",
            family: .streetChrome,
            best: [.highContrast, .brightLight],
            keys: [
                .highContrast: "advisor.filter.reason.street_chrome.high_contrast",
                .brightLight: "advisor.filter.reason.street_chrome.fallback"
            ],
            tags: [.highContrast],
            fallback: "advisor.filter.reason.street_chrome.fallback"
        ),
        profile(
            "memory_negative",
            displayName: "Memory Negative",
            family: .fadedPastel,
            best: [.fadedColor, .softFocus],
            keys: [
                .fadedColor: "advisor.filter.reason.faded_pastel.faded_color",
                .softFocus: "advisor.filter.reason.faded_pastel.soft_light"
            ],
            tags: [.fadedColor, .softFocus],
            fallback: "advisor.filter.reason.faded_pastel.fallback"
        ),
        profile(
            "amber_nostalgia",
            displayName: "Amber Nostalgia",
            family: .amberGlow,
            best: [.warmLight, .fadedColor],
            keys: [
                .warmLight: "advisor.filter.reason.amber_glow.warm_light",
                .fadedColor: "advisor.filter.reason.amber_glow.fallback"
            ],
            tags: [.fadedColor, .lowLight],
            fallback: "advisor.filter.reason.amber_glow.fallback"
        ),
        profile(
            "tri_grit_400",
            displayName: "Tri-Grit 400",
            family: .nightGrain,
            best: [.highContrast, .motionTexture],
            keys: [
                .highContrast: "advisor.filter.reason.night_grain.motion_grain",
                .motionTexture: "advisor.filter.reason.night_grain.motion_grain"
            ],
            tags: [.retroGrain, .highContrast],
            fallback: "advisor.filter.reason.night_grain.fallback"
        ),
        profile(
            "neon_tungsten_800",
            displayName: "Neon Tungsten 800",
            family: .nightGrain,
            best: [.lowLight, .coolTone],
            keys: [
                .lowLight: "advisor.filter.reason.night_grain.low_light",
                .coolTone: "advisor.filter.reason.cool_fade.cool_tone"
            ],
            tags: [.lowLight, .retroGrain],
            fallback: "advisor.filter.reason.night_grain.fallback"
        ),
        profile(
            "instant_dream",
            displayName: "Instant Dream",
            family: .softDream,
            best: [.softFocus, .warmLight],
            keys: [
                .softFocus: "advisor.filter.reason.soft_dream.soft_focus",
                .warmLight: "advisor.filter.reason.soft_dream.warm_light"
            ],
            tags: [.softFocus, .fadedColor],
            fallback: "advisor.filter.reason.soft_dream.fallback"
        ),
        profile(
            "metro_pop",
            displayName: "Metro Pop",
            family: .streetChrome,
            best: [.highContrast, .framingClutter],
            keys: [
                .highContrast: "advisor.filter.reason.street_chrome.high_contrast",
                .framingClutter: "advisor.filter.reason.street_chrome.framing_clutter"
            ],
            tags: [.highContrast, .tilt],
            fallback: "advisor.filter.reason.street_chrome.fallback"
        ),
        profile(
            "diana_soft",
            displayName: "Diana Soft",
            family: .softDream,
            best: [.softFocus, .fadedColor],
            keys: [
                .softFocus: "advisor.filter.reason.soft_dream.soft_focus",
                .fadedColor: "advisor.filter.reason.faded_pastel.faded_color"
            ],
            tags: [.softFocus, .fadedColor],
            fallback: "advisor.filter.reason.soft_dream.fallback"
        ),
        profile(
            "flash_party",
            displayName: "Flash Party",
            family: .nightGrain,
            best: [.motionTexture, .highContrast],
            keys: [
                .motionTexture: "advisor.filter.reason.night_grain.motion_grain",
                .highContrast: "advisor.filter.reason.street_chrome.high_contrast"
            ],
            tags: [.retroGrain, .highContrast],
            fallback: "advisor.filter.reason.night_grain.fallback"
        ),
        profile(
            "ccd_party_2008",
            displayName: "CCD Party 2008",
            family: .nightGrain,
            best: [.motionTexture, .coolTone],
            keys: [
                .motionTexture: "advisor.filter.reason.night_grain.motion_grain",
                .coolTone: "advisor.filter.reason.cool_fade.cool_tone"
            ],
            tags: [.retroGrain, .motionBlur],
            fallback: "advisor.filter.reason.night_grain.fallback"
        ),
        profile(
            "editor_classic",
            displayName: "Editor Classic",
            family: .classicFilm,
            best: [.balanced, .fadedColor],
            keys: [
                .balanced: "advisor.filter.reason.classic_film.balanced",
                .fadedColor: "advisor.filter.reason.faded_pastel.faded_color"
            ],
            tags: [.fadedColor],
            fallback: "advisor.filter.reason.classic_film.fallback"
        ),
        profile(
            "classic-film",
            displayName: "Classic Film",
            family: .classicFilm,
            best: [.balanced, .warmLight],
            keys: [
                .balanced: "advisor.filter.reason.classic_film.balanced",
                .warmLight: "advisor.filter.reason.classic_film.warm_light"
            ],
            tags: [.retroGrain],
            fallback: "advisor.filter.reason.classic_film.fallback"
        ),
        profile(
            "warm-vintage",
            displayName: "Warm Vintage",
            family: .warmFilm,
            best: [.warmLight, .fadedColor],
            keys: [
                .warmLight: "advisor.filter.reason.warm_film.warm_light",
                .fadedColor: "advisor.filter.reason.faded_pastel.faded_color"
            ],
            tags: [.fadedColor, .lowLight],
            fallback: "advisor.filter.reason.warm_film.fallback"
        ),
        profile(
            "faded-chrome",
            displayName: "Faded Chrome",
            family: .coolFade,
            best: [.coolTone, .fadedColor],
            keys: [
                .coolTone: "advisor.filter.reason.cool_fade.cool_tone",
                .fadedColor: "advisor.filter.reason.cool_fade.faded_color"
            ],
            tags: [.fadedColor, .highContrast],
            fallback: "advisor.filter.reason.cool_fade.fallback"
        )
    ])

    static var mappedFilterIds: Set<String> {
        Set(profilesByFilterId.keys)
    }

    static func profile(for filterId: String) -> PhotoAdvisorFilterReasonProfile? {
        profilesByFilterId[filterId]
    }

    static func languageFamily(for filterId: String) -> PhotoAdvisorFilterLanguageFamily {
        profile(for: filterId)?.languageFamily ?? .classicFilm
    }

    static func familyKey(for family: PhotoAdvisorFilterLanguageFamily, input: PhotoAdvisorInput) -> String {
        PhotoAdvisorLanguagePack.localizedKey("advisor.filter.family.\(family.rawValue)", input: input)
    }

    static func reasonKey(filterId: String, input: PhotoAdvisorInput) -> String {
        guard let profile = profile(for: filterId) else {
            return PhotoAdvisorLanguagePack.localizedKey("advisor.filter.reason.fallback.unknown_filter", input: input)
        }

        let preferredBuckets = signalBuckets(from: input)
        let matchingBucket = preferredBuckets.first { profile.bestSignalBuckets.contains($0) }
        let keyBase = matchingBucket.flatMap { profile.reasonKeys[$0] } ?? profile.fallbackReasonKey

        return PhotoAdvisorLanguagePack.localizedKey(keyBase, input: input)
    }

    static func coverageIssues(catalogFilterIds: [String]) -> [String] {
        let catalogIds = Set(catalogFilterIds)
        let missing = catalogIds.subtracting(mappedFilterIds).sorted()
        let stale = mappedFilterIds.subtracting(catalogIds).sorted()

        var issues: [String] = []
        if !missing.isEmpty {
            issues.append("Missing filter reason profiles: \(missing.joined(separator: ", "))")
        }
        if !stale.isEmpty {
            issues.append("Filter reason profiles without catalog presets: \(stale.joined(separator: ", "))")
        }
        return issues
    }

    private static func signalBuckets(from input: PhotoAdvisorInput) -> [PhotoAdvisorFilterSignalBucket] {
        var buckets: [PhotoAdvisorFilterSignalBucket] = []
        let context = input.captureContext
        let signals = context.localImageSignals
        let intentSignals = Set(context.creativeIntent.styleSignals)

        if context.exposure.lowLightDetected
            || context.exposure.exposureBucket == .lowLight
            || signals.brightness == .low
            || intentSignals.contains(.lowLight) {
            buckets.append(.lowLight)
        }

        if context.exposure.exposureBucket == .bright || signals.brightness == .high {
            buckets.append(.brightLight)
        }

        if signals.warmth == .warm {
            buckets.append(.warmLight)
        } else if signals.warmth == .cool {
            buckets.append(.coolTone)
        }

        if signals.saturation == .low || intentSignals.contains(.fadedColor) {
            buckets.append(.fadedColor)
        }

        if signals.contrast == .high || intentSignals.contains(.highContrast) {
            buckets.append(.highContrast)
        }

        if signals.blurRisk == .medium
            || signals.blurRisk == .high
            || intentSignals.contains(.softFocus) {
            buckets.append(.softFocus)
        }

        if context.motion.motionBucket == .slightMotion
            || context.motion.motionBucket == .shaky
            || intentSignals.contains(.motionBlur)
            || intentSignals.contains(.retroGrain) {
            buckets.append(.motionTexture)
        }

        if signals.clutter == .high
            || context.level.levelBucket == .slightTilt
            || context.level.levelBucket == .strongTilt
            || intentSignals.contains(.tilt)
            || intentSignals.contains(.unusualFraming) {
            buckets.append(.framingClutter)
        }

        buckets.append(.balanced)
        return uniqueBuckets(buckets)
    }

    private static func uniqueBuckets(_ buckets: [PhotoAdvisorFilterSignalBucket]) -> [PhotoAdvisorFilterSignalBucket] {
        var seen = Set<PhotoAdvisorFilterSignalBucket>()
        return buckets.filter { seen.insert($0).inserted }
    }

    private static func profile(
        _ filterId: String,
        displayName: String,
        family: PhotoAdvisorFilterLanguageFamily,
        best: [PhotoAdvisorFilterSignalBucket],
        avoid: [PhotoAdvisorFilterSignalBucket] = [],
        keys: [PhotoAdvisorFilterSignalBucket: String],
        tags: [CreativeIntentStyleSignal],
        fallback: String
    ) -> (String, PhotoAdvisorFilterReasonProfile) {
        (
            filterId,
            PhotoAdvisorFilterReasonProfile(
                filterId: filterId,
                displayName: displayName,
                languageFamily: family,
                bestSignalBuckets: best,
                avoidSignalBuckets: avoid,
                reasonKeys: keys,
                creativeIntentTags: tags,
                fallbackReasonKey: fallback
            )
        )
    }
}
