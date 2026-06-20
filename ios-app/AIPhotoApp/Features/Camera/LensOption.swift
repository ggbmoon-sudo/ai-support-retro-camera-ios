import Foundation

nonisolated struct LensOption: Identifiable, Equatable, Sendable {
    let id: String
    let focalLengthLabel: String
    let zoomLabel: String
    let accessibilityKey: String

    static let wide24 = LensOption(
        id: "wide_24mm",
        focalLengthLabel: "24mm",
        zoomLabel: "0.5x",
        accessibilityKey: "camera.lens.24mm"
    )

    static let classic35 = LensOption(
        id: "classic_35mm",
        focalLengthLabel: "35mm",
        zoomLabel: "1x",
        accessibilityKey: "camera.lens.35mm"
    )

    static let portrait77 = LensOption(
        id: "portrait_77mm",
        focalLengthLabel: "77mm",
        zoomLabel: "3x",
        accessibilityKey: "camera.lens.77mm"
    )

    static let frontSelfie = LensOption(
        id: "front_selfie",
        focalLengthLabel: "Selfie",
        zoomLabel: "1x",
        accessibilityKey: "camera.lens.front_selfie"
    )

    static let all = [wide24, classic35, portrait77]
}
