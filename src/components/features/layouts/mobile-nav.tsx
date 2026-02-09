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
    href: '/customers',
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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive =
            item.href === '/customers'
              ? pathname === '/customers' || (pathname.startsWith('/customers') && pathname !== '/customers/new')
              : item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1 text-[10px] transition-colors active:bg-accent/50',
                item.isAction
                  ? 'text-primary font-medium'
                  : isActive
                    ? 'text-primary font-medium'
                    : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', item.isAction && 'h-6 w-6')} />
              <span className="leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
