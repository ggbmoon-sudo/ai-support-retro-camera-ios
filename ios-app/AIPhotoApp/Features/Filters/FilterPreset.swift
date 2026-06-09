import Foundation

nonisolated struct FilterPreset: Identifiable, Hashable, Sendable {
    let id: String
    let category: FilterPresetCategory
    let group: FilterPresetGroup
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
        group: FilterPresetGroup,
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
        self.group = group
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
    case daily
    case night
    case experimental
    case cameraLook = "camera_look"
}

nonisolated enum FilterPresetGroup: String, CaseIterable, Hashable, Sendable {
    case featured
    case portrait
    case daily
    case street
    case cinema
    case blackWhite
    case night
    case cameraLooks
    case starter

    var titleKey: String {
        switch self {
        case .featured:
            return "filters.group.featured"
        case .portrait:
            return "filters.group.portrait"
        case .daily:
            return "filters.group.daily"
        case .street:
            return "filters.group.street"
        case .cinema:
            return "filters.group.cinema"
        case .blackWhite:
            return "filters.group.black_white"
        case .night:
            return "filters.group.night"
        case .cameraLooks:
            return "filters.group.camera_looks"
        case .starter:
            return "filters.group.starter"
        }
    }
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
    case bloom(intensity: Double, radius: Double)
    case vignette(intensity: Double, radius: Double)
    case sharpen(Double)
}

nonisolated struct FilterTonePoint: Hashable, Sendable {
    let x: Double
    let y: Double
}
