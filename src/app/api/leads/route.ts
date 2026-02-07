import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z.string().min(1).max(20),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().optional(),
})

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = leadSchema.parse(body)

    const supabase = getSupabaseAdmin()

    // Get the first user (for single-user CRM)
    // In a multi-tenant app, you'd get user from the token
    const { data: users } = await supabase
      .from('customers')
      .select('user_id')
      .limit(1)

    // If no existing customers, we can't assign to a user
    // In production, you'd have a separate users table
    const userId = users?.[0]?.user_id

    if (!userId) {
      return NextResponse.json(
        { error: 'CRM not yet configured' },
        { status: 400 }
      )
    }

    // Create customer from lead
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        user_id: userId,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        source: 'website',
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      // Check for duplicate phone
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This phone number is already registered' },
          { status: 409 }
        )
      }
      throw error
    }

    // If there's a message, add it as a note
    if (data.message) {
      await supabase.from('notes').insert({
        customer_id: customer.id,
        user_id: userId,
        content: `Lead message: ${data.message}`,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      )
    }
    console.error('Lead submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit' },
      { status: 500 }
    )
  }
}
