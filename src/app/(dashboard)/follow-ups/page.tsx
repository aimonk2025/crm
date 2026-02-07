import { PageHeader } from '@/components/ui/page-header'
import { FollowUpsPageList } from '@/components/features/follow-ups/follow-ups-page-list'

export const metadata = {
  title: 'Follow-ups | SimpleCRM',
  description: 'Manage your follow-ups',
}

export default function FollowUpsPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Follow-ups"
        description="Today's and overdue follow-ups"
      />

      <FollowUpsPageList />
    </div>
  )
}
