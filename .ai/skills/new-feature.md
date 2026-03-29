# Skill: New Feature Implementation

## When to use
Any time you're implementing a spec from .ai/specs/active/.

## Pre-flight
1. Read .ai/AGENTS.md — follow all rules
2. Read .ai/DESIGN.md — follow visual system
3. Read .ai/STACK.md — use approved technologies only
4. Check .ai/decisions/ — respect all accepted decisions
5. Read .ai/CONTEXT.md — load feature-implementation profile

## Workflow

### Step 1: Read the spec
Read the target spec completely. Identify:
- All functional requirements (every SHALL statement)
- All acceptance criteria (every GIVEN/WHEN/THEN)
- All out-of-scope items (do NOT build these)
- All dependencies (verify they're met)

If any requirement is ambiguous, STOP and ask the operator.

### Step 2: Create the plan
Write a plan to .ai/plans/{spec-name}.plan.md including:
- Numbered steps grouped into phases
- Files to create or modify (with paths)
- Dependencies to install (with justification)
- Risks and mitigations
- Set Status to "proposed"

STOP HERE. Tell the operator:
"Plan ready for review at .ai/plans/{spec-name}.plan.md"
Do NOT proceed until the operator marks the plan as approved.

### Step 3: Implement (only after plan approval)
For each step in the approved plan:
1. Implement the change
2. Run typecheck and lint
3. If tests are specified, write and run them
4. Mark step as completed in the plan file
5. Commit with a descriptive message

If problem is minor: fix and note in plan.
If significant: STOP and ask the operator.

### Handling mid-implementation changes
If the operator creates .ai/plans/{spec-name}.amendments.md:
1. Read the amendment
2. Identify which completed steps need revision
3. Identify new steps to add
4. Continue implementation incorporating the amendment
5. If amendment invalidates >50% of remaining work, STOP
   and recommend a full re-plan

### Step 4: Verify
1. Run full test suite
2. Run typecheck and lint
3. Check all acceptance criteria from the spec
4. Review .ai/guards/CHECKLIST.md

### Step 5: Wrap up
1. Update .ai/progress/{date}.md with summary and CHECKPOINT
2. Move spec to .ai/specs/completed/
3. Report any new failure patterns for AGENTS.md

## Rules
- Never implement without an approved plan
- Never skip tests
- Never modify files in .ai/guards/
- Never introduce unapproved dependencies
- If stuck >10 minutes on one step, stop and ask
- One feature per branch: feat/{spec-name}
