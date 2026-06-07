import Foundation

struct CameraPreset: Identifiable, Hashable {
    let id: String
    let nameKey: String
    let descriptionKey: String
    let symbolName: String
    let isPremiumPlaceholder: Bool
}

extension CameraPreset {
    static let samples: [CameraPreset] = [
        CameraPreset(
            id: "warm-film",
            nameKey: "preset.warm_film.name",
            descriptionKey: "preset.warm_film.description",
            symbolName: "sun.max",
            isPremiumPlaceholder: false
        ),
        CameraPreset(
            id: "night-flash",
            nameKey: "preset.night_flash.name",
            descriptionKey: "preset.night_flash.description",
            symbolName: "bolt",
            isPremiumPlaceholder: false
        ),
        CameraPreset(
            id: "green-lens",
            nameKey: "preset.green_lens.name",
            descriptionKey: "preset.green_lens.description",
            symbolName: "leaf",
            isPremiumPlaceholder: false
        )
    ]
}
