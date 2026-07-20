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
            message = "Cloud photo analysis sends the compressed photo you choose to our server and a third-party AI service for one-time processing.\nIt will not upload in the background. This app and our backend do not store the original or compressed image or use it for training."
            footer = "Third-party handling follows its service terms. You can cancel and keep using local features."
            acceptTitle = "Continue"
            cancelTitle = "Cancel"
        case .traditionalChinese:
            title = "雲端相片分析"
            message = "雲端相片分析會把你選擇的壓縮相片傳送到我們的伺服器和第三方 AI 服務作一次性處理。\n相片不會在背景上傳；本 App 和我們的後端不會保存原圖或壓縮圖，也不會用作訓練。"
            footer = "第三方會按其服務條款處理資料。你可以取消，繼續使用本機功能。"
            acceptTitle = "繼續"
            cancelTitle = "取消"
        case .simplifiedChinese:
            title = "云端照片分析"
            message = "云端照片分析会把你选择的压缩照片传送到我们的服务器和第三方 AI 服务进行一次性处理。\n照片不会在后台上传；本 App 和我们的后端不会保存原图或压缩图，也不会用于训练。"
            footer = "第三方会按其服务条款处理数据。你可以取消，继续使用本机功能。"
            acceptTitle = "继续"
            cancelTitle = "取消"
        case .cantonese:
            title = "雲端相片分析"
            message = "雲端相片分析會將你揀嘅壓縮相傳去我哋伺服器同第三方 AI 服務做一次處理。\n唔會背景偷偷上傳；本 App 同我哋 backend 唔會保存原圖或者壓縮圖，亦唔會用嚟訓練。"
            footer = "第三方會按佢嘅服務條款處理資料。你可以取消，繼續用本機功能。"
            acceptTitle = "繼續"
            cancelTitle = "取消"
        }
    }
}
