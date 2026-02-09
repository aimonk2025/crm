'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CustomerStatus } from '@/types/customer'

const statuses: { value: CustomerStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'lost', label: 'Lost' },
]

interface StatusFilterProps {
  value: CustomerStatus | 'all'
  onChange: (value: CustomerStatus | 'all') => void
  counts?: Record<CustomerStatus | 'all', number>
}

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant="outline"
          size="sm"
          className={cn(
            'shrink-0',
            value === status.value && 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
          onClick={() => onChange(status.value)}
        >
          {status.label}
          {counts && (
            <span className={cn(
              'ml-1.5 px-1.5 py-0.5 text-xs rounded-md',
              value === status.value
                ? 'bg-primary-foreground/20'
                : 'bg-muted'
            )}>
              {counts[status.value]}
            </span>
          )}
        </Button>
      ))}
    </div>
  )
}
