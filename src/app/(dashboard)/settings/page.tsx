'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeSettings } from '@/components/features/settings/theme-settings'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Download, LogOut, Loader2, Tags, ChevronRight, FormInput } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    router.push('/login')
    router.refresh()
  }

  async function handleExport() {
    setIsExporting(true)
    try {
      const response = await fetch('/api/export/customers')
      if (!response.ok) throw new Error('Export failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-export-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Export downloaded')
    } catch {
      toast.error('Export failed')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="container py-6 space-y-6">
      <PageHeader title="Settings" />

      <div className="space-y-4">
        <ThemeSettings />

        <Card>
          <CardHeader>
            <CardTitle>Organization</CardTitle>
            <CardDescription>Organize your customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/settings/tags">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <Tags className="h-4 w-4 mr-2" />
                  Manage Tags
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/settings/custom-fields">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center">
                  <FormInput className="h-4 w-4 mr-2" />
                  Custom Fields
                </span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>Export your customer data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export to CSV'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
