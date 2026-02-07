'use client'

import { format, isToday, isPast, isFuture } from 'date-fns'
import { Check, Trash2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCompleteFollowUp, useDeleteFollowUp } from '@/lib/hooks/use-follow-ups'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { FollowUp } from '@/types/customer'

interface FollowUpsListProps {
  followUps: FollowUp[]
  customerId: string
}

export function FollowUpsList({ followUps, customerId }: FollowUpsListProps) {
  const completeFollowUp = useCompleteFollowUp()
  const deleteFollowUp = useDeleteFollowUp()

  const pendingFollowUps = followUps.filter((f) => !f.completed)

  async function handleComplete(followUpId: string) {
    try {
      await completeFollowUp.mutateAsync({ id: followUpId, customerId })
      toast.success('Follow-up completed')
    } catch {
      toast.error('Failed to complete follow-up')
    }
  }

  async function handleDelete(followUpId: string) {
    try {
      await deleteFollowUp.mutateAsync({ id: followUpId, customerId })
      toast.success('Follow-up deleted')
    } catch {
      toast.error('Failed to delete follow-up')
    }
  }

  if (pendingFollowUps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No pending follow-ups
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {pendingFollowUps.map((followUp) => {
        const dueDate = new Date(followUp.due_date)
        const isOverdue = isPast(dueDate) && !isToday(dueDate)
        const isDueToday = isToday(dueDate)
        const isUpcoming = isFuture(dueDate)

        return (
          <div
            key={followUp.id}
            className={cn(
              'group flex items-center gap-3 p-3 rounded-lg',
              isOverdue && 'bg-red-50 dark:bg-red-950',
              isDueToday && 'bg-yellow-50 dark:bg-yellow-950',
              isUpcoming && 'bg-muted/50'
            )}
          >
            <div className="shrink-0">
              <Calendar className={cn(
                'h-4 w-4',
                isOverdue && 'text-red-500',
                isDueToday && 'text-yellow-500',
                isUpcoming && 'text-muted-foreground'
              )} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {format(dueDate, 'MMM d, yyyy')}
                </span>
                {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                {isDueToday && <Badge className="bg-yellow-500 text-xs">Today</Badge>}
              </div>
              {followUp.note && (
                <p className="text-xs text-muted-foreground mt-1">{followUp.note}</p>
              )}
            </div>
            <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleComplete(followUp.id)}
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDelete(followUp.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
