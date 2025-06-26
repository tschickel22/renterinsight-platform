import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Commission, CommissionStatus, CommissionType } from '@/types'

interface CommissionModalProps {
  open: boolean
  onClose: () => void
  onSave: (commission: Commission) => void
}

export function CommissionModal({
  open,
  onClose,
  onSave,
}: CommissionModalProps) {
  const { toast } = useToast()

  const [form, setForm] = useState<Partial<Commission>>({
    id: '',
    salesPersonId: '',
    dealId: '',
    amount: 0,
    type: CommissionType.FLAT,
    status: CommissionStatus.PENDING,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }))
  }

  const handleSubmit = () => {
    try {
      if (!form.salesPersonId || !form.dealId || !form.amount) {
        toast({
          title: 'Missing Fields',
          description: 'Salesperson, Deal ID, and Amount are required.',
          variant: 'destructive',
        })
        return
      }

      const newCommission: Commission = {
        id: Math.random().toString(36).substr(2, 9),
        salesPersonId: form.salesPersonId!,
        dealId: form.dealId!,
        amount: form.amount!,
        type: form.type ?? CommissionType.FLAT,
        status: form.status ?? CommissionStatus.PENDING,
        rate: 0,
        notes: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        customFields: {},
      }

      onSave(newCommission)

      toast({ title: 'Commission saved successfully' })
      onClose()
    } catch (error) {
      toast({
        title: 'Error Saving Commission',
        description: 'Something went wrong while saving.',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    if (!open) {
      setForm({
        id: '',
        salesPersonId: '',
        dealId: '',
        amount: 0,
        type: CommissionType.FLAT,
        status: CommissionStatus.PENDING,
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md z-50">
        <DialogHeader>
          <DialogTitle>New Commission</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="salesPersonId">Salesperson ID</Label>
            <Input
              name="salesPersonId"
              value={form.salesPersonId || ''}
              onChange={handleChange}
              placeholder="e.g. SP-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dealId">Deal ID</Label>
            <Input
              name="dealId"
              value={form.dealId || ''}
              onChange={handleChange}
              placeholder="e.g. DL-001"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              name="amount"
              type="number"
              value={form.amount || ''}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
