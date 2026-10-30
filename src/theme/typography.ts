import { Platform } from 'react-native';

/**
 * SHANIVAR FOCUSED 3-TIER TYPOGRAPHY SYSTEM (Steve Jobs Standard)
 *
 * Tier 1: THE SOUL (Sacred Serif) — Cormorant Garamond / Georgia / Serif
 *         Used for contemplative titles, sovereign axioms, koans, and Epoch names.
 * Tier 2: THE GLASS (Modern Grotesk) — Inter / SF Pro / Sans
 *         Used for interactive buttons, toggle labels, body text, and guidance.
 * Tier 3: THE INSTRUMENT (Precision Monospace) — JetBrains Mono / Menlo / Monospace
 *         Used for timestamps, frequencies (216 Hz), coordinates (Node 11 • L3), and countdowns.
 */
export const FONT_FAMILIES = {
  sacred: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'serif',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'sans-serif',
  }),
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const TYPOGRAPHY = {
  // TIER 1: SACRED SERIF
  sacredHero: {
    fontFamily: FONT_FAMILIES.sacred,
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  sacredTitle: {
    fontFamily: FONT_FAMILIES.sacred,
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
    lineHeight: 28,
  },
  sacredAxiom: {
    fontFamily: FONT_FAMILIES.sacred,
    fontSize: 16,
    fontStyle: 'italic' as const,
    lineHeight: 24,
  },

  // TIER 2: MODERN GROTESK (UI & BODY)
  h1: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 24,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  bodyBold: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: FONT_FAMILIES.sans,
    fontSize: 11,
    fontWeight: '500' as const,
    letterSpacing: 0.4,
  },

  // TIER 3: PRECISION MONOSPACE (TIME & METRICS)
  mono: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  monoBold: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 13,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
  monoTime: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
  monoTag: {
    fontFamily: FONT_FAMILIES.mono,
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
} as const;
