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
