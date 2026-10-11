# .ai 10X Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `.ai` from a promising markdown PM framework into the default, complete, agent-agnostic repo operating system for building software with AI.

**Architecture:** Keep `.ai`'s core advantage: a simple, standard directory that lives beside the code and is readable by every agent. Add the best BMAD-shaped capabilities as original `.ai` primitives: a guided interview engine, intelligent next-step router, scale-adaptive workflows, review lenses, stateful artifact graph, and a packaged installer/docs/community system. Do not copy BMAD files, branding, personas, or workflow text.

**Tech Stack:** Markdown primitives, shell installer, future Node CLI package (`@howdycarter/dot-ai` or `dot-ai`), GitHub Actions, docs site, examples, optional adapters for Claude Code, Codex, Cursor, Windsurf, Copilot, and Devin.

---

## Research Snapshot

Sources inspected on 2026-05-20:

- `.ai`: https://github.com/howdycarter/.ai
- BMAD Method: https://github.com/bmad-code-org/BMAD-METHOD
- BMAD docs: https://docs.bmad-method.org
- GitHub API benchmark checks:
  - `howdycarter/.ai`: 0 stars, 0 forks, created 2026-03-29, 40 files in current shallow clone.
  - `bmad-code-org/BMAD-METHOD`: 47,673 stars, 5,567 forks, v6.7.1, 542 files in current shallow clone.
  - `snarktank/ralph`: 19,291 stars, 1,923 forks.
  - `gastownhall/gastown`: 15,399 stars, 1,430 forks.
  - `gastownhall/beads`: 23,889 stars, 1,581 forks.
  - `openclaw/openclaw`: 373,324 stars, 77,486 forks.

## Non-Negotiable Boundary

`.ai` should learn from BMAD's product patterns, not absorb BMAD's product.

- Do not use "BMAD", "BMad Method", "Build More Architect Dreams", logos, agent names, or confusingly similar branding.
- Do not copy BMAD workflow prose, templates, CSVs, step files, or persona prompts.
- If any MIT-licensed code is intentionally reused later, preserve copyright and license notices, but the preferred path is clean-room reimplementation.
- Public language should say "inspired by agentic planning systems and markdown-native workflows", not "BMAD clone".
- Compete on a different thesis: BMAD is an agile agent workflow ecosystem; `.ai` is the repo-native context operating system.

## Positioning Thesis

Current `.ai` has the right wedge: "Your PM tool is a directory." That is sharp, memorable, and better than "AI agile framework."

The 10X version should expand the promise:

> `.ai` is the context operating system for AI-native software teams. One directory replaces tickets, PRDs, design handoffs, implementation plans, standups, QA gates, and agent memory.

BMAD wins on guided process, packaging, docs, modules, and community. `.ai` can win by being simpler, more native to the repo, more honest about human judgment, and less persona/workflow heavy.

## What BMAD Does Well To Reinterpret

1. Intelligent help/router: `bmad-help` orients the user by inspecting artifacts and recommending the next workflow.
2. Scale-adaptive tracks: quick flow for small tasks, full method for complex products, enterprise depth when needed.
3. Coached PRD interview: brain dump, stakes calibration, fast/coaching modes, concern scan, reviewer gate.
4. Analysis phase: brainstorming, research, product brief, PRFAQ before PRD.
5. Solutioning phase: architecture before epics/stories to prevent multi-agent conflicts.
6. Review lenses: advanced elicitation, adversarial review, edge-case review, editorial passes.
7. Stateful workflow files: micro-step instructions, frontmatter state, append-only artifacts.
8. Package install experience: `npx bmad-method install`, non-interactive options, module selection.
9. Docs and community surface: docs site, Discord, YouTube, roadmap, contributing guide, issue templates.
10. Ecosystem story: modules, customization, future marketplace.

## What `.ai` Should Do Differently

- Prefer one directory over a parallel `_bmad` universe.
- Prefer plain artifact names over a command maze.
- Prefer "review lenses" over named RPG-style personas.
- Prefer a few powerful loops over dozens of workflows.
- Prefer explicit context budgets and repo-native rules over large agent prompts.
- Prefer fast onboarding that generates usable project context in one sitting.
- Prefer agent-agnostic adapters from day one.
- Prefer proof artifacts: example repos, before/after diffs, recorded builds, benchmarked outcomes.

## Target Product Model

The 12 primitives remain, but the user experience should become three loops:

1. **Interview Loop:** turn vague intent into high-quality specs.
2. **Build Loop:** turn approved specs into plans, changes, verification, and checkpoints.
3. **Improve Loop:** turn failures, retrospectives, review findings, and operator corrections into better project memory.

Every new feature should map to one of these loops. If it does not, it is probably bloat.

