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
