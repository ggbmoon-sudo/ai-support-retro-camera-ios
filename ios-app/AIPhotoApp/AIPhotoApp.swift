import SwiftUI

@main
struct AIPhotoApp: App {
    var body: some Scene {
        WindowGroup {
            #if DEBUG
            DebugSafeRootView()
            #else
            AppRootView()
            #endif
        }
    }
}

#if DEBUG
private struct DebugSafeRootView: View {
    @State private var isFilterLabPresented = false

    var body: some View {
        NavigationStack {
            VStack(spacing: AppSpacing.lg) {
                Text("AIPhotoApp")
                    .font(AppTypography.title1)
                    .foregroundStyle(AppColors.textPrimary)

                Text("DEBUG safe boot")
                    .font(AppTypography.caption)
                    .foregroundStyle(AppColors.textSecondary)

                PrimaryButton("home.filter_lab.action", systemImage: "camera.filters") {
                    isFilterLabPresented = true
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(AppSpacing.lg)
            .background(AppColors.background)
            .navigationTitle(Text("tab.home"))
        }
        .sheet(isPresented: $isFilterLabPresented) {
            FilterLabView()
        }
    }
}
#endif
