'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { StatusBadge } from './status-badge'
import { TagList } from '@/components/features/tags/tag-badge'
import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { CustomerWithTags } from '@/types/customer'

interface CustomerCardProps {
  customer: CustomerWithTags
  className?: string
}

export function CustomerCard({ customer, className }: CustomerCardProps) {
  const router = useRouter()

  return (
    <Card
      className={cn(
        'p-3 sm:p-4 cursor-pointer hover:bg-accent/50 transition-colors active:bg-accent',
        className
      )}
      onClick={() => router.push(`/customers/${customer.id}`)}
    >
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-medium truncate text-sm sm:text-base">{customer.name}</h3>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Phone className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{customer.phone}</span>
          </div>
          {customer.tags && customer.tags.length > 0 && (
            <TagList tags={customer.tags} size="sm" />
          )}
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(customer.updated_at), { addSuffix: true })}
          </p>
        </div>
        <div className="flex-shrink-0">
          <StatusBadge status={customer.status} />
        </div>
      </div>
    </Card>
  )
}

export function CustomerCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-3 w-20 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      </div>
    </Card>
  )
}
