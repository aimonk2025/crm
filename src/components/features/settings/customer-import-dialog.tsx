'use client'

import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, AlertCircle, CheckCircle2, Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface ParsedCustomer {
  name: string
  email?: string
  phone?: string
  company?: string
  isValid: boolean
  errors: string[]
}

interface ImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CustomerImportDialog({ open, onOpenChange }: ImportDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedCustomer[]>([])
  const [duplicateStrategy, setDuplicateStrategy] = useState<'skip' | 'update'>('skip')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importResults, setImportResults] = useState<{ success: number; failed: number; skipped: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }

    setFile(selectedFile)
    setIsProcessing(true)
    setImportResults(null)

    try {
      const text = await selectedFile.text()
      const parsed = parseCSV(text)
      setParsedData(parsed)
    } catch (error) {
      toast.error('Failed to parse CSV file')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  const parseCSV = (text: string): ParsedCustomer[] => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const nameIndex = headers.findIndex(h => h === 'name')
    const emailIndex = headers.findIndex(h => h === 'email')
    const phoneIndex = headers.findIndex(h => h === 'phone')
    const companyIndex = headers.findIndex(h => h === 'company')

    const customers: ParsedCustomer[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      const errors: string[] = []

      const name = nameIndex >= 0 ? values[nameIndex] : ''
      const email = emailIndex >= 0 ? values[emailIndex] : ''
      const phone = phoneIndex >= 0 ? values[phoneIndex] : ''
      const company = companyIndex >= 0 ? values[companyIndex] : ''

      if (!name) {
        errors.push('Name is required')
      }

      if (email && !isValidEmail(email)) {
        errors.push('Invalid email format')
      }

      customers.push({
        name,
        email: email || undefined,
        phone: phone || undefined,
        company: company || undefined,
        isValid: errors.length === 0,
        errors,
      })
    }

    return customers
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleImport = async () => {
    if (parsedData.length === 0) return

    const validCustomers = parsedData.filter(c => c.isValid)
    if (validCustomers.length === 0) {
      toast.error('No valid customers to import')
      return
    }

    setIsImporting(true)

    try {
      const response = await fetch('/api/customers/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customers: validCustomers,
          duplicateStrategy,
        }),
      })

      if (!response.ok) throw new Error('Import failed')

      const results = await response.json()
      setImportResults(results)
      toast.success(`Successfully imported ${results.success} customers`)
    } catch (error) {
      toast.error('Failed to import customers')
      console.error(error)
    } finally {
      setIsImporting(false)
    }
  }

  const handleDownloadTemplate = () => {
    const csv = 'name,email,phone,company\n'
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'customer-import-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClose = () => {
    setFile(null)
    setParsedData([])
    setImportResults(null)
    setDuplicateStrategy('skip')
    onOpenChange(false)
  }

  const validCount = parsedData.filter(c => c.isValid).length
  const invalidCount = parsedData.length - validCount

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Customers</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import customers. Required field: <span className="font-bold underline">name</span>. Optional: email, phone, company.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>

          {/* File Upload */}
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-[#c0c5ca]" />
            <p className="text-sm text-[#0d0e0d] mb-2">
              {file ? file.name : 'Choose a CSV file or drag and drop'}
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Select File'
              )}
            </Button>
          </div>

          {/* Preview */}
          {parsedData.length > 0 && !importResults && (
            <>
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Found {parsedData.length} customers: {validCount} valid, {invalidCount} invalid
                </AlertDescription>
              </Alert>

              {invalidCount > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {invalidCount} customers have validation errors and will be skipped
                  </AlertDescription>
                </Alert>
              )}

              {/* Duplicate Strategy */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">How should we handle duplicate emails?</Label>
                <RadioGroup value={duplicateStrategy} onValueChange={(v) => setDuplicateStrategy(v as 'skip' | 'update')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="skip" id="skip" />
                    <Label htmlFor="skip" className="font-normal cursor-pointer">
                      Skip duplicates (keep existing customers)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="update" id="update" />
                    <Label htmlFor="update" className="font-normal cursor-pointer">
                      Update duplicates (overwrite existing data)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Preview Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#f8f7f6] sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.slice(0, 50).map((customer, i) => (
                        <tr key={i} className="border-t">
                          <td className="px-4 py-2">
                            {customer.isValid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                          </td>
                          <td className="px-4 py-2">{customer.name || '-'}</td>
                          <td className="px-4 py-2">{customer.email || '-'}</td>
                          <td className="px-4 py-2">{customer.phone || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.length > 50 && (
                  <div className="px-4 py-2 text-xs text-[#c0c5ca] bg-[#f8f7f6] border-t">
                    Showing first 50 of {parsedData.length} customers
                  </div>
                )}
              </div>
            </>
          )}

          {/* Import Results */}
          {importResults && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Import complete: {importResults.success} imported, {importResults.skipped} skipped, {importResults.failed} failed
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          {importResults ? (
            <Button onClick={handleClose}>Close</Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={parsedData.length === 0 || validCount === 0 || isImporting}
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  `Import ${validCount} Customers`
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
