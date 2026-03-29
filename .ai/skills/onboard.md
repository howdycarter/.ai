# Skill: Onboard — Initialize .ai/ for This Project

## When to use
Run once when .ai/ is first added to a project. This skill inspects the
existing codebase, infers as much context as possible, asks the operator
only what it can't determine from code, and populates every .ai/ file.

The operator reviews and approves. They stay in control without having
to manually author 12 files from scratch.

## Workflow

### Step 1: Detect project type

Determine if this is greenfield (no src/ or app code exists) or
brownfield (existing codebase). Check for:

```
- package.json (or requirements.txt, Cargo.toml, go.mod, etc.)
- src/ or app/ directory
- Existing README.md
- tsconfig.json or jsconfig.json
- tailwind.config.* or CSS files
- .env.example or .env.local
- Existing CI/CD config (.github/workflows/, vercel.json, etc.)
- Database config (supabase/, prisma/, drizzle.config.*, etc.)
- Test config (vitest.config.*, jest.config.*, etc.)
```

If brownfield: proceed to Step 2 (auto-detect).
If greenfield: skip to Step 3 (interview).

### Step 2: Auto-detect from codebase (brownfield only)

Read the following files and extract structured information. Do NOT
ask the operator for anything you can determine from the code.

**From package.json / lock files:**
- Framework (next, react, vue, svelte, express, etc.)
- All dependencies → populate STACK.md
- Build/dev/test/lint scripts → populate AGENTS.md commands
- Project name and description → seed VISION.md

**From tsconfig.json / jsconfig.json:**
- Strict mode setting → populate AGENTS.md conventions
- Path aliases → populate AGENTS.md project structure

**From directory structure:**
- Scan src/ or app/ and map the folder tree → populate AGENTS.md
  project structure section exactly as it exists

**From tailwind.config.* or CSS variables or theme files:**
- Extract colors, fonts, spacing, border radii → seed DESIGN.md
- If Tailwind: extract the full theme config into design tokens

**From .env.example:**
- Identify external services (Supabase, Stripe, Plaid, etc.)
  → populate STACK.md with integrations
- Do NOT read .env or .env.local (secrets)

**From existing README.md:**
- Extract project description, setup instructions → seed VISION.md

**From CI/CD config:**
- Extract build/test/deploy pipeline → populate guards/CHECKLIST.md
  with the actual CI checks already in place

**From test config:**
- Identify test framework and conventions → populate AGENTS.md
  testing section

**From git log (last 20 commits):**
- Detect commit message convention (conventional commits, etc.)
  → populate AGENTS.md git conventions
- Detect branch naming patterns → populate AGENTS.md

After auto-detection, compile a summary of everything inferred.
Present it to the operator:

```
I inspected your codebase and detected:

Framework: Next.js 15 (App Router)
Database: Supabase (from @supabase/supabase-js)
Styling: Tailwind CSS 4
Testing: Vitest + Testing Library
Deployment: Vercel (from vercel.json)
Build command: npm run build
Dev command: npm run dev
Test command: npm run test
Lint command: npm run lint
Commit style: Conventional commits

Project structure:
src/
├── app/         # Next.js pages
├── components/  # React components
├── lib/         # Utilities
└── types/       # TypeScript types

Design tokens extracted from tailwind.config.ts:
- Primary: #2563EB
- 6 colors detected
- Font: Inter
- Spacing: 4px base

Is this accurate? What should I correct?
```

Wait for the operator to confirm or correct. Then proceed to Step 3
for the questions auto-detection can't answer.

### Step 3: Interview the operator

Ask ONLY the questions that couldn't be answered from code inspection.
For greenfield projects, this is all of them. For brownfield, this is
typically 4-6 questions.

Ask them in ONE message, not one at a time. The operator answers once.

**Questions to ask (skip any already answered by auto-detection):**

VISION questions (if not inferred from README/package.json):
1. "In one sentence, what does this product do and who is it for?"
2. "What are the 2-3 things this product is explicitly NOT?"
3. "What does success look like? (2-3 measurable outcomes)"

DESIGN questions (if not inferred from tailwind/CSS):
4. "Describe the visual feel in 2-3 words (e.g., 'clean, calm, professional')
    and name 1-2 products whose design inspires yours."
   (If no design exists yet, offer to generate a starter DESIGN.md
   based on their description, or suggest they use Google Stitch.)

