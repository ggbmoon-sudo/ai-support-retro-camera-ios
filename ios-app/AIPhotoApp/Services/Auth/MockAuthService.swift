import Foundation

final class MockAuthService: AuthService {
    private var signedInUser: AuthUser?

    var currentUser: AuthUser? {
        get async { signedInUser }
    }

    func signIn(email: String, password: String) async throws -> AuthUser {
        try validate(email: email, password: password)
        return setMockUser(email: email, displayName: email, providerID: .password)
    }

    func createAccount(email: String, password: String) async throws -> AuthUser {
        try validate(email: email, password: password)
        return setMockUser(email: email, displayName: email, providerID: .password)
    }

    func signInWithGoogle() async throws -> AuthUser {
        setMockUser(
            email: "google-user@example.invalid",
            displayName: "Google Mock User",
            providerID: .google
        )
    }

    func signInWithApple() async throws -> AuthUser {
        setMockUser(
            email: "apple-user@example.invalid",
            displayName: "Apple Mock User",
            providerID: .apple
        )
    }

    func continueAsGuest() async throws -> AuthUser {
        setMockUser(
            email: nil,
            displayName: "Guest",
            providerID: .guest,
            isGuest: true
        )
    }

    func signOut() async throws {
        signedInUser = nil
    }

    private func validate(email: String, password: String) throws {
        guard email.contains("@"), email.contains(".") else {
            throw AuthServiceError.invalidEmail
        }

        guard password.count >= 6 else {
            throw AuthServiceError.weakPassword
        }
    }

    @discardableResult
    private func setMockUser(
        email: String?,
        displayName: String,
        providerID: AuthProviderID,
        isGuest: Bool = false
    ) -> AuthUser {
        let user = AuthUser(
            id: "mock-\(providerID.rawValue)",
            email: email,
            displayName: displayName,
            providerID: providerID,
            isGuest: isGuest
        )
        signedInUser = user
        return user
    }
}
