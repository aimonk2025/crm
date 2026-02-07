export type FieldType = 'text' | 'number' | 'date' | 'select'

export interface CustomField {
  id: string
  user_id: string
  name: string
  field_type: FieldType
  options: string[] | null // For select type
  is_required: boolean
  display_order: number
  created_at: string
}

export interface CustomFieldValue {
  id: string
  customer_id: string
  field_id: string
  value: string | null
  created_at: string
  updated_at: string
}

export interface CustomFieldWithValue extends CustomField {
  value: string | null
}
