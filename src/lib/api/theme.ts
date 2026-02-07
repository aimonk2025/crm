import { createClient } from '@/lib/supabase/client'
import { defaultThemeColors, type ThemeColors } from '@/lib/theme/colors'

export interface Theme {
  id: string
  user_id: string
  color_primary: string
  color_background: string
  color_secondary: string | null
  color_surface: string | null
  color_accent: string | null
  created_at: string
  updated_at: string
}

/**
 * Get user's theme from database
 */
export async function getTheme(): Promise<ThemeColors> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return defaultThemeColors

  const { data, error } = await supabase
    .from('themes')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error || !data) {
    return defaultThemeColors
  }

  return {
    primary: data.color_primary,
    background: data.color_background,
    secondary: data.color_secondary,
    surface: data.color_surface,
    accent: data.color_accent,
  }
}

export interface UpdateThemeData {
  color_primary: string
  color_background: string
  color_secondary?: string | null
  color_surface?: string | null
  color_accent?: string | null
}

/**
 * Save user's theme to database
 */
export async function saveTheme(colors: UpdateThemeData): Promise<Theme> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Upsert theme (create or update)
  const { data, error } = await supabase
    .from('themes')
    .upsert({
      user_id: user.id,
      color_primary: colors.color_primary,
      color_background: colors.color_background,
      color_secondary: colors.color_secondary || null,
      color_surface: colors.color_surface || null,
      color_accent: colors.color_accent || null,
    }, {
      onConflict: 'user_id',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Reset theme to defaults
 */
export async function resetTheme(): Promise<void> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await supabase
    .from('themes')
    .delete()
    .eq('user_id', user.id)
}
