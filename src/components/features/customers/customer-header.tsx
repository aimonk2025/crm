'use client'

import { Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from './status-badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useUpdateCustomer } from '@/lib/hooks/use-customers'
import { useCustomerTags, useSetCustomerTags } from '@/lib/hooks/use-tags'
import { TagSelector } from '@/components/features/tags/tag-selector'
import { toast } from 'sonner'
import Link from 'next/link'
import type { Customer, CustomerStatus } from '@/types/customer'
import type { Tag } from '@/types/tag'

const statuses: { value: CustomerStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'lost', label: 'Lost' },
]

interface CustomerHeaderProps {
  customer: Customer
}

export function CustomerHeader({ customer }: CustomerHeaderProps) {
  const updateCustomer = useUpdateCustomer()
  const { data: customerTags = [] } = useCustomerTags(customer.id)
  const setCustomerTags = useSetCustomerTags()

  async function handleStatusChange(status: CustomerStatus) {
    try {
      await updateCustomer.mutateAsync({
        id: customer.id,
        data: { status },
      })
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function handleTagsChange(tags: Tag[]) {
    try {
      await setCustomerTags.mutateAsync({
        customerId: customer.id,
        tagIds: tags.map((t) => t.id),
      })
    } catch {
      // Error handled by mutation
    }
  }

  const phoneUrl = `tel:${customer.phone}`
  const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}`

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div>
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">{customer.phone}</p>
            {customer.email && (
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            )}
          </div>
          <TagSelector
            selectedTags={customerTags}
            onTagsChange={handleTagsChange}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={customer.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue>
                <StatusBadge status={customer.status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" asChild>
            <a href={phoneUrl}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
