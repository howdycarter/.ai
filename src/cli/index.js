#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const STANDARD_VERSION = '0.1.0';

const CORE_DIRS = [
  '.ai/specs/active',
  '.ai/specs/draft',
  '.ai/specs/completed',
  '.ai/specs/rejected',
  '.ai/stories/ready',
  '.ai/stories/in-progress',
  '.ai/stories/review',
  '.ai/stories/done',
  '.ai/plans',
  '.ai/decisions',
  '.ai/skills',
  '.ai/progress',
  '.ai/retrospectives',
  '.ai/guards',
];

const CORE_FILES = [
  '.ai/manifest.json',
  '.ai/VISION.md',
  '.ai/DESIGN.md',
  '.ai/AGENTS.md',
  '.ai/STACK.md',
  '.ai/CONTEXT.md',
  '.ai/stories/_TEMPLATE.md',
  '.ai/skills/help.md',
  '.ai/skills/interview.md',
];

const PRIMITIVES = [
  'VISION.md',
  'DESIGN.md',
  'AGENTS.md',
  'STACK.md',
  'CONTEXT.md',
  'specs',
  'stories',
  'plans',
  'decisions',
  'skills',
  'progress',
  'retrospectives',
  'guards',
];

const PACKS = {
  'solo-saas': 'Solo SaaS founder workflow with product, UX, and launch-ready specs.',
  'api-service': 'Backend service workflow with contracts, tests, and operational guards.',
  'mobile-app': 'Mobile product workflow with platform, UX, and release constraints.',
  game: 'Game project workflow with gameplay loops, assets, and playtest checkpoints.',
  enterprise: 'Enterprise workflow with rollout, audit, governance, and support depth.',
  brownfield: 'Existing-codebase workflow focused on safe change and context extraction.',
  'security-heavy': 'Security-sensitive workflow with threat, privacy, and review gates.',
};

const PROOF_STATUS = 'unscored';

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = { _: [] };

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = rest[i + 1];
      if (next && !next.startsWith('--')) {
        options[key] = next;
        i += 1;
      } else {
        options[key] = true;
      }
    } else {
      options._.push(token);
    }
  }

  return { command, options };
}

function resolveRoot(options) {
  return path.resolve(options.dir || process.cwd());
}

