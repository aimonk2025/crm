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

export interface ThemeColors {
  primary: string
  background: string
  secondary?: string | null
  surface?: string | null
  accent?: string | null
}

export interface UpdateThemeData {
  color_primary: string
  color_background: string
  color_secondary?: string | null
  color_surface?: string | null
  color_accent?: string | null
}
