import Foundation

struct AuthUser: Identifiable, Equatable {
    let id: String
    let email: String?
    let displayName: String
    let providerID: AuthProviderID
    let isGuest: Bool
}
