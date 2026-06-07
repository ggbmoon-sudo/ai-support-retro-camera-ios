import Foundation

protocol AuthService {
    var currentUser: AuthUser? { get async }

    func signIn(email: String, password: String) async throws -> AuthUser
    func createAccount(email: String, password: String) async throws -> AuthUser
    func signInWithGoogle() async throws -> AuthUser
    func signInWithApple() async throws -> AuthUser
    func continueAsGuest() async throws -> AuthUser
    func signOut() async throws
}

enum AuthServiceError: LocalizedError, Equatable {
    case invalidEmail
    case weakPassword
    case notConfigured
    case unsupportedProvider

    var errorDescription: String? {
        switch self {
        case .invalidEmail:
            return "Enter a valid email address."
        case .weakPassword:
            return "Use at least 6 characters for the password."
        case .notConfigured:
            return "Provider setup is not configured yet."
        case .unsupportedProvider:
            return "This provider is only a scaffold in Phase 02."
        }
    }
}
