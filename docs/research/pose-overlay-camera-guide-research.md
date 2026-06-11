# Pose Overlay Camera Guide Research

Phase: 16D  
Status: Research report backfill / documentation-only  
Source: `Pose Overlay 與 Pose Master 類型相機導引在 iOS Camera App 的深入研究報告.md`

This document captures the implementation-relevant conclusions for a future Pose Overlay / Pose Master-like camera guide in the iOS-first retro camera app.

It is not an implementation spec. It does not add Pose Overlay, does not modify Camera UI, does not add Vision body pose detection, does not connect AI, and does not change app behavior.

---

## 1. Executive Summary

Pose Overlay is worth building.

It is a strong fit for a camera-first retro camera app because it helps users before they press the shutter. It can turn "I do not know how to pose" into "I can line up with this guide and shoot now."

Recommended MVP direction:

- Build a low-risk, low-complexity, non-AI static pose overlay first.
- Use Pose Overlay as a visual camera guide, not as a body-analysis system.
- First version should not use AI.
- First version should not use Apple Vision body pose detection.
- First version should not implement pose score, body score, beauty score, attractiveness score, or appearance rating.
- First version should not upload camera frames.
- First version should not store raw frames, body pose data, or request payloads.

The recommended first implementation is 6-8 static pose outline assets, shown as a transparent viewfinder overlay, with on/off and mirror controls. This should already create a differentiated shooting experience without introducing cloud, AI, live-frame analysis, battery, performance, or privacy risk.

---

## 2. Recommended MVP Architecture

Use SwiftUI layering around the existing AVFoundation camera preview.

Recommended structure:

- SwiftUI `ZStack`.
- `UIViewRepresentable` hosts the `AVCaptureVideoPreviewLayer`.
- Camera preview stays at the bottom layer.
- Pose overlay is drawn above the preview.
- Passive guidance can sit above pose overlay if needed.
- Camera controls remain the topmost interactive layer.
- `PoseOverlayView` must use `.allowsHitTesting(false)`.
- `PoseOverlayView` should use `.accessibilityHidden(true)` or equivalent.
- Overlay must not intercept shutter, AI Snapshot, filter, guidance, lens, flash, timer, or flip controls.
- Overlay must not be written into captured photo output.
- Capture output should continue to come from `AVCapturePhotoOutput`.

Suggested pseudo structure:

```swift
ZStack {
    CameraPreviewContainerView()
        .zIndex(0)

    PoseOverlayView(...)
        .allowsHitTesting(false)
        .accessibilityHidden(true)
        .zIndex(1)

    CameraGuidanceOverlayView(...)
        .allowsHitTesting(false)
        .zIndex(2)

    CameraControlsOverlay(...)
        .zIndex(3)
}
```

Architecture principles:

- Keep capture, preview, and overlay responsibilities separate.
- Do not implement the overlay by screenshotting the UI.
- Do not composite overlay into the saved photo.
- Do not wrap the Camera shooting screen in a `ScrollView`.
- Do not add new capture pipeline behavior in the Pose Overlay MVP.

---

## 3. Pose Asset Strategy

Recommended MVP asset strategy:

- Use Asset Catalog PDF vector assets for pose outlines.
- Use transparent PNG as a fallback when needed.
- Avoid SVG as the main general-purpose pose overlay path for MVP.
- Keep SwiftUI `Shape` / `Canvas` for later dynamic or programmatic pose guides.
- Keep Lottie or animation frameworks for later animated guides; they are not MVP requirements.

Recommended visual style:

- Single-color warm white / off-white outline.
- Transparent background.
- Thin lines.
- Template rendering if useful.
- No solid body mask.
- Low opacity so the viewfinder remains primary.

Why PDF vector assets first:

- Xcode Asset Catalog handles PDF image sets directly.
- Designers can export consistent vector outlines.
- The app can scale the guide without relying on runtime path generation.
- It avoids a new third-party animation or SVG dependency.

---

## 4. Overlay Layout Strategy

The pose overlay should align to the viewfinder rect, not to the full screen bounds.

Reason:

- Camera preview commonly uses `resizeAspectFill`.
- `resizeAspectFill` preserves aspect ratio but crops visible content.
- Safe areas, Dynamic Island, bottom camera controls, and mode rails mean the visible viewfinder is not the same as full screen bounds.

MVP layout strategy:

- Define a `viewfinderRect`.
- Place pose overlay relative to the `viewfinderRect`.
- Support only portrait orientation for MVP.
- Support default scale, offset, opacity, and anchor per pose.
- Support front-camera mirroring strategy.
- Prefer manual left/right mirror control over automatic user/body inference.

Suggested initial parameters:

