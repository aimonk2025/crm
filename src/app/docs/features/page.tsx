import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import {
  Users,
  UserPlus,
  FileText,
  CreditCard,
  Calendar,
  Tag,
  FormInput,
  LayoutDashboard,
  FileDown,
  Globe,
} from 'lucide-react'

export const metadata = {
  title: 'Features Overview | SimpleCRM Docs',
  description: 'Complete list of SimpleCRM features',
}

const features = [
  {
    icon: Users,
    title: 'Customer Management',
    description: 'View and manage all your customers in one place',
    details: [
      'Search customers by name or phone',
      'Filter by status (New, Contacted, In Progress, Completed, Lost)',
      'View complete customer history',
      'Quick access via sidebar navigation',
    ],
  },
  {
    icon: UserPlus,
    title: 'Add Customers',
    description: 'Quickly add new customers to your database',
    details: [
      'Name and phone number required',
      'Optional email and source tracking',
      'Duplicate phone detection',
      'Auto-redirect to customer profile',
    ],
  },
  {
    icon: FileText,
    title: 'Notes',
    description: 'Keep detailed notes about customer interactions',
    details: [
      'Add notes directly on customer profile',
      'Chronological note history',
      'Delete notes when needed',
      'Notes appear in activity timeline',
    ],
  },
  {
    icon: CreditCard,
    title: 'Payment Tracking',
    description: 'Record and track all customer payments',
    details: [
      'Log payments with amount and date',
      'Track payment mode (Cash, UPI, Bank, Other)',
      'View total paid per customer',
      'Optional payment description',
    ],
  },
  {
    icon: Calendar,
    title: 'Follow-ups',
    description: 'Never forget to follow up with customers',
    details: [
      'Schedule follow-ups with dates',
      'View today\'s and overdue follow-ups',
      'Mark as complete when done',
      'Reschedule if needed',
    ],
  },
  {
    icon: Tag,
    title: 'Tags & Labels',
    description: 'Organize customers with color-coded tags',
    details: [
      'Create unlimited tags',
      'Choose custom colors',
      'Assign multiple tags per customer',
      'Manage tags in settings',
    ],
  },
  {
    icon: FormInput,
    title: 'Custom Fields',
    description: 'Add custom data fields for your business needs',
    details: [
      'Create text, number, date, or dropdown fields',
      'Mark fields as required or optional',
      'Reorder fields as needed',
      'Values displayed on customer profile',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    description: 'Get an overview of your business at a glance',
    details: [
      'Total customer count',
      'Customers by status breakdown',
      'This month\'s payment total',
      'Follow-ups due today and overdue',
    ],
  },
  {
    icon: FileDown,
    title: 'Data Export',
    description: 'Export your customer data anytime',
    details: [
      'Export all customers to CSV',
      'UTF-8 encoding for special characters',
      'Includes all customer fields',
      'One-click download',
    ],
  },
  {
    icon: Globe,
    title: 'Public Lead Form',
    description: 'Capture leads directly from your website',
    details: [
      'Embeddable form for your website',
      'No authentication required for visitors',
      'Leads automatically added as customers',
      'Source tracked as "website"',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Features Overview</h1>
        <p className="text-muted-foreground mt-2">
          A complete guide to all SimpleCRM features.
        </p>
      </div>

      <div className="space-y-6">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.title}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  {feature.title}
                </CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {feature.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Need Help?</h2>
        <p>
          If you have questions or run into issues, please open an issue on GitHub.
          We&apos;re happy to help!
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          ← Back to Docs Home
        </Link>
      </div>
    </div>
  )
}
