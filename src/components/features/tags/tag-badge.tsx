import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Tag } from '@/types/tag'

interface TagBadgeProps {
  tag: Tag
  onRemove?: () => void
  size?: 'sm' | 'md'
  className?: string
}

export function TagBadge({
  tag,
  onRemove,
  size = 'sm',
  className,
}: TagBadgeProps) {
  // Calculate contrasting text color based on background
  const textColor = getContrastColor(tag.color)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
      style={{
        backgroundColor: tag.color,
        color: textColor,
      }}
    >
      {tag.name}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 rounded-full hover:bg-black/10 p-0.5"
        >
          <X className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
        </button>
      )}
    </span>
  )
}

// Calculate whether to use white or black text based on background color
function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '')

  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

interface TagListProps {
  tags: Tag[]
  onRemove?: (tagId: string) => void
  size?: 'sm' | 'md'
  className?: string
}

export function TagList({ tags, onRemove, size = 'sm', className }: TagListProps) {
  if (tags.length === 0) return null

  return (
    <div className={cn('flex flex-wrap gap-1', className)}>
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          tag={tag}
          size={size}
          onRemove={onRemove ? () => onRemove(tag.id) : undefined}
        />
      ))}
    </div>
  )
}
