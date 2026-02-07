import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CustomerList } from '@/components/features/customers/customer-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CustomerStatus } from '@/types/customer'

const statusLabels: Record<CustomerStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
  lost: 'Lost',
}

const validStatuses: CustomerStatus[] = [
  'new',
  'contacted',
  'in_progress',
  'completed',
  'lost',
]

interface PageProps {
  params: Promise<{ status: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { status } = await params

  if (!validStatuses.includes(status as CustomerStatus)) {
    return { title: 'Not Found | SimpleCRM' }
  }

  const label = statusLabels[status as CustomerStatus]
  return {
    title: `${label} Customers | SimpleCRM`,
    description: `View ${label.toLowerCase()} customers`,
  }
}

export default async function StatusFilterPage({ params }: PageProps) {
  const { status } = await params

  if (!validStatuses.includes(status as CustomerStatus)) {
    notFound()
  }

  const statusValue = status as CustomerStatus
  const label = statusLabels[statusValue]

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title={`${label} Customers`}
        description={`Viewing customers with "${label}" status`}
        action={
          <Button asChild className="hidden md:inline-flex">
            <Link href="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        }
      />

      <CustomerList initialStatus={statusValue} showStatusFilter={false} />
    </div>
  )
}
