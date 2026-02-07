import { createClient } from '@/lib/supabase/client'
import type { FollowUp, FollowUpWithCustomer } from '@/types/customer'

export type FollowUpFilter = 'today' | 'overdue' | 'upcoming' | 'all'

export async function getFollowUps(filter: FollowUpFilter = 'all'): Promise<FollowUpWithCustomer[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]

  let query = supabase
    .from('follow_ups')
    .select(`
      *,
      customer:customers(id, name, phone)
    `)
    .eq('completed', false)
    .order('due_date', { ascending: true })

  if (filter === 'today') {
    query = query.eq('due_date', today)
  } else if (filter === 'overdue') {
    query = query.lt('due_date', today)
  } else if (filter === 'upcoming') {
    query = query.gt('due_date', today)
  }

  const { data, error } = await query

  if (error) throw error
  return data as FollowUpWithCustomer[]
}

export interface CreateFollowUpData {
  customer_id: string
  due_date: string
  note?: string
}

export async function createFollowUp(data: CreateFollowUpData): Promise<FollowUp> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: followUp, error } = await supabase
    .from('follow_ups')
    .insert({
      customer_id: data.customer_id,
      user_id: user.id,
      due_date: data.due_date,
      note: data.note || null,
    })
    .select()
    .single()

  if (error) throw error
  return followUp
}

export async function completeFollowUp(id: string): Promise<FollowUp> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('follow_ups')
    .update({ completed: true })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function rescheduleFollowUp(id: string, newDate: string): Promise<FollowUp> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('follow_ups')
    .update({ due_date: newDate })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteFollowUp(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('follow_ups')
    .delete()
    .eq('id', id)

  if (error) throw error
}
