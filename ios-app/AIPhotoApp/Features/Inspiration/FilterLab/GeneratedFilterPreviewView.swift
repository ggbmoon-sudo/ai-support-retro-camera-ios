import SwiftUI
import UIKit

struct GeneratedFilterPreviewView: View {
    let beforeImage: UIImage
    let afterImage: UIImage?
    let isRendering: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(spacing: AppSpacing.sm) {
                previewColumn(titleKey: "filter_lab.preview.before", image: beforeImage)
                previewColumn(titleKey: "filter_lab.preview.after", image: afterImage ?? beforeImage)
                    .overlay(alignment: .center) {
                        if isRendering {
                            ProgressView()
                                .padding(AppSpacing.sm)
                                .background(.ultraThinMaterial)
                                .clipShape(Capsule())
                        }
                    }
            }

            Text("filter_lab.preview.mock_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private func previewColumn(titleKey: LocalizedStringKey, image: UIImage) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text(titleKey)
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)

            Image(uiImage: image)
                .resizable()
                .scaledToFill()
                .frame(maxWidth: .infinity)
                .aspectRatio(0.78, contentMode: .fit)
                .clipped()
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
    }
}
