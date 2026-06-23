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
    var body: some View {
        Text("DEBUG SAFE BOOT")
            .font(.title)
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color.black)
    }
}
#endif
