import SwiftUI

struct HybridCompositionPlannerView: View {
    let state: HybridCompositionPlannerState
    let canAnalyze: Bool
    let acceptConsent: (CloudAIConsent) -> Void
    let retry: () -> Void
    let dismiss: () -> Void

    var body: some View {
        NavigationStack {
            Group {
                switch state {
                case .consentRequired:
                    HybridCompositionConsentView(
                        onAccept: acceptConsent,
                        onCancel: dismiss
                    )
                case .preparingSnapshot:
                    workingContent(
                        titleKey: "camera.hybrid_compose.preparing.title",
                        detailKey: "camera.hybrid_compose.preparing.detail"
                    )
                case .analyzing:
                    workingContent(
                        titleKey: "camera.hybrid_compose.analyzing.title",
                        detailKey: "camera.hybrid_compose.analyzing.detail"
                    )
                case .applied(let plan):
                    appliedContent(plan)
                case .failed(let messageKey):
                    failedContent(messageKey)
                case .idle:
                    EmptyView()
                }
            }
            .padding(AppSpacing.lg)
            .navigationTitle("camera.hybrid_compose.title")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("camera.hybrid_compose.done", action: dismiss)
                }
            }
        }
        .presentationDetents([.medium])
    }

    private func workingContent(
        titleKey: LocalizedStringKey,
        detailKey: LocalizedStringKey
    ) -> some View {
        VStack(spacing: AppSpacing.md) {
            ProgressView()
                .controlSize(.large)

            Text(titleKey)
                .font(.headline)

            Text(detailKey)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func appliedContent(_ plan: HybridCompositionPlan) -> some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Label("camera.hybrid_compose.applied.title", systemImage: "checkmark.circle.fill")
                .font(.headline)
                .foregroundStyle(.green)

            Text(LocalizedStringKey(plan.localPolicy.titleKey))
                .font(.title3.weight(.semibold))

            Text(LocalizedStringKey(plan.reasonCode.titleKey))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            HStack(spacing: AppSpacing.sm) {
                planChip(
                    key: plan.focalSuggestion.titleKey,
                    systemImage: "camera.aperture"
                )
                planChip(
                    key: plan.distanceAction.titleKey,
                    systemImage: "arrow.left.and.right"
                )
            }

            Text("camera.hybrid_compose.applied.local_note")
                .font(.footnote)
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    }

    private func failedContent(_ messageKey: String) -> some View {
        VStack(spacing: AppSpacing.md) {
            Image(systemName: "wifi.exclamationmark")
                .font(.system(size: 30, weight: .semibold))

            Text(LocalizedStringKey(messageKey))
                .multilineTextAlignment(.center)

            Button("camera.hybrid_compose.retry", action: retry)
                .buttonStyle(.borderedProminent)
                .disabled(!canAnalyze)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }

    private func planChip(key: String, systemImage: String) -> some View {
        Label(LocalizedStringKey(key), systemImage: systemImage)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, AppSpacing.sm)
            .padding(.vertical, AppSpacing.xs)
            .background(Color.secondary.opacity(0.12), in: Capsule())
    }
}
