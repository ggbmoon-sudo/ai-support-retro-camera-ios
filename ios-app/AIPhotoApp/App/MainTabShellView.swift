import SwiftUI

struct MainTabShellView: View {
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
                SettingsView()
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
