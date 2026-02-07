import { createClient } from '@/lib/supabase/client'
import type { Customer, CustomerWithRelations, CustomerWithTags, CustomerStatus } from '@/types/customer'
import type { Tag } from '@/types/tag'

export interface CustomerFilters {
  search?: string
  status?: CustomerStatus
}

export async function getCustomers(filters?: CustomerFilters): Promise<CustomerWithTags[]> {
  const supabase = createClient()

  let query = supabase
    .from('customers')
    .select(`
      *,
      customer_tags (
        tag_id,
        tags (*)
      )
    `)
    .order('updated_at', { ascending: false })

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query

  if (error) throw error

  // Transform the response to flatten tags
  return (data || []).map((customer) => ({
    ...customer,
    tags: (customer.customer_tags || [])
      .map((ct: { tags: Tag }) => ct.tags)
      .filter(Boolean) as Tag[],
    customer_tags: undefined,
  })) as CustomerWithTags[]
}

export async function getCustomer(id: string): Promise<CustomerWithRelations> {
  const supabase = createClient()

  // Get customer with related data
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (customerError) throw customerError

  // Get notes
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .eq('customer_id', id)
    .order('created_at', { ascending: false })

  // Get payments
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('customer_id', id)
    .order('payment_date', { ascending: false })

  // Get follow-ups
  const { data: follow_ups } = await supabase
    .from('follow_ups')
    .select('*')
    .eq('customer_id', id)
    .order('due_date', { ascending: true })

  // Calculate total payments
  const payments_total = (payments || []).reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  return {
    ...customer,
    notes: notes || [],
    payments: payments || [],
    follow_ups: follow_ups || [],
    payments_total,
  }
}

export interface CreateCustomerData {
  name: string
  phone: string
  email?: string
  source?: string
  note?: string
}

export async function createCustomer(data: CreateCustomerData): Promise<Customer> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check for duplicate phone
  const { data: existing } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .eq('phone', data.phone)
    .single()

  if (existing) {
    throw new Error(`DUPLICATE_PHONE:${existing.id}`)
  }

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      user_id: user.id,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      source: data.source || 'manual',
    })
    .select()
    .single()

  if (error) throw error

  // Add initial note if provided
  if (data.note) {
    await supabase.from('notes').insert({
      customer_id: customer.id,
      user_id: user.id,
      content: data.note,
    })
  }

  return customer
}

export interface UpdateCustomerData {
  name?: string
  phone?: string
  email?: string
  status?: CustomerStatus
  source?: string
}

export async function updateCustomer(
  id: string,
  data: UpdateCustomerData
): Promise<Customer> {
  const supabase = createClient()

  const { data: customer, error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return customer
}

export async function deleteCustomer(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) throw error
}
