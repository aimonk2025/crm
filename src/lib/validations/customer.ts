import { z } from 'zod'

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  phone: z.string().min(1, 'Phone is required').max(20, 'Phone must be 20 characters or less'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  source: z.string().min(1, 'Source is required'),
  note: z.string().optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>

export const customerStatusSchema = z.enum([
  'new',
  'contacted',
  'in_progress',
  'completed',
  'lost',
])

export const updateCustomerSchema = customerSchema.partial()

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>
