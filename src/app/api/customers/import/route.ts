import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface ImportCustomer {
  name: string
  email?: string
  phone?: string
  company?: string
}

interface ImportRequest {
  customers: ImportCustomer[]
  duplicateStrategy: 'skip' | 'update'
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as ImportRequest
    const { customers, duplicateStrategy } = body

    if (!customers || !Array.isArray(customers)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    let successCount = 0
    let failedCount = 0
    let skippedCount = 0

    for (const customer of customers) {
      try {
        if (customer.email) {
          // Check for duplicate by email
          const { data: existing } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', user.id)
            .eq('email', customer.email)
            .single()

          if (existing) {
            if (duplicateStrategy === 'skip') {
              skippedCount++
              continue
            } else if (duplicateStrategy === 'update') {
              // Update existing customer
              const { error: updateError } = await supabase
                .from('customers')
                .update({
                  name: customer.name,
                  phone: customer.phone || null,
                  company: customer.company || null,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)

              if (updateError) {
                failedCount++
                continue
              }
              successCount++
              continue
            }
          }
        }

        // Insert new customer
        const { error: insertError } = await supabase.from('customers').insert({
          user_id: user.id,
          name: customer.name,
          email: customer.email || null,
          phone: customer.phone || null,
          company: customer.company || null,
          status: 'active',
          source: 'import',
        })

        if (insertError) {
          failedCount++
          continue
        }

        successCount++
      } catch {
        failedCount++
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      skipped: skippedCount,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({ error: 'Import failed' }, { status: 500 })
  }
}
