'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { useTheme } from '@/components/providers/theme-provider'
import { defaultThemeColors } from '@/lib/theme/colors'
import { toast } from 'sonner'
import { Palette, RotateCcw, Loader2, Check } from 'lucide-react'

/**
 * Convert hex to RGB string
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return ''
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  return `${r}, ${g}, ${b}`
}

/**
 * Convert RGB string to hex
 */
function rgbToHex(rgb: string): string | null {
  const match = rgb.match(/(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/)
  if (!match) return null
  const r = parseInt(match[1], 10)
  const g = parseInt(match[2], 10)
  const b = parseInt(match[3], 10)
  if (r > 255 || g > 255 || b > 255) return null
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/**
 * Validate and normalize color input (accepts hex or RGB)
 */
function parseColorInput(input: string): string | null {
  const trimmed = input.trim()

  // Check if it's a valid hex color
  if (/^#?([a-f\d]{6})$/i.test(trimmed)) {
    return trimmed.startsWith('#') ? trimmed.toLowerCase() : `#${trimmed.toLowerCase()}`
  }

  // Check if it's RGB format
  const rgbHex = rgbToHex(trimmed)
  if (rgbHex) return rgbHex

  return null
}

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  description?: string
}

function ColorPicker({ label, value, onChange, description }: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value)
  const [inputError, setInputError] = useState(false)

  useEffect(() => {
    setInputValue(value)
    setInputError(false)
  }, [value])

  function handleInputChange(newValue: string) {
    setInputValue(newValue)
    const parsed = parseColorInput(newValue)
    if (parsed) {
      setInputError(false)
      onChange(parsed)
    } else if (newValue.length >= 6) {
      setInputError(true)
    }
  }

  function handleInputBlur() {
    const parsed = parseColorInput(inputValue)
    if (parsed) {
      setInputValue(parsed)
      setInputError(false)
    } else {
      setInputValue(value)
      setInputError(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-md border-2 border-border shadow-sm cursor-pointer overflow-hidden flex-shrink-0"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={handleInputBlur}
          placeholder="#000000 or 0, 0, 0"
          className={`w-36 font-mono text-xs ${inputError ? 'border-red-500' : ''}`}
        />
      </div>
      <p className="text-[10px] text-muted-foreground sm:hidden">
        RGB: {hexToRgb(value)}
      </p>
    </div>
  )
}

interface OptionalColorProps {
  label: string
  value: string | null
  enabled: boolean
  onToggle: (enabled: boolean) => void
  onChange: (value: string) => void
  description?: string
  defaultColor: string
}

function OptionalColor({
  label,
  value,
  enabled,
  onToggle,
  onChange,
  description,
  defaultColor,
}: OptionalColorProps) {
  const currentValue = value || defaultColor
  const [inputValue, setInputValue] = useState(currentValue)
  const [inputError, setInputError] = useState(false)

  useEffect(() => {
    setInputValue(value || defaultColor)
    setInputError(false)
  }, [value, defaultColor])

  function handleInputChange(newValue: string) {
    setInputValue(newValue)
    const parsed = parseColorInput(newValue)
    if (parsed) {
      setInputError(false)
      onChange(parsed)
    } else if (newValue.length >= 6) {
      setInputError(true)
    }
  }

  function handleInputBlur() {
    const parsed = parseColorInput(inputValue)
    if (parsed) {
      setInputValue(parsed)
      setInputError(false)
    } else {
      setInputValue(currentValue)
      setInputError(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <div className="flex flex-col gap-2 ml-4 sm:flex-row sm:items-center">
          <div
            className="w-10 h-10 rounded-md border-2 border-border shadow-sm cursor-pointer overflow-hidden flex-shrink-0"
            style={{ backgroundColor: currentValue }}
          >
            <input
              type="color"
              value={currentValue}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <Input
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onBlur={handleInputBlur}
            placeholder="#000000 or 0, 0, 0"
            className={`w-36 font-mono text-xs ${inputError ? 'border-red-500' : ''}`}
          />
          <span className="text-[10px] text-muted-foreground sm:hidden">
            RGB: {hexToRgb(currentValue)}
          </span>
        </div>
      )}
    </div>
  )
}

export function ThemeSettings() {
  const { colors, updateTheme, resetToDefaults, isLoading } = useTheme()
  const [isSaving, setIsSaving] = useState(false)

  // Local state for editing
  const [primary, setPrimary] = useState(colors.primary)
  const [background, setBackground] = useState(colors.background)
  const [secondary, setSecondary] = useState(colors.secondary || '')
  const [surface, setSurface] = useState(colors.surface || '')
  const [accent, setAccent] = useState(colors.accent || '')
  const [useSecondary, setUseSecondary] = useState(!!colors.secondary)
  const [useSurface, setUseSurface] = useState(!!colors.surface)
  const [useAccent, setUseAccent] = useState(!!colors.accent)

  // Sync local state when colors change
  useEffect(() => {
    setPrimary(colors.primary)
    setBackground(colors.background)
    setSecondary(colors.secondary || '')
    setSurface(colors.surface || '')
    setAccent(colors.accent || '')
    setUseSecondary(!!colors.secondary)
    setUseSurface(!!colors.surface)
    setUseAccent(!!colors.accent)
  }, [colors])

  async function handleSave() {
    setIsSaving(true)
    try {
      await updateTheme({
        color_primary: primary,
        color_background: background,
        color_secondary: useSecondary ? secondary : null,
        color_surface: useSurface ? surface : null,
        color_accent: useAccent ? accent : null,
      })
      toast.success('Theme saved successfully')
    } catch (error) {
      toast.error('Failed to save theme')
    } finally {
      setIsSaving(false)
    }
  }

  function handleReset() {
    setPrimary(defaultThemeColors.primary)
    setBackground(defaultThemeColors.background)
    setSecondary(defaultThemeColors.secondary || '')
    setSurface(defaultThemeColors.surface || '')
    setAccent('')
    setUseSecondary(!!defaultThemeColors.secondary)
    setUseSurface(!!defaultThemeColors.surface)
    setUseAccent(false)
    resetToDefaults()
    toast.info('Theme reset to defaults')
  }

  // Count active colors
  const activeColorCount = 2 + (useSecondary ? 1 : 0) + (useSurface ? 1 : 0) + (useAccent ? 1 : 0)

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <CardTitle>Theme</CardTitle>
        </div>
        <CardDescription>
          Customize your app colors ({activeColorCount} colors active)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Colors */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Required Colors
          </h4>
          <ColorPicker
            label="Primary"
            value={primary}
            onChange={setPrimary}
            description="Main brand color for buttons, links, sidebar"
          />
          <ColorPicker
            label="Background"
            value={background}
            onChange={setBackground}
            description="Page background color"
          />
        </div>

        {/* Optional Colors */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Optional Colors
          </h4>
          <OptionalColor
            label="Secondary"
            value={secondary}
            enabled={useSecondary}
            onToggle={(enabled) => {
              setUseSecondary(enabled)
              if (enabled && !secondary) {
                setSecondary('#ACBAC4')
              }
            }}
            onChange={setSecondary}
            description="Borders, muted text, subtle elements"
            defaultColor="#ACBAC4"
          />
          <OptionalColor
            label="Surface"
            value={surface}
            enabled={useSurface}
            onToggle={(enabled) => {
              setUseSurface(enabled)
              if (enabled && !surface) {
                setSurface('#E1D9BC')
              }
            }}
            onChange={setSurface}
            description="Cards, input backgrounds"
            defaultColor="#E1D9BC"
          />
          <OptionalColor
            label="Accent"
            value={accent}
            enabled={useAccent}
            onToggle={(enabled) => {
              setUseAccent(enabled)
              if (enabled && !accent) {
                setAccent(primary)
              }
            }}
            onChange={setAccent}
            description="Highlights, special elements"
            defaultColor={primary}
          />
        </div>

        {/* Preview */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Preview
          </h4>
          <div
            className="rounded-lg p-4 space-y-3"
            style={{ backgroundColor: background }}
          >
            <div
              className="rounded-md p-3"
              style={{ backgroundColor: useSurface ? surface : '#FFFFFF' }}
            >
              <div
                className="text-sm font-medium"
                style={{ color: primary }}
              >
                Sample Card Title
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: useSecondary ? secondary : '#666666' }}
              >
                This is secondary text
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded text-sm font-medium"
                style={{ backgroundColor: primary, color: background }}
              >
                Primary Button
              </button>
              <button
                className="px-3 py-1.5 rounded text-sm font-medium border"
                style={{
                  borderColor: useSecondary ? secondary : '#CCCCCC',
                  color: primary,
                }}
              >
                Secondary
              </button>
              {useAccent && (
                <button
                  className="px-3 py-1.5 rounded text-sm font-medium"
                  style={{ backgroundColor: accent, color: background }}
                >
                  Accent
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            Save Theme
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
