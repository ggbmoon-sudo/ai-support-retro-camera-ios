import Combine
import Foundation

@MainActor
final class CameraCoachToneSettingsStore: ObservableObject {
    static let shared = CameraCoachToneSettingsStore()

    static let languageKey = "cameraCoach.languageMode"
    static let toneKey = "cameraCoach.toneMode"

    @Published private(set) var languageMode: AppLanguageMode {
        didSet {
            defaults.set(languageMode.rawValue, forKey: Self.languageKey)
        }
    }

    @Published private(set) var toneMode: ToneMode {
        didSet {
            defaults.set(toneMode.rawValue, forKey: Self.toneKey)
        }
    }

    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults

        let storedLanguage = defaults.string(forKey: Self.languageKey)
            .flatMap(AppLanguageMode.init(rawValue:)) ?? .traditionalChinese
        let storedTone = defaults.string(forKey: Self.toneKey)
            .flatMap(ToneMode.init(rawValue:)) ?? .neutral

        languageMode = storedLanguage
        toneMode = Self.sanitizedTone(storedTone, for: storedLanguage)
    }

    func setLanguageMode(_ language: AppLanguageMode) {
        languageMode = language
        toneMode = Self.sanitizedTone(toneMode, for: language)
    }

    func setToneMode(_ tone: ToneMode) {
        toneMode = Self.sanitizedTone(tone, for: languageMode)
    }

    var runtimeLanguageMode: AppLanguageMode {
        languageMode
    }

    var runtimeToneMode: ToneMode {
        Self.sanitizedTone(toneMode, for: languageMode)
    }

    private static func sanitizedTone(_ tone: ToneMode, for language: AppLanguageMode) -> ToneMode {
        switch language {
        case .english, .traditionalChinese, .simplifiedChinese:
            return .neutral
        case .cantonese:
            switch tone {
            case .hongKongConversational, .troublemaker:
                return tone
            case .neutral:
                return .hongKongConversational
            case .troublemakerExplicit:
                return .troublemaker
            }
        }
    }
}
