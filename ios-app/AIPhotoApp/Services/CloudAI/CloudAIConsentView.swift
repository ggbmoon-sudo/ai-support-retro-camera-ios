import SwiftUI

struct CloudAIConsentView: View {
    @ObservedObject private var toneSettings = CameraCoachToneSettingsStore.shared

    let onAccept: (CloudAIConsent) -> Void
    let onCancel: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Label {
                Text(copy.title)
                    .font(.headline)
            } icon: {
                Image(systemName: "cloud")
            }

            Text(copy.message)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            Text(copy.footer)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            HStack(spacing: 12) {
                Button(copy.cancelTitle, action: onCancel)
                    .buttonStyle(.bordered)

                Button(copy.acceptTitle) {
                    onAccept(.acceptedCurrent)
                }
                .buttonStyle(.borderedProminent)
            }
        }
        .padding()
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .accessibilityElement(children: .contain)
    }

    private var copy: CloudAIConsentCopy {
        CloudAIConsentCopy(language: toneSettings.runtimeLanguageMode)
    }
}

private struct CloudAIConsentCopy {
    let title: String
    let message: String
    let footer: String
    let acceptTitle: String
    let cancelTitle: String

    init(language: AppLanguageMode) {
        switch language {
        case .english:
            title = "Cloud photo analysis"
            message = "Cloud photo analysis uploads the compressed photo you choose to our server for a one-time analysis.\nPhotos will not upload in the background, and neither the original nor compressed image will be stored."
            footer = "You can cancel and keep using local features."
            acceptTitle = "Continue"
            cancelTitle = "Cancel"
        case .traditionalChinese:
            title = "雲端相片分析"
            message = "雲端相片分析會上傳你選擇的壓縮相片到我們的伺服器作一次性分析。\n相片不會在背景上傳，也不會保存原圖或壓縮圖。"
            footer = "你可以取消，繼續使用本機功能。"
            acceptTitle = "繼續"
            cancelTitle = "取消"
        case .simplifiedChinese:
            title = "云端照片分析"
            message = "云端照片分析会上传你选择的压缩照片到我们的服务器进行一次性分析。\n照片不会在后台上传，也不会保存原图或压缩图。"
            footer = "你可以取消，继续使用本机功能。"
            acceptTitle = "继续"
            cancelTitle = "取消"
        case .cantonese:
            title = "雲端相片分析"
            message = "雲端相片分析會上傳你揀嘅壓縮相到我哋伺服器做一次分析。\n唔會背景偷偷上傳，亦唔會保存原圖或者壓縮圖。"
            footer = "你可以取消，繼續用本機功能。"
            acceptTitle = "繼續"
            cancelTitle = "取消"
        }
    }
}
