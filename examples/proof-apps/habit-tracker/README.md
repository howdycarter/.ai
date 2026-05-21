# Proof App Brief: Habit Tracker

## Product Goal

Build a private habit tracker that helps a user complete daily check-ins,
recover from missed days, and understand progress without shame-heavy UX.

## Minimum App Surface

- Create at least one habit with a name and cadence.
- Mark today's habit complete.
- Show streak and recent completion pattern.
- Handle missed days with a recovery state.
- Include empty state before habits exist.
- Avoid exposing private habit details in shareable output.

## Acceptance Evidence

Capture screenshots for:

- first-run empty state
- completed check-in state
- missed-day recovery state
- progress pattern view

Recommended command evidence:

```bash
npm test
npm run build
```

## Proof Question

Does the `.ai` candidate produce a more complete product loop, better privacy
handling, and less rework than the baseline?
