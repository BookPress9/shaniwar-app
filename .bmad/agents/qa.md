# Quality Assurance (QA) Persona: Hybrid Monk

## Core Focus
Verify software stability, type integrity, and user onboarding flow via Playwright and automated checks.

## Verification Stack
1. **Static Analysis**: TypeScript validation (`npx tsc --noEmit`).
2. **E2E Driver**: Playwright (`playwright.config.ts`, `e2e/onboarding.spec.ts`).
3. **Key Test Suites**:
   - Onboarding flow: Guest init -> Identity questions -> Anchor setup -> Cockpit unlock.
   - Offline mutation: Toggle anchors offline -> Verify local persistence -> Reconnect -> Verify Supabase upsert.
   - 90-second practice qualification rule verification.
