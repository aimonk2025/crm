'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useTags, useCreateTag } from '@/lib/hooks/use-tags'
import { TagBadge } from './tag-badge'
import type { Tag } from '@/types/tag'

interface TagSelectorProps {
  selectedTags: Tag[]
  onTagsChange: (tags: Tag[]) => void
  className?: string
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  className,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newTagName, setNewTagName] = useState('')

  const { data: allTags = [], isLoading } = useTags()
  const createTag = useCreateTag()

  const selectedIds = new Set(selectedTags.map((t) => t.id))

  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggleTag = (tag: Tag) => {
    if (selectedIds.has(tag.id)) {
      onTagsChange(selectedTags.filter((t) => t.id !== tag.id))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return

    try {
      const newTag = await createTag.mutateAsync({ name: newTagName.trim() })
      onTagsChange([...selectedTags, newTag])
      setNewTagName('')
      setShowCreate(false)
      setSearch('')
    } catch {
      // Error handled by mutation
    }
  }

  return (
    <div className={className}>
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => toggleTag(tag)}
            />
          ))}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed"
            disabled={isLoading}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add tag
            <ChevronsUpDown className="ml-1 h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2">
            <Input
              placeholder="Search tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredTags.length === 0 && !showCreate ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                {search ? (
                  <div>
                    <p>No tags found.</p>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setNewTagName(search)
                        setShowCreate(true)
                      }}
                    >
                      Create &quot;{search}&quot;
                    </Button>
                  </div>
                ) : (
                  <p>No tags yet. Create one!</p>
                )}
              </div>
            ) : (
              filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {selectedIds.has(tag.id) && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Create new tag */}
          {showCreate ? (
            <div className="p-2 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Tag name"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreateTag()
                    }
                  }}
                  className="h-8"
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleCreateTag}
                  disabled={createTag.isPending || !newTagName.trim()}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2"
                  onClick={() => {
                    setShowCreate(false)
                    setNewTagName('')
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start h-8"
                onClick={() => setShowCreate(true)}
              >
                <Plus className="h-3 w-3 mr-2" />
                Create new tag
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}
