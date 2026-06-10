import Foundation

@MainActor
final class LiveGuidanceStabilityController {
    private let maxVisibleSuggestions = 2
    private let repeatCooldown: TimeInterval = 4
    private let holdDuration: TimeInterval = 2
    private let confirmationCount = 2

    private var stableSuggestions: [LiveGuidanceSuggestion] = []
    private var stableUpdatedAt = Date.distantPast
    private var lastShownAt: [String: Date] = [:]
    private var pendingSuggestionIDs: [String] = []
    private var pendingCount = 0

    func reset() {
        stableSuggestions = []
        stableUpdatedAt = .distantPast
        lastShownAt = [:]
        pendingSuggestionIDs = []
        pendingCount = 0
    }

    func suggestions(
        from candidates: [LiveGuidanceSuggestion],
        now: Date = Date()
    ) -> [LiveGuidanceSuggestion] {
        let rankedCandidates = ranked(candidates)
        guard !rankedCandidates.isEmpty else {
            return heldSuggestions(now: now)
        }

        let eligibleCandidates = rankedCandidates.filter { suggestion in
            stableSuggestions.contains(suggestion) || !isCoolingDown(suggestion, now: now)
        }
        guard !eligibleCandidates.isEmpty else {
            return heldSuggestions(now: now)
        }

        let nextSuggestions = Array(eligibleCandidates.prefix(maxVisibleSuggestions))
        let nextIDs = nextSuggestions.map(\.id)
        let stableIDs = stableSuggestions.map(\.id)

        guard nextIDs != stableIDs else {
            stableUpdatedAt = now
            return stableSuggestions
        }

        if stableSuggestions.isEmpty || shouldReplaceImmediately(with: nextSuggestions) {
            return accept(nextSuggestions, now: now)
        }

        if pendingSuggestionIDs == nextIDs {
            pendingCount += 1
        } else {
            pendingSuggestionIDs = nextIDs
            pendingCount = 1
        }

        guard pendingCount >= confirmationCount else {
            return heldSuggestions(now: now)
        }

        return accept(nextSuggestions, now: now)
    }

    private func ranked(_ suggestions: [LiveGuidanceSuggestion]) -> [LiveGuidanceSuggestion] {
        suggestions
            .reduce(into: [LiveGuidanceSuggestion]()) { result, suggestion in
                guard !result.contains(where: { $0.id == suggestion.id }) else { return }
                result.append(suggestion)
            }
            .sorted { lhs, rhs in
                if lhs.guidancePriority != rhs.guidancePriority {
                    return lhs.guidancePriority < rhs.guidancePriority
                }

                return lhs.id < rhs.id
            }
    }

    private func heldSuggestions(now: Date) -> [LiveGuidanceSuggestion] {
        guard !stableSuggestions.isEmpty,
              now.timeIntervalSince(stableUpdatedAt) <= holdDuration else {
            return []
        }

        return stableSuggestions
    }

    private func isCoolingDown(_ suggestion: LiveGuidanceSuggestion, now: Date) -> Bool {
        guard let lastShown = lastShownAt[suggestion.id] else { return false }
        return now.timeIntervalSince(lastShown) < repeatCooldown
    }

    private func shouldReplaceImmediately(with nextSuggestions: [LiveGuidanceSuggestion]) -> Bool {
        guard let nextPriority = nextSuggestions.map(\.guidancePriority).min(),
              let stablePriority = stableSuggestions.map(\.guidancePriority).min() else {
            return false
        }

        return nextPriority < stablePriority
    }

    private func accept(
        _ suggestions: [LiveGuidanceSuggestion],
        now: Date
    ) -> [LiveGuidanceSuggestion] {
        stableSuggestions = suggestions
        stableUpdatedAt = now
        pendingSuggestionIDs = []
        pendingCount = 0

        for suggestion in suggestions {
            lastShownAt[suggestion.id] = now
        }

        return suggestions
    }
}

private extension LiveGuidanceSuggestion {
    var guidancePriority: Int {
        switch id {
        case "move_closer_to_light",
             "avoid_direct_light",
             "step_back_portrait",
             "move_closer_portrait":
            return 0
        case "more_headroom",
             "center_subject":
            return 1
        case "try_warm_filter",
             "portrait_framing_ready",
             "lighting_balanced":
            return 2
        case "local_signal_unavailable":
            return 3
        default:
            return 4
        }
    }
}
