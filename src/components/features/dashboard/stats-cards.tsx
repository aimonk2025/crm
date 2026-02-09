'use client'

import { useDashboard } from '@/lib/hooks/use-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import {
  Users,
  UserPlus,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  CalendarCheck,
  AlertTriangle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const statusConfig = {
  new: { label: 'New', icon: UserPlus, color: 'text-blue-600' },
  contacted: { label: 'Contacted', icon: UserCheck, color: 'text-yellow-600' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-purple-600' },
  completed: { label: 'Completed', icon: CheckCircle, color: 'text-green-600' },
  lost: { label: 'Lost', icon: XCircle, color: 'text-gray-500' },
} as const

export function StatsCards() {
  const { data: stats, isLoading, error, refetch } = useDashboard()

  if (isLoading) {
    return <StatsCardsSkeleton />
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load dashboard"
        onRetry={() => refetch()}
      />
    )
  }

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-16">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          href="/"
        />
        <StatsCard
          title="Payments (This Month)"
          value={formatCurrency(stats.paymentsThisMonth)}
          icon={IndianRupee}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Due Today"
          value={stats.followUpsDueToday}
          icon={CalendarCheck}
          href="/follow-ups"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Overdue"
          value={stats.overdueFollowUps}
          icon={AlertTriangle}
          href="/follow-ups"
          iconColor={stats.overdueFollowUps > 0 ? 'text-red-600' : 'text-gray-400'}
          highlight={stats.overdueFollowUps > 0}
        />
      </div>

      {/* Customers by Status */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-6">
          Customers by Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(
            (status) => {
              const config = statusConfig[status]
              const count = stats.customersByStatus[status]

              return (
                <Link
                  key={status}
                  href={`/customers/status/${status}`}
                  className="block"
                >
                  <Card className="hover:shadow-md hover:border-border transition-all duration-200 cursor-pointer border-border/50">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-background">
                          <config.icon
                            className={cn('h-4 w-4 sm:h-5 sm:w-5', config.color)}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xl sm:text-2xl font-bold tracking-tight">{count}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {config.label}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  href?: string
  iconColor?: string
  highlight?: boolean
}

function StatsCard({
  title,
  value,
  icon: Icon,
  href,
  iconColor = 'text-muted-foreground',
  highlight = false,
}: StatsCardProps) {
  const content = (
    <Card
      className={cn(
        'transition-all duration-200 border-border/50',
        href && 'hover:shadow-md hover:border-border cursor-pointer',
        highlight && 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/20'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5', iconColor)} />
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xl sm:text-2xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function StatsCardsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <div>
                    <Skeleton className="h-8 w-8 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}
