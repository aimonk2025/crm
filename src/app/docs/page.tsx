import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowRight, Users, Tag, FormInput, Calendar, FileText, CreditCard, Globe, Rocket } from 'lucide-react'

export default function DocsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SimpleCRM Documentation</h1>
        <p className="text-muted-foreground mt-2">
          A simple, self-hosted customer memory system for small businesses.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>What is SimpleCRM?</h2>
        <p>
          SimpleCRM is an open-source CRM designed for small businesses who need a simple way
          to track customers, payments, and follow-ups. Built with Next.js, Supabase, and
          modern web technologies, it&apos;s easy to self-host and customize.
        </p>

        <h2>Key Features</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FeatureCard
          icon={Users}
          title="Customer Management"
          description="Track customers with status, notes, and complete history"
        />
        <FeatureCard
          icon={Tag}
          title="Tags & Labels"
          description="Organize customers with custom color-coded tags"
        />
        <FeatureCard
          icon={FormInput}
          title="Custom Fields"
          description="Add custom fields to capture business-specific data"
        />
        <FeatureCard
          icon={Calendar}
          title="Follow-ups"
          description="Schedule and track follow-up tasks with reminders"
        />
        <FeatureCard
          icon={CreditCard}
          title="Payment Tracking"
          description="Record payments and track totals per customer"
        />
        <FeatureCard
          icon={FileText}
          title="Public Lead Form"
          description="Embed a form on your website to capture leads"
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Getting Started</h2>
        <p>
          Ready to set up SimpleCRM? Follow our guides to get started in minutes.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/docs/setup"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Rocket className="h-4 w-4" />
          Installation Guide
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/docs/integration"
          className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
        >
          <Globe className="h-4 w-4" />
          Deployment & Integration
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
