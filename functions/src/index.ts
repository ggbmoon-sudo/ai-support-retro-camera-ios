import { onCall } from "firebase-functions/v2/https";

export const helloCallable = onCall(async (request) => {
  return {
    ok: true,
    message: "Cloud Functions placeholder is ready.",
    uid: request.auth?.uid ?? null,
  };
});
