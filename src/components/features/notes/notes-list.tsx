'use client'

import { formatDistanceToNow } from 'date-fns'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDeleteNote } from '@/lib/hooks/use-notes'
import { toast } from 'sonner'
import type { Note } from '@/types/customer'

interface NotesListProps {
  notes: Note[]
  customerId: string
}

export function NotesList({ notes, customerId }: NotesListProps) {
  const deleteNote = useDeleteNote()

  async function handleDelete(noteId: string) {
    try {
      await deleteNote.mutateAsync({ id: noteId, customerId })
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete note')
    }
  }

  if (notes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        No notes yet
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="group flex gap-3 p-3 rounded-lg bg-muted/50"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm whitespace-pre-wrap">{note.content}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
            onClick={() => handleDelete(note.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  )
}
