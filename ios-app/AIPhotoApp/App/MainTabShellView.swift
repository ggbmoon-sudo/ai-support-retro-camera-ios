import SwiftUI

struct MainTabShellView: View {
    let authUser: AuthUser?
    let onSignOut: () -> Void

    init(authUser: AuthUser? = nil, onSignOut: @escaping () -> Void = {}) {
        self.authUser = authUser
        self.onSignOut = onSignOut
    }

    var body: some View {
        TabView {
            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label("tab.home", systemImage: "camera.aperture")
            }

            NavigationStack {
                HistoryView()
            }
            .tabItem {
                Label("tab.history", systemImage: "photo.stack")
            }

            NavigationStack {
                SettingsView(authUser: authUser, onSignOut: onSignOut)
            }
            .tabItem {
                Label("tab.settings", systemImage: "gearshape")
            }
        }
        .tint(AppColors.accent)
    }
}

#Preview {
    MainTabShellView()
}
