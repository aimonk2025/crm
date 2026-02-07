'use client'

import { useState, useEffect } from 'react'
import { Loader2, Pencil, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCustomerFieldValues,
  useSetCustomerFieldValues,
} from '@/lib/hooks/use-custom-fields'
import { format } from 'date-fns'
import type { CustomFieldWithValue } from '@/types/custom-field'

interface CustomFieldsSectionProps {
  customerId: string
}

export function CustomFieldsSection({ customerId }: CustomFieldsSectionProps) {
  const { data: fields, isLoading } = useCustomerFieldValues(customerId)
  const setFieldValues = useSetCustomerFieldValues()
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState<Record<string, string>>({})

  // Initialize edit values when fields load or when entering edit mode
  useEffect(() => {
    if (fields && isEditing) {
      const values: Record<string, string> = {}
      fields.forEach((field) => {
        values[field.id] = field.value || ''
      })
      setEditValues(values)
    }
  }, [fields, isEditing])

  const handleStartEdit = () => {
    if (fields) {
      const values: Record<string, string> = {}
      fields.forEach((field) => {
        values[field.id] = field.value || ''
      })
      setEditValues(values)
    }
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditValues({})
  }

  const handleSave = async () => {
    try {
      await setFieldValues.mutateAsync({
        customerId,
        fieldValues: editValues,
      })
      setIsEditing(false)
    } catch {
      // Error handled by mutation
    }
  }

  const handleValueChange = (fieldId: string, value: string) => {
    setEditValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Custom Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (!fields || fields.length === 0) {
    return null // Don't show section if no custom fields defined
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">Custom Fields</CardTitle>
        {!isEditing ? (
          <Button variant="ghost" size="sm" onClick={handleStartEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={setFieldValues.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={setFieldValues.isPending}
            >
              {setFieldValues.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <Label className="text-sm text-muted-foreground">
              {field.name}
              {field.is_required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {isEditing ? (
              <FieldInput
                field={field}
                value={editValues[field.id] || ''}
                onChange={(value) => handleValueChange(field.id, value)}
              />
            ) : (
              <FieldDisplay field={field} />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface FieldInputProps {
  field: CustomFieldWithValue
  value: string
  onChange: (value: string) => void
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  switch (field.field_type) {
    case 'text':
      return (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.name.toLowerCase()}`}
        />
      )
    case 'number':
      return (
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.name.toLowerCase()}`}
        />
      )
    case 'date':
      return (
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    case 'select':
      return (
        <Select value={value || ''} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    default:
      return null
  }
}

function FieldDisplay({ field }: { field: CustomFieldWithValue }) {
  if (!field.value) {
    return <p className="text-sm text-muted-foreground italic">Not set</p>
  }

  let displayValue = field.value

  // Format date values
  if (field.field_type === 'date' && field.value) {
    try {
      displayValue = format(new Date(field.value), 'PPP')
    } catch {
      displayValue = field.value
    }
  }

  return <p className="text-sm">{displayValue}</p>
}
