# Security Policy

`.ai` stores product and development context in git. Treat it with the same
care as code.

## Supported Versions

Security fixes target the latest published standard and CLI release.

## Reporting A Vulnerability

Open a private security advisory on GitHub or contact the maintainer directly.
Do not publish exploit details until there is a fix or mitigation.

## Sensitive Data Rules

- Do not commit API keys, tokens, passwords, customer data, private URLs, or
  unreleased business details into `.ai`.
- Use `.ai/build-report.md` only after reviewing and redacting sensitive
  information.
- `dot-ai share` creates a local report; it does not publish anything.

## Maintainer Response

Maintainers should acknowledge credible reports, reproduce when possible, ship
a fix or documented mitigation, and add a guard or learned rule when the issue
can be prevented.
