import Foundation

nonisolated struct GeneratedFilmParameterSet: Codable, Hashable, Sendable {
    var grainSize: Double
    var grainRoughness: Double
    var grainLumaResponse: Double
    var halationStrength: Double
    var halationRadius: Double
    var halationWarmth: Double
    var diffusion: Double

    static let identity = GeneratedFilmParameterSet(
        grainSize: 1,
        grainRoughness: 0.4,
        grainLumaResponse: 0,
        halationStrength: 0,
        halationRadius: 8,
        halationWarmth: 0.65,
        diffusion: 0
    )
}
