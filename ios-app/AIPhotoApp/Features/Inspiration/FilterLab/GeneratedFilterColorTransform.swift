import Foundation

nonisolated struct GeneratedFilterColorTransform: Codable, Hashable, Sendable {
    var inputNormalizationStrength: Double
    var styleIntensity: Double
    var lumaCurve: [Double]
    var redCurve: [Double]
    var greenCurve: [Double]
    var blueCurve: [Double]
    var basisLUTWeights: GeneratedFilterBasisLUTWeights

    static let identity = GeneratedFilterColorTransform(
        inputNormalizationStrength: 0,
        styleIntensity: 0,
        lumaCurve: [0, 0.25, 0.5, 0.75, 1],
        redCurve: [0, 0.25, 0.5, 0.75, 1],
        greenCurve: [0, 0.25, 0.5, 0.75, 1],
        blueCurve: [0, 0.25, 0.5, 0.75, 1],
        basisLUTWeights: .identity
    )
}

nonisolated struct GeneratedFilterBasisLUTWeights: Codable, Hashable, Sendable {
    var neutral: Double
    var warmAmber: Double
    var roseFlash: Double
    var coolChrome: Double
    var tealOrange: Double
    var mutedPastel: Double
    var deepBrown: Double
    var chromeSlide: Double

    static let identity = GeneratedFilterBasisLUTWeights(
        neutral: 1,
        warmAmber: 0,
        roseFlash: 0,
        coolChrome: 0,
        tealOrange: 0,
        mutedPastel: 0,
        deepBrown: 0,
        chromeSlide: 0
    )
}
