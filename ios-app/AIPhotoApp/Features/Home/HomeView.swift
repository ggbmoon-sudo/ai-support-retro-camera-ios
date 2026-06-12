import Foundation
import PhotosUI
import SwiftUI
import UIKit

struct HomeView: View {
    let onSelectCameraTab: () -> Void

    private let inspirationCards = InspirationCard.samples
    private let aiHubCards = AIHubCard.samples
    @State private var pickerItem: PhotosPickerItem?
    @State private var importedPhoto: CapturedPhoto?
    @State private var isImportingPhoto = false
    @State private var importErrorMessage: String?
    @State private var isImportedPhotoFlowPresented = false
    @State private var isFilterLabPresented = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: AppSpacing.xl) {
                hubHeader

                photoImportCard

                aiHubSection

                filterLabCard

                photoEditPlaceholderCard

                futureCloudNotice

                VStack(alignment: .leading, spacing: AppSpacing.md) {
                    Text("home.section.inspiration")
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)

                    ForEach(inspirationCards) { card in
                        inspirationCard(card)
                    }
                }

                Text("home.phase_note")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(AppSpacing.md)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(AppColors.surface)
                    .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
            }
            .padding(AppSpacing.lg)
            .padding(.bottom, AppTabBarMetrics.contentPageFooterSpacer)
        }
        .background(AppColors.background)
        .navigationTitle(Text("tab.home"))
        .onChange(of: pickerItem) { _, _ in
            Task {
                await importSelectedPhoto()
            }
        }
        .sheet(isPresented: $isImportedPhotoFlowPresented) {
            if let importedPhoto {
                ImportedPhotoResultView(
                    photo: importedPhoto,
                    onReturnToCamera: {
                        clearImportedPhotoFlow()
                        onSelectCameraTab()
                    },
                    onClear: {
                        clearImportedPhotoFlow()
                    }
                )
            }
        }
        .sheet(isPresented: $isFilterLabPresented) {
            FilterLabView()
        }
    }

    private var photoImportCard: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            HStack(spacing: AppSpacing.md) {
                hubIcon(systemName: "photo.badge.plus")

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text("home.import.title")
                        .font(AppTypography.title2)
                        .foregroundStyle(AppColors.textPrimary)

                    Text("home.import.description")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            PhotosPicker(
                selection: $pickerItem,
                matching: .images,
                photoLibrary: .shared()
            ) {
                HStack {
                    if isImportingPhoto {
                        ProgressView()
                            .controlSize(.mini)
                    }

                    Label("home.import.action", systemImage: "photo.on.rectangle")
                        .font(AppTypography.bodyEmphasis)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, AppSpacing.md)
                .background(AppColors.accent)
                .foregroundStyle(AppColors.background)
                .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
            }
            .disabled(isImportingPhoto)
            .accessibilityLabel("home.import.action")

            if let importErrorMessage {
                Text(importErrorMessage)
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.error)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var hubHeader: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text("home.badge.ai_hub")
                .font(AppTypography.micro)
                .padding(.vertical, AppSpacing.xs)
                .padding(.horizontal, AppSpacing.sm)
                .background(AppColors.elevatedSurface)
                .foregroundStyle(AppColors.accent)
                .clipShape(Capsule())

            Text("home.title")
                .font(AppTypography.title1)
                .foregroundStyle(AppColors.textPrimary)
                .fixedSize(horizontal: false, vertical: true)

            Text("home.subtitle")
                .font(AppTypography.body)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        }
    }

    private var aiHubSection: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Text("home.section.ai_hub")
                .font(AppTypography.title2)
                .foregroundStyle(AppColors.textPrimary)

            ForEach(aiHubCards) { card in
                aiHubCard(card)
            }
        }
    }

    private var filterLabCard: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            HStack(spacing: AppSpacing.md) {
                hubIcon(systemName: "camera.filters")

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    Text("home.filter_lab.title")
                        .font(AppTypography.bodyEmphasis)
                        .foregroundStyle(AppColors.textPrimary)

                    Text("home.filter_lab.description")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            Text("home.filter_lab.note")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)

            PrimaryButton("home.filter_lab.action", systemImage: "camera.filters") {
                isFilterLabPresented = true
            }
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var photoEditPlaceholderCard: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            HStack(spacing: AppSpacing.md) {
                hubIcon(systemName: "paintbrush.pointed")

                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    HStack(spacing: AppSpacing.sm) {
                        Text("home.photo_edit.title")
                            .font(AppTypography.bodyEmphasis)
                            .foregroundStyle(AppColors.textPrimary)

                        Text("home.photo_edit.badge")
                            .font(AppTypography.micro)
                            .padding(.vertical, 2)
                            .padding(.horizontal, AppSpacing.xs)
                            .background(AppColors.elevatedSurface)
                            .foregroundStyle(AppColors.textSecondary)
                            .clipShape(Capsule())
                    }

                    Text("home.photo_edit.description")
                        .font(AppTypography.caption)
                        .foregroundStyle(AppColors.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }

            PrimaryButton("home.photo_edit.action", systemImage: "clock", isEnabled: false) {}
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private var futureCloudNotice: some View {
        Label {
            Text("home.cloud_notice")
                .font(AppTypography.caption)
                .foregroundStyle(AppColors.textSecondary)
                .fixedSize(horizontal: false, vertical: true)
        } icon: {
            Image(systemName: "lock.shield")
                .foregroundStyle(AppColors.accent)
        }
        .padding(AppSpacing.md)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.elevatedSurface.opacity(0.58))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private func aiHubCard(_ card: AIHubCard) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.md) {
            hubIcon(systemName: card.symbolName)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(LocalizedStringKey(card.titleKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(card.descriptionKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer(minLength: AppSpacing.xs)
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private func inspirationCard(_ card: InspirationCard) -> some View {
        HStack(spacing: AppSpacing.md) {
            hubIcon(systemName: card.symbolName)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                Text(LocalizedStringKey(card.titleKey))
                    .font(AppTypography.bodyEmphasis)
                    .foregroundStyle(AppColors.textPrimary)

                Text(LocalizedStringKey(card.descriptionKey))
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }

            Spacer()
        }
        .padding(AppSpacing.md)
        .background(AppColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.lg))
    }

    private func hubIcon(systemName: String) -> some View {
        Image(systemName: systemName)
            .font(.system(size: 22, weight: .semibold))
            .frame(width: 48, height: 48)
            .background(AppColors.elevatedSurface)
            .foregroundStyle(AppColors.accent)
            .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private func importSelectedPhoto() async {
        guard let pickerItem else { return }

        isImportingPhoto = true
        importErrorMessage = nil
        defer {
            isImportingPhoto = false
            self.pickerItem = nil
        }

        do {
            guard let data = try await pickerItem.loadTransferable(type: Data.self),
                  let image = UIImage(data: data) else {
                throw CameraCaptureError.imageDataUnavailable
            }

            importedPhoto = CapturedPhoto(image: image, source: .photoLibrary)
            isImportedPhotoFlowPresented = true
        } catch {
            importErrorMessage = error.localizedDescription
        }
    }

    private func clearImportedPhotoFlow() {
        isImportedPhotoFlowPresented = false
        importedPhoto = nil
        pickerItem = nil
    }
}

private struct AIHubCard: Identifiable {
    let id: String
    let symbolName: String
    let titleKey: String
    let descriptionKey: String

    static let samples = [
        AIHubCard(
            id: "photo_advisor",
            symbolName: "sparkles",
            titleKey: "home.ai_hub.photo_advisor.title",
            descriptionKey: "home.ai_hub.photo_advisor.description"
        ),
        AIHubCard(
            id: "future_cloud",
            symbolName: "cloud",
            titleKey: "home.ai_hub.future_cloud.title",
            descriptionKey: "home.ai_hub.future_cloud.description"
        )
    ]
}

private struct InspirationCard: Identifiable {
    let id: String
    let symbolName: String
    let titleKey: String
    let descriptionKey: String

    static let samples = [
        InspirationCard(
            id: "today",
            symbolName: "sparkles",
            titleKey: "home.inspiration.today.title",
            descriptionKey: "home.inspiration.today.description"
        ),
        InspirationCard(
            id: "import_ai",
            symbolName: "photo.on.rectangle",
            titleKey: "home.inspiration.import_ai.title",
            descriptionKey: "home.inspiration.import_ai.description"
        ),
        InspirationCard(
            id: "portrait",
            symbolName: "person.crop.rectangle",
            titleKey: "home.inspiration.portrait.title",
            descriptionKey: "home.inspiration.portrait.description"
        ),
        InspirationCard(
            id: "filters",
            symbolName: "camera.filters",
            titleKey: "home.inspiration.filters.title",
            descriptionKey: "home.inspiration.filters.description"
        ),
        InspirationCard(
            id: "future_ai",
            symbolName: "wand.and.stars",
            titleKey: "home.inspiration.future_ai.title",
            descriptionKey: "home.inspiration.future_ai.description"
        )
    ]
}

#Preview {
    NavigationStack {
        HomeView(onSelectCameraTab: {})
    }
}
