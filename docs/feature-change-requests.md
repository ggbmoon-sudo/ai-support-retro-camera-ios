# Feature Change Requests

This document tracks proposed product changes after the current local/mock MVP.

The entries below are planning records. They do not authorize implementation, real service integration, or phase changes by themselves.

## Summary Table

| ID | Change | Category | Suggested Phase | Needs Firebase | Needs Real AI | Needs StoreKit / Quota | Privacy / App Store Impact |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FCR-001 | Camera-first launch and main experience | UX redesign | Phase 11 | No | No | No | Low |
| FCR-002 | Large 5:4-ish viewfinder occupying roughly 80% of screen | UX redesign | Phase 11 | No | No | No | Low |
| FCR-003 | Lower-right filter picker entry on camera surface | UX redesign | Phase 11 | No | No | No | Low |
| FCR-004 | Preserve Photo Picker fallback in camera-first flow | UX redesign | Phase 11 | No | No | No | Low |
| FCR-005 | Research richer film / retro / photographer-style filters | Filter expansion | Phase 12 | No | No | No | Medium |
| FCR-006 | Define expanded preset schema and naming rules | Filter expansion | Phase 12 | No | No | No | Medium |
| FCR-007 | Add expanded local filter library | Filter expansion | Phase 13 | No | No | No | Medium |
| FCR-008 | Mock live camera guidance overlay UX | AI live guidance | Phase 14 | No | No | No | Medium |
| FCR-009 | Technical prototype for live guidance | AI live guidance | Phase 15 | No | Maybe later | No | Medium to High |
| FCR-010 | AI reference image to custom filter | AI custom filter | Phase 16 | Yes | Yes | Maybe | High |
| FCR-011 | AI enhanced photo generation / edit | AI image generation | Phase 17 | Yes | Yes | Likely | High |

## FCR-001: Camera-First Launch And Main Experience

Description:

- Make the app open into the camera-first experience instead of making Home the primary first stop.
- Keep History and Settings accessible.
- Keep Home as secondary info / demo guide if still useful.

Category:

- UX redesign.

User value:

- Users understand immediately that this is a camera app.
- Reduces friction before capture.
- Makes the product feel closer to a retro camera than a generic dashboard.

Technical impact scope:

- App root flow.
- Main tab shell / launch routing.
- Camera entry behavior.
- Home role and copy.
- Manual smoke tests and demo script in later implementation phase.

Risks:

- Could break existing mock auth / navigation flow if routing is changed carelessly.
- Could hide important mock/local disclaimers if Home is weakened too much.
- Needs careful small-screen testing.

Suggested phase:

- Phase 11.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Low. This is local UI flow only, as long as no new data flow is added.

## FCR-002: Large 5:4-Ish Viewfinder

Description:

- Make the camera viewfinder the dominant visual surface.
- Target roughly 80% of the camera screen.
- Use a visual frame that leans toward 5:4 composition for retro / editorial framing.

Category:

- UX redesign.

User value:

- Makes the app feel camera-native.
- Helps users compose photos in a more intentional frame.
- Supports the future live guidance direction.

Technical impact scope:

- Camera view layout.
- Preview container sizing.
- Safe-area behavior.
- Simulator camera-unavailable state.
- Photo Picker fallback and selected photo preview layout.

Risks:

- Real camera preview and simulator fallback may need different layout handling.
- Small devices could hide controls if the 80% target is applied too rigidly.
- 5:4 framing must not distort captured images unless explicitly scoped.

Suggested phase:

- Phase 11.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Low.

## FCR-003: Lower-Right Filter Picker Entry

Description:

- Add a filter selection entry near the lower-right of the camera surface.
- Make filter switching feel like part of shooting, not only post-capture review.
- In Phase 11, preserve existing presets only.

Category:

- UX redesign.

User value:

- Faster creative decision-making during shooting.
- Better aligns with retro camera workflows.
- Makes filters feel like a primary product feature.

Technical impact scope:

- Camera controls.
- Filter preset selector entry point.
- Selected preset state.
- Existing filter preview flow.

Risks:

- Could duplicate existing filter selector behavior.
- Could imply live filter preview if the current implementation only applies filters after selection / capture.
- Needs clear mock/local behavior.

Suggested phase:

- Phase 11.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Low.

## FCR-004: Preserve Photo Picker Fallback

Description:

- Keep Photo Picker available in the camera-first experience.
- Make it usable on Simulator where live camera preview may be unavailable.

Category:

- UX redesign.

User value:

- Keeps demo reliability high.
- Allows users to apply filters and mock AI advice even without camera capture.

Technical impact scope:

- Camera controls.
- Photo Picker entry.
- Selected/imported photo flow.
- Demo script.

Risks:

- If camera-first layout prioritizes live capture too strongly, imported-photo flow may become harder to find.
- Needs clear copy on Simulator.

Suggested phase:

- Phase 11.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Low. Uses existing local-only photo picker behavior.

## FCR-005: Filter Research

Description:

- Research popular film, retro camera, and photographer-style color looks.
- Identify filter families that feel broadly desirable without relying on unlicensed brand assets or confusing trademarked names.

Category:

- Filter expansion.

User value:

- Users get a richer creative camera experience.
- Makes the app more differentiated before AI or subscription work.

Technical impact scope:

- Product research docs.
- Preset naming and taxonomy.
- Possible future Core Image parameter map.

Risks:

- Trademark / brand naming risk if real film-stock names are used carelessly.
- Subjective visual taste can produce too many similar presets.
- Some looks may require more complex image processing than current Core Image basics.

