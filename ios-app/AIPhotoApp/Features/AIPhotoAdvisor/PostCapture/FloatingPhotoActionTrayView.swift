import SwiftUI

enum FloatingPhotoActionPanel: Equatable {
    case advisor
    case filters
}

struct FloatingPhotoActionTrayView: View {
    let selectedPreset: FilterPreset
    let activePanel: FloatingPhotoActionPanel?
    let isRendering: Bool
    let showsAdvisorButton: Bool
    let onToggleAdvisor: () -> Void
    let onToggleFilters: () -> Void

    var body: some View {
        HStack(spacing: AppSpacing.sm) {
            if showsAdvisorButton {
                Button(action: onToggleAdvisor) {
                    trayButtonContent(
                        icon: "sparkles",
                        titleKey: "photo_advisor.floating.ai_advice",
                        subtitleKey: "photo_advisor.badge.mock",
                        isActive: activePanel == .advisor
                    )
                }
                .buttonStyle(.plain)
            }

            Button(action: onToggleFilters) {
                HStack(spacing: AppSpacing.sm) {
                    Image(systemName: "camera.filters")
                        .font(.system(size: 16, weight: .semibold))

                    VStack(alignment: .leading, spacing: 2) {
                        Text("photo_advisor.floating.filter")
                            .font(AppTypography.micro)
                            .foregroundStyle(textColor(isActive: activePanel == .filters).opacity(0.74))
                            .lineLimit(1)

                        Text(LocalizedStringKey(selectedPreset.nameKey))
                            .font(AppTypography.caption.weight(.semibold))
                            .foregroundStyle(textColor(isActive: activePanel == .filters))
                            .lineLimit(1)
                            .minimumScaleFactor(0.72)
                    }

                    Spacer(minLength: AppSpacing.xs)

                    Image(systemName: activePanel == .filters ? "chevron.down" : "chevron.up")
                        .font(.system(size: 12, weight: .semibold))
                }
                .padding(.vertical, AppSpacing.sm)
                .padding(.horizontal, AppSpacing.md)
                .frame(maxWidth: .infinity, minHeight: 52)
                .background(buttonBackground(isActive: activePanel == .filters))
                .foregroundStyle(textColor(isActive: activePanel == .filters))
                .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .disabled(isRendering)
        }
        .padding(AppSpacing.xs)
        .background(Color.black.opacity(0.78))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.16), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.32), radius: 16, x: 0, y: 8)
    }

    private func trayButtonContent(
        icon: String,
        titleKey: LocalizedStringKey,
        subtitleKey: LocalizedStringKey,
        isActive: Bool
    ) -> some View {
        HStack(spacing: AppSpacing.sm) {
            Image(systemName: icon)
                .font(.system(size: 16, weight: .semibold))

            VStack(alignment: .leading, spacing: 2) {
                Text(titleKey)
                    .font(AppTypography.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.76)

                Text(subtitleKey)
                    .font(AppTypography.micro)
                    .lineLimit(1)
                    .foregroundStyle(textColor(isActive: isActive).opacity(0.74))
            }

            Spacer(minLength: AppSpacing.xs)
        }
        .padding(.vertical, AppSpacing.sm)
        .padding(.horizontal, AppSpacing.md)
        .frame(maxWidth: .infinity, minHeight: 52)
        .background(buttonBackground(isActive: isActive))
        .foregroundStyle(textColor(isActive: isActive))
        .clipShape(Capsule())
    }

    private func buttonBackground(isActive: Bool) -> Color {
        isActive ? AppColors.accent : Color.white.opacity(0.10)
    }

    private func textColor(isActive: Bool) -> Color {
        isActive ? Color.black : Color.white
    }
}

#Preview {
    FloatingPhotoActionTrayView(
        selectedPreset: FilterPresetCatalog.streetChrome,
        activePanel: .filters,
        isRendering: false,
        showsAdvisorButton: true,
        onToggleAdvisor: {},
        onToggleFilters: {}
    )
    .padding()
    .background(Color.black)
}
