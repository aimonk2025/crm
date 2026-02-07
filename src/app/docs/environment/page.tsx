import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Environment Variables | SimpleCRM Docs',
  description: 'Configure SimpleCRM environment variables',
}

export default function EnvironmentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Environment Variables</h1>
        <p className="text-muted-foreground mt-2">
          Configure SimpleCRM with the required environment variables.
        </p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Security Warning</AlertTitle>
        <AlertDescription>
          Never commit your <code>.env.local</code> file to version control.
          Keep your API keys secret, especially the service role key.
        </AlertDescription>
      </Alert>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Required Variables</h2>
        <p>
          These environment variables are required for SimpleCRM to function.
          You can find these values in your Supabase project settings.
        </p>
      </div>

      <div className="space-y-4">
        <EnvCard
          name="NEXT_PUBLIC_SUPABASE_URL"
          description="Your Supabase project URL"
          example="https://abcdefghijklmnop.supabase.co"
          location="Project Settings → API → URL"
        />

        <EnvCard
          name="NEXT_PUBLIC_SUPABASE_ANON_KEY"
          description="The anonymous/public API key for Supabase. Safe to expose in the browser."
          example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          location="Project Settings → API → anon/public key"
        />

        <EnvCard
          name="SUPABASE_SERVICE_ROLE_KEY"
          description="The service role key for server-side operations. Keep this secret!"
          example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          location="Project Settings → API → service_role key"
          isSecret
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Example .env.local File</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-mono">.env.local</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here`}</code>
          </pre>
        </CardContent>
      </Card>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>Deployment Variables</h2>
        <p>
          When deploying to Vercel or another platform, make sure to add these
          same environment variables in your deployment settings.
        </p>

        <h3>Vercel Deployment</h3>
        <ol>
          <li>Go to your Vercel project settings</li>
          <li>Navigate to Environment Variables</li>
          <li>Add each variable with the appropriate value</li>
          <li>Make sure to add them for Production, Preview, and Development</li>
        </ol>
      </div>

      <div className="flex gap-4 pt-4">
        <Link
          href="/docs/features"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Features Overview →
        </Link>
      </div>
    </div>
  )
}

function EnvCard({
  name,
  description,
  example,
  location,
  isSecret = false,
}: {
  name: string
  description: string
  example: string
  location: string
  isSecret?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-mono flex items-center gap-2">
          {name}
          {isSecret && (
            <span className="text-xs px-2 py-0.5 rounded bg-destructive text-destructive-foreground font-sans">
              SECRET
            </span>
          )}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div>
          <span className="text-muted-foreground">Example: </span>
          <code className="bg-muted px-1 rounded">{example}</code>
        </div>
        <div>
          <span className="text-muted-foreground">Find it: </span>
          {location}
        </div>
      </CardContent>
    </Card>
  )
}
