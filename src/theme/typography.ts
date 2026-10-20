export const TYPOGRAPHY = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 15,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    letterSpacing: 0.4,
  },
  mono: {
    fontSize: 14,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
} as const;
