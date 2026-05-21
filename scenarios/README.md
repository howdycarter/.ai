# Proof Scenarios

Proof scenarios are small, repeatable product-build challenges for comparing a
baseline workflow against a candidate `.ai` workflow.

Each scenario contains:

- `prompt.md`: the same rough request both workflows receive.
- `acceptance.md`: the product behavior the final app must satisfy.
- `rubric.json`: dimensions for readiness and final outcome scoring.

Run a proof scenario with:

```bash
dot-ai prove invoice-app --baseline origin/main --candidate HEAD --out proof-runs/invoice-app
dot-ai prove score proof-runs/invoice-app
```

`dot-ai prove` creates a semi-manual evidence folder. It does not pretend to
automate the whole product build yet. After both builds are complete, fill in
`verdict.json` with commands, scores, screenshots, rework, and the final
plain-English verdict.

`dot-ai prove score` refuses incomplete evidence. It requires scored acceptance
items, scored rubric dimensions for both baseline and candidate, completed
commands, and a non-placeholder verdict before it computes the candidate delta
and refreshes `build-report.md`.

Publish the generated `build-report.md` only when it is public-safe and backed
by enough evidence to support the claim.
