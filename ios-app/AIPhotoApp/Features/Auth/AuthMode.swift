import SwiftUI

enum AuthMode: String, CaseIterable, Identifiable {
    case signIn
    case createAccount

    var id: String { rawValue }

    var titleKey: LocalizedStringKey {
        switch self {
        case .signIn:
            return "auth.mode.sign_in"
        case .createAccount:
            return "auth.mode.create_account"
        }
    }
}
