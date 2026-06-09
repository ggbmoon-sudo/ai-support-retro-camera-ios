import { onCall } from "firebase-functions/v2/https";
export { analyzePhoto } from "./analyzePhoto";

export const helloCallable = onCall(async (request) => {
  return {
    ok: true,
    message: "Cloud Functions placeholder is ready.",
    uid: request.auth?.uid ?? null,
  };
});
