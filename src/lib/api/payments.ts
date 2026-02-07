import { createClient } from '@/lib/supabase/client'
import type { Payment, PaymentMode } from '@/types/customer'

export interface CreatePaymentData {
  customer_id: string
  amount: number
  payment_date: string
  mode: PaymentMode
  note?: string
}

export async function createPayment(data: CreatePaymentData): Promise<Payment> {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      customer_id: data.customer_id,
      user_id: user.id,
      amount: data.amount,
      payment_date: data.payment_date,
      mode: data.mode,
      note: data.note || null,
    })
    .select()
    .single()

  if (error) throw error
  return payment
}

export async function deletePayment(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id)

  if (error) throw error
}
