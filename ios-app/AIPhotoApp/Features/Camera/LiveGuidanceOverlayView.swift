import SwiftUI

struct LiveGuidanceOverlayView: View {
    let state: LiveGuidanceMockState
    let stateTitleKey: String
    let suggestions: [LiveGuidanceSuggestion]
    let actionTitleKey: String
    let isActionEnabled: Bool
    let performAction: () -> Void

    private var showsSuggestions: Bool {
        state != .off && state != .paused && !suggestions.isEmpty
    }

    var body: some View {
        VStack(alignment: .leading, spacing: AppSpacing.sm) {
            HStack(spacing: AppSpacing.xs) {
                Image(systemName: stateIconName)
                    .font(.system(size: 12, weight: .bold))

                Text(LocalizedStringKey(stateTitleKey))
                    .font(.caption2.weight(.semibold))
                    .lineLimit(1)

                Spacer(minLength: AppSpacing.sm)

                Button {
                    performAction()
                } label: {
                    Text(LocalizedStringKey(actionTitleKey))
                        .font(.caption2.weight(.semibold))
                        .lineLimit(1)
                        .minimumScaleFactor(0.8)
                }
                .buttonStyle(.plain)
                .disabled(!isActionEnabled)
                .opacity(isActionEnabled ? 1 : 0.42)
                .accessibilityLabel(LocalizedStringKey(actionTitleKey))
            }

            if state == .scanning {
                HStack(spacing: AppSpacing.sm) {
                    ProgressView()
                        .controlSize(.mini)
                        .tint(.white)

                    Text("camera.guidance.scanning_note")
                        .font(.caption2)
                        .lineLimit(2)
                        .fixedSize(horizontal: false, vertical: true)
                }
            } else if showsSuggestions {
                VStack(alignment: .leading, spacing: AppSpacing.xs) {
                    ForEach(suggestions) { suggestion in
                        Label {
                            Text(LocalizedStringKey(suggestion.messageKey))
                                .font(.caption2)
                                .lineLimit(2)
                                .fixedSize(horizontal: false, vertical: true)
                        } icon: {
                            Image(systemName: suggestion.category.systemImageName)
                                .font(.system(size: 10, weight: .bold))
                        }
                    }
                }
            }
        }
        .padding(.vertical, AppSpacing.sm)
        .padding(.horizontal, AppSpacing.md)
        .foregroundStyle(.white)
        .background(Color.black.opacity(0.56))
        .clipShape(RoundedRectangle(cornerRadius: AppCornerRadius.md))
        .overlay {
            RoundedRectangle(cornerRadius: AppCornerRadius.md)
                .stroke(.white.opacity(0.18), lineWidth: 1)
        }
        .shadow(color: .black.opacity(0.2), radius: 10, x: 0, y: 5)
        .accessibilityElement(children: .contain)
    }

    private var stateIconName: String {
        switch state {
        case .off:
            return "lightbulb.slash"
        case .idle:
            return "lightbulb"
        case .scanning:
            return "scope"
        case .suggestionAvailable:
            return "sparkles"
        case .paused:
            return "pause.circle"
        }
    }
}

#Preview {
    LiveGuidanceOverlayView(
        state: .suggestionAvailable,
        stateTitleKey: LiveGuidanceMockState.suggestionAvailable.titleKey,
        suggestions: [
            LiveGuidanceSuggestion(
                id: "center_subject",
                messageKey: "camera.guidance.suggestion.center_subject",
                category: .composition
            )
        ],
        actionTitleKey: "camera.guidance.action.next_hint",
        isActionEnabled: true,
        performAction: {}
    )
    .padding()
    .background(Color.black)
}
