import SwiftUI

struct PoseSelectorView: View {
    let guides: [PoseGuide]
    let selectedGuide: PoseGuide?
    let onSelect: (PoseGuide) -> Void
    let onClose: () -> Void

    private let columns = [
        GridItem(.flexible(), spacing: AppSpacing.sm),
        GridItem(.flexible(), spacing: AppSpacing.sm)
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(spacing: AppSpacing.sm) {
                Label("camera.pose.selector.title", systemImage: "figure.stand")
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)

                Spacer()

                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 11, weight: .bold))
                        .frame(width: 28, height: 28)
                        .background(Color.white.opacity(0.1))
                        .foregroundStyle(.white.opacity(0.88))
                        .clipShape(Circle())
                }
                .buttonStyle(.plain)
                .accessibilityLabel("camera.pose.action.close_picker")
            }

            Text("camera.pose.selector.note")
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.68))
                .fixedSize(horizontal: false, vertical: true)

            ScrollView {
                LazyVGrid(columns: columns, spacing: AppSpacing.sm) {
                    ForEach(guides) { guide in
                        poseCard(for: guide)
                    }
                }
                .padding(.vertical, 2)
            }
            .frame(maxHeight: 276)
            .scrollIndicators(.visible)
        }
        .padding(AppSpacing.md)
        .background(Color.black.opacity(0.78))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.lg)
                .stroke(Color.white.opacity(0.16), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.3), radius: 18, x: 0, y: 10)
    }

    private func poseCard(for guide: PoseGuide) -> some View {
        let isSelected = selectedGuide?.id == guide.id

        return Button {
            onSelect(guide)
        } label: {
            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                HStack(spacing: AppSpacing.xs) {
                    ZStack {
                        RoundedRectangle(cornerRadius: AppCornerRadius.sm)
                            .fill(Color.white.opacity(0.08))
                            .frame(width: 30, height: 34)

                        Image(systemName: "figure.stand")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(isSelected ? AppColors.accent : .white.opacity(0.74))
                    }

                    Text(LocalizedStringKey(guide.category.titleKey))
                        .font(.caption2.weight(.semibold))
                        .foregroundStyle(isSelected ? AppColors.accent : .white.opacity(0.68))
                        .lineLimit(1)
                }

                Text(LocalizedStringKey(guide.titleKey))
                    .font(.caption.weight(.bold))
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.78)

                Text(LocalizedStringKey(guide.shortHintKey))
                    .font(.caption2)
                    .foregroundStyle(.white.opacity(0.66))
                    .lineLimit(2)
                    .minimumScaleFactor(0.78)
                    .fixedSize(horizontal: false, vertical: true)
            }
            .frame(maxWidth: .infinity, minHeight: 112, alignment: .topLeading)
            .padding(AppSpacing.sm)
            .background(isSelected ? AppColors.accent.opacity(0.18) : Color.white.opacity(0.08))
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            .overlay {
                RoundedRectangle(cornerRadius: AppCornerRadius.md)
                    .stroke(isSelected ? AppColors.accent.opacity(0.7) : Color.white.opacity(0.12), lineWidth: 1)
            }
        }
        .buttonStyle(.plain)
        .accessibilityLabel(LocalizedStringKey(guide.titleKey))
    }
}
