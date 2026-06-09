import SwiftUI

struct HistoryEmptyStateView: View {
    var body: some View {
        EmptyStateView(
            systemImage: "clock.arrow.circlepath",
            title: "history.session.empty.title",
            message: "history.session.empty.message"
        )
    }
}

#Preview {
    HistoryEmptyStateView()
        .padding()
        .background(AppColors.background)
}
