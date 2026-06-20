import AVFoundation
import Foundation

nonisolated enum CameraDepthCapabilityState: String, Sendable {
    case hardwareDepthAvailable
    case portraitMatteAvailable
    case depthUnavailable
}

nonisolated struct CameraDepthCapability: Equatable, Sendable {
    let state: CameraDepthCapabilityState
    let hardwareDepthAvailable: Bool
    let portraitMatteAvailable: Bool

    static let unavailable = CameraDepthCapability(
        state: .depthUnavailable,
        hardwareDepthAvailable: false,
        portraitMatteAvailable: false
    )
}

nonisolated struct CameraDepthCapabilityProbe: Sendable {
    func capability(
        for device: AVCaptureDevice,
        photoOutput: AVCapturePhotoOutput
    ) -> CameraDepthCapability {
        let hardwareDepthAvailable = photoOutput.isDepthDataDeliverySupported
            || !device.activeFormat.supportedDepthDataFormats.isEmpty
        let portraitMatteAvailable = photoOutput.isPortraitEffectsMatteDeliverySupported
        let state: CameraDepthCapabilityState

        if hardwareDepthAvailable {
            state = .hardwareDepthAvailable
        } else if portraitMatteAvailable {
            state = .portraitMatteAvailable
        } else {
            state = .depthUnavailable
        }

        return CameraDepthCapability(
            state: state,
            hardwareDepthAvailable: hardwareDepthAvailable,
            portraitMatteAvailable: portraitMatteAvailable
        )
    }
}

extension DepthSignals {
    init(capability: CameraDepthCapability) {
        let depthState: LiveFrameDepthState

        switch capability.state {
        case .hardwareDepthAvailable:
            depthState = .hardwareDepthAvailable
        case .portraitMatteAvailable:
            depthState = .portraitMatteAvailable
        case .depthUnavailable:
            depthState = .depthUnavailable
        }

        self.init(
            depthState: depthState,
            foregroundBackgroundSeparationBucket: .unknown,
            subjectDistanceBucket: .unknown,
            depthConfidenceBucket: .unknown
        )
    }
}
