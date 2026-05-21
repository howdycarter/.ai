# .ai Proof Lab

Proof Lab exists to prevent `.ai` from making vague productivity claims. A
proof run compares two build workflows against the same product scenario and
records enough evidence for another person to inspect the outcome.

## What Counts As Proof

A useful proof run includes:

- The same rough prompt for both builds.
- The same model or clearly recorded model difference.
- The same time budget.
- The same acceptance criteria.
- The same build, test, lint, and smoke commands where possible.
- Screenshots or a running app artifact.
- Rework notes: clarifications, failed attempts, manual fixes, and reversions.
- A plain-English verdict that admits where the candidate did not win.

Spec quality alone does not prove product quality. `dot-ai score` measures
readiness. `dot-ai prove` measures final outcome.

## Recommended A/B Flow

```bash
# 1. Create a proof run from a scenario.
npx github:howdycarter/.ai prove invoice-app \
  --baseline old-ai \
  --candidate new-ai \
  --out proof-runs/invoice-app

# 2. Build the baseline and candidate in separate directories.
# Example:
# ../old-build
# ../new-build

# 3. Capture the same command against both outputs.
npx github:howdycarter/.ai prove auto invoice-app \
  --baseline-dir ../old-build \
  --candidate-dir ../new-build \
  --command "npm test" \
  --out proof-runs/invoice-app

# 4. Add screenshots, PR links, and rework notes to verdict.json.

# 5. Score only after every acceptance item and rubric dimension is complete.
npx github:howdycarter/.ai prove score proof-runs/invoice-app
```

`prove auto` intentionally does not guess acceptance coverage. It records
command evidence for both sides. A human still scores whether the final product
meets the scenario.

## Canonical Scenarios

The first scenarios are intentionally small enough to run repeatedly but broad
enough to expose product quality differences:

- `invoice-app`: totals, invoice status, public-safe summaries, and empty/error
  states.
- `habit-tracker`: daily check-ins, missed-day recovery, progress patterns, and
  privacy expectations.
- `bug-dashboard`: triage filters, ownership, stale bugs, and operational
  usefulness.

Each scenario lives in `scenarios/<name>/` with:

- `prompt.md`
- `acceptance.md`
- `rubric.json`

The app-level target briefs live in `examples/proof-apps/<name>/`. Those briefs
define the screens and evidence that should exist before a proof report is
published.

## Scoring Rule

Do not publish a proof report if the candidate only wins on spec cleanliness.
The candidate needs to show at least one final-product advantage:

- More acceptance criteria passed.
- Less rework for the same result.
- Cleaner build/test status.
- Better UX completeness.
- Better handoff quality for the next agent or maintainer.

## Public Claim Gate

`.ai` should not publicly claim it builds better apps until at least three
proof reports show a measurable advantage. Until then, the accurate claim is:

> `.ai` gives builders a cleaner context system and a repeatable way to prove
> whether the workflow improved the final product.
