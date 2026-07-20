import CoreGraphics
import CoreVideo
import Foundation

/// Finds a bounded perspective-line convergence cue from a fixed logical portrait grid.
/// Gradients, edge samples, intersections, weights, and support counts never leave this call.
nonisolated struct LiveGuidanceLumaConvergenceAnalyzer: Sendable {
    private struct Edge: Sendable {
        let x: Double
        let y: Double
        let directionX: Double
        let directionY: Double
        let strength: Double
    }

    private struct ConvergenceBin: Sendable {
        var weight = 0.0
        var intersectionCount = 0
        var weightedX = 0.0
        var weightedY = 0.0

        mutating func add(x: Double, y: Double, weight: Double) {
            self.weight += weight
            intersectionCount += 1
            weightedX += x * weight
            weightedY += y * weight
        }
    }

    private let gridColumnCount = 24
    private let gridRowCount = 32
    private let spatialBucketColumnCount = 6
    private let spatialBucketRowCount = 8
    private let maximumEdgesPerSpatialBucket = 4
    private let convergenceBinColumnCount = 8
    private let convergenceBinRowCount = 7
    private let minimumGradientStrength = 0.11
    private let minimumSelectedEdgeCount = 24
    private let minimumEdgeSeparation = 0.16
    private let minimumDirectionCross = 0.34
    private let maximumIntersectionExtension = 1.25
    private let minimumPeakIntersectionCount = 40
    private let minimumPeakIntersectionFraction = 0.06
    private let minimumRadialSupportCount = 32
    private let minimumRadialSupportFraction = 0.30
    private let minimumRadialSectorCount = 3
    private let minimumPointDistance = 0.12
    private let minimumRadialAlignment = 0.966
    private let minimumActiveSideActivity = 0.045
    private let minimumSideActivityDifference = 0.025
    private let maximumQuietToActiveActivityRatio = 0.65

    func analysis(
        from pixelBuffer: CVPixelBuffer,
        pixelOrientation: CameraFramePixelOrientation
    ) -> LiveFrameLumaCompositionAnalysis {
        guard CVPixelBufferGetPixelFormatType(pixelBuffer)
                == kCVPixelFormatType_420YpCbCr8BiPlanarFullRange,
              CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly) == kCVReturnSuccess else {
            return .unavailable
        }
        defer {
            CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
        }

        guard CVPixelBufferGetPlaneCount(pixelBuffer) > 0,
              let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
            return .unavailable
        }

        let width = CVPixelBufferGetWidthOfPlane(pixelBuffer, 0)
        let height = CVPixelBufferGetHeightOfPlane(pixelBuffer, 0)
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
        guard width > 1,
              height > 1,
              bytesPerRow >= width else {
            return .unavailable
        }

        let lumaBase = baseAddress.assumingMemoryBound(to: UInt8.self)
        let grid = logicalPortraitGrid(
            pixelOrientation: pixelOrientation,
            lumaBase: lumaBase,
            width: width,
            height: height,
            bytesPerRow: bytesPerRow
        )
        let quietSpaceSignal = quietSpaceSignal(in: grid)
        let edges = boundedStrongEdges(in: grid)
        let leadingLineSignal = edges.count >= minimumSelectedEdgeCount
            ? convergenceSignal(from: edges)
            : .unavailable
        return LiveFrameLumaCompositionAnalysis(
            leadingLineSignal: leadingLineSignal,
            quietSpaceSignal: quietSpaceSignal
        )
    }

    private func logicalPortraitGrid(
        pixelOrientation: CameraFramePixelOrientation,
        lumaBase: UnsafeMutablePointer<UInt8>,
        width: Int,
        height: Int,
        bytesPerRow: Int
    ) -> [Double] {
        var grid = Array(
            repeating: 0.0,
            count: gridColumnCount * gridRowCount
        )

        for row in 0..<gridRowCount {
            let logicalY = (Double(row) + 0.5) / Double(gridRowCount)
            for column in 0..<gridColumnCount {
                let logicalX = (Double(column) + 0.5) / Double(gridColumnCount)
                grid[row * gridColumnCount + column] = Double(
                    lumaValue(
                        logicalX: logicalX,
                        logicalY: logicalY,
                        pixelOrientation: pixelOrientation,
                        lumaBase: lumaBase,
                        width: width,
                        height: height,
                        bytesPerRow: bytesPerRow
                    )
                ) / 255.0
            }
        }

        return grid
    }

    private func boundedStrongEdges(in grid: [Double]) -> [Edge] {
        let bucketCount = spatialBucketColumnCount * spatialBucketRowCount
        var buckets = Array(repeating: [Edge](), count: bucketCount)

        for row in 1..<(gridRowCount - 1) {
            for column in 1..<(gridColumnCount - 1) {
                let topLeft = grid[(row - 1) * gridColumnCount + column - 1]
                let top = grid[(row - 1) * gridColumnCount + column]
                let topRight = grid[(row - 1) * gridColumnCount + column + 1]
                let middleLeft = grid[row * gridColumnCount + column - 1]
                let middleRight = grid[row * gridColumnCount + column + 1]
                let bottomLeft = grid[(row + 1) * gridColumnCount + column - 1]
                let bottom = grid[(row + 1) * gridColumnCount + column]
                let bottomRight = grid[(row + 1) * gridColumnCount + column + 1]
                let gradientX = (
                    topRight + 2 * middleRight + bottomRight
                        - topLeft - 2 * middleLeft - bottomLeft
                ) / 4.0
                let gradientY = (
                    bottomLeft + 2 * bottom + bottomRight
                        - topLeft - 2 * top - topRight
                ) / 4.0
                let strength = hypot(gradientX, gradientY)
                guard strength >= minimumGradientStrength else { continue }

                let x = (Double(column) + 0.5) / Double(gridColumnCount)
                let y = (Double(row) + 0.5) / Double(gridRowCount)
                let edge = Edge(
                    x: x,
                    y: y,
                    directionX: -gradientY / strength,
                    directionY: gradientX / strength,
                    strength: min(strength, 0.8)
                )
                let bucketColumn = min(
                    Int(x * Double(spatialBucketColumnCount)),
                    spatialBucketColumnCount - 1
                )
                let bucketRow = min(
                    Int(y * Double(spatialBucketRowCount)),
                    spatialBucketRowCount - 1
                )
                let bucketIndex = bucketRow * spatialBucketColumnCount + bucketColumn
                buckets[bucketIndex].append(edge)
                buckets[bucketIndex].sort { $0.strength > $1.strength }
                if buckets[bucketIndex].count > maximumEdgesPerSpatialBucket {
                    buckets[bucketIndex].removeLast()
                }
            }
        }

        return buckets.flatMap { $0 }
    }

    private func quietSpaceSignal(in grid: [Double]) -> LiveFrameQuietSpaceSignal {
        let leftActivity = sideActivity(
            in: grid,
            columns: 1...8
        )
        let rightActivity = sideActivity(
            in: grid,
            columns: 15...22
        )
        let activeActivity = max(leftActivity, rightActivity)
        let quietActivity = min(leftActivity, rightActivity)
        let difference = activeActivity - quietActivity
        let ratio = quietActivity / max(activeActivity, 0.001)
        guard activeActivity >= minimumActiveSideActivity,
              difference >= minimumSideActivityDifference,
              ratio <= maximumQuietToActiveActivityRatio else {
            return LiveFrameQuietSpaceSignal(
                evidence: .notObserved,
                side: nil
            )
        }

        return LiveFrameQuietSpaceSignal(
            evidence: .observed,
            side: leftActivity < rightActivity ? .left : .right
        )
    }

    private func sideActivity(
        in grid: [Double],
        columns: ClosedRange<Int>
    ) -> Double {
        var differenceTotal = 0.0
        var comparisonCount = 0
        for row in 1..<(gridRowCount - 1) {
            for column in columns {
                let value = grid[row * gridColumnCount + column]
                let horizontalDifference = abs(
                    value - grid[row * gridColumnCount + column - 1]
                )
                let verticalDifference = abs(
                    value - grid[(row - 1) * gridColumnCount + column]
                )
                differenceTotal += (horizontalDifference + verticalDifference) / 2
                comparisonCount += 1
            }
        }
        return comparisonCount > 0
            ? differenceTotal / Double(comparisonCount)
            : 0
    }

    private func convergenceSignal(from edges: [Edge]) -> LiveFrameLeadingLineSignal {
        let binCount = convergenceBinColumnCount * convergenceBinRowCount
        var bins = Array(repeating: ConvergenceBin(), count: binCount)
        var totalIntersectionWeight = 0.0

        for firstIndex in 0..<(edges.count - 1) {
            let first = edges[firstIndex]
            for secondIndex in (firstIndex + 1)..<edges.count {
                let second = edges[secondIndex]
                let edgeDistance = hypot(second.x - first.x, second.y - first.y)
                guard edgeDistance >= minimumEdgeSeparation else { continue }

                let denominator = cross(
                    first.directionX,
                    first.directionY,
                    second.directionX,
                    second.directionY
                )
                guard abs(denominator) >= minimumDirectionCross else { continue }

                let deltaX = second.x - first.x
                let deltaY = second.y - first.y
                let firstExtension = cross(
                    deltaX,
                    deltaY,
                    second.directionX,
                    second.directionY
                ) / denominator
                let secondExtension = cross(
                    deltaX,
                    deltaY,
                    first.directionX,
                    first.directionY
                ) / denominator
                guard abs(firstExtension) <= maximumIntersectionExtension,
                      abs(secondExtension) <= maximumIntersectionExtension else {
                    continue
                }

                let intersectionX = first.x + firstExtension * first.directionX
                let intersectionY = first.y + firstExtension * first.directionY
                guard (0.10...0.90).contains(intersectionX),
                      (0.10...0.80).contains(intersectionY) else {
                    continue
                }

                let weight = min(first.strength, second.strength) * abs(denominator)
                let binColumn = min(
                    Int((intersectionX - 0.10) / 0.80 * Double(convergenceBinColumnCount)),
                    convergenceBinColumnCount - 1
                )
                let binRow = min(
                    Int((intersectionY - 0.10) / 0.70 * Double(convergenceBinRowCount)),
                    convergenceBinRowCount - 1
                )
                let binIndex = binRow * convergenceBinColumnCount + binColumn
                bins[binIndex].add(
                    x: intersectionX,
                    y: intersectionY,
                    weight: weight
                )
                totalIntersectionWeight += weight
            }
        }

        guard totalIntersectionWeight > 0,
              let bestBin = bins.max(by: { $0.weight < $1.weight }),
              bestBin.weight > 0 else {
            return LiveFrameLeadingLineSignal(
                evidence: .notObserved,
                convergencePoint: nil
            )
        }

        let peakIntersectionFraction = bestBin.weight / totalIntersectionWeight
        let convergenceX = bestBin.weightedX / bestBin.weight
        let convergenceY = bestBin.weightedY / bestBin.weight
        let radialSupport = radialSupport(
            for: edges,
            convergenceX: convergenceX,
            convergenceY: convergenceY
        )
        let isObserved = bestBin.intersectionCount >= minimumPeakIntersectionCount
            && peakIntersectionFraction >= minimumPeakIntersectionFraction
            && radialSupport.count >= minimumRadialSupportCount
            && radialSupport.weightFraction >= minimumRadialSupportFraction
            && radialSupport.sectorCount >= minimumRadialSectorCount
            && radialSupport.hasDivergentOrientationFamilies
        let boundedDisplayX = min(max(convergenceX, 0.14), 0.86)
        let boundedDisplayY = min(max(convergenceY, 0.20), 0.72)

        return LiveFrameLeadingLineSignal(
            evidence: isObserved ? .observed : .notObserved,
            convergencePoint: isObserved
                ? LiveFramePoint(
                    x: CGFloat(boundedDisplayX),
                    // CPU grid rows use top-down pixel coordinates. Compose and
                    // Vision geometry use normalized bottom-up Y coordinates.
                    y: CGFloat(1 - boundedDisplayY)
                )
                : nil
        )
    }

    private func radialSupport(
        for edges: [Edge],
        convergenceX: Double,
        convergenceY: Double
    ) -> (
        count: Int,
        weightFraction: Double,
        sectorCount: Int,
        hasDivergentOrientationFamilies: Bool
    ) {
        var supportCount = 0
        var supportWeight = 0.0
        var sectorCounts = Array(repeating: 0, count: 8)
        var orientationCounts = Array(repeating: 0, count: 12)
        let totalEdgeWeight = edges.reduce(0.0) { $0 + $1.strength }

        for edge in edges {
            let deltaX = convergenceX - edge.x
            let deltaY = convergenceY - edge.y
            let distance = hypot(deltaX, deltaY)
            guard distance >= minimumPointDistance else { continue }

            let alignment = abs(
                edge.directionX * deltaX / distance
                    + edge.directionY * deltaY / distance
            )
            guard alignment >= minimumRadialAlignment else { continue }

            supportCount += 1
            supportWeight += edge.strength
            let sectorAngle = normalizedFullCircleAngle(
                atan2(edge.y - convergenceY, edge.x - convergenceX)
            )
            let sectorIndex = min(Int(sectorAngle / (2 * Double.pi) * 8), 7)
            sectorCounts[sectorIndex] += 1

            let orientationAngle = normalizedHalfCircleAngle(
                atan2(edge.directionY, edge.directionX)
            )
            let orientationIndex = min(Int(orientationAngle / Double.pi * 12), 11)
            orientationCounts[orientationIndex] += 1
        }

        let supportedSectors = sectorCounts.filter { $0 >= 2 }.count
        let supportedOrientations = orientationCounts.enumerated().compactMap {
            $0.element >= 2 ? $0.offset : nil
        }

        return (
            count: supportCount,
            weightFraction: totalEdgeWeight > 0 ? supportWeight / totalEdgeWeight : 0,
            sectorCount: supportedSectors,
            hasDivergentOrientationFamilies: hasDivergentOrientations(
                supportedOrientations,
                bucketCount: orientationCounts.count
            )
        )
    }

    private func hasDivergentOrientations(
        _ orientations: [Int],
        bucketCount: Int
    ) -> Bool {
        guard orientations.count > 1 else { return false }
        for firstIndex in 0..<(orientations.count - 1) {
            for secondIndex in (firstIndex + 1)..<orientations.count {
                let directDistance = abs(
                    orientations[firstIndex] - orientations[secondIndex]
                )
                let wrappedDistance = min(
                    directDistance,
                    bucketCount - directDistance
                )
                if wrappedDistance >= 2 {
                    return true
                }
            }
        }
        return false
    }

    private func normalizedFullCircleAngle(_ angle: Double) -> Double {
        angle >= 0 ? angle : angle + 2 * Double.pi
    }

    private func normalizedHalfCircleAngle(_ angle: Double) -> Double {
        var normalized = angle
        if normalized < 0 { normalized += Double.pi }
        if normalized >= Double.pi { normalized -= Double.pi }
        return normalized
    }

    private func cross(
        _ firstX: Double,
        _ firstY: Double,
        _ secondX: Double,
        _ secondY: Double
    ) -> Double {
        firstX * secondY - firstY * secondX
    }

    private func lumaValue(
        logicalX: Double,
        logicalY: Double,
        pixelOrientation: CameraFramePixelOrientation,
        lumaBase: UnsafeMutablePointer<UInt8>,
        width: Int,
        height: Int,
        bytesPerRow: Int
    ) -> Int {
        let rawX: Double
        let rawY: Double
        switch pixelOrientation {
        case .portraitRotated:
            rawX = logicalX
            rawY = logicalY
        case .sensorNativeLandscape:
            rawX = logicalY
            rawY = 1 - logicalX
        }

        let x = min(
            max(Int((rawX * Double(width - 1)).rounded()), 0),
            width - 1
        )
        let y = min(
            max(Int((rawY * Double(height - 1)).rounded()), 0),
            height - 1
        )
        return Int(lumaBase[y * bytesPerRow + x])
    }
}
