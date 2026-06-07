#!/usr/bin/env bash
set -euo pipefail

echo "Checking for obvious secret files..."

if [ -f "GoogleService-Info.plist" ]; then
  echo "Error: GoogleService-Info.plist should not be committed at repo root."
  exit 1
fi

if [ -f ".env" ]; then
  echo "Error: .env should not be committed."
  exit 1
fi

echo "No obvious secret files found."
