import SwiftUI
import UIKit

struct GeneratedFilterResultView: View {
    let recipe: GeneratedFilterRecipe
    let referenceImage: UIImage
    let previewImage: UIImage?
    let intensity: Double
    let isRenderingPreview: Bool
    let applyMessageKey: String?
    let onIntensityChanged: (Double) -> Void
    let onApply: () -> Void
    let onTryAnother: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            HStack(alignment: .top, spacing: AppSpacing.md) {
                Image(systemName: "wand.and.stars")
                    .font(.system(size: 22, weight: .semibold))
                    .frame(width: 48, height: 48)
                    .background(AppColors.elevatedSurface)
                    .foregroundStyle(AppColors.accent)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text("filter_lab.result.title")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)

                    Text(LocalizedStringKey(recipe.nameKey))
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)
                        .fixedSize(horizontal: false, vertical: true)

                    Text(LocalizedStringKey(recipe.descriptionKey))
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            Label(LocalizedStringKey(recipe.source.labelKey), systemImage: "testtube.2")
                .font(AppTypography.micro)
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(Capsule())

            GeneratedFilterPreviewView(
                beforeImage: referenceImage,
                afterImage: previewImage,
                isRendering: isRenderingPreview
            )

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                HStack {
                    Text("filter_lab.intensity")
                        .font(AppTypography.bodyEmphasis)
                        .foregroundStyle(AppColors.textPrimary)
                    Spacer()
                    Text("\(Int(intensity * 100))%")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                }

                Slider(
                    value: Binding(
                        get: { intensity },
                        set: { onIntensityChanged($0) }
                    ),
                    in: 0...1
                )
                .accessibilityLabel("filter_lab.intensity")
            }

            recommendedUses
            parameterSummary
            warnings

            PrimaryButton("filter_lab.action.apply", systemImage: "checkmark.circle") {
                onApply()
            }

            Button {
                onTryAnother()
            } label: {
                Label("filter_lab.action.try_another", systemImage: "arrow.triangle.2.circlepath")
                    .font(AppTypography.bodyEmphasis)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.md)
                    .background(AppColors.elevatedSurface)
                    .foregroundStyle(AppColors.textPrimary)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }

            if let applyMessageKey {
                Text(LocalizedStringKey(applyMessageKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.success)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Text("filter_lab.session_note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var recommendedUses: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text("filter_lab.recommended_use")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 112), spacing: AppSpacing.xs)], alignment: .leading, spacing: AppSpacing.xs) {
                ForEach(recipe.recommendedUseKeys, id: \.self) { key in
                    Text(LocalizedStringKey(key))
                        .font(AppTypography.micro)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.vertical, AppSpacing.xs)
                        .padding(.horizontal, AppSpacing.sm)
                        .background(AppColors.elevatedSurface)
                        .foregroundStyle(AppColors.textSecondary)
                        .clipShape(Capsule())
                }
            }
        }
    }

    private var parameterSummary: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text("filter_lab.parameters")
                .font(AppTypography.bodyEmphasis)
                .foregroundStyle(AppColors.textPrimary)

            Text(parameterSummaryText)
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var warnings: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            ForEach(recipe.warningsKeys, id: \.self) { key in
                Label(LocalizedStringKey(key), systemImage: "info.circle")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var parameterSummaryText: String {
        let params = recipe.parameters
        return String(
            format: NSLocalizedString("filter_lab.parameters.summary", comment: ""),
            params.exposure,
            params.contrast,
            params.saturation,
            params.temperature,
            params.fade,
            params.grain,
            params.vignette
        )
    }
}
