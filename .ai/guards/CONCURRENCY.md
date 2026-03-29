# Concurrency Rules

## Branch isolation (mandatory)
Every agent session on its own branch.
Never two agents on the same branch.

## File ownership
No two agents modify the same file simultaneously.
Decompose specs to target different files/modules.

## Shared resource locks
Single-writer files: AGENTS.md, DESIGN.md, package.json.
Progress files: use session suffix (2026-03-28-session-1.md).

## Pre-parallel checklist
- [ ] No shared file modifications
- [ ] No shared database migrations
- [ ] No spec interdependencies
- [ ] Each spec independently verifiable

## Merge order
1. Most foundational branch first (data before UI)
2. Rebase remaining branches after each merge
3. Re-run tests on rebased branches
4. Operator resolves all merge conflicts (never agents)
