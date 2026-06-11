import Combine
import Foundation

@MainActor
final class CameraPoseOverlayState: ObservableObject {
    @Published private(set) var selectedPoseGuide: PoseGuide?
    @Published private(set) var isPoseOverlayEnabled = false
    @Published private(set) var isPoseMirrored = false
    @Published private(set) var poseOverlayOpacity = 0.5

    var activePoseGuide: PoseGuide? {
        guard isPoseOverlayEnabled else { return nil }
        return selectedPoseGuide
    }

    func selectPoseGuide(_ guide: PoseGuide) {
        selectedPoseGuide = guide
        isPoseOverlayEnabled = true
        isPoseMirrored = false
        poseOverlayOpacity = max(guide.defaultOpacity, 0.5)
    }

    func closePoseOverlay() {
        isPoseOverlayEnabled = false
        selectedPoseGuide = nil
        isPoseMirrored = false
        poseOverlayOpacity = 0.5
    }

    func mirrorPoseOverlay() {
        guard selectedPoseGuide?.supportsMirroring == true else { return }
        isPoseMirrored.toggle()
    }
}
