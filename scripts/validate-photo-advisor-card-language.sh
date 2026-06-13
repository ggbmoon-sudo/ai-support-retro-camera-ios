#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIEW_FILE="$ROOT_DIR/ios-app/AIPhotoApp/Features/AIPhotoAdvisor/PostCapture/PhotoAdvisorResultView.swift"
MODEL_FILE="$ROOT_DIR/ios-app/AIPhotoApp/Features/AIPhotoAdvisor/PostCapture/PhotoAdvisorResultCardModel.swift"
LOCALIZATION_FILES=(
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings"
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings"
)

required_keys=(
  "photo_advisor.section.filter_note"
  "photo_advisor.section.optional_refinement"
  "photo_advisor.section.optional_retake"
)

for localization_file in "${LOCALIZATION_FILES[@]}"; do
  for key in "${required_keys[@]}"; do
    if ! grep -q "\"$key\"" "$localization_file"; then
      echo "Missing Photo Advisor card key '$key' in $localization_file" >&2
      exit 1
    fi
  done
done

if grep -q "sourceKey(" "$VIEW_FILE"; then
  echo "Photo Advisor result card must not expose provider/source labels in production UI." >&2
  exit 1
fi

if ! grep -q "PhotoAdvisorResultCardModel" "$VIEW_FILE"; then
  echo "Photo Advisor result view is not using the UI-facing card model." >&2
  exit 1
fi

if ! grep -q "primaryFilterRecommendation" "$MODEL_FILE"; then
  echo "Photo Advisor card model is missing primary filter display support." >&2
  exit 1
fi

if ! grep -q "secondaryAdvice" "$MODEL_FILE"; then
  echo "Photo Advisor card model is missing secondary advice display support." >&2
  exit 1
fi

echo "Photo Advisor card language model coverage OK."
