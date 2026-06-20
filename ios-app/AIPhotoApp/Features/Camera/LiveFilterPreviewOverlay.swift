import SwiftUI

struct LiveFilterPreviewModifier: ViewModifier {
    let preset: FilterPreset

    func body(content: Content) -> some View {
        let style = LiveFilterPreviewStyle(preset: preset)

        content
            .saturation(style.saturation)
            .brightness(style.brightness)
            .contrast(style.contrast)
            .overlay {
                style.tintColor
                    .opacity(style.tintOpacity)
                    .blendMode(style.tintBlendMode)
                    .allowsHitTesting(false)
            }
            .overlay {
                if style.bloomOpacity > 0 {
                    RadialGradient(
                        colors: [
                            .white.opacity(style.bloomOpacity),
                            .clear
                        ],
                        center: .center,
                        startRadius: 24,
                        endRadius: 320
                    )
                    .blendMode(.screen)
                    .allowsHitTesting(false)
                }
            }
            .overlay {
                if style.vignetteOpacity > 0 {
                    RadialGradient(
                        colors: [
                            .clear,
                            .black.opacity(style.vignetteOpacity)
                        ],
                        center: .center,
                        startRadius: 120,
                        endRadius: 430
                    )
                    .blendMode(.multiply)
                    .allowsHitTesting(false)
                }
            }
    }
}

extension View {
    func liveFilterPreview(_ preset: FilterPreset) -> some View {
        modifier(LiveFilterPreviewModifier(preset: preset))
    }
}

private struct LiveFilterPreviewStyle {
    let saturation: Double
    let brightness: Double
    let contrast: Double
    let tintColor: Color
    let tintOpacity: Double
    let tintBlendMode: BlendMode
    let vignetteOpacity: Double
    let bloomOpacity: Double

    init(preset: FilterPreset) {
        guard !preset.isOriginal else {
            saturation = 1
            brightness = 0
            contrast = 1
            tintColor = .clear
            tintOpacity = 0
            tintBlendMode = .normal
            vignetteOpacity = 0
            bloomOpacity = 0
            return
        }

        var resolvedSaturation = 1.0
        var resolvedBrightness = 0.0
        var resolvedContrast = 1.0
        var warmTintOpacity = 0.0
        var coolTintOpacity = 0.0
        var resolvedVignetteOpacity = 0.0
        var resolvedBloomOpacity = 0.0

        for adjustment in preset.adjustments {
            switch adjustment {
            case .exposure(let ev):
                resolvedBrightness += ev * 0.08
            case let .temperatureAndTint(neutralX, _, targetNeutralX, targetNeutralY):
                let temperatureDelta = targetNeutralX - neutralX
                if temperatureDelta < 0 {
                    warmTintOpacity += min(abs(temperatureDelta) / 6500, 0.18)
                } else if temperatureDelta > 0 {
                    coolTintOpacity += min(temperatureDelta / 6500, 0.14)
                }

                if targetNeutralY > 0 {
                    warmTintOpacity += min(targetNeutralY / 120, 0.06)
                } else if targetNeutralY < 0 {
                    coolTintOpacity += min(abs(targetNeutralY) / 120, 0.05)
                }
            case let .colorControls(saturation, brightness, contrast):
                resolvedSaturation *= saturation
                resolvedBrightness += brightness
                resolvedContrast *= contrast
            case .highlightShadow:
                break
            case .toneCurve(let points):
                if let firstPoint = points.first,
                   firstPoint.y > firstPoint.x {
                    resolvedBrightness += min((firstPoint.y - firstPoint.x) * 0.12, 0.03)
                }
            case let .bloom(intensity, _):
                resolvedBloomOpacity += min(intensity * 0.16, 0.06)
            case let .vignette(intensity, _):
                resolvedVignetteOpacity += min(intensity * 0.32, 0.16)
            case .sharpen:
                break
            }
        }

        saturation = min(max(resolvedSaturation, 0), 1.45)
        brightness = min(max(resolvedBrightness, -0.12), 0.12)
        contrast = min(max(resolvedContrast, 0.72), 1.42)
        if warmTintOpacity >= coolTintOpacity {
            tintColor = Color(red: 1.0, green: 0.72, blue: 0.42)
            tintOpacity = min(warmTintOpacity, 0.20)
            tintBlendMode = .softLight
        } else {
            tintColor = Color(red: 0.54, green: 0.72, blue: 1.0)
            tintOpacity = min(coolTintOpacity, 0.18)
            tintBlendMode = .softLight
        }
        vignetteOpacity = min(resolvedVignetteOpacity, 0.18)
        bloomOpacity = min(resolvedBloomOpacity, 0.08)
    }
}
