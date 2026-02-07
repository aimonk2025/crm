'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Loader2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/ui/error-state'
import { EmptyState } from '@/components/ui/empty-state'
import { Badge } from '@/components/ui/badge'
import {
  useCustomFields,
  useCreateCustomField,
  useUpdateCustomField,
  useDeleteCustomField,
} from '@/lib/hooks/use-custom-fields'
import type { CustomField, FieldType } from '@/types/custom-field'

const fieldTypeLabels: Record<FieldType, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  select: 'Dropdown',
}

export function CustomFieldManager() {
  const { data: fields, isLoading, error, refetch } = useCustomFields()
  const createField = useCreateCustomField()
  const updateField = useUpdateCustomField()
  const deleteField = useDeleteCustomField()

  const [showDialog, setShowDialog] = useState(false)
  const [editingField, setEditingField] = useState<CustomField | null>(null)
  const [name, setName] = useState('')
  const [fieldType, setFieldType] = useState<FieldType>('text')
  const [options, setOptions] = useState('')
  const [isRequired, setIsRequired] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<CustomField | null>(null)

  const openCreate = () => {
    setEditingField(null)
    setName('')
    setFieldType('text')
    setOptions('')
    setIsRequired(false)
    setShowDialog(true)
  }

  const openEdit = (field: CustomField) => {
    setEditingField(field)
    setName(field.name)
    setFieldType(field.field_type)
    setOptions(field.options?.join('\n') || '')
    setIsRequired(field.is_required)
    setShowDialog(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const optionsArray = fieldType === 'select'
      ? options.split('\n').map((o) => o.trim()).filter(Boolean)
      : undefined

    try {
      if (editingField) {
        await updateField.mutateAsync({
          id: editingField.id,
          data: {
            name: name.trim(),
            field_type: fieldType,
            options: optionsArray,
            is_required: isRequired,
          },
        })
      } else {
        await createField.mutateAsync({
          name: name.trim(),
          field_type: fieldType,
          options: optionsArray,
          is_required: isRequired,
        })
      }
      setShowDialog(false)
    } catch {
      // Error handled by mutation
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return

    try {
      await deleteField.mutateAsync(deleteConfirm.id)
      setDeleteConfirm(null)
    } catch {
      // Error handled by mutation
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Fields</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load custom fields"
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Custom Fields</CardTitle>
          <Button size="sm" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Add Field
          </Button>
        </CardHeader>
        <CardContent>
          {fields?.length === 0 ? (
            <EmptyState
              message="No custom fields yet"
              description="Create custom fields to capture additional customer information"
              action={{
                label: 'Create Field',
                onClick: openCreate,
              }}
            />
          ) : (
            <div className="space-y-2">
              {fields?.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{field.name}</span>
                        {field.is_required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {fieldTypeLabels[field.field_type]}
                        {field.field_type === 'select' &&
                          field.options &&
                          ` (${field.options.length} options)`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(field)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirm(field)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {editingField ? 'Edit Field' : 'Create Field'}
              </DialogTitle>
              <DialogDescription>
                {editingField
                  ? 'Update the custom field settings.'
                  : 'Create a new custom field for customers.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="field-name">Field Name</Label>
                <Input
                  id="field-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Address, Service Type"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field-type">Field Type</Label>
                <Select
                  value={fieldType}
                  onValueChange={(v) => setFieldType(v as FieldType)}
                >
                  <SelectTrigger id="field-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {fieldType === 'select' && (
                <div className="space-y-2">
                  <Label htmlFor="field-options">Options (one per line)</Label>
                  <textarea
                    id="field-options"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="field-required">Required field</Label>
                <Switch
                  id="field-required"
                  checked={isRequired}
                  onCheckedChange={setIsRequired}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  !name.trim() ||
                  createField.isPending ||
                  updateField.isPending
                }
              >
                {(createField.isPending || updateField.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {editingField ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Custom Field</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteConfirm?.name}&quot;?
              This will also delete all values for this field from all customers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteField.isPending}
            >
              {deleteField.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
