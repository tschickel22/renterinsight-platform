import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export interface CommissionRule {
  id: string
  name: string
  type: 'flat' | 'percentage' | 'tiered'
  value: number
}

interface CommissionRuleFormProps {
  rule?: CommissionRule
  onSave: (rule: Partial<CommissionRule>) => void
  onCancel: () => void
}

export function CommissionRuleForm({ rule, onSave, onCancel }: CommissionRuleFormProps) {
  const [form, setForm] = useState<Partial<CommissionRule>>({
    id: rule?.id || '',
    name: rule?.name || '',
    type: rule?.type || 'flat',
    value: rule?.value || 0
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = () => {
    if (!form.name || form.value == null) return
    onSave(form)
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit' : 'New'} Commission Rule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Rule Name</Label>
            <Input
              name="name"
              value={form.name || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value</Label>
            <Input
              name="value"
              type="number"
              value={form.value || ''}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
