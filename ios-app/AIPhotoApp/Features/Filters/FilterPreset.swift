import Foundation

nonisolated struct FilterPreset: Identifiable, Hashable, Sendable {
    let id: String
    let category: FilterPresetCategory
    let nameKey: String
    let descriptionKey: String
    let symbolName: String
    let implementationPriority: Int?
    let isMVP: Bool
    let isPremium: Bool
    let adjustments: [FilterAdjustment]

    var isOriginal: Bool {
        adjustments.isEmpty
    }

    init(
        id: String,
        category: FilterPresetCategory,
        nameKey: String,
        descriptionKey: String,
        symbolName: String,
        implementationPriority: Int? = nil,
        isMVP: Bool = true,
        isPremium: Bool = false,
        adjustments: [FilterAdjustment]
    ) {
        self.id = id
        self.category = category
        self.nameKey = nameKey
        self.descriptionKey = descriptionKey
        self.symbolName = symbolName
        self.implementationPriority = implementationPriority
        self.isMVP = isMVP
        self.isPremium = isPremium
        self.adjustments = adjustments
    }
}

nonisolated enum FilterPresetCategory: String, Hashable, Sendable {
    case original
    case colorNegative = "color_negative"
    case chromeSlide = "chrome_slide"
    case portrait
    case cinematic
    case blackWhite = "black_white"
    case legacyStarter = "legacy_starter"
}

nonisolated enum FilterAdjustment: Hashable, Sendable {
    case exposure(Double)
    case temperatureAndTint(
        neutralX: Double,
        neutralY: Double,
        targetNeutralX: Double,
        targetNeutralY: Double
    )
    case colorControls(saturation: Double, brightness: Double, contrast: Double)
    case highlightShadow(highlightAmount: Double, shadowAmount: Double)
    case toneCurve([FilterTonePoint])
    case vignette(intensity: Double, radius: Double)
    case sharpen(Double)
}

nonisolated struct FilterTonePoint: Hashable, Sendable {
    let x: Double
    let y: Double
}
