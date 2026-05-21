# Governance

`.ai` is a founder-led open standard and reference implementation.

## Roles

- **Standard lead:** Christopher Carter. Owns final direction, taste, scope, and
  compatibility decisions.
- **Maintainers:** trusted contributors who can approve pull requests, registry
  packs, schemas, adapters, and documentation.
- **Contributors:** anyone submitting issues, examples, packs, docs, or code.

## Decision Model

The project is not a foundation at v0.1. It is intentionally founder-led so the
standard can keep a sharp point of view while earning adoption.

Maintainers should optimize for:

- markdown-first interoperability
- small core primitives
- clear conformance behavior
- agent and IDE compatibility
- human-readable artifacts

## RFCs

Use RFCs for changes that alter the standard, manifest, schemas, lifecycle
states, conformance, or compatibility policy. See `RFCs/0000-rfc-process.md`.

## Pack Approval

Packs can be accepted when they:

- declare a type, version, standard compatibility, files, and license
- do not overwrite core project context without explicit consent
- add useful behavior without changing the core standard
- include a short example or test fixture when practical

## Compatibility Policy

Older `.ai` projects should stay readable. Breaking changes require an RFC,
migration notes, and a compatibility window. The reference CLI should warn
before it fails when it can still understand a project.
