import Foundation

nonisolated enum FilterPresetCatalog {
    static let all: [FilterPreset] = [
        original,
        classicFilm,
        warmVintage,
        fadedChrome
    ]

    static let original = FilterPreset(
        id: "original",
        nameKey: "filters.preset.original.name",
        descriptionKey: "filters.preset.original.description",
        symbolName: "circle",
        adjustments: []
    )

    static let classicFilm = FilterPreset(
        id: "classic-film",
        nameKey: "filters.preset.classic_film.name",
        descriptionKey: "filters.preset.classic_film.description",
        symbolName: "camera.filters",
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
        nameKey: "filters.preset.warm_vintage.name",
        descriptionKey: "filters.preset.warm_vintage.description",
        symbolName: "sun.max",
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
        nameKey: "filters.preset.faded_chrome.name",
        descriptionKey: "filters.preset.faded_chrome.description",
        symbolName: "leaf",
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
