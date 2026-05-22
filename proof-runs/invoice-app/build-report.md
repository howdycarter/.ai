# Proof Run: invoice-app

## Claim

This proof run tests whether the current `.ai` proof/story workflow produces a
better invoice app than the original rough-prompt `.ai` baseline.

## Result

Candidate wins this first run.

The baseline app passed its own local tests and build, but passed only 3 of 6
shared product acceptance checks. The candidate app passed its own local tests,
build, and all 6 of 6 shared product acceptance checks.

This supports a narrow claim: the new `.ai` proof context produced a more
complete invoice product in this run. It does not prove universal superiority
because the same agent built both apps and the test was not blinded.

## Refs

- Baseline: `8a1dd01` original 12-primitive `.ai`
- Candidate: `4294a02` current proof/story `.ai`

## Original Prompt

Build a small app for freelancers who need to create and track invoices without
adopting a full accounting suite.

The user can create clients, add invoice line items, preview totals, mark
invoices paid, and see which invoices are overdue. Keep it simple enough for a
solo operator, but polished enough that someone could use it with real clients
after adding persistence.

## Workflow Inputs

- Baseline workflow: `workflow/baseline-old-ai.md`
- Candidate workflow: `workflow/candidate-new-ai.md`
- Scenario prompt: `prompt.md`
- Acceptance criteria: `acceptance.md`
- Rubric: `rubric.json`
- Shared evaluator: `evaluate-app.js`

## Apps

- Baseline app: `apps/baseline`
- Candidate app: `apps/candidate`

Both apps are static HTML/CSS/JS apps with Node test/build scripts and no
runtime dependencies.

## Acceptance Results

| Acceptance | Baseline | Candidate |
|---|---:|---:|
| A1 create invoice with client, number, due date, and line item | pass | pass |
| A2 calculate subtotal, tax/adjustment, and total safely | pass | pass |
| A3 separate draft, sent, paid, and overdue invoices | pass | pass |
| A4 include empty, loading/saving, validation, and error states | fail | pass |
| A5 export/copy a public-safe invoice summary | fail | pass |
| A6 explain payment/tax/persistence requirements before real use | fail | pass |

Summary:

- Baseline: 3 pass, 0 partial, 3 fail
- Candidate: 6 pass, 0 partial, 0 fail

Detailed JSON evidence:

- `evidence/baseline-acceptance.json`
- `evidence/candidate-acceptance.json`

## Scores

| Score Group | Baseline | Candidate | Delta |
|---|---:|---:|---:|
| Spec/artifact readiness | 2/6 | 6/6 | +4 |
| Final product outcome | 8/16 | 16/16 | +8 |

## Command Evidence

- Baseline `npm test && npm run build`: pass
- Candidate `npm test && npm run build`: pass
- Baseline `npm run acceptance`: fail, 3/6 acceptance checks
- Candidate `npm run acceptance`: pass, 6/6 acceptance checks

Command stdout/stderr, exit codes, durations, and cwd values are recorded in
`verdict.json`.

## Screenshot Evidence

- `evidence/screenshots/baseline-full.png`
- `evidence/screenshots/baseline-mobile.png`
- `evidence/screenshots/candidate-full.png`
- `evidence/screenshots/candidate-mobile.png`

Visual inspection:

- Baseline renders the core invoice, totals, and status counts, but the summary
  area starts blank and the UI has no explicit validation, error, saving, empty,
  or readiness sections.
- Candidate renders the core invoice plus explicit empty/saving states,
  validation/error states, public-safe summary, status board, and before-real-use
  caveats.
- Candidate mobile stacks cleanly and preserves the primary invoice workflow.

## Rework Notes

Baseline would need remediation for:

- missing empty/loading/saving/validation/error state model
- unsafe summary export that includes `privateNotes` and "Do not share" content
- missing persistence, payment, tax, auth, and audit caveats before real use

Candidate required no product acceptance remediation after the shared evaluator.

Proof-run tooling caveat: running two `dot-ai prove run` commands in parallel
can clobber command entries in `verdict.json`; the baseline acceptance command
was rerun sequentially and preserved. That should become a future `.ai` bugfix.

## Honest Verdict

The new `.ai` workflow produced a better final invoice app in this run.

The practical reason was not magic. The candidate had explicit acceptance
criteria and proof expectations, so it included the less glamorous but
production-relevant parts: state coverage, redaction, caveats, and handoff
evidence. The baseline satisfied the rough prompt's obvious happy path but
missed the parts a real product owner would care about before using this with
clients.

Do not overclaim this. One non-blinded proof run is strong directional evidence,
not a benchmark suite. Run `habit-tracker` and `bug-dashboard` next before using
this as a public headline.
