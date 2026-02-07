import { PageHeader } from '@/components/ui/page-header'
import { CustomerForm } from '@/components/features/customers/customer-form'

export const metadata = {
  title: 'Add Customer | SimpleCRM',
  description: 'Add a new customer',
}

export default function NewCustomerPage() {
  return (
    <div className="container py-6 space-y-6 max-w-2xl">
      <PageHeader
        title="Add Customer"
        description="Create a new customer record"
      />

      <CustomerForm />
    </div>
  )
}
