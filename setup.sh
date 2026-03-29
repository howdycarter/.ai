#!/bin/bash
set -e

# .ai/ Setup Script
# Initializes the AI PM system in your project
# Usage: ./setup.sh [target-directory]

TARGET="${1:-.}"
AI_DIR="$TARGET/.ai"
CURSOR_DIR="$TARGET/.cursor/rules"

echo ""
echo "  ┌────────────────────────────────────────┐"
echo "  │  .ai/ (dot ai)                         │"
echo "  │  Your PM tool is a directory.          │"
echo "  └────────────────────────────────────────┘"
echo ""

# Check if .ai already exists
if [ -d "$AI_DIR" ]; then
  echo "  ⚠  .ai/ directory already exists at $TARGET"
  echo "     Use --force to overwrite, or manually merge."
  if [ "$2" != "--force" ]; then
    exit 1
  fi
  echo "     --force detected. Overwriting..."
  echo ""
fi

echo "  Creating directory structure..."

# Core directories
mkdir -p "$AI_DIR/specs/active"
mkdir -p "$AI_DIR/specs/draft"
mkdir -p "$AI_DIR/specs/completed"
mkdir -p "$AI_DIR/specs/rejected"
mkdir -p "$AI_DIR/plans"
mkdir -p "$AI_DIR/decisions"
mkdir -p "$AI_DIR/skills"
mkdir -p "$AI_DIR/progress"
mkdir -p "$AI_DIR/retrospectives"
mkdir -p "$AI_DIR/guards"
mkdir -p "$CURSOR_DIR"

echo "  ✓ Directories created"

# --- VISION.md ---
cat > "$AI_DIR/VISION.md" << 'ENDOFFILE'
# Vision: {Project Name}

## One-line summary
{One sentence describing what this product does.}

## The problem
{Who has this problem? What pain are they experiencing? Why do existing solutions fail them?}

## Who it's for
{Specific target user. Demographics, behaviors, needs. Be precise — "everyone" means no one.}

## What success looks like
- {Metric 1}
- {Metric 2}
- {Metric 3}

## Business model
{How does this make money? Pricing structure.}

