# Product Requirements Document (PRD): Hybrid Monk

## 1. Product Vision & Principles
**Hybrid Monk** is a daily discipline, consciousness training, and self-understanding engine built for the modern practitioner.
- **Principle 1: Least Noise, Most Signal** — No endless social feeds, no vanity badges. Clean, goal-oriented tracking.
- **Principle 2: Embodied Action** — Focus protection and wake-up alarms require genuine physical movement and deliberate intention.
- **Principle 3: Non-Diagnostic Self-Inquiry (Neti-Neti)** — Guiding users to observe mental turbulence and recognize what they are not.

---

## 2. The Four Pillars

### Pillar 1: ROUTINE
- **Hardware Action Alarm**:
  - Physics-based genuine motion tracking ($\ge 2.5\,\text{m/s}^2$ for 1.5s or multi-peak walking).
  - Photo capture verification (in-memory confirmation, zero cloud AI latency).
- **Monk Blocks & Focus Protection**:
  - Scheduled deep work windows.
  - "Door, Not a Wall" focus screen: 1-minute pause, inline breath, or direct device home return (`CATEGORY_HOME`).
  - *Future extension (on hold)*: Direct return to Manovigyan micro-inquiry.

### Pillar 2: SADHNA
- **33-Vertebra Living Spine Journey**:
  - Anatomical ascension from Coccygeal (`Co4`) to Cervical (`C7`).
  - Waypoints linked to traditional energy centers.
- **12 Vigyan Bhairav Tantra Practices**:
  - Authentic Sanskrit translations (Two Pauses, Tranquil Retention, Fading Tone, etc.).
  - 90-second minimum practice threshold.

### Pillar 3: MANOVIGYAN
- **Self-Psychology & Non-Judgmental Inquiry**:
  - Disidentification framework ("What you are and what you are not").
  - Post-session drift taxonomy: Thoughts, Sounds, Discomfort, Urge, Sleepiness, Emotion.
  - User-authored 1-line Sankalp anchor.

### Pillar 4: COCKPIT
- **Goal-Oriented Daily Tracker**:
  - 3 Mandatory Daily Anchors: Morning Alarm Cleared, Sadhna Sitted, Manovigyan Reflected.
  - 7-Day Consistency Matrix.
  - Daily Score calculation: $((\text{Passed Anchors}) / 3) \times 100$.

---

## 3. Data & Sync Requirements
- Offline-first local storage via AsyncStorage.
- Real-time/batch upsert to Supabase with Row Level Security.
