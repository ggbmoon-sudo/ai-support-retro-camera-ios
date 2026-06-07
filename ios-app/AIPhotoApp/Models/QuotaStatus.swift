import SwiftUI

struct QuotaStatus: Hashable {
    let analysisRemaining: Int
    let photoCount: Int
    let photoLimit: Int

    var isLow: Bool {
        analysisRemaining <= 3 || photoCount >= max(photoLimit - 3, 0)
    }

    var localizedSummaryKey: LocalizedStringKey {
        "quota.summary"
    }
}

extension QuotaStatus {
    static let sample = QuotaStatus(analysisRemaining: 20, photoCount: 0, photoLimit: 20)
    static let lowSample = QuotaStatus(analysisRemaining: 2, photoCount: 18, photoLimit: 20)
}
