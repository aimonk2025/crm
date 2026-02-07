import { z } from 'zod'

export const followUpSchema = z.object({
  due_date: z.string().min(1, 'Date is required'),
  note: z.string().optional(),
})

export type FollowUpFormData = z.infer<typeof followUpSchema>
