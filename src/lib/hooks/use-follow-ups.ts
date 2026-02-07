import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getFollowUps,
  createFollowUp,
  completeFollowUp,
  rescheduleFollowUp,
  deleteFollowUp,
  type FollowUpFilter,
  type CreateFollowUpData,
} from '@/lib/api/follow-ups'

export function useFollowUps(filter: FollowUpFilter = 'all') {
  return useQuery({
    queryKey: ['follow-ups', filter],
    queryFn: () => getFollowUps(filter),
  })
}

export function useCreateFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateFollowUpData) => createFollowUp(data),
    onSuccess: (_, { customer_id }) => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] })
      queryClient.invalidateQueries({ queryKey: ['customers', customer_id] })
      queryClient.invalidateQueries({ queryKey: ['timeline', customer_id] })
    },
  })
}

export function useCompleteFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; customerId: string }) =>
      completeFollowUp(id),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] })
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', customerId] })
    },
  })
}

export function useRescheduleFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, newDate }: { id: string; newDate: string; customerId: string }) =>
      rescheduleFollowUp(id, newDate),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] })
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}

export function useDeleteFollowUp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; customerId: string }) =>
      deleteFollowUp(id),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['follow-ups'] })
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
