# Open-weight VLM Expanded Fixture Registry Plan

Status: Phase 20-F backend-only dry-run gate
Date: 2026-06-16
Scope: Windows-primary local/private VLM fixture planning

## Purpose

Phase 20-F prepares a safer expanded local VLM smoke set without running a real model. It defines target fixture categories, a sanitized registry metadata schema, approval rules, privacy/safety exclusions, dry-run validation, and future controlled smoke rules.

This phase does not commit fixture images, local fixture registries, local config, model outputs, raw reports, logs, model weights, credentials, raw paths, prompts, request payloads, or local server details. It keeps `productionReady:false`.

## Target Fixture Categories

The expanded registry targets 8-12 approved local fixtures selected from these categories:

- `bright_daylight_clean`
- `low_light_grain`
- `motion_blur_intentional`
- `severe_blur_reject`
- `high_contrast_shadow`
- `faded_color_retro`
- `warm_indoor_ambient`
- `street_chrome_high_contrast`
- `soft_focus_dreamy`
- `overexposed_unreadable`
- `imported_limited_context`
- `black_or_near_black_unreadable`

The core dry-run coverage set is eight categories: `bright_daylight_clean`, `low_light_grain`, `motion_blur_intentional`, `severe_blur_reject`, `high_contrast_shadow`, `faded_color_retro`, `imported_limited_context`, and `black_or_near_black_unreadable`.

## Fixture Metadata Schema

Committed tests use sanitized sample entries only. Real local registry entries must remain ignored under `backend/config/open-weight-vlm.fixtures.local.json`.

Each registry entry should contain only:

- `fixtureId`: short non-sensitive token.
- `category`: one target category.
- `sourceType`: `captured`, `imported`, or `synthetic_local_fixture`.
- `approvedForLocalSmoke`: boolean.
- `metadataStripped`: boolean.
- `privacyReviewed`: boolean.
- `containsFace`: must be `false` for approved smoke.
- `containsSensitiveContent`: must be `false` for approved smoke.
- `containsPrivateIdentifier`: must be `false` for approved smoke.
- `expectedAllowedContext`: `captureContextAvailable`, `imageOnly`, or `unknown`.
- `expectedRiskBucket`: `none`, `mild`, `moderate`, or `severe_unusable`.
- `expectedCreativeIntentBucket`: `style_positive`, `acceptable_imperfection`, `technical_risk`, or `unknown`.
- `expectedFilterFamilyCandidate`: optional allowed filter family bucket.
- `notesBucket`: optional sanitized bucket only.

The schema must not include raw fixture paths, image filenames, GPS/EXIF values, people descriptors, user identifiers, prompts, request payloads, model outputs, URLs, credentials, or local server details.

## Fixture Approval Rules

A fixture may be approved for local smoke only when:

- It belongs to a known category.
- It uses a short fixture ID token instead of a path.
- It is approved for local smoke.
- Metadata has been stripped.
- Privacy review is complete.
- It has no face presence.
- It has no sensitive content.
- It has no private identifier.
- Expected context/risk/creative/filter buckets are valid.
- The fixture image and real registry stay ignored/untracked/unstaged.

Dry-run statuses:

- `approved_for_local_smoke`
- `blocked_missing_metadata_strip`
- `blocked_privacy_review_missing`
- `blocked_sensitive_content`
- `blocked_private_identifier`
- `blocked_face_presence`
- `blocked_unknown_category`
- `blocked_invalid_schema`
- `blocked_unapproved_fixture`

## Privacy And Safety Exclusion Rules

Do not approve fixtures that contain:

- Real user/customer/private photos.
- Identifiable faces.
- Private identifiers such as addresses, documents, licenses, usernames, screens, accounts, plates, badges, or private interiors.
- Sensitive content or protected/sensitive personal attributes.
- GPS, raw EXIF, raw sensor values, or location-bearing metadata.
- Images that would invite identity, face, skin, age, gender, beauty, attractiveness, emotion, health, body, race, religion, disability, sexuality, or other sensitive inference.

Use neutral, self-created, synthetic, or non-sensitive local fixtures whenever possible.

## Coverage Matrix

