import { DocsSidebar } from '@/components/features/docs/docs-sidebar'

export const metadata = {
  title: 'Documentation | SimpleCRM',
  description: 'Learn how to set up and use SimpleCRM',
}

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-10 px-6">
          {children}
        </div>
      </main>
    </div>
  )
}
