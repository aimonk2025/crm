import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CustomerList } from '@/components/features/customers/customer-list'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Customers | SimpleCRM',
  description: 'Manage your customers',
}

export default function CustomersPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Customers"
        description="Manage your customer relationships"
        action={
          <Button asChild className="hidden md:inline-flex">
            <Link href="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        }
      />

      <CustomerList />
    </div>
  )
}
