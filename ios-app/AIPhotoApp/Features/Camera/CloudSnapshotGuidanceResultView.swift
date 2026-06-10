import SwiftUI

struct CloudSnapshotGuidanceResultView: View {
    let state: CloudSnapshotGuidanceState
    let retry: () -> Void
    let dismiss: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: iconName)
                    .font(.system(size: 12, weight: .bold))

                Text(LocalizedStringKey(state.titleKey))
                    .font(.caption.weight(.semibold))
                    .lineLimit(1)

                Spacer()
            }
            .foregroundStyle(.white)

            switch state {
            case .preparingSnapshot, .analyzing:
                HStack(spacing: AppSpacing.sm) {
                    ProgressView()
                        .controlSize(.mini)
                        .tint(.white)

                    Text(workingMessageKey)
                        .font(.caption2)
                        .foregroundStyle(.white.opacity(0.76))
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                }
            case .result(let response):
                resultContent(response)
            case .failed(let messageKey), .unavailable(let messageKey):
                recoveryContent(messageKey)
            case .idle, .consentRequired:
                EmptyView()
            }
        }
        .accessibilityElement(children: .contain)
    }

    private func resultContent(_ response: CloudSnapshotGuidanceResponse) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text(LocalizedStringKey(response.summaryKey))
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.82))
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)

            VStack(alignment: .leading, spacing: AppSpacing.xs) {
                ForEach(response.suggestions) { suggestion in
                    Label {
                        Text(LocalizedStringKey(suggestion.messageKey))
                            .font(.caption2)
                            .lineLimit(2)
                            .fixedSize(horizontal: false, vertical: true)
                    } icon: {
                        Image(systemName: "sparkle")
                            .font(.system(size: 10, weight: .bold))
                    }
                }
            }
            .foregroundStyle(.white.opacity(0.9))

            HStack(spacing: AppSpacing.sm) {
                Text(LocalizedStringKey(response.sourceKey))
                    .font(.caption2.weight(.semibold))
                    .foregroundStyle(AppColors.accent)

                Spacer()

                Button("camera.cloud_snapshot.action.done") {
                    dismiss()
                }
                .buttonStyle(.plain)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.white.opacity(0.78))
            }
        }
    }

    private func recoveryContent(_ messageKey: String) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            Text(LocalizedStringKey(messageKey))
                .font(.caption2)
                .foregroundStyle(.white.opacity(0.78))
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: AppSpacing.sm) {
                Button("camera.cloud_snapshot.action.retry") {
                    retry()
                }
                .font(.caption.weight(.semibold))
                .buttonStyle(.plain)
                .foregroundStyle(AppColors.accent)

                Button("camera.cloud_snapshot.action.dismiss") {
                    dismiss()
                }
                .font(.caption.weight(.semibold))
                .buttonStyle(.plain)
                .foregroundStyle(.white.opacity(0.72))
            }
        }
    }

    private var iconName: String {
        switch state {
        case .preparingSnapshot, .analyzing:
            return "sparkles"
        case .result:
            return "checkmark.circle"
        case .failed:
            return "exclamationmark.triangle"
        case .unavailable:
            return "wifi.slash"
        case .idle, .consentRequired:
            return "sparkles"
        }
    }

    private var workingMessageKey: LocalizedStringKey {
        switch state {
        case .preparingSnapshot:
            return "camera.cloud_snapshot.state.preparing_note"
        default:
            return "camera.cloud_snapshot.state.analyzing_note"
        }
    }
}
