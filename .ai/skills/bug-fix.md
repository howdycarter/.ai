# Skill: Bug Fix

## When to use
Fixing a reported bug or unexpected behavior.

## Workflow

### Step 1: Understand
Read the bug report. Identify expected vs actual behavior,
steps to reproduce, and affected users/contexts.

### Step 2: Reproduce
Write a FAILING test before fixing. The test must fail now
and pass after the fix. If you can't reproduce, STOP and
ask the operator for more information.

### Step 3: Diagnose
Identify root cause. Check .ai/decisions/ for context —
the bug may stem from an architectural choice.

### Step 4: Fix
Fix root cause, not symptom. Keep changes minimal.
If fix requires >3 files, create a plan for review first.

### Step 5: Verify
1. Failing test now passes
2. Full test suite passes (no regressions)
3. Typecheck and lint pass

### Step 6: Immunize
If preventable by an AGENTS.md rule, tell the operator
so they can add it to learned rules.

### Step 7: Wrap up
1. Commit: fix({scope}): {description}
2. Update progress file with CHECKPOINT
3. Branch: fix/{description}