| Parameter | Suggested Initial Value |
| --- | --- |
| opacity | about `0.32` |
| scale | about `0.78` to `0.92` |
| anchor | `bottomCenter` / `center` |
| supportsMirroring | `true` |

Recommended normalized layout fields:

- `defaultScale`
- `defaultOffsetNormX`
- `defaultOffsetNormY`
- `defaultOpacity`
- `anchor`
- `supportsMirroring`

Mirroring principles:

- Match the preview experience, because the user aligns with what they see.
- Front camera may require mirrored presentation.
- Provide a manual flip/mirror button so the user can correct pose direction safely.
- Do not infer the user's body orientation or identity.

---

## 5. Hit Testing / Capture Safety

Pose overlay must be passive.

Requirements:

- Overlay must not be tappable.
- Use `.allowsHitTesting(false)`.
- Use `.accessibilityHidden(true)` or equivalent for decorative guides.
- Do not define gestures on the overlay.
- Do not put the Camera shooting surface inside a `ScrollView`.
- Do not block shutter.
- Do not block flip / timer / flash / AI / filter / guidance / lens controls.
- Do not change capture pipeline.
- Do not composite overlay into captured photos.
- Do not save overlay images to Photos.
- Do not export pose overlay output.

Capture safety:

- Captured photos should continue to be produced by `AVCapturePhotoOutput`.
- Pose overlay should remain a UI-only view layer.
- Do not create "share current screen" or screenshot-based output in the Pose Overlay MVP.
- If future export/share UI is added, confirm it does not accidentally flatten the pose overlay into output.

---

## 6. Pose Selector UX

Recommended UX:

- Camera page has a small Pose button for quick access.
- Inspiration tab can host a full Pose Gallery later.
- Camera quick picker can use a compact sheet / bottom sheet.
- Selecting a pose closes the sheet and leaves only the transparent overlay on the viewfinder.
- Show a small pose name badge in a corner.
- Include a close button to turn off the selected pose.
- Include a mirror / left-right flip button.
- Keep opacity slider for P2; it is not required for P1.
- Do not turn Camera into an ordinary scrolling app page.

Suggested Camera flow:

1. User taps Pose button.
2. Compact picker sheet opens.
3. User selects one pose.
4. Sheet closes.
5. Pose outline appears in the viewfinder.
6. User can tap close or mirror.
7. Shutter and all camera controls remain available.

Suggested two-entry model:

- Camera quick picker: fast use while shooting.
- Inspiration pose gallery: deeper browsing, categories, examples, future challenges.

---

## 7. Pose Categories / Content Strategy

Recommended categories:

- 單人
- 情侶
- 男生
- 女生
- 街拍
- 旅行
- 坐姿
- 半身
- 全身
- 中性 / 不限

P1 should use only a small subset, around 6-8 static pose guides. P2 can expand to 20-30 guides.

P1 examples:

- 單人微側站姿
- 自然步行
- 靠牆側身
- 肩膀回望
- 並肩情侶
- 情侶前後錯位
- 半身手扶頭髮 / 手拿道具
- 坐姿回望

Inclusive principle:

- 男生 / 女生 / 情侶 are browsing categories only.
- Users can freely use any pose.
- The app should not use AI to judge user gender.
- The app should not restrict any pose to a category of person.
- The app should not perform face recognition.
- The app should not perform body scoring.
- The app should not perform appearance scoring.
- Avoid copy such as `顯瘦 pose`, `女生必拍`, or any appearance-judgment framing.

Content naming style:

- Short.
- Practical.
- Neutral.
- Shooting-oriented.

Better examples:

- `肩膀回望`
- `並肩看鏡頭`
- `自然步行`
- `靠牆側身`

---

## 8. Vision Body Pose Detection Evaluation

Apple Vision body pose detection can be useful later, but it is not needed for MVP.

Reasons to avoid Vision in P1:

- Live frame processing increases performance risk.
- Live frame processing increases battery risk.
- Extra frame analysis can cause dropped frames or preview instability.
- Auto-align / matching adds product complexity.
- Body-pose data introduces higher privacy sensitivity.

Recommended Vision timeline:

- P1: no Vision, static pose overlay only.
- P2: no Vision, expand categories and gallery.
- P3: optional AI pose recommendation based on user-selected scene or intent, not body analysis.
- P4: consider Vision body pose detection for local auto-align / matching prototype.

If Vision is added later:

- Keep processing local.
- Keep frame data short-lived.
- Do not persist pose points.
- Do not upload body pose data.
- Do not infer identity, gender, age, emotion, body quality, beauty, or attractiveness.
- Use low-frequency / performance-safe processing.
- Add dropped-frame and battery protections.

---

## 9. Privacy / App Store / Safety Boundaries

P1 static pose overlay can be privacy-safe because it does not require cloud AI or frame analysis.

