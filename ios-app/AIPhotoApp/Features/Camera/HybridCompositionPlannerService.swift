import Foundation

protocol HybridCompositionPlannerService: Sendable {
    func analyze(_ input: HybridCompositionPlannerInput) async throws -> HybridCompositionPlannerResponse
}

struct RemoteHybridCompositionPlannerService: HybridCompositionPlannerService {
    let endpointClient: CloudAIEndpointClient

    init(endpointClient: CloudAIEndpointClient = CloudAIEndpointClient(timeoutSeconds: 95)) {
        self.endpointClient = endpointClient
    }

    func analyze(_ input: HybridCompositionPlannerInput) async throws -> HybridCompositionPlannerResponse {
        guard input.consent.imageUploadAccepted else {
            throw CloudAIServiceError.consentRequired
        }

        #if DEBUG
        let response = try await endpointClient.postCompositionPlanner(
            HybridCompositionPlannerRequest(input: input)
        )
        guard response.schemaVersion == "1.1",
              response.mode == "composition_live_keyframe",
              response.source == .cloud,
              response.safety.containsSensitiveInference == false,
              response.safety.requiresUserConsent,
              response.error == nil,
              response.plan != nil else {
            throw CloudAIServiceError.invalidResponse(["invalid_composition_plan"])
        }
        return response
        #else
        throw CloudAIServiceError.remoteDisabled
        #endif
    }
}
