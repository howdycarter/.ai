# Skill: .ai Help

## When to use

Use at the start of a session, when the operator asks "what now?", or when an
agent needs to orient itself inside a `.ai` project.

## Workflow

1. Read `.ai/manifest.json`.
2. Check active specs in `.ai/specs/active/`.
3. Check plans in `.ai/plans/`.
4. Check the latest progress entry in `.ai/progress/`.
5. Check guards listed in the manifest.

## Output

Return exactly these sections:

### Current state

Summarize active specs, approved plans, latest checkpoint, current branch, and
missing standard files.

### Blockers

List anything preventing useful work: missing manifest, no active spec, plan not
approved, failing guard, or unclear next action.

### Recommended next action

Give one concrete next action with the exact file or command to use.

### Optional actions

List up to three useful alternatives. Keep them short.

## Rules

- Prefer existing specs and plans over inventing new work.
- If no `.ai/manifest.json` exists, recommend `dot-ai init`.
- If a spec is draft quality, recommend `dot-ai score <spec>` or the interview
  skill before implementation.
- If a plan is not approved, do not recommend implementation.
