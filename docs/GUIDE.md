# .ai/ (dot ai) — A Complete Guide to Replacing Your PM Tool with Markdown

*By Christopher Carter · March 2026*

---

The ticket is dead. Jira, Trello, Linear — the entire class of tools built to coordinate humans executing small units of work — are being absorbed into something simpler and more powerful: a directory of structured markdown files that AI agents read natively and humans read easily.

This guide documents the complete system. A set of markdown primitives replaces your project management tool, your design handoff process, your sprint ceremonies, your standups, your QA checklists, and your onboarding documentation. The entire PM function lives in version-controlled markdown inside the same repo as your code.

This isn't theory. Every primitive described here is already in production use across thousands of projects. CLAUDE.md was formalized by Anthropic. AGENTS.md was introduced by OpenAI. .cursorrules was built by Cursor. DESIGN.md was launched by Google Stitch. GitHub published Spec Kit. What nobody has done — until now — is assemble all of them into one coherent, opinionated system.

This guide does that.

---

## Who this is for

You are a **context engineer** — someone who builds software by writing structured documents that AI agents execute, rather than writing code directly. You might be:

- A founder shipping a product without a development team
- A product manager who can now build what they spec
- A designer who thinks in systems and wants to ship, not hand off
- A "Member of Technical Staff" — the emerging generalist role where your value is context quality, not code output
- A technical leader transitioning your team from ticket-based to context-driven development

You don't need to write code. You need to write great specs, maintain great context files, and apply great judgment during review.

---

## The repo structure

```
project-root/
├── .ai/                              # The AI PM system
│   ├── VISION.md                     # What we're building and why
│   ├── DESIGN.md                     # How it looks (visual system)
│   ├── AGENTS.md                     # How agents behave
│   ├── STACK.md                      # Technology decisions
│   ├── CONTEXT.md                    # Context budgets and loading rules
│   ├── specs/                        # What to build (replaces the backlog)
│   │   ├── _TEMPLATE.md              # Every new spec copies this
│   │   ├── _QUALITY_RUBRIC.md        # Spec readiness scoring
│   │   ├── active/                   # Approved for implementation
│   │   ├── draft/                    # In progress, not yet approved
│   │   ├── completed/               # Shipped (historical record)
│   │   └── rejected/                # Killed with documented reasoning
│   ├── plans/                        # How to build it (replaces sprint planning)
│   │   ├── {spec-name}.plan.md       # Agent-generated implementation plans
│   │   └── {spec-name}.amendments.md # Mid-flight requirement changes
│   ├── decisions/                    # Why we chose X over Y (replaces tribal knowledge)
│   │   └── {NNN}-{title}.md          # Architecture Decision Records
│   ├── skills/                       # Reusable agent workflows (replaces process docs)
│   │   ├── new-feature.md
│   │   ├── bug-fix.md
│   │   ├── resume-session.md
│   │   ├── refactor.md
│   │   ├── deploy.md
│   │   └── security-review.md
│   ├── progress/                     # What happened (replaces standups)
│   │   └── {YYYY-MM-DD}.md           # Session logs with checkpoints
│   ├── retrospectives/               # Learning and system improvement
│   │   └── {YYYY-MM}-retro.md        # Monthly retrospectives
│   └── guards/                       # What must pass before shipping (replaces QA)
│       ├── CHECKLIST.md              # Pre-merge verification
│       ├── BOUNDARIES.md             # What agents must NEVER do unsupervised
│       ├── CONCURRENCY.md            # Multi-agent coordination rules
│       └── eslint.config.js          # Symlinked to root — agents cannot modify
├── src/                              # The codebase
├── .cursor/rules/                    # Scoped rules per file type
│   ├── global.mdc
│   ├── react-components.mdc
│   ├── api-routes.mdc
│   └── tests.mdc
├── CLAUDE.md                         # Smart pointer with critical rules
└── AGENTS.md                         # Pointer for OpenAI Codex
```

### Smart root-level pointer files

The first lines an agent reads are the most influential on its behavior. Don't waste them on a redirect — front-load your most critical rules.

**CLAUDE.md** (for Claude Code):

```markdown
# Meridian

## Critical rules (always in memory)
- Read `.ai/AGENTS.md` for full instructions. All context in `.ai/`.
- TypeScript strict. No `any`. No `@ts-ignore`.
- Functions ≤30 lines. Files ≤300 lines.
- All data fetching via server components or server actions.
- Supabase queries only through `src/lib/db/` — never import
  Supabase directly in components.
- Financial math: decimal.js only. Never floating point.
- NEVER disable ESLint, RLS policies, or auth checks.
- NEVER implement without an approved plan in `.ai/plans/`.
- Run `npm run typecheck && npm run lint` after every change.
- When starting a session, check `.ai/progress/` for the latest
  entry to understand current project state.

## Context loading
Follow `.ai/CONTEXT.md` for which files to load per task type.
```

**.cursor/rules/** (for Cursor) — decompose into scoped rule files instead of a single monolith. Each `.mdc` file targets specific file types via glob patterns, so agents only load relevant rules:

```
.cursor/rules/
├── global.mdc              # Always active: project structure, commands
├── react-components.mdc    # *.tsx: component patterns, DESIGN.md ref
├── api-routes.mdc          # src/app/api/**: server patterns, auth rules
├── database.mdc            # src/lib/db/**: Supabase patterns, RLS rules
├── tests.mdc               # *.test.*: testing conventions, coverage rules
└── migrations.mdc          # supabase/migrations/**: schema change rules
```

Example `react-components.mdc`:

```markdown
---
globs: src/components/**/*.tsx
---

Follow the design system in `.ai/DESIGN.md` for all visual decisions.
One component per file. Named exports only.
Every component must handle: loading, empty, error, and populated states.
Use `cn()` utility for conditional class names.
Tailwind only — no inline styles, no CSS modules.
```

**AGENTS.md** at root (for OpenAI Codex):

```markdown
Read `.ai/AGENTS.md` for complete project instructions.
Read `.ai/CONTEXT.md` to determine which files to load.
```

---

## Primitive 1: VISION.md — The North Star

**Replaces:** Product roadmap decks, strategy documents, the PM's head

**Answers:** *What are we building, who is it for, and why does it matter?*

**When to update:** Rarely. This is the stable foundation everything else references.

### What goes in it

VISION.md captures product intent at the highest level. Every spec, every plan, every architectural decision references back to this document. Agents read it to understand *why* they're building what they're building — which matters because agents make micro-decisions constantly (naming conventions, error messages, UX copy, default values) and those decisions should align with product intent.

### Example: VISION.md

```markdown
# Vision: Meridian

## One-line summary
Personal finance dashboard for freelancers who hate spreadsheets.

## The problem
Freelancers with variable income have no simple way to see their
financial health across multiple revenue streams, tax obligations,
and business expenses. Existing tools (Mint, YNAB, QuickBooks) are
either too consumer-focused or too complex.

## Who it's for
Solo freelancers and independent contractors earning $50K-$250K/year
from 2+ revenue sources. They're comfortable with technology but
have zero interest in accounting. They want answers, not ledgers.

## What success looks like
- User connects accounts in <5 minutes
- User sees "how much can I safely spend this month" on first load
- User files quarterly estimated taxes without hiring an accountant
- 70%+ weekly retention at 90 days

## Business model
Freemium. Free tier: 2 connected accounts, basic dashboard.
Pro ($12/mo): unlimited accounts, tax estimates, expense categories.

## What this is NOT
- Not a bookkeeping tool (no invoicing, no double-entry)
- Not an investment platform (no portfolio tracking)
- Not a budgeting app (no envelope categories, no spending limits)
- Not a tax preparation tool (estimates only, not filing)

## Competitive positioning
Closest competitor: Copilot (money.copilot.app). We differentiate
on the tax estimation angle — no consumer finance app does
quarterly estimated tax calculations well.

## Core principles
1. Show the answer, not the data. Users want "you can spend $3,200
   this month" — not a table of transactions.
2. Automate everything that can be automated. If we're asking the
   user to categorize transactions manually, we've failed.
3. Conservative estimates protect trust. When uncertain, show the
   lower number for available funds and the higher number for tax
   obligations.
