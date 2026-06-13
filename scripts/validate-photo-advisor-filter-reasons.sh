#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CATALOG_FILE="$ROOT_DIR/ios-app/AIPhotoApp/Features/Filters/FilterPresetCatalog.swift"
LIBRARY_FILE="$ROOT_DIR/ios-app/AIPhotoApp/Features/AIPhotoAdvisor/PostCapture/PhotoAdvisorFilterReasonLibrary.swift"
LOCALE_FILES=(
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/en.lproj/Localizable.strings"
  "$ROOT_DIR/ios-app/AIPhotoApp/Resources/Localization/zh-Hant.lproj/Localizable.strings"
)
LOCALES=(en zh_hant zh_hans yue_hk yue_troublemaker)

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

grep -E 'id: "' "$CATALOG_FILE" \
  | sed -E 's/.*id: "([^"]+)".*/\1/' \
  | sort -u > "$tmp_dir/catalog_ids"

sed -nE '/profile\(/,/displayName:/ s/^[[:space:]]*"([^"]+)".*/\1/p' "$LIBRARY_FILE" \
  | sort -u > "$tmp_dir/profile_ids"

missing_profiles="$(comm -23 "$tmp_dir/catalog_ids" "$tmp_dir/profile_ids" || true)"
stale_profiles="$(comm -13 "$tmp_dir/catalog_ids" "$tmp_dir/profile_ids" || true)"

if [[ -n "$missing_profiles" ]]; then
  echo "Missing filter reason profiles:" >&2
  echo "$missing_profiles" >&2
  exit 1
fi

if [[ -n "$stale_profiles" ]]; then
  echo "Filter reason profiles without catalog presets:" >&2
  echo "$stale_profiles" >&2
  exit 1
fi

grep -oE '"advisor\.filter\.reason\.[^"]+"' "$LIBRARY_FILE" \
  | tr -d '"' \
  | sort -u > "$tmp_dir/reason_bases"

awk '/enum PhotoAdvisorFilterLanguageFamily/,/^}/ { print }' "$LIBRARY_FILE" \
  | grep -E 'case [A-Za-z].*= "[a-z_]+"' \
  | sed -E 's/.*= "([^"]+)".*/advisor.filter.family.\1/' \
  | sort -u > "$tmp_dir/family_bases"

for strings_file in "${LOCALE_FILES[@]}"; do
  while IFS= read -r key_base; do
    for locale in "${LOCALES[@]}"; do
      full_key="${key_base}.${locale}"
      if ! grep -Fq "\"${full_key}\"" "$strings_file"; then
        echo "Missing localized filter reason key in ${strings_file#$ROOT_DIR/}: $full_key" >&2
        exit 1
      fi
    done
  done < "$tmp_dir/reason_bases"

  while IFS= read -r key_base; do
    for locale in "${LOCALES[@]}"; do
      full_key="${key_base}.${locale}"
      if ! grep -Fq "\"${full_key}\"" "$strings_file"; then
        echo "Missing localized filter family key in ${strings_file#$ROOT_DIR/}: $full_key" >&2
        exit 1
      fi
    done
  done < "$tmp_dir/family_bases"
done

if rg -n \
  'Try this filter|Best filter|best filter|bad photo|wrong exposure|failed photo|retake it|must fix|[0-9]+/10|[0-9]+%' \
  "${LOCALE_FILES[@]}" "$LIBRARY_FILE"; then
  echo "Unsafe or generic filter recommendation wording found." >&2
  exit 1
fi

echo "Photo Advisor filter reason coverage OK."