## Roadmap

### Task 1: Fix Repo Trust And First Impression

**Files:**
- Modify: `README.md`
- Modify: `setup.sh`
- Modify: `docs/GUIDE.md`
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `.github/ISSUE_TEMPLATE/bug_report.yml`
- Create: `.github/ISSUE_TEMPLATE/feature_request.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/workflows/quality.yml`

- [ ] Fix install URLs in `README.md` and `setup.sh`; current README points to `howdycarter/dot-ai` while the repo is `howdycarter/.ai`.
- [ ] Add GitHub topics: `ai-agents`, `agentic-coding`, `context-engineering`, `spec-driven-development`, `markdown`, `codex`, `claude-code`, `cursor`.
- [ ] Add a short "What you get in 15 minutes" section above the long methodology.
- [ ] Add a 90-second demo GIF or terminal cast to the README.
- [ ] Add quality workflow that checks shell syntax, markdown links, and template placeholders.
- [ ] Add contribution docs that invite skills, templates, adapters, examples, and docs improvements.
- [ ] Add a "Why this is not BMAD" FAQ that is respectful and clear.

### Task 2: Add `.ai/help.md` As The Router

**Files:**
- Create: `.ai/skills/help.md`
- Modify: `CLAUDE.md`
- Modify: `AGENTS.md`
- Modify: `.cursor/rules/global.mdc`
- Modify: `README.md`
- Modify: `setup.sh`

- [ ] Define a router that inspects `.ai/specs`, `.ai/plans`, `.ai/progress`, `.ai/decisions`, and root project files.
- [ ] Output exactly: current state, likely next action, optional actions, command/prompt to run next.
- [ ] Make it the default first action after install: "Ask your agent: follow `.ai/skills/help.md`."
- [ ] Keep routing simple: initialize, interview, write spec, review spec, plan, build, verify, resume, retro.
- [ ] Add completion detection conventions: status fields, file locations, latest checkpoint, active plan markers.

### Task 3: Build The `.ai` Interview Engine

**Files:**
- Create: `.ai/skills/interview.md`
- Create: `.ai/interviews/_TEMPLATE.md`
- Create: `.ai/interviews/lenses.md`
- Create: `.ai/specs/_PRD_TEMPLATE.md`
- Modify: `.ai/specs/_TEMPLATE.md`
- Modify: `.ai/specs/_QUALITY_RUBRIC.md`
- Modify: `.ai/skills/onboard.md`
- Modify: `setup.sh`
- Modify: `docs/GUIDE.md`

- [ ] Add a brain-dump first move: ask for all context, files, notes, URLs, sketches, constraints, and "anything else I am forgetting?"
- [ ] Add stakes calibration: hobby, internal tool, launch product, enterprise/compliance.
- [ ] Add mode selection: Fast, Coached, Deep.
- [ ] Add a concern scan: compliance, security, UX complexity, monetization, integrations, public API, migration, data governance, performance.
- [ ] Generate an interview artifact before the spec: assumptions, decisions, open questions, user language, important discarded paths.
- [ ] Convert the current spec template into two levels:
  - lightweight feature spec for small changes
  - PRD-style spec for product or multi-epic work
- [ ] Add richer PRD concepts without copying BMAD: glossary, user journeys, globally stable requirement IDs, non-goals, success metrics, counter-metrics, assumptions index.
- [ ] Add review lenses: first principles, pre-mortem, red team, edge-case hunter, UX friction, security/privacy, implementation risk, go-to-market clarity.
- [ ] Make the interview output feed directly into `VISION.md`, `DESIGN.md`, `STACK.md`, and the first active spec.

### Task 4: Add Scale-Adaptive Workflow Tracks

**Files:**
- Create: `.ai/workflows/quick-fix.md`
- Create: `.ai/workflows/feature.md`
- Create: `.ai/workflows/product.md`
- Create: `.ai/workflows/enterprise.md`
- Create: `.ai/workflows/brownfield.md`
- Modify: `.ai/CONTEXT.md`
- Modify: `.ai/skills/new-feature.md`
- Modify: `.ai/skills/bug-fix.md`
- Modify: `.ai/skills/refactor.md`
- Modify: `docs/GUIDE.md`

- [ ] Define track selection by risk, number of files, user-facing impact, data/security impact, and ambiguity.
- [ ] Quick fix: reproduce, test, fix, verify, checkpoint.
- [ ] Feature: spec, score, plan, implement, verify, checkpoint.
- [ ] Product: interview, PRD spec, architecture decisions, implementation plan, slices.
- [ ] Enterprise: product track plus compliance, security, rollout, support, audit, and data requirements.
- [ ] Brownfield: codebase scan, project-context generation, existing architecture map, safe-change plan.
- [ ] Make tracks advisory, not ceremony: operator can override with documented risk.

