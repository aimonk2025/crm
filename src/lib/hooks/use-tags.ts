import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getCustomerTags,
  addTagToCustomer,
  removeTagFromCustomer,
  setCustomerTags,
  type CreateTagData,
  type UpdateTagData,
} from '@/lib/api/tags'
import { toast } from 'sonner'

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}

export function useCustomerTags(customerId: string) {
  return useQuery({
    queryKey: ['customer-tags', customerId],
    queryFn: () => getCustomerTags(customerId),
    enabled: !!customerId,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTagData) => createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag created')
    },
    onError: (error: Error) => {
      if (error.message.includes('duplicate')) {
        toast.error('A tag with this name already exists')
      } else {
        toast.error('Failed to create tag')
      }
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagData }) =>
      updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      toast.success('Tag updated')
    },
    onError: () => {
      toast.error('Failed to update tag')
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      queryClient.invalidateQueries({ queryKey: ['customer-tags'] })
      toast.success('Tag deleted')
    },
    onError: () => {
      toast.error('Failed to delete tag')
    },
  })
}

export function useAddTagToCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      customerId,
      tagId,
    }: {
      customerId: string
      tagId: string
    }) => addTagToCustomer(customerId, tagId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tags', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to add tag')
    },
  })
}

export function useRemoveTagFromCustomer() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      customerId,
      tagId,
    }: {
      customerId: string
      tagId: string
    }) => removeTagFromCustomer(customerId, tagId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tags', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to remove tag')
    },
  })
}

export function useSetCustomerTags() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      customerId,
      tagIds,
    }: {
      customerId: string
      tagIds: string[]
    }) => setCustomerTags(customerId, tagIds),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customer-tags', customerId] })
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
    onError: () => {
      toast.error('Failed to update tags')
    },
  })
}