```

### Why this matters for agents

Without VISION.md, an agent building a transaction display might default to a detailed ledger view (because that's what most finance apps show). With it, the agent knows to show summarized answers instead of raw data. Without the "conservative estimates" principle, an agent might round tax obligations down. These micro-decisions compound across hundreds of implementation choices.

---

## Primitive 2: DESIGN.md — The Visual System

**Replaces:** Figma handoff, style guides, design tokens, brand guidelines

**Answers:** *What does it look like?*

**When to update:** When the visual system evolves. After initial creation, updates are incremental.

### What goes in it

DESIGN.md captures the complete visual language in a format AI agents parse and apply: colors (with semantic roles), typography (families, sizes, weights, line heights), spacing scale, border radii, shadows, and component patterns. Google Stitch can generate this file automatically from any existing website or design, but you can also write it by hand.

### How to create it

**Option A — Generate from Google Stitch:** Design your UI in Stitch (stitch.withgoogle.com), then export DESIGN.md. Stitch extracts colors, typography, spacing, and component patterns into structured markdown.

**Option B — Extract from an existing site:** Use Stitch's URL extraction feature. Point it at any website and it produces a DESIGN.md capturing that site's design system.

**Option C — Write it manually:** Use the template below. This is the most precise option and works when you have specific brand requirements.

### Example: DESIGN.md

```markdown
# Design System: Meridian

## Brand personality
Clean, calm, trustworthy. Financial data without financial anxiety.
Inspired by: Linear's clarity, Stripe's professionalism, Calm's warmth.

## Colors

### Core palette
| Token           | Hex       | Usage                                    |
|-----------------|-----------|------------------------------------------|
| --primary       | #2563EB   | Primary actions, links, active states    |
| --primary-hover | #1D4ED8   | Hover state for primary elements         |
| --secondary     | #64748B   | Secondary text, labels, metadata         |
| --accent        | #10B981   | Positive values, success states, income  |
| --warning       | #F59E0B   | Caution states, approaching limits       |
| --danger        | #EF4444   | Negative values, errors, overspending    |
| --surface       | #FFFFFF   | Card and component backgrounds           |
| --background    | #F8FAFC   | Page background                          |
| --border        | #E2E8F0   | Dividers, card borders, input borders    |
| --text-primary  | #0F172A   | Headings, primary content                |
| --text-secondary| #475569   | Supporting text, descriptions            |
| --text-muted    | #94A3B8   | Placeholder text, disabled states        |

### Dark mode
| Token           | Hex       |
|-----------------|-----------|
| --surface       | #1E293B   |
| --background    | #0F172A   |
| --border        | #334155   |
| --text-primary  | #F1F5F9   |
| --text-secondary| #94A3B8   |
| --text-muted    | #64748B   |

All other tokens remain the same in dark mode.

## Typography

### Font stack
- **Primary:** Inter (fallback: -apple-system, system-ui, sans-serif)
- **Monospace:** JetBrains Mono (fallback: Menlo, Consolas, monospace)
- Use monospace exclusively for financial figures and data values.

### Scale
| Name        | Size   | Weight | Line height | Usage                    |
|-------------|--------|--------|-------------|--------------------------|
| display     | 36px   | 700    | 1.2         | Dashboard hero numbers   |
| h1          | 24px   | 600    | 1.3         | Page titles              |
| h2          | 20px   | 600    | 1.35        | Section headers          |
| h3          | 16px   | 600    | 1.4         | Card titles              |
| body        | 14px   | 400    | 1.5         | Default text             |
| body-sm     | 13px   | 400    | 1.5         | Dense UI, table cells    |
| caption     | 12px   | 500    | 1.4         | Labels, metadata         |
| overline    | 11px   | 600    | 1.3         | Section labels, all-caps |

### Financial figures
All monetary values use JetBrains Mono at `display` size with
`font-variant-numeric: tabular-nums` for column alignment.
Positive values: --accent. Negative values: --danger.
Always prefix negative values with "−" (minus sign, U+2212), not
a hyphen.

## Spacing

### Scale (base unit: 4px)
| Token | Value | Usage                              |
|-------|-------|------------------------------------|
| xs    | 4px   | Inline element gaps                |
| sm    | 8px   | Icon-to-label gaps, tight padding  |
| md    | 12px  | Default padding inside components  |
| lg    | 16px  | Section spacing, card padding      |
| xl    | 24px  | Between card groups                |
| 2xl   | 32px  | Major section breaks               |
| 3xl   | 48px  | Page-level spacing                 |

### Layout
- **Max content width:** 1200px, centered
- **Card grid:** CSS Grid, 1-3 columns, gap: xl (24px)
- **Sidebar width:** 260px fixed, collapsible on mobile
- **Breakpoints:** sm: 640px, md: 768px, lg: 1024px, xl: 1280px

## Borders and corners

| Context           | Radius | Border                       |
|-------------------|--------|------------------------------|
| Cards             | 12px   | 1px solid --border           |
| Buttons           | 8px    | None (filled) or 1px --border|
| Inputs            | 8px    | 1px solid --border           |
| Modals            | 16px   | None (shadow only)           |
| Avatars, badges   | 9999px | Full circle                  |

## Shadows
| Level   | Value                                    | Usage             |
|---------|------------------------------------------|-------------------|
| sm      | 0 1px 2px rgba(0,0,0,0.05)              | Cards at rest     |
| md      | 0 4px 6px -1px rgba(0,0,0,0.1)          | Cards on hover    |
| lg      | 0 10px 15px -3px rgba(0,0,0,0.1)        | Modals, dropdowns |

## Component patterns

### Cards
Container: --surface background, radius-12, shadow-sm, padding-lg
Header: h3 title left-aligned, optional icon or badge right-aligned
Content: body text, --text-secondary for supporting info
Footer (optional): caption text or action links, top border --border
Hover: shadow-md transition 150ms ease

### Buttons
Primary: --primary bg, white text, weight 500, padding sm/lg
Secondary: transparent bg, --primary text, 1px --border border
Danger: --danger bg, white text — use only for destructive actions
Ghost: transparent bg, --secondary text, no border
All: radius-8, height 36px (default) or 32px (compact)
Disabled: opacity 0.5, cursor not-allowed
Loading: spinner replaces label, maintain button width

### Data cards (financial)
Label: overline, --text-muted, uppercase, letter-spacing 0.05em
Value: display size, JetBrains Mono, --text-primary
Trend: caption, --accent (up) or --danger (down), with arrow icon
Container: standard card pattern with padding-xl

### Empty states
Container: centered, max-width 400px, padding-3xl
Icon: 48px, --text-muted, relevant illustration
Headline: h2, --text-primary
Description: body, --text-secondary, max 2 lines
Action: primary button

## Animation
- **Duration:** 150ms for micro-interactions, 300ms for transitions
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1) for most, ease-out for exits
- **Reduce motion:** Respect prefers-reduced-motion, disable all
  non-essential animation
- **Never animate:** Financial figures during load (show skeleton, then
  final value — no counting up)

## Iconography
- **Library:** Lucide React (consistent with the clean aesthetic)
- **Size:** 16px inline, 20px in buttons, 24px standalone, 48px empty states
- **Stroke:** 1.5px (Lucide default)
- **Color:** Inherit from parent text color unless semantic (--accent, --danger)
```

### Why this matters for agents

Without DESIGN.md, every agent session reinvents the visual system. You ask for a new card component and get different border radii, wrong colors, inconsistent spacing. With DESIGN.md, the agent reads the canonical visual system and applies it consistently. The financial figure formatting rules (tabular nums, minus sign character, color coding) are exactly the kind of detail agents get wrong without explicit instruction.

---

## Primitive 3: AGENTS.md — The Constitution

**Replaces:** Onboarding docs, coding standards, tribal knowledge, the senior dev who "just knows"

**Answers:** *How should AI agents behave in this project?*

**When to update:** Continuously. Every time an agent makes a mistake, add a rule preventing it.

### What goes in it

AGENTS.md is the law. Every agent session starts by reading it. It contains project identity, coding conventions, build commands, testing requirements, and — most critically — prohibited actions. This file is append-only for failure patterns: when an agent does something wrong, you add a line so it never happens again. Over time, AGENTS.md becomes the project's immune system.

Keep it under 300 lines. Concise, specific, actionable. No philosophy — just rules with examples.

### Example: AGENTS.md

```markdown
# Agent Instructions: Meridian

Read .ai/VISION.md for product context.
Read .ai/DESIGN.md for visual system.
Read .ai/STACK.md for technology decisions.
Read .ai/CONTEXT.md for context loading profiles.

