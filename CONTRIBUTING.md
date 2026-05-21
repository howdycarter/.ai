# Contributing to .ai

Thanks for helping make `.ai/` the open standard for repo-native AI
development context.

## What We Welcome

- Standard improvements through RFCs
- Agent and IDE adapters
- Template, guard, workflow, and example packs
- Filled example projects and build reports
- Docs, diagrams, and migration guides
- CLI conformance checks and tests

## Before You Start

- Small docs fixes can go straight to a pull request.
- Standard, schema, manifest, lifecycle, or compatibility changes need an RFC.
- New packs should include metadata in `registry/index.json`.

## Pull Request Shape

Keep PRs focused. A good PR changes one concept and explains:

- what changed
- why it helps `.ai` become more useful or interoperable
- how it was tested

## Testing

Run:

```bash
npm test
node src/cli/index.js doctor
```

For template or setup changes, also smoke-test a temporary install:

```bash
tmpdir="$(mktemp -d)"
./setup.sh "$tmpdir"
node src/cli/index.js doctor --dir "$tmpdir"
```

## Standard Changes

Use `RFCs/0000-rfc-process.md` as the model. The standard lead makes final
calls while the project is young, with maintainers delegated over time.
