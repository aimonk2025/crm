import { createClient } from '@/lib/supabase/client'
import type { CustomerStatus } from '@/types/customer'

export interface DashboardStats {
  totalCustomers: number
  customersByStatus: Record<CustomerStatus, number>
  paymentsThisMonth: number
  followUpsDueToday: number
  overdueFollowUps: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient()

  // Get today's date range
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString().split('T')[0]

  // Get first day of current month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const firstDayISO = firstDayOfMonth.toISOString()

  // Fetch all data in parallel
  const [
    customersResult,
    paymentsResult,
    followUpsTodayResult,
    overdueResult,
  ] = await Promise.all([
    // All customers
    supabase.from('customers').select('status'),
    // Payments this month
    supabase
      .from('payments')
      .select('amount')
      .gte('created_at', firstDayISO),
    // Follow-ups due today
    supabase
      .from('follow_ups')
      .select('id')
      .eq('due_date', todayISO)
      .eq('completed', false),
    // Overdue follow-ups
    supabase
      .from('follow_ups')
      .select('id')
      .lt('due_date', todayISO)
      .eq('completed', false),
  ])

  // Calculate customers by status
  const customersByStatus: Record<CustomerStatus, number> = {
    new: 0,
    contacted: 0,
    in_progress: 0,
    completed: 0,
    lost: 0,
  }

  if (customersResult.data) {
    for (const customer of customersResult.data) {
      const status = customer.status as CustomerStatus
      if (status in customersByStatus) {
        customersByStatus[status]++
      }
    }
  }

  // Calculate payments total
  const paymentsThisMonth = paymentsResult.data
    ? paymentsResult.data.reduce((sum, p) => sum + (p.amount || 0), 0)
    : 0

  return {
    totalCustomers: customersResult.data?.length || 0,
    customersByStatus,
    paymentsThisMonth,
    followUpsDueToday: followUpsTodayResult.data?.length || 0,
    overdueFollowUps: overdueResult.data?.length || 0,
  }
}
