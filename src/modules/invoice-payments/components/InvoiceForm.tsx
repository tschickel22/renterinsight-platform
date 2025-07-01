import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { X, Save, Plus, Trash2, Receipt, Calendar, DollarSign } from 'lucide-react'
import { Invoice, InvoiceStatus, InvoiceItem } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { useLeadManagement } from '@/modules/crm-prospecting/hooks/useLeadManagement'

interface InvoiceFormProps {
  invoice?: Invoice
  onSave: (invoiceData: Partial<Invoice>) => Promise<void>
  onCancel: () => void
}

export function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const { toast } = useToast()
  const { leads } = useLeadManagement()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Invoice>>({
    customerId: '',
    number: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    status: InvoiceStatus.DRAFT,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    notes: '',
    customFields: {}
  })

  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: '',
    quantity: 1,
    unitPrice: 0,
    total: 0
  })

  const [taxRate, setTaxRate] = useState(0.08) // 8% default tax rate

  // Initialize form with invoice data if editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        dueDate: new Date(invoice.dueDate)
      })
      
      // Extract tax rate from existing invoice
      if (invoice.subtotal > 0) {
        setTaxRate(invoice.tax / invoice.subtotal)
      }
    }
  }, [invoice])

  // Update item total when quantity or unit price changes
  useEffect(() => {
    const quantity = newItem.quantity || 1
    const unitPrice = newItem.unitPrice || 0
    setNewItem(prev => ({
      ...prev,
      total: quantity * unitPrice
    }))
  }, [newItem.quantity, newItem.unitPrice])

  // Calculate totals when items change
  useEffect(() => {
    if (formData.items && formData.items.length > 0) {
      const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
      const tax = subtotal * taxRate
      const total = subtotal + tax
      
      setFormData(prev => ({
        ...prev,
        subtotal,
        tax,
        total
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        subtotal: 0,
        tax: 0,
        total: 0
      }))
    }
  }, [formData.items, taxRate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.customerId || !formData.number || !formData.dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      })
      return
    }

    if (!formData.items || formData.items.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one item to the invoice',
        variant: 'destructive'
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
      toast({
        title: 'Success',
        description: `Invoice ${invoice ? 'updated' : 'created'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${invoice ? 'update' : 'create'} invoice`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    if (!newItem.description || !newItem.unitPrice) {
      toast({
        title: 'Validation Error',
        description: 'Description and unit price are required',
        variant: 'destructive'
      })
      return
    }

    const item: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: newItem.description || '',
      quantity: newItem.quantity || 1,
      unitPrice: newItem.unitPrice || 0,
      total: newItem.total || 0
    }

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), item]
    }))

    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    })
  }

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items?.filter(item => item.id !== itemId) || []
    }))
  }

  const getCustomerName = (customerId: string) => {
    const customer = leads.find(lead => lead.id === customerId)
    return customer ? `${customer.firstName} ${customer.lastName}` : customerId
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{invoice ? 'Edit Invoice' : 'Create Invoice'}</CardTitle>
              <CardDescription>
                {invoice ? 'Update invoice details' : 'Create a new invoice'}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select 
                    value={formData.customerId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.firstName} {lead.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                  <Input
                    id="invoiceNumber"
                    value={formData.number}
                    onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                    placeholder="e.g., INV-2024-001"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate ? new Date(formData.dueDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      dueDate: e.target.value ? new Date(e.target.value) : undefined 
                    }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: InvoiceStatus) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={InvoiceStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={InvoiceStatus.SENT}>Sent</SelectItem>
                      <SelectItem value={InvoiceStatus.VIEWED}>Viewed</SelectItem>
                      <SelectItem value={InvoiceStatus.PAID}>Paid</SelectItem>
                      <SelectItem value={InvoiceStatus.OVERDUE}>Overdue</SelectItem>
                      <SelectItem value={InvoiceStatus.CANCELLED}>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Invoice Items</h3>
                <Button type="button" onClick={addItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Add Item Form */}
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description *</Label>
                      <Input
                        id="description"
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="e.g., Service Labor"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="unitPrice">Unit Price</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItem.unitPrice}
                        onChange={(e) => setNewItem(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-sm font-medium">Total: </span>
                      <span className="font-bold">{formatCurrency(newItem.total || 0)}</span>
                    </div>
                    <Button type="button" onClick={addItem}>
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Items List */}
              <div className="space-y-3">
                {formData.items && formData.items.length > 0 ? (
                  formData.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{item.description}</div>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold">{formatCurrency(item.total)}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No items added yet</p>
                    <p className="text-sm">Add items to this invoice</p>
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Invoice Totals</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={taxRate * 100}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) / 100 || 0)}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(formData.subtotal || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({(taxRate * 100).toFixed(2)}%):</span>
                    <span>{formatCurrency(formData.tax || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(formData.total || 0)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Information</h3>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes about this invoice"
                  rows={3}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {invoice ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {invoice ? 'Update' : 'Create'} Invoice
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