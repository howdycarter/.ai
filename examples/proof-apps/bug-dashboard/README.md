# Proof App Brief: Bug Dashboard

## Product Goal

Build an internal bug dashboard that helps a team see urgent bugs, stale work,
ownership gaps, and triage status without digging through a ticket system.

## Minimum App Surface

- Display bugs with title, severity, status, owner, age, and affected area.
- Filter by severity and status.
- Highlight stale bugs.
- Highlight unowned bugs.
- Show empty state when no bugs match filters.
- Include a useful summary for a standup or handoff.

## Acceptance Evidence

Capture screenshots for:

- populated dashboard
- severity/status filtered view
- stale or unowned bug highlight
- empty filtered state

Recommended command evidence:

```bash
npm test
npm run build
```

## Proof Question

Does the `.ai` candidate produce a more operationally useful dashboard with
better acceptance coverage and clearer next-agent handoff than the baseline?
