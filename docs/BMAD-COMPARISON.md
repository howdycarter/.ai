# .ai vs BMAD

Last reviewed: 2026-05-21.

This comparison treats BMAD as a respected adjacent system, not as something to
copy. BMAD is currently the more mature product. `.ai` is the smaller
repo-native standard layer with a proof-first wedge.

## Current Baseline

| Area | .ai | BMAD |
|---|---:|---:|
| Public release | No npm release yet | `bmad-method@6.7.1` |
| Fresh install size | 20 files | 236 files in the tested Claude Code install |
| Installed skills | 9 `.ai/skills` files | 44 Claude skills |
| GitHub Actions workflows | 0 | 5 |
| Tests | 25 CLI tests | 17 test files plus lint/docs validation |
| Core position | Open repo context standard | Full agile AI development method |
| Proof loop | First-class `dot-ai prove` | Not the central product surface |

## Where BMAD Is Stronger

- Distribution: `npx bmad-method@latest install` works today.
- Ecosystem: BMAD has a large community, releases, docs, website, and a
  recognizable workflow vocabulary.
- Breadth: BMAD covers analysis, planning, solutioning, implementation,
  review, QA, sprint status, and retrospectives.
- Tooling maturity: BMAD ships installer logic, generated configs, module
  manifests, docs validation, linting, and release automation.
- Help path: BMAD has a richer installed help/skill catalog for users who do
  not know what to do next.

## Where .ai Is Stronger

- Smaller adoption surface: `.ai` installs as a compact directory and keeps
  markdown canonical.
- Agent agnosticism: the same `.ai/` context is meant to be read by Codex,
  Claude Code, Cursor, Copilot, Windsurf, Devin, and generic agents.
- Discoverability: `.ai/manifest.json` gives tools a machine-readable map
  instead of forcing them to infer structure.
- Conformance: `dot-ai doctor` makes validity explicit.
- Proof orientation: `dot-ai prove`, `prove auto`, verdict files, acceptance
  coverage, command evidence, and build reports are designed to answer whether
  the workflow improved the shipped product.
- Codex goal readiness: `.ai/goals/` and `dot-ai goal` compile specs, stories,
  proof runs, or raw objectives into durable Codex `/goal` handoffs with
  evidence requirements and completion audits.
- Lower ceremony: `.ai` can fit into existing repos without adopting a full
  methodology.

## Devil's Advocate

`.ai` does not yet prove that it builds better apps than BMAD. It proves that
it has a clearer context shape and a better measurement harness. That is
valuable, but it is not enough for the public claim.

The next evidence requirement is three completed proof runs:

- `invoice-app`
- `habit-tracker`
- `bug-dashboard`

Each run must compare the same prompt, same model, same time budget, same
commands, and same rubric. Publish the build report only when the evidence
supports the claim.

## Product Strategy

Do not compete with BMAD by becoming a larger BMAD clone. Compete by becoming
the context and proof layer every workflow can read.

The durable product claim should be:

> `.ai` is the repo-native context layer that proves whether your AI build
> process worked.

## Near-Term Requirements

- Publish `dot-ai` or keep all docs using `npx github:howdycarter/.ai`.
- Add real CI once the GitHub token has workflow scope.
- Ship three public proof reports.
- Add `dot-ai status` to every demo; it now shows doctor validity, stories,
  proof runs, blockers, and next action.
- Use `dot-ai prove auto` for same-command A/B evidence capture.
- Keep `.ai Standard v0.1` until external projects adopt it and proof reports
  exist.
