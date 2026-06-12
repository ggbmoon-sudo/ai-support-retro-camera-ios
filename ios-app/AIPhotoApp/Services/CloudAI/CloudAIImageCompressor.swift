import UIKit

struct CloudAICompressedImage {
    let data: Data
    let contentType: String
    let width: Int
    let height: Int
    let metadataStripped: Bool
}

struct CloudAIImageCompressor {
    let maxLongEdge: CGFloat
    let jpegQuality: CGFloat

    init(maxLongEdge: CGFloat = 1024, jpegQuality: CGFloat = 0.7) {
        self.maxLongEdge = maxLongEdge
        self.jpegQuality = jpegQuality
    }

    func compress(_ image: UIImage) throws -> CloudAICompressedImage {
        guard image.size.width > 0, image.size.height > 0 else {
            throw CloudAIServiceError.imageCompressionFailed
        }

        let longestEdge = max(image.size.width, image.size.height)
        let scale = min(1, maxLongEdge / longestEdge)
        let targetSize = CGSize(
            width: max(1, (image.size.width * scale).rounded()),
            height: max(1, (image.size.height * scale).rounded())
        )

        let format = UIGraphicsImageRendererFormat()
        format.scale = 1
        format.opaque = true

        let renderer = UIGraphicsImageRenderer(size: targetSize, format: format)
        let data = renderer.jpegData(withCompressionQuality: jpegQuality) { context in
            UIColor.black.setFill()
            context.fill(CGRect(origin: .zero, size: targetSize))
            image.draw(in: CGRect(origin: .zero, size: targetSize))
        }

        guard !data.isEmpty else {
            throw CloudAIServiceError.imageCompressionFailed
        }

        return CloudAICompressedImage(
            data: data,
            contentType: "image/jpeg",
            width: Int(targetSize.width),
            height: Int(targetSize.height),
            metadataStripped: true
        )
    }
}