### Task 5: Add Architecture And Story Decomposition Without Becoming Jira

**Files:**
- Create: `.ai/architecture/_TEMPLATE.md`
- Create: `.ai/architecture/decisions/_TEMPLATE.md`
- Create: `.ai/stories/_TEMPLATE.md`
- Create: `.ai/stories/status.yaml`
- Modify: `.ai/decisions/.gitkeep`
- Modify: `.ai/plans/.gitkeep`
- Modify: `.ai/guards/CONCURRENCY.md`
- Modify: `.ai/skills/new-feature.md`
- Modify: `docs/GUIDE.md`

- [ ] Add architecture only when it prevents cross-agent conflicts.
- [ ] Standardize ADR shape: context, options, decision, rationale, consequences, affected specs.
- [ ] Add story files only for multi-slice work; do not force stories for small features.
- [ ] Add `status.yaml` for active epics/stories when work spans multiple sessions or agents.
- [ ] Create explicit "do not decompose" guidance so `.ai` does not recreate ticket bureaucracy.

### Task 6: Turn Setup Into A Real Product Installer

**Files:**
- Create: `package.json`
- Create: `src/cli/index.js`
- Create: `src/cli/commands/init.js`
- Create: `src/cli/commands/doctor.js`
- Create: `src/cli/commands/score.js`
- Create: `src/cli/commands/status.js`
- Create: `src/cli/lib/files.js`
- Create: `src/cli/lib/project-detect.js`
- Create: `test/cli/*.test.js`
- Modify: `setup.sh`
- Modify: `README.md`

- [ ] Keep `setup.sh` for curl users.
- [ ] Add `npx dot-ai init` or `npx @howdycarter/dot-ai init`.
- [ ] Add `dot-ai doctor`: checks install health, missing placeholders, stale plans, broken links, missing guards.
- [ ] Add `dot-ai score spec path/to/spec.md`: applies the rubric and prints readiness.
- [ ] Add `dot-ai status`: summarizes active specs, plans, blockers, and next actions.
- [ ] Add non-interactive flags: `--dir`, `--agent codex|claude|cursor|all`, `--yes`, `--force`, `--profile quick|full`.
- [ ] Test installer against temporary projects.

### Task 7: Make Guards Real, Not Just Checklists

**Files:**
- Create: `.ai/guards/scripts/check-file-size.sh`
- Create: `.ai/guards/scripts/check-placeholders.sh`
- Create: `.ai/guards/scripts/check-spec-ready.sh`
- Create: `.github/workflows/dot-ai-guards.yml`
- Modify: `.ai/guards/CHECKLIST.md`
- Modify: `.ai/guards/BOUNDARIES.md`
- Modify: `.ai/skills/security-review.md`
- Modify: `setup.sh`

- [ ] Add scripts that can run in any repo without dependencies.
- [ ] Check for unresolved template placeholders in `.ai` files.
- [ ] Check active specs have readiness score metadata.
- [ ] Check plans are approved before implementation markers appear.
- [ ] Keep project-specific lint/type/test commands configurable in `.ai/STACK.md` or `.ai/AGENTS.md`.
- [ ] Add a guard philosophy: automate objective checks; leave judgment to the operator.

### Task 8: Create Proof-Driven Examples

**Files:**
- Create: `examples/next-saas/.ai/...`
- Create: `examples/python-api/.ai/...`
- Create: `examples/mobile-app/.ai/...`
- Create: `examples/legacy-brownfield/.ai/...`
- Create: `docs/examples.md`
- Modify: `README.md`

- [ ] Each example must include filled `VISION.md`, `DESIGN.md`, `STACK.md`, `AGENTS.md`, one spec, one plan, one progress checkpoint, one decision.
- [ ] Add "bad spec to good spec" transformations.
- [ ] Add "one sentence idea to active spec" transcript.
- [ ] Add "agent failed, AGENTS.md learned rule added" example.
- [ ] Add "before/after Jira replacement" map.
- [ ] Add a public sample PR generated from a `.ai` plan.

### Task 9: Build Docs Site And Launch Assets

**Files:**
- Create: `website/`
- Create: `website/src/content/docs/index.md`
- Create: `website/src/content/docs/quickstart.md`
- Create: `website/src/content/docs/interview.md`
- Create: `website/src/content/docs/workflows.md`
- Create: `website/src/content/docs/examples.md`
- Create: `website/src/content/docs/migrate-from-bmad.md`
- Create: `website/src/content/docs/migrate-from-jira-linear.md`
- Create: `website/src/content/docs/agent-adapters.md`
- Create: `docs/launch/README.md`
- Create: `docs/launch/x-thread.md`
- Create: `docs/launch/hn-post.md`
- Create: `docs/launch/reddit-posts.md`
- Create: `docs/launch/demo-script.md`

