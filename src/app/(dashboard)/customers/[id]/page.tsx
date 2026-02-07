import { CustomerProfile } from '@/components/features/customers/customer-profile'

interface CustomerProfilePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: CustomerProfilePageProps) {
  const { id } = await params
  return {
    title: `Customer | SimpleCRM`,
    description: 'View customer details',
  }
}

export default async function CustomerProfilePage({ params }: CustomerProfilePageProps) {
  const { id } = await params

  return (
    <div className="container py-6 max-w-2xl">
      <CustomerProfile customerId={id} />
    </div>
  )
}
