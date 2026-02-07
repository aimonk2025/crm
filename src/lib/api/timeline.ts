import { createClient } from '@/lib/supabase/client'
import type { TimelineEvent } from '@/types/customer'

export async function getTimeline(customerId: string, limit = 50): Promise<TimelineEvent[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('timeline_events')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