## Project structure
src/
├── app/              # Next.js App Router pages
├── components/       # React components (co-located with styles)
│   ├── ui/           # Generic UI primitives (Button, Card, Input)
│   └── features/     # Feature-specific components
├── lib/              # Utilities, API clients, helpers
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── styles/           # Global styles, CSS variables from DESIGN.md

## Build and test commands
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript compiler check
- `npm run test` — run Vitest test suite
- `npm run test:watch` — run tests in watch mode

Run `npm run typecheck && npm run lint` after every change.
Run `npm run test` before marking any plan task as complete.

## Coding conventions
- TypeScript strict mode, no `any` types, no `@ts-ignore`
- Functions: max 30 lines. If longer, decompose.
- Files: max 300 lines. If longer, split into modules.
- Components: one component per file, named export
- Naming: camelCase for functions/variables, PascalCase for
  components/types, SCREAMING_SNAKE for constants
- Imports: group by external → internal → relative, blank line between
- No default exports except Next.js pages/layouts

## File naming
- Components: `PascalCase.tsx` (e.g., `DashboardCard.tsx`)
- Hooks: `use-kebab-case.ts` (e.g., `use-accounts.ts`)
- Utilities: `kebab-case.ts` (e.g., `format-currency.ts`)
- Types: `kebab-case.types.ts` (e.g., `account.types.ts`)
- Tests: `*.test.ts` or `*.test.tsx`, co-located with source

## Data and API patterns
- All data fetching through React Server Components or server actions
- Client-side state: Zustand for global, useState for local
- Supabase client: use `createServerClient()` in server components,
  `createBrowserClient()` in client components — never mix
- All Supabase queries go through `src/lib/db/` — components never
  import Supabase directly
- Type all database responses with generated types from
  `supabase gen types typescript`

## Error handling
- Server actions return `{ data, error }` — never throw
- Client components show error states, never blank screens
- Log errors to Sentry with context (user ID, action, input)
- User-facing error messages must be helpful:
  "Couldn't connect to Chase. Try again in a few minutes."
  NOT: "Error: PLAID_INSTITUTION_NOT_RESPONDING"

## Testing requirements
- Every new feature needs at least 3 tests:
  1. Happy path
  2. Error/edge case
  3. Empty state
- Test behavior, not implementation. Test what the user sees.
- Mock Supabase calls, never hit real database in tests

## Security rules — NON-NEGOTIABLE
- NEVER expose API keys in client-side code
- NEVER disable or weaken Supabase RLS policies
- NEVER store Plaid access tokens in localStorage
- NEVER log sensitive financial data (account numbers, balances)
- NEVER implement authentication changes without explicit operator
  approval in the plan
- All user input: validate on server, sanitize on display
- All financial calculations: use decimal.js, never floating point

## Git conventions
- Branch names: `feat/{spec-name}`, `fix/{issue}`, `refactor/{scope}`
- Commit messages: conventional commits
  `feat(dashboard): add monthly spending chart`
  `fix(auth): handle expired Plaid tokens`
- One logical change per commit. Never mix refactoring with features.

## Learned rules (append-only — add failures here)
- 2026-03-15: Do NOT use `Math.round()` for currency. Use
  `Decimal.toFixed(2)`. Agent rounded $149.995 to $150.00
  instead of $150.00 — same result by luck, wrong method.
- 2026-03-18: Do NOT use Supabase `upsert` for transaction sync.
  It caused duplicate entries when Plaid webhook delivered the
  same transaction twice. Use `insert` with `ON CONFLICT` clause.
- 2026-03-22: Do NOT auto-categorize transactions with >3 word
  merchant names by splitting on spaces. "WHOLE FOODS MARKET"
  is one merchant, not three categories.
- 2026-03-25: Always include `loading` and `error` states in
  components that fetch data. Agent shipped AccountList without
  loading state — users saw empty screen for 2 seconds on slow
  connections.
```

---

## Primitive 4: STACK.md — Technology Decisions

**Replaces:** Tech stack justification documents, "why are we using X?" questions

**Answers:** *What technologies are we using and why?*

**When to update:** When a technology decision changes.

### Example: STACK.md

```markdown
# Technology Stack: Meridian

## Framework: Next.js 15 (App Router)
Why: Server components for data-heavy dashboard. Vercel deployment.
Strong AI agent support (most-trained framework in LLM corpora).

## Database: Supabase (PostgreSQL)
Why: Row Level Security for multi-tenant data isolation.
Built-in auth. Real-time subscriptions for live balance updates.
Generous free tier for MVP.

## Styling: Tailwind CSS 4
Why: Utility-first maps cleanly to DESIGN.md tokens.
AI agents generate Tailwind more reliably than CSS modules.
JIT compiler keeps bundle small.

## Banking data: Plaid
Why: Industry standard for account linking. Handles OAuth
flows with 12,000+ institutions. Webhook-based transaction sync.

## State management: Zustand
Why: Minimal boilerplate. Works with server components.
Single store for client-side UI state (sidebar open, active filters).
NOT for server data — that lives in React Server Components.

## Testing: Vitest + Testing Library
Why: Fast, ESM-native. Testing Library enforces behavior-based
tests. Compatible with React Server Components.

## Payments: Stripe
Why: Standard. Handles subscription billing, usage-based pricing,
customer portal for self-service plan management.

## Error monitoring: Sentry
Why: Automatic error capture with source maps. Session replay
for debugging user-reported issues without reproducing.

## Deployment: Vercel
Why: Zero-config Next.js deployment. Preview deployments per PR.
Edge functions for API routes. Built-in analytics.

## NOT using (and why)
- **Redux:** Zustand is simpler for our scale. No action creators.
- **Prisma:** Supabase client is sufficient. Prisma adds a layer
  we don't need and complicates RLS.
- **tRPC:** Next.js server actions handle our needs. tRPC adds
  complexity without clear benefit for this project size.
- **GraphQL:** REST via Supabase is simpler. We don't have the
  query flexibility needs that justify GraphQL overhead.
```

---

## Primitive 5: CONTEXT.md — Context Budget Management

**Replaces:** Nothing — this is new. No traditional PM tool needed this.

**Answers:** *How much context can the agent hold, and which files should it load for which tasks?*

**When to update:** When you add new `.ai/` files, change models, or observe context-related failures.

### The problem

Every file in `.ai/` consumes tokens. VISION.md (~500 tokens) + DESIGN.md (~2,000 tokens) + AGENTS.md (~1,500 tokens) + STACK.md (~400 tokens) + a spec (~800 tokens) + a plan (~600 tokens) + a skill (~400 tokens) = ~6,200 tokens of context loaded before the agent writes a single line of code. On Claude Opus with 200K context, that's negligible. On a 32K model, you've consumed 20% of your window on instructions.

More critically: context quality degrades with volume. Models exhibit reduced attention to information in the middle of long contexts. Loading everything when only some of it is relevant creates noise that reduces output quality.

### Example: CONTEXT.md

```markdown
# Context Budget: Meridian

## Model context windows
| Model              | Window    | Effective budget* |
|--------------------|-----------|-------------------|
| Claude Opus 4.6    | 200K      | ~150K usable      |
| Claude Sonnet 4.6  | 200K      | ~120K usable      |
| GPT-4.1            | 128K      | ~90K usable       |
| Cursor (varies)    | 128-200K  | ~80-120K usable   |

*Effective = window minus output reservation and system overhead.

## Loading profiles

### Profile: feature-implementation
Load for: implementing specs, plan generation, code writing
Always load:
- .ai/AGENTS.md (full)
- .ai/DESIGN.md (full)
- .ai/STACK.md (full)
- Target spec from .ai/specs/active/
- Approved plan from .ai/plans/ (if exists)
- Active skill file from .ai/skills/
Load if relevant:
- .ai/decisions/ — only decisions referenced by the spec
- .ai/progress/ — latest entry only (for session continuity)
Skip:
- .ai/VISION.md (already internalized in the spec)
- .ai/retrospectives/
- Other specs not being implemented
- .ai/guards/ (enforced by CI, not by the agent reading them)

