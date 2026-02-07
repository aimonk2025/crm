import { createClient } from '@/lib/supabase/client'
import type { Tag } from '@/types/tag'

export async function getTags(): Promise<Tag[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  if (error) throw error
  return data || []
}

export async function getTag(id: string): Promise<Tag | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }

  return data
}

export interface CreateTagData {
  name: string
  color?: string
}

export async function createTag(data: CreateTagData): Promise<Tag> {
  const supabase = createClient()

  const { data: tag, error } = await supabase
    .from('tags')
    .insert({
      name: data.name.trim(),
      color: data.color || '#6B7280',
    })
    .select()
    .single()

  if (error) throw error
  return tag
}

export interface UpdateTagData {
  name?: string
  color?: string
}

export async function updateTag(id: string, data: UpdateTagData): Promise<Tag> {
  const supabase = createClient()

  const { data: tag, error } = await supabase
    .from('tags')
    .update({
      ...(data.name && { name: data.name.trim() }),
      ...(data.color && { color: data.color }),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return tag
}

export async function deleteTag(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Customer tag operations
export async function getCustomerTags(customerId: string): Promise<Tag[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('customer_tags')
    .select('tag_id, tags(*)')
    .eq('customer_id', customerId)

  if (error) throw error

  return (data || []).map((item) => item.tags as unknown as Tag)
}

export async function addTagToCustomer(
  customerId: string,
  tagId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('customer_tags')
    .insert({
      customer_id: customerId,
      tag_id: tagId,
    })

  if (error) {
    // Ignore duplicate errors
    if (error.code !== '23505') throw error
  }
}

export async function removeTagFromCustomer(
  customerId: string,
  tagId: string
): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('customer_tags')
    .delete()
    .eq('customer_id', customerId)
    .eq('tag_id', tagId)

  if (error) throw error
}

export async function setCustomerTags(
  customerId: string,
  tagIds: string[]
): Promise<void> {
  const supabase = createClient()

  // Delete all existing tags for this customer
  const { error: deleteError } = await supabase
    .from('customer_tags')
    .delete()
    .eq('customer_id', customerId)

  if (deleteError) throw deleteError

  // Add new tags
  if (tagIds.length > 0) {
    const { error: insertError } = await supabase
      .from('customer_tags')
      .insert(
        tagIds.map((tagId) => ({
          customer_id: customerId,
          tag_id: tagId,
        }))
      )

    if (insertError) throw insertError
  }
}
