'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateFollowUp } from '@/lib/hooks/use-follow-ups'
import { followUpSchema, type FollowUpFormData } from '@/lib/validations/follow-up'
import { Loader2, CalendarPlus } from 'lucide-react'

interface AddFollowUpDialogProps {
  customerId: string
}

export function AddFollowUpDialog({ customerId }: AddFollowUpDialogProps) {
  const [open, setOpen] = useState(false)
  const createFollowUp = useCreateFollowUp()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      due_date: tomorrow.toISOString().split('T')[0],
      note: '',
    },
  })

  async function onSubmit(data: FollowUpFormData) {
    try {
      await createFollowUp.mutateAsync({
        customer_id: customerId,
        due_date: data.due_date,
        note: data.note,
      })
      toast.success('Follow-up scheduled')
      setOpen(false)
      form.reset()
    } catch {
      toast.error('Failed to schedule follow-up')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <CalendarPlus className="h-4 w-4 mr-1" />
          Add Follow-up
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Follow-up</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="due_date">Date *</Label>
            <Input
              id="due_date"
              type="date"
              {...form.register('due_date')}
            />
            {form.formState.errors.due_date && (
              <p className="text-sm text-destructive">
                {form.formState.errors.due_date.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              placeholder="What to follow up about?"
              rows={2}
              {...form.register('note')}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createFollowUp.isPending}>
              {createFollowUp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
