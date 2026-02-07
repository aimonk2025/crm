'use client'

import { formatDistanceToNow } from 'date-fns'
import {
  UserPlus,
  RefreshCw,
  StickyNote,
  Banknote,
  CalendarPlus,
  CalendarCheck,
} from 'lucide-react'
import { useTimeline } from '@/lib/hooks/use-timeline'
import { Skeleton } from '@/components/ui/skeleton'
import type { EventType } from '@/types/customer'

const eventConfig: Record<EventType, { icon: React.ReactNode; label: string; color: string }> = {
  customer_created: {
    icon: <UserPlus className="h-4 w-4" />,
    label: 'Customer created',
    color: 'text-blue-500',
  },
  status_changed: {
    icon: <RefreshCw className="h-4 w-4" />,
    label: 'Status changed',
    color: 'text-purple-500',
  },
  note_added: {
    icon: <StickyNote className="h-4 w-4" />,
    label: 'Note added',
    color: 'text-gray-500',
  },
  payment_added: {
    icon: <Banknote className="h-4 w-4" />,
    label: 'Payment recorded',
    color: 'text-green-500',
  },
  follow_up_scheduled: {
    icon: <CalendarPlus className="h-4 w-4" />,
    label: 'Follow-up scheduled',
    color: 'text-yellow-500',
  },
  follow_up_completed: {
    icon: <CalendarCheck className="h-4 w-4" />,
    label: 'Follow-up completed',
    color: 'text-green-500',
  },
}

function getEventDescription(eventType: EventType, eventData: Record<string, unknown>): string {
  switch (eventType) {
    case 'customer_created':
      return `Added from ${eventData.source || 'manual entry'}`
    case 'status_changed':
      return `Changed from ${eventData.old_status} to ${eventData.new_status}`
    case 'note_added':
      return String(eventData.content || '').slice(0, 50) + (String(eventData.content || '').length > 50 ? '...' : '')
    case 'payment_added':
      return `${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(eventData.amount))} via ${eventData.mode}`
    case 'follow_up_scheduled':
      return `Scheduled for ${eventData.due_date}`
    case 'follow_up_completed':
      return 'Marked as done'
    default:
      return ''
  }
}

interface TimelineProps {
  customerId: string
}

export function Timeline({ customerId }: TimelineProps) {
  const { data: events, isLoading } = useTimeline(customerId)

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No activity yet
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const config = eventConfig[event.event_type]
        const description = getEventDescription(event.event_type, event.event_data)

        return (
          <div key={event.id} className="flex gap-3">
            <div className={`shrink-0 p-2 rounded-full bg-muted ${config.color}`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{config.label}</p>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
