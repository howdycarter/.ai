# Proof App Brief: Invoice App

## Product Goal

Build a small freelancer invoice app that turns line items into a clear invoice
with correct totals, status tracking, and a public-safe client summary.

## Minimum App Surface

- Create or edit invoice metadata: client, invoice number, due date, status.
- Add, edit, and remove line items.
- Calculate subtotal, tax, discount, and total without floating-point display
  errors.
- Show empty state before line items exist.
- Show validation for invalid quantity, rate, or tax inputs.
- Produce a public-safe summary that excludes private notes.

## Acceptance Evidence

Capture screenshots for:

- invoice with at least two line items
- empty invoice state
- invalid input state
- public-safe summary

Recommended command evidence:

```bash
npm test
npm run build
```

## Proof Question

Does the `.ai` candidate produce fewer missing requirements and a clearer
handoff than the baseline while meeting the same invoice acceptance criteria?
