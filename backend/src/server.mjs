import http from "node:http";
import { healthResponse } from "./routes/health.mjs";
import { handlePhotoAdvisorRequest } from "./routes/photoAdvisor.mjs";
import { CLOUD_AI_ERROR_CODES } from "./responses/cloudAIErrorCodes.mjs";
import { fallbackCloudAIResponse } from "./responses/fallbackResponse.mjs";
import { CLOUD_AI_LIMITS } from "./security/limits.mjs";

export function createServer() {
  return http.createServer(async (request, response) => {
    try {
      if (request.method === "GET" && request.url === "/health") {
        return sendJson(response, 200, healthResponse());
      }

      if (request.method === "POST" && request.url === "/v1/ai/photo-advisor") {
        const body = await readJsonBody(request);
        const result = await handlePhotoAdvisorRequest(body);
        return sendJson(response, result.status, result.body);
      }

      return sendJson(response, 404, {
        error: {
          code: "not_found",
          message: "Endpoint not found"
        }
      });
    } catch (error) {
      if (error.code === "invalid_json") {
        return sendJson(response, 400, fallbackCloudAIResponse({
          code: CLOUD_AI_ERROR_CODES.invalidJson,
          message: "Request body must be valid JSON"
        }));
      }

      if (error.code === "payload_too_large") {
        return sendJson(response, 413, fallbackCloudAIResponse({
          code: CLOUD_AI_ERROR_CODES.imageTooLarge,
          message: "Image payload is too large"
        }));
      }

      return sendJson(response, error.statusCode ?? 500, {
        error: {
          code: error.code ?? "internal_error",
          message: error.publicMessage ?? "Request could not be handled"
        }
      });
    }
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let raw = "";

    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > CLOUD_AI_LIMITS.maxRequestBodyBytes) {
        const error = new Error("Request body is too large");
        error.statusCode = 413;
        error.code = "payload_too_large";
        error.publicMessage = "Request body is too large";
        reject(error);
        request.destroy();
        return;
      }

      raw += chunk;
    });

    request.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        const error = new Error("Invalid JSON");
        error.statusCode = 400;
        error.code = "invalid_json";
        error.publicMessage = "Request body must be valid JSON";
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 8787);
  createServer().listen(port, () => {
    console.log(`Cloud AI boundary mock server listening on ${port}`);
  });
}
