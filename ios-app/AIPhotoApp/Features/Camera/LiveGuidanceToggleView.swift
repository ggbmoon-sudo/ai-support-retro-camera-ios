import SwiftUI

struct LiveGuidanceToggleView: View {
    let isEnabled: Bool
    let toggle: () -> Void
    @ObservedObject private var toneSettings = CameraCoachToneSettingsStore.shared

    var body: some View {
        Button {
            toggle()
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: isEnabled ? "lightbulb.fill" : "lightbulb.slash")
                    .font(.system(size: 12, weight: .bold))

                Text(titleKey)
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(isEnabled ? AppColors.accent.opacity(0.24) : Color.white.opacity(0.10))
            .foregroundStyle(isEnabled ? AppColors.accent : .white.opacity(0.72))
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(isEnabled ? AppColors.accent.opacity(0.55) : .white.opacity(0.16), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.guidance.toggle.accessibility")
    }

    private var titleKey: LocalizedStringKey {
        guard isEnabled else { return "camera.guidance.toggle.off" }

        return LocalizedStringKey(
            GuidanceCopyResolver().chipTitleKey(
                language: toneSettings.runtimeLanguageMode,
                requestedTone: toneSettings.runtimeToneMode
            )
        )
    }
}

#Preview {
    HStack {
        LiveGuidanceToggleView(isEnabled: true, toggle: {})
        LiveGuidanceToggleView(isEnabled: false, toggle: {})
    }
    .padding()
    .background(Color.black)
}
