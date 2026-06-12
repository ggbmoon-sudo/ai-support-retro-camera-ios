import { mockPhotoAdvisorResponse } from "../providers/mockProvider.mjs";
import { validatePhotoAdvisorRequest } from "../validators/validatePhotoAdvisorRequest.mjs";
import { validateCloudAIResponse } from "../validators/validateCloudAIResponse.mjs";

export function handlePhotoAdvisorRequest(requestBody) {
  const requestValidation = validatePhotoAdvisorRequest(requestBody);
  if (!requestValidation.ok) {
    return {
      status: 400,
      body: {
        error: requestValidation.error
      }
    };
  }

  const response = mockPhotoAdvisorResponse({
    locale: requestBody.locale ?? "zh-Hant-HK",
    selectedFilterId: requestBody.selectedFilterId ?? null
  });
  const responseValidation = validateCloudAIResponse(response);

  if (!responseValidation.ok) {
    return {
      status: 500,
      body: {
        error: responseValidation.error
      }
    };
  }

  return {
    status: 200,
    body: response
  };
}
