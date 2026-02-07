'use client'

import { useCustomer } from '@/lib/hooks/use-customers'
import { CustomerHeader } from './customer-header'
import { CustomFieldsSection } from './custom-fields-section'
import { NoteForm } from '@/components/features/notes/note-form'
import { NotesList } from '@/components/features/notes/notes-list'
import { PaymentsList } from '@/components/features/payments/payments-list'
import { AddPaymentDialog } from '@/components/features/payments/add-payment-dialog'
import { FollowUpsList } from '@/components/features/follow-ups/follow-ups-list'
import { AddFollowUpDialog } from '@/components/features/follow-ups/add-follow-up-dialog'
import { Timeline } from '@/components/features/timeline/timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { format } from 'date-fns'

interface CustomerProfileProps {
  customerId: string
}

export function CustomerProfile({ customerId }: CustomerProfileProps) {
  const { data: customer, isLoading, error, refetch } = useCustomer(customerId)

  if (isLoading) {
    return <CustomerProfileSkeleton />
  }

  if (error || !customer) {
    return (
      <ErrorState
        message="Failed to load customer"
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-6">
      <CustomerHeader customer={customer} />

      {/* Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Source</dt>
              <dd className="font-medium capitalize">{customer.source}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Added</dt>
              <dd className="font-medium">
                {format(new Date(customer.created_at), 'MMM d, yyyy')}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Custom Fields Section */}
      <CustomFieldsSection customerId={customerId} />

      {/* Notes Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <NoteForm customerId={customerId} />
          <NotesList notes={customer.notes} customerId={customerId} />
        </CardContent>
      </Card>

      {/* Payments Section */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Payments</CardTitle>
          <AddPaymentDialog customerId={customerId} />
        </CardHeader>
        <CardContent>
          <PaymentsList
            payments={customer.payments}
            customerId={customerId}
            total={customer.payments_total}
          />
        </CardContent>
      </Card>

      {/* Follow-ups Section */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Follow-ups</CardTitle>
          <AddFollowUpDialog customerId={customerId} />
        </CardHeader>
        <CardContent>
          <FollowUpsList followUps={customer.follow_ups} customerId={customerId} />
        </CardContent>
      </Card>

      {/* Timeline Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Timeline customerId={customerId} />
        </CardContent>
      </Card>
    </div>
  )
}

function CustomerProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-24" />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>

      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
