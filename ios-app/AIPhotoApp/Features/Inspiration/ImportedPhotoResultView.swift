import SwiftUI
import UIKit

struct ImportedPhotoResultView: View {
    let photo: CapturedPhoto
    let onReturnToCamera: () -> Void
    let onClear: () -> Void

    @State private var selectedPreset = FilterPresetCatalog.original
    @State private var filteredPreviewImage: UIImage?
    @State private var isFiltering = false
    @State private var filterErrorMessage: String?
    @State private var activePanel: FloatingPhotoActionPanel?

    private let presets = FilterPresetCatalog.all
    private let filterPipeline = FilterPipeline()
    @State private var activeFilterRenderID: UUID?

    var body: some View {
        ZStack(alignment: .bottom) {
            Color.black.ignoresSafeArea()

            ScrollView {
                VStack(spacing: AppSpacing.md) {
                    FilteredPhotoPreview(
                        photo: photo,
                        previewImage: filteredPreviewImage ?? photo.image,
                        selectedPreset: selectedPreset,
                        isRendering: isFiltering
                    )

                    if let filterErrorMessage {
                        errorMessage(filterErrorMessage)
                    }
                }
                .padding(.horizontal, AppSpacing.md)
                .padding(.top, AppSpacing.sm)
                .padding(.bottom, activePanel == nil ? 112 : 160)
            }
            .scrollIndicators(.visible)

            floatingLayer
                .zIndex(6)
        }
        .safeAreaInset(edge: .top, spacing: 0) {
            actionBar
                .padding(.horizontal, AppSpacing.md)
                .padding(.top, AppSpacing.xs)
                .padding(.bottom, AppSpacing.sm)
                .background(Color.black.opacity(0.92))
        }
    }

    private var actionBar: some View {
        HStack(spacing: AppSpacing.sm) {
            Button {
                activePanel = nil
                onReturnToCamera()
            } label: {
                Label("camera.action.back_to_camera", systemImage: "camera.viewfinder")
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(Color.white.opacity(0.12))
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.action.back_to_camera_preview")

            Button {
                activePanel = nil
                onClear()
            } label: {
                Label("camera.action.clear", systemImage: "xmark")
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)
                    .minimumScaleFactor(0.72)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.sm)
                    .padding(.horizontal, AppSpacing.sm)
                    .background(Color.white.opacity(0.08))
                    .foregroundStyle(.white.opacity(0.9))
                    .clipShape(Capsule())
            }
            .buttonStyle(.plain)
            .accessibilityLabel("camera.action.clear_selected_photo")
        }
        .padding(AppSpacing.xs)
        .background(Color(red: 0.05, green: 0.05, blue: 0.045).opacity(0.96))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(Color.white.opacity(0.14), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.22), radius: 10, x: 0, y: 5)
    }

    private var floatingLayer: some View {
        ZStack(alignment: .bottom) {
            if activePanel != nil {
                Color.black.opacity(0.001)
                    .ignoresSafeArea()
                    .onTapGesture {
                        activePanel = nil
                    }
            }

            VStack(spacing: AppSpacing.sm) {
                if activePanel == .advisor {
                    FloatingPhotoAdvisorSheet(
                        photoId: advisorPhotoId,
                        source: .imported,
                        selectedPreset: selectedPreset,
                        presets: presets,
                        imageSignal: imageSignal,
                        captureContext: photo.captureContext,
                        debugSourceImage: photo.image,
                        isRendering: isFiltering,
                        onApplyFilter: { preset in
                            selectFilterPreset(preset)
                        },
                        onClose: {
                            activePanel = nil
                        }
                    )
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                if activePanel == .filters {
                    FloatingFilterGridView(
                        presets: presets,
                        selectedPreset: selectedPreset,
                        recommendedFilters: floatingRecommendedFilters,
                        isRendering: isFiltering,
                        onSelectPreset: { preset in
                            selectFilterPreset(preset)
                            activePanel = nil
                        },
                        onClose: {
                            activePanel = nil
                        }
                    )
                    .transition(.move(edge: .bottom).combined(with: .opacity))
                }

                FloatingPhotoActionTrayView(
                    selectedPreset: selectedPreset,
                    activePanel: activePanel,
                    isRendering: isFiltering,
                    showsAdvisorButton: true,
                    onToggleAdvisor: {
                        togglePanel(.advisor)
                    },
                    onToggleFilters: {
                        togglePanel(.filters)
                    }
                )
            }
            .padding(.horizontal, AppSpacing.md)
            .padding(.bottom, AppSpacing.md)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottom)
        .animation(.snappy(duration: 0.2), value: activePanel)
    }

    private var advisorPhotoId: String {
        "advisor-\(photo.id.uuidString.lowercased())"
    }

    private var floatingRecommendedFilters: [PhotoAdvisorFilterRecommendation] {
        let input = PhotoAdvisorInput(
            photoId: advisorPhotoId,
            source: .imported,
            selectedFilterId: selectedPreset.id,
            imageSignal: imageSignal,
            captureContext: photo.captureContext
        )
        let result = PhotoAdvisorHeuristicResolver.result(for: input, allowedFilterIds: Set(presets.map(\.id)))

        return result.recommendedFilters
    }

    private var imageSignal: PhotoAdvisorImageSignal {
        PhotoAdvisorImageSignal(size: photo.image.size)
    }

    private func togglePanel(_ panel: FloatingPhotoActionPanel) {
        activePanel = activePanel == panel ? nil : panel
    }

    private func errorMessage(_ message: String) -> some View {
        Label {
            Text(message)
                .fixedSize(horizontal: false, vertical: true)
        } icon: {
            Image(systemName: "exclamationmark.triangle")
        }
        .font(AppTypography.caption)
        .foregroundStyle(AppColors.error)
        .padding(AppSpacing.sm)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(AppColors.surface.opacity(0.76))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
    }

    private func selectFilterPreset(_ preset: FilterPreset) {
        selectedPreset = preset
        filterErrorMessage = nil

        guard !preset.isOriginal else {
            filteredPreviewImage = nil
            isFiltering = false
            activeFilterRenderID = nil
            return
        }

        let renderID = UUID()
        activeFilterRenderID = renderID
        isFiltering = true

        Task {
            do {
                let image = try await filterPipeline.render(image: photo.image, preset: preset)
                guard activeFilterRenderID == renderID, selectedPreset.id == preset.id else { return }
                filteredPreviewImage = image
                isFiltering = false
            } catch {
                guard activeFilterRenderID == renderID else { return }
                filteredPreviewImage = nil
                filterErrorMessage = error.localizedDescription
                isFiltering = false
            }
        }
    }
}

#Preview {
    ImportedPhotoResultView(
        photo: CapturedPhoto(image: UIImage(systemName: "photo") ?? UIImage(), source: .photoLibrary),
        onReturnToCamera: {},
        onClear: {}
    )
}
