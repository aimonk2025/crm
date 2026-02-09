'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Download, LogOut, Loader2, Tags, ChevronRight, FileText, Upload } from 'lucide-react'
import { CustomerImportDialog } from '@/components/features/settings/customer-import-dialog'

export default function SettingsPage() {
  const router = useRouter()
  const [isExporting, setIsExporting] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)

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
    <div className="container py-4 sm:py-6">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0d0e0d]">Settings</h1>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#c0c5ca]">Manage your account and preferences</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Organization Section Header */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-[#0d0e0d]">Organization</h2>
            <p className="text-xs sm:text-sm text-[#c0c5ca] mt-0.5 sm:mt-1">Organize your customers</p>
          </div>

          {/* Manage Tags Card */}
          <Link href="/settings/tags" className="block">
            <Card className="border-0 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors active:bg-accent min-h-[44px]">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <span className="flex items-center gap-2 sm:gap-3 text-[#0d0e0d] min-w-0">
                  <Tags className="h-4 w-4 sm:h-5 sm:w-5 text-[#c0c5ca] flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">Manage Tags</span>
                </span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#c0c5ca] transition-transform hover:translate-x-1 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>

          {/* Custom Fields Card */}
          <Link href="/settings/custom-fields" className="block">
            <Card className="border-0 shadow-sm cursor-pointer hover:bg-accent/50 transition-colors active:bg-accent min-h-[44px]">
              <CardContent className="flex items-center justify-between p-3 sm:p-4">
                <span className="flex items-center gap-2 sm:gap-3 text-[#0d0e0d] min-w-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#c0c5ca] flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base truncate">Custom Fields</span>
                </span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#c0c5ca] transition-transform hover:translate-x-1 flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>

          {/* Data Section */}
          <div id="data-section">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl font-semibold text-[#0d0e0d]">Data</CardTitle>
                <CardDescription className="text-xs sm:text-sm text-[#c0c5ca]">Import and export your customer data</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  onClick={() => setImportDialogOpen(true)}
                  className="border-[#c0c5ca] text-[#0d0e0d] hover:bg-[#f8f7f6] hover:text-[#0d0e0d] w-full sm:w-auto text-sm sm:text-base h-11"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Import from CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="border-[#c0c5ca] text-[#0d0e0d] hover:bg-[#f8f7f6] hover:text-[#0d0e0d] w-full sm:w-auto text-sm sm:text-base h-11"
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export to CSV'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Account Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-[#0d0e0d]">Account</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-[#c0c5ca]">Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto text-sm sm:text-base h-11"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <CustomerImportDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} />
    </div>
  )
}
