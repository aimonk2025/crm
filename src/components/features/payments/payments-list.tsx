'use client'

import { format } from 'date-fns'
import { Trash2, Banknote, CreditCard, Building2, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeletePayment } from '@/lib/hooks/use-payments'
import { toast } from 'sonner'
import type { Payment, PaymentMode } from '@/types/customer'

const modeIcons: Record<PaymentMode, React.ReactNode> = {
  cash: <Banknote className="h-4 w-4" />,
  upi: <CreditCard className="h-4 w-4" />,
  bank: <Building2 className="h-4 w-4" />,
  other: <HelpCircle className="h-4 w-4" />,
}

const modeLabels: Record<PaymentMode, string> = {
  cash: 'Cash',
  upi: 'UPI',
  bank: 'Bank',
  other: 'Other',
}

interface PaymentsListProps {
  payments: Payment[]
  customerId: string
  total: number
}

export function PaymentsList({ payments, customerId, total }: PaymentsListProps) {
  const deletePayment = useDeletePayment()

  async function handleDelete(paymentId: string) {
    try {
      await deletePayment.mutateAsync({ id: paymentId, customerId })
      toast.success('Payment deleted')
    } catch {
      toast.error('Failed to delete payment')
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950">
        <span className="text-sm font-medium">Total Received</span>
        <span className="text-lg font-bold text-green-600">
          {new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
          }).format(total)}
        </span>
      </div>

      {payments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No payments recorded
        </p>
      ) : (
        <div className="space-y-2">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="group flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <div className="shrink-0 text-muted-foreground">
                {modeIcons[payment.mode]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(Number(payment.amount))}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {modeLabels[payment.mode]}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                </p>
                {payment.note && (
                  <p className="text-xs text-muted-foreground mt-1">{payment.note}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => handleDelete(payment.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
