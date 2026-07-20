import CoreGraphics
import CoreVideo
import Foundation

/// Reduces a sparse luma sample to one nonnumeric scene-structure bucket.
/// Raw pixels and intermediate measurements stay inside this background call.
nonisolated struct LiveGuidanceLumaStructureAnalyzer: Sendable {
    private let rowCount = 18
    private let pairCount = 14
    private let outerMargin: CGFloat = 0.06
    private let centerExclusion: CGFloat = 0.06
    private let minimumDynamicRange = 0.14
    private let minimumTexture = 0.025
    private let maximumMirrorDifference = 0.10
    private let maximumMeanBalanceDifference = 0.045

    func signal(
        from pixelBuffer: CVPixelBuffer,
        pixelOrientation: CameraFramePixelOrientation
    ) -> LiveFrameSceneStructureSignal {
        guard CVPixelBufferGetPixelFormatType(pixelBuffer)
                == kCVPixelFormatType_420YpCbCr8BiPlanarFullRange,
              CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly) == kCVReturnSuccess else {
            return unavailableSignal
        }
        defer {
            CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
        }

        guard CVPixelBufferGetPlaneCount(pixelBuffer) > 0,
              let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
            return unavailableSignal
        }

        let width = CVPixelBufferGetWidthOfPlane(pixelBuffer, 0)
        let height = CVPixelBufferGetHeightOfPlane(pixelBuffer, 0)
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
        guard width > 1,
              height > 1,
              bytesPerRow >= width else {
            return unavailableSignal
        }

        let lumaBase = baseAddress.assumingMemoryBound(to: UInt8.self)
        var leftTotal = 0
        var rightTotal = 0
        var mirrorDifferenceTotal = 0
        var textureDifferenceTotal = 0
        var textureComparisonCount = 0
        var sampleCount = 0
        var minimumLuma = 255
        var maximumLuma = 0
        var previousRowPairs: [(left: Int, right: Int)]?

        for rowIndex in 0..<rowCount {
            let logicalY = normalizedSamplePosition(
                index: rowIndex,
                count: rowCount,
                minimum: 0.05,
                maximum: 0.95
            )
            var currentRowPairs: [(left: Int, right: Int)] = []
            currentRowPairs.reserveCapacity(pairCount)

            for pairIndex in 0..<pairCount {
                let leftX = normalizedSamplePosition(
                    index: pairIndex,
                    count: pairCount,
                    minimum: outerMargin,
                    maximum: 0.5 - centerExclusion
                )
                let rightX = 1 - leftX
                let left = lumaValue(
                    logicalX: leftX,
                    logicalY: logicalY,
                    pixelOrientation: pixelOrientation,
                    lumaBase: lumaBase,
                    width: width,
                    height: height,
                    bytesPerRow: bytesPerRow
                )
                let right = lumaValue(
                    logicalX: rightX,
                    logicalY: logicalY,
                    pixelOrientation: pixelOrientation,
                    lumaBase: lumaBase,
                    width: width,
                    height: height,
                    bytesPerRow: bytesPerRow
                )

                leftTotal += left
                rightTotal += right
                mirrorDifferenceTotal += abs(left - right)
                minimumLuma = min(minimumLuma, min(left, right))
                maximumLuma = max(maximumLuma, max(left, right))
                sampleCount += 1

                if let previousPair = currentRowPairs.last {
                    textureDifferenceTotal += abs(left - previousPair.left)
                    textureDifferenceTotal += abs(right - previousPair.right)
                    textureComparisonCount += 2
                }
                if let previousRowPairs,
                   pairIndex < previousRowPairs.count {
                    textureDifferenceTotal += abs(left - previousRowPairs[pairIndex].left)
                    textureDifferenceTotal += abs(right - previousRowPairs[pairIndex].right)
                    textureComparisonCount += 2
                }

                currentRowPairs.append((left: left, right: right))
            }

            previousRowPairs = currentRowPairs
        }

        guard sampleCount == rowCount * pairCount,
              textureComparisonCount > 0 else {
            return unavailableSignal
        }

        let mirrorDifference = Double(mirrorDifferenceTotal) / Double(sampleCount) / 255.0
        let meanBalanceDifference = abs(Double(leftTotal - rightTotal))
            / Double(sampleCount)
            / 255.0
        let dynamicRange = Double(maximumLuma - minimumLuma) / 255.0
        let texture = Double(textureDifferenceTotal)
            / Double(textureComparisonCount)
            / 255.0

        guard dynamicRange >= minimumDynamicRange,
              texture >= minimumTexture else {
            return unavailableSignal
        }

        let evidence: LiveFrameSymmetryEvidence = mirrorDifference <= maximumMirrorDifference
            && meanBalanceDifference <= maximumMeanBalanceDifference
            ? .observed
            : .notObserved
        return LiveFrameSceneStructureSignal(
            symmetryEvidence: evidence,
            leadingLineSignal: .unavailable,
            quietSpaceSignal: .unavailable
        )
    }

    private var unavailableSignal: LiveFrameSceneStructureSignal {
        LiveFrameSceneStructureSignal(
            symmetryEvidence: .unavailable,
            leadingLineSignal: .unavailable,
            quietSpaceSignal: .unavailable
        )
    }

    private func normalizedSamplePosition(
        index: Int,
        count: Int,
        minimum: CGFloat,
        maximum: CGFloat
    ) -> CGFloat {
        let unit = (CGFloat(index) + 0.5) / CGFloat(max(count, 1))
        return minimum + (maximum - minimum) * unit
    }

    private func lumaValue(
        logicalX: CGFloat,
        logicalY: CGFloat,
        pixelOrientation: CameraFramePixelOrientation,
        lumaBase: UnsafeMutablePointer<UInt8>,
        width: Int,
        height: Int,
        bytesPerRow: Int
    ) -> Int {
        let rawX: CGFloat
        let rawY: CGFloat
        switch pixelOrientation {
        case .portraitRotated:
            rawX = logicalX
            rawY = logicalY
        case .sensorNativeLandscape:
            // `.right` rotates the sensor-native buffer clockwise into the same
            // logical portrait coordinates used by Vision and the AR overlay.
            rawX = logicalY
            rawY = 1 - logicalX
        }

        let x = min(
            max(Int((rawX * CGFloat(width - 1)).rounded()), 0),
            width - 1
        )
        let y = min(
            max(Int((rawY * CGFloat(height - 1)).rounded()), 0),
            height - 1
        )
        return Int(lumaBase[y * bytesPerRow + x])
    }
}
