#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ADVISOR_DIR="$ROOT_DIR/ios-app/AIPhotoApp/Features/AIPhotoAdvisor/PostCapture"
LOCALIZATION_DIR="$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization"
MATRIX_FILE="$ROOT_DIR/docs/photo-advisor-copy-regression-matrix.md"

"$ROOT_DIR/scripts/validate-photo-advisor-card-language.sh"
"$ROOT_DIR/scripts/validate-creative-intent-language.sh"
"$ROOT_DIR/scripts/validate-photo-advisor-filter-reasons.sh"

if [[ ! -f "$MATRIX_FILE" ]]; then
  echo "Missing Photo Advisor copy regression matrix." >&2
  exit 1
fi

for token in \
  "Low light mood" \
  "Imported limited context" \
  "Provider unavailable fallback" \
  "Unknown filter ID fallback" \
  "English:" \
  "Traditional Chinese:" \
  "Cantonese-style:" \
  "Simplified Chinese:"; do
  if ! grep -Fq "$token" "$MATRIX_FILE"; then
    echo "Copy regression matrix missing required section/token: $token" >&2
    exit 1
  fi
done

advisor_key_namespaces=(
  "advisor.mood."
  "advisor.signal."
  "advisor.intent."
  "advisor.action."
  "advisor.filter.family."
  "advisor.filter.reason."
  "advisor.fallback."
)

for namespace in "${advisor_key_namespaces[@]}"; do
  if ! grep -R -q "\"$namespace" "$LOCALIZATION_DIR"; then
    echo "Missing advisor localization namespace: $namespace" >&2
    exit 1
  fi
done

if rg -n \
  'LocalizedStringKey\("[^"]*\.\(.*\)|LocalizedStringKey\([^)]*\?\?|Text\([^)]*\.rawValue\)' \
  "$ADVISOR_DIR"; then
  echo "Potential raw localization key or raw enum fallback found in Photo Advisor UI code." >&2
  exit 1
fi

if rg -n \
  'sourceKey\(|photo_advisor\.source\.|Provider:|raw JSON|raw provider|chain-of-thought|internal classification|numeric confidence|confidence percentage' \
  "$ADVISOR_DIR"; then
  echo "Provider/source/debug/internal wording found in UI-facing Photo Advisor code." >&2
  exit 1
fi

if rg -n \
  'Try this filter|Best filter|best filter|perfect filter|bad photo|wrong exposure|failed photo|retake it|retake required|must fix|please retake|out of focus|水平錯誤|構圖錯誤|曝光錯誤|照片太暗|光線不足|噪點太多|對焦失敗|相片模糊|你手震|[0-9]+/10|[0-9]+%|\b(score|rating)\b|face recognition|identity recognition|identity inference|attractiveness score|beauty score|body shaming|skin quality|chain-of-thought|屌|你醜|你肥|你老|你皮膚差|你樣衰|你個樣唔得|你條廢物|你有病|你弱智|你唔正常' \
  "$ADVISOR_DIR" "$LOCALIZATION_DIR"; then
  echo "Unsafe, generic, score-like, or lazy fix-it Photo Advisor wording found." >&2
  exit 1
fi

echo "Photo Advisor multilingual copy regression coverage OK."