Required boundaries:

- No cloud AI required in first version.
- Do not upload camera frames.
- Do not store raw frames.
- Do not record body pose data.
- Do not perform face recognition.
- Do not infer identity.
- Do not infer gender.
- Do not infer age.
- Do not infer emotion.
- Do not score beauty or attractiveness.
- Do not score body or pose.
- Pose assets must be self-made or commercially licensed.
- Do not copy another app's UI or pose assets.
- Explain that overlay is a shooting reference only.
- Explain that overlay is not captured into the final photo.

App Store / licensing notes:

- Use original assets or assets with clear commercial usage rights.
- Avoid copying VIVO Pose Master UI, pose art, wording, or visual identity.
- Keep product language original.
- Do not add new privacy claims unless implementation actually changes.

---

## 10. Recommended File Architecture for Future Implementation

Future Phase 16E can add files such as:

```text
ios-app/AIPhotoApp/Features/PoseGuides/PoseGuide.swift
ios-app/AIPhotoApp/Features/PoseGuides/PoseGuideCategory.swift
ios-app/AIPhotoApp/Features/PoseGuides/PoseGuideCatalog.swift
ios-app/AIPhotoApp/Features/PoseGuides/CameraPoseOverlayState.swift
ios-app/AIPhotoApp/Features/PoseGuides/PoseOverlayView.swift
ios-app/AIPhotoApp/Features/PoseGuides/PoseSelectorView.swift
ios-app/AIPhotoApp/Features/PoseGuides/PoseGuideButton.swift
ios-app/AIPhotoApp/Features/PoseGuides/InspirationPoseGalleryView.swift
```

Suggested model:

```swift
struct PoseGuide: Identifiable, Codable, Hashable {
    let id: String
    let title: String
    let shortHint: String
    let category: PoseGuideCategory
    let assetName: String
    let framingHint: PoseFramingHint
    let defaultScale: CGFloat
    let defaultOffsetNormX: CGFloat
    let defaultOffsetNormY: CGFloat
    let defaultOpacity: CGFloat
    let anchor: PoseOverlayAnchor
    let supportsMirroring: Bool
    let isPremium: Bool
}
```

Suggested state:

```swift
struct CameraPoseOverlayState {
    var isPoseOverlayEnabled: Bool = false
    var selectedPoseGuide: PoseGuide? = nil
    var poseOverlayOpacity: CGFloat = 0.32
    var isPoseMirrored: Bool = false
}
```

Implementation notes for later:

- Keep pose state memory-only for P1.
- Do not add UserDefaults persistence in P1.
- Do not add premium gating in P1.
- Do not add Vision body pose detection in P1.
- Do not add AI pose recommendation in P1.

---

## 11. MVP Phase Plan

### P1 Static Pose Overlay MVP

- 6-8 static pose outlines.
- Camera Pose button.
- Quick picker.
- Show / hide overlay.
- Manual left-right mirror.
- `.allowsHitTesting(false)`.
- Does not affect capture.
- Does not upload.
- Does not save overlay.
- Does not use AI.
- Does not use Vision.

P1 acceptance criteria:

- Camera has a Pose button.
- User can select a pose.
- Pose overlay appears on viewfinder.
- Pose overlay can be closed.
- Pose overlay can be mirrored.
- Shutter remains tappable.
- AI Snapshot remains tappable.
- Filter / guidance / lens controls remain tappable.
- Captured photo does not contain overlay.
- No frames are uploaded or stored.

### P2 Pose Categories

- Expand to 20-30 pose guides.
- Add categories:
  - 情侶
  - 男生
  - 女生
  - 街拍
  - 旅行
  - 坐姿
  - 半身
  - 全身
  - 中性 / 不限
- Add Inspiration pose gallery.
- Add recent / favorite poses if explicitly requested.
- Opacity slider can be considered here.

### P3 AI Pose Suggestion

- Recommend pose based on user-selected scene or shooting intent.
- Do not use face / identity / gender / appearance inference.
- Do not score pose quality.
- Do not score body or attractiveness.
- Keep suggestions opt-in and explainable.

### P4 Advanced Pose Matching

- Research Apple Vision body pose.
- Prototype local auto-align / matching only.
- Later research, not MVP.
- Must include performance, battery, privacy, and safety review.

---

## Phase 16E Readiness Notes

Future Phase 16E should implement only P1 Static Pose Overlay MVP unless the user explicitly broadens scope.

Phase 16E should not include:

- Vision body pose detection.
- AI pose suggestion.
- Pose scoring.
- Body / appearance scoring.
- Real network calls.
- Upload.
- Persistence.
- Export / save-to-Photos.
- Backend changes.
- Third-party SDKs.

The safest first implementation is a passive UI overlay with original static assets and no effect on capture output.
