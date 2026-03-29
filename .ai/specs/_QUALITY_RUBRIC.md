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
