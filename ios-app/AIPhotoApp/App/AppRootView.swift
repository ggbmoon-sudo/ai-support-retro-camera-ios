import SwiftUI

struct AppRootView: View {
    @StateObject private var authViewModel = AuthViewModel(service: MockAuthService())
    @StateObject private var sessionHistoryStore: SessionHistoryStore = MockSessionHistoryStore()

    var body: some View {
        MainTabShellView(authViewModel: authViewModel)
        .environmentObject(sessionHistoryStore)
        .task {
            await authViewModel.refreshSession()
        }
    }
}

#Preview {
    AppRootView()
}
