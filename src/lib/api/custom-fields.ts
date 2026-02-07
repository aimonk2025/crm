import { createClient } from '@/lib/supabase/client'
import type { CustomField, CustomFieldValue, CustomFieldWithValue, FieldType } from '@/types/custom-field'

// =====================
// Custom Field Definitions
// =====================

export async function getCustomFields(): Promise<CustomField[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('custom_fields')
    .select('*')
    .order('display_order')

  if (error) throw error
  return data || []
}

export interface CreateCustomFieldData {
  name: string
  field_type: FieldType
  options?: string[]
  is_required?: boolean
}

export async function createCustomField(data: CreateCustomFieldData): Promise<CustomField> {
  const supabase = createClient()

  // Get max display order
  const { data: existing } = await supabase
    .from('custom_fields')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)

  const maxOrder = existing?.[0]?.display_order ?? -1

  const { data: field, error } = await supabase
    .from('custom_fields')
    .insert({
      name: data.name.trim(),
      field_type: data.field_type,
      options: data.field_type === 'select' ? data.options : null,
      is_required: data.is_required ?? false,
      display_order: maxOrder + 1,
    })
    .select()
    .single()

  if (error) throw error
  return field
}

export interface UpdateCustomFieldData {
  name?: string
  field_type?: FieldType
  options?: string[]
  is_required?: boolean
  display_order?: number
}

export async function updateCustomField(
  id: string,
  data: UpdateCustomFieldData
): Promise<CustomField> {
  const supabase = createClient()

  const updateData: Record<string, unknown> = {}
  if (data.name) updateData.name = data.name.trim()
  if (data.field_type) updateData.field_type = data.field_type
  if (data.options !== undefined) updateData.options = data.options
  if (data.is_required !== undefined) updateData.is_required = data.is_required
  if (data.display_order !== undefined) updateData.display_order = data.display_order

  const { data: field, error } = await supabase
    .from('custom_fields')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return field
}

export async function deleteCustomField(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('custom_fields')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function reorderCustomFields(fieldIds: string[]): Promise<void> {
  const supabase = createClient()

  // Update each field's display_order
  const updates = fieldIds.map((id, index) =>
    supabase
      .from('custom_fields')
      .update({ display_order: index })
      .eq('id', id)
  )

  await Promise.all(updates)
}

// =====================
// Custom Field Values
// =====================

export async function getCustomerFieldValues(
  customerId: string
): Promise<CustomFieldWithValue[]> {
  const supabase = createClient()

  // Get all custom fields
  const { data: fields, error: fieldsError } = await supabase
    .from('custom_fields')
    .select('*')
    .order('display_order')

  if (fieldsError) throw fieldsError

  // Get values for this customer
  const { data: values, error: valuesError } = await supabase
    .from('custom_field_values')
    .select('*')
    .eq('customer_id', customerId)

  if (valuesError) throw valuesError

  // Map values to fields
  const valueMap = new Map<string, string | null>()
  ;(values || []).forEach((v) => {
    valueMap.set(v.field_id, v.value)
  })

  return (fields || []).map((field) => ({
    ...field,
    value: valueMap.get(field.id) ?? null,
  }))
}

export async function setCustomFieldValue(
  customerId: string,
  fieldId: string,
  value: string | null
): Promise<void> {
  const supabase = createClient()

  if (value === null || value === '') {
    // Delete the value
    await supabase
      .from('custom_field_values')
      .delete()
      .eq('customer_id', customerId)
      .eq('field_id', fieldId)
  } else {
    // Upsert the value
    const { error } = await supabase
      .from('custom_field_values')
      .upsert(
        {
          customer_id: customerId,
          field_id: fieldId,
          value,
        },
        {
          onConflict: 'customer_id,field_id',
        }
      )

    if (error) throw error
  }
}

export async function setCustomerFieldValues(
  customerId: string,
  fieldValues: Record<string, string | null>
): Promise<void> {
  const supabase = createClient()

  const entries = Object.entries(fieldValues)

  // Delete empty values and upsert non-empty ones
  for (const [fieldId, value] of entries) {
    if (value === null || value === '') {
      await supabase
        .from('custom_field_values')
        .delete()
        .eq('customer_id', customerId)
        .eq('field_id', fieldId)
    } else {
      await supabase
        .from('custom_field_values')
        .upsert(
          {
            customer_id: customerId,
            field_id: fieldId,
            value,
          },
          {
            onConflict: 'customer_id,field_id',
          }
        )
    }
  }
}
