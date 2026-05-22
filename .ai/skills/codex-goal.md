# Skill: Codex Goal

Use this when turning a `.ai` spec, story, proof run, or explicit objective into
a persistent Codex `/goal`.

## Flow

1. Identify the source artifact: active spec, story, proof run, or operator objective.
2. Preserve the full objective. Do not shrink it to the current turn.
3. Generate a concise `/goal` prompt with constraints, evidence requirements,
   and definition of done.
4. Include a completion audit that forces Codex to prove every requirement from
   current-state evidence before marking the goal complete.
5. Store the markdown goal in `.ai/goals/active/` so future sessions can resume it.

## Rules

- The goal must be durable across turns.
- Markdown remains canonical; Codex `/goal` text is generated from the `.ai`
  goal file.
- Include exact files, commands, proof reports, screenshots, tests, or other
  evidence required to prove completion.
- Do not mark complete from intent, partial progress, or plausible success.
  Completion requires evidence.
