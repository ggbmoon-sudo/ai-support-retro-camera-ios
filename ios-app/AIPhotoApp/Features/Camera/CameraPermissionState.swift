import AVFoundation
import SwiftUI

enum CameraPermissionState: Equatable {
    case notDetermined
    case authorized
    case denied
    case restricted
    case unavailable

    init(authorizationStatus: AVAuthorizationStatus) {
        switch authorizationStatus {
        case .notDetermined:
            self = .notDetermined
        case .authorized:
            self = .authorized
        case .denied:
            self = .denied
        case .restricted:
            self = .restricted
        @unknown default:
            self = .unavailable
        }
    }

    var titleKey: LocalizedStringKey {
        switch self {
        case .notDetermined:
            return "camera.permission.not_determined.title"
        case .authorized:
            return "camera.permission.authorized.title"
        case .denied:
            return "camera.permission.denied.title"
        case .restricted:
            return "camera.permission.restricted.title"
        case .unavailable:
            return "camera.permission.unavailable.title"
        }
    }

    var messageKey: LocalizedStringKey {
        switch self {
        case .notDetermined:
            return "camera.permission.not_determined.message"
        case .authorized:
            return "camera.permission.authorized.message"
        case .denied:
            return "camera.permission.denied.message"
        case .restricted:
            return "camera.permission.restricted.message"
        case .unavailable:
            return "camera.permission.unavailable.message"
        }
    }
}
