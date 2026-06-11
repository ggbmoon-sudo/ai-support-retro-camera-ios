import SwiftUI

struct MainTabShellView: View {
    private enum Tab: Hashable, CaseIterable {
        case camera
        case home
        case history
        case settings

        var titleKey: LocalizedStringKey {
            switch self {
            case .camera:
                return "camera.title"
            case .home:
                return "tab.home"
            case .history:
                return "tab.history"
            case .settings:
                return "tab.settings"
            }
        }

        var systemImage: String {
            switch self {
            case .camera:
                return "camera.viewfinder"
            case .home:
                return "sparkles"
            case .history:
                return "photo.stack"
            case .settings:
                return "gearshape"
            }
        }
    }

    @ObservedObject var authViewModel: AuthViewModel
    @State private var selectedTab: Tab = .camera

    init(authViewModel: AuthViewModel) {
        self.authViewModel = authViewModel
    }

    var body: some View {
        GeometryReader { proxy in
            ZStack {
                if selectedTab == .camera {
                    selectedContent
                        .frame(width: proxy.size.width, height: proxy.size.height)
                } else {
                    selectedContent
                        .frame(width: proxy.size.width, height: proxy.size.height)

                    ordinaryFloatingTabOverlay(safeBottom: proxy.safeAreaInsets.bottom)
                        .frame(width: proxy.size.width, height: proxy.size.height)
                        .zIndex(20)
                }
            }
        }
        .ignoresSafeArea(.all, edges: selectedTab == .camera ? Edge.Set.all : Edge.Set())
        .statusBarHidden(selectedTab == .camera)
        .tint(AppColors.accent)
    }

    @ViewBuilder
    private var selectedContent: some View {
        switch selectedTab {
        case .camera:
            CameraView(showsCloseButton: false) { destination in
                switch destination {
                case .inspiration:
                    selectedTab = .home
                case .history:
                    selectedTab = .history
                case .settings:
                    selectedTab = .settings
                }
            }
        case .home:
            NavigationStack {
                HomeView(
                    onSelectCameraTab: {
                        selectedTab = .camera
                    }
                )
            }
        case .history:
            NavigationStack {
                HistoryView()
            }
        case .settings:
            NavigationStack {
                SettingsView(authViewModel: authViewModel)
            }
        }
    }

    private func ordinaryFloatingTabOverlay(safeBottom: CGFloat) -> some View {
        VStack(spacing: 0) {
            Spacer(minLength: 0)

            floatingTabBar
                .padding(.horizontal, AppSpacing.md)
                .padding(.bottom, AppTabBarMetrics.ordinaryTabBarBottomOffset(for: safeBottom))
        }
        .background(alignment: .bottom) {
            LinearGradient(
                colors: [
                    AppColors.background.opacity(0),
                    AppColors.background.opacity(0.82),
                    AppColors.background.opacity(0.96)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: AppTabBarMetrics.ordinaryContentBottomPadding(for: safeBottom))
            .allowsHitTesting(false)
        }
        .ignoresSafeArea(.keyboard, edges: .bottom)
    }

    private var floatingTabBar: some View {
        HStack(spacing: AppSpacing.xs) {
            ForEach(Tab.allCases, id: \.self) { tab in
                Button {
                    selectedTab = tab
                } label: {
                    VStack(spacing: 3) {
                        Image(systemName: tab.systemImage)
                            .font(.system(size: 16, weight: .semibold))

                        Text(tab.titleKey)
                            .font(.caption2.weight(.semibold))
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, AppSpacing.xs)
                    .foregroundStyle(selectedTab == tab ? AppColors.accent : .white.opacity(0.78))
                    .background(selectedTab == tab ? AppColors.accent.opacity(0.16) : Color.clear)
                    .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .accessibilityLabel(tab.titleKey)
            }
        }
        .padding(6)
        .background(Color.black.opacity(0.72))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(.white.opacity(0.14), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.28), radius: 18, x: 0, y: 8)
    }
}

#Preview {
    MainTabShellView(authViewModel: AuthViewModel(service: MockAuthService()))
        .environmentObject(SessionHistoryStore())
}