## What this is NOT
- Not {thing users might expect but we won't build}
- Not {adjacent product we're not competing with}
- Not {scope we're explicitly excluding}

## Competitive positioning
{Who's closest? How do we differentiate?}

## Core principles
1. {Principle that guides design and implementation decisions}
2. {Principle that guides design and implementation decisions}
3. {Principle that guides design and implementation decisions}
ENDOFFILE

# --- DESIGN.md ---
cat > "$AI_DIR/DESIGN.md" << 'ENDOFFILE'
# Design System: {Project Name}

## Brand personality
{2-3 adjectives. What does this product feel like?}
Inspired by: {2-3 reference products or brands}

## Colors

### Core palette
| Token           | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| --primary       | #         | Primary actions, links, active states    |
| --primary-hover | #         | Hover state for primary elements         |
| --secondary     | #         | Secondary text, labels, metadata         |
| --accent        | #         | Success states, positive indicators      |
| --warning       | #         | Caution states                           |
| --danger        | #         | Errors, destructive actions              |
| --surface       | #FFFFFF   | Card and component backgrounds           |
| --background    | #F8FAFC   | Page background                          |
| --border        | #E2E8F0   | Dividers, card borders, input borders    |
| --text-primary  | #0F172A   | Headings, primary content                |
| --text-secondary| #475569   | Supporting text, descriptions            |
| --text-muted    | #94A3B8   | Placeholder text, disabled states        |

## Typography

### Font stack
- **Primary:** {font} (fallback: -apple-system, system-ui, sans-serif)
- **Monospace:** {font} (fallback: Menlo, Consolas, monospace)

### Scale
| Name        | Size   | Weight | Line height | Usage                    |
|-------------|--------|--------|-------------|--------------------------|
| h1          | 24px   | 600    | 1.3         | Page titles              |
| h2          | 20px   | 600    | 1.35        | Section headers          |
| h3          | 16px   | 600    | 1.4         | Card titles              |
| body        | 14px   | 400    | 1.5         | Default text             |
| body-sm     | 13px   | 400    | 1.5         | Dense UI, table cells    |
| caption     | 12px   | 500    | 1.4         | Labels, metadata         |

## Spacing (base unit: 4px)
| Token | Value | Usage                              |
|-------|-------|------------------------------------|
| xs    | 4px   | Inline element gaps                |
| sm    | 8px   | Icon-to-label gaps, tight padding  |
| md    | 12px  | Default padding inside components  |
| lg    | 16px  | Section spacing, card padding      |
| xl    | 24px  | Between card groups                |
| 2xl   | 32px  | Major section breaks               |

## Borders and corners
| Context           | Radius | Border                       |
|-------------------|--------|------------------------------|
| Cards             | 12px   | 1px solid --border           |
| Buttons           | 8px    | None (filled) or 1px --border|
| Inputs            | 8px    | 1px solid --border           |
| Modals            | 16px   | None (shadow only)           |

## Component patterns

### Cards
Container: --surface background, radius-12, padding-lg
Header: h3 title left-aligned
Content: body text, --text-secondary for supporting info
Hover: elevation change, transition 150ms

### Buttons
Primary: --primary bg, white text, weight 500, padding sm/lg, radius-8
Secondary: transparent bg, --primary text, 1px --border border
Danger: --danger bg, white text — destructive actions only
Disabled: opacity 0.5, cursor not-allowed

### Empty states
Container: centered, max-width 400px, padding-2xl
Icon: 48px, --text-muted
Headline: h2, --text-primary
Description: body, --text-secondary, max 2 lines
Action: primary button

## Animation
- Duration: 150ms micro-interactions, 300ms transitions
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Respect prefers-reduced-motion: disable non-essential animation

<!-- TIP: Generate this file from Google Stitch (stitch.withgoogle.com)
     or extract from any existing site using Stitch's URL extraction. -->
ENDOFFILE

# --- AGENTS.md ---
cat > "$AI_DIR/AGENTS.md" << 'ENDOFFILE'
# Agent Instructions: {Project Name}

Read .ai/VISION.md for product context.
Read .ai/DESIGN.md for visual system.
Read .ai/STACK.md for technology decisions.
Read .ai/CONTEXT.md for context loading profiles.

## Project structure
<!-- Update this to match your actual project structure -->
```
src/
├── app/              # Pages and routes
├── components/       # UI components
├── lib/              # Utilities, API clients, helpers
├── hooks/            # Custom hooks
├── types/            # Type definitions
└── styles/           # Global styles
```

## Build and test commands
<!-- Replace with your actual commands -->
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run lint` — run linter
- `npm run typecheck` — run type checker
- `npm run test` — run test suite

Run typecheck and lint after every change.
Run tests before marking any plan task as complete.

## Coding conventions
<!-- Customize for your project -->
- TypeScript strict mode, no `any` types, no `@ts-ignore`
- Functions: max 30 lines. If longer, decompose.
- Files: max 300 lines. If longer, split into modules.
- One component per file, named exports
- No default exports except framework-required files

## Error handling
- Return `{ data, error }` from server functions — never throw
- Always show error states to users, never blank screens
- User-facing error messages must be helpful and specific
- Log errors with context (user ID, action, input)

## Testing requirements
- Every new feature needs at least 3 tests:
  1. Happy path
  2. Error/edge case
  3. Empty state
- Test behavior, not implementation

## Security rules — NON-NEGOTIABLE
- NEVER expose API keys in client-side code
- NEVER disable security policies to fix runtime errors
- NEVER log sensitive user data
- All user input: validate on server, sanitize on display
<!-- Add project-specific security rules here -->

## Git conventions
- Branch names: `feat/{spec-name}`, `fix/{issue}`, `refactor/{scope}`
- Commit messages: conventional commits format
- One logical change per commit

## Learned rules (append-only — add failures here)
<!-- When an agent makes a mistake, add a dated rule preventing it.
     This section grows over time and becomes the project's immune system. -->
ENDOFFILE

# --- STACK.md ---
cat > "$AI_DIR/STACK.md" << 'ENDOFFILE'
# Technology Stack: {Project Name}

<!-- Document every technology choice with a one-line justification.
     Include what you're NOT using and why.
     Agents reference this to stay within approved technologies. -->

## Framework: {name and version}
Why: {one-line justification}

## Database: {name}
Why: {one-line justification}

## Styling: {approach}
Why: {one-line justification}

## Testing: {framework}
Why: {one-line justification}

## Deployment: {platform}
Why: {one-line justification}

## NOT using (and why)
- **{Technology}:** {why not}
- **{Technology}:** {why not}
ENDOFFILE

# --- CONTEXT.md ---
cat > "$AI_DIR/CONTEXT.md" << 'ENDOFFILE'
# Context Budget: {Project Name}

<!-- Every .ai/ file consumes tokens. Load only what's needed per task type.
     Smaller relevant context beats larger noisy context. -->

## Model context windows
| Model              | Window    | Effective budget* |
|--------------------|-----------|-------------------|
| Claude Opus 4.6    | 200K      | ~150K usable      |
| Claude Sonnet 4.6  | 200K      | ~120K usable      |
| GPT-4.1            | 128K      | ~90K usable       |
| Cursor (varies)    | 128-200K  | ~80-120K usable   |

*Effective = window minus output reservation and system overhead.

## Loading profiles

### Profile: feature-implementation
Load for: implementing specs, plan generation, code writing
Always load:
- .ai/AGENTS.md (full)
- .ai/DESIGN.md (full)
- .ai/STACK.md (full)
- Target spec from .ai/specs/active/
- Approved plan from .ai/plans/ (if exists)
- Active skill file from .ai/skills/
Load if relevant:
- .ai/decisions/ — only decisions referenced by the spec
- .ai/progress/ — latest entry only (for session continuity)
Skip:
- .ai/VISION.md (already internalized in the spec)
- .ai/retrospectives/
- Other specs not being implemented
- .ai/guards/ (enforced by CI, not by the agent reading them)

### Profile: spec-writing
Load for: drafting new specs, refining requirements
Always load:
- .ai/VISION.md (full — need product context)
- .ai/DESIGN.md (component patterns section only)
- .ai/specs/_TEMPLATE.md
- .ai/specs/_QUALITY_RUBRIC.md
Load if relevant:
- Related completed specs (for pattern reference)
- Relevant decisions
Skip:
- .ai/AGENTS.md (not writing code)
- .ai/STACK.md (not making tech decisions)
- .ai/skills/ (not executing a workflow)

### Profile: bug-fix
Load for: diagnosing and fixing reported issues
Always load:
- .ai/AGENTS.md (full)
- .ai/skills/bug-fix.md
- .ai/progress/ — latest 2 entries
Load if relevant:
- Spec that introduced the broken feature
- Related decisions
Skip:
- .ai/VISION.md
- .ai/DESIGN.md (unless it's a visual bug)
- Other specs and plans

### Profile: session-resume
Load for: continuing work from a previous session
Always load:
- .ai/AGENTS.md (full)
- .ai/progress/ — latest entry (contains checkpoint)
- The in-progress plan (has completion markers)
- The source spec
Skip:
- Everything already summarized in the progress checkpoint

## Compression rules
- If total loaded context exceeds 30% of model window,
  compress: load DESIGN.md component patterns only, AGENTS.md
  critical rules only
- Never compress: the target spec, the approved plan, security rules
- When in doubt: smaller context with higher relevance wins
ENDOFFILE

# --- Spec Template ---
cat > "$AI_DIR/specs/_TEMPLATE.md" << 'ENDOFFILE'
# Spec: {Feature Name}

**Status:** draft | active | in-progress | review | completed | rejected
**Priority:** p0-critical | p1-high | p2-medium | p3-low
**Complexity:** small (hours) | medium (day) | large (days) | xl (week+)
**Created:** {YYYY-MM-DD}
**Last updated:** {YYYY-MM-DD}

## Problem
What's broken or missing, and for whom. Be specific about the user
pain. Reference .ai/VISION.md if relevant.

## Solution
What we're building. Specific enough that an AI agent can implement
it without asking follow-up questions. If the agent has to guess,
this section failed.

## Requirements

### Functional
- [ ] The system SHALL...
- [ ] The system SHALL...
- [ ] The system SHALL NOT...

### Non-functional
- **Performance:** {specific targets}
- **Security:** {specific requirements}
- **Accessibility:** {WCAG level, specific needs}

## Acceptance criteria
Each criterion must be independently testable.
- [ ] GIVEN {context}, WHEN {action}, THEN {expected result}
- [ ] GIVEN {context}, WHEN {edge case}, THEN {expected handling}
- [ ] GIVEN {context}, WHEN {error condition}, THEN {error handling}

## UI/UX requirements
Reference .ai/DESIGN.md for visual system. Describe layout,
interactions, and states (loading, empty, error, populated).

## Out of scope
What this spec explicitly does NOT cover. Important for preventing
agent scope creep.

## Dependencies
- Other specs this depends on (verified as complete: yes/no)
- External services or APIs needed
- Data requirements

## Technical notes (optional)
Hints for the agent about approach. Not prescriptive — the agent
and plan review will determine implementation details.

## References
- Links to designs, mockups, screenshots
- Links to related specs or decisions
- Links to external documentation
ENDOFFILE

# --- Quality Rubric ---
cat > "$AI_DIR/specs/_QUALITY_RUBRIC.md" << 'ENDOFFILE'
# Spec Quality Rubric

Score each dimension 0-2. Total >= 14 to move to active/.

## Dimensions

### Clarity (0-2)
- 0: Agent would need 3+ follow-up questions
- 1: 1-2 areas where agent might guess
- 2: Agent can implement without any clarification

### Completeness (0-2)
- 0: Missing requirements or acceptance criteria
- 1: Core requirements present, edge cases partial
- 2: All requirements, edge cases, error states enumerated

### Testability (0-2)
- 0: Subjective criteria ("should feel fast")
- 1: Most criteria testable, some vague
- 2: Every criterion is GIVEN/WHEN/THEN, automatable

### Scoping (0-2)
- 0: No out-of-scope section or unclear scope
- 1: Out-of-scope exists but incomplete
- 2: Clear boundaries on what NOT to build

### Design integration (0-2)
- 0: No UI section, no DESIGN.md reference
- 1: General UI description, missing state coverage
- 2: All states described, DESIGN.md referenced

### Dependencies (0-2)
- 0: Dependencies not identified
- 1: Listed but not verified as met
- 2: Listed and confirmed available

### Architecture alignment (0-2)
- 0: No reference to STACK.md or decisions/
- 1: Partially aligned
- 2: Consistent with all decisions, uses approved stack

### Sizing accuracy (0-2)
- 0: No estimate or clearly wrong
- 1: Rough estimate, might be 2x off
- 2: Realistic, backed by comparable completed specs

## Scoring
| Score | Readiness                                        |
|-------|--------------------------------------------------|
| 14-16 | Ready for active/ — proceed to planning          |
| 10-13 | Almost ready — fix flagged dimensions             |
| 6-9   | Needs significant work                           |
| 0-5   | Rethink from scratch                             |

## Usage
Ask the agent: "Score this spec against .ai/specs/_QUALITY_RUBRIC.md.
List each dimension with score and rationale. Flag anything below 2."
ENDOFFILE

echo "  ✓ Core context files created"

# --- Skills ---
cat > "$AI_DIR/skills/new-feature.md" << 'ENDOFFILE'
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
ENDOFFILE

cat > "$AI_DIR/skills/bug-fix.md" << 'ENDOFFILE'
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
ENDOFFILE

cat > "$AI_DIR/skills/resume-session.md" << 'ENDOFFILE'
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
ENDOFFILE

cat > "$AI_DIR/skills/refactor.md" << 'ENDOFFILE'
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
ENDOFFILE

cat > "$AI_DIR/skills/security-review.md" << 'ENDOFFILE'
# Skill: Security Review

## When to use
Before any production launch or when handling user data.

## Workflow

### Step 1: Dependency audit
- Run dependency vulnerability scan (npm audit, OWASP)
- Flag any critical/high findings
- Verify no unnecessary dependencies

### Step 2: Authentication and authorization
- Verify auth is implemented correctly
- Check that all protected routes require authentication
- Verify authorization rules (users can only access their data)
- Check for privilege escalation paths

### Step 3: Input validation
- All user inputs validated server-side
- No raw user input rendered without sanitization
- File uploads validated (type, size, content)
- SQL/NoSQL injection prevention verified

### Step 4: Data exposure
- No API keys in client-side code
- No sensitive data in logs
- No sensitive data in URL parameters
- No excessive data returned from API endpoints
- Check for information leakage in error messages

### Step 5: Infrastructure
- HTTPS enforced
- CORS configured correctly
- Rate limiting in place
- CSP headers configured

### Step 6: Report
Document findings with severity (critical/high/medium/low).
Critical and high must be fixed before launch.
ENDOFFILE

cat > "$AI_DIR/skills/onboard.md" << 'ENDOFFILE'
# Skill: Onboard — Initialize .ai/ for This Project

## When to use
Run once when .ai/ is first added to a project. This skill inspects the
existing codebase, infers as much context as possible, asks the operator
only what it can't determine from code, and populates every .ai/ file.

The operator reviews and approves. They stay in control without having
to manually author 12 files from scratch.

## Workflow

### Step 1: Detect project type
Check for package.json, src/, tsconfig.json, tailwind.config.*,
.env.example, CI config, database config, test config.
If code exists: brownfield (proceed to Step 2).
If empty: greenfield (skip to Step 3).

### Step 2: Auto-detect from codebase (brownfield only)
Read existing files and extract structured information. Do NOT ask
the operator for anything you can determine from the code.

From package.json: framework, dependencies, scripts.
From tsconfig: strict mode, path aliases.
From directory structure: map the actual folder tree.
From tailwind/CSS: extract design tokens.
From .env.example: identify external services (not secrets).
From CI config: extract pipeline checks.
From git log (last 20 commits): detect conventions.

Present a summary of everything detected and ask the operator to
confirm or correct.

### Step 3: Interview the operator
Ask ONLY questions auto-detection couldn't answer. All in ONE message.
Maximum 6 questions:

1. "In one sentence, what does this product do and who is it for?"
2. "What are 2-3 things this product is explicitly NOT?"
3. "What does success look like? (2-3 measurable outcomes)"
4. "Describe the visual feel in 2-3 words and name 1-2 design inspirations."
5. "Any absolute rules agents must follow?"
6. "Technologies you've decided NOT to use, and why?"

Skip any already answered by auto-detection.

### Step 4: Generate all files
Using detected data + operator answers, populate:
- VISION.md, DESIGN.md, AGENTS.md, STACK.md, CONTEXT.md
- CLAUDE.md (root, with 10 critical rules front-loaded)
- .cursor/rules/*.mdc (scoped to detected directory structure)
- guards/CHECKLIST.md (matched to detected CI pipeline)

Leave universal files as-is: BOUNDARIES.md, CONCURRENCY.md,
specs/_TEMPLATE.md, _QUALITY_RUBRIC.md, skills/*, retrospectives/.

### Step 5: Present for review
Show summary of what was generated. Tell operator to review
AGENTS.md first (it's the law). Then offer to help write their
first spec.

## Rules
- Never ask a question you can answer from the codebase
- Never ask more than 6 questions total
- Ask all questions in one message, not sequentially
- Generate files immediately after answers
- The operator reviews and corrects — they don't author from scratch
ENDOFFILE

echo "  ✓ Skills created"

# --- Guards ---
cat > "$AI_DIR/guards/CHECKLIST.md" << 'ENDOFFILE'
# Pre-Merge Checklist

Every PR must pass ALL of these before merging.

## Automated (CI/CD)
- [ ] Typecheck: zero errors
- [ ] Lint: zero warnings
- [ ] Tests: zero failures
- [ ] Files: none exceed 300 lines
- [ ] Functions: none exceed 30 lines
- [ ] Security scan: zero critical/high findings

## Manual (operator)
- [ ] Matches spec acceptance criteria
- [ ] UI matches DESIGN.md
- [ ] Loading, empty, error states work
- [ ] Mobile responsive
- [ ] No unapproved dependencies
ENDOFFILE

cat > "$AI_DIR/guards/BOUNDARIES.md" << 'ENDOFFILE'
# Agent Boundaries — Hard Limits

These require explicit operator approval in the plan.

## Never do autonomously
- Modify auth/authorization logic
- Change database security policies
- Add/modify payment or billing code
- Change database schema
- Install unapproved dependencies
- Modify CI/CD configuration
- Change environment variables or secrets
- Disable linter or type checker
- Modify any file in .ai/guards/
- Merge without passing all guards
- Deploy without operator approval
- Skip tests
- Build features without an approved spec
ENDOFFILE

cat > "$AI_DIR/guards/CONCURRENCY.md" << 'ENDOFFILE'
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
ENDOFFILE

echo "  ✓ Guards created"

# --- Retrospective template ---
cat > "$AI_DIR/retrospectives/_TEMPLATE.md" << 'ENDOFFILE'
# Retrospective: {Month Year}

<!-- Create monthly, or after every 10 completed specs. -->

## Velocity
- Specs completed:
- Specs rejected:
- Average time active to completed:
- Fastest:
- Slowest:

## Quality
- Plans requiring 3+ annotation cycles:
- CI failures caught before merge:
- CI failures that reached main:
- Security findings:

## Rework
- Specs requiring amendments:
- Full session reverts:
- Agent deviations from plan:

## AGENTS.md health
- Rules added this month:
- Rules that prevented repeat failures:

## Spec quality trend
- Average rubric score at activation:
- Dimensions most frequently below 2:

## Context efficiency
- Sessions where agent lost context mid-task:

## Guard effectiveness
- Checklist items that caught real issues:
- Checklist items that never caught anything (remove these):

## Actions for next month
1.
2.
3.
ENDOFFILE

echo "  ✓ Retrospective template created"

# --- .gitkeep files for empty directories ---
touch "$AI_DIR/specs/active/.gitkeep"
touch "$AI_DIR/specs/draft/.gitkeep"
touch "$AI_DIR/specs/completed/.gitkeep"
touch "$AI_DIR/specs/rejected/.gitkeep"
touch "$AI_DIR/plans/.gitkeep"
touch "$AI_DIR/decisions/.gitkeep"
touch "$AI_DIR/progress/.gitkeep"
touch "$AI_DIR/retrospectives/.gitkeep"

# --- Cursor rules ---
cat > "$CURSOR_DIR/global.mdc" << 'ENDOFFILE'
---
globs: **/*
---
If `.ai/VISION.md` contains placeholder text, run `.ai/skills/onboard.md` first.
Otherwise: read `.ai/AGENTS.md` for full project instructions.
Follow the spec > plan > build workflow in `.ai/skills/`.
Load context per `.ai/CONTEXT.md` profiles.
ENDOFFILE

cat > "$CURSOR_DIR/react-components.mdc" << 'ENDOFFILE'
---
globs: src/components/**/*.tsx
---
Follow `.ai/DESIGN.md` for all visual decisions.
One component per file. Named exports only.
Handle all states: loading, empty, error, populated.
Tailwind only. No inline styles. No CSS modules.
ENDOFFILE

cat > "$CURSOR_DIR/tests.mdc" << 'ENDOFFILE'
---
globs: **/*.test.ts,**/*.test.tsx
---
Every feature needs 3 tests: happy path, error/edge case, empty state.
Test behavior, not implementation.
Mock external services, never hit real databases.
ENDOFFILE

echo "  ✓ Cursor rules created"

# --- Root pointer files ---
cat > "$TARGET/CLAUDE.md" << 'ENDOFFILE'
# {Project Name}

<!-- FIRST-RUN DETECTION
     If this file still says {Project Name} above, .ai/ has not been
     initialized yet. Follow .ai/skills/onboard.md immediately.
     Do not wait for the operator to ask. Start onboarding now. -->

## On session start
1. If VISION.md contains "{Project Name}" → run .ai/skills/onboard.md
2. Otherwise → check .ai/progress/ for the latest checkpoint
3. Load context per .ai/CONTEXT.md for the current task type

## Critical rules (always in memory)
- Read `.ai/AGENTS.md` for full instructions. All context in `.ai/`.
- NEVER implement without an approved plan in `.ai/plans/`.
- Run typecheck and lint after every change.

<!-- After onboarding, replace this file with your project-specific
     critical rules. The onboard skill will do this automatically.
     Keep the top 10 rules that matter most here — the first 50 lines
     of CLAUDE.md are disproportionately influential on agent behavior. -->

## Context loading
Follow `.ai/CONTEXT.md` for which files to load per task type.
ENDOFFILE

cat > "$TARGET/AGENTS.md" << 'ENDOFFILE'
<!-- If .ai/VISION.md contains placeholder text "{Project Name}",
     run .ai/skills/onboard.md to initialize the project. -->

See `.ai/AGENTS.md` for complete agent instructions.
Read `.ai/CONTEXT.md` to determine which files to load.
ENDOFFILE

echo "  ✓ Root pointer files created"

# --- Summary ---
echo ""
echo "  ┌──────────────────────────────────────────────┐"
echo "  │  Setup complete!                             │"
echo "  │                                              │"
echo "  │  Open your AI coding tool and it will        │"
echo "  │  detect the fresh install automatically.     │"
echo "  │                                              │"
echo "  │  The agent will:                             │"
echo "  │  • Inspect your codebase                     │"
echo "  │  • Ask you 3-6 questions                     │"
echo "  │  • Populate every .ai/ file for you          │"
echo "  │  • Help you write your first spec            │"
echo "  │                                              │"
echo "  │  Just open Claude Code, Cursor, or Codex.    │"
echo "  │  The onboarding starts itself.               │"
echo "  │                                              │"
echo "  │  Full guide: howdycarter.com/dot-ai           │"
echo "  └──────────────────────────────────────────────┘"
echo ""
