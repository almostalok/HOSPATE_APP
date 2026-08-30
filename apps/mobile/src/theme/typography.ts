/**
 * HOSPATE DESIGN SYSTEM - Apple SF Pro Typography Tokens
 * Clean, readable, Human Interface Guidelines typography
 */

export const typography = {
  // Apple Large Title (Screen Headers)
  display: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: 0.37,
    lineHeight: 41
  },
  // Apple Health Large Metric / Score
  heroScore: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 52
  },
  // Apple Title 1
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: 0.36,
    lineHeight: 34
  },
  // Apple Title 2
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    letterSpacing: 0.35,
    lineHeight: 28
  },
  // Apple Title 3 / Section Header
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: 0.38,
    lineHeight: 25
  },
  // Apple Headline (Emphasized text)
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    letterSpacing: -0.41,
    lineHeight: 22
  },
  // Apple Body (Default readable text)
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    letterSpacing: -0.41,
    lineHeight: 22
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
    lineHeight: 20
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '500' as const,
    letterSpacing: -0.24,
    lineHeight: 20
  },
  bodySemibold: {
    fontSize: 15,
    fontWeight: '600' as const,
    letterSpacing: -0.24,
    lineHeight: 20
  },
  // Apple Subheadline / Callout
  callout: {
    fontSize: 16,
    fontWeight: '400' as const,
    letterSpacing: -0.32,
    lineHeight: 21
  },
  subheadline: {
    fontSize: 15,
    fontWeight: '400' as const,
    letterSpacing: -0.24,
    lineHeight: 20
  },
  // Apple Footnote
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    letterSpacing: -0.08,
    lineHeight: 18
  },
  captionSemibold: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: -0.08,
    lineHeight: 18
  },
  // Apple Section Header (Capsule / Group Header)
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
    textTransform: 'uppercase' as const,
    lineHeight: 18
  }
};
