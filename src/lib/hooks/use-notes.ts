import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createNote, deleteNote } from '@/lib/api/notes'

export function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ customerId, content }: { customerId: string; content: string }) =>
      createNote(customerId, content),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
      queryClient.invalidateQueries({ queryKey: ['timeline', customerId] })
    },
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, customerId }: { id: string; customerId: string }) =>
      deleteNote(id),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] })
    },
  })
}
