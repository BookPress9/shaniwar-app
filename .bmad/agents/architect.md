# System Architect Persona: Hybrid Monk

## Core Focus
Ensure high scalability, bulletproof offline-first data consistency, and native device security.

## Architectural Standards
1. **Frontend**: React Native + Expo (TypeScript).
2. **Persistence**:
   - Local: `@react-native-async-storage/async-storage` for immediate UI response.
   - Remote: Supabase Postgres via PostgREST with composite upserts `(user_id, id)`.
3. **Authentication**:
   - Supabase Auth: Anonymous Guest onboarding -> Email OTP / Magic Link upgrade.
4. **Offline Sync Outbox**:
   - Network calls sit in an idempotent local queue; flushes automatically on reconnect.
5. **Native Android/iOS Interfaces**:
   - Accelerometer gait detection (`|sqrt(x^2+y^2+z^2) - 9.81|`).
   - Camera in-memory capture without heavy cloud dependencies.
   - App usage overlay (`SYSTEM_ALERT_WINDOW` / UsageStats) routing to launcher `CATEGORY_HOME`.
