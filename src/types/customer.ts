import type { Tag } from './tag'

export type CustomerStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'lost'

export interface Customer {
  id: string
  user_id: string
  name: string
  phone: string
  email: string | null
  status: CustomerStatus
  source: string
  created_at: string
  updated_at: string
}

export interface CustomerWithTags extends Customer {
  tags: Tag[]
}

export interface CustomerWithRelations extends Customer {
  notes: Note[]
  payments: Payment[]
  follow_ups: FollowUp[]
  payments_total: number
}

export interface Note {
  id: string
  customer_id: string
  user_id: string
  content: string
  created_at: string
}

export interface Payment {
  id: string
  customer_id: string
  user_id: string
  amount: number
  payment_date: string
  mode: PaymentMode
  note: string | null
  created_at: string
}

export type PaymentMode = 'cash' | 'upi' | 'bank' | 'other'

export interface FollowUp {
  id: string
  customer_id: string
  user_id: string
  due_date: string
  note: string | null
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface FollowUpWithCustomer extends FollowUp {
  customer: Pick<Customer, 'id' | 'name' | 'phone'>
}

export type EventType =
  | 'customer_created'
  | 'status_changed'
  | 'note_added'
  | 'payment_added'
  | 'follow_up_scheduled'
  | 'follow_up_completed'

export interface TimelineEvent {
  id: string
  customer_id: string
  user_id: string
  event_type: EventType
  event_data: Record<string, unknown>
  created_at: string
}
