# Florence-2 Fine-tune / Distillation Workflow

Status: research-only
Date: 2026-06-20
Production readiness: `productionReady:false`

## Executive Summary

Fine-tuning is not justified until baseline evaluation proves a specific gap that cannot be fixed by Apple Vision, AVFoundation depth, rules, prompt/schema tuning, or smaller local heuristics. For this app, fine-tuning should be blocked until dataset legality, consent, label schema, human review, benchmark gaps, and deployment constraints are all proven.

Recommendation: create an evaluation-first workflow, then AI-assisted labeling, human review, baseline benchmark, gap analysis, prompt/schema tuning, distillation, and only then LoRA if needed.

## Why This Matters For Our App

The app does not need a general AI judge. It needs safe, typed signals that support retro-aware hints. Fine-tuning should target measurable failures such as poor region grounding or unstable segmentation, not vague "make advice better" goals.

## When Fine-tuning Is Justified

Possible triggers:

- bad subject boxes compared with Apple Vision baseline.
- poor grounding for sky/background/person/object clusters.
- unstable segmentation masks.
- bad retro-scene labeling after human review.
- poor low-light / backlight behavior.
- high invalid output rate after schema/prompt tuning.

Not justified:

- because a model is fashionable.
- because a small prompt issue exists.
- because user-facing copy needs style changes; that belongs in app language packs/rules.

## Dataset Size Planning

Needs benchmark/source verification, but rough stages:

- Evaluation only: small curated set, enough for failure categorization.
- Prompt/schema tuning: small-to-medium labeled set with edge cases.
- LoRA fine-tune: larger reviewed set with consistent labels.
- Full fine-tune: likely impractical for current app until a mature data program exists.

Never claim dataset sufficiency without measured validation metrics.

## Label Types Needed

- bounding boxes.
- phrase grounding regions.
- segmentation masks.
- weak depth/layering labels.
- composition labels: edge crowding, headroom, rule-of-thirds, negative space.
- retro mood labels: backlight, grain-friendly, soft-focus, faded color, silhouette.
- advisor copy keys, not final free-form copy.

Labels must not include identity, age, gender, emotion, attractiveness, skin, health, ethnicity, religion, disability, body judgment, or other sensitive attributes.

## Metrics

- mAP / IoU for boxes.
- grounding accuracy.
- segmentation IoU.
- invalid output rate.
- schema acceptance rate.
- safety rejection rate.
- latency.
- memory.
- thermal behavior.
- user-facing hint usefulness from reviewed app-generated hints.

## Training Environments

Possible environments:

- local GPU for small experiments if available.
- rented cloud GPU for LoRA after legal/data gates.
- Colab/Kaggle for feasibility only if data policy allows.
- dedicated training server later.

Training environment must not receive unapproved user photos or secrets.

## Distillation Strategy

Prefer distilling outputs into:

- app rules thresholds.
- smaller region classifiers.
- lightweight segmentation/region models.
- prompt/schema constraints.

Do not jump from Florence-2 to fine-tuning if a simple Vision/depth rule solves the problem.

## Staged Workflow

1. Evaluation dataset.
2. AI-assisted labeling.
3. Human review.
4. Baseline benchmark.
5. Gap analysis.
6. Prompt/schema tuning.
7. Distillation.
8. LoRA only if needed.
9. Deployment benchmark.

Each stage needs a stop/go decision.

## Recommended Architecture

```text
Approved images
-> manifest validation
-> metadata stripping
-> AI-assisted label candidates
-> schema validation
-> human review
-> benchmark set
-> gap analysis
-> distillation / LoRA decision
```

## Risks / Blockers

- illegal/unclear source images.
- inconsistent labels.
- sensitive labels leaking into training.
- overfitting to staged photos.
- training cost.
- deployment model too large.
- safety regression.
- no measurable benefit over Vision/rules.

## Privacy And Safety Notes

Never fine-tune on:

- user photos without explicit consent.
- private beta photos without privacy policy, retention/deletion policy, and legal review.
- scraped social media images.
- identity/sensitive labels.
- provider raw outputs.

## Do Now / Do Later / Do Not Do

Do now:

- Define evaluation and label schema.
- Keep fine-tuning blocked.

Do later:

- Build manifest-only dataset skeleton.
- Run AI-assisted labeling dry-run after approval.
- Human review before training/eval use.

Do not do:

- Do not train now.
- Do not scrape images.
- Do not use user photos without explicit consent.

## Concrete Next Codex Prompt

`Phase 21-E: Dataset Collector + AI-assisted Labeling Pipeline Skeleton - add schemas and dry-run-only manifest validation docs/tests. No crawler, no downloads, no provider labeling run, no model training, no raw images, no secrets. Keep productionReady:false.`

## Source Notes

- Florence-2 model reference: https://huggingface.co/microsoft/Florence-2-base
- App Store privacy details: https://developer.apple.com/app-store/app-privacy-details/

