import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { CustomerStatus } from '@/types/customer'

const statusConfig: Record<CustomerStatus, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  lost: {
    label: 'Lost',
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  },
}

interface StatusBadgeProps {
  status: CustomerStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
