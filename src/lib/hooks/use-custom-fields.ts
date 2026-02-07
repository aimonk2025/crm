import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
  getCustomerFieldValues,
  setCustomerFieldValues,
  type CreateCustomFieldData,
  type UpdateCustomFieldData,
} from '@/lib/api/custom-fields'
import { toast } from 'sonner'

export function useCustomFields() {
  return useQuery({
    queryKey: ['custom-fields'],
    queryFn: getCustomFields,
  })
}

export function useCustomerFieldValues(customerId: string) {
  return useQuery({
    queryKey: ['customer-field-values', customerId],
    queryFn: () => getCustomerFieldValues(customerId),
    enabled: !!customerId,
  })
}

export function useCreateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateCustomFieldData) => createCustomField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
      toast.success('Custom field created')
    },
    onError: () => {
      toast.error('Failed to create custom field')
    },
  })
}

export function useUpdateCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomFieldData }) =>
      updateCustomField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
      queryClient.invalidateQueries({ queryKey: ['customer-field-values'] })
      toast.success('Custom field updated')
    },
    onError: () => {
      toast.error('Failed to update custom field')
    },
  })
}

export function useDeleteCustomField() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCustomField(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-fields'] })
      queryClient.invalidateQueries({ queryKey: ['customer-field-values'] })
      toast.success('Custom field deleted')
    },
    onError: () => {
      toast.error('Failed to delete custom field')
    },
  })
}

export function useSetCustomerFieldValues() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      customerId,
      fieldValues,
    }: {
      customerId: string
      fieldValues: Record<string, string | null>
    }) => setCustomerFieldValues(customerId, fieldValues),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({
        queryKey: ['customer-field-values', customerId],
      })
    },
    onError: () => {
      toast.error('Failed to save custom fields')
    },
  })
}
