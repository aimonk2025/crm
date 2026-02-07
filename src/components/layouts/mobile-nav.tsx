'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, CalendarCheck, Plus, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/',
    label: 'Customers',
    icon: Users,
  },
  {
    href: '/customers/new',
    label: 'Add',
    icon: Plus,
    isAction: true,
  },
  {
    href: '/follow-ups',
    label: 'Follow-ups',
    icon: CalendarCheck,
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/' || (pathname.startsWith('/customers') && pathname !== '/customers/new')
              : item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 text-xs transition-colors',
                item.isAction
                  ? 'text-primary'
                  : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', item.isAction && 'h-6 w-6')} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
