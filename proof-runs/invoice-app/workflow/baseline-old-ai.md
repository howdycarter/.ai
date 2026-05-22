# Baseline Workflow: Old .ai

Ref: `8a1dd01`

The baseline app was built from the rough scenario prompt only:

> Build a small app for freelancers who need to create and track invoices
> without adopting a full accounting suite. The user can create clients, add
> invoice line items, preview totals, mark invoices paid, and see which invoices
> are overdue.

The baseline intentionally did not use the new `.ai` proof brief, manifest,
story lifecycle, `dot-ai status`, or `dot-ai prove` scoring loop during build
planning. This models a plausible rough-prompt workflow from the original
12-primitive `.ai` repo.

Expected risk: core invoice mechanics may exist, but secondary requirements
such as public-safe summary, explicit empty/loading/error states, and real-world
payment/tax caveats may be missing unless the rough prompt implied them.
