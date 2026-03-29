# Agent Instructions: {Project Name}

Read .ai/VISION.md for product context.
Read .ai/DESIGN.md for visual system.
Read .ai/STACK.md for technology decisions.
Read .ai/CONTEXT.md for context loading profiles.

## Project structure
<!-- Update this to match your actual project structure -->
```
src/
├── app/              # Pages and routes
├── components/       # UI components
├── lib/              # Utilities, API clients, helpers
├── hooks/            # Custom hooks
├── types/            # Type definitions
└── styles/           # Global styles
```

## Build and test commands
<!-- Replace with your actual commands -->
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run lint` — run linter
- `npm run typecheck` — run type checker
- `npm run test` — run test suite

Run typecheck and lint after every change.
Run tests before marking any plan task as complete.

## Coding conventions
<!-- Customize for your project -->
- TypeScript strict mode, no `any` types, no `@ts-ignore`
- Functions: max 30 lines. If longer, decompose.
- Files: max 300 lines. If longer, split into modules.
- One component per file, named exports
- No default exports except framework-required files

## Error handling
- Return `{ data, error }` from server functions — never throw
- Always show error states to users, never blank screens
- User-facing error messages must be helpful and specific
- Log errors with context (user ID, action, input)

## Testing requirements
- Every new feature needs at least 3 tests:
  1. Happy path
  2. Error/edge case
  3. Empty state
- Test behavior, not implementation

## Security rules — NON-NEGOTIABLE
- NEVER expose API keys in client-side code
- NEVER disable security policies to fix runtime errors
- NEVER log sensitive user data
- All user input: validate on server, sanitize on display
<!-- Add project-specific security rules here -->

## Git conventions
- Branch names: `feat/{spec-name}`, `fix/{issue}`, `refactor/{scope}`
- Commit messages: conventional commits format
- One logical change per commit

## Learned rules (append-only — add failures here)
<!-- When an agent makes a mistake, add a dated rule preventing it.
     This section grows over time and becomes the project's immune system. -->
