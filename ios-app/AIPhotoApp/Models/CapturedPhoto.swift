import UIKit

struct CapturedPhoto: Identifiable {
    enum Source {
        case camera
        case photoLibrary
    }

    let id = UUID()
    let image: UIImage
    let source: Source
}
