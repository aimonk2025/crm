'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateCustomer } from '@/lib/hooks/use-customers'
import { customerSchema, type CustomerFormData } from '@/lib/validations/customer'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const sources = [
  { value: 'manual', label: 'Manual Entry' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'other', label: 'Other' },
]

export function CustomerForm() {
  const router = useRouter()
  const createCustomer = useCreateCustomer()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      source: 'manual',
      note: '',
    },
  })

  async function onSubmit(data: CustomerFormData) {
    setIsLoading(true)

    try {
      const customer = await createCustomer.mutateAsync({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        source: data.source,
        note: data.note || undefined,
      })

      toast.success('Customer created successfully')
      router.push(`/customers/${customer.id}`)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('DUPLICATE_PHONE:')) {
          const existingId = error.message.split(':')[1]
          toast.error('A customer with this phone number already exists', {
            action: {
              label: 'View',
              onClick: () => router.push(`/customers/${existingId}`),
            },
          })
        } else {
          toast.error(error.message)
        }
      } else {
        toast.error('Failed to create customer')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Customer name"
                disabled={isLoading}
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Phone number"
                disabled={isLoading}
                {...form.register('phone')}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address (optional)"
                disabled={isLoading}
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                defaultValue="manual"
                onValueChange={(value) => form.setValue('source', value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this customer (optional)"
              rows={3}
              disabled={isLoading}
              {...form.register('note')}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1 md:flex-none">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Customer
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              asChild
            >
              <Link href="/">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
