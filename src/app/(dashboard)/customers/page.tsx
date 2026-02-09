import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { CustomerList } from '@/components/features/customers/customer-list'
import { Plus, Upload } from 'lucide-react'
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
          <div className="flex gap-2">
            <Button asChild variant="outline" className="hidden md:inline-flex">
              <Link href="/settings#data-section">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Link>
            </Button>
            <Button asChild className="hidden md:inline-flex">
              <Link href="/customers/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Link>
            </Button>
          </div>
        }
      />

      <CustomerList />
    </div>
  )
}
