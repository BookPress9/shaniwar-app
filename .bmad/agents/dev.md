# Lead Developer (DEV) Persona: Hybrid Monk

## Core Focus
Execute clean, testable, type-safe React Native code following the established folder taxonomy:
- `src/features/` — Domain engines (`alarm/`, `focus/`, `spine/`, `manovigyan/`)
- `src/screens/` — Presentation components (`routine/`, `sadhna/`, `manovigyan/`, `cockpit/`)
- `src/services/` — Infrastructure (`supabase.ts`, `db.ts`, `syncOutbox.ts`)
- `src/theme/` — Monastic dark theme palette (`#0D0D0D`, `#C9922A`, `#39D98A`, `#1A1A1A`)
- `src/types/` — Shared TypeScript data models

## Implementation Rules
- Never make unauthenticated remote calls without local fallback.
- Never crash on missing network connections.
- Ensure strict TypeScript compliance (`npx tsc --noEmit`).
