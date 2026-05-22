# Candidate Workflow: New .ai

Ref: `4294a02`

The candidate app was built with the current `.ai` proof loop:

- Scenario prompt: `scenarios/invoice-app/prompt.md`
- Acceptance: `scenarios/invoice-app/acceptance.md`
- Rubric: `scenarios/invoice-app/rubric.json`
- Proof app brief: `examples/proof-apps/invoice-app/README.md`
- Evidence capture: `dot-ai prove`, `dot-ai prove auto`, and
  `dot-ai prove score`

The candidate planning target was explicit:

- satisfy all six acceptance criteria
- include financial rounding care
- show empty, saving, validation, and error states
- provide a public-safe summary that excludes private notes
- document what persistence, payments, tax handling, auditability, and auth
  would need before real client use

Expected risk: candidate may be more complete, but the comparison is not
blinded because the same agent built both apps.
