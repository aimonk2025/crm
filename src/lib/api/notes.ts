import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/types/customer'

export async function createNote(customerId: string, content: string): Promise<Note> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('notes')
    .insert({
      customer_id: customerId,
      user_id: user.id,
      content,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw error
}
