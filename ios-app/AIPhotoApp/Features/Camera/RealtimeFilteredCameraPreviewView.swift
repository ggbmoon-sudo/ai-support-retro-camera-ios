import AVFoundation
import CoreImage
import ImageIO
import MetalKit
import SwiftUI

struct RealtimeFilteredCameraPreviewView: UIViewRepresentable {
    let service: CameraCaptureService
    let preset: FilterPreset
    let isMirrored: Bool
    let videoGravity: AVLayerVideoGravity

    init(
        service: CameraCaptureService,
        preset: FilterPreset,
        isMirrored: Bool,
        videoGravity: AVLayerVideoGravity = .resizeAspect
    ) {
        self.service = service
        self.preset = preset
        self.isMirrored = isMirrored
        self.videoGravity = videoGravity
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(service: service)
    }

    func makeUIView(context: Context) -> RealtimeFilteredCameraPreviewMetalView {
        let view = RealtimeFilteredCameraPreviewMetalView()
        view.update(preset: preset, isMirrored: isMirrored, videoGravity: videoGravity)
        return view
    }

    func updateUIView(_ uiView: RealtimeFilteredCameraPreviewMetalView, context: Context) {
        context.coordinator.service = service
        uiView.update(preset: preset, isMirrored: isMirrored, videoGravity: videoGravity)

        guard !preset.isOriginal else {
            service.setFilteredPreviewFrameHandler(nil)
            uiView.clear()
            return
        }

        service.setFilteredPreviewFrameHandler { [weak uiView] pixelBuffer in
            uiView?.enqueue(pixelBuffer: pixelBuffer)
        }
    }

    static func dismantleUIView(_ uiView: RealtimeFilteredCameraPreviewMetalView, coordinator: Coordinator) {
        coordinator.service?.setFilteredPreviewFrameHandler(nil)
        uiView.clear()
    }

    final class Coordinator {
        var service: CameraCaptureService?

        init(service: CameraCaptureService) {
            self.service = service
        }
    }
}

final class RealtimeFilteredCameraPreviewMetalView: MTKView {
    private var selectedPreset = FilterPresetCatalog.original
    private var shouldMirrorPreview = false
    private var previewGravity = AVLayerVideoGravity.resizeAspect
    private var latestPixelBuffer: CVPixelBuffer?
    private let ciContext: CIContext?
    private let metalCommandQueue: MTLCommandQueue?
    private let outputColorSpace = CGColorSpaceCreateDeviceRGB()

    init() {
        let metalDevice = MTLCreateSystemDefaultDevice()
        ciContext = metalDevice.map { CIContext(mtlDevice: $0) }
        metalCommandQueue = metalDevice?.makeCommandQueue()
        super.init(frame: .zero, device: metalDevice)
        framebufferOnly = false
        isPaused = true
        enableSetNeedsDisplay = false
        autoResizeDrawable = true
        backgroundColor = .black
        isOpaque = true
        contentMode = .scaleAspectFit
    }

    @available(*, unavailable)
    required init(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    func update(
        preset: FilterPreset,
        isMirrored: Bool,
        videoGravity: AVLayerVideoGravity
    ) {
        selectedPreset = preset
        shouldMirrorPreview = isMirrored
        previewGravity = videoGravity
        draw()
    }

    func enqueue(pixelBuffer: CVPixelBuffer) {
        DispatchQueue.main.async { [weak self] in
            self?.latestPixelBuffer = pixelBuffer
            self?.draw()
        }
    }

    func clear() {
        latestPixelBuffer = nil
        draw()
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        draw()
    }

    override func draw(_ rect: CGRect) {
        guard let latestPixelBuffer,
              let ciContext,
              let metalCommandQueue,
              let drawable = currentDrawable,
              let commandBuffer = metalCommandQueue.makeCommandBuffer() else {
            return
        }

        let drawableBounds = CGRect(origin: .zero, size: drawableSize)
        var image = Self.previewOrientedImage(
            CIImage(cvPixelBuffer: latestPixelBuffer),
            for: drawableBounds
        )
        if shouldMirrorPreview {
            image = Self.horizontallyMirrored(image)
        }

        guard let filteredImage = try? FilterPipeline.filteredCIImage(image, preset: selectedPreset) else {
            return
        }

        let fittedImage = Self.fittedImage(
            filteredImage,
            into: drawableBounds,
            videoGravity: previewGravity
        )
        let background = CIImage(color: CIColor(red: 0, green: 0, blue: 0, alpha: 1)).cropped(to: drawableBounds)
        let outputImage = fittedImage.composited(over: background)

        ciContext.render(
            outputImage,
            to: drawable.texture,
            commandBuffer: commandBuffer,
            bounds: drawableBounds,
            colorSpace: outputColorSpace
        )
        commandBuffer.present(drawable)
        commandBuffer.commit()
    }

    private static func previewOrientedImage(_ image: CIImage, for bounds: CGRect) -> CIImage {
        guard bounds.width > 0, bounds.height > 0 else { return image }

        let imageIsLandscape = image.extent.width > image.extent.height
        let targetIsPortrait = bounds.height >= bounds.width

        guard targetIsPortrait && imageIsLandscape else {
            return image
        }

        return image.oriented(.right)
    }

    private static func horizontallyMirrored(_ image: CIImage) -> CIImage {
        let extent = image.extent
        return image.transformed(
            by: CGAffineTransform(translationX: extent.minX + extent.maxX, y: 0)
                .scaledBy(x: -1, y: 1)
        )
    }

    private static func fittedImage(
        _ image: CIImage,
        into bounds: CGRect,
        videoGravity: AVLayerVideoGravity
    ) -> CIImage {
        let extent = image.extent
        guard extent.width > 0,
              extent.height > 0,
              bounds.width > 0,
              bounds.height > 0 else {
            return image
        }

        let scale: CGFloat
        if videoGravity == .resizeAspectFill {
            scale = max(bounds.width / extent.width, bounds.height / extent.height)
        } else if videoGravity == .resize {
            let xScale = bounds.width / extent.width
            let yScale = bounds.height / extent.height
            return image
                .transformed(by: CGAffineTransform(translationX: -extent.minX, y: -extent.minY))
                .transformed(by: CGAffineTransform(scaleX: xScale, y: yScale))
                .transformed(by: CGAffineTransform(translationX: bounds.minX, y: bounds.minY))
        } else {
            scale = min(bounds.width / extent.width, bounds.height / extent.height)
        }

        let scaledWidth = extent.width * scale
        let scaledHeight = extent.height * scale
        let x = bounds.minX + (bounds.width - scaledWidth) / 2
        let y = bounds.minY + (bounds.height - scaledHeight) / 2

        return image
            .transformed(by: CGAffineTransform(translationX: -extent.minX, y: -extent.minY))
            .transformed(by: CGAffineTransform(scaleX: scale, y: scale))
            .transformed(by: CGAffineTransform(translationX: x, y: y))
    }
}
