import AVFoundation
import SwiftUI
import UIKit

struct CameraPreviewFocusTap {
    let layerPoint: CGPoint
    let devicePoint: CGPoint
}

struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession
    let isMirrored: Bool
    let videoGravity: AVLayerVideoGravity
    let onFocusTap: ((CameraPreviewFocusTap) -> Void)?

    init(
        session: AVCaptureSession,
        isMirrored: Bool = false,
        videoGravity: AVLayerVideoGravity = .resizeAspect,
        onFocusTap: ((CameraPreviewFocusTap) -> Void)? = nil
    ) {
        self.session = session
        self.isMirrored = isMirrored
        self.videoGravity = videoGravity
        self.onFocusTap = onFocusTap
    }

    func makeUIView(context: Context) -> PreviewContainerView {
        let view = PreviewContainerView()
        view.previewLayer.session = session
        view.isMirrored = isMirrored
        view.videoGravity = videoGravity
        view.onFocusTap = onFocusTap
        return view
    }

    func updateUIView(_ uiView: PreviewContainerView, context: Context) {
        uiView.previewLayer.session = session
        uiView.isMirrored = isMirrored
        uiView.videoGravity = videoGravity
        uiView.onFocusTap = onFocusTap
    }
}

final class PreviewContainerView: UIView {
    var onFocusTap: ((CameraPreviewFocusTap) -> Void)?

    private let coordinateMapper = CameraOverlayCoordinateMapper()

    var videoGravity: AVLayerVideoGravity = .resizeAspect {
        didSet {
            updateConnection()
        }
    }

    var isMirrored = false {
        didSet {
            updateConnection()
        }
    }

    override class var layerClass: AnyClass {
        AVCaptureVideoPreviewLayer.self
    }

    override init(frame: CGRect) {
        super.init(frame: frame)
        installFocusTapRecognizer()
    }

    required init?(coder: NSCoder) {
        super.init(coder: coder)
        installFocusTapRecognizer()
    }

    var previewLayer: AVCaptureVideoPreviewLayer {
        layer as! AVCaptureVideoPreviewLayer
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        updateConnection()
    }

    private func installFocusTapRecognizer() {
        isUserInteractionEnabled = true
        addGestureRecognizer(UITapGestureRecognizer(target: self, action: #selector(handleFocusTap(_:))))
    }

    @objc
    private func handleFocusTap(_ recognizer: UITapGestureRecognizer) {
        guard recognizer.state == .ended,
              let onFocusTap else {
            return
        }

        let layerPoint = recognizer.location(in: self)
        guard displayedCameraContentRect.contains(layerPoint) else {
            return
        }

        let devicePoint = previewLayer.captureDevicePointConverted(fromLayerPoint: layerPoint)
        guard devicePoint.x.isFinite,
              devicePoint.y.isFinite else {
            return
        }

        onFocusTap(
            CameraPreviewFocusTap(
                layerPoint: layerPoint,
                devicePoint: devicePoint
            )
        )
    }

    private var displayedCameraContentRect: CGRect {
        switch videoGravity {
        case .resizeAspect:
            return coordinateMapper.displayedContentRect(
                sourceSize: CameraFrameOrientationContract.portraitNormalizedSourceSize,
                overlaySize: bounds.size,
                contentMode: .aspectFit
            )
        case .resizeAspectFill:
            return coordinateMapper.displayedContentRect(
                sourceSize: CameraFrameOrientationContract.portraitNormalizedSourceSize,
                overlaySize: bounds.size,
                contentMode: .aspectFill
            )
        default:
            return bounds
        }
    }

    private func updateConnection() {
        previewLayer.videoGravity = videoGravity

        guard let connection = previewLayer.connection else {
            return
        }

        let portraitRotationAngle = CameraFrameOrientationContract.portraitRotationAngleDegrees
        if connection.isVideoRotationAngleSupported(portraitRotationAngle) {
            connection.videoRotationAngle = portraitRotationAngle
        }

        if connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = isMirrored
        }
    }
}
