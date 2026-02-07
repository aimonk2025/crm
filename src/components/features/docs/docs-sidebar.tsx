'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, Rocket, Database, Settings, Key } from 'lucide-react'

const docsNavigation = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs', label: 'Introduction', icon: BookOpen },
      { href: '/docs/setup', label: 'Installation', icon: Rocket },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { href: '/docs/database', label: 'Database Setup', icon: Database },
      { href: '/docs/environment', label: 'Environment Variables', icon: Key },
    ],
  },
  {
    title: 'Usage',
    items: [
      { href: '/docs/features', label: 'Features Overview', icon: Settings },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 shrink-0 border-r bg-muted/30">
      <div className="sticky top-0 h-screen overflow-y-auto py-6 px-4">
        <Link href="/docs" className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5" />
          <span className="font-semibold">SimpleCRM Docs</span>
        </Link>

        <nav className="space-y-6">
          {docsNavigation.map((section) => (
            <div key={section.title}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {section.title}
              </h4>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            &larr; Back to App
          </Link>
        </div>
      </div>
    </aside>
  )
}
