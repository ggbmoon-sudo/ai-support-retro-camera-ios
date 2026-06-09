import Foundation

nonisolated enum PhotoStoragePath {
    static func firestoreDocumentPath(ownerId: String, photoId: String) -> String {
        "users/\(sanitizedPathComponent(ownerId))/photos/\(sanitizedPathComponent(photoId))"
    }

    static func previewPath(ownerId: String, photoId: String) -> String {
        "\(photoDirectory(ownerId: ownerId, photoId: photoId))/preview.jpg"
    }

    static func thumbnailPath(ownerId: String, photoId: String) -> String {
        "\(photoDirectory(ownerId: ownerId, photoId: photoId))/thumb.jpg"
    }

    static func originalPath(ownerId: String, photoId: String) -> String {
        "\(photoDirectory(ownerId: ownerId, photoId: photoId))/original.jpg"
    }

    private static func photoDirectory(ownerId: String, photoId: String) -> String {
        "users/\(sanitizedPathComponent(ownerId))/photos/\(sanitizedPathComponent(photoId))"
    }

    private static func sanitizedPathComponent(_ value: String) -> String {
        value
            .lowercased()
            .filter { character in
                character.isLetter || character.isNumber || character == "-" || character == "_"
            }
    }
}
