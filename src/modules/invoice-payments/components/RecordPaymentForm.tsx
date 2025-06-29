import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, CreditCard, DollarSign } from 'lucide-react'
import { Payment, PaymentMethod, PaymentStatus } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

interface RecordPaymentFormProps {
  invoiceId: string
  invoiceTotal: number
  remainingBalance: number
  onSave: (paymentData: Partial<Payment>) => Promise<void>
  onCancel: () => void
}

export function RecordPaymentForm({ 
  invoiceId, 
  invoiceTotal, 
  remainingBalance, 
  onSave, 
  onCancel 
}: RecordPaymentFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Payment>>({
    invoiceId,
    amount: remainingBalance,
    method: PaymentMethod.CREDIT_CARD,
    status: PaymentStatus.COMPLETED,
    processedDate: new Date(),
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || formData.amount <= 0) {
      toast({
        title: 'Validation Error',
        description: 'Payment amount must be greater than zero',
        variant: 'destructive'
      })
      return
    }

    if (formData.amount > remainingBalance) {
      toast({
        title: 'Validation Error',
        description: 'Payment amount cannot exceed the remaining balance',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: 'Payment recorded successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record payment',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Record Payment
              </CardTitle>
              <CardDescription>
                Record a payment for invoice #{invoiceId}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Payment Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remainingBalance}
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Remaining balance: {formatCurrency(remainingBalance)}
              </p>
            </div>
            
            <div>
              <Label htmlFor="method">Payment Method *</Label>
              <Select 
                value={formData.method} 
                onValueChange={(value: PaymentMethod) => setFormData(prev => ({ ...prev, method: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.CREDIT_CARD}>Credit Card</SelectItem>
                  <SelectItem value={PaymentMethod.BANK_TRANSFER}>Bank Transfer</SelectItem>
                  <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                  <SelectItem value={PaymentMethod.CHECK}>Check</SelectItem>
                  <SelectItem value={PaymentMethod.FINANCING}>Financing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Payment Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: PaymentStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentStatus.COMPLETED}>Completed</SelectItem>
                  <SelectItem value={PaymentStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={PaymentStatus.PROCESSING}>Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="processedDate">Payment Date *</Label>
              <Input
                id="processedDate"
                type="date"
                value={formData.processedDate ? new Date(formData.processedDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  processedDate: e.target.value ? new Date(e.target.value) : undefined 
                }))}
              />
            </div>
            
            <div>
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={formData.transactionId || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, transactionId: e.target.value }))}
                placeholder="e.g., txn_1234567890"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this payment"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Recording...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Record Payment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}