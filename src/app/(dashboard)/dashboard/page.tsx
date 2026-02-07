import { PageHeader } from '@/components/ui/page-header'
import { StatsCards } from '@/components/features/dashboard/stats-cards'

export const metadata = {
  title: 'Dashboard | SimpleCRM',
  description: 'Overview of your CRM data',
}

export default function DashboardPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your customers and tasks"
      />

      <StatsCards />
    </div>
  )
}