function writeFileOnce(filePath, contents, force = false) {
  if (!force && fs.existsSync(filePath)) {
    return false;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
  return true;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function manifestTemplate(projectName) {
  return JSON.stringify(
    {
      schemaVersion: `https://dot-ai.dev/schemas/manifest-${STANDARD_VERSION}.schema.json`,
      standardVersion: STANDARD_VERSION,
      projectName,
      createdAt: new Date().toISOString(),
      primitives: PRIMITIVES.map((name) => ({
        name,
        path: `.ai/${name}`,
        required: true,
      })),
      adapters: [
        { name: 'codex', path: 'AGENTS.md', enabled: true },
        { name: 'claude-code', path: 'CLAUDE.md', enabled: true },
        { name: 'cursor', path: '.cursor/rules', enabled: true },
        { name: 'generic-agent', path: '.ai/AGENTS.md', enabled: true },
      ],
      guards: {
        checklist: '.ai/guards/CHECKLIST.md',
        commands: [],
      },
      activeWork: {
        specs: '.ai/specs/active',
        stories: '.ai/stories',
        plans: '.ai/plans',
        progress: '.ai/progress',
        buildReport: '.ai/build-report.md',
      },
    },
    null,
    2,
  );
}

function coreTemplates(projectName) {
  return {
    '.ai/VISION.md': `# Vision: ${projectName}\n\n## One-line summary\nDescribe what this project does and who it serves.\n\n## Problem\nWhat pain exists, for whom, and why current options fall short.\n\n## Success\n- First active spec is ready in under 15 minutes.\n- Agents can build without guessing intent.\n- Project learning compounds in .ai files.\n`,
    '.ai/DESIGN.md': `# Design System: ${projectName}\n\n## Brand personality\nClear, useful, and calm.\n\n## Interface rules\n- Use existing product patterns first.\n- Cover loading, empty, error, and populated states.\n- Keep generated UI readable before decorative.\n`,
    '.ai/AGENTS.md': `# Agent Instructions: ${projectName}\n\nRead .ai/manifest.json first, then load the context files required for the task.\n\n## Rules\n- Never implement without an approved spec or plan unless the operator explicitly chooses quick-fix mode.\n- Preserve markdown artifacts as the source of truth.\n- Update progress checkpoints after meaningful work.\n`,
    '.ai/STACK.md': `# Technology Stack: ${projectName}\n\nDocument approved technologies, commands, and explicit exclusions here.\n\n## Commands\n- Build: record the command here.\n- Test: record the command here.\n- Lint: record the command here.\n`,
    '.ai/CONTEXT.md': `# Context Loading: ${projectName}\n\n## Default order\n1. .ai/manifest.json\n2. .ai/AGENTS.md\n3. The active spec or plan\n4. Relevant decisions and progress checkpoints\n\nLoad the smallest set of files that makes the task solvable.\n`,
    '.ai/skills/help.md': helpSkill(),
    '.ai/skills/interview.md': interviewSkill(),
    '.ai/specs/_TEMPLATE.md': specTemplate(),
    '.ai/specs/_QUALITY_RUBRIC.md': qualityRubric(),
    '.ai/stories/_TEMPLATE.md': storyTemplate(),
    '.ai/guards/CHECKLIST.md': '# Pre-Merge Checklist\n\n- [ ] Spec acceptance criteria pass\n- [ ] Tests pass\n- [ ] Lint/typecheck pass\n- [ ] No secrets or private data in artifacts\n',
    '.ai/guards/BOUNDARIES.md': '# Agent Boundaries\n\nAgents must not change auth, billing, secrets, deployment, or security policy without explicit operator approval.\n',
    '.ai/guards/CONCURRENCY.md': '# Concurrency Rules\n\nUse separate branches and non-overlapping file ownership for parallel agent work.\n',
    '.ai/build-report.md': buildReportTemplate(projectName, []),
    AGENTS: 'Read `.ai/manifest.json` first. Then follow `.ai/AGENTS.md` and the active `.ai` workflow.\n',
    CLAUDE: `# ${projectName}\n\nRead .ai/manifest.json first. Then follow .ai/AGENTS.md and the active .ai workflow.\n`,
    CURSOR: 'Always consult .ai/manifest.json and .ai/AGENTS.md before planning or implementing changes.\n',
  };
}

function helpSkill() {
  return `# Skill: .ai Help\n\nUse this when the operator asks what to do next or when a session starts.\n\n## Output\nReturn four sections:\n\n1. Current state: active specs, active plans, latest progress checkpoint, missing standard files.\n2. Blockers: anything preventing useful work.\n3. Recommended next action: one concrete action and why.\n4. Optional actions: no more than three useful alternatives.\n\n## Rules\n- Inspect .ai/manifest.json first.\n- Prefer existing active specs and plans over inventing new work.\n- If .ai is not initialized, recommend running onboarding or dot-ai init.\n- Keep the answer short enough that the operator can act immediately.\n`;
}

function interviewSkill() {
  return `# Skill: .ai Interview\n\nUse this to turn rough intent into an implementation-ready spec.\n\n## Flow\n1. Brain dump: ask for all notes, files, sketches, constraints, and forgotten context.\n2. Stakes: classify as hobby, internal, launch, or enterprise/compliance.\n3. Mode: fast, coached, or deep.\n4. Concern scan: UX, security, privacy, data, integrations, migration, monetization, performance, support.\n5. Draft: produce assumptions, decisions, open questions, and a spec draft.\n6. Review lenses: first principles, pre-mortem, edge cases, security/privacy, implementation risk, and go-to-market clarity.\n7. Activate: score the spec and move it to .ai/specs/active only when ready.\n\n## Rules\n- Preserve the operator's language and product judgment.\n- Mark unconfirmed inferences as assumptions.\n- Do not start implementation during the interview.\n`;
}

function specTemplate() {
  return `# Spec: {Feature Name}\n\n**Status:** draft | active | in-progress | review | completed | rejected\n**Priority:** p0-critical | p1-high | p2-medium | p3-low\n**Complexity:** small | medium | large | xl\n**Created:** {YYYY-MM-DD}\n**Last updated:** {YYYY-MM-DD}\n\n## Problem\n\n## Solution\n\n## Requirements\n\n### Functional\n- [ ] The system SHALL...\n\n### Non-functional\n- **Performance:**\n- **Security:**\n- **Accessibility:**\n\n## Acceptance criteria\n- [ ] GIVEN ..., WHEN ..., THEN ...\n\n## UI/UX requirements\n\n## Out of scope\n\n## Dependencies\n\n## Technical notes\n\n## References\n`;
}

function qualityRubric() {
  return `# Spec Quality Rubric\n\nScore each dimension 0-2. Total >= 14 is ready for active work.\n\n- Clarity\n- Completeness\n- Testability\n- Scoping\n- Design integration\n- Dependencies\n- Architecture alignment\n- Sizing accuracy\n`;
}

function storyTemplate() {
  return `# Story: {Story Title}\n\n**Status:** ready | in-progress | review | done\n**Spec:** .ai/specs/active/{spec}.md\n**Created:** {YYYY-MM-DD}\n**Last updated:** {YYYY-MM-DD}\n\n## Goal\nWhat implementation slice this story completes.\n\n## Acceptance criteria\n- [ ] GIVEN {context}, WHEN {action}, THEN {expected result}\n\n## Implementation notes\n- Files or components likely to change.\n\n## Verification\n- Test command:\n- Build command:\n\n## Evidence\n- PR:\n- Screenshots:\n- Notes:\n`;
}

function buildReportTemplate(projectName, activeSpecs) {
  const specs = activeSpecs.length ? activeSpecs.map((spec) => `- ${spec}`).join('\n') : '- None recorded yet.';
  return `# Built with .ai\n\n## Project\n${projectName}\n\n## Idea\nDescribe the original idea in one paragraph.\n\n## Original Prompt\nPaste the rough user prompt or product request that started this build.\n\n## Interview Highlights\n- Stakes:\n- Assumptions:\n- Decisions:\n- Open questions:\n\n## Active Specs\n${specs}\n\n## Plan\nLink the approved implementation plan or summarize the build approach.\n\n## Outcome\nDescribe what shipped or what changed.\n\n## Acceptance Results\n- [ ] Record the key acceptance criteria and whether the shipped product satisfies them.\n\n## Evidence\n- Screenshots:\n- Commands:\n- Pull request:\n\n## Verdict\nUnscored. Replace this with a plain-English outcome after reviewing the evidence.\n\n## Lessons\n- Add the most useful lesson from this build.\n\n## Safety\nThis report is intended for public sharing after review. Remove private paths, credentials, customer data, and unreleased business details before publishing.\n`;
}

async function init(options) {
  const root = resolveRoot(options);
  const force = Boolean(options.force);
  const projectName = path.basename(root);
  const templates = coreTemplates(projectName);

  for (const dir of CORE_DIRS) {
    fs.mkdirSync(path.join(root, dir), { recursive: true });
  }

  writeFileOnce(path.join(root, '.ai/manifest.json'), manifestTemplate(projectName), force);
  for (const [relativePath, contents] of Object.entries(templates)) {
    if (relativePath === 'AGENTS' || relativePath === 'CLAUDE' || relativePath === 'CURSOR') {
      continue;
    }
    writeFileOnce(path.join(root, relativePath), contents, force);
  }
  writeFileOnce(path.join(root, 'AGENTS.md'), templates.AGENTS, force);
  writeFileOnce(path.join(root, 'CLAUDE.md'), templates.CLAUDE, force);
  writeFileOnce(path.join(root, '.cursor/rules/global.mdc'), templates.CURSOR, force);

  return ok(`Initialized .ai Standard v${STANDARD_VERSION} at ${root}\n`);
}

function doctor(options) {
  const root = resolveRoot(options);
  const { manifest, failures } = inspectProject(root);

  if (failures.length > 0) {
    return fail(`${failures.join('\n')}\n`);
  }

  return ok(`Valid .ai project: ${manifest.projectName} (${manifest.standardVersion || STANDARD_VERSION})\n`);
}

function status(options) {
  const root = resolveRoot(options);
  const { failures } = inspectProject(root);
  const activeSpecs = listMarkdown(path.join(root, '.ai/specs/active'));
  const plans = listMarkdown(path.join(root, '.ai/plans'));
  const progress = listMarkdown(path.join(root, '.ai/progress')).slice(-3);
  const storySummary = summarizeStories(root);
  const proofSummary = summarizeProofRuns(root);
  const nextAction = recommendNextAction(activeSpecs, storySummary);
  const blockers = [
    ...failures.slice(0, 3),
    ...(proofSummary.unscored.length ? [`Unscored proof runs: ${proofSummary.unscored.join(', ')}`] : []),
    ...(proofSummary.invalid.length ? [`Invalid proof runs: ${proofSummary.invalid.join(', ')}`] : []),
  ];

  return ok([
    '# .ai Status',
    '',
    `Doctor: ${failures.length ? `invalid (${failures[0]})` : 'valid'}`,
    `Active specs: ${activeSpecs.length}`,
    `Plans: ${plans.length}`,
    `Stories: ready ${storySummary.counts.ready}, in-progress ${storySummary.counts['in-progress']}, review ${storySummary.counts.review}, done ${storySummary.counts.done}`,
    `Proof runs: total ${proofSummary.total}, scored ${proofSummary.scored.length}, unscored ${proofSummary.unscored.length}`,
    `Recent progress entries: ${progress.length}`,
    '',
    `Next action: ${nextAction}`,
    '',
    'Blockers:',
    blockers.length ? blockers.map((blocker) => `- ${blocker}`).join('\n') : '- None detected.',
    '',
    'Active specs:',
    activeSpecs.length ? activeSpecs.map((spec) => `- ${spec}`).join('\n') : 'No active specs found.',
    '',
  ].join('\n'));
}

function score(options) {
  const specPath = options._[0];
  if (!specPath) {
    return fail('Usage: dot-ai score <spec-path>\n');
  }
  if (!fs.existsSync(specPath)) {
    return fail(`Spec not found: ${specPath}\n`);
  }

  const content = fs.readFileSync(specPath, 'utf8');
  const placeholderFindings = unresolvedPlaceholders(content);
  const dimensions = scoreSpec(content);
  const total = Object.values(dimensions).reduce((sum, value) => sum + value, 0);
  const readiness = placeholderFindings.length
    ? 'Not ready: unresolved template placeholders'
    : readinessFor(total);
  const body = [
    `Score: ${total}/16`,
    readiness,
    ...(placeholderFindings.length ? ['', `Unresolved template placeholders: ${placeholderFindings.join(', ')}`] : []),
    '',
    ...Object.entries(dimensions).map(([name, value]) => `- ${name}: ${value}/2`),
    '',
  ].join('\n');

  if (total >= 14 && placeholderFindings.length === 0) {
    return ok(body);
  }
  return fail(body);
}

function share(options) {
  const root = resolveRoot(options);
  const manifestPath = path.join(root, '.ai/manifest.json');
  const projectName = fs.existsSync(manifestPath)
    ? readJson(manifestPath).projectName
    : path.basename(root);
  const activeSpecs = listMarkdown(path.join(root, '.ai/specs/active'));
  const reportPath = path.join(root, '.ai/build-report.md');
  writeFileOnce(reportPath, buildReportTemplate(projectName, activeSpecs), true);
  return ok('Created .ai/build-report.md\n');
}

function prove(options) {
  const scenarioName = options._[0];
  if (scenarioName === 'auto') {
    return autoProof(options);
  }
  if (scenarioName === 'score') {
    return scoreProofRun(options);
  }
  if (scenarioName === 'run') {
    return runProofCommand(options);
  }

  if (!scenarioName) {
    return fail('Usage: dot-ai prove <scenario> --baseline <ref> --candidate <ref> --out <dir>\n');
  }

  const root = resolveRoot(options);
  const scenariosRoot = path.resolve(options['scenarios-dir'] || path.join(__dirname, '..', '..', 'scenarios'));
  const scenarioDir = path.join(scenariosRoot, scenarioName);
  const outDir = path.resolve(root, options.out || path.join('proof-runs', scenarioName));
  const scenario = loadProofScenario(scenarioDir, scenarioName);

  if (scenario.error) {
    return fail(scenario.error);
  }

  const refs = {
    baseline: options.baseline || 'baseline',
    candidate: options.candidate || 'candidate',
  };
  const verdict = createProofVerdict(scenarioName, refs, scenario.acceptance, scenario.rubric);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'prompt.md'), scenario.prompt);
  fs.writeFileSync(path.join(outDir, 'acceptance.md'), scenario.acceptanceMarkdown);
  fs.writeFileSync(path.join(outDir, 'rubric.json'), `${JSON.stringify(scenario.rubric, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, 'verdict.json'), `${JSON.stringify(verdict, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, 'build-report.md'), proofBuildReport(verdict, scenario.prompt));

  return ok(`Created proof run: ${outDir}\n`);
}

function autoProof(options) {
  const scenarioName = options._[1];
  const command = options.command;
  const baselineDirArg = options['baseline-dir'];
  const candidateDirArg = options['candidate-dir'];

  if (!scenarioName || !command || !baselineDirArg || !candidateDirArg) {
    return fail('Usage: dot-ai prove auto <scenario> --baseline-dir <dir> --candidate-dir <dir> --command <command> --out <dir>\n');
  }

  const root = resolveRoot(options);
  const baselineDir = path.resolve(root, baselineDirArg);
  const candidateDir = path.resolve(root, candidateDirArg);
  for (const [label, dirPath] of [
    ['baseline', baselineDir],
    ['candidate', candidateDir],
  ]) {
    if (!fs.existsSync(dirPath)) {
      return fail(`Missing ${label} directory: ${dirPath}\n`);
    }
  }

  const scenariosRoot = path.resolve(options['scenarios-dir'] || path.join(__dirname, '..', '..', 'scenarios'));
  const scenarioDir = path.join(scenariosRoot, scenarioName);
  const outDir = path.resolve(root, options.out || path.join('proof-runs', scenarioName));
  const scenario = loadProofScenario(scenarioDir, scenarioName);

  if (scenario.error) {
    return fail(scenario.error);
  }

  const refs = {
    baseline: options.baseline || 'baseline',
    candidate: options.candidate || 'candidate',
  };
  const verdictPath = path.join(outDir, 'verdict.json');
  const verdict = fs.existsSync(verdictPath)
    ? readJson(verdictPath)
    : createProofVerdict(scenarioName, refs, scenario.acceptance, scenario.rubric);
  const preservedCommands = Array.isArray(verdict.commands)
    ? verdict.commands.filter((entry) => !['baseline', 'candidate'].includes(entry.ref) && !/^Record .* command/.test(entry.command || ''))
    : [];
  verdict.commands = [
    ...preservedCommands,
    captureCommandEvidence(command, 'baseline', baselineDir),
    captureCommandEvidence(command, 'candidate', candidateDir),
  ];

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'prompt.md'), scenario.prompt);
  fs.writeFileSync(path.join(outDir, 'acceptance.md'), scenario.acceptanceMarkdown);
  fs.writeFileSync(path.join(outDir, 'rubric.json'), `${JSON.stringify(scenario.rubric, null, 2)}\n`);
  fs.writeFileSync(verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);
  fs.writeFileSync(path.join(outDir, 'build-report.md'), proofBuildReport(verdict, scenario.prompt));

  const lines = [
    `Created proof run: ${outDir}`,
    `Recorded baseline command: ${verdict.commands[0].status}`,
    `Recorded candidate command: ${verdict.commands[1].status}`,
    '',
  ].join('\n');

  if (verdict.commands.some((entry) => entry.status === 'fail')) {
    return fail(lines);
  }
  return ok(lines);
}

