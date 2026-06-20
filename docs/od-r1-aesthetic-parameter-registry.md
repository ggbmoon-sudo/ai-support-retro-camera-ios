# OD-R1 Aesthetic Parameter Registry

Status: backend QA registry only
Production readiness: `productionReady:false`

## Summary

OD-R1 starts the OD-R research / definition / parameter / dataset / fine-tune preparation track. The registry converts photography aesthetic codebook concepts into structured parameter tags that later systems can mine, label, validate, review, tune, and benchmark.

This registry is not the final AI and it is not a product runtime. It defines allowed enum-like tags, feature keys, threshold keys, suppression keys, evidence types, source types, and safe action keys.

## Direction

- OD-R is for research definitions, parameter mining, dataset/source manifests, offline teacher contracts, human review, benchmark tuning, and fine-tune/distillation readiness.
- OD-P is for later product/runtime integration only after benchmark and safety gates prove practical delivery.
- App/model installation belongs to OD-P, not OD-R1.
- The OD-03B Swift placeholder is paused and is not continued in this branch.

## What The Registry Contains

The starter registry covers a small set of photography parameter tags:

- `ERR_COMP_RULE_OF_THIRDS_MISS`
- `ERR_COMP_EXCESSIVE_HEADROOM`
- `ERR_COMP_HORIZON_TILT`
- `ERR_FRAME_ANKLE_CUT`
- `ERR_DEPTH_SUBJECT_BACKGROUND_MERGER`
- `ERR_LIGHT_BACKGROUND_OUTSHINES_SUBJECT`
- `ERR_EXP_HIGHLIGHT_CLIPPING`
- `ERR_VIEW_WIDE_EDGE_STRETCH`
- `ERR_CLUTTER_BACKGROUND_OBJECT_DENSITY`

Each item is structured with category, definition key, feature keys, symbolic threshold keys, creative-intent suppression keys, a safe action key, evidence types, allowed source types, human review requirement, and safety notes.

## Not In OD-R1

- No crawler or download mode.
- No dataset/photo/fixture commit.
- No cloud AI teacher call.
- No raw prompt, raw provider response, raw model output, request payload, or debug leakage.
- No training, fine-tuning, distillation, inference, model install, or Core ML package.
- No Swift runtime file, camera preview wiring, live frame processing, upload path, provider key, or production rollout.

## Relationship To Later Work

OD-R2 can define dataset/source manifest schemas. OD-R3 can add a parameter mining bot dry-run without public crawling. OD-R4/OD-R5 can define and sandbox cloud AI teacher structured labeling offline, with no live app runtime. OD-R6 can add human review queue schemas. OD-R7/OD-R8 can benchmark local CV/local AI feature extraction and tune thresholds after reviewed labels exist. OD-R9 can decide whether fine-tune or distillation readiness gates pass. OD-P1 is the first product integration candidate.

Cloud AI is a future offline teacher for structured labeling. Local CV / local AI is the future runtime student.
