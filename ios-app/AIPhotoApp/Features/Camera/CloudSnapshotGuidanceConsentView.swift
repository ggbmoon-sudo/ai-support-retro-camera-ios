import SwiftUI

struct CloudSnapshotGuidanceConsentView: View {
    let startAnalysis: () -> Void
    let simulateFailure: () -> Void
    let simulateUnavailable: () -> Void
    let cancel: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text("camera.cloud_snapshot.consent.title")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.white)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                consentLine("camera.cloud_snapshot.consent.future_cloud")
                consentLine("camera.cloud_snapshot.consent.mock_only")
                consentLine("camera.cloud_snapshot.consent.no_background")
                consentLine("camera.cloud_snapshot.consent.no_streaming")
                consentLine("camera.cloud_snapshot.consent.no_save")
                consentLine("camera.cloud_snapshot.consent.no_api_key")
            }

            HStack(spacing: AppSpacing.sm) {
                Button {
                    startAnalysis()
                } label: {
                    Label("camera.cloud_snapshot.action.run_mock", systemImage: "sparkles")
                        .font(.caption.weight(.semibold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.75)
                }
                .buttonStyle(.borderedProminent)
                .tint(AppColors.accent)

                Button("camera.cloud_snapshot.action.cancel") {
                    cancel()
                }
                .font(.caption.weight(.semibold))
                .buttonStyle(.plain)
                .foregroundStyle(.white.opacity(0.78))
            }

            HStack(spacing: AppSpacing.sm) {
                Button("camera.cloud_snapshot.action.mock_failure") {
                    simulateFailure()
                }
                .buttonStyle(.plain)

                Button("camera.cloud_snapshot.action.mock_unavailable") {
                    simulateUnavailable()
                }
                .buttonStyle(.plain)
            }
            .font(.caption2.weight(.semibold))
            .foregroundStyle(.white.opacity(0.62))
        }
        .accessibilityElement(children: .contain)
    }

    private func consentLine(_ key: LocalizedStringKey) -> some View {
        HStack(alignment: .top, spacing: AppSpacing.xs) {
            Image(systemName: "checkmark.circle")
                .font(.system(size: 10, weight: .semibold))
                .padding(.top, 2)

            Text(key)
                .font(.caption2)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)
        }
        .foregroundStyle(.white.opacity(0.76))
    }
}
