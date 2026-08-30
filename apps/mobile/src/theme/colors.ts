/**
 * HOSPATE DESIGN SYSTEM - Apple Human Interface Guidelines (HIG) Colors
 * Authentic Apple Health Dark Mode Palette
 */

export const colors = {
  // Backgrounds (Apple iOS Dark System)
  background: '#000000',            // Pure Apple OLED Black
  surface: '#1C1C1E',               // iOS System Gray 6 (Grouped Card Background)
  surfaceElevated: '#2C2C2E',       // iOS System Gray 5 (Elevated Card / Modal)
  surfaceBorder: 'rgba(255, 255, 255, 0.08)',
  surfaceHover: '#3A3A3C',

  // Apple System Tint & Brand
  primary: '#0A84FF',               // Apple System Blue (iOS 17/18 Tint)
  primaryDark: '#0066CC',
  primaryGlow: 'rgba(10, 132, 255, 0.12)',
  brandNavy: '#002B5B',             // Hospate Deep Navy Blue
  accent: '#64D2FF',                // Apple System Cyan
  accentPurple: '#5E5CE6',          // Apple System Indigo
  accentPurpleGlow: 'rgba(94, 92, 230, 0.12)',

  // Apple Health Semantic Status
  success: '#30D158',               // Apple Activity Green (Normal / Optimal)
  successGlow: 'rgba(48, 209, 88, 0.12)',
  successText: '#30D158',

  warning: '#FF9F0A',               // Apple System Orange (Borderline / Warning)
  warningGlow: 'rgba(255, 159, 10, 0.12)',
  warningText: '#FF9F0A',

  danger: '#FF453A',                // Apple System Red (Attention / Critical)
  dangerGlow: 'rgba(255, 69, 58, 0.12)',
  dangerText: '#FF453A',

  info: '#0A84FF',

  // Apple SF Pro Typography Colors
  textPrimary: '#FFFFFF',           // 100% White
  textSecondary: 'rgba(235, 235, 245, 0.60)', // iOS Secondary Label (60%)
  textMuted: 'rgba(235, 235, 245, 0.38)',     // iOS Tertiary Label (38%)
  textInverse: '#000000',

  // Apple Separators & Hairlines
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.14)',
  borderFocus: '#0A84FF',

  // Apple Health Dimension Metrics
  dimensionCardio: '#FF375F',       // Apple Heart Red
  dimensionMetabolic: '#FF9F0A',    // Apple Orange
  dimensionNutrition: '#30D158',    // Apple Activity Green
  dimensionLifestyle: '#64D2FF',    // Apple Cyan
  dimensionMedication: '#0A84FF',   // Apple Blue

  // Clean Subtle Gradients
  gradientHero: ['#1C1C1E', '#000000'],
  gradientScore: ['#0A84FF', '#0066CC'],
  gradientAI: ['#1C1C1E', '#1C1C1E']
};
