# Proof App Briefs

These briefs define the first three product proof builds for `.ai`.

They are not reference solutions and they are not proof reports. They are target
contracts for real A/B runs:

- baseline build: rough prompt without the new `.ai` workflow
- candidate build: same rough prompt using the new `.ai` workflow
- same model, same time budget, same commands, same scoring rubric

Use these directories to keep proof builds comparable and honest.

## Required Evidence

Each finished proof app should produce:

- Running app directory or deployed preview URL.
- Screenshot of the core happy path.
- Screenshot of at least one empty, error, or edge state.
- Build/test command evidence captured with `dot-ai prove auto` or
  `dot-ai prove run`.
- Completed `proof-runs/<scenario>/verdict.json`.
- Completed `proof-runs/<scenario>/build-report.md`.

## Scenarios

- [`invoice-app`](invoice-app/README.md)
- [`habit-tracker`](habit-tracker/README.md)
- [`bug-dashboard`](bug-dashboard/README.md)
