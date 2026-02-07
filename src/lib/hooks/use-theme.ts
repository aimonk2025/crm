import { useMutation, useQueryClient } from '@tanstack/react-query'
import { saveTheme, resetTheme, type UpdateThemeData } from '@/lib/api/theme'

export function useSaveTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] })
    },
  })
}

export function useResetTheme() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: resetTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] })
    },
  })
}
