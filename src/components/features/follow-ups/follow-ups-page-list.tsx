'use client'

import { useRouter } from 'next/navigation'
import { format, isToday, isPast } from 'date-fns'
import { Check, Phone, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useFollowUps, useCompleteFollowUp } from '@/lib/hooks/use-follow-ups'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { FollowUpWithCustomer } from '@/types/customer'

export function FollowUpsPageList() {
  const router = useRouter()
  const { data: followUps, isLoading, error, refetch } = useFollowUps('all')
  const completeFollowUp = useCompleteFollowUp()

  async function handleComplete(followUp: FollowUpWithCustomer, e: React.MouseEvent) {
    e.stopPropagation()
    try {
      await completeFollowUp.mutateAsync({
        id: followUp.id,
        customerId: followUp.customer_id,
      })
      toast.success('Follow-up completed')
    } catch {
      toast.error('Failed to complete follow-up')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load follow-ups"
        onRetry={() => refetch()}
      />
    )
  }

  if (!followUps || followUps.length === 0) {
    return (
      <EmptyState
        message="All caught up!"
        description="No pending follow-ups"
      />
    )
  }

  // Group by overdue and today
  const overdue = followUps.filter((f) => {
    const date = new Date(f.due_date)
    return isPast(date) && !isToday(date)
  })

  const today = followUps.filter((f) => isToday(new Date(f.due_date)))

  const upcoming = followUps.filter((f) => {
    const date = new Date(f.due_date)
    return !isPast(date) && !isToday(date)
  })

  return (
    <div className="space-y-6">
      {overdue.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-destructive flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-destructive" />
            Overdue ({overdue.length})
          </h2>
          <div className="space-y-2">
            {overdue.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                variant="overdue"
                onClick={() => router.push(`/customers/${followUp.customer_id}`)}
                onComplete={(e) => handleComplete(followUp, e)}
              />
            ))}
          </div>
        </div>
      )}

      {today.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-yellow-600 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            Today ({today.length})
          </h2>
          <div className="space-y-2">
            {today.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                variant="today"
                onClick={() => router.push(`/customers/${followUp.customer_id}`)}
                onComplete={(e) => handleComplete(followUp, e)}
              />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-muted-foreground" />
            Upcoming ({upcoming.length})
          </h2>
          <div className="space-y-2">
            {upcoming.map((followUp) => (
              <FollowUpCard
                key={followUp.id}
                followUp={followUp}
                variant="upcoming"
                onClick={() => router.push(`/customers/${followUp.customer_id}`)}
                onComplete={(e) => handleComplete(followUp, e)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FollowUpCardProps {
  followUp: FollowUpWithCustomer
  variant: 'overdue' | 'today' | 'upcoming'
  onClick: () => void
  onComplete: (e: React.MouseEvent) => void
}

function FollowUpCard({ followUp, variant, onClick, onComplete }: FollowUpCardProps) {
  const dueDate = new Date(followUp.due_date)

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer hover:bg-accent/50 transition-colors',
        variant === 'overdue' && 'border-destructive/50 bg-destructive/5',
        variant === 'today' && 'border-yellow-500/50 bg-yellow-500/5'
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{followUp.customer.name}</h3>
            {variant === 'overdue' && (
              <Badge variant="destructive" className="text-xs">Overdue</Badge>
            )}
            {variant === 'today' && (
              <Badge className="bg-yellow-500 text-xs">Today</Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {followUp.customer.phone}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(dueDate, 'MMM d')}
            </span>
          </div>
          {followUp.note && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {followUp.note}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-10 w-10"
          onClick={onComplete}
        >
          <Check className="h-5 w-5 text-green-500" />
        </Button>
      </div>
    </Card>
  )
}
