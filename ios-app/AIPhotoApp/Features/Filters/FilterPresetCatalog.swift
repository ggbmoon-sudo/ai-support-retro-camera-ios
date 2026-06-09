import Foundation

nonisolated enum FilterPresetCatalog {
    static let all: [FilterPreset] = [
        original
    ] + researchPresets + legacyStarterFilters

    static let researchPresets: [FilterPreset] = batch1HeroFilters + phase13AdditionalFilters

    static let batch1HeroFilters: [FilterPreset] = [
        softWarm400,
        summerGold200,
        streetChrome,
        softSunPortrait,
        cinemaFlat,
        silverGradation
    ]

    static let phase13AdditionalFilters: [FilterPreset] = [
        everydayColor400,
        amberNight800,
        vividLandscape100,
        slidePop,
        memoryNegative,
        amberNostalgia,
        triGrit400,
        neonTungsten800,
        instantDream,
        metroPop,
        dianaSoft,
        flashParty,
        ccdParty2008,
        editorClassic
    ]

    static let legacyStarterFilters: [FilterPreset] = [
        classicFilm,
        warmVintage,
        fadedChrome
    ]

    static let original = FilterPreset(
        id: "original",
        category: .original,
        group: .featured,
        nameKey: "filters.preset.original.name",
        descriptionKey: "filters.preset.original.description",
        symbolName: "circle",
        implementationPriority: 0,
        adjustments: []
    )

    static let softWarm400 = FilterPreset(
        id: "soft_warm_400",
        category: .colorNegative,
        group: .featured,
        nameKey: "filters.preset.soft_warm_400.name",
        descriptionKey: "filters.preset.soft_warm_400.description",
        symbolName: "sun.haze",
        implementationPriority: 1,
        adjustments: [
            .exposure(0.05),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5850, targetNeutralY: 6),
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
        group: .featured,
        nameKey: "filters.preset.summer_gold_200.name",
        descriptionKey: "filters.preset.summer_gold_200.description",
        symbolName: "sun.max",
        implementationPriority: 2,
        adjustments: [
            .exposure(0.08),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5400, targetNeutralY: -2),
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
        group: .featured,
        nameKey: "filters.preset.street_chrome.name",
        descriptionKey: "filters.preset.street_chrome.description",
        symbolName: "building.2",
        implementationPriority: 3,
        adjustments: [
            .exposure(-0.02),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 7300, targetNeutralY: -6),
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
        group: .portrait,
        nameKey: "filters.preset.soft_sun_portrait.name",
        descriptionKey: "filters.preset.soft_sun_portrait.description",
        symbolName: "person.crop.square",
        implementationPriority: 4,
        adjustments: [
            .exposure(0.04),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5600, targetNeutralY: 10),
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
        group: .cinema,
        nameKey: "filters.preset.cinema_flat.name",
        descriptionKey: "filters.preset.cinema_flat.description",
        symbolName: "movieclapper",
        implementationPriority: 5,
        adjustments: [
            .exposure(-0.03),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6700, targetNeutralY: 2),
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
        group: .blackWhite,
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

    static let everydayColor400 = FilterPreset(
        id: "everyday_color_400",
        category: .daily,
        group: .daily,
        nameKey: "filters.preset.everyday_color_400.name",
        descriptionKey: "filters.preset.everyday_color_400.description",
        symbolName: "camera",
        implementationPriority: 7,
        adjustments: [
            .exposure(0.03),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6100, targetNeutralY: 2),
            .colorControls(saturation: 1.04, brightness: 0.01, contrast: 1.00),
            .highlightShadow(highlightAmount: 0.90, shadowAmount: 0.12),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.03),
                FilterTonePoint(x: 0.25, y: 0.25),
                FilterTonePoint(x: 0.50, y: 0.51),
                FilterTonePoint(x: 0.75, y: 0.77),
                FilterTonePoint(x: 1.00, y: 0.97)
            ]),
            .vignette(intensity: 0.10, radius: 1.60)
        ]
    )

    static let amberNight800 = FilterPreset(
        id: "amber_night_800",
        category: .night,
        group: .night,
        nameKey: "filters.preset.amber_night_800.name",
        descriptionKey: "filters.preset.amber_night_800.description",
        symbolName: "moon.haze",
        implementationPriority: 8,
        adjustments: [
            .exposure(-0.04),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5000, targetNeutralY: 12),
            .colorControls(saturation: 1.08, brightness: -0.01, contrast: 1.12),
            .highlightShadow(highlightAmount: 0.72, shadowAmount: 0.20),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.02),
                FilterTonePoint(x: 0.25, y: 0.20),
                FilterTonePoint(x: 0.50, y: 0.49),
                FilterTonePoint(x: 0.75, y: 0.78),
                FilterTonePoint(x: 1.00, y: 0.95)
            ]),
            .bloom(intensity: 0.18, radius: 6.0),
            .vignette(intensity: 0.28, radius: 1.25)
        ]
    )

    static let vividLandscape100 = FilterPreset(
        id: "vivid_landscape_100",
        category: .daily,
        group: .daily,
        nameKey: "filters.preset.vivid_landscape_100.name",
        descriptionKey: "filters.preset.vivid_landscape_100.description",
        symbolName: "mountain.2",
        implementationPriority: 9,
        adjustments: [
            .exposure(0.02),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6400, targetNeutralY: -4),
            .colorControls(saturation: 1.20, brightness: 0.00, contrast: 1.14),
            .highlightShadow(highlightAmount: 0.88, shadowAmount: 0.06),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.01),
                FilterTonePoint(x: 0.24, y: 0.22),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.76, y: 0.82),
                FilterTonePoint(x: 1.00, y: 1.00)
            ]),
            .sharpen(0.28)
        ]
    )

    static let slidePop = FilterPreset(
        id: "slide_pop",
        category: .chromeSlide,
        group: .street,
        nameKey: "filters.preset.slide_pop.name",
        descriptionKey: "filters.preset.slide_pop.description",
        symbolName: "square.stack.3d.up",
        implementationPriority: 10,
        adjustments: [
            .exposure(-0.01),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6900, targetNeutralY: 2),
            .colorControls(saturation: 1.24, brightness: -0.01, contrast: 1.26),
            .highlightShadow(highlightAmount: 0.90, shadowAmount: 0.00),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.00),
                FilterTonePoint(x: 0.22, y: 0.16),
                FilterTonePoint(x: 0.50, y: 0.49),
                FilterTonePoint(x: 0.78, y: 0.86),
                FilterTonePoint(x: 1.00, y: 1.00)
            ]),
            .vignette(intensity: 0.14, radius: 1.50),
            .sharpen(0.26)
        ]
    )

    static let memoryNegative = FilterPreset(
        id: "memory_negative",
        category: .colorNegative,
        group: .daily,
        nameKey: "filters.preset.memory_negative.name",
        descriptionKey: "filters.preset.memory_negative.description",
        symbolName: "photo",
        implementationPriority: 11,
        adjustments: [
            .exposure(0.06),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5700, targetNeutralY: 7),
            .colorControls(saturation: 0.92, brightness: 0.02, contrast: 0.86),
            .highlightShadow(highlightAmount: 0.84, shadowAmount: 0.28),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.07),
                FilterTonePoint(x: 0.25, y: 0.29),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.75, y: 0.76),
                FilterTonePoint(x: 1.00, y: 0.93)
            ]),
            .vignette(intensity: 0.12, radius: 1.75)
        ]
    )

    static let amberNostalgia = FilterPreset(
        id: "amber_nostalgia",
        category: .cameraLook,
        group: .cameraLooks,
        nameKey: "filters.preset.amber_nostalgia.name",
        descriptionKey: "filters.preset.amber_nostalgia.description",
        symbolName: "archivebox",
        implementationPriority: 12,
        adjustments: [
            .exposure(0.02),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 4700, targetNeutralY: 5),
            .colorControls(saturation: 0.82, brightness: 0.01, contrast: 0.88),
            .highlightShadow(highlightAmount: 0.82, shadowAmount: 0.24),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.08),
                FilterTonePoint(x: 0.25, y: 0.30),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.75, y: 0.75),
                FilterTonePoint(x: 1.00, y: 0.91)
            ]),
            .vignette(intensity: 0.22, radius: 1.35)
        ]
    )

    static let triGrit400 = FilterPreset(
        id: "tri_grit_400",
        category: .blackWhite,
        group: .blackWhite,
        nameKey: "filters.preset.tri_grit_400.name",
        descriptionKey: "filters.preset.tri_grit_400.description",
        symbolName: "circle.grid.cross",
        implementationPriority: 13,
        adjustments: [
            .exposure(-0.02),
            .colorControls(saturation: 0.00, brightness: -0.01, contrast: 1.34),
            .highlightShadow(highlightAmount: 0.86, shadowAmount: 0.04),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.00),
                FilterTonePoint(x: 0.22, y: 0.17),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.78, y: 0.86),
                FilterTonePoint(x: 1.00, y: 0.99)
            ]),
            .vignette(intensity: 0.24, radius: 1.30),
            .sharpen(0.38)
        ]
    )

    static let neonTungsten800 = FilterPreset(
        id: "neon_tungsten_800",
        category: .night,
        group: .night,
        nameKey: "filters.preset.neon_tungsten_800.name",
        descriptionKey: "filters.preset.neon_tungsten_800.description",
        symbolName: "sparkles",
        implementationPriority: 14,
        adjustments: [
            .exposure(-0.06),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 7600, targetNeutralY: 12),
            .colorControls(saturation: 1.16, brightness: -0.01, contrast: 1.10),
            .highlightShadow(highlightAmount: 0.70, shadowAmount: 0.18),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.02),
                FilterTonePoint(x: 0.25, y: 0.19),
                FilterTonePoint(x: 0.50, y: 0.48),
                FilterTonePoint(x: 0.75, y: 0.80),
                FilterTonePoint(x: 1.00, y: 0.94)
            ]),
            .bloom(intensity: 0.22, radius: 7.0),
            .vignette(intensity: 0.24, radius: 1.30)
        ]
    )

    static let instantDream = FilterPreset(
        id: "instant_dream",
        category: .cameraLook,
        group: .cameraLooks,
        nameKey: "filters.preset.instant_dream.name",
        descriptionKey: "filters.preset.instant_dream.description",
        symbolName: "camera.viewfinder",
        implementationPriority: 15,
        adjustments: [
            .exposure(0.08),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5600, targetNeutralY: 14),
            .colorControls(saturation: 0.86, brightness: 0.03, contrast: 0.78),
            .highlightShadow(highlightAmount: 0.80, shadowAmount: 0.32),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.10),
                FilterTonePoint(x: 0.25, y: 0.32),
                FilterTonePoint(x: 0.50, y: 0.54),
                FilterTonePoint(x: 0.75, y: 0.76),
                FilterTonePoint(x: 1.00, y: 0.92)
            ]),
            .bloom(intensity: 0.10, radius: 5.0),
            .vignette(intensity: 0.20, radius: 1.45)
        ]
    )

    static let metroPop = FilterPreset(
        id: "metro_pop",
        category: .chromeSlide,
        group: .street,
        nameKey: "filters.preset.metro_pop.name",
        descriptionKey: "filters.preset.metro_pop.description",
        symbolName: "tram",
        implementationPriority: 16,
        adjustments: [
            .exposure(0.00),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6800, targetNeutralY: -3),
            .colorControls(saturation: 1.18, brightness: 0.00, contrast: 1.18),
            .highlightShadow(highlightAmount: 0.86, shadowAmount: 0.04),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.01),
                FilterTonePoint(x: 0.24, y: 0.20),
                FilterTonePoint(x: 0.50, y: 0.51),
                FilterTonePoint(x: 0.76, y: 0.83),
                FilterTonePoint(x: 1.00, y: 0.98)
            ]),
            .vignette(intensity: 0.14, radius: 1.40),
            .sharpen(0.32)
        ]
    )

    static let dianaSoft = FilterPreset(
        id: "diana_soft",
        category: .cameraLook,
        group: .cameraLooks,
        nameKey: "filters.preset.diana_soft.name",
        descriptionKey: "filters.preset.diana_soft.description",
        symbolName: "circle.dotted",
        implementationPriority: 17,
        adjustments: [
            .exposure(0.06),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6000, targetNeutralY: 10),
            .colorControls(saturation: 0.88, brightness: 0.02, contrast: 0.80),
            .highlightShadow(highlightAmount: 0.78, shadowAmount: 0.30),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.09),
                FilterTonePoint(x: 0.25, y: 0.31),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.75, y: 0.74),
                FilterTonePoint(x: 1.00, y: 0.90)
            ]),
            .bloom(intensity: 0.12, radius: 8.0),
            .vignette(intensity: 0.36, radius: 1.10)
        ]
    )

    static let flashParty = FilterPreset(
        id: "flash_party",
        category: .cameraLook,
        group: .cameraLooks,
        nameKey: "filters.preset.flash_party.name",
        descriptionKey: "filters.preset.flash_party.description",
        symbolName: "bolt.fill",
        implementationPriority: 18,
        adjustments: [
            .exposure(0.04),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5200, targetNeutralY: 4),
            .colorControls(saturation: 1.12, brightness: 0.02, contrast: 1.20),
            .highlightShadow(highlightAmount: 0.96, shadowAmount: 0.00),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.00),
                FilterTonePoint(x: 0.20, y: 0.16),
                FilterTonePoint(x: 0.50, y: 0.52),
                FilterTonePoint(x: 0.80, y: 0.88),
                FilterTonePoint(x: 1.00, y: 0.99)
            ]),
            .vignette(intensity: 0.30, radius: 1.15),
            .sharpen(0.30)
        ]
    )

    static let ccdParty2008 = FilterPreset(
        id: "ccd_party_2008",
        category: .cameraLook,
        group: .cameraLooks,
        nameKey: "filters.preset.ccd_party_2008.name",
        descriptionKey: "filters.preset.ccd_party_2008.description",
        symbolName: "memorychip",
        implementationPriority: 19,
        adjustments: [
            .exposure(0.02),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 7000, targetNeutralY: -8),
            .colorControls(saturation: 1.22, brightness: 0.01, contrast: 1.28),
            .highlightShadow(highlightAmount: 0.94, shadowAmount: 0.00),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.00),
                FilterTonePoint(x: 0.22, y: 0.15),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.78, y: 0.84),
                FilterTonePoint(x: 1.00, y: 1.00)
            ]),
            .vignette(intensity: 0.20, radius: 1.35),
            .sharpen(0.44)
        ]
    )

    static let editorClassic = FilterPreset(
        id: "editor_classic",
        category: .cinematic,
        group: .cinema,
        nameKey: "filters.preset.editor_classic.name",
        descriptionKey: "filters.preset.editor_classic.description",
        symbolName: "slider.horizontal.3",
        implementationPriority: 20,
        adjustments: [
            .exposure(0.00),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 6350, targetNeutralY: 1),
            .colorControls(saturation: 0.90, brightness: 0.00, contrast: 1.04),
            .highlightShadow(highlightAmount: 0.84, shadowAmount: 0.10),
            .toneCurve([
                FilterTonePoint(x: 0.00, y: 0.03),
                FilterTonePoint(x: 0.25, y: 0.24),
                FilterTonePoint(x: 0.50, y: 0.50),
                FilterTonePoint(x: 0.75, y: 0.78),
                FilterTonePoint(x: 1.00, y: 0.96)
            ]),
            .vignette(intensity: 0.08, radius: 1.70),
            .sharpen(0.12)
        ]
    )

    static let classicFilm = FilterPreset(
        id: "classic-film",
        category: .legacyStarter,
        group: .starter,
        nameKey: "filters.preset.classic_film.name",
        descriptionKey: "filters.preset.classic_film.description",
        symbolName: "camera.filters",
        implementationPriority: 101,
        adjustments: [
            .exposure(0.06),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5900, targetNeutralY: 8),
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
        group: .starter,
        nameKey: "filters.preset.warm_vintage.name",
        descriptionKey: "filters.preset.warm_vintage.description",
        symbolName: "sun.max",
        implementationPriority: 102,
        adjustments: [
            .exposure(0.12),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 5200, targetNeutralY: 18),
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
        group: .starter,
        nameKey: "filters.preset.faded_chrome.name",
        descriptionKey: "filters.preset.faded_chrome.description",
        symbolName: "leaf",
        implementationPriority: 103,
        adjustments: [
            .exposure(-0.03),
            .temperatureAndTint(neutralX: 6500, neutralY: 0, targetNeutralX: 7100, targetNeutralY: -10),
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
