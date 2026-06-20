import AVFoundation
import SwiftUI
import UIKit

struct CameraPreviewView: UIViewRepresentable {
    let session: AVCaptureSession
    let isMirrored: Bool
    let videoGravity: AVLayerVideoGravity

    init(
        session: AVCaptureSession,
        isMirrored: Bool = false,
        videoGravity: AVLayerVideoGravity = .resizeAspectFill
    ) {
        self.session = session
        self.isMirrored = isMirrored
        self.videoGravity = videoGravity
    }

    func makeUIView(context: Context) -> PreviewContainerView {
        let view = PreviewContainerView()
        view.previewLayer.session = session
        view.isMirrored = isMirrored
        view.videoGravity = videoGravity
        return view
    }

    func updateUIView(_ uiView: PreviewContainerView, context: Context) {
        uiView.previewLayer.session = session
        uiView.isMirrored = isMirrored
        uiView.videoGravity = videoGravity
    }
}

final class PreviewContainerView: UIView {
    var videoGravity: AVLayerVideoGravity = .resizeAspectFill {
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

    var previewLayer: AVCaptureVideoPreviewLayer {
        layer as! AVCaptureVideoPreviewLayer
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        updateConnection()
    }

    private func updateConnection() {
        previewLayer.videoGravity = videoGravity

        guard let connection = previewLayer.connection else {
            return
        }

        if connection.isVideoRotationAngleSupported(90) {
            connection.videoRotationAngle = 90
        }

        if connection.isVideoMirroringSupported {
            connection.automaticallyAdjustsVideoMirroring = false
            connection.isVideoMirrored = isMirrored
        }
    }
}
