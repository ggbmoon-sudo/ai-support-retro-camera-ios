# PT2-SF-R9-R15-X1 - Xiaoyi Luna Relay Rebuild

Status: implemented; recipe schema aligned; internal/debug backend switched and verified  
Date: 2026-07-19  
Production readiness: `productionReady:false`

## Decision

Use a fresh backend provider implementation for the Xiaoyi `gpt-5.6-luna` candidate. Do not route Luna through the historical `XiaoyiDeepseekRelayProvider`.

The supplied integration guide and OpenAPI records establish:

- server: `https://xiaoyiapi.xyz`;
- Luna-verified route: `POST /v1/chat/completions`;
- authentication: backend-only `Authorization: Bearer <XIAOYI_API_KEY>`;
- non-stream response text: `choices[0].message.content`;
- JSON mode is described through `response_format: {"type":"json_object"}`;
- `/v1/responses` exists but is not established as the Luna route;
- the published Chat Completions schema does not establish multimodal image content parts.

## Implementation

- Added the fresh `XiaoyiLunaRelayProvider` and runtime mode `xiaoyiLunaInternal`.
- Kept the historical Xiaoyi DeepSeek adapter and mode intact but separate; the new mode never resolves it.
- Pinned the base URL, Chat Completions path, Luna-only allowlist, JSON response mode, non-stream request, 2,000 output-token cap, and 90-second total upstream timeout.
- Added `XIAOYI_MODEL` support while retaining surface-specific model overrides; only `gpt-5.6-luna` is accepted.
- Kept the existing internal/debug authorization gate, one-style-reference-image upload boundary, consent checks, strict recipe `1.1` validation, safe fallback, and optional sanitized artifact path.
- Added sanitized validator failure buckets so prompt/schema alignment can identify only the failing contract field without retaining provider output.
- Added Luna-specific typing constraints for the string recipe version and safe generated recipe ID without weakening or normalizing the strict validator.
- Kept SiliconFlow available as the rollback configuration after the current internal/debug backend process switched to Luna.

## Live Smoke Result

The operator supplied credentials through an external, untracked local text file. No key value was printed, copied into the repo, written to `.env.local`, or included in logs.

Earlier credential result:

- Two sanitized probes returned HTTP 401.

Replacement-key bounded result:

- Text requests: 1; HTTP 200; choice present; `finish_reason:stop`; exact expected reply matched.
- Initial synthetic-image request: HTTP 200, then rejected as `provider_invalid_schema`.
- Sanitized diagnosis identified `recipe_version`, then `id`, without exposing raw response text.
- After prompt alignment, the zero-retry synthetic-image request returned HTTP 200 and passed the strict recipe `1.1` validator with all 12 renderer parameters.
- A backend route smoke then passed on its first attempt and wrote one ignored `filter_lab_sanitized_analysis.v1` artifact.
- The running `POST /v1/ai/filter-lab` HTTP endpoint passed with `mode:filter_generation`, `source:cloud`, recipe `1.1`, all 12 parameters, and no sensitive-inference flag.
- Localhost and `http://192.168.68.60:8787/health` both report `xiaoyiLunaInternal`, Filter Lab ready, and `productionReady:false`.
- Filter Lab contract compatibility: yes. Image-conditioned visual fidelity still requires comparison with the operator's real target/original/result set in Xcode.

The sandboxed network attempt and local path-decoding failure did not reach a provider model and are not counted as upstream HTTP requests.

## Verification

- Focused backend and sanitized artifact tests pass.
- Full backend test suite after final alignment passed: 425 passed, 0 failed.
- Runtime registry resolves `xiaoyiLunaInternal` to `XiaoyiLunaRelayProvider`.
- Offline request-shape tests confirm the pinned URL/path, Bearer auth, JSON accept header, non-stream mode, 2,000-token cap, JSON mode, image placeholder shape, parser, and recipe validator.

## Next Gate

1. On the physical iPhone, use the same target/original pair and save the Luna-generated result by long-pressing the after image.
2. Compare the target, original, result, intensity, and ignored sanitized recipe artifact; tune only evidence-backed prompt/renderer semantics.
3. Re-inject the external key when the backend process is restarted; it was not copied into tracked or ignored repo config.
4. Keep the provider internal/debug only and retain SiliconFlow as rollback until repeated real-image fidelity checks pass.

No iOS source/project/localization change is required for this backend candidate. Xcode runtime behavior should remain unchanged.
