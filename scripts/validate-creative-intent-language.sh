#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONTEXT_FILE="$ROOT_DIR/ios-app/AIPhotoApp/Features/Camera/CameraCaptureContext.swift"
LOCALE_FILES=(
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings"
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings"
)
SURFACE_PATHS=(
  "$ROOT_DIR/ios-app/AIPhotoApp/Features/AIPhotoAdvisor"
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization"
)
LOCALES=(en zh_hant zh_hans yue_hk yue_troublemaker)

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

awk '/enum CreativeIntentSignal/,/^}/ { print }' "$CONTEXT_FILE" \
  | sed -nE 's/^[[:space:]]*case ([A-Za-z][A-Za-z0-9]*)( = "([^"]+)")?.*/\3 \1/p' \
  | awk '{
      if ($1 != "") {
        print $1
      } else {
        value = $2
        gsub(/([a-z0-9])([A-Z])/, "\\1_\\2", value)
        print tolower(value)
      }
    }' \
  | sort -u > "$tmp_dir/signal_keys"

for strings_file in "${LOCALE_FILES[@]}"; do
  while IFS= read -r signal; do
    for locale in "${LOCALES[@]}"; do
      full_key="advisor.intent.signal.${signal}.${locale}"
      if ! grep -Fq "\"${full_key}\"" "$strings_file"; then
        echo "Missing CreativeIntentGuard language key in ${strings_file#$ROOT_DIR/}: $full_key" >&2
        exit 1
      fi
    done
  done < "$tmp_dir/signal_keys"

  for locale in "${LOCALES[@]}"; do
    full_key="advisor.action.retake.technical_risk.${locale}"
    if ! grep -Fq "\"${full_key}\"" "$strings_file"; then
      echo "Missing technical-risk retake restraint key in ${strings_file#$ROOT_DIR/}: $full_key" >&2
      exit 1
    fi
  done
done

if rg -n \
  'bad photo|wrong exposure|failed photo|retake it|retake required|must fix|please retake|out of focus|水平錯誤|構圖錯誤|曝光錯誤|照片太暗|光線不足|噪點太多|對焦失敗|相片模糊|你手震|[0-9]+/10|[0-9]+%|\\b(score|rating)\\b|chain-of-thought|face recognition|identity recognition|attractiveness score|body shaming|skin quality' \
  "${SURFACE_PATHS[@]}"; then
  echo "Unsafe, score-like, or lazy fix-it Photo Advisor wording found." >&2
  exit 1
fi

echo "Creative intent language coverage OK."
