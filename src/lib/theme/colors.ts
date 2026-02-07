/**
 * Theme Color Utilities
 * Handles color manipulation and auto-generation of missing colors
 */

export interface ThemeColors {
  primary: string
  background: string
  secondary?: string | null
  surface?: string | null
  accent?: string | null
}

export interface ComputedTheme {
  primary: string
  primaryLight: string
  primaryDark: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  background: string
  backgroundDark: string
  surface: string
  surfaceLight: string
  surfaceDark: string
  accent: string
  accentLight: string
  accentDark: string
}

/**
 * Convert hex to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { h: 0, s: 0, l: 0 }

  let r = parseInt(result[1], 16) / 255
  let g = parseInt(result[2], 16) / 255
  let b = parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, amount: number = 15): string {
  const { h, s, l } = hexToHSL(hex)
  return hslToHex(h, s, Math.min(100, l + amount))
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, amount: number = 15): string {
  const { h, s, l } = hexToHSL(hex)
  return hslToHex(h, s, Math.max(0, l - amount))
}

/**
 * Generate a complementary/secondary color
 */
export function generateSecondary(primary: string): string {
  const { h, s, l } = hexToHSL(primary)
  // Shift hue slightly and reduce saturation for a muted secondary
  return hslToHex(h, Math.max(10, s - 30), Math.min(80, l + 20))
}

/**
 * Generate surface color from background
 */
export function generateSurface(background: string): string {
  const { h, s, l } = hexToHSL(background)
  // Slightly darker than background
  return hslToHex(h, s, Math.max(0, l - 8))
}

/**
 * Compute full theme from user-defined colors (2-5 colors)
 */
export function computeTheme(colors: ThemeColors): ComputedTheme {
  const { primary, background, secondary, surface, accent } = colors

  // Compute secondary (auto-generate if not provided)
  const computedSecondary = secondary || generateSecondary(primary)

  // Compute surface (auto-generate if not provided)
  const computedSurface = surface || generateSurface(background)

  // Compute accent (fallback to primary if not provided)
  const computedAccent = accent || primary

  return {
    primary,
    primaryLight: lighten(primary, 12),
    primaryDark: darken(primary, 10),
    secondary: computedSecondary,
    secondaryLight: lighten(computedSecondary, 10),
    secondaryDark: darken(computedSecondary, 10),
    background,
    backgroundDark: darken(background, 5),
    surface: computedSurface,
    surfaceLight: lighten(computedSurface, 8),
    surfaceDark: darken(computedSurface, 8),
    accent: computedAccent,
    accentLight: lighten(computedAccent, 15),
    accentDark: darken(computedAccent, 10),
  }
}

/**
 * Generate CSS variables object from computed theme
 */
export function themeToCSSVariables(theme: ComputedTheme): Record<string, string> {
  return {
    '--color-primary': theme.primary,
    '--color-primary-light': theme.primaryLight,
    '--color-primary-dark': theme.primaryDark,
    '--color-secondary': theme.secondary,
    '--color-secondary-light': theme.secondaryLight,
    '--color-secondary-dark': theme.secondaryDark,
    '--color-background': theme.background,
    '--color-background-dark': theme.backgroundDark,
    '--color-surface': theme.surface,
    '--color-surface-light': theme.surfaceLight,
    '--color-surface-dark': theme.surfaceDark,
    '--color-accent': theme.accent,
    '--color-accent-light': theme.accentLight,
    '--color-accent-dark': theme.accentDark,
  }
}

/**
 * Apply theme to document root
 */
export function applyTheme(theme: ComputedTheme): void {
  if (typeof document === 'undefined') return

  const variables = themeToCSSVariables(theme)
  const root = document.documentElement

  Object.entries(variables).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

/**
 * Default theme colors
 */
export const defaultThemeColors: ThemeColors = {
  primary: '#0d0e0d',
  background: '#e9e7e1',
  secondary: '#c0c5ca',
  surface: '#202322',
  accent: null, // Will use primary
}
