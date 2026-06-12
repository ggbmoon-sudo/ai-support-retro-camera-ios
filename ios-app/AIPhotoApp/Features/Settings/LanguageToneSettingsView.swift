import SwiftUI

enum AppLanguageMode: String, CaseIterable, Identifiable {
    case english
    case traditionalChinese
    case simplifiedChinese
    case cantonese

    var id: String { rawValue }

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

struct LanguageToneSettingsView: View {
    @State private var selectedLanguage: AppLanguageMode = .cantonese

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            header

            optionGroup(
                title: "settings.language_tone.language.title",
                options: AppLanguageMode.allCases,
                selected: selectedLanguage,
                label: { $0.titleKey },
                action: { selectedLanguage = $0 }
            )

            if selectedLanguage == .cantonese {
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
