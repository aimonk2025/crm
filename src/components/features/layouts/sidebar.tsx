'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Users,
  CalendarCheck,
  Settings,
  Plus,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  UserPlus,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CustomerStatus } from '@/types/customer'

interface StatusItem {
  status: CustomerStatus | 'all'
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const statusItems: StatusItem[] = [
  { status: 'all', label: 'All Customers', icon: Users },
  { status: 'new', label: 'New', icon: UserPlus },
  { status: 'contacted', label: 'Contacted', icon: UserCheck },
  { status: 'in_progress', label: 'In Progress', icon: Clock },
  { status: 'completed', label: 'Completed', icon: CheckCircle },
  { status: 'lost', label: 'Lost', icon: XCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [customersExpanded, setCustomersExpanded] = useState(true)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
    router.refresh()
  }

  const isCustomersSection =
    pathname === '/customers' || pathname.startsWith('/customers')

  const isDashboard = pathname === '/dashboard'
  const isFollowUps = pathname.startsWith('/follow-ups')
  const isSettings = pathname.startsWith('/settings')

  // Get current status from URL
  const currentStatus = pathname.startsWith('/customers/status/')
    ? pathname.split('/customers/status/')[1]
    : pathname === '/customers'
      ? 'all'
      : null

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:border-r md:bg-muted/30">
      <div className="p-6">
        <h1 className="text-xl font-bold">SimpleCRM</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isDashboard
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        {/* Customers - Collapsible */}
        <div>
          <button
            onClick={() => setCustomersExpanded(!customersExpanded)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-colors',
              isCustomersSection && !isDashboard
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4" />
              Customers
            </div>
            {customersExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>

          {customersExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {statusItems.map((item) => {
                const href =
                  item.status === 'all'
                    ? '/customers'
                    : `/customers/status/${item.status}`
                const isActive = currentStatus === item.status

                return (
                  <Link
                    key={item.status}
                    href={href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Follow-ups */}
        <Link
          href="/follow-ups"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isFollowUps
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <CalendarCheck className="h-4 w-4" />
          Follow-ups
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isSettings
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </nav>

      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
