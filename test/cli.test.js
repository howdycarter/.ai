const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');
const { describe, it } = require('node:test');

const { run } = require('../src/cli');

const repoRoot = path.resolve(__dirname, '..');

function makeTempProject(name = 'dot-ai-test') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  return root;
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}

describe('dot-ai CLI', () => {
  it('initializes a project with a manifest and core folders', async () => {
    const root = makeTempProject('init');

    const result = await run(['init', '--dir', root, '--yes']);

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Initialized \.ai Standard/);
    assert.equal(fs.existsSync(path.join(root, '.ai', 'manifest.json')), true);
    assert.equal(fs.existsSync(path.join(root, '.ai', 'skills', 'help.md')), true);
    assert.equal(fs.existsSync(path.join(root, '.ai', 'stories', 'ready')), true);
    assert.equal(fs.existsSync(path.join(root, '.ai', 'stories', '_TEMPLATE.md')), true);
  });

  it('doctor reports a valid initialized project', async () => {
    const root = makeTempProject('doctor-valid');
    await run(['init', '--dir', root, '--yes']);

    const result = await run(['doctor', '--dir', root]);

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Valid \.ai project/);
  });

  it('doctor reports actionable failures for malformed projects', async () => {
    const root = makeTempProject('doctor-invalid');
    fs.mkdirSync(path.join(root, '.ai'), { recursive: true });

    const result = await run(['doctor', '--dir', root]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Missing .ai\/manifest.json/);
  });

  it('scores a complete spec and flags weak specs', async () => {
    const root = makeTempProject('score');
    const goodSpec = path.join(root, '.ai', 'specs', 'active', 'good.md');
    const weakSpec = path.join(root, '.ai', 'specs', 'draft', 'weak.md');
    writeFile(goodSpec, [
      '# Spec: Export Build Report',
      '',
      '**Status:** active',
      '**Priority:** p1-high',
      '**Complexity:** small',
      '',
      '## Problem',
      'Builders need a public proof artifact.',
      '',
      '## Solution',
      'Generate a sanitized build report from .ai artifacts.',
      '',
      '## Requirements',
      '### Functional',
      '- [ ] The system SHALL read active specs.',
      '- [ ] The system SHALL NOT include secrets.',
      '### Non-functional',
      '- **Performance:** completes in under 5 seconds for 100 files.',
      '- **Security:** redact .env values and configured private paths.',
      '- **Accessibility:** report remains readable as plain markdown.',
      '',
      '## Acceptance criteria',
      '- [ ] GIVEN a project with active specs, WHEN share runs, THEN build-report.md is created.',
      '- [ ] GIVEN a private path, WHEN share runs, THEN the path is redacted.',
      '',
      '## UI/UX requirements',
      'No UI. Markdown output must be skimmable.',
      '',
      '## Out of scope',
      'Publishing to a hosted service.',
      '',
      '## Dependencies',
      'No external dependencies.',
      '',
      '## Technical notes',
      'Use Node file APIs.',
    ].join('\n'));
    writeFile(weakSpec, '# Spec: Weak\n\n## Problem\nToo short.\n');

    const good = await run(['score', goodSpec]);
    const weak = await run(['score', weakSpec]);

    assert.equal(good.code, 0);
    assert.match(good.stdout, /Score: 16\/16/);
    assert.equal(weak.code, 1);
    assert.match(weak.stderr, /Needs significant work|Rethink from scratch/);
  });

  it('does not treat unresolved templates as implementation-ready specs', async () => {
    const root = makeTempProject('score-template');
    const templateSpec = path.join(root, '.ai', 'specs', '_TEMPLATE.md');
    writeFile(templateSpec, [
      '# Spec: {Feature Name}',
      '',
      '**Status:** draft | active | in-progress | review | completed | rejected',
      '**Priority:** p0-critical | p1-high | p2-medium | p3-low',
      '**Complexity:** small | medium | large | xl',
      '',
      '## Problem',
      "What's broken or missing, and for whom.",
      '',
      '## Solution',
      'What we are building.',
      '',
      '## Acceptance criteria',
      '- [ ] GIVEN {context}, WHEN {action}, THEN {expected result}',
    ].join('\n'));

    const result = await run(['score', templateSpec]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Unresolved template placeholders/);
  });

  it('creates a sanitized share report', async () => {
    const root = makeTempProject('share');
    await run(['init', '--dir', root, '--yes']);
    writeFile(path.join(root, '.env'), 'OPENAI_API_KEY=secret\n');
    writeFile(path.join(root, '.ai', 'specs', 'active', 'demo.md'), '# Spec: Demo\n\n## Problem\nShow proof.\n');

    const result = await run(['share', '--dir', root]);
    const report = fs.readFileSync(path.join(root, '.ai', 'build-report.md'), 'utf8');

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Created .ai\/build-report.md/);
    assert.match(report, /# Built with \.ai/);
    assert.match(report, /## Original Prompt/);
    assert.match(report, /## Acceptance Results/);
    assert.match(report, /## Verdict/);
    assert.doesNotMatch(report, /secret/);
    assert.match(report, /demo.md/);
  });

  it('creates a proof run with verdict data and a shareable build report', async () => {
    const root = makeTempProject('prove');
    const out = path.join(root, 'proof-runs', 'invoice-app');

    const result = await run([
      'prove',
      'invoice-app',
      '--baseline',
      'origin/main',
      '--candidate',
      'HEAD',
      '--out',
      out,
    ]);

    const verdict = JSON.parse(fs.readFileSync(path.join(out, 'verdict.json'), 'utf8'));
    const report = fs.readFileSync(path.join(out, 'build-report.md'), 'utf8');

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Created proof run: /);
    assert.equal(verdict.scenario, 'invoice-app');
    assert.equal(verdict.refs.baseline, 'origin/main');
    assert.equal(verdict.refs.candidate, 'HEAD');
    assert.equal(verdict.scores.readiness.label, 'Spec/artifact readiness');
    assert.equal(verdict.scores.finalOutcome.label, 'Final product outcome');
    assert.equal(verdict.acceptance.length > 0, true);
    assert.match(report, /# Proof Run: invoice-app/);
    assert.match(report, /Final product outcome/);
  });

  it('ships three canonical proof scenarios with prompts, acceptance, and rubrics', () => {
    for (const scenario of ['invoice-app', 'habit-tracker', 'bug-dashboard']) {
      const scenarioDir = path.join(repoRoot, 'scenarios', scenario);

      assert.equal(fs.existsSync(path.join(scenarioDir, 'prompt.md')), true);
      assert.equal(fs.existsSync(path.join(scenarioDir, 'acceptance.md')), true);
      assert.equal(fs.existsSync(path.join(scenarioDir, 'rubric.json')), true);
    }
  });

  it('reports malformed proof scenarios with actionable errors', async () => {
    const root = makeTempProject('prove-invalid');
    const scenariosDir = path.join(root, 'scenarios');
    writeFile(path.join(scenariosDir, 'broken-rubric', 'prompt.md'), '# Prompt\nBuild the thing.\n');
    writeFile(path.join(scenariosDir, 'broken-rubric', 'acceptance.md'), '- [ ] It works.\n');
    writeFile(path.join(scenariosDir, 'broken-rubric', 'rubric.json'), '{ bad json');
    writeFile(path.join(scenariosDir, 'missing-acceptance', 'prompt.md'), '# Prompt\nBuild the thing.\n');
    writeFile(path.join(scenariosDir, 'missing-acceptance', 'rubric.json'), '{"dimensions":[]}\n');

    const badRubric = await run(['prove', 'broken-rubric', '--scenarios-dir', scenariosDir]);
    const missingAcceptance = await run(['prove', 'missing-acceptance', '--scenarios-dir', scenariosDir]);

    assert.equal(badRubric.code, 1);
    assert.match(badRubric.stderr, /Invalid scenarios\/broken-rubric\/rubric.json/);
    assert.equal(missingAcceptance.code, 1);
    assert.match(missingAcceptance.stderr, /Missing scenarios\/missing-acceptance\/acceptance.md/);
  });

  it('refuses to score incomplete proof runs', async () => {
    const root = makeTempProject('prove-score-incomplete');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    await run(['prove', 'invoice-app', '--out', out]);

    const result = await run(['prove', 'score', out]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Unscored proof run/);
    assert.match(result.stderr, /acceptance A1/);
  });

  it('reports malformed proof verdicts with actionable scoring errors', async () => {
    const root = makeTempProject('prove-score-malformed');
    const out = path.join(root, 'proof-runs', 'broken');
    writeFile(path.join(out, 'prompt.md'), '# Prompt\nBuild something.\n');
    writeFile(path.join(out, 'verdict.json'), '{"scenario":"broken"}\n');

    const result = await run(['prove', 'score', out]);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Missing acceptance array/);
    assert.match(result.stderr, /Missing scores.readiness dimensions/);
    assert.match(result.stderr, /Missing scores.finalOutcome dimensions/);
  });

  it('scores completed proof runs and refreshes the build report', async () => {
    const root = makeTempProject('prove-score-complete');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    await run(['prove', 'invoice-app', '--baseline', 'old-ai', '--candidate', 'new-ai', '--out', out]);

    const verdictPath = path.join(out, 'verdict.json');
    const verdict = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    for (const item of verdict.acceptance) {
      item.baseline = 'partial';
      item.candidate = 'pass';
    }
    for (const group of [verdict.scores.readiness, verdict.scores.finalOutcome]) {
      for (const dimension of group.dimensions) {
        dimension.baseline = dimension.weight - 1;
        dimension.candidate = dimension.weight;
        dimension.notes = 'Candidate had clearer context and required less rework.';
      }
    }
    verdict.commands = verdict.commands.map((command) => ({ ...command, status: 'pass' }));
    verdict.verdict = 'Candidate produced a stronger result with less rework.';
    fs.writeFileSync(verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);

    const result = await run(['prove', 'score', out]);
    const scoredVerdict = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    const report = fs.readFileSync(path.join(out, 'build-report.md'), 'utf8');

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Scored proof run: /);
    assert.equal(scoredVerdict.scores.finalOutcome.baselineTotal, 12);
    assert.equal(scoredVerdict.scores.finalOutcome.candidateTotal, 16);
    assert.equal(scoredVerdict.scores.finalOutcome.candidateDelta, 4);
    assert.equal(scoredVerdict.acceptanceSummary.baseline.pass, 0);
    assert.equal(scoredVerdict.acceptanceSummary.candidate.pass, 6);
    assert.match(report, /Candidate delta: \+4/);
    assert.match(report, /Candidate produced a stronger result/);
  });

  it('creates, validates, and completes implementation stories', async () => {
    const root = makeTempProject('story');
    await run(['init', '--dir', root, '--yes']);

    const create = await run([
      'story',
      'create',
      'invoice-totals',
      '--dir',
      root,
      '--title',
      'Invoice totals',
      '--spec',
      '.ai/specs/active/invoice-app.md',
      '--acceptance',
      'GIVEN an invoice with two line items, WHEN totals render, THEN subtotal and total are correct.',
    ]);
    const storyPath = path.join(root, '.ai', 'stories', 'ready', 'invoice-totals.md');
    const storyCreated = fs.existsSync(storyPath);
    const validate = await run(['story', 'validate', storyPath]);
    const done = await run(['story', 'done', storyPath, '--dir', root]);
    const donePath = path.join(root, '.ai', 'stories', 'done', 'invoice-totals.md');
    const doneStory = fs.readFileSync(donePath, 'utf8');

    assert.equal(create.code, 0);
    assert.match(create.stdout, /Created story/);
    assert.equal(storyCreated, true);
    assert.equal(validate.code, 0);
    assert.match(validate.stdout, /Story ready for implementation/);
    assert.equal(done.code, 0);
    assert.match(done.stdout, /Completed story/);
    assert.equal(fs.existsSync(storyPath), false);
    assert.match(doneStory, /\*\*Status:\*\* done/);
  });

  it('rejects incomplete stories during validation and completion', async () => {
    const root = makeTempProject('story-invalid');
    const storyPath = path.join(root, '.ai', 'stories', 'ready', 'bad.md');
    writeFile(storyPath, '# Story: Bad\n\n**Status:** ready\n');

    const validate = await run(['story', 'validate', storyPath]);
    const done = await run(['story', 'done', storyPath, '--dir', root]);

    assert.equal(validate.code, 1);
    assert.match(validate.stderr, /Missing spec reference/);
    assert.match(validate.stderr, /Missing acceptance criteria/);
    assert.equal(done.code, 1);
    assert.match(done.stderr, /Story is not complete enough to mark done/);
  });

  it('reports actionable status with story and proof run state', async () => {
    const root = makeTempProject('status-rich');
    await run(['init', '--dir', root, '--yes']);
    writeFile(path.join(root, '.ai', 'specs', 'active', 'checkout.md'), '# Spec: Checkout\n');
    writeFile(path.join(root, '.ai', 'stories', 'ready', 'checkout-total.md'), [
      '# Story: Checkout total',
      '',
      '**Status:** ready',
      '**Spec:** .ai/specs/active/checkout.md',
      '',
      '## Acceptance criteria',
      '- [ ] GIVEN items in cart, WHEN totals render, THEN tax and total are correct.',
      '',
      '## Implementation notes',
      '- Update checkout summary.',
    ].join('\n'));
    await run(['prove', 'invoice-app', '--dir', root, '--out', path.join(root, 'proof-runs', 'invoice-app')]);

    const result = await run(['status', '--dir', root]);

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Doctor: valid/);
    assert.match(result.stdout, /Stories: ready 1, in-progress 0, review 0, done 0/);
    assert.match(result.stdout, /Proof runs: total 1, scored 0, unscored 1/);
    assert.match(result.stdout, /Next action: Implement ready story checkout-total\.md/);
    assert.match(result.stdout, /Blockers/);
    assert.match(result.stdout, /Unscored proof runs: invoice-app/);
  });

  it('selects the next story by lifecycle priority', async () => {
    const root = makeTempProject('story-next');
    await run(['init', '--dir', root, '--yes']);
    writeFile(path.join(root, '.ai', 'stories', 'ready', 'ready-story.md'), [
      '# Story: Ready story',
      '',
      '**Status:** ready',
      '**Spec:** .ai/specs/active/demo.md',
      '',
      '## Acceptance criteria',
      '- [ ] GIVEN ready work, WHEN selected, THEN it can be implemented.',
      '',
      '## Implementation notes',
      '- Ready notes.',
    ].join('\n'));
    writeFile(path.join(root, '.ai', 'stories', 'in-progress', 'active-story.md'), [
      '# Story: Active story',
      '',
      '**Status:** in-progress',
      '**Spec:** .ai/specs/active/demo.md',
      '',
      '## Acceptance criteria',
      '- [ ] GIVEN active work, WHEN selected, THEN it is finished first.',
      '',
      '## Implementation notes',
      '- Active notes.',
    ].join('\n'));

    const result = await run(['story', 'next', '--dir', root]);

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Next story: active-story\.md/);
    assert.match(result.stdout, /Status: in-progress/);
    assert.match(result.stdout, /Path: .*active-story\.md/);
  });

  it('captures baseline and candidate proof commands with prove auto', async () => {
    const root = makeTempProject('prove-auto');
    const baselineDir = path.join(root, 'baseline');
    const candidateDir = path.join(root, 'candidate');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    fs.mkdirSync(baselineDir, { recursive: true });
    fs.mkdirSync(candidateDir, { recursive: true });

    const result = await run([
      'prove',
      'auto',
      'invoice-app',
      '--dir',
      root,
      '--out',
      out,
      '--baseline-dir',
      baselineDir,
      '--candidate-dir',
      candidateDir,
      '--command',
      `${process.execPath} -e "process.stdout.write(process.cwd())"`,
    ]);
    const verdict = JSON.parse(fs.readFileSync(path.join(out, 'verdict.json'), 'utf8'));

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Created proof run/);
    assert.match(result.stdout, /Recorded baseline command/);
    assert.match(result.stdout, /Recorded candidate command/);
    assert.equal(verdict.commands.length, 2);
    assert.equal(verdict.commands[0].ref, 'baseline');
    assert.equal(verdict.commands[0].status, 'pass');
    assert.equal(verdict.commands[1].ref, 'candidate');
    assert.equal(verdict.commands[1].status, 'pass');
    assert.match(verdict.commands[0].stdout, /baseline/);
    assert.match(verdict.commands[1].stdout, /candidate/);
  });

  it('preserves existing proof verdict fields when prove auto records command evidence', async () => {
    const root = makeTempProject('prove-auto-preserve');
    const baselineDir = path.join(root, 'baseline');
    const candidateDir = path.join(root, 'candidate');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    fs.mkdirSync(baselineDir, { recursive: true });
    fs.mkdirSync(candidateDir, { recursive: true });
    await run(['prove', 'invoice-app', '--dir', root, '--out', out]);

    const verdictPath = path.join(out, 'verdict.json');
    const verdict = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));
    verdict.verdict = 'Manual product verdict should remain intact.';
    verdict.rework.candidate.push('One clarification loop.');
    fs.writeFileSync(verdictPath, `${JSON.stringify(verdict, null, 2)}\n`);

    const result = await run([
      'prove',
      'auto',
      'invoice-app',
      '--dir',
      root,
      '--out',
      out,
      '--baseline-dir',
      baselineDir,
      '--candidate-dir',
      candidateDir,
      '--command',
      `${process.execPath} -e "process.stdout.write('ok')"`,
    ]);
    const updated = JSON.parse(fs.readFileSync(verdictPath, 'utf8'));

    assert.equal(result.code, 0);
    assert.equal(updated.verdict, 'Manual product verdict should remain intact.');
    assert.deepEqual(updated.rework.candidate, ['One clarification loop.']);
    assert.equal(updated.commands.length, 2);
    assert.equal(updated.commands.every((entry) => entry.status === 'pass'), true);
  });

  it('keeps the npm package publish-ready', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));

    assert.equal(pkg.name, 'dot-ai');
    assert.equal(pkg.bin['dot-ai'], 'src/cli/index.js');
    assert.equal(pkg.repository.url, 'git+https://github.com/howdycarter/.ai.git');
    assert.equal(pkg.bugs.url, 'https://github.com/howdycarter/.ai/issues');
    assert.equal(pkg.homepage, 'https://github.com/howdycarter/.ai#readme');
    assert.deepEqual(pkg.files.sort(), [
      'LICENSE',
      'README.md',
      'docs/*.md',
      'examples/proof-apps',
      'images',
      'registry',
      'scenarios',
      'schemas',
      'setup.sh',
      'spec.ai.md',
      'src',
    ].sort());
    assert.equal(pkg.scripts.quality, 'npm test && node src/cli/index.js doctor && npm run pack:dry-run');
    assert.equal(pkg.scripts['pack:dry-run'], 'npm pack --dry-run');
  });

  it('records proof command evidence into verdict data', async () => {
    const root = makeTempProject('prove-run-command');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    await run(['prove', 'invoice-app', '--out', out]);

    const result = await run([
      'prove',
      'run',
      out,
      '--ref',
      'candidate',
      '--command',
      `${process.execPath} -e "process.stdout.write('ok')"`,
    ]);
    const verdict = JSON.parse(fs.readFileSync(path.join(out, 'verdict.json'), 'utf8'));
    const command = verdict.commands.find((entry) => entry.ref === 'candidate' && entry.command.includes('process.stdout'));

    assert.equal(result.code, 0);
    assert.match(result.stdout, /Recorded proof command/);
    assert.equal(command.status, 'pass');
    assert.equal(command.exitCode, 0);
    assert.equal(command.stdout, 'ok');
  });

  it('records failing proof command evidence without crashing', async () => {
    const root = makeTempProject('prove-run-failure');
    const out = path.join(root, 'proof-runs', 'invoice-app');
    await run(['prove', 'invoice-app', '--out', out]);

    const result = await run([
      'prove',
      'run',
      out,
      '--ref',
      'baseline',
      '--command',
      `${process.execPath} -e "process.stderr.write('bad'); process.exit(7)"`,
    ]);
    const verdict = JSON.parse(fs.readFileSync(path.join(out, 'verdict.json'), 'utf8'));
    const command = verdict.commands.find((entry) => entry.ref === 'baseline' && entry.exitCode === 7);

    assert.equal(result.code, 1);
    assert.match(result.stderr, /Proof command failed/);
    assert.equal(command.status, 'fail');
    assert.equal(command.stderr, 'bad');
  });
});
