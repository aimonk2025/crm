import { PageHeader } from '@/components/ui/page-header'
import { CustomFieldManager } from '@/components/features/settings/custom-field-manager'

export const metadata = {
  title: 'Custom Fields | Settings | SimpleCRM',
  description: 'Manage your custom customer fields',
}

export default function CustomFieldsSettingsPage() {
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Custom Fields"
        description="Create custom fields to capture additional customer information"
      />

      <CustomFieldManager />
    </div>
  )
}
