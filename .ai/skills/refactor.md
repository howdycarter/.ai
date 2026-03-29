# Skill: Refactor

## When to use
Restructuring code without changing behavior.

## Workflow

### Step 1: Scope
Identify what to refactor and why. Check .ai/decisions/
for relevant architectural context.

### Step 2: Baseline
Run full test suite. All tests must pass before starting.
Note the test count and coverage.

### Step 3: Transform
Make structural changes. After each change:
1. Run tests — must still pass
2. Run typecheck and lint
3. Commit incrementally

### Step 4: Verify
1. Same tests pass as before (no regressions)
2. No new dependencies introduced
3. File and function size limits respected
4. Code is measurably better (fewer lines, clearer names,
   better separation of concerns)

### Step 5: Wrap up
Commit: refactor({scope}): {description}
Branch: refactor/{description}

## Rules
- Never mix refactoring with feature changes
- If tests fail at any point, revert the last change
- If refactor scope grows beyond 5 files, create a plan first