### Profile: spec-writing
Load for: drafting new specs, refining requirements
Always load:
- .ai/VISION.md (full — need product context)
- .ai/DESIGN.md (component patterns section only)
- .ai/specs/_TEMPLATE.md
- .ai/specs/_QUALITY_RUBRIC.md
Load if relevant:
- Related completed specs (for pattern reference)
- Relevant decisions
Skip:
- .ai/AGENTS.md (not writing code)
- .ai/STACK.md (not making tech decisions)
- .ai/skills/ (not executing a workflow)

### Profile: bug-fix
Load for: diagnosing and fixing reported issues
Always load:
- .ai/AGENTS.md (full)
- .ai/skills/bug-fix.md
- .ai/progress/ — latest 2 entries
Load if relevant:
- Spec that introduced the broken feature
- Related decisions
Skip:
- .ai/VISION.md
- .ai/DESIGN.md (unless it's a visual bug)
- Other specs and plans

### Profile: session-resume
Load for: continuing work from a previous session
Always load:
- .ai/AGENTS.md (full)
- .ai/progress/ — latest entry (contains checkpoint)
- The in-progress plan (has completion markers)
- The source spec
Skip:
- Everything already summarized in the progress checkpoint

## Context compression rules
- If total loaded context exceeds 30% of model window,
  compress: load DESIGN.md component patterns only (skip colors
  and typography unless doing UI work), load AGENTS.md critical
  rules only (skip learned rules unless debugging)
- Never compress: the target spec, the approved plan, security
  rules from AGENTS.md
- When in doubt: smaller context with higher relevance beats
  larger context with lower relevance
```

### How to use it

When starting an agent session, reference the profile: "Load the `feature-implementation` profile from `.ai/CONTEXT.md`. The target spec is `p1-monthly-spending-chart.md`."

For Claude Code, encode this in CLAUDE.md: "Before starting work, read `.ai/CONTEXT.md` and load files matching the appropriate profile for this task type."

---

## Primitive 6: Spec Files — The New Backlog

**Replaces:** Jira tickets, Linear issues, user stories, PRDs

**Answers:** *What exactly needs to be built?*

**When to create:** Whenever you identify a feature, fix, or change to be made.

### The backlog is a directory

Your backlog is literally `ls .ai/specs/active/` sorted by filename (prefix with priority):

```
.ai/specs/active/
├── p0-plaid-account-linking.md
├── p1-monthly-spending-chart.md
├── p1-quarterly-tax-estimate.md
├── p2-transaction-categorization.md
└── p3-export-csv.md
```

No velocity tracking. No story points. No sprint ceremonies. Just a directory of specs ordered by importance, consumed by agents on demand.

### The spec template

Save this as `.ai/specs/_TEMPLATE.md`:

```markdown
# Spec: {Feature Name}

**Status:** draft | active | in-progress | review | completed | rejected
**Priority:** p0-critical | p1-high | p2-medium | p3-low
**Complexity:** small (hours) | medium (day) | large (days) | xl (week+)
**Created:** {YYYY-MM-DD}
**Last updated:** {YYYY-MM-DD}

## Problem
What's broken or missing, and for whom. Be specific about the user
pain. Reference .ai/VISION.md if relevant.

## Solution
What we're building. Specific enough that an AI agent can implement
it without asking follow-up questions. If the agent has to guess,
this section failed.

## Requirements

### Functional
- [ ] The system SHALL...
- [ ] The system SHALL...
- [ ] The system SHALL NOT...

### Non-functional
- **Performance:** {specific targets}
- **Security:** {specific requirements}
- **Accessibility:** {WCAG level, specific needs}

## Acceptance criteria
Each criterion must be independently testable.
- [ ] GIVEN {context}, WHEN {action}, THEN {expected result}
- [ ] GIVEN {context}, WHEN {edge case}, THEN {expected handling}
- [ ] GIVEN {context}, WHEN {error condition}, THEN {error handling}

## UI/UX requirements
Reference .ai/DESIGN.md for visual system. Describe layout,
interactions, and states (loading, empty, error, populated).

## Out of scope
What this spec explicitly does NOT cover. Important for preventing
agent scope creep.

## Dependencies
- Other specs this depends on (verified as complete: yes/no)
- External services or APIs needed
- Data requirements

## Technical notes (optional)
Hints for the agent about approach. Not prescriptive — the agent
and plan review will determine implementation details.

## References
- Links to designs, mockups, screenshots
- Links to related specs or decisions
- Links to external documentation
```

### Example: A complete spec

```markdown
# Spec: Monthly Spending Chart

**Status:** active
**Priority:** p1-high
**Complexity:** medium (day)
**Created:** 2026-03-25
**Last updated:** 2026-03-27

## Problem
Users can see their current balance but have no visibility into
spending trends over time. The most common support question (34%
of tickets) is "am I spending more this month than usual?" Users
need a visual answer without digging through transactions.

## Solution
Add a monthly spending bar chart to the main dashboard showing the
last 6 months of total spending, with the current month highlighted
and compared to the average.

## Requirements

### Functional
- [ ] The system SHALL display a bar chart showing total spending
      for each of the last 6 calendar months
- [ ] The system SHALL highlight the current (incomplete) month
      with a distinct visual treatment (see UI requirements)
- [ ] The system SHALL show a horizontal line indicating the
      6-month average
- [ ] The system SHALL display the exact amount on hover/tap of
      each bar
- [ ] The system SHALL update within 5 minutes of new transactions
      arriving via Plaid webhook
- [ ] The system SHALL handle users with fewer than 6 months of
      data by showing only available months
- [ ] The system SHALL NOT include transfers between the user's
      own accounts in spending totals

### Non-functional
- **Performance:** Chart renders in <200ms with 6 months of data
- **Security:** Spending totals computed server-side; raw
  transactions never sent to client for this component
- **Accessibility:** Chart must include screen reader description
  of trend ("Your spending in March is 12% above your 6-month
  average")

## Acceptance criteria
- [ ] GIVEN a user with 6+ months of transaction data, WHEN they
      view the dashboard, THEN they see a bar chart with 6 bars
      representing monthly spending totals
- [ ] GIVEN a user with 3 months of data, WHEN they view the
      dashboard, THEN they see 3 bars (not 3 bars and 3 empty)
- [ ] GIVEN the current month is half over, WHEN viewing the
      chart, THEN the current month's bar uses a gradient or
      partial fill to indicate it's incomplete
- [ ] GIVEN a user hovers over the March bar, WHEN the tooltip
      appears, THEN it shows "March 2026: $3,847.23"
- [ ] GIVEN a user has no transaction data, WHEN they view the
      dashboard, THEN they see an empty state (not a broken chart)
      with text: "Connect an account to see spending trends"
- [ ] GIVEN spending includes a $500 transfer from checking to
      savings, WHEN computing monthly total, THEN that transfer
      is excluded

## UI/UX requirements
Follow .ai/DESIGN.md for all visual tokens.

**Layout:** Full-width card in the dashboard grid, spanning 2
columns on desktop, full width on mobile.

**Chart bars:**
- Past months: --primary color, radius-4 top corners
- Current month: --primary at 50% opacity with dashed top border
  to indicate "in progress"
- Average line: dashed, --text-muted color, 1px

**States:**
- Loading: skeleton bars (6 rectangles pulsing)
- Empty: standard empty state pattern from DESIGN.md with
  chart icon
- Error: "Couldn't load spending data. Tap to retry." with
  retry button

**Typography:** Month labels in caption size. Amounts on hover
in body-sm, JetBrains Mono, formatted as currency.

## Out of scope
- Spending by category (separate spec: transaction-categorization)
- Income chart or net income view
- Custom date range selection
- Export or share functionality

## Dependencies
- Plaid account linking must be implemented
  (spec: plaid-account-linking — verified complete: yes)
- Transaction sync webhook must be operational

## Technical notes
Use Recharts (already in dependencies) for the bar chart. Compute
monthly totals via a Supabase database function to avoid sending
raw transactions to the client. Consider a materialized view for
performance if transaction volume grows.

## References
- Dashboard wireframe: {link}
- Similar implementation: Linear's project insights chart
```

### Spec quality rubric

Before moving a spec from `draft/` to `active/`, score it. Save this as `.ai/specs/_QUALITY_RUBRIC.md` and ask the agent to evaluate your spec against it — the agent catches gaps you'll miss.

```markdown
# Spec Quality Rubric

Score each dimension 0-2. Total ≥14 to move to active/.

## Clarity (0-2)
- 0: Ambiguous — agent would need to ask 3+ follow-up questions
- 1: Mostly clear — 1-2 areas where agent might guess
- 2: Unambiguous — agent can implement without any clarification

## Completeness (0-2)
- 0: Missing functional requirements or acceptance criteria
- 1: Core requirements present, edge cases partially covered
- 2: All requirements, edge cases, and error states enumerated

## Testability (0-2)
- 0: Acceptance criteria are subjective ("should feel fast")
- 1: Most criteria are testable, some vague
- 2: Every criterion is a GIVEN/WHEN/THEN that can be automated

## Scoping (0-2)
- 0: No out-of-scope section, or scope is unclear
- 1: Out-of-scope exists but is incomplete
- 2: Clear boundaries — agent knows exactly what NOT to build

## Design integration (0-2)
- 0: No UI/UX section, no reference to DESIGN.md
- 1: General UI description without state coverage
- 2: All states described (loading, empty, error, populated),
     DESIGN.md referenced for tokens and patterns

## Dependencies (0-2)
- 0: Dependencies not identified
- 1: Dependencies listed but not verified as met
- 2: All dependencies listed and confirmed available

## Architecture alignment (0-2)
- 0: No reference to STACK.md or decisions/
- 1: Partially aligned, some tech choices unaddressed
- 2: Consistent with all relevant decisions, uses approved stack

## Sizing accuracy (0-2)
- 0: No complexity estimate, or clearly wrong
- 1: Rough estimate, might be off by 2x
- 2: Realistic estimate backed by comparable completed specs

## Scoring
| Score | Readiness                                        |
|-------|--------------------------------------------------|
| 14-16 | Ready for active/ — proceed to planning          |
| 10-13 | Almost ready — address flagged dimensions         |
| 6-9   | Needs significant work — major gaps remain        |
| 0-5   | Not ready — rethink the spec from scratch         |
```

Usage: "Score this spec against `.ai/specs/_QUALITY_RUBRIC.md`. List each dimension with its score and rationale. Flag any dimension scoring below 2."

---

## Primitive 7: Plan Files — The Approval Gate

**Replaces:** Sprint planning, task breakdowns, technical design reviews

**Answers:** *How will we implement this spec?*

**When to create:** When you're ready to implement a spec. Generated by the agent, reviewed by you.

### The plan-review workflow

This is the highest-leverage practice in the entire system. It works like this:

1. You tell the agent: "Read the spec at `.ai/specs/active/p1-monthly-spending-chart.md` and create an implementation plan. Write the plan to `.ai/plans/monthly-spending-chart.plan.md`. Do NOT implement yet."
2. The agent produces a step-by-step plan.
3. You read the plan and add annotations — corrections, business context, priority changes.
4. You repeat steps 2-3 until the plan matches your intent (typically 1-6 cycles).
5. You mark the plan `Status: approved`.
6. Only then does the agent implement.

The explicit "do NOT implement yet" instruction is critical. Without it, agents often start coding during the planning phase.

### Example: plan file

```markdown
# Plan: Monthly Spending Chart

**Source:** .ai/specs/active/p1-monthly-spending-chart.md
**Status:** approved
**Iteration:** 3
**Approved:** 2026-03-28

## Implementation steps

### Phase 1: Data layer
1. [ ] Create Supabase database function `get_monthly_spending(user_id, months)`
       that returns monthly totals excluding internal transfers
       - Query: aggregate transactions by month, exclude where
         both source and destination accounts belong to same user
       - Return: array of { month, year, total, is_current_month }
2. [ ] Create server action `getMonthlySpending()` in
       `src/app/dashboard/actions.ts`
3. [ ] Write tests for the server action (happy path, <6 months,
       no data, internal transfer exclusion)

### Phase 2: Chart component
4. [ ] Create `src/components/features/SpendingChart.tsx`
       using Recharts BarChart
       - Follow DESIGN.md data card pattern
       - Implement all 4 states: loading, empty, error, populated
       - Current month: reduced opacity bar with dashed border
       - Average line: ReferenceLine component, dashed
5. [ ] Create `src/components/features/SpendingTooltip.tsx`
       for hover state showing formatted currency
6. [ ] Write tests for chart component (mock data for each state)

### Phase 3: Integration
7. [ ] Add SpendingChart to dashboard page grid (2-column span)
8. [ ] Add screen reader description with trend calculation
9. [ ] Verify responsive behavior at all breakpoints
10. [ ] Run full test suite, typecheck, lint

## Files to create
- `supabase/migrations/20260328_monthly_spending_function.sql` (new)
- `src/app/dashboard/actions.ts` (modify — add getMonthlySpending)
- `src/components/features/SpendingChart.tsx` (new)
- `src/components/features/SpendingTooltip.tsx` (new)
- `src/components/features/SpendingChart.test.tsx` (new)
- `src/app/dashboard/page.tsx` (modify — add chart to grid)

## Dependencies to install
- None. Recharts already in package.json.

## Risks and mitigations
- **Risk:** Large transaction volumes slow the DB function
  **Mitigation:** Add index on (user_id, date). Monitor query
  time. If >200ms, create materialized view (separate spec).
- **Risk:** Plaid categorizes transfers inconsistently
  **Mitigation:** Match on account_id pairs, not Plaid categories.

## Operator annotations
> [2026-03-27, iteration 1]: Don't create a separate API route.
> Use a server action called directly from the server component.
> We don't need a REST endpoint for this.

> [2026-03-27, iteration 2]: The Supabase function should use
> the user's timezone for month boundaries, not UTC. A user in
> PST would see March transactions appearing in April otherwise.
> Pass timezone as parameter.

> [2026-03-28, iteration 3]: APPROVED. Implement as planned.
> Start with Phase 1. Run tests after each phase before proceeding.
```

### Plan amendments — handling mid-flight changes

Specs change. Users give feedback. You discover something during implementation that invalidates an assumption. Rather than discarding a 60%-complete plan, use the amendment pattern.

Create `{spec-name}.amendments.md` alongside the existing plan:

```markdown
# Amendments: Monthly Spending Chart

## Amendment 1 (2026-03-29)
**Trigger:** User testing revealed the 6-month view is too zoomed
out — users want to see weekly patterns within a month.
**Impact on plan:**
- Phase 2, Step 4: Add a drill-down interaction — tapping a
  monthly bar shows weekly breakdown for that month
- Phase 2, Step 5: New component `WeeklyBreakdown.tsx`
**Steps already completed that need revision:** None
**New steps to add after current Phase 2:**
- [ ] Create `WeeklyBreakdown.tsx` with week-level bar chart
- [ ] Add tap/click handler on monthly bars to toggle weekly view
- [ ] Write tests for drill-down interaction
**Spec update required:** Yes — add weekly drill-down to
functional requirements and acceptance criteria
**Operator approval:** APPROVED 2026-03-29
```

Amendment rules: the original plan stays intact (never edit completed steps retroactively), amendments are sequentially numbered and dated, and the spec itself gets updated to reflect the change. If an amendment invalidates >50% of the remaining plan, abandon the plan and re-plan from the updated spec instead.

---

## Primitive 8: Decision Records — Institutional Memory

**Replaces:** Meeting notes, Slack threads, "why did we do it this way?"

**Answers:** *Why did we choose X over Y?*

**When to create:** Whenever a non-obvious architectural or product decision is made.

### Why decisions matter for agents

Without decision records, agents repropose rejected approaches. You'll review a plan and see middleware-based auth — the same approach you rejected two weeks ago because RLS is simpler. Decision records prevent this loop by giving agents authoritative references for past choices.

### Example: decision record

```markdown
# Decision 004: Use Recharts over Chart.js for data visualization

**Date:** 2026-03-20
**Status:** accepted

## Context
Need a charting library for the spending dashboard. Agent initially
proposed Chart.js based on popularity.

## Options considered

### Chart.js
- Pros: Largest community, most examples in training data
- Cons: Canvas-based (no SSR), imperative API doesn't compose
  well with React, accessibility requires manual ARIA

### Recharts
- Pros: React-native (declarative JSX), SVG-based (SSR works),
  built-in responsive container, composes with React patterns
- Cons: Smaller community, fewer Stack Overflow answers

### D3 directly
- Pros: Maximum flexibility
- Cons: Massive overkill for bar charts. Agent-generated D3
  code is often buggy and hard to review.

## Decision
Use Recharts. The React-native API means agents generate more
reliable code (JSX vs imperative canvas calls), SVG output works
with server components, and our charting needs are standard enough
that Recharts covers them completely.

## Consequences
- Agent should always use Recharts for new charts
- Do NOT introduce Chart.js or D3 for future visualization needs
  unless Recharts genuinely cannot handle the requirement
- If we need very custom visualizations later, reconsider D3
  (create a new decision record)
```

Number decisions sequentially: `001-supabase-over-firebase.md`, `002-app-router-over-pages.md`, etc. The numbering creates a chronological record and makes references unambiguous.

---

## Primitive 9: Skills — Reusable Agent Workflows

**Replaces:** Process documentation, runbooks, SOPs

**Answers:** *What's the step-by-step workflow for this type of work?*

**When to create:** Whenever you identify a repeatable pattern of work.

### What makes skills powerful

Skills are saved procedures. Instead of explaining the workflow every time you start a task, you point the agent at a skill file: "Follow the `new-feature` skill for this spec." The skill defines every step, every gate, every rule. Over time your skills library captures institutional knowledge about how *your* project works best.

### Example: new-feature.md

```markdown
# Skill: New Feature Implementation

## When to use
Any time you're implementing a spec from .ai/specs/active/.

## Pre-flight
1. Read .ai/AGENTS.md — follow all rules
2. Read .ai/DESIGN.md — follow visual system
3. Read .ai/STACK.md — use approved technologies only
4. Check .ai/decisions/ — respect all accepted decisions
5. Read .ai/CONTEXT.md — load feature-implementation profile

## Workflow

### Step 1: Read the spec
Read the target spec file completely. Identify:
- All functional requirements (every SHALL statement)
- All acceptance criteria (every GIVEN/WHEN/THEN)
- All out-of-scope items (do NOT build these)
- All dependencies (verify they're met)

If any requirement is ambiguous, STOP and ask the operator
for clarification. Do not guess.

### Step 2: Create the plan
Write an implementation plan to `.ai/plans/{spec-name}.plan.md`.
Include:
- Numbered implementation steps, grouped into phases
- Files to create or modify (with paths)
- Dependencies to install (with justification)
- Risks and mitigations
- Set Status to "proposed"

STOP HERE. Tell the operator:
"Plan ready for review at .ai/plans/{spec-name}.plan.md"

Do NOT proceed until the operator marks the plan as approved.

### Step 3: Implement (only after plan approval)
For each step in the approved plan:
1. Implement the change
2. Run `npm run typecheck && npm run lint`
3. If tests are specified for this step, write and run them
4. Mark the step as completed in the plan file
5. Commit with a descriptive message

If you encounter an unexpected problem:
- If it's minor (typo, missing import): fix it and note in plan
- If it's significant (wrong approach, missing dependency): STOP
  and ask the operator. Do not improvise.

### Handling mid-implementation changes
If the operator creates an amendments file at
.ai/plans/{spec-name}.amendments.md:
1. Read the amendment
2. Identify which completed steps need revision
3. Identify new steps to add
4. Continue implementation incorporating the amendment
5. If the amendment invalidates >50% of remaining work,
   STOP and tell the operator: "This amendment is large enough
   to warrant a full re-plan."

### Step 4: Verify
After all steps are complete:
1. Run the full test suite: `npm run test`
2. Run typecheck: `npm run typecheck`
3. Run lint: `npm run lint`
4. Check all acceptance criteria from the spec — verify each one
5. Review .ai/guards/CHECKLIST.md and confirm all items pass

### Step 5: Wrap up
1. Update .ai/progress/{today's date}.md with session summary
   and CHECKPOINT block
2. Move spec from .ai/specs/active/ to .ai/specs/completed/
3. If you encountered any new failure patterns, tell the operator
   so they can add them to AGENTS.md

## Rules
- Never implement without an approved plan
- Never skip tests
- Never modify files in .ai/guards/
- Never introduce dependencies not in STACK.md without asking
- Never disable ESLint rules or TypeScript strict checks
- If stuck for >10 minutes on one step, stop and ask
- One feature per branch. Branch name: feat/{spec-name}
```

### Example: bug-fix.md

```markdown
# Skill: Bug Fix

## When to use
Any time you're fixing a reported bug or unexpected behavior.

## Workflow

### Step 1: Understand the bug
Read the bug report. Identify:
- What the expected behavior is
- What the actual behavior is
- Steps to reproduce
- Which users/contexts are affected

### Step 2: Reproduce
Write a failing test that demonstrates the bug BEFORE fixing it.
The test must fail with the current code and pass after the fix.
If you cannot reproduce, STOP and ask the operator for more info.

### Step 3: Diagnose
Identify the root cause. Check .ai/decisions/ for relevant
context — the bug might be a consequence of an architectural
choice that needs revisiting.

### Step 4: Fix
- Fix the root cause, not the symptom
- Keep the change minimal — touch only what's necessary
- If the fix requires changing more than 3 files, STOP and
  create a plan for operator review first

### Step 5: Verify
1. Confirm the failing test now passes
2. Run the full test suite — ensure no regressions
3. Run typecheck and lint
4. Manually verify the fix in the running application if possible

### Step 6: Immunize
If this bug could have been prevented by a rule in AGENTS.md,
tell the operator so they can add it. Example: "This bug was
caused by using floating point for currency. Consider adding
a rule to AGENTS.md requiring decimal.js for all financial math."

### Step 7: Wrap up
1. Commit with message: `fix({scope}): {description}`
2. Update progress file with CHECKPOINT block
3. Branch name: fix/{brief-description}
```

### Example: resume-session.md

```markdown
# Skill: Resume Session

## When to use
Starting work on a spec that was partially completed in a
previous session.

## Workflow

### Step 1: Load checkpoint
Read the latest entry in .ai/progress/ for the CHECKPOINT block.
This tells you: which spec, which plan, which branch, what's done,
what's next, and what decisions were already made.

### Step 2: Verify state
- Check out the correct branch
- Run `npm run test` to confirm all tests still pass
- Run `npm run typecheck && npm run lint` to confirm clean state
- If anything fails, STOP and tell the operator before proceeding

### Step 3: Orient
- Read the spec (for requirements context)
- Read the plan (for remaining steps)
- Read any amendments file
- Do NOT re-read files listed as "skip" in the checkpoint
  unless specifically needed

### Step 4: Continue
Pick up at the "Next step" identified in the checkpoint.
Follow the same implementation rules as the new-feature skill.

### Step 5: Update checkpoint
At session end, write a new CHECKPOINT block in today's
progress file, continuing the chain.

## Rules
- Never redo completed steps unless the checkpoint explicitly
  says they need revision
- Honor decisions from previous sessions — don't second-guess
  architectural choices made in prior sessions
- If the checkpoint mentions open questions, ask the operator
  before proceeding
```

### Other skills to create

- **refactor.md** — how to restructure code without changing behavior (preserve tests, transform, verify)
- **deploy.md** — the deployment checklist and process
- **security-review.md** — pre-launch security audit steps
- **onboard-contributor.md** — how to set up the project (for when you scale)

---

## Primitive 10: Progress Files — The Standup Replacement

**Replaces:** Daily standups, status updates, sprint reviews

**Answers:** *What happened?*

**When to create:** End of each agent session. Auto-generated by the agent.

### Example: progress file with checkpoint

```markdown
# Progress: 2026-03-28

## Session 1 (14:00-16:45)
**Spec:** monthly-spending-chart
**Plan:** iteration 3 (approved)
**Skill used:** new-feature

### Completed
- [x] Phase 1: Data layer
  - Created Supabase function `get_monthly_spending`
  - Created server action `getMonthlySpending()`
  - Wrote 5 tests (all passing)
  - Note: Added timezone parameter per operator annotation

### In progress
- [ ] Phase 2: Chart component (starting next session)

### Blockers
None.

### Files changed
- `supabase/migrations/20260328_monthly_spending.sql` (new)
- `src/app/dashboard/actions.ts` (modified)
- `src/lib/db/spending.test.ts` (new)

### Test results
- 5 new tests: all passing
- Full suite: 47 passing, 0 failing
- Typecheck: clean
- Lint: clean

### Learned
- Supabase's `date_trunc` uses server timezone by default.
  Had to explicitly cast to user's timezone. Added to
  AGENTS.md learned rules.

---

## CHECKPOINT (for next session)

### Resume instructions
Spec: .ai/specs/active/p1-monthly-spending-chart.md
Plan: .ai/plans/monthly-spending-chart.plan.md
Amendments: none
Branch: feat/monthly-spending-chart
Last commit: a1b2c3d "feat(dashboard): add spending data layer"

### Completed
- Phase 1: ALL DONE (Steps 1-3)
  - Supabase function created and tested
  - Server action implemented
  - 5 tests passing

### In progress
- Phase 2: NOT STARTED
  - Next step: Step 4 (SpendingChart.tsx component)

### Decisions made this session
- Used timezone parameter on Supabase function (per plan annotation)
- Chose ReferenceLine for average display (Recharts component)

### Open questions for operator
- None

### Environment state
- All tests passing (47 total)
- No lint warnings
- No type errors
- Dev server runs clean

---

## Cumulative project status
- **Active specs:** 3
- **Completed this week:** 1 (plaid-account-linking)
- **Total tests:** 47 passing
- **Guards:** all passing
```

### How to use progress files

Read `progress/` each morning to know what happened overnight or between sessions. This replaces the standup: instead of a meeting where people report status, you read a markdown file that the agent wrote automatically.

The CHECKPOINT block is specifically formatted for the next agent session to consume. When resuming work, the agent reads the checkpoint to understand exactly where things left off, which branch to check out, what steps are done, and what to do next — without re-reading every file from scratch.

For weekly reviews, scan the last 5 progress files. For monthly retrospectives, `grep "Completed" .ai/progress/*.md` gives you a shipped-features list.

---

## Primitive 11: Retrospectives — The Feedback Loop

**Replaces:** Sprint retrospectives, quarterly reviews

**Answers:** *Is our context engineering getting better over time?*

**When to create:** Monthly, or after every 10 completed specs — whichever comes first.

### Why this matters

The `.ai/` system is only as good as its feedback loop. Without retrospectives, you don't know if your specs are getting sharper, if your AGENTS.md rules are reducing rework, or if your guards are catching real problems versus generating noise.

### Example: retrospectives/2026-03-retro.md

```markdown
# Retrospective: March 2026

## Velocity
- Specs completed: 8
- Specs rejected: 1 (p3-dark-mode — descoped, not worth complexity)
- Average time from active → completed: 1.4 days
- Fastest: p2-export-csv (3 hours)
- Slowest: p0-plaid-account-linking (4.5 days)

## Quality
- Plans requiring ≥3 annotation cycles: 3/8 (37%)
- Plans requiring only 1 cycle: 2/8 (25%)
- CI failures caught before merge: 12
- CI failures that reached main: 0
- Security scan findings: 2 (both dependency vulnerabilities,
  patched same day)

## Rework
- Specs requiring amendments: 2/8
- Git reverts (full session revert): 1 (plaid-account-linking,
  agent went down wrong path on OAuth flow)
- Specs where agent deviated from plan: 1 (added unrequested
  caching layer — reverted, added AGENTS.md rule)

## AGENTS.md health
- Rules added this month: 4
- Rules that prevented a repeat failure: 2 (confirmed by agent
  referencing the rule in progress notes)
- Rules that are now redundant (model improved): 0

## Spec quality trend
- Average quality rubric score at time of activation: 14.2/16
- Dimensions most frequently below 2:
  - Testability (3 specs had vague acceptance criteria)
  - Dependencies (2 specs didn't verify dependency readiness)
- Action: add "verify dependency readiness" to _TEMPLATE.md
  as a required field

## Context efficiency
- Average context loaded per session: ~8,200 tokens
- Sessions where context exceeded 30% of window: 0
- Sessions where agent "forgot" prior context mid-task: 1
  (during the plaid OAuth flow — session was too long,
  context compacted and lost the token refresh requirement)
- Action: add max session duration guidance to CONTEXT.md —
  break sessions longer than 2 hours into checkpoint + resume

## Guard effectiveness
- CHECKLIST.md items that caught real issues: 4
  - 2x missing error states
  - 1x file exceeding 300 lines
  - 1x mobile responsiveness failure
- CHECKLIST.md items that never caught anything: 1
  - "No files exceed 300 lines" — ESLint already catches this
  - Action: remove from manual checklist (redundant with CI)
- BOUNDARIES.md violations attempted by agent: 0

## Decisions
- New decisions recorded: 2
- Decisions referenced by agents in plans: 5
- Decisions that prevented repeated debate: 1 (recharts vs chartjs
  came up again in the tax-chart spec — agent cited Decision 004)

## Actions for next month
1. Improve spec template: add "dependency verification" field
2. Remove redundant guard checklist item
3. Add session duration guidance to CONTEXT.md
4. Focus on testability in spec writing — practice GIVEN/WHEN/THEN
5. Investigate whether Supabase function patterns should become
   a dedicated .cursor/rules/database.mdc file
```

### What to track automatically

```bash
# Specs completed this month
ls .ai/specs/completed/ | wc -l

# Plans that had multiple iterations
grep -l "Iteration: [3-9]" .ai/plans/*.plan.md

# AGENTS.md rules added this month
git log --since="2026-03-01" --oneline -- .ai/AGENTS.md
```

Over time, this data tells you whether your context engineering discipline is improving — whether you're writing better specs, whether agents are producing cleaner first-pass implementations, and whether your guards are calibrated correctly.

---

## Primitive 12: Guards — The Quality Gate

**Replaces:** QA process, security review, deployment checklists

**Answers:** *What must pass before code ships?*

**When to update:** Add new guards whenever you discover a quality gap.

### CHECKLIST.md

```markdown
# Pre-Merge Checklist

Every PR must pass ALL of these before merging. No exceptions.

## Automated (CI/CD runs these)
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run test` passes with zero failures
- [ ] No new `any` types introduced
- [ ] No files exceed 300 lines
- [ ] No functions exceed 30 lines
- [ ] Semgrep security scan: zero critical/high findings
- [ ] OWASP dependency check: zero known vulnerabilities

## Manual (operator verifies these)
- [ ] Feature matches spec acceptance criteria
- [ ] UI matches DESIGN.md visual system
- [ ] Loading, empty, and error states all work
- [ ] Mobile responsive (test at 375px width)
- [ ] No new dependencies added without STACK.md justification
- [ ] Commit messages follow conventional commits format
```

### BOUNDARIES.md

```markdown
# Agent Boundaries — Hard Limits

These actions require explicit operator approval in the plan.
Agents must NEVER do these autonomously.

## Code boundaries
- Modifying authentication or authorization logic
- Changing Supabase RLS policies
- Adding or modifying payment/billing code
- Changing database schema (migrations require plan approval)
- Installing new dependencies not in STACK.md
- Modifying CI/CD configuration
- Changing environment variables or secrets
- Disabling or modifying ESLint rules
- Adding `@ts-ignore` or `@ts-expect-error`
- Modifying any file in .ai/guards/

## Data boundaries
- Accessing production database directly
- Modifying user data outside of normal application flows
- Logging personally identifiable information
- Exposing financial data in client-side code

## Process boundaries
- Merging to main without passing all guards
- Deploying without operator approval
- Skipping tests to save time
- Implementing features not covered by an approved spec
```

### CONCURRENCY.md

```markdown
# Concurrency Rules for Multi-Agent Sessions

## Branch isolation (mandatory)
Every agent session operates on its own branch.
Branch naming: feat/{spec-name} or feat/{spec-name}-{sub-task}
Never have two agents working on the same branch.

## File ownership
No two agents may modify the same file simultaneously.
When decomposing specs for parallel work, ensure each spec
targets different files/modules.

## Shared resource locks
These files are single-writer:
- .ai/AGENTS.md — only the operator modifies
- .ai/DESIGN.md — only the operator modifies
- .ai/progress/ — each agent writes its own dated entry
  with a session identifier suffix: 2026-03-28-session-1.md,
  2026-03-28-session-2.md
- package.json — if two specs need new dependencies, implement
  them sequentially, not in parallel

## Decomposition rules for parallel specs
Before running specs in parallel, verify:
- [ ] No shared file modifications (check plan file lists)
- [ ] No shared database migrations (run sequentially)
- [ ] No dependency on each other's output
- [ ] Each spec's acceptance criteria can be verified independently

## Merge order
When multiple agent branches are ready:
1. Merge the branch with the most foundational changes first
   (data layer before UI, shared utilities before features)
2. After each merge, rebase remaining branches and re-run tests
3. If merge conflicts arise, the operator resolves — never let
   an agent resolve merge conflicts from another agent's work

## Claude Code Agent Teams specific rules
When using a lead agent coordinating sub-agents:
- Lead agent owns .ai/plans/ and .ai/progress/
- Sub-agents own only their assigned files
- Sub-agents report status to lead via mailbox messages
- Lead agent consolidates into a single progress file
- Human operator reviews lead agent's consolidated output
```

### ESLint as enforcement

The ESLint config is your hardest guard — agents can ignore documentation but they can't ignore linting errors that block the build. Symlink it from `.ai/guards/` to the project root so agents can't modify it:

```bash
ln -s .ai/guards/eslint.config.js eslint.config.js
```

Key rules to enforce:

```javascript
// .ai/guards/eslint.config.js
export default [
  {
    rules: {
      'max-lines-per-function': ['error', { max: 50 }],
      'max-lines': ['error', { max: 300 }],
      'max-params': ['error', { max: 2 }],
      'no-magic-numbers': ['error', { ignore: [0, 1, -1] }],
      'no-console': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSTypeReference[typeName.name="any"]',
          message: 'Do not use `any`. Define a proper type.',
        },
      ],
    },
  },
];
```

---

## Tool-specific optimizations

The `.ai/` system is agent-agnostic by design. But each tool has capabilities that make the system more powerful when leveraged directly.

### Claude Code

**Hooks** auto-enforce guards without relying on agent compliance:

```json
{
  "hooks": {
    "post-edit": ["npm run typecheck", "npm run lint --quiet"],
    "pre-commit": ["npm run test -- --reporter=silent"]
  }
}
```

**Custom slash commands** map skills to one-liners:

```
/new-feature {spec-name}  → runs the full new-feature skill
/resume                   → reads latest checkpoint and continues
/score-spec {spec-name}   → evaluates spec against quality rubric
```

**Sub-agents** enable parallel phase execution within a single plan. For Phases targeting different files, spawn sub-agents that work simultaneously and report back.

### Cursor

**Scoped `.mdc` rules** deliver precise context per file type (see the repo structure section above).

**Notepads** hold frequently-referenced context (DESIGN.md patterns, common code patterns) that you `@` reference on demand.

**Composer agent mode** — reference the plan file directly: "Implement the steps listed in `.ai/plans/monthly-spending-chart.plan.md`. Follow each step in order."

### OpenAI Codex

**Parallel task execution** — launch multiple Codex tasks for independent specs simultaneously, each in its own sandbox.

**Restricted permissions** — map BOUNDARIES.md to Codex's permission model. Disable network access during all non-deployment tasks.

---

## The daily workflow

### Morning (30 minutes)

1. **Read progress:** Check `.ai/progress/` for the latest entry — what happened in the last session?
2. **Review plans:** Check `.ai/plans/` for any awaiting annotation. Read, add your corrections, approve or request changes.
3. **Triage draft specs:** Review `.ai/specs/draft/` — anything ready for quality rubric scoring and promotion to `active/`?

### Working session (2-4 hours)

1. **Pick the next spec:** Highest priority in `.ai/specs/active/`.
2. **Kick off the agent:** "Follow the `new-feature` skill for the spec at `.ai/specs/active/p1-monthly-spending-chart.md`. The plan is approved." (Or "Follow the `resume-session` skill" if continuing prior work.)
3. **Monitor and correct:** Watch output, provide terse corrections ("wider," "wrong color," "use the empty state pattern from DESIGN.md").
4. **Verify:** Test the running application against acceptance criteria.
5. **Complete:** Move spec to `.ai/specs/completed/`.

### Spec writing (1-2 hours)

This is where your irreplaceable human judgment lives. Write new specs for upcoming features. Research user needs. Think about the product. No agent can do this work — deciding *what to build and why* requires domain knowledge, taste, and strategic thinking. Score every draft spec against the quality rubric before promoting it.

### End of day (15 minutes)

1. Review the progress file and checkpoint the agent generated.
2. Add any new failure patterns to `AGENTS.md` learned rules.
3. Commit all `.ai/` changes: `git add .ai/ && git commit -m "chore(ai): update progress and learned rules"`

---

## Scaling: solo to team

### Solo operator (where you start)

One person owns all files. One agent session at a time (or parallel sessions on different specs, following CONCURRENCY.md). All review is in your loop. The `.ai/` system makes this viable because it externalizes the discipline that would otherwise require multiple specialized humans.

### Micro-team (2-5 people)

- AGENTS.md and DESIGN.md become shared team standards — PRs that modify these require team review
- Each person owns specs in their domain
- Git branching is critical — each agent session on its own branch
- Follow `.ai/guards/CONCURRENCY.md` for all parallel agent work
- Minimum viable coordination: each person's agent runs on their own branch, targeting their own specs, touching different files
- Progress files become the team's async coordination mechanism
- Add a `CONTRIBUTING.md` that explains the `.ai/` system to new team members

### Growth team (5+)

- Dedicated roles emerge: spec authors (product), architecture reviewers (tech lead), guard maintainers (platform)
- Skills library becomes institutional knowledge — reusable across the org
- Decision records prevent repeated debates
- CONCURRENCY.md becomes critical infrastructure — review it in team onboarding alongside AGENTS.md
- Designate a "merge coordinator" role (human) who sequences branch merges and resolves cross-cutting conflicts
- Consider a lead-agent/sub-agent pattern (Claude Code Agent Teams) for related specs that need coordinated implementation
- Monthly retrospectives drive continuous improvement of the system itself
- CI/CD guards become the primary quality enforcement mechanism

---

## Quick start

### 1. Clone the structure

```bash
mkdir -p .ai/specs/{active,draft,completed,rejected}
mkdir -p .ai/{plans,decisions,skills,progress,retrospectives,guards}
mkdir -p .cursor/rules
```

### 2. Write your VISION.md first

Start with the product. What are you building? For whom? Why does it matter? What does success look like? What is this NOT?

### 3. Create your DESIGN.md

Generate from Google Stitch, extract from an existing site, or write manually using the template above. This is your visual system — every agent session references it.

### 4. Write AGENTS.md

Start with: project structure, build commands, coding conventions, security rules. Keep it under 300 lines. You'll add learned rules over time.

### 5. Document your stack in STACK.md

Every technology choice with a one-line justification. Include what you're NOT using and why.

### 6. Set up CONTEXT.md

Define loading profiles for your common task types. Start with the feature-implementation and bug-fix profiles, add more as you identify patterns.

### 7. Copy the skill files

Start with `new-feature.md`, `bug-fix.md`, and `resume-session.md`. Add more as you identify repeatable patterns.

### 8. Set up your guards

Copy CHECKLIST.md, BOUNDARIES.md, and CONCURRENCY.md. Configure ESLint (symlinked from guards). Set up CI/CD to run automated checks on every commit.

### 9. Write your first spec

Pick the most important feature. Follow the template. Score it against the quality rubric — you need a 14+ to move to `active/`.

### 10. Generate your first plan

Tell the agent to read the spec and create a plan. Review it. Annotate it. Approve it. Then let the agent build.

### 11. Ship

Move the completed spec to `completed/`. Update AGENTS.md with anything you learned. Commit everything. Start the next spec.

### 12. Retrospect

After 10 completed specs or one month (whichever comes first), write your first retrospective. Use the data to improve your specs, rules, and guards.

---

## The philosophy

The `.ai/` repo works because it encodes a simple insight: **the quality of AI-generated software is determined by the quality of the context you provide**. Great specs produce great features. Precise DESIGN.md files produce consistent UIs. Comprehensive AGENTS.md files prevent repeated mistakes. Explicit guards catch the 45% of AI-generated code that ships with vulnerabilities. And retrospectives close the loop — turning every session into training data for the next one.

Your job isn't to write code. Your job is to think clearly, express intent precisely, apply judgment during review, and continuously improve the system that produces your software.

Every file in `.ai/` is a vehicle for your thinking — structured in a format that both humans and AI agents can consume. The system gets better every time you use it: learned rules accumulate, specs get sharper, skills get more precise, and guards get better calibrated. The `.ai/` directory isn't just a project management tool. It's an organizational learning system that compounds your expertise into a machine-readable format.

The ticket is dead. The spec is alive. The context engineer is the new builder. And `.ai/` is their workspace.

---

*This guide is part of the .ai/ (dot ai) framework at howdycarter.com.*
