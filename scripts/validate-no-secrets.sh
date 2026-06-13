#!/usr/bin/env bash
set -euo pipefail

echo "Checking for obvious secret files..."

secret_files=(
  "GoogleService-Info.plist"
  ".env"
  ".env.local"
  ".firebaserc"
)

for file in "${secret_files[@]}"; do
  if [ -e "$file" ] && ! git check-ignore -q "$file" && [ -n "$(git status --short -- "$file")" ]; then
    echo "Error: $file is not ignored and could be committed."
    exit 1
  fi
done

echo "No obvious secret files found."
