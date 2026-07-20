import Foundation

nonisolated struct LocalAIComposeDepthOcclusionState: Equatable, Sendable {
    let activeMask: LiveFrameDepthOcclusionMask?
    let pendingMask: LiveFrameDepthOcclusionMask?
    let pendingObservationCount: Int
    let missingObservationCount: Int

    static let initial = LocalAIComposeDepthOcclusionState(
        activeMask: nil,
        pendingMask: nil,
        pendingObservationCount: 0,
        missingObservationCount: 0
    )
}

nonisolated struct LocalAIComposeDepthOcclusionUpdate: Equatable, Sendable {
    let state: LocalAIComposeDepthOcclusionState
    let hasFreshActiveObservation: Bool
}

/// Stabilizes only a coarse binary grid. Raw depth, metric thresholds, and pixel
/// buffers never enter this controller or the UI layer.
nonisolated struct LocalAIComposeDepthOcclusionStabilityController: Sendable {
    private let requiredObservationCount = 2
    private let requiredMissingObservationCount = 2
    private let minimumIntersectionOverUnion = 0.38

    func update(
        state: LocalAIComposeDepthOcclusionState,
        candidateMask: LiveFrameDepthOcclusionMask?
    ) -> LocalAIComposeDepthOcclusionUpdate {
        guard let candidateMask,
              !candidateMask.occupiedCellIndices.isEmpty else {
            return missingUpdate(from: state)
        }

        if let activeMask = state.activeMask {
            if masksAreCompatible(activeMask, candidateMask) {
                return LocalAIComposeDepthOcclusionUpdate(
                    state: LocalAIComposeDepthOcclusionState(
                        activeMask: stabilizedMask(activeMask, candidateMask),
                        pendingMask: nil,
                        pendingObservationCount: 0,
                        missingObservationCount: 0
                    ),
                    hasFreshActiveObservation: true
                )
            }

            if let pendingMask = state.pendingMask,
               masksAreCompatible(pendingMask, candidateMask) {
                let pendingCount = min(
                    state.pendingObservationCount + 1,
                    requiredObservationCount
                )
                if pendingCount >= requiredObservationCount {
                    return LocalAIComposeDepthOcclusionUpdate(
                        state: LocalAIComposeDepthOcclusionState(
                            activeMask: stabilizedMask(pendingMask, candidateMask),
                            pendingMask: nil,
                            pendingObservationCount: 0,
                            missingObservationCount: 0
                        ),
                        hasFreshActiveObservation: true
                    )
                }
                return LocalAIComposeDepthOcclusionUpdate(
                    state: LocalAIComposeDepthOcclusionState(
                        activeMask: activeMask,
                        pendingMask: candidateMask,
                        pendingObservationCount: pendingCount,
                        missingObservationCount: 0
                    ),
                    hasFreshActiveObservation: false
                )
            }

            return LocalAIComposeDepthOcclusionUpdate(
                state: LocalAIComposeDepthOcclusionState(
                    activeMask: activeMask,
                    pendingMask: candidateMask,
                    pendingObservationCount: 1,
                    missingObservationCount: 0
                ),
                hasFreshActiveObservation: false
            )
        }

        if let pendingMask = state.pendingMask,
           masksAreCompatible(pendingMask, candidateMask) {
            let pendingCount = min(
                state.pendingObservationCount + 1,
                requiredObservationCount
            )
            if pendingCount >= requiredObservationCount {
                return LocalAIComposeDepthOcclusionUpdate(
                    state: LocalAIComposeDepthOcclusionState(
                        activeMask: stabilizedMask(pendingMask, candidateMask),
                        pendingMask: nil,
                        pendingObservationCount: 0,
                        missingObservationCount: 0
                    ),
                    hasFreshActiveObservation: true
                )
            }
        }

        return LocalAIComposeDepthOcclusionUpdate(
            state: LocalAIComposeDepthOcclusionState(
                activeMask: nil,
                pendingMask: candidateMask,
                pendingObservationCount: 1,
                missingObservationCount: 0
            ),
            hasFreshActiveObservation: false
        )
    }

    private func missingUpdate(
        from state: LocalAIComposeDepthOcclusionState
    ) -> LocalAIComposeDepthOcclusionUpdate {
        guard let activeMask = state.activeMask else {
            return LocalAIComposeDepthOcclusionUpdate(
                state: .initial,
                hasFreshActiveObservation: false
            )
        }
        let missingCount = min(
            state.missingObservationCount + 1,
            requiredMissingObservationCount
        )
        if missingCount >= requiredMissingObservationCount {
            return LocalAIComposeDepthOcclusionUpdate(
                state: .initial,
                hasFreshActiveObservation: false
            )
        }
        return LocalAIComposeDepthOcclusionUpdate(
            state: LocalAIComposeDepthOcclusionState(
                activeMask: activeMask,
                pendingMask: nil,
                pendingObservationCount: 0,
                missingObservationCount: missingCount
            ),
            hasFreshActiveObservation: false
        )
    }

    private func masksAreCompatible(
        _ first: LiveFrameDepthOcclusionMask,
        _ second: LiveFrameDepthOcclusionMask
    ) -> Bool {
        let firstCells = Set(first.occupiedCellIndices)
        let secondCells = Set(second.occupiedCellIndices)
        let unionCount = firstCells.union(secondCells).count
        guard unionCount > 0 else { return false }
        let intersectionCount = firstCells.intersection(secondCells).count
        return Double(intersectionCount) / Double(unionCount)
            >= minimumIntersectionOverUnion
    }

    private func stabilizedMask(
        _ previous: LiveFrameDepthOcclusionMask,
        _ current: LiveFrameDepthOcclusionMask
    ) -> LiveFrameDepthOcclusionMask {
        let currentCells = Set(current.occupiedCellIndices.map(Int.init))
        let retainedPreviousCells = previous.occupiedCellIndices
            .map(Int.init)
            .filter { previousIndex in
                currentCells.contains(previousIndex)
                    || neighboringCellIndices(for: previousIndex)
                        .contains(where: currentCells.contains)
            }
        let stabilizedCells = currentCells.union(retainedPreviousCells)
        return LiveFrameDepthOcclusionMask(
            occupiedCellIndices: stabilizedCells.map { UInt16($0) }
        )
    }

    private func neighboringCellIndices(for index: Int) -> [Int] {
        let columns = LiveFrameDepthOcclusionMask.columnCount
        let rows = LiveFrameDepthOcclusionMask.rowCount
        let row = index / columns
        let column = index % columns
        var neighbors: [Int] = []
        if column > 0 { neighbors.append(index - 1) }
        if column + 1 < columns { neighbors.append(index + 1) }
        if row > 0 { neighbors.append(index - columns) }
        if row + 1 < rows { neighbors.append(index + columns) }
        return neighbors
    }
}
