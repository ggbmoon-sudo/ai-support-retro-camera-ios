import SwiftUI

/// Consent is specific to the bounded live-like composition session. It must not
/// reuse one-shot copy because the app may send more than one independent JPEG.
struct HybridCompositionConsentView: View {
    let onAccept: (CloudAIConsent) -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.md) {
            Label("camera.hybrid_compose.consent.title", systemImage: "viewfinder.circle")
                .font(.headline)

            Text("camera.hybrid_compose.consent.message")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            Text("camera.hybrid_compose.consent.footer")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: AppSpacing.sm) {
                Button("camera.hybrid_compose.consent.cancel", action: onCancel)
                    .buttonStyle(.bordered)

                Button("camera.hybrid_compose.consent.accept") {
                    onAccept(.acceptedLiveComposition)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .accessibilityElement(children: .contain)
    }
}
