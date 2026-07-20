import AVFoundation
import CoreGraphics
import CoreVideo
import Foundation

nonisolated struct LiveGuidanceDepthAnalysis: Equatable, Sendable {
    let signals: DepthSignals
    let occlusionMask: LiveFrameDepthOcclusionMask?

    static func fallback(_ signals: DepthSignals) -> LiveGuidanceDepthAnalysis {
        LiveGuidanceDepthAnalysis(signals: signals, occlusionMask: nil)
    }
}

/// Reduces one synchronized hardware depth map to coarse, nonnumeric buckets
/// plus an optional fixed binary occlusion grid. Metric values never leave this call.
nonisolated struct LiveGuidanceDepthAnalyzer: Sendable {
    private let foregroundColumns = 5
    private let foregroundRows = 6
    private let backgroundColumns = 8
    private let backgroundRows = 10
    private let minimumForegroundSampleCount = 8
    private let minimumBackgroundSampleCount = 10
    private let nearDistanceMeters: Float = 0.75
    private let farDistanceMeters: Float = 2.2
    private let strongSeparationMeters: Float = 0.6
    private let visibleSeparationMeters: Float = 0.22

    private let maximumForegroundDepthDeltaMeters: Float = 0.28
    private let maximumNearerDepthDeltaMeters: Float = 0.55
    private let minimumOcclusionCellCount = 8
    private let maximumOcclusionCellCount = 300

    func analysis(
        from depthData: AVDepthData,
        subjectBox: LiveFrameNormalizedRect,
        depthPixelOrientation: CameraFramePixelOrientation,
        fallback: DepthSignals
    ) -> LiveGuidanceDepthAnalysis {
        guard fallback.depthState == .hardwareDepthAvailable,
              depthData.depthDataAccuracy == .absolute else {
            return .fallback(fallback)
        }

        let convertedDepth = depthData.converting(
            toDepthDataType: kCVPixelFormatType_DepthFloat32
        )
        let depthMap = convertedDepth.depthDataMap
        guard CVPixelBufferGetPixelFormatType(depthMap) == kCVPixelFormatType_DepthFloat32,
              CVPixelBufferLockBaseAddress(depthMap, .readOnly) == kCVReturnSuccess else {
            return .fallback(fallback)
        }
        defer {
            CVPixelBufferUnlockBaseAddress(depthMap, .readOnly)
        }

        guard let baseAddress = CVPixelBufferGetBaseAddress(depthMap) else {
            return .fallback(fallback)
        }
        let width = CVPixelBufferGetWidth(depthMap)
        let height = CVPixelBufferGetHeight(depthMap)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(depthMap)
        guard width > 1,
              height > 1,
              bytesPerRow >= width * MemoryLayout<Float32>.stride else {
            return .fallback(fallback)
        }

        let depthBase = baseAddress.assumingMemoryBound(to: Float32.self)
        let foregroundPoints = foregroundSamplePoints(in: subjectBox)
        let backgroundPoints = backgroundSamplePoints(around: subjectBox)
        let foregroundValues = validDepthValues(
            at: foregroundPoints,
            pixelOrientation: depthPixelOrientation,
            depthBase: depthBase,
            width: width,
            height: height,
            valuesPerRow: bytesPerRow / MemoryLayout<Float32>.stride
        )
        let backgroundValues = validDepthValues(
            at: backgroundPoints,
            pixelOrientation: depthPixelOrientation,
            depthBase: depthBase,
            width: width,
            height: height,
            valuesPerRow: bytesPerRow / MemoryLayout<Float32>.stride
        )

        let attemptedSampleCount = foregroundPoints.count + backgroundPoints.count
        let validSampleCount = foregroundValues.count + backgroundValues.count
        let confidenceBucket = confidenceBucket(
            validSampleCount: validSampleCount,
            attemptedSampleCount: attemptedSampleCount,
            hasEnoughForeground: foregroundValues.count >= minimumForegroundSampleCount,
            hasEnoughBackground: backgroundValues.count >= minimumBackgroundSampleCount
        )
        guard confidenceBucket != .low,
              let foregroundMedian = median(foregroundValues),
              let backgroundMedian = median(backgroundValues) else {
            return LiveGuidanceDepthAnalysis(
                signals: DepthSignals(
                    depthState: .hardwareDepthAvailable,
                    foregroundBackgroundSeparationBucket: .unknown,
                    subjectDistanceBucket: .unknown,
                    depthConfidenceBucket: confidenceBucket
                ),
                occlusionMask: nil
            )
        }

        let separationBucket = separationBucket(
            backgroundMedian - foregroundMedian
        )
        let signals = DepthSignals(
            depthState: .hardwareDepthAvailable,
            foregroundBackgroundSeparationBucket: separationBucket,
            subjectDistanceBucket: distanceBucket(foregroundMedian),
            depthConfidenceBucket: confidenceBucket
        )
        let occlusionMask = separationBucket == .high
            ? depthOcclusionMask(
                subjectBox: subjectBox,
                subjectMedian: foregroundMedian,
                pixelOrientation: depthPixelOrientation,
                depthBase: depthBase,
                width: width,
                height: height,
                valuesPerRow: bytesPerRow / MemoryLayout<Float32>.stride
            )
            : nil
        return LiveGuidanceDepthAnalysis(
            signals: signals,
            occlusionMask: occlusionMask
        )
    }

    private func depthOcclusionMask(
        subjectBox: LiveFrameNormalizedRect,
        subjectMedian: Float,
        pixelOrientation: CameraFramePixelOrientation,
        depthBase: UnsafeMutablePointer<Float32>,
        width: Int,
        height: Int,
        valuesPerRow: Int
    ) -> LiveFrameDepthOcclusionMask? {
        let expandedSubject = LiveFrameNormalizedRect(
            CGRect(
                x: subjectBox.x - max(subjectBox.width * 0.08, 0.015),
                y: subjectBox.y - max(subjectBox.height * 0.07, 0.015),
                width: subjectBox.width * 1.16,
                height: subjectBox.height * 1.14
            )
        )
        let minimumDepth = max(
            subjectMedian - maximumNearerDepthDeltaMeters,
            0.05
        )
        let maximumDepth = subjectMedian + maximumForegroundDepthDeltaMeters
        var occupied = Set<Int>()

        for row in 0..<LiveFrameDepthOcclusionMask.rowCount {
            let logicalY = (Double(row) + 0.5)
                / Double(LiveFrameDepthOcclusionMask.rowCount)
            let visionY = CGFloat(1 - logicalY)
            for column in 0..<LiveFrameDepthOcclusionMask.columnCount {
                let logicalX = (Double(column) + 0.5)
                    / Double(LiveFrameDepthOcclusionMask.columnCount)
                let point = LiveFramePoint(
                    x: CGFloat(logicalX),
                    y: visionY
                )
                guard expandedSubject.contains(point),
                      let value = depthValue(
                        logicalX: logicalX,
                        logicalY: logicalY,
                        pixelOrientation: pixelOrientation,
                        depthBase: depthBase,
                        width: width,
                        height: height,
                        valuesPerRow: valuesPerRow
                      ),
                      value >= minimumDepth,
                      value <= maximumDepth else {
                    continue
                }
                occupied.insert(
                    row * LiveFrameDepthOcclusionMask.columnCount + column
                )
            }
        }

        let cleaned = cleanedOcclusionCells(occupied)
        guard cleaned.count >= minimumOcclusionCellCount,
              cleaned.count <= maximumOcclusionCellCount else {
            return nil
        }
        return LiveFrameDepthOcclusionMask(
            occupiedCellIndices: cleaned.map { UInt16($0) }
        )
    }

    private func cleanedOcclusionCells(_ cells: Set<Int>) -> [Int] {
        guard !cells.isEmpty else { return [] }
        var cleaned = Set(
            cells.filter { index in
                neighboringCellIndices(for: index).contains(where: cells.contains)
            }
        )

        for index in 0..<LiveFrameDepthOcclusionMask.maximumCellCount
        where !cleaned.contains(index) {
            let occupiedNeighborCount = neighboringCellIndices(for: index)
                .filter(cleaned.contains)
                .count
            if occupiedNeighborCount >= 3 {
                cleaned.insert(index)
            }
        }
        return cleaned.sorted()
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

    private func foregroundSamplePoints(
        in subjectBox: LiveFrameNormalizedRect
    ) -> [LiveFramePoint] {
        let insetX = subjectBox.width * 0.16
        let insetY = subjectBox.height * 0.14
        let minX = subjectBox.x + insetX
        let maxX = subjectBox.x + subjectBox.width - insetX
        let minY = subjectBox.y + insetY
        let maxY = subjectBox.y + subjectBox.height - insetY
        return sampleGrid(
            minX: minX,
            maxX: maxX,
            minY: minY,
            maxY: maxY,
            columns: foregroundColumns,
            rows: foregroundRows
        )
    }

    private func backgroundSamplePoints(
        around subjectBox: LiveFrameNormalizedRect
    ) -> [LiveFramePoint] {
        let expanded = LiveFrameNormalizedRect(
            CGRect(
                x: subjectBox.x - subjectBox.width * 0.38,
                y: subjectBox.y - subjectBox.height * 0.32,
                width: subjectBox.width * 1.76,
                height: subjectBox.height * 1.64
            )
        )
        let exclusion = LiveFrameNormalizedRect(
            CGRect(
                x: subjectBox.x - subjectBox.width * 0.06,
                y: subjectBox.y - subjectBox.height * 0.05,
                width: subjectBox.width * 1.12,
                height: subjectBox.height * 1.10
            )
        )
        return sampleGrid(
            minX: expanded.x,
            maxX: expanded.x + expanded.width,
            minY: expanded.y,
            maxY: expanded.y + expanded.height,
            columns: backgroundColumns,
            rows: backgroundRows
        ).filter { !exclusion.contains($0) }
    }

    private func sampleGrid(
        minX: CGFloat,
        maxX: CGFloat,
        minY: CGFloat,
        maxY: CGFloat,
        columns: Int,
        rows: Int
    ) -> [LiveFramePoint] {
        guard columns > 0,
              rows > 0,
              maxX > minX,
              maxY > minY else {
            return []
        }

        return (0..<rows).flatMap { row in
            (0..<columns).map { column in
                LiveFramePoint(
                    x: minX + (CGFloat(column) + 0.5) / CGFloat(columns) * (maxX - minX),
                    y: minY + (CGFloat(row) + 0.5) / CGFloat(rows) * (maxY - minY)
                )
            }
        }
    }

    private func validDepthValues(
        at visionPoints: [LiveFramePoint],
        pixelOrientation: CameraFramePixelOrientation,
        depthBase: UnsafeMutablePointer<Float32>,
        width: Int,
        height: Int,
        valuesPerRow: Int
    ) -> [Float] {
        visionPoints.compactMap { point in
            // Vision uses a lower-left normalized origin. Pixel buffers use top-left rows.
            let logicalX = Double(point.x)
            let logicalY = 1 - Double(point.y)
            return depthValue(
                logicalX: logicalX,
                logicalY: logicalY,
                pixelOrientation: pixelOrientation,
                depthBase: depthBase,
                width: width,
                height: height,
                valuesPerRow: valuesPerRow
            )
        }
    }

    private func depthValue(
        logicalX: Double,
        logicalY: Double,
        pixelOrientation: CameraFramePixelOrientation,
        depthBase: UnsafeMutablePointer<Float32>,
        width: Int,
        height: Int,
        valuesPerRow: Int
    ) -> Float? {
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

        let x = min(max(Int((rawX * Double(width - 1)).rounded()), 0), width - 1)
        let y = min(max(Int((rawY * Double(height - 1)).rounded()), 0), height - 1)
        let value = depthBase[y * valuesPerRow + x]
        guard value.isFinite,
              value > 0.05,
              value < 50 else {
            return nil
        }
        return value
    }

    private func confidenceBucket(
        validSampleCount: Int,
        attemptedSampleCount: Int,
        hasEnoughForeground: Bool,
        hasEnoughBackground: Bool
    ) -> LiveGeometryBucket {
        guard attemptedSampleCount > 0,
              hasEnoughForeground,
              hasEnoughBackground else {
            return .low
        }
        let validRatio = Double(validSampleCount) / Double(attemptedSampleCount)
        if validRatio >= 0.72 { return .high }
        if validRatio >= 0.45 { return .balanced }
        return .low
    }

    private func distanceBucket(_ distance: Float) -> LiveGeometryBucket {
        if distance < nearDistanceMeters { return .low }
        if distance < farDistanceMeters { return .balanced }
        return .high
    }

    private func separationBucket(_ separation: Float) -> LiveGeometryBucket {
        if separation >= strongSeparationMeters { return .high }
        if separation >= visibleSeparationMeters { return .balanced }
        return .low
    }

    private func median(_ values: [Float]) -> Float? {
        guard !values.isEmpty else { return nil }
        let sorted = values.sorted()
        let middle = sorted.count / 2
        if sorted.count.isMultiple(of: 2) {
            return (sorted[middle - 1] + sorted[middle]) / 2
        }
        return sorted[middle]
    }
}