AGENTS questions (if not inferred from codebase):
5. "Are there any absolute rules agents must follow?
    (e.g., 'never use floating point for money', 'always validate server-side')"

STACK questions (if not inferred from package.json):
6. "Any technologies you've explicitly decided NOT to use, and why?"

That's it. Six questions maximum. Most brownfield projects need 3-4.

### Step 4: Generate all files

Using the auto-detected data + operator answers, generate:

**VISION.md** — Full vision document from the operator's answers.
Include a "Core principles" section by inferring 2-3 principles from
the product description and "what it's NOT" answers.

**DESIGN.md** — If design tokens were extracted from the codebase,
use them. If not, generate a starter design system from the operator's
visual description. Include placeholders for component patterns the
operator can fill in later.

**AGENTS.md** — Populate with:
- Real project structure (from directory scan)
- Real build/test/lint commands (from package.json scripts)
- Real coding conventions (from tsconfig strict mode, existing linting)
- Operator's absolute rules
- Empty "Learned rules" section ready for append-only additions
- Keep under 300 lines

**STACK.md** — Every dependency from package.json as a technology
choice with inferred justification. Include the operator's "NOT using"
answers.

**CONTEXT.md** — Generate loading profiles based on the actual file
sizes of the .ai/ files created. Customize profiles for the detected
framework (e.g., React components profile if React detected).

**CLAUDE.md** (root) — Smart pointer with the 10 most critical rules
extracted from AGENTS.md. Customize for the detected framework.

**.cursor/rules/*.mdc** — Generate scoped rule files based on the
detected directory structure and framework:
- If React: react-components.mdc scoped to component directories
- If API routes exist: api-routes.mdc scoped to route directories
- If database layer exists: database.mdc scoped to db directories
- Always: global.mdc and tests.mdc

**Root AGENTS.md** — Pointer for OpenAI Codex.

**guards/CHECKLIST.md** — If CI/CD config was detected, populate
automated checks from the actual pipeline. Otherwise use defaults.

Leave these files as-is (they're not project-specific):
- guards/BOUNDARIES.md (universal)
- guards/CONCURRENCY.md (universal)
- specs/_TEMPLATE.md (universal)
- specs/_QUALITY_RUBRIC.md (universal)
- skills/* (universal)
- retrospectives/_TEMPLATE.md (universal)

### Step 5: Present for review

Show the operator a summary of what was generated:

```
I've populated your .ai/ directory:

✓ VISION.md — Product vision from your answers
✓ DESIGN.md — Design system from your tailwind config
✓ AGENTS.md — Agent rules from your codebase (247 lines)
✓ STACK.md — 8 technologies from package.json + your exclusions
✓ CONTEXT.md — Loading profiles calibrated to your file sizes
✓ CLAUDE.md — 10 critical rules front-loaded
✓ .cursor/rules/ — 4 scoped rule files for your directory structure
✓ guards/CHECKLIST.md — Matched to your GitHub Actions pipeline

Review each file and make corrections. The most important file to
review first is AGENTS.md — this is the law your agents follow.

To start building, write your first spec:
  1. Copy .ai/specs/_TEMPLATE.md to .ai/specs/draft/your-feature.md
  2. Fill it in
  3. Ask me to score it: "Score this spec against the quality rubric"
  4. Move to .ai/specs/active/ when it scores 14+
  5. Tell me: "Follow the new-feature skill for this spec"
```

### Step 6: First spec assist

After the operator reviews the generated files, offer to help write
their first spec:

"What's the first feature you want to build? Describe it in plain
language and I'll draft a spec for you using the template."

Draft the spec from their description. Score it against the quality
rubric. Show them the score. Help them fix any dimensions below 2.
Move to active/ when ready.

This completes onboarding. The operator is now in the build loop.

## Rules
- Never ask a question you can answer from the codebase
- Never ask more than 6 questions total
- Ask all questions in one message, not sequentially
- Generate files immediately after answers — don't ask for permission
  to write each file
- Present the summary for review, not each file individually
- The operator reviews and corrects — they don't author from scratch
- If the project is greenfield with zero code, generate sensible
  defaults and tell the operator what assumptions you made
