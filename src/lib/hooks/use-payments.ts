import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPayment, deletePayment, type CreatePaymentData } from '@/lib/api/payments'

export function useCreatePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreatePaymentData) => createPayment(data),
    onSuccess: (_, { customer_id }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customer_id] })
      queryClient.invalidateQueries({ queryKey: ['timeline', customer_id] })
    },
  })
}

export function useDeletePayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      deletePayment(id),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
