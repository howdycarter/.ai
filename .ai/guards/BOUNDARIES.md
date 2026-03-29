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
