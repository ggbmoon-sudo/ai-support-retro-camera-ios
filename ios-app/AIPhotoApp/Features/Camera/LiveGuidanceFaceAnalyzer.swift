import CoreVideo
import CoreGraphics
import Foundation
import ImageIO
import Vision

nonisolated struct LiveGuidanceFaceAnalyzer: Sendable {
    private let centerTolerance = 0.18
    private let lowHeadroomThreshold = 0.88
    private let tooCloseHeightThreshold = 0.62
    private let tooFarHeightThreshold = 0.18

    func signals(from pixelBuffer: CVPixelBuffer) -> [LiveGuidanceSignal] {
        let request = VNDetectFaceRectanglesRequest()
        let handler = VNImageRequestHandler(
            cvPixelBuffer: pixelBuffer,
            orientation: .right,
            options: [:]
        )

        do {
            try handler.perform([request])
        } catch {
            return []
        }

        guard let face = request.results?.max(by: { lhs, rhs in
            area(of: lhs.boundingBox) < area(of: rhs.boundingBox)
        }) else {
            return []
        }

        return framingSignals(for: face.boundingBox)
    }

    private func framingSignals(for box: CGRect) -> [LiveGuidanceSignal] {
        var signals: [LiveGuidanceSignal] = []

        if abs(box.midX - 0.5) > centerTolerance {
            signals.append(.subjectOffCenter)
        }

        if box.maxY > lowHeadroomThreshold {
            signals.append(.lowHeadroom)
        }

        if box.height > tooCloseHeightThreshold {
            signals.append(.faceTooClose)
        } else if box.height < tooFarHeightThreshold {
            signals.append(.faceTooFar)
        } else if signals.isEmpty {
            signals.append(.portraitLikely)
        }

        return signals
    }

    private func area(of box: CGRect) -> CGFloat {
        box.width * box.height
    }
}
