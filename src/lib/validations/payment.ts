import { z } from 'zod'

export const paymentSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  payment_date: z.string().min(1, 'Date is required'),
  mode: z.enum(['cash', 'upi', 'bank', 'other']),
  note: z.string().optional(),
})

export type PaymentFormData = z.infer<typeof paymentSchema>