function runProofCommand(options) {
  const runDirArg = options._[1];
  const command = options.command;
  const ref = options.ref || 'candidate';

  if (!runDirArg || !command) {
    return fail('Usage: dot-ai prove run <proof-run-dir> --ref <baseline|candidate> --command <command>\n');
  }

  const root = resolveRoot(options);
  const runDir = path.resolve(root, runDirArg);
  const verdictPath = path.join(runDir, 'verdict.json');
  if (!fs.existsSync(verdictPath)) {
    return fail(`Missing proof run verdict: ${verdictPath}\n`);
  }

  let verdict;
  try {
    verdict = readJson(verdictPath);
  } catch (error) {
    return fail(`Invalid proof run verdict: ${error.message}\n`);
  }

  const entry = captureCommandEvidence(command, ref, options.cwd ? path.resolve(root, options.cwd) : root);

  verdict.commands = Array.isArray(verdict.commands)
    ? [...verdict.commands.filter((item) => !/^Record .* command/.test(item.command)), entry]
    : [entry];
  fs.writeFileSync(verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);

  if (entry.exitCode === 0) {
    return ok(`Recorded proof command: ${command}\n`);
  }
  return fail(`Proof command failed (${entry.exitCode}): ${command}\n`);
}

function scoreProofRun(options) {
  const runDirArg = options._[1];
  if (!runDirArg) {
    return fail('Usage: dot-ai prove score <proof-run-dir>\n');
  }

  const root = resolveRoot(options);
  const runDir = path.resolve(root, runDirArg);
  const verdictPath = path.join(runDir, 'verdict.json');
  const promptPath = path.join(runDir, 'prompt.md');

  if (!fs.existsSync(verdictPath)) {
    return fail(`Missing proof run verdict: ${verdictPath}\n`);
  }

  let verdict;
  try {
    verdict = readJson(verdictPath);
  } catch (error) {
    return fail(`Invalid proof run verdict: ${error.message}\n`);
  }

  const findings = incompleteProofFindings(verdict);
  if (findings.length > 0) {
    return fail(['Unscored proof run:', ...findings.map((finding) => `- ${finding}`), ''].join('\n'));
  }

  const scored = applyProofScores(verdict);
  const prompt = fs.existsSync(promptPath) ? fs.readFileSync(promptPath, 'utf8') : '';
  fs.writeFileSync(verdictPath, `${JSON.stringify(scored, null, 2)}\n`);
  fs.writeFileSync(path.join(runDir, 'build-report.md'), proofBuildReport(scored, prompt));

  return ok([
    `Scored proof run: ${runDir}`,
    `Final product outcome: candidate ${scored.scores.finalOutcome.candidateTotal}/${scored.scores.finalOutcome.max} (${formatDelta(scored.scores.finalOutcome.candidateDelta)})`,
    '',
  ].join('\n'));
}

