# Release Checklist

This repository is configured to publish the reference CLI as `dot-ai`, but a
release should only happen after local quality checks and package dry-run pass.

## Local Gate

```bash
npm run quality
```

This runs:

- `npm test`
- `node src/cli/index.js doctor`
- `npm run pack:dry-run`

## GitHub Gate

The repo should have a GitHub Actions workflow that runs the same gate on every
pull request. If your GitHub token cannot push workflow files, add this workflow
manually from an account/token with `workflow` scope:

```yaml
name: Quality

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run quality
```

## npm Dry Run

```bash
npm publish --dry-run
```

Review the file list. The package should include:

- `src/`
- `schemas/`
- `scenarios/`
- `registry/`
- `setup.sh`
- `spec.ai.md`
- `README.md`
- `LICENSE`

## Publish

Only publish when:

- The repo description and README match the current primitive count.
- `npm run quality` passes.
- `npm publish --dry-run` shows the expected files.
- You are signed in as the npm owner intended to publish `dot-ai`.

Then run:

```bash
npm publish --access public
```

After publishing, update README examples from `npx github:howdycarter/.ai` to
`npx dot-ai` where appropriate.
