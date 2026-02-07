import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Installation | SimpleCRM Docs',
  description: 'How to install and set up SimpleCRM',
}

export default function SetupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="text-muted-foreground mt-2">
          Get SimpleCRM running in just a few minutes.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Prerequisites</AlertTitle>
        <AlertDescription>
          You&apos;ll need Node.js 18+, pnpm, and a Supabase account (free tier works).
        </AlertDescription>
      </Alert>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>1. Clone the Repository</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>git clone https://github.com/yourusername/simplecrm.git{'\n'}cd simplecrm{'\n'}pnpm install</code>
        </pre>

        <h2>2. Create a Supabase Project</h2>
        <ol>
          <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> and create an account</li>
          <li>Create a new project</li>
          <li>Wait for the database to be provisioned</li>
          <li>Go to Project Settings → API to find your keys</li>
        </ol>

        <h2>3. Set Up Environment Variables</h2>
        <p>Copy the example environment file:</p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>cp .env.example .env.local</code>
        </pre>
        <p>Then edit <code>.env.local</code> with your Supabase credentials:</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">.env.local</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>4. Set Up the Database</h2>
        <p>
          Run the database migrations in your Supabase SQL Editor. You&apos;ll find the migration
          files in the <code>supabase/migrations/</code> folder.
        </p>
        <ol>
          <li>Go to your Supabase dashboard → SQL Editor</li>
          <li>Open <code>supabase/migrations/001_initial_schema.sql</code></li>
          <li>Copy and run the SQL</li>
          <li>Repeat for any additional migration files (002, 003, etc.)</li>
        </ol>

        <h2>5. Enable Email Auth</h2>
        <ol>
          <li>In Supabase, go to Authentication → Providers</li>
          <li>Enable Email provider</li>
          <li>Optionally configure SMTP for production emails</li>
        </ol>

        <h2>6. Run the Development Server</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>pnpm dev</code>
        </pre>
        <p>
          Open <a href="http://localhost:3000">http://localhost:3000</a> in your browser.
          Register an account to get started!
        </p>

        <h2>7. Build for Production</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>pnpm build{'\n'}pnpm start</code>
        </pre>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          href="/docs/database"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Database Setup →
        </Link>
        <Link
          href="/docs/environment"
          className="inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted transition-colors"
        >
          Environment Variables →
        </Link>
      </div>
    </div>
  )
}
