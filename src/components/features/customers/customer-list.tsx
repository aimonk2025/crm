'use client'

import { useState, useMemo } from 'react'
import { useCustomers } from '@/lib/hooks/use-customers'
import { CustomerCard, CustomerCardSkeleton } from './customer-card'
import { CustomerSearch } from './customer-search'
import { StatusFilter } from './status-filter'
import { EmptyState } from '@/components/ui/empty-state'
import { ErrorState } from '@/components/ui/error-state'
import { useRouter } from 'next/navigation'
import type { CustomerStatus } from '@/types/customer'

interface CustomerListProps {
  initialStatus?: CustomerStatus | 'all'
  showStatusFilter?: boolean
}

export function CustomerList({
  initialStatus = 'all',
  showStatusFilter = true
}: CustomerListProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CustomerStatus | 'all'>(initialStatus)

  const { data: customers, isLoading, error, refetch } = useCustomers()

  // Client-side filtering for instant feedback
  const filteredCustomers = useMemo(() => {
    if (!customers) return []

    return customers.filter((customer) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase()
        const matchesSearch =
          customer.name.toLowerCase().includes(searchLower) ||
          customer.phone.includes(search)
        if (!matchesSearch) return false
      }

      // Status filter
      if (statusFilter !== 'all' && customer.status !== statusFilter) {
        return false
      }

      return true
    })
  }, [customers, search, statusFilter])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CustomerSearch value="" onChange={() => {}} />
        {showStatusFilter && <StatusFilter value="all" onChange={() => {}} />}
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <CustomerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load customers"
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-4">
      <CustomerSearch value={search} onChange={setSearch} />
      {showStatusFilter && (
        <StatusFilter value={statusFilter} onChange={setStatusFilter} />
      )}

      {filteredCustomers.length === 0 ? (
        customers?.length === 0 ? (
          <EmptyState
            message="No customers yet"
            description="Add your first customer to get started"
            action={{
              label: 'Add Customer',
              onClick: () => router.push('/customers/new'),
            }}
          />
        ) : (
          <EmptyState
            message="No customers found"
            description="Try adjusting your search or filters"
          />
        )
      ) : (
        <div className="space-y-2">
          {filteredCustomers.map((customer) => (
            <CustomerCard key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  )
}
