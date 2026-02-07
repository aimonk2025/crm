'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreatePayment } from '@/lib/hooks/use-payments'
import { paymentSchema, type PaymentFormData } from '@/lib/validations/payment'
import { Loader2, Plus } from 'lucide-react'

const paymentModes = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
]

interface AddPaymentDialogProps {
  customerId: string
}

export function AddPaymentDialog({ customerId }: AddPaymentDialogProps) {
  const [open, setOpen] = useState(false)
  const createPayment = useCreatePayment()

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      payment_date: new Date().toISOString().split('T')[0],
      mode: 'cash',
      note: '',
    },
  })

  async function onSubmit(data: PaymentFormData) {
    try {
      await createPayment.mutateAsync({
        customer_id: customerId,
        amount: data.amount,
        payment_date: data.payment_date,
        mode: data.mode,
        note: data.note,
      })
      toast.success('Payment added')
      setOpen(false)
      form.reset()
    } catch {
      toast.error('Failed to add payment')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...form.register('amount', { valueAsNumber: true })}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Date *</Label>
              <Input
                id="payment_date"
                type="date"
                {...form.register('payment_date')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mode">Mode *</Label>
            <Select
              defaultValue="cash"
              onValueChange={(value) => form.setValue('mode', value as PaymentFormData['mode'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Optional note"
              rows={2}
              {...form.register('note')}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createPayment.isPending}>
              {createPayment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
