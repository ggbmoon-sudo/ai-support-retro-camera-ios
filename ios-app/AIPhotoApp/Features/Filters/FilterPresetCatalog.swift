import Foundation

nonisolated enum FilterPresetCatalog {
    static let all: [FilterPreset] = [
        original
    ] + batch1HeroFilters + legacyStarterFilters

    static let batch1HeroFilters: [FilterPreset] = [
        softWarm400,
        summerGold200,
        streetChrome,
        softSunPortrait,
        cinemaFlat,
        silverGradation
    ]

    static let legacyStarterFilters: [FilterPreset] = [
        classicFilm,
        warmVintage,
        fadedChrome
    ]

    static let original = FilterPreset(
        id: "original",
        category: .original,
        nameKey: "filters.preset.original.name",
        descriptionKey: "filters.preset.original.description",
        symbolName: "circle",
        implementationPriority: 0,
        adjustments: []
    )

    static let softWarm400 = FilterPreset(
        id: "soft_warm_400",
        category: .colorNegative,
        nameKey: "filters.preset.soft_warm_400.name",
        descriptionKey: "filters.preset.soft_warm_400.description",
        symbolName: "sun.haze",
        implementationPriority: 1,
        adjustments: [
            .exposure(0.05),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 5850,
                targetNeutralY: 6
            ),
            .colorControls(saturation: 1.06, brightness: 0.01, contrast: 0.94),
            .highlightShadow(highlightAmount: 0.88, shadowAmount: 0.18),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.04),
                FilterTonePoint(x: 0.25, y: 0.28),
                FilterTonePoint(x: 0.50, y: 0.53),
                FilterTonePoint(x: 0.75, y: 0.77),
                FilterTonePoint(x: 1.00, y: 0.96)
            ]),
            .vignette(intensity: 0.14, radius: 1.55)
        ]
    )

    static let summerGold200 = FilterPreset(
        id: "summer_gold_200",
        category: .colorNegative,
        nameKey: "filters.preset.summer_gold_200.name",
        descriptionKey: "filters.preset.summer_gold_200.description",
        symbolName: "sun.max",
        implementationPriority: 2,
        adjustments: [
            .exposure(0.08),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 5400,
                targetNeutralY: -2
            ),
            .colorControls(saturation: 1.12, brightness: 0.02, contrast: 1.02),
            .highlightShadow(highlightAmount: 0.92, shadowAmount: 0.12),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.03),
                FilterTonePoint(x: 0.25, y: 0.27),
                FilterTonePoint(x: 0.50, y: 0.54),
                FilterTonePoint(x: 0.75, y: 0.80),
                FilterTonePoint(x: 1.00, y: 0.98)
            ]),
            .vignette(intensity: 0.08, radius: 1.70),
            .sharpen(0.08)
        ]
    )

    static let streetChrome = FilterPreset(
        id: "street_chrome",
        category: .chromeSlide,
        nameKey: "filters.preset.street_chrome.name",
        descriptionKey: "filters.preset.street_chrome.description",
        symbolName: "building.2",
        implementationPriority: 3,
        adjustments: [
            .exposure(-0.02),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 7300,
                targetNeutralY: -6
            ),
            .colorControls(saturation: 1.14, brightness: -0.01, contrast: 1.22),
            .highlightShadow(highlightAmount: 0.94, shadowAmount: 0.00),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.00),
                FilterTonePoint(x: 0.22, y: 0.18),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.78, y: 0.84),
                FilterTonePoint(x: 1.00, y: 1.00)
            ]),
            .vignette(intensity: 0.22, radius: 1.35),
            .sharpen(0.34)
        ]
    )

    static let softSunPortrait = FilterPreset(
        id: "soft_sun_portrait",
        category: .portrait,
        nameKey: "filters.preset.soft_sun_portrait.name",
        descriptionKey: "filters.preset.soft_sun_portrait.description",
        symbolName: "person.crop.square",
        implementationPriority: 4,
        adjustments: [
            .exposure(0.04),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 5600,
                targetNeutralY: 10
            ),
            .colorControls(saturation: 1.02, brightness: 0.02, contrast: 0.88),
            .highlightShadow(highlightAmount: 0.82, shadowAmount: 0.28),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.05),
                FilterTonePoint(x: 0.30, y: 0.33),
                FilterTonePoint(x: 0.55, y: 0.58),
                FilterTonePoint(x: 0.80, y: 0.82),
                FilterTonePoint(x: 1.00, y: 0.96)
            ]),
            .vignette(intensity: 0.08, radius: 1.80)
        ]
    )

    static let cinemaFlat = FilterPreset(
        id: "cinema_flat",
        category: .cinematic,
        nameKey: "filters.preset.cinema_flat.name",
        descriptionKey: "filters.preset.cinema_flat.description",
        symbolName: "movieclapper",
        implementationPriority: 5,
        adjustments: [
            .exposure(-0.03),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 6700,
                targetNeutralY: 2
            ),
            .colorControls(saturation: 0.82, brightness: 0.00, contrast: 0.92),
            .highlightShadow(highlightAmount: 0.78, shadowAmount: 0.20),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.04),
                FilterTonePoint(x: 0.25, y: 0.27),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.75, y: 0.74),
                FilterTonePoint(x: 1.00, y: 0.94)
            ]),
            .vignette(intensity: 0.16, radius: 1.45),
            .sharpen(0.10)
        ]
    )

    static let silverGradation = FilterPreset(
        id: "silver_gradation",
        category: .blackWhite,
        nameKey: "filters.preset.silver_gradation.name",
        descriptionKey: "filters.preset.silver_gradation.description",
        symbolName: "circle.lefthalf.filled",
        implementationPriority: 6,
        adjustments: [
            .exposure(0.00),
            .colorControls(saturation: 0.00, brightness: 0.00, contrast: 1.16),
            .highlightShadow(highlightAmount: 0.88, shadowAmount: 0.16),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.02),
                FilterTonePoint(x: 0.25, y: 0.22),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.75, y: 0.80),
                FilterTonePoint(x: 1.00, y: 0.98)
            ]),
            .vignette(intensity: 0.18, radius: 1.35),
            .sharpen(0.18)
        ]
    )

    static let classicFilm = FilterPreset(
        id: "classic-film",
        category: .legacyStarter,
        nameKey: "filters.preset.classic_film.name",
        descriptionKey: "filters.preset.classic_film.description",
        symbolName: "camera.filters",
        implementationPriority: 101,
        adjustments: [
            .exposure(0.06),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 5900,
                targetNeutralY: 8
            ),
            .colorControls(saturation: 0.92, brightness: 0.01, contrast: 1.08),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.03),
                FilterTonePoint(x: 0.25, y: 0.22),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.75, y: 0.78),
                FilterTonePoint(x: 1.00, y: 0.96)
            ]),
            .vignette(intensity: 0.36, radius: 1.25),
            .sharpen(0.18)
        ]
    )

    static let warmVintage = FilterPreset(
        id: "warm-vintage",
        category: .legacyStarter,
        nameKey: "filters.preset.warm_vintage.name",
        descriptionKey: "filters.preset.warm_vintage.description",
        symbolName: "sun.max",
        implementationPriority: 102,
        adjustments: [
            .exposure(0.12),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 5200,
                targetNeutralY: 18
            ),
            .colorControls(saturation: 0.84, brightness: 0.02, contrast: 0.98),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.05),
                FilterTonePoint(x: 0.25, y: 0.26),
                FilterTonePoint(x: 0.50, y: 0.54),
                FilterTonePoint(x: 0.75, y: 0.80),
                FilterTonePoint(x: 1.00, y: 0.95)
            ]),
            .vignette(intensity: 0.24, radius: 1.45)
        ]
    )

    static let fadedChrome = FilterPreset(
        id: "faded-chrome",
        category: .legacyStarter,
        nameKey: "filters.preset.faded_chrome.name",
        descriptionKey: "filters.preset.faded_chrome.description",
        symbolName: "leaf",
        implementationPriority: 103,
        adjustments: [
            .exposure(-0.03),
            .temperatureAndTint(
                neutralX: 6500,
                neutralY: 0,
                targetNeutralX: 7100,
                targetNeutralY: -10
            ),
            .colorControls(saturation: 0.68, brightness: 0.02, contrast: 0.9),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.08),
                FilterTonePoint(x: 0.25, y: 0.25),
                FilterTonePoint(x: 0.50, y: 0.49),
                FilterTonePoint(x: 0.75, y: 0.74),
                FilterTonePoint(x: 1.00, y: 0.92)
            ]),
            .vignette(intensity: 0.18, radius: 1.65),
            .sharpen(0.1)
        ]
    )
}
