'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useDashboard } from '@/lib/hooks/use-dashboard'
import { getRecentActivity } from '@/lib/api/dashboard'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { Users, Bell, IndianRupee, Clock, UserPlus, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getRelativeTime(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    return 'Just now'
  }
  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  }
  if (diffDays === 1) {
    return 'Yesterday'
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`
  }
  return then.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboard()
  const { data: activities = [], isLoading: activitiesLoading, error: activitiesError, refetch: refetchActivities } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => getRecentActivity(10),
    staleTime: 30 * 1000,
  })

  const isLoading = statsLoading || activitiesLoading
  const error = statsError || activitiesError

  if (error) {
    return (
      <div className="container py-6">
        <ErrorState
          message="Failed to load dashboard"
          onRetry={() => {
            refetchStats()
            refetchActivities()
          }}
        />
      </div>
    )
  }

  return (
    <div className="container py-4 sm:py-6">
      <div className="mb-6 sm:mb-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your business"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {isLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="TOTAL CUSTOMERS"
              value={stats?.totalCustomers || 0}
              icon={Users}
              iconColor="text-muted-foreground"
            />
            <StatCard
              label="PENDING FOLLOW-UPS"
              value={stats?.followUpsDueToday || 0}
              icon={Bell}
              iconColor="text-muted-foreground"
              href="/follow-ups"
            />
            <StatCard
              label="THIS MONTH"
              value={formatCurrency(stats?.paymentsThisMonth || 0)}
              icon={IndianRupee}
              iconColor="text-muted-foreground"
            />
            <StatCard
              label="NEW THIS WEEK"
              value={stats?.newThisWeek || 0}
              icon={Clock}
              iconColor="text-muted-foreground"
            />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Recent Activity
        </h3>
        {isLoading ? (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : activities.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 text-center">
              <p className="text-sm sm:text-base text-muted-foreground">
                No recent activity. Start by adding customers or recording payments.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="space-y-3 sm:space-y-4">
                {activities.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  const iconBgColor = getActivityIconBg(activity.type)

                  return (
                    <div key={activity.id} className="flex items-start gap-2 sm:gap-3">
                      <div className={cn('p-1.5 sm:p-2 rounded-full flex-shrink-0', iconBgColor)}>
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground break-words">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {getRelativeTime(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  href?: string
}

function StatCard({ label, value, icon: Icon, iconColor = 'text-muted-foreground', href }: StatCardProps) {
  const content = (
    <Card className={cn('transition-all duration-200', href && 'hover:shadow-md cursor-pointer active:bg-accent/50')}>
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-1 sm:mb-2">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide line-clamp-1">
            {label}
          </p>
          <Icon className={cn('h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0', iconColor)} />
        </div>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
          {value}
        </p>
      </CardContent>
    </Card>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'customer_created':
      return UserPlus
    case 'payment_added':
      return CreditCard
    case 'follow_up_completed':
      return Bell
    default:
      return UserPlus
  }
}

function getActivityIconBg(type: string) {
  switch (type) {
    case 'customer_created':
      return 'bg-blue-100 dark:bg-blue-950'
    case 'payment_added':
      return 'bg-green-100 dark:bg-green-950'
    case 'follow_up_completed':
      return 'bg-purple-100 dark:bg-purple-950'
    default:
      return 'bg-gray-100 dark:bg-gray-950'
  }
}
