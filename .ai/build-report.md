# Built with .ai

## Project

.ai

## Idea

Turn `.ai/` into the open standard for repo-native AI development context.

## Original Prompt

Make `.ai` better by incorporating the strongest parts of adjacent AI workflow
systems without copying them, then prove whether the new version actually helps
build better products.

## Interview Highlights

- Stakes: make `.ai` viral, useful, and credible enough to compete with major
  open-source AI workflow repos.
- Assumptions: markdown remains canonical; the CLI accelerates but does not own
  the workflow; standard claims must be earned through proof.
- Decisions: add manifest, schemas, skills, conformance checks, share reports,
  then add Proof Lab to measure final product outcomes.
- Open questions: how much better the candidate becomes after three real A/B
  product builds, and which scenario produces the clearest public story.

## Active Specs

- Open Standard 10X implementation branch: `codex/open-standard-10x`

## Plan

1. Keep `.ai/` simple enough to use as plain markdown.
2. Add machine-readable discovery and validation for tools.
3. Add interview and help skills so rough ideas become executable specs.
4. Add proof scenarios and `dot-ai prove` so final product outcomes can be
   compared against a baseline.
5. Publish only public-safe build reports backed by evidence.

## Outcome

This branch adds the first standard surface: human spec, manifest, schemas,
registry, governance, CLI conformance checks, shareable proof artifacts, and
Proof Lab scenarios for product-outcome comparison.

## Acceptance Results

- [x] `.ai` has a machine-readable manifest and conformance command.
- [x] `.ai` has help and interview skills for agent/human workflow quality.
- [x] `.ai` can generate a sanitized build report.
- [x] `.ai` now has canonical proof scenarios and `dot-ai prove`.
- [ ] Three full A/B product builds have not yet been completed.

## Evidence

- Commands: `npm test`, `dot-ai doctor`, `dot-ai prove invoice-app`, and
  `dot-ai prove score <proof-run-dir>`.
- Screenshots: not applicable yet.
- Pull request: pending.

## Verdict

The new `.ai` is materially better as a product-building system because it now
separates artifact readiness from final app quality and gives the project a
repeatable way to prove, disprove, and share its claims.

## Lessons

- Virality should come from public proof artifacts and compatibility, not hype.
- Markdown remains canonical; the CLI validates and accelerates.
- The standard should not expand beyond v0.1 until proof runs show measurable
  product-building advantage.

## Safety

This report is intended for public sharing after review. Remove private paths,
credentials, customer data, and unreleased business details before publishing.
