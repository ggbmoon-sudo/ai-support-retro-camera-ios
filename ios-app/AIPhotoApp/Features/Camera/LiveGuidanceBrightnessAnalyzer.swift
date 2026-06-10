import CoreVideo
import Foundation

nonisolated struct LiveGuidanceBrightnessAnalyzer: Sendable {
    private let tooDarkThreshold = 0.22
    private let tooBrightThreshold = 0.82

    func signals(from pixelBuffer: CVPixelBuffer) -> [LiveGuidanceSignal] {
        guard let brightness = averageLuma(from: pixelBuffer) else {
            return []
        }

        if brightness < tooDarkThreshold {
            return [.tooDark]
        }

        if brightness > tooBrightThreshold {
            return [.tooBright]
        }

        return [.lightingLooksBalanced]
    }

    private func averageLuma(from pixelBuffer: CVPixelBuffer) -> Double? {
        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer {
            CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
        }

        guard CVPixelBufferGetPlaneCount(pixelBuffer) > 0,
              let baseAddress = CVPixelBufferGetBaseAddressOfPlane(pixelBuffer, 0) else {
            return nil
        }

        let width = CVPixelBufferGetWidthOfPlane(pixelBuffer, 0)
        let height = CVPixelBufferGetHeightOfPlane(pixelBuffer, 0)
        let bytesPerRow = CVPixelBufferGetBytesPerRowOfPlane(pixelBuffer, 0)
        guard width > 0, height > 0, bytesPerRow > 0 else { return nil }

        let rowStride = max(height / 24, 1)
        let columnStride = max(width / 24, 1)
        let lumaBase = baseAddress.assumingMemoryBound(to: UInt8.self)
        var total = 0
        var count = 0

        for y in stride(from: 0, to: height, by: rowStride) {
            let row = lumaBase.advanced(by: y * bytesPerRow)

            for x in stride(from: 0, to: width, by: columnStride) {
                total += Int(row[x])
                count += 1
            }
        }

        guard count > 0 else { return nil }
        return Double(total) / Double(count) / 255.0
    }
}