function story(options) {
  const action = options._[0];

  switch (action) {
    case 'create':
      return createStory(options);
    case 'validate':
      return validateStoryCommand(options);
    case 'done':
      return completeStory(options);
    case 'next':
      return nextStory(options);
    default:
      return fail('Usage: dot-ai story <create|validate|done|next>\n');
  }
}

function createStory(options) {
  const slug = options._[1];
  if (!slug) {
    return fail('Usage: dot-ai story create <slug> --title <title> --spec <spec-path> --acceptance <criterion>\n');
  }

  const root = resolveRoot(options);
  const title = options.title || titleize(slug);
  const spec = options.spec || '.ai/specs/active/unknown.md';
  const acceptance = options.acceptance || 'GIVEN context, WHEN the story is implemented, THEN the acceptance criterion is satisfied.';
  const storyPath = path.join(root, '.ai/stories/ready', `${slug}.md`);
  const now = new Date().toISOString().slice(0, 10);
  const content = [
    `# Story: ${title}`,
    '',
    '**Status:** ready',
    `**Spec:** ${spec}`,
    `**Created:** ${now}`,
    `**Last updated:** ${now}`,
    '',
    '## Goal',
    `${title} is implemented as one focused slice of the referenced spec.`,
    '',
    '## Acceptance criteria',
    `- [ ] ${acceptance}`,
    '',
    '## Implementation notes',
    '- Keep this story small enough for one implementation session.',
    '- Update tests and proof evidence when the story is completed.',
    '',
    '## Verification',
    '- Test command:',
    '- Build command:',
    '',
    '## Evidence',
    '- PR:',
    '- Screenshots:',
    '- Notes:',
    '',
  ].join('\n');

  writeFileOnce(storyPath, content, Boolean(options.force));
  return ok(`Created story: ${storyPath}\n`);
}

