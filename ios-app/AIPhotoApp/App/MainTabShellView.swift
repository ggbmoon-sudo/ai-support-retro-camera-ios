import SwiftUI

struct MainTabShellView: View {
    private enum Tab: Hashable {
        case camera
        case home
        case history
        case settings
    }

    @ObservedObject var authViewModel: AuthViewModel
    @State private var selectedTab: Tab = .camera

    init(authViewModel: AuthViewModel) {
        self.authViewModel = authViewModel
    }

    var body: some View {
        TabView(selection: $selectedTab) {
            CameraView(showsCloseButton: false)
                .tabItem {
                    Label("camera.title", systemImage: "camera.viewfinder")
                }
                .tag(Tab.camera)

            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label("tab.home", systemImage: "sparkles")
            }
            .tag(Tab.home)

            NavigationStack {
                HistoryView()
            }
            .tabItem {
                Label("tab.history", systemImage: "photo.stack")
            }
            .tag(Tab.history)

            NavigationStack {
                SettingsView(authViewModel: authViewModel)
            }
            .tabItem {
                Label("tab.settings", systemImage: "gearshape")
            }
            .tag(Tab.settings)
        }
        .tint(AppColors.accent)
    }
}

#Preview {
    MainTabShellView(authViewModel: AuthViewModel(service: MockAuthService()))
        .environmentObject(SessionHistoryStore())
}
