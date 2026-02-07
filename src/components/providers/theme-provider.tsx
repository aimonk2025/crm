'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { getTheme, saveTheme, type UpdateThemeData } from '@/lib/api/theme'
import {
  computeTheme,
  applyTheme,
  defaultThemeColors,
  type ThemeColors,
  type ComputedTheme,
} from '@/lib/theme/colors'
import { useAuth } from './auth-provider'

interface ThemeContextValue {
  colors: ThemeColors
  computedTheme: ComputedTheme
  isLoading: boolean
  updateTheme: (colors: UpdateThemeData) => Promise<void>
  resetToDefaults: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { user } = useAuth()
  const [colors, setColors] = useState<ThemeColors>(defaultThemeColors)
  const [isLoading, setIsLoading] = useState(true)

  // Compute full theme from colors
  const computedTheme = computeTheme(colors)

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(computedTheme)
  }, [computedTheme])

  // Load theme from database when user changes
  useEffect(() => {
    async function loadTheme() {
      if (!user) {
        setColors(defaultThemeColors)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const themeColors = await getTheme()
        setColors(themeColors)
      } catch (error) {
        console.error('Failed to load theme:', error)
        setColors(defaultThemeColors)
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [user])

  // Update theme
  const updateTheme = useCallback(async (newColors: UpdateThemeData) => {
    // Optimistically update UI
    setColors({
      primary: newColors.color_primary,
      background: newColors.color_background,
      secondary: newColors.color_secondary,
      surface: newColors.color_surface,
      accent: newColors.color_accent,
    })

    // Save to database
    await saveTheme(newColors)
  }, [])

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setColors(defaultThemeColors)
    // Note: This doesn't delete from DB, just resets UI
    // Call resetTheme() from api/theme.ts to also delete from DB
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        colors,
        computedTheme,
        isLoading,
        updateTheme,
        resetToDefaults,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
