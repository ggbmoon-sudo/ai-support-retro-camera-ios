import SwiftUI
import UIKit

struct GeneratedFilterPreviewView: View {
    let beforeImage: UIImage
    let afterImage: UIImage?
    let isRendering: Bool
    let isSaving: Bool
    let onSaveAfterImage: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            ViewThatFits(in: .horizontal) {
                HStack(alignment: .top, spacing: AppSpacing.sm) {
                    previewColumn(titleKey: "filter_lab.preview.before", image: beforeImage)
                    afterPreview
                }

                VStack(alignment: .leading, spacing: AppSpacing.sm) {
                    previewColumn(titleKey: "filter_lab.preview.before", image: beforeImage)
                    afterPreview
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Text("filter_lab.preview.mock_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            Label("filter_lab.preview.save_hint", systemImage: "hand.tap")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.accent)
                .fixedSize(horizontal: false, vertical: true)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var afterPreview: some View {
        previewColumn(titleKey: "filter_lab.preview.after", image: afterImage ?? beforeImage)
            .contentShape(Rectangle())
            .onLongPressGesture(minimumDuration: 0.6, maximumDistance: 20) {
                guard canSaveAfterImage else { return }
                onSaveAfterImage()
            }
            .accessibilityAction(named: Text("filter_lab.action.save_filtered")) {
                guard canSaveAfterImage else { return }
                onSaveAfterImage()
            }
            .overlay(alignment: .center) {
                if isRendering || isSaving {
                    ProgressView()
                        .padding(AppSpacing.sm)
                        .background(.ultraThinMaterial)
                        .clipShape(Capsule())
                }
            }
    }

    private var canSaveAfterImage: Bool {
        afterImage != nil && !isRendering && !isSaving
    }

    private func previewColumn(titleKey: LocalizedStringKey, image: UIImage) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text(titleKey)
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)

            Image(uiImage: image)
                .resizable()
                .scaledToFit()
                .frame(maxWidth: .infinity, maxHeight: 260)
                .clipped()
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
                .background(Color.black)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .frame(maxWidth: .infinity, minHeight: 0, alignment: .topLeading)
        .layoutPriority(1)
    }
}
