'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateNote } from '@/lib/hooks/use-notes'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

interface NoteFormProps {
  customerId: string
}

export function NoteForm({ customerId }: NoteFormProps) {
  const [content, setContent] = useState('')
  const createNote = useCreateNote()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    try {
      await createNote.mutateAsync({ customerId, content: content.trim() })
      setContent('')
      toast.success('Note added')
    } catch {
      toast.error('Failed to add note')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        placeholder="Add a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={2}
        className="resize-none"
        disabled={createNote.isPending}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || createNote.isPending}
        className="shrink-0 self-end"
      >
        {createNote.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  )
}
