import Foundation

nonisolated struct FilterPreset: Identifiable, Hashable, Sendable {
    let id: String
    let nameKey: String
    let descriptionKey: String
    let symbolName: String
    let adjustments: [FilterAdjustment]

    var isOriginal: Bool {
        adjustments.isEmpty
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
    case toneCurve([FilterTonePoint])
    case vignette(intensity: Double, radius: Double)
    case sharpen(Double)
}

nonisolated struct FilterTonePoint: Hashable, Sendable {
    let x: Double
    let y: Double
}
