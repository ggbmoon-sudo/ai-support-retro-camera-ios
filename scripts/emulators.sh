#!/usr/bin/env bash
set -euo pipefail

echo "Starting Firebase emulators placeholder"
firebase emulators:start --config firebase/firebase.json
