import { createClient } from '@/lib/supabase/client'
import type { CustomerStatus, TimelineEvent } from '@/types/customer'

export interface DashboardStats {
  totalCustomers: number
  customersByStatus: Record<CustomerStatus, number>
  paymentsThisMonth: number
  followUpsDueToday: number
  overdueFollowUps: number
  newThisWeek: number
}

export interface RecentActivityItem {
  id: string
  type: 'customer_created' | 'payment_added' | 'follow_up_completed'
  description: string
  timestamp: string
  customerId?: string
  customerName?: string
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

  // Get first day of current week (Sunday)
  const firstDayOfWeek = new Date(today)
  firstDayOfWeek.setDate(today.getDate() - today.getDay())
  firstDayOfWeek.setHours(0, 0, 0, 0)
  const firstDayOfWeekISO = firstDayOfWeek.toISOString()

  // Fetch all data in parallel
  const [
    customersResult,
    newCustomersResult,
    paymentsResult,
    followUpsTodayResult,
    overdueResult,
  ] = await Promise.all([
    // All customers
    supabase.from('customers').select('status'),
    // New customers this week
    supabase
      .from('customers')
      .select('id')
      .gte('created_at', firstDayOfWeekISO),
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
    newThisWeek: newCustomersResult.data?.length || 0,
  }
}

export async function getRecentActivity(limit = 10): Promise<RecentActivityItem[]> {
  const supabase = createClient()

  // Get recent timeline events
  const { data: events, error } = await supabase
    .from('timeline_events')
    .select('id, event_type, event_data, created_at, customer_id')
    .order('created_at', { ascending: false })
    .limit(limit * 2) // Get more than needed to filter

  if (error) throw error
  if (!events) return []

  // Filter for relevant event types and format
  const activities: RecentActivityItem[] = []

  for (const event of events) {
    if (activities.length >= limit) break

    const eventData = event.event_data as Record<string, unknown>
    const customerName = eventData.customer_name as string | undefined

    switch (event.event_type) {
      case 'customer_created':
        activities.push({
          id: event.id,
          type: 'customer_created',
          description: `New customer: ${customerName || 'Unknown'}`,
          timestamp: event.created_at,
          customerId: event.customer_id,
          customerName,
        })
        break
      case 'payment_added':
        {
          const amount = eventData.amount as number
          activities.push({
            id: event.id,
            type: 'payment_added',
            description: `Payment received: ₹${amount.toLocaleString('en-IN')} from ${customerName || 'Unknown'}`,
            timestamp: event.created_at,
            customerId: event.customer_id,
            customerName,
          })
        }
        break
      case 'follow_up_completed':
        activities.push({
          id: event.id,
          type: 'follow_up_completed',
          description: `Follow-up completed: ${customerName || 'Unknown'}`,
          timestamp: event.created_at,
          customerId: event.customer_id,
          customerName,
        })
        break
    }
  }

  return activities
}