function validateStoryCommand(options) {
  const storyPathArg = options._[1];
  if (!storyPathArg) {
    return fail('Usage: dot-ai story validate <story-path>\n');
  }

  const storyPath = path.resolve(storyPathArg);
  if (!fs.existsSync(storyPath)) {
    return fail(`Story not found: ${storyPath}\n`);
  }

  const findings = validateStoryContent(fs.readFileSync(storyPath, 'utf8'));
  if (findings.length > 0) {
    return fail(`${findings.join('\n')}\n`);
  }

  return ok(`Story ready for implementation: ${storyPath}\n`);
}

function completeStory(options) {
  const storyPathArg = options._[1];
  if (!storyPathArg) {
    return fail('Usage: dot-ai story done <story-path>\n');
  }

  const root = resolveRoot(options);
  const storyPath = path.resolve(storyPathArg);
  if (!fs.existsSync(storyPath)) {
    return fail(`Story not found: ${storyPath}\n`);
  }

  const content = fs.readFileSync(storyPath, 'utf8');
  const findings = validateStoryContent(content);
  if (findings.length > 0) {
    return fail(`Story is not complete enough to mark done:\n${findings.join('\n')}\n`);
  }

  const updated = content
    .replace(/\*\*Status:\*\*\s*[^\n]+/, '**Status:** done')
    .replace(/\*\*Last updated:\*\*\s*[^\n]+/, `**Last updated:** ${new Date().toISOString().slice(0, 10)}`);
  const donePath = path.join(root, '.ai/stories/done', path.basename(storyPath));
  fs.mkdirSync(path.dirname(donePath), { recursive: true });
  fs.writeFileSync(donePath, updated);
  if (path.resolve(donePath) !== storyPath) {
    fs.rmSync(storyPath);
  }

  return ok(`Completed story: ${donePath}\n`);
}

function nextStory(options) {
  const root = resolveRoot(options);
  const storySummary = summarizeStories(root);
  for (const state of ['in-progress', 'review', 'ready']) {
    const fileName = storySummary.files[state][0];
    if (fileName) {
      const storyPath = path.join(root, '.ai/stories', state, fileName);
      return ok([
        `Next story: ${fileName}`,
        `Status: ${state}`,
        `Path: ${storyPath}`,
        '',
      ].join('\n'));
    }
  }

  const activeSpec = listMarkdown(path.join(root, '.ai/specs/active'))[0];
  if (activeSpec) {
    return ok(`No stories found. Next action: create a story from active spec ${activeSpec}\n`);
  }
  return ok('No stories found. Next action: use .ai/skills/interview.md to create an active spec.\n');
}

function installPack(options) {
  const packName = options._[0];
  const root = resolveRoot(options);
  if (!packName || !PACKS[packName]) {
    return fail(`Unknown pack. Available packs: ${Object.keys(PACKS).join(', ')}\n`);
  }
  const packPath = path.join(root, '.ai/packs', `${packName}.md`);
  writeFileOnce(packPath, `# Pack: ${packName}\n\n${PACKS[packName]}\n`, true);
  return ok(`Installed .ai pack: ${packName}\n`);
}

