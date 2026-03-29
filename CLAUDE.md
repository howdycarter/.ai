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
