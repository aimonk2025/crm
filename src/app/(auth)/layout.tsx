import type { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">SimpleCRM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customer memory for small businesses
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
