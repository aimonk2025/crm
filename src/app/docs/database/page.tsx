import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export const metadata = {
  title: 'Database Setup | SimpleCRM Docs',
  description: 'How to set up the SimpleCRM database',
}

export default function DatabasePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Setup</h1>
        <p className="text-muted-foreground mt-2">
          SimpleCRM uses Supabase (PostgreSQL) for data storage.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Database Schema</h2>
        <p>
          The database consists of several tables that work together to store
          customer data, notes, payments, and follow-ups.
        </p>
      </div>

      <div className="space-y-4">
        <TableCard
          name="customers"
          description="Core customer records"
          columns={[
            'id (uuid, primary key)',
            'user_id (uuid, references auth.users)',
            'name (text, required)',
            'phone (text, unique per user)',
            'email (text, optional)',
            'source (text: website, referral, walk_in, other)',
            'status (enum: new, contacted, in_progress, completed, lost)',
            'created_at, updated_at (timestamps)',
          ]}
        />

        <TableCard
          name="notes"
          description="Text notes attached to customers"
          columns={[
            'id (uuid, primary key)',
            'customer_id (uuid, references customers)',
            'user_id (uuid, references auth.users)',
            'content (text)',
            'created_at (timestamp)',
          ]}
        />

        <TableCard
          name="payments"
          description="Payment records for customers"
          columns={[
            'id (uuid, primary key)',
            'customer_id (uuid, references customers)',
            'user_id (uuid, references auth.users)',
            'amount (numeric, required)',
            'payment_date (date)',
            'payment_mode (enum: cash, upi, bank, other)',
            'description (text, optional)',
            'created_at (timestamp)',
          ]}
        />

        <TableCard
          name="follow_ups"
          description="Scheduled follow-up tasks"
          columns={[
            'id (uuid, primary key)',
            'customer_id (uuid, references customers)',
            'user_id (uuid, references auth.users)',
            'scheduled_date (date, required)',
            'note (text, optional)',
            'is_completed (boolean)',
            'completed_at (timestamp, optional)',
            'created_at (timestamp)',
          ]}
        />

        <TableCard
          name="tags"
          description="User-defined tags for organizing customers"
          columns={[
            'id (uuid, primary key)',
            'user_id (uuid, references auth.users)',
            'name (text, required)',
            'color (text, hex color)',
            'created_at (timestamp)',
          ]}
        />

        <TableCard
          name="custom_fields"
          description="User-defined custom fields"
          columns={[
            'id (uuid, primary key)',
            'user_id (uuid, references auth.users)',
            'name (text, required)',
            'field_type (enum: text, number, date, select)',
            'options (text array, for select type)',
            'is_required (boolean)',
            'display_order (integer)',
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Row Level Security (RLS)</h2>
        <p>
          All tables have Row Level Security enabled. Users can only access their
          own data. The RLS policies check that <code>user_id = auth.uid()</code>.
        </p>

        <h2>Running Migrations</h2>
        <ol>
          <li>Open your Supabase project dashboard</li>
          <li>Navigate to SQL Editor</li>
          <li>Open and run each migration file in order:
            <ul>
              <li><code>001_initial_schema.sql</code> - Core tables</li>
              <li><code>002_timeline_fix.sql</code> - Timeline improvements</li>
              <li><code>003_form_token.sql</code> - Lead form token</li>
              <li><code>004_free_enhancements.sql</code> - Tags and custom fields</li>
            </ul>
          </li>
        </ol>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          href="/docs/environment"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Environment Variables →
        </Link>
      </div>
    </div>
  )
}

function TableCard({
  name,
  description,
  columns,
}: {
  name: string
  description: string
  columns: string[]
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-mono">{name}</CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="text-sm space-y-1">
          {columns.map((col, i) => (
            <li key={i} className="text-muted-foreground">
              <code className="text-foreground">{col.split(' ')[0]}</code>
              {' '}
              {col.split(' ').slice(1).join(' ')}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