- [ ] Make the docs site skimmable before comprehensive.
- [ ] Put install, demo, and core loop above all theory.
- [ ] Add a respectful BMAD migration page: "keep the rigor, remove the ceremony."
- [ ] Add an agent adapter matrix with exact root file behavior for Codex, Claude Code, Cursor, Copilot, Windsurf, Devin.
- [ ] Add launch copy that is punchy but falsifiable.
- [ ] Add screenshots or short videos for onboarding, interview, plan review, and resume.

### Task 10: Add Community And Star Growth Engine

**Files:**
- Create: `ROADMAP.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `docs/community.md`
- Create: `docs/showcase.md`
- Create: `docs/templates.md`
- Create: `.github/DISCUSSION_TEMPLATE/show_and_tell.yml`
- Modify: `README.md`

- [ ] Enable GitHub Discussions.
- [ ] Add "Show and Tell: built with `.ai`" category.
- [ ] Add "good first issue" labels and prefilled issues for examples, adapters, docs, and guard scripts.
- [ ] Publish weekly "Spec teardown" posts where a vague idea becomes a strong `.ai` spec.
- [ ] Create a public leaderboard of projects using `.ai`.
- [ ] Create a template gallery: SaaS, AI app, CLI, game, mobile, internal tool, API, Chrome extension.
- [ ] Add a "star if this replaces a ticket for you" README callout after the quickstart, not at the top.

## Growth Strategy

### The Viral Hook

Lead with:

> "I deleted Jira and replaced it with one folder: `.ai/`."

Supporting hooks:

- "Specs replace tickets. Plans replace sprints. Guards replace QA."
- "The project manager for AI agents is not a SaaS app. It is context in git."
- "BMAD has workflows. `.ai` gives every repo an operating system."
- "Vibe coding is dead. Context engineering is the job."

### Launch Waves

1. **Credibility launch:** fix repo, release v0.2, publish examples and demo.
2. **Builder launch:** show a real product built using `.ai`, with full artifacts included.
3. **Comparison launch:** respectful, practical comparisons against BMAD, Spec Kit, Ralph loops, Gas Town, Jira/Linear.
4. **Community launch:** invite templates and "built with `.ai`" PRs.
5. **Ecosystem launch:** CLI, docs site, adapters, templates, badges.

### Star Targets

- 1,000 stars: strong README, demo, examples, X/HN/Reddit launch.
- 5,000 stars: docs site, CLI, templates, community examples.
- 20,000 stars: beat Ralph/Gas Town tier by becoming the default lightweight alternative.
- 50,000 stars: beat BMAD tier through ecosystem, adapters, proof, and repeated launches.
- 375,000+ stars: OpenClaw tier requires consumer-grade virality, product UI, marketplace/network effects, and broad non-developer appeal. Treat this as a multi-year ambition, not a repo README goal.

## Success Metrics

- Install to first active spec: under 15 minutes.
- Existing project install to useful context files: under 20 minutes.
- First high-quality spec readiness: 14+/16 or equivalent after one interview.
- First PR from approved plan: under 60 minutes for small features.
- README time-to-understand: under 45 seconds.
- 10 filled examples before public launch.
- 25 external contributors or showcase submissions before v1.
- 100 projects with `.ai` badge before "beat BMAD" campaign.

## Recommended First Sprint

Do these before anything more ambitious:

1. Fix install URLs and repo metadata.
2. Add `help.md`.
3. Add `interview.md`.
4. Add richer spec/PRD template and rubric.
5. Add one filled example repo.
6. Add README quickstart rewrite with demo.
7. Add CONTRIBUTING, issue templates, and Discussions.

This gives `.ai` an immediate BMAD-level "guided" feel while preserving the thing BMAD cannot easily become: a tiny, obvious, repo-native standard.

## Self-Review

Spec coverage:

- Repos inspected: covered.
- BMAD best parts identified: covered.
- No-stealing boundary: covered.
- `.ai` 10X roadmap: covered.
- Interview improvements: covered.
- Virality/star plan: covered.
- File-level implementation plan: covered.

Risks:

- Some benchmark repos named by the user were inferred by public search/API results. Confirm exact competitors before publishing comparison copy.
- OpenClaw-scale star goals may incentivize hype. Keep all claims falsifiable and avoid fake-star tactics.
- A CLI adds maintenance load. Keep shell setup working until the CLI is proven.

Placeholder scan:

- No `TBD`, `TODO`, or unresolved implementation placeholders intentionally remain in this plan.

