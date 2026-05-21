# .ai Standard v0.1

`.ai/` is the open standard for repo-native AI development context.

The standard defines a small folder of human-readable markdown artifacts and a
machine-readable manifest that lets agents, IDEs, CLIs, templates, and teams
understand a project without guessing where product intent, plans, progress, and
guardrails live.

## Design Goals

- **Markdown is canonical.** Humans review the same artifacts agents consume.
- **Git is the database.** Context changes travel with code changes.
- **Agents can discover state.** `.ai/manifest.json` points tools to the active
  work, adapters, guards, and standard version.
- **Small core, useful extensions.** The 12 primitives are stable. Packs add
  domain-specific behavior without fragmenting the core.
- **Human judgment stays central.** `.ai` improves interviews, plans, reviews,
  and checkpoints; it does not pretend product judgment is automatic.

## Required Project Shape

Every valid `.ai` project includes:

```text
.ai/
├── manifest.json
├── VISION.md
├── DESIGN.md
├── AGENTS.md
├── STACK.md
├── CONTEXT.md
├── specs/
├── plans/
├── decisions/
├── skills/
├── progress/
├── retrospectives/
└── guards/
```

Root adapter files are optional but recommended:

- `AGENTS.md` for Codex and generic agents
- `CLAUDE.md` for Claude Code
- `.cursor/rules/` for Cursor

## Manifest

`.ai/manifest.json` is the discovery surface. Tools must read it before
guessing project paths.

Required fields:

- `schemaVersion`: URL or relative path to the manifest schema.
- `standardVersion`: `.ai` standard version used by this project.
- `projectName`: display name for humans and tools.
- `createdAt`: ISO 8601 timestamp.
- `primitives`: enabled primitive list with names and paths.
- `adapters`: configured agent/IDE adapters.
- `guards`: checklist and command metadata.
- `activeWork`: paths for specs, plans, progress, and build report output.

## Lifecycle States

Specs use these states:

- `draft`: still being shaped.
- `active`: approved for planning.
- `in-progress`: implementation has started.
- `review`: awaiting verification or operator review.
- `completed`: shipped and archived.
- `rejected`: intentionally not pursued.

Plans use these states:

- `proposed`: agent or human draft.
- `approved`: operator-approved and ready to execute.
- `in-progress`: implementation has started.
- `completed`: all steps verified.
- `superseded`: replaced by a newer plan.

## Packs

Packs extend `.ai` without changing the core standard.

Pack types:

- `template`: project or artifact templates.
- `adapter`: agent/IDE integration files.
- `guard`: validation or review checks.
- `workflow`: skill files and workflow guidance.
- `example`: complete, filled sample projects.

Packs must declare:

- `name`
- `version`
- `type`
- `description`
- `standardVersion`
- `files`
- `license`

## Conformance

A conforming `.ai` implementation must:

1. Preserve markdown artifacts as source of truth.
2. Provide a valid `.ai/manifest.json`.
3. Keep required primitive paths discoverable.
4. Avoid silently deleting or rewriting operator-authored context.
5. Report actionable errors when required artifacts are missing.

The reference conformance command is:

```bash
dot-ai doctor
```

## Proof Before Expansion

`.ai Standard v0.1` is intentionally conservative. New standard primitives,
schemas, and governance surfaces should wait until public proof runs show that
the current directory improves real product-building outcomes.

The proof surface is implementation-level, not a new core primitive:

- `dot-ai prove <scenario>` creates an A/B proof run.
- `dot-ai prove score <proof-run-dir>` validates completed evidence and
  computes baseline-versus-candidate deltas.
- Scenario fixtures define rough prompts, acceptance criteria, and rubrics.
- Proof runs record readiness, final product outcome, acceptance coverage,
  rework, commands, screenshots, artifacts, and a plain-English verdict.
- `dot-ai score` measures spec/artifact readiness; proof runs measure final
  product outcome.

## Compatibility

`.ai` projects should remain readable across versions. Breaking changes require
an RFC, a migration note, and a compatibility window. Tools should prefer
warnings over hard failures when they encounter an older readable project.

## Trademark And Attribution

`.ai` is intended as an open standard and reference implementation maintained by
Christopher Carter and contributors. Third-party tools may truthfully describe
compatibility with the `.ai Standard` when they pass conformance checks.
