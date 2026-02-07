import { useQuery } from '@tanstack/react-query'
import { getTimeline } from '@/lib/api/timeline'

export function useTimeline(customerId: string) {
  return useQuery({
    queryKey: ['timeline', customerId],
    queryFn: () => getTimeline(customerId),
    enabled: !!customerId,
  })
}
