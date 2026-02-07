import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all customers with related data
    const { data: customers, error } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        phone,
        email,
        status,
        source,
        created_at,
        updated_at,
        payments:payments(amount),
        notes:notes(content)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Generate CSV content
    const headers = [
      'Name',
      'Phone',
      'Email',
      'Status',
      'Source',
      'Total Payments',
      'Notes Count',
      'Created At',
    ]

    const rows = customers.map((c) => {
      const totalPayments = (c.payments as { amount: number }[])?.reduce(
        (sum, p) => sum + Number(p.amount),
        0
      ) || 0
      const notesCount = (c.notes as { content: string }[])?.length || 0

      return [
        c.name,
        c.phone,
        c.email || '',
        c.status,
        c.source,
        totalPayments.toString(),
        notesCount.toString(),
        new Date(c.created_at).toISOString(),
      ]
    })

    // Escape CSV values
    const escapeCSV = (value: string) => {
      if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map(escapeCSV).join(',')),
    ].join('\n')

    // Add BOM for UTF-8 encoding (helps with Hindi names in Excel)
    const bom = '\uFEFF'
    const csvWithBom = bom + csvContent

    const filename = `customers-export-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
