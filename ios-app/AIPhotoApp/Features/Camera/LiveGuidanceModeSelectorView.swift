import SwiftUI

struct LiveGuidanceModeSelectorView: View {
    let mode: LiveGuidanceMode
    let toggle: () -> Void

    var body: some View {
        Button {
            toggle()
        } label: {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: mode == .local ? "cpu" : "wand.and.stars")
                    .font(.system(size: 11, weight: .bold))

                Text(LocalizedStringKey(mode.titleKey))
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
            }
            .padding(.vertical, AppSpacing.xs)
            .padding(.horizontal, AppSpacing.sm)
            .background(Color.white.opacity(0.10))
            .foregroundStyle(.white.opacity(0.78))
            .clipShape(Capsule())
            .overlay {
                Capsule()
                    .stroke(.white.opacity(0.16), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel("camera.guidance.mode.toggle.accessibility")
    }
}

#Preview {
    HStack {
        LiveGuidanceModeSelectorView(mode: .mock, toggle: {})
        LiveGuidanceModeSelectorView(mode: .local, toggle: {})
    }
    .padding()
    .background(Color.black)
}

