import { PageHeader } from '@/components/ui/page-header'
import { TagManager } from '@/components/features/tags/tag-manager'

export const metadata = {
  title: 'Tags | Settings | SimpleCRM',
  description: 'Manage your customer tags',
}

export default function TagsSettingsPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Tags"
        description="Create and manage tags to organize your customers"
      />

      <TagManager />
    </div>
  )
}