Suggested phase:

- Phase 12.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Medium. Naming, paid preset claims, and visual claims should be reviewed.

## FCR-006: Expanded Preset Schema

Description:

- Define a richer preset schema for local filters before adding many presets.
- Include parameters such as contrast, warmth, saturation, fade, grain, vignette, highlight handling, shadow lift, and category metadata.

Category:

- Filter expansion.

User value:

- Makes filters easier to extend, compare, and eventually customize.
- Reduces ad hoc preset drift.

Technical impact scope:

- Filter preset model.
- Filter catalog.
- Filter pipeline.
- Localization.
- Future custom filter compatibility.

Risks:

- Schema can become overbuilt if it tries to support every future AI/custom feature too early.
- Needs backward compatibility with current presets.

Suggested phase:

- Phase 12.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Medium if schema later supports paid/custom/user-generated filters.

## FCR-007: Expanded Local Filter Library

Description:

- Add more local Core Image filters after research and schema work.
- Keep all filters local-only in this phase.

Category:

- Filter expansion.

User value:

- More creative variety.
- Better reason to use the app even before real AI and cloud services.

Technical impact scope:

- Filter catalog.
- Filter pipeline.
- Preset selector UI.
- Camera-first filter picker.
- Manual visual QA.

Risks:

- Performance risk if too many previews render at once.
- Visual consistency risk across images.
- Localization and preset naming can become noisy.

Suggested phase:

- Phase 13.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Medium. Avoid misleading paid/brand claims.

## FCR-008: Mock Live Camera Guidance Overlay

Description:

- Add a mock-only live guidance overlay on the viewfinder.
- Use static / simulated hints for composition, lighting, or pose.
- Clearly label it as mock guidance.

Category:

- AI live guidance.

User value:

- Lets the team test whether live guidance feels helpful before real AI work.
- Helps shape the future AI interaction model.

Technical impact scope:

- Camera overlay layout.
- Guidance card / hint display.
- Toggle / dismiss behavior.
- Copy and localization.

Risks:

- Users may mistake mock guidance for real AI if labels are unclear.
- Overlay can clutter the viewfinder.
- Guidance may distract from capture controls.

Suggested phase:

- Phase 14.

Needs real Firebase:

- No.

Needs real AI:

- No.

Needs StoreKit / quota:

- No.

Privacy / App Store impact:

- Medium. Must not claim real AI or real analysis.

## FCR-009: Live Guidance Technical Prototype

Description:

- Prototype simple live guidance using local/on-device signals first.
- Evaluate feasibility for framing, brightness, and simple composition hints.

Category:

- AI live guidance.

User value:

- Moves toward real-time shooting support without immediately incurring cloud AI cost.
- Helps determine whether the product can guide users before capture.

Technical impact scope:

- Camera frame pipeline.
- Possible Vision integration.
- Performance instrumentation.
- Camera overlay state.

Risks:

- Frame analysis can affect performance and battery.
- Vision integration can complicate camera threading.
- Privacy and App Store review become more important if analysis behavior changes.

Suggested phase:

- Phase 15.

Needs real Firebase:

- No for local prototype.

Needs real AI:

- Not for on-device prototype; maybe later if cloud AI is explicitly approved.

Needs StoreKit / quota:

- No for prototype.

Privacy / App Store impact:

- Medium to High, depending on whether any image/frame data leaves the device.

## FCR-010: AI Reference-To-Filter

Description:

- Let users upload or select a reference image.
- AI analyzes the look and creates a reusable custom filter recipe for the app.

Category:

- AI custom filter.

User value:

- Users can recreate a look they like.
- Makes the app feel personalized.
- Could become a future premium feature.

Technical impact scope:

- Reference image input.
- Backend upload / temporary processing path.
- Cloud Functions AI proxy.
- AI provider adapter.
- Custom filter recipe schema.
- Consent, deletion, retention, and safety handling.
- Possible cloud persistence for saved custom filters.

Risks:

- High privacy risk because reference images may contain people or private scenes.
- High provider cost and abuse risk.
- Needs strict API key handling and server-side processing.
- Needs clear policy around copyrighted reference styles and brand names.

Suggested phase:

- Phase 16.

Needs real Firebase:

- Yes, if reference images or custom filters are stored or processed server-side.

Needs real AI:

- Yes.

Needs StoreKit / quota:

- Maybe. Strongly recommended before public use because this feature can create provider cost.

Privacy / App Store impact:

- High.

## FCR-011: AI Enhanced Photo Generation / Edit

Description:

- Generate an improved version of a user's photo based on the original image and AI advice.
- Treat as a later, high-cost AI generation/edit feature.

Category:

- AI image generation.

User value:

- Lets users see a concrete improved result, not only text suggestions.
- Could become a premium differentiator.

Technical impact scope:

- Backend image generation / editing provider.
- Storage for input and output images.
- Firestore metadata.
- Quota and billing controls.
- Moderation and safety checks.
- Consent, retention, deletion, and App Store privacy review.
- UI for comparing original vs generated output.

Risks:

- Very high cost risk.
- High privacy risk.
- Provider policy and content safety risk.
- Generated output may mislead users if not clearly labeled.
- Needs robust quota enforcement and abuse prevention.

Suggested phase:

- Phase 17.

Needs real Firebase:

- Yes.

Needs real AI:

- Yes.

Needs StoreKit / quota:

- Likely yes before broad use.

Privacy / App Store impact:

- High.
