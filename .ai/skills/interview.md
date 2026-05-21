# Skill: .ai Interview

## When to use

Use when the operator has an idea, feature, bug, product concept, or vague
request that is not yet implementation-ready.

## Goal

Produce a spec the agent can implement without guessing. Preserve the
operator's judgment, language, constraints, and tradeoffs.

## Flow

### 1. Brain dump

Ask for all available context: notes, files, links, sketches, examples,
constraints, anti-goals, and "anything else I am forgetting?"

### 2. Stakes

Classify the work as one of:

- hobby
- internal
- launch
- enterprise/compliance

Use the stakes to choose rigor. Do not over-process a tiny change.

### 3. Mode

Offer:

- Fast: infer with `[ASSUMPTION]` tags and let the operator review.
- Coached: walk the important product questions together.
- Deep: add review lenses, risk scans, and richer downstream artifacts.

### 4. Concern scan

Check whether the work involves UX, security, privacy, data migration,
integrations, public API contracts, monetization, performance, rollout,
support, or compliance.

### 5. Draft artifact

Write an interview summary with:

- operator language
- confirmed decisions
- assumptions
- open questions
- non-goals
- important discarded paths

### 6. Spec draft

Create or update a spec using `.ai/specs/_TEMPLATE.md`.

### 7. Review lenses

Apply the lenses that matter:

- first principles
- pre-mortem
- edge cases
- security/privacy
- implementation risk
- UX friction
- go-to-market clarity

### 8. Activate

Score the spec. Move it to `.ai/specs/active/` only when it is ready or when
the operator explicitly accepts the risk.

## Rules

- Do not start implementation during the interview.
- Mark unconfirmed inferences with `[ASSUMPTION]`.
- Keep markdown artifacts as the record.
- Ask fewer, better questions.
