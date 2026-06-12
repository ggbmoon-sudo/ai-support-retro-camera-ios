import SwiftUI

extension AppLanguageMode {
    var titleKey: LocalizedStringKey {
        switch self {
        case .english:
            return "settings.language_tone.language.english"
        case .traditionalChinese:
            return "settings.language_tone.language.traditional_chinese"
        case .simplifiedChinese:
            return "settings.language_tone.language.simplified_chinese"
        case .cantonese:
            return "settings.language_tone.language.cantonese"
        }
    }
}

extension ToneMode {
    var titleKey: LocalizedStringKey {
        switch self {
        case .neutral:
            return "settings.language_tone.tone.neutral"
        case .hongKongConversational:
            return "settings.language_tone.tone.hk"
        case .troublemaker:
            return "settings.language_tone.tone.troublemaker"
        case .troublemakerExplicit:
            return "settings.language_tone.tone.explicit"
        }
    }
}

struct LanguageToneSettingsView: View {
    @ObservedObject private var toneSettings = CameraCoachToneSettingsStore.shared

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header

            optionGroup(
                title: "settings.language_tone.language.title",
                options: AppLanguageMode.allCases,
                selected: toneSettings.languageMode,
                label: { $0.titleKey },
                action: { toneSettings.setLanguageMode($0) }
            )

            if toneSettings.languageMode == .cantonese {
                optionGroup(
                    title: "settings.language_tone.cantonese_tone.title",
                    options: [ToneMode.hongKongConversational, .troublemaker],
                    selected: toneSettings.toneMode,
                    label: { $0.titleKey },
                    action: { toneSettings.setToneMode($0) }
                )

                CantoneseLanguageNoticeView()
            }
        }
        .padding(.vertical, AppSpacing.sm)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Label("settings.language_tone.title", systemImage: "text.bubble")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text("settings.language_tone.subtitle")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func optionGroup<Option: Identifiable & Equatable>(
        title: LocalizedStringKey,
        options: [Option],
        selected: Option,
        label: @escaping (Option) -> LocalizedStringKey,
        action: @escaping (Option) -> Void
    ) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text(title)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)

            LazyVGrid(columns: [GridItem(.flexible(), spacing: AppSpacing.sm), GridItem(.flexible())], spacing: AppSpacing.sm) {
                ForEach(options) { option in
                    Button {
                        action(option)
                    } label: {
                        Text(label(option))
                            .font(AppTypography.caption)
                            .foregroundStyle(selected == option ? Color.black : AppColors.textPrimary)
                            .lineLimit(1)
                            .minimumScaleFactor(0.82)
                            .frame(maxWidth: .infinity)
                            .padding(.vertical, AppSpacing.sm)
                            .padding(.horizontal, AppSpacing.sm)
                        .background(selected == option ? AppColors.accent : AppColors.elevatedSurface)
                        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.sm))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

struct CantoneseLanguageNoticeView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Label("settings.language_tone.notice.title", systemImage: "shield.checkered")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textPrimary)

            Text("settings.language_tone.notice.safety")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            Text("settings.language_tone.notice.explicit")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }
}

#Preview {
    List {
        Section {
            LanguageToneSettingsView()
        }
    }
    .scrollContentBackground(.hidden)
    .background(AppColors.background)
}
