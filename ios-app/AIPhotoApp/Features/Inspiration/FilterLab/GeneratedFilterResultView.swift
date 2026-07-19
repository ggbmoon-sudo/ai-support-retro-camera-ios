import SwiftUI
import UIKit

struct GeneratedFilterResultView: View {
    let recipe: GeneratedFilterRecipe
    let styleReferenceImage: UIImage
    let applyTargetImage: UIImage
    let previewImage: UIImage?
    let intensity: Double
    let isRenderingPreview: Bool
    let applyMessageKey: String?
    let isSavingFilteredPreview: Bool
    let exportMessageKey: String?
    let exportMessageIsError: Bool
    let onIntensityChanged: (Double) -> Void
    let onSaveFilteredPreview: () -> Void
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
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            Label(LocalizedStringKey(recipe.source.labelKey), systemImage: "testtube.2")
                .font(AppTypography.micro)
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(Capsule())

            styleReferencePreview

            GeneratedFilterPreviewView(
                beforeImage: applyTargetImage,
                afterImage: previewImage,
                isRendering: isRenderingPreview,
                isSaving: isSavingFilteredPreview,
                onSaveAfterImage: onSaveFilteredPreview
            )

            if let exportMessageKey {
                Label(
                    LocalizedStringKey(exportMessageKey),
                    systemImage: isSavingFilteredPreview
                        ? "arrow.down.circle"
                        : (exportMessageIsError ? "exclamationmark.triangle" : "checkmark.circle")
                )
                .font(AppTypography.caption)
                .foregroundStyle(exportMessageIsError ? AppColors.error : AppColors.success)
                .fixedSize(horizontal: false, vertical: true)
            }

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
                .disabled(isSavingFilteredPreview)
            }
            .frame(maxWidth: .infinity, alignment: .leading)

            recommendedUses
            parameterSummary
            warnings

            PrimaryButton("filter_lab.action.apply", systemImage: "checkmark.circle") {
                onApply()
            }
            .disabled(isSavingFilteredPreview)

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
            .disabled(isSavingFilteredPreview)

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
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var styleReferencePreview: some View {
        VStack(alignment: .leading, spacing: AppSpacing.xs) {
            Text("filter_lab.preview.style_reference")
                .font(AppTypography.micro)
                .foregroundStyle(AppColors.textSecondary)

            Image(uiImage: styleReferenceImage)
                .resizable()
                .scaledToFit()
                .frame(maxWidth: .infinity, maxHeight: 220)
                .clipped()
                .background(Color.black)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
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
                        .lineLimit(2)
                        .minimumScaleFactor(0.8)
                        .frame(maxWidth: .infinity, minHeight: 28, alignment: .leading)
                        .padding(.vertical, AppSpacing.xs)
                        .padding(.horizontal, AppSpacing.sm)
                        .background(AppColors.elevatedSurface)
                        .foregroundStyle(AppColors.textSecondary)
                        .clipShape(Capsule())
                }
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
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
        .frame(maxWidth: .infinity, alignment: .leading)
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
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private var parameterSummaryText: String {
        let params = recipe.parameters
        return String(
            format: NSLocalizedString("filter_lab.parameters.summary", comment: ""),
            params.exposure,
            params.contrast,
            params.saturation,
            params.temperature,
            params.tint,
            params.fade,
            params.shadowLift,
            params.highlightRollOff,
            params.bloom,
            params.grain,
            params.dust,
            params.vignette
        )
    }
}