| Category | Main Signal | Expected Context | Expected Risk | Expected Intent |
| --- | --- | --- | --- | --- |
| `bright_daylight_clean` | daylight / clean detail | `captureContextAvailable` | `mild` | `style_positive` |
| `low_light_grain` | low light / grain | `captureContextAvailable` | `mild` | `acceptable_imperfection` |
| `motion_blur_intentional` | motion / blur | `captureContextAvailable` | `mild` | `acceptable_imperfection` |
| `severe_blur_reject` | unreadable blur | `captureContextAvailable` | `severe_unusable` | `technical_risk` |
| `high_contrast_shadow` | contrast / shadow | `captureContextAvailable` | `mild` | `style_positive` |
| `faded_color_retro` | faded color | `captureContextAvailable` | `mild` | `style_positive` |
| `warm_indoor_ambient` | warm indoor light | `captureContextAvailable` | `mild` | `style_positive` |
| `street_chrome_high_contrast` | street chrome / contrast | `captureContextAvailable` | `mild` | `style_positive` |
| `soft_focus_dreamy` | soft focus | `captureContextAvailable` | `mild` | `acceptable_imperfection` |
| `overexposed_unreadable` | severe overexposure | `captureContextAvailable` | `severe_unusable` | `technical_risk` |
| `imported_limited_context` | imported image-only context | `imageOnly` | `mild` | `style_positive` |
| `black_or_near_black_unreadable` | black / near-black frame | `captureContextAvailable` | `severe_unusable` | `technical_risk` |

## Dry-run Gate Rules

Run from `backend/`:

```sh
npm run qa:open-weight-vlm:expanded-fixtures
```

The dry-run gate:

- runs no network calls
- does not call a model
- does not require local config
- does not require actual images
- validates sanitized sample registry entries
- prints sanitized aggregate output only
- keeps `productionReady:false`

The output includes:

- `totalFixtures`
- `approvedCount`
- `blockedCount`
- `categoryCoverage`
- `missingRequiredCategories`
- `blockedReasonCounts`
- `eligibleForControlledSmoke`
- `productionReady:false`
- `networkCallsMade:false`

## Future Controlled Smoke Rules

A later Phase 20-G controlled 6-8 fixture smoke may be considered only after:

- Phase 20-F is committed and pushed.
- Existing local VLM gates still pass.
- The ignored local registry contains approved entries only.
- Fixture images are metadata-stripped, privacy-reviewed, ignored, and unstaged.
- Windows healthz is safe and raw logging is disabled.
- The operator explicitly approves real local/private model calls for that phase.
- The run uses fixture IDs only.
- Each fixture is called exactly once.
- No retries are used to chase pass rate.
- Results are sanitized per-fixture and aggregate buckets only.

Phase 20-G must still not imply iOS integration, app-facing endpoints, production endpoints, training/fine-tuning, serving-stack benchmarking, or production rollout unless a future explicit phase says so.

## Phase 20-G Blocked Smoke Observation

The Phase 20-G approved eight-fixture smoke was attempted after the ignored local registry dry-run passed. The controlled run used exactly eight fixture tokens, one call per fixture, no retries, and sanitized results only.

Sanitized result:

- `fixtureCount:8`
- `approved registry entries:8`
- `acceptedCount:0`
- `rejectedCount:8`
- `fallbackCategoryCounts:blocked_for_provider_integration x8`
- `latencyBucketCounts:lt_1s x8`
- no schema diagnostic buckets
- `networkCallsMade:true`
- `productionReady:false`
- raw persistence flags false

This indicates a provider-integration or local server fixture-handling block before schema validation, not a fixture registry schema block. Future work should diagnose expanded fixture availability and request handling in the local/private Windows server before any further expanded smoke attempt.

## Phase 20-H Provider Diagnostic Result

Phase 20-H added a no-model backend diagnostic for the Phase 20-G provider-integration block. The diagnostic classifies the sanitized aggregate as a pre-inference block with likely server fixture unavailability / healthz availability gap, unlikely schema validator involvement, unsafe real-smoke retry status, and eligibility for a contract-echo fixture-routing check.

Sanitized external server inspection found the server workspace only advertises the original fixture token bucket while the backend expanded registry expects the approved eight-token set. Treat the root cause as a backend registry to external server fixture availability / routing mismatch until a no-model contract-echo check proves otherwise.

No real model smoke, fixture expansion, raw artifact output, iOS integration, app-facing endpoint, production endpoint, or production readiness change is approved by this diagnosis.

## Phase 20-I Routing Echo Result

Phase 20-I added a local/private no-model fixture routing contract echo for the approved eight-token set. The Windows server route and backend CLI verify routing without Qwen inference, prompt creation, model output, raw image path output, request payload output, or production readiness.

Sanitized aggregate passed: `totalFixtureTokens:8`, `routeableCount:8`, `unavailableCount:0`, `modelInferenceRun:false`, raw persistence flags false, `networkCallsMade:true`, and `productionReady:false`.

This makes the expanded fixture registry routeability issue resolved for planning purposes only. A future real smoke still requires explicit approval and all existing gates to pass again.

## Boundary Confirmation

Phase 20-F is backend-only and Windows-primary. It prepares controlled expanded smoke, but does not run it. No fixture images, local registry, local config, raw paths, prompts, model outputs, request payloads, reports, logs, weights, or credentials are committed. iOS behavior is unchanged. `productionReady:false` remains required.
