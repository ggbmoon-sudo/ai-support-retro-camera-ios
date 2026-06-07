import Foundation

enum AuthProviderID: String, CaseIterable, Identifiable {
    case password
    case google
    case apple
    case guest

    var id: String { rawValue }
}
