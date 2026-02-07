import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto" />
        <div>
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  )
}
