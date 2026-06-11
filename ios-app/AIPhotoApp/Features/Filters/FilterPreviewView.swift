import SwiftUI
import UIKit

struct FilterPreviewView: View {
    let image: UIImage
    let sourceTitle: LocalizedStringKey
    let presetTitle: LocalizedStringKey?
    let isRendering: Bool

    var body: some View {
        ZStack {
            Image(uiImage: image)
                .resizable()
                .scaledToFit()
                .frame(maxWidth: .infinity, maxHeight: 560)
                .background(Color.black)

            if isRendering {
                ProgressView()
                    .padding(AppSpacing.md)
                    .background(AppColors.surface.opacity(0.86))
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
        }
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
        .overlay(alignment: .topLeading) {
            Text(sourceTitle)
                .font(AppTypography.caption)
                .lineLimit(1)
                .padding(.horizontal, AppSpacing.sm)
                .padding(.vertical, AppSpacing.xs)
                .background(AppColors.surface.opacity(0.92))
                .foregroundStyle(AppColors.textPrimary)
                .clipShape(Capsule())
                .padding(AppSpacing.sm)
        }
        .overlay(alignment: .bottomTrailing) {
            if let presetTitle {
                Text(presetTitle)
                    .font(AppTypography.caption)
                    .lineLimit(1)
                    .minimumScaleFactor(0.78)
                    .padding(.horizontal, AppSpacing.sm)
                    .padding(.vertical, AppSpacing.xs)
                    .background(AppColors.surface.opacity(0.92))
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(Capsule())
                    .padding(AppSpacing.sm)
            }
        }
    }
}