function scoreSpec(content) {
  const has = (pattern) => pattern.test(content);
  const countMatches = (pattern) => (content.match(pattern) || []).length;
  const sectionCount = countMatches(/^## /gm);
  const shallCount = countMatches(/\bSHALL\b/g);
  const gwtCount = countMatches(/\bGIVEN\b[\s\S]*?\bWHEN\b[\s\S]*?\bTHEN\b/g);

  return {
    clarity: has(/^## Problem/m) && has(/^## Solution/m) && content.length > 600 ? 2 : sectionCount >= 3 ? 1 : 0,
    completeness: shallCount >= 2 && has(/Non-functional/i) ? 2 : shallCount >= 1 ? 1 : 0,
    testability: gwtCount >= 2 ? 2 : gwtCount >= 1 || has(/Acceptance criteria/i) ? 1 : 0,
    scoping: has(/Out of scope/i) && content.split(/Out of scope/i)[1]?.trim().length > 20 ? 2 : has(/Out of scope/i) ? 1 : 0,
    'design integration': has(/UI\/UX requirements/i) && has(/No UI|DESIGN\.md|Markdown|loading|empty|error/i) ? 2 : has(/UI\/UX/i) ? 1 : 0,
    dependencies: has(/^## Dependencies/m) && content.split(/^## Dependencies/m)[1]?.trim().length > 20 ? 2 : has(/^## Dependencies/m) ? 1 : 0,
    'architecture alignment': has(/Technical notes/i) || has(/STACK\.md|decisions\//i) ? 2 : 0,
    'sizing accuracy': has(/\*\*Complexity:\*\*\s*(small|medium|large|xl)(\s|$)/i) ? 2 : 0,
  };
}

function unresolvedPlaceholders(content) {
  const findings = [];
  if (/\{[^}]+\}/.test(content)) {
    findings.push('braced placeholders');
  }
  if (/draft\s*\|\s*active|small\s*\|\s*medium|p0-critical\s*\|\s*p1-high/i.test(content)) {
    findings.push('unselected option lists');
  }
  if (/\bSHALL\.\.\.|GIVEN \.\.\.|WHEN \.\.\.|THEN \.\.\./.test(content)) {
    findings.push('example acceptance text');
  }
  return findings;
}

function validateStoryContent(content) {
  const findings = [];

  if (!/^# Story:\s+\S+/m.test(content)) {
    findings.push('Missing story title');
  }
  if (!/\*\*Status:\*\*\s*(ready|in-progress|review|done)\b/i.test(content)) {
    findings.push('Missing valid status');
  }
  if (!/\*\*Spec:\*\*\s*\S+/.test(content)) {
    findings.push('Missing spec reference');
  }
  if (!/^## Acceptance criteria/m.test(content) || !/^- \[[ xX]\]\s+\S+/m.test(content)) {
    findings.push('Missing acceptance criteria');
  }
  if (!/^## Implementation notes/m.test(content)) {
    findings.push('Missing implementation notes');
  }
  if (unresolvedPlaceholders(content).length > 0) {
    findings.push('Story still contains template placeholders');
  }

  return findings;
}

function inspectProject(root) {
  const failures = [];
  const manifestPath = path.join(root, '.ai/manifest.json');

  if (!fs.existsSync(manifestPath)) {
    return { manifest: null, failures: ['Missing .ai/manifest.json'] };
  }

  let manifest;
  try {
    manifest = readJson(manifestPath);
  } catch (error) {
    return { manifest: null, failures: [`Invalid .ai/manifest.json: ${error.message}`] };
  }

  for (const field of ['schemaVersion', 'projectName', 'createdAt', 'primitives', 'adapters', 'guards', 'activeWork']) {
    if (manifest[field] === undefined) {
      failures.push(`Missing manifest field: ${field}`);
    }
  }

  for (const file of CORE_FILES) {
    if (!fs.existsSync(path.join(root, file))) {
      failures.push(`Missing ${file}`);
    }
  }

  for (const dir of CORE_DIRS) {
    if (!fs.existsSync(path.join(root, dir))) {
      failures.push(`Missing ${dir}`);
    }
  }

  return { manifest, failures };
}

function summarizeStories(root) {
  const files = {
    ready: storyFiles(root, 'ready'),
    'in-progress': storyFiles(root, 'in-progress'),
    review: storyFiles(root, 'review'),
    done: storyFiles(root, 'done'),
  };
  return {
    files,
    counts: Object.fromEntries(Object.entries(files).map(([state, stateFiles]) => [state, stateFiles.length])),
  };
}

function storyFiles(root, state) {
  return listMarkdown(path.join(root, '.ai/stories', state)).filter((fileName) => !fileName.startsWith('_'));
}

function summarizeProofRuns(root) {
  const proofRoot = path.join(root, 'proof-runs');
  const summary = { total: 0, scored: [], unscored: [], invalid: [] };
  if (!fs.existsSync(proofRoot)) {
    return summary;
  }

  for (const name of fs.readdirSync(proofRoot).sort()) {
    const verdictPath = path.join(proofRoot, name, 'verdict.json');
    if (!fs.existsSync(verdictPath)) {
      continue;
    }
    summary.total += 1;
    try {
      const verdict = readJson(verdictPath);
      if (incompleteProofFindings(verdict).length > 0) {
        summary.unscored.push(name);
      } else {
        summary.scored.push(name);
      }
    } catch {
      summary.invalid.push(name);
    }
  }

  return summary;
}

function recommendNextAction(activeSpecs, storySummary) {
  if (storySummary.files['in-progress'][0]) {
    return `Finish in-progress story ${storySummary.files['in-progress'][0]}`;
  }
  if (storySummary.files.review[0]) {
    return `Review story ${storySummary.files.review[0]}`;
  }
  if (storySummary.files.ready[0]) {
    return `Implement ready story ${storySummary.files.ready[0]}`;
  }
  if (activeSpecs[0]) {
    return `Create an implementation story or plan for active spec ${activeSpecs[0]}`;
  }
  return 'Use .ai/skills/interview.md to turn the next rough idea into an active spec.';
}

function captureCommandEvidence(command, ref, cwd) {
  const startedAt = new Date();
  const result = spawnSync(command, {
    cwd,
    encoding: 'utf8',
    shell: true,
  });
  const durationMs = Date.now() - startedAt.getTime();
  const exitCode = typeof result.status === 'number' ? result.status : 1;
  return {
    ref,
    command,
    cwd,
    status: exitCode === 0 ? 'pass' : 'fail',
    exitCode,
    durationMs,
    startedAt: startedAt.toISOString(),
    stdout: trimCommandOutput(result.stdout || ''),
    stderr: trimCommandOutput(result.stderr || result.error?.message || ''),
  };
}

function trimCommandOutput(output) {
  return output.length > 4000 ? `${output.slice(0, 4000)}\n[truncated]` : output;
}

function titleize(slug) {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ');
}

function loadProofScenario(scenarioDir, scenarioName) {
  if (!fs.existsSync(scenarioDir)) {
    return { error: `Unknown proof scenario: ${scenarioName}\n` };
  }

  const promptPath = path.join(scenarioDir, 'prompt.md');
  const acceptancePath = path.join(scenarioDir, 'acceptance.md');
  const rubricPath = path.join(scenarioDir, 'rubric.json');
  const required = [
    ['prompt.md', promptPath],
    ['acceptance.md', acceptancePath],
    ['rubric.json', rubricPath],
  ];

  for (const [fileName, filePath] of required) {
    if (!fs.existsSync(filePath)) {
      return { error: `Missing scenarios/${scenarioName}/${fileName}\n` };
    }
  }

  let rubric;
  try {
    rubric = readJson(rubricPath);
  } catch (error) {
    return { error: `Invalid scenarios/${scenarioName}/rubric.json: ${error.message}\n` };
  }

  if (!Array.isArray(rubric.dimensions) || rubric.dimensions.length === 0) {
    return { error: `Invalid scenarios/${scenarioName}/rubric.json: dimensions must be a non-empty array\n` };
  }

  const acceptanceMarkdown = fs.readFileSync(acceptancePath, 'utf8');
  const acceptance = parseAcceptanceCriteria(acceptanceMarkdown);
  if (acceptance.length === 0) {
    return { error: `Invalid scenarios/${scenarioName}/acceptance.md: include at least one markdown checklist item\n` };
  }

  return {
    prompt: fs.readFileSync(promptPath, 'utf8'),
    acceptanceMarkdown,
    acceptance,
    rubric,
  };
}

function parseAcceptanceCriteria(markdown) {
  return markdown
    .split(/\r?\n/)
    .map((line) => line.match(/^- \[[ xX]\]\s+(.+)$/))
    .filter(Boolean)
    .map((match, index) => ({
      id: `A${index + 1}`,
      text: match[1].trim(),
      baseline: PROOF_STATUS,
      candidate: PROOF_STATUS,
      notes: '',
    }));
}

function createProofVerdict(scenarioName, refs, acceptance, rubric) {
  const dimensions = rubric.dimensions.map((dimension) => ({
    id: dimension.id,
    label: dimension.label,
    group: dimension.group || 'finalOutcome',
    weight: Number(dimension.weight || 1),
    baseline: PROOF_STATUS,
    candidate: PROOF_STATUS,
    notes: '',
  }));
  const readinessDimensions = dimensions.filter((dimension) => dimension.group === 'readiness');
  const outcomeDimensions = dimensions.filter((dimension) => dimension.group !== 'readiness');

  return {
    formatVersion: 'proof-run-0.1.0',
    scenario: scenarioName,
    createdAt: new Date().toISOString(),
    refs,
    commands: [
      { ref: refs.baseline, command: 'Record baseline build, test, and smoke commands here.', status: 'not-run' },
      { ref: refs.candidate, command: 'Record candidate build, test, and smoke commands here.', status: 'not-run' },
    ],
    acceptance,
    scores: {
      readiness: {
        label: 'Spec/artifact readiness',
        total: 0,
        max: sumWeights(readinessDimensions),
        dimensions: readinessDimensions,
      },
      finalOutcome: {
        label: 'Final product outcome',
        total: 0,
        max: sumWeights(outcomeDimensions),
        dimensions: outcomeDimensions,
      },
    },
    rework: {
      baseline: [],
      candidate: [],
    },
    artifacts: {
      prompt: 'prompt.md',
      acceptance: 'acceptance.md',
      rubric: 'rubric.json',
      screenshots: [],
      pullRequests: [],
    },
    verdict: 'Unscored proof run. Complete the same build under each ref, record evidence, then publish only if the outcome supports the claim.',
  };
}

function sumWeights(dimensions) {
  return dimensions.reduce((sum, dimension) => sum + dimension.weight, 0);
}

function proofBuildReport(verdict, prompt) {
  const acceptance = verdict.acceptance.map((item) => `- [ ] ${item.id}: ${item.text}`).join('\n');
  const readiness = formatProofScore(verdict.scores.readiness);
  const finalOutcome = formatProofScore(verdict.scores.finalOutcome);

  return `# Proof Run: ${verdict.scenario}\n\n## Claim\nThis proof run tests whether the candidate .ai workflow produces a better product outcome than the baseline when both start from the same rough prompt.\n\n## Refs\n- Baseline: ${verdict.refs.baseline}\n- Candidate: ${verdict.refs.candidate}\n\n## Original Prompt\n${prompt.trim()}\n\n## Acceptance Criteria\n${acceptance}\n\n## Scores\n- Spec/artifact readiness: ${readiness}\n- Final product outcome: ${finalOutcome}\n\n## Evidence\n- Commands: record build, test, lint, and smoke commands in verdict.json.\n- Screenshots: add public-safe screenshots and list them in verdict.json.\n- Rework: record clarification loops, failed attempts, and manual fixes in verdict.json.\n\n## Verdict\n${verdict.verdict}\n`;
}

function incompleteProofFindings(verdict) {
  const findings = [];
  const completeStatuses = new Set(['pass', 'partial', 'fail']);

  if (!Array.isArray(verdict.acceptance)) {
    findings.push('Missing acceptance array');
  } else {
    for (const item of verdict.acceptance) {
      for (const side of ['baseline', 'candidate']) {
        if (!completeStatuses.has(item[side])) {
          findings.push(`acceptance ${item.id} ${side} is ${item[side] || PROOF_STATUS}`);
        }
      }
    }
  }

  for (const groupName of ['readiness', 'finalOutcome']) {
    const group = verdict.scores?.[groupName];
    if (!Array.isArray(group?.dimensions)) {
      findings.push(`Missing scores.${groupName} dimensions`);
      continue;
    }

    for (const dimension of group.dimensions) {
      for (const side of ['baseline', 'candidate']) {
        if (!Number.isFinite(dimension[side]) || dimension[side] < 0 || dimension[side] > dimension.weight) {
          findings.push(`${groupName} ${dimension.id} ${side} is ${dimension[side] || PROOF_STATUS}`);
        }
      }
    }
  }

  if (!Array.isArray(verdict.commands)) {
    findings.push('Missing commands array');
  } else {
    for (const [index, command] of verdict.commands.entries()) {
      if (!command.status || command.status === 'not-run') {
        findings.push(`command ${index + 1} is ${command.status || 'missing'}`);
      }
    }
  }

  if (!verdict.verdict || /^Unscored proof run/i.test(verdict.verdict)) {
    findings.push('verdict is unscored');
  }

  return findings;
}

function applyProofScores(verdict) {
  const scored = { ...verdict };
  scored.acceptanceSummary = {
    baseline: summarizeAcceptance(verdict.acceptance, 'baseline'),
    candidate: summarizeAcceptance(verdict.acceptance, 'candidate'),
  };
  scored.scores = {
    ...verdict.scores,
    readiness: scoreProofGroup(verdict.scores.readiness),
    finalOutcome: scoreProofGroup(verdict.scores.finalOutcome),
  };
  scored.scoredAt = new Date().toISOString();
  return scored;
}

function summarizeAcceptance(acceptance, side) {
  return acceptance.reduce((summary, item) => {
    summary[item[side]] = (summary[item[side]] || 0) + 1;
    return summary;
  }, { pass: 0, partial: 0, fail: 0 });
}

function scoreProofGroup(group) {
  const baselineTotal = sumSide(group.dimensions, 'baseline');
  const candidateTotal = sumSide(group.dimensions, 'candidate');
  return {
    ...group,
    baselineTotal,
    candidateTotal,
    candidateDelta: candidateTotal - baselineTotal,
    total: candidateTotal,
  };
}

function sumSide(dimensions, side) {
  return dimensions.reduce((sum, dimension) => sum + dimension[side], 0);
}

function formatProofScore(group) {
  if (Number.isFinite(group.baselineTotal) && Number.isFinite(group.candidateTotal)) {
    return `baseline ${group.baselineTotal}/${group.max}, candidate ${group.candidateTotal}/${group.max}, Candidate delta: ${formatDelta(group.candidateDelta)}`;
  }
  return `${group.total}/${group.max}`;
}

function formatDelta(value) {
  return `${value >= 0 ? '+' : ''}${value}`;
}

function readinessFor(scoreValue) {
  if (scoreValue >= 14) return 'Ready for active work';
  if (scoreValue >= 10) return 'Almost ready';
  if (scoreValue >= 6) return 'Needs significant work';
  return 'Rethink from scratch';
}

function listMarkdown(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

function ok(stdout) {
  return { code: 0, stdout, stderr: '' };
}

function fail(stderr) {
  return { code: 1, stdout: '', stderr };
}

async function run(argv) {
  const { command, options } = parseArgs(argv);

  switch (command) {
    case 'init':
      return init(options);
    case 'doctor':
    case 'conformance':
      return doctor(options);
    case 'status':
      return status(options);
    case 'score':
      return score(options);
    case 'share':
      return share(options);
    case 'prove':
      return prove(options);
    case 'story':
      return story(options);
    case 'pack':
      if (options._[0] === 'install') {
        options._.shift();
        return installPack(options);
      }
      return fail('Usage: dot-ai pack install <pack>\n');
    case 'help':
    case undefined:
      return ok([
        'Usage: dot-ai <command>',
        '',
        'Commands:',
        '  init                         Create a .ai directory',
        '  doctor | conformance         Validate the .ai project shape',
        '  status                       Show active specs, stories, proof runs, blockers, and next action',
        '  score <spec>                 Score spec/artifact readiness',
        '  story create|validate|done|next',
        '  prove <scenario>             Create a proof run',
        '  prove run <dir>              Record one command as proof evidence',
        '  prove auto <scenario>        Record the same command against baseline and candidate dirs',
        '  prove score <dir>            Score a completed proof run',
        '  share                        Generate .ai/build-report.md',
        '  pack install <pack>          Install a workflow pack',
        '',
      ].join('\n'));
    default:
      return fail(`Unknown command: ${command}\n`);
  }
}

if (require.main === module) {
  run(process.argv.slice(2)).then((result) => {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exitCode = result.code;
  });
}

module.exports = {
  run,
  scoreSpec,
  unresolvedPlaceholders,
};
