# Skill: Resume Session

## When to use
Continuing work from a previous session.

## Workflow

### Step 1: Load checkpoint
Read latest .ai/progress/ entry for the CHECKPOINT block.
Identifies: spec, plan, branch, completed steps, next step,
and decisions already made.

### Step 2: Verify state
- Check out the correct branch
- Run tests, typecheck, lint
- If anything fails, STOP and tell operator

### Step 3: Orient
- Read the spec (for requirements context)
- Read the plan (for remaining steps)
- Read any amendments file
- Do NOT re-read files summarized in checkpoint

### Step 4: Continue
Pick up at "Next step" from checkpoint.
Follow new-feature skill implementation rules.

### Step 5: Update checkpoint
Write new CHECKPOINT block in today's progress file.

## Rules
- Never redo completed steps unless checkpoint says to
- Honor decisions from prior sessions
- If checkpoint has open questions, ask operator first
