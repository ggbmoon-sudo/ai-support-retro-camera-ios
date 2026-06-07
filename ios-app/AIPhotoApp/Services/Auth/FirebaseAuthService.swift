import Foundation

final class FirebaseAuthService: AuthService {
    var currentUser: AuthUser? {
        get async { nil }
    }

    // TODO(Phase 02 follow-up): Connect FirebaseAuth after a verified Xcode project,
    // Firebase Apple SDK dependencies, and local-only GoogleService-Info.plist exist.
    func signIn(email: String, password: String) async throws -> AuthUser {
        throw AuthServiceError.notConfigured
    }

    func createAccount(email: String, password: String) async throws -> AuthUser {
        throw AuthServiceError.notConfigured
    }

    func signInWithGoogle() async throws -> AuthUser {
        throw AuthServiceError.notConfigured
    }

    func signInWithApple() async throws -> AuthUser {
        throw AuthServiceError.notConfigured
    }

    func continueAsGuest() async throws -> AuthUser {
        throw AuthServiceError.notConfigured
    }

    func signOut() async throws {
        throw AuthServiceError.notConfigured
    }
}
