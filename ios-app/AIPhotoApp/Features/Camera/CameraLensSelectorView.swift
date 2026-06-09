import SwiftUI

struct CameraLensSelectorView: View {
    let options: [LensOption]
    let selectedOption: LensOption
    let onSelect: (LensOption) -> Void

    var body: some View {
        HStack(spacing: AppSpacing.xs) {
            ForEach(options) { option in
                Button {
                    onSelect(option)
                } label: {
                    VStack(spacing: 1) {
                        Text(option.focalLengthLabel)
                            .font(.caption.weight(.bold))
                            .lineLimit(1)

                        Text(option.zoomLabel)
                            .font(.caption2.weight(.medium))
                            .lineLimit(1)
                    }
                    .minimumScaleFactor(0.75)
                    .frame(minWidth: 54)
                    .padding(.vertical, AppSpacing.xs)
                    .padding(.horizontal, AppSpacing.xs)
                    .background(isSelected(option) ? AppColors.accent.opacity(0.24) : Color.white.opacity(0.08))
                    .foregroundStyle(isSelected(option) ? AppColors.accent : .white.opacity(0.78))
                    .clipShape(Capsule())
                    .overlay {
                        Capsule()
                            .stroke(isSelected(option) ? AppColors.accent.opacity(0.7) : Color.white.opacity(0.16), lineWidth: 1)
                    }
                }
                .buttonStyle(.plain)
                .accessibilityLabel(LocalizedStringKey(option.accessibilityKey))
            }
        }
        .padding(AppSpacing.xs)
        .background(Color.black.opacity(0.42))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.12), lineWidth: 1)
        }
    }

    private func isSelected(_ option: LensOption) -> Bool {
        selectedOption == option
    }
}

#Preview {
    CameraLensSelectorView(
        options: LensOption.all,
        selectedOption: .classic35,
        onSelect: { _ in }
    )
    .padding()
    .background(Color.black)
}
