import SwiftUI
import Combine

@MainActor
final class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var mode: AuthMode = .signIn
    @Published private(set) var currentUser: AuthUser?
    @Published private(set) var isLoading = false
    @Published var errorMessage: String?

    private let service: AuthService

    init(service: AuthService) {
        self.service = service
    }

    func refreshSession() async {
        currentUser = await service.currentUser
    }

    func submitEmailPassword() async {
        await runAuthAction {
            switch mode {
            case .signIn:
                return try await service.signIn(email: email, password: password)
            case .createAccount:
                return try await service.createAccount(email: email, password: password)
            }
        }
    }

    func signInWithGoogle() async {
        await runAuthAction {
            try await service.signInWithGoogle()
        }
    }

    func signInWithApple() async {
        await runAuthAction {
            try await service.signInWithApple()
        }
    }

    func continueAsGuest() async {
        await runAuthAction {
            try await service.continueAsGuest()
        }
    }

    func signOut() async {
        isLoading = true
        errorMessage = nil

        do {
            try await service.signOut()
            currentUser = nil
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }

    private func runAuthAction(_ action: () async throws -> AuthUser) async {
        isLoading = true
        errorMessage = nil

        do {
            currentUser = try await action()
        } catch {
            errorMessage = error.localizedDescription
        }

        isLoading = false
    }
}
